import { createStyles, makeStyles } from '@material-ui/core/styles'
import { background, border, lg, screenSm, sm, mainLightColor, borderRadius } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    root: {
      minHeight: '300px',
      [`@media (min-width: ${screenSm}px)`]: {
        flexDirection: 'row',
      },
    },
    detailsColumn: {
      minWidth: '100%',
      [`@media (min-width: ${screenSm}px)`]: {
        minWidth: '0',
      },
    },
    ownersColumn: {
      minWidth: '100%',
      [`@media (min-width: ${screenSm}px)`]: {
        minWidth: '0',
      },
    },
    details: {
      padding: lg,
      borderRight: `solid 1px ${border}`,
      height: '100%',
    },
    info: {
      backgroundColor: background,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: lg,
      textAlign: 'center',
    },
    owners: {
      padding: lg,
    },
    name: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    owner: {
      alignItems: 'center',
      minWidth: 'fit-content',
      padding: '4px 15px',
      borderRadius: borderRadius,
      marginBottom: '5px',
      background: mainLightColor
    },
    user: {
      justifyContent: 'left',
      '& > p': {
        marginRight: sm,
      },
    },
    confDesc: {
      fontSize: '16px'
    },
    open: {
      paddingLeft: sm,
      width: 'auto',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    cardTitle: {
      margin: 0,
      textAlign: 'right'
    },
    nameField: {
      marginTop: '15px'
    },
    focusHighlight: {
      color: '#7131FF',
      fontWeight: 600,
      position: 'relative',
      lineHeight: 1,
      '&:after': {
        content: '""',
        background: '#7131FF',
        position: 'absolute',
        left: 0,
        top: '95%',
        height: '2px',
        width: '100%'
      }
    },
  }),
)
