import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ChevronDown, Copy, ExternalLink } from 'lucide-react';

export const WalletConnection: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [address] = useState('0x742d35Cc6539C93d37240B19BbE35d4F6F2E4e72');

  const connectWallet = async () => {
    // Mock MetaMask connection
    setIsConnected(true);
    setShowDropdown(false);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setShowDropdown(false);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative">
      {!isConnected ? (
        <motion.button
          onClick={connectWallet}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </motion.button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <div className="h-2 w-2 bg-green-400 rounded-full"></div>
            <span className="font-mono text-sm">{formatAddress(address)}</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50"
            >
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Wallet Address</span>
                  <div className="flex space-x-2">
                    <button className="text-white/70 hover:text-white">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-white/70 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="font-mono text-sm text-white break-all">{address}</div>
              </div>
              
              <div className="p-4 border-b border-white/20">
                <div className="text-sm text-white/70 mb-1">Balance</div>
                <div className="text-lg font-semibold text-white">1,247.82 ETH</div>
                <div className="text-sm text-white/70">≈ $2,495,640 USD</div>
              </div>

              <div className="p-2">
                <button
                  onClick={disconnectWallet}
                  className="w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                >
                  Disconnect Wallet
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};