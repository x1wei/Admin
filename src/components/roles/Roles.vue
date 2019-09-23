<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table ref="rolesList" :data="rolesList" highlight-current-row style="width: 100% ">
<!-- 展开选项 -->
       <el-table-column type="expand">
            <template slot-scope="scope">
               <el-row v-if="scope.row.children.length === 0">
          <el-col>
            暂无权限，请分配
          </el-col>
        </el-row>
        <!-- 遍历一级菜单 -->
        <el-row v-else class="level1-row" v-for="level1 in scope.row.children" :key="level1.id">
          <!-- 展示一级菜单的名字 -->
          <el-col :span="4">
            <!-- closable 带有关闭x号 type 表示颜色类型 -->
            <el-tag closable @close="delRoleRightById(scope.row.id, level1.id)">
              {{ level1.authName }}
            </el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>

          <el-col :span="20">
            <!-- 遍历二级菜单 -->
            <el-row class="level2-row" v-for="level2 in level1.children" :key="level2.id">
              <el-col :span="4">
                <!-- 展示二级菜单的名字 -->
                <el-tag closable type="success" @close="delRoleRightById(scope.row.id, level2.id)">
                  {{ level2.authName }}
                </el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>

              <!-- 遍历三级菜单 -->
              <el-col :span="20">
                <!-- 展示三级菜单的名字 -->
                <el-tag class="level3-tag" closable type="warning" v-for="level3 in level2.children" :key="level3.id"
                  @close="delRoleRightById(scope.row.id, level3.id)">
                  {{ level3.authName }}
                </el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
              
            </template>
          </el-table-column>
<!-- end -->

<!-- 顺序 -->
      <el-table-column type="index" width="50">

      </el-table-column>
<!-- end -->

      <el-table-column property="roleName" label="角色名称" width="120">
      </el-table-column>
      <el-table-column property="roleDesc" label="描述" width="120">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="showuserEditDialog(scope.row)"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配权限</el-button>
        </template>
      </el-table-column>

    </el-table>


<!-- 弹出框 -->
<el-dialog title="收货地址" :visible.sync="rolesFormVisible">
  <el-form :model="form">
    <el-form-item label="角色名称" :label-width="formLabelWidth">
      <el-input v-model="form.roleName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" :label-width="formLabelWidth">
      <el-input v-model="form.roleDesc" auto-complete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="formLabelWidth = false">取 消</el-button>
    <el-button type="primary" @click="edituser">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        rolesList: [],

                rolesFormVisible: false,
                form: {
                  roleName: '',
                  roleDesc: '',
                  id:-1
                },
                formLabelWidth: '120px'
      }
    },
    created() {

      this.getRolesList()

    },
    methods: {
      getRolesList() {
        axios.get('http://localhost:8888/api/private/v1/roles')
          .then(res => {
            var data = res.data.data
            this.rolesList = data
          })
      },
      showuserEditDialog(res) {

        for (var key in this.form) {
          this.form[key] = res[key]

        }
        this.rolesFormVisible = true
      },
      edituser(){
        var {id,roleName,roleDesc} = this.form

axios.put(`http://localhost:8888/api/private/v1/roles/${id}`,{roleName,roleDesc}).then(res=>{
  this.getRolesList()
  this.rolesFormVisible = false
})
      },

      delUserById(id) {

this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         axios.delete(`http://localhost:8888/api/private/v1/roles/${id}`)
         .then(res=>{
           var  meta =res.data.meta
           if(meta.status == 200){
             this.$message({
               type: 'success',
               message: meta.msg
             });
             this.getRolesList()
           }
         })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      async delRoleRightById(roleId, rightId) {
      // console.log('删除', roleId, rightId)
      const res = await axios.delete(`http://localhost:8888/api/private/v1/roles/${roleId}/rights/${rightId}`)

      // console.log(res)
      const { data, meta } = res.data
      if (meta.status === 200) {
        const curRole = this.rolesList.find(item => item.id === roleId)
        curRole.children = data
      }
    },
    }
  }
</script>

<style>
  .home-wrapper .el-main[data-v-74b1de62] {
    line-height: 50px;
  }
  .level1-row {
  padding: 20px 0;
  border-bottom: 1px dotted #ccc;

  &:last-child {
    border-bottom: 0;
  }
}

.level2-row {
  padding-bottom: 10px;
}

.level3-tag {
  margin-right: 3px;
}

</style>
