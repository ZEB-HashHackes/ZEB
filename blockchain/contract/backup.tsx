import { useState } from "react";
import {
  rpc,
  Networks,
  TransactionBuilder,
  Contract,
  nativeToScVal,
  scValToNative,
  xdr
} from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const CONTRACT_ID =
  "CBKPCUAV43WVJVLGIXTI2VEANBRLMFJLWAORKPPWKF6KD6WRSJOXU4MQ";

export default function App() {
  const [publicKey, setPublicKey] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [result, setResult] = useState("");

  const server = new rpc.Server(RPC_URL);
  const contract = new Contract(CONTRACT_ID);

// connecting to wallet
  async function connectWallet() {
    try {
      const {
        isConnected,
        requestAccess,
        getAddress,
      } = await import("@stellar/freighter-api");

      const connectedStatus = await isConnected();
      if (!connectedStatus.isConnected) {
        console.error("Freighter not installed or not detected!");
        return;
      }

      const access = await requestAccess();
      if (access.error) {
        console.error("Freighter access denied:", access.error);
        return;
      }

      const publicKeyResult = await getAddress();
      if (publicKeyResult.error) {
        console.error("Failed to get public key:", publicKeyResult.error);
        return;
      }

      setPublicKey(publicKeyResult.address);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  }

// converting hax to ByteN<32>
  function hexToBytesN(hex: string) {
    if (hex.length !== 64) {
      throw new Error("Hash must be exactly 64 hex characters (32 bytes)");
    }

    const bytes = Uint8Array.from(
      hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    return nativeToScVal(bytes, { type: "bytes" });
  }

  // artwork_exists contract
  async function checkArtworkExists() {
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "200000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(
      contract.call("artwork_exists", hexToBytesN(hashInput))
    )
    .setTimeout(30)
    .build();

    const simulated = await server.simulateTransaction(tx);

    if ("error" in simulated) {
      throw new Error(simulated.error);
    }

    if (!simulated.result || !simulated.result.retval) {
      throw new Error("No return value from simulation");
    }

    const native = scValToNative(simulated.result.retval);

    setResult("Exists: " + native);
  }

  async function registerArtwork() {
    if (!publicKey) return setResult("Connect wallet first");

    try {
      const account = await server.getAccount(publicKey);

      const tx = new TransactionBuilder(account, {
        fee: "100000", 
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(
        contract.call(
          "register_artwork",
          hexToBytesN(hashInput),
          nativeToScVal(publicKey, { type: "address" }),
          nativeToScVal(Math.floor(Date.now() / 1000), { type: "u64" }) 
        )
      )
      .setTimeout(1000)
      .build();

      const prepared = await server.prepareTransaction(tx);

      const { signTransaction } = await import("@stellar/freighter-api");
      const signedTxEnvelope = await signTransaction(prepared.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE
      });

      
      const signedXdr =
        (signedTxEnvelope as any).signedXdr || (signedTxEnvelope as any).signedTxXdr;

      if (!signedXdr) throw new Error("Signing failed or returned undefined");

      
      const signedTx = TransactionBuilder.fromXDR(
        signedXdr,
        NETWORK_PASSPHRASE
      );

      
      const sendResult = await server.sendTransaction(signedTx);
      setResult("Register TX Hash: " + sendResult.hash);
      console.log("Transaction Error:", JSON.stringify(sendResult.errorResult, null, 2));

      const txStatus = await server.getTransaction(sendResult.hash);
      console.log("TX Status:", txStatus);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // transfer_ownership
  async function transferOwnership(newOwner: string) {
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "100000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(
      contract.call(
        "transfer_ownership",
          hexToBytesN(hashInput),
          nativeToScVal(publicKey, { type: "address" }),
          nativeToScVal(newOwner, { type: "address" })
        )
      )
      .setTimeout(30)
      .build();

    const prepared = await server.prepareTransaction(tx);

    const { signTransaction } = await import("@stellar/freighter-api");

    const { signedTxXdr } = await signTransaction(
      prepared.toXDR(),
      { networkPassphrase: NETWORK_PASSPHRASE }
    );

    const signedTx = TransactionBuilder.fromXDR(
      signedTxXdr,
      NETWORK_PASSPHRASE
    );

    const send = await server.sendTransaction(signedTx);

    setResult("Transfer TX Hash: " + send.hash);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Zeb Contract Tester</h2>

      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Wallet: {publicKey}</p>

      <input
        placeholder="Artwork hash (64 hex chars)"
        value={hashInput}
        onChange={(e) => setHashInput(e.target.value)}
        style={{ width: "400px" }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={checkArtworkExists}>Check Exists</button>
        <button onClick={registerArtwork}>Register Artwork</button>
      </div>

      <p>Result: {result}</p>
    </div>
  );
}
