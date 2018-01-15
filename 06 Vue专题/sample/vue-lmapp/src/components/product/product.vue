<template>
	<div>
		<ul v-load-more="loaderMore"  :class="{product_listFirst: page == 'home',product_list: page == 'list' || page == 'share' || page == 'search_sku', ios: iosStyle}">
				<li  class="product_li" v-for="(sku,index) in shopList" @click="goShare(sku)">
					<div>
						<img :src="imgBaseUrl + '/s200x200_' + sku.imageUrl+'!q70'" @load="successLoadImg"   class="default-image pic">
						<div class="pic_center">
							<div class="nameParent">
								<p class="name"><self v-if="sku.isSelf==0"/>{{sku.skuName}}</p>
							</div>
							<div v-if="sku.hasCoupon==1">	
								<p class="price">
									<span>京东价：<span class="font-ding">¥{{sku.wlPrice}}</span></span>
									<span class="comment">好评数：<span class="font-ding">{{sku.goodComments}}</span></span>
								</p>
								<p class="commission">
									<img class="ticket" src="../../images/ticketPrice.png" />
									<span class="couponAfterprice">
									  <span class="yuan">¥</span>{{sku.couponPrice}}
									</span>
								</p>
								<div class="ticSurplus">
									<span  class="tabCell">
										券<span>¥{{sku.discount}}</span>元    余<span>{{sku.surplusNum}}</span>张
									</span>
									<div class="ticZ" v-bind:style="{width: sku.surplusNum*100/sku.batchCount+'%'}">
										<div class="tic-back">
											
										</div>	
									</div>
								</div>
							  </div>
							  <div class="noCoupon" v-else>
							  	  <p class="comment">好评数  <span class="font-ding">{{sku.goodComments}}</span></p>
							  	  <p class="price1">
									<span class="jdPrice">京东价  </span><span class="icon-y">¥</span><span class="priceNum">{{sku.wlPrice}}</span>
								  </p>
							  </div>
						</div>
				   </div>
					<div class="pic_right" v-show="!iosStyle">
						<img src="../../images/goM.png" />
						<div>
							<span class="zhuan">赚</span>
							<span class="fh">¥</span>
							<span class="zPrice">{{sku.wlCommission}}</span>
						</div>
					</div>
				</li>
				<div class="loading" v-show="this.page != 'share'">
					<img v-show="isHasDataShow" class="loadMore" src="../../images/loading.png" />
				    <div v-show="this.page != 'share' && page != 'search_sku' && !isHasDataShow" class="nextCategory">
				    	 <img src="../../images/arrowUp.png" />
				    	 <span>向上滑动查看下一分类商品</span>
				    </div>
				    <div v-show="page == 'search_sku' && !isHasDataShow && hasData" class="nextCategory">
				    	 <span>没有更多了</span>
				    </div>
				    <div v-show="page == 'home'" style="height: 1.2rem;">
				    	
				    </div>
				</div>
				<div v-show="page == 'search_sku' && !isHasDataShow && !hasData" class="nodata"> 抱歉，没有找到任何数据 </div>
		</ul>
		
		<!--加入商品库  -->
		<div class="add-product" v-if="isAddProductShow">
		    <h2>选择选品库</h2>
		    <header>
		        <input id="product_set_name" v-model="productSetName" type="text"/>
		        <button id="add_productset" @click="newBuilt()">新建</button>
		    </header>
		    <ul class="product_set_content" id="spk-list-html">
		    	<li v-for="item in listLibraries" :id="item.id" @click="changeClass(item.id)"  :class="{'product_set_select':item.id === selectProductStoreId}">
		    		{{item.name}}
		    	</li>
		    </ul>
		    <footer>
		        <button @click="addProductStore" class="btn_left">加入</button>
		        <button  @click="cancel">取消</button>
		    </footer>
		</div>
		<div v-if="isAddProductShow" class="mui-backdrop" ></div>
		<aside class="return_top" @click="backTop" v-if="showBackStatus">
			<svg class="back_top_svg">
				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
			</svg>
		</aside>
    </div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
	import {showBack,getStore,setSession,appParameter,log,animate,isOk,get_scrollTop_of_body} from 'src/config/mUtils'
	import {imgBaseUrl,loginUrl} from 'src/config/env'
	import {loadMore, getImgPath} from 'src/components/common/mixin'
    import loading from 'src/components/common/loading'
    import self from 'src/components/common/self'
    import 'src/components/jelly/jelly.js'
    
    
    export default {
    	data(){
            return{
            	pageNum: 1,
            	shopList:[],
            	showLoading:false,
            	imgBaseUrl,
	            isProductBoxCanShow:false,//商品盒子是否可以显示
	            showAlert: false, //弹出框
			    alertText: null, //弹出内容
			    listLibraries:[],//选品库列表
			    productSetName:'',
			    isHasDataShow:true,//是否还有未加载数据
			    selectProductStoreId:'',
			    isAddProductShow:false,
			    touchend: false,//阻止下滑获取更多
			    showBackStatus:false,  //返回顶部是否显示
			    hasData:true,   //是否包含数据
            }
        },
         props: [
            'filter',
            'page',
            'xidingHeight',
        ],
        created(){
			if(this.page == 'search_sku') {
				if( window.searce_list_share!==undefined){
					window.iosStyle = window.searce_list_share==1?false:true;
				}
			}           
        },
        mounted(){
        	//if(this.$route.fullPath!="/promotion_product"){
               this.initData();
            //}
            /*if(this.page == 'home'){
            	document.querySelector('.product_listFirst').style.minHeight=(document.body.clientHeight-(0.88+0.8)*parseFloat(document.querySelector('html').style.fontSize)) + 'px';
            }*/
        },
		
        components: {
	    	loading,
			self
	    },
        computed: {
			url: function() {
				if(this.page == 'list' || this.page == 'home' || this.page == 'search_sku') {
		        	let addurl='';
		        	let param={};
					if(this.filter.sortVal!=''){
						addurl+='&property='+this.filter.sortVal;
						param.property=this.filter.sortVal;
					}
					if(this.filter.categoryId!=''){
						addurl+='&categoryId='+this.filter.categoryId;
						param.categoryId=this.filter.categoryId;
					}
					if(this.filter.keyWord!=''){
						addurl+='&keyword='+encodeURIComponent(this.filter.keyWord);
						param.keyword=encodeURIComponent(this.filter.keyWord);
					}
					if(this.filter.sort!='' && typeof(this.filter.sort)!='undefined'){
						addurl+='&sort='+this.filter.sort;
						param.sort=this.filter.sort;
					}
					if(this.filter.hasCoupon=='1'){
						addurl+='&hasCoupon='+this.filter.hasCoupon;
						param.hasCoupon=this.filter.hasCoupon;
					}
					param.pageNum=this.pageNum;
					param.pageSize=10;
					//return '/adv/listProducts?pageNum='+this.pageNum+'&pageSize=10'+addurl;
					return {functionId:"listProducts",param:param};
				}
				if(this.page == 'share') //return '/adv/goodsRecommend?skuId='+this.filter.skuId;
				return {functionId:"goodsRecommend",param:{skuId:this.filter.skuId}};
			},
			iosStyle: function(){
				return window.iosStyle
			}
        },
        mixins: [loadMore, getImgPath],
        methods: {  
        	clearShopList(){
        		this.shopList=[];
        	},
        	async initData(){
        		this.hasData=true;
        		//$j.showLoading();
				//商品列表
				this.getListProducts('xiding');
				showBack(status => {
				   this.showBackStatus = status;
			    });
			},
			//到达底部加载更多数据
			async loaderMore(){
				console.log('loadMore');
				console.log(this.touchend);
				if (this.touchend) {
					return
				}
				//防止重复请求
				if (this.preventRepeatReuqest) {
					return 
				}
				//$j.showLoading();
				this.preventRepeatReuqest = true;
	
				//页码加1
				this.pageNum += 1;
				if(this.isHasDataShow){
				  this.getListProducts();
				}else{
				  this.$emit("chooseNextType");
				}
			},
			async filterShopList(){
				this.hasData=true;
				this.touchend=false;
				//商品列表
				if(this.page=="home"){
					console.log(document.querySelector(".product_listFirst").offsetHeight);
					//document.querySelector(".product_listFirst").style.minHeight=document.querySelector(".product_listFirst").offsetHeight+"px";
				}
				this.shopList=[];
				this.pageNum=1; //初始化页码
				//商品列表
				this.getListProducts();
			},
	        getListProducts(xiding){  //获取商品列表
	        	console.log(this.url);
				if(!(this.page == 'home') || !(this.filter.categoryId === undefined)) 
				//getProxy(this.url).then(res => {
			    jsonpProxyApiX(this.url.functionId,this.url.param).then(res => {
					if(isOk(res)){
						let result;
						let total;
						if(this.page == 'share'){
							result = res.data.result==null?[]:res.data.result;
							if(result.length > 10) result = result.slice(0,10);
							this.isHasDataShow = false;
							this.touchend = true;
							this.shopList = result;
						}else{
							result = res.data.pageResult.result==null?[]:res.data.pageResult.result;
							total = res.data.pageResult==null?0:res.data.pageResult.total;
							this.shopList = [...this.shopList, ...result];
						} 
						
			            if(result==null){
			                this.isHasDataShow=false;
						}else{
							if ((this.pageNum-1)*10+result.length >= total) {
								this.isHasDataShow=false;
							}else{
								this.isHasDataShow=true;
							}
						}
						
						if(this.page=="search_sku"){
							this.isHasDataShow=true;
							if(this.shopList.length==0){
								//$j.toast("暂无相关商品");
								this.hasData=false;
								this.isHasDataShow=false;
							}
							if ((this.pageNum-1)*10+result.length >= total) {
								this.touchend=true;
								this.isHasDataShow=false;
							}else{
								this.isHasDataShow=true;
							}
						}
						if(this.page=="home" && this.pageNum==1){
							if(document.querySelector('.allSort').className.indexOf('sticky')>-1){
								var height=this.xidingHeight+1;
								//console.log("xiding::"+height);
								//document.body.scrollTop=height;
								window.scroll(0,height);
						   }
						   if(xiding == 'xiding') window.scroll(0,0);//document.body.scrollTop=0;
						}
						this.preventRepeatReuqest = false;
					}

					this.$nextTick(function(){
					   if(this.page=="home"){
						  if(xiding == 'xiding') window.scroll(0,1);//document.body.scrollTop=1;	
					   }else{
					   	  //document.body.scrollTop=document.body.scrollTop+1;
					   	  window.scroll(0,get_scrollTop_of_body());
					   } 
				    })

		        })
				
				
	        },
		    goShare(skuInfo){
		    	//this.$route.meta.keepAlive=true;
		    	setSession('skuInfo', skuInfo);
		    	switch(this.page){
		    		case 'share': log("MJingFen_RecommendShare", (this.shopList.indexOf(skuInfo) + 1)); break;
		    		case 'list': log("MJingFen_ProductShare"); break;
		    		case 'home': log("MJingFen_CouponShare"); break;
		    		default: break;
		    	}
		    	if(this.page == 'share'){
		    		this.$emit('freshShare');
		    	}else{
		    		if(window.isNative && this.$route.fullPath.indexOf('search_sku')>-1){
            	        let data={type:'3',skuInfo:skuInfo};
                        window.postMessage(JSON.stringify(data),'*'); 
                    }else{
		    		  this.$router.push('/share_middlepage');
		    		}  
		    	}
		    },
		    
		    successLoadImg(event) {
			    if (event.target.complete == true) {
			        event.target.classList.remove("default-image");;
			    }
			},
		   //返回顶部
		   backTop(){
			  animate(document.body, {scrollTop: '0'}, 0,'ease-out');
		   },    
        },
        watch: {
        	
	    }
    }
</script>

<style lang="scss" scoped>
     @import 'src/style/mixin';
     
     p{
     	margin: 0;
     	margin-bottom: 0.09rem;
     }
     .product_list {
     	background: rgb(245,245,245);
     	min-height: 8rem;
     	.product_li {
     		margin: 0.19rem 0;
     		background:rgb(255,255,255);
     		position:relative;
     		padding-left: 0.2rem;
     		.pic {
     			float: left;
			    width: 1.74rem;
			    height: 1.74rem;
			    display: block;
			    margin-top: 0.25rem;
     		}
     		.pic_center{
     			margin-left: 1.74rem;
     			margin-right: 1.2rem;
     			padding: 0.19rem 0.21rem 0.19rem 0.26rem;
	     		.nameParent{ 
	     			height:0.68rem;   
	     			margin-bottom: 0.09rem;
	     		    .name{
	     		    	font-size: 0.26rem;
	     		    	color: rgb(0,0,0);
					    overflow: hidden;
					    text-overflow: ellipsis;
					    display: -webkit-box;
					    -webkit-line-clamp: 2;
					    -webkit-box-orient: vertical;
					    line-height: 0.34rem;
					    margin-bottom: 0;
	     		    	.isSelf{
							display:inline-block;
	     		    		border: 1px solid rgb(255,58,58);
	     		    		color: rgb(255,58,58);
	     		    		font-size: 0.18rem;	
	     		    		padding: 1px;
							line-height:1;
	     		    		margin-right: 0.1rem;
							margin-top:-1px;
	     		    	}
	     		    }
	     		}
     		    .price{
     		    	font-size: 0;
					 line-height:1;
					 margin-bottom:0.17rem;
     		    	.comment{
     		    		margin: 0.36rem;
     		    	}
     		    	span{
     		    	   color: rgb(163,163,163);	
     		    	   font-size: 0.18rem;
     		    	}
     		    }
     		    .commission{
     		    	color: rgb(0,0,0);
     		    	font-size: 0;
					 line-height:1;
     		    	.ticket{
     		    	   height: 0.26rem;
     		    	   vertical-align: middle;
     		    	   margin-right: 0.1rem;
     		        }
     		        .couponAfterprice{
     		        	font-family: "Medium";
     		        	vertical-align: middle;
     		        	font-size: 0.30rem;
	     		        .yuan{
	     		        	font-family: "Medium";
	     		        	font-size: 0.20rem;
	     		        }
	     		    }
     		    } 
     		} 
     		
     	}
	 }
    .product_listFirst {
    	min-height: 8rem;
     	background: rgb(245,245,245);
     	padding-left: 0.31rem;
        padding-right: 0.13rem;
     	.product_li {
     		margin: 0.19rem 0;
     		background:rgb(255,255,255);
     		position:relative;
     		padding-left: 0.2rem;
     		.pic {
     			float: left;
			    width: 1.74rem;
			    height: 1.74rem;
			    display: block;
			    margin-top: 0.25rem;
			    margin-left: -0.31rem;
			    box-shadow: 0.04rem 0 0.2rem rgba(0,0,0,0.25);
     		}
     		.pic_center{
     			margin-left: 1.43rem;
     			margin-right: 1.2rem;
     			padding: 0.19rem 0.21rem 0.19rem 0.26rem;
     			.nameParent{ 
	     			height:0.68rem;   
	     			margin-bottom: 0.09rem;
	     		    .name{
	     		    	font-size: 0.26rem;
	     		    	color: rgb(0,0,0);
					    overflow: hidden;
					    text-overflow: ellipsis;
					    display: -webkit-box;
					    -webkit-line-clamp: 2;
					    -webkit-box-orient: vertical;
					    line-height: 0.34rem;
					    /* height:0.68rem;*/
	     		    	.isSelf{
	     		    		border: 1px solid rgb(255,58,58);
	     		    		color: rgb(255,58,58);
	     		    		font-size: 0.18rem;	
	     		    		padding: 1px;
	     		    		margin-right: 0.18rem;
	     		    	}
	     		    }
	     		}
     		    .price{
     		    	font-size: 0;
     		    	.comment{
     		    		margin: 0.36rem;
     		    	}
     		    	span{
     		    	   color: rgb(163,163,163);	
     		    	   font-size: 0.18rem;
     		    	}
     		    }
     		    .commission{
     		    	color: rgb(0,0,0);
     		    	font-size: 0;
     		    	.ticket{
     		    	   height: 0.26rem;
     		    	   vertical-align: middle;
     		    	   margin-right: 0.1rem;
     		        }
     		        .couponAfterprice{
     		        	vertical-align: middle;
     		        	font-size: 0.26rem;
     		        	font-family: "Medium";
	     		        .yuan{
	     		        	font-size: 0.16rem;
	     		        	font-family: "Medium";
	     		        }
	     		    }
     		    }
     		} 
     	}
	 }
	 
	 .pic_right{
		height: 100%;
		width: 1.2rem;
		position: absolute;
		right: 0;
		top: 0;
		background: linear-gradient(rgb(255,116,112),rgb(255,5,0));
		text-align: center;
		font-size: 0;
		img{
			height: 0.52rem;
			margin-top: 0.73rem;
		}
		div{
			font-size: 0;
			margin-top: 0.35rem;
			.zhuan{
				font-size: 0.22rem;
			    color: rgb(255,255,255);
			}
			.zPrice{
				font-size: 0.24rem;
				color: rgb(255,255,255);
				font-family: "Medium";
			}
			.fh{
				font-size: 0.18rem;
				color: rgb(255,255,255);
				font-family: "Medium";
			}
		}
	 } 
	 .ticSurplus{
	    background-color: rgb(224,224,224);
	    width: 3.69rem;
	    height: 0.28rem;
	    border-radius: 0.14rem; 
		font-size: 0;
		position: relative;
		.tabCell{
			position: absolute;
		    top: 50%;
		    left: 0;
		    padding-left: 0.14rem;
		    font-size: 0.18rem;
			color: rgb(255,255,255);
		    transform:translateY(-50%);
			-ms-transform:translateY(-50%); 	/* IE 9 */
			-moz-transform:translateY(-50%); 	/* Firefox */
			-webkit-transform:translateY(-50%); /* Safari 和 Chrome */
			-o-transform:translateY(-50%); 
			span{
				font-family: "Medium";
				font-size: 0.18rem;
			    color: rgb(255,255,255);
			}
		}
    	.ticZ{
    		/*@include bis("../../images/ticSu.png");
    		background-color: black;*/
    		height: 100%;
    		width: 50%;
    		border-radius: 0.14rem;
    		overflow: hidden;
    		.tic-back{
    			@include bis("../../images/ticSu.png");
    		    background-color: rgb(42,42,42);
    		    height: 100%;
    		    width: 3.69rem;
    		}
    	}
    }
	 
	 .wc{
	 	position: relative;
	 }
	 .add{
 	    height: 100%;
	    width: 1.2rem;
	    position: absolute;
	    right: 0;
	    top: 0;
	 	background: rgb(224,224,224);
	 	text-align: center;
	 	font-size: 0;
	 	img{
	 		width: 0.54rem;
	 		height: 0.54rem;
	 		margin-top: 0.73rem;
	 	}
	 	div{
	 		font-size: 0.22rem;
		    margin-top: 0.39rem;
		    letter-spacing: -0.7px;
		}
	 }
	 .return_top{
		position: fixed;
		bottom: 1.5rem;
		right: 0.5rem;
		z-index: 999;
		.back_top_svg{
			@include wh(1rem, 1rem);
		}
	 }
	 
	 .loading{
	 	background: rgb(245,245,245);
	 	height: 0.66rem;
	 	text-align: center;
	 	font-size: 0;
	 	.loadMore{
	 		height: 0.47rem;
	 		width: 0.87rem;
	 	}
	 	.nextCategory{
	 		font-size: 0;
	 		line-height: 0.66rem;
	 		margin-top: 5px;
	 		img{
	 			height: 0.23rem;
	 			width: 0.18rem;
	 		}
	 		span{
	 			height: 0.24rem;
	 			font-size: 0.24rem;
	 			letter-spacing: 0.8px;
	 			color: rgb(163,163,163);
	 			margin-left: 0.23rem;
	 		}
	 	}
	 }
	/**
	 * 遮罩
	 */
	.mui-backdrop {
	    position: fixed;
	    z-index: 998;
	    top: 0;
	    right: 0;
	    bottom: 0;
	    left: 0;
	    background-color: rgba(0, 0, 0, .3);
	}
	
	.noCoupon{
		margin-top: 0.53rem;
		font-size: 0;
		margin-bottom: 0;
    	.price1{
    		color: rgb(0,0,0);
    		margin-bottom:0;
			line-height:1;
    		.jdPrice{
    			font-size: 0.22rem;
    		}
    		.icon-y{
    			font-size: 0.16rem;
    			font-family: "Medium";
    		}
    		.priceNum{
    			font-size: 0.3rem;
    		    font-family: "Medium";
    		}	
    	}
    	.comment{
    		color: rgb(163,163,163);
    		font-size: 0.18rem;
			line-height:1;
    	}
    }
    .font-ding{
    	font-family: "Medium";
    	color: #a3a3a3;
    }
    .loading-home{
    	position: fixed;
    	width: 100%;
        top: 1.68rem;
    }

    .ios{
    	.product_li{
			.pic_center{
				margin-right: 0;
			}
			.ticSurplus{
				width: auto;
				.tic-back{
					width: auto;
				}
			}
    	}
    }
    .default-image{
    	background-image: url(../../images/logo_default.png);
    	background-repeat: no-repeat;
    	background-size: 100% 100%;
    }
    .nodata{
    	display: block;
    }
</style>