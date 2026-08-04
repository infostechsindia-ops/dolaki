package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CheckoutScreen(
    cartItems: List<CartItem>,
    products: List<Product>,
    appliedCoupon: Coupon?,
    wallet: UserWallet?,
    onApplyCoupon: (String) -> Boolean,
    onClearCoupon: () -> Unit,
    onIncrementQty: (CartItem) -> Unit,
    onDecrementQty: (CartItem) -> Unit,
    onRemoveItem: (Int) -> Unit,
    onBackClick: () -> Unit,
    onPlaceOrder: (Double, String, String, String, Boolean) -> Unit
) {
    var couponText by remember { mutableStateOf("") }
    var couponMessage by remember { mutableStateOf("") }
    var couponSuccess by remember { mutableStateOf<Boolean?>(null) }

    var selectedPaymentMethod by remember { mutableStateOf("UPI Apps") }
    var selectedAddress by remember { mutableStateOf("Connaught Place, New Delhi - 110001") }

    // Map cart item quantities
    val itemsWithProducts = cartItems.mapNotNull { item ->
        val p = products.find { it.id == item.productId }
        if (p != null) Pair(item, p) else null
    }

    val isQuickOrder = itemsWithProducts.any { it.second.isQuickCommerce }

    // Calculations
    val subtotal = itemsWithProducts.sumOf { it.first.quantity * it.second.price }
    val discountVal = if (appliedCoupon != null) (subtotal * (appliedCoupon.discountPercent / 100.0)) else 0.0
    val gst = (subtotal - discountVal) * 0.18
    val deliveryFee = if (subtotal > 499) 0.0 else 40.0
    val total = (subtotal - discountVal) + gst + deliveryFee

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkSlate)
    ) {
        TopAppBar(
            title = { Text("Checkout & Review", color = TextWhite, fontSize = 16.sp, fontWeight = FontWeight.Black) },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = TextWhite)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkSlate)
        )

        if (cartItems.isEmpty()) {
            Box(
                modifier = Modifier.weight(1f).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(imageVector = Icons.Default.ShoppingCart, contentDescription = "Empty", tint = TextWhite.copy(alpha = 0.15f), modifier = Modifier.size(96.dp))
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Your cart is empty", color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 16.dp.value.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Browse our collection to fill it up!", color = TextWhite.copy(alpha = 0.5f), fontSize = 12.sp)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Address Section
                item {
                    Text("DELIVERY ADDRESS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        color = CardBackgroundDark,
                        border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.1f))
                    ) {
                        Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.LocationOn, contentDescription = null, tint = NeonGreen)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Home (Connaught Place)", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                Text(selectedAddress, color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp)
                            }
                            Icon(imageVector = Icons.Default.Edit, contentDescription = "Edit", tint = TextWhite.copy(alpha = 0.5f), modifier = Modifier.size(16.dp))
                        }
                    }
                }

                // Cart items list review
                item {
                    Text("REVIEW CART ITEMS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                items(itemsWithProducts) { (item, p) ->
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        color = CardBackgroundDark,
                        border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
                    ) {
                        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                            // Mini category icon proxy
                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(CyberViolet.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                coil.compose.AsyncImage(
                                    model = p.imageUrl,
                                    contentDescription = p.title,
                                    contentScale = androidx.compose.ui.layout.ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(p.title, color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Bold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    if (item.selectedColor.isNotEmpty()) {
                                        Text("Col: ${item.selectedColor}", color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp)
                                        Spacer(modifier = Modifier.width(8.dp))
                                    }
                                    if (item.selectedSize.isNotEmpty()) {
                                        Text("Sz: ${item.selectedSize}", color = TextWhite.copy(alpha = 0.5f), fontSize = 10.sp)
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("₹${String.format("%,.0f", p.price)}", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Black)
                            }

                            // Interactive quantity adjust controls
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .background(DarkSlate, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 4.dp, vertical = 2.dp)
                            ) {
                                IconButton(onClick = { onDecrementQty(item) }, modifier = Modifier.size(24.dp)) {
                                    Icon(imageVector = Icons.Default.Remove, contentDescription = "Minus", tint = TextWhite, modifier = Modifier.size(14.dp))
                                }
                                Text(text = "${item.quantity}", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(horizontal = 6.dp))
                                IconButton(onClick = { onIncrementQty(item) }, modifier = Modifier.size(24.dp)) {
                                    Icon(imageVector = Icons.Default.Add, contentDescription = "Plus", tint = TextWhite, modifier = Modifier.size(14.dp))
                                }
                            }
                        }
                    }
                }

                // Coupon code validation block
                item {
                    Text("APPLY PROMOTIONAL COUPON", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))

                    if (appliedCoupon == null) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                            TextField(
                                value = couponText,
                                onValueChange = { couponText = it },
                                placeholder = { Text("Enter AURA20, ZEPTO100...", color = TextWhite.copy(alpha = 0.4f), fontSize = 12.sp) },
                                colors = TextFieldDefaults.colors(
                                    focusedContainerColor = CardBackgroundDark,
                                    unfocusedContainerColor = CardBackgroundDark,
                                    focusedTextColor = TextWhite,
                                    unfocusedTextColor = TextWhite,
                                    focusedIndicatorColor = Color.Transparent,
                                    unfocusedIndicatorColor = Color.Transparent
                                ),
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .border(1.dp, TextWhite.copy(alpha = 0.15f), RoundedCornerShape(12.dp)),
                                singleLine = true
                            )

                            Spacer(modifier = Modifier.width(10.dp))

                            Button(
                                onClick = {
                                    if (couponText.isNotBlank()) {
                                        val res = onApplyCoupon(couponText)
                                        couponSuccess = res
                                        couponMessage = if (res) "Coupon applied successfully!" else "Invalid or expired coupon."
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = CyberViolet),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.height(48.dp)
                            ) {
                                Text("APPLY", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            }
                        }

                        if (couponMessage.isNotEmpty()) {
                            Text(
                                text = couponMessage,
                                color = if (couponSuccess == true) NeonGreen else Color.Red,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(top = 6.dp, start = 4.dp),
                                fontWeight = FontWeight.Bold
                            )
                        }
                    } else {
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            color = NeonGreen.copy(alpha = 0.12f),
                            border = BorderStroke(1.dp, NeonGreen)
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(imageVector = Icons.Default.CardGiftcard, contentDescription = null, tint = NeonGreen)
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column {
                                        Text("COUPON ACTIVE: ${appliedCoupon.code}", color = TextWhite, fontSize = 13.sp, fontWeight = FontWeight.Black)
                                        Text(appliedCoupon.description, color = TextWhite.copy(alpha = 0.6f), fontSize = 10.sp)
                                    }
                                }

                                IconButton(onClick = onClearCoupon) {
                                    Icon(imageVector = Icons.Default.Close, contentDescription = "Clear", tint = Color.Red)
                                }
                            }
                        }
                    }
                }

                // Payment Selector section
                item {
                    Text("SELECT PAYMENT ROUTE", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        val paymentOptions = listOf("UPI Apps", "Credit / Debit Card", "Aura Wallet", "Cash On Delivery (COD)")
                        paymentOptions.forEach { opt ->
                            val isSel = opt == selectedPaymentMethod
                            val walletBal = if (opt == "Aura Wallet") " (Balance: ₹${String.format("%,.2f", wallet?.balance ?: 0.0)})" else ""
                            val isWalletEnabled = opt != "Aura Wallet" || (wallet != null && wallet.balance >= total)

                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable(enabled = isWalletEnabled) { selectedPaymentMethod = opt }
                                    .alpha(if (isWalletEnabled) 1.0f else 0.5f),
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSel) CyberViolet.copy(alpha = 0.15f) else CardBackgroundDark,
                                border = BorderStroke(1.dp, if (isSel) CyberViolet else TextWhite.copy(alpha = 0.08f))
                            ) {
                                Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                                    RadioButton(selected = isSel, onClick = { if (isWalletEnabled) selectedPaymentMethod = opt }, enabled = isWalletEnabled)
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Column {
                                        Text(opt + walletBal, color = if (isSel) TextWhite else TextWhite.copy(alpha = 0.8f), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                        if (opt == "Aura Wallet" && wallet != null && wallet.balance < total) {
                                            Text("Insufficient wallet funds. Spin wheel or scratch for cashback!", color = Color.Red, fontSize = 10.sp)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Financial Summary ledger details
                item {
                    Text("BILL DETAILS", color = TextWhite.copy(alpha = 0.6f), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        color = CardBackgroundDark,
                        border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.08f))
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Cart Subtotal", color = TextWhite.copy(alpha = 0.6f), fontSize = 12.sp)
                                Text("₹${String.format("%,.2f", subtotal)}", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            if (appliedCoupon != null) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Coupon Discount (${appliedCoupon.discountPercent}%)", color = NeonGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    Text("- ₹${String.format("%,.2f", discountVal)}", color = NeonGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("GST (18% simulated)", color = TextWhite.copy(alpha = 0.6f), fontSize = 12.sp)
                                Text("₹${String.format("%,.2f", gst)}", color = TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Instant Handling & Delivery Fee", color = TextWhite.copy(alpha = 0.6f), fontSize = 12.sp)
                                Text(if (deliveryFee == 0.0) "FREE" else "₹${String.format("%,.2f", deliveryFee)}", color = if (deliveryFee == 0.0) NeonGreen else TextWhite, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Divider(color = TextWhite.copy(alpha = 0.1f), modifier = Modifier.padding(vertical = 4.dp))
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                                Text("Total Amount Payable", color = TextWhite, fontSize = 14.sp, fontWeight = FontWeight.Black)
                                Text("₹${String.format("%,.2f", total)}", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Black)
                            }
                        }
                    }
                }

                // Guard spacing bottom
                item { Spacer(modifier = Modifier.height(24.dp)) }
            }
        }

        // Bottom checkout sticky footer
        if (cartItems.isNotEmpty()) {
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
                        Text("Payable Sum", color = TextWhite.copy(alpha = 0.5f), fontSize = 11.sp)
                        Text("₹${String.format("%,.0f", total)}", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Black)
                    }

                    Button(
                        onClick = {
                            val itemsSummary = itemsWithProducts.joinToString(", ") { "${it.second.title} x${it.first.quantity}" }
                            onPlaceOrder(
                                total,
                                selectedAddress,
                                selectedPaymentMethod,
                                itemsSummary,
                                isQuickOrder
                            )
                        },
                        modifier = Modifier.height(46.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = if (isQuickOrder) NeonGreen else CyberViolet, contentColor = Color.White),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = if (isQuickOrder) "PLACE INSTANT ORDER" else "CONFIRM & PAY NOW",
                            fontWeight = FontWeight.Black,
                            fontSize = 12.sp,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
            }
        }
    }
}
