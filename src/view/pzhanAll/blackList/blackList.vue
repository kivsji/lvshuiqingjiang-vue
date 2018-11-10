<template>
    <div>
        <row style="margin:20px 0;">
            <i-col>
                <Page :total="total" :page-size="per_page" @on-change='changePage'/>
            </i-col>
            <i-col span='24'>
                <i-table style="width:100%;min-width:600px;margin-top:30px;" :columns="blackListColumn" :data="blackList"></i-table>
            </i-col>
        </row>
        <Modal v-model="deleteModal" title="删除" @on-ok="removeBlackList()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;text-align:center;">是否解除此人禁言 ---- <span style="color:red;">{{currentName}}</span> ----</p>
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
            deleteModal:false,
            currentId:'',
            currentName:'',

            total:1,
            per_page:1,
            banState: 1,
            blackListColumn: [
                {
                    title: "名称",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style: ""
                                }
                            },
                            params.row.fan.nickname
                        );
                    }
                },
                {
                    title: "天数",
                    key: "day"
                },
                {
                    title: "理由",
                    key: "reason"
                },
                {
                    title: "编辑",
                    render: (h, params) => {
                        return h(
                            "i-button",
                            {
                                props: {
                                    type: "error",
                                    size: "small"
                                },
                                nativeOn: {
                                    click: () => {
                                        this.currentName = params.row.fan.nickname
                                        this.currentId = params.row.id
                                        this.openDelete(true)
                                    }
                                }
                            },
                            "去除"
                        );
                    }
                }
            ],
            blackList: []
        };
    },
    methods: {
        openDelete(i){
            this.deleteModal = i
        },
        changePage(index){
            axios
                .request({
                    url: "blacklist/ban?page="+index,
                    method: "post",
                    data: {
                        state: this.banState
                    }
                })
                .then(res => {
                    this.blackList = res.data.data;
                    this.total = res.data.total
                    this.pageSize = res.data.per_page
                });
        },
        getBlackList() {
            axios
                .request({
                    url: "blacklist/ban?page=1",
                    method: "post",
                    data: {
                        state: this.banState
                    }
                })
                .then(res => {
                    this.blackList = res.data.data;
                });
        },
        removeBlackList(){
            axios
                .request({
                    url: "blacklist/"+this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getBlackList();
                });
        }
    },
    mounted() {
        this.getBlackList();
    }
};
</script>

<style scoped>
</style>