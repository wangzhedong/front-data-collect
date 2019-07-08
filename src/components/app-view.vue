<template>
  <el-container
    class="app-container"
    :class="{
    'mini-side': isCollapse,
    'hide-side': hideSide
  }"
  >
    <el-header class="app-header" :height="headerHeight + 'px'">
      <app-header
        @switch="handleSideSwitch"
        @set-theme="handleSetTheme"
        @hide-side="handleSwitchHideSide"
      ></app-header>
    </el-header>

    <el-container>
      <el-aside
        class="app-side"
        :width="hideSide ? '0' : sideWidth + 'px'"
        :style="{background: theme.theme.backgroundColor}"
      >
        <app-side style="margin-top:20px" :isCollapse="true" :datas="menusData"></app-side>
      </el-aside>
      <el-container>
        <el-main class="app-page-body">
          <div class="page-header">
            <el-breadcrumb>
              <el-breadcrumb-item :to="{path: '/'}">首页</el-breadcrumb-item>
              <el-breadcrumb-item>Table表格数据</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view></router-view>
        </el-main>
        <el-footer class="app-footer" :height="footerHeight + 'px'">
          <app-footer></app-footer>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script type="text/javascript">
import AppHeader from '@/components/app-header';
import AppFooter from '@/components/app-footer';
import AppSide from '@/components/app-side';
import { menus } from '@/data/menuData';
export default {
    name: 'app-view',
    data() {
        return {
            menusData: menus,
            isCollapse: false,
            hideSide: false,
            sideWidth: 120,
            footerHeight: 50,
            headerHeight: 65,
            theme: { theme: {} },
        };
    },
    components: {
        AppHeader,
        AppFooter,
        AppSide,
    },
    mounted:function(){
      //this.$router.push('/users')

    },
    methods: {
        handleSideSwitch(val) {
            this.isCollapse = val;
            this.sideWidth = val ? 60 : 200;
        },
        handleSwitchHideSide() {
            this.hideSide = !this.hideSide;
        },
        handleSetTheme(theme) {
            console.info(theme);
            this.theme = theme;
        },
    },
};
</script>
<style lang="scss">
body{
  overflow: hidden;
  padding: 0;
  margin: 0;
  color: #464C5B;
  font-size: 14px;
  line-height: 2.4;
}
.app-container {
    margin: 0 auto;
    position: absolute;
    width: 100%;
    height: 100%;
    .app-header {
        padding: 0;
        background: #ecf0f5;
        z-index: 100;
    }
    .app-side {
        //overflow: hidden;
        width: 200px;
        transition: all 0.5s ease;
    }
    .app-footer {
        background: #fff;
        border-top: solid 1px rgba(48, 54, 62, 0.14);
    }
    .app-page-body {
        overflow-y: auto;
        margin-top:20px;
        padding: 0px;
        height: 100%;
        margin-left: 10px;
        .page-header{
          margin: 20px 20px;
        }
    }
}

/* .app-container .app-container .app-body {
    background: #ecf0f5;
    padding: 0;
} */
.app-header-logo-box {
    padding: 15px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .header-logo {
        height: 42px;
        margin-top: -17px;
        margin-right: 5px;
        vertical-align: middle;
    }
    .header-logo-text {
        font-size: 20px;
        font-weight: bold;
        opacity: 1;
    }
}

/*mini-side*/
.app-container.mini-side .app-side {
    overflow: visible;
}
.app-container.mini-side .app-side .el-menu--collapse {
    width: 60px;
}
.app-container.mini-side .header-logo {
    margin-left: -10px;
}
.app-container.mini-side .header-logo-text {
    opacity: 0;
}
/*hide-side*/
.app-container.hide-side .app-side {
    display: none;
}
</style>
