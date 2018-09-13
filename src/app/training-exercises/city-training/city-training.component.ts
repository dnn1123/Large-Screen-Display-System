import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {Urls} from '../../shared/model/model.url';
declare var echarts: any;
declare var $: any;

@Component({
  selector: 'app-city-training',
  templateUrl: './city-training.component.html',
  styleUrls: ['./city-training.component.css']
})
export class CityTrainingComponent implements OnInit {
  mapLoaded = false;
  private  urls = Urls;
  private geoCoordMap = {
    '丹东市': [124.521, 40.4242],
    '大连市': [122.2009, 39.4409],
    '沈阳市': [123.1238, 42.1216],
    '营口市': [122.4316, 40.4297],
    '葫芦岛市': [120.1575, 40.578],
    '鞍山市': [122.85, 40.82],
    '抚顺市': [123.97, 41.67],
    '本溪市': [123.93, 41.3],
    '朝阳市':	[120.42, 41.58],
    '阜新市': [121.65, 42],
    '辽阳市': [123.17, 41.28],
    '铁岭市': [123.85, 42.32],
    '盘锦市': [122.07, 41.12],
    '锦州市': [121.15, 41.13],

  };
  private data = [
    {name: '沈阳市', value: '100'},  // value值为不包括百分号的上交进度，实际值应为100%
    {name: '大连市', value: '85'},
    {name: '鞍山市', value: '100'},
    {name: '抚顺市', value: '50'},
    {name: '本溪市', value: '80'},
    {name: '丹东市', value: '90'},
    {name: '盘锦市', value: '100'},
    {name: '营口市', value: '50'},
    {name: '葫芦岛市', value: '60'},
    {name: '朝阳市', value: '100'},
    {name: '阜新市', value: '88'},
    {name: '辽阳市', value: '90'},
    {name: '铁岭市', value: '90'},
    {name: '锦州市', value: '95'},
  ];
  private data1 = [
    {name: '沈阳市', value: ['和平区','浑南区','皇姑区','沈河区','大东区','铁西区','苏家屯区','沈北新区','于洪区','辽中区','新民市','康平县','法库县']},
    {name: '大连市', value: ['中山区','西岗区','沙河口区','甘井子区','旅顺口区','金州区','普兰店区','瓦房店市','庄河市','长海县']},
    {name: '鞍山市', value: ['铁东区','铁西区','立山区','千山区','海城市','台安县','岫岩满族自治县']},
    {name: '抚顺市', value: ['新抚区','顺城区','望花区','东洲区','抚顺县','新宾满族自治县','清原满族自治县']},
    {name: '本溪市', value: ['平山区','溪湖区','明山区','南芬区','本溪满族自治县','桓仁满族自治县']},
    {name: '丹东市', value: ['元宝区','振兴区','振安区','东港市','凤城市','宽甸满族自治县']},
    {name: '盘锦市', value: [	'双台子区','兴隆台区','大洼区','盘山县']},
    {name: '营口市', value: ['站前区','西市区','鲅鱼圈区','老边区','盖州市','大石桥市']},
    {name: '葫芦岛市', value: ['连山区','龙港区','南票区','兴城市','绥中县','建昌县']},
    {name: '朝阳市', value: ['双塔区','龙城区','北票市','凌源市','朝阳县','建平县','喀喇沁左翼蒙古族自治县']},
    {name: '阜新市', value: ['海州区','新邱区','太平区','清河门区','细河区','阜新蒙古族自治县','彰武县']},
    {name: '辽阳市', value: ['白塔区','文圣区','宏伟区','弓长岭区','太子河区','灯塔市','辽阳县']},
    {name: '铁岭市', value: ['银州区','清河区','调兵山市','开原市','铁岭县','昌图县','西丰县']},
    {name: '锦州市', value: ['古塔区','凌河区','太和区','凌海市','北镇市','黑山县','义县]']},
  ];
  private selected = '选择地区'; // 下拉框显示内容
  private title = '沈阳市最新应急演练计划'; // 文件栏标题
  private selected_city = '沈阳市';
  private selecteddata = ['和平区','浑南区','皇姑区','沈河区','大东区','铁西区','苏家屯区','沈北新区','于洪区','辽中区','新民市','康平县','法库县'];
  private commited = ['和平区', '浑南区', '皇姑区', '沈河区' , '大东区', '铁西区' , '苏家屯区', '沈北新区' , '于洪区', '辽中区', '新民市', '康平县', '法库县'];        // 已上交区县列表
  private uncommited = ['全部上交'];      // 未上交区县列表
  private option = {};
  private bar_option = {};
  convertData = function (data) {
    const res = [];
    for (let i = 0; i < data.length; i++) {
      const geoCoord = this.geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value)
        });
      }
    }
    return res;
  };
  // 获取上交结果
  GetResultList = function(city): any {
    const params = {
      'city': city
    };
    const data = this.http.get(this.urls.GetResultList, {params: params})
      .toPromise()
      .then(response => response.json());
    return data;
  };
  constructor(private http: Http, private httpClient: HttpClient) { }

  ngOnInit() {
    // $.getScript('./assets/js/display_map.js');
    this.httpClient.get('assets/json/liaoning.json').subscribe(geoJson => {
      this.mapLoaded = true;
      echarts.registerMap('liaoning', geoJson);
      this.option = {
        backgroundColor: 'transparent',
        title: {
          top: 10,
          text: '“培训演练计划”上交情况',
          x: 'center',
          textStyle: {
            color: '#ccc',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
              return params.name + '上交情况: ' + params.data['value'] + '%';
          },
        },
        visualMap: {
          show: false,
          min: 0,
          max: 100,
          left: 'left',
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true,
          seriesIndex: [1],
          inRange: {
            color: ['#e0ffff', '#006edd'],
          }
        },
        geo: {
          show: true,
          map: 'liaoning',
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            }
          },
          roam: true,
          zoom: 0.9,
          top: 20,
          itemStyle: {
            normal: {
              areaColor: 'transparent',
              borderColor: '#3fdaff',
              borderWidth: 1,
              shadowColor: 'rgba(63, 218, 255, 0.5)',
              shadowBlur: 30
            },
            emphasis: {
              areaColor: '#2B91B7',
            }
          }
        },
        series : [
          {
            name: 'light',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: this.convertData(this.data),
            symbolSize: function (val) {
              const num = <number>val[2];
              return num / 8;
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: function (val) {
                  const num = <number>val.data.value[2]
                  if (num < 100) {
                    return '#FF3D00';
                  } else {
                    return '#4AFF96';
                  }
                },
              }
            }
          },
          {
            type: 'map',
            map: 'liaoning',
            geoIndex: 0,
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#FFFFFF',
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: true,
            data: this.data
          },
          ]
      };
    });
    this.bar_option = {
      backgroundColor: 'transparent',
      title: {
        text: this.selected_city + '计划上交进度',
        x: 'center',
        top: 10,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 20,
          color: '#fff',
        }
      },
      xAxis: {
        max: 50,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: [
        {
          type: 'category',
          inverse: false,
          data: [],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          }
        }
      ],
      "series": [
        {
          "type": "pictorialBar",
          "symbol": "image://data:image/png;base64,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",
          "symbolRepeat": true,
          "symbolMargin": 20,
          "symbolClip": true,
          "symbolSize": 70,
          "symbolPosition": "start",
          "symbolBoundingData":50,
          "data": [40],
          "z": 10
        },
        {
          "type": "pictorialBar",
          "label": {
            "normal": {
              "show": false
            }
          },
          "symbolRepeat": true,
          "symbolMargin": 20,
          "symbol": "image://data:image/png;base64,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",
          "symbolSize": 70,
          "symbolBoundingData": 50,
          "symbolPosition": "start",
          "data": [50],
          "z": 5
        }
      ]
    };
  }
  onChartClick(params) {
    this.selected = params.name;
    this.selected_city = params.name;
    this.GetResultList(this.selected).then(r => {
      this.commited = r.commited_list;
      this.uncommited = r.uncommited_list;
      this.title = params.name + '最新应急演练计划';
      for (const i of this.data1) {
        if (i.name === this.selected) {
          this.selecteddata = i.value;
        }
      }
      let num = <number>params.data.value;
      num = num / 2;
      this.bar_option = {
      backgroundColor: 'transparent',
      title: {
        text: params.name + '计划上交进度',
        x: 'center',
        top: 10,
        textStyle: {
          fontWeight: 'normal',
          fontSize: 20,
          color: '#fff',
        }
      },
      "xAxis": {
        max: 50,
        "splitLine": {
          "show": false
        },
        "axisLine": {
          "show": false
        },
        "axisLabel": {
          "show": false
        },
        "axisTick": {
          "show": false
        }
      },
      "yAxis": [
        {
          "type": "category",
          "inverse": false,
          "data": [],
          "axisLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "axisLabel": {
            "show": false
          }
        }
      ],
      series: [
        {
          "type": "pictorialBar",
          "symbol": "image://data:image/png;base64,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",
          "symbolRepeat": true,
          "symbolMargin": 20,
          "symbolClip": true,
          "symbolSize": 70,
          "symbolPosition": "start",
          "symbolBoundingData": 50,
          "data": [num],
          "z": 10
        },
        {
          "type": "pictorialBar",
          "label": {
            "normal": {
              "show": false
            }
          },
          "symbolRepeat": true,
          "symbolMargin": 20,
          "symbol": "image://data:image/png;base64,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",
          "symbolSize": 70,
          "symbolBoundingData": 50,
          "symbolPosition": "start",
          "data": [50],
          "z": 5
        }
      ]
    };
  });
  }
  choosetown(town) {
    this.selected = town;
  }
  click() {
    window.open('http://localhost:4200/src/assets/pdf/yl.pdf');
  }
  unclick() {
    alert('该地区尚未上交演练计划');
  }
}
