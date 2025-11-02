// functions/api.js - With Basic Proxy Data
exports.handler = async function(event, context) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const { action, country } = event.queryStringParameters || {};

    // Simple proxy data (we'll connect to data.js later)
    const proxyData = {
        sg: ['13.250.131.37:443', '54.255.185.94:443'],
        my: ['52.77.225.242:443', '13.76.157.24:443'],
        working: ['13.250.131.37:443', '54.255.185.94:443'],
        lastUpdated: new Date().toISOString()
    };

    if (action === 'proxies') {
        let proxies = [];
        if (!country || country === 'SG') proxies = proxies.concat(proxyData.sg);
        if (!country || country === 'MY') proxies = proxies.concat(proxyData.my);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                action: 'proxies',
                country: country || 'all',
                proxies: proxies,
                count: proxies.length,
                lastUpdated: proxyData.lastUpdated
            })
        };
    }

    if (action === 'working') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                action: 'working',
                proxies: proxyData.working,
                count: proxyData.working.length,
                lastUpdated: proxyData.lastUpdated
            })
        };
    }

    if (action === 'statistics') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                action: 'statistics',
                data: {
                    totalProxies: proxyData.sg.length + proxyData.my.length,
                    workingProxies: proxyData.working.length,
                    successRate: 75,
                    lastUpdated: proxyData.lastUpdated
                }
            })
        };
    }

    if (action === 'random') {
        const pool = country === 'SG' ? proxyData.sg : 
                    country === 'MY' ? proxyData.my : 
                    [...proxyData.sg, ...proxyData.my];
        
        const randomProxy = pool[Math.floor(Math.random() * pool.length)];
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                action: 'random',
                country: country || 'all',
                proxy: randomProxy
            })
        };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            success: true,
            message: '🚀 SG/MY Proxy API',
            version: '2.0',
            endpoints: {
                'proxies': 'Get proxies by country',
                'working': 'Get working proxies', 
                'statistics': 'Get statistics',
                'random': 'Get random proxy'
            }
        })
    };
};
