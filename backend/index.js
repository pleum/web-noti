const webPush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');

const serverPort = 8080;
const app = express();

const vapidKeys = webPush.generateVAPIDKeys();
webPush.setVapidDetails(
    'mailto:example@pl3um.me',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let id = 0;
const subscribers = [];

app.use(bodyParser());
app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Get public key for push manager subscribe.
app.get('/sub', async (req, res) => {
    return res.json({ publicKey: vapidKeys.publicKey });
});

// Subscribe
app.post('/sub', async (req, res) => {
    const sub = req.body.sub;
    if (sub == null) return res.json({ message: 'no subscribe body' });
    subscribers.push({ id: id++, sub });
});

// Fired notification to specific subscribe id.
app.get('/noti/:subId', async (req, res) => {
    const subId = req.params.subId;
    if (subId == null) return res.json({ message: 'subscribe id is required' });

    const findBySubId = subscribers.filter(s => s.id == subId);
    if (findBySubId.length === 0)
        return res.status(404).json({ message: 'subscribe id not found' });

    const subscriber = JSON.parse(findBySubId[0].sub);

    webPush.sendNotification(subscriber, 'Hello, World');
    return res.json({ message: 'success' });
});

app.listen(serverPort, () => {
    console.log('Listening on port: ', serverPort);
});

setInterval(async () => {
    console.log(subscribers);
}, 6000);
