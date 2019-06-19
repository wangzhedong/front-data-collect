<template>
  <el-row :gutter="10" type="flex">
    <el-col :span="4">
      <div class="app-header-logo-box">
        <img src="../assets/logo.png" alt class="header-logo">
        <span class="header-logo-text">数据收集</span>
      </div>
    </el-col>
    <!-- <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
      <div class="grid-content bg-purple-light"></div>
    </el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">
      <div class="grid-content bg-purple"></div>
    </el-col> -->
    <el-col :offset="16" :span="6">
      <div class="">
        <el-dropdown>
          <div class = "user-box">
            <img src="../assets/user.jpg" alt style="border-radius: 3px;vertical-align: middle;">
            <span>王哲冬</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>用户信息</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item>注销</el-dropdown-item>
            <el-dropdown-item>退出账号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>
</template>
<script type="text/javascript">
import { mapActions, mapState } from 'vuex';
import { requestFullScreen, exitFullscreen } from '@/utils';
import themes from './theme';
export default {
    name: 'app-header',
    data() {
        return {
            mini: false,
            isFullScreen: false,
            themes,
            themeType: '',
            showAside: true,
            theme: { theme: { headerTheme: 'info' } },
        };
    },
    computed: {
        // ...mapState({
        //   user: ({user}) => user.user
        // })
    },
    watch: {
        themeType(val) {
            this.theme = this.themes.find(e => e.name === val) || {};
            this.$emit('set-theme', this.theme);
            localStorage.setItem('theme', val);
        },
    },
    methods: {
        //...mapActions(['getLoginUser', 'logout']),
        handleSwitchSide() {
            this.mini = !this.mini;
            this.$emit('switch', this.mini);
        },
        handleSwitchScreen() {
            if (this.isFullScreen) {
                exitFullscreen();
                this.isFullScreen = false;
            } else {
                requestFullScreen();
                this.isFullScreen = true;
            }
        },
        handleSwitchHideSide() {
            console.log('change');
            this.$emit('hide-side');
        },
    },
    created() {
        //this.getLoginUser();
        var theme = localStorage.getItem('theme') || 'default';
        this.themeType = theme;
    },
};
</script>
<style lang="scss">
.side-switch {
    display: inline-block;
    font-size: 32px;
    cursor: pointer;
    color: inherit;
    margin-top: 10px;
    :hover {
        color: #fff;
    }
}

.app-header-logo-box {
    padding: 15px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .header-logo {
        height: 50px;
        margin-top: -17px;
        margin-right: 5px;
        vertical-align: middle;
    }
    .header-logo-text {
        margin-left:20px; 
        font-size: 20px;
        font-weight: bold;
        opacity: 1;
    }
}

.user-box{
  margin-top: 15px;
}

</style>
