use crate::types::*;

pub fn encode_hash(hash: Hash) -> Vec<u8> {
    hash.to_vec()
}

pub fn encode_address(addr: Address) -> Vec<u8> {
    addr.into_bytes()
}

pub fn encode_string(value: String) -> Vec<u8> {
    value.into_bytes()
}
