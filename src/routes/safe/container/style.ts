import { mainColor, border } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  trustMenu: {
    position: 'relative',
    marginTop: '35px',
    marginBottom: '50px',
    paddingBottom: '12px',
    '& a': {
        fontSize: '1.2em',
        color: '#000',
        fontWeight: 500,
        marginRight: '30px',
        position: 'relative',
        cursor: 'pointer',
        paddingTop: '12px',
        paddingBottom: '12px',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'none',
            color: mainColor
        },
        '&:last-of-type': {
            marginRight: 0
        },
        '&$trustMenuActive': {
          color: mainColor,
          fontWeight: 'bold',
          textDecoration: 'none',
          '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '0',
              left: 0,
              height: '2px',
              width: '100%',
              background: mainColor,
              zIndex: 2
          }
        },
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '1px',
        width: '100%',
        background: border
    },
  },
  trustMenuActive: {
  },
})
