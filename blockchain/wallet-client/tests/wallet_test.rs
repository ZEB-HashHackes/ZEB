use wallet_client::wallet::WalletClient;

#[test]
fn test_contract_operation_creation() {

    let wallet = WalletClient::new(
        "GTESTADDRESS".to_string(),
        10
    );

    let op = wallet.invoke_contract(
        "contract123".to_string(),
        "register_artwork".to_string(),
        vec![]
    );

    assert_eq!(op.contract_id, "contract123");
    assert_eq!(op.function, "register_artwork");
}
