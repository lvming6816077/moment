<template>

    <div class="scrollview">
        <slot></slot>
        <div class="weui-loadmore" v-show="!isend">
            <i class="weui-loading"></i>
            <span class="weui-loadmore__tips">正在加载</span>
        </div>
        <div class="weui-loadmore weui-loadmore_line weui-loadmore_dot" v-show="isend">
            <span class="weui-loadmore__tips"></span>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, onBeforeMount, nextTick, onMounted, onUnmounted } from "vue";


const props = defineProps({
    readyToLoad: {
        type: Boolean,
    },
    isend: {
        type: Boolean,
    },
});
const emit = defineEmits(['loadCallback','scroll'])

const onLoadPage = () => {
    // 获取clientHeight
    let clientHeight = document.documentElement.clientHeight
    // 获取scrollHeight
    let scrollHeight = document.body.scrollHeight
    // 获取scrollTop这里注意要兼容一下，某些机型的document.documentElement.scrollTop可能为0
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop

    // 通知父组件触发滚动事件
    emit('scroll', scrollTop)
    // 通知距离底部还有多少px的阈值
    let proLoadDis = 60
    // 判断是否页面滚动到底部
    if ((scrollTop + clientHeight) >= (scrollHeight - proLoadDis)) { // 560 1915
        // 是否已经滚动到最后一页
        if (!props.isend) {
            // 判断在一个api请求未完成时不能触发第二次滚动到底部的回调
            if (!props.readyToLoad) {
                return
            }

            // 通知父组件触发滚动到底部事件
            emit('loadCallback')
        }
    }
}

onMounted(() => {
    window.addEventListener('scroll', onLoadPage)
})
onUnmounted(() => {
    window.removeEventListener('scroll', onLoadPage)
})

</script>

<style scoped>

</style>
