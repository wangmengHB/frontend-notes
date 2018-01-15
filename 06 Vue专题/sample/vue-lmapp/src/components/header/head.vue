<template>
    <header id='head_top'>
        <!-- <slot name='search'></slot> -->
        <section class="head_goback" v-if="goBack" @click="goBackFunc">
            <img src="../../images/goback.png" />
<!--             <svg width="100%" height="100%" viewBox="0 0 15 24" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="18,0 3,12 18,24" style="fill:none;stroke:rgb(255,255,255);stroke-width:4"/>
            </svg> -->
        </section>
        <slot name='logo' class="center"></slot>
        <section class="title_head ellipsis" v-if="headTitle">
            <span class="title_text">{{headTitle}}</span>
        </section>
        <div v-if="filterMenu" @click="showMenu" class="icon-filter">
            <img src="../../images/icon_Filter@3x.png">
        </div>
        <span v-if="tutorial" @click="showTutorial" class="tutorial">教程</span>
        <slot name="add"></slot>
    </header>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        data(){
            return{

            }
        },
        mounted(){
            //获取用户信息
            // this.getUserInfo();
        },
        props: ['signinUp', 'headTitle', 'goBack', 'filterMenu', 'tutorial'],
        computed: {
            ...mapState([
                'userInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'getUserInfo'
            ]),
            goBackFunc(){
                if(this.$router.app.$route.fullPath.indexOf('search') > -1 && this.$router.app.$route.fullPath=='/search'){
                    this.$emit('goBack')
                }else{
                	if(window.isNative){   //native 发送协议
                		if(this.$router.app.$route.fullPath.indexOf('search_sku') > -1){
                			let data={type:'1'};
                			window.postMessage(JSON.stringify(data),'*'); 
                		}else{
                			//let data={type:'1'};
                			//window.postMessage(JSON.stringify(data),'*'); 
                			location.href="junion://j.u?act=goBack&isClose=0";
                		}
                	}else{
	                	if(this.$route.fullPath!="/promotion_product" && this.$route.fullPath.indexOf("search_sku")<=-1){
		                	this.$route.meta.keepAlive=false;
		                }
		                this.$router.go(-1)
	                }	
                }
            },
            showMenu(){
                this.$emit('showMenu');
            },
            showTutorial(){
                this.$emit('showTutorial');
            }
        },

    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    #head_top{
        background-color: #FF0500;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        transform: translate3d(0,0,0);
        @include wh(100%, 0.88rem);
        overflow: hidden;
        .center {
            @include center;
        }
        display: flex;
        
    }
    .head_goback{
        position: relative;
        @include wh(0.88rem, 0.88rem);
        font-size: 0;
        line-height: 0.24rem;
        img{
            @include ct;
            left: 0.28rem;
            @include wh(0.15rem, 0.24rem);
        }
    }
    .title_head{
        flex: 1;
        @include fj(center);
        width: 50%;
        color: #000;
        text-align: center;
        position: realtice;
        .title_text{
            @include sc(0.36rem, rgb(255,255,255));
            @include center;
        }
    }
    .icon-filter{
        width: 20%;
        text-align: right;
        float: right;
        display: inline-block;
        margin-right: 0.2rem;
        position: relative;
        img{
            width: 30%;
            @include ct;
            right: 0;
        }
    }
    .tutorial{
        position: absolute;
        right: 0.3rem;
        @include ct;
        @include sc(0.24rem, #fff);
        line-height: 0.36rem;
    }
</style>
