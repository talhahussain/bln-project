const asyncHandler = require('../utils/catchAsync')
const Location = require('../model/locationModel')
const geoDistance = require('geo-distance')

exports.addLocation = asyncHandler( async (req,res, next) => {

     try{

          const newLocation = await Location.create({

               name: req.body.name,
               loc: {type: "Point", coordinates: req.body.coordinates}
          })
     
          res.status(201).json({

               status: "Success",
               message: "New location has been added",
               data: newLocation
          })     

     }
     catch(err) {

          res.status(400).json({

               status: "fail",
               message: "Cannot add the location",
               data: err
          })     
          
     }

})

exports.getLocation = asyncHandler(async (req, res, next) => {


     const locations = await Location.find({})

     if(locations.length === 0){
          return res.status(400).json({
               status: "fail",
               message: "No locations found"
          })

     }
     res.json({
          status: "Success",
          data: locations
     })
})

exports.location = asyncHandler(async (req, res, next) => {

     
     const locations = await Location.find({ })

     const newLocation = req.body.map( element => {

          const p_longitude = element.pickup[0];
          const p_latitude = element.pickup[1];
          const d_longitude = element.dropoff[0];
          const d_latitude = element.dropoff[1];

          let newPickup;
          let newDropoff;
          locations.forEach(location => {

               if(location.loc.coordinates[0] === p_longitude && location.loc.coordinates[1] === p_latitude )
                    newPickup = location.name;

               else if(location.loc.coordinates[0] === d_longitude && location.loc.coordinates[1] === d_latitude)
                    newDropoff = location.name;
          })

          return {
               pickup: newPickup,
               dropoff: newDropoff
          }

     })
     
     res.json({
          location: newLocation
     })
})



exports.getFare = (req, res) => {


     var pickup = {
          lat: req.body.pickupCoords[1],
          lon: req.body.pickupCoords[0]
     }

     var dropOff = {
          lat: req.body.dropoffCoords[1],
          lon: req.body.dropoffCoords[0]
     }

     var distance = geoDistance.between(pickup, dropOff).human_readable();
     
     var dist = parseFloat(distance.distance);
     if(distance.unit === 'km')
          dist = parseFloat(distance.distance) * 1000;

     var fare = 0.000025 * dist;

     res.json({
          distance: dist,
          fare: fare
     })
}