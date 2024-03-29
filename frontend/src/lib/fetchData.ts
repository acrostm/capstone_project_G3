// fetch middleware

import { showToast } from "./utils"


async function request(showFeedback: boolean, input: string | URL | globalThis.Request,
  init?: RequestInit): Promise<any> {
  const crtUrl = location.href
  localStorage.setItem('redirect_url', crtUrl)
  const loginUrl = `${location.protocol}//${location.host}/login`

  return new Promise(async (resolve, reject) => {

    if (!localStorage.token) {
      console.log("======no token in localStorage=======")
      location.replace(loginUrl)
      return

    }
    try {
      const response = await fetch(input, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          'Content-Type': 'application/json'
        },
        ...init
      });

      if (response.status >= 500) {
        throw Error(response.statusText)
      }

      if (response.status === 401) {
        localStorage.removeItem('token')
        location.replace(loginUrl)
      }
      const responseData = await response.json();
      if (responseData.code === 200) {
        resolve(responseData)
      } else {
        if (showFeedback) {
          showToast(responseData.message, 'error')
        }

        console.error(`HTTP error! Status: ${response.status}`);
        reject(responseData.message)
      }
    } catch (error: any) {
      console.error("Fetch error:", error);
      reject(error)
    }
  })



}

export default request