<template>
    <div class="search-main">
    	<head-top goBack="true" @goBack="goBack" headTitle="搜索" ref="headTop"></head-top>
		<div class="category_top" ref="categoryTop">
			<!-- S 搜索框模块 -->
			<div class="searchbar">
				<div class="searchbox">
				    <form action="" v-on:submit.prevent><input @keyup.enter="searchTarget(searchValue)" type="search" id="search"  placeholder="请输入商品名称或ID搜索..." v-model="searchValue" @focus="checkInput"></form>
					<a class="clear_keyword" @click="searchValue = ''"></a>
				</div>
				<span @click.prevent="searchTarget(searchValue)">搜索</span>
			</div>
			<div class="search-layer" v-if="showHistory">
				<div class="history-search">
					<div class="search-title"><span class='history-title'>历史搜索</span><span class="icon-del" @click="clearAllHistory"></span></div>
					<ul class="history-group">
						<li v-for="(item, index) in searchHistory" :key="index" class="history-item" @click="searchTarget(item)">
							{{item}}
						</li>
					</ul>
					<div class="no-history" v-show="emptyResult">暂无搜索历史</div>
				</div>
			</div>
			<!-- E 搜索框模块 -->
		</div>
		<div class="category_main">
			<!-- S 顶部条模块 -->
			<div class="category_nav">
				<ul class="category_nav_list" >
					<li v-for="(item, key, index) in searchWords" class="category_type">
						<a class="category_type_link category_adder" :class="item.choosed? 'active': ''" attr-id="BoughtId" @click="leftHighlight(key, index)">
							<span class="category_type_text">{{key}}</span>
						</a>
					</li>
				</ul>
			</div>
			<!-- E 顶部条模块 -->

			<section class="category_detail" ref="categoryDetail">
				<section class="category_section" v-for="(item, key, index) in searchWords">
					<h2 class="category_section_title">{{key}}</h2>
					<ul class="clearfix category_section_list">
						<li class="category_section_item" v-for="(value, key, index) in item.value">
							<a class="category_section_item_link" @click="searchTarget(value)">{{value}}</a>
						</li>
					</ul>
				</section>
			</section>
		</div>
    </div>
</template>

<script>
import headTop from '../../components/header/head'
import {imgBaseUrl} from '../../config/env'
import {getStore, setStore, isNormal, animate,trim} from '../../config/mUtils'
import 'src/components/jelly/jelly.js'
import 'src/components/jelly/jelly.css'

export default {
	data(){
        return {
            searchValue: '', // 搜索内容
            imgBaseUrl, // 图片域名地址
            searchHistory: [], // 搜索历史记录
            showHistory: false, // 是否显示历史记录，只有在返回搜索结果后隐藏
            emptyResult: false, // 搜索结果为空时显示
			showAlert: false, //弹出框
			searchWords: {
				"女装内衣": {choosed:true, value: ["长袖连衣裙", "针织连衣裙", "蕾丝连衣裙", "套装裙", "雪纺连衣裙", "风衣", "小西装", "针织衫", "卫衣", "衬衫", "打底裤", "牛仔裤", "休闲裤", "小脚裤", "短裤", "女士内裤", "文胸", "丝袜", "背心吊带", "棉袜", "毛绒帽", "围巾", "眼镜", "女士皮带", "手套"]},
				"家用电器": {choosed:false, value: ["空调", "冰箱", "平板电视", "洗衣机", "家庭影院", "油烟机", "电热水器", "燃气灶", "消毒柜", "洗碗机", "剃须刀", "健康秤", "电吹风", "按摩器", "口腔护理", "吸尘器", "电风扇", "加湿器", "净化器", "饮水机"]},
				"男装内衣": {choosed:false, value: ["T恤", "衬衫", "针织衫", "卫衣", "羊毛衫"]},
				"个护化妆": {choosed:false, value: ["洁面", "爽肤水", "眼霜", "面膜", "防晒"]},
				"家居百货": {choosed:false, value: ["保温杯", "四件套", "被子", "水壶", "纸品"]},
				"手机": {choosed:false, value: ["Apple", "小米", "华为", "三星", "OPPO"]},
				"电脑数码": {choosed:false, value: ["移动电源", "笔记本", "平板电脑", "鼠标", "路由器"]},
				"母婴玩具": {choosed:false, value: ["纸尿裤", "安全座椅", "儿童套装", "婴儿床", "益智早教"]},
				"图书音像": {choosed:false, value: ["文学", "小说", "传记", "管理", "历史", "经济金融", "外语学习", "艺术", "烹饪美食", "中小学教辅"]},
				"鞋靴箱包": {choosed:false, value: ["休闲鞋", "皮鞋", "女靴", "单肩包", "潮流男包", "旅行箱", "运动鞋", "短靴", "帆布鞋", "高跟鞋"]},
				"运动户外": {choosed:false, value: ["跑步鞋", "休闲鞋", "健身衣", "帐篷", "睡袋", "钓竿", "泳衣", "羽毛球", "足球", "篮球"]}
			},
            searchWordTop: [],
        }
    },
    created(){
       
    },
    mounted(){
    	var u = navigator.userAgent;
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	    var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
    	
    	
    	if(isChrome && !isiOS){
	    	if(document.documentElement.clientHeight>=window.clicentHeight){
	           document.querySelector('.search-main').style.height=document.documentElement.clientHeight+59+'px';
	        }else{
	           document.querySelector('.search-main').style.height=window.clicentHeight+'px';
	        }
	    }else{
	    	if(document.documentElement.clientHeight>=window.clicentHeight){
	           document.querySelector('.search-main').style.height=document.documentElement.clientHeight+59+'px';
	        }else{
	           document.querySelector('.search-main').style.height=window.clicentHeight+59+'px';
	        }
	    }
        let self = this;
        //获取搜索历史记录
        if (getStore('searchHistory')) {
            this.searchHistory = JSON.parse(getStore('searchHistory'));
        }

        this.$nextTick(() => {
            this.getSearchWordHeight();
        })
        let handler = () => {
        	if(isChrome && !isiOS){
        	  document.querySelector('.search-main').style.height=document.documentElement.clientHeight+59+'px';
        	}else{
        	  document.querySelector('.search-main').style.height=document.documentElement.clientHeight+'px';	
        	}
            if (!self.timer) {
                self.timer = true
                self.getSearchWordHeight();
                // console.log(this.searchWordTop)
                setTimeout(() => {
                    self.timer = false
                }, 400)
            }
        }
        window.addEventListener('resize', handler);
    },
    components:{
        headTop,
    },
    methods:{
    	goBack(){
    		if(this.showHistory){
    			this.showHistory = false;
    		}else{
    			 this.searchValue="";
    			 if(window.isNative){   //native 发送协议
                		//location.href="junion://j.u?act=goBack&isClose=0";
                	let data={type:'1'};
                	window.postMessage(JSON.stringify(data),'*'); 
    			 }else{
    			    this.$router.go('-1');
    			 }
    		}
    	},
    	leftHighlight(key, index){
    		this.getSearchWordHeight();
    		for(let i in this.searchWords){
    			if (key == i) {
    				this.searchWords[i].choosed = true;
    			}else{
    				this.searchWords[i].choosed = false;
    			}
    		}

            document.querySelector('.category_detail').scrollTop = this.searchWordTop[index];
    	},
        getSearchWordHeight(){
            const baseHeight = this.$refs.headTop.$el.clientHeight;
            const categoryTopHeight = this.$refs.categoryTop.children[0].clientHeight;
            const listContainer = this.$refs.categoryDetail;
            const listArr = Array.from(listContainer.children);
            listArr.forEach((item, index) => {
                this.searchWordTop[index] = item.offsetTop - baseHeight - categoryTopHeight;
                if(this.searchWordTop[index] < 0) this.searchWordTop[index] = 0;
            });
            console.log(this.searchWordTop);
        },
        //点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
        async searchTarget(value){
        	document.querySelector("input").blur();
        	this.searchValue=trim(value);
            if (this.searchValue == "") {
            	$j.toast("请输入搜索内容");
            	return
            }
            if (!isNormal(this.searchValue)) {
            	$j.toast("不能输入特殊字符");
            	return
            }
            if (this.searchValue.length > 15) {
            	$j.toast("搜索词不能超过15个字");
            	return
            }

            // 隐藏历史记录
            //this.showHistory = false;

            /**
             * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
             * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
             */
            let history = getStore('searchHistory');
            if (history) {
                let checkrepeat = false;
                this.searchHistory = JSON.parse(history);
                this.searchHistory.forEach(item => {
                    if (item == this.searchValue) {
                        checkrepeat = true;
                    }
                })
                if (!checkrepeat) {
                    this.searchHistory.unshift(this.searchValue)
                }
            }else {
                this.searchHistory.unshift(this.searchValue)
            }
            this.searchHistory = this.searchHistory.slice(0, 10)
            setStore('searchHistory',this.searchHistory)
            console.log(this.searchValue)
            console.log(encodeURIComponent(this.searchValue))
            if(window.isNative){
            	let data={type:'2'};
                window.postMessage(JSON.stringify(data),'*'); 
            }
            this.$router.push({path: 'search_sku', query: {key: encodeURIComponent(this.searchValue)}})
        },
        //搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
        checkInput(){
            if (this.searchValue === '') {
                this.showHistory = true; //显示历史记录
                if(!this.searchHistory.length){
                	this.emptyResult = true; //显示暂无历史搜索提示
                }
            }
        },
        //清除所有历史记录
        clearAllHistory(){
            this.searchHistory = [];
            setStore('searchHistory',this.searchHistory);
            this.emptyResult = true;
        },
        /*解决ios键盘弹起时整个页面上移*/
        // $$("#search").focus(function(){
        //     console.log("1");
        //     setTimeout(function(){
        //         document.body.scrollTop = 0;
        //     },0)
        // })
    }
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    .search-main{
        @include wh(100%, 100%);
        display: flex;
        box-orient: vertical;
        flex-flow: column;
        flex-direction: column;
        .category_top{
            margin-top: 0.88rem;
            font-size: 0.28rem;
        }
        .searchbar{
            @include wh(100%, 0.86rem);
            background-color: #e5dfd9;
            position:fixed;
            top: 0.88rem;
            z-index: 999;
            .searchbox{
                @include wh(83%, 0.52rem);
                margin: 0.14rem auto auto 0.18rem;
                border: 0;
                border-radius: 0.1rem;
                overflow: hidden;
                float: left;
                position: relative;
                input{
                    @include wh(100%, 0.52rem);
                    font-size: 0.28rem;
                    border: 0;
                    padding: 0 0.6rem;
                    margin: 0;
                    -webkit-tap-highlight-color: transparent;
		            -webkit-appearance: none;
		            outline: none;
                }
                input::-webkit-search-decoration,
				    input::-webkit-search-cancel-button {
				    display: none;
			    }
                .clear_keyword {
                    position: absolute;
                    content: '';
                    top: 0.1rem;
                    right: 0.24rem;
                    @include wh(0.3rem, 0.3rem);
                    background: url(../../images/search_close.png);
                    background-size: 100% 100%;
                }
            }
            span{
                float: right;
                margin-right: 0.3rem;
                margin-top: 0.2rem;
                text-align: justify;
                position:relative;
            }
        }
        .searchbar .searchbox:before{
            position: absolute;
            content: '';
            top: 0.1rem;
            left: 0.24rem;
            @include wh(0.3rem, 0.3rem);
            background: url(../../images/search_open.png);
            background-size:100% 100%;
        }
        .search-layer {
            height: 100%;
            width: 100%;
            background-color: white;
            position: fixed;
            z-index: 100;
            .history-search {
                background-color: white;
                color: black;
                padding: 0.1rem;
                margin-top: 0.8rem;
            }
            .search-title {
                padding: 0.1rem;
                height: 0.5rem;
            }
            .history-title {
                line-height: 0.5rem;
            }
            .icon-del {
                @include wh(0.5rem, 0.5rem);
                display: inline-block;
                background: url(../../images/search-delete.png) no-repeat center;
                background-size: 0.3rem;
                position: absolute;
                right: 0.3rem;
            }
            .history-item {
                display: inline-block;
                min-width: 0.6rem;
                height: 0.58rem;
                line-height: 0.58rem;
                border-radius: 0.64rem;
                margin: 0.16rem 0 0 0.16rem;
                padding: 0.06rem 0.2rem;
                @include sc(0.24rem, #666);
                text-align: center;
                background-color: #F9F5F0;
            }
            .history-group {
                max-height: 2.66rem;
                overflow: hidden;
                margin-left: -0.06rem;
                padding-bottom: 0.2rem;
            }
            .no-history {
                text-align: center;
                padding-bottom: 0.3rem;
                padding-top: 0.1rem;
                color: #8c8c90;
            }
        }
        .category_main {
            flex: 1;
            @include wh(100%, 100%);
            display: flex;
            box-orient: horizontal;
            flex-flow: row;
            flex-direction: row;
            margin-top: 0.8rem;
            font-size: 0.28rem;
            .category_nav {
                width: 1.68rem;
                text-align: center;
                overflow-y: scroll;
                background-color: #303030;
            }
            .category_nav_list {
                padding-top: 0.16rem;
                padding-bottom: 0.1rem;
            }
            .category_type {
                margin-bottom: 0.5rem;
                text-align: center;
            }
            .category_type_link {
                display: inline-block;
                @include wh(1.36rem, 0.88rem);
                padding-top: 0.24rem;
                @include sc(0.3rem, #fff);
                text-align: center;
                border-bottom: 0.08rem solid #303030;
                box-sizing: inherit;
            }
            .category_type_link.active {
                color: #fff;
                position: relative;
                border-bottom: 0.08rem solid #86DCC3;
            }
            .category_type_link.active:after {
                content: '';
                position: absolute;
                right: -0.16rem;
                top: 50%;
                margin-top: -0.12rem;
                width: 0;
                height: 0;
                border-top: 0.12rem solid transparent;
                border-right: 0.12rem solid #fff;
                border-bottom: 0.12rem solid transparent;
                text-align: center
            }
            .category_type_text {
                display: block;
                color: #fff;
                line-height: 0.3rem;
            }
            .category_detail {
                flex: 1;
                width: 100%;
                overflow-y: scroll;
            }
            .category_section {
                padding: 0.26rem 0.2rem 0.24rem;
                background-color: #fff;
            }
            .category_section_title {
                font-size: 0.28rem;
                font-weight: 600;
                color: #9B9B9B;
                padding-left: 0.2rem;
            }
            .clearfix:after {
                content: ".";
                display: block;
                height: 0;
                clear: both;
                visibility: hidden;
            }
            .category_section_list {
                margin: 0 -0.08rem;
                padding-top: 0.12rem;
            }
            .category_section_item {
                float: left;
                width: 33.33%;
                padding: 0.09rem;
                box-sizing: border-box;
            }
            .category_section_item_link {
                display: block;
                height: 0.64rem;
                background-color: #F9F5F0;
                text-align: center;
                line-height: 0.64rem;
                color: #666666;
                font-size: 0.24rem;
                border-radius: 0.64rem;
            }
        }
    }
</style>

