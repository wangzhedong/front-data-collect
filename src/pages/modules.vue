<template>
    <div>
        <el-row style="padding: 20px">
            <el-input size="small" style="width: 30%" placeholder="搜索" clearable prefix-icon="el-icon-search" v-model.trim="filterText"></el-input>
        </el-row>
        <el-row style="margin-bottom: 10px;padding-left: 20px">
            <el-button icon="el-icon-plus" type="primary" @click="addModule">新增</el-button>
        </el-row>
        <el-card v-for="m in moduleCards" :key="m.id" class="box-card">
            <div slot="header" class="clearfix">
                <span>模块名称</span>
                <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
            </div>
            <div>卡片</div>
        </el-card>

        <!--修改或新增模块信息弹出框-->
        <el-dialog
        :visible="isOPenModule"
        @close="closeModule"
        width="550px"
        :title="userInfo.id?'修改模块':'新增模块信息'"
        :close-on-click-modal="false"
        >
        <el-form
            :model="moduleInfo"
            ref="userForm"
            :rules="rules"
            label-width="100px"
            style="padding: 0 20px"
        >
            <el-form-item label="模块名称" prop="userName">
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
export default {
    name:'modules',
    data(){
        return {
            isOPenModule:false,
            moduleInfo:{},
            filterText:'',
            moduleCards:[
                {id:1},
                {id:2},
                {id:3},
                {id:4}
            ]
        }
    },
    methods:{
        editModule(data){
            this.userModel = true;
            if(data){
                this.moduleInfo = Object.assign({}, data);
            }else{

            }
        },
        closeModule() {
            this.userModel = false;
            this.userInfo = {};
            this.$refs.userForm.clearValidate();
        },
    }

}
</script>
<style scoped>
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        display: inline-block;
        margin: 15px;
        width: 400px;
        height: 250px;
    }
</style>

