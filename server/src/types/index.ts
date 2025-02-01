export interface WebRTCData {
  callId: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export interface SocketEvents {
  'authenticate': (userId: string) => void;
  'call:initiate': (data: { callId: string; receiverId: string; type: 'audio' | 'video' }) => void;
  'call:answer': (data: { callId: string; answer: RTCSessionDescriptionInit }) => void;
  'call:ice-candidate': (data: { callId: string; candidate: RTCIceCandidateInit }) => void;
  'call:offer': (data: { callId: string; offer: RTCSessionDescriptionInit }) => void;
  'call:join-room': (callId: string) => void;
  'call:leave-room': (callId: string) => void;
  'call:end': (data: { callId: string }) => void;
  'message:send': (message: any) => void;
  'message:edit': (message: any) => void;
  'message:delete': (data: { messageId: string; channelId: string }) => void;
  'channel:join': (channelId: string) => void;
  'channel:leave': (channelId: string) => void;
}
