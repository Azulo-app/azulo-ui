import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useSelector } from 'react-redux'
import {
  GenericModal,
  IconText,
  Loader,
  Menu,
  Icon,
  ModalFooterConfirmation,
  Text,
} from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'

import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import AppCard from 'src/routes/safe/components/Apps/components/AppCard'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
import { useRouteMatch, Link } from 'react-router-dom'
import { TRUSTS_ADDRESS } from 'src/routes/routes'

import { useAppList } from '../hooks/useAppList'
import { SAFE_APP_FETCH_STATUS, SafeApp } from '../types.d'
import AddAppForm from './AddAppForm'
import { AppData } from '../api/fetchSafeAppsList'

import { mainStyles } from 'src/theme/PageStyles'
import { mainColor, borderRadius, border } from 'src/theme/variables'
import Button from 'src/components/layout/Button'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const ContentHold = styled.div`
  border: 1px solid ${border};
  padding: 32px;
  border-radius: ${borderRadius};
  margin-top: 25px;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
`

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

const centerCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  ${centerCSS};
`

const CardsWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(243px, 1fr));
  column-gap: 20px;
  row-gap: 20px;
  justify-content: space-evenly;
  margin: 0 0 16px 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
`
const Breadcrumb = styled.div`
  height: 51px;
`

const IconBtn = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 5px;
  opacity: 0;

  transition: opacity 0.2s ease-in-out;
`

const AppContainer = styled.div`
  position: relative;

  &:hover {
    ${IconBtn} {
      opacity: 1;
    }
  }
`

const isAppLoading = (app: SafeApp) => SAFE_APP_FETCH_STATUS.LOADING === app.fetchStatus
const isCustomApp = (appUrl: string, staticAppsList: AppData[]) => !staticAppsList.some(({ url }) => url === appUrl)

const AppsList = (): React.ReactElement => {
  const mainClasses = mainStyles()
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${TRUSTS_ADDRESS}/:safeAddress` })
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { appList, removeApp, staticAppsList } = useAppList()
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false)
  const [appToRemove, setAppToRemove] = useState<SafeApp | null>(null)

  const openAddAppModal = () => setIsAddAppModalOpen(true)

  const closeAddAppModal = () => setIsAddAppModalOpen(false)

  if (!appList.length || !safeAddress) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  return (
    <>
      <Grid container alignItems="center">
        <Grid item className={mainClasses.accTitleHold}><div className={mainClasses.accTitle}>Apps</div></Grid>
        <Box flexGrow={1}><div className={mainClasses.accDesc}>Extend your trust functionality with Apps</div></Box>
      </Grid>
      <ContentHold>
        <Wrapper>

          <ContentWrapper>
            <CardsWrapper>
              <AppCard iconUrl={AddAppIcon} onClick={openAddAppModal} buttonText="Add custom app" iconSize="lg" />

              {appList
                .filter((a) => a.fetchStatus !== SAFE_APP_FETCH_STATUS.ERROR)
                .map((a) => (
                  <AppContainer key={a.url}>
                    <StyledLink key={a.url} to={`${matchSafeWithAddress?.url}/apps?appUrl=${encodeURI(a.url)}`}>
                      <AppCard isLoading={isAppLoading(a)} iconUrl={a.iconUrl} name={a.name} description={a.description} />
                    </StyledLink>
                    {isCustomApp(a.url, staticAppsList) && (
                      <IconBtn
                        title="Remove"
                        onClick={(e) => {
                          e.stopPropagation()

                          setAppToRemove(a)
                        }}
                      >
                        <Icon size="sm" type="delete" color="error" />
                      </IconBtn>
                    )}
                  </AppContainer>
                ))}
            </CardsWrapper>

            <IconText
              color="secondary"
              iconSize="sm"
              iconType="info"
              text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Gnosis. Interacting with the apps is at your own risk. Any communication within the Apps is for informational purposes only and must not be construed as investment advice to engage in any transaction."
              textSize="sm"
            />
          </ContentWrapper>

          {isAddAppModalOpen && (
            <GenericModal
              title="Add custom app"
              body={<AddAppForm closeModal={closeAddAppModal} appList={appList} />}
              onClose={closeAddAppModal}
            />
          )}

          {appToRemove && (
            <GenericModal
              title="Remove app"
              body={<Text size="md">This action will remove {appToRemove.name} from the interface</Text>}
              footer={
                <ModalFooterConfirmation
                  cancelText="Cancel"
                  handleCancel={() => setAppToRemove(null)}
                  handleOk={() => {
                    removeApp(appToRemove.url)
                    setAppToRemove(null)
                  }}
                  okText="Remove"
                />
              }
              onClose={() => setAppToRemove(null)}
            />
          )}
        </Wrapper>
      </ContentHold>
    </>
  )
}

export default AppsList
