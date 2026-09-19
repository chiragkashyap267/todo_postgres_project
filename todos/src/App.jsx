import { useState , useEffect } from "react";




function App() {

  const [todos , setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const API = import.meta.env.VITE_API_URL || 'http:localhost:3000';


  useEffect( () => {
    fetch(`${API}/api/todos`)
    .then( res => res.json())
    .then(data => setTodos(data))
  } ,[]);

  async function handleSubmit(e) {
    e.preventDefault()

    if( !title.trim() ) return

    const res = await fetch (`${API}/api/todos`,{
      method: 'POST',
      headers : { 'Content-type' : 'application/json'},
      body : JSON.stringify({title}),
    })

    const newTodo = await res.json()
    setTodos([...todos, newTodo])
    setTitle('');
  }
  
  async function deleteTodo(id) {
    await fetch(`${API}/api/todos${id}` , {method : 'DELETE' })
    setTodos(todos.filter( t => t.id !== id))
  }


  async function done(todo){
    const result = await fetch(`${API}/api/todos/${todo.id}` ,{
      method : 'PATCH',
      headers : { 'Content-type' : 'application/json'},
      body : JSON.stringify({ done : !todo.done}),
    })


    const updated = await result.json()
    setTodos(todos.map( t => (t.id === updated.id ? updated : t)))
  }



  return (
    <div>

      <h1> My todos </h1>

      <form onSubmit={handleSubmit} >
        <input value={title} onChange={e => setTitle(e.target.value)}  ></input>
        <button type="submit" > Add new </button>
      </form>

      <ul>{todos.map( todo => (
        <li key = {todo.id} >
          
          <span style={{textDecoration : todo.done ? 'line-through ' : 'none '}} > {todo.title} </span>
           


        <button onClick={ () => {
          deleteTodo(todo.id)
        }} > 
          delete
        </button>
        <button onClick={ () => done(todo)}>

          {todo.done ? 'undo' : 'done'}

        </button>
        </li>

      
      ))}


      </ul>

    </div>
  )
}

export default App;