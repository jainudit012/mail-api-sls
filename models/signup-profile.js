const mongoose = require("mongoose")

const signupProfileSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    answer: String,
})

const Profile = mongoose.model("Emails", signupProfileSchema)

exports.Profile = Profile