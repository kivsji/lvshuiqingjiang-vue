<template>
    <div>
        <row>
            <i-col>
                <Page :total="total" :page-size='pageSize' @on-change='changePage' />
            </i-col>
            <i-col>
                <i-table style="width:100%;min-width:600px;margin-top:30px;" :columns="commentsColumn" :data="commentsList"></i-table>
            </i-col>
        </row>
        <Modal v-model="reviewModal" width='800px' title="预览图" :footer-hide='true'>
            <row>
                <i-col style="margin:0 auto;height:700px;overflow-y:scroll;">
                    <img :src="item.url" width="50%" style="float:left;" v-for="item in reviewPic">
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="removeCommunity()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;color:red;text-align:center;">是否删除此说说</p>
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
            pageSize: 1,
            currentPage:1,
            reviewModal: false,
            deleteModal: false,
            currentId:'',
            commentsColumn: [
                {
                    title: "内容",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style:
                                        "overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                                }
                            },
                            params.row.content
                        );
                    }
                },
                {
                    title: "发出人",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style:
                                        "overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                                }
                            },
                            params.row.fan.nickname
                        );
                    }
                },
                {
                    title: "日期",
                    key: "created_at"
                },
                {
                    title: "查看图片",
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
                                            this.openReviewModal(true);
                                            this.reviewPic = params.row.photos;
                                        }
                                    }
                                },
                                "查看"
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
                                            this.openDelete(true);
                                            this.currentId = params.row.id;
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            commentsList: [],
            reviewPic: []
        };
    },
    methods: {
        openDelete(i) {
            this.deleteModal = i;
        },
        changePage(index) {
            this.currentPage = index;
            this.getSocials();
        },
        openReviewModal(i) {
            this.reviewModal = i;
        },
        getSocials() {
            axios
                .request({
                    url: "socials?page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.total = res.data.total;
                    this.pageSize = res.data.per_page;
                    this.commentsList = res.data.data;
                    if(this.currentPage !== 1 && this.commentsList.length === 0){
                        this.currentPage--
                        this.getSocials()
                    }
                });
        },
        removeCommunity() {
            axios
                .request({
                    url: "socials/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.getSocials();
                });
        }
    },
    mounted() {
        this.getSocials();
    }
};
</script>

<style scoped>
</style>