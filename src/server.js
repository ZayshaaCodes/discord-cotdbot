const { App } = require('./app');
const express = require('express');
const path = require('path');

(async () => {
    const appInstance = new App();
    await appInstance.start();
    const exp = express();

    exp.set('view engine', 'ejs');
    exp.set('views', path.join(__dirname, 'views'));
    exp.use(express.static(path.join(__dirname, 'public')));

    exp.get('/', (req, res) => {
        res.render('index');
    });

    const PORT = process.env.PORT || 3000;
    exp.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
