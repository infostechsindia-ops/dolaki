package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.BuildConfig
import com.example.data.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class AuraMartViewModel(application: Application) : AndroidViewModel(application) {

    private val database = AppDatabase.getDatabase(application)
    private val repository = AuraMartRepository(database.auraMartDao())

    // --- Active App States ---
    val allProducts = repository.allProducts.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val quickCommerceProducts = repository.quickCommerceProducts.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val standardProducts = repository.standardProducts.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val cartItems = repository.cartItems.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val wishlistItems = repository.wishlistItems.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val orders = repository.orders.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val vendors = repository.vendors.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val coupons = repository.coupons.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val wallet = repository.wallet.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // --- Active UI Selection / Filters ---
    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedProduct = MutableStateFlow<Product?>(null)
    val selectedProduct: StateFlow<Product?> = _selectedProduct.asStateFlow()

    // --- Instant Market Location & Darkstore State ---
    private val _currentLocation = MutableStateFlow("HSR Sector 6, Bangalore")
    val currentLocation: StateFlow<String> = _currentLocation.asStateFlow()

    private val _currentDarkstore = MutableStateFlow("Darkstore #14")
    val currentDarkstore: StateFlow<String> = _currentDarkstore.asStateFlow()

    private val _estimatedMins = MutableStateFlow(12)
    val estimatedMins: StateFlow<Int> = _estimatedMins.asStateFlow()

    fun updateLocation(location: String, darkstore: String, minutes: Int) {
        _currentLocation.value = location
        _currentDarkstore.value = darkstore
        _estimatedMins.value = minutes
    }

    // --- Live Navigation Mode ---
    // Screens: "Home", "Categories", "QuickCommerce", "Wishlist", "Profile", "Search", "Detail", "Checkout", "OrderTracking"
    val hashRouter = com.example.ui.navigation.HashRouter()
    val currentScreen: StateFlow<String> = hashRouter.currentScreenFlow(viewModelScope)

    // --- Role Simulation Mode: "Customer", "Vendor", "Admin" ---
    private val _userRole = MutableStateFlow("Customer")
    val userRole: StateFlow<String> = _userRole.asStateFlow()

    // --- Coupon & Cart Calculations ---
    private val _appliedCoupon = MutableStateFlow<Coupon?>(null)
    val appliedCoupon: StateFlow<Coupon?> = _appliedCoupon.asStateFlow()

    // --- AI Assistant Chat Message Lists ---
    // Message Pair: Sender ("user" / "ai") to Text
    private val _aiChatHistory = MutableStateFlow<List<Pair<String, String>>>(listOf(
        "ai" to "Welcome to AuraMart, I am your Gen-Z AI shopping partner! ⚡ Ask me anything, or describe what vibe you are looking for!"
    ))
    val aiChatHistory: StateFlow<List<Pair<String, String>>> = _aiChatHistory.asStateFlow()

    private val _aiLoading = MutableStateFlow(false)
    val aiLoading: StateFlow<Boolean> = _aiLoading.asStateFlow()

    // --- Active Order Tracking ---
    private val _activeOrderId = MutableStateFlow<Int?>(null)
    val activeOrderId: StateFlow<Int?> = _activeOrderId.asStateFlow()

    val activeOrder: StateFlow<Order?> = _activeOrderId.flatMapLatest { id ->
        if (id == null) flowOf(null)
        else orders.map { list -> list.find { it.id == id } }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // --- Scratch Cards & Games ---
    private val _spinWheelResult = MutableStateFlow<String?>(null)
    val spinWheelResult: StateFlow<String?> = _spinWheelResult.asStateFlow()

    init {
        viewModelScope.launch {
            repository.initializePrepopulatedDataIfNeeded()
        }
    }

    // --- Screen Control Actions ---
    fun navigateTo(screen: String) {
        hashRouter.navigateTo(screen)
    }

    fun popBack(): Boolean {
        return hashRouter.popBack()
    }

    fun selectProduct(product: Product) {
        _selectedProduct.value = product
        navigateTo("Detail")
    }

    fun setCategory(category: String) {
        _selectedCategory.value = category
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun switchRole(role: String) {
        _userRole.value = role
    }

    // --- Database Operations ---
    fun toggleWishlist(productId: Int) {
        viewModelScope.launch {
            repository.toggleWishlist(productId)
        }
    }

    fun addToCart(product: Product, color: String = "", size: String = "") {
        viewModelScope.launch {
            val finalColor = if (color.isEmpty()) {
                val colors = JSONArray(product.colorsJson)
                if (colors.length() > 0) colors.getString(0) else "Default"
            } else color

            val finalSize = if (size.isEmpty()) {
                val sizes = JSONArray(product.sizesJson)
                if (sizes.length() > 0) sizes.getString(0) else "Default"
            } else size

            repository.addToCart(product.id, finalColor, finalSize)
        }
    }

    fun incrementCart(item: CartItem) {
        viewModelScope.launch {
            repository.updateCartQuantity(item.productId, item.quantity + 1, item.selectedColor, item.selectedSize)
        }
    }

    fun decrementCart(item: CartItem) {
        viewModelScope.launch {
            repository.updateCartQuantity(item.productId, item.quantity - 1, item.selectedColor, item.selectedSize)
        }
    }

    fun removeFromCart(productId: Int) {
        viewModelScope.launch {
            repository.removeFromCart(productId)
        }
    }

    // --- Checkout & Orders ---
    fun applyCouponCode(code: String): Boolean {
        val couponList = coupons.value
        val match = couponList.find { it.code.equals(code, ignoreCase = true) && !it.isRedeemed }
        return if (match != null) {
            _appliedCoupon.value = match
            true
        } else {
            false
        }
    }

    fun clearAppliedCoupon() {
        _appliedCoupon.value = null
    }

    fun submitCheckout(address: String, paymentMethod: String, total: Double, itemsSummary: String, isQuick: Boolean) {
        viewModelScope.launch {
            val deliveryMin = if (isQuick) (10..20).random() else (25..45).random()
            val orderId = repository.placeOrder(
                totalAmount = total,
                deliveryAddress = address,
                paymentMethod = paymentMethod,
                itemsSummary = itemsSummary,
                deliveryMinutes = deliveryMin
            )

            // Deduct from wallet if wallet payment method
            if (paymentMethod == "Aura Wallet") {
                val currentWallet = wallet.value
                if (currentWallet != null) {
                    val newBal = (currentWallet.balance - total).coerceAtLeast(0.0)
                    val newPoints = currentWallet.rewardPoints + (total * 0.05).toInt()
                    repository.updateWallet(newBal, newPoints)
                }
            }

            // Mark coupon as redeemed if one was used
            _appliedCoupon.value?.let {
                repository.redeemCoupon(it.code)
                _appliedCoupon.value = null
            }

            // Clear items from cart
            repository.clearCart()

            // Navigate to tracking
            _activeOrderId.value = orderId
            navigateTo("OrderTracking")

            // Fire up active order tracking worker simulation
            simulateLiveTracking(orderId)
        }
    }

    private fun simulateLiveTracking(orderId: Int) {
        viewModelScope.launch {
            // Steps: Placed -> Preparing -> Shipped -> Out for Delivery -> Delivered
            val states = listOf("Placed", "Preparing", "Shipped", "Out for Delivery", "Delivered")
            for (state in states) {
                delay(8000) // 8 seconds per status update transition
                repository.updateOrderStatus(orderId, state)
            }
        }
    }

    // --- Custom Gamification ---
    fun spinWheel() {
        viewModelScope.launch {
            val options = listOf("Flat ₹50 Aura Cashback", "100 Reward Points", "Free Delivery Coupon", "Flat 10% Off Coupon", "Try Again Tomorrow")
            val selected = options.random()
            _spinWheelResult.value = selected

            // Credit the reward dynamically to local DB!
            val currWallet = wallet.value ?: UserWallet()
            when (selected) {
                "Flat ₹50 Aura Cashback" -> {
                    repository.updateWallet(currWallet.balance + 50.0, currWallet.rewardPoints)
                }
                "100 Reward Points" -> {
                    repository.updateWallet(currWallet.balance, currWallet.rewardPoints + 100)
                }
                "Free Delivery Coupon" -> {
                    repository.insertCoupon(Coupon(code = "FREEDEL", description = "Free Quick Commerce Delivery on all items.", discountPercent = 100))
                }
                "Flat 10% Off Coupon" -> {
                    repository.insertCoupon(Coupon(code = "SPIN10", description = "Flat 10% Off Coupon gained from Aura Wheel.", discountPercent = 10) )
                }
            }
        }
    }

    fun clearSpinResult() {
        _spinWheelResult.value = null
    }

    fun trackOrder(orderId: Int) {
        _activeOrderId.value = orderId
        navigateTo("OrderTracking")
    }

    // --- Multi-Vendor & Admin Panel Integrations (Dynamics) ---
    fun vendorAddProduct(title: String, desc: String, price: Double, category: String, brand: String, isQuick: Boolean) {
        viewModelScope.launch {
            val p = Product(
                title = title,
                description = desc,
                price = price,
                originalPrice = price * 1.25,
                imageUrl = if (category == "Fashion") "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400"
                           else if (category == "Beauty") "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400"
                           else "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                category = category,
                subCategory = "Vendor Exclusive",
                brand = brand,
                vendorId = 2, // Map to Vogue Couture India for simulation
                rating = 4.8f,
                reviewCount = 1,
                colorsJson = "[\"Standard Variant\"]",
                sizesJson = "[\"Regular\"]",
                isQuickCommerce = isQuick
            )
            repository.insertProduct(p)
        }
    }

    fun adminToggleFlashSale(productId: Int, active: Boolean) {
        viewModelScope.launch {
            val list = allProducts.value
            val match = list.find { it.id == productId }
            if (match != null) {
                repository.insertProduct(match.copy(isFlashSale = active))
            }
        }
    }

    // --- AI Assistant with Gemini REST API Integration ---
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    fun sendAiAssistantMessage(userPrompt: String) {
        if (userPrompt.isBlank()) return

        // Save user message
        val currentHistory = _aiChatHistory.value.toMutableList()
        currentHistory.add("user" to userPrompt)
        _aiChatHistory.value = currentHistory

        _aiLoading.value = true

        viewModelScope.launch(Dispatchers.IO) {
            val apiKey = BuildConfig.GEMINI_API_KEY
            var aiResponse = ""

            // Strict fallback logic matching guidelines:
            // If the user has a real key, use Direct REST API. Otherwise, generate robust local smart responses.
            if (apiKey.isNotEmpty() && apiKey != "MY_GEMINI_API_KEY") {
                try {
                    val productsContext = allProducts.value.joinToString("\n") {
                        "- ${it.title} (${it.category}): ₹${it.price} [Brand: ${it.brand}, Rating: ${it.rating}]"
                    }

                    val systemInstruction = "You are Aura, a modern, highly helpful Gen-Z AI Personal Shopping Assistant for AuraMart marketplace in India. " +
                            "Use a helpful, energetic, and slightly stylish vocabulary (with cool words, occasional emojis). Always suggest real relevant products from our dynamic catalog below based on user preference, with prices in ₹. If you are asked to suggest an item not in our catalog, suggest a close match or tell them about our customizable vendor order pipeline.\n\n" +
                            "Our Available Products Catalog:\n$productsContext"

                    val jsonRequest = JSONObject().apply {
                        put("contents", JSONArray().apply {
                            put(JSONObject().apply {
                                put("parts", JSONArray().apply {
                                    put(JSONObject().apply {
                                        put("text", userPrompt)
                                    })
                                })
                            })
                        })
                        put("systemInstruction", JSONObject().apply {
                            put("parts", JSONArray().apply {
                                put(JSONObject().apply {
                                    put("text", systemInstruction)
                                })
                            })
                        })
                    }

                    val mediaType = "application/json; charset=utf-8".toMediaType()
                    val requestBody = jsonRequest.toString().toRequestBody(mediaType)
                    val request = Request.Builder()
                        .url("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey")
                        .post(requestBody)
                        .build()

                    client.newCall(request).execute().use { response ->
                        if (response.isSuccessful) {
                            val responseBodyString = response.body?.string() ?: ""
                            val jsonResponse = JSONObject(responseBodyString)
                            val candidates = jsonResponse.getJSONArray("candidates")
                            val content = candidates.getJSONObject(0).getJSONObject("content")
                            val parts = content.getJSONArray("parts")
                            aiResponse = parts.getJSONObject(0).getString("text")
                        } else {
                            aiResponse = "Oops, Gemini endpoint gave me a response code: ${response.code}. Let me check my connection!"
                        }
                    }
                } catch (e: Exception) {
                    aiResponse = "I hit a little networking wave 🌊 but don't worry! I'll give you my offline Aura Smart Suggestion: Based on your query, check out the *Nothing Phone (2a)* (₹23,999) under Electronics or our gorgeous custom *AuraSound Cosmic Pods Pro* (₹3,499) which are trending with Gen-Z!"
                }
            } else {
                // Generative local matching for offline/no key scenario
                delay(1200) // Simulate typing delay
                val lower = userPrompt.lowercase()
                aiResponse = when {
                    lower.contains("phone") || lower.contains("nothing") || lower.contains("mobile") -> {
                        "Yo! You should definitely check out the **Nothing Phone (2a) - Milk Edition** (₹23,999). It is literally a visual masterpiece with dual 50MP cameras and glyph lights. Find it in our Electronics catalog! 📱"
                    }
                    lower.contains("sound") || lower.contains("earbud") || lower.contains("music") || lower.contains("sony") -> {
                        "For premium acoustics, we have the **Sony WH-1000XM5 ANC Headphones** (₹29,990) with industry-leading noise cancel, or our exclusive **AuraSound Cosmic Pods Pro** (₹3,499) with active noise cancel and transparent cyber styling! 🎧✨"
                    }
                    lower.contains("fashion") || lower.contains("wear") || lower.contains("dress") || lower.contains("clothe") || lower.contains("ethnic") -> {
                        "Our curated fashion is looking so clean! You can grab the premium **Sabyasachi Heritage Kurta Set** (₹18,500) for traditional luxury vibes, or keeping it retro casual with the **Zara Oversized Corduroy Shirt** (₹2,999)! 👗🔥"
                    }
                    lower.contains("milk") || lower.contains("mango") || lower.contains("grocery") || lower.contains("food") || lower.contains("snack") -> {
                        "If you need instant delivery, hop over to our **⚡ Quick Commerce** tab! We can send you **Country Delight Buffalo Milk** (₹80) or **Organic Alphonso Mangoes** (₹249) in under 12 minutes flat! 🥛🥭💨"
                    }
                    lower.contains("coupon") || lower.contains("discount") || lower.contains("offer") || lower.contains("deal") -> {
                        "Ooh, let me hook you up! Use code **AURA20** for flat 20% off during checkout! Also, check our **Daily Rewards** section on the Profile page to spin the wheel for premium drops! 🎁⚡"
                    }
                    else -> {
                        "I love that request! Based on Aura's trending radar, our members are loving the **AuraSound Cosmic Pods** (₹3,499) and the glowing **Nothing Phone (2a)**! Would you like me to add one of these premium picks to your wishlist? 💫"
                    }
                }
            }

            _aiLoading.value = false
            val updatedHistory = _aiChatHistory.value.toMutableList()
            updatedHistory.add("ai" to aiResponse)
            _aiChatHistory.value = updatedHistory
        }
    }
}
