/**
 * This is the main entry point of the portlet.
 *
 * See https://tinyurl.com/js-ext-portlet-entry-point for the most recent 
 * information on the signature of this function.
 *
 * @param  {Object} params a hash with values of interest to the portlet
 * @return {void}
 */
import { HomeChart } from './home-chart'

export default function main({portletNamespace, contextPath, portletElementId}) {
    
    const node = document.getElementById(portletElementId);
    node.innerHTML =`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
        <div id="graph_page" class="cis-caja-tot"></div>
    `;
    // node.innerHTML =`
    //     <div id="graph_page"></div>
    // `;

    let graphic;
    graphic = new HomeChart();
    console.log('--------------   graphic.init() ---------- call');
    graphic.init();

}