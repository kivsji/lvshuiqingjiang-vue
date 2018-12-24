<template>
    <div>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建奖券</Button>
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:800px;" :columns="couponsColunm" :data="couponsList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" style="width:500px;" title='奖券设置' @on-ok="inputCouponsData" @on-cancel="cancleDara(false)" :mask-closable="false">
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    奖券类型
                </i-col>
                <i-col span='18'>
                    <RadioGroup v-model="couponsData.type" type="button">
                        <Radio :label="0">优惠券</Radio>
                        <Radio :label="1">兑换券</Radio>
                    </RadioGroup>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    奖券名称
                </i-col>
                <i-col span='18'>
                    <Input v-model="couponsData.name" />
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    奖券描述
                </i-col>
                <i-col span='18'>
                    <Input v-model="couponsData.desc" />
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    奖券封面
                </i-col>
                <i-col span='18'>
                    <Upload style="margin-bottom:10px;" action="https://zhlsqj.com/qiniu/upload" :on-success='successUpload'
                        :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <img :src="couponsData.thumb" style="width:100%;height:auto;display:block;">
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    兑换中心显示
                </i-col>
                <i-col span='18'>
                    <i-switch v-model="couponsData.display" :true-value='1' :false-value='0' />
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    领取条件
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.receive_num"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    用户总共可领取
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.limit"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    用户每日可领取数量
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.day_limit"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    奖券总数量
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.total"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='6' style="line-height:30px;">
                    使用时间类型
                </i-col>
                <i-col span='18'>
                    <RadioGroup v-model="couponsData.time_type" type="button">
                        <Radio :label="0">固定时间段</Radio>
                        <Radio :label="1">固定天数</Radio>
                    </RadioGroup>
                </i-col>
            </row>
            <row style="margin-top:20px;" v-if="couponsData.time_type === 0">
                <i-col span='6' style="line-height:30px;">
                    固定时间段
                </i-col>
                <i-col span='18'>
                    <DatePicker @on-change='changeTime' type="daterange" v-model="time" placement="bottom-end" style="width: 200px"></DatePicker>
                </i-col>
            </row>
            <row style="margin-top:20px;" v-if="couponsData.time_type === 1">
                <i-col span='6' style="line-height:30px;">
                    领取天数后开始计算
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.startat"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;" v-if="couponsData.time_type === 1">
                <i-col span='6' style="line-height:30px;">
                    开始计算天数内使用
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.time_limit"></InputNumber>
                </i-col>
            </row>

            <row style="margin-top:20px;" v-if="couponsData.type === 0">
                <i-col span='6' style="line-height:30px;">
                    满
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.use_price"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:20px;" v-if="couponsData.type === 0">
                <i-col span='6' style="line-height:30px;">
                    减
                </i-col>
                <i-col span='18'>
                    <InputNumber :min="0" v-model="couponsData.price"></InputNumber>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteShow" title='删除' @on-ok="deleteData" @on-cancel="deleteModal(false)">
            是否删除 <span style="color:red;">{{currentName}}</span> ?
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            isNew:false,
            dataModal: false,
            deleteShow:false,
            currentName:'',
            currentId:'',
            couponsColunm: [
                {
                    title: "奖券类型",
                    width:100,
                    render: (h,params)=>{
                        return h('p',params.row.type === 0?'优惠券':'兑换券')
                    }
                },{
                    title: "奖券名称",
                    key: "name"
                },
                {
                    title: "描述",
                    key: "desc"
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
                                            this.isNew = false
                                            this.couponsData = 
                                            this.couponsData = {
                                                type: params.row.type, //0 优惠券 1 兑换券
                                                name: params.row.name,
                                                thumb: params.row.thumb, //缩略图
                                                desc: params.row.desc,
                                                display: params.row.display, //在兑换中心显示 0 不显示 1 显示
                                                receive_num: params.row.receive_num, //领取条件
                                                limit: params.row.limit, //用户一共可领取数量
                                                day_limit: params.row.day_limit, //用户每日可领取数量
                                                total: params.row.total, //代金券总数

                                                //时间设置
                                                time_type: params.row.time_type, //使用期限类型  0 固定时间段 1 用户领取后计算天数
                                                start_time: params.row.start_time, //固定时间段开始时间
                                                end_time: params.row.end_time, //固定时间段结束时间
                                                startat: params.row.startat, //领取后多少天开始计算
                                                time_limit: params.row.time_limit, //开始计算后多少天失效

                                                //优惠券字段↓
                                                use_price: params.row.use_price, //满足使用的金额
                                                price: params.row.price //满减
                                            }
                                            this.currentId = params.row.id
                                            this.cancleDara(true)
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
            couponsList: [],
            time:['',''],
            couponsData: {
                type: 0, //0 优惠券 1 兑换券
                name: "",
                thumb: "", //缩略图
                desc: "",
                display: 0, //在兑换中心显示 0 不显示 1 显示
                receive_num: 0, //领取条件
                limit: 1, //用户一共可领取数量
                day_limit: 1, //用户每日可领取数量
                send_amount: 0, //用户已领取数量
                total: 0, //代金券总数

                //时间设置
                time_type: 0, //使用期限类型  0 固定时间段 1 用户领取后计算天数
                start_time: "", //固定时间段开始时间
                end_time: "", //固定时间段结束时间
                startat: 1, //领取后多少天开始计算
                time_limit: 1, //开始计算后多少天失效

                //优惠券字段↓
                use_price: 0, //满足使用的金额
                price: 0 //满减
            }
        };
    },
    methods: {
        changeTime(time){
            this.couponsData.start_time = time[0]
            this.couponsData.end_time = time[1]
        },
        successUpload(file) {
            this.couponsData.thumb = file.url
        },
        //新建数据
        newData() {
            this.isNew = true
            this.cancleDara(true);
        },
        //dataModal显示
        cancleDara(i) {
            this.dataModal = i;
            if(!i){
                this.getCouponsList()
            }
        },
        deleteModal(i){
            this.deleteShow = i;
        },
        deleteData(){
            axios
                .request({
                    url: "coupon/coupons/"+this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.getCouponsList()
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
        //提交data
        inputCouponsData() {
            if(this.couponsData.name === '' || this.couponsData.thumb === '' || this.couponsData.desc === ''){
                this.$Message.error('奖券基础资料不完整')
                return false
            }
            if(this.isNew){
                axios.request({
                    url:'coupon/coupons',
                    method:'post',
                    data:this.couponsData
                }).then(res=>{
                    this.$Message.success('成功')
                    this.getCouponsList()
                })
            }else{
                axios.request({
                    url:'coupon/coupons/'+this.currentId,
                    method:'put',
                    data:this.couponsData
                }).then(res=>{
                    this.$Message.success('成功')
                    this.getCouponsList()
                })
            }
            this.resetData()
        },
        resetData() {
            //初始化资料
            this.couponsData = {
                type: 0, //0 优惠券 1 兑换券
                name: "",
                thumb: "", //缩略图
                desc: "",
                display: 0, //在兑换中心显示 0 不显示 1 显示
                receive_num: 0, //领取条件
                limit: 1, //用户一共可领取数量
                day_limit: 1, //用户每日可领取数量
                send_amount: 0, //用户已领取数量
                total: 0, //代金券总数

                //时间设置
                time_type: 0, //使用期限类型  0 固定时间段 1 用户领取后计算天数
                start_time: "", //固定时间段开始时间
                end_time: "", //固定时间段结束时间
                startat: 1, //领取后多少天开始计算
                time_limit: 1, //开始计算后多少天失效

                //优惠券字段↓
                use_price: 0, //满足使用的金额
                price: 0 //满减
            };
        }
    },
    mounted() {
        this.getCouponsList();
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