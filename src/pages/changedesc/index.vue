
<template>
    <div class="container">
        <navHeader title="修改个性签名" />
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <input class="weui-input" type="text" placeholder="请输入文本" v-model="desc" maxLength="20">
            </div>
        </div>
        <div class="weui-btn-area">
            <a class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips" @click="submit">确定</a>
        </div>
    </div>
</template>

<script setup>

import navHeader from '@/components/navHeader'

import service from '@/utils/service'
import { computed, reactive, ref, onBeforeMount, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();
let str = route.params&&route.params.desc ? route.params.desc.trim():''
let desc = ref(str);
const submit = async() => {
    let resp = await service.post('users/update', {
        userId: store.state.currentUser._id,
        desc: desc.value
    })

    if (resp.code === 0) {
        store.dispatch('setUser', {
            ...store.state.currentUser,
            desc: desc.value
        })

        weui.toast('修改成功', 1000)
        setTimeout(() => {
            nextTick(() => {
                router.backFlag = true
                router.back()
            })
        }, 400)
    }
}


</script>
<style scoped>
.container {
    padding-top: 64px;
}

.weui-cell {
    border-bottom: 1px solid #e5e5e5;
}
</style>
