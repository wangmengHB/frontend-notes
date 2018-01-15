<template>
	<div class="report-show-more">
       <div class="report-top" >
               <!-- <div class="icon-back" @click="goback()"> 
                   <svg data-v-c1a0b454="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1"><polyline data-v-c1a0b454="" points="12,18 4,9 12,0" style="fill: none; stroke: rgb(255, 255, 255); stroke-width: 2;"></polyline></svg>
               </div> -->
                <div class="icon-back" @click="goback()"> 
                    <svg width="100%" height="100%" viewBox="0 0 15 24" xmlns="http://www.w3.org/2000/svg" version="1.1">
		                <polyline points="15,0 0,12 15,24" style="fill:none;stroke:rgb(255,255,255);stroke-width:4"/>
		            </svg>
               </div>

               <span @click="osortShow('A')">
                    <span>{{title}}</span>
                    <img v-show="sortShow=='A'"  src="../../images/icon_up.png"  />
                    <img v-show="sortShow=='B'"  src="../../images/icon_down.png"  />
               </span>
       </div>
       <div class="mask"  v-show="sortShow=='A'"  @click="osortShow('B')"> 
          <ul class="filter-list">
            <li v-for="item in filterlist" @click="recordlist(item.type)" type= item.type  :class="{ hover: type==item.type}"> {{item.name}}<img v-show= "type === item.type " src="../../images/icon_y .png"></li>
           
          </ul>
       </div>
      <div class="top-tab-list">
         <ul>
             <li>
                <div class="tit"> 点击量 </div>
                <div class="num">
                    <div class="yuan">{{clickCount}}</div>
                </div>
             </li>
            <li>
                <div class="tit"> 订单量 </div>
                <div class="num">
                   <div class="yuan">{{cptOrderCount}}</div>
                </div>

             </li>
             <li>
                <div class="tit"> 订单金额 </div>
                <div class="num">
                    <div class="yuan"><span class="symbol">¥</span>{{cptOrderPrice}}</div>
                </div>

             </li>
             <li>
                <div class="tit"> 预估佣金 </div>
                <div class="num border-non">
                    <div class="yuan "><span class="symbol">¥</span>{{orderComm}}</div>
                </div>

             </li>
         </ul>
         <div class="chart">
              <div id="chart-sr">  </div>
         </div>
    </div>
    <div class="tab-out">
        <table class="report-list">
            <thead>
                <tr>
                    <th>日期</th>
                    <th>订单量</th>
                    <th >订单金额</th>
                    <th style="text-align:right">佣金</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in list">
                    <td>{{item.accountDate}}</td>
                    <td>{{item.cptOrderCount}}</td>
                    <td><span class="symbol">¥</span>{{item.cptOrderPrice}}</td>
                    <td><span class="symbol">¥</span>{{item.orderComm}}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import {listProducts,listLibraries,addProduct} from 'src/service/getPromotion'
	import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
	import {getStore} from 'src/config/mUtils'
	import {imgBaseUrl,loginUrl} from 'src/config/env'
	import {showBack, animate,log,isOk} from 'src/config/mUtils'
	import {getImgPath} from 'src/components/common/mixin'
    import loading from 'src/components/common/loading'
    import $j from 'src/plugins/chart.js'
    import moment from "moment"
    import fetch from 'src/config/fetch'

    export default {
    	data(){
            return{
              headTitle:"近期收入明细",
              changeShowType:"week",
              sortShow:"B",   //默认隐藏
              type:"A",
              title:"今日收入数据",
               //点击数
              clickCount:"0",
                //引入顶单量
              cptOrderCount:"0",
                //订单金额
              cptOrderPrice:"0.00",
                //预估佣金
              orderComm:"0.00",
              //下面列表数据
              list:"",
              todaydate:"", //今日的入参
              yesterday:"",//昨日的入参
              weekdate:"",//近7天的入参
              day15:"",//近15日的入参
              day30:"",//近30日的入参
              filterlist:[
                    {"name":"今日", "type":"A"},
                    {"name":"昨日", "type":"B"},
                    {"name":"近7日", "type":"C"},
                    {"name":"近15日", "type":"D"},
                    {"name":"近30日", "type":"F"},
              ],
              //头部要显示的文案
              titlelist:[
                    { title:"今日收入数据",type:"A",log:'MJingFen_TodayIncomeDate'},
                    { title:"昨日收入数据" ,type:"B",log:'MJingFen_YesterdayIncomeDate'},
                    { title:"近7日收入数据", type:"C",log:'MJingFen_RecentSevenIncomeDate'},
                    { title:"近15日收入数据", type:"D",log:'MJingFen_RecentFifteenIncomeDate'},
                    { title:"近30日收入数据", type:"F",log:'MJingFen_RecentThirtyIncomeDate'},
              ]
            }
        },
         props: [
            'filter',
            'isHome',
        ],
        created(){
           
        },
        mounted(){
            var _this = this;
           //获取当前时间并处理好入参时间
            let getDate =  fetch('/now').then(res => {
                _this.todaydate = moment(res).format("YYYY-MM-DD");
                _this.yesterday = moment(res).subtract(1,"day").format("YYYY-MM-DD");
                _this.weekdate = moment(res).subtract(7,"day").format("YYYY-MM-DD");
                _this.day15 = moment(res).subtract(15,"day").format("YYYY-MM-DD");
                _this.day30 = moment(res).subtract(30,"day").format("YYYY-MM-DD");
                _this.recordlist("A");
            });
          
        },
        components: {
	    	loading,
	    },
        computed: {
        },
        mixins: [],
        methods: {  
            //点击头部的请求提现记录 显示的list筛选项
            async recordlist(type){
                 var _this = this;
                 let url = "/reportInfo";
                 let param={};
                 if(type == "A"){
                      url+="?startTime="+_this.todaydate+"&endTime="+_this.todaydate;
                      param.startTime=_this.todaydate;
                      param.endTime=_this.todaydate;
                      this.title= this.titlelist[0].title;
                      this.type = this.titlelist[0].type;
                      this.eventId = this.titlelist[0].log;
                 }else if(type =="B"){
                     url+="?startTime="+_this.yesterday+"&endTime="+_this.yesterday;
                     param.startTime=_this.yesterday;
                     param.endTime=_this.yesterday;
                     this.title= this.titlelist[1].title;
                     this.type = this.titlelist[1].type;
                     this.eventId = this.titlelist[1].log;
                 }else if(type == "C"){
                      url+="?startTime="+_this.weekdate+"&endTime="+_this.yesterday;
                      param.startTime=_this.weekdate;
                      param.endTime=_this.yesterday;
                      this.title= this.titlelist[2].title;
                      this.type = this.titlelist[2].type;
                      this.eventId = this.titlelist[2].log;
                 }else if(type == "D"){
                      url+="?startTime="+_this.day15+"&endTime="+_this.yesterday;
                      param.startTime=_this.day15;
                      param.endTime=_this.yesterday;
                      this.title= this.titlelist[3].title;
                      this.type = this.titlelist[3].type; 
                      this.eventId = this.titlelist[3].log;
                 }else{
                      url+="?startTime="+_this.day30+"&endTime="+_this.yesterday;
                      param.startTime=_this.day30;
                      param.endTime=_this.yesterday;
                      this.title= this.titlelist[4].title;
                      this.type = this.titlelist[4].type;
                      this.eventId = this.titlelist[4].log;
                 }
                 log(this.eventId);
                //以上是请求url 入参 条件
                 //getProxy(url).then(res => {
                 jsonpProxyApiX("reportInfo",param).then(res => {
                      var reportTotal = res.data.reportTotal;
                      if(reportTotal && reportTotal !=="null"){

                          if(reportTotal.cptOrderPrice == "0" ){
                                 _this.cptOrderPrice = "0.00";
                          }else{
                               _this.cptOrderPrice =  reportTotal.cptOrderPrice;
                          }
                          if( reportTotal.orderComm  == "0"){
                                _this.orderComm = "0.00";
                          }else{
                              _this.orderComm = reportTotal.orderComm;
                          }
                           //上面是处理 金额为0时，默认格式0.00
                          _this.clickCount = reportTotal.clickCount;
                          _this.cptOrderCount = reportTotal.cptOrderCount;
                        
                          
                      }
                      var list = res.data.list;
                      _this.list = list;
                      var nxdata =[];
                      var nydata =[];
                      //30天的时候处理数据 中间隔3个
                      if(type == "F"){
                           var index=0;
                           for(let i=0; i<30; i++ ){
                              if(index<30){ //近30天的处理图表x y的数据
                                  dispose(list,index);
                                 index = index+4;
                               }
                                listval(list,i);
                           }
                      }else if(type == "D"){ //15天 数据隔2天
                             var index=0;
                             for(let i=0; i<15; i++ ){
                              if(index<15){ //近30天的处理图表x y的数据
                                 dispose(list,index);
                                 index = index+2;
                               }
                               listval(list,i);
                           }
                      }else{ //其它的都是正常显示
                        for(let i=0; i<list.length; i++ ){
                              dispose(list,i);
                              listval(list,i);
                         }
                      }
                      //处理时间格式，与金额为0的时候
                      function listval(list,i){
                          if(list[i].cptOrderPrice == null  || list[i].cptOrderPrice =="0") {
                              list[i].cptOrderPrice = "0.00";
                           }
                           if(list[i].orderComm == null || list[i].orderComm=="0"){
                               list[i].orderComm = "0.00";
                           }
                           list[i].accountDate = list[i].accountDate.replace(/-/g,".");
                           
                      }
                      //处理 15 天与 30天的图表x与y的维度
                      function dispose(list,i,index){
                             nxdata.push(list[i].accountDate.replace(/-/g,"/").substring(5,10));
                             nydata.push(list[i].cptOrderCount);
                      }
                      _this.initChar(nxdata,nydata); //去渲染图表
                 }) 
            },
            // 点击显示筛选项
            async osortShow(type){
                console.log(type);
                if(this.todaydate==""){
                	return;
                }
                if(type == "A"){
                    this.sortShow = "A";
                }else if( type == "B"){
                    this.sortShow = "B";
                }
            },
            //初始化图表
            initChar(xdata,ydata){
                var _this = this;
                //用数据渲染图表 初始化
                var chart = new $J.Chart({
                    id: 'chart-sr',
                    xAxis: {
                        name: "日期",
                        data: xdata,
                    },
                    yAxis: [{
                        name: "订单量",
                        data:ydata,
                    }]
                });
            },
            //点击回到上一页
            goback(){
                //window.history.go(-1);
                  if(window.isNative){   //native 发送协议
	        			let data={type:'1'};
	        			window.postMessage(JSON.stringify(data),'*'); 
	        			location.href="junion://j.u?act=goBack&isClose=0";
	        	  }else{
	                window.history.go(-1);
	              }
            },//下一个
        },
        watch: {
            
        }
    }
</script>

<style lang="scss" scoped>
.report-show-more{
    background: #fff!important;
    
    .chart{
        background: #fff;
        padding-bottom:.2rem;
    }
    .top-tab-list{
        padding-top:1.2rem;
        height: 6.6rem;
        
        @media screen and (max-width: 321px) {
            height: 7.2rem;
         }
        width: 100%;
        background: #fff;
        ul{
            margin:0;
            padding:0;
             border-bottom:1px solid #e8e8e8;
             overflow: hidden;
             padding-bottom: .25rem;
            li{
                float: left;
                width: 1.85rem;
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
                        font-size: .3rem;
                         font-family: "Medium";
                    }
                }
                .border-non{
                    border-right: none!important;
                }
            }
        }
    }

     .tab-out{
        border-top:.2rem solid rgb(245, 245, 245);
        padding-bottom:.2rem;
        
     }
    .report-list{
            margin-top:0.1rem;
            padding-top:0rem;
            width: 100%;
            border-collapse:collapse;
           thead{
               font-size: .24rem;
               color: rgb(107, 107, 107);
               line-height: .8rem;
               tr{
                   th{
                        border-bottom: 1px solid #e8e8e8;
                       &:nth-child(1){
                         padding-left:.4rem;
                         text-align: left;
                       }
                        &:nth-child(2){
                         padding-left:.4rem;
                         text-align: left;

                       }
                        &:nth-child(3){
                           text-align: right;
                       }
                        &:nth-child(4){
                           text-align: right;
                           padding-right: .4rem;
                       }
                   }
               }
           }
           tbody{
               font-size: .28rem;
               tr{
                   line-height: .8rem;
                   td{
                       border-bottom: 1px solid #e8e8e8;
                       font-size: .28rem;
                       color: #000;
                       font-family: "Regular";
                       &:nth-child(1){
                           padding-left:.4rem;
                       }
                       &:nth-child(2){
                            padding-left:.4rem;
                            text-align: left;
                       }
                       &:nth-child(3){
                           text-align: right;
                       }
                        &:nth-child(4){
                           text-align: right;
                           padding-right: .4rem;
                       }
                   }
               }
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
  }
  .filter-list{
    position: absolute;
    top:.8rem;
    left:0;
    width:100%;
    z-index: 888;
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
      border-bottom: 1px solid #e8e8e8;
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
  .icon-back{
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
		    padding: 0 0.28rem;
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
         width: 0.16rem;
         height: 0.09rem;
         display: inline-block;
         vertical-align: middle;
       }
       .icon{
            display: inline-block; 
            width:0.14rem; height:0.26rem; 
            background: url("../../images/icon1.png") no-repeat center; 
            background-size: 0.14rem 0.26rem;
            white-space:nowrap; 

       }

  }
}
</style>