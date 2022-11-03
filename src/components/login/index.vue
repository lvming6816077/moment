<template>
    <div class="container">
        <div class="close" @click="close"></div>
        <p class="title">手机号登录</p>

        <div class="weui-cell weui-cell_vcode">
            <div class="weui-cell__hd">
                <label class="weui-label">手机号</label>
            </div>
            <div class="weui-cell__bd">
                <input class="weui-input" maxlength="11" type="tel" pattern="^\d{11}$" placeholder="请输入手机号"
                    v-model="phoneNum">
            </div>
            <div class="weui-cell__ft">
                <button v-show="timeCode == 60" class="weui-vcode-btn" @click="getCode">获取验证码</button>
                <div v-show="timeCode != 60" class="time-code weui-vcode-btn">{{ timeCode }}s</div>
            </div>
        </div>

        <div class="weui-cell weui-cell_vcode vcode-input scale-1px">
            <div class="weui-cell__hd"><label class="weui-label">手机验证码</label></div>
            <div class="weui-cell__bd">
                <input v-model="code" class="weui-input" type="number" placeholder="请输入验证码">
            </div>

        </div>
        <div v-if="needCaptcha" class="weui-cell weui-cell_vcode captcha-code">
            <div class="weui-cell__hd"><label class="weui-label">图形验证码</label></div>
            <div class="weui-cell__bd">
                <input v-model="captcha" class="weui-input" type="number" placeholder="请输入验证码" />
            </div>
            <div class="weui-cell__ft">
                <img class="weui-vcode-img" :src="captchaUrl" @click="reloadCaptcha" />
            </div>
        </div>
        <a class="weui-btn weui-btn_primary" href="javascript:" @click="signUp">确定</a>

    </div>
</template>

<script setup>
import { computed, reactive, ref, onBeforeMount, nextTick, watch, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import service from '@/utils/service'

const store = useStore();
const router = useRouter();

let phoneNum = ref('')
let code = ref('')
let captcha = ref('')
const timeCode = ref(60)
const captchaUrl = ref(service.baseURL + 'users/captcha')
const needCaptcha = ref(false)

const close = () => {
    router.go(-1)
}
const getCode = async () => {
    // if (!navigator.serviceWorker) {
    //   weui.topTips('请使用指定浏览器，体验前沿的技术')
    //   return
    // }
    // 验证手机号是否合法
    if (!/^\d{11}$/.test(phoneNum.value)) {
        weui.topTips('请输入正确手机号')
        return
    }
    if (phoneNum.value) {
        // 发送获取验证码请求
        let resp = await service.get('users/phonecode', {
            phonenum: phoneNum.value
        })

        if (resp.code === 0) {
            weui.toast('验证码已发送', 1000)
            // 动态倒计时
            countTimeCode()
        }
    }
}

const signUp = async () => {

    // 判断手机号和验证码都有值才发送请求
    if (phoneNum.value && code.value) {
        // // 验证手机号是否合法
        if (!/^\d{11}$/.test(phoneNum.value)) {
            weui.topTips('请输入正确手机号')
            return
        }
        // 发送登录请求
        let resp = await service.post('users/signup', {
            phonenum: phoneNum.value,
            code: code.value,
            captcha: captcha.value
        })

        if (resp.code === 0) {
            if (resp.data.code === 'needCaptcha') {
                needCaptcha.value = true
                weui.topTips('操作频繁，请输入图形验证码')
                return
            }
            // 登录成功后，将当前用户的数据存入store，以便后续使用
            store.dispatch('setUser', resp.data)
            router.go(-1)
        }
    } else {
        weui.topTips('请输入验证码或手机号码')
    }
}
let clearFlag = null
const countTimeCode = () => {
    clearFlag = setInterval(() => {
        // 倒计时结束后，重制标志位
        if (timeCode.value == 0) {
            timeCode.value = 60
            clearInterval(clearFlag)
            return
        }
        // 秒数每次减1
        timeCode.value--
    }, 1000)// 1s调用1次
}
/*
* 刷新验证码
*/
const reloadCaptcha = () => {
    captcha.valueUrl = service.baseURL + 'users/captcha?' + Date.now()
}

onUnmounted(() => {
    clearInterval(clearFlag)
})

</script>

<style scoped>
.container {
    padding-top: 150px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 999;
    overflow: hidden;
}

.title {
    text-align: left;
    padding-left: 40px;
    font-size: 23px;
    margin-bottom: 32px;
}

.weui-vcode-btn {
    border: none;
}

.vcode-input {
    height: 45px;
}

.captcha-code {
    height: 45px;
}

.captcha-code::before {
    display: none;
}

.scale-1px::after {
    left: 16px;
}

.weui-btn {
    margin: 13px;
    margin-top: 59px;
}

.close {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 8px;
    left: 8px;
    background-size: contain;
    background-image: url('./img/close.png');
}

.time-code {
    width: 100px;
    text-align: center;
    color: #ccc;
}
</style>
