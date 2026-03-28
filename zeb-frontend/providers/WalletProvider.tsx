'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

// ---- TYPES ----
export interface Wallet {
  address: string;
  isConnected: boolean;
  network: 'PUBLIC' | 'TESTNET' | string;
}

interface WalletContextType {
  wallet: Wallet | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (xdr: string) => Promise<string | null>;
  isConnecting: boolean;
}

// ---- CONTEXT ----
const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);

// ---- PROVIDER ----
export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // ---- SAFE AUTO RECONNECT ----
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const freighter = await import('@stellar/freighter-api');

        const isAllowed = await freighter.isAllowed();
        if (!isAllowed) return;

        const { address } = await freighter.getAddress();
        const { network, networkPassphrase } = await freighter.getNetwork();

        setWallet({
          address,
          isConnected: true,
          network,
        });
      } catch {
        // silent fail
      }
    };

    checkConnection();
  }, []);

  // ---- ACCOUNT CHANGE POLLING ----
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const freighter = await import('@stellar/freighter-api');

        const { address } = await freighter.getAddress();
        const { network, networkPassphrase } = await freighter.getNetwork();

        setWallet((prev) => {
          if (
            !prev ||
            prev.address !== address ||
            prev.network !== network
          ) {
            return {
              address,
              isConnected: true,
              network,
            };
          }
          return prev;
        });
      } catch {
        setWallet(null);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ---- CONNECT WALLET ----
  const connectWallet = async () => {
    if (isConnecting || wallet?.isConnected) return;

    setIsConnecting(true);

    try {
      const freighter = await import('@stellar/freighter-api');

      const isAllowed = await freighter.isAllowed();

      if (!isAllowed) {
        await freighter.requestAccess();
      }

      const { address } = await freighter.getAddress();
const { network, networkPassphrase } = await freighter.getNetwork();

// Use env config (default to TESTNET for dev)
const REQUIRED_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'TESTNET';

if (network !== REQUIRED_NETWORK) {
  alert(`Please switch Freighter to ${REQUIRED_NETWORK}`);
  return;
}

      setWallet({
        address,
        isConnected: true,
        network,
      });

      localStorage.setItem('walletAddress', address);
    } catch (error) {
      console.error('Wallet connect failed:', error);
      alert('Freighter connection failed. Install or unlock Freighter.');
    } finally {
      setIsConnecting(false);
    }
  };

  // ---- DISCONNECT ----
  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem('walletAddress');
  };

  // ---- SIGN TRANSACTION (FOR FUTURE USE) ----
  const signTransaction = async (xdr: string): Promise<string | null> => {
  try {
    const freighter = await import('@stellar/freighter-api');

    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    const { networkPassphrase } = await freighter.getNetwork();

    const result = await freighter.signTransaction(xdr, {
      networkPassphrase,
    });

    // Handle possible error from Freighter
    if ('error' in result && result.error) {
      console.error('Freighter error:', result.error);
      return null;
    }

    return result.signedTxXdr;

  } catch (error) {
    console.error('Transaction signing failed:', error);
    return null;
  }

  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        signTransaction,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// ---- HOOK ----
export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }

  return context;
}