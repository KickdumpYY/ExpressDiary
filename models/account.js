const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('account', accountSchema);