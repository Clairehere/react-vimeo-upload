import React from 'react'
// Le "access token", qui permet de s'authentifier auprès de l'API Vimeo
import { accessToken } from './config'

// Taille des morceaux de vidéo qu'on envoie
const CHUNK_SIZE = 512 * 1024

class VimeoUpload extends React.Component {

  // Initialiser le state avec un fichier (null au début)
  state = {
    file: null,
    uploadLink: '',
    // Nombre d'octets envoyés
    bytesSent: 0
  }

  // Initialiser l'upload
  onInitializeUpload = e => {

    // Empêche de sortir de la page
    e.preventDefault()

    // Récupère la taille du fichier qui est stocké dans le state
    const { size } = this.state.file

    // Les données à envoyer en JSON à l'API Vimeo
    const payload = {
      upload: {
        approach : 'tus',
        size
      }
    }
    fetch('https://api.vimeo.com/me/videos', {
      method: 'POST',
      // Headers de requête
      headers: {
        // Ce qu'on accepte comme type de données en retour de notre requête
        Accept: 'application/vnd.vimeo.*+json;version=3.4',
        // Passage du token d'authentification
        Authorization: `Bearer ${accessToken}`,
        // Indique à Vimeo qu'on lui envoie du JSON
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      const { upload } = data
      this.setState({
        uploadLink: upload.upload_link
      })
    })
  }

  onProgress = progressEvent => {
    console.log(progressEvent)
  }

  // Appelé quand un morceau a été envoyé
  onContentUploadSuccess = sentChunkSize => () => {
    console.log("Upload du morceau terminé avec succès, nombre d'octets envoyés:", sentChunkSize)
    const alreadySent = this.state.bytesSent
    this.setState((prevState, props) => {
      const { file, bytesSent } = prevState
      return {
        bytesSent: bytesSent + sentChunkSize
      }
    })

    // Compare le nombre d'octets envoyés jusqu'à maintenant, avec la taille
    // en octets du fichier
    // Si on n'a pas terminé (nb octets envoyés < taille fichier), on relance
    // en prenant comme offset de départ le nombre d'octets envoyés
    if(alreadySent < this.state.file.size) {
      console.log("envoie la suite à partir de l'offset", alreadySent)
      this.uploadPart(alreadySent)
    }
    else {
      alert("Terminé !")
    }

  }

  onContentUploadError = err => {
    console.error('Terminé en erreur', err)
  }

  // Upload un morceau du fichier
  // Le paramètre indique l'offset de départ par rapport au début du fichier
  uploadPart = offset => {
    // Taille d'un morceau: 512 Ko
    const { file } = this.state
    // Si le dernier morceau est inférieur en taille à 512 Ko,
    // l'offset de fin ne pourra pas dépasser la taille du fichier
    const end = Math.min(offset + CHUNK_SIZE, file.size)

    // Découpe une tranche de 512 Ko (ou moins si c'est le dernier morceau)
    // à partir de l'offset de départ
    const content = file.slice(offset, end)
    // Calcule la longueur effective du morceau
    const contentLength = end - offset
    console.log('Taille du morceau (chunk) à envoyer:', contentLength)

    // XMLHttpRequest est l'ancêtre de fetch pour faire des requêtes AJAX
    // On crée l'objet
    var xhr = new XMLHttpRequest()

    // Méthode PATCH et on met l'URL d'upload renvoyée par Vimeo après l'initialisation
    xhr.open('PATCH', this.state.uploadLink, true)
    // Headers requis. Voir la doc:
    // https://developer.vimeo.com/api/upload/videos#step-2-upload-the-video-file
    xhr.setRequestHeader('Tus-Resumable', '1.0.0')
    xhr.setRequestHeader('Content-Type', 'application/offset+octet-stream')
    // xhr.setRequestHeader('Content-Length', contentLength)
    // Indique à Vimeo l'offset de départ
    xhr.setRequestHeader('Upload-Offset', offset)

    // Chaque morceau de 512Ko peut être découpé en plus petits bouts
    // this.onProgress est appelée à chaque fois qu'on a fini un morceau
    // C'est probablement beaucoup d'efforts pour une amélioration minime
    // de s'en servir
    // if (xhr.upload) {
    //   xhr.upload.addEventListener('progress', this.onProgress)
    // }
    // this.onContentUploadSuccess est appelée quand on a fini
    // un morceau de 512 Ko
    xhr.onload = this.onContentUploadSuccess(contentLength)
    // Appelée si une erreur se produit
    xhr.onerror = this.onContentUploadError

    // Déclenche réellement le transfert
    xhr.send(content)
  }

  onDoUpload = e => {
    this.uploadPart(0)
  }

  // Détecte le changement du fichier sélectionné, le met dans le state
  onChangeFile = e => {
    this.setState({
      file: e.target.files[0]
    })
  }

  // Met à jour le lien d'upload
  // Peut être modifié:
  //   1. manuellement en manipulant le champ input
  //   2. au retour d'une requête pour initialiser un upload, on met cette valeur dans le champ
  onChangeUploadLink = value => {
    this.setState({
      uploadLink: value
    })
  }

  render () {
    const inputStyle = { marginBottom: '20px' }
    return (
      <div style={{maxWidth: '300px', margin: '20px auto', background: '#fff', padding: '30px'}}>
        <h1>Upload Vimeo</h1>

        <div style={inputStyle}>
          <label htmlFor="file">Choisir un fichier</label>
          <input id="file" type="file" onChange={this.onChangeFile} />
        </div>

        <div style={inputStyle}>
          <label htmlFor="uploadLink">Lien d'upload</label>
          <input name="uploadLink" id="uploadLink" type="text" value={this.state.uploadLink} onChange={e => this.onChangeUploadLink(e.target.value)} />
          <p style={{margin: '5px 0', fontSize: '0.7rem', color: '#666'}}>(mis à jour automatiquement après initialisation upload)</p>
        </div>

        <button onClick={this.onInitializeUpload} disabled={ this.state.file === null }>Initialiser upload</button>
        <button onClick={this.onDoUpload} disabled={ this.state.file === null }>Effectuer upload</button>
      </div>
    )
  }
}

export default VimeoUpload
