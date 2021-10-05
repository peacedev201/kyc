import gql from "graphql-tag";

export const WALLET_ENGINE_TOKEN_MUTATION = gql`
  mutation walletEngineToken($wallet_engine_token: String) {
    walletEngineToken(wallet_engine_token: $wallet_engine_token)
  }
`;

export const WALLET_ENGINE_ACTIVATION_REQUEST = gql`
  mutation walletEngineActivationRequest($input: WalletEngineActivationRequestData) {
    walletEngineActivationRequest(input: $input)
  }
`;

export const WALLET_ENGINE_ACTIVATION_OTP_VERIFY = gql`
  mutation walletEngineActivationOTPVerify($input: WalletEngineActivationOTP) {
    walletEngineActivationOTPVerify(input: $input)
  }
`;

export const WALLET_ENGINE_CURRENT_KYC_DETAILS = gql`
  mutation walletEngineCurrentKYCDetails($input: WalletEngineRequestId) {
    walletEngineCurrentKYCDetails(input: $input)
  }
`;

export const WALLET_ENGINE_PROFILE_STATUS = gql`
  mutation walletEngineProfileStatus($input: WalletEngineRequestId) {
    walletEngineProfileStatus(input: $input)
  }
`;

export const WALLET_ENGINE_PROFILE_DETAILS = gql`
  mutation walletEngineProfileDetails($input: WalletEngineRequestId) {
    walletEngineProfileDetails(input: $input)
  }
`;

export const WALLET_ENGINE_PROFILE_UPDATE = gql`
  mutation walletEngineProfileUpdate($input: WalletEngineProfileRequestData) {
    walletEngineProfileUpdate(input: $input)
  }
`;

export const WALLET_ENGINE_UPGRADE_KYC_PROCESS = gql`
  mutation walletEngineUpgradeKYCProcess($input: WalletEngineRequestId) {
    walletEngineUpgradeKYCProcess(input: $input)
  }
`;

export const WALLET_ENGINE_TOPUP_QUERY = gql`
mutation walletEngineTopupQuery($input: WalletEngineRequestId) {
    walletEngineTopupQuery(input: $input)
  }
`;

export const WALLET_ENGINE_TOPUP_CHANNELS = gql`
  mutation walletEngineTopupChannels($input: WalletEngineTopUpChannelRequestData) {
    walletEngineTopupChannels(input: $input)
  }
`;

export const WALLET_ENGINE_TOPUP_BANK = gql`
  mutation walletEngineTopupBank($input: WalletEngineTopUpRequestData) {
    walletEngineTopupBank(input: $input)
  }
`;

export const WALLET_ENGINE_TOPUP_RAPYD_CHECKOUT = gql`
  mutation walletEngineTopupRapydCheckout($input: WalletEngineTopUpRequestData) {
    walletEngineTopupRapydCheckout(input: $input)
  }
`;

export const WALLET_ENGINE_WITHDRAW_BANK = gql`
  mutation walletEngineWithDrawBank($input: JSON) {
    walletEngineWithDrawBank(input: $input)
  }
`;