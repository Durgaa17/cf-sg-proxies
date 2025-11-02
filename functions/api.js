// functions/api.js - Simple Test Version
exports.handler = async function(event, context) {
    const { action } = event.queryStringParameters || {};
    
    // Set CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    try {
        // Simple test response
        if (action === 'test') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: '✅ API is working!',
                    action: action,
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Default response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: '🚀 SG/MY Proxy API',
                version: '1.0',
                endpoints: {
                    '/.netlify/functions/api?action=test': 'Test endpoint',
                    '/.netlify/functions/api?action=proxies': 'Get proxies',
                    '/.netlify/functions/api?action=working': 'Get working proxies'
                }
            })
        };
        
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
