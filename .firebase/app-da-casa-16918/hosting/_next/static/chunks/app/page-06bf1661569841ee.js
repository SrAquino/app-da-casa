(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{2434:(e,a,t)=>{Promise.resolve().then(t.bind(t,5e3))},5e3:(e,a,t)=>{"use strict";t.r(a),t.d(a,{default:()=>c});var r=t(5155),s=t(2115),n=t(6658),o=t(4377);function c(){let[e,a]=(0,s.useState)(""),[t,c]=(0,s.useState)(""),[l,u]=(0,s.useState)(""),i=(0,n.useRouter)(),{handleSignIn:d}=(0,o.A)(),p=async a=>{a.preventDefault();try{await d(e,t),i.push("/controle-de-gastos")}catch(e){u("E-mail ou senha incorretos.")}};return(0,r.jsxs)("div",{className:"login-container",children:[(0,r.jsx)("h1",{children:"Login"}),(0,r.jsxs)("form",{onSubmit:p,children:[(0,r.jsx)("input",{type:"email",placeholder:"E-mail",value:e,onChange:e=>a(e.target.value),required:!0}),(0,r.jsx)("input",{type:"password",placeholder:"Senha",value:t,onChange:e=>c(e.target.value),required:!0}),l&&(0,r.jsx)("p",{className:"error-message",children:l}),(0,r.jsx)("button",{type:"submit",children:"Entrar"})]})]})}t(3967),t(5567)},4377:(e,a,t)=>{"use strict";t.d(a,{AuthProvider:()=>h,A:()=>g});var r=t(5155),s=t(2115),n=t(9904),o=t(7058),c=t(399);let l={apiKey:"AIzaSyBC9VrEctbgKaHKMfm0wnwz0m1Tz7p9BTw",authDomain:"app-da-casa-16918.firebaseapp.com",databaseURL:t(2818).env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,projectId:"app-da-casa-16918",storageBucket:"app-da-casa-16918.firebasestorage.app",messagingSenderId:"1055037818769",appId:"1:1055037818769:web:6c84ff87c94d0f6e5a3c30"},u=(0,n.Wp)(l);(0,o.aU)(u);let i=(0,c.xI)(u),d=async(e,a)=>{try{return await (0,c.x9)(i,e,a)}catch(e){throw Error("E-mail ou senha incorretos.")}},p=(0,s.createContext)(),h=e=>{let{children:a}=e,[t,n]=(0,s.useState)(null);(0,s.useEffect)(()=>{console.log("AuthProvider montado");let e=(0,c.hg)(i,e=>{n(e)});return()=>e()},[]);let o=async(e,a)=>{try{let r=await d(e,a);n(r),console.log("Usu\xe1rio logado:",t)}catch(e){throw Error(e.message)}};return(0,r.jsx)(p.Provider,{value:{user:t,setUser:n,handleSignIn:o},children:a})},g=()=>(0,s.useContext)(p)},3967:()=>{},5567:()=>{}},e=>{var a=a=>e(e.s=a);e.O(0,[8,552,992,533,459,441,517,358],()=>a(2434)),_N_E=e.O()}]);