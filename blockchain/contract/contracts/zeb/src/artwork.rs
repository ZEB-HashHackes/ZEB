use soroban_sdk::{contractimpl, Env, Address, BytesN, Map};
use crate::types::{Artwork, ZebError};
use crate::storage::{artworks_map, offers_map};



pub fn artwork_exists(e: Env, hash: BytesN<32>) -> bool {
    let artworks = artworks_map(&e);
    artworks.contains_key(&hash)
}

pub fn register_artwork(
    e: Env,
    hash: BytesN<32>,
    creator: Address,
    timestamp: u64,
) -> Result<(), ZebError> {

    // AUTHORIZATION
    creator.require_auth();

    let mut artworks = artworks_map(&e);

    if artworks.contains_key(&hash) {
        return Err(ZebError::ArtworkAlreadyExists);
    }

    let artwork = Artwork {
        hash: hash.clone(),
        creator: creator.clone(),
        current_owner: creator.clone(),
        timestamp,
    };

    artworks.set(hash.clone(), artwork);

    // EMIT EVENT
    events::artwork_registered(&e, hash, creator, timestamp);

    Ok(())
}


pub fn get_creator(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
    let artworks = artworks_map(&e);

    match artworks.get(&hash) {
        Some(art) => Ok(art.creator),
        None => Err(ZebError::ArtworkNotFound),
    }
}

pub fn get_owner(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
    let artworks = artworks_map(&e);

    match artworks.get(&hash) {
        Some(art) => Ok(art.current_owner),
        None => Err(ZebError::ArtworkNotFound),
    }
}

pub fn transfer_ownership(
    e: Env,
    hash: BytesN<32>,
    new_owner: Address,
) -> Result<(), ZebError> {

    let mut artworks = artworks_map(&e);

    if !artworks.contains_key(&hash) {
        return Err(ZebError::ArtworkNotFound);
    }

    let mut artwork = artworks.get(hash.clone()).unwrap();

    let owner = artwork.current_owner.clone();

    // AUTHORIZATION: only current owner can transfer
    owner.require_auth();

    artwork.current_owner = new_owner.clone();

    artworks.set(hash.clone(), artwork);

    // EMIT EVENT
    events::ownership_transferred(&e, hash, owner, new_owner);

    Ok(())
}

pub fn make_offer(e: Env, hash: BytesN<32>, buyer: Address, amount: i128) -> Result<(), ZebError> {
    if amount <= 0 {
        return Err(ZebError::InvalidOffer);
    }

    let mut offers_outer = offers_map(&e);
    let mut inner_map = offers_outer.get(&hash).unwrap_or_else(|| Map::new(&e));

    inner_map.set(buyer.clone(), amount);
    offers_outer.set(hash, inner_map);
    e.storage().set(&crate::storage::StorageKeys::OFFERS, &offers_outer);
    events::offer_made(&e, hash, buyer, amount);

    Ok(())
}

pub fn accept_offer(e: Env, hash: BytesN<32>, owner: Address, buyer: Address) -> Result<i128, ZebError> {
    let mut artworks = artworks_map(&e);
    let mut offers_outer = offers_map(&e);

    let mut art = match artworks.get(&hash) {
        Some(a) => a,
        None => return Err(ZebError::ArtworkNotFound),
    };

    if art.current_owner != owner {
        return Err(ZebError::NotArtworkOwner);
    }

    let mut inner_map = offers_outer.get(&hash).unwrap_or_else(|| Map::new(&e));
    let amount = match inner_map.get(&buyer) {
        Some(a) => a,
        None => return Err(ZebError::InvalidOffer),
    };

    art.current_owner = buyer.clone();
    artworks.set(hash.clone(), art);
    e.storage().set(&crate::storage::StorageKeys::ARTWORKS, &artworks);

    inner_map.remove(&buyer);
    offers_outer.set(hash, inner_map);
    e.storage().set(&crate::storage::StorageKeys::OFFERS, &offers_outer);

    events::offer_accepted(&e, hash, buyer, amount);

    Ok(amount)
}

