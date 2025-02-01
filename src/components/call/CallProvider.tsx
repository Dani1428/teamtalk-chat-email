import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';

interface CallContextType {
  incomingCall: boolean;
  isVideo: boolean;
  callerId: string | null;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  makeCall: (userId: string, isVideo: boolean) => Promise<void>;
  endCall: () => void;
}

const CallContext = createContext<CallContextType>({
  incomingCall: false,
  isVideo: false,
  callerId: null,
  acceptCall: async () => {},
  rejectCall: () => {},
  makeCall: async () => {},
  endCall: () => {},
});

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendMessage } = useSocket();
  const [incomingCall, setIncomingCall] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [callerId, setCallerId] = useState<string | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage('iceCandidate', {
          to: callerId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      // Handle remote stream
      const remoteStream = event.streams[0];
      // Update UI with remote stream
    };

    peerConnection.current = pc;
    return pc;
  };

  const handleIncomingCall = async (from: string, offer: RTCSessionDescriptionInit, videoCall: boolean) => {
    setCallerId(from);
    setIsVideo(videoCall);
    setIncomingCall(true);

    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
  };

  const acceptCall = async () => {
    if (!peerConnection.current || !callerId) return;

    try {
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      sendMessage('answerCall', {
        to: callerId,
        answer,
      });

      setIncomingCall(false);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const rejectCall = () => {
    if (!callerId) return;

    sendMessage('endCall', { to: callerId });
    cleanup();
  };

  const makeCall = async (userId: string, videoEnabled: boolean) => {
    const pc = createPeerConnection();
    setCallerId(userId);
    setIsVideo(videoEnabled);

    try {
      if (videoEnabled) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendMessage('callUser', {
        userToCall: userId,
        offer,
        isVideo: videoEnabled
      });
    } catch (error) {
      console.error('Error making call:', error);
      cleanup();
    }
  };

  const endCall = () => {
    if (!callerId) return;

    sendMessage('endCall', { to: callerId });
    cleanup();
  };

  const cleanup = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setCallerId(null);
    setIncomingCall(false);
    setIsVideo(false);
  };

  return (
    <CallContext.Provider
      value={{
        incomingCall,
        isVideo,
        callerId,
        acceptCall,
        rejectCall,
        makeCall,
        endCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
