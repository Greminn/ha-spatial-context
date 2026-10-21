/*! spatial-context-panel v0.16.0-beta.2 | MIT */
!function(){"use strict";function e(e,t,i,o){var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new s(i,e,o)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,_=g.trustedTypes,m=_?_.emptyScript:"",v=g.reactiveElementPolyfillSupport,y=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&c(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:n}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const s=o?.call(this);n?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),n=t.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=o;const s=n.fromAttribute(t,e.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(e,t,i,o=!1,n){if(void 0!==e){const s=this.constructor;if(!1===o&&(n=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??b)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==n||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[y("elementProperties")]=new Map,k[y("finalized")]=new Map,v?.({ReactiveElement:k}),(g.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,$=e=>e,P=x.trustedTypes,I=P?P.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+M,L=`<${C}>`,T=document,E=()=>T.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,B=Array.isArray,A="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,F=/>/g,D=RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,W=/"/g,U=/^(?:script|style|textarea|title)$/i,N=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=N(1),q=N(2),G=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),Y=new WeakMap,j=T.createTreeWalker(T,129);function X(e,t){if(!B(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==I?I.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,o=[];let n,s=2===t?"<svg>":3===t?"<math>":"",r=z;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===z?"!--"===l[1]?r=R:void 0!==l[1]?r=F:void 0!==l[2]?(U.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=D):void 0!==l[3]&&(r=D):r===D?">"===l[0]?(r=n??z,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?D:'"'===l[3]?W:H):r===W||r===H?r=D:r===R||r===F?r=z:(r=D,n=void 0);const h=r===D&&e[t+1].startsWith("/>")?" ":"";s+=r===z?i+L:c>=0?(o.push(a),i.slice(0,c)+S+i.slice(c)+M+h):i+M+(-2===c?t:h)}return[X(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class J{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let n=0,s=0;const r=e.length-1,a=this.parts,[l,c]=Z(e,t);if(this.el=J.createElement(l,i),j.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=j.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(S)){const t=c[s++],i=o.getAttribute(e).split(M),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?oe:"?"===r[1]?ne:"@"===r[1]?se:ie}),o.removeAttribute(e)}else e.startsWith(M)&&(a.push({type:6,index:n}),o.removeAttribute(e));if(U.test(o.tagName)){const e=o.textContent.split(M),t=e.length-1;if(t>0){o.textContent=P?P.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],E()),j.nextNode(),a.push({type:2,index:++n});o.append(e[t],E())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=o.data.indexOf(M,e+1));)a.push({type:7,index:n}),e+=M.length-1}n++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,o){if(t===G)return t;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=O(t)?void 0:t._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(e),n._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(t=Q(e,n._$AS(e,t.values),n,o)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??T).importNode(t,!0);j.currentNode=o;let n=j.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let t;2===a.type?t=new te(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new re(n,this,e)),this._$AV.push(t),a=i[++r]}s!==a?.index&&(n=j.nextNode(),s++)}return j.currentNode=T,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),O(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>B(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new ee(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Y.get(e.strings);return void 0===t&&Y.set(e.strings,t=new J(e)),t}k(e){B(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const n of e)o===t.length?t.push(i=new te(this.O(E()),this.O(E()),this,this.options)):i=t[o],i._$AI(n),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,n){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(e,t=this,i,o){const n=this.strings;let s=!1;if(void 0===n)e=Q(this,e,t,0),s=!O(e)||e!==this._$AH&&e!==G,s&&(this._$AH=e);else{const o=e;let r,a;for(e=n[0],r=0;r<n.length-1;r++)a=Q(this,o[i+r],t,r),a===G&&(a=this._$AH[r]),s||=!O(a)||a!==this._$AH[r],a===K?e=K:e!==K&&(e+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class oe extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class ne extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class se extends ie{constructor(e,t,i,o,n){super(e,t,i,o,n),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??K)===G)return;const i=this._$AH,o=e===K&&i!==K||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==K&&(i===K||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const ae=x.litHtmlPolyfillSupport;ae?.(J,te),(x.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;class ce extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let n=o._$litPart$;if(void 0===n){const e=i?.renderBefore??null;o._$litPart$=n=new te(t.insertBefore(E(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const he={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:b},pe=(e=he,t,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,n,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];t.call(this,i),this.requestUpdate(o,n,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ue(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ge(e){return ue({...e,state:!0,attribute:!1})}function _e(e,t){return(t,i,o)=>((e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,i),i))(t,i,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}const me=e=>(t,i)=>{const o=()=>{customElements.get(e)?console.info(`spatial-context: <${e}> already defined — reload the page to pick up the updated panel.`):customElements.define(e,t)};void 0!==i?i.addInitializer(o):o()},ve="__property__",ye=["light","switch","climate","media_player","lock","cover","fan","vacuum","alarm_control_panel","valve","humidifier","siren","water_heater","camera","assist_satellite","device_tracker","binary_sensor","sensor"];function fe(e,t){if(!e)return null;const i=[...t].filter(t=>t.device_id===e);if(0===i.length)return null;const o=e=>"config"===e.entity_category?2:e.entity_category?1:0,n=e=>{const t=ye.indexOf(e.domain);return-1===t?ye.length:t};return i.sort((e,t)=>o(e)-o(t)||n(e)-n(t)),i[0]}function be(e,t){return fe(e,t)?.device_name??"Unknown device"}class we{constructor(e=100,t=400){this._limit=e,this._coalesceMs=t,this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}get canUndo(){return this._past.length>0}get canRedo(){return this._future.length>0}record(e,t=Date.now()){t-this._lastRecordAt>this._coalesceMs&&(this._past.push(e),this._past.length>this._limit&&this._past.shift()),this._lastRecordAt=t,this._future=[]}undo(e){const t=this._past.pop();return void 0===t?null:(this._future.push(e),this._lastRecordAt=Number.NEGATIVE_INFINITY,t)}redo(e){const t=this._future.pop();return void 0===t?null:(this._past.push(e),this._lastRecordAt=Number.NEGATIVE_INFINITY,t)}discardIfLast(e){this._past[this._past.length-1]===e&&(this._past.pop(),this._lastRecordAt=Number.NEGATIVE_INFINITY)}clear(){this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}}const ke=new class{constructor(){this._client=null,this._enabled=!1,this._buffer=[],this._timer=null,this._errorHooked=!1}configure(e,t){this._client=e,this._enabled=t,t?this._hookErrors():this._buffer=[]}log(e,t={}){this._enabled&&(this._buffer.push({event:e,t:(new Date).toISOString(),...t}),this._buffer.length>200&&this._buffer.shift(),this._timer??(this._timer=window.setTimeout(()=>{this.flush()},2e3)))}async flush(){if(this._timer=null,!this._client||0===this._buffer.length)return;const e=this._buffer;this._buffer=[];try{await this._client.sendDebugLog(e)}catch{}}_hookErrors(){if(this._errorHooked)return;this._errorHooked=!0;const e=e=>!!e&&/spatial[-_]context/.test(e);window.addEventListener("error",t=>{const i=t.error?.stack;(e(i)||e(t.filename))&&this.log("js_error",{message:t.message,stack:i})}),window.addEventListener("unhandledrejection",t=>{const i=t.reason;e(i?.stack)&&this.log("js_rejection",{message:i?.message,stack:i?.stack})})}};const xe={en:{floorTabs:{property:"Property"},appHeader:{saving:"Saving…",save:"Save",menu:"Menu",back:"Back",settings:"Settings"},canvas:{mode:{select:"Select",pan:"Pan",trace:"Trace room",wall:"Trace wall",door:"Add door",window:"Add window",scale:"Set scale",place:"Place device",align:"Align floors"},snap:{tooltip:"What new points snap onto (hold Shift to place one point freely)",all:"Snap: all",walls:"Snap: walls only",rooms:"Snap: rooms only",off:"Snap: off"},hint:{closeRoom:"Click near the start to close the room.",addPoints:"Click to add points.",addWallPoints:"Click to add points.",addWallPointsFinish:"Click to add points, then Finish.",scaleFirst:"Click the first point of a known distance.",scaleSecond:"Click the second point.",placeOpening:"Click on a wall to place a {type}.",alignAgainst:"Align against:",noBackground:"That floor has no background image to align against.",alignDrag:"Drag to move, use +/− to resize, then Apply.",multiSelected:"{count} devices selected. Drag one to move them together."},openingType:{door:"door",window:"window",opening:"opening"},openingLabel:{door:"door",window:"window"},button:{cancel:"Cancel",finishWall:"Finish wall",chooseAnother:"Choose another",apply:"Apply",close:"Close",clearSelection:"Clear"},align:{choose:"— Choose a floor —",shrink:"Shrink overlay slightly",grow:"Grow overlay slightly"},room:{custom:"— Custom —",outdoor:"Outdoor / no floor",fillOpacity:"Fill opacity",borderOpacity:"Border opacity",doneEditing:"Done editing",editVertices:"Edit vertices",useAreaName:"Use area name “{name}”",resetLabel:"Reset label position",delete:"Delete room"},pin:{setIcon:"Set icon",delete:"Remove device",removeFromSpot:"Remove from this spot",stackTitle:"{count} devices at this spot"},wall:{material:"Wall material",thickness:"Wall thickness ({unit})",delete:"Delete wall"},opening:{width:"Width ({unit})",storedUnits:"stored units",calibrate:"Calibrate scale for real units",delete:"Delete"},meshStub:{goToFloor:"Go to floor"},notCalibrated:"Not calibrated",card:{room:"Room",device:"Device",wall:"Wall",wallOpening:"In a wall",link:"Link",quality:"Signal",area:"Area",style:"Style",visible:"Visible",name:"Name",label:"Label",height:"Height ({unit})",colour:"Colour",colourDefault:"Default",colourCustom:"Custom",links:"{count} links",noLinks:"No links to other placed devices",hide:"Hide details",show:"Show details"},calibrateHint:"Click to set the scale"},mapBackground:{noWebgl:"This browser can't draw the map (WebGL2 is needed).",failed:"Couldn't load the map: {error}",add:"Add map background",remove:"Remove map background",opacity:"Map opacity",adjust:"Move map (drag; Ctrl+scroll or pinch to zoom)",adjustHint:"Drag the map to line it up with your buildings.",zoomIn:"Zoom map in",zoomOut:"Zoom map out",rotation:"Rotation",resetRotation:"North up",done:"Done",style:"Map type",street:"Street map",aerial:"Aerial photo (Esri)"},settings:{editing:"Editing",autoSave:"Auto-save changes",autoSaveHint:"Saves a few seconds after each change",units:"Units",metric:"Metric",imperial:"Imperial",floorOrder:"Floor tab order",topFirst:"Top first",groundFirst:"Ground first",zigbeeMesh:"Zigbee mesh",coordinator:"Coordinator",coordinatorAria:"Zigbee coordinator device",bridge:"Zigbee2MQTT bridge",notPlaced:"(device not placed)",coordinatorHint:"The device placed for your radio, if it isn't the Bridge",matterThread:"Matter and Thread",borderRouter:"Border router",borderRouterAria:"Thread border router device",notSet:"Not set",borderRouterHint:"The device placed for your Thread border router, so its links are drawn",scanTimeout:"Scan timeout",scanTimeoutAria:"Zigbee scan timeout in seconds",scanTimeoutHint:"Raise it if Load mesh times out on a large mesh",troubleshooting:"Troubleshooting",debugLogging:"Debug logging",debugLoggingHint:"Writes spatial_context_debug.log in your config folder — ids and counts only",about:"About",version:"Version",github:"GitHub repository",releaseNotes:"Release notes",releaseNotesHint:"What's new in each version",documentation:"Documentation",documentationHint:"How to set up and use Spatial Context",reportIssue:"Report an issue",reportIssueHint:"Attach the debug report from the ⋮ menu to help find the cause",githubHint:"Greminn/ha-spatial-context — a star helps others find it",support:"Support the project",supportHint:"Free and shared as is. Buy me an espresso if it's useful",licence:"Licence"},picker:{search:"Search devices…",clearSearch:"Clear search",more:"More",allFloors:"All floors",outdoor:"Outdoor / no floor",allAreas:"All areas",clearAll:"Clear all placed devices",noMatches:"No matching devices.",alreadyPlaced:"Already placed on {floor} — remove it there first",placedOn:"Placed on {floor}",placed:"✓ placed",showAll:"All devices",showUnplaced:"Not placed yet",showPlaced:"Placed",locate:"Show on plan",remove:"Remove from plan",title:"Place device"},iconPicker:{title:"Choose an icon",search:"Search icons — like lamp, motion, gate",loadError:"Couldn't load the icon list ({error}).",loading:"Loading icons…",noMatch:"No icons match.",typeToSearch:"Type to search all icons.",useDefault:"Use default icon",cancel:"Cancel"},legend:{weak:"Weak",medium:"Medium",strong:"Strong",unknown:"No signal data",dashedFloor:"To another floor or outside",dashedProperty:"Inside a building",hint:{zigbee:"Link quality (LQI): strong 150 and up, medium 80 and up, otherwise weak",wifi:"Signal: strong −50 dBm or better, medium −70 dBm or better, otherwise weak",bluetooth:"Signal: strong −70 dBm or better, medium −85 dBm or better, otherwise weak",matter:"As rated by Matter"},lqi:"LQI {value}",dbm:"{value} dBm"},rowActions:{undo:"Undo (Ctrl/Cmd+Z)",redo:"Redo (Ctrl/Cmd+Shift+Z)"},panel:{loading:"Loading Spatial Context…",noFloors:"No floors found. Add floors under Settings → Areas → Floors, then reopen this panel.",dismiss:"Dismiss",versionRestart:"Spatial Context was updated — restart Home Assistant to finish. Until then, some changes may not save.",versionReload:"This page is running an older Spatial Context panel than the one installed. Reload the page (in Safari: Option+Cmd+R).",scaleDisagree:"Placed buildings give different scales. Check their sizes against the photo.",scaleFromBuilding:"Scale (from {building}): 1 {unit} ≈ {value} units"},menu:{background:"Background",connectivity:"Connectivity map",settings:"Settings",more:"More options",uploadBackground:"Upload background",replaceBackground:"Replace background",removeBackground:"Remove background",opacity:"Opacity",gettingStarted:"Getting started guide",exportJson:"Export JSON",debugReport:"Download debug report",debugReportHint:"Versions, settings, layout counts and the recent debug log — safe to attach to a GitHub issue",resetFloor:"Reset floor",resetProperty:"Reset property"},network:{zigbee:"Zigbee mesh",wifi:"Wi-Fi network",matter:"Matter network",bluetooth:"Bluetooth",zigbeeShort:"Zigbee mesh",wifiShort:"Wi-Fi",matterShort:"Matter",refresh:"Refresh mesh",load:"Load mesh",loadingZigbee:"Loading… {seconds}s (usually 1–2 min)",showAll:"Show all links",live:"● Live",loading:"Loading…",refreshedSeconds:"refreshed {n}s ago",refreshedMinutes:"refreshed {n}m ago"},errors:{restartHa:"Restart Home Assistant to finish updating Spatial Context.",needsAdmin:"This map needs a Home Assistant admin account.",bluetoothVersion:"The Bluetooth map needs Home Assistant 2025.2 or newer.",zigbeeFailed:"Zigbee mesh request failed",wifiFailed:"Wi-Fi mesh request failed",matterFailed:"Matter topology subscription failed",bluetoothFailed:"Bluetooth subscription failed",floorSave:"Couldn't save this floor — staying here so nothing is lost.",propertySave:"Couldn't save the property view — reopen the Property tab to try again.",saveFailed:"Couldn't save: {error} Your changes are still here — keep this tab open.",retry:"Retry",bgType:"Background image must be a PNG, JPEG, or GIF file.",bgUpload:"Background image upload failed: {error}"},dialog:{ok:"OK",cancel:"Cancel",delete:"Delete",remove:"Remove",discard:"Discard",reset:"Reset",apply:"Apply"},confirm:{removeOutdoorPin:'Remove "{name}" from the property?',discardFloor:"Discard unsaved changes to this floor?",discardProperty:"Discard unsaved changes to the property view?",removeOutdoorOne:"Remove the outdoor device from the property?",removeOutdoorMany:"Remove all {count} outdoor devices from the property?",removeFloorOne:"Remove the placed device from this floor?",removeFloorMany:"Remove all {count} placed devices from this floor?",deletePlacement:'Delete the "{label}" placement?',resetProperty:"Reset the property view? This clears every building placement, every outdoor device and the background photo. Nothing is permanent until you hit Save afterwards.",resetFloor:'Reset "{floor}"? This clears every room, wall, opening, placed device, and the background image on this floor. Nothing is permanent until you hit Save afterwards.',applyAlignment:"Apply this alignment to \"{floor}\"? This rewrites every room, wall, door/window, and placed device position on that floor — plus its background image's placement and, if this floor has one set, its scale calibration too — to match this floor's coordinate system. This saves immediately and cannot be undone.",deleteWall:"Delete this wall? Any doors/windows on it will be removed too.",deleteRoom:'Delete room "{name}"?',deletePin:"Remove {name} from this floor?",deleteDoor:"Delete this door?",deleteWindow:"Delete this window?",removeFromSpot:"Remove {name} from this spot?"},prompt:{distance:"Real-world distance between these two points, in {unit}:"},units:{feet:"feet",metres:"metres"},floor:{thisFloor:"this floor",thatFloor:"that floor"},property:{setIcon:"Set icon",removeFromProperty:"Remove from the property",goToFloorOf:"Go to {name}'s floor",select:"Select",placeOutdoor:"Place an outdoor device",placeBuildingTip:"Place a building's footprint",placeBuilding:"Place building…",notCalibrated:"Not calibrated",goToFloor:"Go to floor",deletePlacement:"Delete placement",outdoorDevice:"Outdoor device",building:"Building",link:"Link",calibrateHint:"Set Scale on a floor, then place its building here"},canvasControls:{zoomIn:"Zoom in",zoomOut:"Zoom out",fit:"Fit to screen"},materials:{timber_frame:"Timber framed (drywall)",brick_veneer:"Brick veneer",concrete_block:"Concrete / block",aerated_concrete_block:"Aerated/foam concrete block (plastered)",ceramic_poroton_block:"Ceramic / Poroton block",glass:"Glass",steel_frame:"Steel frame"},colors:{primary:"Primary",accent:"Accent",red:"Red",pink:"Pink",purple:"Purple",deep_purple:"Deep purple",indigo:"Indigo",blue:"Blue",light_blue:"Light blue",cyan:"Cyan",teal:"Teal",green:"Green",light_green:"Light green",lime:"Lime",yellow:"Yellow",amber:"Amber",orange:"Orange",deep_orange:"Deep orange",brown:"Brown",light_grey:"Light grey",grey:"Grey",dark_grey:"Dark grey",blue_grey:"Blue grey",black:"Black",white:"White"}},de:{floorTabs:{property:"Anwesen"},appHeader:{saving:"Speichert…",save:"Speichern",menu:"Menü",back:"Zurück",settings:"Einstellungen"},canvas:{mode:{select:"Auswählen",pan:"Verschieben",trace:"Raum zeichnen",wall:"Wand zeichnen",door:"Tür hinzufügen",window:"Fenster hinzufügen",scale:"Maßstab festlegen",place:"Gerät platzieren",align:"Etagen ausrichten"},snap:{tooltip:"Woran neue Punkte einrasten (Umschalttaste halten, um einen Punkt frei zu setzen)",all:"Einrasten: alles",walls:"Einrasten: nur Wände",rooms:"Einrasten: nur Räume",off:"Einrasten: aus"},hint:{closeRoom:"Nahe dem Start klicken, um den Raum zu schließen.",addPoints:"Klicken, um Punkte hinzuzufügen.",addWallPoints:"Klicken, um Punkte hinzuzufügen.",addWallPointsFinish:"Klicken, um Punkte hinzuzufügen, dann „Fertig“.",scaleFirst:"Den ersten Punkt einer bekannten Strecke anklicken.",scaleSecond:"Den zweiten Punkt anklicken.",placeOpening:"Auf eine Wand klicken, um {type} zu platzieren.",alignAgainst:"Ausrichten an:",noBackground:"Diese Etage hat kein Hintergrundbild zum Ausrichten.",alignDrag:"Zum Verschieben ziehen, mit +/− die Größe ändern, dann „Anwenden“.",multiSelected:"{count} Geräte ausgewählt. Ein Gerät ziehen, um alle gemeinsam zu verschieben."},openingType:{door:"eine Tür",window:"ein Fenster",opening:"eine Öffnung"},openingLabel:{door:"Tür",window:"Fenster"},button:{cancel:"Abbrechen",finishWall:"Wand fertigstellen",chooseAnother:"Andere wählen",apply:"Anwenden",close:"Schließen",clearSelection:"Auswahl aufheben"},align:{choose:"— Etage wählen —",shrink:"Überlagerung leicht verkleinern",grow:"Überlagerung leicht vergrößern"},room:{custom:"— Benutzerdefiniert —",outdoor:"Außenbereich / keine Etage",fillOpacity:"Füllungsdeckkraft",borderOpacity:"Randdeckkraft",doneEditing:"Bearbeitung beenden",editVertices:"Eckpunkte bearbeiten",useAreaName:"Bereichsnamen „{name}“ verwenden",resetLabel:"Beschriftungsposition zurücksetzen",delete:"Raum löschen"},pin:{setIcon:"Symbol festlegen",delete:"Gerät entfernen",removeFromSpot:"Von dieser Stelle entfernen",stackTitle:"{count} Geräte an dieser Stelle"},wall:{material:"Wandmaterial",thickness:"Wandstärke ({unit})",delete:"Wand löschen"},opening:{width:"Breite ({unit})",storedUnits:"gespeicherte Einheiten",calibrate:"Maßstab kalibrieren für reale Einheiten",delete:"Löschen"},meshStub:{goToFloor:"Zur Etage"},notCalibrated:"Nicht kalibriert",card:{area:"Bereich",colour:"Farbe",colourCustom:"Benutzerdefiniert",colourDefault:"Standard",device:"Gerät",height:"Höhe ({unit})",label:"Bezeichnung",link:"Verbindung",links:"{count} Verbindungen",name:"Name",noLinks:"Keine Verbindungen zu anderen platzierten Geräten",quality:"Signal",room:"Raum",style:"Darstellung",visible:"Sichtbar",wall:"Wand",wallOpening:"In einer Wand",hide:"Details ausblenden",show:"Details anzeigen"},calibrateHint:"Klicken, um den Maßstab festzulegen"},mapBackground:{noWebgl:"Dieser Browser kann die Karte nicht darstellen (WebGL2 erforderlich).",failed:"Karte konnte nicht geladen werden: {error}",add:"Kartenhintergrund hinzufügen",remove:"Kartenhintergrund entfernen",opacity:"Kartendeckkraft",adjust:"Karte verschieben (ziehen; Strg+Scrollen oder Pinch zum Zoomen)",adjustHint:"Karte ziehen, um sie an den Gebäuden auszurichten.",zoomIn:"Karte vergrößern",zoomOut:"Karte verkleinern",rotation:"Drehung",resetRotation:"Norden oben",done:"Fertig",style:"Kartentyp",street:"Straßenkarte",aerial:"Luftbild (Esri)"},settings:{editing:"Bearbeiten",autoSave:"Änderungen automatisch speichern",autoSaveHint:"Speichert einige Sekunden nach jeder Änderung",units:"Einheiten",metric:"Metrisch",imperial:"Imperial",floorOrder:"Reihenfolge der Etagen-Tabs",topFirst:"Oberste zuerst",groundFirst:"Erdgeschoss zuerst",zigbeeMesh:"Zigbee-Mesh",coordinator:"Koordinator",coordinatorAria:"Zigbee-Koordinator-Gerät",bridge:"Zigbee2MQTT-Bridge",notPlaced:"(Gerät nicht platziert)",coordinatorHint:"Das für Ihren Funk-Stick platzierte Gerät, falls es nicht die Bridge ist",matterThread:"Matter und Thread",borderRouter:"Border-Router",borderRouterAria:"Thread-Border-Router-Gerät",notSet:"Nicht festgelegt",borderRouterHint:"Das platzierte Gerät deines Thread-Border-Routers, damit seine Verbindungen gezeichnet werden",scanTimeout:"Zeitlimit für den Scan",scanTimeoutAria:"Zeitlimit für den Zigbee-Scan in Sekunden",scanTimeoutHint:"Erhöhen, wenn „Mesh laden“ bei einem großen Mesh abbricht",troubleshooting:"Fehlerbehebung",debugLogging:"Debug-Protokollierung",debugLoggingHint:"Schreibt spatial_context_debug.log in Ihren Konfigurationsordner – nur IDs und Anzahlen",about:"Info",version:"Version",github:"GitHub-Repository",releaseNotes:"Versionshinweise",releaseNotesHint:"Was in jeder Version neu ist",documentation:"Dokumentation",documentationHint:"So richtest du Spatial Context ein und nutzt es",reportIssue:"Problem melden",reportIssueHint:"Hänge den Debug-Bericht aus dem ⋮-Menü an, um die Ursache zu finden",githubHint:"Greminn/ha-spatial-context – ein Stern hilft anderen, es zu finden",support:"Projekt unterstützen",supportHint:"Kostenlos und ohne Gewähr. Spendiere mir einen Espresso, wenn es dir nützt",licence:"Lizenz"},picker:{search:"Geräte suchen…",clearSearch:"Suche löschen",more:"Mehr",allFloors:"Alle Etagen",outdoor:"Außen / keine Etage",allAreas:"Alle Bereiche",clearAll:"Alle platzierten Geräte entfernen",noMatches:"Keine passenden Geräte.",alreadyPlaced:"Bereits auf {floor} platziert – dort zuerst entfernen",placedOn:"Platziert auf {floor}",placed:"✓ platziert",showAll:"Alle Geräte",showUnplaced:"Noch nicht platziert",showPlaced:"Platziert",locate:"Im Plan anzeigen",remove:"Aus dem Plan entfernen",title:"Gerät platzieren"},iconPicker:{title:"Symbol auswählen",search:"Symbole suchen – z. B. Lampe, Bewegung, Tor",loadError:"Die Symbolliste konnte nicht geladen werden ({error}).",loading:"Symbole werden geladen…",noMatch:"Keine passenden Symbole.",typeToSearch:"Tippen, um alle Symbole zu durchsuchen.",useDefault:"Standardsymbol verwenden",cancel:"Abbrechen"},legend:{weak:"Schwach",medium:"Mittel",strong:"Stark",unknown:"Keine Signaldaten",dashedFloor:"Zu einer anderen Etage oder nach draußen",dashedProperty:"Im Gebäude",hint:{zigbee:"Verbindungsqualität (LQI): stark ab 150, mittel ab 80, sonst schwach",wifi:"Signal: stark −50 dBm oder besser, mittel −70 dBm oder besser, sonst schwach",bluetooth:"Signal: stark −70 dBm oder besser, mittel −85 dBm oder besser, sonst schwach",matter:"Wie von Matter bewertet"},lqi:"LQI {value}",dbm:"{value} dBm"},rowActions:{undo:"Rückgängig (Strg/Cmd+Z)",redo:"Wiederholen (Strg/Cmd+Umschalt+Z)"},panel:{loading:"Spatial Context wird geladen…",noFloors:"Keine Etagen gefunden. Fügen Sie Etagen unter Einstellungen → Bereiche → Etagen hinzu und öffnen Sie dieses Panel erneut.",dismiss:"Schließen",versionRestart:"Spatial Context wurde aktualisiert – starten Sie Home Assistant neu, um den Vorgang abzuschließen. Bis dahin werden manche Änderungen möglicherweise nicht gespeichert.",versionReload:"Diese Seite verwendet ein älteres Spatial-Context-Panel als das installierte. Laden Sie die Seite neu (in Safari: Option+Cmd+R).",scaleDisagree:"Die platzierten Gebäude ergeben unterschiedliche Maßstäbe. Prüfen Sie ihre Größen anhand des Fotos.",scaleFromBuilding:"Maßstab (von {building}): 1 {unit} ≈ {value} Einheiten"},menu:{background:"Hintergrund",connectivity:"Verbindungskarte",settings:"Einstellungen",more:"Weitere Optionen",uploadBackground:"Hintergrund hochladen",replaceBackground:"Hintergrund ersetzen",removeBackground:"Hintergrund entfernen",opacity:"Deckkraft",gettingStarted:"Einstiegsanleitung",exportJson:"JSON exportieren",debugReport:"Debug-Bericht herunterladen",debugReportHint:"Versionen, Einstellungen, Layout-Anzahlen und das aktuelle Debug-Protokoll – sicher an ein GitHub-Issue anzuhängen",resetFloor:"Etage zurücksetzen",resetProperty:"Anwesen zurücksetzen"},network:{zigbee:"Zigbee-Mesh",wifi:"WLAN-Netzwerk",matter:"Matter-Netzwerk",bluetooth:"Bluetooth",zigbeeShort:"Zigbee-Mesh",wifiShort:"WLAN",matterShort:"Matter",refresh:"Mesh aktualisieren",load:"Mesh laden",loadingZigbee:"Wird geladen… {seconds} s (dauert meist 1–2 Min.)",showAll:"Alle Verbindungen anzeigen",live:"● Live",loading:"Wird geladen…",refreshedSeconds:"vor {n} s aktualisiert",refreshedMinutes:"vor {n} Min. aktualisiert"},errors:{restartHa:"Starten Sie Home Assistant neu, um die Aktualisierung von Spatial Context abzuschließen.",needsAdmin:"Diese Karte benötigt ein Home-Assistant-Administratorkonto.",bluetoothVersion:"Die Bluetooth-Karte benötigt Home Assistant 2025.2 oder neuer.",zigbeeFailed:"Zigbee-Mesh-Anfrage fehlgeschlagen",wifiFailed:"WLAN-Mesh-Anfrage fehlgeschlagen",matterFailed:"Matter-Topologie-Abonnement fehlgeschlagen",bluetoothFailed:"Bluetooth-Abonnement fehlgeschlagen",floorSave:"Diese Etage konnte nicht gespeichert werden – Sie bleiben hier, damit nichts verloren geht.",propertySave:"Die Anwesen-Ansicht konnte nicht gespeichert werden – öffnen Sie den Tab „Anwesen“ erneut.",saveFailed:"Speichern fehlgeschlagen: {error} Deine Änderungen sind noch da — lass diesen Tab geöffnet.",retry:"Erneut versuchen",bgType:"Das Hintergrundbild muss eine PNG-, JPEG- oder GIF-Datei sein.",bgUpload:"Hochladen des Hintergrundbilds fehlgeschlagen: {error}"},dialog:{ok:"OK",cancel:"Abbrechen",delete:"Löschen",remove:"Entfernen",discard:"Verwerfen",reset:"Zurücksetzen",apply:"Anwenden"},confirm:{removeOutdoorPin:'"{name}" vom Anwesen entfernen?',discardFloor:"Nicht gespeicherte Änderungen an dieser Etage verwerfen?",discardProperty:"Nicht gespeicherte Änderungen an der Anwesen-Ansicht verwerfen?",removeOutdoorOne:"Das Außengerät vom Anwesen entfernen?",removeOutdoorMany:"Alle {count} Außengeräte vom Anwesen entfernen?",removeFloorOne:"Das platzierte Gerät von dieser Etage entfernen?",removeFloorMany:"Alle {count} platzierten Geräte von dieser Etage entfernen?",deletePlacement:"Die Platzierung „{label}“ löschen?",resetProperty:"Anwesen-Ansicht zurücksetzen? Dadurch werden alle Gebäudeplatzierungen, alle Außengeräte und das Hintergrundfoto entfernt. Nichts ist endgültig, bis Sie anschließend auf Speichern klicken.",resetFloor:"„{floor}“ zurücksetzen? Dadurch werden alle Räume, Wände, Öffnungen, platzierten Geräte und das Hintergrundbild dieser Etage entfernt. Nichts ist endgültig, bis Sie anschließend auf Speichern klicken.",applyAlignment:"Diese Ausrichtung auf „{floor}“ anwenden? Dadurch werden alle Räume, Wände, Türen/Fenster und Gerätepositionen dieser Etage – sowie die Platzierung ihres Hintergrundbilds und, falls gesetzt, ihre Maßstabskalibrierung – an das Koordinatensystem dieser Etage angepasst. Dies wird sofort gespeichert und kann nicht rückgängig gemacht werden.",deleteWall:"Diese Wand löschen? Türen/Fenster darin werden ebenfalls entfernt.",deleteRoom:"Raum „{name}“ löschen?",deletePin:"{name} von dieser Etage entfernen?",deleteDoor:"Diese Tür löschen?",deleteWindow:"Dieses Fenster löschen?",removeFromSpot:"{name} von dieser Stelle entfernen?"},prompt:{distance:"Tatsächlicher Abstand zwischen diesen beiden Punkten in {unit}:"},units:{feet:"Fuß",metres:"Metern"},floor:{thisFloor:"diese Etage",thatFloor:"jene Etage"},property:{setIcon:"Symbol festlegen",removeFromProperty:"Vom Anwesen entfernen",goToFloorOf:"Zur Etage von {name}",select:"Auswählen",placeOutdoor:"Außengerät platzieren",placeBuildingTip:"Grundriss eines Gebäudes platzieren",placeBuilding:"Gebäude platzieren…",notCalibrated:"Nicht kalibriert",goToFloor:"Zur Etage",deletePlacement:"Platzierung löschen",outdoorDevice:"Außengerät",building:"Gebäude",link:"Verbindung",calibrateHint:"Legen Sie auf einer Etage den Maßstab fest und platzieren Sie dann das Gebäude hier"},canvasControls:{zoomIn:"Vergrößern",zoomOut:"Verkleinern",fit:"An Bildschirm anpassen"},materials:{timber_frame:"Holzständerwand (Trockenbau)",brick_veneer:"Ziegelverblendung",concrete_block:"Beton / Stein",aerated_concrete_block:"Porenbeton / Schaumbeton (verputzt)",ceramic_poroton_block:"Keramik- / Poroton-Stein",glass:"Glas",steel_frame:"Stahlrahmen"},colors:{primary:"Primär",accent:"Akzent",red:"Rot",pink:"Pink",purple:"Lila",deep_purple:"Dunkellila",indigo:"Indigo",blue:"Blau",light_blue:"Hellblau",cyan:"Cyan",teal:"Petrol",green:"Grün",light_green:"Hellgrün",lime:"Limette",yellow:"Gelb",amber:"Bernstein",orange:"Orange",deep_orange:"Dunkelorange",brown:"Braun",light_grey:"Hellgrau",grey:"Grau",dark_grey:"Dunkelgrau",blue_grey:"Blaugrau",black:"Schwarz",white:"Weiß"}}};function $e(e,t){let i=e;for(const e of t.split(".")){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function Pe(e,t){let i=$e(xe.en,e)??$e(xe.en,e)??e;if(t)for(const[e,o]of Object.entries(t))i=i.split(`{${e}}`).join(String(o));return i}class Ie{constructor(e,t){this._host=e,this._client=t,this.networkType=null,this.zigbeeMesh=null,this.zigbeeLoading=!1,this.zigbeeError=null,this.zigbeeFetchedAt=null,this.zigbeeElapsedSeconds=0,this._zigbeeTimer=null,this._zigbeeShowAll=!1,this.wifiMesh=null,this.wifiLoading=!1,this.wifiError=null,this.matterTopology=null,this.matterError=null,this._matterUnsubscribe=null,this.bluetoothAdverts=new Map,this.bluetoothDevices={},this.bluetoothError=null,this._bluetoothBuffer=new Map,this._bluetoothFlushTimer=null,this._bluetoothUnsubscribe=null,e.addController(this)}hostDisconnected(){this._unsubscribeMatter(),this._unsubscribeBluetooth(),null!==this._zigbeeTimer&&(window.clearInterval(this._zigbeeTimer),this._zigbeeTimer=null)}get zigbeeShowAllLinks(){return this._zigbeeShowAll}set zigbeeShowAllLinks(e){this._zigbeeShowAll=e,this._host.requestUpdate()}get live(){return"matter"===this.networkType&&null!==this._matterUnsubscribe||"bluetooth"===this.networkType&&null!==this._bluetoothUnsubscribe}get error(){return"zigbee"===this.networkType?this.zigbeeError:"wifi"===this.networkType?this.wifiError:"bluetooth"===this.networkType?this.bluetoothError:this.matterError}select(e){const t=this.networkType===e?null:e;"matter"===this.networkType&&"matter"!==t&&this._unsubscribeMatter(),"bluetooth"===this.networkType&&"bluetooth"!==t&&this._unsubscribeBluetooth(),this.networkType=t,this._host.requestUpdate(),"wifi"===t?this.refreshWifi():"matter"===t?this.subscribeMatter():"bluetooth"===t?this.subscribeBluetooth():"zigbee"===t&&this._loadCachedZigbee()}loadZigbee(){this.refreshZigbee(null!==this.zigbeeFetchedAt)}async _loadCachedZigbee(){try{const e=await this._client().getCachedZigbeeMesh();if(!e?.fetched_at||this.zigbeeLoading)return;const t=1e3*e.fetched_at;if(this.zigbeeFetchedAt&&t<=this.zigbeeFetchedAt)return;this.zigbeeMesh=e,this.zigbeeFetchedAt=t,this._host.requestUpdate()}catch{}}async refreshZigbee(e=!1){this.zigbeeLoading=!0,this.zigbeeError=null;const t=Date.now();this.zigbeeElapsedSeconds=0,this._host.requestUpdate(),this._zigbeeTimer=window.setInterval(()=>{this.zigbeeElapsedSeconds=Math.round((Date.now()-t)/1e3),this._host.requestUpdate()},1e3);try{this.zigbeeMesh=await this._client().getZigbeeMesh(e),ke.log("mesh_load",{network:"zigbee",force_refresh:e,ms:Date.now()-t,links:this.zigbeeMesh.links.length,nodes:this.zigbeeMesh.nodes.length}),this.zigbeeFetchedAt=this.zigbeeMesh.fetched_at?1e3*this.zigbeeMesh.fetched_at:Date.now()}catch(e){const t=Se(e,Pe("errors.zigbeeFailed"));this.zigbeeError=t,ke.log("mesh_error",{network:"zigbee",error:t})}finally{this.zigbeeLoading=!1,null!==this._zigbeeTimer&&(window.clearInterval(this._zigbeeTimer),this._zigbeeTimer=null),this._host.requestUpdate()}}async refreshWifi(){this.wifiLoading=!0,this.wifiError=null,this._host.requestUpdate();try{this.wifiMesh=await this._client().getWifiMesh(),ke.log("mesh_load",{network:"wifi",links:this.wifiMesh.links.length})}catch(e){const t=Se(e,Pe("errors.wifiFailed"));this.wifiError=t,ke.log("mesh_error",{network:"wifi",error:t})}finally{this.wifiLoading=!1,this._host.requestUpdate()}}async subscribeMatter(){this._unsubscribeMatter(),this.matterError=null,this._host.requestUpdate();try{this._matterUnsubscribe=await this._client().subscribeMatterTopology(e=>{this.matterTopology=e,this._host.requestUpdate()})}catch(e){this.matterError=Se(e,Pe("errors.matterFailed"))}this._host.requestUpdate()}_unsubscribeMatter(){this._matterUnsubscribe?.(),this._matterUnsubscribe=null}async subscribeBluetooth(){this._unsubscribeBluetooth(),this.bluetoothError=null,this._bluetoothBuffer=new Map,this.bluetoothAdverts=new Map,this._host.requestUpdate();let e=!1;try{this.bluetoothDevices=(await this._client().getBluetoothDevices()).devices,this._host.requestUpdate(),e=!0,this._bluetoothUnsubscribe=await this._client().subscribeBluetoothAdvertisements(e=>{for(const t of e.add??[])this._bluetoothBuffer.set(t.address,{address:t.address,source:t.source,rssi:t.rssi,name:t.name});for(const{address:t}of e.remove??[])this._bluetoothBuffer.delete(t);this._bluetoothFlushTimer??(this._bluetoothFlushTimer=window.setTimeout(()=>{this._bluetoothFlushTimer=null,this.bluetoothAdverts=new Map(this._bluetoothBuffer),this._host.requestUpdate()},2e3))}),window.setTimeout(()=>{this.bluetoothAdverts=new Map(this._bluetoothBuffer),this._host.requestUpdate(),ke.log("mesh_load",{network:"bluetooth",adverts:this._bluetoothBuffer.size,known_addresses:Object.keys(this.bluetoothDevices).length})},300)}catch(t){this.bluetoothError=e&&"unknown_command"===t?.code?Pe("errors.bluetoothVersion"):Se(t,Pe("errors.bluetoothFailed")),ke.log("mesh_error",{network:"bluetooth",error:this.bluetoothError}),this._host.requestUpdate()}}_unsubscribeBluetooth(){this._bluetoothUnsubscribe?.(),this._bluetoothUnsubscribe=null,null!==this._bluetoothFlushTimer&&(window.clearTimeout(this._bluetoothFlushTimer),this._bluetoothFlushTimer=null)}}function Se(e,t){const{code:i,message:o}=e??{};return"unknown_command"===i?Pe("errors.restartHa"):"unauthorized"===i?Pe("errors.needsAdmin"):o||t}function Me(e,t,i){const o=e.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y||e.width<=0||e.height<=0)return null;const n=e.rotation_deg*Math.PI/180,s=Math.cos(n),r=Math.sin(n),a=t-e.x,l=i-e.y,c=-r*a+s*l;return{x:((s*a+r*l)/e.width+.5)*(o.max_x-o.min_x)+o.min_x,y:(c/e.height+.5)*(o.max_y-o.min_y)+o.min_y}}function Ce(e,t){const i=[];for(const o of t){if(e.some(e=>e.floor_id===o.floor_id)){i.push(o);continue}const t=null!==o.building_id?e.find(e=>e.building_id===o.building_id):void 0;t&&i.push({...o,floor_id:t.floor_id})}return i}function Le(e,t,i){const o=e.find(e=>e.floor_id===i);return o?t.placements.find(e=>null!==o.building_id?e.building_id===o.building_id:e.floor_id===i)??null:null}function Te(e){const t=e.map(e=>e.content_bounds).filter(e=>null!==e);return 0===t.length?null:{min_x:Math.min(...t.map(e=>e.min_x)),min_y:Math.min(...t.map(e=>e.min_y)),max_x:Math.max(...t.map(e=>e.max_x)),max_y:Math.max(...t.map(e=>e.max_y))}}function Ee(e){const t=Te(e),i=t?t.max_x-t.min_x:0,o=t?t.max_y-t.min_y:0;return i>0&&o>0?i/o:1.375}function Oe(e,t){const i=e.find(e=>e.floor_id===t.floor_id);if(i?.meters_per_unit)return i.meters_per_unit;if(null===t.building_id)return null;const o=e.find(e=>e.building_id===t.building_id&&e.meters_per_unit);return o?.meters_per_unit??null}function Be(e){switch(e){case"strong":return"#2e7d32";case"medium":return"#f9a825";case"weak":return"#c62828";default:return"#607d8b"}}function Ae(e){return e>=150?"strong":e>=80?"medium":"weak"}function ze(e){return e>=-70?"strong":e>=-85?"medium":"weak"}function Re(e){return e>=-50?"strong":e>=-70?"medium":"weak"}class Fe{constructor(e=[],t=(e,t)=>e<t?-1:e>t?1:0){if(this.data=e,this.length=this.data.length,this.compare=t,this.length>0)for(let e=(this.length>>1)-1;e>=0;e--)this._down(e)}push(e){this.data.push(e),this._up(this.length++)}pop(){if(0===this.length)return;const e=this.data[0],t=this.data.pop();return--this.length>0&&(this.data[0]=t,this._down(0)),e}peek(){return this.data[0]}_up(e){const{data:t,compare:i}=this,o=t[e];for(;e>0;){const n=e-1>>1,s=t[n];if(i(o,s)>=0)break;t[e]=s,e=n}t[e]=o}_down(e){const{data:t,compare:i}=this,o=this.length>>1,n=t[e];for(;e<o;){let o=1+(e<<1);const s=o+1;if(s<this.length&&i(t[s],t[o])<0&&(o=s),i(t[o],n)>=0)break;t[e]=t[o],e=o}t[e]=n}}function De(e,t=1,i=!1){let o=1/0,n=1/0,s=-1/0,r=-1/0;for(const[t,i]of e[0])t<o&&(o=t),i<n&&(n=i),t>s&&(s=t),i>r&&(r=i);const a=s-o,l=r-n,c=Math.max(t,Math.min(a,l));if(c===t){const e=[o,n];return e.distance=0,e}let d=0;for(const t of e)d+=t.length;const h=new Float64Array(2*d),p=[];let u=0;for(const t of e){for(let e=0;e<t.length;e++)h[u++]=t[e][0],h[u++]=t[e][1];p.push(u)}const g=function(e,t){const i=64;let o=0,n=0;for(let e=0;e<t.length;e++)o+=Math.ceil((t[e]-n)/i),n=t[e];const s=new Float64Array(4*o);let r=0;n=0;for(let o=0;o<t.length;o++){const a=t[o];for(let t=n;t<a;t+=i,r+=4){const o=t+i<a?t+i:a,l=t===n?a-2:t-2;let c=e[l],d=e[l+1],h=c,p=d;for(let i=t;i<o;i+=2){const t=e[i],o=e[i+1];t<c?c=t:t>h&&(h=t),o<d?d=o:o>p&&(p=o)}s[r]=c,s[r+1]=d,s[r+2]=h,s[r+3]=p}n=a}return s}(h,p),_=new Fe([],(e,t)=>t.max-e.max);let m=function(e,t,i){let o=0,n=0,s=0;const r=t[0];for(let t=0,i=r-2;t<r;i=t,t+=2){const r=e[t],a=e[t+1],l=e[i],c=e[i+1],d=r*c-l*a;n+=(r+l)*d,s+=(a+c)*d,o+=3*d}const a=new He(n/o,s/o,0,e,t,i,-1/0,null);return 0===o||a.d<0?new He(e[0],e[1],0,e,t,i,-1/0,null):a}(h,p,g);const v=new He(o+a/2,n+l/2,0,h,p,g,-1/0,null);v.d>m.d&&(m=v);let y=2;function f(e,o,n,s){const r=m.d-Math.max(0,n*Math.SQRT2-t),a=new He(e,o,n,h,p,g,r,s);y++,a.max>m.d+t&&_.push(a),a.d>m.d&&(m=a,i&&console.log(`found best ${Math.round(1e4*a.d)/1e4} after ${y} probes`))}let b=c/2;for(let e=o;e<s;e+=c)for(let t=n;t<r;t+=c)f(e+b,t+b,b,null);for(;_.length;){const e=_.pop();if(e.max-m.d<=t)break;b=e.h/2,f(e.x-b,e.y-b,b,e),f(e.x+b,e.y-b,b,e),f(e.x-b,e.y+b,b,e),f(e.x+b,e.y+b,b,e)}i&&console.log(`num probes: ${y}\nbest distance: ${m.d}`);const w=[m.x,m.y];return w.distance=m.d,w}function He(e,t,i,o,n,s,r,a){this.x=e,this.y=t,this.h=i,this.nsx1=0,this.nsy1=0,this.nsx2=0,this.nsy2=0,this.d=function(e,t,i,o,n,s){const r=e.x,a=e.y;let l=!1,c=1/0;const d=n>0?n*n:-1;if(null!==s&&(e.nsx1=s.nsx1,e.nsy1=s.nsy1,e.nsx2=s.nsx2,e.nsy2=s.nsy2,c=We(r,a,s.nsx1,s.nsy1,s.nsx2,s.nsy2),c<=d))return n;const h=64,p=i.length;let u=0,g=0;for(let s=0;s<p;s++){const p=i[s];let _=t[p-2],m=t[p-1];for(let i=g;i<p;i+=h,u+=4){let s=i+h;s>p&&(s=p);const g=o[u],v=o[u+1],y=o[u+2],f=o[u+3],b=r<g?g-r:r>y?r-y:0,w=a<v?v-a:a>f?a-f:0,k=b*b+w*w>=c,x=a<v||a>=f||r>y;if(k&&x)_=t[s-2],m=t[s-1];else for(let o=i;o<s;o+=2){const i=t[o],s=t[o+1];if(!x&&s>a!=m>a&&r<(_-i)*(a-s)/(m-s)+i&&(l=!l),!k){const t=We(r,a,i,s,_,m);if(t<c&&(c=t,e.nsx1=i,e.nsy1=s,e.nsx2=_,e.nsy2=m,c<=d))return n}_=i,m=s}}g=p}return 0===c?0:(l?1:-1)*Math.sqrt(c)}(this,o,n,s,r,a),this.max=this.d+i*Math.SQRT2}function We(e,t,i,o,n,s){let r=n-i,a=s-o;if(0!==r||0!==a){const l=((e-i)*r+(t-o)*a)/(r*r+a*a);l>1?(i=n,o=s):l>0&&(i+=r*l,o+=a*l)}return r=e-i,a=t-o,r*r+a*a}function Ue(e,t,i,o){return Math.hypot(i-e,o-t)}function Ne(e,t,i){return Math.min(i,Math.max(t,e))}function Ve(e,t,i){let o=!1;for(let n=0,s=i.length-1;n<i.length;s=n++){const r=i[n],a=i[s],[l,c]=r,[d,h]=a;c>t!=h>t&&e<(d-l)*(t-c)/(h-c)+l&&(o=!o)}return o}function qe(e,t,i){for(const o of i)if(o.points.length>=3&&Ve(e,t,o.points))return o.id;return null}function Ge(e,t){let i=!1;const o=t.map(t=>{const o=qe(t.x,t.y,e);return o===t.room_id?t:(i=!0,{...t,room_id:o})});return i?o:t}const Ke=new WeakMap;function Ye(e,t,i,o,n,s){const r=n-i,a=s-o,l=r*r+a*a;if(0===l)return Ue(e,t,i,o);let c=((e-i)*r+(t-o)*a)/l;return c=Ne(c,0,1),Ue(e,t,i+c*r,o+c*a)}function je(e,t,i){let o=1/0;for(let n=0;n<i.length-1;n++){const[s,r]=i[n],[a,l]=i[n+1];o=Math.min(o,Ye(e,t,s,r,a,l))}return o}function Xe(e){const t=[];for(let i=0;i<e.length;i++){const o=e[i],n=e[(i+1)%e.length];t.push([(o[0]+n[0])/2,(o[1]+n[1])/2])}return t}function Ze(e){const t=[];for(let i=0;i<e.length-1;i++){const o=e[i],n=e[i+1];t.push([(o[0]+n[0])/2,(o[1]+n[1])/2])}return t}function Je(e,t,i){let o={point:e[0],segmentIndex:0,dist:1/0};for(let n=0;n<e.length-1;n++){const[s,r]=e[n],[a,l]=e[n+1],c=a-s,d=l-r,h=c*c+d*d;let p=0===h?0:((t-s)*c+(i-r)*d)/h;p=Ne(p,0,1);const u=[s+p*c,r+p*d],g=Ue(t,i,u[0],u[1]);g<o.dist&&(o={point:u,segmentIndex:n,dist:g})}return{point:o.point,segmentIndex:o.segmentIndex}}function Qe(e,t,i){return 0===e.length?{point:[t,i],segmentIndex:0}:Je([...e,e[0]],t,i)}function et(e,t,i){const[o,n]=e,[s,r]=t,a=Math.abs(s-o),l=Math.abs(r-n);return a>i&&l>i?t:a<=l?[o,r]:[s,n]}function tt(e,t,i,o){if(o.length<2)return null;const{segmentIndex:n}=Je(o,e,t),[s,r]=function(e,t){const[i,o]=e[t],[n,s]=e[t+1]??e[t],r=Ue(i,o,n,s)||1;return[(n-i)/r,(s-o)/r]}(o,n),a=i/2;return[[e-s*a,t-r*a],[e+s*a,t+r*a]]}function it(e){const t=e.getRootNode();let i=document.activeElement;for(;i?.shadowRoot?.activeElement;)i=i.shadowRoot.activeElement;if(!(i instanceof HTMLElement))return;let o=i.getRootNode();for(;o&&o!==t;)o=o instanceof ShadowRoot?o.host.getRootNode():null;o===t&&i.blur()}function ot(e){if(0!==e.deltaMode)return!0;const t=e.wheelDeltaY;return 0===e.deltaX&&!!t&&Math.abs(t)>=120&&t%120==0}function nt(e,t){return t.label_override?t.label_override:be(t.device_id,e.entityLookup.values())}function st(e){if(null===e.networkType)return[];if("zigbee"===e.networkType&&e.zigbeeMesh){const t=t=>e.pinByDeviceId.has(t)?e.currentFloorId??void 0:e.outdoorPinByDeviceId.has(t)?ve:e.otherFloorPinsByDeviceId.get(t)?.floorId;return function(e,t,i){const o=e.links.filter(e=>e.source_device_id&&e.target_device_id&&void 0!==t(e.source_device_id)&&void 0!==t(e.target_device_id));if(i)return o;const n=e.nodes.find(e=>"Coordinator"===e.type)?.ieee,s=new Set,r=new Map,a=new Map;for(const e of o){e.parent_child&&s.add(e),(e.source_ieee===n||e.target_ieee===n)&&e.lqi>=50&&s.add(e);const i=t(e.source_device_id)!==t(e.target_device_id)?a:r;for(const t of[e.source_ieee,e.target_ieee]){const o=i.get(t);(!o||e.lqi>o.lqi)&&i.set(t,e)}}for(const e of r.values())s.add(e);for(const e of a.values())s.add(e);return[...s]}(function(e,t){const i=e.nodes.find(e=>"Coordinator"===e.type)?.ieee;return t&&i?{...e,nodes:e.nodes.map(e=>e.ieee===i?{...e,device_id:t}:e),links:e.links.map(e=>({...e,source_device_id:e.source_ieee===i?t:e.source_device_id,target_device_id:e.target_ieee===i?t:e.target_device_id}))}:e}(e.zigbeeMesh,e.settings.zigbee_coordinator_device_id),t,e.zigbeeShowAllLinks).map(e=>0===e.lqi_readings.length?{sourceDeviceId:e.source_device_id,targetDeviceId:e.target_device_id,quality:"unknown"}:{sourceDeviceId:e.source_device_id,targetDeviceId:e.target_device_id,quality:Ae(e.lqi),value:e.lqi,detail:e.lqi_readings.every(t=>t===e.lqi)?`LQI ${e.lqi}`:`LQI ${e.lqi} (raw ${e.lqi_readings.join(" / ")})`})}if("wifi"===e.networkType&&e.wifiMesh)return e.wifiMesh.links.map(e=>({sourceDeviceId:e.source_device_id,targetDeviceId:e.target_device_id,quality:null!=e.rssi_dbm?Re(e.rssi_dbm):"unknown",...null!=e.rssi_dbm?{detail:`${e.rssi_dbm} dBm`,value:e.rssi_dbm}:{}}));if("bluetooth"===e.networkType){const t=[];for(const i of e.bluetoothAdverts.values()){const o=e.bluetoothDevices[i.address]??[],n=e.bluetoothDevices[i.source]??[];for(const e of o)for(const o of n)e!==o&&t.push({sourceDeviceId:e,targetDeviceId:o,quality:null!=i.rssi?ze(i.rssi):"unknown",...null!=i.rssi?{detail:`RSSI ${i.rssi} dBm`,value:i.rssi}:{}})}return t}if("matter"===e.networkType&&e.matterTopology){const t=new Map;for(const i of e.matterTopology.nodes){const o=i.ha_device_id??("border_router"===i.kind?e.settings.thread_border_router_device_id:null);o&&t.set(i.id,o)}const i=[];for(const o of e.matterTopology.connections){const e=t.get(o.source),n=t.get(o.target);e&&n&&i.push({sourceDeviceId:e,targetDeviceId:n,quality:o.strength,detail:o.strength})}return i}return[]}function rt(e,t){const i=e.outdoorPinByDeviceId.get(t);if(i)return{deviceId:t,x:i.x,y:i.y,label:nt(e,i),floorId:null};const o=e.pinByDeviceId.get(t),n=o?{pin:o,floorId:e.currentFloorId}:e.otherFloorPinsByDeviceId.get(t);if(!n?.floorId)return null;const s=Le(e.floors,e.propertyLayout,n.floorId),r=s?function(e,t,i){const o=e.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y)return null;const n=((t-o.min_x)/(o.max_x-o.min_x)-.5)*e.width,s=((i-o.min_y)/(o.max_y-o.min_y)-.5)*e.height,r=e.rotation_deg*Math.PI/180,a=Math.cos(r),l=Math.sin(r);return{x:e.x+a*n-l*s,y:e.y+l*n+a*s}}(s,n.pin.x,n.pin.y):null;return r?{deviceId:t,...r,label:nt(e,n.pin),floorId:n.floorId}:null}function at(e){const t=e.outdoorPinByDeviceId,i=[];for(const o of st(e)){if(!t.has(o.sourceDeviceId)&&!t.has(o.targetDeviceId))continue;const n=rt(e,o.sourceDeviceId),s=rt(e,o.targetDeviceId);n&&s&&i.push({key:`${o.sourceDeviceId}|${o.targetDeviceId}`,from:n,to:s,quality:o.quality,...o.detail?{detail:o.detail}:{},...void 0!==o.value?{value:o.value}:{}})}return i}function lt(e){const t=[];for(const i of st(e)){const o=e.pinByDeviceId.get(i.sourceDeviceId),n=e.pinByDeviceId.get(i.targetDeviceId);o&&n&&t.push({fromPin:o,toPin:n,quality:i.quality,...i.detail?{detail:i.detail}:{},...void 0!==i.value?{value:i.value}:{}})}return t}function ct(e,t,i){if(!e.currentFloorId)return null;const o=Le(e.floors,e.propertyLayout,e.currentFloorId),n=Le(e.floors,e.propertyLayout,i);if(!o||!n)return null;const s=function(e){const t=[];for(const i of e.rooms)t.push(...i.points);for(const i of e.walls)t.push(...i.points);if(0===t.length)return null;const i=t.map(([e])=>e),o=t.map(([,e])=>e),n=Math.min(...i),s=Math.max(...i),r=Math.min(...o),a=Math.max(...o),l=.05*Math.max(s-n,a-r)||20;return{minX:n-l,minY:r-l,maxX:s+l,maxY:a+l}}(e.layout);if(!s)return null;const r=Math.atan2(n.y-o.y,n.x-o.x)-o.rotation_deg*Math.PI/180;return function(e,t,i,o,n){const s=i>0?(n.maxX-e)/i:i<0?(n.minX-e)/i:1/0,r=o>0?(n.maxY-t)/o:o<0?(n.minY-t)/o:1/0,a=Math.min(s,r);return!isFinite(a)||a<=0?null:{x:e+i*a,y:t+o*a}}(t.x,t.y,Math.cos(r),Math.sin(r),s)}function dt(e){if(!e.currentFloorId)return[];const t=e.floors.find(t=>t.floor_id===e.currentFloorId),i=[];for(const o of st(e)){const n=e.pinByDeviceId.has(o.sourceDeviceId);if(n===e.pinByDeviceId.has(o.targetDeviceId))continue;const s=e.pinByDeviceId.get(n?o.sourceDeviceId:o.targetDeviceId),r=n?o.targetDeviceId:o.sourceDeviceId,a=e.outdoorPinByDeviceId.get(r);if(a){const t=Le(e.floors,e.propertyLayout,e.currentFloorId),n=t?Me(t,a.x,a.y):null;if(!n)continue;i.push({fromPin:s,x:n.x,y:n.y,targetDeviceId:r,targetFloorId:ve,targetFloorName:"Outside",targetLabel:nt(e,a),quality:o.quality,...o.detail?{detail:o.detail}:{},...void 0!==o.value?{value:o.value}:{}});continue}const l=e.otherFloorPinsByDeviceId.get(r);if(!l||l.floorId===e.currentFloorId)continue;const c=e.floors.find(e=>e.floor_id===l.floorId),d=l.pin.label_override??be(l.pin.device_id,e.entityLookup.values()),h=null!==t?.building_id&&t?.building_id===c?.building_id?{x:l.pin.x,y:l.pin.y}:ct(e,s,l.floorId);h&&i.push({fromPin:s,x:h.x,y:h.y,targetDeviceId:r,targetFloorId:l.floorId,targetFloorName:c?.name??l.floorId,targetLabel:d,quality:o.quality,...o.detail?{detail:o.detail}:{},...void 0!==o.value?{value:o.value}:{}})}return i}const ht={zigbee:"lqi",wifi:"dbm",bluetooth:"dbm"};function pt(e,t){const i=ht[e],o=t.map(e=>e.value).filter(e=>void 0!==e);if(!i||0===o.length)return null;const n=Math.min(...o),s=Math.max(...o);return n<s?{min:n,max:s,unit:i}:null}const ut=[{id:"timber_frame",label:"Timber framed (drywall)",color:"#212121",attenuationDbPerCm:.3,defaultThicknessCm:10},{id:"brick_veneer",label:"Brick veneer",color:"#3e2723",attenuationDbPerCm:.55,defaultThicknessCm:11},{id:"concrete_block",label:"Concrete / block",color:"#000000",attenuationDbPerCm:.6,defaultThicknessCm:20},{id:"aerated_concrete_block",label:"Aerated/foam concrete block (plastered)",color:"#757575",attenuationDbPerCm:.37,defaultThicknessCm:13},{id:"ceramic_poroton_block",label:"Ceramic / Poroton block",color:"#8d6e63",attenuationDbPerCm:.42,defaultThicknessCm:25},{id:"glass",label:"Glass",color:"#37474f",attenuationDbPerCm:2,defaultThicknessCm:1},{id:"steel_frame",label:"Steel frame",color:"#263238",attenuationDbPerCm:1,defaultThicknessCm:10}];function gt(e){const t=`materials.${e.id}`,i=Pe(t);return i===t?e.label:i}function _t(e){return ut.find(t=>t.id===e)??ut[0]}function mt(e){return e.thickness_cm??_t(e.material).defaultThicknessCm}class vt{constructor(e){this.hass=e}async listFloors(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_floors"})).floors}async getLayout(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_layout",floor_id:e})}async saveLayout(e,t){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_layout",floor_id:e,background_image_id:t.background_image_id,background_opacity:t.background_opacity,background_offset_x:t.background_offset_x,background_offset_y:t.background_offset_y,background_scale:t.background_scale,building_id:t.building_id,view_box:t.view_box,rooms:t.rooms,pins:t.pins,walls:t.walls,openings:t.openings,scale:t.scale})}async setBuildingId(e,t){return this.hass.connection.sendMessagePromise({type:"spatial_context/set_building_id",floor_id:e,building_id:t})}async getPropertyLayout(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_property_layout"})}async savePropertyLayout(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_property_layout",background_image_id:e.background_image_id,background_opacity:e.background_opacity,background_offset_x:e.background_offset_x,background_offset_y:e.background_offset_y,background_scale:e.background_scale,view_box:e.view_box,placements:e.placements,pins:e.pins,...void 0!==e.map_background?{map_background:e.map_background}:{}})}async getSettings(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_settings"})}async saveSettings(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_settings",unit_system:e.unit_system,zigbee_timeout_seconds:e.zigbee_timeout_seconds,floor_order:e.floor_order,zigbee_coordinator_device_id:e.zigbee_coordinator_device_id,thread_border_router_device_id:e.thread_border_router_device_id,auto_save:e.auto_save,debug_logging:e.debug_logging})}async getVersionInfo(){return this.hass.connection.sendMessagePromise({type:"spatial_context/version"})}async sendDebugLog(e){await this.hass.connection.sendMessagePromise({type:"spatial_context/debug_log",entries:e})}async getDebugReport(){return this.hass.connection.sendMessagePromise({type:"spatial_context/debug_report"})}async listAreas(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_areas"})).areas}async listPlaceableEntities(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_placeable_entities"})).entities}async exportSnapshot(){return this.hass.connection.sendMessagePromise({type:"spatial_context/export_snapshot"})}async getZigbeeMesh(e=!1){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",force_refresh:e})}async getCachedZigbeeMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",cache_only:!0})}async getWifiMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_wifi_mesh"})}async subscribeMatterTopology(e){return this.hass.connection.subscribeMessage(e,{type:"matter/subscribe_network_topology"})}async subscribeBluetoothAdvertisements(e){return this.hass.connection.subscribeMessage(e,{type:"bluetooth/subscribe_advertisements"})}async getBluetoothDevices(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_bluetooth_devices"})}async uploadBackgroundImage(e){const t=new FormData;t.append("file",e);const i=await this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:t});if(!i.ok)throw new Error(`Image upload failed: ${i.status} ${i.statusText}`);return(await i.json()).id}}function yt(e){return e?`/api/image/serve/${e}/original`:null}function ft(e){return`${e}-${function(){if("undefined"!=typeof crypto&&crypto.randomUUID)return crypto.randomUUID();if("undefined"!=typeof crypto&&crypto.getRandomValues){const e=crypto.getRandomValues(new Uint8Array(16));e[6]=15&e[6]|64,e[8]=63&e[8]|128;const t=Array.from(e,e=>e.toString(16).padStart(2,"0")).join("");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})}()}`}function bt(e,t,i,o){return{id:ft("pin"),device_id:e,x:t,y:i,room_id:o,icon_override:null,label_override:null,height_m:null}}function wt(e,t="timber_frame"){return{id:ft("wall"),material:t,thickness_cm:_t(t).defaultThicknessCm,points:e}}const kt=.3048;function xt(e){return Math.round(100*e)/100}function $t(e){return"imperial"===e?"ft":"m"}function Pt(e,t){return String(xt("imperial"===t?e/kt:e))}function It(e,t){const i=Number(e);return Number.isFinite(i)?"imperial"===t?i*kt:i:null}const St={cm:1,m:100,in:2.54,ft:30.48};function Mt(e){return"imperial"===e?"in":"cm"}function Ct(e,t){return String(xt(e/St[t]))}function Lt(e,t){const i=Number(e);return Number.isFinite(i)?i*St[t]:null}function Tt(e,t,i){return Ct(e/t*100,i)}const Et=r`
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
    /* Type scale. */
    --sc-fs-caption: var(
      --ha-font-size-s,
      12px
    ); /* section titles, map notes */
    --sc-fs-small: var(
      --ha-font-size-s,
      12px
    ); /* hints, secondary text, chips */
    --sc-fs-body: var(--ha-font-size-m, 14px); /* buttons, fields, dropdowns */
    --sc-fs-row: var(
      --ha-font-size-m,
      14px
    ); /* list rows, menu items, dialog rows */
    --sc-fs-title: var(--ha-font-size-l, 16px); /* card titles */
    --sc-fs-header: var(--ha-font-size-xl, 20px); /* app bar title */
    --sc-fs-dialog: var(--ha-font-size-2xl, 24px); /* dialog titles */
    /* Shape: controls are 12px rounded rectangles, 40px tall (36px for
     * fields inside cards and dialogs). */
    --sc-r-control: var(--ha-border-radius-lg, 12px);
    /* Hover tint, laid over whatever fill the element already has. */
    --sc-hover: color-mix(in srgb, var(--sc-fg) 8%, transparent);
    --sc-h-control: 40px;
    --sc-h-field: 36px;
    box-sizing: border-box;
    color: var(--sc-fg);
    font-family: var(
      --ha-font-family-body,
      var(--paper-font-body1_-_font-family, Roboto, sans-serif)
    );
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  button {
    font-family: inherit;
    font-size: var(--sc-fs-body);
    font-weight: var(--ha-font-weight-medium, 500);
    cursor: pointer;
    border: none;
    border-radius: var(--sc-r-control);
    padding: 6px var(--ha-space-3, 12px);
    background: transparent;
    color: var(--sc-fg);
  }
  /* Hover adds a tint as a background *image*, so a button that already
   * has a fill (surface, tonal) keeps it instead of losing it. The extra
   * :not()s lift the specificity above components' own background rules. */
  button:hover:not(:disabled):not(.primary) {
    background-image: linear-gradient(var(--sc-hover), var(--sc-hover));
  }
  /* People who ask for less motion get none: no sliding, fading or shaking. */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
  button:focus-visible {
    outline: 2px solid var(--sc-accent);
    outline-offset: 2px;
  }
  button.primary {
    background: var(--sc-accent);
    color: var(--text-primary-color, #fff);
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
    background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
    color: var(--sc-accent);
  }
  /* Filled fields, as in Home Assistant's forms: a grey box with a line
   * under it that thickens in the accent colour on focus. */
  input[type="text"],
  input[type="search"] {
    font-family: inherit;
    font-size: var(--sc-fs-body);
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-3, 12px);
    border: none;
    border-bottom: 1px solid color-mix(in srgb, var(--sc-fg) 60%, transparent);
    border-radius: var(--ha-border-radius-sm, 4px)
      var(--ha-border-radius-sm, 4px) 0 0;
    color: var(--sc-fg);
    background: var(
      --ha-color-form-background,
      color-mix(in srgb, var(--sc-fg) 12%, transparent)
    );
  }
  input[type="text"]:hover,
  input[type="search"]:hover {
    border-bottom-color: var(--sc-fg);
    background: var(
      --ha-color-form-background-hover,
      color-mix(in srgb, var(--sc-fg) 16%, transparent)
    );
  }
  input[type="text"]:focus-visible,
  input[type="search"]:focus-visible {
    outline: none;
    border-bottom: 2px solid var(--sc-accent);
  }
  .floating-panel {
    background: var(--sc-panel-bg);
    border: 1px solid var(--sc-divider);
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
    gap: var(--ha-space-5, 20px);
    width: 100%;
    padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
    border-radius: var(--ha-border-radius-md, 8px);
    font-size: var(--sc-fs-row);
    font-weight: var(--ha-font-weight-normal, 400);
    text-align: start;
    justify-content: flex-start;
  }
  .menu-item ha-icon {
    --mdc-icon-size: 22px;
    color: var(--sc-fg-secondary);
    flex-shrink: 0;
  }
  /* Selected row: the primary colour at low strength (like HA's selected
   * list items) instead of a solid bar. */
  .menu-item.active {
    background: color-mix(in srgb, var(--sc-accent) 16%, transparent);
    color: var(--sc-accent);
  }
  .menu-item.active ha-icon {
    color: var(--sc-accent);
  }
  .menu-item.danger ha-icon {
    color: var(--sc-danger);
  }
`,Ot=r`
  .controls {
    position: absolute;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    display: flex;
    flex-direction: column;
    background: var(--sc-panel-bg);
    border: 1px solid var(--sc-divider);
    box-shadow: var(--sc-panel-shadow);
    border-radius: var(--sc-r-control);
    overflow: hidden;
  }
  .controls button {
    display: grid;
    place-items: center;
    width: 40px;
    height: var(--sc-h-control);
    padding: 0;
    border-radius: 0;
    color: var(--sc-fg);
  }
  .controls button + button {
    border-top: 1px solid var(--sc-divider);
  }
  .controls button:hover {
    background: var(--sc-hover);
  }
  .controls ha-icon {
    --mdc-icon-size: 22px;
  }
  /* Touch screens: clear the browser's bottom bar / home indicator even
   * where the safe-area inset isn't reported. */
  @media (pointer: coarse) {
    .controls {
      bottom: calc(28px + env(safe-area-inset-bottom, 0px));
    }
  }
`,Bt=r`
  .select-wrap {
    position: relative;
    display: inline-flex;
    min-width: 0;
  }
  .select-wrap select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding-inline-end: 30px;
  }
  .select-wrap .chev {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    --mdc-icon-size: 20px;
    color: var(--sc-fg-secondary);
    pointer-events: none;
  }
`,At=r`
  /* HA's (Material 3) switch: a 52x32 pill. Off is an outlined track with
   * a grey knob; on is a primary track with a large white knob. */
  .switch {
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    box-sizing: border-box;
    width: 52px;
    height: 32px;
    margin: 0;
    border: 2px solid color-mix(in srgb, var(--sc-fg) 45%, transparent);
    border-radius: var(--ha-border-radius-xl, 16px);
    background: transparent;
    cursor: pointer;
    transition:
      background var(--ha-animation-duration-fast, 150ms),
      border-color var(--ha-animation-duration-fast, 150ms);
    flex: none;
  }
  .switch::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--sc-fg-secondary);
    transition:
      transform var(--ha-animation-duration-fast, 150ms),
      background var(--ha-animation-duration-fast, 150ms);
  }
  .switch:checked {
    border-color: var(--sc-accent);
    background: var(--sc-accent);
  }
  .switch:checked::before {
    background: var(--text-primary-color, #fff);
    transform: translateX(20px);
  }
  .switch:focus-visible {
    outline: 2px solid var(--sc-accent);
    outline-offset: 2px;
  }
`,zt=r`
  .tool-row {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    padding: 0 var(--ha-space-3, 12px);
    /* HA's second bar is a step darker than the app bar above it. */
    background: var(--primary-background-color, var(--sc-bg));
    border-bottom: 1px solid var(--sc-divider);
    pointer-events: auto;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tool-row::-webkit-scrollbar {
    display: none;
  }
  .tool-row > * {
    flex: none;
  }
  /* HA's controls are rounded rectangles on a surface fill with a thin
   * border — not pills. The tool group is one such container. */
  .tool-row .mode-toolbar {
    position: static;
    display: flex;
    gap: 2px;
    align-items: center;
    padding: 3px;
    border: 1px solid var(--sc-divider);
    border-radius: 14px;
    background: var(--sc-panel-bg);
  }
  .tool-row .hint-bar {
    position: static;
    transform: none;
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    flex: 1 0 auto;
  }
  /* A third bar for mode-specific tools (e.g. lining up the map), laid
   * over the top of the canvas right under the controls row. */
  .tool-row.sub {
    top: 56px;
    z-index: 1;
  }
  .tool-row.sub .hint-bar button.primary {
    margin-inline-start: auto;
  }
  .tool-row .hint-bar input[type="range"] {
    width: 130px;
  }
  .tool-row input[type="number"] {
    width: 76px;
    height: var(--sc-h-control);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    color: var(--sc-fg);
    font: inherit;
    font-size: var(--sc-fs-body);
    -moz-appearance: textfield;
  }
  .tool-row input[type="number"]::-webkit-inner-spin-button,
  .tool-row input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Whatever the row's last items are (Background, undo/redo/save) sit at
   * the right. */
  .tool-row ::slotted([slot="row-end"]) {
    margin-inline-start: auto;
  }
  /* Every field and button in the row is the same 40px:
   * rounded rectangle, surface fill, thin border, HA's dropdown chevron. */
  .tool-row select {
    appearance: none;
    -webkit-appearance: none;
    height: var(--sc-h-control);
    padding: 0 34px 0 14px;
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background-color: var(--sc-panel-bg);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%239b9b9b' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 20px;
    color: var(--sc-fg);
    font: inherit;
    font-size: var(--sc-fs-small);
  }
  .tool-row select:focus {
    outline: none;
    border-color: var(--sc-accent);
  }
  /* The select-wrap variant draws its own chevron icon. */
  .tool-row .select-wrap select {
    background-image: none;
  }
  .tool-row .mode-toolbar select {
    height: 32px;
    border-radius: 10px;
    background-color: transparent;
  }
  .tool-row .hint-bar button {
    height: var(--sc-h-control);
    padding: 0 var(--ha-space-4, 16px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    font-size: var(--sc-fs-small);
  }
  .tool-row .hint-bar button.primary {
    border-color: transparent;
    background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
    color: var(--sc-accent);
  }
`,Rt=r`
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(
      to right,
      var(--sc-accent) var(--pct, 50%),
      var(--sc-divider) var(--pct, 50%)
    );
    outline: none;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--sc-accent);
    border: none;
    cursor: pointer;
  }
  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--sc-accent);
    border: none;
    cursor: pointer;
  }
`,Ft=r`
  .scale-corner {
    position: absolute;
    left: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    pointer-events: none;
  }
  @media (pointer: coarse) {
    .scale-corner {
      bottom: calc(28px + env(safe-area-inset-bottom, 0px));
    }
  }
  .scale-bar {
    display: inline-flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--ha-space-1, 4px) 10px 6px;
    border-radius: var(--ha-border-radius-md, 8px);
    font-size: var(--sc-fs-caption);
    color: var(--sc-fg);
  }
  .scale-bar-line {
    height: 6px;
    border: 2px solid var(--sc-fg);
    border-top: none;
  }
  .scale-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    max-width: min(320px, calc(100vw - 120px));
    padding: 6px var(--ha-space-3, 12px);
    border-radius: var(--sc-r-control);
    font-size: var(--sc-fs-small);
    color: var(--sc-fg-secondary);
    pointer-events: auto;
  }
  button.scale-chip {
    cursor: pointer;
  }
  .scale-chip ha-icon {
    --mdc-icon-size: 16px;
    flex: none;
  }
  .scale-chip .warn {
    color: var(--warning-color, #db8b00);
  }
`;function Dt(e,t,i,o){return e.map(e=>({pin:e,d:Ue(e.x,e.y,t,i)})).filter(({d:e})=>e<=o).sort((e,t)=>e.d-t.d).map(({pin:e})=>e)}function Ht(e,t,i,o){let n=null,s=o;return e.forEach(([e,o],r)=>{const a=Ue(e,o,t,i);a<=s&&(n=r,s=a)}),n}function Wt(e,t,i,o){let n=null,s=o;for(const o of e){const e=je(t,i,o.points);e<=s&&(n=o,s=e)}return n}function Ut(e,t,i,o){if(e.points.length>=3){const[n,s]=e.points[0];if(Ue(n,s,t,i)<=o)return{trace:e,closed:!0}}return{trace:{points:[...e.points,[t,i]]},closed:!1}}const Nt=new Map;function Vt(e){const t=e.trim();if(!t)return Promise.resolve(null);const i=t.includes(":")?t:`mdi:${t}`;let o=Nt.get(i);return o||(o=async function(e){if(!customElements.get("ha-icon"))return null;const t=document.createElement("div");t.style.cssText="position:fixed;left:-10000px;top:0;width:24px;height:24px;overflow:hidden;";const i=document.createElement("ha-icon");i.setAttribute("icon",e),t.appendChild(i),document.body.appendChild(t);try{const e=Date.now()+4e3;for(;Date.now()<e;){const e=i.shadowRoot?.querySelector("ha-svg-icon");if("string"==typeof e?.path&&e.path)return e.path;await new Promise(e=>setTimeout(e,50))}return null}finally{t.remove()}}(i),Nt.set(i,o)),o}const qt=r`
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
`;class Gt{constructor(e){this._host=e,this._resolvedOverrides=new Map,this._failedBrandIcons=new Set}_iconForOverride(e){return this._resolvedOverrides.has(e)?this._resolvedOverrides.get(e)??null:(this._resolvedOverrides.set(e,null),Vt(e).then(t=>{null!==t&&(this._resolvedOverrides.set(e,t),this._host.requestUpdate())}),null)}iconForPin(e,t){if(e.icon_override){const t=this._iconForOverride(e.icon_override);if(t)return{kind:"path",d:t}}const i=function(e,t){return fe(e,t)?.integration_domain??null}(e.device_id,t);return i&&!this._failedBrandIcons.has(i)?{kind:"image",href:`https://brands.home-assistant.io/_/${i}/icon.png`,integrationDomain:i}:{kind:"path",d:"M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z"}}onBrandIconError(e){this._failedBrandIcons.has(e)||(this._failedBrandIcons.add(e),this._host.requestUpdate())}renderMarker(e,t,i,o,n,s,r){const a=1.1*i;return q`
      <g>
        <title>${r}</title>
        <circle
          class="pin-dot ${s?"selected":""}"
          cx=${e}
          cy=${t}
          r=${i}
          style="fill:${s?"":n}"
        ></circle>
        ${"path"===o.kind?q`
              <svg
                x=${e-a/2}
                y=${t-a/2}
                width=${a}
                height=${a}
                viewBox="0 0 24 24"
                class="pin-icon"
              >
                <path d=${o.d}></path>
              </svg>
            `:q`
              <image
                x=${e-a/2}
                y=${t-a/2}
                width=${a}
                height=${a}
                href=${o.href}
                class="pin-brand-icon"
                @error=${()=>this.onBrandIconError(o.integrationDomain)}
              ></image>
            `}
        <circle class="pin-hit" cx=${e} cy=${t} r=${1.4*i}></circle>
      </g>
    `}}const Kt=r`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* A step off the cards' colour, so the floating panels stand out:
     * light grey by day (the plan image stays white, like paper on a
     * desk), a lighter grey than the cards by night (see [dark]). */
    background: color-mix(in srgb, var(--sc-bg) 94%, black);
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
  /* Dark HA theme: the canvas takes the theme's own background and the
   * (usually white) plan image is inverted into light lines on dark —
   * hue-rotate(180deg) keeps any colour in the plan close to its
   * original hue. The Background menu's opacity still applies. */
  :host([dark]) {
    /* A step lighter than the cards, so the floating toolbar and panels
     * (card colour) stand out from the canvas. */
    background: color-mix(in srgb, var(--sc-bg) 88%, white);
  }
  :host([dark]) .bg-overlay img {
    filter: invert(1) hue-rotate(180deg);
  }
  /* Door/window jambs were drawn dark-on-white. */
  :host([dark]) .opening-jamb-case {
    stroke: color-mix(in srgb, var(--sc-bg) 88%, white);
  }
  :host([dark]) .opening-jamb {
    stroke: var(--sc-fg);
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
  /* With one link selected, the rest recede, like hovering a node in
   * HA's own network visualisation. */
  .mesh-link.dim {
    opacity: 0.2;
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
  .marquee {
    fill: var(--sc-accent);
    fill-opacity: 0.12;
    stroke: var(--sc-accent);
    stroke-width: 1.5;
    stroke-dasharray: 6 4;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
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
  ${Ot}
  ${Ft}
`,Yt=1e3,jt=750,Xt=14,Zt="#03a9f4",Jt=.18;let Qt=class extends ce{constructor(){super(...arguments),this.dark=!1,this.rooms=[],this.pins=[],this.walls=[],this.openings=[],this.scale=null,this.unitSystem="metric",this.meshLinks=[],this.meshStubs=[],this.entityLookup=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.5,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.alignOverlay=null,this.initialViewBox=null,this.sameBuildingAsPrevious=!1,this.mode="select",this.snapMode="all",this.armedEntityId=null,this.armedOpeningType=null,this.selectedRoomId=null,this.editingRoomId=null,this.editingWallId=null,this.selectedPinId=null,this.multiPinIds=[],this.selectedWallId=null,this.selectedOpeningId=null,this.selectedMeshLinkKey=null,this.selectedMeshStubKey=null,this._viewBox={x:0,y:0,w:Yt,h:jt},this._naturalHeight=jt,this._alignNaturalHeight=jt,this._pendingTrace=null,this._hoverSnap=null,this._pendingScalePoints=[],this._liveEditPoints=null,this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._gestureCancelled=!1,this._vertexDragStartPoints=null,this._liveGroupMove=null,this._marquee=null,this._downShift=!1,this._liveDragPin=null,this._liveOpeningEdit=null,this._selectedVertexIndex=null,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastImage=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._hasFittedOnce=!1,this._onPointerDown=e=>{if("mouse"===e.pointerType&&0!==e.button)return;if(it(this),this._svg.setPointerCapture(e.pointerId),this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o={x:(t.x+i.x)/2,y:(t.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:Ue(t.x,t.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}if(this._pointers.size>2)return;const t=this._clientToImage(e.clientX,e.clientY);this._downClient={x:e.clientX,y:e.clientY},this._lastImage=t,this._lastClient={x:e.clientX,y:e.clientY},this._moved=!1,this._downShift=e.shiftKey,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(e.clientX,e.clientY,t):{type:"empty"}},this._onPointerMove=e=>{if(!this._pointers.has(e.pointerId)){if("wall"===this.mode||"trace"===this.mode){const t=this._clientToImage(e.clientX,e.clientY);this._hoverSnap=this._snappedGeometryPoint(this._pendingTrace?.points??[],t.x,t.y,e.shiftKey)}else this._hoverSnap&&(this._hoverSnap=null);return}if(this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o=Ue(t.x,t.y,i.x,i.y)||1,n=this._gesture.startDistance/o,s=this._gesture.startViewBox,r=Ne(s.w*n,250,4e3),a=r/s.w,l=s.h*a,{x:c,y:d}=this._gesture.midImage;return void(this._viewBox={x:c-(c-s.x)*a,y:d-(d-s.y)*a,w:r,h:l})}if(1!==this._pointers.size||!this._downClient||!this._lastImage)return;if(this._gestureCancelled)return;if(!this._moved){if(Ue(this._downClient.x,this._downClient.y,e.clientX,e.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"!==this._gesture?.kind&&"alignDrag"!==this._gesture?.kind||(this._svg.style.cursor="grabbing")}const t=this._clientToImage(e.clientX,e.clientY);if("pan"===this._gesture?.kind){const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};this._viewBox={...this._viewBox,x:this._viewBox.x-(e.clientX-i.x)/t,y:this._viewBox.y-(e.clientY-i.y)/t}}else if("alignDrag"===this._gesture?.kind){const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};this.dispatchEvent(new CustomEvent("align-drag",{detail:{dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t}}))}else if("vertex"===this._gesture?.kind&&this._liveEditPoints){const i="room"===this._editingTarget?.kind,[o,n]=this._snappedVertexPoint(this._liveEditPoints,this._gesture.index,t.x,t.y,i,e.shiftKey),s=[...this._liveEditPoints];s[this._gesture.index]=[o,n],this._liveEditPoints=s}else if("pin"===this._gesture?.kind)this._liveDragPin={id:this._gesture.pinId,x:t.x,y:t.y};else if("pinGroup"===this._gesture?.kind)this._liveGroupMove={dx:t.x-this._gesture.startX,dy:t.y-this._gesture.startY};else if("marquee"===this._gesture?.kind)this._marquee={x0:this._gesture.startX,y0:this._gesture.startY,x1:t.x,y1:t.y};else if("roomMove"===this._gesture?.kind){let i=t.x-this._gesture.startX,o=t.y-this._gesture.startY;const n=this._pxToUnits(10);let s={x:null,y:null};if(Math.hypot(i,o)<=n)i=0,o=0;else if(!e.shiftKey){const e=this._snapRoomMove(this._gesture.roomId,i,o,n);i=e.dx,o=e.dy,s=e.guides}this._liveRoomMove={id:this._gesture.roomId,dx:i,dy:o},this._roomMoveGuides=s}else if("roomLabel"===this._gesture?.kind)this._liveRoomLabel={id:this._gesture.roomId,x:t.x,y:t.y};else if("openingMove"===this._gesture?.kind){const e=this._gesture,i=this.openings.find(t=>t.id===e.openingId),o=i&&this.walls.find(e=>e.id===i.wallId);if(i&&o){const e=this._effectivePoints("wall",o.id,o.points),{point:n}=Je(e,t.x,t.y);this._liveOpeningEdit={id:i.id,x:n[0],y:n[1],width:i.width}}}else if("openingHandle"===this._gesture?.kind){const e=this._gesture,i=this.openings.find(t=>t.id===e.openingId),o=i&&this.walls.find(e=>e.id===i.wallId),n=i&&this._openingEndpoints(i);if(i&&o&&n){const s=this._effectivePoints("wall",o.id,o.points),{point:r}=Je(s,t.x,t.y),a=n[0===e.whichEnd?1:0],l=[(a[0]+r[0])/2,(a[1]+r[1])/2],c=Ue(a[0],a[1],r[0],r[1]);this._liveOpeningEdit={id:i.id,x:l[0],y:l[1],width:c}}}this._lastImage=this._clientToImage(e.clientX,e.clientY),this._lastClient={x:e.clientX,y:e.clientY}},this._onPointerLeave=()=>{this._hoverSnap=null},this._onPointerUp=e=>{this._pointers.delete(e.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(e.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._gestureCancelled||(this._moved?this._commitGesture():this._downClient&&this._handleClick(this._downClient.x,this._downClient.y,e.shiftKey)),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1,this._vertexDragStartPoints=null)},this._onWheel=e=>{if(e.preventDefault(),e.ctrlKey||ot(e)){const t=e.deltaY<0?.9:1.1;return void this._zoomBy(t,this._clientToImage(e.clientX,e.clientY))}const t=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+e.deltaX*t,y:this._viewBox.y+e.deltaY*t}},this._liveRoomLabel=null,this._pinIcons=new Gt(this)}get _editingTarget(){return this.editingRoomId?{kind:"room",id:this.editingRoomId}:this.editingWallId?{kind:"wall",id:this.editingWallId}:null}_rawPointsFor(e){return"room"===e.kind?this.rooms.find(t=>t.id===e.id)?.points??null:this.walls.find(t=>t.id===e.id)?.points??null}willUpdate(e){if(e.has("editingRoomId")||e.has("editingWallId")){const e=this._editingTarget,t=e?this._rawPointsFor(e):null;this._liveEditPoints=t?[...t]:null,this._selectedVertexIndex=null}e.has("mode")&&(this._pendingTrace=null,this._pendingScalePoints=[])}firstUpdated(){this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl,this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(e){if(e.has("backgroundImageUrl")&&this.backgroundImageUrl){const e=new Image;e.onload=()=>{this._naturalHeight=e.naturalHeight/e.naturalWidth*Yt||jt,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},e.src=this.backgroundImageUrl}if(e.has("initialViewBox")){const e=this.initialViewBox,t=this._viewBox;e&&e.x===t.x&&e.y===t.y&&e.w===t.w&&e.h===t.h?this._hasFittedOnce=!0:e?(this._viewBox={...e},this._hasFittedOnce=!0):this.sameBuildingAsPrevious||(this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl)}if(e.has("alignOverlay")){const t=e.get("alignOverlay");if(this.alignOverlay&&this.alignOverlay.imageUrl!==t?.imageUrl){const e=new Image;e.onload=()=>{this._alignNaturalHeight=e.naturalHeight/e.naturalWidth*Yt||jt},e.src=this.alignOverlay.imageUrl}}if(e.has("_pendingTrace")||e.has("_pendingScalePoints")){const e="scale"===this.mode?this._pendingScalePoints.length:this._pendingTrace?.points.length??0;this.dispatchEvent(new CustomEvent("pending-changed",{detail:{count:e}}))}}_contentBounds(){const e=[];for(const t of this.rooms)e.push(...t.points);for(const t of this.walls)e.push(...t.points);for(const t of this.pins)e.push([t.x,t.y]);if(0===e.length)return null;const t=e.map(([e])=>e),i=e.map(([,e])=>e),o=Math.min(...t),n=Math.max(...t),s=Math.min(...i),r=Math.max(...i),a=.08*Math.max(n-o,r-s)||40;return{x:o-a,y:s-a,w:n-o+2*a,h:r-s+2*a}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:Yt,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const e=this._svg?.getBoundingClientRect(),t=e?.width||this._viewBox.w,i=e?.height||this._viewBox.h,o=Math.min(t/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(t-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(e){return e/this._svgTransform().scale}_clientToImage(e,t){const i=this._svg,o=i.createSVGPoint();o.x=e,o.y=t;const n=i.getScreenCTM();if(!n)return{x:0,y:0};const s=o.matrixTransform(n.inverse());return{x:s.x,y:s.y}}_effectivePoints(e,t,i){const o=this._editingTarget;if(o&&o.kind===e&&o.id===t&&this._liveEditPoints)return this._liveEditPoints;const n=this._liveRoomMove;return"room"===e&&n?.id===t?i.map(([e,t])=>[e+n.dx,t+n.dy]):i}get _displayPins(){const e=this._liveRoomMove,t=this._liveGroupMove;return e||t?this.pins.map(i=>e&&i.room_id===e.id?{...i,x:i.x+e.dx,y:i.y+e.dy}:t&&this.multiPinIds.includes(i.id)?{...i,x:i.x+t.dx,y:i.y+t.dy}:i):this.pins}_snappedTracePoint(e,t,i,o){if(o||0===e.length)return{point:[t,i],lockedX:!1,lockedY:!1};const n=this._pxToUnits(10),s=e[e.length-1],r=e[0],a=e.length>=3&&(r[0]!==s[0]||r[1]!==s[1])?[s,r]:[s];let l=null,c=1/0,d=null,h=1/0;for(const[e,o]of a){const s=Math.abs(t-e),r=Math.abs(i-o);s>n&&r>n||(s<=r?s<c&&(l=e,c=s):r<h&&(d=o,h=r))}return{point:[l??t,d??i],lockedX:null!==l,lockedY:null!==d}}_snappedVertexPoint(e,t,i,o,n,s){if(s||"off"===this.snapMode)return[i,o];const r=this._pxToUnits(10),a=t>0?t-1:n?e.length-1:-1;if(a>=0&&a!==t)return et(e[a],[i,o],r);const l=t<e.length-1?t+1:n?0:-1;return l>=0&&l!==t?et(e[l],[i,o],r):[i,o]}_effectiveOpening(e){return this._liveOpeningEdit?.id===e.id?{...e,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}:e}_openingEndpoints(e){const t=this.walls.find(t=>t.id===e.wallId);if(!t)return null;const i=this._effectivePoints("wall",t.id,t.points),o=this._effectiveOpening(e);return tt(o.x,o.y,o.width,i)}_snappedGeometryPoint(e,t,i,o){const n=o||"off"===this.snapMode;if(!n){const e=this._pxToUnits(Xt),o="all"===this.snapMode||"wall"===this.mode,n="all"===this.snapMode||"trace"===this.mode;let s=null;for(const n of o?this.walls:[]){const o=parseFloat(this._wallStrokeWidth(n,_t(n.material)))/2,r=Math.max(e,o);if(je(t,i,n.points)>r)continue;const a=Je(n.points,t,i).point,l=Ue(t,i,a[0],a[1]);(!s||l<s.dist)&&(s={point:a,dist:l})}const r=n?function(e,t,i,o){let n=null,s=o;for(const o of e){if(o.points.length<2)continue;const{point:e}=Qe(o.points,t,i),r=Ue(t,i,e[0],e[1]);r<=s&&(n=o,s=r)}return n}(this.rooms,t,i,e):null;if(r){const e=Qe(r.points,t,i).point,o=Ue(t,i,e[0],e[1]);(!s||o<s.dist)&&(s={point:e,dist:o})}if(s)return{point:s.point,kind:"geometry",lockedX:!1,lockedY:!1}}const{point:s,lockedX:r,lockedY:a}=this._snappedTracePoint(e,t,i,n);return{point:s,kind:r||a?"axis":"none",lockedX:r,lockedY:a}}_hitTest(e,t,i){const o=this._pxToUnits(Xt);if("select"!==this.mode)return{type:"empty"};const n=this._editingTarget;if(n&&this._liveEditPoints){const e=this._liveEditPoints,t=Ht(e,i.x,i.y,o);if(null!==t)return{type:"vertex",index:t};const s=Ht("room"===n.kind?Xe(e):Ze(e),i.x,i.y,o);if(null!==s)return{type:"edgeMidpoint",index:s};const r="room"===n.kind?this.rooms.find(e=>e.id===n.id):void 0;return r&&this._roomLabelHit(r,i,o)?{type:"roomLabel",room:r}:{type:"empty"}}const s=this.rooms.find(e=>e.id===this.selectedRoomId);if(s&&this._roomLabelHit(s,i,o))return{type:"roomLabel",room:s};const r=Dt(this.pins,i.x,i.y,o);if(r.length>1)return{type:"pinStack",pins:r};if(1===r.length)return{type:"pin",pin:r[0]};const a=function(e,t,i,o){let n=null,s=o;for(const o of e){const e=je(t,i,[[o.fromPin.x,o.fromPin.y],[o.toPin.x,o.toPin.y]]);e<=s&&(n=o,s=e)}return n}(this.meshLinks,i.x,i.y,o);if(a)return{type:"meshLink",link:a};const l=function(e,t,i,o){let n=null,s=o;for(const o of e){const e=Math.min(Ue(o.x,o.y,t,i),je(t,i,[[o.fromPin.x,o.fromPin.y],[o.x,o.y]]));e<=s&&(n=o,s=e)}return n}(this.meshStubs,i.x,i.y,o);if(l)return{type:"meshStub",stub:l};if(this.selectedOpeningId){const e=this.openings.find(e=>e.id===this.selectedOpeningId),t=e?this._openingEndpoints(e):null;if(e&&t){const n=Ht(t,i.x,i.y,o);if(null!==n)return{type:"openingHandle",opening:e,whichEnd:n}}}const c=function(e,t,i,o,n){let s=null,r=n;for(const n of e){const e=t.find(e=>e.id===n.wallId);if(!e)continue;const a=tt(n.x,n.y,n.width,e.points);if(!a)continue;const l=je(i,o,a);l<=r&&(s=n,r=l)}return s}(this.openings,this.walls,i.x,i.y,o);if(c)return{type:"opening",opening:c};const d=Wt(this.walls,i.x,i.y,o);if(d)return{type:"wall",wall:d};const h=this.rooms.find(e=>e.points.length>=3&&Ve(i.x,i.y,e.points));return h?{type:"room",room:h}:{type:"empty"}}_lockGesture(){if("align"===this.mode)return{kind:"alignDrag"};if("vertex"===this._downHit?.type)return this._vertexDragStartPoints=this._liveEditPoints?[...this._liveEditPoints]:null,{kind:"vertex",index:this._downHit.index};if("select"===this.mode&&"empty"===this._downHit?.type&&this._downShift&&this._lastImage)return{kind:"marquee",startX:this._lastImage.x,startY:this._lastImage.y,additive:!0};if(this.multiPinIds.length>1&&!this._downShift&&this._lastImage&&("pin"===this._downHit?.type||"pinStack"===this._downHit?.type)){if(("pin"===this._downHit.type?[this._downHit.pin]:this._downHit.pins).some(e=>this.multiPinIds.includes(e.id)))return{kind:"pinGroup",startX:this._lastImage.x,startY:this._lastImage.y}}return"pin"===this._downHit?.type?{kind:"pin",pinId:this._downHit.pin.id}:"roomLabel"===this._downHit?.type?{kind:"roomLabel",roomId:this._downHit.room.id}:"room"===this._downHit?.type&&this._downHit.room.id===this.selectedRoomId&&this._lastImage?{kind:"roomMove",roomId:this._downHit.room.id,startX:this._lastImage.x,startY:this._lastImage.y}:"openingHandle"===this._downHit?.type?{kind:"openingHandle",openingId:this._downHit.opening.id,whichEnd:this._downHit.whichEnd}:"opening"===this._downHit?.type?{kind:"openingMove",openingId:this._downHit.opening.id}:{kind:"pan"}}_dispatchVertexChanged(e){const t=this._editingTarget;if(!t)return;const i="room"===t.kind?"room-vertex-changed":"wall-vertex-changed",o="room"===t.kind?"roomId":"wallId";this.dispatchEvent(new CustomEvent(i,{detail:{[o]:t.id,points:e}}))}_commitGesture(){if("vertex"===this._gesture?.kind&&this._editingTarget&&this._liveEditPoints)this._dispatchVertexChanged(this._liveEditPoints);else if("pinGroup"===this._gesture?.kind){const e=this._liveGroupMove;this._liveGroupMove=null,!e||0===e.dx&&0===e.dy||this.dispatchEvent(new CustomEvent("pins-move",{detail:{pinIds:[...this.multiPinIds],dx:e.dx,dy:e.dy}}))}else if("marquee"===this._gesture?.kind&&this._marquee){const{x0:e,y0:t,x1:i,y1:o}=this._marquee,n=Math.min(e,i),s=Math.max(e,i),r=Math.min(t,o),a=Math.max(t,o);this._marquee=null,this.dispatchEvent(new CustomEvent("pins-select-box",{detail:{pinIds:this.pins.filter(e=>e.x>=n&&e.x<=s&&e.y>=r&&e.y<=a).map(e=>e.id),additive:this._gesture.additive}}))}else if("pin"===this._gesture?.kind&&this._liveDragPin)this.dispatchEvent(new CustomEvent("pin-move",{detail:{pinId:this._liveDragPin.id,x:this._liveDragPin.x,y:this._liveDragPin.y}})),this._liveDragPin=null;else if("roomMove"===this._gesture?.kind&&this._liveRoomMove){const{dx:e,dy:t}=this._liveRoomMove;if(this._roomMoveGuides={x:null,y:null},0===e&&0===t)return void(this._liveRoomMove=null);this.dispatchEvent(new CustomEvent("room-move",{detail:{roomId:this._liveRoomMove.id,dx:this._liveRoomMove.dx,dy:this._liveRoomMove.dy}})),this._liveRoomMove=null}else"roomLabel"===this._gesture?.kind&&this._liveRoomLabel?(this.dispatchEvent(new CustomEvent("room-label-moved",{detail:{roomId:this._liveRoomLabel.id,x:this._liveRoomLabel.x,y:this._liveRoomLabel.y}})),this._liveRoomLabel=null):"openingMove"!==this._gesture?.kind&&"openingHandle"!==this._gesture?.kind||!this._liveOpeningEdit||(this.dispatchEvent(new CustomEvent("opening-update",{detail:{openingId:this._liveOpeningEdit.id,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}})),this._liveOpeningEdit=null)}_handleClick(e,t,i=!1){const o=this._clientToImage(e,t);if("trace"===this.mode){const e=this._pxToUnits(Xt),t=this._pendingTrace??{points:[]},{point:[n,s]}=this._snappedGeometryPoint(t.points,o.x,o.y,i),r=Ut(t,n,s,e);return void(r.closed?(this.dispatchEvent(new CustomEvent("room-trace-complete",{detail:{points:t.points}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("wall"===this.mode){const e=this._pxToUnits(Xt),t=this._pendingTrace??{points:[]},{point:[n,s]}=this._snappedGeometryPoint(t.points,o.x,o.y,i),r=Ut(t,n,s,e);return void(r.closed?(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:[...t.points,t.points[0]]}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("opening"===this.mode){if(!this.armedOpeningType)return;const e=this._pxToUnits(Xt),t=Wt(this.walls,o.x,o.y,e);if(!t)return;const{point:i}=Je(t.points,o.x,o.y);return void this.dispatchEvent(new CustomEvent("opening-place",{detail:{wallId:t.id,x:i[0],y:i[1]}}))}if("scale"===this.mode){const e=[...this._pendingScalePoints,[o.x,o.y]];return void(e.length>=2?(this.dispatchEvent(new CustomEvent("scale-line-complete",{detail:{points:e.slice(0,2)}})),this._pendingScalePoints=[]):this._pendingScalePoints=e)}if("place"===this.mode){if(this.armedEntityId){const e=this._pxToUnits(Xt),t=Dt(this.pins,o.x,o.y,e)[0],i=t?.x??o.x,n=t?.y??o.y;this.dispatchEvent(new CustomEvent("pin-place",{detail:{x:i,y:n}}))}return}const n=this._downHit??{type:"empty"};if("vertex"===n.type)this._selectedVertexIndex=this._selectedVertexIndex===n.index?null:n.index;else if("edgeMidpoint"===n.type&&this._editingTarget&&this._liveEditPoints){const e=("room"===this._editingTarget.kind?Xe(this._liveEditPoints):Ze(this._liveEditPoints))[n.index],t=[...this._liveEditPoints];t.splice(n.index+1,0,e),this._liveEditPoints=t,this._dispatchVertexChanged(t)}else if("pin"!==n.type&&"pinStack"!==n.type||!i)if("pin"===n.type)this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:this.selectedPinId===n.pin.id?null:n.pin.id}}));else if("pinStack"===n.type)this.dispatchEvent(new CustomEvent("pin-stack-select",{detail:{pinIds:n.pins.map(e=>e.id)}}));else if("roomLabel"===n.type&&this._editingTarget);else if("room"===n.type||"roomLabel"===n.type)this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:this.selectedRoomId===n.room.id?null:n.room.id}}));else if("wall"===n.type)this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:this.selectedWallId===n.wall.id?null:n.wall.id}}));else if("opening"===n.type)this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:this.selectedOpeningId===n.opening.id?null:n.opening.id}}));else if("meshLink"===n.type){const e=`${n.link.fromPin.id}|${n.link.toPin.id}`;this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:this.selectedMeshLinkKey===e?null:n.link}}))}else if("meshStub"===n.type){const e=`${n.stub.fromPin.id}|${n.stub.targetDeviceId}`;this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:this.selectedMeshStubKey===e?null:n.stub}}))}else if(this._editingTarget&&null!==this._selectedVertexIndex&&this._liveEditPoints){const e="room"===this._editingTarget.kind,[t,n]=this._snappedVertexPoint(this._liveEditPoints,this._selectedVertexIndex,o.x,o.y,e,i),s=[...this._liveEditPoints];s[this._selectedVertexIndex]=[t,n],this._liveEditPoints=s,this._selectedVertexIndex=null,this._dispatchVertexChanged(s)}else this._selectedVertexIndex=null,this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:null}})),this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:null}})),this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:null}})),this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:null}})),this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:null}})),this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:null}}));else this.dispatchEvent(new CustomEvent("pin-multi-toggle",{detail:{pinIds:"pin"===n.type?[n.pin.id]:n.pins.map(e=>e.id)}}))}finishPendingWall(){"wall"!==this.mode||!this._pendingTrace||this._pendingTrace.points.length<2||(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:this._pendingTrace.points}})),this._pendingTrace=null)}cancelGesture(){const e=this._gesture?.kind;return!(!this._moved||!e||"pan"===e||"pinch"===e||"alignDrag"===e)&&("vertex"===e&&this._vertexDragStartPoints&&(this._liveEditPoints=this._vertexDragStartPoints),this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._liveDragPin=null,this._liveGroupMove=null,this._marquee=null,this._liveRoomLabel=null,this._liveOpeningEdit=null,this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_snapRoomMove(e,t,i,o){const n=this.rooms.find(t=>t.id===e);if(!n)return{dx:t,dy:i,guides:{x:null,y:null}};const s=[...this.rooms.filter(t=>t.id!==e).flatMap(e=>e.points),...this.walls.flatMap(e=>e.points)];let r=null,a=null;for(const[e,l]of n.points){const n=e+t,c=l+i;for(const[e,t]of s){const i=e-n;Math.abs(i)<=o&&(!r||Math.abs(i)<Math.abs(r.delta))&&(r={delta:i,at:e});const s=t-c;Math.abs(s)<=o&&(!a||Math.abs(s)<Math.abs(a.delta))&&(a={delta:s,at:t})}}return{dx:t+(r?.delta??0),dy:i+(a?.delta??0),guides:{x:r?.at??null,y:a?.at??null}}}undoLastPoint(){if("scale"===this.mode&&this._pendingScalePoints.length>0)return this._pendingScalePoints=this._pendingScalePoints.slice(0,-1),!0;const e=this._pendingTrace?.points;return!(!e||0===e.length)&&(this._pendingTrace=e.length>1?{points:e.slice(0,-1)}:null,!0)}cancelPending(){this._pendingTrace=null,this._pendingScalePoints=[]}_deleteSelectedVertex(){const e=this._editingTarget;if(null===this._selectedVertexIndex||!e||!this._liveEditPoints)return;const t="room"===e.kind?3:2;if(this._liveEditPoints.length<=t)return;const i=this._liveEditPoints.filter((e,t)=>t!==this._selectedVertexIndex);this._liveEditPoints=i,this._selectedVertexIndex=null,this._dispatchVertexChanged(i)}_zoomBy(e,t){const i=Ne(this._viewBox.w*e,250,4e3),o=i/this._viewBox.w,n=this._viewBox.h*o;this._viewBox={x:t.x-(t.x-this._viewBox.x)*o,y:t.y-(t.y-this._viewBox.y)*o,w:i,h:n}}_zoomButton(e){const t=this._viewBox;this._zoomBy(e,{x:t.x+t.w/2,y:t.y+t.h/2})}_pinLabel(e){return e.label_override?e.label_override:be(e.device_id,this.entityLookup.values())}_roomLabelPosition(e,t){if(this._liveRoomLabel?.id===e.id)return[this._liveRoomLabel.x,this._liveRoomLabel.y];const i=this._liveRoomMove?.id===e.id?this._liveRoomMove:null,[o,n]=e.label_position??function(e){const t=Ke.get(e);if(t)return t;const i=e.length>=3?(()=>{const[t,i]=De([e],1);return[t,i]})():function(e){if(0===e.length)return[0,0];let t=0,i=0;for(const[o,n]of e)t+=o,i+=n;return[t/e.length,i/e.length]}(e);return Ke.set(e,i),i}(i?e.points:t);return i?[o+i.dx,n+i.dy]:[o,n]}_roomLabelHit(e,t,i){if(!1===e.visible)return!1;const o=this._effectivePoints("room",e.id,e.points);if(o.length<2)return!1;const[n,s]=this._roomLabelPosition(e,o),r=9*e.name.length/2;return t.x>=n-r-i&&t.x<=n+r+i&&t.y>=s-13-i&&t.y<=s+4+i}_renderRoom(e){if(!1===e.visible)return K;const t=this._effectivePoints("room",e.id,e.points);if(t.length<2)return K;const i=t.map(([e,t])=>`${e},${t}`).join(" "),[o,n]=this._roomLabelPosition(e,t),s=this.editingRoomId===e.id,r=e.id===this.selectedRoomId||s,a=e.fill_color??Zt,l=e.fill_opacity??Jt,c=e.border_opacity??1,d=this._liveRoomMove?.id===e.id?this._liveRoomMove:null,h=!d||0===d.dx&&0===d.dy?K:q`<polygon
            class="room-ghost"
            points=${e.points.map(([e,t])=>`${e},${t}`).join(" ")}
          ></polygon>`;return q`
      ${h}
      <polygon
        class="room-poly ${r?"selected":""}"
        points=${i}
        fill=${a}
        fill-opacity=${r?Math.min(1,l*(.32/.18)):l}
        stroke=${a}
        stroke-opacity=${c}
        stroke-width=${r?3:2}
      ></polygon>
      <text class="room-label" x=${o} y=${n}>${e.name}</text>
      ${s?this._renderVertexHandles(t,!0):K}
    `}_renderVertexHandles(e,t){const i=this._pxToUnits(6),o=this._pxToUnits(4),n=t?Xe(e):Ze(e);return q`
      ${n.map(([e,t])=>q`<circle class="midpoint-handle" cx=${e} cy=${t} r=${o}></circle>`)}
      ${e.map(([e,t],o)=>{const n=o===this._selectedVertexIndex;return q`
          <circle
            class="vertex-handle ${n?"selected":""}"
            cx=${e}
            cy=${t}
            r=${i}
          ></circle>
          ${n?q`
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
              `:K}
        `})}
    `}_livePinPosition(e){if(this._liveDragPin?.id===e.id)return this._liveDragPin;const t=this._liveGroupMove;if(t&&this.multiPinIds.includes(e.id))return{x:e.x+t.dx,y:e.y+t.dy};const i=this._liveRoomMove;return i&&e.room_id===i.id?{x:e.x+i.dx,y:e.y+i.dy}:e}_renderMeshLink(e){const t=`${e.fromPin.id}|${e.toPin.id}`,i=this._livePinPosition(e.fromPin),o=this._livePinPosition(e.toPin);return q`
      <line
        class="mesh-link ${t===this.selectedMeshLinkKey?"selected":this.selectedMeshLinkKey?"dim":""}"
        x1=${i.x}
        y1=${i.y}
        x2=${o.x}
        y2=${o.y}
        style="stroke:${Be(e.quality)}"
      >
        <title>${e.detail??e.quality}</title>
      </line>
    `}_renderMarquee(){const e=this._marquee;return e?q`<rect
      class="marquee"
      x=${Math.min(e.x0,e.x1)}
      y=${Math.min(e.y0,e.y1)}
      width=${Math.abs(e.x1-e.x0)}
      height=${Math.abs(e.y1-e.y0)}
    ></rect>`:K}_renderRoomMoveGuides(){if(!this._liveRoomMove)return K;const{x:e,y:t}=this._roomMoveGuides,i=this._viewBox;return q`
      ${null!==e?q`<line class="axis-guide" x1=${e} y1=${i.y} x2=${e} y2=${i.y+i.h}></line>`:K}
      ${null!==t?q`<line class="axis-guide" x1=${i.x} y1=${t} x2=${i.x+i.w} y2=${t}></line>`:K}
    `}_renderMeshStubLine(e){const t=`${e.fromPin.id}|${e.targetDeviceId}`,i=this._livePinPosition(e.fromPin);return q`
      <line
        class="mesh-stub-line ${t===this.selectedMeshStubKey?"selected":""}"
        x1=${i.x}
        y1=${i.y}
        x2=${e.x}
        y2=${e.y}
        style="stroke:${Be(e.quality)}"
      >
        <title>${e.targetLabel} (${e.targetFloorName})</title>
      </line>
    `}_renderMeshStubMarkers(){const e=this._pxToUnits(10),t=this._pxToUnits(12),i=new Map;for(const e of this.meshStubs){const t=`${e.targetDeviceId}|${e.x},${e.y}`,o=`${e.fromPin.id}|${e.targetDeviceId}`===this.selectedMeshStubKey,n=i.get(t);n?o&&(n.selected=!0):i.set(t,{stub:e,selected:o})}const o=(e,t)=>e.minX<t.maxX&&t.minX<e.maxX&&e.minY<t.maxY&&t.minY<e.maxY,n=[];for(const e of this.rooms){if(!1===e.visible)continue;const t=this._effectivePoints("room",e.id,e.points);if(t.length<2)continue;const[i,o]=this._roomLabelPosition(e,t),s=9*e.name.length/2;n.push({minX:i-s,maxX:i+s,minY:o-13,maxY:o+4})}const s=this.pins.map(e=>({minX:e.x-t,maxX:e.x+t,minY:e.y-t,maxY:e.y+t}));return[...i.values()].map(({stub:t,selected:i})=>{const r=(t=>{const i=7*t.targetFloorName.length/2;return{minX:t.x-i,maxX:t.x+i,minY:t.y+e+3,maxY:t.y+e+17}})(t),a=!s.some(e=>o(r,e))&&!n.some(e=>o(r,e));return a&&n.push(r),q`
        ${this._renderPinMarker(t.x,t.y,e,{kind:"path",d:"M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z"},"var(--sc-fg-secondary)",i,`${t.targetLabel} (${t.targetFloorName})`)}
        ${a?q`<text class="mesh-stub-label" x=${t.x} y=${t.y+e+14}
                >${t.targetFloorName}</text
              >`:K}
      `})}_iconForPin(e){return this._pinIcons.iconForPin(e,this.entityLookup.values())}_pinGroups(){const e=new Map;for(const t of this._displayPins){const i=`${t.x},${t.y}`;e.has(i)||e.set(i,[]),e.get(i).push(t)}return[...e.values()].map(e=>({x:e[0].x,y:e[0].y,pins:e}))}_renderPinGroup(e){const t=this._pxToUnits(12);if(1===e.pins.length){const i=e.pins[0],o=this._liveDragPin?.id===i.id?this._liveDragPin:null,n=o?.x??i.x,s=o?.y??i.y,r=i.id===this.selectedPinId||this.multiPinIds.includes(i.id);return this._renderPinMarker(n,s,t,this._iconForPin(i),"var(--sc-accent)",r,this._pinLabel(i))}const i=e.pins.some(e=>e.id===this.selectedPinId||this.multiPinIds.includes(e.id)),o=`${e.pins.length} devices: ${e.pins.map(e=>this._pinLabel(e)).join(", ")}`;return this._renderPinMarker(e.x,e.y,t,{kind:"path",d:"M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10M12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4M6 16C7.1 16 8 16.9 8 18S7.1 20 6 20 4 19.1 4 18 4.9 16 6 16M6 10C7.1 10 8 10.9 8 12S7.1 14 6 14 4 13.1 4 12 4.9 10 6 10M6 4C7.1 4 8 4.9 8 6S7.1 8 6 8 4 7.1 4 6 4.9 4 6 4M18 16C19.1 16 20 16.9 20 18S19.1 20 18 20 16 19.1 16 18 16.9 16 18 16M18 10C19.1 10 20 10.9 20 12S19.1 14 18 14 16 13.1 16 12 16.9 10 18 10M18 4C19.1 4 20 4.9 20 6S19.1 8 18 8 16 7.1 16 6 16.9 4 18 4Z"},"var(--sc-accent)",i,o)}_renderPinMarker(e,t,i,o,n,s,r){return this._pinIcons.renderMarker(e,t,i,o,n,s,r)}_renderPendingTrace(){const e=this._pendingTrace?.points??[];if(0===e.length&&!this._hoverSnap)return K;const t=e.map(([e,t])=>`${e},${t}`).join(" "),i=this._pxToUnits(6),o=e[e.length-1],n=e[0],s=!!this._hoverSnap&&!!n&&e.length>=3&&Ue(this._hoverSnap.point[0],this._hoverSnap.point[1],n[0],n[1])<=this._pxToUnits(Xt);return q`
      ${e.length>0?q`<polyline class="pending-trace" points=${t}></polyline>`:K}
      ${e.map(([e,t],o)=>q`
          <circle
            class="vertex-handle ${0===o&&s?"closing":""}"
            cx=${e}
            cy=${t}
            r=${0===o&&s?1.6*i:i}
          ></circle>
        `)}
      ${this._hoverSnap?this._renderHoverSnap(o,n,s,i):K}
    `}_renderHoverSnap(e,t,i,o){if(!this._hoverSnap)return K;const[n,s]=this._hoverSnap.point,r=this._viewBox,a=i&&t?t:[n,s];return q`
      ${this._hoverSnap.lockedY?q`<line
              class="axis-guide"
              x1=${r.x}
              y1=${s}
              x2=${r.x+r.w}
              y2=${s}
            ></line>`:K}
      ${this._hoverSnap.lockedX?q`<line
              class="axis-guide"
              x1=${n}
              y1=${r.y}
              x2=${n}
              y2=${r.y+r.h}
            ></line>`:K}
      ${e?q`<line
              class="hover-snap-line ${i?"closing":""}"
              x1=${e[0]}
              y1=${e[1]}
              x2=${a[0]}
              y2=${a[1]}
            ></line>`:K}
      ${i?K:q`<circle
              class="hover-snap-marker ${"geometry"===this._hoverSnap.kind?"on-geometry":"axis"===this._hoverSnap.kind?"on-axis":""}"
              cx=${n}
              cy=${s}
              r=${o}
            ></circle>`}
    `}_wallStrokeWidth(e,t){if(this.scale){const[[t,i],[o,n]]=this.scale.points,s=(Ue(t,i,o,n)||1)/this.scale.meters;return`${Ne(mt(e)/100*s,.5,40)}`}return`${Ne(4+t.attenuationDbPerCm*mt(e)/3,4,8)}px`}_renderWall(e){const t=this._effectivePoints("wall",e.id,e.points),i=e.id===this.selectedWallId,o=this.editingWallId===e.id,n=_t(e.material),s=this._wallStrokeWidth(e,n),r=t[0],a=t[t.length-1],l=t.length>2&&!!r&&!!a&&r[0]===a[0]&&r[1]===a[1],c=(l?t.slice(0,-1):t).map(([e,t])=>`${e},${t}`).join(" "),d="wall-line "+(i||o?"selected":""),h=`stroke:${this.dark?`color-mix(in srgb, ${n.color} 30%, #e0e0e0)`:n.color}; stroke-width:${s}`;return q`
      ${l?q`<polygon class=${d} points=${c} style=${h}><title>${gt(n)}</title></polygon>`:q`<polyline class=${d} points=${c} style=${h}><title>${gt(n)}</title></polyline>`}
      ${o?this._renderVertexHandles(t,!1):K}
    `}_renderOpening(e){const t=this._openingEndpoints(e);if(!t)return K;const[[i,o],[n,s]]=t,r=e.id===this.selectedOpeningId,a=this._pxToUnits(6),l=this.walls.find(t=>t.id===e.wallId),c=l?this._wallStrokeWidth(l,_t(l.material)):void 0,d=Ue(i,o,n,s)||1,h=parseFloat(c??"6")/2*1.5,p=-(s-o)/d*h,u=(n-i)/d*h,g=(e,t)=>q`
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
    `;return q`
      <line
        class="opening-line ${e.type} ${r?"selected":""}"
        x1=${i}
        y1=${o}
        x2=${n}
        y2=${s}
        style=${c?`stroke-width:${c}`:K}
      >
        <title>${e.type}</title>
      </line>
      ${g(i,o)}
      ${g(n,s)}
      ${r?q`
            <circle class="opening-handle" cx=${i} cy=${o} r=${a}></circle>
            <circle class="opening-handle" cx=${n} cy=${s} r=${a}></circle>
          `:K}
    `}_renderScaleLine(){if(!this.scale)return K;const[[e,t],[i,o]]=this.scale.points;return q`
      <line class="scale-line" x1=${e} y1=${t} x2=${i} y2=${o}></line>
      <text class="scale-label" x=${(e+i)/2} y=${(t+o)/2-6}>
        ${Pt(this.scale.meters,this.unitSystem)}
        ${$t(this.unitSystem)}
      </text>
    `}_renderPendingScale(){if(0===this._pendingScalePoints.length)return K;const e=this._pxToUnits(6),[t,i]=this._pendingScalePoints[0];return q`<circle class="vertex-handle" cx=${t} cy=${i} r=${e}></circle>`}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return K;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.backgroundOffsetX-this._viewBox.x),n=i+e*(this.backgroundOffsetY-this._viewBox.y),s=e*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${Yt}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderAlignOverlay(){if(!this.alignOverlay)return K;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.alignOverlay.offsetX-this._viewBox.x),n=i+e*(this.alignOverlay.offsetY-this._viewBox.y),s=e*this.alignOverlay.scale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.alignOverlay.imageUrl}
          style="width:${Yt}px; height:${this._alignNaturalHeight}px; opacity:${this.alignOverlay.opacity};"
        />
      </div>
    `}_renderScaleBar(){if(!this.scale)return V`<div class="scale-corner">
        <button
          class="scale-chip floating-panel"
          title=${Pe("canvas.calibrateHint")}
          aria-label=${Pe("canvas.calibrateHint")}
          @click=${()=>this.dispatchEvent(new CustomEvent("calibrate-scale-click",{bubbles:!0,composed:!0}))}
        >
          <ha-icon icon="mdi:ruler"></ha-icon>
          ${Pe("canvas.notCalibrated")}
        </button>
      </div>`;const[[e,t],[i,o]]=this.scale.points,n=(Math.hypot(i-e,o-t)||1)/this.scale.meters,s="imperial"===this.unitSystem,r=this._svgTransform().scale*n*(s?.3048:1),a=s?[1,2,5,10,20,50,100,200,500]:[.1,.2,.5,1,2,5,10,20,50,100,200,500];let l=a[0];for(const e of a){if(!(e*r<=130))break;l=e}const c=Math.max(8,Math.round(l*r));return V`<div class="scale-corner">
      <div class="scale-bar floating-panel">
        <span>${l} ${$t(this.unitSystem)}</span>
        <span class="scale-bar-line" style="width:${c}px"></span>
      </div>
    </div>`}render(){const e=this._viewBox;return V`
      ${this._renderBackgroundOverlay()} ${this._renderAlignOverlay()}
      ${q`
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
          ${this._renderRoomMoveGuides()} ${this._renderMarquee()}
          ${"trace"===this.mode||"wall"===this.mode?this._renderPendingTrace():K}
          ${this._renderScaleLine()}
          ${"scale"===this.mode?this._renderPendingScale():K}
          ${this._pinGroups().map(e=>this._renderPinGroup(e))}
        </svg>
      `}
      ${this._renderScaleBar()}
      <div class="controls">
        <button
          @click=${()=>this._zoomButton(.8)}
          title=${Pe("canvasControls.zoomIn")}
          aria-label=${Pe("canvasControls.zoomIn")}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
        <button
          @click=${()=>this._zoomButton(1.25)}
          title=${Pe("canvasControls.zoomOut")}
          aria-label=${Pe("canvasControls.zoomOut")}
        >
          <ha-icon icon="mdi:minus"></ha-icon>
        </button>
        <button
          @click=${()=>this.fitToScreen()}
          title=${Pe("canvasControls.fit")}
          aria-label=${Pe("canvasControls.fit")}
        >
          <ha-icon icon="mdi:fit-to-screen-outline"></ha-icon>
        </button>
      </div>
    `}};Qt.styles=[Et,qt,Kt],e([ue({type:Boolean,reflect:!0})],Qt.prototype,"dark",void 0),e([ue({attribute:!1})],Qt.prototype,"rooms",void 0),e([ue({attribute:!1})],Qt.prototype,"pins",void 0),e([ue({attribute:!1})],Qt.prototype,"walls",void 0),e([ue({attribute:!1})],Qt.prototype,"openings",void 0),e([ue({attribute:!1})],Qt.prototype,"scale",void 0),e([ue({attribute:!1})],Qt.prototype,"unitSystem",void 0),e([ue({attribute:!1})],Qt.prototype,"meshLinks",void 0),e([ue({attribute:!1})],Qt.prototype,"meshStubs",void 0),e([ue({attribute:!1})],Qt.prototype,"entityLookup",void 0),e([ue({attribute:!1})],Qt.prototype,"backgroundImageUrl",void 0),e([ue({type:Number})],Qt.prototype,"backgroundOpacity",void 0),e([ue({type:Number})],Qt.prototype,"backgroundOffsetX",void 0),e([ue({type:Number})],Qt.prototype,"backgroundOffsetY",void 0),e([ue({type:Number})],Qt.prototype,"backgroundScale",void 0),e([ue({attribute:!1})],Qt.prototype,"alignOverlay",void 0),e([ue({attribute:!1})],Qt.prototype,"initialViewBox",void 0),e([ue({type:Boolean})],Qt.prototype,"sameBuildingAsPrevious",void 0),e([ue({attribute:!1})],Qt.prototype,"mode",void 0),e([ue({attribute:!1})],Qt.prototype,"snapMode",void 0),e([ue({attribute:!1})],Qt.prototype,"armedEntityId",void 0),e([ue({attribute:!1})],Qt.prototype,"armedOpeningType",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedRoomId",void 0),e([ue({attribute:!1})],Qt.prototype,"editingRoomId",void 0),e([ue({attribute:!1})],Qt.prototype,"editingWallId",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedPinId",void 0),e([ue({attribute:!1})],Qt.prototype,"multiPinIds",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedWallId",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedOpeningId",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedMeshLinkKey",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedMeshStubKey",void 0),e([ge()],Qt.prototype,"_viewBox",void 0),e([ge()],Qt.prototype,"_naturalHeight",void 0),e([ge()],Qt.prototype,"_alignNaturalHeight",void 0),e([ge()],Qt.prototype,"_pendingTrace",void 0),e([ge()],Qt.prototype,"_hoverSnap",void 0),e([ge()],Qt.prototype,"_pendingScalePoints",void 0),e([ge()],Qt.prototype,"_liveEditPoints",void 0),e([ge()],Qt.prototype,"_liveRoomMove",void 0),e([ge()],Qt.prototype,"_roomMoveGuides",void 0),e([ge()],Qt.prototype,"_liveGroupMove",void 0),e([ge()],Qt.prototype,"_marquee",void 0),e([ge()],Qt.prototype,"_liveDragPin",void 0),e([ge()],Qt.prototype,"_liveOpeningEdit",void 0),e([ge()],Qt.prototype,"_selectedVertexIndex",void 0),e([_e("svg")],Qt.prototype,"_svg",void 0),e([ge()],Qt.prototype,"_liveRoomLabel",void 0),Qt=e([me("floorplan-canvas")],Qt);const ei=85.0511287798;function ti(e,t,i){const o=512*2**i,n=e/o*360-180,s=Math.PI-2*Math.PI*t/o;return{lat:180*Math.atan(Math.sinh(s))/Math.PI,lon:n}}function ii(e,t){const i=t*Math.PI/180,o=Math.cos(i),n=Math.sin(i);return{x:o*e.x-n*e.y,y:n*e.x+o*e.y}}function oi(e){const t=((e+180)%360+360)%360-180;return-180===t?180:t}const ni=e=>e.rotation_deg??0;function si(e){return function(e,t,i){const o=512*2**i,n=Math.max(-ei,Math.min(ei,e))*Math.PI/180;return{x:(t+180)/360*o,y:(.5-Math.log(Math.tan(Math.PI/4+n/2))/(2*Math.PI))*o}}(e.lat,e.lon,e.zoom)}function ri(e,t,i,o,n){const{lat:s,lon:r}=ti(t,i,o);return{...e,lat:s,lon:r,zoom:o,rotation_deg:oi(n)}}function ai(e,t,i){const o=si(e),n=ii({x:t,y:i},ni(e));return ri(e,o.x-n.x,o.y-n.y,e.zoom,ni(e))}function li(e,t,i){const o=Math.min(21,Math.max(3,e.zoom+Math.log2(t))),n=2**(o-e.zoom),s=ni(e),r=si(e),a=ii(i,s);return ri(e,n*(r.x+a.x)-a.x,n*(r.y+a.y)-a.y,o,s)}function ci(e,t,i){const o=si(e),n=ii(i,ni(e)),s=ii(i,t);return ri(e,o.x+n.x-s.x,o.y+n.y-s.y,e.zoom,t)}const di=r`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* Same backdrop as the floors, for when there's no photo or map. */
    background: color-mix(in srgb, var(--sc-bg) 94%, black);
    user-select: none;
    -webkit-user-select: none;
  }
  :host([dark]) {
    background: color-mix(in srgb, var(--sc-bg) 88%, white);
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
  .map-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .map-attribution {
    position: absolute;
    right: 12px;
    bottom: 60px;
    padding: 1px 6px;
    border-radius: var(--ha-border-radius-sm, 4px);
    font-size: var(--sc-fs-caption);
    color: #333;
    background: rgba(255, 255, 255, 0.8);
  }
  .map-attribution a {
    color: inherit;
  }
  .map-error {
    position: absolute;
    left: 12px;
    top: 64px;
    max-width: calc(100% - 16px);
    padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
    border-radius: 6px;
    font-size: var(--sc-fs-small);
    color: var(--sc-fg);
    background: var(--sc-bg);
    border: 1px solid var(--sc-divider);
    pointer-events: none;
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
  .ghost-room {
    fill: none;
    stroke: var(--sc-accent);
    stroke-opacity: 0.7;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
  }
  .ghost-wall {
    fill: none;
    stroke: var(--sc-fg);
    stroke-opacity: 0.8;
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
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
  .mesh-link.dim {
    opacity: 0.2;
  }
  .indoor-end {
    fill: var(--sc-fg-secondary);
    stroke: white;
    stroke-width: 1.5;
    pointer-events: none;
  }
  ${Ot}
`,hi=[[-1,-1],[1,-1],[1,1],[-1,1]];let pi=class extends ce{constructor(){super(...arguments),this.placements=[],this.ghosts=new Map,this.floorNameById=new Map,this.floorIconById=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.85,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.mode="select",this.selectedPlacementId=null,this.pins=[],this.selectedPinId=null,this.entityLookup=new Map,this.meshLinks=[],this.selectedMeshLinkKey=null,this.initialViewBox=null,this.mapBackground=null,this.dark=!1,this._mapError=null,this._mapStarting=!1,this._mapSize="",this._viewBox={x:0,y:0,w:Yt,h:750},this._naturalHeight=750,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._pinIcons=new Gt(this),this._gestureCancelled=!1,this._hasFittedOnce=!1,this._onPointerDown=e=>{if("mouse"!==e.pointerType||0===e.button){if(it(this),this._svg.setPointerCapture(e.pointerId),this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o={x:(t.x+i.x)/2,y:(t.y+i.y)/2};return"map"===this.mode&&this.mapBackground?void(this._gesture={kind:"mapPinch",lastDistance:Ue(t.x,t.y,i.x,i.y)||1,lastAngle:Math.atan2(i.y-t.y,i.x-t.x),lastMid:this._clientToImage(o.x,o.y)}):void(this._gesture={kind:"pinch",startDistance:Ue(t.x,t.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}this._pointers.size>2||(this._downClient={x:e.clientX,y:e.clientY},this._lastClient={x:e.clientX,y:e.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(e.clientX,e.clientY):{type:"empty"})}},this._onPointerMove=e=>{if(!this._pointers.has(e.pointerId))return;if(this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),"mapPinch"===this._gesture?.kind&&2===this._pointers.size){const[e,t]=[...this._pointers.values()],i=this._gesture,o=Ue(e.x,e.y,t.x,t.y)||1,n=Math.atan2(t.y-e.y,t.x-e.x),s=this._clientToImage((e.x+t.x)/2,(e.y+t.y)/2);return this._fire("map-adjust",{op:"pinch",dx:s.x-i.lastMid.x,dy:s.y-i.lastMid.y,factor:o/i.lastDistance,rotateDeg:180*(n-i.lastAngle)/Math.PI,at:s}),i.lastDistance=o,i.lastAngle=n,void(i.lastMid=s)}if("pinch"===this._gesture?.kind&&2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o=Ue(t.x,t.y,i.x,i.y)||1,n=this._gesture.startDistance/o,s=this._gesture.startViewBox,r=Ne(s.w*n,this._minViewBoxWidth,4e3),a=r/s.w,l=s.h*a,{x:c,y:d}=this._gesture.midImage;return void(this._viewBox={x:c-(c-s.x)*a,y:d-(d-s.y)*a,w:r,h:l})}if(1!==this._pointers.size||!this._downClient)return;if(this._gestureCancelled)return;if(!this._moved){if(Ue(this._downClient.x,this._downClient.y,e.clientX,e.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"===this._gesture?.kind||"mapPan"===this._gesture?.kind?this._svg.style.cursor="grabbing":this._gesture&&this._fire("property-gesture-start")}const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};if("mapPan"===this._gesture?.kind)this._fire("map-adjust",{op:"pan",dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t});else if("pan"===this._gesture?.kind)this._viewBox={...this._viewBox,x:this._viewBox.x-(e.clientX-i.x)/t,y:this._viewBox.y-(e.clientY-i.y)/t};else if("move"===this._gesture?.kind)this._fire("placement-move",{id:this._gesture.id,dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t});else if("pinMove"===this._gesture?.kind){const t=this._clientToImage(e.clientX,e.clientY);this._fire("outdoor-pin-move",{id:this._gesture.id,x:t.x,y:t.y})}else if("resize"===this._gesture?.kind){const t=this._gesture,i=this.placements.find(e=>e.id===t.id);if(i){const[o,n]=hi[t.corner],s=-o,r=-n,a=this._clientToImage(e.clientX,e.clientY),l=i.rotation_deg*Math.PI/180,c=Math.cos(l),d=Math.sin(l),h=a.x-t.anchorWorld.x,p=a.y-t.anchorWorld.y,u=c*h+d*p,g=-d*h+c*p,_=Math.max(10,o*u),m=Math.max(10,n*g),v=i.aspect_ratio||_/m||1,y=Math.max(_,m*v),f=y/v,b=s*(y/2),w=r*(f/2);this._fire("placement-resize",{id:i.id,width:y,height:f,x:t.anchorWorld.x-(c*b-d*w),y:t.anchorWorld.y-(d*b+c*w)})}}else if("rotate"===this._gesture?.kind){const t=this._gesture.id,i=this.placements.find(e=>e.id===t);if(i){const t=this._clientToImage(e.clientX,e.clientY),o=((180*Math.atan2(t.y-i.y,t.x-i.x)/Math.PI+90)%360+360)%360;this._fire("placement-rotate",{id:i.id,rotationDeg:o})}}this._lastClient={x:e.clientX,y:e.clientY}},this._onPointerUp=e=>{this._pointers.delete(e.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(e.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._moved||!this._downClient||this._gestureCancelled||this._handleClick(),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1)},this._onWheel=e=>{if(e.preventDefault(),"map"===this.mode&&this.mapBackground&&(e.ctrlKey||e.shiftKey)){const t=this._clientToImage(e.clientX,e.clientY);return void this._fire("map-adjust",e.ctrlKey?{op:"zoom",factor:e.deltaY<0?1.1:1/1.1,at:t}:{op:"rotate",deltaDeg:e.deltaY<0?2:-2,at:t})}if(e.ctrlKey||ot(e)){const t=e.deltaY<0?.9:1.1;return void this._zoomBy(t,this._clientToImage(e.clientX,e.clientY))}const t=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+e.deltaX*t,y:this._viewBox.y+e.deltaY*t}}}firstUpdated(){this.initialViewBox?(this._viewBox={...this.initialViewBox},this._hasFittedOnce=!0):(this.fitToScreen(),this._hasFittedOnce=this.placements.length>0||!this.backgroundImageUrl),this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._destroyMap()}_destroyMap(){this._map?.destroy(),this._map=void 0,this._mapSize=""}_syncMap(){const e=this.mapBackground;if(!e)return this._destroyMap(),void(this._mapError=null);if(this._mapError)return;const t=this.renderRoot.querySelector(".map-layer");if(!t||!this._svg)return;const i=this._svg.getBoundingClientRect();if(0===i.width||0===i.height)return;const{scale:o,offsetX:n,offsetY:s}=this._svgTransform(),r=this._viewBox,a=function(e,t,i,o){const n=ni(e),s=si(e),r=ii({x:t,y:i},n),a=ti(s.x+r.x,s.y+r.y,e.zoom);return{lat:a.lat,lon:a.lon,zoom:e.zoom+Math.log2(o),bearing:n}}(e,r.x+(i.width/2-n)/o,r.y+(i.height/2-s)/o,o),l=this.hass?.themes?.darkMode??!1;if(this._map){this._map.setDark(l),this._map.setStyleKind(e.style??"street"),this._map.setOpacity(e.opacity);const t=`${i.width}x${i.height}`;return t!==this._mapSize&&(this._mapSize=t,this._map.resize()),void this._map.setCamera(a)}const c=this.hass?.connection;if(this._mapStarting||!c)return;this._mapStarting=!0,this._mapError=null;const d="/spatial_context/map";(async()=>{try{const o=await(import(`${d}/spatial-context-map.mjs?v=0.16.0-beta.2+mvhkfi21`));if(!o.supportsVectorMaps())throw new Error(Pe("mapBackground.noWebgl"));const n=await o.createMapLayer({container:t,baseUrl:d,connection:c,dark:l,styleKind:e.style??"street",language:this.hass?.locale?.language??this.hass?.language??"en",opacity:e.opacity,camera:a});this.mapBackground&&this.isConnected?(this._map=n,this._mapSize=`${i.width}x${i.height}`):n.destroy()}catch(e){this._mapError=e?.message??String(e)}finally{this._mapStarting=!1,this.requestUpdate()}})()}updated(e){if(e.has("mapBackground")&&(this._mapError=null),this._syncMap(),e.has("backgroundImageUrl")&&this.backgroundImageUrl){const e=new Image;e.onload=()=>{this._naturalHeight=e.naturalHeight/e.naturalWidth*Yt||750,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},e.src=this.backgroundImageUrl}}_contentBounds(){if(0===this.placements.length&&0===this.pins.length)return null;const e=[...this.placements.flatMap(e=>[e.x-e.width,e.x+e.width]),...this.pins.map(e=>e.x)],t=[...this.placements.flatMap(e=>[e.y-e.height,e.y+e.height]),...this.pins.map(e=>e.y)],i=Math.min(...e),o=Math.max(...e),n=Math.min(...t),s=Math.max(...t),r=.15*Math.max(o-i,s-n)||60;return{x:i-r,y:n-r,w:o-i+2*r,h:s-n+2*r}}getViewCenter(){const e=this._svg?.getBoundingClientRect(),{scale:t,offsetX:i,offsetY:o}=this._svgTransform(),n=this._viewBox;return{x:n.x+((e?.width??0)/2-i)/t,y:n.y+((e?.height??0)/2-o)/t}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:Yt,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const e=this._svg?.getBoundingClientRect(),t=e?.width||this._viewBox.w,i=e?.height||this._viewBox.h,o=Math.min(t/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(t-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(e){return e/this._svgTransform().scale}_clientToImage(e,t){const i=this._svg,o=i.createSVGPoint();o.x=e,o.y=t;const n=i.getScreenCTM();if(!n)return{x:0,y:0};const s=o.matrixTransform(n.inverse());return{x:s.x,y:s.y}}_toLocal(e,t,i){const o=e.rotation_deg*Math.PI/180,n=Math.cos(o),s=Math.sin(o),r=t-e.x,a=i-e.y;return{x:n*r+s*a,y:-s*r+n*a}}_localToWorld(e,t,i){const o=e.rotation_deg*Math.PI/180,n=Math.cos(o),s=Math.sin(o);return{x:e.x+n*t-s*i,y:e.y+s*t+n*i}}_hitTest(e,t){const i=this._clientToImage(e,t),o=this._pxToUnits(12*1.4);for(const e of[...this.pins].reverse())if(Ue(e.x,e.y,i.x,i.y)<=o)return{type:"pin",id:e.id};const n=this.placements.find(e=>e.id===this.selectedPlacementId);if(n){const i=this._pxToUnits(26),o=hi.map(([e,t])=>[e*n.width/2,t*n.height/2]);for(let i=0;i<o.length;i++){const[s,r]=o[i],a=this._localToWorld(n,s,r),l=this._imageToClient(a.x,a.y);if(Ue(l.x,l.y,e,t)<=14)return{type:"resizeHandle",id:n.id,corner:i}}const s=this._localToWorld(n,0,-n.height/2-i),r=this._imageToClient(s.x,s.y);if(Ue(r.x,r.y,e,t)<=14)return{type:"rotateHandle",id:n.id}}let s=null,r=this._pxToUnits(8);for(const e of this.meshLinks){const t=Ye(i.x,i.y,e.from.x,e.from.y,e.to.x,e.to.y);t<=r&&(s=e,r=t)}if(s)return{type:"meshLink",key:s.key};for(const e of[...this.placements].reverse()){const t=this._toLocal(e,i.x,i.y);if(Math.abs(t.x)<=e.width/2&&Math.abs(t.y)<=e.height/2)return{type:"body",id:e.id}}return{type:"empty"}}_imageToClient(e,t){const i=this._svg.getBoundingClientRect(),{scale:o,offsetX:n,offsetY:s}=this._svgTransform();return{x:i.left+n+(e-this._viewBox.x)*o,y:i.top+s+(t-this._viewBox.y)*o}}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_lockGesture(){if("resizeHandle"===this._downHit?.type){const e=this._downHit,t=this.placements.find(t=>t.id===e.id);if(!t)return{kind:"pan"};const[i,o]=hi[e.corner],n=this._localToWorld(t,-i*t.width/2,-o*t.height/2);return{kind:"resize",id:t.id,corner:e.corner,anchorWorld:n}}return"rotateHandle"===this._downHit?.type?{kind:"rotate",id:this._downHit.id}:"body"===this._downHit?.type?{kind:"move",id:this._downHit.id}:"pin"===this._downHit?.type?{kind:"pinMove",id:this._downHit.id}:"map"===this.mode&&this.mapBackground?{kind:"mapPan"}:{kind:"pan"}}cancelGesture(){const e=this._gesture?.kind;return!(!this._moved||!e||"pan"===e||"pinch"===e||"mapPan"===e||"mapPinch"===e)&&(this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_handleClick(){if("place"===this.mode||"place-pin"===this.mode){if(!this._downClient)return;const e=this._clientToImage(this._downClient.x,this._downClient.y);return void this._fire("place"===this.mode?"placement-place":"outdoor-pin-place",{x:e.x,y:e.y})}const e=this._downHit;"pin"===e?.type?this._fire("outdoor-pin-select",{id:e.id}):"meshLink"===e?.type?this._fire("property-mesh-link-select",{key:e.key===this.selectedMeshLinkKey?null:e.key}):(this._fire("outdoor-pin-select",{id:null}),this._fire("property-mesh-link-select",{key:null}),this._fire("placement-select",{id:"body"===e?.type?e.id:null}))}get _minViewBoxWidth(){return this.mapBackground?15.625:250}_zoomBy(e,t){const i=Ne(this._viewBox.w*e,this._minViewBoxWidth,4e3),o=i/this._viewBox.w,n=this._viewBox.h*o;this._viewBox={x:t.x-(t.x-this._viewBox.x)*o,y:t.y-(t.y-this._viewBox.y)*o,w:i,h:n}}_zoomButton(e){const t=this._viewBox;this._zoomBy(e,{x:t.x+t.w/2,y:t.y+t.h/2})}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return K;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.backgroundOffsetX-this._viewBox.x),n=i+e*(this.backgroundOffsetY-this._viewBox.y),s=e*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${Yt}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderGhost(e){const t=this.ghosts.get(e.id),i=e.source_bounds;if(!t||!i||i.max_x<=i.min_x||i.max_y<=i.min_y)return K;const o=e.width/(i.max_x-i.min_x),n=e.height/(i.max_y-i.min_y),s=e=>e.map(([e,t])=>`${e},${t}`).join(" ");return q`
      <g
        class="ghost"
        transform="translate(${-e.width/2} ${-e.height/2}) scale(${o} ${n}) translate(${-i.min_x} ${-i.min_y})"
      >
        ${t.rooms.map(e=>q`<polygon class="ghost-room" points=${s(e)}></polygon>`)}
        ${t.walls.map(e=>q`<polyline class="ghost-wall" points=${s(e)}></polyline>`)}
      </g>
    `}_renderPlacement(e){const t=e.id===this.selectedPlacementId,i=e.label_override||this.floorNameById.get(e.floor_id)||e.floor_id,o=this._pxToUnits(7),n=this._pxToUnits(26);return q`
      <g transform="translate(${e.x} ${e.y}) rotate(${e.rotation_deg})">
        <rect
          class="placement-rect ${t?"selected":""}"
          x=${-e.width/2}
          y=${-e.height/2}
          width=${e.width}
          height=${e.height}
        ></rect>
        ${this._renderGhost(e)}
        <text class="placement-label" y=${-e.height/2-o}>${i}</text>
        ${t?q`
              <line
                class="rotate-stick"
                x1="0" y1=${-e.height/2}
                x2="0" y2=${-e.height/2-n}
              ></line>
              <circle class="rotate-handle" cx="0" cy=${-e.height/2-n} r=${o}></circle>
              <circle class="resize-handle" cx=${-e.width/2} cy=${-e.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${e.width/2} cy=${-e.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${e.width/2} cy=${e.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${-e.width/2} cy=${e.height/2} r=${o}></circle>
            `:K}
      </g>
    `}_renderMeshLink(e){const t=null!==e.from.floorId||null!==e.to.floorId;return q`
      <line
        class="mesh-link ${t?"indoor":""} ${e.key===this.selectedMeshLinkKey?"selected":this.selectedMeshLinkKey?"dim":""}"
        x1=${e.from.x}
        y1=${e.from.y}
        x2=${e.to.x}
        y2=${e.to.y}
        style="stroke:${Be(e.quality)}"
      >
        <title>${e.from.label} → ${e.to.label}: ${e.detail??e.quality}</title>
      </line>
    `}_renderIndoorEnds(){const e=this._pxToUnits(5),t=new Map;for(const e of this.meshLinks)for(const i of[e.from,e.to])null!==i.floorId&&t.set(i.deviceId,i);return[...t.values()].map(t=>q`
        <circle class="indoor-end" cx=${t.x} cy=${t.y} r=${e}>
          <title>${t.label}</title>
        </circle>
      `)}_renderPin(e){return this._pinIcons.renderMarker(e.x,e.y,this._pxToUnits(12),this._pinIcons.iconForPin(e,this.entityLookup.values()),"var(--sc-accent)",e.id===this.selectedPinId,e.label_override??be(e.device_id,this.entityLookup.values()))}render(){const e=this._viewBox;return V`
      ${this.mapBackground?V`<div class="map-layer"></div>
              ${this._mapError?V`<div class="map-error">
                      ${Pe("mapBackground.failed",{error:this._mapError})}
                    </div>`:K}`:K}
      ${this._renderBackgroundOverlay()}
      ${q`
        <svg
          viewBox="${e.x} ${e.y} ${e.w} ${e.h}"
          class="${"place"===this.mode||"place-pin"===this.mode?"place-mode":""}"
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
      ${this.mapBackground?V`<div class="map-attribution">
              ${"aerial"===this.mapBackground.style?"Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community":V`©
                      <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noopener noreferrer"
                        >OpenStreetMap</a
                      >
                      contributors`}
            </div>`:K}
      <div class="controls">
        <button
          @click=${()=>this._zoomButton(.87)}
          title=${Pe("canvasControls.zoomIn")}
          aria-label=${Pe("canvasControls.zoomIn")}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
        <button
          @click=${()=>this._zoomButton(1.15)}
          title=${Pe("canvasControls.zoomOut")}
          aria-label=${Pe("canvasControls.zoomOut")}
        >
          <ha-icon icon="mdi:minus"></ha-icon>
        </button>
        <button
          @click=${()=>this.fitToScreen()}
          title=${Pe("canvasControls.fit")}
          aria-label=${Pe("canvasControls.fit")}
        >
          <ha-icon icon="mdi:fit-to-screen-outline"></ha-icon>
        </button>
      </div>
    `}};pi.styles=[Et,qt,di],e([ue({attribute:!1})],pi.prototype,"placements",void 0),e([ue({attribute:!1})],pi.prototype,"ghosts",void 0),e([ue({attribute:!1})],pi.prototype,"floorNameById",void 0),e([ue({attribute:!1})],pi.prototype,"floorIconById",void 0),e([ue({attribute:!1})],pi.prototype,"backgroundImageUrl",void 0),e([ue({type:Number})],pi.prototype,"backgroundOpacity",void 0),e([ue({type:Number})],pi.prototype,"backgroundOffsetX",void 0),e([ue({type:Number})],pi.prototype,"backgroundOffsetY",void 0),e([ue({type:Number})],pi.prototype,"backgroundScale",void 0),e([ue({attribute:!1})],pi.prototype,"mode",void 0),e([ue({attribute:!1})],pi.prototype,"selectedPlacementId",void 0),e([ue({attribute:!1})],pi.prototype,"pins",void 0),e([ue({attribute:!1})],pi.prototype,"selectedPinId",void 0),e([ue({attribute:!1})],pi.prototype,"entityLookup",void 0),e([ue({attribute:!1})],pi.prototype,"meshLinks",void 0),e([ue({attribute:!1})],pi.prototype,"selectedMeshLinkKey",void 0),e([ue({attribute:!1})],pi.prototype,"initialViewBox",void 0),e([ue({attribute:!1})],pi.prototype,"mapBackground",void 0),e([ue({type:Boolean,reflect:!0})],pi.prototype,"dark",void 0),e([ue({attribute:!1})],pi.prototype,"hass",void 0),e([ge()],pi.prototype,"_mapError",void 0),e([ge()],pi.prototype,"_viewBox",void 0),e([ge()],pi.prototype,"_naturalHeight",void 0),e([_e("svg")],pi.prototype,"_svg",void 0),pi=e([me("property-canvas")],pi);let ui=class extends ce{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1}render(){return V`
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
        <span>${Pe("floorTabs.property")}</span>
      </button>
    `}};ui.styles=[Et,r`
      :host {
        display: flex;
        height: 100%;
      }
      button {
        height: 100%;
        border-radius: 0;
        padding: 0 var(--ha-space-6, 24px);
        font-size: var(--sc-fs-body);
        font-weight: 400;
        letter-spacing: normal;
        text-transform: none;
        color: var(--sc-fg);
        border-bottom: 2px solid transparent;
        display: inline-flex;
        align-items: center;
        gap: var(--ha-space-2, 8px);
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
        margin-inline-start: auto;
      }
      :host > :last-child {
        margin-inline-end: auto;
      }
      .divider {
        width: 1px;
        height: 24px;
        align-self: center;
        background: var(--sc-divider);
        margin: 0 var(--ha-space-1, 4px);
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
      /* Tabs get a row of their own on narrow screens (see app-header),
       * so names stay visible — an icon alone rarely tells floors apart. */
      @media (max-width: 600px) {
        button {
          padding: 0 var(--ha-space-3, 12px);
          white-space: nowrap;
          flex: none;
        }
      }
    `],e([ue({attribute:!1})],ui.prototype,"floors",void 0),e([ue({attribute:!1})],ui.prototype,"selectedFloorId",void 0),e([ue({type:Boolean})],ui.prototype,"propertySelected",void 0),ui=e([me("floor-tabs")],ui);let gi=class extends ce{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1,this.narrow=!1,this.page="",this.light=!1}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}render(){return this.page?V`
        <div class="identity">
          <button
            class="icon-button"
            title=${Pe("appHeader.back")}
            aria-label=${Pe("appHeader.back")}
            @click=${()=>this._fire("page-back")}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <h1 class="crumb">${Pe(`appHeader.${this.page}`)}</h1>
        </div>
      `:V`
      <div class="identity">
        ${this.narrow?V` <button
                class="icon-button menu-button"
                title=${Pe("appHeader.menu")}
                aria-label=${Pe("appHeader.menu")}
                @click=${()=>this._fire("hass-toggle-menu")}
              >
                <ha-icon icon="mdi:menu"></ha-icon>
              </button>`:K}
        <span class="brand-mark" aria-hidden="true"></span>
        <h1>Spatial Context</h1>
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
          title=${Pe("menu.settings")}
          aria-label=${Pe("menu.settings")}
          @click=${()=>this._fire("open-settings")}
        >
          <ha-icon icon="mdi:cog"></ha-icon>
        </button>
        <slot name="end"></slot>
      </div>
    `}};gi.styles=[Et,r`
      :host {
        /* The brand mark's blue: a touch brighter on a dark theme. */
        --sc-brand: #03a9f4;
      }
      :host([light]) {
        --sc-brand: #039be5;
      }
      :host {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        height: 56px;
        padding: 0 var(--ha-space-2, 8px) 0 var(--ha-space-1, 4px);
        background: var(--sc-header-bg);
        border-bottom: 1px solid var(--sc-divider);
      }
      .identity {
        display: flex;
        align-items: center;
        gap: var(--ha-space-3, 12px);
        min-width: 0;
        overflow: hidden;
      }
      .identity .menu-button {
        flex: none;
        width: 40px;
        height: var(--sc-h-control);
        margin-inline-end: -4px;
      }
      .identity .brand-mark {
        flex: none;
        width: 24px;
        height: 24px;
        margin-inline-start: var(--ha-space-4, 16px);
        background: var(--sc-brand, #03a9f4);
        -webkit-mask: url(/spatial_context/spatial-context-mark.svg) center /
          contain no-repeat;
        mask: url(/spatial_context/spatial-context-mark.svg) center / contain
          no-repeat;
      }
      .identity .menu-button + .brand-mark {
        margin-inline-start: 0;
      }
      .identity h1.crumb {
        font-size: var(--sc-fs-title);
        font-weight: 500;
      }
      .identity h1 {
        margin: 0;
        font-size: var(--sc-fs-header);
        font-weight: 400;
        line-height: 1.2;
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
      /* Narrow screens (HA's own mobile breakpoint): the identity block
       * and seven action icons leave the middle column no width at all,
       * so the floor tabs drop to a second, full-width row that scrolls
       * sideways when there are more floors than fit (#21). */
      @media (max-width: 870px) {
        :host {
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-rows: 56px 48px;
          grid-template-areas:
            "identity actions"
            "tabs tabs";
          height: auto;
          padding: 0;
        }
        .identity {
          grid-area: identity;
          padding-inline-start: var(--ha-space-1, 4px);
        }
        .actions {
          grid-area: actions;
          padding-inline-end: var(--ha-space-2, 8px);
        }
        floor-tabs {
          grid-area: tabs;
          border-top: 1px solid var(--sc-divider);
        }
      }
      @media (max-width: 600px) {
        /* Seven header actions (incl. undo/redo) need to fit a phone. */
        .icon-button {
          width: 40px;
          height: var(--sc-h-control);
        }
      }
      @media (max-width: 600px) {
        /* On a phone only the mark shows (the name would crowd the icons). */
        .identity h1:not(.crumb) {
          display: none;
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
        background: var(--sc-hover);
      }
    `],e([ue({attribute:!1})],gi.prototype,"floors",void 0),e([ue({attribute:!1})],gi.prototype,"selectedFloorId",void 0),e([ue({type:Boolean})],gi.prototype,"propertySelected",void 0),e([ue({type:Boolean})],gi.prototype,"narrow",void 0),e([ue()],gi.prototype,"page",void 0),e([ue({type:Boolean,reflect:!0})],gi.prototype,"light",void 0),gi=e([me("app-header")],gi);let _i=class extends ce{constructor(){super(...arguments),this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1}_fire(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}render(){return V`
      <button
        title=${Pe("rowActions.undo")}
        aria-label=${Pe("rowActions.undo")}
        ?disabled=${!this.canUndo}
        @click=${()=>this._fire("undo-click")}
      >
        <ha-icon icon="mdi:undo"></ha-icon>
      </button>
      <button
        title=${Pe("rowActions.redo")}
        aria-label=${Pe("rowActions.redo")}
        ?disabled=${!this.canRedo}
        @click=${()=>this._fire("redo-click")}
      >
        <ha-icon icon="mdi:redo"></ha-icon>
      </button>
      <button
        title=${this.saving?Pe("appHeader.saving"):Pe("appHeader.save")}
        aria-label=${this.saving?Pe("appHeader.saving"):Pe("appHeader.save")}
        ?disabled=${this.saving}
        @click=${()=>this._fire("save-click")}
      >
        <ha-icon icon="mdi:content-save"></ha-icon>
        ${this.dirty?V`<span class="dirty-dot"></span>`:K}
      </button>
    `}};_i.styles=[Et,r`
      :host {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      button {
        position: relative;
        display: grid;
        place-items: center;
        width: 40px;
        height: var(--sc-h-control);
        padding: 0;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-panel-bg);
      }
      button:disabled {
        background: var(--sc-panel-bg);
      }
      ha-icon {
        --mdc-icon-size: 20px;
      }
      .dirty-dot {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--sc-danger);
      }
    `],e([ue({type:Boolean})],_i.prototype,"dirty",void 0),e([ue({type:Boolean})],_i.prototype,"saving",void 0),e([ue({type:Boolean})],_i.prototype,"canUndo",void 0),e([ue({type:Boolean})],_i.prototype,"canRedo",void 0),_i=e([me("row-actions")],_i);const mi=r`
  /* HA map-panel style info card. */
  .info-card {
    position: absolute;
    top: 68px;
    left: 12px;
    width: min(340px, calc(100% - 24px));
    max-height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 8px);
    padding: var(--ha-space-2, 8px);
    border-radius: var(--ha-border-radius-4xl, 28px);
    pointer-events: auto;
  }
  .info-head {
    display: flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    padding: var(--ha-space-1, 4px) var(--ha-space-1, 4px) 0;
  }
  .info-close {
    display: grid;
    place-items: center;
    flex: none;
    width: 40px;
    height: var(--sc-h-control);
    padding: 0;
    border-radius: 50%;
  }
  .info-titles {
    min-width: 0;
    flex: 1;
  }
  .info-toggle {
    display: grid;
    place-items: center;
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
  }
  /* Phones: the card spans the width under the controls row, and its
   * chevron folds it to just the header so the map stays workable with the
   * thing still selected. */
  @media (max-width: 700px) {
    .info-card {
      top: 56px;
      left: 0;
      right: 0;
      width: auto;
      max-height: 60%;
      border-radius: 0 0 28px 28px;
    }
  }
  .info-title {
    font-size: var(--sc-fs-title);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
  .info-sub {
    font-size: var(--sc-fs-small);
    color: var(--sc-fg-secondary);
  }
  .info-body {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 8px);
    min-height: 0;
    overflow-y: auto;
  }
  .info-group {
    /* Don't shrink to fit the card: the body scrolls instead. */
    flex: none;
    padding: var(--ha-space-1, 4px) 0;
    border-radius: var(--ha-border-radius-3xl, 24px);
    overflow: hidden;
    background: var(--primary-background-color, var(--sc-bg));
  }
  .info-group-title {
    padding: var(--ha-space-2, 8px) var(--ha-space-4, 16px) 0;
    font-size: var(--sc-fs-caption);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sc-fg-secondary);
  }
  .info-row {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    min-height: 48px;
    padding: 6px var(--ha-space-4, 16px);
    font-size: var(--sc-fs-row);
    text-align: start;
  }
  .info-row.action {
    justify-content: flex-start;
    border-radius: 0;
  }
  .info-row.action:hover {
    background: var(--sc-hover);
  }
  /* A device row in the stack: the whole row is the hover target (the
   * name and the remove button sit inside it), not each button. */
  .info-row.stack-row:hover {
    background: var(--sc-hover);
  }
  .info-row.stack-row button:hover:not(:disabled):not(.primary) {
    background-image: none;
  }
  .info-row.stack-row .stack-remove:hover:not(:disabled):not(.primary) {
    background-image: linear-gradient(
      color-mix(in srgb, var(--sc-danger) 16%, transparent),
      color-mix(in srgb, var(--sc-danger) 16%, transparent)
    );
  }
  .info-row.action.active {
    color: var(--sc-accent);
  }
  .info-row ha-icon {
    --mdc-icon-size: 22px;
    color: var(--sc-fg-secondary);
  }
  .info-row.action.active ha-icon {
    color: var(--sc-accent);
  }
  .info-row .grow {
    flex: 1;
    min-width: 0;
  }
  .info-row select {
    max-width: 180px;
    border-radius: var(--sc-r-control);
  }
  .inline-pair {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  /* Two lines per link: "Device - Floor", then its signal detail. */
  .link-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .link-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .link-detail {
    font-size: var(--sc-fs-small);
  }
  .quality-dot {
    flex: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .info-row.stack-row {
    padding: 0 var(--ha-space-1, 4px) 0 0;
  }
  .stack-choose {
    flex: 1;
    min-width: 0;
    padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
    border-radius: 0;
    text-align: start;
    justify-content: flex-start;
  }
  .stack-remove {
    display: grid;
    place-items: center;
    width: 36px;
    height: var(--sc-h-field);
    padding: 0;
    border-radius: 50%;
    color: var(--sc-danger);
  }
  .info-foot {
    display: flex;
    gap: var(--ha-space-2, 8px);
    padding: 0 var(--ha-space-1, 4px) var(--ha-space-1, 4px);
  }
  .info-foot button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ha-space-2, 8px);
    min-height: 44px;
    padding: 10px var(--ha-space-4, 16px);
    border-radius: 22px;
    font-size: var(--sc-fs-row);
  }
  .info-foot button.danger {
    background: color-mix(in srgb, var(--sc-danger) 14%, transparent);
  }
  /* Controls inside the info card: HA-style rounded fields. */
  .info-row select,
  .info-row input[type="text"],
  .info-row input[type="number"] {
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    color: var(--sc-fg);
    font: inherit;
    font-size: var(--sc-fs-body);
  }
  .info-row select:focus,
  .info-row input[type="text"]:focus,
  .info-row input[type="number"]:focus {
    outline: none;
    border-color: var(--sc-accent);
  }
  .info-row .select-wrap select {
    padding-inline-end: var(--ha-space-8, 32px);
  }
  .wall-thickness {
    width: 72px;
  }
  .text-field {
    width: 170px;
    min-width: 0;
  }
  .text-field.short {
    width: 90px;
  }
`;function vi(e){return V`
    <div class="info-card floating-panel">
      <div class="info-head">
        <button
          class="info-close"
          title=${Pe("canvas.button.close")}
          aria-label=${Pe("canvas.button.close")}
          @click=${e.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
        <div class="info-titles">
          <div class="info-title">${e.title}</div>
          ${e.subtitle?V`<div class="info-sub">${e.subtitle}</div>`:K}
        </div>
        ${e.onToggle?V`<button
                class="info-toggle"
                title=${Pe(e.collapsed?"canvas.card.show":"canvas.card.hide")}
                aria-label=${Pe(e.collapsed?"canvas.card.show":"canvas.card.hide")}
                aria-expanded=${e.collapsed?"false":"true"}
                @click=${e.onToggle}
              >
                <ha-icon
                  icon=${e.collapsed?"mdi:chevron-down":"mdi:chevron-up"}
                ></ha-icon>
              </button>`:K}
      </div>
      ${e.collapsed?K:V`<div class="info-body">${e.body}</div>
              ${e.footer?V`<div class="info-foot">${e.footer}</div>`:K}`}
    </div>
  `}function yi(e,t,i,o=!1){return V`<button
    class="info-row action ${o?"active":""}"
    @click=${i}
  >
    <ha-icon icon=${e}></ha-icon>
    <span class="grow">${t}</span>
  </button>`}function fi(e,t,i){return V`<div class="info-row">
    <ha-icon icon=${e}></ha-icon>
    <span class="grow">${t}</span>
    ${i}
  </div>`}function bi(e){return V`<span class="select-wrap"
    >${e}<ha-icon class="chev" icon="mdi:menu-down"></ha-icon
  ></span>`}function wi(e,t){return V`<button class="danger" @click=${t}>
    <ha-icon icon="mdi:delete"></ha-icon> ${e}
  </button>`}function ki(e,t){const i={strong:0,medium:1,weak:2,unknown:3},o=[...t].sort((e,t)=>i[e.quality]-i[t.quality]);return V`<div class="info-group">
    <div class="info-group-title">
      ${e} ·
      ${Pe("canvas.card.links",{count:o.length})}
    </div>
    ${0===o.length?V`<div class="info-row">
            <span class="grow info-sub"
              >${Pe("canvas.card.noLinks")}</span
            >
          </div>`:o.map(e=>{const t=e.where?`${e.name} - ${e.where}`:e.name;return V`<div class="info-row link-row">
              <span
                class="quality-dot"
                style="background:${Be(e.quality)}"
              ></span>
              <span class="link-text">
                <span class="link-name" title=${t}>${t}</span>
                <span
                  class="link-detail"
                  style="color:${Be(e.quality)}"
                  >${e.detail}</span
                >
              </span>
            </div>`})}
  </div>`}const xi=[{key:"primary",label:"Primary",cssVar:"--primary-color",fallback:"#03a9f4"},{key:"accent",label:"Accent",cssVar:"--accent-color",fallback:"#ff9800"},{key:"red",label:"Red",cssVar:"--red-color",fallback:"#f44336"},{key:"pink",label:"Pink",cssVar:"--pink-color",fallback:"#e91e63"},{key:"purple",label:"Purple",cssVar:"--purple-color",fallback:"#926bc7"},{key:"deep-purple",label:"Deep purple",cssVar:"--deep-purple-color",fallback:"#6e41ab"},{key:"indigo",label:"Indigo",cssVar:"--indigo-color",fallback:"#3f51b5"},{key:"blue",label:"Blue",cssVar:"--blue-color",fallback:"#2196f3"},{key:"light-blue",label:"Light blue",cssVar:"--light-blue-color",fallback:"#03a9f4"},{key:"cyan",label:"Cyan",cssVar:"--cyan-color",fallback:"#00bcd4"},{key:"teal",label:"Teal",cssVar:"--teal-color",fallback:"#009688"},{key:"green",label:"Green",cssVar:"--green-color",fallback:"#4caf50"},{key:"light-green",label:"Light green",cssVar:"--light-green-color",fallback:"#8bc34a"},{key:"lime",label:"Lime",cssVar:"--lime-color",fallback:"#cddc39"},{key:"yellow",label:"Yellow",cssVar:"--yellow-color",fallback:"#ffeb3b"},{key:"amber",label:"Amber",cssVar:"--amber-color",fallback:"#ffc107"},{key:"orange",label:"Orange",cssVar:"--orange-color",fallback:"#ff9800"},{key:"deep-orange",label:"Deep orange",cssVar:"--deep-orange-color",fallback:"#ff5722"},{key:"brown",label:"Brown",cssVar:"--brown-color",fallback:"#795548"},{key:"light-grey",label:"Light grey",cssVar:"--light-grey-color",fallback:"#bdbdbd"},{key:"grey",label:"Grey",cssVar:"--grey-color",fallback:"#9e9e9e"},{key:"dark-grey",label:"Dark grey",cssVar:"--dark-grey-color",fallback:"#616161"},{key:"blue-grey",label:"Blue grey",cssVar:"--blue-grey-color",fallback:"#607d8b"},{key:"black",label:"Black",cssVar:"--black-color",fallback:"#000000"},{key:"white",label:"White",cssVar:"--white-color",fallback:"#ffffff"}];let $i;function Pi(e,t){return function(e,t){if(void 0===$i&&($i=document.createElement("canvas").getContext("2d")),!$i)return t;$i.fillStyle=t,$i.fillStyle=e;const i=$i.fillStyle;return"string"==typeof i&&i.startsWith("#")?i:t}(getComputedStyle(e).getPropertyValue(t.cssVar).trim()||t.fallback,t.fallback)}const Ii=r`
  .mesh-legend {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px 16px;
    max-width: calc(100% - 24px);
    padding: 6px var(--ha-space-4, 16px);
    border-radius: var(--ha-border-radius-2xl, 20px);
    font-size: var(--sc-fs-caption);
    color: var(--sc-fg-secondary);
    pointer-events: none;
  }
  .mesh-legend .key {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  .mesh-legend .scale {
    position: relative;
    pointer-events: auto;
    outline: none;
  }
  .mesh-legend .scale ha-icon {
    --mdc-icon-size: 16px;
  }
  /* A popover rather than a title attribute: native tooltips wait a second
   * or more before showing, and never show on touch. Focus covers a tap on
   * a phone and keyboard users. */
  .mesh-legend .hint {
    display: none;
    position: absolute;
    bottom: calc(100% + 14px);
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: min(300px, 80vw);
    padding: 8px 12px;
    color: var(--sc-fg);
    white-space: normal;
    text-align: center;
  }
  .mesh-legend .scale:hover .hint,
  .mesh-legend .scale:focus .hint,
  .mesh-legend .scale:focus-within .hint {
    display: block;
  }
  /* Moving along the bar reads off the value under the pointer. */
  .mesh-legend .bar {
    position: relative;
    display: flex;
    align-items: center;
    width: 96px;
    height: 16px;
  }
  .mesh-legend .gradient {
    width: 100%;
    height: 6px;
    border-radius: 3px;
  }
  .mesh-legend .marker {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    margin-left: -1px;
    border-radius: 1px;
    background: var(--sc-fg);
  }
  .mesh-legend .live {
    display: none;
    margin-top: 4px;
    font-weight: 500;
  }
  .mesh-legend .swatch {
    width: 18px;
    height: 4px;
    border-radius: 2px;
  }
  .mesh-legend .dash {
    width: 22px;
    border-top: 2px dashed var(--sc-fg-secondary);
  }
`;function Si(e,t){return Pe("lqi"===t?"legend.lqi":"legend.dbm",{value:String(e).replace("-","−")})}function Mi(e,t){const{range:i}=t,o=e.currentTarget,n=o.closest(".scale")?.querySelector(".live"),s=o.querySelector(".marker");if(!i||!n||!s)return;const r=o.getBoundingClientRect(),a=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),l=Math.round(i.min+a*(i.max-i.min));s.style.left=100*a+"%",s.style.display="block",n.textContent=`${Si(l,i.unit)} · ${Pe(`legend.${function(e,t){return"zigbee"===e.network?Ae(t):"bluetooth"===e.network?ze(t):Re(t)}(t,l)}`)}`,n.style.display="block"}function Ci(e){const t=e.currentTarget,i=t.closest(".scale")?.querySelector(".live"),o=t.querySelector(".marker");i&&(i.style.display="none"),o&&(o.style.display="none")}function Li(e){const t=`linear-gradient(to right, ${Be("weak")}, ${Be("medium")}, ${Be("strong")})`,{range:i}=e;return V`<div class="mesh-legend floating-panel">
    <span class="key scale" tabindex="0">
      <span
        >${Pe("legend.weak")}${i?` (${Si(i.min,i.unit)})`:K}</span
      >
      <span
        class="bar"
        @pointermove=${t=>Mi(t,e)}
        @pointerdown=${t=>Mi(t,e)}
        @pointerleave=${Ci}
      >
        <span class="gradient" style="background:${t}"></span>
        <span class="marker"></span>
      </span>
      <span
        >${Pe("legend.strong")}${i?` (${Si(i.max,i.unit)})`:K}</span
      >
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span class="hint floating-panel" role="tooltip">
        <span>${Pe(`legend.hint.${e.network}`)}</span>
        <span class="live"></span>
      </span>
    </span>
    ${e.unknown?V`<span class="key">
            <span
              class="swatch"
              style="background:${Be("unknown")}"
            ></span>
            ${Pe("legend.unknown")}
          </span>`:K}
    ${e.dashed?V`<span class="key">
            <span class="dash"></span>
            ${Pe("floor"===e.dashed?"legend.dashedFloor":"legend.dashedProperty")}
          </span>`:K}
  </div>`}const Ti=r`
  :host {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .mode-toolbar {
    pointer-events: auto;
  }
  .mode-toolbar button {
    display: flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    padding: 6px 10px;
    border-radius: 10px;
  }
  /* A thin divider between tool groups: view, draw, place/align. */
  .tool-divider {
    align-self: stretch;
    width: 1px;
    margin: 6px var(--ha-space-1, 4px);
    background: var(--sc-divider);
  }
  .mode-toolbar ha-icon {
    --mdc-icon-size: 20px;
  }
  /* Tonal active state, like HA's selected chips and tabs: the primary
   * colour at low strength behind a primary icon. */
  .mode-toolbar button.active {
    background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
    color: var(--sc-accent);
  }
  .mode-toolbar button.active ha-icon {
    color: var(--sc-accent);
  }
  .hint-bar {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    pointer-events: auto;
  }
  .snap-select {
    padding: var(--ha-space-1, 4px);
  }
  .hint {
    font-size: var(--sc-fs-small);
    color: var(--sc-fg-secondary);
  }
  .color-field {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-2, 8px) 0 10px;
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    font-size: var(--sc-fs-body);
  }
  .swatch {
    flex: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--sc-fg) 25%, transparent);
  }
  .custom-swatch {
    background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
  }
  .color-list {
    max-height: 260px;
    overflow-y: auto;
    margin: 0 var(--ha-space-2, 8px) var(--ha-space-1, 4px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--ha-border-radius-xl, 16px);
    background: var(--sc-panel-bg);
  }
  .color-item {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    min-height: 44px;
    padding: 6px 14px;
    border-radius: 0;
    font-size: var(--sc-fs-row);
    text-align: start;
    justify-content: flex-start;
    cursor: pointer;
  }
  .color-item:hover {
    background: var(--sc-hover);
  }
  .color-item.selected {
    color: var(--sc-accent);
  }
  .color-item .grow {
    flex: 1;
    min-width: 0;
  }
  .color-item ha-icon {
    --mdc-icon-size: 20px;
    color: var(--sc-accent);
  }
  .color-item .room-fill-color {
    width: 36px;
    height: 24px;
  }
  .small-unit-select {
    width: auto;
  }
  .room-fill-color {
    -webkit-appearance: none;
    appearance: none;
    width: 44px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--sc-divider);
    border-radius: 10px;
    background: none;
    cursor: pointer;
    overflow: hidden;
  }
  .room-fill-color::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  .room-fill-color::-webkit-color-swatch {
    border: none;
  }
  .room-fill-color::-moz-color-swatch {
    border: none;
  }
  .room-opacity {
    width: 140px;
  }
`;let Ei=class extends ce{constructor(){super(...arguments),this.mode="select",this.armedOpeningType=null,this.hasPendingTrace=!1,this.hasPendingWall=!1,this.snapMode="all",this.pendingScaleCount=0,this.selectedRoom=null,this.editingRoom=!1,this.areas=[],this.selectedPin=null,this.multiPinCount=0,this.selectedWall=null,this.editingWall=!1,this.unitSystem="metric",this.unitsPerMeter=null,this.pinStack=null,this.entityLookup=new Map,this.selectedOpening=null,this._colorOpen=!1,this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1,this.meshLegend=null,this.meshLinks=[],this.meshStubs=[],this.networkLabel=null,this.selectedMeshLink=null,this.selectedMeshStub=null,this.otherFloors=[],this.alignTargetFloorId=null,this.alignTargetHasBackground=!0,this._wallThicknessUnit=null,this._openingWidthUnit=null,this._cardCollapsed=!1,this._card=e=>vi({...e,collapsed:this._cardCollapsed,onToggle:()=>this._cardCollapsed=!this._cardCollapsed}),this._actionRow=yi,this._fieldRow=fi,this._selectWrap=bi,this._clearSelection=()=>this._fire("selection-clear")}willUpdate(e){e.has("selectedRoom")&&e.get("selectedRoom")?.id!==this.selectedRoom?.id&&(this._colorOpen=!1),e.has("selectedWall")&&e.get("selectedWall")?.id!==this.selectedWall?.id&&(this._wallThicknessUnit=null),e.has("selectedOpening")&&e.get("selectedOpening")?.id!==this.selectedOpening?.id&&(this._openingWidthUnit=null)}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_unitSelect(e,t){return V`
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
      aria-label=${i}
      @click=${()=>this._fire("mode-change",{mode:e})}
    >
      <ha-icon icon=${t}></ha-icon>
    </button>`}_openingModeButton(e,t,i){const o="opening"===this.mode&&this.armedOpeningType===e;return V`<button
      class=${o?"active":""}
      title=${i}
      aria-label=${i}
      @click=${()=>this._fire("add-opening-click",{openingType:e})}
    >
      <ha-icon icon=${t}></ha-icon>
    </button>`}_renderModeToolbar(){return V`
      <div class="mode-toolbar">
        ${this._modeButton("select","mdi:cursor-default-click",Pe("canvas.mode.select"))}
        ${this._modeButton("pan","mdi:hand-back-right-outline",Pe("canvas.mode.pan"))}
        <span class="tool-divider"></span>
        ${this._modeButton("trace","mdi:vector-square",Pe("canvas.mode.trace"))}
        ${this._modeButton("wall","mdi:wall",Pe("canvas.mode.wall"))}
        ${this._openingModeButton("door","mdi:door",Pe("canvas.mode.door"))}
        ${this._openingModeButton("window","mdi:window-closed-variant",Pe("canvas.mode.window"))}
        ${this._modeButton("scale","mdi:ruler",Pe("canvas.mode.scale"))}
        <span class="tool-divider"></span>
        ${this._modeButton("place","mdi:map-marker-plus",Pe("canvas.mode.place"))}
        ${this._modeButton("align","mdi:compare",Pe("canvas.mode.align"))}
      </div>
    `}_renderSnapSelect(){return V`<select
      class="snap-select"
      title=${Pe("canvas.snap.tooltip")}
      @change=${e=>this._fire("snap-mode-change",{snapMode:e.target.value})}
    >
      <option value="all" ?selected=${"all"===this.snapMode}>
        ${Pe("canvas.snap.all")}
      </option>
      <option value="same" ?selected=${"same"===this.snapMode}>
        ${"wall"===this.mode?Pe("canvas.snap.walls"):Pe("canvas.snap.rooms")}
      </option>
      <option value="off" ?selected=${"off"===this.snapMode}>
        ${Pe("canvas.snap.off")}
      </option>
    </select>`}_renderHintBar(){return"trace"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${this.hasPendingTrace?Pe("canvas.hint.closeRoom"):Pe("canvas.hint.addPoints")}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingTrace?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Pe("canvas.button.cancel")}
              </button>`:K}
      </div>`:"wall"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${this.hasPendingWall?Pe("canvas.hint.addWallPointsFinish"):Pe("canvas.hint.addWallPoints")}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingWall?V`<button
                class="primary"
                @click=${()=>this._fire("finish-wall-click")}
              >
                ${Pe("canvas.button.finishWall")}
              </button>`:K}
        ${this.hasPendingWall?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Pe("canvas.button.cancel")}
              </button>`:K}
      </div>`:"scale"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${0===this.pendingScaleCount?Pe("canvas.hint.scaleFirst"):Pe("canvas.hint.scaleSecond")}</span
        >
        ${this.pendingScaleCount>0?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Pe("canvas.button.cancel")}
              </button>`:K}
      </div>`:"opening"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${Pe("canvas.hint.placeOpening",{type:Pe(`canvas.openingType.${this.armedOpeningType??"opening"}`)})}</span
        >
      </div>`:"align"===this.mode?this._renderAlignBar():"select"===this.mode&&this.multiPinCount>1?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${Pe("canvas.hint.multiSelected",{count:String(this.multiPinCount)})}</span
        >
        <button @click=${()=>this._fire("multi-pin-clear")}>
          ${Pe("canvas.button.clearSelection")}
        </button>
      </div>`:K}_renderAlignBar(){return this.alignTargetFloorId?this.alignTargetHasBackground?V`<div class="hint-bar floating-panel">
      <span class="hint">${Pe("canvas.hint.alignDrag")}</span>
      <button
        title=${Pe("canvas.align.shrink")}
        aria-label=${Pe("canvas.align.shrink")}
        @click=${()=>this._fire("align-scale-click",{factor:.995})}
      >
        −
      </button>
      <button
        title=${Pe("canvas.align.grow")}
        aria-label=${Pe("canvas.align.grow")}
        @click=${()=>this._fire("align-scale-click",{factor:1.0050251})}
      >
        +
      </button>
      <button class="primary" @click=${()=>this._fire("align-apply-click")}>
        ${Pe("canvas.button.apply")}
      </button>
      <button @click=${()=>this._fire("align-cancel-click")}>
        ${Pe("canvas.button.cancel")}
      </button>
    </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint">${Pe("canvas.hint.noBackground")}</span>
        <button
          @click=${()=>this._fire("align-target-change",{floorId:null})}
        >
          ${Pe("canvas.button.chooseAnother")}
        </button>
        <button @click=${()=>this._fire("align-cancel-click")}>
          ${Pe("canvas.button.cancel")}
        </button>
      </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint">${Pe("canvas.hint.alignAgainst")}</span>
        <select
          @change=${e=>this._fire("align-target-change",{floorId:e.target.value})}
        >
          <option value="" selected>${Pe("canvas.align.choose")}</option>
          ${this.otherFloors.map(e=>V`<option value=${e.floor_id}>${e.name}</option>`)}
        </select>
        <button @click=${()=>this._fire("align-cancel-click")}>
          ${Pe("canvas.button.cancel")}
        </button>
      </div>`}_areaOptions(e,t){return e.map(e=>V`<option
          value=${e.area_id}
          ?selected=${e.area_id===t}
        >
          ${e.name}
        </option>`)}_deleteButton(e,t){return wi(e,()=>this._fire(t))}_renderColourPicker(e){const t=xi.map(e=>({...e,label:Pe(`colors.${e.key.replace(/-/g,"_")}`),hex:Pi(this,e)})),i=(e.fill_color??"").toLowerCase(),o=t.find(e=>e.hex.toLowerCase()===i),n=e.fill_color??Zt,s=e.fill_color?o?.label??Pe("canvas.card.colourCustom"):Pe("canvas.card.colourDefault"),r=e=>{this._colorOpen=!1,this._fire("room-fill-color-change",{color:e})};return V`
      <div class="info-row">
        <ha-icon icon="mdi:palette"></ha-icon>
        <span class="grow">${Pe("canvas.card.colour")}</span>
        <button
          class="color-field"
          aria-expanded=${this._colorOpen?"true":"false"}
          @click=${()=>this._colorOpen=!this._colorOpen}
        >
          <span class="swatch" style="background:${n}"></span>
          <span class="color-name">${s}</span>
          <ha-icon
            icon=${this._colorOpen?"mdi:menu-up":"mdi:menu-down"}
          ></ha-icon>
        </button>
      </div>
      ${this._colorOpen?V`<div class="color-list">
              ${t.map(e=>V`<button
                    class="color-item ${e.hex.toLowerCase()===i?"selected":""}"
                    @click=${()=>r(e.hex)}
                  >
                    <span class="swatch" style="background:${e.hex}"></span>
                    <span class="grow">${e.label}</span>
                    ${e.hex.toLowerCase()===i?V`<ha-icon icon="mdi:check"></ha-icon>`:K}
                  </button>`)}
              <label class="color-item custom">
                <span class="swatch custom-swatch"></span>
                <span class="grow"
                  >${Pe("canvas.card.colourCustom")}</span
                >
                <input
                  type="color"
                  class="room-fill-color"
                  .value=${n}
                  @input=${e=>this._fire("room-fill-color-change",{color:e.target.value})}
                />
              </label>
            </div>`:K}
    `}_renderDeviceNetwork(e){return this.networkLabel?ki(this.networkLabel,[...this.meshLinks.filter(t=>t.fromPin.id===e.id||t.toPin.id===e.id).map(t=>({name:this._pinLabel(t.fromPin.id===e.id?t.toPin:t.fromPin),where:"",quality:t.quality,detail:t.detail??t.quality})),...this.meshStubs.filter(t=>t.fromPin.id===e.id).map(e=>({name:e.targetLabel,where:e.targetFloorName,quality:e.quality,detail:e.detail??e.quality}))]):K}_renderSelectionPanel(){if(this.selectedRoom){const e=this.selectedRoom,t=!1!==e.visible,i=this.areas.find(t=>t.area_id===e.area_id);return this._card({title:e.name,subtitle:i?i.name:Pe("canvas.card.room"),onClose:this._clearSelection,body:V`
          <div class="info-group">
            ${this._fieldRow("mdi:floor-plan",Pe("canvas.card.area"),this._selectWrap(V`<select
                  @change=${e=>this._fire("room-area-change",{areaId:e.target.value})}
                >
                  <option value="" ?selected=${!e.area_id}>
                    ${Pe("canvas.room.custom")}
                  </option>
                  ${this._areaOptions(this.areas.filter(e=>null!==e.floor_id),e.area_id)}
                  ${this.areas.some(e=>null===e.floor_id)?V`<optgroup label=${Pe("canvas.room.outdoor")}>
                          ${this._areaOptions(this.areas.filter(e=>null===e.floor_id),e.area_id)}
                        </optgroup>`:K}
                </select>`))}
            ${this._fieldRow("mdi:pencil",Pe("canvas.card.name"),V`<input
                type="text"
                class="text-field"
                .value=${e.name}
                @change=${t=>{const i=t.target,o=i.value.trim();o?this._fire("room-name-change",{name:o}):i.value=e.name}}
              />`)}
            ${i&&i.name!==e.name?this._actionRow("mdi:home-edit-outline",Pe("canvas.room.useAreaName",{name:i.name}),()=>this._fire("room-area-change",{areaId:i.area_id})):K}
            ${this._actionRow("mdi:vector-polygon",this.editingRoom?Pe("canvas.room.doneEditing"):Pe("canvas.room.editVertices"),()=>this._fire("room-edit-vertices-click"),this.editingRoom)}
            ${e.label_position?this._actionRow("mdi:format-text-variant-outline",Pe("canvas.room.resetLabel"),()=>this._fire("room-label-reset-click")):K}
            ${this._fieldRow("mdi:eye",Pe("canvas.card.visible"),V`<input
                type="checkbox"
                class="switch"
                role="switch"
                .checked=${t}
                @change=${()=>this._fire("room-visible-toggle")}
              />`)}
          </div>
          <div class="info-group">
            <div class="info-group-title">${Pe("canvas.card.style")}</div>
            ${this._renderColourPicker(e)}
            ${this._fieldRow("mdi:opacity",Pe("canvas.room.fillOpacity"),V`<input
                type="range"
                class="room-opacity"
                min="0"
                max="1"
                step="0.02"
                style="--pct:${100*(e.fill_opacity??Jt)}%"
                .value=${String(e.fill_opacity??Jt)}
                @input=${e=>this._fire("room-fill-opacity-change",{opacity:Number(e.target.value)})}
              />`)}
            ${this._fieldRow("mdi:square-outline",Pe("canvas.room.borderOpacity"),V`<input
                type="range"
                class="room-opacity"
                min="0"
                max="1"
                step="0.02"
                style="--pct:${100*(e.border_opacity??1)}%"
                .value=${String(e.border_opacity??1)}
                @input=${e=>this._fire("room-border-opacity-change",{opacity:Number(e.target.value)})}
              />`)}
          </div>
        `,footer:this._deleteButton(Pe("canvas.room.delete"),"room-delete-click")})}if(this.selectedPin){const e=this.selectedPin;return this._card({title:this._pinLabel(e),subtitle:Pe("canvas.card.device"),onClose:this._clearSelection,body:V`<div class="info-group">
            ${this._fieldRow("mdi:tag-text",Pe("canvas.card.label"),V`<input
                type="text"
                class="text-field"
                placeholder=${be(e.device_id,this.entityLookup.values())}
                .value=${e.label_override??""}
                @change=${e=>this._fire("pin-label-change",{label:e.target.value})}
              />`)}
            ${this._actionRow("mdi:shape",Pe("canvas.pin.setIcon"),()=>this._fire("pin-set-icon-click"))}
            ${this._fieldRow("mdi:human-male-height",Pe("canvas.card.height",{unit:"imperial"===this.unitSystem?"ft":"m"}),V`<input
                type="text"
                inputmode="decimal"
                class="text-field short"
                placeholder=${"imperial"===this.unitSystem?"6":"1.8"}
                .value=${null===e.height_m?"":Pt(e.height_m,this.unitSystem)}
                @change=${e=>this._fire("pin-height-change",{value:e.target.value})}
              />`)}
          </div>
          ${this._renderDeviceNetwork(e)}`,footer:this._deleteButton(Pe("canvas.pin.delete"),"pin-delete-click")})}if(this.selectedWall){const e=this.selectedWall,t=this._wallThicknessUnit??Mt(this.unitSystem),i=this._thicknessInputAttrs(t);return this._card({title:Pe("canvas.card.wall"),subtitle:(()=>{const t=ut.find(t=>t.id===e.material);return t?gt(t):void 0})(),onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow("mdi:wall",Pe("canvas.wall.material"),this._selectWrap(V`<select
                @change=${e=>this._fire("wall-material-change",{material:e.target.value})}
              >
                ${ut.map(t=>V`<option
                      value=${t.id}
                      ?selected=${t.id===e.material}
                    >
                      ${gt(t)}
                    </option>`)}
              </select>`))}
          ${this._fieldRow("mdi:arrow-expand-horizontal",Pe("canvas.wall.thickness",{unit:t}),V`<span class="inline-pair"
              ><input
                type="number"
                class="wall-thickness"
                min=${i.min}
                max=${i.max}
                step=${i.step}
                .value=${Ct(mt(e),t)}
                @change=${e=>{const i=Lt(e.target.value,t);null===i||!Number.isFinite(i)||i<=0||this._fire("wall-thickness-change",{thicknessCm:i})}}
              />${this._unitSelect(t,e=>this._wallThicknessUnit=e)}</span
            >`)}
          ${this._actionRow("mdi:vector-polygon",this.editingWall?Pe("canvas.room.doneEditing"):Pe("canvas.room.editVertices"),()=>this._fire("wall-edit-vertices-click"),this.editingWall)}
        </div>`,footer:this._deleteButton(Pe("canvas.wall.delete"),"wall-delete-click")})}if(this.selectedOpening){const e=this.selectedOpening,t=this._openingWidthUnit??Mt(this.unitSystem),i=this._thicknessInputAttrs(t),o=this.unitsPerMeter;return this._card({title:Pe(`canvas.openingLabel.${e.type}`),subtitle:Pe("canvas.card.wallOpening"),onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow("mdi:arrow-expand-horizontal",Pe("canvas.opening.width",{unit:null!==o?t:Pe("canvas.opening.storedUnits")}),V`<span class="inline-pair"
              ><input
                type="number"
                class="wall-thickness"
                min=${null!==o?i.min:"1"}
                step=${null!==o?i.step:"1"}
                .value=${null!==o?Tt(e.width,o,t):String(e.width)}
                @change=${e=>{const i=e.target.value,n=null!==o?function(e,t,i){const o=Lt(e,i);return null===o?null:o/100*t}(i,o,t):Number(i);null===n||!Number.isFinite(n)||n<=0||this._fire("opening-width-change",{width:n})}}
              />${null!==o?this._unitSelect(t,e=>this._openingWidthUnit=e):K}</span
            >`)}
          ${null===o?V`<div class="info-row">
                  <span class="grow info-sub"
                    >${Pe("canvas.opening.calibrate")}</span
                  >
                </div>`:K}
        </div>`,footer:this._deleteButton(Pe("canvas.opening.delete"),"opening-delete-click")})}if(this.selectedMeshLink){const e=this.selectedMeshLink;return this._card({title:`${this._pinLabel(e.fromPin)} → ${this._pinLabel(e.toPin)}`,subtitle:Pe("canvas.card.link"),onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow("mdi:signal",Pe("canvas.card.quality"),V`<span style="color:${Be(e.quality)}"
              >${e.detail??e.quality}</span
            >`)}
        </div>`})}if(this.selectedMeshStub){const e=this.selectedMeshStub;return this._card({title:`${this._pinLabel(e.fromPin)} → ${e.targetLabel}`,subtitle:e.targetFloorName,onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow("mdi:signal",Pe("canvas.card.quality"),V`<span style="color:${Be(e.quality)}"
              >${e.detail??e.quality}</span
            >`)}
          ${this._actionRow("mdi:arrow-right-circle",Pe("canvas.meshStub.goToFloor"),()=>this._fire("mesh-stub-goto-floor-click"))}
        </div>`})}return K}_pinLabel(e){return e.label_override?e.label_override:be(e.device_id,this.entityLookup.values())}_renderPinStack(){if(!this.pinStack)return K;const e=this.pinStack;return this._card({title:Pe("canvas.pin.stackTitle",{count:e.length}),onClose:()=>this._fire("pin-stack-dismiss"),body:V`<div class="info-group">
        ${e.map(e=>V`
            <div class="info-row stack-row">
              <button
                class="stack-choose"
                @click=${()=>this._fire("pin-stack-choose",{pinId:e.id})}
              >
                ${this._pinLabel(e)}
              </button>
              <button
                class="stack-remove"
                title=${Pe("canvas.pin.removeFromSpot")}
                aria-label=${Pe("canvas.pin.removeFromSpot")}
                @click=${()=>this._fire("pin-stack-remove-click",{pinId:e.id})}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `)}
      </div>`})}render(){return V`
      <div class="tool-row">
        ${this._renderModeToolbar()} ${this._renderHintBar()}
        <slot name="row-end"></slot>
        <row-actions
          .dirty=${this.dirty}
          .saving=${this.saving}
          .canUndo=${this.canUndo}
          .canRedo=${this.canRedo}
        ></row-actions>
      </div>
      ${this.meshLegend?Li(this.meshLegend):K}
      ${this.pinStack?this._renderPinStack():this._renderSelectionPanel()}
    `}};Ei.styles=[Et,Bt,mi,Rt,At,zt,Ii,Ti],e([ue({attribute:!1})],Ei.prototype,"mode",void 0),e([ue({attribute:!1})],Ei.prototype,"armedOpeningType",void 0),e([ue({type:Boolean})],Ei.prototype,"hasPendingTrace",void 0),e([ue({type:Boolean})],Ei.prototype,"hasPendingWall",void 0),e([ue({attribute:!1})],Ei.prototype,"snapMode",void 0),e([ue({type:Number})],Ei.prototype,"pendingScaleCount",void 0),e([ue({attribute:!1})],Ei.prototype,"selectedRoom",void 0),e([ue({type:Boolean})],Ei.prototype,"editingRoom",void 0),e([ue({attribute:!1})],Ei.prototype,"areas",void 0),e([ue({attribute:!1})],Ei.prototype,"selectedPin",void 0),e([ue({type:Number})],Ei.prototype,"multiPinCount",void 0),e([ue({attribute:!1})],Ei.prototype,"selectedWall",void 0),e([ue({type:Boolean})],Ei.prototype,"editingWall",void 0),e([ue({attribute:!1})],Ei.prototype,"unitSystem",void 0),e([ue({type:Number})],Ei.prototype,"unitsPerMeter",void 0),e([ue({attribute:!1})],Ei.prototype,"pinStack",void 0),e([ue({attribute:!1})],Ei.prototype,"entityLookup",void 0),e([ue({attribute:!1})],Ei.prototype,"selectedOpening",void 0),e([ge()],Ei.prototype,"_colorOpen",void 0),e([ue({type:Boolean})],Ei.prototype,"dirty",void 0),e([ue({type:Boolean})],Ei.prototype,"saving",void 0),e([ue({type:Boolean})],Ei.prototype,"canUndo",void 0),e([ue({type:Boolean})],Ei.prototype,"canRedo",void 0),e([ue({attribute:!1})],Ei.prototype,"meshLegend",void 0),e([ue({attribute:!1})],Ei.prototype,"meshLinks",void 0),e([ue({attribute:!1})],Ei.prototype,"meshStubs",void 0),e([ue({attribute:!1})],Ei.prototype,"networkLabel",void 0),e([ue({attribute:!1})],Ei.prototype,"selectedMeshLink",void 0),e([ue({attribute:!1})],Ei.prototype,"selectedMeshStub",void 0),e([ue({attribute:!1})],Ei.prototype,"otherFloors",void 0),e([ue({attribute:!1})],Ei.prototype,"alignTargetFloorId",void 0),e([ue({type:Boolean})],Ei.prototype,"alignTargetHasBackground",void 0),e([ge()],Ei.prototype,"_wallThicknessUnit",void 0),e([ge()],Ei.prototype,"_openingWidthUnit",void 0),e([ge()],Ei.prototype,"_cardCollapsed",void 0),Ei=e([me("canvas-overlay")],Ei);let Oi=class extends ce{constructor(){super(...arguments),this.icon="",this.label="",this.open=!1,this.highlight=!1,this.compact=!1,this._top=0,this._right=0,this._onOutsidePress=e=>{e.composedPath().includes(this)||this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0}))}}willUpdate(e){if(e.has("open")&&this.open){const e=this.renderRoot.querySelector(".icon-button");if(e){const t=e.getBoundingClientRect();this._top=t.bottom+8,this._right=Math.max(8,window.innerWidth-t.right)}}}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onOutsidePress,!0)}updated(e){e.has("open")&&(document.removeEventListener("pointerdown",this._onOutsidePress,!0),this.open&&document.addEventListener("pointerdown",this._onOutsidePress,!0))}render(){return V`
      <button
        class="icon-button ${this.open?"active":""} ${this.highlight?"highlight":""}"
        title=${this.label}
        aria-label=${this.label}
        aria-expanded=${this.open?"true":"false"}
        @click=${()=>this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${this.open?V`<div
              class="popover floating-panel"
              style="top:${this._top}px; right:${this._right}px"
            >
              <slot></slot>
            </div>`:K}
    `}};Oi.styles=[Et,r`
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
        background: var(--sc-hover);
      }
      /* The popover's feature is switched on (e.g. a network layer is
       * showing) even while the menu is closed. */
      .icon-button.highlight {
        color: var(--sc-accent);
      }
      /* Compact: the row's own button style (40px rounded square). */
      :host([compact]) .icon-button {
        width: 40px;
        height: var(--sc-h-control);
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-panel-bg);
      }
      .popover {
        /* Fixed, placed from the button's rect, so it isn't clipped by a
         * scrolling row it sits in. */
        position: fixed;
        z-index: 10;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        min-width: 240px;
        padding: var(--ha-space-2, 8px);
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    `],e([ue()],Oi.prototype,"icon",void 0),e([ue()],Oi.prototype,"label",void 0),e([ue({type:Boolean})],Oi.prototype,"open",void 0),e([ue({type:Boolean})],Oi.prototype,"highlight",void 0),e([ue({type:Boolean,reflect:!0})],Oi.prototype,"compact",void 0),e([ge()],Oi.prototype,"_top",void 0),e([ge()],Oi.prototype,"_right",void 0),Oi=e([me("icon-popover")],Oi);const Bi=r`
  :host {
    display: flex;
    flex-direction: column;
    position: relative;
    width: var(--sc-picker-width, 300px);
    min-width: 240px;
    max-width: 600px;
    border-inline-start: 1px solid var(--sc-divider);
    background: var(--sc-panel-bg);
    height: 100%;
    overflow: hidden;
  }
  .picker-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0
      var(--ha-space-4, 16px);
  }
  .picker-title {
    font-size: var(--sc-fs-title);
  }
  .picker-close {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
  }
  /* Phones: a sheet under the canvas, not a column beside it. */
  @media (max-width: 700px) {
    :host {
      flex: 0 0 45%;
      width: 100%;
      min-width: 0;
      max-width: none;
      height: auto;
      border-inline-start: none;
      border-top: 1px solid var(--sc-divider);
    }
    .resize-handle {
      display: none;
    }
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
    padding: var(--ha-space-3, 12px);
  }
  .more-button {
    flex: none;
    display: grid;
    place-items: center;
    width: 36px;
    height: var(--sc-h-field);
    padding: 0;
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    color: var(--sc-fg-secondary);
  }
  .more-menu {
    position: absolute;
    right: 12px;
    z-index: 5;
    margin-top: var(--ha-space-1, 4px);
    min-width: 220px;
    padding: 6px;
  }
  .search-box {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    height: var(--sc-h-control);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-bg);
  }
  .search-box:focus-within {
    border-color: var(--sc-accent);
  }
  .search-box .clear {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 50%;
    color: var(--sc-fg-secondary);
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
    font-size: var(--sc-fs-body);
    color: var(--sc-fg);
  }
  .filters {
    display: flex;
    gap: var(--ha-space-2, 8px);
    margin-top: var(--ha-space-2, 8px);
  }
  .filters .select-wrap {
    flex: 1;
  }
  .filters select {
    flex: 1;
    min-width: 0;
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-bg);
    color: var(--sc-fg);
    font-size: var(--sc-fs-small);
  }
  .list {
    overflow-y: auto;
    flex: 1;
    border-top: 1px solid var(--sc-divider);
  }
  .item {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    min-height: 60px;
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    cursor: pointer;
    border-bottom: 1px solid var(--sc-divider);
  }
  .item:hover {
    background: var(--sc-hover);
  }
  .item.armed {
    background: color-mix(in srgb, var(--sc-accent) 18%, transparent);
    color: var(--sc-accent);
  }
  .item.armed .meta {
    color: var(--sc-fg-secondary);
  }
  .item.placed {
    opacity: 0.55;
  }
  .item .row-actions {
    display: flex;
    flex: none;
    gap: 2px;
  }
  .item .row-actions button {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 50%;
    color: var(--sc-fg-secondary);
  }
  .item .row-actions button:hover {
    background: var(--sc-hover);
    color: var(--sc-fg);
  }
  .item .row-actions ha-icon {
    --mdc-icon-size: 18px;
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
    height: var(--sc-h-field);
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
    font-size: var(--sc-fs-body);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item .meta {
    font-size: var(--sc-fs-caption);
    color: var(--sc-fg-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .empty {
    padding: var(--ha-space-4, 16px);
    color: var(--sc-fg-secondary);
    font-size: var(--sc-fs-body);
  }
`;var Ai;let zi=Ai=class extends ce{constructor(){super(...arguments),this._menuOpen=!1,this.entities=[],this.placedDeviceIds=new Set,this.armedEntityId=null,this.floors=[],this.areas=[],this.currentFloorId=null,this.linkedAreaIds=new Set,this._search="",this._floorFilter=null,this._areaFilter=null,this._placedFilter="all",this._onOutsidePress=e=>{e.composedPath().some(e=>e instanceof HTMLElement&&(e.classList.contains("more-menu")||e.classList.contains("more-button")))||(this._menuOpen=!1)},this._onResizeHandlePointerDown=e=>{e.preventDefault();const t=e.clientX,i=this.getBoundingClientRect().width,o=e.currentTarget;o.setPointerCapture(e.pointerId);const n=e=>{const o=t-e.clientX,n=Math.min(Ai.MAX_WIDTH,Math.max(Ai.MIN_WIDTH,i+o));this.style.setProperty("--sc-picker-width",`${n}px`)},s=e=>{o.releasePointerCapture(e.pointerId),o.removeEventListener("pointermove",n),o.removeEventListener("pointerup",s),this._writeStoredWidth(Math.round(this.getBoundingClientRect().width))};o.addEventListener("pointermove",n),o.addEventListener("pointerup",s)},this._onFloorFilterChange=e=>{const t=e.target.value;this._floorFilter="all"===t?"all":t,this._areaFilter&&!this._areasForFilter.some(e=>e.area_id===this._areaFilter)&&(this._areaFilter=null)}}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._onOutsidePress,!0)}updated(e){e.has("_menuOpen")&&(document.removeEventListener("pointerdown",this._onOutsidePress,!0),this._menuOpen&&document.addEventListener("pointerdown",this._onOutsidePress,!0))}connectedCallback(){super.connectedCallback();const e=this._readStoredWidth();null!==e&&this.style.setProperty("--sc-picker-width",`${e}px`)}_readStoredWidth(){try{const e=localStorage.getItem(Ai.WIDTH_STORAGE_KEY);if(!e)return null;const t=Number(e);return Number.isFinite(t)?Math.min(Ai.MAX_WIDTH,Math.max(Ai.MIN_WIDTH,t)):null}catch{return null}}_writeStoredWidth(e){try{localStorage.setItem(Ai.WIDTH_STORAGE_KEY,String(e))}catch{}}get _effectiveFloorFilter(){return"all"===this._floorFilter?null:this._floorFilter??this.currentFloorId}get _areasForFilter(){const e=this._effectiveFloorFilter;return null===e?this.areas:this.areas.filter(t=>this._areaIsOnFloor(t,e))}_areaIsOnFloor(e,t){return t===ve?null===e.floor_id:e.floor_id===t||t===this.currentFloorId&&this.linkedAreaIds.has(e.area_id)}get _devices(){const e=new Map;for(const t of this.entities){const i=t.device_id??t.entity_id;e.has(i)||e.set(i,[]),e.get(i).push(t)}const t=[];for(const[i,o]of e){const e=fe(i,o)??o[0];t.push({deviceId:i,deviceName:e.device_name??e.name,areaId:e.area_id,areaName:e.area_name,integrationDomain:e.integration_domain,integrationName:e.integration_name,entities:o,primaryEntityId:e.entity_id})}return t.sort((e,t)=>e.deviceName.localeCompare(t.deviceName)),t}_blockedFloorName(e){const t=e.entities.find(t=>t.entity_id===e.primaryEntityId);return t?.placed_floor_id&&t.placed_floor_id!==this.currentFloorId?t.placed_floor_name??t.placed_floor_id:null}get _filtered(){const e=this._search.trim().toLowerCase(),t=this._effectiveFloorFilter,i=this._areaFilter;return this._devices.filter(o=>{if(i){if(o.areaId!==i)return!1}else if(t){const e=this.areas.find(e=>e.area_id===o.areaId);if(!e||!this._areaIsOnFloor(e,t))return!1}if("all"!==this._placedFilter){if(this.placedDeviceIds.has(o.deviceId)!==("placed"===this._placedFilter))return!1}return!e||(o.deviceName.toLowerCase().includes(e)||(o.areaName??"").toLowerCase().includes(e)||o.entities.some(t=>t.entity_id.toLowerCase().includes(e)))})}_emitForDevice(e,t,i){e.stopPropagation(),this.dispatchEvent(new CustomEvent(t,{detail:{deviceId:i},bubbles:!0,composed:!0}))}render(){const e=this._filtered;return V`
      <div
        class="resize-handle"
        @pointerdown=${this._onResizeHandlePointerDown}
      ></div>
      <div class="picker-head">
        <span class="picker-title">${Pe("picker.title")}</span>
        <button
          class="picker-close"
          title=${Pe("canvas.button.close")}
          aria-label=${Pe("canvas.button.close")}
          @click=${()=>this.dispatchEvent(new CustomEvent("picker-close",{bubbles:!0,composed:!0}))}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="search">
        <div class="search-box">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            placeholder=${Pe("picker.search")}
            .value=${this._search}
            @input=${e=>this._search=e.target.value}
          />
          ${this._search?V`<button
                  class="clear"
                  title=${Pe("picker.clearSearch")}
                  aria-label=${Pe("picker.clearSearch")}
                  @click=${()=>this._search=""}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>`:K}
        </div>
        <div class="filters">
          <span class="select-wrap"
            ><select @change=${this._onFloorFilterChange}>
              <option value="all" ?selected=${"all"===this._floorFilter}>
                ${Pe("picker.allFloors")}
              </option>
              <option
                value=${ve}
                ?selected=${this._effectiveFloorFilter===ve}
              >
                ${Pe("picker.outdoor")}
              </option>
              ${this.floors.map(e=>V`<option
                    value=${e.floor_id}
                    ?selected=${this._effectiveFloorFilter===e.floor_id}
                  >
                    ${e.name}
                  </option>`)}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
          <span class="select-wrap"
            ><select
              @change=${e=>this._areaFilter=e.target.value||null}
            >
              <option value="" ?selected=${!this._areaFilter}>
                ${Pe("picker.allAreas")}
              </option>
              ${this._areasForFilter.map(e=>V`<option
                    value=${e.area_id}
                    ?selected=${this._areaFilter===e.area_id}
                  >
                    ${e.name}
                  </option>`)}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
          ${this.placedDeviceIds.size>0?V`<button
                  class="more-button"
                  title=${Pe("picker.more")}
                  aria-label=${Pe("picker.more")}
                  @click=${()=>this._menuOpen=!this._menuOpen}
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>`:K}
        </div>
        <div class="filters">
          <span class="select-wrap"
            ><select
              aria-label=${Pe("picker.showAll")}
              @change=${e=>this._placedFilter=e.target.value}
            >
              <option value="all" ?selected=${"all"===this._placedFilter}>
                ${Pe("picker.showAll")}
              </option>
              <option
                value="unplaced"
                ?selected=${"unplaced"===this._placedFilter}
              >
                ${Pe("picker.showUnplaced")}
              </option>
              <option
                value="placed"
                ?selected=${"placed"===this._placedFilter}
              >
                ${Pe("picker.showPlaced")}
              </option></select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
        </div>
        ${this._menuOpen&&this.placedDeviceIds.size>0?V`<div class="more-menu floating-panel">
                <button
                  class="menu-item danger"
                  @click=${()=>{this._menuOpen=!1,this.dispatchEvent(new CustomEvent("clear-all-pins",{bubbles:!0,composed:!0}))}}
                >
                  <ha-icon icon="mdi:playlist-remove"></ha-icon>
                  ${Pe("picker.clearAll")}
                </button>
              </div>`:K}
      </div>
      <div class="list">
        ${0===e.length?V`<div class="empty">${Pe("picker.noMatches")}</div>`:e.map(e=>{const t=this.placedDeviceIds.has(e.deviceId),i=this._blockedFloorName(e),o=this.armedEntityId===e.primaryEntityId,n=[e.areaName,e.integrationName].filter(e=>!!e).join(" - ");return V`
                  <div
                    class="item ${o?"armed":""} ${t?"placed":""} ${i?"blocked":""}"
                    title=${i?Pe("picker.alreadyPlaced",{floor:i}):[e.deviceName,n].filter(e=>!!e).join(" · ")}
                    @click=${()=>{i||this.dispatchEvent(new CustomEvent("entity-armed",{detail:{entityId:e.primaryEntityId},bubbles:!0,composed:!0}))}}
                  >
                    <span class="avatar">
                      ${e.integrationDomain?V`<img
                              src="https://brands.home-assistant.io/_/${e.integrationDomain}/icon.png"
                              alt=""
                              @error=${e=>{const t=e.target;t.style.display="none",t.nextElementSibling?.classList.remove("hidden")}}
                            />`:K}
                      <ha-icon
                        icon=${"mdi:devices"}
                        class=${e.integrationDomain?"hidden":""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${e.deviceName}</span>
                      ${i?V`<span class="meta"
                              >${Pe("picker.placedOn",{floor:i})}</span
                            >`:n?V`<span class="meta">${n}</span>`:K}
                      ${t?V`<span class="meta">${Pe("picker.placed")}</span>`:K}
                    </span>
                    ${t?V`<span class="row-actions">
                            <button
                              title=${Pe("picker.locate")}
                              aria-label=${Pe("picker.locate")}
                              @click=${t=>this._emitForDevice(t,"pin-locate",e.deviceId)}
                            >
                              <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
                            </button>
                            <button
                              title=${Pe("picker.remove")}
                              aria-label=${Pe("picker.remove")}
                              @click=${t=>this._emitForDevice(t,"pin-remove",e.deviceId)}
                            >
                              <ha-icon icon="mdi:delete-outline"></ha-icon>
                            </button>
                          </span>`:K}
                  </div>
                `})}
      </div>
    `}};zi.styles=[Et,Bt,Bi],zi.WIDTH_STORAGE_KEY="spatial-context.entityPickerSidebarWidth",zi.MIN_WIDTH=240,zi.MAX_WIDTH=600,e([ge()],zi.prototype,"_menuOpen",void 0),e([ue({attribute:!1})],zi.prototype,"entities",void 0),e([ue({attribute:!1})],zi.prototype,"placedDeviceIds",void 0),e([ue({attribute:!1})],zi.prototype,"armedEntityId",void 0),e([ue({attribute:!1})],zi.prototype,"floors",void 0),e([ue({attribute:!1})],zi.prototype,"areas",void 0),e([ue({attribute:!1})],zi.prototype,"currentFloorId",void 0),e([ue({attribute:!1})],zi.prototype,"linkedAreaIds",void 0),e([ge()],zi.prototype,"_search",void 0),e([ge()],zi.prototype,"_floorFilter",void 0),e([ge()],zi.prototype,"_areaFilter",void 0),e([ge()],zi.prototype,"_placedFilter",void 0),zi=Ai=e([me("entity-picker-sidebar")],zi);let Ri=class extends ce{constructor(){super(...arguments),this.mode="select",this.mapActive=!1,this.mapRotation=0,this.selectedPinLabel=null,this.selectedPinDefaultLabel=null,this.selectedPinOverride=null,this.selectedPinDeviceId=null,this.meshLinks=[],this.networkLabel=null,this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1,this.meshLegend=null,this.selectedMeshLink=null,this.buildings=[],this.scaleReadout=null,this.scaleWarning=null,this.armedBuildingKey=null,this.selectedPlacement=null,this.floorNameById=new Map,this._cardCollapsed=!1,this._card=e=>vi({...e,collapsed:this._cardCollapsed,onToggle:()=>this._cardCollapsed=!this._cardCollapsed})}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_selectedLabel(){const e=this.selectedPlacement;return e?e.label_override||this.floorNameById.get(e.floor_id)||e.floor_id:""}_renderPinPanel(){return null===this.selectedPinLabel?K:this._card({title:this.selectedPinLabel,subtitle:Pe("property.outdoorDevice"),onClose:()=>this._fire("selection-clear"),body:V`<div class="info-group">
          ${fi("mdi:tag-text",Pe("canvas.card.label"),V`<input
              type="text"
              class="text-field"
              placeholder=${this.selectedPinDefaultLabel??""}
              .value=${this.selectedPinOverride??""}
              @change=${e=>this._fire("outdoor-pin-label-change",{label:e.target.value})}
            />`)}
          ${yi("mdi:shape",Pe("property.setIcon"),()=>this._fire("outdoor-pin-icon-click"))}
        </div>
        ${this._renderDeviceNetwork()}`,footer:wi(Pe("property.removeFromProperty"),()=>this._fire("outdoor-pin-delete-click"))})}_renderDeviceNetwork(){const e=this.selectedPinDeviceId;if(!this.networkLabel||!e)return K;const t=this.meshLinks.filter(t=>t.from.deviceId===e||t.to.deviceId===e).map(t=>{const i=t.from.deviceId===e?t.to:t.from;return{name:i.label,where:i.floorId?this.floorNameById.get(i.floorId)??"":"",quality:t.quality,detail:t.detail??t.quality}});return ki(this.networkLabel,t)}_renderMapPanel(){if("map"!==this.mode)return K;const e=Math.round(10*this.mapRotation)/10,t=e=>this._fire("map-rotation-set",{deg:e});return V`
      <div class="tool-row sub">
        <div class="hint-bar">
          <span class="hint">${Pe("mapBackground.adjustHint")}</span>
          <button
            title=${Pe("mapBackground.zoomOut")}
            aria-label=${Pe("mapBackground.zoomOut")}
            @click=${()=>this._fire("map-zoom-step",{factor:1/1.1})}
          >
            <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
          </button>
          <button
            title=${Pe("mapBackground.zoomIn")}
            aria-label=${Pe("mapBackground.zoomIn")}
            @click=${()=>this._fire("map-zoom-step",{factor:1.1})}
          >
            <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
          </button>
          <span class="hint">${Pe("mapBackground.rotation")}</span>
          <input
            type="range"
            min="-180"
            max="180"
            step="0.5"
            style="--pct:${(e+180)/360*100}%"
            .value=${String(e)}
            @input=${e=>t(Number(e.target.value))}
          />
          <input
            type="number"
            min="-180"
            max="180"
            step="0.5"
            .value=${String(e)}
            @change=${e=>{const i=Number(e.target.value);Number.isFinite(i)&&t(i)}}
          />°
          <button
            title=${Pe("mapBackground.resetRotation")}
            aria-label=${Pe("mapBackground.resetRotation")}
            @click=${()=>t(0)}
          >
            <ha-icon icon="mdi:compass-outline"></ha-icon>
          </button>
          <button
            class="primary"
            @click=${()=>this._fire("property-mode-change",{mode:"select"})}
          >
            ${Pe("mapBackground.done")}
          </button>
        </div>
      </div>
    `}_renderMeshLinkPanel(){const e=this.selectedMeshLink;if(!e)return K;const t=[e.from,e.to].find(e=>null!==e.floorId);return this._card({title:`${e.from.label} → ${e.to.label}`,subtitle:Pe("property.link"),onClose:()=>this._fire("selection-clear"),body:V`<div class="info-group">
        ${fi("mdi:signal",Pe("canvas.card.quality"),V`<span style="color:${Be(e.quality)}"
            >${e.detail??e.quality}</span
          >`)}
        ${t?yi("mdi:arrow-right-circle",Pe("property.goToFloorOf",{name:t.label}),()=>this._fire("property-mesh-goto-floor-click",{floorId:t.floorId})):K}
      </div>`})}_renderPlacementPanel(){return this.selectedPlacement?this._card({title:this._selectedLabel(),subtitle:Pe("property.building"),onClose:()=>this._fire("selection-clear"),body:V`<div class="info-group">
        ${fi("mdi:tag-text",Pe("canvas.card.name"),V`<input
            type="text"
            class="text-field"
            .value=${this._selectedLabel()}
            @change=${e=>this._fire("placement-label-change",{label:e.target.value})}
          />`)}
        ${yi("mdi:arrow-right-circle",Pe("property.goToFloor"),()=>this._fire("placement-goto-floor-click"))}
      </div>`,footer:wi(Pe("property.deletePlacement"),()=>this._fire("placement-delete-click"))}):K}_renderScaleNotice(){const e=this.scaleWarning??(null===this.scaleReadout?Pe("property.notCalibrated"):null);return null===e?K:V`<div class="scale-corner">
      <div
        class="scale-chip floating-panel"
        title=${null===this.scaleReadout?Pe("property.calibrateHint"):e}
      >
        <ha-icon
          class=${this.scaleWarning?"warn":""}
          icon=${this.scaleWarning?"mdi:alert":"mdi:ruler"}
        ></ha-icon>
        ${e}
      </div>
    </div>`}render(){return V`
      <div class="tool-row">
        <div class="mode-toolbar">
          <button
            class=${"select"===this.mode?"active":""}
            title=${Pe("property.select")}
            aria-label=${Pe("property.select")}
            @click=${()=>this._fire("property-mode-change",{mode:"select"})}
          >
            <ha-icon icon="mdi:cursor-default-click"></ha-icon>
          </button>
          <button
            class=${"place-pin"===this.mode?"active":""}
            title=${Pe("property.placeOutdoor")}
            aria-label=${Pe("property.placeOutdoor")}
            @click=${()=>this._fire("property-mode-change",{mode:"place-pin"===this.mode?"select":"place-pin"})}
          >
            <ha-icon icon="mdi:map-marker-plus"></ha-icon>
          </button>
          ${this.mapActive?V`<button
                  class=${"map"===this.mode?"active":""}
                  title=${Pe("mapBackground.adjust")}
                  aria-label=${Pe("mapBackground.adjust")}
                  @click=${()=>this._fire("property-mode-change",{mode:"map"===this.mode?"select":"map"})}
                >
                  <ha-icon icon="mdi:map-search"></ha-icon>
                </button>`:K}
          <span class="tool-divider"></span>
          <span class="select-wrap"
            ><select
              class="place-picker"
              title=${Pe("property.placeBuildingTip")}
              .value=${this.armedBuildingKey??""}
              @change=${e=>{const t=e.target.value;t&&this._fire("placement-arm",{key:t})}}
            >
              <option value="">${Pe("property.placeBuilding")}</option>
              ${this.buildings.map(e=>V`<option value=${e.key}>${e.name}</option>`)}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
        </div>

        <slot name="row-end"></slot>
        <row-actions
          .dirty=${this.dirty}
          .saving=${this.saving}
          .canUndo=${this.canUndo}
          .canRedo=${this.canRedo}
        ></row-actions>
      </div>

      ${this._renderMapPanel()} ${this._renderScaleNotice()}
      ${this.meshLegend&&"map"!==this.mode?Li(this.meshLegend):K}
      ${this._renderPinPanel()} ${this._renderMeshLinkPanel()}
      ${this._renderPlacementPanel()}
    `}};Ri.styles=[Et,Bt,Ft,Rt,mi,zt,Ii,r`
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .mode-toolbar {
        pointer-events: auto;
      }
      .mode-toolbar button {
        display: flex;
        align-items: center;
        gap: var(--ha-space-1, 4px);
        padding: 6px 10px;
        border-radius: 10px;
      }
      .tool-divider {
        align-self: stretch;
        width: 1px;
        margin: 6px var(--ha-space-1, 4px);
        background: var(--sc-divider);
      }
      .mode-toolbar ha-icon,
      .selection-panel ha-icon {
        --mdc-icon-size: 20px;
      }
      .mode-toolbar button.active {
        background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
        color: var(--sc-accent);
      }
      .mode-toolbar button.active ha-icon {
        color: var(--sc-accent);
      }
      .place-picker {
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-family: inherit;
        font-size: var(--sc-fs-body);
        padding: 6px 14px;
      }
      .hint {
        font-size: var(--sc-fs-small);
        color: var(--sc-fg-secondary);
      }
    `],e([ue({attribute:!1})],Ri.prototype,"mode",void 0),e([ue({attribute:!1})],Ri.prototype,"mapActive",void 0),e([ue({attribute:!1})],Ri.prototype,"mapRotation",void 0),e([ue({attribute:!1})],Ri.prototype,"selectedPinLabel",void 0),e([ue({attribute:!1})],Ri.prototype,"selectedPinDefaultLabel",void 0),e([ue({attribute:!1})],Ri.prototype,"selectedPinOverride",void 0),e([ue({attribute:!1})],Ri.prototype,"selectedPinDeviceId",void 0),e([ue({attribute:!1})],Ri.prototype,"meshLinks",void 0),e([ue({attribute:!1})],Ri.prototype,"networkLabel",void 0),e([ue({type:Boolean})],Ri.prototype,"dirty",void 0),e([ue({type:Boolean})],Ri.prototype,"saving",void 0),e([ue({type:Boolean})],Ri.prototype,"canUndo",void 0),e([ue({type:Boolean})],Ri.prototype,"canRedo",void 0),e([ue({attribute:!1})],Ri.prototype,"meshLegend",void 0),e([ue({attribute:!1})],Ri.prototype,"selectedMeshLink",void 0),e([ue({attribute:!1})],Ri.prototype,"buildings",void 0),e([ue({attribute:!1})],Ri.prototype,"scaleReadout",void 0),e([ue({attribute:!1})],Ri.prototype,"scaleWarning",void 0),e([ue({attribute:!1})],Ri.prototype,"armedBuildingKey",void 0),e([ue({attribute:!1})],Ri.prototype,"selectedPlacement",void 0),e([ue({attribute:!1})],Ri.prototype,"floorNameById",void 0),e([ge()],Ri.prototype,"_cardCollapsed",void 0),Ri=e([me("property-overlay")],Ri);const Fi=new Set(["the","and","with","power","light","plug"]);let Di=null;function Hi(e,t,i){const o=t.toLowerCase().split(/[\s:]+/).filter(Boolean);if(0===o.length)return[];const n=o.join("-"),s=[];for(const[t,i]of e){const e=o.filter(e=>t.includes(e)).length,r=o.filter(e=>t.includes(e)||i.includes(e)).length;if(0===r)continue;const a=t===n?0:t.startsWith(o[0])?1:e===o.length?2:3-e/o.length;s.push([4*(o.length-r)+a,t])}return s.sort((e,t)=>e[0]-t[0]||e[1].length-t[1].length||e[1].localeCompare(t[1])),s.slice(0,i).map(([,e])=>e)}let Wi=class extends ce{constructor(){super(...arguments),this.value=null,this.suggestFrom="",this._query="",this._index=null,this._error=null,this._onBackdropClick=()=>this._fire("icon-picker-cancel"),this._onKeyDown=e=>{if("Escape"===e.key)e.stopPropagation(),this._fire("icon-picker-cancel");else if("Enter"===e.key){const e=this._results[0];e&&this._fire("icon-picked",{icon:`mdi:${e}`})}}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this._onBackdropClick),(Di??(Di=fetch("/spatial_context/mdi-index.json?v=0.16.0-beta.2+mvhkfi21").then(e=>{if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}).catch(e=>{throw Di=null,e})),Di).then(e=>this._index=e,e=>this._error=e?.message??"couldn't load icons")}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this._onBackdropClick)}firstUpdated(e){this._input?.focus()}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}get _results(){const e=this._index;if(!e)return[];if(this._query.trim())return Hi(e,this._query,160);const t=new Set;for(const i of this.suggestFrom.toLowerCase().split(/[^a-z0-9]+/))if(!(i.length<3||Fi.has(i))){for(const o of Hi(e,i,12))t.add(o);if(t.size>=60)break}return[...t]}render(){const e=this._results,t=this.value?.replace(/^mdi:/,"")??null;return V`
      <div
        class="dialog floating-panel"
        role="dialog"
        aria-label=${Pe("iconPicker.title")}
        @click=${e=>e.stopPropagation()}
        @keydown=${this._onKeyDown}
      >
        <div class="title">${Pe("iconPicker.title")}</div>
        <input
          type="search"
          placeholder=${Pe("iconPicker.search")}
          .value=${this._query}
          @input=${e=>this._query=e.target.value}
        />
        ${this._error?V`<span class="hint"
                >${Pe("iconPicker.loadError",{error:this._error})}</span
              >`:this._index?0===e.length?V`<span class="hint"
                    >${this._query.trim()?Pe("iconPicker.noMatch"):Pe("iconPicker.typeToSearch")}</span
                  >`:K:V`<span class="hint"
                  >${Pe("iconPicker.loading")}</span
                >`}
        <div class="grid">
          ${e.map(e=>V`<button
                class="icon-choice ${e===t?"current":""}"
                title=${`mdi:${e}`}
                aria-label=${`mdi:${e}`}
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
            ${Pe("iconPicker.useDefault")}
          </button>
          <button @click=${()=>this._fire("icon-picker-cancel")}>
            ${Pe("iconPicker.cancel")}
          </button>
        </div>
      </div>
    `}};Wi.styles=[Et,r`
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
        gap: var(--ha-space-3, 12px);
        padding: var(--ha-space-4, 16px);
      }
      .title {
        font-size: var(--sc-fs-title);
        font-weight: 500;
      }
      input[type="search"] {
        width: 100%;
        box-sizing: border-box;
        height: var(--sc-h-field);
        padding: 0 var(--ha-space-3, 12px);
        font: inherit;
        font-size: var(--sc-fs-body);
        color: var(--sc-fg);
        background: var(--sc-bg);
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
      }
      .grid {
        flex: 1;
        min-height: 160px;
        overflow-y: auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
        gap: var(--ha-space-1, 4px);
      }
      .icon-choice {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--ha-space-1, 4px);
        padding: var(--ha-space-2, 8px) var(--ha-space-1, 4px);
        border-radius: var(--ha-border-radius-md, 8px);
        min-width: 0;
      }
      .icon-choice.current {
        outline: 2px solid var(--sc-accent);
      }
      .icon-choice ha-icon {
        --mdc-icon-size: 28px;
      }
      .icon-choice span {
        font-size: var(--sc-fs-caption);
        color: var(--sc-fg-secondary);
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .hint {
        font-size: var(--sc-fs-small);
        color: var(--sc-fg-secondary);
      }
      .actions {
        display: flex;
        justify-content: space-between;
        gap: var(--ha-space-2, 8px);
      }
    `],e([ue({attribute:!1})],Wi.prototype,"value",void 0),e([ue({attribute:!1})],Wi.prototype,"suggestFrom",void 0),e([ge()],Wi.prototype,"_query",void 0),e([ge()],Wi.prototype,"_index",void 0),e([ge()],Wi.prototype,"_error",void 0),e([_e("input[type=search]")],Wi.prototype,"_input",void 0),Wi=e([me("icon-picker-dialog")],Wi);let Ui=class extends ce{constructor(){super(...arguments),this._req=null,this._value="",this._onConfirm=()=>{this._finish("prompt"!==this._req?.kind||this._value)},this._onCancel=()=>{this._finish("prompt"===this._req?.kind&&null)},this._onDialogCancel=e=>{e.preventDefault(),this._onCancel()},this._onBackdropClick=e=>{e.target===this._dialog&&this._onCancel()},this._onInputKey=e=>{"Enter"===e.key&&this._onConfirm()}}confirm(e){return this._open({kind:"confirm",...e})}alert(e){return this._open({kind:"alert",...e}).then(()=>{})}prompt(e){return this._open({kind:"prompt",...e})}_open(e){return this._onCancel(),new Promise(t=>{this._value="",this._req={...e,resolve:t},this.updateComplete.then(()=>{this._dialog.open||this._dialog.showModal();const t=this.renderRoot.querySelector(e.destructive?"button.cancel":"input, button.confirm");t?.focus()})})}_finish(e){const t=this._req;t&&(this._req=null,this._dialog?.open&&this._dialog.close(),t.resolve(e))}render(){const e=this._req;return V`<dialog
      @cancel=${this._onDialogCancel}
      @click=${this._onBackdropClick}
      aria-labelledby=${e?.title?"title":K}
      aria-describedby="text"
    >
      ${e?V`<div class="body">
                ${e.title?V`<h2 id="title">${e.title}</h2>`:K}
                <p id="text">${e.text}</p>
                ${"prompt"===e.kind?V`<input
                        type="text"
                        .value=${this._value}
                        @input=${e=>this._value=e.target.value}
                        @keydown=${this._onInputKey}
                      />`:K}
              </div>
              <div class="footer">
                ${"alert"===e.kind?K:V`<button class="cancel" @click=${this._onCancel}>
                        ${e.dismissText??Pe("dialog.cancel")}
                      </button>`}
                <button
                  class="confirm ${e.destructive?"destructive":""}"
                  @click=${this._onConfirm}
                >
                  ${e.confirmText??Pe("dialog.ok")}
                </button>
              </div>`:K}
    </dialog>`}};Ui.styles=[Et,r`
      dialog {
        padding: 0;
        border: none;
        border-radius: var(--ha-border-radius-4xl, 28px);
        background: var(--card-background-color, var(--sc-bg));
        color: var(--sc-fg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        width: 480px;
        max-width: calc(100vw - 32px);
      }
      dialog::backdrop {
        background: rgba(0, 0, 0, 0.32);
      }
      .body {
        padding: var(--ha-space-6, 24px) var(--ha-space-6, 24px) 0;
      }
      h2 {
        margin: 0 0 var(--ha-space-4, 16px);
        font-size: var(--ha-font-size-2xl, 24px);
        font-weight: var(--ha-font-weight-normal, 400);
        line-height: 1.3;
      }
      p {
        margin: 0;
        font-size: var(--ha-font-size-m, 14px);
        line-height: 1.5;
        white-space: pre-line;
      }
      input {
        width: 100%;
        margin-top: var(--ha-space-4, 16px);
      }
      .footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--ha-space-2, 8px);
        padding: var(--ha-space-4, 16px) var(--ha-space-6, 24px)
          var(--ha-space-6, 24px);
      }
      .footer button {
        height: var(--sc-h-control);
        padding: 0 var(--ha-space-4, 16px);
        border-radius: var(--ha-border-radius-pill, 9999px);
        font-weight: var(--ha-font-weight-medium, 500);
      }
      .footer button.cancel {
        color: var(--sc-accent);
      }
      .footer button.confirm {
        background: var(--sc-accent);
        color: var(--text-primary-color, #fff);
      }
      .footer button.confirm.destructive {
        background: var(--sc-danger);
      }
    `],e([ge()],Ui.prototype,"_req",void 0),e([ge()],Ui.prototype,"_value",void 0),e([_e("dialog")],Ui.prototype,"_dialog",void 0),Ui=e([me("sc-dialog")],Ui);const Ni="https://github.com/Greminn/ha-spatial-context";let Vi=class extends ce{constructor(){super(...arguments),this.coordinatorChoices=[]}_change(e){this.dispatchEvent(new CustomEvent("settings-change",{detail:e,bubbles:!0,composed:!0}))}_switch(e,t,i){return V`<input
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
      <div class="text">
        <div class="label">${e}</div>
        ${i?V`<div class="description">${i}</div>`:K}
      </div>
      ${t}
    </div>`}_linkRow(e,t,i,o){return V`<a
      class="row"
      href=${o}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ha-icon icon=${e}></ha-icon>
      <div class="text">
        <div class="label">${t}</div>
        <div class="description">${i}</div>
      </div>
      <ha-icon class="external" icon="mdi:open-in-new"></ha-icon>
    </a>`}_deviceSelect(e){const{value:t}=e,i=this.coordinatorChoices.some(e=>e.deviceId===t);return V`<span class="select-wrap"
      ><select
        aria-label=${e.aria}
        @change=${t=>e.onChange(t.target.value||null)}
      >
        <option value="" ?selected=${!t}>${e.defaultLabel}</option>
        ${t&&!i?V`<option value=${t} selected>
                ${Pe("settings.notPlaced")}
              </option>`:K}
        ${this.coordinatorChoices.map(({deviceId:e,label:i})=>V`<option value=${e} ?selected=${e===t}>
              ${i}
            </option>`)}</select
      ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
    ></span>`}render(){const e=this.settings,t=e.zigbee_coordinator_device_id;return V`<div class="page">
      <div class="card">
        <h2>${Pe("settings.editing")}</h2>
        ${this._row(Pe("settings.autoSave"),this._switch(e.auto_save,Pe("settings.autoSave"),e=>this._change({auto_save:e})),Pe("settings.autoSaveHint"))}
        ${this._row(Pe("settings.units"),this._segmented(e.unit_system,[["metric",Pe("settings.metric")],["imperial",Pe("settings.imperial")]],e=>this._change({unit_system:e})))}
        ${this._row(Pe("settings.floorOrder"),this._segmented(e.floor_order,[["top_down",Pe("settings.topFirst")],["ground_up",Pe("settings.groundFirst")]],e=>this._change({floor_order:e})))}
      </div>

      <div class="card">
        <h2>${Pe("settings.zigbeeMesh")}</h2>
        ${this._row(Pe("settings.coordinator"),this._deviceSelect({value:t,defaultLabel:Pe("settings.bridge"),aria:Pe("settings.coordinatorAria"),onChange:e=>this._change({zigbee_coordinator_device_id:e})}),Pe("settings.coordinatorHint"))}
        ${this._row(Pe("settings.scanTimeout"),V`<span class="number"
            ><input
              type="number"
              min="30"
              max="600"
              step="10"
              aria-label=${Pe("settings.scanTimeoutAria")}
              .value=${String(e.zigbee_timeout_seconds)}
              @change=${e=>{const t=Number(e.target.value);Number.isFinite(t)&&this._change({zigbee_timeout_seconds:Math.min(600,Math.max(30,Math.round(t)))})}}
            />s</span
          >`,Pe("settings.scanTimeoutHint"))}
      </div>

      <div class="card">
        <h2>${Pe("settings.matterThread")}</h2>
        ${this._row(Pe("settings.borderRouter"),this._deviceSelect({value:e.thread_border_router_device_id,defaultLabel:Pe("settings.notSet"),aria:Pe("settings.borderRouterAria"),onChange:e=>this._change({thread_border_router_device_id:e})}),Pe("settings.borderRouterHint"))}
      </div>

      <div class="card">
        <h2>${Pe("settings.troubleshooting")}</h2>
        ${this._row(Pe("settings.debugLogging"),this._switch(e.debug_logging,Pe("settings.debugLogging"),e=>this._change({debug_logging:e})),Pe("settings.debugLoggingHint"))}
      </div>

      <div class="card">
        <h2>${Pe("settings.about")}</h2>
        ${this._row(Pe("settings.version"),V`<span class="description">v${"0.16.0-beta.2"}</span>`)}
        ${this._linkRow("mdi:text-box-outline",Pe("settings.releaseNotes"),Pe("settings.releaseNotesHint"),`${Ni}/releases`)}
        ${this._linkRow("mdi:book-open-variant",Pe("settings.documentation"),Pe("settings.documentationHint"),`${Ni}#readme`)}
        ${this._linkRow("mdi:bug-outline",Pe("settings.reportIssue"),Pe("settings.reportIssueHint"),`${Ni}/issues/new/choose`)}
        ${this._linkRow("mdi:github",Pe("settings.github"),Pe("settings.githubHint"),Ni)}
        ${this._linkRow("mdi:coffee-outline",Pe("settings.support"),Pe("settings.supportHint"),"https://buymeacoffee.com/greminn")}
        ${this._row(Pe("settings.licence"),V`<span class="description">MIT</span>`)}
      </div>
    </div>`}};Vi.styles=[Et,Bt,At,r`
      :host {
        display: block;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        background: var(--primary-background-color, #fafafa);
        font-size: var(--sc-fs-row);
      }
      .page {
        max-width: 720px;
        margin: 0 auto;
        padding: var(--ha-space-6, 24px) var(--ha-space-4, 16px)
          var(--ha-space-12, 48px);
      }
      /* HA's settings cards: the title is inside the card, rows have no
       * dividers, and the box is lighter than the page. */
      .card {
        margin-bottom: var(--ha-space-6, 24px);
        padding: var(--ha-space-2, 8px) 0;
        border: 1px solid var(--ha-card-border-color, var(--sc-divider));
        border-radius: var(
          --ha-card-border-radius,
          var(--ha-border-radius-xl, 12px)
        );
        background: var(
          --ha-card-background,
          var(--card-background-color, #fff)
        );
        overflow: hidden;
      }
      .card h2 {
        margin: 0;
        padding: var(--ha-space-4, 16px) var(--ha-space-4, 16px)
          var(--ha-space-2, 8px);
        font-size: var(--ha-font-size-2xl, 24px);
        font-weight: 400;
        line-height: 1.3;
      }
      .row {
        display: flex;
        align-items: center;
        gap: var(--ha-space-4, 16px);
        min-height: 56px;
        padding: var(--ha-space-2, 8px) var(--ha-space-4, 16px);
      }
      .text {
        flex: 1;
        min-width: 0;
      }
      .label {
        color: var(--sc-fg);
        line-height: 1.3;
      }
      .description {
        margin-top: 2px;
        font-size: var(--sc-fs-small);
        line-height: 1.3;
        color: var(--sc-fg-secondary);
      }
      /* A row that is a link: icon, label and hint, and an "opens in a
       * new tab" arrow. The whole row is the target. */
      a.row {
        color: inherit;
        text-decoration: none;
      }
      a.row:hover {
        background: var(--sc-hover);
      }
      a.row:focus-visible {
        outline: 2px solid var(--sc-accent);
        outline-offset: -2px;
      }
      .row > ha-icon {
        --mdc-icon-size: 20px;
        flex: none;
        color: var(--sc-fg-secondary);
      }
      .row > ha-icon.external {
        --mdc-icon-size: 16px;
        color: var(--sc-accent);
      }

      /* Two-option segmented control. */
      .segmented {
        flex: none;
        display: inline-flex;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        overflow: hidden;
      }
      .segmented button {
        padding: 6px 14px;
        border-radius: 0;
        font-size: var(--sc-fs-small);
        font-weight: 400;
        color: var(--sc-fg);
        background: transparent;
        white-space: nowrap;
      }
      .segmented button + button {
        border-inline-start: 1px solid var(--sc-divider);
      }
      .segmented button.active {
        background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
        color: var(--sc-accent);
      }

      /* Filled fields, as HA's forms draw them. */
      select,
      input[type="number"] {
        font: inherit;
        font-size: var(--sc-fs-body);
        color: var(--sc-fg);
        height: 48px;
        padding: 0 var(--ha-space-4, 16px);
        border: none;
        border-bottom: 1px solid
          color-mix(in srgb, var(--sc-fg) 60%, transparent);
        border-radius: var(--ha-border-radius-sm, 4px)
          var(--ha-border-radius-sm, 4px) 0 0;
        background: var(
          --ha-color-form-background,
          color-mix(in srgb, var(--sc-fg) 12%, transparent)
        );
      }
      select:hover,
      input[type="number"]:hover {
        border-bottom-color: var(--sc-fg);
        background: var(
          --ha-color-form-background-hover,
          color-mix(in srgb, var(--sc-fg) 16%, transparent)
        );
      }
      select:focus-visible,
      input[type="number"]:focus-visible {
        outline: none;
        border-bottom: 2px solid var(--sc-accent);
      }
      select {
        width: 240px;
        max-width: 100%;
      }
      .select-wrap {
        flex: none;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .number {
        flex: none;
        display: inline-flex;
        align-items: center;
        gap: var(--ha-space-1, 4px);
        color: var(--sc-fg-secondary);
        font-size: var(--sc-fs-small);
      }
      input[type="number"] {
        width: 64px;
        text-align: end;
      }
      @media (max-width: 600px) {
        .row {
          flex-wrap: wrap;
        }
        select {
          width: 100%;
        }
        .select-wrap {
          flex: 1 1 100%;
        }
      }
    `],e([ue({attribute:!1})],Vi.prototype,"settings",void 0),e([ue({attribute:!1})],Vi.prototype,"coordinatorChoices",void 0),Vi=e([me("settings-page")],Vi);const qi=r`
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* iOS Safari: 100vh is taller than the visible area. */
    height: 100dvh;
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
    top: 68px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    max-width: min(640px, calc(100% - 32px));
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border-inline-start: 4px solid var(--sc-danger);
    font-size: var(--sc-fs-body);
  }
  .save-error ha-icon {
    color: var(--sc-danger);
    flex: none;
  }
  /* Phones: the device picker becomes a sheet under the canvas. */
  @media (max-width: 700px) {
    .main {
      flex-direction: column;
    }
    .canvas-area {
      min-height: 0;
    }
  }
  .canvas-area {
    flex: 1;
    min-width: 0;
    position: relative;
    /* Room for the controls row the overlay draws across the top. */
    padding-top: var(--ha-space-14, 56px);
  }
  .canvas-area.drag-over {
    outline: 2px dashed var(--sc-accent);
    outline-offset: -2px;
  }
  .loading,
  .no-floors {
    padding: var(--ha-space-8, 32px);
    color: var(--sc-fg-secondary);
  }
  .popover-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-4, 16px);
    min-height: 44px;
    padding: 6px var(--ha-space-4, 16px);
    font-size: var(--sc-fs-row);
  }
  .menu-divider {
    height: 1px;
    margin: 6px 0;
    background: var(--sc-divider);
  }
  .menu-item .trail {
    margin-inline-start: auto;
    color: var(--sc-accent);
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
  .hidden-file-input {
    display: none;
  }
  input[type="range"] {
    width: 130px;
  }
  .popover-row select {
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    color: var(--sc-fg);
    font: inherit;
    font-size: var(--sc-fs-body);
  }
  .popover-row select:focus {
    outline: none;
    border-color: var(--sc-accent);
  }
  .hint {
    font-size: var(--sc-fs-small);
    color: var(--sc-fg-secondary);
  }
`;var Gi;const Ki="spatial-context-snap-mode";let Yi=Gi=class extends ce{constructor(){super(...arguments),this._floors=[],this._currentFloorId=null,this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._entities=[],this._areas=[],this._mode="select",this._snapMode=function(){try{const e=localStorage.getItem(Ki);if("all"===e||"same"===e||"off"===e)return e}catch{}return"all"}(),this._dragOverCanvas=!1,this._armedEntityId=null,this._armedOpeningType=null,this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._multiPinIds=[],this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._otherFloorPinsByDeviceId=new Map,this._dirty=!1,this._saving=!1,this._loading=!0,this._pendingCount=0,this._mesh=new Ie(this,()=>this._client),this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settings={unit_system:"metric",zigbee_timeout_seconds:180,floor_order:"top_down",zigbee_coordinator_device_id:null,thread_border_router_device_id:null,auto_save:!0,debug_logging:!1},this._settingsOpen=!1,this._moreOptionsPopoverOpen=!1,this._view="floor",this._placementGhosts=new Map,this._ghostsLoading=!1,this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!1,this._saveError=null,this._iconPickerFor=null,this._versionNotice=null,this._autoSaveTimer=null,this._autoSaveHeld=!1,this._floorHistory=new we,this._propertyHistory=new we,this._propertyDragStart=null,this._propertySaving=!1,this._selectedPlacementId=null,this._propertyMode="select",this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._armedBuildingKey=null,this._sameBuildingAsPreviousFloor=!1,this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._initialized=!1,this.narrow=!1,this._onFloorSelected=e=>{this._selectFloor(e.detail.floorId)},this._onPropertySelected=()=>{this._selectProperty()},this._onToggleMapBackground=()=>{const e=this._hass?.config;this._propertyLayout.map_background?("map"===this._propertyMode&&(this._propertyMode="select"),this._updatePropertyLayout({map_background:null})):void 0!==e?.latitude&&void 0!==e.longitude&&this._updatePropertyLayout({map_background:{lat:e.latitude,lon:e.longitude,zoom:18,opacity:1,style:"street"}})},this._onMapAdjust=e=>{const t=e.detail;this._adjustMap(e=>{switch(t.op){case"pan":return ai(e,t.dx,t.dy);case"zoom":return li(e,t.factor,t.at);case"rotate":return ci(e,(e.rotation_deg??0)+t.deltaDeg,t.at);case"pinch":{const i=li(ai(e,t.dx,t.dy),t.factor,t.at);return ci(i,(i.rotation_deg??0)+t.rotateDeg,t.at)}}})},this._onMapRotationSet=e=>{const t=this._propertyCanvas?.getViewCenter()??{x:0,y:0};this._adjustMap(i=>ci(i,e.detail.deg,t))},this._onMapZoomStep=e=>{const t=this._propertyCanvas?.getViewCenter()??{x:0,y:0};this._adjustMap(i=>li(i,e.detail.factor,t))},this._onMapStyleChange=e=>{const t=this._propertyLayout.map_background;t&&this._updatePropertyLayout({map_background:{...t,style:e.target.value}})},this._onMapOpacityChange=e=>{const t=this._propertyLayout.map_background;t&&this._updatePropertyLayout({map_background:{...t,opacity:Number(e.target.value)}})},this._onUndo=()=>this._undoRedo("undo"),this._onRedo=()=>this._undoRedo("redo"),this._onPropertyModeChange=e=>{this._propertyMode=e.detail.mode,this._armedBuildingKey=null,this._armedEntityId=null,this._selectedPlacementId=null},this._onOutdoorPinPlace=e=>{if(!this._armedEntityId)return;const t=this._entityLookup.get(this._armedEntityId),i=bt(t?.device_id??null,e.detail.x,e.detail.y,null);this._updatePropertyLayout({pins:[...this._propertyLayout.pins,i]}),this._armedEntityId=null,this._selectedOutdoorPinId=i.id,this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null},this._onOutdoorPinMove=e=>{this._patchOutdoorPin(e.detail.id,{x:e.detail.x,y:e.detail.y})},this._onOutdoorPinSelect=e=>{this._selectedOutdoorPinId=e.detail.id,null!==e.detail.id&&(this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null)},this._onOutdoorPinLabelChange=e=>{const t=this._selectedOutdoorPin;t&&this._patchOutdoorPin(t.id,{label_override:e.detail.label.trim()||null})},this._onPropertySelectionClear=()=>{this._selectedPlacementId=null,this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null},this._onOutdoorPinIcon=()=>{const e=this._selectedOutdoorPin;e&&(this._iconPickerFor={kind:"outdoor",pinId:e.id})},this._onOutdoorPinDelete=async()=>{const e=this._selectedOutdoorPin;e&&await this._ask("removeOutdoorPin","remove",{name:this._pinLabel(e)})&&(this._updatePropertyLayout({pins:this._propertyLayout.pins.filter(t=>t.id!==e.id)}),this._selectedOutdoorPinId=null)},this._onPropertyMeshLinkSelect=e=>{this._selectedPropertyMeshLinkKey=e.detail.key,null!==e.detail.key&&(this._selectedOutdoorPinId=null,this._selectedPlacementId=null)},this._onClearAllOutdoorPins=async()=>{const e=this._propertyLayout.pins.length;0!==e&&await this._ask(1===e?"removeOutdoorOne":"removeOutdoorMany","remove",{count:e})&&(this._autoSaveHeld=!0,this._updatePropertyLayout({pins:[]}),this._selectedOutdoorPinId=null)},this._onPropertyMeshGotoFloor=e=>{this._selectFloor(e.detail.floorId)},this._onPlacementArm=e=>{this._armedBuildingKey=e.detail.key,this._propertyMode="place",this._selectedPlacementId=null},this._onPlacementPlace=e=>{if(!this._armedBuildingKey)return;const t=this._buildings.find(e=>e.key===this._armedBuildingKey);if(!t)return;const i=this._buildingBounds(this._floors.filter(e=>(e.building_id??e.floor_id)===t.key)),o=function(e,t,i,o,n,s,r=220){const a=n>=1?r:r*n,l=n>=1?r/n:r;return{id:ft("placement"),building_id:t,floor_id:e,label_override:null,x:i,y:o,width:a,height:l,rotation_deg:0,aspect_ratio:n,source_bounds:s}}(t.floorId,t.buildingId,e.detail.x,e.detail.y,t.aspectRatio,i,this._newPlacementLongSide(t,i));this._updatePropertyLayout({placements:[...this._propertyLayout.placements,o]}),this._armedBuildingKey=null,this._propertyMode="select",this._selectedPlacementId=o.id},this._onPlacementMove=e=>{const t=this._propertyLayout.placements.find(t=>t.id===e.detail.id);t&&this._patchPlacement(e.detail.id,{x:t.x+e.detail.dx,y:t.y+e.detail.dy})},this._onPlacementResize=e=>{this._patchPlacement(e.detail.id,{width:e.detail.width,height:e.detail.height,x:e.detail.x,y:e.detail.y})},this._onPlacementRotate=e=>{this._patchPlacement(e.detail.id,{rotation_deg:e.detail.rotationDeg})},this._onPlacementSelect=e=>{this._selectedPlacementId=e.detail.id,null!==e.detail.id&&(this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null)},this._onPlacementLabelChange=e=>{const t=this._selectedPlacement;t&&this._patchPlacement(t.id,{label_override:e.detail.label.trim()||null})},this._onPlacementDeleteClick=async()=>{const e=this._selectedPlacement;if(!e)return;const t=e.label_override??this._floorNameById.get(e.floor_id)??e.floor_id;await this._ask("deletePlacement","delete",{label:t})&&(this._updatePropertyLayout({placements:this._propertyLayout.placements.filter(t=>t.id!==e.id)}),this._selectedPlacementId=null)},this._onPlacementGotoFloorClick=()=>{const e=this._selectedPlacement;e&&this._selectFloor(e.floor_id)},this._onModeChange=e=>{this._mode=this._mode===e.detail.mode?"select":e.detail.mode,this._armedEntityId=null,this._armedOpeningType=null,"select"!==this._mode&&(this._editingRoomId=null,this._editingWallId=null),"align"!==this._mode&&this._resetAlignState()},this._onAddOpeningClick=e=>{this._mode="opening",this._armedOpeningType=e.detail.openingType,this._editingRoomId=null,this._editingWallId=null},this._onSaveClick=()=>{this._autoSaveHeld=!1;("property"===this._view?this._saveProperty():this._save()).catch(()=>{})},this._placementKeyForEntities=null,this._onVisibilityChange=()=>{"visible"===document.visibilityState&&this._checkVersion()},this._onCalibrateScaleClick=()=>{"scale"!==this._mode&&this._onModeChange(new CustomEvent("mode-change",{detail:{mode:"scale"}}))},this._onPickerClose=()=>{this._mode="select",this._propertyMode="select",this._armedEntityId=null},this._onBeforeUnload=e=>{(this._dirty||this._propertyDirty)&&(this._flushAutoSave(),e.preventDefault(),e.returnValue="")},this._onExportClick=()=>{this._export()},this._onResetClick=async()=>{if("property"===this._view){if(!await this._ask("resetProperty","reset"))return;return this._autoSaveHeld=!0,this._propertyHistory.record(this._propertyLayout),this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const e=this._floors.find(e=>e.floor_id===this._currentFloorId)?.name??Pe("floor.thisFloor");await this._ask("resetFloor","reset",{floor:e})&&(this._autoSaveHeld=!0,this._floorHistory.record(this._layout),this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)},this._onToggleBackgroundPopover=()=>{this._backgroundPopoverOpen=!this._backgroundPopoverOpen,this._meshPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMeshPopover=()=>{this._meshPopoverOpen=!this._meshPopoverOpen,this._backgroundPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onOpenSettings=()=>{this._settingsOpen=!0,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMoreOptionsPopover=()=>{this._moreOptionsPopoverOpen=!this._moreOptionsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1},this._onSettingsChange=e=>{const t=e.detail;this._settings={...this._settings,...t};const i=this._client.saveSettings(this._settings);if("auto_save"in t&&this._scheduleAutoSave(),"zigbee_coordinator_device_id"in t&&(this._selectedMeshLink=null,this._selectedMeshStub=null),"debug_logging"in t){const e=!!t.debug_logging;i.then(()=>{ke.configure(this._client,e),ke.log("debug_logging_on",{panel_version:"0.16.0-beta.2",panel_build:"0.16.0-beta.2+mvhkfi21",user_agent:navigator.userAgent})})}},this._onNetworkTypeSelect=e=>{this._mesh.select(e),this._selectedMeshLink=null,this._selectedMeshStub=null},this._onLoadMesh=()=>this._mesh.loadZigbee(),this._fitToViewport=()=>{const e=window.visualViewport?.height??window.innerHeight,t=Math.max(this.getBoundingClientRect().top,0);this.style.height=`${Math.max(240,Math.floor(e-t))}px`},this._faviconRestore=null,this._onKeyDown=e=>{if(this._isTypingTarget())return;if(this._iconPickerFor)return;if("Escape"===e.key){if(e.preventDefault(),"floor"===this._view&&this._canvas?.cancelGesture())return;return"property"===this._view&&this._propertyCanvas?.cancelGesture()?void(this._propertyDragStart&&(this._propertyHistory.discardIfLast(this._propertyDragStart),this._propertyLayout=this._propertyDragStart,this._propertyDragStart=null)):(this._onCancelPending(),this._multiPinIds=[],this._mode="select",this._armedEntityId=null,this._armedOpeningType=null,this._armedBuildingKey=null,void(this._propertyMode="select"))}const t=e.ctrlKey||e.metaKey,i=e.key.toLowerCase(),o=t&&!e.shiftKey&&"z"===i,n=t&&(e.shiftKey&&"z"===i||"y"===i);if(!o&&"Backspace"!==e.key||!this._canvas?.undoLastPoint())return o||n?(e.preventDefault(),void this._undoRedo(o?"undo":"redo")):"Delete"===e.key||"Backspace"===e.key?"property"===this._view?((this._selectedOutdoorPin||this._selectedPlacement)&&e.preventDefault(),void(this._selectedOutdoorPin?this._onOutdoorPinDelete():this._selectedPlacement&&this._onPlacementDeleteClick())):((this._selectedRoom||this._selectedPin||this._selectedWall||this._selectedOpening)&&e.preventDefault(),void(this._selectedRoom?this._onRoomDelete():this._selectedPin?this._onPinDelete():this._selectedWall?this._onWallDelete():this._selectedOpening&&this._onOpeningDelete())):void("Enter"===e.key&&"wall"===this._mode&&(e.preventDefault(),this._onFinishWall()));e.preventDefault()},this._onFileInputChange=async e=>{const t=e.target,i=t.files?.[0];t.value="",i&&this._handleBackgroundFile(i)},this._onCanvasDragOver=e=>{e.dataTransfer?.types.includes("Files")&&(e.preventDefault(),this._dragOverCanvas=!0)},this._onCanvasDragLeave=()=>{this._dragOverCanvas=!1},this._onCanvasDrop=e=>{if(!e.dataTransfer?.types.includes("Files"))return;e.preventDefault(),this._dragOverCanvas=!1;const t=e.dataTransfer.files?.[0];t&&this._handleBackgroundFile(t)},this._onRemoveBackgroundClick=()=>{"property"===this._view?this._updatePropertyLayout({background_image_id:null}):this._updateLayout({background_image_id:null})},this._onOpacityChange=e=>{const t=Number(e.target.value);"property"===this._view?this._updatePropertyLayout({background_opacity:t}):this._updateLayout({background_opacity:t})},this._onCancelPending=()=>this._canvas?.cancelPending(),this._onFinishWall=()=>this._canvas?.finishPendingWall(),this._onAlignTargetChange=async e=>{const t=e.detail.floorId;t?(this._alignTargetFloorId=t,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._alignTargetLayout=await this._client.getLayout(t)):this._resetAlignState()},this._onAlignDrag=e=>{this._alignOffsetX+=e.detail.dx,this._alignOffsetY+=e.detail.dy},this._onAlignScaleClick=e=>{const{factor:t}=e.detail,i=this._canvas?.getViewBox();if(i){const e=i.x+i.w/2,o=i.y+i.h/2;this._alignOffsetX=t*this._alignOffsetX+(1-t)*e,this._alignOffsetY=t*this._alignOffsetY+(1-t)*o}this._alignScale*=t},this._onAlignCancel=()=>{this._mode="select",this._resetAlignState()},this._onAlignApply=async()=>{if(!this._alignTargetFloorId||!this._alignTargetLayout)return;const e=this._alignTargetFloorId,t=this._floors.find(t=>t.floor_id===e)?.name??Pe("floor.thatFloor");if(!await this._ask("applyAlignment","apply",{floor:t}))return;const i=this._alignScale,o=this._alignOffsetX,n=this._alignOffsetY,s=([e,t])=>[e*i+o,t*i+n],r=this._alignTargetLayout,a=this._layout.building_id??ft("building"),l={background_image_id:r.background_image_id,background_opacity:r.background_opacity,background_offset_x:r.background_offset_x*i+o,background_offset_y:r.background_offset_y*i+n,background_scale:r.background_scale*i,building_id:a,view_box:r.view_box?(()=>{const[e,t]=s([r.view_box.x,r.view_box.y]);return{x:e,y:t,w:r.view_box.w*i,h:r.view_box.h*i}})():null,rooms:r.rooms.map(e=>({...e,points:e.points.map(s)})),walls:r.walls.map(e=>({...e,points:e.points.map(s)})),pins:r.pins.map(e=>{const[t,i]=s([e.x,e.y]);return{...e,x:t,y:i}}),openings:r.openings.map(e=>{const[t,o]=s([e.x,e.y]);return{...e,x:t,y:o,width:e.width*i}}),scale:this._layout.scale??(r.scale?{points:[s(r.scale.points[0]),s(r.scale.points[1])],meters:r.scale.meters}:null)};await this._client.saveLayout(e,l),this._layout.building_id!==a&&(await this._client.setBuildingId(this._currentFloorId,a),this._layout={...this._layout,building_id:a}),this._floors=await this._client.listFloors(),this._mode="select",this._resetAlignState(),this._floorHistory.clear()},this._onRoomNameChange=e=>{const t=this._selectedRoom;t&&this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===t.id?{...i,name:e.detail.name}:i)})},this._onRoomAreaChange=e=>{const t=this._selectedRoom;if(!t)return;const i=e.detail.areaId||null,o=this._areas.find(e=>e.area_id===i);this._updateLayout({rooms:this._layout.rooms.map(e=>e.id===t.id?{...e,area_id:i,name:o?o.name:e.name}:e)})},this._onRoomMove=e=>{const{roomId:t,dx:i,dy:o}=e.detail;ke.log("room_move",{room_id:t,dx:Math.round(i),dy:Math.round(o)});const n=([e,t])=>[e+i,t+o],s=this._layout.rooms.map(e=>e.id===t?{...e,points:e.points.map(n),...e.label_position?{label_position:n(e.label_position)}:{}}:e),r=this._layout.pins.map(e=>e.room_id===t?{...e,x:e.x+i,y:e.y+o}:e);this._updateLayout({rooms:s,pins:Ge(s,r)})},this._onRoomLabelMoved=e=>{this._patchRoom(e.detail.roomId,{label_position:[e.detail.x,e.detail.y]})},this._onRoomLabelReset=()=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{label_position:null})},this._onRoomVisibleToggle=()=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{visible:!1===e.visible})},this._onRoomFillColorChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{fill_color:e.detail.color})},this._onRoomFillOpacityChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{fill_opacity:e.detail.opacity})},this._onRoomBorderOpacityChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{border_opacity:e.detail.opacity})},this._onRoomEditVertices=()=>{this._selectedRoomId&&(this._editingRoomId=this._editingRoomId===this._selectedRoomId?null:this._selectedRoomId)},this._onRoomDelete=async()=>{const e=this._selectedRoom;if(!e||!await this._ask("deleteRoom","delete",{name:e.name}))return;const t=this._layout.rooms.filter(t=>t.id!==e.id);this._updateLayout({rooms:t,pins:Ge(t,this._layout.pins)}),this._selectedRoomId=null,this._editingRoomId=null},this._onPinLabelChange=e=>{const t=this._selectedPin;t&&this._patchPin(t.id,{label_override:e.detail.label.trim()||null})},this._onPinSetIcon=()=>{const e=this._selectedPin;e&&(this._iconPickerFor={kind:"floor",pinId:e.id})},this._onIconPicked=e=>{const t=this._iconPickerFor;if(this._iconPickerFor=null,!t)return;const i={icon_override:e.detail.icon};"floor"===t.kind?this._patchPin(t.pinId,i):this._patchOutdoorPin(t.pinId,i)},this._onIconPickerCancel=()=>{this._iconPickerFor=null},this._onPinHeightChange=e=>{const t=this._selectedPin;if(!t)return;const i=e.detail.value.trim(),o=""===i?null:It(i,this._settings.unit_system);this._patchPin(t.id,{height_m:null!==o&&Number.isFinite(o)?o:null})},this._onPinDelete=async()=>{const e=this._selectedPin;e&&await this._ask("deletePin","remove",{name:this._pinLabel(e)})&&(this._updateLayout({pins:this._layout.pins.filter(t=>t.id!==e.id)}),this._selectedPinId=null,this._multiPinIds=[])},this._onWallMaterialChange=e=>{const t=this._selectedWall;t&&this._updateLayout({walls:this._layout.walls.map(i=>i.id===t.id?{...i,material:e.detail.material}:i)})},this._onWallThicknessChange=e=>{const t=this._selectedWall;t&&(!Number.isFinite(e.detail.thicknessCm)||e.detail.thicknessCm<=0||this._updateLayout({walls:this._layout.walls.map(i=>i.id===t.id?{...i,thickness_cm:e.detail.thicknessCm}:i)}))},this._onWallEditVertices=()=>{this._selectedWallId&&(this._editingWallId=this._editingWallId===this._selectedWallId?null:this._selectedWallId)},this._onWallDelete=async()=>{const e=this._selectedWall;e&&await this._ask("deleteWall","delete")&&(this._updateLayout({walls:this._layout.walls.filter(t=>t.id!==e.id),openings:this._layout.openings.filter(t=>t.wallId!==e.id)}),this._selectedWallId=null,this._editingWallId=null)},this._onOpeningWidthChange=e=>{const t=this._selectedOpening;if(!t)return;const i=e.detail.width;this._updateLayout({openings:this._layout.openings.map(e=>e.id===t.id?{...e,width:i}:e)})},this._onOpeningDelete=async()=>{const e=this._selectedOpening;e&&await this._ask("door"===e.type?"deleteDoor":"deleteWindow","delete")&&(this._updateLayout({openings:this._layout.openings.filter(t=>t.id!==e.id)}),this._selectedOpeningId=null)},this._onPickerPinLocate=e=>{const t=this._pickerPin(e.detail.deviceId);t&&("property"===this._view?this._selectedOutdoorPinId=t.id:this._selectedPinId=t.id)},this._onPickerPinRemove=async e=>{const t=this._pickerPin(e.detail.deviceId);t&&("property"===this._view?(this._selectedOutdoorPinId=t.id,await this._onOutdoorPinDelete()):(this._selectedPinId=t.id,await this._onPinDelete()))},this._onEntityArmed=e=>{this._armedEntityId=this._armedEntityId===e.detail.entityId?null:e.detail.entityId},this._onClearAllPins=async()=>{const e=this._layout.pins.length;0!==e&&await this._ask(1===e?"removeFloorOne":"removeFloorMany","remove",{count:e})&&(this._autoSaveHeld=!0,this._updateLayout({pins:[]}),this._selectedPinId=null,this._multiPinIds=[],this._pinStackIds=null)},this._onRoomTraceComplete=e=>{const t=(i="New Room",o=e.detail.points,n=null,{id:ft("room"),name:i,area_id:n,points:o});var i,o,n;const s=[...this._layout.rooms,t];this._updateLayout({rooms:s,pins:Ge(s,this._layout.pins)}),this._selectedRoomId=t.id},this._onRoomVertexChanged=e=>{const t=this._layout.rooms.map(t=>{if(t.id!==e.detail.roomId)return t;const i=t.label_position,o=!i||Ve(i[0],i[1],e.detail.points);return{...t,points:e.detail.points,...o?{}:{label_position:null}}});this._updateLayout({rooms:t,pins:Ge(t,this._layout.pins)})},this._onRoomSelect=e=>{this._selectedRoomId=e.detail.roomId,null===e.detail.roomId?this._editingRoomId=null:(this._selectedPinId=null,this._multiPinIds=[],this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onWallTraceComplete=e=>{this._updateLayout({walls:[...this._layout.walls,wt(e.detail.points)]})},this._onWallVertexChanged=e=>{this._updateLayout({walls:this._layout.walls.map(t=>t.id===e.detail.wallId?{...t,points:e.detail.points}:t)})},this._onWallSelect=e=>{this._selectedWallId=e.detail.wallId,null===e.detail.wallId?this._editingWallId=null:(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._multiPinIds=[],this._pinStackIds=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningPlace=e=>{if(!this._armedOpeningType)return;const t=function(e,t,i,o,n){return{id:ft("opening"),wallId:e,type:t,x:i,y:o,width:n}}(e.detail.wallId,this._armedOpeningType,e.detail.x,e.detail.y,this._defaultOpeningWidth());this._updateLayout({openings:[...this._layout.openings,t]})},this._onOpeningSelect=e=>{this._selectedOpeningId=e.detail.openingId,null!==e.detail.openingId&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._multiPinIds=[],this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningUpdate=e=>{this._updateLayout({openings:this._layout.openings.map(t=>t.id===e.detail.openingId?{...t,x:e.detail.x,y:e.detail.y,width:e.detail.width}:t)})},this._onPinPlace=e=>{if(!this._armedEntityId)return;const t=qe(e.detail.x,e.detail.y,this._layout.rooms),i=this._entityLookup.get(this._armedEntityId),o=bt(i?.device_id??null,e.detail.x,e.detail.y,t),n=this._layout.pins.filter(t=>t.x===e.detail.x&&t.y===e.detail.y);this._updateLayout({pins:[...this._layout.pins,o]}),this._armedEntityId=null,n.length>0?(this._pinStackIds=[...n.map(e=>e.id),o.id],this._selectedPinId=null,this._multiPinIds=[]):(this._pinStackIds=null,this._selectedPinId=o.id,this._multiPinIds=[],this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinMove=e=>{const t=qe(e.detail.x,e.detail.y,this._layout.rooms);this._patchPin(e.detail.pinId,{x:e.detail.x,y:e.detail.y,room_id:t})},this._onPinMultiToggle=e=>{const t=this._currentPinPick(),i=e.detail.pinIds,o=i.every(e=>t.includes(e))?t.filter(e=>!i.includes(e)):[...t,...i.filter(e=>!t.includes(e))];this._applyPinPick(o)},this._onPinsSelectBox=e=>{const t=e.detail.additive?this._currentPinPick():[],i=[...t,...e.detail.pinIds.filter(e=>!t.includes(e))];0!==i.length&&this._applyPinPick(i)},this._onPinsMove=e=>{const{pinIds:t,dx:i,dy:o}=e.detail;ke.log("pins_move",{count:t.length,dx:Math.round(i),dy:Math.round(o)});const n=new Set(t),s=this._layout.pins.map(e=>{if(!n.has(e.id))return e;const t=e.x+i,s=e.y+o;return{...e,x:t,y:s,room_id:qe(t,s,this._layout.rooms)}});this._updateLayout({pins:s})},this._onMultiPinClear=()=>{this._multiPinIds=[]},this._onPinSelect=e=>{this._selectedPinId=e.detail.pinId,this._multiPinIds=[],this._pinStackIds=null,null!==e.detail.pinId&&(this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinStackSelect=e=>{this._pinStackIds=e.detail.pinIds,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedPinId=null,this._multiPinIds=[],this._selectedMeshLink=null,this._selectedMeshStub=null},this._onMeshLinkSelect=e=>{this._selectedMeshLink=e.detail.link,null!==e.detail.link&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._multiPinIds=[],this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshStub=null)},this._onMeshStubSelect=e=>{this._selectedMeshStub=e.detail.stub,null!==e.detail.stub&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._multiPinIds=[],this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null)},this._onMeshStubGotoFloorClick=()=>{const e=this._selectedMeshStub;e&&(e.targetFloorId===ve?this._selectProperty():this._selectFloor(e.targetFloorId))},this._onPinStackChoose=e=>{this._pinStackIds=null,this._selectedPinId=e.detail.pinId,this._multiPinIds=[]},this._onSelectionClear=()=>{this._resetSelection(),this._pinStackIds=null},this._onPinStackDismiss=()=>{this._pinStackIds=null},this._onPinStackRemove=async e=>{const t=this._layout.pins.find(t=>t.id===e.detail.pinId);if(!t)return;if(!await this._ask("removeFromSpot","remove",{name:this._pinLabel(t)}))return;this._updateLayout({pins:this._layout.pins.filter(t=>t.id!==e.detail.pinId)});const i=(this._pinStackIds??[]).filter(t=>t!==e.detail.pinId);this._pinStackIds=i.length>1?i:null,this._selectedPinId=1===i.length?i[0]:null,this._multiPinIds=[]},this._onScaleLineComplete=async e=>{const t=this._settings.unit_system,i=Pe("imperial"===t?"units.feet":"units.metres"),o=await(this._dialogEl?.prompt({text:Pe("prompt.distance",{unit:i}),confirmText:Pe("dialog.ok")})),n=o?It(o,t):null;if(null===n||!Number.isFinite(n)||n<=0)return;const s=e.detail.points;this._updateLayout({scale:{points:s,meters:n}}),this._mode="select"},this._onPendingChanged=e=>{this._pendingCount=e.detail.count},this._onSnapModeChange=e=>{this._snapMode=e.detail.snapMode;try{localStorage.setItem(Ki,this._snapMode)}catch{}}}async _ask(e,t,i){return await(this._dialogEl?.confirm({text:Pe(`confirm.${e}`,i),confirmText:Pe(`dialog.${t}`),destructive:!0}))??!1}async _notify(e){await(this._dialogEl?.alert({text:e}))}set hass(e){this._hass=e,this._initialized||(this._initialized=!0,this._init())}get hass(){return this._hass}get _client(){return new vt(this._hass)}get _entityLookup(){return new Map(this._entities.map(e=>[e.entity_id,e]))}get _placedDeviceIds(){return new Set(("property"===this._view?this._propertyLayout.pins:this._layout.pins).map(e=>e.device_id).filter(e=>null!==e))}get _selectedRoom(){return this._layout.rooms.find(e=>e.id===this._selectedRoomId)??null}get _areasForCurrentFloor(){return this._areas.filter(e=>e.floor_id===this._currentFloorId||null===e.floor_id)}get _outdoorAreaIdsOnCurrentFloor(){const e=new Set(this._areas.filter(e=>null===e.floor_id).map(e=>e.area_id));return new Set(this._layout.rooms.map(e=>e.area_id).filter(t=>null!==t&&e.has(t)))}get _otherFloors(){return this._floors.filter(e=>e.floor_id!==this._currentFloorId)}get _buildings(){const e=new Map;for(const t of this._floors){const i=t.building_id??t.floor_id,o=e.get(i);o?o.push(t):e.set(i,[t])}return[...e.entries()].map(([e,t])=>{const i=t[0];return{key:e,name:t.length>1?t.map(e=>e.name).join(" + "):i.name,icon:i.icon||"mdi:home-city",floorId:i.floor_id,buildingId:i.building_id,aspectRatio:Ee(t)}})}_buildingBounds(e){return Te(e)}get _floorNameById(){return new Map(this._floors.map(e=>[e.floor_id,e.name]))}get _floorIconById(){return new Map(this._floors.map(e=>[e.floor_id,e.icon||"mdi:floor-plan"]))}get _livePlacements(){return Ce(this._floors,this._propertyLayout.placements)}get _selectedPlacement(){return this._livePlacements.find(e=>e.id===this._selectedPlacementId)??null}get _activeBackground(){return"property"===this._view?{imageId:this._propertyLayout.background_image_id,opacity:this._propertyLayout.background_opacity}:{imageId:this._layout.background_image_id,opacity:this._layout.background_opacity}}get _alignOverlay(){if("align"!==this._mode||!this._alignTargetLayout)return null;const e=yt(this._alignTargetLayout.background_image_id);if(!e)return null;const t=this._alignTargetLayout;return{imageUrl:e,offsetX:this._alignScale*t.background_offset_x+this._alignOffsetX,offsetY:this._alignScale*t.background_offset_y+this._alignOffsetY,scale:this._alignScale*t.background_scale,opacity:.55}}get _orderedFloors(){if("ground_up"!==this._settings.floor_order)return this._floors;const e=this._floors.filter(e=>null!==e.level),t=this._floors.filter(e=>null===e.level);return[...e.reverse(),...t]}get _placedDeviceChoices(){const e=e=>e.label_override??be(e.device_id,this._entityLookup.values()),t=new Map;for(const i of this._layout.pins)i.device_id&&t.set(i.device_id,e(i));for(const[i,{pin:o}]of this._otherFloorPinsByDeviceId)t.has(i)||t.set(i,e(o));return[...t].map(([e,t])=>({deviceId:e,label:t})).sort((e,t)=>e.label.localeCompare(t.label))}get _pinByDeviceId(){const e=new Map;for(const t of this._layout.pins)t.device_id&&e.set(t.device_id,t);return e}get _meshContext(){return{networkType:this._mesh.networkType,zigbeeMesh:this._mesh.zigbeeMesh,zigbeeShowAllLinks:this._mesh.zigbeeShowAllLinks,wifiMesh:this._mesh.wifiMesh,matterTopology:this._mesh.matterTopology,bluetoothAdverts:this._mesh.bluetoothAdverts,bluetoothDevices:this._mesh.bluetoothDevices,settings:this._settings,floors:this._floors,currentFloorId:this._currentFloorId,layout:this._layout,propertyLayout:this._propertyLayout,pinByDeviceId:this._pinByDeviceId,outdoorPinByDeviceId:this._outdoorPinByDeviceId,otherFloorPinsByDeviceId:this._otherFloorPinsByDeviceId,entityLookup:this._entityLookup}}get _normalizedMeshLinks(){return st(this._meshContext)}get _outdoorPinByDeviceId(){const e=new Map;for(const t of this._propertyLayout.pins)t.device_id&&e.set(t.device_id,t);return e}get _propertyMeshLinks(){return at(this._meshContext)}get _selectedPropertyMeshLink(){return this._propertyMeshLinks.find(e=>e.key===this._selectedPropertyMeshLinkKey)??null}get _meshLinksForCurrentFloor(){return lt(this._meshContext)}_placementForFloor(e){return Le(this._floors,this._propertyLayout,e)}get _floorMeshLegend(){return function(e){if(null===e.networkType)return null;const t=dt(e),i=[...lt(e),...t];return{network:e.networkType,dashed:t.length>0?"floor":null,unknown:i.some(e=>"unknown"===e.quality),range:pt(e.networkType,i)}}(this._meshContext)}get _propertyMeshLegend(){return function(e){if(null===e.networkType)return null;const t=at(e);return{network:e.networkType,dashed:t.some(e=>null!==e.from.floorId||null!==e.to.floorId)?"property":null,unknown:t.some(e=>"unknown"===e.quality),range:pt(e.networkType,t)}}(this._meshContext)}get _meshStubsForCurrentFloor(){return dt(this._meshContext)}get _selectedPin(){return this._layout.pins.find(e=>e.id===this._selectedPinId)??null}get _pinStack(){if(!this._pinStackIds)return null;const e=new Map(this._layout.pins.map(e=>[e.id,e])),t=this._pinStackIds.map(t=>e.get(t)).filter(e=>!!e);return t.length>1?t:null}get _selectedWall(){return this._layout.walls.find(e=>e.id===this._selectedWallId)??null}get _selectedOpening(){return this._layout.openings.find(e=>e.id===this._selectedOpeningId)??null}get _selectedMeshLinkKey(){const e=this._selectedMeshLink;return e?`${e.fromPin.id}|${e.toPin.id}`:null}get _selectedMeshStubKey(){const e=this._selectedMeshStub;return e?`${e.fromPin.id}|${e.targetDeviceId}`:null}_unitsPerMeter(){const e=this._layout.scale;if(!e)return null;const[[t,i],[o,n]]=e.points;return(Math.hypot(o-t,n-i)||1)/e.meters}get _propertyScale(){return function(e,t){const i=new Map(e.map(e=>[e.floor_id,e.name])),o=[];for(const n of Ce(e,t)){const t=n.source_bounds;if(!t||n.width<=0)continue;const s=t.max_x-t.min_x;if(s<=0)continue;const r=Oe(e,n);null!==r&&o.push({area:n.width*n.height,mpu:r*s/n.width,name:n.label_override??i.get(n.floor_id)??"a building"})}if(0===o.length)return null;const n=o.reduce((e,t)=>t.area>e.area?t:e);return{metersPerUnit:n.mpu,buildingName:n.name,disagree:o.some(e=>Math.abs(e.mpu/n.mpu-1)>.1)}}(this._floors,this._propertyLayout.placements)}_buildingMetersPerUnit(e){return Oe(this._floors,e)}get _propertyScaleReadout(){const e=this._propertyScale;if(!e)return null;const t=this._settings.unit_system,i=function(e,t){return"imperial"===t?e*kt:e}(1/e.metersPerUnit,t);return Pe("panel.scaleFromBuilding",{building:e.buildingName,unit:$t(t),value:i.toFixed(1)})}_defaultOpeningWidth(){const e=this._unitsPerMeter();return null===e?30:.9*e}async _init(){const[e,t,i,o,n]=await Promise.all([this._client.listFloors(),this._client.listPlaceableEntities(),this._client.listAreas(),this._client.getPropertyLayout(),this._client.getSettings()]);this._floors=e,this._entities=t,this._areas=i,this._propertyLayout=o,this._settings=n,ke.configure(this._client,n.debug_logging),ke.log("panel_open",{panel_version:"0.16.0-beta.2",panel_build:"0.16.0-beta.2+mvhkfi21",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,floors:e.length}),this._checkVersion();const s=this._orderedFloors[0];s&&await this._selectFloor(s.floor_id,{skipDirtyCheck:!0}),this._loading=!1}async _selectFloor(e,t={}){if(!t.skipDirtyCheck&&this._dirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void await this._notify(Pe("errors.floorSave"))}else if(!await this._ask("discardFloor","discard"))return;this._autoSaveHeld=!1,this._view="floor";const i=this._layout.building_id;this._currentFloorId=e,this._layout=await this._client.getLayout(e),this._resetSelection(),this._resetAlignState(),this._floorHistory.clear();const o=Ge(this._layout.rooms,this._layout.pins);o!==this._layout.pins?(this._layout={...this._layout,pins:o},this._dirty=!0):this._dirty=!1,this._loadOtherFloorPins(e),ke.log("floor_load",{floor_id:e,rooms:this._layout.rooms.length,walls:this._layout.walls.length,pins:this._layout.pins.length,healed:this._dirty}),this._sameBuildingAsPreviousFloor=null!==this._layout.building_id&&this._layout.building_id===i}async _loadOtherFloorPins(e){const t=this._floors.filter(t=>t.floor_id!==e),i=await Promise.all(t.map(e=>this._client.getLayout(e.floor_id)));if(this._currentFloorId!==e)return;const o=new Map;t.forEach((e,t)=>{for(const n of i[t].pins)n.device_id&&o.set(n.device_id,{pin:n,floorId:e.floor_id})}),this._otherFloorPinsByDeviceId=o}_resetAlignState(){this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1}_resetSelection(){this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._multiPinIds=[],this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._armedEntityId=null,this._armedOpeningType=null}async _save(){if(this._currentFloorId){this._saving=!0;try{const e=this._canvas?.getViewBox()??this._layout.view_box;this._layout={...this._layout,view_box:e};const t=this._layout,i=performance.now();try{await this._client.saveLayout(this._currentFloorId,t)}catch(e){throw this._saveError=this._describeSaveError(e),ke.log("save_error",{target:this._currentFloorId,error:e?.message}),e}ke.log("save",{target:this._currentFloorId,ms:Math.round(performance.now()-i),rooms:t.rooms.length,pins:t.pins.length}),this._saveError=null,this._layout===t&&(this._dirty=!1),this._floors=this._floors.map(e=>e.floor_id===this._currentFloorId?{...e,has_layout:!0}:e),await this._refreshEntitiesIfPlacementChanged()}finally{this._saving=!1}}}async _export(){const e=await this._client.exportSnapshot(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download="layout.json",o.click(),URL.revokeObjectURL(i)}_updateLayout(e){this._floorHistory.record(this._layout),this._layout={...this._layout,...e},this._dirty=!0}async _selectProperty(){if(this._propertyDirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void await this._notify(Pe("errors.propertySave"))}else if(!await this._ask("discardProperty","discard"))return;this._autoSaveHeld=!1,[this._propertyLayout,this._floors]=await Promise.all([this._client.getPropertyLayout(),this._client.listFloors()]),this._propertyHistory.clear(),ke.log("property_load",{placements:this._propertyLayout.placements.length,outdoor_pins:this._propertyLayout.pins.length}),this._propertyDirty=!1,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._propertyMode="select",this._armedBuildingKey=null,this._armedEntityId=null,this._view="property",this._loadPlacementGhosts()}async _loadPlacementGhosts(){this._ghostsLoading=!0;try{await this._loadPlacementGhostsNow()}finally{this._ghostsLoading=!1}}async _loadPlacementGhostsNow(){const e=this._livePlacements,t=new Set,i=e=>this._floors.filter(t=>null!==e.building_id?t.building_id===e.building_id:t.floor_id===e.floor_id);for(const o of e)for(const e of i(o))t.add(e.floor_id);const o=new Map;await Promise.all([...t].map(async e=>{try{o.set(e,await this._client.getLayout(e))}catch{}}));const n=new Map;for(const t of e){const e=[],s=[];for(const n of i(t)){const t=o.get(n.floor_id);if(t){for(const i of t.rooms)!1!==i.visible&&e.push(i.points);for(const e of t.walls)s.push(e.points)}}n.set(t.id,{rooms:e,walls:s})}"property"===this._view&&(this._placementGhosts=n)}get _mapTilesAvailable(){const e=this._hass?.config;return!!e?.components?.includes("map_tiles")&&"number"==typeof e.latitude&&"number"==typeof e.longitude}_adjustMap(e){const t=this._propertyLayout.map_background;t&&this._updatePropertyLayout({map_background:e(t)})}_updatePropertyLayout(e){this._propertyHistory.record(this._propertyLayout),this._propertyLayout={...this._propertyLayout,...e},this._propertyDirty=!0}_undoRedo(e){if(ke.log(e,{view:this._view}),"property"===this._view){const t=this._propertyLayout,i="undo"===e?this._propertyHistory.undo(t):this._propertyHistory.redo(t);if(!i)return;return this._propertyLayout={...i,view_box:t.view_box},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const t=this._layout,i="undo"===e?this._floorHistory.undo(t):this._floorHistory.redo(t);i&&(this._layout={...i,view_box:t.view_box,building_id:t.building_id},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)}get _canUndo(){return"property"===this._view?this._propertyHistory.canUndo:this._floorHistory.canUndo}get _canRedo(){return"property"===this._view?this._propertyHistory.canRedo:this._floorHistory.canRedo}async _saveProperty(){this._propertySaving=!0;try{const e=this._propertyCanvas?.getViewBox()??this._propertyLayout.view_box;this._propertyLayout={...this._propertyLayout,view_box:e};const t=this._propertyLayout,i=performance.now();try{await this._client.savePropertyLayout(t)}catch(e){throw this._saveError=this._describeSaveError(e),ke.log("save_error",{target:"property",error:e?.message}),e}ke.log("save",{target:"property",ms:Math.round(performance.now()-i),placements:t.placements.length,pins:t.pins.length}),this._saveError=null,this._propertyLayout===t&&(this._propertyDirty=!1),await this._refreshEntitiesIfPlacementChanged()}finally{this._propertySaving=!1}}get _selectedOutdoorPin(){return this._propertyLayout.pins.find(e=>e.id===this._selectedOutdoorPinId)??null}_patchOutdoorPin(e,t){this._updatePropertyLayout({pins:this._propertyLayout.pins.map(i=>i.id===e?{...i,...t}:i)})}_newPlacementLongSide(e,t){const i=this._propertyLayout.map_background,o=i?function(e){const t=512*2**e.zoom;return 40075016.686*Math.cos(e.lat*Math.PI/180)/t}(i):this._propertyScale?.metersPerUnit??null;if(!o)return;const n=this._buildingMetersPerUnit({floor_id:e.floorId,building_id:e.buildingId});return(t&&n?Math.max(t.max_x-t.min_x,t.max_y-t.min_y)*n:12)/o}_patchPlacement(e,t){this._updatePropertyLayout({placements:this._propertyLayout.placements.map(i=>i.id===e?{...i,...t}:i)})}_describeSaveError(e){const t=e?.message||"unknown error";return/not a valid option|extra keys not allowed|invalid_format/i.test(t)?`${t} — Home Assistant may need a restart to finish updating Spatial Context.`:t}_placementKey(){return[...this._layout.pins,...this._propertyLayout.pins].map(e=>e.device_id??"").sort().join(",")}async _refreshEntitiesIfPlacementChanged(){const e=this._placementKey();e!==this._placementKeyForEntities&&(this._entities=await this._client.listPlaceableEntities(),this._placementKeyForEntities=e)}async _checkVersion(){let e=null,t=null;try{t=await this._client.getVersionInfo()}catch{e="restart"}t&&(t.loaded_version&&t.installed_version&&t.loaded_version!==t.installed_version?e="restart":t.panel_build_id&&"0.16.0-beta.2+mvhkfi21"!==t.panel_build_id&&(e="reload")),e!==this._versionNotice&&ke.log("version_check",{notice:e,panel_build:"0.16.0-beta.2+mvhkfi21",...t??{}}),this._versionNotice=e}async _downloadDebugReport(){await ke.flush();const e=await this._client.getDebugReport(),t=new Blob([JSON.stringify({...e,browser:{panel_version:"0.16.0-beta.2",panel_build:"0.16.0-beta.2+mvhkfi21",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`}},null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=`spatial-context-debug-${(new Date).toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i)}get _autoSaveActive(){return this._settings.auto_save&&!this._autoSaveHeld}willUpdate(e){["_selectedRoomId","_selectedPinId","_selectedWallId","_selectedOpeningId","_selectedMeshLink","_selectedMeshStub","_pinStackIds","_selectedPlacementId","_selectedOutdoorPinId","_selectedPropertyMeshLinkKey"].some(t=>e.has(t)&&null!=this[t])&&(this._meshPopoverOpen=!1,this._backgroundPopoverOpen=!1,this._moreOptionsPopoverOpen=!1)}updated(e){super.updated(e),(e.has("_layout")||e.has("_propertyLayout")||e.has("_dirty")||e.has("_propertyDirty"))&&this._scheduleAutoSave(),e.has("_propertyLayout")&&"property"===this._view&&!this._ghostsLoading&&this._livePlacements.some(e=>!this._placementGhosts.has(e.id))&&this._loadPlacementGhosts()}_scheduleAutoSave(){null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null),this._autoSaveActive&&(this._dirty||this._propertyDirty)&&(this._autoSaveTimer=window.setTimeout(()=>{this._runAutoSave()},Gi.AUTO_SAVE_DELAY_MS))}async _runAutoSave(){if(this._autoSaveTimer=null,this._autoSaveActive)if(this._saving||this._propertySaving)this._scheduleAutoSave();else try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{}}async _flushAutoSave(){if(!this._autoSaveActive)return!this._dirty&&!this._propertyDirty;null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null);try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{return!1}return!this._dirty&&!this._propertyDirty}_setFavicon(){const e=document.head,t=[...e.querySelectorAll('link[rel~="icon"]')],i=document.createElement("link");i.rel="icon",i.type="image/svg+xml",i.href="/spatial_context/spatial-context-favicon.svg";const o=document.createElement("link");o.rel="icon",o.type="image/png",o.href="/spatial_context/spatial-context-favicon.png",t.forEach(e=>e.remove()),e.append(i,o),this._faviconRestore=()=>{i.remove(),o.remove(),e.append(...t)}}connectedCallback(){super.connectedCallback(),this._setFavicon(),this._fitToViewport(),window.visualViewport?.addEventListener("resize",this._fitToViewport),window.addEventListener("resize",this._fitToViewport),window.addEventListener("orientationchange",this._fitToViewport),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("beforeunload",this._onBeforeUnload),document.addEventListener("visibilitychange",this._onVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),this._faviconRestore?.(),this._faviconRestore=null,window.visualViewport?.removeEventListener("resize",this._fitToViewport),window.removeEventListener("resize",this._fitToViewport),window.removeEventListener("orientationchange",this._fitToViewport),window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("beforeunload",this._onBeforeUnload),document.removeEventListener("visibilitychange",this._onVisibilityChange),ke.flush(),this._flushAutoSave()}_deepActiveElement(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}_isTypingTarget(){const e=this._deepActiveElement();return!!e&&(!!(e instanceof HTMLElement&&e.isContentEditable)||("TEXTAREA"===e.tagName||e instanceof HTMLInputElement&&["text","number","search","email","url","tel","password"].includes(e.type)))}async _handleBackgroundFile(e){if(Gi._ACCEPTED_BACKGROUND_TYPES.has(e.type))try{const t={background_image_id:await this._client.uploadBackgroundImage(e),background_opacity:.85};"property"===this._view?this._updatePropertyLayout(t):this._updateLayout(t)}catch(e){await this._notify(Pe("errors.bgUpload",{error:e.message}))}else await this._notify(Pe("errors.bgType"))}_patchRoom(e,t){this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===e?{...i,...t}:i)})}get _iconPickerPin(){const e=this._iconPickerFor;if(!e)return null;return("floor"===e.kind?this._layout.pins:this._propertyLayout.pins).find(t=>t.id===e.pinId)??null}_patchPin(e,t){this._updateLayout({pins:this._layout.pins.map(i=>i.id===e?{...i,...t}:i)})}_pickerPin(e){return("property"===this._view?this._propertyLayout.pins:this._layout.pins).find(t=>t.device_id===e)??null}_applyPinPick(e){this._pinStackIds=null,this._selectedRoomId=null,this._editingRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,e.length>1?(this._selectedPinId=null,this._multiPinIds=e):(this._selectedPinId=e[0]??null,this._multiPinIds=[])}_currentPinPick(){return this._multiPinIds.length>0?this._multiPinIds:this._selectedPinId?[this._selectedPinId]:[]}_pinLabel(e){return e.label_override?e.label_override:be(e.device_id,this._entityLookup.values())}_meshAgeLabel(e){const t=Math.round((Date.now()-e)/1e3);return t<60?Pe("network.refreshedSeconds",{n:t}):Pe("network.refreshedMinutes",{n:Math.round(t/60)})}_renderBackgroundPopover(){return V`
      <icon-popover
        slot="row-end"
        compact
        icon="mdi:image"
        label=${Pe("menu.background")}
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
          ${this._activeBackground.imageId?Pe("menu.replaceBackground"):Pe("menu.uploadBackground")}
        </button>
        ${"property"===this._view&&this._mapTilesAvailable&&void 0!==this._propertyLayout.map_background?V`<button
                  class="menu-item"
                  @click=${this._onToggleMapBackground}
                >
                  <ha-icon icon="mdi:map"></ha-icon>
                  ${this._propertyLayout.map_background?Pe("mapBackground.remove"):Pe("mapBackground.add")}
                </button>
                ${this._propertyLayout.map_background?V`<label class="popover-row"
                          >${Pe("mapBackground.style")}
                          <span class="select-wrap"
                            ><select @change=${this._onMapStyleChange}>
                              <option
                                value="street"
                                ?selected=${"aerial"!==this._propertyLayout.map_background.style}
                              >
                                ${Pe("mapBackground.street")}
                              </option>
                              <option
                                value="aerial"
                                ?selected=${"aerial"===this._propertyLayout.map_background.style}
                              >
                                ${Pe("mapBackground.aerial")}
                              </option></select
                            ><ha-icon
                              class="chev"
                              icon="mdi:menu-down"
                            ></ha-icon
                          ></span>
                        </label>
                        <label class="popover-row"
                          >${Pe("mapBackground.opacity")}
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            style="--pct:${(this._propertyLayout.map_background.opacity-.1)/.9*100}%"
                            .value=${String(this._propertyLayout.map_background.opacity)}
                            @input=${this._onMapOpacityChange}
                          />
                        </label>`:K}`:K}
        ${this._activeBackground.imageId?V`<button
                class="menu-item"
                @click=${this._onRemoveBackgroundClick}
              >
                <ha-icon icon="mdi:image-remove"></ha-icon>
                ${Pe("menu.removeBackground")}
              </button>`:K}
        ${this._activeBackground.imageId?V`<label class="popover-row"
                >${Pe("menu.opacity")}
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  style="--pct:${(this._activeBackground.opacity-.1)/.9*100}%"
                  .value=${String(this._activeBackground.opacity)}
                  @input=${this._onOpacityChange}
                />
              </label>`:K}
      </icon-popover>
    `}get _networkLabel(){switch(this._mesh.networkType){case"zigbee":return Pe("network.zigbeeShort");case"wifi":return Pe("network.wifiShort");case"matter":return Pe("network.matterShort");case"bluetooth":return Pe("network.bluetooth");default:return null}}render(){if(this._loading)return V`<div class="loading">${Pe("panel.loading")}</div>`;if(0===this._floors.length)return V`<div class="no-floors">${Pe("panel.noFloors")}</div>`;const e=this._mesh.error;return V`
      <app-header
        .narrow=${this.narrow}
        ?light=${!this._hass?.themes?.darkMode}
        .floors=${this._orderedFloors}
        .selectedFloorId=${this._currentFloorId}
        .propertySelected=${"property"===this._view}
        .page=${this._settingsOpen?"settings":""}
        @open-settings=${this._onOpenSettings}
        @page-back=${()=>this._settingsOpen=!1}
        @floor-selected=${this._onFloorSelected}
        @property-selected=${this._onPropertySelected}
      >
        ${"floor"===this._view||"property"===this._view?V`<icon-popover
                icon="mdi:lan"
                label=${Pe("menu.connectivity")}
                .open=${this._meshPopoverOpen}
                ?highlight=${null!==this._mesh.networkType}
                @toggle=${this._onToggleMeshPopover}
              >
                <div class="layer-list">
                  <button
                    class="menu-item ${"zigbee"===this._mesh.networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("zigbee")}
                  >
                    <ha-icon icon="mdi:zigbee"></ha-icon>
                    ${Pe("network.zigbee")}
                    ${"zigbee"===this._mesh.networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:K}
                  </button>
                  <button
                    class="menu-item ${"wifi"===this._mesh.networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("wifi")}
                  >
                    <ha-icon icon="mdi:wifi"></ha-icon>
                    ${Pe("network.wifi")}
                    ${"wifi"===this._mesh.networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:K}
                  </button>
                  <button
                    class="menu-item ${"matter"===this._mesh.networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("matter")}
                  >
                    <ha-icon icon="mdi:router-wireless"></ha-icon>
                    ${Pe("network.matter")}
                    ${"matter"===this._mesh.networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:K}
                  </button>
                  <button
                    class="menu-item ${"bluetooth"===this._mesh.networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("bluetooth")}
                  >
                    <ha-icon icon="mdi:bluetooth"></ha-icon>
                    ${Pe("network.bluetooth")}
                    ${"bluetooth"===this._mesh.networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:K}
                  </button>
                </div>
                ${null===this._mesh.networkType?K:V`
                        <div class="menu-divider"></div>
                        ${"zigbee"===this._mesh.networkType?V`<button
                                  class="menu-item"
                                  ?disabled=${this._mesh.zigbeeLoading}
                                  @click=${this._onLoadMesh}
                                >
                                  <ha-icon icon="mdi:refresh"></ha-icon>
                                  ${this._mesh.zigbeeLoading?Pe("network.loadingZigbee",{seconds:this._mesh.zigbeeElapsedSeconds}):this._mesh.zigbeeFetchedAt?Pe("network.refresh"):Pe("network.load")}
                                </button>
                                <label class="popover-row">
                                  ${Pe("network.showAll")}
                                  <input
                                    type="checkbox"
                                    class="switch"
                                    role="switch"
                                    .checked=${this._mesh.zigbeeShowAllLinks}
                                    @change=${e=>{this._mesh.zigbeeShowAllLinks=e.target.checked,this._selectedMeshLink=null,this._selectedMeshStub=null}}
                                  />
                                </label>`:this._mesh.live?V`<span
                                  class="hint"
                                  style="padding: 4px 16px 8px"
                                  >${Pe("network.live")}</span
                                >`:"wifi"===this._mesh.networkType&&this._mesh.wifiLoading?V`<span
                                    class="hint"
                                    style="padding: 4px 16px 8px"
                                    >${Pe("network.loading")}</span
                                  >`:K}
                        ${e?V`<span
                                class="hint"
                                style="color: var(--sc-danger); padding: 0 16px 8px"
                                >${e}</span
                              >`:"zigbee"===this._mesh.networkType&&this._mesh.zigbeeFetchedAt?V`<span
                                  class="hint"
                                  style="padding: 0 16px 8px"
                                  >${this._meshAgeLabel(this._mesh.zigbeeFetchedAt)}</span
                                >`:K}
                      `}
              </icon-popover>`:K}
        <icon-popover
          slot="end"
          icon="mdi:dots-vertical"
          label=${Pe("menu.more")}
          .open=${this._moreOptionsPopoverOpen}
          @toggle=${this._onToggleMoreOptionsPopover}
        >
          <button
            class="menu-item"
            @click=${()=>{this._moreOptionsPopoverOpen=!1,window.open("https://greminn.github.io/ha-spatial-context/guide/first-floor-plan","_blank","noopener")}}
          >
            <ha-icon icon="mdi:book-open-variant"></ha-icon>
            ${Pe("menu.gettingStarted")}
          </button>
          <button
            class="menu-item"
            @click=${()=>{this._moreOptionsPopoverOpen=!1,this._onExportClick()}}
          >
            <ha-icon icon="mdi:download"></ha-icon>
            ${Pe("menu.exportJson")}
          </button>
          <button
            class="menu-item"
            title=${Pe("menu.debugReportHint")}
            aria-label=${Pe("menu.debugReportHint")}
            @click=${()=>{this._moreOptionsPopoverOpen=!1,this._downloadDebugReport()}}
          >
            <ha-icon icon="mdi:bug"></ha-icon> ${Pe("menu.debugReport")}
          </button>
          <button
            class="menu-item danger"
            @click=${()=>{this._moreOptionsPopoverOpen=!1,this._onResetClick()}}
          >
            <ha-icon icon="mdi:delete-sweep"></ha-icon>
            ${"property"===this._view?Pe("menu.resetProperty"):Pe("menu.resetFloor")}
          </button>
        </icon-popover>
      </app-header>

      ${this._settingsOpen?V`<settings-page
              .settings=${this._settings}
              .coordinatorChoices=${this._placedDeviceChoices}
              @settings-change=${this._onSettingsChange}
            ></settings-page>`:V`<div class="main">
              ${this._versionNotice?V`<div class="save-error floating-panel" role="status">
                      <ha-icon icon="mdi:update"></ha-icon>
                      <span
                        >${"restart"===this._versionNotice?Pe("panel.versionRestart"):Pe("panel.versionReload")}</span
                      >
                      <button @click=${()=>this._versionNotice=null}>
                        ${Pe("panel.dismiss")}
                      </button>
                    </div>`:K}
              ${this._saveError?V`<div class="save-error floating-panel" role="alert">
                      <ha-icon icon="mdi:alert"></ha-icon>
                      <span
                        >${Pe("errors.saveFailed",{error:this._saveError})}</span
                      >
                      <button @click=${this._onSaveClick}>
                        ${Pe("errors.retry")}
                      </button>
                    </div>`:K}
              ${"property"===this._view?V`
                      <div
                        class="canvas-area ${this._dragOverCanvas?"drag-over":""}"
                        @dragover=${this._onCanvasDragOver}
                        @dragleave=${this._onCanvasDragLeave}
                        @drop=${this._onCanvasDrop}
                      >
                        <property-canvas
                          .dark=${this._hass?.themes?.darkMode??!1}
                          .placements=${this._livePlacements}
                          .ghosts=${this._placementGhosts}
                          .hass=${this._hass}
                          .mapBackground=${this._propertyLayout.map_background??null}
                          @map-adjust=${this._onMapAdjust}
                          .floorNameById=${this._floorNameById}
                          .floorIconById=${this._floorIconById}
                          .backgroundImageUrl=${yt(this._propertyLayout.background_image_id)}
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
                          .dirty=${this._propertyDirty}
                          .saving=${this._propertySaving}
                          .canUndo=${this._canUndo}
                          .canRedo=${this._canRedo}
                          @undo-click=${this._onUndo}
                          @redo-click=${this._onRedo}
                          @save-click=${this._onSaveClick}
                          .meshLegend=${this._propertyMeshLegend}
                          .mode=${this._propertyMode}
                          .buildings=${this._buildings}
                          .scaleReadout=${this._propertyScaleReadout}
                          .scaleWarning=${this._propertyScale?.disagree?Pe("panel.scaleDisagree"):null}
                          .armedBuildingKey=${this._armedBuildingKey}
                          .selectedPlacement=${this._selectedPlacement}
                          .selectedPinLabel=${this._selectedOutdoorPin?this._pinLabel(this._selectedOutdoorPin):null}
                          .selectedMeshLink=${this._selectedPropertyMeshLink}
                          .selectedPinDefaultLabel=${this._selectedOutdoorPin?be(this._selectedOutdoorPin.device_id,this._entityLookup.values()):null}
                          .selectedPinOverride=${this._selectedOutdoorPin?.label_override??null}
                          .selectedPinDeviceId=${this._selectedOutdoorPin?.device_id??null}
                          .meshLinks=${this._propertyMeshLinks}
                          .networkLabel=${this._networkLabel}
                          .floorNameById=${this._floorNameById}
                          @outdoor-pin-label-change=${this._onOutdoorPinLabelChange}
                          @selection-clear=${this._onPropertySelectionClear}
                          @outdoor-pin-icon-click=${this._onOutdoorPinIcon}
                          @outdoor-pin-delete-click=${this._onOutdoorPinDelete}
                          @property-mesh-goto-floor-click=${this._onPropertyMeshGotoFloor}
                          @property-mode-change=${this._onPropertyModeChange}
                          @map-rotation-set=${this._onMapRotationSet}
                          @map-zoom-step=${this._onMapZoomStep}
                          .mapActive=${!!this._propertyLayout.map_background}
                          .mapRotation=${this._propertyLayout.map_background?.rotation_deg??0}
                          @placement-arm=${this._onPlacementArm}
                          @placement-label-change=${this._onPlacementLabelChange}
                          @placement-delete-click=${this._onPlacementDeleteClick}
                          @placement-goto-floor-click=${this._onPlacementGotoFloorClick}
                          >${this._renderBackgroundPopover()}</property-overlay
                        >
                      </div>
                      ${"place-pin"===this._propertyMode?V`<entity-picker-sidebar
                              @picker-close=${this._onPickerClose}
                              .entities=${this._entities}
                              .placedDeviceIds=${this._placedDeviceIds}
                              .armedEntityId=${this._armedEntityId}
                              .floors=${this._floors}
                              .areas=${this._areas}
                              .currentFloorId=${ve}
                              @entity-armed=${this._onEntityArmed}
                              @pin-locate=${this._onPickerPinLocate}
                              @pin-remove=${this._onPickerPinRemove}
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
                          @calibrate-scale-click=${this._onCalibrateScaleClick}
                          .dark=${this._hass?.themes?.darkMode??!1}
                          .rooms=${this._layout.rooms}
                          .pins=${this._layout.pins}
                          .walls=${this._layout.walls}
                          .openings=${this._layout.openings}
                          .scale=${this._layout.scale}
                          .unitSystem=${this._settings.unit_system}
                          .meshLinks=${this._meshLinksForCurrentFloor}
                          .meshStubs=${this._meshStubsForCurrentFloor}
                          .entityLookup=${this._entityLookup}
                          .backgroundImageUrl=${yt(this._layout.background_image_id)}
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
                          .multiPinIds=${this._multiPinIds}
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
                          @pin-multi-toggle=${this._onPinMultiToggle}
                          @pins-select-box=${this._onPinsSelectBox}
                          @pins-move=${this._onPinsMove}
                          @pin-stack-select=${this._onPinStackSelect}
                          @mesh-link-select=${this._onMeshLinkSelect}
                          @mesh-stub-select=${this._onMeshStubSelect}
                          @scale-line-complete=${this._onScaleLineComplete}
                          @pending-changed=${this._onPendingChanged}
                          @align-drag=${this._onAlignDrag}
                        ></floorplan-canvas>

                        <canvas-overlay
                          .dirty=${this._dirty}
                          .saving=${this._saving}
                          .canUndo=${this._canUndo}
                          .canRedo=${this._canRedo}
                          @undo-click=${this._onUndo}
                          @redo-click=${this._onRedo}
                          @save-click=${this._onSaveClick}
                          .meshLegend=${this._floorMeshLegend}
                          .mode=${this._mode}
                          .armedOpeningType=${this._armedOpeningType}
                          .hasPendingTrace=${"trace"===this._mode&&this._pendingCount>0}
                          .hasPendingWall=${"wall"===this._mode&&this._pendingCount>=2}
                          .snapMode=${this._snapMode}
                          .pendingScaleCount=${"scale"===this._mode?this._pendingCount:0}
                          .unitSystem=${this._settings.unit_system}
                          .unitsPerMeter=${this._unitsPerMeter()}
                          .selectedRoom=${this._selectedRoom}
                          .editingRoom=${!!this._editingRoomId}
                          .areas=${this._areasForCurrentFloor}
                          .selectedPin=${this._selectedPin}
                          .multiPinCount=${this._multiPinIds.length}
                          @multi-pin-clear=${this._onMultiPinClear}
                          .selectedWall=${this._selectedWall}
                          .editingWall=${!!this._editingWallId}
                          .selectedOpening=${this._selectedOpening}
                          .selectedMeshLink=${this._selectedMeshLink}
                          .meshLinks=${this._meshLinksForCurrentFloor}
                          .meshStubs=${this._meshStubsForCurrentFloor}
                          .networkLabel=${this._networkLabel}
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
                          @room-name-change=${this._onRoomNameChange}
                          @room-area-change=${this._onRoomAreaChange}
                          @room-visible-toggle=${this._onRoomVisibleToggle}
                          @room-fill-color-change=${this._onRoomFillColorChange}
                          @room-fill-opacity-change=${this._onRoomFillOpacityChange}
                          @room-border-opacity-change=${this._onRoomBorderOpacityChange}
                          @room-edit-vertices-click=${this._onRoomEditVertices}
                          @room-label-reset-click=${this._onRoomLabelReset}
                          @room-delete-click=${this._onRoomDelete}
                          @pin-label-change=${this._onPinLabelChange}
                          @pin-set-icon-click=${this._onPinSetIcon}
                          @pin-height-change=${this._onPinHeightChange}
                          @pin-delete-click=${this._onPinDelete}
                          @wall-material-change=${this._onWallMaterialChange}
                          @wall-thickness-change=${this._onWallThicknessChange}
                          @wall-edit-vertices-click=${this._onWallEditVertices}
                          @wall-delete-click=${this._onWallDelete}
                          @opening-width-change=${this._onOpeningWidthChange}
                          @opening-delete-click=${this._onOpeningDelete}
                          @pin-stack-choose=${this._onPinStackChoose}
                          @pin-stack-dismiss=${this._onPinStackDismiss}
                          @selection-clear=${this._onSelectionClear}
                          @pin-stack-remove-click=${this._onPinStackRemove}
                          @mesh-stub-goto-floor-click=${this._onMeshStubGotoFloorClick}
                          >${this._renderBackgroundPopover()}</canvas-overlay
                        >
                      </div>
                      ${"place"===this._mode?V`<entity-picker-sidebar
                              @picker-close=${this._onPickerClose}
                              .entities=${this._entities}
                              .placedDeviceIds=${this._placedDeviceIds}
                              .armedEntityId=${this._armedEntityId}
                              .floors=${this._floors}
                              .areas=${this._areas}
                              .currentFloorId=${this._currentFloorId}
                              .linkedAreaIds=${this._outdoorAreaIdsOnCurrentFloor}
                              @entity-armed=${this._onEntityArmed}
                              @pin-locate=${this._onPickerPinLocate}
                              @pin-remove=${this._onPickerPinRemove}
                              @clear-all-pins=${this._onClearAllPins}
                            ></entity-picker-sidebar>`:K}
                    `}
            </div>`}
      <sc-dialog></sc-dialog>
      ${this._iconPickerPin?V`<icon-picker-dialog
              .value=${this._iconPickerPin.icon_override??null}
              .suggestFrom=${this._pinLabel(this._iconPickerPin)}
              @icon-picked=${this._onIconPicked}
              @icon-picker-cancel=${this._onIconPickerCancel}
            ></icon-picker-dialog>`:K}
    `}};Yi.styles=[Et,Bt,Rt,At,qi],Yi.AUTO_SAVE_DELAY_MS=3e3,Yi._ACCEPTED_BACKGROUND_TYPES=new Set(["image/png","image/jpeg","image/gif"]),e([ge()],Yi.prototype,"_floors",void 0),e([ge()],Yi.prototype,"_currentFloorId",void 0),e([ge()],Yi.prototype,"_layout",void 0),e([ge()],Yi.prototype,"_entities",void 0),e([ge()],Yi.prototype,"_areas",void 0),e([ge()],Yi.prototype,"_mode",void 0),e([ge()],Yi.prototype,"_snapMode",void 0),e([ge()],Yi.prototype,"_dragOverCanvas",void 0),e([ge()],Yi.prototype,"_armedEntityId",void 0),e([ge()],Yi.prototype,"_armedOpeningType",void 0),e([ge()],Yi.prototype,"_selectedRoomId",void 0),e([ge()],Yi.prototype,"_editingRoomId",void 0),e([ge()],Yi.prototype,"_selectedPinId",void 0),e([ge()],Yi.prototype,"_multiPinIds",void 0),e([ge()],Yi.prototype,"_pinStackIds",void 0),e([ge()],Yi.prototype,"_selectedWallId",void 0),e([ge()],Yi.prototype,"_editingWallId",void 0),e([ge()],Yi.prototype,"_selectedOpeningId",void 0),e([ge()],Yi.prototype,"_selectedMeshLink",void 0),e([ge()],Yi.prototype,"_selectedMeshStub",void 0),e([ge()],Yi.prototype,"_otherFloorPinsByDeviceId",void 0),e([ge()],Yi.prototype,"_dirty",void 0),e([ge()],Yi.prototype,"_saving",void 0),e([ge()],Yi.prototype,"_loading",void 0),e([ge()],Yi.prototype,"_pendingCount",void 0),e([ge()],Yi.prototype,"_backgroundPopoverOpen",void 0),e([ge()],Yi.prototype,"_meshPopoverOpen",void 0),e([ge()],Yi.prototype,"_settings",void 0),e([ge()],Yi.prototype,"_settingsOpen",void 0),e([ge()],Yi.prototype,"_moreOptionsPopoverOpen",void 0),e([ge()],Yi.prototype,"_view",void 0),e([ge()],Yi.prototype,"_placementGhosts",void 0),e([ge()],Yi.prototype,"_propertyLayout",void 0),e([ge()],Yi.prototype,"_propertyDirty",void 0),e([ge()],Yi.prototype,"_saveError",void 0),e([ge()],Yi.prototype,"_iconPickerFor",void 0),e([ge()],Yi.prototype,"_versionNotice",void 0),e([ge()],Yi.prototype,"_propertySaving",void 0),e([ge()],Yi.prototype,"_selectedPlacementId",void 0),e([ge()],Yi.prototype,"_propertyMode",void 0),e([ge()],Yi.prototype,"_selectedOutdoorPinId",void 0),e([ge()],Yi.prototype,"_selectedPropertyMeshLinkKey",void 0),e([ge()],Yi.prototype,"_armedBuildingKey",void 0),e([ge()],Yi.prototype,"_sameBuildingAsPreviousFloor",void 0),e([ge()],Yi.prototype,"_alignTargetFloorId",void 0),e([ge()],Yi.prototype,"_alignTargetLayout",void 0),e([ge()],Yi.prototype,"_alignOffsetX",void 0),e([ge()],Yi.prototype,"_alignOffsetY",void 0),e([ge()],Yi.prototype,"_alignScale",void 0),e([_e("floorplan-canvas")],Yi.prototype,"_canvas",void 0),e([_e("property-canvas")],Yi.prototype,"_propertyCanvas",void 0),e([_e("#file-input")],Yi.prototype,"_fileInput",void 0),e([_e("sc-dialog")],Yi.prototype,"_dialogEl",void 0),e([ue({type:Boolean})],Yi.prototype,"narrow",void 0),Yi=Gi=e([me("spatial-context-panel")],Yi)}();
