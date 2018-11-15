<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建VIP</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <Page :total="total" :page-size="pre_page" />
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:1200px;" :columns="vipColunm" :data="vipList"></i-table>
            </i-col>
            <Modal v-model="dataModal" :title='dataTitle' @on-ok="inputVipData" @on-cancel="cancleWindow()">
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        名称
                    </i-col>
                    <i-col span='20'>
                        <Input v-model="vipData.name" />
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        电话
                    </i-col>
                    <i-col span='20'>
                        <Input v-model="vipData.mobile" />
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        标签
                    </i-col>
                    <i-col span='20'>
                        <Select v-model="currentTag" style="width:200px" multiple>
                            <Option v-for="item in tagList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        可用积分
                    </i-col>
                    <i-col span='20'>
                        <InputNumber :min="0" v-model="vipData.integral" :formatter="value => `${value}分`" :parser="value => value.replace('分', '')"></InputNumber>
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        可用余额
                    </i-col>
                    <i-col span='20'>
                        <InputNumber :min="0.00" v-model="vipData.money" :precision='2' :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        结束日期
                    </i-col>
                    <i-col span='20'>
                        <DatePicker @on-change='changeVipDate' :value='vipData.deadline' type="date" placement="bottom-end" placeholder="有效日期" style="width: 200px"></DatePicker>
                    </i-col>
                </row>
            </Modal>
            <Modal v-model="deleteShow" title='删除' @on-ok="deleteVip" @on-cancel="deleteModal(false)">
                是否删除 <span style="color:red;">{{currentName}}</span> ?
            </Modal>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            spinShow:false,
            total: 1,
            pre_page: 1,
            dataModal: false,
            deleteShow:false,
            dataTitle: "新增会员",
            isNew: false,

            tagList:[],
            currentId: "",
            currentName:'',
            oldTag:[],
            currentTag:[],
            vipData: {
                name: "",
                fan_id: "",
                card_id: "",
                mobile: "",
                tags:[],
                integral: 0,
                money: 0,
                deadline: "" //结束日期
            },
            vipColunm: [
                {
                    title: "会员名",
                    key: "name"
                },
                {
                    title: "手机号",
                    key: "mobile"
                },
                {
                    title: "会员卡编号",
                    key: "card_id"
                },
                {
                    title: "可用积分",
                    key: "integral"
                },
                {
                    title: "可用余额",
                    key: "money"
                },
                {
                    title: "会员有效日期",
                    key: "deadline"
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
                                            this.cancelInput(true)
                                            this.isNew = false
                                            this.vipData = params.row
                                            this.currentTag = []
                                            for(let i=0;i<params.row.tags.length;i++){
                                                this.currentTag.push(params.row.tags[i].id)
                                            }
                                            this.currentId = params.row.id
                                            this.oldTag = params.row.tags
                                            this.vipData.money = parseFloat(this.vipData.money)
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
                                            this.deleteModal(true)
                                            this.currentId = params.row.id
                                            this.currentName = params.row.name
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            vipList: []
        };
    },
    methods: {
        getTag() {
            axios
                .request({
                    url: "member/tags",
                    method: "get"
                })
                .then(res => {
                    this.tagList = res.data;
                });
        },
        newData(){
            this.isNew = true
            this.oldTag = []
            this.vipData = {
                name: "",
                fan_id: "",
                card_id: "",
                mobile: "",
                tags:[],
                integral: 0,
                money: 0,
                deadline: ""
            }
            this.cancelInput(true)
        },
        cancleWindow(){
            this.cancelInput(false)
            this.getVipList()
        },
        cancelInput(i) {
            this.dataModal = i;
        },
        deleteModal(i){
            this.deleteShow = i
        },
        getVipList() {
            this.spinShow = true
            //获取会员列表
            axios
                .request({
                    url: "/member/members",
                    method: "get"
                })
                .then(res => {
                    this.vipList = res.data;
                    this.spinShow = false
                });
        },
        inputVipData() {
            if(
                this.vipData.name === ''||
                this.vipData.mobile === ''||
                this.vipData.integral === ''||
                this.vipData.money === ''||
                this.vipData.deadline === ''
            ){
                this.$Message.error('会员资料不完整，无法提交')
                this.getVipList()
                return
            }
            //提价会员资料
            this.spinShow = true
            if (this.isNew) {
                //新增
                axios
                    .request({
                        url: "/member/members",
                        method: "post",
                        data: {
                            name: this.vipData.name,
                            mobile: this.vipData.mobile,
                            integral: this.vipData.integral,
                            // tags:this.vipData.tags,
                            money: this.vipData.money,
                            deadline: this.vipData.deadline //结束日期
                        }
                    })
                    .then(res => {
                        this.getVipList()
                    });
            } else {
                //修改
                let diff = this.returnTag(this.oldTag,this.currentTag)
                for(let i=0;i<diff.oldDiff.length;i++){
                    axios.request({
                        url:'member/members/add-tag',
                        method:'post',
                        data:{
                            member_id:this.currentId,
                            tag_Id:diff.oldDiff[i]
                        }
                    })
                }
                for(let i=0;i<diff.newDiff.length;i++){
                    axios.request({
                        url:'member/members/delete-tag',
                        method:'post',
                        data:{
                            member_id:this.currentId,
                            tag_Id:diff.newDiff[i]
                        }
                    })
                }
                
                axios
                    .request({
                        url: "/member/members/"+this.vipData.id,
                        method: "put",
                        data: {
                            name: this.vipData.name,
                            mobile: this.vipData.mobile,
                            integral: this.vipData.integral,
                            // tags:this.vipData.tags,
                            money: this.vipData.money,
                            deadline: this.vipData.deadline //结束日期
                        }
                    })
                    .then(res => {
                        this.getVipList()
                    });
            }
        },
        returnTag(oldData,newData){
            //新旧数组对比
            let allArr = []
            let oldArr = []
            let newArr = []

            allArr = oldData.concat(newData) //新旧组合并
            function oldContain(value){
                //找出旧数组缺省元素
                return oldData.indexOf(value)==-1
            }
            function newContain(value){
                //找出旧数组缺省元素
                return newData.indexOf(value)==-1
            }
            oldArr = allArr.filter(oldContain)
            newArr = allArr.filter(newContain)
            let diff = {
                oldDiff: oldArr,
                newDiff: newArr
            }
            return diff
        },
        
        deleteVip(){
            //删除会员
            this.spinShow = true
            axios
                .request({
                    url: "/member/members/"+this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success('删除成功')
                    this.getVipList()
                });
        },
        changeVipDate(t) {
            //改变会员有效日期
            this.vipData.deadline = t
        }
    },
    mounted() {
        this.getVipList();
        this.getTag()
    }
};
</script>

<style scoped>
</style>