<template>
    <div style="width:95%;display:blcok;margin:0 auto;border-radius:10px;background:#fff;min-height:800px;min-width:800px;padding:2%;">
        <Spin
            size="large"
            fix
            v-if="spinShow"
        ></Spin>
        <row>
            <i-col
                span='4'
                style="line-height:22px;text-align:center;"
            >
                开启积分功能
            </i-col>
            <i-col span='20'>
                <i-switch
                    v-model="shopSetData.switch"
                    :true-value='1'
                    :false-value='0'
                />
            </i-col>
        </row>
        <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;">
            <i-col
                span='4'
                style="line-height:30px;text-align:center;"
            >
                商品消费积分比例
            </i-col>
            <i-col span='20'>
                <InputNumber
                    :min="0"
                    :precision='2'
                    v-model="shopSetData.radio"
                ></InputNumber>
            </i-col>
        </row>
        <row style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;">
            <i-col
                span='4'
                style="line-height:30px;text-align:center;"
            >
                订单过期类型
            </i-col>
            <i-col span='20'>
                <RadioGroup
                    v-model="shopSetData.type"
                    type="button"
                    @on-change='changType'
                >
                    <Radio label="day">固定天数</Radio>
                    <Radio label="date">指定日期前</Radio>
                </RadioGroup>
            </i-col>
        </row>
        <row
            style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;"
            v-if="shopSetData.type === 'day'"
        >
            <i-col
                span='4'
                style="line-height:30px;text-align:center;"
            >
                订单使用天数（自付款起算）
            </i-col>
            <i-col span='20'>
                <InputNumber
                    :min="1"
                    v-model="shopSetData.date"
                ></InputNumber>
            </i-col>
        </row>
        <row
            style="margin-top:30px;border-top:1px solid #eee;padding-top:30px;"
            v-else
        >
            <i-col
                span='4'
                style="line-height:30px;text-align:center;"
            >
                订单使用截止日期（固定）
            </i-col>
            <i-col span='20'>
                <DatePicker type="date" v-model="shopSetData.date" value-format="yyyy-MM-dd" format='yyyy-MM-dd' :options="picDataOptions" @on-change='dateText=$event' placeholder="选择日期"></DatePicker>
            </i-col>
        </row>
        <row style="margin:50px 50px;">
            <i-col
                span='4'
                style="line-height:30px;"
            >
                <Button
                    type='primary'
                    @click='submitSet'
                >保存</Button>
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    
    data() {
        return {
            spinShow:false,
            shopSetData: {
                switch: 0,
                radio: 0,
                type:'day',
                date:10,
                
            },
            picDataOptions: {},
        };
    },
    methods: {
        changType(key){
            if(key ==='day'){
                this.shopSetData.date = 10
            }else{
                this.shopSetData.date = ''
            }
        },
        submitSet(){
            if(this.shopSetData.type === 'date'){
                if(this.shopSetData.date === ''){
                    this.$Message.error('日期不能为空')
                    return false
                }
            }
            this.spinShow = true
            this.inputMallSet()
        },
        getOrderSet(){
            axios.request({
                url:'order/settings/new',
                method:'get'
            }).then(res=>{
                this.shopSetData.type = res.data.type
                if(res.data.type === 'day'){
                    this.shopSetData.date = res.data.day
                }else{
                    this.shopSetData.date = res.data.date
                }
            })
        },
        getMallSet(){
            axios.request({
                url:'mall/settings',
                method:'get'
            }).then(res=>{
                this.shopSetData.switch = res.data[0].switch
                this.shopSetData.radio = res.data[0].radio
            })
        },
        inputMallSet(){
            axios.request({
                url:'mall/settings',
                method:'post',
                data:{
                    switch:this.shopSetData.switch,
                    radio:this.shopSetData.radio
                }
            }).then(res=>{
                this.inputOrderSet()
            })
        },
        inputOrderSet(){
            if(this.shopSetData.type === 'date'){
                var d = new Date(this.shopSetData.date);
                this.shopSetData.date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            }
            axios.request({
                url:'order/settings',
                method:'post',
                data:{
                    type:this.shopSetData.type,
                    date:this.shopSetData.date
                }
            }).then(res=>{
                this.spinShow = false
                this.$Message.success('修改成功')
                this.getMallSet()
                this.getOrderSet()
            })
        }
    },
    mounted() {
        this.getMallSet()
        this.getOrderSet()
    }
};
</script>

<style scoped>
</style>