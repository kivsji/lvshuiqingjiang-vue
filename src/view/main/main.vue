<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed">
      <side-menu accordion :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator" />
          <!-- <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/> -->
          <!-- <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/> -->
        </header-bar>
      </Header>
      <Content>
        <Layout>
          <!-- <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag" />
          </div> -->
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from "./components/side-menu";
import HeaderBar from "./components/header-bar";
import TagsNav from "./components/tags-nav";
import User from "./components/user";
import Fullscreen from "./components/fullscreen";
import Language from "./components/language";
import { mapMutations, mapActions } from "vuex";
import { getNewTagList, getNextName } from "@/libs/util";
import minLogo from "@/assets/images/slogo33.png";
import maxLogo from "@/assets/images/logo33.png";
import axios from "@/libs/api.request";
import "./main.less";
export default {
  name: "Main",
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User
  },
  data() {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    };
  },
  computed: {
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    userAvator() {
      return this.$store.state.user.avatorImgPath;
    },
    cacheList() {
      return this.tagNavList.length
        ? this.tagNavList
            .filter(item => !(item.meta && item.meta.notCache))
            .map(item => item.name)
        : [];
    },
    menuList() {
      let menuL = this.$store.getters.menuList
      for(let i=0;i<menuL.length;i++){
        if(menuL[i].name === '组织架构' && localStorage.getItem('role') !== 'Admin'){
          menuL.splice(i,1)
        }else if(this.$store.getters.menuList[i].name === '事项管理'){
          for(let j=0;j<menuL[i].children.length;j++){
            if(menuL[i].children[j].name === "newMatter" && (localStorage.getItem('role') !== 'Admin' &&  localStorage.getItem('role') !== 'Offcial_Admin')){
              menuL[i].children.splice(j,1)
            }
          }
        }
      }
      return menuL;
    },
    local() {
      return this.$store.state.app.local;
    }
  },
  methods: {
    ...mapMutations(["setBreadCrumb", "setTagNavList", "addTag", "setLocal"]),
    ...mapActions(["handleLogin"]),
    turnToPage(name) {
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name: name
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, name) {
      const nextName = getNextName(this.tagNavList, name);
      this.setTagNavList(res);
      if (type === "all") this.turnToPage("upcomingMatter");
      else if (this.$route.name === name) this.$router.push({ name: nextName });
    },
    handleClick(item) {
      this.turnToPage(item.name);
    }
  },
  watch: {
    $route(newRoute) {
      this.setBreadCrumb(newRoute.matched);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    }
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    try {
      this.setTagNavList([
        // {"name":"活动列表",
        // "path":"/active",
        // "meta":{"icon":"ios-list-box-outline","title":"活动列表"}
        // }
      ]);
    } catch (error) {
      console.log(123);
    }
    
    // this.addTag(this.$store.state.app.homeRoute);
    this.setBreadCrumb(this.$route.matched);
    // 设置初始语言
    this.setLocal(this.$i18n.locale);
    // 文档提示
    window.router = this.$router;
  }
};
</script>
