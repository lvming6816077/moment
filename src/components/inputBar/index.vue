<template>
    <div class="wrap scale-1px-top">
        <div class="input-content scale-1px">
            <div class="input-wrap">
                <input ref="input" class="weui-input input-inner" maxlength="40" @focus="onfocus" @blur="onblur"
                    type="text" placeholder="请输入文本">
            </div>
            <div class="create-btn weui-btn weui-btn_mini weui-btn_primary" @click="publish">发表</div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, onBeforeMount, nextTick, watch, onUnmounted, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import mitt from "@/utils/mitt";

const store = useStore();
const router = useRouter();


const props = defineProps({
    data: {
        type: Object
    },
    option: {
        type: Object
    }
})
const emit = defineEmits(['publish', 'showBottom', 'uploaded', 'hideBottomOnPanel'])

let currentData = reactive({})
let panelShow = ref(false)
let uploader = ref(null)
let input = ref(null)



/*
* 发表文字内容回调
*/
const publish = () => {
    if (input.value.value) {
        emit('publish', {
            value: input.value.value,
            data: currentData
        })

        input.value.value = ''
    }
}

/*
* 让输入框失去焦点，实际上这段代码就会收起键盘
*/
const blurInput = () => {
    input.value.blur()
}
/*
* 让输入框获取焦点，实际上这段代码就会呼起键盘
*/
const focusInput = (d) => {
    currentData = d
    input.value.focus()
}
defineExpose({
    blurInput,
    focusInput
})
const onblur = () => {
    setTimeout(() => {
        // 在朋友圈时，失去焦点要关闭评论框
        mitt.emit('showInput', {flag:false, currentData:props.data})
    }, 90)
}

const onfocus = () => {
    // 这段代码用来获取键盘高度，所以必须满足键盘在页面底部noplus代表没有底部的操作面板
    if (!props.option.noPlus) {
        setTimeout(() => {
            // 键盘在页面底部时在获取
            if (!panelShow.value) {
                // 键盘呼起前剪去键盘呼起后
                let kh = window.windowHeightOrgin - window.innerHeight
                if (kh > 0) {
                    // 由于一些webview上下底部有导航栏，所以我们需要剪去这部分高度
                    window.keyboardHeight = kh - (window.screen.height - window.windowHeightOrgin)
                    // weui.toast(window.windowHeightOrgin +'xx'+ window.innerHeight + 'yy'+(window.screen.height - window.windowHeightOrgin))
                }
            }
            // 通知父组件隐藏掉图片操作面板
            emit('hideBottomOnPanel')
        }, 200)
    }
}
</script>

<style scoped>
.wrap {
    background-color: #f6f6f6;
}

.input-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
}

.opera-panel {
    height: 230px;
    width: 100%;
    display: flex;
}

.opera-item {
    width: 66px;
    height: 90px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 12px;
}

.item-text {
    color: rgb(133, 133, 133);
    font-size: 13px;
    margin-top: 7px;
}

.item-icon {
    width: 60px;
    height: 60px;
    background-color: #fff;
    background-image: url('./img/photo.png');
    background-size: 26px 26px;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 7px;
}

.face-btn {
    width: 28px;
    height: 28px;
    background-image: url('./img/face.png');
    background-size: cover;
    margin-left: 7px;
}

.plus-btn {
    width: 28px;
    height: 28px;
    background-image: url('./img/plus.png');
    background-size: cover;
    margin-left: 7px;
}

.create-btn {
    margin-left: 7px;
    padding: 0 9px;
    margin-right: 7px;
}

.input-wrap {
    flex: 1;
    background-color: #fff;
    border-radius: 4px;
    height: 40px;
    margin-left: 11px;
}

.input-inner {
    height: 100%;
    font-size: 18px;
    padding-left: 7px;
    padding-right: 7px;
}
</style>
