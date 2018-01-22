<template>
    <div>
	      <head-top :goBack="true" :headTitle="headTitle">
	      	   <section slot="add">
	      	   	<div class="search"  @click="goPage('search')">
	      	       <img class="search_right" src="../../images/search.png" />
	      	    </div>
	      	   </section>
	      </head-top>
    	<div class="jf-content">
    		<div class="xiding">
				<!--<nav class="typeNav">
					<div class="swiper-container">
						<div class="swiper-wrapper">
							<div v-for="(item, index) in typeNavs" class="swiper-slide" :class="{active: index == clickedIndex}" :cId="item.categoryId"><span>{{item.categoryName}}</span></div>
						</div>
					</div>
		    		<div class="show_all_type" :class="{choose_type: showAllType}" style="border-left: 1px solid #E6E6E6;transform: translate3d(0,0,0);">
		    			<div class="show_all_type_container" @click="show()">
		    				<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="show_icon">
				    			<path d="M0 4 L5 10 L10 4"  stroke="#BABABA" stroke-width="2" fill="none"/>
				    		</svg>
		    			</div>
		    		</div>
		    		<transition name="showlist">
		    			<section class="filter_container">
		    				<section style="width: 100%;">
				    			<header class="filter_header_style" @touchmove.prevent>
				    				<span>全部分类</span>
						    		<div class="show_all_type">
						    			<div class="show_all_type_container" style="background-color: #F8F8F8;" @click="hide()">
						    				<svg width="10" height="11" xmlns="http://www.w3.org/2000/svg" version="1.1" class="show_icon">
								    			<path d="M1 7 L6 1 L11 7"  stroke="#BABABA" stroke-width="2" fill="none"/>
								    		</svg>
						    			</div>
						    		</div>
						    	</header>		    				
		    					<ul class="filter_ul">
		    						<li v-for="(item,index) in typeNavs" :key="index" class="filter_li" @click="chooseType(index)"  :class="{selected_filter: clickedIndex == index}">
		    							<span>{{item.categoryName}}</span>
		    						</li>
		    					</ul>
		    				</section>
		    			</section>
		    		</transition>
				</nav>-->
				
				<div class="allSort">
					<div class ="allsort-w"> 
				       	<div class="sortMenu clearfix">
					        <ul class="sortMenu-ul" ref="sortMenu">
					          <li class="cell" v-for="(item, index) in typeNavs" :class="{active: index == clickedIndex}" @click="chooseType(index)">
					            <span>{{item.categoryName}}</span>
					          </li>
					        </ul>
					        <div class="all" v-on:click="show()">
								<img src="../../images/sy-down.png"/>
					        </div>
					        <div v-show="showAllType" class="pull-down">
								<header class="filter_header_style" @touchmove.prevent>
									<span>全部分类</span>
						    		<div class="show_all_type">
						    			<div class="show_all_type_container" style="background-color: #F8F8F8;" @click="hide()">
						    				<span class="show_icon">
							    				<img src="../../images/sy-up.png">
									    	</span>
						    			</div>
						    		</div>
						    	</header>
								<ul class="filter_ul">
									<li v-for="(item,index) in typeNavs" :key="index" class="filter_li" @click="chooseType(index)"  :class="{selected_filter: clickedIndex == index}">
										<span>{{item.categoryName}}</span>
									</li>
								</ul>
					        </div>
				      	</div>
						</div>
		        </div>
				
				
				
				
				<div class="sortM" @touchmove.prevent>
					<ul class="sortD">
						<li :class="{zh:true,isSelect:sortIndex==0}" @click="sortIsShow">
							{{defaultSortName}}
							<div :class="{triangle_border_up:true,up:sortShow}">
							</div>
						</li>
						<li :class="{yj:true,isSelect:sortIndex==1}" val="pcCommission" @click="sortSelect('1','wlCommission','0','MJingFen_SalesVolume')">佣金</li>
						<li :class="{xl:true,isSelect:sortIndex==2}" val="inOrderCount30Days" @click="sortSelect('2','inOrderCount30Days','0','MJingFen_ProductBrokerage')">销量</li>
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
			<productList ref="productList" :filter="filter"  page="list" @chooseNextType="chooseNextType">
				
			</productList>
		</div>
		<div v-show="isBackdrop" class="mui-backdrop" style="display: none;" @click="dis_appear()"></div>
    </div>    
</template>

<script>
import {mapMutations} from 'vuex'
import productList from 'src/components/product/product'
import headTop from 'src/components/header/head'
import {imgBaseUrl,loginUrl} from 'src/config/env'
import {showBack, animate,getStore,log} from 'src/config/mUtils'
import {getImgPath} from 'src/components/common/mixin'
import {getProxy,jsonpProxyApiX} from 'src/service/proxy'

import 'src/components/jelly/jelly.js'
import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'


export default {
	data(){
        return {
        	sortShow:false,   //排序是否展开
        	filter:{
        	   sortName:'综合排序',
               sortVal:'',//默认为空
               categoryId:'',
               categoryName:'全部分类',
               keyWord:'',
               sort:'0',
               hasCoupon:'',//是否有优惠券
        	},
        	isback:false, //是否返回页
        	defaultSortName:'综合',
        	sortIndex:'0',
        	zSortHeight:'0',
            headTitle:"商品推广",
            shopList:[],
            imgBaseUrl,
            isBottom:false,
            isBackdrop:false,
            isSort:false,
            isProductBoxShow:false,  //商品盒子是否显示
            isAddProductShow:false,// 商品库添加是否显示
            typeNavs:[{categoryName:'精选',categoryId:''}],
            sortWordLeft: [],
            clickedIndex: 0,
            showAllType: false,
            sortList:[{name:'综合',val:'',log:"MJingFen_Synthesize"},
                      {name:'价格从高到低',val:'wlPrice',sort:'0',log:"MJingFen_PriceHighToLow"},
                      {name:'价格从低到高',val:'wlPrice',sort:'1',log:"MJingFen_PriceLowToHigh"},
                    ],
            jumpMap:{
               search:{path:"/search",log:"MJingFen_ProductSearch"}
            }
        }
    },
    activated(){
    	if(localStorage.getItem("isback")=='0'){
	    	  this.defaultSortName='综合';
	          this.sortIndex='0';
	          this.zSortHeight='0';
	          this.filter={sortName:'综合排序',sortVal:'',categoryId:'',categoryName:'全部分类',keyWord:'',sort:'0',hasCoupon:'',};
    	      this.getCategory();
    	}else{
    		document.querySelector('.sortMenu').scrollLeft = this.sortWordLeft[this.clickedIndex];
    	}
    },
    beforeRouteEnter(to,from,next){
       if(from.fullPath.indexOf("home")>-1 || from.fullPath=="/"){
    	   localStorage.setItem("isback",'0');
       }else{
       	   localStorage.setItem("isback",'1');
       }
       next();
    },
    mounted(){
       //获取商品分类
       this.getCategory();
       //this.$route.meta.keepAlive=true;
       document.querySelector('#head_top').addEventListener("touchmove",function(e){
       	  e.preventDefault();
       },false);
    },
    components: {
    	headTop,
/*    	loading,*/
    	productList,
    },
    computed: {

    },
    methods: {
		/**
		 * 导航栏
		 */
		chooseType(index){
			// this.scrollTop = document.scrollingElement.scrollTop;
			this.clickedIndex = index;
			document.querySelector('.sortMenu').scrollLeft = this.sortWordLeft[index];
			this.hide();
			this.filter.categoryId = this.typeNavs[index]['categoryId'];
            this.filter.categoryName = this.typeNavs[index]['categoryName'];
            log("MJingFen_ProductClass", this.filter.categoryName);
            //this.$refs.productList.filterShopList();
		},
		chooseNextType(){
			let length = this.typeNavs.length;
			if(this.clickedIndex >= length-1){
			   this.clickedIndex = 0;	
			}else{
			   this.clickedIndex++;
			}
			// this.showAllType = false;
			// this.freeSwiper.slideTo(this.clickedIndex);
			this.chooseType(this.clickedIndex);
		},
		async show(){
			//MVVM 数据绑定有延迟，不适合快速切换样式场景
			// this.showAllType = false;
			//MVVM 数据绑定有延迟，不适合快速切换样式场景
			// this.showAllType = true;
			// this.scrollTop = document.scrollingElement.scrollTop;
			if(window.scrollY < (this.origOffsetY - 0.88*parseFloat(document.querySelector('html').style.fontSize))){
				document.body.scrollTop=this.origOffsetY - 0.88*parseFloat(document.querySelector('html').style.fontSize);
			}
			document.querySelector('.back_cover').style.display='block';
			document.querySelector('.pull-down').style.display='block';
			// document.body.style.cssText="height:100%;overflow:hidden;";
			document.querySelector("body").style.overflow="hidden";
		},
		async hide(){
			// this.showAllType = false;
			document.querySelector('.back_cover').style.display='none';
			document.querySelector('.pull-down').style.display='none';
			document.querySelector("body").style.overflow="auto";
			this.sortShow=false;
	    	this.zSortHeight='0';
		},
		getSortWordLeft(){
            const listContainer = this.$refs.sortMenu;
            const listArr = Array.from(listContainer.children);
            listArr.forEach((item, index) => {
                this.sortWordLeft[index] = item.offsetLeft + item.clientWidth/2 - document.body.clientWidth/2;
                if(this.sortWordLeft[index] < 0) this.sortWordLeft[index] = 0;
            });
            console.log(this.sortWordLeft)
        },
		getCategory(){
    		let self = this;

	       //	getProxy('/adv/getCategories?pageNum=1&pageSize=100').then(res => {
	       	jsonpProxyApiX("getCategories",{pageNum:1,pageSize:100}).then(res => {
	       		if(Object.prototype.toString.call(res.data) == '[object Array]'){
	       			this.typeNavs = [...this.typeNavs, ...res.data];
	       		}else{
	       			// this.banners.push(res.data);
	       		}
	       		this.$nextTick(() => {
					//吸顶
					//吸顶
					/*let typeNav = document.querySelector('.xiding');
					let origOffsetY = typeNav.offsetTop;
					document.addEventListener('scroll', e => {
						window.scrollY >= 1 ? typeNav.classList.add('top') : typeNav.classList.remove('top');
					});*/

					this.getSortWordLeft();

					document.querySelector('.pull-down').style.width=document.body.clientWidth+'px'

					this.smartScroll('.filter_ul');
					//this.chooseType(0);
	       		})
	        })
    	},
		sortIsShow(){
			this.sortShow=this.sortShow?false:true;
			if(this.sortShow){
				//this.zSortHeight=document.querySelector('.zhSort').clientHeight;
				this.zSortHeight='1.93';
				document.querySelector('.back_cover').style.display='block';
				if(window.scrollY>0){
				  document.querySelector('.back_cover').style.top='0';
				}else{
				  document.querySelector('.back_cover').style.top='2.48rem';
				}
			}else{
				this.zSortHeight='0';
				document.querySelector('.back_cover').style.display='none';
				document.querySelector('.back_cover').style.top='0';
				//this.sortSelect('0');
			}
			//this.$refs.productList.filterShopList();
		},
	    sortSelect(index,val,sort,log1){
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
            log(log1);
            //this.$refs.productList.filterShopList();
	    },
	    sortSelectZ(name,val,sort,log1){
	    	this.sortShow=false;
	    	this.defaultSortName=name;
	    	this.filter.sortVal=val;
	    	this.filter.sort=sort;
	    	this.zSortHeight='0';
	    	this.sortIndex='0';
	    	document.querySelector('.back_cover').style.display='none';
			document.querySelector('.back_cover').style.top='0';
            log(log1);
            //this.$refs.productList.filterShopList();
	    },
	    isHasCoupon(){
	    	if(this.filter.hasCoupon=='1'){
	    		this.filter.hasCoupon='';
	    	}else{
	    		this.filter.hasCoupon='1';
	    	}
            log('MJingFen_CouponProductOnly');
            this.hide();
            //this.$refs.productList.filterShopList();
	    },
	    goPage(page){
	    	this.hide();
	    	log(this['jumpMap'][page]['log']);
	        setTimeout(() => {
	        	this.$router.push({path: this['jumpMap'][page]['path']});
	        },100)
	    },
	    smartScroll(selectorScrollable) {
			let self = this;

		    // 如果没有滚动容器选择器，或者已经绑定了滚动时间，忽略
		    if (!selectorScrollable) {
		        return;
		    }

		    // 是否是搓浏览器
		    // 自己在这里添加判断和筛选

		    self.scrollElement = {
		        posY: 0,
		        maxscroll: 0
		    };

		    document.querySelector(selectorScrollable).addEventListener('touchstart', event => {

	            let events = event.touches && event.touches[0] || event;
	            
	            // 先求得是不是滚动元素或者滚动元素的子元素
	            let elTarget = event.target;

	            if (!elTarget) {
	                return;    
	            }
	            
	            // 垂直位置标记
	            self.scrollElement.posY = events.pageY;
	            self.scrollElement.scrollY = document.querySelector(selectorScrollable).scrollTop;
	            // 是否可以滚动
	            self.scrollElement.maxscroll = document.querySelector(selectorScrollable).scrollHeight - document.querySelector(selectorScrollable).clientHeight;
	        })

	        document.querySelector(selectorScrollable).addEventListener('touchmove', event => {
	            // 如果不足于滚动，则禁止触发整个窗体元素的滚动
	            if (self.scrollElement.maxscroll <= 0) {
	                // 禁止滚动
	                event.preventDefault();
	            }
	            // 当前的滚动高度
	            let scrollTop = document.querySelector(selectorScrollable).scrollTop;
	    
	            // 现在移动的垂直位置，用来判断是往上移动还是往下
	            let events = event.touches &&event.touches[0] || event;
	            // 移动距离
	            let distanceY = events.pageY - self.scrollElement.posY;
	    
	            // 上下边缘检测
	            if (distanceY > 0 && scrollTop == 0) {
	                // 往上滑，并且到头
	                // 禁止滚动的默认行为
	                event.preventDefault();
	                return;
	            }
	    
	            // 下边缘检测
	            if (distanceY < 0 && (scrollTop + 1 >= self.scrollElement.maxscroll)) {
	                // 往下滑，并且到头
	                // 禁止滚动的默认行为
	                event.preventDefault();
	                return;
	            }
	        })

			
		    document.querySelector(selectorScrollable).addEventListener('touchend', event => {
	            self.scrollElement.maxscroll = 0;
		    });
		}
    },
    watch:{
    	filter: {
	　　　　handler(newValue, oldValue) {
	　　　　　　this.$refs.productList.filterShopList();
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

<style lang="scss" scoped>
    @import 'src/style/mixin';
	.search{
		position:absolute;
		top:0;
		right:0;
		height:100%;
		line-higth:0.88rem;
		font-size:0;
		padding:0.22rem 0.3rem;
	    .search_right{
	    	/*left: auto !important;*/
		    width: 0.40rem;
		    height: 0.40rem;
		    /*right: 0.30rem;*/
		    /*@include ct;*/
	    }
	}
    .jf-content{
    	padding-top: 0.88rem;
    	.top{
    		position: fixed;
		    z-index: 101;
		    width: 100%;
		    top:0;
    	}
    }
    .typeNav {
    	/*box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.15);*/
    	box-shadow: 0 0.02rem 0.04rem rgba(0,0,0,0.15);
		width: 100%;
		display: flex;
		z-index: 13;
		/*box-sizing: border-box;*/
		font: 0.28rem hiragino sans gb, microsoft yahei, simsun;
		z-index: 14;
		background-color: #fff;
		.swiper-container{
			flex: 1;
			background-color: #fff;
			height: 0.8rem;
			.swiper-slide {
				padding: 0 0.195rem;
				letter-spacing: auto;
				width: auto;
				text-align:center;
				span{
					transition:all .3s ease;
					display: block;
					line-height: 0.78rem;
					border-bottom: 0.02rem solid #fff;
				}
			}
			.active span{
				color:#FF2D2D;
				border-bottom: 0.02rem solid #FF2D2D;
			}
		}
		.show_all_type{
			width: 0.78rem;
			height: 0.8rem;
			text-align: center;
			.show_all_type_container{
				@include wh(100%, 100%);
				position: relative;
				background-color: #fff;
				box-sizing: border-box;
			}
			.show_icon{
				@include center;
				@include wh(0.24rem, 0.24rem);
				vertical-align: middle;
				transition: all .3s;
				fill:#666;
			}
			
		}
		.choose_type{
			.show_all_type_container{
				.show_icon{
					transform: rotateX(180deg);
				}
			}
		}
		.showlist-enter-active, .showlist-leave-active {
			transition: all .3s;
			transform: translateY(0);
		}
		.showlist-enter, .showlist-leave-active {
			opacity: 0;
			transform: translateY(-100%);
		}
		.filter_container{
			flex-direction: column;
			align-items: flex-start;
			background-color: #f1f1f1;
			z-index: 100;
			width: 100%;
			position: absolute;
			display: none;
			left: 0;
			.filter_header_style{
				@include sc(0.28rem, #333);
				line-height: 0.8rem;
				height: 0.8rem;
				padding-left: 0.3rem;
				background-color: #F8F8F8;
				display: flex;
				span {
					flex: 1;
					text-align: left;
				}
			}
			.filter_ul{
				display: flex;
				flex-wrap: wrap;
				background-color: #fff;
				max-height: 4.4rem;
				overflow-y: auto;
				.filter_li{
					display: flex;
					align-items: center;
					@include fj(center);
					border: 0.01rem solid #eee;
					@include wh(25%, 0.88rem);
					span{
						@include fj(center);
						@include sc(0.28rem, #010101);
					}
				}
				.selected_filter{
					border-bottom: 0.02rem solid $red;
					span{
						color: $red;
					}
				}
			}
		}
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
	.sortM{
		transform: translate3d(0,0,0);
		box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.15);
		font-size: 0.26rem;
		background: rgb(255,255,255);
		z-index: 99;
		position: fixed;
	    top: 1.68rem;
	    width: 100%;
		.sortD{
			box-shadow: 0 0.02rem 0.04rem 0 rgba(0, 0, 0, 0.15) inset;
			overflow:hidden;
			zoom:1;
			padding-top: 0.18rem;
            padding-bottom: 0.18rem;
            /*border-bottom: 1px solid rgb(221,221,221);*/
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
		color: rgb(0,0,0) !important;
	}
	.xiding{
		background: rgb(255,255,255);
		min-height: 1.5rem;
	}
	
	
	
	.show_all_type{
		width: 0.78rem;
		height: 0.8rem;
		text-align: center;
		display: inline-block;
		.show_all_type_container{
			@include wh(100%, 100%);
			position: relative;
			background-color: #fff;
			box-sizing: border-box;
		}
		.show_icon{
			@include center;
			line-height: 0;
			img{
				@include wh(0.24rem, 0.24rem);
			}
		}
		
	}
	.showcover-enter-active, .showcover-leave-active {
		transition: opacity .3s
	}
	.showcover-enter, .showcover-leave-active {
		opacity: 0
	}
	.allSort{
		position: relative;
		 background-image: url('../../images/sy-bj.png');
		 background-size: 0.78rem 0.66rem;
		 background-repeat: no-repeat;
		 background-position: center right;
		 background-color: #fff;
		 transform: translate3d(0,0,0);
		 width: 100%;
		 z-index: 100;
		 position: fixed;
		.active{
			border-bottom: 2px solid #FF2D2D!important;
			span{
				color:#FF2D2D;
			}
		}
	}
	.sortMenu{
	  width: calc(100% - 0.83rem);
	  overflow-x: scroll;
	  overflow-y: hidden;
	  -webkit-overflow-x: scroll;
	  
	}
	.sortMenu::-webkit-scrollbar{ 
	  width: 0; 
	  height: 0;   
	  background-color: #fff;
	}
	.sortMenu-ul { 
	  display: -webkit-box;
	  display: -moz-box;
	
	}
	.sortMenu .cell{ 
		display: block;
		font-size: 0.28rem;
		margin: 0px 0.7em;
		height: 0.8rem;
		line-height: 0.8rem;
		text-align: center;
		position: relative;
	}
	.sortMenu .cell.special a{
	  color: #ff474c;
	}
	.sortMenu .cell.special:before {
	  content: '';
	  height: 2px;
	  width: 100%;
	  background: #ff474c;
	  position: absolute;
	  bottom: 0px;
	}
	.sortMenu .all{
	  right: 0.035rem;
	  top: 0;
	  @include wh(0.78rem, 0.8rem);
	  position: absolute;
	  background: #fff;
	  z-index: 99;
	  display: flex;
	  justify-content:center;
	  align-items:center;
	}
	.sortMenu .all:before{
	  content: '';
	  height: 0.7rem;
	  width: 1px;
	  position: absolute;
	  box-shadow: 1px 0px 1px #e0e0e0;
	  left: 0px;
	}
	.sortMenu .all img{
	  display: block;
	  width: 0.24rem;
	}
	.sortMenu .pull-down{
	  position: absolute;
	  top: 0;
	  height:auto;
	  width: 100%;
	  background: #fff;
	  z-index: 999;
	}
	.pull-down-sort{
	  width: 100%;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  align-content: space-around;
	  flex-wrap: wrap;
	  flex-direction: row;
	}
	.pull-down-sort li{
	  float: left;
	  padding: .1rem;
	}
	.pull-down-sort li a:hover{
	  color: #ff474c;
	}
	.filter_header_style{
		@include sc(0.28rem, #333);
		line-height: 0.8rem;
		height: 0.8rem;
		padding-left: 0.3rem;
		background-color: #F8F8F8;
		display: flex;
		span {
			flex: 1;
			text-align: left;
		}
	}
	.filter_ul{
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		max-height: 4.4rem;
		overflow-y: scroll;
		-webkit-overflow-y: scroll;
		.filter_li{
			display: flex;
			align-items: center;
			@include fj(center);
			text-align: center;
			border: 1px solid #eee;
			@include wh(25%, 0.88rem);
			span{
				@include fj(center);
				@include sc(0.28rem, #010101);
			}
		}
		.selected_filter{
			border-bottom: 2px solid $red;
			span{
				color: $red;
			}
		}
	}
	.filter_ul::-webkit-scrollbar{ 
	  width: 4px; 
	  height: 1rem;   
	  background-color: rgb(186, 186, 186);
	}
	.allsort-w{
		position:relative;
		
	}
</style>
