import gql from 'graphql-tag'


export const PUSH_EXCHANGE_RATES = gql`
    mutation pushExchangeRates($input: ExchangeRatesInput!) {
      pushExchangeRates(input: $input)
    }  
  `;