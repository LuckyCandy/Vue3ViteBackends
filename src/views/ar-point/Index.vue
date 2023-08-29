<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ArPointAdd from './components/ArPointAdd.vue'
import { fetchArPointList } from '@/apis/ar-point'

type ArPointModelCtx = InstanceType<typeof ArPointAdd>

const expands = ref<any>([])
const tableData = ref<any>([])
const loadingData = ref(false)
const arPointModelCtx = ref<null | ArPointModelCtx>(null)

const searchData = () => {
  loadingData.value = true
  fetchArPointList().then(res => tableData.value = res.data.data).finally(() => loadingData.value = false)
}

const seqenceNumStyleMap = [
  '', 'success', 'info', 'danger', 'warning'
]
const seqenceNumStyle = (num: number) => {
  return seqenceNumStyleMap[num - 1]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const clickRowHandle = (row: any, column: any, event: any) => {
  if (expands.value.includes(row.id)) {
    expands.value = expands.value.filter((val: any) => val !== row.id);
  } else {
    expands.value.push(row.id);
  }
}

const editRow = (data: any) => {
  arPointModelCtx.value?.openForEdit(data)
}



onMounted(searchData)

</script>

<template>
  <div class="search-table">
    <!-- 新增用户弹窗 -->
    <ArPointAdd ref="arPointModelCtx" @success="searchData"></ArPointAdd>

    <el-breadcrumb separator="/">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/sys/ar-point' }">点位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="search-area">
      <el-button type="success" @click="searchData" :disabled="loadingData">刷新</el-button>
      <div style="flex:2; text-align: right;">
        
        <el-button type="primary" @click="() => arPointModelCtx?.open()">新增</el-button>
      </div>
    </div>
    <div class="search-content">
      <el-table row-key="id" :data="tableData" :expand-row-keys="expands" @row-click="clickRowHandle" style="width: 100%"
        v-loading="loadingData" stripe size="large">
        <el-table-column type="expand">
          <template #default="scope">
            <div class="expand-info">
              <div class="imgs">
                <div class="item">
                  <el-image style="height: 200px" :src="scope.row.identityImgUrl" fit="contain" lazy />
                  <el-divider>识别图</el-divider>
                </div>
                <div class="item">
                  <el-image style="height: 200px" :src="scope.row.luckyImgUrl" fit="contain" lazy />
                  <el-divider>幸运签图</el-divider>
                </div>
                <div class="item">
                  <el-image style="height: 200px" :src="scope.row.scanThumbnailUrl" fit="contain" lazy />
                  <el-divider>扫描缩略图</el-divider>
                </div>
              </div>
              <div>
                <el-descriptions direction="vertical" :column="2" border>
                  <el-descriptions-item label="点位描述">{{ scope.row.description }}</el-descriptions-item>
                  <el-descriptions-item label="模型链接">{{ scope.row.modelUrl }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" min-width="160">
          <template #default="scope">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.title" placement="top">
              {{ scope.row.title }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="类型" min-width="100" align="center">
          <template #default="scope">
            {{ scope.row.type == 1 ? '触发识别' : '跟踪识别' }}
          </template>
        </el-table-column>
        <el-table-column prop="sequenceNum" label="点位顺序" width="100" align="center">
          <template #default="scope">
            <el-tag class="mx-1" :type="seqenceNumStyle(scope.row.sequenceNum)" effect="light">
              {{ scope.row.sequenceNum }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sequenceNum" label="模型缩放比" width="120" align="center">
          <template #default="scope">
            {{ scope.row.modelScale }}%
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"/>
        <el-table-column prop="updateTime" label="更新时间" width="200" align="center"/>
        <el-table-column fixed="right" label="操作" width="80" align="center">
          <template #default="scope">
            <el-button type="danger" size="small" :style="{ fontWeight: 'bold' }" @click.native.stop="editRow(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

  