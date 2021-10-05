import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const SETTINGS = gql`
    query settings {
        settings {
            token_type
            token_name
            token_symbol
            base_currency
            minimum_investment_amount
            video_ident_value
            interval_upload_csv_pythagoras
            prospectus_date
            show_source_signup
            send_gto_api_when_changing_status
            accepted_currencies
            accepted_mandatory_kyc
            accepted_field_application_individual_fiat
            accepted_field_application_individual_crypto
            kyc_text
            prospectus_or_issuing
            issuing_guidelines
            not_video_ident_countries
            high_risk_countries
            low_risk_countries
            days_for_notifications
            kyc_levels
            identification

            google_analytics_id
            google_tag_manager_id
            pixel_id

            company
            bank
            crypto
            mailgun

            logo_path
            example_photo_proof_path
            logo_for_dark_bg_path
            brief_logo_path
            dataroom_logo_path
            source_of_funds_example_path
            source_of_address_for_tokens_example_path
            rights_of_withdrawal_path

            login_youtube_video
            first_link_login
            first_text_login
            second_link_login
            second_text_login

            add_ether_wallet_later_option

            internal_sales_api
            internal_sales_api_key
        }
    }
`;

export const PUBLIC_SETTINGS = gql`
    query publicSettings {
        publicSettings {
            token_type
            token_name
            token_symbol
            base_currency
            show_source_signup
            minimum_investment_amount
            video_ident_value
            prospectus_date
            accepted_currencies
            accepted_mandatory_kyc
            accepted_field_application_individual_fiat
            accepted_field_application_individual_crypto
            kyc_text
            prospectus_or_issuing
            issuing_guidelines
            not_video_ident_countries
            high_risk_countries
            low_risk_countries
            days_for_notifications
            kyc_levels
            identification

            google_analytics_id
            google_tag_manager_id
            pixel_id

            company
            bank
            crypto

            logo_path
            example_photo_proof_path
            logo_for_dark_bg_path
            brief_logo_path
            dataroom_logo_path
            source_of_funds_example_path
            source_of_address_for_tokens_example_path
            rights_of_withdrawal_path

            login_youtube_video
            first_link_login
            first_text_login
            second_link_login
            second_text_login

            add_ether_wallet_later_option

            internal_sales_api
            internal_sales_api_key
        }
    }
`;