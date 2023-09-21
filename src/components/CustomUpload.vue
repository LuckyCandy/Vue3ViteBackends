<template>
    <CustomDialog :width="dialogWidth" ref="dialogRef" title="文件上传" @on-submit="handleSubmit" @on-close="clearData">
        <div class="custom-upload">
            <el-button type="primary" @click="inputRef?.click()">
                选择本地文件<el-icon class="el-icon--right">
                    <Upload />
                </el-icon>
            </el-button>
            <el-image :src="fileContent" fit="contain" v-if="bucket == 0" loading="eager">
                <template #error>
                    <div class="image-slot">
                        <el-icon>
                            <Picture />
                        </el-icon>
                    </div>
                </template>
            </el-image>
            <span v-if="bucket == 3">{{ uploadFile?.name }}</span>
        </div>
        <input ref="inputRef" type="file" hidden @change="handleFileChoose">
    </CustomDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Upload, Picture } from '@element-plus/icons-vue'
import CustomDialog from './CustomDialog.vue';
import { fileUploadToken } from '@/apis/file'
import * as qiniu from 'qiniu-js';

type DialogCtx = InstanceType<typeof CustomDialog>

const dialogRef = ref<null | DialogCtx>(null)

const dialogWidth = ref("400px")
const fileContent = ref<any>("")
const fileName = ref("")
const inputRef = ref<any>(null)
const bucket = ref(1)
const uploadFile = ref<any>(null)

let emits = defineEmits(['upload-ok'])

const handleFileChoose = (event: any) => {
    uploadFile.value = event.target.files[0]
    console.log(uploadFile.value.type)
    fileName.value = uploadFile.value.name
    if (uploadFile.value.type == 'image/png' || uploadFile.value.type == 'image/jpeg') {
        bucket.value = 0
        const reader = new FileReader();
        reader.onload = (e) => fileContent.value = e.target?.result
        reader.readAsDataURL(uploadFile.value);
    } else {
        bucket.value = 3
    }
}

const clearData = () => {
    fileContent.value = ""
    uploadFile.value = null
    dialogRef.value?.outterClose()
    bucket.value = 1
    inputRef.value.value = ''
}

const handleSubmit = () => {
    if (null === uploadFile.value) {
        clearData()
        return;
    }
    fileUploadToken(bucket.value, uploadFile.value.name).then(res => {
        const resp = res.data.data
        qiniu.upload(uploadFile.value, resp.key, resp.upToken, { fname: uploadFile.value.name }, { useCdnDomain: true, forceDirect: true }).subscribe({
            next: () => { },
            error: err => {
                dialogRef.value?.stopLoading()
                ElMessage.error(`上传失败：${err}`)
            },
            complete: () => {
                clearData()
                emits('upload-ok', `${resp.domainName}/${resp.key}`)
            }
        })
    })
}

const open = (link: string | null) => {
    if (link && link !== "") {
        fileName.value = link
        if (link.endsWith("png") || link.endsWith("jpg") || link.endsWith("jpeg") || link.endsWith("PNG") || link.endsWith("JPG") || link.endsWith("JPEG")) {
            bucket.value = 0
            fileContent.value = link
        } else {
            bucket.value = 3
        }

    }
    dialogRef.value?.open()
}

defineExpose({
    open
})
</script>

<style>
.custom-upload {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.custom-upload .el-image {
    height: 300px;
    border: 1px dotted gray;
    border-radius: 6px;
    font-size: 80px;
}
</style>