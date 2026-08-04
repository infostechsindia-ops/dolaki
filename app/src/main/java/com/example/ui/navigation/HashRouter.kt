package com.example.ui.navigation

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

enum class NavDirection {
    FORWARD, BACKWARD, NONE
}

class HashRouter(initialRoute: String = "#/home") {
    private val _routeHistory = MutableStateFlow<List<String>>(listOf(initialRoute))
    val routeHistory: StateFlow<List<String>> = _routeHistory.asStateFlow()

    private val _currentRoute = MutableStateFlow(initialRoute)
    val currentRoute: StateFlow<String> = _currentRoute.asStateFlow()

    private val _direction = MutableStateFlow(NavDirection.NONE)
    val direction: StateFlow<NavDirection> = _direction.asStateFlow()

    fun navigateTo(routeOrScreen: String) {
        val targetRoute = if (routeOrScreen.startsWith("#")) {
            routeOrScreen
        } else {
            mapScreenToRoute(routeOrScreen)
        }

        val currentList = _routeHistory.value.toMutableList()
        val current = _currentRoute.value

        if (current == targetRoute) return

        val mainTabs = listOf("#/home", "#/categories", "#/quick-commerce", "#/wishlist", "#/profile")
        if (targetRoute in mainTabs) {
            val index = currentList.indexOf(targetRoute)
            if (index != -1) {
                _direction.value = NavDirection.BACKWARD
                _routeHistory.value = currentList.subList(0, index + 1)
            } else {
                _direction.value = NavDirection.FORWARD
                val newList = if (targetRoute == "#/home") {
                    listOf("#/home")
                } else {
                    listOf("#/home", targetRoute)
                }
                _routeHistory.value = newList
            }
        } else {
            _direction.value = NavDirection.FORWARD
            currentList.add(targetRoute)
            _routeHistory.value = currentList
        }

        _currentRoute.value = targetRoute
    }

    fun popBack(): Boolean {
        val currentList = _routeHistory.value.toMutableList()
        if (currentList.size > 1) {
            _direction.value = NavDirection.BACKWARD
            currentList.removeAt(currentList.lastIndex)
            _routeHistory.value = currentList
            _currentRoute.value = currentList.last()
            return true
        }
        return false
    }

    fun canGoBack(): Boolean {
        return _routeHistory.value.size > 1
    }

    fun currentScreenFlow(scope: CoroutineScope): StateFlow<String> {
        return _currentRoute.map { mapRouteToScreen(it) }
            .stateIn(scope, SharingStarted.Eagerly, mapRouteToScreen(_currentRoute.value))
    }

    companion object {
        fun mapScreenToRoute(screen: String): String {
            return when (screen) {
                "Home" -> "#/home"
                "Categories" -> "#/categories"
                "QuickCommerce" -> "#/quick-commerce"
                "Wishlist" -> "#/wishlist"
                "Profile" -> "#/profile"
                "Search" -> "#/search"
                "Detail" -> "#/detail"
                "Checkout" -> "#/checkout"
                "OrderTracking" -> "#/order-tracking"
                else -> "#/home"
            }
        }

        fun mapRouteToScreen(route: String): String {
            return when {
                route.startsWith("#/home") -> "Home"
                route.startsWith("#/categories") -> "Categories"
                route.startsWith("#/quick-commerce") -> "QuickCommerce"
                route.startsWith("#/wishlist") -> "Wishlist"
                route.startsWith("#/profile") -> "Profile"
                route.startsWith("#/search") -> "Search"
                route.startsWith("#/detail") -> "Detail"
                route.startsWith("#/checkout") -> "Checkout"
                route.startsWith("#/order-tracking") -> "OrderTracking"
                else -> "Home"
            }
        }
    }
}
