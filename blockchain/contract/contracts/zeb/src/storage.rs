use soroban_sdk::{Env, Map, Symbol, BytesN, Address};
use crate::types::{Artwork, Auction};

pub struct StorageKeys;

impl StorageKeys {
    pub const ARTWORKS: Symbol = Symbol::short("artworks");
    pub const OFFERS: Symbol = Symbol::short("offers");
    pub const AUCTIONS: Symbol = Symbol::short("auctions");
}

pub fn artworks_map(e: &Env) -> Map<BytesN<32>, Artwork> {
    e.storage()
        .persistent()
        .get(&StorageKeys::ARTWORKS)
        .unwrap_or(Map::new(e))
}

pub fn save_artwork(e: &Env, map: &Map<BytesN<32>, Artwork>) {
    e.storage().persistent().set(&StorageKeys::ARTWORKS, map);
}

pub fn offers_map(e: &Env) -> Map<BytesN<32>, Map<Address, u128>> {
    e.storage()
        .persistent()
        .get(&StorageKeys::OFFERS)
        .unwrap_or(Map::new(e))
}

pub fn save_offer(e: &Env, map: &Map<BytesN<32>, Map<Address, u128>>) {
    e.storage().persistent().set(&StorageKeys::OFFERS, map);
}

pub fn auctions_map(e: &Env) -> Map<BytesN<32>, Auction> {
    e.storage()
        .persistent()
        .get(&StorageKeys::AUCTIONS)
        .unwrap_or(Map::new(e))
}

pub fn save_auction(e: &Env, map: &Map<BytesN<32>, Auction>) {
    e.storage().persistent().set(&StorageKeys::AUCTIONS, map);
}
