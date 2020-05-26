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
             <i-col span="8">
               <Button type="success" @click="getAllHospatil=true">查看所有医院</Button>
            </i-col>
            <i-col>
               <Button type="success" @click="addSchool=true">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="schoolsList">
            <template slot-scope="{ row,index }" slot="action">
             <Button type="primary" size="small" style="margin-right: 5px" @click="curryClickRow(row)">详情</Button>
             <Button type="info" size="small" style="margin-right: 5px" @click="leading=true">导入年级与班级</Button>
            <Poptip
                confirm
                title="您确定删除这条内容吗？"
                @on-ok="doDeleteArea(row)"
                transfer>
                <Button type="error" size="small">删除</Button>
            </Poptip>
            </template>
          </Table>
          <Page :current="pageInfo.page" :pageSize="pageInfo.size" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)"/>
        </Card>
      </i-col>
    </Row>
    <Modal
    v-model="addSchool"
    title="添加学校"
    @on-ok="addSchoolOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="所属地区" prop="area">
           <Cascader :data="areaList" v-model="formValidate.area" change-on-select :load-data="loadData" @on-change="changeArea"></Cascader>
        </FormItem>
        <FormItem label="学校名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="学校类型" prop="schoolType">
          <Select v-model="formValidate.schoolType">
           <Option value="小学">小学</Option>
           <Option value="中学">中学</Option>
           <Option value="综合院校">综合院校</Option>
          </Select>
        </FormItem>
        <FormItem label="学校代码" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="学校位置" prop="mail" v-model="formValidate.place">
           <Button type="success" @click="searchSchool=true" style="float: left">点击搜索学校位置</Button>
           <span style="float: left; display: none" ref="place">{{x}},{{y}}</span>
        </FormItem>
        <FormItem label="班级信息" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="getAllHospatil"
        title="查看所有小屋">
        <div class="amap-wrapper">
          <el-amap class="amap-box" :vid="'amap-vue'" :zoom="zoom" :center="center" >
            <el-amap-marker v-for="(marker, index) in markers" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
          </el-amap>
        </div>
    </Modal>
    <Modal
        v-model="searchSchool"
        title="查看所有小屋"
        @on-ok="searchSchoolOk">
      <div>
        <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" class="amap-demo">
        <el-amap-marker v-for="marker in markerss" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
        </el-amap>
        </div>
      </div>
    </Modal>
    <Modal
        v-model="leading"
        title="请导入年级与班级">
     <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="①.请选择单个文件" prop="name">
         <Upload
          ref="upload"
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/"
          name="excel-file"
          :show-upload-list="true"
          :on-format-error="handleFormatError"

          :format ="['xlsx','xls']">
             <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>拖动单个文件到这里</p>
             </div>
        </Upload>
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
    v-model="schoolDetails"
    title="学校详情"
    ok-text="编辑"
    @on-ok="schoolDetailsOk">
        <p><span>所属地区:</span>{{this.allName}}</p>
        <p><span>学校名称:</span>{{this.curryClick.schoolName}}</p>
        <p><span>学校类型:</span>{{this.curryClick.content}}</p>
        <p><span>学校代码:</span>{{this.curryClick.schoolCode}}</p>
        <p><span>学校位置:</span>{{this.curryClick.coordinates}}</p>
        <p><span>班级信息:</span>{{this.curryClick.memo}}</p>
    </Modal>
    <Modal
    v-model="writeSchoolDetails"
    title="编辑方案"
    @on-ok="writeSchoolDetailsOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="所属地区" prop="area">
           <Cascader :data="areaList" v-model="value2" change-on-select :load-data="loadData" @on-change="changeArea"></Cascader>
        </FormItem>
        <FormItem label="学校名称" prop="name">
            <Input v-model="curryClick.schoolName" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="学校类型" prop="schoolType">
          <Select v-model="schoolType">
           <Option value="小学">小学</Option>
           <Option value="中学">中学</Option>
           <Option value="综合院校">综合院校</Option>
          </Select>
        </FormItem>
        <FormItem label="学校代码" prop="mail">
            <Input v-model="curryClick.schoolCode" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="学校位置" prop="mail" v-model="curryClick.coordinates">
           <Button type="success" @click="searchSchool=true" style="float: left">点击搜索学校位置</Button>
           <span style="float: left;" ref="place">{{x}},{{y}}</span>
        </FormItem>
        <FormItem label="班级信息" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { findAreas, findRegions } from '@/api/application-center/area-center.js'
import { findSchools, searchSchools, deleteSchool, modifySchool, createSchool } from '@/api/daliy-operation/school.js'
export default {
  created () {
    this.doGetArea()
  },
  data () {
    return {
      areaTree: [],
      curryClick: {},
      value3: [],
      value4: [],
      createArea: false,
      getAllHospatil: false,
      searchSchool: false,
      leading: false,
      schoolDetails: false,
      selectedData1: [],
      value2: [],
      writeSchoolDetails: false,
      name: '',
      kk: '',
      schoolType: '',
      allName: '',
      x: 0,
      y: 0,
      keyWord: '',
      areaList: [],
      zoom: 5,
      center: [117.236093, 38.923706],
      addSchool: false,
      schoolsList: [],
      markers: [
        {
          position: [117.236093, 38.923706],
          events: {
            click: () => {
              alert('click marker')
            },
            dragend: (e) => {
              console.log('---event---: dragend')
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
            }
          },
          visible: true,
          draggable: false,
          template: '<span>1</span>'
        },
        {
          position: [117.236093, 37.923706],
          events: {
            click: () => {
              alert('click marker')
            },
            dragend: (e) => {
              console.log('---event---: dragend')
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
            }
          },
          visible: true,
          draggable: false,
          template: '<span>1</span>'
        },
        {
          position: [117.236093, 36.923706],
          events: {
            click: () => {
              alert('click marker')
            },
            dragend: (e) => {
              console.log('---event---: dragend')
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
            }
          },
          visible: true,
          draggable: false,
          template: '<span>1</span>'
        }
      ],
      markerss: [],
      searchOption: {
        city: '上海',
        citylimit: false
      },
      mapCenter: [121.59996, 31.197646],
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
          title: '学校代码',
          key: 'schoolCode'
        },
        {
          title: '学校名称',
          key: 'schoolName'
        },
        // {
        //   title: '学校类型',
        //   key: 'districtName'
        // },
        {
          title: '位置',
          key: 'coordinates'
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
        area: [],
        place: '',
        schoolType: ''
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
        schoolType: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
      },
    }
  },
  methods: {
    async doGetArea () {
      const result = await findAreas()
      const { data } = result.data
      console.log(data)
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
      // this.getRegions()
    },
    changeArea (value, selectedData) {
      this.selectedData1 = selectedData
      // console.log(this.selectedData1[0].label)
      console.log(selectedData)
    },
    async getAtherData (selArr, selNode) {
      this.curryTypeId = selNode.id
      // console.log(this.curryTypeId)
      this.name = selNode.title
      // this.mail = selNode.number
      // this.desc = selNode.desc
      this.doGetSchools({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async doGetSchools (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await findSchools(params)
      const { data } = result.data
      this.schoolsList = data.schools.map((elm, index) => {
        const params = {
          ...elm,
          coordinates: elm.location.coordinates.toString()
        }
        return params
      })
      // console.log(this.rootList)
      this.pageInfo.total = data.total
    },
    async getSearchdata () {
      const result = await searchSchools({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        keywords: this.keyWord
      })
      const { data } = result.data
      this.schoolsList = data.schools.map((elm, index) => {
        const params = {
          ...elm,
          coordinates: elm.location.coordinates.toString()
          // status1: elm.isUse === 2 ? '已停用' : elm.businessStatus === 1 ? '新创建' : '已启用',
          // stype: elm.stype === 2 ? '开放题' : '选择题',
          // isMust: elm.isMust === 1 ? '是' : '否'
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetSchools({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetSchools({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
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
      // this.allName = item.label
      // console.log(this.allName)
      callback()
    },
    addMarker: function () {
      let lng = 121.5 + Math.round(Math.random() * 1000) / 10000
      let lat = 31.197646 + Math.round(Math.random() * 500) / 10000
      this.markers.push([lng, lat])
    },
    onSearchResult (pois) {
      let latSum = 0
      let lngSum = 0
      let x = 0
      let y = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi
          lngSum += lng
          latSum += lat
          const params = {
            position: [poi.lng, poi.lat],
            events: {
              click: (ev) => {
                // var list = ev.target.Uh.contentDom.parentNode.parentNode.children
                // for (var i= 0; i< list.length; i++) {
                //   list[i].innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png" alt="" style="width: 19px; height: 33px; top: 0px; left: 0px;">'
                // }
                console.log(ev)
                this.x = ev.lnglat.lat
                this.y = ev.lnglat.lng
                console.log(this.x,this.y)
                ev.target.Uh.contentDom.innerHTML = '<img src="http://webapi.amap.com/theme/v1.3/markers/b/mark_r.png" alt="" style="width: 19px; height: 33px; top: 0px; left: 0px;">'
              }
            },
            visible: true,
            draggable: false,
            template: '<span>1</span>'
          }
          this.markerss.push(params)
        })
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
      }
    },
    async addSchoolOk () {
      await createSchool({
        areaId: this.curryTypeId,
        cityCode: this.selectedData1[1].code,
        cityName: this.selectedData1[1].label,
        districtCode: this.selectedData1[2].code,
        districtName: this.selectedData1[2].label,
        latitude: this.x,
        longitude: this.y,
        memo: this.formValidate.desc,
        provinceCode: this.selectedData1[0].code,
        provinceName: this.selectedData1[0].label,
        schoolCode: this.formValidate.mail,
        schoolName: this.formValidate.name,
        schoolStage: this.formValidate.schoolType === '小学' ? 3 : this.formValidate.schoolType === '中学' ? 4 : 5
      })
      this.doGetSchools({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传.xls,.xlsx文件。'
      })
    },
    // handleSuccess(res,file){
    //     if(res.errcode === 0){
    //         this.dialoLead = false
    //         this.$Message.success("数据导入成功！")
    //         this._getBookList()
    //         this.$refs.upload.clearFiles()
    //     }
    // },
    // handleError(error,file){
    //     this.$Message.error("数据导入失败！")
    // },
    async curryClickRow (row) {
      this.schoolDetails = true
      this.curryClick = row
      console.log(row)
      this.allName = row.provinceName + ' / ' + row.cityName + ' / ' + row.districtName

    },
    async searchSchoolOk () {
      this.$refs.place.style.display = 'block'
    },
    async schoolDetailsOk () {
      this.writeSchoolDetails = true
      this.schoolType = this.curryClick.schoolStage === 4 ? '中学' : this.curryClick.schoolStage === 3 ? '小学' : '综合院校'
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
      // console.log(rootNode, this.areaList)
      this.selectedData1 = []
    },
    async doDeleteArea (row) {
      console.log(row)
      await deleteSchool(row._id)
      this.doGetSchools({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async writeSchoolDetailsOk () {
      if (this.selectedData1.length === 0) {
        this.$Message.success('修改成功')
        await modifySchool(this.curryClick._id, {
          areaId: this.curryTypeId,
          cityCode: this.curryClick.cityCode,
          cityName: this.curryClick.cityName,
          districtCode: this.curryClick.districtCode,
          districtName: this.curryClick.districtName,
          memo: this.curryClick.memo,
          provinceCode: this.curryClick.provinceCode,
          provinceName: this.curryClick.provinceName,
          latitude: this.x,
          longitude: this.y,
          schoolCode: this.curryClick.schoolCode,
          schoolName: this.curryClick.schoolName,
          schoolStage: this.curryClick.schoolStage
        })
        this.doGetSchools({
          page: this.pageInfo.page,
          count: this.pageInfo.size,
          areaId: this.curryTypeId
        })
      } else {
        this.$Message.success('修改成功')
        await modifySchool(this.curryClick._id, {
          areaId: this.curryTypeId,
          cityCode: this.selectedData1[1].code,
          cityName: this.selectedData1[1].label,
          districtCode: this.selectedData1[2].code,
          districtName: this.selectedData1[2].label,
          memo: this.curryClick.memo,
          provinceCode: this.selectedData1[0].code,
          provinceName: this.selectedData1[0].label,
          latitude: this.x,
          longitude: this.y,
          schoolCode: this.curryClick.schoolCode,
          schoolName: this.curryClick.schoolName,
          schoolStage: this.curryClick.schoolStage
        })
        this.doGetSchools({
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
