export class SheetSerde {
  static deserialize(text: string) {
    const rows = []
    let buffer = ['']
    let isQuoted = false

    for (const c of text) {
      if (c === '\n') {
        rows.push(buffer)
        buffer = ['']
      } else if (c === '"') {
        isQuoted = !isQuoted
      } else if (isQuoted || ',\t'.indexOf(c) < 0) {
        buffer[buffer.length - 1] += c
      } else {
        buffer.push('')
      }
    }

    rows.push(buffer)

    return rows
  }

  static serialize(rows: string[][]) {
    return rows.map((row) => row.join('\t')).join('\n')
  }
}
