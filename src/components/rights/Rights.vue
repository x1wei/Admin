<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
<!-- main -->
    <el-table ref="rightsData" :data="rightsData" highlight-current-row  style="width: 100% ">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column property="authName" label="权限名称" width="220">
      </el-table-column>
      <el-table-column property="path" label="路径" width="220">
      </el-table-column>
      <el-table-column property="level" label="层级">
         <template slot-scope="scope">
        <span v-if="scope.row.level==0">一级 </span>
        <span v-else-if="scope.row.level==1">二级 </span>
        <span v-else="scope.row.level==2">三级 </span>
              </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        rightsData: [],
        currentRow: null
      }
    },
    created() {
      this.getRightsList()
    },
    methods: {
      getRightsList() {
        axios
          .get('http://localhost:8888/api/private/v1/rights/list')
          .then(res => {
            var data =res.data.data
            this.rightsData = data
          })
      }
    }
  }
</script>

<style>
  .home-wrapper .el-main[data-v-74b1de62] {
    line-height: 50px;
  }
</style>
