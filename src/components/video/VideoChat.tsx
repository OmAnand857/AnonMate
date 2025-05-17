import { useState } from 'react';
import VideoStream from './VideoStream';
import VideoControls from './VideoControls';
import type { VideoChatProps } from '../../types/Video';

const VideoChat = ({ localStream, remoteStream, onEndCall }: VideoChatProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleToggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isCameraOff;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A1B] p-4">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1400px] mx-auto w-full">
        {/* Local Video */}
        <div className="relative">
          <VideoStream
            stream={localStream}
            isMuted={true}
            isLocal={true}
          />
          <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-white text-sm">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative">
          <VideoStream
            stream={remoteStream}
            isMuted={isMuted}
          />
          <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-white text-sm">
            Stranger
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center max-w-[1400px] mx-auto w-full">
        <VideoControls
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          onToggleMute={handleToggleMute}
          onToggleCamera={handleToggleCamera}
          onNextUser={onEndCall}
        />
      </div>
    </div>
  );
};

export default VideoChat; 