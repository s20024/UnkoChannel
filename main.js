"use strict"

/*
こんにちは。
お疲れ様です。やらです。

カテゴリのデータを入れるために、
下のコード汚いですけど、、、許してください。w

あと、
socket.io使うと思ってて、
汚いコードで実装したのも許してください。😅
*/

const express = require("express")
const app = express()
const router = require("./routes/index")
const layouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const expressSession = require("express-session")
const cookieParser = require("cookie-parser")
const connectFlash = require("express-flash")
const passport = require("passport")
const User = require("./models/user")

mongoose.Promise = global.Promise
mongoose.connect("mongodb://0.0.0.0:27017/unko_channel_1")
    .then(() => {console.log("Successfully Connect MongoDb")})
    .catch(error => {throw error})

app.set("port", process.env.PORT || 3000)
app.set("view engine", "ejs")
app.set("token", process.env.TOKEN || "helloToken0")

app.use(express.static("public"))
app.use(layouts)
app.use(
    express.urlencoded( {
        extended: false
    })
)

app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
)

app.use(express.json())
app.use(cookieParser("secret_passcode"))
app.use(
    expressSession({
        secret: "secret_passcode",
        cookie: {
            maxAge: 4000000
        },
        resave: false,
        saveUninitialized: false
    })
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(connectFlash())

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated()
    res.locals.currentUser = req.user
    res.locals.flashMessages = req.flash()
    next()
})

app.use("/", router)

const list = ["ApexLegends", "MonsterHunter", "Splatoon", "ARK", "SmashBros", "Nier:Automata"]
const Category = require("./models/category")

Category.findOne({title: list[0]})
    .then((category) => {
        if (!category) {
            list.forEach(category => {
                const categoryParams = { title: category }
                Category.create(categoryParams)
                    .then(() => {console.log("successfully")})
                    .catch(() => {console.log("error")})
            })
        }
    })

const server = app.listen(app.get("port"), () => {
    console.log(`Server funning at http://localhost:${app.get("port")}`)
})
const io = require("socket.io")(server)
require("./controllers/chatController")(io)
