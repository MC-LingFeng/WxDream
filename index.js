const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const OpenAI = require('openai')
const { init: initDB, Counter } = require("./db");


const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

const apiKey =
  "sk-zLofzr5n7ae4U5C1Vh2em9Cz4VEVLo2HlHwbRl3Tnpsq87BW";
// 构造 client
const client = new OpenAI({
  apiKey: apiKey, // 混元 APIKey
  baseURL: "https://api.hunyuan.cloud.tencent.com/v1", // 混元 endpoint
});

// async function getAIResponse(prompt) {
//   const completion = await openai.createCompletion({
//     model: 'hunyuan-turbo',
//     prompt,
//     max_tokens: 1024,
//     temperature: 0.1,
//   });
//   return (completion?.data?.choices?.[0].text || 'AI 挂了').trim();
// }

// router.post('/message/post', async ctx => {
//   const { text } = ctx.request.body;

//   const response = await getAIResponse(text);
  
//   ctx.body = {
//     ToUserName: FromUserName,
//     FromUserName: ToUserName,
//     CreateTime: +new Date(),
//     MsgType: 'text',
    
//     Content: response,
//   };
// });

app.post("/api/search", async (req, res) => {
  const { text } = req.body;
  if (!text){
    res.send({
      code: -1,
      data: null,
    })
  }
     const stream = await client.chat.completions.create({
      model: "hunyuan-turbo",
      messages: [{ role: "user", content: text }],
      enable_enhancement: true, // <- 自定义参数
    });
  
  res.send({
    code: 0,
    // data: '',
    data: stream.choices[0]?.message?.content,
  });
});

// 获取计数
app.get("/api/count", async (req, res) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  // await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
