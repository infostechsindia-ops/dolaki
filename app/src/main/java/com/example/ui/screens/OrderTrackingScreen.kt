package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Order
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderTrackingScreen(
    order: Order?,
    onBackHomeClick: () -> Unit
) {
    if (order == null) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(DarkSlate),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator(color = CyberVioletLight)
        }
        return
    }

    // Determine coordinate animation factor according to order status
    val animationProgress by animateFloatAsState(
        targetValue = when (order.status) {
            "Placed" -> 0.05f
            "Preparing" -> 0.25f
            "Shipped" -> 0.55f
            "Out for Delivery" -> 0.85f
            "Delivered" -> 1.0f
            else -> 0.05f
        },
        animationSpec = tween(3000, easing = FastOutSlowInEasing),
        label = "bike_coord"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
    ) {
        TopAppBar(
            title = { Text("Instant Delivery Tracking", color = TextWhite, fontSize = 16.sp, fontWeight = FontWeight.Black) },
            actions = {
                IconButton(onClick = onBackHomeClick) {
                    Icon(imageVector = Icons.Default.Home, contentDescription = "Home", tint = TextWhite)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkSlate)
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Live Interactive Cyber Map Canvas
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .border(1.dp, TextWhite.copy(alpha = 0.12f), RoundedCornerShape(20.dp)),
                color = CardBackgroundDark
            ) {
                Box(modifier = Modifier.fillMaxSize()) {
                    Canvas(modifier = Modifier.fillMaxSize()) {
                        val w = size.width
                        val h = size.height

                        // Draw deep space grids (Cyberpunk style map roads)
                        val gridPaintColor = TextWhite.copy(alpha = 0.05f)
                        val roadColor = Color(0xFF232A4B)

                        // Roads
                        drawRect(color = roadColor, topLeft = Offset(0f, h * 0.3f), size = androidx.compose.ui.geometry.Size(w, 24f))
                        drawRect(color = roadColor, topLeft = Offset(w * 0.4f, 0f), size = androidx.compose.ui.geometry.Size(24f, h))
                        drawRect(color = roadColor, topLeft = Offset(0f, h * 0.7f), size = androidx.compose.ui.geometry.Size(w, 24f))

                        // Draw grid lines
                        for (i in 0..10) {
                            val x = i * (w / 10f)
                            drawLine(color = gridPaintColor, start = Offset(x, 0f), end = Offset(x, h))
                            val y = i * (h / 10f)
                            drawLine(color = gridPaintColor, start = Offset(0f, y), end = Offset(w, y))
                        }

                        // Coordinates
                        val darkstoreCoord = Offset(w * 0.15f, h * 0.3f + 12f)
                        val userHomeCoord = Offset(w * 0.85f, h * 0.7f + 12f)

                        // Route path connection dotted line
                        drawLine(
                            color = NeonGreen.copy(alpha = 0.4f),
                            start = darkstoreCoord,
                            end = userHomeCoord,
                            strokeWidth = 4f,
                            pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
                        )

                        // Draw Darkstore center point
                        drawCircle(color = CyberViolet, radius = 10f, center = darkstoreCoord)
                        drawCircle(color = Color.White, radius = 4f, center = darkstoreCoord)

                        // Draw Home Pin center point
                        drawCircle(color = Color.Red, radius = 10f, center = userHomeCoord)
                        drawCircle(color = Color.White, radius = 4f, center = userHomeCoord)

                        // Animating courier position coordinates
                        val courierX = darkstoreCoord.x + (userHomeCoord.x - darkstoreCoord.x) * animationProgress
                        val courierY = darkstoreCoord.y + (userHomeCoord.y - darkstoreCoord.y) * animationProgress
                        val courierCoord = Offset(courierX, courierY)

                        // Courier glowing indicator
                        drawCircle(color = NeonGreen.copy(alpha = 0.3f), radius = 18f, center = courierCoord)
                        drawCircle(color = NeonGreen, radius = 8f, center = courierCoord)
                        drawCircle(color = Color.White, radius = 3f, center = courierCoord)
                    }

                    // Map Text Overlays
                    Text(
                        text = "Aura Darkstore",
                        color = CyberViolet,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .padding(top = 35.dp, start = 25.dp)
                    )

                    Text(
                        text = "Your Home",
                        color = Color.Red,
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier
                            .align(Alignment.BottomEnd)
                            .padding(bottom = 35.dp, end = 25.dp)
                    )

                    // Map label floating top left
                    Box(
                        modifier = Modifier
                            .padding(10.dp)
                            .background(Color.Black.copy(alpha = 0.7f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(6.dp).background(NeonGreen, CircleShape))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("LIVE GPS RADAR CONNECTED", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            // Quick Status ETA card
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
            ) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                    Column {
                        Text(
                            text = if (order.status == "Delivered") "ORDER DELIVERED" else "ESTIMATED ARRIVAL TIME",
                            color = TextWhite.copy(alpha = 0.5f),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (order.status == "Delivered") "Thank you for shopping! 🎉" else "${order.deliveryMinutes} MINUTES",
                            color = if (order.status == "Delivered") NeonGreen else TextWhite,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(CyberViolet.copy(alpha = 0.15f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.DirectionsBike, contentDescription = null, tint = CyberViolet)
                    }
                }
            }

            // Secure Handover OTP verification box
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = NeonGreen.copy(alpha = 0.1f),
                border = BorderStroke(1.5.dp, NeonGreen.copy(alpha = 0.4f))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("SECURE HANDOVER VERIFICATION OTP", color = NeonGreen, fontSize = 10.sp, fontWeight = FontWeight.Black, letterSpacing = 0.5.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("Share this OTP with delivery partner upon package handover.", color = TextWhite.copy(alpha = 0.7f), fontSize = 11.sp)
                    }

                    Box(
                        modifier = Modifier
                            .background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(12.dp))
                            .border(1.dp, NeonGreen, RoundedCornerShape(12.dp))
                            .padding(horizontal = 14.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = order.verificationOtp,
                            color = Color.White,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 2.sp
                        )
                    }
                }
            }

            // Order Status Milestones Checklist
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("ORDER PROGRESS TIMELINE", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))

                    val milestones = listOf("Placed", "Preparing", "Shipped", "Out for Delivery", "Delivered")
                    val currentMilestoneIndex = milestones.indexOf(order.status).coerceAtLeast(0)

                    milestones.forEachIndexed { index, title ->
                        val isCompleted = index <= currentMilestoneIndex
                        val isActive = index == currentMilestoneIndex

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(bottom = 12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .background(
                                        if (isCompleted) NeonGreen else TextWhite.copy(alpha = 0.1f),
                                        CircleShape
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                if (isCompleted) {
                                    Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color.Black, modifier = Modifier.size(14.dp))
                                } else {
                                    Box(modifier = Modifier.size(6.dp).background(TextWhite.copy(alpha = 0.4f), CircleShape))
                                }
                            }

                            Spacer(modifier = Modifier.width(16.dp))

                            Column {
                                Text(
                                    text = title.uppercase(),
                                    color = if (isActive) TextWhite else if (isCompleted) TextWhite.copy(alpha = 0.8f) else TextWhite.copy(alpha = 0.4f),
                                    fontSize = 12.sp,
                                    fontWeight = if (isActive) FontWeight.Black else FontWeight.Bold
                                )
                                Text(
                                    text = when (title) {
                                        "Placed" -> "Order registered successfully"
                                        "Preparing" -> "Darkstore items packed under clean environments"
                                        "Shipped" -> "Assigned to nearest instant courier"
                                        "Out for Delivery" -> "Rider is heading your way on optimized routes"
                                        "Delivered" -> "Package hand-off secure"
                                        else -> ""
                                    },
                                    color = TextWhite.copy(alpha = 0.4f),
                                    fontSize = 10.sp
                                )
                            }
                        }
                    }
                }
            }

            // Rider details
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
            ) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(CyberViolet.copy(alpha = 0.2f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Person, contentDescription = null, tint = CyberViolet)
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text("YOUR AURA DELIVERY EXECUTIVE", color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Text("Rohan Sharma", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Star, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(12.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("4.9 Rated Executive (140 deliveries)", color = TextWhite.copy(alpha = 0.5f), fontSize = 11.sp)
                        }
                    }

                    IconButton(
                        onClick = {},
                        modifier = Modifier
                            .size(40.dp)
                            .background(CyberViolet, CircleShape)
                    ) {
                        Icon(imageVector = Icons.Default.Phone, contentDescription = "Call", tint = Color.White)
                    }
                }
            }
        }
    }
}
