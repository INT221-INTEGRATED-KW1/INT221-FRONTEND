function formatStatus(status) {
  if (status == 'NO_STATUS') {
    return 'No Status'
  }
  if (status == 'TODO') {
    return 'To Do'
  }
  if (status == 'DOING') {
    return 'Doing'
  }
  if (status == 'DONE') {
    return 'Done'
  }
}
export { formatStatus }