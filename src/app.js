const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
const server = express();
const PORT = 3030;
const STATUS_USER_ERROR = 422;

server.use(bodyParser.json());

server.get('/compare', (req, res) => {
    let Prices = {};
    fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json')
    .then(res => res.json())
    .then(json => {
        Prices.today = json.bpi.USD.rate;
        Prices.today = parseFloat(Prices.today.replace(",", ""));
    })
    .then(() => fetch('https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday')
        .then(res => res.json())
        .then(json => {
            Prices.yesterday = Object.values(json.bpi);
            Prices.change = Prices.today - Prices.yesterday;
            res.send(`Yesterday's Bitcoin price was ${Prices.yesterday}. Todays Bitcoin price is ${Prices.today}, a change of ${Prices.change}`);
        })
    )
    .catch(error => {
        console.log(error);
        res.status(STATUS_USER_ERROR);
        res.send('There was an error with your request.')
      })
})

server.listen(PORT);