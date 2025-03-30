const express = require('express');
const db = require('./dbConnect');
const cors = require('cors');
const app = express();
app.use(express.json())
const axios = require('axios');
const Task = require('./models/TaskModel');
const Comment = require('./models/CommentModel')
db.check();


app.use(cors());
app.use(express.json());

//lister tout les taches

//get all project tasks
app.get('/projects/:id/tasks', async (req, res) => {
    const id = req.params.id;
    try {
        const tasks = await Task.find({ projet_id: id });
        return res.status(200).json({ tasks: tasks });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
})

//get a specifique task from a project
app.get('/projects/:id/tasks/:taskId', async (req, res) => {
    const id = req.params.id;
    const taskId = req.params.taskId;
    try {
        const response = await axios.get(`http://localhost:5001/api/projects/${id}`);
        if (response.status === 200) {
            const task = await Task.findById(taskId);
            return res.status(200).json({ task: task });
        }
        return res.status(404).json({ message: "project was not found try" });
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
})


//creation d'une nouvelle tache
app.post('/projects/:id/tasks', async (req, res) => {
    const { titre, projet_id, description, priorite, status, deadline } = req.body;
    try {
        const response = await axios.get(`http://localhost:5001/api/projects/${projet_id}`);
        if (response.status !== 200) {
            return res.status(404).json({ msg: "Project not found" });
        }
        const newTask = new Task({
            titre: titre,
            projet_id: projet_id,
            description: description,
            priorite: priorite,
            status: status,
            deadline: deadline
        })
        newTask.save();
        return res.status(201).json({ message: "created" })
    } catch (err) {
        return res.status(404).json({ message: err })
    }
})

//modification du status du tache
app.patch('/projects/:id/tasks/:taskId', async (req, res) => {
    const id = req.params.id;
    const taskId = req.params.taskId;
    const { newStatus } = req.body;
    try {

        const task = await Task.findOneAndUpdate({ _id: taskId, projet_id: id }, { status: newStatus }, { new: true });
        return res.status(200).json({ message: 'updated', data: task })
    } catch (error) {
        return res.json({ error: error })
    }

})
//supprimer une tache
app.delete('/projects/:id/tasks/:taskId', async (req, res) => {
    const id = req.params.id;
    const taskId = req.params.taskId;
    try {
        await Task.findOneAndDelete({ _id: taskId, projet_id: id })
        return res.status(200).json({ message: 'task has been deleted' })
    } catch (error) {
        return res.status(404).json({ message: error })
    }
})



//lister tout les commentaire pour une seule tache
app.get('/projects/:id/tasks/:taskId/comments', async (req, res) => {
    const id = req.params.id;
    const taskId = req.params.taskId;
    try {

        const comments = await Comment.find({ task_id: taskId }).populate('user_id');
        return res.status(200).json({comment: comments });
    } catch (err) {
        return res.status(404).json({ message: 'task not found' });
    }

})
//ajouter un commentaire pour une tache
app.post('/tasks/:id/comment', async (req, res) => {
    const id = req.params.id;
    const { comment } = req.body;
    const task = Task.findById(id);
    //normalement user_id doit etre prend du service auth
    const user_id = 'ljkhsdfjidkh125648';
    if (task && user_id) {
        const newComment = new Comment({
            user_id: user_id,
            task_id: id,
            comment: comment
        })
        newComment.save();
        return res.status(201).json({ message: 'comment added' })
    } else {
        return res.status(404).json({ message: "error" })
    }
});

//affectation d'un utilisateur a une tache
app.post('/tasks/:id/assign', async (req, res) => {
    const id = req.params.id;
    //const {user_id} = req.body;
    const user_id = 'ljkhsdfjidkh125648';
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'selected task does not exist' })
    //apres le service auth etre complete
    //const userResponse = axios.get(`http://127.168.0.1:5002/users/${user_id}`);
    //if(userResponse.status !== 200) return res.status(404).json({message:'user does not exist'});
    console.log(task)
    task.save();
    return res.status(200).json({ message: 'task assigned to user' });
})

app.listen(5409, () => console.log('running on port 5409'));