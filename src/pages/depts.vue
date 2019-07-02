<template>
  <div>
    <el-row>
      <el-button round icon="el-icon-plus" type="primary" size="medium" @click="openAdd">新增</el-button>
    </el-row>
    <el-table height="350" :data="tableData" style="width: 100%;">
      <el-table-column prop="deptName" label="部门名称"></el-table-column>
      <el-table-column prop="uemail" label="部门编号"></el-table-column>
      <el-table-column fixed="right" label="操作" width="360px">
        <template slot-scope="scope">
          <el-button type="text" @click="editDept(scope.row)" size="small">修改部门信息</el-button>
          <el-button type="text" @click="delDept(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--修改或者新增部门的弹窗-->
    <el-dialog
      width="550px"
      :title="deptInfo.id?'修改部门':'新增部门'"
      :close-on-click-modal="false"
      :visible.sync="isOpen"
    >
      <el-form :model="deptInfo"  ref="deptForm" :rules="rules" label-width="100px">
        <el-form-item label="部门名称" prop="deptName">
          <el-input maxlength="16" v-model="deptInfo.deptName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门编号" prop="deptNo">
          <el-input maxlength="16" v-model="deptInfo.deptNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择规则" prop="excelRules">
          <el-checkbox-group v-model="deptInfo.excelRules">
            <el-checkbox
              v-for="deptRule in allDeptRules"
              :label="deptRule.id"
              :key="deptRule.id"
            >{{deptRule.ruleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
    name: 'depts',
    data() {
        return {
            tableData: [],
            isOpen: false,
            deptInfo: {
                excelRules: [],
            },
            allDeptRules: [],
            rules: {
                deptName: [
                    {
                        required: true,
                        message: '请输入部门名称',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^\S+$/,
                        message: '部门名必须为非空字符串',
                        trigger: 'blur',
                    },
                ],
                deptNo: [
                    {
                        required: true,
                        message: '请输入部门编号',
                        trigger: 'blur',
                    },
                    {
                        pattern: /^[\w\d]+$/,
                        message: '部门编号不正确',
                        trigger: 'blur',
                    },
                ],
                excelRules: [
                    {
                        type: 'array',
                        required: true,
                        message: '请至少选择一条规则',
                        trigger: 'change',
                    },
                ],
            },
            currentPage: 1,
            searchStr: '',
            total: 0,
        };
    },
    mounted() {
        this.queryByPage();
    },
    methods: {
        queryByPage() {
            this.$api.get(
                '/sysDept/queryByPage',
                {
                    pageSize: 10,
                    pageIndex: this.currentPage,
                    search: this.searchStr,
                },
                res => {
                    console.log('page', res);
                    if (res.pages.records) {
                        this.tableData = res.pages.records;
                        this.total = res.pages.total;
                    }
                    this.allDeptRules = res.rules;
                },
                fal => {
                    this.$message.error(fal);
                }
            );
        },
        openAdd() {
            this.isOpen = true;
        },
        closeDialog() {
            this.isOpen = false;
            this.deptInfo = {};
            this.deptInfo.excelRules = [];
            this.$refs.deptForm.clearValidate();
        },
        addOrUpdate(data) {
          
        },
        editDept(deptData) {},
        delDept(deptData) {},
    },
};
</script>
