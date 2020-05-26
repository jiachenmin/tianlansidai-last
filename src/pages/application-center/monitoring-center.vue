<template>
   <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>体验项目组</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createGroup=true">
                建分组
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="groupsTree" @on-select-change="getAtherData">

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
               <Button type="success" @click="addTerm=true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="groupsList">
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
        v-model="createGroup"
        title="添加分组"
        @on-ok="doCreateGroup">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
      </FormItem>
      <FormItem label="编号" prop="mail">
        <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
      </FormItem>
      <FormItem label="顺序" prop="seq">
        <InputNumber :min="1" v-model="value1"></InputNumber>
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
      </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="writeGroup"
    title="编辑分组"
    @on-ok="writeGroupOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="名称" prop="name">
            <Input v-model="name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="顺序" prop="seq">
            <InputNumber :min="1" v-model="value1"></InputNumber>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="del"
        title="警告"
        @on-ok="deleteGroupOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
    <Modal
    v-model="addTerm"
    title="添加项目"
    @on-ok="addTermOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属分组" prop="sort">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="代码" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="部位" prop="part">
            <RadioGroup v-model="formValidate.part">
                <Radio label="左眼">左眼</Radio>
                <Radio label="右眼">右眼</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="顺序" prop="seq">
            <InputNumber :min="1" v-model="formValidate.seq" :editable="false"></InputNumber>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="termDetails"
    title="项目详情"
    ok-text="编辑"
    @on-ok="writeTerm=true">
        <p><span>名称:</span>{{this.curryClick.name}}</p>
        <p><span>代码:</span>{{this.curryClick.code}}</p>
        <p><span>部位:</span>{{this.curryClick.part}}</p>
        <p><span>顺序:</span>{{this.curryClick.seq}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeTerm"
    title="编辑项目"
    @on-ok="writeTermOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属分组" prop="sort">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
            <Input v-model="curryClick.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="代码" prop="mail">
            <Input v-model="curryClick.code" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="部位" prop="part">
            <RadioGroup v-model="curryClick.part">
                <Radio label="左眼">左眼</Radio>
                <Radio label="右眼">右眼</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="顺序" prop="seq">
            <InputNumber :min="1" v-model="curryClick.seq" :editable="false"></InputNumber>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { getGroups, getTerms, createGroup, modifyGroup, deleteGroup, searchTerms, modifyTerm, createTerm, deleteTerm } from '@/api/application-center/groups-center.js'
export default {
  created () {
    this.doGetGroups()
  },
  data () {
    return {
      groupsTree: [],
      name: '',
      keyWord: '',
      value1: 1,
      groupsList: [],
      curryTypeId: '',
      curryClick: {},
      mail: '',
      termId: '',
      createGroup: false,
      writeGroup: false,
      makeGroup: false,
      addTerm: false,
      termDetails: false,
      writeTerm: false,
      del: false,
      pageInfo: {
        page: 1,
        size: 10,
        total: 0
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
          title: '部位',
          key: 'part'
        },
        {
          title: '顺序',
          key: 'seq'
        },
        {
          title: '项目名称',
          key: 'name'
        },
        {
          title: '项目代码',
          key: 'code'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
      formValidate: {
        name: '',
        mail: '',
        desc: '',
        seq: 1,
        part: '左眼'
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
        seq: [
          { required: false, trigger: 'blur'}
        ],
        part: [
          { required: true, trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    async doGetGroups () {
      const result = await getGroups()
      const { data } = result.data
      this.groupsTree = data.groups.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          number: elm.gid,
          seq: elm.seq,
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
                      this.writeGroup = true
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
      this.formValidate.mail = selNode.number
      this.value1 = selNode.seq
      this.doGetTerms(this.curryTypeId,{
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async doGetTerms (id, params) {
      const result = await getTerms(id, params)
      const { data } = result.data
      this.groupsList = data.terms.map((elm, index) => {
        const params = {
          ...elm,
          state: elm.isUse !== 2,
          status1: elm.isUse === 2 ? '已停用' : elm.businessStatus === 1 ? '新创建' : '已启用',
          part: elm.part === 2 ? '右眼' : '左眼'
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      this.curryClick = row
      console.log(row)
      this.termId = row._id
      // console.log(this.curryClick)
      this.status1 = row.status1
      if (this.status1 === '已停用') {
        await modifyTerm(this.termId, {
          code: row.code,
          gid: row.groupId,
          isUse: 1,
          name: row.name,
          seq: row.seq,
          memo: row.memo,
          part: row.part === '右眼' ? 2 : 1
        })
        this.status1 = '已启用'
      } else if (this.status1 === '已启用') {
        await modifyTerm(this.termId, {
          code: row.code,
          gid: row.groupId,
          isUse: 2,
          name: row.name,
          memo: row.memo,
          seq: row.seq,
          part: row.part === '右眼' ? 2 : 1
        })
        this.status1 = '已停用'
      } else if (this.status1 === '新创建') {
        await modifyTerm(this.termId, {
          code: row.code,
          gid: row.groupId,
          isUse: 2,
          name: row.name,
          memo: row.memo,
          seq: row.seq,
          part: row.part === '右眼' ? 2 : 1
        })
        this.status1 = '已停用'
      }
      row.status1 = this.status1
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetTerms(this.curryTypeId,{
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetTerms(this.curryTypeId,{
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async doCreateGroup () {
      await createGroup({
        name: this.formValidate.name,
        gid: this.formValidate.mail,
        memo: this.formValidate.desc,
        seq: this.value1
      })
      this.doGetGroups()
      this.formValidate.name = ''
      this.formValidate.mail = ''
      this.formValidate.desc = ''
    },
    async writeGroupOk (id) {
      id = this.curryTypeId
      await modifyGroup(id,{
        code: this.formValidate.mail,
        memo: this.formValidate.desc,
        name: this.name
      })
      this.doGetGroups()
    },
    async deleteGroupOne () {
      await deleteGroup(this.curryTypeId)
      this.doGetGroups()
    },
    async getSearchdata () {
      // if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await searchTerms({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        keywords: this.keyWord
      })
      const { data } = result.data
      this.groupsList = data.terms.map((elm, index) => {
        const params = {
          ...elm,
          state: elm.isUse !== 2,
          status1: elm.isUse === 2 ? '已停用' : elm.businessStatus === 1 ? '新创建' : '已启用',
          part: elm.part === 2 ? '右眼' : '左眼'
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    async addTermOk () {
      // this.addRoot = true
      await createTerm({
        code: this.formValidate.mail,
        memo: this.formValidate.desc,
        name: this.formValidate.name,
        part: this.formValidate.part === '左眼' ? 1 : 2,
        gid: this.curryTypeId,
        seq: this.formValidate.seq
      })
      this.doGetTerms(this.curryTypeId, {
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async curryClickRow (row) {
      this.termDetails = true
      this.curryClick = row
      console.log(row)
    },
    async writeTermOk () {
      this.termId = this.curryClick._id
      await modifyTerm(this.termId, {
        code: this.curryClick.code,
        gid: this.curryClick.groupId,
        isUse: this.curryClick.isUse,
        name: this.curryClick.name,
        memo: this.curryClick.memo,
        seq: this.curryClick.seq,
        part: this.curryClick.part === '右眼' ? 2 : 1
      })
      this.doGetTerms(this.curryTypeId, {
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async doDeleteResource (row) {
      console.log(row)
      await deleteTerm(row._id)
      this.doGetTerms(this.curryTypeId, {
        page: this.pageInfo.page,
        count: this.pageInfo.size
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
