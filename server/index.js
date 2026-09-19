import express from "express";
import {pool} from "./db.js";
import cors from 'cors';



const app = express();
app.use(cors({
    origin : process.env.CLIENT_URL || 'https://localhost:5173'
}));
app.use(express.json());     
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json("hello this is our first database server");
});


app.get('/api/todos' , async (req,res) => {
    const result = await pool.query('SELECT * FROM todos');
    res.json(result.rows);
});


app.post('/api/todos' , async (req, res) => {
    const {title} = req.body;

    if(!title || title.trim() === ''){
        return res.status(400).json({error: "title is required"});
    }
    
    try {
        const result = await pool.query(
            'INSERT INTO  todos (title  ) VALUES ($1) RETURNING *' ,
            [title.trim()])
        res.status(201).json(result.rows[0]);
    } 
    
    catch (err)

    {
    console.error(err);
    res.status(500).json( {error : "something went wrong"});
    }
})


app.delete('/api/todos/:id' , async (req , res) => {
    const id = Number(req.params.id);

    if( !Number.isInteger(id) ||  id <= 0  ){
        return res.status(400).json({error : 'invalid id '})
    }
    
    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *' , [id]);
        

        if(result.rows.length === 0){
            return res.status(404).json({error : 'todo not found'})
        }
        
        res.json(result.rows[0]);
    }

    catch(e) {
        console.error(e)
        res.status(500).json( { error : 'something went wrong '})
    }
   
})

app.patch('/api/todos/:id' , async ( req, res) => {
    const id = Number(req.params.id);

    if( !Number.isInteger(id) ||  id <= 0 ){
        return res.status(400).json({error : 'invalid id '})
    }


    const {done} = req.body;

    if( typeof done != 'boolean'){
        return res.status(400).json({ error : "done must be true or false"})
    }

    try{
        const result = await pool.query('UPDATE todos SET done = $1 WHERE id = $2 RETURNING *' , 
            [done,id]);

            if(result.rows.length === 0){
                return res.status(404).json({error : 'todo not found'})
            }
            
        res.json(result.rows[0]);
    }

    catch ( e ){
        console.error(e);
        res.status(500).json( { error : 'something went wrong'})
    }



    

    
})

app.listen(PORT , () => {
    console.log("server is running");
});