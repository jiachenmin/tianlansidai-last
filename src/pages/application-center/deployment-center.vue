<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>运营区域树</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createArea=true">
                建区域
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="areaTree" @on-select-change="getAtherData">

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
               <Button type="success" @click="addArea=true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="territoriesList">
            <template slot-scope="{ row,index }" slot="action">
             <Button type="primary" size="small" style="margin-right: 5px" @click="curryClickArea(row)">详情</Button>
            <Poptip
                confirm
                title="您确定删除这条内容吗？"
                @on-ok="doDeleteArea(row)"
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
        v-model="createArea"
        title="添加区域"
        @on-ok="doCreateArea">
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
    v-model="writeArea"
    title="编辑区域"
    @on-ok="writeAreaOk">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="名称" prop="name">
            <Input v-model="name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="编号" prop="mail">
            <Input v-model="mail" placeholder="请输入英文编号"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="del"
        title="警告"
        @on-ok="deleteAreaOne">
        <p>是否删除<span class="del1">{{name}}</span></p>
    </Modal>
    <Modal
    v-model="addArea"
    title="添加城市"
    @on-ok="addAreaOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="省市区划" prop="area">
           <Cascader :data="areaList" v-model="formValidate.area" change-on-select :load-data="loadData" @on-change="changeArea"></Cascader>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="areaDetails"
    title="区域详情"
    ok-text="编辑"
    @on-ok="writeAreaDetails"
  >
        <p><span>省市区划:</span>{{areaName}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeDetails"
    title="编辑城市"
    @on-ok="writeDetailsOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="省市区划" prop="area">
           <Cascader :data="areaList" v-model="value2" change-on-select :load-data="loadData" @on-change="changeArea"></Cascader>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { findAreas, findTerritories, createArea, modifyTerritory, modifyArea, deleteArea, findRegions, deleteTerritory, createTerritory } from '@/api/application-center/area-center.js'
export default {
  created () {
    this.doGetArea()
  },
  data () {
    return {
      areaTree: [],
      territoriesList: [],
      areaList: [],
      curryTypeId: '',
      name: '',
      areaName: '',
      keyWord: '',
      mail: '',
      value2: [],
      curryClick: {},
      desc: '',
      value1: [],
      value3: [],
      value4: [],
      selectedData1: [],
      addArea: false,
      writeDetails: false,
      createArea: false,
      writeArea: false,
      del: false,
      areaDetails: false,
      provinceCode: '',
      cityCode: '',
      buttonProps: {
        type: 'primary',
        size: 'small',
        shape: 'circle'
      },
      formValidate: {
        name: '',
        mail: '',
        desc: '',
        memo: '',
        area: []
        // content: ''
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
        area: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        // content: [
        //   { required: true, message: '内容为必填项', trigger: 'blur'}
        // ]
      },
      columns1: [
        {
          title: '#',
          type: 'index'
        },
        {
          title: '省份代码',
          key: 'provinceCode'
        },
        {
          title: '省份名称',
          key: 'provinceName'
        },
        {
          title: '城市代码',
          key: 'cityCode'
        },
        {
          title: '城市名称',
          key: 'cityName'
        },
        {
          title: '地区代码',
          key: 'districtCode'
        },
        {
          title: '地区名称',
          key: 'districtName'
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
    async doGetArea () {
      const result = await findAreas()
      const { data } = result.data
      this.areaTree = data.areas.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          selected: false,
          number: elm.code,
          desc: elm.memo,
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
      this.getRegions()
    },
    async getAtherData (selArr, selNode) {
      this.curryTypeId = selNode.id
      // console.log(this.curryTypeId)
      this.name = selNode.title
      this.mail = selNode.number
      this.desc = selNode.desc
      this.doFindTerritories({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async doFindTerritories (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await findTerritories(params)
      const { data } = result.data
      this.territoriesList = data.territories
      // console.log(this.rootList)
      // this.pageInfo.total = data.total
    },
    async doCreateArea () {
      await createArea({
        code: this.formValidate.mail,
        memo: this.formValidate.desc,
        name: this.formValidate.name
      })
      this.doGetArea()
    },
    async writeAreaOk (id) {
      id = this.curryTypeId
      await modifyArea(id, {
        code: this.mail,
        memo: this.desc,
        name: this.name
      })
      this.doGetArea()
    },
    async deleteAreaOne () {
      await deleteArea(this.curryTypeId)
      this.doGetArea()
    },
    async getSearchdata () {
      this.doFindTerritories({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async getRegions () {
      const result = await findRegions()
      const { data } = result.data
      this.areaList = data.regions.map((elm,index) => {
        const params = {
          label: elm.regionName,
          value: elm._id,
          code: elm.regionCode,
          children: [],
          loading: false
        }
        // this.provinceCode = params.code
        // console.log(this.provinceCode)
        return params
      })
      console.log('areaList', this.areaList)
    },
    async change (params, isSecondLevel) {
      const result = await findRegions(params)
      const { data } = result.data
      this.childNode = data.regions.map((elm, index) => {
        const children = {
          label: elm.regionName,
          value: elm._id,
          code: elm.regionCode,
          parentCode: params.parentCode
        }
        if (!isSecondLevel) {
          Object.assign(children, { children: [], loading: false })
        }
        return children
      })
      return this.childNode
    },
    async loadData (item, callback) {
      item.loading = true
      const childNode = await this.change({
        parentCode: item.code
      }, item.parentCode)
      console.log(item)
      this.provinceCode = item.code
      console.log(this.provinceCode)
      item.children = childNode
      item.loading = false
      callback()
    },
    async doDeleteArea (row) {
      await deleteTerritory(row._id)
      this.doFindTerritories({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async curryClickArea (row) {
      this.areaDetails = true
      this.curryClick = row
      console.log(row)
      this.areaName = this.curryClick.provinceName + ' / ' + this.curryClick.cityName + ' / ' + this.curryClick.districtName
      // console.log(this.areaList)
    },
    test (array) {
      return array.reduce((acc, curr) => {
        if (this.value1.includes(curr.code)) {
          acc.push(curr)
        }
        return acc.concat(curr.children && curr.children.length ? this.test(curr.children) : [])
      }, [])
    },
    changeArea (value, selectedData) {
      this.selectedData1 = selectedData
      console.log(selectedData)
    },
    async writeAreaDetails () {
      this.writeDetails = true
      const rootNode = {
        label: this.curryClick.provinceName,
        value: '',
        code: this.curryClick.provinceCode,
        parentCode: ''
      }
      await this.loadData(rootNode, () => {})
      const cityNode = rootNode.children.find(elm => elm.code === this.curryClick.cityCode)
      await this.loadData(cityNode, () => {})
      const districtNode = cityNode.children.find(elm => elm.code === this.curryClick.districtCode)
      this.areaList.forEach(elm => {
        if (elm.code === rootNode.code) {
          console.log(elm)
          rootNode.value = elm.value
          elm.children = rootNode.children
        }
      })
      this.value2 = [rootNode.value, cityNode.value, districtNode.value]
      console.log(rootNode, this.areaList)
      this.selectedData1 = []
    },
    async addAreaOk () {
      await createTerritory({
        areaId: this.curryTypeId,
        cityCode: this.selectedData1[1].code,
        cityName: this.selectedData1[1].label,
        districtCode: this.selectedData1[2].code,
        districtName: this.selectedData1[2].label,
        memo: this.formValidate.memo,
        provinceCode: this.selectedData1[0].code,
        provinceName: this.selectedData1[0].label
      })
      this.doFindTerritories({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async writeDetailsOk () {
      console.log(this.selectedData1)
      if (this.selectedData1.length === 0) {
        this.$Message.error('参数不正确')
      } else {
        this.$Message.success('修改成功')
        await modifyTerritory(this.curryClick._id, {
          areaId: this.curryTypeId,
          cityCode: this.selectedData1[1].code,
          cityName: this.selectedData1[1].label,
          districtCode: this.selectedData1[2].code,
          districtName: this.selectedData1[2].label,
          memo: this.curryClick.memo,
          provinceCode: this.selectedData1[0].code,
          provinceName: this.selectedData1[0].label
        })
        this.doFindTerritories({
          page: this.pageInfo.page,
          count: this.pageInfo.size,
          areaId: this.curryTypeId
        })
      }
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
