const express = require('express')
const app = express()
const path = require('path')
const bcrpyt = require("bcrypt")

global.globalString = ""
global.globalId = 0


const fs = require('fs')
const folderPath = '/Users/benjaminmartins/Documents/careerDevs/cohort18/202205/triviaapp/'

app.use(express.static('public'))

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const mysql = require('mysql')


const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    port: 8889,
    password: 'root',
    database: 'TriviaApp',
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', async (req, res) => {
    let name = req.body.name
    let email = req.body.email

    const salt = await bcrpyt.genSalt()
    const hashedPassword = await bcrpyt.hash(req.body.password, 10)


    db.query("SELECT * FROM Login", function (err, result, fields) {
        let bool = true
        if (err) throw err
        for(let i = 0; i < result.length; i++) {
            if(result[i].Name === name) {
                bool = false
                break

            }
        }
        if(bool) {
            db.query('INSERT INTO Login (Name, Password, Email) VALUES (?, ?, ?)', [name, hashedPassword, email], (err, result) => {
                if(err) {
                    console.log(err)
                }
                res.redirect('/');
            })
        } else {
            res.status(401).send("Username or password is already taken")

        }
    })
    
    
})


app.get('/', (req, res) => {
    res.render('login.ejs')

})

app.post('/', async (req, res) => {
    const name = req.body.name
    const password = req.body.password
    const email = req.body.email

   db.query("SELECT * FROM Login", async function (err, result, fields) {
       if (err) throw err
       let bol = true

       for(let i = 0; i < result.length; i++) {
           if((result[i].Name == name || result[i].Email == name) && await bcrpyt.compare(password, result[i].Password)) {
               globalString = result[i].Name
               globalId = result[i].idLogin
               res.redirect('/start')
               bol = false
               break
           }
       }
       if(bol) {
            console.log("not correct information")
            res.status(401).send("Invaild credentials")
       }
})

})



app.get('/score', (req, res) => {
    db.query("SELECT * FROM Score JOIN Login ON Score.login_id=Login.idlogin", function (err, result, fields) {
        if(err) return res.status(500).send(err.message)
        res.json(result)
        
    })

})

app.post('/score', (req, res) => {
    const {loginID, difficulty, correctQuestions, incorrectQuestion, trivia_category} = req.body
    try {
        db.query('INSERT INTO Score (login_id, difficulty, total_correct, total_wrong, category) VALUES (?, ?, ?, ?, ?)', [loginID, difficulty, correctQuestions, incorrectQuestion, trivia_category], (err, result) => {
            if(err) {
                return res.status(500).send(err.message)
            }
            res.redirect('/start');
        })

    } catch(err) {
        res.status(500).send(err.message)
    }
   
})


app.get('/start', (req, res) => {
    res.render('start.ejs', { name: globalString, id: globalId })
})

app.post('/', (req, res) => {
})

app.listen(8000, () => {
    console.log('server is now running');
})