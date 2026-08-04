import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';

interface CategoryItem {
  name: string;
  slug: string;
  icon: string;
  color?: string;
}

interface CategoryGridProps {
  categories?: CategoryItem[];
  selectedCategory?: string | null;
  onSelectCategory?: (slug: string) => void;
}

export function CategoryGrid({ categories, selectedCategory, onSelectCategory }: CategoryGridProps) {
  const defaultCategories: CategoryItem[] = [
    { name: 'Veggies', slug: 'fruits-vegetables', icon: '🥬', color: '#ECFDF5' },
    { name: 'Dairy & Milk', slug: 'dairy-bread-eggs', icon: '🥛', color: '#EFF6FF' },
    { name: 'Fresh Meat', slug: 'meat', icon: '🥩', color: '#FEF2F2' },
    { name: 'Pharmacy', slug: 'medical', icon: '💊', color: '#F0FDF4' },
    { name: 'Kirana', slug: 'kirana', icon: '🛒', color: '#FEF3C7' },
    { name: 'Bakery', slug: 'bakery', icon: '🍞', color: '#FFFBEB' },
    { name: 'Restaurant', slug: 'restaurant', icon: '🍕', color: '#FFF1F2' },
    { name: 'Fashion', slug: 'fashion', icon: '👗', color: '#F5F3FF' },
    { name: 'Books', slug: 'books', icon: '📚', color: '#EEF2FF' },
    { name: 'Tools', slug: 'tools', icon: '🔧', color: '#F1F5F9' },
    { name: 'Beauty', slug: 'beauty', icon: '🧴', color: '#FDF2F8' },
    { name: 'Household', slug: 'household', icon: '🏠', color: '#ECFDF5' }
  ];

  const items = categories || defaultCategories;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {items.map((cat, idx) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => onSelectCategory && onSelectCategory(cat.slug)}
              style={[
                styles.chip,
                { backgroundColor: cat.color || '#F3F4F6' },
                isSelected && styles.chipSelected,
              ]}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingLeft: 16,
    gap: 10,
  },
  chip: {
    width: 76,
    height: 84,
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderColor: '#059669',
  },
  icon: {
    fontSize: 24,
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#065F46',
    fontWeight: '900',
  },
});
