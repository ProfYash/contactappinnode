// const mongo = require('mongodb')
let mongoose = require('mongoose');

// const mongoClient = mongo.MongoClient
const url = "mongodb://localhost:27017/myfirstmongo"
// let dbObject = null
// let dbBooks = null

// class MongoDB {
//     constructor() {

//     }
//     static insertOne(book) {
//         mongoClient.connect(url, (err, db) => {
//             if (err) throw err;
//             console.log("Database created!");
//             let dbo = db.db("myfirstmongo")
//             dbo.collection("books").insertOne(book, function (err, res) {
//                 if (err) throw err;
//                 console.log("1 document inserted");
//                 db.close();
//             });
//         })
//     }
//     static findOne(name) {
//         mongoClient.connect(url, (err, db) => {

//         })
//     }
// }

class Book {
    constructor(name, author, yearOfPublication, childBook) {
        this.name = name
        this.author = author
        this.yearOfPublication = yearOfPublication
        this.childBook = childBook
    }
}
const BookSchema = mongoose.Schema({
    name: { type: String },
    author: { type: String },
    yearOfPublication: { type: Number },
    childBook: { type: mongoose.SchemaTypes.ObjectId,ref:"Books" },
}, {
    timestamps: true
})
let BookModel = new mongoose.model('Books', BookSchema)
class DatabaseMongoose {
    constructor() {
        this._connect()
    }
    _connect() {
        mongoose.connect(url)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error')
            })
    }
    async insertOne(book) {
        try {
            let newRecord = await BookModel.create(book)
            return newRecord
        }
        catch (e) {
            console.log(e.message)
        }
    }
    async insertMany(listOfbooks) {
        let newRecords = await BookModel.insertMany(listOfbooks).then(function () {
            console.log("Data inserted")  // Success
        }).catch(function (error) {
            console.log(error)      // Failure
        });
        return newRecords
    }
    async getBook(name) {
        // let record = await BookModel.find({ name: name })
        let record = await BookModel.where("name").equals(name).limit(5).populate("childBook")
        return record

    }
}

let dbMongooseObj = new DatabaseMongoose()
// async function demoInsertOne() {
//     let newRecord = await dbMongooseObj.insertOne(new Book("Ankit", "author", "2020","630315fc38b9f4ef67ead0b3"))
//     console.log(newRecord)
// }
// demoInsertOne()

// let listOfNewBooks = []
// for (let index = 0; index < 10; index++) {
//     let name = "yashshah"+ String(index)
//     let author = "test" + String(index)
//     let yearOfPublication = 2103
//     listOfNewBooks.push(new Book(name, author, yearOfPublication))
// }
// console.log(dbMongooseObj.insertMany(listOfNewBooks))

async function demoGetBook() {
    let record = await dbMongooseObj.getBook("Ankit")
    console.log(record[0].childBook)
}
demoGetBook()
// // demoInsertOne()
module.exports = {  DatabaseMongoose }
