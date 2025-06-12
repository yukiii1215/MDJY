<template>
  <div class="poster-container">
    <div class="poster" ref="posterRef">
      <div class="poster-content">
        <div class="artwork"></div>
        <div class="text-content">
          <h2>{{ result.title }}</h2>
          <p>{{ result.description }}</p>
          <div class="qrcode">
            <img src="@/assets/images/qrcode.png" alt="扫码定制" />
            <p>扫码定制实体结艺</p>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="action-btn save" @click="savePoster">保存海报</button>
      <button class="action-btn share" @click="sharePoster">分享海报</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import html2canvas from 'html2canvas'
const posterRef = ref<HTMLElement | null>(null)
const result = ref({
  title: '金·盛唐华彩结艺师',
  description: '您的命格显示您具有坚韧不拔的金属性，与盛唐时期的华彩风格相得益彰。'
})
const savePoster = async () => {
  if (!posterRef.value) return
  try {
    const canvas = await html2canvas(posterRef.value)
    const link = document.createElement('a')
    link.download = '我的结艺图腾.png'
    link.href = canvas.toDataURL()
    link.click()
  } catch (error) {
    console.error('保存海报失败:', error)
  }
}
const sharePoster = async () => {
  if (!posterRef.value) return
  try {
    const canvas = await html2canvas(posterRef.value)
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
      })
    })
    if (navigator.share) {
      await navigator.share({
        files: [new File([blob], '我的结艺图腾.png', { type: 'image/png' })],
        title: '我的结艺图腾',
        text: '快来看看我的专属结艺图腾！'
      })
    } else {
      const link = document.createElement('a')
      link.href = canvas.toDataURL()
      link.click()
    }
  } catch (error) {
    console.error('分享海报失败:', error)
  }
}
onMounted(() => {})
</script>

<style lang="scss" scoped>
.poster-container {
  min-height: 100vh;
  padding: 2rem;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.poster {
  width: 100%;
  max-width: 750px;
  aspect-ratio: 9/16;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.poster-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.artwork {
  flex: 1;
  background: linear-gradient(45deg, #ffd700, #ffa500);
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('@/assets/images/pattern.png');
    opacity: 0.1;
  }
}
.text-content {
  padding: 2rem;
  text-align: center;
  background: white;
  h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
}
.qrcode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  img {
    width: 120px;
    height: 120px;
  }
  p {
    font-size: 0.9rem;
    color: #999;
    margin: 0;
  }
}
.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}
.action-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &.save {
    background: #4CAF50;
    color: white;
  }
  &.share {
    background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
    color: white;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
}
</style> 