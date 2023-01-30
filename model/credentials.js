const uuid = require('uuid');
class Credentials {
    static allCredentials = []
    constructor(username, password) {
        this.username = username
        this.password = password
        this.credId = uuid.v4()
    }
    static findUsername(username){
        for (let index = 0; index < Credentials.allCredentials.length; index++) {
            if(Credentials.allCredentials[index].username==username){
                return [true,index]
            }     
        }
        return [false,-1]
    }
    static createCredential(username, password) {
       const [isUserNameExist,_ ]= Credentials.findUsername(username)
        if (isUserNameExist){
            return [false,"UserName Already Exist",null]
        }
      const  newCredentials=new Credentials(username,password)
        Credentials.allCredentials.push(newCredentials)
        return [true,"Credentials created for "+username,newCredentials]
    }
}
module.exports = Credentials