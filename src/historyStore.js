import { createBrowserHistory } from 'history'
import ReactGA from 'react-ga'
import ReactPixel from 'react-facebook-pixel'
import { PUBLIC_SETTINGS } from './queriesAndMutations'
import apolloClient from './apolloClient'


const historyInstance = createBrowserHistory()

if (process.env.NODE_ENV === 'production') {
  apolloClient.query({ query: PUBLIC_SETTINGS })
    .then(({ data: { publicSettings: { google_analytics_id, pixel_id } } }) => {
      if (google_analytics_id) {
        ReactGA.initialize(google_analytics_id)
        ReactGA.pageview(window.location.pathname + window.location.search)
        historyInstance.listen((location) => ReactGA.pageview(location.pathname + location.search))
      }

      if (pixel_id) {
        ReactPixel.init(pixel_id, {}, {
          autoConfig: true, 	// set pixel's autoConfig
          debug: false, 		// enable logs
        })
      }
    })
}

export default historyInstance
