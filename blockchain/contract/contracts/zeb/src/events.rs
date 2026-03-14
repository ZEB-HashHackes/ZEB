use soroban_sdk::{Env, Symbol, Address, BytesN, Vec};

pub fn artwork_registered(
    e: &Env,
    hash: BytesN<32>,
    creator: Address,
    timestamp: u64
) {
    let topics = (Symbol::short("art_reg"), hash);

    e.events().publish(topics, (creator, timestamp));
}

pub fn ownership_transferred(
    e: &Env,
    hash: BytesN<32>,
    old_owner: Address,
    new_owner: Address
) {
    let topics = (Symbol::short("own_tr"), hash);

    e.events().publish(topics, (old_owner, new_owner));
}

pub fn offer_made(
    e: &Env,
    hash: BytesN<32>,
    buyer: Address,
    amount: i128
) {
    let topics = (Symbol::short("offer"), hash);

    e.events().publish(topics, (buyer, amount));
}

pub fn offer_accepted(
    e: &Env,
    hash: BytesN<32>,
    buyer: Address,
    amount: i128
) {
    let topics = (Symbol::short("offer_acc"), hash);

    e.events().publish(topics, (buyer, amount));
}
