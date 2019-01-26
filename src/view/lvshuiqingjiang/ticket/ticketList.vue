<template>
    <div>
        <i-col style="margin-bottom:10px;">
            <Button type='primary' @click='newData()'>新建门票</Button>
        </i-col>
        <i-col style="margin-bottom:20px;">
            <Page :total="total" :page-size="pre_page" @change="changePage()"/>
        </i-col>
        <i-col>
            <i-table size="large" style="min-width:800px;" :columns="ticketColunm" :data="ticketList"></i-table>
        </i-col>
        <Modal v-model="dataModal" :title='dataTitle' :mask-closable="false" width='600px'>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="goodData.name" />
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    封面
                </i-col>
                <i-col span='4'>
                    <Upload style="margin-bottom:10px;" action="https://zhlsqj.com/qiniu/upload" :on-success='successUpload'
                        :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col span='24' style="display:block;margin:0 auto;">
                    <img :src="goodData.cover" width="100px">
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    备注
                </i-col>
                <i-col span='20'>
                    <Input v-model="goodData.remark" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    每日名额
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.total" :min="1"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    每人每日限额
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.limit" :min="1"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    价格
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.price" :min="0.00" :precision='2'></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    限制天数（当天能买多久后的票）
                </i-col>
                <i-col span='20'>
                    <InputNumber v-model="goodData.from_now" :min="1"></InputNumber>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    内容
                </i-col>
                <i-col span='20'>
                    <yimo-vue-editor v-model="goodData.content"></yimo-vue-editor>
                </i-col>
            </row>
            <div slot="footer">
                <Button type="text" size="large" @click="openGoodModal(false)">取消</Button>
                <Button type="primary" size="large" @click="inputData()">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
import YimoVueEditor from "yimo-vue-editor";
export default {
    components: {
        YimoVueEditor
    },
    data() {
        return {

            isRun: true,
            currentPage:1,
            total: 1,
            pre_page: 1,
            dataModal: false,
            isNew: false,
            dataTitle: "新建门票",
            currentId: "",
            goodData: {
                content: "",
                price: 0,
                limit: 1,
                total: 0,
                name: "",
                remark: "",
                cover: "",
                from_now: 1,
                is_up: 0
            },
            ticketList: [
                {
                    content: "123",
                    cover:
                        "http://download.rdoorweb.com/20181210/c1a21573763af2cac196c12b3b6c56b1.png",
                    created_at: "2019-01-26 00:00:00",
                    from_now: 7,
                    id: 1,
                    is_up: 1,
                    limit: 20,
                    name: "门票",
                    price: 45,
                    remark: "",
                    total: 100
                }
            ],
            ticketColunm: [
                {
                    title: "名称",
                    key: "name"
                },
                {
                    title: "备注",
                    key: "remark"
                },
                {
                    title: "价格",
                    key: "price"
                },
                {
                    title: "每日数量",
                    key: "total"
                },
                {
                    title: "每日每人限额",
                    key: "limit"
                },
                {
                    title: "上架",
                    render: (h, params) => {
                        return h(
                            "i-switch",
                            {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: params.row.is_up
                                },
                                nativeOn: {
                                    click: () => {}
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
                                            this.isNew = false;
                                            this.goodData.name =
                                                params.row.name;
                                            this.goodData.remark =
                                                params.row.remark;
                                            this.goodData.total =
                                                params.row.total;
                                            this.goodData.limit =
                                                params.row.limit;
                                            this.goodData.price =
                                                params.row.price;
                                            this.goodData.from_now =
                                                params.row.from_now;
                                            this.goodData.content =
                                                params.row.content;

                                            this.openGoodModal(true);
                                        }
                                    }
                                },
                                "编辑"
                            )
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
        changePage(index){
            axios
                .request({
                    url: "ticket/ticket?page="+index,
                    method: "get"
                })
                .then(res => {
                    this.ticketList = res.data.data;
                    this.total = res.data.total
                    this.pre_page = res.data.per_page
                });
        },
        successUpload(file) {
            this.goodData.cover = file.url;
        },
        beforeUpload() {},
        getTicket() {
            axios
                .request({
                    url: "ticket/ticket?page="+this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.ticketList = res.data.data;
                    this.total = res.data.total
                    this.pre_page = res.data.per_page
                });
        },
        newData() {
            this.isNew = true;
            this.goodData.name = "";
            this.goodData.remark = "";
            this.goodData.total = 0;
            this.goodData.limit = 1;
            this.goodData.price = 0;
            this.goodData.from_now = 1;
            this.goodData.content = "";
            this.goodData.cover = "";
            this.openGoodModal(true);
        },
        openGoodModal(i) {
            this.dataModal = i;
        },
        //验证
        remakeData() {
            let dataTokey = [
                {
                    key: "name",
                    title: "名称"
                },{
                    key: "remark",
                    title: "备注"
                },{
                    key: "total",
                    title: "每日限额"
                },{
                    key: "limit",
                    title: "每人每日限额"
                },{
                    key: "price",
                    title: "价格"
                },{
                    key: "from_now",
                    title: "限制天数"
                },{
                    key: "content",
                    title: "封面"
                },{
                    key: "cover",
                    title: "封面"
                },
            ];
            for (let i in this.goodData) {
                console.log(this.goodData[i]);
                // if (this.goodData[i] === "") {
                //     this.isRun = false;
                //     for(let t = 0;t<dataTokey.length;t++){
                //         if(i === dataTokey[t].key){
                //             this.$Message.error(dataTokey[t].title + "不能为空");
                //             console.log(this.goodData);
                //         }
                //     }
                //     return;
                // }
            }
            this.isRun = true;
        },
        inputData() {
            this.remakeData();
            if (!this.isRun) {
                return;
            }
            if (this.isNew) {
                //新建
                axios
                    .request({
                        url: "ticket/ticket",
                        method: "post",
                        data: {
                            name: this.goodData.name,
                            remark: this.goodData.remark,
                            cover: this.goodData.cover,
                            total: this.goodData.total,
                            limit: this.goodData.limit,
                            price: this.goodData.price,
                            content: this.goodData.content,
                            from_now: this.goodData.from_now,
                            is_up: 0
                        }
                    })
                    .then(res => {
                        this.getTicket();
                    });
            } else {
                //修改
                axios
                    .request({
                        url: "ticket/ticket/"+this.currentId,
                        method: "put",
                        data: {
                            name: this.goodData.name,
                            remark: this.goodData.remark,
                            cover: this.goodData.cover,
                            total: this.goodData.total,
                            limit: this.goodData.limit,
                            price: this.goodData.price,
                            content: this.goodData.content,
                            from_now: this.goodData.from_now,
                            is_up: this.goodData.is_up
                        }
                    })
                    .then(res => {
                        this.getTicket();
                    });
            }
            this.openGoodModal(false)
        }
    },
    mounted() {
        this.getTicket();
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
