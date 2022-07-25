const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
   
    userId:{
        type: String,
        required: true
    },
    gameName:{
        type: String,
        required:true    
    },
    gameId:{
        type: Number,
        reuired: true
    },
    gameImage:{
        type: String,
        rquired:true
    },
    gameSummary:{
        type:String,
    },
    gamePLatform:{
        type:Array, 
    }
    
},
{timestamps:true}
);

module.exports = mongoose.model("Post", PostSchema)
