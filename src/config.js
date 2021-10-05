const host = process.env.REACT_APP_API_HOST || 'http://localhost:4000'
const endPoint = process.env.REACT_APP_API_ENDPOINT || 'graphql'

module.exports = {
  backend_url: host,
  endpoint: `${host}/${endPoint}`,
  fileEndpoint: host !== 'http://localhost:4000' ? '/file' : `${host}/file`,
}
