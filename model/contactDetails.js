const uuid = require('uuid')
class ContactDetails {
    // static id = 0;2
    constructor(type, value) {
        this.id = uuid.v4()
        this.type = type
        this.value = value
    }
}

module.exports = ContactDetails