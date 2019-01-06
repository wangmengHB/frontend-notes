<template>
  <div class="account-list-grid">
      <div class="grid-header">
          <div class="title">用户名</div>
          <div class="title">名片名称</div>
          <div class="title">名片ID</div>
          <div class="title">角色</div>
          <div class="title">公司认证</div>
      </div>
      <div class="grid-body" ref="table_body">
          <div class="grid-row" v-for="item in tableData" :key="item.loginName">
              <div class="grid-cell-user">{{item.loginName}}</div>
              <div class="grid-cell-detail" >
                  <div class="mini-row" v-for="info in item.adminAuth" :key="info.productName">
                      <div class="grid-cell">{{info.productName}}</div>
                      <div class="grid-cell">{{info.productId}}</div>
                      <div class="grid-cell">{{info.auth}}</div>
                      <div class="grid-cell">{{info.company}}</div>
                  </div>
              </div>
          </div>
          <div class="loading" ref="loading">
            <p class='tc lh60 light_blue' v-if='hasMore && pageNum > 1'>
                <z-ballSpinFadeLoader></z-ballSpinFadeLoader>
                加载中...
            </p>
            <p class='tc lh34 light_blue' v-else>没有更多数据了</p>
          </div>
      </div>
  </div>
</template>

<script>
    import {getUserList} from '../../../api'
    import {indicator} from '../../../util'
    export default {
        data () {
            return {
                tableData: [],
                pageNum: 0,
                hasMore: true,
            }
        },
        
        mounted () {
            let {tableData, pageNum} = this.$data;
            let me = this;
            if (pageNum == 0) {
                indicator.showBusy()
                getUserList().then(function(data) {
                    me.$data.tableData = data.result;
                });
            }
            let table = this.$refs.table_body;
            table.addEventListener('scroll', () => {
                if (window.requestAnimationFrame) {
                    requestAnimationFrame(() => {
                        this.scroll(table);
                    })
                } else {
                    setTimeout(() => {
                        this.scroll(table);
                    }, 50)
                }
            })

        },
        methods: {
           scroll(table) {
               let {scrollTop, scrollHeight, offsetHeight} = table;
                if (Math.abs(scrollTop + offsetHeight - scrollHeight) < 5) {
                    this.loadMore();
                }
           },
           loadMore() {
                let loadingEl = this.$refs.loading;
                loadingEl.classList.remove('loading');
                let {pageNum, tableData, hasMore} = this.$data;
                let me = this;
				this.$nextTick(()=>{
                    if (!hasMore) {
                        return;
                    }
					getUserList(++pageNum).then(function(data) {
                        if (data.result && data.result.length > 0) {
                            me.$data.tableData = tableData.concat(data.result);
                            me.$data.pageNum++;
                            return;
                        }
                        me.$data.hasMore = false;
                    });
				})
				
			},

        }
    }
</script>

<style scoped lang="scss">
$grid_header_height: 47px;
.account-list-grid {
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    background-color: white;
    box-shadow:0 1px 5px #ccc;
    position: relative;
    font-size: 14px;
    font-family: 'helvetica neue',arial,'hiragino sans gb',stheiti,'wenquanyi micro hei',\5FAE\8F6F\96C5\9ED1,\5B8B\4F53,sans-serif;
    color: rgb(144, 147, 153);
    .grid-header {
        position: absolute;
        top: 0;
        bottom: $grid_header_height;
        display: block;
        width: 100%;
        height: $grid_header_height;
        line-height: $grid_header_height;
        border-bottom: #ccc 1px solid;
        font-weight: 700;
        .title {
            display: inline-block;
            width: 19%;
            text-align: center;
        }
    }

    .grid-body {
        position: absolute;
        top: $grid_header_height;
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

        .loading {
            visibility: hidden;
        }
        
    }
}

</style>
