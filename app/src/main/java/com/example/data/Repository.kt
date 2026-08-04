package com.example.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AuraMartRepository(private val dao: AuraMartDao) {

    val allProducts: Flow<List<Product>> = dao.getAllProducts()
    val quickCommerceProducts: Flow<List<Product>> = dao.getProductsByQuickCommerce(true)
    val standardProducts: Flow<List<Product>> = dao.getProductsByQuickCommerce(false)
    val cartItems: Flow<List<CartItem>> = dao.getCartItems()
    val wishlistItems: Flow<List<WishlistItem>> = dao.getWishlistItems()
    val orders: Flow<List<Order>> = dao.getOrders()
    val vendors: Flow<List<Vendor>> = dao.getVendors()
    val coupons: Flow<List<Coupon>> = dao.getCoupons()
    val wallet: Flow<UserWallet?> = dao.getWallet()

    fun getProductsByCategory(category: String): Flow<List<Product>> = dao.getProductsByCategory(category)
    fun getProductById(id: Int): Flow<Product?> = dao.getProductById(id)
    fun searchProducts(query: String): Flow<List<Product>> = dao.searchProducts(query)
    fun getProductsByVendor(vendorId: Int): Flow<List<Product>> = dao.getProductsByVendor(vendorId)
    fun getVendorById(id: Int): Flow<Vendor?> = dao.getVendorById(id)
    fun isWishlisted(productId: Int): Flow<Boolean> = dao.isWishlisted(productId)

    suspend fun insertProduct(product: Product) = withContext(Dispatchers.IO) {
        dao.insertProduct(product)
    }

    suspend fun deleteProduct(product: Product) = withContext(Dispatchers.IO) {
        dao.deleteProduct(product)
    }

    suspend fun addToCart(productId: Int, color: String, size: String) = withContext(Dispatchers.IO) {
        dao.insertCartItem(CartItem(productId, 1, color, size))
    }

    suspend fun updateCartQuantity(productId: Int, quantity: Int, color: String, size: String) = withContext(Dispatchers.IO) {
        if (quantity <= 0) {
            dao.deleteCartItem(CartItem(productId, 0, color, size))
        } else {
            dao.insertCartItem(CartItem(productId, quantity, color, size))
        }
    }

    suspend fun removeFromCart(productId: Int) = withContext(Dispatchers.IO) {
        dao.deleteCartItem(CartItem(productId, 0, "", ""))
    }

    suspend fun clearCart() = withContext(Dispatchers.IO) {
        dao.clearCart()
    }

    suspend fun toggleWishlist(productId: Int) = withContext(Dispatchers.IO) {
        val list = dao.getWishlistItems().firstOrNull() ?: emptyList()
        if (list.any { it.productId == productId }) {
            dao.deleteWishlistItem(productId)
        } else {
            dao.insertWishlistItem(WishlistItem(productId))
        }
    }

    suspend fun placeOrder(
        totalAmount: Double,
        deliveryAddress: String,
        paymentMethod: String,
        itemsSummary: String,
        deliveryMinutes: Int
    ): Int = withContext(Dispatchers.IO) {
        val otp = (1000..9999).random().toString()
        val order = Order(
            timestamp = System.currentTimeMillis(),
            status = "Placed",
            totalAmount = totalAmount,
            deliveryAddress = deliveryAddress,
            paymentMethod = paymentMethod,
            verificationOtp = otp,
            itemsSummary = itemsSummary,
            deliveryMinutes = deliveryMinutes
        )
        dao.insertOrder(order).toInt()
    }

    suspend fun updateOrderStatus(orderId: Int, status: String) = withContext(Dispatchers.IO) {
        dao.updateOrderStatus(orderId, status)
    }

    suspend fun redeemCoupon(code: String) = withContext(Dispatchers.IO) {
        dao.redeemCoupon(code)
    }

    suspend fun updateWallet(balance: Double, rewardPoints: Int) = withContext(Dispatchers.IO) {
        dao.updateWallet(balance, rewardPoints)
    }

    suspend fun insertCoupon(coupon: Coupon) = withContext(Dispatchers.IO) {
        dao.insertCoupon(coupon)
    }

    suspend fun initializePrepopulatedDataIfNeeded() = withContext(Dispatchers.IO) {
        // Only seed if vendors/products tables are empty
        val existingVendors = dao.getVendors().firstOrNull() ?: emptyList()
        if (existingVendors.isEmpty()) {
            val defaultVendors = listOf(
                Vendor(1, "Aura Prime Studio", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=120", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600", 4.9f, true, 4.9f, 5, "Official AuraMart Brand"),
                Vendor(2, "Vogue Couture India", "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=120", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600", 4.7f, true, 4.6f, 4, "Premium Partner"),
                Vendor(3, "Naturals Beauty Hub", "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=120", "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600", 4.8f, true, 4.8f, 4, "Authorized Reseller"),
                Vendor(4, "FutureTech Digital", "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=120", "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600", 4.5f, false, 4.2f, 3, "Standard Vendor"),
                Vendor(5, "SuperMart Darkstore #14", "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=120", "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600", 4.9f, true, 4.9f, 5, "Instant Commerce Hub")
            )
            dao.insertVendors(defaultVendors)

            val defaultProducts = listOf(
                // --- Electronics (Standard) ---
                Product(
                    title = "Nothing Phone (2a) - Milk Edition",
                    description = "A visual masterpiece designed for Gen-Z. Built with high contrast Glyph Interface, dual 50 MP camera system, MediaTek Dimensity 7200 Pro, and 120Hz flexible AMOLED display.",
                    price = 23999.00,
                    originalPrice = 25999.00,
                    imageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400", // Phone proxy
                    category = "Electronics",
                    subCategory = "Mobile Phones",
                    brand = "Nothing",
                    vendorId = 4,
                    rating = 4.7f,
                    reviewCount = 1432,
                    isTrending = true,
                    colorsJson = "[\"Milk\", \"Dark Gray\"]",
                    sizesJson = "[\"8GB + 128GB\", \"12GB + 256GB\"]"
                ),
                Product(
                    title = "Sony WH-1000XM5 ANC Headphones",
                    description = "Industry leading noise canceling with Auto NC Optimizer. Stunning sound quality with Integrated Processor V1, 30-hour battery life with quick charging.",
                    price = 29990.00,
                    originalPrice = 34990.00,
                    imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                    category = "Electronics",
                    subCategory = "Audio",
                    brand = "Sony",
                    vendorId = 4,
                    rating = 4.8f,
                    reviewCount = 988,
                    isFlashSale = true,
                    colorsJson = "[\"Silver\", \"Midnight Black\"]",
                    sizesJson = "[\"Standard\"]"
                ),
                Product(
                    title = "AuraSound Cosmic Pods Pro",
                    description = "AuraMart's official premium active noise canceling earbuds. 32dB smart noise cancellation, dual dynamic drivers, custom space styling with translucent case.",
                    price = 3499.00,
                    originalPrice = 5999.00,
                    imageUrl = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
                    category = "Electronics",
                    subCategory = "Audio",
                    brand = "AuraSound",
                    vendorId = 1,
                    rating = 4.6f,
                    reviewCount = 310,
                    isTrending = true,
                    colorsJson = "[\"Translucent White\", \"Cosmic Black\"]",
                    sizesJson = "[\"Standard\"]"
                ),

                // --- Fashion (Standard) ---
                Product(
                    title = "Sabyasachi Heritage Kurta Set",
                    description = "An exquisite silk heritage kurta set with hand-embroidered tilla details. True luxury crafted by Indian master artisans for premium festive experiences.",
                    price = 18500.00,
                    originalPrice = 22000.00,
                    imageUrl = "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", // Ethnic proxy
                    category = "Fashion",
                    subCategory = "Ethnic Wear",
                    brand = "Sabyasachi",
                    vendorId = 2,
                    rating = 4.9f,
                    reviewCount = 56,
                    colorsJson = "[\"Crimson Red\", \"Royal Gold\"]",
                    sizesJson = "[\"S\", \"M\", \"L\", \"XL\"]"
                ),
                Product(
                    title = "Zara Oversized Corduroy Shirt",
                    description = "Relaxed-fit overshirt featuring a lapel collar, long sleeves with buttoned cuffs, chest patch pocket and a button-up front. Retro streetwear appeal.",
                    price = 2999.00,
                    originalPrice = 3999.00,
                    imageUrl = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
                    category = "Fashion",
                    subCategory = "Casual Shirts",
                    brand = "Zara",
                    vendorId = 2,
                    rating = 4.4f,
                    reviewCount = 560,
                    isTrending = true,
                    colorsJson = "[\"Sage Green\", \"Mustard Yellow\", \"Dusty Pink\"]",
                    sizesJson = "[\"S\", \"M\", \"L\"]"
                ),
                Product(
                    title = "Biba Festive Embroidered Anarkali",
                    description = "Three-piece suit set in breathable premium georgette fabric. Intricate metallic foil print and high-neck embroidery, complete with matching dupatta.",
                    price = 4500.00,
                    originalPrice = 6999.00,
                    imageUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
                    category = "Fashion",
                    subCategory = "Ethnic Wear",
                    brand = "Biba",
                    vendorId = 2,
                    rating = 4.5f,
                    reviewCount = 184,
                    colorsJson = "[\"Emerald Green\", \"Teal\"]",
                    sizesJson = "[\"M\", \"L\", \"XL\"]"
                ),

                // --- Beauty (Standard) ---
                Product(
                    title = "Laneige Water Sleeping Mask",
                    description = "Intensively hydrating overnight mask with squalane and Probiotic-Derived Complex. Brightens skin and locks in deep moisture while you sleep.",
                    price = 2100.00,
                    originalPrice = 2300.00,
                    imageUrl = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
                    category = "Beauty",
                    subCategory = "Skincare",
                    brand = "Laneige",
                    vendorId = 3,
                    rating = 4.8f,
                    reviewCount = 1205,
                    isTrending = true,
                    colorsJson = "[\"Original Blue\"]",
                    sizesJson = "[\"70ml\"]"
                ),
                Product(
                    title = "Forest Essentials Tejasvi Facial Ubtan",
                    description = "A traditional Ayurvedic formulation of fresh herbs and nutrient-rich grains. Restores youthful radiance and deep cleanses skin naturally.",
                    price = 1195.00,
                    originalPrice = 1195.00,
                    imageUrl = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400",
                    category = "Beauty",
                    subCategory = "Skincare",
                    brand = "Forest Essentials",
                    vendorId = 3,
                    rating = 4.9f,
                    reviewCount = 230,
                    colorsJson = "[\"Natural Glow\"]",
                    sizesJson = "[\"50g\"]"
                ),

                // --- Quick Commerce Products (10-30 min Delivery) ---
                Product(
                    title = "Country Delight Buffalo Milk (1L)",
                    description = "Fresh and pure buffalo milk delivered directly from local farms. Full-cream milk, ideal for thick homemade curd and delicious tea/coffee.",
                    price = 80.00,
                    originalPrice = 85.00,
                    imageUrl = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", // Milk proxy
                    category = "Quick Commerce",
                    subCategory = "Dairy",
                    brand = "Country Delight",
                    vendorId = 5,
                    rating = 4.9f,
                    reviewCount = 2350,
                    isTrending = true,
                    deliveryMinutes = 11,
                    colorsJson = "[\"Fresh Pack\"]",
                    sizesJson = "[\"1 Litre\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Organic Alphonso Mangoes (1kg)",
                    description = "Premium handpicked organic Alphonso mangoes from Devgad. Rich golden yellow skin, fiberless aromatic pulp, incredibly sweet flavor.",
                    price = 249.00,
                    originalPrice = 349.00,
                    imageUrl = "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", // Mango proxy
                    category = "Quick Commerce",
                    subCategory = "Fruits & Veggies",
                    brand = "Aura Fresh",
                    vendorId = 5,
                    rating = 4.8f,
                    reviewCount = 142,
                    isFlashSale = true,
                    deliveryMinutes = 13,
                    colorsJson = "[\"Alphonso\"]",
                    sizesJson = "[\"1 kg (approx 4-5 pcs)\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Lay's India's Magic Masala (Bundle)",
                    description = "Crunchy chips seasoned with premium Indian spices. Buy 1 Get 1 promotional bundle, perfect for dynamic movie nights or quick snacking.",
                    price = 20.00,
                    originalPrice = 40.00,
                    imageUrl = "https://images.unsplash.com/photo-1566478989037-eec170784d22?w=400", // Chips proxy
                    category = "Quick Commerce",
                    subCategory = "Snacks",
                    brand = "Lay's",
                    vendorId = 5,
                    rating = 4.6f,
                    reviewCount = 5900,
                    deliveryMinutes = 10,
                    colorsJson = "[\"Blue Magic\"]",
                    sizesJson = "[\"50g Pack x 2\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Dettol Antiseptic Liquid (100ml)",
                    description = "An absolute household emergency essential. Provides highly trusted protection against germs, perfect for wound cleansing and personal hygiene.",
                    price = 85.00,
                    originalPrice = 85.00,
                    imageUrl = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400", // First-aid proxy
                    category = "Quick Commerce",
                    subCategory = "Emergency",
                    brand = "Dettol",
                    vendorId = 5,
                    rating = 4.9f,
                    reviewCount = 8900,
                    deliveryMinutes = 12,
                    colorsJson = "[\"Original\"]",
                    sizesJson = "[\"100 ml\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Amul Taaza Homogenised Milk (500ml)",
                    description = "Fresh homogenised milk from Amul. Perfect consistency, high safety packaging, doesn't require boiling before consumption.",
                    price = 28.00,
                    originalPrice = 28.00,
                    imageUrl = "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
                    category = "Quick Commerce",
                    subCategory = "Dairy",
                    brand = "Amul",
                    vendorId = 5,
                    rating = 4.7f,
                    reviewCount = 9800,
                    deliveryMinutes = 10,
                    colorsJson = "[\"Taaza\"]",
                    sizesJson = "[\"500 ml\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Fresh Organic Bananas (Yelakki)",
                    description = "Yelakki bananas are highly sweet, small sized and loaded with instant energy. Sourced daily from farms under clean environments.",
                    price = 55.00,
                    originalPrice = 70.00,
                    imageUrl = "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
                    category = "Quick Commerce",
                    subCategory = "Fruits & Veggies",
                    brand = "Aura Fresh",
                    vendorId = 5,
                    rating = 4.8f,
                    reviewCount = 1200,
                    deliveryMinutes = 15,
                    colorsJson = "[\"Yellow Yelakki\"]",
                    sizesJson = "[\"500g (approx 6-8 pcs)\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Classmate A4 Notebooks (Set of 4)",
                    description = "High-quality bright white pages, perfectly bound. Essential stationery for students and office use.",
                    price = 180.00,
                    originalPrice = 200.00,
                    imageUrl = "https://images.unsplash.com/photo-1531346878377-3e5f29d2f216?w=400",
                    category = "Quick Commerce",
                    subCategory = "Stationery",
                    brand = "Classmate",
                    vendorId = 5,
                    rating = 4.6f,
                    reviewCount = 500,
                    deliveryMinutes = 10,
                    colorsJson = "[\"Assorted\"]",
                    sizesJson = "[\"172 Pages each\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Pedigree Adult Dog Food (Meat & Rice)",
                    description = "Complete and balanced nutrition with antioxidant blend. Keeps your pet healthy and active.",
                    price = 320.00,
                    originalPrice = 350.00,
                    imageUrl = "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                    category = "Quick Commerce",
                    subCategory = "Pet Care",
                    brand = "Pedigree",
                    vendorId = 5,
                    rating = 4.8f,
                    reviewCount = 2100,
                    deliveryMinutes = 14,
                    colorsJson = "[\"Original\"]",
                    sizesJson = "[\"1.2 kg\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Nivea Men Fresh Active Deodorant",
                    description = "Long lasting freshness with ocean extracts. Dermatologically proven skin tolerance.",
                    price = 199.00,
                    originalPrice = 220.00,
                    imageUrl = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400",
                    category = "Quick Commerce",
                    subCategory = "Personal Care",
                    brand = "Nivea",
                    vendorId = 5,
                    rating = 4.5f,
                    reviewCount = 3400,
                    deliveryMinutes = 12,
                    colorsJson = "[\"Fresh Active\"]",
                    sizesJson = "[\"150 ml\"]",
                    isQuickCommerce = true
                ),
                Product(
                    title = "Coca-Cola Zero Sugar (Pack of 6)",
                    description = "The classic taste of Coca-Cola with zero sugar and zero calories. Best served ice cold.",
                    price = 240.00,
                    originalPrice = 240.00,
                    imageUrl = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
                    category = "Quick Commerce",
                    subCategory = "Cold Drinks",
                    brand = "Coca-Cola",
                    vendorId = 5,
                    rating = 4.7f,
                    reviewCount = 4200,
                    deliveryMinutes = 9,
                    colorsJson = "[\"Zero Sugar\"]",
                    sizesJson = "[\"330 ml x 6\"]",
                    isQuickCommerce = true
                ),

                // --- Home & Living (Standard) ---
                Product(
                    title = "Aura Ambient Sunset Projection Lamp",
                    description = "Transform your bedroom into a dreamy Martian sunset. Built with high-transparency crystal lens, 360-degree rotating projection, and smart vibe controls.",
                    price = 1299.00,
                    originalPrice = 1999.00,
                    imageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
                    category = "Home & Living",
                    subCategory = "Lighting",
                    brand = "Aura Home",
                    vendorId = 1,
                    rating = 4.8f,
                    reviewCount = 145,
                    isTrending = true,
                    colorsJson = "[\"Martian Sunset\", \"Cosmic Blue\"]",
                    sizesJson = "[\"Standard\"]"
                ),
                Product(
                    title = "Cyberpunk RGB LED Acrylic Desk Organizer",
                    description = "De-clutter your battlefield in futuristic fashion. Features custom edge-lit acrylic slots, 16 million RGB gradient colors with dynamic sound sync.",
                    price = 1899.00,
                    originalPrice = 2499.00,
                    imageUrl = "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
                    category = "Home & Living",
                    subCategory = "Desk Decor",
                    brand = "Aura Home",
                    vendorId = 1,
                    rating = 4.7f,
                    reviewCount = 92,
                    isFlashSale = true,
                    colorsJson = "[\"Cyberpunk Orange\", \"Neon Purple\"]",
                    sizesJson = "[\"Regular\"]"
                ),
                Product(
                    title = "Cozy Knit Heavy Cable Throw Blanket",
                    description = "Wrap yourself in absolute comfort. Beautifully woven chunky yarn throw, perfect for Netflix sessions, winter vibes, and luxury aesthetic lounge layers.",
                    price = 2499.00,
                    originalPrice = 3499.00,
                    imageUrl = "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400",
                    category = "Home & Living",
                    subCategory = "Bedding",
                    brand = "Vogue Home",
                    vendorId = 2,
                    rating = 4.9f,
                    reviewCount = 210,
                    colorsJson = "[\"Oatmeal Beige\", \"Slate Gray\"]",
                    sizesJson = "[\"L (150x200cm)\"]"
                ),
                Product(
                    title = "The Pragmatic Programmer: Aura Edition",
                    description = "One of the most significant books in software development. Filled with classic advice on career, architecture, and coding mastery, customized with Aura digital insights.",
                    price = 699.00,
                    originalPrice = 899.00,
                    imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
                    category = "Books",
                    subCategory = "Software",
                    brand = "Aura Press",
                    vendorId = 1,
                    rating = 4.9f,
                    reviewCount = 340,
                    colorsJson = "[\"Default\"]",
                    sizesJson = "[\"Paperback\", \"Hardcover\"]"
                ),
                Product(
                    title = "Carbon Fiber Pro Tennis Racket",
                    description = "Super-lightweight carbon fiber design engineered for elite power and precision spins. Ideal for advanced tournament plays and lifestyle tennis sports.",
                    price = 8499.00,
                    originalPrice = 11999.00,
                    imageUrl = "https://images.unsplash.com/photo-1617083934386-5727db681920?w=400",
                    category = "Sports",
                    subCategory = "Tennis",
                    brand = "Vogue Sports",
                    vendorId = 2,
                    rating = 4.8f,
                    reviewCount = 108,
                    colorsJson = "[\"Matte Black\", \"Neon Lime\"]",
                    sizesJson = "[\"Standard Grip\"]"
                ),
                Product(
                    title = "Super-Silent High-Speed Blender 1200W",
                    description = "Ultra-powerful 1200W blending system with vacuum-seal technology to preserve fresh nutrients. Operates at a super-silent whisper decibel range.",
                    price = 4999.00,
                    originalPrice = 6499.00,
                    imageUrl = "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=400",
                    category = "Appliances",
                    subCategory = "Kitchen",
                    brand = "Aura Home",
                    vendorId = 1,
                    rating = 4.7f,
                    reviewCount = 156,
                    colorsJson = "[\"Chrome Silver\", \"Piano Black\"]",
                    sizesJson = "[\"Standard (1.8L)\"]"
                )
            )
            dao.insertProducts(defaultProducts)
 
            val defaultCoupons = listOf(
                Coupon(1, "AURA20", "Save 20% on any order! Maximum discount ₹200.", 20),
                Coupon(2, "ZEPTO100", "Get flat ₹100 off on your first Quick Commerce order of ₹299+.", 15),
                Coupon(3, "FESTIVE30", "Celebrate the season with flat 30% off across Fashion & Beauty.", 30)
            )
            dao.insertCoupons(defaultCoupons)
 
            // Seed user wallet if empty
            val walletState = dao.getWallet().firstOrNull()
            if (walletState == null) {
                dao.insertWallet(UserWallet(1, 1000.0, 150)) // Seed 1000 INR and 150 points
            }
        } else {
            // If DB already exists, check specifically for the "Home & Living" category to avoid missing it
            val allProds = dao.getAllProducts().firstOrNull() ?: emptyList()
            if (allProds.none { it.category == "Home & Living" }) {
                val homeProds = listOf(
                    Product(
                        title = "Aura Ambient Sunset Projection Lamp",
                        description = "Transform your bedroom into a dreamy Martian sunset. Built with high-transparency crystal lens, 360-degree rotating projection, and smart vibe controls.",
                        price = 1299.00,
                        originalPrice = 1999.00,
                        imageUrl = "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
                        category = "Home & Living",
                        subCategory = "Lighting",
                        brand = "Aura Home",
                        vendorId = 1,
                        rating = 4.8f,
                        reviewCount = 145,
                        isTrending = true,
                        colorsJson = "[\"Martian Sunset\", \"Cosmic Blue\"]",
                        sizesJson = "[\"Standard\"]"
                    ),
                    Product(
                        title = "Cyberpunk RGB LED Acrylic Desk Organizer",
                        description = "De-clutter your battlefield in futuristic fashion. Features custom edge-lit acrylic slots, 16 million RGB gradient colors with dynamic sound sync.",
                        price = 1899.00,
                        originalPrice = 2499.00,
                        imageUrl = "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
                        category = "Home & Living",
                        subCategory = "Desk Decor",
                        brand = "Aura Home",
                        vendorId = 1,
                        rating = 4.7f,
                        reviewCount = 92,
                        isFlashSale = true,
                        colorsJson = "[\"Cyberpunk Orange\", \"Neon Purple\"]",
                        sizesJson = "[\"Regular\"]"
                    ),
                    Product(
                        title = "Cozy Knit Heavy Cable Throw Blanket",
                        description = "Wrap yourself in absolute comfort. Beautifully woven chunky yarn throw, perfect for Netflix sessions, winter vibes, and luxury aesthetic lounge layers.",
                        price = 2499.00,
                        originalPrice = 3499.00,
                        imageUrl = "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400",
                        category = "Home & Living",
                        subCategory = "Bedding",
                        brand = "Vogue Home",
                        vendorId = 2,
                        rating = 4.9f,
                        reviewCount = 210,
                        colorsJson = "[\"Oatmeal Beige\", \"Slate Gray\"]",
                        sizesJson = "[\"L (150x200cm)\"]"
                    )
                )
                dao.insertProducts(homeProds)
            }
            if (allProds.none { it.category == "Books" }) {
                val extraProds = listOf(
                    Product(
                        title = "The Pragmatic Programmer: Aura Edition",
                        description = "One of the most significant books in software development. Filled with classic advice on career, architecture, and coding mastery, customized with Aura digital insights.",
                        price = 699.00,
                        originalPrice = 899.00,
                        imageUrl = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
                        category = "Books",
                        subCategory = "Software",
                        brand = "Aura Press",
                        vendorId = 1,
                        rating = 4.9f,
                        reviewCount = 340,
                        colorsJson = "[\"Default\"]",
                        sizesJson = "[\"Paperback\", \"Hardcover\"]"
                    ),
                    Product(
                        title = "Carbon Fiber Pro Tennis Racket",
                        description = "Super-lightweight carbon fiber design engineered for elite power and precision spins. Ideal for advanced tournament plays and lifestyle tennis sports.",
                        price = 8499.00,
                        originalPrice = 11999.00,
                        imageUrl = "https://images.unsplash.com/photo-1617083934386-5727db681920?w=400",
                        category = "Sports",
                        subCategory = "Tennis",
                        brand = "Vogue Sports",
                        vendorId = 2,
                        rating = 4.8f,
                        reviewCount = 108,
                        colorsJson = "[\"Matte Black\", \"Neon Lime\"]",
                        sizesJson = "[\"Standard Grip\"]"
                    ),
                    Product(
                        title = "Super-Silent High-Speed Blender 1200W",
                        description = "Ultra-powerful 1200W blending system with vacuum-seal technology to preserve fresh nutrients. Operates at a super-silent whisper decibel range.",
                        price = 4999.00,
                        originalPrice = 6499.00,
                        imageUrl = "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=400",
                        category = "Appliances",
                        subCategory = "Kitchen",
                        brand = "Aura Home",
                        vendorId = 1,
                        rating = 4.7f,
                        reviewCount = 156,
                        colorsJson = "[\"Chrome Silver\", \"Piano Black\"]",
                        sizesJson = "[\"Standard (1.8L)\"]"
                    )
                )
                dao.insertProducts(extraProds)
            }
            if (allProds.none { it.subCategory == "Stationery" || it.subCategory == "Pet Care" }) {
                val moreQCommerceProds = listOf(
                    Product(
                        title = "Classmate A4 Notebooks (Set of 4)",
                        description = "High-quality bright white pages, perfectly bound. Essential stationery for students and office use.",
                        price = 180.00,
                        originalPrice = 200.00,
                        imageUrl = "https://images.unsplash.com/photo-1531346878377-3e5f29d2f216?w=400",
                        category = "Quick Commerce",
                        subCategory = "Stationery",
                        brand = "Classmate",
                        vendorId = 5,
                        rating = 4.6f,
                        reviewCount = 500,
                        deliveryMinutes = 10,
                        colorsJson = "[\"Assorted\"]",
                        sizesJson = "[\"172 Pages each\"]",
                        isQuickCommerce = true
                    ),
                    Product(
                        title = "Pedigree Adult Dog Food (Meat & Rice)",
                        description = "Complete and balanced nutrition with antioxidant blend. Keeps your pet healthy and active.",
                        price = 320.00,
                        originalPrice = 350.00,
                        imageUrl = "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400",
                        category = "Quick Commerce",
                        subCategory = "Pet Care",
                        brand = "Pedigree",
                        vendorId = 5,
                        rating = 4.8f,
                        reviewCount = 2100,
                        deliveryMinutes = 14,
                        colorsJson = "[\"Original\"]",
                        sizesJson = "[\"1.2 kg\"]",
                        isQuickCommerce = true
                    ),
                    Product(
                        title = "Nivea Men Fresh Active Deodorant",
                        description = "Long lasting freshness with ocean extracts. Dermatologically proven skin tolerance.",
                        price = 199.00,
                        originalPrice = 220.00,
                        imageUrl = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400",
                        category = "Quick Commerce",
                        subCategory = "Personal Care",
                        brand = "Nivea",
                        vendorId = 5,
                        rating = 4.5f,
                        reviewCount = 3400,
                        deliveryMinutes = 12,
                        colorsJson = "[\"Fresh Active\"]",
                        sizesJson = "[\"150 ml\"]",
                        isQuickCommerce = true
                    ),
                    Product(
                        title = "Coca-Cola Zero Sugar (Pack of 6)",
                        description = "The classic taste of Coca-Cola with zero sugar and zero calories. Best served ice cold.",
                        price = 240.00,
                        originalPrice = 240.00,
                        imageUrl = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
                        category = "Quick Commerce",
                        subCategory = "Cold Drinks",
                        brand = "Coca-Cola",
                        vendorId = 5,
                        rating = 4.7f,
                        reviewCount = 4200,
                        deliveryMinutes = 9,
                        colorsJson = "[\"Zero Sugar\"]",
                        sizesJson = "[\"330 ml x 6\"]",
                        isQuickCommerce = true
                    )
                )
                dao.insertProducts(moreQCommerceProds)
            }
        }
    }
}
