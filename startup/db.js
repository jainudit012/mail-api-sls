// For connecting to mongo db
// const mongoose = require('mongoose')

// module.exports =async function(){
//     try{
//         const db = process.env.DB
//         const database = await mongoose.connect(db, {useNewUrlParser: true})

//         if(database){
//             console.log(`Connected to db ${db}...`)
//         }else console.log('Could not connect to the database!!!')
//     }catch(ex){
//         console.log(ex)
//     }
// }