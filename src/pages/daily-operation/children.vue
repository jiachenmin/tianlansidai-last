<template>
   <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col class-name="children-box">
        <Card>
           <div class="title">
            <i-col span="8">
              <h3>孩子列表</h3>
            </i-col>
             <i-col span="16">
               <i-col span="10">
                  <Cascader :data="areaList" change-on-select></Cascader>
               </i-col>
               <i-col span="5">
                  <Cascader :data="schoolsList" change-on-select></Cascader>
               </i-col>
               <i-col span="7">
                  <Input search enter-button="搜索" placeholder="请输入你要搜索的内容..." v-model="keyWord"/>
               </i-col>
               <i-col span="2">
                  <Button type="success" @click="exportData">导出</Button>
               </i-col>
            </i-col>

          </div>
          <Divider />
          <Table :columns="columns1" border :data="childrenList" ref="table">
            <template slot-scope="{ row,index }" slot="action">
             <Button type="primary" size="small" style="margin-right: 5px" @click="curryClickRow(row)">查看孩子二维码</Button>
            </template>
          </Table>
          <Page :current="pageInfo.page" :pageSize="pageInfo.size" :total="pageInfo.total" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)" show-total/>
        </Card>
      </i-col>
    </Row>
    <Modal
        v-model="qrcode"
        title="查看所有小屋"
       >
      <div style="text-align: center">
        <p>学生姓名：{{this.curryClick.name}}</p>
        <p>学生编号：{{this.curryClick.identityCode}}</p>
       <qriously :value="qrcode1" :size="200" />

        </div>

    </Modal>
  </div>
</template>

<script>
import { listChild, listAllSchool } from '@/api/daliy-operation/children.js'
export default {
  created () {
    this.listAllSchool()
  },
  data () {
    return {
      keyWord: '',
      curryClick: {},
      childrenList: [],
      areaList: [],
      schoolsList: [],
      qrcode: false,
      qrcode1: '',
      columns1: [
        {
          title: '#',
          type: 'index'
        },
        {
          title: '学生姓名',
          key: 'name'
        },
        {
          title: '性别',
          key: 'gender'
        },
        {
          title: '学生编号',
          key: 'identityCode'
        },
        {
          title: '学校名称',
          key: 'schoolName'
        },
        {
          title: '所在城市',
          key: 'city'
        },
        {
          title: '生日',
          key: 'birthTime'
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
    }
  },
  methods: {
    async doGetChildren () {
      const result = await listChild({
        pageNum: this.pageInfo.page,
        pageSize: this.pageInfo.size
      })
      const { data } = result.data
      this.childrenList = data.list.map((elm, index) => {
        const params = {
          ...elm,
          gender: elm.gender === 1 ? '男' : '女',
          identityCode: elm.identityCode.slice(10),
          birthTime: elm.birthTime.slice(0, 10),
          schoolName: elm.schoolId.schoolName,
          city: elm.schoolId.provinceName + elm.schoolId.districtName + elm.schoolId.cityName
        }
        return params
      })
      this.pageInfo.total = data.total
    },
    onPageChange (page) {
      this.pageInfo.page = page
      console.log(page)
      // debugger
      this.doGetChildren()
    },
    onPageSizeChange (size) {
      this.pageInfo.size = size
      console.log(size)
      this.doGetChildren()
    },
    async listAllSchool () {
      const result = await listAllSchool()
      const { data } = result.data
      this.areaList = data.schoolsIndex
      // this.schoolsList = data.
      console.log(data)
      this.doGetChildren()
    },
    async curryClickRow (row) {
      this.qrcode = true
      this.curryClick = row
      console.log(row)
      this.qrcode1 = row.birthTime
    },
    exportData () {
      this.$refs.table.exportCsv({
        filename: 'my tableData'
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
.ivu-modal-body p{
  margin: 15px 100px;
  span{
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
}
}}
</style>
