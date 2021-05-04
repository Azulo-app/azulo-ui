import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import Block from 'src/components/layout/Block'
import { lg, border, borderRadius } from 'src/theme/variables'

const useStyles = makeStyles({
  root: {
    margin: '40px auto',
    padding: '30px',
    border: `1px solid ${border}`,
    borderRadius: borderRadius,
    maxWidth: '700px',
    boxShadow: 'none !important'
  },
  padding: {
    padding: lg,
  },
})

interface Props {
  padding?: boolean
  controls: React.ReactNode
}

const OpenPaper: React.FC<Props> = ({ children, controls, padding = true }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.root} elevation={1}>
      <Block className={padding ? classes.padding : ''}>{children}</Block>
    </Paper>
  )
}

export default OpenPaper
