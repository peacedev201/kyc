import gql from "graphql-tag";

export const UPDATE_COMMENT_KYC_LIST = gql`
  query updateCommentKyc($input: UpdateCommentKycInput) {
    updateCommentKyc(input: $input) {
      meta {
        page
        pageSize
        totalPages
        total
      }
      objects {
        id
        status_type_before
        status_type_after
        comment
        user_id
        kyc_individual_id
        kyc_company_id
        transaction_id
      }
    }
  }
`;
