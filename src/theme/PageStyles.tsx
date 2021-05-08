import { makeStyles } from "@material-ui/core/styles";
import { borderRadius, border, mainColor, greyColor, mainFontFamily, mainLightColor, background } from 'src/theme/variables'

const mainStyles = makeStyles((theme) => ({
    '@global': {
      ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
      },
    },
    pageContent: {
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6),
    },
    pageTitleHold: {
        textAlign: 'center',
        margin: '40px 0 10px'
    },
    accTitleHold: {
        marginRight: '20px',
        borderRight: '1px solid #e0e0e0',
        paddingRight: '20px'
    },
    accTitle: {
        fontSize: '2em',
        lineHeight: '1',
        fontWeight: 700
    },
    accDesc: {
        fontSize: '1em',
        lineHeight: '1',
        paddingTop: '4px'
    },
    innerNav: {
        fontWeight: 600,
        color: '#7131ff'
    },
    pageTitle: {
        fontSize: '2.2em',
        lineHeight: '1',
        fontWeight: 700
    },
    pageDesc: {
        fontSize: '1.2em',
        lineHeight: '1',
        textAlign: 'center',
        paddingTop: '4px'
    },
    mainButton: {
      borderRadius: '100px',
      border: `2px solid ${mainColor}`,
      background: mainColor,
      color: '#fff',
      fontWeight: 600,
      padding: '12px 30px',
      fontSize: '1.1em',
      textTransform: 'none',
      position: 'relative',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease-in-out',
      lineHeight: '1',
      display: 'inline-block',
      textDecoration: 'none',
      boxShadow: 'none',
      '& svg': {
            marginRight: '5px',
            fill: '#fff'
      },
      '& div': {
            fontWeight: 600,
      },
      '&:hover': {
        border: '2px solid #000',
        background: '#000',
        color: '#fff',
        '& span': {
            color: '#fff',
        },
        '& svg': {
            fill: '#fff',
        }
      },
      '&.Mui-disabled': {
            borderColor: 'rgba(0, 0, 0, 0.12)'
      }
    },
    borderButton: {
        background: background,
        border: `2px solid ${mainColor}`,
        color: mainColor,
        '& svg': {
            fill: mainColor
        },
    },
    marginRightButton: {
        marginRight: '20px'
    },
    greyButton: {
        background: background,
        border: `2px solid ${greyColor}`,
        color: greyColor,
        '& svg': {
            fill: greyColor
        },
    },
    noBgButton: {
        background: 'transparent',
        border: 'none',
        color: greyColor,
        '& svg': {
            fill: greyColor
        },
    },
    bodyContent: {
        marginTop: '20px',
        marginBottom: '40px',
        '& h4': {
            marginBottom: '10px',
            fontWeight: 700
        },
        '& p': {
            lineHeight: '1.6'
        },
        '& ul': {
            lineHeight: '1.6',
            marginLeft: '40px',
            listStyle: 'disc',
            '& li': {
                marginBottom: '5px',
                lineHeight: '1.6'
            }
        },
        '& ol': {
            lineHeight: '1.6',
            marginLeft: '40px',
            '& li': {
                marginBottom: '5px',
                lineHeight: '1.6'
            }
        }
    },
    cardHold: {
        margin: 0,
        marginTop: '20px',
        border: '1px solid #dedede',
        borderRadius: borderRadius,
        boxSizing: 'border-box',
        padding: '30px 40px',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        height: 'calc(100% - 20px)'
    },
    cardTitle: {
        fontSize: '1.2em',
        transition: 'all 0.3s ease-in-out',
        fontWeight: 600,
        margin: '10px 0 5px'
    },
    cardColorTitle: {
        color: mainColor,
    },
    cardDesc: {
        lineHeight: '1.6',
        marginBottom: '15px'
    },
    infoBox: {
        margin: '0 0 20px',
        border: '1px solid #7131FF',
        borderRadius: borderRadius,
        boxSizing: 'border-box',
        padding: '20px 20px',
        width: '100%',
        lineHeight: 1.6,
        maxWidth: '100%',
        overflow: 'hidden',
        background: '#f5f2fb'
    },
    contentHighlight: {
        color: mainColor,
        fontWeight: 600
    },
    inputHld: {
        position: 'relative'
    },
    textInput: {
        border: '1px solid #DEDEDE',
        borderRadius: borderRadius
    },
    createStepOut: {
        padding: '10px 3%',
        border: `1px solid ${border}`,
        borderRadius: borderRadius,
        marginBottom: '15px'
    },
    createStepTitle: {
        fontSize: '16px',
        fontWeight: 700,
        color: border,
        marginRight: '20px'
    },
    createStepNum: {
        position: 'relative',
        width: '36px',
        height: '36px',
        background: border,
        borderRadius: '100%',
        marginRight: '20px',
        '& > span': {
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            lineHeight: 1,
            color: '#fff',
            fontWeight: 700,
            fontSize: '17px'
        }
    },
    createStepOutActive: {
        '& $createStepTitle': {
            color: mainColor,
        },
        '& $createStepNum': {
            background: mainColor,
        }
    },
    createStepBody: {
        marginTop: '30px'
    },
    userAddress: {
        padding: '12px 30px',
        background: mainLightColor,
        width: 'auto',
        margin: '20px auto 0',
        borderRadius: '8px',
        '& img': {
            width: '20px',
            height: '20px',
        },
        '& p': {
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: mainFontFamily
        }

    },
    userAddressLbl: {
        fontSize: '16px',
        marginRight: '20px'
    },
    center: {
        textAlign: 'center'
    }
}));

export {mainStyles}