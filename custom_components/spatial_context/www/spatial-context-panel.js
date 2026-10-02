/*! spatial-context-panel v0.9.0-beta.1 | MIT */
!function(){"use strict";function t(t,e,i,n){var s,o=arguments.length,r=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var l=t.length-1;l>=0;l--)(s=t[l])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),s=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new o(i,t,n)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:a,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",y=_.reactiveElementPolyfillSupport,v=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!a(t,e),x={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&d(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:s}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const o=n?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),s=e.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=n;const o=s.fromAttribute(e,t.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,e,i,n=!1,s){if(void 0!==t){const o=this.constructor;if(!1===n&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??b)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[v("elementProperties")]=new Map,$[v("finalized")]=new Map,y?.({ReactiveElement:$}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,I=w.trustedTypes,P=I?I.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+M,O=`<${C}>`,L=document,T=()=>L.createComment(""),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,A=Array.isArray,B="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,D=/>/g,z=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,W=/"/g,U=/^(?:script|style|textarea|title)$/i,N=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=N(1),Y=N(2),X=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),j=new WeakMap,q=L.createTreeWalker(L,129);function G(t,e){if(!A(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==P?P.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,n=[];let s,o=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let l,a,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,a=r.exec(i),null!==a);)c=r.lastIndex,r===R?"!--"===a[1]?r=F:void 0!==a[1]?r=D:void 0!==a[2]?(U.test(a[2])&&(s=RegExp("</"+a[2],"g")),r=z):void 0!==a[3]&&(r=z):r===z?">"===a[0]?(r=s??R,d=-1):void 0===a[1]?d=-2:(d=r.lastIndex-a[2].length,l=a[1],r=void 0===a[3]?z:'"'===a[3]?W:H):r===W||r===H?r=z:r===F||r===D?r=R:(r=z,s=void 0);const h=r===z&&t[e+1].startsWith("/>")?" ":"";o+=r===R?i+O:d>=0?(n.push(l),i.slice(0,d)+S+i.slice(d)+M+h):i+M+(-2===d?e:h)}return[G(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class J{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,o=0;const r=t.length-1,l=this.parts,[a,d]=Z(t,e);if(this.el=J.createElement(a,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=q.nextNode())&&l.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(S)){const e=d[o++],i=n.getAttribute(t).split(M),r=/([.?@])?(.*)/.exec(e);l.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?nt:"?"===r[1]?st:"@"===r[1]?ot:it}),n.removeAttribute(t)}else t.startsWith(M)&&(l.push({type:6,index:s}),n.removeAttribute(t));if(U.test(n.tagName)){const t=n.textContent.split(M),e=t.length-1;if(e>0){n.textContent=I?I.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],T()),q.nextNode(),l.push({type:2,index:++s});n.append(t[e],T())}}}else if(8===n.nodeType)if(n.data===C)l.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(M,t+1));)l.push({type:7,index:s}),t+=M.length-1}s++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,n){if(e===X)return e;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const o=E(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(e=Q(t,s._$AS(t,e.values),s,n)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??L).importNode(e,!0);q.currentNode=n;let s=q.nextNode(),o=0,r=0,l=i[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new et(s,s.nextSibling,this,t):1===l.type?e=new l.ctor(s,l.name,l.strings,this,t):6===l.type&&(e=new rt(s,this,t)),this._$AV.push(e),l=i[++r]}o!==l?.index&&(s=q.nextNode(),o++)}return q.currentNode=L,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),E(t)?t===K||null==t||""===t?(this._$AH!==K&&this._$AR(),this._$AH=K):t!==this._$AH&&t!==X&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>A(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==K&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new tt(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=j.get(t.strings);return void 0===e&&j.set(t.strings,e=new J(t)),e}k(t){A(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new et(this.O(T()),this.O(T()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=K,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(t,e=this,i,n){const s=this.strings;let o=!1;if(void 0===s)t=Q(this,t,e,0),o=!E(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const n=t;let r,l;for(t=s[0],r=0;r<s.length-1;r++)l=Q(this,n[i+r],e,r),l===X&&(l=this._$AH[r]),o||=!E(l)||l!==this._$AH[r],l===K?t=K:t!==K&&(t+=(l??"")+s[r+1]),this._$AH[r]=l}o&&!n&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class nt extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class st extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class ot extends it{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??K)===X)return;const i=this._$AH,n=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==K&&(i===K||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const lt=w.litHtmlPolyfillSupport;lt?.(J,et),(w.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class dt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let s=n._$litPart$;if(void 0===s){const t=i?.renderBefore??null;n._$litPart$=s=new et(e.insertBefore(T(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}}dt._$litElement$=!0,dt.finalized=!0,at.litElementHydrateSupport?.({LitElement:dt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:dt}),(at.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:b},pt=(t=ht,e,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,s,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];e.call(this,i),this.requestUpdate(n,s,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};function ut(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function _t(t){return ut({...t,state:!0,attribute:!1})}function gt(t,e){return(e,i,n)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}const mt=t=>(e,i)=>{const n=()=>{customElements.get(t)?console.info(`spatial-context: <${t}> already defined — reload the page to pick up the updated panel.`):customElements.define(t,e)};void 0!==i?i.addInitializer(n):n()},yt="__property__";function vt(t){switch(t){case"strong":return"#2e7d32";case"medium":return"#f9a825";case"weak":return"#c62828";default:return"#607d8b"}}const ft=["light","switch","climate","media_player","lock","cover","fan","vacuum","alarm_control_panel","valve","humidifier","siren","water_heater","camera","assist_satellite","device_tracker","binary_sensor","sensor"];function bt(t,e){if(!t)return null;const i=[...e].filter(e=>e.device_id===t);if(0===i.length)return null;const n=t=>"config"===t.entity_category?2:t.entity_category?1:0,s=t=>{const e=ft.indexOf(t.domain);return-1===e?ft.length:e};return i.sort((t,e)=>n(t)-n(e)||s(t)-s(e)),i[0]}function xt(t,e){return bt(t,e)?.device_name??"Unknown device"}class $t{constructor(t=100,e=400){this._limit=t,this._coalesceMs=e,this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}get canUndo(){return this._past.length>0}get canRedo(){return this._future.length>0}record(t,e=Date.now()){e-this._lastRecordAt>this._coalesceMs&&(this._past.push(t),this._past.length>this._limit&&this._past.shift()),this._lastRecordAt=e,this._future=[]}undo(t){const e=this._past.pop();return void 0===e?null:(this._future.push(t),this._lastRecordAt=Number.NEGATIVE_INFINITY,e)}redo(t){const e=this._future.pop();return void 0===e?null:(this._past.push(t),this._lastRecordAt=Number.NEGATIVE_INFINITY,e)}clear(){this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}}function wt(t,e,i){const n=t.source_bounds;if(!n||n.max_x<=n.min_x||n.max_y<=n.min_y||t.width<=0||t.height<=0)return null;const s=t.rotation_deg*Math.PI/180,o=Math.cos(s),r=Math.sin(s),l=e-t.x,a=i-t.y,d=-r*l+o*a;return{x:((o*l+r*a)/t.width+.5)*(n.max_x-n.min_x)+n.min_x,y:(d/t.height+.5)*(n.max_y-n.min_y)+n.min_y}}const kt=[{id:"timber_frame",label:"Timber framed (drywall)",color:"#212121",attenuationDbPerCm:.3,defaultThicknessCm:10},{id:"brick_veneer",label:"Brick veneer",color:"#3e2723",attenuationDbPerCm:.55,defaultThicknessCm:11},{id:"concrete_block",label:"Concrete / block",color:"#000000",attenuationDbPerCm:.6,defaultThicknessCm:20},{id:"aerated_concrete_block",label:"Aerated/foam concrete block (plastered)",color:"#757575",attenuationDbPerCm:.37,defaultThicknessCm:13},{id:"ceramic_poroton_block",label:"Ceramic / Poroton block",color:"#8d6e63",attenuationDbPerCm:.42,defaultThicknessCm:25},{id:"glass",label:"Glass",color:"#37474f",attenuationDbPerCm:2,defaultThicknessCm:1},{id:"steel_frame",label:"Steel frame",color:"#263238",attenuationDbPerCm:1,defaultThicknessCm:10}];function It(t){return kt.find(e=>e.id===t)??kt[0]}function Pt(t){return t.thickness_cm??It(t.material).defaultThicknessCm}class St{constructor(t){this.hass=t}async listFloors(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_floors"})).floors}async getLayout(t){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_layout",floor_id:t})}async saveLayout(t,e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_layout",floor_id:t,background_image_id:e.background_image_id,background_opacity:e.background_opacity,background_offset_x:e.background_offset_x,background_offset_y:e.background_offset_y,background_scale:e.background_scale,building_id:e.building_id,view_box:e.view_box,rooms:e.rooms,pins:e.pins,walls:e.walls,openings:e.openings,scale:e.scale})}async setBuildingId(t,e){return this.hass.connection.sendMessagePromise({type:"spatial_context/set_building_id",floor_id:t,building_id:e})}async getPropertyLayout(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_property_layout"})}async savePropertyLayout(t){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_property_layout",background_image_id:t.background_image_id,background_opacity:t.background_opacity,background_offset_x:t.background_offset_x,background_offset_y:t.background_offset_y,background_scale:t.background_scale,view_box:t.view_box,placements:t.placements,pins:t.pins})}async getSettings(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_settings"})}async saveSettings(t){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_settings",unit_system:t.unit_system,zigbee_timeout_seconds:t.zigbee_timeout_seconds,floor_order:t.floor_order,zigbee_coordinator_device_id:t.zigbee_coordinator_device_id,auto_save:t.auto_save})}async listAreas(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_areas"})).areas}async listPlaceableEntities(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_placeable_entities"})).entities}async exportSnapshot(){return this.hass.connection.sendMessagePromise({type:"spatial_context/export_snapshot"})}async getZigbeeMesh(t=!1){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",force_refresh:t})}async getCachedZigbeeMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",cache_only:!0})}async getWifiMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_wifi_mesh"})}async subscribeMatterTopology(t){return this.hass.connection.subscribeMessage(t,{type:"matter/subscribe_network_topology"})}async uploadBackgroundImage(t){const e=new FormData;e.append("file",t);const i=await this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:e});if(!i.ok)throw new Error(`Image upload failed: ${i.status} ${i.statusText}`);return(await i.json()).id}}function Mt(t){return t?`/api/image/serve/${t}/original`:null}function Ct(t){return`${t}-${function(){if("undefined"!=typeof crypto&&crypto.randomUUID)return crypto.randomUUID();if("undefined"!=typeof crypto&&crypto.getRandomValues){const t=crypto.getRandomValues(new Uint8Array(16));t[6]=15&t[6]|64,t[8]=63&t[8]|128;const e=Array.from(t,t=>t.toString(16).padStart(2,"0")).join("");return`${e.slice(0,8)}-${e.slice(8,12)}-${e.slice(12,16)}-${e.slice(16,20)}-${e.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const e=16*Math.random()|0;return("x"===t?e:3&e|8).toString(16)})}()}`}function Ot(t,e,i,n){return{id:Ct("pin"),device_id:t,x:e,y:i,room_id:n,icon_override:null,label_override:null,height_m:null}}function Lt(t,e="timber_frame"){return{id:Ct("wall"),material:e,thickness_cm:It(e).defaultThicknessCm,points:t}}const Tt=220;class Et{constructor(t=[],e=(t,e)=>t<e?-1:t>e?1:0){if(this.data=t,this.length=this.data.length,this.compare=e,this.length>0)for(let t=(this.length>>1)-1;t>=0;t--)this._down(t)}push(t){this.data.push(t),this._up(this.length++)}pop(){if(0===this.length)return;const t=this.data[0],e=this.data.pop();return--this.length>0&&(this.data[0]=e,this._down(0)),t}peek(){return this.data[0]}_up(t){const{data:e,compare:i}=this,n=e[t];for(;t>0;){const s=t-1>>1,o=e[s];if(i(n,o)>=0)break;e[t]=o,t=s}e[t]=n}_down(t){const{data:e,compare:i}=this,n=this.length>>1,s=e[t];for(;t<n;){let n=1+(t<<1);const o=n+1;if(o<this.length&&i(e[o],e[n])<0&&(n=o),i(e[n],s)>=0)break;e[t]=e[n],t=n}e[t]=s}}function At(t,e=1,i=!1){let n=1/0,s=1/0,o=-1/0,r=-1/0;for(const[e,i]of t[0])e<n&&(n=e),i<s&&(s=i),e>o&&(o=e),i>r&&(r=i);const l=o-n,a=r-s,d=Math.max(e,Math.min(l,a));if(d===e){const t=[n,s];return t.distance=0,t}let c=0;for(const e of t)c+=e.length;const h=new Float64Array(2*c),p=[];let u=0;for(const e of t){for(let t=0;t<e.length;t++)h[u++]=e[t][0],h[u++]=e[t][1];p.push(u)}const _=function(t,e){const i=64;let n=0,s=0;for(let t=0;t<e.length;t++)n+=Math.ceil((e[t]-s)/i),s=e[t];const o=new Float64Array(4*n);let r=0;s=0;for(let n=0;n<e.length;n++){const l=e[n];for(let e=s;e<l;e+=i,r+=4){const n=e+i<l?e+i:l,a=e===s?l-2:e-2;let d=t[a],c=t[a+1],h=d,p=c;for(let i=e;i<n;i+=2){const e=t[i],n=t[i+1];e<d?d=e:e>h&&(h=e),n<c?c=n:n>p&&(p=n)}o[r]=d,o[r+1]=c,o[r+2]=h,o[r+3]=p}s=l}return o}(h,p),g=new Et([],(t,e)=>e.max-t.max);let m=function(t,e,i){let n=0,s=0,o=0;const r=e[0];for(let e=0,i=r-2;e<r;i=e,e+=2){const r=t[e],l=t[e+1],a=t[i],d=t[i+1],c=r*d-a*l;s+=(r+a)*c,o+=(l+d)*c,n+=3*c}const l=new Bt(s/n,o/n,0,t,e,i,-1/0,null);return 0===n||l.d<0?new Bt(t[0],t[1],0,t,e,i,-1/0,null):l}(h,p,_);const y=new Bt(n+l/2,s+a/2,0,h,p,_,-1/0,null);y.d>m.d&&(m=y);let v=2;function f(t,n,s,o){const r=m.d-Math.max(0,s*Math.SQRT2-e),l=new Bt(t,n,s,h,p,_,r,o);v++,l.max>m.d+e&&g.push(l),l.d>m.d&&(m=l,i&&console.log(`found best ${Math.round(1e4*l.d)/1e4} after ${v} probes`))}let b=d/2;for(let t=n;t<o;t+=d)for(let e=s;e<r;e+=d)f(t+b,e+b,b,null);for(;g.length;){const t=g.pop();if(t.max-m.d<=e)break;b=t.h/2,f(t.x-b,t.y-b,b,t),f(t.x+b,t.y-b,b,t),f(t.x-b,t.y+b,b,t),f(t.x+b,t.y+b,b,t)}i&&console.log(`num probes: ${v}\nbest distance: ${m.d}`);const x=[m.x,m.y];return x.distance=m.d,x}function Bt(t,e,i,n,s,o,r,l){this.x=t,this.y=e,this.h=i,this.nsx1=0,this.nsy1=0,this.nsx2=0,this.nsy2=0,this.d=function(t,e,i,n,s,o){const r=t.x,l=t.y;let a=!1,d=1/0;const c=s>0?s*s:-1;if(null!==o&&(t.nsx1=o.nsx1,t.nsy1=o.nsy1,t.nsx2=o.nsx2,t.nsy2=o.nsy2,d=Rt(r,l,o.nsx1,o.nsy1,o.nsx2,o.nsy2),d<=c))return s;const h=64,p=i.length;let u=0,_=0;for(let o=0;o<p;o++){const p=i[o];let g=e[p-2],m=e[p-1];for(let i=_;i<p;i+=h,u+=4){let o=i+h;o>p&&(o=p);const _=n[u],y=n[u+1],v=n[u+2],f=n[u+3],b=r<_?_-r:r>v?r-v:0,x=l<y?y-l:l>f?l-f:0,$=b*b+x*x>=d,w=l<y||l>=f||r>v;if($&&w)g=e[o-2],m=e[o-1];else for(let n=i;n<o;n+=2){const i=e[n],o=e[n+1];if(!w&&o>l!=m>l&&r<(g-i)*(l-o)/(m-o)+i&&(a=!a),!$){const e=Rt(r,l,i,o,g,m);if(e<d&&(d=e,t.nsx1=i,t.nsy1=o,t.nsx2=g,t.nsy2=m,d<=c))return s}g=i,m=o}}_=p}return 0===d?0:(a?1:-1)*Math.sqrt(d)}(this,n,s,o,r,l),this.max=this.d+i*Math.SQRT2}function Rt(t,e,i,n,s,o){let r=s-i,l=o-n;if(0!==r||0!==l){const a=((t-i)*r+(e-n)*l)/(r*r+l*l);a>1?(i=s,n=o):a>0&&(i+=r*a,n+=l*a)}return r=t-i,l=e-n,r*r+l*l}function Ft(t,e,i,n){return Math.hypot(i-t,n-e)}function Dt(t,e,i){return Math.min(i,Math.max(e,t))}function zt(t,e,i){let n=!1;for(let s=0,o=i.length-1;s<i.length;o=s++){const r=i[s],l=i[o],[a,d]=r,[c,h]=l;d>e!=h>e&&t<(c-a)*(e-d)/(h-d)+a&&(n=!n)}return n}function Ht(t,e,i){for(const n of i)if(n.points.length>=3&&zt(t,e,n.points))return n.id;return null}function Wt(t,e){let i=!1;const n=e.map(e=>{const n=Ht(e.x,e.y,t);return n===e.room_id?e:(i=!0,{...e,room_id:n})});return i?n:e}const Ut=new WeakMap;function Nt(t,e,i,n,s,o){const r=s-i,l=o-n,a=r*r+l*l;if(0===a)return Ft(t,e,i,n);let d=((t-i)*r+(e-n)*l)/a;return d=Dt(d,0,1),Ft(t,e,i+d*r,n+d*l)}function Vt(t,e,i){let n=1/0;for(let s=0;s<i.length-1;s++){const[o,r]=i[s],[l,a]=i[s+1];n=Math.min(n,Nt(t,e,o,r,l,a))}return n}function Yt(t){const e=[];for(let i=0;i<t.length;i++){const n=t[i],s=t[(i+1)%t.length];e.push([(n[0]+s[0])/2,(n[1]+s[1])/2])}return e}function Xt(t){const e=[];for(let i=0;i<t.length-1;i++){const n=t[i],s=t[i+1];e.push([(n[0]+s[0])/2,(n[1]+s[1])/2])}return e}function Kt(t,e,i){let n={point:t[0],segmentIndex:0,dist:1/0};for(let s=0;s<t.length-1;s++){const[o,r]=t[s],[l,a]=t[s+1],d=l-o,c=a-r,h=d*d+c*c;let p=0===h?0:((e-o)*d+(i-r)*c)/h;p=Dt(p,0,1);const u=[o+p*d,r+p*c],_=Ft(e,i,u[0],u[1]);_<n.dist&&(n={point:u,segmentIndex:s,dist:_})}return{point:n.point,segmentIndex:n.segmentIndex}}function jt(t,e,i){return 0===t.length?{point:[e,i],segmentIndex:0}:Kt([...t,t[0]],e,i)}function qt(t,e,i){const[n,s]=t,[o,r]=e,l=Math.abs(o-n),a=Math.abs(r-s);return l>i&&a>i?e:l<=a?[n,r]:[o,s]}function Gt(t,e,i,n){if(n.length<2)return null;const{segmentIndex:s}=Kt(n,t,e),[o,r]=function(t,e){const[i,n]=t[e],[s,o]=t[e+1]??t[e],r=Ft(i,n,s,o)||1;return[(s-i)/r,(o-n)/r]}(n,s),l=i/2;return[[t-o*l,e-r*l],[t+o*l,e+r*l]]}const Zt=.3048;function Jt(t){return Math.round(100*t)/100}function Qt(t){return"imperial"===t?"ft":"m"}function te(t,e){return String(Jt("imperial"===e?t/Zt:t))}function ee(t,e){const i=Number(t);return Number.isFinite(i)?"imperial"===e?i*Zt:i:null}const ie={cm:1,m:100,in:2.54,ft:30.48};function ne(t){return"imperial"===t?"in":"cm"}function se(t,e){return String(Jt(t/ie[e]))}function oe(t,e){const i=Number(t);return Number.isFinite(i)?i*ie[e]:null}const re=r`
  :host {
    --sc-bg: var(--card-background-color, #fff);
    --sc-fg: var(--primary-text-color, #212121);
    --sc-fg-secondary: var(--secondary-text-color, #727272);
    --sc-accent: var(--primary-color, #03a9f4);
    --sc-divider: var(--divider-color, #e0e0e0);
    --sc-danger: var(--error-color, #db4437);
    --sc-panel-bg: var(--card-background-color, #fff);
    --sc-panel-radius: var(--ha-card-border-radius, 12px);
    --sc-panel-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.3));
    --sc-header-bg: var(--app-header-background-color, var(--sc-bg));
    box-sizing: border-box;
    color: var(--sc-fg);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  button {
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    background: transparent;
    color: var(--sc-fg);
  }
  button:hover {
    background: rgba(0, 0, 0, 0.06);
  }
  button.primary {
    background: var(--sc-accent);
    color: white;
  }
  button.primary:hover {
    filter: brightness(1.05);
  }
  button.danger {
    color: var(--sc-danger);
  }
  button:disabled {
    opacity: 0.4;
    cursor: default;
    background: transparent;
  }
  button.active {
    background: var(--sc-accent);
    color: white;
  }
  input[type="text"],
  input[type="search"] {
    font-family: inherit;
    font-size: 0.875rem;
    padding: 6px 8px;
    border: 1px solid var(--sc-divider);
    border-radius: 4px;
    color: var(--sc-fg);
    background: var(--sc-bg);
  }
  .floating-panel {
    background: var(--sc-panel-bg);
    border-radius: var(--sc-panel-radius);
    box-shadow: var(--sc-panel-shadow);
    padding: 6px;
  }
  /* HA's own overflow-menu row style (the ⋮ menu's Refresh/Download/Reset
   * list) — an icon + label per row, generous padding, no borders between
   * rows, disabled rows just dimmed. Shared by every icon-popover menu. */
  .menu-item {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 1rem;
    text-align: left;
    justify-content: flex-start;
  }
  .menu-item ha-icon {
    --mdc-icon-size: 22px;
    color: var(--sc-fg-secondary);
    flex-shrink: 0;
  }
  .menu-item.active {
    background: var(--sc-accent);
    color: white;
  }
  .menu-item.active ha-icon {
    color: white;
  }
  .menu-item.danger ha-icon {
    color: var(--sc-danger);
  }
`;function le(t,e,i,n){return t.map(t=>({pin:t,d:Ft(t.x,t.y,e,i)})).filter(({d:t})=>t<=n).sort((t,e)=>t.d-e.d).map(({pin:t})=>t)}function ae(t,e,i,n){let s=null,o=n;return t.forEach(([t,n],r)=>{const l=Ft(t,n,e,i);l<=o&&(s=r,o=l)}),s}function de(t,e,i,n){let s=null,o=n;for(const n of t){const t=Vt(e,i,n.points);t<=o&&(s=n,o=t)}return s}function ce(t,e,i,n){if(t.points.length>=3){const[s,o]=t.points[0];if(Ft(s,o,e,i)<=n)return{trace:t,closed:!0}}return{trace:{points:[...t.points,[e,i]]},closed:!1}}const he=new Map;const pe=r`
  .pin-hit {
    fill: transparent;
    cursor: pointer;
  }
  .pin-dot {
    /* One uniform color for every device — a per-domain tint would
     * mean deriving something from an arbitrarily-chosen entity's
     * domain again, which this app deliberately never does anymore
     * (see canvas/device-display.ts). */
    fill: var(--sc-accent);
    stroke: white;
    stroke-width: 2;
    pointer-events: none;
  }
  .pin-dot.selected {
    fill: var(--sc-danger);
  }
  .pin-icon {
    pointer-events: none;
  }
  .pin-brand-icon {
    pointer-events: none;
  }
  .pin-icon path {
    fill: white;
  }
`;class ue{constructor(t){this._host=t,this._resolvedOverrides=new Map,this._failedBrandIcons=new Set}_iconForOverride(t){return this._resolvedOverrides.has(t)?this._resolvedOverrides.get(t)??null:(this._resolvedOverrides.set(t,null),async function(t){const e=t.replace(/^mdi:/,"").trim();if(!e)return null;if(he.has(e))return he.get(e);try{const t=await fetch(`https://api.iconify.design/mdi/${e}.svg`);if(!t.ok)return he.set(e,null),null;const i=(await t.text()).match(/\sd="([^"]+)"/),n=i?i[1]:null;return he.set(e,n),n}catch{return he.set(e,null),null}}(t).then(e=>{null!==e&&(this._resolvedOverrides.set(t,e),this._host.requestUpdate())}),null)}iconForPin(t,e){if(t.icon_override){const e=this._iconForOverride(t.icon_override);if(e)return{kind:"path",d:e}}const i=function(t,e){return bt(t,e)?.integration_domain??null}(t.device_id,e);return i&&!this._failedBrandIcons.has(i)?{kind:"image",href:`https://brands.home-assistant.io/_/${i}/icon.png`,integrationDomain:i}:{kind:"path",d:"M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z"}}onBrandIconError(t){this._failedBrandIcons.has(t)||(this._failedBrandIcons.add(t),this._host.requestUpdate())}renderMarker(t,e,i,n,s,o,r){const l=1.1*i;return Y`
      <g>
        <title>${r}</title>
        <circle
          class="pin-dot ${o?"selected":""}"
          cx=${t}
          cy=${e}
          r=${i}
          style="fill:${o?"":s}"
        ></circle>
        ${"path"===n.kind?Y`
              <svg
                x=${t-l/2}
                y=${e-l/2}
                width=${l}
                height=${l}
                viewBox="0 0 24 24"
                class="pin-icon"
              >
                <path d=${n.d}></path>
              </svg>
            `:Y`
              <image
                x=${t-l/2}
                y=${e-l/2}
                width=${l}
                height=${l}
                href=${n.href}
                class="pin-brand-icon"
                @error=${()=>this.onBrandIconError(n.integrationDomain)}
              ></image>
            `}
        <circle class="pin-hit" cx=${t} cy=${e} r=${1.4*i}></circle>
      </g>
    `}}const _e=1e3,ge=750,me=14,ye="#03a9f4";let ve=class extends dt{constructor(){super(...arguments),this.rooms=[],this.pins=[],this.walls=[],this.openings=[],this.scale=null,this.unitSystem="metric",this.meshLinks=[],this.meshStubs=[],this.entityLookup=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.5,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.alignOverlay=null,this.initialViewBox=null,this.sameBuildingAsPrevious=!1,this.mode="select",this.armedEntityId=null,this.armedOpeningType=null,this.selectedRoomId=null,this.editingRoomId=null,this.editingWallId=null,this.selectedPinId=null,this.selectedWallId=null,this.selectedOpeningId=null,this.selectedMeshLinkKey=null,this.selectedMeshStubKey=null,this._viewBox={x:0,y:0,w:_e,h:ge},this._naturalHeight=ge,this._alignNaturalHeight=ge,this._pendingTrace=null,this._hoverSnap=null,this._pendingScalePoints=[],this._liveEditPoints=null,this._liveDragPin=null,this._liveOpeningEdit=null,this._selectedVertexIndex=null,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastImage=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._hasFittedOnce=!1,this._onPointerDown=t=>{if("mouse"===t.pointerType&&0!==t.button)return;if(this._svg.setPointerCapture(t.pointerId),this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,n={x:(e.x+i.x)/2,y:(e.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:Ft(e.x,e.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(n.x,n.y)})}if(this._pointers.size>2)return;const e=this._clientToImage(t.clientX,t.clientY);this._downClient={x:t.clientX,y:t.clientY},this._lastImage=e,this._lastClient={x:t.clientX,y:t.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(t.clientX,t.clientY,e):{type:"empty"}},this._onPointerMove=t=>{if(!this._pointers.has(t.pointerId)){if("wall"===this.mode||"trace"===this.mode){const e=this._clientToImage(t.clientX,t.clientY);this._hoverSnap=this._snappedGeometryPoint(this._pendingTrace?.points??[],e.x,e.y,t.shiftKey)}else this._hoverSnap&&(this._hoverSnap=null);return}if(this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,n=Ft(e.x,e.y,i.x,i.y)||1,s=this._gesture.startDistance/n,o=this._gesture.startViewBox,r=Dt(o.w*s,250,4e3),l=r/o.w,a=o.h*l,{x:d,y:c}=this._gesture.midImage;return void(this._viewBox={x:d-(d-o.x)*l,y:c-(c-o.y)*l,w:r,h:a})}if(1!==this._pointers.size||!this._downClient||!this._lastImage)return;if(!this._moved){if(Ft(this._downClient.x,this._downClient.y,t.clientX,t.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"!==this._gesture?.kind&&"alignDrag"!==this._gesture?.kind||(this._svg.style.cursor="grabbing")}const e=this._clientToImage(t.clientX,t.clientY);if("pan"===this._gesture?.kind){const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};this._viewBox={...this._viewBox,x:this._viewBox.x-(t.clientX-i.x)/e,y:this._viewBox.y-(t.clientY-i.y)/e}}else if("alignDrag"===this._gesture?.kind){const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};this.dispatchEvent(new CustomEvent("align-drag",{detail:{dx:(t.clientX-i.x)/e,dy:(t.clientY-i.y)/e}}))}else if("vertex"===this._gesture?.kind&&this._liveEditPoints){const i="room"===this._editingTarget?.kind,[n,s]=this._snappedVertexPoint(this._liveEditPoints,this._gesture.index,e.x,e.y,i,t.shiftKey),o=[...this._liveEditPoints];o[this._gesture.index]=[n,s],this._liveEditPoints=o}else if("pin"===this._gesture?.kind)this._liveDragPin={id:this._gesture.pinId,x:e.x,y:e.y};else if("roomLabel"===this._gesture?.kind)this._liveRoomLabel={id:this._gesture.roomId,x:e.x,y:e.y};else if("openingMove"===this._gesture?.kind){const t=this._gesture,i=this.openings.find(e=>e.id===t.openingId),n=i&&this.walls.find(t=>t.id===i.wallId);if(i&&n){const t=this._effectivePoints("wall",n.id,n.points),{point:s}=Kt(t,e.x,e.y);this._liveOpeningEdit={id:i.id,x:s[0],y:s[1],width:i.width}}}else if("openingHandle"===this._gesture?.kind){const t=this._gesture,i=this.openings.find(e=>e.id===t.openingId),n=i&&this.walls.find(t=>t.id===i.wallId),s=i&&this._openingEndpoints(i);if(i&&n&&s){const o=this._effectivePoints("wall",n.id,n.points),{point:r}=Kt(o,e.x,e.y),l=s[0===t.whichEnd?1:0],a=[(l[0]+r[0])/2,(l[1]+r[1])/2],d=Ft(l[0],l[1],r[0],r[1]);this._liveOpeningEdit={id:i.id,x:a[0],y:a[1],width:d}}}this._lastImage=this._clientToImage(t.clientX,t.clientY),this._lastClient={x:t.clientX,y:t.clientY}},this._onPointerLeave=()=>{this._hoverSnap=null},this._onPointerUp=t=>{this._pointers.delete(t.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(t.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._moved?this._commitGesture():this._downClient&&this._handleClick(this._downClient.x,this._downClient.y,t.shiftKey),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1)},this._onWheel=t=>{if(t.preventDefault(),t.ctrlKey){const e=t.deltaY<0?.9:1.1;return void this._zoomBy(e,this._clientToImage(t.clientX,t.clientY))}const e=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+t.deltaX*e,y:this._viewBox.y+t.deltaY*e}},this._liveRoomLabel=null,this._pinIcons=new ue(this)}get _editingTarget(){return this.editingRoomId?{kind:"room",id:this.editingRoomId}:this.editingWallId?{kind:"wall",id:this.editingWallId}:null}_rawPointsFor(t){return"room"===t.kind?this.rooms.find(e=>e.id===t.id)?.points??null:this.walls.find(e=>e.id===t.id)?.points??null}willUpdate(t){if(t.has("editingRoomId")||t.has("editingWallId")){const t=this._editingTarget,e=t?this._rawPointsFor(t):null;this._liveEditPoints=e?[...e]:null,this._selectedVertexIndex=null}t.has("mode")&&(this._pendingTrace=null,this._pendingScalePoints=[])}firstUpdated(){this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl,this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(t){if(t.has("backgroundImageUrl")&&this.backgroundImageUrl){const t=new Image;t.onload=()=>{this._naturalHeight=t.naturalHeight/t.naturalWidth*_e||ge,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},t.src=this.backgroundImageUrl}if(t.has("initialViewBox")&&(this.initialViewBox?(this._viewBox={...this.initialViewBox},this._hasFittedOnce=!0):this.sameBuildingAsPrevious||(this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl)),t.has("alignOverlay")){const e=t.get("alignOverlay");if(this.alignOverlay&&this.alignOverlay.imageUrl!==e?.imageUrl){const t=new Image;t.onload=()=>{this._alignNaturalHeight=t.naturalHeight/t.naturalWidth*_e||ge},t.src=this.alignOverlay.imageUrl}}if(t.has("_pendingTrace")||t.has("_pendingScalePoints")){const t="scale"===this.mode?this._pendingScalePoints.length:this._pendingTrace?.points.length??0;this.dispatchEvent(new CustomEvent("pending-changed",{detail:{count:t}}))}}_contentBounds(){const t=[];for(const e of this.rooms)t.push(...e.points);for(const e of this.walls)t.push(...e.points);for(const e of this.pins)t.push([e.x,e.y]);if(0===t.length)return null;const e=t.map(([t])=>t),i=t.map(([,t])=>t),n=Math.min(...e),s=Math.max(...e),o=Math.min(...i),r=Math.max(...i),l=.08*Math.max(s-n,r-o)||40;return{x:n-l,y:o-l,w:s-n+2*l,h:r-o+2*l}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:_e,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const t=this._svg?.getBoundingClientRect(),e=t?.width||this._viewBox.w,i=t?.height||this._viewBox.h,n=Math.min(e/this._viewBox.w,i/this._viewBox.h)||1;return{scale:n,offsetX:(e-this._viewBox.w*n)/2,offsetY:(i-this._viewBox.h*n)/2}}_pxToUnits(t){return t/this._svgTransform().scale}_clientToImage(t,e){const i=this._svg,n=i.createSVGPoint();n.x=t,n.y=e;const s=i.getScreenCTM();if(!s)return{x:0,y:0};const o=n.matrixTransform(s.inverse());return{x:o.x,y:o.y}}_effectivePoints(t,e,i){const n=this._editingTarget;return n&&n.kind===t&&n.id===e&&this._liveEditPoints?this._liveEditPoints:i}_snappedTracePoint(t,e,i,n){if(n||0===t.length)return{point:[e,i],lockedX:!1,lockedY:!1};const s=this._pxToUnits(10),o=t[t.length-1],r=t[0],l=t.length>=3&&(r[0]!==o[0]||r[1]!==o[1])?[o,r]:[o];let a=null,d=1/0,c=null,h=1/0;for(const[t,n]of l){const o=Math.abs(e-t),r=Math.abs(i-n);o>s&&r>s||(o<=r?o<d&&(a=t,d=o):r<h&&(c=n,h=r))}return{point:[a??e,c??i],lockedX:null!==a,lockedY:null!==c}}_snappedVertexPoint(t,e,i,n,s,o){if(o)return[i,n];const r=this._pxToUnits(10),l=e>0?e-1:s?t.length-1:-1;if(l>=0&&l!==e)return qt(t[l],[i,n],r);const a=e<t.length-1?e+1:s?0:-1;return a>=0&&a!==e?qt(t[a],[i,n],r):[i,n]}_effectiveOpening(t){return this._liveOpeningEdit?.id===t.id?{...t,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}:t}_openingEndpoints(t){const e=this.walls.find(e=>e.id===t.wallId);if(!e)return null;const i=this._effectivePoints("wall",e.id,e.points),n=this._effectiveOpening(t);return Gt(n.x,n.y,n.width,i)}_snappedGeometryPoint(t,e,i,n){if(!n){const t=this._pxToUnits(me);let n=null;for(const s of this.walls){const o=parseFloat(this._wallStrokeWidth(s,It(s.material)))/2,r=Math.max(t,o);if(Vt(e,i,s.points)>r)continue;const l=Kt(s.points,e,i).point,a=Ft(e,i,l[0],l[1]);(!n||a<n.dist)&&(n={point:l,dist:a})}const s=function(t,e,i,n){let s=null,o=n;for(const n of t){if(n.points.length<2)continue;const{point:t}=jt(n.points,e,i),r=Ft(e,i,t[0],t[1]);r<=o&&(s=n,o=r)}return s}(this.rooms,e,i,t);if(s){const t=jt(s.points,e,i).point,o=Ft(e,i,t[0],t[1]);(!n||o<n.dist)&&(n={point:t,dist:o})}if(n)return{point:n.point,kind:"geometry",lockedX:!1,lockedY:!1}}const{point:s,lockedX:o,lockedY:r}=this._snappedTracePoint(t,e,i,n);return{point:s,kind:o||r?"axis":"none",lockedX:o,lockedY:r}}_hitTest(t,e,i){const n=this._pxToUnits(me);if("select"!==this.mode)return{type:"empty"};const s=this._editingTarget;if(s&&this._liveEditPoints){const t=this._liveEditPoints,e=ae(t,i.x,i.y,n);if(null!==e)return{type:"vertex",index:e};const o=ae("room"===s.kind?Yt(t):Xt(t),i.x,i.y,n);if(null!==o)return{type:"edgeMidpoint",index:o};const r="room"===s.kind?this.rooms.find(t=>t.id===s.id):void 0;return r&&this._roomLabelHit(r,i,n)?{type:"roomLabel",room:r}:{type:"empty"}}const o=this.rooms.find(t=>t.id===this.selectedRoomId);if(o&&this._roomLabelHit(o,i,n))return{type:"roomLabel",room:o};const r=le(this.pins,i.x,i.y,n);if(r.length>1)return{type:"pinStack",pins:r};if(1===r.length)return{type:"pin",pin:r[0]};const l=function(t,e,i,n){let s=null,o=n;for(const n of t){const t=Vt(e,i,[[n.fromPin.x,n.fromPin.y],[n.toPin.x,n.toPin.y]]);t<=o&&(s=n,o=t)}return s}(this.meshLinks,i.x,i.y,n);if(l)return{type:"meshLink",link:l};const a=function(t,e,i,n){let s=null,o=n;for(const n of t){const t=Math.min(Ft(n.x,n.y,e,i),Vt(e,i,[[n.fromPin.x,n.fromPin.y],[n.x,n.y]]));t<=o&&(s=n,o=t)}return s}(this.meshStubs,i.x,i.y,n);if(a)return{type:"meshStub",stub:a};if(this.selectedOpeningId){const t=this.openings.find(t=>t.id===this.selectedOpeningId),e=t?this._openingEndpoints(t):null;if(t&&e){const s=ae(e,i.x,i.y,n);if(null!==s)return{type:"openingHandle",opening:t,whichEnd:s}}}const d=function(t,e,i,n,s){let o=null,r=s;for(const s of t){const t=e.find(t=>t.id===s.wallId);if(!t)continue;const l=Gt(s.x,s.y,s.width,t.points);if(!l)continue;const a=Vt(i,n,l);a<=r&&(o=s,r=a)}return o}(this.openings,this.walls,i.x,i.y,n);if(d)return{type:"opening",opening:d};const c=de(this.walls,i.x,i.y,n);if(c)return{type:"wall",wall:c};const h=this.rooms.find(t=>t.points.length>=3&&zt(i.x,i.y,t.points));return h?{type:"room",room:h}:{type:"empty"}}_lockGesture(){return"align"===this.mode?{kind:"alignDrag"}:"vertex"===this._downHit?.type?{kind:"vertex",index:this._downHit.index}:"pin"===this._downHit?.type?{kind:"pin",pinId:this._downHit.pin.id}:"roomLabel"===this._downHit?.type?{kind:"roomLabel",roomId:this._downHit.room.id}:"openingHandle"===this._downHit?.type?{kind:"openingHandle",openingId:this._downHit.opening.id,whichEnd:this._downHit.whichEnd}:"opening"===this._downHit?.type?{kind:"openingMove",openingId:this._downHit.opening.id}:{kind:"pan"}}_dispatchVertexChanged(t){const e=this._editingTarget;if(!e)return;const i="room"===e.kind?"room-vertex-changed":"wall-vertex-changed",n="room"===e.kind?"roomId":"wallId";this.dispatchEvent(new CustomEvent(i,{detail:{[n]:e.id,points:t}}))}_commitGesture(){"vertex"===this._gesture?.kind&&this._editingTarget&&this._liveEditPoints?this._dispatchVertexChanged(this._liveEditPoints):"pin"===this._gesture?.kind&&this._liveDragPin?(this.dispatchEvent(new CustomEvent("pin-move",{detail:{pinId:this._liveDragPin.id,x:this._liveDragPin.x,y:this._liveDragPin.y}})),this._liveDragPin=null):"roomLabel"===this._gesture?.kind&&this._liveRoomLabel?(this.dispatchEvent(new CustomEvent("room-label-moved",{detail:{roomId:this._liveRoomLabel.id,x:this._liveRoomLabel.x,y:this._liveRoomLabel.y}})),this._liveRoomLabel=null):"openingMove"!==this._gesture?.kind&&"openingHandle"!==this._gesture?.kind||!this._liveOpeningEdit||(this.dispatchEvent(new CustomEvent("opening-update",{detail:{openingId:this._liveOpeningEdit.id,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}})),this._liveOpeningEdit=null)}_handleClick(t,e,i=!1){const n=this._clientToImage(t,e);if("trace"===this.mode){const t=this._pxToUnits(me),e=this._pendingTrace??{points:[]},{point:[s,o]}=this._snappedGeometryPoint(e.points,n.x,n.y,i),r=ce(e,s,o,t);return void(r.closed?(this.dispatchEvent(new CustomEvent("room-trace-complete",{detail:{points:e.points}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("wall"===this.mode){const t=this._pxToUnits(me),e=this._pendingTrace??{points:[]},{point:[s,o]}=this._snappedGeometryPoint(e.points,n.x,n.y,i),r=ce(e,s,o,t);return void(r.closed?(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:[...e.points,e.points[0]]}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("opening"===this.mode){if(!this.armedOpeningType)return;const t=this._pxToUnits(me),e=de(this.walls,n.x,n.y,t);if(!e)return;const{point:i}=Kt(e.points,n.x,n.y);return void this.dispatchEvent(new CustomEvent("opening-place",{detail:{wallId:e.id,x:i[0],y:i[1]}}))}if("scale"===this.mode){const t=[...this._pendingScalePoints,[n.x,n.y]];return void(t.length>=2?(this.dispatchEvent(new CustomEvent("scale-line-complete",{detail:{points:t.slice(0,2)}})),this._pendingScalePoints=[]):this._pendingScalePoints=t)}if("place"===this.mode){if(this.armedEntityId){const t=this._pxToUnits(me),e=le(this.pins,n.x,n.y,t)[0],i=e?.x??n.x,s=e?.y??n.y;this.dispatchEvent(new CustomEvent("pin-place",{detail:{x:i,y:s}}))}return}const s=this._downHit??{type:"empty"};if("vertex"===s.type)this._selectedVertexIndex=this._selectedVertexIndex===s.index?null:s.index;else if("edgeMidpoint"===s.type&&this._editingTarget&&this._liveEditPoints){const t=("room"===this._editingTarget.kind?Yt(this._liveEditPoints):Xt(this._liveEditPoints))[s.index],e=[...this._liveEditPoints];e.splice(s.index+1,0,t),this._liveEditPoints=e,this._dispatchVertexChanged(e)}else if("pin"===s.type)this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:this.selectedPinId===s.pin.id?null:s.pin.id}}));else if("pinStack"===s.type)this.dispatchEvent(new CustomEvent("pin-stack-select",{detail:{pinIds:s.pins.map(t=>t.id)}}));else if("roomLabel"===s.type&&this._editingTarget);else if("room"===s.type||"roomLabel"===s.type)this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:this.selectedRoomId===s.room.id?null:s.room.id}}));else if("wall"===s.type)this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:this.selectedWallId===s.wall.id?null:s.wall.id}}));else if("opening"===s.type)this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:this.selectedOpeningId===s.opening.id?null:s.opening.id}}));else if("meshLink"===s.type){const t=`${s.link.fromPin.id}|${s.link.toPin.id}`;this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:this.selectedMeshLinkKey===t?null:s.link}}))}else if("meshStub"===s.type){const t=`${s.stub.fromPin.id}|${s.stub.targetDeviceId}`;this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:this.selectedMeshStubKey===t?null:s.stub}}))}else if(this._editingTarget&&null!==this._selectedVertexIndex&&this._liveEditPoints){const t="room"===this._editingTarget.kind,[e,s]=this._snappedVertexPoint(this._liveEditPoints,this._selectedVertexIndex,n.x,n.y,t,i),o=[...this._liveEditPoints];o[this._selectedVertexIndex]=[e,s],this._liveEditPoints=o,this._selectedVertexIndex=null,this._dispatchVertexChanged(o)}else this._selectedVertexIndex=null,this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:null}})),this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:null}})),this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:null}})),this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:null}})),this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:null}})),this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:null}}))}finishPendingWall(){"wall"!==this.mode||!this._pendingTrace||this._pendingTrace.points.length<2||(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:this._pendingTrace.points}})),this._pendingTrace=null)}undoLastPoint(){if("scale"===this.mode&&this._pendingScalePoints.length>0)return this._pendingScalePoints=this._pendingScalePoints.slice(0,-1),!0;const t=this._pendingTrace?.points;return!(!t||0===t.length)&&(this._pendingTrace=t.length>1?{points:t.slice(0,-1)}:null,!0)}cancelPending(){this._pendingTrace=null,this._pendingScalePoints=[]}_deleteSelectedVertex(){const t=this._editingTarget;if(null===this._selectedVertexIndex||!t||!this._liveEditPoints)return;const e="room"===t.kind?3:2;if(this._liveEditPoints.length<=e)return;const i=this._liveEditPoints.filter((t,e)=>e!==this._selectedVertexIndex);this._liveEditPoints=i,this._selectedVertexIndex=null,this._dispatchVertexChanged(i)}_zoomBy(t,e){const i=Dt(this._viewBox.w*t,250,4e3),n=i/this._viewBox.w,s=this._viewBox.h*n;this._viewBox={x:e.x-(e.x-this._viewBox.x)*n,y:e.y-(e.y-this._viewBox.y)*n,w:i,h:s}}_zoomButton(t){const e=this._viewBox;this._zoomBy(t,{x:e.x+e.w/2,y:e.y+e.h/2})}_pinLabel(t){return t.label_override?t.label_override:xt(t.device_id,this.entityLookup.values())}_roomLabelPosition(t,e){return this._liveRoomLabel?.id===t.id?[this._liveRoomLabel.x,this._liveRoomLabel.y]:t.label_position??function(t){const e=Ut.get(t);if(e)return e;const i=t.length>=3?(()=>{const[e,i]=At([t],1);return[e,i]})():function(t){if(0===t.length)return[0,0];let e=0,i=0;for(const[n,s]of t)e+=n,i+=s;return[e/t.length,i/t.length]}(t);return Ut.set(t,i),i}(e)}_roomLabelHit(t,e,i){if(!1===t.visible)return!1;const n=this._effectivePoints("room",t.id,t.points);if(n.length<2)return!1;const[s,o]=this._roomLabelPosition(t,n),r=9*t.name.length/2;return e.x>=s-r-i&&e.x<=s+r+i&&e.y>=o-13-i&&e.y<=o+4+i}_renderRoom(t){if(!1===t.visible)return K;const e=this._effectivePoints("room",t.id,t.points);if(e.length<2)return K;const i=e.map(([t,e])=>`${t},${e}`).join(" "),[n,s]=this._roomLabelPosition(t,e),o=this.editingRoomId===t.id,r=t.id===this.selectedRoomId||o,l=t.fill_color??ye,a=t.fill_opacity??.18,d=t.border_opacity??1;return Y`
      <polygon
        class="room-poly ${r?"selected":""}"
        points=${i}
        fill=${l}
        fill-opacity=${r?Math.min(1,a*(.32/.18)):a}
        stroke=${l}
        stroke-opacity=${d}
        stroke-width=${r?3:2}
      ></polygon>
      <text class="room-label" x=${n} y=${s}>${t.name}</text>
      ${o?this._renderVertexHandles(e,!0):K}
    `}_renderVertexHandles(t,e){const i=this._pxToUnits(6),n=this._pxToUnits(4),s=e?Yt(t):Xt(t);return Y`
      ${s.map(([t,e])=>Y`<circle class="midpoint-handle" cx=${t} cy=${e} r=${n}></circle>`)}
      ${t.map(([t,e],n)=>{const s=n===this._selectedVertexIndex;return Y`
          <circle
            class="vertex-handle ${s?"selected":""}"
            cx=${t}
            cy=${e}
            r=${i}
          ></circle>
          ${s?Y`
                <g
                  class="vertex-delete"
                  transform="translate(${t+2.2*i}, ${e-2.2*i})"
                  @pointerdown=${t=>{t.stopPropagation()}}
                  @click=${t=>{t.stopPropagation(),this._deleteSelectedVertex()}}
                >
                  <circle r=${i}></circle>
                  <line
                    class="vertex-delete-x"
                    x1=${.5*-i}
                    y1=${.5*-i}
                    x2=${.5*i}
                    y2=${.5*i}
                  ></line>
                  <line
                    class="vertex-delete-x"
                    x1=${.5*-i}
                    y1=${.5*i}
                    x2=${.5*i}
                    y2=${.5*-i}
                  ></line>
                </g>
              `:K}
        `})}
    `}_renderMeshLink(t){const e=`${t.fromPin.id}|${t.toPin.id}`;return Y`
      <line
        class="mesh-link ${e===this.selectedMeshLinkKey?"selected":""}"
        x1=${t.fromPin.x}
        y1=${t.fromPin.y}
        x2=${t.toPin.x}
        y2=${t.toPin.y}
        style="stroke:${vt(t.quality)}"
      >
        <title>${t.detail??t.quality}</title>
      </line>
    `}_renderMeshStubLine(t){const e=`${t.fromPin.id}|${t.targetDeviceId}`;return Y`
      <line
        class="mesh-stub-line ${e===this.selectedMeshStubKey?"selected":""}"
        x1=${t.fromPin.x}
        y1=${t.fromPin.y}
        x2=${t.x}
        y2=${t.y}
        style="stroke:${vt(t.quality)}"
      >
        <title>${t.targetLabel} (${t.targetFloorName})</title>
      </line>
    `}_renderMeshStubMarkers(){const t=this._pxToUnits(10),e=this._pxToUnits(12),i=new Map;for(const t of this.meshStubs){const e=`${t.targetDeviceId}|${t.x},${t.y}`,n=`${t.fromPin.id}|${t.targetDeviceId}`===this.selectedMeshStubKey,s=i.get(e);s?n&&(s.selected=!0):i.set(e,{stub:t,selected:n})}const n=(t,e)=>t.minX<e.maxX&&e.minX<t.maxX&&t.minY<e.maxY&&e.minY<t.maxY,s=[];for(const t of this.rooms){if(!1===t.visible)continue;const e=this._effectivePoints("room",t.id,t.points);if(e.length<2)continue;const[i,n]=this._roomLabelPosition(t,e),o=9*t.name.length/2;s.push({minX:i-o,maxX:i+o,minY:n-13,maxY:n+4})}const o=this.pins.map(t=>({minX:t.x-e,maxX:t.x+e,minY:t.y-e,maxY:t.y+e}));return[...i.values()].map(({stub:e,selected:i})=>{const r=(e=>{const i=7*e.targetFloorName.length/2;return{minX:e.x-i,maxX:e.x+i,minY:e.y+t+3,maxY:e.y+t+17}})(e),l=!o.some(t=>n(r,t))&&!s.some(t=>n(r,t));return l&&s.push(r),Y`
        ${this._renderPinMarker(e.x,e.y,t,{kind:"path",d:"M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z"},"var(--sc-fg-secondary)",i,`${e.targetLabel} (${e.targetFloorName})`)}
        ${l?Y`<text class="mesh-stub-label" x=${e.x} y=${e.y+t+14}
                >${e.targetFloorName}</text
              >`:K}
      `})}_iconForPin(t){return this._pinIcons.iconForPin(t,this.entityLookup.values())}_pinGroups(){const t=new Map;for(const e of this.pins){const i=`${e.x},${e.y}`;t.has(i)||t.set(i,[]),t.get(i).push(e)}return[...t.values()].map(t=>({x:t[0].x,y:t[0].y,pins:t}))}_renderPinGroup(t){const e=this._pxToUnits(12);if(1===t.pins.length){const i=t.pins[0],n=this._liveDragPin?.id===i.id?this._liveDragPin:null,s=n?.x??i.x,o=n?.y??i.y,r=i.id===this.selectedPinId;return this._renderPinMarker(s,o,e,this._iconForPin(i),"var(--sc-accent)",r,this._pinLabel(i))}const i=t.pins.some(t=>t.id===this.selectedPinId),n=`${t.pins.length} devices: ${t.pins.map(t=>this._pinLabel(t)).join(", ")}`;return this._renderPinMarker(t.x,t.y,e,{kind:"path",d:"M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10M12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4M6 16C7.1 16 8 16.9 8 18S7.1 20 6 20 4 19.1 4 18 4.9 16 6 16M6 10C7.1 10 8 10.9 8 12S7.1 14 6 14 4 13.1 4 12 4.9 10 6 10M6 4C7.1 4 8 4.9 8 6S7.1 8 6 8 4 7.1 4 6 4.9 4 6 4M18 16C19.1 16 20 16.9 20 18S19.1 20 18 20 16 19.1 16 18 16.9 16 18 16M18 10C19.1 10 20 10.9 20 12S19.1 14 18 14 16 13.1 16 12 16.9 10 18 10M18 4C19.1 4 20 4.9 20 6S19.1 8 18 8 16 7.1 16 6 16.9 4 18 4Z"},"var(--sc-accent)",i,n)}_renderPinMarker(t,e,i,n,s,o,r){return this._pinIcons.renderMarker(t,e,i,n,s,o,r)}_renderPendingTrace(){const t=this._pendingTrace?.points??[];if(0===t.length&&!this._hoverSnap)return K;const e=t.map(([t,e])=>`${t},${e}`).join(" "),i=this._pxToUnits(6),n=t[t.length-1],s=t[0],o=!!this._hoverSnap&&!!s&&t.length>=3&&Ft(this._hoverSnap.point[0],this._hoverSnap.point[1],s[0],s[1])<=this._pxToUnits(me);return Y`
      ${t.length>0?Y`<polyline class="pending-trace" points=${e}></polyline>`:K}
      ${t.map(([t,e],n)=>Y`
          <circle
            class="vertex-handle ${0===n&&o?"closing":""}"
            cx=${t}
            cy=${e}
            r=${0===n&&o?1.6*i:i}
          ></circle>
        `)}
      ${this._hoverSnap?this._renderHoverSnap(n,s,o,i):K}
    `}_renderHoverSnap(t,e,i,n){if(!this._hoverSnap)return K;const[s,o]=this._hoverSnap.point,r=this._viewBox,l=i&&e?e:[s,o];return Y`
      ${this._hoverSnap.lockedY?Y`<line
              class="axis-guide"
              x1=${r.x}
              y1=${o}
              x2=${r.x+r.w}
              y2=${o}
            ></line>`:K}
      ${this._hoverSnap.lockedX?Y`<line
              class="axis-guide"
              x1=${s}
              y1=${r.y}
              x2=${s}
              y2=${r.y+r.h}
            ></line>`:K}
      ${t?Y`<line
              class="hover-snap-line ${i?"closing":""}"
              x1=${t[0]}
              y1=${t[1]}
              x2=${l[0]}
              y2=${l[1]}
            ></line>`:K}
      ${i?K:Y`<circle
              class="hover-snap-marker ${"geometry"===this._hoverSnap.kind?"on-geometry":"axis"===this._hoverSnap.kind?"on-axis":""}"
              cx=${s}
              cy=${o}
              r=${n}
            ></circle>`}
    `}_wallStrokeWidth(t,e){if(this.scale){const[[e,i],[n,s]]=this.scale.points,o=(Ft(e,i,n,s)||1)/this.scale.meters;return`${Dt(Pt(t)/100*o,.5,40)}`}return`${Dt(4+e.attenuationDbPerCm*Pt(t)/3,4,8)}px`}_renderWall(t){const e=this._effectivePoints("wall",t.id,t.points),i=t.id===this.selectedWallId,n=this.editingWallId===t.id,s=It(t.material),o=this._wallStrokeWidth(t,s),r=e[0],l=e[e.length-1],a=e.length>2&&!!r&&!!l&&r[0]===l[0]&&r[1]===l[1],d=(a?e.slice(0,-1):e).map(([t,e])=>`${t},${e}`).join(" "),c="wall-line "+(i||n?"selected":""),h=`stroke:${s.color}; stroke-width:${o}`;return Y`
      ${a?Y`<polygon class=${c} points=${d} style=${h}><title>${s.label}</title></polygon>`:Y`<polyline class=${c} points=${d} style=${h}><title>${s.label}</title></polyline>`}
      ${n?this._renderVertexHandles(e,!1):K}
    `}_renderOpening(t){const e=this._openingEndpoints(t);if(!e)return K;const[[i,n],[s,o]]=e,r=t.id===this.selectedOpeningId,l=this._pxToUnits(6),a=this.walls.find(e=>e.id===t.wallId),d=a?this._wallStrokeWidth(a,It(a.material)):void 0,c=Ft(i,n,s,o)||1,h=parseFloat(d??"6")/2*1.5,p=-(o-n)/c*h,u=(s-i)/c*h,_=(t,e)=>Y`
      <line
        class="opening-jamb-case"
        x1=${t-p}
        y1=${e-u}
        x2=${t+p}
        y2=${e+u}
      ></line>
      <line
        class="opening-jamb"
        x1=${t-p}
        y1=${e-u}
        x2=${t+p}
        y2=${e+u}
      ></line>
    `;return Y`
      <line
        class="opening-line ${t.type} ${r?"selected":""}"
        x1=${i}
        y1=${n}
        x2=${s}
        y2=${o}
        style=${d?`stroke-width:${d}`:K}
      >
        <title>${t.type}</title>
      </line>
      ${_(i,n)}
      ${_(s,o)}
      ${r?Y`
            <circle class="opening-handle" cx=${i} cy=${n} r=${l}></circle>
            <circle class="opening-handle" cx=${s} cy=${o} r=${l}></circle>
          `:K}
    `}_renderScaleLine(){if(!this.scale)return K;const[[t,e],[i,n]]=this.scale.points;return Y`
      <line class="scale-line" x1=${t} y1=${e} x2=${i} y2=${n}></line>
      <text class="scale-label" x=${(t+i)/2} y=${(e+n)/2-6}>
        ${te(this.scale.meters,this.unitSystem)}
        ${Qt(this.unitSystem)}
      </text>
    `}_renderPendingScale(){if(0===this._pendingScalePoints.length)return K;const t=this._pxToUnits(6),[e,i]=this._pendingScalePoints[0];return Y`<circle class="vertex-handle" cx=${e} cy=${i} r=${t}></circle>`}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return K;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),n=e+t*(this.backgroundOffsetX-this._viewBox.x),s=i+t*(this.backgroundOffsetY-this._viewBox.y),o=t*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${n}px, ${s}px) scale(${o});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${_e}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderAlignOverlay(){if(!this.alignOverlay)return K;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),n=e+t*(this.alignOverlay.offsetX-this._viewBox.x),s=i+t*(this.alignOverlay.offsetY-this._viewBox.y),o=t*this.alignOverlay.scale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${n}px, ${s}px) scale(${o});"
      >
        <img
          src=${this.alignOverlay.imageUrl}
          style="width:${_e}px; height:${this._alignNaturalHeight}px; opacity:${this.alignOverlay.opacity};"
        />
      </div>
    `}render(){const t=this._viewBox;return V`
      ${this._renderBackgroundOverlay()} ${this._renderAlignOverlay()}
      ${Y`
        <svg
          viewBox="${t.x} ${t.y} ${t.w} ${t.h}"
          class="${"pan"===this.mode||"align"===this.mode?"pan-mode":"select"!==this.mode?"draw-mode":""}"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @pointerleave=${this._onPointerLeave}
        >
          ${this.rooms.map(t=>this._renderRoom(t))}
          ${this.walls.map(t=>this._renderWall(t))}
          ${this.openings.map(t=>this._renderOpening(t))}
          ${this.meshLinks.map(t=>this._renderMeshLink(t))}
          ${this.meshStubs.map(t=>this._renderMeshStubLine(t))}
          ${this._renderMeshStubMarkers()}
          ${"trace"===this.mode||"wall"===this.mode?this._renderPendingTrace():K}
          ${this._renderScaleLine()}
          ${"scale"===this.mode?this._renderPendingScale():K}
          ${this._pinGroups().map(t=>this._renderPinGroup(t))}
        </svg>
      `}
      <div class="controls">
        <button @click=${()=>this.fitToScreen()} title="Fit to screen">
          ⤢ Fit
        </button>
        <button @click=${()=>this._zoomButton(.8)} title="Zoom in">+</button>
        <button @click=${()=>this._zoomButton(1.25)} title="Zoom out">
          −
        </button>
      </div>
    `}};ve.styles=[re,pe,r`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: white;
        user-select: none;
        -webkit-user-select: none;
      }
      svg {
        position: relative;
        width: 100%;
        height: 100%;
        touch-action: none;
        display: block;
        cursor: grab;
      }
      /* Dedicated Pan tool (Innerspace-style, separate from Select) — every
       * drag pans unconditionally (see _hitTest's mode !== "select" early
       * return), so every element shows the pan cursor too, not its own
       * pointer/ew-resize/copy hint. */
      svg.pan-mode * {
        cursor: grab !important;
      }
      /* Every non-select, non-pan mode (trace room/wall, add door/window,
       * set scale, place device) is a pure "click here to do the thing"
       * mode — _hitTest's mode !== select early return means none of
       * these ever select/drag an existing element, so none of them should
       * show the select-mode pointer/hand either. Both the svg root itself
       * (blank canvas) and its children need the override — the base
       * svg cursor:grab rule above only applies to the root element, so a
       * bare descendant selector would miss it. */
      svg.draw-mode,
      svg.draw-mode * {
        cursor: crosshair !important;
      }
      .bg-overlay {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        pointer-events: none;
      }
      .bg-overlay img {
        display: block;
        background: white;
      }
      .mesh-link {
        stroke-width: 2;
        opacity: 0.85;
        cursor: pointer;
      }
      .mesh-link.selected {
        stroke-width: 4;
        opacity: 1;
      }
      .mesh-stub-line {
        stroke-width: 2;
        stroke-dasharray: 6 4;
        opacity: 0.85;
        cursor: pointer;
      }
      .mesh-stub-line.selected {
        stroke-width: 4;
        opacity: 1;
      }
      .mesh-stub-label {
        fill: var(--sc-fg-secondary);
        font-size: 12px;
        text-anchor: middle;
        pointer-events: none;
        paint-order: stroke;
        stroke: var(--sc-bg);
        stroke-width: 3px;
      }
      .room-poly {
        /* fill/fill-opacity/stroke/stroke-opacity/stroke-width are set
         * inline per-render from the room's own style fields (see
         * _renderRoom), each falling back to DEFAULT_ROOM_* when unset —
         * not fixed here, since a plain class can't vary per room. */
        cursor: pointer;
      }
      .room-label {
        fill: var(--sc-fg);
        font-size: 16px;
        text-anchor: middle;
        pointer-events: none;
        paint-order: stroke;
        stroke: var(--sc-bg);
        stroke-width: 3px;
      }
      .pending-trace {
        fill: none;
        stroke: var(--sc-accent);
        stroke-width: 2;
        stroke-dasharray: 6 4;
      }
      .wall-line {
        fill: none;
        cursor: pointer;
      }
      .wall-line.selected {
        stroke: var(--sc-danger) !important;
      }
      .opening-line {
        /* Width is set inline per-opening from its own wall's real
         * thickness (see _renderOpening/_wallStrokeWidth) — matches the
         * wall it's drawn on instead of one fixed width for every door
         * and window regardless of what wall they're set into. */
        cursor: pointer;
      }
      .opening-line.door {
        stroke: #d7ccc8;
      }
      .opening-line.window {
        stroke: #81d4fa;
      }
      .opening-line.selected {
        stroke: var(--sc-danger);
      }
      .opening-handle {
        fill: white;
        stroke: var(--sc-danger);
        stroke-width: 2;
        cursor: ew-resize;
      }
      .opening-jamb-case {
        stroke: #ffffff;
        stroke-width: 3.4;
        pointer-events: none;
      }
      .opening-jamb {
        stroke: #212121;
        stroke-width: 1.6;
        pointer-events: none;
      }
      .pending-scale,
      .scale-line {
        stroke: #43a047;
        stroke-width: 2;
        stroke-dasharray: 4 3;
      }
      .scale-label {
        fill: #43a047;
        font-size: 14px;
        text-anchor: middle;
        paint-order: stroke;
        stroke: var(--sc-bg);
        stroke-width: 3px;
      }
      .vertex-handle {
        fill: white;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: pointer;
      }
      .vertex-handle.selected {
        fill: var(--sc-danger);
      }
      .hover-snap-line {
        fill: none;
        stroke: var(--sc-accent);
        stroke-width: 2;
        stroke-dasharray: 6 4;
        opacity: 0.6;
        pointer-events: none;
      }
      .hover-snap-line.closing {
        stroke: #2e7d32;
        stroke-dasharray: none;
        opacity: 1;
      }
      .hover-snap-marker {
        fill: white;
        stroke: var(--sc-accent);
        stroke-width: 2;
        opacity: 0.6;
        pointer-events: none;
      }
      .hover-snap-marker.on-geometry {
        fill: var(--sc-accent);
        opacity: 1;
      }
      /* A distinct hue from the app's own accent blue — a dedicated
       * "alignment guide" color (the same convention design tools like
       * Figma use) so it never gets confused with a geometry snap. */
      .hover-snap-marker.on-axis {
        fill: #e91e63;
        stroke: #e91e63;
        opacity: 1;
      }
      .axis-guide {
        stroke: #e91e63;
        stroke-width: 1;
        opacity: 0.8;
        pointer-events: none;
      }
      .vertex-handle.closing {
        fill: #2e7d32;
        stroke: #2e7d32;
      }
      .vertex-delete {
        fill: var(--sc-danger);
        cursor: pointer;
      }
      .vertex-delete-x {
        stroke: white;
        stroke-width: 1.5;
        pointer-events: none;
      }
      .midpoint-handle {
        fill: var(--sc-accent);
        opacity: 0.5;
        cursor: copy;
      }
      .controls {
        position: absolute;
        right: 12px;
        bottom: 12px;
        display: flex;
        gap: 4px;
      }
      .controls button {
        background: var(--sc-panel-bg);
        box-shadow: var(--sc-panel-shadow);
        border-radius: var(--sc-panel-radius);
      }
    `],t([ut({attribute:!1})],ve.prototype,"rooms",void 0),t([ut({attribute:!1})],ve.prototype,"pins",void 0),t([ut({attribute:!1})],ve.prototype,"walls",void 0),t([ut({attribute:!1})],ve.prototype,"openings",void 0),t([ut({attribute:!1})],ve.prototype,"scale",void 0),t([ut({attribute:!1})],ve.prototype,"unitSystem",void 0),t([ut({attribute:!1})],ve.prototype,"meshLinks",void 0),t([ut({attribute:!1})],ve.prototype,"meshStubs",void 0),t([ut({attribute:!1})],ve.prototype,"entityLookup",void 0),t([ut({attribute:!1})],ve.prototype,"backgroundImageUrl",void 0),t([ut({type:Number})],ve.prototype,"backgroundOpacity",void 0),t([ut({type:Number})],ve.prototype,"backgroundOffsetX",void 0),t([ut({type:Number})],ve.prototype,"backgroundOffsetY",void 0),t([ut({type:Number})],ve.prototype,"backgroundScale",void 0),t([ut({attribute:!1})],ve.prototype,"alignOverlay",void 0),t([ut({attribute:!1})],ve.prototype,"initialViewBox",void 0),t([ut({type:Boolean})],ve.prototype,"sameBuildingAsPrevious",void 0),t([ut({attribute:!1})],ve.prototype,"mode",void 0),t([ut({attribute:!1})],ve.prototype,"armedEntityId",void 0),t([ut({attribute:!1})],ve.prototype,"armedOpeningType",void 0),t([ut({attribute:!1})],ve.prototype,"selectedRoomId",void 0),t([ut({attribute:!1})],ve.prototype,"editingRoomId",void 0),t([ut({attribute:!1})],ve.prototype,"editingWallId",void 0),t([ut({attribute:!1})],ve.prototype,"selectedPinId",void 0),t([ut({attribute:!1})],ve.prototype,"selectedWallId",void 0),t([ut({attribute:!1})],ve.prototype,"selectedOpeningId",void 0),t([ut({attribute:!1})],ve.prototype,"selectedMeshLinkKey",void 0),t([ut({attribute:!1})],ve.prototype,"selectedMeshStubKey",void 0),t([_t()],ve.prototype,"_viewBox",void 0),t([_t()],ve.prototype,"_naturalHeight",void 0),t([_t()],ve.prototype,"_alignNaturalHeight",void 0),t([_t()],ve.prototype,"_pendingTrace",void 0),t([_t()],ve.prototype,"_hoverSnap",void 0),t([_t()],ve.prototype,"_pendingScalePoints",void 0),t([_t()],ve.prototype,"_liveEditPoints",void 0),t([_t()],ve.prototype,"_liveDragPin",void 0),t([_t()],ve.prototype,"_liveOpeningEdit",void 0),t([_t()],ve.prototype,"_selectedVertexIndex",void 0),t([gt("svg")],ve.prototype,"_svg",void 0),t([_t()],ve.prototype,"_liveRoomLabel",void 0),ve=t([mt("floorplan-canvas")],ve);const fe=[[-1,-1],[1,-1],[1,1],[-1,1]];let be=class extends dt{constructor(){super(...arguments),this.placements=[],this.floorNameById=new Map,this.floorIconById=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.85,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.mode="select",this.selectedPlacementId=null,this.pins=[],this.selectedPinId=null,this.entityLookup=new Map,this.meshLinks=[],this.selectedMeshLinkKey=null,this.initialViewBox=null,this._viewBox={x:0,y:0,w:_e,h:750},this._naturalHeight=750,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._pinIcons=new ue(this),this._hasFittedOnce=!1,this._onPointerDown=t=>{if("mouse"!==t.pointerType||0===t.button){if(this._svg.setPointerCapture(t.pointerId),this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,n={x:(e.x+i.x)/2,y:(e.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:Ft(e.x,e.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(n.x,n.y)})}this._pointers.size>2||(this._downClient={x:t.clientX,y:t.clientY},this._lastClient={x:t.clientX,y:t.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(t.clientX,t.clientY):{type:"empty"})}},this._onPointerMove=t=>{if(!this._pointers.has(t.pointerId))return;if(this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,n=Ft(e.x,e.y,i.x,i.y)||1,s=this._gesture.startDistance/n,o=this._gesture.startViewBox,r=Dt(o.w*s,250,4e3),l=r/o.w,a=o.h*l,{x:d,y:c}=this._gesture.midImage;return void(this._viewBox={x:d-(d-o.x)*l,y:c-(c-o.y)*l,w:r,h:a})}if(1!==this._pointers.size||!this._downClient)return;if(!this._moved){if(Ft(this._downClient.x,this._downClient.y,t.clientX,t.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"===this._gesture?.kind&&(this._svg.style.cursor="grabbing")}const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};if("pan"===this._gesture?.kind)this._viewBox={...this._viewBox,x:this._viewBox.x-(t.clientX-i.x)/e,y:this._viewBox.y-(t.clientY-i.y)/e};else if("move"===this._gesture?.kind)this._fire("placement-move",{id:this._gesture.id,dx:(t.clientX-i.x)/e,dy:(t.clientY-i.y)/e});else if("pinMove"===this._gesture?.kind){const e=this._clientToImage(t.clientX,t.clientY);this._fire("outdoor-pin-move",{id:this._gesture.id,x:e.x,y:e.y})}else if("resize"===this._gesture?.kind){const e=this._gesture,i=this.placements.find(t=>t.id===e.id);if(i){const[n,s]=fe[e.corner],o=-n,r=-s,l=this._clientToImage(t.clientX,t.clientY),a=i.rotation_deg*Math.PI/180,d=Math.cos(a),c=Math.sin(a),h=l.x-e.anchorWorld.x,p=l.y-e.anchorWorld.y,u=d*h+c*p,_=-c*h+d*p,g=Math.max(10,n*u),m=Math.max(10,s*_),y=i.aspect_ratio||g/m||1,v=Math.max(g,m*y),f=v/y,b=o*(v/2),x=r*(f/2);this._fire("placement-resize",{id:i.id,width:v,height:f,x:e.anchorWorld.x-(d*b-c*x),y:e.anchorWorld.y-(c*b+d*x)})}}else if("rotate"===this._gesture?.kind){const e=this._gesture.id,i=this.placements.find(t=>t.id===e);if(i){const e=this._clientToImage(t.clientX,t.clientY),n=((180*Math.atan2(e.y-i.y,e.x-i.x)/Math.PI+90)%360+360)%360;this._fire("placement-rotate",{id:i.id,rotationDeg:n})}}this._lastClient={x:t.clientX,y:t.clientY}},this._onPointerUp=t=>{this._pointers.delete(t.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(t.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(!this._moved&&this._downClient&&this._handleClick(),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1)},this._onWheel=t=>{if(t.preventDefault(),t.ctrlKey){const e=t.deltaY<0?.9:1.1;return void this._zoomBy(e,this._clientToImage(t.clientX,t.clientY))}const e=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+t.deltaX*e,y:this._viewBox.y+t.deltaY*e}}}firstUpdated(){this.initialViewBox?(this._viewBox={...this.initialViewBox},this._hasFittedOnce=!0):(this.fitToScreen(),this._hasFittedOnce=this.placements.length>0||!this.backgroundImageUrl),this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(t){if(t.has("backgroundImageUrl")&&this.backgroundImageUrl){const t=new Image;t.onload=()=>{this._naturalHeight=t.naturalHeight/t.naturalWidth*_e||750,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},t.src=this.backgroundImageUrl}}_contentBounds(){if(0===this.placements.length&&0===this.pins.length)return null;const t=[...this.placements.flatMap(t=>[t.x-t.width,t.x+t.width]),...this.pins.map(t=>t.x)],e=[...this.placements.flatMap(t=>[t.y-t.height,t.y+t.height]),...this.pins.map(t=>t.y)],i=Math.min(...t),n=Math.max(...t),s=Math.min(...e),o=Math.max(...e),r=.15*Math.max(n-i,o-s)||60;return{x:i-r,y:s-r,w:n-i+2*r,h:o-s+2*r}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:_e,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const t=this._svg?.getBoundingClientRect(),e=t?.width||this._viewBox.w,i=t?.height||this._viewBox.h,n=Math.min(e/this._viewBox.w,i/this._viewBox.h)||1;return{scale:n,offsetX:(e-this._viewBox.w*n)/2,offsetY:(i-this._viewBox.h*n)/2}}_pxToUnits(t){return t/this._svgTransform().scale}_clientToImage(t,e){const i=this._svg,n=i.createSVGPoint();n.x=t,n.y=e;const s=i.getScreenCTM();if(!s)return{x:0,y:0};const o=n.matrixTransform(s.inverse());return{x:o.x,y:o.y}}_toLocal(t,e,i){const n=t.rotation_deg*Math.PI/180,s=Math.cos(n),o=Math.sin(n),r=e-t.x,l=i-t.y;return{x:s*r+o*l,y:-o*r+s*l}}_localToWorld(t,e,i){const n=t.rotation_deg*Math.PI/180,s=Math.cos(n),o=Math.sin(n);return{x:t.x+s*e-o*i,y:t.y+o*e+s*i}}_hitTest(t,e){const i=this._clientToImage(t,e),n=this._pxToUnits(12*1.4);for(const t of[...this.pins].reverse())if(Ft(t.x,t.y,i.x,i.y)<=n)return{type:"pin",id:t.id};const s=this.placements.find(t=>t.id===this.selectedPlacementId);if(s){const i=this._pxToUnits(26),n=fe.map(([t,e])=>[t*s.width/2,e*s.height/2]);for(let i=0;i<n.length;i++){const[o,r]=n[i],l=this._localToWorld(s,o,r),a=this._imageToClient(l.x,l.y);if(Ft(a.x,a.y,t,e)<=14)return{type:"resizeHandle",id:s.id,corner:i}}const o=this._localToWorld(s,0,-s.height/2-i),r=this._imageToClient(o.x,o.y);if(Ft(r.x,r.y,t,e)<=14)return{type:"rotateHandle",id:s.id}}let o=null,r=this._pxToUnits(8);for(const t of this.meshLinks){const e=Nt(i.x,i.y,t.from.x,t.from.y,t.to.x,t.to.y);e<=r&&(o=t,r=e)}if(o)return{type:"meshLink",key:o.key};for(const t of[...this.placements].reverse()){const e=this._toLocal(t,i.x,i.y);if(Math.abs(e.x)<=t.width/2&&Math.abs(e.y)<=t.height/2)return{type:"body",id:t.id}}return{type:"empty"}}_imageToClient(t,e){const i=this._svg.getBoundingClientRect(),{scale:n,offsetX:s,offsetY:o}=this._svgTransform();return{x:i.left+s+(t-this._viewBox.x)*n,y:i.top+o+(e-this._viewBox.y)*n}}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_lockGesture(){if("resizeHandle"===this._downHit?.type){const t=this._downHit,e=this.placements.find(e=>e.id===t.id);if(!e)return{kind:"pan"};const[i,n]=fe[t.corner],s=this._localToWorld(e,-i*e.width/2,-n*e.height/2);return{kind:"resize",id:e.id,corner:t.corner,anchorWorld:s}}return"rotateHandle"===this._downHit?.type?{kind:"rotate",id:this._downHit.id}:"body"===this._downHit?.type?{kind:"move",id:this._downHit.id}:"pin"===this._downHit?.type?{kind:"pinMove",id:this._downHit.id}:{kind:"pan"}}_handleClick(){if("place"===this.mode||"place-pin"===this.mode){if(!this._downClient)return;const t=this._clientToImage(this._downClient.x,this._downClient.y);return void this._fire("place"===this.mode?"placement-place":"outdoor-pin-place",{x:t.x,y:t.y})}const t=this._downHit;"pin"===t?.type?this._fire("outdoor-pin-select",{id:t.id}):"meshLink"===t?.type?this._fire("property-mesh-link-select",{key:t.key===this.selectedMeshLinkKey?null:t.key}):(this._fire("outdoor-pin-select",{id:null}),this._fire("property-mesh-link-select",{key:null}),this._fire("placement-select",{id:"body"===t?.type?t.id:null}))}_zoomBy(t,e){const i=Dt(this._viewBox.w*t,250,4e3),n=i/this._viewBox.w,s=this._viewBox.h*n;this._viewBox={x:e.x-(e.x-this._viewBox.x)*n,y:e.y-(e.y-this._viewBox.y)*n,w:i,h:s}}_zoomButton(t){const e=this._viewBox;this._zoomBy(t,{x:e.x+e.w/2,y:e.y+e.h/2})}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return K;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),n=e+t*(this.backgroundOffsetX-this._viewBox.x),s=i+t*(this.backgroundOffsetY-this._viewBox.y),o=t*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${n}px, ${s}px) scale(${o});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${_e}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderPlacement(t){const e=t.id===this.selectedPlacementId,i=t.label_override||this.floorNameById.get(t.floor_id)||t.floor_id,n=this._pxToUnits(7),s=this._pxToUnits(26);return Y`
      <g transform="translate(${t.x} ${t.y}) rotate(${t.rotation_deg})">
        <rect
          class="placement-rect ${e?"selected":""}"
          x=${-t.width/2}
          y=${-t.height/2}
          width=${t.width}
          height=${t.height}
        ></rect>
        <text class="placement-label" y=${-t.height/2-n}>${i}</text>
        ${e?Y`
              <line
                class="rotate-stick"
                x1="0" y1=${-t.height/2}
                x2="0" y2=${-t.height/2-s}
              ></line>
              <circle class="rotate-handle" cx="0" cy=${-t.height/2-s} r=${n}></circle>
              <circle class="resize-handle" cx=${-t.width/2} cy=${-t.height/2} r=${n}></circle>
              <circle class="resize-handle" cx=${t.width/2} cy=${-t.height/2} r=${n}></circle>
              <circle class="resize-handle" cx=${t.width/2} cy=${t.height/2} r=${n}></circle>
              <circle class="resize-handle" cx=${-t.width/2} cy=${t.height/2} r=${n}></circle>
            `:K}
      </g>
    `}_renderMeshLink(t){const e=null!==t.from.floorId||null!==t.to.floorId;return Y`
      <line
        class="mesh-link ${e?"indoor":""} ${t.key===this.selectedMeshLinkKey?"selected":""}"
        x1=${t.from.x}
        y1=${t.from.y}
        x2=${t.to.x}
        y2=${t.to.y}
        style="stroke:${vt(t.quality)}"
      >
        <title>${t.from.label} → ${t.to.label}: ${t.detail??t.quality}</title>
      </line>
    `}_renderIndoorEnds(){const t=this._pxToUnits(5),e=new Map;for(const t of this.meshLinks)for(const i of[t.from,t.to])null!==i.floorId&&e.set(i.deviceId,i);return[...e.values()].map(e=>Y`
        <circle class="indoor-end" cx=${e.x} cy=${e.y} r=${t}>
          <title>${e.label}</title>
        </circle>
      `)}_renderPin(t){return this._pinIcons.renderMarker(t.x,t.y,this._pxToUnits(12),this._pinIcons.iconForPin(t,this.entityLookup.values()),"var(--sc-accent)",t.id===this.selectedPinId,t.label_override??xt(t.device_id,this.entityLookup.values()))}render(){const t=this._viewBox;return V`
      ${this._renderBackgroundOverlay()}
      ${Y`
        <svg
          viewBox="${t.x} ${t.y} ${t.w} ${t.h}"
          class="${"select"!==this.mode?"place-mode":""}"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
        >
          ${this.placements.map(t=>this._renderPlacement(t))}
          ${this.meshLinks.map(t=>this._renderMeshLink(t))}
          ${this._renderIndoorEnds()}
          ${this.pins.map(t=>this._renderPin(t))}
        </svg>
      `}
      <div class="controls">
        <button @click=${()=>this.fitToScreen()} title="Fit to screen">
          ⤢ Fit
        </button>
        <button @click=${()=>this._zoomButton(.8)} title="Zoom in">+</button>
        <button @click=${()=>this._zoomButton(1.25)} title="Zoom out">
          −
        </button>
      </div>
    `}};be.styles=[re,pe,r`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: white;
        user-select: none;
        -webkit-user-select: none;
      }
      svg {
        position: relative;
        width: 100%;
        height: 100%;
        touch-action: none;
        display: block;
        cursor: grab;
      }
      svg.place-mode,
      svg.place-mode * {
        cursor: crosshair !important;
      }
      .bg-overlay {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        pointer-events: none;
      }
      .bg-overlay img {
        display: block;
        background: white;
      }
      .placement-rect {
        fill: var(--sc-accent);
        fill-opacity: 0.25;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: pointer;
      }
      .placement-rect.selected {
        stroke: var(--sc-danger);
        stroke-width: 3;
        fill-opacity: 0.35;
      }
      .placement-label {
        fill: var(--sc-fg);
        font-size: 16px;
        text-anchor: middle;
        pointer-events: none;
        paint-order: stroke;
        stroke: var(--sc-bg);
        stroke-width: 3px;
      }
      .rotate-stick {
        stroke: var(--sc-danger);
        stroke-width: 1.5;
      }
      .rotate-handle {
        fill: white;
        stroke: var(--sc-danger);
        stroke-width: 2;
        cursor: alias;
      }
      .resize-handle {
        fill: white;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: nwse-resize;
      }
      .mesh-link {
        stroke-width: 2;
        opacity: 0.85;
        cursor: pointer;
      }
      .mesh-link.indoor {
        stroke-dasharray: 6 4;
      }
      .mesh-link.selected {
        stroke-width: 4;
        opacity: 1;
      }
      .indoor-end {
        fill: var(--sc-fg-secondary);
        stroke: white;
        stroke-width: 1.5;
        pointer-events: none;
      }
      .controls {
        position: absolute;
        right: 12px;
        bottom: 12px;
        display: flex;
        gap: 4px;
      }
      .controls button {
        background: var(--sc-panel-bg);
        box-shadow: var(--sc-panel-shadow);
        border-radius: var(--sc-panel-radius);
      }
    `],t([ut({attribute:!1})],be.prototype,"placements",void 0),t([ut({attribute:!1})],be.prototype,"floorNameById",void 0),t([ut({attribute:!1})],be.prototype,"floorIconById",void 0),t([ut({attribute:!1})],be.prototype,"backgroundImageUrl",void 0),t([ut({type:Number})],be.prototype,"backgroundOpacity",void 0),t([ut({type:Number})],be.prototype,"backgroundOffsetX",void 0),t([ut({type:Number})],be.prototype,"backgroundOffsetY",void 0),t([ut({type:Number})],be.prototype,"backgroundScale",void 0),t([ut({attribute:!1})],be.prototype,"mode",void 0),t([ut({attribute:!1})],be.prototype,"selectedPlacementId",void 0),t([ut({attribute:!1})],be.prototype,"pins",void 0),t([ut({attribute:!1})],be.prototype,"selectedPinId",void 0),t([ut({attribute:!1})],be.prototype,"entityLookup",void 0),t([ut({attribute:!1})],be.prototype,"meshLinks",void 0),t([ut({attribute:!1})],be.prototype,"selectedMeshLinkKey",void 0),t([ut({attribute:!1})],be.prototype,"initialViewBox",void 0),t([_t()],be.prototype,"_viewBox",void 0),t([_t()],be.prototype,"_naturalHeight",void 0),t([gt("svg")],be.prototype,"_svg",void 0),be=t([mt("property-canvas")],be);const xe={en:{floorTabs:{property:"Property"},appHeader:{saving:"Saving…",save:"Save"}},de:{floorTabs:{property:"Anwesen"},appHeader:{saving:"Speichert…",save:"Speichern"}}};function $e(t,e){let i=t;for(const t of e.split(".")){if("object"!=typeof i||null===i)return;i=i[t]}return"string"==typeof i?i:void 0}function we(t,e){return $e(xe.en,t)??$e(xe.en,t)??t}let ke=class extends dt{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1}render(){return V`
      ${this.floors.map(t=>V`
          <button
            class=${this.propertySelected||t.floor_id!==this.selectedFloorId?"":"active"}
            @click=${()=>this.dispatchEvent(new CustomEvent("floor-selected",{detail:{floorId:t.floor_id},bubbles:!0,composed:!0}))}
          >
            <ha-icon icon=${function(t){if(t.icon)return t.icon;switch(t.level){case 0:return"mdi:home-floor-0";case 1:return"mdi:home-floor-1";case 2:return"mdi:home-floor-2";case 3:return"mdi:home-floor-3";case-1:return"mdi:home-floor-negative-1";default:return"mdi:home"}}(t)}></ha-icon>
            <span class=${t.has_layout?"":"unset"}>${t.name}</span>
          </button>
        `)}
      <span class="divider"></span>
      <button
        class=${this.propertySelected?"active":""}
        @click=${()=>this.dispatchEvent(new CustomEvent("property-selected",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon="mdi:map"></ha-icon>
        <span>${we("floorTabs.property")}</span>
      </button>
    `}};ke.styles=[re,r`
      :host {
        display: flex;
        height: 100%;
      }
      button {
        height: 100%;
        border-radius: 0;
        padding: 0 24px;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: normal;
        text-transform: none;
        color: var(--sc-fg);
        border-bottom: 2px solid transparent;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      button ha-icon {
        --mdc-icon-size: 18px;
      }
      /* Centered between the app name and the header's action icons via
       * auto margins rather than justify-content: center — when the tabs
       * overflow (narrow screens) auto margins collapse to 0 and the row
       * scrolls from its start, where center would push the first tabs
       * off the left edge, out of scroll reach. */
      :host > :first-child {
        margin-left: auto;
      }
      :host > :last-child {
        margin-right: auto;
      }
      .divider {
        width: 1px;
        height: 24px;
        align-self: center;
        background: var(--sc-divider);
        margin: 0 4px;
      }
      button:hover {
        background: transparent;
        color: var(--sc-fg);
      }
      button.active {
        background: transparent;
        color: var(--sc-accent);
        border-bottom-color: var(--sc-accent);
      }
      button.active:hover {
        background: transparent;
        color: var(--sc-accent);
      }
      .unset {
        opacity: 0.6;
        font-style: italic;
      }
      @media (max-width: 600px) {
        button {
          padding: 0 12px;
        }
        button span {
          display: none;
        }
      }
    `],t([ut({attribute:!1})],ke.prototype,"floors",void 0),t([ut({attribute:!1})],ke.prototype,"selectedFloorId",void 0),t([ut({type:Boolean})],ke.prototype,"propertySelected",void 0),ke=t([mt("floor-tabs")],ke);let Ie=class extends dt{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1,this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}render(){return V`
      <div class="identity">
        <button
          class="icon-button menu-button"
          title="Menu"
          @click=${()=>this._fire("hass-toggle-menu")}
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>
        <img class="app-icon" src="/spatial_context/icon.png" alt="" />
        <div>
          <h1>Spatial Context</h1>
          <div class="subtitle">v0.9.0-beta.1</div>
        </div>
      </div>
      <floor-tabs
        .floors=${this.floors}
        .selectedFloorId=${this.selectedFloorId}
        .propertySelected=${this.propertySelected}
      ></floor-tabs>
      <div class="actions">
        <slot></slot>
        <button
          class="icon-button"
          title="Undo (Ctrl/Cmd+Z)"
          ?disabled=${!this.canUndo}
          @click=${()=>this._fire("undo-click")}
        >
          <ha-icon icon="mdi:undo"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Redo (Ctrl/Cmd+Shift+Z)"
          ?disabled=${!this.canRedo}
          @click=${()=>this._fire("redo-click")}
        >
          <ha-icon icon="mdi:redo"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${this.saving?we("appHeader.saving"):we("appHeader.save")}
          ?disabled=${this.saving}
          @click=${()=>this._fire("save-click")}
        >
          <ha-icon icon="mdi:content-save"></ha-icon>
          ${this.dirty?V`<span class="dirty-dot"></span>`:K}
        </button>
        <slot name="end"></slot>
      </div>
    `}};Ie.styles=[re,r`
      :host {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        height: 56px;
        padding: 0 8px 0 4px;
        background: var(--sc-header-bg);
        border-bottom: 1px solid var(--sc-divider);
      }
      .identity {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        overflow: hidden;
      }
      .identity .app-icon {
        width: 38px;
        height: 38px;
        flex: none;
        border-radius: 8px;
        display: block;
      }
      .identity .menu-button {
        flex: none;
        width: 40px;
        height: 40px;
        margin-right: -4px;
      }
      .identity h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
        line-height: 1.2;
        white-space: nowrap;
      }
      .identity .subtitle {
        font-size: 12px;
        color: var(--sc-fg-secondary);
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      floor-tabs {
        align-self: stretch;
        justify-self: stretch;
        min-width: 0;
        width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
      }
      floor-tabs::-webkit-scrollbar {
        display: none;
      }
      @media (max-width: 600px) {
        /* Seven header actions (incl. undo/redo) need to fit a phone. */
        .icon-button {
          width: 40px;
          height: 40px;
        }
      }
      @media (max-width: 480px) {
        .identity .subtitle {
          display: none;
        }
        .identity h1 {
          font-size: 16px;
        }
      }
      .actions {
        display: flex;
        align-items: center;
        justify-self: end;
        gap: 2px;
        position: relative;
      }
      .icon-button {
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .icon-button ha-icon {
        --mdc-icon-size: 20px;
      }
      .icon-button.active {
        background: rgba(0, 0, 0, 0.06);
      }
      .dirty-dot {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--sc-danger);
      }
    `],t([ut({attribute:!1})],Ie.prototype,"floors",void 0),t([ut({attribute:!1})],Ie.prototype,"selectedFloorId",void 0),t([ut({type:Boolean})],Ie.prototype,"propertySelected",void 0),t([ut({type:Boolean})],Ie.prototype,"dirty",void 0),t([ut({type:Boolean})],Ie.prototype,"saving",void 0),t([ut({type:Boolean})],Ie.prototype,"canUndo",void 0),t([ut({type:Boolean})],Ie.prototype,"canRedo",void 0),Ie=t([mt("app-header")],Ie);let Pe=class extends dt{constructor(){super(...arguments),this.mode="select",this.armedOpeningType=null,this.hasPendingTrace=!1,this.hasPendingWall=!1,this.pendingScaleCount=0,this.scaleReadout=null,this.selectedRoom=null,this.editingRoom=!1,this.areas=[],this.selectedPin=null,this.selectedWall=null,this.editingWall=!1,this.unitSystem="metric",this.unitsPerMeter=null,this.pinStack=null,this.entityLookup=new Map,this.selectedOpening=null,this.selectedMeshLink=null,this.selectedMeshStub=null,this.otherFloors=[],this.alignTargetFloorId=null,this.alignTargetHasBackground=!0,this._wallThicknessUnit=null,this._openingWidthUnit=null}willUpdate(t){t.has("selectedWall")&&t.get("selectedWall")?.id!==this.selectedWall?.id&&(this._wallThicknessUnit=null),t.has("selectedOpening")&&t.get("selectedOpening")?.id!==this.selectedOpening?.id&&(this._openingWidthUnit=null)}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_unitSelect(t,e){return V`
      <select
        class="small-unit-select"
        @change=${t=>e(t.target.value)}
      >
        ${(i=this.unitSystem,"imperial"===i?["in","ft"]:["cm","m"]).map(e=>V`<option value=${e} ?selected=${e===t}>
              ${e}
            </option>`)}
      </select>
    `;var i}_thicknessInputAttrs(t){switch(t){case"cm":return{min:"1",max:"100",step:"0.5"};case"m":return{min:"0.01",max:"1",step:"0.01"};case"in":return{min:"0.5",max:"40",step:"0.1"};case"ft":return{min:"0.02",max:"1.5",step:"0.01"}}}_modeButton(t,e,i){return V`<button
      class=${this.mode===t?"active":""}
      title=${i}
      @click=${()=>this._fire("mode-change",{mode:t})}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_openingModeButton(t,e,i){const n="opening"===this.mode&&this.armedOpeningType===t;return V`<button
      class=${n?"active":""}
      title=${i}
      @click=${()=>this._fire("add-opening-click",{openingType:t})}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_renderModeToolbar(){return V`
      <div class="mode-toolbar floating-panel">
        ${this._modeButton("select","mdi:cursor-default-click","Select")}
        ${this._modeButton("pan","mdi:hand-back-right-outline","Pan")}
        ${this._modeButton("trace","mdi:vector-square","Trace Room")}
        ${this._modeButton("wall","mdi:wall","Trace Wall")}
        ${this._openingModeButton("door","mdi:door","Add Door")}
        ${this._openingModeButton("window","mdi:window-closed-variant","Add Window")}
        ${this._modeButton("scale","mdi:ruler","Set Scale")}
        ${this._modeButton("place","mdi:map-marker-plus","Place Device")}
        ${this._modeButton("align","mdi:compare","Align Floors")}
      </div>
    `}_renderHintBar(){return"trace"===this.mode&&this.hasPendingTrace?V`<div class="hint-bar floating-panel">
        <span class="hint">Click near the start to close the room.</span>
        <button @click=${()=>this._fire("cancel-pending-click")}>
          Cancel
        </button>
      </div>`:"wall"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click to add
          points${this.hasPendingWall?", then Finish.":"."}</span
        >
        ${this.hasPendingWall?V`<button
                class="primary"
                @click=${()=>this._fire("finish-wall-click")}
              >
                Finish Wall
              </button>`:K}
        ${this.hasPendingWall?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                Cancel
              </button>`:K}
      </div>`:"scale"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${0===this.pendingScaleCount?"Click the first point of a known distance.":"Click the second point."}</span
        >
        ${this.pendingScaleCount>0?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                Cancel
              </button>`:K}
      </div>`:"opening"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click on a wall to place a
          ${this.armedOpeningType??"opening"}.</span
        >
      </div>`:"align"===this.mode?this._renderAlignBar():K}_renderAlignBar(){return this.alignTargetFloorId?this.alignTargetHasBackground?V`<div class="hint-bar floating-panel">
      <span class="hint">Drag to move, use +/− to resize, then Apply.</span>
      <button
        title="Shrink overlay slightly"
        @click=${()=>this._fire("align-scale-click",{factor:.995})}
      >
        −
      </button>
      <button
        title="Grow overlay slightly"
        @click=${()=>this._fire("align-scale-click",{factor:1.0050251})}
      >
        +
      </button>
      <button class="primary" @click=${()=>this._fire("align-apply-click")}>
        Apply
      </button>
      <button @click=${()=>this._fire("align-cancel-click")}>Cancel</button>
    </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint"
          >That floor has no background image to align against.</span
        >
        <button
          @click=${()=>this._fire("align-target-change",{floorId:null})}
        >
          Choose another
        </button>
        <button @click=${()=>this._fire("align-cancel-click")}>Cancel</button>
      </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint">Align against:</span>
        <select
          @change=${t=>this._fire("align-target-change",{floorId:t.target.value})}
        >
          <option value="" selected>— Choose a floor —</option>
          ${this.otherFloors.map(t=>V`<option value=${t.floor_id}>${t.name}</option>`)}
        </select>
        <button @click=${()=>this._fire("align-cancel-click")}>Cancel</button>
      </div>`}_areaOptions(t,e){return t.map(t=>V`<option
          value=${t.area_id}
          ?selected=${t.area_id===e}
        >
          ${t.name}
        </option>`)}_renderSelectionPanel(){if(this.selectedRoom){const t=this.selectedRoom,e=!1!==t.visible;return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${t.name}</span>
          <select
            @change=${t=>this._fire("room-area-change",{areaId:t.target.value})}
          >
            <option value="" ?selected=${!t.area_id}>— Custom —</option>
            ${this._areaOptions(this.areas.filter(t=>null!==t.floor_id),t.area_id)}
            ${this.areas.some(t=>null===t.floor_id)?V`<optgroup label="Outdoor / no floor">
                    ${this._areaOptions(this.areas.filter(t=>null===t.floor_id),t.area_id)}
                  </optgroup>`:K}
          </select>
          <button
            title=${e?"Hide room":"Show room"}
            @click=${()=>this._fire("room-visible-toggle")}
          >
            <ha-icon icon="mdi:eye${e?"":"-off"}"></ha-icon>
          </button>
          <input
            type="color"
            class="room-fill-color"
            title="Room color"
            .value=${t.fill_color??ye}
            @input=${t=>this._fire("room-fill-color-change",{color:t.target.value})}
          />
          <input
            type="range"
            class="room-opacity"
            title="Fill opacity"
            min="0"
            max="1"
            step="0.02"
            .value=${String(t.fill_opacity??.18)}
            @input=${t=>this._fire("room-fill-opacity-change",{opacity:Number(t.target.value)})}
          />
          <input
            type="range"
            class="room-opacity"
            title="Border opacity"
            min="0"
            max="1"
            step="0.02"
            .value=${String(t.border_opacity??1)}
            @input=${t=>this._fire("room-border-opacity-change",{opacity:Number(t.target.value)})}
          />
          <button
            title="Rename"
            @click=${()=>this._fire("room-rename-click")}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button
            title=${this.editingRoom?"Done editing":"Edit vertices"}
            class=${this.editingRoom?"active":""}
            @click=${()=>this._fire("room-edit-vertices-click")}
          >
            <ha-icon icon="mdi:vector-polygon"></ha-icon>
          </button>
          ${t.label_position?V`<button
                  title="Reset label position"
                  @click=${()=>this._fire("room-label-reset-click")}
                >
                  <ha-icon icon="mdi:format-text-variant-outline"></ha-icon>
                </button>`:K}
          <button
            class="danger"
            title="Delete room"
            @click=${()=>this._fire("room-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedPin){const t=this.selectedPin;return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${this._pinLabel(t)}</span>
          <button
            title="Set label"
            @click=${()=>this._fire("pin-set-label-click")}
          >
            <ha-icon icon="mdi:tag-text"></ha-icon>
          </button>
          <button
            title="Set icon"
            @click=${()=>this._fire("pin-set-icon-click")}
          >
            <ha-icon icon="mdi:shape"></ha-icon>
          </button>
          <button
            title="Set height"
            @click=${()=>this._fire("pin-set-height-click")}
          >
            <ha-icon icon="mdi:human-male-height"></ha-icon>
          </button>
          <button
            class="danger"
            title="Delete pin"
            @click=${()=>this._fire("pin-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedWall){const t=this.selectedWall,e=this._wallThicknessUnit??ne(this.unitSystem),i=this._thicknessInputAttrs(e);return V`
        <div class="selection-panel floating-panel">
          <span class="hint">Wall material</span>
          <select
            @change=${t=>this._fire("wall-material-change",{material:t.target.value})}
          >
            ${kt.map(e=>V`<option value=${e.id} ?selected=${e.id===t.material}>
                  ${e.label}
                </option>`)}
          </select>
          <input
            type="number"
            class="wall-thickness"
            title="Wall thickness (${e})"
            min=${i.min}
            max=${i.max}
            step=${i.step}
            .value=${se(Pt(t),e)}
            @change=${t=>{const i=oe(t.target.value,e);null===i||!Number.isFinite(i)||i<=0||this._fire("wall-thickness-change",{thicknessCm:i})}}
          />
          ${this._unitSelect(e,t=>this._wallThicknessUnit=t)}
          <button
            title=${this.editingWall?"Done editing":"Edit vertices"}
            class=${this.editingWall?"active":""}
            @click=${()=>this._fire("wall-edit-vertices-click")}
          >
            <ha-icon icon="mdi:vector-polygon"></ha-icon>
          </button>
          <button
            class="danger"
            title="Delete wall"
            @click=${()=>this._fire("wall-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedOpening){const t=this.selectedOpening,e=this._openingWidthUnit??ne(this.unitSystem),i=this._thicknessInputAttrs(e),n=this.unitsPerMeter;return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${t.type}</span>
          <input
            type="number"
            class="wall-thickness"
            title="Width (${null!==n?e:"stored units"})"
            min=${null!==n?i.min:"1"}
            step=${null!==n?i.step:"1"}
            .value=${null!==n?function(t,e,i){return se(t/e*100,i)}(t.width,n,e):String(t.width)}
            @change=${t=>{const i=t.target.value,s=null!==n?function(t,e,i){const n=oe(t,i);return null===n?null:n/100*e}(i,n,e):Number(i);null===s||!Number.isFinite(s)||s<=0||this._fire("opening-width-change",{width:s})}}
          />
          ${null!==n?this._unitSelect(e,t=>this._openingWidthUnit=t):V`<span class="hint">Calibrate Scale for real units</span>`}
          <button
            class="danger"
            title="Delete"
            @click=${()=>this._fire("opening-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedMeshLink){const t=this.selectedMeshLink;return V`
        <div class="selection-panel floating-panel">
          <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
          <span class="hint"
            >${this._pinLabel(t.fromPin)} →
            ${this._pinLabel(t.toPin)}</span
          >
          <span class="hint" style="color:${vt(t.quality)}"
            >${t.detail??t.quality}</span
          >
        </div>
      `}if(this.selectedMeshStub){const t=this.selectedMeshStub;return V`
        <div class="selection-panel floating-panel">
          <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
          <span class="hint"
            >${this._pinLabel(t.fromPin)} → ${t.targetLabel}
            (${t.targetFloorName})</span
          >
          <span class="hint" style="color:${vt(t.quality)}"
            >${t.detail??t.quality}</span
          >
          <button
            title="Go to floor"
            @click=${()=>this._fire("mesh-stub-goto-floor-click")}
          >
            <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
          </button>
        </div>
      `}return K}_pinLabel(t){return t.label_override?t.label_override:xt(t.device_id,this.entityLookup.values())}_renderPinStack(){return this.pinStack?V`
      <div class="pin-stack floating-panel">
        <span class="stack-title"
          >${this.pinStack.length} devices at this spot</span
        >
        ${this.pinStack.map(t=>V`
            <div class="pin-stack-row">
              <button
                class="pin-stack-choose"
                @click=${()=>this._fire("pin-stack-choose",{pinId:t.id})}
              >
                ${this._pinLabel(t)}
              </button>
              <button
                class="pin-stack-remove"
                title="Remove from this spot"
                @click=${()=>this._fire("pin-stack-remove-click",{pinId:t.id})}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `)}
        <button @click=${()=>this._fire("pin-stack-dismiss")}>Close</button>
      </div>
    `:K}render(){return V`
      ${this._renderModeToolbar()} ${this._renderHintBar()}
      <div class="scale-badge floating-panel">
        ${this.scaleReadout??"Not calibrated"}
      </div>
      ${this.pinStack?this._renderPinStack():this._renderSelectionPanel()}
    `}};Pe.styles=[re,r`
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .mode-toolbar {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        gap: 2px;
        align-items: center;
        pointer-events: auto;
      }
      .mode-toolbar button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
      }
      .mode-toolbar ha-icon,
      .selection-panel ha-icon,
      .pin-stack ha-icon {
        --mdc-icon-size: 20px;
      }
      .mode-toolbar button.active {
        background: var(--sc-accent);
        color: white;
      }
      .hint-bar {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
      }
      .scale-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 6px 12px;
        font-size: 0.8125rem;
        color: var(--sc-fg-secondary);
        pointer-events: auto;
      }
      .selection-panel {
        position: absolute;
        bottom: 12px;
        left: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        pointer-events: auto;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--sc-fg-secondary);
      }
      .wall-thickness {
        width: 52px;
      }
      .small-unit-select {
        width: 52px;
        padding: 4px;
      }
      .room-fill-color {
        width: 28px;
        height: 28px;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
      }
      .room-opacity {
        width: 60px;
      }
      .pin-stack {
        position: absolute;
        bottom: 12px;
        left: 12px;
        display: flex;
        flex-direction: column;
        min-width: 220px;
        padding: 4px;
        pointer-events: auto;
      }
      .pin-stack .stack-title {
        padding: 6px 8px 4px;
        font-size: 0.75rem;
        color: var(--sc-fg-secondary);
      }
      .pin-stack button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        width: 100%;
        text-align: left;
        padding: 8px;
        border-radius: 6px;
      }
      .pin-stack-row {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .pin-stack-row .pin-stack-choose {
        flex: 1;
        min-width: 0;
      }
      .pin-stack-row .pin-stack-remove {
        flex-shrink: 0;
        width: 32px;
        justify-content: center;
        color: var(--sc-danger);
      }
      .pin-stack-row .pin-stack-remove ha-icon {
        --mdc-icon-size: 18px;
      }
    `],t([ut({attribute:!1})],Pe.prototype,"mode",void 0),t([ut({attribute:!1})],Pe.prototype,"armedOpeningType",void 0),t([ut({type:Boolean})],Pe.prototype,"hasPendingTrace",void 0),t([ut({type:Boolean})],Pe.prototype,"hasPendingWall",void 0),t([ut({type:Number})],Pe.prototype,"pendingScaleCount",void 0),t([ut({attribute:!1})],Pe.prototype,"scaleReadout",void 0),t([ut({attribute:!1})],Pe.prototype,"selectedRoom",void 0),t([ut({type:Boolean})],Pe.prototype,"editingRoom",void 0),t([ut({attribute:!1})],Pe.prototype,"areas",void 0),t([ut({attribute:!1})],Pe.prototype,"selectedPin",void 0),t([ut({attribute:!1})],Pe.prototype,"selectedWall",void 0),t([ut({type:Boolean})],Pe.prototype,"editingWall",void 0),t([ut({attribute:!1})],Pe.prototype,"unitSystem",void 0),t([ut({type:Number})],Pe.prototype,"unitsPerMeter",void 0),t([ut({attribute:!1})],Pe.prototype,"pinStack",void 0),t([ut({attribute:!1})],Pe.prototype,"entityLookup",void 0),t([ut({attribute:!1})],Pe.prototype,"selectedOpening",void 0),t([ut({attribute:!1})],Pe.prototype,"selectedMeshLink",void 0),t([ut({attribute:!1})],Pe.prototype,"selectedMeshStub",void 0),t([ut({attribute:!1})],Pe.prototype,"otherFloors",void 0),t([ut({attribute:!1})],Pe.prototype,"alignTargetFloorId",void 0),t([ut({type:Boolean})],Pe.prototype,"alignTargetHasBackground",void 0),t([_t()],Pe.prototype,"_wallThicknessUnit",void 0),t([_t()],Pe.prototype,"_openingWidthUnit",void 0),Pe=t([mt("canvas-overlay")],Pe);let Se=class extends dt{constructor(){super(...arguments),this.icon="",this.label="",this.open=!1}render(){return V`
      <button
        class="icon-button ${this.open?"active":""}"
        title=${this.label}
        @click=${()=>this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${this.open?V`<div class="popover floating-panel"><slot></slot></div>`:K}
    `}};var Me;Se.styles=[re,r`
      :host {
        position: relative;
        display: inline-flex;
      }
      .icon-button {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .icon-button ha-icon {
        --mdc-icon-size: 20px;
      }
      .icon-button.active {
        background: rgba(0, 0, 0, 0.06);
      }
      .popover {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 10;
        margin-top: 8px;
        min-width: 240px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    `],t([ut()],Se.prototype,"icon",void 0),t([ut()],Se.prototype,"label",void 0),t([ut({type:Boolean})],Se.prototype,"open",void 0),Se=t([mt("icon-popover")],Se);let Ce=Me=class extends dt{constructor(){super(...arguments),this.entities=[],this.placedDeviceIds=new Set,this.armedEntityId=null,this.floors=[],this.areas=[],this.currentFloorId=null,this.linkedAreaIds=new Set,this._search="",this._floorFilter=null,this._areaFilter=null,this._onResizeHandlePointerDown=t=>{t.preventDefault();const e=t.clientX,i=this.getBoundingClientRect().width,n=t.currentTarget;n.setPointerCapture(t.pointerId);const s=t=>{const n=e-t.clientX,s=Math.min(Me.MAX_WIDTH,Math.max(Me.MIN_WIDTH,i+n));this.style.setProperty("--sc-picker-width",`${s}px`)},o=t=>{n.releasePointerCapture(t.pointerId),n.removeEventListener("pointermove",s),n.removeEventListener("pointerup",o),this._writeStoredWidth(Math.round(this.getBoundingClientRect().width))};n.addEventListener("pointermove",s),n.addEventListener("pointerup",o)},this._onFloorFilterChange=t=>{const e=t.target.value;this._floorFilter="all"===e?"all":e,this._areaFilter&&!this._areasForFilter.some(t=>t.area_id===this._areaFilter)&&(this._areaFilter=null)}}connectedCallback(){super.connectedCallback();const t=this._readStoredWidth();null!==t&&this.style.setProperty("--sc-picker-width",`${t}px`)}_readStoredWidth(){try{const t=localStorage.getItem(Me.WIDTH_STORAGE_KEY);if(!t)return null;const e=Number(t);return Number.isFinite(e)?Math.min(Me.MAX_WIDTH,Math.max(Me.MIN_WIDTH,e)):null}catch{return null}}_writeStoredWidth(t){try{localStorage.setItem(Me.WIDTH_STORAGE_KEY,String(t))}catch{}}get _effectiveFloorFilter(){return"all"===this._floorFilter?null:this._floorFilter??this.currentFloorId}get _areasForFilter(){const t=this._effectiveFloorFilter;return null===t?this.areas:this.areas.filter(e=>this._areaIsOnFloor(e,t))}_areaIsOnFloor(t,e){return e===yt?null===t.floor_id:t.floor_id===e||e===this.currentFloorId&&this.linkedAreaIds.has(t.area_id)}get _devices(){const t=new Map;for(const e of this.entities){const i=e.device_id??e.entity_id;t.has(i)||t.set(i,[]),t.get(i).push(e)}const e=[];for(const[i,n]of t){const t=bt(i,n)??n[0];e.push({deviceId:i,deviceName:t.device_name??t.name,areaId:t.area_id,areaName:t.area_name,integrationDomain:t.integration_domain,integrationName:t.integration_name,entities:n,primaryEntityId:t.entity_id})}return e.sort((t,e)=>t.deviceName.localeCompare(e.deviceName)),e}_blockedFloorName(t){const e=t.entities.find(e=>e.entity_id===t.primaryEntityId);return e?.placed_floor_id&&e.placed_floor_id!==this.currentFloorId?e.placed_floor_name??e.placed_floor_id:null}get _filtered(){const t=this._search.trim().toLowerCase(),e=this._effectiveFloorFilter,i=this._areaFilter;return this._devices.filter(n=>{if(i){if(n.areaId!==i)return!1}else if(e){const t=this.areas.find(t=>t.area_id===n.areaId);if(!t||!this._areaIsOnFloor(t,e))return!1}return!t||(n.deviceName.toLowerCase().includes(t)||(n.areaName??"").toLowerCase().includes(t)||n.entities.some(e=>e.entity_id.toLowerCase().includes(t)))})}render(){const t=this._filtered;return V`
      <div
        class="resize-handle"
        @pointerdown=${this._onResizeHandlePointerDown}
      ></div>
      <div class="search">
        <div class="search-box">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            placeholder="Search devices…"
            .value=${this._search}
            @input=${t=>this._search=t.target.value}
          />
        </div>
        <div class="filters">
          <select @change=${this._onFloorFilterChange}>
            <option value="all" ?selected=${"all"===this._floorFilter}>
              All Floors
            </option>
            <option
              value=${yt}
              ?selected=${this._effectiveFloorFilter===yt}
            >
              Outdoor / no floor
            </option>
            ${this.floors.map(t=>V`<option
                  value=${t.floor_id}
                  ?selected=${this._effectiveFloorFilter===t.floor_id}
                >
                  ${t.name}
                </option>`)}
          </select>
          <select
            @change=${t=>this._areaFilter=t.target.value||null}
          >
            <option value="" ?selected=${!this._areaFilter}>All Areas</option>
            ${this._areasForFilter.map(t=>V`<option
                  value=${t.area_id}
                  ?selected=${this._areaFilter===t.area_id}
                >
                  ${t.name}
                </option>`)}
          </select>
        </div>
        ${this.placedDeviceIds.size>0?V`<button
                class="clear-all-button"
                @click=${()=>this.dispatchEvent(new CustomEvent("clear-all-pins",{bubbles:!0,composed:!0}))}
              >
                <ha-icon icon="mdi:playlist-remove"></ha-icon> Clear all placed
                devices
              </button>`:K}
      </div>
      <div class="list">
        ${0===t.length?V`<div class="empty">No matching devices.</div>`:t.map(t=>{const e=this.placedDeviceIds.has(t.deviceId),i=this._blockedFloorName(t),n=this.armedEntityId===t.primaryEntityId,s=[t.areaName,t.integrationName].filter(t=>!!t).join(" - ");return V`
                  <div
                    class="item ${n?"armed":""} ${e?"placed":""} ${i?"blocked":""}"
                    title=${i?`Already placed on ${i} — remove it there first`:[t.deviceName,s].filter(t=>!!t).join(" · ")}
                    @click=${()=>{i||this.dispatchEvent(new CustomEvent("entity-armed",{detail:{entityId:t.primaryEntityId},bubbles:!0,composed:!0}))}}
                  >
                    <span class="avatar">
                      ${t.integrationDomain?V`<img
                              src="https://brands.home-assistant.io/_/${t.integrationDomain}/icon.png"
                              alt=""
                              @error=${t=>{const e=t.target;e.style.display="none",e.nextElementSibling?.classList.remove("hidden")}}
                            />`:K}
                      <ha-icon
                        icon=${"mdi:devices"}
                        class=${t.integrationDomain?"hidden":""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${t.deviceName}</span>
                      ${i?V`<span class="meta"
                              >Placed on ${i}</span
                            >`:s?V`<span class="meta">${s}</span>`:K}
                      ${e?V`<span class="meta">✓ placed</span>`:K}
                    </span>
                  </div>
                `})}
      </div>
    `}};Ce.styles=[re,r`
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        width: var(--sc-picker-width, 300px);
        min-width: 240px;
        max-width: 600px;
        border-left: 1px solid var(--sc-divider);
        background: var(--sc-panel-bg);
        height: 100%;
        overflow: hidden;
      }
      .resize-handle {
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        cursor: ew-resize;
        z-index: 1;
      }
      .search {
        padding: 12px;
      }
      .clear-all-button {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        margin-top: 8px;
        padding: 8px 12px;
        font-size: 13px;
        color: var(--sc-danger);
        border-radius: 8px;
        justify-content: flex-start;
      }
      .clear-all-button ha-icon {
        --mdc-icon-size: 18px;
      }
      .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 12px;
        border: 1px solid rgb(94, 94, 94);
        border-radius: 10px;
        background: var(--sc-bg);
      }
      .search-box ha-icon {
        --mdc-icon-size: 18px;
        color: var(--sc-fg-secondary);
        flex-shrink: 0;
      }
      .search-box input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        font-size: 14px;
        color: var(--sc-fg);
      }
      .filters {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      .filters select {
        flex: 1;
        min-width: 0;
        height: 36px;
        padding: 0 8px;
        border: 1px solid rgb(94, 94, 94);
        border-radius: 10px;
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-size: 13px;
      }
      .list {
        overflow-y: auto;
        flex: 1;
        border-top: 1px solid var(--sc-divider);
      }
      .item {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 60px;
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid var(--sc-divider);
      }
      .item:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .item.armed {
        background: var(--sc-accent);
        color: white;
      }
      .item.armed .meta {
        color: rgba(255, 255, 255, 0.75);
      }
      .item.placed {
        opacity: 0.55;
      }
      .item.blocked {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .item.blocked:hover {
        background: transparent;
      }
      .item .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(127, 127, 127, 0.2);
        flex-shrink: 0;
      }
      .item .avatar ha-icon {
        --mdc-icon-size: 20px;
        color: var(--sc-fg-secondary);
      }
      .item .avatar img {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
      .item .avatar ha-icon.hidden {
        display: none;
      }
      .item .text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .item .name {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item .meta {
        font-size: 12px;
        color: var(--sc-fg-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .empty {
        padding: 16px;
        color: var(--sc-fg-secondary);
        font-size: 14px;
      }
    `],Ce.WIDTH_STORAGE_KEY="spatial-context.entityPickerSidebarWidth",Ce.MIN_WIDTH=240,Ce.MAX_WIDTH=600,t([ut({attribute:!1})],Ce.prototype,"entities",void 0),t([ut({attribute:!1})],Ce.prototype,"placedDeviceIds",void 0),t([ut({attribute:!1})],Ce.prototype,"armedEntityId",void 0),t([ut({attribute:!1})],Ce.prototype,"floors",void 0),t([ut({attribute:!1})],Ce.prototype,"areas",void 0),t([ut({attribute:!1})],Ce.prototype,"currentFloorId",void 0),t([ut({attribute:!1})],Ce.prototype,"linkedAreaIds",void 0),t([_t()],Ce.prototype,"_search",void 0),t([_t()],Ce.prototype,"_floorFilter",void 0),t([_t()],Ce.prototype,"_areaFilter",void 0),Ce=Me=t([mt("entity-picker-sidebar")],Ce);let Oe=class extends dt{constructor(){super(...arguments),this.mode="select",this.selectedPinLabel=null,this.selectedMeshLink=null,this.buildings=[],this.armedBuildingKey=null,this.selectedPlacement=null,this.floorNameById=new Map}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_selectedLabel(){const t=this.selectedPlacement;return t?t.label_override||this.floorNameById.get(t.floor_id)||t.floor_id:""}_renderPinPanel(){return null===this.selectedPinLabel?K:V`
      <div class="selection-panel floating-panel">
        <ha-icon icon="mdi:map-marker"></ha-icon>
        <span class="hint">${this.selectedPinLabel}</span>
        <button
          title="Rename"
          @click=${()=>this._fire("outdoor-pin-rename-click")}
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </button>
        <button
          title="Set icon"
          @click=${()=>this._fire("outdoor-pin-icon-click")}
        >
          <ha-icon icon="mdi:shape"></ha-icon>
        </button>
        <button
          class="danger"
          title="Remove from the property"
          @click=${()=>this._fire("outdoor-pin-delete-click")}
        >
          <ha-icon icon="mdi:delete"></ha-icon>
        </button>
      </div>
    `}_renderMeshLinkPanel(){const t=this.selectedMeshLink;if(!t)return K;const e=[t.from,t.to].find(t=>null!==t.floorId);return V`
      <div class="selection-panel floating-panel">
        <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
        <span class="hint">${t.from.label} → ${t.to.label}</span>
        <span class="hint" style="color:${vt(t.quality)}"
          >${t.detail??t.quality}</span
        >
        ${e?V`<button
                title="Go to ${e.label}'s floor"
                @click=${()=>this._fire("property-mesh-goto-floor-click",{floorId:e.floorId})}
              >
                <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
              </button>`:K}
      </div>
    `}render(){return V`
      <div class="mode-toolbar floating-panel">
        <button
          class=${"select"===this.mode?"active":""}
          title="Select"
          @click=${()=>this._fire("property-mode-change",{mode:"select"})}
        >
          <ha-icon icon="mdi:cursor-default-click"></ha-icon>
        </button>
        <button
          class=${"place-pin"===this.mode?"active":""}
          title="Place an outdoor device"
          @click=${()=>this._fire("property-mode-change",{mode:"place-pin"===this.mode?"select":"place-pin"})}
        >
          <ha-icon icon="mdi:map-marker-plus"></ha-icon>
        </button>
        <select
          class="place-picker"
          title="Place a building's footprint"
          .value=${this.armedBuildingKey??""}
          @change=${t=>{const e=t.target.value;e&&this._fire("placement-arm",{key:e})}}
        >
          <option value="">Place building…</option>
          ${this.buildings.map(t=>V`<option value=${t.key}>${t.name}</option>`)}
        </select>
      </div>

      ${this._renderPinPanel()} ${this._renderMeshLinkPanel()}
      ${this.selectedPlacement?V`
              <div class="selection-panel floating-panel">
                <span class="hint">${this._selectedLabel()}</span>
                <button
                  title="Go to floor"
                  @click=${()=>this._fire("placement-goto-floor-click")}
                >
                  <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
                </button>
                <button
                  title="Rename"
                  @click=${()=>this._fire("placement-rename-click")}
                >
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button
                  class="danger"
                  title="Delete placement"
                  @click=${()=>this._fire("placement-delete-click")}
                >
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>
              </div>
            `:K}
    `}};var Le;Oe.styles=[re,r`
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .mode-toolbar {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        gap: 6px;
        align-items: center;
        pointer-events: auto;
      }
      .mode-toolbar button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
      }
      .mode-toolbar ha-icon,
      .selection-panel ha-icon {
        --mdc-icon-size: 20px;
      }
      .mode-toolbar button.active {
        background: var(--sc-accent);
        color: white;
      }
      .place-picker {
        border: 1px solid var(--sc-divider);
        border-radius: 4px;
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-family: inherit;
        font-size: 0.875rem;
        padding: 6px 8px;
      }
      .selection-panel {
        position: absolute;
        bottom: 12px;
        left: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        pointer-events: auto;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--sc-fg-secondary);
      }
    `],t([ut({attribute:!1})],Oe.prototype,"mode",void 0),t([ut({attribute:!1})],Oe.prototype,"selectedPinLabel",void 0),t([ut({attribute:!1})],Oe.prototype,"selectedMeshLink",void 0),t([ut({attribute:!1})],Oe.prototype,"buildings",void 0),t([ut({attribute:!1})],Oe.prototype,"armedBuildingKey",void 0),t([ut({attribute:!1})],Oe.prototype,"selectedPlacement",void 0),t([ut({attribute:!1})],Oe.prototype,"floorNameById",void 0),Oe=t([mt("property-overlay")],Oe);let Te=Le=class extends dt{constructor(){super(...arguments),this._floors=[],this._currentFloorId=null,this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._entities=[],this._areas=[],this._mode="select",this._dragOverCanvas=!1,this._armedEntityId=null,this._armedOpeningType=null,this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._otherFloorPinsByDeviceId=new Map,this._dirty=!1,this._saving=!1,this._loading=!0,this._pendingCount=0,this._networkType=null,this._zigbeeMesh=null,this._zigbeeMeshLoading=!1,this._zigbeeMeshError=null,this._zigbeeMeshFetchedAt=null,this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=null,this._zigbeeShowAllLinks=!1,this._wifiMesh=null,this._wifiMeshLoading=!1,this._wifiMeshError=null,this._matterTopology=null,this._matterError=null,this._matterUnsubscribe=null,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settings={unit_system:"metric",zigbee_timeout_seconds:180,floor_order:"top_down",zigbee_coordinator_device_id:null,auto_save:!0},this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1,this._view="floor",this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!1,this._autoSaveTimer=null,this._autoSaveHeld=!1,this._floorHistory=new $t,this._propertyHistory=new $t,this._propertySaving=!1,this._selectedPlacementId=null,this._propertyMode="select",this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._armedBuildingKey=null,this._sameBuildingAsPreviousFloor=!1,this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._initialized=!1,this._onFloorSelected=t=>{this._selectFloor(t.detail.floorId)},this._onPropertySelected=()=>{this._selectProperty()},this._onUndo=()=>this._undoRedo("undo"),this._onRedo=()=>this._undoRedo("redo"),this._onPropertyModeChange=t=>{this._propertyMode=t.detail.mode,this._armedBuildingKey=null,this._armedEntityId=null,this._selectedPlacementId=null},this._onOutdoorPinPlace=t=>{if(!this._armedEntityId)return;const e=this._entityLookup.get(this._armedEntityId),i=Ot(e?.device_id??null,t.detail.x,t.detail.y,null);this._updatePropertyLayout({pins:[...this._propertyLayout.pins,i]}),this._armedEntityId=null,this._selectedOutdoorPinId=i.id,this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null},this._onOutdoorPinMove=t=>{this._patchOutdoorPin(t.detail.id,{x:t.detail.x,y:t.detail.y})},this._onOutdoorPinSelect=t=>{this._selectedOutdoorPinId=t.detail.id,null!==t.detail.id&&(this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null)},this._onOutdoorPinRename=()=>{const t=this._selectedOutdoorPin;if(!t)return;const e=window.prompt("Label (blank to clear override):",this._pinLabel(t));null!==e&&this._patchOutdoorPin(t.id,{label_override:e||null})},this._onOutdoorPinIcon=()=>{const t=this._selectedOutdoorPin;if(!t)return;const e=window.prompt("Icon override (e.g. mdi:outdoor-lamp — blank to clear):",t.icon_override??"");null!==e&&this._patchOutdoorPin(t.id,{icon_override:e.trim()||null})},this._onOutdoorPinDelete=()=>{const t=this._selectedOutdoorPin;t&&window.confirm(`Remove "${this._pinLabel(t)}" from the property?`)&&(this._updatePropertyLayout({pins:this._propertyLayout.pins.filter(e=>e.id!==t.id)}),this._selectedOutdoorPinId=null)},this._onPropertyMeshLinkSelect=t=>{this._selectedPropertyMeshLinkKey=t.detail.key,null!==t.detail.key&&(this._selectedOutdoorPinId=null,this._selectedPlacementId=null)},this._onClearAllOutdoorPins=()=>{const t=this._propertyLayout.pins.length;0!==t&&window.confirm(`Remove all ${t} outdoor device${1===t?"":"s"} from the property?`)&&(this._autoSaveHeld=!0,this._updatePropertyLayout({pins:[]}),this._selectedOutdoorPinId=null)},this._onPropertyMeshGotoFloor=t=>{this._selectFloor(t.detail.floorId)},this._onPlacementArm=t=>{this._armedBuildingKey=t.detail.key,this._propertyMode="place",this._selectedPlacementId=null},this._onPlacementPlace=t=>{if(!this._armedBuildingKey)return;const e=this._buildings.find(t=>t.key===this._armedBuildingKey);if(!e)return;const i=function(t,e,i,n,s,o){const r=s>=1?Tt:Tt*s,l=s>=1?Tt/s:Tt;return{id:Ct("placement"),building_id:e,floor_id:t,label_override:null,x:i,y:n,width:r,height:l,rotation_deg:0,aspect_ratio:s,source_bounds:o}}(e.floorId,e.buildingId,t.detail.x,t.detail.y,e.aspectRatio,this._buildingBounds(this._floors.filter(t=>(t.building_id??t.floor_id)===e.key)));this._updatePropertyLayout({placements:[...this._propertyLayout.placements,i]}),this._armedBuildingKey=null,this._propertyMode="select",this._selectedPlacementId=i.id},this._onPlacementMove=t=>{const e=this._propertyLayout.placements.find(e=>e.id===t.detail.id);e&&this._patchPlacement(t.detail.id,{x:e.x+t.detail.dx,y:e.y+t.detail.dy})},this._onPlacementResize=t=>{this._patchPlacement(t.detail.id,{width:t.detail.width,height:t.detail.height,x:t.detail.x,y:t.detail.y})},this._onPlacementRotate=t=>{this._patchPlacement(t.detail.id,{rotation_deg:t.detail.rotationDeg})},this._onPlacementSelect=t=>{this._selectedPlacementId=t.detail.id,null!==t.detail.id&&(this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null)},this._onPlacementRenameClick=()=>{const t=this._selectedPlacement;if(!t)return;const e=t.label_override??this._floorNameById.get(t.floor_id)??t.floor_id,i=window.prompt("Label (blank to clear override):",e);null!==i&&this._patchPlacement(t.id,{label_override:i||null})},this._onPlacementDeleteClick=()=>{const t=this._selectedPlacement;if(!t)return;const e=t.label_override??this._floorNameById.get(t.floor_id)??t.floor_id;window.confirm(`Delete the "${e}" placement?`)&&(this._updatePropertyLayout({placements:this._propertyLayout.placements.filter(e=>e.id!==t.id)}),this._selectedPlacementId=null)},this._onPlacementGotoFloorClick=()=>{const t=this._selectedPlacement;t&&this._selectFloor(t.floor_id)},this._onModeChange=t=>{this._mode=this._mode===t.detail.mode?"select":t.detail.mode,this._armedEntityId=null,this._armedOpeningType=null,"select"!==this._mode&&(this._editingRoomId=null,this._editingWallId=null),"align"!==this._mode&&this._resetAlignState()},this._onAddOpeningClick=t=>{this._mode="opening",this._armedOpeningType=t.detail.openingType,this._editingRoomId=null,this._editingWallId=null},this._onSaveClick=()=>{this._autoSaveHeld=!1,"property"===this._view?this._saveProperty():this._save()},this._placementKeyForEntities=null,this._onBeforeUnload=t=>{(this._dirty||this._propertyDirty)&&(this._flushAutoSave(),t.preventDefault(),t.returnValue="")},this._onExportClick=()=>{this._export()},this._onResetClick=()=>{if("property"===this._view){if(!window.confirm("Reset the property view? This clears every building placement, every outdoor device and the background photo. Nothing is permanent until you hit Save afterward."))return;return this._autoSaveHeld=!0,this._propertyHistory.record(this._propertyLayout),this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const t=this._floors.find(t=>t.floor_id===this._currentFloorId)?.name??"this floor";window.confirm(`Reset "${t}"? This clears every room, wall, opening, placed device, and the background image on this floor. Nothing is permanent until you hit Save afterward.`)&&(this._autoSaveHeld=!0,this._floorHistory.record(this._layout),this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)},this._onToggleBackgroundPopover=()=>{this._backgroundPopoverOpen=!this._backgroundPopoverOpen,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMeshPopover=()=>{const t=!this._meshPopoverOpen;this._meshPopoverOpen=t,this._backgroundPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1,t||(this._unsubscribeMatter(),this._networkType=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onToggleSettingsPopover=()=>{this._settingsPopoverOpen=!this._settingsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMoreOptionsPopover=()=>{this._moreOptionsPopoverOpen=!this._moreOptionsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1},this._onUnitSystemSelect=t=>{this._settingsPopoverOpen=!1,this._settings.unit_system!==t&&(this._settings={...this._settings,unit_system:t},this._client.saveSettings(this._settings))},this._onFloorOrderSelect=t=>{this._settingsPopoverOpen=!1,this._settings.floor_order!==t&&(this._settings={...this._settings,floor_order:t},this._client.saveSettings(this._settings))},this._onAutoSaveToggle=t=>{const e=t.target.checked;this._settings={...this._settings,auto_save:e},this._client.saveSettings(this._settings),this._scheduleAutoSave()},this._onCoordinatorDeviceChange=t=>{const e=t.target.value;this._settings={...this._settings,zigbee_coordinator_device_id:e||null},this._selectedMeshLink=null,this._selectedMeshStub=null,this._client.saveSettings(this._settings)},this._onZigbeeTimeoutChange=t=>{const e=Number(t.target.value);if(!Number.isFinite(e))return;const i=Math.min(600,Math.max(30,Math.round(e)));this._settings={...this._settings,zigbee_timeout_seconds:i},this._client.saveSettings(this._settings)},this._onNetworkTypeSelect=t=>{"matter"===this._networkType&&"matter"!==t&&this._unsubscribeMatter(),this._networkType=t,this._selectedMeshLink=null,this._selectedMeshStub=null,"wifi"===t?this._refreshWifiMesh():"matter"===t?this._subscribeMatter():"zigbee"===t&&this._loadCachedZigbeeMesh()},this._onLoadMesh=()=>{this._refreshZigbeeMesh(null!==this._zigbeeMeshFetchedAt)},this._onKeyDown=t=>{if(this._isTypingTarget())return;if("Escape"===t.key)return t.preventDefault(),this._onCancelPending(),this._mode="select",this._armedEntityId=null,this._armedOpeningType=null,this._armedBuildingKey=null,void(this._propertyMode="select");const e=t.ctrlKey||t.metaKey,i=t.key.toLowerCase(),n=e&&!t.shiftKey&&"z"===i,s=e&&(t.shiftKey&&"z"===i||"y"===i);if(!n&&"Backspace"!==t.key||!this._canvas?.undoLastPoint())return n||s?(t.preventDefault(),void this._undoRedo(n?"undo":"redo")):"Delete"===t.key||"Backspace"===t.key?"property"===this._view?((this._selectedOutdoorPin||this._selectedPlacement)&&t.preventDefault(),void(this._selectedOutdoorPin?this._onOutdoorPinDelete():this._selectedPlacement&&this._onPlacementDeleteClick())):((this._selectedRoom||this._selectedPin||this._selectedWall||this._selectedOpening)&&t.preventDefault(),void(this._selectedRoom?this._onRoomDelete():this._selectedPin?this._onPinDelete():this._selectedWall?this._onWallDelete():this._selectedOpening&&this._onOpeningDelete())):void("Enter"===t.key&&"wall"===this._mode&&(t.preventDefault(),this._onFinishWall()));t.preventDefault()},this._onFileInputChange=async t=>{const e=t.target,i=e.files?.[0];e.value="",i&&this._handleBackgroundFile(i)},this._onCanvasDragOver=t=>{t.dataTransfer?.types.includes("Files")&&(t.preventDefault(),this._dragOverCanvas=!0)},this._onCanvasDragLeave=()=>{this._dragOverCanvas=!1},this._onCanvasDrop=t=>{if(!t.dataTransfer?.types.includes("Files"))return;t.preventDefault(),this._dragOverCanvas=!1;const e=t.dataTransfer.files?.[0];e&&this._handleBackgroundFile(e)},this._onRemoveBackgroundClick=()=>{"property"===this._view?this._updatePropertyLayout({background_image_id:null}):this._updateLayout({background_image_id:null})},this._onOpacityChange=t=>{const e=Number(t.target.value);"property"===this._view?this._updatePropertyLayout({background_opacity:e}):this._updateLayout({background_opacity:e})},this._onCancelPending=()=>this._canvas?.cancelPending(),this._onFinishWall=()=>this._canvas?.finishPendingWall(),this._onAlignTargetChange=async t=>{const e=t.detail.floorId;e?(this._alignTargetFloorId=e,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._alignTargetLayout=await this._client.getLayout(e)):this._resetAlignState()},this._onAlignDrag=t=>{this._alignOffsetX+=t.detail.dx,this._alignOffsetY+=t.detail.dy},this._onAlignScaleClick=t=>{const{factor:e}=t.detail,i=this._canvas?.getViewBox();if(i){const t=i.x+i.w/2,n=i.y+i.h/2;this._alignOffsetX=e*this._alignOffsetX+(1-e)*t,this._alignOffsetY=e*this._alignOffsetY+(1-e)*n}this._alignScale*=e},this._onAlignCancel=()=>{this._mode="select",this._resetAlignState()},this._onAlignApply=async()=>{if(!this._alignTargetFloorId||!this._alignTargetLayout)return;const t=this._alignTargetFloorId,e=this._floors.find(e=>e.floor_id===t)?.name??"that floor";if(!window.confirm(`Apply this alignment to "${e}"? This rewrites every room, wall, door/window, and placed device position on that floor — plus its background image's placement and, if this floor has one set, its scale calibration too — to match this floor's coordinate system. This saves immediately and cannot be undone.`))return;const i=this._alignScale,n=this._alignOffsetX,s=this._alignOffsetY,o=([t,e])=>[t*i+n,e*i+s],r=this._alignTargetLayout,l=this._layout.building_id??Ct("building"),a={background_image_id:r.background_image_id,background_opacity:r.background_opacity,background_offset_x:r.background_offset_x*i+n,background_offset_y:r.background_offset_y*i+s,background_scale:r.background_scale*i,building_id:l,view_box:r.view_box?(()=>{const[t,e]=o([r.view_box.x,r.view_box.y]);return{x:t,y:e,w:r.view_box.w*i,h:r.view_box.h*i}})():null,rooms:r.rooms.map(t=>({...t,points:t.points.map(o)})),walls:r.walls.map(t=>({...t,points:t.points.map(o)})),pins:r.pins.map(t=>{const[e,i]=o([t.x,t.y]);return{...t,x:e,y:i}}),openings:r.openings.map(t=>{const[e,n]=o([t.x,t.y]);return{...t,x:e,y:n,width:t.width*i}}),scale:this._layout.scale??(r.scale?{points:[o(r.scale.points[0]),o(r.scale.points[1])],meters:r.scale.meters}:null)};await this._client.saveLayout(t,a),this._layout.building_id!==l&&(await this._client.setBuildingId(this._currentFloorId,l),this._layout={...this._layout,building_id:l}),this._floors=await this._client.listFloors(),this._mode="select",this._resetAlignState(),this._floorHistory.clear()},this._onRoomRename=()=>{const t=this._selectedRoom;if(!t)return;const e=window.prompt("Room name:",t.name);e&&this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===t.id?{...i,name:e}:i)})},this._onRoomAreaChange=t=>{const e=this._selectedRoom;if(!e)return;const i=t.detail.areaId||null,n=this._areas.find(t=>t.area_id===i);this._updateLayout({rooms:this._layout.rooms.map(t=>t.id===e.id?{...t,area_id:i,name:n?n.name:t.name}:t)})},this._onRoomLabelMoved=t=>{this._patchRoom(t.detail.roomId,{label_position:[t.detail.x,t.detail.y]})},this._onRoomLabelReset=()=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{label_position:null})},this._onRoomVisibleToggle=()=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{visible:!1===t.visible})},this._onRoomFillColorChange=t=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{fill_color:t.detail.color})},this._onRoomFillOpacityChange=t=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{fill_opacity:t.detail.opacity})},this._onRoomBorderOpacityChange=t=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{border_opacity:t.detail.opacity})},this._onRoomEditVertices=()=>{this._selectedRoomId&&(this._editingRoomId=this._editingRoomId===this._selectedRoomId?null:this._selectedRoomId)},this._onRoomDelete=()=>{const t=this._selectedRoom;if(!t||!window.confirm(`Delete room "${t.name}"?`))return;const e=this._layout.rooms.filter(e=>e.id!==t.id);this._updateLayout({rooms:e,pins:Wt(e,this._layout.pins)}),this._selectedRoomId=null,this._editingRoomId=null},this._onPinSetLabel=()=>{const t=this._selectedPin;if(!t)return;const e=window.prompt("Label override (blank to clear):",t.label_override??"");null!==e&&this._patchPin(t.id,{label_override:e||null})},this._onPinSetIcon=()=>{const t=this._selectedPin;if(!t)return;const e=window.prompt("Icon override, e.g. mdi:motion-sensor (blank to clear):",t.icon_override??"");null!==e&&this._patchPin(t.id,{icon_override:e||null})},this._onPinSetHeight=()=>{const t=this._selectedPin;if(!t)return;const e=this._settings.unit_system,i="imperial"===e?"feet":"metres",n="imperial"===e?"6":"1.8",s=window.prompt(`Mounting height in ${i} above floor level (e.g. ${n} for a high wall mount; blank to clear):`,null===t.height_m?"":te(t.height_m,e));if(null===s)return;const o=""===s.trim()?null:ee(s,e);this._patchPin(t.id,{height_m:null!==o&&Number.isFinite(o)?o:null})},this._onPinDelete=()=>{const t=this._selectedPin;t&&window.confirm(`Delete pin for ${this._pinLabel(t)}?`)&&(this._updateLayout({pins:this._layout.pins.filter(e=>e.id!==t.id)}),this._selectedPinId=null)},this._onWallMaterialChange=t=>{const e=this._selectedWall;e&&this._updateLayout({walls:this._layout.walls.map(i=>i.id===e.id?{...i,material:t.detail.material}:i)})},this._onWallThicknessChange=t=>{const e=this._selectedWall;e&&(!Number.isFinite(t.detail.thicknessCm)||t.detail.thicknessCm<=0||this._updateLayout({walls:this._layout.walls.map(i=>i.id===e.id?{...i,thickness_cm:t.detail.thicknessCm}:i)}))},this._onWallEditVertices=()=>{this._selectedWallId&&(this._editingWallId=this._editingWallId===this._selectedWallId?null:this._selectedWallId)},this._onWallDelete=()=>{const t=this._selectedWall;t&&window.confirm("Delete this wall? Any doors/windows on it will be removed too.")&&(this._updateLayout({walls:this._layout.walls.filter(e=>e.id!==t.id),openings:this._layout.openings.filter(e=>e.wallId!==t.id)}),this._selectedWallId=null,this._editingWallId=null)},this._onOpeningWidthChange=t=>{const e=this._selectedOpening;if(!e)return;const i=t.detail.width;this._updateLayout({openings:this._layout.openings.map(t=>t.id===e.id?{...t,width:i}:t)})},this._onOpeningDelete=()=>{const t=this._selectedOpening;t&&window.confirm(`Delete this ${t.type}?`)&&(this._updateLayout({openings:this._layout.openings.filter(e=>e.id!==t.id)}),this._selectedOpeningId=null)},this._onEntityArmed=t=>{this._armedEntityId=this._armedEntityId===t.detail.entityId?null:t.detail.entityId},this._onClearAllPins=()=>{const t=this._layout.pins.length;0!==t&&window.confirm(`Remove all ${t} placed device${1===t?"":"s"} from this floor?`)&&(this._autoSaveHeld=!0,this._updateLayout({pins:[]}),this._selectedPinId=null,this._pinStackIds=null)},this._onRoomTraceComplete=t=>{const e=(i="New Room",n=t.detail.points,s=null,{id:Ct("room"),name:i,area_id:s,points:n});var i,n,s;const o=[...this._layout.rooms,e];this._updateLayout({rooms:o,pins:Wt(o,this._layout.pins)}),this._selectedRoomId=e.id},this._onRoomVertexChanged=t=>{const e=this._layout.rooms.map(e=>{if(e.id!==t.detail.roomId)return e;const i=e.label_position,n=!i||zt(i[0],i[1],t.detail.points);return{...e,points:t.detail.points,...n?{}:{label_position:null}}});this._updateLayout({rooms:e,pins:Wt(e,this._layout.pins)})},this._onRoomSelect=t=>{this._selectedRoomId=t.detail.roomId,null===t.detail.roomId?this._editingRoomId=null:(this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onWallTraceComplete=t=>{this._updateLayout({walls:[...this._layout.walls,Lt(t.detail.points)]})},this._onWallVertexChanged=t=>{this._updateLayout({walls:this._layout.walls.map(e=>e.id===t.detail.wallId?{...e,points:t.detail.points}:e)})},this._onWallSelect=t=>{this._selectedWallId=t.detail.wallId,null===t.detail.wallId?this._editingWallId=null:(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningPlace=t=>{if(!this._armedOpeningType)return;const e=function(t,e,i,n,s){return{id:Ct("opening"),wallId:t,type:e,x:i,y:n,width:s}}(t.detail.wallId,this._armedOpeningType,t.detail.x,t.detail.y,this._defaultOpeningWidth());this._updateLayout({openings:[...this._layout.openings,e]})},this._onOpeningSelect=t=>{this._selectedOpeningId=t.detail.openingId,null!==t.detail.openingId&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningUpdate=t=>{this._updateLayout({openings:this._layout.openings.map(e=>e.id===t.detail.openingId?{...e,x:t.detail.x,y:t.detail.y,width:t.detail.width}:e)})},this._onPinPlace=t=>{if(!this._armedEntityId)return;const e=Ht(t.detail.x,t.detail.y,this._layout.rooms),i=this._entityLookup.get(this._armedEntityId),n=Ot(i?.device_id??null,t.detail.x,t.detail.y,e),s=this._layout.pins.filter(e=>e.x===t.detail.x&&e.y===t.detail.y);this._updateLayout({pins:[...this._layout.pins,n]}),this._armedEntityId=null,s.length>0?(this._pinStackIds=[...s.map(t=>t.id),n.id],this._selectedPinId=null):(this._pinStackIds=null,this._selectedPinId=n.id,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinMove=t=>{const e=Ht(t.detail.x,t.detail.y,this._layout.rooms);this._patchPin(t.detail.pinId,{x:t.detail.x,y:t.detail.y,room_id:e})},this._onPinSelect=t=>{this._selectedPinId=t.detail.pinId,this._pinStackIds=null,null!==t.detail.pinId&&(this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinStackSelect=t=>{this._pinStackIds=t.detail.pinIds,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedPinId=null,this._selectedMeshLink=null,this._selectedMeshStub=null},this._onMeshLinkSelect=t=>{this._selectedMeshLink=t.detail.link,null!==t.detail.link&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshStub=null)},this._onMeshStubSelect=t=>{this._selectedMeshStub=t.detail.stub,null!==t.detail.stub&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null)},this._onMeshStubGotoFloorClick=()=>{const t=this._selectedMeshStub;t&&(t.targetFloorId===yt?this._selectProperty():this._selectFloor(t.targetFloorId))},this._onPinStackChoose=t=>{this._pinStackIds=null,this._selectedPinId=t.detail.pinId},this._onPinStackDismiss=()=>{this._pinStackIds=null},this._onPinStackRemove=t=>{const e=this._layout.pins.find(e=>e.id===t.detail.pinId);if(!e)return;if(!window.confirm(`Remove ${this._pinLabel(e)} from this spot?`))return;this._updateLayout({pins:this._layout.pins.filter(e=>e.id!==t.detail.pinId)});const i=(this._pinStackIds??[]).filter(e=>e!==t.detail.pinId);this._pinStackIds=i.length>1?i:null,this._selectedPinId=1===i.length?i[0]:null},this._onScaleLineComplete=t=>{const e=this._settings.unit_system,i="imperial"===e?"feet":"metres",n=window.prompt(`Real-world distance between these two points, in ${i}:`),s=n?ee(n,e):null;if(null===s||!Number.isFinite(s)||s<=0)return;const o=t.detail.points;this._updateLayout({scale:{points:o,meters:s}}),this._mode="select"},this._onPendingChanged=t=>{this._pendingCount=t.detail.count}}set hass(t){this._hass=t,this._initialized||(this._initialized=!0,this._init())}get hass(){return this._hass}get _client(){return new St(this._hass)}get _entityLookup(){return new Map(this._entities.map(t=>[t.entity_id,t]))}get _placedDeviceIds(){return new Set(("property"===this._view?this._propertyLayout.pins:this._layout.pins).map(t=>t.device_id).filter(t=>null!==t))}get _selectedRoom(){return this._layout.rooms.find(t=>t.id===this._selectedRoomId)??null}get _areasForCurrentFloor(){return this._areas.filter(t=>t.floor_id===this._currentFloorId||null===t.floor_id)}get _outdoorAreaIdsOnCurrentFloor(){const t=new Set(this._areas.filter(t=>null===t.floor_id).map(t=>t.area_id));return new Set(this._layout.rooms.map(t=>t.area_id).filter(e=>null!==e&&t.has(e)))}get _otherFloors(){return this._floors.filter(t=>t.floor_id!==this._currentFloorId)}get _buildings(){const t=new Map;for(const e of this._floors){const i=e.building_id??e.floor_id,n=t.get(i);n?n.push(e):t.set(i,[e])}return[...t.entries()].map(([t,e])=>{const i=e[0];return{key:t,name:e.length>1?e.map(t=>t.name).join(" + "):i.name,icon:i.icon||"mdi:home-city",floorId:i.floor_id,buildingId:i.building_id,aspectRatio:this._buildingAspectRatio(e)}})}_buildingAspectRatio(t){const e=this._buildingBounds(t),i=e?e.max_x-e.min_x:0,n=e?e.max_y-e.min_y:0;return i>0&&n>0?i/n:1.375}_buildingBounds(t){const e=t.map(t=>t.content_bounds).filter(t=>null!==t);return 0===e.length?null:{min_x:Math.min(...e.map(t=>t.min_x)),min_y:Math.min(...e.map(t=>t.min_y)),max_x:Math.max(...e.map(t=>t.max_x)),max_y:Math.max(...e.map(t=>t.max_y))}}get _floorNameById(){return new Map(this._floors.map(t=>[t.floor_id,t.name]))}get _floorIconById(){return new Map(this._floors.map(t=>[t.floor_id,t.icon||"mdi:floor-plan"]))}get _selectedPlacement(){return this._propertyLayout.placements.find(t=>t.id===this._selectedPlacementId)??null}get _activeBackground(){return"property"===this._view?{imageId:this._propertyLayout.background_image_id,opacity:this._propertyLayout.background_opacity}:{imageId:this._layout.background_image_id,opacity:this._layout.background_opacity}}get _alignOverlay(){if("align"!==this._mode||!this._alignTargetLayout)return null;const t=Mt(this._alignTargetLayout.background_image_id);if(!t)return null;const e=this._alignTargetLayout;return{imageUrl:t,offsetX:this._alignScale*e.background_offset_x+this._alignOffsetX,offsetY:this._alignScale*e.background_offset_y+this._alignOffsetY,scale:this._alignScale*e.background_scale,opacity:.55}}get _orderedFloors(){if("ground_up"!==this._settings.floor_order)return this._floors;const t=this._floors.filter(t=>null!==t.level),e=this._floors.filter(t=>null===t.level);return[...t.reverse(),...e]}get _placedDeviceChoices(){const t=t=>t.label_override??xt(t.device_id,this._entityLookup.values()),e=new Map;for(const i of this._layout.pins)i.device_id&&e.set(i.device_id,t(i));for(const[i,{pin:n}]of this._otherFloorPinsByDeviceId)e.has(i)||e.set(i,t(n));return[...e].map(([t,e])=>({deviceId:t,label:e})).sort((t,e)=>t.label.localeCompare(e.label))}get _pinByDeviceId(){const t=new Map;for(const e of this._layout.pins)e.device_id&&t.set(e.device_id,e);return t}get _normalizedMeshLinks(){if(!this._meshPopoverOpen)return[];if("zigbee"===this._networkType&&this._zigbeeMesh){const t=this._pinByDeviceId,e=this._outdoorPinByDeviceId,i=i=>t.has(i)?this._currentFloorId??void 0:e.has(i)?yt:this._otherFloorPinsByDeviceId.get(i)?.floorId;return function(t,e,i){const n=t.links.filter(t=>t.source_device_id&&t.target_device_id&&void 0!==e(t.source_device_id)&&void 0!==e(t.target_device_id));if(i)return n;const s=t.nodes.find(t=>"Coordinator"===t.type)?.ieee,o=new Set,r=new Map,l=new Map;for(const t of n){t.parent_child&&o.add(t),(t.source_ieee===s||t.target_ieee===s)&&t.lqi>=50&&o.add(t);const i=e(t.source_device_id)!==e(t.target_device_id)?l:r;for(const e of[t.source_ieee,t.target_ieee]){const n=i.get(e);(!n||t.lqi>n.lqi)&&i.set(e,t)}}for(const t of r.values())o.add(t);for(const t of l.values())o.add(t);return[...o]}(function(t,e){const i=t.nodes.find(t=>"Coordinator"===t.type)?.ieee;return e&&i?{...t,nodes:t.nodes.map(t=>t.ieee===i?{...t,device_id:e}:t),links:t.links.map(t=>({...t,source_device_id:t.source_ieee===i?e:t.source_device_id,target_device_id:t.target_ieee===i?e:t.target_device_id}))}:t}(this._zigbeeMesh,this._settings.zigbee_coordinator_device_id),i,this._zigbeeShowAllLinks).map(t=>{return{sourceDeviceId:t.source_device_id,targetDeviceId:t.target_device_id,quality:(e=t.lqi,e>=150?"strong":e>=80?"medium":"weak"),detail:t.lqi_readings.every(e=>e===t.lqi)?`LQI ${t.lqi}`:`LQI ${t.lqi} (raw ${t.lqi_readings.join(" / ")})`};var e})}if("wifi"===this._networkType&&this._wifiMesh)return this._wifiMesh.links.map(t=>{return{sourceDeviceId:t.source_device_id,targetDeviceId:t.target_device_id,quality:null!=t.rssi_dbm?(e=t.rssi_dbm,e>=-50?"strong":e>=-70?"medium":"weak"):"unknown",...null!=t.rssi_dbm?{detail:`${t.rssi_dbm} dBm`}:{}};var e});if("matter"===this._networkType&&this._matterTopology){const t=new Map;for(const e of this._matterTopology.nodes)e.ha_device_id&&t.set(e.id,e.ha_device_id);const e=[];for(const i of this._matterTopology.connections){const n=t.get(i.source),s=t.get(i.target);n&&s&&e.push({sourceDeviceId:n,targetDeviceId:s,quality:i.strength,detail:i.strength})}return e}return[]}get _outdoorPinByDeviceId(){const t=new Map;for(const e of this._propertyLayout.pins)e.device_id&&t.set(e.device_id,e);return t}_propertyEnd(t){const e=this._outdoorPinByDeviceId.get(t);if(e)return{deviceId:t,x:e.x,y:e.y,label:this._pinLabel(e),floorId:null};const i=this._pinByDeviceId.get(t),n=i?{pin:i,floorId:this._currentFloorId}:this._otherFloorPinsByDeviceId.get(t);if(!n?.floorId)return null;const s=this._placementForFloor(n.floorId),o=s?function(t,e,i){const n=t.source_bounds;if(!n||n.max_x<=n.min_x||n.max_y<=n.min_y)return null;const s=((e-n.min_x)/(n.max_x-n.min_x)-.5)*t.width,o=((i-n.min_y)/(n.max_y-n.min_y)-.5)*t.height,r=t.rotation_deg*Math.PI/180,l=Math.cos(r),a=Math.sin(r);return{x:t.x+l*s-a*o,y:t.y+a*s+l*o}}(s,n.pin.x,n.pin.y):null;return o?{deviceId:t,...o,label:this._pinLabel(n.pin),floorId:n.floorId}:null}get _propertyMeshLinks(){const t=this._outdoorPinByDeviceId,e=[];for(const i of this._normalizedMeshLinks){if(!t.has(i.sourceDeviceId)&&!t.has(i.targetDeviceId))continue;const n=this._propertyEnd(i.sourceDeviceId),s=this._propertyEnd(i.targetDeviceId);n&&s&&e.push({key:`${i.sourceDeviceId}|${i.targetDeviceId}`,from:n,to:s,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return e}get _selectedPropertyMeshLink(){return this._propertyMeshLinks.find(t=>t.key===this._selectedPropertyMeshLinkKey)??null}get _meshLinksForCurrentFloor(){const t=this._pinByDeviceId,e=[];for(const i of this._normalizedMeshLinks){const n=t.get(i.sourceDeviceId),s=t.get(i.targetDeviceId);n&&s&&e.push({fromPin:n,toPin:s,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return e}_placementForFloor(t){const e=this._floors.find(e=>e.floor_id===t);return e?this._propertyLayout.placements.find(i=>null!==e.building_id?i.building_id===e.building_id:i.floor_id===t)??null:null}_currentFloorContentBounds(){const t=[];for(const e of this._layout.rooms)t.push(...e.points);for(const e of this._layout.walls)t.push(...e.points);if(0===t.length)return null;const e=t.map(([t])=>t),i=t.map(([,t])=>t),n=Math.min(...e),s=Math.max(...e),o=Math.min(...i),r=Math.max(...i),l=.05*Math.max(s-n,r-o)||20;return{minX:n-l,minY:o-l,maxX:s+l,maxY:r+l}}_projectStubTowardBuilding(t,e){if(!this._currentFloorId)return null;const i=this._placementForFloor(this._currentFloorId),n=this._placementForFloor(e);if(!i||!n)return null;const s=this._currentFloorContentBounds();if(!s)return null;const o=Math.atan2(n.y-i.y,n.x-i.x)-i.rotation_deg*Math.PI/180;return function(t,e,i,n,s){const o=i>0?(s.maxX-t)/i:i<0?(s.minX-t)/i:1/0,r=n>0?(s.maxY-e)/n:n<0?(s.minY-e)/n:1/0,l=Math.min(o,r);return!isFinite(l)||l<=0?null:{x:t+i*l,y:e+n*l}}(t.x,t.y,Math.cos(o),Math.sin(o),s)}get _meshStubsForCurrentFloor(){if(!this._currentFloorId)return[];const t=this._pinByDeviceId,e=this._otherFloorPinsByDeviceId,i=this._floors.find(t=>t.floor_id===this._currentFloorId),n=[];for(const s of this._normalizedMeshLinks){const o=t.has(s.sourceDeviceId);if(o===t.has(s.targetDeviceId))continue;const r=t.get(o?s.sourceDeviceId:s.targetDeviceId),l=o?s.targetDeviceId:s.sourceDeviceId,a=this._outdoorPinByDeviceId.get(l);if(a){const t=this._placementForFloor(this._currentFloorId),e=t?wt(t,a.x,a.y):null;if(!e)continue;n.push({fromPin:r,x:e.x,y:e.y,targetDeviceId:l,targetFloorId:yt,targetFloorName:"Outside",targetLabel:this._pinLabel(a),quality:s.quality,...s.detail?{detail:s.detail}:{}});continue}const d=e.get(l);if(!d||d.floorId===this._currentFloorId)continue;const c=this._floors.find(t=>t.floor_id===d.floorId),h=d.pin.label_override??xt(d.pin.device_id,this._entityLookup.values()),p=null!==i?.building_id&&i?.building_id===c?.building_id?{x:d.pin.x,y:d.pin.y}:this._projectStubTowardBuilding(r,d.floorId);p&&n.push({fromPin:r,x:p.x,y:p.y,targetDeviceId:l,targetFloorId:d.floorId,targetFloorName:c?.name??d.floorId,targetLabel:h,quality:s.quality,...s.detail?{detail:s.detail}:{}})}return n}get _selectedPin(){return this._layout.pins.find(t=>t.id===this._selectedPinId)??null}get _pinStack(){if(!this._pinStackIds)return null;const t=new Map(this._layout.pins.map(t=>[t.id,t])),e=this._pinStackIds.map(e=>t.get(e)).filter(t=>!!t);return e.length>1?e:null}get _selectedWall(){return this._layout.walls.find(t=>t.id===this._selectedWallId)??null}get _selectedOpening(){return this._layout.openings.find(t=>t.id===this._selectedOpeningId)??null}get _selectedMeshLinkKey(){const t=this._selectedMeshLink;return t?`${t.fromPin.id}|${t.toPin.id}`:null}get _selectedMeshStubKey(){const t=this._selectedMeshStub;return t?`${t.fromPin.id}|${t.targetDeviceId}`:null}_unitsPerMeter(){const t=this._layout.scale;if(!t)return null;const[[e,i],[n,s]]=t.points;return(Math.hypot(n-e,s-i)||1)/t.meters}get _scaleReadout(){const t=this._unitsPerMeter();if(null===t)return null;const e=this._settings.unit_system,i=function(t,e){return"imperial"===e?t*Zt:t}(t,e);return`Scale: 1 ${Qt(e)} ≈ ${i.toFixed(1)} units`}_defaultOpeningWidth(){const t=this._unitsPerMeter();return null===t?30:.9*t}async _init(){const[t,e,i,n,s]=await Promise.all([this._client.listFloors(),this._client.listPlaceableEntities(),this._client.listAreas(),this._client.getPropertyLayout(),this._client.getSettings()]);this._floors=t,this._entities=e,this._areas=i,this._propertyLayout=n,this._settings=s;const o=this._orderedFloors[0];o&&await this._selectFloor(o.floor_id,{skipDirtyCheck:!0}),this._loading=!1}async _selectFloor(t,e={}){if(!e.skipDirtyCheck&&this._dirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save this floor — staying here so nothing is lost.")}else if(!window.confirm("Discard unsaved changes to this floor?"))return;this._autoSaveHeld=!1,this._view="floor";const i=this._layout.building_id;this._currentFloorId=t,this._layout=await this._client.getLayout(t),this._resetSelection(),this._resetAlignState(),this._floorHistory.clear();const n=Wt(this._layout.rooms,this._layout.pins);n!==this._layout.pins?(this._layout={...this._layout,pins:n},this._dirty=!0):this._dirty=!1,this._loadOtherFloorPins(t),this._sameBuildingAsPreviousFloor=null!==this._layout.building_id&&this._layout.building_id===i}async _loadOtherFloorPins(t){const e=this._floors.filter(e=>e.floor_id!==t),i=await Promise.all(e.map(t=>this._client.getLayout(t.floor_id)));if(this._currentFloorId!==t)return;const n=new Map;e.forEach((t,e)=>{for(const s of i[e].pins)s.device_id&&n.set(s.device_id,{pin:s,floorId:t.floor_id})}),this._otherFloorPinsByDeviceId=n}_resetAlignState(){this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1}_resetSelection(){this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._armedEntityId=null,this._armedOpeningType=null}async _save(){if(this._currentFloorId){this._saving=!0;try{const t=this._canvas?.getViewBox()??this._layout.view_box;this._layout={...this._layout,view_box:t};const e=this._layout;await this._client.saveLayout(this._currentFloorId,e),this._layout===e&&(this._dirty=!1),this._floors=this._floors.map(t=>t.floor_id===this._currentFloorId?{...t,has_layout:!0}:t),await this._refreshEntitiesIfPlacementChanged()}finally{this._saving=!1}}}async _export(){const t=await this._client.exportSnapshot(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(e),n=document.createElement("a");n.href=i,n.download="layout.json",n.click(),URL.revokeObjectURL(i)}_updateLayout(t){this._floorHistory.record(this._layout),this._layout={...this._layout,...t},this._dirty=!0}async _selectProperty(){if(this._propertyDirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save the property view — reopen the Property tab to try again.")}else if(!window.confirm("Discard unsaved changes to the property view?"))return;this._autoSaveHeld=!1,this._propertyLayout=await this._client.getPropertyLayout(),this._propertyHistory.clear(),this._propertyDirty=!1,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._propertyMode="select",this._armedBuildingKey=null,this._armedEntityId=null,this._view="property"}_updatePropertyLayout(t){this._propertyHistory.record(this._propertyLayout),this._propertyLayout={...this._propertyLayout,...t},this._propertyDirty=!0}_undoRedo(t){if("property"===this._view){const e=this._propertyLayout,i="undo"===t?this._propertyHistory.undo(e):this._propertyHistory.redo(e);if(!i)return;return this._propertyLayout={...i,view_box:e.view_box},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const e=this._layout,i="undo"===t?this._floorHistory.undo(e):this._floorHistory.redo(e);i&&(this._layout={...i,view_box:e.view_box,building_id:e.building_id},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)}get _canUndo(){return"property"===this._view?this._propertyHistory.canUndo:this._floorHistory.canUndo}get _canRedo(){return"property"===this._view?this._propertyHistory.canRedo:this._floorHistory.canRedo}async _saveProperty(){this._propertySaving=!0;try{const t=this._propertyCanvas?.getViewBox()??this._propertyLayout.view_box;this._propertyLayout={...this._propertyLayout,view_box:t};const e=this._propertyLayout;await this._client.savePropertyLayout(e),this._propertyLayout===e&&(this._propertyDirty=!1),await this._refreshEntitiesIfPlacementChanged()}finally{this._propertySaving=!1}}get _selectedOutdoorPin(){return this._propertyLayout.pins.find(t=>t.id===this._selectedOutdoorPinId)??null}_patchOutdoorPin(t,e){this._updatePropertyLayout({pins:this._propertyLayout.pins.map(i=>i.id===t?{...i,...e}:i)})}_patchPlacement(t,e){this._updatePropertyLayout({placements:this._propertyLayout.placements.map(i=>i.id===t?{...i,...e}:i)})}_placementKey(){return[...this._layout.pins,...this._propertyLayout.pins].map(t=>t.device_id??"").sort().join(",")}async _refreshEntitiesIfPlacementChanged(){const t=this._placementKey();t!==this._placementKeyForEntities&&(this._entities=await this._client.listPlaceableEntities(),this._placementKeyForEntities=t)}get _autoSaveActive(){return this._settings.auto_save&&!this._autoSaveHeld}updated(t){super.updated(t),(t.has("_layout")||t.has("_propertyLayout")||t.has("_dirty")||t.has("_propertyDirty"))&&this._scheduleAutoSave()}_scheduleAutoSave(){null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null),this._autoSaveActive&&(this._dirty||this._propertyDirty)&&(this._autoSaveTimer=window.setTimeout(()=>{this._runAutoSave()},Le.AUTO_SAVE_DELAY_MS))}async _runAutoSave(){if(this._autoSaveTimer=null,this._autoSaveActive)if(this._saving||this._propertySaving)this._scheduleAutoSave();else try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{}}async _flushAutoSave(){if(!this._autoSaveActive)return!this._dirty&&!this._propertyDirty;null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null);try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{return!1}return!this._dirty&&!this._propertyDirty}async _loadCachedZigbeeMesh(){try{const t=await this._client.getCachedZigbeeMesh();if(!t?.fetched_at||this._zigbeeMeshLoading)return;const e=1e3*t.fetched_at;if(this._zigbeeMeshFetchedAt&&e<=this._zigbeeMeshFetchedAt)return;this._zigbeeMesh=t,this._zigbeeMeshFetchedAt=e}catch{}}async _refreshZigbeeMesh(t=!1){this._zigbeeMeshLoading=!0,this._zigbeeMeshError=null;const e=Date.now();this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=window.setInterval(()=>{this._zigbeeMeshElapsedSeconds=Math.round((Date.now()-e)/1e3)},1e3);try{this._zigbeeMesh=await this._client.getZigbeeMesh(t),this._zigbeeMeshFetchedAt=this._zigbeeMesh.fetched_at?1e3*this._zigbeeMesh.fetched_at:Date.now()}catch(t){const e=t?.message;this._zigbeeMeshError=e||"Zigbee mesh request failed"}finally{this._zigbeeMeshLoading=!1,null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}}async _refreshWifiMesh(){this._wifiMeshLoading=!0,this._wifiMeshError=null;try{this._wifiMesh=await this._client.getWifiMesh()}catch(t){const e=t?.message;this._wifiMeshError=e||"Wi-Fi mesh request failed"}finally{this._wifiMeshLoading=!1}}async _subscribeMatter(){this._unsubscribeMatter(),this._matterError=null;try{this._matterUnsubscribe=await this._client.subscribeMatterTopology(t=>{this._matterTopology=t})}catch(t){const e=t?.message;this._matterError=e||"Matter topology subscription failed"}}_unsubscribeMatter(){this._matterUnsubscribe?.(),this._matterUnsubscribe=null}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("beforeunload",this._onBeforeUnload)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("beforeunload",this._onBeforeUnload),this._flushAutoSave(),this._unsubscribeMatter(),null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}_deepActiveElement(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t}_isTypingTarget(){const t=this._deepActiveElement();return!!t&&(!!(t instanceof HTMLElement&&t.isContentEditable)||["INPUT","TEXTAREA","SELECT"].includes(t.tagName))}async _handleBackgroundFile(t){if(Le._ACCEPTED_BACKGROUND_TYPES.has(t.type))try{const e={background_image_id:await this._client.uploadBackgroundImage(t),background_opacity:.85};"property"===this._view?this._updatePropertyLayout(e):this._updateLayout(e)}catch(t){window.alert(`Background image upload failed: ${t.message}`)}else window.alert("Background image must be a PNG, JPEG, or GIF file.")}_patchRoom(t,e){this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===t?{...i,...e}:i)})}_patchPin(t,e){this._updateLayout({pins:this._layout.pins.map(i=>i.id===t?{...i,...e}:i)})}_pinLabel(t){return t.label_override?t.label_override:xt(t.device_id,this._entityLookup.values())}_meshAgeLabel(t){const e=Math.round((Date.now()-t)/1e3);return e<60?`refreshed ${e}s ago`:`refreshed ${Math.round(e/60)}m ago`}render(){if(this._loading)return V`<div class="loading">Loading Spatial Context…</div>`;if(0===this._floors.length)return V`<div class="no-floors">
        No floors found. Add floors under Settings → Areas → Floors, then reopen
        this panel.
      </div>`;const t="zigbee"===this._networkType?this._zigbeeMeshError:"wifi"===this._networkType?this._wifiMeshError:this._matterError;return V`
      <app-header
        .floors=${this._orderedFloors}
        .selectedFloorId=${this._currentFloorId}
        .propertySelected=${"property"===this._view}
        .dirty=${"property"===this._view?this._propertyDirty:this._dirty}
        .saving=${"property"===this._view?this._propertySaving:this._saving}
        .canUndo=${this._canUndo}
        .canRedo=${this._canRedo}
        @undo-click=${this._onUndo}
        @redo-click=${this._onRedo}
        @floor-selected=${this._onFloorSelected}
        @property-selected=${this._onPropertySelected}
        @save-click=${this._onSaveClick}
      >
        <icon-popover
          icon="mdi:image"
          label="Background"
          .open=${this._backgroundPopoverOpen}
          @toggle=${this._onToggleBackgroundPopover}
        >
          <input
            id="file-input"
            class="hidden-file-input"
            type="file"
            accept="image/png,image/jpeg,image/gif"
            @change=${this._onFileInputChange}
          />
          <button class="menu-item" @click=${()=>this._fileInput?.click()}>
            <ha-icon icon="mdi:image-plus"></ha-icon>
            ${this._activeBackground.imageId?"Replace background":"Upload background"}
          </button>
          ${this._activeBackground.imageId?V`<button
                  class="menu-item"
                  @click=${this._onRemoveBackgroundClick}
                >
                  <ha-icon icon="mdi:image-remove"></ha-icon> Remove background
                </button>`:K}
          ${this._activeBackground.imageId?V`<label
                  class="popover-row hint"
                  style="padding: 8px 16px 4px"
                  >Opacity
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    .value=${String(this._activeBackground.opacity)}
                    @input=${this._onOpacityChange}
                  />
                </label>`:K}
        </icon-popover>
        ${"floor"===this._view||"property"===this._view?V`<icon-popover
                icon="mdi:layers"
                label="Connectivity Map"
                .open=${this._meshPopoverOpen}
                @toggle=${this._onToggleMeshPopover}
              >
                <div class="layer-list">
                  <button
                    class="menu-item ${"zigbee"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("zigbee")}
                  >
                    <ha-icon icon="mdi:zigbee"></ha-icon> Zigbee Mesh
                  </button>
                  <button
                    class="menu-item ${"wifi"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("wifi")}
                  >
                    <ha-icon icon="mdi:wifi"></ha-icon> Wi-Fi Network
                  </button>
                  <button
                    class="menu-item ${"matter"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("matter")}
                  >
                    <ha-icon icon="mdi:router-wireless"></ha-icon> Matter
                    Network
                  </button>
                </div>
                ${null===this._networkType?V`<span class="hint" style="padding: 4px 16px 8px"
                        >Pick a network above to load it.</span
                      >`:V`
                        <div class="quality-legend">
                          <span
                            class="legend-gradient"
                            style="background: linear-gradient(to right, ${vt("weak")}, ${vt("medium")}, ${vt("strong")})"
                          ></span>
                          <div class="legend-labels">
                            <span>Weak</span><span>Strong</span>
                          </div>
                        </div>
                        ${"zigbee"===this._networkType?V`<button
                                  class="menu-item"
                                  ?disabled=${this._zigbeeMeshLoading}
                                  @click=${this._onLoadMesh}
                                >
                                  <ha-icon icon="mdi:refresh"></ha-icon>
                                  ${this._zigbeeMeshLoading?`Loading… ${this._zigbeeMeshElapsedSeconds}s (usually 1-2 min)`:this._zigbeeMeshFetchedAt?"Refresh Mesh":"Load Mesh"}
                                </button>
                                <label
                                  class="popover-row hint"
                                  style="padding: 4px 16px 8px"
                                >
                                  <input
                                    type="checkbox"
                                    .checked=${this._zigbeeShowAllLinks}
                                    @change=${t=>{this._zigbeeShowAllLinks=t.target.checked,this._selectedMeshLink=null,this._selectedMeshStub=null}}
                                  />
                                  Show all links
                                </label>`:"matter"===this._networkType&&this._matterUnsubscribe?V`<span
                                  class="hint"
                                  style="padding: 4px 16px 8px"
                                  >● Live</span
                                >`:"wifi"===this._networkType&&this._wifiMeshLoading?V`<span
                                    class="hint"
                                    style="padding: 4px 16px 8px"
                                    >Loading…</span
                                  >`:K}
                        ${t?V`<span
                                class="hint"
                                style="color: var(--sc-danger); padding: 0 16px 8px"
                                >${t}</span
                              >`:"zigbee"===this._networkType&&this._zigbeeMeshFetchedAt?V`<span
                                  class="hint"
                                  style="padding: 0 16px 8px"
                                  >${this._meshAgeLabel(this._zigbeeMeshFetchedAt)}</span
                                >`:K}
                      `}
              </icon-popover>`:K}
        <icon-popover
          slot="end"
          icon="mdi:cog"
          label="Settings"
          .open=${this._settingsPopoverOpen}
          @toggle=${this._onToggleSettingsPopover}
        >
          <label class="popover-row hint" style="padding: 8px 16px 4px">
            <input
              type="checkbox"
              .checked=${this._settings.auto_save}
              @change=${this._onAutoSaveToggle}
            />
            Auto-save changes
          </label>
          <span class="popover-row hint" style="padding: 8px 16px 4px"
            >Units</span
          >
          <button
            class="menu-item ${"metric"===this._settings.unit_system?"active":""}"
            @click=${()=>this._onUnitSystemSelect("metric")}
          >
            <ha-icon icon="mdi:ruler"></ha-icon> Metric (m / cm)
          </button>
          <button
            class="menu-item ${"imperial"===this._settings.unit_system?"active":""}"
            @click=${()=>this._onUnitSystemSelect("imperial")}
          >
            <ha-icon icon="mdi:ruler"></ha-icon> Imperial (ft / in)
          </button>
          <span class="popover-row hint" style="padding: 8px 16px 4px"
            >Floor tab order</span
          >
          <button
            class="menu-item ${"ground_up"!==this._settings.floor_order?"active":""}"
            @click=${()=>this._onFloorOrderSelect("top_down")}
          >
            <ha-icon icon="mdi:sort-numeric-descending"></ha-icon> Top floor
            first
          </button>
          <button
            class="menu-item ${"ground_up"===this._settings.floor_order?"active":""}"
            @click=${()=>this._onFloorOrderSelect("ground_up")}
          >
            <ha-icon icon="mdi:sort-numeric-ascending"></ha-icon> Ground floor
            first
          </button>
          <span class="popover-row hint" style="padding: 8px 16px 4px"
            >Zigbee mesh</span
          >
          <label class="popover-row hint" style="padding: 4px 16px"
            >Coordinator
            <select @change=${this._onCoordinatorDeviceChange}>
              <option
                value=""
                ?selected=${!this._settings.zigbee_coordinator_device_id}
              >
                Zigbee2MQTT Bridge (default)
              </option>
              ${this._settings.zigbee_coordinator_device_id&&!this._placedDeviceChoices.some(t=>t.deviceId===this._settings.zigbee_coordinator_device_id)?V`<option
                      value=${this._settings.zigbee_coordinator_device_id}
                      selected
                    >
                      (device not placed)
                    </option>`:K}
              ${this._placedDeviceChoices.map(({deviceId:t,label:e})=>V`<option
                    value=${t}
                    ?selected=${t===this._settings.zigbee_coordinator_device_id}
                  >
                    ${e}
                  </option>`)}
            </select>
          </label>
          <label class="popover-row hint" style="padding: 4px 16px 8px"
            >Timeout (seconds)
            <input
              type="number"
              min="30"
              max="600"
              step="10"
              .value=${String(this._settings.zigbee_timeout_seconds)}
              @change=${this._onZigbeeTimeoutChange}
            />
          </label>
        </icon-popover>
        <icon-popover
          slot="end"
          icon="mdi:dots-vertical"
          label="More options"
          .open=${this._moreOptionsPopoverOpen}
          @toggle=${this._onToggleMoreOptionsPopover}
        >
          <button
            class="menu-item"
            @click=${()=>{this._moreOptionsPopoverOpen=!1,this._onExportClick()}}
          >
            <ha-icon icon="mdi:download"></ha-icon> Export JSON
          </button>
          <button
            class="menu-item danger"
            @click=${()=>{this._moreOptionsPopoverOpen=!1,this._onResetClick()}}
          >
            <ha-icon icon="mdi:delete-sweep"></ha-icon>
            ${"property"===this._view?"Reset property":"Reset floor"}
          </button>
        </icon-popover>
      </app-header>

      <div class="main">
        ${"property"===this._view?V`
                <div
                  class="canvas-area ${this._dragOverCanvas?"drag-over":""}"
                  @dragover=${this._onCanvasDragOver}
                  @dragleave=${this._onCanvasDragLeave}
                  @drop=${this._onCanvasDrop}
                >
                  <property-canvas
                    .placements=${this._propertyLayout.placements}
                    .floorNameById=${this._floorNameById}
                    .floorIconById=${this._floorIconById}
                    .backgroundImageUrl=${Mt(this._propertyLayout.background_image_id)}
                    .backgroundOpacity=${this._propertyLayout.background_opacity}
                    .backgroundOffsetX=${this._propertyLayout.background_offset_x}
                    .backgroundOffsetY=${this._propertyLayout.background_offset_y}
                    .backgroundScale=${this._propertyLayout.background_scale}
                    .initialViewBox=${this._propertyLayout.view_box}
                    .mode=${this._propertyMode}
                    .selectedPlacementId=${this._selectedPlacementId}
                    .pins=${this._propertyLayout.pins}
                    .selectedPinId=${this._selectedOutdoorPinId}
                    .entityLookup=${this._entityLookup}
                    .meshLinks=${this._propertyMeshLinks}
                    .selectedMeshLinkKey=${this._selectedPropertyMeshLinkKey}
                    @outdoor-pin-place=${this._onOutdoorPinPlace}
                    @outdoor-pin-move=${this._onOutdoorPinMove}
                    @outdoor-pin-select=${this._onOutdoorPinSelect}
                    @property-mesh-link-select=${this._onPropertyMeshLinkSelect}
                    @placement-place=${this._onPlacementPlace}
                    @placement-move=${this._onPlacementMove}
                    @placement-resize=${this._onPlacementResize}
                    @placement-rotate=${this._onPlacementRotate}
                    @placement-select=${this._onPlacementSelect}
                  ></property-canvas>
                  <property-overlay
                    .mode=${this._propertyMode}
                    .buildings=${this._buildings}
                    .armedBuildingKey=${this._armedBuildingKey}
                    .selectedPlacement=${this._selectedPlacement}
                    .selectedPinLabel=${this._selectedOutdoorPin?this._pinLabel(this._selectedOutdoorPin):null}
                    .selectedMeshLink=${this._selectedPropertyMeshLink}
                    .floorNameById=${this._floorNameById}
                    @outdoor-pin-rename-click=${this._onOutdoorPinRename}
                    @outdoor-pin-icon-click=${this._onOutdoorPinIcon}
                    @outdoor-pin-delete-click=${this._onOutdoorPinDelete}
                    @property-mesh-goto-floor-click=${this._onPropertyMeshGotoFloor}
                    @property-mode-change=${this._onPropertyModeChange}
                    @placement-arm=${this._onPlacementArm}
                    @placement-rename-click=${this._onPlacementRenameClick}
                    @placement-delete-click=${this._onPlacementDeleteClick}
                    @placement-goto-floor-click=${this._onPlacementGotoFloorClick}
                  ></property-overlay>
                </div>
                ${"place-pin"===this._propertyMode?V`<entity-picker-sidebar
                        .entities=${this._entities}
                        .placedDeviceIds=${this._placedDeviceIds}
                        .armedEntityId=${this._armedEntityId}
                        .floors=${this._floors}
                        .areas=${this._areas}
                        .currentFloorId=${yt}
                        @entity-armed=${this._onEntityArmed}
                        @clear-all-pins=${this._onClearAllOutdoorPins}
                      ></entity-picker-sidebar>`:K}
              `:V`
                <div
                  class="canvas-area ${this._dragOverCanvas?"drag-over":""}"
                  @dragover=${this._onCanvasDragOver}
                  @dragleave=${this._onCanvasDragLeave}
                  @drop=${this._onCanvasDrop}
                >
                  <floorplan-canvas
                    .rooms=${this._layout.rooms}
                    .pins=${this._layout.pins}
                    .walls=${this._layout.walls}
                    .openings=${this._layout.openings}
                    .scale=${this._layout.scale}
                    .unitSystem=${this._settings.unit_system}
                    .meshLinks=${this._meshLinksForCurrentFloor}
                    .meshStubs=${this._meshStubsForCurrentFloor}
                    .entityLookup=${this._entityLookup}
                    .backgroundImageUrl=${Mt(this._layout.background_image_id)}
                    .backgroundOpacity=${this._layout.background_opacity}
                    .backgroundOffsetX=${this._layout.background_offset_x}
                    .backgroundOffsetY=${this._layout.background_offset_y}
                    .backgroundScale=${this._layout.background_scale}
                    .alignOverlay=${this._alignOverlay}
                    .initialViewBox=${this._layout.view_box}
                    .sameBuildingAsPrevious=${this._sameBuildingAsPreviousFloor}
                    .mode=${this._mode}
                    .armedEntityId=${this._armedEntityId}
                    .armedOpeningType=${this._armedOpeningType}
                    .selectedRoomId=${this._selectedRoomId}
                    .editingRoomId=${this._editingRoomId}
                    .selectedPinId=${this._selectedPinId}
                    .selectedWallId=${this._selectedWallId}
                    .editingWallId=${this._editingWallId}
                    .selectedOpeningId=${this._selectedOpeningId}
                    .selectedMeshLinkKey=${this._selectedMeshLinkKey}
                    .selectedMeshStubKey=${this._selectedMeshStubKey}
                    @room-trace-complete=${this._onRoomTraceComplete}
                    @room-vertex-changed=${this._onRoomVertexChanged}
                    @room-label-moved=${this._onRoomLabelMoved}
                    @room-select=${this._onRoomSelect}
                    @wall-trace-complete=${this._onWallTraceComplete}
                    @wall-vertex-changed=${this._onWallVertexChanged}
                    @wall-select=${this._onWallSelect}
                    @opening-place=${this._onOpeningPlace}
                    @opening-select=${this._onOpeningSelect}
                    @opening-update=${this._onOpeningUpdate}
                    @pin-place=${this._onPinPlace}
                    @pin-move=${this._onPinMove}
                    @pin-select=${this._onPinSelect}
                    @pin-stack-select=${this._onPinStackSelect}
                    @mesh-link-select=${this._onMeshLinkSelect}
                    @mesh-stub-select=${this._onMeshStubSelect}
                    @scale-line-complete=${this._onScaleLineComplete}
                    @pending-changed=${this._onPendingChanged}
                    @align-drag=${this._onAlignDrag}
                  ></floorplan-canvas>

                  <canvas-overlay
                    .mode=${this._mode}
                    .armedOpeningType=${this._armedOpeningType}
                    .hasPendingTrace=${"trace"===this._mode&&this._pendingCount>0}
                    .hasPendingWall=${"wall"===this._mode&&this._pendingCount>=2}
                    .pendingScaleCount=${"scale"===this._mode?this._pendingCount:0}
                    .scaleReadout=${this._scaleReadout}
                    .unitSystem=${this._settings.unit_system}
                    .unitsPerMeter=${this._unitsPerMeter()}
                    .selectedRoom=${this._selectedRoom}
                    .editingRoom=${!!this._editingRoomId}
                    .areas=${this._areasForCurrentFloor}
                    .selectedPin=${this._selectedPin}
                    .selectedWall=${this._selectedWall}
                    .editingWall=${!!this._editingWallId}
                    .selectedOpening=${this._selectedOpening}
                    .selectedMeshLink=${this._selectedMeshLink}
                    .selectedMeshStub=${this._selectedMeshStub}
                    .pinStack=${this._pinStack}
                    .entityLookup=${this._entityLookup}
                    .otherFloors=${this._otherFloors}
                    .alignTargetFloorId=${this._alignTargetFloorId}
                    .alignTargetHasBackground=${!this._alignTargetLayout||!!this._alignTargetLayout.background_image_id}
                    @mode-change=${this._onModeChange}
                    @align-target-change=${this._onAlignTargetChange}
                    @align-scale-click=${this._onAlignScaleClick}
                    @align-apply-click=${this._onAlignApply}
                    @align-cancel-click=${this._onAlignCancel}
                    @add-opening-click=${this._onAddOpeningClick}
                    @cancel-pending-click=${this._onCancelPending}
                    @finish-wall-click=${this._onFinishWall}
                    @room-rename-click=${this._onRoomRename}
                    @room-area-change=${this._onRoomAreaChange}
                    @room-visible-toggle=${this._onRoomVisibleToggle}
                    @room-fill-color-change=${this._onRoomFillColorChange}
                    @room-fill-opacity-change=${this._onRoomFillOpacityChange}
                    @room-border-opacity-change=${this._onRoomBorderOpacityChange}
                    @room-edit-vertices-click=${this._onRoomEditVertices}
                    @room-label-reset-click=${this._onRoomLabelReset}
                    @room-delete-click=${this._onRoomDelete}
                    @pin-set-label-click=${this._onPinSetLabel}
                    @pin-set-icon-click=${this._onPinSetIcon}
                    @pin-set-height-click=${this._onPinSetHeight}
                    @pin-delete-click=${this._onPinDelete}
                    @wall-material-change=${this._onWallMaterialChange}
                    @wall-thickness-change=${this._onWallThicknessChange}
                    @wall-edit-vertices-click=${this._onWallEditVertices}
                    @wall-delete-click=${this._onWallDelete}
                    @opening-width-change=${this._onOpeningWidthChange}
                    @opening-delete-click=${this._onOpeningDelete}
                    @pin-stack-choose=${this._onPinStackChoose}
                    @pin-stack-dismiss=${this._onPinStackDismiss}
                    @pin-stack-remove-click=${this._onPinStackRemove}
                    @mesh-stub-goto-floor-click=${this._onMeshStubGotoFloorClick}
                  ></canvas-overlay>
                </div>
                ${"place"===this._mode?V`<entity-picker-sidebar
                        .entities=${this._entities}
                        .placedDeviceIds=${this._placedDeviceIds}
                        .armedEntityId=${this._armedEntityId}
                        .floors=${this._floors}
                        .areas=${this._areas}
                        .currentFloorId=${this._currentFloorId}
                        .linkedAreaIds=${this._outdoorAreaIdsOnCurrentFloor}
                        @entity-armed=${this._onEntityArmed}
                        @clear-all-pins=${this._onClearAllPins}
                      ></entity-picker-sidebar>`:K}
              `}
      </div>
    `}};Te.styles=[re,r`
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: var(--sc-bg);
      }
      .main {
        flex: 1;
        display: flex;
        min-height: 0;
      }
      .canvas-area {
        flex: 1;
        min-width: 0;
        position: relative;
      }
      .canvas-area.drag-over {
        outline: 2px dashed var(--sc-accent);
        outline-offset: -2px;
      }
      .loading,
      .no-floors {
        padding: 32px;
        color: var(--sc-fg-secondary);
      }
      .popover-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      /* Innerspace-style layer menu: "Connectivity Map" opens a list of
       * mutually-exclusive layers (only one network is ever drawn at once)
       * instead of a plain <select>, plus a quality legend echoing the
       * same weak/medium/strong colors the mesh lines themselves use. */
      .layer-list {
        display: flex;
        flex-direction: column;
        min-width: 220px;
      }
      .quality-legend {
        padding: 8px 16px 4px;
      }
      .legend-gradient {
        display: block;
        height: 6px;
        border-radius: 3px;
      }
      .legend-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: var(--sc-fg-secondary);
        margin-top: 2px;
      }
      .hidden-file-input {
        display: none;
      }
      input[type="range"] {
        width: 120px;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--sc-fg-secondary);
      }
    `],Te.AUTO_SAVE_DELAY_MS=3e3,Te._ACCEPTED_BACKGROUND_TYPES=new Set(["image/png","image/jpeg","image/gif"]),t([_t()],Te.prototype,"_floors",void 0),t([_t()],Te.prototype,"_currentFloorId",void 0),t([_t()],Te.prototype,"_layout",void 0),t([_t()],Te.prototype,"_entities",void 0),t([_t()],Te.prototype,"_areas",void 0),t([_t()],Te.prototype,"_mode",void 0),t([_t()],Te.prototype,"_dragOverCanvas",void 0),t([_t()],Te.prototype,"_armedEntityId",void 0),t([_t()],Te.prototype,"_armedOpeningType",void 0),t([_t()],Te.prototype,"_selectedRoomId",void 0),t([_t()],Te.prototype,"_editingRoomId",void 0),t([_t()],Te.prototype,"_selectedPinId",void 0),t([_t()],Te.prototype,"_pinStackIds",void 0),t([_t()],Te.prototype,"_selectedWallId",void 0),t([_t()],Te.prototype,"_editingWallId",void 0),t([_t()],Te.prototype,"_selectedOpeningId",void 0),t([_t()],Te.prototype,"_selectedMeshLink",void 0),t([_t()],Te.prototype,"_selectedMeshStub",void 0),t([_t()],Te.prototype,"_otherFloorPinsByDeviceId",void 0),t([_t()],Te.prototype,"_dirty",void 0),t([_t()],Te.prototype,"_saving",void 0),t([_t()],Te.prototype,"_loading",void 0),t([_t()],Te.prototype,"_pendingCount",void 0),t([_t()],Te.prototype,"_networkType",void 0),t([_t()],Te.prototype,"_zigbeeMesh",void 0),t([_t()],Te.prototype,"_zigbeeMeshLoading",void 0),t([_t()],Te.prototype,"_zigbeeMeshError",void 0),t([_t()],Te.prototype,"_zigbeeMeshFetchedAt",void 0),t([_t()],Te.prototype,"_zigbeeMeshElapsedSeconds",void 0),t([_t()],Te.prototype,"_zigbeeShowAllLinks",void 0),t([_t()],Te.prototype,"_wifiMesh",void 0),t([_t()],Te.prototype,"_wifiMeshLoading",void 0),t([_t()],Te.prototype,"_wifiMeshError",void 0),t([_t()],Te.prototype,"_matterTopology",void 0),t([_t()],Te.prototype,"_matterError",void 0),t([_t()],Te.prototype,"_backgroundPopoverOpen",void 0),t([_t()],Te.prototype,"_meshPopoverOpen",void 0),t([_t()],Te.prototype,"_settings",void 0),t([_t()],Te.prototype,"_settingsPopoverOpen",void 0),t([_t()],Te.prototype,"_moreOptionsPopoverOpen",void 0),t([_t()],Te.prototype,"_view",void 0),t([_t()],Te.prototype,"_propertyLayout",void 0),t([_t()],Te.prototype,"_propertyDirty",void 0),t([_t()],Te.prototype,"_propertySaving",void 0),t([_t()],Te.prototype,"_selectedPlacementId",void 0),t([_t()],Te.prototype,"_propertyMode",void 0),t([_t()],Te.prototype,"_selectedOutdoorPinId",void 0),t([_t()],Te.prototype,"_selectedPropertyMeshLinkKey",void 0),t([_t()],Te.prototype,"_armedBuildingKey",void 0),t([_t()],Te.prototype,"_sameBuildingAsPreviousFloor",void 0),t([_t()],Te.prototype,"_alignTargetFloorId",void 0),t([_t()],Te.prototype,"_alignTargetLayout",void 0),t([_t()],Te.prototype,"_alignOffsetX",void 0),t([_t()],Te.prototype,"_alignOffsetY",void 0),t([_t()],Te.prototype,"_alignScale",void 0),t([gt("floorplan-canvas")],Te.prototype,"_canvas",void 0),t([gt("property-canvas")],Te.prototype,"_propertyCanvas",void 0),t([gt("#file-input")],Te.prototype,"_fileInput",void 0),Te=Le=t([mt("spatial-context-panel")],Te)}();
