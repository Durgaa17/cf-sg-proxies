// api.js - Serverless functions for platforms that support it
const proxyData = require('./data.js');

// This would work on platforms like Netlify, Vercel, etc.
exports.handler = async function(event, context) {
    const { action, country, proxy } = event.queryStringParameters;
    
    switch (action) {
        case 'proxies':
            let proxies = [];
            if (!country || country === 'SG') proxies = proxies.concat(proxyData.sg);
            if (!country || country === 'MY') proxies = proxies.concat(proxyData.my);
            
            return {
                statusCode: 200,
                body: JSON.stringify({
                    action: 'proxies',
                    country: country || 'all',
                    proxies: proxies,
                    count: proxies.length
                })
            };
            
        case 'working':
            return {
                statusCode: 200,
                body: JSON.stringify({
                    action: 'working',
                    proxies: proxyData.working,
                    count: proxyData.working.length
                })
            };
            
        case 'check':
            // Here you would call your actual validation API
            const validationResult = {
                proxy: proxy,
                status: 'alive', // This would come from your API
                responseTime: 150,
                checkedAt: new Date().toISOString()
            };
            
            return {
                statusCode: 200,
                body: JSON.stringify({
                    action: 'check',
                    proxy: proxy,
                    result: validationResult
                })
            };
            
        case 'random':
            const pool = country === 'SG' ? proxyData.sg : 
                        country === 'MY' ? proxyData.my : 
                        [...proxyData.sg, ...proxyData.my];
            const randomProxy = pool[Math.floor(Math.random() * pool.length)];
            
            return {
                statusCode: 200,
                body: JSON.stringify({
                    action: 'random',
                    country: country,
                    proxy: randomProxy
                })
            };
            
        default:
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid action' })
            };
    }
};
