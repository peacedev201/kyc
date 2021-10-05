// eslint-disable-next-line import/prefer-default-export
export const mapSchema = (memo, value, key) => {
  // eslint-disable-next-line no-param-reassign
  memo[key] = value.default || ''
  return memo
}
