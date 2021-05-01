import React, { ReactElement } from 'react'
import { HomeLayout } from 'src/routes/home/components'

import Page from 'src/components/layout/Page'

const Home = (): ReactElement => (
  <Page align="center">
    <HomeLayout />
  </Page>
)

export default Home
