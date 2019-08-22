import { regionData } from "element-china-area-data";
import regionData1 from "../assets/region1";
const common = {
    /**
     * 区域code转中文
     * @param {xxx-xxx-xxx} data 
     */
    regionFormat(data) {
        if (data) {
            let arr = [];
            let paramsArr = data.split('-');
            regionData.map((province, index) => {
                if (province.value == paramsArr[0]) {
                    arr[0] = province.label;
                }
                let cityData = province.children;
                if (cityData && paramsArr.length > 1) {
                    cityData.map((city, cityIndex) => {
                        if (city.value == paramsArr[1]) {
                            arr[1] = city.label;
                        }
                        let distanceData = city.children;
                        if (distanceData && paramsArr.length > 2) {
                            distanceData.map((distance, distanceIndex) => {
                                if (distance.value == paramsArr[2]) {
                                    arr[2] = distance.label;
                                }

                            })
                        }
                    })
                }
            })
            return arr.join(' ');
        }


    },
    /**
     * 获取32位uuid
     */
    getuuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        var uuid = s.join("");
        return uuid;
    },

    getUrlKey(name) {
        let href = location.href;
        try {
            href = decodeURIComponent(href);
        } catch (err) {
            href = location.href;
        }
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(href) || [, ""])[1].replace(/\+/g, '%20')) || null
    },

    ArrayIsEqual(arr1, arr2) { //判断2个数组是否相等
        //   if (arr1 === arr2) { //如果2个数组对应的指针相同，那么肯定相等，同时也对比一下类型
        //       return true;
        //   } else {
        //       if (arr1.length != arr2.length) {
        //           return false;
        //       } else { //长度相同
        //           for (let i in arr1) { //循环遍历对比每个位置的元素
        //               if (!arr2.includes(arr1[i])) { //arr1 中有一个不在arr2中
        //                   return false;
        //               }
        //           } //for循环完成，没有出现不相等的情况，那么2个数组相等
        //           return true;
        //       }
        //   }

        // 此处应为包含关系  所选的地区包括全国所有地区
        for (let i in arr1) { //循环遍历对比每个位置的元素
            if (!arr2.includes(arr1[i])) { //arr1 中有一个不在arr2中
                return false;
            }
        }
        return true
    },
    /**
     * 
     * @param {*code ,相隔} value 
     */
    regionValueToLabel(value) {
        let regionData = JSON.parse(JSON.stringify(regionData1));
        let regionLabel = '';
        if (value) {
            if (value == "all") {
                regionLabel = "全国";
            } else {
                let regionLabelArr = [];
                let regionArr = value.split(",");
                regionArr.map(region => {
                    regionData.find(area => {
                        // 若区域中有匹配的value
                        area.value == region ? (area.select = true) : "";
                    });

                    regionData.map(area => {
                        // 如果此区域勾选 
                        if (area.select) {
                            area.children.map(prionce => {
                                regionLabelArr.push(prionce.label);

                            });
                        } else {
                            // 如果此区域没有勾选
                            area.children.find(prionce => {
                                // 若省中有匹配的value
                                if (prionce.value == region) {
                                    prionce.select = true;
                                }
                            });
                            // 否则 遍历省
                            area.children.map(prionce => {
                                // 如果此省已勾选
                                if (prionce.select) {
                                    regionLabelArr.push(prionce.label);
                                } else {
                                    // 否则
                                    prionce.children.find(city => {
                                        if (city.value == region) {
                                            regionLabelArr.push(city.label);
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                regionLabel = regionLabelArr.join(",");
            }
        } else {

        }
        return regionLabel
    },
    limit(value) {
        // 通过正则过滤小数点后两位
        //     this.s_sell_price= this.s_sell_price.replace(/[^\a-\z\A-\Z0-9]/g, '');
        var price = "" + value;
        price = price
            .replace(/[^\d.]/g, "") // 清除“数字”和“.”以外的字符
            .replace(/\.{2,}/g, ".") // 只保留第一个. 清除多余的
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".")
            .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入两个小数
        if (price.indexOf(".") < 0 && price != "") {
            // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            price = parseFloat(price);
        }
        price = price + "";
        if (price.split(".")[0].length > 7) {
            price = `
          ${price.split(".")[0].slice(0, 7)}`;
        }
        return price
    }



}
export default common