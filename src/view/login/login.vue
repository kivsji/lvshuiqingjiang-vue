<style lang="less">
@import "./login.less";
</style>

<template>
    <row style="width:100%;height:100%;display:block;">
        <i-col span='24' style="width:100%;height:100%;display:block;">
            <div class="login">
                <div class="login-con">
                    <Card icon="log-in" title="欢迎登录" :bordered="false">
                        <div class="form-con">
                            <login-form @on-success-valid="handleSubmit"></login-form>

                            <!-- <Button type="primary" @click='intoLogin()'>登录</Button> -->
                            <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
                        </div>
                    </Card>
                </div>
            </div>
        </i-col>
    </row>

</template>

<script>
import axios from "@/libs/api.request";
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
    components: {
        LoginForm
    },
    data() {
        return {};
    },
    methods: {
        ...mapActions(["handleLogin"]),
        handleSubmit({ username, password }) {
            this.handleLogin({ username, password })
                .then(res => {
                    this.$router.push({
                        path: "/"
                    });
                    console.log(1);
                })
                .catch(res => {
                    console.log(2);
                    this.$Message.error("账号或密码错误，请重新登录");
                });
        }
    }
};
</script>

<style>
</style>
