

const OpenAI = require("openai") 

const apiKey =
  "sk-zLofzr5n7ae4U5C1Vh2em9Cz4VEVLo2HlHwbRl3Tnpsq87BW";
// 构造 client
const client = new OpenAI({
  apiKey: apiKey, // 混元 APIKey
  baseURL: "https://api.hunyuan.cloud.tencent.com/v1", // 混元 endpoint
});
module.exports = {
  client,
};
