import gql from 'graphql-tag';

export const CONTRIBUTE = gql`
    mutation contribute($input: ContributeInput!) {
      contribute(input: $input) {
        id
        payment_ref
        to
        type
        token_amount
        currency_amount
        currency
        usd_amount
        status
        payment_type
        details
        tx_hash
        deposit_from
        deposit_to
        approved_note
        is_contribution_gto
        mandatory_kyc
      }
    }
  `;

export const SEND_GTO_PAYMENT = gql`
    mutation sendGtoPayment($input: PaymentNotificationInput!) {
      sendGtoPayment(input: $input) {
        data
      }
    }
  `;