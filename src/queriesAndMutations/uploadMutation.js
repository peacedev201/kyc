import gql from 'graphql-tag'


export const PUBLIC_UPLOAD = gql`
    mutation publicUpload($upload: Upload!) {
      publicUpload(upload: $upload)
    }
  `;

export const REMOVE_PUBLIC_UPLOAD = gql`
    mutation removePublicUpload($upload_id: Int!) {
      removePublicUpload(upload_id: $upload_id)
    }
  `;
