const express = require('express');
const path = require('path');

// import moongose
const mongoose = require('mongoose');

// setup mongoose
mongoose.connect('mongodb://localhost:27017/users-db');

// setup moongose schema for user
const User = mongoose.model('User', {
    name: String,
    age: Number
});

// setup basic express server
const setupBasicExpressServer = () => {
    const app = express();
    app.use(express.json());
    app.use(express.static(__dirname + 'public'));

    // create a route to create a new user and save it to moongose
    app.post('/users', async(req, res) => {
        console.log('req.body: ', req.body);
        const user = req.body;
        const newUser = new User(user);
        try {
            await newUser.save();
            res.send(newUser);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    // create a route to get all users from moongose
    app.get('/users', async(req, res) => {
        try {
            const users = await User.find();
            res.send(users);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    // create a route to get a user by id from moongose
    app.get('/users/:id', async(req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    // create a route to update a user by id from moongose
    app.put('/users/:id', async(req, res) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true
            });
            res.send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    // create a route to delete a user by id from moongose
    app.delete('/users/:id', async(req, res) => {
        try {
            const user = await User.findByIdAndRemove(req.params.id);
            res.send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    return app;
}

// start server
const server = setupBasicExpressServer();

server.listen(process.env.PORT || 3000, () => {
    console.log('Server listening at port %d', process.env.PORT || 3000);
});