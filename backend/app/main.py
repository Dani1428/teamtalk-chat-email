from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import Dict, Optional, List
import os
from datetime import datetime

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Store connected users
users: Dict[str, WebSocket] = {}

@app.post("/api/messages")
async def create_message(
    channel: str = Form(...),
    message: str = Form(None),
    attachments: List[UploadFile] = File(None),
    audio: UploadFile = File(None)
):
    try:
        # Create channel directory if it doesn't exist
        channel_dir = os.path.join(UPLOAD_DIR, channel)
        if not os.path.exists(channel_dir):
            os.makedirs(channel_dir)

        files = []
        
        # Handle regular attachments
        if attachments:
            for file in attachments:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{timestamp}_{file.filename}"
                filepath = os.path.join(channel_dir, filename)
                
                with open(filepath, "wb") as buffer:
                    content = await file.read()
                    buffer.write(content)
                
                files.append({
                    "name": file.filename,
                    "path": filepath,
                    "type": file.content_type
                })

        # Handle audio attachment
        if audio:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_voice-message.webm"
            filepath = os.path.join(channel_dir, filename)
            
            with open(filepath, "wb") as buffer:
                content = await audio.read()
                buffer.write(content)
            
            files.append({
                "name": "voice-message.webm",
                "path": filepath,
                "type": "audio/webm"
            })

        # Broadcast message to all users in the channel
        message_data = {
            "event": "newMessage",
            "data": {
                "channel": channel,
                "message": message,
                "files": files,
                "timestamp": datetime.now().isoformat()
            }
        }

        for user_ws in users.values():
            await user_ws.send_json(message_data)

        return {
            "status": "success",
            "message": "Message sent successfully",
            "data": message_data["data"]
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    socket_id = str(id(websocket))
    
    try:
        while True:
            message = await websocket.receive_json()
            event = message.get("event")
            data = message.get("data", {})
            
            if event == "register":
                user_id = data
                users[user_id] = websocket
                print(f"User registered: {user_id} ({socket_id})")
            
            elif event == "callUser":
                user_to_call = data.get("userToCall")
                if user_to_call in users:
                    await users[user_to_call].send_json({
                        "event": "callUser",
                        "data": {
                            "from": data.get("from"),
                            "offer": data.get("offer"),
                            "isVideo": data.get("isVideo")
                        }
                    })
            
            elif event == "answerCall":
                to = data.get("to")
                if to in users:
                    await users[to].send_json({
                        "event": "callAccepted",
                        "data": {
                            "answer": data.get("answer")
                        }
                    })
            
            elif event == "iceCandidate":
                to = data.get("to")
                if to in users:
                    await users[to].send_json({
                        "event": "iceCandidateReceived",
                        "data": {
                            "candidate": data.get("candidate")
                        }
                    })
            
            elif event == "endCall":
                to = data.get("to")
                if to in users:
                    await users[to].send_json({
                        "event": "callEnded"
                    })
    
    except WebSocketDisconnect:
        # Remove disconnected user
        for user_id, ws in list(users.items()):
            if ws == websocket:
                del users[user_id]
                print(f"User disconnected: {socket_id}")
                break

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True)
