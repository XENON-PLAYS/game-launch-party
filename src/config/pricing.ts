
export const PRICING_CONFIG = {
  anual: "https://buy.stripe.com/test_fZucN5gUicNqg1g1Rp7g400",
  semestral: "https://buy.stripe.com/test_9B628r1Zo8xaaGW8fN7g401",
  mensal: "https://buy.stripe.com/test_6oUaEXgUidRug1g0Nl7g402",
} as const;

export type PlanType = keyof typeof PRICING_CONFIG;
