
<template>
    <div class="container">
        <navHeader title="个人信息" />
        <div class="weui-cells content">
            <div class="panel person-info">
                <a class="weui-cell" href="javascript:;">
                    <img class="avatar" @click="showAvatar(state.currentUser.avatar)" :src="state.currentUser.avatar">
                    <div class="person-info-right">
                        <p :class="state.currentUser.gender == '1' ? 'male nickname' : 'female nickname' ">
                            {{state.currentUser.nickname}}</p>
                        <p class="phone">Tel:{{state.currentUser.phoneNum}}</p>
                    </div>
                </a>
                <a v-if="state.currentUser.desc" class="weui-cell weui-cell_access" href="javascript:;">
                    <div class="weui-cell__bd">
                        <p class="desc">个性签名</p>
                    </div>
                    <div class="desc-text">{{state.currentUser.desc}}</div>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>

// @ is an alias to /src
import navHeader from '@/components/navHeader'
import service from '@/utils/service'

import { computed, reactive, ref, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

let state = reactive({currentUser:{}})

onBeforeMount(async () => {
    let resp = await service.get('users/userinfo', {
        userId: route.query.id
    })

    if (resp.code === 0) {
        state.currentUser = resp.data
    }
})

const showAvatar = (url) => {
    // 初始化Slider 实例

    new Slider({
        list: [{ img: url, width: 300, height: 300 }],
        page: 0
    })
}



</script>
<style scoped>
.container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ededed;
}

.nickname {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    position: relative;
    display: inline-block;
}

.phone {
    font-size: 14px;
    color: #727272;
}

.nickname::after {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    position: absolute;
    background-size: cover;
    right: -20px;
    top: 4px;
}

.male::after {
    background-image: url("./img/man.png");
}

.female::after {
    background-image: url("./img/female.png");
}

.content {
    margin-top: 64px;
    background-color: #ededed;
    min-height: 400px;
}

.content::before {
    display: none;
}

.panel {
    background-color: #fff;
    margin-bottom: 10px;
}

.panel:last-child {
    margin-bottom: 0px;
}

.cell__ft {
    color: #7f7f7f;
}

.avatar {
    display: block;
    width: 65px;
    height: 65px;
    border-radius: 6px;
    margin-right: 24px;
    margin-left: 10px;
}

.person-info {
    text-align: left;
}

.name {
    color: #576b95;
}

.msg-icon {
    display: inline-block;
    margin-right: 0.8vw;
    width: 20px;
    height: 20px;
    background-size: cover;
    vertical-align: -3px;
    background-image: url("./img/message.png");
}

.desc {
    padding-left: 10px;
}

.desc-text {
    color: #999;
}
</style>
