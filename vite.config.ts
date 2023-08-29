import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import dotenv from 'dotenv'


export default (mode: any) => {
  let pathStr = ".env"
  if (mode.mode !== null && mode.mode != undefined && mode.mode !== "") {
    pathStr += "."+mode.mode
  }
  console.log(pathStr)

  // 加载环境变量文件
  dotenv.config({ path: pathStr })
  return defineConfig({
    base: process.env.VITE_APP_BASE_URL,
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
