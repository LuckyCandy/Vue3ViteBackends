<template>
    <CustomDialog v-loading="isLoading" ref="userDialogRef" title="新增用户" @on-close="clearUserData"
        @on-submit="handleSubmit">
        <el-form :model="addUserData" label-width="80px" ref="formRef" :rules="addUserRules">
            <el-form-item label="用户名：" prop="name">
                <el-input v-model="addUserData.name" :style="inputStyle"/>
            </el-form-item>
            <el-form-item label="手机号：" prop="phone">
                <el-input v-model="addUserData.phone" :style="inputStyle"/>
            </el-form-item>
            <el-form-item label="新密码：" prop="password">
                <el-input v-model="addUserData.password" :style="inputStyle"/>
            </el-form-item>
        </el-form>
    </CustomDialog>
</template>

<script setup lang="ts">
import CustomDialog from '@/components/CustomDialog.vue';
import { reactive, ref } from 'vue';
import { createUser } from '@/apis/user'
import type { FormInstance, FormRules } from 'element-plus'

type UserDialogCtx = InstanceType<typeof CustomDialog>

interface UserRule {
    name: string
    phone: string
    password: string
}

let emits = defineEmits(['success']);

const inputStyle = {
    fontSize: '18px', letterSpace: '1px'
}

const addUserData = reactive<UserRule>({
    name: '', phone: '', password: ''
})

const addUserRules = reactive<FormRules<UserRule>>({
    name: [{ required: true, message: '请输入用户名！', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码！', trigger: 'blur' }, { min: 6, max: 12, message: '密码长度请控制在6~12位', trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入手机号！', trigger: 'blur' },
        {
            validator: (rule: any, value: any, callback: any) => {
                const regex = /^1[0-9]{10}$/;
                return regex.test(value) ? callback() : callback(new Error('请输入正确的手机号！'))
            }, trigger: 'blur'
        }
    ]
})

const formRef = ref<FormInstance>()
const userDialogRef = ref<null | UserDialogCtx>(null)

const clearUserData = () => {
    addUserData.name = ""
    addUserData.phone = ""
    addUserData.password = ""
}

const isLoading = ref(false)

const open = () => {
    userDialogRef.value?.open()
}


const handleClose = () => {
    clearUserData()
}

const handleSubmit = () => {
    formRef.value.validate((valid: any, fields: any) => {
        if (valid) {
            isLoading.value = true
            createUser(addUserData.name, addUserData.phone, addUserData.password).then(res => {
                clearUserData()
                emits('success')
                userDialogRef.value?.outterClose()
            }).finally(() => isLoading.value = false)
        }
    })
    return;

}

defineExpose({
    open
})

</script>