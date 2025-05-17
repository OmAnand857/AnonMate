import { io, Socket } from 'socket.io-client'

class SocketService {
  public socket: Socket | null = null
  public initiator: boolean = false
  private messageHandlers: ((message: string) => void)[] = []
  private matchHandlers: ((message: string) => void)[] = []
  private disconnectHandlers: ((message: string) => void)[] = []
  private notEnoughUsersHandlers: ((message: string) => void)[] = []
  private initiatorHandlers: ((message: boolean) => void)[] = []
  connect() {
    this.socket = io("https://31a5-2409-40e5-11a7-a38b-7f42-75c0-4062-f7ec.ngrok-free.app", {
      transports: ["websocket"], // optionally force websocket
      secure: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to the server')
    })

    this.socket.on('messageFromUser', (message: string) => {
      this.messageHandlers.forEach(handler => handler(message))
    })

    this.socket.on('matchFound', (message: string) => {
      this.matchHandlers.forEach(handler => handler(message))
    })

    this.socket.on('userDisconnected', (message: string) => {
      this.disconnectHandlers.forEach(handler => handler(message))
    })

    this.socket.on('notEnoughUsers', (message: string) => {
      this.notEnoughUsersHandlers.forEach(handler => handler(message))
    })

    this.socket.on('youAreInitiator', (message: boolean) => {
      this.initiator = message;
      this.initiatorHandlers.forEach(handler => handler(message))
      if( message===true ){
      }
    })
    
    this.socket.on('disconnect', () => {
    })
  }

  findMatch() {
    this.socket?.emit('connectToRandomUser')
  }

  sendMessage(message: string) {
    this.socket?.emit('messageFromUser', message)
  }

  skipToNextUser() {
    this.socket?.emit('next')
  }


  
  onMessage(handler: (message: string) => void) {
    this.messageHandlers.push(handler)
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
    }
  }

  onMatchFound(handler: (message: string) => void) {
    this.matchHandlers.push(handler)
    return () => {
      this.matchHandlers = this.matchHandlers.filter(h => h !== handler)
    }
  }

  onInitiator(handler: (message: boolean) => void) {
    this.initiatorHandlers.push(handler)
    return () => {
      this.initiatorHandlers = this.initiatorHandlers.filter(h => h !== handler)
    }
  }

  onUserDisconnected(handler: (message: string) => void) {
    this.disconnectHandlers.push(handler)
    return () => {
      this.disconnectHandlers = this.disconnectHandlers.filter(h => h !== handler)
    }
  }

  onNotEnoughUsers(handler: (message: string) => void) {
    this.notEnoughUsersHandlers.push(handler)
    return () => {
      this.notEnoughUsersHandlers = this.notEnoughUsersHandlers.filter(h => h !== handler)
    }
  }

  disconnect() {
    this.socket?.disconnect()
    this.socket = null
    this.messageHandlers = []
    this.matchHandlers = []
    this.disconnectHandlers = []
    this.notEnoughUsersHandlers = []
  }
}

// Create a singleton instance
export const socketService = new SocketService() 