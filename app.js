const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const indexRouter = require("./routes/index");
require("dotenv").config();

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI_PROD;
const PORT = process.env.PORT || 5000;

mongoose
    .connect(mongoURI)
    .then(() => console.log("mongoose connected"))
    .catch((error) => console.log("DB connection failed", error));

app.use("/api", indexRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'https://deving.netlify.app/',
        methods: ['GET', 'POST'],
        credentials: true
    },
}).listen(httpServer);

require("./utils/io")(io);

httpServer.listen(PORT, () => {
    console.log("server listening on port", PORT);
});
