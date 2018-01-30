<template>
	<div class="drag_wrapper"
		:class="{
	      'is_dragover': dragover
	    }"
		@drop.prevent="onDrop"
    	@dragover.prevent="onDragover"
    	@dragleave.prevent="dragover = false"
    	>
    	<div class="container">
    		<i class='el-icon-upload upload_icon'></i>
			<p class='upload_tips'>将文件拖到此处，或<span>点击上传</span></p>
    	</div>
    	
	</div>
</template>
<script>
	export default {
		data(){
			return {
				dragover: false,
			}
		},
		methods:{
			onDragover() {
		        this.dragover = true;
		    },
		    onDrop(e) {
		        this.dragover = false;
		        this.$emit('upload',e.dataTransfer.files)
		    },
		   
		   
		}
	}
</script>
<style lang='scss' scoped>
	.drag_wrapper{
		border:1px dashed #d9d9d9;
		background:#fff;
		width: 100%;
		height:180px;
		cursor:pointer;
		text-align:center;
		display:table;
		&.is_dragover{
			background:rgba(32,159,255,.06);
			width:calc(100% - 2px);
			height:178px;
			border:2px dashed #409eff;
		}
		&:hover{
			border-color:#409eff;
		}
		.container{
			display:table-cell;
			vertical-align:middle;
			.upload_icon{
				color:#c0c4cc;
				font-size:67px;
				line-height:50px;
				margin-bottom:16px;
			}
			.upload_tips{
				color:#606266;
				font-size:14px;
				span{
					color:#409eff;
				}
			}
		}
		
	}
</style>