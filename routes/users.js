const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const users = {};

router.get('/insert/*', (req, res) => {
    const args = req.params[0] || '';
    const newUsers = args.split('/');
    let usersArr = [];
    for (let i = 0; i < newUsers.length; i++) {
        const user = {};
        const userParams = newUsers[i].split(';');
        for (let j = 0; j < userParams.length; j++) {
            const param = userParams[j].split('=');
            if (param.length > 1) {
                user[param[0]] = param[1];
            }
        }
        usersArr.push(user);
    }
    for (let i = 0; i < usersArr.length; i++) {
        const user = usersArr[i];
        const id = uuidv4();
        users[id] = user;
    }
    res.send(users);
});

router.get('/update/:id/:args*?', (req, res) => {
    const { id, args } = req.params;
    const user = users[id];
    if (user !== undefined) {
        const userParams = args.split(';');
        for (let j = 0; j < userParams.length; j++) {
            const param = userParams[j].split('=');
            if (param.length > 1) {
                user[param[0]] = param[1];
            }
        }
        users[id] = user;
        res.send(users);
    } else {
        res.send({});
    }
});

router.get('/delete/*', (req, res) => {
    const args = req.params[0] || '';
    const removeUsers = args.split('/');
    for (let i = 0; i < removeUsers.length; i++) {
        const id = removeUsers[i];
        delete users[id];
    }
    res.send(users);
});

router.get('/:id?/:opt?/:prop?/:val?', (req, res) => {
    const { id, prop, val } = req.params;
    const opt = req.params.opt || 'show';
    const user = users[id];
    let output = null;
    if (id !== undefined && user === undefined) {
        output = {};
    } else if (user === undefined) {
        output = users;
    }
    if (id !== undefined && opt === 'show' && prop !== undefined && val === undefined) { // /users/id/show/prop
        if (user && user[prop] !== undefined) {
            output = { [prop]: user[prop] };
        } else {
            output = {};
        }
    } else if (id !== undefined && opt === 'update' && prop !== undefined && val !== undefined) { // /users/id/update/prop/val
        if (user[prop] !== undefined) {
            user[prop] = val;
            users[id] = user;
            output = user;
        } else {
            output = user;
        }
    } else if (id !== undefined && opt === 'delete' && prop !== undefined && val === undefined) { // /users/id/delete/prop
        if (user[prop] !== undefined) {
            delete user[prop];
            users[id] = user;
            output = user;
        } else {
            output = user;
        }
    } else if (id !== undefined && opt === 'filter' && prop !== undefined && val !== undefined) { // /users/id/filter/prop/val
        if (user[prop] !== undefined && user[prop] === val) {
            output = user;
        } else {
            output = {};
        }
    } else if (id !== undefined && opt === 'show' && prop === undefined && val === undefined) { // /users/id/show
        output = user;
    } else if (id !== undefined && opt === 'insert' && prop !== undefined && val !== undefined) { // /users/id/insert/prop/value
        user[prop] = val;
        users[id] = user;
        output = user;
    } else if (id !== undefined && opt === 'delete' && prop === undefined && val === undefined) { // /users/id/delete
        delete users[id];
        output = {};
    } else if (id !== undefined && opt === 'filter' && prop !== undefined && val === undefined) { // /users/id/filter/prop
        if (user[prop] !== undefined) {
            output = user;
        } else {
            output = {};
        }
    } else if (id !== undefined && opt !== undefined && prop !== undefined && val === undefined) { // /users/id/opt/prop
        if (user[prop] !== undefined) {
            output = user;
        } else {
            output = {};
        }
    } else if (id !== undefined && opt !== undefined && prop === undefined && val === undefined) { // /users/id/prop
        if (user[opt] !== undefined) {
            output = { [opt]: user[opt] };
        } else {
            output = {};
        }
    } else {
        output = users;
    }
    res.send(output);
});

module.exports = router;
