<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
    <CustomDialog :width="dialogWidth" v-loading="isLoading" ref="dialogRef" title="新增点位" @on-close="clearData"
        @on-submit="handleSubmit">
        <el-form :model="addData" label-width="110px" ref="formRef" :rules="addRules">
            <el-form-item label="名称：" prop="title">
                <el-input v-model="addData.title" :style="inputStyle" />
            </el-form-item>
            <el-form-item label="描述：" prop="description">
                <el-input type="textarea" v-model="addData.description" />
            </el-form-item>
            <el-form-item label="点位类型：" prop="typeDesc">
                <el-radio-group v-model="typeDesc">
                    <el-radio-button label="触发识别" />
                    <el-radio-button label="跟踪识别" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="点位顺序：" prop="sequenceNumDesc">
                <el-radio-group v-model="sequenceNumDesc">
                    <el-radio-button label="一" />
                    <el-radio-button label="二" />
                    <el-radio-button label="三" />
                    <el-radio-button label="四" />
                    <el-radio-button label="五" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="模型缩放比：" prop="modelScale">
                <el-input-number v-model="addData.modelScale" :min="1" :max="100" />
            </el-form-item>
            <el-form-item label="上传模型：" prop="modelUrl">
                <el-input v-model="addData.modelUrl" readonly @click="() => openUploaddialog('modelUrl')" />
            </el-form-item>
            <el-form-item label="识别图：" prop="identityImgUrl">
                <el-input v-for="(item, index) in addData.identityImgUrl" :key="index" :value="item" readonly :style="{marginBottom: '6px'}">
                    <template #append>
                        <el-button :icon="Delete" @click="deleteIdentityImgs(index)"/>
                    </template>
                </el-input>
                <el-button @click="() => openUploaddialog('identityImgUrl')">上传识别图</el-button>
            </el-form-item>
            <el-form-item label="幸运签图：" prop="luckyImgUrl">
                <el-input v-model="addData.luckyImgUrl" readonly @click="() => openUploaddialog('luckyImgUrl')" />
            </el-form-item>
            <el-form-item label="扫描缩略图：" prop="scanThumbnailUrl">
                <el-input v-model="addData.scanThumbnailUrl" readonly @click="() => openUploaddialog('scanThumbnailUrl')" />
            </el-form-item>
        </el-form>
        <!-- 文件上传组件 -->
        <CustomUpload ref="uploadDialogRef" @upload-ok="handleUploadOk" />
    </CustomDialog>
</template>

<script setup lang="ts">
import CustomDialog from '@/components/CustomDialog.vue';
import { reactive, ref, watch } from 'vue';
import { createArPoint, updateArPoint } from '@/apis/ar-point'
import type { FormInstance, FormRules } from 'element-plus'
import CustomUpload from '@/components/CustomUpload.vue';
import { Delete } from '@element-plus/icons-vue'

type DialogCtx = InstanceType<typeof CustomDialog>
type UploadDialogCtx = InstanceType<typeof CustomUpload>

interface AddArPointRule {
    id: number
    title: string
    description: string
    type: number,
    sequenceNum: number,
    modelScale: number,
    modelUrl: string,
    identityImgUrl: Array<string>
    luckyImgUrl: string
    scanThumbnailUrl: string
}

let emits = defineEmits(['success']);

let uploadProps = ""
const typeMap = {
    "触发识别": 1, "跟踪识别": 2
}
const sequenceNumMap = {
    "一": 1, "二": 2, "三": 3, "四": 4, "五": 5
}
const inputStyle = {
    fontSize: '18px', letterSpace: '1px'
}
const editMode = ref(false)
const dialogWidth = ref("600px")

const addData = reactive<AddArPointRule>({
    id: 0, title: '', description: '', modelUrl: '', type: 1, sequenceNum: 1, modelScale: 100, identityImgUrl: [], luckyImgUrl: '', scanThumbnailUrl: ''
})

const addRules = reactive<FormRules<AddArPointRule>>({
    title: [{ required: true, message: '请输入名称！', trigger: 'blur' }],
    description: [{ required: true, message: '请输入描述！', trigger: 'blur' }, { min: 1, max: 255, message: '最大长度255', trigger: 'blur' }],
    modelUrl: [{ required: true, message: '请上传模型！', trigger: 'change' }],
    identityImgUrl: [{ required: true, message: '请上传识别图！', trigger: 'change' }],
    scanThumbnailUrl: [{ required: true, message: '请上传扫描缩略图！', trigger: 'change' }],
    luckyImgUrl: [{ required: true, message: '请上传幸运签图！', trigger: 'change' }],
})

const formRef = ref<FormInstance>()
const dialogRef = ref<null | DialogCtx>(null)
const uploadDialogRef = ref<null | UploadDialogCtx>(null)
const typeDesc = ref("触发识别")
const sequenceNumDesc = ref("一")

const clearData = () => {
    console.log(111111111)
    addData.id = 0
    addData.title = ""
    addData.description = ""
    addData.modelUrl = ""
    addData.identityImgUrl = []
    addData.scanThumbnailUrl = ""
    addData.luckyImgUrl = ""
    addData.type = 1
    addData.sequenceNum = 1
    addData.modelScale = 100
}

const isLoading = ref(false)

const open = () => {
    dialogRef.value?.open()
}

const deleteIdentityImgs = (i: number) => {
    addData.identityImgUrl.splice(i, 1)
}

const openForEdit = (data: any) => {
    console.log(2222, data)
    editMode.value = true
    addData.id = data.id
    addData.title = data.title
    addData.description = data.description
    addData.modelUrl = data.modelUrl
    addData.identityImgUrl = data.identityImgUrl
    addData.scanThumbnailUrl = data.scanThumbnailUrl
    addData.luckyImgUrl = data.luckyImgUrl
    addData.type = data.type
    typeDesc.value = addData.type == 1 ? "触发识别" : "跟踪识别"
    addData.sequenceNum = data.sequenceNum
    sequenceNumDesc.value = addData.sequenceNum == 1 ? "一" : (addData.sequenceNum == 2 ? "二" : (addData.sequenceNum == 3 ? "三" : (addData.sequenceNum == 4 ? "四" : "五")))
    addData.modelScale = data.modelScale
    dialogRef.value?.open()
}

const openUploaddialog = (props: string) => {
    uploadProps = props
    if (props === "identityImgUrl") {
        uploadDialogRef.value?.open("")
    } else {
        uploadDialogRef.value?.open(addData[uploadProps])
    }

}

const handleUploadOk = (link: string) => {
    if (uploadProps === "identityImgUrl") {
        addData.identityImgUrl.push(link)
    } else {
        addData[uploadProps] = link
    }
}

const handleClose = () => {
    clearData()
}

const handleSubmit = () => {
    formRef.value?.validate((valid: any, fields: any) => {
        if (valid) {
            if (editMode.value) {
                updateArPoint(addData).then(() => {
                    clearData()
                    dialogRef.value?.outterClose()
                    emits('success')
                }).catch(() => {
                    dialogRef.value?.stopLoading()
                })
            } else {
                createArPoint(addData).then(() => {
                    clearData()
                    dialogRef.value?.outterClose()
                    emits('success')
                }).catch(() => {
                    dialogRef.value?.stopLoading()
                })
            }

        } else {
            dialogRef.value?.stopLoading()
        }
    })
    return;
}

watch([sequenceNumDesc, typeDesc], ([ns, nt], [os, ot]) => {
    addData.sequenceNum = sequenceNumMap[ns]
    addData.type = typeMap[nt]
})

defineExpose({
    open,
    openForEdit
})

</script>