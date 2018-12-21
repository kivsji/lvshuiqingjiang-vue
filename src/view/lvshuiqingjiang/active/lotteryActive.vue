<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <!-- <Button type='primary' @click='newData()'>新建活动</Button> -->
            </i-col>
            <i-col style="margin-bottom:20px;">
                <!-- <Page :total="total" :page-size="pre_page" :on-change='changePage' /> -->
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:800px;" :columns="activeColunm" :data="activeList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" :title='dataTitle' @on-ok="okInput" @on-cancel="cancelInput(false)">
            <row>
                <i-col span='4' style="line-height:30px;">
                    活动封面
                </i-col>
                <i-col span='4'>
                    <Upload style="margin-bottom:10px;" action="https://www.rdoorweb.com/lvshui/public/qiniu/upload"
                        :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col span='24' style="display:block;margin:0 auto;">
                    <img :src="activeData.img" width="100%">
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    活动名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="activeData.name" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    活动介绍
                </i-col>
                <i-col span='20'>
                    <Input v-model="activeData.introduce" type="textarea" :rows='6' />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    活动开关
                </i-col>
                <i-col span='20'>
                    <i-switch v-model="activeData.status" :true-value='1' :false-value='0' />
                </i-col>
            </row>
        </Modal>
        <Modal v-model="editModal" title='奖品编辑' @on-ok="inputEdit()" @on-cancel="cancelEdit(false)">
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    奖品卡券
                </i-col>
                <i-col span='20'>
                    <Select v-model="couponsData.coupon_id" style="width:200px">
                        <Option v-for="item in couponsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    排序等级
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="0" v-model="couponsData.orderby_lev"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    获得概率
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="0" :max='100-allProbably' v-model="couponsData.probably"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    奖品数量
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="1" v-model="couponsData.number"></InputNumber>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="peopleModal" width='1000px' title='奖品列表' @on-ok="cancelPeople(false)" @on-cancel="cancelPeople(false)">
            <Button style="margin-bottom:10px;" type='primary' @click='newEdit()'>新增奖品</Button>
            <i-table size="large" :columns="peopleColunm" :data="prizeList"></i-table>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            allProbably:0,//总概率
            spinShow: false,
            editModal:false,
            total: 1,
            pre_page: 1,
            currentPage: 1,
            dataModal: false,
            isNew: false,
            peopleModal: false,
            currentId: "",
            dataTitle: "新增活动",
            activeType: "免费",
            activeData: {
                img: "",
                name: "",
                introduce: "",
                status: 0
            },
            couponsList:[],
            couponsData:{
                    coupon_id:'',//奖品卡券id
                    orderby_lev:0,//排序等级
                    probably:0,//概率%
                    number:1//奖品数量 0位无限
                },
            currentCouponId:'',
            activeColunm: [
                {
                    title: "活动名称",
                    key: "name"
                },
                {
                    title: "活动介绍",
                    key: "introduce"
                },
                {
                    title: "活动状态",
                    // key: "status",
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                    style:
                                        "color:#" + params.row.status === 0
                                            ? "2d8cf0"
                                            : "19be6b"
                                }
                            },
                            params.row.status === 0
                                ? "未开启"
                                : "开启"
                        );
                    }
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
                                            this.cancelInput(true);
                                            this.isNew = false;
                                            this.currentId = params.row.id;
                                            console.log(this.currentId);
                                            
                                            this.activeData = {
                                                img: params.row.img,
                                                name: params.row.name,
                                                introduce: params.row.introduce,
                                                status: params.row.status
                                            };
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "success",
                                        size: "small"
                                    },
                                    attrs: {
                                        style:
                                            "font-size:12px;margin-left:10px;"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentId = params.row.id;
                                            this.getActivePrize();
                                        }
                                    }
                                },
                                "查看奖品列表"
                            )
                        ]);
                    }
                }
            ],
            activeList: [],
            peopleColunm: [
                {
                    title: "奖品",
                    key: "coupon_id",
                },
                {
                    title: "排序等级",
                    key:'orderby_lev'
                },
                {
                    title: "概率(%)",
                    key:'probably'
                },{
                    title: "奖品数量(0 为无限制)",
                    key:'number'
                },{
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
                                            this.cancelPeople(false);
                                            this.cancelEdit(true);
                                            this.isNew = false;
                                            this.currentCouponId = params.row.id;
                                            this.couponsData = {
                                                coupon_id: params.row.coupon_id,
                                                orderby_lev: params.row.orderby_lev,
                                                probably: params.row.probably,
                                                number: params.row.number
                                            };
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
                                        style: "font-size:12px"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.cancelEdit(true);
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            prizeList: []
        };
    },
    methods: {
        changePage(index) {
            this.currentPage = index;
            this.getActive();
        },
        cancelEdit(i){
            this.editModal = i
            if(!i){
                this.cancelPeople(true)
            }
        },
        newEdit(){
            this.cancelEdit(true)
            this.cancelPeople(false)
            this.couponsData = {
                coupon_id:'',//奖品卡券id
                orderby_lev:0,//排序等级
                probably:0,//概率%
                number:1//奖品数量 0位无限
            }
            this.isNew = true
        },
        inputEdit(){
            if(this.isNew){
                axios.request({
                    url:'lottery/prizes',
                    method:'post',
                    data:{
                        activity_id:this.currentId,
                        coupon_id:this.couponsData.coupon_id,
                        orderby_lev:this.couponsData.orderby_lev,
                        probably:this.couponsData.probably,
                        number:this.couponsData.number
                    }
                }).then(res=>{
                    this.getActivePrize()
                    this.cancelPeople(true)
                })
            }else{
                axios.request({
                    url:'lottery/prizes/'+this.currentCouponId,
                    method:'put',
                    data:{
                        activity_id:this.currentId,
                        coupon_id:this.couponsData.coupon_id,
                        orderby_lev:this.couponsData.orderby_lev,
                        probably:this.couponsData.probably,
                        number:this.couponsData.number
                    }
                }).then(res=>{
                    this.getActivePrize()
                    this.cancelPeople(true)
                })
            }
        },  
        newData() {
            this.isNew = true;
            this.activeData = {
                status: 0,
                name: "",
                introduce: "",
                img:''
            };
            this.cancelInput(true);
        },
        cancelPeople(i) {
            this.peopleModal = i;
        },
        cancelInput(i) {
            //打开活动Modal
            this.dataModal = i;
        },
        editData() {
            //编辑活动数据
        },
        okInput() {
            //提交活动数据
            if (this.isNew) {
                this.spinShow = true;
                //新增
                axios
                    .request({
                        url: "lottery/activitys",
                        method: "post",
                        data: {
                            img: this.activeData.img,
                            name: this.activeData.name,
                            introduce: this.activeData.introduce,
                            status:this.activeData.status
                        }
                    })
                    .then(res => {
                        this.getActive();
                        this.$Message.success("新增成功");
                    });
            } else {
                this.spinShow = true;
                //修改
                axios
                    .request({
                        url: "lottery/activitys/" + this.currentId,
                        method: "put",
                        data: {
                            img: this.activeData.img,
                            name: this.activeData.name,
                            introduce: this.activeData.introduce,
                            status:this.activeData.status
                        }
                    })
                    .then(res => {
                        this.getActive();
                        this.$Message.success("修改成功");
                    });
            }
        },
        getActive() {
            this.spinShow = true;
            //获取活动数据
            axios
                .request({
                    url: "lottery/activitys?page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    //临时解决方案
                    this.activeList = []
                    this.activeList.push(res.data);
                    /*********** */
                    this.spinShow = false;
                });
        },
        changeActiveDate(t) {
            this.activeData.activeDate = t;
        },
        changeActiveSignDate(t) {
            this.activeData.signDate = t;
        },
        changeActiveType(t) {
            //更改活动报名类型触发
            if (t === "免费") {
                this.activeData.type = 0;
            } else {
                this.activeData.type = 1;
            }
        },
        //查看奖品列表
        getActivePrize() {
            this.spinShow = true;
            axios
                .request({
                    url: "lottery/prizes/" + this.currentId,
                    method: "get"
                })
                .then(res => {
                    this.allProbably = 0
                    this.spinShow = false;
                    this.cancelPeople(true);
                    this.prizeList = res.data;
                    for(let i=0;i<this.prizeList.length;i++){
                        this.allProbably += this.prizeList[i].probably
                    }
                    this.getCoupon()
                });
        },
        //获取卡券列表
        getCoupon(){
            axios.request({
                url:'coupon/coupons',
                method:'get'
            }).then(res=>{
                this.couponsList = res.data.data
            })
        },
        //上传事件
        successUpload(file) {},
        beforeUpload(file) {}
    },
    mounted() {
        this.getActive();
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

<style>
</style>

