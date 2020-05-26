<template>
 <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>调查问卷</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createQuestionnaire=true">
                建问卷
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="questionTree" @on-select-change="getAtherData">

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
               <Button type="success" @click="addQuestion">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="questionnaireList">
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
        v-model="createQuestionnaire"
        title="添加分组"
        @on-ok="createQuestionnaireOk">
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
        v-model="writeQuestionNaire"
        title="编辑问卷"
        @on-ok="writeQuestionNaireOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称：" prop="name">
        <Input v-model="name" placeholder="请输入名称"></Input>
      </FormItem>
       <FormItem label="ID：" prop="id">
         {{curryTypeId}}
         <a><Icon type="md-copy" /></a>
       </FormItem>
      <FormItem label="编号：" prop="mail">
        <Input v-model="mail" placeholder="请输入英文编号"></Input>
      </FormItem>
      <FormItem label="备注：" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
      </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="del"
        title="警告"
        @on-ok="deleteQuestionnaireOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
    <Modal
    v-model="addQuestionnare"
    title="添加项目"
    @on-ok="addQuestionnareOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属问卷" prop="sort">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="问题" prop="name">
            <Input v-model="formValidate.question" placeholder="请输入问题"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="类型" prop="part">
            <RadioGroup v-model="formValidate.part" @on-change="ref">
                <Radio label="选择题">选择题</Radio>
                <Radio label="开放题">开放题</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否必填" prop="isMust">
            <i-switch v-model="state">
                   <span slot="open">开</span>
                   <span slot="close">关</span>
            </i-switch>
        </FormItem>
        <FormItem label="题号" prop="sid">
            <InputNumber :min="1" v-model="formValidate.sid" :editable="false"></InputNumber>
        </FormItem>
        <FormItem label="选项" prop="option" ref="option">
            <Input v-model="formValidate.option" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="questionnareDetails"
    title="问卷详情"
    ok-text="编辑"
    @on-ok="writeDetails=true">
        <p><span>问题:</span>{{this.curryClick.question}}</p>
        <p><span>问题ID:</span>{{this.curryClick.qid}}</p>
        <p><span>编号:</span>{{this.curryClick.code}}</p>
        <p><span>题号:</span>{{this.curryClick.sid}}</p>
        <p><span>类型:</span>{{this.curryClick.stype}}</p>
        <p><span>是否必填:</span>{{this.curryClick.isMust}}</p>
        <p><span>选项:</span>{{this.curryClick.options}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeDetails"
    title="编辑项目"
    @on-ok="writeDetailsOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属问卷" prop="sort">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="问题" prop="name">
            <Input v-model="curryClick.question" placeholder="请输入问题"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="curryClick.code" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="类型" prop="part">
            <RadioGroup v-model="curryClick.stype" @on-change="ref">
                <Radio label="选择题">选择题</Radio>
                <Radio label="开放题">开放题</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="是否必填" prop="isMust">
            <i-switch v-model="curryClick.isMustWrite">
                   <span slot="open">开</span>
                   <span slot="close">关</span>
            </i-switch>
        </FormItem>
        <FormItem label="题号" prop="sid">
            <InputNumber :min="1" v-model="curryClick.sid" :editable="false"></InputNumber>
        </FormItem>
        <FormItem label="选项" prop="option" ref="option">
            <Input v-model="curryClick.options" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { getQuestionnaires, searchSubjects, deleteSubject, createSubject, getSubjects, createQuestionnaire, modifyQuestionnaire, deleteQuestionnaire, modifySubject } from '@/api/application-center/questionnaire.js'
export default {
  created () {
    this.doGetquestion()
  },
  data () {
    return {
      questionTree: [],
      questionnaireList: [],
      keyWord: '',
      name: '',
      isMustWrite: false,
      curryClick: {},
      curryTypeId: '',
      mail: '',
      questionnareDetails: false,
      createQuestionnaire: false,
      writeQuestionNaire: false,
      addQuestionnare: false,
      del: false,
      state: false,
      writeDetails: false,
      questionId: '',
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
      formValidate: {
        name: '',
        mail: '',
        desc: '',
        sid: 1,
        question: '',
        option: '',
        part: ''
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
        question: [
          { required: true, trigger: 'blur'}
        ],
        part: [
          { required: true, trigger: 'blur'}
        ],
        isMust: [
          { required: true, trigger: 'blur'}
        ],
        sid: [
          { required: true, trigger: 'blur'}
        ],
        option: [
          { required: false, trigger: 'blur'}
        ],
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
          title: '题号',
          key: 'sid'
        },
        {
          title: '类型',
          key: 'stype'
        },
        {
          title: '是否必填',
          key: 'isMust'
        },
        {
          title: '编号',
          key: 'code'
        },
        {
          title: '问题',
          key: 'question'
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
    async doGetquestion () {
      const result = await getQuestionnaires()
      const { data } = result.data
      console.log(data)
      this.questionTree = data.questionnaires.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          selected: false,
          number: elm.qid,
          // desc: elm.memo,
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
                      this.writeQuestionNaire = true
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
      // this.value1 = selNode.seq
      this.doGetSubjects(this.curryTypeId, {
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async doGetSubjects (id, params) {
      const result = await getSubjects(id, params)
      const { data } = result.data
      this.questionnaireList = data.subjects.map((elm, index) => {
        const params = {
          ...elm,
          state: elm.isUse !== 2,
          status1: elm.isUse === 2 ? '已停用' : elm.isUse === 1 ? '新创建' : '已启用',
          stype: elm.stype === 2 ? '开放题' : '选择题',
          isMust: elm.isMust === 1 ? '是' : '否',
          options: elm.options,
          isMustWrite: elm.isMust === 1 ? true : false
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    async createQuestionnaireOk () {
      await createQuestionnaire({
        name: this.formValidate.name,
        qid: this.formValidate.mail,
        remark: this.formValidate.desc
      })
      this.doGetquestion()
      this.formValidate.name = ''
      this.formValidate.mail = ''
      this.formValidate.desc = ''
    },
    async writeQuestionNaireOk (id) {
      id = this.curryTypeId
      await modifyQuestionnaire(id,{
        qid: this.mail,
        remark: this.formValidate.desc,
        name: this.name
      })
      this.doGetquestion()
    },
    async deleteQuestionnaireOne () {
      await deleteQuestionnaire(this.curryTypeId)
      this.doGetquestion()
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      this.curryClick = row
      console.log(row)
      this.questionId = row._id
      // console.log(this.curryClick)
      this.status1 = row.status1
      if (this.status1 === '已停用') {
        await modifySubject(this.questionId, {
          code: row.code,
          qid: row.qid,
          isUse: 1,
          question: row.question,
          options: row.options,
          sid: row.sid,
          memo: row.memo,
          isMust: row.isMust === '是' ? 1 : 2,
          stype: row.stype === '选择题' ? 1 : 2
        })
        this.status1 = '已启用'
      } else if (this.status1 === '已启用') {
        await modifySubject(this.questionId, {
          code: row.code,
          qid: row.qid,
          isUse: 2,
          question: row.question,
          options: row.options,
          sid: row.sid,
          memo: row.memo,
          isMust: row.isMust === '是' ? 1 : 2,
          stype: row.stype === '选择题' ? 1 : 2
        })
        this.status1 = '已停用'
      } else if (this.status1 === '新创建') {
        await modifySubject(this.questionId, {
          code: row.code,
          qid: row.qid,
          isUse: 2,
          question: row.question,
          options: row.options,
          sid: row.sid,
          memo: row.memo,
          isMust: row.isMust === '是' ? 1 : 2,
          stype: row.stype === '选择题' ? 1 : 2
        })
        this.status1 = '已停用'
      }
      row.status1 = this.status1
    },
    async getSearchdata () {
      // if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await searchSubjects({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        keywords: this.keyWord
      })
      const { data } = result.data
      this.questionnaireList = data.subjects.map((elm, index) => {
        const params = {
          ...elm,
          status1: elm.isUse === 2 ? '已停用' : elm.businessStatus === 1 ? '新创建' : '已启用',
          stype: elm.stype === 2 ? '开放题' : '选择题',
          isMust: elm.isMust === 1 ? '是' : '否'
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    async addQuestion () {
      this.addQuestionnare = true
    },
    ref () {
      this.$refs.option.$el.style.display = this.formValidate.part === '开放题' ? 'none' : 'block'
    },
    async addQuestionnareOk () {
      // this.addRoot = true
      await createSubject({
        code: this.formValidate.mail,
        memo: this.formValidate.desc,
        question: this.formValidate.question,
        isMust: this.state === false ? 2 : 1,
        option: this.formValidate.option,
        sid: this.formValidate.sid,
        qid: this.curryTypeId,
        stype: this.formValidate.part === '开放题' ? 2 : 1
      })
      this.doGetSubjects(this.curryTypeId, {
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async curryClickRow (row) {
      this.questionnareDetails = true
      this.curryClick = row
      console.log(row)
    },
    async writeDetailsOk () {
      this.detailId = this.curryClick._id
      await modifySubject(this.detailId, {
        code: this.curryClick.code,
        isMust: this.curryClick.isMustWrite === true ? 1 : 2,
        isUse: this.curryClick.isUse,
        option: this.curryClick.option,
        memo: this.curryClick.memo,
        qid: this.curryClick.qid,
        question: this.curryClick.question,
        sid: this.curryClick.sid,
        stype: this.curryClick.stype === '选择题' ? 1 : 2
      })
      this.doGetSubjects(this.curryTypeId, {
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    async doDeleteResource (row) {
      console.log(row)
      await deleteSubject(row._id)
      this.doGetSubjects(this.curryTypeId, {
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetSubjects(this.curryTypeId,{
        page: this.pageInfo.page,
        count: this.pageInfo.size
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetSubjects(this.curryTypeId,{
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
