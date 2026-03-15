use soroban_sdk::{
    testutils::{Address as _},
    Address, BytesN, Env
};

use crate::{ZebContract, ZebContractClient};

#[test]
fn test_register_and_query_artwork() {

    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ZebContract);
    let client = ZebContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);

    let hash = BytesN::from_array(&env, &[1; 32]);

    let timestamp: u64 = 12345;

    client.register_artwork(&hash, &creator, &timestamp);

    let exists = client.artwork_exists(&hash);
    assert!(exists);

    let returned_creator = client.get_creator(&hash);
    assert_eq!(returned_creator, creator);

    let owner = client.get_owner(&hash);
    assert_eq!(owner, creator);
}

#[test]
fn test_transfer_ownership() {

    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ZebContract);
    let client = ZebContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let new_owner = Address::generate(&env);


    let hash = BytesN::from_array(&env, &[2; 32]);

    let timestamp: u64 = 1000;

    client.register_artwork(&hash, &creator, &timestamp);

    client.transfer_ownership(&hash, &creator, &new_owner);

    let owner = client.get_owner(&hash);

    assert_eq!(owner, new_owner);
}
