import { NextResponse } from 'next/server';
import { OneInchAdapter } from '../../../lib/blockchain/1inch/adapter';

export async function POST(request: Request) {
  try {
    const { 
      fromToken, 
      toToken, 
      amount, 
      fromAddress, 
      chainId = 1, 
      slippage = 1 
    } = await request.json();

    const oneInch = new OneInchAdapter(chainId);
    const tx = await oneInch.buildSwapTx({
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      amount,
      fromAddress,
      slippage,
    });

    return NextResponse.json({ tx });
  } catch (error) {
    console.error('Swap error:', error);
    return NextResponse.json(
      { error: 'Failed to build swap transaction' },
      { status: 500 }
    );
  }
}
