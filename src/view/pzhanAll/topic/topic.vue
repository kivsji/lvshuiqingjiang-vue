<template>
    <div>
        <row style="margin:20px 0;">
            <i-col span='5'>
                <i-button style="margin-top: 10px;" type="primary" @click='oNew()'>新建</i-button>
            </i-col>
            <i-col span='24'>
                <i-table style="width:100%;min-width:600px;margin-top:30px;" :columns="topicColumn" :data="topicList"></i-table>
            </i-col>
        </row>
        <Modal style="width:500px;" v-model="newModal" :title="picModalTitle" @on-ok="inputData()" @on-cancel="cleanData()">
            <row style="margin-bottom:20px;">
                <i-col>
                    标题
                </i-col>
                <i-col>
                    <Input v-model="picData.title" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    <Spin fix v-if="spinShow">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传中~~~</div>
                    </Spin>
                    <Upload  style="margin-bottom:10px;" action="https://www.rdoorweb.com/pzhan/public/qiniu/upload" :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <img :src="picData.cover" width="200px">
                </i-col>
                <!-- <i-col>
                    <i-button style="margin-top: 10px;" type="primary" @click='openSelect(0)'>选择封面</i-button>
                </i-col>
                <i-col>
                    <div style="width:100%;height:230px;overflow-y:scroll;margin-top:20px;">
                        <div v-for='item in picData.cover' style="float:left;width:230px;overflow:hidden;">
                            <img :src="item.url" height="230" style="display:block;margin:0 auto;">
                        </div>
                    </div>
                </i-col> -->
                
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    文本
                </i-col>
                <i-col>
                    <Input v-model="picData.text" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    开关
                </i-col>
                <i-col>
                    <i-switch v-model="picData.switch" :true-value='1' :false-value='0' @on-change="" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <!-- <i-col>
                    图片
                </i-col> -->
                <i-col>
                    <i-button style="margin-top: 10px;" type="primary" @click='openSelect(1)'>选择图片</i-button>
                    <!-- <Input v-model="picData.img_id" /> -->
                </i-col>
                <i-col>
                    <div style="width:100%;height:400px;overflow-y:scroll;margin-top:20px;">
                        <div v-for='item in picData.img_id' style="float:left;width:230px;overflow:hidden;">
                            <img :src="item.url" height="230" style="display:block;margin:0 auto;">
                        </div>
                    </div>
                </i-col>
            </row>
        </Modal>
        <!-- <Modal v-model="reviewModal" title="预览大图" :footer-hide='true'>
            <row>
                <i-col style="margin:0 auto;">
                    <img :src="reviewPic" width="100%">
                </i-col>
            </row>
        </Modal> -->
        <Modal v-model="deleteModal" title="删除" @on-ok="removeTopic()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;text-align:center;">是否删除专题 ----
                        <span style="color:red;">{{deleteTitle}}</span> ----</p>
                </i-col>
            </row>
        </Modal>
        <selectPic :oneOrAll='isCover' :hasSelect='isCover===0?picData.cover:picData.img_id' @listenToparent='returnSelectPic' ref="selectPicModal"></selectPic>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import selectPic from "@/components/selectPic";
import Cookies from "js-cookie";
export default {
    components: { selectPic },
    computed: {
        headers() {
            return {
                token: Cookies.get("token")
            };
        }
    },
    data() {
        return {
            isUpload:false,
            spinShow:false,
            picModalTitle: "新增专题",
            newModal: false,

            reviewModal: false,
            reviewPic: "",
            isNew: true,
            currentId: "",

            deleteModal: false,
            deleteTitle: "",

            selectPicModal: false,
            isCover: 0,
            picData: {
                title: "",
                text: "",
                date: "",
                img_id: [],
                cover: ''
            },
            topicColumn: [
                {
                    title: "标题",
                    key: "title"
                },
                {
                    title: "文本",
                    key: "text"
                },
                {
                    title: "显示",
                    render: (h, params) => {
                        return h(
                            "i-switch",
                            {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: params.row.switch
                                },
                                nativeOn: {
                                    click: () => {
                                        this.changeSwitch(
                                            params.row.id,
                                            params.row.switch
                                        );
                                    }
                                }
                            },
                            0
                        );
                    }
                },
                {
                    title: "编辑",
                    width: 150,
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
                                            this.picData = {
                                                title: params.row.title,
                                                text: params.row.text,
                                                switch: params.row.switch
                                            };
                                            this.getTopicDetail();
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
                                            this.openDelete(true);
                                            this.currentId = params.row.id;
                                            this.deleteTitle = params.row.title;
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            topicList: [],
            picDataOptions: {
                // disabledDate(date) {
                //     return date && date.valueOf() < Date.now();
                // }
            }
        };
    },
    methods: {
        //upload
        successUpload(file){
            if (this.picData.cover !== "") {
                axios.request({
                    url: "qiniu/delete",
                    method: "post",
                    data: {
                        url: this.picData.cover
                    }
                });
            }
            this.isUpload = true
            this.spinShow = false
            this.picData.cover = file.url
        },
        beforeUpload(file) {
            this.spinShow = true
        },
        //SelectPic组件事件
        returnSelectPic(res) {
            if (this.isCover === 0) {
                // this.picData.cover = res;
            } else {
                this.picData.img_id = res;
            }
            this.openNew(false);
            this.openNew(true);
        },

        openNew(i) {
            this.newModal = i;
        },
        cleanData() {
            if(this.isUpload){
                axios.request({
                    url: "qiniu/delete",
                    method: "post",
                    data: {
                        url: this.picData.cover
                    }
                }).then(res=>{
                    this.isUpload = false
                });
            }
            if (!this.isNew) {
                this.picData = {
                    title: "",
                    text: "",
                    switch: 0,
                    img_id: [],
                    cover: ''
                };
            }
        },
        oNew() {
            this.isNew = true;
            this.openNew(true);
        },
        oEdit() {
            this.picModalTitle = "修改图片";
            this.isNew = false;
            this.openNew(true);
        },
        openDelete(i) {
            this.deleteModal = i;
        },
        openreviewModal(i) {
            this.reviewModal = i;
        },
        openSelect(i) {
            this.isCover = i;
            this.$refs.selectPicModal.openSelect(true);
        },

        searchDate() {
            axios
                .request({
                    url: "todays/search",
                    method: "post",
                    data: {
                        date: this.dayDate
                    }
                })
                .then(res => {
                    this.dayList = res.data;
                });
        },
        removeTopic() {
            axios
                .request({
                    url: "specials/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.getTopic();
                    this.$Message.success("success");
                });
        },
        changeSwitch(a, b) {
            axios
                .request({
                    url: "specials/switch",
                    method: "post",
                    data: {
                        id: a,
                        switch: b === 0 ? 1 : 0
                    }
                })
                .then(res => {
                    this.getTopic();
                    this.$Message.success("success");
                });
        },
        inputData() {
            if (this.isNew) {
                let imgL = [];
                for (let i = 0; i < this.picData.img_id.length; i++) {
                    imgL.push(this.picData.img_id[i].id);
                }
                axios
                    .request({
                        url: "specials",
                        method: "post",
                        data: {
                            title: this.picData.title,
                            text: this.picData.text,
                            switch: this.picData.switch,
                            cover: this.picData.cover,
                            img_id: imgL
                        }
                    })
                    .then(res => {
                        (this.picData = {
                            title: "",
                            text: "",
                            switch: 0,
                            img_id: []
                        }),
                            this.$Message.success("success");
                        this.getTopic();
                    });
            } else {
                let imgL = [];
                for (let i = 0; i < this.picData.img_id.length; i++) {
                    imgL.push(this.picData.img_id[i].id);
                }
                axios
                    .request({
                        url: "specials/" + this.currentId,
                        method: "put",
                        data: {
                            title: this.picData.title,
                            text: this.picData.text,
                            switch: this.picData.switch,
                            cover: this.picData.cover,
                            img_id: imgL
                        }
                    })
                    .then(res => {
                        (this.picData = {
                            title: "",
                            text: "",
                            switch: 0,
                            img_id: []
                        }),
                            this.$Message.success("success");
                        this.getTopic();
                    });
            }
        },

        getTopic() {
            axios
                .request({
                    url: "specials",
                    method: "get"
                })
                .then(res => {
                    this.topicList = res.data.data;
                });
        },

        getTopicDetail() {
            axios
                .request({
                    url: "specials/" + this.currentId,
                    method: "get"
                })
                .then(res => {
                    this.picData.cover = res.data.cover;
                    let imgl = [];
                    for (let i = 0; i < res.data.imgs.length; i++) {
                        imgl.push({
                            url: res.data.imgs[i].url,
                            id: res.data.imgs[i].id
                        });
                    }
                    this.picData.img_id = imgl;

                    this.oEdit();
                });
        }
    },
    mounted() {
        this.getTopic();
    }
};
</script>

<style scoped>
</style>