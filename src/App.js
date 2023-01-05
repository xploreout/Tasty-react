import './App.css'
import logo from './RecipeAppWOTextLogo.png'
import Login from './Components/Login'
import Favourites from './Components/Favourites'
import Recipe from './Components/Recipe'
import RecipeFav from './Components/RecipeFav'
import Search from './Components/Search'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { slide as Menu } from 'react-burger-menu'
import { gapi } from 'gapi-script'
import { useEffect, useState, createContext } from 'react'
import Logout from './Components/Logout'

export const UserContext = createContext()

const clientId = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: '',
      })
    }

    gapi.load('client:auth2', start)
  })

  const navigate = useNavigate()

  const onLoginSuccess = (res) => {
    navigate('/')
    let user = {
      email: res.profileObj.email,
      name: res.profileObj.name,
      token: res.accessToken,
      imageUrl: res.profileObj.imageUrl,
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
      body: JSON.stringify(user),
    }

    let userInfo = {
      name: res.profileObj.name,
      imageUrl: res.profileObj.imageUrl,
      id: null,
    }

    setUserInfo(userInfo)

    fetch(
      'https://final-project-backend-api.azurewebsites.net/user/register',
      requestOptions
    )
      .then((res) => res.json())
      .then((json) => {
        userInfo.id = json.id
        setUserInfo(userInfo)
      })
    setIsLoggedIn(true)
    alert('You have succesfully Logged in')
  }
  const onLoginFailure = (res) => {
    setIsLoggedIn(false)
    alert('There was a problem with your log in')
  }

  const onLogoutSuccess = () => {
    navigate('/')
    setIsLoggedIn(false)
    alert('You have succesfully Logged out')
  }

  return (
    <div className='App'>
      <UserContext.Provider value={userInfo}>
        <Menu>
          <Link to='/' className='menu-item'>
            {' '}
            <i class='fa-solid fa-magnifying-glass bm-icon'></i> Search{' '}
          </Link>
          <Link to='/Favourites' className='menu-item'>
            {' '}
            <i class='fa-solid fa-heart bm-icon'></i> Favourites{' '}
          </Link>
          {isLoggedIn ? (
            <Logout funcSuccess={onLogoutSuccess} />
          ) : (
            <Login funcSuccess={onLoginSuccess} funcFailure={onLoginFailure} />
          )}
        </Menu>
        <div className='app-header'>
          <img className='app-logo' src={logo} alt='app logo' />
          <h1 className='app-title'> Recipe App </h1>
          {isLoggedIn ? (
            <div className='user-info-container'>
              <h4 className='user-name'>{userInfo.name}</h4>
              <img
                src={userInfo.imageUrl}
                className='user-avatar-image'
                alt={userInfo.name}
              />
            </div>
          ) : null}
        </div>
        <Routes>
          <Route path='/' element={<Search />}></Route>
          <Route path='/Recipe/:recipeParam' element={<Recipe />}></Route>
          <Route
            path='/Recipe/Favourites/:recipeParam'
            element={<RecipeFav />}
          ></Route>
          <Route path='/Favourites' element={<Favourites />}></Route>
        </Routes>
      </UserContext.Provider>
    </div>
  )
}

export default App
