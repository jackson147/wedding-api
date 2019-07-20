const guestSchema = require('../models/Guest')
const mongoose = require('mongoose')
const version = require('../package.json').version

const Guest = mongoose.model('Guest');

function newGuestModel(){
    const Guest = mongoose.model('Guest');
    return new Guest
}

module.exports = function(app){

    app.get('/version', (req, res) => {
        res.json({'version' : version})
    });

    app.get('/guests', (req, res) => {
        Guest.find({}, 'name attending day gluten starter main dessert', (err, docs) => {
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