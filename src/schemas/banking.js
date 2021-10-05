export const MAIN_INFO_SCHEMA = {
  bankName: {
    label: 'Bank name',
    isRequired: true,
    type: 'text',
    default: null,
  },
  iban: {
    label: 'Your IBAN/Account Number',
    isRequired: true,
    default: null,
    type: 'text',
  },
  bankAddress: {
    label: 'Bank Address',
    isRequired: true,
    default: null,
    type: 'text',
  },
  sendingWithTransferwise: {
    label: 'Are you sending with Transferwise?',
    isRequired: false,
    default: null,
    type: 'checkbox',
    subItem: {
      bankNameTransferwise: {
        label: 'Bank Name Transferwise',
        isRequired: false,
        default: null,
        type: 'text',
      },
      bankAddressTransferwise: {
        label: 'Bank Address Transferwise',
        isRequired: false,
        default: null,
        type: 'text',
      },
      memberShipNumberTransferwise: {
        label: 'Transferwise Membership number',
        isRequired: false,
        default: null,
        type: 'text',
      },
    },
  },
}
