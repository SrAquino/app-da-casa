(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[270],{6374:(e,a,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/moedas-da-casa",function(){return s(1156)}])},7867:(e,a,s)=>{"use strict";s.d(a,{A:()=>l});var t=s(4848),d=s(6540),n=s(6424),r=s(7400);let l=e=>{let{children:a}=e,{user:s,loading:l}=(0,r.A)(),i=(0,n.useRouter)();return((0,d.useEffect)(()=>{l||s||i.push("/")},[s,l,i]),l)?(0,t.jsx)("div",{children:"Loading..."}):a}},8636:(e,a,s)=>{"use strict";s.d(a,{A:()=>o});var t=s(4848),d=s(6540),n=s(1106),r=s.n(n),l=s(3914),i=s(2490),c=s.n(i);let o=()=>{let[e,a]=(0,d.useState)(!1);return(0,t.jsxs)("div",{className:"".concat(c().sidebar," ").concat(e?c().expanded:c().collapsed),children:[(0,t.jsx)("button",{onClick:()=>{a(!e)},className:c().toggleButton,children:e?"Esconder":(0,t.jsx)(l.OXb,{})}),(0,t.jsx)("h2",{children:"Menu"}),(0,t.jsxs)("ul",{children:[(0,t.jsx)("li",{children:(0,t.jsx)(r(),{href:"/controle-de-gastos",children:e?"Controle de Gastos":(0,t.jsx)(l.MxO,{})})}),(0,t.jsx)("li",{children:(0,t.jsx)(r(),{href:"/analise-gastos",children:e?"Gr\xe1ficos":(0,t.jsx)(l.qvi,{})})}),(0,t.jsx)("li",{children:(0,t.jsx)(r(),{href:"/lista-de-compras",children:e?"Lista de Compras":(0,t.jsx)(l.AsH,{})})}),(0,t.jsx)("li",{children:(0,t.jsx)(r(),{href:"/analise-mercado",children:e?"Pre\xe7os de mercado":(0,t.jsx)(l.qvi,{})})}),(0,t.jsx)("li",{children:(0,t.jsx)(r(),{href:"/moedas-da-casa",children:e?"Moedas da Casa":(0,t.jsx)(l.cEG,{})})}),(0,t.jsx)("li",{children:(0,t.jsx)(r(),{href:"/academia",children:e?"Academia":(0,t.jsx)(l.bB,{})})})]})]})}},1156:(e,a,s)=>{"use strict";s.r(a),s.d(a,{default:()=>h});var t=s(4848),d=s(6540),n=s(8636),r=s(7867),l=s(7794),i=s(7400),c=s(6614),o=s.n(c);let h=()=>{let{user:e}=(0,i.A)(),[a,s]=(0,d.useState)([]),[c,h]=(0,d.useState)({date:new Date().toISOString().split("T")[0],type:"",value:""}),[u,x]=(0,d.useState)(new Date().toISOString().slice(0,7)),[j,p]=(0,d.useState)(e?e.email.split("@")[0]:""),m=["\uD83C\uDFCB\uD83C\uDFFB","\uD83C\uDF9F","\uD83C\uDFA8","\uD83C\uDF77","\uD83D\uDCB0","\uD83E\uDD47","❤‍","\uD83C\uDF00","\uD83D\uDCCC"];(0,d.useEffect)(()=>{A()},[u]);let _=(t,d)=>{if(!c.date||!t||!d)return;let n=e.email.split("@")[0],[r,i]=c.date.split("-"),o={date:c.date,type:t,value:d,user:n};(0,l.XZ)(o,"coins_".concat(i).concat(r)).then(e=>{s([...a,e]),C(m.reduce((e,a)=>(e[a]={add:"",spend:""},e),{})),A()}).catch(e=>console.error("Error adding coin:",e))},v=(t,d)=>{let n=e.email.split("@")[0],[r,i]=c.date.split("-"),o={date:c.date,type:t,value:-d,user:n};if(w[t]-d<0){alert("N\xe3o \xe9 poss\xedvel gastar mais moedas do que o total dispon\xedvel para ".concat(t,"."));return}(0,l.XZ)(o,"coins_".concat(i).concat(r)).then(e=>{s([...a,e]),C(m.reduce((e,a)=>(e[a]={add:"",spend:""},e),{})),A()}).catch(e=>console.error("Error spending coin:",e))},b=(e,t)=>{window.confirm("Voc\xea tem certeza que deseja excluir este registro?")&&(0,l.x7)(e,t).then(()=>{s(a.filter(a=>a.id!==e))}).catch(e=>console.error("Error deleting coin:",e))},g=u?(e=>{let[a,s]=e.split("-");return new Date(a,s,0).getDate()})(u):0,f=a.filter(e=>e.user===j),N=[...new Set(a.map(e=>e.user))],w=m.reduce((e,a)=>(e[a]=f.filter(e=>e.type===a).reduce((e,a)=>e+parseFloat(a.value),0),e),{}),[S,C]=(0,d.useState)(m.reduce((e,a)=>(e[a]={add:"",spend:""},e),{})),E=(e,a,s)=>{C({...S,[e]:{...S[e],[a]:s}})},A=()=>{if(u){let[e,a]=u.split("-"),t="coins_".concat(a).concat(e);(0,l.X)(t).then(e=>s(e)).catch(e=>console.error("Error fetching coins:",e))}},y=m.map(e=>{let s=N.map(s=>{let t=a.filter(a=>a.user===s&&a.type===e).reduce((e,a)=>e+parseFloat(a.value),0);return{user:s,total:t}});s.sort((e,a)=>a.total-e.total);let t=s[0]||{user:"",total:0},d=s[1]||{total:0},n=t.total-d.total;return{type:e,topUser:t.user,lead:n}});return(0,t.jsx)(r.A,{children:(0,t.jsxs)("div",{className:o().container,children:[(0,t.jsx)(n.A,{}),(0,t.jsxs)("div",{className:o().content,children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{children:"Moedas da Casa"}),e?(0,t.jsxs)("p",{children:["Bem-vindo, ",e.email,"!"]}):(0,t.jsx)("p",{children:"Usu\xe1rio n\xe3o autenticado."})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"month",children:"Selecione o m\xeas:"}),(0,t.jsx)("input",{type:"month",id:"month",value:u,onChange:e=>x(e.target.value),className:o().input})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"user",children:"Selecione o usu\xe1rio:"}),(0,t.jsxs)("select",{id:"user",value:j,onChange:e=>p(e.target.value),className:o().input,children:[(0,t.jsx)("option",{value:"",children:"Selecione um usu\xe1rio"}),N.map(e=>(0,t.jsx)("option",{value:e,children:e},e))]})]}),j&&(0,t.jsxs)("div",{className:o().userTable,children:[(0,t.jsxs)("h2",{children:["Moedas de ",j]}),(0,t.jsxs)("table",{className:o().table,children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{children:"Dia"}),m.map(e=>(0,t.jsx)("th",{children:e},e))]})}),(0,t.jsxs)("tbody",{children:[Array.from({length:g},(e,a)=>{let s="".concat(u,"-").concat(String(a+1).padStart(2,"0")),d=f.filter(e=>e.date===s);return(0,t.jsxs)("tr",{className:a%2==0?o().evenRow:o().oddRow,children:[(0,t.jsx)("td",{children:String(a+1).padStart(2,"0")}),m.map(e=>(0,t.jsx)("td",{children:d.filter(a=>a.type===e).map(e=>(0,t.jsxs)("div",{children:[e.value,(0,t.jsx)("button",{onClick:()=>b(e.id,"coins_".concat(u.split("-")[1]).concat(u.split("-")[0])),className:o().deleteButton,children:"Excluir"})]},e.id))},e))]},s)}),(0,t.jsxs)("tr",{className:o().totalRow,children:[(0,t.jsx)("td",{children:"Total"}),m.map(e=>(0,t.jsx)("td",{children:w[e]},e))]})]})]})]}),(0,t.jsxs)("div",{className:o().addCoin,children:[(0,t.jsx)("h2",{children:"Adicionar/Gastar Moedas"}),(0,t.jsx)("input",{type:"date",value:c.date,onChange:e=>h({...c,date:e.target.value}),className:o().input}),(0,t.jsxs)("table",{className:o().table,children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{children:"A\xe7\xe3o"}),m.map(e=>(0,t.jsx)("th",{children:e},e))]})}),(0,t.jsxs)("tbody",{children:[(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:"Adicionar"}),m.map(e=>(0,t.jsx)("td",{children:(0,t.jsx)("input",{type:"number",value:S[e].add,onChange:a=>E(e,"add",a.target.value),className:o().input})},e)),(0,t.jsx)("td",{children:(0,t.jsx)("button",{onClick:()=>{m.forEach(e=>{S[e].add&&_(e,S[e].add)})},className:o().button,children:"Adicionar"})})]}),(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:"Gastar"}),m.map(e=>(0,t.jsx)("td",{children:(0,t.jsx)("input",{type:"number",value:S[e].spend,onChange:a=>E(e,"spend",a.target.value),className:o().input})},e)),(0,t.jsx)("td",{children:(0,t.jsx)("button",{onClick:()=>{m.forEach(e=>{S[e].spend&&v(e,S[e].spend)})},className:o().button,children:"Gastar"})})]})]})]})]}),(0,t.jsxs)("div",{className:o().podium,children:[(0,t.jsx)("h2",{children:"P\xf3dio"}),(0,t.jsxs)("table",{className:o().table,children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{children:"Moeda"}),(0,t.jsx)("th",{children:"Usu\xe1rio"}),(0,t.jsx)("th",{children:"Vantagem"})]})}),(0,t.jsx)("tbody",{children:y.map(e=>{let{type:a,topUser:s,lead:d}=e;return(0,t.jsxs)("tr",{children:[(0,t.jsx)("td",{children:a}),(0,t.jsx)("td",{children:s}),(0,t.jsx)("td",{children:d})]},a)})})]})]})]})]})})}},2490:e=>{e.exports={sidebar:"Sidebar_sidebar__HYpoR",collapsed:"Sidebar_collapsed__jq1k3",toggleButton:"Sidebar_toggleButton__u5PL9",expanded:"Sidebar_expanded__t69bD"}},6614:e=>{e.exports={container:"moedas-da-casa_container__hsn0b",content:"moedas-da-casa_content__czhux",input:"moedas-da-casa_input__w_naL",button:"moedas-da-casa_button__hyxZm",table:"moedas-da-casa_table__63vRg",evenRow:"moedas-da-casa_evenRow__G3whz",oddRow:"moedas-da-casa_oddRow__NW490",deleteButton:"moedas-da-casa_deleteButton__StqCE",addCoin:"moedas-da-casa_addCoin__A7kIH",totalRow:"moedas-da-casa_totalRow__ipCL9"}}},e=>{var a=a=>e(e.s=a);e.O(0,[563,705,424,636,593,792],()=>a(6374)),_N_E=e.O()}]);