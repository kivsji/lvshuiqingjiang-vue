<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建分类</Button>
            </i-col>
            <i-col style="margin-bottom:10px;">
                <i-table size="large" style="min-width:1200px;" :columns="typeColunm" :data="typeList"></i-table>
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
                <i-col span='20'>
                    <Input v-model="typeData.img_url" />
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
            spinShow: false,
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
                    key: "img_url"
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
    }
};
</script>

<style scoped>
</style>