// functions/api.js - Connected to your data.js
const proxyData = require('../data.js');

exports.handler = async function(event, context) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const { action, country, proxy } = event.queryStringParameters || {};

    if (action === 'proxies') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                action: 'proxies',
                country: country || 'all',
                proxies: proxyData.sampleProxies,
                count: proxyData.sampleProxies.length,
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
                proxies: proxyData.sampleProxies,
                count: proxyData.sampleProxies.length,
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
                data: proxyData.statistics,
                lastUpdated: proxyData.lastUpdated
            })
        };
    }

    if (action === 'random') {
        const randomProxy = proxyData.sampleProxies[Math.floor(Math.random() * proxyData.sampleProxies.length)];
        
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

    if (action === 'countries') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                action: 'countries',
                countries: proxyData.countries,
                counts: {
                    total: proxyData.statistics.totalProxies,
                    working: proxyData.statistics.workingProxies
                }
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
                'proxies': 'Get all proxies',
                'working': 'Get working proxies', 
                'statistics': 'Get statistics',
                'random': 'Get random proxy',
                'countries': 'Get countries info'
            },
            example: 'https://sgproxycf.netlify.app/.netlify/functions/api?action=proxies'
        })
    };
};
