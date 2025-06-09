// Global variables
let currentPage = 'dashboard';
let walletConnected = false;
let userAddress = null;
let userBalance = 0;
let web3 = null;
let currentUserType = 'buyer'; // 'buyer' or 'vendor'

// Data storage
let vendors = [
    {
        id: 'VND-001',
        name: 'TechSupply Solutions',
        category: 'electronics',
        location: 'Singapore',
        email: 'contact@techsupply.sg',
        trustScore: 95,
        completedOrders: 124,
        specialties: ['IoT Devices', 'Semiconductors', 'Hardware'],
        verified: true,
        rating: 4.8,
        joinDate: '2023-01-15'
    },
    {
        id: 'VND-002',
        name: 'Global Manufacturing Co.',
        category: 'manufacturing',
        location: 'Germany',
        email: 'info@globalmanufacturing.de',
        trustScore: 87,
        completedOrders: 89,
        specialties: ['Industrial Equipment', 'Machinery', 'Tools'],
        verified: true,
        rating: 4.6,
        joinDate: '2023-02-20'
    },
    {
        id: 'VND-003',
        name: 'EcoSupply Chain',
        category: 'sustainable',
        location: 'Netherlands',
        email: 'hello@ecosupply.nl',
        trustScore: 92,
        completedOrders: 67,
        specialties: ['Recycled Materials', 'Green Energy', 'Sustainability'],
        verified: true,
        rating: 4.9,
        joinDate: '2023-03-10'
    }
];

let procurementRequests = [
    {
        id: 'PR-2024-001',
        title: 'Industrial IoT Sensors',
        category: 'electronics',
        description: 'High-precision temperature and humidity sensors for industrial monitoring',
        budget: 45000,
        quantity: 500,
        deadline: '2024-02-15',
        status: 'active',
        bids: [
            { vendorId: 'VND-001', amount: 42000, deliveryTime: '3 weeks', message: 'Premium quality sensors with 5-year warranty' },
            { vendorId: 'VND-003', amount: 44000, deliveryTime: '2 weeks', message: 'Eco-friendly sensors with sustainable packaging' }
        ],
        createdDate: '2024-01-15',
        createdBy: 'buyer'
    },
    {
        id: 'PR-2024-002',
        title: 'Sustainable Packaging Materials',
        category: 'sustainable',
        description: 'Biodegradable packaging solutions for e-commerce operations',
        budget: 28000,
        quantity: 10000,
        deadline: '2024-02-20',
        status: 'evaluating',
        bids: [
            { vendorId: 'VND-003', amount: 26500, deliveryTime: '4 weeks', message: 'Certified biodegradable materials with custom branding' }
        ],
        createdDate: '2024-01-18',
        createdBy: 'buyer'
    }
];

let smartContracts = [
    {
        id: 'SC-2024-001',
        title: 'Industrial IoT Sensors Supply',
        vendorId: 'VND-001',
        procurementId: 'PR-2024-001',
        value: 42000,
        status: 'active',
        progress: 65,
        startDate: '2024-01-20',
        endDate: '2024-03-15',
        milestones: [
            { name: 'Contract Signed', completed: true, date: '2024-01-20' },
            { name: 'Initial Payment', completed: true, date: '2024-01-25' },
            { name: 'Production Started', completed: true, date: '2024-02-01' },
            { name: 'Quality Inspection', completed: false, date: '2024-02-20' },
            { name: 'Final Delivery', completed: false, date: '2024-03-15' }
        ]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    initializeCharts();
    loadDashboardData();
});

function initializeApp() {
    showPage('dashboard');
    
    // Check if Web3 is available
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        console.log('Web3 detected');
        updateNetworkStatus('warning', 'MetaMask Detected');
    } else {
        console.log('Web3 not detected');
        updateNetworkStatus('error', 'MetaMask Required');
        showNotification('MetaMask is required to use this application', 'error');
    }
    
    // Load saved data from localStorage
    loadDataFromStorage();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
            
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Wallet connection
    const connectWalletBtn = document.getElementById('connectWallet');
    const disconnectWalletBtn = document.getElementById('disconnectWallet');
    const copyAddressBtn = document.getElementById('copyAddress');
    
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
    }
    
    if (disconnectWalletBtn) {
        disconnectWalletBtn.addEventListener('click', disconnectWallet);
    }

    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', copyWalletAddress);
    }

    // Chat functionality
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendChatMessage);
    }

    // Quick actions
    document.querySelectorAll('.quick-action').forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.getAttribute('data-action');
            handleQuickAction(actionType);
        });
    });

    // Vendor registration
    const registerVendorBtn = document.getElementById('registerVendorBtn');
    if (registerVendorBtn) {
        registerVendorBtn.addEventListener('click', () => showVendorRegistrationModal());
    }

    // New procurement request
    const newRequestBtn = document.getElementById('newRequestBtn');
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', () => showProcurementModal());
    }

    // Search functionality
    const vendorSearch = document.getElementById('vendorSearch');
    const procurementSearch = document.getElementById('procurementSearch');
    const vendorCategoryFilter = document.getElementById('vendorCategoryFilter');
    const procurementStatusFilter = document.getElementById('procurementStatusFilter');

    if (vendorSearch) {
        vendorSearch.addEventListener('input', filterVendors);
    }
    if (procurementSearch) {
        procurementSearch.addEventListener('input', filterProcurementRequests);
    }
    if (vendorCategoryFilter) {
        vendorCategoryFilter.addEventListener('change', filterVendors);
    }
    if (procurementStatusFilter) {
        procurementStatusFilter.addEventListener('change', filterProcurementRequests);
    }

    // Modal functionality
    setupModalEventListeners();

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

function setupModalEventListeners() {
    // Confirmation modal
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const cancelConfirm = document.getElementById('cancelConfirm');
    const confirmAction = document.getElementById('confirmAction');

    if (closeConfirmModal) {
        closeConfirmModal.addEventListener('click', () => hideModal('confirmModal'));
    }
    if (cancelConfirm) {
        cancelConfirm.addEventListener('click', () => hideModal('confirmModal'));
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('fade-in');
        currentPage = pageId;
        
        updatePageContent(pageId);
    }
}

function updatePageContent(pageId) {
    switch(pageId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'vendors':
            loadVendorData();
            break;
        case 'procurement':
            loadProcurementData();
            break;
        case 'contracts':
            loadContractData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'ai-assistant':
            // AI assistant is already initialized
            break;
    }
}

// Wallet Connection Functions
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        showNotification('MetaMask is not installed. Please install MetaMask to continue.', 'error');
        return;
    }

    try {
        showLoading('Connecting to MetaMask...');
        
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        if (accounts.length > 0) {
            userAddress = accounts[0];
            walletConnected = true;
            
            // Get balance
            const balance = await web3.eth.getBalance(userAddress);
            userBalance = parseFloat(web3.utils.fromWei(balance, 'ether'));
            
            // Get network info
            const networkId = await web3.eth.net.getId();
            const networkName = getNetworkName(networkId);
            
            // Update UI
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('walletInfo').style.display = 'flex';
            document.getElementById('walletAddress').textContent = formatAddress(userAddress);
            document.getElementById('walletBalance').textContent = `${userBalance.toFixed(4)} ETH`;
            
            updateNetworkStatus('success', networkName);
            
            showNotification('Wallet connected successfully!', 'success');
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showNotification('Failed to connect wallet. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

function disconnectWallet() {
    walletConnected = false;
    userAddress = null;
    userBalance = 0;
    
    document.getElementById('connectWallet').style.display = 'flex';
    document.getElementById('walletInfo').style.display = 'none';
    
    updateNetworkStatus('warning', 'MetaMask Detected');
    showNotification('Wallet disconnected', 'info');
}

function copyWalletAddress() {
    if (userAddress) {
        navigator.clipboard.writeText(userAddress).then(() => {
            showNotification('Address copied to clipboard!', 'success');
        });
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        userAddress = accounts[0];
        document.getElementById('walletAddress').textContent = formatAddress(userAddress);
        updateBalance();
    }
}

function handleChainChanged(chainId) {
    window.location.reload();
}

async function updateBalance() {
    if (walletConnected && userAddress) {
        try {
            const balance = await web3.eth.getBalance(userAddress);
            userBalance = parseFloat(web3.utils.fromWei(balance, 'ether'));
            document.getElementById('walletBalance').textContent = `${userBalance.toFixed(4)} ETH`;
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    }
}

function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getNetworkName(networkId) {
    const networks = {
        1: 'Ethereum Mainnet',
        3: 'Ropsten Testnet',
        4: 'Rinkeby Testnet',
        5: 'Goerli Testnet',
        42: 'Kovan Testnet',
        5777: 'Ganache Local',
        1337: 'Localhost'
    };
    return networks[networkId] || `Network ${networkId}`;
}

function updateNetworkStatus(type, name) {
    const indicator = document.getElementById('statusIndicator');
    const networkName = document.getElementById('networkName');
    
    if (indicator && networkName) {
        indicator.className = `status-indicator ${type}`;
        networkName.textContent = name;
    }
}

// Transaction Functions
async function processTransaction(amount, description) {
    if (!walletConnected) {
        showNotification('Please connect your wallet first', 'error');
        return false;
    }

    if (userBalance < amount) {
        showNotification(`Insufficient balance. Required: ${amount} ETH`, 'error');
        return false;
    }

    try {
        showLoading(`Processing ${description}...`);
        
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update balance
        userBalance -= amount;
        document.getElementById('walletBalance').textContent = `${userBalance.toFixed(4)} ETH`;
        
        showNotification(`Transaction successful! ${amount} ETH deducted for ${description}`, 'success');
        
        // Add to activity log
        addActivity('transaction', `${description} - ${amount} ETH deducted`, 'just now');
        
        return true;
    } catch (error) {
        console.error('Transaction error:', error);
        showNotification('Transaction failed. Please try again.', 'error');
        return false;
    } finally {
        hideLoading();
    }
}

// Data Loading Functions
function loadDashboardData() {
    // Update stats
    document.getElementById('totalVolume').textContent = '$2.4M';
    document.getElementById('activeVendors').textContent = vendors.length.toString();
    document.getElementById('activeContracts').textContent = smartContracts.length.toString();
    
    // Load recent activities
    loadRecentActivities();
}

function loadVendorData() {
    const vendorGrid = document.getElementById('vendorGrid');
    if (!vendorGrid) return;
    
    vendorGrid.innerHTML = '';
    
    vendors.forEach(vendor => {
        const vendorCard = createVendorCard(vendor);
        vendorGrid.appendChild(vendorCard);
    });
}

function loadProcurementData() {
    const procurementList = document.getElementById('procurementList');
    if (!procurementList) return;
    
    procurementList.innerHTML = '';
    
    procurementRequests.forEach(request => {
        const requestCard = createProcurementCard(request);
        procurementList.appendChild(requestCard);
    });
}

function loadContractData() {
    const contractsList = document.getElementById('contractsList');
    if (!contractsList) return;
    
    contractsList.innerHTML = '';
    
    smartContracts.forEach(contract => {
        const contractCard = createContractCard(contract);
        contractsList.appendChild(contractCard);
    });
}

function loadAnalyticsData() {
    // Analytics data is already loaded in the HTML
    console.log('Analytics data loaded');
}

function loadRecentActivities() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activities = [
        { type: 'contract', icon: 'fas fa-check-circle', color: 'green', message: 'Smart contract executed for TechSupply Solutions', time: '2 minutes ago' },
        { type: 'bid', icon: 'fas fa-clock', color: 'blue', message: 'New bid received for IoT Sensors procurement', time: '8 minutes ago' },
        { type: 'alert', icon: 'fas fa-exclamation-triangle', color: 'orange', message: 'Delivery delay detected for Contract #SC-2024-001', time: '15 minutes ago' },
        { type: 'vendor', icon: 'fas fa-users', color: 'purple', message: 'New vendor registered: EcoSupply Chain', time: '1 hour ago' }
    ];
    
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <span>${activity.time}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function addActivity(type, message, time) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    const iconMap = {
        transaction: 'fas fa-dollar-sign',
        vendor: 'fas fa-users',
        procurement: 'fas fa-shopping-cart',
        contract: 'fas fa-file-contract'
    };
    
    activityItem.innerHTML = `
        <div class="activity-icon blue">
            <i class="${iconMap[type] || 'fas fa-info-circle'}"></i>
        </div>
        <div class="activity-content">
            <p>${message}</p>
            <span>${time}</span>
        </div>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
}

// Card Creation Functions
function createVendorCard(vendor) {
    const card = document.createElement('div');
    card.className = 'vendor-card';
    card.innerHTML = `
        <div class="vendor-header">
            <h3>${vendor.name}</h3>
            <div class="vendor-rating">
                <i class="fas fa-star"></i>
                <span>${vendor.rating}</span>
            </div>
        </div>
        <div class="vendor-info">
            <p><i class="fas fa-map-marker-alt"></i> ${vendor.location}</p>
            <p><i class="fas fa-tag"></i> ${vendor.category}</p>
            <p><i class="fas fa-envelope"></i> ${vendor.email}</p>
        </div>
        <div class="vendor-stats">
            <div class="stat">
                <span class="label">Trust Score</span>
                <span class="value">${vendor.trustScore}/100</span>
            </div>
            <div class="stat">
                <span class="label">Orders</span>
                <span class="value">${vendor.completedOrders}</span>
            </div>
        </div>
        <div class="vendor-specialties">
            ${vendor.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
        </div>
        <div class="vendor-actions">
            <button class="secondary-btn" onclick="contactVendor('${vendor.id}')">
                <i class="fas fa-envelope"></i> Contact
            </button>
            <button class="danger-btn" onclick="deleteVendor('${vendor.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
}

function createProcurementCard(request) {
    const card = document.createElement('div');
    card.className = 'procurement-card';
    
    const statusClass = {
        'active': 'active',
        'evaluating': 'evaluating',
        'completed': 'completed',
        'cancelled': 'cancelled'
    };
    
    card.innerHTML = `
        <div class="procurement-header">
            <h3>${request.title}</h3>
            <span class="status ${statusClass[request.status]}">${request.status}</span>
        </div>
        <p>${request.description}</p>
        <div class="procurement-details">
            <div class="detail">
                <span class="label">Budget:</span>
                <span class="value">$${request.budget.toLocaleString()}</span>
            </div>
            <div class="detail">
                <span class="label">Quantity:</span>
                <span class="value">${request.quantity}</span>
            </div>
            <div class="detail">
                <span class="label">Bids:</span>
                <span class="value">${request.bids.length}</span>
            </div>
            <div class="detail">
                <span class="label">Deadline:</span>
                <span class="value">${new Date(request.deadline).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="procurement-actions">
            <button class="secondary-btn" onclick="viewBids('${request.id}')">
                <i class="fas fa-eye"></i> View Bids
            </button>
            <button class="primary-btn" onclick="manageRequest('${request.id}')">
                <i class="fas fa-cog"></i> Manage
            </button>
            <button class="danger-btn" onclick="deleteProcurementRequest('${request.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
}

function createContractCard(contract) {
    const card = document.createElement('div');
    card.className = 'contract-card';
    
    const vendor = vendors.find(v => v.id === contract.vendorId);
    const vendorName = vendor ? vendor.name : 'Unknown Vendor';
    
    card.innerHTML = `
        <div class="contract-header">
            <h3>${contract.id}: ${contract.title}</h3>
            <span class="status ${contract.status}">${contract.status}</span>
        </div>
        <div class="contract-details">
            <div class="detail">
                <span class="label">Vendor:</span>
                <span class="value">${vendorName}</span>
            </div>
            <div class="detail">
                <span class="label">Value:</span>
                <span class="value">$${contract.value.toLocaleString()}</span>
            </div>
            <div class="detail">
                <span class="label">Progress:</span>
                <span class="value">${contract.progress}%</span>
            </div>
            <div class="detail">
                <span class="label">End Date:</span>
                <span class="value">${new Date(contract.endDate).toLocaleDateString()}</span>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress" style="width: ${contract.progress}%"></div>
        </div>
        <div class="contract-actions">
            <button class="secondary-btn" onclick="viewContractDetails('${contract.id}')">
                <i class="fas fa-eye"></i> View Details
            </button>
            <button class="primary-btn" onclick="exportContract('${contract.id}')">
                <i class="fas fa-download"></i> Export
            </button>
            <button class="danger-btn" onclick="deleteContract('${contract.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
}

// Action Functions
async function contactVendor(vendorId) {
    const success = await processTransaction(1.5, 'Vendor Contact');
    if (success) {
        const vendor = vendors.find(v => v.id === vendorId);
        if (vendor) {
            showNotification(`Contact request sent to ${vendor.name}`, 'success');
            addActivity('vendor', `Contacted vendor: ${vendor.name}`, 'just now');
        }
    }
}

async function viewBids(requestId) {
    const success = await processTransaction(1.0, 'View Bids');
    if (success) {
        const request = procurementRequests.find(r => r.id === requestId);
        if (request) {
            showBidsModal(request);
        }
    }
}

async function manageRequest(requestId) {
    const success = await processTransaction(1.5, 'Manage Request');
    if (success) {
        const request = procurementRequests.find(r => r.id === requestId);
        if (request) {
            showNotification(`Managing request: ${request.title}`, 'success');
            addActivity('procurement', `Managed request: ${request.title}`, 'just now');
        }
    }
}

async function viewContractDetails(contractId) {
    const success = await processTransaction(1.0, 'View Contract Details');
    if (success) {
        const contract = smartContracts.find(c => c.id === contractId);
        if (contract) {
            showContractDetailsModal(contract);
        }
    }
}

async function exportContract(contractId) {
    const success = await processTransaction(1.5, 'Export Contract');
    if (success) {
        const contract = smartContracts.find(c => c.id === contractId);
        if (contract) {
            downloadJSON(contract, `contract-${contractId}.json`);
            showNotification('Contract exported successfully', 'success');
        }
    }
}

function deleteVendor(vendorId) {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
        showConfirmationModal(
            'Delete Vendor',
            `Are you sure you want to delete ${vendor.name}? This action cannot be undone.`,
            () => {
                vendors = vendors.filter(v => v.id !== vendorId);
                saveDataToStorage();
                loadVendorData();
                showNotification('Vendor deleted successfully', 'success');
                addActivity('vendor', `Deleted vendor: ${vendor.name}`, 'just now');
            }
        );
    }
}

function deleteProcurementRequest(requestId) {
    const request = procurementRequests.find(r => r.id === requestId);
    if (request) {
        showConfirmationModal(
            'Delete Procurement Request',
            `Are you sure you want to delete "${request.title}"? This action cannot be undone.`,
            () => {
                procurementRequests = procurementRequests.filter(r => r.id !== requestId);
                saveDataToStorage();
                loadProcurementData();
                showNotification('Procurement request deleted successfully', 'success');
                addActivity('procurement', `Deleted request: ${request.title}`, 'just now');
            }
        );
    }
}

function deleteContract(contractId) {
    const contract = smartContracts.find(c => c.id === contractId);
    if (contract) {
        showConfirmationModal(
            'Delete Smart Contract',
            `Are you sure you want to delete contract ${contractId}? This action cannot be undone.`,
            () => {
                smartContracts = smartContracts.filter(c => c.id !== contractId);
                saveDataToStorage();
                loadContractData();
                showNotification('Smart contract deleted successfully', 'success');
                addActivity('contract', `Deleted contract: ${contractId}`, 'just now');
            }
        );
    }
}

// Modal Functions
function showVendorRegistrationModal() {
    const modalHTML = `
        <div id="vendorModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Register New Vendor</h2>
                    <span class="close" onclick="hideModal('vendorModal')">&times;</span>
                </div>
                <form id="vendorForm" onsubmit="submitVendorRegistration(event)">
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="vendorName">Company Name *</label>
                                <input type="text" id="vendorName" required>
                            </div>
                            <div class="form-group">
                                <label for="vendorCategory">Category *</label>
                                <select id="vendorCategory" required>
                                    <option value="">Select Category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="sustainable">Sustainable Materials</option>
                                    <option value="logistics">Logistics</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="vendorLocation">Location *</label>
                                <input type="text" id="vendorLocation" required>
                            </div>
                            <div class="form-group">
                                <label for="vendorEmail">Email *</label>
                                <input type="email" id="vendorEmail" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="vendorSpecialties">Specialties (comma-separated)</label>
                            <input type="text" id="vendorSpecialties" placeholder="e.g., IoT Devices, Semiconductors">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="secondary-btn" onclick="hideModal('vendorModal')">Cancel</button>
                        <button type="submit" class="primary-btn">Register Vendor</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showProcurementModal() {
    const modalHTML = `
        <div id="procurementModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create Procurement Request</h2>
                    <span class="close" onclick="hideModal('procurementModal')">&times;</span>
                </div>
                <form id="procurementForm" onsubmit="submitProcurementRequest(event)">
                    <div class="modal-body">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="procurementTitle">Title *</label>
                                <input type="text" id="procurementTitle" required>
                            </div>
                            <div class="form-group">
                                <label for="procurementCategory">Category *</label>
                                <select id="procurementCategory" required>
                                    <option value="">Select Category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="sustainable">Sustainable Materials</option>
                                    <option value="logistics">Logistics</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="procurementDescription">Description *</label>
                            <textarea id="procurementDescription" required></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="procurementBudget">Budget ($) *</label>
                                <input type="number" id="procurementBudget" required min="1">
                            </div>
                            <div class="form-group">
                                <label for="procurementQuantity">Quantity *</label>
                                <input type="number" id="procurementQuantity" required min="1">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="procurementDeadline">Deadline *</label>
                            <input type="date" id="procurementDeadline" required>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="secondary-btn" onclick="hideModal('procurementModal')">Cancel</button>
                        <button type="submit" class="primary-btn">Create Request</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('procurementDeadline').min = today;
}

function showBidsModal(request) {
    const bidsHTML = request.bids.map(bid => {
        const vendor = vendors.find(v => v.id === bid.vendorId);
        return `
            <div class="bid-item">
                <div class="bid-header">
                    <h4>${vendor ? vendor.name : 'Unknown Vendor'}</h4>
                    <span class="bid-amount">$${bid.amount.toLocaleString()}</span>
                </div>
                <p><strong>Delivery Time:</strong> ${bid.deliveryTime}</p>
                <p><strong>Message:</strong> ${bid.message}</p>
                <button class="primary-btn" onclick="acceptBid('${request.id}', '${bid.vendorId}')">Accept Bid</button>
            </div>
        `;
    }).join('');
    
    const modalHTML = `
        <div id="bidsModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Bids for: ${request.title}</h2>
                    <span class="close" onclick="hideModal('bidsModal')">&times;</span>
                </div>
                <div class="modal-body">
                    ${bidsHTML || '<p>No bids received yet.</p>'}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showContractDetailsModal(contract) {
    const vendor = vendors.find(v => v.id === contract.vendorId);
    const milestonesHTML = contract.milestones.map(milestone => `
        <div class="milestone-item ${milestone.completed ? 'completed' : 'pending'}">
            <i class="fas ${milestone.completed ? 'fa-check-circle' : 'fa-clock'}"></i>
            <span>${milestone.name}</span>
            <span class="milestone-date">${milestone.date}</span>
        </div>
    `).join('');
    
    const modalHTML = `
        <div id="contractDetailsModal" class="modal" style="display: block;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Contract Details: ${contract.id}</h2>
                    <span class="close" onclick="hideModal('contractDetailsModal')">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="contract-info">
                        <h3>${contract.title}</h3>
                        <p><strong>Vendor:</strong> ${vendor ? vendor.name : 'Unknown'}</p>
                        <p><strong>Value:</strong> $${contract.value.toLocaleString()}</p>
                        <p><strong>Status:</strong> ${contract.status}</p>
                        <p><strong>Progress:</strong> ${contract.progress}%</p>
                        <p><strong>Start Date:</strong> ${new Date(contract.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> ${new Date(contract.endDate).toLocaleDateString()}</p>
                    </div>
                    <div class="milestones">
                        <h4>Milestones</h4>
                        ${milestonesHTML}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function showConfirmationModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const messageEl = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmAction');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Remove existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        hideModal('confirmModal');
    });
    
    modal.style.display = 'block';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        if (modalId !== 'confirmModal') {
            modal.remove();
        }
    }
}

// Form Submission Functions
async function submitVendorRegistration(event) {
    event.preventDefault();
    
    const success = await processTransaction(2.0, 'Vendor Registration');
    if (!success) return;
    
    const formData = {
        id: `VND-${String(vendors.length + 1).padStart(3, '0')}`,
        name: document.getElementById('vendorName').value,
        category: document.getElementById('vendorCategory').value,
        location: document.getElementById('vendorLocation').value,
        email: document.getElementById('vendorEmail').value,
        specialties: document.getElementById('vendorSpecialties').value.split(',').map(s => s.trim()).filter(s => s),
        trustScore: Math.floor(Math.random() * 20) + 80, // Random score 80-100
        completedOrders: 0,
        verified: false,
        rating: 0,
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    vendors.push(formData);
    saveDataToStorage();
    loadVendorData();
    hideModal('vendorModal');
    
    showNotification('Vendor registered successfully!', 'success');
    addActivity('vendor', `New vendor registered: ${formData.name}`, 'just now');
}

async function submitProcurementRequest(event) {
    event.preventDefault();
    
    const success = await processTransaction(2.0, 'Procurement Request Creation');
    if (!success) return;
    
    const formData = {
        id: `PR-2024-${String(procurementRequests.length + 1).padStart(3, '0')}`,
        title: document.getElementById('procurementTitle').value,
        category: document.getElementById('procurementCategory').value,
        description: document.getElementById('procurementDescription').value,
        budget: parseInt(document.getElementById('procurementBudget').value),
        quantity: parseInt(document.getElementById('procurementQuantity').value),
        deadline: document.getElementById('procurementDeadline').value,
        status: 'active',
        bids: [],
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'buyer'
    };
    
    procurementRequests.push(formData);
    saveDataToStorage();
    loadProcurementData();
    hideModal('procurementModal');
    
    showNotification('Procurement request created successfully!', 'success');
    addActivity('procurement', `New request created: ${formData.title}`, 'just now');
}

async function acceptBid(requestId, vendorId) {
    const success = await processTransaction(1.5, 'Accept Bid');
    if (!success) return;
    
    const request = procurementRequests.find(r => r.id === requestId);
    const vendor = vendors.find(v => v.id === vendorId);
    const bid = request.bids.find(b => b.vendorId === vendorId);
    
    if (request && vendor && bid) {
        // Create smart contract
        const contract = {
            id: `SC-2024-${String(smartContracts.length + 1).padStart(3, '0')}`,
            title: request.title,
            vendorId: vendorId,
            procurementId: requestId,
            value: bid.amount,
            status: 'active',
            progress: 10,
            startDate: new Date().toISOString().split('T')[0],
            endDate: request.deadline,
            milestones: [
                { name: 'Contract Signed', completed: true, date: new Date().toISOString().split('T')[0] },
                { name: 'Initial Payment', completed: false, date: '' },
                { name: 'Production Started', completed: false, date: '' },
                { name: 'Quality Inspection', completed: false, date: '' },
                { name: 'Final Delivery', completed: false, date: request.deadline }
            ]
        };
        
        smartContracts.push(contract);
        request.status = 'completed';
        
        saveDataToStorage();
        loadContractData();
        loadProcurementData();
        hideModal('bidsModal');
        
        showNotification(`Bid accepted! Smart contract ${contract.id} created.`, 'success');
        addActivity('contract', `Contract created with ${vendor.name}`, 'just now');
    }
}

// Filter Functions
function filterVendors() {
    const searchTerm = document.getElementById('vendorSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('vendorCategoryFilter').value;
    
    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm) ||
                             vendor.location.toLowerCase().includes(searchTerm) ||
                             vendor.specialties.some(s => s.toLowerCase().includes(searchTerm));
        const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    const vendorGrid = document.getElementById('vendorGrid');
    if (vendorGrid) {
        vendorGrid.innerHTML = '';
        filteredVendors.forEach(vendor => {
            const vendorCard = createVendorCard(vendor);
            vendorGrid.appendChild(vendorCard);
        });
    }
}

function filterProcurementRequests() {
    const searchTerm = document.getElementById('procurementSearch').value.toLowerCase();
    const statusFilter = document.getElementById('procurementStatusFilter').value;
    
    const filteredRequests = procurementRequests.filter(request => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm) ||
                             request.description.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    const procurementList = document.getElementById('procurementList');
    if (procurementList) {
        procurementList.innerHTML = '';
        filteredRequests.forEach(request => {
            const requestCard = createProcurementCard(request);
            procurementList.appendChild(requestCard);
        });
    }
}

// Export Functions
function exportVendors() {
    downloadJSON(vendors, 'vendors.json');
    showNotification('Vendors exported successfully', 'success');
}

function exportProcurementRequests() {
    downloadJSON(procurementRequests, 'procurement-requests.json');
    showNotification('Procurement requests exported successfully', 'success');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Data Persistence
function saveDataToStorage() {
    localStorage.setItem('vendors', JSON.stringify(vendors));
    localStorage.setItem('procurementRequests', JSON.stringify(procurementRequests));
    localStorage.setItem('smartContracts', JSON.stringify(smartContracts));
}

function loadDataFromStorage() {
    const savedVendors = localStorage.getItem('vendors');
    const savedRequests = localStorage.getItem('procurementRequests');
    const savedContracts = localStorage.getItem('smartContracts');
    
    if (savedVendors) {
        vendors = JSON.parse(savedVendors);
    }
    if (savedRequests) {
        procurementRequests = JSON.parse(savedRequests);
    }
    if (savedContracts) {
        smartContracts = JSON.parse(savedContracts);
    }
}

// Chart Initialization
function initializeCharts() {
    // Procurement Trends Chart
    const procurementCtx = document.getElementById('procurementChart');
    if (procurementCtx) {
        new Chart(procurementCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Procurement Volume ($K)',
                    data: [2400, 1398, 9800, 3908, 4800, 3800],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Cost Savings ($K)',
                    data: [600, 450, 1200, 890, 950, 780],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Vendor Distribution Chart
    const vendorCtx = document.getElementById('vendorChart');
    if (vendorCtx) {
        new Chart(vendorCtx, {
            type: 'doughnut',
            data: {
                labels: ['Verified', 'Pending', 'Under Review'],
                datasets: [{
                    data: [189, 34, 24],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // Performance Chart (Analytics)
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Performance Score',
                    data: [85, 88, 92, 89, 94, 91],
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Cost Chart (Analytics)
    const costCtx = document.getElementById('costChart');
    if (costCtx) {
        new Chart(costCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Cost Reduction (%)',
                    data: [12, 15, 18, 22, 19, 24],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }
}

// Chat Functions
function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'ai');
    }, 1500);
}

function addChatMessage(message, type) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = `message-avatar ${type}-avatar`;
    avatarDiv.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
        <p>${message}</p>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('vendor') || lowerMessage.includes('supplier')) {
        return `Based on your current vendor data, I've analyzed performance metrics across ${vendors.length} active suppliers. Here are key insights:

🏆 **Top Performers:**
${vendors.slice(0, 3).map(v => `- ${v.name}: ${v.trustScore}% trust score, ${v.completedOrders} completed orders`).join('\n')}

📊 **Recommendations:**
1. Consider consolidating orders with top 3 vendors for 15% cost savings
2. ${vendors[0]?.name} shows potential for strategic partnership
3. Review vendor performance metrics quarterly

Would you like me to initiate contact with any specific vendors or generate a detailed performance report?`;
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('saving') || lowerMessage.includes('optimize')) {
        return `I've identified several cost optimization opportunities in your supply chain:

💰 **Immediate Savings (Next 30 days):**
- Vendor consolidation: $67,500 potential savings
- Bulk ordering timing: $34,200 additional savings  
- Payment term optimization: 12% cash flow improvement

📈 **Strategic Opportunities:**
1. Electronics procurement: 18% overspend detected vs. market rates
2. Logistics optimization: Route efficiency can be improved by 28%
3. Sustainable materials: Lock in current rates before Q4 price increase

🎯 **Action Items:**
- Renegotiate ${procurementRequests.filter(r => r.status === 'active').length} active contracts
- Implement AI-driven demand forecasting
- Consider alternative suppliers for 22% cost reduction

Shall I create an implementation plan for any of these recommendations?`;
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('contract')) {
        return `AI Risk Assessment completed for your active contracts:

⚠️ **High Priority Risks:**
- ${smartContracts.length} active contracts require monitoring
- Vendor concentration: Consider diversifying supplier base
- Geographic risk: Evaluate regional dependencies

🛡️ **Risk Mitigation Strategies:**
1. Diversify supplier base across 4+ regions
2. Implement milestone-based payment schedules
3. Add force majeure clauses to new contracts
4. Establish backup suppliers for critical components

📋 **Contract Optimization:**
- ${smartContracts.filter(c => c.status === 'active').length} contracts currently active
- Average contract value can be reduced by 14% through renegotiation
- Smart contract adoption can reduce processing time by 68%

Would you like me to prioritize these risks or draft updated contract templates?`;
    }

    return `I understand you're asking about "${userMessage}". Let me analyze this in the context of your supply chain operations.

Based on your current data:
- ${vendors.length} active vendors across multiple categories
- ${procurementRequests.length} procurement requests in various stages
- ${smartContracts.length} smart contracts being managed
- Real-time performance monitoring active

I can help you with:
🤖 Vendor analysis and recommendations
📊 Cost optimization strategies
⚡ Smart contract automation  
🔍 Risk assessment and mitigation
📈 Performance analytics and insights

What specific aspect would you like me to focus on? I can provide detailed analysis, actionable recommendations, or help automate any of these processes.`;
}

function handleQuickAction(actionType) {
    const chatInput = document.getElementById('chatInput');
    chatInput.value = `Help me with ${actionType}`;
    sendChatMessage();
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message ai-message">
            <div class="message-avatar ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>Hello! I'm your AI Procurement Assistant. I can help you optimize supply chain operations, analyze vendor performance, identify cost savings opportunities, and automate procurement decisions. How can I assist you today?</p>
                <div class="message-time">Just now</div>
            </div>
        </div>
    `;
}

// Utility Functions
function refreshDashboard() {
    loadDashboardData();
    updateBalance();
    showNotification('Dashboard refreshed', 'success');
}

function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = overlay.querySelector('p');
    text.textContent = message;
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${getNotificationColor(type)};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return 'rgba(16, 185, 129, 0.9)';
        case 'error': return 'rgba(239, 68, 68, 0.9)';
        case 'warning': return 'rgba(245, 158, 11, 0.9)';
        default: return 'rgba(59, 130, 246, 0.9)';
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .bid-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    .bid-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .bid-amount {
        font-size: 1.25rem;
        font-weight: bold;
        color: #10b981;
    }

    .milestone-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
    }

    .milestone-item.completed {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
    }

    .milestone-item.pending {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
    }

    .milestone-date {
        margin-left: auto;
        font-size: 0.875rem;
        opacity: 0.7;
    }

    .contract-info {
        margin-bottom: 1.5rem;
    }

    .contract-info h3 {
        margin-bottom: 1rem;
        color: white;
    }

    .contract-info p {
        margin-bottom: 0.5rem;
        color: rgba(255, 255, 255, 0.8);
    }

    .milestones h4 {
        margin-bottom: 1rem;
        color: white;
    }
`;
document.head.appendChild(style);

// Real-time data simulation
setInterval(() => {
    if (currentPage === 'dashboard') {
        updateBalance();
    }
}, 30000); // Update every 30 seconds

// Initialize WebSocket connection for real-time data (simulation)
function initializeRealTimeData() {
    console.log('Real-time data connection initialized');
}

// Call initialization
initializeRealTimeData();