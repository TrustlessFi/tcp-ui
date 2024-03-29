import { useState, useEffect } from "react"
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import TitleText from '../library/TitleText'
import RelativeLoading from '../library/RelativeLoading'
import Text from '../library/Text'
import Center from '../library/Center'
import { nftPyramid } from '../../slices/nftPyramid'
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
import { numDisplay } from '../../utils'
import { LazyLoadImage } from 'react-lazy-load-image-component'

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
  ipfsUri = ipfsUri.trim()
  const ipfsProtocolString = 'ipfs://'
  if (ipfsUri.startsWith(ipfsProtocolString)) {
    ipfsUri = ipfsUri.substring(ipfsProtocolString.length)
  }
  if (ipfsUri.endsWith('/')) {
    ipfsUri = ipfsUri.substring(0, ipfsUri.length - 1)
  }
  return ipfsUri
}

const pinataDomain = 'https://trustlessfi.mypinata.cloud/ipfs/'

const UserNftDisplayRow = ({
  nftPyramid,
  nftId,
}: {
  nftPyramid: nftPyramid
  nftId: number,
}) => {
  const dispatch = useAppDispatch()

  const [nftItem, setNftItem ] = useState<nftItem | null | undefined>(undefined)

  const {
    rootContracts,
  } = waitFor([
    'rootContracts',
  ], selector, dispatch)


  const getImageUriForId = (id: number) =>
    `${pinataDomain}${extractIpfsHandleFromUri(nftPyramid.imageBaseURI)}/${id}.png`
  const getDataUriForId = (id: number) =>
    `${pinataDomain}${extractIpfsHandleFromUri(nftPyramid.baseURI)}/${id}`
  const getMintSquareUrl = (address: string, id: number) =>
    `https://mintsquare.io/asset/zksync-testnet/${address}/${id}`

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
      onClick={
        rootContracts === null
          ? () => {}
          : () => window.open(getMintSquareUrl(rootContracts.nftPyramid, nftId))}
      style={{cursor: 'pointer'}}
    >
      <StructuredListCell style={{verticalAlign: 'middle' }}>
        {nftId}
      </StructuredListCell>
      <StructuredListCell style={{verticalAlign: 'middle' }}>
        {nftItem ? nftItem.name : '-'}
      </StructuredListCell>
      <StructuredListCell style={{verticalAlign: 'middle' }}>
        {nftItem ? extractNftAttributes<{rarity: string}>(nftItem).rarity : '-'}
      </StructuredListCell>
      <StructuredListCell style={{verticalAlign: 'middle' }}>
      <LazyLoadImage
        height={50}
        src={getImageUriForId(nftId)} // use normal <img> attributes as props
        width={50}
        alt={`Trustless Pyramid #${nftId}`}
        placeholder={<InlineLoading />}
      />
      </StructuredListCell>
    </StructuredListRow>
  )
}

const UserNftDisplay = () => {
  const dispatch = useAppDispatch()

  const {
    nftPyramid,
    chainID,
    userAddress,
  } = waitFor([
    'nftPyramid',
    'chainID',
    'userAddress',
  ], selector, dispatch)

  if (chainID === null || userAddress === null) {
    return <></>
  }

  return (
    <div style={{position: 'relative'}}>
      <RelativeLoading show={nftPyramid === null} />
      <Tile style={{
        position: 'relative',
        marginTop: 40,
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
      }}>
        <SpacedList spacing={20}>
          <SpacedList spacing={5} row>
            <TitleText>
              Your Nfts
            </TitleText>
            {
              nftPyramid === null
                ? null
                : <Text>
                    ({numDisplay(nftPyramid.userBalance)})
                  </Text>
            }
          </SpacedList>
          {
            nftPyramid === null
            ? null
            : (
              nftPyramid.userNftIDs.length === 0
              ? <Center style={{marginTop: 20}}>
                  You don't have any yet.
                </Center>
              : <StructuredListWrapper ariaLabel="Structured list">
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
              )
        }
        </SpacedList>
      </Tile>
    </div>
  )
}

export default UserNftDisplay
