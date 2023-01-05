<template>
    <div class="item scale-1px">
        <div :class="(data.user.params && data.user.params.vip == 1) ? 'avatar-wrap vip' : 'avatar-wrap'">
            <img class="avatar" @click="goPersonPage(data.user._id)" :src="data.avatar">
        </div>
        <div class="content-info">
            <p class="nickname one-line">{{ data.nickname }}</p>
            <div class="post-content three-line">{{ data.content }}</div>
            <div class="img-content" v-if="data.piclist.length > 1">
                <div class="img-wrap" :style="imgWrapStyle(item)" v-for="(item, index) in data.piclist" :key="index"
                    @click="showImage(index)"></div>
            </div>
            <div class="img-content-one" v-if="data.piclist.length === 1">
                <img :style="imgOneStyle(data.piclist[0])" class="img-wrap-one" :src="getImageUrl(data.piclist[0].url)"
                    @click="showImage()">
            </div>
            <div class="time">{{ data.time }}</div>
            <div class="opera-box" @click="showPanel($event)">
                <div class="box-panel-wrap">
                    <transition name="slide">
                        <div class="box-panel" v-show="showOpera">
                            <div class="like-box" @click="dealWithLike">
                                <div class="like-icon"></div>
                                <div class="like-text" v-show="!data.isLike">赞</div>
                                <div class="like-text" v-show="data.isLike">取消</div>
                            </div>
                            <div class="divider"></div>
                            <div class="comment-box" @click="addComment($event)">
                                <div class="comment-icon"></div>
                                <div class="comment-text">评论</div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="comment-list" v-show="data.likes.length || data.comments.length">
                <div class="like-content" v-show="data.likes.length">
                    <div class="like-heart-icon"></div>
                    <span v-for="(item, index) in data.likes" class="like-nickname"
                        @click="goPersonPage(item.user._id, index)" :key="item.user._id">
                        {{ likeFilter(item.user.nickname, index, data.likes.length) }}
                    </span>
                </div>
                <div class="comment-item scale-1px-top" v-for="(item, index) in data.comments"
                    v-show="data.comments.length" :key="index">
                    <div @click="goPersonPage(item.user._id)" class="comment-nickname one-line">{{ item.user.nickname }}:
                    </div>
                    <div>{{ item.content }}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>

import { computed, reactive, ref, onBeforeMount, nextTick, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import service from '@/utils/service'
import mitt from "@/utils/mitt";

const store = useStore();
const router = useRouter();
const route = useRoute();

// 评论面板状态（内部使用）
let showOpera = ref(false)

// 评论面板的关闭状态
let closeCLPanelFlag = computed(() => store.state.closeCLPanelFlag)

watch(closeCLPanelFlag, (v, oldV) => {
    if (v) {
        showOpera.value = false
    }
})

// 多图样式 赋值backgroundImage的url
let imgWrapStyle = computed(() => {
    return item => {
        return {
            backgroundImage: 'url(' + getImageUrl(item.url) + ')'
        }
    }
})

/*
* 格式化url
*/
const getImageUrl = (val) => {
    let _url = val + '?x-oss-process=image/resize,l_400'// 500,400,300,200,100...文档地址：https://help.aliyun.com/document_detail/44688.html
    return _url
}

// 单图样式
let imgOneStyle = computed(() => {
    return item => {
        let height = null
        let width = null
        // 如果图片是长图则给定最大的长度
        if (item.size.height > item.size.width) {
            height = Math.min(200, item.size.height)
            // 根据比例设置宽度
            width = height * item.size.width / item.size.height
        } else { // 如果图片是宽图则给定固定的宽度
            width = Math.min(200, item.size.width)
            // 根据比例设置高度
            height = width * item.size.height / item.size.width
        }
        // 转换成vw单位
        return {
            height: pxtovw(height),
            width: pxtovw(width)
        }
    }
})
const pxtovw = (px) => {
    return (px / 375 * 100) + 'vw'
}


const props = defineProps({
    data: {
        type: Object,
    },
});

const goPersonPage = (_id) => {

    var id = _id
    // 如果是当前用户点击当前的本人的头像 暂不跳转
    if (id === store.state.currentUser._id) {
    } else {
        router.push({
            path: 'personpage',
            query: {
                id: id
            }
        })
    }
}

const showPanel = (event) => {
    if (event.target.classList.contains('opera-box')) {
        showOpera.value = !showOpera.value

        store.dispatch('closeCLPanel', !closeCLPanelFlag)
    }
}

const likeFilter = (val, index, len) => {
    // console.log(index, len)
    if (index === len - 1) {
        return val
    } else {
        return val + ','
    }
}

const showImage = (index) => {
    let list = []
    for (let i = 0; i < props.data.piclist.length; i++) {
        list.push({
            img: props.data.piclist[i].url,
            height: props.data.piclist[i].size.height,
            width: props.data.piclist[i].size.width
        })
    }
    // 初始化Slider 实例
    new Slider({
        list: list,
        page: index || 0
    })
}

const addComment = (evt) => {

    props.data.pageY = evt.pageY
    props.data.clientY = evt.clientY
    mitt.emit('showInput', {flag:true, currentData:props.data})
    

    showOpera.value = false
}

const dealWithLike = () => {
    if (props.data.isLike) {
        removeLike()
    } else {
        addLike()
    }
}
/*
* 点赞
*/
const addLike = async () => {
    // 调用API
    let resp = await service.post('likecomment/addlike', {
        postId: props.data.id
    })
    if (resp.code === 0) {
        // 通知store去更新ui
        store.dispatch('addLike', {
            pid: props.data.id,
            user: store.state.currentUser
        })
        showOpera.value = false
    }
}
/*
* 取消点赞
*/
const removeLike = async () => {
    // 调用API
    let resp = await service.post('likecomment/removelike', {
        postId: props.data.id
    })

    if (resp.code === 0) {
        // 通知store去更新ui
        store.dispatch('removeLike', {
            pid: props.data.id,
            user: store.state.currentUser
        })
        showOpera.value = false
    }
}
</script>

<style scoped>
.item {
    display: flex;
    padding-left: 10px;
    padding-top: 15px;
    position: relative;
    padding-bottom: 17px;
}

.avatar-wrap {
    width: 44px;
    height: 44px;
    border-radius: 4px;
    background-color: #e9e9e9;
    position: relative;
}

.avatar-wrap.vip {
    border: 2px solid #fcd20c;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 4px;
}

.avatar-wrap.vip::after {
    content: " ";
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    background-image: url("./img/vip1.png");
    background-size: cover;
    position: absolute;
    right: -5px;
    bottom: -3px;
}

.content-info {
    padding-left: 10px;
    flex: 1;
    width: 100%;
}

.nickname {
    text-align: left;
    font-size: 17px;
    color: rgb(87, 107, 149);
    max-width: 200px;
    font-weight: 500;
}

.post-content {
    margin-top: 11px;
    text-align: left;
    color: #000;
    font-size: 16px;
    padding-right: 12px;
    word-break: break-word;
}

.img-content {
    display: flex;
    margin-top: 11px;
    overflow: hidden;
    flex-wrap: wrap;
}

.img-content-one {
    margin-top: 11px;
    overflow: hidden;
    text-align: left;
}

.img-wrap-one {
    background-color: #e9e9e9;
}

.img-wrap {
    width: 80px;
    height: 80px;
    margin-right: 4px;
    margin-bottom: 4px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-color: #e9e9e9;
}

.time {
    font-size: 14px;
    margin-top: 10px;
    text-align: left;
    color: rgb(178, 178, 178);
}

.opera-box {
    width: 32px;
    height: 20px;
    background-repeat: no-repeat;
    background-color: rgb(247, 247, 247);
    background-image: url("./img/opera-icon.png");
    background-size: 56%;
    background-position: center center;
    border-radius: 6px;
    margin-top: -19px;
    margin-right: 15px;
    position: relative;
    float: right;
    z-index: 99;
}

.box-panel.slide-enter-active {
    transition: transform 300ms;
}

.box-panel.slide-enter-from {
    transform: translate3d(180px, 0, 0);
}

.box-panel.slide-enter-to {
    transform: translate3d(0, 0, 0);
}
.box-panel.slide-leave-active {
    transition: transform 300ms;
}
.box-panel.slide-leave-from {
    transform: translate3d(0, 0, 0);
}

.box-panel.slide-leave-to {
    transform: translate3d(180px, 0, 0);
}

.box-panel-wrap {
    width: 180px;
    height: 40px;
    position: absolute;
    right: 42px;
    top: -10px;
    overflow: hidden;
    border-radius: 4px;
}

.box-panel {
    width: 180px;
    height: 40px;
    background-color: rgb(79, 80, 82);
    border-radius: 4px;
    position: absolute;
    right: 0;
    top: 0;

    display: flex;
    overflow: hidden;
}

.like-icon {
    width: 17px;
    height: 17px;
    background-image: url("./img/heart.png");
    background-size: cover;
    background-position: center center;
}

.comment-icon {
    width: 17px;
    height: 17px;
    background-image: url("./img/comment.png");
    background-size: cover;
    background-position: center center;
}

.comment-text,
.like-text {
    color: #fff;
    font-size: 13px;
    margin-left: 3px;
    min-width: 12px;
}

.comment-text {
    white-space: nowrap;
}

.like-box,
.comment-box {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.divider {
    width: 1px;
    height: 20px;
    background-color: #3b3c3e;
    align-self: center;
}

.comment-list {
    font-size: 14px;
    background-color: rgb(243, 243, 243);
    margin-top: 9px;
    margin-bottom: 30px;
    margin-right: 13px;
    position: relative;
}

.comment-list::before {
    content: "";
    position: absolute;
    left: 8px;
    top: -9px;
    width: 0;
    height: 0;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
    border-bottom: 10px solid rgb(243, 243, 243);
}

.comment-nickname {
    color: rgb(87, 107, 149);
    max-width: 130px;
    float: left;
    font-weight: 500;
}

.comment-item {
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 8px;
    text-align: left;
    word-break: break-word;
    min-height: 24px;
}

.like-nickname {
    color: rgb(87, 107, 149);
    font-weight: 500;
}

.like-content {

    padding-top: 3px;
    padding-bottom: 3px;
    padding-left: 8px;
    padding-right: 8px;
    text-align: left;
    word-break: break-all;
}

.like-heart-icon {
    width: 14px;
    height: 14px;
    background-image: url("./img/sq-like.png");
    background-size: cover;
    align-self: center;
    margin-right: 4px;
    margin-top: 4px;
    float: left;
}
</style>
