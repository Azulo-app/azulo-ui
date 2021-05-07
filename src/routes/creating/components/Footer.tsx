import React, { ReactElement, SyntheticEvent } from 'react'
import styled from 'styled-components'

import { Icon, Link, Text } from '@gnosis.pm/safe-react-components'

import Button from 'src/components/layout/Button'
import { getExplorerInfo } from 'src/config'
import { mainStyles } from 'src/theme/PageStyles'
import { mainColor, borderRadius, mainLightColor, warning, warningLight } from 'src/theme/variables'
import Grid from '@material-ui/core/Grid'

const StyledText = styled(Text)`
  display: inline-flex;
  a {
    margin-left: 4px;
  }
  svg {
    position: relative;
    top: 4px;
    left: 4px;
  }
`
const NextText = styled(Text)`
  font-weight: 700;
  font-size: '16px';
  color: ${mainColor};
  margin-right: 20px;
`
const ButtonWithMargin = styled(Button)`
  margin-right: 16px;
`
const FooterContainer = styled.div`
  width: 100%;
  background: ${mainLightColor};
  border: 1px solid ${mainColor};
  padding: 25px 45px;
  max-width: 600px;
  border-radius: ${borderRadius};
  margin-top: 15px;
  box-sizing: border-box;
`
const InfoContainer = styled.div`
  width: 100%;
  background: ${warningLight};
  border: 1px solid ${warning};
  padding: 25px 45px;
  max-width: 600px;
  border-radius: ${borderRadius};
  margin-top: 15px;
  box-sizing: border-box;
  text-align: center;
  color: ${warning} !important;
  p {
    color: ${warning} !important;
  }
  a {
    color: ${warning} !important;
    span {
      color: ${warning} !important;
    }
    svg .icon-color {
      fill: ${warning} !important;
    }
  }
`

export const GenericFooter = ({ safeCreationTxHash }: { safeCreationTxHash: string }): ReactElement => {
  const mainClasses = mainStyles()
  const explorerInfo = getExplorerInfo(safeCreationTxHash)
  const { url, alt } = explorerInfo()
  const match = /(http|https):\/\/(\w+\.\w+)\/.*/i.exec(url)
  const explorerDomain = match !== null ? match[2] : 'Network Explorer'

  return (
    <InfoContainer>
      <StyledText size="xl">This process could take a couple of minutes.</StyledText>
      <StyledText size="xl">
        Follow the progress on{' '}
        <Link
          href={url}
          aria-label={alt}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="safe-create-explorer-link"
          title="More info about this in Etherscan"
        >
          <Text size="xl" as="span" color="primary">
            {explorerDomain}
          </Text>
          <Icon size="sm" type="externalLink" color="primary" />
        </Link>
      </StyledText>
    </InfoContainer>
  )
}

export const ContinueFooter = ({
  continueButtonDisabled,
  onContinue,
}: {
  continueButtonDisabled: boolean
  onContinue: (event: SyntheticEvent) => void
}): ReactElement => {
  const mainClasses = mainStyles()

  return (
    <FooterContainer>
      <Grid container direction="row" justify="center" alignItems="center">
        <NextText size="xl">Next steps</NextText>
        <Button
          color="primary"
          disabled={continueButtonDisabled}
          onClick={onContinue}
          variant="contained"
          data-testid="continue-btn"
          className={mainClasses.mainButton}
        >
          Access trust
        </Button>
      </Grid>
    </FooterContainer>
  )
}

export const ErrorFooter = ({
  onCancel,
  onRetry,
}: {
  onCancel: (event: SyntheticEvent) => void
  onRetry: (event: SyntheticEvent) => void
}): ReactElement => {
  const mainClasses = mainStyles()

  return (
    <>
      <FooterContainer>
        <Grid container direction="row" justify="center" alignItems="center">
          <ButtonWithMargin className={`${mainClasses.mainButton} ${mainClasses.greyButton}`} onClick={onCancel} variant="contained">
            Cancel trust
          </ButtonWithMargin>
          <Button color="primary" className={mainClasses.mainButton} onClick={onRetry} variant="contained">
            Retry creation
          </Button>
        </Grid>
      </FooterContainer>
    </>
  )
}
