use crate::operation::*;
use crate::transaction::*;
use crate::types::*;

pub struct WalletClient {
    pub address: Address,
    pub sequence: SequenceNumber,
}

impl WalletClient{

    pub fn new(address: Address, sequence: SequenceNumber) -> Self {
        Self { address, sequence }
    }

    pub fn invoke_contract(
        &self,
        contract_id: ContractID,
        function: String,
        args: Vec<Vec<u8>>,
    ) -> Operation {

        Operation {
            op_type: OperationType::ContractInvoke,
            contract_id,
            function,
            args,
        }
    }

    pub fn build_transaction(
        &mut self,
        operations: Vec<Operation>,
        fee: u64,
    ) -> Transaction {

        self.sequence += 1;

        Transaction {
            source: self.address.clone(),
            operations,
            sequence: self.sequence,
            fee,
        }
    }

    pub async fn sign_with_provider(&self, tx: &Transaction) -> Result<SignedTransaction, String>
    {
        // 1. Serialize transaction to XDR or bytes
        let tx_bytes = encode_address(tx);

        // 2. Call provider API (frontend bridge)
        // Example for Freighter (JS):
        // window.freighterApi.signTransaction(tx_bytes)
        // returns signed_tx_bytes

        // 3. Convert bytes back to SignedTransaction
        let signed_tx = deserialize_signed_tx(&tx_bytes_signed);

        Ok(signed_tx)
    }

    pub async fn submit_transaction(&self, signed_tx: &SignedTransaction) -> Result<String, String> {
        // Submit to Soroban network via SDK
        soroban_sdk::client::send_transaction(signed_tx)
    }
}
