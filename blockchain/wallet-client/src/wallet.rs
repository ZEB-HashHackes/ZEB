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
}
