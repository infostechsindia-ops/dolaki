package com.example.ui.screens

import android.widget.Toast
import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.components.*
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    userRole: String,
    onRoleChange: (String) -> Unit,
    wallet: UserWallet?,
    orders: List<Order>,
    allProducts: List<Product>,
    vendors: List<Vendor>,
    onVendorAddProduct: (String, String, Double, String, String, Boolean) -> Unit,
    onAdminToggleFlashSale: (Int, Boolean) -> Unit,
    onTriggerSpinGame: () -> Unit,
    onTriggerScratchGame: () -> Unit,
    onTrackOrder: (Int) -> Unit
) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
    ) {
        // Upper Simulation Role segment bar
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = CardBackgroundDark,
            tonalElevation = 6.dp
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "AURA WORKSPACE SIMULATOR",
                    color = CyberVioletLight,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.5.sp,
                    modifier = Modifier.padding(bottom = 10.dp)
                )

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DarkSlate, RoundedCornerShape(12.dp))
                        .padding(4.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    val roles = listOf("Customer", "Vendor", "Admin")
                    roles.forEach { role ->
                        val isSelected = role == userRole
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(10.dp))
                                .background(if (isSelected) CyberViolet else Color.Transparent)
                                .clickable { onRoleChange(role) }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = role.uppercase(),
                                color = if (isSelected) Color.White else Color.White.copy(alpha = 0.5f),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }
                }
            }
        }

        // Render appropriate Panel
        when (userRole) {
            "Customer" -> CustomerProfilePanel(
                wallet = wallet,
                orders = orders,
                onTriggerSpinGame = onTriggerSpinGame,
                onTriggerScratchGame = onTriggerScratchGame,
                onTrackOrder = onTrackOrder
            )
            "Vendor" -> VendorProfilePanel(
                vendors = vendors,
                allProducts = allProducts,
                onAddProduct = { title, desc, price, cat, b, isQuick ->
                    onVendorAddProduct(title, desc, price, cat, b, isQuick)
                    Toast.makeText(context, "Product uploaded! Check Home screen.", Toast.LENGTH_LONG).show()
                }
            )
            "Admin" -> AdminProfilePanel(
                products = allProducts,
                onToggleFlash = onAdminToggleFlashSale
            )
        }
    }
}

// --- Customer view layout ---
@Composable
fun CustomerProfilePanel(
    wallet: UserWallet?,
    orders: List<Order>,
    onTriggerSpinGame: () -> Unit,
    onTriggerScratchGame: () -> Unit,
    onTrackOrder: (Int) -> Unit
) {
    val context = LocalContext.current
    var showAddressDialog by remember { mutableStateOf(false) }
    var showNotificationDialog by remember { mutableStateOf(false) }
    var showVipDialog by remember { mutableStateOf(false) }

    // Interactive data states
    var addressList by remember { mutableStateOf(listOf(
        "Aman Kumar, Flat 402, Cyber Tower A, Sector 62, Noida, UP - 201301",
        "Aman Kumar, House 14, Main Mall Road, Indiranagar, Bengaluru, KA - 560038"
    )) }
    var newAddressInput by remember { mutableStateOf("") }

    var orderNotificationActive by remember { mutableStateOf(true) }
    var flashSaleNotificationActive by remember { mutableStateOf(false) }
    var dailyRecommendationsNotificationActive by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // User Card Banner
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            color = CardBackgroundDark,
            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .background(CyberViolet.copy(alpha = 0.15f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.Person, contentDescription = null, tint = CyberVioletLight, modifier = Modifier.size(28.dp))
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column {
                    Text(text = "Aman Kumar", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Black)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "AURA CLUB MEMBER TIER-1", color = GoldYellow, fontSize = 9.sp, fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp)
                    }
                }
            }
        }

        // Wallet Balance Summary Card
        wallet?.let { w ->
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
            ) {
                Row(
                    modifier = Modifier
                        .background(
                            Brush.horizontalGradient(
                                listOf(CyberViolet.copy(alpha = 0.2f), Color.Transparent)
                            )
                        )
                        .padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("AURA WALLET BALANCE", color = Color.White.copy(alpha = 0.5f), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("₹${String.format("%,.2f", w.balance)}", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Black)
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text("REWARD POINTS", color = Color.White.copy(alpha = 0.5f), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.CardGiftcard, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("${w.rewardPoints} pts", color = NeonGreen, fontSize = 18.sp, fontWeight = FontWeight.Black)
                        }
                    }
                }
            }
        }

        // Gamified loyalty reward center launcher
        Column {
            Text("LOYALTY REWARDS CENTER", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                // Game 1
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onTriggerSpinGame() },
                    shape = RoundedCornerShape(16.dp),
                    color = CardBackgroundDark,
                    border = BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
                ) {
                    Column(modifier = Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(modifier = Modifier.size(36.dp).background(CyberViolet.copy(alpha = 0.2f), CircleShape), contentAlignment = Alignment.Center) {
                            Icon(imageVector = Icons.Default.Casino, contentDescription = null, tint = CyberVioletLight)
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Aura Wheel", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Black)
                        Text("Spin & Win cash!", color = Color.White.copy(alpha = 0.5f), fontSize = 10.sp, textAlign = TextAlign.Center)
                    }
                }

                // Game 2
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onTriggerScratchGame() },
                    shape = RoundedCornerShape(16.dp),
                    color = CardBackgroundDark,
                    border = BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
                ) {
                    Column(modifier = Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(modifier = Modifier.size(36.dp).background(NeonGreen.copy(alpha = 0.15f), CircleShape), contentAlignment = Alignment.Center) {
                            Icon(imageVector = Icons.Default.CardGiftcard, contentDescription = null, tint = NeonGreen)
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text("Scratch Card", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Black)
                        Text("Scratch for coupons", color = Color.White.copy(alpha = 0.5f), fontSize = 10.sp, textAlign = TextAlign.Center)
                    }
                }
            }
        }

        // Customer Order History Lists
        Column {
            Text("ORDER HISTORY", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 10.dp))

            if (orders.isEmpty()) {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    color = CardBackgroundDark
                ) {
                    Box(modifier = Modifier.padding(24.dp), contentAlignment = Alignment.Center) {
                        Text("No orders placed yet. Add items to cart!", color = Color.White.copy(alpha = 0.4f), fontSize = 12.sp)
                    }
                }
            } else {
                orders.forEach { ord ->
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 10.dp)
                            .clickable { onTrackOrder(ord.id) },
                        shape = RoundedCornerShape(16.dp),
                        color = CardBackgroundDark,
                        border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                                Text("ORDER #AM-${1000 + ord.id}", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Black)
                                Box(
                                    modifier = Modifier
                                        .background(
                                            if (ord.status == "Delivered") NeonGreen.copy(alpha = 0.15f) else CyberViolet.copy(alpha = 0.15f),
                                            RoundedCornerShape(6.dp)
                                        )
                                        .padding(horizontal = 8.dp, vertical = 3.dp)
                                ) {
                                    Text(ord.status.uppercase(), color = if (ord.status == "Delivered") NeonGreen else CyberVioletLight, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(ord.itemsSummary, color = TextWhite.copy(alpha = 0.6f), fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                            Spacer(modifier = Modifier.height(10.dp))
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Paid: ₹${String.format("%,.2f", ord.totalAmount)}", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Text(ord.paymentMethod, color = TextWhite.copy(alpha = 0.4f), fontSize = 11.sp)
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                            HorizontalDivider(color = TextWhite.copy(alpha = 0.05f))
                            Spacer(modifier = Modifier.height(12.dp))

                            // Embedded LiveOrderTracking progress bar component
                            val milestones = listOf("Placed", "Preparing", "Shipped", "Out for Delivery", "Delivered")
                            val currentMilestoneIndex = milestones.indexOf(ord.status).coerceAtLeast(0)
                            
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                milestones.forEachIndexed { index, milestone ->
                                    val isCompleted = index <= currentMilestoneIndex
                                    val isActive = index == currentMilestoneIndex
                                    
                                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.weight(1f)) {
                                        Box(
                                            modifier = Modifier
                                                .size(16.dp)
                                                .background(
                                                    if (isCompleted) NeonGreen else TextWhite.copy(alpha = 0.1f),
                                                    androidx.compose.foundation.shape.CircleShape
                                                ),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            if (isCompleted) {
                                                Icon(imageVector = Icons.Default.Check, contentDescription = null, tint = Color.Black, modifier = Modifier.size(10.dp))
                                            }
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = milestone,
                                            color = if (isActive) TextWhite else if (isCompleted) TextWhite.copy(alpha = 0.8f) else TextWhite.copy(alpha = 0.4f),
                                            fontSize = 8.sp,
                                            fontWeight = if (isActive) FontWeight.Black else FontWeight.Bold,
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                    }

                                    if (index < milestones.size - 1) {
                                        Box(
                                            modifier = Modifier
                                                .weight(0.5f)
                                                .height(2.dp)
                                                .background(if (index < currentMilestoneIndex) NeonGreen else TextWhite.copy(alpha = 0.1f))
                                        )
                                    }
                                }
                            }
                            
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.Center,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Click to Live-Track GPS", color = CyberVioletLight, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                Icon(imageVector = Icons.Default.ChevronRight, contentDescription = null, tint = CyberVioletLight, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
            }
        }

        // --- CUSTOMER PROFILE MENU CONTROLS ---
        Column {
            Text("AURA APP CONTROLS & SETTINGS", color = Color.White.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 10.dp))

            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
            ) {
                Column {
                    // Menu Item 1: Saved Addresses
                    ProfileMenuItem(
                        icon = Icons.Default.LocationOn,
                        title = "Saved Addresses",
                        subtitle = "Manage your delivery locations (${addressList.size} active)",
                        onClick = { showAddressDialog = true }
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.05f))

                    // Menu Item 2: Notification Preferences
                    ProfileMenuItem(
                        icon = Icons.Default.Notifications,
                        title = "Notification Preferences",
                        subtitle = "Toggles for delivery alerts & flash drops",
                        onClick = { showNotificationDialog = true }
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.05f))

                    // Menu Item 3: VIP Membership Details
                    ProfileMenuItem(
                        icon = Icons.Default.WorkspacePremium,
                        title = "Aura VIP Club Privileges",
                        subtitle = "Check your current Tier-1 status benefits",
                        onClick = { showVipDialog = true }
                    )

                    HorizontalDivider(color = Color.White.copy(alpha = 0.05f))

                    // Menu Item 4: Developer Telemetry / Reset Data
                    ProfileMenuItem(
                        icon = Icons.Default.SettingsSuggest,
                        title = "Developer Sandbox Controls",
                        subtitle = "Reset DB state or clear simulation metrics",
                        onClick = {
                            addressList = listOf(
                                "Aman Kumar, Flat 402, Cyber Tower A, Sector 62, Noida, UP - 201301",
                                "Aman Kumar, House 14, Main Mall Road, Indiranagar, Bengaluru, KA - 560038"
                            )
                            orderNotificationActive = true
                            flashSaleNotificationActive = false
                            dailyRecommendationsNotificationActive = true
                            android.widget.Toast.makeText(context, "Sandbox values reset successfully!", android.widget.Toast.LENGTH_SHORT).show()
                        }
                    )
                }
            }
        }
    }

    // --- INTERACTIVE MODAL DIALOGS FOR PROFILE OPTIONS ---

    if (showAddressDialog) {
        AlertDialog(
            onDismissRequest = { showAddressDialog = false },
            title = {
                Text(
                    "SAVED ADDRESSES",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp,
                    color = CyberVioletLight
                )
            },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        "Manage your shipping and billing coordinates:",
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 11.sp
                    )

                    addressList.forEach { addr ->
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(10.dp),
                            color = DarkSlate,
                            border = BorderStroke(1.dp, Color.White.copy(alpha = 0.08f))
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = NeonGreen,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = addr,
                                    color = Color.White,
                                    fontSize = 11.sp,
                                    lineHeight = 15.sp,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        "ADD NEW ADDRESS",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White.copy(alpha = 0.5f)
                    )

                    OutlinedTextField(
                        value = newAddressInput,
                        onValueChange = { newAddressInput = it },
                        placeholder = { Text("Enter custom delivery address...", fontSize = 11.sp, color = Color.White.copy(alpha = 0.3f)) },
                        textStyle = LocalTextStyle.current.copy(color = Color.White, fontSize = 11.sp),
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CyberViolet,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.12f),
                            focusedContainerColor = DarkSlate,
                            unfocusedContainerColor = DarkSlate
                        ),
                        singleLine = true
                    )

                    Button(
                        onClick = {
                            if (newAddressInput.isNotBlank()) {
                                addressList = addressList + newAddressInput
                                newAddressInput = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = CyberViolet),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth().height(36.dp)
                    ) {
                        Text("Add to Wallet Addresses", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showAddressDialog = false }) {
                    Text("CLOSE", color = NeonGreen, fontWeight = FontWeight.Bold)
                }
            },
            containerColor = CardBackgroundDark,
            tonalElevation = 8.dp
        )
    }

    if (showNotificationDialog) {
        AlertDialog(
            onDismissRequest = { showNotificationDialog = false },
            title = {
                Text(
                    "ALERT SETTINGS",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp,
                    color = CyberVioletLight
                )
            },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        "Manage your real-time notification switches:",
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 11.sp
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Order Status Updates", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("Live delivery tracking status alerts", color = Color.White.copy(alpha = 0.5f), fontSize = 10.sp)
                        }
                        Switch(
                            checked = orderNotificationActive,
                            onCheckedChange = { orderNotificationActive = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = NeonGreen,
                                checkedTrackColor = NeonGreen.copy(alpha = 0.3f)
                            )
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Flash Sale Drops", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("Get notified when lightning deals drop", color = Color.White.copy(alpha = 0.5f), fontSize = 10.sp)
                        }
                        Switch(
                            checked = flashSaleNotificationActive,
                            onCheckedChange = { flashSaleNotificationActive = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = NeonGreen,
                                checkedTrackColor = NeonGreen.copy(alpha = 0.3f)
                            )
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Daily Vibe Picks", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            Text("Personalized product drop recommendations", color = Color.White.copy(alpha = 0.5f), fontSize = 10.sp)
                        }
                        Switch(
                            checked = dailyRecommendationsNotificationActive,
                            onCheckedChange = { dailyRecommendationsNotificationActive = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = NeonGreen,
                                checkedTrackColor = NeonGreen.copy(alpha = 0.3f)
                            )
                        )
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showNotificationDialog = false }) {
                    Text("SAVE & CLOSE", color = NeonGreen, fontWeight = FontWeight.Bold)
                }
            },
            containerColor = CardBackgroundDark,
            tonalElevation = 8.dp
        )
    }

    if (showVipDialog) {
        AlertDialog(
            onDismissRequest = { showVipDialog = false },
            title = {
                Text(
                    "AURA CLUB VIP TIERS",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp,
                    color = GoldYellow
                )
            },
            text = {
                Column(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.horizontalGradient(
                                    listOf(GoldYellow.copy(alpha = 0.15f), Color.Transparent)
                                )
                            )
                            .padding(12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.WorkspacePremium,
                                contentDescription = null,
                                tint = GoldYellow,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("Tier-1 Ambassador Vibe", color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Black)
                                Text("Aura Score: 1,500 XP achieved", color = GoldYellow, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Text(
                        "Enjoy our standard VIP tier benefits across India:",
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 11.sp
                    )

                    val benefits = listOf(
                        "⚡ FREE Instant Delivery: No delivery charges on Quick Commerce orders",
                        "💎 Early Drop Access: Sabyasachi & exclusive fashion drops 2 hours early",
                        "🧠 VIP Priority AI: Lightning-fast responses from Aura AI partner",
                        "🎟️ 10% Extra Rewards: Gained points on every standard catalog purchase"
                    )

                    benefits.forEach { benefit ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.Top
                        ) {
                            Text(
                                text = "•",
                                color = GoldYellow,
                                fontSize = 14.sp,
                                modifier = Modifier.padding(end = 8.dp)
                            )
                            Text(
                                text = benefit,
                                color = Color.White.copy(alpha = 0.8f),
                                fontSize = 11.sp,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showVipDialog = false }) {
                    Text("VIBE ALIVE", color = GoldYellow, fontWeight = FontWeight.Bold)
                }
            },
            containerColor = CardBackgroundDark,
            tonalElevation = 8.dp
        )
    }
}

// --- Vendor panel Simulation layout ---
@Composable
fun VendorProfilePanel(
    vendors: List<Vendor>,
    allProducts: List<Product>,
    onAddProduct: (String, String, Double, String, String, Boolean) -> Unit
) {
    // Local Product Formulation state
    var titleText by remember { mutableStateOf("") }
    var descText by remember { mutableStateOf("") }
    var priceText by remember { mutableStateOf("") }
    var brandText by remember { mutableStateOf("") }
    var categorySel by remember { mutableStateOf("Fashion") }
    var isQuickCommerceSel by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Vendor Header
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            color = CardBackgroundDark,
            border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
        ) {
            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(54.dp).background(CyberViolet.copy(alpha = 0.2f), CircleShape), contentAlignment = Alignment.Center) {
                    Icon(imageVector = Icons.Default.Storefront, contentDescription = null, tint = CyberViolet, modifier = Modifier.size(28.dp))
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Vogue Couture India", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Black)
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(imageVector = Icons.Default.Verified, contentDescription = "Verified", tint = NeonGreen, modifier = Modifier.size(14.dp))
                    }
                    Text("Vendor Level 4 Partner • Settlements Complete", color = TextWhite.copy(alpha = 0.5f), fontSize = 11.sp)
                }
            }
        }

        // Analytics Ledger Grid
        Column {
            Text("FINANCE & SALES LEDGER", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp)) {
                // Card 1
                Surface(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), color = CardBackgroundDark) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("TOTAL SALES GMV", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text("₹2,40,000", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Black)
                    }
                }
                // Card 2
                Surface(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), color = CardBackgroundDark) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("PLATFORM SETTLEMENTS", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text("₹1,92,000", color = NeonGreen, fontSize = 18.sp, fontWeight = FontWeight.Black)
                    }
                }
            }
        }

        // Dynamic Product Formulation Ingestion
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            color = CardBackgroundDark,
            border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Text("UPLOAD NEW MARKETPLACE PRODUCT", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                Text("Ingest details to publish directly to the catalog database.", color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp, modifier = Modifier.padding(bottom = 16.dp))

                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedTextField(
                        value = titleText,
                        onValueChange = { titleText = it },
                        label = { Text("Product Title", color = TextWhite.copy(alpha = 0.5f)) },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = CyberViolet, unfocusedBorderColor = TextWhite.copy(alpha = 0.2f)),
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = descText,
                        onValueChange = { descText = it },
                        label = { Text("Product Description", color = TextWhite.copy(alpha = 0.5f)) },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = CyberViolet, unfocusedBorderColor = TextWhite.copy(alpha = 0.2f)),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                        OutlinedTextField(
                            value = priceText,
                            onValueChange = { priceText = it },
                            label = { Text("Price (INR)", color = TextWhite.copy(alpha = 0.5f)) },
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = CyberViolet, unfocusedBorderColor = TextWhite.copy(alpha = 0.2f)),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f)
                        )

                        OutlinedTextField(
                            value = brandText,
                            onValueChange = { brandText = it },
                            label = { Text("Brand Name", color = TextWhite.copy(alpha = 0.5f)) },
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = CyberViolet, unfocusedBorderColor = TextWhite.copy(alpha = 0.2f)),
                            modifier = Modifier.weight(1f)
                        )
                    }

                    // Category radio/picker chips
                    Text("Category", color = TextWhite.copy(alpha = 0.5f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Row(
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        val cats = listOf("Fashion", "Beauty", "Electronics", "Home & Living", "Books", "Sports", "Appliances")
                        cats.forEach { c ->
                            val isSel = c == categorySel
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSel) CyberViolet else DarkSlate)
                                    .clickable {
                                        categorySel = c
                                        if (c == "Quick Commerce") isQuickCommerceSel = true
                                    }
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(c, color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    // Instant commerce selector toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Quick Commerce Instant delivery (10 mins)", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            Text("If toggled, items route into instant catalog.", color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp)
                        }
                        Switch(checked = isQuickCommerceSel, onCheckedChange = { isQuickCommerceSel = it }, colors = SwitchDefaults.colors(checkedThumbColor = NeonGreen))
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Button(
                        onClick = {
                            if (titleText.isNotBlank() && priceText.isNotBlank()) {
                                val priceVal = priceText.toDoubleOrNull() ?: 0.0
                                val finalBrand = if (brandText.isBlank()) "Vogue Exclusive" else brandText
                                onAddProduct(
                                    titleText,
                                    descText,
                                    priceVal,
                                    if (isQuickCommerceSel) "Quick Commerce" else categorySel,
                                    finalBrand,
                                    isQuickCommerceSel
                                )
                                // Clear input
                                titleText = ""
                                descText = ""
                                priceText = ""
                                brandText = ""
                            }
                        },
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = CyberViolet),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("PUBLISH TO CATALOG", fontWeight = FontWeight.Black)
                    }
                }
            }
        }
    }
}

// --- Super Admin dashboard View layout ---
@Composable
fun AdminProfilePanel(
    products: List<Product>,
    onToggleFlash: (Int, Boolean) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Executive BI Dashboard
        Column {
            Text("BUSINESS INTELLIGENCE & ANALYTICS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                Surface(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), color = CardBackgroundDark) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("REAL-TIME GMV", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text("₹1,45,00,000", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Black)
                        Text("+12.4% vs last week", color = NeonGreen, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Surface(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), color = CardBackgroundDark) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("ACTIVE USERS", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text("45,210", color = CyberVioletLight, fontSize = 18.sp, fontWeight = FontWeight.Black)
                        Text("1,200 adding to cart", color = TextWhite.copy(alpha = 0.6f), fontSize = 8.sp)
                    }
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                Surface(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), color = CardBackgroundDark) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("CONVERSION RATE", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text("3.8%", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                    }
                }
                Surface(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), color = CardBackgroundDark) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("AVG ORDER VALUE", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text("₹1,850", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                    }
                }
                Surface(modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp), color = CardBackgroundDark) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("CAC", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text("₹120", color = ElectricOrange, fontSize = 14.sp, fontWeight = FontWeight.Black)
                    }
                }
            }
        }

        // Marketing Automation & Campaign Builder
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            color = CyberViolet.copy(alpha = 0.15f),
            border = BorderStroke(1.dp, CyberVioletLight.copy(alpha = 0.3f))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.AutoGraph, contentDescription = null, tint = CyberVioletLight, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("NO-CODE CAMPAIGN BUILDER", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                }
                Text("Drag & drop visual workflow for Push, SMS, WhatsApp & Email.", color = TextWhite.copy(alpha = 0.6f), fontSize = 10.sp, modifier = Modifier.padding(top = 4.dp, bottom = 12.dp))
                
                Button(
                    onClick = { },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberViolet),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth().height(40.dp)
                ) {
                    Text("+ Create New Campaign", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Customer Segmentation & AI Automation
        Column {
            Text("AI MARKETING AUTOMATION & SEGMENTS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                Surface(
                    modifier = Modifier.weight(1f).height(90.dp),
                    shape = RoundedCornerShape(12.dp),
                    color = CardBackgroundDark,
                    border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(imageVector = Icons.Default.Group, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(24.dp).padding(bottom = 6.dp))
                        Text("Dynamic Segments", color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text("VIPs, Abandoners, etc.", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, textAlign = TextAlign.Center)
                    }
                }
                Surface(
                    modifier = Modifier.weight(1f).height(90.dp),
                    shape = RoundedCornerShape(12.dp),
                    color = CardBackgroundDark,
                    border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.Center, horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(imageVector = Icons.Default.Science, contentDescription = null, tint = GoldYellow, modifier = Modifier.size(24.dp).padding(bottom = 6.dp))
                        Text("A/B Testing", color = TextWhite, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text("Test banners & UI", color = TextWhite.copy(alpha = 0.5f), fontSize = 9.sp, textAlign = TextAlign.Center)
                    }
                }
            }
        }

        // Toggle Flash Sales interactive catalog list
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            color = CardBackgroundDark,
            border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("MANAGE CAMPAIGNS: TOGGLE FLASH SALES", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                Text("Toggle switches to dynamically map products into home screen Flash Deal horizontal lists.", color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp, modifier = Modifier.padding(bottom = 16.dp))

                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    val standardItems = products.filter { !it.isQuickCommerce }
                    standardItems.forEach { prod ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(DarkSlate, RoundedCornerShape(10.dp))
                                .padding(10.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(prod.title, color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                Text("₹${prod.price} | Brand: ${prod.brand}", color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp)
                            }
                            Switch(
                                checked = prod.isFlashSale,
                                onCheckedChange = { onToggleFlash(prod.id, it) },
                                colors = SwitchDefaults.colors(checkedThumbColor = ElectricOrange)
                            )
                        }
                    }
                }
            }
        }

        // System Audit Logs Listing
        Column {
            Text("SYSTEM AUDIT TRAIL LOGS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 8.dp))
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                color = CardBackgroundDark,
                border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    val logs = listOf(
                        "AI ENGINE: Automatically launched 'Cart Abandoner' retargeting campaign.",
                        "MARKETING: A/B Test 'Banner B' won with +18% higher CTR.",
                        "SYSTEM: Approved Subscriber Vogue Couture India for level 4 (₹25,000)",
                        "FINANCE: Disbursed Platform Settlement ₹1,92,000 to Vogue darkstore",
                        "INVENTORY: Darkstore #14 stock verification complete"
                    )
                    logs.forEach { log ->
                        Row(verticalAlignment = Alignment.Top, modifier = Modifier.fillMaxWidth()) {
                            Box(modifier = Modifier.padding(top = 4.dp).size(4.dp).background(CyberViolet, CircleShape))
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(log, color = TextWhite.copy(alpha = 0.6f), fontSize = 10.sp, lineHeight = 14.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileMenuItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(38.dp)
                .background(CyberViolet.copy(alpha = 0.15f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = CyberVioletLight,
                modifier = Modifier.size(18.dp)
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                color = Color.White,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = subtitle,
                color = Color.White.copy(alpha = 0.5f),
                fontSize = 10.sp
            )
        }

        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = Color.White.copy(alpha = 0.3f),
            modifier = Modifier.size(18.dp)
        )
    }
}
