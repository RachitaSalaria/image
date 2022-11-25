const mongoose = require("mongoose");
const imageSchema = mongoose.Schema({

    cover :{
        type: Object,
        required : true
    } 
    
   
});
module.exports = mongoose.model('Image',imageSchema)