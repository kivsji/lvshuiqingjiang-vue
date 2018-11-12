<template>
    <div>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='cancelInput(true)'>新建VIP</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <Page :total="total" :page-size="pre_page" />
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:1200px;" :columns="vipColunm" :data="vipList"></i-table>
            </i-col>
            <Modal v-model="dataModal" :title='dataTitle' @on-ok="inputVipData" @on-cancel="cancelInput(false)">
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        会员名称
                    </i-col>
                    <i-col span='20'>
                        <Input v-model="vipData.name" />
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        会员等级
                    </i-col>
                    <i-col span='20'>
                        <Select v-model="vipData.group" style="width:200px">
                            <Option v-for="item in groupList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col span='4' style="line-height:30px;">
                        会员电话
                    </i-col>
                    <i-col span='20'>
                        <Input v-model="vipData.phone" />
                    </i-col>
                </row>
            </Modal>
        </row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            total: 1,
            pre_page: 1,
            dataModal:false,
            dataTitle:'新增vip',
            vipData:{
                group:'',
                name:'',
                phone:''
            },
            groupList:[
                {
                    label:'普通会员',
                    value:'0'
                },{
                    label:'高级会员',
                    value:'1'
                }
            ],
            vipColunm: [
                {
                    title: "等级",
                    key: "group"
                },
                {
                    title: "会员名",
                    key: "name"
                },
                {
                    title: "手机号",
                    key: "phone"
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
                                        click: () => {}
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
                                        click: () => {}
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            vipList: [
                {
                    group: "普通会员",
                    name: "水水",
                    phone: "13060606060"
                },
                {
                    group: "高级会员",
                    name: "水水1",
                    phone: "13060606060"
                },
                {
                    group: "普通会员",
                    name: "水水2",
                    phone: "13060606060"
                }
            ]
        };
    },
    methods: {
        cancelInput(i){
            this.dataModal = i
        },
        getVipList() {
            //获取会员列表
        },
        inputVipData() {
            //提价会员资料
        }
    },
    mounted() {}
};
</script>

<style scoped>
</style>