<template>
    <div>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建等级</Button>
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:800px;" :columns="groupColumn" :data="groupList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" title='会员等级' @on-ok="inputGroupData" @on-cancel="cancleData(false)">
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    等级名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="groupData.name" />
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    所需积分
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="groupData.value"></InputNumber>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteShow" title='删除' @on-ok="deleteGroup" @on-cancel="deleteModal(false)">
            是否删除 <span style="color:red;">{{currentName}}</span> ?
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            isNew: false,
            dataModal: false,
            deleteShow: false,
            currentId: "",
            currentName: "",
            groupColumn: [
                {
                    title: "等级名称",
                    key: "name"
                },
                {
                    title: "所需积分",
                    key: "value"
                },
                {
                    title: "初始等级",
                    key: "default",
                    render: (h, params) => {
                        return h(
                            "i-switch",
                            {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: params.row.default
                                },
                                nativeOn: {
                                    click: () => {
                                        this.currentId = params.row.id
                                        this.setDefail();
                                    }
                                }
                            },
                            0
                        );
                    }
                },
                {
                    title: "编辑",
                    width: 200,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    attrs: {
                                        style: "font-size:12px"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.isNew = false;
                                            this.currentId = params.row.id;
                                            this.groupData.name = params.row.name
                                            this.groupData.default = params.row.default
                                            this.groupData.value = params.row.value
                                            this.cancleData(true);
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    attrs: {
                                        style:
                                            "font-size:12px;margin-left:10px;"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.deleteModal(true);
                                            this.currentId = params.row.id;
                                            this.currentName = params.row.name;
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            groupList: [],
            groupData: {
                name: "",
                default: 0,
                value: 0
            }
        };
    },
    methods: {
        getGroupList() {
            axios
                .request({
                    url: "member/groups",
                    method: "get"
                })
                .then(res => {
                    this.groupList = res.data;
                });
        },
        cancleData(i) {
            this.dataModal = i;
        },
        deleteModal(i) {
            this.deleteShow = i;
        },
        newData() {
            this.groupData = {
                name: "",
                default: 0,
                value: 0
            };
            this.cancleData(true);
        },
        inputGroupData() {
            if(this.groupData === '' || this.groupData.value === ''){
                this.$Message.error('等级资料不能为空')
                return false
            }
            axios
                .request({
                    url: "member/groups",
                    method: "post",
                    data: {
                        name: this.groupData.name,
                        // default: this.groupData.default,
                        value: this.groupData.value
                    }
                })
                .then(res => {
                    this.$Message.success("新增成功");
                    this.getGroupList();
                });
        },
        deleteGroup() {
            axios
                .request({
                    url: "member/groups/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success("删除成功");
                    this.getGroupList();
                });
        },
        setDefail() {
            axios
                .request({
                    url: "member/groups/" + this.currentId + "/default",
                    method: "get"
                })
                .then(res => {
                    this.$Message.success("修改成功");
                    this.getGroupList();
                });
        }
    },
    mounted() {
        this.getGroupList();
    }
};
</script>

<style scoped>
</style>
