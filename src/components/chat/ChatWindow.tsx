import { useState, useEffect, useRef } from 'react'
import MessageList from './MessageList.tsx'
import MessageInput from './MessageInput.tsx'
import { socketService } from '../../services/socket'
import VideoStream from '../video/VideoStream'
import VideoControls from '../video/VideoControls'
import WebRTCService from '../../services/webrtc';
import type { Message } from '../../types/Message';

const ChatWindow = () => {

  const [messages, setMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<string>('Connecting...')
  const [isMatched, setIsMatched] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [fullscreenVideo, setFullscreenVideo] = useState<'local' | 'remote' | null>(null)
  
  // Video chat state
  const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isInitiator, setIsInitiator] = useState(false)
  const [InitializeWebrtcService, setInitializeWebrtcService] = useState(false)
  const [localStreamofOtherUser, setLocalStreamofOtherUser] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const localVideoContainerRef = useRef<HTMLDivElement>(null);
  const remoteVideoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const setupMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        setLocalStream(stream);
        currentStream = stream;
        setPermissionDenied(false);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setPermissionDenied(true);
      }
    };

    setupMediaStream();


    // Listen for messages
    const messageCleanup = socketService.onMessage((message) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'peer',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])
    })

    // Listen for match found
    const matchCleanup = socketService.onMatchFound((message) => {
      setStatus(message)
      setIsMatched(true)
    })

    //listen for initiator
    const initiatorCleanup = socketService.onInitiator((message) => {
      setIsInitiator(message)
    })

    // Listen for user disconnected
    const disconnectCleanup = socketService.onUserDisconnected((message) => {
      setStatus(message)
      setIsMatched(false)
    })

    // Listen for not enough users
    const notEnoughUsersCleanup = socketService.onNotEnoughUsers((message) => {
      setStatus(message)
    })

    socketService.connect(); 
    socketService.findMatch();


    // Cleanup function
    return () => {
      messageCleanup();
      matchCleanup();
      disconnectCleanup();
      notEnoughUsersCleanup();
      initiatorCleanup();
      socketService.disconnect();
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
        });
      }
      setLocalStream(null);
    };
  }, [])

  // Update WebRTC setup useEffect


// Initialize WebRTCService when matched
useEffect(() => {
  if (isMatched) {
    const newService = new WebRTCService();
    setWebrtcService(newService);
    return () => {
      newService.cleanup();
    };
  }
}, [isMatched]);

// Setup localStream, attach handler, and initialize WebRTC
useEffect(() => {
  const initialize = async () => {
    if (webrtcService && localStream) {
      try {
        await webrtcService.setLocalStream(localStream);
        webrtcService.HandleConnected(() => {
          setIsConnected(true);
          console.log("WebRTC connection established");
        });
        webrtcService.HandleLocalStream(() => {
          setLocalStreamofOtherUser(true);
          console.log("Other user's local stream is ready");
        });
        setInitializeWebrtcService(true);
      } catch (error) {
        console.error("Failed to initialize WebRTC:", error);
        // Optionally handle the error (e.g., show user feedback)
      }
    }
  };

  initialize();
}, [webrtcService, localStream]);

// Send offer only after both are ready
useEffect(() => {
  const sendOffer = async () => {
    if (InitializeWebrtcService && isInitiator && webrtcService && localStreamofOtherUser) {
      try {
        console.log("Initiating WebRTC offer...");
        await webrtcService.SendOffer();
      } catch (error) {
        console.error("Failed to send WebRTC offer:", error);
        // Optionally handle the error (e.g., show user feedback)
      }
    }
  };

  sendOffer();
}, [InitializeWebrtcService, isInitiator, webrtcService, localStreamofOtherUser]);

useEffect(() => {
  if (isConnected && webrtcService?.remoteStream) {
    console.log("Setting remote stream from peer");
    setRemoteStream(webrtcService.remoteStream);
  }
}, [isConnected, webrtcService?.remoteStream]);

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (webrtcService) {
      webrtcService.cleanup();
    }
  };
}, []);

useEffect(() => {
  if( remoteStream ) console.log("remote stream############", remoteStream);
},[remoteStream])

useEffect(() => {
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setFullscreenVideo(null);
    }
  };
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
}, []);

  const handleSendMessage = (text: string) => {
    if (!isMatched) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    socketService.sendMessage(text)
  }

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

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleFullscreen = (videoType: 'local' | 'remote') => {
    const ref = videoType === 'local' ? localVideoContainerRef : remoteVideoContainerRef;
    if (ref.current) {
      if (!document.fullscreenElement) {
        ref.current.requestFullscreen();
        setFullscreenVideo(videoType);
      } else {
        document.exitFullscreen();
        setFullscreenVideo(null);
      }
    }
  };

  const handleNextUser = () => {
    // Clean up current connection
    if (webrtcService) {
      webrtcService.cleanup();
      setWebrtcService(null);
    }
    
    // Reset states
    setIsMatched(false);
    setIsConnected(false);
    setInitializeWebrtcService(false);
    setLocalStreamofOtherUser(false);
    setRemoteStream(null);
    setMessages([]);
    setStatus('Finding next user...');
    socketService.skipToNextUser();
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0A0A1B] to-[#181A2A] overflow-hidden">
      {/* Block app if permission denied */}
      {permissionDenied && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <div className="bg-[#181A2A] p-8 rounded-2xl shadow-xl border border-blue-900/40 text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Camera & Microphone Required</h2>
            <p className="text-gray-300 mb-6">
              OMeagle requires access to your camera and microphone to connect you with others. Please allow access in your browser settings and reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition"
            >
              Reload & Retry
            </button>
          </div>
        </div>
      )}
      {/* Status Bar */}
      <div className="w-full h-10 flex items-center justify-between px-4 bg-blue-900/90 shadow-md border-b border-blue-800 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-white font-medium text-sm">{status}</span>
        </div>
        <span className="text-xs text-blue-200 font-mono tracking-wide hidden md:block">OMeagle</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 h-[calc(100vh-40px)]">
        {/* Video Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-6">
          <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 h-full items-center justify-center">
            {/* Local Video */}
            <div ref={localVideoContainerRef} className="relative flex-1 max-w-full aspect-video bg-black rounded-2xl shadow-xl overflow-hidden border-2 border-blue-900 transition-all duration-300">
              <VideoStream
                stream={localStream}
                isMuted={true}
                isLocal={true}
                containerRef={localVideoContainerRef}
              />
              {/* Overlay label */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-semibold shadow">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> You
              </div>
              {/* Fullscreen Button */}
              <button
                onClick={() => toggleFullscreen('local')}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-blue-700/80 text-white shadow transition"
                aria-label="Fullscreen Local Video"
              >
                {fullscreenVideo === 'local' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5-5M4 4l5 5m6-5l5 5m0-5l-5 5m5 6l-5 5m5 0l-5-5m-6 5l-5-5m0 5l5-5" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-9v4m0-4h-4m4 4l-5 5M4 16v4m0-4h4m-4 4l5-5m11 5v-4m0 4h-4m4-4l-5-5" /></svg>
                )}
              </button>
            </div>

            {/* Remote Video */}
            <div ref={remoteVideoContainerRef} className="relative flex-1 max-w-full aspect-video bg-black rounded-2xl shadow-xl overflow-hidden border-2 border-blue-900 transition-all duration-300">
              <VideoStream
                stream={remoteStream}
                isMuted={isMuted}
                containerRef={remoteVideoContainerRef}
              />
              {/* Overlay label */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-semibold shadow">
                <span className="w-2 h-2 rounded-full bg-pink-400"></span> Stranger
              </div>
              {/* Fullscreen Button */}
              <button
                onClick={() => toggleFullscreen('remote')}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-pink-700/80 text-white shadow transition"
                aria-label="Fullscreen Remote Video"
              >
                {fullscreenVideo === 'remote' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5-5M4 4l5 5m6-5l5 5m0-5l-5 5m5 6l-5 5m5 0l-5-5m-6 5l-5-5m0 5l5-5" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-9v4m0-4h-4m4 4l-5 5M4 16v4m0-4h4m-4 4l5-5m11 5v-4m0 4h-4m4-4l-5-5" /></svg>
                )}
              </button>
              {/* Connection Overlay */}
              {!remoteStream && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <span className="text-white text-lg font-bold animate-pulse">Waiting for stranger...</span>
                </div>
              )}
            </div>
          </div>
          {/* Controls Bar */}
          <div className="w-full max-w-3xl mx-auto mt-4 flex items-center justify-center gap-4 bg-blue-900/80 rounded-xl shadow-lg p-3 border border-blue-800">
            <VideoControls
              isMuted={isMuted}
              isCameraOff={isCameraOff}
              onToggleMute={handleToggleMute}
              onToggleCamera={handleToggleCamera}
              onNextUser={handleNextUser}
            />
            {/* Chat Toggle Button (Mobile Only) */}
            <button
              onClick={toggleChat}
              className="md:hidden p-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white shadow transition"
              aria-label="Toggle Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg"  className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className={`
          fixed md:relative md:w-96
          bottom-0 right-0 md:inset-y-0
          w-full
          bg-[#181A2A] border-l border-blue-900/40 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isChatOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          flex flex-col h-[60vh] md:h-full
          z-40
          rounded-t-2xl md:rounded-none
        `}>
          {/* Chat Header */}
          <div className="p-4 border-b border-blue-900/30 flex items-center justify-between bg-blue-900/80 rounded-t-2xl md:rounded-none">
            <h2 className="text-white font-semibold text-lg">Chat</h2>
            <button
              onClick={toggleChat}
              className="md:hidden p-2 bg-black text-white hover:text-gray-300"
              aria-label="Close Chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2 bg-transparent">
            <MessageList messages={messages} />
          </div>
          <div className="w-full p-4 border-t border-blue-900/30 bg-blue-900/40 rounded-b-2xl md:rounded-none">
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChatWindow 