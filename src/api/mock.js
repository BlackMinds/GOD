import Mock from 'mockjs' 

Mock.mock(new RegExp('xs/saleorder/selectOrderComm'), 'post', () => {  //销售合同订单管理的假数据
    return {
        body: {
           rows: [
               {    
                    index: 1,
                    createTime: "2020-07-01 14:02:29",
                    customerName: "2",
                    customerNo: "1",
                    customerProvince: "3",
                    deliveryWay: "",
                    id: 456,
                    isDelete: 0,
                    itemId: 1057,
                    itemStatus: 2,
                    number: 3,
                    orderNo: "5000251652",
                    poId: 177,
                    poItemId: "269052",
                    poNo: "5000251652",
                    productCode: "500038949",
                    productDesc: "交流避雷器,AC66kV,90kV,瓷,235kV,不带间隙",
                    projectName: "喀什-莎车750千伏输变电工程",
                    reviewId: 104,
                    reviewStatus: 2,
                    serialNumber: "500025165200010",
                    status: 1,
                    type: 1,
               },
               {
                index: 2,
                createTime: "2020-06-01 11:46:31",
                customerName: "1245222",
                customerNo: "5242",
                customerProvince: "123421",
                deliveryWay: "车板",
                id: 433,
                isDelete: 0,
                itemId: 1012,
                itemStatus: 2,
                note: "20200601测试",
                number: 100,
                orderNo: "723574",
                poId: 170,
                poItemId: "2523",
                poNo: "723574",
                productCode: "CP96",
                productDesc: "直流梯度225v/mm，直流泄漏＜20μA，方波600-800A，大电流100KA，压比＜1.75，老化系数＜1.0",
                productSpecs: "D52x24",
                projectName: "0601",
                reviewId: 56,
                reviewStatus: 2,
                serialNumber: "723574524",
                status: 1,
                type: 1,
               },
               {
                index: 3,
                createTime: "2020-06-01 11:46:31",
                customerName: "1245222",
                customerNo: "5242",
                customerProvince: "123421",
                deliveryWay: "车板",
                id: 433,
                isDelete: 0,
                itemId: 1012,
                itemStatus: 2,
                note: "20200601测试",
                number: 100,
                orderNo: "723574",
                poId: 170,
                poItemId: "2523",
                poNo: "723574",
                productCode: "CP96",
                productDesc: "直流梯度225v/mm，直流泄漏＜20μA，方波600-800A，大电流100KA，压比＜1.75，老化系数＜1.0",
                productSpecs: "D52x24",
                projectName: "0601",
                reviewId: 56,
                reviewStatus: 2,
                serialNumber: "723574524",
                status: 1,
                type: 1,
               },
               
           ],
           total: 2
        },
        head: {respCode: "0000000", respContent: "执行成功"}
    }
})