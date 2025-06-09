import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const procurementData = [
  { month: 'Jan', volume: 2400, cost: 1800 },
  { month: 'Feb', volume: 1398, cost: 2200 },
  { month: 'Mar', volume: 9800, cost: 3400 },
  { month: 'Apr', volume: 3908, cost: 2800 },
  { month: 'May', volume: 4800, cost: 4200 },
  { month: 'Jun', volume: 3800, cost: 3600 },
];

const vendorDistribution = [
  { name: 'Verified', value: 65, color: '#10B981' },
  { name: 'Pending', value: 25, color: '#F59E0B' },
  { name: 'Rejected', value: 10, color: '#EF4444' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Supply Chain Dashboard</h1>
          <p className="text-white/70 mt-1">Monitor your decentralized procurement operations</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <Activity className="h-4 w-4 text-green-400" />
          <span>Real-time data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Procurement Volume', value: '$2.4M', change: '+12.5%', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
          { label: 'Active Vendors', value: '156', change: '+8.2%', icon: Users, color: 'from-purple-500 to-purple-600' },
          { label: 'Active Contracts', value: '89', change: '+15.3%', icon: ShoppingCart, color: 'from-green-500 to-green-600' },
          { label: 'Cost Savings', value: '18.2%', change: '+2.1%', icon: DollarSign, color: 'from-orange-500 to-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-green-400">{stat.change}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Procurement Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Procurement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={procurementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="cost" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vendor Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Vendor Status Distribution</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vendorDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {vendorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {vendorDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-white/70">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Recent Activities</h3>
        <div className="space-y-4">
          {[
            { type: 'contract', icon: CheckCircle, color: 'text-green-400', message: 'Smart contract executed for Vendor #VND-001', time: '2 minutes ago' },
            { type: 'bid', icon: Clock, color: 'text-blue-400', message: 'New bid received for procurement request #PR-2024-001', time: '5 minutes ago' },
            { type: 'alert', icon: AlertTriangle, color: 'text-orange-400', message: 'Delivery delay detected for contract #SC-2024-078', time: '12 minutes ago' },
            { type: 'vendor', icon: Users, color: 'text-purple-400', message: 'New vendor registered: TechSupply Solutions', time: '1 hour ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
              <activity.icon className={`h-5 w-5 ${activity.color}`} />
              <div className="flex-1">
                <div className="text-white text-sm">{activity.message}</div>
                <div className="text-white/50 text-xs mt-1">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};