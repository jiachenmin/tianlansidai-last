<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>内容栏目树</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createTree=true">
                建栏目
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="contentTree" @on-select-change="getAtherData">

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
              <Input search enter-button="搜索" placeholder="请输入你要搜索的内容..." v-model="keyWord"/>
            </i-col>
            <i-col>
               <Button type="success">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="contentList">
            <template slot-scope="{ row,index}" slot="imageUrl">
                <div>
                 <img :src="row.imageUrl.concat('?x-oss-process=image/resize,h_100')" style="width: 100%">
                </div>
            </template>
            <template slot-scope="{ row,index }" slot="action">
            <i-switch @on-change="change1(row)" v-model="row.state">
                   <span slot="open">开</span>
                   <span slot="close">关</span>
            </i-switch>
            <Button type="success" size="small" style="margin-right: 5px" @click="content(row)">内容</Button>
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
          <!-- <Page :current="pageInfo.page" :pageSize="pageInfo.size" :total="pageInfo.total" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)" show-total/> -->
        </Card>
      </i-col>
    </Row>
    <Modal
        v-model="createTree"
        title="添加栏目"
        >
   <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
      </FormItem>
      <FormItem label="编号" prop="mail">
        <Input v-model="formValidate.mail" placeholder="请输入英文编号"></Input>
      </FormItem>
      <FormItem label="栏目图片" prop="mail">
        <Upload
            :before-upload="handleUpload"
            action="">
            <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
        </Upload>
        <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>
      </FormItem>
      <FormItem label="备注" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
      </FormItem>
   </Form>
    </Modal>
    <Modal
        v-model="writeContent"
        title="添加栏目"
        width="1000">
      <div>
    <editor ref="editor" :value="content1"/>
  </div>
    </Modal>
  </div>
</template>
<script>
import { findColumns, articleList, getSts, modifyArticle } from '@/api/daliy-operation/content.js'
import Editor from '_c/editor'
export default {
  created () {
    this.doGetContent()
  },
  components: {
    Editor
  },
  data () {
    return {
      contentTree: [],
      name: '',
      content1: '111',
      curryClick: {},
      keyWord: '',
      curryTypeId: '',
      contentList: [],
      createTree: false,
      writeContent: false,
      file: null,
      loadingStatus: false,
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
          key: 'code'
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '标题图片',
          slot: 'imageUrl'
        },
        {
          title: '文章简介',
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
      contentId: '',
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
    }
  },
  methods: {
    async doGetContent () {
      const result = await findColumns()
      const { data } = result.data
      this.contentTree = data.columns.map((elm,index) => {
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
      this.doGetContentData({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        columnId: this.curryTypeId
      })
    },
    async doGetContentData (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await articleList(params)
      const { data } = result.data
      this.contentList = data.articles.map((elm,index) => {
        const params = {
          ...elm,
          state: elm.businessStatus !== 3,
          status1: elm.businessStatus === 3 ? '已停用' : elm.businessStatus === 1 ? '新创建' : '已启用'
          // imageUrl: elm.html = '<img src=' + elm.imageUrl + '>'
        }
        return params
      })
      // console.log(this.rootList)
      this.pageInfo.total = data.total
    },
    handleUpload (file) {
      this.file = file
      return false
    },
    async upload () {
      this.loadingStatus = true
      setTimeout(() => {
        this.file = null
        this.loadingStatus = false
        this.$Message.success('Success')
        const result = getSts()
        console.log(result)
      }, 1500)
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      // this.switch1 = true
      this.curryClick = row
      this.contentId = row._id
      console.log(this.curryClick)
      this.status1 = row.status1
      if (this.status1 === '已停用') {
        await modifyArticle(this.contentId, {
          status: 2,
          code: this.curryClick.code,
          columnId: this.curryClick.columnId,
          html: this.curryClick.html,
          imageUrl: this.curryClick.imageUrl,
          remark: this.curryClick.memo,
          resume: this.curryClick.resume,
          title: this.curryClick.title
        })
        this.status1 = '已启用'
      } else if (this.status1 === '已启用') {
        await modifyArticle(this.contentId, {
          status: 3,
          code: this.curryClick.code,
          columnId: this.curryClick.columnId,
          html: this.curryClick.html,
          imageUrl: this.curryClick.imageUrl,
          remark: this.curryClick.memo,
          resume: this.curryClick.resume,
          title: this.curryClick.title
        })
        this.status1 = '已停用'
      } else if (this.status1 === '新创建') {
        await modifyArticle(this.contentId, {
          status: 3,
          code: this.curryClick.code,
          columnId: this.curryClick.columnId,
          html: this.curryClick.html,
          imageUrl: this.curryClick.imageUrl,
          remark: this.curryClick.memo,
          resume: this.curryClick.resume,
          title: this.curryClick.title
        })
        this.status1 = '已停用'
      }
      row.status1 = this.status1
    },
    async content (row) {
      this.writeContent = true
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
