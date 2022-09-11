import { useState } from "react"
import { red } from '@carbon/colors';
import waitFor from '../../slices/waitFor'
import SpacedList from '../library/SpacedList'
import TitleText from '../library/TitleText'
import Text from '../library/Text'
import Bold from '../library/Bold'
import PositionInfoItem from '../library/PositionInfoItem'
import FullNumberInput from '../library/FullNumberInput'
import CreateTransactionButton from '../library/CreateTransactionButton'
import { TransactionType } from '../../slices/transactions'
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Tile,
} from 'carbon-components-react'
import {
  Tag32,
  Launch16,
} from '@carbon/icons-react';
import { numDisplay } from '../../utils'

const collectionPage = 'https://mintsquare.io/collection/zksync-testnet/0x1c36fe89BBE10ce872cE4c52A5EbfcEB62967936/nfts'

const MintNftCardHeader = () => {
  return (
    <SpacedList spacing={10} row>
      <TitleText>
        Trustless Pyramid
      </TitleText>
      <a href={collectionPage} target='_blank' rel='noreferrer'>
        <Launch16 />
      </a>
    </SpacedList>
  )
}

const MintNftWrapper = () => {
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

  const [countToMint, setCountToMint] = useState(0)
  console.log({countToMint})

  const totalSpend = nftPyramid === null ? 0 : countToMint * nftPyramid.price

  return (
    <Tile style={{padding: 40, marginTop: 40}}>
      <SpacedList spacing={40}>
        <SpacedList spacing={20}>
          <MintNftCardHeader />
          <SpacedList spacing={5} row>
            <TitleText>
              {
                nftPyramid === null
                  ? '- / -'
                  : `${numDisplay(nftPyramid.supplyCount)} / ${numDisplay(nftPyramid.maxSupply)}`
              }
            </TitleText>
            <Text>
              Minted
            </Text>
          </SpacedList>
          <Text style={{opacity: 0.7}}>
            Current Mint price:
            {' '}
            <Bold>
              {
                nftPyramid === null
                ? '-'
                : numDisplay(nftPyramid.price, 2)
              }
              {' '}
              Eth
            </Bold>
          </Text>
        </SpacedList>
        <FullNumberInput
          title='Count to mint'
          action={(value: number) => setCountToMint(value)}
          light
          value={parseFloat(numDisplay(countToMint, 0).replace(',', ''))}
          unit='Hue'
          defaultButton={{
            title: 'Max',
            action: () => setCountToMint(nftPyramid === null ? 0 : nftPyramid.maxMint),
          }}
          subTitle={
            <Text>
              You have
              {' '}
              <Text color={balances !== null && balances.userEthBalance < totalSpend ? red[50]: undefined}>
                <Bold>
                  {
                    balances === null
                      ? '-'
                      : numDisplay(balances.userEthBalance, 3)
                  }{' '}
                  Eth
                </Bold>
              </Text>
              {' '}
              in your wallet
            </Text>
          }
        />
        <PositionInfoItem
          key='apr_info'
          icon={<Tag32 />}
          title='Total Cost'
          value={numDisplay(totalSpend, 2)}
          unit='Eth'
        />
        <CreateTransactionButton
          disabled={nftPyramid === null ? true : countToMint <= 0 || countToMint > nftPyramid.maxMint}
          size='md'
          title='Mint'
          txArgs={{
            type: TransactionType.MintNftPyramid,
            NftPyramid: rootContracts === null ? '' : rootContracts.nftPyramid,
            price: nftPyramid === null ? 0 : nftPyramid.price,
            countToMint,
          }}
        />
      </SpacedList>
    </Tile>
  )
}


export default MintNftWrapper
