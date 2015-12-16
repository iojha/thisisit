// We load the Location model
var Location = require('../models/location');
var User = require('../models/user');
var mongoose = require('../node_modules/mongoose');
// **********************************
// POST Locations
// **********************************
// Create endpoint /api/locations for POSTS
exports.postLocations = function(req, res) {
 
    // Create a new instance of the Location model
    var location = new Location();
 
    // Set the location properties that came from the POST data
    console.log(req.body.message);
    console.log(req.body.latitude);
    console.log(req.body.longitude);
    console.log(req.body.city);
 
    location.latitude = req.body.latitude;
    location.longitude = req.body.longitude;
    location.name = req.body.name;
    location.loc = req.body.loc;
    location.message = req.body.message;
    location.contact = req.body.contact;
    location.website = req.body.website;
    location.description = req.body.description;
 
    //passport will automatically set the user in req.user
    location.userId = req.user._id;
 
    // Save the location and check for errors
    location.save(function(err) {
        if (err){
            res.send(err);
            return;
        }
 
        res.json({
            success: 'Location added successfully',
            data: location
        });
        console.log("location added");
    });

};

// **********************************
// GET Locations
// **********************************
// Create endpoint /api/locations for GET
exports.getLocations = function(req, res) {
    // Use the Location model to find all locations
    // from particular user with their username
    Location.find({}).lean().exec(function(err, locations) {
        if(err){
            res.send(err);
            console.log("Unable to find location [ Error:" + err + " ]")
            return;
        }
 
        //We want to set the username on each location by looking
        //up the userId in the User documents.
        //
        //Because of mongoose asynchronism, we will have to wait
        //to get all the results from the queries on the User model
        //We can send them when we have iterated
        //through every location (counter === l)
        var counter = 0;
        var l = locations.length;
 
        //We create a closure to have access to the location
        var closure = function(location){
 
            return function(err, user){
 
                counter++;
 
                if(err)
                    res.send(err);

                if (!user) {
                    console.log("No user [ Error:" + err + " ]");
                    return;
                }
 
                location.username = user.username;
 
                //when all the users have been set
                if(counter === l ) {
                    //respond
                    res.json(locations);
                    return;
                }           
            };
        };
 
        //We iterate through all locations to find their associated
        //username.
        for (var i = 0; i < l; i++) {
            User.findById(locations[i].userId, closure(locations[i]));
        }
    });
};
 
// **********************************
// GET a Location
// **********************************
// Create endpoint /api/locations/:location_id for GET
exports.getLocation = function(req, res) {
    // Use the Location model to find a specific location
    console.log(req.user._id);
    Location.find({
        userId: req.user._id,
        _id: req.params.location_id
    }, function(err, location) {
        if (err)
            res.send(err);
        console.log("get locations error " + err)
 
        res.json(location);
    });
};

// **********************************
// GET a location as a user
// **********************************
// Create endpoint /api/locations/:location_id for GET
exports.findLocation = function(req, res) {
    // Use the Location model to find a specific location
    Location.find({
        _id: req.params.location_id
    }, function(err, location) {
        if (err)
            res.send(err);
        console.log("get locations error " + err);
        //console.log("location:"+location);
        location = location[0];
        var contents = "<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.js'></script>" + "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' integrity='sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7' crossorigin='anonymous'></link>" + "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js' integrity='sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS' crossorigin='anonymous'></script>" + 
        "<div class='row container' style='padding: 20px 20px'><h1 style='font-family: Roboto'; padding-bottom: 0 !important;'>" + location.name + "</h3>" + 
        location.website + "<br />" +
        "<h3>"+ "Open Volunteer Position:</h1>" + "<p>" + location.message + "</p>" +
        "<h3>Position Description</h3><p>" + location.description + "</p>" + "<br /><br/>" + "<a href='mailto:"+ location.contact+"'>" + "<button class='btn btn-info'>Contact</button></a><br/>" +
        "<a href='/#/sign-up' style='font-size: 11px;'>Back to Map" + "</a>" +
        "</div>";
        res.send(contents);
    });
};
 
// **********************************
// UPDATE a Location
// **********************************
// Create endpoint /api/locations/:location_id for PUT
exports.putLocation = function(req, res) {
    // Use the Location model to find a specific location
    Location.update({
        userId: req.user._id,
        _id: req.params.location_id
    }, {
        message: req.body.message,
        city: req.body.city
    }, function(err, num, raw) {
        if (err)
            res.send(err);
 
        res.json({
            message: 'message updated'
        });
    });
};
 
// **********************************
// DELETE Location
// **********************************
// Create endpoint /api/locations/:location_id for DELETE
exports.deleteLocation = function(req, res) {
    // Use the Location model to find a specific location and remove it
    Location.remove({
        userId: req.user._id,
        _id: req.params.location_id
    }, function(err) {
        if (err)
            res.send(err);
 
        res.json({
            message: 'Location deleted'
        });
    });
};