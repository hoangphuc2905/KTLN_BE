const axios = require("axios");
async function generateEmbedding(text) {
  const response = await axios.post("https://api.openai.com/v1/embeddings", {
    input: text,
    model: "text-embedding-ada-002"
  }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  });
  return response.data.data[0].embedding;
}
exports.generateEmbedding = generateEmbedding;