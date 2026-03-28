# Revert Upload Changes - Keep Wallet Phase 1

## Steps (7/10 complete)

1. [x] Delete `hooks/useUploadArt.ts`
 2. [x] Delete `components/dashboard/ArtUploadModal.tsx` 
 3. [x] Delete `app/dashboard/upload/page.tsx`
 4. [x] Edit `components/dashboard/Overview.tsx` - Remove upload stats/link
 5. [x] Edit `components/dashboard/NFTsTab.tsx` - Remove upload button/links
 6. [x] Edit `components/dashboard/Sidebar.tsx` - Remove create new link
 7. [x] Edit `components/dashboard/ArtGrid.tsx` - Update empty state
8. [x] Edit `app/dashboard/page.tsx` - Update empty message
9. [ ] Update main `TODO.md` - Revert Phase 2 progress
10. [ ] Test: cd zeb-frontend && npm run dev (wallet works, no upload errors)

**Notes:** Preserve all WalletProvider/Navbar/layout changes. Backend fetches ok (empty results handled).

