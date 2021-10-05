import gql from 'graphql-tag'

// eslint-disable-next-line import/prefer-default-export
export const ADMIN_USER_LIST = gql`
    query userList($input: UserListInput) {
        userList(input: $input) {
            meta {
                page
                pageSize
                totalPages
                total
            }
            objects {
                id
                email
                name
                birth_date
                phone
                is_active
                customer {
                    id
                    email
                    phoneNumber
                    first_name
                    last_name
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
                eth_receiving_wallet
                kyc_status
                video_ident_status
                video_ident_id
                first_name
                last_name
                lastLogin
                status
                rights
                is_2fa_enabled
                is_gtoswiss
                is_internal_sales
                token_invest_amount
                amount_contribution_gto
                bankName
                iban
                bankAddress
                sendingWithTransferwise
                bankNameTransferwise
                bankAddressTransferwise
                memberShipNumberTransferwise
            }
        }
    }
`
export const ADMIN_USER_INACTIVE_COUNT = gql`
    query userInactiveCount {
        userInactiveCount
    }
`
export const ADMIN_KYC_LIST = gql`
    query kycList($input: KycListInput) {
        kycList(input: $input) {
            meta {
                page
                pageSize
                totalPages
                total
            }
            objects
        }
    }
`
export const ADMIN_KYC_COUNT = gql`
    query kycCount {
        kycCount
    }
`
export const ADMIN_KYC_SUM = gql`
    query kycSumAmount {
        kycSumAmount
    }
`
export const DATE_UPLOAD_COPY_CSV = gql`
    query dateUploadCopyCsv {
        dateUploadCopyCsv
    }
`
