<template>
  <div class="account-list-grid">
      <div class="grid-header">
          <div class="title">用户名</div>
          <div class="title">名片名称</div>
          <div class="title">名片ID</div>
          <div class="title">角色</div>
          <div class="title">公司认证</div>
      </div>
      <div class="grid-body">
          <div class="grid-row" v-for="item in tableData" :key="item.userName">
              <div class="grid-cell-user">{{item.userName}}</div>
              <div class="grid-cell-detail" >
                  <div class="mini-row" v-for="info in item.adminAuth" :key="info.productName">
                      <div class="grid-cell">{{info.productName}}</div>
                      <div class="grid-cell">{{info.productId}}</div>
                      <div class="grid-cell">{{info.auth}}</div>
                      <div class="grid-cell">{{info.company}}</div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                tableData: [
                    {
                        "userName": "张黎明",
                        "adminAuth": [
                            {
                            "productName": "思必驰北京",
                            "productId": 96100009,
                            "auth": "管理员",
                            "company": "未认证"
                            },
                            {
                            "productName": "上交大",
                            "productId": 96100024,
                            "auth": "管理员",
                            "company": "未认证"
                            }
                        ]
                    }
                ]
            }
        },
        methods: {
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
               
            }
        }
    }
</script>

<style scoped lang="scss">
.account-list-grid {
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    background-color: white;
    box-shadow:0 1px 5px #ccc;
    position: relative;
    font-size: 14px;

    .grid-header {
        position: absolute;
        top: 0;
        bottom: 50px;
        display: block;
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-bottom: #ccc 2px solid;
        .title {
            display: inline-block;
            width: 19%;
            text-align: center;
        }
    }

    .grid-body {
        position: absolute;
        top: 50px;
        bottom: 0px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;


        .grid-row {
            display: block;
            width: 100%;
            border-bottom: #ccc 1px solid;

            &:hover {
                background-color: #f5f7fa;
                border-top: #ccc 1px solid;
            }

            .grid-cell {
                display: inline-block;
                width: 24%;
                text-align: center;
            }

            .mini-row {
                height: 40px;
                line-height: 40px;
            }

            .grid-cell-user {
                display: inline-block;
                width: 19%;
                height: 40px;
                line-height: 40px;
                text-align: center;
                vertical-align: middle;

            }

            .grid-cell-detail {
                display: inline-block;
                width: 80%;
                vertical-align: middle;
            }
        }
        
    }
}

</style>
