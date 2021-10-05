import gql from "graphql-tag";

export const KYC_HISTORY_CHANGE_STATUS_ADMIN = gql`
  query historyChangeStatusKycAdmin($input: HistoryChangeStatusKycInputAdmin) {
    historyChangeStatusKycAdmin(input: $input) {
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