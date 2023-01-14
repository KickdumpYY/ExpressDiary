const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');

//mongoose set
mongoose.set('strictQuery', true);
//set templating engine as ejs
app.set('view engine', 'ejs');
//serving static files
app.use(express.static('public'));
//bodyparser
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//middleware for override
app.use(methodOverride('_method'));
//database url
const url = 'mongodb+srv://Andy:12345@cluster0.hzqvvcr.mongodb.net/Diary?retryWrites=true&w=majority'
//connecting application with database
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Mongo DB Diary Connected"))
    .catch(err => console.log(err))
//import Diary Model
const Diary = require('./models/Diary')
//database url
const url1 = 'mongodb+srv://Andy:12345@cluster0.hzqvvcr.mongodb.net/account?retryWrites=true&w=majority'
//connecting application with database
mongoose.connect(url1, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Mongo DB Account Connected"))
    .catch(err => console.log(err))

//Import account Modle
const account = require('./models/account');
//route for/
app.get('/', (req, res) => {
    res.render('Home');
})
//rout for about page
app.get('/about', (req, res) => {
    res.render('About');
})
//rout for diary page
app.get('/diary', (req, res) => {
    Diary.find()
        .then(data => {
            console.log(data)
            res.render('Diary', { data: data });
        })
        .catch(err => console.log(err));
})
//rout for adding records
app.get('/Add', (req, res) => {
    res.render('add');
})
//rout for saving diary
app.post('/add-to-diary', (req, res) => {
    //res.send(req.body);
    //save data to database
    const Data = new Diary({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    })
    Data.save().then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
})
//route for display
app.get('/diary/:id', (req, res) => {
    //res.send(req.params.id)
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Page', { data: data });
    }).catch(err => console.log(err));
})
//route for edit page
app.get('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Edit', { data: data })
    }).catch(err => console.log(err));
})
//edit data
app.put('/diary/edit/:id',async (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(async data => {
        data.title = await req.body.title
        data.description = await req.body.description
        data.date = await req.body.date
        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
})
//delete from database
app.delete('/data/delete/:id', (req, res) => {
    Diary.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/diary');
    }).catch(err => console.log(err));
})
//route for sign in page
app.get('/signin', (req, res) => {
    res.render('signin');
})
//save signin information
app.post('/signin', (req, res) => {
    const Data = new account({
        id: req.body.id,
        password: req.body.password
    })
    Data.save().then(() => {
        res.redirect('/');
    }).catch(err => console.log(err));
   
})
//Login
app.post("/home", async (req, res) => {
    //const Data = account.findOne({id:req.body.id,password:req.body.password})
    try {
        const Data = await account.findOne({id:req.body.id})
        if (Data.password === req.body.password) {
            res.redirect('/Diary');
        } else {
            res.send("wrong password")
            res.console(Data)
        }
    }catch{
        res.send("wrong deatial")
    }
})
//creat sever
app.listen(3000, () => console.log('server is listen in 3000'));