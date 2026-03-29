# ZEB Upload On-Chain Fix TODO

## Status: 0/7 Complete

### Plan Summary
Fix "Bad union switch: 4" error during register_artwork after Freighter confirmation. Root cause: likely outdated CONTRACT_ID, invalid hash, or contract simulation failure. Add simulation/debug, fix flow duplication.

### Steps:
- [x] **Step 1**: Update `zeb-frontend/lib/stellar.ts` - ✅ Added simulation, TS-safe logging, fixed errors.
- [ ] **Step 2**: Verify/update CONTRACT_ID - Check if recent deploy; run deploy.ts if needed.
- [ [ ] **Step 3**: Fix UploadArtModal.tsx - Remove duplicate on-chain calls after uploadMutation; use mutation status.
- [ ] **Step 4**: Update useUploadArt.ts - Improve error categorization for Soroban errors.
- [ ] **Step 5**: Test upload flow - Upload test file, check console/RPC for simulation results.
- [ ] **Step 6**: If error persists - Check hash format from backend response, validate hexToBytes32.
- [ ] **Step 7**: Complete - attempt_completion with test command.

**Current Step**: Step 1 (stellar.ts edits)

