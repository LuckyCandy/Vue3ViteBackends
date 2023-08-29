<template>
  <body id="poster">
    <el-form class="login-container" label-position="left" label-width="0px">
      <h3 class="login_title">系统登录</h3>
      <el-form-item>
        <el-input :input-style="boldInput" type="text" v-model="loginForm.phone" auto-complete="off" placeholder="手机"
          ref="phoneInputRef"></el-input>
      </el-form-item>

      <el-form-item>
        <el-input :input-style="boldInput" type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="doLogin"
          :disabled="!loginDisabled" :loading="isLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </body>
</template>
 
 
<script lang="ts" setup>
import { reactive, ref, watchEffect } from 'vue';
import { loginRequest } from '@/apis/login'
import router from '@/router';

// 登录表单
const loginForm = reactive({
  phone: '',
  password: ''
})

// 手机输入
const phoneInputRef = ref<any>()
// 是否可登录
const loginDisabled = ref(true)
const isLogin = ref(false)

const boldInput = {
  fontWeight: 'bold', letterSpacing: '1px'
}

watchEffect(() => {
  loginDisabled.value = loginForm.phone.length > 0 && loginForm.password.length > 0
})

const doLogin = () => {
  isLogin.value = true
  const regex = /^1[0-9]{10}$/;
  if (!regex.test(loginForm.phone)) {
    phoneInputRef.value.focus()
    ElMessage.error('请输入正确的手机号！')
    return
  }
  loginRequest(loginForm.phone, loginForm.password).then((res) => {
    const response = res.data.data
    setTimeout(() => {
      window.localStorage.setItem("FOSHAN-TOKEN", response.token)
      router.replace('/sys/user')
    }, 800);
  }).finally(() => isLogin.value = false)
}
</script>
 
<style scoped>
#poster {
  background: url("../assets/imgs/background.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

#poster::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  filter: brightness(0.4)
}

.login-container {
  position: absolute;
  top: 40%;
  left: 50%;
  border-radius: 15px;
  background-clip: padding-box;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  z-index: 2;
  transform: translate(-50%, -50%);
}

.login_title {
  margin: 0px auto 20px auto;
  text-align: center;
  color: #505458;
  font-size: x-large;
  font-weight: 800;
}
</style>