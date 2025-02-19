import { CoinConfigLike } from "./types";
import usdc from "../assets/usdc.png";
import sFuse from "../assets/sFuse.svg";
import weth from "../assets/weth.svg";

export const coins: CoinConfigLike[] = [
  {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    icon: usdc,
  },
  {
    name: "Fuse",
    symbol: "FUSE",
    decimals: 18,
    icon: sFuse,
  },
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    icon: weth,
  },
];
