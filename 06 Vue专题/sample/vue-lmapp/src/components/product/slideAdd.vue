<template>
        <div class="wc"
             @touchstart="_touchStart"
             @touchmove="_touchMove"
             @touchend="_touchEnd"
             :style="txtStyle">
            <slot></slot>
        </div>
</template>

<script>
	export default {
        data() {
            return {
                startX: 0,       //触摸位置
                moveX: 0,       //滑动时的位置
                disX: 0,       //移动距离
            	txtStyle:'',
            	txtStyles:'',
            	delWidth:120,//最大滑动距离
            	currentTrans:0,
            	change:false,  //位置是否在移动过程中变化，防止无效运动引起的bug
            }
        },
        methods: {
             _touchStart: function(ev,index) {
                ev = ev || event;
                if(ev.touches.length == 1){
                    // 手指按下的时候记录按下的位置
                    this.startX = ev.touches[0].clientX;
                   // console.log(this.startX)
                }
            },
            _touchMove: function(ev) {
                ev = ev || event;
                if(ev.touches.length == 1) {
                    // 滑动过程中的实时位置
                    this.moveX = ev.touches[0].clientX;
                   // console.log(this.moveX);
                    // 滑动过程中实时计算滑动距离
                    this.disX = this.startX - this.moveX;
                    // console.log('disX==>',this.disX)
                    // 如果是向右滑动或者只是点击，不改变滑动位置
                    if(this.disX < 0 || this.disX == 0) {
                    	console.log(this.currentTrans+"::::"+-this.delWidth);
                    	if(this.currentTrans<0){
                          this.txtStyle = "transform:translateX(-" + (this.delWidth+this.disX)/100 + "rem)";
                          this.txtStyles = "translateX(-" + (this.delWidth+this.disX)/100 + "rem)";
                          console.log('a');
                          this.change=true;
                    	}
                    }else if (this.disX > 0) {
                    	console.log('b');
                        //如果是向左滑动，则实时给这个根元素一个向左的偏移-left，当偏移量到达固定值delWidth时，固定元素的偏移量为 delWidth     
                        if ((this.disX/100) >= this.delWidth/100) {
                            //this.txtStyle = "transform:translateX(-" + this.delWidth/100 + "rem)";
                            //this.zIndex = "z-index:" + 10 + "rem";
                        }else{
                        	this.txtStyle = "transform:translateX(-" + this.disX/100 + "rem)";
                        	this.txtStyles = "translateX(-" + this.disX/100 + "rem)";
                        	this.change=true;
                        }
                    }
                }
            },
            _touchEnd: function(ev) {
            	console.log(this.disX);
                if (event.changedTouches.length == 1  && this.change) {
                   if(this.disX>this.delWidth/2){
                   	  this.txtStyle = "transform:translateX(-" + this.delWidth/100 + "rem)";
                      this.currentTrans=-this.delWidth;
                      console.log('e:   '+'a');
                   }else if(0<this.disX && this.disX<=this.delWidth/2){
                   	  this.txtStyle = "transform:translateX(0rem)"; 
                   	   console.log('e:   '+'b');
                   	  this.currentTrans=0;
                   }else if(0>this.disX && this.disX>=-this.delWidth/2 && this.currentTrans!=0){
                   	  this.txtStyle = "transform:translateX(-" + this.delWidth/100 + "rem)"; 
                      this.currentTrans=-this.delWidth;
                       console.log('e:   '+'c');
                   }else{
                   	  this.txtStyle = "transform:translateX(0rem)"; 
                   	  this.currentTrans=0;
                   	   console.log('e:   '+'d');
                   }
                }
            }, 
        }
    }
</script>

<style>
</style>