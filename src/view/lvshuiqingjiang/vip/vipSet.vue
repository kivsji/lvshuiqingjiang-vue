<template>
    <div style="width:95%;display:blcok;margin:0 auto;border-radius:10px;background:#fff;min-height:800px;padding:2%;">
        <row>
            <i-col span='2' style="line-height:22px;text-align:center;">
                开启会员功能
            </i-col>
            <i-col span='20'>
                <i-switch v-model="vipSetData.status" :true-value='1' :false-value='0' />
            </i-col>
        </row>
        <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;">
            <i-col span='2' style="line-height:30px;text-align:center;">
                倍数
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
                <RadioGroup v-model="vipSetData.offer_status" type="button">
                    <Radio :label="0">关闭</Radio>
                    <Radio :label="1">满减</Radio>
                    <Radio :label="2">折扣</Radio>
                </RadioGroup>
            </i-col>
        </row>
        <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;">
            <i-col span='2' style="line-height:30px;text-align:center;">
                结算使用优惠
            </i-col>
            <i-col span='20'>
                <i-switch v-model="vipSetData.auto_status" :true-value='1' :false-value='0' />
            </i-col>
        </row>
        <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;">
            <i-col span='2' style="line-height:30px;text-align:center;">
                等级对应折扣
            </i-col>
            <i-col span='24'>
                <row style="margin:50px 50px;">
                    <i-col span='2' style="line-height:30px;">普通会员:</i-col>
                    <i-col span='5'>
                        <Input v-model="vipSetData.offer[0].full">
                        <span slot="prepend">满</span>
                        </Input>
                    </i-col>
                    <i-col span='5' offset='2'>
                        <Input v-model="vipSetData.offer[0].reduction">
                        <span slot="prepend">减</span>
                        </Input>
                    </i-col>
                </row>
                <row style="margin:50px 50px;">
                    <i-col span='2' style="line-height:30px;">高级会员:</i-col>
                    <i-col span='5'>
                        <Input v-model="vipSetData.offer[1].full">
                        <span slot="prepend">满</span>
                        </Input>
                    </i-col>
                    <i-col span='5' offset='2'>
                        <Input v-model="vipSetData.offer[1].reduction">
                        <span slot="prepend">减</span>
                        </Input>
                    </i-col>
                </row>
            </i-col>
        </row>
        <row style="margin:50px 50px;">
            <i-col span='2' style="line-height:30px;">
                <Button type='primary' @click=''>保存</Button>
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
            vipSetData: {
                status: 0, //开启会员功能
                scale: 1,
                offer_status: 0, //会员优惠类型  0 关闭 1 满减 2 折扣
                auto_status: 0, //结算自动使用优惠
                offer: [
                    {
                        groups: "普通会员",
                        full: "", //满
                        reduction: "", //减
                        discount: "" //折
                    },
                    {
                        groups: "高级会员",
                        full: "", //满
                        reduction: "", //减
                        discount: "" //折
                    }
                ] //等级对应折扣
            },
            groups: ["普通会员", "高级会员"]
        };
    },
    methods: {
        getVipSet() {
            //获取会员设置
            axios
                .request({
                    url: "member-settings",
                    method: "get"
                })
                .then(res => {
                    console.log(res);
                });
        }
    },
    mounted() {
        this.getVipSet();
    }
};
</script>

<style scoped>
</style>