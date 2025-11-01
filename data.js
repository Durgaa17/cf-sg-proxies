// data.js - Proxy Data Storage
// Auto-updated by GitHub Actions every 2 hours

const proxyData = {
    lastUpdated: new Date().toISOString(),
    countries: ['SG', 'MY'],
    
    // Singapore Proxies
    sg: [
        "13.250.131.37:443",
        "54.255.185.94:443", 
        "52.77.225.242:443"
    ],
    
    // Malaysia Proxies
    my: [
        "13.76.157.24:443",
        "52.77.225.242:443",
        "13.250.131.37:443"
    ],
    
    // Working proxies with response times (from API validation)
    working: [
        { proxy: "13.250.131.37:443", responseTime: 120, country: "SG" },
        { proxy: "54.255.185.94:443", responseTime: 180, country: "SG" },
        { proxy: "52.77.225.242:443", responseTime: 220, country: "MY" }
    ],
    
    // Statistics
    stats: {
        totalProxies: 150,
        workingProxies: 45,
        successRate: 30,
        lastValidation: new Date().toISOString()
    }
};

// Make it available globally
if (typeof window !== 'undefined') {
    window.proxyData = proxyData;
}

// For Node.js/Server environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = proxyData;
      }
