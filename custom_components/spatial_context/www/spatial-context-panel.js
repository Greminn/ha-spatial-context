/*! spatial-context-panel v0.14.0-beta.1 | MIT */
!function(){"use strict";function t(t,e,i,o){var n,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),n=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new s(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",y=_.reactiveElementPolyfillSupport,v=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const s=o?.call(this);n?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),n=e.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=o;const s=n.fromAttribute(e,t.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(void 0!==t){const s=this.constructor;if(!1===o&&(n=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==n||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,y?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,$=t=>t,P=k.trustedTypes,I=P?P.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,E=`<${C}>`,L=document,T=()=>L.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,B=Array.isArray,R="[ \t\n\f\r]",A=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,D=/>/g,z=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,W=/"/g,U=/^(?:script|style|textarea|title)$/i,N=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=N(1),Y=N(2),j=Symbol.for("lit-noChange"),X=Symbol.for("lit-nothing"),K=new WeakMap,G=L.createTreeWalker(L,129);function q(t,e){if(!B(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==I?I.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,o=[];let n,s=2===e?"<svg>":3===e?"<math>":"",r=A;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===A?"!--"===l[1]?r=F:void 0!==l[1]?r=D:void 0!==l[2]?(U.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=z):void 0!==l[3]&&(r=z):r===z?">"===l[0]?(r=n??A,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?z:'"'===l[3]?W:H):r===W||r===H?r=z:r===F||r===D?r=A:(r=z,n=void 0);const h=r===z&&t[e+1].startsWith("/>")?" ":"";s+=r===A?i+E:c>=0?(o.push(a),i.slice(0,c)+M+i.slice(c)+S+h):i+S+(-2===c?e:h)}return[q(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class J{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=J.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=G.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(M)){const e=c[s++],i=o.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:i,ctor:"."===r[1]?ot:"?"===r[1]?nt:"@"===r[1]?st:it}),o.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(U.test(o.tagName)){const t=o.textContent.split(S),e=t.length-1;if(e>0){o.textContent=P?P.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],T()),G.nextNode(),a.push({type:2,index:++n});o.append(t[e],T())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(S,t+1));)a.push({type:7,index:n}),t+=S.length-1}n++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,o){if(e===j)return e;let n=void 0!==o?i._$Co?.[o]:i._$Cl;const s=O(e)?void 0:e._$litDirective$;return n?.constructor!==s&&(n?._$AO?.(!1),void 0===s?n=void 0:(n=new s(t),n._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=n:i._$Cl=n),void 0!==n&&(e=Q(t,n._$AS(t,e.values),n,o)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??L).importNode(e,!0);G.currentNode=o;let n=G.nextNode(),s=0,r=0,a=i[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new et(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new rt(n,this,t)),this._$AV.push(e),a=i[++r]}s!==a?.index&&(n=G.nextNode(),s++)}return G.currentNode=L,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=X,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===X||null==t||""===t?(this._$AH!==X&&this._$AR(),this._$AH=X):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>B(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==X&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new tt(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new J(t)),e}k(t){B(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const n of t)o===e.length?e.push(i=new et(this.O(T()),this.O(T()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=X,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=X}_$AI(t,e=this,i,o){const n=this.strings;let s=!1;if(void 0===n)t=Q(this,t,e,0),s=!O(t)||t!==this._$AH&&t!==j,s&&(this._$AH=t);else{const o=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=Q(this,o[i+r],e,r),a===j&&(a=this._$AH[r]),s||=!O(a)||a!==this._$AH[r],a===X?t=X:t!==X&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}s&&!o&&this.j(t)}j(t){t===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ot extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===X?void 0:t}}class nt extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==X)}}class st extends it{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??X)===j)return;const i=this._$AH,o=t===X&&i!==X||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==X&&(i===X||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=k.litHtmlPolyfillSupport;at?.(J,et),(k.litHtmlVersions??=[]).push("3.3.3");const lt=globalThis;class ct extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let n=o._$litPart$;if(void 0===n){const t=i?.renderBefore??null;o._$litPart$=n=new et(e.insertBefore(T(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:b},pt=(t=ht,e,i)=>{const{kind:o,metadata:n}=i;let s=globalThis.litPropertyMetadata.get(n);if(void 0===s&&globalThis.litPropertyMetadata.set(n,s=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,n,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];e.call(this,i),this.requestUpdate(o,n,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ut(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function _t(t){return ut({...t,state:!0,attribute:!1})}function gt(t,e){return(e,i,o)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}const mt=t=>(e,i)=>{const o=()=>{customElements.get(t)?console.info(`spatial-context: <${t}> already defined — reload the page to pick up the updated panel.`):customElements.define(t,e)};void 0!==i?i.addInitializer(o):o()},yt="__property__";function vt(t){switch(t){case"strong":return"#2e7d32";case"medium":return"#f9a825";case"weak":return"#c62828";default:return"#607d8b"}}function ft(t){return t>=-70?"strong":t>=-85?"medium":"weak"}const bt=["light","switch","climate","media_player","lock","cover","fan","vacuum","alarm_control_panel","valve","humidifier","siren","water_heater","camera","assist_satellite","device_tracker","binary_sensor","sensor"];function xt(t,e){if(!t)return null;const i=[...e].filter(e=>e.device_id===t);if(0===i.length)return null;const o=t=>"config"===t.entity_category?2:t.entity_category?1:0,n=t=>{const e=bt.indexOf(t.domain);return-1===e?bt.length:e};return i.sort((t,e)=>o(t)-o(e)||n(t)-n(e)),i[0]}function wt(t,e){return xt(t,e)?.device_name??"Unknown device"}class kt{constructor(t=100,e=400){this._limit=t,this._coalesceMs=e,this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}get canUndo(){return this._past.length>0}get canRedo(){return this._future.length>0}record(t,e=Date.now()){e-this._lastRecordAt>this._coalesceMs&&(this._past.push(t),this._past.length>this._limit&&this._past.shift()),this._lastRecordAt=e,this._future=[]}undo(t){const e=this._past.pop();return void 0===e?null:(this._future.push(t),this._lastRecordAt=Number.NEGATIVE_INFINITY,e)}redo(t){const e=this._future.pop();return void 0===e?null:(this._past.push(t),this._lastRecordAt=Number.NEGATIVE_INFINITY,e)}discardIfLast(t){this._past[this._past.length-1]===t&&(this._past.pop(),this._lastRecordAt=Number.NEGATIVE_INFINITY)}clear(){this._past=[],this._future=[],this._lastRecordAt=Number.NEGATIVE_INFINITY}}const $t=new class{constructor(){this._client=null,this._enabled=!1,this._buffer=[],this._timer=null,this._errorHooked=!1}configure(t,e){this._client=t,this._enabled=e,e?this._hookErrors():this._buffer=[]}log(t,e={}){this._enabled&&(this._buffer.push({event:t,t:(new Date).toISOString(),...e}),this._buffer.length>200&&this._buffer.shift(),this._timer??(this._timer=window.setTimeout(()=>{this.flush()},2e3)))}async flush(){if(this._timer=null,!this._client||0===this._buffer.length)return;const t=this._buffer;this._buffer=[];try{await this._client.sendDebugLog(t)}catch{}}_hookErrors(){if(this._errorHooked)return;this._errorHooked=!0;const t=t=>!!t&&/spatial[-_]context/.test(t);window.addEventListener("error",e=>{const i=e.error?.stack;(t(i)||t(e.filename))&&this.log("js_error",{message:e.message,stack:i})}),window.addEventListener("unhandledrejection",e=>{const i=e.reason;t(i?.stack)&&this.log("js_rejection",{message:i?.message,stack:i?.stack})})}};function Pt(t,e,i){const o=t.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y||t.width<=0||t.height<=0)return null;const n=t.rotation_deg*Math.PI/180,s=Math.cos(n),r=Math.sin(n),a=e-t.x,l=i-t.y,c=-r*a+s*l;return{x:((s*a+r*l)/t.width+.5)*(o.max_x-o.min_x)+o.min_x,y:(c/t.height+.5)*(o.max_y-o.min_y)+o.min_y}}const It=[{id:"timber_frame",label:"Timber framed (drywall)",color:"#212121",attenuationDbPerCm:.3,defaultThicknessCm:10},{id:"brick_veneer",label:"Brick veneer",color:"#3e2723",attenuationDbPerCm:.55,defaultThicknessCm:11},{id:"concrete_block",label:"Concrete / block",color:"#000000",attenuationDbPerCm:.6,defaultThicknessCm:20},{id:"aerated_concrete_block",label:"Aerated/foam concrete block (plastered)",color:"#757575",attenuationDbPerCm:.37,defaultThicknessCm:13},{id:"ceramic_poroton_block",label:"Ceramic / Poroton block",color:"#8d6e63",attenuationDbPerCm:.42,defaultThicknessCm:25},{id:"glass",label:"Glass",color:"#37474f",attenuationDbPerCm:2,defaultThicknessCm:1},{id:"steel_frame",label:"Steel frame",color:"#263238",attenuationDbPerCm:1,defaultThicknessCm:10}];function Mt(t){return It.find(e=>e.id===t)??It[0]}function St(t){return t.thickness_cm??Mt(t.material).defaultThicknessCm}class Ct{constructor(t){this.hass=t}async listFloors(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_floors"})).floors}async getLayout(t){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_layout",floor_id:t})}async saveLayout(t,e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_layout",floor_id:t,background_image_id:e.background_image_id,background_opacity:e.background_opacity,background_offset_x:e.background_offset_x,background_offset_y:e.background_offset_y,background_scale:e.background_scale,building_id:e.building_id,view_box:e.view_box,rooms:e.rooms,pins:e.pins,walls:e.walls,openings:e.openings,scale:e.scale})}async setBuildingId(t,e){return this.hass.connection.sendMessagePromise({type:"spatial_context/set_building_id",floor_id:t,building_id:e})}async getPropertyLayout(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_property_layout"})}async savePropertyLayout(t){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_property_layout",background_image_id:t.background_image_id,background_opacity:t.background_opacity,background_offset_x:t.background_offset_x,background_offset_y:t.background_offset_y,background_scale:t.background_scale,view_box:t.view_box,placements:t.placements,pins:t.pins,...void 0!==t.map_background?{map_background:t.map_background}:{}})}async getSettings(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_settings"})}async saveSettings(t){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_settings",unit_system:t.unit_system,zigbee_timeout_seconds:t.zigbee_timeout_seconds,floor_order:t.floor_order,zigbee_coordinator_device_id:t.zigbee_coordinator_device_id,auto_save:t.auto_save,debug_logging:t.debug_logging})}async getVersionInfo(){return this.hass.connection.sendMessagePromise({type:"spatial_context/version"})}async sendDebugLog(t){await this.hass.connection.sendMessagePromise({type:"spatial_context/debug_log",entries:t})}async getDebugReport(){return this.hass.connection.sendMessagePromise({type:"spatial_context/debug_report"})}async listAreas(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_areas"})).areas}async listPlaceableEntities(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_placeable_entities"})).entities}async exportSnapshot(){return this.hass.connection.sendMessagePromise({type:"spatial_context/export_snapshot"})}async getZigbeeMesh(t=!1){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",force_refresh:t})}async getCachedZigbeeMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh",cache_only:!0})}async getWifiMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_wifi_mesh"})}async subscribeMatterTopology(t){return this.hass.connection.subscribeMessage(t,{type:"matter/subscribe_network_topology"})}async subscribeBluetoothAdvertisements(t){return this.hass.connection.subscribeMessage(t,{type:"bluetooth/subscribe_advertisements"})}async getBluetoothDevices(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_bluetooth_devices"})}async uploadBackgroundImage(t){const e=new FormData;e.append("file",t);const i=await this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:e});if(!i.ok)throw new Error(`Image upload failed: ${i.status} ${i.statusText}`);return(await i.json()).id}}function Et(t){return t?`/api/image/serve/${t}/original`:null}function Lt(t){return`${t}-${function(){if("undefined"!=typeof crypto&&crypto.randomUUID)return crypto.randomUUID();if("undefined"!=typeof crypto&&crypto.getRandomValues){const t=crypto.getRandomValues(new Uint8Array(16));t[6]=15&t[6]|64,t[8]=63&t[8]|128;const e=Array.from(t,t=>t.toString(16).padStart(2,"0")).join("");return`${e.slice(0,8)}-${e.slice(8,12)}-${e.slice(12,16)}-${e.slice(16,20)}-${e.slice(20)}`}return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const e=16*Math.random()|0;return("x"===t?e:3&e|8).toString(16)})}()}`}function Tt(t,e,i,o){return{id:Lt("pin"),device_id:t,x:e,y:i,room_id:o,icon_override:null,label_override:null,height_m:null}}function Ot(t,e="timber_frame"){return{id:Lt("wall"),material:e,thickness_cm:Mt(e).defaultThicknessCm,points:t}}const Bt=220;class Rt{constructor(t=[],e=(t,e)=>t<e?-1:t>e?1:0){if(this.data=t,this.length=this.data.length,this.compare=e,this.length>0)for(let t=(this.length>>1)-1;t>=0;t--)this._down(t)}push(t){this.data.push(t),this._up(this.length++)}pop(){if(0===this.length)return;const t=this.data[0],e=this.data.pop();return--this.length>0&&(this.data[0]=e,this._down(0)),t}peek(){return this.data[0]}_up(t){const{data:e,compare:i}=this,o=e[t];for(;t>0;){const n=t-1>>1,s=e[n];if(i(o,s)>=0)break;e[t]=s,t=n}e[t]=o}_down(t){const{data:e,compare:i}=this,o=this.length>>1,n=e[t];for(;t<o;){let o=1+(t<<1);const s=o+1;if(s<this.length&&i(e[s],e[o])<0&&(o=s),i(e[o],n)>=0)break;e[t]=e[o],t=o}e[t]=n}}function At(t,e=1,i=!1){let o=1/0,n=1/0,s=-1/0,r=-1/0;for(const[e,i]of t[0])e<o&&(o=e),i<n&&(n=i),e>s&&(s=e),i>r&&(r=i);const a=s-o,l=r-n,c=Math.max(e,Math.min(a,l));if(c===e){const t=[o,n];return t.distance=0,t}let d=0;for(const e of t)d+=e.length;const h=new Float64Array(2*d),p=[];let u=0;for(const e of t){for(let t=0;t<e.length;t++)h[u++]=e[t][0],h[u++]=e[t][1];p.push(u)}const _=function(t,e){const i=64;let o=0,n=0;for(let t=0;t<e.length;t++)o+=Math.ceil((e[t]-n)/i),n=e[t];const s=new Float64Array(4*o);let r=0;n=0;for(let o=0;o<e.length;o++){const a=e[o];for(let e=n;e<a;e+=i,r+=4){const o=e+i<a?e+i:a,l=e===n?a-2:e-2;let c=t[l],d=t[l+1],h=c,p=d;for(let i=e;i<o;i+=2){const e=t[i],o=t[i+1];e<c?c=e:e>h&&(h=e),o<d?d=o:o>p&&(p=o)}s[r]=c,s[r+1]=d,s[r+2]=h,s[r+3]=p}n=a}return s}(h,p),g=new Rt([],(t,e)=>e.max-t.max);let m=function(t,e,i){let o=0,n=0,s=0;const r=e[0];for(let e=0,i=r-2;e<r;i=e,e+=2){const r=t[e],a=t[e+1],l=t[i],c=t[i+1],d=r*c-l*a;n+=(r+l)*d,s+=(a+c)*d,o+=3*d}const a=new Ft(n/o,s/o,0,t,e,i,-1/0,null);return 0===o||a.d<0?new Ft(t[0],t[1],0,t,e,i,-1/0,null):a}(h,p,_);const y=new Ft(o+a/2,n+l/2,0,h,p,_,-1/0,null);y.d>m.d&&(m=y);let v=2;function f(t,o,n,s){const r=m.d-Math.max(0,n*Math.SQRT2-e),a=new Ft(t,o,n,h,p,_,r,s);v++,a.max>m.d+e&&g.push(a),a.d>m.d&&(m=a,i&&console.log(`found best ${Math.round(1e4*a.d)/1e4} after ${v} probes`))}let b=c/2;for(let t=o;t<s;t+=c)for(let e=n;e<r;e+=c)f(t+b,e+b,b,null);for(;g.length;){const t=g.pop();if(t.max-m.d<=e)break;b=t.h/2,f(t.x-b,t.y-b,b,t),f(t.x+b,t.y-b,b,t),f(t.x-b,t.y+b,b,t),f(t.x+b,t.y+b,b,t)}i&&console.log(`num probes: ${v}\nbest distance: ${m.d}`);const x=[m.x,m.y];return x.distance=m.d,x}function Ft(t,e,i,o,n,s,r,a){this.x=t,this.y=e,this.h=i,this.nsx1=0,this.nsy1=0,this.nsx2=0,this.nsy2=0,this.d=function(t,e,i,o,n,s){const r=t.x,a=t.y;let l=!1,c=1/0;const d=n>0?n*n:-1;if(null!==s&&(t.nsx1=s.nsx1,t.nsy1=s.nsy1,t.nsx2=s.nsx2,t.nsy2=s.nsy2,c=Dt(r,a,s.nsx1,s.nsy1,s.nsx2,s.nsy2),c<=d))return n;const h=64,p=i.length;let u=0,_=0;for(let s=0;s<p;s++){const p=i[s];let g=e[p-2],m=e[p-1];for(let i=_;i<p;i+=h,u+=4){let s=i+h;s>p&&(s=p);const _=o[u],y=o[u+1],v=o[u+2],f=o[u+3],b=r<_?_-r:r>v?r-v:0,x=a<y?y-a:a>f?a-f:0,w=b*b+x*x>=c,k=a<y||a>=f||r>v;if(w&&k)g=e[s-2],m=e[s-1];else for(let o=i;o<s;o+=2){const i=e[o],s=e[o+1];if(!k&&s>a!=m>a&&r<(g-i)*(a-s)/(m-s)+i&&(l=!l),!w){const e=Dt(r,a,i,s,g,m);if(e<c&&(c=e,t.nsx1=i,t.nsy1=s,t.nsx2=g,t.nsy2=m,c<=d))return n}g=i,m=s}}_=p}return 0===c?0:(l?1:-1)*Math.sqrt(c)}(this,o,n,s,r,a),this.max=this.d+i*Math.SQRT2}function Dt(t,e,i,o,n,s){let r=n-i,a=s-o;if(0!==r||0!==a){const l=((t-i)*r+(e-o)*a)/(r*r+a*a);l>1?(i=n,o=s):l>0&&(i+=r*l,o+=a*l)}return r=t-i,a=e-o,r*r+a*a}function zt(t,e,i,o){return Math.hypot(i-t,o-e)}function Ht(t,e,i){return Math.min(i,Math.max(e,t))}function Wt(t,e,i){let o=!1;for(let n=0,s=i.length-1;n<i.length;s=n++){const r=i[n],a=i[s],[l,c]=r,[d,h]=a;c>e!=h>e&&t<(d-l)*(e-c)/(h-c)+l&&(o=!o)}return o}function Ut(t,e,i){for(const o of i)if(o.points.length>=3&&Wt(t,e,o.points))return o.id;return null}function Nt(t,e){let i=!1;const o=e.map(e=>{const o=Ut(e.x,e.y,t);return o===e.room_id?e:(i=!0,{...e,room_id:o})});return i?o:e}const Vt=new WeakMap;function Yt(t,e,i,o,n,s){const r=n-i,a=s-o,l=r*r+a*a;if(0===l)return zt(t,e,i,o);let c=((t-i)*r+(e-o)*a)/l;return c=Ht(c,0,1),zt(t,e,i+c*r,o+c*a)}function jt(t,e,i){let o=1/0;for(let n=0;n<i.length-1;n++){const[s,r]=i[n],[a,l]=i[n+1];o=Math.min(o,Yt(t,e,s,r,a,l))}return o}function Xt(t){const e=[];for(let i=0;i<t.length;i++){const o=t[i],n=t[(i+1)%t.length];e.push([(o[0]+n[0])/2,(o[1]+n[1])/2])}return e}function Kt(t){const e=[];for(let i=0;i<t.length-1;i++){const o=t[i],n=t[i+1];e.push([(o[0]+n[0])/2,(o[1]+n[1])/2])}return e}function Gt(t,e,i){let o={point:t[0],segmentIndex:0,dist:1/0};for(let n=0;n<t.length-1;n++){const[s,r]=t[n],[a,l]=t[n+1],c=a-s,d=l-r,h=c*c+d*d;let p=0===h?0:((e-s)*c+(i-r)*d)/h;p=Ht(p,0,1);const u=[s+p*c,r+p*d],_=zt(e,i,u[0],u[1]);_<o.dist&&(o={point:u,segmentIndex:n,dist:_})}return{point:o.point,segmentIndex:o.segmentIndex}}function qt(t,e,i){return 0===t.length?{point:[e,i],segmentIndex:0}:Gt([...t,t[0]],e,i)}function Zt(t,e,i){const[o,n]=t,[s,r]=e,a=Math.abs(s-o),l=Math.abs(r-n);return a>i&&l>i?e:a<=l?[o,r]:[s,n]}function Jt(t,e,i,o){if(o.length<2)return null;const{segmentIndex:n}=Gt(o,t,e),[s,r]=function(t,e){const[i,o]=t[e],[n,s]=t[e+1]??t[e],r=zt(i,o,n,s)||1;return[(n-i)/r,(s-o)/r]}(o,n),a=i/2;return[[t-s*a,e-r*a],[t+s*a,e+r*a]]}function Qt(t){const e=t.getRootNode();let i=document.activeElement;for(;i?.shadowRoot?.activeElement;)i=i.shadowRoot.activeElement;if(!(i instanceof HTMLElement))return;let o=i.getRootNode();for(;o&&o!==e;)o=o instanceof ShadowRoot?o.host.getRootNode():null;o===e&&i.blur()}const te=.3048;function ee(t){return Math.round(100*t)/100}function ie(t){return"imperial"===t?"ft":"m"}function oe(t,e){return String(ee("imperial"===e?t/te:t))}function ne(t,e){const i=Number(t);return Number.isFinite(i)?"imperial"===e?i*te:i:null}const se={cm:1,m:100,in:2.54,ft:30.48};function re(t){return"imperial"===t?"in":"cm"}function ae(t,e){return String(ee(t/se[e]))}function le(t,e){const i=Number(t);return Number.isFinite(i)?i*se[e]:null}function ce(t,e){return"imperial"===e?t*te:t}const de=r`
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
`,he=r`
  .controls {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    flex-direction: column;
    background: var(--sc-panel-bg);
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
`;function pe(t,e,i,o){return t.map(t=>({pin:t,d:zt(t.x,t.y,e,i)})).filter(({d:t})=>t<=o).sort((t,e)=>t.d-e.d).map(({pin:t})=>t)}function ue(t,e,i,o){let n=null,s=o;return t.forEach(([t,o],r)=>{const a=zt(t,o,e,i);a<=s&&(n=r,s=a)}),n}function _e(t,e,i,o){let n=null,s=o;for(const o of t){const t=jt(e,i,o.points);t<=s&&(n=o,s=t)}return n}function ge(t,e,i,o){if(t.points.length>=3){const[n,s]=t.points[0];if(zt(n,s,e,i)<=o)return{trace:t,closed:!0}}return{trace:{points:[...t.points,[e,i]]},closed:!1}}const me=new Map;function ye(t){const e=t.trim();if(!e)return Promise.resolve(null);const i=e.includes(":")?e:`mdi:${e}`;let o=me.get(i);return o||(o=async function(t){if(!customElements.get("ha-icon"))return null;const e=document.createElement("div");e.style.cssText="position:fixed;left:-10000px;top:0;width:24px;height:24px;overflow:hidden;";const i=document.createElement("ha-icon");i.setAttribute("icon",t),e.appendChild(i),document.body.appendChild(e);try{const t=Date.now()+4e3;for(;Date.now()<t;){const t=i.shadowRoot?.querySelector("ha-svg-icon");if("string"==typeof t?.path&&t.path)return t.path;await new Promise(t=>setTimeout(t,50))}return null}finally{e.remove()}}(i),me.set(i,o)),o}const ve=r`
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
`;class fe{constructor(t){this._host=t,this._resolvedOverrides=new Map,this._failedBrandIcons=new Set}_iconForOverride(t){return this._resolvedOverrides.has(t)?this._resolvedOverrides.get(t)??null:(this._resolvedOverrides.set(t,null),ye(t).then(e=>{null!==e&&(this._resolvedOverrides.set(t,e),this._host.requestUpdate())}),null)}iconForPin(t,e){if(t.icon_override){const e=this._iconForOverride(t.icon_override);if(e)return{kind:"path",d:e}}const i=function(t,e){return xt(t,e)?.integration_domain??null}(t.device_id,e);return i&&!this._failedBrandIcons.has(i)?{kind:"image",href:`https://brands.home-assistant.io/_/${i}/icon.png`,integrationDomain:i}:{kind:"path",d:"M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z"}}onBrandIconError(t){this._failedBrandIcons.has(t)||(this._failedBrandIcons.add(t),this._host.requestUpdate())}renderMarker(t,e,i,o,n,s,r){const a=1.1*i;return Y`
      <g>
        <title>${r}</title>
        <circle
          class="pin-dot ${s?"selected":""}"
          cx=${t}
          cy=${e}
          r=${i}
          style="fill:${s?"":n}"
        ></circle>
        ${"path"===o.kind?Y`
              <svg
                x=${t-a/2}
                y=${e-a/2}
                width=${a}
                height=${a}
                viewBox="0 0 24 24"
                class="pin-icon"
              >
                <path d=${o.d}></path>
              </svg>
            `:Y`
              <image
                x=${t-a/2}
                y=${e-a/2}
                width=${a}
                height=${a}
                href=${o.href}
                class="pin-brand-icon"
                @error=${()=>this.onBrandIconError(o.integrationDomain)}
              ></image>
            `}
        <circle class="pin-hit" cx=${t} cy=${e} r=${1.4*i}></circle>
      </g>
    `}}const be=1e3,xe=750,we=14,ke="#03a9f4";let $e=class extends ct{constructor(){super(...arguments),this.rooms=[],this.pins=[],this.walls=[],this.openings=[],this.scale=null,this.unitSystem="metric",this.meshLinks=[],this.meshStubs=[],this.entityLookup=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.5,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.alignOverlay=null,this.initialViewBox=null,this.sameBuildingAsPrevious=!1,this.mode="select",this.snapMode="all",this.armedEntityId=null,this.armedOpeningType=null,this.selectedRoomId=null,this.editingRoomId=null,this.editingWallId=null,this.selectedPinId=null,this.selectedWallId=null,this.selectedOpeningId=null,this.selectedMeshLinkKey=null,this.selectedMeshStubKey=null,this._viewBox={x:0,y:0,w:be,h:xe},this._naturalHeight=xe,this._alignNaturalHeight=xe,this._pendingTrace=null,this._hoverSnap=null,this._pendingScalePoints=[],this._liveEditPoints=null,this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._gestureCancelled=!1,this._vertexDragStartPoints=null,this._liveDragPin=null,this._liveOpeningEdit=null,this._selectedVertexIndex=null,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastImage=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._hasFittedOnce=!1,this._onPointerDown=t=>{if("mouse"===t.pointerType&&0!==t.button)return;if(Qt(this),this._svg.setPointerCapture(t.pointerId),this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,o={x:(e.x+i.x)/2,y:(e.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:zt(e.x,e.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}if(this._pointers.size>2)return;const e=this._clientToImage(t.clientX,t.clientY);this._downClient={x:t.clientX,y:t.clientY},this._lastImage=e,this._lastClient={x:t.clientX,y:t.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(t.clientX,t.clientY,e):{type:"empty"}},this._onPointerMove=t=>{if(!this._pointers.has(t.pointerId)){if("wall"===this.mode||"trace"===this.mode){const e=this._clientToImage(t.clientX,t.clientY);this._hoverSnap=this._snappedGeometryPoint(this._pendingTrace?.points??[],e.x,e.y,t.shiftKey)}else this._hoverSnap&&(this._hoverSnap=null);return}if(this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,o=zt(e.x,e.y,i.x,i.y)||1,n=this._gesture.startDistance/o,s=this._gesture.startViewBox,r=Ht(s.w*n,250,4e3),a=r/s.w,l=s.h*a,{x:c,y:d}=this._gesture.midImage;return void(this._viewBox={x:c-(c-s.x)*a,y:d-(d-s.y)*a,w:r,h:l})}if(1!==this._pointers.size||!this._downClient||!this._lastImage)return;if(this._gestureCancelled)return;if(!this._moved){if(zt(this._downClient.x,this._downClient.y,t.clientX,t.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"!==this._gesture?.kind&&"alignDrag"!==this._gesture?.kind||(this._svg.style.cursor="grabbing")}const e=this._clientToImage(t.clientX,t.clientY);if("pan"===this._gesture?.kind){const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};this._viewBox={...this._viewBox,x:this._viewBox.x-(t.clientX-i.x)/e,y:this._viewBox.y-(t.clientY-i.y)/e}}else if("alignDrag"===this._gesture?.kind){const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};this.dispatchEvent(new CustomEvent("align-drag",{detail:{dx:(t.clientX-i.x)/e,dy:(t.clientY-i.y)/e}}))}else if("vertex"===this._gesture?.kind&&this._liveEditPoints){const i="room"===this._editingTarget?.kind,[o,n]=this._snappedVertexPoint(this._liveEditPoints,this._gesture.index,e.x,e.y,i,t.shiftKey),s=[...this._liveEditPoints];s[this._gesture.index]=[o,n],this._liveEditPoints=s}else if("pin"===this._gesture?.kind)this._liveDragPin={id:this._gesture.pinId,x:e.x,y:e.y};else if("roomMove"===this._gesture?.kind){let i=e.x-this._gesture.startX,o=e.y-this._gesture.startY;const n=this._pxToUnits(10);let s={x:null,y:null};if(Math.hypot(i,o)<=n)i=0,o=0;else if(!t.shiftKey){const t=this._snapRoomMove(this._gesture.roomId,i,o,n);i=t.dx,o=t.dy,s=t.guides}this._liveRoomMove={id:this._gesture.roomId,dx:i,dy:o},this._roomMoveGuides=s}else if("roomLabel"===this._gesture?.kind)this._liveRoomLabel={id:this._gesture.roomId,x:e.x,y:e.y};else if("openingMove"===this._gesture?.kind){const t=this._gesture,i=this.openings.find(e=>e.id===t.openingId),o=i&&this.walls.find(t=>t.id===i.wallId);if(i&&o){const t=this._effectivePoints("wall",o.id,o.points),{point:n}=Gt(t,e.x,e.y);this._liveOpeningEdit={id:i.id,x:n[0],y:n[1],width:i.width}}}else if("openingHandle"===this._gesture?.kind){const t=this._gesture,i=this.openings.find(e=>e.id===t.openingId),o=i&&this.walls.find(t=>t.id===i.wallId),n=i&&this._openingEndpoints(i);if(i&&o&&n){const s=this._effectivePoints("wall",o.id,o.points),{point:r}=Gt(s,e.x,e.y),a=n[0===t.whichEnd?1:0],l=[(a[0]+r[0])/2,(a[1]+r[1])/2],c=zt(a[0],a[1],r[0],r[1]);this._liveOpeningEdit={id:i.id,x:l[0],y:l[1],width:c}}}this._lastImage=this._clientToImage(t.clientX,t.clientY),this._lastClient={x:t.clientX,y:t.clientY}},this._onPointerLeave=()=>{this._hoverSnap=null},this._onPointerUp=t=>{this._pointers.delete(t.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(t.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._gestureCancelled||(this._moved?this._commitGesture():this._downClient&&this._handleClick(this._downClient.x,this._downClient.y,t.shiftKey)),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1,this._vertexDragStartPoints=null)},this._onWheel=t=>{if(t.preventDefault(),t.ctrlKey){const e=t.deltaY<0?.9:1.1;return void this._zoomBy(e,this._clientToImage(t.clientX,t.clientY))}const e=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+t.deltaX*e,y:this._viewBox.y+t.deltaY*e}},this._liveRoomLabel=null,this._pinIcons=new fe(this)}get _editingTarget(){return this.editingRoomId?{kind:"room",id:this.editingRoomId}:this.editingWallId?{kind:"wall",id:this.editingWallId}:null}_rawPointsFor(t){return"room"===t.kind?this.rooms.find(e=>e.id===t.id)?.points??null:this.walls.find(e=>e.id===t.id)?.points??null}willUpdate(t){if(t.has("editingRoomId")||t.has("editingWallId")){const t=this._editingTarget,e=t?this._rawPointsFor(t):null;this._liveEditPoints=e?[...e]:null,this._selectedVertexIndex=null}t.has("mode")&&(this._pendingTrace=null,this._pendingScalePoints=[])}firstUpdated(){this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl,this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(t){if(t.has("backgroundImageUrl")&&this.backgroundImageUrl){const t=new Image;t.onload=()=>{this._naturalHeight=t.naturalHeight/t.naturalWidth*be||xe,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},t.src=this.backgroundImageUrl}if(t.has("initialViewBox")){const t=this.initialViewBox,e=this._viewBox;t&&t.x===e.x&&t.y===e.y&&t.w===e.w&&t.h===e.h?this._hasFittedOnce=!0:t?(this._viewBox={...t},this._hasFittedOnce=!0):this.sameBuildingAsPrevious||(this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl)}if(t.has("alignOverlay")){const e=t.get("alignOverlay");if(this.alignOverlay&&this.alignOverlay.imageUrl!==e?.imageUrl){const t=new Image;t.onload=()=>{this._alignNaturalHeight=t.naturalHeight/t.naturalWidth*be||xe},t.src=this.alignOverlay.imageUrl}}if(t.has("_pendingTrace")||t.has("_pendingScalePoints")){const t="scale"===this.mode?this._pendingScalePoints.length:this._pendingTrace?.points.length??0;this.dispatchEvent(new CustomEvent("pending-changed",{detail:{count:t}}))}}_contentBounds(){const t=[];for(const e of this.rooms)t.push(...e.points);for(const e of this.walls)t.push(...e.points);for(const e of this.pins)t.push([e.x,e.y]);if(0===t.length)return null;const e=t.map(([t])=>t),i=t.map(([,t])=>t),o=Math.min(...e),n=Math.max(...e),s=Math.min(...i),r=Math.max(...i),a=.08*Math.max(n-o,r-s)||40;return{x:o-a,y:s-a,w:n-o+2*a,h:r-s+2*a}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:be,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const t=this._svg?.getBoundingClientRect(),e=t?.width||this._viewBox.w,i=t?.height||this._viewBox.h,o=Math.min(e/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(e-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(t){return t/this._svgTransform().scale}_clientToImage(t,e){const i=this._svg,o=i.createSVGPoint();o.x=t,o.y=e;const n=i.getScreenCTM();if(!n)return{x:0,y:0};const s=o.matrixTransform(n.inverse());return{x:s.x,y:s.y}}_effectivePoints(t,e,i){const o=this._editingTarget;if(o&&o.kind===t&&o.id===e&&this._liveEditPoints)return this._liveEditPoints;const n=this._liveRoomMove;return"room"===t&&n?.id===e?i.map(([t,e])=>[t+n.dx,e+n.dy]):i}get _displayPins(){const t=this._liveRoomMove;return t?this.pins.map(e=>e.room_id===t.id?{...e,x:e.x+t.dx,y:e.y+t.dy}:e):this.pins}_snappedTracePoint(t,e,i,o){if(o||0===t.length)return{point:[e,i],lockedX:!1,lockedY:!1};const n=this._pxToUnits(10),s=t[t.length-1],r=t[0],a=t.length>=3&&(r[0]!==s[0]||r[1]!==s[1])?[s,r]:[s];let l=null,c=1/0,d=null,h=1/0;for(const[t,o]of a){const s=Math.abs(e-t),r=Math.abs(i-o);s>n&&r>n||(s<=r?s<c&&(l=t,c=s):r<h&&(d=o,h=r))}return{point:[l??e,d??i],lockedX:null!==l,lockedY:null!==d}}_snappedVertexPoint(t,e,i,o,n,s){if(s||"off"===this.snapMode)return[i,o];const r=this._pxToUnits(10),a=e>0?e-1:n?t.length-1:-1;if(a>=0&&a!==e)return Zt(t[a],[i,o],r);const l=e<t.length-1?e+1:n?0:-1;return l>=0&&l!==e?Zt(t[l],[i,o],r):[i,o]}_effectiveOpening(t){return this._liveOpeningEdit?.id===t.id?{...t,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}:t}_openingEndpoints(t){const e=this.walls.find(e=>e.id===t.wallId);if(!e)return null;const i=this._effectivePoints("wall",e.id,e.points),o=this._effectiveOpening(t);return Jt(o.x,o.y,o.width,i)}_snappedGeometryPoint(t,e,i,o){const n=o||"off"===this.snapMode;if(!n){const t=this._pxToUnits(we),o="all"===this.snapMode||"wall"===this.mode,n="all"===this.snapMode||"trace"===this.mode;let s=null;for(const n of o?this.walls:[]){const o=parseFloat(this._wallStrokeWidth(n,Mt(n.material)))/2,r=Math.max(t,o);if(jt(e,i,n.points)>r)continue;const a=Gt(n.points,e,i).point,l=zt(e,i,a[0],a[1]);(!s||l<s.dist)&&(s={point:a,dist:l})}const r=n?function(t,e,i,o){let n=null,s=o;for(const o of t){if(o.points.length<2)continue;const{point:t}=qt(o.points,e,i),r=zt(e,i,t[0],t[1]);r<=s&&(n=o,s=r)}return n}(this.rooms,e,i,t):null;if(r){const t=qt(r.points,e,i).point,o=zt(e,i,t[0],t[1]);(!s||o<s.dist)&&(s={point:t,dist:o})}if(s)return{point:s.point,kind:"geometry",lockedX:!1,lockedY:!1}}const{point:s,lockedX:r,lockedY:a}=this._snappedTracePoint(t,e,i,n);return{point:s,kind:r||a?"axis":"none",lockedX:r,lockedY:a}}_hitTest(t,e,i){const o=this._pxToUnits(we);if("select"!==this.mode)return{type:"empty"};const n=this._editingTarget;if(n&&this._liveEditPoints){const t=this._liveEditPoints,e=ue(t,i.x,i.y,o);if(null!==e)return{type:"vertex",index:e};const s=ue("room"===n.kind?Xt(t):Kt(t),i.x,i.y,o);if(null!==s)return{type:"edgeMidpoint",index:s};const r="room"===n.kind?this.rooms.find(t=>t.id===n.id):void 0;return r&&this._roomLabelHit(r,i,o)?{type:"roomLabel",room:r}:{type:"empty"}}const s=this.rooms.find(t=>t.id===this.selectedRoomId);if(s&&this._roomLabelHit(s,i,o))return{type:"roomLabel",room:s};const r=pe(this.pins,i.x,i.y,o);if(r.length>1)return{type:"pinStack",pins:r};if(1===r.length)return{type:"pin",pin:r[0]};const a=function(t,e,i,o){let n=null,s=o;for(const o of t){const t=jt(e,i,[[o.fromPin.x,o.fromPin.y],[o.toPin.x,o.toPin.y]]);t<=s&&(n=o,s=t)}return n}(this.meshLinks,i.x,i.y,o);if(a)return{type:"meshLink",link:a};const l=function(t,e,i,o){let n=null,s=o;for(const o of t){const t=Math.min(zt(o.x,o.y,e,i),jt(e,i,[[o.fromPin.x,o.fromPin.y],[o.x,o.y]]));t<=s&&(n=o,s=t)}return n}(this.meshStubs,i.x,i.y,o);if(l)return{type:"meshStub",stub:l};if(this.selectedOpeningId){const t=this.openings.find(t=>t.id===this.selectedOpeningId),e=t?this._openingEndpoints(t):null;if(t&&e){const n=ue(e,i.x,i.y,o);if(null!==n)return{type:"openingHandle",opening:t,whichEnd:n}}}const c=function(t,e,i,o,n){let s=null,r=n;for(const n of t){const t=e.find(t=>t.id===n.wallId);if(!t)continue;const a=Jt(n.x,n.y,n.width,t.points);if(!a)continue;const l=jt(i,o,a);l<=r&&(s=n,r=l)}return s}(this.openings,this.walls,i.x,i.y,o);if(c)return{type:"opening",opening:c};const d=_e(this.walls,i.x,i.y,o);if(d)return{type:"wall",wall:d};const h=this.rooms.find(t=>t.points.length>=3&&Wt(i.x,i.y,t.points));return h?{type:"room",room:h}:{type:"empty"}}_lockGesture(){return"align"===this.mode?{kind:"alignDrag"}:"vertex"===this._downHit?.type?(this._vertexDragStartPoints=this._liveEditPoints?[...this._liveEditPoints]:null,{kind:"vertex",index:this._downHit.index}):"pin"===this._downHit?.type?{kind:"pin",pinId:this._downHit.pin.id}:"roomLabel"===this._downHit?.type?{kind:"roomLabel",roomId:this._downHit.room.id}:"room"===this._downHit?.type&&this._downHit.room.id===this.selectedRoomId&&this._lastImage?{kind:"roomMove",roomId:this._downHit.room.id,startX:this._lastImage.x,startY:this._lastImage.y}:"openingHandle"===this._downHit?.type?{kind:"openingHandle",openingId:this._downHit.opening.id,whichEnd:this._downHit.whichEnd}:"opening"===this._downHit?.type?{kind:"openingMove",openingId:this._downHit.opening.id}:{kind:"pan"}}_dispatchVertexChanged(t){const e=this._editingTarget;if(!e)return;const i="room"===e.kind?"room-vertex-changed":"wall-vertex-changed",o="room"===e.kind?"roomId":"wallId";this.dispatchEvent(new CustomEvent(i,{detail:{[o]:e.id,points:t}}))}_commitGesture(){if("vertex"===this._gesture?.kind&&this._editingTarget&&this._liveEditPoints)this._dispatchVertexChanged(this._liveEditPoints);else if("pin"===this._gesture?.kind&&this._liveDragPin)this.dispatchEvent(new CustomEvent("pin-move",{detail:{pinId:this._liveDragPin.id,x:this._liveDragPin.x,y:this._liveDragPin.y}})),this._liveDragPin=null;else if("roomMove"===this._gesture?.kind&&this._liveRoomMove){const{dx:t,dy:e}=this._liveRoomMove;if(this._roomMoveGuides={x:null,y:null},0===t&&0===e)return void(this._liveRoomMove=null);this.dispatchEvent(new CustomEvent("room-move",{detail:{roomId:this._liveRoomMove.id,dx:this._liveRoomMove.dx,dy:this._liveRoomMove.dy}})),this._liveRoomMove=null}else"roomLabel"===this._gesture?.kind&&this._liveRoomLabel?(this.dispatchEvent(new CustomEvent("room-label-moved",{detail:{roomId:this._liveRoomLabel.id,x:this._liveRoomLabel.x,y:this._liveRoomLabel.y}})),this._liveRoomLabel=null):"openingMove"!==this._gesture?.kind&&"openingHandle"!==this._gesture?.kind||!this._liveOpeningEdit||(this.dispatchEvent(new CustomEvent("opening-update",{detail:{openingId:this._liveOpeningEdit.id,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}})),this._liveOpeningEdit=null)}_handleClick(t,e,i=!1){const o=this._clientToImage(t,e);if("trace"===this.mode){const t=this._pxToUnits(we),e=this._pendingTrace??{points:[]},{point:[n,s]}=this._snappedGeometryPoint(e.points,o.x,o.y,i),r=ge(e,n,s,t);return void(r.closed?(this.dispatchEvent(new CustomEvent("room-trace-complete",{detail:{points:e.points}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("wall"===this.mode){const t=this._pxToUnits(we),e=this._pendingTrace??{points:[]},{point:[n,s]}=this._snappedGeometryPoint(e.points,o.x,o.y,i),r=ge(e,n,s,t);return void(r.closed?(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:[...e.points,e.points[0]]}})),this._pendingTrace=null):this._pendingTrace=r.trace)}if("opening"===this.mode){if(!this.armedOpeningType)return;const t=this._pxToUnits(we),e=_e(this.walls,o.x,o.y,t);if(!e)return;const{point:i}=Gt(e.points,o.x,o.y);return void this.dispatchEvent(new CustomEvent("opening-place",{detail:{wallId:e.id,x:i[0],y:i[1]}}))}if("scale"===this.mode){const t=[...this._pendingScalePoints,[o.x,o.y]];return void(t.length>=2?(this.dispatchEvent(new CustomEvent("scale-line-complete",{detail:{points:t.slice(0,2)}})),this._pendingScalePoints=[]):this._pendingScalePoints=t)}if("place"===this.mode){if(this.armedEntityId){const t=this._pxToUnits(we),e=pe(this.pins,o.x,o.y,t)[0],i=e?.x??o.x,n=e?.y??o.y;this.dispatchEvent(new CustomEvent("pin-place",{detail:{x:i,y:n}}))}return}const n=this._downHit??{type:"empty"};if("vertex"===n.type)this._selectedVertexIndex=this._selectedVertexIndex===n.index?null:n.index;else if("edgeMidpoint"===n.type&&this._editingTarget&&this._liveEditPoints){const t=("room"===this._editingTarget.kind?Xt(this._liveEditPoints):Kt(this._liveEditPoints))[n.index],e=[...this._liveEditPoints];e.splice(n.index+1,0,t),this._liveEditPoints=e,this._dispatchVertexChanged(e)}else if("pin"===n.type)this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:this.selectedPinId===n.pin.id?null:n.pin.id}}));else if("pinStack"===n.type)this.dispatchEvent(new CustomEvent("pin-stack-select",{detail:{pinIds:n.pins.map(t=>t.id)}}));else if("roomLabel"===n.type&&this._editingTarget);else if("room"===n.type||"roomLabel"===n.type)this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:this.selectedRoomId===n.room.id?null:n.room.id}}));else if("wall"===n.type)this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:this.selectedWallId===n.wall.id?null:n.wall.id}}));else if("opening"===n.type)this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:this.selectedOpeningId===n.opening.id?null:n.opening.id}}));else if("meshLink"===n.type){const t=`${n.link.fromPin.id}|${n.link.toPin.id}`;this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:this.selectedMeshLinkKey===t?null:n.link}}))}else if("meshStub"===n.type){const t=`${n.stub.fromPin.id}|${n.stub.targetDeviceId}`;this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:this.selectedMeshStubKey===t?null:n.stub}}))}else if(this._editingTarget&&null!==this._selectedVertexIndex&&this._liveEditPoints){const t="room"===this._editingTarget.kind,[e,n]=this._snappedVertexPoint(this._liveEditPoints,this._selectedVertexIndex,o.x,o.y,t,i),s=[...this._liveEditPoints];s[this._selectedVertexIndex]=[e,n],this._liveEditPoints=s,this._selectedVertexIndex=null,this._dispatchVertexChanged(s)}else this._selectedVertexIndex=null,this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:null}})),this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:null}})),this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:null}})),this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:null}})),this.dispatchEvent(new CustomEvent("mesh-link-select",{detail:{link:null}})),this.dispatchEvent(new CustomEvent("mesh-stub-select",{detail:{stub:null}}))}finishPendingWall(){"wall"!==this.mode||!this._pendingTrace||this._pendingTrace.points.length<2||(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:this._pendingTrace.points}})),this._pendingTrace=null)}cancelGesture(){const t=this._gesture?.kind;return!(!this._moved||!t||"pan"===t||"pinch"===t||"alignDrag"===t)&&("vertex"===t&&this._vertexDragStartPoints&&(this._liveEditPoints=this._vertexDragStartPoints),this._liveRoomMove=null,this._roomMoveGuides={x:null,y:null},this._liveDragPin=null,this._liveRoomLabel=null,this._liveOpeningEdit=null,this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_snapRoomMove(t,e,i,o){const n=this.rooms.find(e=>e.id===t);if(!n)return{dx:e,dy:i,guides:{x:null,y:null}};const s=[...this.rooms.filter(e=>e.id!==t).flatMap(t=>t.points),...this.walls.flatMap(t=>t.points)];let r=null,a=null;for(const[t,l]of n.points){const n=t+e,c=l+i;for(const[t,e]of s){const i=t-n;Math.abs(i)<=o&&(!r||Math.abs(i)<Math.abs(r.delta))&&(r={delta:i,at:t});const s=e-c;Math.abs(s)<=o&&(!a||Math.abs(s)<Math.abs(a.delta))&&(a={delta:s,at:e})}}return{dx:e+(r?.delta??0),dy:i+(a?.delta??0),guides:{x:r?.at??null,y:a?.at??null}}}undoLastPoint(){if("scale"===this.mode&&this._pendingScalePoints.length>0)return this._pendingScalePoints=this._pendingScalePoints.slice(0,-1),!0;const t=this._pendingTrace?.points;return!(!t||0===t.length)&&(this._pendingTrace=t.length>1?{points:t.slice(0,-1)}:null,!0)}cancelPending(){this._pendingTrace=null,this._pendingScalePoints=[]}_deleteSelectedVertex(){const t=this._editingTarget;if(null===this._selectedVertexIndex||!t||!this._liveEditPoints)return;const e="room"===t.kind?3:2;if(this._liveEditPoints.length<=e)return;const i=this._liveEditPoints.filter((t,e)=>e!==this._selectedVertexIndex);this._liveEditPoints=i,this._selectedVertexIndex=null,this._dispatchVertexChanged(i)}_zoomBy(t,e){const i=Ht(this._viewBox.w*t,250,4e3),o=i/this._viewBox.w,n=this._viewBox.h*o;this._viewBox={x:e.x-(e.x-this._viewBox.x)*o,y:e.y-(e.y-this._viewBox.y)*o,w:i,h:n}}_zoomButton(t){const e=this._viewBox;this._zoomBy(t,{x:e.x+e.w/2,y:e.y+e.h/2})}_pinLabel(t){return t.label_override?t.label_override:wt(t.device_id,this.entityLookup.values())}_roomLabelPosition(t,e){if(this._liveRoomLabel?.id===t.id)return[this._liveRoomLabel.x,this._liveRoomLabel.y];const i=this._liveRoomMove?.id===t.id?this._liveRoomMove:null,[o,n]=t.label_position??function(t){const e=Vt.get(t);if(e)return e;const i=t.length>=3?(()=>{const[e,i]=At([t],1);return[e,i]})():function(t){if(0===t.length)return[0,0];let e=0,i=0;for(const[o,n]of t)e+=o,i+=n;return[e/t.length,i/t.length]}(t);return Vt.set(t,i),i}(i?t.points:e);return i?[o+i.dx,n+i.dy]:[o,n]}_roomLabelHit(t,e,i){if(!1===t.visible)return!1;const o=this._effectivePoints("room",t.id,t.points);if(o.length<2)return!1;const[n,s]=this._roomLabelPosition(t,o),r=9*t.name.length/2;return e.x>=n-r-i&&e.x<=n+r+i&&e.y>=s-13-i&&e.y<=s+4+i}_renderRoom(t){if(!1===t.visible)return X;const e=this._effectivePoints("room",t.id,t.points);if(e.length<2)return X;const i=e.map(([t,e])=>`${t},${e}`).join(" "),[o,n]=this._roomLabelPosition(t,e),s=this.editingRoomId===t.id,r=t.id===this.selectedRoomId||s,a=t.fill_color??ke,l=t.fill_opacity??.18,c=t.border_opacity??1,d=this._liveRoomMove?.id===t.id?this._liveRoomMove:null,h=!d||0===d.dx&&0===d.dy?X:Y`<polygon
            class="room-ghost"
            points=${t.points.map(([t,e])=>`${t},${e}`).join(" ")}
          ></polygon>`;return Y`
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
      <text class="room-label" x=${o} y=${n}>${t.name}</text>
      ${s?this._renderVertexHandles(e,!0):X}
    `}_renderVertexHandles(t,e){const i=this._pxToUnits(6),o=this._pxToUnits(4),n=e?Xt(t):Kt(t);return Y`
      ${n.map(([t,e])=>Y`<circle class="midpoint-handle" cx=${t} cy=${e} r=${o}></circle>`)}
      ${t.map(([t,e],o)=>{const n=o===this._selectedVertexIndex;return Y`
          <circle
            class="vertex-handle ${n?"selected":""}"
            cx=${t}
            cy=${e}
            r=${i}
          ></circle>
          ${n?Y`
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
              `:X}
        `})}
    `}_livePinPosition(t){if(this._liveDragPin?.id===t.id)return this._liveDragPin;const e=this._liveRoomMove;return e&&t.room_id===e.id?{x:t.x+e.dx,y:t.y+e.dy}:t}_renderMeshLink(t){const e=`${t.fromPin.id}|${t.toPin.id}`,i=this._livePinPosition(t.fromPin),o=this._livePinPosition(t.toPin);return Y`
      <line
        class="mesh-link ${e===this.selectedMeshLinkKey?"selected":""}"
        x1=${i.x}
        y1=${i.y}
        x2=${o.x}
        y2=${o.y}
        style="stroke:${vt(t.quality)}"
      >
        <title>${t.detail??t.quality}</title>
      </line>
    `}_renderRoomMoveGuides(){if(!this._liveRoomMove)return X;const{x:t,y:e}=this._roomMoveGuides,i=this._viewBox;return Y`
      ${null!==t?Y`<line class="axis-guide" x1=${t} y1=${i.y} x2=${t} y2=${i.y+i.h}></line>`:X}
      ${null!==e?Y`<line class="axis-guide" x1=${i.x} y1=${e} x2=${i.x+i.w} y2=${e}></line>`:X}
    `}_renderMeshStubLine(t){const e=`${t.fromPin.id}|${t.targetDeviceId}`,i=this._livePinPosition(t.fromPin);return Y`
      <line
        class="mesh-stub-line ${e===this.selectedMeshStubKey?"selected":""}"
        x1=${i.x}
        y1=${i.y}
        x2=${t.x}
        y2=${t.y}
        style="stroke:${vt(t.quality)}"
      >
        <title>${t.targetLabel} (${t.targetFloorName})</title>
      </line>
    `}_renderMeshStubMarkers(){const t=this._pxToUnits(10),e=this._pxToUnits(12),i=new Map;for(const t of this.meshStubs){const e=`${t.targetDeviceId}|${t.x},${t.y}`,o=`${t.fromPin.id}|${t.targetDeviceId}`===this.selectedMeshStubKey,n=i.get(e);n?o&&(n.selected=!0):i.set(e,{stub:t,selected:o})}const o=(t,e)=>t.minX<e.maxX&&e.minX<t.maxX&&t.minY<e.maxY&&e.minY<t.maxY,n=[];for(const t of this.rooms){if(!1===t.visible)continue;const e=this._effectivePoints("room",t.id,t.points);if(e.length<2)continue;const[i,o]=this._roomLabelPosition(t,e),s=9*t.name.length/2;n.push({minX:i-s,maxX:i+s,minY:o-13,maxY:o+4})}const s=this.pins.map(t=>({minX:t.x-e,maxX:t.x+e,minY:t.y-e,maxY:t.y+e}));return[...i.values()].map(({stub:e,selected:i})=>{const r=(e=>{const i=7*e.targetFloorName.length/2;return{minX:e.x-i,maxX:e.x+i,minY:e.y+t+3,maxY:e.y+t+17}})(e),a=!s.some(t=>o(r,t))&&!n.some(t=>o(r,t));return a&&n.push(r),Y`
        ${this._renderPinMarker(e.x,e.y,t,{kind:"path",d:"M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z"},"var(--sc-fg-secondary)",i,`${e.targetLabel} (${e.targetFloorName})`)}
        ${a?Y`<text class="mesh-stub-label" x=${e.x} y=${e.y+t+14}
                >${e.targetFloorName}</text
              >`:X}
      `})}_iconForPin(t){return this._pinIcons.iconForPin(t,this.entityLookup.values())}_pinGroups(){const t=new Map;for(const e of this._displayPins){const i=`${e.x},${e.y}`;t.has(i)||t.set(i,[]),t.get(i).push(e)}return[...t.values()].map(t=>({x:t[0].x,y:t[0].y,pins:t}))}_renderPinGroup(t){const e=this._pxToUnits(12);if(1===t.pins.length){const i=t.pins[0],o=this._liveDragPin?.id===i.id?this._liveDragPin:null,n=o?.x??i.x,s=o?.y??i.y,r=i.id===this.selectedPinId;return this._renderPinMarker(n,s,e,this._iconForPin(i),"var(--sc-accent)",r,this._pinLabel(i))}const i=t.pins.some(t=>t.id===this.selectedPinId),o=`${t.pins.length} devices: ${t.pins.map(t=>this._pinLabel(t)).join(", ")}`;return this._renderPinMarker(t.x,t.y,e,{kind:"path",d:"M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10M12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4M6 16C7.1 16 8 16.9 8 18S7.1 20 6 20 4 19.1 4 18 4.9 16 6 16M6 10C7.1 10 8 10.9 8 12S7.1 14 6 14 4 13.1 4 12 4.9 10 6 10M6 4C7.1 4 8 4.9 8 6S7.1 8 6 8 4 7.1 4 6 4.9 4 6 4M18 16C19.1 16 20 16.9 20 18S19.1 20 18 20 16 19.1 16 18 16.9 16 18 16M18 10C19.1 10 20 10.9 20 12S19.1 14 18 14 16 13.1 16 12 16.9 10 18 10M18 4C19.1 4 20 4.9 20 6S19.1 8 18 8 16 7.1 16 6 16.9 4 18 4Z"},"var(--sc-accent)",i,o)}_renderPinMarker(t,e,i,o,n,s,r){return this._pinIcons.renderMarker(t,e,i,o,n,s,r)}_renderPendingTrace(){const t=this._pendingTrace?.points??[];if(0===t.length&&!this._hoverSnap)return X;const e=t.map(([t,e])=>`${t},${e}`).join(" "),i=this._pxToUnits(6),o=t[t.length-1],n=t[0],s=!!this._hoverSnap&&!!n&&t.length>=3&&zt(this._hoverSnap.point[0],this._hoverSnap.point[1],n[0],n[1])<=this._pxToUnits(we);return Y`
      ${t.length>0?Y`<polyline class="pending-trace" points=${e}></polyline>`:X}
      ${t.map(([t,e],o)=>Y`
          <circle
            class="vertex-handle ${0===o&&s?"closing":""}"
            cx=${t}
            cy=${e}
            r=${0===o&&s?1.6*i:i}
          ></circle>
        `)}
      ${this._hoverSnap?this._renderHoverSnap(o,n,s,i):X}
    `}_renderHoverSnap(t,e,i,o){if(!this._hoverSnap)return X;const[n,s]=this._hoverSnap.point,r=this._viewBox,a=i&&e?e:[n,s];return Y`
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
      ${t?Y`<line
              class="hover-snap-line ${i?"closing":""}"
              x1=${t[0]}
              y1=${t[1]}
              x2=${a[0]}
              y2=${a[1]}
            ></line>`:X}
      ${i?X:Y`<circle
              class="hover-snap-marker ${"geometry"===this._hoverSnap.kind?"on-geometry":"axis"===this._hoverSnap.kind?"on-axis":""}"
              cx=${n}
              cy=${s}
              r=${o}
            ></circle>`}
    `}_wallStrokeWidth(t,e){if(this.scale){const[[e,i],[o,n]]=this.scale.points,s=(zt(e,i,o,n)||1)/this.scale.meters;return`${Ht(St(t)/100*s,.5,40)}`}return`${Ht(4+e.attenuationDbPerCm*St(t)/3,4,8)}px`}_renderWall(t){const e=this._effectivePoints("wall",t.id,t.points),i=t.id===this.selectedWallId,o=this.editingWallId===t.id,n=Mt(t.material),s=this._wallStrokeWidth(t,n),r=e[0],a=e[e.length-1],l=e.length>2&&!!r&&!!a&&r[0]===a[0]&&r[1]===a[1],c=(l?e.slice(0,-1):e).map(([t,e])=>`${t},${e}`).join(" "),d="wall-line "+(i||o?"selected":""),h=`stroke:${n.color}; stroke-width:${s}`;return Y`
      ${l?Y`<polygon class=${d} points=${c} style=${h}><title>${n.label}</title></polygon>`:Y`<polyline class=${d} points=${c} style=${h}><title>${n.label}</title></polyline>`}
      ${o?this._renderVertexHandles(e,!1):X}
    `}_renderOpening(t){const e=this._openingEndpoints(t);if(!e)return X;const[[i,o],[n,s]]=e,r=t.id===this.selectedOpeningId,a=this._pxToUnits(6),l=this.walls.find(e=>e.id===t.wallId),c=l?this._wallStrokeWidth(l,Mt(l.material)):void 0,d=zt(i,o,n,s)||1,h=parseFloat(c??"6")/2*1.5,p=-(s-o)/d*h,u=(n-i)/d*h,_=(t,e)=>Y`
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
        y1=${o}
        x2=${n}
        y2=${s}
        style=${c?`stroke-width:${c}`:X}
      >
        <title>${t.type}</title>
      </line>
      ${_(i,o)}
      ${_(n,s)}
      ${r?Y`
            <circle class="opening-handle" cx=${i} cy=${o} r=${a}></circle>
            <circle class="opening-handle" cx=${n} cy=${s} r=${a}></circle>
          `:X}
    `}_renderScaleLine(){if(!this.scale)return X;const[[t,e],[i,o]]=this.scale.points;return Y`
      <line class="scale-line" x1=${t} y1=${e} x2=${i} y2=${o}></line>
      <text class="scale-label" x=${(t+i)/2} y=${(e+o)/2-6}>
        ${oe(this.scale.meters,this.unitSystem)}
        ${ie(this.unitSystem)}
      </text>
    `}_renderPendingScale(){if(0===this._pendingScalePoints.length)return X;const t=this._pxToUnits(6),[e,i]=this._pendingScalePoints[0];return Y`<circle class="vertex-handle" cx=${e} cy=${i} r=${t}></circle>`}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return X;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),o=e+t*(this.backgroundOffsetX-this._viewBox.x),n=i+t*(this.backgroundOffsetY-this._viewBox.y),s=t*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${be}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderAlignOverlay(){if(!this.alignOverlay)return X;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),o=e+t*(this.alignOverlay.offsetX-this._viewBox.x),n=i+t*(this.alignOverlay.offsetY-this._viewBox.y),s=t*this.alignOverlay.scale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.alignOverlay.imageUrl}
          style="width:${be}px; height:${this._alignNaturalHeight}px; opacity:${this.alignOverlay.opacity};"
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
          ${this._renderRoomMoveGuides()}
          ${"trace"===this.mode||"wall"===this.mode?this._renderPendingTrace():X}
          ${this._renderScaleLine()}
          ${"scale"===this.mode?this._renderPendingScale():X}
          ${this._pinGroups().map(t=>this._renderPinGroup(t))}
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
    `}};$e.styles=[de,ve,r`
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
      ${he}
    `],t([ut({attribute:!1})],$e.prototype,"rooms",void 0),t([ut({attribute:!1})],$e.prototype,"pins",void 0),t([ut({attribute:!1})],$e.prototype,"walls",void 0),t([ut({attribute:!1})],$e.prototype,"openings",void 0),t([ut({attribute:!1})],$e.prototype,"scale",void 0),t([ut({attribute:!1})],$e.prototype,"unitSystem",void 0),t([ut({attribute:!1})],$e.prototype,"meshLinks",void 0),t([ut({attribute:!1})],$e.prototype,"meshStubs",void 0),t([ut({attribute:!1})],$e.prototype,"entityLookup",void 0),t([ut({attribute:!1})],$e.prototype,"backgroundImageUrl",void 0),t([ut({type:Number})],$e.prototype,"backgroundOpacity",void 0),t([ut({type:Number})],$e.prototype,"backgroundOffsetX",void 0),t([ut({type:Number})],$e.prototype,"backgroundOffsetY",void 0),t([ut({type:Number})],$e.prototype,"backgroundScale",void 0),t([ut({attribute:!1})],$e.prototype,"alignOverlay",void 0),t([ut({attribute:!1})],$e.prototype,"initialViewBox",void 0),t([ut({type:Boolean})],$e.prototype,"sameBuildingAsPrevious",void 0),t([ut({attribute:!1})],$e.prototype,"mode",void 0),t([ut({attribute:!1})],$e.prototype,"snapMode",void 0),t([ut({attribute:!1})],$e.prototype,"armedEntityId",void 0),t([ut({attribute:!1})],$e.prototype,"armedOpeningType",void 0),t([ut({attribute:!1})],$e.prototype,"selectedRoomId",void 0),t([ut({attribute:!1})],$e.prototype,"editingRoomId",void 0),t([ut({attribute:!1})],$e.prototype,"editingWallId",void 0),t([ut({attribute:!1})],$e.prototype,"selectedPinId",void 0),t([ut({attribute:!1})],$e.prototype,"selectedWallId",void 0),t([ut({attribute:!1})],$e.prototype,"selectedOpeningId",void 0),t([ut({attribute:!1})],$e.prototype,"selectedMeshLinkKey",void 0),t([ut({attribute:!1})],$e.prototype,"selectedMeshStubKey",void 0),t([_t()],$e.prototype,"_viewBox",void 0),t([_t()],$e.prototype,"_naturalHeight",void 0),t([_t()],$e.prototype,"_alignNaturalHeight",void 0),t([_t()],$e.prototype,"_pendingTrace",void 0),t([_t()],$e.prototype,"_hoverSnap",void 0),t([_t()],$e.prototype,"_pendingScalePoints",void 0),t([_t()],$e.prototype,"_liveEditPoints",void 0),t([_t()],$e.prototype,"_liveRoomMove",void 0),t([_t()],$e.prototype,"_roomMoveGuides",void 0),t([_t()],$e.prototype,"_liveDragPin",void 0),t([_t()],$e.prototype,"_liveOpeningEdit",void 0),t([_t()],$e.prototype,"_selectedVertexIndex",void 0),t([gt("svg")],$e.prototype,"_svg",void 0),t([_t()],$e.prototype,"_liveRoomLabel",void 0),$e=t([mt("floorplan-canvas")],$e);const Pe=85.0511287798;function Ie(t,e,i){const o=512*2**i,n=t/o*360-180,s=Math.PI-2*Math.PI*e/o;return{lat:180*Math.atan(Math.sinh(s))/Math.PI,lon:n}}function Me(t,e){const i=e*Math.PI/180,o=Math.cos(i),n=Math.sin(i);return{x:o*t.x-n*t.y,y:n*t.x+o*t.y}}function Se(t){const e=((t+180)%360+360)%360-180;return-180===e?180:e}const Ce=t=>t.rotation_deg??0;function Ee(t){return function(t,e,i){const o=512*2**i,n=Math.max(-Pe,Math.min(Pe,t))*Math.PI/180;return{x:(e+180)/360*o,y:(.5-Math.log(Math.tan(Math.PI/4+n/2))/(2*Math.PI))*o}}(t.lat,t.lon,t.zoom)}function Le(t,e,i,o,n){const{lat:s,lon:r}=Ie(e,i,o);return{...t,lat:s,lon:r,zoom:o,rotation_deg:Se(n)}}function Te(t,e,i){const o=Ee(t),n=Me({x:e,y:i},Ce(t));return Le(t,o.x-n.x,o.y-n.y,t.zoom,Ce(t))}function Oe(t,e,i){const o=Math.min(21,Math.max(3,t.zoom+Math.log2(e))),n=2**(o-t.zoom),s=Ce(t),r=Ee(t),a=Me(i,s);return Le(t,n*(r.x+a.x)-a.x,n*(r.y+a.y)-a.y,o,s)}function Be(t,e,i){const o=Ee(t),n=Me(i,Ce(t)),s=Me(i,e);return Le(t,o.x+n.x-s.x,o.y+n.y-s.y,t.zoom,e)}const Re={en:{floorTabs:{property:"Property"},appHeader:{saving:"Saving…",save:"Save"},canvas:{mode:{select:"Select",pan:"Pan",trace:"Trace Room",wall:"Trace Wall",door:"Add Door",window:"Add Window",scale:"Set Scale",place:"Place Device",align:"Align Floors"},snap:{tooltip:"What new points snap onto (hold Shift to place one point freely)",all:"Snap: all",walls:"Snap: walls only",rooms:"Snap: rooms only",off:"Snap: off"},hint:{closeRoom:"Click near the start to close the room.",addPoints:"Click to add points.",addWallPoints:"Click to add points.",addWallPointsFinish:"Click to add points, then Finish.",scaleFirst:"Click the first point of a known distance.",scaleSecond:"Click the second point.",placeOpening:"Click on a wall to place a {type}.",alignAgainst:"Align against:",noBackground:"That floor has no background image to align against.",alignDrag:"Drag to move, use +/− to resize, then Apply."},openingType:{door:"door",window:"window",opening:"opening"},openingLabel:{door:"door",window:"window"},button:{cancel:"Cancel",finishWall:"Finish Wall",chooseAnother:"Choose another",apply:"Apply",close:"Close"},align:{choose:"— Choose a floor —",shrink:"Shrink overlay slightly",grow:"Grow overlay slightly"},room:{custom:"— Custom —",outdoor:"Outdoor / no floor",hide:"Hide room",show:"Show room",color:"Room color",fillOpacity:"Fill opacity",borderOpacity:"Border opacity",rename:"Rename",doneEditing:"Done editing",editVertices:"Edit vertices",resetLabel:"Reset label position",delete:"Delete room"},pin:{setLabel:"Set label",setIcon:"Set icon",setHeight:"Set height",delete:"Delete pin",removeFromSpot:"Remove from this spot",stackTitle:"{count} devices at this spot"},wall:{material:"Wall material",thickness:"Wall thickness ({unit})",delete:"Delete wall"},opening:{width:"Width ({unit})",storedUnits:"stored units",calibrate:"Calibrate Scale for real units",delete:"Delete"},meshStub:{goToFloor:"Go to floor"},notCalibrated:"Not calibrated"},mapBackground:{noWebgl:"This browser can't draw the map (WebGL2 is needed).",failed:"Couldn't load the map: {error}",add:"Add map background",remove:"Remove map background",opacity:"Map opacity",adjust:"Move map (drag; Ctrl+scroll or pinch to zoom)",adjustHint:"Drag the map to line it up with your buildings.",zoomIn:"Zoom map in",zoomOut:"Zoom map out",rotation:"Rotation",resetRotation:"North up",done:"Done",style:"Map type",street:"Street map",aerial:"Aerial photo (Esri)"}},de:{floorTabs:{property:"Anwesen"},appHeader:{saving:"Speichert…",save:"Speichern"},canvas:{mode:{select:"Auswählen",pan:"Verschieben",trace:"Raum zeichnen",wall:"Wand zeichnen",door:"Tür hinzufügen",window:"Fenster hinzufügen",scale:"Maßstab festlegen",place:"Gerät platzieren",align:"Etagen ausrichten"},snap:{tooltip:"Woran neue Punkte einrasten (Umschalttaste halten, um einen Punkt frei zu setzen)",all:"Einrasten: alles",walls:"Einrasten: nur Wände",rooms:"Einrasten: nur Räume",off:"Einrasten: aus"},hint:{closeRoom:"Nahe dem Start klicken, um den Raum zu schließen.",addPoints:"Klicken, um Punkte hinzuzufügen.",addWallPoints:"Klicken, um Punkte hinzuzufügen.",addWallPointsFinish:"Klicken, um Punkte hinzuzufügen, dann „Fertig“.",scaleFirst:"Den ersten Punkt einer bekannten Strecke anklicken.",scaleSecond:"Den zweiten Punkt anklicken.",placeOpening:"Auf eine Wand klicken, um {type} zu platzieren.",alignAgainst:"Ausrichten an:",noBackground:"Diese Etage hat kein Hintergrundbild zum Ausrichten.",alignDrag:"Zum Verschieben ziehen, mit +/− die Größe ändern, dann „Anwenden“."},openingType:{door:"eine Tür",window:"ein Fenster",opening:"eine Öffnung"},openingLabel:{door:"Tür",window:"Fenster"},button:{cancel:"Abbrechen",finishWall:"Wand fertigstellen",chooseAnother:"Andere wählen",apply:"Anwenden",close:"Schließen"},align:{choose:"— Etage wählen —",shrink:"Überlagerung leicht verkleinern",grow:"Überlagerung leicht vergrößern"},room:{custom:"— Benutzerdefiniert —",outdoor:"Außenbereich / keine Etage",hide:"Raum ausblenden",show:"Raum einblenden",color:"Raumfarbe",fillOpacity:"Füllungsdeckkraft",borderOpacity:"Randdeckkraft",rename:"Umbenennen",doneEditing:"Bearbeitung beenden",editVertices:"Eckpunkte bearbeiten",resetLabel:"Beschriftungsposition zurücksetzen",delete:"Raum löschen"},pin:{setLabel:"Beschriftung festlegen",setIcon:"Symbol festlegen",setHeight:"Höhe festlegen",delete:"Pin löschen",removeFromSpot:"Von dieser Stelle entfernen",stackTitle:"{count} Geräte an dieser Stelle"},wall:{material:"Wandmaterial",thickness:"Wandstärke ({unit})",delete:"Wand löschen"},opening:{width:"Breite ({unit})",storedUnits:"gespeicherte Einheiten",calibrate:"Maßstab kalibrieren für reale Einheiten",delete:"Löschen"},meshStub:{goToFloor:"Zur Etage"},notCalibrated:"Nicht kalibriert"},mapBackground:{noWebgl:"Dieser Browser kann die Karte nicht darstellen (WebGL2 erforderlich).",failed:"Karte konnte nicht geladen werden: {error}",add:"Kartenhintergrund hinzufügen",remove:"Kartenhintergrund entfernen",opacity:"Kartendeckkraft",adjust:"Karte verschieben (ziehen; Strg+Scrollen oder Pinch zum Zoomen)",adjustHint:"Karte ziehen, um sie an den Gebäuden auszurichten.",zoomIn:"Karte vergrößern",zoomOut:"Karte verkleinern",rotation:"Drehung",resetRotation:"Norden oben",done:"Fertig",style:"Kartentyp",street:"Straßenkarte",aerial:"Luftbild (Esri)"}}};function Ae(t,e){let i=t;for(const t of e.split(".")){if("object"!=typeof i||null===i)return;i=i[t]}return"string"==typeof i?i:void 0}function Fe(t,e){let i=Ae(Re.en,t)??Ae(Re.en,t)??t;if(e)for(const[t,o]of Object.entries(e))i=i.split(`{${t}}`).join(String(o));return i}const De=[[-1,-1],[1,-1],[1,1],[-1,1]];let ze=class extends ct{constructor(){super(...arguments),this.placements=[],this.ghosts=new Map,this.floorNameById=new Map,this.floorIconById=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.85,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.mode="select",this.selectedPlacementId=null,this.pins=[],this.selectedPinId=null,this.entityLookup=new Map,this.meshLinks=[],this.selectedMeshLinkKey=null,this.initialViewBox=null,this.mapBackground=null,this._mapError=null,this._mapStarting=!1,this._mapSize="",this._viewBox={x:0,y:0,w:be,h:750},this._naturalHeight=750,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._pinIcons=new fe(this),this._gestureCancelled=!1,this._hasFittedOnce=!1,this._onPointerDown=t=>{if("mouse"!==t.pointerType||0===t.button){if(Qt(this),this._svg.setPointerCapture(t.pointerId),this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,o={x:(e.x+i.x)/2,y:(e.y+i.y)/2};return"map"===this.mode&&this.mapBackground?void(this._gesture={kind:"mapPinch",lastDistance:zt(e.x,e.y,i.x,i.y)||1,lastAngle:Math.atan2(i.y-e.y,i.x-e.x),lastMid:this._clientToImage(o.x,o.y)}):void(this._gesture={kind:"pinch",startDistance:zt(e.x,e.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(o.x,o.y)})}this._pointers.size>2||(this._downClient={x:t.clientX,y:t.clientY},this._lastClient={x:t.clientX,y:t.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(t.clientX,t.clientY):{type:"empty"})}},this._onPointerMove=t=>{if(!this._pointers.has(t.pointerId))return;if(this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),"mapPinch"===this._gesture?.kind&&2===this._pointers.size){const[t,e]=[...this._pointers.values()],i=this._gesture,o=zt(t.x,t.y,e.x,e.y)||1,n=Math.atan2(e.y-t.y,e.x-t.x),s=this._clientToImage((t.x+e.x)/2,(t.y+e.y)/2);return this._fire("map-adjust",{op:"pinch",dx:s.x-i.lastMid.x,dy:s.y-i.lastMid.y,factor:o/i.lastDistance,rotateDeg:180*(n-i.lastAngle)/Math.PI,at:s}),i.lastDistance=o,i.lastAngle=n,void(i.lastMid=s)}if("pinch"===this._gesture?.kind&&2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,o=zt(e.x,e.y,i.x,i.y)||1,n=this._gesture.startDistance/o,s=this._gesture.startViewBox,r=Ht(s.w*n,this._minViewBoxWidth,4e3),a=r/s.w,l=s.h*a,{x:c,y:d}=this._gesture.midImage;return void(this._viewBox={x:c-(c-s.x)*a,y:d-(d-s.y)*a,w:r,h:l})}if(1!==this._pointers.size||!this._downClient)return;if(this._gestureCancelled)return;if(!this._moved){if(zt(this._downClient.x,this._downClient.y,t.clientX,t.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"===this._gesture?.kind||"mapPan"===this._gesture?.kind?this._svg.style.cursor="grabbing":this._gesture&&this._fire("property-gesture-start")}const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};if("mapPan"===this._gesture?.kind)this._fire("map-adjust",{op:"pan",dx:(t.clientX-i.x)/e,dy:(t.clientY-i.y)/e});else if("pan"===this._gesture?.kind)this._viewBox={...this._viewBox,x:this._viewBox.x-(t.clientX-i.x)/e,y:this._viewBox.y-(t.clientY-i.y)/e};else if("move"===this._gesture?.kind)this._fire("placement-move",{id:this._gesture.id,dx:(t.clientX-i.x)/e,dy:(t.clientY-i.y)/e});else if("pinMove"===this._gesture?.kind){const e=this._clientToImage(t.clientX,t.clientY);this._fire("outdoor-pin-move",{id:this._gesture.id,x:e.x,y:e.y})}else if("resize"===this._gesture?.kind){const e=this._gesture,i=this.placements.find(t=>t.id===e.id);if(i){const[o,n]=De[e.corner],s=-o,r=-n,a=this._clientToImage(t.clientX,t.clientY),l=i.rotation_deg*Math.PI/180,c=Math.cos(l),d=Math.sin(l),h=a.x-e.anchorWorld.x,p=a.y-e.anchorWorld.y,u=c*h+d*p,_=-d*h+c*p,g=Math.max(10,o*u),m=Math.max(10,n*_),y=i.aspect_ratio||g/m||1,v=Math.max(g,m*y),f=v/y,b=s*(v/2),x=r*(f/2);this._fire("placement-resize",{id:i.id,width:v,height:f,x:e.anchorWorld.x-(c*b-d*x),y:e.anchorWorld.y-(d*b+c*x)})}}else if("rotate"===this._gesture?.kind){const e=this._gesture.id,i=this.placements.find(t=>t.id===e);if(i){const e=this._clientToImage(t.clientX,t.clientY),o=((180*Math.atan2(e.y-i.y,e.x-i.x)/Math.PI+90)%360+360)%360;this._fire("placement-rotate",{id:i.id,rotationDeg:o})}}this._lastClient={x:t.clientX,y:t.clientY}},this._onPointerUp=t=>{this._pointers.delete(t.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(t.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._moved||!this._downClient||this._gestureCancelled||this._handleClick(),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1,this._gestureCancelled=!1)},this._onWheel=t=>{if(t.preventDefault(),"map"===this.mode&&this.mapBackground&&(t.ctrlKey||t.shiftKey)){const e=this._clientToImage(t.clientX,t.clientY);return void this._fire("map-adjust",t.ctrlKey?{op:"zoom",factor:t.deltaY<0?1.1:1/1.1,at:e}:{op:"rotate",deltaDeg:t.deltaY<0?2:-2,at:e})}if(t.ctrlKey){const e=t.deltaY<0?.9:1.1;return void this._zoomBy(e,this._clientToImage(t.clientX,t.clientY))}const e=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+t.deltaX*e,y:this._viewBox.y+t.deltaY*e}}}firstUpdated(){this.initialViewBox?(this._viewBox={...this.initialViewBox},this._hasFittedOnce=!0):(this.fitToScreen(),this._hasFittedOnce=this.placements.length>0||!this.backgroundImageUrl),this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._destroyMap()}_destroyMap(){this._map?.destroy(),this._map=void 0,this._mapSize=""}_syncMap(){const t=this.mapBackground;if(!t)return this._destroyMap(),void(this._mapError=null);if(this._mapError)return;const e=this.renderRoot.querySelector(".map-layer");if(!e||!this._svg)return;const i=this._svg.getBoundingClientRect();if(0===i.width||0===i.height)return;const{scale:o,offsetX:n,offsetY:s}=this._svgTransform(),r=this._viewBox,a=function(t,e,i,o){const n=Ce(t),s=Ee(t),r=Me({x:e,y:i},n),a=Ie(s.x+r.x,s.y+r.y,t.zoom);return{lat:a.lat,lon:a.lon,zoom:t.zoom+Math.log2(o),bearing:n}}(t,r.x+(i.width/2-n)/o,r.y+(i.height/2-s)/o,o),l=this.hass?.themes?.darkMode??!1;if(this._map){this._map.setDark(l),this._map.setStyleKind(t.style??"street"),this._map.setOpacity(t.opacity);const e=`${i.width}x${i.height}`;return e!==this._mapSize&&(this._mapSize=e,this._map.resize()),void this._map.setCamera(a)}const c=this.hass?.connection;if(this._mapStarting||!c)return;this._mapStarting=!0,this._mapError=null;const d="/spatial_context/map";(async()=>{try{const o=await(import(`${d}/spatial-context-map.mjs?v=0.14.0-beta.1+mv2u6kwe`));if(!o.supportsVectorMaps())throw new Error(Fe("mapBackground.noWebgl"));const n=await o.createMapLayer({container:e,baseUrl:d,connection:c,dark:l,styleKind:t.style??"street",language:this.hass?.locale?.language??this.hass?.language??"en",opacity:t.opacity,camera:a});this.mapBackground&&this.isConnected?(this._map=n,this._mapSize=`${i.width}x${i.height}`):n.destroy()}catch(t){this._mapError=t?.message??String(t)}finally{this._mapStarting=!1,this.requestUpdate()}})()}updated(t){if(t.has("mapBackground")&&(this._mapError=null),this._syncMap(),t.has("backgroundImageUrl")&&this.backgroundImageUrl){const t=new Image;t.onload=()=>{this._naturalHeight=t.naturalHeight/t.naturalWidth*be||750,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},t.src=this.backgroundImageUrl}}_contentBounds(){if(0===this.placements.length&&0===this.pins.length)return null;const t=[...this.placements.flatMap(t=>[t.x-t.width,t.x+t.width]),...this.pins.map(t=>t.x)],e=[...this.placements.flatMap(t=>[t.y-t.height,t.y+t.height]),...this.pins.map(t=>t.y)],i=Math.min(...t),o=Math.max(...t),n=Math.min(...e),s=Math.max(...e),r=.15*Math.max(o-i,s-n)||60;return{x:i-r,y:n-r,w:o-i+2*r,h:s-n+2*r}}getViewCenter(){const t=this._svg?.getBoundingClientRect(),{scale:e,offsetX:i,offsetY:o}=this._svgTransform(),n=this._viewBox;return{x:n.x+((t?.width??0)/2-i)/e,y:n.y+((t?.height??0)/2-o)/e}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:be,h:this._naturalHeight}}getViewBox(){return{...this._viewBox}}_svgTransform(){const t=this._svg?.getBoundingClientRect(),e=t?.width||this._viewBox.w,i=t?.height||this._viewBox.h,o=Math.min(e/this._viewBox.w,i/this._viewBox.h)||1;return{scale:o,offsetX:(e-this._viewBox.w*o)/2,offsetY:(i-this._viewBox.h*o)/2}}_pxToUnits(t){return t/this._svgTransform().scale}_clientToImage(t,e){const i=this._svg,o=i.createSVGPoint();o.x=t,o.y=e;const n=i.getScreenCTM();if(!n)return{x:0,y:0};const s=o.matrixTransform(n.inverse());return{x:s.x,y:s.y}}_toLocal(t,e,i){const o=t.rotation_deg*Math.PI/180,n=Math.cos(o),s=Math.sin(o),r=e-t.x,a=i-t.y;return{x:n*r+s*a,y:-s*r+n*a}}_localToWorld(t,e,i){const o=t.rotation_deg*Math.PI/180,n=Math.cos(o),s=Math.sin(o);return{x:t.x+n*e-s*i,y:t.y+s*e+n*i}}_hitTest(t,e){const i=this._clientToImage(t,e),o=this._pxToUnits(12*1.4);for(const t of[...this.pins].reverse())if(zt(t.x,t.y,i.x,i.y)<=o)return{type:"pin",id:t.id};const n=this.placements.find(t=>t.id===this.selectedPlacementId);if(n){const i=this._pxToUnits(26),o=De.map(([t,e])=>[t*n.width/2,e*n.height/2]);for(let i=0;i<o.length;i++){const[s,r]=o[i],a=this._localToWorld(n,s,r),l=this._imageToClient(a.x,a.y);if(zt(l.x,l.y,t,e)<=14)return{type:"resizeHandle",id:n.id,corner:i}}const s=this._localToWorld(n,0,-n.height/2-i),r=this._imageToClient(s.x,s.y);if(zt(r.x,r.y,t,e)<=14)return{type:"rotateHandle",id:n.id}}let s=null,r=this._pxToUnits(8);for(const t of this.meshLinks){const e=Yt(i.x,i.y,t.from.x,t.from.y,t.to.x,t.to.y);e<=r&&(s=t,r=e)}if(s)return{type:"meshLink",key:s.key};for(const t of[...this.placements].reverse()){const e=this._toLocal(t,i.x,i.y);if(Math.abs(e.x)<=t.width/2&&Math.abs(e.y)<=t.height/2)return{type:"body",id:t.id}}return{type:"empty"}}_imageToClient(t,e){const i=this._svg.getBoundingClientRect(),{scale:o,offsetX:n,offsetY:s}=this._svgTransform();return{x:i.left+n+(t-this._viewBox.x)*o,y:i.top+s+(e-this._viewBox.y)*o}}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_lockGesture(){if("resizeHandle"===this._downHit?.type){const t=this._downHit,e=this.placements.find(e=>e.id===t.id);if(!e)return{kind:"pan"};const[i,o]=De[t.corner],n=this._localToWorld(e,-i*e.width/2,-o*e.height/2);return{kind:"resize",id:e.id,corner:t.corner,anchorWorld:n}}return"rotateHandle"===this._downHit?.type?{kind:"rotate",id:this._downHit.id}:"body"===this._downHit?.type?{kind:"move",id:this._downHit.id}:"pin"===this._downHit?.type?{kind:"pinMove",id:this._downHit.id}:"map"===this.mode&&this.mapBackground?{kind:"mapPan"}:{kind:"pan"}}cancelGesture(){const t=this._gesture?.kind;return!(!this._moved||!t||"pan"===t||"pinch"===t||"mapPan"===t||"mapPinch"===t)&&(this._gesture=null,this._gestureCancelled=!0,this._svg.style.cursor="",!0)}_handleClick(){if("place"===this.mode||"place-pin"===this.mode){if(!this._downClient)return;const t=this._clientToImage(this._downClient.x,this._downClient.y);return void this._fire("place"===this.mode?"placement-place":"outdoor-pin-place",{x:t.x,y:t.y})}const t=this._downHit;"pin"===t?.type?this._fire("outdoor-pin-select",{id:t.id}):"meshLink"===t?.type?this._fire("property-mesh-link-select",{key:t.key===this.selectedMeshLinkKey?null:t.key}):(this._fire("outdoor-pin-select",{id:null}),this._fire("property-mesh-link-select",{key:null}),this._fire("placement-select",{id:"body"===t?.type?t.id:null}))}get _minViewBoxWidth(){return this.mapBackground?15.625:250}_zoomBy(t,e){const i=Ht(this._viewBox.w*t,this._minViewBoxWidth,4e3),o=i/this._viewBox.w,n=this._viewBox.h*o;this._viewBox={x:e.x-(e.x-this._viewBox.x)*o,y:e.y-(e.y-this._viewBox.y)*o,w:i,h:n}}_zoomButton(t){const e=this._viewBox;this._zoomBy(t,{x:e.x+e.w/2,y:e.y+e.h/2})}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return X;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),o=e+t*(this.backgroundOffsetX-this._viewBox.x),n=i+t*(this.backgroundOffsetY-this._viewBox.y),s=t*this.backgroundScale;return V`
      <div
        class="bg-overlay"
        style="transform: translate(${o}px, ${n}px) scale(${s});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${be}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderGhost(t){const e=this.ghosts.get(t.id),i=t.source_bounds;if(!e||!i||i.max_x<=i.min_x||i.max_y<=i.min_y)return X;const o=t.width/(i.max_x-i.min_x),n=t.height/(i.max_y-i.min_y),s=t=>t.map(([t,e])=>`${t},${e}`).join(" ");return Y`
      <g
        class="ghost"
        transform="translate(${-t.width/2} ${-t.height/2}) scale(${o} ${n}) translate(${-i.min_x} ${-i.min_y})"
      >
        ${e.rooms.map(t=>Y`<polygon class="ghost-room" points=${s(t)}></polygon>`)}
        ${e.walls.map(t=>Y`<polyline class="ghost-wall" points=${s(t)}></polyline>`)}
      </g>
    `}_renderPlacement(t){const e=t.id===this.selectedPlacementId,i=t.label_override||this.floorNameById.get(t.floor_id)||t.floor_id,o=this._pxToUnits(7),n=this._pxToUnits(26);return Y`
      <g transform="translate(${t.x} ${t.y}) rotate(${t.rotation_deg})">
        <rect
          class="placement-rect ${e?"selected":""}"
          x=${-t.width/2}
          y=${-t.height/2}
          width=${t.width}
          height=${t.height}
        ></rect>
        ${this._renderGhost(t)}
        <text class="placement-label" y=${-t.height/2-o}>${i}</text>
        ${e?Y`
              <line
                class="rotate-stick"
                x1="0" y1=${-t.height/2}
                x2="0" y2=${-t.height/2-n}
              ></line>
              <circle class="rotate-handle" cx="0" cy=${-t.height/2-n} r=${o}></circle>
              <circle class="resize-handle" cx=${-t.width/2} cy=${-t.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${t.width/2} cy=${-t.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${t.width/2} cy=${t.height/2} r=${o}></circle>
              <circle class="resize-handle" cx=${-t.width/2} cy=${t.height/2} r=${o}></circle>
            `:X}
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
      `)}_renderPin(t){return this._pinIcons.renderMarker(t.x,t.y,this._pxToUnits(12),this._pinIcons.iconForPin(t,this.entityLookup.values()),"var(--sc-accent)",t.id===this.selectedPinId,t.label_override??wt(t.device_id,this.entityLookup.values()))}render(){const t=this._viewBox;return V`
      ${this.mapBackground?V`<div class="map-layer"></div>
              ${this._mapError?V`<div class="map-error">
                      ${Fe("mapBackground.failed",{error:this._mapError})}
                    </div>`:X}`:X}
      ${this._renderBackgroundOverlay()}
      ${Y`
        <svg
          viewBox="${t.x} ${t.y} ${t.w} ${t.h}"
          class="${"place"===this.mode||"place-pin"===this.mode?"place-mode":""}"
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
    `}};ze.styles=[de,ve,r`
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
      .indoor-end {
        fill: var(--sc-fg-secondary);
        stroke: white;
        stroke-width: 1.5;
        pointer-events: none;
      }
      ${he}
    `],t([ut({attribute:!1})],ze.prototype,"placements",void 0),t([ut({attribute:!1})],ze.prototype,"ghosts",void 0),t([ut({attribute:!1})],ze.prototype,"floorNameById",void 0),t([ut({attribute:!1})],ze.prototype,"floorIconById",void 0),t([ut({attribute:!1})],ze.prototype,"backgroundImageUrl",void 0),t([ut({type:Number})],ze.prototype,"backgroundOpacity",void 0),t([ut({type:Number})],ze.prototype,"backgroundOffsetX",void 0),t([ut({type:Number})],ze.prototype,"backgroundOffsetY",void 0),t([ut({type:Number})],ze.prototype,"backgroundScale",void 0),t([ut({attribute:!1})],ze.prototype,"mode",void 0),t([ut({attribute:!1})],ze.prototype,"selectedPlacementId",void 0),t([ut({attribute:!1})],ze.prototype,"pins",void 0),t([ut({attribute:!1})],ze.prototype,"selectedPinId",void 0),t([ut({attribute:!1})],ze.prototype,"entityLookup",void 0),t([ut({attribute:!1})],ze.prototype,"meshLinks",void 0),t([ut({attribute:!1})],ze.prototype,"selectedMeshLinkKey",void 0),t([ut({attribute:!1})],ze.prototype,"initialViewBox",void 0),t([ut({attribute:!1})],ze.prototype,"mapBackground",void 0),t([ut({attribute:!1})],ze.prototype,"hass",void 0),t([_t()],ze.prototype,"_mapError",void 0),t([_t()],ze.prototype,"_viewBox",void 0),t([_t()],ze.prototype,"_naturalHeight",void 0),t([gt("svg")],ze.prototype,"_svg",void 0),ze=t([mt("property-canvas")],ze);let He=class extends ct{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1}render(){return V`
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
        <span>${Fe("floorTabs.property")}</span>
      </button>
    `}};He.styles=[de,r`
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
    `],t([ut({attribute:!1})],He.prototype,"floors",void 0),t([ut({attribute:!1})],He.prototype,"selectedFloorId",void 0),t([ut({type:Boolean})],He.prototype,"propertySelected",void 0),He=t([mt("floor-tabs")],He);let We=class extends ct{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.propertySelected=!1,this.dirty=!1,this.saving=!1,this.canUndo=!1,this.canRedo=!1}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}render(){return V`
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
          <div class="subtitle">v${"0.14.0-beta.1"}</div>
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
          title=${this.saving?Fe("appHeader.saving"):Fe("appHeader.save")}
          ?disabled=${this.saving}
          @click=${()=>this._fire("save-click")}
        >
          <ha-icon icon="mdi:content-save"></ha-icon>
          ${this.dirty?V`<span class="dirty-dot"></span>`:X}
        </button>
        <slot name="end"></slot>
      </div>
    `}};We.styles=[de,r`
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
        .identity .subtitle {
          display: none;
        }
        .identity h1 {
          font-size: 16px;
        }
        .identity .app-icon {
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
    `],t([ut({attribute:!1})],We.prototype,"floors",void 0),t([ut({attribute:!1})],We.prototype,"selectedFloorId",void 0),t([ut({type:Boolean})],We.prototype,"propertySelected",void 0),t([ut({type:Boolean})],We.prototype,"dirty",void 0),t([ut({type:Boolean})],We.prototype,"saving",void 0),t([ut({type:Boolean})],We.prototype,"canUndo",void 0),t([ut({type:Boolean})],We.prototype,"canRedo",void 0),We=t([mt("app-header")],We);let Ue=class extends ct{constructor(){super(...arguments),this.mode="select",this.armedOpeningType=null,this.hasPendingTrace=!1,this.hasPendingWall=!1,this.snapMode="all",this.pendingScaleCount=0,this.scaleReadout=null,this.selectedRoom=null,this.editingRoom=!1,this.areas=[],this.selectedPin=null,this.selectedWall=null,this.editingWall=!1,this.unitSystem="metric",this.unitsPerMeter=null,this.pinStack=null,this.entityLookup=new Map,this.selectedOpening=null,this.selectedMeshLink=null,this.selectedMeshStub=null,this.otherFloors=[],this.alignTargetFloorId=null,this.alignTargetHasBackground=!0,this._wallThicknessUnit=null,this._openingWidthUnit=null}willUpdate(t){t.has("selectedWall")&&t.get("selectedWall")?.id!==this.selectedWall?.id&&(this._wallThicknessUnit=null),t.has("selectedOpening")&&t.get("selectedOpening")?.id!==this.selectedOpening?.id&&(this._openingWidthUnit=null)}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_unitSelect(t,e){return V`
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
    </button>`}_openingModeButton(t,e,i){const o="opening"===this.mode&&this.armedOpeningType===t;return V`<button
      class=${o?"active":""}
      title=${i}
      @click=${()=>this._fire("add-opening-click",{openingType:t})}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_renderModeToolbar(){return V`
      <div class="mode-toolbar floating-panel">
        ${this._modeButton("select","mdi:cursor-default-click",Fe("canvas.mode.select"))}
        ${this._modeButton("pan","mdi:hand-back-right-outline",Fe("canvas.mode.pan"))}
        <span class="tool-divider"></span>
        ${this._modeButton("trace","mdi:vector-square",Fe("canvas.mode.trace"))}
        ${this._modeButton("wall","mdi:wall",Fe("canvas.mode.wall"))}
        ${this._openingModeButton("door","mdi:door",Fe("canvas.mode.door"))}
        ${this._openingModeButton("window","mdi:window-closed-variant",Fe("canvas.mode.window"))}
        ${this._modeButton("scale","mdi:ruler",Fe("canvas.mode.scale"))}
        <span class="tool-divider"></span>
        ${this._modeButton("place","mdi:map-marker-plus",Fe("canvas.mode.place"))}
        ${this._modeButton("align","mdi:compare",Fe("canvas.mode.align"))}
      </div>
    `}_renderSnapSelect(){return V`<select
      class="snap-select"
      title=${Fe("canvas.snap.tooltip")}
      @change=${t=>this._fire("snap-mode-change",{snapMode:t.target.value})}
    >
      <option value="all" ?selected=${"all"===this.snapMode}>
        ${Fe("canvas.snap.all")}
      </option>
      <option value="same" ?selected=${"same"===this.snapMode}>
        ${"wall"===this.mode?Fe("canvas.snap.walls"):Fe("canvas.snap.rooms")}
      </option>
      <option value="off" ?selected=${"off"===this.snapMode}>
        ${Fe("canvas.snap.off")}
      </option>
    </select>`}_renderHintBar(){return"trace"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${this.hasPendingTrace?Fe("canvas.hint.closeRoom"):Fe("canvas.hint.addPoints")}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingTrace?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Fe("canvas.button.cancel")}
              </button>`:X}
      </div>`:"wall"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${this.hasPendingWall?Fe("canvas.hint.addWallPointsFinish"):Fe("canvas.hint.addWallPoints")}</span
        >
        ${this._renderSnapSelect()}
        ${this.hasPendingWall?V`<button
                class="primary"
                @click=${()=>this._fire("finish-wall-click")}
              >
                ${Fe("canvas.button.finishWall")}
              </button>`:X}
        ${this.hasPendingWall?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Fe("canvas.button.cancel")}
              </button>`:X}
      </div>`:"scale"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${0===this.pendingScaleCount?Fe("canvas.hint.scaleFirst"):Fe("canvas.hint.scaleSecond")}</span
        >
        ${this.pendingScaleCount>0?V`<button @click=${()=>this._fire("cancel-pending-click")}>
                ${Fe("canvas.button.cancel")}
              </button>`:X}
      </div>`:"opening"===this.mode?V`<div class="hint-bar floating-panel">
        <span class="hint"
          >${Fe("canvas.hint.placeOpening",{type:Fe(`canvas.openingType.${this.armedOpeningType??"opening"}`)})}</span
        >
      </div>`:"align"===this.mode?this._renderAlignBar():X}_renderAlignBar(){return this.alignTargetFloorId?this.alignTargetHasBackground?V`<div class="hint-bar floating-panel">
      <span class="hint">${Fe("canvas.hint.alignDrag")}</span>
      <button
        title=${Fe("canvas.align.shrink")}
        @click=${()=>this._fire("align-scale-click",{factor:.995})}
      >
        −
      </button>
      <button
        title=${Fe("canvas.align.grow")}
        @click=${()=>this._fire("align-scale-click",{factor:1.0050251})}
      >
        +
      </button>
      <button class="primary" @click=${()=>this._fire("align-apply-click")}>
        ${Fe("canvas.button.apply")}
      </button>
      <button @click=${()=>this._fire("align-cancel-click")}>
        ${Fe("canvas.button.cancel")}
      </button>
    </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint">${Fe("canvas.hint.noBackground")}</span>
        <button
          @click=${()=>this._fire("align-target-change",{floorId:null})}
        >
          ${Fe("canvas.button.chooseAnother")}
        </button>
        <button @click=${()=>this._fire("align-cancel-click")}>
          ${Fe("canvas.button.cancel")}
        </button>
      </div>`:V`<div class="hint-bar floating-panel">
        <span class="hint">${Fe("canvas.hint.alignAgainst")}</span>
        <select
          @change=${t=>this._fire("align-target-change",{floorId:t.target.value})}
        >
          <option value="" selected>${Fe("canvas.align.choose")}</option>
          ${this.otherFloors.map(t=>V`<option value=${t.floor_id}>${t.name}</option>`)}
        </select>
        <button @click=${()=>this._fire("align-cancel-click")}>
          ${Fe("canvas.button.cancel")}
        </button>
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
            <option value="" ?selected=${!t.area_id}>
              ${Fe("canvas.room.custom")}
            </option>
            ${this._areaOptions(this.areas.filter(t=>null!==t.floor_id),t.area_id)}
            ${this.areas.some(t=>null===t.floor_id)?V`<optgroup label=${Fe("canvas.room.outdoor")}>
                    ${this._areaOptions(this.areas.filter(t=>null===t.floor_id),t.area_id)}
                  </optgroup>`:X}
          </select>
          <button
            title=${Fe(e?"canvas.room.hide":"canvas.room.show")}
            @click=${()=>this._fire("room-visible-toggle")}
          >
            <ha-icon icon="mdi:eye${e?"":"-off"}"></ha-icon>
          </button>
          <input
            type="color"
            class="room-fill-color"
            title=${Fe("canvas.room.color")}
            .value=${t.fill_color??ke}
            @input=${t=>this._fire("room-fill-color-change",{color:t.target.value})}
          />
          <input
            type="range"
            class="room-opacity"
            title=${Fe("canvas.room.fillOpacity")}
            min="0"
            max="1"
            step="0.02"
            .value=${String(t.fill_opacity??.18)}
            @input=${t=>this._fire("room-fill-opacity-change",{opacity:Number(t.target.value)})}
          />
          <input
            type="range"
            class="room-opacity"
            title=${Fe("canvas.room.borderOpacity")}
            min="0"
            max="1"
            step="0.02"
            .value=${String(t.border_opacity??1)}
            @input=${t=>this._fire("room-border-opacity-change",{opacity:Number(t.target.value)})}
          />
          <button
            title=${Fe("canvas.room.rename")}
            @click=${()=>this._fire("room-rename-click")}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button
            title=${this.editingRoom?Fe("canvas.room.doneEditing"):Fe("canvas.room.editVertices")}
            class=${this.editingRoom?"active":""}
            @click=${()=>this._fire("room-edit-vertices-click")}
          >
            <ha-icon icon="mdi:vector-polygon"></ha-icon>
          </button>
          ${t.label_position?V`<button
                  title=${Fe("canvas.room.resetLabel")}
                  @click=${()=>this._fire("room-label-reset-click")}
                >
                  <ha-icon icon="mdi:format-text-variant-outline"></ha-icon>
                </button>`:X}
          <button
            class="danger"
            title=${Fe("canvas.room.delete")}
            @click=${()=>this._fire("room-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedPin){const t=this.selectedPin;return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${this._pinLabel(t)}</span>
          <button
            title=${Fe("canvas.pin.setLabel")}
            @click=${()=>this._fire("pin-set-label-click")}
          >
            <ha-icon icon="mdi:tag-text"></ha-icon>
          </button>
          <button
            title=${Fe("canvas.pin.setIcon")}
            @click=${()=>this._fire("pin-set-icon-click")}
          >
            <ha-icon icon="mdi:shape"></ha-icon>
          </button>
          <button
            title=${Fe("canvas.pin.setHeight")}
            @click=${()=>this._fire("pin-set-height-click")}
          >
            <ha-icon icon="mdi:human-male-height"></ha-icon>
          </button>
          <button
            class="danger"
            title=${Fe("canvas.pin.delete")}
            @click=${()=>this._fire("pin-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedWall){const t=this.selectedWall,e=this._wallThicknessUnit??re(this.unitSystem),i=this._thicknessInputAttrs(e);return V`
        <div class="selection-panel floating-panel">
          <span class="hint">${Fe("canvas.wall.material")}</span>
          <select
            @change=${t=>this._fire("wall-material-change",{material:t.target.value})}
          >
            ${It.map(e=>V`<option value=${e.id} ?selected=${e.id===t.material}>
                  ${e.label}
                </option>`)}
          </select>
          <input
            type="number"
            class="wall-thickness"
            title=${Fe("canvas.wall.thickness",{unit:e})}
            min=${i.min}
            max=${i.max}
            step=${i.step}
            .value=${ae(St(t),e)}
            @change=${t=>{const i=le(t.target.value,e);null===i||!Number.isFinite(i)||i<=0||this._fire("wall-thickness-change",{thicknessCm:i})}}
          />
          ${this._unitSelect(e,t=>this._wallThicknessUnit=t)}
          <button
            title=${this.editingWall?Fe("canvas.room.doneEditing"):Fe("canvas.room.editVertices")}
            class=${this.editingWall?"active":""}
            @click=${()=>this._fire("wall-edit-vertices-click")}
          >
            <ha-icon icon="mdi:vector-polygon"></ha-icon>
          </button>
          <button
            class="danger"
            title=${Fe("canvas.wall.delete")}
            @click=${()=>this._fire("wall-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedOpening){const t=this.selectedOpening,e=this._openingWidthUnit??re(this.unitSystem),i=this._thicknessInputAttrs(e),o=this.unitsPerMeter;return V`
        <div class="selection-panel floating-panel">
          <span class="hint"
            >${Fe(`canvas.openingLabel.${t.type}`)}</span
          >
          <input
            type="number"
            class="wall-thickness"
            title=${Fe("canvas.opening.width",{unit:null!==o?e:Fe("canvas.opening.storedUnits")})}
            min=${null!==o?i.min:"1"}
            step=${null!==o?i.step:"1"}
            .value=${null!==o?function(t,e,i){return ae(t/e*100,i)}(t.width,o,e):String(t.width)}
            @change=${t=>{const i=t.target.value,n=null!==o?function(t,e,i){const o=le(t,i);return null===o?null:o/100*e}(i,o,e):Number(i);null===n||!Number.isFinite(n)||n<=0||this._fire("opening-width-change",{width:n})}}
          />
          ${null!==o?this._unitSelect(e,t=>this._openingWidthUnit=t):V`<span class="hint"
                  >${Fe("canvas.opening.calibrate")}</span
                >`}
          <button
            class="danger"
            title=${Fe("canvas.opening.delete")}
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
            title=${Fe("canvas.meshStub.goToFloor")}
            @click=${()=>this._fire("mesh-stub-goto-floor-click")}
          >
            <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
          </button>
        </div>
      `}return X}_pinLabel(t){return t.label_override?t.label_override:wt(t.device_id,this.entityLookup.values())}_renderPinStack(){return this.pinStack?V`
      <div class="pin-stack floating-panel">
        <span class="stack-title"
          >${Fe("canvas.pin.stackTitle",{count:this.pinStack.length})}</span
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
                title=${Fe("canvas.pin.removeFromSpot")}
                @click=${()=>this._fire("pin-stack-remove-click",{pinId:t.id})}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `)}
        <button @click=${()=>this._fire("pin-stack-dismiss")}>
          ${Fe("canvas.button.close")}
        </button>
      </div>
    `:X}render(){return V`
      ${this._renderModeToolbar()} ${this._renderHintBar()}
      <div class="scale-badge floating-panel">
        ${this.scaleReadout??Fe("canvas.notCalibrated")}
      </div>
      ${this.pinStack?this._renderPinStack():this._renderSelectionPanel()}
    `}};Ue.styles=[de,r`
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
        border-radius: 24px;
        padding: 4px 6px;
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
      .mode-toolbar ha-icon,
      .selection-panel ha-icon,
      .pin-stack ha-icon {
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
    `],t([ut({attribute:!1})],Ue.prototype,"mode",void 0),t([ut({attribute:!1})],Ue.prototype,"armedOpeningType",void 0),t([ut({type:Boolean})],Ue.prototype,"hasPendingTrace",void 0),t([ut({type:Boolean})],Ue.prototype,"hasPendingWall",void 0),t([ut({attribute:!1})],Ue.prototype,"snapMode",void 0),t([ut({type:Number})],Ue.prototype,"pendingScaleCount",void 0),t([ut({attribute:!1})],Ue.prototype,"scaleReadout",void 0),t([ut({attribute:!1})],Ue.prototype,"selectedRoom",void 0),t([ut({type:Boolean})],Ue.prototype,"editingRoom",void 0),t([ut({attribute:!1})],Ue.prototype,"areas",void 0),t([ut({attribute:!1})],Ue.prototype,"selectedPin",void 0),t([ut({attribute:!1})],Ue.prototype,"selectedWall",void 0),t([ut({type:Boolean})],Ue.prototype,"editingWall",void 0),t([ut({attribute:!1})],Ue.prototype,"unitSystem",void 0),t([ut({type:Number})],Ue.prototype,"unitsPerMeter",void 0),t([ut({attribute:!1})],Ue.prototype,"pinStack",void 0),t([ut({attribute:!1})],Ue.prototype,"entityLookup",void 0),t([ut({attribute:!1})],Ue.prototype,"selectedOpening",void 0),t([ut({attribute:!1})],Ue.prototype,"selectedMeshLink",void 0),t([ut({attribute:!1})],Ue.prototype,"selectedMeshStub",void 0),t([ut({attribute:!1})],Ue.prototype,"otherFloors",void 0),t([ut({attribute:!1})],Ue.prototype,"alignTargetFloorId",void 0),t([ut({type:Boolean})],Ue.prototype,"alignTargetHasBackground",void 0),t([_t()],Ue.prototype,"_wallThicknessUnit",void 0),t([_t()],Ue.prototype,"_openingWidthUnit",void 0),Ue=t([mt("canvas-overlay")],Ue);let Ne=class extends ct{constructor(){super(...arguments),this.icon="",this.label="",this.open=!1}render(){return V`
      <button
        class="icon-button ${this.open?"active":""}"
        title=${this.label}
        @click=${()=>this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${this.open?V`<div class="popover floating-panel"><slot></slot></div>`:X}
    `}};var Ve;Ne.styles=[de,r`
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
    `],t([ut()],Ne.prototype,"icon",void 0),t([ut()],Ne.prototype,"label",void 0),t([ut({type:Boolean})],Ne.prototype,"open",void 0),Ne=t([mt("icon-popover")],Ne);let Ye=Ve=class extends ct{constructor(){super(...arguments),this.entities=[],this.placedDeviceIds=new Set,this.armedEntityId=null,this.floors=[],this.areas=[],this.currentFloorId=null,this.linkedAreaIds=new Set,this._search="",this._floorFilter=null,this._areaFilter=null,this._onResizeHandlePointerDown=t=>{t.preventDefault();const e=t.clientX,i=this.getBoundingClientRect().width,o=t.currentTarget;o.setPointerCapture(t.pointerId);const n=t=>{const o=e-t.clientX,n=Math.min(Ve.MAX_WIDTH,Math.max(Ve.MIN_WIDTH,i+o));this.style.setProperty("--sc-picker-width",`${n}px`)},s=t=>{o.releasePointerCapture(t.pointerId),o.removeEventListener("pointermove",n),o.removeEventListener("pointerup",s),this._writeStoredWidth(Math.round(this.getBoundingClientRect().width))};o.addEventListener("pointermove",n),o.addEventListener("pointerup",s)},this._onFloorFilterChange=t=>{const e=t.target.value;this._floorFilter="all"===e?"all":e,this._areaFilter&&!this._areasForFilter.some(t=>t.area_id===this._areaFilter)&&(this._areaFilter=null)}}connectedCallback(){super.connectedCallback();const t=this._readStoredWidth();null!==t&&this.style.setProperty("--sc-picker-width",`${t}px`)}_readStoredWidth(){try{const t=localStorage.getItem(Ve.WIDTH_STORAGE_KEY);if(!t)return null;const e=Number(t);return Number.isFinite(e)?Math.min(Ve.MAX_WIDTH,Math.max(Ve.MIN_WIDTH,e)):null}catch{return null}}_writeStoredWidth(t){try{localStorage.setItem(Ve.WIDTH_STORAGE_KEY,String(t))}catch{}}get _effectiveFloorFilter(){return"all"===this._floorFilter?null:this._floorFilter??this.currentFloorId}get _areasForFilter(){const t=this._effectiveFloorFilter;return null===t?this.areas:this.areas.filter(e=>this._areaIsOnFloor(e,t))}_areaIsOnFloor(t,e){return e===yt?null===t.floor_id:t.floor_id===e||e===this.currentFloorId&&this.linkedAreaIds.has(t.area_id)}get _devices(){const t=new Map;for(const e of this.entities){const i=e.device_id??e.entity_id;t.has(i)||t.set(i,[]),t.get(i).push(e)}const e=[];for(const[i,o]of t){const t=xt(i,o)??o[0];e.push({deviceId:i,deviceName:t.device_name??t.name,areaId:t.area_id,areaName:t.area_name,integrationDomain:t.integration_domain,integrationName:t.integration_name,entities:o,primaryEntityId:t.entity_id})}return e.sort((t,e)=>t.deviceName.localeCompare(e.deviceName)),e}_blockedFloorName(t){const e=t.entities.find(e=>e.entity_id===t.primaryEntityId);return e?.placed_floor_id&&e.placed_floor_id!==this.currentFloorId?e.placed_floor_name??e.placed_floor_id:null}get _filtered(){const t=this._search.trim().toLowerCase(),e=this._effectiveFloorFilter,i=this._areaFilter;return this._devices.filter(o=>{if(i){if(o.areaId!==i)return!1}else if(e){const t=this.areas.find(t=>t.area_id===o.areaId);if(!t||!this._areaIsOnFloor(t,e))return!1}return!t||(o.deviceName.toLowerCase().includes(t)||(o.areaName??"").toLowerCase().includes(t)||o.entities.some(e=>e.entity_id.toLowerCase().includes(t)))})}render(){const t=this._filtered;return V`
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
              </button>`:X}
      </div>
      <div class="list">
        ${0===t.length?V`<div class="empty">No matching devices.</div>`:t.map(t=>{const e=this.placedDeviceIds.has(t.deviceId),i=this._blockedFloorName(t),o=this.armedEntityId===t.primaryEntityId,n=[t.areaName,t.integrationName].filter(t=>!!t).join(" - ");return V`
                  <div
                    class="item ${o?"armed":""} ${e?"placed":""} ${i?"blocked":""}"
                    title=${i?`Already placed on ${i} — remove it there first`:[t.deviceName,n].filter(t=>!!t).join(" · ")}
                    @click=${()=>{i||this.dispatchEvent(new CustomEvent("entity-armed",{detail:{entityId:t.primaryEntityId},bubbles:!0,composed:!0}))}}
                  >
                    <span class="avatar">
                      ${t.integrationDomain?V`<img
                              src="https://brands.home-assistant.io/_/${t.integrationDomain}/icon.png"
                              alt=""
                              @error=${t=>{const e=t.target;e.style.display="none",e.nextElementSibling?.classList.remove("hidden")}}
                            />`:X}
                      <ha-icon
                        icon=${"mdi:devices"}
                        class=${t.integrationDomain?"hidden":""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${t.deviceName}</span>
                      ${i?V`<span class="meta"
                              >Placed on ${i}</span
                            >`:n?V`<span class="meta">${n}</span>`:X}
                      ${e?V`<span class="meta">✓ placed</span>`:X}
                    </span>
                  </div>
                `})}
      </div>
    `}};Ye.styles=[de,r`
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
    `],Ye.WIDTH_STORAGE_KEY="spatial-context.entityPickerSidebarWidth",Ye.MIN_WIDTH=240,Ye.MAX_WIDTH=600,t([ut({attribute:!1})],Ye.prototype,"entities",void 0),t([ut({attribute:!1})],Ye.prototype,"placedDeviceIds",void 0),t([ut({attribute:!1})],Ye.prototype,"armedEntityId",void 0),t([ut({attribute:!1})],Ye.prototype,"floors",void 0),t([ut({attribute:!1})],Ye.prototype,"areas",void 0),t([ut({attribute:!1})],Ye.prototype,"currentFloorId",void 0),t([ut({attribute:!1})],Ye.prototype,"linkedAreaIds",void 0),t([_t()],Ye.prototype,"_search",void 0),t([_t()],Ye.prototype,"_floorFilter",void 0),t([_t()],Ye.prototype,"_areaFilter",void 0),Ye=Ve=t([mt("entity-picker-sidebar")],Ye);let je=class extends ct{constructor(){super(...arguments),this.mode="select",this.mapActive=!1,this.mapRotation=0,this.selectedPinLabel=null,this.selectedMeshLink=null,this.buildings=[],this.scaleReadout=null,this.scaleWarning=null,this.armedBuildingKey=null,this.selectedPlacement=null,this.floorNameById=new Map}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_selectedLabel(){const t=this.selectedPlacement;return t?t.label_override||this.floorNameById.get(t.floor_id)||t.floor_id:""}_renderPinPanel(){return null===this.selectedPinLabel?X:V`
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
    `}_renderMapPanel(){if("map"!==this.mode)return X;const t=Math.round(10*this.mapRotation)/10,e=t=>this._fire("map-rotation-set",{deg:t});return V`
      <div class="selection-panel floating-panel">
        <span class="hint">${Fe("mapBackground.adjustHint")}</span>
        <button
          title=${Fe("mapBackground.zoomOut")}
          @click=${()=>this._fire("map-zoom-step",{factor:1/1.1})}
        >
          <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
        </button>
        <button
          title=${Fe("mapBackground.zoomIn")}
          @click=${()=>this._fire("map-zoom-step",{factor:1.1})}
        >
          <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
        </button>
        <span class="hint">${Fe("mapBackground.rotation")}</span>
        <input
          type="range"
          min="-180"
          max="180"
          step="0.5"
          .value=${String(t)}
          @input=${t=>e(Number(t.target.value))}
        />
        <input
          type="number"
          style="width: 4.5em"
          min="-180"
          max="180"
          step="0.5"
          .value=${String(t)}
          @change=${t=>{const i=Number(t.target.value);Number.isFinite(i)&&e(i)}}
        />°
        <button
          title=${Fe("mapBackground.resetRotation")}
          @click=${()=>e(0)}
        >
          <ha-icon icon="mdi:compass-outline"></ha-icon>
        </button>
        <button
          class="primary"
          @click=${()=>this._fire("property-mode-change",{mode:"select"})}
        >
          ${Fe("mapBackground.done")}
        </button>
      </div>
    `}_renderMeshLinkPanel(){const t=this.selectedMeshLink;if(!t)return X;const e=[t.from,t.to].find(t=>null!==t.floorId);return V`
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
              </button>`:X}
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
        ${this.mapActive?V`<button
                class=${"map"===this.mode?"active":""}
                title=${Fe("mapBackground.adjust")}
                @click=${()=>this._fire("property-mode-change",{mode:"map"===this.mode?"select":"map"})}
              >
                <ha-icon icon="mdi:map-search"></ha-icon>
              </button>`:X}
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

      <div
        class="scale-badge floating-panel"
        title=${this.scaleReadout?"Worked out from a placed building's floor scale":"Set Scale on a floor, then place its building here"}
      >
        ${this.scaleReadout??"Not calibrated"}
        ${this.scaleWarning?V`<div class="scale-warning">${this.scaleWarning}</div>`:X}
      </div>

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
    `}};je.styles=[de,r`
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
    `],t([ut({attribute:!1})],je.prototype,"mode",void 0),t([ut({attribute:!1})],je.prototype,"mapActive",void 0),t([ut({attribute:!1})],je.prototype,"mapRotation",void 0),t([ut({attribute:!1})],je.prototype,"selectedPinLabel",void 0),t([ut({attribute:!1})],je.prototype,"selectedMeshLink",void 0),t([ut({attribute:!1})],je.prototype,"buildings",void 0),t([ut({attribute:!1})],je.prototype,"scaleReadout",void 0),t([ut({attribute:!1})],je.prototype,"scaleWarning",void 0),t([ut({attribute:!1})],je.prototype,"armedBuildingKey",void 0),t([ut({attribute:!1})],je.prototype,"selectedPlacement",void 0),t([ut({attribute:!1})],je.prototype,"floorNameById",void 0),je=t([mt("property-overlay")],je);const Xe=new Set(["the","and","with","power","light","plug"]);let Ke=null;function Ge(t,e,i){const o=e.toLowerCase().split(/[\s:]+/).filter(Boolean);if(0===o.length)return[];const n=o.join("-"),s=[];for(const[e,i]of t){const t=o.filter(t=>e.includes(t)).length,r=o.filter(t=>e.includes(t)||i.includes(t)).length;if(0===r)continue;const a=e===n?0:e.startsWith(o[0])?1:t===o.length?2:3-t/o.length;s.push([4*(o.length-r)+a,e])}return s.sort((t,e)=>t[0]-e[0]||t[1].length-e[1].length||t[1].localeCompare(e[1])),s.slice(0,i).map(([,t])=>t)}let qe=class extends ct{constructor(){super(...arguments),this.value=null,this.suggestFrom="",this._query="",this._index=null,this._error=null,this._onBackdropClick=()=>this._fire("icon-picker-cancel"),this._onKeyDown=t=>{if("Escape"===t.key)t.stopPropagation(),this._fire("icon-picker-cancel");else if("Enter"===t.key){const t=this._results[0];t&&this._fire("icon-picked",{icon:`mdi:${t}`})}}}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this._onBackdropClick),(Ke??(Ke=fetch("/spatial_context/mdi-index.json?v=0.14.0-beta.1+mv2u6kwe").then(t=>{if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}).catch(t=>{throw Ke=null,t})),Ke).then(t=>this._index=t,t=>this._error=t?.message??"couldn't load icons")}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this._onBackdropClick)}firstUpdated(t){this._input?.focus()}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}get _results(){const t=this._index;if(!t)return[];if(this._query.trim())return Ge(t,this._query,160);const e=new Set;for(const i of this.suggestFrom.toLowerCase().split(/[^a-z0-9]+/))if(!(i.length<3||Xe.has(i))){for(const o of Ge(t,i,12))e.add(o);if(e.size>=60)break}return[...e]}render(){const t=this._results,e=this.value?.replace(/^mdi:/,"")??null;return V`
      <div
        class="dialog floating-panel"
        role="dialog"
        aria-label="Choose an icon"
        @click=${t=>t.stopPropagation()}
        @keydown=${this._onKeyDown}
      >
        <div class="title">Choose an icon</div>
        <input
          type="search"
          placeholder="Search icons — e.g. lamp, motion, gate"
          .value=${this._query}
          @input=${t=>this._query=t.target.value}
        />
        ${this._error?V`<span class="hint"
                >Couldn't load the icon list (${this._error}).</span
              >`:this._index?0===t.length?V`<span class="hint"
                    >${this._query.trim()?"No icons match.":"Type to search all icons."}</span
                  >`:X:V`<span class="hint">Loading icons…</span>`}
        <div class="grid">
          ${t.map(t=>V`<button
                class="icon-choice ${t===e?"current":""}"
                title=${`mdi:${t}`}
                @click=${()=>this._fire("icon-picked",{icon:`mdi:${t}`})}
              >
                <ha-icon icon=${`mdi:${t}`}></ha-icon>
                <span>${t}</span>
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
    `}};qe.styles=[de,r`
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
    `],t([ut({attribute:!1})],qe.prototype,"value",void 0),t([ut({attribute:!1})],qe.prototype,"suggestFrom",void 0),t([_t()],qe.prototype,"_query",void 0),t([_t()],qe.prototype,"_index",void 0),t([_t()],qe.prototype,"_error",void 0),t([gt("input[type=search]")],qe.prototype,"_input",void 0),qe=t([mt("icon-picker-dialog")],qe);let Ze=class extends ct{constructor(){super(...arguments),this.coordinatorChoices=[]}_change(t){this.dispatchEvent(new CustomEvent("settings-change",{detail:t,bubbles:!0,composed:!0}))}_switch(t,e,i){return V`<input
      type="checkbox"
      class="switch"
      role="switch"
      aria-label=${e}
      .checked=${t}
      @change=${t=>i(t.target.checked)}
    />`}_segmented(t,e,i){return V`<div class="segmented" role="radiogroup">
      ${e.map(([e,o])=>V`<button
            role="radio"
            aria-checked=${e===t?"true":"false"}
            class=${e===t?"active":""}
            @click=${()=>e!==t&&i(e)}
          >
            ${o}
          </button>`)}
    </div>`}_row(t,e,i){return V`<div class="row">
      <div>
        <div class="label">${t}</div>
        ${i?V`<div class="description">${i}</div>`:X}
      </div>
      ${e}
    </div>`}render(){const t=this.settings,e=t.zigbee_coordinator_device_id,i=this.coordinatorChoices.some(t=>t.deviceId===e);return V`
      <div class="section">
        <div class="section-title">Editing</div>
        ${this._row("Auto-save changes",this._switch(t.auto_save,"Auto-save changes",t=>this._change({auto_save:t})),"Saves a few seconds after each change")}
        ${this._row("Units",this._segmented(t.unit_system,[["metric","Metric"],["imperial","Imperial"]],t=>this._change({unit_system:t})))}
        ${this._row("Floor tab order",this._segmented(t.floor_order,[["top_down","Top first"],["ground_up","Ground first"]],t=>this._change({floor_order:t})))}
      </div>

      <div class="section">
        <div class="section-title">Zigbee mesh</div>
        ${this._row("Coordinator",V`<select
            aria-label="Zigbee coordinator device"
            @change=${t=>this._change({zigbee_coordinator_device_id:t.target.value||null})}
          >
            <option value="" ?selected=${!e}>
              Zigbee2MQTT Bridge
            </option>
            ${e&&!i?V`<option value=${e} selected>
                    (device not placed)
                  </option>`:X}
            ${this.coordinatorChoices.map(({deviceId:t,label:i})=>V`<option
                  value=${t}
                  ?selected=${t===e}
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
              .value=${String(t.zigbee_timeout_seconds)}
              @change=${t=>{const e=Number(t.target.value);Number.isFinite(e)&&this._change({zigbee_timeout_seconds:Math.min(600,Math.max(30,Math.round(e)))})}}
            />s</span
          >`,"Raise it if Load Mesh times out on a large mesh")}
      </div>

      <div class="section">
        <div class="section-title">Troubleshooting</div>
        ${this._row("Debug logging",this._switch(t.debug_logging,"Debug logging",t=>this._change({debug_logging:t})),"Writes spatial_context_debug.log in your config folder — ids and counts only")}
      </div>
    `}};var Je;Ze.styles=[de,r`
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
    `],t([ut({attribute:!1})],Ze.prototype,"settings",void 0),t([ut({attribute:!1})],Ze.prototype,"coordinatorChoices",void 0),Ze=t([mt("settings-menu")],Ze);const Qe="spatial-context-snap-mode";let ti=Je=class extends ct{constructor(){super(...arguments),this._floors=[],this._currentFloorId=null,this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._entities=[],this._areas=[],this._mode="select",this._snapMode=function(){try{const t=localStorage.getItem(Qe);if("all"===t||"same"===t||"off"===t)return t}catch{}return"all"}(),this._dragOverCanvas=!1,this._armedEntityId=null,this._armedOpeningType=null,this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._otherFloorPinsByDeviceId=new Map,this._dirty=!1,this._saving=!1,this._loading=!0,this._pendingCount=0,this._networkType=null,this._zigbeeMesh=null,this._zigbeeMeshLoading=!1,this._zigbeeMeshError=null,this._zigbeeMeshFetchedAt=null,this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=null,this._zigbeeShowAllLinks=!1,this._wifiMesh=null,this._wifiMeshLoading=!1,this._wifiMeshError=null,this._matterTopology=null,this._matterError=null,this._matterUnsubscribe=null,this._bluetoothAdverts=new Map,this._bluetoothBuffer=new Map,this._bluetoothFlushTimer=null,this._bluetoothDevices={},this._bluetoothError=null,this._bluetoothUnsubscribe=null,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settings={unit_system:"metric",zigbee_timeout_seconds:180,floor_order:"top_down",zigbee_coordinator_device_id:null,auto_save:!0,debug_logging:!1},this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1,this._view="floor",this._placementGhosts=new Map,this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!1,this._saveError=null,this._iconPickerFor=null,this._versionNotice=null,this._autoSaveTimer=null,this._autoSaveHeld=!1,this._floorHistory=new kt,this._propertyHistory=new kt,this._propertyDragStart=null,this._propertySaving=!1,this._selectedPlacementId=null,this._propertyMode="select",this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._armedBuildingKey=null,this._sameBuildingAsPreviousFloor=!1,this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._initialized=!1,this._onFloorSelected=t=>{this._selectFloor(t.detail.floorId)},this._onPropertySelected=()=>{this._selectProperty()},this._onToggleMapBackground=()=>{const t=this._hass?.config;this._propertyLayout.map_background?("map"===this._propertyMode&&(this._propertyMode="select"),this._updatePropertyLayout({map_background:null})):void 0!==t?.latitude&&void 0!==t.longitude&&this._updatePropertyLayout({map_background:{lat:t.latitude,lon:t.longitude,zoom:18,opacity:1,style:"street"}})},this._onMapAdjust=t=>{const e=t.detail;this._adjustMap(t=>{switch(e.op){case"pan":return Te(t,e.dx,e.dy);case"zoom":return Oe(t,e.factor,e.at);case"rotate":return Be(t,(t.rotation_deg??0)+e.deltaDeg,e.at);case"pinch":{const i=Oe(Te(t,e.dx,e.dy),e.factor,e.at);return Be(i,(i.rotation_deg??0)+e.rotateDeg,e.at)}}})},this._onMapRotationSet=t=>{const e=this._propertyCanvas?.getViewCenter()??{x:0,y:0};this._adjustMap(i=>Be(i,t.detail.deg,e))},this._onMapZoomStep=t=>{const e=this._propertyCanvas?.getViewCenter()??{x:0,y:0};this._adjustMap(i=>Oe(i,t.detail.factor,e))},this._onMapStyleChange=t=>{const e=this._propertyLayout.map_background;e&&this._updatePropertyLayout({map_background:{...e,style:t.target.value}})},this._onMapOpacityChange=t=>{const e=this._propertyLayout.map_background;e&&this._updatePropertyLayout({map_background:{...e,opacity:Number(t.target.value)}})},this._onUndo=()=>this._undoRedo("undo"),this._onRedo=()=>this._undoRedo("redo"),this._onPropertyModeChange=t=>{this._propertyMode=t.detail.mode,this._armedBuildingKey=null,this._armedEntityId=null,this._selectedPlacementId=null},this._onOutdoorPinPlace=t=>{if(!this._armedEntityId)return;const e=this._entityLookup.get(this._armedEntityId),i=Tt(e?.device_id??null,t.detail.x,t.detail.y,null);this._updatePropertyLayout({pins:[...this._propertyLayout.pins,i]}),this._armedEntityId=null,this._selectedOutdoorPinId=i.id,this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null},this._onOutdoorPinMove=t=>{this._patchOutdoorPin(t.detail.id,{x:t.detail.x,y:t.detail.y})},this._onOutdoorPinSelect=t=>{this._selectedOutdoorPinId=t.detail.id,null!==t.detail.id&&(this._selectedPlacementId=null,this._selectedPropertyMeshLinkKey=null)},this._onOutdoorPinRename=()=>{const t=this._selectedOutdoorPin;if(!t)return;const e=window.prompt("Label (blank to clear override):",this._pinLabel(t));null!==e&&this._patchOutdoorPin(t.id,{label_override:e||null})},this._onOutdoorPinIcon=()=>{const t=this._selectedOutdoorPin;t&&(this._iconPickerFor={kind:"outdoor",pinId:t.id})},this._onOutdoorPinDelete=()=>{const t=this._selectedOutdoorPin;t&&window.confirm(`Remove "${this._pinLabel(t)}" from the property?`)&&(this._updatePropertyLayout({pins:this._propertyLayout.pins.filter(e=>e.id!==t.id)}),this._selectedOutdoorPinId=null)},this._onPropertyMeshLinkSelect=t=>{this._selectedPropertyMeshLinkKey=t.detail.key,null!==t.detail.key&&(this._selectedOutdoorPinId=null,this._selectedPlacementId=null)},this._onClearAllOutdoorPins=()=>{const t=this._propertyLayout.pins.length;0!==t&&window.confirm(`Remove all ${t} outdoor device${1===t?"":"s"} from the property?`)&&(this._autoSaveHeld=!0,this._updatePropertyLayout({pins:[]}),this._selectedOutdoorPinId=null)},this._onPropertyMeshGotoFloor=t=>{this._selectFloor(t.detail.floorId)},this._onPlacementArm=t=>{this._armedBuildingKey=t.detail.key,this._propertyMode="place",this._selectedPlacementId=null},this._onPlacementPlace=t=>{if(!this._armedBuildingKey)return;const e=this._buildings.find(t=>t.key===this._armedBuildingKey);if(!e)return;const i=function(t,e,i,o,n,s){const r=n>=1?Bt:Bt*n,a=n>=1?Bt/n:Bt;return{id:Lt("placement"),building_id:e,floor_id:t,label_override:null,x:i,y:o,width:r,height:a,rotation_deg:0,aspect_ratio:n,source_bounds:s}}(e.floorId,e.buildingId,t.detail.x,t.detail.y,e.aspectRatio,this._buildingBounds(this._floors.filter(t=>(t.building_id??t.floor_id)===e.key)));this._updatePropertyLayout({placements:[...this._propertyLayout.placements,i]}),this._armedBuildingKey=null,this._propertyMode="select",this._selectedPlacementId=i.id},this._onPlacementMove=t=>{const e=this._propertyLayout.placements.find(e=>e.id===t.detail.id);e&&this._patchPlacement(t.detail.id,{x:e.x+t.detail.dx,y:e.y+t.detail.dy})},this._onPlacementResize=t=>{this._patchPlacement(t.detail.id,{width:t.detail.width,height:t.detail.height,x:t.detail.x,y:t.detail.y})},this._onPlacementRotate=t=>{this._patchPlacement(t.detail.id,{rotation_deg:t.detail.rotationDeg})},this._onPlacementSelect=t=>{this._selectedPlacementId=t.detail.id,null!==t.detail.id&&(this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null)},this._onPlacementRenameClick=()=>{const t=this._selectedPlacement;if(!t)return;const e=t.label_override??this._floorNameById.get(t.floor_id)??t.floor_id,i=window.prompt("Label (blank to clear override):",e);null!==i&&this._patchPlacement(t.id,{label_override:i||null})},this._onPlacementDeleteClick=()=>{const t=this._selectedPlacement;if(!t)return;const e=t.label_override??this._floorNameById.get(t.floor_id)??t.floor_id;window.confirm(`Delete the "${e}" placement?`)&&(this._updatePropertyLayout({placements:this._propertyLayout.placements.filter(e=>e.id!==t.id)}),this._selectedPlacementId=null)},this._onPlacementGotoFloorClick=()=>{const t=this._selectedPlacement;t&&this._selectFloor(t.floor_id)},this._onModeChange=t=>{this._mode=this._mode===t.detail.mode?"select":t.detail.mode,this._armedEntityId=null,this._armedOpeningType=null,"select"!==this._mode&&(this._editingRoomId=null,this._editingWallId=null),"align"!==this._mode&&this._resetAlignState()},this._onAddOpeningClick=t=>{this._mode="opening",this._armedOpeningType=t.detail.openingType,this._editingRoomId=null,this._editingWallId=null},this._onSaveClick=()=>{this._autoSaveHeld=!1;("property"===this._view?this._saveProperty():this._save()).catch(()=>{})},this._placementKeyForEntities=null,this._onVisibilityChange=()=>{"visible"===document.visibilityState&&this._checkVersion()},this._onBeforeUnload=t=>{(this._dirty||this._propertyDirty)&&(this._flushAutoSave(),t.preventDefault(),t.returnValue="")},this._onExportClick=()=>{this._export()},this._onResetClick=()=>{if("property"===this._view){if(!window.confirm("Reset the property view? This clears every building placement, every outdoor device and the background photo. Nothing is permanent until you hit Save afterward."))return;return this._autoSaveHeld=!0,this._propertyHistory.record(this._propertyLayout),this._propertyLayout={background_image_id:null,background_opacity:.85,background_offset_x:0,background_offset_y:0,background_scale:1,view_box:null,placements:[],pins:[]},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const t=this._floors.find(t=>t.floor_id===this._currentFloorId)?.name??"this floor";window.confirm(`Reset "${t}"? This clears every room, wall, opening, placed device, and the background image on this floor. Nothing is permanent until you hit Save afterward.`)&&(this._autoSaveHeld=!0,this._floorHistory.record(this._layout),this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,view_box:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)},this._onToggleBackgroundPopover=()=>{this._backgroundPopoverOpen=!this._backgroundPopoverOpen,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMeshPopover=()=>{const t=!this._meshPopoverOpen;this._meshPopoverOpen=t,this._backgroundPopoverOpen=!1,this._settingsPopoverOpen=!1,this._moreOptionsPopoverOpen=!1,t||(this._unsubscribeMatter(),this._unsubscribeBluetooth(),this._networkType=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onToggleSettingsPopover=()=>{this._settingsPopoverOpen=!this._settingsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._moreOptionsPopoverOpen=!1},this._onToggleMoreOptionsPopover=()=>{this._moreOptionsPopoverOpen=!this._moreOptionsPopoverOpen,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._settingsPopoverOpen=!1},this._onSettingsChange=t=>{const e=t.detail;this._settings={...this._settings,...e};const i=this._client.saveSettings(this._settings);if("auto_save"in e&&this._scheduleAutoSave(),"zigbee_coordinator_device_id"in e&&(this._selectedMeshLink=null,this._selectedMeshStub=null),"debug_logging"in e){const t=!!e.debug_logging;i.then(()=>{$t.configure(this._client,t),$t.log("debug_logging_on",{panel_version:"0.14.0-beta.1",panel_build:"0.14.0-beta.1+mv2u6kwe",user_agent:navigator.userAgent})})}},this._onNetworkTypeSelect=t=>{"matter"===this._networkType&&"matter"!==t&&this._unsubscribeMatter(),"bluetooth"===this._networkType&&"bluetooth"!==t&&this._unsubscribeBluetooth(),this._networkType=t,this._selectedMeshLink=null,this._selectedMeshStub=null,"wifi"===t?this._refreshWifiMesh():"matter"===t?this._subscribeMatter():"bluetooth"===t?this._subscribeBluetooth():"zigbee"===t&&this._loadCachedZigbeeMesh()},this._onLoadMesh=()=>{this._refreshZigbeeMesh(null!==this._zigbeeMeshFetchedAt)},this._onKeyDown=t=>{if(this._isTypingTarget())return;if(this._iconPickerFor)return;if("Escape"===t.key){if(t.preventDefault(),"floor"===this._view&&this._canvas?.cancelGesture())return;return"property"===this._view&&this._propertyCanvas?.cancelGesture()?void(this._propertyDragStart&&(this._propertyHistory.discardIfLast(this._propertyDragStart),this._propertyLayout=this._propertyDragStart,this._propertyDragStart=null)):(this._onCancelPending(),this._mode="select",this._armedEntityId=null,this._armedOpeningType=null,this._armedBuildingKey=null,void(this._propertyMode="select"))}const e=t.ctrlKey||t.metaKey,i=t.key.toLowerCase(),o=e&&!t.shiftKey&&"z"===i,n=e&&(t.shiftKey&&"z"===i||"y"===i);if(!o&&"Backspace"!==t.key||!this._canvas?.undoLastPoint())return o||n?(t.preventDefault(),void this._undoRedo(o?"undo":"redo")):"Delete"===t.key||"Backspace"===t.key?"property"===this._view?((this._selectedOutdoorPin||this._selectedPlacement)&&t.preventDefault(),void(this._selectedOutdoorPin?this._onOutdoorPinDelete():this._selectedPlacement&&this._onPlacementDeleteClick())):((this._selectedRoom||this._selectedPin||this._selectedWall||this._selectedOpening)&&t.preventDefault(),void(this._selectedRoom?this._onRoomDelete():this._selectedPin?this._onPinDelete():this._selectedWall?this._onWallDelete():this._selectedOpening&&this._onOpeningDelete())):void("Enter"===t.key&&"wall"===this._mode&&(t.preventDefault(),this._onFinishWall()));t.preventDefault()},this._onFileInputChange=async t=>{const e=t.target,i=e.files?.[0];e.value="",i&&this._handleBackgroundFile(i)},this._onCanvasDragOver=t=>{t.dataTransfer?.types.includes("Files")&&(t.preventDefault(),this._dragOverCanvas=!0)},this._onCanvasDragLeave=()=>{this._dragOverCanvas=!1},this._onCanvasDrop=t=>{if(!t.dataTransfer?.types.includes("Files"))return;t.preventDefault(),this._dragOverCanvas=!1;const e=t.dataTransfer.files?.[0];e&&this._handleBackgroundFile(e)},this._onRemoveBackgroundClick=()=>{"property"===this._view?this._updatePropertyLayout({background_image_id:null}):this._updateLayout({background_image_id:null})},this._onOpacityChange=t=>{const e=Number(t.target.value);"property"===this._view?this._updatePropertyLayout({background_opacity:e}):this._updateLayout({background_opacity:e})},this._onCancelPending=()=>this._canvas?.cancelPending(),this._onFinishWall=()=>this._canvas?.finishPendingWall(),this._onAlignTargetChange=async t=>{const e=t.detail.floorId;e?(this._alignTargetFloorId=e,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._alignTargetLayout=await this._client.getLayout(e)):this._resetAlignState()},this._onAlignDrag=t=>{this._alignOffsetX+=t.detail.dx,this._alignOffsetY+=t.detail.dy},this._onAlignScaleClick=t=>{const{factor:e}=t.detail,i=this._canvas?.getViewBox();if(i){const t=i.x+i.w/2,o=i.y+i.h/2;this._alignOffsetX=e*this._alignOffsetX+(1-e)*t,this._alignOffsetY=e*this._alignOffsetY+(1-e)*o}this._alignScale*=e},this._onAlignCancel=()=>{this._mode="select",this._resetAlignState()},this._onAlignApply=async()=>{if(!this._alignTargetFloorId||!this._alignTargetLayout)return;const t=this._alignTargetFloorId,e=this._floors.find(e=>e.floor_id===t)?.name??"that floor";if(!window.confirm(`Apply this alignment to "${e}"? This rewrites every room, wall, door/window, and placed device position on that floor — plus its background image's placement and, if this floor has one set, its scale calibration too — to match this floor's coordinate system. This saves immediately and cannot be undone.`))return;const i=this._alignScale,o=this._alignOffsetX,n=this._alignOffsetY,s=([t,e])=>[t*i+o,e*i+n],r=this._alignTargetLayout,a=this._layout.building_id??Lt("building"),l={background_image_id:r.background_image_id,background_opacity:r.background_opacity,background_offset_x:r.background_offset_x*i+o,background_offset_y:r.background_offset_y*i+n,background_scale:r.background_scale*i,building_id:a,view_box:r.view_box?(()=>{const[t,e]=s([r.view_box.x,r.view_box.y]);return{x:t,y:e,w:r.view_box.w*i,h:r.view_box.h*i}})():null,rooms:r.rooms.map(t=>({...t,points:t.points.map(s)})),walls:r.walls.map(t=>({...t,points:t.points.map(s)})),pins:r.pins.map(t=>{const[e,i]=s([t.x,t.y]);return{...t,x:e,y:i}}),openings:r.openings.map(t=>{const[e,o]=s([t.x,t.y]);return{...t,x:e,y:o,width:t.width*i}}),scale:this._layout.scale??(r.scale?{points:[s(r.scale.points[0]),s(r.scale.points[1])],meters:r.scale.meters}:null)};await this._client.saveLayout(t,l),this._layout.building_id!==a&&(await this._client.setBuildingId(this._currentFloorId,a),this._layout={...this._layout,building_id:a}),this._floors=await this._client.listFloors(),this._mode="select",this._resetAlignState(),this._floorHistory.clear()},this._onRoomRename=()=>{const t=this._selectedRoom;if(!t)return;const e=window.prompt("Room name:",t.name);e&&this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===t.id?{...i,name:e}:i)})},this._onRoomAreaChange=t=>{const e=this._selectedRoom;if(!e)return;const i=t.detail.areaId||null,o=this._areas.find(t=>t.area_id===i);this._updateLayout({rooms:this._layout.rooms.map(t=>t.id===e.id?{...t,area_id:i,name:o?o.name:t.name}:t)})},this._onRoomMove=t=>{const{roomId:e,dx:i,dy:o}=t.detail;$t.log("room_move",{room_id:e,dx:Math.round(i),dy:Math.round(o)});const n=([t,e])=>[t+i,e+o],s=this._layout.rooms.map(t=>t.id===e?{...t,points:t.points.map(n),...t.label_position?{label_position:n(t.label_position)}:{}}:t),r=this._layout.pins.map(t=>t.room_id===e?{...t,x:t.x+i,y:t.y+o}:t);this._updateLayout({rooms:s,pins:Nt(s,r)})},this._onRoomLabelMoved=t=>{this._patchRoom(t.detail.roomId,{label_position:[t.detail.x,t.detail.y]})},this._onRoomLabelReset=()=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{label_position:null})},this._onRoomVisibleToggle=()=>{const t=this._selectedRoom;t&&this._patchRoom(t.id,{visible:!1===t.visible})},this._onRoomFillColorChange=t=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{fill_color:t.detail.color})},this._onRoomFillOpacityChange=t=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{fill_opacity:t.detail.opacity})},this._onRoomBorderOpacityChange=t=>{const e=this._selectedRoom;e&&this._patchRoom(e.id,{border_opacity:t.detail.opacity})},this._onRoomEditVertices=()=>{this._selectedRoomId&&(this._editingRoomId=this._editingRoomId===this._selectedRoomId?null:this._selectedRoomId)},this._onRoomDelete=()=>{const t=this._selectedRoom;if(!t||!window.confirm(`Delete room "${t.name}"?`))return;const e=this._layout.rooms.filter(e=>e.id!==t.id);this._updateLayout({rooms:e,pins:Nt(e,this._layout.pins)}),this._selectedRoomId=null,this._editingRoomId=null},this._onPinSetLabel=()=>{const t=this._selectedPin;if(!t)return;const e=window.prompt("Label override (blank to clear):",t.label_override??"");null!==e&&this._patchPin(t.id,{label_override:e||null})},this._onPinSetIcon=()=>{const t=this._selectedPin;t&&(this._iconPickerFor={kind:"floor",pinId:t.id})},this._onIconPicked=t=>{const e=this._iconPickerFor;if(this._iconPickerFor=null,!e)return;const i={icon_override:t.detail.icon};"floor"===e.kind?this._patchPin(e.pinId,i):this._patchOutdoorPin(e.pinId,i)},this._onIconPickerCancel=()=>{this._iconPickerFor=null},this._onPinSetHeight=()=>{const t=this._selectedPin;if(!t)return;const e=this._settings.unit_system,i="imperial"===e?"feet":"metres",o="imperial"===e?"6":"1.8",n=window.prompt(`Mounting height in ${i} above floor level (e.g. ${o} for a high wall mount; blank to clear):`,null===t.height_m?"":oe(t.height_m,e));if(null===n)return;const s=""===n.trim()?null:ne(n,e);this._patchPin(t.id,{height_m:null!==s&&Number.isFinite(s)?s:null})},this._onPinDelete=()=>{const t=this._selectedPin;t&&window.confirm(`Delete pin for ${this._pinLabel(t)}?`)&&(this._updateLayout({pins:this._layout.pins.filter(e=>e.id!==t.id)}),this._selectedPinId=null)},this._onWallMaterialChange=t=>{const e=this._selectedWall;e&&this._updateLayout({walls:this._layout.walls.map(i=>i.id===e.id?{...i,material:t.detail.material}:i)})},this._onWallThicknessChange=t=>{const e=this._selectedWall;e&&(!Number.isFinite(t.detail.thicknessCm)||t.detail.thicknessCm<=0||this._updateLayout({walls:this._layout.walls.map(i=>i.id===e.id?{...i,thickness_cm:t.detail.thicknessCm}:i)}))},this._onWallEditVertices=()=>{this._selectedWallId&&(this._editingWallId=this._editingWallId===this._selectedWallId?null:this._selectedWallId)},this._onWallDelete=()=>{const t=this._selectedWall;t&&window.confirm("Delete this wall? Any doors/windows on it will be removed too.")&&(this._updateLayout({walls:this._layout.walls.filter(e=>e.id!==t.id),openings:this._layout.openings.filter(e=>e.wallId!==t.id)}),this._selectedWallId=null,this._editingWallId=null)},this._onOpeningWidthChange=t=>{const e=this._selectedOpening;if(!e)return;const i=t.detail.width;this._updateLayout({openings:this._layout.openings.map(t=>t.id===e.id?{...t,width:i}:t)})},this._onOpeningDelete=()=>{const t=this._selectedOpening;t&&window.confirm(`Delete this ${t.type}?`)&&(this._updateLayout({openings:this._layout.openings.filter(e=>e.id!==t.id)}),this._selectedOpeningId=null)},this._onEntityArmed=t=>{this._armedEntityId=this._armedEntityId===t.detail.entityId?null:t.detail.entityId},this._onClearAllPins=()=>{const t=this._layout.pins.length;0!==t&&window.confirm(`Remove all ${t} placed device${1===t?"":"s"} from this floor?`)&&(this._autoSaveHeld=!0,this._updateLayout({pins:[]}),this._selectedPinId=null,this._pinStackIds=null)},this._onRoomTraceComplete=t=>{const e=(i="New Room",o=t.detail.points,n=null,{id:Lt("room"),name:i,area_id:n,points:o});var i,o,n;const s=[...this._layout.rooms,e];this._updateLayout({rooms:s,pins:Nt(s,this._layout.pins)}),this._selectedRoomId=e.id},this._onRoomVertexChanged=t=>{const e=this._layout.rooms.map(e=>{if(e.id!==t.detail.roomId)return e;const i=e.label_position,o=!i||Wt(i[0],i[1],t.detail.points);return{...e,points:t.detail.points,...o?{}:{label_position:null}}});this._updateLayout({rooms:e,pins:Nt(e,this._layout.pins)})},this._onRoomSelect=t=>{this._selectedRoomId=t.detail.roomId,null===t.detail.roomId?this._editingRoomId=null:(this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onWallTraceComplete=t=>{this._updateLayout({walls:[...this._layout.walls,Ot(t.detail.points)]})},this._onWallVertexChanged=t=>{this._updateLayout({walls:this._layout.walls.map(e=>e.id===t.detail.wallId?{...e,points:t.detail.points}:e)})},this._onWallSelect=t=>{this._selectedWallId=t.detail.wallId,null===t.detail.wallId?this._editingWallId=null:(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningPlace=t=>{if(!this._armedOpeningType)return;const e=function(t,e,i,o,n){return{id:Lt("opening"),wallId:t,type:e,x:i,y:o,width:n}}(t.detail.wallId,this._armedOpeningType,t.detail.x,t.detail.y,this._defaultOpeningWidth());this._updateLayout({openings:[...this._layout.openings,e]})},this._onOpeningSelect=t=>{this._selectedOpeningId=t.detail.openingId,null!==t.detail.openingId&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onOpeningUpdate=t=>{this._updateLayout({openings:this._layout.openings.map(e=>e.id===t.detail.openingId?{...e,x:t.detail.x,y:t.detail.y,width:t.detail.width}:e)})},this._onPinPlace=t=>{if(!this._armedEntityId)return;const e=Ut(t.detail.x,t.detail.y,this._layout.rooms),i=this._entityLookup.get(this._armedEntityId),o=Tt(i?.device_id??null,t.detail.x,t.detail.y,e),n=this._layout.pins.filter(e=>e.x===t.detail.x&&e.y===t.detail.y);this._updateLayout({pins:[...this._layout.pins,o]}),this._armedEntityId=null,n.length>0?(this._pinStackIds=[...n.map(t=>t.id),o.id],this._selectedPinId=null):(this._pinStackIds=null,this._selectedPinId=o.id,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinMove=t=>{const e=Ut(t.detail.x,t.detail.y,this._layout.rooms);this._patchPin(t.detail.pinId,{x:t.detail.x,y:t.detail.y,room_id:e})},this._onPinSelect=t=>{this._selectedPinId=t.detail.pinId,this._pinStackIds=null,null!==t.detail.pinId&&(this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null)},this._onPinStackSelect=t=>{this._pinStackIds=t.detail.pinIds,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedPinId=null,this._selectedMeshLink=null,this._selectedMeshStub=null},this._onMeshLinkSelect=t=>{this._selectedMeshLink=t.detail.link,null!==t.detail.link&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshStub=null)},this._onMeshStubSelect=t=>{this._selectedMeshStub=t.detail.stub,null!==t.detail.stub&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null)},this._onMeshStubGotoFloorClick=()=>{const t=this._selectedMeshStub;t&&(t.targetFloorId===yt?this._selectProperty():this._selectFloor(t.targetFloorId))},this._onPinStackChoose=t=>{this._pinStackIds=null,this._selectedPinId=t.detail.pinId},this._onPinStackDismiss=()=>{this._pinStackIds=null},this._onPinStackRemove=t=>{const e=this._layout.pins.find(e=>e.id===t.detail.pinId);if(!e)return;if(!window.confirm(`Remove ${this._pinLabel(e)} from this spot?`))return;this._updateLayout({pins:this._layout.pins.filter(e=>e.id!==t.detail.pinId)});const i=(this._pinStackIds??[]).filter(e=>e!==t.detail.pinId);this._pinStackIds=i.length>1?i:null,this._selectedPinId=1===i.length?i[0]:null},this._onScaleLineComplete=t=>{const e=this._settings.unit_system,i="imperial"===e?"feet":"metres",o=window.prompt(`Real-world distance between these two points, in ${i}:`),n=o?ne(o,e):null;if(null===n||!Number.isFinite(n)||n<=0)return;const s=t.detail.points;this._updateLayout({scale:{points:s,meters:n}}),this._mode="select"},this._onPendingChanged=t=>{this._pendingCount=t.detail.count},this._onSnapModeChange=t=>{this._snapMode=t.detail.snapMode;try{localStorage.setItem(Qe,this._snapMode)}catch{}}}set hass(t){this._hass=t,this._initialized||(this._initialized=!0,this._init())}get hass(){return this._hass}get _client(){return new Ct(this._hass)}get _entityLookup(){return new Map(this._entities.map(t=>[t.entity_id,t]))}get _placedDeviceIds(){return new Set(("property"===this._view?this._propertyLayout.pins:this._layout.pins).map(t=>t.device_id).filter(t=>null!==t))}get _selectedRoom(){return this._layout.rooms.find(t=>t.id===this._selectedRoomId)??null}get _areasForCurrentFloor(){return this._areas.filter(t=>t.floor_id===this._currentFloorId||null===t.floor_id)}get _outdoorAreaIdsOnCurrentFloor(){const t=new Set(this._areas.filter(t=>null===t.floor_id).map(t=>t.area_id));return new Set(this._layout.rooms.map(t=>t.area_id).filter(e=>null!==e&&t.has(e)))}get _otherFloors(){return this._floors.filter(t=>t.floor_id!==this._currentFloorId)}get _buildings(){const t=new Map;for(const e of this._floors){const i=e.building_id??e.floor_id,o=t.get(i);o?o.push(e):t.set(i,[e])}return[...t.entries()].map(([t,e])=>{const i=e[0];return{key:t,name:e.length>1?e.map(t=>t.name).join(" + "):i.name,icon:i.icon||"mdi:home-city",floorId:i.floor_id,buildingId:i.building_id,aspectRatio:this._buildingAspectRatio(e)}})}_buildingAspectRatio(t){const e=this._buildingBounds(t),i=e?e.max_x-e.min_x:0,o=e?e.max_y-e.min_y:0;return i>0&&o>0?i/o:1.375}_buildingBounds(t){const e=t.map(t=>t.content_bounds).filter(t=>null!==t);return 0===e.length?null:{min_x:Math.min(...e.map(t=>t.min_x)),min_y:Math.min(...e.map(t=>t.min_y)),max_x:Math.max(...e.map(t=>t.max_x)),max_y:Math.max(...e.map(t=>t.max_y))}}get _floorNameById(){return new Map(this._floors.map(t=>[t.floor_id,t.name]))}get _floorIconById(){return new Map(this._floors.map(t=>[t.floor_id,t.icon||"mdi:floor-plan"]))}get _livePlacements(){const t=[];for(const e of this._propertyLayout.placements){if(this._floors.some(t=>t.floor_id===e.floor_id)){t.push(e);continue}const i=null!==e.building_id?this._floors.find(t=>t.building_id===e.building_id):void 0;i&&t.push({...e,floor_id:i.floor_id})}return t}get _selectedPlacement(){return this._livePlacements.find(t=>t.id===this._selectedPlacementId)??null}get _activeBackground(){return"property"===this._view?{imageId:this._propertyLayout.background_image_id,opacity:this._propertyLayout.background_opacity}:{imageId:this._layout.background_image_id,opacity:this._layout.background_opacity}}get _alignOverlay(){if("align"!==this._mode||!this._alignTargetLayout)return null;const t=Et(this._alignTargetLayout.background_image_id);if(!t)return null;const e=this._alignTargetLayout;return{imageUrl:t,offsetX:this._alignScale*e.background_offset_x+this._alignOffsetX,offsetY:this._alignScale*e.background_offset_y+this._alignOffsetY,scale:this._alignScale*e.background_scale,opacity:.55}}get _orderedFloors(){if("ground_up"!==this._settings.floor_order)return this._floors;const t=this._floors.filter(t=>null!==t.level),e=this._floors.filter(t=>null===t.level);return[...t.reverse(),...e]}get _placedDeviceChoices(){const t=t=>t.label_override??wt(t.device_id,this._entityLookup.values()),e=new Map;for(const i of this._layout.pins)i.device_id&&e.set(i.device_id,t(i));for(const[i,{pin:o}]of this._otherFloorPinsByDeviceId)e.has(i)||e.set(i,t(o));return[...e].map(([t,e])=>({deviceId:t,label:e})).sort((t,e)=>t.label.localeCompare(e.label))}get _pinByDeviceId(){const t=new Map;for(const e of this._layout.pins)e.device_id&&t.set(e.device_id,e);return t}get _normalizedMeshLinks(){if(!this._meshPopoverOpen)return[];if("zigbee"===this._networkType&&this._zigbeeMesh){const t=this._pinByDeviceId,e=this._outdoorPinByDeviceId,i=i=>t.has(i)?this._currentFloorId??void 0:e.has(i)?yt:this._otherFloorPinsByDeviceId.get(i)?.floorId;return function(t,e,i){const o=t.links.filter(t=>t.source_device_id&&t.target_device_id&&void 0!==e(t.source_device_id)&&void 0!==e(t.target_device_id));if(i)return o;const n=t.nodes.find(t=>"Coordinator"===t.type)?.ieee,s=new Set,r=new Map,a=new Map;for(const t of o){t.parent_child&&s.add(t),(t.source_ieee===n||t.target_ieee===n)&&t.lqi>=50&&s.add(t);const i=e(t.source_device_id)!==e(t.target_device_id)?a:r;for(const e of[t.source_ieee,t.target_ieee]){const o=i.get(e);(!o||t.lqi>o.lqi)&&i.set(e,t)}}for(const t of r.values())s.add(t);for(const t of a.values())s.add(t);return[...s]}(function(t,e){const i=t.nodes.find(t=>"Coordinator"===t.type)?.ieee;return e&&i?{...t,nodes:t.nodes.map(t=>t.ieee===i?{...t,device_id:e}:t),links:t.links.map(t=>({...t,source_device_id:t.source_ieee===i?e:t.source_device_id,target_device_id:t.target_ieee===i?e:t.target_device_id}))}:t}(this._zigbeeMesh,this._settings.zigbee_coordinator_device_id),i,this._zigbeeShowAllLinks).map(t=>{return{sourceDeviceId:t.source_device_id,targetDeviceId:t.target_device_id,quality:(e=t.lqi,e>=150?"strong":e>=80?"medium":"weak"),detail:t.lqi_readings.every(e=>e===t.lqi)?`LQI ${t.lqi}`:`LQI ${t.lqi} (raw ${t.lqi_readings.join(" / ")})`};var e})}if("wifi"===this._networkType&&this._wifiMesh)return this._wifiMesh.links.map(t=>{return{sourceDeviceId:t.source_device_id,targetDeviceId:t.target_device_id,quality:null!=t.rssi_dbm?(e=t.rssi_dbm,e>=-50?"strong":e>=-70?"medium":"weak"):"unknown",...null!=t.rssi_dbm?{detail:`${t.rssi_dbm} dBm`}:{}};var e});if("bluetooth"===this._networkType){const t=[];for(const e of this._bluetoothAdverts.values()){const i=this._bluetoothDevices[e.address]??[],o=this._bluetoothDevices[e.source]??[];for(const n of i)for(const i of o)n!==i&&t.push({sourceDeviceId:n,targetDeviceId:i,quality:null!=e.rssi?ft(e.rssi):"unknown",...null!=e.rssi?{detail:`RSSI ${e.rssi} dBm`}:{}})}return t}if("matter"===this._networkType&&this._matterTopology){const t=new Map;for(const e of this._matterTopology.nodes)e.ha_device_id&&t.set(e.id,e.ha_device_id);const e=[];for(const i of this._matterTopology.connections){const o=t.get(i.source),n=t.get(i.target);o&&n&&e.push({sourceDeviceId:o,targetDeviceId:n,quality:i.strength,detail:i.strength})}return e}return[]}get _outdoorPinByDeviceId(){const t=new Map;for(const e of this._propertyLayout.pins)e.device_id&&t.set(e.device_id,e);return t}_propertyEnd(t){const e=this._outdoorPinByDeviceId.get(t);if(e)return{deviceId:t,x:e.x,y:e.y,label:this._pinLabel(e),floorId:null};const i=this._pinByDeviceId.get(t),o=i?{pin:i,floorId:this._currentFloorId}:this._otherFloorPinsByDeviceId.get(t);if(!o?.floorId)return null;const n=this._placementForFloor(o.floorId),s=n?function(t,e,i){const o=t.source_bounds;if(!o||o.max_x<=o.min_x||o.max_y<=o.min_y)return null;const n=((e-o.min_x)/(o.max_x-o.min_x)-.5)*t.width,s=((i-o.min_y)/(o.max_y-o.min_y)-.5)*t.height,r=t.rotation_deg*Math.PI/180,a=Math.cos(r),l=Math.sin(r);return{x:t.x+a*n-l*s,y:t.y+l*n+a*s}}(n,o.pin.x,o.pin.y):null;return s?{deviceId:t,...s,label:this._pinLabel(o.pin),floorId:o.floorId}:null}get _propertyMeshLinks(){const t=this._outdoorPinByDeviceId,e=[];for(const i of this._normalizedMeshLinks){if(!t.has(i.sourceDeviceId)&&!t.has(i.targetDeviceId))continue;const o=this._propertyEnd(i.sourceDeviceId),n=this._propertyEnd(i.targetDeviceId);o&&n&&e.push({key:`${i.sourceDeviceId}|${i.targetDeviceId}`,from:o,to:n,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return e}get _selectedPropertyMeshLink(){return this._propertyMeshLinks.find(t=>t.key===this._selectedPropertyMeshLinkKey)??null}get _meshLinksForCurrentFloor(){const t=this._pinByDeviceId,e=[];for(const i of this._normalizedMeshLinks){const o=t.get(i.sourceDeviceId),n=t.get(i.targetDeviceId);o&&n&&e.push({fromPin:o,toPin:n,quality:i.quality,...i.detail?{detail:i.detail}:{}})}return e}_placementForFloor(t){const e=this._floors.find(e=>e.floor_id===t);return e?this._propertyLayout.placements.find(i=>null!==e.building_id?i.building_id===e.building_id:i.floor_id===t)??null:null}_currentFloorContentBounds(){const t=[];for(const e of this._layout.rooms)t.push(...e.points);for(const e of this._layout.walls)t.push(...e.points);if(0===t.length)return null;const e=t.map(([t])=>t),i=t.map(([,t])=>t),o=Math.min(...e),n=Math.max(...e),s=Math.min(...i),r=Math.max(...i),a=.05*Math.max(n-o,r-s)||20;return{minX:o-a,minY:s-a,maxX:n+a,maxY:r+a}}_projectStubTowardBuilding(t,e){if(!this._currentFloorId)return null;const i=this._placementForFloor(this._currentFloorId),o=this._placementForFloor(e);if(!i||!o)return null;const n=this._currentFloorContentBounds();if(!n)return null;const s=Math.atan2(o.y-i.y,o.x-i.x)-i.rotation_deg*Math.PI/180;return function(t,e,i,o,n){const s=i>0?(n.maxX-t)/i:i<0?(n.minX-t)/i:1/0,r=o>0?(n.maxY-e)/o:o<0?(n.minY-e)/o:1/0,a=Math.min(s,r);return!isFinite(a)||a<=0?null:{x:t+i*a,y:e+o*a}}(t.x,t.y,Math.cos(s),Math.sin(s),n)}get _meshStubsForCurrentFloor(){if(!this._currentFloorId)return[];const t=this._pinByDeviceId,e=this._otherFloorPinsByDeviceId,i=this._floors.find(t=>t.floor_id===this._currentFloorId),o=[];for(const n of this._normalizedMeshLinks){const s=t.has(n.sourceDeviceId);if(s===t.has(n.targetDeviceId))continue;const r=t.get(s?n.sourceDeviceId:n.targetDeviceId),a=s?n.targetDeviceId:n.sourceDeviceId,l=this._outdoorPinByDeviceId.get(a);if(l){const t=this._placementForFloor(this._currentFloorId),e=t?Pt(t,l.x,l.y):null;if(!e)continue;o.push({fromPin:r,x:e.x,y:e.y,targetDeviceId:a,targetFloorId:yt,targetFloorName:"Outside",targetLabel:this._pinLabel(l),quality:n.quality,...n.detail?{detail:n.detail}:{}});continue}const c=e.get(a);if(!c||c.floorId===this._currentFloorId)continue;const d=this._floors.find(t=>t.floor_id===c.floorId),h=c.pin.label_override??wt(c.pin.device_id,this._entityLookup.values()),p=null!==i?.building_id&&i?.building_id===d?.building_id?{x:c.pin.x,y:c.pin.y}:this._projectStubTowardBuilding(r,c.floorId);p&&o.push({fromPin:r,x:p.x,y:p.y,targetDeviceId:a,targetFloorId:c.floorId,targetFloorName:d?.name??c.floorId,targetLabel:h,quality:n.quality,...n.detail?{detail:n.detail}:{}})}return o}get _selectedPin(){return this._layout.pins.find(t=>t.id===this._selectedPinId)??null}get _pinStack(){if(!this._pinStackIds)return null;const t=new Map(this._layout.pins.map(t=>[t.id,t])),e=this._pinStackIds.map(e=>t.get(e)).filter(t=>!!t);return e.length>1?e:null}get _selectedWall(){return this._layout.walls.find(t=>t.id===this._selectedWallId)??null}get _selectedOpening(){return this._layout.openings.find(t=>t.id===this._selectedOpeningId)??null}get _selectedMeshLinkKey(){const t=this._selectedMeshLink;return t?`${t.fromPin.id}|${t.toPin.id}`:null}get _selectedMeshStubKey(){const t=this._selectedMeshStub;return t?`${t.fromPin.id}|${t.targetDeviceId}`:null}_unitsPerMeter(){const t=this._layout.scale;if(!t)return null;const[[e,i],[o,n]]=t.points;return(Math.hypot(o-e,n-i)||1)/t.meters}get _propertyScale(){const t=[];for(const e of this._livePlacements){const i=e.source_bounds;if(!i||e.width<=0)continue;const o=i.max_x-i.min_x;if(o<=0)continue;const n=this._buildingMetersPerUnit(e);null!==n&&t.push({area:e.width*e.height,mpu:n*o/e.width,name:e.label_override??this._floorNameById.get(e.floor_id)??"a building"})}if(0===t.length)return null;const e=t.reduce((t,e)=>e.area>t.area?e:t);return{metersPerUnit:e.mpu,buildingName:e.name,disagree:t.some(t=>Math.abs(t.mpu/e.mpu-1)>.1)}}_buildingMetersPerUnit(t){const e=this._floors.find(e=>e.floor_id===t.floor_id);if(e?.meters_per_unit)return e.meters_per_unit;if(null===t.building_id)return null;const i=this._floors.find(e=>e.building_id===t.building_id&&e.meters_per_unit);return i?.meters_per_unit??null}get _propertyScaleReadout(){const t=this._propertyScale;if(!t)return null;const e=this._settings.unit_system,i=ce(1/t.metersPerUnit,e);return`Scale (from ${t.buildingName}): 1 ${ie(e)} ≈ ${i.toFixed(1)} units`}get _scaleReadout(){const t=this._unitsPerMeter();if(null===t)return null;const e=this._settings.unit_system,i=ce(t,e);return`Scale: 1 ${ie(e)} ≈ ${i.toFixed(1)} units`}_defaultOpeningWidth(){const t=this._unitsPerMeter();return null===t?30:.9*t}async _init(){const[t,e,i,o,n]=await Promise.all([this._client.listFloors(),this._client.listPlaceableEntities(),this._client.listAreas(),this._client.getPropertyLayout(),this._client.getSettings()]);this._floors=t,this._entities=e,this._areas=i,this._propertyLayout=o,this._settings=n,$t.configure(this._client,n.debug_logging),$t.log("panel_open",{panel_version:"0.14.0-beta.1",panel_build:"0.14.0-beta.1+mv2u6kwe",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`,floors:t.length}),this._checkVersion();const s=this._orderedFloors[0];s&&await this._selectFloor(s.floor_id,{skipDirtyCheck:!0}),this._loading=!1}async _selectFloor(t,e={}){if(!e.skipDirtyCheck&&this._dirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save this floor — staying here so nothing is lost.")}else if(!window.confirm("Discard unsaved changes to this floor?"))return;this._autoSaveHeld=!1,this._view="floor";const i=this._layout.building_id;this._currentFloorId=t,this._layout=await this._client.getLayout(t),this._resetSelection(),this._resetAlignState(),this._floorHistory.clear();const o=Nt(this._layout.rooms,this._layout.pins);o!==this._layout.pins?(this._layout={...this._layout,pins:o},this._dirty=!0):this._dirty=!1,this._loadOtherFloorPins(t),$t.log("floor_load",{floor_id:t,rooms:this._layout.rooms.length,walls:this._layout.walls.length,pins:this._layout.pins.length,healed:this._dirty}),this._sameBuildingAsPreviousFloor=null!==this._layout.building_id&&this._layout.building_id===i}async _loadOtherFloorPins(t){const e=this._floors.filter(e=>e.floor_id!==t),i=await Promise.all(e.map(t=>this._client.getLayout(t.floor_id)));if(this._currentFloorId!==t)return;const o=new Map;e.forEach((t,e)=>{for(const n of i[e].pins)n.device_id&&o.set(n.device_id,{pin:n,floorId:t.floor_id})}),this._otherFloorPinsByDeviceId=o}_resetAlignState(){this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1}_resetSelection(){this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedMeshLink=null,this._selectedMeshStub=null,this._armedEntityId=null,this._armedOpeningType=null}async _save(){if(this._currentFloorId){this._saving=!0;try{const t=this._canvas?.getViewBox()??this._layout.view_box;this._layout={...this._layout,view_box:t};const e=this._layout,i=performance.now();try{await this._client.saveLayout(this._currentFloorId,e)}catch(t){throw this._saveError=this._describeSaveError(t),$t.log("save_error",{target:this._currentFloorId,error:t?.message}),t}$t.log("save",{target:this._currentFloorId,ms:Math.round(performance.now()-i),rooms:e.rooms.length,pins:e.pins.length}),this._saveError=null,this._layout===e&&(this._dirty=!1),this._floors=this._floors.map(t=>t.floor_id===this._currentFloorId?{...t,has_layout:!0}:t),await this._refreshEntitiesIfPlacementChanged()}finally{this._saving=!1}}}async _export(){const t=await this._client.exportSnapshot(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(e),o=document.createElement("a");o.href=i,o.download="layout.json",o.click(),URL.revokeObjectURL(i)}_updateLayout(t){this._floorHistory.record(this._layout),this._layout={...this._layout,...t},this._dirty=!0}async _selectProperty(){if(this._propertyDirty)if(this._autoSaveActive){if(!await this._flushAutoSave())return void window.alert("Couldn't save the property view — reopen the Property tab to try again.")}else if(!window.confirm("Discard unsaved changes to the property view?"))return;this._autoSaveHeld=!1,[this._propertyLayout,this._floors]=await Promise.all([this._client.getPropertyLayout(),this._client.listFloors()]),this._propertyHistory.clear(),$t.log("property_load",{placements:this._propertyLayout.placements.length,outdoor_pins:this._propertyLayout.pins.length}),this._propertyDirty=!1,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,this._selectedPropertyMeshLinkKey=null,this._propertyMode="select",this._armedBuildingKey=null,this._armedEntityId=null,this._view="property",this._loadPlacementGhosts()}async _loadPlacementGhosts(){const t=this._livePlacements,e=new Set,i=t=>this._floors.filter(e=>null!==t.building_id?e.building_id===t.building_id:e.floor_id===t.floor_id);for(const o of t)for(const t of i(o))e.add(t.floor_id);const o=new Map;await Promise.all([...e].map(async t=>{try{o.set(t,await this._client.getLayout(t))}catch{}}));const n=new Map;for(const e of t){const t=[],s=[];for(const n of i(e)){const e=o.get(n.floor_id);if(e){for(const i of e.rooms)!1!==i.visible&&t.push(i.points);for(const t of e.walls)s.push(t.points)}}n.set(e.id,{rooms:t,walls:s})}"property"===this._view&&(this._placementGhosts=n)}get _mapTilesAvailable(){const t=this._hass?.config;return!!t?.components?.includes("map_tiles")&&"number"==typeof t.latitude&&"number"==typeof t.longitude}_adjustMap(t){const e=this._propertyLayout.map_background;e&&this._updatePropertyLayout({map_background:t(e)})}_updatePropertyLayout(t){this._propertyHistory.record(this._propertyLayout),this._propertyLayout={...this._propertyLayout,...t},this._propertyDirty=!0}_undoRedo(t){if($t.log(t,{view:this._view}),"property"===this._view){const e=this._propertyLayout,i="undo"===t?this._propertyHistory.undo(e):this._propertyHistory.redo(e);if(!i)return;return this._propertyLayout={...i,view_box:e.view_box},this._propertyDirty=!0,this._selectedPlacementId=null,this._selectedOutdoorPinId=null,void(this._selectedPropertyMeshLinkKey=null)}const e=this._layout,i="undo"===t?this._floorHistory.undo(e):this._floorHistory.redo(e);i&&(this._layout={...i,view_box:e.view_box,building_id:e.building_id},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)}get _canUndo(){return"property"===this._view?this._propertyHistory.canUndo:this._floorHistory.canUndo}get _canRedo(){return"property"===this._view?this._propertyHistory.canRedo:this._floorHistory.canRedo}async _saveProperty(){this._propertySaving=!0;try{const t=this._propertyCanvas?.getViewBox()??this._propertyLayout.view_box;this._propertyLayout={...this._propertyLayout,view_box:t};const e=this._propertyLayout,i=performance.now();try{await this._client.savePropertyLayout(e)}catch(t){throw this._saveError=this._describeSaveError(t),$t.log("save_error",{target:"property",error:t?.message}),t}$t.log("save",{target:"property",ms:Math.round(performance.now()-i),placements:e.placements.length,pins:e.pins.length}),this._saveError=null,this._propertyLayout===e&&(this._propertyDirty=!1),await this._refreshEntitiesIfPlacementChanged()}finally{this._propertySaving=!1}}get _selectedOutdoorPin(){return this._propertyLayout.pins.find(t=>t.id===this._selectedOutdoorPinId)??null}_patchOutdoorPin(t,e){this._updatePropertyLayout({pins:this._propertyLayout.pins.map(i=>i.id===t?{...i,...e}:i)})}_patchPlacement(t,e){this._updatePropertyLayout({placements:this._propertyLayout.placements.map(i=>i.id===t?{...i,...e}:i)})}_describeSaveError(t){const e=t?.message||"unknown error";return/not a valid option|extra keys not allowed|invalid_format/i.test(e)?`${e} — Home Assistant may need a restart to finish updating Spatial Context.`:e}_placementKey(){return[...this._layout.pins,...this._propertyLayout.pins].map(t=>t.device_id??"").sort().join(",")}async _refreshEntitiesIfPlacementChanged(){const t=this._placementKey();t!==this._placementKeyForEntities&&(this._entities=await this._client.listPlaceableEntities(),this._placementKeyForEntities=t)}async _checkVersion(){let t=null,e=null;try{e=await this._client.getVersionInfo()}catch{t="restart"}e&&(e.loaded_version&&e.installed_version&&e.loaded_version!==e.installed_version?t="restart":e.panel_build_id&&"0.14.0-beta.1+mv2u6kwe"!==e.panel_build_id&&(t="reload")),t!==this._versionNotice&&$t.log("version_check",{notice:t,panel_build:"0.14.0-beta.1+mv2u6kwe",...e??{}}),this._versionNotice=t}async _downloadDebugReport(){await $t.flush();const t=await this._client.getDebugReport(),e=new Blob([JSON.stringify({...t,browser:{panel_version:"0.14.0-beta.1",panel_build:"0.14.0-beta.1+mv2u6kwe",user_agent:navigator.userAgent,viewport:`${window.innerWidth}x${window.innerHeight}`}},null,2)],{type:"application/json"}),i=URL.createObjectURL(e),o=document.createElement("a");o.href=i,o.download=`spatial-context-debug-${(new Date).toISOString().slice(0,10)}.json`,o.click(),URL.revokeObjectURL(i)}get _autoSaveActive(){return this._settings.auto_save&&!this._autoSaveHeld}updated(t){super.updated(t),(t.has("_layout")||t.has("_propertyLayout")||t.has("_dirty")||t.has("_propertyDirty"))&&this._scheduleAutoSave()}_scheduleAutoSave(){null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null),this._autoSaveActive&&(this._dirty||this._propertyDirty)&&(this._autoSaveTimer=window.setTimeout(()=>{this._runAutoSave()},Je.AUTO_SAVE_DELAY_MS))}async _runAutoSave(){if(this._autoSaveTimer=null,this._autoSaveActive)if(this._saving||this._propertySaving)this._scheduleAutoSave();else try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{}}async _flushAutoSave(){if(!this._autoSaveActive)return!this._dirty&&!this._propertyDirty;null!==this._autoSaveTimer&&(window.clearTimeout(this._autoSaveTimer),this._autoSaveTimer=null);try{this._dirty&&await this._save(),this._propertyDirty&&await this._saveProperty()}catch{return!1}return!this._dirty&&!this._propertyDirty}async _loadCachedZigbeeMesh(){try{const t=await this._client.getCachedZigbeeMesh();if(!t?.fetched_at||this._zigbeeMeshLoading)return;const e=1e3*t.fetched_at;if(this._zigbeeMeshFetchedAt&&e<=this._zigbeeMeshFetchedAt)return;this._zigbeeMesh=t,this._zigbeeMeshFetchedAt=e}catch{}}async _refreshZigbeeMesh(t=!1){this._zigbeeMeshLoading=!0,this._zigbeeMeshError=null;const e=Date.now();this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=window.setInterval(()=>{this._zigbeeMeshElapsedSeconds=Math.round((Date.now()-e)/1e3)},1e3);try{this._zigbeeMesh=await this._client.getZigbeeMesh(t),$t.log("mesh_load",{network:"zigbee",force_refresh:t,ms:Date.now()-e,links:this._zigbeeMesh.links.length,nodes:this._zigbeeMesh.nodes.length}),this._zigbeeMeshFetchedAt=this._zigbeeMesh.fetched_at?1e3*this._zigbeeMesh.fetched_at:Date.now()}catch(t){const e=this._meshErrorMessage(t,"Zigbee mesh request failed");this._zigbeeMeshError=e,$t.log("mesh_error",{network:"zigbee",error:e})}finally{this._zigbeeMeshLoading=!1,null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}}async _refreshWifiMesh(){this._wifiMeshLoading=!0,this._wifiMeshError=null;try{this._wifiMesh=await this._client.getWifiMesh(),$t.log("mesh_load",{network:"wifi",links:this._wifiMesh.links.length})}catch(t){const e=this._meshErrorMessage(t,"Wi-Fi mesh request failed");this._wifiMeshError=e,$t.log("mesh_error",{network:"wifi",error:e})}finally{this._wifiMeshLoading=!1}}async _subscribeMatter(){this._unsubscribeMatter(),this._matterError=null;try{this._matterUnsubscribe=await this._client.subscribeMatterTopology(t=>{this._matterTopology=t})}catch(t){this._matterError=this._meshErrorMessage(t,"Matter topology subscription failed")}}_unsubscribeMatter(){this._matterUnsubscribe?.(),this._matterUnsubscribe=null}_meshErrorMessage(t,e){const{code:i,message:o}=t??{};return"unknown_command"===i?"Restart Home Assistant to finish updating Spatial Context.":"unauthorized"===i?"This map needs a Home Assistant admin account.":o||e}async _subscribeBluetooth(){this._unsubscribeBluetooth(),this._bluetoothError=null,this._bluetoothBuffer=new Map,this._bluetoothAdverts=new Map;let t=!1;try{this._bluetoothDevices=(await this._client.getBluetoothDevices()).devices,t=!0,this._bluetoothUnsubscribe=await this._client.subscribeBluetoothAdvertisements(t=>{for(const e of t.add??[])this._bluetoothBuffer.set(e.address,{address:e.address,source:e.source,rssi:e.rssi,name:e.name});for(const{address:e}of t.remove??[])this._bluetoothBuffer.delete(e);this._bluetoothFlushTimer??(this._bluetoothFlushTimer=window.setTimeout(()=>{this._bluetoothFlushTimer=null,this._bluetoothAdverts=new Map(this._bluetoothBuffer)},2e3))}),window.setTimeout(()=>{this._bluetoothAdverts=new Map(this._bluetoothBuffer),$t.log("mesh_load",{network:"bluetooth",adverts:this._bluetoothBuffer.size,known_addresses:Object.keys(this._bluetoothDevices).length})},300)}catch(e){this._bluetoothError=t&&"unknown_command"===e?.code?"The Bluetooth map needs Home Assistant 2025.2 or newer.":this._meshErrorMessage(e,"Bluetooth subscription failed"),$t.log("mesh_error",{network:"bluetooth",error:this._bluetoothError})}}_unsubscribeBluetooth(){this._bluetoothUnsubscribe?.(),this._bluetoothUnsubscribe=null,null!==this._bluetoothFlushTimer&&(window.clearTimeout(this._bluetoothFlushTimer),this._bluetoothFlushTimer=null)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("beforeunload",this._onBeforeUnload),document.addEventListener("visibilitychange",this._onVisibilityChange)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("beforeunload",this._onBeforeUnload),document.removeEventListener("visibilitychange",this._onVisibilityChange),$t.flush(),this._flushAutoSave(),this._unsubscribeMatter(),this._unsubscribeBluetooth(),null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}_deepActiveElement(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t}_isTypingTarget(){const t=this._deepActiveElement();return!!t&&(!!(t instanceof HTMLElement&&t.isContentEditable)||("TEXTAREA"===t.tagName||t instanceof HTMLInputElement&&["text","number","search","email","url","tel","password"].includes(t.type)))}async _handleBackgroundFile(t){if(Je._ACCEPTED_BACKGROUND_TYPES.has(t.type))try{const e={background_image_id:await this._client.uploadBackgroundImage(t),background_opacity:.85};"property"===this._view?this._updatePropertyLayout(e):this._updateLayout(e)}catch(t){window.alert(`Background image upload failed: ${t.message}`)}else window.alert("Background image must be a PNG, JPEG, or GIF file.")}_patchRoom(t,e){this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===t?{...i,...e}:i)})}get _iconPickerPin(){const t=this._iconPickerFor;if(!t)return null;return("floor"===t.kind?this._layout.pins:this._propertyLayout.pins).find(e=>e.id===t.pinId)??null}_patchPin(t,e){this._updateLayout({pins:this._layout.pins.map(i=>i.id===t?{...i,...e}:i)})}_pinLabel(t){return t.label_override?t.label_override:wt(t.device_id,this._entityLookup.values())}_meshAgeLabel(t){const e=Math.round((Date.now()-t)/1e3);return e<60?`refreshed ${e}s ago`:`refreshed ${Math.round(e/60)}m ago`}render(){if(this._loading)return V`<div class="loading">Loading Spatial Context…</div>`;if(0===this._floors.length)return V`<div class="no-floors">
        No floors found. Add floors under Settings → Areas → Floors, then reopen
        this panel.
      </div>`;const t="zigbee"===this._networkType?this._zigbeeMeshError:"wifi"===this._networkType?this._wifiMeshError:"bluetooth"===this._networkType?this._bluetoothError:this._matterError;return V`
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
          ${"property"===this._view&&this._mapTilesAvailable&&void 0!==this._propertyLayout.map_background?V`<button
                    class="menu-item"
                    @click=${this._onToggleMapBackground}
                  >
                    <ha-icon icon="mdi:map"></ha-icon>
                    ${this._propertyLayout.map_background?Fe("mapBackground.remove"):Fe("mapBackground.add")}
                  </button>
                  ${this._propertyLayout.map_background?V`<label
                            class="popover-row hint"
                            style="padding: 8px 16px 4px"
                            >${Fe("mapBackground.style")}
                            <select @change=${this._onMapStyleChange}>
                              <option
                                value="street"
                                ?selected=${"aerial"!==this._propertyLayout.map_background.style}
                              >
                                ${Fe("mapBackground.street")}
                              </option>
                              <option
                                value="aerial"
                                ?selected=${"aerial"===this._propertyLayout.map_background.style}
                              >
                                ${Fe("mapBackground.aerial")}
                              </option>
                            </select>
                          </label>
                          <label
                            class="popover-row hint"
                            style="padding: 8px 16px 4px"
                            >${Fe("mapBackground.opacity")}
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
                                </label>`:"matter"===this._networkType&&this._matterUnsubscribe||"bluetooth"===this._networkType&&this._bluetoothUnsubscribe?V`<span
                                  class="hint"
                                  style="padding: 4px 16px 8px"
                                  >● Live</span
                                >`:"wifi"===this._networkType&&this._wifiMeshLoading?V`<span
                                    class="hint"
                                    style="padding: 4px 16px 8px"
                                    >Loading…</span
                                  >`:X}
                        ${t?V`<span
                                class="hint"
                                style="color: var(--sc-danger); padding: 0 16px 8px"
                                >${t}</span
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
                    .backgroundImageUrl=${Et(this._propertyLayout.background_image_id)}
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
                        .currentFloorId=${yt}
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
                    .rooms=${this._layout.rooms}
                    .pins=${this._layout.pins}
                    .walls=${this._layout.walls}
                    .openings=${this._layout.openings}
                    .scale=${this._layout.scale}
                    .unitSystem=${this._settings.unit_system}
                    .meshLinks=${this._meshLinksForCurrentFloor}
                    .meshStubs=${this._meshStubsForCurrentFloor}
                    .entityLookup=${this._entityLookup}
                    .backgroundImageUrl=${Et(this._layout.background_image_id)}
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
                      ></entity-picker-sidebar>`:X}
              `}
      </div>
      ${this._iconPickerPin?V`<icon-picker-dialog
              .value=${this._iconPickerPin.icon_override??null}
              .suggestFrom=${this._pinLabel(this._iconPickerPin)}
              @icon-picked=${this._onIconPicked}
              @icon-picker-cancel=${this._onIconPickerCancel}
            ></icon-picker-dialog>`:X}
    `}};ti.styles=[de,r`
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
    `],ti.AUTO_SAVE_DELAY_MS=3e3,ti._ACCEPTED_BACKGROUND_TYPES=new Set(["image/png","image/jpeg","image/gif"]),t([_t()],ti.prototype,"_floors",void 0),t([_t()],ti.prototype,"_currentFloorId",void 0),t([_t()],ti.prototype,"_layout",void 0),t([_t()],ti.prototype,"_entities",void 0),t([_t()],ti.prototype,"_areas",void 0),t([_t()],ti.prototype,"_mode",void 0),t([_t()],ti.prototype,"_snapMode",void 0),t([_t()],ti.prototype,"_dragOverCanvas",void 0),t([_t()],ti.prototype,"_armedEntityId",void 0),t([_t()],ti.prototype,"_armedOpeningType",void 0),t([_t()],ti.prototype,"_selectedRoomId",void 0),t([_t()],ti.prototype,"_editingRoomId",void 0),t([_t()],ti.prototype,"_selectedPinId",void 0),t([_t()],ti.prototype,"_pinStackIds",void 0),t([_t()],ti.prototype,"_selectedWallId",void 0),t([_t()],ti.prototype,"_editingWallId",void 0),t([_t()],ti.prototype,"_selectedOpeningId",void 0),t([_t()],ti.prototype,"_selectedMeshLink",void 0),t([_t()],ti.prototype,"_selectedMeshStub",void 0),t([_t()],ti.prototype,"_otherFloorPinsByDeviceId",void 0),t([_t()],ti.prototype,"_dirty",void 0),t([_t()],ti.prototype,"_saving",void 0),t([_t()],ti.prototype,"_loading",void 0),t([_t()],ti.prototype,"_pendingCount",void 0),t([_t()],ti.prototype,"_networkType",void 0),t([_t()],ti.prototype,"_zigbeeMesh",void 0),t([_t()],ti.prototype,"_zigbeeMeshLoading",void 0),t([_t()],ti.prototype,"_zigbeeMeshError",void 0),t([_t()],ti.prototype,"_zigbeeMeshFetchedAt",void 0),t([_t()],ti.prototype,"_zigbeeMeshElapsedSeconds",void 0),t([_t()],ti.prototype,"_zigbeeShowAllLinks",void 0),t([_t()],ti.prototype,"_wifiMesh",void 0),t([_t()],ti.prototype,"_wifiMeshLoading",void 0),t([_t()],ti.prototype,"_wifiMeshError",void 0),t([_t()],ti.prototype,"_matterTopology",void 0),t([_t()],ti.prototype,"_matterError",void 0),t([_t()],ti.prototype,"_bluetoothAdverts",void 0),t([_t()],ti.prototype,"_bluetoothDevices",void 0),t([_t()],ti.prototype,"_bluetoothError",void 0),t([_t()],ti.prototype,"_backgroundPopoverOpen",void 0),t([_t()],ti.prototype,"_meshPopoverOpen",void 0),t([_t()],ti.prototype,"_settings",void 0),t([_t()],ti.prototype,"_settingsPopoverOpen",void 0),t([_t()],ti.prototype,"_moreOptionsPopoverOpen",void 0),t([_t()],ti.prototype,"_view",void 0),t([_t()],ti.prototype,"_placementGhosts",void 0),t([_t()],ti.prototype,"_propertyLayout",void 0),t([_t()],ti.prototype,"_propertyDirty",void 0),t([_t()],ti.prototype,"_saveError",void 0),t([_t()],ti.prototype,"_iconPickerFor",void 0),t([_t()],ti.prototype,"_versionNotice",void 0),t([_t()],ti.prototype,"_propertySaving",void 0),t([_t()],ti.prototype,"_selectedPlacementId",void 0),t([_t()],ti.prototype,"_propertyMode",void 0),t([_t()],ti.prototype,"_selectedOutdoorPinId",void 0),t([_t()],ti.prototype,"_selectedPropertyMeshLinkKey",void 0),t([_t()],ti.prototype,"_armedBuildingKey",void 0),t([_t()],ti.prototype,"_sameBuildingAsPreviousFloor",void 0),t([_t()],ti.prototype,"_alignTargetFloorId",void 0),t([_t()],ti.prototype,"_alignTargetLayout",void 0),t([_t()],ti.prototype,"_alignOffsetX",void 0),t([_t()],ti.prototype,"_alignOffsetY",void 0),t([_t()],ti.prototype,"_alignScale",void 0),t([gt("floorplan-canvas")],ti.prototype,"_canvas",void 0),t([gt("property-canvas")],ti.prototype,"_propertyCanvas",void 0),t([gt("#file-input")],ti.prototype,"_fileInput",void 0),ti=Je=t([mt("spatial-context-panel")],ti)}();
