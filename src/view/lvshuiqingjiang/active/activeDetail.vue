<template>
    <div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        <row>
            <i-col style="margin-bottom:10px;">
                <Button type='primary' @click='newData()'>新建定制</Button>
            </i-col>
            <i-col style="margin-bottom:20px;">
                <Page :total="total" :page-size="pre_page" :on-change='changePage' />
            </i-col>
            <i-col>
                <i-table size="large" style="min-width:1200px;" :columns="activeColunm" :data="activeList"></i-table>
            </i-col>
        </row>
        <Modal v-model="dataModal" width='820px' :mask-closable="false" :title='dataTitle' @on-ok="okInput" @on-cancel="cancelInput(false)">
            <row>
                <i-col span='4' style="line-height:30px;">
                    活动封面
                </i-col>
                <i-col span='4'>
                    <Upload style="margin-bottom:10px;" action="https://www.rdoorweb.com/lvshui/public/qiniu/upload" :on-success='successUpload' :before-upload='beforeUpload' :show-upload-list='false' :headers="headers">
                        <Button icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                </i-col>
                <i-col span='24' style="display:block;margin:0 auto;">
                    <img :src="activeData.thumb" width="40%" style="margin:0 auto;display:block;">
                </i-col>
            </row>
            <row style="margin-top:20px;">
                <i-col span='4' style="line-height:30px;">
                    活动名称
                </i-col>
                <i-col span='20'>
                    <Input v-model="activeData.name" />
                </i-col>
            </row>
            <row style="margin-top:10px;">
                <i-col span='4' style="line-height:30px;">
                    活动内容
                </i-col>
                <i-col span='20'>
                    <div ref="editor" style="text-align:left;width:660px;margin:0 auto;" v-model="activeData.comment"></div>
                </i-col>
            </row>
        </Modal>
        <Modal v-model="peopleModal" title='报名名单' @on-ok="cancelPeople(false)" @on-cancel="cancelPeople(false)">
            <i-table size="large" :columns="peopleColunm" :data="peopleList"></i-table>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import Cookies from "js-cookie";
import E from "wangeditor";
export default {
    data() {
        return {
            editor:'',
            editorContent:'',
            spinShow:false,
            total: 1,
            pre_page: 1,
            currentPage:1,
            dataModal: false,
            isNew: false,
            peopleModal:false,
            currentId: "",
            dataTitle: "新增活动",
            activeType: "免费",
            activeData: {
                thumb:
                    "",
                name: "",
                comment: ""
            },
            activeColunm: [
                {
                    title: "活动名称",
                    key: "name"
                },{
                    title: "活动封面",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "img",
                                {
                                    attrs: {
                                        style:'width:60px;height:60px;',
                                        src:params.row.thumb
                                    }
                                },
                                ''
                            )
                        ]);
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
                                            this.isNew = false
                                            this.currentId = params.row.id
                                            this.activeData.thumb = params.row.thumb
                                            this.activeData.name = params.row.name
                                            this.activeData.comment = params.row.comment
                                            this.editorContent = this.activeData.comment
                                            this.editor.txt.html(this.editorContent);
                                            this.cancelInput(true)
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
                                            this.currentId = params.row.id
                                            this.getActivePeople()
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
                { }
            ],
            peopleColunm:[
                {
                    title:'报名人',
                    key:'nickname'
                },{
                    title:'联系人',
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {
                                    attrs: {
                                        
                                    }
                                },
                                params.row.pivot.name
                            )
                        ]);
                    }
                },{
                    title:'联系电话',
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {
                                    attrs: {
                                        
                                    }
                                },
                                params.row.pivot.contact_way
                            )
                        ]);
                    }
                },{
                    title:'备注',
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "p",
                                {
                                    attrs: {
                                        
                                    }
                                },
                                params.row.pivot.remark
                            )
                        ]);
                    }
                }
            ],
            peopleList:[]
        };
    },
    methods: {
        changePage(index){
            this.currentPage = index
            this.getActive()
        },
        newData() {
            this.isNew = true;
            this.editorContent = ''
            this.editor.txt.html(this.editorContent);
            this.activeData = {
                thumb: "",
                name: "",
                comment: ""
            };
            this.cancelInput(true);
        },
        cancelPeople(i){
            this.peopleModal = i
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
                this.spinShow = true
                //新增
                axios
                    .request({
                        url: "activity/diys",
                        method: "post",
                        data: {
                            thumb: this.activeData.thumb,
                            name: this.activeData.name,
                            comment: this.editorContent
                        }
                    })
                    .then(res => {
                        this.getActive();
                        this.$Message.success("新增成功");
                    });
            } else {
                this.spinShow = true
                //修改
                axios
                    .request({
                        url: "activity/diys/" + this.currentId,
                        method: "put",
                        data: {
                            thumb: this.activeData.thumb,
                            name: this.activeData.name,
                            comment: this.editorContent
                        }
                    })
                    .then(res => {
                        this.getActive();
                        this.$Message.success("修改成功");
                    });
            }
        },
        getActive() {
            this.spinShow = true
            //获取活动数据
            axios
                .request({
                    url: "activity/diys?page="+this.currentPage,
                    method: "get"
                })
                .then(res => {
                    this.activeList = res.data.data;
                    this.spinShow = false
                });
        },
        //查看报名人员
        getActivePeople(){
            this.spinShow = true
            axios.request({
                url:'activity/diys/'+this.currentId,
                method:'get'
            }).then(res=>{
                this.spinShow = false
                this.cancelPeople(true)
                this.peopleList = res.data.fans
            })
        },
        //上传事件
        successUpload(file) {
            this.activeData.thumb = file.url
        },
        beforeUpload(file) {}
    },
    mounted() {
        this.editor = new E(this.$refs.editor);
        this.editor.customConfig.onchange = html => {
            this.editorContent = html;
        };
        this.editor.customConfig.uploadImgShowBase64 = true;
        this.editor.create();
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

