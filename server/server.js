const express = require("express");
const fs = require("fs/promises");
const MongoClient = require("mongodb").MongoClient;

const mongoClient = new MongoClient("mongodb://localhost:27017/");
let collection;
let dbClient;
mongoClient.connect(function (err, client) {
  dbClient = client;
  collection = client.db("usersdb").collection("users");
  // let user = { id: 1, name: "Alex", age: 21 };
  // let users = [
  //   { id: 2, name: "Diana", age: 21 },
  //   { id: 3, name: "Max", age: 21 },
  //   { id: 4, name: "Sergey", age: "46" },
  //   { id: 5, name: "Pedrio", age: "33" },
  // ];
  // collection.insertOne(user).then((result) => {
  //   console.log(result);
  //   console.log(user);
  // })
  // collection.countDocuments().then((result) => {
  //   console.log(result);
  // client.close();
  // })
  // collection.deleteOne({name: "Alexa"}).then()
  // collection.updateOne({id: 1}, {$set: {name: 'Alexandro'}});
  // collection.find().toArray().then((result) => {
  //   console.log(result);
  // });
});

const app = express();
const jsonParser = express.json();
const path = "users.json";

// app.use(express.static(__dirname + '/files'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Request-Headers", "*");
  next();
});

app.get("/users-api/users", (req, resp) => {
  collection.find().toArray()
    .then((result) => {
      resp.send(result);
      console.log(result);
    });
  // const result = fs
  //   .readFile(path, "utf-8")
  //   .then((data) => resp.send(JSON.parse(data)));
});

app.get("/users-api/users/:id", (req, resp) => {
  const reqId = req.params.id;
  // fs.readFile(path, "utf-8").then((data) => {
  collection.find().toArray().then((data) => {
    // const users = JSON.parse(data);
    const users = data;
    let result = "No such user";
    for (let us of users) {
      if (us.id == reqId) {
        result = [us];
        break;
      }
    }
    resp.send(result);
  });
});

app.post("/users-api/users", jsonParser, (req, resp) => {
  const request = req;
  const reqUserName = request.body.name;
  const reqUserAge = request.body.age;
  let newUser = { id: "", name: reqUserName, age: reqUserAge };
  // fs.readFile(path, "utf-8").then((data) => {
  //   let users = JSON.parse(data);
  collection.find().toArray().then((data) => {
    // let users = JSON.parse(data);
    let users = data;
    const usersMaxId = Math.max(...users.map((el) => el.id));
    newUser.id = usersMaxId + 1;
    // users.push(newUser);
    // fs.writeFile(path, JSON.stringify(users))
    collection.insertOne(newUser).then(() => resp.send('done'));
  });
});

app.delete("/users-api/users/:id", (req, resp) => {
  const deleteId = Number(req.params.id);
  // fs.readFile(path, "utf-8").then((data) => {
  //   let users = JSON.parse(data);
  //   for (let user of users) {
  //     if (user.id == deleteId) {
  //       result = users.splice(users.indexOf(user), 1)[0];
  //       break;
  //     }
  //   }
  //   fs.writeFile(path, JSON.stringify(users)).then(() => resp.send("done"));
  // });
  collection.deleteOne({id: deleteId}).then(() => resp.send('done'));
});

app.put("/users-api/users", jsonParser, (req, resp) => {
  const reqId = Number(req.body.id);
  const reqName = req.body.name;
  const reqAge = req.body.age;
  // fs.readFile(path, "utf-8").then((data) => {
  //   let users = JSON.parse(data);
  //   let result = "user with this ID doesn`t exist";
  //   for (let user of users) {
  //     if (user.id == reqId) {
  //       if (reqName !== "") {
  //         user.name = reqName;
  //       }
  //       if (reqAge !== "") {
  //         user.age = reqAge;
  //       }
  //       result = user;
  //       break;
  //     }
  //   }
  //   fs.writeFile(path, JSON.stringify(users)).then(() => resp.send(result));
  // });
  if (reqName !== "" && reqAge !== "") {
    collection.updateOne({id: reqId}, {$set: {name: reqName, age: reqAge}})
  .then(() => resp.send('done'));
  } else if(reqName === "" && reqAge !== "") {
    collection.updateOne({id: reqId}, {$set: {age: reqAge}})
  } else if(reqName !== "" && reqAge === "") {
    collection.updateOne({id: reqId}, {$set: {name: reqName}})
  }
});

app.listen(3001, function () {
  console.log("Server started...");
});

process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
