export async function fetchUsers() {
  const response = await fetch('/api')
  return await response.json()
}