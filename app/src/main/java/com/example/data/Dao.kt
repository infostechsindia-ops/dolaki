package com.example.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface AuraMartDao {

    // --- Products ---
    @Query("SELECT * FROM products ORDER BY id DESC")
    fun getAllProducts(): Flow<List<Product>>

    @Query("SELECT * FROM products WHERE category = :category ORDER BY id DESC")
    fun getProductsByCategory(category: String): Flow<List<Product>>

    @Query("SELECT * FROM products WHERE isQuickCommerce = :isQuick ORDER BY id DESC")
    fun getProductsByQuickCommerce(isQuick: Boolean): Flow<List<Product>>

    @Query("SELECT * FROM products WHERE id = :id")
    fun getProductById(id: Int): Flow<Product?>

    @Query("SELECT * FROM products WHERE title LIKE '%' || :query || '%' OR category LIKE '%' || :query || '%' OR brand LIKE '%' || :query || '%'")
    fun searchProducts(query: String): Flow<List<Product>>

    @Query("SELECT * FROM products WHERE vendorId = :vendorId ORDER BY id DESC")
    fun getProductsByVendor(vendorId: Int): Flow<List<Product>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProduct(product: Product)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProducts(products: List<Product>)

    @Delete
    suspend fun deleteProduct(product: Product)

    // --- Cart Items ---
    @Query("SELECT * FROM cart_items")
    fun getCartItems(): Flow<List<CartItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCartItem(item: CartItem)

    @Delete
    suspend fun deleteCartItem(item: CartItem)

    @Query("DELETE FROM cart_items")
    suspend fun clearCart()

    // --- Wishlist Items ---
    @Query("SELECT * FROM wishlist_items")
    fun getWishlistItems(): Flow<List<WishlistItem>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWishlistItem(item: WishlistItem)

    @Query("DELETE FROM wishlist_items WHERE productId = :productId")
    suspend fun deleteWishlistItem(productId: Int)

    @Query("SELECT EXISTS(SELECT 1 FROM wishlist_items WHERE productId = :productId)")
    fun isWishlisted(productId: Int): Flow<Boolean>

    // --- Orders ---
    @Query("SELECT * FROM orders ORDER BY timestamp DESC")
    fun getOrders(): Flow<List<Order>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: Order): Long

    @Query("UPDATE orders SET status = :status WHERE id = :orderId")
    suspend fun updateOrderStatus(orderId: Int, status: String)

    // --- Vendors ---
    @Query("SELECT * FROM vendors")
    fun getVendors(): Flow<List<Vendor>>

    @Query("SELECT * FROM vendors WHERE id = :id")
    fun getVendorById(id: Int): Flow<Vendor?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVendor(vendor: Vendor)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVendors(vendors: List<Vendor>)

    // --- Coupons ---
    @Query("SELECT * FROM coupons")
    fun getCoupons(): Flow<List<Coupon>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCoupon(coupon: Coupon)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCoupons(coupons: List<Coupon>)

    @Query("UPDATE coupons SET isRedeemed = 1 WHERE code = :code")
    suspend fun redeemCoupon(code: String)

    // --- Wallet ---
    @Query("SELECT * FROM wallet WHERE id = 1")
    fun getWallet(): Flow<UserWallet?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWallet(wallet: UserWallet)

    @Query("UPDATE wallet SET balance = :balance, rewardPoints = :rewardPoints WHERE id = 1")
    suspend fun updateWallet(balance: Double, rewardPoints: Int)
}
