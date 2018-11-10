<template>
    <div>
        <row>
            <i-col>
                <Select v-model="selectItem" style="width:200px" @on-change='selectChange'>
                    <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col style="margin-top:20px;">
                <Page :total="total" :page-size="per_page" @on-change='changePage' />
            </i-col>
            <i-col style="margin-top:20px;">
                <i-table style="width:100%;min-width:600px;" :columns="userColunm" :data="userList"></i-table>
            </i-col>
        </row>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    data() {
        return {
            total: 1,
            per_page: 1,
            selectItem: "-1",
            selectList: [
                {
                    label: "全部",
                    value: "-1"
                },
                {
                    label: "已授权",
                    value: "1"
                },
                {
                    label: "未授权",
                    value: "0"
                }
            ],
            currentPage: 1,
            userColunm: [
                {
                    title: "头像",
                    width: 100,
                    render: (h, params) => {
                        return h(
                            "img",
                            {
                                attrs: {
                                    src: params.row.avatarUrl,
                                    style: "width:50px;height:50px;"
                                }
                            },
                            ""
                        );
                    }
                },{
                    title:'名称',
                    key:'nickname'
                },{
                    title:'地区',
                    key:'city'
                },{
                    title:'积分',
                    key:'point'
                },{
                    title:'性别',
                    // key:'gender'
                    width:100,
                    render: (h, params) => {
                        return h(
                            "p",
                            {
                                attrs: {
                                }
                            },
                            params.row.gender===0?'未知':(params.row.gender===1?'男':'女')
                        );
                    }
                }
            ],
            userList: []
        };
    },
    methods: {
        selectChange(value){
            this.getUser()
        },
        changePage(index) {
            this.currentPage = index;
            this.getUser()
        },
        getUser() {
            axios
                .request({
                    url:
                        "fans?page=" +
                        this.currentPage +
                        "&status=" +
                        this.selectItem,
                    method: "get"
                })
                .then(res => {
                    this.total = res.data.total;
                    this.per_page = res.data.per_page;
                    this.userList = res.data.data;
                });
        }
    },
    mounted() {
        this.getUser();
    }
};
</script>

<style scoped>
</style>