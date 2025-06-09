import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Target,
  Zap,
  Brain,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const performanceData = [
  { month: 'Jan', procurement: 2400, cost: 1800, savings: 600 },
  { month: 'Feb', procurement: 1398, cost: 2200, savings: 450 },
  { month: 'Mar', procurement: 9800, cost: 3400, savings: 1200 },
  { month: 'Apr', procurement: 3908, cost: 2800, savings: 890 },
  { month: 'May', procurement: 4800, cost: 4200, savings: 950 },
  { month: 'Jun', procurement: 3800, cost: 3600, savings: 780 },
];

const vendorPerformance = [
  { name: 'TechSupply Solutions', score: 95, orders: 124, volume: 2400000 },
  { name: 'Global Manufacturing', score: 87, orders: 89, volume: 1800000 },
  { name: 'EcoSupply Chain', score: 92, orders: 67, volume: 950000 },
  { name: 'Industrial Systems', score: 88, orders: 78, volume: 1200000 },
  { name: 'Smart Logistics', score: 91, orders: 56, volume: 890000 },
];

const categoryDistribution = [
  { name: 'Electronics', value: 35, color: '#3B82F6' },
  { name: 'Manufacturing', value: 28, color: '#8B5CF6' },
  { name: 'Sustainable Materials', value: 18, color: '#10B981' },
  { name: 'Logistics', value: 12, color: '#F59E0B' },
  { name: 'Others', value: 7, color: '#EF4444' },
];

const aiInsights = [
  {
    type: 'optimization',
    title: 'Cost Optimization Opportunity',
    description: 'AI detected 12% potential savings in Q2 electronics procurement through vendor consolidation.',
    impact: 'High',
    recommendation: 'Consolidate orders with top 3 electronics vendors for better pricing tiers.',
  },
  {
    type: 'risk',
    title: 'Supply Chain Risk Alert',
    description: 'Increased delivery delays detected in Asia-Pacific region due to seasonal factors.',
    impact: 'Medium',
    recommendation: 'Consider alternative suppliers or adjust delivery timelines for Q3.',
  },
  {
    type: 'trend',
    title: 'Market Trend Analysis',
    description: 'Sustainable materials demand increased 45% this quarter, pricing expected to stabilize.',
    impact: 'Low',
    recommendation: 'Lock in rates for sustainable materials before Q4 price adjustments.',
  },
];

export const Analytics: React.FC = () => {
  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return <Target className="h-5 w-5" />;
      case 'risk':
        return <AlertCircle className="h-5 w-5" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Supply Chain Analytics</h1>
          <p className="text-white/70 mt-1">AI-powered insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-white/70">
          <Activity className="h-4 w-4 text-green-400" />
          <span>Real-time analytics</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Savings', value: '$486K', change: '+23.1%', icon: TrendingUp, color: 'from-green-500 to-green-600' },
          { label: 'Procurement Efficiency', value: '94.2%', change: '+5.8%', icon: Target, color: 'from-blue-500 to-blue-600' },
          { label: 'Vendor Performance', value: '89.6', change: '+2.4%', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
          { label: 'Risk Score', value: '18/100', change: '-12%', icon: AlertCircle, color: 'from-orange-500 to-orange-600' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${metric.color}`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-sm text-green-400">{metric.change}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-white/70">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Performance & Savings Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="procurementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Area
                type="monotone"
                dataKey="procurement"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#procurementGradient)"
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#savingsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Procurement by Category</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Vendor Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Top Vendor Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vendorPerformance} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="rgba(255,255,255,0.7)" />
            <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.7)" width={150} />
            <Bar dataKey="score" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">AI-Powered Insights</h3>
        </div>
        
        <div className="space-y-4">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{insight.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getImpactColor(insight.impact)}`}>
                      {insight.impact} Impact
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{insight.description}</p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-300 text-sm">
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};