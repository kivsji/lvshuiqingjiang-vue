<template>
    <div style="width:95%;display:blcok;margin:0 auto;border-radius:10px;background:#fff;min-height:800px;padding:2%;">
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col span='2' style="line-height:22px;text-align:center;">
                开启会员功能
            </i-col>
            <i-col span='20'>
                <i-switch v-model="vipSetData.status" :true-value='1' :false-value='0' />
            </i-col>
        </row>
        <row v-show="vipSetData.status === 1">
            <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;">
                <i-col span='2' style="line-height:30px;text-align:center;">
                    会员消费积分比例
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="1" v-model="vipSetData.scale"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;">
                <i-col span='2' style="line-height:30px;text-align:center;">
                    优惠类型
                </i-col>
                <i-col span='20'>
                    <RadioGroup v-model="vipSetData.offer_status" type="button" @on-change='resetOffer'>
                        <Radio :label="0">关闭</Radio>
                        <Radio :label="1">满减</Radio>
                        <Radio :label="2">折扣</Radio>
                    </RadioGroup>
                </i-col>
            </row>
            <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;" v-show='vipSetData.offer_status!==0'>
                <i-col span='2' style="line-height:30px;text-align:center;">
                    结算使用优惠
                </i-col>
                <i-col span='20'>
                    <i-switch v-model="vipSetData.auto_status" :true-value='1' :false-value='0' />
                </i-col>
            </row>
            <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;" v-if='vipSetData.offer_status===1'>
                <!-- <i-col span='2' style="line-height:30px;text-align:center;">
                等级对应折扣
            </i-col> -->
                <i-col span='24'>
                    <row>

                        <i-col span='2' style="line-height:30px;text-align:center;">会员折扣:</i-col>
                        <!-- <i-col span='1'>
                            <Button icon="md-add" type="primary" shape="circle" @click="addOffer()"></Button>
                        </i-col> -->
                        <i-col span='10'>
                            <row v-for='(item,index) in groupList' :key='index' style="margin-bottom:10px;">
                                <i-col span='4'>
                                    <p style="line-height:32px;font-size:16px;">{{item.name}}:</p>
                                </i-col>
                                <i-col span='9'>
                                    <Input v-model="offerData1[index].condition">
                                    <span slot="prepend">满</span>
                                    </Input>
                                </i-col>
                                <i-col span='9' offset='2'>
                                    <Input v-model="offerData1[index].discount">
                                    <span slot="prepend">减</span>
                                    </Input>
                                </i-col> 
                            </row>
                        </i-col>
                    </row>
                </i-col>
            </row>
            <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;" v-if='vipSetData.offer_status===2'>
                <!-- <i-col span='2' style="line-height:30px;text-align:center;">
                会员折扣
            </i-col> -->
                <i-col span='24'>
                    <row>
                        <i-col span='2' style="line-height:30px;text-align:center;">会员折扣:</i-col>
                        <i-col span='10'>
                            <row v-for='(item,index) in groupList' :key='index' style="margin-bottom:10px;">
                                <i-col span='4'>
                                    <p style="line-height:32px;font-size:16px;">{{item.name}}:</p>
                                </i-col>
                                <i-col span='9'>
                                    <Input v-model="offerData2[index].discount">
                                        <span slot="prepend">折</span>
                                    </Input>
                                </i-col>
                            </row>
                        </i-col>
                    </row>
                </i-col>
            </row>
        </row>

        <row style="margin:50px 50px;">
            <i-col span='2' style="line-height:30px;">
                <Button type='primary' @click='inputVipSet()'>保存</Button>
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
            spinShow: false,
            vipSetData: {
                status: 0, //开启会员功能
                scale: 1,
                offer_status: 0, //会员优惠类型  0 关闭 1 满减 2 折扣
                auto_status: 0, //结算自动使用优惠
                offer: [
                    {
                        groups: "高级会员",
                        full: "", //满
                        reduction: "", //减
                        discount: "" //折
                    }
                ] //等级对应折扣

            },
            offerData1:[{
                        condition:'',
                        discount:''
                    }],
            offerData2:[{
                        discount:''
                    }],
            groups: ["普通会员", "高级会员"],
            groupList:[],
        };
    },
    methods: {
        resetOffer(i){
            if(i === 1){
                this.offerData1 = []
                for(let i=0;i<this.groupList.length;i++){
                    this.offerData1.push({
                        condition:'',
                        discount:''
                    })
                }
            }else if(i === 2){
                this.offerData2 = []
                for(let i=0;i<this.groupList.length;i++){
                    this.offerData2.push({
                        discount:''
                    })
                }
            }
            console.log(this.offerData2);
            
        },
        getGroupList() {
            axios
                .request({
                    url: "member/groups",
                    method: "get"
                })
                .then(res => {
                    this.groupList = res.data;
                    this.getVipSet();
                });
        },
        addOffer() {
            this.vipSetData.offer.push({
                full: "",
                reduction: ""
            });
            this.vipSetData.offer_status = 0;
            this.vipSetData.offer_status = 1;
        },
        getVipSet() {
            this.spinShow = true;
            //获取会员设置
            console.log(1);
            
            axios
                .request({
                    url: "/member/settings",
                    method: "get"
                })
                .then(res => {
                    // console.log(res);
                    this.vipSetData = {
                        status: res.setting.status,
                        scale: res.setting.scale,
                        offer_status: res.setting.offer_status,
                        auto_status: res.setting.auto_status
                    };
                    this.vipSetData.offer = [];

                    if (this.vipSetData.offer_status === 1) {
                        // for (let i = 0; i < res.setting.offer.length; i++) {
                        //     this.vipSetData.offer.push({
                        //         full: "",
                        //         reduction: ""
                        //     });
                        //     this.vipSetData.offer[i].full =
                        //         res.setting.offer[i].condition;
                        //     this.vipSetData.offer[i].reduction =
                        //         res.setting.offer[i].discount;
                        // }
                        this.offerData1 = res.setting.offer
                    } else if (this.vipSetData.offer_status === 2) {
                        // this.vipSetData.offer = [
                        //     {
                        //         discount: ""
                        //     }
                        // ];
                        // this.vipSetData.offer[0].discount =
                        //     res.setting.offer[0].discount;
                        this.offerData2 = res.setting.offer
                    } else {
                        this.vipSetData.offer = [];
                    }
                    
                    
                    this.spinShow = false;
                });
        },
        inputVipSet() {
            let offerr = [];
            if(this.vipSetData.offer_status === 1){
                for(let i=0;i<this.offerData1.length;i++){
                    if(this.offerData1[i].condition === '' || this.offerData1[i].discount === ''){
                        this.$Message.error('满级资料不完整')
                        return false
                    }
                }
                offerr = this.offerData1
            }else if(this.vipSetData.offer_status === 2){
                for(let i=0;i<this.offerData2.length;i++){
                    if(this.offerData2[i].discount === ''){
                        this.$Message.error('满级资料不完整')
                        return false
                    }
                }
                offerr = this.offerData2
            }
            
            this.spinShow = true;
            axios
                .request({
                    url: "/member/settings/1",
                    method: "put",
                    data: {
                        status: this.vipSetData.status,
                        scale: this.vipSetData.scale,
                        offer_status: this.vipSetData.offer_status,
                        auto_status: this.vipSetData.auto_status,
                        offer: offerr
                    }
                })
                .then(res => {
                    this.$Message.success("保存成功");
                    this.getVipSet();
                });
        }
    },
    mounted() {
        
        this.getGroupList()
    }
};
</script>

<style scoped>
</style>