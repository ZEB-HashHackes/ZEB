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
  "CAG3L7MRMVAIITRM7JVJ2G3KE6C6WYS3MVAIGXV3DXKMR7UA667J7LBQ";

export default function App() {
  const [publicKey, setPublicKey] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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

  // Helper for simulation success check
  function isSimulateSuccess(sim: any): sim is { result: { retval: any } } {
    return sim && "result" in sim && sim.result !== undefined;
  }

  // Check if artwork exists
  async function checkArtworkExists() {
    try {
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
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Register artwork
  async function registerArtwork() {
    if (!publicKey) return setResult("Connect wallet first");
    if (!titleInput) return setResult("Enter artwork title");
    if (!hashInput) return setResult("Enter artwork hash");

    try {
      const account = await server.getAccount(publicKey);
      const timestamp = Math.floor(Date.now() / 1000);

      const tx = new TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            "register_artwork",
            nativeToScVal(titleInput, { type: "string" }),
            hexToBytesN(hashInput),
            nativeToScVal(publicKey, { type: "address" }),
            nativeToScVal(timestamp, { type: "u128" })
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
      console.log("Transaction sent:", sendResult.hash);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Transfer ownership
  async function transferOwnership() {
    if (!publicKey) return setResult("Connect wallet first");
    if (!newOwner) return setResult("Enter new owner address");
    if (!hashInput) return setResult("Enter artwork hash");

    try {
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
      const signedTxEnvelope = await signTransaction(prepared.toXDR(), {
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      const signedXdr =
        (signedTxEnvelope as any).signedXdr || (signedTxEnvelope as any).signedTxXdr;

      if (!signedXdr) throw new Error("Signing failed");

      const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      const sendResult = await server.sendTransaction(signedTx);

      setResult("Transfer TX Hash: " + sendResult.hash);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Get creator
  async function getCreator() {
    try {
      if (!hashInput) return setResult("Enter artwork hash");

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

  // Get owner
  async function getOwner() {
    try {
      if (!hashInput) return setResult("Enter artwork hash");

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

  // Get highest bid
  async function getHighestBid() {
    try {
      if (!hashInput) return setResult("Enter artwork hash");

      const account = await server.getAccount(publicKey);

      const tx = new TransactionBuilder(account, {
        fee: "200000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call("get_highest_bid", hexToBytesN(hashInput)))
        .setTimeout(30)
        .build();

      const simulated = await server.simulateTransaction(tx);

      if ("error" in simulated) {
        throw new Error(simulated.error);
      }
      if (!isSimulateSuccess(simulated)) {
        throw new Error("Simulation failed or no result returned");
      }

      const bid = scValToNative(simulated.result.retval);
      setResult("Highest Bid: " + bid);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Get highest bidder
  async function getHighestBidder() {
    try {
      if (!hashInput) return setResult("Enter artwork hash");

      const account = await server.getAccount(publicKey);

      const tx = new TransactionBuilder(account, {
        fee: "200000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call("get_highest_bidder", hexToBytesN(hashInput)))
        .setTimeout(30)
        .build();

      const simulated = await server.simulateTransaction(tx);

      if ("error" in simulated) {
        throw new Error(simulated.error);
      }
      if (!isSimulateSuccess(simulated)) {
        throw new Error("Simulation failed or no result returned");
      }

      const bidder = scValToNative(simulated.result.retval);
      setResult("Highest Bidder: " + (bidder || "None"));
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Check if auction exists
  async function checkAuctionExists() {
    try {
      if (!hashInput) return setResult("Enter artwork hash");

      const account = await server.getAccount(publicKey);

      const tx = new TransactionBuilder(account, {
        fee: "200000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call("auction_exists", hexToBytesN(hashInput)))
        .setTimeout(30)
        .build();

      const simulated = await server.simulateTransaction(tx);

      if ("error" in simulated) {
        throw new Error(simulated.error);
      }
      if (!isSimulateSuccess(simulated)) {
        throw new Error("Simulation failed or no result returned");
      }

      const exists = scValToNative(simulated.result.retval);
      setResult("Auction Exists: " + exists);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Create auction
  async function createAuction() {
    if (!publicKey) return setResult("Connect wallet first");
    if (!hashInput) return setResult("Enter artwork hash");
    if (!startTime) return setResult("Enter start time");
    if (!endTime) return setResult("Enter end time");

    try {
      const account = await server.getAccount(publicKey);

      const tx = new TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            "create_auction",
            hexToBytesN(hashInput),
            nativeToScVal(publicKey, { type: "address" }),
            nativeToScVal(parseInt(startTime), { type: "u128" }),
            nativeToScVal(parseInt(endTime), { type: "u128" })
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

      if (!signedXdr) throw new Error("Signing failed");

      const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      const sendResult = await server.sendTransaction(signedTx);

      setResult("Create Auction TX Hash: " + sendResult.hash);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Place bid
  async function placeBid() {
    if (!publicKey) return setResult("Connect wallet first");
    if (!hashInput) return setResult("Enter artwork hash");
    if (!bidAmount) return setResult("Enter bid amount");

    try {
      const account = await server.getAccount(publicKey);
      const timestamp = Math.floor(Date.now() / 1000);

      const tx = new TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            "place_bid",
            hexToBytesN(hashInput),
            nativeToScVal(publicKey, { type: "address" }),
            nativeToScVal(parseInt(bidAmount), { type: "u128" }),
            nativeToScVal(timestamp, { type: "u128" })
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

      if (!signedXdr) throw new Error("Signing failed");

      const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      const sendResult = await server.sendTransaction(signedTx);

      setResult("Place Bid TX Hash: " + sendResult.hash);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  // Close auction
  async function closeAuction() {
    if (!publicKey) return setResult("Connect wallet first");
    if (!hashInput) return setResult("Enter artwork hash");

    try {
      const account = await server.getAccount(publicKey);
      const currentTime = Math.floor(Date.now() / 1000);

      const tx = new TransactionBuilder(account, {
        fee: "100000",
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            "close_auction",
            hexToBytesN(hashInput),
            nativeToScVal(publicKey, { type: "address" }),
            nativeToScVal(currentTime, { type: "u128" })
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

      if (!signedXdr) throw new Error("Signing failed");

      const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
      const sendResult = await server.sendTransaction(signedTx);

      setResult("Close Auction TX Hash: " + sendResult.hash);
    } catch (err: any) {
      console.error(err);
      setResult("Error: " + (err.message || err));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>Zeb Contract Tester</h2>

      <button onClick={connectWallet}>Connect Wallet</button>
      <p>
        <strong>Wallet:</strong> {publicKey || "Not connected"}
      </p>

      <hr />

      <h3>Artwork Information</h3>
      <div>
        <input
          placeholder="Artwork Title"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          style={{ width: "400px", marginRight: "10px" }}
        />
        <input
          placeholder="Artwork Hash (64 hex chars)"
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          style={{ width: "400px" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={registerArtwork}>Register Artwork</button>
        <button onClick={checkArtworkExists}>Check Exists</button>
        <button onClick={getCreator}>Get Creator</button>
        <button onClick={getOwner}>Get Owner</button>
      </div>

      <hr />

      <h3>Ownership Management</h3>
      <div>
        <input
          placeholder="New Owner Address"
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
          style={{ width: "400px" }}
        />
        <button onClick={transferOwnership}>Transfer Ownership</button>
      </div>

      <hr />

      <h3>Auction Management</h3>
      <div>
        <button onClick={checkAuctionExists}>Check Auction Exists</button>
        <button onClick={getHighestBid}>Get Highest Bid</button>
        <button onClick={getHighestBidder}>Get Highest Bidder</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Start Time (Unix timestamp)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <input
          placeholder="End Time (Unix timestamp)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={{ width: "300px" }}
        />
        <button onClick={createAuction}>Create Auction</button>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <button onClick={placeBid}>Place Bid</button>
        <button onClick={closeAuction}>Close Auction</button>
      </div>

      <hr />

      <div style={{ marginTop: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
        <strong>Result:</strong> {result}
      </div>
    </div>
  );
}
