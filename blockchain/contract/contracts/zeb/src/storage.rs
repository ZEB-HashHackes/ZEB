use soroban_sdk::{Env, Map, Symbol, BytesN, Address};
use crate::types::{Artwork, Offer};

// Storage keys
pub struct StorageKeys;

impl StorageKeys {
    pub const ARTWORKS: Symbol = Symbol::short("artworks");  // map hash -> Artwork
    pub const OFFERS: Symbol = Symbol::short("offers");      // map hash -> Map<buyer, offer amount>
}

// Access the artwork map
pub fn artworks_map(e: &Env) -> Map<BytesN<32>, Artwork> {
    match e.storage().persistent().get(&StorageKeys::ARTWORKS) {
        Some(map) => map,
        None => Map::new(e),
    }
}

// Access the offers map
// Outer key: artwork hash
// Inner map: buyer address -> amount
pub fn offers_map(e: &Env) -> Map<BytesN<32>, Map<Address, i128>> {
    match e.storage().persistent().get(&StorageKeys::OFFERS) {
        Some(map) => map,
        None => Map::new(e),
    }
}

pub fn save_artwork(e: &Env, artwork: &Map<BytesN<32>, Artwork>) {
    e.storage().persistent().set(&StorageKeys::ARTWORKS, artwork);
}

pub fn save_offer(e: &Env, offer: &Map<BytesN<32>, Map<Address, i128>>) {
    e.storage().persistent().set(&StorageKeys::OFFERS, offer);
}

