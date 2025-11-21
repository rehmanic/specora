# Specbot Integration - Quick Test Guide

## Prerequisites
1. Backend server running on port 5000
2. Frontend server running on port 3000
3. Logged in as a user with role "client"
4. Valid project ID in the URL

## Test Steps

### 1. Access Specbot Page
- Navigate to: `http://localhost:3000/projects/[your-project-id]/specbot`
- You should see the Specbot interface with:
  - Left sidebar (collapsed/expanded toggle)
  - Empty state: "Welcome to Specbot"

### 2. Create First Chat
1. Click "New Chat" button in the left sidebar
2. Expected behavior:
   - New chat appears in the sidebar with title "New Chat"
   - Chat is automatically selected
   - Main area shows empty message state
   - Starter questions appear at the bottom

### 3. Test Starter Questions
1. Click any starter question
2. Expected behavior:
   - Question text fills the input field
   - You can edit or send as-is

### 4. Send First Message
1. Type or use a starter question
2. Click send button or press Enter
3. Expected behavior:
   - Your message appears on the right (blue background)
   - Input shows "Waiting for response..."
   - Bot response appears on the left (gray background)
   - Both messages have timestamps
   - Page auto-scrolls to bottom

### 5. Continue Conversation
1. Send more messages
2. Expected behavior:
   - Each message gets a response
   - Conversation history is maintained
   - Timestamps update correctly

### 6. Create Second Chat
1. Click "New Chat" again
2. Expected behavior:
   - New chat appears in sidebar
   - Automatically switches to new chat
   - Previous chat remains in sidebar
   - New chat is empty

### 7. Switch Between Chats
1. Click on the first chat in sidebar
2. Expected behavior:
   - Chat becomes highlighted
   - Previous messages load
   - Can continue conversation

### 8. Test Sidebar Features
1. Toggle sidebar collapse/expand
2. Expected behavior:
   - Sidebar collapses to icons only
   - Expands to show full chat list
   - Active chat remains highlighted

### 9. Check Timestamps
- Verify chat timestamps show relative time (e.g., "2 minutes ago")
- Verify message timestamps show time (e.g., "10:30 AM")

### 10. Test Error Handling
1. Stop the backend server
2. Try to send a message
3. Expected behavior:
   - Error message appears
   - Input remains enabled
   - Can retry after backend restarts

## Expected API Calls

When testing, check browser DevTools Network tab:

1. **On page load:**
   - GET `/api/specbot/chat/all`

2. **On "New Chat":**
   - POST `/api/specbot/chat/create`

3. **On chat selection:**
   - GET `/api/specbot/messages/all/:chatId`

4. **On message send:**
   - POST `/api/specbot/message/create`

## Common Issues & Solutions

### Issue: "No chats" shows but can't create
- **Solution**: Check user is logged in and has role "client"

### Issue: Messages not appearing
- **Solution**: Check browser console for errors
- Verify GEMINI_API_KEY is set in backend

### Issue: Chat list not loading
- **Solution**: Check network tab for 401/403 errors
- Verify token is valid

### Issue: Timestamps showing "Invalid Date"
- **Solution**: Check date-fns is installed: `npm list date-fns`

### Issue: Can't send messages
- **Solution**: Verify a chat is selected (not on welcome screen)

## Browser Console Checks

Open DevTools Console and verify:
- No red errors
- API calls returning 200/201 status
- State updates logging (if you add console.logs)

## Database Verification

Check these tables in your database:
1. `specbot_chats` - Should have new entries
2. `messages` - Should have user and bot messages
3. Verify `chat_type` is "specbot"
4. Verify `sender_type` is "user" or "bot"

## Success Criteria

✅ Can create multiple chats
✅ Can switch between chats
✅ Can send messages and receive responses
✅ Messages persist across chat switches
✅ UI updates smoothly without flickers
✅ Loading states show appropriately
✅ Errors are displayed to user
✅ Timestamps are formatted correctly
✅ Sidebar shows all chats
✅ Active chat is highlighted

## Next Steps After Testing

If all tests pass:
1. Consider adding chat deletion UI
2. Consider adding chat renaming UI
3. Implement file attachments
4. Add custom instructions UI
5. Implement message search
6. Add export functionality

## Troubleshooting Commands

```bash
# Check if backend is running
curl http://localhost:5000/api

# Check if frontend env is loaded
# In browser console:
console.log(process.env.NEXT_PUBLIC_API_URL)

# Restart frontend with fresh env
cd frontend
npm run dev

# Check database
# Use your database client to verify data
```
