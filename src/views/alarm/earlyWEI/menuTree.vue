<template>
  <el-tree ref="menu" :data="treeMenuData" :default-checked-keys="checkedKeys"  default-expand-all node-key="code" highlight-current :props="treeMenuProp" :expand-on-click-node="false" @node-click="handleCheckChange"></el-tree>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-12 20:01:39
export default {
  name: 'menuTree',
  props: {
    treeMenuData: {
      type: Array,
      default: [],
      required: true
    },
    treeMenuProp: {
      type: Object,
      required: true
    },
    checkedKeys: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.data = this.treeMenuData
    this.props = this.treeMenuProp
  },
  methods: {
    handleCheckChange(data) {
      console.log(data)
      this.$emit('check-change', data)
    }
  }
}
</script>

