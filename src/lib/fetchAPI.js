import router from '@/router/router'
import { JwtDecode } from './util'

const SERVER_URL = import.meta.env.VITE_BASE_URL
const VERSION = 'v3'
const url = `${SERVER_URL}/${VERSION}`

function isTokenValid(token) {
  if (!token) return false
  try {
    const decodedToken = JwtDecode(token)
    const currentTime = Date.now() / 1000 // Current time in seconds
    return decodedToken.exp > currentTime
  } catch (error) {
    return false
  }
}

// Navigation guard
async function validateToken() {
  const token = localStorage.getItem('token')
  const isAuthenticated = isTokenValid(token)
  if (isAuthenticated) {
    return // Redirect to login if not authenticated
  } else if (localStorage.getItem('refresh_token')) {
    const refreshed = await refreshToken()
    if (refreshed.response.ok) {
      return console.log('refresh')
    } else {
      router.push({ name: 'login' })
    }
    // Proceed to the route
  } else {
    return
  }
}

async function getMethod(path, sortBy = null, filterStatuses = []) {
  try {
    await validateToken()
    const params = new URLSearchParams()
    if (sortBy) {
      params.append('sortBy', sortBy)
    }

    if (filterStatuses.length > 0) {
      const filterStatusesString = filterStatuses.join(',')
      params.append('filterStatuses', filterStatusesString)
    }
    const boardId = router.currentRoute.value.params.uid
    // If need in requirement (assign multiple params)
    const response = await fetch(`${url}/boards/${boardId}/${path}?${params.toString()}`, {
      method: 'GET',
      headers: localStorage.getItem('token')
        ? {
            Accept: 'application/hal+json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        : {
            Accept: 'application/hal+json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
    })
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    // console.error('Error fetching data:', error)
    return
  }
}

async function addMethod(detail, database) {
  await validateToken()
  try {
    const response = await fetch(`${url}/boards/${localStorage.getItem('uid')}/${database}`, {
      method: 'POST',
      headers: localStorage.getItem('token')
        ? {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        : {
            'Content-Type': 'application/json'
          },
      body: JSON.stringify(detail)
    })
    if (!response.ok) {
      if (response.status == '401') router.push({ name: 'login' })
      if (response.status == '403') router.push({ name: 'forbidden' })
    }
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    return
  }
}

async function deleteMethod(taskId, database) {
  await validateToken()
  const response = await fetch(
    `${url}/boards/${localStorage.getItem('uid')}/${database}/${taskId}`,
    {
      method: 'DELETE',
      headers: localStorage.getItem('token')
        ? {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        : {
            'Content-Type': 'application/json'
          }
    }
  )
  const data = await response.json()
  if (response.status == 401) {
    return router.push({ name: 'login' })
  }
  return { resCode: response.status, data }
}

async function deleteTranMethod(taskId, database, newId) {
  await validateToken()
  // try {
  const response = await fetch(
    `${url}/boards/${localStorage.getItem('uid')}/${database}/${taskId}/${newId}`,
    {
      method: 'DELETE',
      headers: localStorage.getItem('token')
        ? {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        : {
            'Content-Type': 'application/json'
          }
    }
  )
  const data = await response.json()
  if (!response.ok) {
    if (response.status == '401') router.push({ name: 'login' })
    if (response.status == '403') router.push({ name: 'forbidden' })
  }
  return { resCode: response.status, data }
  // } catch (error) {
  //   throw error
  // }
}

async function updateMethod(Id, database, Detail) {
  await validateToken()
  try {
    const response = await fetch(`${url}/boards/${localStorage.getItem('uid')}/${database}/${Id}`, {
      method: 'PUT',
      headers: localStorage.getItem('token')
        ? {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        : {
            'Content-Type': 'application/json'
          },
      body: JSON.stringify(Detail)
    })
    if (!response.ok) {
      if (response.status == '401') router.push({ name: 'login' })
      if (response.status == '403') router.push({ name: 'forbidden' })
    }
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    throw error
  }
}

async function patchMethod(subfix, Detail, detailId) {
  await validateToken()
  try {
    const boardId = router.currentRoute.value.params.uid
    const response = await fetch(
      `${url}/boards/${boardId}${subfix ? `/${subfix}` : ''}${detailId ? `/${detailId}` : ''}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(Detail)
      }
    )
    if (!response.ok) {
      if (response.status == '401') router.push({ name: 'login' })
    }
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    throw error
  }
}

async function boardFetch() {
  await validateToken()
  try {
    const response = await fetch(`${url}/boards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    throw error
  }
}

async function refreshToken() {
  try {
    const response = await fetch(`${SERVER_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('refresh_token')
      }
    })
    const data = await response.json()
    if (!response.ok) {
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    } else {
      localStorage.setItem('token', data.access_token)
      return { response }
    }
  } catch (error) {
    throw error
  }
}

export {
  getMethod,
  addMethod,
  deleteMethod,
  updateMethod,
  deleteTranMethod,
  patchMethod,
  boardFetch,
  refreshToken
}
