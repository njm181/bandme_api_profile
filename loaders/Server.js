const express = require("express");
const cors = require('cors');
const helmet = require("helmet");
const {connectDB} = require('./db');
require('dotenv').config();

const rootPath = '/api/v1/profile';

class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.path = rootPath;
        this.initMiddlewares();
        this.routes();
        connectDB();
    }

    initMiddlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(helmet());
    }

    routes(){
        this.app.use(this.path, require('../api/routes/profile.routes'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server is running on port: ' + this.port)
        });
    }

}
module.exports = Server;