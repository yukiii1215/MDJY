<template>
  <div class="home-container">
    <div class="lines-bg">
      <div v-for="i in 10" :key="i" class="line" :style="{ '--i': i }"></div>
    </div>
    <div class="content">
      <h1 class="title">测一测<br />你命定的结艺守护符</h1>
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
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('@/resources/home.png') no-repeat center/cover;
    transform: scale(1.1);
    animation: bgFloat 20s ease-in-out infinite;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2));
    backdrop-filter: blur(3px);
  }
}

@keyframes bgFloat {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(1deg); }
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
    width: calc(100% - var(--i) * 4%);
    height: calc(100% - var(--i) * 8%);
    border: 1.5px solid rgba(255,255,255,0.15);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(calc(1 - var(--i)*0.04));
    animation: lineFloat 6s cubic-bezier(.4,0,.2,1) infinite;
    animation-delay: calc(var(--i) * 0.3s);
  }
}

@keyframes lineFloat {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8) rotate(0deg); }
  10% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.1) rotate(5deg); }
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  padding: 0 1rem;
  animation: contentFloat 3s ease-in-out infinite;
}

@keyframes contentFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title {
  color: #fff;
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1.2;
  margin-bottom: 0.7rem;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
  transform: perspective(500px) rotateX(5deg);
}

.subtitle {
  color: #fff;
  font-size: 0.95rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transform: perspective(500px) rotateX(-5deg);
}

.start-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.8);
  color: #fff;
  font-size: 1.1rem;
  border-radius: 1.5rem;
  padding: 0.7rem 2.2rem;
  font-weight: 600;
  letter-spacing: 3px;
  cursor: pointer;
  box-shadow: 0 4px 30px rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  outline: none;
  position: relative;
  overflow: hidden;
  transform: perspective(500px) rotateX(0deg);
  &:hover {
    background: rgba(255,255,255,0.9);
    color: #111;
    transform: perspective(500px) rotateX(5deg) scale(1.05);
    box-shadow: 0 8px 40px rgba(255,255,255,0.2);
  }
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
      rgba(255,255,255,0.1),
      transparent
    );
    transform: rotate(45deg);
    animation: btnShine 3s infinite;
  }
}

@keyframes btnShine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

@media (max-width: 414px) {
  .home-container {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
}
</style> 