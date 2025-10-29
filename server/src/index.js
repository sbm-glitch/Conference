import dotenv from 'dotenv'

import app from './app.js'
import connectDB from './dB/connect.js'

dotenv.config({
    path: './.env'
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("application not able to talk to database", error)
            throw error
        })
        const PORT = process.env.PORT || 4000;
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed !!!!!", error);
    })