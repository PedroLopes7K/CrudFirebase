import { useState, useEffect } from 'react'
import './style.css'

import firebase from './firebaseConnection'

function App() {
  const [tarefa, setTarefa] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])
  const [idPost, setIdPost] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [usuario, setUsuario] = useState(false)
  const [usuarioLogado, setUsuarioLogado] = useState({})

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

  useEffect(() => {
    async function verificaLogin() {
      await firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setUsuario(true)
          setUsuarioLogado({
            uid: user.uid,
            email: user.email
          })
          // se existir um usuario logado entra aqui
        } else {
          setUsuario(false)
          setUsuarioLogado({})
          // se não possui usuario logado...
        }
      })
    }

    verificaLogin()
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
  async function cadastrarNovoUsuario() {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(value => {
        console.log('CADASTRADO COM SUCESSO')
        console.log(value)
      })
      .catch(error => {
        if (error.code === 'auth/weak-password') {
          alert('Senha muito fraca...')
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email já cadastrado!')
        }
        console.log('ERROR' + error)
      })
  }

  async function logout() {
    await firebase.auth().signOut()
  }

  return (
    <div>
      <div className="container">
        <h1>
          <span className="react">ReactJS</span> +{' '}
          <span className="fire">Firebase</span>{' '}
        </h1>
        <br />
        <label> Email:</label>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <label> Senha:</label>
        <input
          type="text"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <br />
        <button onClick={cadastrarNovoUsuario}>Cadastrar</button>
        <button onClick={logout}>Sair da conta</button>
        <br />
        {usuario && (
          <div className="container">
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
            />
            <br />
            <div className="buttons">
              <button className="cadastrar" onClick={handleAdd}>
                Cadastrar
              </button>
              <br />
              <button className="editar" onClick={editarPost}>
                Editar
              </button>
            </div>
          </div>
        )}
        <br />
        <br />
        {usuario ? (
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
        ) : (
          <div>
            <h3>FAÇA O LOGIN</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
