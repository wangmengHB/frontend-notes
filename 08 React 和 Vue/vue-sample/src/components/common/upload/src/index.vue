<template>
	<div class='upload_wrapper'>
		<upload-dragger @click.native='upload' @upload="handleFiles"></upload-dragger>
		<input type="file" ref="input" @change="handleChange" :accept="accept" :multiple="multiple" />
		<upload-list :fileList='fileList' @delete="deleteFile" :type="type"></upload-list>
	</div>
</template>
<script >
	import uploadDragger from './upload-dragger.vue';
	import uploadList from './upload-list.vue';
	export default{
		props:{
			accept:String,
			type:{
				type: String,
      			default: 'file'
			},
			limit:{
				type:Number,
				default:3
			},
			multiple:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				fileList:[]
			}
		},
		methods: {
			// 集中处理文件
		    handleFiles(files){
		    	this.fileList.push(...files);
				this.fileList.splice(0,this.fileList.length-this.limit)
		    	this.$emit('change',this.fileList);
		    },
		    upload(){
		    	this.$refs.input.click();
		    },
		    handleChange(e){
		    	this.handleFiles(e.target.files);
		    },
		    deleteFile(index){
		    	this.fileList.splice(index,1)
		    }
	    },
	    components:{
	    	uploadDragger,
	    	uploadList
	    }
	}
</script>
<style lang='scss' scoped>
.upload_wrapper{
	input{
		display:none;
	}
}
	
</style>