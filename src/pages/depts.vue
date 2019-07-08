<template>
  <div>
    <el-row>
      <el-button round icon="el-icon-plus" type="primary" size="medium" @click="openAdd">新增</el-button>
    </el-row>
    <el-table height="350" :data="tableData" style="width: 100%;">
      <el-table-column prop="deptName" label="部门名称"></el-table-column>
      <el-table-column prop="deptNo" label="部门编号"></el-table-column>
      <el-table-column label="规则">
        <template slot-scope="scope">
          <el-tag style="margin: 2px 3px"
            v-if="scope.row.excelRule"
            type="success"
            size="mini"
            effect="dark">
            {{ scope.row.excelRule.ruleName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="360px">
        <template slot-scope="scope">
          <el-button type="text" @click="openEdit(scope.row)" size="small">修改部门信息</el-button>
          <el-button type="text" @click="delDept(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--修改或者新增部门的弹窗-->
    <el-dialog
      width="550px"
      @close="closeDialog"
      :title="deptInfo.id?'修改部门':'新增部门'"
      :close-on-click-modal="false"
      :visible.sync="isOpen"
    >
      <el-form :model="deptInfo" ref="deptForm" :rules="rules" label-width="100px">
        <el-form-item label="部门名称" prop="deptName">
          <el-input maxlength="16" v-model="deptInfo.deptName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门编号" prop="deptNo">
          <el-input maxlength="16" v-model="deptInfo.deptNo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择规则">
        <el-radio-group v-model="deptInfo.ruleId" size="small">
          <el-radio-button 
            v-for="rule in allDeptRules"
            :label="rule.id"
            :key="rule.id">{{rule.ruleName}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
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
              id:'',
              deptName:'',
              deptNo:'',
              ruleId: '',
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
               /*  ruleIds: [
                    {
                        type: 'array',
                        required: true,
                        message: '请至少选择一条规则',
                        trigger: 'change',
                    },
                ], */
            },
            currentPage: 1,
            searchStr: '',
            total: 0,
        };
    },
    mounted() {
      console.log('初始化');
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
        openEdit(data){
          console.log(data);
          this.isOpen = true;
          if(data){
            for(let key in this.deptInfo){
              this.deptInfo[key] = data[key];
            }
          }
        },
        closeDialog() {
            this.isOpen = false;
            this.deptInfo.id = '';
            this.$refs.deptForm.resetFields();
        },
        addOrUpdate() {
            this.$refs.deptForm.validate(valid => {
                if (valid) {
                    if (this.deptInfo.id) {
                        this.$api.post('/sysDept/update',this.deptInfo,success => {
                                this.$message.success(success);
                                this.closeDialog();
                                this.queryByPage();
                            }, fal => {
                                this.$message.error(fal);
                            }
                        );
                    } else {
                        this.$api.post('/sysDept/add',this.deptInfo,success => {
                                this.$message.success(success);
                                this.closeDialog();
                                this.queryByPage();
                            },fal => {
                                this.$message.error(fal);
                            }
                            
                        );
                    }
                } else {
                    return false;
                }
            });
        },
        delDept(data) {
           this.$confirm('删除部门:<strong>'+data.deptName+'</strong>&nbsp?', '删除', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.$api.get('/sysDept/del',{ id: data.id },success => {
                    this.$message.success(success);
                    this.queryByPage();
                  }, fal => {
                      this.$message.success(fal);
                  }
              );
          })
        },
    },
};
</script>
