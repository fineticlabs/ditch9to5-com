export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
                headers,
            });
        }

        // Call Beehiiv API
        const response = await fetch(
            `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.BEEHIIV_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    reactivate_existing: true,
                    send_welcome_email: true,
                    utm_source: 'website',
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Beehiiv error:', error);
            return new Response(JSON.stringify({ error: 'Subscription failed' }), {
                status: 500,
                headers,
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers,
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
