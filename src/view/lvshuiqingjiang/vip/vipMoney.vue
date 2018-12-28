<template>
    <div style="width:95%;display:blcok;margin:0px auto;border-radius:10px;background:#fff;min-height:800px;padding:2%;">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col>
                <Button type='primary' @click='newData()'>新建规则</Button>
            </i-col>
            <i-col span='24' style="margin-top:10px;">
                <i-table size="large" style="min-width:800px;" :columns="vipColunm" :data="vipList"></i-table>
            </i-col>
        </row>
        <Modal v-model="moneyModal" :title='dataTitle' @on-ok="inputData" @on-cancel="moneyShow(false)">
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
                    开通等级
                </i-col>
                <i-col span='20'>
                    <!-- <Select v-model="vipData.group_id" style="width:200px">
                        <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select> -->
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    月份
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="1" :max='12' v-model="vipData.month_count"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    现价
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="0.00" v-model="vipData.price" :precision='2'></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    原价
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="0.00" v-model="vipData.oprice" :precision='2'></InputNumber>
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
            moneyModal: false,
            isNew: false,
            spinShow: false,
            currentId:'',
            dataTitle:'新增',
            vipData:{
                name:'',
                group_id:'',
                month_count:1,
                price:0.00,
                oprice:0.00
            },
            vipColunm: [
                {
                    title: "名称",
                    key: "name"
                },{
                    title: "开通月份",
                    key: "month_count"
                },
                {
                    title: "现价",
                    key: "price"
                },
                {
                    title: "原价",
                    key: "oprice"
                },
                {
                    title: "操作",
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
                                            this.currentId = params.row.id
                                            this.dataTitle = '修改'
                                            this.moneyShow(true);
                                            this.isNew = false
                                            this.vipData = {
                                                name:params.row.name,
                                                group_id:params.row.group_id,
                                                month_count:params.row.month_count,
                                                price:params.row.price,
                                                oprice:params.row.oprice
                                            }
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
                                        click: () => {}
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            vipList: [],
            groupList:[]
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
        newData() {
            this.moneyShow(true);
            this.dataTitle = '新增'
            this.isNew = true;
            this.vipData = {
                name:'',
                group_id:'',
                month_count:1,
                price:0.00,
                oprice:0.00
            }
        },
        moneyShow(i) {
            this.moneyModal = i;
        },
        getVipJoin() {
            this.spinShow = true
            axios
                .request({
                    url: "/member/join/settings",
                    method: "get"
                })
                .then(res => {
                    this.spinShow = false
                    this.vipList = res.setting;
                });
        },
        inputData(){
            console.log(this.vipData.name);
            
            if(this.vipData.name === ''){
                this.$Message.error('名称不能为空')
                return
            }
            if(this.vipData.group_id === ''){
                this.$Message.error('开通等级不能为空')
                return
            }
            if(this.vipData.month_count === ''){
                this.$Message.error('月份不能为空')
                return
            }
            if(this.vipData.price === ''){
                this.$Message.error('现价不能为空')
                return
            }
            this.spinShow = true
            if(this.isNew){
                axios
                .request({
                    url: "/member/join/settings",
                    method: "post",
                    data:{
                        name: this.vipData.name,
                        group_id: this.vipData.group_id,
                        month_count: this.vipData.month_count,
                        price:this.vipData.price,
                        oprice:this.vipData.oprice
                    }
                })
                .then(res => {
                    this.getVipJoin()
                });
            }else{
                axios
                .request({
                    url: "/member/join/settings/"+this.currentId,
                    method: "put",
                    data:{
                        name: this.vipData.name,
                        group_id: this.vipData.group_id,
                        month_count: this.vipData.month_count,
                        price:this.vipData.price,
                        oprice:this.vipData.oprice
                    }
                })
                .then(res => {
                    this.getVipJoin()
                });
            }
            
        }
    },
    mounted() {
        this.getVipJoin();
        this.getGroupList()
    }
};
</script>

<style scoped>
</style>