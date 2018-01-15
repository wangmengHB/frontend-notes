<template>
    <div id="home">
        <section class="index-searchbar" @click="gotoPage('search')">
			<div class="searchbox">
				<div class="input"></div>
				<div class="center"><img src="../../images/search.png" /><span>搜索想要赚佣金的商品</span></div>
			</div>
        </section>
        <div class="index-main">
	    	<nav class="index-carousel">
	    		<div class="swiper-container" v-if="banners.length > 1">
			        <div class="swiper-wrapper">
			            <div class="swiper-slide" v-for="(item, index) in banners" :key="index">
		            		<img :src="imgBaseUrl + '/s640x290_' + item.imgUrl+'!q70'"   @click="gotoPage('banner', index, item.jumpUrl)">
			            </div>
			        </div>
			        <div class="swiper-pagination"></div>
			    </div>
			    <img :src="imgBaseUrl + '/s640x290_' + banners[0].imgUrl" v-else-if="banners.length == 1" class="index-banner" @click="gotoPage('banner', 0, banners[0].jumpUrl)">
			    <img src="../../images/bannerDefault.png" class="fl_back" v-else>
	    	</nav>
			<section class="index-tags">
				<ul>
					<li @click="gotoPage('product')">
						<img src="../../images/goods.png">
						<div>商品</div>
					</li>
					<li @click="gotoPage('activity')">
						<img src="../../images/activity.png">
						<div>热门活动</div>
					</li>
					<li @click="gotoPage('smart')">
						<img src="../../images/smart.png">
						<div>好货清单</div>
					</li>
					<li @click="gotoPage('translink')" v-show="showTranslink">
						<img src="../../images/translink.png">
						<div>转链</div>
					</li>
					<li @click="gotoPage('tutorial')" v-show="!iosStyle">
						<img src="../../images/tutorial.png">
						<div>新手教程</div>
					</li>
				</ul>
			</section>
			<section class="good_coupons">
				<img src="../../images/good_coupons.png" />
				<div style="width: 5.64rem; height:0.576rem; border-bottom: 0.02rem solid #EAEAEA; margin-left: 0.175rem;">
				</div>
			</section>
<!-- 			<nav class="typeNav">
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<div v-for="(item, index) in typeNavs" class="swiper-slide" :class="{active: index == clickedIndex}"><span>{{item.categoryName}}</span></div>
					</div>
				</div>
	    		<div class="show_all_type" :class="{choose_type: showAllType}" style="border-left: 0.01rem solid #E6E6E6;">
	    			<div class="show_all_type_container" @click="show()">
	    				<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="show_icon">
			    			<path d="M0 4 L5 10 L10 4"  stroke="#BABABA" stroke-width="2" fill="none"/>
			    		</svg>
	    			</div>
	    		</div>
	    		<transition name="showlist">
	    			<section class="filter_container">
	    				<section style="width: 100%;" class="container">
			    			<header class="filter_header_style">
			    				<span>全部分类</span>
					    		<div class="show_all_type">
					    			<div class="show_all_type_container" style="background-color: #F8F8F8;" @click="hide()">
					    				<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="show_icon">
							    			<path d="M0 6 L5 0 L10 6"  stroke="#BABABA" stroke-width="2" fill="none"/>
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
			</nav> -->
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
	    	<transition name="showcover">
	    		<div class="back_cover" v-show="showAllType" @touchmove.prevent></div>
	    	</transition>
	    	<div class="html-productList">
				<productList :xidingHeight="xidingHeight" v-if="hasGetData" ref="productList" :filter="filter" page="home" @chooseNextType="chooseNextType"></productList>
			</div>
	    </div>
    	<foot-guide></foot-guide>
    </div>    
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {imgBaseUrl} from 'src/config/env'
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footer/footGuide'
import productList from 'src/components/product/product'
import {log, setSession} from 'src/config/mUtils'
import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
import {getJsonp} from 'src/service/getData'
import 'src/plugins/swiper.min.js'
import 'src/style/swiper.min.css'
import {weixinShare} from 'src/config/weixin_share'
import {agreement} from 'src/components/common/mixin'

export default {
	data(){
        return {
        	banners: [], //轮播图
        	noticeId: null, //公告id
            title: "", //公告标题
            releaseTime: "", //公告发布时间
            hasGetData: true, //是否展示活动推广列表
            jumpMap: { //页面跳转埋点日志
            	search: {path: "/search", log: "MJingFen_Search"},
            	banner: {path: "", log: "MJingFen_Banner"},
            	product: {path: "/promotion_product", log: "MJingFen_Tab", val: "商品推广"},
            	activity: {path: "/promotion_activity", log: "MJingFen_Tab", val: "活动推广"},
            	smart: {path: "/znmc/index.html?islm=1", log: "MJingFen_Tab", val: "智能卖场"},
            	translink: {path: "/translink", log: "MJingFen_Tab", val: "转链"},
            	tutorial: {path: "/helpnew", log: "MJingFen_Tab", val: "新手教程"},
            },
            typeNavs:[],
            clickedIndex: 0,
            showAllType: false,
            sticky: false,
            sortWordLeft: [],
            xidingHeight:0,
        	filter:{

        	},
            imgBaseUrl: imgBaseUrl,
			showTranslink: true,
			isShowArrowClick:false,   //展示解决，添加点击显示分类时的判断
        }
    },
    created(){
		if (window.os) {
	        if(window.version != 2){
	        	this.showTranslink = false;
	        }
	        if(!iosStyle){
	        	this.typeNavs.push({categoryName:'精选',categoryId:''});
	        	this.filter = {
					sortName:'销量',
					sortVal:'inOrderCount30Days',//默认为空
					categoryId:'',
					categoryName:'精选',
					keyWord:'',
					hasCoupon: 1,//是否有优惠券
				}
	        }
		}else{
        	this.typeNavs.push({categoryName:'精选',categoryId:''});
        	this.filter = {
				sortName:'销量',
				sortVal:'inOrderCount30Days',//默认为空
				categoryId:'',
				categoryName:'精选',
				keyWord:'',
				hasCoupon: 1,//是否有优惠券
			}
		}

		//获取商品分类
		this.getCategory();

        //获取banner
        this.getBanner();
    },
    mounted(){
    	//首页必须强制判断是否登陆，否则登陆cookie失效，而localStorage为登录
    	this.getUserInfo();

        //获取banner
        // this.getBanner();

        //获取商品分类
        // this.getCategory();
        //document.querySelector('.product_listFirst').style.minHeight=(window.screen.height-(0.88*parseFloat(document.querySelector('html').style.fontSize)))+'px';
       // document.querySelector('.product_listFirst').style.minHeight=document.body.clientHeight+'px';
        //document.querySelector('.product_listFirst').style.minHeight=window.screen.height+"px";
        //document.querySelector('.product_listFirst').style.marginBottom="0.98rem";
        
        weixinShare();
        
        
    //     window.addEventListener('popstate', (event) => {
    //     	if(typeof this.carousel == 'object' && this.carousel.autoplayPaused){
    //     		let self = this;
    //     		self.carousel.update();
				// self.carousel.slideNext();
    //     	}
    //     })
    },
    components: {
    	headTop,
    	productList,
    	footGuide,
    },
    computed: {
        ...mapState([
            'isLogin', 'userInfo'
        ]),
        iosStyle: function(){
        	return window.iosStyle
        }
    },
    // activated: function (){
    // 	document.querySelector('.sortMenu').scrollLeft = this.sortWordLeft[this.clickedIndex];
    // },
	mixins: [agreement],
    methods: {
    	...mapActions([
    		'getUserInfo'
    	]),
    	getBanner(){
	       //	getProxy('/homePicture').then(res => {
	       	jsonpProxyApiX("homePicture",{}).then(res => {
	       	if(Object.prototype.toString.call(res.data) == '[object Array]'){
	       			this.banners = res.data;
	       		}else if(res.data){
	       			this.banners.push(res.data);
	       		}
	       		if(this.banners.length > 1){
		       		this.$nextTick(() => {
		        		this.carousel = new Swiper('.index-carousel .swiper-container', {
					        pagination: '.index-carousel .swiper-pagination',
					        autoplay: 3000,//可选选项，自动滑动
					        speed: 1000,
					        loop: true,//设置为true 则开启loop模式。loop模式：会在原本slide前后复制若干个slide并在合适的时候切换，让Swiper看起来是循环的。 
							slidesPerView : 'auto',
							autoplayDisableOnInteraction: false,
							centeredSlides : true,
							paginationClickable: true,
							watchSlidesProgress: true,
							observer: true,
							observeParents: true,
							paginationBulletRender(swiper, index, className) {
								return `<span class="${className}" style="width:0.28rem;!important;height:0.05rem;background:none!important;">
									<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 840 150" preserveAspectRatio="xMidYMid meet">
										<g id="layer1" fill="#ffffff" stroke="none">
											<path d="M0 138 c0 -6 16 -40 35 -75 l36 -63 384 0 c284 0 385 3 385 12 0 6 -16 40 -35 75 l-36 63 -384 0 c-284 0 -385 -3 -385 -12z"/>
										</g>
									</svg>
								</span>`
							},
						    onProgress: function(swiper) {
						        for (var i = 0; i < swiper.slides.length; i++) {
						            var slide = swiper.slides[i];
						            var progress = slide.progress;
						            var scale = 1 - Math.min(Math.abs(progress * 0.07), 1);

						            let es = slide.style;
						            es.opacity = 1 - Math.min(Math.abs(progress / 2), 1);

						            	es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'scale(' + scale +')';

						        }
						    },
						    onSetTransition: function(swiper, speed) {
						        for (var i = 0; i < swiper.slides.length; i++) {
						            let es = swiper.slides[i].style;
						            es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
						        }

						    }
						})
		       		})
				}
	        })
    	},
        getSortWordLeft(){
            const listContainer = this.$refs.sortMenu;
            const listArr = Array.from(listContainer.children);
            listArr.forEach((item, index) => {
                this.sortWordLeft[index] = item.offsetLeft + item.clientWidth/2 - document.body.clientWidth/2;
                if(this.sortWordLeft[index] < 0) this.sortWordLeft[index] = 0;
            });
        },
    	getCategory(){
    		let self = this;
	       	//getProxy('/adv/getCategories?pageNum=1&pageSize=100').then(res => {
	        jsonpProxyApiX("getCategories",{hasCoupon:1}).then(res => {
				
	       		if(Object.prototype.toString.call(res.data) == '[object Array]'){
	       			this.typeNavs = [...this.typeNavs, ...res.data];
	       			if(iosStyle){
			        	this.filter = {
							sortName:'综合排序',
							sortVal:'',//默认为空
							categoryId: this.typeNavs[0] && this.typeNavs[0]['categoryId'] || '',
	            			categoryNam: this.typeNavs[0] && this.typeNavs[0]['categoryName'] || '',
							keyWord:'',
							hasCoupon: 1,//是否有优惠券
						}
	       			}
	       		}else{
	       			// this.banners.push(res.data);
	       		}

	       		this.$nextTick(() => {
	       			this.origOffsetY = document.querySelector('.good_coupons').offsetTop+document.querySelector('.good_coupons').offsetHeight;
					//吸顶
					let typeNav = document.querySelector('.allSort');
					let arrow  = document.querySelector('.allSort .all');

					//this.origOffsetY = typeNav.offsetTop;
					//console.log(this.origOffsetY);
					document.addEventListener('scroll', event => {
						if(document.querySelector('.product_listFirst')!=null){
						   document.querySelector('.product_listFirst').style.minHeight=document.body.clientHeight+'px';
						}
						if(this.$route.path == '/home'){
							this.origOffsetY = document.querySelector('.good_coupons').offsetTop+document.querySelector('.good_coupons').offsetHeight;
							//document.querySelector(".center").querySelector("span").innerHTML=window.scrollY+"::"+(this.origOffsetY - (0.88+0.8)*parseFloat(document.querySelector('html').style.fontSize));
							if(window.scrollY >= (this.origOffsetY - (0.88+0.8)*parseFloat(document.querySelector('html').style.fontSize))){
								this.xidingHeight=this.origOffsetY - (0.88+0.8)*parseFloat(document.querySelector('html').style.fontSize);
								typeNav.classList.add('sticky');
								arrow.classList.add('sticky_arrow');
								if(this.isShowArrowClick){
								   //document.body.scrollTop=this.origOffsetY - 0.88*parseFloat(document.querySelector('html').style.fontSize);
								    window.scroll(0,this.origOffsetY - 0.88*parseFloat(document.querySelector('html').style.fontSize));   //document.body存在兼容性
								}
							}else{
								typeNav.classList.remove('sticky');
								arrow.classList.remove('sticky_arrow');
								this.hide();
							}
							this.isShowArrowClick=false;
						}
					});

					this.getSortWordLeft();

			        let handler = () => {
			            if (!self.timer) {
			                self.timer = true
			                self.getSortWordLeft();
			                // console.log(this.searchWordTop)
			                setTimeout(() => {
			                    self.timer = false
			                }, 400)
			            }
			        }
			        window.addEventListener('resize', handler);

					document.querySelector('.pull-down').style.width=document.body.clientWidth+'px'

					this.smartScroll('.filter_ul');

					if(iosStyle){
						this.$refs.productList.getListProducts('xiding')
					}
	       		})
	        })
    	},
    	//页面跳转
		gotoPage(from, val, jumpUrl){
			let {log:eventId, val:param} = this['jumpMap'][from];
			log(eventId,param);
			switch(from){
				case 'banner': 
					//这一期先不跳到落地页，且ios系统iframe宽度会被内部页面真实页面宽度（display none或者轮播实际宽度）撑开
					return

					if(!jumpUrl) return
					if(jumpUrl.indexOf('http')==-1)jumpUrl='https://'+jumpUrl;
					setSession('bannerJump', jumpUrl);
					this.$router.push('/bannerJump');
					break;
				case 'smart':
					location.href = this['jumpMap'][from]['path'];
					break;
				default:
			        // setTimeout(() => {
			        	this.$router.push(this['jumpMap'][from]['path']);
			        // },100)
			        break;
			}
		},
		/**
		 * 导航栏
		 */
		chooseType(index){
			// this.scrollTop = document.scrollingElement.scrollTop;
			this.clickedIndex = index;
			document.querySelector('.sortMenu').scrollLeft = this.sortWordLeft[index];
			// this.showAllType = false;
			// this.freeSwiper.slideTo(index);
			this.hide();
			this.filter.categoryId = this.typeNavs[index]['categoryId'];
            this.filter.categoryName = this.typeNavs[index]['categoryName'];
            this.$refs.productList.filterShopList();
            log("MJingFen_HomeClass", this.filter.categoryName);    
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
		//展示全部商品分类
		async show(){
			//MVVM 数据绑定有延迟，不适合快速切换样式场景
			// this.showAllType = true;
			// this.scrollTop = document.scrollingElement.scrollTop;
			this.isShowArrowClick=true;
			if(window.scrollY < (this.origOffsetY - 0.88*parseFloat(document.querySelector('html').style.fontSize))){
				//document.body.scrollTop=this.origOffsetY - 0.88*parseFloat(document.querySelector('html').style.fontSize);
			    window.scroll(0,this.origOffsetY - 0.88*parseFloat(document.querySelector('html').style.fontSize));//document.body存在兼容性
			}
			let scrollTop =  this.getScrollTop();
			console.log("top"+scrollTop);
			document.querySelector('.back_cover').style.display='';
			document.querySelector('.pull-down').style.display='';
			document.body.style.cssText="height:100%;overflow:hidden;";
		},
		/*
    		取窗口滚动条高度 
       */
		getScrollTop(){
			var scrollTop=0;
			if(document.documentElement&&document.documentElement.scrollTop)
			{
				scrollTop=document.documentElement.scrollTop;
			}
			else if(document.body)
			{
				scrollTop=document.body.scrollTop;
			}
			return scrollTop;
		},
		//隐藏全部商品分类
		async hide(){
			// this.showAllType = false;
			// document.body.style.cssText='';
			// document.body.scrollTop=this.scrollTop;
			document.querySelector('.back_cover').style.display='none';
			document.querySelector('.pull-down').style.display='none';
		    document.querySelector("body").style.cssText = ""
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
	            let events = event.touches && event.touches[0] || event;
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
		},
    },
 //    watch: {
 //    	filter: {
	// 　　　　handler(newValue, oldValue) {
	// 　　　　　　this.$refs.productList.filterShopList();
	// 　　　　},
	// 　　　　deep: true
	// 　　 },
 //    }
}

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

	.noscroll,
	.noscroll body {
	    overflow: hidden;
	}
	.noscroll body {
	    position: relative;
	}
	.sticky {
		position: fixed!important;
		top: 0.88rem!important;
		z-index: 998!important;
	}
	.sticky_arrow {
		position:absolute!important;
		right: 0.035rem!important;
		z-index: 999!important;
	}
    .index-main {
		background-color: #F5F5F5;
		margin-top: 0.88rem;
    }
	.index-searchbar{
		width:100%;
		height: 0.88rem;
		background-color: $red;
		position: fixed;
		top: 0;
		right: 0;
		z-index: 100;
		.searchbox{
			width: 92%;
			height: 0.64rem;
			border: 0;
			border-radius: 20px;
			overflow: hidden;
			@include center;
			position: relative;
			.input{
				width: 100%;
				background-color: #FF6966;
				border: 0;
				height: 0.64rem;
			},
			.center{
				@include center;
				@include fj('center');
				img {
					@include wh(0.32rem, 0.32rem);
					margin-right: 0.1rem;
				},
				span {
					@include sc(0.28rem, #fff);
					line-height: 0.32rem;
				}
			}
		}
	}
	.index-carousel{
		background-color: #fff;
		height: auto;
		.index-banner{
			display: block;
			width: 100%;
			height: auto;
		}
		.swiper-container{
			@include wh(100%, auto);
			background-color: #fff!important;
	　　　　-webkit-transform-style: preserve-3d;
	　　　　-webkit-backface-visibility: hidden;
			transform-style: preserve-3d;
			backface-visibility: hidden;
			.swiper-wrapper{
				margin-top: 0.3rem;
		　　　　-webkit-transform-style: preserve-3d;
		　　　　-webkit-backface-visibility: hidden;
				transform-style: preserve-3d;
				backface-visibility: hidden;
				.swiper-slide{
					width:90%;
			　　　　-webkit-transform-style: preserve-3d;
			　　　　-webkit-backface-visibility: hidden;
					transform-style: preserve-3d;
					backface-visibility: hidden;
					img {
						@include wh(6.75rem, 3.2rem);
						margin:0 auto;
						display:block;
						border-radius: 0.08rem;
					}
				}
			}
			.swiper-pagination{
				text-align: left;
				left: 0.6rem;
				bottom: 0rem;
			}
		}
		.fl_back{
			@include wh(100%, 100%);
		}
	}
	.index-tags {
		background-color: #fff!important;
		margin: 0 auto;
		text-align: center;
		ul {
			display: flex;
			padding-top:0.45rem;
			padding-bottom:0.35rem;
			li {
				flex: 1;
		        display: flex;
		        text-align: center;
		        flex-direction: column;
		        align-items: center;
				img {
					width: 0.56rem;
					margin-bottom: 0.15rem;
				}
				div {
					@include sc(.23rem, #666);
				}
			}
		}
	}
	.good_coupons {
		width: 100%;
		display: flex;
		padding: 0.42rem 0 0.24rem 0.3rem;
		margin-top: 0.24rem;
		background-color: #fff;
		img {
			@include wh(1.56rem, 0.67rem);
		}
	}
	.typeNav {
		width: 100%;
		box-sizing: border-box;
		font: 0.28rem hiragino sans gb, microsoft yahei, simsun;
		z-index: 999;
		background-color: #fff;
		display: flex;
		.swiper-container{
			background-color: #fff;
			height: 0.8rem;
			flex: 1;
	　　　　-webkit-transform-style: preserve-3d;
	　　　　-webkit-backface-visibility: hidden;
			transform-style: preserve-3d;
			backface-visibility: hidden;
			.swiper-wrapper{
				.swiper-slide {
					padding: 0 0.195rem;
					letter-spacing: auto;
					width: auto;
					text-align:center;
			　　　　-webkit-transform-style: preserve-3d;
			　　　　-webkit-backface-visibility: hidden;
					transform-style: preserve-3d;
					backface-visibility: hidden;
					span{
						transition:all .3s ease;
						display: block;
						line-height: 0.78rem;
						border-bottom: 2px solid #fff;
					}
				}
			}
			.active span{
				color:#FF2D2D;
				border-bottom: 2px solid #FF2D2D!important;
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
			z-index: 999;
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
					text-align: center;
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
	.back_cover{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 101;
		background-color: rgba(0,0,0,0.3);
	}
.allSort{
	position: relative;
	 background-image: url('../../images/sy-bj.png');
	 background-size: 0.78rem 0.66rem;
	 background-repeat: no-repeat;
	 background-position: center right;
	 background-color: #fff;
	width: 100%;
	transform: translate3D(0,0,0);
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
