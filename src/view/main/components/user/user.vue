<template>
  <div class="user-avator-dropdown">
      <!-- <Avatar :src="userAvator"/> -->
      <span>{{username}}({{role}})</span>
    <Dropdown @on-click="handleClick">
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="intoUser">个人资料</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapState,mapActions } from 'vuex'
export default {
  name: 'User',
  data(){
    return {
      username:'',
      role:''
    }
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  mounted(){
    this.getUserName()
  },
  methods: {
    getUserName(){
      this.username = localStorage.getItem('name')
      this.role = localStorage.getItem('role')
    },
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            clearInterval('Intime')
            this.$router.push({
              name: 'login'
            })
          })
          break
          case 'intoUser':
          this.$router.push({
              path:'/userSet'
            })
          break
      }
    }
  }
}
</script>
