<template>
	<div class="orderdetails">
     <head-top :goBack="true" :headTitle="headTitle">
     </head-top>
     <div class="orderdetails-top">
        <div class="top-state">
             <div  v-if="orderlist.orderStatus == '已完成'" >
                 <img class="state-img" src="../../images/icon_red.png" >
                 <div class="state-tit-red"> {{orderlist.orderStatus}} </div>
             </div>
             <div  v-else > 
                 <img class="state-img"  src="../../images/icon_group.png" >
                 <div class="state-tit-grey"> {{orderlist.orderStatus}} </div>
             </div>
        </div>
        <!-- <img src="../../images/icon_plus.png" class="state-plus"> -->
        <div class="top-tip">
          共{{orderlist.allSkuNum}}件 <span class="top-yuan">订单总额¥{{orderlist.allSkuPrice}}元</span>  预估总佣金 ¥{{orderlist.commission}}
        </div>
     </div>
      <div class="order-time">
          <p>下单时间  {{orderlist.orderDate}} </p>  
          <p>订单编号  {{orderlist.orderId}} </p>  
      </div>
      <div class="order-list"> 
          <ul>
            <li class="order-list-li" v-for="item in orderlist.skus">
                <div class="li-l"> <img :src="imgBaseUrl + '/s300x300_' + item.imageUrl" @load="successLoadImg"   class="default-image"> </div>
                <div class="li-r">
                  <p class="tit"> {{item.skuName}} </p>
                  <div class="num"> 数量 {{item.skuNum}}   ¥{{item.skuPrice}}</div>
                  <div class="num-scale">
                    <ul>
                        <li>预估佣金¥{{item.commission}} 佣金比例{{item.commissionRate}}% 分成比例{{item.subsideProportion}}% </li>
                    </ul>
                  </div>
                </div>
             </li>
          </ul>
      </div>
    </div>
</template>

<script>
  import headTop from 'src/components/header/head'
	import {mapState,mapMutations} from 'vuex'
	import {listProducts,listLibraries,addProduct} from 'src/service/getPromotion'
	import {getProxy} from 'src/service/proxy'
	import {getStore} from 'src/config/mUtils'
	import {imgBaseUrl,loginUrl} from 'src/config/env'
	import {showBack, animate} from 'src/config/mUtils'
	import {getImgPath} from 'src/components/common/mixin'
  import loading from 'src/components/common/loading'
  
  export default {
    	data(){
            return{
              headTitle:"订单详情",
              changeShowType:"week",
              sortShow:false,   //排序是否展开
              type:"F",
              title:"订单明细",

              pageNum: 0,
              shopList:[],
              showLoading:false,
              imgBaseUrl:imgBaseUrl,
              orderlist:{},
            }
        },
        props: [
            'filter',
            'isHome',
        ],
        created(){
           
        },
        mounted(){
          this.getdetails();
        },
        components: {
          loading,
          headTop
	      },
        computed: {
        },
        mixins: [],
        methods: {     
          //方法
          getdetails(){
               this.orderlist =JSON.parse(sessionStorage.getItem("order"));
               for(var i=0; i<=this.orderlist.skus.length; i++){
                  var item = this.orderlist.skus[i];
                 


               }
             //  console.log(sessionStorage.getItem("order"));
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
.orderdetails{
  .orderdetails-top{
    margin-top:0.9rem;
    height: 1.7rem;
    width: 7.5rem;
    background: #fff!important;
    position: relative;
    font-size: 0.36rem;
    box-shadow: 0px 2px 10px 0px #e1e1e1;
    .top-state{
       height: 0.6rem;
       padding-top:.3rem;
       padding-left:.3rem;
      .state-img{
        width: 0.38rem;
        height: 0.38rem;
        vertical-align: middle;
        display: inline-block;
      }
      .state-tit-red{
          font-size: 0.36rem;
          color: rgb(255, 58, 58);
          display: inline-block;
          vertical-align: middle;
      }
       .state-tit-grey{
          font-size: 0.36rem;
          color: rgb(163, 163, 163);
          display: inline-block;
          vertical-align: middle;
      }
    }
     .state-plus{
        position: absolute;
        right: 0;
        top:.3rem;
        width: 1.7rem;
        height: 0.4rem;
    }
    .top-tip{
      font-size: .26rem;
      color: #000;
      margin-left:.3rem;
      margin-top:.35rem;
      .top-yuan{
        margin-left:0.05rem;
        margin-right: 0.09rem;
      }
    }
  }
  .order-time{
    height: 1.1rem;
    width: 7.5rem;
    background: #fff;
    margin-top:.2rem;
    padding-top:0.2rem;
    padding-left:.3rem;
    p{
      font-size: 0.24rem;
      color: rgb(107, 107, 107);
      &:nth-child(2){
        margin-top:0.05rem;
      }
    }
  }
  .order-list{
    ul{
      margin:0;
      padding:0;
       .order-list-li{
         clear: both;
         width: 100%;
         height: 1.8rem;
         margin-top:.16rem;
         background: #fff;
         overflow: hidden;
         .li-l{
           width: 1.8rem;
           float: left;
           img{
             width: 1.2rem;
             height: 1.2rem;
             margin:0.35rem;
           }
         }
         .li-r{
            padding-top:.3rem;
            width: 5.6rem;
            float: left;
            .tit{
              font-size: 0.28rem;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            .num{
              font-size: 0.22rem;
              color: rgb(163, 163, 163);
              margin-top:0.05rem;
            }
            .num-scale{
              margin-top:0.29rem;
              ul{
                margin:0;
                li{
                  white-space:nowrap;
                  float: left;
                  margin-right: .1rem;
                  font-size: 0.22rem;
                  color: rgb(107, 107, 107);
                }
              }
            }

         }
       }
    }
  }

}
 .default-image{
	background-image: url(../../images/order_banner.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
 }
</style>