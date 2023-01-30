const jwt = require("jsonwebtoken")
class JWTPayload {
    static secrateKey = "strongPassword"
    constructor(user) {
        this.username = user.credential.username
        this.role = user.role
        this.firstName = user.firstname
        this.isActive = user.isActive
    }
    createToken() {
        return jwt.sign(JSON.stringify(this), JWTPayload.secrateKey)
    }
    static verifyCookie(token) {
        return jwt.verify(token, JWTPayload.secrateKey)
    }
    static isValidUser(req, res) {
        // check cookie exist
        console.log("**********");
        const myCookie = req.cookies["myToken"]
        console.log("**********");
        if (!myCookie) {
            resp.status(504).send("Login Required")
            return false
        }
        //check payoload and isActive,role
        console.log(myCookie)
        const newPayload = JWTPayload.verifyCookie(myCookie)
        console.log(newPayload);
        if (newPayload.role != "Admin" || !newPayload.isActive) {
            resp.status(504).send("Admin Login Required")
            return false
        }
        return true
    }
}
module.exports = JWTPayload