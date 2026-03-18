use soroban_sdk::{contractimpl, Env,Symbol, Address, BytesN, Map };
use crate::types::{Artwork, ZebError};
use crate::storage::{artworks_map, offers_map,save_artwork, save_offer};
use crate::events;
use core::clone::Clone;


pub fn artwork_exists(e: Env, hash: BytesN<32>) -> bool {
    let artworks = artworks_map(&e);
    artworks.contains_key(hash.clone())
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

    if artworks.contains_key(hash.clone()) {
        return Err(ZebError::ArtworkAlreadyExists);
    }

    let artwork = Artwork {
        hash: hash.clone(),
        creator: creator.clone(),
        current_owner: creator.clone(),
        timestamp,
    };

    artworks.set(hash.clone(), artwork);
    save_artwork(&e, &artworks);
    // EMIT EVENT
    events::artwork_registered(&e, hash, creator, timestamp);

    Ok(())
}


pub fn get_creator(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
    let artworks = artworks_map(&e);

    match artworks.get(hash.clone()) {
        Some(art) => Ok(art.creator),
        None => Err(ZebError::ArtworkNotFound),
    }
}

pub fn get_owner(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
    let artworks = artworks_map(&e);

    match artworks.get(hash.clone()) {
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

    if !artworks.contains_key(hash.clone()) {
        return Err(ZebError::ArtworkNotFound);
    }

    let mut artwork = artworks.get(hash.clone()).unwrap();

    let owner = artwork.current_owner.clone();

    // AUTHORIZATION: only current owner can transfer
    owner.require_auth();

    artwork.current_owner = new_owner.clone();

    artworks.set(hash.clone(), artwork);
    save_artwork(&e,&artworks);
    // EMIT EVENT
    events::ownership_transferred(&e, hash.clone(), owner, new_owner);

    Ok(())
}

pub fn make_offer(e: Env, hash: BytesN<32>, buyer: Address, amount: i128) -> Result<(), ZebError> {
    if amount <= 0 {
        return Err(ZebError::InvalidOffer);
    }

    let mut offers_outer = offers_map(&e);
    let mut inner_map = offers_outer.get(hash.clone()).unwrap_or_else(|| Map::new(&e));

    inner_map.set(buyer.clone(), amount);
    offers_outer.set(hash.clone(), inner_map);
    save_offer(&e,&offers_outer);
    events::offer_made(&e, hash.clone(), buyer, amount);

    Ok(())
}

pub fn accept_offer(
    e: Env,
    hash: BytesN<32>,
    owner: Address,
    buyer: Address,
) -> Result<i128, ZebError> {
    let mut artworks = artworks_map(&e);
    let mut offers_outer = offers_map(&e);

    let mut art = artworks.get(hash.clone()).ok_or(ZebError::ArtworkNotFound)?;

    if art.current_owner != owner {
        return Err(ZebError::NotOwner);
    }

    let mut inner_map = offers_outer.get(hash.clone()).unwrap_or_else(|| Map::new(&e));
    let amount = inner_map.get(buyer.clone()).ok_or(ZebError::InvalidOffer)?;


    // Update ownership
    art.current_owner = buyer.clone();
    artworks.set(hash.clone(), art);
    save_artwork(&e, &artworks);

    inner_map.remove(buyer.clone());
    offers_outer.set(hash.clone(), inner_map);
    save_offer(&e, &offers_outer);

    events::offer_accepted(&e, hash, buyer, amount);

    Ok(amount)
}
