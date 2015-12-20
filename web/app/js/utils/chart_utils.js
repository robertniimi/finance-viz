import nv from 'nvd3';
import d3 from 'd3';

(function() {
  let renderStackedAreaChart = function(selector, data, options) {
    nv.addGraph(function() {
      var chart = nv.models.stackedAreaChart()
        .x(function(d) { return new Date(d.date); })
        .y(function(d) { return d.amount; });

      _.forEach(options, (optionValue, optionKey) => {
        chart[optionKey](optionValue);
      });

      let tickMarks = _.map(data[0].values, (valueObj, idx) => {
        return new Date(valueObj.date);
      });

      let interpolation = d3.svg.line()
        .interpolate('cardinal')
        .tension(0.875);

      chart.interpolate(function(points) {
        return interpolation(points).substring(1);
      });

      chart.xAxis
        .tickValues(tickMarks)
        .tickFormat(function(d) {
          return d3.time.format('%b %Y')(new Date(d));
        });

      chart.yAxis
        .tickFormat(function(d) {
          return ('$' + d3.format(',.0f')(d));
        });

      // chart.height(500);
      d3.select(selector)
        .datum(data)
        .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  };

  module.exports = {
    renderStackedAreaChart: renderStackedAreaChart
  };
})();
