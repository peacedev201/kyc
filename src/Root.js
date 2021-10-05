import routes from './routes'
import { usePublicSettings } from './myHooks/useSettings'
import { setTitle } from './utils'

const Root = () => {
  const { data: { publicSettings: { company = {} } = {} } = {} } = usePublicSettings()

  if ((company || {}).name) {
    setTitle((company || {}).name)
  }
  return routes()
}

export default Root
