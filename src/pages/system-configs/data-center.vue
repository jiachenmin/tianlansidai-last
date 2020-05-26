<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="10">
              <h3>资源类型树</h3>
            </i-col>
          </div>
          <Divider />

         <Tree :data="resourceTree" @on-select-change="getAtherData"></Tree>
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
               <Button type="success" @click="modal1 = true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="resourceDate">
              <template slot-scope="{ row,index }" slot="action">
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
       title="添加资源"
       @on-ok="addSuccess('error','formValidate')">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="所属资源类型" prop="resourceType">
        <Input v-model="name" disabled></Input>
      </FormItem>
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
    title="资源详情"
    ok-text="编辑"
    @on-ok="modal3=true">
        <p><span>名称:</span>{{this.curryClick.name}}</p>
        <p><span>编号:</span>{{this.curryClick.number}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
     <Modal
          v-model="modal3"
          title="编辑资源"
          @on-ok="writeResource('error')"
          >
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
         <FormItem label="所属资源类型" prop="resourceType">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
            <Input v-model="curryClick.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="curryClick.number" placeholder="请输入英文编号"></Input>
        </FormItem>
                <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
            </Modal>
  </div>
</template>
<script>
import {
  getDataCenter, getResourceList, deleteResource, addResource
} from '@/api/system-configs/data-center.js'

export default {
  created () {
    this.doGetResourceDate()
  },
  data () {
    return {
      name: '',
      keyWord: '',
      curryClick: {},
      formValidate: {
        name: '',
        mail: '',
        desc: ''
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
        ]
      },
      resourceTree: [],
      columns1: [
        {
          title: '#',
          type: 'index'
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
      },
      resourceDate: [],
      curryTypeId: '',
      modal1: false,
      modal2: false,
      modal3: false,
      resourceID: ''
    }
  },
  methods: {
    addSuccess (type, name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addSuccessTest(type)
          this.formValidate.mail = ''
          this.formValidate.name = ''
          this.formValidate.desc = ''
        } else {
          this.$Message.error('编号输入格式错误!')
          this.formValidate.mail = ''
          this.formValidate.name = ''
          this.formValidate.desc = ''
        }
      })
    },
    async addSuccessTest (type) {
      const result = await addResource({
        resourceTypeId: this.curryTypeId,
        number: this.formValidate.mail,
        name: this.formValidate.name,
        memo: this.formValidate.desc
      })
      console.log(result.data.code)
      if (result.data.code === 4) {
        this.$Message[type]({
          content: '已存在编号，请重新输入',
          duration: 5,
          background: true
        })
      }
      this.doGetResource({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    async writeResource (type) {
      const result = await addResource({
        resourceTypeId: this.curryTypeId,
        number: this.curryClick.number,
        name: this.curryClick.name,
        memo: this.curryClick.memo,
        resourceId: this.resourceID
      })
      console.log(result.data.code)
      if (result.data.code === 4) {
        this.$Message[type]({
          content: '已存在编号，请重新输入',
          duration: 5,
          background: true
        })
      }
      this.doGetResource({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    curryClickRow (row) {
      this.modal2 = true
      this.curryClick = row
      this.resourceID = this.curryClick._id
    },
    async doGetResourceDate () {
      const result = await getDataCenter()
      const { data } = result.data
      // console.log(data)
      this.resourceTree = data.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          selected: false
        }
        // console.log(params.id)
        if (!index) {
          params.selected = true
          this.getAtherData(null, params)
        }
        return params
      })
    },
    getAtherData (selArr, selNode) {
      this.curryTypeId = selNode.id
      // console.log(this.curryTypeId)
      this.name = selNode.title
      this.doGetResource({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetResource({
        pageNum: page,
        pageSize: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetResource({
        pageNum: this.pageInfo.page,
        pageSize: size,
        typeId: this.curryTypeId
      })
    },
    async doDeleteResource (row) {
      await deleteResource(row._id)
      this.doGetResource({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    async getSearchdata () {
      this.doGetResource({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        typeId: this.curryTypeId
      })
    },
    async doGetResource (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await getResourceList(params)
      const { data } = result.data
      this.resourceDate = data.list
      this.pageInfo.total = data.total
    }
  }
}
</script>
<style lang="less" scoped>
.left-box,
.right-box {
  .ivu-card {
    min-height: 600px;
  }
}
a {
  color: #515a6e;
}
.date-list {
  margin: 5px auto;
  list-style: none;

  .ivu-btn-ghost {
    color: #515a6e;
    font-size: 13px;
  }
}
.ivu-btn-success{
  margin-left:5px;
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
