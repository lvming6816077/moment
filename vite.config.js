import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from "path";
import pxtovw from 'postcss-px-to-viewport'
import autoprefixer from 'autoprefixer'

const plugin_pxtovw = pxtovw({
    //这里是设计稿尺寸
    viewportWidth: 375, // 设计稿宽度
    viewportHeight: 667, // 设计稿高度
    unitPrecision: 3, // 精度，通过运算后vw的最大精度，3位小数
    viewportUnit: 'vw', // 单位，vw
})
const plugin_autofix = autoprefixer({
    overrideBrowserslist: [
        "Android 4.1",
        "iOS 7.1",
        "Chrome > 31",
        "ff > 31",
        "ie >= 8"
        //'last 2 versions', // 所有主流浏览器最近2个版本
    ],
    grid: true
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [plugin_pxtovw,plugin_autofix]
    }
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port:8080,
    proxy: {
      // 使用 proxy 实例
      '^/cgi': {
        target: 'https://app.nihaoshijie.com.cn',
        changeOrigin: true,
      }
    }
  }
})
