import express from 'express'

const app = express()

app.use(express.json({
    limit: '16kb'
}))

app.use(express.urlencoded({
    extended: true,
    limit: '50kb'
    // limit: '16kb' this is done by youtube
}))

export default app