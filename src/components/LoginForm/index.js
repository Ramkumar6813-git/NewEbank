import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {
    userId: '',
    userPin: '',
    showErrorMsg: false,
    errMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jet_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({
      showErrorMsg: true,
      errMsg,
    })
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangeUserPin = event => {
    this.setState({userPin: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {userId, userPin} = this.state
    const userDetails = {
      userId,
      userPin,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const url = 'https://apis.ccbp.in/ebank/login'
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {userId, userPin, showErrorMsg, errMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <div className="main-div">
          <div className="div1">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              className="website-login-image"
              alt="website login"
            />
          </div>
          <form className="div2" onSubmit={this.onSubmitForm}>
            <h1 className="form-heading">Welcome Back!</h1>
            <div className="user-input">
              <label htmlFor="userInput" className="label">
                User ID
              </label>
              <input
                type="text"
                id="userInput"
                value={userId}
                className="input"
                placeholder="Enter User ID"
                onChange={this.onChangeUserId}
              />
            </div>
            <div className="user-input">
              <label htmlFor="pin" className="label">
                PIN
              </label>
              <input
                type="password"
                id="pin"
                value={userPin}
                className="input"
                placeholder="Enter PIN"
                onChange={this.onChangeUserPin}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showErrorMsg ? <p className="error-msg">{errMsg}</p> : ''}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginForm
