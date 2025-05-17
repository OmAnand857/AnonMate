import { socketService } from "./socket";
import { Socket } from "socket.io-client";

interface RTCOfferData {
    sdp: string;
    type: 'offer';
}

interface RTCAnswerData {
    sdp: string;
    type: 'answer';
}

interface RTCIceCandidateData {
    candidate: string;
    sdpMLineIndex: number;
    sdpMid: string;
}

class WebRTCService {
    public socket : Socket | null = null;
    public peerConnection : RTCPeerConnection | null = null ;
    private iceCandidatesBuffer : RTCIceCandidate[] = [];
    private configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    public remoteStream : MediaStream | null = null;
    public ConnectionHandler : ()=>void = ()=>{};
    public LocalStreamHandler : ()=>void = ()=>{};

    constructor(){
        this.socket = socketService.socket;
        this.initializePeerConnection();
        this.setupSocketListeners();
    }

    private initializePeerConnection() {
        this.peerConnection = new RTCPeerConnection(this.configuration);

        // ICE candidate handling
        this.peerConnection.addEventListener('icecandidate', event => {
            if (event.candidate) {
                this.socket?.emit('ice_candidate', event.candidate);
            }
        });

        // Remote stream handling
        this.peerConnection.addEventListener('track', event => {
            if (event.streams[0]) {
                console.log("Received remote stream with tracks:", event.streams[0].getTracks().length);
                this.remoteStream = event.streams[0];
            }
        });

        // Connection state monitoring
        this.peerConnection.addEventListener('connectionstatechange', () => {
            console.log("Connection state changed to:", this.peerConnection?.connectionState);
            if (this.peerConnection?.connectionState === "connected") {
                this.ConnectionHandler();
            } else if (this.peerConnection?.connectionState === "failed") {
                console.warn("WebRTC connection failed - may need to reconnect");
            }
        });
    }

    private setupSocketListeners() {
        this.socket?.on("offer", async (offer: RTCOfferData) => {
            try {
                if( !this.peerConnection || this.peerConnection.connectionState === "closed" ) return ;
                console.log("Received offer, setting remote description");
                await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(offer));
                await this.FlushBuffer();
                
                const answer = await this.peerConnection?.createAnswer();
                await this.peerConnection?.setLocalDescription(answer);
                this.socket?.emit('answer', answer);
                console.log("Answer sent successfully");
            } catch (error) {
                console.error("Error handling offer:", error);
            }
        });

        this.socket?.on("answer", async (answer: RTCAnswerData) => {
            try {
                if( !this.peerConnection || this.peerConnection.connectionState === "closed" ) return ;
                console.log("Received answer, setting remote description");
                const remoteDesc = new RTCSessionDescription(answer);
                await this.peerConnection?.setRemoteDescription(remoteDesc);
                await this.FlushBuffer();
                console.log("Remote description set and buffer flushed");
            } catch (error) {
                console.error("Error handling answer:", error);
            }
        });

        this.socket?.on("ice_candidate", async (candidate: RTCIceCandidateData) => {
            try {
                if( !this.peerConnection || this.peerConnection.connectionState === "closed" ) return ;
                const iceCandidate = new RTCIceCandidate(candidate);
                if (this.peerConnection?.remoteDescription && this.peerConnection.remoteDescription.type) {
                    await this.peerConnection?.addIceCandidate(iceCandidate);
                    console.log("ICE candidate added successfully");
                } else {
                    this.iceCandidatesBuffer.push(iceCandidate);
                    console.log("ICE candidate buffered");
                }
            } catch (error) {
                console.error("Error handling ICE candidate:", error);
            }
        });

        this.socket?.on("localStreamSet", () => {
            console.log("Peer has set up local stream");
            this.LocalStreamHandler();
        });
    }

    async setLocalStream( localStream: MediaStream ) {
        try {
            const tracks = localStream.getTracks();
            console.log("Adding local stream tracks:", tracks.length);
            tracks.forEach(track => {
                this.peerConnection?.addTrack(track, localStream);
            });
            this.socket?.emit("localStreamSet");
            console.log("Local stream setup complete");
        } catch (error) {
            console.error("Error setting local stream:", error);
            throw error;
        }
    }

    async SendOffer() {
        try {
            const offer = await this.peerConnection?.createOffer();
            if (!offer) {
                throw new Error("Failed to create offer");
            }
            await this.peerConnection?.setLocalDescription(offer);
            this.socket?.emit('offer', offer);
            console.log("Offer sent successfully");
        } catch (error) {
            console.error("Error sending offer:", error);
            throw error;
        }
    }

    private async FlushBuffer() {
        console.log(`Flushing ${this.iceCandidatesBuffer.length} buffered candidates`);
        for (const candidate of this.iceCandidatesBuffer) {
            try {
                await this.peerConnection?.addIceCandidate(candidate);
            } catch (error) {
                console.error("Error adding buffered ICE candidate:", error);
            }
        }
        this.iceCandidatesBuffer = [];
    }

    public HandleConnected(handler: () => void) {
        this.ConnectionHandler = handler;
    }

    public HandleLocalStream(handler: () => void) {
        this.LocalStreamHandler = handler;
    }

    public Am_i_Initiator() {
        console.log("checking if i am initiator", socketService.initiator);
        return socketService.initiator;
    }

    // Cleanup method for proper resource management
    public cleanup() {
        this.peerConnection?.close();
        this.remoteStream?.getTracks().forEach(track => track.stop());
        this.remoteStream = null;
        this.iceCandidatesBuffer = [];
    }
}

export default WebRTCService;
