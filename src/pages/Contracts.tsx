import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  Shield,
  Zap,
  Eye,
  Download
} from 'lucide-react';

const mockContracts = [
  {
    id: 'SC-2024-001',
    title: 'Industrial IoT Sensors Supply',
    vendor: 'TechSupply Solutions',
    value: 45000,
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-03-15',
    progress: 65,
    milestones: [
      { name: 'Contract Signed', completed: true, date: '2024-01-20' },
      { name: 'Initial Payment', completed: true, date: '2024-01-25' },
      { name: 'Production Started', completed: true, date: '2024-02-01' },
      { name: 'Quality Inspection', completed: false, date: '2024-02-20' },
      { name: 'Final Delivery', completed: false, date: '2024-03-15' },
    ],
    paymentSchedule: [
      { amount: 22500, dueDate: '2024-01-25', status: 'paid' },
      { amount: 22500, dueDate: '2024-03-15', status: 'pending' },
    ],
    deliveryAddress: 'Singapore Manufacturing Hub',
    riskScore: 15,
  },
  {
    id: 'SC-2024-002',
    title: 'Sustainable Packaging Materials',
    vendor: 'EcoSupply Chain',
    value: 28000,
    status: 'completed',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    progress: 100,
    milestones: [
      { name: 'Contract Signed', completed: true, date: '2024-01-10' },
      { name: 'Initial Payment', completed: true, date: '2024-01-15' },
      { name: 'Production Started', completed: true, date: '2024-01-20' },
      { name: 'Quality Inspection', completed: true, date: '2024-02-15' },
      { name: 'Final Delivery', completed: true, date: '2024-02-28' },
    ],
    paymentSchedule: [
      { amount: 14000, dueDate: '2024-01-15', status: 'paid' },
      { amount: 14000, dueDate: '2024-02-28', status: 'paid' },
    ],
    deliveryAddress: 'Amsterdam Distribution Center',
    riskScore: 5,
  },
  {
    id: 'SC-2024-003',
    title: 'Manufacturing Equipment Setup',
    vendor: 'Global Manufacturing Co.',
    value: 180000,
    status: 'pending',
    startDate: '2024-02-01',
    endDate: '2024-05-15',
    progress: 25,
    milestones: [
      { name: 'Contract Signed', completed: true, date: '2024-02-01' },
      { name: 'Initial Payment', completed: true, date: '2024-02-05' },
      { name: 'Equipment Manufacturing', completed: false, date: '2024-03-15' },
      { name: 'Installation & Testing', completed: false, date: '2024-04-30' },
      { name: 'Final Acceptance', completed: false, date: '2024-05-15' },
    ],
    paymentSchedule: [
      { amount: 90000, dueDate: '2024-02-05', status: 'paid' },
      { amount: 54000, dueDate: '2024-04-15', status: 'pending' },
      { amount: 36000, dueDate: '2024-05-15', status: 'pending' },
    ],
    deliveryAddress: 'Berlin Production Facility',
    riskScore: 35,
  },
];

export const Contracts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  const statuses = ['all', 'active', 'completed', 'pending', 'cancelled'];

  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'text-green-400';
    if (score <= 50) return 'text-yellow-400';
    return 'text-red-400';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Smart Contracts</h1>
          <p className="text-white/70 mt-1">Monitor and manage your automated contract executions</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <Shield className="h-4 w-4 text-green-400" />
          <span>Blockchain secured</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Contracts', value: '12', icon: FileText, color: 'from-green-500 to-green-600' },
          { label: 'Total Value', value: '$2.8M', icon: DollarSign, color: 'from-blue-500 to-blue-600' },
          { label: 'Avg. Completion', value: '94%', icon: CheckCircle, color: 'from-purple-500 to-purple-600' },
          { label: 'Risk Score', value: '18/100', icon: AlertTriangle, color: 'from-orange-500 to-orange-600' },
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
            placeholder="Search contracts by title or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
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
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
          >
            {/* Contract Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{contract.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(contract.status)} capitalize`}>
                    {contract.status}
                  </span>
                </div>
                <p className="text-white/70 text-sm mb-2">Vendor: {contract.vendor}</p>
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span>ID: {contract.id}</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{formatCurrency(contract.value)}</div>
                <div className="text-sm text-white/70">Contract Value</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Progress</span>
                <span className="text-sm font-medium text-white">{contract.progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${contract.progress}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className={`h-2 rounded-full ${
                    contract.progress >= 90 ? 'bg-green-400' :
                    contract.progress >= 50 ? 'bg-blue-400' : 'bg-yellow-400'
                  }`}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-xs text-white/70">Risk Score</div>
                <div className={`text-sm font-medium ${getRiskColor(contract.riskScore)}`}>
                  {contract.riskScore}/100
                </div>
              </div>
              <div>
                <div className="text-xs text-white/70">Milestones</div>
                <div className="text-sm font-medium text-white">
                  {contract.milestones.filter(m => m.completed).length}/{contract.milestones.length}
                </div>
              </div>
              <div>
                <div className="text-xs text-white/70">Payments</div>
                <div className="text-sm font-medium text-white">
                  {contract.paymentSchedule.filter(p => p.status === 'paid').length}/{contract.paymentSchedule.length}
                </div>
              </div>
              <div>
                <div className="text-xs text-white/70">Delivery</div>
                <div className="text-sm font-medium text-white truncate">
                  {contract.deliveryAddress}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Zap className="h-4 w-4 text-green-400" />
                <span>Smart contract active</span>
              </div>
              
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-sm hover:bg-white/20 transition-all duration-200"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Contract Insights */}
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
          <h3 className="text-lg font-semibold text-white">AI Contract Intelligence</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Risk Assessment</h4>
            <p className="text-white/70">
              Contract SC-2024-003 shows elevated risk due to extended timeline. Consider milestone adjustments.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Optimization Opportunity</h4>
            <p className="text-white/70">
              Payment terms for active contracts could be optimized to improve cash flow by 12%.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};