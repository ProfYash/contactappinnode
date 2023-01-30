const Contact = require("./contact")
const ContactDetails = require("./contactDetails");
const Credentials = require("./credentials");
const uuid = require('uuid')

class User {
    static allUsers = [];
    static id = 0;
    constructor(firstname, lastname, credential, role) {
        this.id = uuid.v4()
        this.firstname = firstname
        this.lastname = lastname
        this.credential = credential
        this.role = role
        this.isActive = true
        this.contacts = []
    }
    static createAdmin() {
        const username = "yash"
        const password = "yash"
        const firstName = "yash"
        const lastName = "shah"
        const role="Admin"
        const [flag,message,newCredential] = Credentials.createCredential(username, password)
        const newUser = new User(firstName, lastName, newCredential, role)
        User.allUsers.push(newUser)
        return [newUser, "new user created success"]
    }
    createUser(firstname, lastname, username, password, role) {
        if (this.isActive == false) {
            return [null, "not allowed to createUser"]
        }
        if (this.role != "Admin") {
            return [null, "only Admin can create a User"]
        }

        let [isUsernameExist,indexOfUser, _] = User.findUser(username)
        if (isUsernameExist) {
            return [null, "username already exist,try new one"]
        }
        const [flag,message,newCredential]= Credentials.createCredential(username, password)
        const newUser = new User(firstname, lastname, newCredential, role)
        User.allUsers.push(newUser)
        return [newUser, "new user created success"]
    }

    static findUser(username) {
        if (this.isActive == false) {
            return [-1, false]
        }
        for (let index = 0; index < User.allUsers.length; index++) {
            if (username == User.allUsers[index].credential.username) {
                return [true,index,User.allUsers[index].isActive]
            }
        }
        return [false,-1, false]
    }

    deleteUser(username) {

        if (this.isActive == false) {
            return [false, "invalid user"]
        }

        if (this.isActive == false) {
            return [false, "this account was deleted"]
        }
        if (this.role != "Admin") {
            return [false, "Only admin can delete user"]
        }

        let [indexOfUser, isUserExist] = User.findUser(username)
        if (!isUserExist) {
            return [false, "no user exist that username"]
        }
        if (User.allUsers[indexOfUser].isActive == false) {
            return [false, "already deleted"]
        }
        User.allUsers[indexOfUser].isActive = false
        return [true, "User deleted successfully"]
    }

    updateUser(propertTobeUpdated, value) {
        switch (propertTobeUpdated) {
            case ("firstname"): this.firstname = value; return [true, this]
            case ("lastname"): this.lastname = value; return [true, this]
            default: return [false, null]

        }
    }

    findContact(fullname) {
        if (this.isActive == false) {
            return "invalid user"
        }

        if (this.contacts.length == 0) {
            return [-1, false]
        }

        for (let index = 0; index < this.contacts.length; index++) {

            if (this.contacts[index].isContactExist(fullname)) {
                return [true,this.contacts[index].isActive,index]
            }
        }
        return [false,false,-1]

    }

    createContact(firstname, lastname) {
        if (this.isActive == false) {
            return "invalid user"
        }
        let [indexOfContact, isContactExist] = this.findContact(`${firstname} ${lastname}`)

        if (isContactExist) {
            return "choose different name,that name already exist"
        }
        const newContact = new Contact(firstname, lastname)
        this.contacts.push(newContact)
        return newContact
    }

    createContactDetails(fullname, type, value) {
        if (this.isActive == false) {
            return "invalid user"
        }
        // [true,this.contacts[index].isActive,index]
        let [isContactExist,flag,indexOfContact ] = this.findContact(fullname)
        console.log(indexOfContact)

        if (!isContactExist) {
            return [false, null, "no found contact with that id"]
        }

        const { isSuccess, newcontactDetails } = this.contacts[indexOfContact].createContactDetails(type, value)
        if (!isSuccess) {
            [false, null, "this contact was deleted"]
        }
        return [true, newcontactDetails, "contact details created successfully"]
    }

    displayContact(fullname) {
        if (this.isActive == false) {
            return "invalid user"
        }
        let [indexOfContact, isContactExist] = this.findContact(fullname)
        if (!isContactExist) {
            return [false, null, "no found contact with that id"]
        }
        console.log("displaying", this.contacts[indexOfContact])
    }

    displayContacts() {
        if (this.isActive == false) {
            return "invalid user"
        }
        for (let index = 0; index < this.contacts.length; index++) {
            this.displayContact(`${this.contacts[index].firstname} ${this.contacts[index].lastname}`)
        }
    }

    deleteContact(username) {
        if (this.isActive == false) {
            return "invalid user"
        }
        let [indexOfContact, isContactExist] = this.findContact(username)
        if (!isContactExist) {
            return [false, null, "no found contact with that id"]
        }
        let isdeleted = this.contacts[indexOfContact].deleteContact()

        if (isdeleted) {
            return [true, this.contacts[indexOfContact], "contact deleted successfully"]
        }
        return [false, null, "that contact was already deleted"]
    }
}


module.exports = User