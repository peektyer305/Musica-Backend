const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const port = 3001;
//CORS
const corsOptions = {
    origin:"http://localhost:5173",
    optionSuccessStatus:200,
};
app.use(cors(corsOptions));
//不正・悪意のあるURLをはじくためにフィルタリング？正規表現で実装しておきたい．
app.get("/api/metadata",async(req,res) =>{
    const {url} = req.query;

    try{
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        //Open Graphプロトコルのメタタグを探してメタデータを抽出
        const metadata = {
            title: $('meta[property="og:title"]').attr('content') || $('title').text(),
            description: $('meta[property="og:description"]').attr('content'),
            image: $('meta[property="og:image"]').attr('content'),
            url: $('meta[property="og:url"]').attr('content') || url,
          };
        //json形式で返す
          res.json(metadata);
    }catch(error){
        res.status(500).json({error:"Failed to fetch metadata."})
    }

});

app.listen(port,() =>{
    console.log(`Server running at http://localhost:${port}`)
})