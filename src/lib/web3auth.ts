import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { AccountAbstractionProvider } from "@web3auth/account-abstraction-provider";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4GjjGKm6bKJ_fJukNQjc9aYAM";

// Account Abstraction Provider Configuration
const aaProvider = new AccountAbstractionProvider({
  config: {
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0xaa36a7", // Sepolia testnet for AA
      rpcTarget: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      displayName: "Ethereum Sepolia",
      blockExplorerUrl: "https://sepolia.etherscan.io",
      ticker: "ETH",
      tickerName: "Ethereum",
    },
  },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7", // Sepolia for AA support
    rpcTarget: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    displayName: "Ethereum Sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
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
    modalConfig: {
      "openlogin": {
        label: "openlogin",
        loginMethods: {
          email_passwordless: {
            name: "email_passwordless",
            showOnModal: true,
          },
          google: {
            name: "google", 
            showOnModal: true,
          },
          facebook: {
            name: "facebook",
            showOnModal: false,
          },
          twitter: {
            name: "twitter",
            showOnModal: false,
          },
          github: {
            name: "github",
            showOnModal: false,
          },
          discord: {
            name: "discord",
            showOnModal: false,
          },
        },
      },
    },
  },
});

export { web3auth, aaProvider };