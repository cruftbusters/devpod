import { Movement } from './database'

export function Schema(
  headers = ['key', 'date', 'debitAccount', 'creditAccount', 'amount'],
) {
  async function _export(movements: Movement[]) {
    let content = 'data:text/csv;charset=utf-8,'
    content += headers.join(',') + '\r\n'
    for (const movement of movements) {
      content +=
        [
          movement.key,
          movement.date,
          movement.debitAccount,
          movement.creditAccount,
          movement.amount,
        ].join(',') + '\r\n'
    }
    window.open(encodeURI(content))
  }

  async function _import(key: string, files: FileList | null) {
    const movements = []

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
          let movement: Movement = {
            key: '',
            ledger: key,
            date: '',
            debitAccount: '',
            creditAccount: '',
            amount: 0,
          }
          for (const header of headers) {
            movement = {
              ...movement,
              [header]:
                header === 'amount'
                  ? parseInt(values.shift() || '')
                  : values.shift(),
            }
          }
          movements.push(movement)
        }
      }
    }

    return movements
  }

  return { _import, _export }
}
