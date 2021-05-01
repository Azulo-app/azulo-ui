import React, { ReactElement } from 'react'
import { CreateLayout } from 'src/routes/start/components'

import Page from 'src/components/layout/Page'

const Create = (): ReactElement => (
  <Page align="center">
    <CreateLayout />
  </Page>
)

export default Create
