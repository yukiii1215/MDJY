<template>
  <div class="poster-container">
    <div class="poster-bg"></div>
    <div class="poster-mask"></div>
    <div class="poster-content">
      <div v-if="!loading" class="poster-header">
        <button class="icon-btn back" :style="{ color: mainColor }" @click="goResult" aria-label="返回">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path d="M18 6L10 14L18 22" :stroke="mainColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>
        <button class="icon-btn share" :style="{ color: mainColor }" @click="sharePoster" aria-label="分享">
          <svg width="26" height="26" viewBox="0 0 26 26">
            <circle cx="6" cy="13" r="2" :stroke="mainColor" stroke-width="2" fill="none"/>
            <circle cx="20" cy="6" r="2" :stroke="mainColor" stroke-width="2" fill="none"/>
            <circle cx="20" cy="20" r="2" :stroke="mainColor" stroke-width="2" fill="none"/>
            <path d="M8 13L18 7" :stroke="mainColor" stroke-width="2" fill="none"/>
            <path d="M8 13L18 19" :stroke="mainColor" stroke-width="2" fill="none"/>
          </svg>
        </button>
      </div>
      <div v-if="loading" class="loading-area">
        <div class="knot-weave-loading">
          <svg width="90" height="90" viewBox="0 0 90 90">
            <path :stroke="mainColor" stroke-width="4" fill="none"
              d="M20,45 Q45,10 70,45 Q45,80 20,45 Z"
              :style="{ strokeDasharray: 220, strokeDashoffset: 0, animation: 'knotPath1 1.8s linear infinite' }"/>
            <path :stroke="mainColor" stroke-width="4" fill="none" opacity="0.4"
              d="M70,45 Q45,10 20,45 Q45,80 70,45 Z"
              :style="{ strokeDasharray: 220, strokeDashoffset: 0, animation: 'knotPath2 1.8s linear infinite' }"/>
            <circle :fill="mainColor" r="4">
              <animate attributeName="cx" values="20;45;70;45;20" keyTimes="0;0.25;0.5;0.75;1" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="cy" values="45;10;45;80;45" keyTimes="0;0.25;0.5;0.75;1" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="45" cy="45" r="7" :fill="mainColor" opacity="0.18">
              <animate attributeName="r" values="7;11;7" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
        <div class="loading-text" :style="{ color: mainColor }">正在为你编织专属结艺守护符…<br>请耐心等待片刻</div>
      </div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="result-area">
        <div class="poster-main-title" :style="{ color: mainColor, fontSize: '1.7rem' }">你的专属结艺守护符</div>
        <div class="poster-image-wrap">
          <img :src="imageUrl" alt="结艺守护符" class="poster-image" />
        </div>
        
        <div class="poster-info">
          <div class="poster-title">{{ result.title }}</div>
          <div class="poster-desc">{{ result.description }}</div>
        </div>
        <div class="poster-actions">
          <button class="main-btn retry-btn" :style="{ background: mainGradient, color: '#fff' }" @click="retryTest">再测一次</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { KJUR } from 'jsrsasign'
import { createKelingImageTask, pollKelingImageTask } from '@/api/keling'

const router = useRouter()
// ====== 你需要在此处填写你的accessKey和secretKey ======
// 已移除，统一由 src/api/keling.ts 管理
// =====================================================

const result = ref({
  title: '',
  description: '',
  talent: '',
  style: '',
  wisdom: ''
})
const imageUrl = ref('')
const loading = ref(true)
const error = ref('')

// 读取result信息（从localStorage）
onMounted(() => {
  const saved = localStorage.getItem('resultData')
  if (saved) {
    result.value = JSON.parse(saved)
  } else {
    // 兼容旧逻辑
    const testResult = localStorage.getItem('testAnswers')
    if (testResult) {
      // 可选：根据testAnswers推断result
    }
  }
  generateImage()
})

// 读取五行主色
const elementMainColors = [
  { name: '金', color: '#FFD700', desc: '金色' },
  { name: '木', color: '#6FCF97', desc: '绿色' },
  { name: '水', color: '#56CCF2', desc: '蓝色' },
  { name: '火', color: '#FF6B6B', desc: '红色' },
  { name: '土', color: '#B47B4D', desc: '棕色' }
]
let elementIdx = 0
const answers = JSON.parse(localStorage.getItem('testAnswers') || '[]')
if (answers.length > 0) elementIdx = answers[0]
const mainColorDesc = elementMainColors[elementIdx]?.desc || '柔和色彩'
const mainColor = elementMainColors[elementIdx]?.color || '#FFD700'

// 优化AI提示词，明确强调大同结艺、中国结、结艺守护符、主色调
const buildPrompt = () => {
  return [
    '大同结艺',
    '一个结艺守护符',
    '一个守护符居中显示',
    result.value.title,
    result.value.description,
    result.value.talent,
    result.value.style,
    result.value.wisdom,
    `主色为${mainColorDesc}`,
    '淡雅渐变背景',
    '国风祥云、波浪或编绳等纹理',
    '整体氛围与主色调协调',
    '国风插画',
    '柔和色彩',
    '唯美',
    '极简',
    '高清',
    '符号化',
    '现代设计',
    '扁平风',
    '适合H5页面',
    '无背景'
  ].filter(Boolean).join('，')
}

// JWT生成函数（如需本地生成JWT可解开并用jsonwebtoken库）
const generateToken = () => {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: accessKey,
    exp: now + 1800, // 30分钟有效
    nbf: now - 5     // 提前5秒生效
  }
  const sHeader = JSON.stringify(header)
  const sPayload = JSON.stringify(payload)
  const token = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, { utf8: secretKey })
  return token
}

const generateImage = async () => {
  loading.value = true
  error.value = ''
  imageUrl.value = ''
  try {
    const taskId = await createKelingImageTask(buildPrompt())
    const img = await pollKelingImageTask(taskId)
    imageUrl.value = img
  } catch (e) {
    console.error('生成失败详细信息:', e)
    error.value = (e && e.message ? e.message : JSON.stringify(e)) + '\n请检查环境变量配置和 API Key 是否正确。'
  } finally {
    loading.value = false
  }
}

const goResult = () => {
  router.push('/result')
}
const retryTest = () => {
  localStorage.removeItem('testAnswers')
  localStorage.removeItem('resultData')
  router.push('/test')
}

const sharePoster = () => {
  alert('分享功能开发中')
}
</script>

<style lang="scss" scoped>
.poster-container {
  width: 375px;
  height: 667px;
  min-height: unset;
  min-width: unset;
  max-width: 100vw;
  max-height: 100vh;
  margin: auto;
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  box-shadow: 0 0 40px 0 rgba(0,0,0,0.10);
  border-radius: 18px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 0;
}
.poster-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: url('@/resources/result.png') no-repeat center center;
  background-size: cover;
  background-position: center center;
  opacity: 0.18;
}
.poster-mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(255,255,255,0.2);
  pointer-events: none;
}
.poster-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 90%;
  max-width: 320px;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 0.7rem 1rem 0.7rem;
  overflow: visible;
  background: none;
  box-shadow: none;
  border-radius: 0;
  padding-top: 3.2rem;
}
.poster-main-title {
  font-size: 1.3rem;
  font-weight: 900;
  color: #b47b4d;
  margin-top: 0.5rem;
  margin-bottom: 1.1rem;
  letter-spacing: 2px;
  text-align: center;
  line-height: 1.3;
}
.poster-image-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1.1rem auto 1.1rem auto;
}
.poster-image {
  max-width: 100%;
  max-height: 40vh;
  border-radius: 14px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.12);
  background: #fff;
  position: relative;
  z-index: 1;
}
.poster-tip {
  text-align: center;
  color: #b47b4d;
  font-size: 0.95rem;
  margin: 0.7rem 0 1.2rem 0;
  opacity: 0.85;
  letter-spacing: 1px;
  user-select: none;
}
.poster-info {
  text-align: center;
  margin-bottom: 0.5rem;
  .poster-title {
    font-size: 1.05rem;
    font-weight: 800;
    color: #b47b4d;
    margin-bottom: 0.3rem;
    letter-spacing: 2px;
  }
  .poster-desc {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.7;
    margin-bottom: 0.3rem;
  }
}
.poster-actions {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}
.main-btn {
  font-size: 0.95rem;
  padding: 0.7rem 1.5rem;
  border-radius: 1.2rem;
  border: none;
  background: linear-gradient(90deg, #ffb347, #ff6b6b);
  color: #fff;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.15);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
  letter-spacing: 2px;
  &:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 30px rgba(255, 107, 107, 0.25);
  }
}
.main-btn.retry-btn {
  font-size: 1rem;
  padding: 0.6rem 1.3rem;
  border-radius: 1rem;
  background: v-bind(mainGradient);
  color: #fff !important;
  min-width: 0;
  box-shadow: 0 2px 12px rgba(255,107,107,0.10);
}
.knot-weave-loading {
  margin-bottom: 1.5rem;
  svg {
    display: block;
    margin: 0 auto;
  }
  .weave-path1 {
    stroke-dasharray: 120 120;
    stroke-dashoffset: 0;
    animation: weave-path1-move 1.6s linear infinite;
    opacity: 0.85;
  }
  .weave-path2 {
    stroke-dasharray: 120 120;
    stroke-dashoffset: 120;
    animation: weave-path2-move 1.6s linear infinite;
    opacity: 0.7;
  }
  .weave-dot {
    animation: weave-dot-move 1.6s linear infinite alternate;
  }
}
@keyframes weave-path1-move {
  0% { stroke-dashoffset: 120; }
  100% { stroke-dashoffset: 0; }
}
@keyframes weave-path2-move {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 120; }
}
@keyframes weave-dot-move {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}
.loading-text {
  font-size: 1.3rem;
  color: #b47b4d;
  text-align: center;
  line-height: 2.1rem;
  font-weight: 600;
  letter-spacing: 1px;
}
.error {
  font-size: 1.3rem;
  color: #e74c3c;
  margin: 2rem 0;
  z-index: 2;
}
@media (max-width: 414px) {
  .poster-container {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
}
@keyframes knotPath1 {
  0% { stroke-dashoffset: 220; }
  100% { stroke-dashoffset: 0; }
}
@keyframes knotPath2 {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 220; }
}
.poster-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0.7rem;
  left: 0;
  padding: 0 1.1rem;
  z-index: 10;
}
.icon-btn {
  background: rgba(255,255,255,0.85);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.icon-btn:hover {
  background: #fff;
  filter: brightness(0.92);
}
</style> 