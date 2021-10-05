import gql from 'graphql-tag';

export const SAVE_COMMENT = gql`
  mutation saveComment($input: SaveComment!) {
    saveComment(input: $input)
  }
`;