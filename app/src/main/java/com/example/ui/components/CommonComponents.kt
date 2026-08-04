package com.example.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.foundation.BorderStroke
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Product
import com.example.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.json.JSONArray
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

// --- Animated Promo Sticker ---
@Composable
fun AnimatedPromoSticker(
    text: String,
    style: String = "glow", // bounce, pulse, glow, shake
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "sticker_anim")

    // Animations definition
    val scale by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = if (style == "pulse") 1.15f else 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    val offsetY by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = if (style == "bounce") -8f else 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "offsetY"
    )

    val rotation by infiniteTransition.animateFloat(
        initialValue = if (style == "shake") -5f else -2f,
        targetValue = if (style == "shake") 5f else 2f,
        animationSpec = infiniteRepeatable(
            animation = tween(200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "rotation"
    )

    val glowOpacity by infiniteTransition.animateFloat(
        initialValue = 0.3f,
        targetValue = if (style == "glow") 1.0f else 0.3f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glow"
    )

    val (bgGradient, textColor) = when (text.uppercase()) {
        "🔥 TRENDING", "HOT" -> Brush.linearGradient(listOf(Color(0xFFFF416C), Color(0xFFFF4B2B))) to Color.White
        "⚡ FLASH SALE", "LIVE" -> Brush.linearGradient(listOf(ElectricOrange, GoldYellow)) to Color.Black
        "🛒 FREE DELIVERY", "BOGO" -> Brush.linearGradient(listOf(NeonGreen, Color(0xFF00B0FF))) to Color.Black
        "LIMITED", "NEW" -> Brush.linearGradient(listOf(CyberViolet, Color(0xFFE040FB))) to Color.White
        else -> Brush.linearGradient(listOf(CyberViolet, NeonGreen)) to Color.White
    }

    Box(
        modifier = modifier
            .offset(y = offsetY.dp)
            .rotate(rotation)
            .scale(scale)
            .shadow(
                elevation = if (style == "glow") (10 * glowOpacity).dp else 4.dp,
                shape = RoundedCornerShape(8.dp),
                ambientColor = if (text.contains("⚡") || text.contains("🔥")) ElectricOrange else CyberViolet,
                spotColor = if (text.contains("⚡") || text.contains("🔥")) ElectricOrange else CyberViolet
            )
            .background(bgGradient, RoundedCornerShape(8.dp))
            .border(
                1.5.dp,
                if (style == "glow") Color.White.copy(alpha = glowOpacity) else Color.Transparent,
                RoundedCornerShape(8.dp)
            )
            .padding(horizontal = 10.dp, vertical = 5.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            color = textColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 1.sp
        )
    }
}

// --- Auto Sliding Hero Slider ---
@Composable
fun AutoSlidingHeroSlider(
    modifier: Modifier = Modifier,
    onCampaignClick: (String) -> Unit = {}
) {
    val campaigns = listOf(
        Triple("SUMMER COUTURE REDEFINED", "Upto 50% Off on Sabyasachi & Vogue Collections", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"),
        Triple("NEXT-GEN GLYPH TECH", "Get Nothing Phone (2a) + Cosmic Pods bundles at ₹25,999", "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800"),
        Triple("10-MIN ESSENTIALS BLAST", "Instant dairy, organic mangoes, snacks directly home", "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800")
    )

    var currentIndex by remember { mutableStateOf(0) }

    LaunchedEffect(key1 = currentIndex) {
        delay(4000)
        currentIndex = (currentIndex + 1) % campaigns.size
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(180.dp)
            .clip(RoundedCornerShape(24.dp))
            .clickable { onCampaignClick(campaigns[currentIndex].first) }
    ) {
        // Linear gradient background (Sleek festival gradient)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.linearGradient(
                        colors = listOf(
                            Color(0xFFEADDFF),
                            Color(0xFFD0BCFF)
                        )
                    )
                )
        )

        // Overlay layout design
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier
                    .weight(1.2f)
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.Center
            ) {
                AnimatedPromoSticker(text = "LIVE CAMPAIGN", style = "glow")
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = campaigns[currentIndex].first,
                    color = Color.Black,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    lineHeight = 22.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = campaigns[currentIndex].second,
                    color = Color.Black.copy(alpha = 0.8f),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // High aesthetic design token
            Box(
                modifier = Modifier
                    .weight(0.8f)
                    .fillMaxHeight()
                    .padding(8.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .border(1.dp, TextWhite.copy(alpha = 0.15f), RoundedCornerShape(16.dp))
                    .background(CyberViolet.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                coil.compose.AsyncImage(
                    model = campaigns[currentIndex].third,
                    contentDescription = "Campaign Image",
                    contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }
        }

        // Indicator Dots
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            campaigns.forEachIndexed { index, _ ->
                Box(
                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .size(width = if (index == currentIndex) 16.dp else 8.dp, height = 8.dp)
                        .clip(CircleShape)
                        .background(if (index == currentIndex) CyberVioletLight else TextWhite.copy(alpha = 0.2f))
                )
            }
        }
    }
}

// --- Aura Product Card ---
@Composable
fun AuraProductCard(
    product: Product,
    isWishlisted: Boolean,
    onWishlistToggle: () -> Unit,
    onProductClick: () -> Unit,
    onAddClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onProductClick() }
            .border(1.dp, TextWhite.copy(alpha = 0.08f), RoundedCornerShape(16.dp)),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardBackgroundDark)
    ) {
        Box(modifier = Modifier.fillMaxWidth()) {
            // Visual Banner Proxy with Category Specific Accent
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
                    .background(
                        Brush.verticalGradient(
                            listOf(
                                CyberViolet.copy(alpha = 0.08f),
                                CardBackgroundDark
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                // Product image loaded via Coil
                coil.compose.AsyncImage(
                    model = product.imageUrl,
                    contentDescription = product.title,
                    contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Flash sale or trending label overlay
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp)
                        .align(Alignment.TopStart),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    if (product.isFlashSale) {
                        Box(
                            modifier = Modifier
                                .background(ElectricOrange, RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 3.dp)
                        ) {
                            Text("⚡ FLASH SALE", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        }
                    } else if (product.isTrending) {
                        Box(
                            modifier = Modifier
                                .background(CyberViolet, RoundedCornerShape(6.dp))
                                .padding(horizontal = 6.dp, vertical = 3.dp)
                        ) {
                            Text("🔥 TRENDING", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        }
                    } else {
                        Spacer(modifier = Modifier.width(1.dp))
                    }

                    // Wishlist toggle
                    IconButton(
                        onClick = onWishlistToggle,
                        modifier = Modifier
                            .size(32.dp)
                            .background(Color.Black.copy(alpha = 0.4f), CircleShape)
                    ) {
                        Icon(
                            imageVector = if (isWishlisted) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Wishlist",
                            tint = if (isWishlisted) Color.Red else Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                // Delivery badge overlay bottom left
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(8.dp)
                        .background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 6.dp, vertical = 3.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.AccessTime,
                            contentDescription = null,
                            tint = if (product.isQuickCommerce) NeonGreen else CyberVioletLight,
                            modifier = Modifier.size(10.dp)
                        )
                        Spacer(modifier = Modifier.width(3.dp))
                        Text(
                            text = "${product.deliveryMinutes} mins",
                            color = Color.White,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Product metadata details
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
        ) {
            Text(
                text = product.brand.uppercase(),
                color = CyberViolet,
                fontSize = 9.sp,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 1.sp
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = product.title,
                color = TextWhite,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            // Rating Stars
            Row(
                modifier = Modifier.padding(vertical = 3.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = GoldYellow,
                    modifier = Modifier.size(12.dp)
                )
                Spacer(modifier = Modifier.width(2.dp))
                Text(
                    text = "${product.rating} (${product.reviewCount})",
                    color = TextWhite.copy(alpha = 0.6f),
                    fontSize = 10.sp
                )
            }

            // FOMO & Viral Indicators
            val fomoRandomizer = product.id.hashCode() % 3
            if (product.isTrending || fomoRandomizer == 0) {
                Text("🔥 ${(product.id.hashCode() % 300) + 20} people are viewing this", color = ElectricOrange, fontSize = 9.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 2.dp))
            } else if (fomoRandomizer == 1) {
                Text("⚡ ${(product.id.hashCode() % 50) + 5} sold in the last hour", color = NeonGreen, fontSize = 9.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 2.dp))
            } else {
                Text("👀 ${(product.id.hashCode() % 100) + 10} people added this to wishlist", color = CyberVioletLight, fontSize = 9.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(top = 2.dp))
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Pricing Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "₹${String.format("%,.0f", product.price)}",
                        color = TextWhite,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Black
                    )
                    if (product.originalPrice > product.price) {
                        Text(
                            text = "₹${String.format("%,.0f", product.originalPrice)}",
                            color = TextWhite.copy(alpha = 0.4f),
                            fontSize = 11.sp,
                            textDecoration = TextDecoration.LineThrough
                        )
                    }
                }

                // Standard 48dp Interactive ADD button
                Button(
                    onClick = onAddClick,
                    modifier = Modifier
                        .height(32.dp)
                        .widthIn(min = 60.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (product.isQuickCommerce) NeonGreen else CyberViolet,
                        contentColor = Color.White
                    ),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 0.dp),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = "ADD",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.5.sp
                    )
                }
            }
        }
    }
}

// --- AI Assistant Floating Sheet Overlay ---
@Composable
fun AiAssistantOverlay(
    chatHistory: List<Pair<String, String>>,
    isLoading: Boolean,
    onSendMessage: (String) -> Unit,
    onCloseClick: () -> Unit
) {
    var queryText by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.6f))
            .clickable { onCloseClick() }, // tap outside to dismiss
        contentAlignment = Alignment.BottomCenter
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.75f)
                .clickable(enabled = false) {}, // prevent closing on inner tap
            shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
            colors = CardDefaults.cardColors(containerColor = DarkSlate),
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.15f))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(CyberViolet, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text("AURA ASSISTANT", color = Color.White, fontSize = 16.sp, fontWeight = FontWeight.Black)
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(modifier = Modifier.size(6.dp).background(NeonGreen, CircleShape))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Powered by Gemini 3.5 Flash", color = Color.White.copy(alpha = 0.6f), fontSize = 10.sp)
                            }
                        }
                    }

                    IconButton(onClick = onCloseClick) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 12.dp), color = Color.White.copy(alpha = 0.1f))

                // Chat Messages Scrollable list
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                ) {
                    androidx.compose.foundation.lazy.LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        reverseLayout = false,
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        itemsIndexed(chatHistory) { _, message ->
                            val isUser = message.first == "user"
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                            ) {
                                Card(
                                    shape = RoundedCornerShape(
                                        topStart = 16.dp,
                                        topEnd = 16.dp,
                                        bottomStart = if (isUser) 16.dp else 0.dp,
                                        bottomEnd = if (isUser) 0.dp else 16.dp
                                    ),
                                    colors = CardDefaults.cardColors(
                                        containerColor = if (isUser) CyberViolet else CardBackgroundDark
                                    ),
                                    border = BorderStroke(1.dp, Color.White.copy(alpha = 0.08f)),
                                    modifier = Modifier.widthIn(max = 280.dp)
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Text(
                                            text = message.second,
                                            color = Color.White,
                                            fontSize = 13.sp,
                                            lineHeight = 18.sp
                                        )
                                    }
                                }
                            }
                        }

                        if (isLoading) {
                            item {
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(8.dp),
                                    horizontalArrangement = Arrangement.Start,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    CircularProgressIndicator(
                                        modifier = Modifier.size(16.dp),
                                        strokeWidth = 2.dp,
                                        color = CyberVioletLight
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Aura is typing suggestions...", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp)
                                }
                            }
                        }
                    }
                }

                // Preset recommended prompts to encourage interaction
                val context = LocalContext.current
                Text(
                    "Try asking Aura:",
                    color = Color.White.copy(alpha = 0.5f),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 6.dp, top = 8.dp)
                )

                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
                ) {
                    val promptList = listOf(
                        "Suggest Gen-Z style phones 📱",
                        "Show me ethnic festive outfits 👗",
                        "Are there any organic mangoes? mango",
                        "What coupon codes can I use? 🎁"
                    )
                    itemsIndexed(promptList) { _, p ->
                        Surface(
                            modifier = Modifier.clickable {
                                onSendMessage(p.substringBefore("📱").substringBefore("👗").substringBefore("mango").substringBefore("🎁").trim())
                            },
                            shape = RoundedCornerShape(12.dp),
                            color = CardBackgroundDark,
                            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.12f))
                        ) {
                            Text(
                                text = p,
                                color = Color.White,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }

                // Input box
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextField(
                        value = queryText,
                        onValueChange = { queryText = it },
                        placeholder = { Text("Ask Aura about products...", color = Color.White.copy(alpha = 0.4f)) },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = CardBackgroundDark,
                            unfocusedContainerColor = CardBackgroundDark,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(24.dp))
                            .border(1.dp, Color.White.copy(alpha = 0.15f), RoundedCornerShape(24.dp)),
                        shape = RoundedCornerShape(24.dp)
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    IconButton(
                        onClick = {
                            if (queryText.isNotBlank()) {
                                onSendMessage(queryText)
                                queryText = ""
                            }
                        },
                        modifier = Modifier
                            .size(48.dp)
                            .background(CyberViolet, CircleShape)
                    ) {
                        Icon(imageVector = Icons.Default.Send, contentDescription = "Send", tint = Color.White)
                    }
                }
            }
        }
    }
}

// --- Dynamic Canvas Spin Wheel Game ---
@Composable
fun SpinWheelGame(
    onResultGained: (String) -> Unit,
    onDismissRequest: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    var isSpinning by remember { mutableStateOf(false) }
    var currentRotation by remember { mutableStateOf(0f) }

    val prizes = listOf("₹50 Cash", "100 Points", "Free Delivery", "10% Coupon", "Try Tomorrow")
    val sectorAngle = 360f / prizes.size

    val targetRotationAnimation = remember { Animatable(0f) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.8f))
            .clickable { if (!isSpinning) onDismissRequest() },
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .width(320.dp)
                .padding(16.dp)
                .clickable(enabled = false) {},
            colors = CardDefaults.cardColors(containerColor = CardBackgroundDark),
            shape = RoundedCornerShape(24.dp),
            border = BorderStroke(2.dp, CyberVioletLight)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("AURA FORTUNE WHEEL", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Black)
                Text("Spin to win real credits & coupons!", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp, modifier = Modifier.padding(bottom = 16.dp))

                Box(
                    modifier = Modifier
                        .size(220.dp)
                        .padding(10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    // Draw Wheel
                    Canvas(
                        modifier = Modifier
                            .fillMaxSize()
                            .rotate(targetRotationAnimation.value)
                    ) {
                        val center = Offset(size.width / 2, size.height / 2)
                        val radius = size.width / 2

                        val sectorColors = listOf(
                            Color(0xFF6200EE),
                            Color(0xFF3700B3),
                            Color(0xFF03DAC6),
                            Color(0xFF018786),
                            Color(0xFFFF0266)
                        )

                        for (i in prizes.indices) {
                            val startAngle = i * sectorAngle
                            drawArc(
                                color = sectorColors[i % sectorColors.size],
                                startAngle = startAngle,
                                sweepAngle = sectorAngle,
                                useCenter = true,
                                size = Size(radius * 2, radius * 2),
                                topLeft = Offset(center.x - radius, center.y - radius)
                            )
                        }

                        // Center pin circle
                        drawCircle(color = Color.White, radius = 12f, center = center)
                    }

                    // Indicator Needle (fixed at top pointing down)
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val center = Offset(size.width / 2, size.height / 2)
                        val path = Path().apply {
                            moveTo(center.x, center.y - (size.height / 2) + 10f)
                            lineTo(center.x - 12f, center.y - (size.height / 2) - 15f)
                            lineTo(center.x + 12f, center.y - (size.height / 2) - 15f)
                            close()
                        }
                        drawPath(path = path, color = Color.White)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        if (!isSpinning) {
                            isSpinning = true
                            coroutineScope.launch {
                                val randomSector = prizes.indices.random()
                                val randomSpins = (5..10).random()
                                val targetAngle = (randomSpins * 360f) + (randomSector * sectorAngle) + (sectorAngle / 2)

                                targetRotationAnimation.animateTo(
                                    targetValue = targetAngle,
                                    animationSpec = tween(
                                        durationMillis = 3500,
                                        easing = FastOutSlowInEasing
                                    )
                                )

                                val result = prizes[randomSector]
                                onResultGained(result)
                                isSpinning = false
                            }
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CyberViolet),
                    shape = RoundedCornerShape(12.dp),
                    enabled = !isSpinning
                ) {
                    Text("SPIN NOW", color = Color.White, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(10.dp))

                TextButton(onClick = onDismissRequest, enabled = !isSpinning) {
                    Text("Close", color = Color.White.copy(alpha = 0.5f))
                }
            }
        }
    }
}

// --- Scratch Card Game Simulator ---
@Composable
fun ScratchCardGame(
    onDismissRequest: () -> Unit
) {
    var isScratched by remember { mutableStateOf(false) }
    var pointsScratched = remember { mutableStateListOf<Offset>() }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.8f))
            .clickable { onDismissRequest() },
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .width(300.dp)
                .padding(16.dp)
                .clickable(enabled = false) {},
            colors = CardDefaults.cardColors(containerColor = CardBackgroundDark),
            shape = RoundedCornerShape(24.dp),
            border = BorderStroke(2.dp, NeonGreen)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("AURA SCRATCH CARD", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Black)
                Text("Swipe your finger to scratch and reveal coupon!", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp, modifier = Modifier.padding(bottom = 16.dp))

                Box(
                    modifier = Modifier
                        .size(200.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .border(2.dp, Color.White.copy(alpha = 0.2f), RoundedCornerShape(16.dp))
                ) {
                    // Secret Coupon Revealed behind Scratch layer
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(DarkSlate),
                        verticalArrangement = Arrangement.Center,
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(imageVector = Icons.Default.CardGiftcard, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(48.dp))
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("CONGRATS!", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Use Coupon:", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Box(
                            modifier = Modifier
                                .background(CyberViolet.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                                .border(1.dp, CyberVioletLight, RoundedCornerShape(8.dp))
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text("AURA20", color = Color.White, fontWeight = FontWeight.Black, letterSpacing = 2.sp)
                        }
                    }

                    // Scratch coating canvas
                    Canvas(
                        modifier = Modifier
                            .fillMaxSize()
                            .pointerInput(Unit) {
                                detectDragGestures { change, dragAmount ->
                                    change.consume()
                                    pointsScratched.add(change.position)
                                    if (pointsScratched.size > 80) {
                                        isScratched = true
                                    }
                                }
                            }
                    ) {
                        if (!isScratched) {
                            // Draw grey scratch layer cover
                            drawRect(
                                color = Color.DarkGray,
                                size = Size(size.width, size.height)
                            )

                            // Clear scratched portions using blend modes
                            clipRect {
                                pointsScratched.forEach { point ->
                                    drawCircle(
                                        color = Color.Transparent,
                                        radius = 35f,
                                        center = point,
                                        blendMode = androidx.compose.ui.graphics.BlendMode.Clear
                                    )
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = onDismissRequest,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = NeonGreen, contentColor = Color.Black),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("DONE", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

// --- Sponsored Brands Showcase Horizontal Strip ---
@Composable
fun SponsoredBrandsShowcase(
    modifier: Modifier = Modifier
) {
    val sponsors = listOf(
        Pair("SONY AUDIO", Icons.Default.Audiotrack),
        Pair("ZARA FASHION", Icons.Default.Style),
        Pair("LANEIGE", Icons.Default.Face),
        Pair("NOTHING TECH", Icons.Default.Devices),
        Pair("SABYASACHI", Icons.Default.AutoAwesome),
        Pair("AMUL FRESH", Icons.Default.LocalMall)
    )

    Column(
        modifier = modifier
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
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(CyberViolet, CircleShape)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "SPONSORED PARTNERS",
                    color = TextWhite.copy(alpha = 0.5f),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
            }
            Text(
                text = "OFFICIAL BRAND TIERS",
                color = NeonGreen,
                fontSize = 9.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 0.5.sp
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(sponsors.size) { index ->
                val (name, icon) = sponsors[index]
                Surface(
                    modifier = Modifier
                        .height(44.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .border(1.dp, TextWhite.copy(alpha = 0.08f), RoundedCornerShape(12.dp)),
                    color = CardBackgroundDark
                ) {
                    Row(
                        modifier = Modifier
                            .padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            tint = CyberVioletLight,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = name,
                            color = TextWhite,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .background(TextWhite.copy(alpha = 0.1f), RoundedCornerShape(4.dp))
                                .padding(horizontal = 4.dp, vertical = 2.dp)
                        ) {
                            Text("AD", color = TextWhite.copy(alpha = 0.6f), fontSize = 7.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

// --- Interactive Advertisement Banner ---
@Composable
fun InteractiveAdBanner(
    modifier: Modifier = Modifier,
    onAdClick: () -> Unit = {}
) {
    var adClaimed by remember { mutableStateOf(false) }

    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .clickable { onAdClick() }
            .border(1.dp, CyberViolet.copy(alpha = 0.3f), RoundedCornerShape(20.dp)),
        color = CardBackgroundDark
    ) {
        Column(
            modifier = Modifier
                .background(
                    Brush.verticalGradient(
                        listOf(CyberViolet.copy(alpha = 0.15f), Color.Transparent)
                    )
                )
                .padding(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Campaign,
                        contentDescription = null,
                        tint = ElectricOrange,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "FEATURED PROMOTION",
                        color = ElectricOrange,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                }
                Box(
                    modifier = Modifier
                        .background(TextWhite.copy(alpha = 0.15f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text("SPONSORED", color = TextWhite.copy(alpha = 0.6f), fontSize = 8.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "AURA SOUNDS INFINITE EDITION",
                color = Color.White,
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 0.5.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Experience absolute sensory audio depth with 50-hour smart hybrid active noise canceling. Pure metallic cyber aesthetic shell casing.",
                color = TextWhite.copy(alpha = 0.6f),
                fontSize = 11.sp,
                lineHeight = 15.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "EXCLUSIVE OFFER",
                        color = TextWhite.copy(alpha = 0.4f),
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "₹2,999 only (Save ₹2,000)",
                        color = NeonGreen,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Black
                    )
                }

                Button(
                    onClick = { adClaimed = !adClaimed },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (adClaimed) NeonGreen else CyberViolet,
                        contentColor = if (adClaimed) Color.Black else Color.White
                    ),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp),
                    modifier = Modifier.height(34.dp)
                ) {
                    Text(
                        text = if (adClaimed) "PROMO APPLIED!" else "CLAIM VIBE20",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }
    }
}
