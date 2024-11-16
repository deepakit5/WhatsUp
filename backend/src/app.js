import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
    credentials: true, //to make fronted and backend connection easier
  })
);

app.use(express.json({limit: "16kb"})); //to parse incoming JSON data in the request body.
app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(cookieParser()); //parses cookies from the incoming request

//routes import
import allRoutes from "./routes/index.routes.js";

//routes declaration
app.use("/api/v1", allRoutes);

// http://localhost:5000/api/v1/users/register

export {app};
