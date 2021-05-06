import { Text, Title } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Button from 'src/components/layout/Button'

import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { safeSpendingLimitsSelector } from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'

import { LimitsTable } from './LimitsTable'
import { getSpendingLimitData } from './LimitsTable/dataFetcher'
import { NewLimitModal } from './NewLimitModal'
import { NewLimitSteps } from './NewLimitSteps'
import { useStyles } from './style'
import { mainStyles } from 'src/theme/PageStyles'

const InfoText = styled(Text)`
  margin-top: 16px;
`

export const SpendingLimitSettings = (): ReactElement => {
  const mainClasses = mainStyles()
  const classes = useStyles()
  const granted = useSelector(grantedSelector)
  const allowances = useSelector(safeSpendingLimitsSelector)
  const spendingLimitData = getSpendingLimitData(allowances)

  const [showNewSpendingLimitModal, setShowNewSpendingLimitModal] = useState(false)
  const openNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(true)
  }
  const closeNewSpendingLimitModal = () => {
    setShowNewSpendingLimitModal(false)
  }

  return (
    <>
      <Block className={classes.container} grow="grow">
        <Title size="xs" withoutMargin>
          Spending Limit
        </Title>
        <InfoText size="lg">
          You can set rules for specific beneficiaries to access funds from this Trust without having to collect all
          signatures.
        </InfoText>
        {spendingLimitData?.length ? <LimitsTable data={spendingLimitData} /> : <NewLimitSteps />}
      </Block>

      {granted && (
        <>
          <Row align="end" className={classes.buttonRow} grow>
            <Col end="xs">
              <Button
                color="primary"
                size="md"
                className={`${mainClasses.mainButton} ${mainClasses.borderButton}`}
                data-testid="new-spending-limit-button"
                onClick={openNewSpendingLimitModal}
                variant="contained"
              >
                New spending limit
              </Button>
            </Col>
          </Row>
          {showNewSpendingLimitModal && <NewLimitModal close={closeNewSpendingLimitModal} open={true} />}
        </>
      )}
    </>
  )
}
