<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建标签</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <!-- <Page :total="total" :page-size="pre_page" :on-change='changePage' /> -->
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:800px;" :columns="tagColunm" :data="tagList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" :title='dataTitle' @on-ok="inputTag()" @on-cancel="tagShow(false)">
            <row>
                <i-col span='4' style="line-height:30px;">
                    标签名
                </i-col>
                <i-col span='20'>
                    <Input v-model="tagData" />
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title='删除标签' @on-ok="deleteTag()" @on-cancel="deleteShow(false)">
            是否删除标签 <span style='color:red'>{{deleteTagName}}</span>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            spinShow:false,
            total: 1,
            pre_page: 1,
            currentPage: 1,
            tagData: "",
            currentId: "",
            deleteTagName:'',
            dataModal: false,
            deleteModal:false,
            dataTitle: "新增",
            isNew: false,
            tagColunm: [
                {
                    title: "标签ID",
                    key: "id"
                },
                {
                    title: "标签名",
                    key: "name"
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
                                            this.currentId = params.row.id;
                                            this.tagData = params.row.name;
                                            this.dataTitle = "修改";
                                            this.isNew = false
                                            this.tagShow(true);
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
                                            this.currentId = params.row.id;
                                            this.deleteTagName = params.row.name
                                            this.deleteShow(true)
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            tagList: []
        };
    },
    methods: {
        changePage(index) {
            this.currentPage = index;
        },
        tagShow(i) {
            this.dataModal = i;
        },
        deleteShow(i) {
            this.deleteModal = i;
        },
        newData() {
            this.dataTitle = "新增";
            this.tagShow(true);
            this.isNew = true;
            this.tagData = "";
        },
        getTag() {
            this.spinShow = true
            axios
                .request({
                    url: "member/tags",
                    method: "get"
                })
                .then(res => {
                    this.tagList = res.data;
                    this.spinShow = false
                });
        },
        inputTag() {
            if (this.tagData === "") {
                this.$Message.error("标签名不能为空");
                return;
            }
            this.spinShow = true
            if (this.isNew) {
                axios
                    .request({
                        url: "member/tags",
                        method: "post",
                        data: {
                            name: this.tagData
                        }
                    })
                    .then(res => {
                        this.$Message.success("新建成功");
                        this.getTag();
                    });
            } else {
                axios
                    .request({
                        url: "member/tags/" + this.currentId,
                        method: "put",
                        data: {
                            name: this.tagData
                        }
                    })
                    .then(res => {
                        this.$Message.success("修改成功");
                        this.getTag();
                    });
            }
        },
        deleteTag() {
            this.spinShow = true
            axios
                .request({
                    url: "member/tags/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success("删除成功");
                    this.getTag();
                });
        }
    },
    mounted() {
        this.getTag();
    }
};
</script>

<style scoped>
</style>