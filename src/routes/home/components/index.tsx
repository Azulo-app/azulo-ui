import React from 'react'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import BGCurve from '../assets/bg_curve_2.svg';
import FamilyTrustImg from '../assets/family_trust.svg';
import ICBooks from '../assets/ic_books.svg';
import { onConnectButtonClick } from 'src/components/ConnectButton'
import { borderRadius } from 'src/theme/variables'

const useStyles = makeStyles(() => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  bg_curve: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: -1,
    width: '60%',
    height: '100%',
    overflow: 'hidden',
    '& > div': {
      height: '100%'
    }
  },
  mainTitle: {
    '& > div': {
      fontWeight: 700,
      fontSize: '1.5em',
      display: 'inline-block'
    }
  },
  mainDesc: {
    fontWeight: 400,
    fontSize: '1.2em',
    lineHeight: 1.6
  },
  mainHighlight: {
    color: '#7131FF',
    background: '#ECE4FF',
    padding: '10px 14px',
    borderRadius: borderRadius,
    marginLeft: '10px',
    lineHeight: 1
  },
  actionHld: {
    marginTop: '40px'
  },
  link: {
    margin: '8px 20px',
    fontSize: '1.1em',
    textTransform: 'none'
  },
  trustlink: {
    margin: '8px 20px',
    color: '#7131ff',
    '& span': {
        fontWeight: 700
    },
  },
  featImg: {
    '& > div': {
      textAlign: 'center'
    },
    '& img': {
      display: 'block',
      margin: '0 auto',
      maxWidth: '420px'
    }
  },
  mainButton: {
    borderRadius: '100px',
    border: '2px solid #7131FF',
    background: '#7131FF',
    color: '#fff',
    padding: '12px 30px',
    fontSize: '1.1em',
    '&:hover': {
      border: '2px solid #000',
      background: '#000',
      color: '#fff',
      '& span': {
        color: '#fff',
      }
    }
  },
  heroContent: {
    maxWidth: '1400px',
    paddingTop: '155px',
  },
  features: {
    marginTop: '80px',
    borderRadius: '36px',
    border: '1px solid #7131FF',
    padding: '32px 32px'
  },
  featIcon: {
    '& > div': {
      textAlign: 'right',
      marginRight: '15px',
      marginTop: '3px;'
    },
    '& svg': {
      width: '20px',
      height: '20px',
    }
  },
  featTitle: {
    fontSize: '1.2em',
    lineHeight: '1.2',
    marginBottom: '5px',
    fontWeight: 600
  },
  featDesc: {
    fontSize: '1em',
    lineHeight: '1.6'
  },
}));

type Props = {
  isOldMultisigMigration?: boolean
}

export const HomeLayout = (): React.ReactElement => {
  const classes = useStyles();

  return (
    <div>
        <div className={classes.bg_curve}>
          <Img alt="" src={BGCurve} testId="background" />
        </div>
        <React.Fragment>
        <CssBaseline />
        {/* Hero unit */}
        <Container maxWidth="xl" component="main" className={classes.heroContent}>
          <Grid container alignItems="center">
            <Grid item sm={12} md={7}>
              <h1 className={classes.mainTitle}>
                <div>Decentralized family</div> <div className={classes.mainHighlight}>trusts.</div>
              </h1>
              <div className={classes.mainDesc}>
                Decentralized digital family trust creation, governance, and asset management system.
                Built for the decentralized digital world to allow families, partnerships, companies to create and manage trusts and its assets from anywhere in the world.
              </div>
              <div className={classes.actionHld}>
                <Link to="/start" color="primary" variant="outlined" className={classes.mainButton}>
                  Get started
                </Link>
                <Button onClick={onConnectButtonClick} className={classes.trustlink}>
                  Access trust
                </Button>
              </div>
              <Grid container alignItems="center" className={classes.features}>

                <Grid item sm={12} md={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.featIcon}><Img alt="Features" height={16} src={ICBooks} testId="feature-icon" /></Grid>
                    <Grid item sm={10}>
                      <div className={classes.featTitle}>Create a trusts</div>
                      <div className={classes.featDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item sm={12} md={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.featIcon}><Img alt="Features" height={16} src={ICBooks} testId="feature-icon" /></Grid>
                    <Grid item sm={10}>
                      <div className={classes.featTitle}>Manage your trusts</div>
                      <div className={classes.featDesc}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
            <Grid item sm={10} md={5} className={classes.featImg}>
              <Img alt="Create trusts" src={FamilyTrustImg} testId="create-trusts" />
            </Grid>
          </Grid>
        </Container>
        {/* End hero unit */}
        <Container maxWidth="md" component="main">
            <Grid container spacing={5} alignItems="flex-end">

            </Grid>
        </Container>
      </React.Fragment>
    </div>
  )
}
