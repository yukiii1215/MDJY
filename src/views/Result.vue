<template>
  <div class="result-container">
    <div class="result-visual">
      <div class="visual-bg"></div>
      <div class="visual-artwork"></div>
    </div>
    <div class="result-content">
      <h1 class="title">{{ result.title }}</h1>
      <div class="desc-main">{{ result.description }}</div>
      <div class="desc-columns">
        <div class="desc-col">
          <div class="col-title">结艺天赋</div>
          <div class="col-text">{{ result.talent }}</div>
        </div>
        <div class="desc-col">
          <div class="col-title">风格客观</div>
          <div class="col-text">{{ result.style }}</div>
        </div>
        <div class="desc-col">
          <div class="col-title">你的智慧</div>
          <div class="col-text">{{ result.wisdom }}</div>
        </div>
      </div>
      <div class="actions">
        <button class="action-btn share" @click="shareResult">分享</button>
        <button class="action-btn generate" @click="generatePoster">生成海报</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// 模拟结果数据
const result = ref({
  title: '金·盛唐华彩结艺师',
  description: '您的命格显示您具有坚韧不拔的金属性，与盛唐时期的华彩风格相得益彰。您的守护图腾为凤凰，象征着涅槃重生与永恒之美。',
  talent: '金属性格，坚韧果敢，善于创新。',
  style: '盛唐华彩，色彩明丽，纹样繁复。',
  wisdom: '如凤凰涅槃，遇难重生，永不言弃。'
})
const shareResult = () => {
  // 实现分享功能
  alert('分享功能开发中')
}
const generatePoster = () => {
  router.push('/poster')
}
onMounted(() => {})
</script>

<style lang="scss" scoped>
.result-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fffbe6 0%, #ffe0b2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 2rem;
}
.result-visual {
  width: 100vw;
  max-width: 480px;
  height: 220px;
  margin: 0 auto 1.5rem auto;
  position: relative;
  .visual-bg {
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    background: linear-gradient(120deg, #ffe082 0%, #ffb347 100%);
    box-shadow: 0 4px 32px rgba(255, 183, 77, 0.13);
    position: absolute;
    left: 0; top: 0;
    z-index: 1;
  }
  .visual-artwork {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 120px; height: 120px;
    background: url('https://img.icons8.com/ios-filled/100/ffd700/diamond.png') no-repeat center/contain;
    z-index: 2;
    filter: drop-shadow(0 4px 16px #ffd70044);
  }
}
.result-content {
  width: 100vw;
  max-width: 480px;
  margin: 0 auto;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px rgba(255,183,77,0.08);
  padding: 2rem 1.2rem 1.5rem 1.2rem;
  text-align: center;
}
.title {
  font-size: 2rem;
  color: #ffb347;
  font-weight: 800;
  margin-bottom: 1.2rem;
  letter-spacing: 2px;
  line-height: 1.2;
}
.desc-main {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}
.desc-columns {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 2rem;
  .desc-col {
    flex: 1;
    background: #fffbe6;
    border-radius: 1rem;
    padding: 1rem 0.5rem;
    box-shadow: 0 2px 8px rgba(255,183,77,0.06);
    .col-title {
      font-size: 1rem;
      color: #ffb347;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .col-text {
      font-size: 0.95rem;
      color: #666;
      line-height: 1.5;
    }
  }
}
.actions {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.5rem;
}
.action-btn {
  padding: 1rem 2.5rem;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  background: linear-gradient(90deg, #ffb347, #ff6b6b);
  color: #fff;
  box-shadow: 0 2px 12px rgba(255,107,107,0.08);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #ff6b6b, #ffb347);
    transform: scale(1.04);
  }
}
@media (max-width: 600px) {
  .result-content { padding: 1.2rem 0.5rem 1rem 0.5rem; }
  .title { font-size: 1.3rem; }
  .desc-columns { flex-direction: column; gap: 0.5rem; }
}
</style> 