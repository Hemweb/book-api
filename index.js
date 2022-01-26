// MAIN BACKEND

// const db = require("./database/index.js");
const BookModel = require("./database/books");
const AuthorModel = require("./database/authors");
const PublicationModel = require("./database/publications");

const express = require("express");
const app = express();
app.use(express.json());

// import the mongoose module
const mongoose = require('mongoose');
// default mongoose collection
var mongoDB = "mongodb+srv://hem_web:Hemwebdb@cluster0.vgdqx.mongodb.net/book-company?retryWrites=true&w=majority";
mongoose.connect(mongoDB,  { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("CONNECTION ESABLISHED"));

// const { MongoClient } = require('mongodb');

// const uri = "mongodb+srv://hem_web:Hemwebdb@cluster0.vgdqx.mongodb.net/book-company?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const bcollection = client.db("book-company").collection("books").findOne({ISBN: "1234Three"});
//   bcollection.then((data) => console.log(data)).catch((err) => console.log(err));
// });

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
//     console.log("THE DATABASES ARE:");
//     databasesList.databases.forEach(db => console.log(db.name));
// }

// async function main(){
//     const uri = "mongodb+srv://hem_web:Hemwebdb@cluster0.vgdqx.mongodb.net/book-company?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     try {
//         await client.connect();
//         const result = await client.db("book-company").collection("books").findOne({ISBN: "1234Three"});
//         console.log(result);
//         // await listDatabases(client);
//     }
//     catch(err) {
//         console.log(err);
//     }
//     finally {
//         await client.close();
//     }
// }
// main();


app.get("/", (req, res) => {
    return res.json({"WELCOME 🙏": `to my backend software for the book company`});
});

// http://localhost:3000/books
app.get("/books", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

// http://localhost:3000/book-isbn/12345ONE
app.get("/book-isbn/:isbn", async (req, res) => {
    // console.log(req.params);
    const {isbn} = req.params;
    // console.log(isbn);
    const getSpecificBook =  await BookModel.findOne({ISBN: isbn});
    // console.log(getSpecificBook);
    // console.log(getSpecificBook.length);
    if(getSpecificBook=== null){
        return res.json({"error": `no book found for the ISBN of ${isbn}`})
    }
    return res.json(getSpecificBook);
    
});

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
    // console.log(req.params);
    const {category} = req.params;
    console.log(category);
    const getSpecificBooks = await BookModel.find({category: category});
    console.log(getSpecificBooks);
    console.log(getSpecificBooks.length);
    if(getSpecificBooks.length === 0){
        return res.json({"error": `no book found for the category of ${category}`})
    }
    return res.json(getSpecificBooks);


});

// http://localhost:3000/authors
app.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
});

// http://localhost:3000/author/2
app.get("/author/:id", (req, res) => {
    // console.log(req.params);
    let {id} = req.params;
    id = Number(id);
    // console.log(id);
    const getSpecificAuthor = db.authors.filter((author) => author.id === id);
    // console.log(getSpecificAuthor);
    console.log(getSpecificAuthor.length);
    if(getSpecificAuthor.length === 0){
        return res.json({"error": `no book Author for the id of ${id}`})
    }
    return res.json(getSpecificAuthor[0]);
    
});

// http://localhost:3000/authors
app.get("/publications", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json(getAllPublications);
});


// http://localhost:3000/book
app.post("/book", async (req, res) => {
    // console.log(req.body);
    const addNewBook = await BookModel.create(req.body);
    return res.json({
        bookAdded: addNewBook,
        message: "Book was added !!!"
    });
});

// http://localhost:3000/author
app.post("/author", async (req, res) => {
    const addNewAuthor = await AuthorModel.create(req.body);
    return res.json({
        authorAdded: addNewAuthor,
        message: "Author was added !!!"
    });
});


// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", async (req, res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn} = req.params;

    const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn},req.body, {new: true});
    return res.json({
        bookUpdated: updateBook,
        message: "Book was updated !!!"
    });
});

// http://localhost:3000/author-update/1
app.put("/author-update/:id", async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    let {id} = req.params;
    id = Number(id);
    
    const updateAuthor = await AuthorModel.findOneAndUpdate({id: id},req.body, {new: true});
    return res.json({
        authorUpdated: updateAuthor,
        message: "Author was updated !!!"
    });
});

// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", async (req, res) => {
    console.log(req.params);
    const {isbn} = req.params;
    const deleteBook = await BookModel.deleteOne({ISBN: isbn});
    return res.json({
        BookDeleted: deleteBook,
        message: "Book was Deleted !!!"
    });
});




// http://localhost:3000/book-author-delete/123Two/1
app.delete("/book-author-delete/:isbn/:id", async (req, res) => {
    console.log(req.params);
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    
    if(getSpecificBook=== null){
        return res.json({"error": `no book found for the ISBN of ${isbn}`})
    }
    else {
        getSpecificBook.authors.remove(id);

        const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn},getSpecificBook, {new: true});
    return res.json({
        bookUpdated: updateBook,
        message: "Athor was deleted from the Book !!!"
    });
    }

    
});

app.listen(process.env.PORT || 3000, () => {
    console.log("MY EXPRESS APPP IS RUNNING...");
})