let express = require("express");
let cors = require('cors');
let MongoClient = require("mongodb").MongoClient;
let bodyParser = require("body-parser");
let sanitizer = require("express-sanitizer");
let ObjectId = require("mongodb").ObjectId;

// MongoDB constants
const URL = "mongodb://localhost:27017/";
const DB_NAME = "dbTechs";

// construct application object via express
let app = express();
// add cors as middleware
app.use(cors());

// add body-parser / sanitizer as middleware
app.use(bodyParser.json());
app.use(sanitizer());

// express static middleware - setup static files location
app.use("/", express.static('./build'));

app.get("/get", async (request, response) => {
    // construct MongoClient object for working with MongoDB
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        // convert all documents in technologies collection into array in one awesome statement!
        let techArray = await mongoClient.db(DB_NAME).collection("technologies").find().sort("name",1).toArray();
        let courseArray = await mongoClient.db(DB_NAME).collection("all_courses").find().sort("code",1).toArray();
        let json = { "technologies": techArray,
                    "all_courses": courseArray };
        
        response.status(200);
        response.send(json);
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        // close mongoClient (connection to MongoDB server)
        mongoClient.close();
    }
});

app.post("/add", async (request, response) => {
    // construct MongoClient object for working with MongoDB
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    // Use connect method to connect to the server
    try {
        await mongoClient.connect(); 
        let result;
        // if all courses
        if( request.body.collection_type === "all_courses") {
            request.body.code = request.sanitize(request.body.code);
            request.body.name = request.sanitize(request.body.name);
            result = await mongoClient.db(DB_NAME).collection("all_courses").insertOne(request.body);
        } else {
           // else its techs
            request.body.name = request.sanitize(request.body.techName);
            request.body.description = request.sanitize(request.body.description);
            request.body.difficulty = request.sanitize(request.body.difficulty);
            request.body.courses.forEach(course => {
                course.code = request.sanitize(course.code);
                course.name = request.sanitize(course.name);
            });

            result = await mongoClient.db(DB_NAME).collection("technologies").insertOne(request.body);
        }
        
        response.status(200);
        response.send(result);     
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        
        mongoClient.close();
    }
});


app.post("/put", async (request, response) => {
    
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect(); 
        let id = new ObjectId(request.sanitize(request.body.id));
        request.body.type_collection = request.sanitize(request.body.type_collection);
        
        let selector = { "_id":id };
        let result;
        if(request.body.type_collection === "technologies") {
            // for technologies
            
            request.body.name = request.sanitize(request.body.name);
            request.body.description = request.sanitize(request.body.description);
            request.body.difficulty = request.sanitize(request.body.difficulty);
            console.log("this is right before courses for each");
            request.body.courses.forEach(course => {
                course.code = request.sanitize(course.code);
                course.name = request.sanitize(course.name);
            });
            
            let selector = { "_id":id };
            let newValues = { $set: {"name": request.body.name, "description":request.body.description, 
                            "difficulty": request.body.difficulty, "courses": request.body.courses } };

            result = await mongoClient.db(DB_NAME).collection("technologies").updateOne(selector, newValues);
        } else {
            // for all_courses
            request.body.code = request.sanitize(request.body.code);
            request.body.name = request.sanitize(request.body.name);
            request.body.courses.forEach(course => {
                course.code = request.sanitize(course.code);
                course.name = request.sanitize(course.name);
            });
            let newValues = { $set: {"code": request.body.code, "name":request.body.name } };
            result = await mongoClient.db(DB_NAME).collection("all_courses").updateOne(selector, newValues);
            result = await mongoClient.db(DB_NAME).collection("technologies").updateMany({ "courses.code": request.body.code }, { $set: {"courses.$.name" : request.body.name } });
            
        }
        // check for no updates
        if (JSON.parse(result).n <= 0) {
            response.status(404);
            response.send({error: "No "+ request.body.type_collection + " documents found with ID"});
            mongoClient.close();
            return;
        }

        // response with result JSON for client side to use
        response.status(200);
        response.send(result);     
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        
        mongoClient.close();
    }
});

// ----------------------------------------- Delete
app.delete("/delete", async (request, response) => {
    // handling deleteing of collection in one
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect(); 
        let id = new ObjectId(request.sanitize(request.body.id));
        let result;
        // delete allcourses and tech courses
        if (request.body.type_collection === "all_courses") {
            result = await mongoClient.db(DB_NAME).collection("all_courses").deleteOne({_id:id});
            const filter = { };
            result = await mongoClient.db(DB_NAME).collection("technologies").deleteMany(filter, { $pull: { "courses": {code: { $in: [request.courses.code]} }}},{multi: true});
        // delete techs
        } else {
            result = await mongoClient.db(DB_NAME).collection("technologies").deleteOne({_id:id});
        }
        if (JSON.parse(result).n <= 0) {
            response.status(404);
            response.send({error: "No"+ request.body.type_collection + " documents found with ID " + id});
            mongoClient.close();
            return;
        }
        response.status(200);
        response.send(result);     
    } catch (error) {
        response.status(500);
        response.send({error: error.message});
        throw error;
    } finally {
        mongoClient.close();
    }
});
//app.listen(80, () => console.log("Listening on port 8080"));
app.listen(8080, () => console.log("Listening on port 8080"));