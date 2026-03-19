use soroban_sdk::{contractimpl, Env,Symbol, Address, String ,BytesN, Map };
use crate::types::{Artwork, ZebError, Auction};
use crate::storage::{artworks_map, offers_map,auctions_map,save_auction,save_artwork, save_offer};
use crate::events;
use core::clone::Clone;


pub fn artwork_exists(e: Env, hash: BytesN<32>) -> bool {
    let artworks = artworks_map(&e);
    artworks.contains_key(hash)
}

pub fn get_highest_bidder(
    e: Env,
    hash: BytesN<32>,
) -> Result<Option<Address>, ZebError> {
    let auctions = auctions_map(&e);

    let auction = auctions
        .get(hash)
        .ok_or(ZebError::InvalidAuction)?;

    Ok(auction.highest_bidder)
}

pub fn get_highest_bid(
    e: Env,
    hash: BytesN<32>,
) -> Result<u128, ZebError> {
    let auctions = auctions_map(&e);

    let auction = auctions
        .get(hash)
        .ok_or(ZebError::InvalidAuction)?;

    Ok(auction.highest_bid)
}

pub fn auction_exists(
    e: Env,
    hash: BytesN<32>,
) -> bool {
    let auctions = auctions_map(&e);
    auctions.contains_key(hash)
}

pub fn get_auctions(
    e: Env,
) -> Map<BytesN<32>, Auction> {
    auctions_map(&e)
}


pub fn register_artwork(
    e: Env,
    title: String,
    hash: BytesN<32>,
    creator: Address,
    timestamp: u128,
) -> Result<(), ZebError> {

    creator.require_auth();

    let mut artworks = artworks_map(&e);

    if artworks.contains_key(hash.clone()) {
        return Err(ZebError::ArtworkAlreadyExists);
    }

    let artwork = Artwork {
        title: title.clone(),
        hash: hash.clone(),
        creator: creator.clone(),
        current_owner: creator.clone(),
        timestamp,
    };

    artworks.set(hash.clone(), artwork);
    save_artwork(&e, &artworks);

    events::artwork_registered(&e, title, hash, creator, timestamp);

    Ok(())
}


pub fn get_creator(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
    let artworks = artworks_map(&e);

    artworks
        .get(hash)
        .map(|art| art.creator)
        .ok_or(ZebError::ArtworkNotFound)
}


pub fn get_owner(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
    let artworks = artworks_map(&e);

    artworks
        .get(hash)
        .map(|art| art.current_owner)
        .ok_or(ZebError::ArtworkNotFound)
}


pub fn transfer_ownership(
    e: Env,
    hash: BytesN<32>,
    new_owner: Address,
) -> Result<(), ZebError> {

    let mut artworks = artworks_map(&e);

    let mut artwork = artworks
        .get(hash.clone())
        .ok_or(ZebError::ArtworkNotFound)?;

    let owner = artwork.current_owner.clone();
    owner.require_auth();

    artwork.current_owner = new_owner.clone();

    artworks.set(hash.clone(), artwork);
    save_artwork(&e, &artworks);

    events::ownership_transferred(&e, hash, owner, new_owner);

    Ok(())
}

// pub fn make_offer(
//     e: Env,
//     hash: BytesN<32>,
//     buyer: Address,
//     amount: u128,
// ) -> Result<(), ZebError> {
//
//     buyer.require_auth();
//
//     if amount <= 0 {
//         return Err(ZebError::InvalidOffer);
//     }
//
//     let artworks = artworks_map(&e);
//     if !artworks.contains_key(hash.clone()) {
//         return Err(ZebError::ArtworkNotFound);
//     }
//
//     let mut offers_outer = offers_map(&e);
//     let mut inner = offers_outer
//         .get(hash.clone())
//         .unwrap_or(Map::new(&e));
//
//     inner.set(buyer.clone(), amount);
//     offers_outer.set(hash.clone(), inner);
//
//     save_offer(&e, &offers_outer);
//
//     events::offer_made(&e, hash, buyer, amount);
//
//     Ok(())
// }


// pub fn accept_offer(
//     e: Env,
//     hash: BytesN<32>,
//     owner: Address,
//     buyer: Address,
// ) -> Result<u128, ZebError> {
//
//
//     let mut artworks = artworks_map(&e);
//     let mut offers_outer = offers_map(&e);
//
//     let mut art = artworks
//         .get(hash.clone())
//         .ok_or(ZebError::ArtworkNotFound)?;
//
//     if art.current_owner != owner {
//         return Err(ZebError::NotOwner);
//     }
//
//     let mut inner = offers_outer
//         .get(hash.clone())
//         .unwrap_or(Map::new(&e));
//
//     let amount = inner
//         .get(buyer.clone())
//         .ok_or(ZebError::InvalidOffer)?;
//
//     art.current_owner = buyer.clone();
//     artworks.set(hash.clone(), art);
//     save_artwork(&e, &artworks);
//
//     inner.remove(buyer.clone());
//     offers_outer.set(hash.clone(), inner);
//     save_offer(&e, &offers_outer);
//
//     events::offer_accepted(&e, hash, buyer, amount);
//
//     Ok(amount)
// }


pub fn create_auction(
    e: Env,
    hash: BytesN<32>,
    seller: Address,
    start_time: u128,
    end_time: u128,
) -> Result<(), ZebError> {

    seller.require_auth();

    let artworks = artworks_map(&e);
    let art = artworks
        .get(hash.clone())
        .ok_or(ZebError::ArtworkNotFound)?;

    if art.current_owner != seller {
        return Err(ZebError::NotOwner);
    }

    let mut auctions = auctions_map(&e);

    if auctions.contains_key(hash.clone()) {
        return Err(ZebError::InvalidAuction);
    }

    let auction = Auction {
        artwork_hash: hash.clone(),
        seller: seller.clone(),
        start_time,
        end_time,
        highest_bid: 0,
        highest_bidder: None,
    };

    auctions.set(hash.clone(), auction);
    save_auction(&e, &auctions);

    events::auction_created(&e, hash, seller, start_time);

    Ok(())
}


pub fn place_bid(
    e: Env,
    hash: BytesN<32>,
    bidder: Address,
    amount: u128,
    timestamp: u128,
) -> Result<(), ZebError> {

    bidder.require_auth();

    if amount <= 0 {
        return Err(ZebError::InvalidOffer);
    }

    let mut auctions = auctions_map(&e);

    let mut auction = auctions
        .get(hash.clone())
        .ok_or(ZebError::InvalidAuction)?;

    if timestamp < auction.start_time || timestamp > auction.end_time {
        return Err(ZebError::InvalidAuction);
    }

    if amount <= auction.highest_bid {
        return Err(ZebError::InvalidOffer);
    }

    auction.highest_bid = amount;
    auction.highest_bidder = Some(bidder.clone());

    auctions.set(hash.clone(), auction);
    save_auction(&e, &auctions);

    events::auction_bid(&e, hash, bidder, amount);

    Ok(())
}


pub fn close_auction(
    e: Env,
    hash: BytesN<32>,
    caller: Address,
    current_time: u128,
) -> Result<(), ZebError> {

    caller.require_auth();

    let mut auctions = auctions_map(&e);

    let auction = auctions
        .get(hash.clone())
        .ok_or(ZebError::InvalidAuction)?;

    if caller != auction.seller {
        return Err(ZebError::NotOwner);
    }

    if current_time < auction.end_time {
        return Err(ZebError::InvalidAuction);
    }

    let mut artworks = artworks_map(&e);
    let mut art = artworks
        .get(hash.clone())
        .ok_or(ZebError::ArtworkNotFound)?;

    if let Some(winner) = auction.highest_bidder.clone() {
        art.current_owner = winner.clone();
        artworks.set(hash.clone(), art);
        save_artwork(&e, &artworks);

        events::auction_ended(&e, hash.clone(), winner, auction.highest_bid);
    }

    auctions.remove(hash.clone());
    save_auction(&e, &auctions);

    Ok(())
}
