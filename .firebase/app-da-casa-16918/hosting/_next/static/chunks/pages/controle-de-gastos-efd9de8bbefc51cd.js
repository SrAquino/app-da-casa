(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[310],{8682:(e,t,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/controle-de-gastos",function(){return s(5004)}])},8636:(e,t,s)=>{"use strict";s.d(t,{A:()=>i});var a=s(4848),n=s(6540),o=s(1106),r=s.n(o),l=s(3914),d=s(2490),c=s.n(d);let i=()=>{let[e,t]=(0,n.useState)(!1);return(0,a.jsxs)("div",{className:"".concat(c().sidebar," ").concat(e?c().expanded:c().collapsed),children:[(0,a.jsx)("button",{onClick:()=>{t(!e)},className:c().toggleButton,children:e?"Esconder":(0,a.jsx)(l.OXb,{})}),(0,a.jsx)("h2",{children:"Menu"}),(0,a.jsxs)("ul",{children:[(0,a.jsx)("li",{children:(0,a.jsx)(r(),{href:"/controle-de-gastos",children:e?"Controle de Gastos":(0,a.jsx)(l.MxO,{})})}),(0,a.jsx)("li",{children:(0,a.jsx)(r(),{href:"/analise-gastos",children:e?"Gr\xe1ficos":(0,a.jsx)(l.qvi,{})})}),(0,a.jsx)("li",{children:(0,a.jsx)(r(),{href:"/lista-de-compras",children:e?"Lista de Compras":(0,a.jsx)(l.AsH,{})})}),(0,a.jsx)("li",{children:(0,a.jsx)(r(),{href:"/analise-mercado",children:e?"Pre\xe7os de mercado":(0,a.jsx)(l.qvi,{})})})]})]})}},5004:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i});var a=s(4848),n=s(6540),o=s(8636),r=s(7525),l=s(7400),d=s(3518),c=s.n(d);let i=()=>{let[e,t]=(0,n.useState)([]),[s,d]=(0,n.useState)([]),[i,u]=(0,n.useState)({date:"",value:"",category:"",description:""}),[h,x]=(0,n.useState)(""),[p,_]=(0,n.useState)(""),{user:j}=(0,l.A)();(0,n.useEffect)(()=>{if((0,r.lo)().then(e=>t(e)).catch(e=>console.error("Error fetching users:",e)),h){let[e,t]=h.split("-"),s="".concat(t).concat(e);(0,r.ck)(s).then(e=>d(e)).catch(e=>console.error("Error fetching expenses:",e))}},[h]);let g=h?(e=>{let[t,s]=e.split("-");return new Date(t,s,0).getDate()})(h):0,v=s.filter(e=>e.user===p),m=v.reduce((e,t)=>e+parseFloat(t.value),0),b=[...new Set(s.map(e=>e.user))];return(0,a.jsxs)("div",{className:c().container,children:[(0,a.jsx)(o.A,{}),(0,a.jsxs)("div",{className:c().content,children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{children:"Controle de Gastos"}),j?(0,a.jsxs)("p",{children:["Bem-vindo, ",j.email,"!"]}):(0,a.jsx)("p",{children:"Usu\xe1rio n\xe3o autenticado."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{htmlFor:"month",children:"Selecione o m\xeas:"}),(0,a.jsx)("input",{type:"month",id:"month",value:h,onChange:e=>x(e.target.value),className:c().input})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{htmlFor:"user",children:"Selecione o usu\xe1rio:"}),(0,a.jsxs)("select",{id:"user",value:p,onChange:e=>_(e.target.value),className:c().input,children:[(0,a.jsx)("option",{value:"",children:"Selecione um usu\xe1rio"}),b.map(t=>{var s;return(0,a.jsx)("option",{value:t,children:(null===(s=e.find(e=>e.email.split("@")[0]===t))||void 0===s?void 0:s.name)||t},t)})]})]}),p&&(0,a.jsxs)("div",{className:c().userTable,children:[(0,a.jsxs)("h2",{children:["Gastos de ",p]}),(0,a.jsxs)("table",{className:c().table,children:[(0,a.jsx)("thead",{children:(0,a.jsxs)("tr",{children:[(0,a.jsx)("th",{children:"Dia"})," ",(0,a.jsx)("th",{children:"Gasto"}),(0,a.jsx)("th",{children:"Categoria"}),(0,a.jsx)("th",{children:"Descri\xe7\xe3o"})]})}),(0,a.jsxs)("tbody",{children:[Array.from({length:g},(e,t)=>{let s="".concat(h,"-").concat(String(t+1).padStart(2,"0")),n=v.filter(e=>e.date===s),o=n.reduce((e,t)=>e+parseFloat(t.value),0);return(0,a.jsxs)("tr",{className:t%2==0?c().evenRow:c().oddRow,children:[(0,a.jsx)("td",{children:String(t+1).padStart(2,"0")})," ",(0,a.jsx)("td",{children:o}),(0,a.jsx)("td",{children:n.map(e=>(0,a.jsx)("div",{children:e.category},e.id))}),(0,a.jsx)("td",{children:n.map(e=>(0,a.jsx)("div",{children:e.description},e.id))})]},s)}),(0,a.jsxs)("tr",{className:c().totalRow,children:[(0,a.jsx)("td",{children:"Total"}),(0,a.jsx)("td",{children:m}),(0,a.jsx)("td",{}),(0,a.jsx)("td",{})]})]})]})]}),(0,a.jsxs)("div",{className:c().addExpense,children:[(0,a.jsx)("h2",{children:"Adicionar Gasto"}),(0,a.jsx)("input",{type:"date",value:i.date,onChange:e=>u({...i,date:e.target.value}),className:c().input}),(0,a.jsx)("input",{type:"number",value:i.value,onChange:e=>u({...i,value:e.target.value}),placeholder:"Valor",className:c().input}),(0,a.jsxs)("select",{value:i.category,onChange:e=>u({...i,category:e.target.value}),className:c().input,children:[(0,a.jsx)("option",{value:"",children:"Selecione uma categoria"}),["Mercado","A\xe7ougue","Padaria","Horti","Pet","Contas","Lazer","Transporte","Outros","Rela\xe7\xe3o passada"].map(e=>(0,a.jsx)("option",{value:e,children:e},e))]}),(0,a.jsx)("input",{type:"text",value:i.description,onChange:e=>u({...i,description:e.target.value}),placeholder:"Descri\xe7\xe3o (opcional)",className:c().input}),(0,a.jsx)("button",{onClick:()=>{if(!i.date||!i.value||!i.category)return;let e=j.email.split("@")[0],[t,a]=i.date.split("-"),n={...i,user:e};(0,r.k5)(n,"".concat(a).concat(t)).then(e=>{d([...s,e]),u({date:"",value:"",category:"",description:""})}).catch(e=>console.error("Error adding expense:",e))},className:c().button,children:"Adicionar"})]})]})]})}},2490:e=>{e.exports={sidebar:"Sidebar_sidebar__HYpoR",collapsed:"Sidebar_collapsed__jq1k3",toggleButton:"Sidebar_toggleButton__u5PL9",expanded:"Sidebar_expanded__t69bD"}},3518:e=>{e.exports={container:"controle-de-gastos_container___TxTf",content:"controle-de-gastos_content__XGCXu",expensesContainer:"controle-de-gastos_expensesContainer__lhM5_",userColumn:"controle-de-gastos_userColumn__2UTV2",expensesList:"controle-de-gastos_expensesList__tAMrd",expenseItem:"controle-de-gastos_expenseItem__q6LsB",addExpense:"controle-de-gastos_addExpense__vIbMo",input:"controle-de-gastos_input__ohXk3",select:"controle-de-gastos_select__C0v_g",button:"controle-de-gastos_button__Eg2uy",table:"controle-de-gastos_table__WHyKK",evenRow:"controle-de-gastos_evenRow__pmrrJ",oddRow:"controle-de-gastos_oddRow__J93qe",totalRow:"controle-de-gastos_totalRow__P9J4d"}}},e=>{var t=t=>e(e.s=t);e.O(0,[563,705,636,593,792],()=>t(8682)),_N_E=e.O()}]);