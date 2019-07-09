<template>
  <div>
    <el-row>
      <el-button round icon="el-icon-plus" type="primary" size="medium" @click="openAdd">新增</el-button>
    </el-row>
    <el-table height="350" :data="tableData" style="width: 100%;">
      <el-table-column prop="ruleName" label="规则名称"></el-table-column>
      <el-table-column label="关键字">
        <template slot-scope="scope">
          <el-tag
            style="margin: 2px 3px"
            v-for="(detail,index) in JSON.parse(scope.row.ruleDetail)"
            :key="index"
            type="success"
            size="mini"
            effect="dark"
          >{{ detail.keyword }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="360px">
        <template slot-scope="scope">
          <el-button type="text" @click="openEdit(scope.row)" size="small">修改规则信息</el-button>
          <el-button type="text" @click="delRule(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--修改或者新增规则的弹窗-->
    <el-dialog
      width="550px"
      @close="closeDialog"
      :title="ruleInfo.id?'修改规则':'新增规则'"
      :close-on-click-modal="false"
      :visible.sync="isOpen"
    >
      <el-form :model="ruleInfo" ref="ruleForm" label-width="100px">
        <el-form-item label="规则名称" 
            prop="ruleName"
            :rules="[
                {required: true,message: '请输入规则名称',trigger: 'blur'},
                {pattern: /^\S+$/,message: '规则名必须为非空字符串',trigger: 'blur'}
            ]"
            >
          <el-input maxlength="16" v-model="ruleInfo.ruleName"></el-input>
        </el-form-item>
        <div v-for="(detail,index) in ruleInfo.ruleDetail"
            :key="index">
            <el-form-item
                v-if="index == 0"
                :prop="'ruleDetail.' + index + '.keyword'"
                :rules="{
                    required: true, message: '关键字不能为空', trigger: 'blur'
                }" 
                :label="'关键字'+(index+1)">
            <el-input style="width:70%" maxlength="16" v-model="detail.keyword"></el-input>
            <el-button @click="addDetail">新增关键字</el-button>
            </el-form-item> 
            <el-form-item v-else  
                :prop="'ruleDetail.' + index + '.keyword'"
                :rules="{
                    required: true, message: '关键字不能为空', trigger: 'blur'
                }"
                :label="'关键字'+(index+1)">
                <el-input style="width:70%" maxlength="16" v-model="detail.keyword"></el-input>
                <el-button @click="delDetail(index)">删除关键字</el-button>
            </el-form-item>
        </div>
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
    name: 'rules',
    data() {
        return {
            tableData: [],
            isOpen: false,
            ruleInfo: {
                id: '',
                ruleName: '',
                ruleDetail: [{keyword:''}],
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
                '/rule/queryByPage',
                {
                    pageSize: 10,
                    pageIndex: this.currentPage,
                    search: this.searchStr,
                },
                res => {
                    if (res.records) {
                        this.tableData = res.records;
                        this.total = res.total;
                    }
                },
                fal => {
                    this.$message.error(fal);
                }
            );
        },
        openAdd() {
            this.isOpen = true;
        },
        addDetail(){
            this.ruleInfo.ruleDetail.push({keyword:''});
        },
        delDetail(index){
            this.ruleInfo.ruleDetail.splice(index, 1)
        },
        openEdit(data) {
            this.isOpen = true;
            if (data) {
                for (let key in this.ruleInfo) {
                    if(key ==='ruleDetail'){
                        this.ruleInfo[key] = JSON.parse(data[key])
                    }else{
                        this.ruleInfo[key] = data[key];
                    }
                }
            }
        },
        closeDialog() {
            this.isOpen = false;
            this.ruleInfo.id = '';
            this.$refs.ruleForm.resetFields();
        },
        addOrUpdate() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let data = {};
                    for(let key in this.ruleInfo){
                        if(key === 'ruleDetail'){
                            data[key] = JSON.stringify(this.ruleInfo[key])
                        }else{
                            data[key] = this.ruleInfo[key]
                        }
                    }
                    if (this.ruleInfo.id) {
                        this.$api.post('/rule/update',data,success => {
                                this.$message.success(success);
                                this.closeDialog();
                                this.queryByPage();
                            }, fal => {
                                this.$message.error(fal);
                            }
                        );
                    } else {
                        this.$api.post('/rule/add',data,success => {
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
        delRule(data) {
            this.$confirm(
                '删除:<strong>' + data.ruleName + '</strong>会影响部门规则，是否确定删除&nbsp?',
                '删除',
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                this.$api.get(
                    '/rule/del',
                    { id: data.id },
                    success => {
                        this.$message.success(success);
                        this.queryByPage();
                    },
                    fal => {
                        this.$message.success(fal);
                    }
                );
            });
        },
    },
};
</script>
