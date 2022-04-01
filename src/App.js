import { useState, useEffect } from 'react'
import './style.css'

import firebase from './firebaseConnection'

function App() {
  const [tarefa, setTarefa] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')

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
              Tarefa: doc.data().Tarefa
            })
          })
          // console.log('tudo certo')
          // console.log(lista)
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
        Tarefa: tarefa
      })
      .then(() => {
        // console.log('DADOS CADASTRADO COM SUCESSO!')
        setTarefa('')
        setAutor('')
      })
      .catch(error => {
        // console.log('GEROU ALGUM ERRO: ' + error)
      })
  }

  async function editarPost() {
    await firebase
      .firestore()
      .collection('posts')
      .doc(idPost)
      .update({
        Autor: autor,
        Tarefa: tarefa
      })
      .then(() => {
        console.log('DADOS ATUALIZADOS')
        setAutor('')
        setTarefa('')
        setIdPost('')
      })
      .catch(error => {
        console.log(error)
      })
  }

  async function deletarPost(id) {
    await firebase
      .firestore()
      .collection('posts')
      .doc(id)
      .delete()
      .then(() => {
        alert('post excluido!')
      })
      .catch(error => {
        console.log(error)
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
      <div className="container">
        <h1>
          <span className="react">ReactJS</span> +{' '}
          <span className="fire">Firebase</span>{' '}
        </h1>{' '}
        <br />
        <label>ID:</label>
        <input
          type="text"
          value={idPost}
          onChange={e => setIdPost(e.target.value)}
        ></input>
        <label>Autor: </label>
        <textarea
          type="text"
          value={autor}
          onChange={e => setAutor(e.target.value)}
          required
        />
        <label>Tarefa: </label>
        <input
          type="text"
          value={tarefa}
          onChange={e => setTarefa(e.target.value)}
          required
        />{' '}
        <br />
        <div className="buttons">
          <button className="cadastrar" onClick={handleAdd}>
            Cadastrar
          </button>{' '}
          <br />
          <button className="editar" onClick={editarPost}>
            Editar
          </button>
        </div>
        {/* <button>Buscar Post</button> <br /> */}
        <br />
        <br />
        <ul>
          {posts.map(dados => {
            // console.log(dados)
            return (
              <li key={dados.id}>
                <span> ID: {dados.id}</span>
                <p> Autor: {dados.Autor}</p>
                <p> Tarefa: {dados.Tarefa}</p>
                <button
                  className="deletar"
                  onClick={() => deletarPost(dados.id)}
                >
                  Excluir
                </button>
                <br /> <br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
