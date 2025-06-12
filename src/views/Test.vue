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
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 2rem 0;
}
.progress-bar {
  width: 100vw;
  max-width: 480px;
  margin: 0 auto 1.2rem auto;
  .progress-text {
    color: #888;
    font-size: 1rem;
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
  width: 100vw;
  max-width: 480px;
  height: 180px;
  margin: 0 auto 1.2rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  .visual-bg {
    width: 100%;
    height: 100%;
    border-radius: 1.5rem;
    background: linear-gradient(120deg, #f7e8c3 0%, #f6d365 100%);
    box-shadow: 0 4px 32px rgba(255, 183, 77, 0.12);
    &.visual-metal { background: linear-gradient(120deg, #e6e6e6 0%, #ffd700 100%); }
    &.visual-era { background: linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%); }
    &.visual-symbol { background: linear-gradient(120deg, #cfd9df 0%, #e2ebf0 100%); }
  }
}
.question-container {
  width: 100vw;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}
.question-title {
  font-size: 1.5rem;
  color: #222;
  font-weight: 700;
  margin-bottom: 2rem;
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
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 1.2rem 1.8rem;
  min-width: 110px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
  border: 2px solid transparent;
  position: relative;
  &:hover, &.selected {
    box-shadow: 0 4px 24px rgba(255,107,107,0.13);
    border-color: #ffb347;
    background: linear-gradient(120deg, #fffbe6 0%, #ffe0b2 100%);
    transform: translateY(-2px) scale(1.04);
  }
}
.option-icon {
  width: 38px;
  height: 38px;
  margin-bottom: 0.5rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  &.metal { background-image: url('https://img.icons8.com/ios-filled/50/ffd700/diamond.png'); }
  &.wood { background-image: url('https://img.icons8.com/ios-filled/50/4caf50/leaf.png'); }
  &.water { background-image: url('https://img.icons8.com/ios-filled/50/2196f3/water.png'); }
  &.fire { background-image: url('https://img.icons8.com/ios-filled/50/ff6b6b/fire-element.png'); }
  &.earth { background-image: url('https://img.icons8.com/ios-filled/50/8d6e63/ground.png'); }
  &.palace { background-image: url('https://img.icons8.com/ios-filled/50/ffd700/castle.png'); }
  &.cave { background-image: url('https://img.icons8.com/ios-filled/50/795548/cave.png'); }
  &.garden { background-image: url('https://img.icons8.com/ios-filled/50/4caf50/garden.png'); }
  &.phoenix { background-image: url('https://img.icons8.com/ios-filled/50/ff6b6b/phoenix.png'); }
  &.qilin { background-image: url('https://img.icons8.com/ios-filled/50/8d6e63/unicorn.png'); }
  &.lotus { background-image: url('https://img.icons8.com/ios-filled/50/2196f3/lotus.png'); }
  &.cloud { background-image: url('https://img.icons8.com/ios-filled/50/90caf9/cloud.png'); }
}
.option-text {
  font-size: 1.1rem;
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
  padding: 0.8rem 2.2rem;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  background: linear-gradient(90deg, #ffb347, #ff6b6b);
  color: #fff;
  box-shadow: 0 2px 12px rgba(255,107,107,0.08);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &.prev {
    background: #e0e7ef;
    color: #888;
  }
}
@media (max-width: 600px) {
  .question-title { font-size: 1.1rem; }
  .option { padding: 1rem 1.2rem; min-width: 90px; }
  .option-icon { width: 30px; height: 30px; }
}
</style> 