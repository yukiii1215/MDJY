<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
// App level setup
</script>

<style lang="scss">
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f7f7f9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  min-height: 100vh;
  min-width: 100vw;
  background: #f7f7f9;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 