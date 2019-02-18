<template>
    <div>
        <row>
            <i-col>
                <RadioGroup v-model="type" type="button" @on-change='changeType'>
                    <Radio label="-3">未支付</Radio>
                    <Radio label="0">未使用</Radio>
                    <Radio label="1">已使用</Radio>
                    <Radio label="-1">
                        申请退款
                        <!-- <Badge :count="3">
                            <a href="#" class="demo-badge"></a>
                        </Badge> -->
                    </Radio>
                    <Radio label="-2">已退款</Radio>
                </RadioGroup>
            </i-col>
            <i-col style="margin-top:10px;">
                <i-table size="large" style="min-width:800px;" :columns="orderColunm" :data="orderList"></i-table>
            </i-col>
            <i-col style="margin-top:10px;">
                <Page :total="total" :page-size="pre_page" :on-change='changePage' />
            </i-col>
        </row>
        <Modal v-model="refundShow" title="退款操作" @on-ok="importRefund()" @on-cancel="">
            <p v-if="refundShow" style="text-align:center;">是否给  “<span style="color:red;">{{data.fan_ticket[0].name}}</span>”  进行门票套餐  “<span style="color:red;">{{data.fan_ticket[0].ticket.name}}</span>” 的退款</p>
        </Modal>
        <Modal v-model="noRefundShow" title="拒绝退款" @on-ok="noRefund()" @on-cancel="">
            <p v-if="noRefundShow" style="text-align:center;">是否拒绝  “<span style="color:red;">{{data.fan_ticket[0].name}}</span>”  进行门票套餐  “<span style="color:red;">{{data.fan_ticket[0].ticket.name}}</span>” 的退款</p>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            total: 1,
            pre_page: 1,
            currentPage: 1,
            refundShow:false,
            noRefundShow:false,
            refundId: "",
            data:{},
            type: "0",
            orderColunm: [
                {
                    title: "订单编号",
                    key: "order_no"
                },
                {
                    title: "套餐名",
                    render: (h, params) => {
                        return h("p", params.row.fan_ticket[0].ticket.name);
                    }
                },
                {
                    title: "实付",
                    key: "price"
                },
                {
                    title: "支付时间",
                    key: "pay_time"
                },
                {
                    title: "操作",
                    render: (h, params) => {
                        if (this.type == -1) {
                            return h("div", [
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "error",
                                            size: "small"
                                        },
                                        attrs: {
                                            style: "font-size:12px"
                                        },
                                        nativeOn: {
                                            click: () => {
                                                this.data = params.row
                                                this.refundId = params.row.id;
                                                this.refundShow = true
                                            }
                                        }
                                    },
                                    "允许退款"
                                ),
                                h(
                                    "Button",
                                    {
                                        props: {
                                            type: "success",
                                            size: "small"
                                        },
                                        attrs: {
                                            style: "font-size:12px;margin-left:10px;"
                                        },
                                        nativeOn: {
                                            click: () => {
                                                this.data = params.row
                                                this.refundId = params.row.id;
                                                this.noRefundShow = true
                                            }
                                        }
                                    },
                                    "拒绝退款"
                                )
                            ]);
                        }
                    }
                }
            ],
            orderList: []
        };
    },
    methods: {
        //退款= =
        importRefund() {
            axios
                .request({
                    url: "wechat/refund",
                    method: "post",
                    data: {
                        id: this.refundId
                    }
                })
                .then(res => {
                    this.$Message.success("退款成功");
                    this.getOrderList()
                });
        },
        noRefund(){
            axios
                .request({
                    url: "order/decline/"+this.refundId,
                    method: "get"
                })
                .then(res => {
                    this.$Message.success("拒绝退款成功");
                    this.getOrderList()
                });
        },
        changePage(index) {
            this.currentPage = index;
        },
        changeType(key) {
            // console.log(key);
            this.getOrderList();
        },
        getOrderList() {
            let pay_state = "";
            let use_state = "";

            if (this.type === "-3") {
                pay_state = "0";
                use_state = "0";
            } else {
                pay_state = "1";
                use_state = this.type;
            }
            console.log(pay_state + "," + use_state);
            axios
                .request({
                    url: "order/states?page=" + this.currentPage,
                    method: "post",
                    data: {
                        type: "ticket",
                        pay_state: pay_state,
                        use_state: use_state
                    }
                })
                .then(res => {
                    this.orderList = res.data.data;
                    this.total = res.data.total;
                    this.pre_page = res.data.per_page;
                });
        }
    },
    mounted() {
        this.getOrderList();
    }
};
</script>

<style scoped>
</style>