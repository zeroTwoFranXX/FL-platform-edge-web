<template>
<!-- 中央数据集管理 -->
<Card>
  <div>
    <Tabs v-model="whereMap.type" :animated="false" @on-click="getList" style="margin-top:20px">
        <TabPane label="全部数据集" name="1"></TabPane>
        <TabPane label="被授权的数据集" name="2"></TabPane>
        <TabPane label="我创建的数据集" name="3"></TabPane>
    </Tabs>
    <Form inline style="margin-top:10px">
      <Row>
        <Col span="5">
          <FormItem>
            <span style="display: inline-block;width:80px">数据集名称:</span>
            <Input v-model="id" style="width:200px"  placeholder="请输入数据集名称" clearable/>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem>
            <span style="display: inline-block;width:50px;">创建人:</span>
            <Input v-model="name" style="width:200px"  placeholder="请输入创建人" clearable/>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem>
            <span style="display: inline-block;width:80px">数据源类型:</span>
            <Input v-model="creator" style="width:200px" placeholder="请输入创建人" clearable/>
          </FormItem>
        </Col>
      <FormItem>
        <Button type="primary" @click="handleGetList">搜索</Button>
        <Button style="margin-left: 16px;" @click="reset">重置</Button>
      </FormItem>
      </Row>
    </Form>
    <Row >
      <Table :columns="columns" :data="tableList" style="margin-top:20px;width:100%" border></Table>
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
    <!-- 详情弹窗 -->
    <Modal
      v-model="modalDeatils"
      title= '数据集详情'
      width='800px'
      :loading="loading"
      @on-ok="details"
      @on-cancel="cancelDetails"
      :mask-closable="false"
      class-name="vertical-center-modal">
      <Form ref="fmDetails" :model="fmDetails" :label-width="100">
        <Row type="flex" justify="center">
          <Col span="9" >
            <FormItem label="数据集ID：">
              <span>{{this.flag.jobClassName}}</span>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="数据集名称：">
              <Input v-model="fmDetails.name" style="width:250px" placeholder="请输入数据集名称"  clearable />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="9" >
            <FormItem label="创建人：">
              <span>{{this.flag.jobClassName}}</span>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="联系电话：">
              <Input v-model="fmDetails.tel" style="width:250px" placeholder="请输入联系人电话"  clearable />
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="9" >
            <FormItem label="数据源类型：">
              <span>{{this.flag.jobClassName}}</span>
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="公开程度：">
                <Select v-model="fmDetails.public" style="width:250px"  placeholder="请选择公开程度" clearable>
                  <Option value='day'>公开程度A</Option>
                  <Option value='week'>公开程度B</Option>
                  <Option value='month'>公开程度C</Option>
                  <Option value='own'>公开程度D</Option>
                </Select>
              </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span="20">
            <FormItem label="数据集描述：">
              <Input v-model="fmDetails.desc" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入数据集描述"  clearable />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
    <!-- 授权 -->
    <Modal
      v-model="modalEm"
      title= '授权'
      width=900px
      class-name="vertical-center-modal">
      <Form label-position="left" :lebel-width="100">
        <Row style="margin-top:17px">
          <Col span="7">
            <FormItem label="用户ID:">
              <Input v-model="infoId" style="width:170px" placeholder="请输入创建人" clearable/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="用户名:">
              <Input v-model="infoName" style="width:170px"  placeholder="请输入创建人" clearable/>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="授权时间:">
              <DatePicker v-model="startTime" type="date" style="width:130px" placeholder="开始时间"></DatePicker>
              <span>--</span>
              <DatePicker v-model="endTime" type="date" style="width:130px" placeholder="结束时间"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="end">
          <Col>
            <Button @click = "searchEm" type="primary" style="margin-right:10px">搜索</Button>
            <Button @click="resetEm" style="margin-right:15px">重置</Button>
          </Col>
        </Row>
      </Form>
        
        
      
      <Row >
        <Table ref="selection" :columns="columnsE" :data="tableListE" style="margin-top:20px;width:100%" border></Table>
      </Row>
      <Row style="margin-top: 8px;" type="flex" justify="end">
        <Page :current="currentPageIndexE+1"
        :total="dataTotalE"
        :page-size="pageSizeE"
        @on-change="handlePageChangeE"
        show-elevator
        show-total
        style="padding: 10px;"></Page>
      </Row>
      <div slot="footer">
        <Button  type="primary" @click="cancel" >关闭</Button>
      </div>
    </Modal>
 </div>
</Card>
</template>

<script>
export default {
    data () {
        return {
          
            whereMap: {
                type: '1'
            },
            // 筛选条件
            id: '',
            name: '',
            creator: '',
            // 表格
            tableList: [
                {
                    jobClassName: '测试'
                }
            ],
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
                    key: 'jobClassName',
                    title: '编号',
                    align: 'center'
                },
                {
                    key: 'datasetName',
                    title: '数据集名称',
                    align: 'center'
                },
                {
                    key: 'datasetDesc',
                    title: '数据集描述',
                    align: 'center'
                },
                {
                    key: 'providerId',
                    title: '数据集创建人',
                    align: 'center'
                },
                {
                    key: 'jobClassName',
                    title: '创建人联系方式',
                    align: 'center'
                },
                {
                    key: 'dataSourceType',
                    title: '数据源类型',
                    align: 'center'
                },
                {
                    key: 'openLevel',
                    title: '公开程度',
                    align: 'center'
                },
                {
                    key: 'action',
                    title: '操作',
                    width: 270,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                style: {
                                    color:'#ff9900',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.handleDetails(params.row)
                                    }
                                }
                            }, '编辑'),
                            h('a', {
                                style: {
                                    // color:'#00509D',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.handleMeta(params.row)
                                    }
                                }
                            }, '元数据详情'),
                            (this.whereMap.type != '2') && h('a', {
                                style: {
                                    // color:'#00509D',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.handleEm(params.row)
                                    }
                                }
                            }, '授权')
                        ])
                    }
                }
            ],
            // 分页
            dataTotal: 0,
            pageSize: 20,
            currentPageIndex: 0,
            // 弹窗
            // 详情弹窗
            loading: true,
            modalDeatils: false,
            flag: '',
            fmDetails: {
                id: '',
                name: '',
                desc: '',
                creator: '',
                tel: '',
                type: '',
                public: ''
            },
            // 授权
            infoId:'',
            infoName:'',
            modalEm: false,
            startTime: '',
            endTime: '',
            searchInfo: '',
            dataTotalE: 0,
            pageSizeE: 5,
            currentPageIndexE: 0,
            columnsE: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                // {
                //   title:'序号',
                //   align:'center',
                //   render:(h,params) => {
                //     return h('span', params.index + (this.currentPageIndexE) * this.pageSizeE + 1)
                //   }
                // },
                {
                    key: 'jobClassName',
                    title: '用户ID',
                    align: 'center'
                },
                {
                    key: 'jobClassName',
                    title: '用户名',
                    align: 'center'
                },
                {
                    key: 'jobClassName',
                    title: '手机号',
                    align: 'center'
                },
                {
                    key: 'jobClassName',
                    title: '职务',
                    align: 'center'
                },
                {
                    key: 'jobClassName',
                    title: '所属机构',
                    align: 'center'
                },
                {
                    key: 'jobClassName',
                    title: '授权状态',
                    align: 'center'
                },
                {
                    key: 'action',
                    title: '操作',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            // (params.row.triggerState === '未授权') && h('a',{
                            h('a', {
                                on: {
                                    click: () => {
                                        // 授权函数

                                    }
                                }
                            }, '授权'),
                            // (params.row.triggerState === '授权') && h('a',{
                            h('a', {
                                on: {
                                    click: () => {
                                        // 取消授权函数
                                    }
                                }
                            }, '取消授权')
                        ])
                    }
                }
            ],
            tableListE: [
                {
                    jobClassName: '授权'
                }
            ]
        }
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
            console.log('当前tabs标签页', this.whereMap.type)
        },
        // 重置
        reset () {
            console.log('当前tabs标签页', this.whereMap.type)
        },
        // 详情
        handleDetails (e) {
            console.log(e)
            this.flag = e
            this.modalDeatils = true
        },
        // 详情(确认)
        details () {
            console.log('关闭详情弹窗')
            this.modalDeatils = false
        },
        // 详情(取消)
        cancelDetails () {
            this.modalDeatils = false
        },
        // 元数据详情
        handleMeta (e) {
            this.$router.push({
                name: 'metaDetails',
                params: {
                    id: e.id,
                    routeFlag: 'cen'
                }
            })
        },
        // 授权
        handleEm () {
            this.modalEm = true
        },
        empower () {
            console.log('授权')
            ths.modalEm = false
        },
        cancelEm () {
            ths.modalEm = false
        },
        // 关闭弹窗
        cancel () {
            this.modalEm = false
        },
        searchEm () {},
        resetEm () {},
        handlePageChangeE (pageNum) {
            this.currentPageIndex = pageNum - 1
            this.searchEm()
        },
        // 翻页
        handlePageChange (pageNum) {
            this.currentPageIndex = pageNum - 1
            this.getList()
        }
    },
    created () {
        this.init()
    }
}

</script>
<style scoped>
</style>
