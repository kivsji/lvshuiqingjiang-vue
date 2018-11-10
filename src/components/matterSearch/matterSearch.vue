<template>
    <div style="min-width:1100px;margin-bottom:20px;">
        <row>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        标题:
                    </i-col>
                    <i-col span='17' offset='1'>
                        <i-input placeholder="" v-model="title"></i-input>
                    </i-col>
                </row>
            </i-col>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        作者:
                    </i-col>
                    <i-col span='17' offset='1'>
                        <i-input placeholder="" v-model="author"></i-input>
                    </i-col>
                </row>
            </i-col>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        id:
                    </i-col>
                    <i-col span='17' offset='1'>
                        <i-input placeholder="" v-model="id"></i-input>
                    </i-col>
                </row>
            </i-col>
            <i-col span='5'>
                <row>
                    <i-col span='6' style="text-align:right;line-height:30px;">
                        标签:
                    </i-col>
                    <i-col span='15' offset='1'>
                        <Select v-model="tag" style="width:200px" filterable clearable>
                            <Option v-for="item in tagsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </i-col>
                </row>
            </i-col>
            <i-col span='2' offset='1'>
                <i-button type='primary' @click="commit()">搜索</i-button>
            </i-col>
        </row>
        <row span='5'>
            <i-col style="margin-top:20px;" offset='1'>
                <Page :total="total" :page-size="per_page" @on-change='changePage' />
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    props: [],
    data() {
        return {
            per_page:1,
            total:1,
            currentPage:1,

            title: "",
            author: "",
            id: "",
            tag: "",
            indexPage: 1,
            tagsList:''
        };
    },
    methods: {
        changePage(index) {
            this.currentPage = index;
            this.submitSearch()
        },
        getTags() {
            axios
                    .request({
                        url: "tags/all",
                        method: "get"
                    })
                    .then(res => {
                        this.tagsList = []
                        for(let i=0;i<res.data.length;i++){
                            this.tagsList.push({
                                label:res.data[i].name,
                                value:res.data[i].id
                            })
                        }
                    });
        },
        commit(){
            this.currentPage = 1
            this.submitSearch()
        },
        submitSearch() {
            // console.log(this.index);
            // return;
            axios
                .request({
                    url:
                        "pictures?page=" +
                        this.currentPage +
                        "&title=" +
                        this.title +
                        "&author=" +
                        this.author +
                        "&id=" +
                        this.id +
                        "&tag_id=" +
                        this.tag,
                    method: "get"
                })
                .then(res => {
                    this.total = res.data.total
                    this.per_page = res.data.per_page
                    this.$emit("listenToparent", res);
                });
        }
    },
    mounted(){
        this.getTags()
    },
    watch: {
        index: function(newVal, oldVal) {
            this.indexPage = newVal; //newVal即是chartData
        }
    }
};
</script>

<style>
</style>