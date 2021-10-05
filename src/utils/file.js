import config from '../config'
// eslint-disable-next-line import/prefer-default-export
export const getFileUrl = (filename) => `${config.fileEndpoint}/${filename}`


export const getExternalFileUrl = (filename) => `${getFileUrl(filename)}?origin=${window.location.origin}`


export const getOriginalFileExtension = (filename) => {
  const regexp = /.+\.([a-zA-Z]{3,4})$/i
  const result = regexp.exec(filename)
  return (result || [])[1]
}
