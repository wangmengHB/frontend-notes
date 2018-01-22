<template>
    <div class="activity-main">
        <head-top goBack="true" headTitle="热门活动" filterMenu="true" @showMenu="showMenuFun" ref="headTop">
            <div slot="filter"><img src="../../images/icon_Filter@3x.png"></div>
        </head-top>
        <div class="activity-content">
            <!-- 侧滑导航根容器 -->
            <aside class="leftMenu" v-show="showMenu">
                <div class="menu-bottom">
                    <div class="left" @click="reset">
                        重置
                    </div>
                    <div class="right" @click="confirm">
                        确定
                    </div>
                </div>
                <div class="scroll-wrapper">
                    <!-- 列表 要写的 -->
                    <div class="tag-list">
                        <div class="tit">活动状态</div>
                        <ul>
                            <li v-for="(item, index) in status" :class="{'tag-selected': statusIndex == index}" style="width: 40%;" @click="statusIndex = index">{{item.name}}</li>
                        </ul>
                        <div class="tit">活动标签</div>
                        <ul>
                            <li v-for="(item, index) in type" :class="{'tag-selected': typeIndex == index}" @click="typeIndex = index">{{item.name}}</li>
                        </ul>
                        <div class="tit">类目</div>
                        <ul>
                            <li v-for="(item, index) in categoryList" :class="{'tag-selected': categoryIndex == index}" @click="categoryIndex = index">{{item.name | cutoffName}}</li>
                        </ul>
                    </div>
                </div>
            </aside>
            <div class="html-activitylist">
                <activity-list v-if="hasGetData" page="list" :urlParams="urlParams" :refreshList="refreshList" @refreshListFun="refreshListFun"></activity-list>
            </div>
        </div>
        <transition name="showcover">
            <div class="back_cover" v-show="showMenu" @click="hideMenuFun"></div>
        </transition>
    </div>
</template>

<script>
import headTop from '../../components/header/head'
import activityList from 'src/components/common/activitylist'
import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
import {isOk, log} from 'src/config/mUtils'

export default{
    data(){
        return {
            status: [{name: '活动中', val: 1},{name: '即将开始', val: 2}],
            statusIndex: null,
            type: [{name: '满减', val: 10},{name: '优惠券', val: 11},{name: '买赠', val: 12},{name: '直降', val: 13},{name: '清仓', val: 14},{name: '新品', val: 15},{name: '白条', val: 16}],
            typeIndex: null,
            categoryList: [],
            categoryIndex: null,
            refreshList: false,
            showMenu: false,
            hasGetData: true,
        }
    },
    components: {
        headTop,
        activityList
    },
    created(){

    },
    mounted(){
        //获取筛选分类数据
        this.getCategory();
    },
    methods: {
        getCategory(){
            //getProxy('/adv/activityCategories').then(res => {
            jsonpProxyApiX('activityCategories',{}).then(res => {
                if(isOk(res)){
                    this.categoryList = res.data;
                }
            })
        },
        confirm(){
            this.showMenu = false;
            document.querySelector('.html-activitylist').style.cssText = '';
            document.querySelector('body').classList.remove("body");

            this.refreshList = true;
            log('promotion_activity页面点击确定按钮', 'promotion_activity页面点击确定按钮');
        },
        reset(){
            this.statusIndex = null;
            this.typeIndex = null;
            this.categoryIndex = null;
            log('promotion_activity页面点击重置按钮', 'promotion_activity页面点击重置按钮');
        },
        refreshListFun(){
            this.refreshList = false;
        },
        showMenuFun(){
            //阻止选择面板滑动时，下层div跟着滑动的问题
            document.querySelector('body').classList.add('body');
            const baseHeight = this.$refs.headTop.$el.clientHeight;
            document.querySelector('.html-activitylist').style.position = 'fixed';
            document.querySelector('.html-activitylist').style.width = '100%';
            document.querySelector('.html-activitylist').style.overflow = 'hidden';
            document.querySelector('.html-activitylist').style.top = baseHeight;
            document.querySelector('.html-activitylist').style.height = document.documentElement.clientHeight-baseHeight;
            document.querySelector('.leftMenu').style.top = document.querySelector('body').scrollTop;

            this.showMenu = true;
            log("MJDUnion_ActivityExtensionFilter");
        },
        hideMenuFun(){
           this.showMenu = false;
           this.refreshList = true;
            document.querySelector('.html-activitylist').style.cssText = '';
            document.querySelector('body').classList.remove("body");

            log("promotion_activity页面点击确定按钮", "promotion_activity页面点击确定按钮");
        }
    },
    computed: {
        urlParams: function(){
            return {
                status: /^\d+$/.test(this.statusIndex)? this.status[this.statusIndex]['val']: undefined,
                type:  /^\d+$/.test(this.typeIndex)? this.type[this.typeIndex]['val']: undefined,
                category:  /^\d+$/.test(this.categoryIndex)? this.categoryList[this.categoryIndex]['id']: undefined
            }
        }
    },
    filters: {
        cutoffName: function(value){
            if(value.length>5) return value.substring(0,4)+"...";
            return value
        }
    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .body{
        height: 100%;
        overflow: hidden;
    }
    .activity-content{
        padding-top: 0.88rem;
        background-color: #f9f5f0;
        line-height: 0.42rem;
        .leftMenu{
            position: fixed;
            z-index: 999;
            top: 0;
            box-sizing: content-box;
            @include wh(86%, 100%);
            background: #fff;
            overflow-x: hidden;
            left: 0;
            bottom: 0;
            padding-bottom: 10%;
            .menu-bottom{
                position: fixed;
                bottom: 0;
                width: 86%;
                background: #FFF;
                height: 0.8rem;
                line-height: 0.8rem;
                z-index: 1000;
                border-top: 0.02rem solid #ccc;
                font-size: 0.34rem;
                .left{
                    float: left;
                    display: inline-block;
                    width: 49.999%;
                    text-align: center;
                }
                .right{
                    border-left: 0.02rem solid #ccc;
                    float: right;
                    display: inline-block;
                    width: 49.999%;
                    text-align: center;
                    background: #dd524d;
                    color: #fff;
                }
            }
            .scroll-wrapper{
                background: #fff;
                height: 100%;
                .tag-list{
                    width: 90%;
                    margin-left: 0.2rem;
                    padding-bottom: 1rem;
                    margin-top: 5%;
                    .tit{
                        @include sc(0.3rem, #000);
                        clear: both;
                        line-height: 0.5rem;
                        height: 0.5rem;
                        margin-top: 0.2rem;
                        padding-left: 0.2rem;
                    }
                    ul{
                        margin: 0;
                        padding: 0;
                        margin-left: 0.2rem;
                        overflow: hidden;
                        li{
                            float: left;
                            @include wh(29%, 0.56rem);
                            text-align: center;
                            border-radius: 0.12rem;
                            line-height: 0.56rem;
                            @include sc(.24rem, #000);
                            border: 0.02rem solid #eff3f6;
                            background-color: #eff3f6;
                            margin-top: 0.16rem;
                            margin-right: 0.2rem;
                        }
                    }
                    ul:last-child{
                        margin-bottom: 1rem;
                    }
                    .tag-selected {
                        color: #fff;
                        background-color: #dd524d; 
                    }
                }
            }
        }
    }
    .showcover-enter-active, .showcover-leave-active {
        transition: opacity .3s
    }
    .showcover-enter, .showcover-leave-active {
        opacity: 0
    }
    .back_cover{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background-color: rgba(0,0,0,0.3);
    }
</style>