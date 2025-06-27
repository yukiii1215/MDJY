import axios from 'axios'
import { KJUR } from 'jsrsasign'

const accessKey = import.meta.env.VITE_KELING_API_ACCESS_KEY
const secretKey = import.meta.env.VITE_KELING_API_SECRET_KEY

console.log('accessKey:', accessKey, typeof accessKey)
console.log('secretKey:', secretKey, typeof secretKey)

function generateToken() {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: accessKey,
    exp: now + 1800,
    nbf: now - 5
  }
  const sHeader = JSON.stringify(header)
  const sPayload = JSON.stringify(payload)
  return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { utf8: secretKey })
}

export async function createKelingImageTask(prompt: string, aspect_ratio = '3:4', model_name = 'kling-v1-5') {
  const token = generateToken()
  const res = await axios.post(
    'https://api-beijing.klingai.com/v1/images/generations',
    {
      model_name,
      prompt,
      aspect_ratio,
      n: 1
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  )
  return res.data.data.task_id
}

export async function pollKelingImageTask(taskId: string, maxTry = 20, interval = 2000) {
  const token = generateToken()
  for (let i = 0; i < maxTry; i++) {
    await new Promise(r => setTimeout(r, interval))
    const poll = await axios.get(
      `https://api-beijing.klingai.com/v1/images/generations/${taskId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
    const status = poll.data.data.task_status
    if (status === 'succeed') {
      return poll.data.data.task_result.images[0].url
    }
    if (status === 'failed') {
      throw new Error(poll.data.data.task_status_msg || '生成失败')
    }
  }
  throw new Error('生成超时')
} 