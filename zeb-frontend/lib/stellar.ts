import { 
  rpc, 
  Networks, 
  TransactionBuilder, 
  Contract, 
  nativeToScVal, 
  scValToNative,
  xdr
} from "stellar-sdk";

export const RPC_URL = "https://soroban-testnet.stellar.org";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const CONTRACT_ID = "CAG3L7MRMVAIITRM7JVJ2G3KE6C6WYS3MVAIGXV3DXKMR7UA667J7LBQ";

export const server = new rpc.Server(RPC_URL);
export const contract = new Contract(CONTRACT_ID);

/**
 * Converts a 64-character hex hash to a Soroban BytesN<32> ScVal.
 */
export function hexToBytes32(hex: string) {
  if (hex.length !== 64) {
    throw new Error("Hash must be exactly 64 hex characters (32 bytes)");
  }
  const bytes = Uint8Array.from(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return nativeToScVal(bytes, { type: "bytes" });
}

/**
 * Registers an artwork on the Soroban smart contract.
 */
export async function registerArtworkOnChain(
  title: string,
  hash: string,
  publicKey: string
) {
  try {
    const { signTransaction } = await import("@stellar/freighter-api");
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(
      contract.call(
        "register_artwork",
        nativeToScVal(title, { type: "string" }),
        hexToBytes32(hash),
        nativeToScVal(publicKey, { type: "address" }),
        nativeToScVal(Math.floor(Date.now() / 1000), { type: "u128" })
      )
    )
    .setTimeout(60)
    .build();

    const prepared = await server.prepareTransaction(tx);
    const signedTxEnvelope = await signTransaction(prepared.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE
    });

    const signedXdr = (signedTxEnvelope as any).signedXdr || (signedTxEnvelope as any).signedTxXdr;
    if (!signedXdr) throw new Error("Signing failed");

    const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const sendResult = await server.sendTransaction(signedTx);
    
    if (sendResult.status !== "PENDING") {
      throw new Error(`Transaction failed: ${sendResult.status}`);
    }

    return sendResult.hash;
  } catch (err) {
    console.error("On-chain registration error:", err);
    throw err;
  }
}

/**
 * Lists an artwork for fixed-price sale on-chain.
 */
export async function listForSaleOnChain(
  hash: string,
  seller: string,
  price: number
) {
  try {
    const { signTransaction } = await import("@stellar/freighter-api");
    const account = await server.getAccount(seller);

    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(
        contract.call(
          "list_for_sale",
          hexToBytes32(hash),
          nativeToScVal(seller, { type: "address" }),
          nativeToScVal(BigInt(Math.round(price * 10000000)), { type: "u128" }),
          nativeToScVal(Math.floor(Date.now() / 1000), { type: "u128" })
        )
    )
    .setTimeout(60)
    .build();

    const prepared = await server.prepareTransaction(tx);
    const signedTxEnvelope = await signTransaction(prepared.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE
    });

    const signedXdr = (signedTxEnvelope as any).signedXdr || (signedTxEnvelope as any).signedTxXdr;
    const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const sendResult = await server.sendTransaction(signedTx);

    return sendResult.hash;
  } catch (err) {
    console.error("On-chain listing error:", err);
    throw err;
  }
}
