const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const uuid = require('uuid');
const User = require('./model/user');
const JWTPayload = require('./model/authentication');
const app = express();
const cookieParser = require('cookie-parser')
const MongoDB = require("./repository/database.js")
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
const [admin, flag] = User.createAdmin()
console.log(User.allUsers);
app.post("/api/v1/login", (req, resp) => {
    const { username, password } = req.body
    let [isUsernameExist, indexOfUser, _] = User.findUser(username)
    if (!isUsernameExist || User.allUsers[indexOfUser].credential.password != password) {
        resp.status(504).send("Invalid Credentials")
        return
    }
    const newPayload = new JWTPayload(User.allUsers[indexOfUser])
    const newToken = newPayload.createToken()
    resp.cookie("myToken", newToken,{
        expires: new Date(Date.now() + 1 * 1000),
    })
    resp.status(200).send("Loggin Done")
})



app.post('/api/v1/createUser', (req, resp) => {

    let { firstName, lastName, role, username, password } = req.body
    console.log("******************")
    console.log(admin)
    let [newUser, message] = admin.createUser(firstName, lastName, username, password, role)
    if (newUser == null) {
        resp.status(504).send(message)
        return
    }
    // User.allUsers.push(newUser)
    resp.status(201).send(newUser)
    return
})

app.get("/api/v1/getAllUser", (req, resp) => {

    if (!JWTPayload.isValidUser(req, resp)) {
        return
    }
    resp.status(201).send(User.allUsers)
    return
})

app.put("/api/v1/updateUser/:username", (req, resp) => {
    let { parameter, value } = req.body
    let username = req.params.username
    console.log("username: ", username)
    let [isUserExist, indexOfuser, isUserActive] = User.findUser(username)
    console.log("***************")
    console.log(indexOfuser)
    if (!isUserExist || !isUserActive) {
        resp.status(504).send("User doesnt Exist")
        return
    }
    isUpdate = User.allUsers[indexOfuser].updateUser(parameter, value)
    if (!isUpdate) {
        resp.status(504).send("User Not Updates")
        return
    }
    resp.status(200).send(User.allUsers[indexOfuser])
    return
})
app.put("/api/v1/updateContact/:contactname", (req, resp) => {
    let { parameter, value } = req.body
    let username = req.params.username
    console.log("username: ", username)
    let [isUserExist, indexOfuser, isUserActive] = User.findUser(username)
    console.log("***************")
    console.log(indexOfuser)
    if (!isUserExist || !isUserActive) {
        resp.status(504).send("User doesnt Exist")
        return
    }
    isUpdate = User.allUsers[indexOfuser].updateUser(parameter, value)
    if (!isUpdate) {
        resp.status(504).send("User Not Updates")
        return
    }
    resp.status(200).send(User.allUsers[indexOfuser])
    return
})

app.post("/api/v1/createContact/:username", (req, resp) => {
    let { firstName, lastName } = req.body
    let username = req.params.username
    console.log(username);
    let [isUserExist, indexOfuser, isUserActive] = User.findUser(username)
    if (!isUserExist || !isUserActive) {
        resp.status(504).send("User doesnt Exist")
        return
    }
    const newContact = User.allUsers[indexOfuser].createContact(firstName, lastName, true)
    resp.status(200).send(User.allUsers[indexOfuser])
    return
})
app.post("/api/v1/createContactDetail/:username/:firstName/:lastName", (req, resp) => {
    let username = req.params.username
    let [isUserExist, indexOfuser, isUserActive] = User.findUser(username)
    console.log(indexOfuser)
    if (!isUserExist || !isUserActive) {
        resp.status(504).send("User doesnt Exist")
        return
    }
    let firstName = req.params.firstName
    let lastName = req.params.lastName
    const [isContactExist, isContactActive, indexOfcontact] = User.allUsers[indexOfuser].findContact(firstName + " " + lastName)
    console.log(isContactExist, isContactActive, indexOfcontact);
    if (!isContactExist || !isContactActive) {
        resp.status(504).send("Contact doesnt Exist")
        return
    }
    const { type, value } = req.body
    const [isContactDetaileCreated, newContactDetail, message] = User.allUsers[indexOfuser].createContactDetails(firstName + " " + lastName, type, value)
    if (!isContactDetaileCreated) {
        resp.status(504).send(message)
        return
    }
    resp.status(200).send(message)
    return
})
app.listen(9000, () => {
    console.log("started at 9000");
})