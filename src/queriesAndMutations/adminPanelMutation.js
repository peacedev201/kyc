import gql from 'graphql-tag';

export const CHANGE_USER_STATUS = gql`
    mutation changeUserStatus($input: ChangeUserStatusInput) {
        changeUserStatus(input: $input){
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

export const CHANGE_USER_RIGHTS = gql`
    mutation changeUserRights($input: ChangeUserRightsInput) {
        changeUserRights(input: $input){
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

export const CHANGE_CUSTOMER_COMPANY_STATUS = gql`
    mutation changeCustomerCompanyStatus($input: ChangeCustomerCompanyStatusInput) {
        changeCustomerCompanyStatus(input: $input){
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
    }
`;

export const CHANGE_CUSTOMER_STATUS = gql`
    mutation changeCustomerStatus($input: ChangeCustomerStatusInput) {
        changeCustomerStatus(input: $input){
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
            created_at
            updated_at
        }
    }
`;

export const CHANGE_APPROVED_TO_WHITELISTED_CUSTOMER_STATUS = gql`
    mutation changeApprovedToWhitelistedCustomerStatus($amount: Int, $type: String) {
        changeApprovedToWhitelistedCustomerStatus(amount: $amount, type: $type)
    }
`;

export const ADMIN_USER_LIST_CSV = gql`
    mutation userListCsv($two_fa_token: String) {
        userListCsv(two_fa_token: $two_fa_token)
    }
`

export const ADMIN_KYC_LIST_CSV = gql`
    mutation kycListCsv($type: String, $two_fa_token: String, $is_pythagoras: Boolean, $is_bank: Boolean) {
        kycListCsv(type: $type, two_fa_token: $two_fa_token, is_pythagoras: $is_pythagoras, is_bank: $is_bank)
    }
`

export const ADMIN_TRANSACTION_LIST_CSV = gql`
    mutation transactionListCsv($two_fa_token: String, $filtered_status: [String]) {
        transactionListCsv(two_fa_token: $two_fa_token, filtered_status: $filtered_status)
    }
`

export const UPLOAD_NEW_PHOTO = gql`
    mutation uploadNewPhoto($input: UploadNewPhotoInput) {
        uploadNewPhoto(input: $input)
    }
`

export const TXT_FILE_CONTRACTED = gql`
    mutation txtFileContracted($twoFaToken: String) {
        txtFileContracted(twoFaToken: $twoFaToken)
    }
`

export const TXT_FILE_DISTRIBUTION = gql`
    mutation txtFileDistribution($twoFaToken: String, $month: String) {
      txtFileDistribution(twoFaToken: $twoFaToken, month: $month)
    }
`

