(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-fa1bc980"],{"86df":function(t,a,e){"use strict";e.r(a);var i=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"chart-container"},[e("bar-chart",{attrs:{height:"100%",width:"100%",data:t.data,title:t.title,"y-max":t.yMax,"data-axis":t.dataAxis}})],1)},r=[],n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{class:t.className,style:{height:t.height,width:t.width},attrs:{id:t.id,data:t.data,title:t.title,yMax:t.yMax,"data-axis":t.dataAxis}})},s=[],o=(e("c5f6"),e("313e")),c=e.n(o),f=e("a704"),h={name:"BarChart",mixins:[f["a"]],props:{data:{type:Array,default:function(){return[]}},dataAxis:{type:Array,default:function(){return[]}},yMax:{type:Number,default:500},title:{type:String,default:"柱状图：渐变色 阴影 点击缩放"},className:{type:String,default:"chart"},id:{type:String,default:"chart"},width:{type:String,default:"200px"},height:{type:String,default:"200px"}},data:function(){return{chart:null}},watch:{data:function(){this.initChart()}},mounted:function(){this.initChart()},beforeDestroy:function(){this.chart&&(this.chart.dispose(),this.chart=null)},methods:{initChart:function(){var t=this;this.chart=c.a.init(document.getElementById(this.id));var a=500,e=this.data.map(function(t){return a});this.chart.setOption({title:{text:this.title,subtext:"Bar Chart: Gradient Color, Shadow, Click Zoom"},xAxis:{data:this.dataAxis,axisLabel:{inside:!0,textStyle:{color:"#fff"}},axisTick:{show:!1},axisLine:{show:!1},z:10},yAxis:{axisLine:{show:!1},axisTick:{show:!1},axisLabel:{textStyle:{color:"#999"}}},dataZoom:[{type:"inside"}],series:[{type:"bar",itemStyle:{normal:{color:"rgba(0,0,0,0.05)"}},barGap:"-100%",barCategoryGap:"40%",data:e,animation:!1},{type:"bar",itemStyle:{normal:{color:new c.a.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#83bff6"},{offset:.5,color:"#188df0"},{offset:1,color:"#188df0"}])},emphasis:{color:new c.a.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#2378f7"},{offset:.7,color:"#2378f7"},{offset:1,color:"#83bff6"}])}},data:this.data}]});var i=6;this.chart.on("click",function(a){t.chart.dispatchAction({type:"dataZoom",startValue:t.dataAxis[Math.max(a.dataIndex-i/2,0)],endValue:t.dataAxis[Math.min(a.dataIndex+i/2,t.data.length-1)]})})}}},d=h,u=e("2877"),l=Object(u["a"])(d,n,s,!1,null,null,null),p=l.exports,x={name:"BarChartDemo",components:{BarChart:p},data:function(){return{data:[220,182,191,234,290,330,310,123,442,321,90,149,210,122,133,334,198,123,125,220],dataAxis:["点","击","柱","子","或","者","两","指","在","触","屏","上","滑","动","能","够","自","动","缩","放"],title:"柱状图：渐变色 阴影 点击缩放",yMax:1e3}}},m=x,y=(e("d1b9"),Object(u["a"])(m,i,r,!1,null,"2c58b4a2",null));a["default"]=y.exports},a704:function(t,a,e){"use strict";var i=e("2ef0"),r=e.n(i);a["a"]={data:function(){return{$_sidebarEle:null}},computed:{$_chartMixin_chartResize:function(){var t=this;return r.a.throttle(function(){t.chart&&t.chart.resize()},200)},sidebar:function(){return this.$store.state.app.sidebar.opened}},watch:{sidebar:function(t){var a=this;setTimeout(function(){a.chart.resize()},280)}},methods:{$_chartMixin_initResizeEvent:function(){window.addEventListener("resize",this.$_chartMixin_chartResize)},$_chartMixin_destroyResizeEvent:function(){window.removeEventListener("resize",this.$_chartMixin_chartResize)}},mounted:function(){this.$_chartMixin_initResizeEvent()},beforDestroy:function(){this.$_chartMixin_destroyResizeEvent()},activated:function(){this.chart.resize(),this.$_chartMixin_initResizeEvent()},deactivated:function(){this.$_chartMixin_destroyResizeEvent()}}},a73a:function(t,a,e){},aa77:function(t,a,e){var i=e("5ca1"),r=e("be13"),n=e("79e5"),s=e("fdef"),o="["+s+"]",c="​",f=RegExp("^"+o+o+"*"),h=RegExp(o+o+"*$"),d=function(t,a,e){var r={},o=n(function(){return!!s[t]()||c[t]()!=c}),f=r[t]=o?a(u):s[t];e&&(r[e]=f),i(i.P+i.F*o,"String",r)},u=d.trim=function(t,a){return t=String(r(t)),1&a&&(t=t.replace(f,"")),2&a&&(t=t.replace(h,"")),t};t.exports=d},c5f6:function(t,a,e){"use strict";var i=e("7726"),r=e("69a8"),n=e("2d95"),s=e("5dbc"),o=e("6a99"),c=e("79e5"),f=e("9093").f,h=e("11e9").f,d=e("86cc").f,u=e("aa77").trim,l="Number",p=i[l],x=p,m=p.prototype,y=n(e("2aeb")(m))==l,b="trim"in String.prototype,v=function(t){var a=o(t,!1);if("string"==typeof a&&a.length>2){a=b?a.trim():u(a,3);var e,i,r,n=a.charCodeAt(0);if(43===n||45===n){if(e=a.charCodeAt(2),88===e||120===e)return NaN}else if(48===n){switch(a.charCodeAt(1)){case 66:case 98:i=2,r=49;break;case 79:case 111:i=8,r=55;break;default:return+a}for(var s,c=a.slice(2),f=0,h=c.length;f<h;f++)if(s=c.charCodeAt(f),s<48||s>r)return NaN;return parseInt(c,i)}}return+a};if(!p(" 0o1")||!p("0b1")||p("+0x1")){p=function(t){var a=arguments.length<1?0:t,e=this;return e instanceof p&&(y?c(function(){m.valueOf.call(e)}):n(e)!=l)?s(new x(v(a)),e,p):v(a)};for(var _,g=e("9e1e")?f(x):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),E=0;g.length>E;E++)r(x,_=g[E])&&!r(p,_)&&d(p,_,h(x,_));p.prototype=m,m.constructor=p,e("2aba")(i,l,p)}},d1b9:function(t,a,e){"use strict";var i=e("a73a"),r=e.n(i);r.a},fdef:function(t,a){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);