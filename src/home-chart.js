import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { HttpClient } from './utils/http-client';

import { colors, chartsConfig } from './utils/utils';
import { base_url } from './environments/environment.prod';
// import avances from './avances.json';

export class HomeChart {
  
    constructor() {
        console.log('contructor landing -------------------');
        this._http = new HttpClient();
        this.data;
        this.chart;
        this.show_legend;
    }
    
    init(){
        // this.data = avances;
        console.log('init landing -------------------',this.data);
        this._http.get(`${base_url}/avances`).then(data => {
            this.data = data;
            console.log('data landing -------------------',data);
            if(data && data.success) {this.printTabs(this.data.lista)};
        }).catch(error => {
            console.error('Error', error);
        });
        // if(this.data && this.data.success) {this.printTabs(this.data.lista)};
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
            // const q = document.getElementById(`${questionIndex}-tab-sec`);
            // q.classList.add('active');
            this.printChart(this.getParsedData(question))
          }
        });
        this.printChart(this.getParsedData(tab.preguntas[0]))
      }
    
      getParsedData(data) {
        const dataCopy = JSON.parse(JSON.stringify(data));
        let result = JSON.parse(JSON.stringify(chartsConfig.find(config => config.id == data.widget)));
        this.show_legend = (result.type === 'bar');
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

    //   formatter: function(value, context) {
    //     var logoUrl = 'ruta-imatge.png';  // Ruta de la imatge del logo
    //     var label = context.chart.data.labels[context.dataIndex];  // Etiqueta de la dada actual
    //     return '<img src="' + logoUrl + '"> ' + label;
    //   },

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
        } : null;
    }

      printLabel (data) {
        let  rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.dataset.backgroundColor[data.dataIndex]);
        rgb ? {r: parseInt(rgb[1], 16), g: parseInt(rgb[2], 16), b: parseInt(rgb[3], 16)} : null;
        let threshold = 140;
        let luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
        return luminance > threshold ? 'black' : 'white';
      }
    
      printChart(data){
        const ctx = document.getElementById('tab-content-chart');
        if(this.chart){this.chart.destroy()}
        // this.chart = new Chart('tab-content-chart', { // no hace falta ctx
        this.chart = new Chart(ctx, {
          plugins: [ChartDataLabels],
          type: data.type,
          data: data,
            options: {
                indexAxis: data.axis,
                plugins: {
                datalabels: {
                    align: 'center', // center , start, end , right , left , bottom , top
                    anchor: 'center',   //center , start, end
                    // color: function(context) {
                    //     return '#FFF';
                    // //   return context.dataset.backgroundColor;
                    // },
                    color: this.printLabel,
                    font: function(context) {
                      var w = context.chart.width;
                      return {
                        size: w < 512 ? 12 : 14,
                        weight: 'bold',
                      };
                    },
                    formatter: function(value, context) {
                      return context.chart.data.labels[context.dataIndex];
                    }
                },
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
                }
            },
            responsive: true
          },
        });
      }
  
}