use crate::types::*;

// Encode a Hash (BytesN<32>) into Vec<u8>
pub fn encode_hash(hash: Hash) -> Vec<u8> {
    hash.to_vec()
}

// Decode Vec<u8> back into Hash (BytesN<32>)
pub fn decode_hash(bytes: &[u8]) -> Result<Hash, &'static str> {
    if bytes.len() != 32 {
        return Err("Invalid hash length");
    }
    let mut arr = [0u8; 32];
    arr.copy_from_slice(bytes);
    Ok(arr.into())
}

// Encode Address into Vec<u8> (Soroban-compatible)
pub fn encode_address(addr: &Address) -> Vec<u8> {
    addr.to_array().to_vec()
}

// Decode Vec<u8> into Address
pub fn decode_address(bytes: &[u8]) -> Result<Address, &'static str> {
    Address::from_array(&bytes.try_into().map_err(|_| "Invalid address length")?)
}

// Encode String into Vec<u8>
pub fn encode_string(value: &str) -> Vec<u8> {
    value.as_bytes().to_vec()
}

// Decode Vec<u8> into String
pub fn decode_string(bytes: &[u8]) -> Result<String, &'static str> {
    String::from_utf8(bytes.to_vec()).map_err(|_| "Invalid UTF-8")
}


