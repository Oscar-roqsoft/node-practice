
//start: this is used to populate the database with json data 
require("dotenv").config();

const connectDB = require('./db/mongodb')

const product = require('./api/v1/models/product')

const productJson = require('./product.json')


const start = async () => {
    try {
      await connectDB(process.env.MONGO_URL)
      await product.deleteMany()
      await product.create(productJson)
    //   const d = await product.find()

    //   console.log('Success!!!!',d)
      process.exit(0)
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
    
  }
  
  start()

// end