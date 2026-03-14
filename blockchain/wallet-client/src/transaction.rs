use crate::operation::Operation;
use crate::types::*;

pub struct Transaction {
    pub source: Address,
    pub operations: Vec<Operation>,
    pub sequence: SequenceNumber,
    pub fee: u64,
}

pub struct SignedTransaction {
    pub transaction: Transaction,
    pub signature: Signature,
}

pub struct TransactionResult {
    pub hash: Hash,
    pub success: bool,
}
