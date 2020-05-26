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
               <Button type="success" @click="addTaskData">添加</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="taskList">
            <template slot-scope="{ row,index }" slot="action">
             <Button type="primary" size="small" style="margin-right: 5px" :disabled=row.isAble @click="btnChange(row)">标记完成</Button>
             <Button type="warning" size="small" style="margin-right: 5px" @click="resultDetails(row)">普查结果</Button>
             <Button type="info" size="small" style="margin-right: 5px" @click="curryClickRow(row)">详情</Button>
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
    v-model="addTask"
    title="添加学校"
    @on-ok="addTaskOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="任务名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="任务代码" prop="mail">
            <Input v-model="formValidate.mail" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="优惠卷" prop="coupon">
          <Select v-model="formValidate.coupon" multiple>
           <Option v-for="item in couponList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属学校" prop="school">
          <Select v-model="formValidate.school">
           <Option v-for="item in schoolList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="参与普查人员" prop="people">
          <Select v-model="formValidate.people" multiple>
           <Option v-for="item in peopleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
         <FormItem label="开始结束日期" prop="date">
           <DatePicker type="daterange" placement="bottom-end" format="yyyy-MM-dd" placeholder="Select date" style="width: 100%" v-model="formValidate.date"></DatePicker>
        </FormItem>
         <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
    <Modal
        v-model="taskDetails"
        title="查看所有小屋"
        ok-text="编辑"
        @on-ok="taskDetailsOk">
      <p>任务名称：{{this.curryClick.name}}</p>
      <p>任务代码：{{this.curryClick.code}}</p>
      <p>优惠卷：{{this.curryClick.coupon}}</p>
      <p>所属学校：{{this.curryClick.schoolName}}</p>
      <p>参与普查专员：{{this.curryClick.doctorName}}</p>
      <p>开始-结束日期：{{this.curryClick.startTime + ' - ' + this.curryClick.endTime}}</p>
      <p>备注：{{this.curryClick.memo}}</p>
    </Modal>
     <Modal
    v-model="writeTaskDetails"
    title="编辑普查任务"
    @on-ok="writeTaskDetailsOk"
   >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="所属区域" prop="name">
            <Input v-model="name" disabled></Input>
        </FormItem>
        <FormItem label="任务名称" prop="name">
            <Input v-model="curryClick.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="任务代码" prop="mail">
            <Input v-model="curryClick.code" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="优惠卷" prop="coupon">
          <Select v-model="myCouponId" multiple>
           <Option v-for="item in couponList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="所属学校" prop="school">
          <Select v-model="mySchool">
           <Option v-for="item in schoolList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="参与普查人员" prop="people">
          <Select v-model="myDoctorIds" multiple>
           <Option v-for="item in peopleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
         <FormItem label="开始结束日期" prop="date">
           <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 100%" v-model="myDate"></DatePicker>
        </FormItem>
         <FormItem label="备注" prop="desc">
            <Input v-model="curryClick.memo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
    </Form>
    </Modal>
  </div>
</template>
<script>
import { findAreas } from '@/api/application-center/area-center.js'
import { surveyMissionList, modifySurveyMission, deleteMission, getAllCoupons, createSurveyMission, findSchoolsByArea, findDoctorsByArea } from '@/api/daliy-operation/task.js'
export default {
  created () {
    this.doGetTask()
  },
  data () {
    return {
      areaTree: [],
      taskList: [],
      couponList: [],
      schoolList: [],
      peopleList: [],
      mySchool: '',
      myCouponId: [],
      myDoctorIds: [],
      myDate: [],
      name: '',
      writeTaskDetails: false,
      addTask: false,
      taskDetails: false,
      taskId: '',
      // isAble: true,
      curryTypeId: '',
      curryClick: {},
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
          title: '开始日期',
          key: 'startTime'
        },
        {
          title: '结束日期',
          key: 'endTime'
        },
        {
          title: '学校名称',
          key: 'schoolName'
        },
        {
          title: '参与普查专员',
          key: 'doctorName'
        },
        {
          title: '任务名称',
          key: 'name'
        },
        {
          title: '任务代码',
          key: 'code'
        },
        {
          title: '优惠卷',
          key: 'coupon'
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
        coupon: [],
        school: '',
        people: [],
        date: []
      },
      ruleValidate: {
        name: [
          { required: true, message: '资源名称为必填项', trigger: 'blur'}
        ],
        mail: [
          { required: true, message: '编号为6-20位字符', trigger: 'blur' },
          { pattern: '^[0-9a-zA-Z]{6,20}$', message: '请输入英文或数字编号' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '请输入正确手机号（不能有空字符）' }
        ],
        coupon: [{ required: true, message: '资源名称为必填项', trigger: 'blur'}],
        school: [{ required: true }],
        people: [{ required: true }],
        date: [{ required: true }]
      },
    }
  },
  methods: {
    async doGetTask () {
      const result = await findAreas()
      const { data } = result.data
      console.log(data)
      // this.getRegions()
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
      this.doTask({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async doTask (params) {
      if (this.keyWord) { Object.assign(params, { keyWord: this.keyWord }) }
      const result = await surveyMissionList(params)
      const { data } = result.data
      this.taskList = data.list.map((elm, index) => {
        const params = {
          ...elm,
          isAble: elm.businessStatus === 3 ? true : false,
          status1: elm.businessStatus === 3 ? '已完成' : '执行中',
          startTime: elm.startTime.slice(0, 10),
          endTime: elm.endTime.slice(0, 10),
          schoolName: elm.schoolId.schoolName,
          doctorName: elm.doctorIds.map((elm, index) => {
            const params = {
              name: elm.doctorName
            }
            return params.name
          }).toString(),
          coupon: elm.couponId.map((elm, index) => {
            const params = {
              name: elm.title
            }
            return params.name
          }).toString()
        }
        return params
      })
      // console.log(this.rootList)
      this.pageInfo.total = data.total
    },
    async btnChange (row) {
      this.$Message.success('修改状态成功')
      this.curryClick = row
      this.taskId = row._id
      row.isAble = true
      await modifySurveyMission(this.taskId)
      this.doTask({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async getSearchdata () {
      this.doTask({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
      this.pageInfo.total = data.total
    },
    async addTaskData () {
      this.addTask = true
      const result = await getAllCoupons()
      const { data } = result.data
      this.couponList = data.coupons.map((elm, index) => {
        const params = {
          value: elm._id,
          label: elm.title
        }
        return params
      })
      this.schools()
      this.peoples()
    },
    async schools () {
      const schoolRes = await findSchoolsByArea({
        areaId: this.curryTypeId
      })
      const { data } = schoolRes.data
      this.schoolList = data.schools.map((elm, index) => {
        const params = {
          value: elm._id,
          label: elm.schoolName
        }
        return params
      })
    },
    async peoples () {
      const schoolRes = await findDoctorsByArea({
        areaId: this.curryTypeId
      })
      const { data } = schoolRes.data
      this.peopleList = data.doctors.map((elm, index) => {
        const params = {
          value: elm._id,
          label: elm.doctorName
        }
        return params
      })
    },
    async addTaskOk () {
      console.log(this.formValidate.date)
      await createSurveyMission({
        areaId: this.curryTypeId,
        code: this.formValidate.mail,
        couponIds: this.formValidate.coupon,
        doctorIds: this.formValidate.people,
        endTime: new Date(this.formValidate.date[1]).getTime(),
        memo: this.formValidate.desc,
        name: this.formValidate.name,
        schoolId: this.formValidate.school,
        startTime: new Date(this.formValidate.date[0]).getTime()
      })
      this.doTask({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doTask({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doTask({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async resultDetails (row) {
      this.$router.push('/survey_result?surveyId=' + row._id + '&surveyName=' + row.name + '&surveyMemo=' + row.memo)
      console.log(row._id)
      //  hideInMenu: false
    },
    async curryClickRow (row) {
      this.taskDetails = true
      this.curryClick = row
      console.log(row)
      // this.qrcode1 = row.birthTime
      // this.addTaskData()
      const result = await getAllCoupons()
      const { data } = result.data
      this.couponList = data.coupons.map((elm, index) => {
        const params = {
          value: elm._id,
          label: elm.title
        }
        return params
      })
      this.schools()
      this.peoples()
    },
    async taskDetailsOk () {
      this.writeTaskDetails = true
      this.myCouponId = this.curryClick.couponId.map((elm, index) => {
        const params = {
          id: elm._id
        }
        return params.id
      })
      this.mySchool = this.curryClick.schoolId._id
      this.myDoctorIds = this.curryClick.doctorIds.map((elm, index) => {
        const params = {
          id: elm._id
        }
        return params.id
      })
      let date1 = new Date(this.curryClick.startTime)
      let date2 = new Date(this.curryClick.endTime)
      console.log(date1,date2)
      this.myDate = [date1, date2]
    },
    async writeTaskDetailsOk () {
      await createSurveyMission({
        areaId: this.curryTypeId,
        code: this.curryClick.code,
        couponIds: this.myCouponId,
        doctorIds: this.myDoctorIds,
        endTime: new Date(this.myDate[1]).getTime(),
        memo: this.curryClick.memo,
        name: this.curryClick.name,
        schoolId: this.mySchool,
        startTime: new Date(this.myDate[0]).getTime(),
        surveyMissionId: this.curryClick._id
      })
      this.doTask({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
      })
    },
    async doDeleteArea (row) {
      console.log(row)
      await deleteMission(row._id)
      this.doTask({
        page: this.pageInfo.page,
        count: this.pageInfo.size,
        areaId: this.curryTypeId
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
