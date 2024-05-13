const { initializeApp, cert } = require('firebase-admin/app');

const serviceKey = require('./serviceKey.json');

module.exports = initializeApp({
    credential: cert(serviceKey),
    // databaseURL: 'https://{project}.firebaseio.com'
});