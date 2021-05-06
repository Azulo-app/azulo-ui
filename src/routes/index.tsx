import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'

import { IMPORT_ADDRESS, CREATE_ADDRESS, TRUSTS_ADDRESS, SAFE_PARAM_ADDRESS, HOME_ADDRESS, TERMS_ADDRESS, COOKIES_ADDRESS, PRIVACY_ADDRESS } from './routes'

import { Loader } from '@gnosis.pm/safe-react-components'
import { defaultSafeSelector } from 'src/logic/safe/store/selectors'
import { useAnalytics } from 'src/utils/googleAnalytics'
import { DEFAULT_SAFE_INITIAL_STATE } from 'src/logic/safe/store/reducer/safe'
import { LoadingContainer } from 'src/components/LoaderContainer'

const Home = React.lazy(() => import('./home/container'))

// const Start = React.lazy(() => import('./start/container'))

const Create = React.lazy(() => import('./create/container'))

const Trusts = React.lazy(() => import('./safe/container'))

const Import = React.lazy(() => import('./import/container'))

const SAFE_ADDRESS = `${TRUSTS_ADDRESS}/:${SAFE_PARAM_ADDRESS}`

const Terms = React.lazy(() => import('./legal/Terms'))

const Cookies = React.lazy(() => import('./legal/Cookies'))

const Privacy = React.lazy(() => import('./legal/Privacy'))

const Routes = (): React.ReactElement => {
  const [isInitialLoad, setInitialLoad] = useState(true)
  const location = useLocation()
  const matchSafeWithAction = useRouteMatch<{ safeAddress: string; safeAction: string }>({
    path: `${TRUSTS_ADDRESS}/:safeAddress/:safeAction`,
  })

  const defaultSafe = useSelector(defaultSafeSelector)
  const { trackPage } = useAnalytics()

  useEffect(() => {
    if (isInitialLoad && location.pathname !== '/') {
      setInitialLoad(false)
    }
  }, [location.pathname, isInitialLoad])

  useEffect(() => {
    if (matchSafeWithAction) {
      // prevent logging safeAddress
      let safePage = `${TRUSTS_ADDRESS}/SAFE_ADDRESS`
      if (matchSafeWithAction.params?.safeAction) {
        safePage += `/${matchSafeWithAction.params?.safeAction}`
      }
      trackPage(safePage)
    } else {
      const page = `${location.pathname}${location.search}`
      trackPage(page)
    }
  }, [location, matchSafeWithAction, trackPage])

  return (
    <Switch>
      {/* <Route
        exact
        path="/"
        render={() => {
          if (!isInitialLoad) {
            return <Redirect to={HOME_ADDRESS} />
          }

          if (defaultSafe === DEFAULT_SAFE_INITIAL_STATE) {
            return (
              <LoadingContainer>
                <Loader size="md" />
              </LoadingContainer>
            )
          }

          if (defaultSafe) {
            return <Redirect to={`${TRUSTS_ADDRESS}/${defaultSafe}/assets`} />
          }

          return <Redirect to={HOME_ADDRESS} />
        }}
      /> */}
      <Route component={Home} exact path={HOME_ADDRESS} />
      {/* <Route component={Start} exact path={START_ADDRESS} /> */}
      <Route component={Create} exact path={CREATE_ADDRESS} />
      <Route component={Trusts} path={SAFE_ADDRESS} />
      <Route component={Import} exact path={IMPORT_ADDRESS} />
      <Route component={Terms} exact path={TERMS_ADDRESS} />
      <Route component={Cookies} exact path={COOKIES_ADDRESS} />
      <Route component={Privacy} exact path={PRIVACY_ADDRESS} />
      <Redirect to="/" />
    </Switch>
  )
}

export default Routes
