<template>
    <div>
        <row style="margin:20px 0;">
            <i-col span='5'>
                <Input v-model="keyWork" placeholder="输入关键词" style="width: 100%" />
            </i-col>
            <i-col span='10' style="margin-bottom:20px;">
                <Select v-model="selectComment" @on-change='selectChange' style="width:200px">
                    <Option v-for="item in commentsType" :value="item.key" :key="item.key">{{ item.value }}</Option>
                </Select>
                <i-button type="primary" @click='getComments(selectComment,keyWork)'>搜索</i-button>
            </i-col>

            <i-col span='24'>
                <Page :total="total" :page-size='pageSize' @on-change='changePage'/>
            </i-col>
            <i-col span='24'>
                <i-table style="width:100%;min-width:600px;margin-top:30px;" :columns="commentsColumn" :data="commentsList"></i-table>
            </i-col>
        </row>
        <Modal v-model="banModal" title="禁言" @on-ok="inputBan()" @on-cancel="openBanModal(false)">
            <row>
                <i-col style="margin:0 auto;">
                    <p style="font-size:25px;text-align:center;">是否禁言用户：<span style="color:red;">{{banData.banName}}</span></p>
                </i-col>
                <i-col offset='5' style="margin-top:20px;">
                    <RadioGroup v-model="banData.banType" @on-change='banTimeChange'>
                        <Radio label="自定义"></Radio>
                        <Radio label="永久"></Radio>
                    </RadioGroup>
                </i-col>
                <i-col span='12' offset='5' style="margin-top:10px;"> 
                    <InputNumber :min="1" :max='999' v-if='banData.banType === "自定义"' v-model="banData.banTime"></InputNumber>
                </i-col>
                <i-col span='12' offset='5' style="margin-top:10px;"> 
                    <Select v-model="banData.banReason" style="width:200px">
                        <Option v-for="item in reasonList" :value="item.key" :key="item.key">{{ item.key }}</Option>
                    </Select>
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
            commentsColumn: [
                {
                    title: "评论人",
                    render: (h, params) => {
                        return h("p", {}, params.row.fan.nickname);
                    }
                },
                {
                    title: "内容",
                    render: (h, params) => {
                        return h("p", {
                            attrs:{
                                style:'overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'
                            }
                        }, params.row.content);
                    }
                },
                {
                    title: "所属",
                    key: "module"
                },
                {
                    title: "封禁状态",
                    render: (h, params) => {
                        return h("p", {
                            attrs:{
                                style:'overflow: hidden;text-overflow:ellipsis;white-space: nowrap;color:red;'
                            }
                        }, params.row.blacklists.length>0?'封禁':'');
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
                                        type: "error",
                                        size: "small",
                                        disabled: params.row.blacklists.length>0,
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.openBanModal(true)
                                            this.banData.banName = params.row.fan.nickname
                                            this.banData.banId = params.row.fan.id
                                            this.banData.banReason = ''     
                                            this.banData.banReason = '言论不当'                          
                                        }
                                    }
                                },
                                "禁言"
                            )
                        ]);
                    }
                }
            ],
            commentsList: [],
            commentsType: [],
            selectComment: "",
            keyWork: "",

            banModal:false,
            banData:{
                banName:'',
                banId:'',
                banReason:'言论不当',
                banTime:7,
                banType:'自定义'
            },

            reasonList:[
                {
                    key:'言论不当'
                }
            ],

            total: 1,
            currentPage: 1,
            pageSize:1,
        };
    },
    methods: {
        changePage(index){
            this.currentPage = index
            this.getComments(this.selectComment, this.keyWork)
        },


        getCommentsType() {
            axios
                .request({
                    url: "comments",
                    method: "get"
                })
                .then(res => {
                    this.commentsType = res.data.data;
                });
        },

        getComments(amodule, key) {
            axios
                .request({
                    url: "comments/query?page="+this.currentPage,
                    method: "post",
                    data: {
                        module: amodule,
                        key: key
                    }
                })
                .then(res => {
                    this.commentsList = res.data.data;
                    this.total = res.data.total
                    this.pageSize = res.data.per_page
                });
        },
        selectChange(value) {
            this.getComments(this.selectComment, this.keyWork);
        },

        banTimeChange(value){
            if(value === '永久'){
                this.banData.banTime = 999
            }else{
                this.banData.banTime = 7
            }
        },
        inputBan(){
            if(this.banData.banType === '自定义' && this.banData.banTime == ''){
                this.$Message.success("禁言时间不能为空");
                return
            }else{
                axios
                .request({
                    url: "blacklist",
                    method: "post",
                    data: {
                        fan_id: this.banData.banId,
                        day: this.banData.banTime,
                        reason:this.banData.banReason,
                        state:1,
                        is_seal:0
                    }
                })
                .then(res => {
                    this.$Message.success("禁言成功");
                    this.getComments(this.selectComment, this.keyWork);
                });
            }
        },
        openBanModal(i){
            this.banModal = i
        }
    },
    mounted() {
        this.getCommentsType();
        this.selectComment = "all";
        this.getComments(this.selectComment, this.keyWork);
    }
};
</script>

<style scoped>
</style>