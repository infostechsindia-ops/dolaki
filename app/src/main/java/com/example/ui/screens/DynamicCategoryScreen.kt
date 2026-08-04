package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

/**
 * Server-Driven UI (SDUI) Category Screen.
 * In a real app like Myntra or Noon, category pages are not hardcoded. 
 * The backend sends a JSON layout defining which banners, sponsors, and sliders to show.
 */

sealed class CategoryBlock {
    data class HeroVideoBanner(val videoUrl: String, val title: String) : CategoryBlock()
    data class SponsoredBrands(val brands: List<String>) : CategoryBlock()
    data class FlashSale(val title: String, val discountText: String) : CategoryBlock()
    data class ProductGrid(val title: String) : CategoryBlock()
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DynamicCategoryScreen(
    categoryName: String,
    products: List<com.example.data.Product>,
    wishlist: List<Int>,
    onProductClick: (com.example.data.Product) -> Unit,
    onWishlistToggle: (Int) -> Unit,
    onAddToCart: (com.example.data.Product) -> Unit,
    onBack: () -> Unit
) {
    // Generate layout blocks based on categoryName using real products
    val layoutBlocks = remember(categoryName, products) {
        val categoryProducts = products.filter { it.category == categoryName || it.subCategory == categoryName }
        val flashSaleProducts = categoryProducts.filter { it.isFlashSale }
        
        val blocks = mutableListOf<CategoryBlock>()
        
        // Add Hero Banner
        blocks.add(CategoryBlock.HeroVideoBanner("url", "${categoryName.uppercase()} FESTIVAL"))
        
        // Add Top Brands if available
        val brands = categoryProducts.map { it.brand }.distinct().take(5)
        if (brands.isNotEmpty()) {
            blocks.add(CategoryBlock.SponsoredBrands(brands))
        }
        
        // Add Flash Sale if there are any
        if (flashSaleProducts.isNotEmpty()) {
            blocks.add(CategoryBlock.FlashSale("Midnight Steals", "Min 50% Off"))
        }
        
        // Add Product Grid for all category products
        if (categoryProducts.isNotEmpty()) {
            blocks.add(CategoryBlock.ProductGrid("Trending Now"))
        }
        
        blocks
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(categoryName, fontWeight = FontWeight.Black) },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, contentDescription = "Back") }
                },
                actions = {
                    IconButton(onClick = { }) { Icon(Icons.Default.Search, contentDescription = "Search") }
                    IconButton(onClick = { }) { Icon(Icons.Default.Share, contentDescription = "Share") }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DarkSlate,
                    titleContentColor = TextWhite,
                    navigationIconContentColor = TextWhite,
                    actionIconContentColor = TextWhite
                )
            )
        },
        containerColor = DarkSlate
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(bottom = 100.dp)
        ) {
            items(layoutBlocks.size) { index ->
                when (val block = layoutBlocks[index]) {
                    is CategoryBlock.HeroVideoBanner -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(220.dp)
                                .padding(16.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(Brush.linearGradient(listOf(CyberViolet, CyberVioletLight))),
                            contentAlignment = Alignment.BottomStart
                        ) {
                            Text(
                                text = block.title,
                                color = Color.White,
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black,
                                modifier = Modifier.padding(16.dp)
                            )
                        }
                    }
                    is CategoryBlock.SponsoredBrands -> {
                        Column(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
                            Text("SPONSORED TOP BRANDS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 16.dp))
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(
                                modifier = Modifier.horizontalScroll(rememberScrollState()).padding(horizontal = 16.dp),
                                horizontalArrangement = Arrangement.spacedBy(16.dp)
                            ) {
                                block.brands.forEach { brand ->
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Box(
                                            modifier = Modifier.size(64.dp).background(CardBackgroundDark, CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(brand.take(1), color = NeonGreen, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                                        }
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(brand, color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                                    }
                                }
                            }
                        }
                    }
                    is CategoryBlock.FlashSale -> {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color.Red.copy(alpha = 0.1f))
                                .padding(16.dp)
                        ) {
                            Column {
                                Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                    Column {
                                        Text(block.title, color = Color.Red, fontSize = 16.sp, fontWeight = FontWeight.Black)
                                        Text(block.discountText, color = TextWhite, fontSize = 14.sp)
                                    }
                                }
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                val flashSaleProducts = products.filter { (it.category == categoryName || it.subCategory == categoryName) && it.isFlashSale }
                                androidx.compose.foundation.lazy.LazyRow(
                                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    items(flashSaleProducts.size) { index ->
                                        val prod = flashSaleProducts[index]
                                        Box(modifier = Modifier.width(150.dp)) {
                                            com.example.ui.components.AuraProductCard(
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
                    }
                    is CategoryBlock.ProductGrid -> {
                        Text(block.title, color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(16.dp))
                        val categoryProducts = products.filter { it.category == categoryName || it.subCategory == categoryName }
                        val chunked = categoryProducts.chunked(2)
                        
                        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                            chunked.forEach { rowProducts ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(bottom = 12.dp),
                                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    rowProducts.forEach { prod ->
                                        Box(modifier = Modifier.weight(1f)) {
                                            com.example.ui.components.AuraProductCard(
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
        }
    }
}
