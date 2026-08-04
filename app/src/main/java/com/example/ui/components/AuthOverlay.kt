package com.example.ui.components

import androidx.compose.animation.*
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuthOverlay(
    onDismiss: () -> Unit,
    onLoginSuccess: (String) -> Unit // returns the role (e.g. "CONSUMER")
) {
    var isOtpFlow by remember { mutableStateOf(false) }
    var mobileNumber by remember { mutableStateOf("") }
    var otpCode by remember { mutableStateOf("") }
    var step by remember { mutableStateOf(1) } // 1 = enter mobile, 2 = enter otp

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.8f))
            .clickable(onClick = onDismiss),
        contentAlignment = Alignment.BottomCenter
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { /* Block dismiss */ },
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
            color = DarkSlate,
            border = BorderStroke(1.dp, TextWhite.copy(alpha = 0.1f))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Drag handle indicator
                Box(modifier = Modifier.width(40.dp).height(4.dp).background(TextWhite.copy(alpha=0.2f), CircleShape))
                Spacer(modifier = Modifier.height(24.dp))

                if (isOtpFlow) {
                    Text(if (step == 1) "Enter Mobile Number" else "Verify OTP", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Black)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(if (step == 1) "We will send an OTP for verification." else "Sent to +91 $mobileNumber", color = TextWhite.copy(alpha=0.6f), fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(24.dp))

                    if (step == 1) {
                        OutlinedTextField(
                            value = mobileNumber,
                            onValueChange = { mobileNumber = it },
                            placeholder = { Text("Mobile Number", color = TextWhite.copy(alpha = 0.4f)) },
                            leadingIcon = { Text("+91", color = TextWhite, modifier = Modifier.padding(start=16.dp)) },
                            colors = TextFieldDefaults.colors(
                                focusedContainerColor = CardBackgroundDark,
                                unfocusedContainerColor = CardBackgroundDark,
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite,
                                focusedIndicatorColor = CyberViolet,
                                unfocusedIndicatorColor = TextWhite.copy(alpha = 0.2f)
                            ),
                            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp))
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(
                            onClick = { if(mobileNumber.length >= 10) step = 2 },
                            colors = ButtonDefaults.buttonColors(containerColor = CyberViolet, contentColor = Color.White),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth().height(50.dp)
                        ) {
                            Text("Send OTP", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    } else {
                        OutlinedTextField(
                            value = otpCode,
                            onValueChange = { otpCode = it },
                            placeholder = { Text("Enter 4-digit OTP", color = TextWhite.copy(alpha = 0.4f)) },
                            colors = TextFieldDefaults.colors(
                                focusedContainerColor = CardBackgroundDark,
                                unfocusedContainerColor = CardBackgroundDark,
                                focusedTextColor = TextWhite,
                                unfocusedTextColor = TextWhite,
                                focusedIndicatorColor = CyberViolet,
                                unfocusedIndicatorColor = TextWhite.copy(alpha = 0.2f)
                            ),
                            keyboardOptions = androidx.compose.foundation.text.KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp))
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Button(
                            onClick = { if(otpCode.length >= 4) onLoginSuccess("CONSUMER") },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonGreen, contentColor = Color.Black),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth().height(50.dp)
                        ) {
                            Text("Verify & Login", fontSize = 16.sp, fontWeight = FontWeight.Black)
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    Text("Use Social Login instead", color = CyberVioletLight, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.clickable { isOtpFlow = false })

                } else {
                    // Social Login View
                    Text("Join AuraMart", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Black)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Sign in to sync your wishlist & orders.", color = TextWhite.copy(alpha=0.6f), fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(32.dp))

                    Button(
                        onClick = { isOtpFlow = true },
                        colors = ButtonDefaults.buttonColors(containerColor = CardBackgroundDark, contentColor = TextWhite),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().height(50.dp).border(1.dp, TextWhite.copy(alpha=0.2f), RoundedCornerShape(12.dp))
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.PhoneIphone, contentDescription = null, tint = NeonGreen)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Continue with Mobile Number", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { onLoginSuccess("CONSUMER") },
                        colors = ButtonDefaults.buttonColors(containerColor = CardBackgroundDark, contentColor = TextWhite),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().height(50.dp).border(1.dp, TextWhite.copy(alpha=0.2f), RoundedCornerShape(12.dp))
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Email, contentDescription = null, tint = CyberVioletLight)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Continue with Google", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}
