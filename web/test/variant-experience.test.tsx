import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductVariantExperience from '../src/components/pdp/ProductVariantExperience';
import {
  VariantOption,
  VariantCombination,
  computeDisabledOptionValues,
  evaluateVariantMatrix,
  findMatchingCombination,
} from '../src/components/pdp';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock test dataset
const MOCK_OPTIONS: VariantOption[] = [
  {
    id: 'color',
    name: 'Color',
    type: 'color',
    values: [
      { id: 'red', label: 'Red', colorHex: '#ff0000' },
      { id: 'blue', label: 'Blue', colorHex: '#0000ff' },
      { id: 'green', label: 'Green', colorHex: '#00ff00' },
    ],
  },
  {
    id: 'storage',
    name: 'Storage',
    type: 'button',
    values: [
      { id: '64gb', label: '64 GB' },
      { id: '256gb', label: '256 GB' },
      { id: '512gb', label: '512 GB' },
    ],
  },
];

const MOCK_COMBINATIONS: VariantCombination[] = [
  {
    id: 'combo-red-64',
    sku: 'PHONE-RED-64',
    attributeValues: { color: 'red', storage: '64gb' },
    inStock: true,
    stockBadgeText: 'In Stock (5 left)',
    formattedPrice: '₹49,999',
    formattedCompareAtPrice: '₹59,999',
    discountPercent: 17,
    images: [{ src: 'https://img.com/red-64.jpg', alt: 'Red 64GB' }],
    deliveryBadgeText: 'FREE Delivery',
    estimatedDeliveryText: 'Delivered in 2 days',
  },
  {
    id: 'combo-red-256',
    sku: 'PHONE-RED-256',
    attributeValues: { color: 'red', storage: '256gb' },
    inStock: true,
    stockBadgeText: 'In Stock',
    formattedPrice: '₹59,999',
    formattedCompareAtPrice: '₹69,999',
    discountPercent: 14,
    images: [{ src: 'https://img.com/red-256.jpg', alt: 'Red 256GB' }],
    deliveryBadgeText: 'FREE Delivery',
    estimatedDeliveryText: 'Delivered tomorrow',
  },
  // Note: Red 512GB DOES NOT EXIST -> Impossible combination!
  {
    id: 'combo-blue-64',
    sku: 'PHONE-BLUE-64',
    attributeValues: { color: 'blue', storage: '64gb' },
    inStock: false,
    stockBadgeText: 'Out of Stock',
    formattedPrice: '₹49,999',
    images: [{ src: 'https://img.com/blue-64.jpg', alt: 'Blue 64GB' }],
  },
  {
    id: 'combo-blue-256',
    sku: 'PHONE-BLUE-256',
    attributeValues: { color: 'blue', storage: '256gb' },
    inStock: true,
    formattedPrice: '₹59,999',
    images: [{ src: 'https://img.com/blue-256.jpg', alt: 'Blue 256GB' }],
  },
  {
    id: 'combo-blue-512',
    sku: 'PHONE-BLUE-512',
    attributeValues: { color: 'blue', storage: '512gb' },
    inStock: true,
    formattedPrice: '₹79,999',
    images: [{ src: 'https://img.com/blue-512.jpg', alt: 'Blue 512GB' }],
  },
];

const MOCK_BASE_PDP = {
  breadcrumbItems: [{ label: 'Smartphones', href: '/smartphones' }],
  images: [{ src: 'https://img.com/base.jpg', alt: 'Base Phone' }],
  info: {
    title: 'Aura Phone Pro',
    brand: 'Aura',
    sku: 'BASE-PHONE',
  },
  price: {
    formattedPrice: '₹49,999',
  },
  deliveryInfo: {
    badgeText: 'Standard Shipping',
    estimatedDeliveryText: 'Delivered in 3-5 days',
  },
};

describe('CMD-035 Variant Experience Foundation', () => {
  // Pure Matrix Resolver Unit Tests
  describe('Pure Matrix Resolver Utilities', () => {
    it('findMatchingCombination returns correct combination for exact attribute match', () => {
      const match = findMatchingCombination(
        { color: 'red', storage: '256gb' },
        MOCK_COMBINATIONS,
        MOCK_OPTIONS
      );
      expect(match).not.toBeNull();
      expect(match?.sku).toBe('PHONE-RED-256');
    });

    it('computeDisabledOptionValues identifies impossible combination (Red + 512GB)', () => {
      const disabled = computeDisabledOptionValues(
        MOCK_OPTIONS,
        { color: 'red' },
        MOCK_COMBINATIONS
      );
      expect(disabled['storage'].has('512gb')).toBe(true);
      expect(disabled['storage'].has('64gb')).toBe(false);
      expect(disabled['storage'].has('256gb')).toBe(false);
    });

    it('evaluateVariantMatrix computes complete resolution state', () => {
      const evalResult = evaluateVariantMatrix(
        MOCK_OPTIONS,
        { color: 'blue', storage: '64gb' },
        MOCK_COMBINATIONS
      );
      expect(evalResult.isCompleteSelection).toBe(true);
      expect(evalResult.matchingCombination?.sku).toBe('PHONE-BLUE-64');
      expect(evalResult.isValidAndInStock).toBe(false); // Out of stock
    });
  });

  // UI & Integration Tests
  describe('ProductVariantExperience Component', () => {
    // 1. Initial selection
    it('renders initial default variant selection and displays initial SKU & price', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      expect(screen.getByTestId('variant-experience')).toBeInTheDocument();
      expect(screen.getByTestId('product-info')).toHaveTextContent('PHONE-RED-64');
      expect(screen.getByTestId('product-price')).toHaveTextContent('₹49,999');
    });

    // 2. Image update on variant change
    it('updates product images when a different color variant is selected', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const blueSwatch = screen.getByRole('radio', { name: /Color: Blue/i });
      fireEvent.click(blueSwatch);

      const mainImg = screen.getByTestId('product-image-viewer').querySelector('img');
      expect(mainImg).toHaveAttribute('src', 'https://img.com/blue-64.jpg');
    });

    // 3. Price update on variant change
    it('updates formatted price and discount when storage option changes', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const storage256Btn = screen.getByRole('radio', { name: /Storage: 256 GB/i });
      fireEvent.click(storage256Btn);

      expect(screen.getByTestId('product-price')).toHaveTextContent('₹59,999');
      expect(screen.getByTestId('product-price')).toHaveTextContent('14% OFF');
    });

    // 4. SKU update on variant change
    it('updates SKU identifier when variant options change', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const blueSwatch = screen.getByRole('radio', { name: /Color: Blue/i });
      fireEvent.click(blueSwatch);

      expect(screen.getByTestId('product-info')).toHaveTextContent('PHONE-BLUE-64');
    });

    // 5. Delivery estimate update
    it('updates authoritative delivery estimate when variant changes', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const storage256Btn = screen.getByRole('radio', { name: /Storage: 256 GB/i });
      fireEvent.click(storage256Btn);

      expect(screen.getByTestId('product-delivery-info')).toHaveTextContent('Delivered tomorrow');
    });

    // 6. Out of stock variant behavior
    it('disables add-to-cart button when an out-of-stock variant is selected', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-blue-64"
          actions={{}}
        />
      );

      const addBtn = screen.getByTestId('add-to-cart-btn');
      expect(addBtn).toBeDisabled();
      expect(screen.getByTestId('product-actions')).toHaveTextContent('Out of Stock');
    });

    // 7. Impossible combination disabling
    it('disables impossible variant values (e.g. 512GB when Color=Red is selected)', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const btn512 = screen.getByRole('radio', { name: /Storage: 512 GB/i });
      expect(btn512).toBeDisabled();
    });

    // 8. Enabling valid combinations when selection changes
    it('re-enables 512GB option when Color changes from Red to Blue', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const btn512 = screen.getByRole('radio', { name: /Storage: 512 GB/i });
      expect(btn512).toBeDisabled();

      const blueSwatch = screen.getByRole('radio', { name: /Color: Blue/i });
      fireEvent.click(blueSwatch);

      expect(screen.getByRole('radio', { name: /Storage: 512 GB/i })).not.toBeDisabled();
    });

    // 9. Dropdown variant selector reactivity
    it('supports native dropdown variant selectors correctly', () => {
      const dropdownOption: VariantOption[] = [
        {
          id: 'storage',
          name: 'Storage',
          type: 'dropdown',
          values: [
            { id: '64gb', label: '64 GB' },
            { id: '256gb', label: '256 GB' },
          ],
        },
      ];

      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={dropdownOption}
          variantCombinations={[MOCK_COMBINATIONS[0], MOCK_COMBINATIONS[1]]}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const dropdown = screen.getByTestId('variant-dropdown-storage');
      fireEvent.change(dropdown, { target: { value: '256gb' } });

      expect(screen.getByTestId('product-info')).toHaveTextContent('PHONE-RED-256');
    });

    // 10. Swatch variant selector reactivity
    it('updates active checked state on color swatch buttons', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const redSwatch = screen.getByRole('radio', { name: /Color: Red/i });
      const blueSwatch = screen.getByRole('radio', { name: /Color: Blue/i });

      expect(redSwatch).toHaveAttribute('aria-checked', 'true');
      expect(blueSwatch).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(blueSwatch);

      expect(redSwatch).toHaveAttribute('aria-checked', 'false');
      expect(blueSwatch).toHaveAttribute('aria-checked', 'true');
    });

    // 11. Add to Cart validation guard (Success path)
    it('invokes onAddToCart callback with matching combination when valid and in stock', () => {
      const onAddToCart = jest.fn();
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{ onAddToCart }}
        />
      );

      const addBtn = screen.getByTestId('add-to-cart-btn');
      fireEvent.click(addBtn);

      expect(onAddToCart).toHaveBeenCalledTimes(1);
      expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'combo-red-64' }));
    });

    // 12. Add to Cart rejection guard when out-of-stock
    it('prevents onAddToCart callback when out of stock', () => {
      const onAddToCart = jest.fn();
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-blue-64"
          actions={{ onAddToCart }}
        />
      );

      const addBtn = screen.getByTestId('add-to-cart-btn');
      expect(addBtn).toBeDisabled();
      fireEvent.click(addBtn);

      expect(onAddToCart).not.toHaveBeenCalled();
    });

    // 13. Buy Now validation guard
    it('invokes onBuyNow callback when valid and in stock', () => {
      const onBuyNow = jest.fn();
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{ onBuyNow }}
        />
      );

      const buyBtn = screen.getByTestId('buy-now-btn');
      fireEvent.click(buyBtn);

      expect(onBuyNow).toHaveBeenCalledTimes(1);
      expect(onBuyNow).toHaveBeenCalledWith(expect.objectContaining({ id: 'combo-red-64' }));
    });

    // 14. Surface switching support
    it('renders with correct data-surface attribute for QUICK_COMMERCE', () => {
      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          surface="QUICK_COMMERCE"
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      const root = screen.getByTestId('variant-experience');
      expect(root).toHaveAttribute('data-surface', 'quick-commerce');
    });

    // 15. Invariant: Props-only architecture (No fetch, No localStorage)
    it('enforces presentational props-only architecture without window.fetch or localStorage calls', () => {
      if (!window.fetch) window.fetch = jest.fn() as any;
      const spyFetch = jest.spyOn(window, 'fetch');
      const spyStorage = jest.spyOn(Storage.prototype, 'getItem');

      render(
        <ProductVariantExperience
          {...MOCK_BASE_PDP}
          variantOptions={MOCK_OPTIONS}
          variantCombinations={MOCK_COMBINATIONS}
          defaultVariantId="combo-red-64"
          actions={{}}
        />
      );

      expect(spyFetch).not.toHaveBeenCalled();
      expect(spyStorage).not.toHaveBeenCalledWith(expect.stringContaining('variant'));

      spyFetch.mockRestore();
      spyStorage.mockRestore();
    });
  });
});
