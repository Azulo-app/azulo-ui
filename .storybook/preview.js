import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { addDecorator } from '@storybook/react'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'

import { aNewStore } from 'src/store'
import librefranklinRegular from 'src/assets/fonts/LibreFranklin-Regular.woff2'
import librefranklinSemiBold from 'src/assets/fonts/LibreFranklin-SemiBold.woff2'
import librefranklinBold from 'src/assets/fonts/LibreFranklin-Bold.woff2'

const GlobalStyles = createGlobalStyle`
   @font-face {
        font-family: 'Libre Franklin';
        src: local('LibreFranklin'), local('LibreFranklin SemiBold'), local('LibreFranklin Bold'),
        url(${librefranklinRegular}) format('woff2'),
        url(${librefranklinSemiBold}) format('woff2'),
        url(${librefranklinBold}) format('woff');
    }
`

addDecorator((storyFn) => (
  <ThemeProvider theme={theme}>
    <MemoryRouter>
      <GlobalStyles />
      <Provider store={aNewStore()}>
        {storyFn()}
      </Provider>
    </MemoryRouter>
  </ThemeProvider>
))
