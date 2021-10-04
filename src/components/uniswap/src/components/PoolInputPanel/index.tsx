import { Pair } from '@uniswap/v2-sdk'
import { Pool } from '@uniswap/v3-sdk'
import { CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import PoolSearchModal from '../SearchModal/PoolSearchModal'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ButtonGray } from '../Button'
import { RowFixed } from '../Row'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: 16px;
  background-color: 'transparent';
  z-index: 1;
  width: 100%;
`

const Container = styled.div`
  border-radius: 16px;
  border: 1px solid transparent;
  background-color: ${({ theme }) => theme.bg1};
  width: 100%;
  :focus,
  :hover {
    border: 1px solid transparent;
  }
`

const CurrencySelect = styled(ButtonGray)<{ selected: boolean }>`
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg0 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 16px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  height: 2.8rem;
  width: 100%;
  padding: 0 8px;
  justify-content: space-between;
  margin-right: 0;
  :focus,
  :hover {
    background-color: ${({ selected, theme }) => (selected ? theme.bg2 : darken(0.05, theme.primary1))};
  }
`

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? ' 1rem 1rem 0.75rem 1rem' : '1rem 1rem 0.75rem 1rem')};
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 35%;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.25rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '18px' : '18px')};
`

interface PoolInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onPoolSelect: (pool: Pool) => void
  selectedPool?: Pool | null
  pools?: Pool[]
  hideBalance?: boolean
  pair?: Pair | null
  fiatValue?: CurrencyAmount<Token> | null
  priceImpact?: Percent
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
}

export default function PoolInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onPoolSelect,
  selectedPool,
  pools,
  id,
  showCommonBases,
  customBalanceText,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  ...rest
}: PoolInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <InputPanel id={id} {...rest}>
      <Container>
        <InputRow style={{ padding: '0', borderRadius: '8px' }} selected={false}>
          <CurrencySelect
            selected={!!selectedPool}
            className="open-currency-select-button"
            onClick={() => setModalOpen(true)}
          >
            <Aligner>
              <RowFixed>
                {selectedPool && (
                  <span style={{ marginRight: '0.5rem' }}>
                    <DoubleCurrencyLogo currency0={selectedPool.token0} currency1={selectedPool.token1} size={24} margin={true} />
                  </span>
                )}
                {selectedPool ? (
                  <StyledTokenName className="pair-name-container">
                    {selectedPool.token0.symbol}:{selectedPool.token1.symbol}
                  </StyledTokenName>
                ) : (
                  <StyledTokenName className="token-symbol-container" active={!!selectedPool}>
                    Select a Pool
                  </StyledTokenName>
                )}
              </RowFixed>
              <StyledDropDown selected={!!selectedPool} />
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      <PoolSearchModal
        isOpen={modalOpen}
        onDismiss={handleDismissSearch}
        onPoolSelect={onPoolSelect}
        pools={pools}
        selectedPool={selectedPool}
      />
    </InputPanel>
  )
}
