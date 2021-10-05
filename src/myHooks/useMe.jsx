import { useQuery } from '@apollo/react-hooks'
import { ME } from '../queriesAndMutations'

// eslint-disable-next-line import/prefer-default-export
export const useMe = () => useQuery(ME)
