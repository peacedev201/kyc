import gql from 'graphql-tag';

export const COMMENTS = gql`
  query comments($id: ID, $type: String) {
    comments(id: $id, type: $type) {
      objects {
        id
        comment
        is_external
        user {
          id
          email
          first_name
          is_active
          last_name
          lastLogin
          status
          rights
        }
      }
    }
  }
`;
