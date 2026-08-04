package com.example.ui.screens

import android.widget.Toast
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.CartItem
import com.example.data.Order
import com.example.data.Product
import com.example.ui.components.AuraProductCard
import com.example.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuickCommerceScreen(
    products: List<Product>,
    cartItems: List<CartItem>,
    wishlist: List<Int>,
    currentLocation: String,
    currentDarkstore: String,
    estimatedMins: Int,
    activeOrder: Order?,
    onLocationUpdate: (String, String, Int) -> Unit,
    onProductClick: (Product) -> Unit,
    onWishlistToggle: (Int) -> Unit,
    onAddToCart: (Product) -> Unit,
    onCheckoutClick: () -> Unit,
    onNavigateTracking: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

        val qCommerceProducts = products.filter { it.isQuickCommerce }
    val qCommerceCategories = listOf("All", "Dairy", "Fruits & Veggies", "Snacks", "Cold Drinks", "Sweet Cravings", "Meat", "Emergency", "Stationery", "Personal Care", "Pet Care")
    var selectedQCategory by remember { mutableStateOf("All") }
    var searchQuery by remember { mutableStateOf("") }

    // Location Picker Dialog & Geolocation Simulation States
    var showLocationSheet by remember { mutableStateOf(false) }
    var isSimulatingGps by remember { mutableStateOf(false) }
    var simulatedGpsLocked by remember { mutableStateOf(false) }
    var customAddressText by remember { mutableStateOf("") }

    // Filtered products based on search and selected category
    val filteredQProducts = remember(qCommerceProducts, selectedQCategory, searchQuery) {
        qCommerceProducts.filter { prod ->
            val matchCategory = selectedQCategory == "All" || prod.subCategory.equals(selectedQCategory, ignoreCase = true) || prod.title.contains(selectedQCategory, ignoreCase = true)
            val matchSearch = searchQuery.isBlank() || prod.title.contains(searchQuery, ignoreCase = true) || prod.brand.contains(searchQuery, ignoreCase = true)
            matchCategory && matchSearch
        }
    }

    // Flash sale products (only quick commerce items)
    val flashQProducts = remember(qCommerceProducts) {
        qCommerceProducts.filter { it.isFlashSale }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // ================= EXPRESS HEADER WITH LOCATION SELECTOR =================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(NeonGreen.copy(alpha = 0.2f), DarkSlate)
                        )
                    )
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 12.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Location pin and address indicator
                        Row(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .clickable { showLocationSheet = true }
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = "Delivery Location",
                                tint = NeonGreen,
                                modifier = Modifier.size(28.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = "Delivery in",
                                        color = TextWhite,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Black,
                                        letterSpacing = 0.5.sp
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "$estimatedMins mins",
                                        color = NeonGreen,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Icon(
                                        imageVector = Icons.Default.ArrowDropDown,
                                        contentDescription = "Select",
                                        tint = TextWhite,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                Text(
                                    text = currentLocation,
                                    color = TextWhite.copy(alpha = 0.7f),
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }

                        // Profile / Orders shortcut
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(CardBackgroundDark)
                                .border(1.dp, NeonGreen.copy(alpha = 0.3f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(imageVector = Icons.Default.Person, contentDescription = "Profile", tint = NeonGreen, modifier = Modifier.size(20.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Express Search Bar
                    TextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        placeholder = { Text("Search \"milk\", \"bread\", \"eggs\"...", color = TextWhite.copy(alpha = 0.5f), fontSize = 15.sp) },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = CardBackgroundDark,
                            unfocusedContainerColor = CardBackgroundDark,
                            focusedTextColor = TextWhite,
                            unfocusedTextColor = TextWhite,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .border(1.dp, TextWhite.copy(alpha = 0.1f), RoundedCornerShape(14.dp)),
                        leadingIcon = {
                            Icon(imageVector = Icons.Default.Search, contentDescription = "Search", tint = TextWhite.copy(alpha = 0.5f), modifier = Modifier.size(22.dp))
                        },
                        trailingIcon = {
                            if (searchQuery.isNotEmpty()) {
                                IconButton(onClick = { searchQuery = "" }) {
                                    Icon(imageVector = Icons.Default.Close, contentDescription = "Clear", tint = TextWhite.copy(alpha = 0.5f), modifier = Modifier.size(20.dp))
                                }
                            } else {
                                Row {
                                    Icon(imageVector = Icons.Default.Mic, contentDescription = "Voice", tint = TextWhite.copy(alpha = 0.5f), modifier = Modifier.size(22.dp))
                                    Spacer(modifier = Modifier.width(14.dp))
                                }
                            }
                        },
                        singleLine = true
                    )
                }
            }

            // Scrollable Content
            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(bottom = 80.dp)
            ) {
                // ================= ACTIVE LIVE ORDER TRACKING WIDGET =================
                if (activeOrder != null && activeOrder.status != "Delivered") {
                    AnimatedVisibility(
                        visible = true,
                        enter = expandVertically() + fadeIn(),
                        exit = shrinkVertically() + fadeOut()
                    ) {
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .border(1.5.dp, NeonGreen, RoundedCornerShape(16.dp)),
                            color = CardBackgroundDark,
                            tonalElevation = 6.dp
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .background(NeonGreen, CircleShape)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = "LIVE DELIVERY RADAR ACTIVE",
                                            color = NeonGreen,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Black,
                                            letterSpacing = 0.5.sp
                                        )
                                    }

                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = NeonGreen.copy(alpha = 0.1f)
                                    ) {
                                        Text(
                                            text = "OTP: ${activeOrder.verificationOtp}",
                                            color = NeonGreen,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Black,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(36.dp)
                                            .background(NeonGreen.copy(alpha = 0.15f), CircleShape),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.DirectionsBike,
                                            contentDescription = "Rider",
                                            tint = NeonGreen,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }

                                    Spacer(modifier = Modifier.width(12.dp))

                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "Rider Rohan is Out for Delivery!",
                                            color = TextWhite,
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = "Current Status: ${activeOrder.status} • ETA ${activeOrder.deliveryMinutes} mins",
                                            color = TextWhite.copy(alpha = 0.5f),
                                            fontSize = 11.sp
                                        )
                                    }

                                    Button(
                                        onClick = onNavigateTracking,
                                        colors = ButtonDefaults.buttonColors(containerColor = NeonGreen, contentColor = Color.White),
                                        shape = RoundedCornerShape(8.dp),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                        modifier = Modifier.height(32.dp)
                                    ) {
                                        Text("MAP", fontSize = 10.sp, fontWeight = FontWeight.Black)
                                    }
                                }

                                // Interactive mini tracker progress line
                                Spacer(modifier = Modifier.height(12.dp))
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(4.dp)
                                        .background(TextWhite.copy(alpha = 0.08f), RoundedCornerShape(2.dp))
                                ) {
                                    val progressFraction = when (activeOrder.status) {
                                        "Placed" -> 0.15f
                                        "Preparing" -> 0.40f
                                        "Shipped" -> 0.65f
                                        "Out for Delivery" -> 0.85f
                                        else -> 1.0f
                                    }
                                    Box(
                                        modifier = Modifier
                                            .fillMaxHeight()
                                            .fillMaxWidth(progressFraction)
                                            .background(NeonGreen, RoundedCornerShape(2.dp))
                                    )
                                }
                            }
                        }
                    }
                }

                // ================= HERO BRANDING & SPECIAL CAROUSEL =================
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                ) {
                    Column {
                        // Banners
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            item {
                                Surface(
                                    modifier = Modifier
                                        .width(300.dp)
                                        .height(140.dp),
                                    shape = RoundedCornerShape(16.dp),
                                    color = Color(0xFF020617), // Very dark blue/black
                                    border = BorderStroke(1.dp, NeonGreen.copy(alpha = 0.2f))
                                ) {
                                    Box(modifier = Modifier.fillMaxSize()) {
                                        // Abstract background aura
                                        Box(
                                            modifier = Modifier
                                                .size(140.dp)
                                                .background(NeonGreen.copy(alpha = 0.15f), CircleShape)
                                                .align(Alignment.BottomEnd)
                                        )
                                        Column(
                                            modifier = Modifier
                                                .fillMaxSize()
                                                .padding(20.dp),
                                            verticalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Surface(
                                                    shape = RoundedCornerShape(6.dp),
                                                    color = NeonGreen,
                                                    modifier = Modifier.padding(bottom = 8.dp)
                                                ) {
                                                    Text(
                                                        "SUPER SAVER",
                                                        color = Color.White,
                                                        fontSize = 9.sp,
                                                        fontWeight = FontWeight.Black,
                                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                                    )
                                                }
                                                Text("Get 50% OFF", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Black)
                                                Text("On your first 3 grocery orders", color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp)
                                            }
                                        }
                                    }
                                }
                            }

                            item {
                                Surface(
                                    modifier = Modifier
                                        .width(300.dp)
                                        .height(140.dp),
                                    shape = RoundedCornerShape(16.dp),
                                    color = Color(0xFF4C1D95), // Deep purple
                                    border = BorderStroke(1.dp, CyberVioletLight.copy(alpha = 0.2f))
                                ) {
                                    Box(modifier = Modifier.fillMaxSize()) {
                                        Box(
                                            modifier = Modifier
                                                .size(120.dp)
                                                .background(CyberViolet.copy(alpha = 0.25f), CircleShape)
                                                .align(Alignment.TopEnd)
                                        )
                                        Column(
                                            modifier = Modifier
                                                .fillMaxSize()
                                                .padding(20.dp),
                                            verticalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Surface(
                                                    shape = RoundedCornerShape(6.dp),
                                                    color = CyberVioletLight,
                                                    modifier = Modifier.padding(bottom = 8.dp)
                                                ) {
                                                    Text(
                                                        "FRESH ARRIVALS",
                                                        color = Color.White,
                                                        fontSize = 9.sp,
                                                        fontWeight = FontWeight.Black,
                                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                                    )
                                                }
                                                Text("Mango Mania!", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Black)
                                                Text("Fresh organic Alphonso delivered instantly", color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= CHOOSE BY CATEGORY GRID =================
                Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                    Text(
                        text = "EXPLORE CATEGORIES",
                        color = TextWhite,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.5.sp,
                        modifier = Modifier.padding(bottom = 14.dp)
                    )

                    // Display Categories in a 4-column Grid
                    val columns = 4
                    val rows = (qCommerceCategories.size + columns - 1) / columns
                    for (i in 0 until rows) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            for (j in 0 until columns) {
                                val index = i * columns + j
                                if (index < qCommerceCategories.size) {
                                    val cat = qCommerceCategories[index]
                                    val isSelected = cat == selectedQCategory
                                    val (catIcon, catBg) = when (cat) {
                                        "All" -> Icons.Default.GridView to Color(0xFF1E293B)
                                        "Dairy" -> Icons.Default.BreakfastDining to Color(0xFFFEF3C7)
                                        "Fruits & Veggies" -> Icons.Default.LocalFlorist to Color(0xFFDCFCE7)
                                        "Snacks" -> Icons.Default.Cookie to Color(0xFFFCE7F3)
                                        "Cold Drinks" -> Icons.Default.LocalDrink to Color(0xFFDBEAFE)
                                        "Sweet Cravings" -> Icons.Default.Cake to Color(0xFFFAE8FF)
                                        "Meat" -> Icons.Default.SetMeal to Color(0xFFFFEDD5)
                                        "Emergency" -> Icons.Default.LocalPharmacy to Color(0xFFCCFBF1)
                                        else -> Icons.Default.Storefront to Color(0xFF1E293B)
                                    }

                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(16.dp))
                                            .clickable { selectedQCategory = cat }
                                            .padding(4.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(72.dp)
                                                .clip(RoundedCornerShape(24.dp))
                                                .background(if (isSelected) NeonGreen else catBg)
                                                .border(2.dp, if (isSelected) NeonGreen else Color.Transparent, RoundedCornerShape(24.dp)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = catIcon,
                                                contentDescription = cat,
                                                tint = if (isSelected) Color.White else if (catBg == Color(0xFF1E293B)) Color.White else Color(0xFF1E293B),
                                                modifier = Modifier.size(36.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = if (cat == "Fruits & Veggies") "Fruits & Veg" else cat,
                                            color = if (isSelected) NeonGreen else TextWhite,
                                            fontSize = 12.sp,
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.SemiBold,
                                            textAlign = TextAlign.Center,
                                            maxLines = 2,
                                            lineHeight = 14.sp
                                        )
                                    }
                                } else {
                                    Spacer(modifier = Modifier.weight(1f))
                                }
                            }
                        }
                    }
                }

                // ================= ⚡ FLASH SALE DEALS SECTION =================
                if (flashQProducts.isNotEmpty() && selectedQCategory == "All") {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(start = 16.dp, end = 16.dp, bottom = 10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.FlashOn,
                                    contentDescription = "Flash Deals",
                                    tint = GoldYellow,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "⚡ CRAZY EXPRESS FLASH DEALS",
                                    color = TextWhite,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Black,
                                    letterSpacing = 0.5.sp
                                )
                            }

                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = ElectricOrange.copy(alpha = 0.1f)
                            ) {
                                Text(
                                    "ENDS IN 23M",
                                    color = ElectricOrange,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Black,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(14.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            items(flashQProducts) { prod ->
                                Box(modifier = Modifier.width(155.dp)) {
                                    Column {
                                        AuraProductCard(
                                            product = prod,
                                            isWishlisted = wishlist.contains(prod.id),
                                            onWishlistToggle = { onWishlistToggle(prod.id) },
                                            onProductClick = { onProductClick(prod) },
                                            onAddClick = { onAddToCart(prod) }
                                        )

                                        // Stocks warning
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.padding(start = 4.dp)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(5.dp)
                                                    .background(Color.Red, CircleShape)
                                            )
                                            Spacer(modifier = Modifier.width(6.dp))
                                            Text(
                                                text = "Only ${prod.liveStock} left!",
                                                color = Color.Red,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Black
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= PRODUCT LISTING SECTION =================
                if (selectedQCategory == "All" && searchQuery.isBlank()) {
                    // Modern Instamart/Zepto Style: Shelves for each category
                    qCommerceCategories.drop(1).forEach { cat ->
                        val shelfProducts = qCommerceProducts.filter { it.subCategory.equals(cat, ignoreCase = true) || it.title.contains(cat, ignoreCase = true) }
                        if (shelfProducts.isNotEmpty()) {
                            Column(modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp)) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(start = 16.dp, end = 16.dp, bottom = 12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = cat.uppercase(),
                                        color = TextWhite,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Black,
                                        letterSpacing = 0.8.sp
                                    )
                                    Text(
                                        text = "See All",
                                        color = NeonGreen,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.clickable { selectedQCategory = cat }
                                    )
                                }
                                LazyRow(
                                    contentPadding = PaddingValues(horizontal = 16.dp),
                                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    items(shelfProducts) { prod ->
                                        Box(modifier = Modifier.width(155.dp)) {
                                            Column {
                                                AuraProductCard(
                                                    product = prod,
                                                    isWishlisted = wishlist.contains(prod.id),
                                                    onWishlistToggle = { onWishlistToggle(prod.id) },
                                                    onProductClick = { onProductClick(prod) },
                                                    onAddClick = { onAddToCart(prod) }
                                                )
                                                // Scarcity stock info
                                                Spacer(modifier = Modifier.height(4.dp))
                                                Row(
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    modifier = Modifier.padding(start = 4.dp)
                                                ) {
                                                    val isLow = prod.liveStock <= 5
                                                    Box(
                                                        modifier = Modifier
                                                            .size(5.dp)
                                                            .background(if (isLow) Color.Red else Color(0xFF22C55E), CircleShape)
                                                    )
                                                    Spacer(modifier = Modifier.width(6.dp))
                                                    Text(
                                                        text = if (isLow) "Only ${prod.liveStock} left!" else "In Stock",
                                                        color = if (isLow) Color.Red else TextWhite.copy(alpha = 0.4f),
                                                        fontSize = 9.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Regular grid layout for selected category or search results
                    Column(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (searchQuery.isNotBlank()) "SEARCH RESULTS" else "${selectedQCategory.uppercase()} FRESH INVENTORY",
                                color = TextWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.8.sp
                            )
                            Text(
                                text = "${filteredQProducts.size} Items available",
                                color = TextWhite.copy(alpha = 0.4f),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        if (filteredQProducts.isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(
                                        imageVector = Icons.Default.Storefront,
                                        contentDescription = "Empty",
                                        tint = TextWhite.copy(alpha = 0.15f),
                                        modifier = Modifier.size(48.dp)
                                    )
                                    Spacer(modifier = Modifier.height(10.dp))
                                    Text(
                                        "No products match your filters.",
                                        color = TextWhite.copy(alpha = 0.4f),
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        } else {
                            // Display products in pairs
                            val chunks = filteredQProducts.chunked(2)
                            chunks.forEach { pair ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(bottom = 14.dp),
                                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                                ) {
                                    pair.forEach { prod ->
                                        Box(modifier = Modifier.weight(1f)) {
                                            Column {
                                                AuraProductCard(
                                                    product = prod,
                                                    isWishlisted = wishlist.contains(prod.id),
                                                    onWishlistToggle = { onWishlistToggle(prod.id) },
                                                    onProductClick = { onProductClick(prod) },
                                                    onAddClick = { onAddToCart(prod) }
                                                )
                                                // Scarcity stock info
                                                Spacer(modifier = Modifier.height(4.dp))
                                                Row(
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    modifier = Modifier.padding(start = 4.dp)
                                                ) {
                                                    val isLow = prod.liveStock <= 5
                                                    Box(
                                                        modifier = Modifier
                                                            .size(5.dp)
                                                            .background(if (isLow) Color.Red else Color(0xFF22C55E), CircleShape)
                                                    )
                                                    Spacer(modifier = Modifier.width(6.dp))
                                                    Text(
                                                        text = if (isLow) "Only ${prod.liveStock} items left!" else "Live stock: Fresh & stable",
                                                        color = if (isLow) Color.Red else TextWhite.copy(alpha = 0.4f),
                                                        fontSize = 9.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            }
                                        }
                                    }
                                    if (pair.size == 1) {
                                        Spacer(modifier = Modifier.weight(1f))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // ================= FLOATING CHECKOUT BAR =================
        val groceryCartItems = cartItems.filter { itemId ->
            val match = products.find { it.id == itemId.productId }
            match?.isQuickCommerce == true
        }

        if (groceryCartItems.isNotEmpty()) {
            val totalGroceryQty = groceryCartItems.sumOf { it.quantity }
            val grocerySubtotal = groceryCartItems.sumOf { item ->
                val p = products.find { it.id == item.productId }
                (p?.price ?: 0.0) * item.quantity
            }

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                    .border(1.dp, NeonGreen.copy(alpha = 0.2f), RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)),
                color = CardBackgroundDark,
                tonalElevation = 8.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(38.dp)
                                .background(NeonGreen.copy(alpha = 0.12f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(imageVector = Icons.Default.ShoppingCart, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(16.dp))
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "$totalGroceryQty Items placed",
                                color = TextWhite,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Black
                            )
                            Text(
                                text = "Subtotal: ₹${String.format("%,.0f", grocerySubtotal)}",
                                color = NeonGreen,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Black
                            )
                        }
                    }

                    Button(
                        onClick = onCheckoutClick,
                        colors = ButtonDefaults.buttonColors(containerColor = NeonGreen, contentColor = Color.White),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.height(44.dp)
                    ) {
                        Text(
                            text = "SWIPE TO BUY",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(imageVector = Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(14.dp))
                    }
                }
            }
        }

        // ================= LOCATION SELECTOR BOTTOM SHEET DIALOG =================
        if (showLocationSheet) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.6f))
                    .clickable { showLocationSheet = false }
            ) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                        .clip(RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp))
                        .clickable(enabled = false) {}, // Prevent dismiss click inside
                    color = CardBackgroundDark,
                    tonalElevation = 16.dp
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp)
                    ) {
                        // Drag Handle
                        Box(
                            modifier = Modifier
                                .size(36.dp, 4.dp)
                                .background(TextWhite.copy(alpha = 0.15f), RoundedCornerShape(2.dp))
                                .align(Alignment.CenterHorizontally)
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Choose Delivery Location",
                                color = TextWhite,
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Black
                            )
                            IconButton(onClick = { showLocationSheet = false }) {
                                Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = TextWhite.copy(alpha = 0.5f))
                            }
                        }

                        Text(
                            text = "Aura Express checks closest darkstore inventory automatically.",
                            color = TextWhite.copy(alpha = 0.5f),
                            fontSize = 11.sp,
                            modifier = Modifier.padding(bottom = 16.dp)
                        )

                        // 1. Simulate High-Precision GPS Access
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .border(1.dp, NeonGreen.copy(alpha = 0.25f), RoundedCornerShape(16.dp)),
                            color = NeonGreen.copy(alpha = 0.06f)
                        ) {
                            Column(modifier = Modifier.padding(14.dp)) {
                                if (isSimulatingGps) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        CircularProgressIndicator(
                                            color = NeonGreen,
                                            strokeWidth = 2.dp,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Text(
                                            text = "Connecting to high-precision GPS satellites...",
                                            color = TextWhite,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                } else {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.weight(1f)
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(36.dp)
                                                    .background(NeonGreen.copy(alpha = 0.15f), CircleShape),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Default.GpsFixed,
                                                    contentDescription = "GPS",
                                                    tint = NeonGreen,
                                                    modifier = Modifier.size(18.dp)
                                                )
                                            }
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Column {
                                                Text(
                                                    text = "Use Current Location GPS",
                                                    color = TextWhite,
                                                    fontSize = 13.sp,
                                                    fontWeight = FontWeight.Black
                                                )
                                                Text(
                                                    text = if (simulatedGpsLocked) "Locked: HSR Layout, Sector 6, Bangalore" else "Simulate fine geolocation access",
                                                    color = if (simulatedGpsLocked) NeonGreen else TextWhite.copy(alpha = 0.5f),
                                                    fontSize = 10.sp,
                                                    fontWeight = FontWeight.Bold
                                                )
                                            }
                                        }

                                        Button(
                                            onClick = {
                                                coroutineScope.launch {
                                                    isSimulatingGps = true
                                                    delay(1200) // Simulate GPS fix lag
                                                    isSimulatingGps = false
                                                    simulatedGpsLocked = true
                                                    onLocationUpdate("Current GPS (HSR Layout Sec 6)", "Darkstore #14", 9)
                                                    Toast.makeText(context, "GPS Location coordinates locked! 🛰️", Toast.LENGTH_SHORT).show()
                                                    showLocationSheet = false
                                                }
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = NeonGreen, contentColor = Color.White),
                                            shape = RoundedCornerShape(8.dp),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                            modifier = Modifier.height(32.dp)
                                        ) {
                                            Text(if (simulatedGpsLocked) "RE-LOCK" else "LOCATE ME", fontSize = 9.sp, fontWeight = FontWeight.Black)
                                        }
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // Custom Search Input
                        OutlinedTextField(
                            value = customAddressText,
                            onValueChange = { customAddressText = it },
                            placeholder = { Text("Or type customized delivery address...", color = TextWhite.copy(alpha = 0.4f), fontSize = 12.sp) },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite,
                                focusedBorderColor = NeonGreen,
                                unfocusedBorderColor = TextWhite.copy(alpha = 0.12f)
                            ),
                            trailingIcon = {
                                if (customAddressText.isNotBlank()) {
                                    IconButton(
                                        onClick = {
                                            onLocationUpdate(customAddressText, "Darkstore Custom", (10..15).random())
                                            Toast.makeText(context, "Address updated! 🏠", Toast.LENGTH_SHORT).show()
                                            showLocationSheet = false
                                        }
                                    ) {
                                        Icon(imageVector = Icons.Default.Check, contentDescription = "Apply", tint = NeonGreen)
                                    }
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        // Express Darkstore Hubs List
                        Text(
                            text = "POPULAR AURA EXPRESS HUBS",
                            color = TextWhite.copy(alpha = 0.5f),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.8.sp,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )

                        val expressHubs = listOf(
                            Triple("Koramangala 4th Block Hub", "Darkstore #3", 8),
                            Triple("HSR Sector 6 Darkstore", "Darkstore #14", 11),
                            Triple("Indiranagar Express Warehouse", "Darkstore #8", 14),
                            Triple("Jayanagar Central Pantry", "Darkstore #11", 16)
                        )

                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            expressHubs.forEach { (hubName, darkstoreId, mins) ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (currentLocation.contains(hubName.substringBefore(" "))) NeonGreen.copy(alpha = 0.08f) else Color.Transparent)
                                        .clickable {
                                            onLocationUpdate(hubName, darkstoreId, mins)
                                            Toast.makeText(context, "Switched to $darkstoreId ⚡", Toast.LENGTH_SHORT).show()
                                            showLocationSheet = false
                                        }
                                        .padding(horizontal = 12.dp, vertical = 10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.Storefront,
                                            contentDescription = null,
                                            tint = if (currentLocation.contains(hubName.substringBefore(" "))) NeonGreen else TextWhite.copy(alpha = 0.5f),
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Text(
                                                text = hubName,
                                                color = TextWhite,
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                            Text(
                                                text = "Express Logistics Point • $darkstoreId",
                                                color = TextWhite.copy(alpha = 0.4f),
                                                fontSize = 10.sp
                                            )
                                        }
                                    }

                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = if (currentLocation.contains(hubName.substringBefore(" "))) NeonGreen else TextWhite.copy(alpha = 0.06f)
                                    ) {
                                        Text(
                                            text = "$mins MINS",
                                            color = if (currentLocation.contains(hubName.substringBefore(" "))) Color.White else TextWhite.copy(alpha = 0.7f),
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Black,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
