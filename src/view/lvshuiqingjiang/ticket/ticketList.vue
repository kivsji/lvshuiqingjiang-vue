<template>
    <div>
        <i-col style="margin-bottom:10px;">
            <Button type='primary' @click='newData()'>新建门票</Button>
        </i-col>
        <i-col style="margin-bottom:20px;">
            <Page :total="total" :page-size="pre_page" />
        </i-col>
        <i-col>
            <i-table size="large" style="min-width:800px;" :columns="ticketColunm" :data="ticketList"></i-table>
        </i-col>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            total:1,
            pre_page:1,
            ticketList:[
                {
                    name:'烧烤票',
                    docs:'描述----',
                    money:100,
                    dayNum:10
                },{
                    name:'ab票',
                    docs:'描述----',
                    money:100,
                    dayNum:10
                }
            ],
            ticketColunm:[
                {
                    title:'项目名',
                    key:'name'
                },{
                    title:'描述',
                    key:'docs'
                },{
                    title:'金额',
                    key:'money'
                },{
                    title:'每日限额',
                    key:'dayNum'
                }
            ]
        };
    },
    methods:{
        newData(){

        }
    },
    mounted(){
        
    }
};
</script>

<style scoped>
</style>
