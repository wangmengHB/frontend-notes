<template>
	<div>
		<head-top goBack="true" headTitle="转链" tutorial="true" @showTutorial="showTutorial"></head-top>
		<div class="translink-main">
			<div class="tip" v-show="showTip">
				<img src="../../images/transtip.png"><span class="words">通过转换后链接所生成的订单才能计入到您的佣金中</span>
				<span class="close">
					<svg @click="showTip = false" width="100%" height="100%" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" version="1.1" stroke="rgb(186, 186, 186)" stroke-width="2"><line x1="2" y1="2" x2="8" y2="8"/><line x1="2" y1="8" x2="8" y2="2"/></svg>
				</span>
			</div>
			<div v-if="!translinked">
				<div class="textarea">
					<textarea v-model="textarea" @focus="placeholder = false;" @blur="placeholder = true" ref="textarea" style="outline: none;">
					</textarea>
					<div v-show="placeholder && textarea.length == 0" class="placeholder" @click="$refs.textarea.focus();"><span>请将您要推广的商品链接</span><span>粘贴到这里(支持纯连接、链接+文字)</span></div>
				</div>
				<div class="translink-button" @click="translink" :style="{'background': textarea.length > 0? 'linear-gradient(rgb(255, 5, 0),rgb(255,68,64))': 'rgb(221, 221, 221)'}">
					<div class="center">
						<img src="../../images/translink_button.png"><span>转换成我的链接</span>
					</div>
				</div>
			</div>
			<div class="translinked" v-else>
				<header class="header"><span>转换后的链接</span></header>
				<section class="section">
					<div class="textbox" v-if="shareInfo">
						{{shareInfo.skuName}}
						<br/>
						【京东价】&nbsp;{{shareInfo.wlPrice | currency}}元
						<br/>
						<span v-if="shareInfo.hasCoupon">
							【券后价】&nbsp;{{shareInfo.couponPrice | currency}}元
							<br/>
						</span>
						【下单链接】<br/>
						{{shareInfo.pushUrl}}
					</div>
					<div class="commision">
						<div class="price">
							<span>预估佣金</span><span>￥{{commision}}</span>
						</div>
					</div>
				</section>
				<footer class="footer">
			        <section @click="goShare(0)" class="footer_item">
			            <img src="../../images/wechat.png" class="icon_style">
			            <span>微信</span>
			        </section>
			        <section @click="goShare(1)" class="footer_item">
			            <img src="../../images/moments.png" class="icon_style">
			            <span>朋友圈</span>
			        </section>
			        <section @click="goShare(2)" class="footer_item">
			            <img src="../../images/qq.png" class="icon_style">
			            <span>QQ</span>
			        </section>
			        <section @click="goShare(3)" class="footer_item">
			            <img src="../../images/copylink.png" class="icon_style">
			            <span>复制链接</span>
			        </section>
				</footer>
			</div>
		</div>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
		<weixin-share v-if="weixinShare" @closeShare="weixinShare = false"></weixin-share>
	</div>
</template>

<script>
	import headTop from 'src/components/header/head'
	import {postProxy,jsonpProxyApiX} from 'src/service/proxy'
	import {isOk, isApp, isWeiXin, getAppInfo, log, trim} from 'src/config/mUtils'
	import 'src/components/jelly/jelly.js'
	import 'src/components/jelly/jelly.css'
	import weixinShare from 'src/components/common/weixinShare'
	import {setWxShareData} from 'src/config/weixin_share'

	export default{
		data(){
			return {
				showTip: true,
				placeholder: true,
				textarea: '',
				translinked: false,
				shareInfo: null,
				weixinShare: false, //微信分享弹出层
				shareLogMap: ["MJingFen_UrlShareWX", "MJingFen_UrlShareMoment", "MJingFen_UrlShareQQ", "MJingFen_UrlShareCopy"]
			}
		},
		components: {
			headTop,
			weixinShare
		},
		computed: {
			commision: function(){
				if(this.shareInfo){
					return parseFloat(this.shareInfo.wlCommission).toFixed(2);
				}else{
					return ''
				}
			},
			textbox: function(){
				if(this.shareInfo){
					let textbox = this.shareInfo.skuName
					+ '【京东价】&nbsp;' + parseFloat(this.shareInfo.wlPrice).toFixed(2) + '元'
					+ (this.shareInfo.hasCoupon? ('【券后价】&nbsp;' + parseFloat(this.shareInfo.couponPrice).toFixed(2) + '元'): '')
					+ '【下单连接】' + this.shareInfo.pushUrl;
					return textbox
				}else{
					return ''
				}
			}
		},
		filters: {
			currency: function(val){
				if(val) return parseFloat(val).toFixed(2);
				return val;
			},
		},
		watch: {

		},
		created(){

		},
		mounted(){

		},
		methods: {
			translink(){
				if(this.textarea.length == 0){
					return
				}

				log("MJingFen_GenerateMyUrl")

				let promoteReg = /(https|http):\/\/(item.jd.com|item.m.jd.com|wi.jd.com|wqitem.jd.com|wqitem.jd.hk|wqmitem.jd.com|union-click.jd.com|jingfen.jd.com|qwd.jd.com)\/[\/\w-.,@?^%&:~#=+]*/gi;
				let promoteUrl = this.textarea.match(promoteReg);
				promoteUrl = promoteUrl? promoteUrl: [];
				console.log(promoteUrl)

				if(promoteUrl.length > 1){
					$j.infoAlert('目前不支持一次转换多个链接，请修改后重试','我知道了','转链失败')
					log("MJingFen_UrlFail")
					return
				}else if(promoteUrl.length == 0){
					$j.infoAlert('未检测到链接信息，请修改后重试','我知道了','转链失败')
					log("MJingFen_UrlFail")
					return
				}

				let promotionUrl = promoteUrl[0];
				promotionUrl.lastIndexOf('http') > 0? promotionUrl=promotionUrl.substr(0, promotionUrl.lastIndexOf('http')): promotionUrl

				let couponReg = /(https|http):\/\/(coupon.jd.com|coupon.m.jd.com|wqs.jd.com)\/[\/\w-.,@?^%&:~#=+]*/gi;
				let couponUrl = this.textarea.match(couponReg);
				couponUrl = couponUrl? couponUrl: [];
				console.log(couponUrl)

				if(couponUrl.length > 1){
					$j.infoAlert('目前不支持一次转换多个链接，请修改后重试','我知道了','转链失败')
					log("MJingFen_UrlFail")
					return
				}

				couponUrl = couponUrl[0];

				let data = {
					promotionUrl: encodeURIComponent(promotionUrl)
				}
				if(couponUrl){
					couponUrl.lastIndexOf('http') > 0? couponUrl=couponUrl.substr(0, couponUrl.lastIndexOf('http')): couponUrl;
					data.couponUrl = encodeURIComponent(couponUrl);
				}
				console.log(data)
				$j.toast("转链中···", "translink", 10 * 3600);

				//postProxy('/adv/switchPushUrl', data, {type: 'POST', contentType: 'application/x-www-form-urlencoded'}).then(res => {
				console.log(data);
				jsonpProxyApiX('switchPushUrl',data).then(res => {
				   setTimeout(() => {
				 		$j.closeLoading();
				 	}, 800)

					if(isOk(res, false)){
						this.shareInfo = res.data;
						 this.translinked = true;
					}else{
						// this.translinked = true;
						// this.shareInfo = {
					 //        "skuId":4891236,
					 //        "skuName":"【超值套装】小米 红米 4X 全网通版 2GB 16GB 磨砂黑 移动联通电信4G手机",
					 //        "imageUrl":"jfs/t4237/313/2933634844/210981/3a99889d/58d87bc4N015a9502.jpg",
					 //        "wlPrice":999.01,
					 //        "hasCoupon":0,
					 //        "couponPrice":0,
					 //        "wlCommission":999,
					 //        "pushUrl":"https://union-click.jd.com/jdc?d=pCGYaL"
					 //    }
					 //    this.shareInfo.imageUrl = "https://img12.360buyimg.com/cms/s600x300_" + this.shareInfo.imageUrl;
					 	log("MJingFen_UrlFail")
					 	console.log(res.err_msg);
					 	setTimeout(() => {
					 		$j.toast("当前转链失败，请稍后重试");
					 	}, 800)
					}
				}).catch(e => {
					log("MJingFen_UrlFail")

				 	setTimeout(() => {
				 		$j.closeLoading();
				 	}, 800)

				 	setTimeout(() => {
				 		$j.toast("当前转链失败，请稍后重试");
				 	}, 800)

					console.log(e)
				})
			},
			goShare(index){
				log(this.shareLogMap[index])
				
				if (isApp()) {
			        let appInfo = getAppInfo();
			        let os = appInfo && appInfo['os'];
			        os = os.toLowerCase();
			        // let version = appInfo && appInfo['version'];
			        if(this.shareInfo.couponPrice == 0){
			        	this.shareInfo.couponPrice = 0;
			        }
			        let json = JSON.parse(JSON.stringify(this.shareInfo));
			        json.index = index;

			        try{
				        if(os == 'android'){
				        	window.JavaObject.callApi(index, JSON.stringify(json));
				        }else if(os == 'ios'){
				        	window.webkit.messageHandlers.call_api.postMessage(json);
				        }else{
				        	$j.toast('当前转链失败，请稍后重试');
				        	return
				        }
					}catch(e){
						$j.toast(e)
					}
				}else if (isWeiXin() && (index != 3)) {
					let param = {
				        img: this.shareInfo.imageUrl,
				        url: this.shareInfo.pushUrl,
				        content: this.textbox, //"朋友推荐给我这个商品，感觉很不错，也推荐你用一下"
				        title: this.shareInfo.skuName,
				    }
				    setWxShareData(param);
				    this.weixinShare = true;
				    $j.toast("已设置分享内容，请点击右上角分享！");
				} else if(isWeiXin()){
					$j.toast("请到京粉APP复制链接！");
				} else {
				    $j.toast("请到京粉APP或微信公众号进行推广！");
				}
			},
			showTutorial(){
				log('MJingFen_UrlCourse')
				this.$router.push('/translink/tutorial');
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'src/style/mixin';

	.translink-main{
		padding-top: 0.88rem;
		.tip{
			@include wh(100%, 0.7rem);
			background-color: rgba(255, 5, 0, .2);
			font-size: 0.24rem;
			line-height: 0.36rem;
			position: relative;
			img{
				@include wh(0.27rem, 0.27rem);
				@include ct;
				left: 0.28rem;
			}
			.words{
				@include ct;
				left: 0.64rem;
			}
			.close{
				@include wh(0.227rem, 0.227rem);
				@include ct;
				right: 0.302rem;
				font-size: 0;
				line-height: 0;
			}
		}
		textarea{
			@include wh(100%, 3.48rem);
			font-size: 0.26rem;
			line-height: 0.4rem;
			padding: 0.27rem 0.41rem 0 0.31rem;
		}
		.textarea{
			position: relative;
			margin-top: 0.22rem;
			font-size: 0.26rem;
			line-height: 0.4rem;
			.placeholder{
				width: 100%;
				height: auto;
				padding: 0;
				margin: 0;
				position: absolute;
				left: 0;
				top: 0.3rem;
				line-height: 0.22rem;
				span:nth-child(1){
					font-size: 0.26rem;
					margin: 0 0.14rem 0 0.3rem;
				}
				span:nth-child(2){
					font-size: 0.22rem;
					color: rgb(153, 153, 153);
				}
			}
		}
		.translink-button{
			@include wh(92%, 0.9rem);
			@include cl;
			font-size: 0.36rem;
			border-radius: 0.45rem;
			margin-top: 0.3rem;
			.center{
				@include center;
			}
			img{
				@include wh(0.39rem, 0.4rem);
				margin-right: 0.1rem;
			}
			span{
				font-size: 0.36rem;
				line-height: 1;
				color: #fff;
			}
		}
		.translinked{
			.header{
				@include wh(100%, 0.82rem);
				position: relative;
				span{
					@include sc(0.24rem, rgb(163, 163, 163));
					line-height: 0.36rem;
					@include center;
				}
			}
			.section{
				background-color: #fff;
				.textbox{
					@include wh(100%, 3.48rem);
					border-bottom: 0.01rem solid rgb(238, 238, 238);
					font-size: 0.26rem;
					line-height: 0.4rem;
					padding: 0.27rem 0.41rem 0 0.31rem;
				}
				.commision{
					@include wh(100%, 0.84rem);
					position: relative;
					font-size: 0.26rem;
					line-height: 0.4rem;
					.price{
						width: 100%;
						@include ct;
						left: 0;
					}
					span{
						color: rgb(37,37,37);
					}
					span:nth-child(1){
						margin-left: 0.28rem;
					}
					span:nth-child(2){
						font-weight: bold;
						margin-left: 0.18rem;
					}
				}
			}
		    .footer{
		        background-color: #fff;
		        margin-top: 0.2rem;
		        @include wh(100%, 2.36rem);
		        display: flex;
			    .footer_item{
			        flex: 1;
			        display: flex;
			        text-align: center;
			        flex-direction: column;
			        align-items: center;
			        justify-content: center;
			        .icon_style{
			            @include wh(1rem, 1rem);
			            margin-bottom: .21rem;
			        }
			        span{
			            @include sc(.24rem, rgb(37, 37, 37));
			        }
			    }
		    }
		}
	}
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>