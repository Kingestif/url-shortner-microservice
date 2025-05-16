require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const shortid = require('shortid');
const dns = require('dns');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));


const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = {}; 

app.post('/api/shorturl', (req, res)=> {
  let url = req.body.url;
  let urlObj;
  try {
    urlObj = new URL(url);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }
  
  dns.lookup(urlObj.hostname, (err, address) => {
    if (err) return res.json({error: 'invalid url'});
    
    let shortUrl = shortid.generate();
    urlDatabase[shortUrl] = url;
    res.json({original_url: url, short_url: shortUrl});
  });
})

app.get("/api/shorturl/:short_url", (req, res)=> {
  let shortUrl = req.params.short_url;
  let url = urlDatabase[shortUrl];
  if (url){
    res.redirect(url);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
