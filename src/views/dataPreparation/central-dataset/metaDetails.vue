<template>
<!-- 元数据详情 -->
  <div class=info>
    <div class="title-box">
      <div class="title">
        元数据详情
      </div>
      <div class="back">
        <Button type="primary" @click="back" style="float:right" >返回</Button>
      </div>
    </div>
    <div class="info-box">
      <Card class="base-info" title="基本信息">
        <Row style="height:60px">
            <Col span="12"><span class="text">数据集ID：</span></Col>
            <Col span="12"><span class="text-info">{{this.info.id}}</span></Col>
        </Row>
        <Row style="height:40px">
          <Col span="12"><span class="text">数据集名字：</span></Col>
          <Col span="12"><span class="text-info">{{this.info.datasetName}}</span></Col>
        </Row>
        <Row  style="height:40px">
          <Col span="12"><span class="text">创建人：</span></Col>
          <Col span="12"><span class="text-info">{{this.info.creatorName}}</span></Col>
        </Row>
        <Row  style="height:40px">
          <Col span="12"><span class="text">联系电话：</span></Col>
          <Col span="12"><span class="text-info">{{this.info.creatorPhone}}</span></Col>
        </Row>
        <!-- <Row  style="height:40px">
          <Col span="12"><span class="text">数据集状态：</span></Col>
          <Col span="12"><span class="text-info">{{this.info.datasetStatus}}</span></Col>
        </Row> -->
        <Row  style="height:40px">
          <Col span="12"><span class="text">数据集公开程度：</span></Col>
          <Col span="12"><span class="text-info">{{this.info.openLevel}}</span></Col>
        </Row>
        <Row  style="height:40px">
          <span class="text">数据集描述：</span>
          <span class="text-info">{{this.info.datasetDesc}}</span>
        </Row>
      </Card>
      <Card class="table-info">
        <Row >
          <Table :columns="columns" :data="tableList" style="margin-top:20px;width:100%"  border></Table>
        </Row>
        <Row style="margin-top: 8px;" type="flex" justify="end">
          <Page :current="currentPageIndex+1"
          :total="dataTotal"
          :page-size="pageSize"
          @on-change="handlePageChange"
          show-elevator
          show-total
          style="padding: 10px;"></Page>
        </Row>
      </Card>
    </div>
  </div>
</template>

<script>
import {GetMetadata} from '@/services/api/data-preparation.js'
import { mapGetters } from 'vuex'
export default {
    data () {
        return {
            // 分页
            dataTotal: 0,
            pageSize: 10,
            currentPageIndex: 0,
            // 表格
            tableList: [],
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    width: 70,
                    render: (h, params) => {
                        return h('span', params.index + (this.currentPageIndex) * this.pageSize + 1)
                    }
                },
                {
                    key: 'itemFieldName',
                    title: '表字段',
                    align: 'center'
                },
                {
                    key: 'itemDesc',
                    title: '中文名称',
                    align: 'center'
                },
                {
                    key: 'dataType',
                    title: '数据类型',
                    align: 'center'
                },
                {
                    key: 'scopeDesc',
                    title: '取值范围',
                    align: 'center'
                },
                {
                    key: 'notes1',
                    title: '备注说明',
                    align: 'center'
                },
                {
                    key: 'createTime',
                    title: '创建时间',
                    align: 'center'
                },
                {
                    key: 'updateTime',
                    title: '更新时间',
                    align: 'center'
                }
            ]
        }
    },
    computed: {
        ...mapGetters('edge', [
            'info'
        ])
    },
    methods: {
        init () {
            this.handleGetList()
        },
        // 搜索
        handleGetList () {
            this.currentPageIndex = 0
            this.getList()
        },
        getList () {
            GetMetadata({
              searchBy:'datasetId',
              searchContent:this.info.id,
              logic:'and',
              page:this.currentPageIndex + 1,
              limit:this.pageSize,
              orderBy:'id',
	            order: 'desc'
            }).then((response) =>{
              // console.log(response)
              this.tableList = response.data.data.list
              this.dataTotal =  response.data.data.totalCount
            })
        },
        back () {
          this.$router.push({
              name: 'subDataset'
          })
        },
        // 翻页
        handlePageChange (pageNum) {
            this.currentPageIndex = pageNum - 1
            this.getList()
        }
    },
    created(){
      this.init()
    }

}

</script>
<style lang="less" scoped>
.info{
  position: relative;
  height: 100%;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  padding-left: 15px;
  background-color: rgba(245, 247, 250, 1);
  .title-box{
    height:58px;
    padding-top: 20px;
  }
  .info-box{
    height: calc(100% - 58px);
  }
}
.title{
  float:left;
  width: 90px;
  height: 18px;
  font-size: 18px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  text-align: left;
  color: #373e48;
  line-height: 18px;
}
.back{
  float:right;
  margin-right:15px
}
.base-info{
    float: left;
    height: 99%;
    width:20%;
  }
  .table-info{
    float: left;
    height:99%;
    width:79%;
    margin-left: 12px;
  }
  .text{
    margin-bottom: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #686e77;
    line-height: 20px;
  }
  .text-info{
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #373e48;
    line-height: 20px;
  }
</style>
