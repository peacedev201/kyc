import { useQuery } from '@apollo/react-hooks'
import { EXCHANGE_RATES } from '../queriesAndMutations'

// eslint-disable-next-line import/prefer-default-export
export const useExchangeRates = (options = {}) => useQuery(EXCHANGE_RATES, options)
