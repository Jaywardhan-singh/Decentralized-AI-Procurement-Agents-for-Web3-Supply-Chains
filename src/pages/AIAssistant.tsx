import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Mic,
  Paperclip,
  Zap,
  Brain,
  TrendingUp,
  Shield,
  Target,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Hello! I\'m your AI Procurement Assistant. I can help you optimize supply chain operations, analyze vendor performance, identify cost savings opportunities, and automate procurement decisions. How can I assist you today?',
    timestamp: new Date(),
    suggestions: [
      'Analyze vendor performance',
      'Find cost optimization opportunities',
      'Review contract risks',
      'Suggest better suppliers'
    ]
  }
];

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('vendor') || lowerMessage.includes('supplier')) {
      return `Based on your current vendor data, I've analyzed performance metrics across 156 active suppliers. Here are key insights:

🏆 **Top Performers:**
- TechSupply Solutions: 95% trust score, 124 completed orders
- EcoSupply Chain: 92% trust score, excellent sustainability ratings
- Global Manufacturing Co.: 87% trust score, specialized in industrial equipment

📊 **Recommendations:**
1. Consider consolidating orders with top 3 vendors for 12% cost savings
2. TechSupply Solutions shows potential for strategic partnership
3. Two vendors require performance review due to delivery delays

Would you like me to initiate contact with any specific vendors or generate a detailed performance report?`;
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('saving') || lowerMessage.includes('optimize')) {
      return `I've identified several cost optimization opportunities in your supply chain:

💰 **Immediate Savings (Next 30 days):**
- Vendor consolidation: $48,000 potential savings
- Bulk ordering timing: $23,000 additional savings
- Payment term optimization: 8% cash flow improvement

📈 **Strategic Opportunities:**
1. Electronics procurement: 15% overspend detected vs. market rates
2. Logistics optimization: Route efficiency can be improved by 22%
3. Sustainable materials: Lock in current rates before Q4 price increase

🎯 **Action Items:**
- Renegotiate 3 high-volume contracts expiring this quarter
- Implement AI-driven demand forecasting
- Consider alternative suppliers in Southeast Asia for 18% cost reduction

Shall I create an implementation plan for any of these recommendations?`;
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('contract')) {
      return `AI Risk Assessment completed for your active contracts:

⚠️ **High Priority Risks:**
- Contract SC-2024-003: 35% risk score due to extended timeline
- Vendor concentration: 67% of volume with top 3 suppliers
- Geographic risk: 45% suppliers in single region

🛡️ **Risk Mitigation Strategies:**
1. Diversify supplier base across 3+ regions
2. Implement milestone-based payment schedules
3. Add force majeure clauses to new contracts
4. Establish backup suppliers for critical components

📋 **Contract Optimization:**
- 8 contracts up for renewal in Q3
- Average contract value can be reduced by 11% through renegotiation
- Smart contract adoption can reduce processing time by 60%

Would you like me to prioritize these risks or draft updated contract templates?`;
    }

    return `I understand you're asking about "${userMessage}". Let me analyze this in the context of your supply chain operations.

Based on your current data:
- 156 active vendors across 5 categories
- $2.4M in active procurement requests
- 94% average vendor performance score
- 18% overall cost savings achieved this quarter

I can help you with:
🤖 Vendor analysis and recommendations
📊 Cost optimization strategies  
⚡ Smart contract automation
🔍 Risk assessment and mitigation
📈 Performance analytics and insights

What specific aspect would you like me to focus on? I can provide detailed analysis, actionable recommendations, or help automate any of these processes.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: simulateAIResponse(inputValue),
        timestamp: new Date(),
        suggestions: [
          'Generate detailed report',
          'Schedule vendor meeting',
          'Create action plan',
          'Export analysis'
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Procurement Assistant</h1>
          <p className="text-white/70 mt-1">Intelligent automation for supply chain optimization</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>AI Online</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg">
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-white">GPT-4 Enhanced</span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}>
                  {message.type === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`rounded-xl p-4 ${message.type === 'user' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/10 border border-white/20'}`}>
                  <div className="text-white whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs text-white/50 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs text-white transition-colors duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/20 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about vendor analysis, cost optimization, risk assessment..."
                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute right-3 bottom-3 flex space-x-2">
                <button className="text-white/50 hover:text-white transition-colors">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="text-white/50 hover:text-white transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: 'Market Analysis', color: 'from-green-500 to-green-600' },
          { icon: Shield, label: 'Risk Assessment', color: 'from-red-500 to-red-600' },
          { icon: Target, label: 'Cost Optimization', color: 'from-blue-500 to-blue-600' },
          { icon: Zap, label: 'Smart Contracts', color: 'from-purple-500 to-purple-600' },
        ].map((action, index) => (
          <motion.button
            key={action.label}
            onClick={() => handleSuggestionClick(`Help me with ${action.label.toLowerCase()}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center space-x-2 p-3 bg-gradient-to-r ${action.color} bg-opacity-20 border border-white/20 rounded-lg text-white hover:bg-opacity-30 transition-all duration-200`}
          >
            <action.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};