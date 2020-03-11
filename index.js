const express = require('express')
const sqlite = require('sqlite')
const app = express()
const path = require('path')
// const crypto = require('crypto')


// function hash(value) {
//   return crypto
//     .createHash('sha256')
//     .update(value + 'jewgopwjpgwoe') // Salt
//     .digest('hex')
// }


let database
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', '*')
    response.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.get('/bookings', (request, response) => {
    database.all('SELECT * FROM bookings').then(bookings => {
        response.send(bookings)
    })
})

app.post('/login', (request, response) => {
    database.all('SELECT * FROM users WHERE userName=? AND password=?', [request.body.userName, request.body.password]).then(rows => {
        if(rows.length === 1){
            response.status(200)
            response.send()
        } else{
            response.status(401)
            response.send()
        }
        
    })
})

app.post('/bookings', (request, response) => {
    database.run('INSERT INTO bookings VALUES (?, ?, ?, ?)', [request.body.date, request.body.name, request.body.booked, request.body.message])
        .then(() => {
            response.status(201).send()
        })
})

app.delete('/bookings', (request, response) => {
    database.run('DELETE FROM bookings WHERE date=? AND name=? AND booked=?', [request.body.date, request.body.name, request.body.booked])
        .then(() => {
            response.status(200).send()
        })
})


sqlite.open('db.sqlite').then(database_ => {
    database = database_
})

app.listen(3000)
