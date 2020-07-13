const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const dotenv = require('dotenv')
const connectDB = require('./utils/database')

app.use(express.json())
app.use(cors())
app.use(cookieParser())
dotenv.config({ path: './config/config.env' });

connectDB();

const userRoute = require('./Routes/userRoute')
const locationRoute = require('./Routes/locationRoute')

app.use('/user', userRoute)
app.use('/location', locationRoute)

const {addDriver} = require('./users')

io.on('connection', async (socket) => {


     socket.on('joinDriver', (dri, callBack) => {

          const {d} = addDriver({id: socket.id, driver:dri, room: 'drivers'});
          socket.join(d.room)
          callBack(`${d.driver.name} joined`)

     })
     socket.on('joinRider', (rider, callBack) => {

          socket.broadcast.to('drivers').emit('ride', rider);
          socket.join('rider')
     })
     socket.on('accepted', (user, callBack) => {

          console.log(user.name + ' Accepted the ride')
          io.to('rider').emit('rideAccepted', user)
     })

     socket.on('completed', () => {

          io.to('rider').emit("done", "Ride is completed");
     })
     socket.on('acceptedRider', (message, callBack) => {

          io.to('drivers').emit("riderAccepted", "Rider accepted");
     })


})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

     console.log("Server is started at port", PORT);
})