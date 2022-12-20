const app = require("./app");
const dotenv = require("dotenv")
const path = require('path')

const connectDatabase = require("./config/database");
const { Server } = require("http");

//Handling uncaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

//config
console.log(__dirname+'/config/config.env');
dotenv.config({ path: __dirname + '/config/config.env' });

// connecting to database
connectDatabase();


console.log(`${process.env.PORT}`);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server id working on http://localhost:${process.env.PORT}`);
})

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);

    })
})
