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

    app.get('/api/member/:id', (req, res) => {
        const memberId = req.params.id;
        const member = appInstance.getMemberById(memberId);

        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    });

    app.get('/api/data/:key', (req, res) => {
        const key = req.params.key;
        const data = appInstance.getData(key);

        if (data) {
            res.json(data);
        } else {
            res.status(404).send('Data not found');
        }
    });


    app.get('/task/:id', (req, res) => {
        const taskId = req.params.id;
        const task = appInstance.scheduledTasks.getTask(taskId);

        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    });

    //get all tasks
    app.get('/tasks', (req, res) => {
        const tasks = appInstance.scheduledTasks.tasks;

        if (tasks) {
            res.json(tasks);
        } else {
            res.status(404).json({ message: 'Tasks not found' });
        }
    });

    //get standing for challenge id
    app.get('/api/standing/:id', (req, res) => {
        (async () => {
            const challengeId = req.params.id;
            const standing = await appInstance.GetChallengeStandingsCached(challengeId);

            if (standing) {
                res.json(standing);
            } else {
                res.status(404).json({ message: 'Standing not found' });
            }
        })();
    });

    //get most recent challenge id
    app.get('/api/lastChallenge', (req, res) => {
        (async () => {
            const challengeId = (await appInstance.getMostRecentCOTD()).recent.id;

            if (challengeId) {
                res.json(challengeId);
            } else {
                res.status(404).json({ message: 'Challenge not found' });
            }
        })();
    });
})();
