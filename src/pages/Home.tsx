import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const steps = [
    {
      step: "1",
      title: "Click 'Start Chatting'",
      description: "No registration required. Jump right into conversations."
    },
    {
      step: "2",
      title: "Choose Your Interests",
      description: "Select topics you'd like to discuss to find better matches."
    },
    {
      step: "3",
      title: "Start Connecting",
      description: "Begin chatting with people who share your interests."
    }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        
        <div className="relative mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen max-w-[1400px]">
          <div className="text-center space-y-8 w-full max-w-7xl mx-auto">
            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium inline-block">
              Experience Real-Time Connections
            </span>
            
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 px-4 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">OMeagle</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-8 px-4 max-w-3xl mx-auto">
              Connect with random people from around the world instantly. Chat, meet, and make new friends in a safe and engaging environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate('/chat')}
                className={`
                  w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold
                  transition-colors duration-300
                  ${isHovered
                    ? 'bg-blue-400 text-black'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                  }
                  shadow-lg hover:shadow-xl shadow-blue-500/20
                `}
              >
                Start Chatting Now
              </button>
              
              <button
                className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold
                border-2 border-blue-500/30 text-white
                hover:bg-blue-500/10
                transition-all duration-300
                bg-transparent">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto px-4 py-20 max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose OMeagle?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Experience the next generation of random chat with our cutting-edge features and commitment to user safety.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[
            {
              icon: "🌎",
              title: "Global Community",
              description: "Connect with people from diverse backgrounds and cultures around the world."
            },
            {
              icon: "🔒",
              title: "Enhanced Security",
              description: "Advanced encryption and moderation systems to ensure your safety and privacy."
            },
            {
              icon: "⚡",
              title: "Instant Matching",
              description: "Smart algorithms to connect you with like-minded people instantly."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Web3 Features Section */}
      <div className="mx-auto px-4 py-20 border-t border-blue-900/30 max-w-[1400px]">
        <div className="text-center mb-16">
          <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4 inline-block">
            Web3 Integration
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Reward Meaningful Connections</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Experience the future of social connections with our integrated Web3 reward system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div
            className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-4">💎</div>
              <h3 className="text-2xl font-semibold text-blue-400">Crypto Rewards</h3>
            </div>
            <p className="text-gray-400 mb-6">Send and receive crypto tokens to show appreciation for meaningful conversations and connections.</p>
            <ul className="space-y-4">
              {["Integrated cryptocurrency wallet support", "Multiple blockchain networks supported", "Instant cross-border transactions"].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 mr-2">✦</span>
                  <span className="text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 rounded-2xl hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-4">🌟</div>
              <h3 className="text-2xl font-semibold text-blue-400">Smart Features</h3>
            </div>
            <p className="text-gray-400 mb-6">Enhanced connection features powered by blockchain technology.</p>
            <ul className="space-y-4">
              {["Smart contracts for secure transactions", "NFT-based profile verification", "Decentralized identity management"].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 mr-2">✦</span>
                  <span className="text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/chat')}
            className="px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl shadow-blue-500/20"
          >
            Connect Wallet
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mx-auto px-4 py-20 border-t border-blue-900/30 max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Get started in just three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-6 hover:scale-105 transition-transform duration-300"
            >
              <div
                className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-xl font-bold mx-auto mb-4"
              >
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto px-4 py-20 max-w-[1400px]">
        <div
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 md:p-16 text-center hover:scale-105 transition-transform duration-300"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">Join millions of users already connecting on OMeagle. Your next meaningful conversation is just a click away.</p>
          <button
            onClick={() => navigate('/chat')}
            className="px-8 py-4 rounded-full text-lg font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl shadow-blue-500/20"
          >
            Start Chatting Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-900/30">
        <div className="mx-auto px-4 py-12 max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[
              {
                title: "OMeagle",
                items: ["Connecting hearts worldwide through meaningful conversations."]
              },
              {
                title: "Features",
                items: ["Global Chat", "Crypto Rewards", "Smart Matching", "Security"]
              },
              {
                title: "Resources",
                items: ["Help Center", "Safety Tips", "Community Guidelines", "Blog"]
              },
              {
                title: "Connect",
                items: ["Twitter", "Discord", "Telegram", "GitHub"]
              }
            ].map((column, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold text-white mb-4">{column.title}</h4>
                <ul className="space-y-2 text-gray-400">
                  {column.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center pt-8 border-t border-blue-900/30">
            <p className="text-gray-400 flex items-center justify-center">
              Made with <span className="text-red-500 text-xl px-1">❤️</span> by Om Anand
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home 