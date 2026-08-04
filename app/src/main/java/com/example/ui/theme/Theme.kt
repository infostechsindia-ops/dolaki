package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = CyberViolet,
    secondary = CyberVioletLight,
    tertiary = ElectricOrange,
    background = DarkSlate,
    surface = CardBackgroundDark,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = TextWhite,
    onSurface = TextWhite,
    error = Color(0xFFB3261E)
)

private val LightColorScheme = lightColorScheme(
    primary = CyberViolet,
    secondary = CyberVioletLight,
    tertiary = ElectricOrange,
    background = LightSlate,
    surface = CardBackgroundLight,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = TextDark,
    onSurface = TextDark,
    error = Color(0xFFB3261E)
)

@Composable
fun AuraMartTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
