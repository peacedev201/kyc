import gql from "graphql-tag";

export const CHANGE_STATUS_KYC_LEVEL = gql`
  mutation changeStatusKycLevel($input: ChangeKycStatusInput) {
    changeStatusKycLevel(input: $input)
  }
`;

export const CHANGE_KYC_LEVEL_ONE_TO_TWO = gql`
  mutation changeKycLevelOneToTwo($input: ChangeKycLvlInput) {
    changeKycLevelOneToTwo(input: $input)
  }
`;

export const CHANGE_KYC_LEVEL_TWO_TO_THREE = gql`
  mutation changeKycLevelTwoToThree($input: ChangeKycLvlInput) {
    changeKycLevelTwoToThree(input: $input)
  }
`;

export const CHANGE_KYC_LEVEL_THREE_TO_FOUR = gql`
  mutation changeKycLevelThreeToFour($input: ChangeKycLvlInput) {
    changeKycLevelThreeToFour(input: $input)
  }
`;