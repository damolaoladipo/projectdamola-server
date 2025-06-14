import app from "./config/app.config";
import colors from "colors";
import connectDB from "./config/db.config";

const connect = async () : Promise<void> => {

    await connectDB()
}

connect()


const PORT = process.env.PORT as string;
 

const server = app.listen(PORT, () => {
    console.log(colors.bold.yellow (`Playground Server running in ${process.env.NODE_ENV} mode`)) ;
})

process.on('unhandledRejection', (err:any, promise) => {
    console.log(colors.bold.red(`Error: ${err.message}`))
    server.close(() => process.exit(1))
})