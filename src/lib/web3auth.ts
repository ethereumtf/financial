import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BKYf1g7I0r8VBBBCPBjGWTbUaGWvwYdmVcG8p4WPj4o4FJhN8iJGzUIqHBtZuR6FsF8QnJwXpBaWa2d1dKxL6Hw"; // Get from Web3Auth Dashboard

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
  rpcTarget: "https://rpc.ankr.com/eth", // This is the public RPC we have added, please pass on your own endpoint while creating an app
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Use SAPPHIRE_DEVNET for testing
  privateKeyProvider,
  uiConfig: {
    appName: "USD Financial",
    appUrl: "https://usdfinancial.co",
    logoLight: "https://usdfinancial.co/logo.png",
    logoDark: "https://usdfinancial.co/logo.png",
    defaultLanguage: "en",
    mode: "light",
    theme: {
      primary: "#10b981", // emerald-500
    },
    useLogoLoader: true,
  },
});

export { web3auth, privateKeyProvider };