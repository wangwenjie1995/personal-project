(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bfea4fe4"],{2017:function(e,s,t){"use strict";var o=t("b12d"),n=t.n(o);n.a},"4b57":function(e,s,t){},"9ed6":function(e,s,t){"use strict";t.r(s);var o=function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("div",{staticClass:"login-container"},[e._m(0),e._v(" "),t("div",{staticClass:"login-forms"},[t("div",{staticClass:"login-form-content"},[t("div",{staticClass:"login-form-content__sidebox login-form-contetn__sidebox-left"}),e._v(" "),t("div",{staticClass:"login-form-content__sidebox"},[t("h2",{staticStyle:{margin:"0 0 40px"}},[e._v("登录")]),e._v(" "),t("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:e.loginForm,rules:e.loginRules,"auto-complete":"on","label-position":"left"}},[t("el-form-item",{attrs:{prop:"username"}},[t("span",{staticClass:"svg-container"},[t("svg-icon",{attrs:{"icon-class":"user"}})],1),e._v(" "),t("el-input",{ref:"username",attrs:{placeholder:"Username",name:"username",type:"text",tabindex:"1","auto-complete":"on"},model:{value:e.loginForm.username,callback:function(s){e.$set(e.loginForm,"username",s)},expression:"loginForm.username"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"password"}},[t("span",{staticClass:"svg-container"},[t("svg-icon",{attrs:{"icon-class":"password"}})],1),e._v(" "),t("el-input",{key:e.passwordType,ref:"password",attrs:{type:e.passwordType,placeholder:"Password",name:"password",tabindex:"2","auto-complete":"on"},nativeOn:{keyup:function(s){return!s.type.indexOf("key")&&e._k(s.keyCode,"enter",13,s.key,"Enter")?null:e.handleLogin(s)}},model:{value:e.loginForm.password,callback:function(s){e.$set(e.loginForm,"password",s)},expression:"loginForm.password"}}),e._v(" "),t("span",{staticClass:"show-pwd",on:{click:e.showPwd}},[t("svg-icon",{attrs:{"icon-class":"password"===e.passwordType?"eye":"eye-open"}})],1)],1),e._v(" "),t("div",{staticClass:"login-way"},[t("div",{staticClass:"remember-pwd"},[t("el-checkbox",{model:{value:e.loginForm.isRememberPwd,callback:function(s){e.$set(e.loginForm,"isRememberPwd",s)},expression:"loginForm.isRememberPwd"}},[e._v("记住密码")])],1),e._v(" "),t("div",{staticClass:"login__toggle-btn"},[t("a",{attrs:{href:"javascript:void(0);"}},[e._v("短信验证登录")])])]),e._v(" "),t("el-button",{staticStyle:{width:"100%","margin-bottom":"30px",background:"#fe7300","border-color":"#fe7300"},attrs:{loading:e.loading,type:"primary"},nativeOn:{click:function(s){return s.preventDefault(),e.handleLogin(s)}}},[e._v("Login")]),e._v(" "),t("div",{staticClass:"tips"},[t("span",{staticStyle:{"margin-right":"20px"}},[e._v("username: admin")]),e._v(" "),t("span",[e._v(" password: any")])])],1)],1)])])])},n=[function(){var e=this,s=e.$createElement,o=e._self._c||s;return o("div",{staticClass:"login-header"},[o("img",{attrs:{src:t("d93d"),alt:"logo"}})])}],r=t("61f7"),a={name:"Login",data:function(){var e=function(e,s,t){Object(r["b"])(s)?t():t(new Error("Please enter the correct user name"))},s=function(e,s,t){s.length<6?t(new Error("The password can not be less than 6 digits")):t()};return{loginForm:{username:"admin",password:"111111",isRememberPwd:!0},loginRules:{username:[{required:!0,trigger:"blur",validator:e}],password:[{required:!0,trigger:"blur",validator:s}]},loading:!1,passwordType:"password",redirect:void 0}},watch:{$route:{handler:function(e){this.redirect=e.query&&e.query.redirect},immediate:!0}},methods:{showPwd:function(){var e=this;"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick(function(){e.$refs.password.focus()})},handleLogin:function(){var e=this;this.$refs.loginForm.validate(function(s){if(!s)return console.log("error submit!!"),!1;e.loading=!0,e.$store.dispatch("user/login",e.loginForm).then(function(){e.$router.push({path:e.redirect||"/"}),e.loading=!1}).catch(function(){e.loading=!1})})}}},i=a,l=(t("2017"),t("f45c"),t("2877")),c=Object(l["a"])(i,o,n,!1,null,"45918a7c",null);s["default"]=c.exports},b12d:function(e,s,t){},d93d:function(e,s,t){e.exports=t.p+"static/img/logo.3b774822.png"},f45c:function(e,s,t){"use strict";var o=t("4b57"),n=t.n(o);n.a}}]);