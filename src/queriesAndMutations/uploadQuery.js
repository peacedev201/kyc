import gql from 'graphql-tag'


export const PUBLIC_UPLOADS = gql`
  query publicUploads {
    publicUploads {
      id
      storage_key
      preview_storage_key
      mime_type
      original_name
      is_public
    }
  }
  
  `;