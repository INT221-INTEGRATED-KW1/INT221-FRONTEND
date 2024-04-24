const url = import.meta.env.VITE_BASE_URL

async function getTask(path) {
  try {
    const response = await fetch(`${url}${path}`)
    if (!response.ok) {
      throw new Error('Failed to get task list ;-;')
    }
    const data = await response.json()
    // console.log(data)
    return { resCode: response.status, data: data }
  } catch (error) {
    throw error
  }
}

export { getTask }
