//jshint esversion:6
const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = new express();

const Post = require('./database/models/Post');

mongoose.connect('mongodb://localhost:27017/simple-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.use(express.static('public'));

app.use(expressEdge);
app.set('views', __dirname + '/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/posts/new', (req, res) => {
    res.render('create');
});

app.post('/posts/store', (req, res) => {
    console.log(req.body)
    Post.create(req.body, (error, post) => {
        res.redirect('/');
    });
});

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/post', (req, res) => {
    res.render('post');
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});

app.listen(4000, () => {
    console.log('App listening on port 4000')
});
