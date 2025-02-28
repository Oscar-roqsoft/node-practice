const express = require('express')

const router= express.Router()


const { getAllTask, createAllTask,updateAllTask,getTaskById ,deleteTask} = require('../handlers/tasks')


router.route('/').get(getAllTask).post(createAllTask)

// router.route('/:id').patch(updateAllTask)
router.route('/:id').get(getTaskById)
router.route('/:id').delete(deleteTask)

module.exports = router