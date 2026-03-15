use soroban_sdk::{Address, contracttype ,BytesN, contracterror};

// Artwork structure stored on-chain
#[contracttype]
#[derive(Clone)]
pub struct Artwork {
    pub hash: BytesN<32>,          // SHA256 hash of the digital content
    pub creator: Address,          // wallet address of original creator
    pub current_owner: Address,    // current owner
    pub timestamp: u64,            // blockchain registration time
}

// Errors for Zeb contract


#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ZebError {
    ArtworkAlreadyExists = 1,
    ArtworkNotFound = 2,
    NotOwner = 3,
    InvalidOffer = 4,
}

// Offer struct (optional, can extend with timestamp if needed)
#[contracttype]
#[derive(Clone)]
pub struct Offer {
    pub amount: i128,              // offer amount in stroops / asset smallest unit
    pub buyer: Address,            // buyer wallet address
}
