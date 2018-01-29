<template>
    <el-table class="ecard-list"
      :data="tableData"
      height="100%"
      style="width: 100%">
      <el-table-column
        prop="productName"
        label="名片名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="productId"
        label="名片ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司认证">
      </el-table-column>
      <el-table-column
        prop="adminName"
        label="管理员"
        width="180">
        <template slot-scope="scope">
            <div v-for="person in scope.row.adminName" :key="person">
                {{person}}
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="appName"
        label="授权公众号"
        width="180">
        <template slot-scope="scope">
            <div v-for="app in scope.row.appName" :key="app">
                {{app}}
            </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="enabled"
        label="使能"
        width="100">       
        <template slot-scope="scope">
            <el-switch 
            active-color="#13ce66" 
            inactive-color="#C0CCDA" 
            v-model="scope.row.enabled">
            </el-switch>
        </template>
    
      </el-table-column>
    </el-table>
</template>


<script>
    export default {
        data () {
            return {
                tableData: [
                    {
                       "productName": "string",
                        "productId": 6,
                        "company": "未认证",
                        "adminName": ['xxx', 'yyy'],
                        "appName": ['weixin1', 'weixin2'],
                        "enabled": 0
                    }, {
                       "productName": "string",
                        "productId": 6,
                        "company": "未认证",
                        "adminName": ['xxx', 'yyy'],
                        "appName": ['weixin1', 'weixin2'],
                        "enabled": 0
                    }, 
                ]
            }
        }
    }

</script>

<style scoped lang="scss">
.ecard-list {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    text-align: center;
    thead th .cell {
        text-align: center;
    }
}

</style>
