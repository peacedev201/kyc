import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const ME = gql`
    query me {
        me {
            id
            email
            name
            birth_date
            phone
            is_active
            eth_receiving_wallet
            kyc_status
            video_ident_status
            video_ident_id
            customer {
                id
                email
                phoneNumber
                uniqueId
                descriptionOfFunds
                taxNumber
                taxOffice
                birthDate
                placeOfBirth
                nationality
                countryOfResidence
                residentialAddress
                city
                postalCode
                wallet
                tokenAddress
                personType
                duties
                relationshipToPEP
                documentType
                mainDocumentPhotoImgPath
                photoWithMeImgPath
                backSideDocumentPhotoImgPath
                documentProofOfResidenceImgPath
                amount
                status
                source_of_funds
                source_of_funds_other
                created_at
                updated_at
            }
            customerCompany {
                id
                email
                companyName
                companyAddress
                companyRegisterNumber
                taxNumber
                taxOffice
                descriptionRegisterExtractBusinessActivity
                authorizedPersonals
                documentType
                commercialRegisterExtractImgPath
                proofOfOwnerImgPath
                proofOfUboEpresentativesImgPath
                wallet
                tokenAddress
                personType
                duties
                relationshipToPEP
                amount
                status
                created_at
                updated_at
            }
            is_2fa_enabled
            rights
            is_gtoswiss
            is_internal_sales
            token_invest_amount
            amount_contribution_gto
            first_name
            last_name
            middle_name
            bankName
            iban
            bankAddress
            sendingWithTransferwise
            bankNameTransferwise
            bankAddressTransferwise
            memberShipNumberTransferwise
            wallet_engine_token
        }
    }
`;

export const ME_INVEST_IN_BASE_CURRENCY = gql`
    query meInvestInBaseCurrency {
        meInvestInBaseCurrency {
            invest_amount,
            approved_invest,
            invest_token_without_kyc,
            invest_token,
            kyc_lvl_change,
            currency,
            current_lvl
        }
    }
`;

export const NEW_2FA_SECRET = gql`
    query new2FASecret {
      new2FASecret
    }
  `;

export const VIDEO_ID_ATTENDED_AUTHORIZATION = gql`
   query VideoIDAttendAuthorization {
       VideoIDAttendAuthorization {
           status
           id
           authorization
       }
    }
`;