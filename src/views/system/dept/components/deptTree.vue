<template>
  <!-- <div style="width: 204px; overflow: auto ;height:700px"> -->
  <!--<div style="overflow: auto ;height:700px;" class="j-dept-tree">-->
  <div style="overflow:auto;max-width:296px;display: -webkit-box;overflow-x: auto;height:700px;" class="j-dept-tree">
    <!-- <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input> -->
    <!-- <el-tree :data="treeData" :expand-on-click-node="false" :props="defaultProps" ref="tree" node-key="id" @node-click="handleNodeClick" :filter-node-method="filterNode" :highlight-current="true" :default-expand-all="true" style="width: 400px"></el-tree> -->
    <!-- style="max-height: 400px; overflow: auto" -->
    <!-- <el-tree ref="tree" lazy :check-strictly="true" check-on-click-node :show-checkbox="showCheckbox"
      @check-change="checkChange" @node-click="handleNodeClick" @check="getCurrentKey"
      :load="loadDeptNode" :render-content="renderContent" :highlight-current="true"
      :data="treeData" :props="defaultProps" node-key="id" :expand-on-click-node="true"
      style="margin-top:5px;font-size:12px;background:none" >
    </el-tree> -->
    <el-tree ref="tree" check-strictly default-expand-all check-on-click-node
      :show-checkbox="showCheckbox" @check-change="checkChange" @node-click="handleNodeClick"
      @check="getCurrentKey"
      :render-content="renderContent" :highlight-current="true"
      :data="treeData" :props="defaultProps" node-key="fullPath" :expand-on-click-node="false"
      style="margin-top:5px;font-size:12px;background:none;padding-bottom:30px;overflow: auto" >
    </el-tree>
    </div>
</template>

<script>
  import { deptTreeApi, deptTreeApiDisabled } from '@/api/system/dept'
  import { getBaseDept } from '@/api/vehicleMonitor/realtime'

  export default {
    name: 'deptTree',
    props: {
      showCheckbox: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        filterText: '',
        list: null,
        total: 0,
        downloadLoading: false,
        listQuery: {
          page: 1,
          limit: 10
        },
        treeData: [
        ],
        // defaultProps: {
        //   children: 'children',
        //   label: 'text'
        // },
        defaultProps: {
          children: 'children',
          label: 'text',
          isLeaf: 'isLeaf'
        },
        checkedList: [],
        deptTreeQuery: { id: '' },
        topDeptId: '',
        checkOne: '',
        editCheckId: ''
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val)
      }
    },
    created() {
      this.loadTree()
    },
    methods: {
      loadTree() { // 加载部门树
        deptTreeApiDisabled().then(res => {
          const disabledD = res.data
          deptTreeApi(this.listQuery).then(response => {
            this.treeData = [].concat(response.data)
            this.tickMenuIdFilter(disabledD).filter(this.treeData)
          })
        })

        // getBaseDept(this.deptTreeQuery).then(res => { // 加载机构树顶级节点
        //   // debugger
        //   if (res.code === 0) {
        //     // if (this.websocket.readyState === 1) {
        //     //   this.subscribeTop(24, res.data[0].id)
        //     //   this.subscribeTop(5, res.data[0].id)
        //     //   this.subscribeExpend(4, 'online', res.data[0].id)
        //     // }
        //     this.topDeptId = res.data[0].id
        //     // console.log('-->>tree data:'+JSON.stringify(res.data))
        //     this.treeData = res.data
        //     // const deptVeh = this.deptVehCount[this.topDeptId] // 取机构车辆缓存数据
        //     // this.$set(this.treeData[0], 'allVehicle', (deptVeh?deptVeh.allVehicle:0))
        //     // this.$set(this.treeData[0], 'onlineVehicle', (deptVeh?deptVeh.onlineVehicle:0))
        //     // this.$set(this.treeData[0], 'offlineVehicle', (deptVeh?deptVeh.allVehicle:0))
        //     // this.$set(this.treeData[0], 'children', [])
        //     // this.treeData[0].children.push({})
        //   } else {
        //     this.$message({ message: res.msg, type: 'error' })
        //   }
        // })
      },
      // 设置数据权限树某些节点不可以点击
      tickMenuIdFilter(np) {
        var resultArr = []
        var getTickMenuId = function(obj) {
          if (undefined === obj || obj === null || !(obj instanceof Object)) {
            return
          }
          np.forEach(item => {
            if (obj.fullPath === item) {
              obj.disabled = true
              resultArr.push(obj.id)
            }
            if (obj.children && obj.children instanceof Array) {
              for (const child of obj.children) {
                getTickMenuId(child)
              }
            }
          })
        }

        return {
          filter: function(arr) {
            if (!(arr instanceof Array)) {
              return false
            }
            resultArr = []
            for (const rootMenu of arr) {
              getTickMenuId(rootMenu)
            }
            return resultArr
          }
        }
      },
      loadDeptNode(node, resolve) {
        // console.log("1---1")
        // if (data.children.length > 1) {
        //   return
        // } else {
        this.deptTreeQuery = { id: node.data.fullPath, activeStatus: this.activeStatus === -1 ? '' : this.activeStatus, nodeType: node.data.type }
        // alert('getBaseDept' + 2)
        if (node.level === 0) {
          return
        }
        getBaseDept(this.deptTreeQuery).then(res => {
          // console.log('tree data：'+JSON.stringify(res))
          if (res.code === 0) {
            const checkArr = []
            const childrenData = res.data
            const _this = this
            // alert(JSON.stringify(childrenData))
            if (childrenData.length === 0) {
              node.isLeaf = true // 叶子
              resolve([])
              return
            }
            for (let i = 0; i < childrenData.length; i++) {
              const child = childrenData[i]
              if (this.checkedList.indexOf(node.key) > -1) {
                checkArr.push(child.id)
              }
              // if (child.type !== '4') {
              //   const deptVeh = this.deptVehCount[child.id] // 取机构车辆缓存数据
              //   this.$set(child, 'allVehicle', (deptVeh?deptVeh.allVehicle:0))
              //   this.$set(child, 'onlineVehicle', (deptVeh?deptVeh.onlineVehicle:0))
              //   this.$set(child, 'offlineVehicle', (deptVeh?deptVeh.offlineVehicle:0))
              // } else {
              //   this.$set(child, 'online', '0')
              // }
            }
            resolve(childrenData)
            // this.subscribeExpend(4, 'online', deptId)
            setTimeout(() => {
              if (childrenData.length > 0) {
                _this.$refs.tree.setCheckedKeys(checkArr)
              } else {
                _this.$refs.tree.setCheckedKeys(_this.checkedList)
              }
            }, 10)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      renderContent(h, { node, data, store }) { // 渲染tree
        if (data.disabled) {
          if (data.type === '1') {
            return (
              <span style='height:18px;line-height:18px'>
                <i class='tree_dept_icon tree_dept_icon_l'></i>
                <span class='tree_dept_l'>{node.label}</span>
              </span>
            )
          } else if (data.type === '2') {
            return (
              <span>
                <i class='tree_line_icon tree_line_icon_l'></i>
                <span class='tree_dept_l'>{node.label}</span>
              </span>
            )
          } else if (data.type === '3') {
            return (
              <span>
                <i class='tree_owers_icon tree_owers_icon_l'></i>
                <span class='tree_dept_l'>{node.label}</span>
              </span>
            )
          }
        } else {
          if (data.type === '1') {
            return (
              <span style='height:18px;line-height:18px'>
                <i class='tree_dept_icon'></i>
                <span>{node.label}</span>
              </span>
            )
          } else if (data.type === '2') {
            return (
              <span>
                <i class='tree_line_icon'></i>
                <span>{node.label}</span>
              </span>
            )
          } else if (data.type === '3') {
            return (
              <span>
                <i class='tree_owers_icon'></i>
                <span>{node.label}</span>
              </span>
            )
          }
        }
      },
      getCurrentKey(data, node) {
        // if (node.checkedNodes.length > 1) {
        //   this.$refs.tree.setCheckedNodes([])
        //   this.$refs.tree.setCheckedNodes([data])
        // }
        // this.$emit('gettreenode', data)
      },
      checkChange(data, checked, indeterminate) {
        if (checked) {
          // this.editCheckId = data.id
          localStorage.setItem('editCheckId', data.fullPath)
          this.$refs.tree.setCheckedKeys([data.fullPath])
          this.$refs.tree.setCurrentNode(data)
        } else {
          // if (this.editCheckId === data.id) {
          if (localStorage.getItem('editCheckId') === data.fullPath) {
            // 点击已选中复选框，保证至少一个选中
            this.$refs.tree.setCheckedKeys([data.fullPath])
            this.$refs.tree.setCurrentNode(data)
          }
        }
      },
      handleNodeClick(data, node, self) {
        if (!this.showCheckbox) {
          // 触发父组件nodeClick方法
          this.$emit('nodeClick', data)
        }
      },
      // 清空所选节点信息
      setCheckedKeysNull() {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedNodes([])
        })
      },
      // 默认所选节点信息
      setCheckedKeysChoose(nodepath) {
        this.$refs.tree.setCheckedKeys([nodepath])
      },
      filterNode(value, data) { // 树节点过滤方法
        if (!value) return true
        return data.text.indexOf(value) !== -1
      },
      // 获取选中的节点
      getSelectNode() {
        return this.$refs.tree.getCurrentNode()
      }
    }
  }
</script>
<style>
  .j-dept-tree .tree_dept_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../../assets/realtime/tree_area.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .j-dept-tree .tree_dept_icon_l {
    background-image: url('../../../../assets/realtime/tree_area_l.png');
  }
  .j-dept-tree .tree_line_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../../assets/realtime/tree_platform.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .j-dept-tree .tree_line_icon_l{
    background-image: url('../../../../assets/realtime/tree_platform_l.png');
  }
  .j-dept-tree .tree_owers_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../../assets/realtime/tree_owers.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .j-dept-tree .tree_owers_icon_l{
    background-image: url('../../../../assets/realtime/tree_owers_l.png');
  }
</style>
