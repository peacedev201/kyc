import gql from 'graphql-tag';

export const REGISTRATION = gql`
    mutation registration($input: RegistrationInput) {
        registration(input: $input) {
            id
            name
            email
            is_active
        }
    }
`;

export const FIRST_LOGIN = gql`
    mutation firstLogin($first_auth_token: String) {
        firstLogin(first_auth_token: $first_auth_token) {
            accessToken
            refreshToken
        }
    }
`;

export const AUTH_TOKEN = gql`
    mutation authToken($auth_token: String) {
        authToken(auth_token: $auth_token) {
            accessToken
            refreshToken
        }
    }
`;


export const SALES_AUTH_TOKEN = gql`
    mutation salesAuthTokenLogin($auth_token: String) {
        salesAuthTokenLogin(auth_token: $auth_token) {
            accessToken
            refreshToken
        }
    }
`;

export const LOGIN = gql`
    mutation login($input: LoginInput) {
        login(input: $input) {
            accessToken
            refreshToken
        }
    }
`;

export const REFRESH_TOKEN = gql`
    mutation refreshToken($input: RefreshTokenInput) {
        refreshToken(input: $input) {
            accessToken
            refreshToken
        }
    }
`;

export const REGISTRATION_CONFIRM = gql`
    mutation registrationConfirm($input: RegistrationConfirmInput) {
        registrationConfirm(input: $input) {
            accessToken
            refreshToken
        }
    }
`;

export const RESTORE = gql`
    mutation restore($input: RestoreInput) {
        restore(input: $input)
    }
`;

export const RESTORE_CHECK = gql`
    mutation restoreCheck($input: RestoreCheckInput) {
        restoreCheck(input: $input)
    }
`;

export const RESTORE_CONFIRM = gql`
    mutation restoreConfirm($input: RestoreConfirmInput) {
        restoreConfirm(input: $input) {
            accessToken
            refreshToken
        }
    }
`;


export const PERSONAL_DATA_MUTATION = gql`
    mutation personalData($input: PersonalDataInput!) {
      personalData(input: $input)
    }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
    mutation changePassword($input: ChangePasswordInput!) {
      changePassword(input: $input)
    }
`;

export const WALLET_ADDRESS_MUTATION = gql`
    mutation walletAddress($eth_receiving_wallet: String) {
      walletAddress(eth_receiving_wallet: $eth_receiving_wallet)
    }
`;

export const SET_2FA_SECRET = gql`
    mutation set2FASecret($secret: String, $token: String) {
      set2FASecret(secret: $secret, token: $token)
    }
`;


export const DISABLE_2FA = gql`
    mutation disable2FA($token: String) {
      disable2FA(token: $token)
    }
`;

export const IS_2FA_NEEDED = gql`
    mutation is2FANeeded($email: String) {
      is2FANeeded(email: $email)
    }
  `;

export const CHANGE_BANK_INFO = gql`
    mutation changeBankInfo($input: ChangeBankInfoInput) {
        changeBankInfo(input: $input)
    }
`;

export const CHANGE_USER_STATUS_VIDEO_IDENTIFICATION = gql`
    mutation changeUserStatusVideoIdentification($id: Int, $videoIdentificationStatus: String) {
        changeUserStatusVideoIdentification(id: $id, videoIdentificationStatus: $videoIdentificationStatus){
            id
            email
            name
            is_active
            lastLogin
            status
            rights
        }
    }
`;

export const CHANGE_USER_VIDEO_IDENTIFICATION_ID = gql`
    mutation changeUserVideoIdentificationId($id: Int, $videoIdentificationId: String) {
        changeUserVideoIdentificationId(id: $id, videoIdentificationId: $videoIdentificationId){
            id
            email
            name
            is_active
            lastLogin
            status
            rights
        }
    }
`;