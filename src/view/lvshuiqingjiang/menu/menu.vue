<template>
    <div>
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
                            <div :class="'twoMenuItem '+(currentTwoIndex===index?'active':'')" v-for="(item,index) in currentTwo" :key='index' @click="selectTwo(index)">
                                <p>{{currentTwo[index].name}}</p>
                            </div>
                            <div :class="'twoMenuItem '+(currentTwoIndex<5?'active':'')" v-if='currentTwo.length<5' @click="selectTwo(currentTwo.length)">
                                <Icon type="ios-add" size='35' style="margin-top:7.5px;" />
                            </div>
                            <Icon type="ios-arrow-down" class="xiaj" />
                        </div>
                    </div>
                </div>
            </i-col>
            <i-col class="dataPage" v-if="(selectIndex > 0 && currentTwo.length === 0)||selectIndex === 0" style="width:500px;float:left;margin-left:100px;">
                <row>
                    <i-col style="width:100px;float:left;line-height:33px;font-size:16px">
                        菜单名称
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Input v-model="menuData.name" :maxlength='8' style="width: 200px" />
                    </i-col>
                </row>
                <row style="margin-top:20px;">
                    <i-col style="width:100px;float:left;font-size:16px;">
                        菜单内容
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <RadioGroup v-model="menuData.type">
                            <Radio label="view">链接</Radio>
                            <Radio label="click">素材</Radio>
                        </RadioGroup>
                    </i-col>
                </row>
                <row style="margin-top:20px;" v-if="menuData.type == 'view'">
                    <i-col style="width:100px;float:left;font-size:16px;line-height:33px;">
                        链接地址
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Input v-model="menuData.url" style="width: 200px" />
                    </i-col>
                </row>
                <row style="margin-top:20px;" v-else>
                    <i-col style="width:100px;float:left;font-size:16px;line-height:33px;">
                        选择素材
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Select v-model="menuData.key" style="width:200px">
                            <Option v-for="item in keyList" :value="item.key" :key="item.key">{{ item.key }}</Option>
                        </Select>
                    </i-col>
                </row>
            </i-col>
            <i-col class="dataPage" v-else style="width:500px;float:left;margin-left:100px;">
                <row>
                    <i-col style="width:100px;float:left;line-height:33px;font-size:16px">
                        菜单名称
                    </i-col>
                    <i-col style="width:200px;float:left;">
                        <Input v-model="menuData.name" :maxlength='8' style="width: 200px" />
                    </i-col>
                </row>
            </i-col>
            <i-col style="width:500px;float:left;margin-left:100px;margin-top:20px;">
                <Button type='success' @click='inputData' style="background:#44b549;" :disabled='selectIndex === 0 && currentTwoIndex === 6'>保存并发布</Button>
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
// 一级菜单 最多3个  二级菜单 最多5个
export default {
    data() {
        return {
            menuList: [],
            currentData:{},
            menuData: {
                name: "",
                type: "view",
                url: "",
                key: ""
            },
            currentTwo:[],
            currentIndex:'',
            currentTwoIndex:6,
            selectIndex:0,
            selectOneIndex:0,
            keyList: [
                {
                    key: "key1"
                },
                {
                    key: "key2"
                }
            ]
        };
    },
    methods: {
        getList(){
            axios.request({
                url:'wechat/menu/list',
                method:'get'
            }).then(res=>{
                this.menuList = res.data.menu.button
                
            })
            
        },  
        addOne() {
            // console.log(1);
        },
        seletcOne(index){
            this.selectIndex = index
            if(index<=this.menuList.length){
                this.menuData = this.menuList[index-1]
                this.menuData = {
                    name: this.menuList[index-1].name,
                    type: this.menuList[index-1].type,
                    url:'',
                    key:''
                }
                
                if(this.menuData.type === 'view'){
                    this.menuData.url = this.menuList[index-1].url
                }else{
                    this.menuData.key = this.menuList[index-1].key
                }
                this.currentIndex = index
                this.currentTwo = this.menuList[index-1].sub_button
            }else{
                this.menuData = {
                    name: "",
                    type: "view",
                    url: "",
                    key: ""
                }
                this.currentIndex = ''
            }
            this.currentTwoIndex = 6
        },
        selectTwo(index){
            if(index<this.currentTwo.length){
                this.menuData = this.currentTwo[index]
                this.menuData = {
                    name: this.currentTwo[index].name,
                    type: this.currentTwo[index].type,
                    url: '',
                    key: ''
                }
                if(this.menuData.type === 'view'){
                    this.menuData.url = this.currentTwo[index].url
                }else{
                    this.menuData.key = this.currentTwo[index].key
                }
            }else{
                this.menuData = {
                    name: "",
                    type: "view",
                    url: "",
                    key: ""
                }
                this.currentTwoIndex = index+1
            }
            this.selectIndex = 0
        },
        inputData(){
            if(this.menuData.name === '' || (this.menuData.type === 'view' && this.menuData.url === '') || (this.menuData.type === 'click' && this.menuData.key === '')){
                this.$Message.error('资料填写不完整')
                return false
            }
            //保存一级
            if(this.selectIndex > 0 && this.currentTwoIndex === 6){
                if(this.selectIndex>this.menuList.length){
                    if(this.menuData.type === 'view'){
                        this.menuList.push({
                            name:this.menuData.name,
                            type:this.menuData.type,
                            url:this.menuData.url,
                            sub_button:[]
                        })
                    }else{
                        this.menuList.push({
                            name:this.menuData.name,
                            type:this.menuData.type,
                            key:this.menuData.key,
                            sub_button:[]
                        })
                    }
                }
            }
            //保存二级
            if(this.selectIndex === 0 && this.currentTwoIndex < 6){
                if(this.currentTwo.length<5){
                    this.menuList[this.selectOneIndex] = {
                        name:this.menuList[this.selectOneIndex].name,
                        sub_button:[]
                    }
                    if(this.menuData.type === 'view'){
                        this.menuList[this.selectOneIndex].sub_button.push({
                            name:this.menuData.name,
                            type:this.menuData.type,
                            url:this.menuData.url
                        })
                    }else{
                        this.menuList[this.selectOneIndex].sub_button.push({
                            name:this.menuData.name,
                            type:this.menuData.type,
                            key:this.menuData.key
                        })
                    }
                }
            }
            console.log(this.menuList);
            this.selectIndex = 0
            this.currentIndex = ''
            this.currentTwoIndex = 6
            return
            axios.request({
                url:'wechat/menu/create',
                method:'',
                data:{
                    menu:this.menuData
                }
            })
        }
    },
    mounted() {
        this.getList()
    }
};
</script>

<style scoped>
.dataPage{
    background: #fff;
    padding: 30px;
    border:1px solid #aaa;
}
.phone {
    width: 300px;
    height: 500px;
    background: #fff;
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
    width: 99px;
    height: 49px;
    bottom: 0;
    border-left: 1px solid #aaa;
}
.phoneMenu:first-child{
    border-left: none;
}
.phoneMenu.selectItem{
    background: #44b549;
}
.phoneMenu i{
    color: #000;
}
.phoneMenuitem p{
    line-height: 50px;
    text-align: center;
    font-size: 14px;
    color: #000;
}

.phoneMenu.selectItem p,.phoneMenu.selectItem i{
    color: #fff !important;
}

.xiaj{
    position: absolute;
    margin-left: -6px;
    z-index: 10000000;
}
.twoMenu{
    border:1px solid #ccc;
    position: absolute;
    width: 80px;
    /* overflow: hidden; */
    bottom: 70px;
    text-align: center;
}
.twoMenu.active{
    display: none;
}
.twoMenu.active1{
    left:10px;
}
.twoMenu.active2{
    left:110px;
}
.twoMenu.active3{
    left:210px;
}
.twoMenu i{
    color: #000;
}
.twoMenuItem:first-child{
    border:none;
}
.twoMenuItem{
    width: 100%;
    height: 49px;
    border-bottom: 1px solid #ccc; 
}
.twoMenuItem.active{
    background: #44b549;
}
.twoMenuItem.active i{
    color:#fff;
}
</style>