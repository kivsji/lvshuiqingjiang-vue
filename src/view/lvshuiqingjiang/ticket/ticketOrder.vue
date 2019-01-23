<template>
    <div>
        <row>
            <i-col>
                <RadioGroup
                    v-model="type"
                    type="button"
                    @on-change='changeType'
                >
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
                <i-table
                    size="large"
                    style="min-width:800px;"
                    :columns="orderColunm"
                    :data="orderList"
                ></i-table>
            </i-col>
            <i-col style="margin-top:10px;">
                <Page
                    :total="total"
                    :page-size="pre_page"
                    :on-change='changePage'
                />
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            total:1,
            pre_page:1,
            currentPage:1,
            type: "0",
            orderColunm: [
                {
                    title: "订单编号",
                    key: "order_no"
                },
                {
                    title: "实付",
                    key: "price"
                },
                {
                    title: "支付时间",
                    key: "pay_time"
                }
            ],
            orderList: []
        };
    },
    methods: {
        changePage(index){
            this.currentPage = index
        },
        changeType(key) {
            console.log(key);
            this.getOrderList();
        },
        getOrderList() {
            let pay_state = "";
            let use_state = "";
            if (this.type === "-3") {
                pay_state = "0";
                use_state = "";
            } else {
                pay_state = "1";
                use_state = this.type;
            }
            axios
                .request({
                    url:
                        "order/malls?pay_state=" +
                        pay_state +
                        "&use_state=" +
                        use_state +
                        "&page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.orderList = res.data.data;
                    this.total = res.data.total
                    this.pre_page = res.data.per_page
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