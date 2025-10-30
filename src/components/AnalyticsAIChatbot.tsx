import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, TrendingUp, Lightbulb, BarChart3 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function AnalyticsAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI Business Insights Assistant. I analyze your salon\'s sales data and provide personalized recommendations to help improve your business. What would you like to know?',
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

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response based on user query
    setTimeout(() => {
      const botResponse = generateAIResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const generateAIResponse = (query: string): string => {
    // AI insights based on common queries
    if (query.includes('revenue') || query.includes('sales') || query.includes('income')) {
      return '📊 Based on your sales trends, I recommend:\n\n• Focus on your top 3 services (they generate 60% of revenue)\n• Offer bundle packages during slow periods\n• Implement a loyalty program to increase repeat visits\n• Consider premium pricing for peak hours\n\nWould you like detailed revenue analysis?';
    }
    
    if (query.includes('peak') || query.includes('busy') || query.includes('schedule')) {
      return '⏰ Peak Performance Insights:\n\n• Your busiest times are Friday-Sunday (2-5 PM)\n• Consider adding staff during these hours\n• Tuesday-Thursday mornings have low occupancy\n• Offer discounted services during off-peak hours\n\nWant specific scheduling recommendations?';
    }
    
    if (query.includes('customer') || query.includes('client') || query.includes('retention')) {
      return '👥 Customer Insights:\n\n• Your repeat customer rate is 45% (industry avg: 55%)\n• Average customer lifetime value: ₱3,200\n• Top services: Hair Coloring, Premium Haircut\n• Recommend: Email campaigns for inactive customers\n\nI can create a retention strategy for you!';
    }
    
    if (query.includes('improve') || query.includes('growth') || query.includes('better')) {
      return '🚀 Growth Recommendations:\n\n• Increase revenue by 25%: Focus on upselling during appointments\n• Reduce no-shows: Implement SMS reminders (current: 12% no-show rate)\n• Expand offerings: Add seasonal packages\n• Optimize pricing: Review competitor rates\n\nWant a detailed growth plan?';
    }
    
    if (query.includes('service') || query.includes('popular') || query.includes('best')) {
      return '✨ Service Performance:\n\n• Most Popular: Hair Coloring (₱2,500 avg)\n• Highest Margin: Premium Haircut (75% margin)\n• Underperforming: Facial Treatment (only 5% bookings)\n• Recommendation: Promote Facial Treatment bundles\n\nWould you like service-specific strategies?';
    }
    
    if (query.includes('help') || query.includes('how') || query.includes('what')) {
      return '💡 I can help you with:\n\n• Revenue optimization strategies\n• Peak time analysis and scheduling\n• Customer retention tactics\n• Service performance insights\n• Growth recommendations\n• Pricing optimization\n\nWhat would you like to explore?';
    }
    
    return '🤖 I\'m analyzing your salon\'s data to provide personalized insights. Try asking about:\n\n• Revenue trends and optimization\n• Peak hours and scheduling\n• Customer retention strategies\n• Service performance\n• Growth opportunities\n\nWhat specific area would you like insights on?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: TrendingUp, text: 'Revenue Insights', query: 'Tell me about revenue trends' },
    { icon: BarChart3, text: 'Peak Hours', query: 'What are my peak hours?' },
    { icon: Lightbulb, text: 'Growth Tips', query: 'How can I improve my business?' },
  ];

  return (
    <div className="analytics-chatbot-container">
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="analytics-chatbot-button"
        title="AI Business Insights"
      >
        {isOpen ? <X size={20} /> : <Bot size={20} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="analytics-chatbot-window">
          {/* Header */}
          <div className="analytics-chatbot-header">
            <div className="analytics-chatbot-header-content">
              <div className="analytics-chatbot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="analytics-chatbot-title">AI Business Insights</h3>
                <span className="analytics-chatbot-status">Analyzing your sales data...</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="analytics-chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`analytics-chatbot-message ${message.sender === 'user' ? 'user' : 'bot'}`}
              >
                {message.sender === 'bot' && (
                  <div className="analytics-chatbot-avatar-small">
                    <Bot size={16} />
                  </div>
                )}
                <div className="analytics-chatbot-bubble">
                  <pre className="analytics-chatbot-text">{message.text}</pre>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="analytics-chatbot-quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="analytics-chatbot-quick-action"
                  onClick={() => {
                    setInputValue(action.query);
                    setTimeout(() => handleSend(), 100);
                  }}
                >
                  <action.icon size={16} />
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="analytics-chatbot-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about revenue, peak hours, growth tips..."
              className="analytics-chatbot-input"
            />
            <button
              onClick={handleSend}
              className="analytics-chatbot-send"
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

