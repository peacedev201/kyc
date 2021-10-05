import { USER_RIGHTS_WEIGHT } from '../constants/user'
// eslint-disable-next-line import/prefer-default-export
export const logout = (update) => () => {
  localStorage.removeItem('jwt')
  return (update && update()) || (window && window.location.reload())
}

export const hasUserEnoughRights = (userRights, requiredRights) => USER_RIGHTS_WEIGHT[userRights] >= USER_RIGHTS_WEIGHT[requiredRights]

export const splitFullName = (fullName) => ({ firstName: fullName.split(' ')[0], lastName: (fullName.split(' ')[1] || '') })

export const mandatoryKyc = (is_gto_sales, mandatory) => (mandatory || {})[is_gto_sales ? 'mandatoryKYCReferral' : 'mandatoryKYCOrganic']
