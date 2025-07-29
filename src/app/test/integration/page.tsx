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
  
  const { account, isConnected, connect, disconnect } = useEtherlink();
  
  const addLog = (message: string) => {
    setTestLog(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };
  
  const runTests = async () => {
    if (!window.ethereum) {
      addLog('Error: MetaMask not detected');
      return;
    }
    
    setIsTesting(true);
    setTestLog([]);
    addLog('Starting blockchain integration tests...');
    
    try {
      // Run all tests
      const results = await BlockchainTestUtils.runAllTests(window.ethereum);
      setTestResults(results);
      
      // Log results
      Object.entries(results).forEach(([name, result]) => {
        if (result.success) {
          addLog(`✅ ${name} test passed`);
        } else {
          const errorMsg = result.error || 'Unknown error';
          addLog(`❌ ${name} test failed: ${errorMsg}`);
        }
      });
      
      addLog('All tests completed');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Test error: ${errorMessage}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  // Run tests when component mounts
  useEffect(() => {
    if (isConnected) {
      runTests();
    }
  }, [isConnected]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Blockchain Integration Tests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Wallet Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {isConnected && account && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Account:</span>
                    <span className="font-mono text-sm">
                      {`${account.substring(0, 6)}...${account.substring(38)}`}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" onClick={disconnect} className="w-full">
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              )}
              
              {!isConnected && (
                <Button onClick={connect} className="w-full">
                  Connect Wallet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Test Controls</CardTitle>
            <Button 
              onClick={runTests} 
              disabled={isTesting || !isConnected}
              size="sm"
            >
              {isTesting ? 'Testing...' : 'Run Tests'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">1inch</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  testResults.oneInch?.success ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {testResults.oneInch ? (testResults.oneInch.success ? '✅ Passed' : '❌ Failed') : 'Not run'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stellar</span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                  {testResults.stellar ? '⚠️ Manual' : 'Not run'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">NEAR</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  testResults.near?.success ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {testResults.near ? (testResults.near.success ? '✅ Ready' : '⚠️ Needs Wallet') : 'Not run'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Etherlink</span>
                <span className={`px-2 py-1 text-xs rounded ${
                  testResults.etherlink?.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {testResults.etherlink ? (testResults.etherlink.success ? '✅ Connected' : '❌ Failed') : 'Not run'}
                </span>
              </div>
            </div>
            
            {testResults.etherlink?.blockNumber && (
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                <div>Block: {testResults.etherlink.blockNumber}</div>
                <div>Has Signer: {testResults.etherlink.hasSigner ? 'Yes' : 'No'}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="etherlink">Etherlink</TabsTrigger>
          <TabsTrigger value="1inch">1inch</TabsTrigger>
          <TabsTrigger value="stellar">Stellar</TabsTrigger>
          <TabsTrigger value="near">NEAR</TabsTrigger>
        </TabsList>

        <TabsContent value="etherlink">
          <Card>
            <CardHeader>
              <CardTitle>Etherlink Swap</CardTitle>
            </CardHeader>
            <CardContent>
              <EtherlinkSwap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="1inch">
          <Card>
            <CardHeader>
              <CardTitle>1inch Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center text-gray-500">
                1inch integration test coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stellar">
          <Card>
            <CardHeader>
              <CardTitle>Stellar Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center text-gray-500">
                Stellar integration test coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="near">
          <Card>
            <CardHeader>
              <CardTitle>NEAR Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center text-gray-500">
                NEAR integration test coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Connect your wallet using the button above</li>
                <li>Click "Run Tests" to verify all integrations</li>
                <li>Switch to the Etherlink tab to test token swaps</li>
                <li>Select tokens and enter an amount to get a quote</li>
                <li>Review the swap details and confirm the transaction</li>
                <li>Check your wallet for the transaction confirmation</li>
              </ol>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-medium text-blue-800 mb-2">Note:</h3>
                <p className="text-blue-700 text-sm">
                  This is a test environment. Make sure you're connected to the Etherlink testnet
                  and using test tokens. Real assets are not used in this environment.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Console Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-black text-green-400 font-mono text-xs p-4 rounded overflow-auto">
                {testLog.length > 0 ? (
                  testLog.map((log, i) => (
                    <div key={i} className="whitespace-nowrap">{log}</div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No logs yet. Run tests to see output.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">1inch Integration</h3>
                <div className="text-sm text-gray-600">
                  {testResults.oneInch ? (
                    testResults.oneInch.success ? (
                      <div className="text-green-600">✅ 1inch API is working correctly</div>
                    ) : (
                      <div className="text-red-600">❌ {testResults.oneInch.error || 'Test failed'}</div>
                    )
                  ) : (
                    <div className="text-gray-500">Test not run yet</div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Etherlink Integration</h3>
                <div className="text-sm text-gray-600">
                  {testResults.etherlink ? (
                    testResults.etherlink.success ? (
                      <div>
                        <div className="text-green-600">✅ Connected to Etherlink testnet</div>
                        <div className="mt-1 text-xs">Block: {testResults.etherlink.blockNumber}</div>
                        <div className="text-xs">Signer: {testResults.etherlink.hasSigner ? 'Connected' : 'Not connected'}</div>
                      </div>
                    ) : (
                      <div className="text-red-600">❌ {testResults.etherlink.error || 'Connection failed'}</div>
                    )
                  ) : (
                    <div className="text-gray-500">Test not run yet</div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">NEAR Integration</h3>
                <div className="text-sm text-gray-600">
                  {testResults.near ? (
                    testResults.near.success ? (
                      <div className="text-green-600">✅ NEAR agent initialized</div>
                    ) : (
                      <div className="text-yellow-600">⚠️ {testResults.near.error || 'Wallet connection needed'}</div>
                    )
                  ) : (
                    <div className="text-gray-500">Test not run yet</div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-medium mb-2">Stellar Integration</h3>
                <div className="text-sm text-gray-600">
                  {testResults.stellar ? (
                    <div className="text-yellow-600">⚠️ Manual testing required</div>
                  ) : (
                    <div className="text-gray-500">Test not run yet</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
