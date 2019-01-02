<template>
    <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <row style="width:1000px;">
            <i-col style="width:300px;height:500px;float:left;">
                <div class="phone">
                    <div class="phonePage">
                        <div :class="'phoneMenu '+(selectIndex===1?'selectItem':'')" @click="seletcOne(1)">
                            <div class="phoneMenuitem" v-if="menuList.length>0">
                                <p>{{menuList[0].name}}</p>
                            </div>
                            <div class="hasNull" v-else @click="addOne">
                                <Icon type="ios-add" size='35' style="margin-top:7.5px;" />
                            </div>
                        </div>
                        <div :class="'phoneMenu '+(selectIndex===2?'selectItem':'')" @click="seletcOne(2)">
                            <div class="phoneMenuitem" v-if="menuList.length>1">
                                <p>{{menuList[1].name}}</p>
                            </div>
                            <div class="hasNull" v-else @click="addOne">
                                <Icon type="ios-add" size='35' style="margin-top:7.5px;" />
                            </div>
                        </div>
                        <div :class="'phoneMenu '+(selectIndex===3?'selectItem':'')" @click="seletcOne(3)">
                            <div class="phoneMenuitem" v-if="menuList.length>2">
                                <p>{{menuList[2].name}}</p>
                            </div>
                            <div class="hasNull" v-else @click="addOne">
                                <Icon type="ios-add" size='35' style="margin-top:7.5px;" />
                            </div>
                        </div>
                        <div :class="'twoMenu active' + currentIndex">
                            <div :class="'twoMenuItem '+(currentTwoIndex===index?'active':'')" v-for="(item,index) in currentTwo"
                                :key='index' @click="selectTwo(index)">
                                <p>{{currentTwo[index].name}}</p>
                            </div>
                            <div :class="'twoMenuItem '+(currentTwoIndex === currentTwo.length+1?'active':'')" v-if='currentTwo.length<5'
                                @click="selectTwo(currentTwo.length)">
                                <Icon type="ios-add" size='35' style="margin-top:7.5px;" />
                            </div>
                            <Icon type="ios-arrow-down" class="xiaj" />
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col class="dataPage" v-if="(selectIndex > 0 && currentTwo.length === 0)||selectIndex === 0" style="width:500px;float:left;margin-left:100px;">
                <Icon class="deleteItem" type="md-close" size='25' @click="openCancleTip(true)" v-if="selectIndex !== 0 || currentTwoIndex !== 5" />
                <row>
                    <i-col style="width:100px;float:left;line-height:33px;font-size:16px">
                        菜单名称
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Input v-model="menuData.name" :maxlength='8' style="width: 200px" placeholder="不超过8个字或16个字符" />
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col style="width:100px;float:left;font-size:16px;">
                        菜单内容
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <RadioGroup v-model="menuData.type">
                            <Radio label="view">链接</Radio>
                            <Radio label="view_limited">素材</Radio>
                        </RadioGroup>
                    </i-col>
                </row>
                <row style="margin-top:20px;" v-if="menuData.type == 'view'">
                    <i-col style="width:100px;float:left;font-size:16px;line-height:33px;">
                        链接地址
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Input v-model="menuData.url" style="width: 200px" placeholder="格式：http://www.zhlsqj.com" />
                    </i-col>
                </row>
                <row style="margin-top:20px;" v-else>
                    <i-col style="width:100px;float:left;font-size:16px;line-height:33px;">
                        选择素材
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Select v-model="menuData.media_id" style="width:200px">
                            <Option v-for="item in keyList" :value="item.media_id" :key="item.media_id">{{
                                item.content.news_item[0].title }}</Option>
                        </Select>
                    </i-col>
                </row>
            </i-col>
            <i-col class="dataPage" v-else style="width:500px;float:left;margin-left:100px;">
                <Icon class="deleteItem" type="md-close" size='25' @click="openCancleTip(true)" v-if="selectIndex !== 0 || currentTwoIndex !== 5" />
                <row>
                    <i-col style="width:100px;float:left;line-height:33px;font-size:16px">
                        菜单名称
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Input v-model="menuData.name" :maxlength='8' style="width: 200px" placeholder="不超过8个字或16个字符" />
                    </i-col>
                </row>
            </i-col>
            <i-col style="width:500px;float:left;margin-left:100px;margin-top:20px;">
                <Button type='success' @click='inputData' style="background:#44b549;" :disabled='selectIndex === 0 && currentTwoIndex === 6'>保存并发布</Button>
            </i-col>
        </row>
        <Modal v-model="deleteModal" title='确认删除菜单' @on-ok="deleteInput()" @on-cancel="openCancleTip(false)">
            <p style="text-align:center;font-size:16px;">是否确认删除‘<span style="color:red;">{{menuData.name}}</span>’菜单的所有内容?</p>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
// 一级菜单 最多3个  二级菜单 最多5个
export default {
    data() {
        return {
            spinShow: true,
            deleteModal: false,
            menuList: [],
            currentData: {},
            menuData: {
                name: "",
                type: "view",
                url: "",
                media_id: "",
                
            },
            currentTwo: [],
            currentIndex: "",
            currentTwoIndex: 6,
            selectIndex: 0,
            selectOneIndex: 0,
            keyList: []
        };
    },
    methods: {
        openCancleTip(i) {
            this.deleteModal = i;
            console.log(123);
        },
        deleteInput() {
            //删除一级菜单
            if (this.selectIndex !== 0) {
                console.log(this.selectIndex);
                this.menuList.splice(this.selectIndex - 1, 1);
            } else {
                //删除2级菜单
                console.log(this.selectOneIndex);
                this.menuList[this.selectOneIndex].sub_button.splice(
                    this.currentTwoIndex,
                    1
                );
            }
            this.spinShow = true;
            axios
                .request({
                    url: "wechat/menu/create",
                    method: "post",
                    data: {
                        menu: this.menuList
                    }
                })
                .then(res => {
                    this.getList();
                });
        },
        getList() {
            axios
                .request({
                    url: "wechat/menu/list",
                    method: "get"
                })
                .then(res => {
                    this.selectIndex = 0;
                    this.currentTwoIndex = 6;
                    this.selectOneIndex = 0;
                    this.currentIndex = '';
                    this.menuList = res.data.menu.button;
                    this.spinShow = false;
                    this.getMaterialList();
                });
        },
        getMaterialList() {
            axios
                .request({
                    url: "wechat/material/list",
                    method: "get"
                })
                .then(res => {
                    this.keyList = res.data.item;
                });
        },
        addOne() {
            // console.log(1);
        },
        seletcOne(index) {
            this.selectIndex = index;
            if (index <= this.menuList.length) {
                this.menuData = this.menuList[index - 1];
                this.menuData = {
                    name: this.menuList[index - 1].name,
                    type: this.menuList[index - 1].type,
                    url: "",
                    media_id: ""
                };

                if (this.menuData.type === "view") {
                    this.menuData.url = this.menuList[index - 1].url;
                } else {
                    this.menuData.media_id = this.menuList[index - 1].media_id;
                }
                this.currentIndex = index;
                this.currentTwo = this.menuList[index - 1].sub_button;
            } else {
                this.menuData = {
                    name: "",
                    type: "view",
                    url: "",
                    media_id: ""
                };
                this.currentTwo = [];
                this.currentIndex = "";
            }
            this.currentTwoIndex = 6;
        },
        selectTwo(index) {
            if (index < this.currentTwo.length) {
                this.menuData = this.currentTwo[index];
                this.menuData = {
                    name: this.currentTwo[index].name,
                    type: this.currentTwo[index].type,
                    url: "",
                    key: ""
                };
                if (this.menuData.type === "view") {
                    this.menuData.url = this.currentTwo[index].url;
                } else {
                    this.menuData.key = this.currentTwo[index].key;
                }
                this.currentTwoIndex = index;
            } else {
                this.menuData = {
                    name: "",
                    type: "view",
                    url: "",
                    media_id: ""
                };
                this.currentTwoIndex = index + 1;
            }
            this.selectIndex = 0;
        },
        inputData() {
            this.spinShow = true;
            if (this.currentTwo.length === 0 || this.selectIndex === 0) {
                // if(!(/^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/i.test(this.menuData.url))){
                if (
                    !/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/i.test(
                        this.menuData.url
                    ) && this.menuData.type === "view"
                ) {
                    this.$Message.error("网址格式不正确");
                    return;
                }
                if (
                    this.menuData.name === "" ||
                    (this.menuData.type === "view" &&
                        this.menuData.url === "") ||
                    (this.menuData.type === "view_limited" && this.menuData.key === "")
                ) {
                    this.$Message.error("资料填写不完整");
                    return false;
                }
            }
            //保存一级
            if (this.selectIndex > 0 && this.currentTwoIndex === 6) {
                if (this.selectIndex > this.menuList.length) {
                    if (this.menuData.type === "view") {
                        this.menuList.push({
                            name: this.menuData.name,
                            type: this.menuData.type,
                            url: this.menuData.url,
                            sub_button: []
                        });
                    } else {
                        this.menuList.push({
                            name: this.menuData.name,
                            type: this.menuData.type,
                            media_id: this.menuData.media_id
                        });
                    }
                } else {
                    // this.menuList[this.selectIndex - 1] = {}
                    this.menuList[this.selectIndex - 1].name = this.menuData.name;
                    if(this.menuData.type === 'view' && this.menuList[this.selectIndex - 1].sub_button.length === 0){
                        this.menuList[this.selectIndex - 1].type = this.menuData.type;
                        this.menuList[this.selectIndex - 1].url = this.menuData.url;
                        this.menuList[this.selectIndex - 1].sub_button = this.menuData.sub_button;
                    }else if(this.menuData.type === 'view_limited' && this.menuList[this.selectIndex - 1].sub_button.length === 0){
                        this.menuList[this.selectIndex - 1].type = this.menuData.type;
                        this.menuList[this.selectIndex - 1].media_id = this.menuData.media_id;
                        delete this.menuList[this.selectIndex - 1].sub_button
                    }
                    
                }
            }
            //保存二级
            // console.log(this.currentTwoIndex);
            // console.log(this.currentTwo.length);
            // this.spinShow = false
            // return
            if (this.selectIndex === 0 && this.currentTwoIndex < 6) {
                if (
                    this.currentTwo.length < 5 &&
                    this.currentTwoIndex > this.currentTwo.length
                ) {
                    
                    this.menuList[this.currentIndex-1] = {
                        name: this.menuList[this.currentIndex-1].name,
                        sub_button: this.menuList[this.currentIndex-1]
                            .sub_button
                    };
                    if (this.menuData.type === "view") {
                        this.menuList[this.currentIndex-1].sub_button.push({
                            name: this.menuData.name,
                            type: this.menuData.type,
                            url: this.menuData.url
                        });
                    } else {
                        this.menuList[this.currentIndex-1].sub_button.push({
                            name: this.menuData.name,
                            type: this.menuData.type,
                            media_id: this.menuData.media_id
                        });
                    }
                } else {
                    if (this.menuData.type === "view") {
                        this.menuList[this.currentIndex-1].sub_button[
                            this.currentTwoIndex
                        ].name = this.menuData.name;
                        this.menuList[this.currentIndex-1].sub_button[
                            this.currentTwoIndex
                        ].type = this.menuData.type;
                        this.menuList[this.currentIndex-1].sub_button[
                            this.currentTwoIndex
                        ].url = this.menuData.url;
                    } else {
                        this.menuList[this.currentIndex-1].sub_button[
                            this.currentTwoIndex
                        ].name = this.menuData.name;
                        this.menuList[this.currentIndex-1].sub_button[
                            this.currentTwoIndex
                        ].type = this.menuData.type;
                        this.menuList[this.currentIndex-1].sub_button[
                            this.currentTwoIndex
                        ].media_id = this.menuData.media_id;
                    }
                }
            }
            this.selectIndex = 0;
            this.currentIndex = "";
            this.currentTwoIndex = 6;
            // return
            axios
                .request({
                    url: "wechat/menu/create",
                    method: "post",
                    data: {
                        menu: this.menuList
                    }
                })
                .then(res => {
                    console.log(res);
                    this.getList();
                });
        }
    },
    mounted() {
        this.getList();
    }
};
</script>

<style scoped>
.dataPage {
    background: #fff;
    padding: 30px;
    border: 1px solid #aaa;
}
.phone {
    width: 300px;
    height: 500px;
    background: url("../../../assets/images/menuBg.png") no-repeat center 0 #fff;
    background-size: 100% auto;
    border: 1px solid #aaa;
}
.hasNull {
    text-align: center;
}
.phonePage {
    position: absolute;
    width: 299px;
    height: 50px;
    bottom: 1px;
    border-top: 1px solid #aaa;
}
.phoneMenu {
    float: left;
    width: 99.3px;
    height: 49px;
    bottom: 0;
    border-left: 1px solid #aaa;
}
.phoneMenu:first-child {
    border-left: none;
}
.phoneMenu.selectItem {
    background: #44b549;
}
.phoneMenu i {
    color: #000;
}
.phoneMenuitem p {
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    color: #000;
}

.phoneMenu.selectItem p,
.phoneMenu.selectItem i {
    color: #fff !important;
}
.deleteItem {
    position: absolute;
    margin-top: -10px;
    margin-left: 430px;
}
.xiaj {
    position: absolute;
    margin-left: -6px;
    z-index: 10000000;
}
.twoMenu {
    border: 1px solid #ccc;
    position: absolute;
    width: 80px;
    /* overflow: hidden; */
    bottom: 70px;
    text-align: center;
}
.twoMenu.active {
    display: none;
}
.twoMenu.active1 {
    left: 10px;
}
.twoMenu.active2 {
    left: 110px;
}
.twoMenu.active3 {
    left: 210px;
}
.twoMenu i {
    color: #000;
}
.twoMenuItem:first-child {
    border: none;
}
.twoMenuItem {
    width: 100%;
    height: 49px;
    border-top: 1px solid #ccc;
}
.twoMenuItem.active {
    background: #44b549;
}
.twoMenuItem p {
    line-height: 50px;
    text-align: center;
    font-size: 14px;
}
.twoMenuItem.active p {
    color: #fff;
}
.twoMenuItem.active i {
    color: #fff;
}
</style>