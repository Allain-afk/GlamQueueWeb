import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function SimpleChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m here to help you learn more about GlamQueue. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // About GlamQueue
    if (lowerQuery.includes('what') && (lowerQuery.includes('glamqueue') || lowerQuery.includes('is'))) {
      return 'GlamQueue is a comprehensive salon management platform designed to help salon owners streamline their operations, manage appointments, track analytics, and grow their business. It offers features like online booking, customer management, analytics & reports, and AI-powered business insights.';
    }
    
    // Features
    if (lowerQuery.includes('feature') || lowerQuery.includes('what can') || lowerQuery.includes('capabilities')) {
      return 'GlamQueue offers:\n\n• 📅 Appointment Booking System\n• 📊 Analytics & Reports with AI Insights\n• 📱 Mobile App (iOS & Android)\n• 👥 Customer Management (CRM)\n• 📧 Email Marketing\n• 📍 Location Services\n• 💬 AI Business Insights Chatbot\n\nWould you like to know more about any specific feature?';
    }
    
    // Pricing
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('plan') || lowerQuery.includes('pricing')) {
      return 'GlamQueue offers flexible pricing:\n\n• 🆓 Freemium: Free for 14 days (all Pro features)\n• 💼 Pro: ₱1,499/month (100 appointments/day, CRM, AI scheduling)\n• 🏢 Enterprise: Custom pricing (unlimited appointments, dedicated support)\n\nAll plans include a 14-day free trial with no credit card required!';
    }
    
    // Booking
    if (lowerQuery.includes('book') || lowerQuery.includes('appointment') || lowerQuery.includes('schedule')) {
      return 'Booking with GlamQueue is easy:\n\n1. Visit our landing page\n2. Fill out the booking form with your details\n3. Select your preferred salon, service, date, and time\n4. Sign up or log in to complete your booking\n\nOur system automatically saves your booking data, so you won\'t lose any information during sign-up!';
    }
    
    // Mobile App
    if (lowerQuery.includes('mobile') || lowerQuery.includes('app') || lowerQuery.includes('ios') || lowerQuery.includes('android')) {
      return 'Yes! GlamQueue has mobile apps:\n\n• 📱 iOS App: Coming soon!\n• 🤖 Android App: Available on Google Play Store\n• 💻 PWA: Progressive Web App for easy installation\n\nYou can also download the Android APK directly from our website. Manage your salon on the go!';
    }
    
    // Analytics
    if (lowerQuery.includes('analytics') || lowerQuery.includes('report') || lowerQuery.includes('insight')) {
      return 'GlamQueue Analytics provides:\n\n• 📊 Real-time business performance metrics\n• 💰 Revenue tracking and trends\n• 👥 Customer behavior analysis\n• ⏰ Peak hours identification\n• 🤖 AI-powered business recommendations\n• 📈 Growth insights and optimization tips\n\nThe AI chatbot in Analytics can help you understand your data and get personalized recommendations!';
    }
    
    // How to get started / sign up
    if (lowerQuery.includes('start') || lowerQuery.includes('sign up') || lowerQuery.includes('register') || lowerQuery.includes('begin')) {
      return 'Getting started is simple:\n\n1. Click "Book Now" or "Sign Up" on our landing page\n2. Create your account (email and password)\n3. Complete your profile\n4. Start booking appointments or managing your salon\n\nNew users automatically get a 14-day free trial with full access to all features!';
    }
    
    // Support / Help
    if (lowerQuery.includes('help') || lowerQuery.includes('support') || lowerQuery.includes('contact')) {
      return 'We\'re here to help! You can:\n\n• 💬 Chat with me (I can answer questions about GlamQueue)\n• 📧 Contact our support team through the dashboard\n• 📱 Use the mobile app for on-the-go support\n• 📚 Check our documentation and guides\n\nIs there something specific you need help with?';
    }
    
    // Benefits / Why
    if (lowerQuery.includes('why') || lowerQuery.includes('benefit') || lowerQuery.includes('advantage')) {
      return 'GlamQueue helps salon owners:\n\n✅ Reduce no-shows with automated reminders\n✅ Increase revenue with better scheduling\n✅ Understand customers with detailed analytics\n✅ Save time with automated booking\n✅ Grow business with AI insights\n✅ Provide better customer experience\n✅ Manage multiple locations easily\n\nReady to transform your salon business?';
    }
    
    // Default response
    return 'I can help you learn about GlamQueue! Try asking:\n\n• What is GlamQueue?\n• What features does it offer?\n• How much does it cost?\n• How do I book an appointment?\n• Tell me about the mobile app\n• What analytics are available?\n• How do I get started?\n\nWhat would you like to know?';
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(query);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      left: '20px', 
      zIndex: 1000 
    }}>
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e91e8c, #f06292)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(233, 30, 140, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '0',
          width: '350px',
          height: '500px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #e91e8c, #f06292)',
            padding: '16px 20px',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              GlamQueue Assistant
            </h3>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>
              Online
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                {message.sender === 'bot' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e91e8c, #f06292)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <Bot size={16} />
                  </div>
                )}
                <div style={{
                  background: message.sender === 'user' 
                    ? 'linear-gradient(135deg, #e91e8c, #f06292)' 
                    : 'white',
                  color: message.sender === 'user' ? 'white' : '#1a1a1a',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap'
                }}>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px 20px',
            background: 'white',
            borderTop: '1px solid #e5e5e5',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  handleSend();
                }
              }}
              placeholder="Ask about GlamQueue..."
              style={{
                flex: 1,
                border: '1px solid #e5e5e5',
                borderRadius: '20px',
                padding: '12px 16px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: inputValue.trim() 
                  ? 'linear-gradient(135deg, #e91e8c, #f06292)' 
                  : '#e5e5e5',
                border: 'none',
                color: 'white',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
