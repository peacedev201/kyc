import BigNumber from 'bignumber.js'
import { ACCEPTED_CURRENCIES } from '../constants/contribute'

const bignumberify = (value) => new BigNumber(value)

// eslint-disable-next-line camelcase
export const ethToToken = (ethAmount, { token_to_eth }) => bignumberify(ethAmount).dividedBy(token_to_eth).toString()

// eslint-disable-next-line camelcase
export const tokenToEth = (tokenAmount, { token_to_eth }) => bignumberify(tokenAmount).multipliedBy(token_to_eth).toString()

export const isFiat = (name) => ACCEPTED_CURRENCIES.find((currency) => currency === name) !== undefined


export const fiatToEth = (name, amount, exchangeRates) => {
  const lcName = name.toLowerCase()
  const ethToFiat = exchangeRates[`eth_to_${lcName}`]

  if (!ethToFiat) {
    return NaN
  }

  switch (lcName) {
    case 'usd':
    case 'eur':
    case 'chf':
      return bignumberify(amount).dividedBy(ethToFiat).toString()
    default:
      return NaN
  }
}

export const fiatToToken = (name, amount, exchangeRates) => {
  const lcName = name.toLowerCase()
  switch (lcName) {
    case 'usd':
    case 'eur':
    case 'chf':
      return ethToToken(fiatToEth(lcName, amount, exchangeRates), exchangeRates).toString()
    default:
      return NaN
  }
}

export const ethToFiat = (fiatName, amount, exchangeRates) => {
  if (fiatName === null || fiatName === undefined) {
    return 'undefined'
  }
  const lcFiatName = fiatName.toLowerCase()

  if (lcFiatName === 'eth') return amount

  const rate = exchangeRates[`eth_to_${lcFiatName}`]
  if (typeof rate === 'undefined') {
    throw new Error('Exchange rate for this FIAT is not provided')
  }

  return bignumberify(amount).multipliedBy(rate).decimalPlaces(2).toString()
}

export const roundUp = (value, decimals) => bignumberify(value).decimalPlaces(decimals).toString()
