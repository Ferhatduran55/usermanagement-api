const express = require('express');
const app = express();
require('dotenv').config();

const usersRouter = require('./routes/users');

const APP_NAME = process.env.APP_NAME || 'App';
const APP_PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send({});
});

app.use('/users', usersRouter);

app.listen(APP_PORT, () => console.log(`${APP_NAME} listening on port ${APP_PORT}!`));