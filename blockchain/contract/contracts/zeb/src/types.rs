use soroban_sdk::{Address, BytesN};

/// Artwork structure stored on-chain
#[derive(Clone)]
pub struct Artwork {
    pub hash: BytesN<32>,          // SHA256 hash of the digital content
    pub creator: Address,          // wallet address of original creator
    pub current_owner: Address,    // current owner
    pub timestamp: u64,            // blockchain registration time
}

/// Errors for Zeb contract
#[derive(Debug)]
pub enum ZebError {
    ArtworkAlreadyExists,
    ArtworkNotFound,
    NotArtworkOwner,
    InvalidOffer,
}

/// Offer struct (optional, can extend with timestamp if needed)
#[derive(Clone)]
pub struct Offer {
    pub amount: i128,              // offer amount in stroops / asset smallest unit
    pub buyer: Address,            // buyer wallet address
}
