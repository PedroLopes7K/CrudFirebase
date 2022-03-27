import { useState, useEffect } from 'react'
import './style.css'

import firebase from './firebaseConnection'

function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])

  // buscando dados em tempo real
  useEffect(() => {
    async function LoadPosts() {
      await firebase
        .firestore()
        .collection('posts')
        .onSnapshot(dados => {
          let lista = []
          dados.forEach(doc => {
            lista.push({
              id: doc.id,
              Autor: doc.data().Autor,
              Titulo: doc.data().Titulo
            })
          })
          console.log('tudo certo')
          console.log(lista)
          setPosts(lista)
        })
        .catch(error => {
          console.log('GEROU ALGUM ERRO: ' + error)
        })
    }
    LoadPosts()
  }, [])

  async function handleAdd() {
    await firebase
      .firestore()
      .collection('posts')
      .add({
        // cria um novo post com id unico aleatorio
        Autor: autor,
        Titulo: titulo
      })
      .then(() => {
        console.log('DADOS CADASTRADO COM SUCESSO!')
        setTitulo('')
        setAutor('')
      })
      .catch(error => {
        console.log('GEROU ALGUM ERRO: ' + error)
      })
  }

  // async function buscaPost() {
  // BUSCA UM DADO APENAS
  // await firebase
  //   .firestore()
  //   .collection('posts')
  //   .doc('123')
  //   .get()
  //   .then(info => {
  //     setTitulo(info.data().Autor)
  //     setAutor(info.data().Titulo)
  //   })
  //   .catch(() => {
  //     console.log('DEU ALGUM ERRO')
  //   })

  // BUSCA TODOS
  // await firebase
  //   .firestore()
  //   .collection('posts')
  //   .get()
  //   .then(dados => {
  //     let lista = []
  //     dados.forEach(doc => {
  //       lista.push({
  //         id: doc.id,
  //         Autor: doc.data().Autor,
  //         Titulo: doc.data().Titulo
  //       })
  //     })
  //     console.log('tudo certo')
  //     console.log(lista)
  //     setPosts(lista)
  //   })
  //   .catch(error => {
  //     console.log('GEROU ALGUM ERRO: ' + error)
  //   })
  // }

  return (
    <div>
      <h1>ReactJS + Firebase :)</h1> <br />
      <div className="container">
        <label>Titulo: </label>
        <textarea
          type="text"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />
        <label>Autor: </label>
        <input
          type="text"
          value={autor}
          onChange={e => setAutor(e.target.value)}
          required
        />
        <button onClick={handleAdd}>Cadastrar</button>
        {/* <button>Buscar Post</button> <br /> */}
        <br />
        <br />
        <ul>
          {posts.map(dados => {
            // console.log(dados)
            return (
              <li key={dados.id}>
                <p> Autor: {dados.Autor}</p>
                <p> Titulo: {dados.Titulo}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
