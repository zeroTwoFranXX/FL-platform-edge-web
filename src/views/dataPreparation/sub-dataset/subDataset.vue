<template>
    <!-- 子数据集管理 -->
    <Card>
        <div>
            <Row style="margin-top:20px" >
                <Form ref="search" :model="search" :label-width="100">
                    <!-- <Col span="4">
                      <FormItem prop="infoNode">
                        <span style="display: inline-block;width:70px">选择节点:</span>
                        <Select v-model="search.infoNode" style="width:170px" placeholder="请选择节点">
                          <Option value="1">节点1</Option>
                          <Option value="2">节点2</Option>
                          <Option value="3">节点3</Option>
                        </Select>
                      </FormItem>
                    </Col> -->
                    <Col span="6">
                        <FormItem prop="datasetName" label="数据集名称:">
                            <Input v-model="search.datasetName" placeholder="请输入创建人" clearable/>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem prop="creatorName" label="创建人:">
                            <Input v-model="search.creatorName"  placeholder="请输入创建人" clearable/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem>
                            <Button style="margin-left: 50px;" @click="reset">重置</Button>
                            <Button type="primary" style="margin-left: 15px;" @click="handleGetList">搜索</Button>
                            <Button type="primary" style="margin-left: 15px;" @click="OpenMlNew">创建</Button>
                            <!-- <Button type="primary" style="margin-left: 15px;" @click="toCenter">中央数据集管理 <Icon type="ios-arrow-forward"></Icon></Button> -->
                        </FormItem>
                    </Col>
                </Form>
            </Row>
            <Row >
                <Table :columns="columns" :data="dataList" style="width:100%" border></Table>
            </Row>
            <Row style="margin-top: 8px;" type="flex" justify="end">
                <Page :current="currentPageIndex + 1"
                      :total="dataTotal"
                      :page-size="pageSize"
                      @on-change="handlePageChange"
                      show-elevator
                      show-total
                      style="padding: 10px;"></Page>
            </Row>
            <!-- 数据集创建弹窗 -->
            <Modal
                v-model="mlNew"
                title= '数据集创建'
                :loading="loading"
                :mask-closable="false"
                @on-ok="okNew"
                @on-cancel="cancelNew"
                class-name="vertical-center-modal">
                <Form ref="fmNew" :model="fmNew" :rules="ruleFmNew" :label-width="100">
                    <FormItem label="数据集名称:" prop="name">
                        <Input v-model="fmNew.name" style="width:250px" placeholder="请输入数据集名称"  clearable />
                    </FormItem>
                    <FormItem label="公开程度:" prop="openness">
                        <Select v-model="fmNew.openness" style="width:250px" placeholder="请选择公开程度" clearable>
                            <Option  :value=1>公开</Option>
                            <Option :value=0>不公开</Option>
                            <!-- <Option value='仅自己可见'>仅自己可见</Option> -->
                        </Select>
                    </FormItem>
                    <FormItem label="数据集描述:" prop="desc">
                        <Input v-model="fmNew.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入数据集描述"></Input>
                    </FormItem>
                </Form>
            </Modal>
            <!-- 页面跳转弹窗 -->
            <!-- <Modal
              v-model="mlToCenter"
              class-name="vertical-center-modal">
              <div>
                <p slot="header" style="text-indent:10px;font-size:20px;margin:10px 0">
                  <Icon type="ios-alert" size="26" color="#FF9900" style="margin:0 5px"></Icon>
                  <span style="font-weight: 500;">跳转中央数据集管理页面</span>
                </p>
              </div>
              <div style="padding-left:30px;padding-top:10px;padding-bottom:10px">
                <span style="text-indent:4em;text-align:left">中央数据集管理只对元数据进行查看与授权，不能对元数据进行修改操作。</span>
              </div>
              <div slot="footer">
                <Button type="text" @click="toCenterCancel" style="margin-right:5px">取消</Button>
                <Button  type="primary" @click="toCenterOk" >确认</Button>
              </div>
            </Modal> -->
            <!-- 详情/编辑弹窗 -->
            <Modal
                v-model="mlDeatils"
                width='850px'
                :loading="loading"
                :mask-closable="false"
                class-name="vertical-center-modal">
                <div slot="header" >
                    <div v-if="this.paramsDetails.ifCanModify === false" slot="header" style="font-size:18px" >数据集详情</div>
                    <div v-if="this.paramsDetails.ifCanModify === true" slot="header" style="font-size:18px" >数据集编辑</div>
                </div>
                <Form ref="fmDetails" :model="fmDetails" :rules="ruleFmDetails" :label-width="100">
                    <Row type="flex" justify="center">
                        <Col span="11" >
                            <FormItem label="数据集ID:" prop="id">
                                <span>{{this.paramsDetails.id}}</span>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem label="数据集状态:" prop="datasetStatus">
                                <span>{{this.paramsDetails.datasetStatus}}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col span="11" >
                            <FormItem label="创建人:" prop="creater">
                                <span>{{this.paramsDetails.creatorName}}</span>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem label="联系电话:" prop="tel">
                                <span>{{this.paramsDetails.creatorPhone}}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col span="11" >
                            <FormItem v-if="this.paramsDetails.ifCanModify === true" label="数据集名称:" prop="name">
                                <Input v-model="fmDetails.name" placeholder="请输入数据集名称"  clearable />
                            </FormItem>
                            <FormItem v-if="this.paramsDetails.ifCanModify === false" label="数据集名称:">
                                <span >{{this.paramsDetails.datasetName}}</span>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem  v-if="this.paramsDetails.ifCanModify === true" label="公开程度:" prop="publicType">
                                <Select v-model="fmDetails.publicType"   placeholder="请选择公开程度" clearable>
                                    <Option :value=1>公开</Option>
                                    <Option :value=0>不公开</Option>
                                </Select>
                            </FormItem>
                            <FormItem v-if="this.paramsDetails.ifCanModify === false" label="公开程度:">
                                <span>{{this.paramsDetails.openLevel}}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col span="21">
                            <FormItem label="数据集描述:" prop="desc">
                                <span v-if="this.paramsDetails.ifCanModify === false">{{this.paramsDetails.datasetDesc}}</span>
                                <Input v-if="this.paramsDetails.ifCanModify === true" v-model="fmDetails.desc" type="textarea" :autosize="{minRows: 3,maxRows: 6}" placeholder="请输入数据集描述"  clearable />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div v-if="this.paramsDetails.ifCanModify === true" slot="footer">
                    <Button type="text" @click="cancelDetails" style="margin-right:5px">取消</Button>
                    <Button  type="primary" @click="okEdit" >确认</Button>
                </div>
                <div v-if="this.paramsDetails.ifCanModify === false" slot="footer">
                    <Button  type="primary" @click="cancelDetails" >关闭</Button>
                </div>
            </Modal>
            <!-- 中央数据注册弹窗 -->
            <Modal
                v-model="mlCenter"
                class-name="vertical-center-modal">
                <div>
                    <p slot="header" style="text-indent:10px;font-size:20px;margin:10px 0">
                        <Icon type="ios-alert" size="26" color="#FF9900" style="margin:0 5px"></Icon>
                        <span style="font-weight: 500;">中央数据注册</span>
                    </p>
                </div>
                <div style="padding-left:30px;padding-top:10px;padding-bottom:10px">
                    <span style="text-indent:4em;text-align:left">数据集描述信息以及元数据信息将上传至中央节点。仍需您授权给他人使用。您确定要注册吗？</span>
                </div>
                <div slot="footer">
                    <Button type="text" @click="cancelCenter" style="margin-right:5px">取消</Button>
                    <Button  type="primary" @click="registerCen" >确认</Button>
                </div>
            </Modal>
            <!-- 删除弹窗 -->
            <Modal
                v-model="mlDel"
                class-name="vertical-center-modal">
                <div>
                    <p slot="header" style="text-indent:10px;font-size:20px;margin:10px 0">
                        <Icon type="ios-alert" size="26" color="#FF9900" style="margin:0 5px"></Icon>
                        <span style="font-weight: 500;">删除</span>
                    </p>
                </div>
                <div style="padding-left:30px;padding-top:10px;padding-bottom:10px">
                    <span style="text-indent:4em;text-align:left">删除之后数据不能恢复，确定删除吗？</span>
                </div>
                <div slot="footer">
                    <Button type="text" @click="cancelDel" style="margin-right:5px">取消</Button>
                    <Button  type="primary" @click="delDataset" >确认</Button>
                </div>
            </Modal>
            <!-- 导入CSV弹窗 -->
            <Modal
                v-model="mlImport"
                title="导入CSV文件"
                class-name="vertical-center-modal"
                @on-ok="uploadFile"
                @on-cancel="cancelSubmit">
                <div style="width: 500px">
                    <Upload
                        ref="upload"
                        type="drag"
                        :before-upload="handleUpload"
                        action="">
                        <Button icon="ios-cloud-upload-outline" style="margin: 5px">上传文件</Button>
                        <div>{{ fileName }}</div>
                        <p>支持拖拽到此处上传</p>
                    </Upload>
                </div>
            </Modal>
        </div>
    </Card>
</template>

<script>

import { CreateOrEditDataset, UploadFile,RegisterCenData,GetList,DelDataset} from '@/services/api/data-preparation.js'
import { handleRequestParams } from '@/common/helpers/params'
import { mapGetters, mapActions } from 'vuex'
export default {
    data () {
        return {
            searchBy:'',
            searchContent:'',
            search:{
                id:'',
                datasetName:'',
                creatorName:'',
                infoNode:'',
            },
            infoNode:'',
            // 分页
            dataTotal: 0,
            pageSize: 10,
            currentPageIndex: 0,
            // 表格
            tableList:[],
            dataList: [],
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
                    key: 'datasetName',
                    title: '数据集名称',
                    align: 'center'
                },
                // {
                //     key: 'datasetDesc',
                //     title: '数据集描述',
                //     align: 'center'
                // },
                {
                    key: 'creatorName',
                    title: '数据集创建人',
                    align: 'center'
                },
                {
                    key: 'creatorPhone',
                    title: '创建人联系方式',
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
                    width: 370,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            // ifCanModify字段；如果为true就是可以修改，如果为false就不能修改
                            (params.row.ifCanModify === false) && h('a', {
                                style: {
                                    // color:'#00509D',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.toMetaDtl(params.row)
                                    }
                                }
                            }, '元数据详情'),
                            h('a', {
                                style: {
                                    // color:'#00509D',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.toMetaConfig(params.row)
                                    }
                                }
                            }, '元数据配置'),
                            (params.row.ifCanModify === true) && h('a', {
                                style: {
                                    // color:'#00509D',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.openMlCenter(params.row)
                                    }
                                }
                            }, '中央数据注册'),
                            (params.row.ifCanModify === true) && h('a', {
                                style: {
                                    // color:'#00509D',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.openMlImport(params.row)
                                    }
                                }
                            }, '导入CSV'),
                            (params.row.ifCanModify === true)&&h('a', {
                                style: {
                                    color:'#ff9900',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.openMlDetails(params.row)
                                    }
                                }
                            }, '编辑'),
                            (params.row.ifCanModify === false )&&h('a', {
                                style: {
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.openMlDetails(params.row)
                                    }
                                }
                            }, '详情'),
                            (params.row.ifCanModify === true) && h('a', {
                                style: {
                                    color: 'red',
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.openMlDel(params.row)
                                    }
                                }
                            }, '删除')
                        ])
                    }
                }
            ],
            // 数据集创建弹窗
            mlNew:false,
            fmNew:{
                id:'',
                name:'',
                desc:'',
                openness:'',
            },
            ruleFmNew:{
                name: [
                    { required: true, message: '请输入数据集名称', trigger: 'blur' }
                ],
                openness: [
                    {required: true, type:'number',message: '请选择公开程度'}
                ],
            },
            // 页面跳转弹窗
            // mlToCenter:false,
            // 详情弹窗
            paramsDetails: '',
            mlDeatils: false,
            loading: true,
            fmDetails: {
                id: '',
                name: '',
                datasetStatus:'',
                creater: '',
                tel: '',
                dataType: '',
                publicType: '',
                desc: ''
            },
            ruleFmDetails:{
                name: [
                    { required: true, message: '请输入数据集名称', trigger: 'blur' }
                ],
                publicType: [
                    {required: true, type:'number',message: '请选择公开程度'}
                ],
            },
            // 中央数据注册弹窗
            paramsId:'',
            mlCenter: false,
            // 删除弹窗
            mlDel: false,
            // 导入CSV弹窗
            mlImport:false,
            fileName:'',
            file:'',
        }
    },
    methods: {
        init () {
            this.handleGetList()
        },
        handleGetList () {
            this.searchBy = handleRequestParams(this.search).searchBy
            this.searchContent = handleRequestParams(this.search).searchContent
            this.currentPageIndex = 0
            this.getList()
        },
        getList () {
            this.tableList=[]
            GetList({
                searchBy: this.searchBy,
                searchContent: this.searchContent,
                // nodeId:'1',
                logic: 'and',
                page:this.currentPageIndex + 1,
                limit:this.pageSize,
                orderBy:'',
                order:''
            }).then((response) => {
                response.data.data.list.forEach(d => {
                    // 公开程度（0:不公开/1:公开）
                    if(d.openLevel == 0){
                        d.openLevel = "不公开"
                    }else if(d.openLevel == 1){
                        d.openLevel = "公开"
                    }
                    this.tableList.push(d)
                });
                this.dataList = this.tableList
                // this.dataList = response.data.data.list
                this.dataTotal = response.data.data.totalCount
            }).catch(error => {
                if (error.response) {
                    this.$Message.error(error.response.data.message)
                }
            })
        },
        // 新建
        OpenMlNew () {
            this.$refs.fmNew.resetFields();
            this.mlNew = true
        },
        okNew(){
            this.$refs.fmNew.validate((valid) => {
                if (valid) {
                    this.mlNew=false
                    this.createDataset()
                } else {
                    this.$Message.error('Fail!');
                    this.loading = false;
                    setTimeout(() => {
                        this.$nextTick(() => {
                            this.loading = true;
                        });
                    }, 100);
                }
            })
        },
        cancelNew(){
            this.mlNew=false
        },
        createDataset () {
            CreateOrEditDataset({
                id:'',
                datasetName:this.fmNew.name,//数据集名称
                datasetDesc:this.fmNew.desc,//数据集描述
                openLevel:this.fmNew.openness,//公开程度 0:不公开  1:公开
                // nodeId:'1',//节点标识
            }).then((response) => {
                this.$Message.success(response.data.msg)
                this.handleGetList()
            }).catch(error => {
                if (error.response) {
                    this.$Message.error(error.response.data.message)
                }
            })
        },
        // 重置
        reset () {
            this.search.id = ''
            this.search.datasetName = ''
            this.search.creatorName = ''
            this.handleGetList()
        },
        // 页面跳转
        // toCenter () {
        //   this.mlToCenter = true
        // },
        // toCenterOk(){
        //   this.mlToCenter = false
        //   this.$router.push({
        //         name: 'centralDataset'
        //     })
        // },
        // toCenterCancel(){
        //   this.mlToCenter = false
        // },
        // 翻页
        handlePageChange (pageNum) {
            this.currentPageIndex = pageNum - 1
            this.getList()
        },
        // 详情弹窗
        openMlDetails(e){
            this.fmDetails.name = e.datasetName
            this.fmDetails.desc = e.datasetDesc
            // 公开程度
            if(e.openLevel=='不公开'){
                this.fmDetails.publicType = 0
            }else if(e.openLevel == '公开'){
                this.fmDetails.publicType = 1
            }
            // 数据集状态
            if(e.datasetStatus == '未同步'){
                this.fmDetails.datasetStatus = 0
            }else if(e.datasetStatus == '已同步'){
                this.fmDetails.datasetStatus = 1
            }
            this.mlDeatils = true
            this.paramsDetails = e
        },
        okEdit () {
            // 详情编辑提交
            // this.mlDeatils = false
            this.$refs.fmDetails.validate((valid) =>{
                if(valid){
                    this.mlDeatils = false
                    this.editDataset()
                } else {
                    this.$Message.error('Fail!');
                    this.loading = false;
                    setTimeout(() => {
                        this.$nextTick(() => {
                            this.loading = true;
                        });
                    }, 100);
                }
            })
        },
        editDataset(){
            CreateOrEditDataset({
                id:this.paramsDetails.id,
                datasetName:this.fmDetails.name,
                openLevel:this.fmDetails.publicType,
                datasetDesc:this.fmDetails.desc,
            }).then((response) => {
                this.$Message.success(response.data.msg)
                this.getList()
            }).catch(error => {
                if (error.response) {
                    this.$Message.error(error.response.data.message)
                }
            })
        },
        cancelDetails () {
            this.mlDeatils = false
            // 详情取消
        },
        // 中央数据注册弹窗
        openMlCenter (e) {
            this.paramsId = e.id
            this.mlCenter = true
        },
        registerCen () {
            console.log(this.paramsId)
            RegisterCenData(this.paramsId).then((response) => {
                console.log(response)
                if(response.data.code === 200){
                    this.mlCenter = false
                    this.$Message.success(response.data.msg)
                    this.handleGetList()
                }else{
                    this.mlCenter = false
                    this.$Message.error(response.data.msg)
                    this.handleGetList()
                }
            }).catch(error => {
                if (error.response) {
                    this.mlCenter = false
                    this.$Message.error(error.response.data.message)
                }
            })
        },
        cancelCenter () {
            this.mlCenter = false
        },
        center () {
            this.mlCenter = false
        },
        // 删除弹窗
        openMlDel(e){
            this.paramsId = e.id
            this.mlDel = true
        },
        delDataset(){
            DelDataset(this.paramsId).then((response) => {
                this.mlDel = false
                this.$Message.success(response.data.msg)
                this.handleGetList()
            }).catch(error => {
                if (error.response) {
                    this.mlCenter = false
                    this.$Message.error(error.response.data.message)
                }
            })
        },
        cancelDel () {
            this.mlDel = false
        },
        // 元数据配置页面跳转
        toMetaConfig (e) {
            this.$store.commit('edge/setInfo', e)
            this.$router.push({
                name: 'metaConfig',
            })
        },
        // 元数据详情页面跳转
        toMetaDtl (e) {
            this.$store.commit('edge/setInfo', e)
            this.$router.push({
                name: 'metaDetails',
            })
        },
        // 导入CSV文件
        openMlImport(e){
            this.paramsId = e.id
            this.mlImport = true
        },
        //上传文件
        uploadFile () {
            let formData = new FormData()
            // formData.append('nodeId', '1') //节点标识
            formData.append('datasetId', this.paramsId) //数据集标识
            formData.append('csvFile', this.file) //csv文件
            UploadFile(formData).then((response) =>{
                this.$Message.success(response.data.msg)
            }).catch(error => {
                if (error.response) {
                    this.$Message.error(error.response.data.message)
                }
            })
        },
        handleUpload(file) {
            this.fileName = file.name;
            this.file = file;
            return false;
        },
        cancelSubmit() {
            this.fileName = "";
        },
    },
    created(){
        this.init()
    }
}

</script>
<style scoped>
</style>
