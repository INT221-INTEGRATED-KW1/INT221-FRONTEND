const url = import.meta.env.VITE_BASE_URL

async function getTask(path) {
  try {
    const response = await fetch(`${url}${path}`)
    if (!response.ok) {
      throw new Error('Failed to get task list ;-;')
    }
    const data = await response.json()
    // console.log(response.status);
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

async function addTask(taskDetail) {
  try {
    const response = await fetch(`${url}tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskDetail)
    })
    if (!response.ok) {
      throw new Error('Fail to add new task.')
    }
    const data = await response.json()
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${url}tasks/${taskId}`, {
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

async function updateTask(taskId, taskDetail) {
  try {
    const response = await fetch(`${url}tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskDetail)
    })
    if (!response.ok) {
      throw new Error('Failed to update task id : ', taskId)
    }
    const data = await response.json()
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

export { getTask , addTask , deleteTask , updateTask}
