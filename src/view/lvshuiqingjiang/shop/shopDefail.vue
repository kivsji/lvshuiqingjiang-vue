<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:20px;">
                <Page :total="total" :page-size="pre_page" :on-change='changePage' />
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:800px;" :columns="goodsColunm" :data="goodsList"></i-table>
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            currentPage:1,
            total:1,
            pre_page:1,
            spinShow: false,
            currentId:'',
            typeList: [],
            goodsType:[],
            goodslist:[],
            goodsColunm:[
                {
                    title:'商品名',
                    key:'name'
                },{
                    title:'商品类型',
                    key:'type'
                },{
                    title:'总数',
                    key:'total'
                },{
                    title:'价格',
                    key:'price'
                },{
                    title:'优惠价',
                    key:'discount'
                },{
                    title:'月销',
                    key:'monthly_sales'
                },{
                    title:'上架',
                    key:'is_up'
                },{
                    title:'操作',
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
                                            this.currentId = params.row.id;
                                            this.dataTitle = "修改";
                                            this.isNew = false
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
                                            this.currentId = params.row.id;
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ]
        };
    },
    methods: {
        changePage(index){
            this.currentPage = index
            this.getGoodLost()
        },
        getSwipeType(){
            axios
                .request({
                    url: "mall-parameter/",
                    method: "get"
                })
                .then(res => {
                    this.goodsType = res.data.swiper
                });
        },
        getType() {
            axios
                .request({
                    url: "mall-navs",
                    method: "get"
                })
                .then(res => {
                    this.typeList = res.data;
                });
        },
        getGoodLost(){
            this.spinShow = true;
            axios
                .request({
                    url: "mall-goods?page="+this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.goodsList = res.data.data;
                    
                    this.spinShow = false;
                });
        }
    },
    mounted() {
        this.getGoodLost()
        this.getType()
    }
};
</script>

<style scoped>
</style>