const express = require('express')
const healthController = express.Router()

const { Profile } = require('../../models/signup-profile') 

healthController.get('/', async(req,res)=>{
    const db = process.env.DB
    const found = await Profile.find()
    return res.status(200).send({error: false, health: 'good', profiles: found})
})

module.exports = healthController