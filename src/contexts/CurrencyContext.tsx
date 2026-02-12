import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrencyCode: (code: string) => void;
  convert: (amountUSD: number) => number;
  formatPrice: (amountUSD: number) => string;
  rates: Record<string, number> | null;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    return localStorage.getItem('preferred_currency') || 'USD';
  });
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-exchange-rates');
        if (error) throw error;
        setRates(data.rates);
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err);
        // Fallback rates
        setRates({ USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, NPR: 133.5, CNY: 7.24, JPY: 154.5 });
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const setCurrencyCode = useCallback((code: string) => {
    setCurrencyCodeState(code);
    localStorage.setItem('preferred_currency', code);
  }, []);

  const convert = useCallback((amountUSD: number): number => {
    if (!rates || currencyCode === 'USD') return amountUSD;
    const rate = rates[currencyCode] || 1;
    return amountUSD * rate;
  }, [rates, currencyCode]);

  const formatPrice = useCallback((amountUSD: number): string => {
    const converted = convert(amountUSD);
    // JPY has no decimals
    const decimals = currencyCode === 'JPY' ? 0 : 2;
    return `${currency.symbol}${converted.toFixed(decimals)}`;
  }, [convert, currency.symbol, currencyCode]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, convert, formatPrice, rates, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
