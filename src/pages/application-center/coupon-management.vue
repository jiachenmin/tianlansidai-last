<template>
<!-- 本章未写完 -->
<!-- 本章未写完 -->
<!-- 本章未写完 -->
   <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>优惠卷类型树</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createCoupon=true">
                建类型
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="typeTree" @on-select-change="getAtherData">

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
              <Input search enter-button="搜索" placeholder="请输入你要搜索的内容..." v-model="keyWord" @on-search="getSearchdata('error')"/>
            </i-col>
            <i-col>
               <Button type="success">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="couponDataList">
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
          <!-- <Page :current="pageInfo.page" :pageSize="pageInfo.size" :total="pageInfo.total" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)" show-total/> -->
        </Card>
      </i-col>
    </Row>
    <Modal
        v-model="createCoupon"
        title="添加优惠卷"
        @on-ok="createCouponOk">
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
        v-model="writeCoupon"
        title="编辑版本"
        @on-ok="writeCouponOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="名称：" prop="name">
        <Input v-model="name" placeholder="请输入名称"></Input>
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
        @on-ok="deleteCouponOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
  </div>
</template>
<script>
import { getCouponTypes, getCoupons, createCouponType, modifyCouponType, deleteCouponType, searchCoupon, modifyCoupon } from '@/api/application-center/coupon-center.js'
export default {
  created () {
    this.doGetCouponData()
  },
  data () {
    return {
      typeTree: [],
      couponDataList: [],
      createCoupon: false,
      writeCoupon: false,
      del: false,
      curryTypeId: '',
      couponId: '',
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
      name: '',
      keyWord: '',
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
          key: 'code'
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '介绍文章',
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
      mail: '',
      formValidate: {
        name: '',
        mail: '',
        desc: ''
        // sid: 1,
        // content: '',
        // eyesRule: '',
        // questionnaire: '',
        // questionRule: ''
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
        // content: [
        //   { required: true, trigger: 'blur', message: '请输入内容'}
        // ],
        // eyesRule: [
        //   { required: true, trigger: 'blur', message: '视力规则不能为空'}
        // ],
        // questionnaire: [
        //   { required: true, trigger: 'blur'}
        // ],
        // sid: [
        //   { required: true, trigger: 'blur'}
        // ],
        // questionRule: [
        //   { required: true, trigger: 'blur', message: '问卷规则不能为空'},
        //   { pattern: '(\"([^,^\"]+)\":\"([^:^\"]+)\")|(\"([^,^\"]+)\":([\\d]+))', message: '请输入json格式，例："c":"b"' }
        // ],
      },
    }
  },
  methods: {
    async doGetCouponData () {
      const result = await getCouponTypes()
      const { data } = result.data
      console.log(data)
      this.typeTree = data.couponTypes.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          selected: false,
          number: elm.ctid,
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
                      this.writeCoupon = true
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
      // const result1 = await getQuestionnaires()
      // const data1 = result1.data
      // // console.log(data1)
      // this.questionnaireList = data1.data.questionnaires.map((elm, index) => {
      //   const params = {
      //     value: elm._id,
      //     label: elm.name
      //   }
      //   return params
      // })
    },
    async getAtherData (selArr, selNode) {
      this.curryTypeId = selNode.id
      // console.log(this.curryTypeId)
      this.name = selNode.title
      this.mail = selNode.number
      // this.value1 = selNode.seq
      this.doGetCoupons({
        ctid: this.curryTypeId,
        count: this.pageInfo.size,
        page: this.pageInfo.page
      })
    },
    async doGetCoupons (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await getCoupons(params)
      const { data } = result.data
      this.couponDataList = data.coupons.map((elm, index) => {
        const params = {
          ...elm,
          state: elm.isUse !== 2,
          status1: elm.isUse === 1 ? '已启用' : elm.isUse === 2 ? '已停用' : '新创建'
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    async createCouponOk () {
      await createCouponType({
        name: this.formValidate.name,
        ctid: this.formValidate.mail,
        remark: this.formValidate.desc
      })
      this.doGetCouponData()
      this.formValidate.name = ''
      this.formValidate.mail = ''
      this.formValidate.desc = ''
    },
    async writeCouponOk (id) {
      id = this.curryTypeId
      await modifyCouponType(id, {
        ctid: this.mail,
        remark: this.formValidate.desc,
        name: this.name
        // status: 2
      })
      this.formValidate.desc = ''
      this.doGetCouponData()
    },
    async deleteCouponOne () {
      await deleteCouponType(this.curryTypeId)
      this.doGetCouponData()
    },
    async change1 (row) {
      this.$Message.success('修改状态成功')
      this.curryClick = row
      console.log(row)
      this.couponId = row._id
      // // console.log(this.curryClick)
      this.status1 = row.status1
      if (this.status1 === '已停用') {
        await modifyCoupon(this.couponId, {
          code: row.code,
          collectRule: row.collectRule,
          content: row.content,
          ctid: row.ctid,
          introduceUrl: row.introduceUrl,
          inUse: 1,
          title: row.title,
          useRule: row.useRule
        })
        this.status1 = '已启用'
      } else if (this.status1 === '已启用') {
        await modifyCoupon(this.couponId, {
          code: row.code,
          collectRule: row.collectRule,
          content: row.content,
          ctid: row.ctid,
          introduceUrl: row.introduceUrl,
          inUse: 2,
          title: row.title,
          useRule: row.useRule
        })
        this.status1 = '已停用'
      } else if (this.status1 === '新创建') {
        await modifyCoupon(this.couponId, {
          code: row.code,
          collectRule: row.collectRule,
          content: row.content,
          ctid: row.ctid,
          introduceUrl: row.introduceUrl,
          inUse: 1,
          title: row.title,
          useRule: row.useRule
        })
        this.status1 = '已停用'
      }
      row.status1 = this.status1
    },
    async getSearchdata (type) {
      const result = await searchCoupon({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        keywords: this.keyWord
      })
      if (result.data.code === 4) {
        this.$Message[type]({
          content: '参数错误，我也不知道哪错了',
          duration: 5,
          background: true
        })
      }
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
