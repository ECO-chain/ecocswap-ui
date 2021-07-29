import EcocURI from './ecoc/ecoc-uri'
import EcocWallet from './ecoc/ecoc-wallet'

export const parseEcocURI = (data: string): any => {
  if (EcocWallet.isEcocAddress(data)) {
    data = 'ecoc:' + data
  }
  return new EcocURI(data)
}

export const generateEcocURI = (address: string, amount: string): string => {
  return new EcocURI({ address, amount }).toString()
}
