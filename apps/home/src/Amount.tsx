export class Amount {
  constructor(
    public prefix: string = '',
    public mantissa: number = 0,
    public precision: number = 0,
  ) {}

  static parse(text: string) {
    const prefix = text.replace(/[0-9.\-(),\s]/g, '')

    const digitsAndDots = text.replace(/[^0-9.]/g, '')
    if (digitsAndDots === '') {
      return new Amount(prefix, 0, 2)
    }
    const index = digitsAndDots.indexOf('.')
    const precision = index < 0 ? 0 : digitsAndDots.length - 1 - index
    const mantissa = parseInt(digitsAndDots.replace('.', ''))
    const sign = text.indexOf('-') < 0 && text.indexOf('(') < 0 ? 1 : -1

    return new Amount(prefix, sign * mantissa, precision)
  }

  static PARSE_ERROR = {
    PRECISION_MISMATCH: (expected: Amount, actual: Amount) =>
      `expected precision to match '${expected.format()}' got '${actual.format()}'`,
    PREFIX_MISMATCH: (expected: Amount, actual: Amount) =>
      `expected prefix to match '${expected.format()}' got '${actual.format()}'`,
  }

  negate() {
    return new Amount(this.prefix, -this.mantissa, this.precision)
  }

  plus(other: Amount) {
    if (this.precision != other.precision) {
      throw Error(Amount.PARSE_ERROR.PRECISION_MISMATCH(this, other))
    } else if (this.prefix != other.prefix) {
      throw Error(Amount.PARSE_ERROR.PREFIX_MISMATCH(this, other))
    }
    return new Amount(
      this.prefix,
      this.mantissa + other.mantissa,
      this.precision,
    )
  }

  format() {
    const digits = Math.abs(this.mantissa)
      .toString()
      .padStart(this.precision + 1, '0')
    const index = digits.length - this.precision
    const left = digits.slice(0, index)
    const leftThruples: string[] = []
    for (let index = 0; index < left.length; index++) {
      const char = left[left.length - 1 - index]
      if (index % 3 === 0) {
        leftThruples.unshift(char)
      } else {
        leftThruples[0] = `${char}${leftThruples[0]}`
      }
    }
    let result = leftThruples.join(',')
    result = `${result}.${digits.slice(index)}`
    if (this.prefix) {
      result = `${this.prefix} ${result}`
    }
    if (this.mantissa < 0) {
      result = `( ${result} )`
    }
    return result
  }
}
