export class TextSheet {
  iterator: IterableIterator<string[]>
  constructor(iterator: IterableIterator<string[]>) {
    this.iterator = iterator
  }

  static fromArray(...array: string[][]) {
    return new TextSheet(array.values())
  }

  static fromText(text: string) {
    let mode
    const rows = []
    for (const line of text.split('\n')) {
      const values = ['']

      let isQuoted = false
      for (const char of line) {
        if (values[values.length - 1].length === 0 && char === '"') {
          isQuoted = true
        } else if (isQuoted && char === '"') {
          isQuoted = false
        } else if (
          !isQuoted &&
          mode === undefined &&
          (char === ',' || char === '\t')
        ) {
          mode = char
          values.push('')
        } else if (!isQuoted && char === mode) {
          values.push('')
        } else {
          values[values.length - 1] += char
        }
      }

      if (values.length > 1 || values[0].length > 0) {
        rows.push(values)
      }
    }
    return new TextSheet(rows.values())
  }

  toArray() {
    return Array.from(this.iterator)
  }

  toText() {
    return Array.from(this.iterator)
      .map((row) =>
        row
          .map((value) => (value.indexOf(',') > -1 ? `"${value}"` : value))
          .join(','),
      )
      .join('\n')
  }
}
