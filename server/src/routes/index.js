const { handleNotFound } = require("../utils/helper")
const actorRouter = require("./actorRouter")
const userRoute = require("./userRouter")
const movieRoute = require("./movieRouter")
function route(app){
    
    app.use('/api/user',userRoute)
    app.use('/api/actor',actorRouter)
    app.use('/api/movie',movieRoute)
    app.use('/*',handleNotFound)
}

module.exports = route