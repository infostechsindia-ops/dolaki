package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "products")
data class Product(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val description: String,
    val price: Double,
    val originalPrice: Double,
    val imageUrl: String,
    val category: String,
    val subCategory: String,
    val brand: String,
    val vendorId: Int,
    val rating: Float,
    val reviewCount: Int,
    val isFlashSale: Boolean = false,
    val isTrending: Boolean = false,
    val liveStock: Int = 15,
    val deliveryMinutes: Int = 25,
    val colorsJson: String = "[\"Slate\", \"Cosmic Black\"]",
    val sizesJson: String = "[\"M\", \"L\", \"XL\"]",
    val isQuickCommerce: Boolean = false
)

@Entity(tableName = "cart_items")
data class CartItem(
    @PrimaryKey val productId: Int,
    val quantity: Int,
    val selectedColor: String,
    val selectedSize: String
)

@Entity(tableName = "wishlist_items")
data class WishlistItem(
    @PrimaryKey val productId: Int
)

@Entity(tableName = "orders")
data class Order(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val timestamp: Long,
    val status: String, // "Placed", "Preparing", "Shipped", "Out for Delivery", "Delivered"
    val totalAmount: Double,
    val deliveryAddress: String,
    val paymentMethod: String,
    val verificationOtp: String,
    val itemsSummary: String, // Comma separated title x qty
    val deliveryMinutes: Int = 20
)

@Entity(tableName = "vendors")
data class Vendor(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val storeName: String,
    val logoUrl: String,
    val bannerUrl: String,
    val rating: Float,
    val isVerified: Boolean = true,
    val performanceScore: Float = 4.8f,
    val level: Int = 1,
    val subPlan: String = "Premium Partner"
)

@Entity(tableName = "coupons")
data class Coupon(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val code: String,
    val description: String,
    val discountPercent: Int,
    val isRedeemed: Boolean = false
)

@Entity(tableName = "wallet")
data class UserWallet(
    @PrimaryKey val id: Int = 1,
    val balance: Double = 500.0, // Starting trial wallet balance
    val rewardPoints: Int = 120
)
