<template>
    <div>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='cancelInput(true)'>新建活动</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <Page :total="total" :page-size="pre_page" />
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:1200px;" :columns="activeColunm" :data="activeList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" :title='dataTitle' @on-ok="okInput" @on-cancel="cancelInput(false)">
            <row>
                <i-col span='4' style="line-height:30px;">
                    活动封面
                </i-col>
                <i-col span='4'>
                    <Upload style="margin-bottom:10px;" action="https://www.rdoorweb.com/pzhan/public/qiniu/upload" :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col span='24' style="display:block;margin:0 auto;">
                    <img :src="activeData.image" width="100%">
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    活动标题
                </i-col>
                <i-col span='20'>
                    <Input v-model="activeData.title" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    活动内容
                </i-col>
                <i-col span='20'>
                    <Input v-model="activeData.content" type="textarea" :rows='6' />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    活动日期
                </i-col>
                <i-col span='20'>
                    <DatePicker type='daterange' @on-change='changeActiveDate' :value='activeData.activeDate' placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    报名名额
                </i-col>
                <i-col span='20'>
                    <InputNumber :min="0" v-model="activeData.places" :formatter="value => `${value}人`" :parser="value => value.replace('人', '')"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    报名日期
                </i-col>
                <i-col span='20'>
                    <DatePicker @on-change='changeActiveDate' :value='activeData.signDate' type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </i-col>
            </row>

            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    报名类型
                </i-col>
                <i-col span='20'>
                    <RadioGroup v-model="activeType" type="button" @on-change='changeActiveType'>
                        <Radio label="免费"></Radio>
                        <Radio label="付费"></Radio>
                    </RadioGroup>
                </i-col>
            </row>
            <row style="margin-top:10px;" v-if="activeData.type === 1">
                <i-col span='4' style="line-height:30px;">
                    报名金额
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="activeData.money" :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')" :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
                </i-col>
            </row>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            total: 1,
            pre_page: 1,
            dataModal: false,
            dataTitle: "新增活动",
            activeType: "免费",
            activeData: {
                image:
                    "http://img1.imgtn.bdimg.com/it/u=371772476,1548437417&fm=26&gp=0.jpg",
                title: "",
                content: "",
                activeDate: '',
                // activeDate: ["2018-11-07", "2018-12-05"],
                signDate: ["2018-11-07", "2018-12-05"],
                places: 0,
                //2018-08-08-2018-12-05
                type: "0",
                money: 0
            },
            activeColunm: [
                {
                    title: "活动名称",
                    key: "name"
                },
                {
                    title: "活动开始日期",
                    key: "beginTime"
                },
                {
                    title: "活动结束日期",
                    key: "endTime"
                },
                {
                    title: "报名开始日期",
                    key: "signBeginTime"
                },
                {
                    title: "报名结束日期",
                    key: "signEndTime"
                },
                {
                    title: "活动状态",
                    key: "status"
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
                                            localStorage.setItem(
                                                "docsId",
                                                params.row.id
                                            );
                                            this.$router.push({
                                                path: "/"
                                            });
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
                                            localStorage.setItem(
                                                "docsId",
                                                params.row.id
                                            );
                                            this.$router.push({
                                                path: "/"
                                            });
                                        }
                                    }
                                },
                                "查看报名列表"
                            )
                        ]);
                    }
                }
            ],
            activeList: [
                {
                    name: "活动1",
                    beginTime: "2018-11-08",
                    endTime: "2018-11-11",
                    signBeginTime: "2018-11-5",
                    signEndTime: "2018-11-08",
                    status: "1"
                },
                {
                    name: "活动2",
                    beginTime: "2018-11-08",
                    endTime: "2018-11-11",
                    signBeginTime: "2018-11-5",
                    signEndTime: "2018-11-08",
                    status: "1"
                },
                {
                    name: "活动3",
                    beginTime: "2018-11-08",
                    endTime: "2018-11-11",
                    signBeginTime: "2018-11-5",
                    signEndTime: "2018-11-08",
                    status: "1"
                }
            ]
        };
    },
    methods: {
        cancelInput(i) {
            //打开活动Modal
            this.dataModal = i;
        },
        editData() {
            //编辑活动数据
        },
        okInput() {
            //提交活动数据
        },
        getActive() {
            //获取活动数据
            axios.request({
                url:'/activitys',
                method:'get'
            }).then(res=>{
                console.log(res);
            })
        },
        changeActiveDate(t) {
            console.log(t);
        },
        changeActiveType(t) {
            //更改活动报名类型触发
            if (t === "免费") {
                this.activeData.type = 0;
            } else {
                this.activeData.type = 1;
            }
        },

        //上传事件
        successUpload(file) {},
        beforeUpload(file) {}
    },
    mounted() {
        this.getActive()
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

