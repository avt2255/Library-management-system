const express = require('express')
const res = require('express/lib/response')
const authordata = require('./src/models/authordata')
const Bookdata = require('./src/models/bookdata')
var multer = require('multer')
var bcrypt = require('bcryptjs')
const LoginData = require('./src/models/logindata')
const signupdata = require('./src/models/signupdata')

const app = express()
const nav = [
    {
        link: '/',
        name: 'BookLibrary'
    }, {
        link: '/books',
        name: 'BOOKS'
    }, {
        link: '/author',
        name: 'AUTHOR'
    }, {
        link: '/add-book',
        name: 'ADD BOOK'
    },
    {
        link: '/add-author',
        name: 'ADD AUTHOR'
    }, {
        link: '/signup',
        name: 'SIGN UP'
    }, {
        link: '/login',
        name: "LOGIN"
    }
]

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

app.set('view engine', 'ejs')
app.set('views', './src/views')

app.get('/', function (req, res) {
    res.render('index', { nav })
})


app.post('/registration', function (req, res) {
    console.log(req.body);
    bcrypt.hash(req.body.pass, 10, function (err, hash) {
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        }
        else {
            var loginDetails = {
                email: req.body.email,
                password: hash
            }

            console.log("log==>", loginDetails)
            LoginData.findOne({ email: loginDetails.email }).then((emailcheck) => {
                console.log("result==>", emailcheck);
                if (emailcheck) {
                    return res.status(400).json({
                        message: "email already existed"
                    })
                } else {
                    let logindata = LoginData(loginDetails)
                    logindata.save().then((result) => {
                        const registerDetails = {
                            login_id: result._id,
                            fullname: req.body.full_name,
                            username: req.body.user_name
                        }
                        console.log(registerDetails)
                        const registerdata = signupdata(registerDetails)
                        console.log(registerDetails)
                        registerdata.save().then(() => {
                            res.render('login', { nav })
                        })
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            })
        }
    })
})

app.post('/login', function (req, res) {
    let user
    LoginData.findOne({ email: req.body.email }).then((result) => {
        console.log(result)
        if (!result) {
            return res.json({
                message: "user not found"
            })
        }
        user = result
        return bcrypt.compare(req.body.pass, user.password)
    }).then((value) => {
        if (value == true) {
            console.log("ok")
            res.render('index', { nav })
        } else {
            res.render('login', { nav })
            console.log("no")
        }
    });
})

app.get('/userdata', (req, res) => {
    LoginData.aggregate([
        {
            '$lookup': {
                'from': 'signup_tbs',
                'localField': '_id',
                'foreignField': 'login_id',
                'as': 'register'
            }
        }
    ]).then((details) => {
        console.log(details);
        res.status(200).json({
            data: details
        })

    }).catch((err) => {
        console.log(err);
    })
})


app.get('/books', function (req, res) {
    Bookdata.find().then((books) => {
        console.log(books);
        res.render('books', { nav, books })
    }).catch((err) => {
        console.log(err);
    })
})

app.get('/author', function (req, res) {
    authordata.find().then((authors) => {
        console.log(authors);
        res.render('author', { nav, authors })
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/add-book', function (req, res) {
    res.render('book-add', { nav, message: "" })
})

app.get('/add-author', function (req, res) {
    res.render('author-add', { nav, message: "" })
})

app.get('/signup', function (req, res) {
    res.render('signup', { nav })
})
app.get('/login', function (req, res) {
    res.render('login', { nav })
})

app.post('/save-book', upload.single("img"), function (req, res) {
    const item = {
        name: req.body.name,
        author: req.body.author,
        img: req.file.filename,
        description: req.body.description
    }
    console.log(item)

    var book = Bookdata(item)
    book.save().then(() => {
        res.render('book-add', { nav, message: "book added" })
    }).catch((err) => {
        return res.status(400).json({
            message: err.message
        })
    })
})

app.post('/save-author', upload.single("img"), function (req, res) {
    const item = {
        name: req.body.book_name,
        author: req.body.author_name,
        mobile: req.body.mob,
        img: req.file.filename
    }
    var author = authordata(item)
    author.save().then(() => {
        res.render('book-add', { nav, message: "author added successfully" })
    }).catch((err) => {
        return res.status(400).json({
            message: err.message
        })
    })
})

app.get('/:id', function (req, res) {
    var id = req.params.id
    Bookdata.findByIdAndDelete({ _id: id }).then(() => {
        res.redirect("/books")
    }).catch((err) => {
        res.status(400).json({ message: err.message })
    })
})

app.get('/authordel/:name', function (req, res) {
    var id = req.params.name
    authordata.findByIdAndDelete({ _id: id }).then(() => {
        res.redirect('/author')
    }).catch((err) => {
        res.status(400).json({ message: err.message })
    })
})



app.listen(3000, () => {
    console.log("server started at port http://localhost:3000")
})