<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="10">
              <h3>运营区域树</h3>
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
               <Button type="success" @click="addCommissioner=true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="commissionerList">
            <template slot-scope="{ row,index }" slot="action">
             <Button type="primary" size="small" style="margin-right: 5px" @click="curryClickRow(row)">详情</Button>
            <Poptip
                confirm
                title="您确定删除这条内容吗？"
                @on-ok="doDeleteArea(row)"
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
    v-model="addCommissioner"
    title="添加学校"
    @on-ok="addCommissionerOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="所属地区" prop="area">
           <Cascader :data="areaList" v-model="formValidate.area" change-on-select :load-data="loadData" @on-change="changeArea"></Cascader>
        </FormItem>
        <FormItem label="普查专员名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="普查专员手机号" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
    v-model="commissionerDetails"
    title="医院详情"
    ok-text="编辑"
    @on-ok="commissionerDetailsOk">
        <p><span>所属地区:</span>{{this.allName}}</p>
        <p><span>医院名称:</span>{{this.curryClick.doctorName}}</p>
        <p><span>联系方式:</span>{{this.curryClick.phone}}</p>
        <p><span>备注:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeCommissionerDetail"
    title="编辑医院"
    @on-ok="writeCommissionerDetailOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="所属地区" prop="area">
           <Cascader :data="areaList" v-model="value2" change-on-select :load-data="loadData" @on-change="changeArea"></Cascader>
        </FormItem>
        <FormItem label="普查人员名称" prop="name">
            <Input v-model="curryClick.doctorName" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="联系电话" prop="phone">
            <Input v-model="curryClick.phone" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { findAreas, findRegions } from '@/api/application-center/area-center.js'
import { findDoctors, searchDoctors, createDoctor, modifyDoctor, deleteDoctor } from '@/api/daliy-operation/commissioner.js'
export default {
  created () {
    this.doGetCommissioner()
  },
  data () {
    return {
      areaTree: [],
      areaList: [],
      selectedData1: [],
      curryClick: {},
      value2: [],
      name: '',
      keyWord: '',
      allName: '',
      curryTypeId: '',
      addCommissioner: false,
      commissionerDetails: false,
      writeCommissionerDetail: false,
      formValidate: {
        name: '',
        desc: '',
        area: [],
        phone: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '请输入正确手机号（不能有空字符）' }
        ],
        area: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ]
        // desc: [
        //   {required: false }
        // ]
      },
      columns1: [
        {
          title: '#',
          type: 'index'
        },
        {
          title: '省份名称',
          key: 'provinceName'
        },
        {
          title: '城市名称',
          key: 'cityName'
        },
        {
          title: '地区名称',
          key: 'districtName'
        },
        {
          title: '普查专员名称',
          key: 'doctorName'
        },
        {
          title: '普查专员手机号',
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
      commissionerList: []
    }
  },
  methods: {
    async doGetCommissioner () {
      const result = await findAreas()
      const { data } = result.data
      this.getRegions()
      this.areaTree = data.areas.map((elm, index) => {
        const params = {
          id: elm._id,
          title: elm.name,
          selected: false
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
      // this.mail = selNode.number
      // this.desc = selNode.desc
      this.doCommissioner({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async doCommissioner (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await findDoctors(params)
      const { data } = result.data
      this.commissionerList = data.doctors.map((elm, index) => {
        const params = {
          ...elm
          // coordinates: elm.location,
          // businessTime: JSON.stringify(elm.businessTime)
        }
        return params
      })
      // console.log(this.rootList)
      this.pageInfo.total = data.total
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doCommissioner({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doCommissioner({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async getSearchdata () {
      const result = await searchDoctors({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        keywords: this.keyWord
      })
      const { data } = result.data
      this.commissionerList = data.doctors.map((elm, index) => {
        const params = {
          ...elm
          // coordinates: elm.location,
          // businessTime: JSON.stringify(elm.businessTime)
        }
        return params
      })
    },
    async getRegions () {
      const result = await findRegions({
        open: true
      })
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
      console.log(this.areaList)
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
        parentCode: item.code,
        open: true
      }, item.parentCode)
      console.log(item)
      this.provinceCode = item.code
      console.log(this.provinceCode)
      item.children = childNode
      item.loading = false
      callback()
    },
    changeArea (value, selectedData) {
      this.selectedData1 = selectedData
      // console.log(this.selectedData1[0].label)
      console.log(selectedData)
    },
    async addCommissionerOk () {
      await createDoctor({
        areaId: this.curryTypeId,
        cityCode: this.selectedData1[1].code,
        cityName: this.selectedData1[1].label,
        districtCode: this.selectedData1[2].code,
        districtName: this.selectedData1[2].label,
        doctorName: this.formValidate.name,
        phone: this.formValidate.phone,
        provinceCode: this.selectedData1[0].code,
        provinceName: this.selectedData1[0].label,
        memo: this.formValidate.desc
      })
      this.doCommissioner({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async curryClickRow (row) {
      this.commissionerDetails = true
      this.curryClick = row
      console.log(row)
      this.allName = row.provinceName + ' / ' + row.cityName + ' / ' + row.districtName
    },
    async commissionerDetailsOk () {
      this.writeCommissionerDetail = true
      // this.getRegions()
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
          // console.log(elm)
          rootNode.value = elm.value
          elm.children = rootNode.children
        }
      })
      this.value2 = [rootNode.value, cityNode.value, districtNode.value]
      this.selectedData1 = []
    },
    async doDeleteArea (row) {
      console.log(row)
      await deleteDoctor(row._id)
      this.doCommissioner({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async writeCommissionerDetailOk () {
      if (this.selectedData1.length === 0) {
        const result = await modifyDoctor(this.curryClick._id, {
          areaId: this.curryTypeId,
          cityCode: this.curryClick.cityCode,
          cityName: this.curryClick.cityName,
          districtCode: this.curryClick.districtCode,
          districtName: this.curryClick.districtName,
          memo: this.curryClick.memo,
          provinceCode: this.curryClick.provinceCode,
          provinceName: this.curryClick.provinceName,
          doctorName: this.curryClick.doctorName,
          phone: this.curryClick.phone
        })
        if (result.data.code !== 1) {
          this.$Message.error('出错了')
        } else {
          this.$Message.success('修改成功')
          this.doCommissioner({
            page: this.pageInfo.page,
            count: this.pageInfo.size,
            areaId: this.curryTypeId
          })
        }
      } else {
        const result = await modifyDoctor(this.curryClick._id, {
          areaId: this.curryTypeId,
          cityCode: this.selectedData1[1].code,
          cityName: this.selectedData1[1].label,
          districtCode: this.selectedData1[2].code,
          districtName: this.selectedData1[2].label,
          memo: this.curryClick.memo,
          provinceCode: this.selectedData1[0].code,
          provinceName: this.selectedData1[0].label,
          doctorName: this.curryClick.doctorName,
          phone: this.curryClick.phone
        })
        if (result.data.code !== 1) {
          this.$Message.error('出错了')
        } else {
          this.$Message.success('修改成功')
          this.doCommissioner({
            page: this.pageInfo.page,
            count: this.pageInfo.size,
            areaId: this.curryTypeId
          })
        }
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
.amap-wrapper {
  width: 500px;
  height: 500px;
}
 .amap-demo {
      height: 300px;
    }

    .search-box {
      position: absolute;
      top: 25px;
      left: 20px;
    }

    .amap-page-container {
      position: relative;
    }
</style>
