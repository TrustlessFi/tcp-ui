import { Pool } from '@uniswap/v3-sdk'
import { Currency } from '@uniswap/sdk-core'
import React, { useCallback, useEffect, useState } from 'react'
import useLast from '../../hooks/useLast'
import Modal from '../Modal'
import { PoolSearch } from './PoolSearch'

interface PoolSearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedPool?: Pool | null
  onPoolSelect: (pool: Pool) => void
  pools?: Pool[]
}

export default function PoolSearchModal({
  isOpen,
  onDismiss,
  onPoolSelect,
  pools,
  selectedPool,
}: PoolSearchModalProps) {
  const handlePoolSelect = useCallback(
    (pool: Pool) => {
      onPoolSelect(pool)
      onDismiss()
    },
    [onDismiss, onPoolSelect]
  )

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      {pools && <PoolSearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        onPoolSelect={handlePoolSelect}
        pools={pools}
        selectedPool={selectedPool}
      />}
    </Modal>
  )
}