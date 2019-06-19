<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-button type="primary" @click="addTpl">新增模板</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-input
          style="width: 160px"
          size="small"
          @keyup.enter.native="search"
          clearable
          prefix-icon="el-icon-search"
          placeholder="搜索报表名称"
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
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已发布报表" name="publish">
        <el-table
          :data="publishData"
          style="width: 100%;min-height:300px">
          <el-table-column prop="reportName" label="报表名称"></el-table-column>
          <el-table-column prop="reportDesc" label="描述"></el-table-column>
          <el-table-column prop="createTm" label="创建时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="60px">
            <template slot-scope="scope">
              <el-button type="text" @click="cancePublish(scope.row)" size="small">取消发布</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="total>10"
          @current-change="pageChange"
          :current-page="currentPage"
          style="margin: 20px;text-align: right"
          background
          layout="prev, pager, next,jumper"
          :total="total"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="未发布报表" name="unpublish">
        <el-table
          :data="unpublishData"
          style="width: 100%;min-height:300px">
          <el-table-column prop="reportName" label="报表名称"></el-table-column>
          <el-table-column prop="reportDesc" label="描述"></el-table-column>
          <el-table-column prop="createTm" label="创建时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="60px">
            <template slot-scope="scope">
              <el-button type="text" @click="editReport(scope.row)" size="small">修改报表</el-button>
              <el-button type="text" @click="delReport(scope.row)" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="total>10"
          @current-change="pageChange"
          :current-page="currentPage"
          style="margin: 20px;text-align: right"
          background
          layout="prev, pager, next,jumper"
          :total="total"></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: "Tplmg",
  data() {
    return {
      activeName: "publish",
      publishData: [],
      unpublishData: [],
      searchText: "",
      searchStr: "",
      currentPage: 1,
      total: 0,
    };
  },
  watch: {
    searchText: function() {
      if (this.searchText === "") {
        this.searchStr = "";
        //this.getUsers();
      }
    }
  },
  mounted() {
    console.info(this.$http);
    this.getPublish();
  },
  methods: {
    getPublish(){
      this.$api.get(
            "http://rap2api.taobao.org/app/mock/148195/publish",
            success => {
              this.$message.success(success);
              this.getUsers();
            },
            fal => {
              this.$message.success(fal);
            }
          );
    },
    search() {
      this.currentPage = 1;
      this.searchStr = this.searchText;
      this.getUsers();
    },
    addTpl(){
      this.$router.push({path:"/login"});
    },
    delReport(data) {
      console.log(data);
      this.$confirm("删除报表：" + data.uname + "？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.get(
            "/sysuser/del",
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
        "/sysuser/setRole",
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
    }
  }
};
</script>

<style scoped>
.form-item {
  padding: 10px 0;
}
</style>
