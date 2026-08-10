export type AiAssistantIntent = 'GIFT' | 'OUTFIT' | 'GROCERY' | 'DEAL' | 'GENERAL';

export interface AiAssistantResponse {
  intent: AiAssistantIntent;
  replyText: string;
  suggestedProductIds: string[];
  chips: string[];
}

export class MobileAiAssistantService {
  processQuery(query: string): AiAssistantResponse {
    const q = query.toLowerCase();

    if (q.includes('gift') || q.includes('birthday') || q.includes('present')) {
      return {
        intent: 'GIFT',
        replyText: 'Here are top-rated gift ideas for electronics & fashion lovers!',
        suggestedProductIds: ['p1', 'p2', 'p10'],
        chips: ['Under ₹2,000', 'Electronics Gifts', 'Fashion Gift Cards'],
      };
    }

    if (q.includes('outfit') || q.includes('wear') || q.includes('dress') || q.includes('shirt')) {
      return {
        intent: 'OUTFIT',
        replyText: 'Check out these trending seasonal outfit recommendations & sneakers!',
        suggestedProductIds: ['p3', 'p7', 'p8'],
        chips: ['Casual Wear', 'Sneakers Sale', 'Monsoon Collection'],
      };
    }

    if (q.includes('grocery') || q.includes('milk') || q.includes('flado') || q.includes('food')) {
      return {
        intent: 'GROCERY',
        replyText: 'Here are your 10-minute Flado Express grocery essentials:',
        suggestedProductIds: ['prod-milk-1', 'p12', 'p14'],
        chips: ['10-Min Delivery', 'Daily Essentials', 'Organic Veggies'],
      };
    }

    return {
      intent: 'GENERAL',
      replyText: 'I am your AuraAI Shopping Assistant! How can I help you today?',
      suggestedProductIds: ['p1', 'p3', 'p5'],
      chips: ['Best Sellers', 'Today Deals', 'Flado 10-Min'],
    };
  }
}

export const mobileAiAssistant = new MobileAiAssistantService();
