require('dotenv').config();

const Twit = require('twit');
const request = require('request');
const fs = require('fs');
const csvparse = require('csv-parse');
const rita = require('rita');
let inputText;


const bot = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
});

const filePath = './static/georgeQuotes.csv';

function tweetQuote() {
    const tweetData = fs.createReadStream(filePath)
        .pipe(csvparse({delimiter: ','}))
        .on('data', row => {
            inputText = inputText + ' ' + row[0];
        })
        .on('end', function() {
            const markov = new rita.RiMarkov(3);
            markov.loadText(inputText);
            const sentence = markov.generateSentences(1);
            bot.post('statuses/update', {status: sentence}, ((err, data, resp) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Status tweeted: ${sentence}`);
                }
            }));
        });
}

tweetQuote();

