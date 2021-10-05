import gql from 'graphql-tag'


export const CUSTOMER_INDIVIDUAL = gql`
  query customerIndividual($id: ID!) {
    customerIndividual(id: $id) {
      id
      email
      phoneNumber
      first_name
      last_name
      middle_name
      currency
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
      mainDocumentUpload {
        id
        storage_key
        preview_storage_key
        mime_type
        original_name
        is_public
      }
      photoWithMeUpload {
        id
        storage_key
        preview_storage_key
        mime_type
        original_name
        is_public
      }
      backSideDocumentUpload {
        id
        storage_key
        preview_storage_key
        mime_type
        original_name
        is_public
      }
      proofOfResidenceUpload {
        id
        storage_key
        preview_storage_key
        mime_type
        original_name
        is_public
      }
    }
  }
`;

export const CUSTOMER_COMPANY = gql`
  query customerCompany($id: ID!) {
    customerCompany(id: $id) {
      id
      email
      companyName
      companyAddress
      companyRegisterNumber
      taxNumber
      taxOffice
      currency
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
      commercialRegisterExtractUpload {
        id
        storage_key
        preview_storage_key
        mime_type
        original_name
        is_public
      }
      proofOfOwnerUpload {
        id
        storage_key
        preview_storage_key
        mime_type
        original_name
        is_public
      }
      proofOfUboRepresentativesUpload {
        id
        storage_key
        preview_storage_key
        mime_type
        original_name
        is_public
      }
    }
  }
`;