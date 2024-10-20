import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// line 7 to 20 all are middleware connections . registering or connecting middleware to express
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    // origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE"], //only these methods are allowed
    credentials: true, //to make fronted and backend connection easier
  })
);

app.use(express.json({limit: "16kb"})); //to parse incoming JSON data in the request body.
app.use(express.urlencoded({extended: true, limit: "16kb"}));
// app.use(express.static("public"))
app.use(cookieParser()); //parses cookies from the incoming request

//routes import
import userRouter from "./routes/user.routes.js";
//routes declaration

app.use("/api/v1/users", userRouter);
// http://localhost:8000/api/v1/users/register

export {app};
