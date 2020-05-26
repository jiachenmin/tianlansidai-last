<template>
   <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>干预方案版本</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createVersions=true">
                建版本
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="versionsTree" @on-select-change="getAtherData">

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
               <Button type="success" @click="addIntervention=true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="versionsList">
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
        v-model="createVersions"
        title="添加版本"
        @on-ok="createVersionsOk">
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
        v-model="writeIntervention"
        title="编辑版本"
        @on-ok="writeInterventionOk">
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
        @on-ok="deleteInterventionVersionOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
    <Modal
    v-model="addIntervention"
    title="添加项目"
    @on-ok="addInterventionOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属问卷">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="顺序" prop="sid">
            <InputNumber :min="1" v-model="formValidate.sid" :editable="false"></InputNumber>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
            <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="视力规则" prop="eyesRule">
            <Input v-model="formValidate.eyesRule" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入视力规则"></Input>
        </FormItem>
        <FormItem label="问卷" prop="questionnaire">
          <Select v-model="formValidate.questionnaire">
            <Option v-for="item in questionnaireList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="问卷规则" prop="questionRule">
            <Input v-model="formValidate.questionRule" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder='请输入json格式，例："c":"b"'></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="planDetails"
    title="方案详情"
    ok-text="编辑"
    @on-ok="writeplanDetails=true">
        <p><span>顺序:</span>{{this.curryClick.seq}}</p>
        <p><span>编号:</span>{{this.curryClick.number}}</p>
        <p><span>内容:</span>{{this.curryClick.content}}</p>
        <p><span>视力规则:</span>{{this.curryClick.visionRule}}</p>
        <p><span>问卷:</span>{{questionnaireName}}</p>
        <p><span>问卷规则:</span>{{this.curryClick.questionnaireRule}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeplanDetails"
    title="编辑方案"
    @on-ok="planDetailsOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属问卷">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="顺序" prop="sid">
            <InputNumber :min="1" v-model="curryClick.seq" :editable="false"></InputNumber>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="curryClick.number" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
            <Input v-model="curryClick.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容"></Input>
        </FormItem>
        <FormItem label="视力规则" prop="eyesRule">
            <Input v-model="curryClick.visionRule" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入视力规则"></Input>
        </FormItem>
        <FormItem label="问卷" prop="questionnaire">
          <Select v-model="curryClick.questionnaire">
            <Option v-for="item in questionnaireList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="问卷规则" prop="questionRule">
            <Input v-model="curryClick.questionnaireRule" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder='请输入json格式，例："c":"b"'></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { getInterventionVersion, getInterventions, modifyIntervention, deleteIntervention, createIntervention, deleteInterventionVersion, createInterventionVersion, modifyInterventionVersion } from '@/api/application-center/intervention-plan.js'
import { getQuestionnaires } from '@/api/application-center/questionnaire.js'
export default {
  created () {
    this.doGetVersions()
  },
  data () {
    return {
      versionsTree: [],
      versionsList: [],
      questionnaireList: [],
      curryClick: {},
      state: false,
      createVersions: false,
      writeplanDetails: false,
      writeIntervention: false,
      planDetails: false,
      addIntervention: false,
      del: false,
      curryTypeId: '',
      interventionId: '',
      questionnaireName: '',
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
      name: '',
      keyWord: '',
      mail: '',
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
          title: '顺序',
          key: 'seq'
        },
        {
          title: '编号',
          key: 'number'
        },
        {
          title: '内容',
          key: 'content'
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
      },
      formValidate: {
        name: '',
        mail: '',
        desc: '',
        sid: 1,
        content: '',
        eyesRule: '',
        questionnaire: '',
        questionRule: ''
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
        content: [
          { required: true, trigger: 'blur', message: '请输入内容'}
        ],
        eyesRule: [
          { required: true, trigger: 'blur', message: '视力规则不能为空'}
        ],
        questionnaire: [
          { required: true, trigger: 'blur'}
        ],
        sid: [
          { required: true, trigger: 'blur'}
        ],
        questionRule: [
          { required: true, trigger: 'blur', message: '问卷规则不能为空'},
          { pattern: '(\"([^,^\"]+)\":\"([^:^\"]+)\")|(\"([^,^\"]+)\":([\\d]+))', message: '请输入json格式，例："c":"b"' }
        ],
      },
    }
  },
  methods: {
    async doGetVersions () {
      const result = await getInterventionVersion()
      const { data } = result.data
      console.log(data)
      this.versionsTree = data.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          selected: false,
          number: elm.number,
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
                      this.writeIntervention = true
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
      const result1 = await getQuestionnaires()
      const data1 = result1.data
      // console.log(data1)
      this.questionnaireList = data1.data.questionnaires.map((elm, index) => {
        const params = {
          value: elm._id,
          label: elm.name
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
      this.doGetInterventions({
        vid: this.curryTypeId,
        pageSize: this.pageInfo.size,
        pageNum: this.pageInfo.page
      })
    },
    async doGetInterventions (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await getInterventions(params)
      const { data } = result.data
      this.versionsList = data.list.map((elm, index) => {
        const params = {
          ...elm,
          state: elm.businessStatus !== 3,
          status1: elm.businessStatus === 2 ? '已启用' : elm.businessStatus === 3 ? '已停用' : '新创建'
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    async createVersionsOk () {
      await createInterventionVersion({
        name: this.formValidate.name,
        number: this.formValidate.mail,
        remark: this.formValidate.desc
      })
      this.doGetVersions()
      this.formValidate.name = ''
      this.formValidate.mail = ''
      this.formValidate.desc = ''
    },
    async writeInterventionOk (id) {
      id = this.curryTypeId
      await modifyInterventionVersion(id, {
        number: this.mail,
        remark: this.formValidate.desc,
        name: this.name,
        status: 2
      })
      this.formValidate.desc = ''
      this.doGetVersions()
    },
    async deleteInterventionVersionOne () {
      await deleteInterventionVersion(this.curryTypeId)
      this.doGetVersions()
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      this.curryClick = row
      console.log(row)
      this.interventionId = row._id
      // // console.log(this.curryClick)
      this.status1 = row.status1
      if (this.status1 === '已停用') {
        await modifyIntervention(this.interventionId, {
          status: 2
        })
        this.status1 = '已启用'
      } else if (this.status1 === '已启用') {
        await modifyIntervention(this.interventionId, {
          status: 3
        })
        this.status1 = '已停用'
      } else if (this.status1 === '新创建') {
        await modifyIntervention(this.interventionId, {
          status: 2
        })
        this.status1 = '已停用'
      }
      row.status1 = this.status1
    },
    async getSearchdata () {
      this.doGetInterventions({
        vid: this.curryTypeId,
        pageSize: this.pageInfo.size,
        pageNum: this.pageInfo.page
      })
    },
    async addInterventionOk () {
      // this.addRoot = true
      await createIntervention({
        content: this.formValidate.content,
        memo: this.formValidate.desc,
        number: this.formValidate.mail,
        questionnaireId: this.formValidate.questionnaire,
        questionnaireRule: this.formValidate.questionRule,
        seq: this.formValidate.sid,
        version: this.curryTypeId,
        visionRule: '(function() { return function(result) { return ' + this.formValidate.eyesRule + '} })()'
      })
      this.doGetInterventions({
        vid: this.curryTypeId,
        pageSize: this.pageInfo.size,
        pageNum: this.pageInfo.page
      })
    },
    async curryClickRow (row) {
      this.planDetails = true
      this.curryClick = row
      console.log(row)
      this.questionnaireList.filter((val, index, arr) => {
        if (val.value === this.curryClick.questionnaire) {
          this.questionnaireName = val.label
        }
      })
    },
    async planDetailsOk () {
      this.interventionId = this.curryClick._id
      await createIntervention({
        businessStatus: 3,
        interventionId: this.interventionId,
        content: this.curryClick.content,
        memo: this.curryClick.memo,
        number: this.curryClick.number,
        questionnaireId: this.curryClick.questionnaire,
        questionnaireRule: this.curryClick.questionnaireRule,
        seq: this.curryClick.seq,
        version: this.curryClick.version,
        visionRule: '(function() { return function(result) { return ' + this.curryClick.visionRule + '} })()'
      })
      this.doGetInterventions({
        vid: this.curryTypeId,
        pageSize: this.pageInfo.size,
        pageNum: this.pageInfo.page
      })
    },
    async doDeleteResource (row) {
      console.log(row)
      await deleteIntervention(row._id)
      this.doGetInterventions({
        vid: this.curryTypeId,
        pageSize: this.pageInfo.size,
        pageNum: this.pageInfo.page
      })
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetInterventions({
        vid: this.curryTypeId,
        pageSize: this.pageInfo.size,
        pageNum: this.pageInfo.page
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetInterventions({
        vid: this.curryTypeId,
        pageSize: this.pageInfo.size,
        pageNum: this.pageInfo.page
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
