import { useRef, useEffect } from 'react';
import type { VideoStreamProps } from '../../types/Video';

const VideoStream = ({ stream, isMuted = false, isLocal = false, containerRef }: VideoStreamProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && stream) {
      videoElement.srcObject = stream;
      
      // Ensure video plays when ready
      const playVideo = async () => {
        try {
          await videoElement.play();
        } catch (e) {
          console.error('Error playing video:', e);
        }
      };

      if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        playVideo();
      } else {
        videoElement.addEventListener('loadeddata', playVideo);
      }

      // Cleanup
      return () => {
        videoElement.removeEventListener('loadeddata', playVideo);
        videoElement.srcObject = null;
      };
    }
  }, [stream, isLocal]);

  return (
    <div ref={containerRef} className="relative rounded-lg overflow-hidden bg-gray-900 w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted || isLocal}
        className={`w-full h-full object-cover ${isLocal ? 'mirror' : ''}`}
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400">No Video</div>
        </div>
      )}
    </div>
  );
};

export default VideoStream; 