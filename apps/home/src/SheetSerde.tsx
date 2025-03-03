export class SheetSerde {
  static deserialize(text: string) {
    const rows = []
    let buffer = ['']
    let isQuoted = false
    let delimiter: string | undefined = undefined

    for (const c of text) {
      if (c === '\n') {
        rows.push(buffer)
        buffer = ['']
      } else if (
        c === '"' &&
        (isQuoted || buffer[buffer.length - 1].length === 0)
      ) {
        isQuoted = !isQuoted
      } else if (
        !isQuoted &&
        delimiter === undefined &&
        ',\t'.indexOf(c) > -1
      ) {
        buffer.push('')
        delimiter = c
      } else if (!isQuoted && delimiter === c) {
        buffer.push('')
      } else {
        buffer[buffer.length - 1] += c
      }
    }

    rows.push(buffer)

    return rows
  }

  static serialize(rows: string[][]) {
    return rows.map((row) => row.join('\t')).join('\n')
  }
}
