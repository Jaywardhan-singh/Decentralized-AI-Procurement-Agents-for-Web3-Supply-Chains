import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Shield,
  Award,
  Package,
  DollarSign
} from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  completedOrders: number;
  averageDelivery: number;
  rating: number;
  verified: boolean;
  location: string;
  specialties: string[];
  totalVolume: number;
  onTimeDelivery: number;
}

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-white">{vendor.name}</h3>
            {vendor.verified && (
              <Shield className="h-5 w-5 text-green-400" />
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-white/70">
            <span className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{vendor.location}</span>
            </span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs">
              {vendor.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white font-medium">{vendor.rating}</span>
          </div>
        </div>
      </div>

      {/* Trust Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Trust Score</span>
          <span className="text-sm font-medium text-white">{vendor.trustScore}/100</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${vendor.trustScore}%` }}
            transition={{ delay: 0.5, duration: 1 }}
            className={`h-2 rounded-full ${
              vendor.trustScore >= 90 ? 'bg-green-400' :
              vendor.trustScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Package className="h-4 w-4 text-blue-400" />
          <div>
            <div className="text-xs text-white/70">Orders</div>
            <div className="text-sm font-medium text-white">{vendor.completedOrders}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-green-400" />
          <div>
            <div className="text-xs text-white/70">Avg Delivery</div>
            <div className="text-sm font-medium text-white">{vendor.averageDelivery} days</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-yellow-400" />
          <div>
            <div className="text-xs text-white/70">Total Volume</div>
            <div className="text-sm font-medium text-white">{formatCurrency(vendor.totalVolume)}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-purple-400" />
          <div>
            <div className="text-xs text-white/70">On-Time</div>
            <div className="text-sm font-medium text-white">{vendor.onTimeDelivery}%</div>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <div className="text-xs text-white/70 mb-2">Specialties</div>
        <div className="flex flex-wrap gap-1">
          {vendor.specialties.map((specialty) => (
            <span
              key={specialty}
              className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs"
            >
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          View Profile
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all duration-200"
        >
          Contact
        </motion.button>
      </div>
    </motion.div>
  );
};