<template>
	<div class="record">
         <head-top :goBack="true" :headTitle="headTitle">
	     </head-top>
        <ul class="record-list" v-load-more="loaderMore">
            <li class="record-list-li" v-for="item in applylist">
                <div class="top-w">
                    <div class="top-w-l">{{item.startTime}}</div>
                     <div class="top-w-r">结算单据号:{{item.applyId}}</div>
                </div>
                <div class="bottom-w">
                    <ul>
                        <li>
                            <div class="tit">实际支付</div>
                            <div class="num"><span class="symbol">¥</span><span class="yuan">{{item.totalCommisionFee}}</span></div>
                        </li>
                        <li>
                            <div class="tit">代扣税</div>
                            <div class="num last-num"><span class="symbol">¥</span><span class="yuan">{{item.taxFee}}</span></div>
                        </li>
                    </ul>
                </div>
                    <img  v-if="item.newstatus == 0" src="../../images/pay_3.png">    
                    <img  v-else-if="item.newstatus == 1" src="../../images/pay_6.png">
                    <img  v-else-if="item.newstatus == 2"  src="../../images/pay_5.png">
                    <img  v-else-if="item.newstatus == 3" src="../../images/pay_4.png">
                    <img  v-else-if="item.newstatus == 4"  src="../../images/pay_1.png">
            </li>
        </ul>
        <!-- <div  v-load-more="loaderMore">
            <div v-for="item in testlist" style="font-size:0.26rem; height:1.5rem;">{{item.title}}</div>
        </div> -->
        <div class="loading">
		   <img v-show="isHasDataShow" class="loadMore" src="../../images/loading.png" />
		   <p v-show="!isHasDataShow" class="empty_data">没有更多了</p>
		</div>
        <div class="nodata"> 抱歉，没有找到任何数据 </div>
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
    export default {
    	data(){
            return{
                headTitle:"提现记录",
                changeShowType:"week",
                sortShow:"B",   //默认隐藏
                type:"F",

                pageNum: 1,
                pageSize:10,

                applylist:"",
                showLoading:false,
                testlist:"",
                //是否到底部
                touchend:false, 
                isHasDataShow:true
            }
        },
         props: [
            'filter',
            'isHome',
        ],
        created(){
           
        },
        mounted(){
             this.getlist();
             //this.gettextlist();
        },
        components: {
	    	loading,
            headTop,
	    },
        computed: {
           
        },
        mixins: [loadMore],
        methods: {  
            async sortShow(){
            },
            //提现记录请求方法
            async getlist(){
                var _this = this;
               // getProxy('/getPageApply?pageNum='+_this.pageNum+'&pageSize='+_this.pageSize).then(res => {
               	jsonpProxyApiX('getPageApply',{pageNum:_this.pageNum,pageSize:_this.pageSize}).then(res => {
                    $j.closeLoading();
                    if(isOk(res)){
                        let objlist = res.data.result;
                        if(objlist.length<=0){
                            document.querySelector(".loading").style.display= "none";
                            document.querySelector(".nodata").style.display = "block";
                        }else{
                            document.querySelector(".loading").style.display= "block";
                            document.querySelector(".nodata").style.display = "none";
                        }
                        //0-待审核，1、3、6、9-待支付，8-审核中，2-已支付，4、5、7、10-支付失败
                        for(var i =0; i<objlist.length; i++){
                             if(objlist[i].status == "0"){
                                   //待审核 checkp
                                 objlist[i].newstatus = "0";

                             }else if(objlist[i].status == 1 || objlist[i].status == 3 || objlist[i].status == 6 || objlist[i].status == 9){
                                // 待支付  payp
                                 objlist[i].newstatus = "1";

                             }else if(objlist[i].status== "8" ){
                                //审核中 checkin
                                  objlist[i].newstatus = "2";

                             }else if(objlist[i].status== "2"){
                                 //已支付  paysuccess
                                  objlist[i].newstatus = "3";
                             }else if(objlist[i].status=="4" || objlist[i].status=="5" || objlist[i].status=="7" || objlist[i].status=="10"){
                                 //支付失败 payfail
                                  objlist[i].newstatus = "4";
                             }
                        }
                        _this.applylist = [..._this.applylist, ...res.data.result];
                        _this.preventRepeatReuqest = false;
                        if (res.data.result.length < _this.pageSize) {
								_this.touchend = true;
								this.isHasDataShow=false;
                        }else{
                        	    this.isHasDataShow=true;
                        }
                         $j.showLoading();
                         _this.$nextTick(() => {
                            $j.closeLoading();
                         })

                    }
                })
            },
            async loaderMore(){
                var _this =this;
                if (this.touchend) {
					return
				}
                //防止重复加载
                 if (this.preventRepeatReuqest) {
				 	return 
                 }
                    _this.preventRepeatReuqest = true;
                    _this.pageNum++;
                    this.getlist();
            },
            // gettextlist(){
            //     var _this = this;
            //           console.log("566");
            //           getProxy('/message/page?pageNum='+_this.pageNum+'&pageSize='+_this.pageSize).then(res => {
            //               console.log(res);
            //               _this.testlist = [..._this.testlist, ...res.data.result];
            //               _this.preventRepeatReuqest = false;
            //               if (res.data.result.length < this.pageSize) {
			// 					this.touchend = true;
			// 				}
            //           })
            // },
            //下一个
        },
        watch: {
        	
	     }
    }
</script>

<style lang="scss" scoped>
@import 'src/style/mixin';
   .mask{
    position: fixed;
    top:0;
    left:0;
    z-index: 2;
    background: rgba(0, 0,0, 0.5);
    width: 100%;
    height: 100%;
  }
  
  .filter-list{
    position: absolute;
    top:.8rem;
    left:0;
    width:100%;
    z-index: 4;
    margin:0;
    padding:0;
    background: #fff;
    li{
      line-height: .6rem;
      height: .6rem;
      font-size: .3rem;
      padding-left:.5rem;
      color: #000;
    }
  } 
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
       span{
           color: #fff;
           font-size: .3rem;
           text-align: center;
           width: 3rem;
           margin:0 auto;
           line-height: 0.88rem;
           
       }
       img{
         width: 0.24rem;
         height: 0.15rem;
         margin-top:-.09rem;
         position: absolute;
         left:5rem;
         top:.5rem;
       }

  }

  .icon-back{
      position: absolute;
      left:0;
      top:0;
      width: .9rem;
      height: 100%;
      z-index: 2;
      img{
          width:12px;
          height:21px;
          position:absolute;
          left:.3rem;
          top:.35rem;
      }
  }

  .record{
      .record-list{
          margin:0;
          margin-top:0.9rem;
          padding:0;
          .record-list-li{
              margin-bottom: .23rem;
              height: 2.1rem;
              width:7.5rem;
              background: #fff;
               position: relative;
               .top-w{
                  width:100%;
                  color: rgb(107, 107, 107);
                  font-size: .26rem;
                  border-bottom: 1px solid rgb(231, 231, 231);
                  line-height: .7rem;
                  height: .7rem;
                  .top-w-l{
                      float: left;
                      width: 50%;
                      padding-left:.4rem;
                      font-family: "Regular";
                  }
                  .top-w-r{
                      float: right;
                      width:48%;
                      text-align: right;
                      padding-right: .5rem;
                      font-family: "Regular";
                  }
              }
              .bottom-w{
                  width:100%;
                  ul{
                      padding:0;
                      margin:0;
                      padding-left:.4rem;
                      li{
                          float: left;
                          width: 2.5rem;
                          padding-top:.24rem;
                          .tit{
                              font-size: .24rem;
                              color: rgb(107, 107, 107);
                              margin-bottom:.1rem;
                          }
                          .num{
                              color: #000;
                              width: 85%;
                              padding:0;
                              .yuan{
                                  font-size: .3rem;  
                                  font-family: "Medium";
                              }
                             border-right:1px solid rgb(231, 231, 231);
                             font-size: .3rem;
                          }
                          .last-num{
                              border-right:none!important;
                          }
                      }
                  }
                  
              }
              img{
                      position: absolute;
                      width: 1.18rem;
                      height: 1.18rem;
                      right: 0;
                      bottom:0;
                  }
          }
      }
      .loading{
	 	background: rgb(245,245,245);
	 	height: 0.66rem;
	 	text-align: center;
	 	font-size: 0;
        display: none;
	 	.loadMore{
	 		height: 0.47rem;
	 		width: 0.87rem;
	 		margin-top: 0.2rem;
	 	}
	 }
    
  }
.empty_data{
	@include sc(0.25rem, #666);
	text-align: center;
	line-height: 1rem;
}
</style>