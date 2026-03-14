use soroban_sdk::{Env, Map, Symbol, BytesN, Address};
use crate::types::{Artwork, Offer};

/// Storage keys
pub struct StorageKeys;

impl StorageKeys {
    pub const ARTWORKS: Symbol = Symbol::short("artworks");  // map hash -> Artwork
    pub const OFFERS: Symbol = Symbol::short("offers");      // map hash -> Map<buyer, offer amount>
}

/// Access the artwork map
pub fn artworks_map(e: &Env) -> Map<BytesN<32>, Artwork> {
    e.storage().get_or_default(&StorageKeys::ARTWORKS)
}

/// Access the offers map
/// Outer key: artwork hash
/// Inner map: buyer address -> amount
pub fn offers_map(e: &Env) -> Map<BytesN<32>, Map<Address, i128>> {
    e.storage().get_or_default(&StorageKeys::OFFERS)
}
