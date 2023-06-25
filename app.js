const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config()
const PORT = 3000;

const app = express();
// middleware
app.use(express.json())

// connection config
let dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_mysql_api"
})

// connect to database
dbConn.connect()


// default route
app.get("/", (req, res) => {
    res.send("Hello from express server");
})


// retrieves all users
app.get("/users", (req, res) => {
    dbConn.query("SELECT * FROM users", (error, results) =>{
        if(error){
            throw error;
        }
        return res.json({
            data: results
        });
    });
});

// retrieve one user with id
app.get("/user/:id", (req, res) => {
    let userId = req.params.id;

    if(!userId){
        return res.status(400).json({
            msg: "Please provide User ID"
        })
    }

    dbConn.query("SELECT * FROM users WHERE id=?", userId, (error, results) =>{
        if(error){
            throw error;
        }
        return res.json({
            data: results[0]
        })
    })
})

// add new user
app.post("/user/add", (req, res) => {
    let {id, name, email, mobileNumber} = req.body

    if(!name || !email){
        return res.send("Please provide required fields");
    }

    dbConn.query("INSERT INTO users (ID, Name, Email, mobileNumber) VALUES (?,?,?,?)", [id, name, email, mobileNumber], (error, results)=>{
        if(error){
            throw error;
        }
        return res.json({
            msg: "User added successfully",
            data: results,
        });
    });
})

// update an user
app.put("/user/:id", (req, res)=>{
    let userId = req.params.id;
    let {id, name, email, mobileNumber} = req.body

    let user = {
        id,
        name,
        email,
        mobileNumber
    }

    if(!user || !userId){
        res.status(400).json({
            msg: "Please provide user id and user"
        })
    }

    dbConn.query("UPDATE users SET ? WHERE id=?", [user, userId], (error, results)=>{
        if(error){
            throw error;
        }
        return res.json({
            msg: "Updated user successfully!",
            data: results
        })
    })
})

// delete an user
app.delete("/user/:id", (req, res)=>{
    let userId = req.params.id;

    if(!userId){
        return res.status(400).send("Please provide user id");
    }

    dbConn.query("DELETE FROM users WHERE id=?", [userId], (error, results)=>{
        if(error){
            throw error;
        }
        return res.json({
            msg: "Deleted successfully",
            data: results
        })
    })
})


app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})
