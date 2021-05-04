import { disabled, extraSmallFontSize, lg, md, screenSm, sm, xs } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  root: {
    display: 'flex',
  },
  title: {
    padding: `${md} ${lg}`,
  },
  link: {
    paddingLeft: `${xs}`,
    '& svg': {
      position: 'relative',
      top: '1px',
      left: `${xs}`,
      height: '14px',
      width: '14px',
    },
  },
  nameField: {
    marginTop: '30px'
  },
  confDesc: {
    fontSize: '16px'
  },
  cardTitle: {
    margin: 0,
    textAlign: 'right'
  },
  infoIcon: {
    marginLeft: '5px',
    marginBottom: '-6px'
  },
  cardInput: {
    margin: '0',
    '& .MuiInput-underline::before': {
      display: 'none !important'
    }
  },
  owner: {
    flexDirection: 'column',
    marginTop: '12px',
    padding: `0`,
    '&:first-child': {
      marginTop: 0,
    },

    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  ownerName: {
    marginBottom: '5px',
    minWidth: '100%',
    flexBasis: '27%',
    maxWidth: '30%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0',
      minWidth: '0',
    },
  },
  ownerAddress: {
    marginBottom: '15px',
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0',
      minWidth: '0',
    },
  },
  header: {
    padding: `${sm} ${lg}`,
    fontSize: extraSmallFontSize,
    color: disabled,
  },
  name: {
    marginRight: `${sm}`,
  },
  trash: {
    top: '5px',
  },
  add: {
    justifyContent: 'center',
  },
  check: {
    color: '#03AE60',
    height: '20px',
  },
  qrcode: {
    height: '56px',
    maxWidth: '40px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  remove: {
    height: '56px',
    marginLeft: '5px',
    maxWidth: '25px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  owners: {
    paddingLeft: md,
  },
  ownersAmount: {
    flexDirection: 'column',
    [`@media (min-width: ${screenSm}px)`]: {
      flexDirection: 'row',
    },
  },
  ownersAmountItem: {
    minWidth: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '0',
    },
  },
})
