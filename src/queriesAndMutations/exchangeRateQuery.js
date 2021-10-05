import gql from 'graphql-tag'

export const EXCHANGE_RATES = gql`
    query exchangeRates {
      exchangeRates {
        token_to_eth
        eth_to_usd
        eth_to_eur
        eth_to_chf
      }
    }
  `;