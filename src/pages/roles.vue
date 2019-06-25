<template>
  <div>
    <el-row style="margin-bottom: 10px;padding-left: 10px">
      <el-button icon="el-icon-plus" type="primary" @click="edit">新增</el-button>
    </el-row>
    <el-row>
      <el-table class="roleTable" stripe :data="tableData" style="width: 100%">
        <el-table-column prop="roleName" label="角色名称" width="">
        </el-table-column>
        <el-table-column prop="roleRemark" label="角色说明">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)" size="small">编辑</el-button>
            <el-button type="text" @click="showConfirmDialog(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <!--分页-->
    <el-pagination v-if="total>10" @current-change="pageChange" :current-page="currentPage"
                   style="margin: 20px;text-align: right" background layout="prev, pager, next,jumper" :total="total">
    </el-pagination>
    <!--修改新增弹出框-->
    <el-dialog :visible="editDialog" width="550px" @close="hideEditDialog" :close-on-click-modal="false">
      <h1 style="text-align: center;margin-bottom:20px;font-size: 18px">{{this.role.id?'角色修改':'角色新增'}}</h1>
      <el-form :model="role" :rules="rules" ref="roleForm" label-width="80px" style="padding: 0 20px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input size="small" maxlength="16" v-model.trim="role.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色说明" prop="roleRemark">
          <el-input size="small" maxlength="16" v-model.trim="role.roleRemark" placeholder="请输入角色说明"></el-input>
        </el-form-item>
        <p>菜单配置</p>
        <div style="padding: 10px 20px">
          <el-tree ref="menu"  :indent="30"
                   :props="defaultProps"
                   :data="menu" show-checkbox node-key="id">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="tree-icon">
                <i :class="data.isRouted==='1'?'el-icon-menu': 'el-icon-news'"></i>
              </span>
               {{ data.menuName }}
            </span>
          </el-tree>
        </div>
        <div style="text-align: center" @closed="hideEditDialog">
          <el-button @click="hideEditDialog">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--确认框-->
    <el-dialog :visible.sync="confirmDialog" width="400px" top="150px" close="hideConfirmDialog">
      <h1 style="text-align: center;margin-bottom:20px;font-size: 18px">确认删除:&nbsp{{role.id?role.roleName:''}}？</h1>
      <div style="text-align: center;padding: 20px">
        <el-button type="" @click="hideConfirmDialog">取消</el-button>
        <el-button type="danger" @click="deleteItem">删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  ///import {arrDeepCopy} from "../common/js/utils";

  export default {
    name: "Role",
    data() {
      return {
        tableData: [],
        currentPage: 1,
        total: 0,
        editDialog: false,
        confirmDialog: false,
        item: [],
        menu: [],
        checkedKeys: [],
        role: {},
        defaultProps: {
          children: 'children',
          label: 'menuName',
          disabled: function (data, node) {
            if (data.url === 'index') {
              return true;
            }
          }
        },
        rules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {pattern: /^\S+$/, message: '角色名称必须为非空字符串', trigger: 'blur'}
          ],
          roleRemark: [
            {required: true, message: '请输入角色说明', trigger: 'blur'},
            {pattern: /^\S+$/, message: '角色说明必须为非空字符串', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      //this.getMenuList();
      this.getRoles();
    },
    methods: {
      edit(item) {
        this.showEditDialog();
        console.log('item', item);
        if (item.id) {
          this.role = arrDeepCopy(item);
          this.checkedKeys = this.getCheckedMenu(item.checkedSysMenuList);
        } else {
          this.checkedKeys = this.setCheckedMenu();
          this.role = {}
        }
        setTimeout(()=>{
          this.checkedKeys.forEach(item=>{
            this.$refs.menu.setChecked(item,true,false)
          })
        },300)
      },
      getCheckedMenu(menu) {
        let arr = [];
        let indexFlag = '';
        if (menu instanceof Array) {
          menu.forEach(item => {
            arr.push(item.menuId)
            if (item.url === 'index') {
              indexFlag = item.id;
            }
          });
          if (!indexFlag) {
            arr.push(indexFlag);
          }
        }
        return arr;
      },
      setCheckedMenu() {
        let arr = [];
        this.menu.forEach(item => {
          if (item.url === 'index') {
           arr.push(item.id)
          }
        });
        return arr;
      },
      save() {
        console.log('treeKey', this.$refs.menu.getCheckedNodes(), this.$refs.menu.getHalfCheckedNodes(), this.$refs.menu.getCheckedKeys());
        this.$refs.roleForm.validate((valid) => {
          if (valid) {
            let a=this.$refs.menu.getHalfCheckedKeys();
            let b=this.$refs.menu.getCheckedKeys()
            let checkedKey = a.concat(b);
            console.log(checkedKey)
            let checkedMenus = [];
            checkedKey.forEach(item => {
              checkedMenus.push({menuId: item})
            });
            if (this.role.id) {
              this.$api.post('/role/update', {
                id: this.role.id,
                roleName: this.role.roleName,
                roleRemark: this.role.roleRemark,
                checkedSysMenuList: checkedMenus
              }, res => {
                this.$message.success(res);
                this.getRoles();
                this.hideEditDialog();
              }, fal => {
                this.$message.error(fal)
              });
            } else {
              this.$api.post('/sysRole/add', {
                roleName: this.role.roleName,
                roleRemark: this.role.roleRemark,
                //checkedSysMenuList: checkedMenus
              }, res => {
                this.$message.success(res);
                this.getRoles();
                this.hideEditDialog();
              }, fal => {
                this.$message.error(fal)
              });
            }
          } else {
            return false;
          }
        });
      },
      showEditDialog() {
        this.editDialog = true;
      },
      hideEditDialog() {
        this.editDialog = false;
        this.role = {};
        this.checkedKeys = [];
        this.$refs.menu.setCheckedKeys([]);
        this.$refs.roleForm.clearValidate();
      },
      showConfirmDialog(item) {
        this.confirmDialog = true;
        this.role = item;
      },
      hideConfirmDialog() {
        this.confirmDialog = false;
        this.role = {};
      },
      deleteItem() {
        // let data={roleName:this.role.roleName,roleRemark:this.role.roleRemark};
        // console.log(JSON.stringify(this.role).length);
        let data = this.role;
        this.$api.post('/role/del', {id: data.id}, res => {
          this.$message.success(res);
          this.hideConfirmDialog();
          this.getRoles();
        }, fal => {
          this.$message.error(fal)
        })
      },
      getMenuList() {
        this.$api.get('/sysmenu/all', {isNeedRoot: false}, success => {
          console.log(success);
          this.menu = success;
        }, fal => {
          this.$message.error(fal)
        })
      },
      getRoles() {
        this.$api.get('/sysRole/queryByPage', {pageSize: 10, pageIndex: this.currentPage}, res => {
          if (res.records) {
            this.tableData = res.records;
            this.total = res.total;
          }
        }, fal => {
          this.$message.error(fal);
        })
      },
      pageChange(currentPage) {
        this.currentPage = currentPage;
        this.getRoles();
      }
    },
  }
</script>

<style scoped>

  .input-row {
    display: flex;
    white-space: nowrap;
    align-items: center;
    margin: 5px 0;
  }

  .icon-padding {
    vertical-align: middle;
    padding: 0 5px;
    color: red;
  }
</style>

