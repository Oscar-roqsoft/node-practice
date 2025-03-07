// check username, password in post(login) request
// if exist create new JWT
// send back to fron-end
// setup authentication so only the request with JWT can access the dasboard


const jwt = require('jsonwebtoken')
const { BadRequestError } = require('../errors')
const { CustomApiError } = require('../../errors/custom-errors')
// const { CustomApiError } = require('../../errors/custom-errors')


const login = async (req, res) => {

  const { username, password } = req.body

  // mongoose validation
  // Join
  // check in the controller

  if (!username || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  //just for demo, normally provided by DB!!!!
  const id = new Date().getDate()

  // try to keep payload small, better experience for user
  // just for demo, in production use long, complex and unguessable string value!!!!!!!!!
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  res.status(200).json({ msg: 'user created', token })
}


const dashboard = async (req, res) => {

  const authHeader = req.headers.authorisation

  if(!authHeader || !authHeader.startWith('Bearer')){
    throw new CustomApiError('no token provided', 401)
  }

  const token = authHeader.split(' ')[1] //get the token 

  // verify the token
   try{
    //  const decoded = jwt.verify(token,JWT_SECRET)
   }catch(e){
     console.log(e)
   }


  const luckyNumber = Math.floor(Math.random() * 100)

  res.status(200).json({
    msg: `Hello, ${req.user.username}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  })

}




module.exports = {
  login,
  dashboard,
}