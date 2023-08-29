<script setup lang="ts">
import { RouterView } from 'vue-router'
import CustomMenu from '@/components/CustomMenu.vue'
import { SwitchButton } from '@element-plus/icons-vue'
import IconProjectLogo from '@/components/icons/IconProjectLogo.vue'
import router from '@/router';

const logout = () => {
  window.localStorage.removeItem("FOSHAN-TOKEN")
  router.replace("/login")
}
</script>

<template>
  <div class="custom-layout">
    <div class="custom-layout-header">
      <div class="left">
        <IconProjectLogo class="logo" />
        <span>佛山AR管理后台</span>
      </div>
      <div class="right">
        <el-button :icon="SwitchButton" @click="logout" text style="color: white; font-size: x-large; margin-top: 4px;"></el-button>
      </div>
    </div>
    <div class="custom-layout-content">
      <div class="menu">
        <CustomMenu></CustomMenu>
      </div>
      <div class="view">
        <RouterView />
      </div>
    </div>
    <div class="custom-layout-footer">© 2023 Publicis Groupe</div>
  </div>
</template>

<style scoped>
.custom-layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.custom-layout-header {
  display: flex;
  height: 60px;
  background: var(--vt-c-layout-header-background);
}

.custom-layout-header .left {
  display: flex;
  gap: 10px;
  padding: 10px 0 10px 20px;
}

.custom-layout-header .right {
  flex: 2;
  display: flex;
  gap: 10px;
  padding: 10px;
  justify-content: flex-end;
}

.custom-layout-header .right .el-button:hover {
  background-color: coral;
}

.custom-layout-header .left span {
  line-height: 30px;
  height: 30px;
  color: white;
  text-align: center;
  margin-top: 8px;
  font-size: 1.4rem;
  font-weight: bold;
}

.custom-layout-header .logo {
  vertical-align: middle;
}

.custom-layout-content {
  display: flex;
  width: 100vw;
  overflow: hidden;
  height: calc(100vh - 120px);
}

.custom-layout-content .menu {
  width: 200px;
  min-width: 200px;
  background-color: #fff;
}

.custom-layout-content .view {
  flex: 2;
  overflow: hidden;
  height: 100%;
}

.custom-layout-footer {
  height: 59px;
  background-color: var(--vt-c-layout-content-background);
  border-top: 1px solid var(--vt-c-layout-border-color);
  font-weight: bold;
  color: #515a6e;;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
