package com.example.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Product
import com.example.data.Vendor
import com.example.ui.components.AuraProductCard
import com.example.ui.theme.*
import org.json.JSONArray
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailScreen(
    product: Product,
    vendors: List<Vendor>,
    allProducts: List<Product>,
    isWishlisted: Boolean,
    onWishlistToggle: () -> Unit,
    onAddToCart: (Product, String, String) -> Unit,
    onBackClick: () -> Unit,
    onCheckoutClick: () -> Unit
) {
    val scrollState = rememberScrollState()

    // Parse sizes & colors
    val colors = remember(product.colorsJson) {
        try {
            val arr = JSONArray(product.colorsJson)
            List(arr.length()) { arr.getString(it) }
        } catch (e: Exception) {
            listOf("Standard")
        }
    }

    val sizes = remember(product.sizesJson) {
        try {
            val arr = JSONArray(product.sizesJson)
            List(arr.length()) { arr.getString(it) }
        } catch (e: Exception) {
            listOf("Regular")
        }
    }

    var selectedColor by remember { mutableStateOf(colors.firstOrNull() ?: "") }
    var selectedSize by remember { mutableStateOf(sizes.firstOrNull() ?: "") }

    // Map vendor
    val vendor = vendors.find { it.id == product.vendorId }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
    ) {
        // Top Header Bar
        TopAppBar(
            title = {
                Text(
                    text = product.brand.uppercase(),
                    color = TextWhite,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.5.sp
                )
            },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = TextWhite)
                }
            },
            actions = {
                IconButton(onClick = onWishlistToggle) {
                    Icon(
                        imageVector = if (isWishlisted) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Wishlist",
                        tint = if (isWishlisted) Color.Red else TextWhite
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkSlate)
        )

        // Scrollable content
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(scrollState)
        ) {
            // Interactive Hero Visual Area
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                CyberViolet.copy(alpha = 0.25f),
                                CardBackgroundDark
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                coil.compose.AsyncImage(
                    model = product.imageUrl,
                    contentDescription = product.title,
                    contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Mock Interactive 360 preview badge
                Row(
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(16.dp)
                        .background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(12.dp))
                        .border(1.dp, Color.White.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.Loop, contentDescription = "360", tint = CyberVioletLight, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("AR PREVIEW ACTIVE", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                }
            }

            // Product Meta Information
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                Text(
                    text = product.brand.uppercase(),
                    color = CyberViolet,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.5.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = product.title,
                    color = TextWhite,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black
                )

                // Ratings and reviews
                Row(
                    modifier = Modifier.padding(vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.Star, contentDescription = "Rating", tint = GoldYellow, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("${product.rating} Stars", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("|", color = TextWhite.copy(alpha = 0.2f), fontSize = 13.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("${product.reviewCount} User Ratings", color = TextWhite.copy(alpha = 0.6f), fontSize = 12.sp)
                }

                // Price display with original price discount
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "₹${String.format("%,.0f", product.price)}",
                        color = TextWhite,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Black
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    if (product.originalPrice > product.price) {
                        Text(
                            text = "₹${String.format("%,.0f", product.originalPrice)}",
                            color = TextWhite.copy(alpha = 0.4f),
                            fontSize = 16.sp,
                            textDecoration = TextDecoration.LineThrough
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        val pct = ((product.originalPrice - product.price) / product.originalPrice * 100).toInt()
                        Text(
                            text = "$pct% OFF",
                            color = NeonGreen,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))
                Text("Inclusive of all taxes", color = TextWhite.copy(alpha = 0.4f), fontSize = 11.sp)

                Divider(modifier = Modifier.padding(vertical = 16.dp), color = TextWhite.copy(alpha = 0.1f))

                // Variant Selector: Colors
                if (colors.isNotEmpty() && colors.first() != "Standard") {
                    Text("SELECT COLOR", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        colors.forEach { col ->
                            val isSel = col == selectedColor
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSel) CyberViolet else CardBackgroundDark)
                                    .border(1.dp, if (isSel) CyberViolet else TextWhite.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                                    .clickable { selectedColor = col }
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(col, color = if (isSel) Color.White else TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }

                // Variant Selector: Sizes
                if (sizes.isNotEmpty() && sizes.first() != "Regular") {
                    Text("SELECT SIZE / OPTION", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        sizes.forEach { sz ->
                            val isSel = sz == selectedSize
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSel) CyberViolet else CardBackgroundDark)
                                    .border(1.dp, if (isSel) CyberViolet else TextWhite.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                                    .clickable { selectedSize = sz }
                                    .padding(horizontal = 14.dp, vertical = 8.dp)
                            ) {
                                Text(sz, color = if (isSel) Color.White else TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Black)
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }

                var selectedTab by remember { mutableStateOf(0) }
                val tabs = listOf("Description", "Seller", "Reviews")
                
                TabRow(
                    selectedTabIndex = selectedTab,
                    containerColor = Color.Transparent,
                    indicator = { tabPositions ->
                        TabRowDefaults.Indicator(
                            Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                            color = CyberViolet,
                            height = 3.dp
                        )
                    },
                    divider = { Divider(color = TextWhite.copy(alpha = 0.1f)) }
                ) {
                    tabs.forEachIndexed { index, title ->
                        Tab(
                            selected = selectedTab == index,
                            onClick = { selectedTab = index },
                            text = { 
                                Text(
                                    text = title, 
                                    color = if (selectedTab == index) CyberVioletLight else TextWhite.copy(alpha = 0.5f), 
                                    fontWeight = FontWeight.Bold, 
                                    fontSize = 12.sp
                                ) 
                            }
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))

                when (selectedTab) {
                    0 -> {
                        // Description
                        Text(
                            text = product.description,
                            color = TextWhite.copy(alpha = 0.8f),
                            fontSize = 13.sp,
                            lineHeight = 18.sp
                        )
                    }
                    1 -> {
                        // Seller Information
                        vendor?.let { v ->
                            Surface(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp),
                                color = CardBackgroundDark,
                                border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(40.dp)
                                                .background(CyberViolet.copy(alpha = 0.15f), CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(imageVector = Icons.Default.Storefront, contentDescription = null, tint = CyberViolet)
                                        }
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Text(v.storeName, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Black)
                                                if (v.isVerified) {
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    Icon(imageVector = Icons.Default.Verified, contentDescription = "Verified", tint = NeonGreen, modifier = Modifier.size(12.dp))
                                                }
                                            }
                                            Text(v.subPlan, color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp)
                                        }
                                    }

                                    Box(
                                        modifier = Modifier
                                            .background(NeonGreen.copy(alpha = 0.1f), RoundedCornerShape(6.dp))
                                            .padding(horizontal = 8.dp, vertical = 4.dp)
                                    ) {
                                        Text("Score: ${v.performanceScore}", color = NeonGreen, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                    2 -> {
                        // Reviews
                        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            // Mock Review 1
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CardBackgroundDark, RoundedCornerShape(12.dp))
                                    .padding(12.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Default.Star, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(12.dp))
                                    Icon(imageVector = Icons.Default.Star, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(12.dp))
                                    Icon(imageVector = Icons.Default.Star, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(12.dp))
                                    Icon(imageVector = Icons.Default.Star, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(12.dp))
                                    Icon(imageVector = Icons.Default.Star, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(12.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Aman K.", color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("Absolutely stellar quality! Highly recommended. Worth every rupee.", color = TextWhite.copy(alpha = 0.8f), fontSize = 12.sp)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Similar Products
                Text("SIMILAR PRODUCTS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    val similar = allProducts.filter { it.category == product.category && it.id != product.id }
                    items(similar) { prod ->
                        Box(modifier = Modifier.width(150.dp)) {
                            AuraProductCard(
                                product = prod,
                                isWishlisted = false,
                                onWishlistToggle = {},
                                onProductClick = {},
                                onAddClick = { onAddToCart(prod, "", "") }
                            )
                        }
                    }
                }
            }
        }

        // Bottom purchase / checkout action bar
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, TextWhite.copy(alpha = 0.08f), RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp)),
            color = CardBackgroundDark,
            tonalElevation = 8.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Total Price", color = TextWhite.copy(alpha = 0.5f), fontSize = 11.sp)
                    Text("₹${String.format("%,.0f", product.price)}", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Black)
                }

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(
                        onClick = { onAddToCart(product, selectedColor, selectedSize) },
                        modifier = Modifier.height(44.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = CyberViolet),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(imageVector = Icons.Default.ShoppingCart, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("ADD TO CART", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }

                    Button(
                        onClick = {
                            onAddToCart(product, selectedColor, selectedSize)
                            onCheckoutClick()
                        },
                        modifier = Modifier.height(44.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricOrange),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("BUY NOW", fontWeight = FontWeight.Black, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
