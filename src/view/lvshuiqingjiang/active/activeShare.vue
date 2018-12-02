<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='success' @click='openSet()'>分享设置</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <!-- <Page :total="total" :page-size="pre_page" :on-change='changePage' /> -->
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:800px;" :columns="memberColunm" :data="memberList"></i-table>
            </i-col>
        </row>
        <Modal v-model="activeModal" title='活动分享设置' @on-ok="inputSet()" @on-cancel="cancelActive(false)">
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    分享活动开关
                </i-col>
                <i-col span='20'>
                    <i-switch v-model="task.status" :true-value='1' :false-value='0' />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    分享任务数
                </i-col>
                <i-col span='20'>
                    <Input min- v-model="task.task" :min="0" />
                </i-col>
            </row>
        </Modal>
        <Modal v-model="checkModal" title='确认核销' @on-ok="inputCheck()" @on-cancel="cancelCheck(false)">
            <p style="text-align:center;">确认<span style="color:red;">{{currentName}}</span>完成了任务？</p>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
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
                                        disabled:params.row.flag === 1?true:false
                                    },
                                    attrs: {
                                        style: "font-size:12px"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentId = params.row.fan_id
                                            this.currentName = params.row.name
                                            this.cancelCheck(true)
                                        }
                                    }
                                },
                                "确认"
                            )
                        ]);
                    }
                }
            ],
            memberList: [],
            task: {
                task: 0,
                status: 0,
                reward:0,
            },
            activeModal: false,

            currentName:'',
            currentId:'',
            checkModal:false
        };
    },
    methods: {
        cancelCheck(i){
            this.checkModal = i
        },
        cancelActive(i) {
            this.activeModal = i;
        },
        inputCheck(){   
            axios
                .request({
                    url: "share/over/check-register",
                    method: "post",
                    data:{
                        fan_id: this.currentId
                    }
                })
                .then(res => {
                    this.spinShow = false;
                    this.getMember()
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
                    this.spinShow = false;
                });
        },
        inputSet() {
            this.spinShow = true
            axios
                .request({
                    url: "share/tasks/1",
                    method: "put",
                    data:{
                        reward:this.task.reward,
                        status:this.task.status,
                        task_target:this.task.task
                    }
                })
                .then(res => {
                    this.$Message.success('修改成功')
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
        this.getMember();
        this.getSet();
    }
};
</script>

<style scoped>
</style>