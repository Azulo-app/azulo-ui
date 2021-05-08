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
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import { borderRadius, mainColor } from 'src/theme/variables'
import { mainStyles } from 'src/theme/PageStyles'

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
      width: '30px',
      height: '30px',
      fill: mainColor
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
  const mainClasses = mainStyles();
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
                <Link to="/create" color="primary" variant="outlined" className={mainClasses.mainButton}>
                  Get started
                </Link>
                <Link to="/import" className={classes.trustlink}>
                  Access trust
                </Link>
              </div>
              <Grid container spacing={2} direction="row" justify="center" alignItems="flex-start" className={classes.features}>

                <Grid item sm={12} md={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.featIcon}><BusinessCenterIcon /></Grid>
                    <Grid item sm={10}>
                      <div className={classes.featTitle}>Create & manage trusts</div>
                      <div className={classes.featDesc}>Create and manage digital trusts. Add multiple trustees that have shared authority over the trust's transactions. Add beneficiaries to allow distributions and more. Built using Gnosis Safe.</div>
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item sm={12} md={6}>
                  <Grid container spacing={1}>
                    <Grid item xs={2} className={classes.featIcon}><AccountBalanceWalletIcon /></Grid>
                    <Grid item sm={10}>
                      <div className={classes.featTitle}>Built for digital assets</div>
                      <div className={classes.featDesc}>Trusts support a range of digital assets including Ethereum, Ethereum network tokens, wrapped assets, and pooled assets (i.e. ERC20) and NFT collectables (i.e. ERC721).</div>
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
