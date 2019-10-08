<template>
	 <div class="loader" :style="containerStyle">
        <div class="line-spin-fade-loader" :style='parentStyle'>
          	<div :style="pos1"></div>
          	<div :style="pos2"></div>
          	<div :style="pos3"></div>
          	<div :style="pos4"></div>
          	<div :style="pos5"></div>
          	<div :style="pos6"></div>
          	<div :style="pos7"></div>
          	<div :style="pos8"></div>
        </div>
      </div>
</template>
<script >
	export default{
		name:'ball-spin-fade-loader',
		props:{
			size:{type:Number,default:30},
			color:{type:String,default:'#fff'}
		},
		data(){
			return {

			}
		},
		computed:{
			commonStyle(){
				return {
					backgroundColor:this.color,
					width:this.size/3+'px',
					height:this.size+'px',
					borderRadius:this.size*2/15 +'px',
					margin: this.size*2/15+'px',
				}
			},
			containerStyle(){
				return {
					width:this.size * 4 +'px',
					height:this.size * 4 + 'px',
					position:'relative',
					margin: '0 auto',
				}
			},
			parentStyle(){
				return {
					marginLeft:this.size*5/3+'px',
					marginTop:this.size*4/3+'px',
				}
			},
			pos1(){
				return {
					top:this.size*4/3+'px',
					left:'0px',
					...this.commonStyle
				}
			},
			pos2(){
				return {
					top:.9 * this.size+'px',
					left:.9 * this.size+'px',
					...this.commonStyle
				}
			},
			pos3(){
				return {
					top:'0px',
					left:this.size*4/3+'px',
					...this.commonStyle
				}
			},
			pos4(){
				return {
					top:-.9*this.size+'px',
					left:.9*this.size+'px',
					...this.commonStyle
				}
			},
			pos5(){
				return {
					top:-4/3*this.size+'px',
					left:'0px',
					...this.commonStyle
				}
			},
			pos6(){
				return {
					top:-.9*this.size+'px',
					left:-.9*this.size+'px',
					...this.commonStyle
				}
			},
			pos7(){
				return {
					top:'0px',
					left:-this.size*4/3 +'px',
					...this.commonStyle

				}
			},
			pos8(){
				return {
					top:.9*this.size+'px',
					left:-.9*this.size+'px',
					...this.commonStyle
				}
			}
		}
	}
</script>
<style scoped>
	
@-webkit-keyframes line-spin-fade-loader {
  50% {
    opacity: 0.3; }

  100% {
    opacity: 1; } }

@keyframes line-spin-fade-loader {
  50% {
    opacity: 0.3; }

  100% {
    opacity: 1; } }

.line-spin-fade-loader {
  position: absolute; }
  .line-spin-fade-loader > div:nth-child(1) {
    -webkit-animation: line-spin-fade-loader 1.2s 0.12s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.12s infinite ease-in-out; }
  .line-spin-fade-loader > div:nth-child(2) {
    -webkit-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
            transform: rotate(-45deg);
    -webkit-animation: line-spin-fade-loader 1.2s 0.24s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.24s infinite ease-in-out; }
  .line-spin-fade-loader > div:nth-child(3) {
    -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
            transform: rotate(90deg);
    -webkit-animation: line-spin-fade-loader 1.2s 0.36s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.36s infinite ease-in-out; }
  .line-spin-fade-loader > div:nth-child(4) {
    -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
            transform: rotate(45deg);
    -webkit-animation: line-spin-fade-loader 1.2s 0.48s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.48s infinite ease-in-out; }
  .line-spin-fade-loader > div:nth-child(5) {
    -webkit-animation: line-spin-fade-loader 1.2s 0.6s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.6s infinite ease-in-out; }
  .line-spin-fade-loader > div:nth-child(6) {
    -webkit-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
            transform: rotate(-45deg);
    -webkit-animation: line-spin-fade-loader 1.2s 0.72s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.72s infinite ease-in-out; }
  .line-spin-fade-loader > div:nth-child(7) {
    -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
            transform: rotate(90deg);
    -webkit-animation: line-spin-fade-loader 1.2s 0.84s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.84s infinite ease-in-out; }
  .line-spin-fade-loader > div:nth-child(8) {
    -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
            transform: rotate(45deg);
    -webkit-animation: line-spin-fade-loader 1.2s 0.96s infinite ease-in-out;
            animation: line-spin-fade-loader 1.2s 0.96s infinite ease-in-out; }
  .line-spin-fade-loader > div {
	    /*background-color: #fff;*/
	    /*border-radius: 2px;*/
		/*margin: 2px;*/
	    -webkit-animation-fill-mode: both;
	            animation-fill-mode: both;
	    position: absolute;
	    /*width: 5px;
	    height: 15px*/; 
	}

</style>