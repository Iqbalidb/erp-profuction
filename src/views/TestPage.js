const data = {
    cuttingId: "243ac2c2-1a4a-4f24-09f0-08db7606d984",
    cuttingDate: "2023-06-27",
    cuttingType: "Contrast",
    tableNo: "",
    comboSize: 0,
    mergePoint: 9,
    totalQuantity: 150,
    listContrastParts: [
        {
            cutPlanId: "d5825a83-4060-4e7c-d2f5-08db7606d96b",
            cutPlanNo: "CP-1/ St-QT-IQ",
            cuttingId: "243ac2c2-1a4a-4f24-09f0-08db7606d984",
            cutNo: "CN-1/CP-1/ St-QT-IQ",
            styleId: "72388217-4922-4695-a8ff-09086464df31",
            styleNo: " St-QT-IQ",
            buyerId: "271aa961-1108-42bb-87c5-9d4f1dde116d",
            buyerName: "QT-NTD FS",
            styleCategoryId: "44e6ed83-2265-41c8-a7aa-5d0c40f0c5d0",
            styleCategory: "Jogger",
            poNo: "St-QT-IQ-PO",
            poId: "bfcce122-7c15-42dd-b806-7065543cd3ca",
            destination: "NETHERLANDS",
            shipmentDate: "2022-11-30T00:00:00",
            shipmentMode: "ROAD",
            colorId: "32197bfd-1bc9-4dcb-92bd-0eafb572043a",
            colorName: "001 BLACK",
            partGroupId: "c3a99dec-9438-416b-c72b-08da80fa24ab",
            partGroupName: "Cotton",
            sizeId: "a01f2709-9b21-4a4e-8b3c-1ad291334f2a",
            sizeName: "SIZE-XXXS",
            productPartsShade: "A",
            quantity: 20,
            status: "Pending"
        }
    ]
};
const parts = [
    {
        productPartsId: "4a0ce02b-1ca7-467d-0e4c-08da80f999cb",
        productPartsName: "Cuff"
    },
    {
        productPartsId: "e34b1127-f9d9-4f7f-1b34-08db285b679f",
        productPartsName: "Front Body"
    },
    {
        productPartsId: "cb3b8e79-5ede-4c36-e24d-08db3015e3ff",
        productPartsName: "Back Body"
    }
];
const data2 = data.listContrastParts.map( i => {
    const partList = parts.map( p => ( {

        cutPlanNo: i.cutPlanNo,
        name: p.productPartsName
    } ) );
    return partList;
} );
console.log( data2 );