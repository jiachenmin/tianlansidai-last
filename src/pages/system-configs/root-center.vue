<template>
 <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>元数据分类树</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createSort=true">
                建分类
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="rootTree" @on-select-change="getAtherData">

            </Tree>
          </div>
        </Card>
      </i-col>
      <i-col span="18" class-name="right-box">
        <Card>
           <div class="title">
            <i-col span="13">
              <h3>{{name}}</h3>
            </i-col>
             <i-col span="8">
              <Input search enter-button="搜索" placeholder="请输入你要搜索的内容..." v-model="keyWord" @on-search="getSearchdata"/>
            </i-col>
            <i-col>
               <Button type="success" @click="addRoot=true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="rootList">
            <template slot-scope="{ row,index }" slot="action">
            <i-switch @on-change="change1(row)" v-model="row.state">
                   <span slot="open">开</span>
                   <span slot="close">关</span>
            </i-switch>
             <Button type="primary" size="small" style="margin-right: 5px" @click="curryClickRow(row)">详情</Button>
            <Poptip
                confirm
                title="您确定删除这条内容吗？"
                @on-ok="doDeleteResource(row)"
                transfer>
                <Button type="error" size="small">删除</Button>
            </Poptip>
            </template>
          </Table>
          <Page :current="pageInfo.page" :pageSize="pageInfo.size" :total="pageInfo.total" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)" show-total/>
        </Card>
      </i-col>
    </Row>
    <Modal
        v-model="createSort"
        title="添加分类"
        @on-ok="doCreateMetadata">
   <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
      </FormItem>
      <FormItem label="编号" prop="mail">
        <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
      </FormItem>
   </Form>
    </Modal>
    <Modal
    v-model="writeSort"
    title="编辑分类"
    @on-ok="sortOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属分类" prop="sort">
            <Cascader :data="sortName" change-on-select v-model="formValidate.sort"></Cascader>
        </FormItem>
        <FormItem label="名称" prop="name">
            <Input v-model="name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="del"
        title="警告"
        @on-ok="deleteRootOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
    <Modal
    v-model="addRoot"
    title="添加元数据"
    @on-ok="addMetaData">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属分类" prop="sort">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
            <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="rootDetails"
    title="权限详情"
    ok-text="编辑"
    @on-ok="writeRoot=true">
        <p><span>名称:</span>{{this.curryClick.name}}</p>
        <p><span>编号:</span>{{this.curryClick.number}}</p>
        <p><span>内容:</span>{{this.curryClick.content}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeRoot"
    title="添加元数据"
    @on-ok="writeOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属分类" prop="sort">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
            <Input v-model="curryClick.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="curryClick.number" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
            <Input v-model="curryClick.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { getMetadataType, metadataList, operatingMetadata, createMetadataType, operatingMetadataType, deleteMetadataType, createMetadata, deleteMetadata } from '@/api/system-configs/root-center.js'
export default {
  created () {
    this.getRootResource()
  },
  data () {
    return {
      rootTree: [],
      name: '',
      keyWord: '',
      curryTypeId: '',
      permissionId: '',
      curryClick: {},
      rootList: [],
      sortName: [],
      createSort: false,
      writeSort: false,
      addRoot: false,
      rootDetails: false,
      writeRoot: false,
      rootId: '',
      del: false,
      formValidate: {
        name: '',
        mail: '',
        desc: '',
        sort: [],
        content: ''
      },
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
      ruleValidate: {
        name: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        mail: [
          { required: true, message: '编号为6-20位字符', trigger: 'blur' },
          { pattern: '^[0-9a-zA-Z]{6,20}$', message: '请输入英文或数字编号' }
        ],
        desc: [
          { required: false, message: 'Please enter a personal introduction', trigger: 'blur' }
        ],
        sort: [
          { required: false, message: '资源名称为必填项', trigger: 'blur'}
        ],
        content: [
          { required: true, message: '内容为必填项', trigger: 'blur'}
        ]
      },
      columns1: [
        {
          title: '#',
          type: 'index'
        },
        {
          title: '状态',
          key: 'status1'
        },
        {
          title: '编号',
          key: 'number'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '备注',
          key: 'memo'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      pageInfo: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    async getRootResource () {
      const result = await getMetadataType()
      const { data } = result.data
      this.sortName = data.map((elm,index) => {
        const params = {
          label: elm.name,
          value: elm._id
        }
        return params
      })
      console.log(this.sortName)
      this.rootTree = data.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          selected: false,
          render: (h, { root, node, data }) => {
            return h('div', {
              style: {
                width: '100%',
                textAlign: 'left'
              }
            }, [
              h('span', {
                style: {
                  padding: '2px 10px'
                }
              }, [ h('span', data.title) ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right'
                  // marginLeft: '30px'
                  // marginRight: '32px'
                }
              }, [
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'md-create',
                    type: 'info'
                  }),
                  style: {
                    marginRight: '8px',
                    width: '20px',
                    height: '20px',
                    fontSize: '12px'
                  },
                  on: {
                    click: () => {
                      this.writeArea = true
                    }
                  }
                }),
                h('Button', {
                  props: Object.assign({}, this.buttonProps, {
                    icon: 'ios-remove',
                    type: 'warning'
                  }),
                  style: {
                    width: '20px',
                    height: '20px',
                    fontSize: '12px'
                  },
                  on: {
                    click: () => { this.del = true }
                  }
                })
              ])
            ])
          }
        }
        if (!index) {
          params.selected = true
          this.getAtherData(null, params)
        }
        return params
      })
    },
    async getAtherData (selArr, selNode) {
      this.curryTypeId = selNode.id
      // console.log(this.curryTypeId)
      this.name = selNode.title
      this.doGetMetaData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    async doGetMetaData (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await metadataList(params)
      const { data } = result.data
      this.rootList = data.list.map((elm,index) => {
        const params = {
          ...elm,
          state: elm.businessStatus !== 3,
          status1: elm.businessStatus === 3 ? '已停用' : elm.businessStatus === 1 ? '新创建' : '已启用'
        }
        return params
      })
      // console.log(this.rootList)
      this.pageInfo.total = data.total
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      // this.switch1 = true
      this.curryClick = row
      this.permissionId = row._id
      // console.log(this.curryClick)
      this.status1 = row.status1
      if (this.status1 === '已停用') {
        await operatingMetadata(this.permissionId, {
          opCode: 2
        })
        this.status1 = '已启用'
      } else if (this.status1 === '已启用') {
        await operatingMetadata(this.permissionId, {
          opCode: 3
        })
        this.status1 = '已停用'
      } else if (this.status1 === '新创建') {
        await operatingMetadata(this.permissionId, {
          opCOde: 2
        })
        this.status1 = '已停用'
      }
      row.status1 = this.status1
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetMetaData({
        page: page,
        count: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetMetaData({
        page: this.pageInfo.page,
        count: size,
        typeId: this.curryTypeId
      })
    },
    async doCreateMetadata () {
      await createMetadataType({
        name: this.formValidate.name,
        number: this.formValidate.mail,
        memo: this.formValidate.desc
      })
      this.getRootResource()
      this.formValidate.name = ''
      this.formValidate.mail = ''
      this.formValidate.desc = ''
    },
    async sortOk (id) {
      id = this.curryTypeId
      // console.log(this.formValidate.sort)
      await operatingMetadataType(id, {
        memo: this.formValidate.desc,
        name: this.name,
        number: this.formValidate.mail,
        parentId: this.formValidate.sort.toString()
      })
      this.getRootResource()
    },
    async deleteRootOne () {
      await deleteMetadataType(this.curryTypeId)
      this.getRootResource()
    },
    async getSearchdata () {
      this.doGetMetaData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    async addMetaData () {
      // this.addRoot = true
      await createMetadata({
        content: this.formValidate.content,
        memo: this.formValidate.desc,
        name: this.formValidate.name,
        number: this.formValidate.mail,
        typeId: this.curryTypeId
      })
      this.getRootResource()
    },
    async doDeleteResource (row) {
      console.log(row)
      await deleteMetadata(row._id)
      this.doGetMetaData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    async curryClickRow (row) {
      this.rootDetails = true
      this.curryClick = row
      console.log(row)
      this.rootId = row._id
      console.log(this.rootId)
    },
    async writeOk () {
      await createMetadata({
        content: this.curryClick.content,
        memo: this.curryClick.memo,
        name: this.curryClick.name,
        number: this.curryClick.number,
        typeId: this.curryTypeId,
        metadataId: this.rootId
      })
      this.getRootResource()
    }
  }
}
</script>
<style lang="less" scoped>
.user-center {
  .title {
    padding-bottom: 15px;
  }
  .left-box,.right-box {
    .ivu-card{
      min-height: 600px;
    }
  }
  .org-list {
    ul li {
      .ivu-tree-title {
        padding: 0 8px;
      }
      line-height: 26px;
      font-size: 14px;
    }
    li ul {
      padding: 0
    }
  }
}
.org-tree {
  display: inline;
}
.del1{
  font-size: 14px;
  font-weight: bold;
  margin-left: 5px;
}
.ivu-modal-body p{
  margin: 15px 100px;
  span{
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
}
}
</style>
