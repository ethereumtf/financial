import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BKYf1g7I0r8VBBBCPBjGWTbUaGWvwYdmVcG8p4WPj4o4FJhN8iJGzUIqHBtZuR6FsF8QnJwXpBaWa2d1dKxL6Hw";

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1",
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
  },
  uiConfig: {
    appName: "USD Financial",
    appUrl: "https://usdfinancial.co",
    logoLight: "https://usdfinancial.co/logo.png",
    logoDark: "https://usdfinancial.co/logo.png",
    defaultLanguage: "en",
    mode: "light",
    theme: {
      primary: "#10b981",
    },
    useLogoLoader: true,
  },
});

export { web3auth };