// Copyright (c) 2020. All Rights Reserved
// SPDX-License-Identifier: UNLICENSED

import ethers, { Contract } from "ethers"

// ==================== Trustless Dependencies =========================
import { TestnetMultiMint } from "@trustlessfi/typechain"
import { getAddress, PublicChainID } from '@trustlessfi/addresses'
import testnetMultiMintArtifact from "@trustlessfi/artifacts/dist/contracts/core/auxiliary/TestnetMultiMint.sol/TestnetMultiMint.json"

const testnetMultiMint = async (addresses: string[]) => {
  const multimintContractAddress = getAddress(PublicChainID.ZKSyncGoerli, 'Aux', 'testnetMultiMint')
  const chainEthAddress = getAddress(PublicChainID.ZKSyncGoerli, 'Aux', 'chainEth')

  const chainEthCount = '10000000000000'
  const truEthCount = '5000000000000000000'

  const provider = new ethers.providers.JsonRpcProvider('https://zksync2-testnet.zksync.dev')
  const privateKey = 'insert_private_key_here'
  const signer = new ethers.Wallet(privateKey, provider)

  const multiMintContract =
    new Contract(
      multimintContractAddress,
      testnetMultiMintArtifact.abi,
    ) as unknown as TestnetMultiMint

  const tx = await multiMintContract.connect(signer).multiMint(
    chainEthAddress,
    chainEthCount,
    truEthCount,
    addresses,
    { gasLimit: 21001 }
  )

  const receipt = await provider.waitForTransaction(tx.hash)
  const succeeded = receipt.status === 1
  if (succeeded) {
    console.log(`tx ${tx.hash} succeeded`)
  } else {
    console.log(`tx ${tx.hash} failed`)
  }
}


export default testnetMultiMint
