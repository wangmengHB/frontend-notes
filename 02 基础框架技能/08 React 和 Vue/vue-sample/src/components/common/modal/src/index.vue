<template>
	<transition name="fade">
		<div v-if='_show' class='modal_wrapper' :style='resetStyle'>
			<!-- <div v-if="showIcon" class="iconfont icon-guanbi close_icon" @click='_show=false'></div> -->
			<slot></slot>
		</div>
	</transition>
</template>
<script >
	import mask from '../../mask';
	export default{
		props:{
			show:{
				type:Boolean,
				default:false,
			},
			// showIcon:{
			// 	type:Boolean,
			// 	default:true,
			// },
			resetStyle:{
				type:Object
			}
		},
		data(){
			return {

			}
		},
		mounted(){
			this._show && mask.show();
		},
		computed:{
			_show:{
				get(){
					return this.show;
				},
				set(val){
					this.$emit('update:show',val)
				}
			}
		},
		watch:{
			_show(val,oldval){
				// this.$emit('update:show',val)
				if(val){
					mask.show()
				}else{
					mask.hide()

				}				
			},
		},
		beforeDestroy(){
			this._show && mask.hide()
		}
	}
</script>
<style lang='scss' scoped>
	.modal_wrapper{
		width: 75%;
		padding:15px;
		box-sizing:border-box;
		width: 280px;
		background:#fff;
		border-radius:8px;
		position:absolute;
		left:50%;
		top:50%;
		transform:translateX(-50%) translateY(-50%);
		overflow-y:auto;
		z-index:999;
		.close_icon{
			position:absolute;
			right:15px;
			top:15px;
			color:#a0a0a0;
			font-size:15px;
			&:hover{
				color:#f00;
			}
		}
		// &::-webkit-scrollbar-track-piece {
		//   background-color: rgba(0, 0, 0, 0);
		//   border-right: 1px solid rgba(0, 0, 0, 0);
		// }
		// &::-webkit-scrollbar {
		//   width: 8px;
		//   height: 13px;
		//   -webkit-border-radius: 5px;
		//   -moz-border-radius: 5px;
		//   border-radius: 5px;
		// }
		// &::-webkit-scrollbar-thumb {
		//   background-color: rgba(0, 0, 0, .5);
		//   background-clip: padding-box;
		//   -webkit-border-radius: 5px;
		//   -moz-border-radius: 5px;
		//   border-radius: 5px;
		//   min-height: 28px;
		// }
		// &::-webkit-scrollbar-thumb:hover {
		//   background-color: rgba(0, 0, 0, 0.7);
		//   -webkit-border-radius: 5px;
		//   -moz-border-radius: 5px;
		//   border-radius: 5px;
		// }
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .3s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
	  opacity: 0
	}
</style>
