<template>
  <div class="configure">
    <div class="title-box">
      <div class="title">
        元数据配置
      </div>
      <div class="back">
        <Button type="primary" @click="back" style="float:right">返回</Button>
        <!-- <Icon type="md-arrow-back" @click="back" size="28" color="#878d96" style="float:right" /> -->
      </div>
    </div>
    <div class="info-box">
      <div class="base-info">
        <Card class="bace" title="基本信息">
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
          <Col span="12"><span class="text-info">{{info.datasetStatus}}</span></Col>
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
        <!-- <Card class="attribute" title="属性信息">
          <Row style="height:40px">
            <Col span="10"><span class="text">表名：</span></Col>
            <Col span="14"><span class="text-info">banbenbanbenben：</span></Col>
          </Row>
          <Row style="height:40px">
            <Col span="10"><span class="text">表描述：</span></Col>
            <Col span="14"><span class="text-info">banbenbanbenben：</span></Col>
          </Row>
          <Row style="height:40px">
            <Col span="10"><span class="text">表类型：</span></Col>
            <Col span="14"><span class="text-info">banbenbanbenben：</span></Col>
          </Row>
        </Card> -->
      </div>
      <div class="table-info">
        <Card class="table">
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
  </div>
</template>
<script>
import {GetMetadata,UpdateNote} from '@/services/api/data-preparation.js'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      // info:this.$route.params.details,
      updateInfo:'', //修改后的备注信息
      updateId:'',  //修改备注行数据的id
      editFlag:'',
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
              align: 'center',
              render:(h,params)=>{
              if(params.row.$isEdit){
                return h('Input',{
                props:{
                  value:params.row.notes1,
                },
                on:{
                  'on-blur':(event)=>{
                      this.$set(params.row, '$isEdit', false);
                      this.updateInfo=event.target.value
                      this.tableList[params.index].notes1=event.target.value
                      this.updateId=this.tableList[params.index].id
                      this.update()
                  }
                }
              },)
              }else {
                return h('div', {
                        on: {
                        }
                      },params.row.notes1);
              }
            }
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
          },
          {
            key:'action',
            title:'操作',
            align:'center',
            render:(h,params) => {
              return h ('div',[
                // ifCanModify字段；如果为true就是可以修改，如果为false就不能修改
                (this.info.ifCanModify === true) && h('a',{
                  on: {
                        click: () => {
                            this.$set(params.row, '$isEdit', true);
                            }
                        }
                },'修改备注'),
                (this.info.ifCanModify === false) && h('a',{
                  style:{
                    color:'#CCCCCC'
                  },
                },'修改备注'),
              ])
            }
          },
      ]

    }
  },
  computed: {
        ...mapGetters('edge', [
            'info'
        ])
    },
  watch:{
    info(){
      this.init()
    }
  },
  methods: {
    init(){
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
          this.tableList = response.data.data.list
          this.dataTotal =  response.data.data.totalCount
        }).catch(()=>{
          this.$Message.error('Fail')
        })
    },
    update(){
      UpdateNote({
        id:this.updateId,
        notes1:this.updateInfo
      }).then((response) =>{
        this.$Message.success(response.data.msg)
      }).catch(()=>{
        this.$Message.error('Fail')
      })
    },
    // 翻页
    handlePageChange (pageNum) {
        this.currentPageIndex = pageNum - 1
        this.getList()
    },
    back(){
      this.$router.push({
          name: 'subDataset'
      })
    }
  },
  created(){
    this.init()
  }
}

</script>
<style lang="less" scoped>
.configure{
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
  height: 100%;
  width:20%;
  // border:1px solid red;
  .bace{
    height:99%;
    width:100%;
    // border:1px solid yellow
  }
  .attribute{
    height: 43%;
    width:100%;
    margin-top:10px;
  }
}
.table-info{
  float: left;
  height:100%;
  width:79%;
  margin-left: 12px;
  // border:1px solid green;
  .table{
    height: 99%;
    width:100%
  }
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
