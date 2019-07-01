<template>
  <div>
    <el-row>
      <el-button icon="el-icon-plus" type="primary" @click="openAdd">新增</el-button>
    </el-row>
    <el-table
      height="350"
      :data="tableData"
      style="width: 100%;"
    >
      <el-table-column prop="deptName" label="部门名称"></el-table-column>
      <el-table-column prop="uemail" label="部门编号"></el-table-column>
      <el-table-column fixed="right" label="操作" width="360px">
        <template slot-scope="scope">
          <el-button type="text" @click="editDept(scope.row)" size="small">修改部门信息</el-button>
          <el-button type="text" @click="delDept(scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
    name: 'depts',
    data() {
        return {
            tableData:[]
        }
    },
    methods: {
        openAdd() {},
        addOrUpdate() {},
        editDept(deptData){

        },
        delDept(deptData){
            
        }
    },
};
</script>
