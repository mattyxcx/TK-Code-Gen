
// Express config
const express = require('express');
const app = express();

// Variables
const bodyparser = require('body-parser');
const _trello = require('trello');
const rateLimit = require('express-rate-limit')

const rl = rateLimit({
  windowMs: 1000, // 1 second
  max: 30, // Limit each IP to 10 requests per second
  message:
    'This resource is being rate limited.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.get('/', (req, res) => { res.sendStatus(200) })
app.use(bodyparser.json());
app.use(rl)
app.use('/search', require('./mod/search.js'))

let listener = app.listen(8080, () => {
 console.log('App is currently listening on port: ' + listener.address().port);
});