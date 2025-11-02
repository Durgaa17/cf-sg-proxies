// api.js - Enhanced Serverless API
const proxyData = require('./data.js');

exports.handler = async function(event, context) {
    const { action, country, proxy, format } = event.queryStringParameters || {};
    
    // Set CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        switch (action) {
            case 'proxies':
                let proxies = [];
                if (!country || country === 'SG') proxies = proxies.concat(proxyData.sg || []);
                if (!country || country === 'MY') proxies = proxies.concat(proxyData.my || []);
                
                const response = {
                    success: true,
                    action: 'proxies',
                    country: country || 'all',
                    proxies: proxies,
                    count: proxies.length,
                    lastUpdated: proxyData.lastUpdated
                };
                
                // Return in different formats
                if (format === 'text') {
                    return {
                        statusCode: 200,
                        headers: { ...headers, 'Content-Type': 'text/plain' },
                        body: proxies.join('\n')
                    };
                }
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(response)
                };
                
            case 'working':
                const workingProxies = proxyData.working || [];
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        action: 'working',
                        proxies: workingProxies,
                        count: workingProxies.length,
                        lastUpdated: proxyData.lastUpdated
                    })
                };
                
            case 'check':
                if (!proxy) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'Proxy parameter required' 
                        })
                    };
                }
                
                // Simulate proxy check (you can integrate your actual validation API)
                const validationResult = {
                    proxy: proxy,
                    status: 'alive',
                    responseTime: Math.floor(Math.random() * 200) + 50,
                    checkedAt: new Date().toISOString(),
                    country: proxy.includes('.sg') ? 'SG' : proxy.includes('.my') ? 'MY' : 'Unknown'
                };
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        action: 'check',
                        result: validationResult
                    })
                };
                
            case 'random':
                const pool = country === 'SG' ? (proxyData.sg || []) : 
                            country === 'MY' ? (proxyData.my || []) : 
                            [...(proxyData.sg || []), ...(proxyData.my || [])];
                
                if (pool.length === 0) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ 
                            success: false, 
                            error: 'No proxies available' 
                        })
                    };
                }
                
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
                
            case 'statistics':
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        action: 'statistics',
                        data: proxyData.stats || {},
                        lastUpdated: proxyData.lastUpdated
                    })
                };

            case 'countries':
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        action: 'countries',
                        countries: ['SG', 'MY'],
                        counts: {
                            SG: (proxyData.sg || []).length,
                            MY: (proxyData.my || []).length
                        }
                    })
                };

            default:
                // Return API documentation when no action specified
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        message: '🚀 SG/MY Proxy API',
                        version: '2.0.0',
                        endpoints: {
                            '/?action=proxies&country=SG': 'Get Singapore proxies',
                            '/?action=proxies&country=MY': 'Get Malaysia proxies',
                            '/?action=proxies&format=text': 'Get proxies as text',
                            '/?action=working': 'Get working proxies',
                            '/?action=random&country=SG': 'Get random Singapore proxy',
                            '/?action=check&proxy=IP:PORT': 'Check proxy status',
                            '/?action=statistics': 'Get system statistics',
                            '/?action=countries': 'Get available countries'
                        },
                        example: 'https://your-api.com/?action=proxies&country=SG'
                    })
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};
