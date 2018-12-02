<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建分类</Button>
            </i-col>
            <i-col style="margin-bottom:10px;">
                <i-table size="large" style="min-width:800px;" :columns="typeColunm" :data="typeList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" :title='dataTitle' @on-ok="inputType()" @on-cancel="typeShow(false)">
            <row style="margin-bottom:10px;">
                <i-col span='4' style="line-height:30px;">
                    分类名
                </i-col>
                <i-col span='20'>
                    <Input v-model="typeData.name" />
                </i-col>
            </row>
            <row style="margin-bottom:10px;">
                <i-col span='4' style="line-height:30px;">
                    上级分类
                </i-col>
                <i-col span='20'>
                    <Select v-model="typeData.sid" style="width:200px">
                        <Option v-for="item in selectTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </i-col>
            </row>
            <row style="margin-bottom:10px;">
                <i-col span='4' style="line-height:30px;">
                    分类封面
                </i-col>
                <i-col>
                    <Spin fix v-if="spinShow1">
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>上传中~~~</div>
                    </Spin>
                    <Upload style="margin-bottom:10px;" action="https://www.rdoorweb.com/qiniu/upload" :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <img :src="typeData.img_url" width="200px">
                </i-col>
            </row>
            <Modal v-model="deleteModal" title='删除' @on-ok="deleteType()" @on-cancel="deleteShow(false)">
                是否删除分类 <span style='color:red'>{{deleteTypeName}}</span>
            </Modal>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
export default {
    data() {
        return {
            isUpload:false,
            spinShow: false,
            spinShow1:false,
            isNew: false,
            currentId: "",
            dataModal: false,
            deleteModal: false,
            deleteTypeName: "",
            dataTitle: "新增",
            selectTypeList: [],
            typeColunm: [
                {
                    title: "分类ID",
                    key: "id"
                },
                {
                    title: "分类名",
                    key: "name"
                },
                {
                    title: "分类封面",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "img",
                                {
                                    attrs: {
                                        style:'width:50px;height:50px;display:block;',
                                        src:  params.row.img_url
                                    }
                                },
                                ''
                            )
                        ]);
                    }
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
                                        click: () => {
                                            this.dataTitle = "修改";
                                            this.isNew = false;
                                            this.currentId = params.row.id;
                                            this.typeShow(true);
                                            this.typeData = {
                                                name: params.row.name,
                                                img_url: params.row.img_url,
                                                sid: params.row.sid
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
                                            //拦截错误删除
                                            let currentSid = params.row.id;
                                            for (
                                                let i = 0;
                                                i < this.typeList.length;
                                                i++
                                            ) {
                                                if (
                                                    this.typeList[i].sid ===
                                                    currentSid
                                                ) {
                                                    console.log(
                                                        this.typeList[i].sid
                                                    );
                                                    console.log(currentSid);

                                                    this.$Message.error(
                                                        "分类底下有子分类需手动删除"
                                                    );
                                                    return;
                                                }
                                            }
                                            if (
                                                params.row.sid !== 0 &&
                                                params.row.goods_count > 0
                                            ) {
                                                this.$Message.error(
                                                    "分类底下有产品需手动删除"
                                                );
                                                return;
                                            }

                                            this.deleteTypeName =
                                                params.row.name;
                                            this.currentId = params.row.id;
                                            this.deleteShow(true);
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                }
            ],
            typeList: [],
            typeData: {
                name: "",
                img_url: "",
                sid: ""
            }
        };
    },
    methods: {
        successUpload(file){
            this.spinShow1 = false;
            if (this.typeData.img_url !== "") {
                axios.request({
                    url: "qiniu/delete",
                    method: "post",
                    data: {
                        url: this.typeData.img_url
                    }
                });
            }
            this.isUpload = true
            this.typeData.img_url = file.url
        },
        beforeUpload(){
            
        },
        newData() {
            this.typeShow(true);
            this.isNew = true;
            this.dataTitle = "新增";
            this.typeData = {
                name: "",
                img_url: "",
                sid: ""
            };
        },
        deleteShow(i) {
            this.deleteModal = i;
        },
        typeShow(i) {
            if(this.isUpload){
                axios.request({
                    url: "qiniu/delete",
                    method: "post",
                    data: {
                        url: this.typeData.img_url
                    }
                }).then(res=>{
                    this.isUpload = false
                });
            }
            this.dataModal = i;
        },
        getType() {
            this.spinShow = true;
            axios
                .request({
                    url: "mall-navs",
                    method: "get"
                })
                .then(res => {
                    this.typeList = res.data;
                    this.selectTypeList = [];
                    this.selectTypeList.push({
                        name: "无",
                        id: 0,
                        sid: 0
                    });
                    for (let i = 0; i < this.typeList.length; i++) {
                        if (this.typeList[i].sid === 0) {
                            this.selectTypeList.push({
                                name: this.typeList[i].name,
                                id: this.typeList[i].id,
                                sid: this.typeList[i].sid
                            });
                        }
                    }
                    this.spinShow = false;
                });
        },
        inputType() {
            if(this.typeData.name === '' || this.typeData.sid === ''){
                this.$Message.error('分类资料不完整')
                return
            }
            this.spinShow = true;
            if (this.isNew) {
                //新建
                axios
                    .request({
                        url: "mall-navs",
                        method: "post",
                        data: {
                            name: this.typeData.name,
                            img_url: this.typeData.img_url,
                            sid: this.typeData.sid
                        }
                    })
                    .then(res => {
                        this.typeList = res.data;
                        this.getType();
                    });
            } else {
                //修改
                axios
                    .request({
                        url: "mall-navs/" + this.currentId,
                        method: "put",
                        data: {
                            name: this.typeData.name,
                            img_url: this.typeData.img_url,
                            sid: this.typeData.sid
                        }
                    })
                    .then(res => {
                        this.typeList = res.data;
                        this.getType();
                    });
            }
        },
        deleteType() {
            this.spinShow = true;
            //删除分类
            axios
                .request({
                    url: "mall-navs/" + this.currentId,
                    method: "delete"
                })
                .then(res => {
                    this.getType();
                });
        }
    },
    mounted() {
        this.getType();
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