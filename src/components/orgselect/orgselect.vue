<template>
    <div>
        <Button shape="circle" icon="ios-people" @click="openOrgSelectModal"></Button>
        <Modal v-model="orgModal" title="选择人员" @on-ok="orgOk" @on-cancel="orgCancel" width='1100px'>
            <row>
                <i-col span='8'>
                    <i-table :data='depList' :highlight-row='true' @on-row-click='getCurrentMenber' :columns='depColumns'></i-table>
                </i-col>
                <i-col span='14' offset='2'>
                    <i-col span='11'>
                        <i-table ref="selection" :data='menberList' @on-row-click='setCurrent' @on-select='selectColumn' @on-select-all='selectAllColumn' :columns='beforeColumns'></i-table>
                    </i-col>
                    <i-col span='2'>
                        <i-col>
                            <Button style="margin:0 auto;display:block;" :disabled='returnDis' shape="circle" icon="ios-arrow-back" @click="reRes"></Button>
                        </i-col>
                        <i-col>
                            <Button style="margin:50% auto;display:block;" :disabled='toDis' shape="circle" icon="ios-arrow-forward" @click="toRes"></Button>
                        </i-col>
                    </i-col>
                    <i-col span='11'>
                        <i-table ref="returnSelect" :data='resMenber' @on-select='selectColumn1' @on-select-all='selectAllColumn1' :columns='manberColumns'></i-table>
                    </i-col>
                </i-col>
            </row>
        </Modal>
    </div>
</template>

<script>
import axios from "@/libs/api.request";
export default {
    name: "org",
    props: ["docId"],
    data() {
        return {
            toDis: true,
            returnDis: true,
            orgModal: false,
            depList: [],
            depColumns: [
                {
                    title: "部门ID",
                    key: "id"
                },
                {
                    title: "部门名称",
                    key: "name"
                }
            ],
            beforeColumns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "姓名",
                    key: "name"
                }
            ],
            manberColumns: [
                {
                    type: "selection",
                    width: 60,
                    align: "center"
                },
                {
                    title: "姓名",
                    key: "name"
                },
                {
                    title: "部门",
                    key: "depName"
                }
            ],
            selectData: "",
            menberList: [],
            resMenber: [],
            currentSelect: [],
            currentReturn: []
        };
    },
    methods: {
        getAllData() {
            if(this.docId === '1'){
                axios
                .request({
                    method: "GET",
                    url: "/openWindow?doc_id="+localStorage.getItem('docsId'),
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                })
                .then(res => {
                    this.depList = res.data;
                });
            }else{
                axios
                .request({
                    method: "GET",
                    url: "/openWindow",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                })
                .then(res => {
                    for (var i in res.data) {
                        this.depList.push(res.data[i]); 
                    }

                    // return
                    for(let i=0;i<this.depList.length;i++){
                        for(let j=0;j<this.depList[i].members.length;j++){
                            this.depList[i].members[j].depName = this.depList[i].members[j].department.name
                        }
                    }
                    // this.depList = res.data;
                });
            }
            
        },
        openOrgSelectModal() {
            this.orgModal = true;
        },
        getCurrentMenber(data) {
            this.selectData = JSON.parse(JSON.stringify(data.members));
            this.menberList = [];
            this.menberList = JSON.parse(JSON.stringify(data.members));
            // for(let i=0;i<data.menbers.lengthl;i++){
            //     this.menberList.push(data.menbers[i])
            // }
            if (this.menberList.length > 0) {
                this.setSelectDisabled();
            }
        },
        //穿梭事件
        setCurrent(data,row){

        },
        selectColumn(data, row) {
            this.currentSelect = [];
            for (let i = 0; i < data.length; i++) {
                this.currentSelect.push(data[i]);
            }
            if (data.length > 0) {
                this.toDis = false;
            } else {
                this.toDis = true;
            }
        },
        selectAllColumn(data) {
            this.currentSelect = [];
            for (let i = 0; i < data.length; i++) {
                this.currentSelect.push(data[i]);
            }
            if (data.length > 0) {
                this.toDis = false;
            } else {
                this.toDis = true;
            }
        },

        selectColumn1(data, row) {
            this.currentReturn = [];
            for (let i = 0; i < data.length; i++) {
                this.currentReturn.push(data[i]);
            }
            if (data.length > 0) {
                this.returnDis = false;
            } else {
                this.returnDis = true;
            }
        },
        selectAllColumn1(data) {
            this.currentReturn = [];
            for (let i = 0; i < data.length; i++) {
                this.currentReturn.push(data[i]);
            }
            if (data.length > 0) {
                this.returnDis = false;
            } else {
                this.returnDis = true;
            }
        },
        //删除目标
        reRes() {
            for (let i = 0; i < this.resMenber.length; i++) {
                for (let j = 0; j < this.currentReturn.length; j++) {
                    if (this.resMenber[i].id == this.currentReturn[j].id) {
                        this.resMenber.splice(i, 1);
                    }
                }
            }
            this.returnDis = true;
            this.menberList = JSON.parse(JSON.stringify(this.selectData));
            this.setSelectDisabled();
        },
        //添加目标
        toRes() {
            for (let i = 0; i < this.currentSelect.length; i++) {
                this.resMenber.push(this.currentSelect[i]);
            }
            this.toDis = true;
            this.currentSelect = [];
            this.$refs.selection.selectAll(false);
            
            this.setSelectDisabled();
        },
        //筛选menbereList
        setSelectDisabled() {
            for (let i = 0; i < this.menberList.length; i++) {
                for (let j = 0; j < this.resMenber.length; j++) {
                    if (this.menberList[i].id == this.resMenber[j].id || this.menberList[i].send === 1) {
                        this.menberList.splice(i, 1);
                    }
                }
            }
        },
        orgOk() {
            this.$emit("listenToparent", this.resMenber);
        },
        orgCancel() {}
    },
    mounted(){
        this.getAllData()
    }
};
</script>

<style>
</style>