<template>
 <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col class-name="children-box">
        <Card>
          <div class="title">
            <i-col>
              <h3 style="text-align: center;">普查任务名称：{{name}}</h3>
            </i-col>
          </div>
        </Card>
      </i-col>
      <i-col class-name="children-box">
        <Card>
          <p slot="title">
              普查统计数据
          </p>
          <a href="#" slot="extra" @click.prevent="refresh">
            <Tooltip content="手动刷新">
               <Icon type="md-refresh" style="fontSize: 20px; marginRight: 10px"></Icon>
            </Tooltip>
          </a>
          <a href="#" slot="extra" @click.prevent="timer=true">
             <Tooltip content="定时刷新">
               <Icon type="ios-time" style="fontSize: 20px"></Icon>
            </Tooltip>
          </a>
          <Alert style="text-align: center">
            <Tag color="primary">刷新时间：{{date}}</Tag>
            <Tag color="default" v-if="show">
              <a href="#" @click.prevent="timer=true;" style="color: black">定时刷新：关</a>
            </Tag>
            <Tag color="success" ref="time2" v-if="show1">
              <a href="#" @click.prevent="refreshOff">定时刷新：开</a>
            </Tag>
            <Tag color="warning" ref="time1" v-if="show1">定时刷新间隔：{{time/60000}}分钟</Tag>
          </Alert>
          <Row type="flex" justify="space-between" style="height: 120px; padding: 20px 0">
             <i-col span="3" style="text-align: center; border-right: 1px solid #ccc; padding: 20px 0">
              <h3>待普查学生总数</h3>
              <span style="font-size: 20px; font-weight: bold">{{refresha.total}}</span>
            </i-col>
             <i-col span="4" style="text-align: center; border-right: 1px solid #ccc; padding: 20px 0">
              <h3>已有过检查项的学生总数</h3>
              <span style="font-size: 20px; font-weight: bold">{{refresha.haveCheckedCount}}</span>
            </i-col>
             <i-col span="4" style="text-align: center; border-right: 1px solid #ccc; padding: 20px 0">
              <h3>已全部检查完成的学生总数</h3>
              <span style="font-size: 20px; font-weight: bold">{{refresha.checkCompleteCount}}</span>
            </i-col>
             <i-col span="3" style="text-align: center; border-right: 1px solid #ccc; padding: 20px 0">
              <h3>在检/漏检学生总数</h3>
              <span style="font-size: 20px; font-weight: bold">{{refresha.checkingOrMissed}}</span>
            </i-col>
             <i-col span="3" style="text-align: center; border-right: 1px solid #ccc; padding: 20px 0">
              <h3>方案未匹配的数量</h3>
              <span style="font-size: 20px; font-weight: bold">{{refresha.unmatchedCount}}</span>
            </i-col>
             <i-col span="3" style="text-align: center; border-right: 1px solid #ccc; padding: 20px 0">
              <h3>方案匹配成功的数据</h3>
              <span style="font-size: 20px; font-weight: bold">{{refresha.successMatchedCount}}</span>
            </i-col>
             <i-col span="3" style="text-align: center; padding: 20px 0">
              <h3>方案匹配失败的数据</h3>
              <span style="font-size: 20px; font-weight: bold">{{refresha.failMatchedCount}}</span>
            </i-col>
          </Row>
        </Card>
      </i-col>
      <!-- <i-col class-name="children-box">
        <Card>
          <div class="title">
            <i-col span="13">
              <h3>普查数据</h3>
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
          <Page :current="pageInfo.page" :pageSize="pageInfo.size" :total="pageInfo.total" @on-change="onPageChange" on-page-size-change="onPageSizeChange(size)" show-total/>
        </Card>
      </i-col> -->
    <Modal
      v-model="timer"
      title="定时刷新"
      @on-ok="timerOk">
      <h4>请选择定时刷新的时间：</h4>
     <Select v-model="time" style="margin: 10px 0">
        <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    </Modal>
    </Row>
  </div>
</template>
<script>
import { surveyStudentStatistics } from '@/api/daliy-operation/survey_result.js'
export default {
  created () {
    this.doGetBooking()
  },
  data () {
    return {
      name: '',
      keyWord: '',
      surveyId: '',
      refresha: {},
      date: '',
      onOff: '关',
      sl1: {},
      time: '',
      timer: false,
      show: true,
      show1: false,
      timeList: [
        {
          value: '300000',
          label: '5分钟'
        },
        {
          value: '900000',
          label: '15分钟'
        },
        {
          value: '1800000',
          label: '30分钟'
        }
      ],
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
      this.name = theRequest.surveyName
      this.surveyId = theRequest.surveyId
    },
    async refresh () {
      const result = await surveyStudentStatistics(this.surveyId)
      const { data } = result.data
      console.log(data)
      this.refresha = data
      this.getNowFormatDate()
    },
    getNowFormatDate () {
      var date = new Date()
      var seperator1 = '-'
      var seperator2 = ':'
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      var h = date.getHours()
      var m = date.getMinutes()
      var s = date.getSeconds()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (h >= 0 && h <= 9) {
        h = '0' + h
      }
      if (m >= 0 && m <= 9) {
        m = '0' + m
      }
      if (s >= 0 && s <= 9) {
        s = '0' + s
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + h + seperator2 + m + seperator2 + s
      console.log(currentdate)
      this.date = currentdate
      return currentdate
    },
    async timerOk () {
      if (this.time === '') {
        this.$Message.error('请输入有效时间段，不能为空!')
      } else {
        this.$Message.success('设置成功，已设置为' + this.time / 60000 + '分钟')
        this.show = false
        this.show1 = true
        console.log(this.time)
        this.sl1 = setInterval(() => {
          this.refresh()
        }, 2000)
      }
    },
    async refreshOff () {
      this.show = true
      this.show1 = false
      clearInterval(this.sl1)
    }
  }
}
</script>
<style>
.children-box {
  margin-bottom: 20px
}
</style>
