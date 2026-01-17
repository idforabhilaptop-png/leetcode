import express from "express";
import main from "./config/mongodb_connect";
import cookieParser from "cookie-parser"
import authRouter from "./routes/userAuth";
import redisClient from "./config/reddis_connect";
import { problemRouter } from "./routes/problemCreation";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use('/user', authRouter)
app.use('/problem', problemRouter)



const InitializeConnection = async () => {
  try {

    await Promise.all([redisClient.connect(), main()])
    console.log("Databases Connected")

    app.listen(port, () => {
      console.log(`Listening on port ${port}...`)
    })
  }
  catch (err) {
    console.log(err.message)
  }
}
InitializeConnection()




// to run use command : bun --watch src/index.js