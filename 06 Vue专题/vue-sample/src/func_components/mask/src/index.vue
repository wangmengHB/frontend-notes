<template>
	<transition name="fade">
		<div class='mask_wrapper' v-show='show' :style='`background:rgba(0,0,0,${opacity})`'>
			
		</div>
	</transition>
</template>
<script type="text/javascript">
	export default{
		mounted(){
			this.$nextTick(()=>{
				this.$el.addEventListener('click',()=>{
					this.$emit('hide')
				})
			})
			
		},
		data(){
			return{
				show:false,
				opacity:.4,
			}
		},
		watch:{
			
		}
	}
</script>
<style type="text/css" scoped lang='scss'>
	.mask_wrapper{
		position: absolute;
		left: 0;
		right: 0;
		bottom:0;
		top:0;
		z-index:99;					
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity .3s
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
	  opacity: 0
	}
</style>