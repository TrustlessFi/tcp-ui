import { Pool } from '@uniswap/v3-sdk'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components'
import { TYPE } from '../../theme'
import Column from '../Column'
import { RowFixed, RowBetween } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import { MouseoverTooltip } from '../Tooltip'
import { MenuItem } from './styleds'
import { LightGreyCard } from 'components/Card'
import TokenListLogo from '../../assets/svg/tokenlist.svg'
import QuestionHelper from 'components/QuestionHelper'
import useTheme from 'hooks/useTheme'

function poolKey(pool: Pool): string {
  return pool.token0.address + pool.token1.address
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

const FixedContentRow = styled.div`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-gap: 16px;
  align-items: center;
`
const TokenListLogoWrapper = styled.img`
  height: 20px;
`

function PoolRow({
  pool,
  onSelect,
  isSelected,
  style,
}: {
  pool: Pool & { type?: string }
  onSelect: () => void
  isSelected: boolean
  style: CSSProperties
}) {
  // only show add or remove buttons if not on selected list
  return (
    <MenuItem
      style={style}
      className={`token-item-${poolKey(pool)}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
    >
      {/*<CurrencyLogo currency={currency} size={'24px'} />*/}
      <Column>
        <Text title={pool.token0.name} fontWeight={500}>
          {pool.token0.symbol} - {pool.token1.symbol}
        </Text>
        <TYPE.darkGray ml="0px" fontSize={'12px'} fontWeight={300}>
          {pool.type?.charAt(0).toUpperCase()}{pool.type?.slice(1)} Pool
        </TYPE.darkGray>
      </Column>
      {/*<TokenTags currency={currency} />*/}
    </MenuItem>
  )
}

export default function PoolList({
  height,
  pools,
  selectedPool,
  onPoolSelect,
  fixedListRef,
  breakIndex,
}: {
  height: number
  pools: Pool[]
  selectedPool?: Pool | null
  onPoolSelect: (pool: Pool) => void
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  breakIndex?: number
}) {
  const itemData: (Pool | undefined)[] = useMemo(() => {
    let formatted: (Pool | undefined)[] = pools;
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }
    return formatted
  }, [breakIndex, pools])

  const theme = useTheme()

  const Row = useCallback(
    ({ data, index, style }) => {
      const pool: Pool = data[index]
      const isSelected = Boolean(selectedPool && selectedPool.token0 === pool.token0 && selectedPool.token1 === pool.token1)
      const handleSelect = () => onPoolSelect(pool)

      //const token = wrappedCurrency(currency, chainId)

      if (index === breakIndex || !data) {
        return (
          <FixedContentRow style={style}>
            <LightGreyCard padding="8px 12px" $borderRadius="8px">
              <RowBetween>
                <RowFixed>
                  <TokenListLogoWrapper src={TokenListLogo} />
                  <TYPE.main ml="6px" fontSize="12px" color={theme.text1}>
                    Expanded results from inactive Token Lists
                  </TYPE.main>
                </RowFixed>
                <QuestionHelper text="Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists." />
              </RowBetween>
            </LightGreyCard>
          </FixedContentRow>
        )
      }

      return (
        <PoolRow
          style={style}
          pool={pool}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      )
    },
    [
      onPoolSelect,
      selectedPool,
      breakIndex,
      theme.text1,
    ]
  )

  const itemKey = useCallback((index: number, data: any) => poolKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
