"use strict"

const { mongoose } = require('../configs/dbConnection')

const PizzaSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            trim:true,
            required:true,
            unique:true
        },
        images: {
            type: Array,
            default: []
        },
        price:{
            type:Number,
            required:true
        },
        toppingsIds:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Topping"
            }
        ]
    }, {
        collection:"pizzas", timestamps:true
    }
)

module.exports = mongoose.model("Pizza", PizzaSchema)