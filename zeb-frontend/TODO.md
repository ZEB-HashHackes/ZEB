# ZEB Frontend Phase 2: File Upload (Approved Plan)

**Status**: 10/17 steps complete

## Breakdown Steps

### 1. Core Upload Components & Hooks (Steps 1-5)
1. [x] Create `hooks/useDashboardArts.ts` - Query for creator/owned arts
2. [x] Create `hooks/useUploadArt.ts` - Mutation for file upload API
3. [ ] Create `lib/api.ts` updates - Add uploadArt function
4. [x] Create `components/dashboard/UploadArtModal.tsx` - Full upload UI/modal
5. [x] Test modal integration (manual)

### 2. Dashboard UI Updates (Steps 6-11)
6. [x] Edit `components/dashboard/Overview.tsx` - Add real stats, modal trigger
7. [ ] Edit `components/dashboard/Sidebar.tsx` - Add upload nav trigger
8. [ ] Edit `components/dashboard/NFTsTab.tsx` - Add upload btn, use new hooks
9. [ ] Edit `components/dashboard/ArtGrid.tsx` - Confirm arts rendering
10. [x] Create `app/dashboard/upload/page.tsx` - Full page upload form
11. [ ] Test dashboard flows

### 2. Dashboard UI Updates (Steps 6-11)
6. Edit `components/dashboard/Overview.tsx` - Add real stats, modal trigger
7. Edit `components/dashboard/Sidebar.tsx` - Add upload nav trigger
8. Edit `components/dashboard/NFTsTab.tsx` - Add upload btn, use new hooks
9. Edit `components/dashboard/ArtGrid.tsx` - Confirm arts rendering
10. Create `app/dashboard/upload/page.tsx` - Full page upload form
11. Test dashboard flows

### 3. Integration & Polish (Steps 12-14)
12. Add error handling/toasts to upload
13. Add file preview + validation
14. Test edge cases (dupes, conflicts)

### 4. Finalization (Steps 15-17)
15. Update QueryProvider if needed
16. Backend test: POST /api/arts with curl
17. Full E2E: npm run dev + upload flow

**Next**: After each batch, update this TODO.md with [x] marks. Backend ready, frontend focus.

