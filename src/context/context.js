import React, { useState, useEffect } from 'react'
import Fetch from '../fetch/Fetch'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

const GithubProvider = ({ children }) => {
  const {
    requestsLeft,
    isError,
    errorMsg,
    isLoading,
    fetchUser,
    githubUser,
    followers,
    repos,
  } = Fetch()
  const [user, setUser] = useState('');

const handleChange = (e) => {
  setUser(e.target.value);
  
}
const handleSubmit = (e) => {
  e.preventDefault()
  if (user) {
    fetchUser(`${rootUrl}/users/${user}`)
  }
}


  return (
    <GithubContext.Provider
      value={{
        
        requestsLeft,
        isError,
        errorMsg,
        isLoading,
        handleChange,
        user,
        handleSubmit,
        githubUser,
        followers,
        repos,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

const useGlobalContext = () => {
  return React.useContext(GithubContext)
}

export { useGlobalContext, GithubProvider }
