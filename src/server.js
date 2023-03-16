const { App } = require('./app');
const express = require('express');
const path = require('path');

(async () => {
    const appInstance = new App();
    await appInstance.start();


    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
        res.render('index');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });


    // Add this route in your server.js file
    app.get('/api/cotdQueue', (req, res) => {
        res.json(appInstance.cotdQueue);
    });

    app.get('/api/clubData', (req, res) => {
        res.json(appInstance.clubData);
    });
})();
