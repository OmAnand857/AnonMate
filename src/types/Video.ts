export interface VideoStreamProps {
  stream: MediaStream | null;
  isMuted?: boolean;
  isLocal?: boolean;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export interface VideoChatProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEndCall: () => void;
}

export interface VideoControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onNextUser: () => void;
} 