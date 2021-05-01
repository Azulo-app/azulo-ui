import React from 'react'
import styled from 'styled-components'
import {
  Card,
  Button,
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
import { useSelector } from 'react-redux'
import { providerNameSelector } from 'src/logic/wallets/store/selectors'
import { borderRadius } from 'src/theme/variables'
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { mainStyles } from 'src/theme/PageStyles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 24px 0 0 0;
`
const StyledCardDouble = styled(Card)`
  display: flex;
  padding: 0;
`
const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 20px 0 0;
  max-width: 27%;
  height: 276px;
`
const CardsCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  width: 50%;
`
const StyledButton = styled(Button)`
  margin-top: auto;
  text-decoration: none;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0 16px 0;

  h5 {
    color: white;
  }
`
const StyledTitle = styled(Title)`
  margin: 0 0 0 16px;
`
const StyledTitleOnly = styled(Title)`
  margin: 0 0 16px 0;
`
const StyledButtonLink = styled(ButtonLink)`
  margin: 16px 0 16px -8px;
`

type Props = {
  isOldMultisigMigration?: boolean
}

const Accordion = withStyles({
  root: {
    border: '1px solid #DEDEDE',
    borderRadius: borderRadius,
    boxShadow: 'none',
    '&:not(:last-child)': {
      marginBottom: '15px',
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'transparent',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

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

export const CreateLayout = ({ isOldMultisigMigration }: Props): React.ReactElement => {
  const mainClasses = mainStyles();
  const classes = useStyles();
  const provider = useSelector(providerNameSelector)
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  return (
    <Block>
      <Grid container alignItems="center">
        <Grid item className={mainClasses.pageTitleHold}><div className={mainClasses.pageTitle}>Create a trust</div></Grid>
        <Grid item><div className={mainClasses.pageDesc}>Create a new trust for your family, friends, business, charity or organisation.</div></Grid>
      </Grid>

      <>
        <Wrapper>
          
          <div>
            <Accordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                <div className={classes.heading}>Step 1: Connect wallet</div>
                <div className={classes.heading}>
                  <StyledButton
                    size="lg"
                    color="primary"
                    variant="contained"
                    onClick={onConnectButtonClick}
                    disabled={!!provider}
                    data-testid="connect-btn"
                  >
                    <Text size="xl" color="white">
                      Connect wallet
                    </Text>
                  </StyledButton>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  Why do you need to connect your wallet?
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <div>Collapsible Group Item #2</div>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                <div>Collapsible Group Item #3</div>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </Wrapper>
        <Wrapper>
          {/* Connect wallet */}
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
            <StyledButton
              size="lg"
              color="primary"
              variant="contained"
              onClick={onConnectButtonClick}
              disabled={!!provider}
              data-testid="connect-btn"
            >
              <Text size="xl" color="white">
                Connect wallet
              </Text>
            </StyledButton>
          </StyledCard>

          <StyledCardDouble disabled={!provider}>
            {/* Create safe */}
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
              <StyledButton size="lg" color="primary" variant="contained" component={Link} to={CREATE_ADDRESS}>
                <Text size="xl" color="white">
                  + Create new Safe
                </Text>
              </StyledButton>
            </CardsCol>

            <Divider orientation="vertical" />

            {/* Load safe */}
            <CardsCol>
              <StyledTitleOnly size="sm" strong withoutMargin>
                Add existing Safe
              </StyledTitleOnly>
              <Text size="xl">
                Already have a Safe? Do you want to access your Safe from a different device? Easily add it using your
                Safe address.
              </Text>
              <StyledButton
                variant="bordered"
                iconType="safe"
                iconSize="sm"
                size="lg"
                color="secondary"
                component={Link}
                to={IMPORT_ADDRESS}
              >
                <Text size="xl" color="secondary">
                  Add existing Safe
                </Text>
              </StyledButton>
            </CardsCol>
          </StyledCardDouble>
        </Wrapper>
      </>
    </Block>
  )
}
