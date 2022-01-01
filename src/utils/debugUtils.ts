import { ethers } from 'ethers';

export const debugProvider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');

export const increaseTime = async (timeIncreaseS: number): Promise<void> => {
  await debugProvider.send("evm_increaseTime", [Math.floor(timeIncreaseS)]);
  await debugProvider.send("evm_mine", []);
}

export const mineBlocks = async (count = 1): Promise<void> => {
  for(let i = 0; i < count; i++) await debugProvider.send("evm_mine", []);
}
