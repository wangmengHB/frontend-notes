<template>
	<div style="width:100%; height: 100%; padding: 10px; word-break: break-all; background-color: #f9f5f0; position: absolute; left: 0; right: 0; top: 0; bottom:0;">
		<head-top :goBack="true" :headTitle="headTitle">
		</head-top>
		<div class="jf-content">
			<img src="../../../images/tutorial1.jpg" />
			<img src="../../../images/tutorial2.jpg" />
			<img src="../../../images/tutorial3.jpg" />
			<img src="../../../images/tutorial4.jpg" />
			<img src="../../../images/tutorial5.jpg" />
			<img src="../../../images/tutorial6.jpg" />
			<img src="../../../images/tutorial7.jpg" />
			<img src="../../../images/tutorial8.jpg" />
			<div style="position: relative;">
				<img src="../../../images/tutorial9.jpg" @load="showButton = true"/>
				<button v-if="showButton" @click="showPic = true" class="button"></button>
			</div>
		</div>
    	<transition name="showcover">
    		<div class="back_cover" v-show="showPic" @touchmove.prevent>
				<aside class="return_top" @click="showPic = false" v-if="showPic">
					<svg class="back_top_svg">
						<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#close"></use>
					</svg>
				</aside>
    			<img src="../../../images/union_click.png" class="union_click"/>
    		</div>
    	</transition>
	</div>
</template>

<script>
	import headTop from 'src/components/header/head'
	
	export default{
		data(){
			return {
				headTitle:"转链教程",
				showButton: false,
				showPic: false
			}
		},
		components: {
	    	headTop
	    },
		methods:{

		}
	}
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

     .jf-content{
     	padding-top: 0.88rem;
     	font-size: 0;
     	img{
     		width: 100%;
     	}
     }
     .button{
     	position: absolute;
     	bottom: 1.87rem;
     	left: 0.58rem;
     	border-radius: 0.08rem;
     	@include wh(1.6rem, 0.5rem);
     	z-index: 100;
     	background-color:transparent;
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
	.union_click{
		width: 68%;
		position: absolute;
		@include cl;
		top: 2.68rem;
	}
	.return_top{
		position: fixed;
		top: 1.6rem;
		right: 1.2rem;
		line-height: 0;
		.back_top_svg{
			@include wh(0.6rem, 0.6rem);
		}
	}
</style>