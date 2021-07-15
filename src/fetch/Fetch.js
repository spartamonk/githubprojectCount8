import React, { useState, useEffect } from 'react'
import axios from 'axios'
import mockUser from '../context/mockData.js/mockUser'
import mockFollowers from '../context/mockData.js/mockFollowers'
import mockRepos from '../context/mockData.js/mockRepos'

const rootUrl = 'https://api.github.com'

const Fetch = () => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [followers, setFollowers] = useState(mockFollowers)
  const [repos, setRepos] = useState(mockRepos)
  const [requestsLeft, setRequestsLeft] = useState(0)
  const [error, setError] = useState({
    isError: false,
    errorMsg: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState('')

  const toggleError = (isError = false, errorMsg = '') => {
    setError({
      isError,
      errorMsg,
    })
  }

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`).then((response) => {
      let { remaining } = response.data.rate
      setRequestsLeft(remaining)
      if (remaining === 0) {
        toggleError(true, 'you have used all your hourly requets')
      }
    })
  }

  useEffect(checkRequests, [])

  const fetchUser = async (url) => {
    setIsLoading(true)
    toggleError()
    const response = await axios(url).catch((error) => console.log(error))
    if (response) {
      const { data } = response
      setGithubUser(data)
      const { login, repos_url } = data
      // axios(`${rootUrl}/users/${login}/followers?per_page=100`)
      //   .then((response) => {
      //     setFollowers(response.data)
      //   })
      //   .catch((error) => console.log(error))
      //   axios(`${repos_url}?per_page=100`).then(response=> {
      //    setRepos(response.data)
      //   })
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/followers?per_page=100`),
        axios(`${repos_url}?per_page=100`),
      ]).then(([followers, repos])=> {
       const status = 'fulfilled'
       if(followers.status === status) {
        setFollowers(followers.value.data);
       }
       if(repos.status === status) {
        setRepos(repos.value.data)
       }
      })
    } else {
      toggleError(true, 'There Is No User With That Username')
    }
    setIsLoading(false)
    checkRequests()
  }

  return {
    requestsLeft,
    ...error,
    isLoading,
    fetchUser,
    githubUser,
    followers,
    repos,
  }
}

export default Fetch
