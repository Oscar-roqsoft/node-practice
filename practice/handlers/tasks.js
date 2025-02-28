
const tasks = require('../models/tasks');
// const tasks = require('../models/tasks')


const getAllTask = async(req,res)=>{
    try {
        const task = await tasks.find(); // Fetch all tasks from the database
        res.status(200).json(task); // Send tasks as JSON
      } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
      }
}


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


const updateAllTask = (req,res)=>{
    res.send("update  item from the file")
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


const getTaskById = async(req,res)=>{
    try {
        const taskId = req.params;
        const task = await tasks.findOne({_id:taskId.id})
        // console.log(task,taskId)
        if(!task){
            return res.status(404).json({message:`no task with the id ${taskId.id}`})
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