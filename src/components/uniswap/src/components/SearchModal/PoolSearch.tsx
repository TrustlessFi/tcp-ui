import { Pool } from '@uniswap/v3-sdk'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useToken, useIsUserAddedToken } from '../../hooks/Tokens'
import { CloseIcon, TYPE } from '../../theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import Row, { RowBetween } from '../Row'
import PoolList from './PoolList'
import { filterPools } from './filtering'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components'
import useToggle from 'hooks/useToggle'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useTheme from 'hooks/useTheme'
import useDebounce from 'hooks/useDebounce'

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`

interface PoolSearchProps {
  isOpen: boolean
  onDismiss: () => void
  pools: Pool[]
  selectedPool?: Pool | null
  onPoolSelect: (pool: Pool) => void
}

export function PoolSearch({
  selectedPool,
  onPoolSelect,
  onDismiss,
  pools,
  isOpen,
}: PoolSearchProps) {
  const theme = useTheme()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const searchToken = useToken(debouncedQuery)

  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const filteredPools: Pool[] = useMemo(() => {
    return filterPools(pools, debouncedQuery)
  }, [pools, debouncedQuery])

  const handlePoolSelect = useCallback(
    (pool: Pool) => {
      onPoolSelect(pool)
      onDismiss()
    },
    [onDismiss, onPoolSelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth') {
          handlePoolSelect(filteredPools[0])
        } else if (filteredPools.length > 0) {
          if (
            filteredPools[0]?.token0.symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredPools[0]?.token1.symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredPools.length === 1
          ) {
            handlePoolSelect(filteredPools[0])
          }
        }
      }
    },
    [filteredPools, handlePoolSelect, debouncedQuery]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Row>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={"Search name or paste address"}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </Row>
      </PaddedColumn>
      <Separator />
      {searchToken && !searchTokenIsAdded ? '' : filteredPools?.length > 0 ? (
        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <PoolList
                height={height}
                pools={filteredPools}
                onPoolSelect={handlePoolSelect}
                selectedPool={selectedPool}
                fixedListRef={fixedList}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: '20px', height: '100%' }}>
          <TYPE.main color={theme.text3} textAlign="center" mb="20px">
            No results found.
          </TYPE.main>
        </Column>
      )}
    </ContentWrapper>
  )
}
