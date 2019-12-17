<template>
    <div>
        <Spin
            size="large"
            fix
            v-if="spinShow"
        ></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button
                    type='primary'
                    @click='newData()'
                >新建活动</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <Page
                    :total="total"
                    :page-size="pre_page"
                    :on-change='changePage'
                />
            </i-col>
            <i-col>
                <i-table
                    size="large"
                    style="min-width:800px;"
                    :columns="activeColunm"
                    :data="activeList"
                ></i-table>
            </i-col>
        </row>
        <Modal
            v-model="dataModal"
            :title='dataTitle'
            @on-ok="okInput"
            @on-cancel="cancelInput(false)"
        >
            <row>
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    活动封面
                </i-col>
                <i-col span='4'>
                    <Upload
                        style="margin-bottom:10px;"
                        :action="URL.UPLOAD_URL"
                        :on-success='successUpload'
                        :before-upload='beforeUpload'
                        :show-upload-list='false'
                        :headers="headers"
                    >
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col
                    span='24'
                    style="display:block;margin:0 auto;"
                >
                    <img
                        :src="activeData.image"
                        width="100%"
                    >
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    活动标题
                </i-col>
                <i-col span='20'>
                    <Input v-model="activeData.title" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    活动内容
                </i-col>
                <i-col span='20'>
                    <Input
                        v-model="activeData.content"
                        type="textarea"
                        :rows='6'
                    />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    活动日期
                </i-col>
                <i-col span='20'>
                    <DatePicker
                        type='daterange'
                        @on-change='changeActiveDate'
                        :value='activeData.activeDate'
                        placement="bottom-end"
                        placeholder="选择日期"
                        style="width: 200px"
                    ></DatePicker>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    报名名额
                </i-col>
                <i-col span='20'>
                    <InputNumber
                        :min="0"
                        v-model="activeData.places"
                        :formatter="value => `${value}人`"
                        :parser="value => value.replace('人', '')"
                    ></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    报名日期
                </i-col>
                <i-col span='20'>
                    <DatePicker
                        @on-change='changeActiveSignDate'
                        :value='activeData.signDate'
                        type="daterange"
                        placement="bottom-end"
                        placeholder="选择日期"
                        style="width: 200px"
                    ></DatePicker>
                </i-col>
            </row>

            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    报名类型
                </i-col>
                <i-col span='20'>
                    <RadioGroup
                        v-model="activeType"
                        type="button"
                        @on-change='changeActiveType'
                    >
                        <Radio label="免费"></Radio>
                        <Radio label="付费"></Radio>
                    </RadioGroup>
                </i-col>
            </row>
            <row
                style="margin-top:10px;"
                v-if="activeData.type === 1"
            >
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    报名金额
                </i-col>
                <i-col span='20'>
                    <InputNumber
                        v-model="activeData.money"
                        :min="0.00"
                        :precision='2'
                        :formatter="value => `¥ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                        :parser="value => value.replace(/$s?|(,*)/g, '')"
                    ></InputNumber>
                </i-col>
            </row>
        </Modal>
        <Modal
            v-model="peopleModal"
            title='报名名单'
            @on-ok="cancelPeople(false)"
            @on-cancel="cancelPeople(false)"
        >
            <i-table
                size="large"
                :columns="peopleColunm"
                :data="peopleList"
            ></i-table>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
import URL from "_conf/url";
export default {
    data() {
        return {
            URL: {
                UPLOAD_URL: URL.UPLOAD_URL
            },
            spinShow: false,
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
                image: "",
                title: "",
                content: "",
                activeDate: ["2018-11-07", "2018-12-05"],
                signDate: ["2018-11-07", "2018-12-05"],
                places: 0,
                type: 0,
                money: 0
            },
            activeColunm: [
                {
                    title: "活动名称",
                    key: "name"
                },
                {
                    title: "活动开始日期",
                    key: "start_time"
                },
                {
                    title: "活动结束日期",
                    key: "end_time"
                },
                {
                    title: "报名开始日期",
                    key: "sign_start_time"
                },
                {
                    title: "报名结束日期",
                    key: "sign_end_time"
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
                                            : params.row.status === 1
                                            ? "19be6b"
                                            : "ff9900"
                                }
                            },
                            params.row.status === 0
                                ? "未开始"
                                : params.row.status === 1
                                ? "开始"
                                : "已结束"
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

                                            this.activeData = {
                                                image: params.row.thumb,
                                                title: params.row.name,
                                                content: params.row.content,
                                                activeDate: [
                                                    params.row.start_time,
                                                    params.row.end_time
                                                ],
                                                signDate: [
                                                    params.row.sign_start_time,
                                                    params.row.sign_end_time
                                                ],
                                                places: params.row.places,
                                                type: params.row.sign_type,
                                                money: parseInt(
                                                    params.row.sign_price
                                                )
                                            };
                                            this.activeData.type === 0
                                                ? (this.activeType = "免费")
                                                : (this.activeType = "付费");
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
                                            this.getActivePeople();
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
                }
            ],
            peopleColunm: [
                {
                    title: "报名人",
                    key: "nickname"
                },
                {
                    title: "联系人",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {
                                    attrs: {}
                                },
                                params.row.pivot.name
                            )
                        ]);
                    }
                },
                {
                    title: "联系电话",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {
                                    attrs: {}
                                },
                                params.row.pivot.contact_way
                            )
                        ]);
                    }
                }
            ],
            peopleList: []
        };
    },
    methods: {
        changePage(index) {
            this.currentPage = index;
            this.getActive();
        },
        newData() {
            this.isNew = true;
            this.activeData = {
                image: "",
                title: "",
                content: "",
                activeDate: ["", ""],
                signDate: ["", ""],
                places: 100,
                type: 0,
                money: 0
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
                        url: "activity/activitys",
                        method: "post",
                        data: {
                            thumb: this.activeData.image,
                            name: this.activeData.title,
                            content: this.activeData.content,
                            start_time: this.activeData.activeDate[0],
                            end_time: this.activeData.activeDate[1],
                            sign_start_time: this.activeData.signDate[0],
                            sign_end_time: this.activeData.signDate[1],
                            places: this.activeData.places,
                            sign_type: this.activeData.type,
                            sign_price: this.activeData.money
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
                        url: "activity/activitys/" + this.currentId,
                        method: "put",
                        data: {
                            thumb: this.activeData.image,
                            name: this.activeData.title,
                            content: this.activeData.content,
                            start_time: this.activeData.activeDate[0],
                            end_time: this.activeData.activeDate[1],
                            sign_start_time: this.activeData.signDate[0],
                            sign_end_time: this.activeData.signDate[1],
                            places: this.activeData.places,
                            sign_type: this.activeData.type,
                            sign_price: this.activeData.money
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
                    url: "activity/activitys?page=" + this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.activeList = res.data.data;
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
        //查看报名人员
        getActivePeople() {
            this.spinShow = true;
            axios
                .request({
                    url: "activity/activitys/" + this.currentId,
                    method: "get"
                })
                .then(res => {
                    this.spinShow = false;
                    this.cancelPeople(true);
                    this.peopleList = res.data.fans;
                });
        },
        //上传事件
        successUpload(file) {},
        beforeUpload(file) {}
    },
    mounted() {
        this.URL.UPLOAD_URL = URL.UPLOAD_URL;
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

