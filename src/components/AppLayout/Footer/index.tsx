import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'
import { useDispatch } from 'react-redux'

import AzuButtonLink from 'src/components/layout/ButtonLink'
import Grid from '@material-ui/core/Grid';
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'
import { openCookieBanner } from 'src/logic/cookies/store/actions/openCookieBanner'
import { screenSm, secondary, sm } from 'src/theme/variables'
import AzuloIcon from './assets/azulo_icon.svg'

const useStyles = makeStyles({
  footer: {
    marginTop: 'auto',
    boxSizing: 'border-box',
    paddingBottom: '30px',
    [`@media (min-width: ${screenSm}px)`]: {
      paddingBottom: '30px',
    },
  },
  holder: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingTop: '15px',
    position: 'relative',
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '1px',
      background: '#eeeeee'
    }
  },
  links: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignContent: 'stretch',
    alignItems: 'center'
  },
  link: {
    margin: '10px 15px',
    lineHeight: 1,
    fontSize: '0.9em',
    color: '#000',
    '&:hover': {
      color: '#7131ff'
    },
  },
  logo: {
    marginRight: '20px',
    '& a > div': {
      maxWidth: '28px',
      width: '28px'
    },
  },
  copy: {
    lineHeight: 2.6,
    fontSize: '0.9em'
  }
} as any)

const appVersion = process.env.REACT_APP_APP_VERSION ? `v${process.env.REACT_APP_APP_VERSION} ` : 'Versions'

const Footer = (): React.ReactElement => {
  const date = new Date()
  const classes = useStyles()
  const dispatch = useDispatch()

  const openCookiesHandler = () => {
    dispatch(openCookieBanner({ cookieBannerOpen: true }))
  }

  return (
    <footer className={classes.footer}>
      <div className={classes.holder}>
        <Grid container>
          <Grid item>
            <div className={classes.logo}>
              <Link to="/">
                <Img alt="Azulo Trusts" height={30} src={AzuloIcon} testId="footer-azulo-icon" />
              </Link>
            </div>
          </Grid>
          <Grid item className={classes.links}>
            <nav>
              <Link variant="button" color="textPrimary" to="/terms" className={classes.link} rel="noopener noreferrer" target="_blank">
                Terms
              </Link>
              <Link variant="button" color="textPrimary" to="/privacy" className={classes.link} rel="noopener noreferrer" target="_blank">
                Privacy
              </Link>
              <Link variant="button" color="textPrimary" to="/cookies" className={classes.link} rel="noopener noreferrer" target="_blank">
                Cookies
              </Link>
              <Link variant="button" color="textPrimary" to="#" className={classes.link} onClick={openCookiesHandler}>
                Preferences
              </Link>
            </nav>
          </Grid>
          <Grid item>
            <span className={classes.copy}>
              {'Copyright © '}
              <Link to="/">
                  Azulo
              </Link>{' '}
              {new Date().getFullYear()}
              {'.'}
            </span>
          </Grid>
          {/* <Grid item>
            <ThemeSwitch />
          </Grid> */}
        </Grid>
      </div>
      {/* <span className={classes.item}>©{date.getFullYear()} Azulo</span>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target="_blank" to="/terms">
        Terms
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target="_blank" to="/privacy">
        Privacy
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target="_blank" to="https://gnosis-safe.io/licenses">
        Licenses
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target="_blank" to="/cookies">
        Cookie Policy
      </Link>
      <span className={classes.sep}>-</span>
      <Link className={cn(classes.item, classes.link, classes.buttonLink)} to="#" onClick={openCookiesHandler}>
        Preferences
      </Link>
      <span className={classes.sep}>|</span>
      <Link
        className={cn(classes.item, classes.link)}
        target="_blank"
        to="https://github.com/gnosis/safe-react/releases"
      >
        {appVersion}
      </Link> */}
    </footer>
  )
}

export default Footer
