/*! spatial-context-panel v0.1.0-beta.1 | MIT */
!function(){"use strict";function t(t,e,i,n){var s,o=arguments.length,l=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(l=(o<3?s(l):o>3?s(e,i,l):s(e,i))||l);return o>3&&l&&Object.defineProperty(e,i,l),l}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),s=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const l=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new o(i,t,n)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:r,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",y=_.reactiveElementPolyfillSupport,f=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!r(t,e),$={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&d(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:s}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const o=n?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),s=e.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=n;const o=s.fromAttribute(e,t.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,e,i,n=!1,s){if(void 0!==t){const o=this.constructor;if(!1===n&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??b)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,y?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,I=w.trustedTypes,C=I?I.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+P,S=`<${E}>`,M=document,T=()=>M.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,H="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,V=/-->/g,F=/>/g,z=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),W=/'/g,B=/"/g,U=/^(?:script|style|textarea|title)$/i,D=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),N=D(1),j=D(2),X=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),Z=new WeakMap,q=M.createTreeWalker(M,129);function G(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,n=[];let s,o=2===e?"<svg>":3===e?"<math>":"",l=R;for(let e=0;e<i;e++){const i=t[e];let a,r,d=-1,c=0;for(;c<i.length&&(l.lastIndex=c,r=l.exec(i),null!==r);)c=l.lastIndex,l===R?"!--"===r[1]?l=V:void 0!==r[1]?l=F:void 0!==r[2]?(U.test(r[2])&&(s=RegExp("</"+r[2],"g")),l=z):void 0!==r[3]&&(l=z):l===z?">"===r[0]?(l=s??R,d=-1):void 0===r[1]?d=-2:(d=l.lastIndex-r[2].length,a=r[1],l=void 0===r[3]?z:'"'===r[3]?B:W):l===B||l===W?l=z:l===V||l===F?l=R:(l=z,s=void 0);const h=l===z&&t[e+1].startsWith("/>")?" ":"";o+=l===R?i+S:d>=0?(n.push(a),i.slice(0,d)+A+i.slice(d)+P+h):i+P+(-2===d?e:h)}return[G(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class J{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,o=0;const l=t.length-1,a=this.parts,[r,d]=K(t,e);if(this.el=J.createElement(r,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=q.nextNode())&&a.length<l;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(A)){const e=d[o++],i=n.getAttribute(t).split(P),l=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:l[2],strings:i,ctor:"."===l[1]?nt:"?"===l[1]?st:"@"===l[1]?ot:it}),n.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:s}),n.removeAttribute(t));if(U.test(n.tagName)){const t=n.textContent.split(P),e=t.length-1;if(e>0){n.textContent=I?I.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],T()),q.nextNode(),a.push({type:2,index:++s});n.append(t[e],T())}}}else if(8===n.nodeType)if(n.data===E)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(P,t+1));)a.push({type:7,index:s}),t+=P.length-1}s++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,n){if(e===X)return e;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(e=Q(t,s._$AS(t,e.values),s,n)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??M).importNode(e,!0);q.currentNode=n;let s=q.nextNode(),o=0,l=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new et(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new lt(s,this,t)),this._$AV.push(e),a=i[++l]}o!==a?.index&&(s=q.nextNode(),o++)}return q.currentNode=M,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),O(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==X&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new tt(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new J(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new et(this.O(T()),this.O(T()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,n){const s=this.strings;let o=!1;if(void 0===s)t=Q(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const n=t;let l,a;for(t=s[0],l=0;l<s.length-1;l++)a=Q(this,n[i+l],e,l),a===X&&(a=this._$AH[l]),o||=!O(a)||a!==this._$AH[l],a===Y?t=Y:t!==Y&&(t+=(a??"")+s[l+1]),this._$AH[l]=a}o&&!n&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class nt extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class st extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class ot extends it{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??Y)===X)return;const i=this._$AH,n=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==Y&&(i===Y||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class lt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(J,et),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class dt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let s=n._$litPart$;if(void 0===s){const t=i?.renderBefore??null;n._$litPart$=s=new et(e.insertBefore(T(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return X}}dt._$litElement$=!0,dt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:dt});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:dt}),(rt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},ut=(t=pt,e,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,s,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];e.call(this,i),this.requestUpdate(n,s,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};function _t(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return _t({...t,state:!0,attribute:!1})}function mt(t,e){return(e,i,n)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}function yt(t){switch(t){case"strong":return"#2e7d32";case"medium":return"#f9a825";case"weak":return"#c62828";default:return"#607d8b"}}function ft(t){return t>=150?"strong":t>=80?"medium":"weak"}function vt(t){return t>=-50?"strong":t>=-70?"medium":"weak"}const bt=[{id:"timber_frame",label:"Timber framed (drywall)",color:"#212121",attenuationDb:3},{id:"brick_veneer",label:"Brick veneer",color:"#3e2723",attenuationDb:6},{id:"concrete_block",label:"Concrete / block",color:"#000000",attenuationDb:12},{id:"glass",label:"Glass",color:"#37474f",attenuationDb:2},{id:"steel_frame",label:"Steel frame",color:"#263238",attenuationDb:10}];class $t{constructor(t){this.hass=t}async listFloors(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_floors"})).floors}async getLayout(t){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_layout",floor_id:t})}async saveLayout(t,e){return this.hass.connection.sendMessagePromise({type:"spatial_context/save_layout",floor_id:t,background_image_id:e.background_image_id,background_opacity:e.background_opacity,background_offset_x:e.background_offset_x,background_offset_y:e.background_offset_y,background_scale:e.background_scale,building_id:e.building_id,rooms:e.rooms,pins:e.pins,walls:e.walls,openings:e.openings,scale:e.scale})}async setBuildingId(t,e){return this.hass.connection.sendMessagePromise({type:"spatial_context/set_building_id",floor_id:t,building_id:e})}async listAreas(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_areas"})).areas}async listPlaceableEntities(){return(await this.hass.connection.sendMessagePromise({type:"spatial_context/list_placeable_entities"})).entities}async exportSnapshot(){return this.hass.connection.sendMessagePromise({type:"spatial_context/export_snapshot"})}async getZigbeeMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_zigbee_mesh"})}async getWifiMesh(){return this.hass.connection.sendMessagePromise({type:"spatial_context/get_wifi_mesh"})}async subscribeMatterTopology(t){return this.hass.connection.subscribeMessage(t,{type:"matter/subscribe_network_topology"})}async uploadBackgroundImage(t){const e=new FormData;e.append("file",t);const i=await this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:e});if(!i.ok)throw new Error(`Image upload failed: ${i.status} ${i.statusText}`);return(await i.json()).id}}function xt(t){return t?`/api/image/serve/${t}/original`:null}function wt(t){return`${t}-${crypto.randomUUID()}`}function kt(t,e="timber_frame"){return{id:wt("wall"),material:e,points:t}}function It(t,e,i,n){return Math.hypot(i-t,n-e)}function Ct(t,e,i){return Math.min(i,Math.max(e,t))}function At(t,e,i){let n=!1;for(let s=0,o=i.length-1;s<i.length;o=s++){const l=i[s],a=i[o],[r,d]=l,[c,h]=a;d>e!=h>e&&t<(c-r)*(e-d)/(h-d)+r&&(n=!n)}return n}function Pt(t,e,i){for(const n of i)if(n.points.length>=3&&At(t,e,n.points))return n.id;return null}function Et(t,e,i,n,s,o){const l=s-i,a=o-n,r=l*l+a*a;if(0===r)return It(t,e,i,n);let d=((t-i)*l+(e-n)*a)/r;return d=Ct(d,0,1),It(t,e,i+d*l,n+d*a)}function St(t,e,i){let n=1/0;for(let s=0;s<i.length-1;s++){const[o,l]=i[s],[a,r]=i[s+1];n=Math.min(n,Et(t,e,o,l,a,r))}return n}function Mt(t){const e=[];for(let i=0;i<t.length;i++){const n=t[i],s=t[(i+1)%t.length];e.push([(n[0]+s[0])/2,(n[1]+s[1])/2])}return e}function Tt(t){const e=[];for(let i=0;i<t.length-1;i++){const n=t[i],s=t[i+1];e.push([(n[0]+s[0])/2,(n[1]+s[1])/2])}return e}function Ot(t,e,i){let n={point:t[0],segmentIndex:0,dist:1/0};for(let s=0;s<t.length-1;s++){const[o,l]=t[s],[a,r]=t[s+1],d=a-o,c=r-l,h=d*d+c*c;let p=0===h?0:((e-o)*d+(i-l)*c)/h;p=Ct(p,0,1);const u=[o+p*d,l+p*c],_=It(e,i,u[0],u[1]);_<n.dist&&(n={point:u,segmentIndex:s,dist:_})}return{point:n.point,segmentIndex:n.segmentIndex}}function Lt(t,e,i){const[n,s]=t,[o,l]=e,a=Math.abs(o-n),r=Math.abs(l-s);return a>i&&r>i?e:a<=r?[n,l]:[o,s]}const Ht=l`
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
`;function Rt(t,e,i,n){return t.map(t=>({pin:t,d:It(t.x,t.y,e,i)})).filter(({d:t})=>t<=n).sort((t,e)=>t.d-e.d).map(({pin:t})=>t)}function Vt(t,e,i,n){let s=null,o=n;return t.forEach(([t,n],l)=>{const a=It(t,n,e,i);a<=o&&(s=l,o=a)}),s}function Ft(t,e,i,n){let s=null,o=n;for(const n of t){const t=St(e,i,n.points);t<=o&&(s=n,o=t)}return s}function zt(t,e,i,n){if(t.points.length>=3){const[s,o]=t.points[0];if(It(s,o,e,i)<=n)return{trace:t,closed:!0}}return{trace:{points:[...t.points,[e,i]]},closed:!1}}const Wt=new Map;var Bt="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z";const Ut={light:"M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z",switch:"M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z",sensor:Bt,binary_sensor:Bt,climate:"M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",lock:"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",cover:"M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z",camera:"M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z",media_player:"M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",fan:"M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",humidifier:"M11 9C8.79 9 7 10.79 7 13S8.79 17 11 17 15 15.21 15 13 13.21 9 11 9M11 15C9.9 15 9 14.11 9 13S9.9 11 11 11 13 11.9 13 13 12.11 15 11 15M7 4H14C16.21 4 18 5.79 18 8V9H16V8C16 6.9 15.11 6 14 6H7C5.9 6 5 6.9 5 8V20H16V18H18V22H3V8C3 5.79 4.79 4 7 4M19 10.5C19 10.5 21 12.67 21 14C21 15.1 20.1 16 19 16S17 15.1 17 14C17 12.67 19 10.5 19 10.5",vacuum:"M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z",alarm_control_panel:"M11,13H13V16H16V11H18L12,6L6,11H8V16H11V13M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z",person:"M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",device_tracker:"M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z",water_heater:"M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z",valve:"M4 22H2V2H4M22 2H20V22H22M17.24 5.34L13.24 9.34A3 3 0 0 0 9.24 13.34L5.24 17.34L6.66 18.76L10.66 14.76A3 3 0 0 0 14.66 10.76L18.66 6.76Z",siren:"M12,8H4A2,2 0 0,0 2,10V14A2,2 0 0,0 4,16H5V20A1,1 0 0,0 6,21H8A1,1 0 0,0 9,20V16H12L17,20V4L12,8M21.5,12C21.5,13.71 20.54,15.26 19,16V8C20.53,8.75 21.5,10.3 21.5,12Z",assist_satellite:"M9,3A4,4 0 0,1 13,7H5A4,4 0 0,1 9,3M11.84,9.82L11,18H10V19A2,2 0 0,0 12,21A2,2 0 0,0 14,19V14A4,4 0 0,1 18,10H20L19,11L20,12H18A2,2 0 0,0 16,14V19A4,4 0 0,1 12,23A4,4 0 0,1 8,19V18H7L6.16,9.82C5.67,9.32 5.31,8.7 5.13,8H12.87C12.69,8.7 12.33,9.32 11.84,9.82M9,11A1,1 0 0,0 8,12A1,1 0 0,0 9,13A1,1 0 0,0 10,12A1,1 0 0,0 9,11Z",input_boolean:"M17 6H7C3.69 6 1 8.69 1 12S3.69 18 7 18H17C20.31 18 23 15.31 23 12S20.31 6 17 6M17 16H7C4.79 16 3 14.21 3 12S4.79 8 7 8H17C19.21 8 21 9.79 21 12S19.21 16 17 16M17 9C15.34 9 14 10.34 14 12S15.34 15 17 15 20 13.66 20 12 18.66 9 17 9Z",automation:"M13.53 22H10C9.75 22 9.54 21.82 9.5 21.58L9.13 18.93C8.5 18.68 7.96 18.34 7.44 17.94L4.95 18.95C4.73 19.03 4.46 18.95 4.34 18.73L2.34 15.27C2.21 15.05 2.27 14.78 2.46 14.63L4.57 12.97C4.53 12.65 4.5 12.33 4.5 12S4.53 11.34 4.57 11L2.46 9.37C2.27 9.22 2.21 8.95 2.34 8.73L4.34 5.27C4.46 5.05 4.73 4.96 4.95 5.05L7.44 6.05C7.96 5.66 8.5 5.32 9.13 5.07L9.5 2.42C9.54 2.18 9.75 2 10 2H14C14.25 2 14.46 2.18 14.5 2.42L14.87 5.07C15.5 5.32 16.04 5.66 16.56 6.05L19.05 5.05C19.27 4.96 19.54 5.05 19.66 5.27L21.66 8.73C21.78 8.95 21.73 9.22 21.54 9.37L19.43 11C19.47 11.34 19.5 11.67 19.5 12V12.19C19 12.07 18.5 12 18 12C17.08 12 16.22 12.21 15.44 12.58C15.47 12.39 15.5 12.2 15.5 12C15.5 10.07 13.93 8.5 12 8.5S8.5 10.07 8.5 12 10.07 15.5 12 15.5C12.2 15.5 12.39 15.47 12.58 15.44C12.21 16.22 12 17.08 12 18C12 19.54 12.58 20.94 13.53 22M16 15V21L21 18L16 15Z",script:"M17.8,20C17.4,21.2 16.3,22 15,22H5C3.3,22 2,20.7 2,19V18H5L14.2,18C14.6,19.2 15.7,20 17,20H17.8M19,2C20.7,2 22,3.3 22,5V6H20V5C20,4.4 19.6,4 19,4C18.4,4 18,4.4 18,5V18H17C16.4,18 16,17.6 16,17V16H5V5C5,3.3 6.3,2 8,2H19M8,6V8H15V6H8M8,10V12H14V10H8Z"};const Dt={light:"#f9a825",switch:"#1e88e5",sensor:"#00897b",binary_sensor:"#00897b",climate:"#fb8c00",lock:"#6d4c41",cover:"#43a047",camera:"#8e24aa",media_player:"#3949ab",fan:"#00acc1",humidifier:"#26c6da",vacuum:"#5e35b1",alarm_control_panel:"#e53935",person:"#7cb342",device_tracker:"#7cb342",water_heater:"#d84315",valve:"#0097a7",siren:"#ad1457",assist_satellite:"#ab47bc",input_boolean:"#757575",automation:"#757575",script:"#757575"};const Nt=1e3,jt=750,Xt=14;let Yt=class extends dt{constructor(){super(...arguments),this.rooms=[],this.pins=[],this.walls=[],this.openings=[],this.scale=null,this.meshLinks=[],this.entityLookup=new Map,this.backgroundImageUrl=null,this.backgroundOpacity=.5,this.backgroundOffsetX=0,this.backgroundOffsetY=0,this.backgroundScale=1,this.alignOverlay=null,this.mode="select",this.armedEntityId=null,this.armedOpeningType=null,this.selectedRoomId=null,this.editingRoomId=null,this.editingWallId=null,this.selectedPinId=null,this.selectedWallId=null,this.selectedOpeningId=null,this._viewBox={x:0,y:0,w:Nt,h:jt},this._naturalHeight=jt,this._alignNaturalHeight=jt,this._pendingTrace=null,this._pendingScalePoints=[],this._liveEditPoints=null,this._liveDragPin=null,this._liveOpeningEdit=null,this._selectedVertexIndex=null,this._pointers=new Map,this._downHit=null,this._downClient=null,this._lastImage=null,this._lastClient=null,this._gesture=null,this._moved=!1,this._hasFittedOnce=!1,this._onPointerDown=t=>{if("mouse"===t.pointerType&&0!==t.button)return;if(this._svg.setPointerCapture(t.pointerId),this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,n={x:(e.x+i.x)/2,y:(e.y+i.y)/2};return void(this._gesture={kind:"pinch",startDistance:It(e.x,e.y,i.x,i.y),startViewBox:{...this._viewBox},midImage:this._clientToImage(n.x,n.y)})}if(this._pointers.size>2)return;const e=this._clientToImage(t.clientX,t.clientY);this._downClient={x:t.clientX,y:t.clientY},this._lastImage=e,this._lastClient={x:t.clientX,y:t.clientY},this._moved=!1,this._gesture=null,this._downHit="select"===this.mode?this._hitTest(t.clientX,t.clientY,e):{type:"empty"}},this._onPointerMove=t=>{if(!this._pointers.has(t.pointerId))return;if(this._pointers.set(t.pointerId,{x:t.clientX,y:t.clientY}),"pinch"===this._gesture?.kind&&2===this._pointers.size){const t=[...this._pointers.values()],[e,i]=t,n=It(e.x,e.y,i.x,i.y)||1,s=this._gesture.startDistance/n,o=this._gesture.startViewBox,l=Ct(o.w*s,250,4e3),a=l/o.w,r=o.h*a,{x:d,y:c}=this._gesture.midImage;return void(this._viewBox={x:d-(d-o.x)*a,y:c-(c-o.y)*a,w:l,h:r})}if(1!==this._pointers.size||!this._downClient||!this._lastImage)return;if(!this._moved){if(It(this._downClient.x,this._downClient.y,t.clientX,t.clientY)<5)return;this._moved=!0,this._gesture=this._lockGesture(),"pan"!==this._gesture?.kind&&"alignDrag"!==this._gesture?.kind||(this._svg.style.cursor="grabbing")}const e=this._clientToImage(t.clientX,t.clientY);if("pan"===this._gesture?.kind){const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};this._viewBox={...this._viewBox,x:this._viewBox.x-(t.clientX-i.x)/e,y:this._viewBox.y-(t.clientY-i.y)/e}}else if("alignDrag"===this._gesture?.kind){const e=this._svgTransform().scale||1,i=this._lastClient??{x:t.clientX,y:t.clientY};this.dispatchEvent(new CustomEvent("align-drag",{detail:{dx:(t.clientX-i.x)/e,dy:(t.clientY-i.y)/e}}))}else if("vertex"===this._gesture?.kind&&this._liveEditPoints){const i="room"===this._editingTarget?.kind,[n,s]=this._snappedVertexPoint(this._liveEditPoints,this._gesture.index,e.x,e.y,i,t.shiftKey),o=[...this._liveEditPoints];o[this._gesture.index]=[n,s],this._liveEditPoints=o}else if("pin"===this._gesture?.kind)this._liveDragPin={id:this._gesture.pinId,x:e.x,y:e.y};else if("openingMove"===this._gesture?.kind){const t=this._gesture,i=this.openings.find(e=>e.id===t.openingId),n=i&&this.walls.find(t=>t.id===i.wallId);if(i&&n){const t=this._effectivePoints("wall",n.id,n.points),{point:s}=Ot(t,e.x,e.y);this._liveOpeningEdit={id:i.id,x:s[0],y:s[1],width:i.width}}}else if("openingHandle"===this._gesture?.kind){const t=this._gesture,i=this.openings.find(e=>e.id===t.openingId),n=i&&this.walls.find(t=>t.id===i.wallId),s=i&&this._openingEndpoints(i);if(i&&n&&s){const o=this._effectivePoints("wall",n.id,n.points),{point:l}=Ot(o,e.x,e.y),a=s[0===t.whichEnd?1:0],r=[(a[0]+l[0])/2,(a[1]+l[1])/2],d=It(a[0],a[1],l[0],l[1]);this._liveOpeningEdit={id:i.id,x:r[0],y:r[1],width:d}}}this._lastImage=this._clientToImage(t.clientX,t.clientY),this._lastClient={x:t.clientX,y:t.clientY}},this._onPointerUp=t=>{this._pointers.delete(t.pointerId),this._svg.style.cursor="";try{this._svg.releasePointerCapture(t.pointerId)}catch{}this._pointers.size>=1?this._gesture=null:(this._moved?this._commitGesture():this._downClient&&this._handleClick(this._downClient.x,this._downClient.y,t.shiftKey),this._gesture=null,this._downHit=null,this._downClient=null,this._moved=!1)},this._onWheel=t=>{if(t.preventDefault(),t.ctrlKey){const e=t.deltaY<0?.9:1.1;return void this._zoomBy(e,this._clientToImage(t.clientX,t.clientY))}const e=this._viewBox.w/this.getBoundingClientRect().width;this._viewBox={...this._viewBox,x:this._viewBox.x+t.deltaX*e,y:this._viewBox.y+t.deltaY*e}},this._resolvedIconOverrides=new Map}get _editingTarget(){return this.editingRoomId?{kind:"room",id:this.editingRoomId}:this.editingWallId?{kind:"wall",id:this.editingWallId}:null}_rawPointsFor(t){return"room"===t.kind?this.rooms.find(e=>e.id===t.id)?.points??null:this.walls.find(e=>e.id===t.id)?.points??null}willUpdate(t){if(t.has("editingRoomId")||t.has("editingWallId")){const t=this._editingTarget,e=t?this._rawPointsFor(t):null;this._liveEditPoints=e?[...e]:null,this._selectedVertexIndex=null}t.has("mode")&&(this._pendingTrace=null,this._pendingScalePoints=[])}firstUpdated(){this.fitToScreen(),this._hasFittedOnce=null!==this._contentBounds()||!this.backgroundImageUrl,this._resizeObserver=new ResizeObserver(()=>this.requestUpdate()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}updated(t){if(t.has("backgroundImageUrl")&&this.backgroundImageUrl){const t=new Image;t.onload=()=>{this._naturalHeight=t.naturalHeight/t.naturalWidth*Nt||jt,this._hasFittedOnce||(this.fitToScreen(),this._hasFittedOnce=!0)},t.src=this.backgroundImageUrl}if(t.has("alignOverlay")){const e=t.get("alignOverlay");if(this.alignOverlay&&this.alignOverlay.imageUrl!==e?.imageUrl){const t=new Image;t.onload=()=>{this._alignNaturalHeight=t.naturalHeight/t.naturalWidth*Nt||jt},t.src=this.alignOverlay.imageUrl}}if(t.has("_pendingTrace")||t.has("_pendingScalePoints")){const t="scale"===this.mode?this._pendingScalePoints.length:this._pendingTrace?.points.length??0;this.dispatchEvent(new CustomEvent("pending-changed",{detail:{count:t}}))}}_contentBounds(){const t=[];for(const e of this.rooms)t.push(...e.points);for(const e of this.walls)t.push(...e.points);for(const e of this.pins)t.push([e.x,e.y]);if(0===t.length)return null;const e=t.map(([t])=>t),i=t.map(([,t])=>t),n=Math.min(...e),s=Math.max(...e),o=Math.min(...i),l=Math.max(...i),a=.08*Math.max(s-n,l-o)||40;return{x:n-a,y:o-a,w:s-n+2*a,h:l-o+2*a}}fitToScreen(){this._viewBox=this._contentBounds()??{x:0,y:0,w:Nt,h:this._naturalHeight}}_svgTransform(){const t=this._svg?.getBoundingClientRect(),e=t?.width||this._viewBox.w,i=t?.height||this._viewBox.h,n=Math.min(e/this._viewBox.w,i/this._viewBox.h)||1;return{scale:n,offsetX:(e-this._viewBox.w*n)/2,offsetY:(i-this._viewBox.h*n)/2}}_pxToUnits(t){return t/this._svgTransform().scale}_clientToImage(t,e){const i=this._svg,n=i.createSVGPoint();n.x=t,n.y=e;const s=i.getScreenCTM();if(!s)return{x:0,y:0};const o=n.matrixTransform(s.inverse());return{x:o.x,y:o.y}}_effectivePoints(t,e,i){const n=this._editingTarget;return n&&n.kind===t&&n.id===e&&this._liveEditPoints?this._liveEditPoints:i}_snappedTracePoint(t,e,i,n){if(n||0===t.length)return[e,i];return Lt(t[t.length-1],[e,i],this._pxToUnits(10))}_snappedVertexPoint(t,e,i,n,s,o){if(o)return[i,n];const l=this._pxToUnits(10),a=e>0?e-1:s?t.length-1:-1;if(a>=0&&a!==e)return Lt(t[a],[i,n],l);const r=e<t.length-1?e+1:s?0:-1;return r>=0&&r!==e?Lt(t[r],[i,n],l):[i,n]}_effectiveOpening(t){return this._liveOpeningEdit?.id===t.id?{...t,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}:t}_openingEndpoints(t){const e=this.walls.find(e=>e.id===t.wallId);if(!e)return null;const i=this._effectivePoints("wall",e.id,e.points);if(i.length<2)return null;const n=this._effectiveOpening(t),{segmentIndex:s}=Ot(i,n.x,n.y),[o,l]=function(t,e){const[i,n]=t[e],[s,o]=t[e+1]??t[e],l=It(i,n,s,o)||1;return[(s-i)/l,(o-n)/l]}(i,s),a=n.width/2;return[[n.x-o*a,n.y-l*a],[n.x+o*a,n.y+l*a]]}_snappedWallPoint(t,e,i,n){if(!n){const t=this._pxToUnits(Xt),n=Ft(this.walls,e,i,t);if(n)return Ot(n.points,e,i).point}return this._snappedTracePoint(t,e,i,n)}_hitTest(t,e,i){const n=this._pxToUnits(Xt);if("select"!==this.mode)return{type:"empty"};const s=this._editingTarget;if(s&&this._liveEditPoints){const t=this._liveEditPoints,e=Vt(t,i.x,i.y,n);if(null!==e)return{type:"vertex",index:e};const o=Vt("room"===s.kind?Mt(t):Tt(t),i.x,i.y,n);return null!==o?{type:"edgeMidpoint",index:o}:{type:"empty"}}const o=Rt(this.pins,i.x,i.y,n);if(o.length>1)return{type:"pinStack",pins:o};if(1===o.length)return{type:"pin",pin:o[0]};if(this.selectedOpeningId){const t=this.openings.find(t=>t.id===this.selectedOpeningId),e=t?this._openingEndpoints(t):null;if(t&&e){const s=Vt(e,i.x,i.y,n);if(null!==s)return{type:"openingHandle",opening:t,whichEnd:s}}}const l=function(t,e,i,n){let s=null,o=n;for(const n of t){const t=It(n.x,n.y,e,i);t<=o&&(s=n,o=t)}return s}(this.openings,i.x,i.y,n);if(l)return{type:"opening",opening:l};const a=Ft(this.walls,i.x,i.y,n);if(a)return{type:"wall",wall:a};const r=this.rooms.find(t=>t.points.length>=3&&At(i.x,i.y,t.points));return r?{type:"room",room:r}:{type:"empty"}}_lockGesture(){return"align"===this.mode?{kind:"alignDrag"}:"vertex"===this._downHit?.type?{kind:"vertex",index:this._downHit.index}:"pin"===this._downHit?.type?{kind:"pin",pinId:this._downHit.pin.id}:"openingHandle"===this._downHit?.type?{kind:"openingHandle",openingId:this._downHit.opening.id,whichEnd:this._downHit.whichEnd}:"opening"===this._downHit?.type?{kind:"openingMove",openingId:this._downHit.opening.id}:{kind:"pan"}}_dispatchVertexChanged(t){const e=this._editingTarget;if(!e)return;const i="room"===e.kind?"room-vertex-changed":"wall-vertex-changed",n="room"===e.kind?"roomId":"wallId";this.dispatchEvent(new CustomEvent(i,{detail:{[n]:e.id,points:t}}))}_commitGesture(){"vertex"===this._gesture?.kind&&this._editingTarget&&this._liveEditPoints?this._dispatchVertexChanged(this._liveEditPoints):"pin"===this._gesture?.kind&&this._liveDragPin?(this.dispatchEvent(new CustomEvent("pin-move",{detail:{pinId:this._liveDragPin.id,x:this._liveDragPin.x,y:this._liveDragPin.y}})),this._liveDragPin=null):"openingMove"!==this._gesture?.kind&&"openingHandle"!==this._gesture?.kind||!this._liveOpeningEdit||(this.dispatchEvent(new CustomEvent("opening-update",{detail:{openingId:this._liveOpeningEdit.id,x:this._liveOpeningEdit.x,y:this._liveOpeningEdit.y,width:this._liveOpeningEdit.width}})),this._liveOpeningEdit=null)}_handleClick(t,e,i=!1){const n=this._clientToImage(t,e);if("trace"===this.mode){const t=this._pxToUnits(Xt),e=this._pendingTrace??{points:[]},[s,o]=this._snappedTracePoint(e.points,n.x,n.y,i),l=zt(e,s,o,t);return void(l.closed?(this.dispatchEvent(new CustomEvent("room-trace-complete",{detail:{points:e.points}})),this._pendingTrace=null):this._pendingTrace=l.trace)}if("wall"===this.mode){const t=this._pxToUnits(Xt),e=this._pendingTrace??{points:[]},[s,o]=this._snappedWallPoint(e.points,n.x,n.y,i),l=zt(e,s,o,t);return void(l.closed?(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:[...e.points,e.points[0]]}})),this._pendingTrace=null):this._pendingTrace=l.trace)}if("opening"===this.mode){if(!this.armedOpeningType)return;const t=this._pxToUnits(Xt),e=Ft(this.walls,n.x,n.y,t);if(!e)return;const{point:i}=Ot(e.points,n.x,n.y);return void this.dispatchEvent(new CustomEvent("opening-place",{detail:{wallId:e.id,x:i[0],y:i[1]}}))}if("scale"===this.mode){const t=[...this._pendingScalePoints,[n.x,n.y]];return void(t.length>=2?(this.dispatchEvent(new CustomEvent("scale-line-complete",{detail:{points:t.slice(0,2)}})),this._pendingScalePoints=[]):this._pendingScalePoints=t)}if("place"===this.mode){if(this.armedEntityId){const t=this._pxToUnits(Xt),e=Rt(this.pins,n.x,n.y,t)[0],i=e?.x??n.x,s=e?.y??n.y;this.dispatchEvent(new CustomEvent("pin-place",{detail:{x:i,y:s}}))}return}const s=this._downHit??{type:"empty"};if("vertex"===s.type)this._selectedVertexIndex=this._selectedVertexIndex===s.index?null:s.index;else if("edgeMidpoint"===s.type&&this._editingTarget&&this._liveEditPoints){const t=("room"===this._editingTarget.kind?Mt(this._liveEditPoints):Tt(this._liveEditPoints))[s.index],e=[...this._liveEditPoints];e.splice(s.index+1,0,t),this._liveEditPoints=e,this._dispatchVertexChanged(e)}else if("pin"===s.type)this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:this.selectedPinId===s.pin.id?null:s.pin.id}}));else if("pinStack"===s.type)this.dispatchEvent(new CustomEvent("pin-stack-select",{detail:{pinIds:s.pins.map(t=>t.id)}}));else if("room"===s.type)this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:this.selectedRoomId===s.room.id?null:s.room.id}}));else if("wall"===s.type)this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:this.selectedWallId===s.wall.id?null:s.wall.id}}));else if("opening"===s.type)this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:this.selectedOpeningId===s.opening.id?null:s.opening.id}}));else if(this._editingTarget&&null!==this._selectedVertexIndex&&this._liveEditPoints){const t="room"===this._editingTarget.kind,[e,s]=this._snappedVertexPoint(this._liveEditPoints,this._selectedVertexIndex,n.x,n.y,t,i),o=[...this._liveEditPoints];o[this._selectedVertexIndex]=[e,s],this._liveEditPoints=o,this._selectedVertexIndex=null,this._dispatchVertexChanged(o)}else this._selectedVertexIndex=null,this.dispatchEvent(new CustomEvent("room-select",{detail:{roomId:null}})),this.dispatchEvent(new CustomEvent("pin-select",{detail:{pinId:null}})),this.dispatchEvent(new CustomEvent("wall-select",{detail:{wallId:null}})),this.dispatchEvent(new CustomEvent("opening-select",{detail:{openingId:null}}))}finishPendingWall(){"wall"!==this.mode||!this._pendingTrace||this._pendingTrace.points.length<2||(this.dispatchEvent(new CustomEvent("wall-trace-complete",{detail:{points:this._pendingTrace.points}})),this._pendingTrace=null)}cancelPending(){this._pendingTrace=null,this._pendingScalePoints=[]}_deleteSelectedVertex(){const t=this._editingTarget;if(null===this._selectedVertexIndex||!t||!this._liveEditPoints)return;const e="room"===t.kind?3:2;if(this._liveEditPoints.length<=e)return;const i=this._liveEditPoints.filter((t,e)=>e!==this._selectedVertexIndex);this._liveEditPoints=i,this._selectedVertexIndex=null,this._dispatchVertexChanged(i)}_zoomBy(t,e){const i=Ct(this._viewBox.w*t,250,4e3),n=i/this._viewBox.w,s=this._viewBox.h*n;this._viewBox={x:e.x-(e.x-this._viewBox.x)*n,y:e.y-(e.y-this._viewBox.y)*n,w:i,h:s}}_zoomButton(t){const e=this._viewBox;this._zoomBy(t,{x:e.x+e.w/2,y:e.y+e.h/2})}_pinLabel(t){return t.label_override?t.label_override:this.entityLookup.get(t.entity_id)?.name??t.entity_id}_renderRoom(t){const e=this._effectivePoints("room",t.id,t.points);if(e.length<2)return Y;const i=e.map(([t,e])=>`${t},${e}`).join(" "),[n,s]=function(t){if(0===t.length)return[0,0];let e=0,i=0;for(const[n,s]of t)e+=n,i+=s;return[e/t.length,i/t.length]}(e),o=this.editingRoomId===t.id;return j`
      <polygon
        class="room-poly ${t.id===this.selectedRoomId||o?"selected":""}"
        points=${i}
      ></polygon>
      <text class="room-label" x=${n} y=${s}>${t.name}</text>
      ${o?this._renderVertexHandles(e,!0):Y}
    `}_renderVertexHandles(t,e){const i=this._pxToUnits(6),n=this._pxToUnits(4),s=e?Mt(t):Tt(t);return j`
      ${s.map(([t,e])=>j`<circle class="midpoint-handle" cx=${t} cy=${e} r=${n}></circle>`)}
      ${t.map(([t,e],n)=>{const s=n===this._selectedVertexIndex;return j`
          <circle
            class="vertex-handle ${s?"selected":""}"
            cx=${t}
            cy=${e}
            r=${i}
          ></circle>
          ${s?j`
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
              `:Y}
        `})}
    `}_renderMeshLink(t){return j`
      <line
        class="mesh-link"
        x1=${t.fromPin.x}
        y1=${t.fromPin.y}
        x2=${t.toPin.x}
        y2=${t.toPin.y}
        style="stroke:${yt(t.quality)}"
      >
        <title>${t.detail??t.quality}</title>
      </line>
    `}_iconForOverride(t){return this._resolvedIconOverrides.has(t)?this._resolvedIconOverrides.get(t)??null:(this._resolvedIconOverrides.set(t,null),async function(t){const e=t.replace(/^mdi:/,"").trim();if(!e)return null;if(Wt.has(e))return Wt.get(e);try{const t=await fetch(`https://api.iconify.design/mdi/${e}.svg`);if(!t.ok)return Wt.set(e,null),null;const i=(await t.text()).match(/\sd="([^"]+)"/),n=i?i[1]:null;return Wt.set(e,n),n}catch{return Wt.set(e,null),null}}(t).then(e=>{null!==e&&(this._resolvedIconOverrides.set(t,e),this.requestUpdate())}),null)}_pinGroups(){const t=new Map;for(const e of this.pins){const i=`${e.x},${e.y}`;t.has(i)||t.set(i,[]),t.get(i).push(e)}return[...t.values()].map(t=>({x:t[0].x,y:t[0].y,pins:t}))}_renderPinGroup(t){const e=this._pxToUnits(12);if(1===t.pins.length){const i=t.pins[0],n=this._liveDragPin?.id===i.id?this._liveDragPin:null,s=n?.x??i.x,o=n?.y??i.y,l=i.id===this.selectedPinId,a=this.entityLookup.get(i.entity_id),r=a?.domain??i.entity_id.split(".")[0]??"",d=(i.icon_override?this._iconForOverride(i.icon_override):null)??function(t){return Ut[t]??"M11,18H13V16H11V18M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3Z"}(r);return this._renderPinMarker(s,o,e,d,function(t){return Dt[t]??"var(--sc-accent)"}(r),l,this._pinLabel(i))}const i=t.pins.some(t=>t.id===this.selectedPinId),n=`${t.pins.length} devices: ${t.pins.map(t=>this._pinLabel(t)).join(", ")}`;return this._renderPinMarker(t.x,t.y,e,"M12 16C13.1 16 14 16.9 14 18S13.1 20 12 20 10 19.1 10 18 10.9 16 12 16M12 10C13.1 10 14 10.9 14 12S13.1 14 12 14 10 13.1 10 12 10.9 10 12 10M12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4M6 16C7.1 16 8 16.9 8 18S7.1 20 6 20 4 19.1 4 18 4.9 16 6 16M6 10C7.1 10 8 10.9 8 12S7.1 14 6 14 4 13.1 4 12 4.9 10 6 10M6 4C7.1 4 8 4.9 8 6S7.1 8 6 8 4 7.1 4 6 4.9 4 6 4M18 16C19.1 16 20 16.9 20 18S19.1 20 18 20 16 19.1 16 18 16.9 16 18 16M18 10C19.1 10 20 10.9 20 12S19.1 14 18 14 16 13.1 16 12 16.9 10 18 10M18 4C19.1 4 20 4.9 20 6S19.1 8 18 8 16 7.1 16 6 16.9 4 18 4Z","var(--sc-accent)",i,n)}_renderPinMarker(t,e,i,n,s,o,l){const a=1.1*i;return j`
      <g>
        <title>${l}</title>
        <circle
          class="pin-dot ${o?"selected":""}"
          cx=${t}
          cy=${e}
          r=${i}
          style="fill:${o?"":s}"
        ></circle>
        <svg
          x=${t-a/2}
          y=${e-a/2}
          width=${a}
          height=${a}
          viewBox="0 0 24 24"
          class="pin-icon"
        >
          <path d=${n}></path>
        </svg>
        <circle class="pin-hit" cx=${t} cy=${e} r=${1.4*i}></circle>
      </g>
    `}_renderPendingTrace(){if(!this._pendingTrace||0===this._pendingTrace.points.length)return Y;const t=this._pendingTrace.points.map(([t,e])=>`${t},${e}`).join(" "),e=this._pxToUnits(6);return j`
      <polyline class="pending-trace" points=${t}></polyline>
      ${this._pendingTrace.points.map(([t,i])=>j`<circle class="vertex-handle" cx=${t} cy=${i} r=${e}></circle>`)}
    `}_renderWall(t){const e=this._effectivePoints("wall",t.id,t.points),i=e.map(([t,e])=>`${t},${e}`).join(" "),n=t.id===this.selectedWallId,s=this.editingWallId===t.id,o=(l=t.material,bt.find(t=>t.id===l)??bt[0]);var l;const a=Ct(4+o.attenuationDb/3,4,8);return j`
      <polyline
        class="wall-line ${n||s?"selected":""}"
        points=${i}
        style="stroke:${o.color}; stroke-width:${a}px"
      >
        <title>${o.label}</title>
      </polyline>
      ${s?this._renderVertexHandles(e,!1):Y}
    `}_renderOpening(t){const e=this._openingEndpoints(t);if(!e)return Y;const[[i,n],[s,o]]=e,l=t.id===this.selectedOpeningId,a=this._pxToUnits(6);return j`
      <line
        class="opening-line ${t.type} ${l?"selected":""}"
        x1=${i}
        y1=${n}
        x2=${s}
        y2=${o}
      >
        <title>${t.type}</title>
      </line>
      ${l?j`
            <circle class="opening-handle" cx=${i} cy=${n} r=${a}></circle>
            <circle class="opening-handle" cx=${s} cy=${o} r=${a}></circle>
          `:Y}
    `}_renderScaleLine(){if(!this.scale)return Y;const[[t,e],[i,n]]=this.scale.points;return j`
      <line class="scale-line" x1=${t} y1=${e} x2=${i} y2=${n}></line>
      <text class="scale-label" x=${(t+i)/2} y=${(e+n)/2-6}>
        ${this.scale.meters} m
      </text>
    `}_renderPendingScale(){if(0===this._pendingScalePoints.length)return Y;const t=this._pxToUnits(6),[e,i]=this._pendingScalePoints[0];return j`<circle class="vertex-handle" cx=${e} cy=${i} r=${t}></circle>`}_renderBackgroundOverlay(){if(!this.backgroundImageUrl)return Y;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),n=e+t*(this.backgroundOffsetX-this._viewBox.x),s=i+t*(this.backgroundOffsetY-this._viewBox.y),o=t*this.backgroundScale;return N`
      <div
        class="bg-overlay"
        style="transform: translate(${n}px, ${s}px) scale(${o});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${Nt}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `}_renderAlignOverlay(){if(!this.alignOverlay)return Y;const{scale:t,offsetX:e,offsetY:i}=this._svgTransform(),n=e+t*(this.alignOverlay.offsetX-this._viewBox.x),s=i+t*(this.alignOverlay.offsetY-this._viewBox.y),o=t*this.alignOverlay.scale;return N`
      <div
        class="bg-overlay"
        style="transform: translate(${n}px, ${s}px) scale(${o});"
      >
        <img
          src=${this.alignOverlay.imageUrl}
          style="width:${Nt}px; height:${this._alignNaturalHeight}px; opacity:${this.alignOverlay.opacity};"
        />
      </div>
    `}render(){const t=this._viewBox;return N`
      ${this._renderBackgroundOverlay()} ${this._renderAlignOverlay()}
      ${j`
        <svg
          viewBox="${t.x} ${t.y} ${t.w} ${t.h}"
          class="${"pan"===this.mode||"align"===this.mode?"pan-mode":"select"!==this.mode?"draw-mode":""}"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
        >
          ${this.rooms.map(t=>this._renderRoom(t))}
          ${this.walls.map(t=>this._renderWall(t))}
          ${this.openings.map(t=>this._renderOpening(t))}
          ${this.meshLinks.map(t=>this._renderMeshLink(t))}
          ${"trace"===this.mode||"wall"===this.mode?this._renderPendingTrace():Y}
          ${this._renderScaleLine()}
          ${"scale"===this.mode?this._renderPendingScale():Y}
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
    `}};Yt.styles=[Ht,l`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: white;
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
        pointer-events: none;
      }
      .room-poly {
        fill: var(--sc-accent);
        fill-opacity: 0.18;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: pointer;
      }
      .room-poly.selected {
        fill-opacity: 0.32;
        stroke-width: 3;
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
        stroke-width: 6;
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
      .pin-hit {
        fill: transparent;
        cursor: pointer;
      }
      .pin-dot {
        /* Per-domain color is set inline per-instance (see pin-icons.ts's
         * pinColor) — this is only the fallback for the brief moment before
         * that style attribute is present. */
        fill: var(--sc-accent);
        stroke: white;
        stroke-width: 2;
        pointer-events: none;
      }
      .pin-dot.selected {
        /* Selection always wins over a domain's own color — the inline
         * style is left empty for a selected pin (see _renderPinMarker)
         * precisely so this class rule isn't fighting a same-specificity
         * inline fill. */
        fill: var(--sc-danger);
      }
      .pin-icon {
        pointer-events: none;
      }
      .pin-icon path {
        fill: white;
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
    `],t([_t({attribute:!1})],Yt.prototype,"rooms",void 0),t([_t({attribute:!1})],Yt.prototype,"pins",void 0),t([_t({attribute:!1})],Yt.prototype,"walls",void 0),t([_t({attribute:!1})],Yt.prototype,"openings",void 0),t([_t({attribute:!1})],Yt.prototype,"scale",void 0),t([_t({attribute:!1})],Yt.prototype,"meshLinks",void 0),t([_t({attribute:!1})],Yt.prototype,"entityLookup",void 0),t([_t({attribute:!1})],Yt.prototype,"backgroundImageUrl",void 0),t([_t({type:Number})],Yt.prototype,"backgroundOpacity",void 0),t([_t({type:Number})],Yt.prototype,"backgroundOffsetX",void 0),t([_t({type:Number})],Yt.prototype,"backgroundOffsetY",void 0),t([_t({type:Number})],Yt.prototype,"backgroundScale",void 0),t([_t({attribute:!1})],Yt.prototype,"alignOverlay",void 0),t([_t({attribute:!1})],Yt.prototype,"mode",void 0),t([_t({attribute:!1})],Yt.prototype,"armedEntityId",void 0),t([_t({attribute:!1})],Yt.prototype,"armedOpeningType",void 0),t([_t({attribute:!1})],Yt.prototype,"selectedRoomId",void 0),t([_t({attribute:!1})],Yt.prototype,"editingRoomId",void 0),t([_t({attribute:!1})],Yt.prototype,"editingWallId",void 0),t([_t({attribute:!1})],Yt.prototype,"selectedPinId",void 0),t([_t({attribute:!1})],Yt.prototype,"selectedWallId",void 0),t([_t({attribute:!1})],Yt.prototype,"selectedOpeningId",void 0),t([gt()],Yt.prototype,"_viewBox",void 0),t([gt()],Yt.prototype,"_naturalHeight",void 0),t([gt()],Yt.prototype,"_alignNaturalHeight",void 0),t([gt()],Yt.prototype,"_pendingTrace",void 0),t([gt()],Yt.prototype,"_pendingScalePoints",void 0),t([gt()],Yt.prototype,"_liveEditPoints",void 0),t([gt()],Yt.prototype,"_liveDragPin",void 0),t([gt()],Yt.prototype,"_liveOpeningEdit",void 0),t([gt()],Yt.prototype,"_selectedVertexIndex",void 0),t([mt("svg")],Yt.prototype,"_svg",void 0),Yt=t([ht("floorplan-canvas")],Yt);let Zt=class extends dt{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null}render(){return N`
      ${this.floors.map(t=>N`
          <button
            class=${t.floor_id===this.selectedFloorId?"active":""}
            @click=${()=>this.dispatchEvent(new CustomEvent("floor-selected",{detail:{floorId:t.floor_id},bubbles:!0,composed:!0}))}
          >
            <span class=${t.has_layout?"":"unset"}>${t.name}</span>
          </button>
        `)}
    `}};Zt.styles=[Ht,l`
      :host {
        display: flex;
        height: 100%;
      }
      button {
        height: 100%;
        border-radius: 0;
        padding: 0 32px;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: normal;
        text-transform: none;
        color: var(--sc-fg);
        border-bottom: 2px solid transparent;
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
    `],t([_t({attribute:!1})],Zt.prototype,"floors",void 0),t([_t({attribute:!1})],Zt.prototype,"selectedFloorId",void 0),Zt=t([ht("floor-tabs")],Zt);let qt=class extends dt{constructor(){super(...arguments),this.floors=[],this.selectedFloorId=null,this.dirty=!1,this.saving=!1}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}render(){return N`
      <div class="identity">
        <ha-icon icon="mdi:floor-plan"></ha-icon>
        <div>
          <h1>Spatial Context</h1>
          <div class="subtitle">
            v0.1.0-beta.1 · Floor plan &amp; device mapping
          </div>
        </div>
      </div>
      <floor-tabs
        .floors=${this.floors}
        .selectedFloorId=${this.selectedFloorId}
      ></floor-tabs>
      <div class="actions">
        <slot></slot>
        <button
          class="icon-button"
          title=${this.saving?"Saving…":"Save"}
          ?disabled=${this.saving}
          @click=${()=>this._fire("save-click")}
        >
          <ha-icon icon="mdi:content-save"></ha-icon>
          ${this.dirty?N`<span class="dirty-dot"></span>`:Y}
        </button>
        <button
          class="icon-button"
          title="Export"
          @click=${()=>this._fire("export-click")}
        >
          <ha-icon icon="mdi:download"></ha-icon>
        </button>
        <button
          class="icon-button danger"
          title="Reset floor"
          @click=${()=>this._fire("reset-click")}
        >
          <ha-icon icon="mdi:delete-sweep"></ha-icon>
        </button>
      </div>
    `}};qt.styles=[Ht,l`
      :host {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        height: 56px;
        padding: 0 8px 0 16px;
        background: var(--sc-header-bg);
        border-bottom: 1px solid var(--sc-divider);
      }
      .identity {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }
      .identity ha-icon {
        --mdc-icon-size: 24px;
        color: var(--sc-accent);
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
      }
      floor-tabs {
        align-self: stretch;
        justify-self: center;
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
      .icon-button.danger ha-icon {
        color: var(--sc-danger);
      }
    `],t([_t({attribute:!1})],qt.prototype,"floors",void 0),t([_t({attribute:!1})],qt.prototype,"selectedFloorId",void 0),t([_t({type:Boolean})],qt.prototype,"dirty",void 0),t([_t({type:Boolean})],qt.prototype,"saving",void 0),qt=t([ht("app-header")],qt);let Gt=class extends dt{constructor(){super(...arguments),this.mode="select",this.armedOpeningType=null,this.hasPendingTrace=!1,this.hasPendingWall=!1,this.pendingScaleCount=0,this.scaleReadout=null,this.selectedRoom=null,this.editingRoom=!1,this.areas=[],this.selectedPin=null,this.selectedWall=null,this.editingWall=!1,this.pinStack=null,this.entityLookup=new Map,this.selectedOpening=null,this.otherFloors=[],this.alignTargetFloorId=null,this.alignTargetHasBackground=!0}_fire(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}_modeButton(t,e,i){return N`<button
      class=${this.mode===t?"active":""}
      title=${i}
      @click=${()=>this._fire("mode-change",{mode:t})}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_openingModeButton(t,e,i){const n="opening"===this.mode&&this.armedOpeningType===t;return N`<button
      class=${n?"active":""}
      title=${i}
      @click=${()=>this._fire("add-opening-click",{openingType:t})}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_renderModeToolbar(){return N`
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
    `}_renderHintBar(){return"trace"===this.mode&&this.hasPendingTrace?N`<div class="hint-bar floating-panel">
        <span class="hint">Click near the start to close the room.</span>
        <button @click=${()=>this._fire("cancel-pending-click")}>
          Cancel
        </button>
      </div>`:"wall"===this.mode?N`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click to add
          points${this.hasPendingWall?", then Finish.":"."}</span
        >
        ${this.hasPendingWall?N`<button
                class="primary"
                @click=${()=>this._fire("finish-wall-click")}
              >
                Finish Wall
              </button>`:Y}
        ${this.hasPendingWall?N`<button @click=${()=>this._fire("cancel-pending-click")}>
                Cancel
              </button>`:Y}
      </div>`:"scale"===this.mode?N`<div class="hint-bar floating-panel">
        <span class="hint"
          >${0===this.pendingScaleCount?"Click the first point of a known distance.":"Click the second point."}</span
        >
        ${this.pendingScaleCount>0?N`<button @click=${()=>this._fire("cancel-pending-click")}>
                Cancel
              </button>`:Y}
      </div>`:"opening"===this.mode?N`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click on a wall to place a
          ${this.armedOpeningType??"opening"}.</span
        >
      </div>`:"align"===this.mode?this._renderAlignBar():Y}_renderAlignBar(){return this.alignTargetFloorId?this.alignTargetHasBackground?N`<div class="hint-bar floating-panel">
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
    </div>`:N`<div class="hint-bar floating-panel">
        <span class="hint"
          >That floor has no background image to align against.</span
        >
        <button
          @click=${()=>this._fire("align-target-change",{floorId:null})}
        >
          Choose another
        </button>
        <button @click=${()=>this._fire("align-cancel-click")}>Cancel</button>
      </div>`:N`<div class="hint-bar floating-panel">
        <span class="hint">Align against:</span>
        <select
          @change=${t=>this._fire("align-target-change",{floorId:t.target.value})}
        >
          <option value="" selected>— Choose a floor —</option>
          ${this.otherFloors.map(t=>N`<option value=${t.floor_id}>${t.name}</option>`)}
        </select>
        <button @click=${()=>this._fire("align-cancel-click")}>Cancel</button>
      </div>`}_renderSelectionPanel(){if(this.selectedRoom){const t=this.selectedRoom;return N`
        <div class="selection-panel floating-panel">
          <span class="hint">${t.name}</span>
          <select
            @change=${t=>this._fire("room-area-change",{areaId:t.target.value})}
          >
            <option value="" ?selected=${!t.area_id}>— Custom —</option>
            ${this.areas.map(e=>N`<option
                  value=${e.area_id}
                  ?selected=${e.area_id===t.area_id}
                >
                  ${e.name}
                </option>`)}
          </select>
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
          <button
            class="danger"
            title="Delete room"
            @click=${()=>this._fire("room-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `}if(this.selectedPin)return N`
        <div class="selection-panel floating-panel">
          <span class="hint">${this._pinLabel(this.selectedPin)}</span>
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
            <ha-icon icon="mdi:arrow-up-down"></ha-icon>
          </button>
          <button
            class="danger"
            title="Delete pin"
            @click=${()=>this._fire("pin-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `;if(this.selectedWall){const t=this.selectedWall;return N`
        <div class="selection-panel floating-panel">
          <span class="hint">Wall material</span>
          <select
            @change=${t=>this._fire("wall-material-change",{material:t.target.value})}
          >
            ${bt.map(e=>N`<option value=${e.id} ?selected=${e.id===t.material}>
                  ${e.label}
                </option>`)}
          </select>
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
      `}return this.selectedOpening?N`
        <div class="selection-panel floating-panel">
          <span class="hint">${this.selectedOpening.type}</span>
          <button
            title="Set width"
            @click=${()=>this._fire("opening-set-width-click")}
          >
            <ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>
          </button>
          <button
            class="danger"
            title="Delete"
            @click=${()=>this._fire("opening-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `:Y}_pinLabel(t){return t.label_override?t.label_override:this.entityLookup.get(t.entity_id)?.name??t.entity_id}_renderPinStack(){return this.pinStack?N`
      <div class="pin-stack floating-panel">
        <span class="stack-title"
          >${this.pinStack.length} devices at this spot</span
        >
        ${this.pinStack.map(t=>N`
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
    `:Y}render(){return N`
      ${this._renderModeToolbar()} ${this._renderHintBar()}
      <div class="scale-badge floating-panel">
        ${this.scaleReadout??"Not calibrated"}
      </div>
      ${this.pinStack?this._renderPinStack():this._renderSelectionPanel()}
    `}};Gt.styles=[Ht,l`
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
    `],t([_t({attribute:!1})],Gt.prototype,"mode",void 0),t([_t({attribute:!1})],Gt.prototype,"armedOpeningType",void 0),t([_t({type:Boolean})],Gt.prototype,"hasPendingTrace",void 0),t([_t({type:Boolean})],Gt.prototype,"hasPendingWall",void 0),t([_t({type:Number})],Gt.prototype,"pendingScaleCount",void 0),t([_t({attribute:!1})],Gt.prototype,"scaleReadout",void 0),t([_t({attribute:!1})],Gt.prototype,"selectedRoom",void 0),t([_t({type:Boolean})],Gt.prototype,"editingRoom",void 0),t([_t({attribute:!1})],Gt.prototype,"areas",void 0),t([_t({attribute:!1})],Gt.prototype,"selectedPin",void 0),t([_t({attribute:!1})],Gt.prototype,"selectedWall",void 0),t([_t({type:Boolean})],Gt.prototype,"editingWall",void 0),t([_t({attribute:!1})],Gt.prototype,"pinStack",void 0),t([_t({attribute:!1})],Gt.prototype,"entityLookup",void 0),t([_t({attribute:!1})],Gt.prototype,"selectedOpening",void 0),t([_t({attribute:!1})],Gt.prototype,"otherFloors",void 0),t([_t({attribute:!1})],Gt.prototype,"alignTargetFloorId",void 0),t([_t({type:Boolean})],Gt.prototype,"alignTargetHasBackground",void 0),Gt=t([ht("canvas-overlay")],Gt);let Kt=class extends dt{constructor(){super(...arguments),this.icon="",this.label="",this.open=!1}render(){return N`
      <button
        class="icon-button ${this.open?"active":""}"
        title=${this.label}
        @click=${()=>this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0}))}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${this.open?N`<div class="popover floating-panel"><slot></slot></div>`:Y}
    `}};Kt.styles=[Ht,l`
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
    `],t([_t()],Kt.prototype,"icon",void 0),t([_t()],Kt.prototype,"label",void 0),t([_t({type:Boolean})],Kt.prototype,"open",void 0),Kt=t([ht("icon-popover")],Kt);const Jt={light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:eye",climate:"mdi:thermostat",lock:"mdi:lock",cover:"mdi:window-shutter",camera:"mdi:cctv",media_player:"mdi:speaker",fan:"mdi:fan",humidifier:"mdi:air-humidifier",vacuum:"mdi:robot-vacuum",alarm_control_panel:"mdi:shield-home",water_heater:"mdi:water-boiler",device_tracker:"mdi:crosshairs-gps",valve:"mdi:valve",siren:"mdi:bullhorn",assist_satellite:"mdi:microphone-variant"},Qt=["light","switch","climate","media_player","lock","cover","fan","vacuum","alarm_control_panel","valve","humidifier","siren","water_heater","camera","assist_satellite","device_tracker","binary_sensor","sensor"];let te=class extends dt{constructor(){super(...arguments),this.entities=[],this.placedEntityIds=new Set,this.armedEntityId=null,this.floors=[],this.areas=[],this.currentFloorId=null,this._search="",this._floorFilter=null,this._areaFilter=null,this._onFloorFilterChange=t=>{const e=t.target.value;this._floorFilter="all"===e?"all":e,this._areaFilter&&!this._areasForFilter.some(t=>t.area_id===this._areaFilter)&&(this._areaFilter=null)}}get _effectiveFloorFilter(){return"all"===this._floorFilter?null:this._floorFilter??this.currentFloorId}get _areasForFilter(){const t=this._effectiveFloorFilter;return null===t?this.areas:this.areas.filter(e=>e.floor_id===t)}get _devices(){const t=new Map;for(const e of this.entities){const i=e.device_id??e.entity_id;t.has(i)||t.set(i,[]),t.get(i).push(e)}const e=[];for(const[i,n]of t){const t=[...n].sort((t,e)=>{const i=t=>t.entity_category?1:0,n=t=>{const e=Qt.indexOf(t.domain);return-1===e?Qt.length:e};return i(t)-i(e)||n(t)-n(e)}),s=t[0];e.push({deviceId:i,deviceName:s.device_name??s.name,areaId:s.area_id,areaName:s.area_name,integrationDomain:s.integration_domain,integrationName:s.integration_name,entities:n,primaryEntityId:s.entity_id})}return e.sort((t,e)=>t.deviceName.localeCompare(e.deviceName)),e}_blockedFloorName(t){const e=t.entities.find(e=>e.entity_id===t.primaryEntityId);return e?.placed_floor_id&&e.placed_floor_id!==this.currentFloorId?e.placed_floor_name??e.placed_floor_id:null}get _filtered(){const t=this._search.trim().toLowerCase(),e=this._effectiveFloorFilter,i=this._areaFilter;return this._devices.filter(n=>{if(i){if(n.areaId!==i)return!1}else if(e){const t=this.areas.find(t=>t.area_id===n.areaId);if(!t||t.floor_id!==e)return!1}return!t||(n.deviceName.toLowerCase().includes(t)||(n.areaName??"").toLowerCase().includes(t)||n.entities.some(e=>e.entity_id.toLowerCase().includes(t)))})}render(){const t=this._filtered;return N`
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
            ${this.floors.map(t=>N`<option
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
            ${this._areasForFilter.map(t=>N`<option
                  value=${t.area_id}
                  ?selected=${this._areaFilter===t.area_id}
                >
                  ${t.name}
                </option>`)}
          </select>
        </div>
        ${this.placedEntityIds.size>0?N`<button
                class="clear-all-button"
                @click=${()=>this.dispatchEvent(new CustomEvent("clear-all-pins",{bubbles:!0,composed:!0}))}
              >
                <ha-icon icon="mdi:playlist-remove"></ha-icon> Clear all placed
                devices
              </button>`:Y}
      </div>
      <div class="list">
        ${0===t.length?N`<div class="empty">No matching devices.</div>`:t.map(t=>{const e=t.entities.some(t=>this.placedEntityIds.has(t.entity_id)),i=this._blockedFloorName(t),n=this.armedEntityId===t.primaryEntityId,s=t.entities.find(e=>e.entity_id===t.primaryEntityId)?.domain,o=Jt[s??""]??"mdi:help-box",l=[t.areaName,t.integrationName].filter(t=>!!t).join(" - ");return N`
                  <div
                    class="item ${n?"armed":""} ${e?"placed":""} ${i?"blocked":""}"
                    title=${i?`Already placed on ${i} — remove it there first`:""}
                    @click=${()=>{i||this.dispatchEvent(new CustomEvent("entity-armed",{detail:{entityId:t.primaryEntityId},bubbles:!0,composed:!0}))}}
                  >
                    <span class="avatar">
                      ${t.integrationDomain?N`<img
                              src="https://brands.home-assistant.io/_/${t.integrationDomain}/icon.png"
                              alt=""
                              @error=${t=>{const e=t.target;e.style.display="none",e.nextElementSibling?.classList.remove("hidden")}}
                            />`:Y}
                      <ha-icon
                        icon=${o}
                        class=${t.integrationDomain?"hidden":""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${t.deviceName}</span>
                      ${i?N`<span class="meta"
                              >Placed on ${i}</span
                            >`:l?N`<span class="meta">${l}</span>`:Y}
                      ${e?N`<span class="meta">✓ placed</span>`:Y}
                    </span>
                  </div>
                `})}
      </div>
    `}};te.styles=[Ht,l`
      :host {
        display: flex;
        flex-direction: column;
        width: 300px;
        min-width: 300px;
        border-left: 1px solid var(--sc-divider);
        background: var(--sc-panel-bg);
        height: 100%;
        overflow: hidden;
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
    `],t([_t({attribute:!1})],te.prototype,"entities",void 0),t([_t({attribute:!1})],te.prototype,"placedEntityIds",void 0),t([_t({attribute:!1})],te.prototype,"armedEntityId",void 0),t([_t({attribute:!1})],te.prototype,"floors",void 0),t([_t({attribute:!1})],te.prototype,"areas",void 0),t([_t({attribute:!1})],te.prototype,"currentFloorId",void 0),t([gt()],te.prototype,"_search",void 0),t([gt()],te.prototype,"_floorFilter",void 0),t([gt()],te.prototype,"_areaFilter",void 0),te=t([ht("entity-picker-sidebar")],te);let ee=class extends dt{constructor(){super(...arguments),this._floors=[],this._currentFloorId=null,this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._entities=[],this._areas=[],this._mode="select",this._armedEntityId=null,this._armedOpeningType=null,this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._dirty=!1,this._saving=!1,this._loading=!0,this._pendingCount=0,this._networkType=null,this._zigbeeMesh=null,this._zigbeeMeshLoading=!1,this._zigbeeMeshError=null,this._zigbeeMeshFetchedAt=null,this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=null,this._wifiMesh=null,this._wifiMeshLoading=!1,this._wifiMeshError=null,this._wifiMeshFetchedAt=null,this._matterTopology=null,this._matterError=null,this._matterUnsubscribe=null,this._backgroundPopoverOpen=!1,this._meshPopoverOpen=!1,this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._initialized=!1,this._onFloorSelected=t=>{this._selectFloor(t.detail.floorId)},this._onModeChange=t=>{this._mode=this._mode===t.detail.mode?"select":t.detail.mode,this._armedEntityId=null,this._armedOpeningType=null,"select"!==this._mode&&(this._editingRoomId=null,this._editingWallId=null),"align"!==this._mode&&this._resetAlignState()},this._onAddOpeningClick=t=>{this._mode="opening",this._armedOpeningType=t.detail.openingType,this._editingRoomId=null,this._editingWallId=null},this._onSaveClick=()=>{this._save()},this._onExportClick=()=>{this._export()},this._onResetClick=()=>{const t=this._floors.find(t=>t.floor_id===this._currentFloorId)?.name??"this floor";window.confirm(`Reset "${t}"? This clears every room, wall, opening, placed device, and the background image on this floor. Nothing is permanent until you hit Save afterward.`)&&(this._layout={background_image_id:null,background_opacity:.5,background_offset_x:0,background_offset_y:0,background_scale:1,building_id:null,rooms:[],pins:[],walls:[],openings:[],scale:null},this._dirty=!0,this._resetSelection(),this._pinStackIds=null)},this._onToggleBackgroundPopover=()=>{this._backgroundPopoverOpen=!this._backgroundPopoverOpen,this._meshPopoverOpen=!1},this._onToggleMeshPopover=()=>{const t=!this._meshPopoverOpen;this._meshPopoverOpen=t,this._backgroundPopoverOpen=!1,t||(this._unsubscribeMatter(),this._networkType=null)},this._onNetworkTypeSelect=t=>{this._networkType=t},this._onLoadMesh=()=>{"zigbee"===this._networkType?this._refreshZigbeeMesh():"wifi"===this._networkType?this._refreshWifiMesh():"matter"===this._networkType&&this._subscribeMatter()},this._onFileInputChange=async t=>{const e=t.target,i=e.files?.[0];if(e.value="",i)try{const t=await this._client.uploadBackgroundImage(i);this._updateLayout({background_image_id:t,background_opacity:.85})}catch(t){window.alert(`Background image upload failed: ${t.message}`)}},this._onRemoveBackgroundClick=()=>{this._updateLayout({background_image_id:null})},this._onOpacityChange=t=>{this._updateLayout({background_opacity:Number(t.target.value)})},this._onCancelPending=()=>this._canvas?.cancelPending(),this._onFinishWall=()=>this._canvas?.finishPendingWall(),this._onAlignTargetChange=async t=>{const e=t.detail.floorId;e?(this._alignTargetFloorId=e,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1,this._alignTargetLayout=await this._client.getLayout(e)):this._resetAlignState()},this._onAlignDrag=t=>{this._alignOffsetX+=t.detail.dx,this._alignOffsetY+=t.detail.dy},this._onAlignScaleClick=t=>{this._alignScale*=t.detail.factor},this._onAlignCancel=()=>{this._mode="select",this._resetAlignState()},this._onAlignApply=async()=>{if(!this._alignTargetFloorId||!this._alignTargetLayout)return;const t=this._alignTargetFloorId,e=this._floors.find(e=>e.floor_id===t)?.name??"that floor";if(!window.confirm(`Apply this alignment to "${e}"? This rewrites every room, wall, door/window, and placed device position on that floor — plus its background image's placement and, if this floor has one set, its scale calibration too — to match this floor's coordinate system. This saves immediately and cannot be undone.`))return;const i=this._alignScale,n=this._alignOffsetX,s=this._alignOffsetY,o=([t,e])=>[t*i+n,e*i+s],l=this._alignTargetLayout,a=this._layout.building_id??wt("building"),r={background_image_id:l.background_image_id,background_opacity:l.background_opacity,background_offset_x:l.background_offset_x*i+n,background_offset_y:l.background_offset_y*i+s,background_scale:l.background_scale*i,building_id:a,rooms:l.rooms.map(t=>({...t,points:t.points.map(o)})),walls:l.walls.map(t=>({...t,points:t.points.map(o)})),pins:l.pins.map(t=>{const[e,i]=o([t.x,t.y]);return{...t,x:e,y:i}}),openings:l.openings.map(t=>{const[e,n]=o([t.x,t.y]);return{...t,x:e,y:n,width:t.width*i}}),scale:this._layout.scale??(l.scale?{points:[o(l.scale.points[0]),o(l.scale.points[1])],meters:l.scale.meters}:null)};await this._client.saveLayout(t,r),this._layout.building_id!==a&&(await this._client.setBuildingId(this._currentFloorId,a),this._layout={...this._layout,building_id:a}),this._floors=await this._client.listFloors(),this._mode="select",this._resetAlignState()},this._onRoomRename=()=>{const t=this._selectedRoom;if(!t)return;const e=window.prompt("Room name:",t.name);e&&this._updateLayout({rooms:this._layout.rooms.map(i=>i.id===t.id?{...i,name:e}:i)})},this._onRoomAreaChange=t=>{const e=this._selectedRoom;if(!e)return;const i=t.detail.areaId||null,n=this._areas.find(t=>t.area_id===i);this._updateLayout({rooms:this._layout.rooms.map(t=>t.id===e.id?{...t,area_id:i,name:n?n.name:t.name}:t)})},this._onRoomEditVertices=()=>{this._selectedRoomId&&(this._editingRoomId=this._editingRoomId===this._selectedRoomId?null:this._selectedRoomId)},this._onRoomDelete=()=>{const t=this._selectedRoom;t&&window.confirm(`Delete room "${t.name}"?`)&&(this._updateLayout({rooms:this._layout.rooms.filter(e=>e.id!==t.id),pins:this._layout.pins.map(e=>e.room_id===t.id?{...e,room_id:null}:e)}),this._selectedRoomId=null,this._editingRoomId=null)},this._onPinSetLabel=()=>{const t=this._selectedPin;if(!t)return;const e=window.prompt("Label override (blank to clear):",t.label_override??"");null!==e&&this._patchPin(t.id,{label_override:e||null})},this._onPinSetIcon=()=>{const t=this._selectedPin;if(!t)return;const e=window.prompt("Icon override, e.g. mdi:motion-sensor (blank to clear):",t.icon_override??"");null!==e&&this._patchPin(t.id,{icon_override:e||null})},this._onPinSetHeight=()=>{const t=this._selectedPin;if(!t)return;const e=window.prompt("Mounting height in metres above floor level (e.g. 1.8 for a high wall mount; blank to clear):",null===t.height_m?"":String(t.height_m));if(null===e)return;const i=""===e.trim()?null:Number(e);this._patchPin(t.id,{height_m:null!==i&&Number.isFinite(i)?i:null})},this._onPinDelete=()=>{const t=this._selectedPin;t&&window.confirm(`Delete pin for ${t.entity_id}?`)&&(this._updateLayout({pins:this._layout.pins.filter(e=>e.id!==t.id)}),this._selectedPinId=null)},this._onWallMaterialChange=t=>{const e=this._selectedWall;e&&this._updateLayout({walls:this._layout.walls.map(i=>i.id===e.id?{...i,material:t.detail.material}:i)})},this._onWallEditVertices=()=>{this._selectedWallId&&(this._editingWallId=this._editingWallId===this._selectedWallId?null:this._selectedWallId)},this._onWallDelete=()=>{const t=this._selectedWall;t&&window.confirm("Delete this wall? Any doors/windows on it will be removed too.")&&(this._updateLayout({walls:this._layout.walls.filter(e=>e.id!==t.id),openings:this._layout.openings.filter(e=>e.wallId!==t.id)}),this._selectedWallId=null,this._editingWallId=null)},this._onOpeningSetWidth=()=>{const t=this._selectedOpening;if(!t)return;const e=window.prompt("Width along the wall (stored units):",String(t.width)),i=e?Number(e):NaN;!Number.isFinite(i)||i<=0||this._updateLayout({openings:this._layout.openings.map(e=>e.id===t.id?{...e,width:i}:e)})},this._onOpeningDelete=()=>{const t=this._selectedOpening;t&&window.confirm(`Delete this ${t.type}?`)&&(this._updateLayout({openings:this._layout.openings.filter(e=>e.id!==t.id)}),this._selectedOpeningId=null)},this._onEntityArmed=t=>{this._armedEntityId=this._armedEntityId===t.detail.entityId?null:t.detail.entityId},this._onClearAllPins=()=>{const t=this._layout.pins.length;0!==t&&window.confirm(`Remove all ${t} placed device${1===t?"":"s"} from this floor?`)&&(this._updateLayout({pins:[]}),this._selectedPinId=null,this._pinStackIds=null)},this._onRoomTraceComplete=t=>{const e=(i="New Room",n=t.detail.points,s=null,{id:wt("room"),name:i,area_id:s,points:n});var i,n,s;this._updateLayout({rooms:[...this._layout.rooms,e]}),this._selectedRoomId=e.id},this._onRoomVertexChanged=t=>{this._updateLayout({rooms:this._layout.rooms.map(e=>e.id===t.detail.roomId?{...e,points:t.detail.points}:e)})},this._onRoomSelect=t=>{this._selectedRoomId=t.detail.roomId,null===t.detail.roomId?this._editingRoomId=null:(this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null)},this._onWallTraceComplete=t=>{this._updateLayout({walls:[...this._layout.walls,kt(t.detail.points)]})},this._onWallVertexChanged=t=>{this._updateLayout({walls:this._layout.walls.map(e=>e.id===t.detail.wallId?{...e,points:t.detail.points}:e)})},this._onWallSelect=t=>{this._selectedWallId=t.detail.wallId,null===t.detail.wallId?this._editingWallId=null:(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedOpeningId=null)},this._onOpeningPlace=t=>{if(!this._armedOpeningType)return;const e=function(t,e,i,n,s){return{id:wt("opening"),wallId:t,type:e,x:i,y:n,width:s}}(t.detail.wallId,this._armedOpeningType,t.detail.x,t.detail.y,this._defaultOpeningWidth());this._updateLayout({openings:[...this._layout.openings,e]})},this._onOpeningSelect=t=>{this._selectedOpeningId=t.detail.openingId,null!==t.detail.openingId&&(this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._pinStackIds=null,this._selectedWallId=null,this._editingWallId=null)},this._onOpeningUpdate=t=>{this._updateLayout({openings:this._layout.openings.map(e=>e.id===t.detail.openingId?{...e,x:t.detail.x,y:t.detail.y,width:t.detail.width}:e)})},this._onPinPlace=t=>{if(!this._armedEntityId)return;const e=Pt(t.detail.x,t.detail.y,this._layout.rooms),i=function(t,e,i,n){return{id:wt("pin"),entity_id:t,x:e,y:i,room_id:n,icon_override:null,label_override:null,height_m:null}}(this._armedEntityId,t.detail.x,t.detail.y,e),n=this._entityLookup.get(this._armedEntityId);n&&n.device_name&&n.device_name!==n.name&&(i.label_override=n.device_name);const s=this._layout.pins.filter(e=>e.x===t.detail.x&&e.y===t.detail.y);this._updateLayout({pins:[...this._layout.pins,i]}),this._armedEntityId=null,s.length>0&&(this._pinStackIds=[...s.map(t=>t.id),i.id],this._selectedPinId=null)},this._onPinMove=t=>{const e=Pt(t.detail.x,t.detail.y,this._layout.rooms);this._patchPin(t.detail.pinId,{x:t.detail.x,y:t.detail.y,room_id:e})},this._onPinSelect=t=>{this._selectedPinId=t.detail.pinId,this._pinStackIds=null,null!==t.detail.pinId&&(this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null)},this._onPinStackSelect=t=>{this._pinStackIds=t.detail.pinIds,this._selectedRoomId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._selectedPinId=null},this._onPinStackChoose=t=>{this._pinStackIds=null,this._selectedPinId=t.detail.pinId},this._onPinStackDismiss=()=>{this._pinStackIds=null},this._onPinStackRemove=t=>{const e=this._layout.pins.find(e=>e.id===t.detail.pinId);if(!e)return;if(!window.confirm(`Remove ${this._pinLabel(e)} from this spot?`))return;this._updateLayout({pins:this._layout.pins.filter(e=>e.id!==t.detail.pinId)});const i=(this._pinStackIds??[]).filter(e=>e!==t.detail.pinId);this._pinStackIds=i.length>1?i:null,this._selectedPinId=1===i.length?i[0]:null},this._onScaleLineComplete=t=>{const e=window.prompt("Real-world distance between these two points, in metres:"),i=e?Number(e):NaN;if(!Number.isFinite(i)||i<=0)return;const n=t.detail.points;this._updateLayout({scale:{points:n,meters:i}}),this._mode="select"},this._onPendingChanged=t=>{this._pendingCount=t.detail.count}}set hass(t){this._hass=t,this._initialized||(this._initialized=!0,this._init())}get hass(){return this._hass}get _client(){return new $t(this._hass)}get _entityLookup(){return new Map(this._entities.map(t=>[t.entity_id,t]))}get _placedEntityIds(){return new Set(this._layout.pins.map(t=>t.entity_id))}get _selectedRoom(){return this._layout.rooms.find(t=>t.id===this._selectedRoomId)??null}get _areasForCurrentFloor(){return this._areas.filter(t=>t.floor_id===this._currentFloorId)}get _otherFloors(){return this._floors.filter(t=>t.floor_id!==this._currentFloorId)}get _alignOverlay(){if("align"!==this._mode||!this._alignTargetLayout)return null;const t=xt(this._alignTargetLayout.background_image_id);if(!t)return null;const e=this._alignTargetLayout;return{imageUrl:t,offsetX:this._alignScale*e.background_offset_x+this._alignOffsetX,offsetY:this._alignScale*e.background_offset_y+this._alignOffsetY,scale:this._alignScale*e.background_scale,opacity:.55}}get _pinByDeviceId(){const t=this._entityLookup,e=new Map;for(const i of this._layout.pins){const n=t.get(i.entity_id)?.device_id;n&&e.set(n,i)}return e}get _meshLinksForCurrentFloor(){if(!this._meshPopoverOpen)return[];const t=this._pinByDeviceId,e=[];if("zigbee"===this._networkType&&this._zigbeeMesh)for(const i of this._zigbeeMesh.links){if(!i.source_device_id||!i.target_device_id)continue;const n=t.get(i.source_device_id),s=t.get(i.target_device_id);n&&s&&e.push({fromPin:n,toPin:s,quality:ft(i.lqi),detail:`LQI ${i.lqi}`})}else if("wifi"===this._networkType&&this._wifiMesh)for(const i of this._wifiMesh.links){const n=t.get(i.source_device_id),s=t.get(i.target_device_id);n&&s&&e.push({fromPin:n,toPin:s,quality:null!=i.rssi_dbm?vt(i.rssi_dbm):"unknown",...null!=i.rssi_dbm?{detail:`${i.rssi_dbm} dBm`}:{}})}else if("matter"===this._networkType&&this._matterTopology){const i=new Map;for(const t of this._matterTopology.nodes)t.ha_device_id&&i.set(t.id,t.ha_device_id);for(const n of this._matterTopology.connections){const s=i.get(n.source),o=i.get(n.target);if(!s||!o)continue;const l=t.get(s),a=t.get(o);l&&a&&e.push({fromPin:l,toPin:a,quality:n.strength,detail:n.strength})}}return e}get _selectedPin(){return this._layout.pins.find(t=>t.id===this._selectedPinId)??null}get _pinStack(){if(!this._pinStackIds)return null;const t=new Map(this._layout.pins.map(t=>[t.id,t])),e=this._pinStackIds.map(e=>t.get(e)).filter(t=>!!t);return e.length>1?e:null}get _selectedWall(){return this._layout.walls.find(t=>t.id===this._selectedWallId)??null}get _selectedOpening(){return this._layout.openings.find(t=>t.id===this._selectedOpeningId)??null}get _scaleReadout(){const t=this._layout.scale;if(!t)return null;const[[e,i],[n,s]]=t.points;return`Scale: 1 m ≈ ${((Math.hypot(n-e,s-i)||1)/t.meters).toFixed(1)} units`}_defaultOpeningWidth(){const t=this._layout.scale;if(!t)return 30;const[[e,i],[n,s]]=t.points;return.9*((Math.hypot(n-e,s-i)||1)/t.meters)}async _init(){const[t,e,i]=await Promise.all([this._client.listFloors(),this._client.listPlaceableEntities(),this._client.listAreas()]);this._floors=t,this._entities=e,this._areas=i,t.length>0&&await this._selectFloor(t[0].floor_id,{skipDirtyCheck:!0}),this._loading=!1}async _selectFloor(t,e={}){if(!e.skipDirtyCheck&&this._dirty&&!window.confirm("Discard unsaved changes to this floor?"))return;const i=this._layout.building_id;this._currentFloorId=t,this._layout=await this._client.getLayout(t),this._resetSelection(),this._resetAlignState(),this._dirty=!1;null!==this._layout.building_id&&this._layout.building_id===i||(await this.updateComplete,this._canvas?.fitToScreen())}_resetAlignState(){this._alignTargetFloorId=null,this._alignTargetLayout=null,this._alignOffsetX=0,this._alignOffsetY=0,this._alignScale=1}_resetSelection(){this._selectedRoomId=null,this._editingRoomId=null,this._selectedPinId=null,this._selectedWallId=null,this._editingWallId=null,this._selectedOpeningId=null,this._armedEntityId=null,this._armedOpeningType=null}async _save(){if(this._currentFloorId){this._saving=!0;try{await this._client.saveLayout(this._currentFloorId,this._layout),this._dirty=!1,this._floors=this._floors.map(t=>t.floor_id===this._currentFloorId?{...t,has_layout:!0}:t)}finally{this._saving=!1}}}async _export(){const t=await this._client.exportSnapshot(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(e),n=document.createElement("a");n.href=i,n.download="layout.json",n.click(),URL.revokeObjectURL(i)}_updateLayout(t){this._layout={...this._layout,...t},this._dirty=!0}async _refreshZigbeeMesh(){this._zigbeeMeshLoading=!0,this._zigbeeMeshError=null;const t=Date.now();this._zigbeeMeshElapsedSeconds=0,this._zigbeeMeshTimer=window.setInterval(()=>{this._zigbeeMeshElapsedSeconds=Math.round((Date.now()-t)/1e3)},1e3);try{this._zigbeeMesh=await this._client.getZigbeeMesh(),this._zigbeeMeshFetchedAt=Date.now()}catch(t){const e=t?.message;this._zigbeeMeshError=e||"Zigbee mesh request failed"}finally{this._zigbeeMeshLoading=!1,null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}}async _refreshWifiMesh(){this._wifiMeshLoading=!0,this._wifiMeshError=null;try{this._wifiMesh=await this._client.getWifiMesh(),this._wifiMeshFetchedAt=Date.now()}catch(t){const e=t?.message;this._wifiMeshError=e||"Wi-Fi mesh request failed"}finally{this._wifiMeshLoading=!1}}async _subscribeMatter(){this._unsubscribeMatter(),this._matterError=null;try{this._matterUnsubscribe=await this._client.subscribeMatterTopology(t=>{this._matterTopology=t})}catch(t){const e=t?.message;this._matterError=e||"Matter topology subscription failed"}}_unsubscribeMatter(){this._matterUnsubscribe?.(),this._matterUnsubscribe=null}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeMatter(),null!==this._zigbeeMeshTimer&&(window.clearInterval(this._zigbeeMeshTimer),this._zigbeeMeshTimer=null)}_patchPin(t,e){this._updateLayout({pins:this._layout.pins.map(i=>i.id===t?{...i,...e}:i)})}_pinLabel(t){return t.label_override?t.label_override:this._entityLookup.get(t.entity_id)?.name??t.entity_id}_meshAgeLabel(t){const e=Math.round((Date.now()-t)/1e3);return e<60?`refreshed ${e}s ago`:`refreshed ${Math.round(e/60)}m ago`}render(){if(this._loading)return N`<div class="loading">Loading Spatial Context…</div>`;if(0===this._floors.length)return N`<div class="no-floors">
        No floors found. Add floors under Settings → Areas → Floors, then reopen
        this panel.
      </div>`;const t="zigbee"===this._networkType?this._zigbeeMeshLoading:this._wifiMeshLoading,e="zigbee"===this._networkType?this._zigbeeMeshError:"wifi"===this._networkType?this._wifiMeshError:this._matterError,i="zigbee"===this._networkType?this._zigbeeMeshFetchedAt:this._wifiMeshFetchedAt;return N`
      <app-header
        .floors=${this._floors}
        .selectedFloorId=${this._currentFloorId}
        .dirty=${this._dirty}
        .saving=${this._saving}
        @floor-selected=${this._onFloorSelected}
        @save-click=${this._onSaveClick}
        @export-click=${this._onExportClick}
        @reset-click=${this._onResetClick}
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
            ${this._layout.background_image_id?"Replace background":"Upload background"}
          </button>
          ${this._layout.background_image_id?N`<button
                  class="menu-item"
                  @click=${this._onRemoveBackgroundClick}
                >
                  <ha-icon icon="mdi:image-remove"></ha-icon> Remove background
                </button>`:Y}
          ${this._layout.background_image_id?N`<label
                  class="popover-row hint"
                  style="padding: 8px 16px 4px"
                  >Opacity
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    .value=${String(this._layout.background_opacity)}
                    @input=${this._onOpacityChange}
                  />
                </label>`:Y}
        </icon-popover>
        <icon-popover
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
              <ha-icon icon="mdi:wifi"></ha-icon> Wi-Fi Coverage
            </button>
            <button
              class="menu-item ${"matter"===this._networkType?"active":""}"
              @click=${()=>this._onNetworkTypeSelect("matter")}
            >
              <ha-icon icon="mdi:router-wireless"></ha-icon> Matter Network
            </button>
          </div>
          ${null===this._networkType?N`<span class="hint" style="padding: 4px 16px 8px"
                  >Pick a network above to load it.</span
                >`:N`
                  <div class="quality-legend">
                    <span
                      class="legend-gradient"
                      style="background: linear-gradient(to right, ${yt("weak")}, ${yt("medium")}, ${yt("strong")})"
                    ></span>
                    <div class="legend-labels">
                      <span>Weak</span><span>Strong</span>
                    </div>
                  </div>
                  ${"matter"===this._networkType&&this._matterUnsubscribe?N`<span class="hint" style="padding: 4px 16px 8px"
                          >● Live</span
                        >`:N`<button
                          class="menu-item"
                          ?disabled=${t}
                          @click=${this._onLoadMesh}
                        >
                          <ha-icon icon="mdi:refresh"></ha-icon>
                          ${t?"zigbee"===this._networkType?`Loading… ${this._zigbeeMeshElapsedSeconds}s (usually 1-2 min)`:"Loading…":"matter"===this._networkType?"Connect":i?"Refresh Mesh":"Load Mesh"}
                        </button>`}
                  ${e?N`<span
                          class="hint"
                          style="color: var(--sc-danger); padding: 0 16px 8px"
                          >${e}</span
                        >`:i&&"matter"!==this._networkType?N`<span class="hint" style="padding: 0 16px 8px"
                            >${this._meshAgeLabel(i)}</span
                          >`:Y}
                `}
        </icon-popover>
      </app-header>

      <div class="main">
        <div class="canvas-area">
          <floorplan-canvas
            .rooms=${this._layout.rooms}
            .pins=${this._layout.pins}
            .walls=${this._layout.walls}
            .openings=${this._layout.openings}
            .scale=${this._layout.scale}
            .meshLinks=${this._meshLinksForCurrentFloor}
            .entityLookup=${this._entityLookup}
            .backgroundImageUrl=${xt(this._layout.background_image_id)}
            .backgroundOpacity=${this._layout.background_opacity}
            .backgroundOffsetX=${this._layout.background_offset_x}
            .backgroundOffsetY=${this._layout.background_offset_y}
            .backgroundScale=${this._layout.background_scale}
            .alignOverlay=${this._alignOverlay}
            .mode=${this._mode}
            .armedEntityId=${this._armedEntityId}
            .armedOpeningType=${this._armedOpeningType}
            .selectedRoomId=${this._selectedRoomId}
            .editingRoomId=${this._editingRoomId}
            .selectedPinId=${this._selectedPinId}
            .selectedWallId=${this._selectedWallId}
            .editingWallId=${this._editingWallId}
            .selectedOpeningId=${this._selectedOpeningId}
            @room-trace-complete=${this._onRoomTraceComplete}
            @room-vertex-changed=${this._onRoomVertexChanged}
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
            .selectedRoom=${this._selectedRoom}
            .editingRoom=${!!this._editingRoomId}
            .areas=${this._areasForCurrentFloor}
            .selectedPin=${this._selectedPin}
            .selectedWall=${this._selectedWall}
            .editingWall=${!!this._editingWallId}
            .selectedOpening=${this._selectedOpening}
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
            @room-edit-vertices-click=${this._onRoomEditVertices}
            @room-delete-click=${this._onRoomDelete}
            @pin-set-label-click=${this._onPinSetLabel}
            @pin-set-icon-click=${this._onPinSetIcon}
            @pin-set-height-click=${this._onPinSetHeight}
            @pin-delete-click=${this._onPinDelete}
            @wall-material-change=${this._onWallMaterialChange}
            @wall-edit-vertices-click=${this._onWallEditVertices}
            @wall-delete-click=${this._onWallDelete}
            @opening-set-width-click=${this._onOpeningSetWidth}
            @opening-delete-click=${this._onOpeningDelete}
            @pin-stack-choose=${this._onPinStackChoose}
            @pin-stack-dismiss=${this._onPinStackDismiss}
            @pin-stack-remove-click=${this._onPinStackRemove}
          ></canvas-overlay>
        </div>
        ${"place"===this._mode?N`<entity-picker-sidebar
                .entities=${this._entities}
                .placedEntityIds=${this._placedEntityIds}
                .armedEntityId=${this._armedEntityId}
                .floors=${this._floors}
                .areas=${this._areas}
                .currentFloorId=${this._currentFloorId}
                @entity-armed=${this._onEntityArmed}
                @clear-all-pins=${this._onClearAllPins}
              ></entity-picker-sidebar>`:Y}
      </div>
    `}};ee.styles=[Ht,l`
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
    `],t([gt()],ee.prototype,"_floors",void 0),t([gt()],ee.prototype,"_currentFloorId",void 0),t([gt()],ee.prototype,"_layout",void 0),t([gt()],ee.prototype,"_entities",void 0),t([gt()],ee.prototype,"_areas",void 0),t([gt()],ee.prototype,"_mode",void 0),t([gt()],ee.prototype,"_armedEntityId",void 0),t([gt()],ee.prototype,"_armedOpeningType",void 0),t([gt()],ee.prototype,"_selectedRoomId",void 0),t([gt()],ee.prototype,"_editingRoomId",void 0),t([gt()],ee.prototype,"_selectedPinId",void 0),t([gt()],ee.prototype,"_pinStackIds",void 0),t([gt()],ee.prototype,"_selectedWallId",void 0),t([gt()],ee.prototype,"_editingWallId",void 0),t([gt()],ee.prototype,"_selectedOpeningId",void 0),t([gt()],ee.prototype,"_dirty",void 0),t([gt()],ee.prototype,"_saving",void 0),t([gt()],ee.prototype,"_loading",void 0),t([gt()],ee.prototype,"_pendingCount",void 0),t([gt()],ee.prototype,"_networkType",void 0),t([gt()],ee.prototype,"_zigbeeMesh",void 0),t([gt()],ee.prototype,"_zigbeeMeshLoading",void 0),t([gt()],ee.prototype,"_zigbeeMeshError",void 0),t([gt()],ee.prototype,"_zigbeeMeshFetchedAt",void 0),t([gt()],ee.prototype,"_zigbeeMeshElapsedSeconds",void 0),t([gt()],ee.prototype,"_wifiMesh",void 0),t([gt()],ee.prototype,"_wifiMeshLoading",void 0),t([gt()],ee.prototype,"_wifiMeshError",void 0),t([gt()],ee.prototype,"_wifiMeshFetchedAt",void 0),t([gt()],ee.prototype,"_matterTopology",void 0),t([gt()],ee.prototype,"_matterError",void 0),t([gt()],ee.prototype,"_backgroundPopoverOpen",void 0),t([gt()],ee.prototype,"_meshPopoverOpen",void 0),t([gt()],ee.prototype,"_alignTargetFloorId",void 0),t([gt()],ee.prototype,"_alignTargetLayout",void 0),t([gt()],ee.prototype,"_alignOffsetX",void 0),t([gt()],ee.prototype,"_alignOffsetY",void 0),t([gt()],ee.prototype,"_alignScale",void 0),t([mt("floorplan-canvas")],ee.prototype,"_canvas",void 0),t([mt("#file-input")],ee.prototype,"_fileInput",void 0),ee=t([ht("spatial-context-panel")],ee)}();
