const url = import.meta.env.VITE_BASE_URL

async function getMethod(path, sortBy = null, filterStatuses = []) {
  try {
    const params = new URLSearchParams()
    if (sortBy) {
      params.append('sortBy', sortBy)
    }

    if (filterStatuses.length > 0) {
      const filterStatusesString = filterStatuses.join(',')
      params.append('filterStatuses', filterStatusesString)
    }

    // If need in requirement (assign multiple params)
    const response = await fetch(
      `${url}boards/${localStorage.getItem('uid')}/${path}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/hal+json',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
    )
    if (!response.ok) {
      throw new Error(`Failed to get method ${path}`)
    }
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

async function addMethod(detail, database) {
  try {
    const response = await fetch(`${url}boards/${localStorage.getItem('uid')}/${database}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(detail)
    })
    if (!response.ok) {
      throw new Error(`Fail to add new ${database}.`)
    }
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    throw error
  }
}

async function deleteMethod(taskId, database) {
  // try {
  const response = await fetch(
    `${url}boards/${localStorage.getItem('uid')}/${database}/${taskId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  )
  const data = await response.json()
  if (!response.ok) {
    return { resCode: response.status, data }
  }
  return { resCode: response.status, data }
  // } catch (error) {
  //   throw error
  // }
}

async function deleteTranMethod(taskId, database, newId) {
  // try {
  const response = await fetch(
    `${url}boards/${localStorage.getItem('uid')}/${database}/${taskId}/${newId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
  )
  const data = await response.json()
  // if (!response.ok) {
  // throw new Error(`Failed to delete task id: ${taskId}`)
  //   return { resCode: response.status, data }
  // }
  return { resCode: response.status, data }
  // } catch (error) {
  //   throw error
  // }
}

async function updateMethod(Id, database, Detail) {
  try {
    const response = await fetch(`${url}boards/${localStorage.getItem('uid')}/${database}/${Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(Detail)
    })
    if (!response.ok) {
      throw new Error(`Failed to update ${database} id: ${Id}`)
    }
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    throw error
  }
}

async function patchMethod(subfix, Detail) {
  try {
    const response = await fetch(
      `${url}boards/${localStorage.getItem('uid')}/${subfix}`,
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
      throw new Error(`Failed to update ${subfix}`)
    }
    const data = await response.json()
    return { resCode: response.status, data }
  } catch (error) {
    throw error
  }
}

export { getMethod, addMethod, deleteMethod, updateMethod, deleteTranMethod, patchMethod }
