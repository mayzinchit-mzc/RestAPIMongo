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
            const test = {
                name: request.query.name,
                address: request.query.address,
                age: request.query.age,
                gender: request.query.gender,
                userId : "us".concat(lastID)
            };
            dbCollection.insertOne(test, (error, result) => { // callback of insertOne
                if (error) throw error;
                response.send(json.stringify({"status": 200, "error": null}));
            });
        });
    });
    // update
    server.put("/updateuser", (request, response) => {
        const testId = request.query.userId;
        const test = request.query;
        console.log("test ", test);
        
        dbCollection.updateOne({ userId: testId }, { $set: test }, (error, result) => {
            if (error) throw error;
            response.send(json.stringify({"status": 200, "error": null}));
        });
    });
    // delete
    server.delete("/deleteuser", (request, response) => {
        const myquery = request.query.userId;
        console.log("Delete test with id: ", myquery);

        dbCollection.deleteOne({ userId : myquery }, function(error, result) {
            if (error) throw error;
            response.send(json.stringify({"status": 200, "error": null}));
        });
    });
}, function(err) { // failureCallback
    throw (err);
});


server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});