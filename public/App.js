import firebase from 'firebase'
import { useState } from 'react'
import './style.css'
function App() {
  const [titulo, setTitulo] = useState()
  const [autor, setAutor] = useState()

  async function handleClick() {
    await firebase
      .firestore()
      .collection('posts')
      .doc('123')
      .set({
        Autor: autor,
        Titulo: titulo
      })
      .then(() => {
        console.log('SUCESSO')
      })
      .catch(error => {
        console.log('DEU ERRO:' + error)
      })
  }

  return (
    <div className="App">
      <h2>ReactJS e Firebase ola mundo </h2> <br />
      <div className="container">
        <label>Titulo:</label>
        <textarea
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          value={autor}
          onChange={e => setAutor(e.target.value)}
        />
        <button onClick={handleClick}>Cadastrar</button>
      </div>
    </div>
  )
}

export default App
