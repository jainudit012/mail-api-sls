const express = require('express')
const mailController = express.Router()
const admin = require('firebase-admin')

const ses = require('node-ses')
const sesClient = ses.createClient({
	key: process.env.awsApiKey,
	secret: process.env.awsApiSecret
})

let serviceAccount = require('../../../serviceAccountKey.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB
})

const db = admin.database()

const ref = db.ref('users')

const html = require('../../../mails/register')

const { Profile } = require('../../../models/signup-profile') 

mailController.get('/', async(req,res)=>{
    const data = []
    ref.once('value', (snapshot)=>{
        return res.send(snapshot.val())
    })
})

mailController.post('/', async (req, res)=>{
    const data = req.body
    if(!data.email || !data.name) return res.status(400).send({error: true, reason: 'Name or Email Not Present!'})
    try{
        ref.orderByChild('email').equalTo(data.email).once('value', (snapshot)=>{
            if(snapshot.val()){
                return res.send({error: false, msg: 'Mail Already Sent!'})
            }else {
                sesClient.sendEmail({
                    to: data.email,
                    from: process.env.sesVerifiedSenderEmail,
                    subject: 'Thank you for Registering With Us.',
                    message: html(data.name)
                }, 
                async (sesErr, sesData, sesResp)=>{
                    if(sesErr||sesResp.statusCode!==200) return res.status(500).send({error: true, msg: 'MAIL NOT SENT', err:sesErr})
                    else {
                        let setDoc = ref.push().set({
                            name: data.name,
                            phone: data.phone,
                            email: data.email,
                            answer: data.answer
                        }).then(ref=>{
                            return res.send({error: false, msg: `'MAIL SENT and saved'`})
                        }).catch(ex=>{
                            console.log(ex)
                            return res.status(500).send({error: true, msg: 'MAIL SENT and but NOT saved!'})
                        })
                    }
                })
            }
        })
        // For Mongo DB

        // const found = await ref.push().set({
        //     name: data.name,
        //     phone: data.phone,
        //     email: data.email,
        //     answer: data.answer
        // })
        // console.log(found)
        // if(found && found.length > 0){
        //     console.log('email already sent')
        //     res.send({error: false, msg: 'Mail Already Sent!'})
        // }else {
        //     sesClient.sendEmail({
        //         to: data.email,
        //         from: process.env.sesVerifiedSenderEmail,
        //         subject: 'Thank you for Registering With Us.',
        //         message: html(data.name)
        //     }, 
        //     async (sesErr, sesData, sesResp)=>{
        //         if(sesErr||sesResp.statusCode!==200) res.status(500).send({error: true, msg: 'MAIL NOT SENT', err:sesErr})
        //         else {
        //             let setDoc = db.collection('users').add({
        //                 name: data.name,
        //                 phone: data.phone,
        //                 email: data.email,
        //                 answer: data.answer
        //             }).then(ref=>{
        //                 return res.send({error: false, msg: `'MAIL SENT and saved' with id ${ref.id}`})
        //             }).catch(ex=>{
        //                 console.log(ex)
        //                 return res.status(500).send({error: true, msg: 'MAIL SENT and but NOT saved!'})
        //             })
        //         }
        //     })
        // }
    }catch(ex){
        console.log(ex)
        return res.status(500).send({error: ex, message: ex.message})
    }
})

module.exports = mailController
