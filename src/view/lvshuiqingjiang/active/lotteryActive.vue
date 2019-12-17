<template>
    <div>
        <Spin
            size="large"
            fix
            v-if="spinShow"
        ></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <!-- <Button type='primary' @click='newData()'>新建活动</Button> -->
            </i-col>
            <i-col style="margin-bottom:20px;">
                <!-- <Page :total="total" :page-size="pre_page" :on-change='changePage' /> -->
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
                        :on-success='successUpload1'
                        :before-upload='beforeUpload'
                        :show-upload-list='false'
                        :headers="headers"
                    >
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col
                    span='24'
                    style="display:block;margin:0 auto 10px;"
                >
                    <img
                        :src="activeData.img"
                        width="30%"
                        style="display:block;margin:0 auto;"
                    >
                </i-col>
            </row>
            <row>
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    转盘图片
                </i-col>
                <i-col span='4'>
                    <Upload
                        style="margin-bottom:10px;"
                        :action="URL.UPLOAD_URL"
                        :on-success='successUpload2'
                        :before-upload='beforeUpload'
                        :show-upload-list='false'
                        :headers="headers"
                    >
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col
                    span='24'
                    style="display:block;margin:0 auto 10px;"
                >
                    <img
                        :src="activeData.turn_img"
                        width="30%"
                        style="display:block;margin:0 auto;"
                    >
                </i-col>
            </row>
            <row>
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    指针图片
                </i-col>
                <i-col span='4'>
                    <Upload
                        style="margin-bottom:10px;"
                        :action="URL.UPLOAD_URL"
                        :on-success='successUpload3'
                        :before-upload='beforeUpload'
                        :show-upload-list='false'
                        :headers="headers"
                    >
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col
                    span='24'
                    style="display:block;margin:0 auto 10px;"
                >
                    <img
                        :src="activeData.pointer_img"
                        width="30%"
                        style="display:block;margin:0 auto;"
                    >
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    活动名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="activeData.name" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    活动介绍
                </i-col>
                <i-col span='20'>
                    <Input
                        v-model="activeData.introduce"
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
                    活动开关
                </i-col>
                <i-col span='20'>
                    <i-switch
                        v-model="activeData.status"
                        :true-value='1'
                        :false-value='0'
                    />
                </i-col>
            </row>
        </Modal>
        <Modal
            v-model="editModal"
            title='奖品编辑'
            @on-ok="inputEdit()"
            @on-cancel="cancelEdit(false)"
        >
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    奖品卡券
                </i-col>
                <i-col span='20'>
                    <Select
                        v-model="couponsData.coupon_id"
                        style="width:200px"
                    >
                        <Option
                            v-for="item in couponsList"
                            :value="item.id"
                            :key="item.id"
                        >{{ item.name }}</Option>
                    </Select>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    奖品等级
                </i-col>
                <i-col span='20'>
                    <InputNumber
                        :min="0"
                        v-model="couponsData.orderby_lev"
                    ></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    获得概率
                </i-col>
                <i-col span='20'>
                    <InputNumber
                        :min="0"
                        :max='100-allProbably'
                        v-model="couponsData.probably"
                    ></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    奖品数量
                </i-col>
                <i-col span='20'>
                    <InputNumber
                        :min="0"
                        v-model="couponsData.number"
                    ></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    角度
                </i-col>
                <i-col span='20'>
                    <InputNumber
                        :min="0"
                        v-model="couponsData.result_angle"
                    ></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col
                    span='4'
                    style="line-height:30px;"
                >
                    等级名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="couponsData.orderby_name" />
                </i-col>
            </row>
        </Modal>
        <Modal
            v-model="peopleModal"
            width='1000px'
            title='奖品列表'
            @on-ok="cancelPeople(false)"
            @on-cancel="cancelPeople(false)"
        >
            <Button
                style="margin-bottom:10px;"
                type='primary'
                @click='newEdit()'
            >新增奖品</Button>
            <i-table
                size="large"
                :columns="peopleColunm"
                :data="prizeList"
            ></i-table>
        </Modal>
        <Modal
            v-model="deleteModal"
            title='删除奖品'
            @on-ok="deleteInput()"
            @on-cancel="cancelDelete(false)"
        >
            <p>是否删除此奖品?</p>
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
                UPLOAD_URL: ""
            },
            allProbably: 0, //总概率
            spinShow: false,
            editModal: false,
            deleteModal: false,
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
                turn_img: "",
                pointer_img: "",
                name: "",
                introduce: "",
                status: 0
            },
            isNumPic: 1, //1 img 2 turn_img 3 pointer_img
            couponsList: [],
            couponsData: {
                coupon_id: "", //奖品卡券id
                orderby_lev: 0, //排序等级
                probably: 0, //概率%
                number: 1, //奖品数量 0位无限
                result_angle: 0, //角度
                orderby_name: ""
            },
            currentCouponId: "",
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
                            params.row.status === 0 ? "未开启" : "开启"
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
                                                img: params.row.img,
                                                turn_img: params.row.turn_img,
                                                pointer_img:
                                                    params.row.pointer_img,
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
                    render: (h, params) => {
                        return h(
                            "p",
                            params.row.coupon_id === 0
                                ? "感谢参与"
                                : params.row.coupon.name
                        );
                    }
                },
                {
                    title: "奖品等级",
                    key: "orderby_lev"
                },
                {
                    title: "等级名称",
                    key: "orderby_name"
                },
                {
                    title: "概率(%)",
                    key: "probably"
                },
                {
                    title: "奖品数量(0 为无限制)",
                    key: "number"
                },
                {
                    title: "角度",
                    key: "result_angle"
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
                                            this.cancelPeople(false);
                                            this.cancelEdit(true);
                                            this.isNew = false;
                                            this.currentCouponId =
                                                params.row.id;
                                            //更新概率限制
                                            this.allProbably = 0;
                                            for (
                                                let i = 0;
                                                i < this.prizeList.length;
                                                i++
                                            ) {
                                                this.allProbably += this.prizeList[
                                                    i
                                                ].probably;
                                            }
                                            this.allProbably -=
                                                params.row.probably;
                                            //
                                            this.couponsData = {
                                                coupon_id: params.row.coupon_id,
                                                orderby_lev:
                                                    params.row.orderby_lev,
                                                probably: params.row.probably,
                                                number: params.row.number,
                                                orderby_name:
                                                    params.row.orderby_name
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
                                        style:
                                            "font-size:12px;margin-left:10px;"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentCouponId =
                                                params.row.id;
                                            this.cancelDelete(true);
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
        cancelEdit(i) {
            this.editModal = i;
            if (!i) {
                this.cancelPeople(true);
            }
        },
        cancelDelete(i) {
            this.deleteModal = i;
            if (!i) {
                this.cancelPeople(true);
            } else {
                this.cancelPeople(false);
            }
        },
        deleteInput() {
            axios
                .request({
                    url: "lottery/prizes/" + this.currentCouponId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success("删除成功");
                    this.getActivePrize();
                });
        },
        newEdit() {
            this.cancelEdit(true);
            this.cancelPeople(false);
            this.couponsData = {
                coupon_id: "", //奖品卡券id
                orderby_lev: 0, //排序等级
                probably: 0, //概率%
                number: 1, //奖品数量 0位无限
                result_angle: 0,
                orderby_name: ""
            };
            this.isNew = true;
        },
        inputEdit() {
            if (this.isNew) {
                axios
                    .request({
                        url: "lottery/prizes",
                        method: "post",
                        data: {
                            activity_id: this.currentId,
                            coupon_id: this.couponsData.coupon_id,
                            orderby_lev: this.couponsData.orderby_lev,
                            probably: this.couponsData.probably,
                            number: this.couponsData.number,
                            result_angle: this.couponsData.result_angle,
                            orderby_name: this.couponsData.orderby_name
                        }
                    })
                    .then(res => {
                        this.getActivePrize();
                        this.cancelPeople(true);
                    });
            } else {
                axios
                    .request({
                        url: "lottery/prizes/" + this.currentCouponId,
                        method: "put",
                        data: {
                            activity_id: this.currentId,
                            coupon_id: this.couponsData.coupon_id,
                            orderby_lev: this.couponsData.orderby_lev,
                            probably: this.couponsData.probably,
                            number: this.couponsData.number,
                            result_angle: this.couponsData.result_angle,
                            orderby_name: this.couponsData.orderby_name
                        }
                    })
                    .then(res => {
                        this.getActivePrize();
                        this.cancelPeople(true);
                    });
            }
        },
        newData() {
            this.isNew = true;
            this.activeData = {
                status: 0,
                name: "",
                introduce: "",
                img: "",
                turn_img: "",
                pointer_img: ""
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
                            turn_img: this.activeData.turn_img,
                            pointer_img: this.activeData.pointer_img,
                            name: this.activeData.name,
                            introduce: this.activeData.introduce,
                            status: this.activeData.status
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
                            turn_img: this.activeData.turn_img,
                            pointer_img: this.activeData.pointer_img,
                            name: this.activeData.name,
                            introduce: this.activeData.introduce,
                            status: this.activeData.status
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
                    this.activeList = [];
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
                    this.allProbably = 0;
                    this.spinShow = false;
                    this.cancelPeople(true);
                    this.prizeList = res.data;
                    for (let i = 0; i < this.prizeList.length; i++) {
                        this.allProbably += this.prizeList[i].probably;
                    }
                    this.getCoupon();
                });
        },
        //获取卡券列表
        getCoupon() {
            axios
                .request({
                    url: "coupon/coupons",
                    method: "get"
                })
                .then(res => {
                    this.couponsList = [];
                    this.couponsList.push({
                        id: 0,
                        name: "没中奖"
                    });
                    for (let i = 0; i < res.data.data.length; i++) {
                        this.couponsList.push(res.data.data[i]);
                    }
                });
        },
        //上传事件
        successUpload1(file) {
            this.activeData.img = file.url;
        },
        successUpload2(file) {
            this.activeData.turn_img = file.url;
        },
        successUpload3(file) {
            this.activeData.pointer_img = file.url;
        },
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

