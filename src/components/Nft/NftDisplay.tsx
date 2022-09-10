import { useState } from "react"
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
import { useAppDispatch, useAppSelector as selector } from '../../app/hooks'
import {
  Tile,
} from 'carbon-components-react'
import {
  Calculation32,
  Tag32,
  Launch16,
} from '@carbon/icons-react';
import { numDisplay } from '../../utils'

import { InlineLoading } from 'carbon-components-react'

const collectionPage = 'https://mintsquare.io/collection/zksync-testnet/0x1c36fe89BBE10ce872cE4c52A5EbfcEB62967936/nfts'

const NftCardHeader = () => {
  return (
    <SpacedList spacing={10} row>
      <TitleText>
        Trustless Pyramid
      </TitleText>
      <a href={collectionPage} target='_blank'>
        <Launch16 />
      </a>
    </SpacedList>
  )
}


const NftDisplayContent = ({
  nftPyramid,
  balances,
  nftAddress,
}: {
  nftPyramid: nftPyramid
  balances: balances
  nftAddress: string
}) => {
  const [countToMint, setCountToMint] = useState(0)
  console.log({countToMint})

  const totalSpend = countToMint * nftPyramid.price

  return (
    <SpacedList spacing={40}>
      <SpacedList spacing={20}>
        <NftCardHeader />
        <SpacedList spacing={5} row>
          <TitleText>
            {numDisplay(nftPyramid!.supplyCount)} / {numDisplay(nftPyramid!.maxSupply)}
          </TitleText>
          <Text>
            Minted
          </Text>
        </SpacedList>
        <Text style={{opacity: 0.7}}>
          Current Mint price:
          {' '}
          <Bold>{numDisplay(nftPyramid!.price, 2)} Eth</Bold>
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
          action: () => setCountToMint(nftPyramid!.maxMint),
        }}
        subTitle={
          <Text>
            You have
            {' '}
            <Text color={balances.userEthBalance < totalSpend ? red[50]: undefined}>
              <Bold>
                {numDisplay(balances.userEthBalance, 3)}{' '}
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
        disabled={countToMint <= 0 || countToMint > nftPyramid.maxMint}
        size='md'
        title='Mint'
        txArgs={{
          type: TransactionType.MintNftPyramid,
          NftPyramid: nftAddress,
          price: nftPyramid.price,
          countToMint,
        }}
      />
    </SpacedList>
  )
}


const NftDisplay = () => {
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
    <OneColumnDisplay loading={false}>
      <Tile style={{padding: 40, marginTop: 40}}>
        {
          nftPyramid === null || balances === null || rootContracts === null
            ? <SpacedList>
                <NftCardHeader />
                <Center>
                  <InlineLoading />
                </Center>
              </SpacedList>
            : <NftDisplayContent nftPyramid={nftPyramid} balances={balances} nftAddress={rootContracts.nftPyramid} />
        }
      </Tile>
    </OneColumnDisplay>
  )
}

export default NftDisplay
