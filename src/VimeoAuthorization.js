import React from 'react'
import { vimeo, appUrl } from './config.json'
// Authorization URL https://api.vimeo.com/oauth/authorize?client_id=XXXXX&response_type=code&redirect_uri=XXXX.YYY/ZZZZZ&state=XXXXXX


class VimeoAuthorization extends React.Component {
  componentDidMount () {
    // Quand Vimeo nous redirige, il y a dans l'URL une chaîne précédée d'un hash (#)
    // Si elle existe elle contient le access_token
    const hashParams = {}
    console.log(window.location)
    if(window.location.hash !== '') {
      // On oublie le hash (sous-chaîne à partir de l'indice 1)
      const hashString = window.location.hash.substr(1)
      // On "explose" la chaîne en séparant par &
      const hashSegments = hashString.split('&')
      for(let segment of hashSegments) {
        // Chaque segment a la forme cle=valeur, on les sépare en splittant avec =
        const keyVal = segment.split('=')
        const key = keyVal[0]
        // Il faut décoder les caractères spéciaux avec decodeURIComponent
        const val = decodeURIComponent(keyVal[1])
        // On stocke ça dans l'objet hashParams
        hashParams[key] = val
      }
    }
    this.props.setAccessToken(hashParams.access_token)
  }
  handleClick = () => {
    const params = {
      client_id: vimeo.clientId,
      response_type: 'token',
      scope: 'public private upload video_files',
      redirect_uri: appUrl,
      state: 'TestString1234'
    }
    // La query string est ce qu'on ajoute derrière le ? dans l'URL
    const queryStringSegments = []
    // Parcourir toutes les CLES de params
    for(let param in params) {
      // Ici on va stocker qq chose comme cle=valeur
      // On encode les caractères spéciaux avec encodeURIComponent
      const segment = param + '=' + encodeURIComponent(params[param])
      // On pousse dans le tableau
      queryStringSegments.push(segment)
    }
    // On lie tous les "segments" avec le caractère &
    const queryString = queryStringSegments.join('&')
    const url = vimeo.authorizationUrl + '?' + queryString
    window.location.href = url
  }
	render() {
		return (
			<button onClick={this.handleClick}>Authentification Vimeo</button>
		)
	}
}

export default VimeoAuthorization
