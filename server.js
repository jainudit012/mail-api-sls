const sls = require('serverless-http')
const app = require('./startup/app')

// require('./startup/db')()

const handler = sls(app)

module.exports.run = async (event, context)=>{
    // await require('./startup/db')()
    return await handler(event,context)
}