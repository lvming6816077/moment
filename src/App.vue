<template>
    <router-view v-slot="{ Component }">
        <transition  :enter-active-class="transObj.transitionNameIn" :leave-active-class="transObj.transitionNameOut" :duration="transObj.duration">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script setup>


import { onMounted, reactive,watch } from "vue"
import os from './utils/os'
import { onBeforeRouteUpdate,useRouter,useRoute } from "vue-router"

const transObj = reactive({
    transitionNameOut: '',
    transitionNameIn: '',
    duration: 0
})

const router = useRouter()


onMounted(()=>{
    window.windowHeightOrgin = window.innerHeight
    window.keyboardHeight = os.getKeyBoardHeightDefault() - (window.screen.height - window.windowHeightOrgin)
})

const route = useRoute()
watch(()=>route.name,(to, from)=>{

    // 首次进入首页
    if (!from) {
        transObj.duration = 0
        return
    }
    // 持续时间
    transObj.duration = 500
    // 从下往上切换
    if (to === 'publish' || to === 'login') {
      transObj.transitionNameIn = 'animated faster slideInUp'
      transObj.transitionNameOut = ''
    } else if (from === 'publish' || from === 'login') {
        transObj.transitionNameIn = ''
        transObj.transitionNameOut = 'animated faster slideOutDown'
    } else { // 从左往右切换

      // 后退
      if (router.backFlag) {
        transObj.transitionNameOut = 'animated faster slideOutRight'
        transObj.transitionNameIn = 'animated faster slideInLeft'
      } else { // 前进
        transObj.transitionNameIn = 'animated faster slideInRight'
        transObj.transitionNameOut = 'animated faster slideOutLeft'
      }
    }
    // 重置返回的标志位
    router.backFlag = false
})


</script>


<style scoped>
.slideOutRight,.slideOutLeft {
  position: absolute;
  left: 0;
  right: 0;
  bottom:0;
  top: 0;
}

</style>
