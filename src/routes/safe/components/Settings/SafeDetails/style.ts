import { createStyles } from '@material-ui/core/styles'
import { boldFont, border, lg, sm } from 'src/theme/variables'

export const styles = createStyles({
  formContainer: {
    padding: lg,
  },
  root: {
    display: 'flex',
    maxWidth: '460px',
  },
  saveBtn: {
    fontWeight: boldFont,
    marginRight: sm,
  },
  controlsRow: {
    bottom: 0,
    boxSizing: 'border-box',
    padding: lg,
    position: 'absolute',
    width: '100%',
  },
})
