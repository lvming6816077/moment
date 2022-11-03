
<template>
    <div class="header-bar scale-1px">
        <p class="title">{{ title }}</p>
        <div class="left-icon" @click="goBack"></div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const props = defineProps({
    title: {
        type: String,
    }
})

const goBack = () => {
    // 表示是返回的标志位
    router.backFlag = true
    router.back()
}

</script>
<style scoped>
.header-bar {
    height: 64px;
    position: fixed;
    width: 100%;
    top: 0;
    background-color: #eee;
    transform: translate3d(0, 0, 1px);
    z-index: 120;
}

.left-icon {
    width: 24px;
    height: 24px;
    position: absolute;
    left: 17px;
    top: 18px;
    background-image: url('./img/back.png');
    background-size: cover;
    background-position: center center;
}

.title {
    height: 100%;
    line-height: 64px;
    font-size: 17px;
    font-weight: bold;
}
</style>
