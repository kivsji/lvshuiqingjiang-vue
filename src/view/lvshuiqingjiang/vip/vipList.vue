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
            <Modal v-model="dataModal" :title='dataTitle' @on-ok="inputVipData" @on-cancel="cancelInput(false)">
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
                        <InputNumber v-model="vipData.money" :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
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
            dataTitle: "新增会员",
            isNew: false,
            currentId: "",
            vipData: {
                name: "",
                fan_id: "",
                card_id: "",
                mobile: "",
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
                                        click: () => {}
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
        newData(){
            this.isNew = true
            this.vipData = {
                name: "",
                fan_id: "",
                card_id: "",
                mobile: "",
                integral: 0,
                money: 0,
                deadline: ""
            }
            this.cancelInput(true)
        },
        cancelInput(i) {
            this.dataModal = i;
        },
        getVipList() {
            this.spinShow = true
            //获取会员列表
            axios
                .request({
                    url: "/members",
                    method: "get"
                })
                .then(res => {
                    this.vipList = res.data;
                    this.spinShow = false
                });
        },
        inputVipData() {
            //提价会员资料
            this.spinShow = true
            if (this.isNew) {
                //新增
                axios
                    .request({
                        url: "/members",
                        method: "post",
                        data: {
                            name: this.vipData.name,
                            mobile: this.vipData.mobile,
                            integral: this.vipData.integral,
                            money: this.vipData.money,
                            deadline: this.vipData.deadline //结束日期
                        }
                    })
                    .then(res => {
                        this.vipData = res.data;
                        this.getVipList()
                    });
            } else {
                //修改
            }
        },
        deleteVip(){
            //删除会员
        },
        changeVipDate(t) {
            //改变会员有效日期
            this.vipData.deadline = t
        }
    },
    mounted() {
        this.getVipList();
    }
};
</script>

<style scoped>
</style>