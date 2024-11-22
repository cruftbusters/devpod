import { Movement } from './database'

export function Schema(
  headers = ['key', 'date', 'debitAccount', 'creditAccount', 'amount'],
) {
  async function _export(movements: Movement[]) {
    let content = 'data:text/csv;charset=utf-8,'
    content += headers.join(',') + '\r\n'
    for (const movement of movements) {
      content += [movement.key, movement.date].join(',') + '\r\n'
      for (const transfer of movement.transfers) {
        content +=
          [
            '',
            '',
            transfer.debitAccount,
            transfer.creditAccount,
            transfer.amount,
          ].join(',') + '\r\n'
      }
    }
    window.open(encodeURI(content))
  }

  async function _import(key: string, files: FileList | null) {
    const movements: Movement[] = []

    for (const file of files || []) {
      const text = await file.text()
      const lines = text.split('\r\n')
      const tokens = lines.shift()?.split(',')
      if (tokens?.length !== headers.length) {
        throw Error(`expected ${headers} got ${tokens}`)
      }
      for (let index = 0; index < headers.length; index++) {
        if (tokens[index] !== headers[index]) {
          throw Error(`expected ${headers} got ${tokens}`)
        }
      }
      for (const line of lines) {
        if (line.length > 0) {
          const values = line.split(',')
          if (values.length > 2) {
            values.shift()
            values.shift()
            movements[movements.length - 1].transfers.push({
              debitAccount: values.shift() || '',
              creditAccount: values.shift() || '',
              amount: parseInt(values.shift() || ''),
            })
          } else {
            movements.push({
              key: values.shift() || '',
              ledger: key,
              date: values.shift() || '',
              transfers: [],
            })
          }
        }
      }
    }

    return movements
  }

  return { _import, _export }
}
