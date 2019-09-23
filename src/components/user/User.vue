<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="input5" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" plain @click="userAddDialog = true">添加管理</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" stripe>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change='changeUserState(scope.row.id,scope.row.mg_state)'>
          </el-switch>

        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="showuserEditDialog(scope.row)"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="delUserById(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="curPage" @current-page="changePage">
		</el-pagination> -->
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page.sync="curPage"
      @current-change="changePage">
    </el-pagination>


    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="userAddDialog" @close="closeUserAddDialog">
      <el-form :model="userForm" :rules="rules" ref="userForm">

        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="userForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="userForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAddDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser ">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="userEditDialog" @close="closeUserEditDialog">
      <el-form :model="usereditForm" :rules="editrules" ref="usereditForm">

        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input disabled v-model="usereditForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="usereditForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="usereditForm.mobile" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userEditDialog = false">取 消</el-button>
        <el-button type="primary" @click='editUser'>确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import axios from 'axios'
  export default {
    created() {
      // 发送请求，获取数据
      this.getUserList()
    },

    data() {
      return {
        userList: [],
        total: 1,
        pageSize: 3,
        curPage: 3,
        input5: '',


        //添加用户
        userAddForm: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },

        userAddDialog: false,

        userForm: {
          username: '',
          password: '',
          mobile: '',
          email: ''
        },
        rules: {
          username: [
            // required 是否为必填项
            // message 当前规则校验失败时的提示
            // trigger 表单验证的触发实际，blur表示失去焦点时触发
            {
              required: true,
              message: '用户名为必填项',
              trigger: 'blur'
            },
            // min 最小长度
            // max 最大长度
            {
              min: 3,
              max: 6,
              message: '用户名长度在 3 到 6 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '密码为必填项',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 6,
              message: '密码长度在 3 到 6 个字符',
              trigger: 'blur'
            }
          ]
        },
        //编辑
        userEditDialog: false,
        usereditForm: {
          username: '',
          email: '',
          mobile: '',
          id:''
        },
        editrules: {
          mobile: [
            // required 是否为必填项
            // message 当前规则校验失败时的提示
            // trigger 表单验证的触发实际，blur表示失去焦点时触发
            {
              required: true,
              message: '手机必填',
              trigger: 'blur'
            },

            {
              pattern: /0?(13|14|15|18)[0-9]{9}/,
              message: '手机格式错误',
              trigger: 'blur'
            }
          ],

        },
        formLabelWidth: '120px',




      }
    },
    methods: {

      addUser() {
        this.$refs.userForm.validate(valid => {
          // valid 表示是否校验成功，如果成功就为：true
          // 如果失败就为：false
          if (valid) {
            this.userAddDialog = false
            axios.post('http://localhost:8888/api/private/v1/users', this.userForm)
              .then(res => {
                // console.log(res)
                const {
                  meta
                } = res.data
                if (meta.status === 201) {
                  // 1 关闭对话框
                  // 2 重置表单(只要关闭对话框，就会自动触发对话框的关闭事件来重置表单)
                  this.userAddDialog = false

                  // 3 重新获取列表数据
                  this.getUserList()
                  // this.curPage = 1
                }
              })

          } else {
            // 校验失败
            return false
          }
        })
      },
      getUserList(curPage = 1) {
        axios
          .get('http://localhost:8888/api/private/v1/users', {
            params: {
              pagenum: curPage,
              // 每页展示多少条数据
              pagesize: 3,
              query: this.input5 || ''
            },
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {

            const {
              data,
              meta
            } = res.data
            if (meta.status === 200) {
              // 获取数据成功

              this.userList = data.users
              this.total = data.total
              this.curPage = data.pagenum
            }
          })
      },
      changePage(curPage) {
        this.getUserList(curPage)
      },
      search() {
        this.curPage = 1
        this.getUserList()
      },
      changeUserState(id, curtate) {
        console.log(curtate)
        axios
          .put(`http://localhost:8888/api/private/v1/users/${id}/state/${curtate}`, )
          .then(function(res) {

          })
      },
      closeUserAddDialog() {
        // console.log('对话框关闭了')
        this.$refs.userForm.resetFields()
      },
      closeUserEditDialog(){
        this.$refs.usereditForm.resetFields()
      },
      showuserEditDialog(show) {

        for (var key in this.usereditForm) {
          this.usereditForm[key] = show[key]
        }
        this.userEditDialog = true

      },
      editUser(){
        this.$refs.usereditForm.validate(valid => {
          // valid 表示是否校验成功，如果成功就为：true
          // 如果失败就为：false


          if (valid) {

            var id =this.usereditForm.id
            var mobile =this.usereditForm.mobile
            var email = this.usereditForm.email


            axios.put(`http://localhost:8888/api/private/v1/users/${id}`,
            {email:email,
            mobile:mobile}).then(res=>{
              console.log(res)
             const { data, meta } = res.data
             if (meta.status === 200) {
               // 更新该用户的数据
               const editUser = this.userList.find(item => item.id === id)
               editUser.email = data.email
               editUser.mobile = data.mobile
               console.log(editUser)

               // 关闭对话
               this.userEditDialog = false
             }
            })
//
        } else {
            // 校验失败
            console.log("1111")
            return false
          }
        })

      },
      delUserById(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete(`http://localhost:8888/api/private/v1/users/${id}`).then(res => {
            var meta = res.data.meta
            if (meta.status === 200) {
              this.$message({
                type: 'success',
                message: meta.msg
              });
              this.getUserList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },

  }
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;

  }

  .home-wrapper .el-main[data-v-74b1de62] {
    line-height: 50px;
  }
</style>
