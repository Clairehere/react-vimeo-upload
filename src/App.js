import React, { Component } from 'react'
import firebase from 'firebase'
import VimeoAuthorization from './VimeoAuthorization'
import VimeoUpload from './VimeoUpload'

class App extends Component {
  state = {
    accessToken: ''
  }
  setAccessToken = accessToken => this.setState({ accessToken })

  // componentDidMount() {
  //   const vimeoTokensRef = firebase.database().ref('tokens')
  //   vimeoTokensRef.on('child_added', snapshot => {
  //   })
  // }
  render() {
    // Récupère le access token pour le compte Vimeo
    // En-dessous, si on n'a pas d'access token, on affiche
    // un composant qui va nous permettre d'initialiser
    // le processus d'authentification, afin de récupérer un token
    const { accessToken } = this.state
    return (
      <div className="App">
        { accessToken ? <VimeoUpload accessToken={accessToken} /> : <VimeoAuthorization setAccessToken={this.setAccessToken} /> }
      </div>
    )
  }
}

export default App
