import type { NextApiRequest, NextApiResponse } from 'next';
import { Currency } from '@/types';

interface ExchangeRateResponse {
  rates: Record<Currency, number>;
  timestamp: number;
}

interface ErrorResponse {
  error: string;
}

// Fallback rates in case API fails
const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  TRY: 34.5,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExchangeRateResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;

  if (!appId) {
    // Return fallback rates if no API key configured
    return res.status(200).json({
      rates: FALLBACK_RATES,
      timestamp: Date.now(),
    });
  }

  try {
    const response = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=USD,EUR,GBP,TRY`
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    const rates: Record<Currency, number> = {
      USD: 1,
      EUR: data.rates.EUR || FALLBACK_RATES.EUR,
      GBP: data.rates.GBP || FALLBACK_RATES.GBP,
      TRY: data.rates.TRY || FALLBACK_RATES.TRY,
    };

    return res.status(200).json({
      rates,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Exchange rate API error:', error);
    // Return fallback rates on error
    return res.status(200).json({
      rates: FALLBACK_RATES,
      timestamp: Date.now(),
    });
  }
}
