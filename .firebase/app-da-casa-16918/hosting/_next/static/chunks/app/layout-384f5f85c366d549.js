(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{9308:(e,a,t)=>{Promise.resolve().then(t.bind(t,4377)),Promise.resolve().then(t.t.bind(t,3967,23))},4377:(e,a,t)=>{"use strict";t.d(a,{AuthProvider:()=>h,A:()=>E});var r=t(5155),s=t(2115),o=t(9904),c=t(7058),n=t(399);let l={apiKey:"AIzaSyBC9VrEctbgKaHKMfm0wnwz0m1Tz7p9BTw",authDomain:"app-da-casa-16918.firebaseapp.com",databaseURL:t(2818).env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,projectId:"app-da-casa-16918",storageBucket:"app-da-casa-16918.firebasestorage.app",messagingSenderId:"1055037818769",appId:"1:1055037818769:web:6c84ff87c94d0f6e5a3c30"},i=(0,o.Wp)(l);(0,c.aU)(i);let p=(0,n.xI)(i),u=async(e,a)=>{try{return await (0,n.x9)(p,e,a)}catch(e){throw Error("E-mail ou senha incorretos.")}},d=(0,s.createContext)(),h=e=>{let{children:a}=e,[t,o]=(0,s.useState)(null),[c,l]=(0,s.useState)(!0);(0,s.useEffect)(()=>{console.log("AuthProvider montado");let e=(0,n.hg)(p,e=>{o(e),l(!1)});return()=>e()},[]);let i=async(e,a)=>{try{let r=await u(e,a);o(r),console.log("Usu\xe1rio logado:",t)}catch(e){throw Error(e.message)}};return(0,r.jsx)(d.Provider,{value:{user:t,loading:c,setUser:o,handleSignIn:i},children:a})},E=()=>(0,s.useContext)(d)},3967:()=>{}},e=>{var a=a=>e(e.s=a);e.O(0,[8,992,533,459,441,517,358],()=>a(9308)),_N_E=e.O()}]);