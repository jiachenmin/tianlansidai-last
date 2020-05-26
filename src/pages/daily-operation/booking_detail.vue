<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col class-name="children-box">
        <Card>
          <div class="title">
            <i-col>
              <h3 style="text-align: center;">医院名称：{{hospitalName}}</h3>
            </i-col>
          </div>
        </Card>
      </i-col>
      <i-col class-name="children-box">
        <Card>
          <div class="title">
            <i-col span="13">
              <h3>医院预约数据</h3>
            </i-col>
            <i-col span="8">
              <Input search enter-button="搜索" placeholder="请输入你要搜索的内容..." v-model="keyWord" />
            </i-col>
            <i-col>
              <Button type="success">返回</Button>
            </i-col>
          </div>
          <Divider />
          <Table :columns="columns1" border :data="childrenList">
            <template slot-scope="{ row,index }" slot="action">
             <Button type="primary" size="small" style="margin-right: 5px" @click="curryClickRow(row)">查看孩子二维码</Button>
            </template>
          </Table>
          <!-- <Page :current="pageInfo.page" :pageSize="pageInfo.size" :total="pageInfo.total" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)" show-total/> -->
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  created () {
    this.doGetBooking()
  },
  data () {
    return {
      hospitalName: '',
      keyWord: '',
      childrenList: [],
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
          title: '学校名称',
          key: 'schoolName'
        },
        {
          title: '年级',
          key: 'identityCode'
        },
        {
          title: '班级',
          key: 'identityCode'
        },
        {
          title: '家长号码',
          key: 'identityCode'
        },
        {
          title: '预约日期',
          key: 'city'
        },
        {
          title: '预约时间段',
          key: 'birthTime'
        },
        {
          title: '备注',
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
    async doGetBooking () {
      var url = location.search
      console.log(url)
      var theRequest = new Object()
      if (url.indexOf('?') !== -1) {
        var str = url.substr(1)
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
        }
        console.log(theRequest)
      }
      this.hospitalName = theRequest.hospitalName
    }
  }
}
</script>
<style>
.children-box {
  margin-bottom: 20px;
}
</style>
