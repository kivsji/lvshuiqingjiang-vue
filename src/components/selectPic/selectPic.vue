<template>
    <div>
        <Modal v-model="selectModal" style="overflow:hidden;" width='1200px' height='500px' title="选择图片" @on-ok="returnSelect()" @on-cancel="closeModal">
            <i-col>
                <matterSearch @listenToparent='returnMatterSearch' :index='index' ref="matterSearch"></matterSearch>
            </i-col>
            <i-col>
                已添加：
            </i-col>
            <i-col style="width:1200px;height:400px;">
                <div style="width:540px;height:400px;float:left;overflow-y:scroll;">
                    <div v-for='(item,index) in selectList' style="border:1px solid #eee;width:250px;height:250px;float:left;overflow:hidden;position:relative;">
                        <span @click.stop="removePic(index)" style="position:absolute;margin-top:0;margin:left;background:#aaa;color:#fff;display:block;width:20px;height:20px;line-height:20px;text-align:center;cursor: pointer">
                                ╳
                            </span>
                        <img :src="item.url" height="250" style="display:block;margin:0 auto;">
                    </div>
                </div>
                <i-table height='400' style="width:600px;float:right;margin-right:50px;" :columns="picColumn" :data="picList"></i-table>
            </i-col>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
import matterSearch from "@/components/matterSearch";
export default {
    props: ["hasSelect","oneOrAll"],
    //0 单选  1  多选
    components: { matterSearch },
    data() {
        return {
            index: 1,
            total: 1,
            per_page: 1,
            selectModal: false,
            picColumn: [
                {
                    title: "缩略图",
                    render: (h, params) => {
                        return h(
                            "img",
                            {
                                attrs: {
                                    src:
                                        params.row.url +
                                        "?imageMogr2/auto-orient/thumbnail/x50/blur/1x0/quality/75",
                                    style: "width:50px;height:50px;"
                                }
                            },
                            ""
                        );
                    }
                },
                {
                    title: "作者",
                    key: "author"
                },
                {
                    title: "id",
                    key: "pic_id"
                },
                {
                    title: "操作",
                    render: (h, params) => {
                        return h(
                            "i-button",
                            {
                                props: {
                                    type: "primary",
                                    size: "small"
                                },
                                nativeOn: {
                                    click: ()=>{
                                        if(this.oneOrAll === 0){
                                            //单选
                                            this.selectList = []
                                            this.selectList.push({
                                                id:params.row.id,
                                                url:params.row.url
                                            })
                                        }
                                        if(this.oneOrAll === 1 && this.selectList.length>0){
                                            for(let i=0;i<this.selectList.length;i++){
                                                console.log(this.selectList[i].id !== params.row.id);
                                                
                                                if(this.selectList[i].id !== params.row.id && (i === (this.selectList.length - 1))){
                                                    console.log(2);
                                                    
                                                    this.selectList.push({
                                                        id:params.row.id,
                                                        url:params.row.url
                                                    })
                                                    break
                                                }else if(this.selectList[i].id === params.row.id){
                                                    break
                                                }
                                            }
                                        }else if(this.oneOrAll === 1){
                                            this.selectList.push({
                                                id:params.row.id,
                                                url:params.row.url
                                            })
                                        }
                                    }
                                }
                            },
                            "添加"
                        );
                    }
                }
            ],
            picList: [],
            selectList: []
        };
    },
    methods: {
        openSelect(i) {
            this.selectList = this.hasSelect
            this.selectModal = i;
        },

        closeModal(){
            this.selectList = []
        },
        //matterSearch组件事件
        returnMatterSearch(res) {
            this.picList = res.data.data;
            // this.total = parseInt(res.data.total);
        },
        changePage(index) {
            this.currentPage = index;
        },

        returnSelect() {
            this.$emit("listenToparent", this.selectList);
        },


        removePic(index){
            this.selectList.splice(index,1)
        },
        getPic() {
            this.$refs.matterSearch.submitSearch();
            this.selectTags = [];
        }
    },
    watch: {
        // selectModal: function(newVal, oldVal) {
        //     console.log(this.showModal);
        //     this.showModal = newVal; //newVal即是chartData
        // }

        hasSelect: function(n,l){
            this.selectList = this.hasSelect
        }
    },
    mounted() {
        this.getPic();
    }
};
</script>

<style scoped>
</style>