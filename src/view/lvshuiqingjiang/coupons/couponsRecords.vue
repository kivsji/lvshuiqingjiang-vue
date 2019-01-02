<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <i-col>
            <row>
                <i-col span='1' style="line-height:33px;">
                    授权状态
                </i-col>
                <i-col span='2'>
                    <Select v-model="status" @on-change="changeSelect">
                        <Option :value="0" :key="0">未关注</Option>
                        <Option :value="1" :key="1">已关注</Option>
                    </Select>
                </i-col>
                <i-col span='1' offset='2' style="line-height:33px;text-align:center;">
                    用户
                </i-col>
                <i-col span='4'>
                    <Select v-model="currentId" filterable clearable>
                        <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
                    </Select>
                </i-col>
                <i-col span='1' offset='2' style="line-height:33px;text-align:center;">
                    优惠券
                </i-col>
                <i-col span='4'>
                    <Select v-model="currentCoupon" filterable clearable>
                        <Option v-for="item in couponsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </i-col>
                <i-col span='1' offset='2' style="line-height:33px;text-align:center;">
                    使用状态
                </i-col>
                <i-col span='2'>
                    <Select v-model="currentUse">
                        <Option :value="0" :key="0">未使用</Option>
                        <Option :value="1" :key="1">已使用</Option>
                    </Select>
                </i-col>
                <i-col span='1' offset='1'>
                    <Button type='primary' @click='getRecords()'>搜索</Button>
                </i-col>
            </row>

        </i-col>
        <i-col style="margin-top:20px;margin-bottom:20px;">
            <Page :total="total" :page-size="pre_page" @on-change='changePage' />
        </i-col>
        <i-col>
            <i-table size="large" style="min-width:800px;" :columns="hasColunm" :data="hasList"></i-table>
        </i-col>
        <Modal v-model="recordShow" title='核销' @on-ok="inputData" @on-cancel="recordModal(false)">
            是否确认核销 '<span style="color:red;">{{currentUserName}}</span>' 的 '<span style="color:red;">{{currentUserCoupons}}</span>' 券 ?
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            recordId:'',
            currentUserName:'',
            currentUserCoupons:'',
            recordShow:false,
            spinShow: false,
            status: 1,
            currentPage: 1,
            currentUse: 0,
            currentCoupon: "",
            currentId: "",
            total: 1,
            pre_page: 1,
            hasColunm: [
                {
                    title: "持有人",
                    render: (h, params) => {
                        return h("p", params.row.fan.nickname);
                    }
                },
                {
                    title: "持有券",
                    render: (h, params) => {
                        return h("p", params.row.coupon.name);
                    }
                },{
                    title: "状态",
                    render: (h, params) => {
                        return h("p", params.row.status === 0?'未使用':'已使用');
                    }
                },
                {
                    title: "核销",
                    render: (h, params) => {
                        return h(
                            "Button",
                            {
                                props: {
                                    type: "success"
                                },
                                attrs: {
                                    style: "font-size:12px"
                                },
                                nativeOn: {
                                    click: () => {
                                        this.recordModal(true)
                                        this.recordId = params.row.id
                                        this.currentUserName = params.row.fan.nickname
                                        this.currentUserCoupons = params.row.coupon.name
                                    }
                                }
                            },
                            "核销"
                        );
                    }
                }
            ],
            hasList: [],
            couponsList: [],
            userList: []
        };
    },
    methods: {
        changeSelect(){
            this.getUserList()
        },
        recordModal(i){
            this.recordShow = i
        },
        inputData(){
            axios
                .request({
                    url:
                        "coupon/records/confirm?record_id=" +
                        this.recordId,
                    method: "get"
                })
                .then(res => {
                    this.getRecords()
                    this.$Message.success('核销成功');
                });
        },
        changePage(index) {
            this.currentPage = index;
            this.getRecords();
        },
        getRecords() {
            this.spinShow = true;
            axios
                .request({
                    url:
                        "coupon/records?page=" +
                        this.currentPage +
                        "&coupon_id=" +
                        this.currendCoupon +
                        "&fan_id=" +
                        this.currentId +
                        "&status=" +
                        this.currentUse,
                    method: "get"
                })
                .then(res => {
                    this.hasList = res.data.data;
                    this.pre_page = res.data.per_page;
                    this.total = res.data.total;
                    this.spinShow = false;
                });
        },
        getCouponsList() {
            axios
                .request({
                    url: "coupon/coupons",
                    method: "get"
                })
                .then(res => {
                    this.couponsList = res.data.data;
                });
        },
        getUserList() {
            axios
                .request({
                    url: "fans?status=" + this.status,
                    method: "get"
                })
                .then(res => {
                    this.userList = res.data.data;
                });
        }
    },
    mounted() {
        this.getRecords();
        this.getCouponsList();
        this.getUserList();
    }
};
</script>

<style scoped>
</style>