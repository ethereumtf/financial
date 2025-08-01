import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenLoginAdapter } from "@web3auth/openlogin-adapter";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4GjjGKm6bKJ_fJukNQjc9aYAM";

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

const openloginAdapter = new OpenLoginAdapter({
  adapterSettings: {
    uxMode: 'popup',
    loginConfig: {
      jwt: {
        verifier: 'usd-financial-dev-verifier',
        typeOfLogin: 'jwt',
        clientId,
      },
    },
  },
});

web3auth.configureAdapter(openloginAdapter);

export { web3auth };