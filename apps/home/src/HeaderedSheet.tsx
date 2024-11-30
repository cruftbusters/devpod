import { TextSheet } from './TextSheet'

export class HeaderedSheet {
  readonly iterator: IterableIterator<string[]>
  constructor(iterator: IterableIterator<string[]>) {
    this.iterator = iterator
  }

  static fromTextSheet(expectedHeaders: string[], sheet: TextSheet) {
    const headers = sheet.iterator.next()

    if (headers.done) {
      throw Error('expected headers got end of sheet')
    }

    const indices = expectedHeaders.map((name) => {
      const index = headers.value.indexOf(name)
      if (index < 0) {
        throw Error(`expected header '${name}' but it was not present`)
      }
      return index
    })

    function* it() {
      for (const record of sheet) {
        yield indices.map((index) => record[index])
      }
    }

    return new HeaderedSheet(it())
  }
  [Symbol.iterator]() {
    return this.iterator
  }
}
