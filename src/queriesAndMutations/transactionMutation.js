import gql from 'graphql-tag'


export const CHANGE_TRANSACTION_STATUS = gql`
  mutation changeTransactionStatus($id: ID, $status: String) {
    changeTransactionStatus(id: $id, status: $status)
  }
`;

export const CANCEL_TRANSACTION_USER = gql`
  mutation cancelTransactionUser($id: ID) {
    cancelTransactionUser(id: $id)
  }
`;

export const UPDATE_VOLT_TRANSACTION_ID = gql`
  mutation updateVoltTransactionId($id: ID, $voltTransactionId: String) {
    updateVoltTransactionId(id: $id, voltTransactionId: $voltTransactionId)
  }
`;