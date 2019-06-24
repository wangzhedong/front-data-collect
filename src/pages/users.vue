<template>
  <div>
    <el-row>
      <el-row style="padding: 10px 20px">
        <el-col :span="12">
          <el-button
            type="primary"
            @click="edit(checkedUser)"
            :disabled="checkedUser.length<=0"
          >批量绑定角色</el-button>
          <el-button type="primary" @click="editUser">新增用户</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-input
            style="width: 160px"
            size="small"
            @keyup.enter.native="search"
            clearable
            prefix-icon="el-icon-search"
            placeholder="搜索登录名"
            v-model="searchText"
          ></el-input>
          <el-button
            size="small"
            icon="el-icon-search"
            title="搜索"
            circle
            type="primary"
            @click="search"
          ></el-button>
        </el-col>
      </el-row>
      <el-table
        ref="userTable"
        @selection-change="handleSelectionChange"
        class="usersTable"
        stripe
        :data="tableData"
        style="width: 100%;min-height:300px"
      >
        <el-table-column type="selection" width="55" label="全选"></el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="uemail" label="邮箱"></el-table-column>
        <el-table-column prop="tel" label="电话"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span
              style="display: inline-block;margin: 2px 3px"
              v-for="role in scope.row.roleIds"
              :key="role.loginName"
            >{{role.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="360px">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)" size="small">修改绑定角色</el-button>
            <el-button type="text" @click="editUser(scope.row)" size="small">修改用户信息</el-button>
            <el-button type="text" @click="resetPassword(scope.row)" size="small">重置密码</el-button>
            <el-button type="text" @click="delUser(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-pagination
      v-if="total>10"
      @current-change="pageChange"
      :current-page="currentPage"
      style="margin: 20px;text-align: right"
      background
      layout="prev, pager, next,jumper"
      :total="total"
    ></el-pagination>
    <!--修改角色绑定弹出框-->
    <el-dialog :visible.sync="roleModel" center :close-on-click-modal="false">
      <el-form style="padding: 0 15px">
        <div style="font-size: 18px;color: #333333;font-weight: bold;padding-bottom: 10px">角色绑定修改</div>
        <div class="form-item">
          用户：
          <span
            style="padding: 5px"
            v-for="user in editItem"
            :key="user.id"
          >{{user?user.uname:''}}</span>
        </div>
        <!-- <div class="form-item">当前已选：
          <div style="transition: all .5s" v-if="!!editItem">
          <span style="display: inline-block;margin: 0 5px;" v-for="role in checkedRoles">{{role.roleName}}</span>
          </div>
        </div>-->
        <div class="form-item">
          <p style="padding:0 0 10px">所有角色：</p>
          <el-checkbox-group
            style="padding: 5px 10px;box-shadow: 0px 0px 21px #ccc inset;"
            v-model="checkedRoles"
          >
            <el-checkbox
              style="margin: 5px"
              border
              @change="col"
              size="small"
              v-for="role in allRoles"
              :label="role.roleId"
              :key="role.roleId"
            >{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div style="text-align: center">
          <el-button @click="hideEditDialog">取消</el-button>
          <el-button @click="save" type="primary">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--修改用户信息弹出框-->
    <el-dialog
      :visible="userModel"
      @close="closeUserModel"
      width="550px"
      :title="userInfo.id?'修改用户':'新增用户信息'"
      :close-on-click-modal="false"
    >
      <el-form
        :model="userInfo"
        ref="userForm"
        :rules="rules"
        label-width="100px"
        style="padding: 0 20px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            maxlength="16"
            type="text"
            size="small"
            placeholder="请输入用户名"
            v-model="userInfo.userName"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="uemail">
          <el-input
            maxlength="30"
            type="text"
            size="small"
            placeholder="请输入邮箱"
            v-model="userInfo.uemail"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="tel">
          <el-input
            maxlength="11"
            type="text"
            size="small"
            placeholder="请输入手机号"
            v-model="userInfo.tel"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button @click="closeUserModel">取消</el-button>
        <el-button type="primary" @click="userSave">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deepCopy} from "../utils/tools";

export default {
    name: 'User',
    data() {
        return {
            tableData: [],
            searchText: '',
            searchStr: '',
            currentPage: 1,
            total: 0,
            roleModel: false,
            checkedRoles: [],
            editItem: [],
            allRoles: '',
            checkedUser: [],
            userModel: false,
            userInfo: {},
            rules: {
                userName: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^\S+$/,
                        message: '用户名必须为非空字符串',
                        trigger: 'blur',
                    },
                ],
                uemail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {
                        pattern: /^\S+[@]\S+[.]\S+$/,
                        message: '邮箱格式不正确',
                        trigger: 'blur',
                    },
                ],
                tel: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^[1][345678][0-9]{9}/,
                        message: '手机号格式不正确',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    watch: {
        searchText: function() {
            if (this.searchText === '') {
                this.searchStr = '';
                this.getUsers();
            }
        },
    },
    mounted() {
      this.getUsers();
      /**this.$api.get('/role/all', '', res => {
        this.allRoles = res;
      }, fal => {
        this.$message.error(fal)
      })*/
    },
    methods: {
        search() {
            this.currentPage = 1;
            this.searchStr = this.searchText;
            this.getUsers();
        },
        getUsers() {
            this.$api.get(
                '/sysUser/queryByPage',
                {
                    pageSize: 10,
                    pageIndex: this.currentPage,
                    search: this.searchStr,
                },
                res => {
                  console.log("res",res);
                    if (res.records) {
                        this.tableData = res.records;
                        this.total = res.totalCount;
                    }
                },
                fal => {
                    this.$message.error(fal);
                }
            );
        },
        pageChange(currentPage) {
            this.currentPage = currentPage;
            this.getUsers();
        },
        edit(items) {
            this.showEditDialog();
            if (!(items instanceof Array)) {
                if (items.roleIds) {
                    let c = [];
                    items.roleIds.forEach(d => {
                        c.push(d.roleId);
                    });
                    this.checkedRoles = c;
                }
                this.editItem = [deepCopy(items)];
            } else {
                this.editItem = deepCopy(items);
            }
        },
        editUser(data) {
            this.userModel = true;
            if (data) {
                this.userInfo = Object.assign({}, data);
            } else {
                this.userInfo = {
                    uname: '',
                    uemail: '',
                    loginName: '',
                    tel: '',
                    id: '',
                };
            }
        },
        closeUserModel() {
            this.userModel = false;
            this.userInfo = {};
            this.$refs.userForm.clearValidate();
        },
        userSave() {
            this.$refs.userForm.validate(valid => {
                if (valid) {
                    if (this.userInfo.id) {
                        this.$api.post(
                            '/sysuser/update',
                            {
                                uname: this.userInfo.uname,
                                uemail: this.userInfo.uemail,
                                tel: this.userInfo.tel,
                                id: this.userInfo.id,
                            },
                            success => {
                                this.$message.success(success);
                                this.closeUserModel();
                                this.getUsers();
                            },
                            fal => {
                                this.$message.success(fal);
                            }
                        );
                    } else {
                        this.$api.post(
                            '/sysUser/add',
                            this.userInfo,
                            success => {
                                this.$message.success(success);
                                this.closeUserModel();
                                this.getUsers();
                            },
                            fal => {
                                this.$message.success(fal);
                            }
                        );
                    }
                } else {
                    return false;
                }
            });
        },
        resetPassword(data) {
            this.$confirm('重置' + data.uname + '密码？', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$api.get(
                        '/sysuser/resetPassword',
                        { id: data.id },
                        success => {
                            this.$message.success(success);
                        },
                        fal => {
                            this.$message.success(fal);
                        }
                    );
                })
                .catch(() => {});
        },
        delUser(data) {
            console.log(data);
            this.$confirm('删除用户：' + data.uname + '？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$api.get(
                        '/sysuser/del',
                        { id: data.id },
                        success => {
                            this.$message.success(success);
                            this.getUsers();
                        },
                        fal => {
                            this.$message.success(fal);
                        }
                    );
                })
                .catch(() => {});
        },
        showEditDialog() {
            this.roleModel = true;
        },
        hideEditDialog() {
            this.editItem = [];
            this.roleModel = false;
            this.checkedRoles = [];
        },
        save() {
            let userId = [];
            this.editItem.forEach(user => {
                userId.push(user.id);
            });
            let roles = [];
            this.allRoles.forEach(item => {
                this.checkedRoles.forEach(checkRoleId => {
                    if (item.roleId === checkRoleId) {
                        roles.push(item);
                    }
                });
            });

            let params = { userIds: userId, sysUserRoles: roles };
            this.$api.post(
                '/sysuser/setRole',
                params,
                success => {
                    this.$message.success(success);
                    this.hideEditDialog();
                    this.getUsers();
                },
                fal => {
                    this.$message.error(fal);
                }
            );
        },
        col(val) {
            if (this.checkedRoles.length > 5) {
                this.$message.info('最多勾选五项');
                this.checkedRoles.splice(5, 1);
            }
        },
        handleSelectionChange(val) {
            console.log(val);
            this.checkedUser = val;
        },
    },
};
</script>

<style scoped>
.form-item {
    padding: 10px 0;
}
</style>
