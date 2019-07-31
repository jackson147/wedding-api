const guestSchema = require('../models/Guest')
const mongoose = require('mongoose')
const version = require('../package.json').version

const Guest = mongoose.model('Guest');

function newGuestModel(){
    const Guest = mongoose.model('Guest');
    return new Guest
}

function prettifyGuestObjects(guestArray){
    stringResponse = ""
    for(let i =0; i<guestArray.length; i++){
        stringResponse += guestArray[i].name + "\n"
    }
    return stringResponse
}

module.exports = function(app){

    app.get('/version', (req, res) => {
        res.json({'version' : version})
    });

    app.get('/stats/attending', (req, res) => {
        let pretty=false
        let attendingParam = "yes"
        if(req.query){
            if(req.query.attending){
                attendingParam = req.query.attending
            }
            if(req.query.pretty){
                pretty = req.query.pretty == "true"
            }
        }
        Guest.find(
            {attending: attendingParam}, 
            { '_id' : 0, 'name' : 1 },
            {
                sort:{
                    name: 1
                }
            }, 
            (err, docs) => {
            if (!err){ 
                if(pretty){
                    res.send('<pre>' + prettifyGuestObjects(docs) + '</pre>')
                }else{
                    res.json(docs);
                }
            } else {throw err;}
        });
    });

    app.get('/stats/noresponse', (req, res) => {
        let day = null
        if(req.query && req.query.day){
            if(req.query.day == "true" || req.query.day == "false"){
                day = req.query.day 
            }
        }
        let query = {attending: null}
        if(day){
            query['day'] = day
        }

        Guest.find(query, { '_id' : 0, 'name' : 1 }, 
            (err, docs) => {
            if (!err){ 
                res.json(docs);
            } else {throw err;}
        });
    });

    app.get('/guests', (req, res) => {
        Guest.find({}, 
            { 
                '_id' : 0, 
                'name' : 1, 
                'attending' : 1, 
                'day' : 1, 
                'gluten' : 1, 
                'starter' : 1,
                'main' : 1, 
                'dessert' : 1 
            }, (err, docs) => {
            if (!err){ 
                res.json(docs);
            } else {throw err;}
        });
    });

    app.post('/guests', (req,res) => {
        if(req.body && req.body.name
            && req.body.passcode && req.body.attending){
                query = {
                    name : req.body.name
                }
                set = {
                    $set: {
                        attending: req.body.attending
                    }
                }
                //Set params if attending
                if(req.body.attending == "yes"){
                    set['$set']['gluten'] = req.body.gluten
                    set['$set']['starter'] = req.body.starter
                    set['$set']['main'] = req.body.main
                    set['$set']['dessert'] = req.body.dessert
                }else{
                    //Delete values
                    set['$set']['gluten'] = ""
                    set['$set']['starter'] = ""
                    set['$set']['main'] = ""
                    set['$set']['dessert'] = ""
                }

                Guest.findOne(query, (err,doc) => {
                    if(err){
                        genericMongoError(res)
                    }else{
                        
                        let docPasscodeCompare = doc.passcode.toLowerCase()
                        docPasscodeCompare = docPasscodeCompare.replace(/\s/g,'')

                        let reqPasscodeCompare = req.body.passcode.toLowerCase()
                        reqPasscodeCompare = reqPasscodeCompare.replace(/\s/g,'')

                        if(docPasscodeCompare === reqPasscodeCompare){
                            Guest.findOneAndUpdate(
                                query,
                                set,
                                {},
                                (err, doc) => {
                                    if(err){
                                        genericMongoError(res)
                                    }else{
                                        res.status(201)
                                        res.json({status:"OK"})
                                    }
                                }
                            )
                        }else{
                            res.status(401)
                            res.json({status:"Invalid passcode!" })
                        }
                    }
                })
        }else{
            res.status(400)
            res.json({status:"All parameters of form not supplied"})
        }
    })

    app.get('/test', function(req, res) {
        let guest = newGuestModel()        
        guest.save((err, docs) => {
            if (!err){ 
                res.json(docs);
            } else {throw err;}
        });
    });

    function genericMongoError(res){
        res.status(500)
        res.json({status: "Something went wrong submitting your RSVP, please try again..."})
    }
}