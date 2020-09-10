const express = require("express");
const server = express();

const body_parser = require("body-parser");

// parse JSON (application/json content-type)
server.use(body_parser.json());

const port = 4000;

// << db setup >>
const db = require("./db");
const dbName = "edkatestdb";
const dbCollectionName = "User";


// << db init >>

db.initialize(dbName, dbCollectionName, function(dbCollection) { // successCallback
    // get all
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
          console.log(result);
    });

    // << db CRUD routes >>
    //read all documents
    server.get("/getusers", (request, response) => {
        // return updated list
        dbCollection.aggregate([
            {$match:{name : {$exists : true}, address : {$exists : true}}},
            {$project : {_id : 0}}
            ]).toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });
     //read one
     server.get("/getoneuser", (request, response) => {
        // const testId = request.params.id;
        const testId = request.query.name;
    
        // dbCollection.findOne({ name : testId}, (error, results) => {
        //     if (error) throw error;
        //     // return one document
        //     response.json(results);
        // });
        dbCollection.aggregate(
            [
              {$match:{name : {$exists : true}, address : {$exists : true}, _id : objectId("5f575145c58fcf23c44ffbe6")}}
            ]
          ).toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });
    //create
    server.post("/createuser", (request, response) => {
       
        // response.json(request.query.name);
        // response.json(request.query.address);
        const test = {
            name: request.query.name,
            address: request.query.address
        };
        // const test = request.body;
        // response.result(request.query.name);
        dbCollection.insertOne(test, (error, result) => { // callback of insertOne
            if (error) throw error;
            // return updated list
            dbCollection.find().toArray((_error, _result) => { // callback of find
                if (_error) throw _error;
                response.json(_result);
            });
        });
    });
   //update
   server.put("/updateuser/:id", (request, response) => {
    const testId = request.params.id;
    const test = request.body;
    console.log("Editing test: ", testId, " to be ", test);

    dbCollection.updateOne({ id: testId }, { $set: test }, (error, result) => {
        if (error) throw error;
        // send back entire updated list, to make sure frontend data is up-to-date
        dbCollection.find().toArray(function(_error, _result) {
            if (_error) throw _error;
            response.json(_result);
        });
    });

    //delete
    server.delete("/deleteuser/:id", (request, response) => {
        const testId = request.params.id;
        console.log("Delete test with id: ", testId);
    
        dbCollection.deleteOne({ id: testId }, function(error, result) {
            if (error) throw error;
            // send back entire updated list after successful request
            dbCollection.find().toArray(function(_error, _result) {
                if (_error) throw _error;
                response.json(_result);
            });
        });
    });
});
}, function(err) { // failureCallback
    throw (err);
});


server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});