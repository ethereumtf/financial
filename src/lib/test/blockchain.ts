import { ethers } from 'ethers';
import { OneInchAdapter } from '../blockchain/1inch/adapter';
import { StellarBridge } from '../blockchain/stellar/bridge';
import { NearShadeAgent } from '../blockchain/near/agent';
import { EtherlinkAdapter } from '../blockchain/etherlink/adapter';
import { formatTokenAmount, parseTokenAmount } from '../blockchain/etherlink/utils';

export class BlockchainTestUtils {
  // Test 1inch integration
  static async test1Inch(chainId: number = 1) {
    try {
      const oneInch = new OneInchAdapter(chainId);
      
      // Get WETH address (for mainnet)
      const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
      const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
      
      // Get a quote
      const quote = await oneInch.getQuote({
        fromTokenAddress: WETH,
        toTokenAddress: DAI,
        amount: ethers.utils.parseEther('0.1').toString(),
        fromAddress: ethers.constants.AddressZero,
      });
      
      console.log('1inch Quote:', {
        from: '0.1 WETH',
        to: formatTokenAmount(quote.toTokenAmount, 18) + ' DAI',
        estimatedGas: quote.estimatedGas,
      });
      
      return { success: true, quote };
    } catch (error) {
      console.error('1inch Test Failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Test Stellar integration
  static async testStellar() {
    try {
      const stellar = new StellarBridge();
      console.log('Stellar Bridge initialized');
      
      // In a real test, you would need a Stellar testnet account
      return { success: true, message: 'Stellar test requires manual setup' };
    } catch (error) {
      console.error('Stellar Test Failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Test NEAR integration
  static async testNear() {
    try {
      const near = new NearShadeAgent();
      await near.initialize();
      console.log('NEAR Agent initialized');
      
      return { 
        success: true, 
        message: 'NEAR test requires wallet connection' 
      };
    } catch (error) {
      console.error('NEAR Test Failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Test Etherlink integration
  static async testEtherlink(provider: any) {
    try {
      const etherlink = new EtherlinkAdapter({
        network: 'testnet',
        rpcUrl: 'https://node.ghostnet.etherlink.com',
        chainId: 128123,
      });
      
      if (provider) {
        const signer = new ethers.providers.Web3Provider(provider).getSigner();
        etherlink.setSigner(signer);
      }
      
      // Get the current block number
      const blockNumber = await etherlink.getProvider().getBlockNumber();
      
      console.log('Etherlink Test:', {
        network: 'testnet',
        blockNumber,
        hasSigner: !!provider
      });
      
      return { 
        success: true, 
        blockNumber,
        hasSigner: !!provider
      };
    } catch (error) {
      console.error('Etherlink Test Failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Run all tests
  static async runAllTests(provider?: any) {
    console.log('=== Starting Blockchain Integration Tests ===');
    
    const results = {
      oneInch: await this.test1Inch(),
      stellar: await this.testStellar(),
      near: await this.testNear(),
      etherlink: await this.testEtherlink(provider),
    };
    
    console.log('=== Test Results ===');
    console.table({
      '1inch': { status: results.oneInch.success ? '✅ Passed' : '❌ Failed' },
      'Stellar': { status: results.stellar.success ? '✅ Passed' : '⚠️ Manual' },
      'NEAR': { status: results.near.success ? '✅ Passed' : '⚠️ Needs Wallet' },
      'Etherlink': { 
        status: results.etherlink.success ? '✅ Passed' : '❌ Failed',
        block: results.etherlink.success ? results.etherlink.blockNumber : 'N/A'
      },
    });
    
    return results;
  }
}

// Helper function to test token formatting
export function testTokenFormatting() {
  const tests = [
    { amount: '1000000', decimals: 6, expected: '1.0' },
    { amount: '1500000', decimals: 6, expected: '1.5' },
    { amount: '1000000000000000000', decimals: 18, expected: '1.0' },
  ];
  
  console.log('=== Token Formatting Tests ===');
  tests.forEach((test, i) => {
    const result = formatTokenAmount(test.amount, test.decimals);
    const passed = parseFloat(result) === parseFloat(test.expected);
    console.log(`Test ${i + 1}:`, {
      input: test.amount,
      expected: test.expected,
      result,
      status: passed ? '✅ Passed' : '❌ Failed'
    });
  });
}

// Export test utilities for browser console access
declare global {
  interface Window {
    BlockchainTestUtils: typeof BlockchainTestUtils;
    testTokenFormatting: typeof testTokenFormatting;
  }
}

if (typeof window !== 'undefined') {
  window.BlockchainTestUtils = BlockchainTestUtils;
  window.testTokenFormatting = testTokenFormatting;
}
