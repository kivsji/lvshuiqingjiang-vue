<template>
    <div>
        <Spin
            size="large"
            fix
            v-if="spinShow"
        ></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button
                    type='success'
                    @click='openSet()'
                >分享设置</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <!-- <Page :total="total" :page-size="pre_page" :on-change='changePage' /> -->
            </i-col>
            <i-col>
                <i-table
                    size="large"
                    style="min-width:800px;"
                    :columns="memberColunm"
                    :data="memberList"
                ></i-table>
            </i-col>
        </row>
        <Modal
            v-model="activeModal"
            title='活动分享设置'
            @on-ok="inputSet()"
            @on-cancel="cancelActive(false)"
            :mask-closable="false"
        >
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    分享活动开关
                </i-col>
                <i-col span='20'>
                    <i-switch
                        v-model="task.status"
                        :true-value='1'
                        :false-value='0'
                    />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    分享任务数
                </i-col>
                <i-col span='20'>
                    <Input
                        min-
                        v-model="task.task"
                        :min="0"
                    />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    分享名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="task.name" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    分享描述
                </i-col>
                <i-col span='20'>
                    <Input v-model="task.introduce" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    分享封面
                </i-col>
                <i-col span='20'>
                    <Upload
                        :action="URL.UPLOAD_URL"
                        :on-success='successUpload'
                        :show-upload-list='false'
                        :headers="headers"
                    >
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <img
                        :src="task.img"
                        width="300px"
                        height="300px"
                        style="margin-top:10px;"
                    >
                </i-col>
            </row>
        </Modal>
        <Modal
            v-model="checkModal"
            title='确认核销'
            @on-ok="inputCheck()"
            @on-cancel="cancelCheck(false)"
        >
            <p style="text-align:center;">确认<span style="color:red;">{{currentName}}</span>完成了任务？</p>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
import URL from "_conf/url";
export default {
    data() {
        return {
            URL: {
                UPLOAD_URL: ""
            },
            spinShow: false,
            total: 1,
            pre_page: 1,
            currentPage: 1,
            memberColunm: [
                {
                    title: "id",
                    key: "id"
                },
                {
                    title: "名称",
                    key: "name"
                },
                {
                    title: "是否使用",
                    key: "flag"
                },
                {
                    title: "确认使用",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small",
                                        disabled:
                                            params.row.flag === 1 ? true : false
                                    },
                                    attrs: {
                                        style: "font-size:12px"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentId = params.row.fan_id;
                                            this.currentName = params.row.name;
                                            this.cancelCheck(true);
                                        }
                                    }
                                },
                                params.row.flag === 1 ? "已使用" : "确认使用"
                            )
                        ]);
                    }
                }
            ],
            memberList: [],
            task: {
                task: 0,
                status: 0,
                reward: 0,
                name: "",
                introduce: "",
                img: ""
            },
            activeModal: false,

            currentName: "",
            currentId: "",
            checkModal: false
        };
    },
    methods: {
        successUpload(file) {
            axios
                .request({
                    url: "qiniu/delete",
                    method: "post",
                    data: {
                        url: this.task.img
                    }
                })
                .then(res => {
                    this.task.img = file.url;
                });
        },
        cancelCheck(i) {
            this.checkModal = i;
        },
        cancelActive(i) {
            this.activeModal = i;
        },
        inputCheck() {
            axios
                .request({
                    url: "share/over/check-register",
                    method: "post",
                    data: {
                        fan_id: this.currentId
                    }
                })
                .then(res => {
                    this.spinShow = false;
                    this.getMember();
                });
        },
        openSet() {
            this.spinShow = true;
            this.getSet();
            this.cancelActive(true);
        },
        getSet() {
            axios
                .request({
                    url: "share/tasks",
                    method: "get"
                })
                .then(res => {
                    this.task.status = res.data.status;
                    this.task.task = res.data.task_target;
                    this.task.reward = res.data.reward;
                    this.task.name = res.data.name;
                    this.task.introduce = res.data.introduce;
                    this.task.img = res.data.img;
                    this.spinShow = false;
                });
        },
        inputSet() {
            this.spinShow = true;
            axios
                .request({
                    url: "share/tasks/1",
                    method: "put",
                    data: {
                        reward: this.task.reward,
                        status: this.task.status,
                        task_target: this.task.task,
                        name: this.task.name,
                        introduce: this.task.introduce,
                        img: this.task.img
                    }
                })
                .then(res => {
                    this.$Message.success("修改成功");
                    this.spinShow = false;
                });
        },
        getMember() {
            this.spinShow = true;
            axios
                .request({
                    url: "share/over/show",
                    method: "post",
                    data: {}
                })
                .then(res => {
                    this.memberList = res.data;
                    this.spinShow = false;
                });
        },
        changePage(index) {
            this.currentPage = index;
            this.getMember();
        }
    },
    mounted() {
        this.URL.UPLOAD_URL = URL.UPLOAD_URL;
        this.getMember();
        this.getSet();
    },
    computed: {
        headers() {
            return {
                token: Cookies.get("token")
            };
        }
    }
};
</script>

<style scoped>
</style>