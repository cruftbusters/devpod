export type Amount = { value: number; unit: 'cents' }
export type Amount2 = {
  prefix: string
  sign: number
  digits: string
  precision: number
  suffix: string
}
export type Balance = Amount & { children?: Map<string, Balance> }
export type Transfer = { debitAccount: string; creditAccount: string; amount: Amount2 }
