# Stream Video SDK Setup Guide

## 🎉 Free Audio/Video Calls with Stream

Stream Video SDK provides **unlimited 1:1 audio/video calls for free** — perfect for tailor consultations!

---

## Setup Steps

### 1. Create Stream Account (Free, No Credit Card)

1. Go to https://getstream.io/
2. Sign up for a free account
3. Create a new Video app
4. Copy your **API Key** and **API Secret**

---

### 2. Configure Backend

Add to `backend/.env`:

```env
# Stream Video SDK Configuration
STREAM_API_KEY=your_api_key_here
STREAM_API_SECRET=your_api_secret_here
```

---

### 3. Configure Frontend

Add to your root `.env` (if not exists, create it):

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3001
```

For production:
```env
EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

---

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:3001`

---

### 5. Test the Integration

#### Start the Expo app:
```bash
npm start
```

#### Test call flow:
1. Navigate to Conversations screen
2. Open a conversation
3. Tap the phone icon to start an audio call
4. Call will connect using Stream Video SDK

---

## Features Implemented

✅ **Audio Calls** - Crystal clear voice calls  
✅ **Microphone Toggle** - Mute/unmute during call  
✅ **Speaker Toggle** - Switch audio output  
✅ **Call Duration** - Real-time timer  
✅ **Call States** - Connecting → Ringing → Connected  
✅ **Free Forever** - Unlimited 1:1 calls  

---

## Free Tier Limits

| Feature | Limit |
|---------|-------|
| **1:1 Calls** | **Unlimited** ✨ |
| **Group Calls** | Up to 5 participants |
| **Call Quality** | HD audio/video |
| **Data Centers** | Global coverage |

---

## API Endpoints

### Get Call Token
```
GET /api/calls/token?userId=user123&userName=John
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "apiKey": "your_api_key",
  "userId": "user123",
  "userName": "John"
}
```

### Create Call
```
POST /api/calls/create
```

Body:
```json
{
  "callId": "call-123",
  "createdBy": "user123",
  "participants": ["user456"]
}
```

### End Call
```
POST /api/calls/:callId/end
```

---

## Troubleshooting

### Call Not Connecting?
1. Check backend is running: `http://localhost:3001/health`
2. Verify Stream credentials in `backend/.env`
3. Check network connectivity
4. Ensure EXPO_PUBLIC_API_URL is correct

### Audio Not Working?
1. Check microphone permissions
2. Try toggling speaker/microphone
3. Restart the app
4. Check device audio settings

### Token Errors?
1. Verify STREAM_API_KEY and STREAM_API_SECRET are set
2. Restart backend after adding env variables
3. Check for typos in credentials

---

## Next Steps

Want to add video calls? The infrastructure is ready!

1. Update `VideoCall.tsx` screen (similar to AudioCall)
2. Use `'video'` call type instead of `'audio'`
3. Add camera controls and participant views

---

## Cost Overview

| Users | Monthly Cost |
|-------|--------------|
| 0-1000 | **$0** (1:1 calls only) |
| 1000+ | Still **$0** for 1:1! |

Group calls (6+ people) require paid plan, but for a tailor app (mostly 1:1 consultations), **you'll never pay**.

---

## Support

- Stream Docs: https://getstream.io/video/docs/
- React Native SDK: https://getstream.io/video/docs/react-native/
- Community: https://getstream.io/chat/docs/sdk/react-native/

---

**You're all set! 🚀 Start building amazing call experiences.**
