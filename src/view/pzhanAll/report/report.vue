<template>
    <div>
        <row>
            <i-col span='18' style="margin-bottom:20px;">
                <Page :total="total" :page-size="per_page" @on-change='changePage' />
            </i-col>
            <i-col span='6'>
                <!-- <i-button type="primary" @click='openReasonModal()'>管理举报原因</i-button> -->
            </i-col>
            <i-col span='24'>
                <i-table style="width:100%;min-width:600px;" :columns="reportsColumn" :data="reportsList"></i-table>
            </i-col>
        </row>
        <Modal v-model="reasonModal" width='800px' title="举报原因">
            <row>
                <i-col style="margin-bottom:10px;">
                    <i-button type="primary" @click='oNew()'>新增</i-button>
                </i-col>
                <i-col>
                    <i-table style="width:100%;min-width:600px;" :columns="reasonColumn" :data="reasonList"></i-table>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="newModal" :title="reasonTitle" @on-ok="inpurReasonData" @on-cancel="openNewModal(false)">
            <row>
                <i-col span='4' style="line-height:30px;">
                    举报原因
                </i-col>
                <i-col span='20'>
                    <Input v-model="newReasonName" style="width: 300px" />
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
            total: 1,
            per_page: 1,
            currentPage: 1,

            byId:'',
            reasonModal: false,
            newModal: false,
            reasonTitle: "新增",
            newReasonName: "",
            isNewReason: false,
            currentId:'',

            reportsColumn: [
                {
                    title: "内容",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style:
                                        "text-overflow:ellipsis;white-space:nowrap;overflow:hidden;"
                                }
                            },
                            params.row.content.content
                        );
                    }
                },
                {
                    title: "举报原因",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style: ""
                                }
                            },
                            params.row.cause
                        );
                    }
                },
                {
                    title: "举报人",
                    width: 100,
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style: ""
                                }
                            },
                            params.row.report_fan.nickname
                        );
                    }
                },
                {
                    title: "举报人ID",
                    width: 100,
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style: ""
                                }
                            },
                            params.row.report_fan.id
                        );
                    }
                },
                {
                    title: "被举报人",
                    width: 100,
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style: "color:red"
                                }
                            },
                            params.row.bereport_fan.nickname
                        );
                    }
                },
                {
                    title: "被举报人ID",
                    width: 100,
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style: "color:red"
                                }
                            },
                            params.row.bereport_fan.id
                        );
                    }
                },{
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
                                            this.byId = params.row.id
                                            this.byReport(1)
                                        }
                                    }
                                },
                                "通过"
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
                                            this.byId = params.row.id
                                            this.byReport(0)
                                        }
                                    }
                                },
                                "不通过"
                            )
                        ]);
                    }
                }
            ],
            reportsList: [],

            reasonColumn: [
                {
                    title: "举报原因",
                    key: "comment"
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
                                            this.reasonTitle = '修改'
                                            this.isNewReason = false
                                            this.newReasonName = params.row.comment
                                            this.currentId = params.row.id
                                            this.openNewModal(true)
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
                                    nativeOn:{
                                        click: ()=>{
                                            this.currentId = params.row.id
                                            this.deleteReason()
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            reasonList: []
        };
    },
    methods: {
        getReports() {
            axios
                .request({
                    url: "show_report",
                    method: "post",
                    data: {
                        // 0 没处理  1 已处理
                        status: 0,
                        page: this.currentPage
                    }
                })
                .then(res => {
                    this.total = res.data.total;
                    this.per_page = res.data.per_page;
                    this.reportsList = res.data.data;
                });
        },
        getReportCause() {
            axios
                .request({
                    url: "report_causes",
                    method: "get"
                })
                .then(res => {
                    this.reasonList = res.data;
                });
        },
        changePage(index) {
            this.currentPage = index;
            this.getReports(this.currentPage);
        },
        openReasonModal() {
            this.getReportCause();
            this.openReason(true);
        },
        openReason(i) {
            this.reasonModal = i;
        },
        oNew() {
            this.isNewReason = true;
            this.openReason(false);
            this.openNewModal(true);
        },
        onCancel() {
            this.openReason(true);
        },
        openNewModal(i) {
            if (!i) {
                this.onCancel();
            }
            this.newModal = i;
        },
        inpurReasonData() {
            if (this.isNewReason) {
                axios
                    .request({
                        url: "report_causes",
                        method: "post",
                        data: {
                            comment: this.newReasonName
                        }
                    })
                    .then(res => {
                        this.getReportCause();
                        this.onCancel();
                        this.$Message.success("success");
                    });
            }else{
                axios
                    .request({
                        url: "report_causes/"+this.currentId,
                        method: "put",
                        data: {
                            comment: this.newReasonName
                        }
                    })
                    .then(res => {
                        this.getReportCause();
                        this.onCancel();
                        this.$Message.success("success");
                    });
            }
        },
        deleteReason(){
            axios
                    .request({
                        url: "report_causes/"+this.currentId,
                        method: "delete"
                    })
                    .then(res => {
                        this.getReportCause();
                        this.$Message.success("success");
                    });
        },
        byReport(x){
            axios
                    .request({
                        url: "verify",
                        method: "post",
                        data:{
                            report_id:this.byId,
                            verify:x
                        }
                    })
                    .then(res => {
                        this.getReports();
                        this.$Message.success("success");
                    });
        }
    },
    mounted() {
        this.getReports();
    }
};
</script>

<style scoped>
</style>