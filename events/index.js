const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

const events=[]

app.post('/events', (req, res) => { //this receives an event from other microservices and forwards it to all

    const event = req.body

    events.push(event) //pushing the event received into array for later use
    

    axios.post('http://poost-srv:4000/events', event).catch((err) => {
        console.log(err.message);
      });
  /*    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
      });
      axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
      });
      axios.post('http://localhost:4003/events', event).catch((err) => {
        console.log(err.message);
      });*/

    res.send({status: 'OK'})

    


})

app.get('/events', (req, res) => {
    res.send(events)
})

app.listen(4005, async ()=> {
    console.log('Listening on 4005')
})