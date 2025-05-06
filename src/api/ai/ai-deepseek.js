const axios = require('axios');

async function fetchContent(content) {
    try {
        const response = await axios.post('https://api.deepseek.ai/endpoint', { content });  // Ganti dengan endpoint DeepSeek yang benar
        return response.data;
    } catch (error) {
        console.error("Error fetching content from DeepSeek:", error.message);
        throw new Error('Failed to fetch content from DeepSeek');
    }
}

function registerDeepSeek(app) {
    app.get('/ai/deepseek', async (req, res) => {
        try {
            const { text } = req.query;

            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }

            const { result } = await fetchContent(text);

            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}

module.exports = registerDeepSeek;
