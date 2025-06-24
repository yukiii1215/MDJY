<template>
  <div class="result-container" :style="{ background: mainGradient }">
    <div class="art-bg" :class="artBgClass"></div>
    <div class="result-visual" :style="{ background: `linear-gradient(135deg, ${mainColor}22 0%, #fff0 100%)` }">
      <div class="visual-bg"></div>
      <div class="visual-icons">
        <div class="visual-icon" :class="elementIcon"></div>
        <div class="visual-icon" :class="eraIcon"></div>
        <div class="visual-icon" :class="symbolIcon"></div>
      </div>
    </div>
    <div class="result-content">
      <h1 class="title" :style="{ color: mainColor }">{{ result.title }}</h1>
      <div class="desc-main">{{ result.description }}</div>
      <div class="desc-columns">
        <div class="desc-col">
          <div class="col-title" :style="{ color: mainColor }">结艺天赋</div>
          <div class="col-text">{{ result.talent }}</div>
        </div>
        <div class="desc-col">
          <div class="col-title" :style="{ color: mainColor }">风格客观</div>
          <div class="col-text">{{ result.style }}</div>
        </div>
        <div class="desc-col">
          <div class="col-title" :style="{ color: mainColor }">你的智慧</div>
          <div class="col-text">{{ result.wisdom }}</div>
        </div>
      </div>
      <div class="actions">
       
        <button class="action-btn generate" :style="{ background: mainGradient }" @click="generatePoster">看看我的结艺守护符</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 五行属性
const elements = {
  metal: { name: '金', traits: ['坚韧', '果敢', '创新'] },
  wood: { name: '木', traits: ['生长', '包容', '和谐'] },
  water: { name: '水', traits: ['灵动', '智慧', '包容'] },
  fire: { name: '火', traits: ['热情', '活力', '创造'] },
  earth: { name: '土', traits: ['稳重', '踏实', '包容'] }
}

// 时代风格
const eras = {
  palace: { name: '盛唐', style: ['华彩', '富丽', '大气'] },
  cave: { name: '敦煌', style: ['神秘', '深邃', '灵动'] },
  garden: { name: '江南', style: ['雅致', '清新', '婉约'] }
}

// 图腾象征
const symbols = {
  phoenix: { name: '凤凰', wisdom: ['涅槃重生', '永恒之美', '浴火重生'] },
  qilin: { name: '麒麟', wisdom: ['祥瑞之兆', '仁德之兽', '智慧化身'] },
  lotus: { name: '莲花', wisdom: ['出淤泥而不染', '清净无染', '智慧圆满'] },
  cloud: { name: '云纹', wisdom: ['变化万千', '自由自在', '灵动飘逸'] }
}

// 结果模板
const resultTemplates = [
  {
    pattern: ['metal', 'palace', 'phoenix'],
    title: '金·盛唐华彩结艺师',
    description: '您的命格显示您具有坚韧不拔的金属性，与盛唐时期的华彩风格相得益彰。您的守护图腾为凤凰，象征着涅槃重生与永恒之美。',
    talent: '金属性格，坚韧果敢，善于创新。',
    style: '盛唐华彩，色彩明丽，纹样繁复。',
    wisdom: '如凤凰涅槃，遇难重生，永不言弃。'
  },
  {
    pattern: ['wood', 'garden', 'lotus'],
    title: '木·江南雅韵结艺师',
    description: '您具有如木般生长的包容性格，与江南园林的雅致风格相映成趣。莲花作为您的守护图腾，象征着出淤泥而不染的高洁品格。',
    talent: '木性品格，包容和谐，善于生长。',
    style: '江南雅韵，清新婉约，意境深远。',
    wisdom: '如莲花绽放，保持本心，清净无染。'
  },
  {
    pattern: ['water', 'cave', 'cloud'],
    title: '水·敦煌灵动结艺师',
    description: '您拥有水一般的灵动智慧，与敦煌石窟的神秘风格相得益彰。云纹作为您的守护图腾，象征着变化万千的创造力。',
    talent: '水性智慧，灵动包容，善于变通。',
    style: '敦煌神秘，深邃灵动，变化万千。',
    wisdom: '如云纹流转，自由自在，灵动飘逸。'
  },
  {
    pattern: ['fire', 'palace', 'qilin'],
    title: '火·盛唐祥瑞结艺师',
    description: '您具有火一般的热情活力，与盛唐时期的富丽风格相得益彰。麒麟作为您的守护图腾，象征着祥瑞与仁德。',
    talent: '火性品格，热情活力，善于创造。',
    style: '盛唐富丽，大气磅礴，祥瑞环绕。',
    wisdom: '如麒麟现世，仁德智慧，祥瑞之兆。'
  },
  {
    pattern: ['earth', 'garden', 'phoenix'],
    title: '土·江南涅槃结艺师',
    description: '您拥有土一般的稳重踏实，与江南园林的婉约风格相映成趣。凤凰作为您的守护图腾，象征着永恒之美与重生。',
    talent: '土性品格，稳重踏实，善于包容。',
    style: '江南婉约，清新雅致，意境深远。',
    wisdom: '如凤凰涅槃，浴火重生，永恒之美。'
  }
]

// 获取测试结果
const getTestResult = () => {
  const answers = JSON.parse(localStorage.getItem('testAnswers') || '[]')
  if (answers.length !== 3) return resultTemplates[0]

  const [element, era, symbol] = answers
  const elementKey = Object.keys(elements)[element]
  const eraKey = Object.keys(eras)[era]
  const symbolKey = Object.keys(symbols)[symbol]

  // 查找匹配的结果模板
  const matchedResult = resultTemplates.find(template => {
    const [tElement, tEra, tSymbol] = template.pattern
    return tElement === elementKey && tEra === eraKey && tSymbol === symbolKey
  })

  if (matchedResult) return matchedResult

  // 如果没有完全匹配的模板，根据选择组合生成新的结果
  const elementInfo = elements[elementKey]
  const eraInfo = eras[eraKey]
  const symbolInfo = symbols[symbolKey]

  return {
    title: `${elementInfo.name}·${eraInfo.name}${symbolInfo.name}结艺师`,
    description: `您的命格显示您具有${elementInfo.traits[0]}的${elementInfo.name}属性，与${eraInfo.name}的${eraInfo.style[0]}风格相得益彰。${symbolInfo.name}作为您的守护图腾，象征着${symbolInfo.wisdom[0]}。`,
    talent: `${elementInfo.name}性品格，${elementInfo.traits.join('，')}。`,
    style: `${eraInfo.name}${eraInfo.style[0]}，${eraInfo.style[1]}，${eraInfo.style[2]}。`,
    wisdom: `如${symbolInfo.name}${symbolInfo.wisdom[0]}，${symbolInfo.wisdom[1]}，${symbolInfo.wisdom[2]}。`
  }
}

const result = ref(getTestResult())

const shareResult = () => {
  // 实现分享功能
  alert('分享功能开发中')
}

const generatePoster = () => {
  router.push('/poster')
}

const answers = JSON.parse(localStorage.getItem('testAnswers') || '[]')
const elementIdx = answers[0] ?? 0
const eraIdx = answers[1] ?? 0
const symbolIdx = answers[2] ?? 0

const elementMainColors = [
  '#FFD700', // 金
  '#6FCF97', // 木
  '#56CCF2', // 水
  '#FF6B6B', // 火
  '#B47B4D'  // 土
]
const elementGradients = [
  'linear-gradient(135deg, #FFD700 0%, #FFF7D6 100%)', // 金
  'linear-gradient(135deg, #6FCF97 0%, #E0FFE6 100%)', // 木
  'linear-gradient(135deg, #56CCF2 0%, #E0F7FF 100%)', // 水
  'linear-gradient(135deg, #FF6B6B 0%, #FFE0E0 100%)', // 火
  'linear-gradient(135deg, #B47B4D 0%, #F5E6D6 100%)'  // 土
]
const mainColor = elementMainColors[elementIdx]
const mainGradient = elementGradients[elementIdx]
const artBgClass = ['gold','wood','water','fire','earth'][elementIdx]

const elementIcon = ['metal', 'wood', 'water', 'fire', 'earth'][elementIdx]
const eraIcon = ['palace', 'cave', 'garden'][eraIdx]
const symbolIcon = ['phoenix', 'qilin', 'lotus', 'cloud'][symbolIdx]

onMounted(() => {})
</script>

<style lang="scss" scoped>
.result-container {
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
.art-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.art-bg.gold {
  background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="500" cy="100" rx="180" ry="80" fill="%23FFD70033"/><ellipse cx="120" cy="350" rx="120" ry="40" fill="%23FFF7D655"/></svg>') no-repeat center/cover;
}
.art-bg.wood {
  background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="500" cy="100" rx="180" ry="80" fill="%236FCF9733"/><ellipse cx="120" cy="350" rx="120" ry="40" fill="%23E0FFE655"/></svg>') no-repeat center/cover;
}
.art-bg.water {
  background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="500" cy="100" rx="180" ry="80" fill="%2356CCF233"/><ellipse cx="120" cy="350" rx="120" ry="40" fill="%23E0F7FF55"/></svg>') no-repeat center/cover;
}
.art-bg.fire {
  background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="500" cy="100" rx="180" ry="80" fill="%23FF6B6B33"/><ellipse cx="120" cy="350" rx="120" ry="40" fill="%23FFE0E055"/></svg>') no-repeat center/cover;
}
.art-bg.earth {
  background: url('data:image/svg+xml;utf8,<svg width="100%25" height="100%25" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="500" cy="100" rx="180" ry="80" fill="%23B47B4D33"/><ellipse cx="120" cy="350" rx="120" ry="40" fill="%23F5E6D655"/></svg>') no-repeat center/cover;
}

.result-visual {
  max-width: 320px;
  width: 90%;
  margin: 0 auto 1.5rem auto;
  height: 140px;
  position: relative;
  z-index: 1;
  padding: 0 1.5rem;
  .visual-bg {
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 0; top: 0;
    z-index: 1;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('@/resources/result.png') no-repeat center/cover;
      opacity: 0.2;
      transform: scale(1.1);
      animation: visualFloat 20s ease-in-out infinite;
    }
  }
  .visual-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3.5rem;
    height: 100%;
    z-index: 2;
    position: relative;
  }
  .visual-icon {
    width: 100px;
    height: 100px;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    object-fit: contain;
    animation: iconFloat 3.2s ease-in-out infinite;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .visual-icon:nth-child(2) {
    animation-delay: 1s;
  }
  .visual-icon:nth-child(3) {
    animation-delay: 2s;
  }
  .visual-icon.metal {
    background-image: url('https://img.icons8.com/ios-filled/50/B8860B/diamond.png'); // 深金色
  }
  .visual-icon.palace { background-image: url('https://img.icons8.com/ios-filled/50/ffd700/castle.png'); }
  .visual-icon.cave { background-image: url('https://img.icons8.com/ios-filled/50/795548/cave.png'); }
  .visual-icon.garden { background-image: url('https://img.icons8.com/ios-filled/50/4caf50/garden.png'); }
  .visual-icon.wood { background-image: url('https://img.icons8.com/ios-filled/50/4caf50/leaf.png'); }
  .visual-icon.water { background-image: url('https://img.icons8.com/ios-filled/50/2196f3/water.png'); }
  .visual-icon.fire { background-image: url('https://img.icons8.com/ios-filled/50/ff6b6b/fire-element.png'); }
  .visual-icon.earth { background-image: url('https://img.icons8.com/ios-filled/50/8d6e63/ground.png'); }
  .visual-icon.phoenix { background-image: url('https://img.icons8.com/ios-filled/50/ff9800/bird.png'); }
  .visual-icon.qilin { background-image: url('https://img.icons8.com/ios-filled/50/8d6e63/unicorn.png'); }
  .visual-icon.lotus { background-image: url('https://img.icons8.com/ios-filled/50/2196f3/lotus.png'); }
  .visual-icon.cloud { background-image: url('https://img.icons8.com/ios-filled/50/90caf9/cloud.png'); }
}

@keyframes visualFloat {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(1deg); }
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  20% { transform: translateY(-10px) scale(1.08); }
  50% { transform: translateY(0) scale(1); }
  70% { transform: translateY(8px) scale(0.96); }
}

.result-content {
  max-width: 320px;
  width: 90%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  text-align: center;
  position: relative;
  z-index: 1;
  transform: perspective(1000px) rotateX(5deg);
  animation: contentFloat 3s ease-in-out infinite;
}

@keyframes contentFloat {
  0%, 100% { transform: perspective(1000px) rotateX(5deg) translateY(0); }
  50% { transform: perspective(1000px) rotateX(5deg) translateY(-10px); }
}

.title {
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 0.7rem;
  letter-spacing: 2px;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0,0,0,0.08);
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
  }
}

.desc-main {
  font-size: 0.92rem;
  color: #444;
  margin-bottom: 1rem;
  line-height: 1.7;
}

.desc-columns {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2.2rem;
  .desc-col {
    flex: 1;
    min-width: 0;
    padding: -0.5rem 0.5rem;
    border-radius: 0.7rem;
    background: rgba(255, 251, 230, 0.8);
    backdrop-filter: blur(5px);
    box-shadow: 0 2px 12px rgba(255, 183, 77, 0.1);
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(255, 183, 77, 0.2);
    }
    .col-title {
      font-size: 0.82rem;
      color: #ffb347;
      font-weight: 700;
      margin-bottom: 0.8rem;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        bottom: -0.3rem;
        left: 50%;
        transform: translateX(-50%);
        width: 30%;
        height: 1px;
        background: linear-gradient(90deg, transparent, #ffb347, transparent);
      }
    }
    .col-text {
      font-size: 0.76rem;
      color: #666;
      line-height: 1.5;
    }
  }
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 1.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  background: v-bind(mainGradient);
  color: #fff;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255,255,255,0.2),
      transparent
    );
    transform: rotate(45deg);
    animation: btnShine 3s infinite;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 107, 107, 0.25);
  }
}

@keyframes btnShine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

@media (max-width: 414px) {
  .result-container {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
}
</style> 