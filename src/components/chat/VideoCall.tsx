import React, { useEffect, useRef } from 'react';
import { useCall } from '../call/CallProvider';

interface VideoCallProps {
  userId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ userId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { incomingCall, isVideo, callerId, acceptCall, rejectCall, makeCall, endCall } = useCall();

  useEffect(() => {
    // Set up local video stream when component mounts
    const setupLocalVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    setupLocalVideo();

    // Cleanup when component unmounts
    return () => {
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartCall = async () => {
    await makeCall(userId, true);
  };

  const handleAcceptCall = async () => {
    await acceptCall();
  };

  return (
    <div className="video-call-container">
      <div className="video-grid">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="local-video"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="remote-video"
        />
      </div>

      <div className="call-controls">
        {incomingCall ? (
          <>
            <button onClick={handleAcceptCall} className="accept-call">
              Accept {isVideo ? 'Video' : 'Audio'} Call
            </button>
            <button onClick={rejectCall} className="reject-call">
              Reject Call
            </button>
          </>
        ) : callerId ? (
          <button onClick={endCall} className="end-call">
            End Call
          </button>
        ) : (
          <button onClick={handleStartCall} className="start-call">
            Start Video Call
          </button>
        )}
      </div>

      <style jsx>{`
        .video-call-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }

        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        video {
          width: 100%;
          max-width: 400px;
          border-radius: 8px;
          background: #1a1a1a;
        }

        .call-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .start-call {
          background-color: #4caf50;
          color: white;
        }

        .accept-call {
          background-color: #2196f3;
          color: white;
        }

        .reject-call, .end-call {
          background-color: #f44336;
          color: white;
        }

        button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
};

export default VideoCall;
