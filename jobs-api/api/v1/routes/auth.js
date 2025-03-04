const express = require('express')



const router= express.Router()


const { register,login } = require('../handlers/auth')


router.route('/register').post(register)
router.route('/login').post(login)


// app.use(notFound)

module.exports = router