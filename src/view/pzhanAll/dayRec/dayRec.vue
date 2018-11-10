<template>
    <div>
        <row style="margin:20px 0;">
            <i-col span='5'>
                <i-button style="margin-top: 10px;" type="primary" @click='oNew()'>新建</i-button>
            </i-col>
            <i-col style="margin-top: 10px;text-align:right;" span='19'>
                <DatePicker type="date" value-format="yyyy-MM-dd" format='yyyy-MM-dd' @on-change='returnTodayDate' placeholder="选择日期" style="width: 200px"></DatePicker>
                <i-button style="margin-left: 10px;" type="primary" @click='searchDate()'>搜索</i-button>
            </i-col>
            <i-col span='24'>
                <i-table style="width:100%;min-width:600px;margin-top:30px;" :columns="dayColumn" :data="dayList"></i-table>
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
                    文本
                </i-col>
                <i-col>
                    <Input type="textarea"v-model="picData.text" />
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <i-col>
                    日期
                </i-col>
                <i-col>
                    <!-- <DatePicker type="date" v-model="picData.date" value-format="yyyy-MM-dd" format='yyyy-MM-dd' :options="picDataOptions" @on-change='picData.date=$event' placeholder="选择日期"></DatePicker> -->
                    <DatePicker type="date" v-model="dateText" value-format="yyyy-MM-dd" format='yyyy-MM-dd' :options="picDataOptions" @on-change='dateText=$event' placeholder="选择日期"></DatePicker>
                </i-col>
            </row>
            <row style="margin-bottom:20px;">
                <!-- <i-col>
                    图片
                </i-col> -->
                <i-col>
                    <i-button style="margin-top: 10px;" type="primary" @click='openSelect()'>选择图片</i-button>
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
        <Modal v-model="reviewModal" title="预览大图" :footer-hide='true'>
            <row>
                <i-col style="margin:0 auto;">
                    <img :src="reviewPic" width="100%">
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="removePic()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;color:red;text-align:center;">是否删除图片</p><img width="100%" :src="deleteUrl">
                </i-col>
            </row>
        </Modal>
        <selectPic :oneOrAll='0' :hasSelect='picData.img_id' @listenToparent='returnSelectPic' ref="selectPicModal"></selectPic>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import selectPic from "@/components/selectPic";
export default {
    components: { selectPic },
    data() {
        return {
            dateText:'2018-11-07',

            dayDate: "",
            picModalTitle: "新增图片",
            newModal: false,

            reviewModal:false,
            reviewPic:'',
            isNew:true,
            currentId:'',

            deleteModal:false,
            deleteUrl:'',

            selectPicModal: false,
            picData: {
                title: "",
                text: "",
                date: "2018-11-07",
                img_id: []
            },
            dayColumn: [
                {
                    title: "缩略图",
                    width:100,
                    render: (h, params) => {
                        return h(
                            "img",
                            {
                                attrs: {
                                    src: params.row.picture.url+'?imageMogr2/auto-orient/thumbnail/x50/blur/1x0/quality/75',
                                    style: "width:50px;height:50px;"
                                },
                                on:{
                                    click: () => {
                                        this.reviewPic = params.row.picture.url
                                        this.openreviewModal(true)
                                    }
                                }
                            },
                            ""
                        );
                    }
                },
                {
                    title: "标题",
                    key: "title"
                },
                {
                    title: "文本",
                    key: "text"
                },
                {
                    title: "日期",
                    width:100,
                    key: "date"
                },
                {
                    title: "点赞",
                    width:100,
                    key: "today_likes_count"
                },
                {
                    title: "编辑",
                    width:150,
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
                                            this.currentId = params.row.id,
                                            this.picData = {
                                                title: params.row.title,
                                                text: params.row.text,
                                                // date: params.row.date,
                                                img_id: [
                                                    {
                                                        url:params.row.picture.url,
                                                        id:params.row.picture.id
                                                    }
                                                ]
                                            }
                                            // this.$set(this.picData,'date',params.row.date)
                                            console.log(this.dateText);
                                            
                                            this.$set(this.dateText,params.row.date)
                                            this.oEdit()
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
                                            this.openDelete(true)
                                            this.currentId = params.row.id
                                            this.deleteUrl = params.row.picture.url
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            dayList: [],
            picDataOptions: {
                // disabledDate(date) {
                //     return date && date.valueOf() < Date.now();
                // }
            }
        };
    },
    methods: {
        //SelectPic组件事件
        returnSelectPic(res) {
            this.picData.img_id = res;
        },

        openNew(i) {
            this.newModal = i;
        },
        cleanData(){
            if(!this.isNew){
                this.picData = {
                    title: '',
                    text: '',
                    // date: '2018-11-07',
                    img_id: []
                }
            }
        },
        oNew(){
            this.isNew = true
            this.openNew(true)
        },
        oEdit(){
            this.picModalTitle = '修改图片'
            this.isNew = false
            this.openNew(true)
        },
        openDelete(i){
            this.deleteModal = i
        },
        openreviewModal(i){
            this.reviewModal = i
        },
        openSelect() {
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
        removePic(){
            axios
                .request({
                    url: "todays/delete",
                    method: "post",
                    data: {
                        ids:[this.currentId]
                    }
                }).then(res=>{
                    this.getToday()
                    this.$Message.success("success");
                })
        },
        inputData() {
            var d = new Date(this.dateText);
            var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            
            if(this.isNew){
                axios
                .request({
                    url: "todays",
                    method: "post",
                    data: {
                        title: this.picData.title,
                        img_id: this.picData.img_id[0].id,
                        text: this.picData.text,
                        date: datetime
                    }
                })
                .then(res => {
                    this.picData = {
                        title: "",
                        text: "",
                        // date: "2018-11-07",
                        img_id: []
                    },
                    this.$set(this.dateText,'2018-11-08')
                    this.getToday()
                    this.$Message.success("success");
                });
            }else{
                axios
                .request({
                    url: "todays/"+this.currentId,
                    method: "put",
                    data: {
                        title: this.picData.title,
                        img_id: this.picData.img_id[0].id,
                        text: this.picData.text,
                        date: datetime
                    }
                })
                .then(res => {
                    this.picData = {
                        title: "",
                        text: "",
                        // date: "2018-11-07",
                        img_id: []
                    },
                    this.$set(this.dateText,'2018-11-08')
                    this.getToday()
                    this.$Message.success("success");
                });
            }
            
        },

        getToday(){
            axios
                .request({
                    url: "todays",
                    method: "get"
                })
                .then(res => {
                    this.dayList = res.data.data;
                });
        },

        returnTodayDate(time){
            this.dayDate = time
        },

        returnPicDate(time){
            this.picData.date = time
        }
    },
    mounted() {
        this.getToday()
    }
};
</script>

<style scoped>
</style>