<template>
    <div style="width:95%;display:blcok;margin:0px auto;border-radius:10px;background:#fff;min-height:800px;padding:2%;">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col>
                <Button type='primary' @click='newData()'>新建规则</Button>
            </i-col>
            <i-col span='24' style="margin-top:10px;">
                <i-table size="large" style="min-width:1200px;" :columns="vipColunm" :data="vipList"></i-table>
            </i-col>
        </row>
        <Modal v-model="moneyModal" :title='dataTitle' @on-ok="inputData" @on-cancel="moneyShow(false)">
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    月份
                </i-col>
                <i-col span='20'>
                    <Input v-model="vipData.month_count" />
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    现价
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="0.00" v-model="vipData.price" :precision='2' :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    原价
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="0.00" v-model="vipData.oprice" :precision='2' :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
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
                month_count:'',
                price:0.00,
                oprice:0.00
            },
            vipColunm: [
                {
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
            vipList: []
        };
    },
    methods: {
        newData() {
            this.moneyShow(true);
            this.dataTitle = '新增'
            this.isNew = true;
            this.vipData = {
                month_count:'',
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
            this.spinShow = true
            if(this.vipData.price === ''){
                this.$Message.error('现价不能为空')
                return
            }
            if(this.isNew){
                axios
                .request({
                    url: "/member/join/settings",
                    method: "post",
                    data:{
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
    }
};
</script>

<style scoped>
</style>