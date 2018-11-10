<template>
    <div>
        <row>
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
                    <Upload action="https://www.rdoorweb.com/pzhan/public/qiniu/upload" :on-success='successUpload' :on-preview='previewUpload' :show-upload-list='false' :default-file-list="defaultList" :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col>
                    <div style="width:100%;height:600px;margin-top:10px;border:1px solid #ddd;overflow-y:scroll;overflow-x:hidden;">
                        <div v-for='(item,index) in defaultList' :key="index" @click="previewUpload(index)" style="border:1px solid #eee;width:224px;height:224px;float:left;margin:10px 5px 0;overflow:hidden;position:relative;">
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
            <row>
                <i-col>
                    跳转链接
                </i-col>
                <i-col>
                    <Input v-model="previewData.url"/>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col>
                    图片名称
                </i-col>
                <i-col>
                    <Input v-model="previewData.name"/>
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col>
                    备注
                </i-col>
                <i-col>
                    <Input v-model="previewData.remake"/>
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
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
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
                                        this.changeDisplay(params.row.id);
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
                                            this.removeId = params.row.id;
                                            this.removeName = params.row.name;
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
            displayDataId:'',

            receivedData: [],
            reviewTitle: "新增组",
            lunboList: [],

            groundIsNew: true,
            newGroundReview: false,
            newGroudName: "",

            groupId: "",
            groundPic: false,
            defaultList: [{
                
            },{

            }],
            previewData:'',
            picData:false,

            deleteModal:false,
            deleteId:''
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
        getLunboGround() {
            axios
                .request({
                    url: "swiper_groups",
                    method: "get"
                })
                .then(res => {
                    this.receivedData = res.data;
                    for(let i=0;i<this.receivedData.length;i++){
                        console.log(this.receivedData[i].display);
                        if(this.receivedData[i].display === 1){
                            this.getGroupPic(this.receivedData[i].id)
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
        openPicData(i){
            this.openGroundPic(!i)
            this.picData = i;
        },
        openDeletePic(i,index){
            this.deleteModal = i
            if(i){
                this.deleteId = this.defaultList[index].id
            }
        },



        //getGroupPic
        getGroupPic(id) {
            axios
                .request({
                    url: "swiper_groups/" + id,
                    method: "get"
                })
                .then(res => {
                    this.defaultList = res.data.swipers
                    

                    // for(let i=0;i<res.data.swipers.length;i++){
                    //     this.defaultList.push({
                    //         name:i,
                    //         url:res.data.swipers.image
                    //     })
                    // }
                    console.log(this.defaultList);
                    
                    if (this.defaultList === null) {
                        this.defaultList = [];
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
                    url: "swiper_groups",
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
        changeDisplay(id) {
            axios
                .request({
                    url: "swiper_groups/" + id + "/change",
                    method: "get"
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
                    url: "swipers",
                    method: "post",
                    data: {
                        display: 1,
                        group: this.groupId,
                        name: "未命名",
                        image: data.url,
                        remake: "未备注",
                        url: "www.rdoorweb.com"
                    }
                })
                .then(res => {
                    this.$Message.success("success");
                    this.getGroupPic(this.groupId);
                });
        },

        //clickPic
        previewUpload(index){
            this.previewData = this.defaultList[index]
            this.openPicData(true)
            console.log(index);
            
        },
        inputData(){
            axios
                .request({
                    url: "swipers/"+this.previewData.id,
                    method: "put",
                    data: this.previewData
                })
                .then(res => {
                    this.$Message.success("success");
                    this.openGroundPic(true)
                    this.getGroupPic(this.groupId);
                });
        },


        // deletePic
        deletePic(index){
                axios
                .request({
                    url: "swipers/"+this.deleteId,
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
    }
};
</script>

<style scoped>
</style>