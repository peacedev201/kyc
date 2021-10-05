import gql from "graphql-tag";

export const VOLT_OAUTH_2 = gql`
  mutation voltOAuth2($input: VoltOAuth2Input) {
    voltOAuth2(input: $input)
  }
`;

export const VOLT_GET_SUPPORTED_COUNTRIES = gql`
  mutation voltGetSupportedCountries($input: VoltOAuth2Input) {
    voltGetSupportedCountries(input: $input)
  }
`;

export const VOLT_GET_SUPPORTED_BANKS = gql`
  mutation voltGetSupportedBanks($input: VoltOAuth2Input) {
    voltGetSupportedBanks(input: $input)
  }
`;

export const VOLT_PAYMENT_INIT_REQUEST = gql`
  mutation voltPaymentInitRequest($input: VoltPaymentInput) {
    voltPaymentInitRequest(input: $input)
  }
`;

export const VOLT_GET_PAYMENT_DETAILS = gql`
  mutation voltGetPaymentDetails($input: VoltPaymentDetailsInput) {
    voltGetPaymentDetails(input: $input)
  }
`;