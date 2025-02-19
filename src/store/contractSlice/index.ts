import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AppState } from "../rootReducer";
import { approveSpend } from "../../utils/erc20";
import { fetchApproval, fetchBalance } from "../balanceSlice";
import { bridgeNative, bridgeOriginal } from "../../utils/originalBridge";
import {
  bridgeAndUnwrapNative,
  bridgeWrapped,
} from "../../utils/wrappedBridge";
import { insertTransactionToLocalStorage } from "../../utils/helpers";
import { updateTransactions } from "../transactionsSlice";
import { updateAllBalances } from "../../utils/web3onboard";

export interface ContractStateType {
  isBridgeLoading: boolean;
  isApprovalLoading: boolean;
  isError: boolean;
}

const INIT_STATE: ContractStateType = {
  isBridgeLoading: false,
  isApprovalLoading: false,
  isError: false,
};

export const increaseERC20Allowance = createAsyncThunk(
  "CONTRACT/INCREASE_ALLOWANCE",
  async (
    {
      amount,
      contractAddress,
      bridge,
      decimals = 18,
      address,
    }: {
      amount: string;
      contractAddress: string;
      bridge: string;
      decimals: number;
      address: string;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      approveSpend(contractAddress, bridge, amount, decimals)
        .then((txHash) => {
          thunkAPI.dispatch(
            fetchApproval({
              contractAddress,
              address,
              spender: bridge,
              decimals,
            })
          );
          updateAllBalances();
          resolve(txHash);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const bridgeOriginalTokens = createAsyncThunk(
  "CONTRACT/BRIDGE_ORIGINAL",
  async (
    {
      amount,
      contractAddress,
      bridge,
      decimals = 18,
      address,
      srcChainId,
      symbol,
      dstChainId,
    }: {
      amount: string;
      contractAddress: string;
      bridge: string;
      decimals: number;
      address: string;
      srcChainId: number;
      symbol: string;
      dstChainId: number;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      bridgeOriginal(
        bridge,
        address,
        contractAddress,
        amount,
        decimals,
        dstChainId
      )
        .then((txHash) => {
          thunkAPI.dispatch(
            fetchBalance({
              address,
              bridge,
              contractAddress,
              decimals,
            })
          );
          insertTransactionToLocalStorage({
            hash: txHash,
            srcChainId,
            address,
            amount: amount + " " + symbol,
            timestamp: Date.now(),
            dstChainId,
          });
          thunkAPI.dispatch(
            updateTransactions({
              hash: txHash,
              srcChainId,
              address,
              amount: amount + " " + symbol,
              timestamp: Date.now(),
              dstChainId,
            })
          );
          updateAllBalances();
          resolve(txHash);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
);

export const bridgeNativeTokens = createAsyncThunk(
  "CONTRACT/BRIDGE_NATIVE",
  async (
    {
      amount,
      bridge,
      decimals = 18,
      address,
      srcChainId,
      symbol,
      dstChainId,
    }: {
      amount: string;
      bridge: string;
      decimals: number;
      address: string;
      srcChainId: number;
      symbol: string;
      dstChainId: number;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      bridgeNative(bridge, address, amount, decimals, dstChainId)
        .then((txHash) => {
          insertTransactionToLocalStorage({
            hash: txHash,
            srcChainId,
            address,
            amount: amount + " " + symbol,
            timestamp: Date.now(),
            dstChainId,
          });
          thunkAPI.dispatch(
            updateTransactions({
              hash: txHash,
              srcChainId,
              address,
              amount: amount + " " + symbol,
              timestamp: Date.now(),
              dstChainId,
            })
          );
          updateAllBalances();
          resolve(txHash);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
);

export const bridgeWrappedTokens = createAsyncThunk(
  "CONTRACT/BRIDGE_WRAPPED",
  async (
    {
      amount,
      contractAddress,
      bridge,
      decimals = 18,
      address,
      chainId,
      symbol,
      srcChainId,
    }: {
      amount: string;
      contractAddress: string;
      bridge: string;
      decimals: number;
      address: string;
      chainId: number;
      symbol: string;
      srcChainId: number;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      bridgeWrapped(bridge, address, contractAddress, amount, decimals, chainId)
        .then((txHash) => {
          thunkAPI.dispatch(
            fetchBalance({
              address,
              bridge,
              contractAddress,
              decimals,
            })
          );
          insertTransactionToLocalStorage({
            hash: txHash,
            srcChainId: srcChainId,
            address,
            amount: amount + " " + symbol,
            timestamp: Date.now(),
            dstChainId: chainId,
          });
          thunkAPI.dispatch(
            updateTransactions({
              hash: txHash,
              srcChainId: srcChainId,
              address,
              amount: amount + " " + symbol,
              timestamp: Date.now(),
              dstChainId: chainId,
            })
          );
          updateAllBalances();
          resolve(txHash);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

export const bridgeAndUnwrap = createAsyncThunk(
  "CONTRACT/BRIDGE_AND_UNWRAP_NATIVE",
  async (
    {
      amount,
      contractAddress,
      bridge,
      decimals = 18,
      address,
      chainId,
      symbol,
      srcChainId,
    }: {
      amount: string;
      contractAddress: string;
      bridge: string;
      decimals: number;
      address: string;
      chainId: number;
      symbol: string;
      srcChainId: number;
    },
    thunkAPI
  ) => {
    return new Promise<any>(async (resolve, reject) => {
      bridgeAndUnwrapNative(
        bridge,
        address,
        contractAddress,
        amount,
        decimals,
        chainId
      )
        .then((txHash) => {
          thunkAPI.dispatch(
            fetchBalance({
              address,
              bridge,
              contractAddress,
              decimals,
            })
          );
          insertTransactionToLocalStorage({
            hash: txHash,
            srcChainId: srcChainId,
            address,
            amount: amount + " " + symbol,
            timestamp: Date.now(),
            dstChainId: chainId,
          });
          thunkAPI.dispatch(
            updateTransactions({
              hash: txHash,
              srcChainId: srcChainId,
              address,
              amount: amount + " " + symbol,
              timestamp: Date.now(),
              dstChainId: chainId,
            })
          );
          updateAllBalances();
          resolve(txHash);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
);

const contractSlice = createSlice({
  name: "CONTRACT_STATE",
  initialState: INIT_STATE,
  reducers: {},
  extraReducers: {
    [increaseERC20Allowance.pending.type]: (state) => {
      state.isApprovalLoading = true;
    },
    [increaseERC20Allowance.fulfilled.type]: (state) => {
      state.isApprovalLoading = false;
    },
    [increaseERC20Allowance.rejected.type]: (state) => {
      state.isApprovalLoading = false;
      state.isError = true;
    },
    [bridgeOriginalTokens.pending.type]: (state) => {
      state.isBridgeLoading = true;
    },
    [bridgeOriginalTokens.fulfilled.type]: (state) => {
      state.isBridgeLoading = false;
    },
    [bridgeOriginalTokens.rejected.type]: (state) => {
      state.isBridgeLoading = false;
      state.isError = true;
    },
    [bridgeWrappedTokens.pending.type]: (state) => {
      state.isBridgeLoading = true;
    },
    [bridgeWrappedTokens.fulfilled.type]: (state) => {
      state.isBridgeLoading = false;
    },
    [bridgeWrappedTokens.rejected.type]: (state) => {
      state.isBridgeLoading = false;
      state.isError = true;
    },
    [bridgeNativeTokens.pending.type]: (state) => {
      state.isBridgeLoading = true;
    },
    [bridgeNativeTokens.fulfilled.type]: (state) => {
      state.isBridgeLoading = false;
    },
    [bridgeNativeTokens.rejected.type]: (state) => {
      state.isBridgeLoading = false;
      state.isError = true;
    },
    [bridgeAndUnwrap.pending.type]: (state) => {
      state.isBridgeLoading = true;
    },
    [bridgeAndUnwrap.fulfilled.type]: (state) => {
      state.isBridgeLoading = false;
    },
    [bridgeAndUnwrap.rejected.type]: (state) => {
      state.isBridgeLoading = false;
      state.isError = true;
    },
  },
});

export const selectContractSlice = (state: AppState): ContractStateType =>
  state.contract;

export default contractSlice.reducer;
