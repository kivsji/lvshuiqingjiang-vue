<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建商品</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <Page :total="total" :page-size="pre_page" :on-change='changePage' />
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:800px;" :columns="goodsColunm" :data="goodsList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" :title='dataTitle' @on-ok="inputData()" @on-cancel="openGoodModal(false)">
            <row>
                <i-col span='4' style="line-height:30px;">
                    商品类型
                </i-col>
                <i-col>
                    <RadioGroup v-model="goodData.type" type="button">
                        <Radio :label="item.value" v-for="item in goodsType">{{item.ch}}</Radio>
                    </RadioGroup>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    商品分类
                </i-col>
                <i-col>
                    <Select v-model="goodData.nav_id" style="width:200px">
                        <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{ item.name }}</Option>
                    </Select>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    上架
                </i-col>
                <i-col>
                    <i-switch v-model="goodData.is_up" :true-value='1' :false-value='0' />
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    商品封面
                </i-col>
                <i-col span='4'>
                    <Upload style="margin-bottom:10px;" action="http://localhost:8000/lvshui/public/qiniu/upload" :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <!-- <i-col span='24' style="display:block;margin:0 auto;">
                    <img :src="goodData.imgs[0]" width="100%">
                </i-col> -->
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    商品名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="goodData.name" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    商品内容
                </i-col>
                <i-col span='20'>
                    <Input v-model="goodData.content" type="textarea" :rows='6' />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    商品库存
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.total" :min="0" :formatter="value => `${value} 件`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    每人限购
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.limit" :min="0" :formatter="value => `${value} 件`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    价格
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.price" :min="0.00" :precision='2' :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;" v-if='goodData.type !== "general"'>
                <i-col span='4' style="line-height:30px;">
                    优惠价
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.discount" :min="0.00" :precision='2' :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;" v-if='goodData.type === "discount"'>
                <i-col span='4' style="line-height:30px;">
                    优惠上架日期
                </i-col>
                <i-col span='20'>
                    <DatePicker @on-change='changeGoodDate' :value='goodDiscountDate' type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    已售
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.monthly_sales" :min="0" :formatter="value => `${value} 件`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title='删除' @on-ok="deleteGood()" @on-cancel="deleteShow(false)">
            是否删除商品 <span style='color:red'>{{deleteGoodName}}</span>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            currentPage: 1,
            total: 1,
            pre_page: 1,
            spinShow: false,

            //新增框
            isNew: false,
            dataModal: false,
            dataTitle: "新增商品",
            goodDiscountDate: [],
            goodData: {
                imgs: [],
                nav_id: "",
                name: "",
                type: "general",
                content: "",
                total: 0,
                limit: 0,
                price: 0,
                discount: 0,
                monthly_sales: 0,
                is_up: 1,
                sratr_date: "",
                end_date: ""
            },
            //删除框
            deleteModal: false,
            deleteGoodName: "",

            currentId: "",
            typeList: [],
            goodsType: [],
            goodsList: [],
            goodsColunm: [
                {
                    title: "商品名",
                    key: "name"
                },
                {
                    title: "商品类型",
                    // key:'type'
                    width: 100,
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {}
                            },
                            params.row.gender === "discount"
                                ? "优惠活动"
                                : params.row.gender === "member"
                                    ? "会员专享"
                                    : "一般"
                        );
                    }
                },
                {
                    title: "总数",
                    key: "total"
                },
                {
                    title: "价格",
                    key: "price"
                },
                {
                    title: "优惠价",
                    key: "discount"
                },
                {
                    title: "月销",
                    key: "monthly_sales"
                },
                {
                    title: "上架",
                    // key: "is_up"
                    render: (h, params) => {
                        var self = this;
                        return h(
                            "i-switch",
                            {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: params.row.is_up
                                },
                                nativeOn: {
                                    click: () => {
                                        this.change(params.row.is_up,params.row.id);
                                    }
                                }
                            },
                            0
                        );
                    }
                },
                {
                    title: "操作",
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
                                            this.isNew = false;
                                            this.goodData.imgs = []
                                            for(let i=0;i<params.row.imgs.length;i++){
                                                this.goodData.imgs.push(params.row.imgs[0].url) 
                                            }
                                            this.goodData.nav_id = params.row.nav_id
                                            console.log(params.row.nav_id);
                                            
                                            this.goodData.name = params.row.name
                                            this.goodData.type = params.row.type
                                            this.goodData.content = params.row.content
                                            this.goodData.total = params.row.total
                                            this.goodData.limit = params.row.limit
                                            this.goodData.price = params.row.price
                                            this.goodData.discount = params.row.discount
                                            this.goodData.monthly_sales = params.row.monthly_sales
                                            this.goodData.is_up = params.row.is_up
                                            this.goodDiscountDate = [params.row.sratr_date,params.row.end_date]
                                            this.openGoodModal(true)
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            // h(
                            //     "Button",
                            //     {
                            //         props: {
                            //             type: "error",
                            //             size: "small"
                            //         },
                            //         attrs: {
                            //             style:
                            //                 "font-size:12px;margin-left:10px;"
                            //         },
                            //         nativeOn: {
                            //             click: () => {
                            //                 this.currentId = params.row.id;
                            //                 this.deleteGoodName = params.row.name
                            //                 this.deleteShow(true)
                            //             }
                            //         }
                            //     },
                            //     "删除"
                            // )
                        ]);
                    }
                }
            ]
        };
    },
    methods: {
        //change上架事件
        change(is,id) {
            this.spinShow = true;
            axios.request({
                url:'mall-goods/'+ id +'/change',
                method:'post',
                data:{
                    is_up:!is
                }
            }).then(res=>{
                this.$Message.success('修改成功')
                this.getGoodLost()
            })
        },
        //日期修改事件
        changeGoodDate() {},
        //上传事件
        successUpload(file) {
            this.goodData.imgs.push(file.url);
        },
        beforeUpload() {},
        //分页
        changePage(index) {
            this.currentPage = index;
            this.getGoodLost();
        },
        //获取商品类别
        // 0: {ch: "优惠活动", value: "discount"}
        // 1: {ch: "一般", value: "general"}
        // 2: {ch: "会员专享", value: "member"}
        getSwipeType() {
            axios
                .request({
                    url: "mall-parameter/",
                    method: "get"
                })
                .then(res => {
                    this.goodsType = res.good;
                });
        },
        //获取商品分类
        getType() {
            this.spinShow = true;
            axios
                .request({
                    url: "mall-navs",
                    method: "get"
                })
                .then(res => {
                    this.typeList = [];
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].sid !== 0) {
                            this.typeList.push({
                                name: res.data[i].name,
                                id: res.data[i].id,
                                sid: res.data[i].sid
                            });
                        }
                    }
                    this.spinShow = false;
                });
        },

        //获取商品
        getGoodLost() {
            this.spinShow = true;
            axios
                .request({
                    url: "mall-goods?page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.goodsList = res.data.data;
                    this.total = res.data.total;
                    this.pre_page = res.data.pre_page;
                    this.spinShow = false;
                });
        },

        //新建商品
        newData() {
            this.isNew = true;
            this.openGoodModal(true);
        },
        //打开商品编辑窗口
        openGoodModal(i) {
            this.dataModal = i;
        },
        //提交商品
        inputData() {
            this.spinShow = true;
            if (this.isNew) {
                axios
                    .request({
                        url: "mall-goods",
                        method: "post",
                        data: {
                            imgs: this.goodData.imgs,
                            nav_id: this.goodData.nav_id,
                            name: this.goodData.name,
                            type: this.goodData.type,
                            content: this.goodData.content,
                            total: this.goodData.total,
                            limit: this.goodData.limit,
                            price: this.goodData.price,
                            discount: this.goodData.discount,
                            is_up: this.goodData.is_up,
                            monthly_sales: this.goodData.monthly_sales,
                            sratr_date: this.goodDiscountDate[0],
                            end_date: this.goodDiscountDate[1]
                        }
                    })
                    .then(res => {
                        this.getGoodLost();
                        this.$Message.success("新增成功");
                    });
            }else{
                axios
                    .request({
                        url: "mall-goods/"+this.currentId,
                        method: "put",
                        data: {
                            imgs: this.goodData.imgs,
                            nav_id: this.goodData.nav_id,
                            name: this.goodData.name,
                            type: this.goodData.type,
                            content: this.goodData.content,
                            total: this.goodData.total,
                            limit: this.goodData.limit,
                            price: this.goodData.price,
                            discount: this.goodData.discount,
                            is_up: this.goodData.is_up,
                            monthly_sales: this.goodData.monthly_sales,
                            sratr_date: this.goodDiscountDate[0],
                            end_date: this.goodDiscountDate[1]
                        }
                    })
                    .then(res => {
                        this.getGoodLost();
                        this.$Message.success("修改成功");
                    });
            }
        },

        //删除商品
        deleteGood() {
            this.spinShow = true;
            axios
                .request({
                    url: "mall-goods/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success('删除成功')
                    this.getGoodLost();
                });
        },
        deleteShow(i) {
            this.deleteModal = i;
        }
    },
    mounted() {
        this.getGoodLost();
        this.getType();
        this.getSwipeType();
    },
    computed: {
        headers() {
            return {
                token: Cookies.get("token")
            };
        }
    }
};
</script>

<style scoped>
</style>