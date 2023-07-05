import Chart from 'chart.js/auto';
import { HttpClient } from './utils/http-client';

import { colors, chartsConfig } from './utils/utils';
import { base_url } from './environments/environment.prod';
import avances from './avances.json';

export class HomeChart {
  
    constructor() {
        console.log('contructor landing -------------------');
        this._http = new HttpClient();
        this.data;
        this.chart;
    }
    
    init(){
        this.data = avances;
        console.log('init landing -------------------',this.data);
        // this._http.get(`${base_url}/avances`).then(data => {
        //     this.data = data;
        //     console.log('data landing -------------------',data);
        //     if(data && data.success) {this.printTabs(this.data.lista)};
        // }).catch(error => {
        //     console.error('Error', error);
        // });
        if(this.data && this.data.success) {this.printTabs(this.data.lista)};
    }
    printTabs(tabList) {
        console.log('printTabs landing -------------------');
        const container = document.getElementById('graph_page');
        container.innerHTML = `
        <div class="fd-gris-fondo py-5">
          <div class="container">
            <div class="tabs-container">
              <nav class="tabs tab-main">
                <ul class="nav nav-tabs" id="MainTab" role="tablist"></ul>
              </nav>
            </div>
        
            <div class="tab-content" id="MainTabContent">
              <div aria-labelledby="tab-main" class="tab-pane fade show active" id="TabMain" role="tabpanel">
                <div class="row order-2 order-lg-1 cont-dest-tabs">
                  <div class="col-lg-3 col-xl-3">
                    <div class="tabs-container-sec">
                      <nav class="tabs tab-sec">
                        <ul class="nav nav-tabs" id="SecTab" role="tablist"></ul>
                      </nav>
                    </div>
                  </div>
        
                  <div class="col-lg-9 col-xl-9">
                    <div class="tab-content" id="SecTabContent">
                      <canvas id="tab-content-chart"></canvas>
                    </div>
                  </div>
                </div>
        
                <div class="dest-tabs order-1 order-lg-2">
                  <div>
                    <p>"Ya puede acceder al estudio definitivo del Barometro de febrero"</p>
                  </div>
                  <a href="#">Compartir</a>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        this.printMainTab(tabList)
      }
    
      printMainTab(tabList){
        let mainTab = document.getElementById('MainTab');
        tabList.forEach((tab, tabIndex) => {
          let tabItem = `<li class="nav-item"><button class="nav-link ${tabIndex == 0 ? 'active' : ''}" aria-controls="MainTab${tabIndex}" aria-selected="${tabIndex == 0 ? 'true' : 'false'}" data-bs-toggle="tab" id="${tabIndex}-tab-main" role="tab" type="button">${tab.titulo}</button></li>`;
          mainTab.insertAdjacentHTML('beforeend', tabItem);
          document.getElementById(`${tabIndex}-tab-main`).onclick = () => {
            this.printSecondTab(tab);
          }
        });
        this.printSecondTab(tabList[0]);
      }
    
      printSecondTab(tab){
        let secTab = document.getElementById(`SecTab`);
        secTab.innerHTML = '';
        tab.preguntas.forEach((question, questionIndex) => {
          let questionItem = `<li class="nav-item"><button class="nav-link ${questionIndex == 0 ? 'active' : ''}" aria-controls="TabSec${questionIndex}" aria-selected="${questionIndex == 0 ? 'true' : 'false'}" data-bs-toggle="tab" id="${questionIndex}-tab-sec" role="tab">${question.titulo}</button></li>`;
          secTab.insertAdjacentHTML('beforeend', questionItem);
          document.getElementById(`${questionIndex}-tab-sec`).onclick = () => {
            this.printChart(this.getParsedData(question))
          }
        });
        this.printChart(this.getParsedData(tab.preguntas[0]))
      }
    
      getParsedData(data) {
        console.log(data);
        const dataCopy = JSON.parse(JSON.stringify(data));
        // dataCopy = dataCopy.images = [];
        let result = JSON.parse(JSON.stringify(chartsConfig.find(config => config.id == data.widget)));
        dataCopy.categorias.forEach((cat, index) => {
          result.datasets[0].data.push(cat.valor);
          result.datasets[0].backgroundColor.push(cat.color ? cat.color : colors[index]);
          result.datasets[0].images.push(cat.logo);
          result.labels.push(cat.titulo)
        });
        console.log(result);
        return result;
      }
    
      // labelf(context) {
      //   console.log(context);
      //   var labelIndex = context.dataIndex;
      //   var labelValue = context.dataset.data[labelIndex];
      //   var labelText = context.label;
      //   return labelText + ': ' + labelValue;
      // }

      printLabel (data) {
        console.log('printLabel');
        let rgb = hexToRgb(data.dataset.backgroundColor[data.index]);
        let threshold = 140;
        let luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
        return luminance > threshold ? 'black' : 'white';
      }
    
      printChart(data){
        console.log(data)
        if(this.chart){this.chart.destroy()}
        this.chart = new Chart('tab-content-chart', {
          type: data.type,
          data: data,
            options: {
                indexAxis: data.axis,
                plugins: {
                title: {
                    display: true,
                    text: data.titulo,
                    position: 'top',
                    color: '#005767',
                    font: {size: 16}
                },
                legend: {
                    display: this.show_legend,
                    position: 'bottom',
                    //   labels: {
                    //     render: 'percentage',
                    //     fontColor: this.printLabel,
                    //     precision: 2
                    //   }
                }
            },
            responsive: true
          },
        });
      }
  
}