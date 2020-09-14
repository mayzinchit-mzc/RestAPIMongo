const express = require("express");
const server = express();

const body_parser = require("body-parser");

// parse JSON (application/json content-type)
server.use(body_parser.json());

const port = 4000;

// << db setup >>
const db = require("./db");
const { request } = require("express");

const dbName = "edkatestdb";
const dbCollectionName = "User";

// << db init >>

db.initialize(dbName, dbCollectionName, function(dbCollection) { // successCallback
    // get all
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

    // read all documents
    server.get("/getusers", (request, response) => {
        // return updated list
        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });
    // read one
    server.get("/getoneuser", (request, response) => {
        // const testId = request.params.id;
        const testId = request.query.userId;

        dbCollection.findOne({ userId: testId }, (error, result) => {
            if (error) throw error;
            // return item
            response.json(result);
        });
    });
    // create
    server.post("/createuser", (request, response) => {
        var lastID = 0;
        dbCollection.find().count({}, function(error, result){
            lastID = result;
            console.log("lastID ", lastID);
            const test = {
                name: request.query.name,
                address: request.query.address,
                age: request.query.age,
                gender: request.query.gender,
                userId : "us".concat(lastID)
            };
            dbCollection.insertOne(test, (error, result) => { // callback of insertOne
                if (error) throw error;
                // return updated list
                dbCollection.find().toArray((_error, _result) => { // callback of find
                    if (_error) throw _error;
                    response.json(_result);
                });
            });
        });
    });
    // update
    server.put("/updateuser", (request, response) => {
        const testId = request.query.userId;
        const test = {
            name: request.query.name,
            address: request.query.address,
            age: request.query.age,
            gender: request.query.gender,
            userId: request.query.userId
        };
        
        // dbCollection.updateOne({ id: testId }, { $set: test }, (error, result) => {
        //     if (error) throw error;
        //     // send back entire updated list, to make sure frontend data is up-to-date
        //     dbCollection.find().toArray((_error, _result) =>{
        //         if (_error) throw _error;
        //         response.json(_result);
        //     });
        // });
    });
    // delete
    server.delete("/deleteuser", (request, response) => {
        const myquery = request.query.userId;
        console.log("Delete test with id: ", myquery);

        dbCollection.deleteOne({ userId : myquery }, function(error, result) {
            if (error) throw error;
            // send back entire updated list after successful request
            dbCollection.find().toArray(function(_error, _result) {
                if (_error) throw _error;
                response.json(_result);
            });
        });
    });
}, function(err) { // failureCallback
    throw (err);
});


server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});