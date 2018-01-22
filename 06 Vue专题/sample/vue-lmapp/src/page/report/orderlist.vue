<template>
	<div class="orderlist">
        <div class="report-top" >
               <div class="icon-back" @click="goBack"> 
                    <!--<svg width="100%" height="100%" viewBox="0 0 15 24" xmlns="http://www.w3.org/2000/svg" version="1.1">
		                <polyline points="15,0 0,12 15,24" style="fill:none;stroke:rgb(255,255,255);stroke-width:4"/>
		            </svg>-->
		            <img src="../../images/goback.png" />
               </div>
               <span @click="selectMShow">
               <span>{{headTitle}}</span>
               <img v-if="!isSelectMShow"  src="../../images/icon_down.png"  />
               <img v-else src="../../images/icon_up.png"  />
               </span>
       </div>
       <div class="mask"  v-show="isSelectMShow"> 
          <ul class="filter-list">
            <li v-for="item in orderSelectList" @click="orderList(item)" type="A"> {{item.name}} <img v-show="item.type ===type" src="../../images/icon_y .png"/></li>
           <!-- <li @click="orderList('B','结算业绩订单')" type="B"> 结算业绩订单 <img v-show="type ==='B'" src="../../images/icon_y .png" /></li>-->
          </ul>
       </div>
       <div class="orderlist-tab">
          <!--<ul> 
              <li class="hover">全部</li>
              <li>待付款</li>
              <li>已付款</li>
              <li>已完成</li>
              <li>已结算</li>
              <li>已失效</li>
          </ul>-->
       </div>
       <div class="orderlist-list">
         <ul v-load-more="loaderMore">
         	<li class="orderlist-list-li" v-for="item in orderArr" @click="goPage(item)"> 
                <div class="list-top"> 
                  <div class="date">{{item.orderDate}}</div>
                  <div :class="{state:true,red:item.orderStatus=='已完成'}">{{item.orderStatus}} </div>
                </div>
                <div class="list-mid" v-if="item.skus.length==1">
                     <div class="list-mid-l"> <img :src="imgBaseUrl + '/s600x300_' + item.skus[0].imageUrl" @load="successLoadImg"   class="default-image"></div>
                     <div class="list-mid-r"> {{item.skus[0].skuName}}</div>
                </div>
                <div v-else=""  class="list-mid">
                	<div style="width: 200000px;" class="morePic">
                		 <div class="list-mid-l" v-for="sku in item.skus"> <img :src="imgBaseUrl + '/s600x300_' + sku.imageUrl" @load="successLoadImg"   class="default-image"></div>
                	</div>
                </div>
                <div class="list-bottom"> 
                    <ul>
                          <li >
                              <div class="tit"> 商品数量 </div>
                              <div class="num">
                                  <div class="yuan">{{item.allSkuNum}}</div>
                              </div>
                          </li>
                         <li>
                              <div class="tit"> 订单总额 </div>
                              <div class="num">
                                  <div class="yuan"><span class="symbol">¥</span>{{item.allSkuPrice}}</div>
                              </div>
                          </li>
                          <li>
                              <div class="tit"> 预估总佣金 </div>
                              <div class="num">
                                  <div class="yuan"><span class="symbol">¥</span>{{item.commission}}</div>
                              </div>
                          </li>
                          <li v-if="item.skus.length==1">
                              <div class="tit"> 佣金比例 </div>
                              <div class="num">
                                  <div class="yuan">{{item.skus[0].commissionRate}}%</div>
                              </div>
                          </li>
                          <li v-if="item.skus.length==1">
                              <div class="tit"> 分成比例 </div>
                              <div class="num border-non">
                                  <div class="yuan">{{item.skus[0].subsideProportion}}%</div>
                              </div>
                          </li>
                    </ul>
                </div>
            </li>
            <div class="loading">
				<img v-show="isHasDataShow" class="loadMore" src="../../images/loading.png" />
				<p v-show="!isHasDataShow" class="empty_data">没有更多了</p>
            </div>
            <div class="nodata"> 抱歉，没有找到任何数据 </div>
         </ul>
       </div>
    </div>
</template>

<script>
  import headTop from 'src/components/header/head'
  import {mapState,mapMutations} from 'vuex'
  import {listProducts,listLibraries,addProduct} from 'src/service/getPromotion'
  import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
  import {getStore} from 'src/config/mUtils'
  import {imgBaseUrl,loginUrl} from 'src/config/env'
  import {showBack, animate,isOk} from 'src/config/mUtils'
  import {loadMore, getImgPath} from 'src/components/common/mixin'
  import loading from 'src/components/common/loading'
  import 'src/components/jelly/jelly.js'
  import moment from 'moment'
    
    
    export default {
    	data(){
            return{
              headTitle:"引入订单",
              changeShowType:"week",
              isSelectMShow:false,//筛选方式是否显示
              sortShow:'B',  
              type:"A",
              method:"",
              pageNum: 0,
              orderSelectList:[{"name":"引入订单",
                                "type":"A",
                                "method":"inOrderDetail"},
              					{"name":"结算业绩订单",
                                "type":"B",
                                "method":"finalOrderDetail"}],
              orderArr:[],
              showLoading:false,
              imgBaseUrl,
              showBackStatus: false, //显示返回顶部按钮
              selectCount:0,//已选取商品数量
              selectProductList:[],//已选取商品信息
              selectCount:0,//已选取商品数量
              selectProductList:[],//已选取商品信息
              selectProductSkuId:[],
              isProductBoxCanShow:false,//商品盒子是否可以显示
              showAlert: false, //弹出框
              alertText: null, //弹出内容
              listLibraries:[],//选品库列表
              productSetName:'',
              isHasDataShow:true,//是否还有未加载数据
              selectProductStoreId:'',
              isAddProductShow:false,
              pageNum:1,
              pageSize:10,
              now:'',
              threeMonthAgo:'',
            }
        },
         props: [
            'filter',
            'isHome',
            /*
             * sortName:'综合排序',
               sortVal:'',默认为空
               categoryId:'',
               categoryName:'全部分类',
               keyWord:'',
             */
        ],
        created(){
           
        },
        mounted(){
            //this.initData();
            //this.$route.meta.keepAlive=true;
            getProxy('/now').then(res=>{
            //jsonpProxyApiX('now',{}).then(res=>{
            	this.now=moment(res).format("YYYY-MM-DD");
            	this.threeMonthAgo=moment(res).subtract(3,"month").format("YYYY-MM-DD");
            	this.getOrderList(this.orderSelectList[0].method);
            })
           
        },
        components: {
	    	loading,
            headTop,
	    },
        computed: {
        },
        mixins: [loadMore, getImgPath],
        methods: {  
            // 点击显示筛选项
            async selectMShow(){
            	if(this.threeMonthAgo==''){
            		//$j.toast('网络异常，请稍后');
            		return;
            	}
                this.isSelectMShow=this.isSelectMShow?false:true;
            },
            //点击筛选订单类型
            orderList(item){
                this.type=item.type;
                this.method = item.method;
                this.headTitle=item.name;
                this.isSelectMShow=false;
                this.touchend=false;
                this.pageNum = 1;
            	this.getOrderList(item.method);
            	this.isHasDataShow = true;
            },
            //到达底部加载更多数据
			async loaderMore(){
                console.log('loadMore');
                if(this.orderArr.length==0){
                	return;
                }
				if (this.touchend) {
					return
				}
				//防止重复请求
				if (this.preventRepeatReuqest) {
					return 
				}
				$j.showLoading();
				this.preventRepeatReuqest = true;
	
				//页码加1
                this.pageNum += 1;
                if(this.type == "A"){
                    this.getOrderList(this.orderSelectList[0].method);
                }else{
                    this.getOrderList(this.orderSelectList[1].method);
                }
				
			},
            async getOrderList(type){
            	$j.showLoading();
            	let url="/order/"+type+"?pageNum="+this.pageNum+"&pageSize="+this.pageSize+"&startTime="+this.threeMonthAgo+"&endTime="+this.now;
               // console.log(url);
                //getProxy(url).then(res => {
            	if(this.pageNum==1){
            		this.orderArr=[];
            	}
                jsonpProxyApiX(type,{pageNum:this.pageNum,pageSize:this.pageSize,startTime:this.threeMonthAgo,endTime:this.now}).then(res => {
					$j.closeLoading();
					if(isOk(res)){
                        var data = res.data.result;
                        for(var i=0; i<data.length; i++){
                            data[i].orderDate = moment(data[i].orderDate).format('YYYY.MM.DD HH:mm');
                        }
						if(res.data.result.length>0){
							let result;
                            result = res.data.result;
                            if(this.pageNum=="1"){
                                // result[0].orderStatus="已完成";
                                 this.orderArr = result;
                            }else{
	                            this.orderArr = [...this.orderArr, ...result];
                            }
							if (result.length < 10) {
								this.touchend=true;
								this.isHasDataShow = false;
							}else{
								this.isHasDataShow = true;
							}
                            this.preventRepeatReuqest = false;
                           // this.isHasDataShow = true;
                            document.querySelector(".nodata").style.display = "none";
                            document.querySelector(".loading").style.display = "block";
                        }else{
                        	this.isHasDataShow = false;
                            this.orderArr="";
                            document.querySelector(".nodata").style.display = "block";
                            document.querySelector(".loading").style.display = "none";
                        }
					}
		        })
           },
           
           goBack(){
           	  this.$route.meta.keepAlive=false;
           	  //this.$router.go(-1);
           	  if(window.isNative){   //native 发送协议
        			let data={type:'1'};
        			window.postMessage(JSON.stringify(data),'*'); 
        			location.href="junion://j.u?act=goBack&isClose=0";
        	  }else{
                this.$router.go(-1);
              }
           },
           goPage(order){
           	   this.$route.meta.keepAlive=true;
               sessionStorage.setItem("order",JSON.stringify(order));
           	   this.$router.push("/orderdetails");
           },
           successLoadImg(event) {
			    if (event.target.complete == true) {
			        event.target.classList.remove("default-image");;
			    }
			},
        },
        watch: {
        	
	     }
    }
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';
.orderlist{
  .report-top{
      background-color: #FF0500;
      position: fixed;
      z-index: 100;
      left: 0;
      top: 0;
      width: 100%;
      height: 0.88rem;
      overflow: hidden;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex; 
      text-align: center;
      /*.icon-back{
		    position: absolute;
		    top: 50%;
		    -webkit-transform: translateY(-50%);
		    -ms-transform: translateY(-50%);
		    transform: translateY(-50%);
		    left: 0;
		    font-size: 0.24rem;
		    width: 0.71rem;
		    height: 0.88rem;position: absolute;
		    top: 50%;
		    -webkit-transform: translateY(-50%);
		    -ms-transform: translateY(-50%);
		    transform: translateY(-50%);
		    left: 0;
		    font-size: 0.24rem;
		    width: 0.71rem;
		    height: 0.88rem;
		    line-height: 0.24rem;
		    img{
				position: absolute;
	            top: 50%;
                transform: translateY(-50%);
	            left: 0.28rem;
	            width: 0.15rem;
	            height: 0.24rem;
	        }
	   }*/
	   .icon-back{
	        position: relative;
	        @include wh(0.88rem, 0.88rem);
	        font-size: 0;
	        line-height: 0.24rem;
	        img{
	            @include ct;
	            -webkit-transform: translateY(0); 
			    -ms-transform: translateY(0);
			    transform: translateY(0); 
	            left: 0.28rem;
	            @include wh(0.15rem, 0.24rem);
	        }
	    }
       span{
           color: #fff;
           font-size: .3rem;
           text-align: center;
           width: 3rem;
           margin:0 auto;
           line-height: 0.88rem;
           
       }
       img{
         width: 0.16rem;
         height: 0.09rem;
         margin-top:-.09rem;
         vertical-align: middle;
         top:.49rem;
         margin-left: 0.1rem;
       }

  }
  .mask{
    position: fixed;
    top:0;
    left:0;
    z-index: 2;
    background: rgba(0, 0,0, 0.5);
    width: 100%;
    height: 100%;
    .filter-list{
    position: absolute;
    top:.8rem;
    left:0;
    width:100%;
    z-index: 8888;
    margin:0;
    padding:0;
    background: #fff;
    li{
      line-height: 0.88rem;
      height: .0.88rem;
      font-size: .3rem;
      padding-left:.5rem;
      color: #000;
      text-align: center;
      position: relative;
      border-bottom: 1px solid rgb(231, 231, 231);
      img{
          width:0.32rem;
          height: 0.32rem;
          position:absolute;
          right: .3rem;
          top:0.3rem;
      }
    }
    .hover{
          color: rgb(255, 58, 58)!important;
      }
    
  } 
  }
  .orderlist-tab{
      padding-top:1rem;
      /*background: #fff!important;*/
      ul{
        margin:0;
        padding:0;
        height: .6rem;
        line-height: .6rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow:0px 2px 10px 0px #e1e1e1;
        li{
          padding:0;
          margin:0;
          float: left;
          font-size: .30rem;
          width: 1.2rem;
          text-align: center;
          &.hover{
            color: red!important;
            border-bottom:1px solid red;
          }
        }
      }
  }
  .orderlist-list{
    width: 7.5rem;
    overflow: hidden;
    ul{
      margin:0;
      padding:0;
      .orderlist-list-li{
        height: 3.75rem;
        background: #fff!important;
        border-top:0.2rem solid rgb(245, 245, 245);
        clear: both;
        .list-top{
          height: .8rem;
          line-height: 0.8rem;
          width:100%;
          font-size: .26rem;
          .date{
             float: left;
             width: 60%;
             padding-left:.3rem;
          }
          .state{
            float: right;
            width: 30%;
            text-align: right;
            padding-right: .3rem;
          }
        }
        .list-mid{
           width: 100%;
           height: 1.62rem;
           background: rgb(245, 245, 245);
           padding-top:0.2rem;
           overflow-x: auto;
           overflow-y:hidden;
           padding-left: 0.3rem;
           .list-mid-l{
             float: left;
             width: 1.2rem;
             margin-right: 0.2rem;
             text-align: center;
             img{
               width: 1.2rem;
               height: 1.2rem;
               margin:0 auto;
             }
           }
           .list-mid-r{
             float: left;
             font-size: 0.28rem;
             color: #000;
             width: 5.7rem;
             display: -webkit-box;
             -webkit-line-clamp: 2;
             -webkit-box-orient: vertical;
             overflow: hidden;
           }
        }
        .list-bottom{
          clear: both;
          padding-top:0.15rem;
          @media screen and (max-width: 321px) {
         }
        width: 100%;
        background: #fff;
        ul{
             margin:0;
             padding:0;
             border-bottom:1px solid rgb(231, 231, 231);
             overflow: hidden;
             padding-bottom: .25rem;
            li{
                float: left;
                width: 1.5rem;
                text-align:center;
                .tit{
                    font-size: .24rem;
                    color: rgb(107, 107, 107);
                }
                .num{
                    border-right:1px solid rgb(231, 231, 231);
                    color: #000;
                    padding-top:0.1rem;
                    .yuan{
                        font-size: .28rem;
                        .symbol{
                            font-size:.20rem;
                        }
                    }
                }
                .border-non{
                    border-right: none!important;
                }
            }
        }
        }
      }
    
    }
  }
}


.loading{
 	background: rgb(245,245,245);
 	text-align: center;
 	font-size: 0;
 	.loadMore{
 		height: 0.47rem;
 		width: 0.87rem;
        margin:.2rem auto;
 	}
 	.nextCategory{
 		font-size: 0;
 		line-height: 0.66rem;
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
 .red{
 	color: red;
 }
 .empty_data{
	@include sc(0.25rem, #666);
	text-align: center;
	line-height: 1rem;
 }
 .default-image{
	background-image: url(../../images/order_banner.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
 }
</style>