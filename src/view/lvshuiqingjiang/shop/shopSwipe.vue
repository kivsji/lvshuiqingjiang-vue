<template>
    <div>
        <row style="min-width:1300px;">
            <i-col style="width:640px;height:480px; float:left;margin-bottom:20px;margin-right:20px;">
                <Carousel v-model="value" loop>
                    <CarouselItem v-for="item in defaultList">
                        <img :src="item.image" width="640px" height="380px" style="">
                    </CarouselItem>
                </Carousel>
            </i-col>
            <i-col style="width:600px; float:left;">
                <i-button @click="openNewGround(true)" style='margin-bottom:10px;'>新增</i-button>
                <i-table style="width:500px;" :columns="receivedColumn" :data="receivedData"></i-table>
            </i-col>
        </row>
        <Modal v-model="newGroundReview" :title="reviewTitle" @on-ok="newLunboGround" @on-cancel="openNewGround(false)">
            <row>
                <i-col>
                    swiperGround名字
                </i-col>
                <i-col>
                    <Input v-model="newGroudName" style="width: 300px" />
                </i-col>
            </row>
        </Modal>
        <Modal v-model="groundPic" title="编辑轮播组图片" @on-ok="" @on-cancel="openGroundPic(false)">
            <row>
                <i-col>
                    <Upload action="http://localhost:8000/qiniu/upload" :on-success='successUpload' :on-preview='previewUpload' :show-upload-list='false' :default-file-list="defaultList" :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col>
                    <div style="width:100%;height:600px;margin-top:10px;border:1px solid #ddd;overflow-y:scroll;overflow-x:hidden;">
                        <div v-for='(item,index) in currentList' :key="index" @click="previewUpload(index)" style="border:1px solid #eee;width:224px;height:224px;float:left;margin:10px 5px 0;overflow:hidden;position:relative;">
                            <span @click.stop="openDeletePic(true,index)" style="position:absolute;margin-top:0;margin:left;background:#aaa;color:#fff;display:block;width:20px;height:20px;line-height:20px;text-align:center;cursor: pointer">
                                ╳
                            </span>
                            <img :src="item.image" height="100%" style="display:block;margin:0 auto;">
                        </div>
                    </div>
                </i-col>
            </row>
            <div slot="footer">
            </div>
        </Modal>
        <Modal v-model="picData" title="图片信息" @on-ok="inputData()" @on-cancel="openPicData(false)">
            <row style="margin-top:10px;">
                <i-col>
                    跳转类型
                </i-col>
                <i-col>
                    <RadioGroup v-model="previewData.type" type="button">
                        <Radio :label="item.value" v-for="item in swipeType">{{item.ch}}</Radio>
                    </RadioGroup>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col>
                    跳转链接
                </i-col>
                <i-col>
                    <Input v-model="previewData.url" />
                </i-col>
            </row>
            <!-- <row style="margin-top:10px;">
                <i-col>
                    图片名称
                </i-col>
                <i-col>
                    <Input v-model="previewData.name" />
                </i-col>
            </row> -->
            <row style="margin-top:10px;">
                <i-col>
                    备注
                </i-col>
                <i-col>
                    <Input v-model="previewData.remake" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col>
                    是否显示
                </i-col>
                <i-col>
                    <i-switch v-model="previewData.display" :true-value='1' :false-value='0' @on-change="" />
                </i-col>
            </row>
        </Modal>
        <Modal v-model="deleteModal" title="删除" @on-ok="deletePic()" @on-cancel="openDeletePic(false)">
            <row>
                <i-col style="margin:0 auto;">
                    是否删除该图片
                    <!-- ---  <span style="color:red;">{{removeName}}</span> ---- -->
                </i-col>
            </row>
        </Modal>
        <Modal v-model="groupModal" title="删除" @on-ok="deleteGroup()" @on-cancel="openDelete(false)">
            <row>
                <i-col style="margin:0 auto;">
                    是否删除轮播组
                    --- <span style="color:red;">{{currentName}}</span> ----
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
            groupModal: false,
            value: 0,
            receivedColumn: [
                {
                    title: "轮播组启用",
                    // key:'display'
                    render: (h, params) => {
                        var self = this;
                        return h(
                            "i-switch",
                            {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: params.row.display
                                },
                                nativeOn: {
                                    click: () => {
                                        this.changeDisplay(params.row.id,params.row.display);
                                    }
                                }
                            },
                            0
                        );
                    }
                },
                {
                    title: "轮播组名",
                    key: "name"
                },
                {
                    title: "编辑",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "i-button",
                                {
                                    props: {
                                        type: "primary",
                                        size: "small"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.getGroupPic(params.row.id);
                                            this.groupId = params.row.id;
                                            this.openGroundPic(true);
                                        }
                                    }
                                },
                                "修改"
                            ),
                            h(
                                "i-button",
                                {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    nativeOn: {
                                        click: () => {
                                            this.currentId = params.row.id;
                                            this.currentName = params.row.name;
                                            this.openDelete(true);
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            displayDataId: "",
            receivedData: [],
            reviewTitle: "新增组",
            lunboList: [],
            groundIsNew: true,
            newGroundReview: false,
            newGroudName: "",
            groupId: "",
            groundPic: false,
            defaultList: [{}],
            currentList: [],
            previewData: "",
            picData: false,
            deleteModal: false,
            deleteId: "",
            currentId: "",
            currentName: "",
            swipeType:[]
        };
    },
    computed: {
        headers() {
            return {
                token: Cookies.get("token")
            };
        }
    },
    methods: {
        //getSwipeType
        getSwipeType(){
            axios
                .request({
                    url: "mall-parameter/",
                    method: "get"
                })
                .then(res => {
                    this.swipeType = res.swiper
                });
        },
        openDelete(i) {
            this.groupModal = i;
        },
        deleteGroup() {
            axios
                .request({
                    url: "mall-groups/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success("删除成功");
                    this.getLunboGround();
                });
        },
        getLunboGround() {
            axios
                .request({
                    url: "mall-groups",
                    method: "get"
                })
                .then(res => {
                    this.receivedData = res.data;
                    for (let i = 0; i < this.receivedData.length; i++) {
                        if (this.receivedData[i].display === 1) {
                            axios
                                .request({
                                    url: "mall-groups/" + this.receivedData[i].id,
                                    method: "get"
                                })
                                .then(res => {
                                    this.defaultList = res.data[0].swipers;
                                    if (this.defaultList === null) {
                                        this.defaultList = [{},{}];
                                    }
                                });
                        }
                    }
                });
        },
        openNewGround(i) {
            this.newGroundReview = i;
        },
        openGroundPic(i) {
            this.groundPic = i;
        },
        openPicData(i) {
            this.openGroundPic(!i);
            this.picData = i;
        },
        openDeletePic(i, index) {
            this.deleteModal = i;
            if (i) {
                this.deleteId = this.currentList[index].id;
            }
        },
        //getGroupPic
        getGroupPic(id) {
            axios
                .request({
                    url: "mall-groups/" + id,
                    method: "get"
                })
                .then(res => {
                    console.log(res.data[0]);
                    
                    this.currentList = res.data[0].swipers;
                    if (this.currentList === null) {
                        this.currentList = [{},{}];
                    }
                });
        },
        //newLunboGround
        newLunboGround() {
            if (this.newGroudName === "") {
                this.$Message.error("轮播组名不能为空");
                return;
            }
            axios
                .request({
                    url: "mall-groups",
                    method: "post",
                    data: {
                        display: 0,
                        name: this.newGroudName
                    }
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getLunboGround();
                });
        },
        ///changeDisplay
        changeDisplay(id,is) {
            axios
                .request({
                    url: "mall-groups/" + id + "/change",
                    method: "put",
                    data:{
                        is_up:is
                    }
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getLunboGround();
                });
        },
        //successUpload
        successUpload(file) {
            this.inputGroup(file);
        },
        //提交groupPic
        // data
        // msg: "上传成功"
        // status: "success"
        // url: "http://p8r2g6z46.bkt.clouddn.com/20181013/7c18da85a30ae258c19b1a0a1d5e3c98.jpg"
        inputGroup(data) {
            axios
                .request({
                    url: "mall-swipers",
                    method: "post",
                    data: {
                        type:'other',
                        url: "www.123.com",
                        display: 1,
                        url_id:'',
                        group: this.groupId,
                        image: data.url,
                        remake: "未备注"
                    }
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getGroupPic(this.groupId);
                });
        },
        //clickPic
        previewUpload(index) {
            console.log(this.currentList[index]);
            
            this.previewData = this.currentList[index];
            this.openPicData(true);
        },
        inputData() {
            axios
                .request({
                    url: "mall-swipers/" + this.previewData.id,
                    method: "put",
                    data: this.previewData
                })
                .then(res => {
                    this.$Message.success("success");
                    this.openGroundPic(true);
                    this.getGroupPic(this.groupId);
                });
        },
        // deletePic
        deletePic(index) {
            axios
                .request({
                    url: "mall-swipers/" + this.deleteId,
                    method: "delete"
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getGroupPic(this.groupId);
                });
        }
    },
    mounted() {
        this.getLunboGround();
        this.getSwipeType()
    }
};
</script>

<style scoped>
</style>