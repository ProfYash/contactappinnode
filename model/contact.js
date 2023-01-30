const ContactDetails = require("./contactDetails")

const uuid = require('uuid')
class Contact {
    // static id = 0;
    constructor(firstname, lastname) {
        this.id = uuid.v4()
        this.firstname = firstname
        this.lastname = lastname
        this.fullname = firstname + " " + lastname
        this.isActive = true
        this.contactDetails = []
    }


    isContactExist(fullname) {
        if (this.isActive == false) {
            return false
        }
        return this.fullname == fullname
    }

    deleteContact() {
        if (this.isActive == false) {
            return false
        }
        this.isActive = false
        return true
    }
    findContactDetail(type) {
        for (let index = 0; index < this.contactDetails.length; index++) {
            if (this.contactDetails[index].type == type) {
                return [true, index]
            }
        }
        return [false, -1]
    }
    createContactDetails(type, value) {
        if (this.isActive == false) {
            return [false, null]
        }
        const [isContactDetailTypeExisit, indexofContactDetail] = this.findContactDetail(type)
        if (isContactDetailTypeExisit){
            return [false,"Type already exisit"]
        }
        const newcontactDetails = new ContactDetails(type, value)
        this.contactDetails.push(newcontactDetails)
        return [true, newcontactDetails]
    }
}

module.exports = Contact