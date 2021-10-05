import gql from 'graphql-tag';

export const REGISTRATION_INDIVIDUAL_CUSTOMER = gql`
    mutation registrationIndividualCustomer($input: CustomerIndividualInput!) {
        registrationIndividualCustomer(input: $input) {
            id
            email
            phoneNumber
            first_name
            last_name
            middle_name
            uniqueId
            descriptionOfFunds
            taxNumber
            taxOffice
            birthDate
            placeOfBirth
            currency
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
    }
`;

export const UPDATE_INDIVIDUAL_CUSTOMER = gql`
    mutation updateIndividualCustomer($id: ID!, $input: CustomerIndividualUpdateInput!) {
        updateIndividualCustomer(id: $id, input: $input) {
            id
            email
            phoneNumber
            first_name
            last_name
            middle_name
            uniqueId
            descriptionOfFunds
            taxNumber
            taxOffice
            birthDate
            placeOfBirth
            currency
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
    }
`;


export const UPDATE_COMPANY_CUSTOMER = gql`
    mutation updateCompanyCustomer($id: ID!, $input: CustomerCompanyUpdateInput!) {
        updateCompanyCustomer(id: $id, input: $input) {
            id
        }
    }
`;

export const REGISTRATION_COMPANY_CUSTOMER = gql`
    mutation registrationCompanyCustomer($input: CustomerCompanyInput!) {
        registrationCompanyCustomer(input: $input) {
            id
        }
    }
`;