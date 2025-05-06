const axios = require('axios');

async function fetchContent(content) {
    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "gpt-3.5-turbo",  // Pastikan menggunakan model OpenAI yang sesuai
            prompt: content,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
            }
        });
        return response.data.choices[0].text;
    } catch (error) {
        console.error("Error fetching content from ChatGPT:", error.message);
        throw new Error('Failed to fetch content from ChatGPT');
    }
}

function registerChatGPT(app) {
    app.get('/ai/chatgpt', async (req, res) => {
        try {
            const { text } = req.query;

            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }

            const result = await fetchContent(text);

            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}

module.exports = registerChatGPT;
