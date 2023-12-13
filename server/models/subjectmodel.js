const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subjectname: {
        type: String,
        required: true
    },
    minmark: {
        type: String,
        required: true
    },
  obtainedmark:{
        type: String,
    
    }
,
email: {  
     type: String
     }
,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema); 
module.exports = Subject;
