# ZEB Frontend - Revert Auctions Real-Time Changes

## Steps (4/4 complete) - Auctions revert done!

1. [x] Edit `zeb-frontend/lib/api.ts` - Remove getAuctions() function and related interface
2. [x] Edit `zeb-frontend/lib/types.ts` - Remove AuctionWithArt and Auction interfaces
3. [x] Test: cd zeb-frontend && npm run dev - Verified auctions page loads static data, no API errors
4. [x] Update main TODO.md and attempt_completion

**Notes:** Auctions page uses static mocks (no real fetches). Backend lacks /api/auction/active endpoint. ListAuctionModal useCreateAuction hook not found (likely never implemented).
