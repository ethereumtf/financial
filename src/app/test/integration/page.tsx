'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EtherlinkSwap } from '@/components/swap/EtherlinkSwap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEtherlink } from '@/hooks/useEtherlink';
import { ethers } from 'ethers';
import { BlockchainTestUtils } from '@/lib/test/blockchain';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

type TestResult = {
  success: boolean;
  message?: string;
  error?: string;
  [key: string]: any;
};

export default function IntegrationTestPage() {
  const [activeTab, setActiveTab] = useState('etherlink');
  const [testResults, setTestResults] = useState<{[key: string]: TestResult}>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize Etherlink hook
  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    account,
    chainId,
    error,
    adapter
  } = useEtherlink();

  // Log connection status changes
  useEffect(() => {
    if (isConnected && account) {
      addLog(`Connected to account: ${account}`);
      addLog(`Chain ID: ${chainId}`);
    } else if (error) {
      addLog(`Connection error: ${error.message}`);
    }
  }, [isConnected, account, chainId, error]);

  // Check if Web3 provider is available
  useEffect(() => {
    const checkWeb3 = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Connect to the wallet
          await connect();
          setIsInitialized(true);
        } catch (err) {
          console.error('Error initializing Web3:', err);
          addLog(`Web3 initialization error: ${err instanceof Error ? err.message : String(err)}`);
        }
      } else {
        addLog('No Web3 provider detected. Please install MetaMask or another Web3 wallet.');
      }
    };

    checkWeb3();

    // Handle account/chain changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        addLog('Please connect to MetaMask.');
      } else {
        addLog(`Account changed: ${accounts[0]}`);
      }
    };

    const handleChainChanged = (chainId: string) => {
      addLog(`Chain changed to: ${chainId}`);
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connect]);

  const addLog = (message: string) => {
    console.log(message);
    setTestLog(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const runTests = async () => {
    if (!adapter) {
      addLog('Error: Etherlink adapter not initialized');
      return;
    }

    setIsTesting(true);
    setTestResults({});
    setTestLog([]);

    try {
      // Run connection tests
      await testConnection();
      
      // Run token tests if connected
      if (isConnected && account) {
        await testTokenOperations();
      }
      
      addLog('All tests completed!');
    } catch (err) {
      addLog(`Test error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testConnection = async () => {
    const testId = 'connection';
    
    try {
      addLog('Testing connection to Etherlink network...');
      
      if (!isConnected) {
        addLog('Not connected to wallet. Connecting...');
        await connect();
      }
      
      if (!adapter) {
        throw new Error('Etherlink adapter not initialized');
      }
      
      const network = await adapter.getNetwork();
      addLog(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          success: true,
          message: 'Successfully connected to Etherlink network',
          network
        }
      }));
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      addLog(`Connection test failed: ${error.message}`);
      
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          success: false,
          error: error.message,
          message: 'Failed to connect to Etherlink network'
        }
      }));
      
      throw error;
    }
  };

  const testTokenOperations = async () => {
    if (!adapter || !account) return;
    
    // Test getting native token balance
    await testGetBalance(ethers.ZeroAddress, 'XTEZ');
    
    // Test getting token balance (example token address)
    const testTokenAddress = '0x1234567890123456789012345678901234567890';
    await testGetBalance(testTokenAddress, 'TEST');
  };

  const testGetBalance = async (tokenAddress: string, symbol: string) => {
    const testId = `balance-${tokenAddress}`;
    
    try {
      if (!adapter || !account) {
        throw new Error('Adapter or account not available');
      }
      
      addLog(`Getting ${symbol} balance for ${account}...`);
      const balance = await adapter.getTokenBalance(tokenAddress, account);
      
      addLog(`${symbol} balance: ${ethers.formatEther(balance)}`);
      
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          success: true,
          message: `Successfully retrieved ${symbol} balance`,
          balance: balance.toString(),
          formatted: ethers.formatEther(balance)
        }
      }));
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      addLog(`Failed to get ${symbol} balance: ${error.message}`);
      
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          success: false,
          error: error.message,
          message: `Failed to get ${symbol} balance`
        }
      }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Blockchain Integration Tests</h1>
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            onClick={connect} 
            disabled={isConnecting || isConnected}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Connect Wallet'}
          </Button>
          
          {isConnected && (
            <Button 
              onClick={disconnect} 
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Disconnect
            </Button>
          )}
          
          <Button 
            onClick={runTests} 
            disabled={isTesting || !isConnected}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isTesting ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>
        
        {account && (
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Chain ID:</strong> {chainId?.toString() || 'N/A'}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <p><strong>Error:</strong> {error.message}</p>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="etherlink">Etherlink Swap</TabsTrigger>
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="etherlink" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Etherlink Token Swap</CardTitle>
            </CardHeader>
            <CardContent>
              {isInitialized ? (
                <EtherlinkSwap />
              ) : (
                <div className="p-4 text-center">
                  <p>Initializing Web3 provider...</p>
                  {!window.ethereum && (
                    <p className="text-sm text-red-600 mt-2">
                      No Web3 provider detected. Please install MetaMask or another Web3 wallet.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test-results" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Test Logs:</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
                  {testLog.length > 0 ? (
                    testLog.map((log, index) => (
                      <div key={index} className="mb-1 border-b border-gray-800 pb-1">
                        {log}
                      </div>
                    ))
                  ) : (
                    <p>No logs available. Run tests to see logs.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Test Results:</h3>
                {Object.entries(testResults).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(testResults).map(([testId, result]) => (
                      <div 
                        key={testId} 
                        className={`p-3 rounded ${
                          result.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <div className="font-medium">
                          {testId}: {result.success ? '✅' : '❌'} {result.message}
                        </div>
                        {!result.success && result.error && (
                          <div className="mt-1 text-sm">Error: {result.error}</div>
                        )}
                        {result.details && (
                          <div className="mt-2 text-sm bg-white bg-opacity-50 p-2 rounded">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No test results yet. Run tests to see results.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
