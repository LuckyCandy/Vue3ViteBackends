<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import UserAddDialog from './components/UserAddDialog.vue';
import { fetchUserList, resetPassword } from '@/apis/user'

type UserModelCtx = InstanceType<typeof UserAddDialog>

const searchPhone = ref('')
const tableData = ref<any>([])
const loadingData = ref(false)
const userModelCtx = ref<null | UserModelCtx>(null)

const searchData = () => {
  loadingData.value = true
  fetchUserList(searchPhone.value).then(res => tableData.value = res.data.data).finally(() => loadingData.value = false)
}

const doResetPassword = (item: any) => {
  console.log(1111, item)
  ElMessageBox.prompt(`正在修改${item.name}的密码`, '注意', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^.{6,12}$/,
    inputErrorMessage: '请输入6~12位之间长度的密码'
  }).then(({ value }) => {
    resetPassword(item.id, value).then(() => {
      ElMessage({
        type: 'success',
        message: `${item.name}的密码修改为:${value}`,
      })
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消修改密码操作~',
    })
  })
}

onMounted(searchData)

</script>

<template>
  <div class="search-table">
    <!-- 新增用户弹窗 -->
    <UserAddDialog ref="userModelCtx" @success="searchData"></UserAddDialog>

    <el-breadcrumb separator="/">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/sys/user' }">用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="search-area">
      <span style="color: #909399; line-height: 30px;">手机号:</span>
      <el-input class="search-input" v-model="searchPhone" placeholder="手机号" clearable />
      <el-button type="primary" :icon="Search" @click="searchData" :disabled="loadingData">查询</el-button>
      <div style="flex:2; text-align: right;">
        <el-button type="success" @click="() => userModelCtx?.open()">新增</el-button>
      </div>
    </div>
    <div class="search-content">
      <el-table :data="tableData" style="width: 100%" v-loading="loadingData" stripe size="large" empty-text="暂无用户">
        <el-table-column prop="name" label="用户名" min-width="150" />
        <el-table-column prop="phone" label="手机号" width="160" />
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"/>
        <el-table-column prop="updateTime" label="更新时间" width="200" align="center"/>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-button @click.prevent="doResetPassword(scope.row)" type="danger" size="small" :style="{ fontWeight: 'bold' }">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

  