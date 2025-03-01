const express = require('express')



const router = express.Router()


const { getAllProductsStatic } = require('../handlers/product')


router.route('/').get(getAllProductsStatic)


// router.route('/:id').patch(updateAllTask)
// router.route('/:id').get(getTaskById)

// router.route('/:id').delete(deleteTask)
// app.use(notFound)


module.exports = router