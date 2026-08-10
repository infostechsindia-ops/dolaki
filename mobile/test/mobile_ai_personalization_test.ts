import assert from 'node:assert';
import { test, describe } from 'node:test';
import { mobileAiAssistant } from '../src/services/ai_assistant.ts';
import { personalizationService } from '../src/services/personalization.ts';

describe('MOBILE-004 AI Shopping Assistant & Personalization Tests', () => {
  test('1. AI Shopping Assistant processes gift, outfit, and grocery intents deterministically', () => {
    const giftRes = mobileAiAssistant.processQuery('Show me gift ideas');
    assert.strictEqual(giftRes.intent, 'GIFT');
    assert.ok(giftRes.suggestedProductIds.length > 0);

    const outfitRes = mobileAiAssistant.processQuery('What outfit to wear?');
    assert.strictEqual(outfitRes.intent, 'OUTFIT');

    const groceryRes = mobileAiAssistant.processQuery('Need milk and grocery delivery');
    assert.strictEqual(groceryRes.intent, 'GROCERY');
  });

  test('2. Personalization service returns segment-based shelves and customer insights', () => {
    const shelves = personalizationService.getPersonalizedShelves('VIP_MEMBER');
    assert.strictEqual(shelves.length, 3);
    assert.strictEqual(shelves[0].id, 'recommended_for_you');

    const insights = personalizationService.getCustomerInsights();
    assert.strictEqual(insights.segment, 'VIP_MEMBER');
    assert.strictEqual(insights.vipPassActive, true);
    assert.strictEqual(insights.auraCoinsBalance, 450);
  });
});
