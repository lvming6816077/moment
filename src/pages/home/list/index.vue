
<template>
    <div class="list-content" @touchstart="touchstart($event)">
        <scrollView @loadCallback="loadCallback" :isend="isend" :readyToLoad="readyToLoad" @scroll="scroll">
            <ul>
                <li v-for="(item,index) in dataList" :key="index">
                    <postItem :data="item"></postItem>
                </li>
            </ul>
        </scrollView>
    </div>
</template>
<script setup>
import postItem from '@/components/postItem'
import service from '@/utils/service'

import scrollView from '@/components/scrollView'
import formatTime from '@/utils/formatTime'
import mitt from "@/utils/mitt";

import { computed, reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

let isend = ref(false)
let readyToLoad = ref(true)
let lessDataFlag = ref(false)
let pageStart = computed(()=>store.state.wecirclePage)


let dataList = computed(()=>store.state.wecircleDataList)

const router = useRouter()
const store = useStore()

onMounted(() => {
    // 第一次进入，要发起请求
    if (!dataList.value.length) {
        refresh()
    }
    // 刚发表完成，立刻刷新一下列表
    if (router.justPub) {
        refresh()
        router.justPub = false
    }
})

const refresh = () => {
    store.dispatch('setWecircleDataList', { first: true })
    fetchData()
}
defineExpose({
    refresh:refresh
})

const fetchData = async () => {
    // 是否可以发起下一次滚动加载请求的标志位
    readyToLoad.value = false
    // 拉取数据
    let resp = await service.get('post/getcirclepost', {
        pageStart: pageStart.value
    })
    // 对数据做一下处理
    formatData(resp.data)
}

const formatData = async (result) => {
    let array = []
    result.forEach(item => {
        array.push({
            id: item._id, // post的id
            avatar: item.user.avatar, // 头像url
            nickname: item.user.nickname, // 昵称
            content: item.content, // 内容
            piclist: item.picList, // 图片内容
            comments: item.comments, // 评论数据
            time: formatTime(new Date(item.create).getTime() / 1000), // 将后台返回的GMT时间转变成本地时间
            isLike: item.isLike, // 是否本人已经点赞
            likes: item.likes, // 点赞的数据
            user: item.user// 发表者的数据
        })
    })

    // 赋值
    store.dispatch('setWecircleDataList',array)
    

    // 如果返回的数据为空，证明没有数据了，就把停止滚动加载标志位只为true
    if (result.length === 0) {
        isend.value = true
    }

    // 如果第一页并且第一屏的数据太少，就自动再发一次请求，避免内容高度不够，无法触发滚动加载
    if (pageStart.value === 0 && result.length < 4 && !lessDataFlag.value) {
        loadCallback()
        lessDataFlag.value = true
    }
    // 重制标志位
    readyToLoad.value = true
}

const loadCallback = () => {
    // 页数加一
    store.dispatch('setWecirclePage',pageStart.value + 1)

    fetchData()
}

const scroll = (top) => {
    if (top <= 100) {
        mitt.emit('hideHeader')
    } else {
        mitt.emit('showHeader')
    }
}
const touchstart = (evt) =>{
      if (evt.target.classList.contains('opera-box')) {
        return
      }
      if (evt.target.classList.contains('comment-icon') || evt.target.classList.contains('comment-text')) {
        return
      }
      if (evt.target.classList.contains('like-icon') || evt.target.classList.contains('like-text')) {
        return
      }
      // 在开始滚动时 要把 评论输入框和 点赞评论面板 隐藏
      store.dispatch('closeCLPanel', true)
      mitt.emit('showInput', {flag:false, currentData:null})
}
</script>

<style scoped>
.list-content {
    background-color: #fff;
}
</style>
