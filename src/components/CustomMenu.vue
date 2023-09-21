<script setup lang="ts">
import router from '@/router';
import { UserFilled, Guide, CameraFilled } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';

const currentPathIndex = ref('')

const handleMenuSelect = (item: any) => {
  currentPathIndex.value = item.index
}

onMounted(() => {
  currentPathIndex.value = router.currentRoute.value.path
})
</script>

<template>
  <el-menu class="layout-menu" default-active="/user" background-color="#fff" text-color="black" active-text-color="#007d9c" router>
    <el-menu-item index="/sys/user" @click="handleMenuSelect" :class="[currentPathIndex == '/sys/user' ? 'activated':'inactivate']">
      <el-icon>
        <UserFilled />
      </el-icon>
      <span>用户管理</span>
    </el-menu-item>
    <el-menu-item index="/sys/ar-point" @click="handleMenuSelect" :class="[currentPathIndex == '/sys/ar-point' ? 'activated':'inactivate']">
      <el-icon>
        <Guide />
      </el-icon>
      <span>打卡点位</span>
    </el-menu-item>
    <el-menu-item index="/sys/sticker" @click="handleMenuSelect" :class="[currentPathIndex == '/sys/sticker' ? 'activated':'inactivate']">
      <el-icon>
        <CameraFilled />
      </el-icon>
      <span>贴贴乐</span>
    </el-menu-item>
  </el-menu>
</template>
<style scoped>
.el-menu {
  border-right: none;
}

.el-menu-item {
  border-right: none;
  color: white;
}
.el-menu-item span {
  margin-top: 3px;
}

.layout-menu .activated {
  color: #2d8cf0;
  background: #f0faff;
  border-right: 2px solid #2d8cf0;
}

.layout-menu .inactivate {
  background-color: unset;
  color: #515a6e;
}

</style>
