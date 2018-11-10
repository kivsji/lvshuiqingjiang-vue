<template>
    <div>
        <row>
            <i-col>
                <i-button type="primary" @click='openNew(true)'>新增Tag</i-button>
            </i-col>
            <i-col style="margin-top:20px;">
                <Page :total="total" :page-size="per_page" @on-change='changePage'/>
            </i-col>
            <i-col style="margin-top:20px;">
                <i-table style="min-width:1200px;" :columns="receivedColumn" :data="receivedData"></i-table>
            </i-col>
        </row>
        <Modal v-model="newModal" :title="reviewTitle" @on-ok="newTag" @on-cancel="openNew(false)">
            <row>
                <i-col>
                    tag名字
                </i-col>
                <i-col>
                    <Input v-model="newTagName" style="width: 300px" />
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="removeTag()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    是否删除标签---  <span style="color:red;">{{removeName}}</span> ----
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
            total:1,
            per_page:50,
            currentPage:1,
            receivedColumn: [
                {
                    title: "tagId",
                    key: "id"
                },
                {
                    title: "tag名称",
                    key: "name"
                },
                {
                    title: "编辑",
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
                                            this.isNew = false;
                                            this.openNew(true);
                                            this.editTagId = params.row.id;

                                            this.newTagName = params.row.name;
                                        }
                                    }
                                },
                                "修改"
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
                                            this.removeId = params.row.id
                                            this.removeName = params.row.name
                                            this.openDelete(true)
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            isNew: true,
            reviewTitle: "新增tag",
            newTagName: "",
            editTagId: "",
            newModal: false,
            deleteModal:false,
            removeId:'',
            removeName:'',
            receivedData: []
        };
    },
    methods: {
        changePage(index){
            this.currentPage = index
            this.getTags(this.currentPage)
        },
        getTags(currentPage) {
            axios
                .request({
                    url: "tags?page="+currentPage,
                    method: "get"
                })
                .then(res => {
                    this.total = res.data.total
                    this.per_page = res.data.per_page
                    
                    this.receivedData = []
                    for (var i in res.data.data) {
                        this.receivedData.push(res.data.data[i]); 
                    }
                });
        },
        //openNew
        openNew(i) {
            if (this.isNew) {
                this.reviewTitle = "新增tag";
                this.newTagName = "";
            } else {
                this.reviewTitle = "修改tag";
            }
            this.newModal = i;
        },

        //新增tag
        newTag() {
            if (this.isNew) {
                if (this.newTagName !== "") {
                    axios
                        .request({
                            url: "tags",
                            method: "post",
                            data: {
                                name: this.newTagName
                            }
                        })
                        .then(res => {
                            this.isNew = true;
                            this.$Message.success("success");
                            this.getTags(this.currentPage);
                        });
                }else{
                    this.$Message.error("tag名不能为空");
                }
            } else {
                this.editTag();
            }
        },

        //修改tag
        editTag() {
            if (this.newTagName !== "") {
                axios
                    .request({
                        url: "tags/" + this.editTagId,
                        method: "put",
                        data: {
                            name: this.newTagName
                        }
                    })
                    .then(res => {
                        this.isNew = true;
                        this.$Message.success("success");
                        this.getTags(this.currentPage);
                    });
            }else{
                this.$Message.error("tag名不能为空");
            }
        },



        openDelete(i){
            this.deleteModal = i
        },
        //删除
        removeTag() {
            axios
                .request({
                    url: "tags/" + this.removeId,
                    method: "delete"
                })
                .then(res => {
                    this.isNew = true;
                    this.$Message.success("success");
                    this.getTags(this.currentPage);
                });
        }
    },
    mounted() {
        this.getTags(this.currentPage);
    }
};
</script>

<style scoped>
</style>