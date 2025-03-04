const express = require('express')



const router = express.Router()


<<<<<<< HEAD
const { getAllProductsStatic } = require('../handlers/product')


router.route('/').get(getAllProductsStatic)
=======
const { getAllProductsStatic,getAllProducts } = require('../handlers/product')


router.route('/').get(getAllProductsStatic)
router.route('/getAllProducts/:pageNumber').get(getAllProducts)
>>>>>>> f46f282 (Initial commit)


// router.route('/:id').patch(updateAllTask)
// router.route('/:id').get(getTaskById)

// router.route('/:id').delete(deleteTask)
// app.use(notFound)


module.exports = router