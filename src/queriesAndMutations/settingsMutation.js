import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const SAVE_SETTINGS = gql`
    mutation settingsSave($input: SettingsInput!) {
        settingsSave(input: $input)
    }
`;