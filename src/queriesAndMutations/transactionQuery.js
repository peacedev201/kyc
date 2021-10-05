import gql from 'graphql-tag'


export const TRANSACTION = gql`
  query transaction($id: ID!) {
    transaction(id: $id) {
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
      created_at
      updated_at
      wallet_transaction_id
      volt_transaction_id
      user {
        id
        email
        eth_receiving_wallet
        is_gtoswiss
        is_internal_sales
        kyc_status
      }
    }
  }
`;

export const TRANSACTION_SUM = gql`
  query transactionsSum {
    transactionsSum {
      approved
      pending
    }
  }
`;


export const TRANSACTIONS_ADMIN = gql`
    query transactionsAdmin($input: TransactionListInput) {
      transactionsAdmin(input: $input) {
        meta {
          page
          pageSize
          totalPages
          total
        }
        objects {
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
          created_at
          updated_at
          user {
            id
            email
            is_gtoswiss
            is_internal_sales
            eth_receiving_wallet
            kyc_status
          }
        }
      }
    }
  `;

export const TRANSACTIONS = gql`
    query transactions($input: TransactionListInput) {
      transactions(input: $input) {
        meta {
          page
          pageSize
          totalPages
          total
        }
        objects {
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
          created_at
          updated_at
          user {
            id
            email
            eth_receiving_wallet
            is_gtoswiss
            is_internal_sales
            kyc_status
          }
        }
      }
    }
  `;

export const TRANSACTIONS_USER = gql`
    query transactionsUser($input: TransactionUserListInput) {
      transactionsUser(input: $input) {
        meta {
          page
          pageSize
          totalPages
          total
        }
        objects {
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
          created_at
          updated_at
          volt_transaction_id
          user {
            id
            email
            name
            eth_receiving_wallet
          }
        }
      }
    }
  `;
