export interface WidgetDataPayload {
  recentOrder?: {
    orderId: string;
    status: string;
    itemCount: number;
    formattedTotal: string;
  };
  fladoReorder?: {
    itemId: string;
    name: string;
    imageUrl: string;
    formattedPrice: string;
  };
  auraCoinsBalance: number;
  vipStatus: boolean;
  activeCouponsCount: number;
  lastUpdated: string;
}

export class WidgetDataProvider {
  getWidgetPayload(): WidgetDataPayload {
    return {
      recentOrder: {
        orderId: 'ord-101',
        status: 'OUT_FOR_DELIVERY',
        itemCount: 3,
        formattedTotal: '₹1,249',
      },
      fladoReorder: {
        itemId: 'prod-milk-1',
        name: 'Amul Taaza Toned Milk 1L',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
        formattedPrice: '₹72',
      },
      auraCoinsBalance: 450,
      vipStatus: true,
      activeCouponsCount: 4,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const widgetDataProvider = new WidgetDataProvider();
