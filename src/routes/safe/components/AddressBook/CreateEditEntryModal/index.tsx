import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { useStyles } from './style'

import Modal from 'src/components/Modal'
import { ScanQRWrapper } from 'src/components/ScanQRModal/ScanQRWrapper'
import AddressInput from 'src/components/forms/AddressInput'
import Field from 'src/components/forms/Field'
import GnoForm from 'src/components/forms/GnoForm'
import TextField from 'src/components/forms/TextField'
import { composeValidators, minMaxLength, required, uniqueAddress } from 'src/components/forms/validator'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { addressBookAddressesListSelector } from 'src/logic/addressBook/store/selectors'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { Entry } from 'src/routes/safe/components/AddressBook/index'

export const START_ENTRY_INPUT_NAME_ID = 'create-entry-input-name'
export const START_ENTRY_INPUT_ADDRESS_ID = 'create-entry-input-address'
export const SAVE_NEW_ENTRY_BTN_ID = 'save-new-entry-btn-id'

const formMutators = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'address', () => args[0])
  },
}

type CreateEditEntryModalProps = {
  editEntryModalHandler: (entry: AddressBookEntry) => void
  entryToEdit: Entry
  isOpen: boolean
  newEntryModalHandler: (entry: AddressBookEntry) => void
  onClose: () => void
}

export const CreateEditEntryModal = ({
  editEntryModalHandler,
  entryToEdit,
  isOpen,
  newEntryModalHandler,
  onClose,
}: CreateEditEntryModalProps): ReactElement => {
  const classes = useStyles()

  const { isNew, ...initialValues } = entryToEdit.entry

  const onFormSubmitted = (values: AddressBookEntry) => {
    if (isNew) {
      newEntryModalHandler(values)
    } else {
      editEntryModalHandler(values)
    }
  }

  const storedAddresses = useSelector(addressBookAddressesListSelector)
  const isUniqueAddress = uniqueAddress(storedAddresses)

  return (
    <Modal
      description={isNew ? 'Add new beneficiary entry' : 'Edit beneficiary entry'}
      handleClose={onClose}
      open={isOpen}
      paperClassName="smaller-modal-window"
      title={isNew ? 'Add new beneficiary' : 'Edit beneficiary'}
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          {isNew ? 'Add beneficiary' : 'Edit beneficiary'}
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Paragraph className={classes.annotation} noMargin size="lg">
        {isNew ? 'You can start adding your trust beneficiaries to the trust. Making it easier to send distributions and more.' :
                  'Edit the details of the beneficiary below.'}
      </Paragraph>
      <GnoForm formMutators={formMutators} onSubmit={onFormSubmitted} initialValues={initialValues}>
        {(...args) => {
          const formState = args[2]
          const mutators = args[3]
          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setOwnerAddress(scannedAddress)
            closeQrModal()
          }
          return (
            <>
              <Block className={classes.container}>
                <Row margin="md">
                  <Col xs={11}>
                    <Field
                      component={TextField}
                      name="name"
                      placeholder="Beneficiary name"
                      testId={START_ENTRY_INPUT_NAME_ID}
                      text="Name"
                      type="text"
                      validate={composeValidators(required, minMaxLength(1, 50))}
                    />
                  </Col>
                </Row>
                <Row margin="md">
                  <Col xs={11}>
                    <AddressInput
                      disabled={!isNew}
                      fieldMutator={mutators.setOwnerAddress}
                      name="address"
                      placeholder="Address*"
                      testId={START_ENTRY_INPUT_ADDRESS_ID}
                      text="Address*"
                      validators={[(value?: string) => (isNew ? isUniqueAddress(value) : undefined)]}
                    />
                  </Col>
                  {isNew ? (
                    <Col center="xs" className={classes} middle="xs" xs={1}>
                      <ScanQRWrapper handleScan={handleScan} />
                    </Col>
                  ) : null}
                </Row>
              </Block>
              <Hairline />
              <Row align="center" className={classes.buttonRow}>
                <Button minHeight={42} minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  minHeight={42}
                  minWidth={140}
                  testId={SAVE_NEW_ENTRY_BTN_ID}
                  type="submit"
                  variant="contained"
                  disabled={!formState.valid}
                >
                  {isNew ? 'Add beneficiary' : 'Save beneficiary'}
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </Modal>
  )
}
