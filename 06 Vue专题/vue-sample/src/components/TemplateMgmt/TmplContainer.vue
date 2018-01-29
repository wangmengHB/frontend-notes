<template>
  <div class="tmpl-container">
      <div class="container">
          <div class="item" v-for="tpl in tpls" :key="tpl.id">
            <img src="./file.png" alt=""/>
            <div class="title">
                {{tpl.templateName}}
            </div>
          </div>
      </div>
      
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
  </div>
</template>


<script>
export default {
    data () {
        return {
            tpls: [
                {
                    "id": 1,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 1,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 1,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, {
                    "id": 1,
                    "templateType": "admin_common",
                    "templateName": "个性化定制.xlsx",
                    "templateUrl": "aispeech-aichat.oss-cn-hangzhou.aliyuncs.com/enterprise-card/common-resource/个性化定制.xlsx",
                    "createBy": null
                }, 
            ]
        }
    }
}
</script>

<style scoped lang="scss">
.tmpl-container {
    // position: relative;
    height: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    box-sizing: content-box;

    .container {
        // position: absolute;
        top: 0;
        bottom: 80%;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .item {
            display: inline-block;
            padding: 10px;
            width: 100px;
            height: 80px;
            margin: 10px;
            font-size: 10px;
            text-align: center;
            img {
                width: 41px;
                height: 49px;
                text-align: center;
                margin: 0 auto;
            }

            &:hover {
                cursor: pointer;
                background-color: #ccc;
            }
        }
    }
    
    .upload-demo {
        // position: absolute;
        top: 80%;
        left: 0;
    }
}
</style>
