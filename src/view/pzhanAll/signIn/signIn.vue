<template>
    <div>
        <row>
            <i-col style="margin-bottom:20px;">
                <i-button type="primary" @click='oNewSign(true)'>新增图片</i-button>
            </i-col>
            <i-col>
                <i-table style="width:100%;min-width:600px;" :columns="signColumn" :data="signList"></i-table>
            </i-col>
        </row>
        <Modal v-model="signModal" title="新建标签" @on-ok="inputNewSign()" @on-cancel="oNewSign(false)">
            <row style="margin-bottom:20px;">
                <i-col>
                    日期
                </i-col>
                <i-col>
                    <Input v-model="signData.day" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    奖励分量
                </i-col>
                <i-col>
                    <Input v-model="signData.reward" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    奖励方法
                </i-col>
                <i-col>
                    <Input v-model="signData.method" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    奖励图片
                </i-col>
                <i-col>
                    <Input v-model="signData.img" />
                </i-col>
            </row>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            signModal: false,
            isNewSign: false,
            currentId: "",
            signData: {
                day: "",
                reward: "",
                method: "",
                img: ""
            },
            signColumn: [
                {
                    title: "日期",
                    key: "day"
                },
                {
                    title: "奖励分量",
                    key: "reward"
                },
                {
                    title: "类型",
                    key: "type"
                },
                {
                    title: "奖励方法",
                    key: "method"
                },
                {
                    title: "奖励图片",
                    render: (h, params) => {
                        return h(
                            "img",
                            {
                                attrs: {
                                    src: params.row.img,
                                    style:
                                        "height:50px;margin:0 auto;display:block;"
                                }
                            },
                            ""
                        );
                    }
                },
                {
                    title: "操作",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "i-button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentId = params.row.id;
                                            this.signData.day = params.row.day;
                                            this.signData.reward =
                                                params.row.reward;
                                            this.signData.method =
                                                params.row.method;
                                            this.signData.img = params.row.img;
                                            this.oNewSign(true);
                                            this.isNewSign = false;
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "i-button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentId = params.row.id;
                                            this.deleteSign();
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            signList: []
        };
    },
    methods: {
        oNewSign(i) {
            if (i) {
                this.isNewSign = true;
            }
            this.signModal = i;
        },
        inputNewSign() {
            if (this.isNewSign) {
                // this.signData = {
                //         day:'',
                //         reward:'',
                //         method:'',
                //         img:''
                //     }
                //新建规则
                axios
                    .request({
                        url: "sign_tasks",
                        method: "post",
                        data: {
                            day: this.signData.day,
                            reward: this.signData.reward,
                            type: "point",
                            // type:this.signData.type,
                            method: this.signData.method,
                            img: this.signData.img
                        }
                    })
                    .then(res => {
                        this.signData = {
                            day: "",
                            reward: "",
                            method: "",
                            img: ""
                        };
                        this.getSignTask();
                        this.$Message.success("新建成功");
                    });
            } else {
                //编辑规则
                axios
                    .request({
                        url: "sign_tasks/" + this.currentId,
                        method: "put",
                        data: {
                            day: this.signData.day,
                            reward: this.signData.reward,
                            type: "point",
                            // type:this.signData.type,
                            method: this.signData.method,
                            img: this.signData.img
                        }
                    })
                    .then(res => {
                        this.signData = {
                            day: "",
                            reward: "",
                            method: "",
                            img: ""
                        };
                        this.getSignTask();
                        this.$Message.success("编辑成功");
                    });
            }
        },
        deleteSign() {
            axios
                .request({
                    url: "sign_tasks/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.getSignTask();
                    this.$Message.success("删除成功");
                });
        },
        getSignTask() {
            axios
                .request({
                    url: "sign_tasks",
                    method: "get"
                })
                .then(res => {
                    this.signList = res.data;
                });
        }
    },
    mounted() {
        this.getSignTask();
    }
};
</script>

<style scoped>
</style>