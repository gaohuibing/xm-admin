<template>
  <div>
    <el-button @click="selectAdress">选择地区</el-button>
    <div>选择的省份：{{regionLabel}}</div>
    <el-dialog :visible.sync="dialogVisible" width="60%">
      <div class="regionbox">
        <!-- // 全选 -->
        <div class="area">
          <div class="selection">
            <el-checkbox
              :indeterminate="indeterminate"
              v-model="ischeckAll"
              @change="handleCheckAllChange"
            >全部</el-checkbox>
          </div>
        </div>
        <template v-for="(item,index) in regionData">
          <div class="area" :key="index">
            <!-- 第一层 -->
            <div class="selection">
              <el-checkbox
                :indeterminate="item.indeterminate"
                v-model="item.select"
                @change="handleCheckedAreaAllChange('',item,$event)"
              >{{item.label}}</el-checkbox>
            </div>
            <!-- 第二层 -->
            <div class="proince">
              <template v-for="(proince,proinceIndex) in item.children">
                <el-popover
                  placement="bottom-start"
                  width="200"
                  trigger="hover"
                  :key="proinceIndex"
                >
                  <!-- 第三层 -->
                  <template v-for="(city,cityIndex) in proince.children">
                    <div class="selection" :key="cityIndex">
                      <el-checkbox
                        v-model="city.select"
                        @change="handleCheckedCityChange(item,proince,$event)"
                      >{{city.label}}</el-checkbox>
                    </div>
                  </template>
                  <div class="selection" slot="reference">
                    <el-checkbox
                      :indeterminate="proince.indeterminate"
                      v-model="proince.select"
                      @change="handleCheckedProinceAllChange(item,proince,$event)"
                    >{{proince.label}}{{proince.selectNum?`(${proince.selectNum})`:''}}</el-checkbox>
                  </div>
                </el-popover>
              </template>
            </div>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm ">确 定</el-button>
      </span>
    </el-dialog>
    <draggable v-model="myArray" group="people" @start="drag=true" @end="drag=false;">
      <div v-for="(element,index) in myArray" :key="index">{{element}}</div>
    </draggable>
  </div>
</template>

<script>
import regionData from "../../assets/region1";
import draggable from "vuedraggable";
export default {
	components:{draggable},
  data() {
    return {
      regionData: regionData,
      regionDataOrigin: regionData,
      ischeckAll: false,
      indeterminate: false,
      dialogVisible: false,
      regionLabel: "",
	regionValue: "",
	myArray:[1,2,34,214,43643]
    };
  },
  computed: {
    // 区域原始数据
    //   regionDataOrigin(){
    // 	  return Object.freeze()
    //   }
  },
  
  mounted() {},
  methods: {
    handleCheckAllChange(e) {
      //一级change事件
      this.ischeckAll = e;
      this.indeterminate = false;
      this.regionData.map(area => {
        // 区域
        area.select = e;
        area.indeterminate = false;
        // 省
        area.children.map(prionce => {
          prionce.select = e;
          prionce.indeterminate = false;
          if (e) {
            prionce.selectNum = prionce.children.length;
          } else {
            prionce.selectNum = 0;
          }
          //区
          prionce.children.map(city => {
            city.select = e;
          });
        });
      });
    },
    handleCheckedAreaAllChange(father, item, e) {
      //二级change事件（区域）
      item.selected = e; //二级勾选后，子级全部勾选或者取消
      item.indeterminate = false; //去掉二级不确定状态
      var childrenArray = item.children;
      childrenArray.map(prionce => {
        prionce.select = e;
        prionce.indeterminate = false;
        if (e) {
          prionce.selectNum = prionce.children.length;
        } else {
          prionce.selectNum = 0;
        }
        //区
        prionce.children.map(city => {
          city.select = e;
        });
      });
      this.getIsAllCheck();
      // this.getIsCheckAll(father, item);
    },
    handleCheckedProinceAllChange(father, item, e) {
      //三级change事件（省）
      item.selected = e; //三级勾选后，子级全部勾选或者取消
      item.indeterminate = false; //去掉三级不确定状态
      if (e) {
        item.selectNum = item.children.length;
      } else {
        item.selectNum = 0;
      }
      var childrenArray = item.children;
      if (childrenArray)
        for (var i = 0, len = childrenArray.length; i < len; i++)
          childrenArray[i].select = e;
      // this.getIsCheckAll(father, item);
      this.getIsAreaCheck(father);
    },

    handleCheckedCityChange(gfather, father, e) {
      //四级change事件 （市）
      let num = 0;
      father.children.map(city => {
        if (city.select) {
          num++;
        }
      });
      father.selectNum = num;
      // this.getIsCheckAll(father, item);
      // if (!e) {
      //   if (this.ischeckAll) {
      //     this.indeterminate = true;
      //   }
      //   this.ischeckAll = false;
      // }
      this.getIsPrionceCheck(gfather, father);
    },

    // 点击区域
    getIsAllCheck() {
      this.indeterminate =
        this.regionData.some(item => item.select == true) &&
        !this.regionData.every(item => item.select == true);
      this.ischeckAll = this.regionData.every(item => item.select == true);
    },
    // 点击省
    getIsAreaCheck(father) {
      // 区域
      father.indeterminate =
        father.children.some(item => item.select == true) &&
        !father.children.every(item => item.select == true);
      father.select = father.children.every(item => item.select == true);
      let indeterminate = false;
      for (let area in this.regionData) {
        for (let prionce in area.children) {
          if (prionce.children.some(item => item.select == true)) {
            indeterminate = true;
            break;
          }
          if ((indeterminate = true)) {
            break;
          }
        }
        if ((indeterminate = true)) {
          break;
        }
      }
      // 全部
      this.indeterminate =
        indeterminate && !this.regionData.every(item => item.select == true);

      this.ischeckAll = this.regionData.every(item => item.select == true);
    },
    // 点击市
    getIsPrionceCheck(gFather, father) {
      // 省
      father.indeterminate =
        father.children.some(item => item.select == true) &&
        !father.children.every(item => item.select == true);
      father.select = father.children.every(item => item.select == true);

      // 区域
      gFather.indeterminate =
        (father.children.some(item => item.select == true) &&
          !gFather.children.every(item => item.select == true)) ||
        gFather.children.some(item => item.select == true);
      gFather.select = gFather.children.every(item => item.select == true);

      // 全部
      let indeterminate = false;
      for (let area in this.regionData) {
        for (let prionce in area.children) {
          if (prionce.children.some(item => item.select == true)) {
            indeterminate = true;
            break;
          }
          if ((indeterminate = true)) {
            break;
          }
        }
        if ((indeterminate = true)) {
          break;
        }
      }
      this.indeterminate =
        indeterminate && !this.regionData.every(item => item.select == true);
      this.ischeckAll = this.regionData.every(item => item.select == true);
    },

    // 确认
    confirm() {
      let data = this.regionData,
        regionLabel = [],
        regionValue = [];
      if (data.every(item => item.select == true)) {
        regionLabel.push("全国");
        regionValue.push("all");
        //   this.dialogVisible = false;
      } else {
        data.map(area => {
          if (area.select) {
            // 如果此区域勾选 下面的省都在
            area.children.map(item => {
              regionLabel.push(item.label); // 添加的是省的label
            });
            regionValue.push(area.value); // 添加的是区域的value
          } else {
            // 如果此区域没有勾选 遍历省
            area.children.map(prionce => {
              // 如果此省勾选
              if (prionce.select) {
                regionLabel.push(prionce.label);
                regionValue.push(prionce.value);
              } else {
                // 如果此省没有勾选 遍历市
                prionce.children.map(city => {
                  if (city.select) {
                    regionLabel.push(city.label);
                    regionValue.push(city.value);
                  }
                });
              }
            });
          }
        });
      }

      this.regionLabel = regionLabel.join(",");
      this.regionValue = regionValue.join(",");
      this.dialogVisible = false;
    },

    // 通过regionValue设置regionData
    regionDataReset() {
      // 重置到原始数据
      this.regionData = JSON.parse(JSON.stringify(this.regionDataOrigin));
      if (this.regionValue) {
        if (this.regionValue == "all") {
          let e = true;
          this.handleCheckAllChange(e);
        } else {
          let regionArr = this.regionValue.split(",");
          regionArr.map(region => {
            this.regionData.find(area => {
              // 若区域中有匹配的value
              area.value == region ? (area.select = true) : "";
            });

            this.regionData.map(area => {
              // 如果此区域勾选 下面省市全部勾选
              if (area.select) {
                area.children.map(prionce => {
                  prionce.select = true;
                  prionce.selectNum = prionce.children.length;
                  prionce.children.map(city => {
                    city.select = true;
                  });
                });
              } else {
                // 如果此区域没有勾选
                area.children.find(prionce => {
                  // 若省中有匹配的value
                  if (prionce.value == region) {
                    prionce.select = true;
                    area.indeterminate = true;
                  }
                });
                // 否则 遍历省
                area.children.map(prionce => {
                  // 如果此省已勾选 将所有市勾选
                  if (prionce.select) {
                    prionce.selectNum = prionce.children.length;
                    prionce.children.map(city => {
                      city.select = true;
                    });
                  } else {
                    // 否则 匹配市
                    prionce.children.find(city => {
                      if (city.value == region) {
                        city.select = true;
                        prionce.indeterminate = true;
                        area.indeterminate = true;
                      }
                    });
                    let selectNum = 0;
                    prionce.children.map(city => {
                      if (city.select) {
                        selectNum++;
                      }
                    });
                    prionce.selectNum = selectNum;
                  }
                });
              }
            });
          });
        }
      } else {
        this.indeterminate = false;
        this.ischeckAll = false;
      }
    },
    selectAdress() {
      this.regionDataReset();
      this.dialogVisible = true;
    }
  },
  watch:{
	  myArray(value){
		  console.log(value)
	  }
  }
};
</script>

<style>
.area {
  width: 100%;
  display: flex;
}
.proince {
  display: flex;
  margin-left: 20px;
  flex-flow: row wrap;
}
.selection {
  margin: 10px;
}
</style>
