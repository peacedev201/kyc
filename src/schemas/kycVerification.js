import iconPassport from '../media/images/icon-passport.png'
import iconPassportActive from '../media/images/icon-passport-active.png'
import passportImg from '../media/images/vector-passport.png'
import inHandImg from '../media/images/vector-hand.png'
import residenceProofImg from '../media/images/residence-proof.png'
import iconNationalId from '../media/images/icon-national-id.png'
import iconNationalIdActive from '../media/images/icon-national-id-active.png'
import idImg from '../media/images/vector-nidcard.png'
import idBackImg from '../media/images/vector-id-back.png'
import iconLicense from '../media/images/icon-licence.png'
import iconLicenseActive from '../media/images/icon-licence-active.png'
import drivingLicenseImg from '../media/images/vector-driving.png'

export const MAIN_INFO_SCHEMAS = {
  email: {
    label: 'Email Address',
    isRequired: true,
    default: '',
  },
  phoneNumber: {
    label: 'Phone Number',
    type: 'phone',
    isRequired: true,
    default: '',
  },
  firstName: {
    label: 'Your name',
    isRequired: true,
    default: '',
  },
  lastName: {
    label: 'Your surname',
    isRequired: true,
    default: '',
  },
  middleName: {
    label: 'Your middle name',
    isRequired: false,
    default: '',
  },
  uniqueId: {
    label: 'Identification Number (Passport, National ID Card, Drivers License)',
    isRequired: true,
    default: '',
  },
  taxNumber: {
    label: 'Tax Number',
    isRequired: true,
    isOver900USDField: true,
    default: '',
  },
  taxOffice: {
    label: 'Tax Office',
    isOver900USDField: true,
    default: '',
  },
  birthDate: {
    label: 'Date of Birth ',
    isRequired: true,
    type: 'date',
    default: '',
  },
  personType: {
    label: 'Person type',
    default: '',
    adminOnly: true,
  },
  duties: {
    label: 'Duties',
    default: '-',
    adminOnly: true,
  },
  relationshipToPEP: {
    label: 'Relationship to PEP',
    default: '-',
    adminOnly: true,
  },
  descriptionOfFunds: {
    label: 'Description Of Funds',
    isRequired: true,
    isOver900USDField: true,
    default: '',
  },
}

export const ADDRESS_INFO_SCHEMAS = {
  placeOfBirth: {
    label: 'Place Of Birth',
    isRequired: true,
    default: '',
  },
  nationality: {
    label: 'Nationality',
    isRequired: true,
    default: '',
  },
  countryOfResidence: {
    label: 'Country of Residence',
    isRequired: true,
    default: '',
  },
  residentialAddress: {
    label: 'Residential Address',
    isRequired: true,
    default: '',
  },
  city: {
    label: 'City',
    isRequired: true,
    default: '',
  },
  postalCode: {
    label: 'Postal Code',
    isRequired: true,
    default: '',
  },
}

export const INDIVIDUAL_FILES_SCHEMAS = {
  mainDocumentPhoto: {
    schemaTitle: 'mainDocumentPhoto',
    value: 'MAIN_DOCUMENT_PHOTO',
    label: 'Front side',
    propertyPath: 'mainDocumentUpload',
    default: {},
    nameInDb: 'main_document_upload_id',
  },
  photoWithMe: {
    schemaTitle: 'photoWithMe',
    value: 'PHOTO_WITH_ME',
    label: 'Photo with user',
    propertyPath: 'photoWithMeUpload',
    default: {},
    nameInDb: 'photo_with_me_upload_id',
  },
  backSideDocumentPhoto: {
    schemaTitle: 'backSideDocumentPhoto',
    value: 'BACK_SIDE_DOCUMENT_PHOTO',
    label: 'Back side',
    propertyPath: 'backSideDocumentUpload',
    default: {},
    nameInDb: 'back_side_document_upload_id',
  },
  documentProofOfResidence: {
    schemaTitle: 'documentProofOfResidence',
    value: 'DOCUMENT_PROOF_OF_RESIDENCE',
    label: 'Proof of residence',
    propertyPath: 'proofOfResidenceUpload',
    default: {},
    nameInDb: 'proof_of_residence_upload_id',
  },
}

export const INDIVIDUAL_DOCUMENT_TYPE_ENUM = {
  passport: {
    value: 'PASSPORT',
    label: 'Passport',
    icon: iconPassport,
    iconActive: iconPassportActive,
    require: [
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.mainDocumentPhoto,
        img: passportImg,
        title: 'Upload Here Your Passport Copy',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.backSideDocumentPhoto,
        img: idBackImg,
        title: 'Upload Here Your Passport Back Side',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.photoWithMe,
        img: inHandImg,
        title: 'Upload a selfie as a Photo Proof while holding document in your hand',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.documentProofOfResidence,
        img: residenceProofImg,
        title: 'Upload Your Proof of Residence',
      },
    ],
  },
  nationalIdCard: {
    value: 'NATIONAL_ID_CARD',
    label: 'National Card',
    icon: iconNationalId,
    iconActive: iconNationalIdActive,
    require: [
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.mainDocumentPhoto,
        img: idImg,
        title: 'Upload Here Your National ID Card Copy',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.backSideDocumentPhoto,
        img: idBackImg,
        title: 'Upload Here Your National ID Back Side',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.photoWithMe,
        img: inHandImg,
        title: 'Upload a selfie as a Photo Proof while holding document in your hand',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.documentProofOfResidence,
        img: residenceProofImg,
        title: 'Upload Your Proof of Residence',
      },
    ],
  },
  driverLicense: {
    value: 'DRIVER_LICENSE',
    label: 'Driver’s License',
    icon: iconLicense,
    iconActive: iconLicenseActive,
    require: [
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.mainDocumentPhoto,
        img: drivingLicenseImg,
        title: 'Upload Here Your Driver’s License Copy',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.backSideDocumentPhoto,
        img: idBackImg,
        title: 'Upload Here Your Driver License Back Side',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.photoWithMe,
        img: inHandImg,
        title: 'Upload a selfie as a Photo Proof while holding document in your hand',
      },
      {
        schema: INDIVIDUAL_FILES_SCHEMAS.documentProofOfResidence,
        img: residenceProofImg,
        title: 'Upload Your Proof of Residence',
      },
    ],
  },
}

export const MAIN_INFO_COMPANY_SCHEMAS = {
  email: {
    label: 'Email Address',
    isRequired: true,
    default: '',
  },
  companyName: {
    label: 'Company Name',
    isRequired: true,
    default: '',
  },
  companyAddress: {
    label: 'Company Address',
    isRequired: true,
    default: '',
  },
  companyRegisterNumber: {
    label: 'Company Register Number',
    isRequired: true,
    default: '',
  },
  taxNumber: {
    label: 'Tax Number',
    isRequired: true,
    default: '',
    isOver900USDField: true,
  },
  taxOffice: {
    label: 'Tax Office',
    isRequired: true,
    default: '',
    isOver900USDField: true,
  },
  descriptionRegisterExtractBusinessActivity: {
    label: 'Description register extract of business activity',
    isRequired: true,
    default: '',
  },
  authorizedPersonals: {
    label: 'Authorized Representatives',
    isRequired: true,
    type: 'array',
    default: [''],
  },
  personType: {
    label: 'Person type',
    default: '',
    adminOnly: true,
  },
  duties: {
    label: 'Duties',
    default: '-',
    adminOnly: true,
  },
  relationshipToPEP: {
    label: 'Relationship to PEP',
    default: '-',
    adminOnly: true,
  },
}

export const PEP_INFO_SCHEMAS = {

}

export const COMPANY_FILES_SCHEMAS = {
  commercialRegisterExtractImg: {
    schemaTitle: 'commercialRegisterExtractImg',
    value: 'COMMERCIAL_REGISTER_EXTRACT',
    label: 'Commercial register extract',
    propertyPath: 'commercialRegisterExtractUpload',
    default: {},
    nameInDb: 'commercial_register_extract_upload_id',
  },
  proofOfOwnerImg: {
    schemaTitle: 'proofOfOwnerImg',
    value: 'PROOF_OF_OWNER',
    label: 'Proof of owner',
    propertyPath: 'proofOfOwnerUpload',
    default: {},
    nameInDb: 'proof_of_owner_upload_id',
  },
  proofOfUboRepresentativesImg: {
    schemaTitle: 'proofOfUboRepresentativesImg',
    value: 'PROOF_OF_UBO_REPRESENTATIVES',
    label: 'Proof of UBO representatives',
    propertyPath: 'proofOfUboRepresentativesUpload',
    default: {},
    nameInDb: 'proof_of_ubo_representatives_upload_id',
  },
}

export const COMPANY_DOCUMENT_TYPE_ENUM = {
  company: {
    value: 'COMPANY',
    label: 'Copy of Commercial Register Extract',
    require: [
      {
        schema: COMPANY_FILES_SCHEMAS.commercialRegisterExtractImg,
        img: residenceProofImg,
        title: 'Upload Your Copy of Commercial Register Extract',
      },
      /* {
        schema: COMPANY_FILES_SCHEMAS.proofOfOwnerImg,
        img: residenceProofImg,
        title: 'Upload Your Proof of Owner',
      },
      {
        schema: COMPANY_FILES_SCHEMAS.proofOfUboRepresentativesImg,
        img: residenceProofImg,
        title: 'Upload Your Proof of UBO representatives',
      }, */
    ],
  },
  proofOfOwner: {
    value: 'PROOF_OF_OWNER',
    label: 'Proof of Owner',
    require: [
      {
        schema: COMPANY_FILES_SCHEMAS.proofOfOwnerImg,
        img: residenceProofImg,
        title: 'Upload Your Proof of Owner',
      },
    ],
  },
  proofOfUboRepresentatives: {
    value: 'PROOF_OF_UBO_REPRESENTATIVES',
    label: 'Proof of UBO representatives',
    require: [
      {
        schema: COMPANY_FILES_SCHEMAS.proofOfUboRepresentativesImg,
        img: residenceProofImg,
        title: 'Upload Your Proof of UBO representatives',
      },
    ],
  },
}

export const SOURCE_OF_FUNDS_SCHEMAS = {
  savings: {
    label: 'Savings',
    isRequired: true,
    default: '',
  },
  sale_of_investments: {
    label: 'Sale of investments',
    isRequired: true,
    default: '',
  },
  sale_of_property: {
    label: 'Sale of property',
    isRequired: true,
    default: '',
  },
  loan: {
    label: 'Loan',
    isRequired: true,
    default: '',
  },
  inheritance: {
    label: 'Inheritance',
    isRequired: true,
    default: '',
  },
  maturity_or_surrender_of_life_assurance_policy: {
    label: 'Maturity or surrender of life assurance policy',
    isRequired: true,
    default: '',
  },
  insurance_claims: {
    label: 'Insurance Claims',
    isRequired: true,
    default: '',
  },
  dividends_or_profits_from_company: {
    label: 'Dividends or Profits from company',
    isRequired: true,
    default: '',
  },
  divorce: {
    label: 'Divorce',
    isRequired: true,
    default: '',
  },
  other_court_award: {
    label: 'Other court award (e.g. compensation)',
    isRequired: true,
    default: '',
  },
  lottery: {
    label: 'Lottery',
    isRequired: true,
    default: '',
  },
  gambling_win: {
    label: 'Gambling win',
    isRequired: true,
    default: '',
  },
  gift: {
    label: 'Gift',
    isRequired: true,
    default: '',
  },
  other: {
    label: 'Other',
    isRequired: true,
    default: '',
  },
}
