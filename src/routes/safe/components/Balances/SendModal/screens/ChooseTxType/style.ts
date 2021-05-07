import { createStyles, makeStyles } from '@material-ui/core/styles'
import { lg, md, sm, mainFontFamily } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      maxHeight: '75px',
    },
    manage: {
      fontSize: lg,
    },
    disclaimer: {
      marginBottom: `-${md}`,
      paddingTop: md,
      textAlign: 'center',
    },
    disclaimerText: {
      fontSize: md,
      marginBottom: `${md}`,
    },
    closeIcon: {
      height: '35px',
      width: '35px',
    },
    buttonColumn: {
      margin: '16px 0 44px 0',
      '& > button': {
        fontSize: md,
        fontFamily: mainFontFamily,
      },
    },
    firstButton: {
      marginBottom: 15,
    },
    iconSmall: {
      fontSize: 16,
    },
    leftIcon: {
      marginRight: sm,
    },
  }),
)
