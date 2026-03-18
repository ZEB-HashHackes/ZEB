use crate::types::*;

pub enum OperationType {
    ContractInvoke,
    CreateAcount,
    TransferOwership,
    AcceptOffer,
    MakeOffer
}

pub struct Operation {
    pub op_type: OperationType,
    pub contract_id: ContractID,
    pub function: String,
    pub args: Vec<Vec<u8>>,
}
