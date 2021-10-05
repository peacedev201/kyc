import { useQuery } from '@apollo/react-hooks'
import { PUBLIC_SETTINGS, SETTINGS } from '../queriesAndMutations'

// eslint-disable-next-line import/prefer-default-export
export const usePublicSettings = (options = {}) => useQuery(PUBLIC_SETTINGS, options)
export const useSettings = (options = {}) => useQuery(SETTINGS, options)
