import { background, border, lg, md, secondaryText, sm, mainFontFamily } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '75px',
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
  value: {
    marginLeft: sm,
  },
  outerData: {
    borderRadius: '5px',
    border: `1px solid ${border}`,
    padding: '11px',
    minHeight: '21px',
  },
  data: {
    wordBreak: 'break-all',
    overflow: 'auto',
    fontSize: '14px',
    fontFamily: mainFontFamily,
    maxHeight: '100px',
    letterSpacing: 'normal',
    fontStretch: 'normal',
    lineHeight: '1.43',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    '& > button': {
      fontFamily: mainFontFamily,
      fontSize: md,
    },
  },
  submitButton: {
    marginLeft: '15px',
  },
  gasCostsContainer: {
    backgroundColor: background,
    padding: `${sm} ${lg}`,
  },
})
