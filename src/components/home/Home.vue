<template>
	<el-container class="home-wrapper">
		<el-header>
			<el-row>
				<el-col :span="8" class="logo">
					<img src="@/assets/timg.jpg" alt="logo">
				</el-col>
				<el-col :span="8" class="title">
					<h1>后台管理系统</h1>
				</el-col>
				<el-col :span="8" class="welcome"><span>欢迎进入管理系统<a href="javascript:;" @click="logout">退出</a></span></el-col>
			</el-row>
		</el-header>
		<el-container>



			<el-aside width="200px">
				<el-menu :router="true" default-active="2-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
				 background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
					<el-submenu index="1">
						<template slot="title">
							<i class="el-icon-location"></i>
							<span>用户管理</span>
						</template>
						<el-menu-item-group>

							<el-menu-item index="/home/user">
								<template slot="title">
									<i class="el-icon-menu"></i>
									<span>用户列表</span>
								</template>
							</el-menu-item>


						</el-menu-item-group>


					</el-submenu>
          <el-submenu index="1-2">
          	<template slot="title">
          		<i class="el-icon-location"></i>
          		<span>权限管理</span>
          	</template>
          	<el-menu-item-group>

          		<el-menu-item index="/home/roles">
          			<template slot="title">
          				<i class="el-icon-menu"></i>
          				<span>角色列表</span>
          			</template>
          		</el-menu-item>

          		<el-menu-item index="/home/rights">
          			<template slot="title">
          				<i class="el-icon-star-on"></i>
          				<span>权限列表</span>
          			</template>
          		</el-menu-item>
          	</el-menu-item-group>


          </el-submenu>





					</el-menu-item>
				</el-menu>
			</el-aside>




			<el-main>
				<router-view>

				</router-view>

			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {

		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			logout() {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					localStorage.removeItem("token"),
						this.$router.push('login')
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},

		}
	}
</script>

<style scoped lang="less">
	.home-wrapper {
		height: 100%;


		.el-header {
			background-color: #b3c1cd;
			color: #333;
			text-align: center;
			line-height: 60px;

			h1 {
				margin: 0;
				font-size: 36px;
				color: #fff;
			}

			.logo {
				height: 60px;

				img {
					height: 100%;
					float: left;
				}

			}

			.welcome {
				line-height: 60px;
				font-weight: bold;
				text-align: right;
				padding-right: 30px;

				a {
					color: red;
					text-decoration: none;
				}

			}
		}

		.el-aside {
			background-color: #545c64;
			color: #333;

			line-height: 200px;
		}

		.el-main {
			background-color: #E9EEF3;
			color: #333;
			line-height: 160px;
		}

		body>.el-container {
			margin-bottom: 40px;
			width: 100%;
		}

		.el-container:nth-child(5) .el-aside,
		.el-container:nth-child(6) .el-aside {
			line-height: 260px;
		}

		.el-container:nth-child(7) .el-aside {
			line-height: 320px;
		}
	}



</style>
