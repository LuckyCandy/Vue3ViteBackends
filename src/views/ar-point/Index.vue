<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ArPointAdd from './components/ArPointAdd.vue'
import { fetchArPointList, removeArPoint } from '@/apis/ar-point'
import { clone } from '@/utils'


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

const editRow = (index: number) => {
  arPointModelCtx.value?.openForEdit(clone(tableData.value[index]))
}

const showModel = (index: number) => {
  const url = '/glb-viewer.html?model_link=' + encodeURIComponent(tableData.value[index].modelUrl);
  window.open(url, '_blank');
}

const deleteRow = (index: number) => {

  ElMessageBox.confirm(
    `确定要删除"${tableData.value[index].title}"吗?`,
    '操作提示',
    {
      confirmButtonText: '我要删除',
      cancelButtonText: '算了',
      type: 'error'
    }
  )
    .then(() => {
      removeArPoint(tableData.value[index].id).then(() => {
        ElMessage({
          type: 'success',
          message: '已删除成功',
        })
        searchData()
      })

    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除操作',
      })
    })
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
                <div class="item" v-for="(item, index) in scope.row.identityImgUrl" :key="index">
                  <el-image style="height: 200px" :src="item" fit="contain" lazy />
                  <el-divider>识别图({{ index + 1 }})</el-divider>
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
                  <!-- <babylon model="https://static-mkt.linylife.cn/3104e062-c9af-4708-a76c-0fb367f88e6a_tmtuca.glb"></babylon> -->
                  <!-- <el-descriptions-item label="模型链接">{{ scope.row.modelUrl }}</el-descriptions-item> -->
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
        <el-table-column prop="createTime" label="创建时间" width="200" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="200" align="center" />
        <el-table-column fixed="right" label="操作" width="240" align="center">
          <template #default="scope">
            <el-button type="info" size="small" :style="{ fontWeight: 'bold' }"
              @click.native.stop="showModel(scope.$index)">模型预览</el-button>
            <el-button type="primary" size="small" :style="{ fontWeight: 'bold' }"
              @click.native.stop="editRow(scope.$index)">编辑</el-button>
            <el-button type="danger" size="small" :style="{ fontWeight: 'bold' }"
              @click.native.stop="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

  