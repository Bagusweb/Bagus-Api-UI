const axios = require('axios');
const FormData = require('form-data');
module.exports = function(app) {
    async function hydromind(content, model) {
        const form = new FormData();
        form.append('content', content);
        form.append('model', model);
        const { data } = await axios.post('https://mind.hydrooo.web.id/v1/chat/', form, {
            headers: {
                ...form.getHeaders(),
            }
        })
        return data;
    }
    app.get('/ai/hydromind', async (req, res) => {
        try {
            const { text, model } = req.query;
            if (!text || !model) {
                return res.status(400).json({ status: false, error: 'Text and Model is required' });
            }
            const { result } = await hydromind(text, model);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}