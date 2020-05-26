<template>
  <div>
    <Row>
       <i-col span="6" offset="4">
          <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" v-model="date1"></DatePicker>
       </i-col>
       <i-col span="10">
         <Input search enter-button="搜索" placeholder="请按查询语法输入..." v-model="keyWord" @on-search="getSearchdata"/>
      </i-col>
    </Row>

      <Row>
        <i-col v-for="(item, index) in logsList" :key="index" style="margin: 10px 0">
          <Card> {{item}}</Card>
         </i-col>
      </Row>
  </div>
</template>

<script>
import { getLogs } from '@/api/getLogs/getLogs.js'
export default {
  name: 'error_store_page',
  created () {
    this.doGetLogs({
      from: this.date[0],
      to: this.date[1]
    })
  },
  data () {
    return {
      logsList: [],
      date: [1587916800000, 1587970548808],
      date1: [],
      keyWord: ''
    }
  },
  methods: {
    async doGetLogs (params) {
      this.date1 = [new Date(this.date[0]), new Date(this.date[1])]
      console.log(this.date1)
      if (this.keyWord) { Object.assign(params, { query: this.keyWord }) }
      const result = await getLogs(params)
      const { data } = result.data
      this.logsList = data.logs
    },
    getSearchdata () {
      this.doGetLogs({
        from: new Date(this.date1[0]).getTime(),
        to: new Date(this.date1[1]).getTime()
      })
    }
  }
}
</script>

<style>

</style>
