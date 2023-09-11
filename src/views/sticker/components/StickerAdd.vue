<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
    <CustomDialog :width="dialogWidth" v-loading="isLoading" ref="dialogRef" title="新增贴贴乐" @on-close="clearData"
        @on-submit="handleSubmit">
        <el-form :model="addData" label-width="140px" ref="formRef" :rules="addRules">
            <el-form-item label="名称：" prop="name">
                <el-input v-model="addData.name" :style="inputStyle" />
            </el-form-item>
            <el-form-item label="贴图顺序：" prop="sequenceNumDesc">
                <el-radio-group v-model="sequenceNumDesc">
                    <el-radio-button label="一" />
                    <el-radio-button label="二" />
                    <el-radio-button label="三" />
                    <el-radio-button label="四" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="贴图：" prop="stickerImgUrl">
                <el-input v-model="addData.stickerImgUrl" readonly @click="() => openUploaddialog('stickerImgUrl')" />
            </el-form-item>
            <el-form-item label="贴图缩略图：" prop="stickerThumbnailUrl">
                <el-input v-model="addData.stickerThumbnailUrl" readonly @click="() => openUploaddialog('stickerThumbnailUrl')" />
            </el-form-item>
        </el-form>
        <!-- 文件上传组件 -->
        <CustomUpload ref="uploadDialogRef" @upload-ok="handleUploadOk" />
    </CustomDialog>
</template>

<script setup lang="ts">
import CustomDialog from '@/components/CustomDialog.vue';
import { reactive, ref, watch } from 'vue';
import { createSticker, updateSticker } from '@/apis/sticker'
import type { FormInstance, FormRules } from 'element-plus'
import CustomUpload from '@/components/CustomUpload.vue';

type DialogCtx = InstanceType<typeof CustomDialog>
type UploadDialogCtx = InstanceType<typeof CustomUpload>

interface AddArPointRule {
    id: number
    name: string
    stickerImgUrl: string
    sequenceNum: number
    stickerThumbnailUrl: string
}

let emits = defineEmits(['success']);
let uploadProps = ""

const sequenceNumMap = {
    "一": 1, "二": 2, "三": 3, "四": 4
}
const inputStyle = {
    fontSize: '18px', letterSpace: '1px'
}
const editMode = ref(false)
const dialogWidth = ref("600px")

const addData = reactive<AddArPointRule>({
    id: 0, name: '', stickerImgUrl: '', stickerThumbnailUrl: '', sequenceNum: 1
})

const addRules = reactive<FormRules<AddArPointRule>>({
    name: [{ required: true, message: '请输入名称！', trigger: 'blur' }],
    stickerImgUrl: [{ required: true, message: '请上传贴图！', trigger: 'change' }],
    stickerThumbnailUrl: [{ required: true, message: '请上传缩略图！', trigger: 'change' }],
})

const formRef = ref<FormInstance>()
const dialogRef = ref<null | DialogCtx>(null)
const uploadDialogRef = ref<null | UploadDialogCtx>(null)
const sequenceNumDesc = ref("一")

const clearData = () => {
    addData.id = 0
    addData.name = ""
    addData.stickerImgUrl = ""
    addData.stickerThumbnailUrl = ""
    addData.sequenceNum = 1
}

const isLoading = ref(false)

const open = () => {
    dialogRef.value?.open()
}

const openForEdit = (data: any) => {
    editMode.value = true
    addData.id = data.id
    addData.name = data.name
    addData.stickerImgUrl = data.stickerImgUrl
    addData.stickerThumbnailUrl = data.stickerThumbnailUrl
    addData.sequenceNum = data.sequenceNum
    sequenceNumDesc.value = addData.sequenceNum == 1 ? "一" : (addData.sequenceNum == 2 ? "二" : (addData.sequenceNum == 3 ? "三" : "四"))
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
    addData[uploadProps] = link
}


const handleSubmit = () => {
    formRef.value?.validate((valid: any, fields: any) => {
        if (valid) {
            if (editMode.value) {
                updateSticker(addData).then(() => {
                    clearData()
                    dialogRef.value?.outterClose()
                    emits('success')
                }).catch(() => {
                    dialogRef.value?.stopLoading()
                })
            } else {
                createSticker(addData).then(() => {
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

watch([sequenceNumDesc], ([ns], [os]) => {
    addData.sequenceNum = sequenceNumMap[ns]
})

defineExpose({
    open,
    openForEdit
})

</script>