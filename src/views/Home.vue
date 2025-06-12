<template>
  <div class="home-container">
    <div class="lines-bg">
      <div v-for="i in 10" :key="i" class="line" :style="{ '--i': i }"></div>
    </div>
    <div class="content">
      <h1 class="title">测一测<br />你命定的结艺图腾</h1>
      <div class="subtitle">Test Your Destiny Knot Totem</div>
      <button class="start-btn" @click="startTest">进入</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const startTest = () => {
  router.push('/test')
}
</script>

<style lang="scss" scoped>
.home-container {
  width: 100vw;
  height: 100vh;
  background: #111;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lines-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  .line {
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(100vw - var(--i) * 4vw);
    height: calc(100vh - var(--i) * 8vh);
    border: 1.5px solid rgba(255,255,255,0.08);
    border-radius: 2vw;
    transform: translate(-50%, -50%) scale(calc(1 - var(--i)*0.04));
    animation: line-zoom 6s cubic-bezier(.4,0,.2,1) infinite;
    animation-delay: calc(var(--i) * 0.3s);
  }
}
@keyframes line-zoom {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  10% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1); }
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
}
.title {
  color: #fff;
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 1.2;
  margin-bottom: 1.2rem;
  text-shadow: 0 2px 16px rgba(0,0,0,0.2);
}
.subtitle {
  color: #fff;
  font-size: 1.1rem;
  opacity: 0.7;
  margin-bottom: 2.5rem;
  letter-spacing: 1px;
}
.start-btn {
  background: none;
  border: 2px solid #fff;
  color: #fff;
  font-size: 1.3rem;
  border-radius: 2.5rem;
  padding: 0.9rem 3.5rem;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(255,255,255,0.08);
  transition: background 0.2s, color 0.2s, transform 0.2s;
  outline: none;
  position: relative;
  overflow: hidden;
  &:hover {
    background: #fff;
    color: #111;
    transform: scale(1.04);
  }
}
@media (max-width: 600px) {
  .title { font-size: 2rem; }
  .subtitle { font-size: 1rem; }
  .start-btn { font-size: 1.1rem; padding: 0.8rem 2.5rem; }
}
</style> 