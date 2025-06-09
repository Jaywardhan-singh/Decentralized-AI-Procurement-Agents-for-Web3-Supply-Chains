import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Zap
} from 'lucide-react';
import { ProcurementRequest } from '../components/ProcurementRequest';
import { CreateProcurementModal } from '../components/CreateProcurementModal';

const mockRequests = [
  {
    id: 'PR-2024-001',
    title: 'Industrial IoT Sensors',
    category: 'Electronics',
    description: 'High-precision temperature and humidity sensors for industrial monitoring',
    budget: 45000,
    quantity: 500,
    deadline: '2024-02-15',
    status: 'active',
    bidsReceived: 12,
    requiredSpecs: ['IP67 rating', 'LoRaWAN connectivity', 'Battery life >5 years'],
    location: 'Singapore',
    createdDate: '2024-01-15',
    estimatedDelivery: '2024-03-01',
  },
  {
    id: 'PR-2024-002',
    title: 'Sustainable Packaging Materials',
    category: 'Sustainable Materials',
    description: 'Biodegradable packaging solutions for e-commerce operations',
    budget: 28000,
    quantity: 10000,
    deadline: '2024-02-20',
    status: 'evaluating',
    bidsReceived: 8,
    requiredSpecs: ['100% biodegradable', 'Water-resistant', 'Custom branding'],
    location: 'Netherlands',
    createdDate: '2024-01-18',
    estimatedDelivery: '2024-03-10',
  },
  {
    id: 'PR-2024-003',
    title: 'Manufacturing Equipment Upgrade',
    category: 'Manufacturing',
    description: 'CNC machining centers with advanced automation capabilities',
    budget: 180000,
    quantity: 3,
    deadline: '2024-02-28',
    status: 'completed',
    bidsReceived: 6,
    requiredSpecs: ['5-axis capability', 'Tool changer', 'Remote monitoring'],
    location: 'Germany',
    createdDate: '2024-01-10',
    estimatedDelivery: '2024-04-15',
  },
];

export const Procurement: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const statuses = ['all', 'active', 'evaluating', 'completed', 'cancelled'];
  const categories = ['all', 'Electronics', 'Manufacturing', 'Sustainable Materials', 'Logistics'];

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-green-500 to-green-600';
      case 'evaluating':
        return 'from-yellow-500 to-yellow-600';
      case 'completed':
        return 'from-blue-500 to-blue-600';
      case 'cancelled':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Procurement Requests</h1>
          <p className="text-white/70 mt-1">Manage and track your procurement requirements</p>
        </div>
        <motion.button
          onClick={() => setShowCreateModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>New Request</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Requests', value: '24', icon: Clock, color: 'from-green-500 to-green-600' },
          { label: 'Total Budget', value: '$1.2M', icon: DollarSign, color: 'from-blue-500 to-blue-600' },
          { label: 'Avg. Bids/Request', value: '8.4', icon: Users, color: 'from-purple-500 to-purple-600' },
          { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
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

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
          <input
            type="text"
            placeholder="Search procurement requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-white/70" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status} className="bg-slate-800 capitalize">
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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

      {/* Procurement Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProcurementRequest request={request} />
          </motion.div>
        ))}
      </div>

      {/* AI-Powered Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">AI Procurement Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Market Trends</h4>
            <p className="text-white/70">
              Electronics demand is 15% higher than last quarter. Consider adjusting budgets for IoT projects.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Vendor Recommendations</h4>
            <p className="text-white/70">
              3 high-rated vendors match your current requirements. AI suggests reaching out proactively.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Create Procurement Modal */}
      {showCreateModal && (
        <CreateProcurementModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};