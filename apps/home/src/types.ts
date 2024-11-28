export type Amount = { value: number; unit: 'cents' }
export type Balance = Amount & { children?: Map<string, Balance> }
