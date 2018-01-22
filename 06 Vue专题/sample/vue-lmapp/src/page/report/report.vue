<template>
    <div class="report" > 
        <div class="page-top">
            <div style=" position: relative;top: 0;height: 0.1rem;"> 
                <div class="report-banner-out"></div>
                <div class="report-banner-w">
                    <div class="banner-in-w">
                        <div class="banner-topr-b" @click="gotoPage('/promotion_product','MJingFen_EarnBrokerage')">赚佣金<img src="../../images/report-r.png"></div>
                        <div class="banner-bottom">
                            <div class="banner-bottom-l">
                                <div class="tit" @click="infoAlert()" >预估结算收入(元)<img src="../../images/wenhao.png"></div>
                                <div class="brokerageNum" @click="deposit()">
                                    <span class="yongjin-num">  ¥{{balance}}  </span>
                                    <span class="tx-btn">提现
                                         <span class="icon"></span>  
                                    </span>
                                </div>
                            </div>
                            <div class="banner-bottom-l">
                                <div @click="infoAlertstay()" class="tit" style="margin-top:.2rem;">待入账(元) <img src="../../images/wenhao.png"></div>
                                <div class="stayNum">
                                    <span class="tit-num">¥{{waitPayBalance}}</span> 
                                    <span class="txjl-btn" @click = "gotoPage('/record','MJingFen_WithdrawRecord')">提现记录 
                                         <img src="../../images/icon_2.png">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tab-sj">
                <ul class="tab-ul">
                        <li id="today" :class="{ hover: changeShowType=='today'}"  @click="reportInfo('today')"> 今日 </li>
                        <li :class="{ hover: changeShowType=='yesterday'}"  @click="reportInfo('yesterday')"> 昨日</li>
                        <li :class="{ hover: changeShowType=='week'}"  @click="reportInfo('week')"> 
                              近<span class="num">7</span>日 
                        </li>
                </ul>
                <div class="all-sj"  @click = "gotoPage('/report_show_more','MJingFen_TotalIncomeDate')">
                    全部收入数据  <img src="../../images/icon_more.png">
                </div>
            </div>
            <div  class="tab-com">
                <ul>
                    <li>
                        <div class="tit-h2">点击量</div>
                        <div class="num">{{clickCount}}</div>
                    </li>
                    <li>
                        <div class="tit-h2">订单量</div>
                        <div class="num">{{cptOrderCount}}</div>
                    </li>
                    <li>
                        <div class="tit-h2">订单金额(元)</div>
                        <div class="num"><span class="symbol">¥</span>{{cptOrderPrice}}</div>
                    </li>
                    <li>
                        <div class="tit-h2">预估佣金(元)</div>
                        <div class="num" style="border-right:none!important"><span class="symbol">¥</span>{{orderComm}}</div>
                    </li>
                </ul>
                <section class="chart-out">
                    <div class="chart-tit">{{chartit}}</div>
                    <div class="chart-r"> </div>
                    <div class="chart-bottom">
                        <div id="chart">  </div>
                    </div>
                </section>
                <div style="clear:both"> </div>
            </div>
            
         </div>
          <section class="details-view" @click = "gotoPage('/orderlist','MJingFen_CheckOrderDetails')">
                查看订单明细<img src='../../images/icon_more_2.png'>
          </section>
          <div class="bottom-h"> </div>
          
       
    	<foot-guide></foot-guide>
    </div>    
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {imgBaseUrl} from 'src/config/env'
  import headTop from 'src/components/header/head'
  import footGuide from 'src/components/footer/footGuide'
  import activityList from 'src/components/common/activitylist'
  import {log,isOk} from 'src/config/mUtils'
  import {getProxy,jsonpProxyApiX} from 'src/service/proxy'
  import {weixinShare} from 'src/config/weixin_share'
  import $JJ from 'src/plugins/chart.js'

  import fetch from 'src/config/fetch'
  import moment from "moment"
  import 'src/components/jelly/jelly.js'


  export default {
  data(){
  return {
      changeShowType:"today",
      isActive: true,
      //图表标题
      chartit:"今日收入趋势",
      balance:"", //可申请金额
      waitPayBalance:"", //带支付金额
      //点击数
      clickCount:"0",
      //引入顶单量
      cptOrderCount:"0",
      //订单金额
      cptOrderPrice:"0",
      //预估佣金
      orderComm:"0",
      xdata:[],
      ydata:[],
      nowDate:"",
      todaydate:"", //今日的入参
      yesterday:"",//昨日的入参
      weekdate:"",//近7天的入参
   }
  },
  mounted(){
       var _this = this;
       //获取报表
        //getProxy('/getAvailWaitMoney').then(res => {
        jsonpProxyApiX('getAvailWaitMoney',{}).then(res=>{
            if(isOk(res)){
                    if(res.data.balance == ""|| res.data.balance =="0"){
                        res.data.balance ="0.00";
                    }
                    if(res.data.waitPayBalance == "" || res.data.waitPayBalance == "0"){
                        res.data.waitPayBalance = "0.00";
                    }
                    this.balance = res.data.balance;
                    this.waitPayBalance= res.data.waitPayBalance;
                     $j.showLoading();
                	this.$nextTick(() => {
                          $j.closeLoading();
                    })
                
            }
        });
       //获取当前时间并处理好入参时间
       let getDate =  fetch('/now').then(res => {
           _this.todaydate = moment(res).format("YYYY-MM-DD");
           _this.yesterday = moment(res).subtract(1,"day").format("YYYY-MM-DD");
           _this.weekdate = moment(res).subtract(7,"day").format("YYYY-MM-DD");
           setTimeout(function(){
                    _this.reportInfo("today");//默认是今日
                     //document.getElementById('#today').click();
           },100)
           
       });
  },
  components: {
        headTop,
        footGuide,
  },
  methods: {
        //转跳页面的方法
        gotoPage(path,val){
            var _this = this;
             log(val);  //点击跳转页面的埋点
            setTimeout(function(){
                 _this.$router.push(path);
            },100)
        },
        //转跳页面的方法 弹框infoAlert('info','btn','title')
          infoAlert(){
            log("MJingFen_ReadyToWithdraw");
            jelly.infoAlert('可申请提现的佣金总金额','我知道啦','什么是预估结算收入？');
		 },
		 //待入帐提示
         infoAlertstay(){
            jelly.infoAlert('您已申请且未完成支付的佣金','我知道啦','什么是待入账？');
            log("MJingFen_IntoAccount");
		 },
         //提现的方法
         deposit(){
             log("MJingFen_Withdraw"); //点击提现按钮的埋点
             var _this = this;
             // getProxy('/apply').then(res => {
             jsonpProxyApiX('apply',{}).then(res=>{
                 if(isOk(res)){
                       jelly.confirm({
                        title: [
                            '提现成功',
                        ],
                        content: '已提现佣金将在30天内审核并划入您绑定的银行卡内'
                        ,btn: ['提现记录', '我知道啦']
                        ,yes: function(){
                           //转跳提现记录页面
                             _this.gotoAddress('/record');
                        },
                        no: function(){
                            //点击我知道拉刷新当前页面
                             setTimeout(function(){
                               location.reload();
                             },2000);
                        }
                    });     
                 }else{
                      jelly.infoAlert(res.err_msg,'我知道啦',"提现");
                 }
              })
         }, 
         //收入数据 今日 昨天 近7日 近15日 近30日 是一个接口 入参是 开始时间 与 结束时间
         reportInfo(type){
         	if(this.todaydate==""){
         		return;
         	}
             var _this = this;
                 let url = "/reportInfo";
                 let param={};
                 if(type == "today"){ //今日  
                        url+="?startTime="+_this.todaydate+"&endTime="+_this.todaydate;
                        param={startTime:_this.todaydate,endTime:_this.todaydate};
                       _this.changeShowType = "today";
                       _this.chartit ="今日收入趋势";
                       log("MJingFen_Today");
                 }else if(type =="yesterday"){ //昨天
                        url+="?startTime="+_this.yesterday+"&endTime="+_this.yesterday;
                        param={startTime:_this.yesterday,endTime:_this.yesterday};
                        _this.changeShowType ="yesterday";
                        _this.chartit ="昨日收入趋势";
                         log("MJingFen_Yesterday");
                 }else if(type =="week"){ //近7天
                       url+="?startTime="+_this.weekdate+"&endTime="+_this.yesterday;
                       param={startTime:_this.weekdate,endTime:_this.yesterday};
                       _this.changeShowType = "week";
                       _this.chartit ="近7日收入趋势";
                          log("MJingFen_RecentSeven");
                 }
                 //getProxy(url).then(res => {
                   jsonpProxyApiX('reportInfo',param).then(res => {
                      if(isOk(res)){
                            var reportTotal = res.data.reportTotal;
                            if(reportTotal && reportTotal !=="null"){
                                _this.clickCount = reportTotal.clickCount;
                                _this.cptOrderCount = reportTotal.cptOrderCount;
                                _this.cptOrderPrice = reportTotal.cptOrderPrice;
                                _this.orderComm = reportTotal.orderComm;
                            }
                            var list = res.data.list;
                            var nxdata =[];
                            var nydata =[];
                            for(let i=0; i<list.length; i++ ){
                                nxdata.push( list[i].accountDate.replace(/-/g,"/").substring(5,10));
                                nydata.push(list[i].cptOrderCount);
                            }
                            _this.initChar(nxdata,nydata);
                      }
                 }) 
         },
         //初始化图表
         initChar(xdata,ydata){
             document.querySelector("#chart").innerHTML=("");
             var _this = this;
             //用数据渲染图表 初始化
                 var chart = new $J.Chart({
                    id: 'chart',
                    height:170,
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
      },
       
 }



</script>

<style lang="scss" scoped>
.report{
    margin-bottom: 1rem;
    height: 13rem;
    .page-top{
       height:auto;
       background-color: #ffffff!important;
    }
    .report-banner-out{
        height: 3.69rem;
        width: 100%;
        background: #FF0500;
        position:absolute;
        top:0;
        left:0;
        z-index: 1;
    }
    .report-banner-w{
        width: 7.1rem;
        height: 3.6rem;
        margin:.8rem auto;
        border-radius: .1rem;
        background: #fff;
        position:absolute;
        z-index: 2;
        top:0;
        left:.201rem;
        box-shadow:0 5px 10px #e1e1e1;
        .banner-in-w{
            width: 100%;
            height: 100%;
            background: url("../../images/report-bj.png") no-repeat 3.5rem bottom;
            background-size: 3.11rem 2.39rem;
            .banner-topr-b{
                float: right;
                font-size: 0.24rem;
                height: 0.58rem;
                width: 1.3rem;
                line-height: 0.58rem;
                text-align: center;
                background: #000;
                color: #fff;
                border-bottom-left-radius: .3rem;
                img{
                    width: .12rem;
                    height: 0.21rem;
                    margin-left:0.1rem;
                    margin-top:.07rem;
                }
            }
        }
    }
   
    .banner-bottom{
        width: 100%;
        height: 100%;
        padding-top:.15rem;
        clear: both;
        padding-left:.4rem;
        .tit{
                font-size: 0.26rem;
                img{
                    width: .24rem;
                    height: 0.24rem;
                    margin-left:.1rem;
                    vertical-align: middle;
                    margin-top:-0.05rem;

                }
            }
        .banner-bottom-l{
            width: 95%;
            float: left;
            .brokerageNum{
                .yongjin-num{
                    font-size: .68rem;
                    font-family: "myFirstFont";
                    font-weight: bold;
                    float: left;
                }
            }
            .stayNum{
                padding-top:0.1rem;
                .tit-num{
                    font-family: "myFirstFont";
                    font-weight: bold;
                    font-size: .48rem;
                    float: left;
                    margin-top:0.025rem;
                }
            }
            .tx-btn{
                padding-left:.2rem;
                font-size: 0.32rem;
                color: rgb(255, 58, 58);
                height: 0.35rem;
                float: left;
                margin-top:0.32rem;
                 @media screen and (max-width: 321px) {
                     margin-top:0.32rem;
                 }
                 @media screen and (max-width:376px) and (min-width:321px){
                        margin-top:0.32rem;
                 }
                  @media screen and (max-width:415px) and (min-width:376px){
                     margin-top:0.29rem;
                 }
                .icon{
                    display: inline-block; 
                    width:0.14rem; height:0.26rem; 
                    background: url("../../images/icon1.png") no-repeat center; 
                    background-size: 0.14rem 0.26rem;
                    white-space:nowrap; 
                }
            }
            .txjl-btn{
                padding-left:.2rem;
                font-size: 0.26rem;
                color: rgb(162, 162,174);
                height: 0.38rem;
                line-height: 0.38rem;
                float: left;
                margin-top:-0.01rem;
                 @media screen and (max-width: 321px) {
                      margin-top:-0.01rem;
                 }
                img{
                    width: 0.11rem;
                    height: 0.2rem;
                    margin-top:0.28rem;
                }
                
            }
        }
        .banner-bottom-r{
            width: 39%;
            float: right;
            .bring-up-btn{
                margin-top:.5rem;
                margin-left:.2rem;
                width:2rem;
                height:0.62rem;
                background:red;
                line-height: 0.62rem;
                text-align: center;
                font-size: .3rem;
                color: #fff;
                border-radius: .056rem;
                box-shadow:0 0 10px #cccccc;
            }
        }
    }
    .tab-sj{
        width: 7.5rem;
        margin:4.75rem auto 0;
        .tab-ul{
            margin:0;
             padding-left:0.3rem;
             float: left;
             width: 60%;
            li{
                float: left;
                display: inline-block;
                font-size: .3rem;
                padding-right: 0rem;
                text-align: center;
                margin-right: .5rem;
                height: 0.46rem;
            }
            .hover{
                color:red!important;
                border-bottom: 2px solid red;
                .num{
                    color: red!important;
                }
            }
        }
        .all-sj{
            font-size: 0.26rem;
            text-align: right;
            padding-right: 0.2rem;
            float: right;
            width: 30%;
            height: 0.38rem;
            line-height: 0.38rem;
            // background: url("../../images/icon_more.png") no-repeat right 0.08rem;
            // background-size: 0.11rem 0.2rem;
            margin-right: 0.2rem;
            img{
                width: 0.11rem;
                height: 0.2rem;
                margin-top:0.08rem;
            }
        }
    }
    .tab-com{
        width: 7.5rem;
        margin:0 auto;
        clear: both;
        height:1.7rem;
        border-bottom: 1px solid #e8e8e8;
        ul{
            margin:0;
            padding:0;
            width: 100%;
            clear: both;
            padding-left:0.3rem;
            li{
                float: left;
                display: inline-block;
                height: 1rem;
                margin-top:.3rem;
                margin-bottom: .22rem;
                width:1.7rem;
                .tit-h2{
                    font-size:.24rem;
                    color: rgb(107, 107, 107);
                    height: .5rem;
                    padding:0;
                    margin:0;
                }
                .num{
                    font-size: .3rem;
                    padding:0;
                    margin:0;
                    font-weight: bold;
                    border-right:1px solid rgb(231, 231, 231);
                    width:90%;
                     font-family: "myFirstFont";
                     &:nth-child(4){
                           border-right:none;
                     }
                }
                 &:nth-child(4){
                    width:1.8rem;
                 }
                 &:nth-child(3){
                    width:1.89rem;
                 }
               
            }
        }
    }

    .chart-out{
        width: 7.5rem;
        margin:0 auto;
        margin-top:-0.1rem;
        clear: both;
        padding-top:.3rem;
        background: #fff;
        border-top: 1px solid #e8e8e8;
         @media screen and (max-width: 321px) {
            height: 5.7rem!important;
         }
        .chart-tit{
            font-size: .3rem;
            font-family: "PingFangSc-Linght";
            float: left;
            width: 45%;
            padding-left:0.2rem;
        }
        .chart-r{
            float:right;
            width: 40%;
            height: .5rem;
            line-height: .5rem;
            margin-top:-.18rem;
            text-align: right;
             padding-right: 0.2rem;
            img{
                width: .24rem;
                height: 0.24rem;
                display: inline-block;
                vertical-align: middle;
                
            }
            .chart-tip{
                font-size: .24rem;
                color: rgb(163,163, 163);
                display: inline-block;
                margin-left:-.2rem;
                vertical-align: middle;
            }
        }
        .chart-bottom{
            clear: both;
            height: 4rem;
            width: 7.1rem;
            font-size: .2rem;
            padding-top:.2rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .details-view{
        width: 100%;
        height: 1rem;
        text-align:center;
        font-size: .26rem;
        background:#fff;
        margin-top:4.5rem;
        margin-bottom: 1.5rem;
        border-top:0.15rem solid rgb(245, 245, 245);
        line-height: 0.9rem;
         vertical-align: middle;
         @media screen and (max-width: 321px) {
                 margin-top:5rem;
                 line-height: .9rem;
         }
        span{
            display:inline-block;
            vertical-align: middle;
        }
        img{
            width: .11rem;
            height: 0.2rem;
            margin-left:.2rem;
            vertical-align: middle;
            display: inline-block;
            margin-top:-0.05rem;
        }
    }
   .bottom-h{
       height: 0.1rem;
       background: #F5F5F5!important;
   }


 }
</style>
