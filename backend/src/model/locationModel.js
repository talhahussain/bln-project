const mongoose = require('mongoose')


const locationSchema = new mongoose.Schema({

     name: {
          type: String,
          required: true,
          lowercase: true
     },
     loc: {
          type: {type:String},
          coordinates: [Number]
     }
})

locationSchema.index({"loc": '2dsphere'});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;