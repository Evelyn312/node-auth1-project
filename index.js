const express = require("express")
const cors = require("cors")
const session = require("express-session")
const KnexSessionsStore = require("connect-session-knex")(session)
const usersRouter = require("./users/users-router")
const db = require("./database/config")

const server = express()
const port = process.env.PORT || 5000

server.use(cors())
server.use(express.json())

server.use(session({
	resave: false, // avoid recreating sessions that have not changed
	saveUninitialized: false, // to comply with GDPR laws
	secret: "keep it secret, keep it safe", // cryptographically sign the cookie
	store: new KnexSessionsStore({
		knex: db, // configured instance of knex
		createtable: true, // if the sessions table doesn't exist, create it automatically
	}),
}))


server.use(usersRouter)

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something Went Wrong"
    })
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})