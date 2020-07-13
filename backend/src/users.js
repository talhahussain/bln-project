const drivers = [];

const addDriver = ({id, driver, room}) => {

     const d = {id, driver, room}
     drivers.push(d)

     return {d}
}

const getUser = (id) => users.find(user => user.id === id)

const getUserInRoom = room => users.filter(user => user.room === room);

module.exports = {addDriver, getUser, getUserInRoom}