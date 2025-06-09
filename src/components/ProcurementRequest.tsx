import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  TrendingUp,
  Package
} from 'lucide-react';

interface ProcurementRequestData {
  id: string;
  title: string;
  category: string;
  description: string;
  budget: number;
  quantity: number;
  deadline: string;
  status: string;
  bidsReceived: number;
  requiredSpecs: string[];
  location: string;
  createdDate: string;
  estimatedDelivery: string;
}

interface ProcurementRequestProps {
  request: ProcurementRequestData;
}

export const ProcurementRequest: React.FC<ProcurementRequestProps> = ({ request }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-green-400" />;
      case 'evaluating':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'evaluating':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      layout
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{request.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(request.status)} capitalize`}>
              {request.status}
            </span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs">
              {request.category}
            </span>
          </div>
          <p className="text-white/70 text-sm mb-3">{request.description}</p>
          <div className="flex items-center space-x-4 text-sm text-white/60">
            <span className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>ID: {request.id}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{request.location}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{formatCurrency(request.budget)}</div>
          <div className="text-sm text-white/70">Budget</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-blue-400" />
          <div>
            <div className="text-xs text-white/70">Quantity</div>
            <div className="text-sm font-medium text-white">{request.quantity.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-green-400" />
          <div>
            <div className="text-xs text-white/70">Deadline</div>
            <div className="text-sm font-medium text-white">{formatDate(request.deadline)}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-purple-400" />
          <div>
            <div className="text-xs text-white/70">Bids</div>
            <div className="text-sm font-medium text-white">{request.bidsReceived}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-orange-400" />
          <div>
            <div className="text-xs text-white/70">Delivery</div>
            <div className="text-sm font-medium text-white">{formatDate(request.estimatedDelivery)}</div>
          </div>
        </div>
      </div>

      {/* Expandable Section */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="border-t border-white/20 pt-4 space-y-4"
          >
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Required Specifications</h4>
              <div className="flex flex-wrap gap-2">
                {request.requiredSpecs.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>Created:</span>
                    <span>{formatDate(request.createdDate)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Deadline:</span>
                    <span>{formatDate(request.deadline)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Est. Delivery:</span>
                    <span>{formatDate(request.estimatedDelivery)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-white mb-2">AI Recommendations</h4>
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-white/70">
                    Based on market analysis, this request has high vendor interest. 
                    Consider extending deadline by 5 days for better bid quality.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>{expanded ? 'Less Details' : 'View Details'}</span>
        </button>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/20 transition-all duration-200"
          >
            <MessageSquare className="h-4 w-4" />
            <span>View Bids ({request.bidsReceived})</span>
          </motion.button>
          
          {request.status === 'active' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Manage Request
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};