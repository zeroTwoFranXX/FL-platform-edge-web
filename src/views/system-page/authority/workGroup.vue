<template>
  <div class="workgroup-mg">
    <Row>
      <Col span="8">
      <Input v-model="query" style="width:328px" placeholder="请输入查询内容" />
      </Col>
     <Col :span="16" style="text-align:right">
        <Button type="primary" icon='ios-search'  @click="handleSearch">查询</Button>
        <Button type="default" style="margin-left:10px" @click="query=''">重置</Button>
      </Col>
    </Row>
    <Row style="margin-top:30px">
      <Col span="24" style="text-align: left;">
        <Button code="cscp.user.add" type="primary" icon="md-add" @click="handleCreateOrEditItem">新建</Button>
      </Col>
    </Row>
    <Row style="margin-top: 8px;">
      <Table :columns="columns" :data="data" :loading="isDisabled"></Table>
    </Row>
    <Row style="margin-top: 8px;" type="flex" justify="end">
      <Page v-if="dataTotal > pageSize" :total="dataTotal" :page-size="pageSize" @on-change="handlePageChange"
        show-elevator show-total :current="currentPageIndex"></Page>
    </Row>
  </div>
</template>
<script>
export default {
    name: 'searchable-table',
    data () {
        return {
            query: '',
            isDisabled: false,
            dataTotal: 0,
            currentPageIndex: 1,
            pageSize: 13,
            columns: [
                { key: 'id', title: 'ID', width: 64 },
                { key: 'groupName', title: '名称', width: 320 },
                { key: 'description', title: '描述' },
                {
                    title: '操作',
                    align: 'center',
                    width: 190,
                    key: 'handle',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'T-Button', {
                                    props: {
                                        code: 'cscp.user.edit',
                                        type: 'primary'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleCreateOrEditItem(params.row.id)
                                        }
                                    }
                                },
                                '编辑'
                            ),
                            h('span', { style: {
                                width: '1px',
                                backgroundColor: '#2d8cf0',
                                height: '15px',
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                margin: '-2px 10px 0'
                            } }),
                            h(
                                'Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '确定删除这条数据吗？',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteWorkGroup(params.row._index, params.row.id)
                                        }
                                    }
                                },
                                [
                                    h(
                                        'T-Button', {
                                            style: {
                                                margin: '0 5px'
                                            },
                                            props: {
                                                code: 'cscp.user.del',
                                                type: 'error',
                                                placement: 'top'
                                            }
                                        },
                                        '删除'
                                    )
                                ]
                            )
                        ])
                    }
                }
            ],
            data: []
        }
    },
    methods: {
        init () {
            this.currentPageIndex = 1
            this.getWorkGroupList()
        },
        deleteWorkGroup (index, id) {
            const url = `/api/system/cscpWorkGroups/${id}`
            this.$http.delete(url).then(resposne => {
                this.init()
                this.$Message.success('删除成功！')
            }).catch(error => {
                if (error.response) {
                    this.$Message.error('删除失败！')
                }
            })
        },
        getWorkGroupList () {
            let msg = this.$Message.loading({
                content: '正在更新数据',
                duration: 0
            })
            this.isDisabled = true
            const [url, httpConfig] = [
                '/api/system/cscpWorkGroupsOr',
                {
                    params: {
                        groupName: this.query,
                        description: this.query,
                        page: this.currentPageIndex,
                        size: this.pageSize
                    }
                }
            ]
            this.$http.get(url, httpConfig).then(response => {
                this.data = response.data.data
                this.dataTotal = response.data.recordsTotal
                msg()
                this.isDisabled = false
            }).catch(error => {
                msg()
                this.isDisabled = false
                if (error.response) {
                    this.$Message.error('数据获取失败！')
                }
            })
        },
        handleSearch () {
            this.init()
        },
        handlePageChange (pageNum) {
            this.currentPageIndex = pageNum
            this.getWorkGroupList()
        },
        handleCreateOrEditItem (id) {
            if (id) {
                this.$byStoreSet('workgroup-edit', { id })
                this.$router.push({
                    name: 'workgroup-edit'
                })
            } else {
                this.$router.push({
                    name: 'workgroup-add'
                })
            }
        }
    },
    created () {
        this.init()
    }
}
</script>
