import { describe, test, expect } from 'vitest'

function SchemaV2() {
  function read(text: string) {
    return []
  }

  return { read }
}

describe(SchemaV2, () => {
  const schema = SchemaV2()
  test('read', () => {
    const actual = schema.read('')
    const expected = new Array<string>()
    expect(actual).toEqual(expected)
  })
})
