import gql from "graphql-tag";

export const KYC_LVL_HISTORY_USER_ADMIN = gql`
  query kycLvlHistoryUserAdmin($input: KycLvlHistoryListInputAdmin) {
    kycLvlHistoryUserAdmin(input: $input) {
      meta {
        page
        pageSize
        totalPages
        total
      }
      objects
    }
  }
`;

export const KYC_LVL_USER = gql`
  query kycLvlUser($input: KycLvlInputUser) {
    kycLvlUser(input: $input)
  }
`;