package com.example.ui.screens

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Product
import com.example.ui.components.*
import com.example.ui.theme.*
import kotlinx.coroutines.delay
import org.json.JSONArray

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    products: List<Product>,
    wishlist: List<Int>,
    cartItemCount: Int,
    onProductClick: (Product) -> Unit,
    onWishlistToggle: (Int) -> Unit,
    onAddToCart: (Product) -> Unit,
    onNavigateSearch: () -> Unit,
    onBannerCampaignClick: (String) -> Unit,
    onCartClick: () -> Unit,
    onCategoryClick: (String) -> Unit
) {
    val scrollState = rememberScrollState()

    // Simulated Count Down Timer (Today's Deals)
    var timeRemaining by remember { mutableStateOf("02h : 14m : 45s") }
    LaunchedEffect(Unit) {
        var hours = 2
        var minutes = 14
        var seconds = 45
        while (true) {
            delay(1000)
            seconds--
            if (seconds < 0) {
                seconds = 59
                minutes--
                if (minutes < 0) {
                    minutes = 59
                    hours--
                    if (hours < 0) {
                        hours = 2 // reset
                    }
                }
            }
            timeRemaining = String.format("%02dh : %02dm : %02ds", hours, minutes, seconds)
        }
    }

    val standardProducts = products.filter { !it.isQuickCommerce }
    val newArrivals = standardProducts.takeLast(5)
    val trendingProducts = standardProducts.shuffled().take(5)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp)
    ) {
        // Futuristic App Header Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "AURAMART",
                    color = TextWhite,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.5.sp
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = NeonGreen,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Connaught Place, New Delhi 🇮🇳",
                        color = TextWhite.copy(alpha = 0.6f),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Quick Commerce Mini-floating toggle indicator
                Surface(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp)),
                    color = NeonGreen.copy(alpha = 0.15f),
                    border = BorderStroke(1.dp, NeonGreen.copy(alpha = 0.3f))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .background(NeonGreen, CircleShape)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("10-MIN", color = NeonGreen, fontSize = 9.sp, fontWeight = FontWeight.Black)
                    }
                }

                // Interactive Cart Badge
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(CardBackgroundDark)
                        .clickable { onCartClick() }
                        .border(1.dp, TextWhite.copy(alpha = 0.1f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.ShoppingCart,
                        contentDescription = "Cart",
                        tint = TextWhite,
                        modifier = Modifier.size(20.dp)
                    )
                    if (cartItemCount > 0) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .background(CyberViolet, CircleShape)
                                .align(Alignment.TopEnd),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = cartItemCount.toString(),
                                color = Color.White,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        // Gen-Z Search Box Anchor
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .clip(RoundedCornerShape(16.dp))
                .border(1.dp, TextWhite.copy(alpha = 0.12f), RoundedCornerShape(16.dp))
                .clickable { onNavigateSearch() },
            color = CardBackgroundDark
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(imageVector = Icons.Default.Search, contentDescription = "Search", tint = CyberViolet)
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = "Vibe search: 'neon cyberpunk outfit'...",
                    color = TextWhite.copy(alpha = 0.4f),
                    fontSize = 13.sp,
                    modifier = Modifier.weight(1f)
                )
                Icon(imageVector = Icons.Default.Mic, contentDescription = "Voice", tint = TextWhite.copy(alpha = 0.5f))
                Spacer(modifier = Modifier.width(12.dp))
                Icon(imageVector = Icons.Default.QrCodeScanner, contentDescription = "Scan", tint = TextWhite.copy(alpha = 0.5f))
            }
        }

        // Bouncing / Glowing Promo Stickers horizontal banner
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            item { AnimatedPromoSticker(text = "🔥 TRENDING", style = "bounce") }
            item { AnimatedPromoSticker(text = "⚡ FLASH SALE", style = "glow") }
            item { AnimatedPromoSticker(text = "🛒 FREE DELIVERY", style = "pulse") }
            item { AnimatedPromoSticker(text = "🎁 BOGO", style = "shake") }
            item { AnimatedPromoSticker(text = "LIVE", style = "glow") }
            item { AnimatedPromoSticker(text = "LIMITED", style = "bounce") }
        }

        // Horizontal Top Categories like Flipkart/Myntra
        val topCategories = listOf("Fashion", "Mobiles", "Electronics", "Beauty", "Home", "Appliances")
        val categoryIcons = listOf(Icons.Default.Style, Icons.Default.PhoneIphone, Icons.Default.Laptop, Icons.Default.Face, Icons.Default.Chair, Icons.Default.Kitchen)
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(topCategories.size) { index ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.width(64.dp).clickable { onCategoryClick(topCategories[index]) }
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(CardBackgroundDark)
                            .border(1.dp, TextWhite.copy(alpha = 0.1f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = categoryIcons[index],
                            contentDescription = topCategories[index],
                            tint = CyberVioletLight,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = topCategories[index],
                        color = TextWhite.copy(alpha = 0.8f),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }

        // Large Auto Sliding Hero Slider
        AutoSlidingHeroSlider(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
            onCampaignClick = onBannerCampaignClick
        )

        // Festival Special Section
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .clip(RoundedCornerShape(16.dp)),
            color = Color(0xFF5B21B6),
            border = BorderStroke(1.dp, CyberVioletLight)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "THE GRAND DIWALI SALE",
                        color = Color.White,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Up to 80% OFF on Electronics & Ethnic Wear + 10% Extra Bank Discount",
                        color = Color.White.copy(alpha = 0.8f),
                        fontSize = 11.sp,
                        lineHeight = 16.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = { onBannerCampaignClick("Diwali Sale") },
                        colors = ButtonDefaults.buttonColors(containerColor = GoldYellow, contentColor = Color.Black),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        modifier = Modifier.height(32.dp)
                    ) {
                        Text("SHOP NOW", fontSize = 10.sp, fontWeight = FontWeight.Black)
                    }
                }
                Spacer(modifier = Modifier.width(16.dp))
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .background(CyberViolet.copy(alpha = 0.4f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.Celebration, contentDescription = "Festival", tint = GoldYellow, modifier = Modifier.size(40.dp))
                }
            }
        }

        // Today's Lightning Deals / Flash Sales
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "LIGHTNING DEALS",
                        color = TextWhite,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Box(
                        modifier = Modifier
                            .background(ElectricOrange.copy(alpha = 0.2f), RoundedCornerShape(6.dp))
                            .border(1.dp, ElectricOrange, RoundedCornerShape(6.dp))
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = timeRemaining,
                            color = ElectricOrange,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Horizontally scrolling deals
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                val dealProducts = standardProducts.filter { it.isFlashSale }
                items(dealProducts) { prod ->
                    Box(modifier = Modifier.width(150.dp)) {
                        AuraProductCard(
                            product = prod,
                            isWishlisted = wishlist.contains(prod.id),
                            onWishlistToggle = { onWishlistToggle(prod.id) },
                            onProductClick = { onProductClick(prod) },
                            onAddClick = { onAddToCart(prod) }
                        )
                    }
                }
            }
        }

        // Brand Collections Showcase Banners
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 16.dp)
        ) {
            Text(
                text = "FEATURED BRANDS",
                color = TextWhite,
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(bottom = 14.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Brand 1 Card (Unsplash graphic mockup)
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .height(90.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                    color = CardBackgroundDark
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Brush.verticalGradient(listOf(CyberViolet.copy(alpha = 0.2f), Color.Transparent)))
                            .padding(12.dp),
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text("SABYASACHI", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Black)
                        Text("Heritage Collection", color = CyberVioletLight, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Brand 2 Card
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .height(90.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(12.dp)),
                    color = CardBackgroundDark
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Brush.verticalGradient(listOf(NeonGreen.copy(alpha = 0.15f), Color.Transparent)))
                            .padding(12.dp),
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text("NOTHING TECH", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Black)
                        Text("Gen-Z Design Ecosystem", color = NeonGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // New Arrivals Horizontal Scrolling List
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "NEW ARRIVALS",
                    color = TextWhite,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(newArrivals) { prod ->
                    Box(modifier = Modifier.width(150.dp)) {
                        AuraProductCard(
                            product = prod,
                            isWishlisted = wishlist.contains(prod.id),
                            onWishlistToggle = { onWishlistToggle(prod.id) },
                            onProductClick = { onProductClick(prod) },
                            onAddClick = { onAddToCart(prod) }
                        )
                    }
                }
            }
        }

        // Interactive Sponsor / Ad Promo banner card
        InteractiveAdBanner(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
        )

        // Gamification: Lucky Spin & Scratch Cards
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Surface(
                modifier = Modifier
                    .weight(1f)
                    .height(80.dp),
                shape = RoundedCornerShape(12.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, CyberVioletLight.copy(alpha = 0.3f))
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Lucky Spin", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                        Text("Win ₹500", color = CyberVioletLight, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                    Box(modifier = Modifier.size(40.dp).background(CyberViolet.copy(alpha=0.2f), CircleShape), contentAlignment = Alignment.Center) {
                        Icon(imageVector = Icons.Default.Cyclone, contentDescription = null, tint = CyberVioletLight)
                    }
                }
            }
            Surface(
                modifier = Modifier
                    .weight(1f)
                    .height(80.dp),
                shape = RoundedCornerShape(12.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, GoldYellow.copy(alpha = 0.3f))
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Scratch Card", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                        Text("Unlocked!", color = GoldYellow, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                    Box(modifier = Modifier.size(40.dp).background(GoldYellow.copy(alpha=0.1f), CircleShape), contentAlignment = Alignment.Center) {
                        Icon(imageVector = Icons.Default.CardGiftcard, contentDescription = null, tint = GoldYellow)
                    }
                }
            }
        }

        // Live Shopping & Video Commerce
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "LIVE SHOPPING",
                    color = TextWhite,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(8.dp).background(Color.Red, CircleShape))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("LIVE NOW", color = Color.Red, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(3) { index ->
                    Box(
                        modifier = Modifier
                            .width(130.dp)
                            .height(200.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(12.dp))
                    ) {
                        // Mock Video Thumbnail
                        Box(modifier = Modifier.fillMaxSize().background(CyberViolet.copy(alpha=0.2f)))
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Brush.verticalGradient(listOf(Color.Transparent, Color.Black.copy(alpha=0.8f))))
                                .padding(10.dp),
                            verticalArrangement = Arrangement.Bottom
                        ) {
                            Text(if(index == 0) "Tech Gadgets Live" else if(index == 1) "Sabyasachi Unveiling" else "Daily Fresh Drops", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold, maxLines = 2)
                            Spacer(modifier = Modifier.height(4.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(imageVector = Icons.Default.Visibility, contentDescription = null, tint = Color.White.copy(alpha=0.7f), modifier = Modifier.size(12.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("${10 + index * 5}K watching", color = Color.White.copy(alpha=0.7f), fontSize = 9.sp)
                            }
                        }
                        Box(modifier = Modifier.align(Alignment.Center).size(36.dp).background(Color.Black.copy(alpha=0.4f), CircleShape), contentAlignment = Alignment.Center) {
                            Icon(imageVector = Icons.Default.PlayArrow, contentDescription = "Play", tint = Color.White)
                        }
                    }
                }
            }
        }

        // Trending Now Horizontal Scrolling List
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "TRENDING NOW",
                    color = TextWhite,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(trendingProducts) { prod ->
                    Box(modifier = Modifier.width(150.dp)) {
                        AuraProductCard(
                            product = prod,
                            isWishlisted = wishlist.contains(prod.id),
                            onWishlistToggle = { onWishlistToggle(prod.id) },
                            onProductClick = { onProductClick(prod) },
                            onAddClick = { onAddToCart(prod) }
                        )
                    }
                }
            }
        }

        // Recommended For You Grid
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            Text(
                text = "RECOMMENDED FOR YOU",
                color = TextWhite,
                fontSize = 16.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp,
                modifier = Modifier.padding(bottom = 16.dp)
            )

            // Dynamic 2 Column Grid for Products
            val chunked = standardProducts.chunked(2)
            chunked.forEach { rowProducts ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    rowProducts.forEach { prod ->
                        Box(modifier = Modifier.weight(1f)) {
                            AuraProductCard(
                                product = prod,
                                isWishlisted = wishlist.contains(prod.id),
                                onWishlistToggle = { onWishlistToggle(prod.id) },
                                onProductClick = { onProductClick(prod) },
                                onAddClick = { onAddToCart(prod) }
                            )
                        }
                    }
                    if (rowProducts.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

// --- Categories Screen ---
@Composable
fun CategoriesScreen(
    products: List<Product>,
    wishlist: List<Int>,
    cartItemCount: Int,
    onProductClick: (Product) -> Unit,
    onWishlistToggle: (Int) -> Unit,
    onAddToCart: (Product) -> Unit,
    onCartClick: () -> Unit
) {
    val categoriesList = listOf("Fashion", "Beauty", "Electronics", "Quick Commerce", "Home & Living", "Books", "Sports", "Appliances")
    var activeCategory by remember { mutableStateOf("Fashion") }

    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
    ) {
        // Side Navigation Category rail
        Column(
            modifier = Modifier
                .width(95.dp)
                .fillMaxHeight()
                .background(CardBackgroundDark)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            categoriesList.forEach { cat ->
                val isSelected = cat == activeCategory
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(90.dp)
                        .background(if (isSelected) DarkSlate else Color.Transparent)
                        .clickable { activeCategory = cat }
                        .padding(8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(
                                    if (isSelected) CyberViolet.copy(alpha = 0.2f) else TextWhite.copy(alpha = 0.08f),
                                    CircleShape
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = when (cat) {
                                    "Fashion" -> Icons.Default.Style
                                    "Beauty" -> Icons.Default.Face
                                    "Electronics" -> Icons.Default.Devices
                                    "Quick Commerce" -> Icons.Default.ShoppingBag
                                    "Home & Living" -> Icons.Default.Home
                                    "Books" -> Icons.Default.Book
                                    "Sports" -> Icons.Default.EmojiEvents
                                    "Appliances" -> Icons.Default.Tv
                                    else -> Icons.Default.LocalMall
                                },
                                contentDescription = cat,
                                tint = if (isSelected) CyberViolet else TextWhite.copy(alpha = 0.6f),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = cat,
                            color = if (isSelected) CyberViolet else TextWhite.copy(alpha = 0.6f),
                            fontSize = 10.sp,
                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }

        // Category Content view
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .padding(14.dp)
                .verticalScroll(rememberScrollState())
        ) {
            // Header with Cart Button
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Categories",
                    color = TextWhite,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black
                )

                // Interactive Cart Badge!
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(CardBackgroundDark)
                        .clickable { onCartClick() }
                        .border(1.dp, TextWhite.copy(alpha = 0.1f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.ShoppingCart,
                        contentDescription = "Cart",
                        tint = TextWhite,
                        modifier = Modifier.size(18.dp)
                    )
                    if (cartItemCount > 0) {
                        Box(
                            modifier = Modifier
                                .size(16.dp)
                                .background(CyberViolet, CircleShape)
                                .align(Alignment.TopEnd),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = cartItemCount.toString(),
                                color = Color.White,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // Category Hero Banners
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                if (activeCategory == "Quick Commerce") NeonGreen.copy(alpha = 0.2f) else CyberViolet.copy(alpha = 0.2f),
                                CardBackgroundDark
                            )
                        )
                    )
                    .border(1.dp, TextWhite.copy(alpha = 0.10f), RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    modifier = Modifier.padding(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "${activeCategory.uppercase()} SPOTLIGHT",
                        color = TextWhite,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Curated luxury drops & limited collections",
                        color = TextWhite.copy(alpha = 0.6f),
                        fontSize = 10.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "$activeCategory Products",
                color = TextWhite,
                fontSize = 14.sp,
                fontWeight = FontWeight.Black,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            // Category product list
            val categoryProducts = products.filter {
                if (activeCategory == "Quick Commerce") it.isQuickCommerce
                else it.category == activeCategory && !it.isQuickCommerce
            }

            if (categoryProducts.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No products added in this category yet.", color = Color.White.copy(alpha = 0.4f), fontSize = 12.sp)
                }
            } else {
                val chunked = categoryProducts.chunked(2)
                chunked.forEach { rowProducts ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        rowProducts.forEach { prod ->
                            Box(modifier = Modifier.weight(1f)) {
                                AuraProductCard(
                                    product = prod,
                                    isWishlisted = wishlist.contains(prod.id),
                                    onWishlistToggle = { onWishlistToggle(prod.id) },
                                    onProductClick = { onProductClick(prod) },
                                    onAddClick = { onAddToCart(prod) }
                                )
                            }
                        }
                        if (rowProducts.size == 1) {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}

// --- Wishlist Screen ---
@Composable
fun WishlistScreen(
    products: List<Product>,
    wishlist: List<Int>,
    cartItemCount: Int,
    onProductClick: (Product) -> Unit,
    onWishlistToggle: (Int) -> Unit,
    onAddToCart: (Product) -> Unit,
    onCartClick: () -> Unit
) {
    val wishlistedProducts = products.filter { wishlist.contains(it.id) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "YOUR WISHLIST ❤️",
                color = TextWhite,
                fontSize = 18.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp
            )

            // Interactive Cart Badge!
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(CardBackgroundDark)
                    .clickable { onCartClick() }
                    .border(1.dp, TextWhite.copy(alpha = 0.1f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = "Cart",
                    tint = TextWhite,
                    modifier = Modifier.size(18.dp)
                )
                if (cartItemCount > 0) {
                    Box(
                        modifier = Modifier
                            .size(16.dp)
                            .background(CyberViolet, CircleShape)
                            .align(Alignment.TopEnd),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = cartItemCount.toString(),
                            color = Color.White,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        if (wishlistedProducts.isEmpty()) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.FavoriteBorder,
                        contentDescription = "Empty",
                        tint = TextWhite.copy(alpha = 0.15f),
                        modifier = Modifier.size(96.dp)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Your wishlist is empty",
                        color = TextWhite,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Vibe match products to buy them anytime!",
                        color = TextWhite.copy(alpha = 0.5f),
                        fontSize = 12.sp,
                        textAlign = TextAlign.Center
                    )
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(wishlistedProducts) { prod ->
                    AuraProductCard(
                        product = prod,
                        isWishlisted = true,
                        onWishlistToggle = { onWishlistToggle(prod.id) },
                        onProductClick = { onProductClick(prod) },
                        onAddClick = { onAddToCart(prod) }
                    )
                }
            }
        }
    }
}

// --- Search Screen with Barcode Scanner Overlay ---
@Composable
fun SearchScreen(
    query: String,
    onQueryChange: (String) -> Unit,
    searchResults: List<Product>,
    wishlist: List<Int>,
    onProductClick: (Product) -> Unit,
    onWishlistToggle: (Int) -> Unit,
    onAddToCart: (Product) -> Unit,
    onBackClick: () -> Unit,
    onAiSearchTrigger: () -> Unit
) {
    var showScannerSimulator by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.7f)) // Glassmorphism-style semi-transparent background
            .padding(16.dp)
    ) {
        // Search Header with back
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }

            TextField(
                value = query,
                onValueChange = onQueryChange,
                placeholder = { Text("What visual are you looking for today?", color = Color.White.copy(alpha = 0.4f)) },
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = CardBackgroundDark.copy(alpha = 0.8f),
                    unfocusedContainerColor = CardBackgroundDark.copy(alpha = 0.8f),
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent
                ),
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .border(1.dp, Color.White.copy(alpha = 0.15f), RoundedCornerShape(12.dp)),
                trailingIcon = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = { /* Simulated Voice Input */ }) {
                            Icon(imageVector = Icons.Default.Mic, contentDescription = "Voice Search", tint = CyberVioletLight)
                        }
                        IconButton(onClick = { showScannerSimulator = true }) {
                            Icon(imageVector = Icons.Default.QrCodeScanner, contentDescription = "Scan", tint = Color.White.copy(alpha = 0.6f))
                        }
                    }
                }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // AI Recommendations Banner Prompt
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .clickable { onAiSearchTrigger() },
            color = CyberViolet.copy(alpha = 0.15f),
            border = BorderStroke(1.dp, CyberVioletLight.copy(alpha = 0.3f))
        ) {
            Row(
                modifier = Modifier.padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(CyberViolet, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text("AURA AI ASSISTANT DISCOVERY", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Text("Describe your custom vibe to Aura", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                }
                Icon(imageVector = Icons.Default.ChevronRight, contentDescription = null, tint = Color.White.copy(alpha = 0.6f))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (query.isEmpty()) {
            // Trending Searches List
            Text("TRENDING SEARCHES", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(10.dp))

            val trendingSearches = listOf("Nothing Phone Milk", "Sabyasachi Silk Kurta", "Active Noise Buds", "Organic Alphonso", "Laneige hydration")
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                trendingSearches.forEach { keyword ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onQueryChange(keyword.substringBefore(" ").trim()) }
                            .padding(vertical = 10.dp, horizontal = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(imageVector = Icons.Default.TrendingUp, contentDescription = null, tint = CyberVioletLight, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(keyword, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        } else {
            // Search Results list
            if (searchResults.isEmpty()) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No products match '$query'", color = Color.White.copy(alpha = 0.4f), fontSize = 13.sp)
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    horizontalArrangement = Arrangement.spacedBy(14.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(searchResults) { prod ->
                        AuraProductCard(
                            product = prod,
                            isWishlisted = wishlist.contains(prod.id),
                            onWishlistToggle = { onWishlistToggle(prod.id) },
                            onProductClick = { onProductClick(prod) },
                            onAddClick = { onAddToCart(prod) }
                        )
                    }
                }
            }
        }
    }

    // Interactive Barcode Scan Simulator
    if (showScannerSimulator) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.Black)
                .clickable { showScannerSimulator = false },
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("SCAN BARCODE / QR CODE", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Black)
                Text("Hold product code within the square frame", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp, modifier = Modifier.padding(bottom = 24.dp))

                Box(
                    modifier = Modifier
                        .size(240.dp)
                        .border(3.dp, CyberVioletLight, RoundedCornerShape(24.dp))
                        .padding(10.dp)
                ) {
                    // Moving scan laser line
                    val infiniteTransition = rememberInfiniteTransition()
                    val laserY by infiniteTransition.animateFloat(
                        initialValue = 0f,
                        targetValue = 220f,
                        animationSpec = infiniteRepeatable(
                            animation = tween(1500, easing = LinearEasing),
                            repeatMode = RepeatMode.Reverse
                        )
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(2.dp)
                            .offset(y = laserY.dp)
                            .background(NeonGreen)
                    )

                    Icon(
                        imageVector = Icons.Default.QrCode,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.2f),
                        modifier = Modifier.fillMaxSize()
                    )
                }

                Spacer(modifier = Modifier.height(30.dp))

                Button(
                    onClick = {
                        showScannerSimulator = false
                        // Simulate finding "Nothing Phone (2a)"
                        onQueryChange("Nothing")
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberViolet)
                ) {
                    Text("SIMULATE DETECTION", fontWeight = FontWeight.Bold)
                }

                TextButton(onClick = { showScannerSimulator = false }) {
                    Text("Cancel", color = Color.White.copy(alpha = 0.5f))
                }
            }
        }
    }
}
