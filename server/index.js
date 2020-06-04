require('dotenv').config()
const massive = require('massive'),
  express = require('express'),
  cors = require('cors'),
  session = require('express-session'),
  app = express(),
  { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env,
  middle = require('./middleware/middleware'),
  authCtrl = require('./controllers/authController')

app.use(cors())
app.use(express.json())

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

massive({
  connectionString: CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
}).then(db => {
  app.set('db', db)
  console.log('DB has successfully launched')
  app.listen(SERVER_PORT, () => console.log(`Steel pushing on port ${SERVER_PORT}`))
})

app.post('/auth/register', middle.checkUsername, authCtrl.register)

app.post('/auth/login', middle.checkUsername, authCtrl.login)

app.post('/auth/logout', authCtrl.logout)

app.get('/auth/user', authCtrl.getUser)