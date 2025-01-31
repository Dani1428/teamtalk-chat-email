import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface CallContextType {
  makeCall: (userId: string, isVideo: boolean) => void;
  answerCall: () => void;
  endCall: () => void;
  callAccepted: boolean;
  callEnded: boolean;
  stream: MediaStream | null;
  call: any;
  remoteStream: MediaStream | null;
  isReceivingCall: boolean;
  caller: string;
  isVideo: boolean;
}

const CallContext = createContext<CallContextType | null>(null);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [call, setCall] = useState<any>(null);

  const socket = useRef<Socket>();
  const peerConnection = useRef<RTCPeerConnection>();

  useEffect(() => {
    socket.current = io('http://localhost:8080', {
      transports: ['websocket', 'polling']
    });

    socket.current.on('callUser', async ({ from, offer, isVideo: videoCall }) => {
      setCall({ from, offer });
      setCaller(from);
      setIsReceivingCall(true);
      setIsVideo(videoCall);
    });

    socket.current.on('callAccepted', async ({ answer }) => {
      const remoteDesc = new RTCSessionDescription(answer);
      await peerConnection.current?.setRemoteDescription(remoteDesc);
    });

    socket.current.on('iceCandidateReceived', async ({ candidate }) => {
      if (peerConnection.current && candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('iceCandidate', {
          candidate: event.candidate,
          to: call ? call.from : caller,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    return pc;
  };

  const getMediaStream = async (video: boolean) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: true,
      });
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      throw err;
    }
  };

  const makeCall = async (userId: string, video: boolean) => {
    try {
      const mediaStream = await getMediaStream(video);
      setIsVideo(video);

      peerConnection.current = createPeerConnection();
      mediaStream.getTracks().forEach(track => {
        if (peerConnection.current && mediaStream) {
          peerConnection.current.addTrack(track, mediaStream);
        }
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.current?.emit('callUser', {
        userToCall: userId,
        offer: peerConnection.current.localDescription,
        from: socket.current.id,
        isVideo: video,
      });
    } catch (err) {
      console.error('Error making call:', err);
    }
  };

  const answerCall = async () => {
    try {
      const mediaStream = await getMediaStream(isVideo);
      setCallAccepted(true);

      peerConnection.current = createPeerConnection();
      mediaStream.getTracks().forEach(track => {
        if (peerConnection.current && mediaStream) {
          peerConnection.current.addTrack(track, mediaStream);
        }
      });

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(call.offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.current?.emit('answerCall', {
        answer: peerConnection.current.localDescription,
        to: call.from,
      });
    } catch (err) {
      console.error('Error answering call:', err);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setCallEnded(true);
    setStream(null);
    setRemoteStream(null);
    setCallAccepted(false);
    setIsReceivingCall(false);
    setCaller('');
    setCall(null);
  };

  const value = {
    makeCall,
    answerCall,
    endCall,
    callAccepted,
    callEnded,
    stream,
    call,
    remoteStream,
    isReceivingCall,
    caller,
    isVideo,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
