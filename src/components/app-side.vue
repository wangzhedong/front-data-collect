<template>
  <el-menu :default-active="active" :collapse="isCollapse" @select="select">
    <el-menu-item v-for="item in datas" :key="item.id" :index="item.path">
      <i :class="item.icon"></i>
      <span slot="title">{{item.label}}</span>
    </el-menu-item>
  </el-menu>
</template>
<script type="text/javascript">
export default {
    props: {
        datas: Array,
        isCollapse: Boolean,
    },
    data() {
        return {
            active: '',
        };
    },
    created() {
        this.active = this.$router.currentRoute.name;
    },
    methods: {
        select(path){
            console.log(path);
            if('home' === path ){
                 this.$router.push('/')
            }else{
                //this.$router.replace({name:'组件B名称', params: {参数}}, () => { this.warning('test!') }, () => { this.warning('test!') }) 
                this.$router.push('/'+path)
            }
        }
    },
    
};
</script>
<style lang="scss">
// .el-menu {
//     .side-menu {
//         border-right: none;
//     }
//     .fa {
//         font-size: 18px;
//         margin-right: 7px;
//         display: inline-block;
//         width: 23px;
//         text-align: center;
//     }
//     .side-menu .el-menu-item.is-active {
//         color: #409eff;
//         border-right: solid 2px #36c1fa;
//         background: #eef3f5;
//     }
// }
.el-menu {
    border-right: solid 0px #e6e6e6;
    .el-menu-item.is-active {
        color: #606266;
        border-left: 4px solid #20a0ff;
    }
}
.el-tooltip .fa {
    font-size: 20px;
    display: inline-block;
    text-align: center;
}
</style>
