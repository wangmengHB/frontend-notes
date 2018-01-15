<template>
	<div>
	  <head-top :goBack="true" :headTitle="headTitle">
	  	   
	  </head-top>
	  <div class="jf-content">
    		<div class="xiding">
    			<div class="jelly-input-row jelly-search">
    				<span class="jelly-icon jelly-icon-search search-before"></span>
					<form  v-on:submit.prevent action=""><input type="search"  class="jelly-input-clear" v-model="keyWord" @keyup.enter="search" @focus="focuse()" @blur="blur()"  placeholder="" data-input-clear="1" data-input-search="1"></form>
					<span class="jelly-icon jelly-icon-clear" @click="clearInput" v-if="keyWord.length>0"></span>
				</div>
				<div class="sortM" @touchmove.prevent>
					<ul class="sortD">
						<li :class="{zh:true,isSelect:sortIndex==0}" @click="sortIsShow">
							{{defaultSortName}}
							<div :class="{triangle_border_up:true,up:sortShow}">
							</div>
						</li>
						<li :class="{yj:true,isSelect:sortIndex==1}" val="wlCommission" @click="sortSelect('1','wlCommission')">佣金</li>
						<li :class="{xl:true,isSelect:sortIndex==2}" val="inOrderCount30Days" @click="sortSelect('2','inOrderCount30Days')">销量</li>
						<li :class="{yhq:true,isSelect:filter.hasCoupon=='1'}" @click="isHasCoupon">仅优惠券商品</li>
					</ul>
					<div class="sortL">
							<ul class="zhSort" id="cscs" :style="{height:zSortHeight+'rem'}">
								<li v-for="item in sortList" :val="item.val" :sort="item.sort" @click="sortSelectZ(item.name,item.val,item.sort,item.log)">{{item.name}}</li>
							</ul>
					</div>
				</div>
			</div>
			<transition name="showcover">
	    		<div class="back_cover" @touchmove.prevent v-show="showAllType" style="display: block;"></div>
	    	</transition>
			<productList style="margin-top: 1.68rem;" ref="productList" :filter="filter" page="search_sku">
				
			</productList>
		</div>
		<div v-show="isBackdrop" class="mui-backdrop" style="display: none;" @click="dis_appear()"></div>
	</div>
</template>

<script>
import {mapMutations} from 'vuex'
import productList from 'src/components/product/product'
import headTop from 'src/components/header/head'
import {getCategories,listProducts} from 'src/service/getPromotion'
import {imgBaseUrl,loginUrl} from 'src/config/env'
import {showBack, animate,getStore,log,trim,isNormal} from 'src/config/mUtils'
import {getImgPath} from 'src/components/common/mixin'
import {getProxy} from 'src/service/proxy'

import 'src/components/jelly/jelly.js'
import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'
export default {
	data(){
	        return {
	        	headTitle:'搜索',
	        	filter:{
	        	   sortName:'综合排序',
	               sortVal:'',//默认为空
	               categoryId:'',
	               categoryName:'全部分类',
	               keyWord:'',
	               sort:'0',
	               hasCoupon:'',//是否有优惠券
	        	},
	        	keyWord:'',
	        	sortIndex:'0',
	        	sortShow:false,   //排序是否展开
	        	defaultSortName:'综合',
	        	zSortHeight:'0',
	        	sortList:[
						{name:'综合',val:''},
                      	{name:'价格从高到低',val:'wlPrice',sort:'0'},
                      	{name:'价格从低到高',val:'wlPrice',sort:'1'},
				],
                showAllType: false,
                isBackdrop:false,
                inputShow:false,
                isFirst:true,
                isIos:false,
	        }
    },
    created(){
		this.keyWord=decodeURIComponent(this.$route.query.key);
        this.filter.keyWord=decodeURIComponent(this.$route.query.key);
        /*this.defaultSortName='综合';
        this.sortIndex='0';
        this.zSortHeight='0';
        this.filter={sortName:'综合排序',sortVal:'',categoryId:'',categoryName:'全部分类',keyWord:'',sort:'0',hasCoupon:'',};*/
	},
	beforeRouteEnter(to,from,next){
       if(from.fullPath=="/search" || from.fullPath=="/"){
    	   localStorage.setItem("isback",'0');
       }else{
       	   localStorage.setItem("isback",'1');
       }
       next();
    },
    mounted(){
    	//this.$route.meta.keepAlive=true;
    	/*this.keyWord=decodeURIComponent(this.$route.query.key);
        this.filter.keyWord=decodeURIComponent(this.$route.query.key);*/
        //吸顶
		/*let xiding = document.querySelector('.xiding');
		let origOffsetY = xiding.offsetTop;
		document.addEventListener('scroll', e => {
			window.scrollY >0 ? xiding.classList.add('top') : xiding.classList.remove('top');
		});*/
		var u = navigator.userAgent;
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		this.isIos=isiOS;
		document.querySelector('#head_top').addEventListener("touchmove",function(e){
       	  e.preventDefault();
        },false);
        if(this.isIos){
	        document.addEventListener("touchmove", function(){
	        	document.activeElement.blur();
	        }, false);
	    }
	},
	activated(){
        if(localStorage.getItem("isback")=='0'){
        	  this.sortShow=false;
        	  document.querySelector('.back_cover').style.display='none';
			  document.querySelector('.back_cover').style.top='0';
	    	  this.defaultSortName='综合';
	          this.sortIndex='0';
	          this.zSortHeight='0';
	          this.filter={sortName:'综合排序',sortVal:'',categoryId:'',categoryName:'全部分类',keyWord:'',sort:'0',hasCoupon:'',};
    	     // this.$refs.productList.filterShopList();
    	      this.keyWord=decodeURIComponent(this.$route.query.key);
              this.filter.keyWord=decodeURIComponent(this.$route.query.key);
              this.$refs.productList.clearShopList();
              let self=this;
              setTimeout(function(){
					self.$refs.productList.filterShopList();
			  },500);
              
        }
		// alert(decodeURIComponent(this.$route.query.key)+','+this.keyWord)
	},
    components:{
    	headTop,
    	productList,
    },
    methods:{
    	sortIsShow(){
			this.sortShow=this.sortShow?false:true;
			if(this.sortShow){
				//this.zSortHeight=document.querySelector('.zhSort').clientHeight;
				this.zSortHeight='1.93';
				document.querySelector('.back_cover').style.display='block';
				if(window.scrollY>0){
				  document.querySelector('.back_cover').style.top='0';
				}else{
				  document.querySelector('.back_cover').style.top='2.40rem';	
				}
			}else{
				this.hide();
			}
		},
		isHasCoupon(){
	    	if(this.filter.hasCoupon=='1'){
	    		this.filter.hasCoupon='';
	    	}else{
	    		this.filter.hasCoupon='1';
	    	}
	    	let log1 = "promotion_product.vue页面点击优惠券按钮";
            log(log1, log1);
	    },
	    sortSelect(index,val,sort){
	    	this.sortIndex=index;
	    	if(typeof(val)!="undefined"){
	    	  this.filter.sortVal=val;
	    	}
	    	if(typeof(sort)!="undefined"){
	    		this.filter.sort=0;
	    	}else{
	    		this.filter.sort=sort;
	    	}
	    	this.hide();
	    	this.$refs.productList.filterShopList();
	    },
	    sortSelectZ(name,val,sort){
	    	this.defaultSortName=name;
	    	this.filter.sortVal=val;
	    	this.filter.sort=sort;
	    	this.sortIndex='0';
			this.hide();
			this.$refs.productList.filterShopList();
	    },
	    isHasCoupon(){
	    	if(this.filter.hasCoupon=='1'){
	    		this.filter.hasCoupon='';
	    	}else{
	    		this.filter.hasCoupon='1';
	    	}
	    	this.hide();
	    	this.$refs.productList.filterShopList();
	    },
	    clearInput(){
	    	this.keyWord="";
	    },
	    search(){
	    	this.keyWord=trim(this.keyWord);
            if (this.keyWord == "") {
            	$j.toast("请输入搜索内容");
            	return
            }
            if (!isNormal(this.keyWord)) {
            	$j.toast("不能输入特殊字符");
            	return
            }
            if (this.keyWord.length > 15) {
            	$j.toast("搜索词不能超过15个字");
            	return
            }
	    	this.filter.keyWord=this.keyWord;
	    	this.$refs.productList.filterShopList();
	    	document.querySelector('.jelly-input-clear').blur();
	    },
	    hide(){
	    	this.sortShow=false;
	    	this.zSortHeight='0';
	    	document.querySelector('.back_cover').style.display='none';
			document.querySelector('.back_cover').style.top='0';
			
	    },
	    focuse(){
	    	this.hide();
	    	if(this.isIos && window.isNative){
			  //document.getElementById("head_top").style.top=document.body.scrollTop+"px";  
			  //document.querySelector('.jelly-input-row').style.top=document.body.scrollTop+0.88*parseFloat(document.querySelector('html').style.fontSize)+"px";
			  //document.querySelector('.sortM').style.top=document.body.scrollTop+1.58*parseFloat(document.querySelector('html').style.fontSize)+"px";
			  document.getElementById("head_top").style.position="absolute";		  
			  document.querySelector('.jelly-input-row').style.position='absolute';  
			  document.querySelector('.sortM').style.position='absolute'; 
			  document.body.scrollTop=0;
			}
	    },
	    blur(){
	    	if(this.isIos && window.isNative){
			  document.getElementById("head_top").style.position="fixed";   
			  document.querySelector('.jelly-input-row').style.position='fixed';   
			  document.querySelector('.sortM').style.position='fixed';
			  //document.getElementById("head_top").style.top="0";  
			  //document.querySelector('.jelly-input-row').style.top=0.88*parseFloat(document.querySelector('html').style.fontSize)+"px";
			  //document.querySelector('.sortM').style.top=1.58*parseFloat(document.querySelector('html').style.fontSize)+"px";
		    }
	    }
   },
   watch:{
    	filter: {
	　　　　handler(newValue, oldValue) {
		       console.log(newValue);
	　　　　　　 if(!this.isFirst){
	             //this.$refs.productList.filterShopList();
	           }
	　　　　},
	　　　　deep: true
	　　 },
    	sortShow(curVal,oldVal){    //监听禁止滚动
    	  if(curVal){
    		document.querySelector("body").style.overflow="hidden";
    	  }else{
    	  	document.querySelector("body").style.overflow="auto";
    	  }
    	}
    }
}
</script>

<style lang="scss" scoped="">
   @import 'src/style/mixin';
   .jf-content{
    	padding-top: 0.88rem;
    	.top{
    		position: fixed;
		    z-index: 101;
		    width: 100%;
		    top:0;
    	}
    }
   .sortM{
   	    transform: translate3d(0,0,0);
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.15);
		font-size: 0.26rem;
		background: rgb(255,255,255);
		position:relative;
		z-index: 99;
		padding-top: 0.1rem;
		position: fixed;
        width: 100%;
        top:1.58rem;
		.sortD{
			overflow:hidden;
			zoom:1;
			padding-top: 0.08rem;
            padding-bottom: 0.18rem;
			li{
				height: 0.44rem;
				line-height: 0.44rem;
				display: inline-block;
				float: left;
				background: rgb(245,245,245);
				margin-left: 0.2rem;
				text-align: center;
			}
			.zh{
				margin-left: 0.28rem;
				width: 2.44rem;
				position: relative;
				padding-right: 0.45rem;
				color: rgb(153,153,153);
				.triangle_border_up{
					display: inline-block;
				    width:0;
				    height:0;
				    border-width: 0 0.14rem 0.16rem;
				    border-style:solid;
				    border-color:transparent transparent rgb(102,102,102);/*透明 透明  灰*/
				    position:absolute;
				    right: 0.11rem;
				    bottom: 0.13rem;
				    transform: rotate(180deg);
				}
				.up{
					 transform: rotate(0deg);
				}
			}
			.yj{
				width: 0.91rem;
				color: rgb(153,153,153);
			}
			.xl{
				width: 0.91rem;
				color: rgb(153,153,153);
			}
			.yhq{
				width: 1.93rem;
				color: rgb(153,153,153);
			}
		}
		.sortL{
			overflow: hidden;
			height: 0;
			/*position: relative;*/
			/*transition: height 0.3s;*/
			.zhSort{
				position: absolute;
			    z-index: 11;
			    width: 2.92rem;
			    transition: height 0.3s;
			    background: rgb(255,255,255);
				overflow: hidden;
				li{
					width: 2.44rem;
					text-align: center;
					background: rgb(245,245,245);
					margin-bottom: 0.2rem;
					margin-left: 0.28rem;
					padding-left:0.19rem ;
					height: 0.44rem;
					line-height: 0.44rem;
				}
			}
		}
	}
	.isSelect{
		color: rgb(1,0,0) !important;
	}
	.jelly-search{
		transform: translate3d(0,0,0);
		position: relative;
		font-size: 0;
		padding:0.1rem 0.28rem;
		padding-bottom: 0;
		background-color: rgb(255,255,255);
		input[type=search]{
			padding: 0 0.5rem;
			font-size: 0.28rem;
		    -webkit-box-sizing: border-box;
		    box-sizing: border-box;
		    height: 0.64rem;
		    text-align: left;
		    border: 0;
		    border-radius: 0.32rem;
		    background-color: rgba(0,0,0,0.2);
		    width: 100%;
		    -webkit-tap-highlight-color: transparent;
		    -webkit-appearance: none;
		    outline: none;
		}
		input::-webkit-search-decoration,
		input::-webkit-search-cancel-button {
		   display: none;
        }
		.jelly-placeholder{
			font-size: 16px;
		    line-height: 34px;
		    position: absolute;
		    z-index: 1;
		    top: 0.1rem;
		    right: 0;
		    bottom: 0;
		    left: 0;
		    display: inline-block;
		    height: 34px;
		    text-align: center;
		    color: #999;
		    border: 0;
		    border-radius: 6px;
		    background: 0 0;
		    
		    .place-content{
		    	color: rgb(255,255,255);
		    }
		}
	}
	.jelly-icon{
	    display: inline-block;
	    height: 0.3rem;
	    width: 0.3rem;
	    vertical-align: middle;
	}
	.search-before{
		position: absolute;
		left: 0.38rem;
        top: 0.27rem;
	}
	.jelly-icon-search{
    	background: url(../../images/search.png) no-repeat;
    	background-size: 100% 100%;
    }
	.jelly-input-row {
	        clear: left;
		    overflow: hidden;
		    position: fixed;
		    top: 0.88rem;
		    z-index: 100;
		    width: 100%;
	}
	.jelly-icon-clear{
		background: url(../../images/search_close.png) no-repeat;
    	background-size: 100% 100%;
    	position: absolute;
    	right: 0.38rem;
        top: 0.27rem;
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
	.xiding{
      background: white;
    }
</style>