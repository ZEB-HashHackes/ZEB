'use client';

import {
  rpc,
  TransactionBuilder,
  Contract,
  nativeToScVal,
  Address,
} from 'stellar-sdk';

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org';

export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID ||
  'CADX4ROQ7XXRDRSEVIFCCEW3U52WDUGN4QIPT6YHFY2OXR3WNBKTGQXO';

export const server = new rpc.Server(RPC_URL);
export const contract = new Contract(CONTRACT_ID);

/**
 * Converts a 64-character hex hash to BytesN<32>
 */
export function hexToBytes32(hex: string) {
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error('Hash must be a valid 64-character hex string');
  }

  const bytes = Uint8Array.from(
    hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );

  if (bytes.length !== 32) throw new Error('Hash must be exactly 32 bytes');

  return nativeToScVal(bytes, { type: 'bytes' } as any);
}

/**
 * Poll transaction until SUCCESS or FAILED
 */
export async function pollTransaction(hash: string) {
  const start = Date.now();
  const timeout = 30000;

  while (true) {
    try {
      const status = await server.getTransaction(hash);
      console.log('TX STATUS:', status.status);

      if (status.status === 'SUCCESS') {
        console.log('✅ TX SUCCESS:', hash);
        return status;
      }

    if (status.status === 'FAILED') {
      console.error('❌ TX FAILED:', hash);
      console.error('- Results:', (status as any).results);
      console.error('- Events:', (status as any).events || 'N/A');
      if ((status as any).results?.[0]?.exception) {
        console.error('- Exception:', (status as any).results[0].exception);
      }
      if ((status as any).results?.[0]?.ret) {
        console.error('- Return value:', (status as any).results[0].ret);
      }
      throw new Error(`Transaction FAILED: ${hash}. "Bad union switch: 4" usually means contract error (wrong ID/hash/param). Check simulation first.`);
    }

      if (Date.now() - start > timeout) {
        throw new Error(`Transaction timeout: ${hash}`);
      }

      await new Promise((r) => setTimeout(r, 2000));
    } catch (err: any) {
      console.error('Poll error:', err.message);
      throw err;
    }
  }
}

/**
 * COMMON: prepare → sign → send → confirm
 */
async function signAndSend(tx: any, networkPassphrase: string, opName: string) {
  const { signTransaction } = await import('@stellar/freighter-api');

  console.log(`🧪 SIMULATING ${opName}...`);
  
  // SIMULATION FIRST - catch contract errors BEFORE Freighter popup
  try {
    const simResult = await server.simulateTransaction(tx);
    console.log(`${opName} SIMULATION:`, simResult);
    
    const simRes = (simResult as any).results?.[0];
    if (!simRes) {
      throw new Error(`No simulation result for ${opName}`);
    }
    if (simRes.exception) {
      throw new Error(`Simulation FAILED (${opName}): ${simRes.exception}. Check CONTRACT_ID/hash/title/timestamp.`);
    }
    if (!simRes.success) {
      throw new Error(`Simulation not successful for ${opName}:`, simRes);
    }
    console.log(`✅ ${opName} simulation passed`);
  } catch (simErr: any) {
    console.error(`❌ Simulation error for ${opName}:`, simErr);
    throw simErr;
  }

  tx = await server.prepareTransaction(tx);

  let signedTxEnvelope;
  try {
    signedTxEnvelope = await signTransaction(tx.toXDR(), {
      networkPassphrase,
    });
  } catch {
    throw new Error('User rejected the transaction in Freighter');
  }

  const signedXdr =
    (signedTxEnvelope as any).signedXdr ||
    (signedTxEnvelope as any).signedTxXdr;

  if (!signedXdr) throw new Error('Signing failed');

  const signedTx = TransactionBuilder.fromXDR(
    signedXdr,
    networkPassphrase
  );

  const sendResult = await server.sendTransaction(signedTx);

  if (sendResult.status !== 'PENDING') {
    throw new Error(`Transaction failed to submit: ${sendResult.status}`);
  }

  await pollTransaction(sendResult.hash);

  return sendResult.hash;
}

/**
 * Registers artwork
 */
export async function registerArtworkOnChain(
  title: string,
  hash: string,
  publicKey: string
) {
  const { getNetworkDetails } = await import('@stellar/freighter-api');
  const network = await getNetworkDetails();

  if (network.network.toUpperCase() !== 'TESTNET') {
    throw new Error(`Switch Freighter to Testnet. Currently: ${network.network}`);
  }

  const account = await server.getAccount(publicKey);
  const ts = BigInt(Math.floor(Date.now() / 1000));

  // Debug log parameters
  console.log({
    title,
    hash,
    publicKey,
    timestamp: ts.toString(),
  });

  let tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: network.networkPassphrase,
  })
    .addOperation(
      contract.call(
        'register_artwork',
        nativeToScVal(title, { type: 'string' }),
        hexToBytes32(hash),
        Address.fromString(publicKey).toScVal(),
        nativeToScVal(ts, { type: 'u128' })
      )
    )
    .setTimeout(60)
    .build();

  console.log('CONTRACT_ID used:', CONTRACT_ID);
  console.log('Hash validated:', hash);

  return signAndSend(tx, network.networkPassphrase, 'register_artwork');
}

/**
 * List for fixed-price sale
 */
export async function listForSaleOnChain(
  hash: string,
  seller: string,
  price: number
) {
  const { getNetworkDetails } = await import('@stellar/freighter-api');
  const network = await getNetworkDetails();

  if (network.network.toUpperCase() !== 'TESTNET') {
    throw new Error(`Switch Freighter to Testnet. Currently: ${network.network}`);
  }

  const account = await server.getAccount(seller);
  const ts = BigInt(Math.floor(Date.now() / 1000));
  const priceBigInt = BigInt(Math.round(price * 1e7));

  console.log({
    hash,
    seller,
    price: priceBigInt.toString(),
    timestamp: ts.toString(),
  });

  let tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: network.networkPassphrase,
  })
    .addOperation(
      contract.call(
        'list_for_sale',
        hexToBytes32(hash),
        Address.fromString(seller).toScVal(),
        nativeToScVal(priceBigInt, { type: 'u128' }),
        nativeToScVal(ts, { type: 'u128' })
      )
    )
    .setTimeout(60)
    .build();

  return signAndSend(tx, network.networkPassphrase, 'list_for_sale');
}

/**
 * Create auction
 */
export async function createAuctionOnChain(
  hash: string,
  seller: string,
  endTime: number
) {
  const { getNetworkDetails } = await import('@stellar/freighter-api');
  const network = await getNetworkDetails();

  if (network.network.toUpperCase() !== 'TESTNET') {
    throw new Error(`Switch Freighter to Testnet. Currently: ${network.network}`);
  }

  const account = await server.getAccount(seller);
  const ts = BigInt(Math.floor(Date.now() / 1000));
  const endTs = BigInt(endTime);

  console.log({
    hash,
    seller,
    startTimestamp: ts.toString(),
    endTimestamp: endTs.toString(),
  });

  let tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: network.networkPassphrase,
  })
    .addOperation(
      contract.call(
        'create_auction',
        hexToBytes32(hash),
        Address.fromString(seller).toScVal(),
        nativeToScVal(ts, { type: 'u128' }),
        nativeToScVal(endTs, { type: 'u128' })
      )
    )
    .setTimeout(60)
    .build();

  return signAndSend(tx, network.networkPassphrase, 'create_auction');
}

/**
 * Placeholder queries
 */
export async function getOwner(hash: string): Promise<string> {
  return 'placeholder-owner';
}

export async function getCreator(hash: string): Promise<string> {
  return 'placeholder-creator';
}

export async function getHighestBid(hash: string): Promise<number> {
  return 0;
}