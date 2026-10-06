/*! spatial-context-panel v0.13.0-beta.1 | MIT */
!function(){"use strict";function e(e,t,i,o){var s,n=arguments.length,r=n<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(r=(n<3?s(r):n>3?s(t,i,r):s(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new n(i,e,o)},l=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:a,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",y=_.reactiveElementPolyfillSupport,v=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!a(e,t),x={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&d(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:s}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const n=o?.call(this);s?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),s=t.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=o;const n=s.fromAttribute(t,e.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(e,t,i,o=!1,s){if(void 0!==e){const n=this.constructor;if(!1===o&&(s=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??b)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,y?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,I=$.trustedTypes,P=I?I.createPolicy("lit-html",{createHTML:e=>e}):void 0,M="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,E=`<${C}>`,L=document,T=()=>L.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,A="[ \t\n\f\r]",B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,D=/>/g,z=RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,U=/"/g,W=/^(?:script|style|textarea|title)$/i,N=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=N(1),Y=N(2),X=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),K=new WeakMap,q=L.createTreeWalker(L,129);function G(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==P?P.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,o=[];let s,n=2===t?"<svg>":3===t?"<math>":"",r=B;for(let t=0;t<i;t++){const i=e[t];let l,a,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,a=r.exec(i),null!==a);)c=r.lastIndex,r===B?"!--"===a[1]?r=F:void 0!==a[1]?r=D:void 0!==a[2]?(W.test(a[2])&&(s=RegExp("</"+a[2],"g")),r=z):void 0!==a[3]&&(r=z):r===z?">"===a[0]?(r=s??B,d=-1):void 0===a[1]?d=-2:(d=r.lastIndex-a[2].length,l=a[1],r=void 0===a[3]?z:'"'===a[3]?U:H):r===U||r===H?r=z:r===F||r===D?r=B:(r=z,s=void 0);const h=r===z&&e[t+1].startsWith("/>")?" ":"";n+=r===B?i+E:d>=0?(o.push(l),i.slice(0,d)+M+i.slice(d)+S+h):i+S+(-2===d?t:h)}return[G(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class J{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let s=0,n=0;const r=e.length-1,l=this.parts,[a,d]=Z(e,t);if(this.el=J.createElement(a,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=q.nextNode())&&l.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(M)){const t=d[n++],i=o.getAttribute(e).split(S),r=/([.?@])?(.*)/.exec(t);l.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?oe:"?"===r[1]?se:"@"===r[1]?ne:ie}),o.removeAttribute(e)}else e.startsWith(S)&&(l.push({type:6,index:s}),o.removeAttribute(e));if(W.test(o.tagName)){const e=o.textContent.split(S),t=e.length-1;if(t>0){o.textContent=I?I.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],T()),q.nextNode(),l.push({type:2,index:++s});o.append(e[t],T())}}}else if(8===o.nodeType)if(o.data===C)l.push({type:2,index:s});else{let e=-1;for(;-1!==(e=o.data.indexOf(S,e+1));)l.push({type:7,index:s}),e+=S.length-1}s++}}static createElement(e,t){const i=L.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,o){if(t===X)return t;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=O(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(t=Q(e,s._$AS(e,t.values),s,o)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??L).importNode(t,!0);q.currentNode=o;let s=q.nextNode(),n=0,r=0,l=i[0];for(;void 0!==l;){if(n===l.index){let t;2===l.type?t=new te(s,s.nextSibling,this,e):1===l.type?t=new l.ctor(s,l.name,l.strings,this,e):6===l.type&&(t=new re(s,this,e)),this._$AV.push(t),l=i[++r]}n!==l?.index&&(s=q.nextNode(),n++)}return q.currentNode=L,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),O(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==X&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(L.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new ee(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new J(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const s of e)o===t.length?t.push(i=new te(this.O(T()),this.O(T()),this,this.options)):i=t[o],i._$AI(s),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(e,t=this,i,o){const s=this.strings;let n=!1;if(void 0===s)e=Q(this,e,t,0),n=!O(e)||e!==this._$AH&&e!==X,n&&(this._$AH=e);else{const o=e;let r,l;for(e=s[0],r=0;r<s.length-1;r++)l=Q(this,o[i+r],t,r),l===X&&(l=this._$AH[r]),n||=!O(l)||l!==this._$AH[r],l===j?e=j:e!==j&&(e+=(l??"")+s[r+1]),this._$AH[r]=l}n&&!o&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class oe extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class se extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class ne extends ie{constructor(e,t,i,o,s){super(e,t,i,o,s),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??j)===X)return;const i=this._$AH,o=e===j&&i!==j||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==j&&(i===j||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const le=$.litHtmlPolyfillSupport;le?.(J,te),($.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;class de extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let s=o._$litPart$;if(void 0===s){const e=i?.renderBefore??null;o._$litPart$=s=new te(t.insertBefore(T(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}}de._$litElement$=!0,de.finalized=!0,ae.litElementHydrateSupport?.({LitElement:de});const ce=ae.litElementPolyfillSupport;ce?.({LitElement:de}),(ae.litElementVersions??=[]).push("4.2.2");const he={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:b},pe=(e=he,t,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,s,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];t.call(this,i),this.requestUpdate(o,s,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ue(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function _e(e){return ue({...e,state:!0,attribute:!1})}function ge(e,t){return(t,i,o)=>((e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,i),i))(t,i,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}const me=e=>(t,i)=>{const o=()=>{customElements.get(e)?console.info(`spatial-context: <${e}> already defined — reload the page to pick up the updated panel.`):customElements.define(e,t)};void 0!==i?i.addInitializer(o):o()},ye="__property__";function ve(e){switch(e){case"strong":return"#2e7d32";case"medium":return"#f9a825";case"weak":return"#c62828";default:return"#607d8b"}}function fe(e){return e>=-70?"strong":e>=-85?"medium":"weak"}const be=["light","switch","climate","media_player","lock","cover","fan","vacuum","alarm_control_panel","valve","humidifier","siren","water_heater","camera","assist_satellite","device_tracker","binary_sensor","sensor"];function xe(e,t){if(!e)return null;const i=[...t].filter(t=>t.device_id===e);if(0===i.length)return null;const o=e=>"config"===e.entity_category?2:e.entity_category?1:0,s=e=>{const t=be.indexOf(e.domain);return-1===t?be.length:t};return i.sort((e,t)=>o(e)-o(t)||s(e)-s(t)),i[0]}function we(e,t){return xe(e,t)?.device_name??"Unknown device"}class $e{constructor(e=100,t=400){this._limit=e,this._coalesceMs=t,this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}get canUndo(){return this._past.length>0}get canRedo(){return this._future.length>0}record(e,t=Date.now()){t-this._lastRecordAt>this._coalesceMs&&(this._past.push(e),this._past.length>this._limit&&this._past.shift()),this._lastRecordAt=t,this._future=[]}undo(e){const t=this._past.pop();return void 0===t?null:(this._future.push(e),this._lastRecordAt=Number.NEGATIVE_INFINITY,t)}redo(e){const t=this._future.pop();return void 0===t?null:(this._past.push(e),this._lastRecordAt=Number.NEGATIVE_INFINITY,t)}discardIfLast(e){this._past[this._past.length-1]===e&&(this._past.pop(),this._lastRecordAt=Number.NEGATIVE_INFINITY)}clear(){this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}}const ke=new class{constructor(){this._client=null,this._enabled=!1,this._buffer=[],this._timer=null,this._errorHooked=!1}configure(e,t){this._client=e,this._enabled=t,t?this._hookErrors():this._buffer=[]}log(e,t={}){this._enabled&&(this._buffer.push({event:e,t:(new Date).toISOString(),...t}),this._buffer.length>200&&this._buffer.shift(),this._timer??(this._timer=window.setTimeout(()=>{this.flush()},2e3)))}async flush(){if(this._timer=null,!this._client||0===this._buffer.length)return;const e=this._buffer;this._buffer=[];try{await this._client.sendDebugLog(e)}catch{}}_hookErrors(){if(this._errorHooked)return;this._errorHooked=!0;const e=e=>!!e&&/spatial[-_]context/.test(e);window.addEventListener("error",t=>{const i=t.error?.stack;(e(i)||e(t.filename))&&this.log("js_error",{message:t.message,stack:i})}),window.addEventListener("unhandledrejection",t=>{const i=t.reason;e(i?.stack)&&this.log("js_rejection",{message:i?.message,stack:i?.stack})})}};function Ie(e,t,i){const o=e.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y||e.width<=0||e.height<=0)return null;const s=e.rotation_deg*Math.PI/180,n=Math.cos(s),r=Math.sin(s),l=t-e.x,a=i-e.y,d=-r*l+n*a;return{x:((n*l+r*a)/e.width+.5)*(o.max_x-o.min_x)+o.min_x,y:(d/e.height+.5)*(o.max_y-o.min_y)+o.min_y}}const Pe=[{id:"timber_frame",label:"Timber framed (drywall)",color:"#212121",attenuationDbPerCm:.3,defaultThicknessCm:10},{id:"brick_veneer",label:"Brick veneer",color:"#3e2723",attenuationDbPerCm:.55,defaultThicknessCm:11},{id:"concrete_block",label:"Concrete / block",color:"#000000",attenuationDbPerCm:.6,defaultThicknessCm:20},{id:"aerated_concrete_block",label:"Aerated/foam concrete block (plastered)",color:"#757575",attenuationDbPerCm:.37,defaultThicknessCm:13},{id:"ceramic_poroton_block",label:"Ceramic / Poroton block",color:"#8d6e63",attenuationDbPerCm:.42,defaultThicknessCm:25},{id:"glass",label:"Glass",color:"#37474f",attenuationDbPerCm:2,defaultThicknessCm:1},{id:"steel_frame",label:"Steel frame",color:"#263238",attenuationDbPerCm:1,defaultThicknessCm:10}];function Me(e){return Pe.find(t=>t.id===e)??Pe[0]}function Se(e){return e.thickness_cm??Me(e.material).defaultThicknessCm}class Ce{constructor(e){this.hass=e}async listFloors(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_floors"})).floors}async getLayout(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_layout",floor_id:e})}async saveLayout(e,t){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_layout",floor_id:e,background_image_id:t.background_image_id,background_opacity:t.background_opacity,background_offset_x:t.background_offset_x,background_offset_y:t.background_offset_y,background_scale:t.background_scale,building_id:t.building_id,view_box:t.view_box,rooms:t.rooms,pins:t.pins,walls:t.walls,openings:t.openings,scale:t.scale})}async setBuildingId(e,t){return this.hass.connection.sendMessagePromise({type:"spatial_context/set_building_id",floor_id:e,building_id:t})}async getPropertyLayout(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_property_layout"})}async savePropertyLayout(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_property_layout",background_image_id:e.background_image_id,background_opacity:e.background_opacity,background_offset_x:e.background_offset_x,background_offset_y:e.background_offset_y,background_scale:e.background_scale,view_box:e.view_box,placements:e.placements,pins:e.pins})}async getSettings(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_settings"})}async saveSettings(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_settings",unit_system:e.unit_system,zigbee_timeout_seconds:e.zigbee_timeout_seconds,floor_order:e.floor_order,zigbee_coordinator_device_id:e.zigbee_coordinator_device_id,auto_save:e.auto_save,debug_logging:e.debug_logging})}async getVersionInfo(){return this.hass.connection.sendMessagePromise({type:"spatial_context/version"})}async sendDebugLog(e){await this.hass.connection.sendMessagePromise({type:"spatial_context/debug_log",entries:e})}async getDebugReport(){return this.hass.connection.sendMessagePromise({type:"spatial_context/debug_report"})}async listAreas(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_areas"})).areas}async listPlaceableEntities(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_placeable_entities"})).entities}async exportSnapshot(){return this.hass.connection.sendMessagePromise({type:"spatial_context/export_snapshot"})}async getZigbeeMesh(e=!1){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",force_refresh:e})}async getCachedZigbeeMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",cache_only:!0})}async getWifiMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_wifi_mesh"})}async subscribeMatterTopology(e){return this.hass.connection.subscribeMessage(e,{type:"matter/subscribe_network_topology"})}async subscribeBluetoothAdvertisements(e){return this.hass.connection.subscribeMessage(e,{type:"bluetooth/subscribe_advertisements"})}async getBluetoothDevices(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_bluetooth_devices"})}async uploadBackgroundImage(e){const t=new FormData;t.append("file",e);const i=await this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:t});if(!i.ok)throw new Error(`Image upload failed: ${i.status} ${i.statusText}`);return(await i.json()).id}}function Ee(e){return e?`/api/image/serve/${e}/original`:null}function Le(e){return`${e}-${function(){if("undefined"!=typeof crypto&&crypto.randomUUID)return crypto.randomUUID();if("undefined"!=typeof crypto&&crypto.getRandomValues){const e=crypto.getRandomValues(new Uint8Array(16));e[6]=15&e[6]|64,e[8]=63&e[8]|128;const t=Array.from(e,e=>e.toString(16).padStart(2,"0")).join("");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})}()}`}function Te(e,t,i,o){return{id:Le("pin"),device_id:e,x:t,y:i,room_id:o,icon_override:null,label_override:null,height_m:null}}function Oe(e,t="timber_frame"){return{id:Le("wall"),material:t,thickness_cm:Me(t).defaultThicknessCm,points:e}}const Re=220;class Ae{constructor(e=[],t=(e,t)=>e<t?-1:e>t?1:0){if(this.data=e,this.length=this.data.length,this.compare=t,this.length>0)for(let e=(this.length>>1)-1;e>=0;e--)this._down(e)}push(e){this.data.push(e),this._up(this.length++)}pop(){if(0===this.length)return;const e=this.data[0],t=this.data.pop();return--this.length>0&&(this.data[0]=t,this._down(0)),e}peek(){return this.data[0]}_up(e){const{data:t,compare:i}=this,o=t[e];for(;e>0;){const s=e-1>>1,n=t[s];if(i(o,n)>=0)break;t[e]=n,e=s}t[e]=o}_down(e){const{data:t,compare:i}=this,o=this.length>>1,s=t[e];for(;e<o;){let o=1+(e<<1);const n=o+1;if(n<this.length&&i(t[n],t[o])<0&&(o=n),i(t[o],s)>=0)break;t[e]=t[o],e=o}t[e]=s}}function Be(e,t=1,i=!1){let o=1/0,s=1/0,n=-1/0,r=-1/0;for(const[t,i]of e[0])t<o&&(o=t),i<s&&(s=i),t>n&&(n=t),i>r&&(r=i);const l=n-o,a=r-s,d=Math.max(t,Math.min(l,a));if(d===t){const e=[o,s];return e.distance=0,e}let c=0;for(const t of e)c+=t.length;const h=new Float64Array(2*c),p=[];let u=0;for(const t of e){for(let e=0;e<t.length;e++)h[u++]=t[e][0],h[u++]=t[e][1];p.push(u)}const _=function(e,t){const i=64;let o=0,s=0;for(let e=0;e<t.length;e++)o+=Math.ceil((t[e]-s)/i),s=t[e];const n=new Float64Array(4*o);let r=0;s=0;for(let o=0;o<t.length;o++){const l=t[o];for(let t=s;t<l;t+=i,r+=4){const o=t+i<l?t+i:l,a=t===s?l-2:t-2;let d=e[a],c=e[a+1],h=d,p=c;for(let i=t;i<o;i+=2){const t=e[i],o=e[i+1];t<d?d=t:t>h&&(h=t),o<c?c=o:o>p&&(p=o)}n[r]=d,n[r+1]=c,n[r+2]=h,n[r+3]=p}s=l}return n}(h,p),g=new Ae([],(e,t)=>t.max-e.max);let m=function(e,t,i){let o=0,s=0,n=0;const r=t[0];for(let t=0,i=r-2;t<r;i=t,t+=2){const r=e[t],l=e[t+1],a=e[i],d=e[i+1],c=r*d-a*l;s+=(r+a)*c,n+=(l+d)*c,o+=3*c}const l=new Fe(s/o,n/o,0,e,t,i,-1/0,null);return 0===o||l.d<0?new Fe(e[0],e[1],0,e,t,i,-1/0,null):l}(h,p,_);const y=new Fe(o+l/2,s+a/2,0,h,p,_,-1/0,null);y.d>m.d&&(m=y);let v=2;function f(e,o,s,n){const r=m.d-Math.max(0,s*Math.SQRT2-t),l=new Fe(e,o,s,h,p,_,r,n);v++,l.max>m.d+t&&g.push(l),l.d>m.d&&(m=l,i&&console.log(`found best ${Math.round(1e4*l.d)/1e4} after ${v} probes`))}let b=d/2;for(let e=o;e<n;e+=d)for(let t=s;t<r;t+=d)f(e+b,t+b,b,null);for(;g.length;){const e=g.pop();if(e.max-m.d<=t)break;b=e.h/2,f(e.x-b,e.y-b,b,e),f(e.x+b,e.y-b,b,e),f(e.x-b,e.y+b,b,e),f(e.x+b,e.y+b,b,e)}i&&console.log(`num probes: ${v}\nbest distance: ${m.d}`);const x=[m.x,m.y];return x.distance=m.d,x}function Fe(e,t,i,o,s,n,r,l){this.x=e,this.y=t,this.h=i,this.nsx1=0,this.nsy1=0,this.nsx2=0,this.nsy2=0,this.d=function(e,t,i,o,s,n){const r=e.x,l=e.y;let a=!1,d=1/0;const c=s>0?s*s:-1;if(null!==n&&(e.nsx1=n.nsx1,e.nsy1=n.nsy1,e.nsx2=n.nsx2,e.nsy2=n.nsy2,d=De(r,l,n.nsx1,n.nsy1,n.nsx2,n.nsy2),d<=c))return s;const h=64,p=i.length;let u=0,_=0;for(let n=0;n<p;n++){const p=i[n];let g=t[p-2],m=t[p-1];for(let i=_;i<p;i+=h,u+=4){let n=i+h;n>p&&(n=p);const _=o[u],y=o[u+1],v=o[u+2],f=o[u+3],b=r<_?_-r:r>v?r-v:0,x=l<y?y-l:l>f?l-f:0,w=b*b+x*x>=d,$=l<y||l>=f||r>v;if(w&&$)g=t[n-2],m=t[n-1];else for(let o=i;o<n;o+=2){const i=t[o],n=t[o+1];if(!$&&n>l!=m>l&&r<(g-i)*(l-n)/(m-n)+i&&(a=!a),!w){const t=De(r,l,i,n,g,m);if(t<d&&(d=t,e.nsx1=i,e.nsy1=n,e.nsx2=g,e.nsy2=m,d<=c))return s}g=i,m=n}}_=p}return 0===d?0:(a?1:-1)*Math.sqrt(d)}(this,o,s,n,r,l),this.max=this.d+i*Math.SQRT2}function De(e,t,i,o,s,n){let r=s-i,l=n-o;if(0!==r||0!==l){const a=((e-i)*r+(t-o)*l)/(r*r+l*l);a>1?(i=s,o=n):a>0&&(i+=r*a,o+=l*a)}return r=e-i,l=t-o,r*r+l*l}function ze(e,t,i,o){return Math.hypot(i-e,o-t)}function He(e,t,i){return Math.min(i,Math.max(t,e))}function Ue(e,t,i){let o=!1;for(let s=0,n=i.length-1;s<i.length;n=s++){const r=i[s],l=i[n],[a,d]=r,[c,h]=l;d>t!=h>t&&e<(c-a)*(t-d)/(h-d)+a&&(o=!o)}return o}function We(e,t,i){for(const o of i)if(o.points.length>=3&&Ue(e,t,o.points))return o.id;return null}function Ne(e,t){let i=!1;const o=t.map(t=>{const o=We(t.x,t.y,e);return o===t.room_id?t:(i=!0,{...t,room_id:o})});return i?o:t}const Ve=new WeakMap;function Ye(e,t,i,o,s,n){const r=s-i,l=n-o,a=r*r+l*l;if(0===a)return ze(e,t,i,o);let d=((e-i)*r+(t-o)*l)/a;return d=He(d,0,1),ze(e,t,i+d*r,o+d*l)}function Xe(e,t,i){let o=1/0;for(let s=0;s<i.length-1;s++){const[n,r]=i[s],[l,a]=i[s+1];o=Math.min(o,Ye(e,t,n,r,l,a))}return o}function je(e){const t=[];for(let i=0;i<e.length;i++){const o=e[i],s=e[(i+1)%e.length];t.push([(o[0]+s[0])/2,(o[1]+s[1])/2])}return t}function Ke(e){const t=[];for(let i=0;i<e.length-1;i++){const o=e[i],s=e[i+1];t.push([(o[0]+s[0])/2,(o[1]+s[1])/2])}return t}function qe(e,t,i){let o={point:e[0],segmentIndex:0,dist:1/0};for(let s=0;s<e.length-1;s++){const[n,r]=e[s],[l,a]=e[s+1],d=l-n,c=a-r,h=d*d+c*c;let p=0===h?0:((t-n)*d+(i-r)*c)/h;p=He(p,0,1);const u=[n+p*d,r+p*c],_=ze(t,i,u[0],u[1]);_<o.dist&&(o={point:u,segmentIndex:s,dist:_})}return{point:o.point,segmentIndex:o.segmentIndex}}function Ge(e,t,i){return 0===e.length?{point:[t,i],segmentIndex:0}:qe([...e,e[0]],t,i)}function Ze(e,t,i){const[o,s]=e,[n,r]=t,l=Math.abs(n-o),a=Math.abs(r-s);return l>i&&a>i?t:l<=a?[o,r]:[n,s]}function Je(e,t,i,o){if(o.length<2)return null;const{segmentIndex:s}=qe(o,e,t),[n,r]=function(e,t){const[i,o]=e[t],[s,n]=e[t+1]??e[t],r=ze(i,o,s,n)||1;return[(s-i)/r,(n-o)/r]}(o,s),l=i/2;return[[e-n*l,t-r*l],[e+n*l,t+r*l]]}function Qe(e){const t=e.getRootNode();let i=document.activeElement;for(;i?.shadowRoot?.activeElement;)i=i.shadowRoot.activeElement;if(!(i instanceof HTMLElement))return;let o=i.getRootNode();for(;o&&o!==t;)o=o instanceof ShadowRoot?o.host.getRootNode():null;o===t&&i.blur()}const et=.3048;function tt(e){return Math.round(100*e)/100}function it(e){return"imperial"===e?"ft":"m"}function ot(e,t){return String(tt("imperial"===t?e/et:e))}function st(e,t){const i=Number(e);return Number.isFinite(i)?"imperial"===t?i*et:i:null}const nt={cm:1,m:100,in:2.54,ft:30.48};function rt(e){return"imperial"===e?"in":"cm"}function lt(e,t){return String(tt(e/nt[t]))}function at(e,t){const i=Number(e);return Number.isFinite(i)?i*nt[t]:null}function dt(e,t){return"imperial"===t?e*et:e}const ct=r`
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
`;function ht(e,t,i,o){return e.map(e=>({pin:e,d:ze(e.x,e.y,t,i)})).filter(({d:e})=>e<=o).sort((e,t)=>e.d-t.d).map(({pin:e})=>e)}function pt(e,t,i,o){let s=null,n=o;return e.forEach(([e,o],r)=>{const l=ze(e,o,t,i);l<=n&&(s=r,n=l)}),s}function ut(e,t,i,o){let s=null,n=o;for(const o of e){const e=Xe(t,i,o.points);e<=n&&(s=o,n=e)}return s}function _t(e,t,i,o){if(e.points.length>=3){const[s,n]=e.points[0];if(ze(s,n,t,i)<=o)return{trace:e,closed:!0}}return{trace:{points:[...e.points,[t,i]]},closed:!1}}const gt=new Map;function mt(e){const t=e.trim();if(!t)return Promise.resolve(null);const i=t.includes(":")?t:`mdi:${t}`;let o=gt.get(i);return o||(o=async function(e){if(!customElements.get("ha-icon"))return null;const t=document.createElement("div");t.style.cssText="position:fixed;left:-10000px;top:0;width:24px;height:24px;overflow:hidden;";const i=document.createElement("ha-icon");i.setAttribute("icon",e),t.appendChild(i),document.body.appendChild(t);try{const e=Date.now()+4e3;for(;Date.now()<e;){const e=i.shadowRoot?.querySelector("ha-svg-icon");if("string"==typeof e?.path&&e.path)return e.path;await new Promise(e=>setTimeout(e,50))}return null}finally{t.remove()}}(i),gt.set(i,o)),o}const yt=r`
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
`;class vt{constructor(e){this._host=e,this._resolvedOverrides=new Map,this._failedBrandIcons=new Set}_iconForOverride(e){return this._resolvedOverrides.has(e)?this._resolvedOverrides.get(e)??null:(this._resolvedOverrides.set(e,null),mt(e).then(t=>{null!==t&&(this._resolvedOverrides.set(e,t),this._host.requestUpdate())}),null)}iconForPin(e,t){if(e.icon_override){const t=this._iconForOverride(e.icon_override);if(t)return{kind:"path",d:t}}const i=function(e,t){return xe(e,t)?.integration_domain??null}(e.device_id,t);return i&&!this._failedBrandIcons.has(i)?{kind:"image",href:`https://brands.home-assistant.io/_/${i}/icon.png`,integrationDomain:i}:{kind:"path",d:"M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z"}}onBrandIconError(e){this._failedBrandIcons.has(e)||(this._failedBrandIcons.add(e),this._host.requestUpdate())}renderMarker(e,t,i,o,s,n,r){const l=1.1*i;return Y`
      <g>
        <title>${r}</title>
        <circle
          class="pin-dot ${n?"selected":""}"
          cx=${e}
          cy=${t}
          r=${i}
          style="fill:${n?"":s}"
        ></circle>
        ${"path"===o.kind?Y`
              <svg
                x=${e-l/2}
                y=${t-l/2}
                width=${l}
                height=${l}
                viewBox="0 0 24 24"
                class="pin-icon"
              >
                <path d=${o.d}></path>
              </svg>
            `:Y`
              <image
                x=${e-l/2}
                y=${t-l/2}
                width=${l}
                height=${l}
                href=${o.href}
                class="pin-brand-icon"
                @error=${()=>this.onBrandIconError(o.integrationDomain)}
              ></image>
            `}
        <circle class="pin-hit" cx=${e} cy=${t} r=${1.4*i}></circle>
      </g>
    `}}const ft=1e3,bt=750,xt=14,wt="#03a9f4";let $t=class extends de{constructor(){super(...arguments),this.rooms=[],this.pins=[],this.walls=[],this.openings=[],this.scale=null,this.unitSystem="metric",this.meshLinks=[],this.meshStubs=[],this.entityLookup=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.5,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.alignOverlay=null,this.initialViewBox=null,this.sameBuildingAsPrevious=!1,this.mode="select",this.snapMode="all",this.armedEntityId=null,this.armedOpeningType=null,this.selectedRoomId=null,this.editingRoomId=null,this.editingWallId=null,this.selectedPinId=null,this.selectedWallId=null,this.selectedOpeningId=null,this.selectedMeshLinkKey=null,this.selectedMeshStubKey=null,this._viewBox={x:0,y:0,w:ft,h:bt},this._naturalHeight=bt,this._alignNaturalHeight=bt,this._pendingTrace=null,this._hoverSnap=null,this._pendingScalePoints=[],this._liveEditPoints=null,this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._gestureCancelled=!1,this._vertexDragStartPoints=null,this._liveDragPin=null,this._liveOpeningEdit=null,this._selectedVertexIndex=null,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastImage=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._hasFittedOnce=!1,this._onPointerDown=e=>{if("mouse"===e.pointerType&&0!==e.button)return;if(Qe(this),this._svg.setPointerCapture(e.pointerId),this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o={x:(t.x+i.x)/2,y:(t.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:ze(t.x,t.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}if(this._pointers.size>2)return;const t=this._clientToImage(e.clientX,e.clientY);this._downClient={x:e.clientX,y:e.clientY},this._lastImage=t,this._lastClient={x:e.clientX,y:e.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(e.clientX,e.clientY,t):{type:"empty"}},this._onPointerMove=e=>{if(!this._pointers.has(e.pointerId)){if("wall"===this.mode||"trace"===this.mode){const t=this._clientToImage(e.clientX,e.clientY);this._hoverSnap=this._snappedGeometryPoint(this._pendingTrace?.points??[],t.x,t.y,e.shiftKey)}else this._hoverSnap&&(this._hoverSnap=null);return}if(this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o=ze(t.x,t.y,i.x,i.y)||1,s=this._gesture.startDistance/o,n=this._gesture.startViewBox,r=He(n.w*s,250,4e3),l=r/n.w,a=n.h*l,{x:d,y:c}=this._gesture.midImage;return void(this._viewBox={x:d-(d-n.x)*l,y:c-(c-n.y)*l,w:r,h:a})}if(1!==this._pointers.size||!this._downClient||!this._lastImage)return;if(this._gestureCancelled)return;if(!this._moved){if(ze(this._downClient.x,this._downClient.y,e.clientX,e.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"!==this._gesture?.kind&&"alignDrag"!==this._gesture?.kind||(this._svg.style.cursor="grabbing")}const t=this._clientToImage(e.clientX,e.clientY);if("pan"===this._gesture?.kind){const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};this._viewBox={...this._viewBox,x:this._viewBox.x-(e.clientX-i.x)/t,y:this._viewBox.y-(e.clientY-i.y)/t}}else if("alignDrag"===this._gesture?.kind){const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};this.dispatchEvent(new CustomEvent("align-drag",{detail:{dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t}}))}else if("vertex"===this._gesture?.kind&&this._liveEditPoints){const i="room"===this._editingTarget?.kind,[o,s]=this._snappedVertexPoint(this._liveEditPoints,this._gesture.index,t.x,t.y,i,e.shiftKey),n=[...this._liveEditPoints];n[this._gesture.index]=[o,s],this._liveEditPoints=n}else if("pin"===this._gesture?.kind)this._liveDragPin={id:this._gesture.pinId,x:t.x,y:t.y};else if("roomMove"===this._gesture?.kind){let i=t.x-this._gesture.startX,o=t.y-this._gesture.startY;const s=this._pxToUnits(10);let n={x:null,y:null};if(Math.hypot(i,o)<=s)i=0,o=0;else if(!e.shiftKey){const e=this._snapRoomMove(this._gesture.roomId,i,o,s);i=e.dx,o=e.dy,n=e.guides}this._liveRoomMove={id:this._gesture.roomId,dx:i,dy:o},this._roomMoveGuides=n}else if("roomLabel"===this._gesture?.kind)this._liveRoomLabel={id:this._gesture.roomId,x:t.x,y:t.y};else if("openingMove"===this._gesture?.kind){const e=this._gesture,i=this.openings.find(t=>t.id===e.openingId),o=i&&this.walls.find(e=>e.id===i.wallId);if(i&&o){const e=this._effectivePoints("wall",o.id,o.points),{point:s}=qe(e,t.x,t.y);this._liveOpeningEdit={id:i.id,x:s[0],y:s[1],width:i.width}}}else if("openingHandle"===this._gesture?.kind){const e=this._gesture,i=this.openings.find(t=>t.id===e.openingId),o=i&&this.walls.find(e=>e.id===i.wallId),s=i&&this._openingEndpoints(i);if(i&&o&&s){const n=this._effectivePoints("wall",o.id,o.points),{point:r}=qe(n,t.x,t.y),l=s[0===e.whichEnd?1:0],a=[(l[0]+r[0])/2,(l[1]+r[1])/2],d=ze(l[0],l[1],r[0],r[1]);this._liveOpeningEdit={id:i.id,x:a[0],y:a[1],width:d}}}this._lastImage=this._clientToImage(e.clientX,e.clientY),this._lastClient={x:e.clientX,y:e.clientY}},this._onPointerLeave=()=>{this._hoverSnap=null},this._onPointerUp=e=>{this._pointers.delete(e.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(e.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._gestureCancelled||(this._moved?this._commitGesture():this._downClient&&this._handleClick(this._downClient.x,this._downClient.y,e.shiftKey)),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1,this._vertexDragStartPoints=null)},this._onWheel=e=>{if(e.preventDefault(),e.ctrlKey){const t=e.deltaY<0?.9:1.1;return void this._zoomBy(t,this._clientToImage(e.clientX,e.clientY))}const t=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+e.deltaX*t,y:this._viewBox.y+e.deltaY*t}},this._liveRoomLabel=null,this._pinIcons=new vt(this)}get _editingTarget(){return this.editingRoomId?{kind:"room",id:this.editingRoomId}:this.editingWallId?{kind:"wall",id:this.editingWallId}:null}_rawPointsFor(e){return"room"===e.kind?this.rooms.find(t=>t.id===e.id)?.points??null:this.walls.find(t=>t.id===e.id)?.points??null}willUpdate(e){if(e.has("editingRoomId")||e.has("editingWallId")){const e=this._editingTarget,t=e?this._rawPointsFor(e):null;this._liveEditPoints=t?[...t]:null,this._selectedVertexIndex=null}e.has("mode")&&(this._pendingTrace=null,this._pendingScalePoints=[])}firstUpdated(){this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl,this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(e){if(e.has("backgroundImageUrl")&&this.backgroundImageUrl){const e=new Image;e.onload=()=>{this._naturalHeight=e.naturalHeight/e.naturalWidth*ft||bt,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},e.src=this.backgroundImageUrl}if(e.has("initialViewBox")){const e=this.initialViewBox,t=this._viewBox;e&&e.x===t.x&&e.y===t.y&&e.w===t.w&&e.h===t.h?this._hasFittedOnce=!0:e?(this._viewBox={...e},this._hasFittedOnce=!0):this.sameBuildingAsPrevious||(this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl)}if(e.has("alignOverlay")){const t=e.get("alignOverlay");if(this.alignOverlay&&this.alignOverlay.imageUrl!==t?.imageUrl){const e=new Image;e.onload=()=>{this._alignNaturalHeight=e.naturalHeight/e.naturalWidth*ft||bt},e.src=this.alignOverlay.imageUrl}}if(e.has("_pendingTrace")||e.has("_pendingScalePoints")){const e="scale"===this.mode?this._pendingScalePoints.length:this._pendingTrace?.points.length??0;this.dispatchEvent(new CustomEvent("pending-changed",{detail:{count:e}}))}}_contentBounds(){const e=[];for(const t of this.rooms)e.push(...t.points);for(const t of this.walls)e.push(...t.points);for(const t of this.pins)e.push([t.x,t.y]);if(0===e.length)return null;const t=e.map(([e])=>e),i=e.map(([,e])=>e),o=Math.min(...t),s=Math.max(...t),n=Math.min(...i),r=Math.max(...i),l=.08*Math.max(s-o,r-n)||40;return{x:o-l,y:n-l,w:s-o+2*l,h:r-n+2*l}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:ft,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const e=this._svg?.getBoundingClientRect(),t=e?.width||this._viewBox.w,i=e?.height||this._viewBox.h,o=Math.min(t/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(t-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(e){return e/this._svgTransform().scale}_clientToImage(e,t){const i=this._svg,o=i.createSVGPoint();o.x=e,o.y=t;const s=i.getScreenCTM();if(!s)return{x:0,y:0};const n=o.matrixTransform(s.inverse());return{x:n.x,y:n.y}}_effectivePoints(e,t,i){const o=this._editingTarget;if(o&&o.kind===e&&o.id===t&&this._liveEditPoints)return this._liveEditPoints;const s=this._liveRoomMove;return"room"===e&&s?.id===t?i.map(([e,t])=>[e+s.dx,t+s.dy]):i}get _displayPins(){const e=this._liveRoomMove;return e?this.pins.map(t=>t.room_id===e.id?{...t,x:t.x+e.dx,y:t.y+e.dy}:t):this.pins}_snappedTracePoint(e,t,i,o){if(o||0===e.length)return{point:[t,i],lockedX:!1,lockedY:!1};const s=this._pxToUnits(10),n=e[e.length-1],r=e[0],l=e.length>=3&&(r[0]!==n[0]||r[1]!==n[1])?[n,r]:[n];let a=null,d=1/0,c=null,h=1/0;for(const[e,o]of l){const n=Math.abs(t-e),r=Math.abs(i-o);n>s&&r>s||(n<=r?n<d&&(a=e,d=n):r<h&&(c=o,h=r))}return{point:[a??t,c??i],lockedX:null!==a,lockedY:null!==c}}_snappedVertexPoint(e,t,i,o,s,n){if(n||"off"===this.snapMode)return[i,o];const r=this._pxToUnits(10),l=t>0?t-1:s?e.length-1:-1;if(l>=0&&l!==t)return Ze(e[l],[i,o],r);const a=t<e.length-1?t+1:s?0:-1;return a>=0&&a!==t?Ze(e[a],[i,o],r):[i,o]}_effectiveOpening(e){return this._liveOpeningEdit?.id===e.id?{...e,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}:e}_openingEndpoints(e){const t=this.walls.find(t=>t.id===e.wallId);if(!t)return null;const i=this._effectivePoints("wall",t.id,t.points),o=this._effectiveOpening(e);return Je(o.x,o.y,o.width,i)}_snappedGeometryPoint(e,t,i,o){const s=o||"off"===this.snapMode;if(!s){const e=this._pxToUnits(xt),o="all"===this.snapMode||"wall"===this.mode,s="all"===this.snapMode||"trace"===this.mode;let n=null;for(const s of o?this.walls:[]){const o=parseFloat(this._wallStrokeWidth(s,Me(s.material)))/2,r=Math.max(e,o);if(Xe(t,i,s.points)>r)continue;const l=qe(s.points,t,i).point,a=ze(t,i,l[0],l[1]);(!n||a<n.dist)&&(n={point:l,dist:a})}const r=s?function(e,t,i,o){let s=null,n=o;for(const o of e){if(o.points.length<2)continue;const{point:e}=Ge(o.points,t,i),r=ze(t,i,e[0],e[1]);r<=n&&(s=o,n=r)}return s}(this.rooms,t,i,e):null;if(r){const e=Ge(r.points,t,i).point,o=ze(t,i,e[0],e[1]);(!n||o<n.dist)&&(n={point:e,dist:o})}if(n)return{point:n.point,kind:"geometry",lockedX:!1,lockedY:!1}}const{point:n,lockedX:r,lockedY:l}=this._snappedTracePoint(e,t,i,s);return{point:n,kind:r||l?"axis":"none",lockedX:r,lockedY:l}}_hitTest(e,t,i){const o=this._pxToUnits(xt);if("select"!==this.mode)return{type:"empty"};const s=this._editingTarget;if(s&&this._liveEditPoints){const e=this._liveEditPoints,t=pt(e,i.x,i.y,o);if(null!==t)return{type:"vertex",index:t};const n=pt("room"===s.kind?je(e):Ke(e),i.x,i.y,o);if(null!==n)return{type:"edgeMidpoint",index:n};const r="room"===s.kind?this.rooms.find(e=>e.id===s.id):void 0;return r&&this._roomLabelHit(r,i,o)?{type:"roomLabel",room:r}:{type:"empty"}}const n=this.rooms.find(e=>e.id===this.selectedRoomId);if(n&&this._roomLabelHit(n,i,o))return{type:"roomLabel",room:n};const r=ht(this.pins,i.x,i.y,o);if(r.length>1)return{type:"pinStack",pins:r};if(1===r.length)return{type:"pin",pin:r[0]};const l=function(e,t,i,o){let s=null,n=o;for(const o of e){const e=Xe(t,i,[[o.fromPin.x,o.fromPin.y],[o.toPin.x,o.toPin.y]]);e<=n&&(s=o,n=e)}return s}(this.meshLinks,i.x,i.y,o);if(l)return{type:"meshLink",link:l};const a=function(e,t,i,o){let s=null,n=o;for(const o of e){const e=Math.min(ze(o.x,o.y,t,i),Xe(t,i,[[o.fromPin.x,o.fromPin.y],[o.x,o.y]]));e<=n&&(s=o,n=e)}return s}(this.meshStubs,i.x,i.y,o);if(a)return{type:"meshStub",stub:a};if(this.selectedOpeningId){const e=this.openings.find(e=>e.id===this.selectedOpeningId),t=e?this._openingEndpoints(e):null;if(e&&t){const s=pt(t,i.x,i.y,o);if(null!==s)return{type:"openingHandle",opening:e,whichEnd:s}}}const d=function(e,t,i,o,s){let n=null,r=s;for(const s of e){const e=t.find(e=>e.id===s.wallId);if(!e)continue;const l=Je(s.x,s.y,s.width,e.points);if(!l)continue;const a=Xe(i,o,l);a<=r&&(n=s,r=a)}return n}(this.openings,this.walls,i.x,i.y,o);if(d)return{type:"opening",opening:d};const c=ut(this.walls,i.x,i.y,o);if(c)return{type:"wall",wall:c};const h=this.rooms.find(e=>e.points.length>=3&&Ue(i.x,i.y,e.points));return h?{type:"room",room:h}:{type:"empty"}}_lockGesture(){return"align"===this.mode?{kind:"alignDrag"}:"vertex"===this._downHit?.type?(this._vertexDragStartPoints=this._liveEditPoints?[...this._liveEditPoints]:null,{kind:"vertex",index:this._downHit.index}):"pin"===this._downHit?.type?{kind:"pin",pinId:this._downHit.pin.id}:"roomLabel"===this._downHit?.type?{kind:"roomLabel",roomId:this._downHit.room.id}:"room"===this._downHit?.type&&this._downHit.room.id===this.selectedRoomId&&this._lastImage?{kind:"roomMove",roomId:this._downHit.room.id,startX:this._lastImage.x,startY:this._lastImage.y}:"openingHandle"===this._downHit?.type?{kind:"openingHandle",openingId:this._downHit.opening.id,whichEnd:this._downHit.whichEnd}:"opening"===this._downHit?.type?{kind:"openingMove",openingId:this._downHit.opening.id}:{kind:"pan"}}_dispatchVertexChanged(e){const t=this._editingTarget;if(!t)return;const i="room"===t.kind?"room-vertex-changed":"wall-vertex-changed",o="room"===t.kind?"roomId":"wallId";this.dispatchEvent(new CustomEvent(i,{detail:{[o]:t.id,points:e}}))}_commitGesture(){if("vertex"===this._gesture?.kind&&this._editingTarget&&this._liveEditPoints)this._dispatchVertexChanged(this._liveEditPoints);else if("pin"===this._gesture?.kind&&this._liveDragPin)this.dispatchEvent(new CustomEvent("pin-move",{detail:{pinId:this._liveDragPin.id,x:this._liveDragPin.x,y:this._liveDragPin.y}})),this._liveDragPin=null;else if("roomMove"===this._gesture?.kind&&this._liveRoomMove){const{dx:e,dy:t}=this._liveRoomMove;if(this._roomMoveGuides={x:null,y:null},0===e&&0===t)return void(this._liveRoomMove=null);this.dispatchEvent(new CustomEvent("room-move",{detail:{roomId:this._liveRoomMove.id,dx:this._liveRoomMove.dx,dy:this._liveRoomMove.dy}})),this._liveRoomMove=null}else"roomLabel"===this._gesture?.kind&&this._liveRoomLabel?(this.dispatchEvent(new CustomEvent("room-label-moved",{detail:{roomId:this._liveRoomLabel.id,x:this._liveRoomLabel.x,y:this._liveRoomLabel.y}})),this._liveRoomLabel=null):"openingMove"!==this._gesture?.kind&&"openingHandle"!==this._gesture?.kind||!this._liveOpeningEdit||(this.dispatchEvent(new CustomEvent("opening-update",{detail:{openingId:this._liveOpeningEdit.id,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}})),this._liveOpeningEdit=null)}_handleClick(e,t,i=!1){const o=this._clientToImage(e,t);if("trace"===this.mode){const e=this._pxToUnits(xt),t=this._pendingTrace??{points:[]},{point:[s,n]}=this._snappedGeometryPoint(t.points,o.x,o.y,i),r=_t(t,s,n,e);return void(r.closed?(this.dispatchEvent(new CustomEvent("room-trace-complete",{detail:{points:t.points}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("wall"===this.mode){const e=this._pxToUnits(xt),t=this._pendingTrace??{points:[]},{point:[s,n]}=this._snappedGeometryPoint(t.points,o.x,o.y,i),r=_t(t,s,n,e);return void(r.closed?(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:[...t.points,t.points[0]]}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("opening"===this.mode){if(!this.armedOpeningType)return;const e=this._pxToUnits(xt),t=ut(this.walls,o.x,o.y,e);if(!t)return;const{point:i}=qe(t.points,o.x,o.y);return void this.dispatchEvent(new CustomEvent("opening-place",{detail:{wallId:t.id,x:i[0],y:i[1]}}))}if("scale"===this.mode){const e=[...this._pendingScalePoints,[o.x,o.y]];return void(e.length>=2?(this.dispatchEvent(new CustomEvent("scale-line-complete",{detail:{points:e.slice(0,2)}})),this._pendingScalePoints=[]):this._pendingScalePoints=e)}if("place"===this.mode){if(this.armedEntityId){const e=this._pxToUnits(xt),t=ht(this.pins,o.x,o.y,e)[0],i=t?.x??o.x,s=t?.y??o.y;this.dispatchEvent(new CustomEvent("pin-place",{detail:{x:i,y:s}}))}return}const s=this._downHit??{type:"empty"};if("vertex"===s.type)this._selectedVertexIndex=this._selectedVertexIndex===s.index?null:s.index;else if("edgeMidpoint"===s.type&&this._editingTarget&&this._liveEditPoints){const e=("room"===this._editingTarget.kind?je(this._liveEditPoints):Ke(this._liveEditPoints))[s.index],t=[...this._liveEditPoints];t.splice(s.index+1,0,e),this._liveEditPoints=t,this._dispatchVertexChanged(t)}else if("pin"===s.type)this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:this.selectedPinId===s.pin.id?null:s.pin.id}}));else if("pinStack"===s.type)this.dispatchEvent(new CustomEvent("pin-stack-select",{detail:{pinIds:s.pins.map(e=>e.id)}}));else if("roomLabel"===s.type&&this._editingTarget);else if("room"===s.type||"roomLabel"===s.type)this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:this.selectedRoomId===s.room.id?null:s.room.id}}));else if("wall"===s.type)this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:this.selectedWallId===s.wall.id?null:s.wall.id}}));else if("opening"===s.type)this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:this.selectedOpeningId===s.opening.id?null:s.opening.id}}));else if("meshLink"===s.type){const e=`${s.link.fromPin.id}|${s.link.toPin.id}`;this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:this.selectedMeshLinkKey===e?null:s.link}}))}else if("meshStub"===s.type){const e=`${s.stub.fromPin.id}|${s.stub.targetDeviceId}`;this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:this.selectedMeshStubKey===e?null:s.stub}}))}else if(this._editingTarget&&null!==this._selectedVertexIndex&&this._liveEditPoints){const e="room"===this._editingTarget.kind,[t,s]=this._snappedVertexPoint(this._liveEditPoints,this._selectedVertexIndex,o.x,o.y,e,i),n=[...this._liveEditPoints];n[this._selectedVertexIndex]=[t,s],this._liveEditPoints=n,this._selectedVertexIndex=null,this._dispatchVertexChanged(n)}else this._selectedVertexIndex=null,this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:null}})),this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:null}})),this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:null}})),this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:null}})),this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:null}})),this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:null}}))}finishPendingWall(){"wall"!==this.mode||!this._pendingTrace||this._pendingTrace.points.length<2||(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:this._pendingTrace.points}})),this._pendingTrace=null)}cancelGesture(){const e=this._gesture?.kind;return!(!this._moved||!e||"pan"===e||"pinch"===e||"alignDrag"===e)&&("vertex"===e&&this._vertexDragStartPoints&&(this._liveEditPoints=this._vertexDragStartPoints),this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._liveDragPin=null,this._liveRoomLabel=null,this._liveOpeningEdit=null,this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_snapRoomMove(e,t,i,o){const s=this.rooms.find(t=>t.id===e);if(!s)return{dx:t,dy:i,guides:{x:null,y:null}};const n=[...this.rooms.filter(t=>t.id!==e).flatMap(e=>e.points),...this.walls.flatMap(e=>e.points)];let r=null,l=null;for(const[e,a]of s.points){const s=e+t,d=a+i;for(const[e,t]of n){const i=e-s;Math.abs(i)<=o&&(!r||Math.abs(i)<Math.abs(r.delta))&&(r={delta:i,at:e});const n=t-d;Math.abs(n)<=o&&(!l||Math.abs(n)<Math.abs(l.delta))&&(l={delta:n,at:t})}}return{dx:t+(r?.delta??0),dy:i+(l?.delta??0),guides:{x:r?.at??null,y:l?.at??null}}}undoLastPoint(){if("scale"===this.mode&&this._pendingScalePoints.length>0)return this._pendingScalePoints=this._pendingScalePoints.slice(0,-1),!0;const e=this._pendingTrace?.points;return!(!e||0===e.length)&&(this._pendingTrace=e.length>1?{points:e.slice(0,-1)}:null,!0)}cancelPending(){this._pendingTrace=null,this._pendingScalePoints=[]}_deleteSelectedVertex(){const e=this._editingTarget;if(null===this._selectedVertexIndex||!e||!this._liveEditPoints)return;const t="room"===e.kind?3:2;if(this._liveEditPoints.length<=t)return;const i=this._liveEditPoints.filter((e,t)=>t!==this._selectedVertexIndex);this._liveEditPoints=i,this._selectedVertexIndex=null,this._dispatchVertexChanged(i)}_zoomBy(e,t){const i=He(this._viewBox.w*e,250,4e3),o=i/this._viewBox.w,s=this._viewBox.h*o;this._viewBox={x:t.x-(t.x-this._viewBox.x)*o,y:t.y-(t.y-this._viewBox.y)*o,w:i,h:s}}_zoomButton(e){const t=this._viewBox;this._zoomBy(e,{x:t.x+t.w/2,y:t.y+t.h/2})}_pinLabel(e){return e.label_override?e.label_override:we(e.device_id,this.entityLookup.values())}_roomLabelPosition(e,t){if(this._liveRoomLabel?.id===e.id)return[this._liveRoomLabel.x,this._liveRoomLabel.y];const i=this._liveRoomMove?.id===e.id?this._liveRoomMove:null,[o,s]=e.label_position??function(e){const t=Ve.get(e);if(t)return t;const i=e.length>=3?(()=>{const[t,i]=Be([e],1);return[t,i]})():function(e){if(0===e.length)return[0,0];let t=0,i=0;for(const[o,s]of e)t+=o,i+=s;return[t/e.length,i/e.length]}(e);return Ve.set(e,i),i}(i?e.points:t);return i?[o+i.dx,s+i.dy]:[o,s]}_roomLabelHit(e,t,i){if(!1===e.visible)return!1;const o=this._effectivePoints("room",e.id,e.points);if(o.length<2)return!1;const[s,n]=this._roomLabelPosition(e,o),r=9*e.name.length/2;return t.x>=s-r-i&&t.x<=s+r+i&&t.y>=n-13-i&&t.y<=n+4+i}_renderRoom(e){if(!1===e.visible)return j;const t=this._effectivePoints("room",e.id,e.points);if(t.length<2)return j;const i=t.map(([e,t])=>`${e},${t}`).join(" "),[o,s]=this._roomLabelPosition(e,t),n=this.editingRoomId===e.id,r=e.id===this.selectedRoomId||n,l=e.fill_color??wt,a=e.fill_opacity??.18,d=e.border_opacity??1,c=this._liveRoomMove?.id===e.id?this._liveRoomMove:null,h=!c||0===c.dx&&0===c.dy?j:Y`<polygon
            class="room-ghost"
            points=${e.points.map(([e,t])=>`${e},${t}`).join(" ")}
          ></polygon>`;return Y`
      ${h}
      <polygon
        class="room-poly ${r?"selected":""}"
        points=${i}
        fill=${l}
        fill-opacity=${r?Math.min(1,a*(.32/.18)):a}
        stroke=${l}
        stroke-opacity=${d}
        stroke-width=${r?3:2}
      ></polygon>
      <text class="room-label" x=${o} y=${s}>${e.name}</text>
      ${n?this._renderVertexHandles(t,!0):j}
    `}_renderVertexHandles(e,t){const i=this._pxToUnits(6),o=this._pxToUnits(4),s=t?je(e):Ke(e);return Y`
      ${s.map(([e,t])=>Y`<circle class="midpoint-handle" cx=${e} cy=${t} r=${o}></circle>`)}
      ${e.map(([e,t],o)=>{const s=o===this._selectedVertexIndex;return Y`
          <circle
            class="vertex-handle ${s?"selected":""}"
            cx=${e}
            cy=${t}
            r=${i}
          ></circle>
          ${s?Y`
                <g
                  class="vertex-delete"
                  transform="translate(${e+2.2*i}, ${t-2.2*i})"
                  @pointerdown=${e=>{e.stopPropagation()}}
                  @click=${e=>{e.stopPropagation(),this._deleteSelectedVertex()}}
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
              `:j}
        `})}
    `}_livePinPosition(e){if(this._liveDragPin?.id===e.id)return this._liveDragPin;const t=this._liveRoomMove;return t&&e.room_id===t.id?{x:e.x+t.dx,y:e.y+t.dy}:e}_renderMeshLink(e){const t=`${e.fromPin.id}|${e.toPin.id}`,i=this._livePinPosition(e.fromPin),o=this._livePinPosition(e.toPin);return Y`
      <line
        class="mesh-link ${t===this.selectedMeshLinkKey?"selected":""}"
        x1=${i.x}
        y1=${i.y}
        x2=${o.x}
        y2=${o.y}
        style="stroke:${ve(e.quality)}"
      >
        <title>${e.detail??e.quality}</title>
      </line>
    `}_renderRoomMoveGuides(){if(!this._liveRoomMove)return j;const{x:e,y:t}=this._roomMoveGuides,i=this._viewBox;return Y`
      ${null!==e?Y`<line class="axis-guide" x1=${e} y1=${i.y} x2=${e} y2=${i.y+i.h}></line>`:j}
      ${null!==t?Y`<line class="axis-guide" x1=${i.x} y1=${t} x2=${i.x+i.w} y2=${t}></line>`:j}
    `}_renderMeshStubLine(e){const t=`${e.fromPin.id}|${e.targetDeviceId}`,i=this._livePinPosition(e.fromPin);return Y`
      <line
        class="mesh-stub-line ${t===this.selectedMeshStubKey?"selected":""}"
        x1=${i.x}
        y1=${i.y}
        x2=${e.x}
        y2=${e.y}
        style="stroke:${ve(e.quality)}"
      >
        <title>${e.targetLabel} (${e.targetFloorName})</title>
      </line>
    `}_renderMeshStubMarkers(){const e=this._pxToUnits(10),t=this._pxToUnits(12),i=new Map;for(const e of this.meshStubs){const t=`${e.targetDeviceId}|${e.x},${e.y}`,o=`${e.fromPin.id}|${e.targetDeviceId}`===this.selectedMeshStubKey,s=i.get(t);s?o&&(s.selected=!0):i.set(t,{stub:e,selected:o})}const o=(e,t)=>e.minX<t.maxX&&t.minX<e.maxX&&e.minY<t.maxY&&t.minY<e.maxY,s=[];for(const e of this.rooms){if(!1===e.visible)continue;const t=this._effectivePoints("room",e.id,e.points);if(t.length<2)continue;const[i,o]=this._roomLabelPosition(e,t),n=9*e.name.length/2;s.push({minX:i-n,maxX:i+n,minY:o-13,maxY:o+4})}const n=this.pins.map(e=>({minX:e.x-t,maxX:e.x+t,minY:e.y-t,maxY:e.y+t}));return[...i.values()].map(({stub:t,selected:i})=>{const r=(t=>{const i=7*t.targetFloorName.length/2;return{minX:t.x-i,maxX:t.x+i,minY:t.y+e+3,maxY:t.y+e+17}})(t),l=!n.some(e=>o(r,e))&&!s.some(e=>o(r,e));return l&&s.push(r),Y`
        ${this._renderPinMarker(t.x,t.y,e,{kind:"path",d:"M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z"},"var(--sc-fg-secondary)",i,`${t.targetLabel} (${t.targetFloorName})`)}
        ${l?Y`<text class="mesh-stub-label" x=${t.x} y=${t.y+e+14}
                >${t.targetFloorName}</text
              >`:j}
      `})}_iconForPin(e){return this._pinIcons.iconForPin(e,this.entityLookup.values())}_pinGroups(){const e=new Map;for(const t of this._displayPins){const i=`${t.x},${t.y}`;e.has(i)||e.set(i,[]),e.get(i).push(t)}return[...e.values()].map(e=>({x:e[0].x,y:e[0].y,pins:e}))}_renderPinGroup(e){const t=this._pxToUnits(12);if(1===e.pins.length){const i=e.pins[0],o=this._liveDragPin?.id===i.id?this._liveDragPin:null,s=o?.x??i.x,n=o?.y??i.y,r=i.id===this.selectedPinId;return this._renderPinMarker(s,n,t,this._iconForPin(i),"var(--sc-accent)",r,this._pinLabel(i))}const i=e.pins.some(e=>e.id===this.selectedPinId),o=`${e.pins.length} devices: ${e.pins.map(e=>this._pinLabel(e)).join(", ")}`;return this._renderPinMarker(e.x,e.y,t,{kind:"path",d:"M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10M12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4M6 16C7.1 16 8 16.9 8 18S7.1 20 6 20 4 19.1 4 18 4.9 16 6 16M6 10C7.1 10 8 10.9 8 12S7.1 14 6 14 4 13.1 4 12 4.9 10 6 10M6 4C7.1 4 8 4.9 8 6S7.1 8 6 8 4 7.1 4 6 4.9 4 6 4M18 16C19.1 16 20 16.9 20 18S19.1 20 18 20 16 19.1 16 18 16.9 16 18 16M18 10C19.1 10 20 10.9 20 12S19.1 14 18 14 16 13.1 16 12 16.9 10 18 10M18 4C19.1 4 20 4.9 20 6S19.1 8 18 8 16 7.1 16 6 16.9 4 18 4Z"},"var(--sc-accent)",i,o)}_renderPinMarker(e,t,i,o,s,n,r){return this._pinIcons.renderMarker(e,t,i,o,s,n,r)}_renderPendingTrace(){const e=this._pendingTrace?.points??[];if(0===e.length&&!this._hoverSnap)return j;const t=e.map(([e,t])=>`${e},${t}`).join(" "),i=this._pxToUnits(6),o=e[e.length-1],s=e[0],n=!!this._hoverSnap&&!!s&&e.length>=3&&ze(this._hoverSnap.point[0],this._hoverSnap.point[1],s[0],s[1])<=this._pxToUnits(xt);return Y`
      ${e.length>0?Y`<polyline class="pending-trace" points=${t}></polyline>`:j}
      ${e.map(([e,t],o)=>Y`
          <circle
            class="vertex-handle ${0===o&&n?"closing":""}"
            cx=${e}
            cy=${t}
            r=${0===o&&n?1.6*i:i}
          ></circle>
        `)}
      ${this._hoverSnap?this._renderHoverSnap(o,s,n,i):j}
    `}_renderHoverSnap(e,t,i,o){if(!this._hoverSnap)return j;const[s,n]=this._hoverSnap.point,r=this._viewBox,l=i&&t?t:[s,n];return Y`
      ${this._hoverSnap.lockedY?Y`<line
              class="axis-guide"
              x1=${r.x}
              y1=${n}
              x2=${r.x+r.w}
              y2=${n}
            ></line>`:j}
      ${this._hoverSnap.lockedX?Y`<line
              class="axis-guide"
              x1=${s}
              y1=${r.y}
              x2=${s}
              y2=${r.y+r.h}
            ></line>`:j}
      ${e?Y`<line
              class="hover-snap-line ${i?"closing":""}"
              x1=${e[0]}
              y1=${e[1]}
              x2=${l[0]}
              y2=${l[1]}
            ></line>`:j}
      ${i?j:Y`<circle
              class="hover-snap-marker ${"geometry"===this._hoverSnap.kind?"on-geometry":"axis"===this._hoverSnap.kind?"on-axis":""}"
              cx=${s}
              cy=${n}
              r=${o}
            ></circle>`}
    `}_wallStrokeWidth(e,t){if(this.scale){const[[t,i],[o,s]]=this.scale.points,n=(ze(t,i,o,s)||1)/this.scale.meters;return`${He(Se(e)/100*n,.5,40)}`}return`${He(4+t.attenuationDbPerCm*Se(e)/3,4,8)}px`}_renderWall(e){const t=this._effectivePoints("wall",e.id,e.points),i=e.id===this.selectedWallId,o=this.editingWallId===e.id,s=Me(e.material),n=this._wallStrokeWidth(e,s),r=t[0],l=t[t.length-1],a=t.length>2&&!!r&&!!l&&r[0]===l[0]&&r[1]===l[1],d=(a?t.slice(0,-1):t).map(([e,t])=>`${e},${t}`).join(" "),c="wall-line "+(i||o?"selected":""),h=`stroke:${s.color}; stroke-width:${n}`;return Y`
      ${a?Y`<polygon class=${c} points=${d} style=${h}><title>${s.label}</title></polygon>`:Y`<polyline class=${c} points=${d} style=${h}><title>${s.label}</title></polyline>`}
      ${o?this._renderVertexHandles(t,!1):j}
    `}_renderOpening(e){const t=this._openingEndpoints(e);if(!t)return j;const[[i,o],[s,n]]=t,r=e.id===this.selectedOpeningId,l=this._pxToUnits(6),a=this.walls.find(t=>t.id===e.wallId),d=a?this._wallStrokeWidth(a,Me(a.material)):void 0,c=ze(i,o,s,n)||1,h=parseFloat(d??"6")/2*1.5,p=-(n-o)/c*h,u=(s-i)/c*h,_=(e,t)=>Y`
      <line
        class="opening-jamb-case"
        x1=${e-p}
        y1=${t-u}
        x2=${e+p}
        y2=${t+u}
      ></line>
      <line
        class="opening-jamb"
        x1=${e-p}
        y1=${t-u}
        x2=${e+p}
        y2=${t+u}
      ></line>
    `;return Y`
      <line
        class="opening-line ${e.type} ${r?"selected":""}"
        x1=${i}
        y1=${o}
        x2=${s}
        y2=${n}
        style=${d?`stroke-width:${d}`:j}
      >
        <title>${e.type}</title>
      </line>
      ${_(i,o)}
      ${_(s,n)}
      ${r?Y`
            <circle class="opening-handle" cx=${i} cy=${o} r=${l}></circle>
            <circle class="opening-handle" cx=${s} cy=${n} r=${l}></circle>
          `:j}
    `}_renderScaleLine(){if(!this.scale)return j;const[[e,t],[i,o]]=this.scale.points;return Y`
      <line class="scale-line" x1=${e} y1=${t} x2=${i} y2=${o}></line>
      <text class="scale-label" x=${(e+i)/2} y=${(t+o)/2-6}>
        ${ot(this.scale.meters,this.unitSystem)}
        ${it(this.unitSystem)}
      </text>
    `}_renderPendingScale(){if(0===this._pendingScalePoints.length)return j;const e=this._pxToUnits(6),[t,i]=this._pendingScalePoints[0];return Y`<circle class="vertex-handle" cx=${t} cy=${i} r=${e}></circle>`}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return j;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.backgroundOffsetX-this._viewBox.x),s=i+e*(this.backgroundOffsetY-this._viewBox.y),n=e*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${s}px) scale(${n});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${ft}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderAlignOverlay(){if(!this.alignOverlay)return j;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.alignOverlay.offsetX-this._viewBox.x),s=i+e*(this.alignOverlay.offsetY-this._viewBox.y),n=e*this.alignOverlay.scale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${s}px) scale(${n});"
      >
        <img
          src=${this.alignOverlay.imageUrl}
          style="width:${ft}px; height:${this._alignNaturalHeight}px; opacity:${this.alignOverlay.opacity};"
        />
      </div>
    `}render(){const e=this._viewBox;return V`
      ${this._renderBackgroundOverlay()} ${this._renderAlignOverlay()}
      ${Y`
        <svg
          viewBox="${e.x} ${e.y} ${e.w} ${e.h}"
          class="${"pan"===this.mode||"align"===this.mode?"pan-mode":"select"!==this.mode?"draw-mode":""}"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @pointerleave=${this._onPointerLeave}
        >
          ${this.rooms.map(e=>this._renderRoom(e))}
          ${this.walls.map(e=>this._renderWall(e))}
          ${this.openings.map(e=>this._renderOpening(e))}
          ${this.meshLinks.map(e=>this._renderMeshLink(e))}
          ${this.meshStubs.map(e=>this._renderMeshStubLine(e))}
          ${this._renderMeshStubMarkers()}
          ${this._renderRoomMoveGuides()}
          ${"trace"===this.mode||"wall"===this.mode?this._renderPendingTrace():j}
          ${this._renderScaleLine()}
          ${"scale"===this.mode?this._renderPendingScale():j}
          ${this._pinGroups().map(e=>this._renderPinGroup(e))}
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
    `}};$t.styles=[ct,yt,r`
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
      .room-ghost {
        fill: none;
        stroke: var(--sc-fg-secondary);
        stroke-width: 2;
        stroke-dasharray: 6 4;
        opacity: 0.7;
        pointer-events: none;
      }
      /* A selected room can be dragged whole (see the "roomMove" gesture). */
      svg:not(.pan-mode):not(.draw-mode) .room-poly.selected {
        cursor: move;
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
    `],e([ue({attribute:!1})],$t.prototype,"rooms",void 0),e([ue({attribute:!1})],$t.prototype,"pins",void 0),e([ue({attribute:!1})],$t.prototype,"walls",void 0),e([ue({attribute:!1})],$t.prototype,"openings",void 0),e([ue({attribute:!1})],$t.prototype,"scale",void 0),e([ue({attribute:!1})],$t.prototype,"unitSystem",void 0),e([ue({attribute:!1})],$t.prototype,"meshLinks",void 0),e([ue({attribute:!1})],$t.prototype,"meshStubs",void 0),e([ue({attribute:!1})],$t.prototype,"entityLookup",void 0),e([ue({attribute:!1})],$t.prototype,"backgroundImageUrl",void 0),e([ue({type:Number})],$t.prototype,"backgroundOpacity",void 0),e([ue({type:Number})],$t.prototype,"backgroundOffsetX",void 0),e([ue({type:Number})],$t.prototype,"backgroundOffsetY",void 0),e([ue({type:Number})],$t.prototype,"backgroundScale",void 0),e([ue({attribute:!1})],$t.prototype,"alignOverlay",void 0),e([ue({attribute:!1})],$t.prototype,"initialViewBox",void 0),e([ue({type:Boolean})],$t.prototype,"sameBuildingAsPrevious",void 0),e([ue({attribute:!1})],$t.prototype,"mode",void 0),e([ue({attribute:!1})],$t.prototype,"snapMode",void 0),e([ue({attribute:!1})],$t.prototype,"armedEntityId",void 0),e([ue({attribute:!1})],$t.prototype,"armedOpeningType",void 0),e([ue({attribute:!1})],$t.prototype,"selectedRoomId",void 0),e([ue({attribute:!1})],$t.prototype,"editingRoomId",void 0),e([ue({attribute:!1})],$t.prototype,"editingWallId",void 0),e([ue({attribute:!1})],$t.prototype,"selectedPinId",void 0),e([ue({attribute:!1})],$t.prototype,"selectedWallId",void 0),e([ue({attribute:!1})],$t.prototype,"selectedOpeningId",void 0),e([ue({attribute:!1})],$t.prototype,"selectedMeshLinkKey",void 0),e([ue({attribute:!1})],$t.prototype,"selectedMeshStubKey",void 0),e([_e()],$t.prototype,"_viewBox",void 0),e([_e()],$t.prototype,"_naturalHeight",void 0),e([_e()],$t.prototype,"_alignNaturalHeight",void 0),e([_e()],$t.prototype,"_pendingTrace",void 0),e([_e()],$t.prototype,"_hoverSnap",void 0),e([_e()],$t.prototype,"_pendingScalePoints",void 0),e([_e()],$t.prototype,"_liveEditPoints",void 0),e([_e()],$t.prototype,"_liveRoomMove",void 0),e([_e()],$t.prototype,"_roomMoveGuides",void 0),e([_e()],$t.prototype,"_liveDragPin",void 0),e([_e()],$t.prototype,"_liveOpeningEdit",void 0),e([_e()],$t.prototype,"_selectedVertexIndex",void 0),e([ge("svg")],$t.prototype,"_svg",void 0),e([_e()],$t.prototype,"_liveRoomLabel",void 0),$t=e([me("floorplan-canvas")],$t);const kt=[[-1,-1],[1,-1],[1,1],[-1,1]];let It=class extends de{constructor(){super(...arguments),this.placements=[],this.floorNameById=new Map,this.floorIconById=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.85,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.mode="select",this.selectedPlacementId=null,this.pins=[],this.selectedPinId=null,this.entityLookup=new Map,this.meshLinks=[],this.selectedMeshLinkKey=null,this.initialViewBox=null,this._viewBox={x:0,y:0,w:ft,h:750},this._naturalHeight=750,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._pinIcons=new vt(this),this._gestureCancelled=!1,this._hasFittedOnce=!1,this._onPointerDown=e=>{if("mouse"!==e.pointerType||0===e.button){if(Qe(this),this._svg.setPointerCapture(e.pointerId),this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o={x:(t.x+i.x)/2,y:(t.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:ze(t.x,t.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}this._pointers.size>2||(this._downClient={x:e.clientX,y:e.clientY},this._lastClient={x:e.clientX,y:e.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(e.clientX,e.clientY):{type:"empty"})}},this._onPointerMove=e=>{if(!this._pointers.has(e.pointerId))return;if(this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o=ze(t.x,t.y,i.x,i.y)||1,s=this._gesture.startDistance/o,n=this._gesture.startViewBox,r=He(n.w*s,250,4e3),l=r/n.w,a=n.h*l,{x:d,y:c}=this._gesture.midImage;return void(this._viewBox={x:d-(d-n.x)*l,y:c-(c-n.y)*l,w:r,h:a})}if(1!==this._pointers.size||!this._downClient)return;if(this._gestureCancelled)return;if(!this._moved){if(ze(this._downClient.x,this._downClient.y,e.clientX,e.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"===this._gesture?.kind?this._svg.style.cursor="grabbing":this._gesture&&this._fire("property-gesture-start")}const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};if("pan"===this._gesture?.kind)this._viewBox={...this._viewBox,x:this._viewBox.x-(e.clientX-i.x)/t,y:this._viewBox.y-(e.clientY-i.y)/t};else if("move"===this._gesture?.kind)this._fire("placement-move",{id:this._gesture.id,dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t});else if("pinMove"===this._gesture?.kind){const t=this._clientToImage(e.clientX,e.clientY);this._fire("outdoor-pin-move",{id:this._gesture.id,x:t.x,y:t.y})}else if("resize"===this._gesture?.kind){const t=this._gesture,i=this.placements.find(e=>e.id===t.id);if(i){const[o,s]=kt[t.corner],n=-o,r=-s,l=this._clientToImage(e.clientX,e.clientY),a=i.rotation_deg*Math.PI/180,d=Math.cos(a),c=Math.sin(a),h=l.x-t.anchorWorld.x,p=l.y-t.anchorWorld.y,u=d*h+c*p,_=-c*h+d*p,g=Math.max(10,o*u),m=Math.max(10,s*_),y=i.aspect_ratio||g/m||1,v=Math.max(g,m*y),f=v/y,b=n*(v/2),x=r*(f/2);this._fire("placement-resize",{id:i.id,width:v,height:f,x:t.anchorWorld.x-(d*b-c*x),y:t.anchorWorld.y-(c*b+d*x)})}}else if("rotate"===this._gesture?.kind){const t=this._gesture.id,i=this.placements.find(e=>e.id===t);if(i){const t=this._clientToImage(e.clientX,e.clientY),o=((180*Math.atan2(t.y-i.y,t.x-i.x)/Math.PI+90)%360+360)%360;this._fire("placement-rotate",{id:i.id,rotationDeg:o})}}this._lastClient={x:e.clientX,y:e.clientY}},this._onPointerUp=e=>{this._pointers.delete(e.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(e.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._moved||!this._downClient||this._gestureCancelled||this._handleClick(),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1)},this._onWheel=e=>{if(e.preventDefault(),e.ctrlKey){const t=e.deltaY<0?.9:1.1;return void this._zoomBy(t,this._clientToImage(e.clientX,e.clientY))}const t=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+e.deltaX*t,y:this._viewBox.y+e.deltaY*t}}}firstUpdated(){this.initialViewBox?(this._viewBox={...this.initialViewBox},this._hasFittedOnce=!0):(this.fitToScreen(),this._hasFittedOnce=this.placements.length>0||!this.backgroundImageUrl),this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(e){if(e.has("backgroundImageUrl")&&this.backgroundImageUrl){const e=new Image;e.onload=()=>{this._naturalHeight=e.naturalHeight/e.naturalWidth*ft||750,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},e.src=this.backgroundImageUrl}}_contentBounds(){if(0===this.placements.length&&0===this.pins.length)return null;const e=[...this.placements.flatMap(e=>[e.x-e.width,e.x+e.width]),...this.pins.map(e=>e.x)],t=[...this.placements.flatMap(e=>[e.y-e.height,e.y+e.height]),...this.pins.map(e=>e.y)],i=Math.min(...e),o=Math.max(...e),s=Math.min(...t),n=Math.max(...t),r=.15*Math.max(o-i,n-s)||60;return{x:i-r,y:s-r,w:o-i+2*r,h:n-s+2*r}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:ft,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const e=this._svg?.getBoundingClientRect(),t=e?.width||this._viewBox.w,i=e?.height||this._viewBox.h,o=Math.min(t/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(t-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(e){return e/this._svgTransform().scale}_clientToImage(e,t){const i=this._svg,o=i.createSVGPoint();o.x=e,o.y=t;const s=i.getScreenCTM();if(!s)return{x:0,y:0};const n=o.matrixTransform(s.inverse());return{x:n.x,y:n.y}}_toLocal(e,t,i){const o=e.rotation_deg*Math.PI/180,s=Math.cos(o),n=Math.sin(o),r=t-e.x,l=i-e.y;return{x:s*r+n*l,y:-n*r+s*l}}_localToWorld(e,t,i){const o=e.rotation_deg*Math.PI/180,s=Math.cos(o),n=Math.sin(o);return{x:e.x+s*t-n*i,y:e.y+n*t+s*i}}_hitTest(e,t){const i=this._clientToImage(e,t),o=this._pxToUnits(12*1.4);for(const e of[...this.pins].reverse())if(ze(e.x,e.y,i.x,i.y)<=o)return{type:"pin",id:e.id};const s=this.placements.find(e=>e.id===this.selectedPlacementId);if(s){const i=this._pxToUnits(26),o=kt.map(([e,t])=>[e*s.width/2,t*s.height/2]);for(let i=0;i<o.length;i++){const[n,r]=o[i],l=this._localToWorld(s,n,r),a=this._imageToClient(l.x,l.y);if(ze(a.x,a.y,e,t)<=14)return{type:"resizeHandle",id:s.id,corner:i}}const n=this._localToWorld(s,0,-s.height/2-i),r=this._imageToClient(n.x,n.y);if(ze(r.x,r.y,e,t)<=14)return{type:"rotateHandle",id:s.id}}let n=null,r=this._pxToUnits(8);for(const e of this.meshLinks){const t=Ye(i.x,i.y,e.from.x,e.from.y,e.to.x,e.to.y);t<=r&&(n=e,r=t)}if(n)return{type:"meshLink",key:n.key};for(const e of[...this.placements].reverse()){const t=this._toLocal(e,i.x,i.y);if(Math.abs(t.x)<=e.width/2&&Math.abs(t.y)<=e.height/2)return{type:"body",id:e.id}}return{type:"empty"}}_imageToClient(e,t){const i=this._svg.getBoundingClientRect(),{scale:o,offsetX:s,offsetY:n}=this._svgTransform();return{x:i.left+s+(e-this._viewBox.x)*o,y:i.top+n+(t-this._viewBox.y)*o}}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_lockGesture(){if("resizeHandle"===this._downHit?.type){const e=this._downHit,t=this.placements.find(t=>t.id===e.id);if(!t)return{kind:"pan"};const[i,o]=kt[e.corner],s=this._localToWorld(t,-i*t.width/2,-o*t.height/2);return{kind:"resize",id:t.id,corner:e.corner,anchorWorld:s}}return"rotateHandle"===this._downHit?.type?{kind:"rotate",id:this._downHit.id}:"body"===this._downHit?.type?{kind:"move",id:this._downHit.id}:"pin"===this._downHit?.type?{kind:"pinMove",id:this._downHit.id}:{kind:"pan"}}cancelGesture(){const e=this._gesture?.kind;return!(!this._moved||!e||"pan"===e||"pinch"===e)&&(this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_handleClick(){if("place"===this.mode||"place-pin"===this.mode){if(!this._downClient)return;const e=this._clientToImage(this._downClient.x,this._downClient.y);return void this._fire("place"===this.mode?"placement-place":"outdoor-pin-place",{x:e.x,y:e.y})}const e=this._downHit;"pin"===e?.type?this._fire("outdoor-pin-select",{id:e.id}):"meshLink"===e?.type?this._fire("property-mesh-link-select",{key:e.key===this.selectedMeshLinkKey?null:e.key}):(this._fire("outdoor-pin-select",{id:null}),this._fire("property-mesh-link-select",{key:null}),this._fire("placement-select",{id:"body"===e?.type?e.id:null}))}_zoomBy(e,t){const i=He(this._viewBox.w*e,250,4e3),o=i/this._viewBox.w,s=this._viewBox.h*o;this._viewBox={x:t.x-(t.x-this._viewBox.x)*o,y:t.y-(t.y-this._viewBox.y)*o,w:i,h:s}}_zoomButton(e){const t=this._viewBox;this._zoomBy(e,{x:t.x+t.w/2,y:t.y+t.h/2})}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return j;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.backgroundOffsetX-this._viewBox.x),s=i+e*(this.backgroundOffsetY-this._viewBox.y),n=e*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${s}px) scale(${n});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${ft}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderPlacement(e){const t=e.id===this.selectedPlacementId,i=e.label_override||this.floorNameById.get(e.floor_id)||e.floor_id,o=this._pxToUnits(7),s=this._pxToUnits(26);return Y`
      <g transform="translate(${e.x} ${e.y}) rotate(${e.rotation_deg})">
        <rect
          class="placement-rect ${t?"selected":""}"
          x=${-e.width/2}
          y=${-e.height/2}
          width=${e.width}
          height=${e.height}
        ></rect>
        <text class="placement-label" y=${-e.height/2-o}>${i}</text>
        ${t?Y`
              <line
                class="rotate-stick"
                x1="0" y1=${-e.height/2}
                x2="0" y2=${-e.height/2-s}
              ></line>
              <circle class="rotate-handle" cx="0" cy=${-e.height/2-s} r=${o}></circle>
              <circle class="resize-handle" cx=${-e.width/2} cy=${-e.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${e.width/2} cy=${-e.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${e.width/2} cy=${e.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${-e.width/2} cy=${e.height/2} r=${o}></circle>
            `:j}
      </g>
    `}_renderMeshLink(e){const t=null!==e.from.floorId||null!==e.to.floorId;return Y`
      <line
        class="mesh-link ${t?"indoor":""} ${e.key===this.selectedMeshLinkKey?"selected":""}"
        x1=${e.from.x}
        y1=${e.from.y}
        x2=${e.to.x}
        y2=${e.to.y}
        style="stroke:${ve(e.quality)}"
      >
        <title>${e.from.label} → ${e.to.label}: ${e.detail??e.quality}</title>
      </line>
    `}_renderIndoorEnds(){const e=this._pxToUnits(5),t=new Map;for(const e of this.meshLinks)for(const i of[e.from,e.to])null!==i.floorId&&t.set(i.deviceId,i);return[...t.values()].map(t=>Y`
        <circle class="indoor-end" cx=${t.x} cy=${t.y} r=${e}>
          <title>${t.label}</title>
        </circle>
      `)}_renderPin(e){return this._pinIcons.renderMarker(e.x,e.y,this._pxToUnits(12),this._pinIcons.iconForPin(e,this.entityLookup.values()),"var(--sc-accent)",e.id===this.selectedPinId,e.label_override??we(e.device_id,this.entityLookup.values()))}render(){const e=this._viewBox;return V`
      ${this._renderBackgroundOverlay()}
      ${Y`
        <svg
          viewBox="${e.x} ${e.y} ${e.w} ${e.h}"
          class="${"select"!==this.mode?"place-mode":""}"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
        >
          ${this.placements.map(e=>this._renderPlacement(e))}
          ${this.meshLinks.map(e=>this._renderMeshLink(e))}
          ${this._renderIndoorEnds()}
          ${this.pins.map(e=>this._renderPin(e))}
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
    `}};It.styles=[ct,yt,r`
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
    `],e([ue({attribute:!1})],It.prototype,"placements",void 0),e([ue({attribute:!1})],It.prototype,"floorNameById",void 0),e([ue({attribute:!1})],It.prototype,"floorIconById",void 0),e([ue({attribute:!1})],It.prototype,"backgroundImageUrl",void 0),e([ue({type:Number})],It.prototype,"backgroundOpacity",void 0),e([ue({type:Number})],It.prototype,"backgroundOffsetX",void 0),e([ue({type:Number})],It.prototype,"backgroundOffsetY",void 0),e([ue({type:Number})],It.prototype,"backgroundScale",void 0),e([ue({attribute:!1})],It.prototype,"mode",void 0),e([ue({attribute:!1})],It.prototype,"selectedPlacementId",void 0),e([ue({attribute:!1})],It.prototype,"pins",void 0),e([ue({attribute:!1})],It.prototype,"selectedPinId",void 0),e([ue({attribute:!1})],It.prototype,"entityLookup",void 0),e([ue({attribute:!1})],It.prototype,"meshLinks",void 0),e([ue({attribute:!1})],It.prototype,"selectedMeshLinkKey",void 0),e([ue({attribute:!1})],It.prototype,"initialViewBox",void 0),e([_e()],It.prototype,"_viewBox",void 0),e([_e()],It.prototype,"_naturalHeight",void 0),e([ge("svg")],It.prototype,"_svg",void 0),It=e([me("property-canvas")],It);const Pt={en:{floorTabs:{property:"Property"},appHeader:{saving:"Saving…",save:"Save"}},de:{floorTabs:{property:"Anwesen"},appHeader:{saving:"Speichert…",save:"Speichern"}}};function Mt(e,t){let i=e;for(const e of t.split(".")){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function St(e,t){return Mt(Pt.en,e)??Mt(Pt.en,e)??e}let Ct=class extends de{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1}render(){return V`
      ${this.floors.map(e=>V`
          <button
            class=${this.propertySelected||e.floor_id!==this.selectedFloorId?"":"active"}
            @click=${()=>this.dispatchEvent(new CustomEvent("floor-selected",{detail:{floorId:e.floor_id},bubbles:!0,composed:!0}))}
          >
            <ha-icon icon=${function(e){if(e.icon)return e.icon;switch(e.level){case 0:return"mdi:home-floor-0";case 1:return"mdi:home-floor-1";case 2:return"mdi:home-floor-2";case 3:return"mdi:home-floor-3";case-1:return"mdi:home-floor-negative-1";default:return"mdi:home"}}(e)}></ha-icon>
            <span class=${e.has_layout?"":"unset"}>${e.name}</span>
          </button>
        `)}
      <span class="divider"></span>
      <button
        class=${this.propertySelected?"active":""}
        @click=${()=>this.dispatchEvent(new CustomEvent("property-selected",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon="mdi:map"></ha-icon>
        <span>${St("floorTabs.property")}</span>
      </button>
    `}};Ct.styles=[ct,r`
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
    `],e([ue({attribute:!1})],Ct.prototype,"floors",void 0),e([ue({attribute:!1})],Ct.prototype,"selectedFloorId",void 0),e([ue({type:Boolean})],Ct.prototype,"propertySelected",void 0),Ct=e([me("floor-tabs")],Ct);let Et=class extends de{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1,this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}render(){return V`
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
          <div class="subtitle">v${"0.13.0-beta.1"}</div>
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
          title=${this.saving?St("appHeader.saving"):St("appHeader.save")}
          ?disabled=${this.saving}
          @click=${()=>this._fire("save-click")}
        >
          <ha-icon icon="mdi:content-save"></ha-icon>
          ${this.dirty?V`<span class="dirty-dot"></span>`:j}
        </button>
        <slot name="end"></slot>
      </div>
    `}};Et.styles=[ct,r`
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
    `],e([ue({attribute:!1})],Et.prototype,"floors",void 0),e([ue({attribute:!1})],Et.prototype,"selectedFloorId",void 0),e([ue({type:Boolean})],Et.prototype,"propertySelected",void 0),e([ue({type:Boolean})],Et.prototype,"dirty",void 0),e([ue({type:Boolean})],Et.prototype,"saving",void 0),e([ue({type:Boolean})],Et.prototype,"canUndo",void 0),e([ue({type:Boolean})],Et.prototype,"canRedo",void 0),Et=e([me("app-header")],Et);let Lt=class extends de{constructor(){super(...arguments),this.mode="select",this.armedOpeningType=null,this.hasPendingTrace=!1,this.hasPendingWall=!1,this.snapMode="all",this.pendingScaleCount=0,this.scaleReadout=null,this.selectedRoom=null,this.editingRoom=!1,this.areas=[],this.selectedPin=null,this.selectedWall=null,this.editingWall=!1,this.unitSystem="metric",this.unitsPerMeter=null,this.pinStack=null,this.entityLookup=new Map,this.selectedOpening=null,this.selectedMeshLink=null,this.selectedMeshStub=null,this.otherFloors=[],this.alignTargetFloorId=null,this.alignTargetHasBackground=!0,this._wallThicknessUnit=null,this._openingWidthUnit=null}willUpdate(e){e.has("selectedWall")&&e.get("selectedWall")?.id!==this.selectedWall?.id&&(this._wallThicknessUnit=null),e.has("selectedOpening")&&e.get("selectedOpening")?.id!==this.selectedOpening?.id&&(this._openingWidthUnit=null)}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_unitSelect(e,t){return V`
      <select
        class="small-unit-select"
        @change=${e=>t(e.target.value)}
      >
        ${(i=this.unitSystem,"imperial"===i?["in","ft"]:["cm","m"]).map(t=>V`<option value=${t} ?selected=${t===e}>
              ${t}
            </option>`)}
      </select>
    `;var i}_thicknessInputAttrs(e){switch(e){case"cm":return{min:"1",max:"100",step:"0.5"};case"m":return{min:"0.01",max:"1",step:"0.01"};case"in":return{min:"0.5",max:"40",step:"0.1"};case"ft":return{min:"0.02",max:"1.5",step:"0.01"}}}_modeButton(e,t,i){return V`<button
      class=${this.mode===e?"active":""}
      title=${i}
      @click=${()=>this._fire("mode-change",{mode:e})}
    >
      <ha-icon icon=${t}></ha-icon>
    </button>`}_openingModeButton(e,t,i){const o="opening"===this.mode&&this.armedOpeningType===e;return V`<button
      class=${o?"active":""}
      title=${i}
      @click=${()=>this._fire("add-opening-click",{openingType:e})}
    >
      <ha-icon icon=${t}></ha-icon>
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
    `}_renderSnapSelect(){return V`<select
      class="snap-select"
      title="What new points snap onto (hold Shift to place one point freely)"
      @change=${e=>this._fire("snap-mode-change",{snapMode:e.target.value})}
    >
      <option value="all" ?selected=${"all"===this.snapMode}>
        Snap: all
      </option>
      <option value="same" ?selected=${"same"===this.snapMode}>
        Snap: ${"wall"===this.mode?"walls only":"rooms only"}
      </option>
      <option value="off" ?selected=${"off"===this.snapMode}>
        Snap: off
      </option>
    </select>`}_renderHintBar(){return"trace"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${this.hasPendingTrace?"Click near the start to close the room.":"Click to add points."}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingTrace?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                Cancel
              </button>`:j}
      </div>`:"wall"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click to add
          points${this.hasPendingWall?", then Finish.":"."}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingWall?V`<button
                class="primary"
                @click=${()=>this._fire("finish-wall-click")}
              >
                Finish Wall
              </button>`:j}
        ${this.hasPendingWall?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                Cancel
              </button>`:j}
      </div>`:"scale"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${0===this.pendingScaleCount?"Click the first point of a known distance.":"Click the second point."}</span
        >
        ${this.pendingScaleCount>0?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                Cancel
              </button>`:j}
      </div>`:"opening"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click on a wall to place a
          ${this.armedOpeningType??"opening"}.</span
        >
      </div>`:"align"===this.mode?this._renderAlignBar():j}_renderAlignBar(){return this.alignTargetFloorId?this.alignTargetHasBackground?V`<div class="hint-bar floating-panel">
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
          @change=${e=>this._fire("align-target-change",{floorId:e.target.value})}
        >
          <option value="" selected>— Choose a floor —</option>
          ${this.otherFloors.map(e=>V`<option value=${e.floor_id}>${e.name}</option>`)}
        </select>
        <button @click=${()=>this._fire("align-cancel-click")}>Cancel</button>
      </div>`}_areaOptions(e,t){return e.map(e=>V`<option
          value=${e.area_id}
          ?selected=${e.area_id===t}
        >
          ${e.name}
        </option>`)}_renderSelectionPanel(){if(this.selectedRoom){const e=this.selectedRoom,t=!1!==e.visible;return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${e.name}</span>
          <select
            @change=${e=>this._fire("room-area-change",{areaId:e.target.value})}
          >
            <option value="" ?selected=${!e.area_id}>— Custom —</option>
            ${this._areaOptions(this.areas.filter(e=>null!==e.floor_id),e.area_id)}
            ${this.areas.some(e=>null===e.floor_id)?V`<optgroup label="Outdoor / no floor">
                    ${this._areaOptions(this.areas.filter(e=>null===e.floor_id),e.area_id)}
                  </optgroup>`:j}
          </select>
          <button
            title=${t?"Hide room":"Show room"}
            @click=${()=>this._fire("room-visible-toggle")}
          >
            <ha-icon icon="mdi:eye${t?"":"-off"}"></ha-icon>
          </button>
          <input
            type="color"
            class="room-fill-color"
            title="Room color"
            .value=${e.fill_color??wt}
            @input=${e=>this._fire("room-fill-color-change",{color:e.target.value})}
          />
          <input
            type="range"
            class="room-opacity"
            title="Fill opacity"
            min="0"
            max="1"
            step="0.02"
            .value=${String(e.fill_opacity??.18)}
            @input=${e=>this._fire("room-fill-opacity-change",{opacity:Number(e.target.value)})}
          />
          <input
            type="range"
            class="room-opacity"
            title="Border opacity"
            min="0"
            max="1"
            step="0.02"
            .value=${String(e.border_opacity??1)}
            @input=${e=>this._fire("room-border-opacity-change",{opacity:Number(e.target.value)})}
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
          ${e.label_position?V`<button
                  title="Reset label position"
                  @click=${()=>this._fire("room-label-reset-click")}
                >
                  <ha-icon icon="mdi:format-text-variant-outline"></ha-icon>
                </button>`:j}
          <button
            class="danger"
            title="Delete room"
            @click=${()=>this._fire("room-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedPin){const e=this.selectedPin;return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${this._pinLabel(e)}</span>
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
      `}if(this.selectedWall){const e=this.selectedWall,t=this._wallThicknessUnit??rt(this.unitSystem),i=this._thicknessInputAttrs(t);return V`
        <div class="selection-panel floating-panel">
          <span class="hint">Wall material</span>
          <select
            @change=${e=>this._fire("wall-material-change",{material:e.target.value})}
          >
            ${Pe.map(t=>V`<option value=${t.id} ?selected=${t.id===e.material}>
                  ${t.label}
                </option>`)}
          </select>
          <input
            type="number"
            class="wall-thickness"
            title="Wall thickness (${t})"
            min=${i.min}
            max=${i.max}
            step=${i.step}
            .value=${lt(Se(e),t)}
            @change=${e=>{const i=at(e.target.value,t);null===i||!Number.isFinite(i)||i<=0||this._fire("wall-thickness-change",{thicknessCm:i})}}
          />
          ${this._unitSelect(t,e=>this._wallThicknessUnit=e)}
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
      `}if(this.selectedOpening){const e=this.selectedOpening,t=this._openingWidthUnit??rt(this.unitSystem),i=this._thicknessInputAttrs(t),o=this.unitsPerMeter;return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${e.type}</span>
          <input
            type="number"
            class="wall-thickness"
            title="Width (${null!==o?t:"stored units"})"
            min=${null!==o?i.min:"1"}
            step=${null!==o?i.step:"1"}
            .value=${null!==o?function(e,t,i){return lt(e/t*100,i)}(e.width,o,t):String(e.width)}
            @change=${e=>{const i=e.target.value,s=null!==o?function(e,t,i){const o=at(e,i);return null===o?null:o/100*t}(i,o,t):Number(i);null===s||!Number.isFinite(s)||s<=0||this._fire("opening-width-change",{width:s})}}
          />
          ${null!==o?this._unitSelect(t,e=>this._openingWidthUnit=e):V`<span class="hint">Calibrate Scale for real units</span>`}
          <button
            class="danger"
            title="Delete"
            @click=${()=>this._fire("opening-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedMeshLink){const e=this.selectedMeshLink;return V`
        <div class="selection-panel floating-panel">
          <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
          <span class="hint"
            >${this._pinLabel(e.fromPin)} →
            ${this._pinLabel(e.toPin)}</span
          >
          <span class="hint" style="color:${ve(e.quality)}"
            >${e.detail??e.quality}</span
          >
        </div>
      `}if(this.selectedMeshStub){const e=this.selectedMeshStub;return V`
        <div class="selection-panel floating-panel">
          <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
          <span class="hint"
            >${this._pinLabel(e.fromPin)} → ${e.targetLabel}
            (${e.targetFloorName})</span
          >
          <span class="hint" style="color:${ve(e.quality)}"
            >${e.detail??e.quality}</span
          >
          <button
            title="Go to floor"
            @click=${()=>this._fire("mesh-stub-goto-floor-click")}
          >
            <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
          </button>
        </div>
      `}return j}_pinLabel(e){return e.label_override?e.label_override:we(e.device_id,this.entityLookup.values())}_renderPinStack(){return this.pinStack?V`
      <div class="pin-stack floating-panel">
        <span class="stack-title"
          >${this.pinStack.length} devices at this spot</span
        >
        ${this.pinStack.map(e=>V`
            <div class="pin-stack-row">
              <button
                class="pin-stack-choose"
                @click=${()=>this._fire("pin-stack-choose",{pinId:e.id})}
              >
                ${this._pinLabel(e)}
              </button>
              <button
                class="pin-stack-remove"
                title="Remove from this spot"
                @click=${()=>this._fire("pin-stack-remove-click",{pinId:e.id})}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `)}
        <button @click=${()=>this._fire("pin-stack-dismiss")}>Close</button>
      </div>
    `:j}render(){return V`
      ${this._renderModeToolbar()} ${this._renderHintBar()}
      <div class="scale-badge floating-panel">
        ${this.scaleReadout??"Not calibrated"}
      </div>
      ${this.pinStack?this._renderPinStack():this._renderSelectionPanel()}
    `}};Lt.styles=[ct,r`
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
      .snap-select {
        padding: 4px;
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
    `],e([ue({attribute:!1})],Lt.prototype,"mode",void 0),e([ue({attribute:!1})],Lt.prototype,"armedOpeningType",void 0),e([ue({type:Boolean})],Lt.prototype,"hasPendingTrace",void 0),e([ue({type:Boolean})],Lt.prototype,"hasPendingWall",void 0),e([ue({attribute:!1})],Lt.prototype,"snapMode",void 0),e([ue({type:Number})],Lt.prototype,"pendingScaleCount",void 0),e([ue({attribute:!1})],Lt.prototype,"scaleReadout",void 0),e([ue({attribute:!1})],Lt.prototype,"selectedRoom",void 0),e([ue({type:Boolean})],Lt.prototype,"editingRoom",void 0),e([ue({attribute:!1})],Lt.prototype,"areas",void 0),e([ue({attribute:!1})],Lt.prototype,"selectedPin",void 0),e([ue({attribute:!1})],Lt.prototype,"selectedWall",void 0),e([ue({type:Boolean})],Lt.prototype,"editingWall",void 0),e([ue({attribute:!1})],Lt.prototype,"unitSystem",void 0),e([ue({type:Number})],Lt.prototype,"unitsPerMeter",void 0),e([ue({attribute:!1})],Lt.prototype,"pinStack",void 0),e([ue({attribute:!1})],Lt.prototype,"entityLookup",void 0),e([ue({attribute:!1})],Lt.prototype,"selectedOpening",void 0),e([ue({attribute:!1})],Lt.prototype,"selectedMeshLink",void 0),e([ue({attribute:!1})],Lt.prototype,"selectedMeshStub",void 0),e([ue({attribute:!1})],Lt.prototype,"otherFloors",void 0),e([ue({attribute:!1})],Lt.prototype,"alignTargetFloorId",void 0),e([ue({type:Boolean})],Lt.prototype,"alignTargetHasBackground",void 0),e([_e()],Lt.prototype,"_wallThicknessUnit",void 0),e([_e()],Lt.prototype,"_openingWidthUnit",void 0),Lt=e([me("canvas-overlay")],Lt);let Tt=class extends de{constructor(){super(...arguments),this.icon="",this.label="",this.open=!1}render(){return V`
      <button
        class="icon-button ${this.open?"active":""}"
        title=${this.label}
        @click=${()=>this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${this.open?V`<div class="popover floating-panel"><slot></slot></div>`:j}
    `}};var Ot;Tt.styles=[ct,r`
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
    `],e([ue()],Tt.prototype,"icon",void 0),e([ue()],Tt.prototype,"label",void 0),e([ue({type:Boolean})],Tt.prototype,"open",void 0),Tt=e([me("icon-popover")],Tt);let Rt=Ot=class extends de{constructor(){super(...arguments),this.entities=[],this.placedDeviceIds=new Set,this.armedEntityId=null,this.floors=[],this.areas=[],this.currentFloorId=null,this.linkedAreaIds=new Set,this._search="",this._floorFilter=null,this._areaFilter=null,this._onResizeHandlePointerDown=e=>{e.preventDefault();const t=e.clientX,i=this.getBoundingClientRect().width,o=e.currentTarget;o.setPointerCapture(e.pointerId);const s=e=>{const o=t-e.clientX,s=Math.min(Ot.MAX_WIDTH,Math.max(Ot.MIN_WIDTH,i+o));this.style.setProperty("--sc-picker-width",`${s}px`)},n=e=>{o.releasePointerCapture(e.pointerId),o.removeEventListener("pointermove",s),o.removeEventListener("pointerup",n),this._writeStoredWidth(Math.round(this.getBoundingClientRect().width))};o.addEventListener("pointermove",s),o.addEventListener("pointerup",n)},this._onFloorFilterChange=e=>{const t=e.target.value;this._floorFilter="all"===t?"all":t,this._areaFilter&&!this._areasForFilter.some(e=>e.area_id===this._areaFilter)&&(this._areaFilter=null)}}connectedCallback(){super.connectedCallback();const e=this._readStoredWidth();null!==e&&this.style.setProperty("--sc-picker-width",`${e}px`)}_readStoredWidth(){try{const e=localStorage.getItem(Ot.WIDTH_STORAGE_KEY);if(!e)return null;const t=Number(e);return Number.isFinite(t)?Math.min(Ot.MAX_WIDTH,Math.max(Ot.MIN_WIDTH,t)):null}catch{return null}}_writeStoredWidth(e){try{localStorage.setItem(Ot.WIDTH_STORAGE_KEY,String(e))}catch{}}get _effectiveFloorFilter(){return"all"===this._floorFilter?null:this._floorFilter??this.currentFloorId}get _areasForFilter(){const e=this._effectiveFloorFilter;return null===e?this.areas:this.areas.filter(t=>this._areaIsOnFloor(t,e))}_areaIsOnFloor(e,t){return t===ye?null===e.floor_id:e.floor_id===t||t===this.currentFloorId&&this.linkedAreaIds.has(e.area_id)}get _devices(){const e=new Map;for(const t of this.entities){const i=t.device_id??t.entity_id;e.has(i)||e.set(i,[]),e.get(i).push(t)}const t=[];for(const[i,o]of e){const e=xe(i,o)??o[0];t.push({deviceId:i,deviceName:e.device_name??e.name,areaId:e.area_id,areaName:e.area_name,integrationDomain:e.integration_domain,integrationName:e.integration_name,entities:o,primaryEntityId:e.entity_id})}return t.sort((e,t)=>e.deviceName.localeCompare(t.deviceName)),t}_blockedFloorName(e){const t=e.entities.find(t=>t.entity_id===e.primaryEntityId);return t?.placed_floor_id&&t.placed_floor_id!==this.currentFloorId?t.placed_floor_name??t.placed_floor_id:null}get _filtered(){const e=this._search.trim().toLowerCase(),t=this._effectiveFloorFilter,i=this._areaFilter;return this._devices.filter(o=>{if(i){if(o.areaId!==i)return!1}else if(t){const e=this.areas.find(e=>e.area_id===o.areaId);if(!e||!this._areaIsOnFloor(e,t))return!1}return!e||(o.deviceName.toLowerCase().includes(e)||(o.areaName??"").toLowerCase().includes(e)||o.entities.some(t=>t.entity_id.toLowerCase().includes(e)))})}render(){const e=this._filtered;return V`
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
            @input=${e=>this._search=e.target.value}
          />
        </div>
        <div class="filters">
          <select @change=${this._onFloorFilterChange}>
            <option value="all" ?selected=${"all"===this._floorFilter}>
              All Floors
            </option>
            <option
              value=${ye}
              ?selected=${this._effectiveFloorFilter===ye}
            >
              Outdoor / no floor
            </option>
            ${this.floors.map(e=>V`<option
                  value=${e.floor_id}
                  ?selected=${this._effectiveFloorFilter===e.floor_id}
                >
                  ${e.name}
                </option>`)}
          </select>
          <select
            @change=${e=>this._areaFilter=e.target.value||null}
          >
            <option value="" ?selected=${!this._areaFilter}>All Areas</option>
            ${this._areasForFilter.map(e=>V`<option
                  value=${e.area_id}
                  ?selected=${this._areaFilter===e.area_id}
                >
                  ${e.name}
                </option>`)}
          </select>
        </div>
        ${this.placedDeviceIds.size>0?V`<button
                class="clear-all-button"
                @click=${()=>this.dispatchEvent(new CustomEvent("clear-all-pins",{bubbles:!0,composed:!0}))}
              >
                <ha-icon icon="mdi:playlist-remove"></ha-icon> Clear all placed
                devices
              </button>`:j}
      </div>
      <div class="list">
        ${0===e.length?V`<div class="empty">No matching devices.</div>`:e.map(e=>{const t=this.placedDeviceIds.has(e.deviceId),i=this._blockedFloorName(e),o=this.armedEntityId===e.primaryEntityId,s=[e.areaName,e.integrationName].filter(e=>!!e).join(" - ");return V`
                  <div
                    class="item ${o?"armed":""} ${t?"placed":""} ${i?"blocked":""}"
                    title=${i?`Already placed on ${i} — remove it there first`:[e.deviceName,s].filter(e=>!!e).join(" · ")}
                    @click=${()=>{i||this.dispatchEvent(new CustomEvent("entity-armed",{detail:{entityId:e.primaryEntityId},bubbles:!0,composed:!0}))}}
                  >
                    <span class="avatar">
                      ${e.integrationDomain?V`<img
                              src="https://brands.home-assistant.io/_/${e.integrationDomain}/icon.png"
                              alt=""
                              @error=${e=>{const t=e.target;t.style.display="none",t.nextElementSibling?.classList.remove("hidden")}}
                            />`:j}
                      <ha-icon
                        icon=${"mdi:devices"}
                        class=${e.integrationDomain?"hidden":""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${e.deviceName}</span>
                      ${i?V`<span class="meta"
                              >Placed on ${i}</span
                            >`:s?V`<span class="meta">${s}</span>`:j}
                      ${t?V`<span class="meta">✓ placed</span>`:j}
                    </span>
                  </div>
                `})}
      </div>
    `}};Rt.styles=[ct,r`
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
    `],Rt.WIDTH_STORAGE_KEY="spatial-context.entityPickerSidebarWidth",Rt.MIN_WIDTH=240,Rt.MAX_WIDTH=600,e([ue({attribute:!1})],Rt.prototype,"entities",void 0),e([ue({attribute:!1})],Rt.prototype,"placedDeviceIds",void 0),e([ue({attribute:!1})],Rt.prototype,"armedEntityId",void 0),e([ue({attribute:!1})],Rt.prototype,"floors",void 0),e([ue({attribute:!1})],Rt.prototype,"areas",void 0),e([ue({attribute:!1})],Rt.prototype,"currentFloorId",void 0),e([ue({attribute:!1})],Rt.prototype,"linkedAreaIds",void 0),e([_e()],Rt.prototype,"_search",void 0),e([_e()],Rt.prototype,"_floorFilter",void 0),e([_e()],Rt.prototype,"_areaFilter",void 0),Rt=Ot=e([me("entity-picker-sidebar")],Rt);let At=class extends de{constructor(){super(...arguments),this.mode="select",this.selectedPinLabel=null,this.selectedMeshLink=null,this.buildings=[],this.scaleReadout=null,this.scaleWarning=null,this.armedBuildingKey=null,this.selectedPlacement=null,this.floorNameById=new Map}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_selectedLabel(){const e=this.selectedPlacement;return e?e.label_override||this.floorNameById.get(e.floor_id)||e.floor_id:""}_renderPinPanel(){return null===this.selectedPinLabel?j:V`
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
    `}_renderMeshLinkPanel(){const e=this.selectedMeshLink;if(!e)return j;const t=[e.from,e.to].find(e=>null!==e.floorId);return V`
      <div class="selection-panel floating-panel">
        <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
        <span class="hint">${e.from.label} → ${e.to.label}</span>
        <span class="hint" style="color:${ve(e.quality)}"
          >${e.detail??e.quality}</span
        >
        ${t?V`<button
                title="Go to ${t.label}'s floor"
                @click=${()=>this._fire("property-mesh-goto-floor-click",{floorId:t.floorId})}
              >
                <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
              </button>`:j}
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
          @change=${e=>{const t=e.target.value;t&&this._fire("placement-arm",{key:t})}}
        >
          <option value="">Place building…</option>
          ${this.buildings.map(e=>V`<option value=${e.key}>${e.name}</option>`)}
        </select>
      </div>

      <div
        class="scale-badge floating-panel"
        title=${this.scaleReadout?"Worked out from a placed building's floor scale":"Set Scale on a floor, then place its building here"}
      >
        ${this.scaleReadout??"Not calibrated"}
        ${this.scaleWarning?V`<div class="scale-warning">${this.scaleWarning}</div>`:j}
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
            `:j}
    `}};At.styles=[ct,r`
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
      .scale-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        max-width: 260px;
        padding: 6px 12px;
        font-size: 0.8125rem;
        color: var(--sc-fg-secondary);
        pointer-events: auto;
      }
      .scale-warning {
        margin-top: 2px;
        color: var(--warning-color, #db8b00);
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
    `],e([ue({attribute:!1})],At.prototype,"mode",void 0),e([ue({attribute:!1})],At.prototype,"selectedPinLabel",void 0),e([ue({attribute:!1})],At.prototype,"selectedMeshLink",void 0),e([ue({attribute:!1})],At.prototype,"buildings",void 0),e([ue({attribute:!1})],At.prototype,"scaleReadout",void 0),e([ue({attribute:!1})],At.prototype,"scaleWarning",void 0),e([ue({attribute:!1})],At.prototype,"armedBuildingKey",void 0),e([ue({attribute:!1})],At.prototype,"selectedPlacement",void 0),e([ue({attribute:!1})],At.prototype,"floorNameById",void 0),At=e([me("property-overlay")],At);const Bt=new Set(["the","and","with","power","light","plug"]);let Ft=null;function Dt(e,t,i){const o=t.toLowerCase().split(/[\s:]+/).filter(Boolean);if(0===o.length)return[];const s=o.join("-"),n=[];for(const[t,i]of e){const e=o.filter(e=>t.includes(e)).length,r=o.filter(e=>t.includes(e)||i.includes(e)).length;if(0===r)continue;const l=t===s?0:t.startsWith(o[0])?1:e===o.length?2:3-e/o.length;n.push([4*(o.length-r)+l,t])}return n.sort((e,t)=>e[0]-t[0]||e[1].length-t[1].length||e[1].localeCompare(t[1])),n.slice(0,i).map(([,e])=>e)}let zt=class extends de{constructor(){super(...arguments),this.value=null,this.suggestFrom="",this._query="",this._index=null,this._error=null,this._onBackdropClick=()=>this._fire("icon-picker-cancel"),this._onKeyDown=e=>{if("Escape"===e.key)e.stopPropagation(),this._fire("icon-picker-cancel");else if("Enter"===e.key){const e=this._results[0];e&&this._fire("icon-picked",{icon:`mdi:${e}`})}}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this._onBackdropClick),(Ft??(Ft=fetch("/spatial_context/mdi-index.json?v=0.13.0-beta.1+mux6dq85").then(e=>{if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}).catch(e=>{throw Ft=null,e})),Ft).then(e=>this._index=e,e=>this._error=e?.message??"couldn't load icons")}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this._onBackdropClick)}firstUpdated(e){this._input?.focus()}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}get _results(){const e=this._index;if(!e)return[];if(this._query.trim())return Dt(e,this._query,160);const t=new Set;for(const i of this.suggestFrom.toLowerCase().split(/[^a-z0-9]+/))if(!(i.length<3||Bt.has(i))){for(const o of Dt(e,i,12))t.add(o);if(t.size>=60)break}return[...t]}render(){const e=this._results,t=this.value?.replace(/^mdi:/,"")??null;return V`
      <div
        class="dialog floating-panel"
        role="dialog"
        aria-label="Choose an icon"
        @click=${e=>e.stopPropagation()}
        @keydown=${this._onKeyDown}
      >
        <div class="title">Choose an icon</div>
        <input
          type="search"
          placeholder="Search icons — e.g. lamp, motion, gate"
          .value=${this._query}
          @input=${e=>this._query=e.target.value}
        />
        ${this._error?V`<span class="hint"
                >Couldn't load the icon list (${this._error}).</span
              >`:this._index?0===e.length?V`<span class="hint"
                    >${this._query.trim()?"No icons match.":"Type to search all icons."}</span
                  >`:j:V`<span class="hint">Loading icons…</span>`}
        <div class="grid">
          ${e.map(e=>V`<button
                class="icon-choice ${e===t?"current":""}"
                title=${`mdi:${e}`}
                @click=${()=>this._fire("icon-picked",{icon:`mdi:${e}`})}
              >
                <ha-icon icon=${`mdi:${e}`}></ha-icon>
                <span>${e}</span>
              </button>`)}
        </div>
        <div class="actions">
          <button
            ?disabled=${!this.value}
            @click=${()=>this._fire("icon-picked",{icon:null})}
          >
            Use default icon
          </button>
          <button @click=${()=>this._fire("icon-picker-cancel")}>
            Cancel
          </button>
        </div>
      </div>
    `}};zt.styles=[ct,r`
      :host {
        position: fixed;
        inset: 0;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.45);
      }
      .dialog {
        width: min(560px, calc(100vw - 32px));
        max-height: min(640px, calc(100vh - 32px));
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
      }
      .title {
        font-size: 1.05rem;
        font-weight: 500;
      }
      input[type="search"] {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 10px;
        font: inherit;
        color: var(--sc-fg);
        background: var(--sc-bg);
        border: 1px solid var(--sc-divider);
        border-radius: 6px;
      }
      .grid {
        flex: 1;
        min-height: 160px;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
        gap: 4px;
      }
      .icon-choice {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border-radius: 8px;
        min-width: 0;
      }
      .icon-choice.current {
        outline: 2px solid var(--sc-accent);
      }
      .icon-choice ha-icon {
        --mdc-icon-size: 28px;
      }
      .icon-choice span {
        font-size: 0.7rem;
        color: var(--sc-fg-secondary);
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--sc-fg-secondary);
      }
      .actions {
        display: flex;
        justify-content: space-between;
        gap: 8px;
      }
    `],e([ue({attribute:!1})],zt.prototype,"value",void 0),e([ue({attribute:!1})],zt.prototype,"suggestFrom",void 0),e([_e()],zt.prototype,"_query",void 0),e([_e()],zt.prototype,"_index",void 0),e([_e()],zt.prototype,"_error",void 0),e([ge("input[type=search]")],zt.prototype,"_input",void 0),zt=e([me("icon-picker-dialog")],zt);let Ht=class extends de{constructor(){super(...arguments),this.coordinatorChoices=[]}_change(e){this.dispatchEvent(new CustomEvent("settings-change",{detail:e,bubbles:!0,composed:!0}))}_switch(e,t,i){return V`<input
      type="checkbox"
      class="switch"
      role="switch"
      aria-label=${t}
      .checked=${e}
      @change=${e=>i(e.target.checked)}
    />`}_segmented(e,t,i){return V`<div class="segmented" role="radiogroup">
      ${t.map(([t,o])=>V`<button
            role="radio"
            aria-checked=${t===e?"true":"false"}
            class=${t===e?"active":""}
            @click=${()=>t!==e&&i(t)}
          >
            ${o}
          </button>`)}
    </div>`}_row(e,t,i){return V`<div class="row">
      <div>
        <div class="label">${e}</div>
        ${i?V`<div class="description">${i}</div>`:j}
      </div>
      ${t}
    </div>`}render(){const e=this.settings,t=e.zigbee_coordinator_device_id,i=this.coordinatorChoices.some(e=>e.deviceId===t);return V`
      <div class="section">
        <div class="section-title">Editing</div>
        ${this._row("Auto-save changes",this._switch(e.auto_save,"Auto-save changes",e=>this._change({auto_save:e})),"Saves a few seconds after each change")}
        ${this._row("Units",this._segmented(e.unit_system,[["metric","Metric"],["imperial","Imperial"]],e=>this._change({unit_system:e})))}
        ${this._row("Floor tab order",this._segmented(e.floor_order,[["top_down","Top first"],["ground_up","Ground first"]],e=>this._change({floor_order:e})))}
      </div>

      <div class="section">
        <div class="section-title">Zigbee mesh</div>
        ${this._row("Coordinator",V`<select
            aria-label="Zigbee coordinator device"
            @change=${e=>this._change({zigbee_coordinator_device_id:e.target.value||null})}
          >
            <option value="" ?selected=${!t}>
              Zigbee2MQTT Bridge
            </option>
            ${t&&!i?V`<option value=${t} selected>
                    (device not placed)
                  </option>`:j}
            ${this.coordinatorChoices.map(({deviceId:e,label:i})=>V`<option
                  value=${e}
                  ?selected=${e===t}
                >
                  ${i}
                </option>`)}
          </select>`,"The device placed for your radio, if it isn't the Bridge")}
        ${this._row("Scan timeout",V`<span class="number"
            ><input
              type="number"
              min="30"
              max="600"
              step="10"
              aria-label="Zigbee scan timeout in seconds"
              .value=${String(e.zigbee_timeout_seconds)}
              @change=${e=>{const t=Number(e.target.value);Number.isFinite(t)&&this._change({zigbee_timeout_seconds:Math.min(600,Math.max(30,Math.round(t)))})}}
            />s</span
          >`,"Raise it if Load Mesh times out on a large mesh")}
      </div>

      <div class="section">
        <div class="section-title">Troubleshooting</div>
        ${this._row("Debug logging",this._switch(e.debug_logging,"Debug logging",e=>this._change({debug_logging:e})),"Writes spatial_context_debug.log in your config folder — ids and counts only")}
      </div>
    `}};var Ut;Ht.styles=[ct,r`
      :host {
        display: block;
        width: min(360px, calc(100vw - 32px));
        font-size: 0.875rem;
      }
      .section {
        padding: 4px 0;
      }
      .section + .section {
        border-top: 1px solid var(--sc-divider);
      }
      .section-title {
        padding: 10px 12px 4px;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--sc-fg-secondary);
      }
      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 16px;
        padding: 8px 12px;
        min-height: 36px;
      }
      .label {
        color: var(--sc-fg);
        line-height: 1.3;
      }
      .description {
        margin-top: 2px;
        font-size: 0.75rem;
        line-height: 1.3;
        color: var(--sc-fg-secondary);
      }

      /* On/off switch — a styled checkbox, so it stays keyboard and
       * screen-reader accessible. */
      .switch {
        appearance: none;
        -webkit-appearance: none;
        position: relative;
        width: 36px;
        height: 20px;
        margin: 0;
        border-radius: 10px;
        background: var(--sc-divider);
        cursor: pointer;
        transition: background 0.15s;
        flex: none;
      }
      .switch::before {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        transition: transform 0.15s;
      }
      .switch:checked {
        background: var(--sc-accent);
      }
      .switch:checked::before {
        transform: translateX(16px);
      }
      .switch:focus-visible {
        outline: 2px solid var(--sc-accent);
        outline-offset: 2px;
      }

      /* Two-option segmented control. */
      .segmented {
        display: inline-flex;
        border: 1px solid var(--sc-divider);
        border-radius: 8px;
        overflow: hidden;
      }
      .segmented button {
        padding: 5px 10px;
        border-radius: 0;
        font-size: 0.8rem;
        font-weight: 400;
        text-transform: none;
        letter-spacing: normal;
        color: var(--sc-fg);
        background: transparent;
        white-space: nowrap;
      }
      .segmented button + button {
        border-left: 1px solid var(--sc-divider);
      }
      .segmented button.active {
        background: var(--sc-accent);
        color: white;
      }

      select,
      input[type="number"] {
        font: inherit;
        font-size: 0.8rem;
        color: var(--sc-fg);
        background: var(--sc-bg);
        border: 1px solid var(--sc-divider);
        border-radius: 6px;
        padding: 4px 6px;
      }
      select {
        max-width: 170px;
      }
      .number {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--sc-fg-secondary);
        font-size: 0.8rem;
      }
      input[type="number"] {
        width: 64px;
        text-align: right;
      }
    `],e([ue({attribute:!1})],Ht.prototype,"settings",void 0),e([ue({attribute:!1})],Ht.prototype,"coordinatorChoices",void 0),Ht=e([me("settings-menu")],Ht);const Wt="spatial-context-snap-mode";let Nt=Ut=class extends de{constructor(){super(...arguments),this._floors=[],this._currentFloorId=null,this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._entities=[],this._areas=[],this._mode="select",this._snapMode=function(){try{const e=localStorage.getItem(Wt);if("all"===e||"same"===e||"off"===e)return e}catch{}return"all"}(),this._dragOverCanvas=!1,this._armedEntityId=null,this._armedOpeningType=null,this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._otherFloorPinsByDeviceId=new Map,this._dirty=!1,this._saving=!1,this._loading=!0,this._pendingCount=0,this._networkType=null,this._zigbeeMesh=null,this._zigbeeMeshLoading=!1,this._zigbeeMeshError=null,this._zigbeeMeshFetchedAt=null,this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=null,this._zigbeeShowAllLinks=!1,this._wifiMesh=null,this._wifiMeshLoading=!1,this._wifiMeshError=null,this._matterTopology=null,this._matterError=null,this._matterUnsubscribe=null,this._bluetoothAdverts=new Map,this._bluetoothBuffer=new Map,this._bluetoothFlushTimer=null,this._bluetoothDevices={},this._bluetoothError=null,this._bluetoothUnsubscribe=null,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settings={unit_system:"metric",zigbee_timeout_seconds:180,floor_order:"top_down",zigbee_coordinator_device_id:null,auto_save:!0,debug_logging:!1},this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1,this._view="floor",this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!1,this._saveError=null,this._iconPickerFor=null,this._versionNotice=null,this._autoSaveTimer=null,this._autoSaveHeld=!1,this._floorHistory=new $e,this._propertyHistory=new $e,this._propertyDragStart=null,this._propertySaving=!1,this._selectedPlacementId=null,this._propertyMode="select",this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._armedBuildingKey=null,this._sameBuildingAsPreviousFloor=!1,this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._initialized=!1,this._onFloorSelected=e=>{this._selectFloor(e.detail.floorId)},this._onPropertySelected=()=>{this._selectProperty()},this._onUndo=()=>this._undoRedo("undo"),this._onRedo=()=>this._undoRedo("redo"),this._onPropertyModeChange=e=>{this._propertyMode=e.detail.mode,this._armedBuildingKey=null,this._armedEntityId=null,this._selectedPlacementId=null},this._onOutdoorPinPlace=e=>{if(!this._armedEntityId)return;const t=this._entityLookup.get(this._armedEntityId),i=Te(t?.device_id??null,e.detail.x,e.detail.y,null);this._updatePropertyLayout({pins:[...this._propertyLayout.pins,i]}),this._armedEntityId=null,this._selectedOutdoorPinId=i.id,this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null},this._onOutdoorPinMove=e=>{this._patchOutdoorPin(e.detail.id,{x:e.detail.x,y:e.detail.y})},this._onOutdoorPinSelect=e=>{this._selectedOutdoorPinId=e.detail.id,null!==e.detail.id&&(this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null)},this._onOutdoorPinRename=()=>{const e=this._selectedOutdoorPin;if(!e)return;const t=window.prompt("Label (blank to clear override):",this._pinLabel(e));null!==t&&this._patchOutdoorPin(e.id,{label_override:t||null})},this._onOutdoorPinIcon=()=>{const e=this._selectedOutdoorPin;e&&(this._iconPickerFor={kind:"outdoor",pinId:e.id})},this._onOutdoorPinDelete=()=>{const e=this._selectedOutdoorPin;e&&window.confirm(`Remove "${this._pinLabel(e)}" from the property?`)&&(this._updatePropertyLayout({pins:this._propertyLayout.pins.filter(t=>t.id!==e.id)}),this._selectedOutdoorPinId=null)},this._onPropertyMeshLinkSelect=e=>{this._selectedPropertyMeshLinkKey=e.detail.key,null!==e.detail.key&&(this._selectedOutdoorPinId=null,this._selectedPlacementId=null)},this._onClearAllOutdoorPins=()=>{const e=this._propertyLayout.pins.length;0!==e&&window.confirm(`Remove all ${e} outdoor device${1===e?"":"s"} from the property?`)&&(this._autoSaveHeld=!0,this._updatePropertyLayout({pins:[]}),this._selectedOutdoorPinId=null)},this._onPropertyMeshGotoFloor=e=>{this._selectFloor(e.detail.floorId)},this._onPlacementArm=e=>{this._armedBuildingKey=e.detail.key,this._propertyMode="place",this._selectedPlacementId=null},this._onPlacementPlace=e=>{if(!this._armedBuildingKey)return;const t=this._buildings.find(e=>e.key===this._armedBuildingKey);if(!t)return;const i=function(e,t,i,o,s,n){const r=s>=1?Re:Re*s,l=s>=1?Re/s:Re;return{id:Le("placement"),building_id:t,floor_id:e,label_override:null,x:i,y:o,width:r,height:l,rotation_deg:0,aspect_ratio:s,source_bounds:n}}(t.floorId,t.buildingId,e.detail.x,e.detail.y,t.aspectRatio,this._buildingBounds(this._floors.filter(e=>(e.building_id??e.floor_id)===t.key)));this._updatePropertyLayout({placements:[...this._propertyLayout.placements,i]}),this._armedBuildingKey=null,this._propertyMode="select",this._selectedPlacementId=i.id},this._onPlacementMove=e=>{const t=this._propertyLayout.placements.find(t=>t.id===e.detail.id);t&&this._patchPlacement(e.detail.id,{x:t.x+e.detail.dx,y:t.y+e.detail.dy})},this._onPlacementResize=e=>{this._patchPlacement(e.detail.id,{width:e.detail.width,height:e.detail.height,x:e.detail.x,y:e.detail.y})},this._onPlacementRotate=e=>{this._patchPlacement(e.detail.id,{rotation_deg:e.detail.rotationDeg})},this._onPlacementSelect=e=>{this._selectedPlacementId=e.detail.id,null!==e.detail.id&&(this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null)},this._onPlacementRenameClick=()=>{const e=this._selectedPlacement;if(!e)return;const t=e.label_override??this._floorNameById.get(e.floor_id)??e.floor_id,i=window.prompt("Label (blank to clear override):",t);null!==i&&this._patchPlacement(e.id,{label_override:i||null})},this._onPlacementDeleteClick=()=>{const e=this._selectedPlacement;if(!e)return;const t=e.label_override??this._floorNameById.get(e.floor_id)??e.floor_id;window.confirm(`Delete the "${t}" placement?`)&&(this._updatePropertyLayout({placements:this._propertyLayout.placements.filter(t=>t.id!==e.id)}),this._selectedPlacementId=null)},this._onPlacementGotoFloorClick=()=>{const e=this._selectedPlacement;e&&this._selectFloor(e.floor_id)},this._onModeChange=e=>{this._mode=this._mode===e.detail.mode?"select":e.detail.mode,this._armedEntityId=null,this._armedOpeningType=null,"select"!==this._mode&&(this._editingRoomId=null,this._editingWallId=null),"align"!==this._mode&&this._resetAlignState()},this._onAddOpeningClick=e=>{this._mode="opening",this._armedOpeningType=e.detail.openingType,this._editingRoomId=null,this._editingWallId=null},this._onSaveClick=()=>{this._autoSaveHeld=!1;("property"===this._view?this._saveProperty():this._save()).catch(()=>{})},this._placementKeyForEntities=null,this._onVisibilityChange=()=>{"visible"===document.visibilityState&&this._checkVersion()},this._onBeforeUnload=e=>{(this._dirty||this._propertyDirty)&&(this._flushAutoSave(),e.preventDefault(),e.returnValue="")},this._onExportClick=()=>{this._export()},this._onResetClick=()=>{if("property"===this._view){if(!window.confirm("Reset the property view? This clears every building placement, every outdoor device and the background photo. Nothing is permanent until you hit Save afterward."))return;return this._autoSaveHeld=!0,this._propertyHistory.record(this._propertyLayout),this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const e=this._floors.find(e=>e.floor_id===this._currentFloorId)?.name??"this floor";window.confirm(`Reset "${e}"? This clears every room, wall, opening, placed device, and the background image on this floor. Nothing is permanent until you hit Save afterward.`)&&(this._autoSaveHeld=!0,this._floorHistory.record(this._layout),this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)},this._onToggleBackgroundPopover=()=>{this._backgroundPopoverOpen=!this._backgroundPopoverOpen,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMeshPopover=()=>{const e=!this._meshPopoverOpen;this._meshPopoverOpen=e,this._backgroundPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1,e||(this._unsubscribeMatter(),this._unsubscribeBluetooth(),this._networkType=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onToggleSettingsPopover=()=>{this._settingsPopoverOpen=!this._settingsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMoreOptionsPopover=()=>{this._moreOptionsPopoverOpen=!this._moreOptionsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1},this._onSettingsChange=e=>{const t=e.detail;this._settings={...this._settings,...t};const i=this._client.saveSettings(this._settings);if("auto_save"in t&&this._scheduleAutoSave(),"zigbee_coordinator_device_id"in t&&(this._selectedMeshLink=null,this._selectedMeshStub=null),"debug_logging"in t){const e=!!t.debug_logging;i.then(()=>{ke.configure(this._client,e),ke.log("debug_logging_on",{panel_version:"0.13.0-beta.1",panel_build:"0.13.0-beta.1+mux6dq85",user_agent:navigator.userAgent})})}},this._onNetworkTypeSelect=e=>{"matter"===this._networkType&&"matter"!==e&&this._unsubscribeMatter(),"bluetooth"===this._networkType&&"bluetooth"!==e&&this._unsubscribeBluetooth(),this._networkType=e,this._selectedMeshLink=null,this._selectedMeshStub=null,"wifi"===e?this._refreshWifiMesh():"matter"===e?this._subscribeMatter():"bluetooth"===e?this._subscribeBluetooth():"zigbee"===e&&this._loadCachedZigbeeMesh()},this._onLoadMesh=()=>{this._refreshZigbeeMesh(null!==this._zigbeeMeshFetchedAt)},this._onKeyDown=e=>{if(this._isTypingTarget())return;if(this._iconPickerFor)return;if("Escape"===e.key){if(e.preventDefault(),"floor"===this._view&&this._canvas?.cancelGesture())return;return"property"===this._view&&this._propertyCanvas?.cancelGesture()?void(this._propertyDragStart&&(this._propertyHistory.discardIfLast(this._propertyDragStart),this._propertyLayout=this._propertyDragStart,this._propertyDragStart=null)):(this._onCancelPending(),this._mode="select",this._armedEntityId=null,this._armedOpeningType=null,this._armedBuildingKey=null,void(this._propertyMode="select"))}const t=e.ctrlKey||e.metaKey,i=e.key.toLowerCase(),o=t&&!e.shiftKey&&"z"===i,s=t&&(e.shiftKey&&"z"===i||"y"===i);if(!o&&"Backspace"!==e.key||!this._canvas?.undoLastPoint())return o||s?(e.preventDefault(),void this._undoRedo(o?"undo":"redo")):"Delete"===e.key||"Backspace"===e.key?"property"===this._view?((this._selectedOutdoorPin||this._selectedPlacement)&&e.preventDefault(),void(this._selectedOutdoorPin?this._onOutdoorPinDelete():this._selectedPlacement&&this._onPlacementDeleteClick())):((this._selectedRoom||this._selectedPin||this._selectedWall||this._selectedOpening)&&e.preventDefault(),void(this._selectedRoom?this._onRoomDelete():this._selectedPin?this._onPinDelete():this._selectedWall?this._onWallDelete():this._selectedOpening&&this._onOpeningDelete())):void("Enter"===e.key&&"wall"===this._mode&&(e.preventDefault(),this._onFinishWall()));e.preventDefault()},this._onFileInputChange=async e=>{const t=e.target,i=t.files?.[0];t.value="",i&&this._handleBackgroundFile(i)},this._onCanvasDragOver=e=>{e.dataTransfer?.types.includes("Files")&&(e.preventDefault(),this._dragOverCanvas=!0)},this._onCanvasDragLeave=()=>{this._dragOverCanvas=!1},this._onCanvasDrop=e=>{if(!e.dataTransfer?.types.includes("Files"))return;e.preventDefault(),this._dragOverCanvas=!1;const t=e.dataTransfer.files?.[0];t&&this._handleBackgroundFile(t)},this._onRemoveBackgroundClick=()=>{"property"===this._view?this._updatePropertyLayout({background_image_id:null}):this._updateLayout({background_image_id:null})},this._onOpacityChange=e=>{const t=Number(e.target.value);"property"===this._view?this._updatePropertyLayout({background_opacity:t}):this._updateLayout({background_opacity:t})},this._onCancelPending=()=>this._canvas?.cancelPending(),this._onFinishWall=()=>this._canvas?.finishPendingWall(),this._onAlignTargetChange=async e=>{const t=e.detail.floorId;t?(this._alignTargetFloorId=t,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._alignTargetLayout=await this._client.getLayout(t)):this._resetAlignState()},this._onAlignDrag=e=>{this._alignOffsetX+=e.detail.dx,this._alignOffsetY+=e.detail.dy},this._onAlignScaleClick=e=>{const{factor:t}=e.detail,i=this._canvas?.getViewBox();if(i){const e=i.x+i.w/2,o=i.y+i.h/2;this._alignOffsetX=t*this._alignOffsetX+(1-t)*e,this._alignOffsetY=t*this._alignOffsetY+(1-t)*o}this._alignScale*=t},this._onAlignCancel=()=>{this._mode="select",this._resetAlignState()},this._onAlignApply=async()=>{if(!this._alignTargetFloorId||!this._alignTargetLayout)return;const e=this._alignTargetFloorId,t=this._floors.find(t=>t.floor_id===e)?.name??"that floor";if(!window.confirm(`Apply this alignment to "${t}"? This rewrites every room, wall, door/window, and placed device position on that floor — plus its background image's placement and, if this floor has one set, its scale calibration too — to match this floor's coordinate system. This saves immediately and cannot be undone.`))return;const i=this._alignScale,o=this._alignOffsetX,s=this._alignOffsetY,n=([e,t])=>[e*i+o,t*i+s],r=this._alignTargetLayout,l=this._layout.building_id??Le("building"),a={background_image_id:r.background_image_id,background_opacity:r.background_opacity,background_offset_x:r.background_offset_x*i+o,background_offset_y:r.background_offset_y*i+s,background_scale:r.background_scale*i,building_id:l,view_box:r.view_box?(()=>{const[e,t]=n([r.view_box.x,r.view_box.y]);return{x:e,y:t,w:r.view_box.w*i,h:r.view_box.h*i}})():null,rooms:r.rooms.map(e=>({...e,points:e.points.map(n)})),walls:r.walls.map(e=>({...e,points:e.points.map(n)})),pins:r.pins.map(e=>{const[t,i]=n([e.x,e.y]);return{...e,x:t,y:i}}),openings:r.openings.map(e=>{const[t,o]=n([e.x,e.y]);return{...e,x:t,y:o,width:e.width*i}}),scale:this._layout.scale??(r.scale?{points:[n(r.scale.points[0]),n(r.scale.points[1])],meters:r.scale.meters}:null)};await this._client.saveLayout(e,a),this._layout.building_id!==l&&(await this._client.setBuildingId(this._currentFloorId,l),this._layout={...this._layout,building_id:l}),this._floors=await this._client.listFloors(),this._mode="select",this._resetAlignState(),this._floorHistory.clear()},this._onRoomRename=()=>{const e=this._selectedRoom;if(!e)return;const t=window.prompt("Room name:",e.name);t&&this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===e.id?{...i,name:t}:i)})},this._onRoomAreaChange=e=>{const t=this._selectedRoom;if(!t)return;const i=e.detail.areaId||null,o=this._areas.find(e=>e.area_id===i);this._updateLayout({rooms:this._layout.rooms.map(e=>e.id===t.id?{...e,area_id:i,name:o?o.name:e.name}:e)})},this._onRoomMove=e=>{const{roomId:t,dx:i,dy:o}=e.detail;ke.log("room_move",{room_id:t,dx:Math.round(i),dy:Math.round(o)});const s=([e,t])=>[e+i,t+o],n=this._layout.rooms.map(e=>e.id===t?{...e,points:e.points.map(s),...e.label_position?{label_position:s(e.label_position)}:{}}:e),r=this._layout.pins.map(e=>e.room_id===t?{...e,x:e.x+i,y:e.y+o}:e);this._updateLayout({rooms:n,pins:Ne(n,r)})},this._onRoomLabelMoved=e=>{this._patchRoom(e.detail.roomId,{label_position:[e.detail.x,e.detail.y]})},this._onRoomLabelReset=()=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{label_position:null})},this._onRoomVisibleToggle=()=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{visible:!1===e.visible})},this._onRoomFillColorChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{fill_color:e.detail.color})},this._onRoomFillOpacityChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{fill_opacity:e.detail.opacity})},this._onRoomBorderOpacityChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{border_opacity:e.detail.opacity})},this._onRoomEditVertices=()=>{this._selectedRoomId&&(this._editingRoomId=this._editingRoomId===this._selectedRoomId?null:this._selectedRoomId)},this._onRoomDelete=()=>{const e=this._selectedRoom;if(!e||!window.confirm(`Delete room "${e.name}"?`))return;const t=this._layout.rooms.filter(t=>t.id!==e.id);this._updateLayout({rooms:t,pins:Ne(t,this._layout.pins)}),this._selectedRoomId=null,this._editingRoomId=null},this._onPinSetLabel=()=>{const e=this._selectedPin;if(!e)return;const t=window.prompt("Label override (blank to clear):",e.label_override??"");null!==t&&this._patchPin(e.id,{label_override:t||null})},this._onPinSetIcon=()=>{const e=this._selectedPin;e&&(this._iconPickerFor={kind:"floor",pinId:e.id})},this._onIconPicked=e=>{const t=this._iconPickerFor;if(this._iconPickerFor=null,!t)return;const i={icon_override:e.detail.icon};"floor"===t.kind?this._patchPin(t.pinId,i):this._patchOutdoorPin(t.pinId,i)},this._onIconPickerCancel=()=>{this._iconPickerFor=null},this._onPinSetHeight=()=>{const e=this._selectedPin;if(!e)return;const t=this._settings.unit_system,i="imperial"===t?"feet":"metres",o="imperial"===t?"6":"1.8",s=window.prompt(`Mounting height in ${i} above floor level (e.g. ${o} for a high wall mount; blank to clear):`,null===e.height_m?"":ot(e.height_m,t));if(null===s)return;const n=""===s.trim()?null:st(s,t);this._patchPin(e.id,{height_m:null!==n&&Number.isFinite(n)?n:null})},this._onPinDelete=()=>{const e=this._selectedPin;e&&window.confirm(`Delete pin for ${this._pinLabel(e)}?`)&&(this._updateLayout({pins:this._layout.pins.filter(t=>t.id!==e.id)}),this._selectedPinId=null)},this._onWallMaterialChange=e=>{const t=this._selectedWall;t&&this._updateLayout({walls:this._layout.walls.map(i=>i.id===t.id?{...i,material:e.detail.material}:i)})},this._onWallThicknessChange=e=>{const t=this._selectedWall;t&&(!Number.isFinite(e.detail.thicknessCm)||e.detail.thicknessCm<=0||this._updateLayout({walls:this._layout.walls.map(i=>i.id===t.id?{...i,thickness_cm:e.detail.thicknessCm}:i)}))},this._onWallEditVertices=()=>{this._selectedWallId&&(this._editingWallId=this._editingWallId===this._selectedWallId?null:this._selectedWallId)},this._onWallDelete=()=>{const e=this._selectedWall;e&&window.confirm("Delete this wall? Any doors/windows on it will be removed too.")&&(this._updateLayout({walls:this._layout.walls.filter(t=>t.id!==e.id),openings:this._layout.openings.filter(t=>t.wallId!==e.id)}),this._selectedWallId=null,this._editingWallId=null)},this._onOpeningWidthChange=e=>{const t=this._selectedOpening;if(!t)return;const i=e.detail.width;this._updateLayout({openings:this._layout.openings.map(e=>e.id===t.id?{...e,width:i}:e)})},this._onOpeningDelete=()=>{const e=this._selectedOpening;e&&window.confirm(`Delete this ${e.type}?`)&&(this._updateLayout({openings:this._layout.openings.filter(t=>t.id!==e.id)}),this._selectedOpeningId=null)},this._onEntityArmed=e=>{this._armedEntityId=this._armedEntityId===e.detail.entityId?null:e.detail.entityId},this._onClearAllPins=()=>{const e=this._layout.pins.length;0!==e&&window.confirm(`Remove all ${e} placed device${1===e?"":"s"} from this floor?`)&&(this._autoSaveHeld=!0,this._updateLayout({pins:[]}),this._selectedPinId=null,this._pinStackIds=null)},this._onRoomTraceComplete=e=>{const t=(i="New Room",o=e.detail.points,s=null,{id:Le("room"),name:i,area_id:s,points:o});var i,o,s;const n=[...this._layout.rooms,t];this._updateLayout({rooms:n,pins:Ne(n,this._layout.pins)}),this._selectedRoomId=t.id},this._onRoomVertexChanged=e=>{const t=this._layout.rooms.map(t=>{if(t.id!==e.detail.roomId)return t;const i=t.label_position,o=!i||Ue(i[0],i[1],e.detail.points);return{...t,points:e.detail.points,...o?{}:{label_position:null}}});this._updateLayout({rooms:t,pins:Ne(t,this._layout.pins)})},this._onRoomSelect=e=>{this._selectedRoomId=e.detail.roomId,null===e.detail.roomId?this._editingRoomId=null:(this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onWallTraceComplete=e=>{this._updateLayout({walls:[...this._layout.walls,Oe(e.detail.points)]})},this._onWallVertexChanged=e=>{this._updateLayout({walls:this._layout.walls.map(t=>t.id===e.detail.wallId?{...t,points:e.detail.points}:t)})},this._onWallSelect=e=>{this._selectedWallId=e.detail.wallId,null===e.detail.wallId?this._editingWallId=null:(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningPlace=e=>{if(!this._armedOpeningType)return;const t=function(e,t,i,o,s){return{id:Le("opening"),wallId:e,type:t,x:i,y:o,width:s}}(e.detail.wallId,this._armedOpeningType,e.detail.x,e.detail.y,this._defaultOpeningWidth());this._updateLayout({openings:[...this._layout.openings,t]})},this._onOpeningSelect=e=>{this._selectedOpeningId=e.detail.openingId,null!==e.detail.openingId&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningUpdate=e=>{this._updateLayout({openings:this._layout.openings.map(t=>t.id===e.detail.openingId?{...t,x:e.detail.x,y:e.detail.y,width:e.detail.width}:t)})},this._onPinPlace=e=>{if(!this._armedEntityId)return;const t=We(e.detail.x,e.detail.y,this._layout.rooms),i=this._entityLookup.get(this._armedEntityId),o=Te(i?.device_id??null,e.detail.x,e.detail.y,t),s=this._layout.pins.filter(t=>t.x===e.detail.x&&t.y===e.detail.y);this._updateLayout({pins:[...this._layout.pins,o]}),this._armedEntityId=null,s.length>0?(this._pinStackIds=[...s.map(e=>e.id),o.id],this._selectedPinId=null):(this._pinStackIds=null,this._selectedPinId=o.id,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinMove=e=>{const t=We(e.detail.x,e.detail.y,this._layout.rooms);this._patchPin(e.detail.pinId,{x:e.detail.x,y:e.detail.y,room_id:t})},this._onPinSelect=e=>{this._selectedPinId=e.detail.pinId,this._pinStackIds=null,null!==e.detail.pinId&&(this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinStackSelect=e=>{this._pinStackIds=e.detail.pinIds,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedPinId=null,this._selectedMeshLink=null,this._selectedMeshStub=null},this._onMeshLinkSelect=e=>{this._selectedMeshLink=e.detail.link,null!==e.detail.link&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshStub=null)},this._onMeshStubSelect=e=>{this._selectedMeshStub=e.detail.stub,null!==e.detail.stub&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null)},this._onMeshStubGotoFloorClick=()=>{const e=this._selectedMeshStub;e&&(e.targetFloorId===ye?this._selectProperty():this._selectFloor(e.targetFloorId))},this._onPinStackChoose=e=>{this._pinStackIds=null,this._selectedPinId=e.detail.pinId},this._onPinStackDismiss=()=>{this._pinStackIds=null},this._onPinStackRemove=e=>{const t=this._layout.pins.find(t=>t.id===e.detail.pinId);if(!t)return;if(!window.confirm(`Remove ${this._pinLabel(t)} from this spot?`))return;this._updateLayout({pins:this._layout.pins.filter(t=>t.id!==e.detail.pinId)});const i=(this._pinStackIds??[]).filter(t=>t!==e.detail.pinId);this._pinStackIds=i.length>1?i:null,this._selectedPinId=1===i.length?i[0]:null},this._onScaleLineComplete=e=>{const t=this._settings.unit_system,i="imperial"===t?"feet":"metres",o=window.prompt(`Real-world distance between these two points, in ${i}:`),s=o?st(o,t):null;if(null===s||!Number.isFinite(s)||s<=0)return;const n=e.detail.points;this._updateLayout({scale:{points:n,meters:s}}),this._mode="select"},this._onPendingChanged=e=>{this._pendingCount=e.detail.count},this._onSnapModeChange=e=>{this._snapMode=e.detail.snapMode;try{localStorage.setItem(Wt,this._snapMode)}catch{}}}set hass(e){this._hass=e,this._initialized||(this._initialized=!0,this._init())}get hass(){return this._hass}get _client(){return new Ce(this._hass)}get _entityLookup(){return new Map(this._entities.map(e=>[e.entity_id,e]))}get _placedDeviceIds(){return new Set(("property"===this._view?this._propertyLayout.pins:this._layout.pins).map(e=>e.device_id).filter(e=>null!==e))}get _selectedRoom(){return this._layout.rooms.find(e=>e.id===this._selectedRoomId)??null}get _areasForCurrentFloor(){return this._areas.filter(e=>e.floor_id===this._currentFloorId||null===e.floor_id)}get _outdoorAreaIdsOnCurrentFloor(){const e=new Set(this._areas.filter(e=>null===e.floor_id).map(e=>e.area_id));return new Set(this._layout.rooms.map(e=>e.area_id).filter(t=>null!==t&&e.has(t)))}get _otherFloors(){return this._floors.filter(e=>e.floor_id!==this._currentFloorId)}get _buildings(){const e=new Map;for(const t of this._floors){const i=t.building_id??t.floor_id,o=e.get(i);o?o.push(t):e.set(i,[t])}return[...e.entries()].map(([e,t])=>{const i=t[0];return{key:e,name:t.length>1?t.map(e=>e.name).join(" + "):i.name,icon:i.icon||"mdi:home-city",floorId:i.floor_id,buildingId:i.building_id,aspectRatio:this._buildingAspectRatio(t)}})}_buildingAspectRatio(e){const t=this._buildingBounds(e),i=t?t.max_x-t.min_x:0,o=t?t.max_y-t.min_y:0;return i>0&&o>0?i/o:1.375}_buildingBounds(e){const t=e.map(e=>e.content_bounds).filter(e=>null!==e);return 0===t.length?null:{min_x:Math.min(...t.map(e=>e.min_x)),min_y:Math.min(...t.map(e=>e.min_y)),max_x:Math.max(...t.map(e=>e.max_x)),max_y:Math.max(...t.map(e=>e.max_y))}}get _floorNameById(){return new Map(this._floors.map(e=>[e.floor_id,e.name]))}get _floorIconById(){return new Map(this._floors.map(e=>[e.floor_id,e.icon||"mdi:floor-plan"]))}get _selectedPlacement(){return this._propertyLayout.placements.find(e=>e.id===this._selectedPlacementId)??null}get _activeBackground(){return"property"===this._view?{imageId:this._propertyLayout.background_image_id,opacity:this._propertyLayout.background_opacity}:{imageId:this._layout.background_image_id,opacity:this._layout.background_opacity}}get _alignOverlay(){if("align"!==this._mode||!this._alignTargetLayout)return null;const e=Ee(this._alignTargetLayout.background_image_id);if(!e)return null;const t=this._alignTargetLayout;return{imageUrl:e,offsetX:this._alignScale*t.background_offset_x+this._alignOffsetX,offsetY:this._alignScale*t.background_offset_y+this._alignOffsetY,scale:this._alignScale*t.background_scale,opacity:.55}}get _orderedFloors(){if("ground_up"!==this._settings.floor_order)return this._floors;const e=this._floors.filter(e=>null!==e.level),t=this._floors.filter(e=>null===e.level);return[...e.reverse(),...t]}get _placedDeviceChoices(){const e=e=>e.label_override??we(e.device_id,this._entityLookup.values()),t=new Map;for(const i of this._layout.pins)i.device_id&&t.set(i.device_id,e(i));for(const[i,{pin:o}]of this._otherFloorPinsByDeviceId)t.has(i)||t.set(i,e(o));return[...t].map(([e,t])=>({deviceId:e,label:t})).sort((e,t)=>e.label.localeCompare(t.label))}get _pinByDeviceId(){const e=new Map;for(const t of this._layout.pins)t.device_id&&e.set(t.device_id,t);return e}get _normalizedMeshLinks(){if(!this._meshPopoverOpen)return[];if("zigbee"===this._networkType&&this._zigbeeMesh){const e=this._pinByDeviceId,t=this._outdoorPinByDeviceId,i=i=>e.has(i)?this._currentFloorId??void 0:t.has(i)?ye:this._otherFloorPinsByDeviceId.get(i)?.floorId;return function(e,t,i){const o=e.links.filter(e=>e.source_device_id&&e.target_device_id&&void 0!==t(e.source_device_id)&&void 0!==t(e.target_device_id));if(i)return o;const s=e.nodes.find(e=>"Coordinator"===e.type)?.ieee,n=new Set,r=new Map,l=new Map;for(const e of o){e.parent_child&&n.add(e),(e.source_ieee===s||e.target_ieee===s)&&e.lqi>=50&&n.add(e);const i=t(e.source_device_id)!==t(e.target_device_id)?l:r;for(const t of[e.source_ieee,e.target_ieee]){const o=i.get(t);(!o||e.lqi>o.lqi)&&i.set(t,e)}}for(const e of r.values())n.add(e);for(const e of l.values())n.add(e);return[...n]}(function(e,t){const i=e.nodes.find(e=>"Coordinator"===e.type)?.ieee;return t&&i?{...e,nodes:e.nodes.map(e=>e.ieee===i?{...e,device_id:t}:e),links:e.links.map(e=>({...e,source_device_id:e.source_ieee===i?t:e.source_device_id,target_device_id:e.target_ieee===i?t:e.target_device_id}))}:e}(this._zigbeeMesh,this._settings.zigbee_coordinator_device_id),i,this._zigbeeShowAllLinks).map(e=>{return{sourceDeviceId:e.source_device_id,targetDeviceId:e.target_device_id,quality:(t=e.lqi,t>=150?"strong":t>=80?"medium":"weak"),detail:e.lqi_readings.every(t=>t===e.lqi)?`LQI ${e.lqi}`:`LQI ${e.lqi} (raw ${e.lqi_readings.join(" / ")})`};var t})}if("wifi"===this._networkType&&this._wifiMesh)return this._wifiMesh.links.map(e=>{return{sourceDeviceId:e.source_device_id,targetDeviceId:e.target_device_id,quality:null!=e.rssi_dbm?(t=e.rssi_dbm,t>=-50?"strong":t>=-70?"medium":"weak"):"unknown",...null!=e.rssi_dbm?{detail:`${e.rssi_dbm} dBm`}:{}};var t});if("bluetooth"===this._networkType){const e=[];for(const t of this._bluetoothAdverts.values()){const i=this._bluetoothDevices[t.address]??[],o=this._bluetoothDevices[t.source]??[];for(const s of i)for(const i of o)s!==i&&e.push({sourceDeviceId:s,targetDeviceId:i,quality:null!=t.rssi?fe(t.rssi):"unknown",...null!=t.rssi?{detail:`RSSI ${t.rssi} dBm`}:{}})}return e}if("matter"===this._networkType&&this._matterTopology){const e=new Map;for(const t of this._matterTopology.nodes)t.ha_device_id&&e.set(t.id,t.ha_device_id);const t=[];for(const i of this._matterTopology.connections){const o=e.get(i.source),s=e.get(i.target);o&&s&&t.push({sourceDeviceId:o,targetDeviceId:s,quality:i.strength,detail:i.strength})}return t}return[]}get _outdoorPinByDeviceId(){const e=new Map;for(const t of this._propertyLayout.pins)t.device_id&&e.set(t.device_id,t);return e}_propertyEnd(e){const t=this._outdoorPinByDeviceId.get(e);if(t)return{deviceId:e,x:t.x,y:t.y,label:this._pinLabel(t),floorId:null};const i=this._pinByDeviceId.get(e),o=i?{pin:i,floorId:this._currentFloorId}:this._otherFloorPinsByDeviceId.get(e);if(!o?.floorId)return null;const s=this._placementForFloor(o.floorId),n=s?function(e,t,i){const o=e.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y)return null;const s=((t-o.min_x)/(o.max_x-o.min_x)-.5)*e.width,n=((i-o.min_y)/(o.max_y-o.min_y)-.5)*e.height,r=e.rotation_deg*Math.PI/180,l=Math.cos(r),a=Math.sin(r);return{x:e.x+l*s-a*n,y:e.y+a*s+l*n}}(s,o.pin.x,o.pin.y):null;return n?{deviceId:e,...n,label:this._pinLabel(o.pin),floorId:o.floorId}:null}get _propertyMeshLinks(){const e=this._outdoorPinByDeviceId,t=[];for(const i of this._normalizedMeshLinks){if(!e.has(i.sourceDeviceId)&&!e.has(i.targetDeviceId))continue;const o=this._propertyEnd(i.sourceDeviceId),s=this._propertyEnd(i.targetDeviceId);o&&s&&t.push({key:`${i.sourceDeviceId}|${i.targetDeviceId}`,from:o,to:s,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return t}get _selectedPropertyMeshLink(){return this._propertyMeshLinks.find(e=>e.key===this._selectedPropertyMeshLinkKey)??null}get _meshLinksForCurrentFloor(){const e=this._pinByDeviceId,t=[];for(const i of this._normalizedMeshLinks){const o=e.get(i.sourceDeviceId),s=e.get(i.targetDeviceId);o&&s&&t.push({fromPin:o,toPin:s,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return t}_placementForFloor(e){const t=this._floors.find(t=>t.floor_id===e);return t?this._propertyLayout.placements.find(i=>null!==t.building_id?i.building_id===t.building_id:i.floor_id===e)??null:null}_currentFloorContentBounds(){const e=[];for(const t of this._layout.rooms)e.push(...t.points);for(const t of this._layout.walls)e.push(...t.points);if(0===e.length)return null;const t=e.map(([e])=>e),i=e.map(([,e])=>e),o=Math.min(...t),s=Math.max(...t),n=Math.min(...i),r=Math.max(...i),l=.05*Math.max(s-o,r-n)||20;return{minX:o-l,minY:n-l,maxX:s+l,maxY:r+l}}_projectStubTowardBuilding(e,t){if(!this._currentFloorId)return null;const i=this._placementForFloor(this._currentFloorId),o=this._placementForFloor(t);if(!i||!o)return null;const s=this._currentFloorContentBounds();if(!s)return null;const n=Math.atan2(o.y-i.y,o.x-i.x)-i.rotation_deg*Math.PI/180;return function(e,t,i,o,s){const n=i>0?(s.maxX-e)/i:i<0?(s.minX-e)/i:1/0,r=o>0?(s.maxY-t)/o:o<0?(s.minY-t)/o:1/0,l=Math.min(n,r);return!isFinite(l)||l<=0?null:{x:e+i*l,y:t+o*l}}(e.x,e.y,Math.cos(n),Math.sin(n),s)}get _meshStubsForCurrentFloor(){if(!this._currentFloorId)return[];const e=this._pinByDeviceId,t=this._otherFloorPinsByDeviceId,i=this._floors.find(e=>e.floor_id===this._currentFloorId),o=[];for(const s of this._normalizedMeshLinks){const n=e.has(s.sourceDeviceId);if(n===e.has(s.targetDeviceId))continue;const r=e.get(n?s.sourceDeviceId:s.targetDeviceId),l=n?s.targetDeviceId:s.sourceDeviceId,a=this._outdoorPinByDeviceId.get(l);if(a){const e=this._placementForFloor(this._currentFloorId),t=e?Ie(e,a.x,a.y):null;if(!t)continue;o.push({fromPin:r,x:t.x,y:t.y,targetDeviceId:l,targetFloorId:ye,targetFloorName:"Outside",targetLabel:this._pinLabel(a),quality:s.quality,...s.detail?{detail:s.detail}:{}});continue}const d=t.get(l);if(!d||d.floorId===this._currentFloorId)continue;const c=this._floors.find(e=>e.floor_id===d.floorId),h=d.pin.label_override??we(d.pin.device_id,this._entityLookup.values()),p=null!==i?.building_id&&i?.building_id===c?.building_id?{x:d.pin.x,y:d.pin.y}:this._projectStubTowardBuilding(r,d.floorId);p&&o.push({fromPin:r,x:p.x,y:p.y,targetDeviceId:l,targetFloorId:d.floorId,targetFloorName:c?.name??d.floorId,targetLabel:h,quality:s.quality,...s.detail?{detail:s.detail}:{}})}return o}get _selectedPin(){return this._layout.pins.find(e=>e.id===this._selectedPinId)??null}get _pinStack(){if(!this._pinStackIds)return null;const e=new Map(this._layout.pins.map(e=>[e.id,e])),t=this._pinStackIds.map(t=>e.get(t)).filter(e=>!!e);return t.length>1?t:null}get _selectedWall(){return this._layout.walls.find(e=>e.id===this._selectedWallId)??null}get _selectedOpening(){return this._layout.openings.find(e=>e.id===this._selectedOpeningId)??null}get _selectedMeshLinkKey(){const e=this._selectedMeshLink;return e?`${e.fromPin.id}|${e.toPin.id}`:null}get _selectedMeshStubKey(){const e=this._selectedMeshStub;return e?`${e.fromPin.id}|${e.targetDeviceId}`:null}_unitsPerMeter(){const e=this._layout.scale;if(!e)return null;const[[t,i],[o,s]]=e.points;return(Math.hypot(o-t,s-i)||1)/e.meters}get _propertyScale(){const e=[];for(const t of this._propertyLayout.placements){const i=t.source_bounds;if(!i||t.width<=0)continue;const o=i.max_x-i.min_x;if(o<=0)continue;const s=this._buildingMetersPerUnit(t);null!==s&&e.push({area:t.width*t.height,mpu:s*o/t.width,name:t.label_override??this._floorNameById.get(t.floor_id)??"a building"})}if(0===e.length)return null;const t=e.reduce((e,t)=>t.area>e.area?t:e);return{metersPerUnit:t.mpu,buildingName:t.name,disagree:e.some(e=>Math.abs(e.mpu/t.mpu-1)>.1)}}_buildingMetersPerUnit(e){const t=this._floors.find(t=>t.floor_id===e.floor_id);if(t?.meters_per_unit)return t.meters_per_unit;if(null===e.building_id)return null;const i=this._floors.find(t=>t.building_id===e.building_id&&t.meters_per_unit);return i?.meters_per_unit??null}get _propertyScaleReadout(){const e=this._propertyScale;if(!e)return null;const t=this._settings.unit_system,i=dt(1/e.metersPerUnit,t);return`Scale (from ${e.buildingName}): 1 ${it(t)} ≈ ${i.toFixed(1)} units`}get _scaleReadout(){const e=this._unitsPerMeter();if(null===e)return null;const t=this._settings.unit_system,i=dt(e,t);return`Scale: 1 ${it(t)} ≈ ${i.toFixed(1)} units`}_defaultOpeningWidth(){const e=this._unitsPerMeter();return null===e?30:.9*e}async _init(){const[e,t,i,o,s]=await Promise.all([this._client.listFloors(),this._client.listPlaceableEntities(),this._client.listAreas(),this._client.getPropertyLayout(),this._client.getSettings()]);this._floors=e,this._entities=t,this._areas=i,this._propertyLayout=o,this._settings=s,ke.configure(this._client,s.debug_logging),ke.log("panel_open",{panel_version:"0.13.0-beta.1",panel_build:"0.13.0-beta.1+mux6dq85",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,floors:e.length}),this._checkVersion();const n=this._orderedFloors[0];n&&await this._selectFloor(n.floor_id,{skipDirtyCheck:!0}),this._loading=!1}async _selectFloor(e,t={}){if(!t.skipDirtyCheck&&this._dirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save this floor — staying here so nothing is lost.")}else if(!window.confirm("Discard unsaved changes to this floor?"))return;this._autoSaveHeld=!1,this._view="floor";const i=this._layout.building_id;this._currentFloorId=e,this._layout=await this._client.getLayout(e),this._resetSelection(),this._resetAlignState(),this._floorHistory.clear();const o=Ne(this._layout.rooms,this._layout.pins);o!==this._layout.pins?(this._layout={...this._layout,pins:o},this._dirty=!0):this._dirty=!1,this._loadOtherFloorPins(e),ke.log("floor_load",{floor_id:e,rooms:this._layout.rooms.length,walls:this._layout.walls.length,pins:this._layout.pins.length,healed:this._dirty}),this._sameBuildingAsPreviousFloor=null!==this._layout.building_id&&this._layout.building_id===i}async _loadOtherFloorPins(e){const t=this._floors.filter(t=>t.floor_id!==e),i=await Promise.all(t.map(e=>this._client.getLayout(e.floor_id)));if(this._currentFloorId!==e)return;const o=new Map;t.forEach((e,t)=>{for(const s of i[t].pins)s.device_id&&o.set(s.device_id,{pin:s,floorId:e.floor_id})}),this._otherFloorPinsByDeviceId=o}_resetAlignState(){this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1}_resetSelection(){this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._armedEntityId=null,this._armedOpeningType=null}async _save(){if(this._currentFloorId){this._saving=!0;try{const e=this._canvas?.getViewBox()??this._layout.view_box;this._layout={...this._layout,view_box:e};const t=this._layout,i=performance.now();try{await this._client.saveLayout(this._currentFloorId,t)}catch(e){throw this._saveError=this._describeSaveError(e),ke.log("save_error",{target:this._currentFloorId,error:e?.message}),e}ke.log("save",{target:this._currentFloorId,ms:Math.round(performance.now()-i),rooms:t.rooms.length,pins:t.pins.length}),this._saveError=null,this._layout===t&&(this._dirty=!1),this._floors=this._floors.map(e=>e.floor_id===this._currentFloorId?{...e,has_layout:!0}:e),await this._refreshEntitiesIfPlacementChanged()}finally{this._saving=!1}}}async _export(){const e=await this._client.exportSnapshot(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download="layout.json",o.click(),URL.revokeObjectURL(i)}_updateLayout(e){this._floorHistory.record(this._layout),this._layout={...this._layout,...e},this._dirty=!0}async _selectProperty(){if(this._propertyDirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save the property view — reopen the Property tab to try again.")}else if(!window.confirm("Discard unsaved changes to the property view?"))return;this._autoSaveHeld=!1,[this._propertyLayout,this._floors]=await Promise.all([this._client.getPropertyLayout(),this._client.listFloors()]),this._propertyHistory.clear(),ke.log("property_load",{placements:this._propertyLayout.placements.length,outdoor_pins:this._propertyLayout.pins.length}),this._propertyDirty=!1,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._propertyMode="select",this._armedBuildingKey=null,this._armedEntityId=null,this._view="property"}_updatePropertyLayout(e){this._propertyHistory.record(this._propertyLayout),this._propertyLayout={...this._propertyLayout,...e},this._propertyDirty=!0}_undoRedo(e){if(ke.log(e,{view:this._view}),"property"===this._view){const t=this._propertyLayout,i="undo"===e?this._propertyHistory.undo(t):this._propertyHistory.redo(t);if(!i)return;return this._propertyLayout={...i,view_box:t.view_box},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const t=this._layout,i="undo"===e?this._floorHistory.undo(t):this._floorHistory.redo(t);i&&(this._layout={...i,view_box:t.view_box,building_id:t.building_id},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)}get _canUndo(){return"property"===this._view?this._propertyHistory.canUndo:this._floorHistory.canUndo}get _canRedo(){return"property"===this._view?this._propertyHistory.canRedo:this._floorHistory.canRedo}async _saveProperty(){this._propertySaving=!0;try{const e=this._propertyCanvas?.getViewBox()??this._propertyLayout.view_box;this._propertyLayout={...this._propertyLayout,view_box:e};const t=this._propertyLayout,i=performance.now();try{await this._client.savePropertyLayout(t)}catch(e){throw this._saveError=this._describeSaveError(e),ke.log("save_error",{target:"property",error:e?.message}),e}ke.log("save",{target:"property",ms:Math.round(performance.now()-i),placements:t.placements.length,pins:t.pins.length}),this._saveError=null,this._propertyLayout===t&&(this._propertyDirty=!1),await this._refreshEntitiesIfPlacementChanged()}finally{this._propertySaving=!1}}get _selectedOutdoorPin(){return this._propertyLayout.pins.find(e=>e.id===this._selectedOutdoorPinId)??null}_patchOutdoorPin(e,t){this._updatePropertyLayout({pins:this._propertyLayout.pins.map(i=>i.id===e?{...i,...t}:i)})}_patchPlacement(e,t){this._updatePropertyLayout({placements:this._propertyLayout.placements.map(i=>i.id===e?{...i,...t}:i)})}_describeSaveError(e){const t=e?.message||"unknown error";return/not a valid option|extra keys not allowed|invalid_format/i.test(t)?`${t} — Home Assistant may need a restart to finish updating Spatial Context.`:t}_placementKey(){return[...this._layout.pins,...this._propertyLayout.pins].map(e=>e.device_id??"").sort().join(",")}async _refreshEntitiesIfPlacementChanged(){const e=this._placementKey();e!==this._placementKeyForEntities&&(this._entities=await this._client.listPlaceableEntities(),this._placementKeyForEntities=e)}async _checkVersion(){let e=null,t=null;try{t=await this._client.getVersionInfo()}catch{e="restart"}t&&(t.loaded_version&&t.installed_version&&t.loaded_version!==t.installed_version?e="restart":t.panel_build_id&&"0.13.0-beta.1+mux6dq85"!==t.panel_build_id&&(e="reload")),e!==this._versionNotice&&ke.log("version_check",{notice:e,panel_build:"0.13.0-beta.1+mux6dq85",...t??{}}),this._versionNotice=e}async _downloadDebugReport(){await ke.flush();const e=await this._client.getDebugReport(),t=new Blob([JSON.stringify({...e,browser:{panel_version:"0.13.0-beta.1",panel_build:"0.13.0-beta.1+mux6dq85",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`}},null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=`spatial-context-debug-${(new Date).toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i)}get _autoSaveActive(){return this._settings.auto_save&&!this._autoSaveHeld}updated(e){super.updated(e),(e.has("_layout")||e.has("_propertyLayout")||e.has("_dirty")||e.has("_propertyDirty"))&&this._scheduleAutoSave()}_scheduleAutoSave(){null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null),this._autoSaveActive&&(this._dirty||this._propertyDirty)&&(this._autoSaveTimer=window.setTimeout(()=>{this._runAutoSave()},Ut.AUTO_SAVE_DELAY_MS))}async _runAutoSave(){if(this._autoSaveTimer=null,this._autoSaveActive)if(this._saving||this._propertySaving)this._scheduleAutoSave();else try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{}}async _flushAutoSave(){if(!this._autoSaveActive)return!this._dirty&&!this._propertyDirty;null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null);try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{return!1}return!this._dirty&&!this._propertyDirty}async _loadCachedZigbeeMesh(){try{const e=await this._client.getCachedZigbeeMesh();if(!e?.fetched_at||this._zigbeeMeshLoading)return;const t=1e3*e.fetched_at;if(this._zigbeeMeshFetchedAt&&t<=this._zigbeeMeshFetchedAt)return;this._zigbeeMesh=e,this._zigbeeMeshFetchedAt=t}catch{}}async _refreshZigbeeMesh(e=!1){this._zigbeeMeshLoading=!0,this._zigbeeMeshError=null;const t=Date.now();this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=window.setInterval(()=>{this._zigbeeMeshElapsedSeconds=Math.round((Date.now()-t)/1e3)},1e3);try{this._zigbeeMesh=await this._client.getZigbeeMesh(e),ke.log("mesh_load",{network:"zigbee",force_refresh:e,ms:Date.now()-t,links:this._zigbeeMesh.links.length,nodes:this._zigbeeMesh.nodes.length}),this._zigbeeMeshFetchedAt=this._zigbeeMesh.fetched_at?1e3*this._zigbeeMesh.fetched_at:Date.now()}catch(e){const t=this._meshErrorMessage(e,"Zigbee mesh request failed");this._zigbeeMeshError=t,ke.log("mesh_error",{network:"zigbee",error:t})}finally{this._zigbeeMeshLoading=!1,null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}}async _refreshWifiMesh(){this._wifiMeshLoading=!0,this._wifiMeshError=null;try{this._wifiMesh=await this._client.getWifiMesh(),ke.log("mesh_load",{network:"wifi",links:this._wifiMesh.links.length})}catch(e){const t=this._meshErrorMessage(e,"Wi-Fi mesh request failed");this._wifiMeshError=t,ke.log("mesh_error",{network:"wifi",error:t})}finally{this._wifiMeshLoading=!1}}async _subscribeMatter(){this._unsubscribeMatter(),this._matterError=null;try{this._matterUnsubscribe=await this._client.subscribeMatterTopology(e=>{this._matterTopology=e})}catch(e){this._matterError=this._meshErrorMessage(e,"Matter topology subscription failed")}}_unsubscribeMatter(){this._matterUnsubscribe?.(),this._matterUnsubscribe=null}_meshErrorMessage(e,t){const{code:i,message:o}=e??{};return"unknown_command"===i?"Restart Home Assistant to finish updating Spatial Context.":"unauthorized"===i?"This map needs a Home Assistant admin account.":o||t}async _subscribeBluetooth(){this._unsubscribeBluetooth(),this._bluetoothError=null,this._bluetoothBuffer=new Map,this._bluetoothAdverts=new Map;let e=!1;try{this._bluetoothDevices=(await this._client.getBluetoothDevices()).devices,e=!0,this._bluetoothUnsubscribe=await this._client.subscribeBluetoothAdvertisements(e=>{for(const t of e.add??[])this._bluetoothBuffer.set(t.address,{address:t.address,source:t.source,rssi:t.rssi,name:t.name});for(const{address:t}of e.remove??[])this._bluetoothBuffer.delete(t);this._bluetoothFlushTimer??(this._bluetoothFlushTimer=window.setTimeout(()=>{this._bluetoothFlushTimer=null,this._bluetoothAdverts=new Map(this._bluetoothBuffer)},2e3))}),window.setTimeout(()=>{this._bluetoothAdverts=new Map(this._bluetoothBuffer),ke.log("mesh_load",{network:"bluetooth",adverts:this._bluetoothBuffer.size,known_addresses:Object.keys(this._bluetoothDevices).length})},300)}catch(t){this._bluetoothError=e&&"unknown_command"===t?.code?"The Bluetooth map needs Home Assistant 2025.2 or newer.":this._meshErrorMessage(t,"Bluetooth subscription failed"),ke.log("mesh_error",{network:"bluetooth",error:this._bluetoothError})}}_unsubscribeBluetooth(){this._bluetoothUnsubscribe?.(),this._bluetoothUnsubscribe=null,null!==this._bluetoothFlushTimer&&(window.clearTimeout(this._bluetoothFlushTimer),this._bluetoothFlushTimer=null)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("beforeunload",this._onBeforeUnload),document.addEventListener("visibilitychange",this._onVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("beforeunload",this._onBeforeUnload),document.removeEventListener("visibilitychange",this._onVisibilityChange),ke.flush(),this._flushAutoSave(),this._unsubscribeMatter(),this._unsubscribeBluetooth(),null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}_deepActiveElement(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}_isTypingTarget(){const e=this._deepActiveElement();return!!e&&(!!(e instanceof HTMLElement&&e.isContentEditable)||("TEXTAREA"===e.tagName||e instanceof HTMLInputElement&&["text","number","search","email","url","tel","password"].includes(e.type)))}async _handleBackgroundFile(e){if(Ut._ACCEPTED_BACKGROUND_TYPES.has(e.type))try{const t={background_image_id:await this._client.uploadBackgroundImage(e),background_opacity:.85};"property"===this._view?this._updatePropertyLayout(t):this._updateLayout(t)}catch(e){window.alert(`Background image upload failed: ${e.message}`)}else window.alert("Background image must be a PNG, JPEG, or GIF file.")}_patchRoom(e,t){this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===e?{...i,...t}:i)})}get _iconPickerPin(){const e=this._iconPickerFor;if(!e)return null;return("floor"===e.kind?this._layout.pins:this._propertyLayout.pins).find(t=>t.id===e.pinId)??null}_patchPin(e,t){this._updateLayout({pins:this._layout.pins.map(i=>i.id===e?{...i,...t}:i)})}_pinLabel(e){return e.label_override?e.label_override:we(e.device_id,this._entityLookup.values())}_meshAgeLabel(e){const t=Math.round((Date.now()-e)/1e3);return t<60?`refreshed ${t}s ago`:`refreshed ${Math.round(t/60)}m ago`}render(){if(this._loading)return V`<div class="loading">Loading Spatial Context…</div>`;if(0===this._floors.length)return V`<div class="no-floors">
        No floors found. Add floors under Settings → Areas → Floors, then reopen
        this panel.
      </div>`;const e="zigbee"===this._networkType?this._zigbeeMeshError:"wifi"===this._networkType?this._wifiMeshError:"bluetooth"===this._networkType?this._bluetoothError:this._matterError;return V`
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
                </button>`:j}
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
                </label>`:j}
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
                  <button
                    class="menu-item ${"bluetooth"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("bluetooth")}
                  >
                    <ha-icon icon="mdi:bluetooth"></ha-icon> Bluetooth
                  </button>
                </div>
                ${null===this._networkType?V`<span class="hint" style="padding: 4px 16px 8px"
                        >Pick a network above to load it.</span
                      >`:V`
                        <div class="quality-legend">
                          <span
                            class="legend-gradient"
                            style="background: linear-gradient(to right, ${ve("weak")}, ${ve("medium")}, ${ve("strong")})"
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
                                    @change=${e=>{this._zigbeeShowAllLinks=e.target.checked,this._selectedMeshLink=null,this._selectedMeshStub=null}}
                                  />
                                  Show all links
                                </label>`:"matter"===this._networkType&&this._matterUnsubscribe||"bluetooth"===this._networkType&&this._bluetoothUnsubscribe?V`<span
                                  class="hint"
                                  style="padding: 4px 16px 8px"
                                  >● Live</span
                                >`:"wifi"===this._networkType&&this._wifiMeshLoading?V`<span
                                    class="hint"
                                    style="padding: 4px 16px 8px"
                                    >Loading…</span
                                  >`:j}
                        ${e?V`<span
                                class="hint"
                                style="color: var(--sc-danger); padding: 0 16px 8px"
                                >${e}</span
                              >`:"zigbee"===this._networkType&&this._zigbeeMeshFetchedAt?V`<span
                                  class="hint"
                                  style="padding: 0 16px 8px"
                                  >${this._meshAgeLabel(this._zigbeeMeshFetchedAt)}</span
                                >`:j}
                      `}
              </icon-popover>`:j}
        <icon-popover
          slot="end"
          icon="mdi:cog"
          label="Settings"
          .open=${this._settingsPopoverOpen}
          @toggle=${this._onToggleSettingsPopover}
        >
          <settings-menu
            .settings=${this._settings}
            .coordinatorChoices=${this._placedDeviceChoices}
            @settings-change=${this._onSettingsChange}
          ></settings-menu>
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
            class="menu-item"
            title="Versions, settings, layout counts and the recent debug log — safe to attach to a GitHub issue"
            @click=${()=>{this._moreOptionsPopoverOpen=!1,this._downloadDebugReport()}}
          >
            <ha-icon icon="mdi:bug"></ha-icon> Download debug report
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
        ${this._versionNotice?V`<div class="save-error floating-panel" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span
                  >${"restart"===this._versionNotice?"Spatial Context was updated — restart Home Assistant to finish. Until then, some changes may not save.":"This page is running an older Spatial Context panel than the one installed. Reload the page (in Safari: Option+Cmd+R)."}</span
                >
                <button @click=${()=>this._versionNotice=null}>
                  Dismiss
                </button>
              </div>`:j}
        ${this._saveError?V`<div class="save-error floating-panel" role="alert">
                <ha-icon icon="mdi:alert"></ha-icon>
                <span
                  >Couldn't save: ${this._saveError} Your changes are still here
                  — keep this tab open.</span
                >
                <button @click=${this._onSaveClick}>Retry</button>
              </div>`:j}
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
                    .backgroundImageUrl=${Ee(this._propertyLayout.background_image_id)}
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
                    @property-gesture-start=${()=>this._propertyDragStart=this._propertyLayout}
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
                    .scaleReadout=${this._propertyScaleReadout}
                    .scaleWarning=${this._propertyScale?.disagree?"Placed buildings give different scales. Check their sizes against the photo.":null}
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
                        .currentFloorId=${ye}
                        @entity-armed=${this._onEntityArmed}
                        @clear-all-pins=${this._onClearAllOutdoorPins}
                      ></entity-picker-sidebar>`:j}
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
                    .backgroundImageUrl=${Ee(this._layout.background_image_id)}
                    .backgroundOpacity=${this._layout.background_opacity}
                    .backgroundOffsetX=${this._layout.background_offset_x}
                    .backgroundOffsetY=${this._layout.background_offset_y}
                    .backgroundScale=${this._layout.background_scale}
                    .alignOverlay=${this._alignOverlay}
                    .initialViewBox=${this._layout.view_box}
                    .sameBuildingAsPrevious=${this._sameBuildingAsPreviousFloor}
                    .mode=${this._mode}
                    .snapMode=${this._snapMode}
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
                    @room-move=${this._onRoomMove}
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
                    .snapMode=${this._snapMode}
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
                    @snap-mode-change=${this._onSnapModeChange}
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
                      ></entity-picker-sidebar>`:j}
              `}
      </div>
      ${this._iconPickerPin?V`<icon-picker-dialog
              .value=${this._iconPickerPin.icon_override??null}
              .suggestFrom=${this._pinLabel(this._iconPickerPin)}
              @icon-picked=${this._onIconPicked}
              @icon-picker-cancel=${this._onIconPickerCancel}
            ></icon-picker-dialog>`:j}
    `}};Nt.styles=[ct,r`
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
        position: relative;
      }
      .save-error {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 5;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: min(640px, calc(100% - 32px));
        padding: 8px 12px;
        border-left: 4px solid var(--sc-danger);
        font-size: 0.875rem;
      }
      .save-error ha-icon {
        color: var(--sc-danger);
        flex: none;
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
    `],Nt.AUTO_SAVE_DELAY_MS=3e3,Nt._ACCEPTED_BACKGROUND_TYPES=new Set(["image/png","image/jpeg","image/gif"]),e([_e()],Nt.prototype,"_floors",void 0),e([_e()],Nt.prototype,"_currentFloorId",void 0),e([_e()],Nt.prototype,"_layout",void 0),e([_e()],Nt.prototype,"_entities",void 0),e([_e()],Nt.prototype,"_areas",void 0),e([_e()],Nt.prototype,"_mode",void 0),e([_e()],Nt.prototype,"_snapMode",void 0),e([_e()],Nt.prototype,"_dragOverCanvas",void 0),e([_e()],Nt.prototype,"_armedEntityId",void 0),e([_e()],Nt.prototype,"_armedOpeningType",void 0),e([_e()],Nt.prototype,"_selectedRoomId",void 0),e([_e()],Nt.prototype,"_editingRoomId",void 0),e([_e()],Nt.prototype,"_selectedPinId",void 0),e([_e()],Nt.prototype,"_pinStackIds",void 0),e([_e()],Nt.prototype,"_selectedWallId",void 0),e([_e()],Nt.prototype,"_editingWallId",void 0),e([_e()],Nt.prototype,"_selectedOpeningId",void 0),e([_e()],Nt.prototype,"_selectedMeshLink",void 0),e([_e()],Nt.prototype,"_selectedMeshStub",void 0),e([_e()],Nt.prototype,"_otherFloorPinsByDeviceId",void 0),e([_e()],Nt.prototype,"_dirty",void 0),e([_e()],Nt.prototype,"_saving",void 0),e([_e()],Nt.prototype,"_loading",void 0),e([_e()],Nt.prototype,"_pendingCount",void 0),e([_e()],Nt.prototype,"_networkType",void 0),e([_e()],Nt.prototype,"_zigbeeMesh",void 0),e([_e()],Nt.prototype,"_zigbeeMeshLoading",void 0),e([_e()],Nt.prototype,"_zigbeeMeshError",void 0),e([_e()],Nt.prototype,"_zigbeeMeshFetchedAt",void 0),e([_e()],Nt.prototype,"_zigbeeMeshElapsedSeconds",void 0),e([_e()],Nt.prototype,"_zigbeeShowAllLinks",void 0),e([_e()],Nt.prototype,"_wifiMesh",void 0),e([_e()],Nt.prototype,"_wifiMeshLoading",void 0),e([_e()],Nt.prototype,"_wifiMeshError",void 0),e([_e()],Nt.prototype,"_matterTopology",void 0),e([_e()],Nt.prototype,"_matterError",void 0),e([_e()],Nt.prototype,"_bluetoothAdverts",void 0),e([_e()],Nt.prototype,"_bluetoothDevices",void 0),e([_e()],Nt.prototype,"_bluetoothError",void 0),e([_e()],Nt.prototype,"_backgroundPopoverOpen",void 0),e([_e()],Nt.prototype,"_meshPopoverOpen",void 0),e([_e()],Nt.prototype,"_settings",void 0),e([_e()],Nt.prototype,"_settingsPopoverOpen",void 0),e([_e()],Nt.prototype,"_moreOptionsPopoverOpen",void 0),e([_e()],Nt.prototype,"_view",void 0),e([_e()],Nt.prototype,"_propertyLayout",void 0),e([_e()],Nt.prototype,"_propertyDirty",void 0),e([_e()],Nt.prototype,"_saveError",void 0),e([_e()],Nt.prototype,"_iconPickerFor",void 0),e([_e()],Nt.prototype,"_versionNotice",void 0),e([_e()],Nt.prototype,"_propertySaving",void 0),e([_e()],Nt.prototype,"_selectedPlacementId",void 0),e([_e()],Nt.prototype,"_propertyMode",void 0),e([_e()],Nt.prototype,"_selectedOutdoorPinId",void 0),e([_e()],Nt.prototype,"_selectedPropertyMeshLinkKey",void 0),e([_e()],Nt.prototype,"_armedBuildingKey",void 0),e([_e()],Nt.prototype,"_sameBuildingAsPreviousFloor",void 0),e([_e()],Nt.prototype,"_alignTargetFloorId",void 0),e([_e()],Nt.prototype,"_alignTargetLayout",void 0),e([_e()],Nt.prototype,"_alignOffsetX",void 0),e([_e()],Nt.prototype,"_alignOffsetY",void 0),e([_e()],Nt.prototype,"_alignScale",void 0),e([ge("floorplan-canvas")],Nt.prototype,"_canvas",void 0),e([ge("property-canvas")],Nt.prototype,"_propertyCanvas",void 0),e([ge("#file-input")],Nt.prototype,"_fileInput",void 0),Nt=Ut=e([me("spatial-context-panel")],Nt)}();
