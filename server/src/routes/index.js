const { handleNotFound } = require("../utils/helper")
const actorRouter = require("./actorRouter")
const userRouter = require("./userRouter")
const movieRouter = require("./movieRouter")
const reviewRouter = require("./reviewRouter")
const adminRouter = require("./adminRouter")
function route(app){
    app.use('/api/review',reviewRouter)
    app.use('/api/user',userRouter)
    app.use('/api/actor',actorRouter)
    app.use('/api/movie',movieRouter)
    app.use('/api/admin',adminRouter)
    app.use('/*',handleNotFound)
}

module.exports = route