import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import QRCode from 'qrcode.react'
import React, { ReactElement } from 'react'

import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { border, fontColor, lg, md, screenSm, secondaryText, mainFontFamily } from 'src/theme/variables'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { mainStyles } from 'src/theme/PageStyles'

const networkInfo = getNetworkInfo()
const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'space-between',
      maxHeight: '75px',
      boxSizing: 'border-box',
    },
    close: {
      height: lg,
      width: lg,
      fill: secondaryText,
    },
    qrContainer: {
      backgroundColor: '#fff',
      padding: md,
      borderRadius: '6px',
      border: `1px solid ${secondaryText}`,
    },
    networkInfo: {
      backgroundColor: `${networkInfo?.backgroundColor ?? border}`,
      color: `${networkInfo?.textColor ?? fontColor}`,
      padding: md,
      marginBottom: 0,
    },
    annotation: {
      margin: lg,
      marginBottom: 0,
    },
    safeName: {
      margin: `${md} 0`,
    },
    buttonRow: {
      height: '84px',
      justifyContent: 'center',
      '& > button': {
        fontFamily: `${mainFontFamily}`,
        fontSize: md,
      },
    },
    addressContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      margin: `${lg} 0`,

      [`@media (min-width: ${screenSm}px)`]: {
        flexDirection: 'row',
      },
    },
  }),
)

type Props = {
  onClose: () => void
  safeAddress: string
  safeName: string
}

const ReceiveModal = ({ onClose, safeAddress, safeName }: Props): ReactElement => {
  const classes = useStyles()
  const mainClasses = mainStyles()

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl" weight="bolder">
          Receive assets
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Paragraph className={classes.networkInfo} noMargin size="lg" weight="bolder">
        {networkInfo.label} Network only send {networkInfo.label} assets to this Safe.
      </Paragraph>
      <Paragraph className={classes.annotation} noMargin size="lg">
        <strong>This is the address of your Trust</strong>. You can start depositing assets using the QR code or the address below. Only send{' '}
        {networkInfo.nativeCoin.name} and assets to this address (e.g. ETH, ERC20, ERC721)!
      </Paragraph>
      <Col layout="column" middle="xs">
        <Paragraph className={classes.safeName} noMargin size="lg" weight="bold">
          {safeName}
        </Paragraph>
        <Block className={classes.qrContainer}>
          <QRCode size={180} value={safeAddress} />
        </Block>
        <Block className={classes.addressContainer} justify="center">
          <EthHashInfo hash={safeAddress} showAvatar showCopyBtn explorerUrl={getExplorerInfo(safeAddress)} />
        </Block>
      </Col>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button className={mainClasses.mainButton} minWidth={130} onClick={onClose} variant="contained">
          Done
        </Button>
      </Row>
    </>
  )
}

export default ReceiveModal
