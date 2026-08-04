package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.components.*
import com.example.ui.screens.*
import com.example.ui.theme.*
import com.example.ui.viewmodel.AuraMartViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AuraMartTheme {
                val viewModel: AuraMartViewModel = viewModel()

                // Observe View Model state reactively
                val currentScreen by viewModel.currentScreen.collectAsState()
                val userRole by viewModel.userRole.collectAsState()
                val products by viewModel.allProducts.collectAsState()
                val wishlist by viewModel.wishlistItems.collectAsState()
                val cartItems by viewModel.cartItems.collectAsState()
                val orders by viewModel.orders.collectAsState()
                val vendors by viewModel.vendors.collectAsState()
                val coupons by viewModel.coupons.collectAsState()
                val wallet by viewModel.wallet.collectAsState()

                val selectedCategory by viewModel.selectedCategory.collectAsState()
                val searchQuery by viewModel.searchQuery.collectAsState()
                val selectedProduct by viewModel.selectedProduct.collectAsState()
                val appliedCoupon by viewModel.appliedCoupon.collectAsState()

                val currentLocation by viewModel.currentLocation.collectAsState()
                val currentDarkstore by viewModel.currentDarkstore.collectAsState()
                val estimatedMins by viewModel.estimatedMins.collectAsState()
                val activeOrder by viewModel.activeOrder.collectAsState()

                val aiChatHistory by viewModel.aiChatHistory.collectAsState()
                val aiLoading by viewModel.aiLoading.collectAsState()
                val spinWheelResult by viewModel.spinWheelResult.collectAsState()

                // Local UI states
                var showAiDrawer by remember { mutableStateOf(false) }
                var showWheelGame by remember { mutableStateOf(false) }
                var showScratchGame by remember { mutableStateOf(false) }
                var showAuthOverlay by remember { mutableStateOf(false) }

                val wishlistIds = remember(wishlist) { wishlist.map { it.productId } }
                val totalCartQty = remember(cartItems) { cartItems.sumOf { it.quantity } }

                // Hardware Back button press interception for the HashRouter stack
                val canGoBack = viewModel.hashRouter.canGoBack()
                androidx.activity.compose.BackHandler(enabled = canGoBack) {
                    viewModel.popBack()
                }

                // Dynamic live search results calculation
                val searchResults = remember(searchQuery, products) {
                    if (searchQuery.isBlank()) emptyList()
                    else products.filter {
                        it.title.contains(searchQuery, ignoreCase = true) ||
                                it.category.contains(searchQuery, ignoreCase = true) ||
                                it.brand.contains(searchQuery, ignoreCase = true)
                    }
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    containerColor = DarkSlate,
                    bottomBar = {
                        // Display navigation dock only on standard client browsing screens
                        val dockScreens = listOf("Home", "Categories", "QuickCommerce", "Wishlist", "Profile")
                        if (currentScreen in dockScreens) {
                            NavigationBar(
                                containerColor = CardBackgroundDark,
                                modifier = Modifier
                                    .windowInsetsPadding(WindowInsets.navigationBars)
                                    .border(BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f)))
                            ) {
                                NavigationBarItem(
                                    selected = currentScreen == "Home",
                                    onClick = { viewModel.navigateTo("Home") },
                                    icon = { Icon(imageVector = Icons.Default.Home, contentDescription = "Home") },
                                    label = { Text("Home", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = CyberViolet,
                                        selectedTextColor = CyberViolet,
                                        indicatorColor = CyberViolet.copy(alpha = 0.12f),
                                        unselectedIconColor = TextWhite.copy(alpha = 0.4f),
                                        unselectedTextColor = TextWhite.copy(alpha = 0.4f)
                                    )
                                )

                                NavigationBarItem(
                                    selected = currentScreen == "Categories",
                                    onClick = { viewModel.navigateTo("Categories") },
                                    icon = { Icon(imageVector = Icons.Default.Category, contentDescription = "Categories") },
                                    label = { Text("Categories", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = CyberViolet,
                                        selectedTextColor = CyberViolet,
                                        indicatorColor = CyberViolet.copy(alpha = 0.12f),
                                        unselectedIconColor = TextWhite.copy(alpha = 0.4f),
                                        unselectedTextColor = TextWhite.copy(alpha = 0.4f)
                                    )
                                )

                                NavigationBarItem(
                                    selected = currentScreen == "QuickCommerce",
                                    onClick = { viewModel.navigateTo("QuickCommerce") },
                                    icon = { Icon(imageVector = Icons.Default.Bolt, contentDescription = "Quick Commerce") },
                                    label = { Text("⚡Instant", fontSize = 10.sp, fontWeight = FontWeight.Black) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = NeonGreen,
                                        selectedTextColor = NeonGreen,
                                        indicatorColor = NeonGreen.copy(alpha = 0.12f),
                                        unselectedIconColor = TextWhite.copy(alpha = 0.4f),
                                        unselectedTextColor = TextWhite.copy(alpha = 0.4f)
                                    )
                                )

                                NavigationBarItem(
                                    selected = currentScreen == "Wishlist",
                                    onClick = { viewModel.navigateTo("Wishlist") },
                                    icon = { Icon(imageVector = Icons.Default.Favorite, contentDescription = "Wishlist") },
                                    label = { Text("Wishlist", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = CyberViolet,
                                        selectedTextColor = CyberViolet,
                                        indicatorColor = CyberViolet.copy(alpha = 0.12f),
                                        unselectedIconColor = TextWhite.copy(alpha = 0.4f),
                                        unselectedTextColor = TextWhite.copy(alpha = 0.4f)
                                    )
                                )

                                NavigationBarItem(
                                    selected = currentScreen == "Profile",
                                    onClick = { viewModel.navigateTo("Profile") },
                                    icon = { Icon(imageVector = Icons.Default.Person, contentDescription = "Profile") },
                                    label = { Text("Profile", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = CyberViolet,
                                        selectedTextColor = CyberViolet,
                                        indicatorColor = CyberViolet.copy(alpha = 0.12f),
                                        unselectedIconColor = TextWhite.copy(alpha = 0.4f),
                                        unselectedTextColor = TextWhite.copy(alpha = 0.4f)
                                    )
                                )
                            }
                        }
                    },
                    floatingActionButton = {
                        // Display floating AI assistant trigger except on tracking/checkout sheets
                        val hideFabOn = listOf("OrderTracking", "Checkout")
                        if (currentScreen !in hideFabOn) {
                            FloatingActionButton(
                                onClick = { showAiDrawer = true },
                                containerColor = CyberViolet,
                                contentColor = Color.White,
                                shape = CircleShape,
                                modifier = Modifier
                                    .padding(bottom = if (currentScreen in listOf("Home", "Categories", "QuickCommerce", "Wishlist", "Profile")) 10.dp else 0.dp)
                                    .shadow(12.dp, CircleShape, ambientColor = CyberVioletLight, spotColor = CyberVioletLight)
                                    .border(1.dp, TextWhite.copy(alpha = 0.2f), CircleShape)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 14.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = "Aura AI")
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("ASK AURA", fontSize = 11.sp, fontWeight = FontWeight.Black, letterSpacing = 0.5.sp)
                                }
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(
                                bottom = if (currentScreen in listOf("Home", "Categories", "QuickCommerce", "Wishlist", "Profile")) innerPadding.calculateBottomPadding() else 0.dp,
                                top = innerPadding.calculateTopPadding()
                            )
                    ) {
                        // Animated content transition for smooth, direction-aware screen swaps driven by HashRouter
                        AnimatedContent(
                            targetState = currentScreen,
                            transitionSpec = {
                                val dir = viewModel.hashRouter.direction.value
                                if (dir == com.example.ui.navigation.NavDirection.FORWARD) {
                                    (slideInHorizontally(animationSpec = tween(300)) { width -> width } + fadeIn(animationSpec = tween(300)))
                                        .togetherWith(slideOutHorizontally(animationSpec = tween(300)) { width -> -width } + fadeOut(animationSpec = tween(300)))
                                } else if (dir == com.example.ui.navigation.NavDirection.BACKWARD) {
                                    (slideInHorizontally(animationSpec = tween(300)) { width -> -width } + fadeIn(animationSpec = tween(300)))
                                        .togetherWith(slideOutHorizontally(animationSpec = tween(300)) { width -> width } + fadeOut(animationSpec = tween(300)))
                                } else {
                                    fadeIn(animationSpec = tween(200)).togetherWith(fadeOut(animationSpec = tween(200)))
                                }
                            },
                            label = "screen_transition"
                        ) { targetScreen ->
                            when (targetScreen) {
                                "Home" -> HomeScreen(
                                    products = products,
                                    wishlist = wishlistIds,
                                    cartItemCount = totalCartQty,
                                    onProductClick = { viewModel.selectProduct(it) },
                                    onWishlistToggle = { viewModel.toggleWishlist(it) },
                                    onAddToCart = { viewModel.addToCart(it) },
                                    onNavigateSearch = { viewModel.navigateTo("Search") },
                                    onBannerCampaignClick = { campaign ->
                                        if (campaign.contains("GLYPH")) {
                                            viewModel.setSearchQuery("Nothing")
                                            viewModel.navigateTo("Search")
                                        } else if (campaign.contains("10-MIN")) {
                                            viewModel.navigateTo("QuickCommerce")
                                        } else {
                                            viewModel.setSearchQuery("Sabyasachi")
                                            viewModel.navigateTo("Search")
                                        }
                                    },
                                    onCartClick = { viewModel.navigateTo("Checkout") },
                                    onCategoryClick = { 
                                        viewModel.setCategory(it)
                                        viewModel.navigateTo("DynamicCategory")
                                    }
                                )

                                "Categories" -> CategoriesScreen(
                                    products = products,
                                    wishlist = wishlistIds,
                                    cartItemCount = totalCartQty,
                                    onProductClick = { viewModel.selectProduct(it) },
                                    onWishlistToggle = { viewModel.toggleWishlist(it) },
                                    onAddToCart = { viewModel.addToCart(it) },
                                    onCartClick = { viewModel.navigateTo("Checkout") }
                                )

                                "QuickCommerce" -> QuickCommerceScreen(
                                    currentLocation = currentLocation,
                                    currentDarkstore = currentDarkstore,
                                    estimatedMins = estimatedMins,
                                    activeOrder = activeOrder,
                                    onLocationUpdate = { loc, dark, mins -> viewModel.updateLocation(loc, dark, mins) },
                                    onNavigateTracking = { viewModel.navigateTo("OrderTracking") },
                                    products = products,
                                    cartItems = cartItems,
                                    wishlist = wishlistIds,
                                    onProductClick = { viewModel.selectProduct(it) },
                                    onWishlistToggle = { viewModel.toggleWishlist(it) },
                                    onAddToCart = { viewModel.addToCart(it) },
                                    onCheckoutClick = { viewModel.navigateTo("Checkout") }
                                )

                                "Wishlist" -> WishlistScreen(
                                    products = products,
                                    wishlist = wishlistIds,
                                    cartItemCount = totalCartQty,
                                    onProductClick = { viewModel.selectProduct(it) },
                                    onWishlistToggle = { viewModel.toggleWishlist(it) },
                                    onAddToCart = { viewModel.addToCart(it) },
                                    onCartClick = { viewModel.navigateTo("Checkout") }
                                )

                                "Profile" -> ProfileScreen(
                                    userRole = userRole,
                                    onRoleChange = { viewModel.switchRole(it) },
                                    wallet = wallet,
                                    orders = orders,
                                    allProducts = products,
                                    vendors = vendors,
                                    onVendorAddProduct = { t, d, p, c, b, i -> viewModel.vendorAddProduct(t, d, p, c, b, i) },
                                    onAdminToggleFlashSale = { id, act -> viewModel.adminToggleFlashSale(id, act) },
                                    onTriggerSpinGame = { showWheelGame = true },
                                    onTriggerScratchGame = { showScratchGame = true },
                                    onTrackOrder = { viewModel.trackOrder(it) }
                                )

                                "Search" -> SearchScreen(
                                    query = searchQuery,
                                    onQueryChange = { viewModel.setSearchQuery(it) },
                                    searchResults = searchResults,
                                    wishlist = wishlistIds,
                                    onProductClick = { viewModel.selectProduct(it) },
                                    onWishlistToggle = { viewModel.toggleWishlist(it) },
                                    onAddToCart = { viewModel.addToCart(it) },
                                    onBackClick = { viewModel.navigateTo("Home") },
                                    onAiSearchTrigger = { showAiDrawer = true }
                                )

                                "DynamicCategory" -> DynamicCategoryScreen(
                                    categoryName = selectedCategory,
                                    products = products,
                                    wishlist = wishlistIds,
                                    onProductClick = { viewModel.selectProduct(it) },
                                    onWishlistToggle = { viewModel.toggleWishlist(it) },
                                    onAddToCart = { viewModel.addToCart(it) },
                                    onBack = { viewModel.popBack() }
                                )

                                "Detail" -> selectedProduct?.let { prod ->
                                    ProductDetailScreen(
                                        product = prod,
                                        vendors = vendors,
                                        allProducts = products,
                                        isWishlisted = wishlistIds.contains(prod.id),
                                        onWishlistToggle = { viewModel.toggleWishlist(prod.id) },
                                        onAddToCart = { p, col, sz -> viewModel.addToCart(p, col, sz) },
                                        onBackClick = { viewModel.navigateTo("Home") },
                                        onCheckoutClick = { viewModel.navigateTo("Checkout") }
                                    )
                                }

                                "Checkout" -> CheckoutScreen(
                                    cartItems = cartItems,
                                    products = products,
                                    appliedCoupon = appliedCoupon,
                                    wallet = wallet,
                                    onApplyCoupon = { viewModel.applyCouponCode(it) },
                                    onClearCoupon = { viewModel.clearAppliedCoupon() },
                                    onIncrementQty = { viewModel.incrementCart(it) },
                                    onDecrementQty = { viewModel.decrementCart(it) },
                                    onRemoveItem = { viewModel.removeFromCart(it) },
                                    onBackClick = { viewModel.navigateTo("Home") },
                                    onPlaceOrder = { total, addr, pay, itemsSum, isQuick ->
                                        viewModel.submitCheckout(addr, pay, total, itemsSum, isQuick)
                                    }
                                )

                                "OrderTracking" -> OrderTrackingScreen(
                                    order = viewModel.activeOrder.value,
                                    onBackHomeClick = { viewModel.navigateTo("Home") }
                                )
                            }
                        }

                        // Overlay: AI Chat Assistant bottom drawer
                        if (showAiDrawer) {
                            AiAssistantOverlay(
                                chatHistory = aiChatHistory,
                                isLoading = aiLoading,
                                onSendMessage = { viewModel.sendAiAssistantMessage(it) },
                                onCloseClick = { showAiDrawer = false }
                            )
                        }

                        // Overlay: Fortune Spin wheel game portal
                        if (showWheelGame) {
                            SpinWheelGame(
                                onResultGained = { result ->
                                    viewModel.spinWheel()
                                },
                                onDismissRequest = {
                                    showWheelGame = false
                                    viewModel.clearSpinResult()
                                }
                            )
                        }

                        // Overlay: Scratch Card game portal
                        if (showScratchGame) {
                            ScratchCardGame(
                                onDismissRequest = {
                                    showScratchGame = false
                                }
                            )
                        }

                        // Overlay: Auth Overlay
                        if (showAuthOverlay) {
                            AuthOverlay(
                                onDismiss = { showAuthOverlay = false },
                                onLoginSuccess = { role -> 
                                    showAuthOverlay = false
                                    // You can hook up viewModel to actually login here
                                    // For now, the overlay mimics the login visually.
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}
