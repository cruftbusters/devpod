export type Money = { type: 'cents'; amount: number }
export type Balance = Money & { children?: Map<string, Balance> }
