
<template>
    <div class="header-bar scale-1px" :class="[headerClass]">
        <p class="title">Moment</p>
        <div class="right-icon" @click="goPublish"></div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import mitt from "@/utils/mitt";


const router = useRouter()
const store = useStore()

let headerClass = ref('')

onMounted(() => {
    // 使用mitt 监听外界传来的动画事件
    mitt.on('showHeader', () => {
        headerClass.value = 'show'
    })

    mitt.on('hideHeader', () => {
        headerClass.value = ''
    })
})

const goPublish = () => {
    if (!store.state.currentUser._id) {
        router.push({
            name: 'login'
        })
        return
    }
    router.push({
        name: 'publish'
    })
}
</script>

<style scoped>
.header-bar {
    height: 57px;
    position: fixed;
    width: 100%;
    transition: all 400ms;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
}

.title {
    font-size: 4vw;
    font-weight: bold;
    margin-top: 16px;
    display: none;
}

.header-bar::after {
    display: none;
}

.header-bar.show::after {
    background-color: #ededed;
    display: block;
}

.header-bar.show {
    background-color: #ededed;

}

.header-bar.show .title {
    display: block;
}

.header-bar.show .right-icon {
    background-image: url("./img/photo_a.png");
}

.right-icon {
    width: 24px;
    height: 24px;
    position: absolute;
    right: 17px;
    top: 16px;
    background-image: url("./img/photo.png");
    background-size: cover;
    background-position: center center;
}
</style>
