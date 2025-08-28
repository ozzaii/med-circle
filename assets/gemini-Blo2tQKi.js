var e,t,n,o,s,i,r=Object.defineProperty,a=(e,t,n)=>((e,t,n)=>t in e?r(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,n),c=(e,t,n)=>new Promise((o,s)=>{var i=e=>{try{a(n.next(e))}catch(t){s(t)}},r=e=>{try{a(n.throw(e))}catch(t){s(t)}},a=e=>e.done?o(e.value):Promise.resolve(e.value).then(i,r);a((n=n.apply(e,t)).next())});(t=e||(e={})).STRING="string",t.NUMBER="number",t.INTEGER="integer",t.BOOLEAN="boolean",t.ARRAY="array",t.OBJECT="object",(o=n||(n={})).LANGUAGE_UNSPECIFIED="language_unspecified",o.PYTHON="python",(i=s||(s={})).OUTCOME_UNSPECIFIED="outcome_unspecified",i.OUTCOME_OK="outcome_ok",i.OUTCOME_FAILED="outcome_failed",i.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded";
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const l=["user","model","function","system"];var d,u,h,f,p,g,m,E,C,y,O,v,I,_,A,R;(u=d||(d={})).HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",u.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",u.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",u.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",u.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",(f=h||(h={})).HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",f.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",f.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",f.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",f.BLOCK_NONE="BLOCK_NONE",(g=p||(p={})).HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",g.NEGLIGIBLE="NEGLIGIBLE",g.LOW="LOW",g.MEDIUM="MEDIUM",g.HIGH="HIGH",(E=m||(m={})).BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",E.SAFETY="SAFETY",E.OTHER="OTHER",(y=C||(C={})).FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",y.STOP="STOP",y.MAX_TOKENS="MAX_TOKENS",y.SAFETY="SAFETY",y.RECITATION="RECITATION",y.LANGUAGE="LANGUAGE",y.OTHER="OTHER",(v=O||(O={})).TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",v.RETRIEVAL_QUERY="RETRIEVAL_QUERY",v.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",v.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",v.CLASSIFICATION="CLASSIFICATION",v.CLUSTERING="CLUSTERING",(_=I||(I={})).MODE_UNSPECIFIED="MODE_UNSPECIFIED",_.AUTO="AUTO",_.ANY="ANY",_.NONE="NONE",(R=A||(A={})).MODE_UNSPECIFIED="MODE_UNSPECIFIED",R.MODE_DYNAMIC="MODE_DYNAMIC";
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class T extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class N extends T{constructor(e,t){super(e),this.response=t}}class b extends T{constructor(e,t,n,o){super(e),this.status=t,this.statusText=n,this.errorDetails=o}}class S extends T{}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var w,x;(x=w||(w={})).GENERATE_CONTENT="generateContent",x.STREAM_GENERATE_CONTENT="streamGenerateContent",x.COUNT_TOKENS="countTokens",x.EMBED_CONTENT="embedContent",x.BATCH_EMBED_CONTENTS="batchEmbedContents";class M{constructor(e,t,n,o,s){this.model=e,this.task=t,this.apiKey=n,this.stream=o,this.requestOptions=s}toString(){var e,t;const n=(null===(e=this.requestOptions)||void 0===e?void 0:e.apiVersion)||"v1beta";let o=`${(null===(t=this.requestOptions)||void 0===t?void 0:t.baseUrl)||"https://generativelanguage.googleapis.com"}/${n}/${this.model}:${this.task}`;return this.stream&&(o+="?alt=sse"),o}}function D(e){return c(this,null,function*(){var t;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",function(e){const t=[];return(null==e?void 0:e.apiClient)&&t.push(e.apiClient),t.push("genai-js/0.21.0"),t.join(" ")}(e.requestOptions)),n.append("x-goog-api-key",e.apiKey);let o=null===(t=e.requestOptions)||void 0===t?void 0:t.customHeaders;if(o){if(!(o instanceof Headers))try{o=new Headers(o)}catch(s){throw new S(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${s.message}`)}for(const[e,t]of o.entries()){if("x-goog-api-key"===e)throw new S(`Cannot set reserved header name ${e}`);if("x-goog-api-client"===e)throw new S(`Header name ${e} can only be set using the apiClient field`);n.append(e,t)}}return n})}function P(e,t,n,o,s){return c(this,arguments,function*(e,t,n,o,s,i={},r=fetch){const{url:a,fetchOptions:l}=yield function(e,t,n,o,s,i){return c(this,null,function*(){const r=new M(e,t,n,o,i);return{url:r.toString(),fetchOptions:Object.assign(Object.assign({},$(i)),{method:"POST",headers:yield D(r),body:s})}})}(e,t,n,o,s,i);return function(e,t){return c(this,arguments,function*(e,t,n=fetch){let o;try{o=yield n(e,t)}catch(s){!function(e,t){let n=e;e instanceof b||e instanceof S||(n=new T(`Error fetching from ${t.toString()}: ${e.message}`),n.stack=e.stack);throw n}(s,e)}return o.ok||(yield function(e,t){return c(this,null,function*(){let n,o="";try{const t=yield e.json();o=t.error.message,t.error.details&&(o+=` ${JSON.stringify(t.error.details)}`,n=t.error.details)}catch(s){}throw new b(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${o}`,e.status,e.statusText,n)})}(o,e)),o})}(a,l,r)})}function $(e){const t={};if(void 0!==(null==e?void 0:e.signal)||(null==e?void 0:e.timeout)>=0){const n=new AbortController;(null==e?void 0:e.timeout)>=0&&setTimeout(()=>n.abort(),e.timeout),(null==e?void 0:e.signal)&&e.signal.addEventListener("abort",()=>{n.abort()}),t.signal=n.signal}return t}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),U(e.candidates[0]))throw new N(`${H(e)}`,e);return function(e){var t,n,o,s;const i=[];if(null===(n=null===(t=e.candidates)||void 0===t?void 0:t[0].content)||void 0===n?void 0:n.parts)for(const r of null===(s=null===(o=e.candidates)||void 0===o?void 0:o[0].content)||void 0===s?void 0:s.parts)r.text&&i.push(r.text),r.executableCode&&i.push("\n```"+r.executableCode.language+"\n"+r.executableCode.code+"\n```\n"),r.codeExecutionResult&&i.push("\n```\n"+r.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}(e)}if(e.promptFeedback)throw new N(`Text not available. ${H(e)}`,e);return""},e.functionCall=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),U(e.candidates[0]))throw new N(`${H(e)}`,e);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),L(e)[0]}if(e.promptFeedback)throw new N(`Function call not available. ${H(e)}`,e)},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),U(e.candidates[0]))throw new N(`${H(e)}`,e);return L(e)}if(e.promptFeedback)throw new N(`Function call not available. ${H(e)}`,e)},e}function L(e){var t,n,o,s;const i=[];if(null===(n=null===(t=e.candidates)||void 0===t?void 0:t[0].content)||void 0===n?void 0:n.parts)for(const r of null===(s=null===(o=e.candidates)||void 0===o?void 0:o[0].content)||void 0===s?void 0:s.parts)r.functionCall&&i.push(r.functionCall);return i.length>0?i:void 0}const F=[C.RECITATION,C.SAFETY,C.LANGUAGE];function U(e){return!!e.finishReason&&F.includes(e.finishReason)}function H(e){var t,n,o;let s="";if(e.candidates&&0!==e.candidates.length||!e.promptFeedback){if(null===(o=e.candidates)||void 0===o?void 0:o[0]){const t=e.candidates[0];U(t)&&(s+=`Candidate was blocked due to ${t.finishReason}`,t.finishMessage&&(s+=`: ${t.finishMessage}`))}}else s+="Response was blocked",(null===(t=e.promptFeedback)||void 0===t?void 0:t.blockReason)&&(s+=` due to ${e.promptFeedback.blockReason}`),(null===(n=e.promptFeedback)||void 0===n?void 0:n.blockReasonMessage)&&(s+=`: ${e.promptFeedback.blockReasonMessage}`);return s}function j(e){return this instanceof j?(this.v=e,this):new j(e)}function k(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o,s=n.apply(e,t||[]),i=[];return o={},r("next"),r("throw"),r("return"),o[Symbol.asyncIterator]=function(){return this},o;function r(e){s[e]&&(o[e]=function(t){return new Promise(function(n,o){i.push([e,t,n,o])>1||a(e,t)})})}function a(e,t){try{(n=s[e](t)).value instanceof j?Promise.resolve(n.value.v).then(c,l):d(i[0][2],n)}catch(o){d(i[0][3],o)}var n}function c(e){a("next",e)}function l(e){a("throw",e)}function d(e,t){e(t),i.shift(),i.length&&a(i[0][0],i[0][1])}}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const K=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function Y(e){const t=function(e){const t=e.getReader();return new ReadableStream({start(e){let n="";return o();function o(){return t.read().then(({value:t,done:s})=>{if(s)return n.trim()?void e.error(new T("Failed to parse stream")):void e.close();n+=t;let i,r=n.match(K);for(;r;){try{i=JSON.parse(r[1])}catch(a){return void e.error(new T(`Error parsing JSON response: "${r[1]}"`))}e.enqueue(i),n=n.substring(r[0].length),r=n.match(K)}return o()})}}})}(e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0}))),[n,o]=t.tee();return{stream:B(n),response:q(o)}}function q(e){return c(this,null,function*(){const t=[],n=e.getReader();for(;;){const{done:e,value:o}=yield n.read();if(e)return G(J(t));t.push(o)}})}function B(e){return k(this,arguments,function*(){const t=e.getReader();for(;;){const{value:e,done:n}=yield j(t.read());if(n)break;yield yield j(G(e))}})}function J(e){const t=e[e.length-1],n={promptFeedback:null==t?void 0:t.promptFeedback};for(const o of e){if(o.candidates)for(const e of o.candidates){const t=e.index;if(n.candidates||(n.candidates=[]),n.candidates[t]||(n.candidates[t]={index:e.index}),n.candidates[t].citationMetadata=e.citationMetadata,n.candidates[t].groundingMetadata=e.groundingMetadata,n.candidates[t].finishReason=e.finishReason,n.candidates[t].finishMessage=e.finishMessage,n.candidates[t].safetyRatings=e.safetyRatings,e.content&&e.content.parts){n.candidates[t].content||(n.candidates[t].content={role:e.content.role||"user",parts:[]});const o={};for(const s of e.content.parts)s.text&&(o.text=s.text),s.functionCall&&(o.functionCall=s.functionCall),s.executableCode&&(o.executableCode=s.executableCode),s.codeExecutionResult&&(o.codeExecutionResult=s.codeExecutionResult),0===Object.keys(o).length&&(o.text=""),n.candidates[t].content.parts.push(o)}}o.usageMetadata&&(n.usageMetadata=o.usageMetadata)}return n}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z(e,t,n,o){return c(this,null,function*(){return Y(yield P(t,w.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(n),o))})}function V(e,t,n,o){return c(this,null,function*(){const s=yield P(t,w.GENERATE_CONTENT,e,!1,JSON.stringify(n),o);return{response:G(yield s.json())}})}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(e){if(null!=e)return"string"==typeof e?{role:"system",parts:[{text:e}]}:e.text?{role:"system",parts:[e]}:e.parts?e.role?e:{role:"system",parts:e.parts}:void 0}function X(e){let t=[];if("string"==typeof e)t=[{text:e}];else for(const n of e)"string"==typeof n?t.push({text:n}):t.push(n);return function(e){const t={role:"user",parts:[]},n={role:"function",parts:[]};let o=!1,s=!1;for(const i of e)"functionResponse"in i?(n.parts.push(i),s=!0):(t.parts.push(i),o=!0);if(o&&s)throw new T("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!o&&!s)throw new T("No content is provided for sending chat message.");if(o)return t;return n}(t)}function Q(e){let t;if(e.contents)t=e;else{t={contents:[X(e)]}}return e.systemInstruction&&(t.systemInstruction=W(e.systemInstruction)),t}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Z=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],ee={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const te="SILENT_ERROR";class ne{constructor(e,t,n,o={}){this.model=t,this.params=n,this._requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,(null==n?void 0:n.history)&&(!function(e){let t=!1;for(const n of e){const{role:e,parts:o}=n;if(!t&&"user"!==e)throw new T(`First content should be with role 'user', got ${e}`);if(!l.includes(e))throw new T(`Each item should include role field. Got ${e} but valid roles are: ${JSON.stringify(l)}`);if(!Array.isArray(o))throw new T("Content should have 'parts' property with an array of Parts");if(0===o.length)throw new T("Each Content should have at least one part");const s={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const t of o)for(const e of Z)e in t&&(s[e]+=1);const i=ee[e];for(const t of Z)if(!i.includes(t)&&s[t]>0)throw new T(`Content with role '${e}' can't contain '${t}' part`);t=!0}}(n.history),this._history=n.history)}getHistory(){return c(this,null,function*(){return yield this._sendPromise,this._history})}sendMessage(e){return c(this,arguments,function*(e,t={}){var n,o,s,i,r,a;yield this._sendPromise;const c=X(e),l={safetySettings:null===(n=this.params)||void 0===n?void 0:n.safetySettings,generationConfig:null===(o=this.params)||void 0===o?void 0:o.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(r=this.params)||void 0===r?void 0:r.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,c]},d=Object.assign(Object.assign({},this._requestOptions),t);let u;return this._sendPromise=this._sendPromise.then(()=>V(this._apiKey,this.model,l,d)).then(e=>{var t;if(e.response.candidates&&e.response.candidates.length>0){this._history.push(c);const n=Object.assign({parts:[],role:"model"},null===(t=e.response.candidates)||void 0===t?void 0:t[0].content);this._history.push(n)}else{const t=H(e.response);t&&console.warn(`sendMessage() was unsuccessful. ${t}. Inspect response object for details.`)}u=e}),yield this._sendPromise,u})}sendMessageStream(e){return c(this,arguments,function*(e,t={}){var n,o,s,i,r,a;yield this._sendPromise;const c=X(e),l={safetySettings:null===(n=this.params)||void 0===n?void 0:n.safetySettings,generationConfig:null===(o=this.params)||void 0===o?void 0:o.generationConfig,tools:null===(s=this.params)||void 0===s?void 0:s.tools,toolConfig:null===(i=this.params)||void 0===i?void 0:i.toolConfig,systemInstruction:null===(r=this.params)||void 0===r?void 0:r.systemInstruction,cachedContent:null===(a=this.params)||void 0===a?void 0:a.cachedContent,contents:[...this._history,c]},d=Object.assign(Object.assign({},this._requestOptions),t),u=z(this._apiKey,this.model,l,d);return this._sendPromise=this._sendPromise.then(()=>u).catch(e=>{throw new Error(te)}).then(e=>e.response).then(e=>{if(e.candidates&&e.candidates.length>0){this._history.push(c);const t=Object.assign({},e.candidates[0].content);t.role||(t.role="model"),this._history.push(t)}else{const t=H(e);t&&console.warn(`sendMessageStream() was unsuccessful. ${t}. Inspect response object for details.`)}}).catch(e=>{e.message!==te&&console.error(e)}),u})}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class oe{constructor(e,t,n={}){this.apiKey=e,this._requestOptions=n,t.model.includes("/")?this.model=t.model:this.model=`models/${t.model}`,this.generationConfig=t.generationConfig||{},this.safetySettings=t.safetySettings||[],this.tools=t.tools,this.toolConfig=t.toolConfig,this.systemInstruction=W(t.systemInstruction),this.cachedContent=t.cachedContent}generateContent(e){return c(this,arguments,function*(e,t={}){var n;const o=Q(e),s=Object.assign(Object.assign({},this._requestOptions),t);return V(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(n=this.cachedContent)||void 0===n?void 0:n.name},o),s)})}generateContentStream(e){return c(this,arguments,function*(e,t={}){var n;const o=Q(e),s=Object.assign(Object.assign({},this._requestOptions),t);return z(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(n=this.cachedContent)||void 0===n?void 0:n.name},o),s)})}startChat(e){var t;return new ne(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:null===(t=this.cachedContent)||void 0===t?void 0:t.name},e),this._requestOptions)}countTokens(e){return c(this,arguments,function*(e,t={}){const n=function(e,t){var n;let o={model:null==t?void 0:t.model,generationConfig:null==t?void 0:t.generationConfig,safetySettings:null==t?void 0:t.safetySettings,tools:null==t?void 0:t.tools,toolConfig:null==t?void 0:t.toolConfig,systemInstruction:null==t?void 0:t.systemInstruction,cachedContent:null===(n=null==t?void 0:t.cachedContent)||void 0===n?void 0:n.name,contents:[]};const s=null!=e.generateContentRequest;if(e.contents){if(s)throw new S("CountTokensRequest must have one of contents or generateContentRequest, not both.");o.contents=e.contents}else if(s)o=Object.assign(Object.assign({},o),e.generateContentRequest);else{const t=X(e);o.contents=[t]}return{generateContentRequest:o}}(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),o=Object.assign(Object.assign({},this._requestOptions),t);return function(e,t,n,o){return c(this,null,function*(){return(yield P(t,w.COUNT_TOKENS,e,!1,JSON.stringify(n),o)).json()})}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this.apiKey,this.model,n,o)})}embedContent(e){return c(this,arguments,function*(e,t={}){const n=function(e){if("string"==typeof e||Array.isArray(e))return{content:X(e)};return e}(e),o=Object.assign(Object.assign({},this._requestOptions),t);return function(e,t,n,o){return c(this,null,function*(){return(yield P(t,w.EMBED_CONTENT,e,!1,JSON.stringify(n),o)).json()})}(this.apiKey,this.model,n,o)})}batchEmbedContents(e){return c(this,arguments,function*(e,t={}){const n=Object.assign(Object.assign({},this._requestOptions),t);return function(e,t,n,o){return c(this,null,function*(){const s=n.requests.map(e=>Object.assign(Object.assign({},e),{model:t}));return(yield P(t,w.BATCH_EMBED_CONTENTS,e,!1,JSON.stringify({requests:s}),o)).json()})}(this.apiKey,this.model,e,n)})}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const se="AIzaSyARZyERqMaFInsbRKUA0NxOok77syBNzK8";console.log("Gemini API Key loaded:",`${se.substring(0,10)}...`);const ie=new class{constructor(e){this.apiKey=e}getGenerativeModel(e,t){if(!e.model)throw new T("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new oe(this.apiKey,e,t)}getGenerativeModelFromCachedContent(e,t,n){if(!e.name)throw new S("Cached content must contain a `name` field.");if(!e.model)throw new S("Cached content must contain a `model` field.");const o=["model","systemInstruction"];for(const i of o)if((null==t?void 0:t[i])&&e[i]&&(null==t?void 0:t[i])!==e[i]){if("model"===i){if((t.model.startsWith("models/")?t.model.replace("models/",""):t.model)===(e.model.startsWith("models/")?e.model.replace("models/",""):e.model))continue}throw new S(`Different value for "${i}" specified in modelParams (${t[i]}) and cachedContent (${e[i]})`)}const s=Object.assign(Object.assign({},t),{model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e});return new oe(this.apiKey,s,n)}}(se);const re=new class{constructor(){if(a(this,"model"),a(this,"systemPrompt","You are an advanced medical education AI assistant. You help medical students, residents, and healthcare professionals learn and understand complex medical concepts. \n\nYour responses should be:\n- Accurate and evidence-based\n- Clear and educational\n- Contextually aware of the user's current study material\n- Professional yet approachable\n- Include relevant medical terminology with explanations\n\nAlways cite specific page numbers or chapters when referencing material from books the user is studying."),ie&&se)try{this.model=ie.getGenerativeModel({model:"gemini-2.5-flash"}),console.log("Gemini model initialized successfully")}catch(e){console.error("Failed to initialize Gemini model:",e),this.model=null}else console.warn("Gemini AI not initialized: Missing API key")}generateResponse(e,t,n){return c(this,null,function*(){try{if(!this.model)throw new Error("Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.");const o=this.buildContextPrompt(t,n),s=`${this.systemPrompt}\n\n${o}\n\nUser Query: ${e}`,i=yield this.model.generateContent(s),r=(yield i.response).text()||"",a=this.extractRelatedConcepts(r),c=this.extractReferences(r,t.bookId);return{id:this.generateId(),query:e,response:r,context:t,timestamp:new Date,relatedConcepts:a,references:c,confidence:.95}}catch(o){throw console.error("Error generating AI response:",o),new Error("Failed to generate AI response")}})}generateQuizQuestions(e,t,n=5){return c(this,null,function*(){try{if(!this.model)return[];const o=`Generate ${n} multiple-choice questions about ${e} in medicine. \n      Difficulty level: ${t}\n      \n      Format each question as JSON with:\n      - question: the question text\n      - options: array of 4 possible answers\n      - correctAnswer: index of correct option (0-3)\n      - explanation: detailed explanation of the answer\n      - relatedConcepts: array of related medical concepts\n      \n      Return only valid JSON array.`,s=yield this.model.generateContent(o),i=(yield s.response).text()||"[]";return JSON.parse(i)}catch(o){return console.error("Error generating quiz questions:",o),[]}})}summarizeChapter(e,t){return c(this,null,function*(){try{if(!this.model)throw new Error("Gemini API key not configured");const n=`Summarize the following medical chapter "${t}" in a clear, structured format:\n      \n      ${e}\n      \n      Include:\n      1. Key concepts\n      2. Important definitions\n      3. Clinical relevance\n      4. Study tips`,o=yield this.model.generateContent(n);return(yield o.response).text()||""}catch(n){throw console.error("Error summarizing chapter:",n),new Error("Failed to summarize chapter")}})}explainConcept(e,t){return c(this,null,function*(){try{if(!this.model)throw new Error("Gemini API key not configured");const n=`Explain the medical concept "${e}" for a ${t}.\n      \n      Include:\n      - Definition\n      - Clinical significance\n      - Common examples\n      - Related concepts\n      - Memory aids or mnemonics if applicable`,o=yield this.model.generateContent(n);return(yield o.response).text()||""}catch(n){throw console.error("Error explaining concept:",n),new Error("Failed to explain concept")}})}buildContextPrompt(e,t){let n=`Current context:\n    - Studying from book ID: ${e.bookId}\n    - User level: ${e.userLevel}`;return e.currentPage&&(n+=`\n- Currently on page: ${e.currentPage}`),e.currentChapter&&(n+=`\n- Current chapter: ${e.currentChapter}`),e.recentTopics.length>0&&(n+=`\n- Recent topics studied: ${e.recentTopics.join(", ")}`),t&&(n+=`\n\nRelevant book content:\n${t}`),n}extractRelatedConcepts(e){const t=[];return(e.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g)||[]).forEach(e=>{e.length>4&&!t.includes(e)&&t.push(e)}),t.slice(0,5)}extractReferences(e,t){const n=[];return(e.match(/page\s+(\d+)/gi)||[]).forEach(o=>{const s=parseInt(o.replace(/page\s+/i,""));n.push({bookId:t,page:s,excerpt:e.substring(e.indexOf(o)-50,e.indexOf(o)+50)})}),n}generateId(){return`ai-${Date.now()}-${Math.random().toString(36).substr(2,9)}`}};export{re as m};
