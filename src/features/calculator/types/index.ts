// Calculator feature types

export type ServiceType = "transfer" | "daytrip";

export type CalculatorFormData = {
  serviceType: ServiceType;
  date: string;
  passengers: number;
  from?: string;
  to?: string;
  days?: number;
  trip?: string;
};

export type PriceResult = {
  price: number;
  currency: string;
  season?: "peak" | "off";
  details?: string;
};

export type SpecialRequestResult = {
  specialRequest: true;
  message: string;
};

export type CalculatorResult = PriceResult | SpecialRequestResult;

export type CalculatorFieldErrors = {
  date?: string;
  passengers?: string;
  from?: string;
  to?: string;
  days?: string;
  trip?: string;
};

export type CalculatorState = {
  formData: CalculatorFormData;
  result: CalculatorResult | null;
  isLoading: boolean;
  error: string | null;
};
