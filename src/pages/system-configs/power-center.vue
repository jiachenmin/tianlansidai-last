<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>角色树</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="modal1=true">
                建角色
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="roleTree" @on-select-change="getAtherData">

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
               <Button type="success" @click="addPower">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="rolesList">
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
        v-model="modal1"
        title="添加角色"
        @on-ok="doCreateRole">
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
    v-model="modal2"
    title="编辑区域"
    @on-ok="redact">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
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
        @on-ok="deleteRoleOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
     <Modal
        v-model="addPower1"
        title="添加权限"
        @on-ok="addSuccess">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
         <FormItem label="选择资源" prop="resource">
           <Cascader :data="resourceNameData" v-model="formValidate.resource" change-on-select :load-data="loadData"></Cascader>
        </FormItem>
        <FormItem label="设置权限" prop="setPower">
           <Select placeholder="请选择" v-model="formValidate.setPower">
                <Option value="不可见">不可见</Option>
                <Option value="仅可见">仅可见</Option>
                <Option value="可操作">可操作</Option>
            </Select>
        </FormItem>
         <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
     <Modal
    v-model="powerDetails"
    title="权限详情"
    ok-text="编辑"
    @on-ok="makePower">
        <p><span>资源名称:</span>{{this.powerName}}</p>
        <p><span>权限:</span>{{this.curryClick.permission}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
     <Modal
        v-model="writePower"
        title="编辑权限"
        @on-ok="modifyPower">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
         <FormItem label="选择资源" prop="resource">
           <Cascader :data="resourceData" v-model="value1" change-on-select :load-data="loadData"></Cascader>
        </FormItem>
        <FormItem label="设置权限" prop="setPower">
           <Select placeholder="请选择" v-model="curryClick.permission">
                <Option value="不可见">不可见</Option>
                <Option value="仅可见">仅可见</Option>
                <Option value="可操作">可操作</Option>
            </Select>
        </FormItem>
         <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { getRole, createRole, getPermissionList, deleteRole, modifyRole, modifyPermission, deletePermission, createPermission } from '@/api/system-configs/power-center.js'
import { getDataCenter, getResourceList } from '@/api/system-configs/data-center.js'
export default {
  created () {
    this.doGetRole()
    console.log(this.test(this.aaaa))
  },
  data () {
    return {
      roleTree: [],
      rolesList: [],
      resourceNameData: [],
      resourceData: [],
      curryClick: {},
      modal1: false,
      modal2: false,
      writePower: false,
      powerName: '',
      powerValue: '',
      del: false,
      addPower1: false,
      curryTypeId: '',
      resourceName: '',
      resourceValue: '',
      switch1: false,
      value1: [],
      name: '',
      keyWord: '',
      status: '',
      powerDetails: false,
      permissionId: '',
      resourceId: [],
      permissionId1: '',
      childNodeName: [],
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
      formValidate: {
        name: '',
        mail: '',
        desc: '',
        resource: [],
        setPower: ''
      },
      pageInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      ruleValidate: {
        name: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        mail: [
          { required: false, message: '编号为6-20位字符', trigger: 'blur' },
          { pattern: '^[0-9a-zA-Z]{6,20}$', message: '请输入英文或数字编号' }
        ],
        desc: [
          { required: false, message: 'Please enter a personal introduction', trigger: 'blur' }
        ],
        resource: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        setPower: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ]
      },
      columns1: [
        {
          title: '#',
          type: 'index'
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '资源类型',
          key: 'name'
        },
        {
          title: '资源编号',
          key: '_id'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '权限',
          key: 'permission'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      aaaa: [
        {
          code: '111',
          name: '111',
          children: [
            {
              code: '111-111',
              name: '111-111',
            },
            {
              code: '111-222',
              name: '111-222',
            }
          ]
        },
        {
          code: '222',
          name: '222',
          children: [
            {
              code: '222-222',
              name: '222-222',
            }
          ]
        }
      ],
      selected: ['111', '111-111']
    }
  },
  methods: {
    test (array) {
      return array.reduce((acc, curr) => {
        if (this.selected.includes(curr.code)) {
          acc.push(curr)
        }
        return acc.concat(curr.children && curr.children.length ? this.test(curr.children) : [])
      }, [])
    },
    async doGetRole () {
      const result = await getRole()
      const { data } = result.data
      this.roleTree = data.map((elm, index) => {
        const params = {
          title: elm.name,
          id: elm._id,
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
    async doCreateRole () {
      await createRole({
        name: this.formValidate.name,
        number: this.formValidate.mail,
        memo: this.formValidate.desc
      })
      this.doGetRole()
      this.formValidate.name = ''
      this.formValidate.mail = ''
      this.formValidate.desc = ''
    },
    getAtherData (selArr, selNode) {
      this.curryTypeId = selNode.id
      // console.log(this.curryTypeId)
      this.name = selNode.title
      this.doGetPermissionList({
        roleId: this.curryTypeId,
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
    },
    async doGetPermissionList (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await getPermissionList(params)
      const { data } = result.data
      console.log(data)
      this.rolesList = data.list.map((elm, index) => {
        const params = {
          ...elm.resource[0],
          state: elm.businessStatus !== -1,
          status: elm.businessStatus === -1
            ? '已停用' : elm.businessStatus === 1 ? '新创建' : '已启用',
          permission: elm.permission === -1
            ? '不可见' : elm.permission === 1 ? '仅可见' : '可操作',
          id1: elm._id
        }
        console.log(this.status)
        return params
      })
      this.pageInfo.total = data.total
    },
    async getSearchdata () {
      this.doGetPermissionList({
        roleId: this.curryTypeId,
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetPermissionList({
        roleId: this.curryTypeId,
        pageNum: page,
        pageSize: this.pageInfo.size
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetPermissionList({
        roleId: this.curryTypeId,
        pageNum: this.pageInfo.page,
        pageSize: size
      })
    },
    async redact (id) {
      id = this.curryTypeId
      await modifyRole(id, {
        memo: this.formValidate.desc,
        name: this.name,
        number: this.formValidate.mail
      })
      this.doGetRole()
    },
    async deleteRoleOne () {
      await deleteRole(this.curryTypeId)
      this.doGetRole()
    },
    async addPower () {
      this.addPower1 = true
      const result = await getDataCenter()
      const { data } = result.data
      this.resourceNameData = data.map((elm,index) => {
        const params = {
          label: elm.name,
          value: elm._id,
          children: [],
          loading: false
        }
        return params
      })
      // console.log(this.resourceNameData)
    },
    async change (params) {
      const result = await getResourceList(params)
      const { data } = result.data
      this.childNode = data.list.map((elm,index) => {
        const params = {
          label: elm.name,
          value: elm._id
        }
        return params
      })
      return this.childNode
    },
    async loadData (item, callback) {
      item.loading = true
      const childNode = await this.change({
        typeId: item.value,
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
      item.children = childNode
      item.loading = false
      callback()
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      // this.switch1 = true
      this.curryClick = row
      this.permissionId = row.id
      console.log(this.curryClick)
      this.status = row.status
      if (this.status === '已停用') {
        await modifyPermission(this.permissionId, {
          opCOde: 2
        })
        this.status = '已启用'
      } else if (this.status === '已启用') {
        await modifyPermission(this.permissionId, {
          opCOde: -1
        })
        this.status = '已停用'
      } else if (this.status === '新创建') {
        await modifyPermission(this.permissionId, {
          opCOde: 2
        })
        this.status = '已停用'
      }
      row.status = this.status
    },
    async doDeleteResource (row) {
      await deletePermission(row.id)
      this.doGetPermissionList({
        roleId: this.curryTypeId,
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
    },
    async addSuccess (params) {
      params = this.formValidate.setPower === '不可见' ? -1 : this.formValidate.setPower === '仅可见' ? 1 : 2
      this.powerDate(params)
      console.log(this.formValidate.resource)
    },
    async powerDate (params) {
      const result = await createPermission({
        memo: this.formValidate.mail,
        permission: params,
        resource: this.formValidate.resource[1],
        role: this.curryTypeId
      })
      this.permissionId1 = result.data._id
      this.doGetPermissionList({
        roleId: this.curryTypeId,
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
    },
    async curryClickRow (row) {
      this.powerDetails = true
      this.curryClick = row
      console.log(row)
      const result = await getDataCenter()
      const { data } = result.data
      this.resourceId = data.map((elm,index) => {
        const params = {
          label: elm.name,
          value: elm._id
        }
        return params
      })
      this.resourceId.filter((val, index, arr) => {
        if (val.value === this.curryClick.resourceType) {
          this.resourceName = val.label
          this.resourceValue = val.value
        }
      })
      this.powerName = this.resourceName + ' / ' + this.curryClick.name
      this.powerValue = this.curryClick._id
    },
    async makePower () {
      this.writePower = true
      const result = await getDataCenter()
      const { data } = result.data
      this.resourceData = data.map((elm,index) => {
        const params = {
          label: elm.name,
          value: elm._id,
          children: [],
          loading: false
        }
        if (this.resourceValue === params.value) {
          this.loadData(params, () => {})
        }
        return params
      })
      await this.change({
        typeId: this.curryClick.resourceType,
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
      this.value1 = [this.resourceValue, this.powerValue]
      console.log(this.value1)
    },
    async modifyPower () {
      const params = this.curryClick.permission === '不可见' ? -1 : this.curryClick.permission === '仅可见' ? 1 : 2
      await createPermission({
        memo: this.curryClick.memo,
        permissionId: this.curryClick.id1,
        permission: params,
        resource: this.value1[1],
        role: this.curryTypeId,
        businessStatus: 3
      })
      this.doGetPermissionList({
        roleId: this.curryTypeId,
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
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
