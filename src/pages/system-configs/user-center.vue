<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>用户组织树</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createTree=true">
                建组织
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="orgList" @on-select-change="getAtherData"></Tree>
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
               <Button type="success" @click="addUser=true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="userList">
            <template slot-scope="{ row,index }" slot="action">
            <i-switch @on-change="change1(row)" v-model="row.state">
                   <span slot="open">开</span>
                   <span slot="close">关</span>
            </i-switch>
             <Button type="primary" size="small" style="margin-right: 5px" @click="curryClickRow(row)">详情</Button>
             <Button type="warning" size="small" style="margin-right: 5px" @click="resetPassword(row)">重置密码</Button>
            <Poptip
                confirm
                title="您确定删除这条内容吗？"
                @on-ok="doDeleteResource(row)"
                transfer>
                <Button type="error" size="small">删除</Button>
            </Poptip>
            </template>
          </Table>
          <!-- <Page :current="pageInfo.page" :pageSize="pageInfo.size" :total="pageInfo.total" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)" show-total/> -->
        </Card>
      </i-col>
    </Row>
    <Modal
        v-model="createTree"
        title="添加分类"
        @on-ok="createTreeOk">
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
        v-model="writeTree"
        title="添加分类"
        @on-ok="writeTreeOk">
   <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input v-model="name" placeholder="请输入名称"></Input>
      </FormItem>
      <FormItem label="编号" prop="mail">
        <Input v-model="mail" placeholder="请输入英文编号"></Input>
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
      </FormItem>
   </Form>
    </Modal>
     <Modal
    v-model="addUser"
    title="添加元数据"
    @on-ok="addUserOk">
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
        <FormItem label="手机号" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="电子邮箱" prop="email">
            <Input v-model="formValidate.email" placeholder="请输入英文编号"></Input>
        </FormItem>
         <FormItem label="密码" prop="passWord">
            <Input v-model="formValidate.passWord" placeholder="请输入英文编号" type="password"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="passwordAgain">
            <Input v-model="formValidate.passwordAgain" type="password" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="del"
        title="警告"
        @on-ok="deleteTreeOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
    <Modal
    v-model="userDetails"
    title="问卷详情"
    ok-text="编辑"
    @on-ok="writeDetails=true">
        <p><span>用户姓名:</span>{{this.curryClick.name}}</p>
        <p><span>用户编号:</span>{{this.curryClick.seq}}</p>
        <p><span>手机号码:</span>{{this.curryClick.phone}}</p>
        <p><span>电子邮箱:</span>{{this.curryClick.email}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeDetails"
    title="编辑"
    @on-ok="writeDetailsOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属分类" prop="sort">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
            <Input v-model="curryClick.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="curryClick.seq" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
            <Input v-model="curryClick.phone" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="电子邮箱" prop="email">
            <Input v-model="curryClick.email" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="resetPwd"
    title="编辑"
    @on-ok="resetPwdOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="新密码" prop="passWord">
          <Input v-model="formValidate.passWord" placeholder="请输入密码" type="password"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="passwordAgain">
          <Input v-model="formValidate.passwordAgain" type="password" placeholder="请输入密码"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>

<script>
import { findAdmins, organizationTrees, deleteOrganization, deleteAdmin, createAdmin, modifyOrganization, modifyAdmin, createOrganization } from '@/api/system-configs/user-center'

export default {
  name: 'UserCenter',
  created () {
    this.doGetUserOrgTree()
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'));
      } else {
        if (this.formValidate.passwordAgain !== '') {
          this.$refs.formValidate.validateField('passwordAgain');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password again'));
      } else if (value !== this.formValidate.passWord) {
        callback(new Error('The two input passwords do not match!'));
      } else {
        callback();
      }
    };
    return {
      name: '',
      keyWord: '',
      mail: '',
      curryTypeId: '',
      curryClick: {},
      del: false,
      passwordAgain: '',
      addUser: false,
      writeDetails: false,
      userDetails: false,
      createTree: false,
      resetPwd: false,
      writeTree: false,
      orgList: [],
      userList: [],
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
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
          title: '邮箱',
          key: 'email'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '手机号',
          key: 'phone'
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
      },
      formValidate: {
        name: '',
        mail: '',
        desc: '',
        phone: '',
        email: '',
        passWord: '',
        passwordAgain: ''
      },
      userId: '',
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
        phone: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        email: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        passWord: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      },

    }
  },
  methods: {
    async doGetUserOrgTree () {
      const result = await organizationTrees()
      const { data } = result.data
      this.orgList = data.organizations.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          number: elm.seq,
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
                      this.writeTree = true
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
      this.mail = selNode.number
      this.doGetUserData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        organizationId: this.curryTypeId
      })
    },
    async doGetUserData (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await findAdmins(params)
      const { data } = result.data
      console.log(data)
      this.userList = data.admins.map((elm,index) => {
        const params = {
          ...elm,
          state: elm.isLock !== 1,
          status1: elm.isLock === 1 ? '已停用' : elm.businessStatus === 3 ? '新创建' : '已启用'
        }
        return params
      })
      // console.log(this.rootList)
      this.pageInfo.total = data.total
    },
    async createTreeOk () {
      await createOrganization({
        name: this.formValidate.name,
        seq: this.formValidate.mail,
        remark: this.formValidate.desc
      })
      this.doGetUserOrgTree()
      this.formValidate.name = ''
      this.formValidate.mail = ''
      this.formValidate.desc = ''
    },
    async addUserOk () {
      await createAdmin({
        phone: this.formValidate.phone,
        remark: this.formValidate.desc,
        email: this.formValidate.email,
        password: this.formValidate.passWord,
        name: this.formValidate.name,
        seq: this.formValidate.mail,
        organizationId: this.curryTypeId
      })
      this.doGetUserOrgTree()
      this.formValidate.password = ''
      this.formValidate.passwordAgain = ''
      this.formValidate.phone = ''
    },
    async writeTreeOk (id) {
      id = this.curryTypeId
      await modifyOrganization(id, {
        seq: this.mail,
        remark: this.formValidate.desc,
        parentId: id,
        name: this.name
      })
      this.doGetUserOrgTree()
    },
    async deleteTreeOne () {
      await deleteOrganization(this.curryTypeId)
      this.doGetUserOrgTree()
    },
    async getSearchdata () {
      this.doGetUserData({
        vid: this.curryTypeId,
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      this.curryClick = row
      console.log(row)
      this.userId = row._id
      // console.log(this.curryClick)
      this.status1 = row.status1
      if (this.status1 === '已停用') {
        await modifyAdmin(this.userId, {
          email: row.email,
          isLock: 2,
          remark: row.memo,
          name: row.name,
          organizationId: row.organizationId,
          phone: row.phone,
          seq: row.seq
        })
        this.status1 = '已启用'
      } else if (this.status1 === '已启用') {
        await modifyAdmin(this.userId, {
          email: row.email,
          isLock: 1,
          remark: row.memo,
          name: row.name,
          organizationId: row.organizationId,
          phone: row.phone,
          seq: row.seq
        })
        this.status1 = '已停用'
      } else if (this.status1 === '新创建') {
        await modifyAdmin(this.userId, {
          email: row.email,
          isLock: 1,
          remark: row.memo,
          name: row.name,
          organizationId: row.organizationId,
          phone: row.phone,
          seq: row.seq
        })
        this.status1 = '已停用'
      }
      row.status1 = this.status1
    },
    async curryClickRow (row) {
      this.userDetails = true
      this.curryClick = row
      console.log(row)
    },
    async writeDetailsOk () {
      await modifyAdmin(this.curryClick._id, {
        email: this.curryClick.email,
        name: this.curryClick.name,
        organizationId: this.curryTypeId,
        password: this.curryClick.password,
        phone: this.curryClick.phone,
        remark: this.curryClick.memo,
        seq: this.curryClick.seq
      })
      this.doGetUserData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        organizationId: this.curryTypeId
      })
    },
    async resetPassword (row) {
      this.curryClick = row
      this.resetPwd = true
    },
    async resetPwdOk () {
      await modifyAdmin(this.curryClick._id, {
        email: this.curryClick.email,
        name: this.curryClick.name,
        organizationId: this.curryTypeId,
        password: this.formValidate.passWord,
        phone: this.curryClick.phone,
        remark: this.curryClick.memo,
        seq: this.curryClick.seq,
        isLock: this.curryClick.isLock
      })
      this.doGetUserData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        organizationId: this.curryTypeId
      })
    },
    async doDeleteResource (row) {
      await deleteAdmin(row._id)
      this.doGetUserData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        organizationId: this.curryTypeId
      })
    },
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
