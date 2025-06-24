<template>
  <div class="test-container">
    <div class="progress-bar">
      <div class="progress-text">{{ currentQuestion + 1 }}/{{ questions.length }}</div>
      <div class="progress-bg">
        <div class="progress" :style="{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }"></div>
      </div>
    </div>
    <div class="question-visual">
      <div class="visual-bg" :class="questions[currentQuestion].visual"></div>
    </div>
    <div class="question-container">
      <h2 class="question-title">{{ questions[currentQuestion].title }}</h2>
      <div class="options">
        <div
          v-for="(option, index) in questions[currentQuestion].options"
          :key="index"
          class="option"
          :class="{ selected: selectedAnswers[currentQuestion] === index }"
          @click="selectAnswer(index)"
        >
          <div class="option-icon" :class="option.icon"></div>
          <div class="option-text">{{ option.text }}</div>
        </div>
      </div>
    </div>
    <div class="navigation">
      <button v-if="currentQuestion > 0" class="nav-btn prev" @click="prevQuestion">上一题</button>
      <button v-if="currentQuestion < questions.length - 1" class="nav-btn next" :disabled="selectedAnswers[currentQuestion] === undefined" @click="nextQuestion">下一题</button>
      <button v-else class="nav-btn submit" :disabled="selectedAnswers[currentQuestion] === undefined" @click="submitTest">查看结果</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const currentQuestion = ref(0)
const selectedAnswers = ref<number[]>([])
const questions = [
  {
    title: '选择与你最契合的五行能量',
    visual: 'visual-metal',
    options: [
      { text: '金', icon: 'metal' },
      { text: '木', icon: 'wood' },
      { text: '水', icon: 'water' },
      { text: '火', icon: 'fire' },
      { text: '土', icon: 'earth' }
    ]
  },
  {
    title: '选择你向往的时空场景',
    visual: 'visual-era',
    options: [
      { text: '唐代宫殿', icon: 'palace' },
      { text: '敦煌石窟', icon: 'cave' },
      { text: '江南园林', icon: 'garden' }
    ]
  },
  {
    title: '选择你的心灵图腾',
    visual: 'visual-symbol',
    options: [
      { text: '凤凰', icon: 'phoenix' },
      { text: '麒麟', icon: 'qilin' },
      { text: '莲花', icon: 'lotus' },
      { text: '云纹', icon: 'cloud' }
    ]
  }
]
const selectAnswer = (index: number) => {
  selectedAnswers.value[currentQuestion.value] = index
}
const nextQuestion = () => {
  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
  }
}
const prevQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  }
}
const submitTest = () => {
  localStorage.setItem('testAnswers', JSON.stringify(selectedAnswers.value))
  router.push('/result')
}
</script>

<style lang="scss" scoped>
.test-container {
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

@media (max-width: 414px) {
  .test-container {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
}

.progress-bar {
  margin-top: 1.1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;
  padding: 0 1.5rem;
  .progress-text {
    color: #888;
    font-size: 0.95rem;
    text-align: right;
    margin-bottom: 0.2rem;
    letter-spacing: 1px;
  }
  .progress-bg {
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    .progress {
      height: 100%;
      background: linear-gradient(90deg, #ffb347, #ff6b6b);
      border-radius: 3px;
      transition: width 0.4s cubic-bezier(.4,0,.2,1);
    }
  }
}
.question-visual {
  width: 100%;
  max-width: 480px;
  height: 140px;
  margin: 0 auto 0.7rem auto;
  padding: 0 1.5rem;
  position: relative;
  .visual-bg {
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: inherit;
      filter: blur(10px);
      transform: scale(1.1);
      opacity: 0.5;
      animation: visualFloat 20s ease-in-out infinite;
    }
    &.visual-metal { 
      background-image: url('@/resources/test_1.png');
      &::after {
        background: linear-gradient(45deg, rgba(255,215,0,0.2), transparent);
      }
    }
    &.visual-era { 
      background-image: url('@/resources/test_2.jpg');
      &::after {
        background: linear-gradient(45deg, rgba(255,182,193,0.2), transparent);
      }
    }
    &.visual-symbol { 
      background-image: url('@/resources/test_3.jpg');
      &::after {
        background: linear-gradient(45deg, rgba(176,196,222,0.2), transparent);
      }
    }
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      backdrop-filter: blur(2px);
    }
  }
}

@keyframes visualFloat {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(1deg); }
}

.question-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  padding: 0 0.7rem;
}
.question-title {
  font-size: 1.2rem;
  color: #222;
  font-weight: 700;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
  line-height: 1.3;
}
.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}
.option {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 0.8rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 0.7rem 1.1rem;
  min-width: 80px;
  min-height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  &:hover, &.selected {
    box-shadow: 0 8px 30px rgba(255,107,107,0.15);
    border-color: #ffb347;
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px) scale(1.04);
    &::before {
      transform: translateX(100%);
    }
  }
}
.option-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 0.5rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.3s ease;
  .option:hover & {
    transform: scale(1.1) rotate(5deg);
  }
  &.metal { background-image: url('https://img.icons8.com/ios-filled/50/ffd700/diamond.png'); }
  &.wood { background-image: url('https://img.icons8.com/ios-filled/50/4caf50/leaf.png'); }
  &.water { background-image: url('https://img.icons8.com/ios-filled/50/2196f3/water.png'); }
  &.fire { background-image: url('https://img.icons8.com/ios-filled/50/ff6b6b/fire-element.png'); }
  &.earth { background-image: url('https://img.icons8.com/ios-filled/50/8d6e63/ground.png'); }
  &.palace { background-image: url('https://img.icons8.com/ios-filled/50/ffd700/castle.png'); }
  &.cave { background-image: url('https://img.icons8.com/ios-filled/50/795548/cave.png'); }
  &.garden { background-image: url('https://img.icons8.com/ios-filled/50/4caf50/garden.png'); }
  &.phoenix { background-image: url('https://img.icons8.com/ios-filled/50/ff9800/bird.png'); }
  &.qilin { background-image: url('https://img.icons8.com/ios-filled/50/8d6e63/unicorn.png'); }
  &.lotus { background-image: url('https://img.icons8.com/ios-filled/50/2196f3/lotus.png'); }
  &.cloud { background-image: url('https://img.icons8.com/ios-filled/50/90caf9/cloud.png'); }
}
.option-text {
  font-size: 1rem;
  color: #444;
  font-weight: 500;
}
.navigation {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.2rem;
}
.nav-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  background: linear-gradient(90deg, #ffb347, #ff6b6b);
  color: #fff;
  box-shadow: 0 4px 20px rgba(255,107,107,0.15);
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
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &.prev {
    background: rgba(224, 231, 239, 0.9);
    backdrop-filter: blur(10px);
    color: #666;
  }
  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255,107,107,0.2);
  }
}

@keyframes btnShine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

@media (max-width: 750px) {
  .test-container {
    max-width: 100%;
    max-height: 100%;
  }
  .question-title { font-size: 1.1rem; }
  .option { padding: 1rem 1.2rem; min-width: 90px; }
  .option-icon { width: 30px; height: 30px; }
}
</style> 