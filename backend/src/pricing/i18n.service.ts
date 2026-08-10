import { Injectable } from '@nestjs/common';

export interface MarketTaxProfile {
  countryCode: string;
  countryName: string;
  currency: string;
  vatRatePercent: number;
  taxInclusivePricing: boolean;
}

@Injectable()
export class RegionalLocalizationService {
  private readonly marketTaxProfiles: Record<string, MarketTaxProfile> = {
    IN: { countryCode: 'IN', countryName: 'India', currency: 'INR', vatRatePercent: 18.0, taxInclusivePricing: true },
    AE: { countryCode: 'AE', countryName: 'United Arab Emirates', currency: 'AED', vatRatePercent: 5.0, taxInclusivePricing: true },
    SA: { countryCode: 'SA', countryName: 'Saudi Arabia', currency: 'USD', vatRatePercent: 15.0, taxInclusivePricing: true },
    QA: { countryCode: 'QA', countryName: 'Qatar', currency: 'USD', vatRatePercent: 0.0, taxInclusivePricing: true },
    KW: { countryCode: 'KW', countryName: 'Kuwait', currency: 'USD', vatRatePercent: 0.0, taxInclusivePricing: true },
    OM: { countryCode: 'OM', countryName: 'Oman', currency: 'USD', vatRatePercent: 5.0, taxInclusivePricing: true },
  };

  private readonly exchangeRates: Record<string, number> = {
    INR: 1.0,
    AED: 0.044,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
  };

  getMarketProfile(countryCode = 'IN'): MarketTaxProfile {
    return this.marketTaxProfiles[countryCode.toUpperCase()] || this.marketTaxProfiles.IN;
  }

  convertPrice(amountInBaseInrCents: number, targetCurrency = 'INR'): { amountConverted: number; formatted: string } {
    const rate = this.exchangeRates[targetCurrency.toUpperCase()] || 1.0;
    const amountInUnits = (amountInBaseInrCents / 100) * rate;

    let formatted = `₹${Math.round(amountInUnits * 100 / 100).toLocaleString('en-IN')}`;
    if (targetCurrency === 'AED') formatted = `AED ${amountInUnits.toFixed(2)}`;
    if (targetCurrency === 'USD') formatted = `$${amountInUnits.toFixed(2)}`;
    if (targetCurrency === 'EUR') formatted = `€${amountInUnits.toFixed(2)}`;
    if (targetCurrency === 'GBP') formatted = `£${amountInUnits.toFixed(2)}`;

    return { amountConverted: amountInUnits, formatted };
  }
}
