const url = import.meta.env.VITE_BASE_URL

async function getMethod(path) {
  try {
    const response = await fetch(`${url}${path}`)
    if (!response.ok) {
      throw new Error(`Failed to get method ${path}`)
    }
    const data = await response.json()
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

async function addMethod(detail, database) {
  try {
    const response = await fetch(`${url}${database}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(detail)
    })
    if (!response.ok) {
      throw new Error(`Fail to add new ${database}.`)
    }
    const data = await response.json()
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

async function deleteMethod(taskId, database) {
  try {
    const response = await fetch(`${url}${database}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to delete task id : ', taskId)
    }
    const data = await response.json()
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

async function updateMethod(taskId, database, taskDetail) {
  try {
    const response = await fetch(`${url}${database}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskDetail)
    })
    if (!response.ok) {
      throw new Error(`Failed to update ${database} id : `, taskId)
    }
    const data = await response.json()
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

export { getMethod , addMethod , deleteMethod , updateMethod}
