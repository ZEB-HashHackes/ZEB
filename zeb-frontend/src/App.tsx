import { useState } from "react";
import {
  rpc,
  Networks,
  TransactionBuilder,
  Contract,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;

const CONTRACT_ID =
  "CBKPCUAV43WVJVLGIXTI2VEANBRLMFJLWAORKPPWKF6KD6WRSJOXU4MQ";

export default function App() {
  const [publicKey, setPublicKey] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [buyer, setBuyer] = useState("");
  const [offerAmount, setOfferAmount] = useState("");
  const [result, setResult] = useState("");

  const server = new rpc.Server(RPC_URL);
  const contract = new Contract(CONTRACT_ID);

  // Wallet connection
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

  // Convert hex to BytesN<32>
  function hexToBytesN(hex: string) {
    if (hex.length !== 64) {
      throw new Error("Hash must be exactly 64 hex characters (32 bytes)");
    }

    const bytes = Uint8Array.from(
      hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );

    return nativeToScVal(bytes, { type: "bytes" });
  }

  // Check if artwork exists
  async function checkArtworkExists() {
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "200000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call("artwork_exists", hexToBytesN(hashInput)))
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

  // 
  // Register artwork
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
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      const signedXdr =
        (signedTxEnvelope as any).signedXdr || (signedTxEnvelope as any).signedTxXdr;

      if (!signedXdr) throw new Error("Signing failed or returned undefined");

      const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

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

  async function transferOwnership() {
    if (!publicKey) return setResult("Connect wallet first");
    if (!newOwner) return setResult("Enter new owner address");

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
      .setTimeout(1000)
      .build();

    const prepared = await server.prepareTransaction(tx);

    const { signTransaction } = await import("@stellar/freighter-api");
    const { signedTxXdr } = await signTransaction(prepared.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
    const send = await server.sendTransaction(signedTx);

    setResult("Transfer TX Hash: " + send.hash);
  }

  function isSimulateSuccess(
    sim: any
  ): sim is { result: { retval: any } } {
    return sim && "result" in sim && sim.result !== undefined;
  }

async function getCreator() {
  try {
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "200000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call("get_creator", hexToBytesN(hashInput)))
      .setTimeout(1000)
      .build();

    const simulated = await server.simulateTransaction(tx);

    
    if ("error" in simulated) {
      throw new Error(simulated.error);
    }
    if (!isSimulateSuccess(simulated)) {
      throw new Error("Simulation failed or no result returned");
    }

    const creator = scValToNative(simulated.result.retval);
    setResult("Creator: " + creator);
  } catch (err: any) {
    console.error(err);
    setResult("Error: " + (err.message || err));
  }
}


async function getOwner() {
  try {
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "200000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call("get_owner", hexToBytesN(hashInput)))
      .setTimeout(30)
      .build();

    const simulated = await server.simulateTransaction(tx);

    if ("error" in simulated) {
      throw new Error(simulated.error);
    }
    if (!isSimulateSuccess(simulated)) {
      throw new Error("Simulation failed or no result returned");
    }

    const owner = scValToNative(simulated.result.retval);
    setResult("Owner: " + owner);
  } catch (err: any) {
    console.error(err);
    setResult("Error: " + (err.message || err));
  }
}


  async function makeOffer() {
    if (!buyer || !offerAmount) return setResult("Enter buyer and amount");
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "200000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "make_offer",
          hexToBytesN(hashInput),
          nativeToScVal(buyer, { type: "address" }),
          nativeToScVal(parseInt(offerAmount), { type: "i128" })
        )
      )
      .setTimeout(30)
      .build();

    const prepared = await server.prepareTransaction(tx);
    const { signTransaction } = await import("@stellar/freighter-api");
    const signedTxEnvelope = await signTransaction(prepared.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const signedXdr =
      (signedTxEnvelope as any).signedXdr || (signedTxEnvelope as any).signedTxXdr;

    const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const sendResult = await server.sendTransaction(signedTx);

    setResult("Offer TX Hash: " + sendResult.hash);
  }


  async function acceptOffer() {
    if (!buyer) return setResult("Enter buyer address");
    const account = await server.getAccount(publicKey);

    const tx = new TransactionBuilder(account, {
      fee: "200000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "accept_offer",
          hexToBytesN(hashInput),
          nativeToScVal(publicKey, { type: "address" }),
          nativeToScVal(buyer, { type: "address" })
        )
      )
      .setTimeout(30)
      .build();

    const prepared = await server.prepareTransaction(tx);
    const { signTransaction } = await import("@stellar/freighter-api");
    const signedTxEnvelope = await signTransaction(prepared.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const signedXdr =
      (signedTxEnvelope as any).signedXdr || (signedTxEnvelope as any).signedTxXdr;

    const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
    const sendResult = await server.sendTransaction(signedTx);

    setResult("Accept Offer TX Hash: " + sendResult.hash);
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
        <button onClick={getCreator}>Get Creator</button>
        <button onClick={getOwner}>Get Owner</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="New Owner Address"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          style={{ width: "400px" }}
        />
        <button onClick={transferOwnership}>Transfer Ownership</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Buyer Address"
          value={buyer}
          onChange={(e) => setBuyer(e.target.value)}
          style={{ width: "400px" }}
        />
        <input
          placeholder="Offer Amount"
          value={offerAmount}
          onChange={(e) => setOfferAmount(e.target.value)}
          style={{ width: "200px" }}
        />
        <button onClick={makeOffer}>Make Offer</button>
        <button onClick={acceptOffer}>Accept Offer</button>
      </div>

      <p>Result: {result}</p>
    </div>
  );
}
