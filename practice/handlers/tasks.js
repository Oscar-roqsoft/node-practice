
const tasks = require('../models/tasks');
const asyncwrapper = require('../middleware/asyncwrapper');
const {createCustomError,CustomApiError} = require('../errors/custom-error');



// const tasks = require('../models/tasks')


// without asyncwrapper middleware
// const getAllTask = async(req,res)=>{
//     try {
//         const task = await tasks.find(); // Fetch all tasks from the database
//         res.status(200).json({success: true, data:{task,taskLength: task.length}}); // Send tasks as JSON
//       } catch (error) {
//         res.status(500).json({ message: "Error fetching tasks", error });
//       }
// }


// with asyncwrapper middleware
const getAllTask = asyncwrapper(async(req,res)=>{
        const task = await tasks.find(); // Fetch all tasks from the database
        res.status(200).json({success: true, data:{task,taskLength: task.length}}); // Send tasks as JSON
})




const createAllTask = async(req,res)=>{
    try{

        const checkNameExist = await tasks.findOne({ name: req.body.name })

        if(checkNameExist){
            return res.status(401).json({ message: "name is already in use!" });
        }else{

            const newTask = await tasks.create({
                name: req.body.name,
                completed:req.body.completed,
                createdAt: new Date() ,
                modifiedAt: new Date() ,
            });
            
            res
           .status(200)
           .json({ message: "Created Successful",newTask });
        }


    }catch(err){
        res.status(400).json(err);
    }

}



const updateAllTask = async(req,res,next)=>{
    try {
        const taskId = req.params;

        const task = await tasks.findOneAndUpdate({_id:taskId.id},req.body,{
            new:true,
            runValidators: true
        })
        // console.log(task,taskId)
        if(!task){
            const error = new Error(`no task with the id ${taskId.id}`)
            error.status = 404
            return next(error)
            // return res.status(404).json({message:`no task with the id ${taskId.id}`})
        }else{

            res.status(200).json( {message:'updated successful'}); // Send tasks as JSON

        }
        // const task = await tasks.findOne({_id:taskId}); // Fetch all tasks from the database
      } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
      }
}



const deleteTask = async(req,res)=>{
    try {
        const taskId = req.params;
        const task = await tasks.findOneAndDelete({_id:taskId.id})
        // console.log(task,taskId)
        if(!task){
            return res.status(404).json({message:`no task with the id ${taskId.id}`})
        }else{

            res.status(200).json( {message:'deleted successful'}); // Send tasks as JSON

        }
        // const task = await tasks.findOne({_id:taskId}); // Fetch all tasks from the database
      } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
      }
}


const getTaskById = async(req,res,next)=>{
    try {
        const taskId = req.params;
        const task = await tasks.findOne({_id:taskId.id})
        // console.log(task,taskId)
        if(!task){
            // const error = new Error(`no task with the id ${taskId.id}`)
            // error.status = 404
            // return next(error)
            return next(createCustomError(`no task with the id ${taskId.id}`,404))
            // return res.status(404).json({message:`no task with the id ${taskId.id}`})
        }else{

            res.status(200).json( {message:'successful',task}); // Send tasks as JSON

        }
        // const task = await tasks.findOne({_id:taskId}); // Fetch all tasks from the database
      } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
      }
}

module.exports = {
    getAllTask,
    createAllTask,
    updateAllTask,
    getTaskById,
    deleteTask
}