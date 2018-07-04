import React from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { firebase as firebaseConfig } from './config.json'

firebase.initializeApp(firebaseConfig)

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
