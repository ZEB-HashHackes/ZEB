use soroban_sdk::{contract, contractimpl, Env, Address, BytesN};

#[cfg(test)]
mod test;

mod types;
mod storage;
mod artwork;
mod events;

use crate::types::ZebError;
use crate::artwork as artwork_logic;

#[contract]
pub struct ZebContract;

#[contractimpl]
impl ZebContract {

    pub fn artwork_exists(e: Env, hash: BytesN<32>) -> bool {
        artwork_logic::artwork_exists(e, hash)
    }

    pub fn register_artwork(
        e: Env,
        hash: BytesN<32>,
        creator: Address,
        timestamp: u64
    ) -> Result<(), ZebError> {
        artwork_logic::register_artwork(e, hash, creator, timestamp)
    }

    pub fn get_creator(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
        artwork_logic::get_creator(e, hash)
    }

    pub fn get_owner(e: Env, hash: BytesN<32>) -> Result<Address, ZebError> {
        artwork_logic::get_owner(e, hash)
    }

    pub fn transfer_ownership(
        e: Env,
        hash: BytesN<32>,
        caller: Address,
        new_owner: Address
    ) -> Result<(), ZebError> {
        caller.require_auth();
        artwork_logic::transfer_ownership(e, hash, new_owner)
    }

    pub fn make_offer(
        e: Env,
        hash: BytesN<32>,
        buyer: Address,
        amount: i128
    ) -> Result<(), ZebError> {
        artwork_logic::make_offer(e, hash, buyer, amount)
    }

    pub fn accept_offer(
        e: Env,
        hash: BytesN<32>,
        owner: Address,
        buyer: Address
    ) -> Result<i128, ZebError> {
        owner.require_auth();
        artwork_logic::accept_offer(e, hash, owner, buyer)
    }
}
