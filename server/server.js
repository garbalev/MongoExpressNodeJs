const express = require('express');
const fs = require('fs/promises');


const app = express();
const jsonParser = express.json();
const path = 'users.json'

// app.use(express.static(__dirname + '/files'));




app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Request-Headers', '*');
    next();
})

app.get('/users-api/users', (req, resp) => {
    const result = fs.readFile(path, "utf-8")
    .then(data => resp.send(JSON.parse(data)))
});

app.get('/users-api/users/:id', (req, resp) => {
    const reqId = req.params.id;
    fs.readFile(path, "utf-8")
    .then(data => {
        const users = JSON.parse(data);
        let result = 'user was not found';
        for (let us of users) {
            if (us.id == reqId) {
                result = us;
                break;
            }
        }
        resp.send(result)
    })
});

app.post('/users-api/users', jsonParser, (req, resp) => {
    const request = req;
    const reqUserName = request.body.name;
    const reqUserAge = request.body.age;
    let newUser = {id: '', name: reqUserName, age: reqUserAge};
    fs.readFile(path, 'utf-8')
    .then(data => {
        let users = JSON.parse(data);
        const usersMaxId = Math.max(...users.map(el => el.id));
        newUser.id = usersMaxId + 1;
        users.push(newUser);
        fs.writeFile(path, JSON.stringify(users))
        .then(resp.send(users))
    })
});

app.delete('/users-api/users/:id', (req, resp) => {
    const deleteId = req.params.id;
    fs.readFile(path, "utf-8")
    .then(data => {
        let users = JSON.parse(data);
        let result = 'user with this ID doesn`t exist';
        for (let user of users) {
            if (user.id == deleteId) {
                result = users.splice(users.indexOf(user), 1)[0];
                break;  
            } 
        }
        fs.writeFile(path, JSON.stringify(users))
        .then(resp.send(result))

    })
})

app.listen(3000, function(){
    console.log("Server started...");
});