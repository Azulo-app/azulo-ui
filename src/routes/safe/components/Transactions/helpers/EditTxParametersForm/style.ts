import { lg, md, secondaryText, sm, mainFontFamily } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    height: '75px',
  },
  annotation: {
    letterSpacing: '-1px',
    color: secondaryText,
    marginRight: 'auto',
    marginLeft: '20px',
  },
  headingText: {
    fontSize: lg,
  },
  closeIcon: {
    height: '35px',
    width: '35px',
  },
  container: {
    padding: `${md} ${lg}`,
  },
  amount: {
    marginLeft: sm,
  },
  address: {
    marginRight: sm,
  },
  buttonRow: {
    height: '52px',
    justifyContent: 'center',
    alignItems: 'center',
    '& > button': {
      fontFamily: mainFontFamily,
      fontSize: md,
    },
  },
  submitButton: {
    marginLeft: '15px',
  },
})
