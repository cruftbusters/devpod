import { describe, expect, test } from 'vitest'
import { TextSheet } from './TextSheet'

describe(TextSheet, () => {
  test('from array to text', () => {
    const sheet = TextSheet.fromArray(
      ['date', 'memo'],
      ['2024-01-01', 'the memo'],
    )
    expect(sheet.toText()).toBe('date,memo\n2024-01-01,the memo')
  })
  test('from text to array', () => {
    const sheet = TextSheet.fromText('date,memo\n2024-01-01,the memo')
    expect(sheet.toArray()).toEqual([
      ['date', 'memo'],
      ['2024-01-01', 'the memo'],
    ])
  })
})
