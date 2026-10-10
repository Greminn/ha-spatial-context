/*! spatial-context-panel v0.14.0-beta.1 | MIT */
!function(){"use strict";function e(e,t,i,o){var n,s=arguments.length,r=s<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,o);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(r=(s<3?n(r):s>3?n(t,i,r):n(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new s(i,e,o)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",y=_.reactiveElementPolyfillSupport,v=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&d(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:n}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const s=o?.call(this);n?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,o)=>{if(i)e.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of o){const o=document.createElement("style"),n=t.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=o;const s=n.fromAttribute(t,e.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(e,t,i,o=!1,n){if(void 0!==e){const s=this.constructor;if(!1===o&&(n=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??b)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==n||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,y?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,$=e=>e,P=k.trustedTypes,I=P?P.createPolicy("lit-html",{createHTML:e=>e}):void 0,M="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,E=`<${C}>`,L=document,T=()=>L.createComment(""),O=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,B="[ \t\n\f\r]",A=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,D=/>/g,z=RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,W=/"/g,U=/^(?:script|style|textarea|title)$/i,N=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=N(1),Y=N(2),j=Symbol.for("lit-noChange"),X=Symbol.for("lit-nothing"),K=new WeakMap,q=L.createTreeWalker(L,129);function G(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==I?I.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,o=[];let n,s=2===t?"<svg>":3===t?"<math>":"",r=A;for(let t=0;t<i;t++){const i=e[t];let a,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===A?"!--"===l[1]?r=F:void 0!==l[1]?r=D:void 0!==l[2]?(U.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=z):void 0!==l[3]&&(r=z):r===z?">"===l[0]?(r=n??A,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?z:'"'===l[3]?W:H):r===W||r===H?r=z:r===F||r===D?r=A:(r=z,n=void 0);const h=r===z&&e[t+1].startsWith("/>")?" ":"";s+=r===A?i+E:d>=0?(o.push(a),i.slice(0,d)+M+i.slice(d)+S+h):i+S+(-2===d?t:h)}return[G(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class J{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let n=0,s=0;const r=e.length-1,a=this.parts,[l,d]=Z(e,t);if(this.el=J.createElement(l,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=q.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(M)){const t=d[s++],i=o.getAttribute(e).split(S),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?oe:"?"===r[1]?ne:"@"===r[1]?se:ie}),o.removeAttribute(e)}else e.startsWith(S)&&(a.push({type:6,index:n}),o.removeAttribute(e));if(U.test(o.tagName)){const e=o.textContent.split(S),t=e.length-1;if(t>0){o.textContent=P?P.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],T()),q.nextNode(),a.push({type:2,index:++n});o.append(e[t],T())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:n});else{let e=-1;for(;-1!==(e=o.data.indexOf(S,e+1));)a.push({type:7,index:n}),e+=S.length-1}n++}}static createElement(e,t){const i=L.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,o){if(t===j)return t;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=O(t)?void 0:t._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(e),n._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(t=Q(e,n._$AS(e,t.values),n,o)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??L).importNode(t,!0);q.currentNode=o;let n=q.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let t;2===a.type?t=new te(n,n.nextSibling,this,e):1===a.type?t=new a.ctor(n,a.name,a.strings,this,e):6===a.type&&(t=new re(n,this,e)),this._$AV.push(t),a=i[++r]}s!==a?.index&&(n=q.nextNode(),s++)}return q.currentNode=L,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=X,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),O(e)?e===X||null==e||""===e?(this._$AH!==X&&this._$AR(),this._$AH=X):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==X&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(L.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=J.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new ee(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new J(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const n of e)o===t.length?t.push(i=new te(this.O(T()),this.O(T()),this,this.options)):i=t[o],i._$AI(n),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,n){this.type=1,this._$AH=X,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=X}_$AI(e,t=this,i,o){const n=this.strings;let s=!1;if(void 0===n)e=Q(this,e,t,0),s=!O(e)||e!==this._$AH&&e!==j,s&&(this._$AH=e);else{const o=e;let r,a;for(e=n[0],r=0;r<n.length-1;r++)a=Q(this,o[i+r],t,r),a===j&&(a=this._$AH[r]),s||=!O(a)||a!==this._$AH[r],a===X?e=X:e!==X&&(e+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(e)}j(e){e===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class oe extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===X?void 0:e}}class ne extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==X)}}class se extends ie{constructor(e,t,i,o,n){super(e,t,i,o,n),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??X)===j)return;const i=this._$AH,o=e===X&&i!==X||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==X&&(i===X||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const ae=k.litHtmlPolyfillSupport;ae?.(J,te),(k.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;class de extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let n=o._$litPart$;if(void 0===n){const e=i?.renderBefore??null;o._$litPart$=n=new te(t.insertBefore(T(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}de._$litElement$=!0,de.finalized=!0,le.litElementHydrateSupport?.({LitElement:de});const ce=le.litElementPolyfillSupport;ce?.({LitElement:de}),(le.litElementVersions??=[]).push("4.2.2");const he={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:b},pe=(e=he,t,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,n,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];t.call(this,i),this.requestUpdate(o,n,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ue(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function _e(e){return ue({...e,state:!0,attribute:!1})}function ge(e,t){return(t,i,o)=>((e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,i),i))(t,i,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}const me=e=>(t,i)=>{const o=()=>{customElements.get(e)?console.info(`spatial-context: <${e}> already defined — reload the page to pick up the updated panel.`):customElements.define(e,t)};void 0!==i?i.addInitializer(o):o()},ye="__property__";function ve(e){switch(e){case"strong":return"#2e7d32";case"medium":return"#f9a825";case"weak":return"#c62828";default:return"#607d8b"}}function fe(e){return e>=-70?"strong":e>=-85?"medium":"weak"}const be=["light","switch","climate","media_player","lock","cover","fan","vacuum","alarm_control_panel","valve","humidifier","siren","water_heater","camera","assist_satellite","device_tracker","binary_sensor","sensor"];function xe(e,t){if(!e)return null;const i=[...t].filter(t=>t.device_id===e);if(0===i.length)return null;const o=e=>"config"===e.entity_category?2:e.entity_category?1:0,n=e=>{const t=be.indexOf(e.domain);return-1===t?be.length:t};return i.sort((e,t)=>o(e)-o(t)||n(e)-n(t)),i[0]}function we(e,t){return xe(e,t)?.device_name??"Unknown device"}class ke{constructor(e=100,t=400){this._limit=e,this._coalesceMs=t,this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}get canUndo(){return this._past.length>0}get canRedo(){return this._future.length>0}record(e,t=Date.now()){t-this._lastRecordAt>this._coalesceMs&&(this._past.push(e),this._past.length>this._limit&&this._past.shift()),this._lastRecordAt=t,this._future=[]}undo(e){const t=this._past.pop();return void 0===t?null:(this._future.push(e),this._lastRecordAt=Number.NEGATIVE_INFINITY,t)}redo(e){const t=this._future.pop();return void 0===t?null:(this._past.push(e),this._lastRecordAt=Number.NEGATIVE_INFINITY,t)}discardIfLast(e){this._past[this._past.length-1]===e&&(this._past.pop(),this._lastRecordAt=Number.NEGATIVE_INFINITY)}clear(){this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}}const $e=new class{constructor(){this._client=null,this._enabled=!1,this._buffer=[],this._timer=null,this._errorHooked=!1}configure(e,t){this._client=e,this._enabled=t,t?this._hookErrors():this._buffer=[]}log(e,t={}){this._enabled&&(this._buffer.push({event:e,t:(new Date).toISOString(),...t}),this._buffer.length>200&&this._buffer.shift(),this._timer??(this._timer=window.setTimeout(()=>{this.flush()},2e3)))}async flush(){if(this._timer=null,!this._client||0===this._buffer.length)return;const e=this._buffer;this._buffer=[];try{await this._client.sendDebugLog(e)}catch{}}_hookErrors(){if(this._errorHooked)return;this._errorHooked=!0;const e=e=>!!e&&/spatial[-_]context/.test(e);window.addEventListener("error",t=>{const i=t.error?.stack;(e(i)||e(t.filename))&&this.log("js_error",{message:t.message,stack:i})}),window.addEventListener("unhandledrejection",t=>{const i=t.reason;e(i?.stack)&&this.log("js_rejection",{message:i?.message,stack:i?.stack})})}};function Pe(e,t,i){const o=e.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y||e.width<=0||e.height<=0)return null;const n=e.rotation_deg*Math.PI/180,s=Math.cos(n),r=Math.sin(n),a=t-e.x,l=i-e.y,d=-r*a+s*l;return{x:((s*a+r*l)/e.width+.5)*(o.max_x-o.min_x)+o.min_x,y:(d/e.height+.5)*(o.max_y-o.min_y)+o.min_y}}const Ie=[{id:"timber_frame",label:"Timber framed (drywall)",color:"#212121",attenuationDbPerCm:.3,defaultThicknessCm:10},{id:"brick_veneer",label:"Brick veneer",color:"#3e2723",attenuationDbPerCm:.55,defaultThicknessCm:11},{id:"concrete_block",label:"Concrete / block",color:"#000000",attenuationDbPerCm:.6,defaultThicknessCm:20},{id:"aerated_concrete_block",label:"Aerated/foam concrete block (plastered)",color:"#757575",attenuationDbPerCm:.37,defaultThicknessCm:13},{id:"ceramic_poroton_block",label:"Ceramic / Poroton block",color:"#8d6e63",attenuationDbPerCm:.42,defaultThicknessCm:25},{id:"glass",label:"Glass",color:"#37474f",attenuationDbPerCm:2,defaultThicknessCm:1},{id:"steel_frame",label:"Steel frame",color:"#263238",attenuationDbPerCm:1,defaultThicknessCm:10}];function Me(e){return Ie.find(t=>t.id===e)??Ie[0]}function Se(e){return e.thickness_cm??Me(e.material).defaultThicknessCm}class Ce{constructor(e){this.hass=e}async listFloors(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_floors"})).floors}async getLayout(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_layout",floor_id:e})}async saveLayout(e,t){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_layout",floor_id:e,background_image_id:t.background_image_id,background_opacity:t.background_opacity,background_offset_x:t.background_offset_x,background_offset_y:t.background_offset_y,background_scale:t.background_scale,building_id:t.building_id,view_box:t.view_box,rooms:t.rooms,pins:t.pins,walls:t.walls,openings:t.openings,scale:t.scale})}async setBuildingId(e,t){return this.hass.connection.sendMessagePromise({type:"spatial_context/set_building_id",floor_id:e,building_id:t})}async getPropertyLayout(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_property_layout"})}async savePropertyLayout(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_property_layout",background_image_id:e.background_image_id,background_opacity:e.background_opacity,background_offset_x:e.background_offset_x,background_offset_y:e.background_offset_y,background_scale:e.background_scale,view_box:e.view_box,placements:e.placements,pins:e.pins,...void 0!==e.map_background?{map_background:e.map_background}:{}})}async getSettings(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_settings"})}async saveSettings(e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_settings",unit_system:e.unit_system,zigbee_timeout_seconds:e.zigbee_timeout_seconds,floor_order:e.floor_order,zigbee_coordinator_device_id:e.zigbee_coordinator_device_id,auto_save:e.auto_save,debug_logging:e.debug_logging})}async getVersionInfo(){return this.hass.connection.sendMessagePromise({type:"spatial_context/version"})}async sendDebugLog(e){await this.hass.connection.sendMessagePromise({type:"spatial_context/debug_log",entries:e})}async getDebugReport(){return this.hass.connection.sendMessagePromise({type:"spatial_context/debug_report"})}async listAreas(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_areas"})).areas}async listPlaceableEntities(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_placeable_entities"})).entities}async exportSnapshot(){return this.hass.connection.sendMessagePromise({type:"spatial_context/export_snapshot"})}async getZigbeeMesh(e=!1){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",force_refresh:e})}async getCachedZigbeeMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",cache_only:!0})}async getWifiMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_wifi_mesh"})}async subscribeMatterTopology(e){return this.hass.connection.subscribeMessage(e,{type:"matter/subscribe_network_topology"})}async subscribeBluetoothAdvertisements(e){return this.hass.connection.subscribeMessage(e,{type:"bluetooth/subscribe_advertisements"})}async getBluetoothDevices(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_bluetooth_devices"})}async uploadBackgroundImage(e){const t=new FormData;t.append("file",e);const i=await this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:t});if(!i.ok)throw new Error(`Image upload failed: ${i.status} ${i.statusText}`);return(await i.json()).id}}function Ee(e){return e?`/api/image/serve/${e}/original`:null}function Le(e){return`${e}-${function(){if("undefined"!=typeof crypto&&crypto.randomUUID)return crypto.randomUUID();if("undefined"!=typeof crypto&&crypto.getRandomValues){const e=crypto.getRandomValues(new Uint8Array(16));e[6]=15&e[6]|64,e[8]=63&e[8]|128;const t=Array.from(e,e=>e.toString(16).padStart(2,"0")).join("");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})}()}`}function Te(e,t,i,o){return{id:Le("pin"),device_id:e,x:t,y:i,room_id:o,icon_override:null,label_override:null,height_m:null}}function Oe(e,t="timber_frame"){return{id:Le("wall"),material:t,thickness_cm:Me(t).defaultThicknessCm,points:e}}const Re=220;class Be{constructor(e=[],t=(e,t)=>e<t?-1:e>t?1:0){if(this.data=e,this.length=this.data.length,this.compare=t,this.length>0)for(let e=(this.length>>1)-1;e>=0;e--)this._down(e)}push(e){this.data.push(e),this._up(this.length++)}pop(){if(0===this.length)return;const e=this.data[0],t=this.data.pop();return--this.length>0&&(this.data[0]=t,this._down(0)),e}peek(){return this.data[0]}_up(e){const{data:t,compare:i}=this,o=t[e];for(;e>0;){const n=e-1>>1,s=t[n];if(i(o,s)>=0)break;t[e]=s,e=n}t[e]=o}_down(e){const{data:t,compare:i}=this,o=this.length>>1,n=t[e];for(;e<o;){let o=1+(e<<1);const s=o+1;if(s<this.length&&i(t[s],t[o])<0&&(o=s),i(t[o],n)>=0)break;t[e]=t[o],e=o}t[e]=n}}function Ae(e,t=1,i=!1){let o=1/0,n=1/0,s=-1/0,r=-1/0;for(const[t,i]of e[0])t<o&&(o=t),i<n&&(n=i),t>s&&(s=t),i>r&&(r=i);const a=s-o,l=r-n,d=Math.max(t,Math.min(a,l));if(d===t){const e=[o,n];return e.distance=0,e}let c=0;for(const t of e)c+=t.length;const h=new Float64Array(2*c),p=[];let u=0;for(const t of e){for(let e=0;e<t.length;e++)h[u++]=t[e][0],h[u++]=t[e][1];p.push(u)}const _=function(e,t){const i=64;let o=0,n=0;for(let e=0;e<t.length;e++)o+=Math.ceil((t[e]-n)/i),n=t[e];const s=new Float64Array(4*o);let r=0;n=0;for(let o=0;o<t.length;o++){const a=t[o];for(let t=n;t<a;t+=i,r+=4){const o=t+i<a?t+i:a,l=t===n?a-2:t-2;let d=e[l],c=e[l+1],h=d,p=c;for(let i=t;i<o;i+=2){const t=e[i],o=e[i+1];t<d?d=t:t>h&&(h=t),o<c?c=o:o>p&&(p=o)}s[r]=d,s[r+1]=c,s[r+2]=h,s[r+3]=p}n=a}return s}(h,p),g=new Be([],(e,t)=>t.max-e.max);let m=function(e,t,i){let o=0,n=0,s=0;const r=t[0];for(let t=0,i=r-2;t<r;i=t,t+=2){const r=e[t],a=e[t+1],l=e[i],d=e[i+1],c=r*d-l*a;n+=(r+l)*c,s+=(a+d)*c,o+=3*c}const a=new Fe(n/o,s/o,0,e,t,i,-1/0,null);return 0===o||a.d<0?new Fe(e[0],e[1],0,e,t,i,-1/0,null):a}(h,p,_);const y=new Fe(o+a/2,n+l/2,0,h,p,_,-1/0,null);y.d>m.d&&(m=y);let v=2;function f(e,o,n,s){const r=m.d-Math.max(0,n*Math.SQRT2-t),a=new Fe(e,o,n,h,p,_,r,s);v++,a.max>m.d+t&&g.push(a),a.d>m.d&&(m=a,i&&console.log(`found best ${Math.round(1e4*a.d)/1e4} after ${v} probes`))}let b=d/2;for(let e=o;e<s;e+=d)for(let t=n;t<r;t+=d)f(e+b,t+b,b,null);for(;g.length;){const e=g.pop();if(e.max-m.d<=t)break;b=e.h/2,f(e.x-b,e.y-b,b,e),f(e.x+b,e.y-b,b,e),f(e.x-b,e.y+b,b,e),f(e.x+b,e.y+b,b,e)}i&&console.log(`num probes: ${v}\nbest distance: ${m.d}`);const x=[m.x,m.y];return x.distance=m.d,x}function Fe(e,t,i,o,n,s,r,a){this.x=e,this.y=t,this.h=i,this.nsx1=0,this.nsy1=0,this.nsx2=0,this.nsy2=0,this.d=function(e,t,i,o,n,s){const r=e.x,a=e.y;let l=!1,d=1/0;const c=n>0?n*n:-1;if(null!==s&&(e.nsx1=s.nsx1,e.nsy1=s.nsy1,e.nsx2=s.nsx2,e.nsy2=s.nsy2,d=De(r,a,s.nsx1,s.nsy1,s.nsx2,s.nsy2),d<=c))return n;const h=64,p=i.length;let u=0,_=0;for(let s=0;s<p;s++){const p=i[s];let g=t[p-2],m=t[p-1];for(let i=_;i<p;i+=h,u+=4){let s=i+h;s>p&&(s=p);const _=o[u],y=o[u+1],v=o[u+2],f=o[u+3],b=r<_?_-r:r>v?r-v:0,x=a<y?y-a:a>f?a-f:0,w=b*b+x*x>=d,k=a<y||a>=f||r>v;if(w&&k)g=t[s-2],m=t[s-1];else for(let o=i;o<s;o+=2){const i=t[o],s=t[o+1];if(!k&&s>a!=m>a&&r<(g-i)*(a-s)/(m-s)+i&&(l=!l),!w){const t=De(r,a,i,s,g,m);if(t<d&&(d=t,e.nsx1=i,e.nsy1=s,e.nsx2=g,e.nsy2=m,d<=c))return n}g=i,m=s}}_=p}return 0===d?0:(l?1:-1)*Math.sqrt(d)}(this,o,n,s,r,a),this.max=this.d+i*Math.SQRT2}function De(e,t,i,o,n,s){let r=n-i,a=s-o;if(0!==r||0!==a){const l=((e-i)*r+(t-o)*a)/(r*r+a*a);l>1?(i=n,o=s):l>0&&(i+=r*l,o+=a*l)}return r=e-i,a=t-o,r*r+a*a}function ze(e,t,i,o){return Math.hypot(i-e,o-t)}function He(e,t,i){return Math.min(i,Math.max(t,e))}function We(e,t,i){let o=!1;for(let n=0,s=i.length-1;n<i.length;s=n++){const r=i[n],a=i[s],[l,d]=r,[c,h]=a;d>t!=h>t&&e<(c-l)*(t-d)/(h-d)+l&&(o=!o)}return o}function Ue(e,t,i){for(const o of i)if(o.points.length>=3&&We(e,t,o.points))return o.id;return null}function Ne(e,t){let i=!1;const o=t.map(t=>{const o=Ue(t.x,t.y,e);return o===t.room_id?t:(i=!0,{...t,room_id:o})});return i?o:t}const Ve=new WeakMap;function Ye(e,t,i,o,n,s){const r=n-i,a=s-o,l=r*r+a*a;if(0===l)return ze(e,t,i,o);let d=((e-i)*r+(t-o)*a)/l;return d=He(d,0,1),ze(e,t,i+d*r,o+d*a)}function je(e,t,i){let o=1/0;for(let n=0;n<i.length-1;n++){const[s,r]=i[n],[a,l]=i[n+1];o=Math.min(o,Ye(e,t,s,r,a,l))}return o}function Xe(e){const t=[];for(let i=0;i<e.length;i++){const o=e[i],n=e[(i+1)%e.length];t.push([(o[0]+n[0])/2,(o[1]+n[1])/2])}return t}function Ke(e){const t=[];for(let i=0;i<e.length-1;i++){const o=e[i],n=e[i+1];t.push([(o[0]+n[0])/2,(o[1]+n[1])/2])}return t}function qe(e,t,i){let o={point:e[0],segmentIndex:0,dist:1/0};for(let n=0;n<e.length-1;n++){const[s,r]=e[n],[a,l]=e[n+1],d=a-s,c=l-r,h=d*d+c*c;let p=0===h?0:((t-s)*d+(i-r)*c)/h;p=He(p,0,1);const u=[s+p*d,r+p*c],_=ze(t,i,u[0],u[1]);_<o.dist&&(o={point:u,segmentIndex:n,dist:_})}return{point:o.point,segmentIndex:o.segmentIndex}}function Ge(e,t,i){return 0===e.length?{point:[t,i],segmentIndex:0}:qe([...e,e[0]],t,i)}function Ze(e,t,i){const[o,n]=e,[s,r]=t,a=Math.abs(s-o),l=Math.abs(r-n);return a>i&&l>i?t:a<=l?[o,r]:[s,n]}function Je(e,t,i,o){if(o.length<2)return null;const{segmentIndex:n}=qe(o,e,t),[s,r]=function(e,t){const[i,o]=e[t],[n,s]=e[t+1]??e[t],r=ze(i,o,n,s)||1;return[(n-i)/r,(s-o)/r]}(o,n),a=i/2;return[[e-s*a,t-r*a],[e+s*a,t+r*a]]}function Qe(e){const t=e.getRootNode();let i=document.activeElement;for(;i?.shadowRoot?.activeElement;)i=i.shadowRoot.activeElement;if(!(i instanceof HTMLElement))return;let o=i.getRootNode();for(;o&&o!==t;)o=o instanceof ShadowRoot?o.host.getRootNode():null;o===t&&i.blur()}const et=.3048;function tt(e){return Math.round(100*e)/100}function it(e){return"imperial"===e?"ft":"m"}function ot(e,t){return String(tt("imperial"===t?e/et:e))}function nt(e,t){const i=Number(e);return Number.isFinite(i)?"imperial"===t?i*et:i:null}const st={cm:1,m:100,in:2.54,ft:30.48};function rt(e){return"imperial"===e?"in":"cm"}function at(e,t){return String(tt(e/st[t]))}function lt(e,t){const i=Number(e);return Number.isFinite(i)?i*st[t]:null}function dt(e,t){return"imperial"===t?e*et:e}function ct(e,t,i){return at(e/t*100,i)}const ht=r`
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
`,pt=r`
  .controls {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    flex-direction: column;
    background: var(--sc-panel-bg);
    border: 1px solid var(--sc-divider);
    box-shadow: var(--sc-panel-shadow);
    border-radius: 12px;
    overflow: hidden;
  }
  .controls button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 0;
    color: var(--sc-fg);
  }
  .controls button + button {
    border-top: 1px solid var(--sc-divider);
  }
  .controls button:hover {
    background: color-mix(in srgb, var(--sc-fg) 8%, transparent);
  }
  .controls ha-icon {
    --mdc-icon-size: 22px;
  }
`,ut=r`
  .select-wrap {
    position: relative;
    display: inline-flex;
    min-width: 0;
  }
  .select-wrap select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding-right: 30px;
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
`,_t=r`
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
`,gt=r`
  .tool-row {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px;
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
  .tool-row .mode-toolbar {
    position: static;
    display: flex;
    gap: 2px;
    align-items: center;
  }
  .tool-row .hint-bar {
    position: static;
    transform: none;
    background: none;
    border: none;
    box-shadow: none;
    padding: 0;
    flex: 1 0 auto;
  }
  .tool-row .scale-badge {
    position: static;
    margin-left: auto;
    background: transparent;
    box-shadow: none;
    white-space: nowrap;
  }
`;function mt(e,t,i,o){return e.map(e=>({pin:e,d:ze(e.x,e.y,t,i)})).filter(({d:e})=>e<=o).sort((e,t)=>e.d-t.d).map(({pin:e})=>e)}function yt(e,t,i,o){let n=null,s=o;return e.forEach(([e,o],r)=>{const a=ze(e,o,t,i);a<=s&&(n=r,s=a)}),n}function vt(e,t,i,o){let n=null,s=o;for(const o of e){const e=je(t,i,o.points);e<=s&&(n=o,s=e)}return n}function ft(e,t,i,o){if(e.points.length>=3){const[n,s]=e.points[0];if(ze(n,s,t,i)<=o)return{trace:e,closed:!0}}return{trace:{points:[...e.points,[t,i]]},closed:!1}}const bt=new Map;function xt(e){const t=e.trim();if(!t)return Promise.resolve(null);const i=t.includes(":")?t:`mdi:${t}`;let o=bt.get(i);return o||(o=async function(e){if(!customElements.get("ha-icon"))return null;const t=document.createElement("div");t.style.cssText="position:fixed;left:-10000px;top:0;width:24px;height:24px;overflow:hidden;";const i=document.createElement("ha-icon");i.setAttribute("icon",e),t.appendChild(i),document.body.appendChild(t);try{const e=Date.now()+4e3;for(;Date.now()<e;){const e=i.shadowRoot?.querySelector("ha-svg-icon");if("string"==typeof e?.path&&e.path)return e.path;await new Promise(e=>setTimeout(e,50))}return null}finally{t.remove()}}(i),bt.set(i,o)),o}const wt=r`
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
`;class kt{constructor(e){this._host=e,this._resolvedOverrides=new Map,this._failedBrandIcons=new Set}_iconForOverride(e){return this._resolvedOverrides.has(e)?this._resolvedOverrides.get(e)??null:(this._resolvedOverrides.set(e,null),xt(e).then(t=>{null!==t&&(this._resolvedOverrides.set(e,t),this._host.requestUpdate())}),null)}iconForPin(e,t){if(e.icon_override){const t=this._iconForOverride(e.icon_override);if(t)return{kind:"path",d:t}}const i=function(e,t){return xe(e,t)?.integration_domain??null}(e.device_id,t);return i&&!this._failedBrandIcons.has(i)?{kind:"image",href:`https://brands.home-assistant.io/_/${i}/icon.png`,integrationDomain:i}:{kind:"path",d:"M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z"}}onBrandIconError(e){this._failedBrandIcons.has(e)||(this._failedBrandIcons.add(e),this._host.requestUpdate())}renderMarker(e,t,i,o,n,s,r){const a=1.1*i;return Y`
      <g>
        <title>${r}</title>
        <circle
          class="pin-dot ${s?"selected":""}"
          cx=${e}
          cy=${t}
          r=${i}
          style="fill:${s?"":n}"
        ></circle>
        ${"path"===o.kind?Y`
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
            `:Y`
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
    `}}const $t=1e3,Pt=750,It=14,Mt="#03a9f4";let St=class extends de{constructor(){super(...arguments),this.dark=!1,this.rooms=[],this.pins=[],this.walls=[],this.openings=[],this.scale=null,this.unitSystem="metric",this.meshLinks=[],this.meshStubs=[],this.entityLookup=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.5,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.alignOverlay=null,this.initialViewBox=null,this.sameBuildingAsPrevious=!1,this.mode="select",this.snapMode="all",this.armedEntityId=null,this.armedOpeningType=null,this.selectedRoomId=null,this.editingRoomId=null,this.editingWallId=null,this.selectedPinId=null,this.selectedWallId=null,this.selectedOpeningId=null,this.selectedMeshLinkKey=null,this.selectedMeshStubKey=null,this._viewBox={x:0,y:0,w:$t,h:Pt},this._naturalHeight=Pt,this._alignNaturalHeight=Pt,this._pendingTrace=null,this._hoverSnap=null,this._pendingScalePoints=[],this._liveEditPoints=null,this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._gestureCancelled=!1,this._vertexDragStartPoints=null,this._liveDragPin=null,this._liveOpeningEdit=null,this._selectedVertexIndex=null,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastImage=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._hasFittedOnce=!1,this._onPointerDown=e=>{if("mouse"===e.pointerType&&0!==e.button)return;if(Qe(this),this._svg.setPointerCapture(e.pointerId),this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o={x:(t.x+i.x)/2,y:(t.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:ze(t.x,t.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}if(this._pointers.size>2)return;const t=this._clientToImage(e.clientX,e.clientY);this._downClient={x:e.clientX,y:e.clientY},this._lastImage=t,this._lastClient={x:e.clientX,y:e.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(e.clientX,e.clientY,t):{type:"empty"}},this._onPointerMove=e=>{if(!this._pointers.has(e.pointerId)){if("wall"===this.mode||"trace"===this.mode){const t=this._clientToImage(e.clientX,e.clientY);this._hoverSnap=this._snappedGeometryPoint(this._pendingTrace?.points??[],t.x,t.y,e.shiftKey)}else this._hoverSnap&&(this._hoverSnap=null);return}if(this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o=ze(t.x,t.y,i.x,i.y)||1,n=this._gesture.startDistance/o,s=this._gesture.startViewBox,r=He(s.w*n,250,4e3),a=r/s.w,l=s.h*a,{x:d,y:c}=this._gesture.midImage;return void(this._viewBox={x:d-(d-s.x)*a,y:c-(c-s.y)*a,w:r,h:l})}if(1!==this._pointers.size||!this._downClient||!this._lastImage)return;if(this._gestureCancelled)return;if(!this._moved){if(ze(this._downClient.x,this._downClient.y,e.clientX,e.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"!==this._gesture?.kind&&"alignDrag"!==this._gesture?.kind||(this._svg.style.cursor="grabbing")}const t=this._clientToImage(e.clientX,e.clientY);if("pan"===this._gesture?.kind){const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};this._viewBox={...this._viewBox,x:this._viewBox.x-(e.clientX-i.x)/t,y:this._viewBox.y-(e.clientY-i.y)/t}}else if("alignDrag"===this._gesture?.kind){const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};this.dispatchEvent(new CustomEvent("align-drag",{detail:{dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t}}))}else if("vertex"===this._gesture?.kind&&this._liveEditPoints){const i="room"===this._editingTarget?.kind,[o,n]=this._snappedVertexPoint(this._liveEditPoints,this._gesture.index,t.x,t.y,i,e.shiftKey),s=[...this._liveEditPoints];s[this._gesture.index]=[o,n],this._liveEditPoints=s}else if("pin"===this._gesture?.kind)this._liveDragPin={id:this._gesture.pinId,x:t.x,y:t.y};else if("roomMove"===this._gesture?.kind){let i=t.x-this._gesture.startX,o=t.y-this._gesture.startY;const n=this._pxToUnits(10);let s={x:null,y:null};if(Math.hypot(i,o)<=n)i=0,o=0;else if(!e.shiftKey){const e=this._snapRoomMove(this._gesture.roomId,i,o,n);i=e.dx,o=e.dy,s=e.guides}this._liveRoomMove={id:this._gesture.roomId,dx:i,dy:o},this._roomMoveGuides=s}else if("roomLabel"===this._gesture?.kind)this._liveRoomLabel={id:this._gesture.roomId,x:t.x,y:t.y};else if("openingMove"===this._gesture?.kind){const e=this._gesture,i=this.openings.find(t=>t.id===e.openingId),o=i&&this.walls.find(e=>e.id===i.wallId);if(i&&o){const e=this._effectivePoints("wall",o.id,o.points),{point:n}=qe(e,t.x,t.y);this._liveOpeningEdit={id:i.id,x:n[0],y:n[1],width:i.width}}}else if("openingHandle"===this._gesture?.kind){const e=this._gesture,i=this.openings.find(t=>t.id===e.openingId),o=i&&this.walls.find(e=>e.id===i.wallId),n=i&&this._openingEndpoints(i);if(i&&o&&n){const s=this._effectivePoints("wall",o.id,o.points),{point:r}=qe(s,t.x,t.y),a=n[0===e.whichEnd?1:0],l=[(a[0]+r[0])/2,(a[1]+r[1])/2],d=ze(a[0],a[1],r[0],r[1]);this._liveOpeningEdit={id:i.id,x:l[0],y:l[1],width:d}}}this._lastImage=this._clientToImage(e.clientX,e.clientY),this._lastClient={x:e.clientX,y:e.clientY}},this._onPointerLeave=()=>{this._hoverSnap=null},this._onPointerUp=e=>{this._pointers.delete(e.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(e.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._gestureCancelled||(this._moved?this._commitGesture():this._downClient&&this._handleClick(this._downClient.x,this._downClient.y,e.shiftKey)),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1,this._vertexDragStartPoints=null)},this._onWheel=e=>{if(e.preventDefault(),e.ctrlKey){const t=e.deltaY<0?.9:1.1;return void this._zoomBy(t,this._clientToImage(e.clientX,e.clientY))}const t=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+e.deltaX*t,y:this._viewBox.y+e.deltaY*t}},this._liveRoomLabel=null,this._pinIcons=new kt(this)}get _editingTarget(){return this.editingRoomId?{kind:"room",id:this.editingRoomId}:this.editingWallId?{kind:"wall",id:this.editingWallId}:null}_rawPointsFor(e){return"room"===e.kind?this.rooms.find(t=>t.id===e.id)?.points??null:this.walls.find(t=>t.id===e.id)?.points??null}willUpdate(e){if(e.has("editingRoomId")||e.has("editingWallId")){const e=this._editingTarget,t=e?this._rawPointsFor(e):null;this._liveEditPoints=t?[...t]:null,this._selectedVertexIndex=null}e.has("mode")&&(this._pendingTrace=null,this._pendingScalePoints=[])}firstUpdated(){this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl,this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(e){if(e.has("backgroundImageUrl")&&this.backgroundImageUrl){const e=new Image;e.onload=()=>{this._naturalHeight=e.naturalHeight/e.naturalWidth*$t||Pt,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},e.src=this.backgroundImageUrl}if(e.has("initialViewBox")){const e=this.initialViewBox,t=this._viewBox;e&&e.x===t.x&&e.y===t.y&&e.w===t.w&&e.h===t.h?this._hasFittedOnce=!0:e?(this._viewBox={...e},this._hasFittedOnce=!0):this.sameBuildingAsPrevious||(this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl)}if(e.has("alignOverlay")){const t=e.get("alignOverlay");if(this.alignOverlay&&this.alignOverlay.imageUrl!==t?.imageUrl){const e=new Image;e.onload=()=>{this._alignNaturalHeight=e.naturalHeight/e.naturalWidth*$t||Pt},e.src=this.alignOverlay.imageUrl}}if(e.has("_pendingTrace")||e.has("_pendingScalePoints")){const e="scale"===this.mode?this._pendingScalePoints.length:this._pendingTrace?.points.length??0;this.dispatchEvent(new CustomEvent("pending-changed",{detail:{count:e}}))}}_contentBounds(){const e=[];for(const t of this.rooms)e.push(...t.points);for(const t of this.walls)e.push(...t.points);for(const t of this.pins)e.push([t.x,t.y]);if(0===e.length)return null;const t=e.map(([e])=>e),i=e.map(([,e])=>e),o=Math.min(...t),n=Math.max(...t),s=Math.min(...i),r=Math.max(...i),a=.08*Math.max(n-o,r-s)||40;return{x:o-a,y:s-a,w:n-o+2*a,h:r-s+2*a}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:$t,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const e=this._svg?.getBoundingClientRect(),t=e?.width||this._viewBox.w,i=e?.height||this._viewBox.h,o=Math.min(t/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(t-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(e){return e/this._svgTransform().scale}_clientToImage(e,t){const i=this._svg,o=i.createSVGPoint();o.x=e,o.y=t;const n=i.getScreenCTM();if(!n)return{x:0,y:0};const s=o.matrixTransform(n.inverse());return{x:s.x,y:s.y}}_effectivePoints(e,t,i){const o=this._editingTarget;if(o&&o.kind===e&&o.id===t&&this._liveEditPoints)return this._liveEditPoints;const n=this._liveRoomMove;return"room"===e&&n?.id===t?i.map(([e,t])=>[e+n.dx,t+n.dy]):i}get _displayPins(){const e=this._liveRoomMove;return e?this.pins.map(t=>t.room_id===e.id?{...t,x:t.x+e.dx,y:t.y+e.dy}:t):this.pins}_snappedTracePoint(e,t,i,o){if(o||0===e.length)return{point:[t,i],lockedX:!1,lockedY:!1};const n=this._pxToUnits(10),s=e[e.length-1],r=e[0],a=e.length>=3&&(r[0]!==s[0]||r[1]!==s[1])?[s,r]:[s];let l=null,d=1/0,c=null,h=1/0;for(const[e,o]of a){const s=Math.abs(t-e),r=Math.abs(i-o);s>n&&r>n||(s<=r?s<d&&(l=e,d=s):r<h&&(c=o,h=r))}return{point:[l??t,c??i],lockedX:null!==l,lockedY:null!==c}}_snappedVertexPoint(e,t,i,o,n,s){if(s||"off"===this.snapMode)return[i,o];const r=this._pxToUnits(10),a=t>0?t-1:n?e.length-1:-1;if(a>=0&&a!==t)return Ze(e[a],[i,o],r);const l=t<e.length-1?t+1:n?0:-1;return l>=0&&l!==t?Ze(e[l],[i,o],r):[i,o]}_effectiveOpening(e){return this._liveOpeningEdit?.id===e.id?{...e,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}:e}_openingEndpoints(e){const t=this.walls.find(t=>t.id===e.wallId);if(!t)return null;const i=this._effectivePoints("wall",t.id,t.points),o=this._effectiveOpening(e);return Je(o.x,o.y,o.width,i)}_snappedGeometryPoint(e,t,i,o){const n=o||"off"===this.snapMode;if(!n){const e=this._pxToUnits(It),o="all"===this.snapMode||"wall"===this.mode,n="all"===this.snapMode||"trace"===this.mode;let s=null;for(const n of o?this.walls:[]){const o=parseFloat(this._wallStrokeWidth(n,Me(n.material)))/2,r=Math.max(e,o);if(je(t,i,n.points)>r)continue;const a=qe(n.points,t,i).point,l=ze(t,i,a[0],a[1]);(!s||l<s.dist)&&(s={point:a,dist:l})}const r=n?function(e,t,i,o){let n=null,s=o;for(const o of e){if(o.points.length<2)continue;const{point:e}=Ge(o.points,t,i),r=ze(t,i,e[0],e[1]);r<=s&&(n=o,s=r)}return n}(this.rooms,t,i,e):null;if(r){const e=Ge(r.points,t,i).point,o=ze(t,i,e[0],e[1]);(!s||o<s.dist)&&(s={point:e,dist:o})}if(s)return{point:s.point,kind:"geometry",lockedX:!1,lockedY:!1}}const{point:s,lockedX:r,lockedY:a}=this._snappedTracePoint(e,t,i,n);return{point:s,kind:r||a?"axis":"none",lockedX:r,lockedY:a}}_hitTest(e,t,i){const o=this._pxToUnits(It);if("select"!==this.mode)return{type:"empty"};const n=this._editingTarget;if(n&&this._liveEditPoints){const e=this._liveEditPoints,t=yt(e,i.x,i.y,o);if(null!==t)return{type:"vertex",index:t};const s=yt("room"===n.kind?Xe(e):Ke(e),i.x,i.y,o);if(null!==s)return{type:"edgeMidpoint",index:s};const r="room"===n.kind?this.rooms.find(e=>e.id===n.id):void 0;return r&&this._roomLabelHit(r,i,o)?{type:"roomLabel",room:r}:{type:"empty"}}const s=this.rooms.find(e=>e.id===this.selectedRoomId);if(s&&this._roomLabelHit(s,i,o))return{type:"roomLabel",room:s};const r=mt(this.pins,i.x,i.y,o);if(r.length>1)return{type:"pinStack",pins:r};if(1===r.length)return{type:"pin",pin:r[0]};const a=function(e,t,i,o){let n=null,s=o;for(const o of e){const e=je(t,i,[[o.fromPin.x,o.fromPin.y],[o.toPin.x,o.toPin.y]]);e<=s&&(n=o,s=e)}return n}(this.meshLinks,i.x,i.y,o);if(a)return{type:"meshLink",link:a};const l=function(e,t,i,o){let n=null,s=o;for(const o of e){const e=Math.min(ze(o.x,o.y,t,i),je(t,i,[[o.fromPin.x,o.fromPin.y],[o.x,o.y]]));e<=s&&(n=o,s=e)}return n}(this.meshStubs,i.x,i.y,o);if(l)return{type:"meshStub",stub:l};if(this.selectedOpeningId){const e=this.openings.find(e=>e.id===this.selectedOpeningId),t=e?this._openingEndpoints(e):null;if(e&&t){const n=yt(t,i.x,i.y,o);if(null!==n)return{type:"openingHandle",opening:e,whichEnd:n}}}const d=function(e,t,i,o,n){let s=null,r=n;for(const n of e){const e=t.find(e=>e.id===n.wallId);if(!e)continue;const a=Je(n.x,n.y,n.width,e.points);if(!a)continue;const l=je(i,o,a);l<=r&&(s=n,r=l)}return s}(this.openings,this.walls,i.x,i.y,o);if(d)return{type:"opening",opening:d};const c=vt(this.walls,i.x,i.y,o);if(c)return{type:"wall",wall:c};const h=this.rooms.find(e=>e.points.length>=3&&We(i.x,i.y,e.points));return h?{type:"room",room:h}:{type:"empty"}}_lockGesture(){return"align"===this.mode?{kind:"alignDrag"}:"vertex"===this._downHit?.type?(this._vertexDragStartPoints=this._liveEditPoints?[...this._liveEditPoints]:null,{kind:"vertex",index:this._downHit.index}):"pin"===this._downHit?.type?{kind:"pin",pinId:this._downHit.pin.id}:"roomLabel"===this._downHit?.type?{kind:"roomLabel",roomId:this._downHit.room.id}:"room"===this._downHit?.type&&this._downHit.room.id===this.selectedRoomId&&this._lastImage?{kind:"roomMove",roomId:this._downHit.room.id,startX:this._lastImage.x,startY:this._lastImage.y}:"openingHandle"===this._downHit?.type?{kind:"openingHandle",openingId:this._downHit.opening.id,whichEnd:this._downHit.whichEnd}:"opening"===this._downHit?.type?{kind:"openingMove",openingId:this._downHit.opening.id}:{kind:"pan"}}_dispatchVertexChanged(e){const t=this._editingTarget;if(!t)return;const i="room"===t.kind?"room-vertex-changed":"wall-vertex-changed",o="room"===t.kind?"roomId":"wallId";this.dispatchEvent(new CustomEvent(i,{detail:{[o]:t.id,points:e}}))}_commitGesture(){if("vertex"===this._gesture?.kind&&this._editingTarget&&this._liveEditPoints)this._dispatchVertexChanged(this._liveEditPoints);else if("pin"===this._gesture?.kind&&this._liveDragPin)this.dispatchEvent(new CustomEvent("pin-move",{detail:{pinId:this._liveDragPin.id,x:this._liveDragPin.x,y:this._liveDragPin.y}})),this._liveDragPin=null;else if("roomMove"===this._gesture?.kind&&this._liveRoomMove){const{dx:e,dy:t}=this._liveRoomMove;if(this._roomMoveGuides={x:null,y:null},0===e&&0===t)return void(this._liveRoomMove=null);this.dispatchEvent(new CustomEvent("room-move",{detail:{roomId:this._liveRoomMove.id,dx:this._liveRoomMove.dx,dy:this._liveRoomMove.dy}})),this._liveRoomMove=null}else"roomLabel"===this._gesture?.kind&&this._liveRoomLabel?(this.dispatchEvent(new CustomEvent("room-label-moved",{detail:{roomId:this._liveRoomLabel.id,x:this._liveRoomLabel.x,y:this._liveRoomLabel.y}})),this._liveRoomLabel=null):"openingMove"!==this._gesture?.kind&&"openingHandle"!==this._gesture?.kind||!this._liveOpeningEdit||(this.dispatchEvent(new CustomEvent("opening-update",{detail:{openingId:this._liveOpeningEdit.id,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}})),this._liveOpeningEdit=null)}_handleClick(e,t,i=!1){const o=this._clientToImage(e,t);if("trace"===this.mode){const e=this._pxToUnits(It),t=this._pendingTrace??{points:[]},{point:[n,s]}=this._snappedGeometryPoint(t.points,o.x,o.y,i),r=ft(t,n,s,e);return void(r.closed?(this.dispatchEvent(new CustomEvent("room-trace-complete",{detail:{points:t.points}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("wall"===this.mode){const e=this._pxToUnits(It),t=this._pendingTrace??{points:[]},{point:[n,s]}=this._snappedGeometryPoint(t.points,o.x,o.y,i),r=ft(t,n,s,e);return void(r.closed?(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:[...t.points,t.points[0]]}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("opening"===this.mode){if(!this.armedOpeningType)return;const e=this._pxToUnits(It),t=vt(this.walls,o.x,o.y,e);if(!t)return;const{point:i}=qe(t.points,o.x,o.y);return void this.dispatchEvent(new CustomEvent("opening-place",{detail:{wallId:t.id,x:i[0],y:i[1]}}))}if("scale"===this.mode){const e=[...this._pendingScalePoints,[o.x,o.y]];return void(e.length>=2?(this.dispatchEvent(new CustomEvent("scale-line-complete",{detail:{points:e.slice(0,2)}})),this._pendingScalePoints=[]):this._pendingScalePoints=e)}if("place"===this.mode){if(this.armedEntityId){const e=this._pxToUnits(It),t=mt(this.pins,o.x,o.y,e)[0],i=t?.x??o.x,n=t?.y??o.y;this.dispatchEvent(new CustomEvent("pin-place",{detail:{x:i,y:n}}))}return}const n=this._downHit??{type:"empty"};if("vertex"===n.type)this._selectedVertexIndex=this._selectedVertexIndex===n.index?null:n.index;else if("edgeMidpoint"===n.type&&this._editingTarget&&this._liveEditPoints){const e=("room"===this._editingTarget.kind?Xe(this._liveEditPoints):Ke(this._liveEditPoints))[n.index],t=[...this._liveEditPoints];t.splice(n.index+1,0,e),this._liveEditPoints=t,this._dispatchVertexChanged(t)}else if("pin"===n.type)this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:this.selectedPinId===n.pin.id?null:n.pin.id}}));else if("pinStack"===n.type)this.dispatchEvent(new CustomEvent("pin-stack-select",{detail:{pinIds:n.pins.map(e=>e.id)}}));else if("roomLabel"===n.type&&this._editingTarget);else if("room"===n.type||"roomLabel"===n.type)this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:this.selectedRoomId===n.room.id?null:n.room.id}}));else if("wall"===n.type)this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:this.selectedWallId===n.wall.id?null:n.wall.id}}));else if("opening"===n.type)this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:this.selectedOpeningId===n.opening.id?null:n.opening.id}}));else if("meshLink"===n.type){const e=`${n.link.fromPin.id}|${n.link.toPin.id}`;this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:this.selectedMeshLinkKey===e?null:n.link}}))}else if("meshStub"===n.type){const e=`${n.stub.fromPin.id}|${n.stub.targetDeviceId}`;this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:this.selectedMeshStubKey===e?null:n.stub}}))}else if(this._editingTarget&&null!==this._selectedVertexIndex&&this._liveEditPoints){const e="room"===this._editingTarget.kind,[t,n]=this._snappedVertexPoint(this._liveEditPoints,this._selectedVertexIndex,o.x,o.y,e,i),s=[...this._liveEditPoints];s[this._selectedVertexIndex]=[t,n],this._liveEditPoints=s,this._selectedVertexIndex=null,this._dispatchVertexChanged(s)}else this._selectedVertexIndex=null,this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:null}})),this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:null}})),this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:null}})),this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:null}})),this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:null}})),this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:null}}))}finishPendingWall(){"wall"!==this.mode||!this._pendingTrace||this._pendingTrace.points.length<2||(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:this._pendingTrace.points}})),this._pendingTrace=null)}cancelGesture(){const e=this._gesture?.kind;return!(!this._moved||!e||"pan"===e||"pinch"===e||"alignDrag"===e)&&("vertex"===e&&this._vertexDragStartPoints&&(this._liveEditPoints=this._vertexDragStartPoints),this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._liveDragPin=null,this._liveRoomLabel=null,this._liveOpeningEdit=null,this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_snapRoomMove(e,t,i,o){const n=this.rooms.find(t=>t.id===e);if(!n)return{dx:t,dy:i,guides:{x:null,y:null}};const s=[...this.rooms.filter(t=>t.id!==e).flatMap(e=>e.points),...this.walls.flatMap(e=>e.points)];let r=null,a=null;for(const[e,l]of n.points){const n=e+t,d=l+i;for(const[e,t]of s){const i=e-n;Math.abs(i)<=o&&(!r||Math.abs(i)<Math.abs(r.delta))&&(r={delta:i,at:e});const s=t-d;Math.abs(s)<=o&&(!a||Math.abs(s)<Math.abs(a.delta))&&(a={delta:s,at:t})}}return{dx:t+(r?.delta??0),dy:i+(a?.delta??0),guides:{x:r?.at??null,y:a?.at??null}}}undoLastPoint(){if("scale"===this.mode&&this._pendingScalePoints.length>0)return this._pendingScalePoints=this._pendingScalePoints.slice(0,-1),!0;const e=this._pendingTrace?.points;return!(!e||0===e.length)&&(this._pendingTrace=e.length>1?{points:e.slice(0,-1)}:null,!0)}cancelPending(){this._pendingTrace=null,this._pendingScalePoints=[]}_deleteSelectedVertex(){const e=this._editingTarget;if(null===this._selectedVertexIndex||!e||!this._liveEditPoints)return;const t="room"===e.kind?3:2;if(this._liveEditPoints.length<=t)return;const i=this._liveEditPoints.filter((e,t)=>t!==this._selectedVertexIndex);this._liveEditPoints=i,this._selectedVertexIndex=null,this._dispatchVertexChanged(i)}_zoomBy(e,t){const i=He(this._viewBox.w*e,250,4e3),o=i/this._viewBox.w,n=this._viewBox.h*o;this._viewBox={x:t.x-(t.x-this._viewBox.x)*o,y:t.y-(t.y-this._viewBox.y)*o,w:i,h:n}}_zoomButton(e){const t=this._viewBox;this._zoomBy(e,{x:t.x+t.w/2,y:t.y+t.h/2})}_pinLabel(e){return e.label_override?e.label_override:we(e.device_id,this.entityLookup.values())}_roomLabelPosition(e,t){if(this._liveRoomLabel?.id===e.id)return[this._liveRoomLabel.x,this._liveRoomLabel.y];const i=this._liveRoomMove?.id===e.id?this._liveRoomMove:null,[o,n]=e.label_position??function(e){const t=Ve.get(e);if(t)return t;const i=e.length>=3?(()=>{const[t,i]=Ae([e],1);return[t,i]})():function(e){if(0===e.length)return[0,0];let t=0,i=0;for(const[o,n]of e)t+=o,i+=n;return[t/e.length,i/e.length]}(e);return Ve.set(e,i),i}(i?e.points:t);return i?[o+i.dx,n+i.dy]:[o,n]}_roomLabelHit(e,t,i){if(!1===e.visible)return!1;const o=this._effectivePoints("room",e.id,e.points);if(o.length<2)return!1;const[n,s]=this._roomLabelPosition(e,o),r=9*e.name.length/2;return t.x>=n-r-i&&t.x<=n+r+i&&t.y>=s-13-i&&t.y<=s+4+i}_renderRoom(e){if(!1===e.visible)return X;const t=this._effectivePoints("room",e.id,e.points);if(t.length<2)return X;const i=t.map(([e,t])=>`${e},${t}`).join(" "),[o,n]=this._roomLabelPosition(e,t),s=this.editingRoomId===e.id,r=e.id===this.selectedRoomId||s,a=e.fill_color??Mt,l=e.fill_opacity??.18,d=e.border_opacity??1,c=this._liveRoomMove?.id===e.id?this._liveRoomMove:null,h=!c||0===c.dx&&0===c.dy?X:Y`<polygon
            class="room-ghost"
            points=${e.points.map(([e,t])=>`${e},${t}`).join(" ")}
          ></polygon>`;return Y`
      ${h}
      <polygon
        class="room-poly ${r?"selected":""}"
        points=${i}
        fill=${a}
        fill-opacity=${r?Math.min(1,l*(.32/.18)):l}
        stroke=${a}
        stroke-opacity=${d}
        stroke-width=${r?3:2}
      ></polygon>
      <text class="room-label" x=${o} y=${n}>${e.name}</text>
      ${s?this._renderVertexHandles(t,!0):X}
    `}_renderVertexHandles(e,t){const i=this._pxToUnits(6),o=this._pxToUnits(4),n=t?Xe(e):Ke(e);return Y`
      ${n.map(([e,t])=>Y`<circle class="midpoint-handle" cx=${e} cy=${t} r=${o}></circle>`)}
      ${e.map(([e,t],o)=>{const n=o===this._selectedVertexIndex;return Y`
          <circle
            class="vertex-handle ${n?"selected":""}"
            cx=${e}
            cy=${t}
            r=${i}
          ></circle>
          ${n?Y`
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
              `:X}
        `})}
    `}_livePinPosition(e){if(this._liveDragPin?.id===e.id)return this._liveDragPin;const t=this._liveRoomMove;return t&&e.room_id===t.id?{x:e.x+t.dx,y:e.y+t.dy}:e}_renderMeshLink(e){const t=`${e.fromPin.id}|${e.toPin.id}`,i=this._livePinPosition(e.fromPin),o=this._livePinPosition(e.toPin);return Y`
      <line
        class="mesh-link ${t===this.selectedMeshLinkKey?"selected":this.selectedMeshLinkKey?"dim":""}"
        x1=${i.x}
        y1=${i.y}
        x2=${o.x}
        y2=${o.y}
        style="stroke:${ve(e.quality)}"
      >
        <title>${e.detail??e.quality}</title>
      </line>
    `}_renderRoomMoveGuides(){if(!this._liveRoomMove)return X;const{x:e,y:t}=this._roomMoveGuides,i=this._viewBox;return Y`
      ${null!==e?Y`<line class="axis-guide" x1=${e} y1=${i.y} x2=${e} y2=${i.y+i.h}></line>`:X}
      ${null!==t?Y`<line class="axis-guide" x1=${i.x} y1=${t} x2=${i.x+i.w} y2=${t}></line>`:X}
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
    `}_renderMeshStubMarkers(){const e=this._pxToUnits(10),t=this._pxToUnits(12),i=new Map;for(const e of this.meshStubs){const t=`${e.targetDeviceId}|${e.x},${e.y}`,o=`${e.fromPin.id}|${e.targetDeviceId}`===this.selectedMeshStubKey,n=i.get(t);n?o&&(n.selected=!0):i.set(t,{stub:e,selected:o})}const o=(e,t)=>e.minX<t.maxX&&t.minX<e.maxX&&e.minY<t.maxY&&t.minY<e.maxY,n=[];for(const e of this.rooms){if(!1===e.visible)continue;const t=this._effectivePoints("room",e.id,e.points);if(t.length<2)continue;const[i,o]=this._roomLabelPosition(e,t),s=9*e.name.length/2;n.push({minX:i-s,maxX:i+s,minY:o-13,maxY:o+4})}const s=this.pins.map(e=>({minX:e.x-t,maxX:e.x+t,minY:e.y-t,maxY:e.y+t}));return[...i.values()].map(({stub:t,selected:i})=>{const r=(t=>{const i=7*t.targetFloorName.length/2;return{minX:t.x-i,maxX:t.x+i,minY:t.y+e+3,maxY:t.y+e+17}})(t),a=!s.some(e=>o(r,e))&&!n.some(e=>o(r,e));return a&&n.push(r),Y`
        ${this._renderPinMarker(t.x,t.y,e,{kind:"path",d:"M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z"},"var(--sc-fg-secondary)",i,`${t.targetLabel} (${t.targetFloorName})`)}
        ${a?Y`<text class="mesh-stub-label" x=${t.x} y=${t.y+e+14}
                >${t.targetFloorName}</text
              >`:X}
      `})}_iconForPin(e){return this._pinIcons.iconForPin(e,this.entityLookup.values())}_pinGroups(){const e=new Map;for(const t of this._displayPins){const i=`${t.x},${t.y}`;e.has(i)||e.set(i,[]),e.get(i).push(t)}return[...e.values()].map(e=>({x:e[0].x,y:e[0].y,pins:e}))}_renderPinGroup(e){const t=this._pxToUnits(12);if(1===e.pins.length){const i=e.pins[0],o=this._liveDragPin?.id===i.id?this._liveDragPin:null,n=o?.x??i.x,s=o?.y??i.y,r=i.id===this.selectedPinId;return this._renderPinMarker(n,s,t,this._iconForPin(i),"var(--sc-accent)",r,this._pinLabel(i))}const i=e.pins.some(e=>e.id===this.selectedPinId),o=`${e.pins.length} devices: ${e.pins.map(e=>this._pinLabel(e)).join(", ")}`;return this._renderPinMarker(e.x,e.y,t,{kind:"path",d:"M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10M12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4M6 16C7.1 16 8 16.9 8 18S7.1 20 6 20 4 19.1 4 18 4.9 16 6 16M6 10C7.1 10 8 10.9 8 12S7.1 14 6 14 4 13.1 4 12 4.9 10 6 10M6 4C7.1 4 8 4.9 8 6S7.1 8 6 8 4 7.1 4 6 4.9 4 6 4M18 16C19.1 16 20 16.9 20 18S19.1 20 18 20 16 19.1 16 18 16.9 16 18 16M18 10C19.1 10 20 10.9 20 12S19.1 14 18 14 16 13.1 16 12 16.9 10 18 10M18 4C19.1 4 20 4.9 20 6S19.1 8 18 8 16 7.1 16 6 16.9 4 18 4Z"},"var(--sc-accent)",i,o)}_renderPinMarker(e,t,i,o,n,s,r){return this._pinIcons.renderMarker(e,t,i,o,n,s,r)}_renderPendingTrace(){const e=this._pendingTrace?.points??[];if(0===e.length&&!this._hoverSnap)return X;const t=e.map(([e,t])=>`${e},${t}`).join(" "),i=this._pxToUnits(6),o=e[e.length-1],n=e[0],s=!!this._hoverSnap&&!!n&&e.length>=3&&ze(this._hoverSnap.point[0],this._hoverSnap.point[1],n[0],n[1])<=this._pxToUnits(It);return Y`
      ${e.length>0?Y`<polyline class="pending-trace" points=${t}></polyline>`:X}
      ${e.map(([e,t],o)=>Y`
          <circle
            class="vertex-handle ${0===o&&s?"closing":""}"
            cx=${e}
            cy=${t}
            r=${0===o&&s?1.6*i:i}
          ></circle>
        `)}
      ${this._hoverSnap?this._renderHoverSnap(o,n,s,i):X}
    `}_renderHoverSnap(e,t,i,o){if(!this._hoverSnap)return X;const[n,s]=this._hoverSnap.point,r=this._viewBox,a=i&&t?t:[n,s];return Y`
      ${this._hoverSnap.lockedY?Y`<line
              class="axis-guide"
              x1=${r.x}
              y1=${s}
              x2=${r.x+r.w}
              y2=${s}
            ></line>`:X}
      ${this._hoverSnap.lockedX?Y`<line
              class="axis-guide"
              x1=${n}
              y1=${r.y}
              x2=${n}
              y2=${r.y+r.h}
            ></line>`:X}
      ${e?Y`<line
              class="hover-snap-line ${i?"closing":""}"
              x1=${e[0]}
              y1=${e[1]}
              x2=${a[0]}
              y2=${a[1]}
            ></line>`:X}
      ${i?X:Y`<circle
              class="hover-snap-marker ${"geometry"===this._hoverSnap.kind?"on-geometry":"axis"===this._hoverSnap.kind?"on-axis":""}"
              cx=${n}
              cy=${s}
              r=${o}
            ></circle>`}
    `}_wallStrokeWidth(e,t){if(this.scale){const[[t,i],[o,n]]=this.scale.points,s=(ze(t,i,o,n)||1)/this.scale.meters;return`${He(Se(e)/100*s,.5,40)}`}return`${He(4+t.attenuationDbPerCm*Se(e)/3,4,8)}px`}_renderWall(e){const t=this._effectivePoints("wall",e.id,e.points),i=e.id===this.selectedWallId,o=this.editingWallId===e.id,n=Me(e.material),s=this._wallStrokeWidth(e,n),r=t[0],a=t[t.length-1],l=t.length>2&&!!r&&!!a&&r[0]===a[0]&&r[1]===a[1],d=(l?t.slice(0,-1):t).map(([e,t])=>`${e},${t}`).join(" "),c="wall-line "+(i||o?"selected":""),h=`stroke:${this.dark?`color-mix(in srgb, ${n.color} 30%, #e0e0e0)`:n.color}; stroke-width:${s}`;return Y`
      ${l?Y`<polygon class=${c} points=${d} style=${h}><title>${n.label}</title></polygon>`:Y`<polyline class=${c} points=${d} style=${h}><title>${n.label}</title></polyline>`}
      ${o?this._renderVertexHandles(t,!1):X}
    `}_renderOpening(e){const t=this._openingEndpoints(e);if(!t)return X;const[[i,o],[n,s]]=t,r=e.id===this.selectedOpeningId,a=this._pxToUnits(6),l=this.walls.find(t=>t.id===e.wallId),d=l?this._wallStrokeWidth(l,Me(l.material)):void 0,c=ze(i,o,n,s)||1,h=parseFloat(d??"6")/2*1.5,p=-(s-o)/c*h,u=(n-i)/c*h,_=(e,t)=>Y`
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
        x2=${n}
        y2=${s}
        style=${d?`stroke-width:${d}`:X}
      >
        <title>${e.type}</title>
      </line>
      ${_(i,o)}
      ${_(n,s)}
      ${r?Y`
            <circle class="opening-handle" cx=${i} cy=${o} r=${a}></circle>
            <circle class="opening-handle" cx=${n} cy=${s} r=${a}></circle>
          `:X}
    `}_renderScaleLine(){if(!this.scale)return X;const[[e,t],[i,o]]=this.scale.points;return Y`
      <line class="scale-line" x1=${e} y1=${t} x2=${i} y2=${o}></line>
      <text class="scale-label" x=${(e+i)/2} y=${(t+o)/2-6}>
        ${ot(this.scale.meters,this.unitSystem)}
        ${it(this.unitSystem)}
      </text>
    `}_renderPendingScale(){if(0===this._pendingScalePoints.length)return X;const e=this._pxToUnits(6),[t,i]=this._pendingScalePoints[0];return Y`<circle class="vertex-handle" cx=${t} cy=${i} r=${e}></circle>`}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return X;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.backgroundOffsetX-this._viewBox.x),n=i+e*(this.backgroundOffsetY-this._viewBox.y),s=e*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${$t}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderAlignOverlay(){if(!this.alignOverlay)return X;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.alignOverlay.offsetX-this._viewBox.x),n=i+e*(this.alignOverlay.offsetY-this._viewBox.y),s=e*this.alignOverlay.scale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.alignOverlay.imageUrl}
          style="width:${$t}px; height:${this._alignNaturalHeight}px; opacity:${this.alignOverlay.opacity};"
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
          ${"trace"===this.mode||"wall"===this.mode?this._renderPendingTrace():X}
          ${this._renderScaleLine()}
          ${"scale"===this.mode?this._renderPendingScale():X}
          ${this._pinGroups().map(e=>this._renderPinGroup(e))}
        </svg>
      `}
      <div class="controls">
        <button @click=${()=>this._zoomButton(.8)} title="Zoom in">
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
        <button @click=${()=>this._zoomButton(1.25)} title="Zoom out">
          <ha-icon icon="mdi:minus"></ha-icon>
        </button>
        <button @click=${()=>this.fitToScreen()} title="Fit to screen">
          <ha-icon icon="mdi:fit-to-screen-outline"></ha-icon>
        </button>
      </div>
    `}};St.styles=[ht,wt,r`
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
      ${pt}
    `],e([ue({type:Boolean,reflect:!0})],St.prototype,"dark",void 0),e([ue({attribute:!1})],St.prototype,"rooms",void 0),e([ue({attribute:!1})],St.prototype,"pins",void 0),e([ue({attribute:!1})],St.prototype,"walls",void 0),e([ue({attribute:!1})],St.prototype,"openings",void 0),e([ue({attribute:!1})],St.prototype,"scale",void 0),e([ue({attribute:!1})],St.prototype,"unitSystem",void 0),e([ue({attribute:!1})],St.prototype,"meshLinks",void 0),e([ue({attribute:!1})],St.prototype,"meshStubs",void 0),e([ue({attribute:!1})],St.prototype,"entityLookup",void 0),e([ue({attribute:!1})],St.prototype,"backgroundImageUrl",void 0),e([ue({type:Number})],St.prototype,"backgroundOpacity",void 0),e([ue({type:Number})],St.prototype,"backgroundOffsetX",void 0),e([ue({type:Number})],St.prototype,"backgroundOffsetY",void 0),e([ue({type:Number})],St.prototype,"backgroundScale",void 0),e([ue({attribute:!1})],St.prototype,"alignOverlay",void 0),e([ue({attribute:!1})],St.prototype,"initialViewBox",void 0),e([ue({type:Boolean})],St.prototype,"sameBuildingAsPrevious",void 0),e([ue({attribute:!1})],St.prototype,"mode",void 0),e([ue({attribute:!1})],St.prototype,"snapMode",void 0),e([ue({attribute:!1})],St.prototype,"armedEntityId",void 0),e([ue({attribute:!1})],St.prototype,"armedOpeningType",void 0),e([ue({attribute:!1})],St.prototype,"selectedRoomId",void 0),e([ue({attribute:!1})],St.prototype,"editingRoomId",void 0),e([ue({attribute:!1})],St.prototype,"editingWallId",void 0),e([ue({attribute:!1})],St.prototype,"selectedPinId",void 0),e([ue({attribute:!1})],St.prototype,"selectedWallId",void 0),e([ue({attribute:!1})],St.prototype,"selectedOpeningId",void 0),e([ue({attribute:!1})],St.prototype,"selectedMeshLinkKey",void 0),e([ue({attribute:!1})],St.prototype,"selectedMeshStubKey",void 0),e([_e()],St.prototype,"_viewBox",void 0),e([_e()],St.prototype,"_naturalHeight",void 0),e([_e()],St.prototype,"_alignNaturalHeight",void 0),e([_e()],St.prototype,"_pendingTrace",void 0),e([_e()],St.prototype,"_hoverSnap",void 0),e([_e()],St.prototype,"_pendingScalePoints",void 0),e([_e()],St.prototype,"_liveEditPoints",void 0),e([_e()],St.prototype,"_liveRoomMove",void 0),e([_e()],St.prototype,"_roomMoveGuides",void 0),e([_e()],St.prototype,"_liveDragPin",void 0),e([_e()],St.prototype,"_liveOpeningEdit",void 0),e([_e()],St.prototype,"_selectedVertexIndex",void 0),e([ge("svg")],St.prototype,"_svg",void 0),e([_e()],St.prototype,"_liveRoomLabel",void 0),St=e([me("floorplan-canvas")],St);const Ct=85.0511287798;function Et(e,t,i){const o=512*2**i,n=e/o*360-180,s=Math.PI-2*Math.PI*t/o;return{lat:180*Math.atan(Math.sinh(s))/Math.PI,lon:n}}function Lt(e,t){const i=t*Math.PI/180,o=Math.cos(i),n=Math.sin(i);return{x:o*e.x-n*e.y,y:n*e.x+o*e.y}}function Tt(e){const t=((e+180)%360+360)%360-180;return-180===t?180:t}const Ot=e=>e.rotation_deg??0;function Rt(e){return function(e,t,i){const o=512*2**i,n=Math.max(-Ct,Math.min(Ct,e))*Math.PI/180;return{x:(t+180)/360*o,y:(.5-Math.log(Math.tan(Math.PI/4+n/2))/(2*Math.PI))*o}}(e.lat,e.lon,e.zoom)}function Bt(e,t,i,o,n){const{lat:s,lon:r}=Et(t,i,o);return{...e,lat:s,lon:r,zoom:o,rotation_deg:Tt(n)}}function At(e,t,i){const o=Rt(e),n=Lt({x:t,y:i},Ot(e));return Bt(e,o.x-n.x,o.y-n.y,e.zoom,Ot(e))}function Ft(e,t,i){const o=Math.min(21,Math.max(3,e.zoom+Math.log2(t))),n=2**(o-e.zoom),s=Ot(e),r=Rt(e),a=Lt(i,s);return Bt(e,n*(r.x+a.x)-a.x,n*(r.y+a.y)-a.y,o,s)}function Dt(e,t,i){const o=Rt(e),n=Lt(i,Ot(e)),s=Lt(i,t);return Bt(e,o.x+n.x-s.x,o.y+n.y-s.y,e.zoom,t)}const zt={en:{floorTabs:{property:"Property"},appHeader:{saving:"Saving…",save:"Save"},canvas:{mode:{select:"Select",pan:"Pan",trace:"Trace Room",wall:"Trace Wall",door:"Add Door",window:"Add Window",scale:"Set Scale",place:"Place Device",align:"Align Floors"},snap:{tooltip:"What new points snap onto (hold Shift to place one point freely)",all:"Snap: all",walls:"Snap: walls only",rooms:"Snap: rooms only",off:"Snap: off"},hint:{closeRoom:"Click near the start to close the room.",addPoints:"Click to add points.",addWallPoints:"Click to add points.",addWallPointsFinish:"Click to add points, then Finish.",scaleFirst:"Click the first point of a known distance.",scaleSecond:"Click the second point.",placeOpening:"Click on a wall to place a {type}.",alignAgainst:"Align against:",noBackground:"That floor has no background image to align against.",alignDrag:"Drag to move, use +/− to resize, then Apply."},openingType:{door:"door",window:"window",opening:"opening"},openingLabel:{door:"door",window:"window"},button:{cancel:"Cancel",finishWall:"Finish Wall",chooseAnother:"Choose another",apply:"Apply",close:"Close"},align:{choose:"— Choose a floor —",shrink:"Shrink overlay slightly",grow:"Grow overlay slightly"},room:{custom:"— Custom —",outdoor:"Outdoor / no floor",hide:"Hide room",show:"Show room",color:"Room color",fillOpacity:"Fill opacity",borderOpacity:"Border opacity",rename:"Rename",doneEditing:"Done editing",editVertices:"Edit vertices",resetLabel:"Reset label position",delete:"Delete room"},pin:{setLabel:"Set label",setIcon:"Set icon",setHeight:"Set height",delete:"Delete pin",removeFromSpot:"Remove from this spot",stackTitle:"{count} devices at this spot"},wall:{material:"Wall material",thickness:"Wall thickness ({unit})",delete:"Delete wall"},opening:{width:"Width ({unit})",storedUnits:"stored units",calibrate:"Calibrate Scale for real units",delete:"Delete"},meshStub:{goToFloor:"Go to floor"},notCalibrated:"Not calibrated",card:{room:"Room",device:"Device",wall:"Wall",wallOpening:"In a wall",link:"Link",quality:"Signal",area:"Area",style:"Style"}},mapBackground:{noWebgl:"This browser can't draw the map (WebGL2 is needed).",failed:"Couldn't load the map: {error}",add:"Add map background",remove:"Remove map background",opacity:"Map opacity",adjust:"Move map (drag; Ctrl+scroll or pinch to zoom)",adjustHint:"Drag the map to line it up with your buildings.",zoomIn:"Zoom map in",zoomOut:"Zoom map out",rotation:"Rotation",resetRotation:"North up",done:"Done",style:"Map type",street:"Street map",aerial:"Aerial photo (Esri)"}},de:{floorTabs:{property:"Anwesen"},appHeader:{saving:"Speichert…",save:"Speichern"},canvas:{mode:{select:"Auswählen",pan:"Verschieben",trace:"Raum zeichnen",wall:"Wand zeichnen",door:"Tür hinzufügen",window:"Fenster hinzufügen",scale:"Maßstab festlegen",place:"Gerät platzieren",align:"Etagen ausrichten"},snap:{tooltip:"Woran neue Punkte einrasten (Umschalttaste halten, um einen Punkt frei zu setzen)",all:"Einrasten: alles",walls:"Einrasten: nur Wände",rooms:"Einrasten: nur Räume",off:"Einrasten: aus"},hint:{closeRoom:"Nahe dem Start klicken, um den Raum zu schließen.",addPoints:"Klicken, um Punkte hinzuzufügen.",addWallPoints:"Klicken, um Punkte hinzuzufügen.",addWallPointsFinish:"Klicken, um Punkte hinzuzufügen, dann „Fertig“.",scaleFirst:"Den ersten Punkt einer bekannten Strecke anklicken.",scaleSecond:"Den zweiten Punkt anklicken.",placeOpening:"Auf eine Wand klicken, um {type} zu platzieren.",alignAgainst:"Ausrichten an:",noBackground:"Diese Etage hat kein Hintergrundbild zum Ausrichten.",alignDrag:"Zum Verschieben ziehen, mit +/− die Größe ändern, dann „Anwenden“."},openingType:{door:"eine Tür",window:"ein Fenster",opening:"eine Öffnung"},openingLabel:{door:"Tür",window:"Fenster"},button:{cancel:"Abbrechen",finishWall:"Wand fertigstellen",chooseAnother:"Andere wählen",apply:"Anwenden",close:"Schließen"},align:{choose:"— Etage wählen —",shrink:"Überlagerung leicht verkleinern",grow:"Überlagerung leicht vergrößern"},room:{custom:"— Benutzerdefiniert —",outdoor:"Außenbereich / keine Etage",hide:"Raum ausblenden",show:"Raum einblenden",color:"Raumfarbe",fillOpacity:"Füllungsdeckkraft",borderOpacity:"Randdeckkraft",rename:"Umbenennen",doneEditing:"Bearbeitung beenden",editVertices:"Eckpunkte bearbeiten",resetLabel:"Beschriftungsposition zurücksetzen",delete:"Raum löschen"},pin:{setLabel:"Beschriftung festlegen",setIcon:"Symbol festlegen",setHeight:"Höhe festlegen",delete:"Pin löschen",removeFromSpot:"Von dieser Stelle entfernen",stackTitle:"{count} Geräte an dieser Stelle"},wall:{material:"Wandmaterial",thickness:"Wandstärke ({unit})",delete:"Wand löschen"},opening:{width:"Breite ({unit})",storedUnits:"gespeicherte Einheiten",calibrate:"Maßstab kalibrieren für reale Einheiten",delete:"Löschen"},meshStub:{goToFloor:"Zur Etage"},notCalibrated:"Nicht kalibriert"},mapBackground:{noWebgl:"Dieser Browser kann die Karte nicht darstellen (WebGL2 erforderlich).",failed:"Karte konnte nicht geladen werden: {error}",add:"Kartenhintergrund hinzufügen",remove:"Kartenhintergrund entfernen",opacity:"Kartendeckkraft",adjust:"Karte verschieben (ziehen; Strg+Scrollen oder Pinch zum Zoomen)",adjustHint:"Karte ziehen, um sie an den Gebäuden auszurichten.",zoomIn:"Karte vergrößern",zoomOut:"Karte verkleinern",rotation:"Drehung",resetRotation:"Norden oben",done:"Fertig",style:"Kartentyp",street:"Straßenkarte",aerial:"Luftbild (Esri)"}}};function Ht(e,t){let i=e;for(const e of t.split(".")){if("object"!=typeof i||null===i)return;i=i[e]}return"string"==typeof i?i:void 0}function Wt(e,t){let i=Ht(zt.en,e)??Ht(zt.en,e)??e;if(t)for(const[e,o]of Object.entries(t))i=i.split(`{${e}}`).join(String(o));return i}const Ut=[[-1,-1],[1,-1],[1,1],[-1,1]];let Nt=class extends de{constructor(){super(...arguments),this.placements=[],this.ghosts=new Map,this.floorNameById=new Map,this.floorIconById=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.85,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.mode="select",this.selectedPlacementId=null,this.pins=[],this.selectedPinId=null,this.entityLookup=new Map,this.meshLinks=[],this.selectedMeshLinkKey=null,this.initialViewBox=null,this.mapBackground=null,this._mapError=null,this._mapStarting=!1,this._mapSize="",this._viewBox={x:0,y:0,w:$t,h:750},this._naturalHeight=750,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._pinIcons=new kt(this),this._gestureCancelled=!1,this._hasFittedOnce=!1,this._onPointerDown=e=>{if("mouse"!==e.pointerType||0===e.button){if(Qe(this),this._svg.setPointerCapture(e.pointerId),this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o={x:(t.x+i.x)/2,y:(t.y+i.y)/2};return"map"===this.mode&&this.mapBackground?void(this._gesture={kind:"mapPinch",lastDistance:ze(t.x,t.y,i.x,i.y)||1,lastAngle:Math.atan2(i.y-t.y,i.x-t.x),lastMid:this._clientToImage(o.x,o.y)}):void(this._gesture={kind:"pinch",startDistance:ze(t.x,t.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}this._pointers.size>2||(this._downClient={x:e.clientX,y:e.clientY},this._lastClient={x:e.clientX,y:e.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(e.clientX,e.clientY):{type:"empty"})}},this._onPointerMove=e=>{if(!this._pointers.has(e.pointerId))return;if(this._pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}),"mapPinch"===this._gesture?.kind&&2===this._pointers.size){const[e,t]=[...this._pointers.values()],i=this._gesture,o=ze(e.x,e.y,t.x,t.y)||1,n=Math.atan2(t.y-e.y,t.x-e.x),s=this._clientToImage((e.x+t.x)/2,(e.y+t.y)/2);return this._fire("map-adjust",{op:"pinch",dx:s.x-i.lastMid.x,dy:s.y-i.lastMid.y,factor:o/i.lastDistance,rotateDeg:180*(n-i.lastAngle)/Math.PI,at:s}),i.lastDistance=o,i.lastAngle=n,void(i.lastMid=s)}if("pinch"===this._gesture?.kind&&2===this._pointers.size){const e=[...this._pointers.values()],[t,i]=e,o=ze(t.x,t.y,i.x,i.y)||1,n=this._gesture.startDistance/o,s=this._gesture.startViewBox,r=He(s.w*n,this._minViewBoxWidth,4e3),a=r/s.w,l=s.h*a,{x:d,y:c}=this._gesture.midImage;return void(this._viewBox={x:d-(d-s.x)*a,y:c-(c-s.y)*a,w:r,h:l})}if(1!==this._pointers.size||!this._downClient)return;if(this._gestureCancelled)return;if(!this._moved){if(ze(this._downClient.x,this._downClient.y,e.clientX,e.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"===this._gesture?.kind||"mapPan"===this._gesture?.kind?this._svg.style.cursor="grabbing":this._gesture&&this._fire("property-gesture-start")}const t=this._svgTransform().scale||1,i=this._lastClient??{x:e.clientX,y:e.clientY};if("mapPan"===this._gesture?.kind)this._fire("map-adjust",{op:"pan",dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t});else if("pan"===this._gesture?.kind)this._viewBox={...this._viewBox,x:this._viewBox.x-(e.clientX-i.x)/t,y:this._viewBox.y-(e.clientY-i.y)/t};else if("move"===this._gesture?.kind)this._fire("placement-move",{id:this._gesture.id,dx:(e.clientX-i.x)/t,dy:(e.clientY-i.y)/t});else if("pinMove"===this._gesture?.kind){const t=this._clientToImage(e.clientX,e.clientY);this._fire("outdoor-pin-move",{id:this._gesture.id,x:t.x,y:t.y})}else if("resize"===this._gesture?.kind){const t=this._gesture,i=this.placements.find(e=>e.id===t.id);if(i){const[o,n]=Ut[t.corner],s=-o,r=-n,a=this._clientToImage(e.clientX,e.clientY),l=i.rotation_deg*Math.PI/180,d=Math.cos(l),c=Math.sin(l),h=a.x-t.anchorWorld.x,p=a.y-t.anchorWorld.y,u=d*h+c*p,_=-c*h+d*p,g=Math.max(10,o*u),m=Math.max(10,n*_),y=i.aspect_ratio||g/m||1,v=Math.max(g,m*y),f=v/y,b=s*(v/2),x=r*(f/2);this._fire("placement-resize",{id:i.id,width:v,height:f,x:t.anchorWorld.x-(d*b-c*x),y:t.anchorWorld.y-(c*b+d*x)})}}else if("rotate"===this._gesture?.kind){const t=this._gesture.id,i=this.placements.find(e=>e.id===t);if(i){const t=this._clientToImage(e.clientX,e.clientY),o=((180*Math.atan2(t.y-i.y,t.x-i.x)/Math.PI+90)%360+360)%360;this._fire("placement-rotate",{id:i.id,rotationDeg:o})}}this._lastClient={x:e.clientX,y:e.clientY}},this._onPointerUp=e=>{this._pointers.delete(e.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(e.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._moved||!this._downClient||this._gestureCancelled||this._handleClick(),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1)},this._onWheel=e=>{if(e.preventDefault(),"map"===this.mode&&this.mapBackground&&(e.ctrlKey||e.shiftKey)){const t=this._clientToImage(e.clientX,e.clientY);return void this._fire("map-adjust",e.ctrlKey?{op:"zoom",factor:e.deltaY<0?1.1:1/1.1,at:t}:{op:"rotate",deltaDeg:e.deltaY<0?2:-2,at:t})}if(e.ctrlKey){const t=e.deltaY<0?.9:1.1;return void this._zoomBy(t,this._clientToImage(e.clientX,e.clientY))}const t=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+e.deltaX*t,y:this._viewBox.y+e.deltaY*t}}}firstUpdated(){this.initialViewBox?(this._viewBox={...this.initialViewBox},this._hasFittedOnce=!0):(this.fitToScreen(),this._hasFittedOnce=this.placements.length>0||!this.backgroundImageUrl),this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._destroyMap()}_destroyMap(){this._map?.destroy(),this._map=void 0,this._mapSize=""}_syncMap(){const e=this.mapBackground;if(!e)return this._destroyMap(),void(this._mapError=null);if(this._mapError)return;const t=this.renderRoot.querySelector(".map-layer");if(!t||!this._svg)return;const i=this._svg.getBoundingClientRect();if(0===i.width||0===i.height)return;const{scale:o,offsetX:n,offsetY:s}=this._svgTransform(),r=this._viewBox,a=function(e,t,i,o){const n=Ot(e),s=Rt(e),r=Lt({x:t,y:i},n),a=Et(s.x+r.x,s.y+r.y,e.zoom);return{lat:a.lat,lon:a.lon,zoom:e.zoom+Math.log2(o),bearing:n}}(e,r.x+(i.width/2-n)/o,r.y+(i.height/2-s)/o,o),l=this.hass?.themes?.darkMode??!1;if(this._map){this._map.setDark(l),this._map.setStyleKind(e.style??"street"),this._map.setOpacity(e.opacity);const t=`${i.width}x${i.height}`;return t!==this._mapSize&&(this._mapSize=t,this._map.resize()),void this._map.setCamera(a)}const d=this.hass?.connection;if(this._mapStarting||!d)return;this._mapStarting=!0,this._mapError=null;const c="/spatial_context/map";(async()=>{try{const o=await(import(`${c}/spatial-context-map.mjs?v=0.14.0-beta.1+mv2v51sq`));if(!o.supportsVectorMaps())throw new Error(Wt("mapBackground.noWebgl"));const n=await o.createMapLayer({container:t,baseUrl:c,connection:d,dark:l,styleKind:e.style??"street",language:this.hass?.locale?.language??this.hass?.language??"en",opacity:e.opacity,camera:a});this.mapBackground&&this.isConnected?(this._map=n,this._mapSize=`${i.width}x${i.height}`):n.destroy()}catch(e){this._mapError=e?.message??String(e)}finally{this._mapStarting=!1,this.requestUpdate()}})()}updated(e){if(e.has("mapBackground")&&(this._mapError=null),this._syncMap(),e.has("backgroundImageUrl")&&this.backgroundImageUrl){const e=new Image;e.onload=()=>{this._naturalHeight=e.naturalHeight/e.naturalWidth*$t||750,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},e.src=this.backgroundImageUrl}}_contentBounds(){if(0===this.placements.length&&0===this.pins.length)return null;const e=[...this.placements.flatMap(e=>[e.x-e.width,e.x+e.width]),...this.pins.map(e=>e.x)],t=[...this.placements.flatMap(e=>[e.y-e.height,e.y+e.height]),...this.pins.map(e=>e.y)],i=Math.min(...e),o=Math.max(...e),n=Math.min(...t),s=Math.max(...t),r=.15*Math.max(o-i,s-n)||60;return{x:i-r,y:n-r,w:o-i+2*r,h:s-n+2*r}}getViewCenter(){const e=this._svg?.getBoundingClientRect(),{scale:t,offsetX:i,offsetY:o}=this._svgTransform(),n=this._viewBox;return{x:n.x+((e?.width??0)/2-i)/t,y:n.y+((e?.height??0)/2-o)/t}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:$t,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const e=this._svg?.getBoundingClientRect(),t=e?.width||this._viewBox.w,i=e?.height||this._viewBox.h,o=Math.min(t/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(t-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(e){return e/this._svgTransform().scale}_clientToImage(e,t){const i=this._svg,o=i.createSVGPoint();o.x=e,o.y=t;const n=i.getScreenCTM();if(!n)return{x:0,y:0};const s=o.matrixTransform(n.inverse());return{x:s.x,y:s.y}}_toLocal(e,t,i){const o=e.rotation_deg*Math.PI/180,n=Math.cos(o),s=Math.sin(o),r=t-e.x,a=i-e.y;return{x:n*r+s*a,y:-s*r+n*a}}_localToWorld(e,t,i){const o=e.rotation_deg*Math.PI/180,n=Math.cos(o),s=Math.sin(o);return{x:e.x+n*t-s*i,y:e.y+s*t+n*i}}_hitTest(e,t){const i=this._clientToImage(e,t),o=this._pxToUnits(12*1.4);for(const e of[...this.pins].reverse())if(ze(e.x,e.y,i.x,i.y)<=o)return{type:"pin",id:e.id};const n=this.placements.find(e=>e.id===this.selectedPlacementId);if(n){const i=this._pxToUnits(26),o=Ut.map(([e,t])=>[e*n.width/2,t*n.height/2]);for(let i=0;i<o.length;i++){const[s,r]=o[i],a=this._localToWorld(n,s,r),l=this._imageToClient(a.x,a.y);if(ze(l.x,l.y,e,t)<=14)return{type:"resizeHandle",id:n.id,corner:i}}const s=this._localToWorld(n,0,-n.height/2-i),r=this._imageToClient(s.x,s.y);if(ze(r.x,r.y,e,t)<=14)return{type:"rotateHandle",id:n.id}}let s=null,r=this._pxToUnits(8);for(const e of this.meshLinks){const t=Ye(i.x,i.y,e.from.x,e.from.y,e.to.x,e.to.y);t<=r&&(s=e,r=t)}if(s)return{type:"meshLink",key:s.key};for(const e of[...this.placements].reverse()){const t=this._toLocal(e,i.x,i.y);if(Math.abs(t.x)<=e.width/2&&Math.abs(t.y)<=e.height/2)return{type:"body",id:e.id}}return{type:"empty"}}_imageToClient(e,t){const i=this._svg.getBoundingClientRect(),{scale:o,offsetX:n,offsetY:s}=this._svgTransform();return{x:i.left+n+(e-this._viewBox.x)*o,y:i.top+s+(t-this._viewBox.y)*o}}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_lockGesture(){if("resizeHandle"===this._downHit?.type){const e=this._downHit,t=this.placements.find(t=>t.id===e.id);if(!t)return{kind:"pan"};const[i,o]=Ut[e.corner],n=this._localToWorld(t,-i*t.width/2,-o*t.height/2);return{kind:"resize",id:t.id,corner:e.corner,anchorWorld:n}}return"rotateHandle"===this._downHit?.type?{kind:"rotate",id:this._downHit.id}:"body"===this._downHit?.type?{kind:"move",id:this._downHit.id}:"pin"===this._downHit?.type?{kind:"pinMove",id:this._downHit.id}:"map"===this.mode&&this.mapBackground?{kind:"mapPan"}:{kind:"pan"}}cancelGesture(){const e=this._gesture?.kind;return!(!this._moved||!e||"pan"===e||"pinch"===e||"mapPan"===e||"mapPinch"===e)&&(this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_handleClick(){if("place"===this.mode||"place-pin"===this.mode){if(!this._downClient)return;const e=this._clientToImage(this._downClient.x,this._downClient.y);return void this._fire("place"===this.mode?"placement-place":"outdoor-pin-place",{x:e.x,y:e.y})}const e=this._downHit;"pin"===e?.type?this._fire("outdoor-pin-select",{id:e.id}):"meshLink"===e?.type?this._fire("property-mesh-link-select",{key:e.key===this.selectedMeshLinkKey?null:e.key}):(this._fire("outdoor-pin-select",{id:null}),this._fire("property-mesh-link-select",{key:null}),this._fire("placement-select",{id:"body"===e?.type?e.id:null}))}get _minViewBoxWidth(){return this.mapBackground?15.625:250}_zoomBy(e,t){const i=He(this._viewBox.w*e,this._minViewBoxWidth,4e3),o=i/this._viewBox.w,n=this._viewBox.h*o;this._viewBox={x:t.x-(t.x-this._viewBox.x)*o,y:t.y-(t.y-this._viewBox.y)*o,w:i,h:n}}_zoomButton(e){const t=this._viewBox;this._zoomBy(e,{x:t.x+t.w/2,y:t.y+t.h/2})}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return X;const{scale:e,offsetX:t,offsetY:i}=this._svgTransform(),o=t+e*(this.backgroundOffsetX-this._viewBox.x),n=i+e*(this.backgroundOffsetY-this._viewBox.y),s=e*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${$t}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderGhost(e){const t=this.ghosts.get(e.id),i=e.source_bounds;if(!t||!i||i.max_x<=i.min_x||i.max_y<=i.min_y)return X;const o=e.width/(i.max_x-i.min_x),n=e.height/(i.max_y-i.min_y),s=e=>e.map(([e,t])=>`${e},${t}`).join(" ");return Y`
      <g
        class="ghost"
        transform="translate(${-e.width/2} ${-e.height/2}) scale(${o} ${n}) translate(${-i.min_x} ${-i.min_y})"
      >
        ${t.rooms.map(e=>Y`<polygon class="ghost-room" points=${s(e)}></polygon>`)}
        ${t.walls.map(e=>Y`<polyline class="ghost-wall" points=${s(e)}></polyline>`)}
      </g>
    `}_renderPlacement(e){const t=e.id===this.selectedPlacementId,i=e.label_override||this.floorNameById.get(e.floor_id)||e.floor_id,o=this._pxToUnits(7),n=this._pxToUnits(26);return Y`
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
        ${t?Y`
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
            `:X}
      </g>
    `}_renderMeshLink(e){const t=null!==e.from.floorId||null!==e.to.floorId;return Y`
      <line
        class="mesh-link ${t?"indoor":""} ${e.key===this.selectedMeshLinkKey?"selected":this.selectedMeshLinkKey?"dim":""}"
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
      ${this.mapBackground?V`<div class="map-layer"></div>
              ${this._mapError?V`<div class="map-error">
                      ${Wt("mapBackground.failed",{error:this._mapError})}
                    </div>`:X}`:X}
      ${this._renderBackgroundOverlay()}
      ${Y`
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
            </div>`:X}
      <div class="controls">
        <button @click=${()=>this._zoomButton(.87)} title="Zoom in">
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
        <button @click=${()=>this._zoomButton(1.15)} title="Zoom out">
          <ha-icon icon="mdi:minus"></ha-icon>
        </button>
        <button @click=${()=>this.fitToScreen()} title="Fit to screen">
          <ha-icon icon="mdi:fit-to-screen-outline"></ha-icon>
        </button>
      </div>
    `}};Nt.styles=[ht,wt,r`
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
        border-radius: 4px;
        font-size: 0.7rem;
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
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
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
      ${pt}
    `],e([ue({attribute:!1})],Nt.prototype,"placements",void 0),e([ue({attribute:!1})],Nt.prototype,"ghosts",void 0),e([ue({attribute:!1})],Nt.prototype,"floorNameById",void 0),e([ue({attribute:!1})],Nt.prototype,"floorIconById",void 0),e([ue({attribute:!1})],Nt.prototype,"backgroundImageUrl",void 0),e([ue({type:Number})],Nt.prototype,"backgroundOpacity",void 0),e([ue({type:Number})],Nt.prototype,"backgroundOffsetX",void 0),e([ue({type:Number})],Nt.prototype,"backgroundOffsetY",void 0),e([ue({type:Number})],Nt.prototype,"backgroundScale",void 0),e([ue({attribute:!1})],Nt.prototype,"mode",void 0),e([ue({attribute:!1})],Nt.prototype,"selectedPlacementId",void 0),e([ue({attribute:!1})],Nt.prototype,"pins",void 0),e([ue({attribute:!1})],Nt.prototype,"selectedPinId",void 0),e([ue({attribute:!1})],Nt.prototype,"entityLookup",void 0),e([ue({attribute:!1})],Nt.prototype,"meshLinks",void 0),e([ue({attribute:!1})],Nt.prototype,"selectedMeshLinkKey",void 0),e([ue({attribute:!1})],Nt.prototype,"initialViewBox",void 0),e([ue({attribute:!1})],Nt.prototype,"mapBackground",void 0),e([ue({attribute:!1})],Nt.prototype,"hass",void 0),e([_e()],Nt.prototype,"_mapError",void 0),e([_e()],Nt.prototype,"_viewBox",void 0),e([_e()],Nt.prototype,"_naturalHeight",void 0),e([ge("svg")],Nt.prototype,"_svg",void 0),Nt=e([me("property-canvas")],Nt);let Vt=class extends de{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1}render(){return V`
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
        <span>${Wt("floorTabs.property")}</span>
      </button>
    `}};Vt.styles=[ht,r`
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
      /* Tabs get a row of their own on narrow screens (see app-header),
       * so names stay visible — an icon alone rarely tells floors apart. */
      @media (max-width: 600px) {
        button {
          padding: 0 12px;
          white-space: nowrap;
          flex: none;
        }
      }
    `],e([ue({attribute:!1})],Vt.prototype,"floors",void 0),e([ue({attribute:!1})],Vt.prototype,"selectedFloorId",void 0),e([ue({type:Boolean})],Vt.prototype,"propertySelected",void 0),Vt=e([me("floor-tabs")],Vt);let Yt=class extends de{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}render(){return V`
      <div class="identity">
        <button
          class="icon-button menu-button"
          title="Menu"
          @click=${()=>this._fire("hass-toggle-menu")}
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>
        <h1>Spatial Context</h1>
      </div>
      <floor-tabs
        .floors=${this.floors}
        .selectedFloorId=${this.selectedFloorId}
        .propertySelected=${this.propertySelected}
      ></floor-tabs>
      <div class="actions">
        <slot></slot>
        <slot name="end"></slot>
      </div>
    `}};Yt.styles=[ht,r`
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
          padding-left: 4px;
        }
        .actions {
          grid-area: actions;
          padding-right: 8px;
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
          height: 40px;
        }
      }
      @media (max-width: 480px) {
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
    `],e([ue({attribute:!1})],Yt.prototype,"floors",void 0),e([ue({attribute:!1})],Yt.prototype,"selectedFloorId",void 0),e([ue({type:Boolean})],Yt.prototype,"propertySelected",void 0),Yt=e([me("app-header")],Yt);let jt=class extends de{constructor(){super(...arguments),this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1}_fire(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}render(){return V`
      <button
        title="Undo (Ctrl/Cmd+Z)"
        ?disabled=${!this.canUndo}
        @click=${()=>this._fire("undo-click")}
      >
        <ha-icon icon="mdi:undo"></ha-icon>
      </button>
      <button
        title="Redo (Ctrl/Cmd+Shift+Z)"
        ?disabled=${!this.canRedo}
        @click=${()=>this._fire("redo-click")}
      >
        <ha-icon icon="mdi:redo"></ha-icon>
      </button>
      <button
        title=${this.saving?Wt("appHeader.saving"):Wt("appHeader.save")}
        ?disabled=${this.saving}
        @click=${()=>this._fire("save-click")}
      >
        <ha-icon icon="mdi:content-save"></ha-icon>
        ${this.dirty?V`<span class="dirty-dot"></span>`:X}
      </button>
    `}};jt.styles=[ht,r`
      :host {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      button {
        position: relative;
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
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
    `],e([ue({type:Boolean})],jt.prototype,"dirty",void 0),e([ue({type:Boolean})],jt.prototype,"saving",void 0),e([ue({type:Boolean})],jt.prototype,"canUndo",void 0),e([ue({type:Boolean})],jt.prototype,"canRedo",void 0),jt=e([me("row-actions")],jt);const Xt=r`
  .mesh-legend {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    color: var(--sc-fg-secondary);
    pointer-events: none;
    white-space: nowrap;
  }
  .mesh-legend .gradient {
    width: 96px;
    height: 6px;
    border-radius: 3px;
  }
`;function Kt(){const e=`linear-gradient(to right, ${ve("weak")}, ${ve("medium")}, ${ve("strong")})`;return V`<div class="mesh-legend floating-panel">
    <span>Weak</span>
    <span class="gradient" style="background:${e}"></span>
    <span>Strong</span>
  </div>`}let qt=class extends de{constructor(){super(...arguments),this.mode="select",this.armedOpeningType=null,this.hasPendingTrace=!1,this.hasPendingWall=!1,this.snapMode="all",this.pendingScaleCount=0,this.scaleReadout=null,this.selectedRoom=null,this.editingRoom=!1,this.areas=[],this.selectedPin=null,this.selectedWall=null,this.editingWall=!1,this.unitSystem="metric",this.unitsPerMeter=null,this.pinStack=null,this.entityLookup=new Map,this.selectedOpening=null,this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1,this.meshLegend=!1,this.selectedMeshLink=null,this.selectedMeshStub=null,this.otherFloors=[],this.alignTargetFloorId=null,this.alignTargetHasBackground=!0,this._wallThicknessUnit=null,this._openingWidthUnit=null,this._clearSelection=()=>this._fire("selection-clear")}willUpdate(e){e.has("selectedWall")&&e.get("selectedWall")?.id!==this.selectedWall?.id&&(this._wallThicknessUnit=null),e.has("selectedOpening")&&e.get("selectedOpening")?.id!==this.selectedOpening?.id&&(this._openingWidthUnit=null)}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_unitSelect(e,t){return V`
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
      <div class="mode-toolbar">
        ${this._modeButton("select","mdi:cursor-default-click",Wt("canvas.mode.select"))}
        ${this._modeButton("pan","mdi:hand-back-right-outline",Wt("canvas.mode.pan"))}
        <span class="tool-divider"></span>
        ${this._modeButton("trace","mdi:vector-square",Wt("canvas.mode.trace"))}
        ${this._modeButton("wall","mdi:wall",Wt("canvas.mode.wall"))}
        ${this._openingModeButton("door","mdi:door",Wt("canvas.mode.door"))}
        ${this._openingModeButton("window","mdi:window-closed-variant",Wt("canvas.mode.window"))}
        ${this._modeButton("scale","mdi:ruler",Wt("canvas.mode.scale"))}
        <span class="tool-divider"></span>
        ${this._modeButton("place","mdi:map-marker-plus",Wt("canvas.mode.place"))}
        ${this._modeButton("align","mdi:compare",Wt("canvas.mode.align"))}
      </div>
    `}_renderSnapSelect(){return V`<select
      class="snap-select"
      title=${Wt("canvas.snap.tooltip")}
      @change=${e=>this._fire("snap-mode-change",{snapMode:e.target.value})}
    >
      <option value="all" ?selected=${"all"===this.snapMode}>
        ${Wt("canvas.snap.all")}
      </option>
      <option value="same" ?selected=${"same"===this.snapMode}>
        ${"wall"===this.mode?Wt("canvas.snap.walls"):Wt("canvas.snap.rooms")}
      </option>
      <option value="off" ?selected=${"off"===this.snapMode}>
        ${Wt("canvas.snap.off")}
      </option>
    </select>`}_renderHintBar(){return"trace"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${this.hasPendingTrace?Wt("canvas.hint.closeRoom"):Wt("canvas.hint.addPoints")}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingTrace?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Wt("canvas.button.cancel")}
              </button>`:X}
      </div>`:"wall"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${this.hasPendingWall?Wt("canvas.hint.addWallPointsFinish"):Wt("canvas.hint.addWallPoints")}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingWall?V`<button
                class="primary"
                @click=${()=>this._fire("finish-wall-click")}
              >
                ${Wt("canvas.button.finishWall")}
              </button>`:X}
        ${this.hasPendingWall?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Wt("canvas.button.cancel")}
              </button>`:X}
      </div>`:"scale"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${0===this.pendingScaleCount?Wt("canvas.hint.scaleFirst"):Wt("canvas.hint.scaleSecond")}</span
        >
        ${this.pendingScaleCount>0?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Wt("canvas.button.cancel")}
              </button>`:X}
      </div>`:"opening"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${Wt("canvas.hint.placeOpening",{type:Wt(`canvas.openingType.${this.armedOpeningType??"opening"}`)})}</span
        >
      </div>`:"align"===this.mode?this._renderAlignBar():X}_renderAlignBar(){return this.alignTargetFloorId?this.alignTargetHasBackground?V`<div class="hint-bar floating-panel">
      <span class="hint">${Wt("canvas.hint.alignDrag")}</span>
      <button
        title=${Wt("canvas.align.shrink")}
        @click=${()=>this._fire("align-scale-click",{factor:.995})}
      >
        −
      </button>
      <button
        title=${Wt("canvas.align.grow")}
        @click=${()=>this._fire("align-scale-click",{factor:1.0050251})}
      >
        +
      </button>
      <button class="primary" @click=${()=>this._fire("align-apply-click")}>
        ${Wt("canvas.button.apply")}
      </button>
      <button @click=${()=>this._fire("align-cancel-click")}>
        ${Wt("canvas.button.cancel")}
      </button>
    </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint">${Wt("canvas.hint.noBackground")}</span>
        <button
          @click=${()=>this._fire("align-target-change",{floorId:null})}
        >
          ${Wt("canvas.button.chooseAnother")}
        </button>
        <button @click=${()=>this._fire("align-cancel-click")}>
          ${Wt("canvas.button.cancel")}
        </button>
      </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint">${Wt("canvas.hint.alignAgainst")}</span>
        <select
          @change=${e=>this._fire("align-target-change",{floorId:e.target.value})}
        >
          <option value="" selected>${Wt("canvas.align.choose")}</option>
          ${this.otherFloors.map(e=>V`<option value=${e.floor_id}>${e.name}</option>`)}
        </select>
        <button @click=${()=>this._fire("align-cancel-click")}>
          ${Wt("canvas.button.cancel")}
        </button>
      </div>`}_areaOptions(e,t){return e.map(e=>V`<option
          value=${e.area_id}
          ?selected=${e.area_id===t}
        >
          ${e.name}
        </option>`)}_card(e){return V`
      <div class="info-card floating-panel">
        <div class="info-head">
          <button
            class="info-close"
            title=${Wt("canvas.button.close")}
            @click=${e.onClose}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <div class="info-titles">
            <div class="info-title">${e.title}</div>
            ${e.subtitle?V`<div class="info-sub">${e.subtitle}</div>`:X}
          </div>
        </div>
        <div class="info-body">${e.body}</div>
        ${e.footer?V`<div class="info-foot">${e.footer}</div>`:X}
      </div>
    `}_actionRow(e,t,i,o=!1){return V`<button
      class="info-row action ${o?"active":""}"
      @click=${i}
    >
      <ha-icon icon=${e}></ha-icon>
      <span class="grow">${t}</span>
    </button>`}_fieldRow(e,t){return V`<div class="info-row">
      <span class="grow">${e}</span>
      ${t}
    </div>`}_selectWrap(e){return V`<span class="select-wrap"
      >${e}<ha-icon class="chev" icon="mdi:menu-down"></ha-icon
    ></span>`}_deleteButton(e,t){return V`<button class="danger" @click=${()=>this._fire(t)}>
      <ha-icon icon="mdi:delete"></ha-icon> ${e}
    </button>`}_renderSelectionPanel(){if(this.selectedRoom){const e=this.selectedRoom,t=!1!==e.visible,i=this.areas.find(t=>t.area_id===e.area_id);return this._card({title:e.name,subtitle:i?i.name:Wt("canvas.card.room"),onClose:this._clearSelection,body:V`
          <div class="info-group">
            ${this._fieldRow(Wt("canvas.card.area"),this._selectWrap(V`<select
                  @change=${e=>this._fire("room-area-change",{areaId:e.target.value})}
                >
                  <option value="" ?selected=${!e.area_id}>
                    ${Wt("canvas.room.custom")}
                  </option>
                  ${this._areaOptions(this.areas.filter(e=>null!==e.floor_id),e.area_id)}
                  ${this.areas.some(e=>null===e.floor_id)?V`<optgroup label=${Wt("canvas.room.outdoor")}>
                          ${this._areaOptions(this.areas.filter(e=>null===e.floor_id),e.area_id)}
                        </optgroup>`:X}
                </select>`))}
            ${this._actionRow("mdi:pencil",Wt("canvas.room.rename"),()=>this._fire("room-rename-click"))}
            ${this._actionRow("mdi:vector-polygon",this.editingRoom?Wt("canvas.room.doneEditing"):Wt("canvas.room.editVertices"),()=>this._fire("room-edit-vertices-click"),this.editingRoom)}
            ${e.label_position?this._actionRow("mdi:format-text-variant-outline",Wt("canvas.room.resetLabel"),()=>this._fire("room-label-reset-click")):X}
            ${this._fieldRow(Wt(t?"canvas.room.hide":"canvas.room.show"),V`<input
                type="checkbox"
                class="switch"
                role="switch"
                .checked=${t}
                @change=${()=>this._fire("room-visible-toggle")}
              />`)}
          </div>
          <div class="info-group">
            <div class="info-group-title">${Wt("canvas.card.style")}</div>
            ${this._fieldRow(Wt("canvas.room.color"),V`<input
                type="color"
                class="room-fill-color"
                .value=${e.fill_color??Mt}
                @input=${e=>this._fire("room-fill-color-change",{color:e.target.value})}
              />`)}
            ${this._fieldRow(Wt("canvas.room.fillOpacity"),V`<input
                type="range"
                class="room-opacity"
                min="0"
                max="1"
                step="0.02"
                .value=${String(e.fill_opacity??.18)}
                @input=${e=>this._fire("room-fill-opacity-change",{opacity:Number(e.target.value)})}
              />`)}
            ${this._fieldRow(Wt("canvas.room.borderOpacity"),V`<input
                type="range"
                class="room-opacity"
                min="0"
                max="1"
                step="0.02"
                .value=${String(e.border_opacity??1)}
                @input=${e=>this._fire("room-border-opacity-change",{opacity:Number(e.target.value)})}
              />`)}
          </div>
        `,footer:this._deleteButton(Wt("canvas.room.delete"),"room-delete-click")})}if(this.selectedPin){const e=this.selectedPin;return this._card({title:this._pinLabel(e),subtitle:Wt("canvas.card.device"),onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._actionRow("mdi:tag-text",Wt("canvas.pin.setLabel"),()=>this._fire("pin-set-label-click"))}
          ${this._actionRow("mdi:shape",Wt("canvas.pin.setIcon"),()=>this._fire("pin-set-icon-click"))}
          ${this._actionRow("mdi:human-male-height",Wt("canvas.pin.setHeight"),()=>this._fire("pin-set-height-click"))}
        </div>`,footer:this._deleteButton(Wt("canvas.pin.delete"),"pin-delete-click")})}if(this.selectedWall){const e=this.selectedWall,t=this._wallThicknessUnit??rt(this.unitSystem),i=this._thicknessInputAttrs(t);return this._card({title:Wt("canvas.card.wall"),subtitle:Ie.find(t=>t.id===e.material)?.label,onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow(Wt("canvas.wall.material"),this._selectWrap(V`<select
                @change=${e=>this._fire("wall-material-change",{material:e.target.value})}
              >
                ${Ie.map(t=>V`<option
                      value=${t.id}
                      ?selected=${t.id===e.material}
                    >
                      ${t.label}
                    </option>`)}
              </select>`))}
          ${this._fieldRow(Wt("canvas.wall.thickness",{unit:t}),V`<span class="inline-pair"
              ><input
                type="number"
                class="wall-thickness"
                min=${i.min}
                max=${i.max}
                step=${i.step}
                .value=${at(Se(e),t)}
                @change=${e=>{const i=lt(e.target.value,t);null===i||!Number.isFinite(i)||i<=0||this._fire("wall-thickness-change",{thicknessCm:i})}}
              />${this._unitSelect(t,e=>this._wallThicknessUnit=e)}</span
            >`)}
          ${this._actionRow("mdi:vector-polygon",this.editingWall?Wt("canvas.room.doneEditing"):Wt("canvas.room.editVertices"),()=>this._fire("wall-edit-vertices-click"),this.editingWall)}
        </div>`,footer:this._deleteButton(Wt("canvas.wall.delete"),"wall-delete-click")})}if(this.selectedOpening){const e=this.selectedOpening,t=this._openingWidthUnit??rt(this.unitSystem),i=this._thicknessInputAttrs(t),o=this.unitsPerMeter;return this._card({title:Wt(`canvas.openingLabel.${e.type}`),subtitle:Wt("canvas.card.wallOpening"),onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow(Wt("canvas.opening.width",{unit:null!==o?t:Wt("canvas.opening.storedUnits")}),V`<span class="inline-pair"
              ><input
                type="number"
                class="wall-thickness"
                min=${null!==o?i.min:"1"}
                step=${null!==o?i.step:"1"}
                .value=${null!==o?ct(e.width,o,t):String(e.width)}
                @change=${e=>{const i=e.target.value,n=null!==o?function(e,t,i){const o=lt(e,i);return null===o?null:o/100*t}(i,o,t):Number(i);null===n||!Number.isFinite(n)||n<=0||this._fire("opening-width-change",{width:n})}}
              />${null!==o?this._unitSelect(t,e=>this._openingWidthUnit=e):X}</span
            >`)}
          ${null===o?V`<div class="info-row">
                  <span class="grow info-sub"
                    >${Wt("canvas.opening.calibrate")}</span
                  >
                </div>`:X}
        </div>`,footer:this._deleteButton(Wt("canvas.opening.delete"),"opening-delete-click")})}if(this.selectedMeshLink){const e=this.selectedMeshLink;return this._card({title:`${this._pinLabel(e.fromPin)} → ${this._pinLabel(e.toPin)}`,subtitle:Wt("canvas.card.link"),onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow(Wt("canvas.card.quality"),V`<span style="color:${ve(e.quality)}"
              >${e.detail??e.quality}</span
            >`)}
        </div>`})}if(this.selectedMeshStub){const e=this.selectedMeshStub;return this._card({title:`${this._pinLabel(e.fromPin)} → ${e.targetLabel}`,subtitle:e.targetFloorName,onClose:this._clearSelection,body:V`<div class="info-group">
          ${this._fieldRow(Wt("canvas.card.quality"),V`<span style="color:${ve(e.quality)}"
              >${e.detail??e.quality}</span
            >`)}
          ${this._actionRow("mdi:arrow-right-circle",Wt("canvas.meshStub.goToFloor"),()=>this._fire("mesh-stub-goto-floor-click"))}
        </div>`})}return X}_pinLabel(e){return e.label_override?e.label_override:we(e.device_id,this.entityLookup.values())}_renderPinStack(){if(!this.pinStack)return X;const e=this.pinStack;return this._card({title:Wt("canvas.pin.stackTitle",{count:e.length}),onClose:()=>this._fire("pin-stack-dismiss"),body:V`<div class="info-group">
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
                title=${Wt("canvas.pin.removeFromSpot")}
                @click=${()=>this._fire("pin-stack-remove-click",{pinId:e.id})}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `)}
      </div>`})}render(){return V`
      <div class="tool-row">
        ${this._renderModeToolbar()} ${this._renderHintBar()}
        <div class="scale-badge floating-panel">
          ${this.scaleReadout??Wt("canvas.notCalibrated")}
        </div>
        <row-actions
          .dirty=${this.dirty}
          .saving=${this.saving}
          .canUndo=${this.canUndo}
          .canRedo=${this.canRedo}
        ></row-actions>
      </div>
      ${this.meshLegend?Kt():X}
      ${this.pinStack?this._renderPinStack():this._renderSelectionPanel()}
    `}};qt.styles=[ht,ut,_t,gt,Xt,r`
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
        gap: 4px;
        padding: 6px 10px;
        border-radius: 18px;
      }
      /* A thin divider between tool groups: view, draw, place/align. */
      .tool-divider {
        align-self: stretch;
        width: 1px;
        margin: 6px 4px;
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
        gap: 8px;
        pointer-events: auto;
      }
      .scale-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        border-radius: 16px;
        padding: 6px 14px;
        font-size: 0.8125rem;
        color: var(--sc-fg-secondary);
        pointer-events: auto;
      }
      /* HA map-panel style info card. */
      .info-card {
        position: absolute;
        top: 68px;
        left: 12px;
        width: min(340px, calc(100% - 24px));
        max-height: calc(100% - 80px);
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        border-radius: 24px;
        pointer-events: auto;
      }
      .info-head {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 4px 0;
      }
      .info-close {
        display: grid;
        place-items: center;
        flex: none;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
      }
      .info-titles {
        min-width: 0;
      }
      .info-title {
        font-size: 1.125rem;
        line-height: 1.25;
        overflow-wrap: anywhere;
      }
      .info-sub {
        font-size: 0.8125rem;
        color: var(--sc-fg-secondary);
      }
      .info-body {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 0;
        overflow-y: auto;
      }
      .info-group {
        padding: 4px 0;
        border-radius: 16px;
        background: var(--primary-background-color, var(--sc-bg));
      }
      .info-group-title {
        padding: 8px 16px 0;
        font-size: 0.75rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--sc-fg-secondary);
      }
      .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 48px;
        padding: 6px 16px;
        font-size: 0.9375rem;
        text-align: left;
      }
      .info-row.action {
        justify-content: flex-start;
        border-radius: 0;
      }
      .info-row.action:hover {
        background: color-mix(in srgb, var(--sc-fg) 8%, transparent);
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
        border-radius: 16px;
      }
      .inline-pair {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .info-row.stack-row {
        padding: 0 4px 0 0;
      }
      .stack-choose {
        flex: 1;
        min-width: 0;
        padding: 12px 16px;
        border-radius: 0;
        text-align: left;
        justify-content: flex-start;
      }
      .stack-remove {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        color: var(--sc-danger);
      }
      .info-foot {
        display: flex;
        gap: 8px;
        padding: 0 4px 4px;
      }
      .info-foot button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 10px 16px;
        border-radius: 20px;
        font-size: 0.9375rem;
      }
      .info-foot button.danger {
        background: color-mix(in srgb, var(--sc-danger) 14%, transparent);
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
    `],e([ue({attribute:!1})],qt.prototype,"mode",void 0),e([ue({attribute:!1})],qt.prototype,"armedOpeningType",void 0),e([ue({type:Boolean})],qt.prototype,"hasPendingTrace",void 0),e([ue({type:Boolean})],qt.prototype,"hasPendingWall",void 0),e([ue({attribute:!1})],qt.prototype,"snapMode",void 0),e([ue({type:Number})],qt.prototype,"pendingScaleCount",void 0),e([ue({attribute:!1})],qt.prototype,"scaleReadout",void 0),e([ue({attribute:!1})],qt.prototype,"selectedRoom",void 0),e([ue({type:Boolean})],qt.prototype,"editingRoom",void 0),e([ue({attribute:!1})],qt.prototype,"areas",void 0),e([ue({attribute:!1})],qt.prototype,"selectedPin",void 0),e([ue({attribute:!1})],qt.prototype,"selectedWall",void 0),e([ue({type:Boolean})],qt.prototype,"editingWall",void 0),e([ue({attribute:!1})],qt.prototype,"unitSystem",void 0),e([ue({type:Number})],qt.prototype,"unitsPerMeter",void 0),e([ue({attribute:!1})],qt.prototype,"pinStack",void 0),e([ue({attribute:!1})],qt.prototype,"entityLookup",void 0),e([ue({attribute:!1})],qt.prototype,"selectedOpening",void 0),e([ue({type:Boolean})],qt.prototype,"dirty",void 0),e([ue({type:Boolean})],qt.prototype,"saving",void 0),e([ue({type:Boolean})],qt.prototype,"canUndo",void 0),e([ue({type:Boolean})],qt.prototype,"canRedo",void 0),e([ue({type:Boolean})],qt.prototype,"meshLegend",void 0),e([ue({attribute:!1})],qt.prototype,"selectedMeshLink",void 0),e([ue({attribute:!1})],qt.prototype,"selectedMeshStub",void 0),e([ue({attribute:!1})],qt.prototype,"otherFloors",void 0),e([ue({attribute:!1})],qt.prototype,"alignTargetFloorId",void 0),e([ue({type:Boolean})],qt.prototype,"alignTargetHasBackground",void 0),e([_e()],qt.prototype,"_wallThicknessUnit",void 0),e([_e()],qt.prototype,"_openingWidthUnit",void 0),qt=e([me("canvas-overlay")],qt);let Gt=class extends de{constructor(){super(...arguments),this.icon="",this.label="",this.open=!1,this.dialog=!1,this.highlight=!1}render(){return V`
      <button
        class="icon-button ${this.open?"active":""} ${this.highlight?"highlight":""}"
        title=${this.label}
        @click=${()=>this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${this.open?V`<div
              class="popover floating-panel ${this.dialog?"dialog":""}"
            >
              <slot></slot>
            </div>`:X}
    `}};var Zt;Gt.styles=[ht,r`
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
      /* The popover's feature is switched on (e.g. a network layer is
       * showing) even while the menu is closed. */
      .icon-button.highlight {
        color: var(--sc-accent);
      }
      /* Settings: HA's dialog look — large radius, no inner padding (the
       * content brings its own header and sections). */
      .popover.dialog {
        padding: 0;
        border-radius: 28px;
        overflow: hidden;
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
    `],e([ue()],Gt.prototype,"icon",void 0),e([ue()],Gt.prototype,"label",void 0),e([ue({type:Boolean})],Gt.prototype,"open",void 0),e([ue({type:Boolean})],Gt.prototype,"dialog",void 0),e([ue({type:Boolean})],Gt.prototype,"highlight",void 0),Gt=e([me("icon-popover")],Gt);let Jt=Zt=class extends de{constructor(){super(...arguments),this._menuOpen=!1,this.entities=[],this.placedDeviceIds=new Set,this.armedEntityId=null,this.floors=[],this.areas=[],this.currentFloorId=null,this.linkedAreaIds=new Set,this._search="",this._floorFilter=null,this._areaFilter=null,this._onResizeHandlePointerDown=e=>{e.preventDefault();const t=e.clientX,i=this.getBoundingClientRect().width,o=e.currentTarget;o.setPointerCapture(e.pointerId);const n=e=>{const o=t-e.clientX,n=Math.min(Zt.MAX_WIDTH,Math.max(Zt.MIN_WIDTH,i+o));this.style.setProperty("--sc-picker-width",`${n}px`)},s=e=>{o.releasePointerCapture(e.pointerId),o.removeEventListener("pointermove",n),o.removeEventListener("pointerup",s),this._writeStoredWidth(Math.round(this.getBoundingClientRect().width))};o.addEventListener("pointermove",n),o.addEventListener("pointerup",s)},this._onFloorFilterChange=e=>{const t=e.target.value;this._floorFilter="all"===t?"all":t,this._areaFilter&&!this._areasForFilter.some(e=>e.area_id===this._areaFilter)&&(this._areaFilter=null)}}connectedCallback(){super.connectedCallback();const e=this._readStoredWidth();null!==e&&this.style.setProperty("--sc-picker-width",`${e}px`)}_readStoredWidth(){try{const e=localStorage.getItem(Zt.WIDTH_STORAGE_KEY);if(!e)return null;const t=Number(e);return Number.isFinite(t)?Math.min(Zt.MAX_WIDTH,Math.max(Zt.MIN_WIDTH,t)):null}catch{return null}}_writeStoredWidth(e){try{localStorage.setItem(Zt.WIDTH_STORAGE_KEY,String(e))}catch{}}get _effectiveFloorFilter(){return"all"===this._floorFilter?null:this._floorFilter??this.currentFloorId}get _areasForFilter(){const e=this._effectiveFloorFilter;return null===e?this.areas:this.areas.filter(t=>this._areaIsOnFloor(t,e))}_areaIsOnFloor(e,t){return t===ye?null===e.floor_id:e.floor_id===t||t===this.currentFloorId&&this.linkedAreaIds.has(e.area_id)}get _devices(){const e=new Map;for(const t of this.entities){const i=t.device_id??t.entity_id;e.has(i)||e.set(i,[]),e.get(i).push(t)}const t=[];for(const[i,o]of e){const e=xe(i,o)??o[0];t.push({deviceId:i,deviceName:e.device_name??e.name,areaId:e.area_id,areaName:e.area_name,integrationDomain:e.integration_domain,integrationName:e.integration_name,entities:o,primaryEntityId:e.entity_id})}return t.sort((e,t)=>e.deviceName.localeCompare(t.deviceName)),t}_blockedFloorName(e){const t=e.entities.find(t=>t.entity_id===e.primaryEntityId);return t?.placed_floor_id&&t.placed_floor_id!==this.currentFloorId?t.placed_floor_name??t.placed_floor_id:null}get _filtered(){const e=this._search.trim().toLowerCase(),t=this._effectiveFloorFilter,i=this._areaFilter;return this._devices.filter(o=>{if(i){if(o.areaId!==i)return!1}else if(t){const e=this.areas.find(e=>e.area_id===o.areaId);if(!e||!this._areaIsOnFloor(e,t))return!1}return!e||(o.deviceName.toLowerCase().includes(e)||(o.areaName??"").toLowerCase().includes(e)||o.entities.some(t=>t.entity_id.toLowerCase().includes(e)))})}render(){const e=this._filtered;return V`
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
          ${this._search?V`<button
                  class="clear"
                  title="Clear search"
                  @click=${()=>this._search=""}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>`:X}
        </div>
        <div class="filters">
          <span class="select-wrap"
            ><select @change=${this._onFloorFilterChange}>
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
                  </option>`)}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
          <span class="select-wrap"
            ><select
              @change=${e=>this._areaFilter=e.target.value||null}
            >
              <option value="" ?selected=${!this._areaFilter}>All Areas</option>
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
                  title="More"
                  @click=${()=>this._menuOpen=!this._menuOpen}
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>`:X}
        </div>
        ${this._menuOpen&&this.placedDeviceIds.size>0?V`<div class="more-menu floating-panel">
                <button
                  class="menu-item danger"
                  @click=${()=>{this._menuOpen=!1,this.dispatchEvent(new CustomEvent("clear-all-pins",{bubbles:!0,composed:!0}))}}
                >
                  <ha-icon icon="mdi:playlist-remove"></ha-icon> Clear all
                  placed devices
                </button>
              </div>`:X}
      </div>
      <div class="list">
        ${0===e.length?V`<div class="empty">No matching devices.</div>`:e.map(e=>{const t=this.placedDeviceIds.has(e.deviceId),i=this._blockedFloorName(e),o=this.armedEntityId===e.primaryEntityId,n=[e.areaName,e.integrationName].filter(e=>!!e).join(" - ");return V`
                  <div
                    class="item ${o?"armed":""} ${t?"placed":""} ${i?"blocked":""}"
                    title=${i?`Already placed on ${i} — remove it there first`:[e.deviceName,n].filter(e=>!!e).join(" · ")}
                    @click=${()=>{i||this.dispatchEvent(new CustomEvent("entity-armed",{detail:{entityId:e.primaryEntityId},bubbles:!0,composed:!0}))}}
                  >
                    <span class="avatar">
                      ${e.integrationDomain?V`<img
                              src="https://brands.home-assistant.io/_/${e.integrationDomain}/icon.png"
                              alt=""
                              @error=${e=>{const t=e.target;t.style.display="none",t.nextElementSibling?.classList.remove("hidden")}}
                            />`:X}
                      <ha-icon
                        icon=${"mdi:devices"}
                        class=${e.integrationDomain?"hidden":""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${e.deviceName}</span>
                      ${i?V`<span class="meta"
                              >Placed on ${i}</span
                            >`:n?V`<span class="meta">${n}</span>`:X}
                      ${t?V`<span class="meta">✓ placed</span>`:X}
                    </span>
                  </div>
                `})}
      </div>
    `}};Jt.styles=[ht,ut,r`
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
      .more-button {
        flex: none;
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        padding: 0;
        border-radius: 50%;
        color: var(--sc-fg-secondary);
      }
      .more-menu {
        position: absolute;
        right: 12px;
        z-index: 5;
        margin-top: 4px;
        min-width: 220px;
        padding: 6px;
      }
      .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 12px;
        border: 1px solid var(--sc-divider);
        border-radius: 22px;
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
        font-size: 14px;
        color: var(--sc-fg);
      }
      .filters {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      .filters .select-wrap {
        flex: 1;
      }
      .filters select {
        flex: 1;
        min-width: 0;
        height: 36px;
        padding: 0 12px;
        border: 1px solid var(--sc-divider);
        border-radius: 18px;
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
        background: color-mix(in srgb, var(--sc-accent) 18%, transparent);
        color: var(--sc-accent);
      }
      .item.armed .meta {
        color: var(--sc-fg-secondary);
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
    `],Jt.WIDTH_STORAGE_KEY="spatial-context.entityPickerSidebarWidth",Jt.MIN_WIDTH=240,Jt.MAX_WIDTH=600,e([_e()],Jt.prototype,"_menuOpen",void 0),e([ue({attribute:!1})],Jt.prototype,"entities",void 0),e([ue({attribute:!1})],Jt.prototype,"placedDeviceIds",void 0),e([ue({attribute:!1})],Jt.prototype,"armedEntityId",void 0),e([ue({attribute:!1})],Jt.prototype,"floors",void 0),e([ue({attribute:!1})],Jt.prototype,"areas",void 0),e([ue({attribute:!1})],Jt.prototype,"currentFloorId",void 0),e([ue({attribute:!1})],Jt.prototype,"linkedAreaIds",void 0),e([_e()],Jt.prototype,"_search",void 0),e([_e()],Jt.prototype,"_floorFilter",void 0),e([_e()],Jt.prototype,"_areaFilter",void 0),Jt=Zt=e([me("entity-picker-sidebar")],Jt);let Qt=class extends de{constructor(){super(...arguments),this.mode="select",this.mapActive=!1,this.mapRotation=0,this.selectedPinLabel=null,this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1,this.meshLegend=!1,this.selectedMeshLink=null,this.buildings=[],this.scaleReadout=null,this.scaleWarning=null,this.armedBuildingKey=null,this.selectedPlacement=null,this.floorNameById=new Map}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}_selectedLabel(){const e=this.selectedPlacement;return e?e.label_override||this.floorNameById.get(e.floor_id)||e.floor_id:""}_renderPinPanel(){return null===this.selectedPinLabel?X:V`
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
    `}_renderMapPanel(){if("map"!==this.mode)return X;const e=Math.round(10*this.mapRotation)/10,t=e=>this._fire("map-rotation-set",{deg:e});return V`
      <div class="selection-panel floating-panel">
        <span class="hint">${Wt("mapBackground.adjustHint")}</span>
        <button
          title=${Wt("mapBackground.zoomOut")}
          @click=${()=>this._fire("map-zoom-step",{factor:1/1.1})}
        >
          <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
        </button>
        <button
          title=${Wt("mapBackground.zoomIn")}
          @click=${()=>this._fire("map-zoom-step",{factor:1.1})}
        >
          <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
        </button>
        <span class="hint">${Wt("mapBackground.rotation")}</span>
        <input
          type="range"
          min="-180"
          max="180"
          step="0.5"
          .value=${String(e)}
          @input=${e=>t(Number(e.target.value))}
        />
        <input
          type="number"
          style="width: 4.5em"
          min="-180"
          max="180"
          step="0.5"
          .value=${String(e)}
          @change=${e=>{const i=Number(e.target.value);Number.isFinite(i)&&t(i)}}
        />°
        <button
          title=${Wt("mapBackground.resetRotation")}
          @click=${()=>t(0)}
        >
          <ha-icon icon="mdi:compass-outline"></ha-icon>
        </button>
        <button
          class="primary"
          @click=${()=>this._fire("property-mode-change",{mode:"select"})}
        >
          ${Wt("mapBackground.done")}
        </button>
      </div>
    `}_renderMeshLinkPanel(){const e=this.selectedMeshLink;if(!e)return X;const t=[e.from,e.to].find(e=>null!==e.floorId);return V`
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
              </button>`:X}
      </div>
    `}render(){return V`
      <div class="tool-row">
        <div class="mode-toolbar">
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
          ${this.mapActive?V`<button
                  class=${"map"===this.mode?"active":""}
                  title=${Wt("mapBackground.adjust")}
                  @click=${()=>this._fire("property-mode-change",{mode:"map"===this.mode?"select":"map"})}
                >
                  <ha-icon icon="mdi:map-search"></ha-icon>
                </button>`:X}
          <span class="tool-divider"></span>
          <span class="select-wrap"
            ><select
              class="place-picker"
              title="Place a building's footprint"
              .value=${this.armedBuildingKey??""}
              @change=${e=>{const t=e.target.value;t&&this._fire("placement-arm",{key:t})}}
            >
              <option value="">Place building…</option>
              ${this.buildings.map(e=>V`<option value=${e.key}>${e.name}</option>`)}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
        </div>

        <div
          class="scale-badge floating-panel"
          title=${this.scaleWarning??(this.scaleReadout?"Worked out from a placed building's floor scale":"Set Scale on a floor, then place its building here")}
        >
          ${this.scaleWarning?V`<ha-icon class="scale-warning" icon="mdi:alert"></ha-icon>`:X}
          ${this.scaleReadout??"Not calibrated"}
        </div>
        <row-actions
          .dirty=${this.dirty}
          .saving=${this.saving}
          .canUndo=${this.canUndo}
          .canRedo=${this.canRedo}
        ></row-actions>
      </div>

      ${this.meshLegend&&"map"!==this.mode?Kt():X}
      ${this._renderMapPanel()} ${this._renderPinPanel()}
      ${this._renderMeshLinkPanel()}
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
            `:X}
    `}};Qt.styles=[ht,ut,gt,Xt,r`
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
        gap: 4px;
        padding: 6px 10px;
        border-radius: 18px;
      }
      .tool-divider {
        align-self: stretch;
        width: 1px;
        margin: 6px 4px;
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
        border-radius: 18px;
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-family: inherit;
        font-size: 0.875rem;
        padding: 6px 14px;
      }
      .scale-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        max-width: 260px;
        border-radius: 16px;
        padding: 6px 14px;
        font-size: 0.8125rem;
        color: var(--sc-fg-secondary);
        pointer-events: auto;
      }
      .scale-warning {
        --mdc-icon-size: 16px;
        vertical-align: text-bottom;
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
    `],e([ue({attribute:!1})],Qt.prototype,"mode",void 0),e([ue({attribute:!1})],Qt.prototype,"mapActive",void 0),e([ue({attribute:!1})],Qt.prototype,"mapRotation",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedPinLabel",void 0),e([ue({type:Boolean})],Qt.prototype,"dirty",void 0),e([ue({type:Boolean})],Qt.prototype,"saving",void 0),e([ue({type:Boolean})],Qt.prototype,"canUndo",void 0),e([ue({type:Boolean})],Qt.prototype,"canRedo",void 0),e([ue({type:Boolean})],Qt.prototype,"meshLegend",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedMeshLink",void 0),e([ue({attribute:!1})],Qt.prototype,"buildings",void 0),e([ue({attribute:!1})],Qt.prototype,"scaleReadout",void 0),e([ue({attribute:!1})],Qt.prototype,"scaleWarning",void 0),e([ue({attribute:!1})],Qt.prototype,"armedBuildingKey",void 0),e([ue({attribute:!1})],Qt.prototype,"selectedPlacement",void 0),e([ue({attribute:!1})],Qt.prototype,"floorNameById",void 0),Qt=e([me("property-overlay")],Qt);const ei=new Set(["the","and","with","power","light","plug"]);let ti=null;function ii(e,t,i){const o=t.toLowerCase().split(/[\s:]+/).filter(Boolean);if(0===o.length)return[];const n=o.join("-"),s=[];for(const[t,i]of e){const e=o.filter(e=>t.includes(e)).length,r=o.filter(e=>t.includes(e)||i.includes(e)).length;if(0===r)continue;const a=t===n?0:t.startsWith(o[0])?1:e===o.length?2:3-e/o.length;s.push([4*(o.length-r)+a,t])}return s.sort((e,t)=>e[0]-t[0]||e[1].length-t[1].length||e[1].localeCompare(t[1])),s.slice(0,i).map(([,e])=>e)}let oi=class extends de{constructor(){super(...arguments),this.value=null,this.suggestFrom="",this._query="",this._index=null,this._error=null,this._onBackdropClick=()=>this._fire("icon-picker-cancel"),this._onKeyDown=e=>{if("Escape"===e.key)e.stopPropagation(),this._fire("icon-picker-cancel");else if("Enter"===e.key){const e=this._results[0];e&&this._fire("icon-picked",{icon:`mdi:${e}`})}}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this._onBackdropClick),(ti??(ti=fetch("/spatial_context/mdi-index.json?v=0.14.0-beta.1+mv2v51sq").then(e=>{if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}).catch(e=>{throw ti=null,e})),ti).then(e=>this._index=e,e=>this._error=e?.message??"couldn't load icons")}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this._onBackdropClick)}firstUpdated(e){this._input?.focus()}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}get _results(){const e=this._index;if(!e)return[];if(this._query.trim())return ii(e,this._query,160);const t=new Set;for(const i of this.suggestFrom.toLowerCase().split(/[^a-z0-9]+/))if(!(i.length<3||ei.has(i))){for(const o of ii(e,i,12))t.add(o);if(t.size>=60)break}return[...t]}render(){const e=this._results,t=this.value?.replace(/^mdi:/,"")??null;return V`
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
                  >`:X:V`<span class="hint">Loading icons…</span>`}
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
    `}};oi.styles=[ht,r`
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
    `],e([ue({attribute:!1})],oi.prototype,"value",void 0),e([ue({attribute:!1})],oi.prototype,"suggestFrom",void 0),e([_e()],oi.prototype,"_query",void 0),e([_e()],oi.prototype,"_index",void 0),e([_e()],oi.prototype,"_error",void 0),e([ge("input[type=search]")],oi.prototype,"_input",void 0),oi=e([me("icon-picker-dialog")],oi);let ni=class extends de{constructor(){super(...arguments),this.coordinatorChoices=[]}_change(e){this.dispatchEvent(new CustomEvent("settings-change",{detail:e,bubbles:!0,composed:!0}))}_switch(e,t,i){return V`<input
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
        ${i?V`<div class="description">${i}</div>`:X}
      </div>
      ${t}
    </div>`}render(){const e=this.settings,t=e.zigbee_coordinator_device_id,i=this.coordinatorChoices.some(e=>e.deviceId===t);return V`
      <div class="header">
        <button
          title="Close"
          @click=${()=>this.dispatchEvent(new CustomEvent("settings-close",{bubbles:!0,composed:!0}))}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
        <span>Settings</span>
      </div>
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
                  </option>`:X}
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

      <div class="section">
        <div class="section-title">About</div>
        ${this._row("Version",V`<span class="description">v${"0.14.0-beta.1"}</span>`)}
      </div>
    `}};var si;ni.styles=[ht,_t,r`
      :host {
        display: block;
        width: min(360px, calc(100vw - 32px));
        font-size: 0.875rem;
      }
      .header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 12px 4px 8px;
        font-size: 1.125rem;
      }
      .header button {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
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

      /* Two-option segmented control. */
      .segmented {
        display: inline-flex;
        border: 1px solid var(--sc-divider);
        border-radius: 18px;
        overflow: hidden;
      }
      .segmented button {
        padding: 6px 14px;
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
        background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
        color: var(--sc-accent);
      }

      select,
      input[type="number"] {
        font: inherit;
        font-size: 0.8rem;
        color: var(--sc-fg);
        background: var(--sc-bg);
        border: 1px solid var(--sc-divider);
        border-radius: 16px;
        padding: 6px 12px;
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
    `],e([ue({attribute:!1})],ni.prototype,"settings",void 0),e([ue({attribute:!1})],ni.prototype,"coordinatorChoices",void 0),ni=e([me("settings-menu")],ni);const ri="spatial-context-snap-mode";let ai=si=class extends de{constructor(){super(...arguments),this._floors=[],this._currentFloorId=null,this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._entities=[],this._areas=[],this._mode="select",this._snapMode=function(){try{const e=localStorage.getItem(ri);if("all"===e||"same"===e||"off"===e)return e}catch{}return"all"}(),this._dragOverCanvas=!1,this._armedEntityId=null,this._armedOpeningType=null,this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._otherFloorPinsByDeviceId=new Map,this._dirty=!1,this._saving=!1,this._loading=!0,this._pendingCount=0,this._networkType=null,this._zigbeeMesh=null,this._zigbeeMeshLoading=!1,this._zigbeeMeshError=null,this._zigbeeMeshFetchedAt=null,this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=null,this._zigbeeShowAllLinks=!1,this._wifiMesh=null,this._wifiMeshLoading=!1,this._wifiMeshError=null,this._matterTopology=null,this._matterError=null,this._matterUnsubscribe=null,this._bluetoothAdverts=new Map,this._bluetoothBuffer=new Map,this._bluetoothFlushTimer=null,this._bluetoothDevices={},this._bluetoothError=null,this._bluetoothUnsubscribe=null,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settings={unit_system:"metric",zigbee_timeout_seconds:180,floor_order:"top_down",zigbee_coordinator_device_id:null,auto_save:!0,debug_logging:!1},this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1,this._view="floor",this._placementGhosts=new Map,this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!1,this._saveError=null,this._iconPickerFor=null,this._versionNotice=null,this._autoSaveTimer=null,this._autoSaveHeld=!1,this._floorHistory=new ke,this._propertyHistory=new ke,this._propertyDragStart=null,this._propertySaving=!1,this._selectedPlacementId=null,this._propertyMode="select",this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._armedBuildingKey=null,this._sameBuildingAsPreviousFloor=!1,this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._initialized=!1,this._onFloorSelected=e=>{this._selectFloor(e.detail.floorId)},this._onPropertySelected=()=>{this._selectProperty()},this._onToggleMapBackground=()=>{const e=this._hass?.config;this._propertyLayout.map_background?("map"===this._propertyMode&&(this._propertyMode="select"),this._updatePropertyLayout({map_background:null})):void 0!==e?.latitude&&void 0!==e.longitude&&this._updatePropertyLayout({map_background:{lat:e.latitude,lon:e.longitude,zoom:18,opacity:1,style:"street"}})},this._onMapAdjust=e=>{const t=e.detail;this._adjustMap(e=>{switch(t.op){case"pan":return At(e,t.dx,t.dy);case"zoom":return Ft(e,t.factor,t.at);case"rotate":return Dt(e,(e.rotation_deg??0)+t.deltaDeg,t.at);case"pinch":{const i=Ft(At(e,t.dx,t.dy),t.factor,t.at);return Dt(i,(i.rotation_deg??0)+t.rotateDeg,t.at)}}})},this._onMapRotationSet=e=>{const t=this._propertyCanvas?.getViewCenter()??{x:0,y:0};this._adjustMap(i=>Dt(i,e.detail.deg,t))},this._onMapZoomStep=e=>{const t=this._propertyCanvas?.getViewCenter()??{x:0,y:0};this._adjustMap(i=>Ft(i,e.detail.factor,t))},this._onMapStyleChange=e=>{const t=this._propertyLayout.map_background;t&&this._updatePropertyLayout({map_background:{...t,style:e.target.value}})},this._onMapOpacityChange=e=>{const t=this._propertyLayout.map_background;t&&this._updatePropertyLayout({map_background:{...t,opacity:Number(e.target.value)}})},this._onUndo=()=>this._undoRedo("undo"),this._onRedo=()=>this._undoRedo("redo"),this._onPropertyModeChange=e=>{this._propertyMode=e.detail.mode,this._armedBuildingKey=null,this._armedEntityId=null,this._selectedPlacementId=null},this._onOutdoorPinPlace=e=>{if(!this._armedEntityId)return;const t=this._entityLookup.get(this._armedEntityId),i=Te(t?.device_id??null,e.detail.x,e.detail.y,null);this._updatePropertyLayout({pins:[...this._propertyLayout.pins,i]}),this._armedEntityId=null,this._selectedOutdoorPinId=i.id,this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null},this._onOutdoorPinMove=e=>{this._patchOutdoorPin(e.detail.id,{x:e.detail.x,y:e.detail.y})},this._onOutdoorPinSelect=e=>{this._selectedOutdoorPinId=e.detail.id,null!==e.detail.id&&(this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null)},this._onOutdoorPinRename=()=>{const e=this._selectedOutdoorPin;if(!e)return;const t=window.prompt("Label (blank to clear override):",this._pinLabel(e));null!==t&&this._patchOutdoorPin(e.id,{label_override:t||null})},this._onOutdoorPinIcon=()=>{const e=this._selectedOutdoorPin;e&&(this._iconPickerFor={kind:"outdoor",pinId:e.id})},this._onOutdoorPinDelete=()=>{const e=this._selectedOutdoorPin;e&&window.confirm(`Remove "${this._pinLabel(e)}" from the property?`)&&(this._updatePropertyLayout({pins:this._propertyLayout.pins.filter(t=>t.id!==e.id)}),this._selectedOutdoorPinId=null)},this._onPropertyMeshLinkSelect=e=>{this._selectedPropertyMeshLinkKey=e.detail.key,null!==e.detail.key&&(this._selectedOutdoorPinId=null,this._selectedPlacementId=null)},this._onClearAllOutdoorPins=()=>{const e=this._propertyLayout.pins.length;0!==e&&window.confirm(`Remove all ${e} outdoor device${1===e?"":"s"} from the property?`)&&(this._autoSaveHeld=!0,this._updatePropertyLayout({pins:[]}),this._selectedOutdoorPinId=null)},this._onPropertyMeshGotoFloor=e=>{this._selectFloor(e.detail.floorId)},this._onPlacementArm=e=>{this._armedBuildingKey=e.detail.key,this._propertyMode="place",this._selectedPlacementId=null},this._onPlacementPlace=e=>{if(!this._armedBuildingKey)return;const t=this._buildings.find(e=>e.key===this._armedBuildingKey);if(!t)return;const i=function(e,t,i,o,n,s){const r=n>=1?Re:Re*n,a=n>=1?Re/n:Re;return{id:Le("placement"),building_id:t,floor_id:e,label_override:null,x:i,y:o,width:r,height:a,rotation_deg:0,aspect_ratio:n,source_bounds:s}}(t.floorId,t.buildingId,e.detail.x,e.detail.y,t.aspectRatio,this._buildingBounds(this._floors.filter(e=>(e.building_id??e.floor_id)===t.key)));this._updatePropertyLayout({placements:[...this._propertyLayout.placements,i]}),this._armedBuildingKey=null,this._propertyMode="select",this._selectedPlacementId=i.id},this._onPlacementMove=e=>{const t=this._propertyLayout.placements.find(t=>t.id===e.detail.id);t&&this._patchPlacement(e.detail.id,{x:t.x+e.detail.dx,y:t.y+e.detail.dy})},this._onPlacementResize=e=>{this._patchPlacement(e.detail.id,{width:e.detail.width,height:e.detail.height,x:e.detail.x,y:e.detail.y})},this._onPlacementRotate=e=>{this._patchPlacement(e.detail.id,{rotation_deg:e.detail.rotationDeg})},this._onPlacementSelect=e=>{this._selectedPlacementId=e.detail.id,null!==e.detail.id&&(this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null)},this._onPlacementRenameClick=()=>{const e=this._selectedPlacement;if(!e)return;const t=e.label_override??this._floorNameById.get(e.floor_id)??e.floor_id,i=window.prompt("Label (blank to clear override):",t);null!==i&&this._patchPlacement(e.id,{label_override:i||null})},this._onPlacementDeleteClick=()=>{const e=this._selectedPlacement;if(!e)return;const t=e.label_override??this._floorNameById.get(e.floor_id)??e.floor_id;window.confirm(`Delete the "${t}" placement?`)&&(this._updatePropertyLayout({placements:this._propertyLayout.placements.filter(t=>t.id!==e.id)}),this._selectedPlacementId=null)},this._onPlacementGotoFloorClick=()=>{const e=this._selectedPlacement;e&&this._selectFloor(e.floor_id)},this._onModeChange=e=>{this._mode=this._mode===e.detail.mode?"select":e.detail.mode,this._armedEntityId=null,this._armedOpeningType=null,"select"!==this._mode&&(this._editingRoomId=null,this._editingWallId=null),"align"!==this._mode&&this._resetAlignState()},this._onAddOpeningClick=e=>{this._mode="opening",this._armedOpeningType=e.detail.openingType,this._editingRoomId=null,this._editingWallId=null},this._onSaveClick=()=>{this._autoSaveHeld=!1;("property"===this._view?this._saveProperty():this._save()).catch(()=>{})},this._placementKeyForEntities=null,this._onVisibilityChange=()=>{"visible"===document.visibilityState&&this._checkVersion()},this._onBeforeUnload=e=>{(this._dirty||this._propertyDirty)&&(this._flushAutoSave(),e.preventDefault(),e.returnValue="")},this._onExportClick=()=>{this._export()},this._onResetClick=()=>{if("property"===this._view){if(!window.confirm("Reset the property view? This clears every building placement, every outdoor device and the background photo. Nothing is permanent until you hit Save afterward."))return;return this._autoSaveHeld=!0,this._propertyHistory.record(this._propertyLayout),this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const e=this._floors.find(e=>e.floor_id===this._currentFloorId)?.name??"this floor";window.confirm(`Reset "${e}"? This clears every room, wall, opening, placed device, and the background image on this floor. Nothing is permanent until you hit Save afterward.`)&&(this._autoSaveHeld=!0,this._floorHistory.record(this._layout),this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)},this._onToggleBackgroundPopover=()=>{this._backgroundPopoverOpen=!this._backgroundPopoverOpen,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMeshPopover=()=>{this._meshPopoverOpen=!this._meshPopoverOpen,this._backgroundPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleSettingsPopover=()=>{this._settingsPopoverOpen=!this._settingsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMoreOptionsPopover=()=>{this._moreOptionsPopoverOpen=!this._moreOptionsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1},this._onSettingsChange=e=>{const t=e.detail;this._settings={...this._settings,...t};const i=this._client.saveSettings(this._settings);if("auto_save"in t&&this._scheduleAutoSave(),"zigbee_coordinator_device_id"in t&&(this._selectedMeshLink=null,this._selectedMeshStub=null),"debug_logging"in t){const e=!!t.debug_logging;i.then(()=>{$e.configure(this._client,e),$e.log("debug_logging_on",{panel_version:"0.14.0-beta.1",panel_build:"0.14.0-beta.1+mv2v51sq",user_agent:navigator.userAgent})})}},this._onNetworkTypeSelect=e=>{const t=this._networkType===e?null:e;"matter"===this._networkType&&"matter"!==t&&this._unsubscribeMatter(),"bluetooth"===this._networkType&&"bluetooth"!==t&&this._unsubscribeBluetooth(),this._networkType=t,this._selectedMeshLink=null,this._selectedMeshStub=null,"wifi"===t?this._refreshWifiMesh():"matter"===t?this._subscribeMatter():"bluetooth"===t?this._subscribeBluetooth():"zigbee"===t&&this._loadCachedZigbeeMesh()},this._onLoadMesh=()=>{this._refreshZigbeeMesh(null!==this._zigbeeMeshFetchedAt)},this._onKeyDown=e=>{if(this._isTypingTarget())return;if(this._iconPickerFor)return;if("Escape"===e.key){if(e.preventDefault(),"floor"===this._view&&this._canvas?.cancelGesture())return;return"property"===this._view&&this._propertyCanvas?.cancelGesture()?void(this._propertyDragStart&&(this._propertyHistory.discardIfLast(this._propertyDragStart),this._propertyLayout=this._propertyDragStart,this._propertyDragStart=null)):(this._onCancelPending(),this._mode="select",this._armedEntityId=null,this._armedOpeningType=null,this._armedBuildingKey=null,void(this._propertyMode="select"))}const t=e.ctrlKey||e.metaKey,i=e.key.toLowerCase(),o=t&&!e.shiftKey&&"z"===i,n=t&&(e.shiftKey&&"z"===i||"y"===i);if(!o&&"Backspace"!==e.key||!this._canvas?.undoLastPoint())return o||n?(e.preventDefault(),void this._undoRedo(o?"undo":"redo")):"Delete"===e.key||"Backspace"===e.key?"property"===this._view?((this._selectedOutdoorPin||this._selectedPlacement)&&e.preventDefault(),void(this._selectedOutdoorPin?this._onOutdoorPinDelete():this._selectedPlacement&&this._onPlacementDeleteClick())):((this._selectedRoom||this._selectedPin||this._selectedWall||this._selectedOpening)&&e.preventDefault(),void(this._selectedRoom?this._onRoomDelete():this._selectedPin?this._onPinDelete():this._selectedWall?this._onWallDelete():this._selectedOpening&&this._onOpeningDelete())):void("Enter"===e.key&&"wall"===this._mode&&(e.preventDefault(),this._onFinishWall()));e.preventDefault()},this._onFileInputChange=async e=>{const t=e.target,i=t.files?.[0];t.value="",i&&this._handleBackgroundFile(i)},this._onCanvasDragOver=e=>{e.dataTransfer?.types.includes("Files")&&(e.preventDefault(),this._dragOverCanvas=!0)},this._onCanvasDragLeave=()=>{this._dragOverCanvas=!1},this._onCanvasDrop=e=>{if(!e.dataTransfer?.types.includes("Files"))return;e.preventDefault(),this._dragOverCanvas=!1;const t=e.dataTransfer.files?.[0];t&&this._handleBackgroundFile(t)},this._onRemoveBackgroundClick=()=>{"property"===this._view?this._updatePropertyLayout({background_image_id:null}):this._updateLayout({background_image_id:null})},this._onOpacityChange=e=>{const t=Number(e.target.value);"property"===this._view?this._updatePropertyLayout({background_opacity:t}):this._updateLayout({background_opacity:t})},this._onCancelPending=()=>this._canvas?.cancelPending(),this._onFinishWall=()=>this._canvas?.finishPendingWall(),this._onAlignTargetChange=async e=>{const t=e.detail.floorId;t?(this._alignTargetFloorId=t,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._alignTargetLayout=await this._client.getLayout(t)):this._resetAlignState()},this._onAlignDrag=e=>{this._alignOffsetX+=e.detail.dx,this._alignOffsetY+=e.detail.dy},this._onAlignScaleClick=e=>{const{factor:t}=e.detail,i=this._canvas?.getViewBox();if(i){const e=i.x+i.w/2,o=i.y+i.h/2;this._alignOffsetX=t*this._alignOffsetX+(1-t)*e,this._alignOffsetY=t*this._alignOffsetY+(1-t)*o}this._alignScale*=t},this._onAlignCancel=()=>{this._mode="select",this._resetAlignState()},this._onAlignApply=async()=>{if(!this._alignTargetFloorId||!this._alignTargetLayout)return;const e=this._alignTargetFloorId,t=this._floors.find(t=>t.floor_id===e)?.name??"that floor";if(!window.confirm(`Apply this alignment to "${t}"? This rewrites every room, wall, door/window, and placed device position on that floor — plus its background image's placement and, if this floor has one set, its scale calibration too — to match this floor's coordinate system. This saves immediately and cannot be undone.`))return;const i=this._alignScale,o=this._alignOffsetX,n=this._alignOffsetY,s=([e,t])=>[e*i+o,t*i+n],r=this._alignTargetLayout,a=this._layout.building_id??Le("building"),l={background_image_id:r.background_image_id,background_opacity:r.background_opacity,background_offset_x:r.background_offset_x*i+o,background_offset_y:r.background_offset_y*i+n,background_scale:r.background_scale*i,building_id:a,view_box:r.view_box?(()=>{const[e,t]=s([r.view_box.x,r.view_box.y]);return{x:e,y:t,w:r.view_box.w*i,h:r.view_box.h*i}})():null,rooms:r.rooms.map(e=>({...e,points:e.points.map(s)})),walls:r.walls.map(e=>({...e,points:e.points.map(s)})),pins:r.pins.map(e=>{const[t,i]=s([e.x,e.y]);return{...e,x:t,y:i}}),openings:r.openings.map(e=>{const[t,o]=s([e.x,e.y]);return{...e,x:t,y:o,width:e.width*i}}),scale:this._layout.scale??(r.scale?{points:[s(r.scale.points[0]),s(r.scale.points[1])],meters:r.scale.meters}:null)};await this._client.saveLayout(e,l),this._layout.building_id!==a&&(await this._client.setBuildingId(this._currentFloorId,a),this._layout={...this._layout,building_id:a}),this._floors=await this._client.listFloors(),this._mode="select",this._resetAlignState(),this._floorHistory.clear()},this._onRoomRename=()=>{const e=this._selectedRoom;if(!e)return;const t=window.prompt("Room name:",e.name);t&&this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===e.id?{...i,name:t}:i)})},this._onRoomAreaChange=e=>{const t=this._selectedRoom;if(!t)return;const i=e.detail.areaId||null,o=this._areas.find(e=>e.area_id===i);this._updateLayout({rooms:this._layout.rooms.map(e=>e.id===t.id?{...e,area_id:i,name:o?o.name:e.name}:e)})},this._onRoomMove=e=>{const{roomId:t,dx:i,dy:o}=e.detail;$e.log("room_move",{room_id:t,dx:Math.round(i),dy:Math.round(o)});const n=([e,t])=>[e+i,t+o],s=this._layout.rooms.map(e=>e.id===t?{...e,points:e.points.map(n),...e.label_position?{label_position:n(e.label_position)}:{}}:e),r=this._layout.pins.map(e=>e.room_id===t?{...e,x:e.x+i,y:e.y+o}:e);this._updateLayout({rooms:s,pins:Ne(s,r)})},this._onRoomLabelMoved=e=>{this._patchRoom(e.detail.roomId,{label_position:[e.detail.x,e.detail.y]})},this._onRoomLabelReset=()=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{label_position:null})},this._onRoomVisibleToggle=()=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{visible:!1===e.visible})},this._onRoomFillColorChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{fill_color:e.detail.color})},this._onRoomFillOpacityChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{fill_opacity:e.detail.opacity})},this._onRoomBorderOpacityChange=e=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{border_opacity:e.detail.opacity})},this._onRoomEditVertices=()=>{this._selectedRoomId&&(this._editingRoomId=this._editingRoomId===this._selectedRoomId?null:this._selectedRoomId)},this._onRoomDelete=()=>{const e=this._selectedRoom;if(!e||!window.confirm(`Delete room "${e.name}"?`))return;const t=this._layout.rooms.filter(t=>t.id!==e.id);this._updateLayout({rooms:t,pins:Ne(t,this._layout.pins)}),this._selectedRoomId=null,this._editingRoomId=null},this._onPinSetLabel=()=>{const e=this._selectedPin;if(!e)return;const t=window.prompt("Label override (blank to clear):",e.label_override??"");null!==t&&this._patchPin(e.id,{label_override:t||null})},this._onPinSetIcon=()=>{const e=this._selectedPin;e&&(this._iconPickerFor={kind:"floor",pinId:e.id})},this._onIconPicked=e=>{const t=this._iconPickerFor;if(this._iconPickerFor=null,!t)return;const i={icon_override:e.detail.icon};"floor"===t.kind?this._patchPin(t.pinId,i):this._patchOutdoorPin(t.pinId,i)},this._onIconPickerCancel=()=>{this._iconPickerFor=null},this._onPinSetHeight=()=>{const e=this._selectedPin;if(!e)return;const t=this._settings.unit_system,i="imperial"===t?"feet":"metres",o="imperial"===t?"6":"1.8",n=window.prompt(`Mounting height in ${i} above floor level (e.g. ${o} for a high wall mount; blank to clear):`,null===e.height_m?"":ot(e.height_m,t));if(null===n)return;const s=""===n.trim()?null:nt(n,t);this._patchPin(e.id,{height_m:null!==s&&Number.isFinite(s)?s:null})},this._onPinDelete=()=>{const e=this._selectedPin;e&&window.confirm(`Delete pin for ${this._pinLabel(e)}?`)&&(this._updateLayout({pins:this._layout.pins.filter(t=>t.id!==e.id)}),this._selectedPinId=null)},this._onWallMaterialChange=e=>{const t=this._selectedWall;t&&this._updateLayout({walls:this._layout.walls.map(i=>i.id===t.id?{...i,material:e.detail.material}:i)})},this._onWallThicknessChange=e=>{const t=this._selectedWall;t&&(!Number.isFinite(e.detail.thicknessCm)||e.detail.thicknessCm<=0||this._updateLayout({walls:this._layout.walls.map(i=>i.id===t.id?{...i,thickness_cm:e.detail.thicknessCm}:i)}))},this._onWallEditVertices=()=>{this._selectedWallId&&(this._editingWallId=this._editingWallId===this._selectedWallId?null:this._selectedWallId)},this._onWallDelete=()=>{const e=this._selectedWall;e&&window.confirm("Delete this wall? Any doors/windows on it will be removed too.")&&(this._updateLayout({walls:this._layout.walls.filter(t=>t.id!==e.id),openings:this._layout.openings.filter(t=>t.wallId!==e.id)}),this._selectedWallId=null,this._editingWallId=null)},this._onOpeningWidthChange=e=>{const t=this._selectedOpening;if(!t)return;const i=e.detail.width;this._updateLayout({openings:this._layout.openings.map(e=>e.id===t.id?{...e,width:i}:e)})},this._onOpeningDelete=()=>{const e=this._selectedOpening;e&&window.confirm(`Delete this ${e.type}?`)&&(this._updateLayout({openings:this._layout.openings.filter(t=>t.id!==e.id)}),this._selectedOpeningId=null)},this._onEntityArmed=e=>{this._armedEntityId=this._armedEntityId===e.detail.entityId?null:e.detail.entityId},this._onClearAllPins=()=>{const e=this._layout.pins.length;0!==e&&window.confirm(`Remove all ${e} placed device${1===e?"":"s"} from this floor?`)&&(this._autoSaveHeld=!0,this._updateLayout({pins:[]}),this._selectedPinId=null,this._pinStackIds=null)},this._onRoomTraceComplete=e=>{const t=(i="New Room",o=e.detail.points,n=null,{id:Le("room"),name:i,area_id:n,points:o});var i,o,n;const s=[...this._layout.rooms,t];this._updateLayout({rooms:s,pins:Ne(s,this._layout.pins)}),this._selectedRoomId=t.id},this._onRoomVertexChanged=e=>{const t=this._layout.rooms.map(t=>{if(t.id!==e.detail.roomId)return t;const i=t.label_position,o=!i||We(i[0],i[1],e.detail.points);return{...t,points:e.detail.points,...o?{}:{label_position:null}}});this._updateLayout({rooms:t,pins:Ne(t,this._layout.pins)})},this._onRoomSelect=e=>{this._selectedRoomId=e.detail.roomId,null===e.detail.roomId?this._editingRoomId=null:(this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onWallTraceComplete=e=>{this._updateLayout({walls:[...this._layout.walls,Oe(e.detail.points)]})},this._onWallVertexChanged=e=>{this._updateLayout({walls:this._layout.walls.map(t=>t.id===e.detail.wallId?{...t,points:e.detail.points}:t)})},this._onWallSelect=e=>{this._selectedWallId=e.detail.wallId,null===e.detail.wallId?this._editingWallId=null:(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningPlace=e=>{if(!this._armedOpeningType)return;const t=function(e,t,i,o,n){return{id:Le("opening"),wallId:e,type:t,x:i,y:o,width:n}}(e.detail.wallId,this._armedOpeningType,e.detail.x,e.detail.y,this._defaultOpeningWidth());this._updateLayout({openings:[...this._layout.openings,t]})},this._onOpeningSelect=e=>{this._selectedOpeningId=e.detail.openingId,null!==e.detail.openingId&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningUpdate=e=>{this._updateLayout({openings:this._layout.openings.map(t=>t.id===e.detail.openingId?{...t,x:e.detail.x,y:e.detail.y,width:e.detail.width}:t)})},this._onPinPlace=e=>{if(!this._armedEntityId)return;const t=Ue(e.detail.x,e.detail.y,this._layout.rooms),i=this._entityLookup.get(this._armedEntityId),o=Te(i?.device_id??null,e.detail.x,e.detail.y,t),n=this._layout.pins.filter(t=>t.x===e.detail.x&&t.y===e.detail.y);this._updateLayout({pins:[...this._layout.pins,o]}),this._armedEntityId=null,n.length>0?(this._pinStackIds=[...n.map(e=>e.id),o.id],this._selectedPinId=null):(this._pinStackIds=null,this._selectedPinId=o.id,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinMove=e=>{const t=Ue(e.detail.x,e.detail.y,this._layout.rooms);this._patchPin(e.detail.pinId,{x:e.detail.x,y:e.detail.y,room_id:t})},this._onPinSelect=e=>{this._selectedPinId=e.detail.pinId,this._pinStackIds=null,null!==e.detail.pinId&&(this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinStackSelect=e=>{this._pinStackIds=e.detail.pinIds,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedPinId=null,this._selectedMeshLink=null,this._selectedMeshStub=null},this._onMeshLinkSelect=e=>{this._selectedMeshLink=e.detail.link,null!==e.detail.link&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshStub=null)},this._onMeshStubSelect=e=>{this._selectedMeshStub=e.detail.stub,null!==e.detail.stub&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null)},this._onMeshStubGotoFloorClick=()=>{const e=this._selectedMeshStub;e&&(e.targetFloorId===ye?this._selectProperty():this._selectFloor(e.targetFloorId))},this._onPinStackChoose=e=>{this._pinStackIds=null,this._selectedPinId=e.detail.pinId},this._onSelectionClear=()=>{this._resetSelection(),this._pinStackIds=null},this._onPinStackDismiss=()=>{this._pinStackIds=null},this._onPinStackRemove=e=>{const t=this._layout.pins.find(t=>t.id===e.detail.pinId);if(!t)return;if(!window.confirm(`Remove ${this._pinLabel(t)} from this spot?`))return;this._updateLayout({pins:this._layout.pins.filter(t=>t.id!==e.detail.pinId)});const i=(this._pinStackIds??[]).filter(t=>t!==e.detail.pinId);this._pinStackIds=i.length>1?i:null,this._selectedPinId=1===i.length?i[0]:null},this._onScaleLineComplete=e=>{const t=this._settings.unit_system,i="imperial"===t?"feet":"metres",o=window.prompt(`Real-world distance between these two points, in ${i}:`),n=o?nt(o,t):null;if(null===n||!Number.isFinite(n)||n<=0)return;const s=e.detail.points;this._updateLayout({scale:{points:s,meters:n}}),this._mode="select"},this._onPendingChanged=e=>{this._pendingCount=e.detail.count},this._onSnapModeChange=e=>{this._snapMode=e.detail.snapMode;try{localStorage.setItem(ri,this._snapMode)}catch{}}}set hass(e){this._hass=e,this._initialized||(this._initialized=!0,this._init())}get hass(){return this._hass}get _client(){return new Ce(this._hass)}get _entityLookup(){return new Map(this._entities.map(e=>[e.entity_id,e]))}get _placedDeviceIds(){return new Set(("property"===this._view?this._propertyLayout.pins:this._layout.pins).map(e=>e.device_id).filter(e=>null!==e))}get _selectedRoom(){return this._layout.rooms.find(e=>e.id===this._selectedRoomId)??null}get _areasForCurrentFloor(){return this._areas.filter(e=>e.floor_id===this._currentFloorId||null===e.floor_id)}get _outdoorAreaIdsOnCurrentFloor(){const e=new Set(this._areas.filter(e=>null===e.floor_id).map(e=>e.area_id));return new Set(this._layout.rooms.map(e=>e.area_id).filter(t=>null!==t&&e.has(t)))}get _otherFloors(){return this._floors.filter(e=>e.floor_id!==this._currentFloorId)}get _buildings(){const e=new Map;for(const t of this._floors){const i=t.building_id??t.floor_id,o=e.get(i);o?o.push(t):e.set(i,[t])}return[...e.entries()].map(([e,t])=>{const i=t[0];return{key:e,name:t.length>1?t.map(e=>e.name).join(" + "):i.name,icon:i.icon||"mdi:home-city",floorId:i.floor_id,buildingId:i.building_id,aspectRatio:this._buildingAspectRatio(t)}})}_buildingAspectRatio(e){const t=this._buildingBounds(e),i=t?t.max_x-t.min_x:0,o=t?t.max_y-t.min_y:0;return i>0&&o>0?i/o:1.375}_buildingBounds(e){const t=e.map(e=>e.content_bounds).filter(e=>null!==e);return 0===t.length?null:{min_x:Math.min(...t.map(e=>e.min_x)),min_y:Math.min(...t.map(e=>e.min_y)),max_x:Math.max(...t.map(e=>e.max_x)),max_y:Math.max(...t.map(e=>e.max_y))}}get _floorNameById(){return new Map(this._floors.map(e=>[e.floor_id,e.name]))}get _floorIconById(){return new Map(this._floors.map(e=>[e.floor_id,e.icon||"mdi:floor-plan"]))}get _livePlacements(){const e=[];for(const t of this._propertyLayout.placements){if(this._floors.some(e=>e.floor_id===t.floor_id)){e.push(t);continue}const i=null!==t.building_id?this._floors.find(e=>e.building_id===t.building_id):void 0;i&&e.push({...t,floor_id:i.floor_id})}return e}get _selectedPlacement(){return this._livePlacements.find(e=>e.id===this._selectedPlacementId)??null}get _activeBackground(){return"property"===this._view?{imageId:this._propertyLayout.background_image_id,opacity:this._propertyLayout.background_opacity}:{imageId:this._layout.background_image_id,opacity:this._layout.background_opacity}}get _alignOverlay(){if("align"!==this._mode||!this._alignTargetLayout)return null;const e=Ee(this._alignTargetLayout.background_image_id);if(!e)return null;const t=this._alignTargetLayout;return{imageUrl:e,offsetX:this._alignScale*t.background_offset_x+this._alignOffsetX,offsetY:this._alignScale*t.background_offset_y+this._alignOffsetY,scale:this._alignScale*t.background_scale,opacity:.55}}get _orderedFloors(){if("ground_up"!==this._settings.floor_order)return this._floors;const e=this._floors.filter(e=>null!==e.level),t=this._floors.filter(e=>null===e.level);return[...e.reverse(),...t]}get _placedDeviceChoices(){const e=e=>e.label_override??we(e.device_id,this._entityLookup.values()),t=new Map;for(const i of this._layout.pins)i.device_id&&t.set(i.device_id,e(i));for(const[i,{pin:o}]of this._otherFloorPinsByDeviceId)t.has(i)||t.set(i,e(o));return[...t].map(([e,t])=>({deviceId:e,label:t})).sort((e,t)=>e.label.localeCompare(t.label))}get _pinByDeviceId(){const e=new Map;for(const t of this._layout.pins)t.device_id&&e.set(t.device_id,t);return e}get _normalizedMeshLinks(){if(null===this._networkType)return[];if("zigbee"===this._networkType&&this._zigbeeMesh){const e=this._pinByDeviceId,t=this._outdoorPinByDeviceId,i=i=>e.has(i)?this._currentFloorId??void 0:t.has(i)?ye:this._otherFloorPinsByDeviceId.get(i)?.floorId;return function(e,t,i){const o=e.links.filter(e=>e.source_device_id&&e.target_device_id&&void 0!==t(e.source_device_id)&&void 0!==t(e.target_device_id));if(i)return o;const n=e.nodes.find(e=>"Coordinator"===e.type)?.ieee,s=new Set,r=new Map,a=new Map;for(const e of o){e.parent_child&&s.add(e),(e.source_ieee===n||e.target_ieee===n)&&e.lqi>=50&&s.add(e);const i=t(e.source_device_id)!==t(e.target_device_id)?a:r;for(const t of[e.source_ieee,e.target_ieee]){const o=i.get(t);(!o||e.lqi>o.lqi)&&i.set(t,e)}}for(const e of r.values())s.add(e);for(const e of a.values())s.add(e);return[...s]}(function(e,t){const i=e.nodes.find(e=>"Coordinator"===e.type)?.ieee;return t&&i?{...e,nodes:e.nodes.map(e=>e.ieee===i?{...e,device_id:t}:e),links:e.links.map(e=>({...e,source_device_id:e.source_ieee===i?t:e.source_device_id,target_device_id:e.target_ieee===i?t:e.target_device_id}))}:e}(this._zigbeeMesh,this._settings.zigbee_coordinator_device_id),i,this._zigbeeShowAllLinks).map(e=>{return{sourceDeviceId:e.source_device_id,targetDeviceId:e.target_device_id,quality:(t=e.lqi,t>=150?"strong":t>=80?"medium":"weak"),detail:e.lqi_readings.every(t=>t===e.lqi)?`LQI ${e.lqi}`:`LQI ${e.lqi} (raw ${e.lqi_readings.join(" / ")})`};var t})}if("wifi"===this._networkType&&this._wifiMesh)return this._wifiMesh.links.map(e=>{return{sourceDeviceId:e.source_device_id,targetDeviceId:e.target_device_id,quality:null!=e.rssi_dbm?(t=e.rssi_dbm,t>=-50?"strong":t>=-70?"medium":"weak"):"unknown",...null!=e.rssi_dbm?{detail:`${e.rssi_dbm} dBm`}:{}};var t});if("bluetooth"===this._networkType){const e=[];for(const t of this._bluetoothAdverts.values()){const i=this._bluetoothDevices[t.address]??[],o=this._bluetoothDevices[t.source]??[];for(const n of i)for(const i of o)n!==i&&e.push({sourceDeviceId:n,targetDeviceId:i,quality:null!=t.rssi?fe(t.rssi):"unknown",...null!=t.rssi?{detail:`RSSI ${t.rssi} dBm`}:{}})}return e}if("matter"===this._networkType&&this._matterTopology){const e=new Map;for(const t of this._matterTopology.nodes)t.ha_device_id&&e.set(t.id,t.ha_device_id);const t=[];for(const i of this._matterTopology.connections){const o=e.get(i.source),n=e.get(i.target);o&&n&&t.push({sourceDeviceId:o,targetDeviceId:n,quality:i.strength,detail:i.strength})}return t}return[]}get _outdoorPinByDeviceId(){const e=new Map;for(const t of this._propertyLayout.pins)t.device_id&&e.set(t.device_id,t);return e}_propertyEnd(e){const t=this._outdoorPinByDeviceId.get(e);if(t)return{deviceId:e,x:t.x,y:t.y,label:this._pinLabel(t),floorId:null};const i=this._pinByDeviceId.get(e),o=i?{pin:i,floorId:this._currentFloorId}:this._otherFloorPinsByDeviceId.get(e);if(!o?.floorId)return null;const n=this._placementForFloor(o.floorId),s=n?function(e,t,i){const o=e.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y)return null;const n=((t-o.min_x)/(o.max_x-o.min_x)-.5)*e.width,s=((i-o.min_y)/(o.max_y-o.min_y)-.5)*e.height,r=e.rotation_deg*Math.PI/180,a=Math.cos(r),l=Math.sin(r);return{x:e.x+a*n-l*s,y:e.y+l*n+a*s}}(n,o.pin.x,o.pin.y):null;return s?{deviceId:e,...s,label:this._pinLabel(o.pin),floorId:o.floorId}:null}get _propertyMeshLinks(){const e=this._outdoorPinByDeviceId,t=[];for(const i of this._normalizedMeshLinks){if(!e.has(i.sourceDeviceId)&&!e.has(i.targetDeviceId))continue;const o=this._propertyEnd(i.sourceDeviceId),n=this._propertyEnd(i.targetDeviceId);o&&n&&t.push({key:`${i.sourceDeviceId}|${i.targetDeviceId}`,from:o,to:n,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return t}get _selectedPropertyMeshLink(){return this._propertyMeshLinks.find(e=>e.key===this._selectedPropertyMeshLinkKey)??null}get _meshLinksForCurrentFloor(){const e=this._pinByDeviceId,t=[];for(const i of this._normalizedMeshLinks){const o=e.get(i.sourceDeviceId),n=e.get(i.targetDeviceId);o&&n&&t.push({fromPin:o,toPin:n,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return t}_placementForFloor(e){const t=this._floors.find(t=>t.floor_id===e);return t?this._propertyLayout.placements.find(i=>null!==t.building_id?i.building_id===t.building_id:i.floor_id===e)??null:null}_currentFloorContentBounds(){const e=[];for(const t of this._layout.rooms)e.push(...t.points);for(const t of this._layout.walls)e.push(...t.points);if(0===e.length)return null;const t=e.map(([e])=>e),i=e.map(([,e])=>e),o=Math.min(...t),n=Math.max(...t),s=Math.min(...i),r=Math.max(...i),a=.05*Math.max(n-o,r-s)||20;return{minX:o-a,minY:s-a,maxX:n+a,maxY:r+a}}_projectStubTowardBuilding(e,t){if(!this._currentFloorId)return null;const i=this._placementForFloor(this._currentFloorId),o=this._placementForFloor(t);if(!i||!o)return null;const n=this._currentFloorContentBounds();if(!n)return null;const s=Math.atan2(o.y-i.y,o.x-i.x)-i.rotation_deg*Math.PI/180;return function(e,t,i,o,n){const s=i>0?(n.maxX-e)/i:i<0?(n.minX-e)/i:1/0,r=o>0?(n.maxY-t)/o:o<0?(n.minY-t)/o:1/0,a=Math.min(s,r);return!isFinite(a)||a<=0?null:{x:e+i*a,y:t+o*a}}(e.x,e.y,Math.cos(s),Math.sin(s),n)}get _meshStubsForCurrentFloor(){if(!this._currentFloorId)return[];const e=this._pinByDeviceId,t=this._otherFloorPinsByDeviceId,i=this._floors.find(e=>e.floor_id===this._currentFloorId),o=[];for(const n of this._normalizedMeshLinks){const s=e.has(n.sourceDeviceId);if(s===e.has(n.targetDeviceId))continue;const r=e.get(s?n.sourceDeviceId:n.targetDeviceId),a=s?n.targetDeviceId:n.sourceDeviceId,l=this._outdoorPinByDeviceId.get(a);if(l){const e=this._placementForFloor(this._currentFloorId),t=e?Pe(e,l.x,l.y):null;if(!t)continue;o.push({fromPin:r,x:t.x,y:t.y,targetDeviceId:a,targetFloorId:ye,targetFloorName:"Outside",targetLabel:this._pinLabel(l),quality:n.quality,...n.detail?{detail:n.detail}:{}});continue}const d=t.get(a);if(!d||d.floorId===this._currentFloorId)continue;const c=this._floors.find(e=>e.floor_id===d.floorId),h=d.pin.label_override??we(d.pin.device_id,this._entityLookup.values()),p=null!==i?.building_id&&i?.building_id===c?.building_id?{x:d.pin.x,y:d.pin.y}:this._projectStubTowardBuilding(r,d.floorId);p&&o.push({fromPin:r,x:p.x,y:p.y,targetDeviceId:a,targetFloorId:d.floorId,targetFloorName:c?.name??d.floorId,targetLabel:h,quality:n.quality,...n.detail?{detail:n.detail}:{}})}return o}get _selectedPin(){return this._layout.pins.find(e=>e.id===this._selectedPinId)??null}get _pinStack(){if(!this._pinStackIds)return null;const e=new Map(this._layout.pins.map(e=>[e.id,e])),t=this._pinStackIds.map(t=>e.get(t)).filter(e=>!!e);return t.length>1?t:null}get _selectedWall(){return this._layout.walls.find(e=>e.id===this._selectedWallId)??null}get _selectedOpening(){return this._layout.openings.find(e=>e.id===this._selectedOpeningId)??null}get _selectedMeshLinkKey(){const e=this._selectedMeshLink;return e?`${e.fromPin.id}|${e.toPin.id}`:null}get _selectedMeshStubKey(){const e=this._selectedMeshStub;return e?`${e.fromPin.id}|${e.targetDeviceId}`:null}_unitsPerMeter(){const e=this._layout.scale;if(!e)return null;const[[t,i],[o,n]]=e.points;return(Math.hypot(o-t,n-i)||1)/e.meters}get _propertyScale(){const e=[];for(const t of this._livePlacements){const i=t.source_bounds;if(!i||t.width<=0)continue;const o=i.max_x-i.min_x;if(o<=0)continue;const n=this._buildingMetersPerUnit(t);null!==n&&e.push({area:t.width*t.height,mpu:n*o/t.width,name:t.label_override??this._floorNameById.get(t.floor_id)??"a building"})}if(0===e.length)return null;const t=e.reduce((e,t)=>t.area>e.area?t:e);return{metersPerUnit:t.mpu,buildingName:t.name,disagree:e.some(e=>Math.abs(e.mpu/t.mpu-1)>.1)}}_buildingMetersPerUnit(e){const t=this._floors.find(t=>t.floor_id===e.floor_id);if(t?.meters_per_unit)return t.meters_per_unit;if(null===e.building_id)return null;const i=this._floors.find(t=>t.building_id===e.building_id&&t.meters_per_unit);return i?.meters_per_unit??null}get _propertyScaleReadout(){const e=this._propertyScale;if(!e)return null;const t=this._settings.unit_system,i=dt(1/e.metersPerUnit,t);return`Scale (from ${e.buildingName}): 1 ${it(t)} ≈ ${i.toFixed(1)} units`}get _scaleReadout(){const e=this._unitsPerMeter();if(null===e)return null;const t=this._settings.unit_system,i=dt(e,t);return`Scale: 1 ${it(t)} ≈ ${i.toFixed(1)} units`}_defaultOpeningWidth(){const e=this._unitsPerMeter();return null===e?30:.9*e}async _init(){const[e,t,i,o,n]=await Promise.all([this._client.listFloors(),this._client.listPlaceableEntities(),this._client.listAreas(),this._client.getPropertyLayout(),this._client.getSettings()]);this._floors=e,this._entities=t,this._areas=i,this._propertyLayout=o,this._settings=n,$e.configure(this._client,n.debug_logging),$e.log("panel_open",{panel_version:"0.14.0-beta.1",panel_build:"0.14.0-beta.1+mv2v51sq",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,floors:e.length}),this._checkVersion();const s=this._orderedFloors[0];s&&await this._selectFloor(s.floor_id,{skipDirtyCheck:!0}),this._loading=!1}async _selectFloor(e,t={}){if(!t.skipDirtyCheck&&this._dirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save this floor — staying here so nothing is lost.")}else if(!window.confirm("Discard unsaved changes to this floor?"))return;this._autoSaveHeld=!1,this._view="floor";const i=this._layout.building_id;this._currentFloorId=e,this._layout=await this._client.getLayout(e),this._resetSelection(),this._resetAlignState(),this._floorHistory.clear();const o=Ne(this._layout.rooms,this._layout.pins);o!==this._layout.pins?(this._layout={...this._layout,pins:o},this._dirty=!0):this._dirty=!1,this._loadOtherFloorPins(e),$e.log("floor_load",{floor_id:e,rooms:this._layout.rooms.length,walls:this._layout.walls.length,pins:this._layout.pins.length,healed:this._dirty}),this._sameBuildingAsPreviousFloor=null!==this._layout.building_id&&this._layout.building_id===i}async _loadOtherFloorPins(e){const t=this._floors.filter(t=>t.floor_id!==e),i=await Promise.all(t.map(e=>this._client.getLayout(e.floor_id)));if(this._currentFloorId!==e)return;const o=new Map;t.forEach((e,t)=>{for(const n of i[t].pins)n.device_id&&o.set(n.device_id,{pin:n,floorId:e.floor_id})}),this._otherFloorPinsByDeviceId=o}_resetAlignState(){this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1}_resetSelection(){this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._armedEntityId=null,this._armedOpeningType=null}async _save(){if(this._currentFloorId){this._saving=!0;try{const e=this._canvas?.getViewBox()??this._layout.view_box;this._layout={...this._layout,view_box:e};const t=this._layout,i=performance.now();try{await this._client.saveLayout(this._currentFloorId,t)}catch(e){throw this._saveError=this._describeSaveError(e),$e.log("save_error",{target:this._currentFloorId,error:e?.message}),e}$e.log("save",{target:this._currentFloorId,ms:Math.round(performance.now()-i),rooms:t.rooms.length,pins:t.pins.length}),this._saveError=null,this._layout===t&&(this._dirty=!1),this._floors=this._floors.map(e=>e.floor_id===this._currentFloorId?{...e,has_layout:!0}:e),await this._refreshEntitiesIfPlacementChanged()}finally{this._saving=!1}}}async _export(){const e=await this._client.exportSnapshot(),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download="layout.json",o.click(),URL.revokeObjectURL(i)}_updateLayout(e){this._floorHistory.record(this._layout),this._layout={...this._layout,...e},this._dirty=!0}async _selectProperty(){if(this._propertyDirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save the property view — reopen the Property tab to try again.")}else if(!window.confirm("Discard unsaved changes to the property view?"))return;this._autoSaveHeld=!1,[this._propertyLayout,this._floors]=await Promise.all([this._client.getPropertyLayout(),this._client.listFloors()]),this._propertyHistory.clear(),$e.log("property_load",{placements:this._propertyLayout.placements.length,outdoor_pins:this._propertyLayout.pins.length}),this._propertyDirty=!1,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._propertyMode="select",this._armedBuildingKey=null,this._armedEntityId=null,this._view="property",this._loadPlacementGhosts()}async _loadPlacementGhosts(){const e=this._livePlacements,t=new Set,i=e=>this._floors.filter(t=>null!==e.building_id?t.building_id===e.building_id:t.floor_id===e.floor_id);for(const o of e)for(const e of i(o))t.add(e.floor_id);const o=new Map;await Promise.all([...t].map(async e=>{try{o.set(e,await this._client.getLayout(e))}catch{}}));const n=new Map;for(const t of e){const e=[],s=[];for(const n of i(t)){const t=o.get(n.floor_id);if(t){for(const i of t.rooms)!1!==i.visible&&e.push(i.points);for(const e of t.walls)s.push(e.points)}}n.set(t.id,{rooms:e,walls:s})}"property"===this._view&&(this._placementGhosts=n)}get _mapTilesAvailable(){const e=this._hass?.config;return!!e?.components?.includes("map_tiles")&&"number"==typeof e.latitude&&"number"==typeof e.longitude}_adjustMap(e){const t=this._propertyLayout.map_background;t&&this._updatePropertyLayout({map_background:e(t)})}_updatePropertyLayout(e){this._propertyHistory.record(this._propertyLayout),this._propertyLayout={...this._propertyLayout,...e},this._propertyDirty=!0}_undoRedo(e){if($e.log(e,{view:this._view}),"property"===this._view){const t=this._propertyLayout,i="undo"===e?this._propertyHistory.undo(t):this._propertyHistory.redo(t);if(!i)return;return this._propertyLayout={...i,view_box:t.view_box},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const t=this._layout,i="undo"===e?this._floorHistory.undo(t):this._floorHistory.redo(t);i&&(this._layout={...i,view_box:t.view_box,building_id:t.building_id},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)}get _canUndo(){return"property"===this._view?this._propertyHistory.canUndo:this._floorHistory.canUndo}get _canRedo(){return"property"===this._view?this._propertyHistory.canRedo:this._floorHistory.canRedo}async _saveProperty(){this._propertySaving=!0;try{const e=this._propertyCanvas?.getViewBox()??this._propertyLayout.view_box;this._propertyLayout={...this._propertyLayout,view_box:e};const t=this._propertyLayout,i=performance.now();try{await this._client.savePropertyLayout(t)}catch(e){throw this._saveError=this._describeSaveError(e),$e.log("save_error",{target:"property",error:e?.message}),e}$e.log("save",{target:"property",ms:Math.round(performance.now()-i),placements:t.placements.length,pins:t.pins.length}),this._saveError=null,this._propertyLayout===t&&(this._propertyDirty=!1),await this._refreshEntitiesIfPlacementChanged()}finally{this._propertySaving=!1}}get _selectedOutdoorPin(){return this._propertyLayout.pins.find(e=>e.id===this._selectedOutdoorPinId)??null}_patchOutdoorPin(e,t){this._updatePropertyLayout({pins:this._propertyLayout.pins.map(i=>i.id===e?{...i,...t}:i)})}_patchPlacement(e,t){this._updatePropertyLayout({placements:this._propertyLayout.placements.map(i=>i.id===e?{...i,...t}:i)})}_describeSaveError(e){const t=e?.message||"unknown error";return/not a valid option|extra keys not allowed|invalid_format/i.test(t)?`${t} — Home Assistant may need a restart to finish updating Spatial Context.`:t}_placementKey(){return[...this._layout.pins,...this._propertyLayout.pins].map(e=>e.device_id??"").sort().join(",")}async _refreshEntitiesIfPlacementChanged(){const e=this._placementKey();e!==this._placementKeyForEntities&&(this._entities=await this._client.listPlaceableEntities(),this._placementKeyForEntities=e)}async _checkVersion(){let e=null,t=null;try{t=await this._client.getVersionInfo()}catch{e="restart"}t&&(t.loaded_version&&t.installed_version&&t.loaded_version!==t.installed_version?e="restart":t.panel_build_id&&"0.14.0-beta.1+mv2v51sq"!==t.panel_build_id&&(e="reload")),e!==this._versionNotice&&$e.log("version_check",{notice:e,panel_build:"0.14.0-beta.1+mv2v51sq",...t??{}}),this._versionNotice=e}async _downloadDebugReport(){await $e.flush();const e=await this._client.getDebugReport(),t=new Blob([JSON.stringify({...e,browser:{panel_version:"0.14.0-beta.1",panel_build:"0.14.0-beta.1+mv2v51sq",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`}},null,2)],{type:"application/json"}),i=URL.createObjectURL(t),o=document.createElement("a");o.href=i,o.download=`spatial-context-debug-${(new Date).toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i)}get _autoSaveActive(){return this._settings.auto_save&&!this._autoSaveHeld}updated(e){super.updated(e),(e.has("_layout")||e.has("_propertyLayout")||e.has("_dirty")||e.has("_propertyDirty"))&&this._scheduleAutoSave()}_scheduleAutoSave(){null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null),this._autoSaveActive&&(this._dirty||this._propertyDirty)&&(this._autoSaveTimer=window.setTimeout(()=>{this._runAutoSave()},si.AUTO_SAVE_DELAY_MS))}async _runAutoSave(){if(this._autoSaveTimer=null,this._autoSaveActive)if(this._saving||this._propertySaving)this._scheduleAutoSave();else try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{}}async _flushAutoSave(){if(!this._autoSaveActive)return!this._dirty&&!this._propertyDirty;null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null);try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{return!1}return!this._dirty&&!this._propertyDirty}async _loadCachedZigbeeMesh(){try{const e=await this._client.getCachedZigbeeMesh();if(!e?.fetched_at||this._zigbeeMeshLoading)return;const t=1e3*e.fetched_at;if(this._zigbeeMeshFetchedAt&&t<=this._zigbeeMeshFetchedAt)return;this._zigbeeMesh=e,this._zigbeeMeshFetchedAt=t}catch{}}async _refreshZigbeeMesh(e=!1){this._zigbeeMeshLoading=!0,this._zigbeeMeshError=null;const t=Date.now();this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=window.setInterval(()=>{this._zigbeeMeshElapsedSeconds=Math.round((Date.now()-t)/1e3)},1e3);try{this._zigbeeMesh=await this._client.getZigbeeMesh(e),$e.log("mesh_load",{network:"zigbee",force_refresh:e,ms:Date.now()-t,links:this._zigbeeMesh.links.length,nodes:this._zigbeeMesh.nodes.length}),this._zigbeeMeshFetchedAt=this._zigbeeMesh.fetched_at?1e3*this._zigbeeMesh.fetched_at:Date.now()}catch(e){const t=this._meshErrorMessage(e,"Zigbee mesh request failed");this._zigbeeMeshError=t,$e.log("mesh_error",{network:"zigbee",error:t})}finally{this._zigbeeMeshLoading=!1,null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}}async _refreshWifiMesh(){this._wifiMeshLoading=!0,this._wifiMeshError=null;try{this._wifiMesh=await this._client.getWifiMesh(),$e.log("mesh_load",{network:"wifi",links:this._wifiMesh.links.length})}catch(e){const t=this._meshErrorMessage(e,"Wi-Fi mesh request failed");this._wifiMeshError=t,$e.log("mesh_error",{network:"wifi",error:t})}finally{this._wifiMeshLoading=!1}}async _subscribeMatter(){this._unsubscribeMatter(),this._matterError=null;try{this._matterUnsubscribe=await this._client.subscribeMatterTopology(e=>{this._matterTopology=e})}catch(e){this._matterError=this._meshErrorMessage(e,"Matter topology subscription failed")}}_unsubscribeMatter(){this._matterUnsubscribe?.(),this._matterUnsubscribe=null}_meshErrorMessage(e,t){const{code:i,message:o}=e??{};return"unknown_command"===i?"Restart Home Assistant to finish updating Spatial Context.":"unauthorized"===i?"This map needs a Home Assistant admin account.":o||t}async _subscribeBluetooth(){this._unsubscribeBluetooth(),this._bluetoothError=null,this._bluetoothBuffer=new Map,this._bluetoothAdverts=new Map;let e=!1;try{this._bluetoothDevices=(await this._client.getBluetoothDevices()).devices,e=!0,this._bluetoothUnsubscribe=await this._client.subscribeBluetoothAdvertisements(e=>{for(const t of e.add??[])this._bluetoothBuffer.set(t.address,{address:t.address,source:t.source,rssi:t.rssi,name:t.name});for(const{address:t}of e.remove??[])this._bluetoothBuffer.delete(t);this._bluetoothFlushTimer??(this._bluetoothFlushTimer=window.setTimeout(()=>{this._bluetoothFlushTimer=null,this._bluetoothAdverts=new Map(this._bluetoothBuffer)},2e3))}),window.setTimeout(()=>{this._bluetoothAdverts=new Map(this._bluetoothBuffer),$e.log("mesh_load",{network:"bluetooth",adverts:this._bluetoothBuffer.size,known_addresses:Object.keys(this._bluetoothDevices).length})},300)}catch(t){this._bluetoothError=e&&"unknown_command"===t?.code?"The Bluetooth map needs Home Assistant 2025.2 or newer.":this._meshErrorMessage(t,"Bluetooth subscription failed"),$e.log("mesh_error",{network:"bluetooth",error:this._bluetoothError})}}_unsubscribeBluetooth(){this._bluetoothUnsubscribe?.(),this._bluetoothUnsubscribe=null,null!==this._bluetoothFlushTimer&&(window.clearTimeout(this._bluetoothFlushTimer),this._bluetoothFlushTimer=null)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("beforeunload",this._onBeforeUnload),document.addEventListener("visibilitychange",this._onVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("beforeunload",this._onBeforeUnload),document.removeEventListener("visibilitychange",this._onVisibilityChange),$e.flush(),this._flushAutoSave(),this._unsubscribeMatter(),this._unsubscribeBluetooth(),null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}_deepActiveElement(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}_isTypingTarget(){const e=this._deepActiveElement();return!!e&&(!!(e instanceof HTMLElement&&e.isContentEditable)||("TEXTAREA"===e.tagName||e instanceof HTMLInputElement&&["text","number","search","email","url","tel","password"].includes(e.type)))}async _handleBackgroundFile(e){if(si._ACCEPTED_BACKGROUND_TYPES.has(e.type))try{const t={background_image_id:await this._client.uploadBackgroundImage(e),background_opacity:.85};"property"===this._view?this._updatePropertyLayout(t):this._updateLayout(t)}catch(e){window.alert(`Background image upload failed: ${e.message}`)}else window.alert("Background image must be a PNG, JPEG, or GIF file.")}_patchRoom(e,t){this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===e?{...i,...t}:i)})}get _iconPickerPin(){const e=this._iconPickerFor;if(!e)return null;return("floor"===e.kind?this._layout.pins:this._propertyLayout.pins).find(t=>t.id===e.pinId)??null}_patchPin(e,t){this._updateLayout({pins:this._layout.pins.map(i=>i.id===e?{...i,...t}:i)})}_pinLabel(e){return e.label_override?e.label_override:we(e.device_id,this._entityLookup.values())}_meshAgeLabel(e){const t=Math.round((Date.now()-e)/1e3);return t<60?`refreshed ${t}s ago`:`refreshed ${Math.round(t/60)}m ago`}render(){if(this._loading)return V`<div class="loading">Loading Spatial Context…</div>`;if(0===this._floors.length)return V`<div class="no-floors">
        No floors found. Add floors under Settings → Areas → Floors, then reopen
        this panel.
      </div>`;const e="zigbee"===this._networkType?this._zigbeeMeshError:"wifi"===this._networkType?this._wifiMeshError:"bluetooth"===this._networkType?this._bluetoothError:this._matterError;return V`
      <app-header
        .floors=${this._orderedFloors}
        .selectedFloorId=${this._currentFloorId}
        .propertySelected=${"property"===this._view}
        @floor-selected=${this._onFloorSelected}
        @property-selected=${this._onPropertySelected}
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
          ${"property"===this._view&&this._mapTilesAvailable&&void 0!==this._propertyLayout.map_background?V`<button
                    class="menu-item"
                    @click=${this._onToggleMapBackground}
                  >
                    <ha-icon icon="mdi:map"></ha-icon>
                    ${this._propertyLayout.map_background?Wt("mapBackground.remove"):Wt("mapBackground.add")}
                  </button>
                  ${this._propertyLayout.map_background?V`<label
                            class="popover-row hint"
                            style="padding: 8px 16px 4px"
                            >${Wt("mapBackground.style")}
                            <select @change=${this._onMapStyleChange}>
                              <option
                                value="street"
                                ?selected=${"aerial"!==this._propertyLayout.map_background.style}
                              >
                                ${Wt("mapBackground.street")}
                              </option>
                              <option
                                value="aerial"
                                ?selected=${"aerial"===this._propertyLayout.map_background.style}
                              >
                                ${Wt("mapBackground.aerial")}
                              </option>
                            </select>
                          </label>
                          <label
                            class="popover-row hint"
                            style="padding: 8px 16px 4px"
                            >${Wt("mapBackground.opacity")}
                            <input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.05"
                              .value=${String(this._propertyLayout.map_background.opacity)}
                              @input=${this._onMapOpacityChange}
                            />
                          </label>`:X}`:X}
          ${this._activeBackground.imageId?V`<button
                  class="menu-item"
                  @click=${this._onRemoveBackgroundClick}
                >
                  <ha-icon icon="mdi:image-remove"></ha-icon> Remove background
                </button>`:X}
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
                </label>`:X}
        </icon-popover>
        ${"floor"===this._view||"property"===this._view?V`<icon-popover
                icon="mdi:lan"
                label="Connectivity Map"
                .open=${this._meshPopoverOpen}
                ?highlight=${null!==this._networkType}
                @toggle=${this._onToggleMeshPopover}
              >
                <div class="layer-list">
                  <button
                    class="menu-item ${"zigbee"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("zigbee")}
                  >
                    <ha-icon icon="mdi:zigbee"></ha-icon> Zigbee Mesh
                    ${"zigbee"===this._networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:X}
                  </button>
                  <button
                    class="menu-item ${"wifi"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("wifi")}
                  >
                    <ha-icon icon="mdi:wifi"></ha-icon> Wi-Fi Network
                    ${"wifi"===this._networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:X}
                  </button>
                  <button
                    class="menu-item ${"matter"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("matter")}
                  >
                    <ha-icon icon="mdi:router-wireless"></ha-icon> Matter
                    Network
                    ${"matter"===this._networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:X}
                  </button>
                  <button
                    class="menu-item ${"bluetooth"===this._networkType?"active":""}"
                    @click=${()=>this._onNetworkTypeSelect("bluetooth")}
                  >
                    <ha-icon icon="mdi:bluetooth"></ha-icon> Bluetooth
                    ${"bluetooth"===this._networkType?V`<ha-icon class="trail" icon="mdi:check"></ha-icon>`:X}
                  </button>
                </div>
                <div class="menu-divider"></div>
                ${null===this._networkType?V`<span class="hint" style="padding: 4px 16px 8px"
                        >Pick a network above to show it. Pick it again to turn
                        it off.</span
                      >`:V`
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
                                    class="switch"
                                    role="switch"
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
                                  >`:X}
                        ${e?V`<span
                                class="hint"
                                style="color: var(--sc-danger); padding: 0 16px 8px"
                                >${e}</span
                              >`:"zigbee"===this._networkType&&this._zigbeeMeshFetchedAt?V`<span
                                  class="hint"
                                  style="padding: 0 16px 8px"
                                  >${this._meshAgeLabel(this._zigbeeMeshFetchedAt)}</span
                                >`:X}
                      `}
              </icon-popover>`:X}
        <icon-popover
          slot="end"
          icon="mdi:cog"
          label="Settings"
          dialog
          .open=${this._settingsPopoverOpen}
          @toggle=${this._onToggleSettingsPopover}
        >
          <settings-menu
            .settings=${this._settings}
            .coordinatorChoices=${this._placedDeviceChoices}
            @settings-change=${this._onSettingsChange}
            @settings-close=${()=>this._settingsPopoverOpen=!1}
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
              </div>`:X}
        ${this._saveError?V`<div class="save-error floating-panel" role="alert">
                <ha-icon icon="mdi:alert"></ha-icon>
                <span
                  >Couldn't save: ${this._saveError} Your changes are still here
                  — keep this tab open.</span
                >
                <button @click=${this._onSaveClick}>Retry</button>
              </div>`:X}
        ${"property"===this._view?V`
                <div
                  class="canvas-area ${this._dragOverCanvas?"drag-over":""}"
                  @dragover=${this._onCanvasDragOver}
                  @dragleave=${this._onCanvasDragLeave}
                  @drop=${this._onCanvasDrop}
                >
                  <property-canvas
                    .placements=${this._livePlacements}
                    .ghosts=${this._placementGhosts}
                    .hass=${this._hass}
                    .mapBackground=${this._propertyLayout.map_background??null}
                    @map-adjust=${this._onMapAdjust}
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
                    .dirty=${this._propertyDirty}
                    .saving=${this._propertySaving}
                    .canUndo=${this._canUndo}
                    .canRedo=${this._canRedo}
                    @undo-click=${this._onUndo}
                    @redo-click=${this._onRedo}
                    @save-click=${this._onSaveClick}
                    .meshLegend=${null!==this._networkType}
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
                    @map-rotation-set=${this._onMapRotationSet}
                    @map-zoom-step=${this._onMapZoomStep}
                    .mapActive=${!!this._propertyLayout.map_background}
                    .mapRotation=${this._propertyLayout.map_background?.rotation_deg??0}
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
                      ></entity-picker-sidebar>`:X}
              `:V`
                <div
                  class="canvas-area ${this._dragOverCanvas?"drag-over":""}"
                  @dragover=${this._onCanvasDragOver}
                  @dragleave=${this._onCanvasDragLeave}
                  @drop=${this._onCanvasDrop}
                >
                  <floorplan-canvas
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
                    .dirty=${this._dirty}
                    .saving=${this._saving}
                    .canUndo=${this._canUndo}
                    .canRedo=${this._canRedo}
                    @undo-click=${this._onUndo}
                    @redo-click=${this._onRedo}
                    @save-click=${this._onSaveClick}
                    .meshLegend=${null!==this._networkType}
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
                    @selection-clear=${this._onSelectionClear}
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
                      ></entity-picker-sidebar>`:X}
              `}
      </div>
      ${this._iconPickerPin?V`<icon-picker-dialog
              .value=${this._iconPickerPin.icon_override??null}
              .suggestFrom=${this._pinLabel(this._iconPickerPin)}
              @icon-picked=${this._onIconPicked}
              @icon-picker-cancel=${this._onIconPickerCancel}
            ></icon-picker-dialog>`:X}
    `}};ai.styles=[ht,_t,r`
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
        top: 68px;
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
        /* Room for the controls row the overlay draws across the top. */
        padding-top: 56px;
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
      .menu-divider {
        height: 1px;
        margin: 6px 0;
        background: var(--sc-divider);
      }
      .menu-item .trail {
        margin-left: auto;
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
        width: 120px;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--sc-fg-secondary);
      }
    `],ai.AUTO_SAVE_DELAY_MS=3e3,ai._ACCEPTED_BACKGROUND_TYPES=new Set(["image/png","image/jpeg","image/gif"]),e([_e()],ai.prototype,"_floors",void 0),e([_e()],ai.prototype,"_currentFloorId",void 0),e([_e()],ai.prototype,"_layout",void 0),e([_e()],ai.prototype,"_entities",void 0),e([_e()],ai.prototype,"_areas",void 0),e([_e()],ai.prototype,"_mode",void 0),e([_e()],ai.prototype,"_snapMode",void 0),e([_e()],ai.prototype,"_dragOverCanvas",void 0),e([_e()],ai.prototype,"_armedEntityId",void 0),e([_e()],ai.prototype,"_armedOpeningType",void 0),e([_e()],ai.prototype,"_selectedRoomId",void 0),e([_e()],ai.prototype,"_editingRoomId",void 0),e([_e()],ai.prototype,"_selectedPinId",void 0),e([_e()],ai.prototype,"_pinStackIds",void 0),e([_e()],ai.prototype,"_selectedWallId",void 0),e([_e()],ai.prototype,"_editingWallId",void 0),e([_e()],ai.prototype,"_selectedOpeningId",void 0),e([_e()],ai.prototype,"_selectedMeshLink",void 0),e([_e()],ai.prototype,"_selectedMeshStub",void 0),e([_e()],ai.prototype,"_otherFloorPinsByDeviceId",void 0),e([_e()],ai.prototype,"_dirty",void 0),e([_e()],ai.prototype,"_saving",void 0),e([_e()],ai.prototype,"_loading",void 0),e([_e()],ai.prototype,"_pendingCount",void 0),e([_e()],ai.prototype,"_networkType",void 0),e([_e()],ai.prototype,"_zigbeeMesh",void 0),e([_e()],ai.prototype,"_zigbeeMeshLoading",void 0),e([_e()],ai.prototype,"_zigbeeMeshError",void 0),e([_e()],ai.prototype,"_zigbeeMeshFetchedAt",void 0),e([_e()],ai.prototype,"_zigbeeMeshElapsedSeconds",void 0),e([_e()],ai.prototype,"_zigbeeShowAllLinks",void 0),e([_e()],ai.prototype,"_wifiMesh",void 0),e([_e()],ai.prototype,"_wifiMeshLoading",void 0),e([_e()],ai.prototype,"_wifiMeshError",void 0),e([_e()],ai.prototype,"_matterTopology",void 0),e([_e()],ai.prototype,"_matterError",void 0),e([_e()],ai.prototype,"_bluetoothAdverts",void 0),e([_e()],ai.prototype,"_bluetoothDevices",void 0),e([_e()],ai.prototype,"_bluetoothError",void 0),e([_e()],ai.prototype,"_backgroundPopoverOpen",void 0),e([_e()],ai.prototype,"_meshPopoverOpen",void 0),e([_e()],ai.prototype,"_settings",void 0),e([_e()],ai.prototype,"_settingsPopoverOpen",void 0),e([_e()],ai.prototype,"_moreOptionsPopoverOpen",void 0),e([_e()],ai.prototype,"_view",void 0),e([_e()],ai.prototype,"_placementGhosts",void 0),e([_e()],ai.prototype,"_propertyLayout",void 0),e([_e()],ai.prototype,"_propertyDirty",void 0),e([_e()],ai.prototype,"_saveError",void 0),e([_e()],ai.prototype,"_iconPickerFor",void 0),e([_e()],ai.prototype,"_versionNotice",void 0),e([_e()],ai.prototype,"_propertySaving",void 0),e([_e()],ai.prototype,"_selectedPlacementId",void 0),e([_e()],ai.prototype,"_propertyMode",void 0),e([_e()],ai.prototype,"_selectedOutdoorPinId",void 0),e([_e()],ai.prototype,"_selectedPropertyMeshLinkKey",void 0),e([_e()],ai.prototype,"_armedBuildingKey",void 0),e([_e()],ai.prototype,"_sameBuildingAsPreviousFloor",void 0),e([_e()],ai.prototype,"_alignTargetFloorId",void 0),e([_e()],ai.prototype,"_alignTargetLayout",void 0),e([_e()],ai.prototype,"_alignOffsetX",void 0),e([_e()],ai.prototype,"_alignOffsetY",void 0),e([_e()],ai.prototype,"_alignScale",void 0),e([ge("floorplan-canvas")],ai.prototype,"_canvas",void 0),e([ge("property-canvas")],ai.prototype,"_propertyCanvas",void 0),e([ge("#file-input")],ai.prototype,"_fileInput",void 0),ai=si=e([me("spatial-context-panel")],ai)}();
