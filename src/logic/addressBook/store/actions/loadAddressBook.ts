import { createAction } from 'redux-actions'
import { AddressBookState } from 'src/logic/addressBook/model/addressBook'

export const IMPORT_ADDRESS_BOOK = 'IMPORT_ADDRESS_BOOK'

export const loadAddressBook = createAction(IMPORT_ADDRESS_BOOK, (addressBook: AddressBookState) => ({
  addressBook,
}))
