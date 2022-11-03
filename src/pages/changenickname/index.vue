
<template>
    <div class="container">
        <navHeader title="修改昵称" />
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <input class="weui-input" type="text" placeholder="请输入文本" v-model="name" maxLength="15">
            </div>
        </div>
        <div class="weui-btn-area">
            <a class="weui-btn weui-btn_primary" href="javascript:" id="showTooltips" @click="submit">确定</a>
        </div>
    </div>
</template>

<script setup>



import navHeader from '@/components/navHeader'
import { getCookie } from '@/utils/cookie'
import service from '@/utils/service'

import { computed, reactive, ref, onBeforeMount,nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

let str = route.params&&route.params.name ? route.params.name.trim():''
let name = ref(str);

const submit = async () => {
    let resp = await service.post('users/update', {
        userId: store.state.currentUser._id,
        nickname: name.value
    })

    if (resp.code === 0) {
        store.dispatch('setUser', {
            ...store.state.currentUser,
            nickname: name.value
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
