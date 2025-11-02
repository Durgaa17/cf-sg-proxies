// functions/api.js - Clean version
exports.handler = async function(event, context) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const { action } = event.queryStringParameters || {};

    if (action === 'proxies') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Proxies endpoint working',
                action: action
            })
        };
    }

    if (action === 'working') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Working proxies endpoint',
                action: action
            })
        };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            success: true,
            message: 'API is working',
            endpoints: ['proxies', 'working', 'statistics']
        })
    };
};
