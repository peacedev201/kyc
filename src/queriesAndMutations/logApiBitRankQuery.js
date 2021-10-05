import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const LAST_CHECK_ETH_ADDRESS = gql`
  query lastCheckEthAddress($input: LastCheckEthAddressInput) {
    lastCheckEthAddress(input: $input) {
      id,
      url,
      response,
      error,
      send_data,
      user_id,
      kyc_individual_id,
      kyc_company_id,
    }
  }
`;

