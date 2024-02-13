export async function fetchUsers() {
  const response = await fetch('/api/users')
  const result = await response.json()
  return result
}