<template>
  <div class="wrapper">
    <Row :gutter="10" class-name="user-center">
      <i-col span="6" class-name="left-box">
        <Card>
          <div class="title">
            <i-col span="8">
              <h3>用户组织树</h3>
            </i-col>
            <i-col span="8" offset="8">
              <Button type="success" class="pull-right" icon="md-add-circle" size="small" @click="createOrg">
                建组织
              </Button>
            </i-col>
          </div>
          <Divider />
          <div class="org-tree">
            <Tree class="org-list" :data="orgList" @on-select-change="selectNode"></Tree>
          </div>
        </Card>
      </i-col>
      <i-col span="18" class-name="right-box">
        <Card></Card>
      </i-col>
    </Row>
    <Modal v-model="orgModal.isShow" :title="orgModal.title" @on-ok="suerCreate('fromCreateOrg')">
      <Form :model="formItem" :label-width="80" ref="formItem" :rules="formItem.ruleValidate">
        <FormItem label="父组织：">
          <Cascader :data="orgModal.updatedList" v-model="formItem.parentOrg"></Cascader>
        </FormItem>
        <FormItem label="编号：" prop="cnNameRule">
          <Input v-model="formItem.enSerialNum" placeholder="请输入英文编号" />
        </FormItem>
        <FormItem label="名称：">
          <Input v-model="formItem.cnName" placeholder="请输入中文名称" />
        </FormItem>
        <FormItem label="备注：">
            <Input v-model="formItem.desc" type="textarea" :autosize="{minRows: 4, maxRows: 6}" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import TreeSelect from '_c/tree-select'
import { getUserOrgTree } from '@/api/system-configs/user-center'

export default {
  name: 'UserCenter',
  components: { TreeSelect },
  created () {
    this.doGetUserOrgTree()
  },
  data () {
    return {
      orgModal: {
        isShow: false,
        updatedList: [],
        title: '添加组织'
      },
      formItem: {
        enSerialNum: '',
        parentOrg: [],
        cnName: '',
        desc: '',
        ruleValidate: {
          cnNameRule: [{
            required: true,
            message: '中文名称为必填项',
            trigger: 'blur'
          }]
        }
      },
      selected: [],
      orgList: []
    }
  },
  methods: {
    doGetUserOrgTree () {
      getUserOrgTree().then((res) => {
        if (res.success) {
          this.orgList = res.data
          this.orgModal.updatedList = this.updateData(this.orgList)
          this.orgModal.updatedList.unshift({
            value: 'none',
            id: 'none',
            title: '无',
            label: '无',
            children: []
          })
        }
      })
    },
    updateData (arr) {
      return arr.map((element) => {
        Object.assign(element, {
          value: element.id,
          label: element.title
        })
        if (element.children && element.children.length) {
          this.updateData(element.children)
        }
        return element
      })
    },
    suerCreate (refName) {
      this.$refs['formItem'].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('失败, 请填写必填项')
        }
      })
    },
    selectNode (node) {
      // eslint-disable-line
      console.log(node)
    },
    createOrg () {
      this.orgModal.isShow = true
    }
  }
}
</script>

<style lang="less">
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
</style>
