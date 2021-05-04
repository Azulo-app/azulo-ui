import React from 'react'
import styled from 'styled-components'
import {
  Card,
  Title,
  Text,
  Divider,
  ButtonLink,
  Dot,
  Icon,
  Link as LinkSRC,
} from '@gnosis.pm/safe-react-components'

import Link from 'src/components/layout/Link'
import Block from 'src/components/layout/Block'
import { IMPORT_ADDRESS, CREATE_ADDRESS } from 'src/routes/routes'
import { onConnectButtonClick } from 'src/components/ConnectButton'
import { useSelector, useDispatch } from 'react-redux'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { removeProvider } from 'src/logic/wallets/store/actions'
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { mainStyles } from 'src/theme/PageStyles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import { RowingOutlined } from '@material-ui/icons'
import { Redirect } from 'react-router'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0 0 0;
`

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

type Props = {
  isOldMultisigMigration?: boolean
}

export const CreateLayout = ({ isOldMultisigMigration }: Props): React.ReactElement => {
  const mainClasses = mainStyles();
  const classes = useStyles();
  const provider = useSelector(providerNameSelector)
  const dispatch = useDispatch()

  const onDisconnect = () => {
    dispatch(removeProvider())
  }

  if (provider) {
    return <Redirect to={'/create'}/>
  } else {
    return (
      <Block>
        <Grid container alignItems="center">
          <Grid item className={mainClasses.pageTitleHold}><div className={mainClasses.pageTitle}>Create a trust</div></Grid>
          <Grid item><div className={mainClasses.pageDesc}>Create a new trust for your family, friends, business, charity or organisation.</div></Grid>
        </Grid>

        <>
          <Wrapper>
            <Grid container>
              <Grid item sm={12} className={`${mainClasses.createStepOut} ${!provider ? mainClasses.createStepOutActive : ''}`}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid item className={mainClasses.createStepTitle}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item className={mainClasses.createStepNum}><span>1</span></Grid>
                      <Grid item>Step 1: Connect</Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    {
                      provider ?
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${mainClasses.mainButton} ${mainClasses.borderButton} ${mainClasses.greyButton}`}
                          fullWidth
                          onClick={onDisconnect}
                          data-testid="disconnect-btn"
                        >
                          Disconnect
                        </Button>
                      :
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={onConnectButtonClick}
                          className={mainClasses.mainButton}
                          data-testid="connect-btn"
                        >
                          Connect
                        </Button>
                    }
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item className={mainClasses.createStepBody}>
                <div>
                  Why do you need to connect your wallet?
                </div>
              </Grid> */}
              <Grid item sm={12} className={`${mainClasses.createStepOut} ${provider ? mainClasses.createStepOutActive : ''}`}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid item className={mainClasses.createStepTitle}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item className={mainClasses.createStepNum}><span>2</span></Grid>
                      <Grid item>Step 2: Trust details</Grid>
                    </Grid>
                  </Grid>
                  {
                    provider ?
                      <Grid item>
                        <Button
                          color="primary"
                          variant="contained"
                          component={Link} to={CREATE_ADDRESS}
                          className={mainClasses.mainButton}
                          data-testid="create-btn"
                        >
                          Create new trust
                        </Button>
                      </Grid>
                    :
                    <Grid item></Grid>
                  }
                </Grid>
              </Grid>
              <Grid item sm={12} className={mainClasses.createStepOut}>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item className={mainClasses.createStepTitle}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item className={mainClasses.createStepNum}><span>3</span></Grid>
                      <Grid item>Step 3: Review</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={12} className={mainClasses.createStepOut}>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item className={mainClasses.createStepTitle}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item className={mainClasses.createStepNum}><span>4</span></Grid>
                      <Grid item>Step 4: Create trust</Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Wrapper>
          {/* <Wrapper>
            <StyledCard>
              <TitleWrapper>
                <Dot color="primary">
                  {!provider ? <Title size="xs">1</Title> : <Icon color="white" type="check" size="md" />}
                </Dot>
                <StyledTitle size="sm" strong withoutMargin>
                  Connect wallet
                </StyledTitle>
              </TitleWrapper>
              <Text size="xl">
                Gnosis Safe supports a wide range of wallets that you can choose to interact with your Safe.
              </Text>
              <StyledButtonLink textSize="xl" color="primary" iconType="externalLink" iconSize="sm">
                <LinkSRC
                  size="xl"
                  href="https://help.gnosis-safe.io/en/articles/4689442-why-do-i-need-to-connect-a-wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="More info about: Why do I need to connect a wallet?"
                >
                  Why do I need to connect a wallet?
                </LinkSRC>
              </StyledButtonLink>
            </StyledCard>

            <StyledCardDouble disabled={!provider}>
              <CardsCol>
                <TitleWrapper>
                  <Dot color="primary">
                    <Title size="xs">2</Title>
                  </Dot>
                  <StyledTitle size="sm" strong withoutMargin>
                    Create Safe
                  </StyledTitle>
                </TitleWrapper>
                <Text size="xl">
                  Create a new Safe that is controlled by one or multiple owners. <br />
                  You will be required to pay a network fee for creating your new Safe.
                </Text>
                <Button color="primary" variant="contained" component={Link} to={CREATE_ADDRESS}>
                  <Text size="xl" color="white">
                    + Create new Safe
                  </Text>
                </Button>
              </CardsCol>

              <Divider orientation="vertical" />

              <CardsCol>
                <StyledTitleOnly size="sm" strong withoutMargin>
                  Add existing Safe
                </StyledTitleOnly>
                <Text size="xl">
                  Already have a Safe? Do you want to access your Safe from a different device? Easily add it using your
                  Safe address.
                </Text>
              </CardsCol>
            </StyledCardDouble>
          </Wrapper> */}
        </>
      </Block>
    )
  }
}
