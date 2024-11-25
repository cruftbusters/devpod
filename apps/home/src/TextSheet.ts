export class TextSheet {
  iterator: IterableIterator<string[]>
  constructor(iterator: IterableIterator<string[]>) {
    this.iterator = iterator
  }

  static fromArray(...array: string[][]) {
    return new TextSheet(array.values())
  }

  static fromText(text: string) {
    const rows = text.split('\n').map((line) => line.split(','))
    return new TextSheet(rows.values())
  }

  toArray() {
    return Array.from(this.iterator)
  }

  toText() {
    return Array.from(this.iterator)
      .map((row) => row.join(','))
      .join('\n')
  }
}
