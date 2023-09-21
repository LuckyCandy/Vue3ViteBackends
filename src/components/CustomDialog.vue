<!-- 模板部分 -->
<template>
    <div>
        <el-dialog :width="width" v-model="isShow" :show-close="false" :close-on-click-modal="false" :append-to-body="true" destroy-on-close class="custom-dialog" :before-close="handleClose">
            <!-- 弹窗头部 -->
            <template #header="{ close, titleId, titleClass }">
                <div class="custom-header">
                    <h4 :id="titleId" :class="titleClass" style="color: white;">{{ title }}</h4>
                    <el-icon @click="close" size="24px">
                        <Close />
                    </el-icon>
                </div>
            </template>
            <!-- 弹窗中间body -->
            <el-scrollbar>
                <slot />
            </el-scrollbar>
            <!-- 弹窗底部 -->
            <template v-if="footer" #footer>
                <span class="dialog-footer">
                    <el-button @click="close">取消</el-button>
                    <el-button type="primary" @click="saveSubmit" :loading="isLoading">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template> 

<script setup lang="ts">
import { ref } from "vue";
import { Close } from '@element-plus/icons-vue'

// 是否显示
const isShow = ref(false)

// 加载中
const isLoading = ref(false)

// 定义属性
let props = defineProps({
    title: {
        type: String,
        default: ""
    },
    footer: {
        type: Boolean,
        default: true
    },
    width: {
        type: String,
        default: "550px"
    }
});


const title = ref(props.title);
let emits = defineEmits(['on-close', 'on-submit']);

//销毁
const close = () => {
    isShow.value = false;
    isLoading.value = false
    emits('on-close');
}

const handleClose = (done: () => void) => {
    close()
    done()
}

const open = () => {
    isLoading.value = false
    isShow.value = true;
}

const stopLoading = () => isLoading.value = false


const outterClose = () => {
    isLoading.value = false
    isShow.value = false;
}
//保存表单方法
const saveSubmit = () => {
    isLoading.value = true
    emits('on-submit');
}

defineExpose({
    open,
    outterClose,
    stopLoading
})


</script>

<style>
.custom-dialog .el-dialog__header {
    padding: 0;
    padding-bottom: 0;
    margin-right: 0;
}

.custom-dialog .el-dialog__footer {
    padding: 8px 10px;
    background-color: var(--vt-c-layout-content-background);
    border-top: 1px solid white;
}

.custom-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40px;
    padding: 8px 20px;
    background: var(--vt-c-layout-header-background);
}

.custom-header .right-btn {
    height: 40px;
    cursor: pointer;
}

.custom-header .right-btn .el-icon {
    margin-right: 10px;
    height: 100%;
}

.custom-header .right-btn .el-icon:hover {
    color: #fff000;
}

.form-body {
    padding-right: 120px;
    height: 500px;
    margin-bottom: 52px;
}

.form-body-new {
    padding-right: 120px;
    height: 750px;
    margin-bottom: 52px;
}
</style>


