import { useState, useEffect } from "react"
import { red } from '@carbon/colors';
import OneColumnDisplay from '../library/OneColumnDisplay'
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import TitleText from '../library/TitleText'
import Text from '../library/Text'
import Bold from '../library/Bold'
import Center from '../library/Center'
import PositionInfoItem from '../library/PositionInfoItem'
import FullNumberInput from '../library/FullNumberInput'
import CreateTransactionButton from '../library/CreateTransactionButton'
import { nftPyramid } from '../../slices/nftPyramid'
import { balances } from '../../slices/balances'
import { TransactionType } from '../../slices/transactions'
import Axios from 'axios'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Tile,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell
} from 'carbon-components-react'
import {
  Calculation32,
  Tag32,
  Launch16,
} from '@carbon/icons-react';
import { numDisplay } from '../../utils'

import { InlineLoading } from 'carbon-components-react'

interface nftItem {
  image: string
  name: string
  id: number
  description: string
  attributes: {trait_type: string, value: string}[]
}

const extractNftAttributes = <T extends {[key in string]: string}>(nftItem: nftItem): T => {
  const attributes: {[key in string]: string} = {}
  for (const attribute of nftItem.attributes) {
    attributes[attribute.trait_type] = attribute.value
  }
  return attributes as T
}


const extractIpfsHandleFromUri = (ipfsUri: string) => {
  console.log({ipfsUri})
  ipfsUri = ipfsUri.trim()
  console.log({ipfsUri})
  const ipfsProtocolString = 'ipfs://'
  if (ipfsUri.startsWith(ipfsProtocolString)) {
    ipfsUri = ipfsUri.substring(ipfsProtocolString.length)
  }
  console.log({ipfsUri})
  if (ipfsUri.endsWith('/')) {
    ipfsUri = ipfsUri.substring(0, ipfsUri.length - 1)
  }
  return ipfsUri
}

const pinataDomain = 'https://trustlessfi.mypinata.cloud/ipfs/'
const mintSquareDomain = 'https://mintsquare.io/asset/zksync-testnet/0x1c36fe89bbe10ce872ce4c52a5ebfceb62967936/'

const UserNftDisplayRow = ({
  nftPyramid,
  nftId,
}: {
  nftPyramid: nftPyramid
  nftId: number,
}) => {
  const getImageUriForId = (id: number) =>
    `${pinataDomain}${extractIpfsHandleFromUri(nftPyramid.imageBaseURI)}/${id}.png`
  const getDataUriForId = (id: number) =>
    `${pinataDomain}${extractIpfsHandleFromUri(nftPyramid.baseURI)}/${id}`
  const getMintSquareUrl = (id: number) =>
    `${mintSquareDomain}${id}`

  const [nftItem, setNftItem ] = useState<nftItem | null | undefined>(undefined)

  useEffect(() => {
    const fetchData = async () => {
      setNftItem((await Axios.get<nftItem>(getDataUriForId(nftId))).data)
    }
    fetchData().catch(error => {
      setNftItem(null)
      console.error({error})
    })
  })

  return (
    <StructuredListRow
      tabIndex={0}
      onClick={() => window.open(getMintSquareUrl(nftId))}
      style={{cursor: 'pointer'}}
    >
      <StructuredListCell style={{verticalAlign: 'middle' }}>
        {nftId}
      </StructuredListCell>
      <StructuredListCell style={{verticalAlign: 'middle' }}>
        {nftItem ? nftItem.name : ''}
      </StructuredListCell>
      <StructuredListCell style={{verticalAlign: 'middle' }}>
        {nftItem ? extractNftAttributes<{rarity: string}>(nftItem).rarity : ''}
      </StructuredListCell>
      <StructuredListCell style={{verticalAlign: 'middle' }}>
          <img src={getImageUriForId(nftId)} width={50} height={50} />
      </StructuredListCell>
    </StructuredListRow>
  )
}

const UserNftDisplay = ({
  nftPyramid,
}: {
  nftPyramid: nftPyramid
}) => {
  return (
    <SpacedList spacing={40}>
      <SpacedList spacing={20}>
        <SpacedList spacing={5} row>
          <TitleText>
            Your Nfts
          </TitleText>
          <Text>
            ({numDisplay(nftPyramid!.userBalance)})
          </Text>
        </SpacedList>
        <Text style={{opacity: 0.7}}>
          Current Mint price:
          {' '}
          <Bold>{numDisplay(nftPyramid!.price, 2)} Eth</Bold>
        </Text>
        <StructuredListWrapper ariaLabel="Structured list">
          <StructuredListHead>
            <StructuredListRow>
              <StructuredListCell head>
                ID
              </StructuredListCell>
              <StructuredListCell head>
                Name
              </StructuredListCell>
              <StructuredListCell head>
                Rarity
              </StructuredListCell>
              <StructuredListCell head>
              </StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {
              nftPyramid.userNftIDs.map(id =>
                <UserNftDisplayRow
                  nftPyramid={nftPyramid}
                  nftId={id}
                />
              )
            }
          </StructuredListBody>
        </StructuredListWrapper>
      </SpacedList>
    </SpacedList>
  )
}


const UserNftDisplayWrapper = () => {
  const dispatch = useAppDispatch()

  const {
    nftPyramid,
    balances,
    rootContracts,
  } = waitFor([
    'nftPyramid',
    'balances',
    'rootContracts',
  ], selector, dispatch)

  return (
    <Tile style={{padding: 40, marginTop: 40}}>
      {
        nftPyramid === null || balances === null || rootContracts === null
          ? <SpacedList>
              <Center>
                <InlineLoading />
              </Center>
            </SpacedList>
          : <UserNftDisplay nftPyramid={nftPyramid} />
      }
    </Tile>
  )
}

export default UserNftDisplayWrapper
