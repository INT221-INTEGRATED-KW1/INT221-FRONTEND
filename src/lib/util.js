function formatStatus(status) {
  // console.log(status);
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

function colorStatus(status) {
  const no_status = 'bg-slate-200 text-grey italic'
  const todo = 'bg-orange-200 text-orange-800'
  const doing = 'bg-blue-200 text-blue-800'
  const done = 'bg-emerald-200 text-emerald-800'
  if (status == 'NO_STATUS') {
    return no_status
  }
  if (status == 'TODO') {
    return todo
  }
  if (status == 'DOING') {
    return doing
  }
  if (status == 'DONE') {
    return done
  }
}
export { formatStatus, colorStatus }