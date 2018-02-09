# echarts
表示图表数据是前端很常见的一个需求, 可以直接使用SVG或者Canvas实现，通常情况下，都是采用第三方开源库来实现这个问题，最常见的有 echarts. (http://echarts.baidu.com/index.html)

详细的使用方法，请参见官方文档.

总体调用方式很简单: 
    1. let chart = echarts.init(DOM Element); 
    2. let option = {}; 
    3. chart.setOptions(option);

复杂地方在于配置这个option，以及option里面各个参数的含义.








