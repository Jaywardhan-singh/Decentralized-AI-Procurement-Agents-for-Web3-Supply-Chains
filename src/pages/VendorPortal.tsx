import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Star,
  Shield,
  Award,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { VendorCard } from '../components/VendorCard';
import { VendorRegistration } from '../components/VendorRegistration';

const mockVendors = [
  {
    id: 'VND-001',
    name: 'TechSupply Solutions',
    category: 'Electronics',
    trustScore: 95,
    completedOrders: 124,
    averageDelivery: 3.2,
    rating: 4.8,
    verified: true,
    location: 'Singapore',
    specialties: ['IoT Devices', 'Semiconductors', 'Hardware'],
    totalVolume: 2400000,
    onTimeDelivery: 98,
  },
  {
    id: 'VND-002',
    name: 'Global Manufacturing Co.',
    category: 'Manufacturing',
    trustScore: 87,
    completedOrders: 89,
    averageDelivery: 5.1,
    rating: 4.6,
    verified: true,
    location: 'Germany',
    specialties: ['Industrial Equipment', 'Machinery', 'Tools'],
    totalVolume: 1800000,
    onTimeDelivery: 92,
  },
  {
    id: 'VND-003',
    name: 'EcoSupply Chain',
    category: 'Sustainable Materials',
    trustScore: 92,
    completedOrders: 67,
    averageDelivery: 4.5,
    rating: 4.9,
    verified: true,
    location: 'Netherlands',
    specialties: ['Recycled Materials', 'Green Energy', 'Sustainability'],
    totalVolume: 950000,
    onTimeDelivery: 96,
  },
];

export const VendorPortal: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Electronics', 'Manufacturing', 'Sustainable Materials', 'Logistics'];

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendor Portal</h1>
          <p className="text-white/70 mt-1">Manage and discover verified supply chain partners</p>
        </div>
        <motion.button
          onClick={() => setShowRegistration(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Register New Vendor</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Vendors', value: '156', icon: Shield, color: 'from-blue-500 to-blue-600' },
          { label: 'Verified Vendors', value: '142', icon: CheckCircle, color: 'from-green-500 to-green-600' },
          { label: 'Avg Trust Score', value: '89.2', icon: Star, color: 'from-purple-500 to-purple-600' },
          { label: 'Pending Reviews', value: '8', icon: AlertCircle, color: 'from-orange-500 to-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
          <input
            type="text"
            placeholder="Search vendors, specialties, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-white/70" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-slate-800">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVendors.map((vendor, index) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <VendorCard vendor={vendor} />
          </motion.div>
        ))}
      </div>

      {/* Vendor Registration Modal */}
      {showRegistration && (
        <VendorRegistration onClose={() => setShowRegistration(false)} />
      )}
    </div>
  );
};