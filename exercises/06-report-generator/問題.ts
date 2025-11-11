/**
 * 以下のコードはレポート生成システムの一部です。
 * このコードには複数の問題があります。リファクタリングしてください。
 */

interface ReportOutDataSource {
  uniqueID: string;
  memberDiv: string;
  toDistAss: string;
  toDistCode: string;
  directionDiv: string;
  addressDiv: string;
  taxationDiv: string;
  sourceDiv: string;
  dataDiv: string;
  performerFlg: boolean;
  taxRate: number;
  taxRate2: number;
}

class DetailReportSearchCriteria {
  societyCode: string = "";
  memberDiv: string = "";
  toDistAss: string = "";
  toDistCode: string = "";
  directionDiv: string = "";
  addressDiv: string = "";
  taxationDiv: string = "";
  sourceDiv: string = "";
  dataDiv: string = "";
  performersFlag: boolean = false;
  taxRate: number = 0;
  taxRate2: number = 0;

  isAddressDivFlag(): boolean {
    return true;
  }

  setSocietyCode(v: string) {
    this.societyCode = v;
  }
  setMemberDiv(v: string) {
    this.memberDiv = v;
  }
  setToDistAss(v: string) {
    this.toDistAss = v;
  }
  setToDistCode(v: string) {
    this.toDistCode = v;
  }
  setDirectionDiv(v: string) {
    this.directionDiv = v;
  }
  setAddressDiv(v: string) {
    this.addressDiv = v;
  }
  setTaxationDiv(v: string) {
    this.taxationDiv = v;
  }
  setSourceDiv(v: string) {
    this.sourceDiv = v;
  }
  setDataDiv(v: string) {
    this.dataDiv = v;
  }
  setPerformersFlag(v: boolean) {
    this.performersFlag = v;
  }
  setTaxRate(v: number) {
    this.taxRate = v;
  }
  setTaxRate2(v: number) {
    this.taxRate2 = v;
  }
}

function generateReports(keyList: ReportOutDataSource[]) {
  const dCriteria = new DetailReportSearchCriteria();
  const rs: Array<Map<string, any>> = [];

  for (let i = 0; i < keyList.length; i++) {
    const sub_key = keyList[i];
    const sub_dCriteria = dCriteria;

    sub_dCriteria.setSocietyCode(sub_key.uniqueID);
    sub_dCriteria.setMemberDiv(sub_key.memberDiv);
    sub_dCriteria.setToDistAss(sub_key.toDistAss);
    sub_dCriteria.setToDistCode(sub_key.toDistCode);
    sub_dCriteria.setDirectionDiv(sub_key.directionDiv);
    if (sub_dCriteria.isAddressDivFlag()) {
      sub_dCriteria.setAddressDiv(sub_key.addressDiv);
    }
    sub_dCriteria.setTaxationDiv(sub_key.taxationDiv);
    sub_dCriteria.setSourceDiv(sub_key.sourceDiv);
    sub_dCriteria.setDataDiv(sub_key.dataDiv);
    sub_dCriteria.setPerformersFlag(sub_key.performerFlg);
    sub_dCriteria.setTaxRate(sub_key.taxRate);
    sub_dCriteria.setTaxRate2(sub_key.taxRate2);

    const map = new Map<string, any>();
    map.set("index", i);
    map.set("societyCode", sub_dCriteria.societyCode);
    map.set("memberDiv", sub_dCriteria.memberDiv);
    rs.push(map);

    console.log(`ループ${i + 1}回目:`, sub_dCriteria);
  }

  console.log("最終的な dCriteria:", dCriteria);
  console.log("結果リスト rs:", rs);

  return rs;
}

const testData: ReportOutDataSource[] = [
  {
    uniqueID: "A001",
    memberDiv: "MD1",
    toDistAss: "ASS1",
    toDistCode: "C001",
    directionDiv: "DIR1",
    addressDiv: "Tokyo",
    taxationDiv: "TAX1",
    sourceDiv: "SRC1",
    dataDiv: "DATA1",
    performerFlg: true,
    taxRate: 10,
    taxRate2: 8,
  },
  {
    uniqueID: "B002",
    memberDiv: "MD2",
    toDistAss: "ASS2",
    toDistCode: "C002",
    directionDiv: "DIR2",
    addressDiv: "Osaka",
    taxationDiv: "TAX2",
    sourceDiv: "SRC2",
    dataDiv: "DATA2",
    performerFlg: false,
    taxRate: 5,
    taxRate2: 3,
  },
];

generateReports(testData);
