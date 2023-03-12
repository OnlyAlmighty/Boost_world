var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$1(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$1(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isArray$1(a);
  bValidType = isArray$1(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray$1(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => val instanceof Date;
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = this.parent;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger$1(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  for (const effect of isArray$1(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger$1(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger$1(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger$1(target, "delete", key, void 0);
  }
  return result;
}
function has$1(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys$2(target) {
  track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has: has$1,
  ownKeys: ownKeys$2
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v2) => Reflect.getPrototypeOf(v2);
function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "get", key);
  }
  !isReadonly2 && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "has", key);
  }
  !isReadonly2 && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger$1(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger$1(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger$1(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger$1(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger$1(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done: done2 } = innerIterator.next();
        return done2 ? { value, done: done2 } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done: done2
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
Promise.resolve();
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start2 = flushIndex + 1;
  let end3 = queue.length;
  while (start2 < end3) {
    const middle = start2 + end3 >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start2 = middle + 1 : end3 = middle;
  }
  return start2;
}
function queueJob(job) {
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index) {
  if (!isArray$1(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen, parentJob);
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen);
  queue.sort((a, b) => getId(a) - getId(b));
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function emit$1(instance, event, ...rawArgs) {
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => a.trim());
    } else if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, null);
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  cache.set(comp, normalized);
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs: attrs2, emit, render: render3, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render3.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs2;
    } else {
      const render4 = Component;
      if (false)
        ;
      result = normalizeVNode(render4.length > 1 ? render4(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs2;
        },
        slots,
        emit
      } : { attrs: attrs2, slots, emit }) : render4(props, null));
      fallthroughAttrs = Component.props ? attrs2 : getFunctionalFallthrough(attrs2);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment$1);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs2) => {
  let res;
  for (const key in attrs2) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs2[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs2, props) => {
  const res = {};
  for (const key in attrs2) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs2[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide$1(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides7 = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides7) {
      provides7 = currentInstance.provides = Object.create(parentProvides);
    }
    provides7[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides7 = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides7 && key in provides7) {
      return provides7[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some(isReactive);
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction$1(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i) => hasChanged(v2, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        job();
      }
    };
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path2) {
  const segments = path2.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v2) => {
      traverse(v2, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children2 = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children2 || !children2.length) {
        return;
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      const child = children2[0];
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment$1 && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment$1) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const hooks8 = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done2 = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks8.delayedLeave) {
          hooks8.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        hook(el, done2);
        if (hook.length <= 1) {
          done2();
        }
      } else {
        done2();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done2 = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        onLeave(el, done2);
        if (onLeave.length <= 1) {
          done2();
        }
      } else {
        done2();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks8;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks8) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks8);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks8.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks8.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks8;
  }
}
function getTransitionRawChildren(children2, keepComment = false) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children2.length; i++) {
    const child = children2[i];
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
    } else if (keepComment || child.type !== Comment$1) {
      ret.push(child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction$1(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks8 = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks8.unshift(wrappedHook);
    } else {
      hooks8.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render3,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v2) => c.value = v2
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides7 = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides7).forEach((key) => {
      provide$1(key, provides7[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render3 && instance.render === NOOP) {
    instance.render = render3;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v2) => injected.value = v2
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$1(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  cache.set(base, resolved);
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction$1(to) ? to.call(this, this) : to, isFunction$1(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs2 = {};
  def(attrs2, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs2);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs2;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs2;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs: attrs2, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs2, key)) {
            if (value !== attrs2[key]) {
              attrs2[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs2[key]) {
            attrs2[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs2)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs2 !== rawCurrentProps) {
      for (const key in attrs2) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs2[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger$1(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs2) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs2) || value !== attrs2[key]) {
          attrs2[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache.set(comp, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction$1(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children2) => {
  const normalized = normalizeSlotValue(children2);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children2) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children2._;
    if (type) {
      instance.slots = toRaw(children2);
      def(children2, "_", type);
    } else {
      normalizeObjectSlots(children2, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children2) {
      normalizeVNodeSlots(instance, children2);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children2, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children2._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children2);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children2.$stable;
      normalizeObjectSlots(children2, slots);
    }
    deletionComparisonTarget = children2;
  } else if (children2) {
    normalizeVNodeSlots(instance, children2);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction$1(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid = 0;
function createAppAPI(render3, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v2) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction$1(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render3(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render3(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      }
    };
    return app2;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString$1(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$1(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString$1(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (isRef(ref2)) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container2, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container2, anchor);
        break;
      case Comment$1:
        processCommentNode(n1, n2, container2, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container2, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container2, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container2, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container2, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container2, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container2, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container2, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container2, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container2, nextSibling);
      el = next;
    }
    hostInsert(anchor, container2, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container2, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start2 = 0) => {
    for (let i = start2; i < children2.length; i++) {
      const child = children2[i] = optimized ? cloneIfMounted(children2[i]) : normalizeVNode(children2[i]);
      patch(null, child, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container2 = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container2, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container2, anchor);
      hostInsert(fragmentEndAnchor, container2, anchor);
      mountChildren(n2.children, container2, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container2, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container2, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container2, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container2, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container2, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment$1);
        processCommentNode(null, placeholder, container2, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container2, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.component = n1.component;
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container2, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(() => !instance.isUnmounted && hydrateSubTree());
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container2, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container2 = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(instance.update), instance.scope);
    const update2 = instance.update = effect.run.bind(effect);
    update2.id = instance.uid;
    toggleRecurse(instance, true);
    update2();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container2, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container2, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container2, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container2, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container2, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container2, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container2, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container2, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container2, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children: children2, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container2, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container2, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container2, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container2, anchor);
      for (let i = 0; i < children2.length; i++) {
        move(children2[i], container2, anchor, moveType);
      }
      hostInsert(vnode.anchor, container2, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container2, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container2, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container2, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container2, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children: children2, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children2, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      removeFragment(el, anchor);
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end3) => {
    let next;
    while (cur !== end3) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end3);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update: update2, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update2) {
      update2.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children2, parentComponent, parentSuspense, doRemove = false, optimized = false, start2 = 0) => {
    for (let i = start2; i < children2.length; i++) {
      unmount(children2[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render3 = (vnode, container2, isSVG) => {
    if (vnode == null) {
      if (container2._vnode) {
        unmount(container2._vnode, null, null, true);
      }
    } else {
      patch(container2._vnode || null, vnode, container2, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container2._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render: render3,
    hydrate,
    createApp: createAppAPI(render3, hydrate)
  };
}
function toggleRecurse({ effect, update: update2 }, allowed) {
  effect.allowRecurse = update2.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v2, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v2 = result.length - 1;
      while (u < v2) {
        c = u + v2 >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v2 = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v2 = result[u - 1];
  while (u-- > 0) {
    result[u] = v2;
    v2 = p2[v2];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString$1(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container2, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
    const disabled2 = isTeleportDisabled(n2.props);
    let { shapeFlag, children: children2, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container2, anchor);
      insert(mainAnchor, container2, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      }
      const mount = (container3, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(children2, container3, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      if (disabled2) {
        mount(container2, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container2 : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }
      if (disabled2) {
        if (!wasDisabled) {
          moveTeleport(n2, container2, mainAnchor, internals, 1);
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0);
          }
        } else if (wasDisabled) {
          moveTeleport(n2, target, targetAnchor, internals, 1);
        }
      }
    }
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children: children2, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children2.length; i++) {
          const child = children2[i];
          unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container2, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container2, parentAnchor);
  }
  const { el, anchor, shapeFlag, children: children2, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container2, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children2.length; i++) {
        move(children2[i], container2, parentAnchor, 2);
      }
    }
  }
  if (isReorder) {
    insert(anchor, container2, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
  const target = vnode.target = resolveTarget(vnode.props, querySelector);
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
      }
      target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
    }
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString$1(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry2, name) {
  return registry2 && (registry2[name] || registry2[camelize(name)] || registry2[capitalize(camelize(name))]);
}
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment$1 = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children2, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children2, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children2, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children2, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString$1(ref2) || isRef(ref2) || isFunction$1(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children2 = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children: children2,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children2);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children2) {
    vnode.shapeFlag |= isString$1(children2) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children2 = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment$1;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children2) {
      normalizeChildren(cloned, children2);
    }
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString$1(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString$1(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction$1(type) ? 2 : 0;
  return createBaseVNode(type, props, children2, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children: children2 } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray$1(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children: children2,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text2 = " ", flag = 0) {
  return createVNode(Text, null, text2, flag);
}
function createCommentVNode(text2 = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment$1, null, text2)) : createVNode(Comment$1, null, text2);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment$1);
  } else if (isArray$1(child)) {
    return createVNode(Fragment, null, child.slice());
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children2) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children2 == null) {
    children2 = null;
  } else if (isArray$1(children2)) {
    type = 16;
  } else if (typeof children2 === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children2.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children2._;
      if (!slotFlag && !(InternalObjectKey in children2)) {
        children2._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children2._ = 1;
        } else {
          children2._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$1(children2)) {
    children2 = { default: children2, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children2 = String(children2);
    if (shapeFlag & 64) {
      type = 16;
      children2 = [createTextVNode(children2)];
    } else {
      type = 8;
    }
  }
  vnode.children = children2;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray$1(source) || isString$1(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE) {
    return createVNode("slot", name === "default" ? null : { name }, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, { key: props.key || `_${name}` }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment$1)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = extend(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => () => queueJob(i.update),
  $nextTick: (i) => nextTick.bind(i.proxy),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      this.set(target, key, descriptor.get(), null);
    } else if (descriptor.value != null) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children: children2 } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children2);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup: setup4 } = Component;
  if (setup4) {
    const setupContext = instance.setupContext = setup4.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup4, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs2;
  {
    return {
      get attrs() {
        return attrs2 || (attrs2 = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
function getComponentName(Component) {
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h$1(type, propsOrChildren, children2) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children2 = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children2)) {
      children2 = [children2];
    }
    return createVNode(type, propsOrChildren, children2);
  }
}
const version = "3.2.31";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text2) => doc.createTextNode(text2),
  createComment: (text2) => doc.createComment(text2),
  setText: (node, text2) => {
    node.nodeValue = text2;
  },
  setElementText: (el, text2) => {
    el.textContent = text2;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start2, end3) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start2 && (start2 === end3 || start2.nextSibling)) {
      while (true) {
        parent.insertBefore(start2.cloneNode(true), anchor);
        if (start2 === end3 || !(start2 = start2.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString$1(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString$1(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v2) => setStyle(style, name, v2));
  } else {
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      el[key] = includeBooleanAttr(value);
      return;
    } else if (value == null && type === "string") {
      el[key] = "";
      el.removeAttribute(key);
      return;
    } else if (type === "number") {
      try {
        el[key] = 0;
      } catch (_a2) {
      }
      el.removeAttribute(key);
      return;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
}
let _getNow = Date.now;
let skipTimestampCheck = false;
if (typeof window !== "undefined") {
  if (_getNow() > document.createEvent("Event").timeStamp) {
    _getNow = () => performance.now();
  }
  const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
  skipTimestampCheck = !!(ffMatch && Number(ffMatch[1]) <= 53);
}
let cachedNow = 0;
const p$1 = Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p$1.then(reset), cachedNow = _getNow());
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name.slice(2)), options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString$1(value)) {
    return false;
  }
  return key in el;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h$1(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done2) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done2 && done2();
  };
  const finishLeave = (el, done2) => {
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done2 && done2();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done2) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done2);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done2) {
      const resolve2 = () => finishLeave(el, done2);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end3 = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end3();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end3();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles2 = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles2[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles2[TRANSITION + "Property"]);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d2, i) => toMs(d2) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"];
  return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    trigger(target, "input");
  }
}
function trigger(el, type) {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      } else if (castToNumber) {
        domValue = toNumber(domValue);
      }
      el._assign(domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    el._assign = getModelAssigner(vnode);
    if (el.composing)
      return;
    if (document.activeElement === el) {
      if (lazy) {
        return;
      }
      if (trim && el.value.trim() === value) {
        return;
      }
      if ((number || el.type === "number") && toNumber(el.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el.value !== newValue) {
      el.value = newValue;
    }
  }
};
const vModelCheckbox = {
  deep: true,
  created(el, _, vnode) {
    el._assign = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue$1(el);
      const checked = el.checked;
      const assign2 = el._assign;
      if (isArray$1(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el._assign = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  if (isArray$1(value)) {
    el.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    el.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el.checked = looseEqual(value, getCheckboxValue(el, true));
  }
}
function getValue$1(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const rendererOptions = extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container2 = normalizeContainer(containerOrSelector);
    if (!container2)
      return;
    const component = app2._component;
    if (!isFunction$1(component) && !component.render && !component.template) {
      component.template = container2.innerHTML;
    }
    container2.innerHTML = "";
    const proxy = mount(container2, false, container2 instanceof SVGElement);
    if (container2 instanceof Element) {
      container2.removeAttribute("v-cloak");
      container2.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function normalizeContainer(container2) {
  if (isString$1(container2)) {
    const res = document.querySelector(container2);
    return res;
  }
  return container2;
}
function T(t, n, ...u) {
  if (t in n) {
    let o = n[t];
    return typeof o == "function" ? o(...u) : o;
  }
  let e = new Error(`Tried to handle "${t}" but there is no handler defined. Only defined handlers are: ${Object.keys(n).map((o) => `"${o}"`).join(", ")}.`);
  throw Error.captureStackTrace && Error.captureStackTrace(e, T), e;
}
function x(_a2) {
  var _b = _a2, { visible: t = true, features: n = 0 } = _b, u = __objRest(_b, ["visible", "features"]);
  var e;
  if (t || n & 2 && u.props.static)
    return Se(u);
  if (n & 1) {
    let o = ((e = u.props.unmount) != null ? e : true) ? 0 : 1;
    return T(o, { [0]() {
      return null;
    }, [1]() {
      return Se(__spreadProps(__spreadValues({}, u), { props: __spreadProps(__spreadValues({}, u.props), { hidden: true, style: { display: "none" } }) }));
    } });
  }
  return Se(u);
}
function Se({ props: t, attrs: n, slots: u, slot: e, name: o }) {
  var a;
  let _a2 = L(t, ["unmount", "static"]), { as: r } = _a2, s = __objRest(_a2, ["as"]), d2 = (a = u.default) == null ? void 0 : a.call(u, e);
  if (r === "template") {
    if (Object.keys(s).length > 0 || Object.keys(n).length > 0) {
      let [i, ...l] = d2 != null ? d2 : [];
      if (!co(i) || l.length > 0)
        throw new Error(['Passing props on "template"!', "", `The current component <${o} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(s).concat(Object.keys(n)).map((c) => `  - ${c}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((c) => `  - ${c}`).join(`
`)].join(`
`));
      return cloneVNode(i, s);
    }
    return Array.isArray(d2) && d2.length === 1 ? d2[0] : d2;
  }
  return h$1(r, s, d2);
}
function L(t, n = []) {
  let u = Object.assign({}, t);
  for (let e of n)
    e in u && delete u[e];
  return u;
}
function co(t) {
  return t == null ? false : typeof t.type == "string" || typeof t.type == "object" || typeof t.type == "function";
}
var mo$1 = 0;
function vo() {
  return ++mo$1;
}
function h() {
  return vo();
}
function bo(t) {
  throw new Error("Unexpected object: " + t);
}
function J(t, n) {
  let u = n.resolveItems();
  if (u.length <= 0)
    return null;
  let e = n.resolveActiveIndex(), o = e != null ? e : -1, r = (() => {
    switch (t.focus) {
      case 0:
        return u.findIndex((s) => !n.resolveDisabled(s));
      case 1: {
        let s = u.slice().reverse().findIndex((d2, a, i) => o !== -1 && i.length - a - 1 >= o ? false : !n.resolveDisabled(d2));
        return s === -1 ? s : u.length - 1 - s;
      }
      case 2:
        return u.findIndex((s, d2) => d2 <= o ? false : !n.resolveDisabled(s));
      case 3: {
        let s = u.slice().reverse().findIndex((d2) => !n.resolveDisabled(d2));
        return s === -1 ? s : u.length - 1 - s;
      }
      case 4:
        return u.findIndex((s) => n.resolveId(s) === t.id);
      case 5:
        return null;
      default:
        bo(t);
    }
  })();
  return r === -1 ? e : r;
}
function v(t) {
  return t == null || t.value == null ? null : "$el" in t.value ? t.value.$el : t.value;
}
function C(t, n, u) {
  typeof window != "undefined" && watchEffect((e) => {
    window.addEventListener(t, n, u), e(() => {
      window.removeEventListener(t, n, u);
    });
  });
}
var at = Symbol("Context");
function it() {
  return I() !== null;
}
function I() {
  return inject(at, null);
}
function M(t) {
  provide$1(at, t);
}
function ut(t, n) {
  if (t)
    return t;
  let u = n != null ? n : "button";
  if (typeof u == "string" && u.toLowerCase() === "button")
    return "button";
}
function P(t, n) {
  let u = ref(ut(t.value.type, t.value.as));
  return onMounted(() => {
    u.value = ut(t.value.type, t.value.as);
  }), watchEffect(() => {
    var e;
    u.value || !v(n) || v(n) instanceof HTMLButtonElement && !((e = v(n)) == null ? void 0 : e.hasAttribute("type")) && (u.value = "button");
  }), u;
}
function Y({ container: t, accept: n, walk: u, enabled: e }) {
  watchEffect(() => {
    let o = t.value;
    if (!o || e !== void 0 && !e.value)
      return;
    let r = Object.assign((d2) => n(d2), { acceptNode: n }), s = document.createTreeWalker(o, NodeFilter.SHOW_ELEMENT, r, false);
    for (; s.nextNode(); )
      u(s.currentNode);
  });
}
var ct = Symbol("ComboboxContext");
function ee(t) {
  let n = inject(ct, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <Combobox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, ee), u;
  }
  return n;
}
defineComponent({ name: "Combobox", emits: { "update:modelValue": (t) => true }, props: { as: { type: [Object, String], default: "template" }, disabled: { type: [Boolean], default: false }, modelValue: { type: [Object, String, Number, Boolean] } }, setup(t, { slots: n, attrs: u, emit: e }) {
  let o = ref(1), r = ref(null), s = ref(null), d2 = ref(null), a = ref(null), i = ref({ static: false, hold: false }), l = ref([]), c = ref(null), p2 = computed(() => t.modelValue), f = { comboboxState: o, value: p2, inputRef: s, labelRef: r, buttonRef: d2, optionsRef: a, disabled: computed(() => t.disabled), options: l, activeOptionIndex: c, inputPropsRef: ref({ displayValue: void 0 }), optionsPropsRef: i, closeCombobox() {
    t.disabled || o.value !== 1 && (o.value = 1, c.value = null);
  }, openCombobox() {
    t.disabled || o.value !== 0 && (o.value = 0);
  }, goToOption(m, g) {
    if (t.disabled || a.value && !i.value.static && o.value === 1)
      return;
    let S = J(m === 4 ? { focus: 4, id: g } : { focus: m }, { resolveItems: () => l.value, resolveActiveIndex: () => c.value, resolveId: (y) => y.id, resolveDisabled: (y) => y.dataRef.disabled });
    c.value !== S && (c.value = S);
  }, syncInputValue() {
    let m = f.value.value;
    if (!v(f.inputRef) || m === void 0)
      return;
    let g = f.inputPropsRef.value.displayValue;
    typeof g == "function" ? f.inputRef.value.value = g(m) : typeof m == "string" && (f.inputRef.value.value = m);
  }, selectOption(m) {
    let g = l.value.find((y) => y.id === m);
    if (!g)
      return;
    let { dataRef: S } = g;
    e("update:modelValue", S.value), f.syncInputValue();
  }, selectActiveOption() {
    if (c.value === null)
      return;
    let { dataRef: m } = l.value[c.value];
    e("update:modelValue", m.value), f.syncInputValue();
  }, registerOption(m, g) {
    var R, E;
    let S = c.value !== null ? l.value[c.value] : null, y = Array.from((E = (R = a.value) == null ? void 0 : R.querySelectorAll('[id^="headlessui-combobox-option-"]')) != null ? E : []).reduce((D, w2, F) => Object.assign(D, { [w2.id]: F }), {});
    l.value = [...l.value, { id: m, dataRef: g }].sort((D, w2) => y[D.id] - y[w2.id]), c.value = (() => S === null ? null : l.value.indexOf(S))();
  }, unregisterOption(m) {
    let g = l.value.slice(), S = c.value !== null ? g[c.value] : null, y = g.findIndex((R) => R.id === m);
    y !== -1 && g.splice(y, 1), l.value = g, c.value = (() => y === c.value || S === null ? null : g.indexOf(S))();
  } };
  C("mousedown", (m) => {
    var S, y, R;
    let g = m.target;
    o.value === 0 && (((S = v(s)) == null ? void 0 : S.contains(g)) || ((y = v(d2)) == null ? void 0 : y.contains(g)) || ((R = v(a)) == null ? void 0 : R.contains(g)) || f.closeCombobox());
  }), watch([f.value, f.inputRef], () => f.syncInputValue(), { immediate: true }), provide$1(ct, f), M(computed(() => T(o.value, { [0]: 0, [1]: 1 })));
  let b = computed(() => c.value === null ? null : l.value[c.value].dataRef.value);
  return () => {
    let m = { open: o.value === 0, disabled: t.disabled, activeIndex: c.value, activeOption: b.value };
    return x({ props: L(t, ["modelValue", "onUpdate:modelValue", "disabled"]), slot: m, slots: n, attrs: u, name: "Combobox" });
  };
} });
defineComponent({ name: "ComboboxLabel", props: { as: { type: [Object, String], default: "label" } }, setup(t, { attrs: n, slots: u }) {
  let e = ee("ComboboxLabel"), o = `headlessui-combobox-label-${h()}`;
  function r() {
    var s;
    (s = v(e.inputRef)) == null || s.focus({ preventScroll: true });
  }
  return () => {
    let s = { open: e.comboboxState.value === 0, disabled: e.disabled.value }, d2 = { id: o, ref: e.labelRef, onClick: r };
    return x({ props: __spreadValues(__spreadValues({}, t), d2), slot: s, attrs: n, slots: u, name: "ComboboxLabel" });
  };
} });
defineComponent({ name: "ComboboxButton", props: { as: { type: [Object, String], default: "button" } }, setup(t, { attrs: n, slots: u }) {
  let e = ee("ComboboxButton"), o = `headlessui-combobox-button-${h()}`;
  function r(a) {
    e.disabled.value || (e.comboboxState.value === 0 ? e.closeCombobox() : (a.preventDefault(), e.openCombobox()), nextTick(() => {
      var i;
      return (i = v(e.inputRef)) == null ? void 0 : i.focus({ preventScroll: true });
    }));
  }
  function s(a) {
    switch (a.key) {
      case "ArrowDown":
        a.preventDefault(), a.stopPropagation(), e.comboboxState.value === 1 && (e.openCombobox(), nextTick(() => {
          e.value.value || e.goToOption(0);
        })), nextTick(() => {
          var i;
          return (i = e.inputRef.value) == null ? void 0 : i.focus({ preventScroll: true });
        });
        return;
      case "ArrowUp":
        a.preventDefault(), a.stopPropagation(), e.comboboxState.value === 1 && (e.openCombobox(), nextTick(() => {
          e.value.value || e.goToOption(3);
        })), nextTick(() => {
          var i;
          return (i = e.inputRef.value) == null ? void 0 : i.focus({ preventScroll: true });
        });
        return;
      case "Escape":
        a.preventDefault(), e.optionsRef.value && !e.optionsPropsRef.value.static && a.stopPropagation(), e.closeCombobox(), nextTick(() => {
          var i;
          return (i = e.inputRef.value) == null ? void 0 : i.focus({ preventScroll: true });
        });
        return;
    }
  }
  let d2 = P(computed(() => ({ as: t.as, type: n.type })), e.buttonRef);
  return () => {
    var l, c;
    let a = { open: e.comboboxState.value === 0, disabled: e.disabled.value }, i = { ref: e.buttonRef, id: o, type: d2.value, tabindex: "-1", "aria-haspopup": true, "aria-controls": (l = v(e.optionsRef)) == null ? void 0 : l.id, "aria-expanded": e.disabled.value ? void 0 : e.comboboxState.value === 0, "aria-labelledby": e.labelRef.value ? [(c = v(e.labelRef)) == null ? void 0 : c.id, o].join(" ") : void 0, disabled: e.disabled.value === true ? true : void 0, onKeydown: s, onClick: r };
    return x({ props: __spreadValues(__spreadValues({}, t), i), slot: a, attrs: n, slots: u, name: "ComboboxButton" });
  };
} });
defineComponent({ name: "ComboboxInput", props: { as: { type: [Object, String], default: "input" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, displayValue: { type: Function } }, emits: { change: (t) => true }, setup(t, { emit: n, attrs: u, slots: e }) {
  let o = ee("ComboboxInput"), r = `headlessui-combobox-input-${h()}`;
  o.inputPropsRef = computed(() => t);
  function s(a) {
    switch (a.key) {
      case "Enter":
        a.preventDefault(), a.stopPropagation(), o.selectActiveOption(), o.closeCombobox();
        break;
      case "ArrowDown":
        return a.preventDefault(), a.stopPropagation(), T(o.comboboxState.value, { [0]: () => o.goToOption(2), [1]: () => {
          o.openCombobox(), nextTick(() => {
            o.value.value || o.goToOption(0);
          });
        } });
      case "ArrowUp":
        return a.preventDefault(), a.stopPropagation(), T(o.comboboxState.value, { [0]: () => o.goToOption(1), [1]: () => {
          o.openCombobox(), nextTick(() => {
            o.value.value || o.goToOption(3);
          });
        } });
      case "Home":
      case "PageUp":
        return a.preventDefault(), a.stopPropagation(), o.goToOption(0);
      case "End":
      case "PageDown":
        return a.preventDefault(), a.stopPropagation(), o.goToOption(3);
      case "Escape":
        a.preventDefault(), o.optionsRef.value && !o.optionsPropsRef.value.static && a.stopPropagation(), o.closeCombobox();
        break;
      case "Tab":
        o.selectActiveOption(), o.closeCombobox();
        break;
    }
  }
  function d2(a) {
    o.openCombobox(), n("change", a);
  }
  return () => {
    var c, p2, f, b, m;
    let a = { open: o.comboboxState.value === 0 }, i = { "aria-controls": (c = o.optionsRef.value) == null ? void 0 : c.id, "aria-expanded": o.disabled ? void 0 : o.comboboxState.value === 0, "aria-activedescendant": o.activeOptionIndex.value === null || (p2 = o.options.value[o.activeOptionIndex.value]) == null ? void 0 : p2.id, "aria-labelledby": (m = (f = v(o.labelRef)) == null ? void 0 : f.id) != null ? m : (b = v(o.buttonRef)) == null ? void 0 : b.id, id: r, onKeydown: s, onChange: d2, onInput: d2, role: "combobox", type: "text", tabIndex: 0, ref: o.inputRef }, l = L(t, ["displayValue"]);
    return x({ props: __spreadValues(__spreadValues({}, l), i), slot: a, attrs: u, slots: e, features: 1 | 2, name: "ComboboxInput" });
  };
} });
defineComponent({ name: "ComboboxOptions", props: { as: { type: [Object, String], default: "ul" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, hold: { type: [Boolean], default: false } }, setup(t, { attrs: n, slots: u }) {
  let e = ee("ComboboxOptions"), o = `headlessui-combobox-options-${h()}`;
  watchEffect(() => {
    e.optionsPropsRef.value.static = t.static;
  }), watchEffect(() => {
    e.optionsPropsRef.value.hold = t.hold;
  });
  let r = I(), s = computed(() => r !== null ? r.value === 0 : e.comboboxState.value === 0);
  return Y({ container: computed(() => v(e.optionsRef)), enabled: computed(() => e.comboboxState.value === 0), accept(d2) {
    return d2.getAttribute("role") === "option" ? NodeFilter.FILTER_REJECT : d2.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(d2) {
    d2.setAttribute("role", "none");
  } }), () => {
    var l, c, p2, f;
    let d2 = { open: e.comboboxState.value === 0 }, a = { "aria-activedescendant": e.activeOptionIndex.value === null || (l = e.options.value[e.activeOptionIndex.value]) == null ? void 0 : l.id, "aria-labelledby": (f = (c = v(e.labelRef)) == null ? void 0 : c.id) != null ? f : (p2 = v(e.buttonRef)) == null ? void 0 : p2.id, id: o, ref: e.optionsRef, role: "listbox" }, i = L(t, ["hold"]);
    return x({ props: __spreadValues(__spreadValues({}, i), a), slot: d2, attrs: n, slots: u, features: 1 | 2, visible: s.value, name: "ComboboxOptions" });
  };
} });
defineComponent({ name: "ComboboxOption", props: { as: { type: [Object, String], default: "li" }, value: { type: [Object, String, Number, Boolean] }, disabled: { type: Boolean, default: false } }, setup(t, { slots: n, attrs: u }) {
  let e = ee("ComboboxOption"), o = `headlessui-combobox-option-${h()}`, r = computed(() => e.activeOptionIndex.value !== null ? e.options.value[e.activeOptionIndex.value].id === o : false), s = computed(() => toRaw(e.value.value) === toRaw(t.value)), d2 = computed(() => ({ disabled: t.disabled, value: t.value }));
  onMounted(() => e.registerOption(o, d2)), onUnmounted(() => e.unregisterOption(o)), onMounted(() => {
    watch([e.comboboxState, s], () => {
      e.comboboxState.value === 0 && (!s.value || e.goToOption(4, o));
    }, { immediate: true });
  }), watchEffect(() => {
    e.comboboxState.value === 0 && (!r.value || nextTick(() => {
      var p2, f;
      return (f = (p2 = document.getElementById(o)) == null ? void 0 : p2.scrollIntoView) == null ? void 0 : f.call(p2, { block: "nearest" });
    }));
  });
  function a(p2) {
    if (t.disabled)
      return p2.preventDefault();
    e.selectOption(o), e.closeCombobox(), nextTick(() => {
      var f;
      return (f = v(e.inputRef)) == null ? void 0 : f.focus({ preventScroll: true });
    });
  }
  function i() {
    if (t.disabled)
      return e.goToOption(5);
    e.goToOption(4, o);
  }
  function l() {
    t.disabled || r.value || e.goToOption(4, o);
  }
  function c() {
    t.disabled || !r.value || e.optionsPropsRef.value.hold || e.goToOption(5);
  }
  return () => {
    let { disabled: p2 } = t, f = { active: r.value, selected: s.value, disabled: p2 }, b = { id: o, role: "option", tabIndex: p2 === true ? void 0 : -1, "aria-disabled": p2 === true ? true : void 0, "aria-selected": s.value === true ? s.value : void 0, disabled: void 0, onClick: a, onFocus: i, onPointermove: l, onMousemove: l, onPointerleave: c, onMouseleave: c };
    return x({ props: __spreadValues(__spreadValues({}, t), b), slot: f, attrs: u, slots: n, name: "ComboboxOption" });
  };
} });
var Ke = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((t) => `${t}:not([tabindex='-1'])`).join(",");
function ae(t = document.body) {
  return t == null ? [] : Array.from(t.querySelectorAll(Ke));
}
function mt(t, n = 0) {
  return t === document.body ? false : T(n, { [0]() {
    return t.matches(Ke);
  }, [1]() {
    let u = t;
    for (; u !== null; ) {
      if (u.matches(Ke))
        return true;
      u = u.parentElement;
    }
    return false;
  } });
}
function te(t) {
  t == null || t.focus({ preventScroll: true });
}
function O(t, n) {
  let u = Array.isArray(t) ? t.slice().sort((l, c) => {
    let p2 = l.compareDocumentPosition(c);
    return p2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : p2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  }) : ae(t), e = document.activeElement, o = (() => {
    if (n & (1 | 4))
      return 1;
    if (n & (2 | 8))
      return -1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), r = (() => {
    if (n & 1)
      return 0;
    if (n & 2)
      return Math.max(0, u.indexOf(e)) - 1;
    if (n & 4)
      return Math.max(0, u.indexOf(e)) + 1;
    if (n & 8)
      return u.length - 1;
    throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
  })(), s = n & 32 ? { preventScroll: true } : {}, d2 = 0, a = u.length, i;
  do {
    if (d2 >= a || d2 + a <= 0)
      return 0;
    let l = r + d2;
    if (n & 16)
      l = (l + a) % a;
    else {
      if (l < 0)
        return 3;
      if (l >= a)
        return 1;
    }
    i = u[l], i == null || i.focus(s), d2 += o;
  } while (i !== document.activeElement);
  return i.hasAttribute("tabindex") || i.setAttribute("tabindex", "0"), 2;
}
function ie(t, n) {
  for (let u of t)
    if (u.contains(n))
      return true;
  return false;
}
function Re(t, n = ref(true), u = ref({})) {
  let e = ref(typeof window != "undefined" ? document.activeElement : null), o = ref(null);
  function r() {
    if (!n.value || t.value.size !== 1)
      return;
    let { initialFocus: d2 } = u.value, a = document.activeElement;
    if (d2) {
      if (d2 === a)
        return;
    } else if (ie(t.value, a))
      return;
    if (e.value = a, d2)
      te(d2);
    else {
      let i = false;
      for (let l of t.value)
        if (O(l, 1) === 2) {
          i = true;
          break;
        }
      i || console.warn("There are no focusable elements inside the <FocusTrap />");
    }
    o.value = document.activeElement;
  }
  function s() {
    te(e.value), e.value = null, o.value = null;
  }
  watchEffect(r), onUpdated(() => {
    n.value ? r() : s();
  }), onUnmounted(s), C("keydown", (d2) => {
    if (!!n.value && d2.key === "Tab" && !!document.activeElement && t.value.size === 1) {
      d2.preventDefault();
      for (let a of t.value)
        if (O(a, (d2.shiftKey ? 2 : 4) | 16) === 2) {
          o.value = document.activeElement;
          break;
        }
    }
  }), C("focus", (d2) => {
    if (!n.value || t.value.size !== 1)
      return;
    let a = o.value;
    if (!a)
      return;
    let i = d2.target;
    i && i instanceof HTMLElement ? ie(t.value, i) ? (o.value = i, te(i)) : (d2.preventDefault(), d2.stopPropagation(), te(a)) : te(o.value);
  }, true);
}
var bt = "body > *", oe = /* @__PURE__ */ new Set(), K = /* @__PURE__ */ new Map();
function gt(t) {
  t.setAttribute("aria-hidden", "true"), t.inert = true;
}
function xt(t) {
  let n = K.get(t);
  !n || (n["aria-hidden"] === null ? t.removeAttribute("aria-hidden") : t.setAttribute("aria-hidden", n["aria-hidden"]), t.inert = n.inert);
}
function yt(t, n = ref(true)) {
  watchEffect((u) => {
    if (!n.value || !t.value)
      return;
    let e = t.value;
    oe.add(e);
    for (let o of K.keys())
      o.contains(e) && (xt(o), K.delete(o));
    document.querySelectorAll(bt).forEach((o) => {
      if (o instanceof HTMLElement) {
        for (let r of oe)
          if (o.contains(r))
            return;
        oe.size === 1 && (K.set(o, { "aria-hidden": o.getAttribute("aria-hidden"), inert: o.inert }), gt(o));
      }
    }), u(() => {
      if (oe.delete(e), oe.size > 0)
        document.querySelectorAll(bt).forEach((o) => {
          if (o instanceof HTMLElement && !K.has(o)) {
            for (let r of oe)
              if (o.contains(r))
                return;
            K.set(o, { "aria-hidden": o.getAttribute("aria-hidden"), inert: o.inert }), gt(o);
          }
        });
      else
        for (let o of K.keys())
          xt(o), K.delete(o);
    });
  });
}
var St = Symbol("StackContext");
function ht() {
  return inject(St, () => {
  });
}
function Rt(t) {
  let n = ht();
  watchEffect((u) => {
    let e = t == null ? void 0 : t.value;
    !e || (n(0, e), u(() => n(1, e)));
  });
}
function Te(t) {
  let n = ht();
  function u(...e) {
    t == null || t(...e), n(...e);
  }
  provide$1(St, u);
}
var Tt = Symbol("ForcePortalRootContext");
function Ot() {
  return inject(Tt, false);
}
var Ne = defineComponent({ name: "ForcePortalRoot", props: { as: { type: [Object, String], default: "template" }, force: { type: Boolean, default: false } }, setup(t, { slots: n, attrs: u }) {
  return provide$1(Tt, t.force), () => {
    let _a2 = t, { force: e } = _a2, o = __objRest(_a2, ["force"]);
    return x({ props: o, slot: {}, slots: n, attrs: u, name: "ForcePortalRoot" });
  };
} });
function It() {
  let t = document.getElementById("headlessui-portal-root");
  if (t)
    return t;
  let n = document.createElement("div");
  return n.setAttribute("id", "headlessui-portal-root"), document.body.appendChild(n);
}
var Pt = defineComponent({ name: "Portal", props: { as: { type: [Object, String], default: "div" } }, setup(t, { slots: n, attrs: u }) {
  let e = Ot(), o = inject(Dt, null), r = ref(e === true || o === null ? It() : o.resolveTarget());
  watchEffect(() => {
    e || o !== null && (r.value = o.resolveTarget());
  });
  let s = ref(null);
  return Rt(s), onUnmounted(() => {
    var a;
    let d2 = document.getElementById("headlessui-portal-root");
    !d2 || r.value === d2 && r.value.children.length <= 0 && ((a = r.value.parentElement) == null || a.removeChild(r.value));
  }), Te(), () => {
    if (r.value === null)
      return null;
    let d2 = { ref: s };
    return h$1(Teleport, { to: r.value }, x({ props: __spreadValues(__spreadValues({}, t), d2), slot: {}, attrs: u, slots: n, name: "Portal" }));
  };
} }), Dt = Symbol("PortalGroupContext"), wt = defineComponent({ name: "PortalGroup", props: { as: { type: [Object, String], default: "template" }, target: { type: Object, default: null } }, setup(t, { attrs: n, slots: u }) {
  let e = reactive({ resolveTarget() {
    return t.target;
  } });
  return provide$1(Dt, e), () => {
    let _a2 = t, { target: o } = _a2, r = __objRest(_a2, ["target"]);
    return x({ props: r, slot: {}, attrs: n, slots: u, name: "PortalGroup" });
  };
} });
var Lt = Symbol("DescriptionContext");
function Xo() {
  let t = inject(Lt, null);
  if (t === null)
    throw new Error("Missing parent");
  return t;
}
function G({ slot: t = ref({}), name: n = "Description", props: u = {} } = {}) {
  let e = ref([]);
  function o(r) {
    return e.value.push(r), () => {
      let s = e.value.indexOf(r);
      s !== -1 && e.value.splice(s, 1);
    };
  }
  return provide$1(Lt, { register: o, slot: t, name: n, props: u }), computed(() => e.value.length > 0 ? e.value.join(" ") : void 0);
}
var ne = defineComponent({ name: "Description", props: { as: { type: [Object, String], default: "p" } }, setup(t, { attrs: n, slots: u }) {
  let e = Xo(), o = `headlessui-description-${h()}`;
  return onMounted(() => onUnmounted(e.register(o))), () => {
    let { name: r = "Description", slot: s = ref({}), props: d2 = {} } = e, a = t, i = __spreadProps(__spreadValues({}, Object.entries(d2).reduce((l, [c, p2]) => Object.assign(l, { [c]: unref(p2) }), {})), { id: o });
    return x({ props: __spreadValues(__spreadValues({}, a), i), slot: s.value, attrs: n, slots: u, name: r });
  };
} });
var kt = Symbol("DialogContext");
function $e(t) {
  let n = inject(kt, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <Dialog /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, $e), u;
  }
  return n;
}
var Ee = "DC8F892D-2EBD-447C-A4C8-A03058436FF4", Gr = defineComponent({ name: "Dialog", inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, open: { type: [Boolean, String], default: Ee }, initialFocus: { type: Object, default: null } }, emits: { close: (t) => true }, setup(t, { emit: n, attrs: u, slots: e }) {
  let o = ref(/* @__PURE__ */ new Set()), r = I(), s = computed(() => t.open === Ee && r !== null ? T(r.value, { [0]: true, [1]: false }) : t.open);
  if (!(t.open !== Ee || r !== null))
    throw new Error("You forgot to provide an `open` prop to the `Dialog`.");
  if (typeof s.value != "boolean")
    throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${s.value === Ee ? void 0 : t.open}`);
  let a = computed(() => t.open ? 0 : 1), i = computed(() => r !== null ? r.value === 0 : a.value === 0), l = ref(null), c = ref(a.value === 0);
  onUpdated(() => {
    c.value = a.value === 0;
  });
  let p2 = `headlessui-dialog-${h()}`, f = computed(() => ({ initialFocus: t.initialFocus }));
  Re(o, c, f), yt(l, c), Te((y, R) => T(y, { [0]() {
    o.value.add(R);
  }, [1]() {
    o.value.delete(R);
  } }));
  let b = G({ name: "DialogDescription", slot: computed(() => ({ open: s.value })) }), m = ref(null), g = { titleId: m, dialogState: a, setTitleId(y) {
    m.value !== y && (m.value = y);
  }, close() {
    n("close", false);
  } };
  provide$1(kt, g), C("mousedown", (y) => {
    let R = y.target;
    a.value === 0 && o.value.size === 1 && (ie(o.value, R) || (g.close(), nextTick(() => R == null ? void 0 : R.focus())));
  }), C("keydown", (y) => {
    y.key === "Escape" && a.value === 0 && (o.value.size > 1 || (y.preventDefault(), y.stopPropagation(), g.close()));
  }), watchEffect((y) => {
    if (a.value !== 0)
      return;
    let R = document.documentElement.style.overflow, E = document.documentElement.style.paddingRight, D = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${D}px`, y(() => {
      document.documentElement.style.overflow = R, document.documentElement.style.paddingRight = E;
    });
  }), watchEffect((y) => {
    if (a.value !== 0)
      return;
    let R = v(l);
    if (!R)
      return;
    let E = new IntersectionObserver((D) => {
      for (let w2 of D)
        w2.boundingClientRect.x === 0 && w2.boundingClientRect.y === 0 && w2.boundingClientRect.width === 0 && w2.boundingClientRect.height === 0 && g.close();
    });
    E.observe(R), y(() => E.disconnect());
  });
  function S(y) {
    y.stopPropagation();
  }
  return () => {
    let y = __spreadProps(__spreadValues({}, u), { ref: l, id: p2, role: "dialog", "aria-modal": a.value === 0 ? true : void 0, "aria-labelledby": m.value, "aria-describedby": b.value, onClick: S }), _a2 = t, { open: R, initialFocus: E } = _a2, D = __objRest(_a2, ["open", "initialFocus"]), w2 = { open: a.value === 0 };
    return h$1(Ne, { force: true }, () => h$1(Pt, () => h$1(wt, { target: l.value }, () => h$1(Ne, { force: false }, () => x({ props: __spreadValues(__spreadValues({}, D), y), slot: w2, attrs: u, slots: e, visible: i.value, features: 1 | 2, name: "Dialog" })))));
  };
} }), _r = defineComponent({ name: "DialogOverlay", props: { as: { type: [Object, String], default: "div" } }, setup(t, { attrs: n, slots: u }) {
  let e = $e("DialogOverlay"), o = `headlessui-dialog-overlay-${h()}`;
  function r(s) {
    s.target === s.currentTarget && (s.preventDefault(), s.stopPropagation(), e.close());
  }
  return () => x({ props: __spreadValues(__spreadValues({}, t), { id: o, "aria-hidden": true, onClick: r }), slot: { open: e.dialogState.value === 0 }, attrs: n, slots: u, name: "DialogOverlay" });
} }), qr = defineComponent({ name: "DialogTitle", props: { as: { type: [Object, String], default: "h2" } }, setup(t, { attrs: n, slots: u }) {
  let e = $e("DialogTitle"), o = `headlessui-dialog-title-${h()}`;
  return onMounted(() => {
    e.setTitleId(o), onUnmounted(() => e.setTitleId(null));
  }), () => x({ props: __spreadValues(__spreadValues({}, t), { id: o }), slot: { open: e.dialogState.value === 0 }, attrs: n, slots: u, name: "DialogTitle" });
} });
var At = Symbol("DisclosureContext");
function qe(t) {
  let n = inject(At, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <Disclosure /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, qe), u;
  }
  return n;
}
var Ht = Symbol("DisclosurePanelContext");
function an() {
  return inject(Ht, null);
}
defineComponent({ name: "Disclosure", props: { as: { type: [Object, String], default: "template" }, defaultOpen: { type: [Boolean], default: false } }, setup(t, { slots: n, attrs: u }) {
  let e = `headlessui-disclosure-button-${h()}`, o = `headlessui-disclosure-panel-${h()}`, r = ref(t.defaultOpen ? 0 : 1), s = ref(null), d2 = ref(null), a = { buttonId: e, panelId: o, disclosureState: r, panel: s, button: d2, toggleDisclosure() {
    r.value = T(r.value, { [0]: 1, [1]: 0 });
  }, closeDisclosure() {
    r.value !== 1 && (r.value = 1);
  }, close(i) {
    a.closeDisclosure();
    let l = (() => i ? i instanceof HTMLElement ? i : i.value instanceof HTMLElement ? v(i) : v(a.button) : v(a.button))();
    l == null || l.focus();
  } };
  return provide$1(At, a), M(computed(() => T(r.value, { [0]: 0, [1]: 1 }))), () => {
    let _a2 = t, { defaultOpen: i } = _a2, l = __objRest(_a2, ["defaultOpen"]), c = { open: r.value === 0, close: a.close };
    return x({ props: l, slot: c, slots: n, attrs: u, name: "Disclosure" });
  };
} });
defineComponent({ name: "DisclosureButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, setup(t, { attrs: n, slots: u }) {
  let e = qe("DisclosureButton"), o = an(), r = o === null ? false : o === e.panelId, s = ref(null);
  r || watchEffect(() => {
    e.button.value = s.value;
  });
  let d2 = P(computed(() => ({ as: t.as, type: n.type })), s);
  function a() {
    var c;
    t.disabled || (r ? (e.toggleDisclosure(), (c = v(e.button)) == null || c.focus()) : e.toggleDisclosure());
  }
  function i(c) {
    var p2;
    if (!t.disabled)
      if (r)
        switch (c.key) {
          case " ":
          case "Enter":
            c.preventDefault(), c.stopPropagation(), e.toggleDisclosure(), (p2 = v(e.button)) == null || p2.focus();
            break;
        }
      else
        switch (c.key) {
          case " ":
          case "Enter":
            c.preventDefault(), c.stopPropagation(), e.toggleDisclosure();
            break;
        }
  }
  function l(c) {
    switch (c.key) {
      case " ":
        c.preventDefault();
        break;
    }
  }
  return () => {
    let c = { open: e.disclosureState.value === 0 }, p2 = r ? { ref: s, type: d2.value, onClick: a, onKeydown: i } : { id: e.buttonId, ref: s, type: d2.value, "aria-expanded": t.disabled ? void 0 : e.disclosureState.value === 0, "aria-controls": v(e.panel) ? e.panelId : void 0, disabled: t.disabled ? true : void 0, onClick: a, onKeydown: i, onKeyup: l };
    return x({ props: __spreadValues(__spreadValues({}, t), p2), slot: c, attrs: n, slots: u, name: "DisclosureButton" });
  };
} });
defineComponent({ name: "DisclosurePanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(t, { attrs: n, slots: u }) {
  let e = qe("DisclosurePanel");
  provide$1(Ht, e.panelId);
  let o = I(), r = computed(() => o !== null ? o.value === 0 : e.disclosureState.value === 0);
  return () => {
    let s = { open: e.disclosureState.value === 0, close: e.close }, d2 = { id: e.panelId, ref: e.panel };
    return x({ props: __spreadValues(__spreadValues({}, t), d2), slot: s, attrs: n, slots: u, features: 1 | 2, visible: r.value, name: "DisclosurePanel" });
  };
} });
defineComponent({ name: "FocusTrap", props: { as: { type: [Object, String], default: "div" }, initialFocus: { type: Object, default: null } }, setup(t, { attrs: n, slots: u }) {
  let e = ref(/* @__PURE__ */ new Set()), o = ref(null), r = ref(true), s = computed(() => ({ initialFocus: t.initialFocus }));
  return onMounted(() => {
    !o.value || (e.value.add(o.value), Re(e, r, s));
  }), onUnmounted(() => {
    r.value = false;
  }), () => {
    let d2 = {}, a = { ref: o }, _a2 = t, { initialFocus: i } = _a2, l = __objRest(_a2, ["initialFocus"]);
    return x({ props: __spreadValues(__spreadValues({}, l), a), slot: d2, attrs: n, slots: u, name: "FocusTrap" });
  };
} });
function gn(t) {
  requestAnimationFrame(() => requestAnimationFrame(t));
}
var Kt = Symbol("ListboxContext");
function pe(t) {
  let n = inject(Kt, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <Listbox /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, pe), u;
  }
  return n;
}
defineComponent({ name: "Listbox", emits: { "update:modelValue": (t) => true }, props: { as: { type: [Object, String], default: "template" }, disabled: { type: [Boolean], default: false }, horizontal: { type: [Boolean], default: false }, modelValue: { type: [Object, String, Number, Boolean] } }, setup(t, { slots: n, attrs: u, emit: e }) {
  let o = ref(1), r = ref(null), s = ref(null), d2 = ref(null), a = ref([]), i = ref(""), l = ref(null), c = computed(() => t.modelValue), p2 = { listboxState: o, value: c, orientation: computed(() => t.horizontal ? "horizontal" : "vertical"), labelRef: r, buttonRef: s, optionsRef: d2, disabled: computed(() => t.disabled), options: a, searchQuery: i, activeOptionIndex: l, closeListbox() {
    t.disabled || o.value !== 1 && (o.value = 1, l.value = null);
  }, openListbox() {
    t.disabled || o.value !== 0 && (o.value = 0);
  }, goToOption(f, b) {
    if (t.disabled || o.value === 1)
      return;
    let m = J(f === 4 ? { focus: 4, id: b } : { focus: f }, { resolveItems: () => a.value, resolveActiveIndex: () => l.value, resolveId: (g) => g.id, resolveDisabled: (g) => g.dataRef.disabled });
    i.value === "" && l.value === m || (i.value = "", l.value = m);
  }, search(f) {
    if (t.disabled || o.value === 1)
      return;
    let m = i.value !== "" ? 0 : 1;
    i.value += f.toLowerCase();
    let S = (l.value !== null ? a.value.slice(l.value + m).concat(a.value.slice(0, l.value + m)) : a.value).find((R) => R.dataRef.textValue.startsWith(i.value) && !R.dataRef.disabled), y = S ? a.value.indexOf(S) : -1;
    y === -1 || y === l.value || (l.value = y);
  }, clearSearch() {
    t.disabled || o.value !== 1 && i.value !== "" && (i.value = "");
  }, registerOption(f, b) {
    var g, S;
    let m = Array.from((S = (g = d2.value) == null ? void 0 : g.querySelectorAll('[id^="headlessui-listbox-option-"]')) != null ? S : []).reduce((y, R, E) => Object.assign(y, { [R.id]: E }), {});
    a.value = [...a.value, { id: f, dataRef: b }].sort((y, R) => m[y.id] - m[R.id]);
  }, unregisterOption(f) {
    let b = a.value.slice(), m = l.value !== null ? b[l.value] : null, g = b.findIndex((S) => S.id === f);
    g !== -1 && b.splice(g, 1), a.value = b, l.value = (() => g === l.value || m === null ? null : b.indexOf(m))();
  }, select(f) {
    t.disabled || e("update:modelValue", f);
  } };
  return C("mousedown", (f) => {
    var g, S, y;
    let b = f.target, m = document.activeElement;
    o.value === 0 && (((g = v(s)) == null ? void 0 : g.contains(b)) || (((S = v(d2)) == null ? void 0 : S.contains(b)) || p2.closeListbox(), !(m !== document.body && (m == null ? void 0 : m.contains(b))) && (f.defaultPrevented || (y = v(s)) == null || y.focus({ preventScroll: true }))));
  }), provide$1(Kt, p2), M(computed(() => T(o.value, { [0]: 0, [1]: 1 }))), () => {
    let f = { open: o.value === 0, disabled: t.disabled };
    return x({ props: L(t, ["modelValue", "onUpdate:modelValue", "disabled", "horizontal"]), slot: f, slots: n, attrs: u, name: "Listbox" });
  };
} });
defineComponent({ name: "ListboxLabel", props: { as: { type: [Object, String], default: "label" } }, setup(t, { attrs: n, slots: u }) {
  let e = pe("ListboxLabel"), o = `headlessui-listbox-label-${h()}`;
  function r() {
    var s;
    (s = v(e.buttonRef)) == null || s.focus({ preventScroll: true });
  }
  return () => {
    let s = { open: e.listboxState.value === 0, disabled: e.disabled.value }, d2 = { id: o, ref: e.labelRef, onClick: r };
    return x({ props: __spreadValues(__spreadValues({}, t), d2), slot: s, attrs: n, slots: u, name: "ListboxLabel" });
  };
} });
defineComponent({ name: "ListboxButton", props: { as: { type: [Object, String], default: "button" } }, setup(t, { attrs: n, slots: u }) {
  let e = pe("ListboxButton"), o = `headlessui-listbox-button-${h()}`;
  function r(i) {
    switch (i.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
        i.preventDefault(), e.openListbox(), nextTick(() => {
          var l;
          (l = v(e.optionsRef)) == null || l.focus({ preventScroll: true }), e.value.value || e.goToOption(0);
        });
        break;
      case "ArrowUp":
        i.preventDefault(), e.openListbox(), nextTick(() => {
          var l;
          (l = v(e.optionsRef)) == null || l.focus({ preventScroll: true }), e.value.value || e.goToOption(3);
        });
        break;
    }
  }
  function s(i) {
    switch (i.key) {
      case " ":
        i.preventDefault();
        break;
    }
  }
  function d2(i) {
    e.disabled.value || (e.listboxState.value === 0 ? (e.closeListbox(), nextTick(() => {
      var l;
      return (l = v(e.buttonRef)) == null ? void 0 : l.focus({ preventScroll: true });
    })) : (i.preventDefault(), e.openListbox(), gn(() => {
      var l;
      return (l = v(e.optionsRef)) == null ? void 0 : l.focus({ preventScroll: true });
    })));
  }
  let a = P(computed(() => ({ as: t.as, type: n.type })), e.buttonRef);
  return () => {
    var c, p2;
    let i = { open: e.listboxState.value === 0, disabled: e.disabled.value }, l = { ref: e.buttonRef, id: o, type: a.value, "aria-haspopup": true, "aria-controls": (c = v(e.optionsRef)) == null ? void 0 : c.id, "aria-expanded": e.disabled.value ? void 0 : e.listboxState.value === 0, "aria-labelledby": e.labelRef.value ? [(p2 = v(e.labelRef)) == null ? void 0 : p2.id, o].join(" ") : void 0, disabled: e.disabled.value === true ? true : void 0, onKeydown: r, onKeyup: s, onClick: d2 };
    return x({ props: __spreadValues(__spreadValues({}, t), l), slot: i, attrs: n, slots: u, name: "ListboxButton" });
  };
} });
defineComponent({ name: "ListboxOptions", props: { as: { type: [Object, String], default: "ul" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(t, { attrs: n, slots: u }) {
  let e = pe("ListboxOptions"), o = `headlessui-listbox-options-${h()}`, r = ref(null);
  function s(i) {
    switch (r.value && clearTimeout(r.value), i.key) {
      case " ":
        if (e.searchQuery.value !== "")
          return i.preventDefault(), i.stopPropagation(), e.search(i.key);
      case "Enter":
        if (i.preventDefault(), i.stopPropagation(), e.activeOptionIndex.value !== null) {
          let { dataRef: l } = e.options.value[e.activeOptionIndex.value];
          e.select(l.value);
        }
        e.closeListbox(), nextTick(() => {
          var l;
          return (l = v(e.buttonRef)) == null ? void 0 : l.focus({ preventScroll: true });
        });
        break;
      case T(e.orientation.value, { vertical: "ArrowDown", horizontal: "ArrowRight" }):
        return i.preventDefault(), i.stopPropagation(), e.goToOption(2);
      case T(e.orientation.value, { vertical: "ArrowUp", horizontal: "ArrowLeft" }):
        return i.preventDefault(), i.stopPropagation(), e.goToOption(1);
      case "Home":
      case "PageUp":
        return i.preventDefault(), i.stopPropagation(), e.goToOption(0);
      case "End":
      case "PageDown":
        return i.preventDefault(), i.stopPropagation(), e.goToOption(3);
      case "Escape":
        i.preventDefault(), i.stopPropagation(), e.closeListbox(), nextTick(() => {
          var l;
          return (l = v(e.buttonRef)) == null ? void 0 : l.focus({ preventScroll: true });
        });
        break;
      case "Tab":
        i.preventDefault(), i.stopPropagation();
        break;
      default:
        i.key.length === 1 && (e.search(i.key), r.value = setTimeout(() => e.clearSearch(), 350));
        break;
    }
  }
  let d2 = I(), a = computed(() => d2 !== null ? d2.value === 0 : e.listboxState.value === 0);
  return () => {
    var p2, f, b, m;
    let i = { open: e.listboxState.value === 0 }, l = { "aria-activedescendant": e.activeOptionIndex.value === null || (p2 = e.options.value[e.activeOptionIndex.value]) == null ? void 0 : p2.id, "aria-labelledby": (m = (f = v(e.labelRef)) == null ? void 0 : f.id) != null ? m : (b = v(e.buttonRef)) == null ? void 0 : b.id, "aria-orientation": e.orientation.value, id: o, onKeydown: s, role: "listbox", tabIndex: 0, ref: e.optionsRef };
    return x({ props: __spreadValues(__spreadValues({}, t), l), slot: i, attrs: n, slots: u, features: 1 | 2, visible: a.value, name: "ListboxOptions" });
  };
} });
defineComponent({ name: "ListboxOption", props: { as: { type: [Object, String], default: "li" }, value: { type: [Object, String, Number, Boolean] }, disabled: { type: Boolean, default: false } }, setup(t, { slots: n, attrs: u }) {
  let e = pe("ListboxOption"), o = `headlessui-listbox-option-${h()}`, r = computed(() => e.activeOptionIndex.value !== null ? e.options.value[e.activeOptionIndex.value].id === o : false), s = computed(() => toRaw(e.value.value) === toRaw(t.value)), d2 = ref({ disabled: t.disabled, value: t.value, textValue: "" });
  onMounted(() => {
    var f, b;
    let p2 = (b = (f = document.getElementById(o)) == null ? void 0 : f.textContent) == null ? void 0 : b.toLowerCase().trim();
    p2 !== void 0 && (d2.value.textValue = p2);
  }), onMounted(() => e.registerOption(o, d2)), onUnmounted(() => e.unregisterOption(o)), onMounted(() => {
    watch([e.listboxState, s], () => {
      var p2, f;
      e.listboxState.value === 0 && (!s.value || (e.goToOption(4, o), (f = (p2 = document.getElementById(o)) == null ? void 0 : p2.focus) == null || f.call(p2)));
    }, { immediate: true });
  }), watchEffect(() => {
    e.listboxState.value === 0 && (!r.value || nextTick(() => {
      var p2, f;
      return (f = (p2 = document.getElementById(o)) == null ? void 0 : p2.scrollIntoView) == null ? void 0 : f.call(p2, { block: "nearest" });
    }));
  });
  function a(p2) {
    if (t.disabled)
      return p2.preventDefault();
    e.select(t.value), e.closeListbox(), nextTick(() => {
      var f;
      return (f = v(e.buttonRef)) == null ? void 0 : f.focus({ preventScroll: true });
    });
  }
  function i() {
    if (t.disabled)
      return e.goToOption(5);
    e.goToOption(4, o);
  }
  function l() {
    t.disabled || r.value || e.goToOption(4, o);
  }
  function c() {
    t.disabled || !r.value || e.goToOption(5);
  }
  return () => {
    let { disabled: p2 } = t, f = { active: r.value, selected: s.value, disabled: p2 }, b = { id: o, role: "option", tabIndex: p2 === true ? void 0 : -1, "aria-disabled": p2 === true ? true : void 0, "aria-selected": s.value === true ? s.value : void 0, disabled: void 0, onClick: a, onFocus: i, onPointermove: l, onMousemove: l, onPointerleave: c, onMouseleave: c };
    return x({ props: __spreadValues(__spreadValues({}, t), b), slot: f, attrs: u, slots: n, name: "ListboxOption" });
  };
} });
function Rn(t) {
  requestAnimationFrame(() => requestAnimationFrame(t));
}
var Nt = Symbol("MenuContext");
function De(t) {
  let n = inject(Nt, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <Menu /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, De), u;
  }
  return n;
}
defineComponent({ name: "Menu", props: { as: { type: [Object, String], default: "template" } }, setup(t, { slots: n, attrs: u }) {
  let e = ref(1), o = ref(null), r = ref(null), s = ref([]), d2 = ref(""), a = ref(null), i = { menuState: e, buttonRef: o, itemsRef: r, items: s, searchQuery: d2, activeItemIndex: a, closeMenu: () => {
    e.value = 1, a.value = null;
  }, openMenu: () => e.value = 0, goToItem(l, c) {
    let p2 = J(l === 4 ? { focus: 4, id: c } : { focus: l }, { resolveItems: () => s.value, resolveActiveIndex: () => a.value, resolveId: (f) => f.id, resolveDisabled: (f) => f.dataRef.disabled });
    d2.value === "" && a.value === p2 || (d2.value = "", a.value = p2);
  }, search(l) {
    let p2 = d2.value !== "" ? 0 : 1;
    d2.value += l.toLowerCase();
    let b = (a.value !== null ? s.value.slice(a.value + p2).concat(s.value.slice(0, a.value + p2)) : s.value).find((g) => g.dataRef.textValue.startsWith(d2.value) && !g.dataRef.disabled), m = b ? s.value.indexOf(b) : -1;
    m === -1 || m === a.value || (a.value = m);
  }, clearSearch() {
    d2.value = "";
  }, registerItem(l, c) {
    var f, b;
    let p2 = Array.from((b = (f = r.value) == null ? void 0 : f.querySelectorAll('[id^="headlessui-menu-item-"]')) != null ? b : []).reduce((m, g, S) => Object.assign(m, { [g.id]: S }), {});
    s.value = [...s.value, { id: l, dataRef: c }].sort((m, g) => p2[m.id] - p2[g.id]);
  }, unregisterItem(l) {
    let c = s.value.slice(), p2 = a.value !== null ? c[a.value] : null, f = c.findIndex((b) => b.id === l);
    f !== -1 && c.splice(f, 1), s.value = c, a.value = (() => f === a.value || p2 === null ? null : c.indexOf(p2))();
  } };
  return C("mousedown", (l) => {
    var f, b, m;
    let c = l.target, p2 = document.activeElement;
    e.value === 0 && (((f = v(o)) == null ? void 0 : f.contains(c)) || (((b = v(r)) == null ? void 0 : b.contains(c)) || i.closeMenu(), !(p2 !== document.body && (p2 == null ? void 0 : p2.contains(c))) && (l.defaultPrevented || (m = v(o)) == null || m.focus({ preventScroll: true }))));
  }), provide$1(Nt, i), M(computed(() => T(e.value, { [0]: 0, [1]: 1 }))), () => {
    let l = { open: e.value === 0 };
    return x({ props: t, slot: l, slots: n, attrs: u, name: "Menu" });
  };
} });
defineComponent({ name: "MenuButton", props: { disabled: { type: Boolean, default: false }, as: { type: [Object, String], default: "button" } }, setup(t, { attrs: n, slots: u }) {
  let e = De("MenuButton"), o = `headlessui-menu-button-${h()}`;
  function r(i) {
    switch (i.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
        i.preventDefault(), i.stopPropagation(), e.openMenu(), nextTick(() => {
          var l;
          (l = v(e.itemsRef)) == null || l.focus({ preventScroll: true }), e.goToItem(0);
        });
        break;
      case "ArrowUp":
        i.preventDefault(), i.stopPropagation(), e.openMenu(), nextTick(() => {
          var l;
          (l = v(e.itemsRef)) == null || l.focus({ preventScroll: true }), e.goToItem(3);
        });
        break;
    }
  }
  function s(i) {
    switch (i.key) {
      case " ":
        i.preventDefault();
        break;
    }
  }
  function d2(i) {
    t.disabled || (e.menuState.value === 0 ? (e.closeMenu(), nextTick(() => {
      var l;
      return (l = v(e.buttonRef)) == null ? void 0 : l.focus({ preventScroll: true });
    })) : (i.preventDefault(), i.stopPropagation(), e.openMenu(), Rn(() => {
      var l;
      return (l = v(e.itemsRef)) == null ? void 0 : l.focus({ preventScroll: true });
    })));
  }
  let a = P(computed(() => ({ as: t.as, type: n.type })), e.buttonRef);
  return () => {
    var c;
    let i = { open: e.menuState.value === 0 }, l = { ref: e.buttonRef, id: o, type: a.value, "aria-haspopup": true, "aria-controls": (c = v(e.itemsRef)) == null ? void 0 : c.id, "aria-expanded": t.disabled ? void 0 : e.menuState.value === 0, onKeydown: r, onKeyup: s, onClick: d2 };
    return x({ props: __spreadValues(__spreadValues({}, t), l), slot: i, attrs: n, slots: u, name: "MenuButton" });
  };
} });
defineComponent({ name: "MenuItems", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(t, { attrs: n, slots: u }) {
  let e = De("MenuItems"), o = `headlessui-menu-items-${h()}`, r = ref(null);
  Y({ container: computed(() => v(e.itemsRef)), enabled: computed(() => e.menuState.value === 0), accept(l) {
    return l.getAttribute("role") === "menuitem" ? NodeFilter.FILTER_REJECT : l.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(l) {
    l.setAttribute("role", "none");
  } });
  function s(l) {
    var c;
    switch (r.value && clearTimeout(r.value), l.key) {
      case " ":
        if (e.searchQuery.value !== "")
          return l.preventDefault(), l.stopPropagation(), e.search(l.key);
      case "Enter":
        if (l.preventDefault(), l.stopPropagation(), e.activeItemIndex.value !== null) {
          let { id: p2 } = e.items.value[e.activeItemIndex.value];
          (c = document.getElementById(p2)) == null || c.click();
        }
        e.closeMenu(), nextTick(() => {
          var p2;
          return (p2 = v(e.buttonRef)) == null ? void 0 : p2.focus({ preventScroll: true });
        });
        break;
      case "ArrowDown":
        return l.preventDefault(), l.stopPropagation(), e.goToItem(2);
      case "ArrowUp":
        return l.preventDefault(), l.stopPropagation(), e.goToItem(1);
      case "Home":
      case "PageUp":
        return l.preventDefault(), l.stopPropagation(), e.goToItem(0);
      case "End":
      case "PageDown":
        return l.preventDefault(), l.stopPropagation(), e.goToItem(3);
      case "Escape":
        l.preventDefault(), l.stopPropagation(), e.closeMenu(), nextTick(() => {
          var p2;
          return (p2 = v(e.buttonRef)) == null ? void 0 : p2.focus({ preventScroll: true });
        });
        break;
      case "Tab":
        l.preventDefault(), l.stopPropagation();
        break;
      default:
        l.key.length === 1 && (e.search(l.key), r.value = setTimeout(() => e.clearSearch(), 350));
        break;
    }
  }
  function d2(l) {
    switch (l.key) {
      case " ":
        l.preventDefault();
        break;
    }
  }
  let a = I(), i = computed(() => a !== null ? a.value === 0 : e.menuState.value === 0);
  return () => {
    var f, b;
    let l = { open: e.menuState.value === 0 }, c = { "aria-activedescendant": e.activeItemIndex.value === null || (f = e.items.value[e.activeItemIndex.value]) == null ? void 0 : f.id, "aria-labelledby": (b = v(e.buttonRef)) == null ? void 0 : b.id, id: o, onKeydown: s, onKeyup: d2, role: "menu", tabIndex: 0, ref: e.itemsRef };
    return x({ props: __spreadValues(__spreadValues({}, t), c), slot: l, attrs: n, slots: u, features: 1 | 2, visible: i.value, name: "MenuItems" });
  };
} });
defineComponent({ name: "MenuItem", props: { as: { type: [Object, String], default: "template" }, disabled: { type: Boolean, default: false } }, setup(t, { slots: n, attrs: u }) {
  let e = De("MenuItem"), o = `headlessui-menu-item-${h()}`, r = computed(() => e.activeItemIndex.value !== null ? e.items.value[e.activeItemIndex.value].id === o : false), s = ref({ disabled: t.disabled, textValue: "" });
  onMounted(() => {
    var p2, f;
    let c = (f = (p2 = document.getElementById(o)) == null ? void 0 : p2.textContent) == null ? void 0 : f.toLowerCase().trim();
    c !== void 0 && (s.value.textValue = c);
  }), onMounted(() => e.registerItem(o, s)), onUnmounted(() => e.unregisterItem(o)), watchEffect(() => {
    e.menuState.value === 0 && (!r.value || nextTick(() => {
      var c, p2;
      return (p2 = (c = document.getElementById(o)) == null ? void 0 : c.scrollIntoView) == null ? void 0 : p2.call(c, { block: "nearest" });
    }));
  });
  function d2(c) {
    if (t.disabled)
      return c.preventDefault();
    e.closeMenu(), nextTick(() => {
      var p2;
      return (p2 = v(e.buttonRef)) == null ? void 0 : p2.focus({ preventScroll: true });
    });
  }
  function a() {
    if (t.disabled)
      return e.goToItem(5);
    e.goToItem(4, o);
  }
  function i() {
    t.disabled || r.value || e.goToItem(4, o);
  }
  function l() {
    t.disabled || !r.value || e.goToItem(5);
  }
  return () => {
    let { disabled: c } = t, p2 = { active: r.value, disabled: c };
    return x({ props: __spreadValues(__spreadValues({}, t), { id: o, role: "menuitem", tabIndex: c === true ? void 0 : -1, "aria-disabled": c === true ? true : void 0, onClick: d2, onFocus: a, onPointermove: i, onMousemove: i, onPointerleave: l, onMouseleave: l }), slot: p2, attrs: u, slots: n, name: "MenuItem" });
  };
} });
var Wt = Symbol("PopoverContext");
function Le(t) {
  let n = inject(Wt, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <${Cn.name} /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, Le), u;
  }
  return n;
}
var Ut = Symbol("PopoverGroupContext");
function $t() {
  return inject(Ut, null);
}
var Gt = Symbol("PopoverPanelContext");
function On() {
  return inject(Gt, null);
}
var Cn = defineComponent({ name: "Popover", props: { as: { type: [Object, String], default: "div" } }, setup(t, { slots: n, attrs: u }) {
  let e = `headlessui-popover-button-${h()}`, o = `headlessui-popover-panel-${h()}`, r = ref(1), s = ref(null), d2 = ref(null), a = { popoverState: r, buttonId: e, panelId: o, panel: d2, button: s, togglePopover() {
    r.value = T(r.value, { [0]: 1, [1]: 0 });
  }, closePopover() {
    r.value !== 1 && (r.value = 1);
  }, close(f) {
    a.closePopover();
    let b = (() => f ? f instanceof HTMLElement ? f : f.value instanceof HTMLElement ? v(f) : v(a.button) : v(a.button))();
    b == null || b.focus();
  } };
  provide$1(Wt, a), M(computed(() => T(r.value, { [0]: 0, [1]: 1 })));
  let i = { buttonId: e, panelId: o, close() {
    a.closePopover();
  } }, l = $t(), c = l == null ? void 0 : l.registerPopover;
  function p2() {
    var f, b, m;
    return (m = l == null ? void 0 : l.isFocusWithinPopoverGroup()) != null ? m : ((f = v(s)) == null ? void 0 : f.contains(document.activeElement)) || ((b = v(d2)) == null ? void 0 : b.contains(document.activeElement));
  }
  return watchEffect(() => c == null ? void 0 : c(i)), C("focus", () => {
    r.value === 0 && (p2() || !s || !d2 || a.closePopover());
  }, true), C("mousedown", (f) => {
    var m, g, S;
    let b = f.target;
    r.value === 0 && (((m = v(s)) == null ? void 0 : m.contains(b)) || ((g = v(d2)) == null ? void 0 : g.contains(b)) || (a.closePopover(), mt(b, 1) || (f.preventDefault(), (S = v(s)) == null || S.focus())));
  }), () => {
    let f = { open: r.value === 0, close: a.close };
    return x({ props: t, slot: f, slots: n, attrs: u, name: "Popover" });
  };
} });
defineComponent({ name: "PopoverButton", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, setup(t, { attrs: n, slots: u }) {
  let e = Le("PopoverButton"), o = $t(), r = o == null ? void 0 : o.closeOthers, s = On(), d2 = s === null ? false : s === e.panelId, a = ref(null), i = ref(typeof window == "undefined" ? null : document.activeElement);
  C("focus", () => {
    i.value = a.value, a.value = document.activeElement;
  }, true);
  let l = ref(null);
  d2 || watchEffect(() => {
    e.button.value = l.value;
  });
  let c = P(computed(() => ({ as: t.as, type: n.type })), l);
  function p2(m) {
    var g, S, y, R;
    if (d2) {
      if (e.popoverState.value === 1)
        return;
      switch (m.key) {
        case " ":
        case "Enter":
          m.preventDefault(), m.stopPropagation(), e.closePopover(), (g = v(e.button)) == null || g.focus();
          break;
      }
    } else
      switch (m.key) {
        case " ":
        case "Enter":
          m.preventDefault(), m.stopPropagation(), e.popoverState.value === 1 && (r == null || r(e.buttonId)), e.togglePopover();
          break;
        case "Escape":
          if (e.popoverState.value !== 0)
            return r == null ? void 0 : r(e.buttonId);
          if (!v(e.button) || !((S = v(e.button)) == null ? void 0 : S.contains(document.activeElement)))
            return;
          m.preventDefault(), m.stopPropagation(), e.closePopover();
          break;
        case "Tab":
          if (e.popoverState.value !== 0 || !e.panel || !e.button)
            return;
          if (m.shiftKey) {
            if (!i.value || ((y = v(e.button)) == null ? void 0 : y.contains(i.value)) || ((R = v(e.panel)) == null ? void 0 : R.contains(i.value)))
              return;
            let E = ae(), D = E.indexOf(i.value);
            if (E.indexOf(v(e.button)) > D)
              return;
            m.preventDefault(), m.stopPropagation(), O(v(e.panel), 8);
          } else
            m.preventDefault(), m.stopPropagation(), O(v(e.panel), 1);
          break;
      }
  }
  function f(m) {
    var g, S;
    if (!d2 && (m.key === " " && m.preventDefault(), e.popoverState.value === 0 && !!e.panel && !!e.button))
      switch (m.key) {
        case "Tab":
          if (!i.value || ((g = v(e.button)) == null ? void 0 : g.contains(i.value)) || ((S = v(e.panel)) == null ? void 0 : S.contains(i.value)))
            return;
          let y = ae(), R = y.indexOf(i.value);
          if (y.indexOf(v(e.button)) > R)
            return;
          m.preventDefault(), m.stopPropagation(), O(v(e.panel), 8);
          break;
      }
  }
  function b() {
    var m, g;
    t.disabled || (d2 ? (e.closePopover(), (m = v(e.button)) == null || m.focus()) : (e.popoverState.value === 1 && (r == null || r(e.buttonId)), (g = v(e.button)) == null || g.focus(), e.togglePopover()));
  }
  return () => {
    let m = { open: e.popoverState.value === 0 }, g = d2 ? { ref: l, type: c.value, onKeydown: p2, onClick: b } : { ref: l, id: e.buttonId, type: c.value, "aria-expanded": t.disabled ? void 0 : e.popoverState.value === 0, "aria-controls": v(e.panel) ? e.panelId : void 0, disabled: t.disabled ? true : void 0, onKeydown: p2, onKeyup: f, onClick: b };
    return x({ props: __spreadValues(__spreadValues({}, t), g), slot: m, attrs: n, slots: u, name: "PopoverButton" });
  };
} });
defineComponent({ name: "PopoverOverlay", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(t, { attrs: n, slots: u }) {
  let e = Le("PopoverOverlay"), o = `headlessui-popover-overlay-${h()}`, r = I(), s = computed(() => r !== null ? r.value === 0 : e.popoverState.value === 0);
  function d2() {
    e.closePopover();
  }
  return () => {
    let a = { open: e.popoverState.value === 0 };
    return x({ props: __spreadValues(__spreadValues({}, t), { id: o, "aria-hidden": true, onClick: d2 }), slot: a, attrs: n, slots: u, features: 1 | 2, visible: s.value, name: "PopoverOverlay" });
  };
} });
defineComponent({ name: "PopoverPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, focus: { type: Boolean, default: false } }, setup(t, { attrs: n, slots: u }) {
  let { focus: e } = t, o = Le("PopoverPanel");
  provide$1(Gt, o.panelId), onUnmounted(() => {
    o.panel.value = null;
  }), watchEffect(() => {
    var i;
    if (!e || o.popoverState.value !== 0 || !o.panel)
      return;
    let a = document.activeElement;
    ((i = v(o.panel)) == null ? void 0 : i.contains(a)) || O(v(o.panel), 1);
  }), C("keydown", (a) => {
    var l, c;
    if (o.popoverState.value !== 0 || !v(o.panel) || a.key !== "Tab" || !document.activeElement || !((l = v(o.panel)) == null ? void 0 : l.contains(document.activeElement)))
      return;
    a.preventDefault();
    let i = O(v(o.panel), a.shiftKey ? 2 : 4);
    if (i === 3)
      return (c = v(o.button)) == null ? void 0 : c.focus();
    if (i === 1) {
      if (!v(o.button))
        return;
      let p2 = ae(), f = p2.indexOf(v(o.button)), b = p2.splice(f + 1).filter((m) => {
        var g;
        return !((g = v(o.panel)) == null ? void 0 : g.contains(m));
      });
      O(b, 1) === 0 && O(document.body, 1);
    }
  }), C("focus", () => {
    var a;
    !e || o.popoverState.value === 0 && (!v(o.panel) || ((a = v(o.panel)) == null ? void 0 : a.contains(document.activeElement)) || o.closePopover());
  }, true);
  let r = I(), s = computed(() => r !== null ? r.value === 0 : o.popoverState.value === 0);
  function d2(a) {
    var i, l;
    switch (a.key) {
      case "Escape":
        if (o.popoverState.value !== 0 || !v(o.panel) || !((i = v(o.panel)) == null ? void 0 : i.contains(document.activeElement)))
          return;
        a.preventDefault(), a.stopPropagation(), o.closePopover(), (l = v(o.button)) == null || l.focus();
        break;
    }
  }
  return () => {
    let a = { open: o.popoverState.value === 0, close: o.close }, i = { ref: o.panel, id: o.panelId, onKeydown: d2 };
    return x({ props: __spreadValues(__spreadValues({}, t), i), slot: a, attrs: n, slots: u, features: 1 | 2, visible: s.value, name: "PopoverPanel" });
  };
} });
defineComponent({ name: "PopoverGroup", props: { as: { type: [Object, String], default: "div" } }, setup(t, { attrs: n, slots: u }) {
  let e = ref(null), o = ref([]);
  function r(i) {
    let l = o.value.indexOf(i);
    l !== -1 && o.value.splice(l, 1);
  }
  function s(i) {
    return o.value.push(i), () => {
      r(i);
    };
  }
  function d2() {
    var l;
    let i = document.activeElement;
    return ((l = v(e)) == null ? void 0 : l.contains(i)) ? true : o.value.some((c) => {
      var p2, f;
      return ((p2 = document.getElementById(c.buttonId)) == null ? void 0 : p2.contains(i)) || ((f = document.getElementById(c.panelId)) == null ? void 0 : f.contains(i));
    });
  }
  function a(i) {
    for (let l of o.value)
      l.buttonId !== i && l.close();
  }
  return provide$1(Ut, { registerPopover: s, unregisterPopover: r, isFocusWithinPopoverGroup: d2, closeOthers: a }), () => x({ props: __spreadValues(__spreadValues({}, t), { ref: e }), slot: {}, attrs: n, slots: u, name: "PopoverGroup" });
} });
var _t = Symbol("LabelContext");
function qt() {
  let t = inject(_t, null);
  if (t === null) {
    let n = new Error("You used a <Label /> component, but it is not inside a parent.");
    throw Error.captureStackTrace && Error.captureStackTrace(n, qt), n;
  }
  return t;
}
function fe({ slot: t = {}, name: n = "Label", props: u = {} } = {}) {
  let e = ref([]);
  function o(r) {
    return e.value.push(r), () => {
      let s = e.value.indexOf(r);
      s !== -1 && e.value.splice(s, 1);
    };
  }
  return provide$1(_t, { register: o, slot: t, name: n, props: u }), computed(() => e.value.length > 0 ? e.value.join(" ") : void 0);
}
var Me = defineComponent({ name: "Label", props: { as: { type: [Object, String], default: "label" }, passive: { type: [Boolean], default: false } }, setup(t, { slots: n, attrs: u }) {
  let e = qt(), o = `headlessui-label-${h()}`;
  return onMounted(() => onUnmounted(e.register(o))), () => {
    let { name: r = "Label", slot: s = {}, props: d2 = {} } = e, _a2 = t, { passive: a } = _a2, i = __objRest(_a2, ["passive"]), l = __spreadProps(__spreadValues({}, Object.entries(d2).reduce((p2, [f, b]) => Object.assign(p2, { [f]: unref(b) }), {})), { id: o }), c = __spreadValues(__spreadValues({}, i), l);
    return a && delete c.onClick, x({ props: c, slot: s, attrs: u, slots: n, name: r });
  };
} });
var Qt = Symbol("RadioGroupContext");
function Jt(t) {
  let n = inject(Qt, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <RadioGroup /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, Jt), u;
  }
  return n;
}
var wi = defineComponent({ name: "RadioGroup", emits: { "update:modelValue": (t) => true }, props: { as: { type: [Object, String], default: "div" }, disabled: { type: [Boolean], default: false }, modelValue: { type: [Object, String, Number, Boolean] } }, setup(t, { emit: n, attrs: u, slots: e }) {
  let o = ref(null), r = ref([]), s = fe({ name: "RadioGroupLabel" }), d2 = G({ name: "RadioGroupDescription" }), a = computed(() => t.modelValue), i = { options: r, value: a, disabled: computed(() => t.disabled), firstOption: computed(() => r.value.find((p2) => !p2.propsRef.disabled)), containsCheckedOption: computed(() => r.value.some((p2) => toRaw(p2.propsRef.value) === toRaw(t.modelValue))), change(p2) {
    var b;
    if (t.disabled || a.value === p2)
      return false;
    let f = (b = r.value.find((m) => toRaw(m.propsRef.value) === toRaw(p2))) == null ? void 0 : b.propsRef;
    return (f == null ? void 0 : f.disabled) ? false : (n("update:modelValue", p2), true);
  }, registerOption(p2) {
    var b;
    let f = Array.from((b = o.value) == null ? void 0 : b.querySelectorAll('[id^="headlessui-radiogroup-option-"]')).reduce((m, g, S) => Object.assign(m, { [g.id]: S }), {});
    r.value.push(p2), r.value.sort((m, g) => f[m.id] - f[g.id]);
  }, unregisterOption(p2) {
    let f = r.value.findIndex((b) => b.id === p2);
    f !== -1 && r.value.splice(f, 1);
  } };
  provide$1(Qt, i), Y({ container: computed(() => v(o)), accept(p2) {
    return p2.getAttribute("role") === "radio" ? NodeFilter.FILTER_REJECT : p2.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
  }, walk(p2) {
    p2.setAttribute("role", "none");
  } });
  function l(p2) {
    if (!o.value || !o.value.contains(p2.target))
      return;
    let f = r.value.filter((b) => b.propsRef.disabled === false).map((b) => b.element);
    switch (p2.key) {
      case "ArrowLeft":
      case "ArrowUp":
        if (p2.preventDefault(), p2.stopPropagation(), O(f, 2 | 16) === 2) {
          let m = r.value.find((g) => g.element === document.activeElement);
          m && i.change(m.propsRef.value);
        }
        break;
      case "ArrowRight":
      case "ArrowDown":
        if (p2.preventDefault(), p2.stopPropagation(), O(f, 4 | 16) === 2) {
          let m = r.value.find((g) => g.element === document.activeElement);
          m && i.change(m.propsRef.value);
        }
        break;
      case " ":
        {
          p2.preventDefault(), p2.stopPropagation();
          let b = r.value.find((m) => m.element === document.activeElement);
          b && i.change(b.propsRef.value);
        }
        break;
    }
  }
  let c = `headlessui-radiogroup-${h()}`;
  return () => {
    let _a2 = t, { modelValue: p2, disabled: f } = _a2, b = __objRest(_a2, ["modelValue", "disabled"]), m = { ref: o, id: c, role: "radiogroup", "aria-labelledby": s.value, "aria-describedby": d2.value, onKeydown: l };
    return x({ props: __spreadValues(__spreadValues({}, b), m), slot: {}, attrs: u, slots: e, name: "RadioGroup" });
  };
} });
var Li = defineComponent({ name: "RadioGroupOption", props: { as: { type: [Object, String], default: "div" }, value: { type: [Object, String, Number, Boolean] }, disabled: { type: Boolean, default: false } }, setup(t, { attrs: n, slots: u }) {
  let e = Jt("RadioGroupOption"), o = `headlessui-radiogroup-option-${h()}`, r = fe({ name: "RadioGroupLabel" }), s = G({ name: "RadioGroupDescription" }), d2 = ref(null), a = computed(() => ({ value: t.value, disabled: t.disabled })), i = ref(1);
  onMounted(() => e.registerOption({ id: o, element: d2, propsRef: a })), onUnmounted(() => e.unregisterOption(o));
  let l = computed(() => {
    var S;
    return ((S = e.firstOption.value) == null ? void 0 : S.id) === o;
  }), c = computed(() => e.disabled.value || t.disabled), p2 = computed(() => toRaw(e.value.value) === toRaw(t.value)), f = computed(() => c.value ? -1 : p2.value || !e.containsCheckedOption.value && l.value ? 0 : -1);
  function b() {
    var S;
    !e.change(t.value) || (i.value |= 2, (S = d2.value) == null || S.focus());
  }
  function m() {
    i.value |= 2;
  }
  function g() {
    i.value &= ~2;
  }
  return () => {
    let S = L(t, ["value", "disabled"]), y = { checked: p2.value, disabled: c.value, active: Boolean(i.value & 2) }, R = { id: o, ref: d2, role: "radio", "aria-checked": p2.value ? "true" : "false", "aria-labelledby": r.value, "aria-describedby": s.value, "aria-disabled": c.value ? true : void 0, tabIndex: f.value, onClick: c.value ? void 0 : b, onFocus: c.value ? void 0 : m, onBlur: c.value ? void 0 : g };
    return x({ props: __spreadValues(__spreadValues({}, S), R), slot: y, attrs: n, slots: u, name: "RadioGroupOption" });
  };
} }), Mi = Me, ki = ne;
var Zt = Symbol("GroupContext");
defineComponent({ name: "SwitchGroup", props: { as: { type: [Object, String], default: "template" } }, setup(t, { slots: n, attrs: u }) {
  let e = ref(null), o = fe({ name: "SwitchLabel", props: { onClick() {
    !e.value || (e.value.click(), e.value.focus({ preventScroll: true }));
  } } }), r = G({ name: "SwitchDescription" });
  return provide$1(Zt, { switchRef: e, labelledby: o, describedby: r }), () => x({ props: t, slot: {}, slots: n, attrs: u, name: "SwitchGroup" });
} });
defineComponent({ name: "Switch", emits: { "update:modelValue": (t) => true }, props: { as: { type: [Object, String], default: "button" }, modelValue: { type: Boolean, default: false } }, setup(t, { emit: n, attrs: u, slots: e }) {
  let o = inject(Zt, null), r = `headlessui-switch-${h()}`;
  function s() {
    n("update:modelValue", !t.modelValue);
  }
  let d2 = ref(null), a = o === null ? d2 : o.switchRef, i = P(computed(() => ({ as: t.as, type: u.type })), a);
  function l(f) {
    f.preventDefault(), s();
  }
  function c(f) {
    f.key !== "Tab" && f.preventDefault(), f.key === " " && s();
  }
  function p2(f) {
    f.preventDefault();
  }
  return () => {
    let f = { checked: t.modelValue }, b = { id: r, ref: a, role: "switch", type: i.value, tabIndex: 0, "aria-checked": t.modelValue, "aria-labelledby": o == null ? void 0 : o.labelledby.value, "aria-describedby": o == null ? void 0 : o.describedby.value, onClick: l, onKeyup: c, onKeypress: p2 };
    return x({ props: __spreadValues(__spreadValues({}, t), b), slot: f, attrs: u, slots: e, name: "Switch" });
  };
} });
var oo = Symbol("TabsContext");
function ve(t) {
  let n = inject(oo, null);
  if (n === null) {
    let u = new Error(`<${t} /> is missing a parent <TabGroup /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(u, ve), u;
  }
  return n;
}
defineComponent({ name: "TabGroup", emits: { change: (t) => true }, props: { as: { type: [Object, String], default: "template" }, selectedIndex: { type: [Number], default: null }, defaultIndex: { type: [Number], default: 0 }, vertical: { type: [Boolean], default: false }, manual: { type: [Boolean], default: false } }, setup(t, { slots: n, attrs: u, emit: e }) {
  let o = ref(null), r = ref([]), s = ref([]), d2 = { selectedIndex: o, orientation: computed(() => t.vertical ? "vertical" : "horizontal"), activation: computed(() => t.manual ? "manual" : "auto"), tabs: r, panels: s, setSelectedIndex(a) {
    o.value !== a && (o.value = a, e("change", a));
  }, registerTab(a) {
    r.value.includes(a) || r.value.push(a);
  }, unregisterTab(a) {
    let i = r.value.indexOf(a);
    i !== -1 && r.value.splice(i, 1);
  }, registerPanel(a) {
    s.value.includes(a) || s.value.push(a);
  }, unregisterPanel(a) {
    let i = s.value.indexOf(a);
    i !== -1 && s.value.splice(i, 1);
  } };
  return provide$1(oo, d2), watchEffect(() => {
    var c;
    if (d2.tabs.value.length <= 0 || t.selectedIndex === null && o.value !== null)
      return;
    let a = d2.tabs.value.map((p2) => v(p2)).filter(Boolean), i = a.filter((p2) => !p2.hasAttribute("disabled")), l = (c = t.selectedIndex) != null ? c : t.defaultIndex;
    if (l < 0)
      o.value = a.indexOf(i[0]);
    else if (l > d2.tabs.value.length)
      o.value = a.indexOf(i[i.length - 1]);
    else {
      let p2 = a.slice(0, l), b = [...a.slice(l), ...p2].find((m) => i.includes(m));
      if (!b)
        return;
      o.value = a.indexOf(b);
    }
  }), () => {
    let a = { selectedIndex: o.value };
    return x({ props: L(t, ["selectedIndex", "defaultIndex", "manual", "vertical", "onChange"]), slot: a, slots: n, attrs: u, name: "TabGroup" });
  };
} });
defineComponent({ name: "TabList", props: { as: { type: [Object, String], default: "div" } }, setup(t, { attrs: n, slots: u }) {
  let e = ve("TabList");
  return () => {
    let o = { selectedIndex: e.selectedIndex.value }, r = { role: "tablist", "aria-orientation": e.orientation.value };
    return x({ props: __spreadValues(__spreadValues({}, t), r), slot: o, attrs: n, slots: u, name: "TabList" });
  };
} });
defineComponent({ name: "Tab", props: { as: { type: [Object, String], default: "button" }, disabled: { type: [Boolean], default: false } }, setup(t, { attrs: n, slots: u }) {
  let e = ve("Tab"), o = `headlessui-tabs-tab-${h()}`, r = ref();
  onMounted(() => e.registerTab(r)), onUnmounted(() => e.unregisterTab(r));
  let s = computed(() => e.tabs.value.indexOf(r)), d2 = computed(() => s.value === e.selectedIndex.value);
  function a(p2) {
    let f = e.tabs.value.map((b) => v(b)).filter(Boolean);
    if (p2.key === " " || p2.key === "Enter") {
      p2.preventDefault(), p2.stopPropagation(), e.setSelectedIndex(s.value);
      return;
    }
    switch (p2.key) {
      case "Home":
      case "PageUp":
        return p2.preventDefault(), p2.stopPropagation(), O(f, 1);
      case "End":
      case "PageDown":
        return p2.preventDefault(), p2.stopPropagation(), O(f, 8);
    }
    return T(e.orientation.value, { vertical() {
      if (p2.key === "ArrowUp")
        return O(f, 2 | 16);
      if (p2.key === "ArrowDown")
        return O(f, 4 | 16);
    }, horizontal() {
      if (p2.key === "ArrowLeft")
        return O(f, 2 | 16);
      if (p2.key === "ArrowRight")
        return O(f, 4 | 16);
    } });
  }
  function i() {
    var p2;
    (p2 = v(r)) == null || p2.focus();
  }
  function l() {
    var p2;
    t.disabled || ((p2 = v(r)) == null || p2.focus(), e.setSelectedIndex(s.value));
  }
  let c = P(computed(() => ({ as: t.as, type: n.type })), r);
  return () => {
    var b, m;
    let p2 = { selected: d2.value }, f = { ref: r, onKeydown: a, onFocus: e.activation.value === "manual" ? i : l, onClick: l, id: o, role: "tab", type: c.value, "aria-controls": (m = (b = e.panels.value[s.value]) == null ? void 0 : b.value) == null ? void 0 : m.id, "aria-selected": d2.value, tabIndex: d2.value ? 0 : -1, disabled: t.disabled ? true : void 0 };
    return x({ props: __spreadValues(__spreadValues({}, t), f), slot: p2, attrs: n, slots: u, name: "Tab" });
  };
} });
defineComponent({ name: "TabPanels", props: { as: { type: [Object, String], default: "div" } }, setup(t, { slots: n, attrs: u }) {
  let e = ve("TabPanels");
  return () => {
    let o = { selectedIndex: e.selectedIndex.value };
    return x({ props: t, slot: o, attrs: u, slots: n, name: "TabPanels" });
  };
} });
defineComponent({ name: "TabPanel", props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true } }, setup(t, { attrs: n, slots: u }) {
  let e = ve("TabPanel"), o = `headlessui-tabs-panel-${h()}`, r = ref();
  onMounted(() => e.registerPanel(r)), onUnmounted(() => e.unregisterPanel(r));
  let s = computed(() => e.panels.value.indexOf(r)), d2 = computed(() => s.value === e.selectedIndex.value);
  return () => {
    var l, c;
    let a = { selected: d2.value }, i = { ref: r, id: o, role: "tabpanel", "aria-labelledby": (c = (l = e.tabs.value[s.value]) == null ? void 0 : l.value) == null ? void 0 : c.id, tabIndex: d2.value ? 0 : -1 };
    return x({ props: __spreadValues(__spreadValues({}, t), i), slot: a, attrs: n, slots: u, features: 2 | 1, visible: d2.value, name: "TabPanel" });
  };
} });
function no(t) {
  let n = { called: false };
  return (...u) => {
    if (!n.called)
      return n.called = true, t(...u);
  };
}
function Ze() {
  let t = [], n = [], u = { enqueue(e) {
    n.push(e);
  }, requestAnimationFrame(...e) {
    let o = requestAnimationFrame(...e);
    u.add(() => cancelAnimationFrame(o));
  }, nextFrame(...e) {
    u.requestAnimationFrame(() => {
      u.requestAnimationFrame(...e);
    });
  }, setTimeout(...e) {
    let o = setTimeout(...e);
    u.add(() => clearTimeout(o));
  }, add(e) {
    t.push(e);
  }, dispose() {
    for (let e of t.splice(0))
      e();
  }, async workQueue() {
    for (let e of n.splice(0))
      await e();
  } };
  return u;
}
function et(t, ...n) {
  t && n.length > 0 && t.classList.add(...n);
}
function Fe(t, ...n) {
  t && n.length > 0 && t.classList.remove(...n);
}
function $n(t, n) {
  let u = Ze();
  if (!t)
    return u.dispose;
  let { transitionDuration: e, transitionDelay: o } = getComputedStyle(t), [r, s] = [e, o].map((d2) => {
    let [a = 0] = d2.split(",").filter(Boolean).map((i) => i.includes("ms") ? parseFloat(i) : parseFloat(i) * 1e3).sort((i, l) => l - i);
    return a;
  });
  return r !== 0 ? u.setTimeout(() => n("finished"), r + s) : n("finished"), u.add(() => n("cancelled")), u.dispose;
}
function tt(t, n, u, e, o, r) {
  let s = Ze(), d2 = r !== void 0 ? no(r) : () => {
  };
  return Fe(t, ...o), et(t, ...n, ...u), s.nextFrame(() => {
    Fe(t, ...u), et(t, ...e), s.add($n(t, (a) => (Fe(t, ...e, ...n), et(t, ...o), d2(a))));
  }), s.add(() => Fe(t, ...n, ...u, ...e, ...o)), s.add(() => d2("cancelled")), s.dispose;
}
function Q(t = "") {
  return t.split(" ").filter((n) => n.trim().length > 1);
}
var lt = Symbol("TransitionContext");
function _n() {
  return inject(lt, null) !== null;
}
function qn() {
  let t = inject(lt, null);
  if (t === null)
    throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return t;
}
function zn() {
  let t = inject(rt, null);
  if (t === null)
    throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
  return t;
}
var rt = Symbol("NestingContext");
function He(t) {
  return "children" in t ? He(t.children) : t.value.filter(({ state: n }) => n === "visible").length > 0;
}
function io(t) {
  let n = ref([]), u = ref(false);
  onMounted(() => u.value = true), onUnmounted(() => u.value = false);
  function e(r, s = 1) {
    let d2 = n.value.findIndex(({ id: a }) => a === r);
    d2 !== -1 && (T(s, { [0]() {
      n.value.splice(d2, 1);
    }, [1]() {
      n.value[d2].state = "hidden";
    } }), !He(n) && u.value && (t == null || t()));
  }
  function o(r) {
    let s = n.value.find(({ id: d2 }) => d2 === r);
    return s ? s.state !== "visible" && (s.state = "visible") : n.value.push({ id: r, state: "visible" }), () => e(r, 0);
  }
  return { children: n, register: o, unregister: e };
}
var uo = 1, Qn = defineComponent({ props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(t, { emit: n, attrs: u, slots: e }) {
  if (!_n() && it())
    return () => h$1(Yn, __spreadProps(__spreadValues({}, t), { onBeforeEnter: () => n("beforeEnter"), onAfterEnter: () => n("afterEnter"), onBeforeLeave: () => n("beforeLeave"), onAfterLeave: () => n("afterLeave") }), e);
  let o = ref(null), r = ref("visible"), s = computed(() => t.unmount ? 0 : 1), { show: d2, appear: a } = qn(), { register: i, unregister: l } = zn(), c = { value: true }, p2 = h(), f = { value: false }, b = io(() => {
    f.value || (r.value = "hidden", l(p2), n("afterLeave"));
  });
  onMounted(() => {
    let F = i(p2);
    onUnmounted(F);
  }), watchEffect(() => {
    if (s.value === 1 && !!p2) {
      if (d2 && r.value !== "visible") {
        r.value = "visible";
        return;
      }
      T(r.value, { hidden: () => l(p2), visible: () => i(p2) });
    }
  });
  let m = Q(t.enter), g = Q(t.enterFrom), S = Q(t.enterTo), y = Q(t.entered), R = Q(t.leave), E = Q(t.leaveFrom), D = Q(t.leaveTo);
  onMounted(() => {
    watchEffect(() => {
      if (r.value === "visible") {
        let F = v(o);
        if (F instanceof Comment && F.data === "")
          throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
      }
    });
  });
  function w2(F) {
    let xe = c.value && !a.value, U = v(o);
    !U || !(U instanceof HTMLElement) || xe || (f.value = true, d2.value && n("beforeEnter"), d2.value || n("beforeLeave"), F(d2.value ? tt(U, m, g, S, y, (ye) => {
      f.value = false, ye === "finished" && n("afterEnter");
    }) : tt(U, R, E, D, y, (ye) => {
      f.value = false, ye === "finished" && (He(b) || (r.value = "hidden", l(p2), n("afterLeave")));
    })));
  }
  return onMounted(() => {
    watch([d2, a], (F, xe, U) => {
      w2(U), c.value = false;
    }, { immediate: true });
  }), provide$1(rt, b), M(computed(() => T(r.value, { visible: 0, hidden: 1 }))), () => {
    let _a2 = t, { appear: F, show: xe, enter: U, enterFrom: ye, enterTo: Xn, entered: Zn, leave: el, leaveFrom: tl, leaveTo: ol } = _a2, so = __objRest(_a2, ["appear", "show", "enter", "enterFrom", "enterTo", "entered", "leave", "leaveFrom", "leaveTo"]);
    return x({ props: __spreadValues(__spreadValues({}, so), { ref: o }), slot: {}, slots: e, attrs: u, features: uo, visible: r.value === "visible", name: "TransitionChild" });
  };
} }), Jn = Qn, Yn = defineComponent({ inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(t, { emit: n, attrs: u, slots: e }) {
  let o = I(), r = computed(() => t.show === null && o !== null ? T(o.value, { [0]: true, [1]: false }) : t.show);
  watchEffect(() => {
    if (![true, false].includes(r.value))
      throw new Error('A <Transition /> is used but it is missing a `:show="true | false"` prop.');
  });
  let s = ref(r.value ? "visible" : "hidden"), d2 = io(() => {
    s.value = "hidden";
  }), a = { value: true }, i = { show: r, appear: computed(() => t.appear || !a.value) };
  return onMounted(() => {
    watchEffect(() => {
      a.value = false, r.value ? s.value = "visible" : He(d2) || (s.value = "hidden");
    });
  }), provide$1(rt, d2), provide$1(lt, i), () => {
    let l = L(t, ["show", "appear", "unmount"]), c = { unmount: t.unmount };
    return x({ props: __spreadProps(__spreadValues({}, c), { as: "template" }), slot: {}, slots: __spreadProps(__spreadValues({}, e), { default: () => [h$1(Jn, __spreadValues(__spreadValues(__spreadValues({ onBeforeEnter: () => n("beforeEnter"), onAfterEnter: () => n("afterEnter"), onBeforeLeave: () => n("beforeLeave"), onAfterLeave: () => n("afterLeave") }, u), c), l), e.default)] }), attrs: {}, features: uo, visible: s.value === "visible", name: "Transition" });
  };
} });
function setupCheckoutButtons() {
  const { state, send: send2 } = useOverlay();
  document.querySelectorAll("button[data-sell-store][data-sell-product]").forEach((el) => {
    el.addEventListener("click", () => {
      var _a2, _b, _c;
      if (!state.value.matches("closed"))
        return;
      const store_id = el.attributes["data-sell-store"].value;
      const product_id = el.attributes["data-sell-product"].value;
      const variant_id = (_a2 = el.attributes["data-sell-variant"]) == null ? void 0 : _a2.value;
      const darkMode = ((_b = el.attributes["data-sell-darkmode"]) == null ? void 0 : _b.value) === "true";
      const theme = (_c = el.attributes["data-sell-theme"]) == null ? void 0 : _c.value;
      send2({
        type: "OPEN",
        store_id,
        product_id,
        variant_id,
        customization: {
          darkMode,
          theme
        }
      });
    });
  });
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t[p2] = s[p2];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p2 in s)
    if (Object.prototype.hasOwnProperty.call(s, p2) && e.indexOf(p2) < 0)
      t[p2] = s[p2];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i]))
        t[p2[i]] = s[p2[i]];
    }
  return t;
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error2) {
    e = { error: error2 };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}
var ActionTypes;
(function(ActionTypes2) {
  ActionTypes2["Start"] = "xstate.start";
  ActionTypes2["Stop"] = "xstate.stop";
  ActionTypes2["Raise"] = "xstate.raise";
  ActionTypes2["Send"] = "xstate.send";
  ActionTypes2["Cancel"] = "xstate.cancel";
  ActionTypes2["NullEvent"] = "";
  ActionTypes2["Assign"] = "xstate.assign";
  ActionTypes2["After"] = "xstate.after";
  ActionTypes2["DoneState"] = "done.state";
  ActionTypes2["DoneInvoke"] = "done.invoke";
  ActionTypes2["Log"] = "xstate.log";
  ActionTypes2["Init"] = "xstate.init";
  ActionTypes2["Invoke"] = "xstate.invoke";
  ActionTypes2["ErrorExecution"] = "error.execution";
  ActionTypes2["ErrorCommunication"] = "error.communication";
  ActionTypes2["ErrorPlatform"] = "error.platform";
  ActionTypes2["ErrorCustom"] = "xstate.error";
  ActionTypes2["Update"] = "xstate.update";
  ActionTypes2["Pure"] = "xstate.pure";
  ActionTypes2["Choose"] = "xstate.choose";
})(ActionTypes || (ActionTypes = {}));
var SpecialTargets;
(function(SpecialTargets2) {
  SpecialTargets2["Parent"] = "#_parent";
  SpecialTargets2["Internal"] = "#_internal";
})(SpecialTargets || (SpecialTargets = {}));
var start$1 = ActionTypes.Start;
var stop$1 = ActionTypes.Stop;
var raise$1 = ActionTypes.Raise;
var send$4 = ActionTypes.Send;
var cancel$1 = ActionTypes.Cancel;
var nullEvent = ActionTypes.NullEvent;
var assign$5 = ActionTypes.Assign;
var after$1 = ActionTypes.After;
var doneState = ActionTypes.DoneState;
var log$2 = ActionTypes.Log;
var init = ActionTypes.Init;
var invoke = ActionTypes.Invoke;
var errorExecution = ActionTypes.ErrorExecution;
var errorPlatform = ActionTypes.ErrorPlatform;
var error$2 = ActionTypes.ErrorCustom;
var update = ActionTypes.Update;
var choose$1 = ActionTypes.Choose;
var pure$2 = ActionTypes.Pure;
var actionTypes = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  after: after$1,
  assign: assign$5,
  cancel: cancel$1,
  choose: choose$1,
  doneState,
  error: error$2,
  errorExecution,
  errorPlatform,
  init,
  invoke,
  log: log$2,
  nullEvent,
  pure: pure$2,
  raise: raise$1,
  send: send$4,
  start: start$1,
  stop: stop$1,
  update
});
var STATE_DELIMITER = ".";
var EMPTY_ACTIVITY_MAP = {};
var DEFAULT_GUARD_TYPE = "xstate.guard";
var TARGETLESS_KEY = "";
var IS_PRODUCTION = true;
var _a;
function matchesState(parentStateId, childStateId, delimiter) {
  if (delimiter === void 0) {
    delimiter = STATE_DELIMITER;
  }
  var parentStateValue = toStateValue(parentStateId, delimiter);
  var childStateValue = toStateValue(childStateId, delimiter);
  if (isString(childStateValue)) {
    if (isString(parentStateValue)) {
      return childStateValue === parentStateValue;
    }
    return false;
  }
  if (isString(parentStateValue)) {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every(function(key) {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function getEventType(event) {
  try {
    return isString(event) || typeof event === "number" ? "".concat(event) : event.type;
  } catch (e) {
    throw new Error("Events must be strings or objects with a string event.type property.");
  }
}
function toStatePath(stateId, delimiter) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }
    return stateId.toString().split(delimiter);
  } catch (e) {
    throw new Error("'".concat(stateId, "' is not a valid state path."));
  }
}
function isStateLike(state) {
  return typeof state === "object" && "value" in state && "context" in state && "event" in state && "_event" in state;
}
function toStateValue(stateValue, delimiter) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }
  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }
  if (typeof stateValue !== "string") {
    return stateValue;
  }
  var statePath = toStatePath(stateValue, delimiter);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  var value = {};
  var marker = value;
  for (var i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      marker[statePath[i]] = {};
      marker = marker[statePath[i]];
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  var result = {};
  var collectionKeys = Object.keys(collection);
  for (var i = 0; i < collectionKeys.length; i++) {
    var key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }
  return result;
}
function mapFilterValues(collection, iteratee, predicate) {
  var e_1, _a2;
  var result = {};
  try {
    for (var _b = __values(Object.keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var item = collection[key];
      if (!predicate(item)) {
        continue;
      }
      result[key] = iteratee(item, key, collection);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a2 = _b.return))
        _a2.call(_b);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  return result;
}
var path = function(props) {
  return function(object) {
    var e_2, _a2;
    var result = object;
    try {
      for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
        var prop = props_1_1.value;
        result = result[prop];
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (props_1_1 && !props_1_1.done && (_a2 = props_1.return))
          _a2.call(props_1);
      } finally {
        if (e_2)
          throw e_2.error;
      }
    }
    return result;
  };
};
function nestedPath(props, accessorProp) {
  return function(object) {
    var e_3, _a2;
    var result = object;
    try {
      for (var props_2 = __values(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
        var prop = props_2_1.value;
        result = result[accessorProp][prop];
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (props_2_1 && !props_2_1.done && (_a2 = props_2.return))
          _a2.call(props_2);
      } finally {
        if (e_3)
          throw e_3.error;
      }
    }
    return result;
  };
}
function toStatePaths(stateValue) {
  if (!stateValue) {
    return [[]];
  }
  if (isString(stateValue)) {
    return [[stateValue]];
  }
  var result = flatten(Object.keys(stateValue).map(function(key) {
    var subStateValue = stateValue[key];
    if (typeof subStateValue !== "string" && (!subStateValue || !Object.keys(subStateValue).length)) {
      return [[key]];
    }
    return toStatePaths(stateValue[key]).map(function(subPath) {
      return [key].concat(subPath);
    });
  }));
  return result;
}
function flatten(array) {
  var _a2;
  return (_a2 = []).concat.apply(_a2, __spreadArray([], __read(array), false));
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }
  return [value];
}
function toArray$1(value) {
  if (value === void 0) {
    return [];
  }
  return toArrayStrict(value);
}
function mapContext(mapper, context, _event) {
  var e_5, _a2;
  if (isFunction(mapper)) {
    return mapper(context, _event.data);
  }
  var result = {};
  try {
    for (var _b = __values(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var subMapper = mapper[key];
      if (isFunction(subMapper)) {
        result[key] = subMapper(context, _event.data);
      } else {
        result[key] = subMapper;
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a2 = _b.return))
        _a2.call(_b);
    } finally {
      if (e_5)
        throw e_5.error;
    }
  }
  return result;
}
function isBuiltInEvent(eventType) {
  return /^(done|error)\./.test(eventType);
}
function isPromiseLike(value) {
  if (value instanceof Promise) {
    return true;
  }
  if (value !== null && (isFunction(value) || typeof value === "object") && isFunction(value.then)) {
    return true;
  }
  return false;
}
function isBehavior(value) {
  return value !== null && typeof value === "object" && "transition" in value && typeof value.transition === "function";
}
function partition(items, predicate) {
  var e_6, _a2;
  var _b = __read([[], []], 2), truthy = _b[0], falsy = _b[1];
  try {
    for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
      var item = items_1_1.value;
      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
  } catch (e_6_1) {
    e_6 = {
      error: e_6_1
    };
  } finally {
    try {
      if (items_1_1 && !items_1_1.done && (_a2 = items_1.return))
        _a2.call(items_1);
    } finally {
      if (e_6)
        throw e_6.error;
    }
  }
  return [truthy, falsy];
}
function updateHistoryStates(hist, stateValue) {
  return mapValues(hist.states, function(subHist, key) {
    if (!subHist) {
      return void 0;
    }
    var subStateValue = (isString(stateValue) ? void 0 : stateValue[key]) || (subHist ? subHist.current : void 0);
    if (!subStateValue) {
      return void 0;
    }
    return {
      current: subStateValue,
      states: updateHistoryStates(subHist, subStateValue)
    };
  });
}
function updateHistoryValue(hist, stateValue) {
  return {
    current: stateValue,
    states: updateHistoryStates(hist, stateValue)
  };
}
function updateContext(context, _event, assignActions, state) {
  var updatedContext = context ? assignActions.reduce(function(acc, assignAction) {
    var e_7, _a2;
    var assignment = assignAction.assignment;
    var meta = {
      state,
      action: assignAction,
      _event
    };
    var partialUpdate = {};
    if (isFunction(assignment)) {
      partialUpdate = assignment(acc, _event.data, meta);
    } else {
      try {
        for (var _b = __values(Object.keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var key = _c.value;
          var propAssignment = assignment[key];
          partialUpdate[key] = isFunction(propAssignment) ? propAssignment(acc, _event.data, meta) : propAssignment;
        }
      } catch (e_7_1) {
        e_7 = {
          error: e_7_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a2 = _b.return))
            _a2.call(_b);
        } finally {
          if (e_7)
            throw e_7.error;
        }
      }
    }
    return Object.assign({}, acc, partialUpdate);
  }, context) : context;
  return updatedContext;
}
var warn = function() {
};
function isArray(value) {
  return Array.isArray(value);
}
function isFunction(value) {
  return typeof value === "function";
}
function isString(value) {
  return typeof value === "string";
}
function toGuard(condition, guardMap) {
  if (!condition) {
    return void 0;
  }
  if (isString(condition)) {
    return {
      type: DEFAULT_GUARD_TYPE,
      name: condition,
      predicate: guardMap ? guardMap[condition] : void 0
    };
  }
  if (isFunction(condition)) {
    return {
      type: DEFAULT_GUARD_TYPE,
      name: condition.name,
      predicate: condition
    };
  }
  return condition;
}
function isObservable(value) {
  try {
    return "subscribe" in value && isFunction(value.subscribe);
  } catch (e) {
    return false;
  }
}
var symbolObservable = /* @__PURE__ */ function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();
_a = {}, _a[symbolObservable] = function() {
  return this;
}, _a[Symbol.observable] = function() {
  return this;
}, _a;
function isMachine(value) {
  return !!value && "__xstatenode" in value;
}
function isActor$1(value) {
  return !!value && typeof value.send === "function";
}
function toEventObject(event, payload) {
  if (isString(event) || typeof event === "number") {
    return __assign({
      type: event
    }, payload);
  }
  return event;
}
function toSCXMLEvent(event, scxmlEvent) {
  if (!isString(event) && "$$type" in event && event.$$type === "scxml") {
    return event;
  }
  var eventObject = toEventObject(event);
  return __assign({
    name: eventObject.type,
    data: eventObject,
    $$type: "scxml",
    type: "external"
  }, scxmlEvent);
}
function toTransitionConfigArray(event, configLike) {
  var transitions = toArrayStrict(configLike).map(function(transitionLike) {
    if (typeof transitionLike === "undefined" || typeof transitionLike === "string" || isMachine(transitionLike)) {
      return {
        target: transitionLike,
        event
      };
    }
    return __assign(__assign({}, transitionLike), {
      event
    });
  });
  return transitions;
}
function normalizeTarget(target) {
  if (target === void 0 || target === TARGETLESS_KEY) {
    return void 0;
  }
  return toArray$1(target);
}
function evaluateGuard(machine, guard, context, _event, state) {
  var guards = machine.options.guards;
  var guardMeta = {
    state,
    cond: guard,
    _event
  };
  if (guard.type === DEFAULT_GUARD_TYPE) {
    return ((guards === null || guards === void 0 ? void 0 : guards[guard.name]) || guard.predicate)(context, _event.data, guardMeta);
  }
  var condFn = guards === null || guards === void 0 ? void 0 : guards[guard.type];
  if (!condFn) {
    throw new Error("Guard '".concat(guard.type, "' is not implemented on machine '").concat(machine.id, "'."));
  }
  return condFn(context, _event.data, guardMeta);
}
function toInvokeSource$1(src) {
  if (typeof src === "string") {
    return {
      type: src
    };
  }
  return src;
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  if (typeof nextHandler === "object") {
    return nextHandler;
  }
  var noop5 = function() {
    return void 0;
  };
  return {
    next: nextHandler,
    error: errorHandler || noop5,
    complete: completionHandler || noop5
  };
}
function createInvokeId(stateNodeId, index) {
  return "".concat(stateNodeId, ":invocation[").concat(index, "]");
}
var initEvent = /* @__PURE__ */ toSCXMLEvent({
  type: init
});
function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap ? actionFunctionMap[actionType] || void 0 : void 0;
}
function toActionObject(action, actionFunctionMap) {
  var actionObject;
  if (isString(action) || typeof action === "number") {
    var exec = getActionFunction(action, actionFunctionMap);
    if (isFunction(exec)) {
      actionObject = {
        type: action,
        exec
      };
    } else if (exec) {
      actionObject = exec;
    } else {
      actionObject = {
        type: action,
        exec: void 0
      };
    }
  } else if (isFunction(action)) {
    actionObject = {
      type: action.name || action.toString(),
      exec: action
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);
    if (isFunction(exec)) {
      actionObject = __assign(__assign({}, action), {
        exec
      });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = __assign(__assign(__assign({}, exec), action), {
        type: actionType
      });
    } else {
      actionObject = action;
    }
  }
  return actionObject;
}
var toActionObjects = function(action, actionFunctionMap) {
  if (!action) {
    return [];
  }
  var actions2 = isArray(action) ? action : [action];
  return actions2.map(function(subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};
function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return __assign(__assign({
    id: isString(action) ? action : actionObject.id
  }, actionObject), {
    type: actionObject.type
  });
}
function raise(event) {
  if (!isString(event)) {
    return send$3(event, {
      to: SpecialTargets.Internal
    });
  }
  return {
    type: raise$1,
    event
  };
}
function resolveRaise(action) {
  return {
    type: raise$1,
    _event: toSCXMLEvent(action.event)
  };
}
function send$3(event, options) {
  return {
    to: options ? options.to : void 0,
    type: send$4,
    event: isFunction(event) ? event : toEventObject(event),
    delay: options ? options.delay : void 0,
    id: options && options.id !== void 0 ? options.id : isFunction(event) ? event.name : getEventType(event)
  };
}
function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event
  };
  var resolvedEvent = toSCXMLEvent(isFunction(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;
  if (isString(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = isFunction(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = isFunction(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }
  var resolvedTarget = isFunction(action.to) ? action.to(ctx, _event.data, meta) : action.to;
  return __assign(__assign({}, action), {
    to: resolvedTarget,
    _event: resolvedEvent,
    event: resolvedEvent.data,
    delay: resolvedDelay
  });
}
function sendParent(event, options) {
  return send$3(event, __assign(__assign({}, options), {
    to: SpecialTargets.Parent
  }));
}
function sendTo(actor, event, options) {
  return send$3(event, __assign(__assign({}, options), {
    to: actor
  }));
}
function sendUpdate() {
  return sendParent(update);
}
function respond(event, options) {
  return send$3(event, __assign(__assign({}, options), {
    to: function(_, __, _a2) {
      var _event = _a2._event;
      return _event.origin;
    }
  }));
}
var defaultLogExpr = function(context, event) {
  return {
    context,
    event
  };
};
function log$1(expr, label) {
  if (expr === void 0) {
    expr = defaultLogExpr;
  }
  return {
    type: log$2,
    label,
    expr
  };
}
var resolveLog = function(action, ctx, _event) {
  return __assign(__assign({}, action), {
    value: isString(action.expr) ? action.expr : action.expr(ctx, _event.data, {
      _event
    })
  });
};
var cancel = function(sendId) {
  return {
    type: cancel$1,
    sendId
  };
};
function start(activity) {
  var activityDef = toActivityDefinition(activity);
  return {
    type: ActionTypes.Start,
    activity: activityDef,
    exec: void 0
  };
}
function stop(actorRef) {
  var activity = isFunction(actorRef) ? actorRef : toActivityDefinition(actorRef);
  return {
    type: ActionTypes.Stop,
    activity,
    exec: void 0
  };
}
function resolveStop(action, context, _event) {
  var actorRefOrString = isFunction(action.activity) ? action.activity(context, _event.data) : action.activity;
  var resolvedActorRef = typeof actorRefOrString === "string" ? {
    id: actorRefOrString
  } : actorRefOrString;
  var actionObject = {
    type: ActionTypes.Stop,
    activity: resolvedActorRef
  };
  return actionObject;
}
var assign$4 = function(assignment) {
  return {
    type: assign$5,
    assignment
  };
};
function isActionObject(action) {
  return typeof action === "object" && "type" in action;
}
function after(delayRef, id) {
  var idSuffix = id ? "#".concat(id) : "";
  return "".concat(ActionTypes.After, "(").concat(delayRef, ")").concat(idSuffix);
}
function done(id, data) {
  var type = "".concat(ActionTypes.DoneState, ".").concat(id);
  var eventObject = {
    type,
    data
  };
  eventObject.toString = function() {
    return type;
  };
  return eventObject;
}
function doneInvoke(id, data) {
  var type = "".concat(ActionTypes.DoneInvoke, ".").concat(id);
  var eventObject = {
    type,
    data
  };
  eventObject.toString = function() {
    return type;
  };
  return eventObject;
}
function error$1(id, data) {
  var type = "".concat(ActionTypes.ErrorPlatform, ".").concat(id);
  var eventObject = {
    type,
    data
  };
  eventObject.toString = function() {
    return type;
  };
  return eventObject;
}
function pure$1(getActions) {
  return {
    type: ActionTypes.Pure,
    get: getActions
  };
}
function forwardTo(target, options) {
  return send$3(function(_, event) {
    return event;
  }, __assign(__assign({}, options), {
    to: target
  }));
}
function escalate(errorData, options) {
  return sendParent(function(context, event, meta) {
    return {
      type: error$2,
      data: isFunction(errorData) ? errorData(context, event, meta) : errorData
    };
  }, __assign(__assign({}, options), {
    to: SpecialTargets.Parent
  }));
}
function choose(conds) {
  return {
    type: ActionTypes.Choose,
    conds
  };
}
function resolveActions(machine, currentState, currentContext, _event, actions2, preserveActionOrder) {
  if (preserveActionOrder === void 0) {
    preserveActionOrder = false;
  }
  var _a2 = __read(preserveActionOrder ? [[], actions2] : partition(actions2, function(action) {
    return action.type === assign$5;
  }), 2), assignActions = _a2[0], otherActions = _a2[1];
  var updatedContext = assignActions.length ? updateContext(currentContext, _event, assignActions, currentState) : currentContext;
  var preservedContexts = preserveActionOrder ? [currentContext] : void 0;
  var resolvedActions = flatten(otherActions.map(function(actionObject) {
    var _a3;
    switch (actionObject.type) {
      case raise$1:
        return resolveRaise(actionObject);
      case send$4:
        var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays);
        return sendAction;
      case log$2:
        return resolveLog(actionObject, updatedContext, _event);
      case choose$1: {
        var chooseAction = actionObject;
        var matchedActions = (_a3 = chooseAction.conds.find(function(condition) {
          var guard = toGuard(condition.cond, machine.options.guards);
          return !guard || evaluateGuard(machine, guard, updatedContext, _event, currentState);
        })) === null || _a3 === void 0 ? void 0 : _a3.actions;
        if (!matchedActions) {
          return [];
        }
        var _b = __read(resolveActions(machine, currentState, updatedContext, _event, toActionObjects(toArray$1(matchedActions), machine.options.actions), preserveActionOrder), 2), resolvedActionsFromChoose = _b[0], resolvedContextFromChoose = _b[1];
        updatedContext = resolvedContextFromChoose;
        preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
        return resolvedActionsFromChoose;
      }
      case pure$2: {
        var matchedActions = actionObject.get(updatedContext, _event.data);
        if (!matchedActions) {
          return [];
        }
        var _c = __read(resolveActions(machine, currentState, updatedContext, _event, toActionObjects(toArray$1(matchedActions), machine.options.actions), preserveActionOrder), 2), resolvedActionsFromPure = _c[0], resolvedContext = _c[1];
        updatedContext = resolvedContext;
        preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
        return resolvedActionsFromPure;
      }
      case stop$1: {
        return resolveStop(actionObject, updatedContext, _event);
      }
      case assign$5: {
        updatedContext = updateContext(updatedContext, _event, [actionObject], currentState);
        preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
        break;
      }
      default:
        var resolvedActionObject = toActionObject(actionObject, machine.options.actions);
        var exec_1 = resolvedActionObject.exec;
        if (exec_1 && preservedContexts) {
          var contextIndex_1 = preservedContexts.length - 1;
          resolvedActionObject = __assign(__assign({}, resolvedActionObject), {
            exec: function(_ctx) {
              var args = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }
              exec_1.apply(void 0, __spreadArray([preservedContexts[contextIndex_1]], __read(args), false));
            }
          });
        }
        return resolvedActionObject;
    }
  }).filter(function(a) {
    return !!a;
  }));
  return [resolvedActions, updatedContext];
}
var actions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  actionTypes,
  after,
  assign: assign$4,
  cancel,
  choose,
  done,
  doneInvoke,
  error: error$1,
  escalate,
  forwardTo,
  getActionFunction,
  initEvent,
  isActionObject,
  log: log$1,
  pure: pure$1,
  raise,
  resolveActions,
  resolveLog,
  resolveRaise,
  resolveSend,
  resolveStop,
  respond,
  send: send$3,
  sendParent,
  sendTo,
  sendUpdate,
  start,
  stop,
  toActionObject,
  toActionObjects,
  toActivityDefinition
});
var provide = function(service, fn) {
  var result = fn(service);
  return result;
};
function createNullActor(id) {
  var _a2;
  return _a2 = {
    id,
    send: function() {
      return void 0;
    },
    subscribe: function() {
      return {
        unsubscribe: function() {
          return void 0;
        }
      };
    },
    getSnapshot: function() {
      return void 0;
    },
    toJSON: function() {
      return {
        id
      };
    }
  }, _a2[symbolObservable] = function() {
    return this;
  }, _a2;
}
function createInvocableActor(invokeDefinition, machine, context, _event) {
  var _a2;
  var invokeSrc = toInvokeSource$1(invokeDefinition.src);
  var serviceCreator = (_a2 = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a2 === void 0 ? void 0 : _a2[invokeSrc.type];
  var resolvedData = invokeDefinition.data ? mapContext(invokeDefinition.data, context, _event) : void 0;
  var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id);
  tempActor.meta = invokeDefinition;
  return tempActor;
}
function createDeferredActor(entity, id, data) {
  var tempActor = createNullActor(id);
  tempActor.deferred = true;
  if (isMachine(entity)) {
    var initialState_1 = tempActor.state = provide(void 0, function() {
      return (data ? entity.withContext(data) : entity).initialState;
    });
    tempActor.getSnapshot = function() {
      return initialState_1;
    };
  }
  return tempActor;
}
function isActor(item) {
  try {
    return typeof item.send === "function";
  } catch (e) {
    return false;
  }
}
function isSpawnedActor(item) {
  return isActor(item) && "id" in item;
}
function toActorRef(actorRefLike) {
  var _a2;
  return __assign((_a2 = {
    subscribe: function() {
      return {
        unsubscribe: function() {
          return void 0;
        }
      };
    },
    id: "anonymous",
    getSnapshot: function() {
      return void 0;
    }
  }, _a2[symbolObservable] = function() {
    return this;
  }, _a2), actorRefLike);
}
var isLeafNode = function(stateNode) {
  return stateNode.type === "atomic" || stateNode.type === "final";
};
function getChildren(stateNode) {
  return Object.keys(stateNode.states).map(function(key) {
    return stateNode.states[key];
  });
}
function getAllStateNodes(stateNode) {
  var stateNodes = [stateNode];
  if (isLeafNode(stateNode)) {
    return stateNodes;
  }
  return stateNodes.concat(flatten(getChildren(stateNode).map(getAllStateNodes)));
}
function getConfiguration(prevStateNodes, stateNodes) {
  var e_1, _a2, e_2, _b, e_3, _c, e_4, _d;
  var prevConfiguration = new Set(prevStateNodes);
  var prevAdjList = getAdjList(prevConfiguration);
  var configuration = new Set(stateNodes);
  try {
    for (var configuration_1 = __values(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
      var s = configuration_1_1.value;
      var m = s.parent;
      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (configuration_1_1 && !configuration_1_1.done && (_a2 = configuration_1.return))
        _a2.call(configuration_1);
    } finally {
      if (e_1)
        throw e_1.error;
    }
  }
  var adjList = getAdjList(configuration);
  try {
    for (var configuration_2 = __values(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
      var s = configuration_2_1.value;
      if (s.type === "compound" && (!adjList.get(s) || !adjList.get(s).length)) {
        if (prevAdjList.get(s)) {
          prevAdjList.get(s).forEach(function(sn) {
            return configuration.add(sn);
          });
        } else {
          s.initialStateNodes.forEach(function(sn) {
            return configuration.add(sn);
          });
        }
      } else {
        if (s.type === "parallel") {
          try {
            for (var _e = (e_3 = void 0, __values(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
              var child = _f.value;
              if (child.type === "history") {
                continue;
              }
              if (!configuration.has(child)) {
                configuration.add(child);
                if (prevAdjList.get(child)) {
                  prevAdjList.get(child).forEach(function(sn) {
                    return configuration.add(sn);
                  });
                } else {
                  child.initialStateNodes.forEach(function(sn) {
                    return configuration.add(sn);
                  });
                }
              }
            }
          } catch (e_3_1) {
            e_3 = {
              error: e_3_1
            };
          } finally {
            try {
              if (_f && !_f.done && (_c = _e.return))
                _c.call(_e);
            } finally {
              if (e_3)
                throw e_3.error;
            }
          }
        }
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return))
        _b.call(configuration_2);
    } finally {
      if (e_2)
        throw e_2.error;
    }
  }
  try {
    for (var configuration_3 = __values(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
      var s = configuration_3_1.value;
      var m = s.parent;
      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return))
        _d.call(configuration_3);
    } finally {
      if (e_4)
        throw e_4.error;
    }
  }
  return configuration;
}
function getValueFromAdj(baseNode, adjList) {
  var childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {};
  }
  if (baseNode.type === "compound") {
    var childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isLeafNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  var stateValue = {};
  childStateNodes.forEach(function(csn) {
    stateValue[csn.key] = getValueFromAdj(csn, adjList);
  });
  return stateValue;
}
function getAdjList(configuration) {
  var e_5, _a2;
  var adjList = /* @__PURE__ */ new Map();
  try {
    for (var configuration_4 = __values(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
      var s = configuration_4_1.value;
      if (!adjList.has(s)) {
        adjList.set(s, []);
      }
      if (s.parent) {
        if (!adjList.has(s.parent)) {
          adjList.set(s.parent, []);
        }
        adjList.get(s.parent).push(s);
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (configuration_4_1 && !configuration_4_1.done && (_a2 = configuration_4.return))
        _a2.call(configuration_4);
    } finally {
      if (e_5)
        throw e_5.error;
    }
  }
  return adjList;
}
function getValue(rootNode, configuration) {
  var config2 = getConfiguration([rootNode], configuration);
  return getValueFromAdj(rootNode, getAdjList(config2));
}
function has(iterable, item) {
  if (Array.isArray(iterable)) {
    return iterable.some(function(member) {
      return member === item;
    });
  }
  if (iterable instanceof Set) {
    return iterable.has(item);
  }
  return false;
}
function nextEvents(configuration) {
  return __spreadArray([], __read(new Set(flatten(__spreadArray([], __read(configuration.map(function(sn) {
    return sn.ownEvents;
  })), false)))), false);
}
function isInFinalState(configuration, stateNode) {
  if (stateNode.type === "compound") {
    return getChildren(stateNode).some(function(s) {
      return s.type === "final" && has(configuration, s);
    });
  }
  if (stateNode.type === "parallel") {
    return getChildren(stateNode).every(function(sn) {
      return isInFinalState(configuration, sn);
    });
  }
  return false;
}
function getMeta(configuration) {
  if (configuration === void 0) {
    configuration = [];
  }
  return configuration.reduce(function(acc, stateNode) {
    if (stateNode.meta !== void 0) {
      acc[stateNode.id] = stateNode.meta;
    }
    return acc;
  }, {});
}
function getTagsFromConfiguration(configuration) {
  return new Set(flatten(configuration.map(function(sn) {
    return sn.tags;
  })));
}
function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a === void 0 || b === void 0) {
    return false;
  }
  if (isString(a) || isString(b)) {
    return a === b;
  }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(function(key) {
    return stateValuesEqual(a[key], b[key]);
  });
}
function isStateConfig(state) {
  if (typeof state !== "object" || state === null) {
    return false;
  }
  return "value" in state && "_event" in state;
}
function bindActionToState(action, state) {
  var exec = action.exec;
  var boundAction = __assign(__assign({}, action), {
    exec: exec !== void 0 ? function() {
      return exec(state.context, state.event, {
        action,
        state,
        _event: state._event
      });
    } : void 0
  });
  return boundAction;
}
var State = /* @__PURE__ */ function() {
  function State2(config2) {
    var _this = this;
    var _a2;
    this.actions = [];
    this.activities = EMPTY_ACTIVITY_MAP;
    this.meta = {};
    this.events = [];
    this.value = config2.value;
    this.context = config2.context;
    this._event = config2._event;
    this._sessionid = config2._sessionid;
    this.event = this._event.data;
    this.historyValue = config2.historyValue;
    this.history = config2.history;
    this.actions = config2.actions || [];
    this.activities = config2.activities || EMPTY_ACTIVITY_MAP;
    this.meta = getMeta(config2.configuration);
    this.events = config2.events || [];
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config2.configuration;
    this.transitions = config2.transitions;
    this.children = config2.children;
    this.done = !!config2.done;
    this.tags = (_a2 = Array.isArray(config2.tags) ? new Set(config2.tags) : config2.tags) !== null && _a2 !== void 0 ? _a2 : /* @__PURE__ */ new Set();
    this.machine = config2.machine;
    Object.defineProperty(this, "nextEvents", {
      get: function() {
        return nextEvents(_this.configuration);
      }
    });
  }
  State2.from = function(stateValue, context) {
    if (stateValue instanceof State2) {
      if (stateValue.context !== context) {
        return new State2({
          value: stateValue.value,
          context,
          _event: stateValue._event,
          _sessionid: null,
          historyValue: stateValue.historyValue,
          history: stateValue.history,
          actions: [],
          activities: stateValue.activities,
          meta: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {}
        });
      }
      return stateValue;
    }
    var _event = initEvent;
    return new State2({
      value: stateValue,
      context,
      _event,
      _sessionid: null,
      historyValue: void 0,
      history: void 0,
      actions: [],
      activities: void 0,
      meta: void 0,
      events: [],
      configuration: [],
      transitions: [],
      children: {}
    });
  };
  State2.create = function(config2) {
    return new State2(config2);
  };
  State2.inert = function(stateValue, context) {
    if (stateValue instanceof State2) {
      if (!stateValue.actions.length) {
        return stateValue;
      }
      var _event = initEvent;
      return new State2({
        value: stateValue.value,
        context,
        _event,
        _sessionid: null,
        historyValue: stateValue.historyValue,
        history: stateValue.history,
        activities: stateValue.activities,
        configuration: stateValue.configuration,
        transitions: [],
        children: {}
      });
    }
    return State2.from(stateValue, context);
  };
  State2.prototype.toStrings = function(stateValue, delimiter) {
    var _this = this;
    if (stateValue === void 0) {
      stateValue = this.value;
    }
    if (delimiter === void 0) {
      delimiter = ".";
    }
    if (isString(stateValue)) {
      return [stateValue];
    }
    var valueKeys = Object.keys(stateValue);
    return valueKeys.concat.apply(valueKeys, __spreadArray([], __read(valueKeys.map(function(key) {
      return _this.toStrings(stateValue[key], delimiter).map(function(s) {
        return key + delimiter + s;
      });
    })), false));
  };
  State2.prototype.toJSON = function() {
    var _a2 = this;
    _a2.configuration;
    _a2.transitions;
    var tags = _a2.tags;
    _a2.machine;
    var jsonValues = __rest(_a2, ["configuration", "transitions", "tags", "machine"]);
    return __assign(__assign({}, jsonValues), {
      tags: Array.from(tags)
    });
  };
  State2.prototype.matches = function(parentStateValue) {
    return matchesState(parentStateValue, this.value);
  };
  State2.prototype.hasTag = function(tag) {
    return this.tags.has(tag);
  };
  State2.prototype.can = function(event) {
    var _a2;
    {
      warn(!!this.machine);
    }
    var transitionData = (_a2 = this.machine) === null || _a2 === void 0 ? void 0 : _a2.getTransitionData(this, event);
    return !!(transitionData === null || transitionData === void 0 ? void 0 : transitionData.transitions.length) && transitionData.transitions.some(function(t) {
      return t.target !== void 0 || t.actions.length;
    });
  };
  return State2;
}();
var defaultOptions = {
  deferEvents: false
};
var Scheduler = /* @__PURE__ */ function() {
  function Scheduler2(options) {
    this.processingEvent = false;
    this.queue = [];
    this.initialized = false;
    this.options = __assign(__assign({}, defaultOptions), options);
  }
  Scheduler2.prototype.initialize = function(callback) {
    this.initialized = true;
    if (callback) {
      if (!this.options.deferEvents) {
        this.schedule(callback);
        return;
      }
      this.process(callback);
    }
    this.flushEvents();
  };
  Scheduler2.prototype.schedule = function(task) {
    if (!this.initialized || this.processingEvent) {
      this.queue.push(task);
      return;
    }
    if (this.queue.length !== 0) {
      throw new Error("Event queue should be empty when it is not processing events");
    }
    this.process(task);
    this.flushEvents();
  };
  Scheduler2.prototype.clear = function() {
    this.queue = [];
  };
  Scheduler2.prototype.flushEvents = function() {
    var nextCallback = this.queue.shift();
    while (nextCallback) {
      this.process(nextCallback);
      nextCallback = this.queue.shift();
    }
  };
  Scheduler2.prototype.process = function(callback) {
    this.processingEvent = true;
    try {
      callback();
    } catch (e) {
      this.clear();
      throw e;
    } finally {
      this.processingEvent = false;
    }
  };
  return Scheduler2;
}();
var children = /* @__PURE__ */ new Map();
var sessionIdIndex = 0;
var registry = {
  bookId: function() {
    return "x:".concat(sessionIdIndex++);
  },
  register: function(id, actor) {
    children.set(id, actor);
    return id;
  },
  get: function(id) {
    return children.get(id);
  },
  free: function(id) {
    children.delete(id);
  }
};
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
}
function getDevTools() {
  var global2 = getGlobal();
  if (global2 && "__xstate__" in global2) {
    return global2.__xstate__;
  }
  return void 0;
}
function registerService(service) {
  if (!getGlobal()) {
    return;
  }
  var devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
}
function spawnBehavior(behavior, options) {
  if (options === void 0) {
    options = {};
  }
  var state = behavior.initialState;
  var observers = /* @__PURE__ */ new Set();
  var mailbox = [];
  var flushing = false;
  var flush = function() {
    if (flushing) {
      return;
    }
    flushing = true;
    while (mailbox.length > 0) {
      var event_1 = mailbox.shift();
      state = behavior.transition(state, event_1, actorCtx);
      observers.forEach(function(observer) {
        return observer.next(state);
      });
    }
    flushing = false;
  };
  var actor = toActorRef({
    id: options.id,
    send: function(event) {
      mailbox.push(event);
      flush();
    },
    getSnapshot: function() {
      return state;
    },
    subscribe: function(next, handleError2, complete) {
      var observer = toObserver(next, handleError2, complete);
      observers.add(observer);
      observer.next(state);
      return {
        unsubscribe: function() {
          observers.delete(observer);
        }
      };
    }
  });
  var actorCtx = {
    parent: options.parent,
    self: actor,
    id: options.id || "anonymous",
    observers
  };
  state = behavior.start ? behavior.start(actorCtx) : state;
  return actor;
}
var DEFAULT_SPAWN_OPTIONS = {
  sync: false,
  autoForward: false
};
var InterpreterStatus;
(function(InterpreterStatus2) {
  InterpreterStatus2[InterpreterStatus2["NotStarted"] = 0] = "NotStarted";
  InterpreterStatus2[InterpreterStatus2["Running"] = 1] = "Running";
  InterpreterStatus2[InterpreterStatus2["Stopped"] = 2] = "Stopped";
})(InterpreterStatus || (InterpreterStatus = {}));
var Interpreter = /* @__PURE__ */ function() {
  function Interpreter2(machine, options) {
    var _this = this;
    if (options === void 0) {
      options = Interpreter2.defaultOptions;
    }
    this.machine = machine;
    this.scheduler = new Scheduler();
    this.delayedEventsMap = {};
    this.listeners = /* @__PURE__ */ new Set();
    this.contextListeners = /* @__PURE__ */ new Set();
    this.stopListeners = /* @__PURE__ */ new Set();
    this.doneListeners = /* @__PURE__ */ new Set();
    this.eventListeners = /* @__PURE__ */ new Set();
    this.sendListeners = /* @__PURE__ */ new Set();
    this.initialized = false;
    this.status = InterpreterStatus.NotStarted;
    this.children = /* @__PURE__ */ new Map();
    this.forwardTo = /* @__PURE__ */ new Set();
    this.init = this.start;
    this.send = function(event, payload) {
      if (isArray(event)) {
        _this.batch(event);
        return _this.state;
      }
      var _event = toSCXMLEvent(toEventObject(event, payload));
      if (_this.status === InterpreterStatus.Stopped) {
        return _this.state;
      }
      if (_this.status !== InterpreterStatus.Running && !_this.options.deferEvents) {
        throw new Error('Event "'.concat(_event.name, '" was sent to uninitialized service "').concat(_this.machine.id, '". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: ').concat(JSON.stringify(_event.data)));
      }
      _this.scheduler.schedule(function() {
        _this.forward(_event);
        var nextState = _this.nextState(_event);
        _this.update(nextState, _event);
      });
      return _this._state;
    };
    this.sendTo = function(event, to) {
      var isParent = _this.parent && (to === SpecialTargets.Parent || _this.parent.id === to);
      var target = isParent ? _this.parent : isString(to) ? _this.children.get(to) || registry.get(to) : isActor$1(to) ? to : void 0;
      if (!target) {
        if (!isParent) {
          throw new Error("Unable to send event to child '".concat(to, "' from service '").concat(_this.id, "'."));
        }
        return;
      }
      if ("machine" in target) {
        target.send(__assign(__assign({}, event), {
          name: event.name === error$2 ? "".concat(error$1(_this.id)) : event.name,
          origin: _this.sessionId
        }));
      } else {
        target.send(event.data);
      }
    };
    var resolvedOptions = __assign(__assign({}, Interpreter2.defaultOptions), options);
    var clock = resolvedOptions.clock, logger = resolvedOptions.logger, parent = resolvedOptions.parent, id = resolvedOptions.id;
    var resolvedId = id !== void 0 ? id : machine.id;
    this.id = resolvedId;
    this.logger = logger;
    this.clock = clock;
    this.parent = parent;
    this.options = resolvedOptions;
    this.scheduler = new Scheduler({
      deferEvents: this.options.deferEvents
    });
    this.sessionId = registry.bookId();
  }
  Object.defineProperty(Interpreter2.prototype, "initialState", {
    get: function() {
      var _this = this;
      if (this._initialState) {
        return this._initialState;
      }
      return provide(this, function() {
        _this._initialState = _this.machine.initialState;
        return _this._initialState;
      });
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Interpreter2.prototype, "state", {
    get: function() {
      return this._state;
    },
    enumerable: false,
    configurable: true
  });
  Interpreter2.prototype.execute = function(state, actionsConfig) {
    var e_1, _a2;
    try {
      for (var _b = __values(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        this.exec(action, state, actionsConfig);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b.return))
          _a2.call(_b);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
  };
  Interpreter2.prototype.update = function(state, _event) {
    var e_2, _a2, e_3, _b, e_4, _c, e_5, _d;
    var _this = this;
    state._sessionid = this.sessionId;
    this._state = state;
    if (this.options.execute) {
      this.execute(this.state);
    }
    this.children.forEach(function(child) {
      _this.state.children[child.id] = child;
    });
    if (this.devTools) {
      this.devTools.send(_event.data, state);
    }
    if (state.event) {
      try {
        for (var _e = __values(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
          var listener3 = _f.value;
          listener3(state.event);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_f && !_f.done && (_a2 = _e.return))
            _a2.call(_e);
        } finally {
          if (e_2)
            throw e_2.error;
        }
      }
    }
    try {
      for (var _g = __values(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
        var listener3 = _h.value;
        listener3(state, state.event);
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_h && !_h.done && (_b = _g.return))
          _b.call(_g);
      } finally {
        if (e_3)
          throw e_3.error;
      }
    }
    try {
      for (var _j = __values(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
        var contextListener = _k.value;
        contextListener(this.state.context, this.state.history ? this.state.history.context : void 0);
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_k && !_k.done && (_c = _j.return))
          _c.call(_j);
      } finally {
        if (e_4)
          throw e_4.error;
      }
    }
    var isDone = isInFinalState(state.configuration || [], this.machine);
    if (this.state.configuration && isDone) {
      var finalChildStateNode = state.configuration.find(function(sn) {
        return sn.type === "final" && sn.parent === _this.machine;
      });
      var doneData = finalChildStateNode && finalChildStateNode.doneData ? mapContext(finalChildStateNode.doneData, state.context, _event) : void 0;
      try {
        for (var _l = __values(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
          var listener3 = _m.value;
          listener3(doneInvoke(this.id, doneData));
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (_m && !_m.done && (_d = _l.return))
            _d.call(_l);
        } finally {
          if (e_5)
            throw e_5.error;
        }
      }
      this.stop();
    }
  };
  Interpreter2.prototype.onTransition = function(listener3) {
    this.listeners.add(listener3);
    if (this.status === InterpreterStatus.Running) {
      listener3(this.state, this.state.event);
    }
    return this;
  };
  Interpreter2.prototype.subscribe = function(nextListenerOrObserver, _, completeListener) {
    var _this = this;
    if (!nextListenerOrObserver) {
      return {
        unsubscribe: function() {
          return void 0;
        }
      };
    }
    var listener3;
    var resolvedCompleteListener = completeListener;
    if (typeof nextListenerOrObserver === "function") {
      listener3 = nextListenerOrObserver;
    } else {
      listener3 = nextListenerOrObserver.next.bind(nextListenerOrObserver);
      resolvedCompleteListener = nextListenerOrObserver.complete.bind(nextListenerOrObserver);
    }
    this.listeners.add(listener3);
    if (this.status === InterpreterStatus.Running) {
      listener3(this.state);
    }
    if (resolvedCompleteListener) {
      this.onDone(resolvedCompleteListener);
    }
    return {
      unsubscribe: function() {
        listener3 && _this.listeners.delete(listener3);
        resolvedCompleteListener && _this.doneListeners.delete(resolvedCompleteListener);
      }
    };
  };
  Interpreter2.prototype.onEvent = function(listener3) {
    this.eventListeners.add(listener3);
    return this;
  };
  Interpreter2.prototype.onSend = function(listener3) {
    this.sendListeners.add(listener3);
    return this;
  };
  Interpreter2.prototype.onChange = function(listener3) {
    this.contextListeners.add(listener3);
    return this;
  };
  Interpreter2.prototype.onStop = function(listener3) {
    this.stopListeners.add(listener3);
    return this;
  };
  Interpreter2.prototype.onDone = function(listener3) {
    this.doneListeners.add(listener3);
    return this;
  };
  Interpreter2.prototype.off = function(listener3) {
    this.listeners.delete(listener3);
    this.eventListeners.delete(listener3);
    this.sendListeners.delete(listener3);
    this.stopListeners.delete(listener3);
    this.doneListeners.delete(listener3);
    this.contextListeners.delete(listener3);
    return this;
  };
  Interpreter2.prototype.start = function(initialState) {
    var _this = this;
    if (this.status === InterpreterStatus.Running) {
      return this;
    }
    this.machine._init();
    registry.register(this.sessionId, this);
    this.initialized = true;
    this.status = InterpreterStatus.Running;
    var resolvedState = initialState === void 0 ? this.initialState : provide(this, function() {
      return isStateConfig(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(State.from(initialState, _this.machine.context));
    });
    if (this.options.devTools) {
      this.attachDev();
    }
    this.scheduler.initialize(function() {
      _this.update(resolvedState, initEvent);
    });
    return this;
  };
  Interpreter2.prototype.stop = function() {
    var e_6, _a2, e_7, _b, e_8, _c, e_9, _d, e_10, _e;
    var _this = this;
    try {
      for (var _f = __values(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
        var listener3 = _g.value;
        this.listeners.delete(listener3);
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (_g && !_g.done && (_a2 = _f.return))
          _a2.call(_f);
      } finally {
        if (e_6)
          throw e_6.error;
      }
    }
    try {
      for (var _h = __values(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
        var listener3 = _j.value;
        listener3();
        this.stopListeners.delete(listener3);
      }
    } catch (e_7_1) {
      e_7 = {
        error: e_7_1
      };
    } finally {
      try {
        if (_j && !_j.done && (_b = _h.return))
          _b.call(_h);
      } finally {
        if (e_7)
          throw e_7.error;
      }
    }
    try {
      for (var _k = __values(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
        var listener3 = _l.value;
        this.contextListeners.delete(listener3);
      }
    } catch (e_8_1) {
      e_8 = {
        error: e_8_1
      };
    } finally {
      try {
        if (_l && !_l.done && (_c = _k.return))
          _c.call(_k);
      } finally {
        if (e_8)
          throw e_8.error;
      }
    }
    try {
      for (var _m = __values(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
        var listener3 = _o.value;
        this.doneListeners.delete(listener3);
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (_o && !_o.done && (_d = _m.return))
          _d.call(_m);
      } finally {
        if (e_9)
          throw e_9.error;
      }
    }
    if (!this.initialized) {
      return this;
    }
    __spreadArray([], __read(this.state.configuration), false).sort(function(a, b) {
      return b.order - a.order;
    }).forEach(function(stateNode) {
      var e_11, _a3;
      try {
        for (var _b2 = __values(stateNode.definition.exit), _c2 = _b2.next(); !_c2.done; _c2 = _b2.next()) {
          var action = _c2.value;
          _this.exec(action, _this.state);
        }
      } catch (e_11_1) {
        e_11 = {
          error: e_11_1
        };
      } finally {
        try {
          if (_c2 && !_c2.done && (_a3 = _b2.return))
            _a3.call(_b2);
        } finally {
          if (e_11)
            throw e_11.error;
        }
      }
    });
    this.children.forEach(function(child) {
      if (isFunction(child.stop)) {
        child.stop();
      }
    });
    try {
      for (var _p = __values(Object.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
        var key = _q.value;
        this.clock.clearTimeout(this.delayedEventsMap[key]);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (_q && !_q.done && (_e = _p.return))
          _e.call(_p);
      } finally {
        if (e_10)
          throw e_10.error;
      }
    }
    this.scheduler.clear();
    this.initialized = false;
    this.status = InterpreterStatus.Stopped;
    registry.free(this.sessionId);
    return this;
  };
  Interpreter2.prototype.batch = function(events) {
    var _this = this;
    if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents)
      ;
    else if (this.status !== InterpreterStatus.Running) {
      throw new Error("".concat(events.length, ' event(s) were sent to uninitialized service "').concat(this.machine.id, '". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.'));
    }
    this.scheduler.schedule(function() {
      var e_12, _a2;
      var nextState = _this.state;
      var batchChanged = false;
      var batchedActions = [];
      var _loop_1 = function(event_12) {
        var _event = toSCXMLEvent(event_12);
        _this.forward(_event);
        nextState = provide(_this, function() {
          return _this.machine.transition(nextState, _event);
        });
        batchedActions.push.apply(batchedActions, __spreadArray([], __read(nextState.actions.map(function(a) {
          return bindActionToState(a, nextState);
        })), false));
        batchChanged = batchChanged || !!nextState.changed;
      };
      try {
        for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
          var event_1 = events_1_1.value;
          _loop_1(event_1);
        }
      } catch (e_12_1) {
        e_12 = {
          error: e_12_1
        };
      } finally {
        try {
          if (events_1_1 && !events_1_1.done && (_a2 = events_1.return))
            _a2.call(events_1);
        } finally {
          if (e_12)
            throw e_12.error;
        }
      }
      nextState.changed = batchChanged;
      nextState.actions = batchedActions;
      _this.update(nextState, toSCXMLEvent(events[events.length - 1]));
    });
  };
  Interpreter2.prototype.sender = function(event) {
    return this.send.bind(this, event);
  };
  Interpreter2.prototype.nextState = function(event) {
    var _this = this;
    var _event = toSCXMLEvent(event);
    if (_event.name.indexOf(errorPlatform) === 0 && !this.state.nextEvents.some(function(nextEvent) {
      return nextEvent.indexOf(errorPlatform) === 0;
    })) {
      throw _event.data.data;
    }
    var nextState = provide(this, function() {
      return _this.machine.transition(_this.state, _event);
    });
    return nextState;
  };
  Interpreter2.prototype.forward = function(event) {
    var e_13, _a2;
    try {
      for (var _b = __values(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
        var id = _c.value;
        var child = this.children.get(id);
        if (!child) {
          throw new Error("Unable to forward event '".concat(event, "' from interpreter '").concat(this.id, "' to nonexistant child '").concat(id, "'."));
        }
        child.send(event);
      }
    } catch (e_13_1) {
      e_13 = {
        error: e_13_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b.return))
          _a2.call(_b);
      } finally {
        if (e_13)
          throw e_13.error;
      }
    }
  };
  Interpreter2.prototype.defer = function(sendAction) {
    var _this = this;
    this.delayedEventsMap[sendAction.id] = this.clock.setTimeout(function() {
      if (sendAction.to) {
        _this.sendTo(sendAction._event, sendAction.to);
      } else {
        _this.send(sendAction._event);
      }
    }, sendAction.delay);
  };
  Interpreter2.prototype.cancel = function(sendId) {
    this.clock.clearTimeout(this.delayedEventsMap[sendId]);
    delete this.delayedEventsMap[sendId];
  };
  Interpreter2.prototype.exec = function(action, state, actionFunctionMap) {
    if (actionFunctionMap === void 0) {
      actionFunctionMap = this.machine.options.actions;
    }
    var context = state.context, _event = state._event;
    var actionOrExec = action.exec || getActionFunction(action.type, actionFunctionMap);
    var exec = isFunction(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;
    if (exec) {
      try {
        return exec(context, _event.data, {
          action,
          state: this.state,
          _event
        });
      } catch (err) {
        if (this.parent) {
          this.parent.send({
            type: "xstate.error",
            data: err
          });
        }
        throw err;
      }
    }
    switch (action.type) {
      case send$4:
        var sendAction = action;
        if (typeof sendAction.delay === "number") {
          this.defer(sendAction);
          return;
        } else {
          if (sendAction.to) {
            this.sendTo(sendAction._event, sendAction.to);
          } else {
            this.send(sendAction._event);
          }
        }
        break;
      case cancel$1:
        this.cancel(action.sendId);
        break;
      case start$1: {
        if (this.status !== InterpreterStatus.Running) {
          return;
        }
        var activity = action.activity;
        if (!this.state.activities[activity.id || activity.type]) {
          break;
        }
        if (activity.type === ActionTypes.Invoke) {
          var invokeSource = toInvokeSource$1(activity.src);
          var serviceCreator = this.machine.options.services ? this.machine.options.services[invokeSource.type] : void 0;
          var id = activity.id, data = activity.data;
          var autoForward = "autoForward" in activity ? activity.autoForward : !!activity.forward;
          if (!serviceCreator) {
            return;
          }
          var resolvedData = data ? mapContext(data, context, _event) : void 0;
          if (typeof serviceCreator === "string") {
            return;
          }
          var source = isFunction(serviceCreator) ? serviceCreator(context, _event.data, {
            data: resolvedData,
            src: invokeSource,
            meta: activity.meta
          }) : serviceCreator;
          if (!source) {
            return;
          }
          var options = void 0;
          if (isMachine(source)) {
            source = resolvedData ? source.withContext(resolvedData) : source;
            options = {
              autoForward
            };
          }
          this.spawn(source, id, options);
        } else {
          this.spawnActivity(activity);
        }
        break;
      }
      case stop$1: {
        this.stopChild(action.activity.id);
        break;
      }
      case log$2:
        var label = action.label, value = action.value;
        if (label) {
          this.logger(label, value);
        } else {
          this.logger(value);
        }
        break;
    }
    return void 0;
  };
  Interpreter2.prototype.removeChild = function(childId) {
    var _a2;
    this.children.delete(childId);
    this.forwardTo.delete(childId);
    (_a2 = this.state) === null || _a2 === void 0 ? true : delete _a2.children[childId];
  };
  Interpreter2.prototype.stopChild = function(childId) {
    var child = this.children.get(childId);
    if (!child) {
      return;
    }
    this.removeChild(childId);
    if (isFunction(child.stop)) {
      child.stop();
    }
  };
  Interpreter2.prototype.spawn = function(entity, name, options) {
    if (isPromiseLike(entity)) {
      return this.spawnPromise(Promise.resolve(entity), name);
    } else if (isFunction(entity)) {
      return this.spawnCallback(entity, name);
    } else if (isSpawnedActor(entity)) {
      return this.spawnActor(entity, name);
    } else if (isObservable(entity)) {
      return this.spawnObservable(entity, name);
    } else if (isMachine(entity)) {
      return this.spawnMachine(entity, __assign(__assign({}, options), {
        id: name
      }));
    } else if (isBehavior(entity)) {
      return this.spawnBehavior(entity, name);
    } else {
      throw new Error('Unable to spawn entity "'.concat(name, '" of type "').concat(typeof entity, '".'));
    }
  };
  Interpreter2.prototype.spawnMachine = function(machine, options) {
    var _this = this;
    if (options === void 0) {
      options = {};
    }
    var childService = new Interpreter2(machine, __assign(__assign({}, this.options), {
      parent: this,
      id: options.id || machine.id
    }));
    var resolvedOptions = __assign(__assign({}, DEFAULT_SPAWN_OPTIONS), options);
    if (resolvedOptions.sync) {
      childService.onTransition(function(state) {
        _this.send(update, {
          state,
          id: childService.id
        });
      });
    }
    var actor = childService;
    this.children.set(childService.id, actor);
    if (resolvedOptions.autoForward) {
      this.forwardTo.add(childService.id);
    }
    childService.onDone(function(doneEvent) {
      _this.removeChild(childService.id);
      _this.send(toSCXMLEvent(doneEvent, {
        origin: childService.id
      }));
    }).start();
    return actor;
  };
  Interpreter2.prototype.spawnBehavior = function(behavior, id) {
    var actorRef = spawnBehavior(behavior, {
      id,
      parent: this
    });
    this.children.set(id, actorRef);
    return actorRef;
  };
  Interpreter2.prototype.spawnPromise = function(promise, id) {
    var _a2;
    var _this = this;
    var canceled = false;
    var resolvedData;
    promise.then(function(response) {
      if (!canceled) {
        resolvedData = response;
        _this.removeChild(id);
        _this.send(toSCXMLEvent(doneInvoke(id, response), {
          origin: id
        }));
      }
    }, function(errorData) {
      if (!canceled) {
        _this.removeChild(id);
        var errorEvent = error$1(id, errorData);
        try {
          _this.send(toSCXMLEvent(errorEvent, {
            origin: id
          }));
        } catch (error2) {
          if (_this.devTools) {
            _this.devTools.send(errorEvent, _this.state);
          }
          if (_this.machine.strict) {
            _this.stop();
          }
        }
      }
    });
    var actor = (_a2 = {
      id,
      send: function() {
        return void 0;
      },
      subscribe: function(next, handleError2, complete) {
        var observer = toObserver(next, handleError2, complete);
        var unsubscribed = false;
        promise.then(function(response) {
          if (unsubscribed) {
            return;
          }
          observer.next(response);
          if (unsubscribed) {
            return;
          }
          observer.complete();
        }, function(err) {
          if (unsubscribed) {
            return;
          }
          observer.error(err);
        });
        return {
          unsubscribe: function() {
            return unsubscribed = true;
          }
        };
      },
      stop: function() {
        canceled = true;
      },
      toJSON: function() {
        return {
          id
        };
      },
      getSnapshot: function() {
        return resolvedData;
      }
    }, _a2[symbolObservable] = function() {
      return this;
    }, _a2);
    this.children.set(id, actor);
    return actor;
  };
  Interpreter2.prototype.spawnCallback = function(callback, id) {
    var _a2;
    var _this = this;
    var canceled = false;
    var receivers = /* @__PURE__ */ new Set();
    var listeners = /* @__PURE__ */ new Set();
    var emitted;
    var receive = function(e) {
      emitted = e;
      listeners.forEach(function(listener3) {
        return listener3(e);
      });
      if (canceled) {
        return;
      }
      _this.send(toSCXMLEvent(e, {
        origin: id
      }));
    };
    var callbackStop;
    try {
      callbackStop = callback(receive, function(newListener) {
        receivers.add(newListener);
      });
    } catch (err) {
      this.send(error$1(id, err));
    }
    if (isPromiseLike(callbackStop)) {
      return this.spawnPromise(callbackStop, id);
    }
    var actor = (_a2 = {
      id,
      send: function(event) {
        return receivers.forEach(function(receiver) {
          return receiver(event);
        });
      },
      subscribe: function(next) {
        var observer = toObserver(next);
        listeners.add(observer.next);
        return {
          unsubscribe: function() {
            listeners.delete(observer.next);
          }
        };
      },
      stop: function() {
        canceled = true;
        if (isFunction(callbackStop)) {
          callbackStop();
        }
      },
      toJSON: function() {
        return {
          id
        };
      },
      getSnapshot: function() {
        return emitted;
      }
    }, _a2[symbolObservable] = function() {
      return this;
    }, _a2);
    this.children.set(id, actor);
    return actor;
  };
  Interpreter2.prototype.spawnObservable = function(source, id) {
    var _a2;
    var _this = this;
    var emitted;
    var subscription = source.subscribe(function(value) {
      emitted = value;
      _this.send(toSCXMLEvent(value, {
        origin: id
      }));
    }, function(err) {
      _this.removeChild(id);
      _this.send(toSCXMLEvent(error$1(id, err), {
        origin: id
      }));
    }, function() {
      _this.removeChild(id);
      _this.send(toSCXMLEvent(doneInvoke(id), {
        origin: id
      }));
    });
    var actor = (_a2 = {
      id,
      send: function() {
        return void 0;
      },
      subscribe: function(next, handleError2, complete) {
        return source.subscribe(next, handleError2, complete);
      },
      stop: function() {
        return subscription.unsubscribe();
      },
      getSnapshot: function() {
        return emitted;
      },
      toJSON: function() {
        return {
          id
        };
      }
    }, _a2[symbolObservable] = function() {
      return this;
    }, _a2);
    this.children.set(id, actor);
    return actor;
  };
  Interpreter2.prototype.spawnActor = function(actor, name) {
    this.children.set(name, actor);
    return actor;
  };
  Interpreter2.prototype.spawnActivity = function(activity) {
    var implementation = this.machine.options && this.machine.options.activities ? this.machine.options.activities[activity.type] : void 0;
    if (!implementation) {
      return;
    }
    var dispose = implementation(this.state.context, activity);
    this.spawnEffect(activity.id, dispose);
  };
  Interpreter2.prototype.spawnEffect = function(id, dispose) {
    var _a2;
    this.children.set(id, (_a2 = {
      id,
      send: function() {
        return void 0;
      },
      subscribe: function() {
        return {
          unsubscribe: function() {
            return void 0;
          }
        };
      },
      stop: dispose || void 0,
      getSnapshot: function() {
        return void 0;
      },
      toJSON: function() {
        return {
          id
        };
      }
    }, _a2[symbolObservable] = function() {
      return this;
    }, _a2));
  };
  Interpreter2.prototype.attachDev = function() {
    var global2 = getGlobal();
    if (this.options.devTools && global2) {
      if (global2.__REDUX_DEVTOOLS_EXTENSION__) {
        var devToolsOptions = typeof this.options.devTools === "object" ? this.options.devTools : void 0;
        this.devTools = global2.__REDUX_DEVTOOLS_EXTENSION__.connect(__assign(__assign({
          name: this.id,
          autoPause: true,
          stateSanitizer: function(state) {
            return {
              value: state.value,
              context: state.context,
              actions: state.actions
            };
          }
        }, devToolsOptions), {
          features: __assign({
            jump: false,
            skip: false
          }, devToolsOptions ? devToolsOptions.features : void 0)
        }), this.machine);
        this.devTools.init(this.state);
      }
      registerService(this);
    }
  };
  Interpreter2.prototype.toJSON = function() {
    return {
      id: this.id
    };
  };
  Interpreter2.prototype[symbolObservable] = function() {
    return this;
  };
  Interpreter2.prototype.getSnapshot = function() {
    if (this.status === InterpreterStatus.NotStarted) {
      return this.initialState;
    }
    return this._state;
  };
  Interpreter2.defaultOptions = {
    execute: true,
    deferEvents: true,
    clock: {
      setTimeout: function(fn, ms) {
        return setTimeout(fn, ms);
      },
      clearTimeout: function(id) {
        return clearTimeout(id);
      }
    },
    logger: /* @__PURE__ */ console.log.bind(console),
    devTools: false
  };
  Interpreter2.interpret = interpret;
  return Interpreter2;
}();
function interpret(machine, options) {
  var interpreter = new Interpreter(machine, options);
  return interpreter;
}
function toInvokeSource(src) {
  if (typeof src === "string") {
    var simpleSrc = {
      type: src
    };
    simpleSrc.toString = function() {
      return src;
    };
    return simpleSrc;
  }
  return src;
}
function toInvokeDefinition(invokeConfig) {
  return __assign(__assign({
    type: invoke
  }, invokeConfig), {
    toJSON: function() {
      invokeConfig.onDone;
      invokeConfig.onError;
      var invokeDef = __rest(invokeConfig, ["onDone", "onError"]);
      return __assign(__assign({}, invokeDef), {
        type: invoke,
        src: toInvokeSource(invokeConfig.src)
      });
    }
  });
}
var NULL_EVENT = "";
var STATE_IDENTIFIER = "#";
var WILDCARD = "*";
var EMPTY_OBJECT = {};
var isStateId = function(str) {
  return str[0] === STATE_IDENTIFIER;
};
var createDefaultOptions = function() {
  return {
    actions: {},
    guards: {},
    services: {},
    activities: {},
    delays: {}
  };
};
var validateArrayifiedTransitions = function(stateNode, event, transitions) {
  var hasNonLastUnguardedTarget = transitions.slice(0, -1).some(function(transition) {
    return !("cond" in transition) && !("in" in transition) && (isString(transition.target) || isMachine(transition.target));
  });
  var eventText = event === NULL_EVENT ? "the transient event" : "event '".concat(event, "'");
  warn(!hasNonLastUnguardedTarget, "One or more transitions for ".concat(eventText, " on state '").concat(stateNode.id, "' are unreachable. ") + "Make sure that the default transition is the last one defined.");
};
var StateNode = /* @__PURE__ */ function() {
  function StateNode2(config2, options, _context, _stateInfo) {
    var _this = this;
    if (_context === void 0) {
      _context = "context" in config2 ? config2.context : void 0;
    }
    var _a2;
    this.config = config2;
    this._context = _context;
    this.order = -1;
    this.__xstatenode = true;
    this.__cache = {
      events: void 0,
      relativeValue: /* @__PURE__ */ new Map(),
      initialStateValue: void 0,
      initialState: void 0,
      on: void 0,
      transitions: void 0,
      candidates: {},
      delayedTransitions: void 0
    };
    this.idMap = {};
    this.tags = [];
    this.options = Object.assign(createDefaultOptions(), options);
    this.parent = _stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.parent;
    this.key = this.config.key || (_stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.key) || this.config.id || "(machine)";
    this.machine = this.parent ? this.parent.machine : this;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : STATE_DELIMITER);
    this.id = this.config.id || __spreadArray([this.machine.key], __read(this.path), false).join(this.delimiter);
    this.version = this.parent ? this.parent.version : this.config.version;
    this.type = this.config.type || (this.config.parallel ? "parallel" : this.config.states && Object.keys(this.config.states).length ? "compound" : this.config.history ? "history" : "atomic");
    this.schema = this.parent ? this.machine.schema : (_a2 = this.config.schema) !== null && _a2 !== void 0 ? _a2 : {};
    this.description = this.config.description;
    this.initial = this.config.initial;
    this.states = this.config.states ? mapValues(this.config.states, function(stateConfig, key) {
      var _a3;
      var stateNode = new StateNode2(stateConfig, {}, void 0, {
        parent: _this,
        key
      });
      Object.assign(_this.idMap, __assign((_a3 = {}, _a3[stateNode.id] = stateNode, _a3), stateNode.idMap));
      return stateNode;
    }) : EMPTY_OBJECT;
    var order = 0;
    function dfs(stateNode) {
      var e_1, _a3;
      stateNode.order = order++;
      try {
        for (var _b = __values(getChildren(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var child = _c.value;
          dfs(child);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a3 = _b.return))
            _a3.call(_b);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
    }
    dfs(this);
    this.history = this.config.history === true ? "shallow" : this.config.history || false;
    this._transient = !!this.config.always || (!this.config.on ? false : Array.isArray(this.config.on) ? this.config.on.some(function(_a3) {
      var event = _a3.event;
      return event === NULL_EVENT;
    }) : NULL_EVENT in this.config.on);
    this.strict = !!this.config.strict;
    this.onEntry = toArray$1(this.config.entry || this.config.onEntry).map(function(action) {
      return toActionObject(action);
    });
    this.onExit = toArray$1(this.config.exit || this.config.onExit).map(function(action) {
      return toActionObject(action);
    });
    this.meta = this.config.meta;
    this.doneData = this.type === "final" ? this.config.data : void 0;
    this.invoke = toArray$1(this.config.invoke).map(function(invokeConfig, i) {
      var _a3, _b;
      if (isMachine(invokeConfig)) {
        var invokeId = createInvokeId(_this.id, i);
        _this.machine.options.services = __assign((_a3 = {}, _a3[invokeId] = invokeConfig, _a3), _this.machine.options.services);
        return toInvokeDefinition({
          src: invokeId,
          id: invokeId
        });
      } else if (isString(invokeConfig.src)) {
        var invokeId = invokeConfig.id || createInvokeId(_this.id, i);
        return toInvokeDefinition(__assign(__assign({}, invokeConfig), {
          id: invokeId,
          src: invokeConfig.src
        }));
      } else if (isMachine(invokeConfig.src) || isFunction(invokeConfig.src)) {
        var invokeId = invokeConfig.id || createInvokeId(_this.id, i);
        _this.machine.options.services = __assign((_b = {}, _b[invokeId] = invokeConfig.src, _b), _this.machine.options.services);
        return toInvokeDefinition(__assign(__assign({
          id: invokeId
        }, invokeConfig), {
          src: invokeId
        }));
      } else {
        var invokeSource = invokeConfig.src;
        return toInvokeDefinition(__assign(__assign({
          id: createInvokeId(_this.id, i)
        }, invokeConfig), {
          src: invokeSource
        }));
      }
    });
    this.activities = toArray$1(this.config.activities).concat(this.invoke).map(function(activity) {
      return toActivityDefinition(activity);
    });
    this.transition = this.transition.bind(this);
    this.tags = toArray$1(this.config.tags);
  }
  StateNode2.prototype._init = function() {
    if (this.__cache.transitions) {
      return;
    }
    getAllStateNodes(this).forEach(function(stateNode) {
      return stateNode.on;
    });
  };
  StateNode2.prototype.withConfig = function(options, context) {
    var _a2 = this.options, actions2 = _a2.actions, activities = _a2.activities, guards = _a2.guards, services = _a2.services, delays = _a2.delays;
    return new StateNode2(this.config, {
      actions: __assign(__assign({}, actions2), options.actions),
      activities: __assign(__assign({}, activities), options.activities),
      guards: __assign(__assign({}, guards), options.guards),
      services: __assign(__assign({}, services), options.services),
      delays: __assign(__assign({}, delays), options.delays)
    }, context !== null && context !== void 0 ? context : this.context);
  };
  StateNode2.prototype.withContext = function(context) {
    return new StateNode2(this.config, this.options, context);
  };
  Object.defineProperty(StateNode2.prototype, "context", {
    get: function() {
      return isFunction(this._context) ? this._context() : this._context;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode2.prototype, "definition", {
    get: function() {
      return {
        id: this.id,
        key: this.key,
        version: this.version,
        context: this.context,
        type: this.type,
        initial: this.initial,
        history: this.history,
        states: mapValues(this.states, function(state) {
          return state.definition;
        }),
        on: this.on,
        transitions: this.transitions,
        entry: this.onEntry,
        exit: this.onExit,
        activities: this.activities || [],
        meta: this.meta,
        order: this.order || -1,
        data: this.doneData,
        invoke: this.invoke,
        description: this.description,
        tags: this.tags
      };
    },
    enumerable: false,
    configurable: true
  });
  StateNode2.prototype.toJSON = function() {
    return this.definition;
  };
  Object.defineProperty(StateNode2.prototype, "on", {
    get: function() {
      if (this.__cache.on) {
        return this.__cache.on;
      }
      var transitions = this.transitions;
      return this.__cache.on = transitions.reduce(function(map, transition) {
        map[transition.eventType] = map[transition.eventType] || [];
        map[transition.eventType].push(transition);
        return map;
      }, {});
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode2.prototype, "after", {
    get: function() {
      return this.__cache.delayedTransitions || (this.__cache.delayedTransitions = this.getDelayedTransitions(), this.__cache.delayedTransitions);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode2.prototype, "transitions", {
    get: function() {
      return this.__cache.transitions || (this.__cache.transitions = this.formatTransitions(), this.__cache.transitions);
    },
    enumerable: false,
    configurable: true
  });
  StateNode2.prototype.getCandidates = function(eventName) {
    if (this.__cache.candidates[eventName]) {
      return this.__cache.candidates[eventName];
    }
    var transient = eventName === NULL_EVENT;
    var candidates = this.transitions.filter(function(transition) {
      var sameEventType = transition.eventType === eventName;
      return transient ? sameEventType : sameEventType || transition.eventType === WILDCARD;
    });
    this.__cache.candidates[eventName] = candidates;
    return candidates;
  };
  StateNode2.prototype.getDelayedTransitions = function() {
    var _this = this;
    var afterConfig = this.config.after;
    if (!afterConfig) {
      return [];
    }
    var mutateEntryExit = function(delay, i) {
      var delayRef = isFunction(delay) ? "".concat(_this.id, ":delay[").concat(i, "]") : delay;
      var eventType = after(delayRef, _this.id);
      _this.onEntry.push(send$3(eventType, {
        delay
      }));
      _this.onExit.push(cancel(eventType));
      return eventType;
    };
    var delayedTransitions = isArray(afterConfig) ? afterConfig.map(function(transition, i) {
      var eventType = mutateEntryExit(transition.delay, i);
      return __assign(__assign({}, transition), {
        event: eventType
      });
    }) : flatten(Object.keys(afterConfig).map(function(delay, i) {
      var configTransition = afterConfig[delay];
      var resolvedTransition = isString(configTransition) ? {
        target: configTransition
      } : configTransition;
      var resolvedDelay = !isNaN(+delay) ? +delay : delay;
      var eventType = mutateEntryExit(resolvedDelay, i);
      return toArray$1(resolvedTransition).map(function(transition) {
        return __assign(__assign({}, transition), {
          event: eventType,
          delay: resolvedDelay
        });
      });
    }));
    return delayedTransitions.map(function(delayedTransition) {
      var delay = delayedTransition.delay;
      return __assign(__assign({}, _this.formatTransition(delayedTransition)), {
        delay
      });
    });
  };
  StateNode2.prototype.getStateNodes = function(state) {
    var _a2;
    var _this = this;
    if (!state) {
      return [];
    }
    var stateValue = state instanceof State ? state.value : toStateValue(state, this.delimiter);
    if (isString(stateValue)) {
      var initialStateValue = this.getStateNode(stateValue).initial;
      return initialStateValue !== void 0 ? this.getStateNodes((_a2 = {}, _a2[stateValue] = initialStateValue, _a2)) : [this, this.states[stateValue]];
    }
    var subStateKeys = Object.keys(stateValue);
    var subStateNodes = [this];
    subStateNodes.push.apply(subStateNodes, __spreadArray([], __read(flatten(subStateKeys.map(function(subStateKey) {
      return _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
    }))), false));
    return subStateNodes;
  };
  StateNode2.prototype.handles = function(event) {
    var eventType = getEventType(event);
    return this.events.includes(eventType);
  };
  StateNode2.prototype.resolveState = function(state) {
    var stateFromConfig = state instanceof State ? state : State.create(state);
    var configuration = Array.from(getConfiguration([], this.getStateNodes(stateFromConfig.value)));
    return new State(__assign(__assign({}, stateFromConfig), {
      value: this.resolve(stateFromConfig.value),
      configuration,
      done: isInFinalState(configuration, this),
      tags: getTagsFromConfiguration(configuration),
      machine: this.machine
    }));
  };
  StateNode2.prototype.transitionLeafNode = function(stateValue, state, _event) {
    var stateNode = this.getStateNode(stateValue);
    var next = stateNode.next(state, _event);
    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }
    return next;
  };
  StateNode2.prototype.transitionCompoundNode = function(stateValue, state, _event) {
    var subStateKeys = Object.keys(stateValue);
    var stateNode = this.getStateNode(subStateKeys[0]);
    var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);
    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }
    return next;
  };
  StateNode2.prototype.transitionParallelNode = function(stateValue, state, _event) {
    var e_2, _a2;
    var transitionMap = {};
    try {
      for (var _b = __values(Object.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var subStateKey = _c.value;
        var subStateValue = stateValue[subStateKey];
        if (!subStateValue) {
          continue;
        }
        var subStateNode = this.getStateNode(subStateKey);
        var next = subStateNode._transition(subStateValue, state, _event);
        if (next) {
          transitionMap[subStateKey] = next;
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b.return))
          _a2.call(_b);
      } finally {
        if (e_2)
          throw e_2.error;
      }
    }
    var stateTransitions = Object.keys(transitionMap).map(function(key) {
      return transitionMap[key];
    });
    var enabledTransitions = flatten(stateTransitions.map(function(st) {
      return st.transitions;
    }));
    var willTransition = stateTransitions.some(function(st) {
      return st.transitions.length > 0;
    });
    if (!willTransition) {
      return this.next(state, _event);
    }
    var entryNodes = flatten(stateTransitions.map(function(t) {
      return t.entrySet;
    }));
    var configuration = flatten(Object.keys(transitionMap).map(function(key) {
      return transitionMap[key].configuration;
    }));
    return {
      transitions: enabledTransitions,
      entrySet: entryNodes,
      exitSet: flatten(stateTransitions.map(function(t) {
        return t.exitSet;
      })),
      configuration,
      source: state,
      actions: flatten(Object.keys(transitionMap).map(function(key) {
        return transitionMap[key].actions;
      }))
    };
  };
  StateNode2.prototype._transition = function(stateValue, state, _event) {
    if (isString(stateValue)) {
      return this.transitionLeafNode(stateValue, state, _event);
    }
    if (Object.keys(stateValue).length === 1) {
      return this.transitionCompoundNode(stateValue, state, _event);
    }
    return this.transitionParallelNode(stateValue, state, _event);
  };
  StateNode2.prototype.getTransitionData = function(state, event) {
    return this._transition(state.value, state, toSCXMLEvent(event));
  };
  StateNode2.prototype.next = function(state, _event) {
    var e_3, _a2;
    var _this = this;
    var eventName = _event.name;
    var actions2 = [];
    var nextStateNodes = [];
    var selectedTransition;
    try {
      for (var _b = __values(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var candidate = _c.value;
        var cond = candidate.cond, stateIn = candidate.in;
        var resolvedContext = state.context;
        var isInState = stateIn ? isString(stateIn) && isStateId(stateIn) ? state.matches(toStateValue(this.getStateNodeById(stateIn).path, this.delimiter)) : matchesState(toStateValue(stateIn, this.delimiter), path(this.path.slice(0, -2))(state.value)) : true;
        var guardPassed = false;
        try {
          guardPassed = !cond || evaluateGuard(this.machine, cond, resolvedContext, _event, state);
        } catch (err) {
          throw new Error("Unable to evaluate guard '".concat(cond.name || cond.type, "' in transition for event '").concat(eventName, "' in state node '").concat(this.id, "':\n").concat(err.message));
        }
        if (guardPassed && isInState) {
          if (candidate.target !== void 0) {
            nextStateNodes = candidate.target;
          }
          actions2.push.apply(actions2, __spreadArray([], __read(candidate.actions), false));
          selectedTransition = candidate;
          break;
        }
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a2 = _b.return))
          _a2.call(_b);
      } finally {
        if (e_3)
          throw e_3.error;
      }
    }
    if (!selectedTransition) {
      return void 0;
    }
    if (!nextStateNodes.length) {
      return {
        transitions: [selectedTransition],
        entrySet: [],
        exitSet: [],
        configuration: state.value ? [this] : [],
        source: state,
        actions: actions2
      };
    }
    var allNextStateNodes = flatten(nextStateNodes.map(function(stateNode) {
      return _this.getRelativeStateNodes(stateNode, state.historyValue);
    }));
    var isInternal = !!selectedTransition.internal;
    var reentryNodes = isInternal ? [] : flatten(allNextStateNodes.map(function(n) {
      return _this.nodesFromChild(n);
    }));
    return {
      transitions: [selectedTransition],
      entrySet: reentryNodes,
      exitSet: isInternal ? [] : [this],
      configuration: allNextStateNodes,
      source: state,
      actions: actions2
    };
  };
  StateNode2.prototype.nodesFromChild = function(childStateNode) {
    if (childStateNode.escapes(this)) {
      return [];
    }
    var nodes = [];
    var marker = childStateNode;
    while (marker && marker !== this) {
      nodes.push(marker);
      marker = marker.parent;
    }
    nodes.push(this);
    return nodes;
  };
  StateNode2.prototype.escapes = function(stateNode) {
    if (this === stateNode) {
      return false;
    }
    var parent = this.parent;
    while (parent) {
      if (parent === stateNode) {
        return false;
      }
      parent = parent.parent;
    }
    return true;
  };
  StateNode2.prototype.getActions = function(transition, currentContext, _event, prevState) {
    var e_4, _a2, e_5, _b;
    var prevConfig = getConfiguration([], prevState ? this.getStateNodes(prevState.value) : [this]);
    var resolvedConfig = transition.configuration.length ? getConfiguration(prevConfig, transition.configuration) : prevConfig;
    try {
      for (var resolvedConfig_1 = __values(resolvedConfig), resolvedConfig_1_1 = resolvedConfig_1.next(); !resolvedConfig_1_1.done; resolvedConfig_1_1 = resolvedConfig_1.next()) {
        var sn = resolvedConfig_1_1.value;
        if (!has(prevConfig, sn)) {
          transition.entrySet.push(sn);
        }
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (resolvedConfig_1_1 && !resolvedConfig_1_1.done && (_a2 = resolvedConfig_1.return))
          _a2.call(resolvedConfig_1);
      } finally {
        if (e_4)
          throw e_4.error;
      }
    }
    try {
      for (var prevConfig_1 = __values(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
        var sn = prevConfig_1_1.value;
        if (!has(resolvedConfig, sn) || has(transition.exitSet, sn.parent)) {
          transition.exitSet.push(sn);
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return))
          _b.call(prevConfig_1);
      } finally {
        if (e_5)
          throw e_5.error;
      }
    }
    var doneEvents = flatten(transition.entrySet.map(function(sn2) {
      var events = [];
      if (sn2.type !== "final") {
        return events;
      }
      var parent = sn2.parent;
      if (!parent.parent) {
        return events;
      }
      events.push(done(sn2.id, sn2.doneData), done(parent.id, sn2.doneData ? mapContext(sn2.doneData, currentContext, _event) : void 0));
      var grandparent = parent.parent;
      if (grandparent.type === "parallel") {
        if (getChildren(grandparent).every(function(parentNode) {
          return isInFinalState(transition.configuration, parentNode);
        })) {
          events.push(done(grandparent.id));
        }
      }
      return events;
    }));
    transition.exitSet.sort(function(a, b) {
      return b.order - a.order;
    });
    transition.entrySet.sort(function(a, b) {
      return a.order - b.order;
    });
    var entryStates = new Set(transition.entrySet);
    var exitStates = new Set(transition.exitSet);
    var _c = __read([flatten(Array.from(entryStates).map(function(stateNode) {
      return __spreadArray(__spreadArray([], __read(stateNode.activities.map(function(activity) {
        return start(activity);
      })), false), __read(stateNode.onEntry), false);
    })).concat(doneEvents.map(raise)), flatten(Array.from(exitStates).map(function(stateNode) {
      return __spreadArray(__spreadArray([], __read(stateNode.onExit), false), __read(stateNode.activities.map(function(activity) {
        return stop(activity);
      })), false);
    }))], 2), entryActions = _c[0], exitActions = _c[1];
    var actions2 = toActionObjects(exitActions.concat(transition.actions).concat(entryActions), this.machine.options.actions);
    return actions2;
  };
  StateNode2.prototype.transition = function(state, event, context) {
    if (state === void 0) {
      state = this.initialState;
    }
    var _event = toSCXMLEvent(event);
    var currentState;
    if (state instanceof State) {
      currentState = context === void 0 ? state : this.resolveState(State.from(state, context));
    } else {
      var resolvedStateValue = isString(state) ? this.resolve(pathToStateValue(this.getResolvedPath(state))) : this.resolve(state);
      var resolvedContext = context !== null && context !== void 0 ? context : this.machine.context;
      currentState = this.resolveState(State.from(resolvedStateValue, resolvedContext));
    }
    if (!IS_PRODUCTION && _event.name === WILDCARD) {
      throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
    }
    if (this.strict) {
      if (!this.events.includes(_event.name) && !isBuiltInEvent(_event.name)) {
        throw new Error("Machine '".concat(this.id, "' does not accept event '").concat(_event.name, "'"));
      }
    }
    var stateTransition = this._transition(currentState.value, currentState, _event) || {
      transitions: [],
      configuration: [],
      entrySet: [],
      exitSet: [],
      source: currentState,
      actions: []
    };
    var prevConfig = getConfiguration([], this.getStateNodes(currentState.value));
    var resolvedConfig = stateTransition.configuration.length ? getConfiguration(prevConfig, stateTransition.configuration) : prevConfig;
    stateTransition.configuration = __spreadArray([], __read(resolvedConfig), false);
    return this.resolveTransition(stateTransition, currentState, currentState.context, _event);
  };
  StateNode2.prototype.resolveRaisedTransition = function(state, _event, originalEvent) {
    var _a2;
    var currentActions = state.actions;
    state = this.transition(state, _event);
    state._event = originalEvent;
    state.event = originalEvent.data;
    (_a2 = state.actions).unshift.apply(_a2, __spreadArray([], __read(currentActions), false));
    return state;
  };
  StateNode2.prototype.resolveTransition = function(stateTransition, currentState, context, _event) {
    var e_6, _a2;
    var _this = this;
    if (_event === void 0) {
      _event = initEvent;
    }
    var configuration = stateTransition.configuration;
    var willTransition = !currentState || stateTransition.transitions.length > 0;
    var resolvedStateValue = willTransition ? getValue(this.machine, configuration) : void 0;
    var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : void 0 : void 0;
    var actions2 = this.getActions(stateTransition, context, _event, currentState);
    var activities = currentState ? __assign({}, currentState.activities) : {};
    try {
      for (var actions_1 = __values(actions2), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {
        var action = actions_1_1.value;
        if (action.type === start$1) {
          activities[action.activity.id || action.activity.type] = action;
        } else if (action.type === stop$1) {
          activities[action.activity.id || action.activity.type] = false;
        }
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (actions_1_1 && !actions_1_1.done && (_a2 = actions_1.return))
          _a2.call(actions_1);
      } finally {
        if (e_6)
          throw e_6.error;
      }
    }
    var _b = __read(resolveActions(this, currentState, context, _event, actions2, this.machine.config.preserveActionOrder), 2), resolvedActions = _b[0], updatedContext = _b[1];
    var _c = __read(partition(resolvedActions, function(action2) {
      return action2.type === raise$1 || action2.type === send$4 && action2.to === SpecialTargets.Internal;
    }), 2), raisedEvents = _c[0], nonRaisedActions = _c[1];
    var invokeActions = resolvedActions.filter(function(action2) {
      var _a3;
      return action2.type === start$1 && ((_a3 = action2.activity) === null || _a3 === void 0 ? void 0 : _a3.type) === invoke;
    });
    var children2 = invokeActions.reduce(function(acc, action2) {
      acc[action2.activity.id] = createInvocableActor(action2.activity, _this.machine, updatedContext, _event);
      return acc;
    }, currentState ? __assign({}, currentState.children) : {});
    var resolvedConfiguration = willTransition ? stateTransition.configuration : currentState ? currentState.configuration : [];
    var isDone = isInFinalState(resolvedConfiguration, this);
    var nextState = new State({
      value: resolvedStateValue || currentState.value,
      context: updatedContext,
      _event,
      _sessionid: currentState ? currentState._sessionid : null,
      historyValue: resolvedStateValue ? historyValue ? updateHistoryValue(historyValue, resolvedStateValue) : void 0 : currentState ? currentState.historyValue : void 0,
      history: !resolvedStateValue || stateTransition.source ? currentState : void 0,
      actions: resolvedStateValue ? nonRaisedActions : [],
      activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
      events: [],
      configuration: resolvedConfiguration,
      transitions: stateTransition.transitions,
      children: children2,
      done: isDone,
      tags: currentState === null || currentState === void 0 ? void 0 : currentState.tags,
      machine: this
    });
    var didUpdateContext = context !== updatedContext;
    nextState.changed = _event.name === update || didUpdateContext;
    var history = nextState.history;
    if (history) {
      delete history.history;
    }
    var isTransient = !isDone && (this._transient || configuration.some(function(stateNode) {
      return stateNode._transient;
    }));
    if (!willTransition && (!isTransient || _event.name === NULL_EVENT)) {
      return nextState;
    }
    var maybeNextState = nextState;
    if (!isDone) {
      if (isTransient) {
        maybeNextState = this.resolveRaisedTransition(maybeNextState, {
          type: nullEvent
        }, _event);
      }
      while (raisedEvents.length) {
        var raisedEvent = raisedEvents.shift();
        maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event);
      }
    }
    var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !stateValuesEqual(maybeNextState.value, history.value) : void 0);
    maybeNextState.changed = changed;
    maybeNextState.history = history;
    maybeNextState.tags = getTagsFromConfiguration(maybeNextState.configuration);
    return maybeNextState;
  };
  StateNode2.prototype.getStateNode = function(stateKey) {
    if (isStateId(stateKey)) {
      return this.machine.getStateNodeById(stateKey);
    }
    if (!this.states) {
      throw new Error("Unable to retrieve child state '".concat(stateKey, "' from '").concat(this.id, "'; no child states exist."));
    }
    var result = this.states[stateKey];
    if (!result) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }
    return result;
  };
  StateNode2.prototype.getStateNodeById = function(stateId) {
    var resolvedStateId = isStateId(stateId) ? stateId.slice(STATE_IDENTIFIER.length) : stateId;
    if (resolvedStateId === this.id) {
      return this;
    }
    var stateNode = this.machine.idMap[resolvedStateId];
    if (!stateNode) {
      throw new Error("Child state node '#".concat(resolvedStateId, "' does not exist on machine '").concat(this.id, "'"));
    }
    return stateNode;
  };
  StateNode2.prototype.getStateNodeByPath = function(statePath) {
    if (typeof statePath === "string" && isStateId(statePath)) {
      try {
        return this.getStateNodeById(statePath.slice(1));
      } catch (e) {
      }
    }
    var arrayStatePath = toStatePath(statePath, this.delimiter).slice();
    var currentStateNode = this;
    while (arrayStatePath.length) {
      var key = arrayStatePath.shift();
      if (!key.length) {
        break;
      }
      currentStateNode = currentStateNode.getStateNode(key);
    }
    return currentStateNode;
  };
  StateNode2.prototype.resolve = function(stateValue) {
    var _a2;
    var _this = this;
    if (!stateValue) {
      return this.initialStateValue || EMPTY_OBJECT;
    }
    switch (this.type) {
      case "parallel":
        return mapValues(this.initialStateValue, function(subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
        });
      case "compound":
        if (isString(stateValue)) {
          var subStateNode = this.getStateNode(stateValue);
          if (subStateNode.type === "parallel" || subStateNode.type === "compound") {
            return _a2 = {}, _a2[stateValue] = subStateNode.initialStateValue, _a2;
          }
          return stateValue;
        }
        if (!Object.keys(stateValue).length) {
          return this.initialStateValue || {};
        }
        return mapValues(stateValue, function(subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(subStateValue) : EMPTY_OBJECT;
        });
      default:
        return stateValue || EMPTY_OBJECT;
    }
  };
  StateNode2.prototype.getResolvedPath = function(stateIdentifier) {
    if (isStateId(stateIdentifier)) {
      var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];
      if (!stateNode) {
        throw new Error("Unable to find state node '".concat(stateIdentifier, "'"));
      }
      return stateNode.path;
    }
    return toStatePath(stateIdentifier, this.delimiter);
  };
  Object.defineProperty(StateNode2.prototype, "initialStateValue", {
    get: function() {
      var _a2;
      if (this.__cache.initialStateValue) {
        return this.__cache.initialStateValue;
      }
      var initialStateValue;
      if (this.type === "parallel") {
        initialStateValue = mapFilterValues(this.states, function(state) {
          return state.initialStateValue || EMPTY_OBJECT;
        }, function(stateNode) {
          return !(stateNode.type === "history");
        });
      } else if (this.initial !== void 0) {
        if (!this.states[this.initial]) {
          throw new Error("Initial state '".concat(this.initial, "' not found on '").concat(this.key, "'"));
        }
        initialStateValue = isLeafNode(this.states[this.initial]) ? this.initial : (_a2 = {}, _a2[this.initial] = this.states[this.initial].initialStateValue, _a2);
      } else {
        initialStateValue = {};
      }
      this.__cache.initialStateValue = initialStateValue;
      return this.__cache.initialStateValue;
    },
    enumerable: false,
    configurable: true
  });
  StateNode2.prototype.getInitialState = function(stateValue, context) {
    this._init();
    var configuration = this.getStateNodes(stateValue);
    return this.resolveTransition({
      configuration,
      entrySet: configuration,
      exitSet: [],
      transitions: [],
      source: void 0,
      actions: []
    }, void 0, context !== null && context !== void 0 ? context : this.machine.context, void 0);
  };
  Object.defineProperty(StateNode2.prototype, "initialState", {
    get: function() {
      var initialStateValue = this.initialStateValue;
      if (!initialStateValue) {
        throw new Error("Cannot retrieve initial state from simple state '".concat(this.id, "'."));
      }
      return this.getInitialState(initialStateValue);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode2.prototype, "target", {
    get: function() {
      var target;
      if (this.type === "history") {
        var historyConfig = this.config;
        if (isString(historyConfig.target)) {
          target = isStateId(historyConfig.target) ? pathToStateValue(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
        } else {
          target = historyConfig.target;
        }
      }
      return target;
    },
    enumerable: false,
    configurable: true
  });
  StateNode2.prototype.getRelativeStateNodes = function(relativeStateId, historyValue, resolve2) {
    if (resolve2 === void 0) {
      resolve2 = true;
    }
    return resolve2 ? relativeStateId.type === "history" ? relativeStateId.resolveHistory(historyValue) : relativeStateId.initialStateNodes : [relativeStateId];
  };
  Object.defineProperty(StateNode2.prototype, "initialStateNodes", {
    get: function() {
      var _this = this;
      if (isLeafNode(this)) {
        return [this];
      }
      if (this.type === "compound" && !this.initial) {
        if (!IS_PRODUCTION) {
          warn(false, "Compound state node '".concat(this.id, "' has no initial state."));
        }
        return [this];
      }
      var initialStateNodePaths = toStatePaths(this.initialStateValue);
      return flatten(initialStateNodePaths.map(function(initialPath) {
        return _this.getFromRelativePath(initialPath);
      }));
    },
    enumerable: false,
    configurable: true
  });
  StateNode2.prototype.getFromRelativePath = function(relativePath) {
    if (!relativePath.length) {
      return [this];
    }
    var _a2 = __read(relativePath), stateKey = _a2[0], childStatePath = _a2.slice(1);
    if (!this.states) {
      throw new Error("Cannot retrieve subPath '".concat(stateKey, "' from node with no states"));
    }
    var childStateNode = this.getStateNode(stateKey);
    if (childStateNode.type === "history") {
      return childStateNode.resolveHistory();
    }
    if (!this.states[stateKey]) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }
    return this.states[stateKey].getFromRelativePath(childStatePath);
  };
  StateNode2.prototype.historyValue = function(relativeStateValue) {
    if (!Object.keys(this.states).length) {
      return void 0;
    }
    return {
      current: relativeStateValue || this.initialStateValue,
      states: mapFilterValues(this.states, function(stateNode, key) {
        if (!relativeStateValue) {
          return stateNode.historyValue();
        }
        var subStateValue = isString(relativeStateValue) ? void 0 : relativeStateValue[key];
        return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
      }, function(stateNode) {
        return !stateNode.history;
      })
    };
  };
  StateNode2.prototype.resolveHistory = function(historyValue) {
    var _this = this;
    if (this.type !== "history") {
      return [this];
    }
    var parent = this.parent;
    if (!historyValue) {
      var historyTarget = this.target;
      return historyTarget ? flatten(toStatePaths(historyTarget).map(function(relativeChildPath) {
        return parent.getFromRelativePath(relativeChildPath);
      })) : parent.initialStateNodes;
    }
    var subHistoryValue = nestedPath(parent.path, "states")(historyValue).current;
    if (isString(subHistoryValue)) {
      return [parent.getStateNode(subHistoryValue)];
    }
    return flatten(toStatePaths(subHistoryValue).map(function(subStatePath) {
      return _this.history === "deep" ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
    }));
  };
  Object.defineProperty(StateNode2.prototype, "stateIds", {
    get: function() {
      var _this = this;
      var childStateIds = flatten(Object.keys(this.states).map(function(stateKey) {
        return _this.states[stateKey].stateIds;
      }));
      return [this.id].concat(childStateIds);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode2.prototype, "events", {
    get: function() {
      var e_7, _a2, e_8, _b;
      if (this.__cache.events) {
        return this.__cache.events;
      }
      var states2 = this.states;
      var events = new Set(this.ownEvents);
      if (states2) {
        try {
          for (var _c = __values(Object.keys(states2)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var stateId = _d.value;
            var state = states2[stateId];
            if (state.states) {
              try {
                for (var _e = (e_8 = void 0, __values(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                  var event_1 = _f.value;
                  events.add("".concat(event_1));
                }
              } catch (e_8_1) {
                e_8 = {
                  error: e_8_1
                };
              } finally {
                try {
                  if (_f && !_f.done && (_b = _e.return))
                    _b.call(_e);
                } finally {
                  if (e_8)
                    throw e_8.error;
                }
              }
            }
          }
        } catch (e_7_1) {
          e_7 = {
            error: e_7_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_a2 = _c.return))
              _a2.call(_c);
          } finally {
            if (e_7)
              throw e_7.error;
          }
        }
      }
      return this.__cache.events = Array.from(events);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode2.prototype, "ownEvents", {
    get: function() {
      var events = new Set(this.transitions.filter(function(transition) {
        return !(!transition.target && !transition.actions.length && transition.internal);
      }).map(function(transition) {
        return transition.eventType;
      }));
      return Array.from(events);
    },
    enumerable: false,
    configurable: true
  });
  StateNode2.prototype.resolveTarget = function(_target) {
    var _this = this;
    if (_target === void 0) {
      return void 0;
    }
    return _target.map(function(target) {
      if (!isString(target)) {
        return target;
      }
      var isInternalTarget = target[0] === _this.delimiter;
      if (isInternalTarget && !_this.parent) {
        return _this.getStateNodeByPath(target.slice(1));
      }
      var resolvedTarget = isInternalTarget ? _this.key + target : target;
      if (_this.parent) {
        try {
          var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);
          return targetStateNode;
        } catch (err) {
          throw new Error("Invalid transition definition for state node '".concat(_this.id, "':\n").concat(err.message));
        }
      } else {
        return _this.getStateNodeByPath(resolvedTarget);
      }
    });
  };
  StateNode2.prototype.formatTransition = function(transitionConfig) {
    var _this = this;
    var normalizedTarget = normalizeTarget(transitionConfig.target);
    var internal = "internal" in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function(_target) {
      return isString(_target) && _target[0] === _this.delimiter;
    }) : true;
    var guards = this.machine.options.guards;
    var target = this.resolveTarget(normalizedTarget);
    var transition = __assign(__assign({}, transitionConfig), {
      actions: toActionObjects(toArray$1(transitionConfig.actions)),
      cond: toGuard(transitionConfig.cond, guards),
      target,
      source: this,
      internal,
      eventType: transitionConfig.event,
      toJSON: function() {
        return __assign(__assign({}, transition), {
          target: transition.target ? transition.target.map(function(t) {
            return "#".concat(t.id);
          }) : void 0,
          source: "#".concat(_this.id)
        });
      }
    });
    return transition;
  };
  StateNode2.prototype.formatTransitions = function() {
    var e_9, _a2;
    var _this = this;
    var onConfig;
    if (!this.config.on) {
      onConfig = [];
    } else if (Array.isArray(this.config.on)) {
      onConfig = this.config.on;
    } else {
      var _b = this.config.on, _c = WILDCARD, _d = _b[_c], wildcardConfigs = _d === void 0 ? [] : _d, strictTransitionConfigs_1 = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
      onConfig = flatten(Object.keys(strictTransitionConfigs_1).map(function(key) {
        if (!IS_PRODUCTION && key === NULL_EVENT) {
          warn(false, "Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. " + 'Please check the `on` configuration for "#'.concat(_this.id, '".'));
        }
        var transitionConfigArray = toTransitionConfigArray(key, strictTransitionConfigs_1[key]);
        if (!IS_PRODUCTION) {
          validateArrayifiedTransitions(_this, key, transitionConfigArray);
        }
        return transitionConfigArray;
      }).concat(toTransitionConfigArray(WILDCARD, wildcardConfigs)));
    }
    var eventlessConfig = this.config.always ? toTransitionConfigArray("", this.config.always) : [];
    var doneConfig = this.config.onDone ? toTransitionConfigArray(String(done(this.id)), this.config.onDone) : [];
    if (!IS_PRODUCTION) {
      warn(!(this.config.onDone && !this.parent), 'Root nodes cannot have an ".onDone" transition. Please check the config of "'.concat(this.id, '".'));
    }
    var invokeConfig = flatten(this.invoke.map(function(invokeDef) {
      var settleTransitions = [];
      if (invokeDef.onDone) {
        settleTransitions.push.apply(settleTransitions, __spreadArray([], __read(toTransitionConfigArray(String(doneInvoke(invokeDef.id)), invokeDef.onDone)), false));
      }
      if (invokeDef.onError) {
        settleTransitions.push.apply(settleTransitions, __spreadArray([], __read(toTransitionConfigArray(String(error$1(invokeDef.id)), invokeDef.onError)), false));
      }
      return settleTransitions;
    }));
    var delayedTransitions = this.after;
    var formattedTransitions = flatten(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(doneConfig), false), __read(invokeConfig), false), __read(onConfig), false), __read(eventlessConfig), false).map(function(transitionConfig) {
      return toArray$1(transitionConfig).map(function(transition) {
        return _this.formatTransition(transition);
      });
    }));
    try {
      for (var delayedTransitions_1 = __values(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
        var delayedTransition = delayedTransitions_1_1.value;
        formattedTransitions.push(delayedTransition);
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a2 = delayedTransitions_1.return))
          _a2.call(delayedTransitions_1);
      } finally {
        if (e_9)
          throw e_9.error;
      }
    }
    return formattedTransitions;
  };
  return StateNode2;
}();
function createMachine(config2, options) {
  return new StateNode(config2, options);
}
var assign$3 = assign$4;
function isActorWithState(actorRef) {
  return "state" in actorRef;
}
var noop$3 = function() {
};
function defaultGetSnapshot(actorRef) {
  return "getSnapshot" in actorRef ? actorRef.getSnapshot() : isActorWithState(actorRef) ? actorRef.state : void 0;
}
function useActor(actorRef, getSnapshot) {
  if (getSnapshot === void 0) {
    getSnapshot = defaultGetSnapshot;
  }
  var actorRefRef = isRef(actorRef) ? actorRef : shallowRef(actorRef);
  var state = shallowRef(getSnapshot(actorRefRef.value));
  var send2 = function(event) {
    actorRefRef.value.send(event);
  };
  watch(actorRefRef, function(newActor, _, onCleanup) {
    state.value = getSnapshot(newActor);
    var unsubscribe = newActor.subscribe({
      next: function(emitted) {
        return state.value = emitted;
      },
      error: noop$3,
      complete: noop$3
    }).unsubscribe;
    onCleanup(function() {
      return unsubscribe();
    });
  }, {
    immediate: true
  });
  return { state, send: send2 };
}
const global_transitions = {
  CLOSE: "closed",
  ERROR: "error",
  UPDATE_CONTEXT: {
    actions: assign$3((_, event) => {
      const _a2 = event, { type } = _a2, newContext = __objRest(_a2, ["type"]);
      return newContext;
    })
  }
};
const overlayInitialContext = {
  store_id: null,
  product_id: null,
  variant_id: null,
  coupon: null,
  quantity: null,
  product: null,
  variant: null,
  error: null
};
const closed_state = {
  entry: assign$3(overlayInitialContext),
  on: {
    OPEN: {
      target: "checkout",
      actions: assign$3((_, event) => ({
        store_id: event.store_id,
        product_id: event.product_id,
        variant_id: event.variant_id,
        customization: event.customization
      }))
    }
  }
};
const error = {
  on: {
    FETCH: "checkout"
  }
};
const entry = {
  on: {
    VARIANT_SELECTION: "variant_selection",
    VARIANT_OVERVIEW: "overview"
  },
  invoke: {
    id: "openingCheckout",
    src: (context) => (send2) => {
      if (!context.store_id || !context.product_id) {
        throw {
          message: "This checkout button is not properly configured.",
          errors: __spreadValues({}, !context.store_id ? { store_id: [] } : { product_id: [] })
        };
      }
      send2(!context.variant_id ? "VARIANT_SELECTION" : "VARIANT_OVERVIEW");
    }
  }
};
const BASE_API_URL = "https://sell.app/api/v2/fast-checkout";
function route(url, parameters) {
  for (const [key, value] of Object.entries(parameters)) {
    url = url.replace(`{${key}}`, value);
  }
  return url;
}
function blank(value) {
  if (value === null) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === "object") {
    return Object.entries(value).length === 0;
  }
  return !value;
}
function filled(value) {
  return !blank(value);
}
function recordFilter(o, predicate) {
  return Object.fromEntries(Object.entries(o).filter((entry2) => {
    const [key, value] = entry2;
    return predicate(value, key);
  }));
}
const api$1 = {
  async get(url, query) {
    const compiledUrl = new URL(url);
    if (query) {
      compiledUrl.search = new URLSearchParams(recordFilter(query, filled)).toString();
    }
    return await api_fetch(compiledUrl.toString(), {
      headers: {
        Accept: "application/json"
      }
    });
  },
  async post(url, body) {
    return await api_fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recordFilter(body, filled))
    });
  }
};
const VALIDATION_ERROR_STATUS_CODE = 422;
const FORBIDDEN_STATUS_CODE = 403;
async function api_fetch(url, init2) {
  var _a2, _b;
  const response = await fetch(url, init2);
  if (!response.ok && response.status !== VALIDATION_ERROR_STATUS_CODE && response.status !== FORBIDDEN_STATUS_CODE) {
    throw new Error("Oops... Something went wrong while processing your request.");
  }
  const jsonResponse = await response.json();
  if (!response.ok) {
    throw { code: response.status, message: (_a2 = jsonResponse.message) != null ? _a2 : "", errors: (_b = jsonResponse.errors) != null ? _b : {} };
  }
  return jsonResponse;
}
const API_PATH$2 = `${BASE_API_URL}/{store_id}/{product_id}/{variant_id}`;
async function checkoutProduct(store_id, product_id, variant_id, body) {
  const url = route(API_PATH$2, { store_id, product_id, variant_id });
  return await api$1.post(url, body);
}
const API_PATH$1 = `${BASE_API_URL}/{store_id}/{product_id}`;
async function fetchProduct(store_id, product_id, query = {}) {
  const url = route(API_PATH$1, { store_id, product_id });
  return await api$1.get(url, query);
}
const API_PATH = `${BASE_API_URL}/{store_id}/{product_id}/{variant_id}`;
async function fetchProductVariant(store_id, product_id, variant_id, parameters = {}) {
  const url = route(API_PATH, { store_id, product_id, variant_id });
  return await api$1.get(url, parameters);
}
const { assign: assign$2, pure, send: send$2 } = actions;
const onError = pure((_, event) => {
  const isValidationError = typeof event.data === "object" && "errors" in event.data;
  let shouldRedirectToErrorDialog = !isValidationError;
  const error2 = isValidationError ? event.data : { message: event.data, errors: {} };
  if (!isValidationError || "store_id" in error2.errors || "product_id" in error2.errors || "variant_id" in error2.errors || error2.code === 403) {
    if ("store_id" in error2.errors) {
      error2.message = "This store could not be found.";
    } else if ("product_id" in error2.errors) {
      error2.message = "This product could not be found.";
    } else if ("variant_id" in error2.errors) {
      error2.message = "This variant could not be found.";
    } else {
      error2.message = "It looks like something went wrong.";
    }
    error2.message += " Please contact the seller to let them know.";
    if (error2.code === 403) {
      error2.message = "You have either been blacklisted by the store owner, or you are using a VPN/Proxy. If you are using a proxy, please disable it.";
    }
    error2.errors = {};
    shouldRedirectToErrorDialog = true;
  }
  const actions2 = [
    assign$2(() => ({
      error: error2
    }))
  ];
  if (shouldRedirectToErrorDialog) {
    actions2.push(send$2("ERROR"));
  }
  return actions2;
});
const { assign: assign$1, send: send$1 } = actions;
const variant_selection = {
  on: {
    NEXT: {
      target: "overview",
      actions: assign$1((context, event) => ({
        variant_id: event.variant_id
      }))
    }
  },
  meta: {
    component: "VariantSelection"
  },
  initial: "fetchProductVariantList",
  states: {
    fetchProductVariantList: {
      tags: ["loading"],
      on: {
        FINISH_FETCH: "selectProductVariant"
      },
      invoke: {
        id: "fetchVariantList",
        src: async (context) => {
          var _a2;
          if (((_a2 = context.product) == null ? void 0 : _a2.id.toString()) === context.product_id) {
            return context.product;
          }
          return await fetchProduct(context.store_id, context.product_id);
        },
        onDone: {
          actions: [
            assign$1((context, event) => ({
              product: event.data,
              error: null
            })),
            send$1((context, event) => {
              if (event.data.variants.length === 1) {
                return { type: "NEXT", variant_id: event.data.variants[0].id.toString() };
              }
              return { type: "FINISH_FETCH" };
            })
          ]
        },
        onError: {
          target: "#embed.error",
          actions: onError
        }
      }
    },
    selectProductVariant: {}
  }
};
const { assign, send } = actions;
const overview = {
  on: {
    PREVIOUS: "variant_selection",
    NEXT: "payment_method",
    FETCH: {
      internal: true,
      target: [".fetchStates.fetching"]
    },
    FINISH_FETCH: {
      internal: true,
      target: [".fetchStates.idle", ".overviewStates.idle"]
    }
  },
  meta: {
    component: "Overview"
  },
  type: "parallel",
  states: {
    fetchStates: {
      initial: "fetching",
      states: {
        fetching: {
          tags: ["fetching"],
          invoke: {
            id: "fetchProductVariant",
            src: async (context) => {
              var _a2;
              return {
                product: ((_a2 = context.product) == null ? void 0 : _a2.id.toString()) === context.product_id ? context.product : await fetchProduct(context.store_id, context.product_id, { withoutVariants: true }),
                variant: await fetchProductVariant(context.store_id, context.product_id, context.variant_id, {
                  coupon: context.coupon,
                  quantity: context.quantity,
                  extra: context.extra
                })
              };
            },
            onDone: {
              actions: [
                assign((context, event) => {
                  var _a2;
                  return {
                    product: event.data.product,
                    variant: event.data.variant,
                    quantity: (_a2 = context.quantity) != null ? _a2 : event.data.variant.minimum_purchase_quantity,
                    error: null
                  };
                }),
                send("FINISH_FETCH")
              ]
            },
            onError: {
              actions: [onError, send("FINISH_FETCH")]
            }
          }
        },
        idle: {}
      }
    },
    overviewStates: {
      initial: "loading",
      states: {
        loading: {
          tags: ["loading"]
        },
        idle: {}
      }
    }
  }
};
const payment_method = {
  on: {
    PREVIOUS: "overview",
    NEXT: "customer_email"
  },
  meta: {
    component: "PaymentMethod"
  }
};
const customer_email = {
  on: {
    PREVIOUS: "payment_method"
  },
  meta: {
    component: "CustomerEmail"
  },
  initial: "enterCustomerEmail",
  states: {
    enterCustomerEmail: {
      on: {
        CHECKOUT: "checkout_product"
      }
    },
    checkout_product: {
      invoke: {
        id: "checkout_product",
        src: async (context) => await checkoutProduct(context.store_id, context.product_id, context.variant_id, {
          coupon: context.coupon,
          quantity: context.quantity,
          extra: context.extra,
          customer_email: checkout_information.customer_email,
          terms_of_service: checkout_information.terms_of_service,
          payment_method: checkout_information.payment_method,
          additional_information: checkout_information.additional_information
        }),
        onDone: {
          target: "#embed.invoice_processed",
          actions: [
            assign$3((context, event) => ({
              order: event.data.payment_url,
              error: null
            })),
            (_, event) => {
              window.open(event.data.payment_url, "_blank");
            }
          ]
        },
        onError: {
          target: "#embed.checkout.payment_method",
          actions: onError
        }
      }
    }
  }
};
const checkout = {
  initial: "entry",
  states: {
    entry,
    variant_selection,
    overview,
    payment_method,
    customer_email
  }
};
const invoice_processed = {};
const states = {
  closed: closed_state,
  error,
  checkout,
  invoice_processed
};
const machineConfig = {
  id: "embed",
  initial: "closed",
  context: overlayInitialContext,
  on: global_transitions,
  states
};
const overlayMachine = createMachine(machineConfig);
const overlayState = interpret(overlayMachine).start();
function useOverlay() {
  const { state, send: send2 } = useActor(overlayState);
  const context = computed(() => state.value.context);
  return {
    context,
    send: send2,
    state
  };
}
const checkout_information = reactive({
  customer_email: "",
  payment_method: "",
  additional_information: {},
  terms_of_service: false
});
function render$9(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$8(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$7(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$6(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z",
      "clip-rule": "evenodd"
    }),
    createVNode("path", { d: "M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" })
  ]);
}
function render$5(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", { d: "M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" }),
    createVNode("path", { d: "M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" })
  ]);
}
function render$4(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$3(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$2(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "fill-rule": "evenodd",
      d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",
      "clip-rule": "evenodd"
    })
  ]);
}
function render$1(_ctx, _cache) {
  return openBlock(), createBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "2",
    stroke: "currentColor",
    "aria-hidden": "true"
  }, [
    createVNode("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    })
  ]);
}
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$e = {
  name: "Spinner"
};
const _hoisted_1$e = {
  class: "embed-animate-spin embed-h-5 embed-w-5",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
};
const _hoisted_2$c = /* @__PURE__ */ createBaseVNode("circle", {
  class: "embed-opacity-25",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1);
const _hoisted_3$a = /* @__PURE__ */ createBaseVNode("path", {
  class: "embed-opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1);
const _hoisted_4$7 = [
  _hoisted_2$c,
  _hoisted_3$a
];
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", _hoisted_1$e, _hoisted_4$7);
}
var Spinner = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e]]);
const _sfc_main$d = defineComponent({
  name: "Button",
  components: {
    Spinner
  },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
});
const _hoisted_1$d = ["disabled"];
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Spinner = resolveComponent("Spinner");
  return openBlock(), createElementBlock("button", {
    class: normalizeClass(["embed-inline-flex embed-items-center embed-justify-center sm:embed-text-sm md:embed-text-md embed-font-medium embed-px-4 embed-py-2 embed-rounded-md embed-shadow-sm focus:embed-ring-2 focus:embed-outline-none disabled:embed-opacity-50 disabled:embed-cursor-not-allowed embed-border-none", {
      "embed-font-semibold embed-transition embed-duration-150 embed-ease-in-out embed-shadow hover:embed-shadow-lg embed-bg-black embed-text-white": typeof _ctx.$attrs.toffee !== "undefined",
      "embed-bg-white hover:embed-bg-slate-50 dark:embed-bg-slate-800 dark:hover:embed-bg-slate-800 embed-text-slate-700 dark:embed-text-slate-50 embed-border embed-border-slate-300 dark:embed-border-slate-900 focus:embed-ring-offset-2 embed-ring-offset-transparent focus:embed-ring-slate-500": typeof _ctx.$attrs.outline !== "undefined",
      "embed-bg-red-600 hover:embed-bg-red-700 embed-text-white focus:embed-ring-offset-2 embed-ring-offset-transparent focus:embed-ring-red-500": typeof _ctx.$attrs.danger !== "undefined"
    }]),
    disabled: _ctx.disabled || _ctx.loading
  }, [
    !_ctx.loading ? renderSlot(_ctx.$slots, "default", { key: 0 }) : (openBlock(), createBlock(_component_Spinner, { key: 1 }))
  ], 10, _hoisted_1$d);
}
var Button = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d]]);
const _sfc_main$c = defineComponent({
  name: "Navigator",
  components: {
    Button
  },
  props: {
    back: {
      type: Object,
      required: false,
      default: {
        type: "PREVIOUS"
      }
    },
    next: {
      type: Object,
      required: false,
      default: {
        type: "NEXT"
      }
    }
  },
  setup() {
    const { state, send: send2 } = useOverlay();
    return {
      send: send2,
      state
    };
  }
});
const _hoisted_1$c = { class: "embed-mt-6 embed-w-full embed-justify-between embed-flex embed-items-center embed-col-span-2 embed-space-x-2" };
const _hoisted_2$b = /* @__PURE__ */ createTextVNode("Back");
const _hoisted_3$9 = /* @__PURE__ */ createTextVNode("Continue");
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Button = resolveComponent("Button");
  return openBlock(), createElementBlock("div", _hoisted_1$c, [
    createVNode(_component_Button, {
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.send(_ctx.back)),
      class: "embed-w-24 embed-outline-none focus:embed-ring-0 embed-shadow-lg hover:embed-shadow-xl hover:embed-bg-slate-50 dark:hover:embed-bg-black dark:embed-bg-slate-800 dark:embed-text-white",
      disabled: _ctx.state.hasTag("loading")
    }, {
      default: withCtx(() => [
        _hoisted_2$b
      ]),
      _: 1
    }, 8, ["disabled"]),
    createVNode(_component_Button, {
      loading: _ctx.state.hasTag("loading"),
      onClick: _cache[1] || (_cache[1] = ($event) => _ctx.send(_ctx.next)),
      class: "embed-w-24",
      style: normalizeStyle({ "background-color": _ctx.state.context.customization.theme }),
      toffee: ""
    }, {
      default: withCtx(() => [
        _hoisted_3$9
      ]),
      _: 1
    }, 8, ["loading", "style"])
  ]);
}
var Navigator = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c]]);
const _sfc_main$b = defineComponent({
  name: "VariantSelection",
  components: {
    Navigator,
    RadioGroup: wi,
    RadioGroupDescription: ki,
    RadioGroupLabel: Mi,
    RadioGroupOption: Li,
    DialogTitle: qr,
    Button
  },
  setup() {
    const { context, send: send2, state } = useOverlay();
    const product = computed(() => context.value.product);
    const selected_variant = ref(null);
    function selectVariant() {
      if (blank(selected_variant)) {
        return;
      }
      send2({
        type: "NEXT",
        variant_id: selected_variant.value
      });
    }
    return {
      state,
      product,
      selected_variant,
      selectVariant,
      context
    };
  }
});
const _hoisted_1$b = { class: "embed-flex embed-flex-col embed-px-4 embed-pt-5 embed-pb-4 sm:embed-p-6" };
const _hoisted_2$a = /* @__PURE__ */ createBaseVNode("p", { class: "embed-mb-4 embed-font-medium embed-text-center dark:embed-text-white embed-text-xs embed-italic" }, "Select the product variant you'd like to purchase", -1);
const _hoisted_3$8 = /* @__PURE__ */ createTextVNode("Select the product variant");
const _hoisted_4$6 = { class: "embed-space-y-4" };
const _hoisted_5$5 = { class: "embed-flex embed-flex-col sm:embed-flex-row sm:embed-justify-between embed-text-left" };
const _hoisted_6$4 = { class: "embed-flex embed-items-center embed-flex-grow-0" };
const _hoisted_7$3 = { class: "embed-text-sm" };
const _hoisted_8$3 = { class: "embed-mt-2 embed-flex embed-text-sm sm:embed-mt-0 sm:embed-block sm:embed-ml-4 sm:embed-text-right embed-w-auto embed-flex-shrink-0" };
const _hoisted_9$2 = { class: "embed-font-medium embed-text-slate-900 dark:embed-text-white" };
const _hoisted_10$2 = { class: "embed-flex embed-text-xs embed-text-left embed-text-slate-900 dark:embed-text-white" };
const _hoisted_11$2 = /* @__PURE__ */ createBaseVNode("div", {
  class: "embed-absolute embed--inset-px embed-rounded-lg embed-pointer-events-none",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_12$2 = { class: "embed-mt-6 embed-w-full embed-justify-end embed-flex embed-items-center embed-col-span-2 embed-space-x-2" };
const _hoisted_13$2 = /* @__PURE__ */ createTextVNode("Continue");
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DialogTitle = resolveComponent("DialogTitle");
  const _component_RadioGroupLabel = resolveComponent("RadioGroupLabel");
  const _component_RadioGroupDescription = resolveComponent("RadioGroupDescription");
  const _component_RadioGroupOption = resolveComponent("RadioGroupOption");
  const _component_RadioGroup = resolveComponent("RadioGroup");
  const _component_Button = resolveComponent("Button");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$b, [
      createVNode(_component_DialogTitle, {
        as: "h2",
        class: "embed-mb-1 embed-font-bold embed-text-center dark:embed-text-white embed-text-xl"
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.product.title), 1)
        ]),
        _: 1
      }),
      _hoisted_2$a,
      createVNode(_component_RadioGroup, {
        modelValue: _ctx.selected_variant,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.selected_variant = $event)
      }, {
        default: withCtx(() => [
          createVNode(_component_RadioGroupLabel, { class: "embed-sr-only" }, {
            default: withCtx(() => [
              _hoisted_3$8
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_4$6, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.product.variants, (variant) => {
              return openBlock(), createBlock(_component_RadioGroupOption, {
                key: variant.id,
                as: "template",
                value: variant.id
              }, {
                default: withCtx(({ checked }) => [
                  createBaseVNode("div", {
                    class: normalizeClass(["embed-flex embed-flex-col", [checked ? "embed-shadow-lg dark:embed-shadow-black embed-shadow-slate-400 embed-bg-white dark:embed-bg-slate-900" : "bg-slate-50 dark:embed-bg-slate-800 embed-shadow dark:embed-shadow-black/20 dark:hover:embed-bg-slate-900 hover:embed-bg-white hover:embed-shadow-slate-400 dark:hover:embed-shadow-black", "embed-transition embed-duration-200 embed-ease-in-out embed-relative embed-block embed-rounded-lg embed-px-6 embed-py-4 embed-cursor-pointer sm:embed-flex sm:embed-justify-between focus:embed-outline-none"]])
                  }, [
                    createBaseVNode("div", _hoisted_5$5, [
                      createBaseVNode("div", _hoisted_6$4, [
                        createBaseVNode("div", _hoisted_7$3, [
                          createVNode(_component_RadioGroupLabel, {
                            as: "p",
                            class: "embed-font-medium embed-text-slate-900 dark:embed-text-white",
                            style: { "text-transform": "embed-capitalize" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(variant.title), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ])
                      ]),
                      createBaseVNode("div", _hoisted_8$3, [
                        createBaseVNode("div", _hoisted_9$2, toDisplayString(variant.price), 1)
                      ])
                    ]),
                    createVNode(_component_RadioGroupDescription, {
                      as: "div",
                      class: "embed-flex embed-text-xs embed-text-left embed-mt-2"
                    }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_10$2, toDisplayString(variant.description), 1)
                      ]),
                      _: 2
                    }, 1024),
                    _hoisted_11$2
                  ], 2)
                ]),
                _: 2
              }, 1032, ["value"]);
            }), 128))
          ])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      createBaseVNode("div", _hoisted_12$2, [
        createVNode(_component_Button, {
          loading: _ctx.state.hasTag("loading"),
          onClick: _cache[1] || (_cache[1] = ($event) => _ctx.selectVariant()),
          class: "embed-w-24",
          disabled: _ctx.selected_variant == null,
          toffee: ""
        }, {
          default: withCtx(() => [
            _hoisted_13$2
          ]),
          _: 1
        }, 8, ["loading", "disabled"])
      ])
    ])
  ]);
}
var VariantSelection = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b]]);
const _sfc_main$a = defineComponent({
  name: "NumberInput",
  components: {
    MinusIcon: render$4,
    PlusIcon: render$2
  },
  inheritAttrs: false,
  props: {
    modelValue: Number,
    min: Number,
    max: Number
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    function emitUpdate(value) {
      var _a2;
      value = parseInt(value.toString());
      if (isNaN(value)) {
        value = 0;
      }
      if (value < ((_a2 = props.min) != null ? _a2 : 1)) {
        value = props.min;
      } else if (props.max !== null && value > props.max) {
        value = props.max;
      }
      emit("update:modelValue", value);
    }
    const canModify = computed(() => props.min !== props.max);
    const canIncrement = computed(() => canModify.value && (!!props.max ? props.modelValue < props.max : true));
    function increment() {
      if (canIncrement.value) {
        emitUpdate(props.modelValue + 1);
      }
    }
    const canDecrement = computed(() => {
      var _a2;
      return canModify.value && props.modelValue > ((_a2 = props.min) != null ? _a2 : 1);
    });
    function decrement() {
      if (canDecrement.value) {
        emitUpdate(props.modelValue - 1);
      }
    }
    return {
      emitUpdate,
      canModify,
      canIncrement,
      increment,
      canDecrement,
      decrement
    };
  }
});
const _hoisted_1$a = { class: "embed-relative" };
const _hoisted_2$9 = ["disabled"];
const _hoisted_3$7 = ["value", "disabled"];
const _hoisted_4$5 = ["disabled"];
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MinusIcon = resolveComponent("MinusIcon");
  const _component_PlusIcon = resolveComponent("PlusIcon");
  return openBlock(), createElementBlock("div", _hoisted_1$a, [
    createBaseVNode("button", {
      class: "embed-absolute embed-inset-y-0 embed-left-0 embed-pl-3 embed-flex embed-items-center dark:embed-text-white disabled:embed-opacity-50 disabled:embed-cursor-not-allowed",
      disabled: !_ctx.canDecrement,
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.decrement())
    }, [
      createVNode(_component_MinusIcon, { class: "embed-w-5 embed-h-5" })
    ], 8, _hoisted_2$9),
    createBaseVNode("input", mergeProps(_ctx.$attrs, {
      value: _ctx.modelValue,
      class: "embed-w-full embed-rounded-lg embed-shadow hover:embed-shadow-md focus:embed-shadow-lg embed-text-center dark:embed-bg-slate-800 dark:embed-shadow-black dark:embed-text-white focus:embed-outline-none focus:embed-ring-0",
      type: "text",
      inputmode: "numeric",
      onInput: _cache[1] || (_cache[1] = ($event) => _ctx.emitUpdate($event.target.value)),
      disabled: !_ctx.canModify
    }), null, 16, _hoisted_3$7),
    createBaseVNode("button", {
      class: "embed-absolute embed-inset-y-0 embed-right-0 embed-pr-3 embed-flex embed-items-center dark:embed-text-white disabled:embed-opacity-50 disabled:embed-cursor-not-allowed",
      disabled: !_ctx.canIncrement,
      onClick: _cache[2] || (_cache[2] = ($event) => _ctx.increment())
    }, [
      createVNode(_component_PlusIcon, { class: "embed-w-5 embed-h-5" })
    ], 8, _hoisted_4$5)
  ]);
}
var NumberInput = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a]]);
const _sfc_main$9 = defineComponent({
  name: "InputGroup",
  components: {
    ExclamationCircleIcon: render$7
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      required: true
    },
    errorKey: String,
    modelValue: {
      type: null,
      required: false
    },
    label: String
  },
  emits: ["update:modelValue"],
  setup(props, { slots, emit }) {
    const { context } = useOverlay();
    function emitUpdate(value) {
      emit("update:modelValue", value);
    }
    const hasSlot = (name) => !!slots[name];
    const error2 = computed(() => {
      var _a2, _b, _c;
      return (_c = (_b = (_a2 = context.value.error) == null ? void 0 : _a2.errors) == null ? void 0 : _b[props.errorKey]) == null ? void 0 : _c[0];
    });
    return {
      hasSlot,
      emitUpdate,
      error: error2
    };
  }
});
const _hoisted_1$9 = { class: "embed-block embed-text-sm embed-font-medium embed-text-slate-700 dark:embed-text-white" };
const _hoisted_2$8 = {
  key: 0,
  class: "embed-absolute embed-inset-y-0 embed-left-0 embed-pl-3 embed-flex embed-items-center embed-pointer-events-none"
};
const _hoisted_3$6 = ["type", "value"];
const _hoisted_4$4 = ["checked", "type", "value"];
const _hoisted_5$4 = ["value"];
const _hoisted_6$3 = ["textContent"];
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ExclamationCircleIcon = resolveComponent("ExclamationCircleIcon");
  return openBlock(), createElementBlock(Fragment, null, [
    createBaseVNode("div", {
      class: normalizeClass({
        "embed-w-full embed-flex embed-justify-between embed-flex embed-items-center": _ctx.type === "checkbox"
      })
    }, [
      createBaseVNode("label", _hoisted_1$9, toDisplayString(_ctx.label), 1),
      createBaseVNode("div", {
        class: normalizeClass(["embed-relative embed-rounded-md", { "embed-mt-1": _ctx.type !== "checkbox" && !!_ctx.label }])
      }, [
        _ctx.type !== "checkbox" && _ctx.type !== "textarea" ? (openBlock(), createElementBlock("div", _hoisted_2$8, [
          renderSlot(_ctx.$slots, "icon")
        ])) : createCommentVNode("", true),
        _ctx.type !== "textarea" && _ctx.type !== "checkbox" ? (openBlock(), createElementBlock("input", mergeProps({
          key: 1,
          type: _ctx.type,
          class: {
            "embed-block embed-w-full embed-rounded-md sm:embed-text-sm disabled:embed-opacity-70 embed-shadow-lg embed-shadow-slate-300 focus:embed-shadow-slate-400 dark:embed-shadow-black/20 dark:focus:embed-shadow-black focus:embed-ring-0 focus:embed-border-transparent embed-border-transparent embed-placeholder-slate-600 focus:placeholder-slate-800 dark:focus:embed-placeholder-slate-400 embed-text-black dark:embed-text-white embed-bg-slate-100 focus:embed-bg-white dark:embed-bg-slate-900 dark:focus:embed-bg-slate-800 embed-transition embed-duration-300 embed-ease-in-out": _ctx.type !== "checkbox",
            "embed-pl-10": _ctx.hasSlot("icon"),
            "embed-placeholder-red-300 dark:embed-placeholder-red-600 embed-text-red-900 embed-border-red-300 focus:embed-ring-red-500 focus:embed-border-red-500": !!_ctx.error,
            "embed-pr-10": !!_ctx.error && _ctx.type !== "number"
          },
          value: _ctx.modelValue
        }, _ctx.$attrs, {
          onInput: _cache[0] || (_cache[0] = ($event) => _ctx.emitUpdate($event.target.value))
        }), null, 16, _hoisted_3$6)) : _ctx.type === "checkbox" ? (openBlock(), createElementBlock("input", mergeProps({
          key: 2,
          checked: _ctx.modelValue,
          type: _ctx.type,
          class: "embed-rounded embed-bg-white dark:embed-bg-slate-800 hover:embed-bg-slate-500 dark:hover:embed-bg-slate-900 focus:embed-bg-slate-700 dark:focus:embed-bg-black embed-text-black dark:embed-text-white embed-placeholder-slate-600 dark:embed-placeholder-slate-500 focus:placeholder-slate-800 dark:focus:embed-placeholder-slate-400 embed-border embed-border-slate-400 dark:embed-border-slate-900 focus:embed-border-slate-500 dark:focus:embed-border-slate-800 focus:embed-ring-0 embed-shadow-md embed-shadow-slate-200 focus:embed-shadow-slate-300 dark:embed-shadow-black/20 dark:focus:embed-shadow-black embed-transition embed-duration-200 embed-ease-in-out disabled:embed-bg-slate-100 dark:disabled:embed-bg-slate-900 disabled:embed-opacity-70",
          value: _ctx.modelValue
        }, _ctx.$attrs, {
          onInput: _cache[1] || (_cache[1] = ($event) => _ctx.emitUpdate($event.target.checked))
        }), null, 16, _hoisted_4$4)) : (openBlock(), createElementBlock("textarea", mergeProps({
          key: 3,
          class: ["embed-block embed-w-full embed-rounded-md sm:embed-text-sm disabled:embed-opacity-70 embed-shadow-lg embed-shadow-slate-300 focus:embed-shadow-slate-400 dark:embed-shadow-black/20 dark:focus:embed-shadow-black focus:embed-ring-0 focus:embed-border-transparent embed-border-transparent embed-placeholder-slate-600 focus:placeholder-slate-800 dark:focus:embed-placeholder-slate-400 embed-text-black dark:embed-text-white embed-bg-slate-100 focus:embed-bg-white dark:embed-bg-slate-900 dark:focus:embed-bg-slate-800 embed-transition embed-duration-300 embed-ease-in-out", {
            "embed-placeholder-red-300 embed-text-red-900 embed-border-red-300 focus:embed-ring-red-500 focus:embed-border-red-500": !!_ctx.error
          }],
          value: _ctx.modelValue
        }, _ctx.$attrs, {
          onInput: _cache[2] || (_cache[2] = ($event) => _ctx.emitUpdate($event.target.value))
        }), null, 16, _hoisted_5$4)),
        !!_ctx.error && (_ctx.type === "text" || _ctx.type === "email") ? (openBlock(), createElementBlock("div", {
          key: 4,
          class: normalizeClass(["embed-absolute embed-inset-y-0 embed-right-0 embed-pr-3 embed-flex embed-items-center embed-pointer-events-none", { "embed-mr-6": _ctx.type === "number" }])
        }, [
          createVNode(_component_ExclamationCircleIcon, {
            class: "embed-h-5 embed-w-5 embed-text-red-500 dark:embed-text-red-900",
            "aria-hidden": "true"
          })
        ], 2)) : createCommentVNode("", true)
      ], 2)
    ], 2),
    !!_ctx.error ? (openBlock(), createElementBlock("p", {
      key: 0,
      class: "embed-mt-3 embed-text-xs embed-text-red-600 dark:embed-text-red embed-w-full embed-flex-grow",
      textContent: toDisplayString(_ctx.error)
    }, null, 8, _hoisted_6$3)) : createCommentVNode("", true)
  ], 64);
}
var InputGroup = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9]]);
const _sfc_main$8 = defineComponent({
  name: "Overview",
  components: {
    InputGroup,
    Button,
    DialogTitle: qr,
    NumberInput,
    GiftIcon: render$6,
    PlusSmIcon: render$3
  },
  setup() {
    var _a2, _b, _c;
    const { context, state, send: send2 } = useOverlay();
    const data = reactive({
      coupon: (_a2 = context.value.coupon) != null ? _a2 : "",
      quantity: (_b = context.value.quantity) != null ? _b : 0,
      extra: (_c = context.value.extra) != null ? _c : "0.00"
    });
    const orMore = ref(context.value.extra !== void 0 && context.value.extra !== "0.00");
    const applyCoupon = ref(context.value.coupon == "");
    function apply(key, value) {
      send2([
        {
          type: "UPDATE_CONTEXT",
          [key]: value != null ? value : data[key]
        },
        "FETCH"
      ]);
    }
    watch(() => data.quantity, (quantity) => {
      apply("quantity", quantity);
    });
    const product = computed(() => context.value.product);
    const variant = computed(() => context.value.variant);
    const isSoldOut = computed(() => variant.value.stock === false);
    const isLoading = computed(() => state.value.hasTag("fetching"));
    return {
      product,
      variant,
      send: send2,
      data,
      context,
      orMore,
      applyCoupon,
      apply,
      isSoldOut,
      isLoading
    };
  }
});
const _hoisted_1$8 = {
  key: 0,
  class: "aspect-w-3 aspect-h-1 embed-flex-shrink-0 embed-rounded-t-2xl embed-overflow-hidden embed-bg-inherit"
};
const _hoisted_2$7 = ["src", "alt"];
const _hoisted_3$5 = { class: "embed-flex embed-flex-col embed-px-4 embed-pt-5 embed-pb-4 sm:embed-p-6 embed-space-y-3" };
const _hoisted_4$3 = ["innerHTML"];
const _hoisted_5$3 = { class: "embed-flex embed-flex-col embed-mx-auto embed-items-center" };
const _hoisted_6$2 = {
  key: 0,
  class: "embed-text-xl embed-text-center embed-font-light dark:embed-text-white embed-line-through"
};
const _hoisted_7$2 = { class: "embed-text-xl embed-text-center dark:embed-text-white embed-font-bold" };
const _hoisted_8$2 = {
  key: 0,
  class: "embed-flex embed-flex-col embed-mx-auto embed-items-center"
};
const _hoisted_9$1 = { class: "embed-flex embed-flex-col" };
const _hoisted_10$1 = { class: "embed-w-full" };
const _hoisted_11$1 = { class: "embed-flex embed-rounded-md" };
const _hoisted_12$1 = { class: "embed-relative embed-flex embed-items-stretch embed-flex-grow focus-within:embed-z-10" };
const _hoisted_13$1 = /* @__PURE__ */ createBaseVNode("span", null, "Add", -1);
const _hoisted_14$1 = [
  _hoisted_13$1
];
const _hoisted_15$1 = ["textContent"];
const _hoisted_16$1 = { class: "embed-shadow embed-shadow-slate-400 dark:embed-shadow-black embed-bg-slate-100 dark:embed-bg-slate-800 dark:embed-text-slate-100 embed-p-2 embed-rounded-xl embed-overflow-auto embed-overscroll-contain embed-h-32 embed-text-sm" };
const _hoisted_17$1 = ["innerHTML"];
const _hoisted_18$1 = { class: "embed-flex embed-flex-col embed-mx-auto embed-items-center" };
const _hoisted_19 = { class: "embed-flex embed-flex-col embed-gap-1 embed-rounded-md embed-shadow-sm embed-flex-shrink-0" };
const _hoisted_20 = { class: "embed-flex embed-gap-1" };
const _hoisted_21 = { class: "embed-relative embed-flex embed-items-stretch embed-flex-grow focus-within:embed-z-10" };
const _hoisted_22 = /* @__PURE__ */ createBaseVNode("span", null, "Apply", -1);
const _hoisted_23 = ["textContent"];
const _hoisted_24 = {
  key: 3,
  class: "embed-mt-3 embed-text-center embed-p-2 embed-bg-green-600 embed-text-white embed-text-xs embed-rounded-xl"
};
const _hoisted_25 = {
  key: 1,
  class: "embed-flex embed-flex-col embed-gap-1"
};
const _hoisted_26 = { class: "embed-flex embed-space-x-2" };
const _hoisted_27 = { class: "embed-inline-block embed-text-left embed-text-xs embed-italic embed-ml-8 sm:embed-ml-10 dark:embed-text-white" };
const _hoisted_28 = {
  key: 0,
  class: "embed-text-lg"
};
const _hoisted_29 = { key: 1 };
const _hoisted_30 = /* @__PURE__ */ createBaseVNode("span", null, " in stock\xA0", -1);
const _hoisted_31 = ["textContent"];
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n2;
  const _component_DialogTitle = resolveComponent("DialogTitle");
  const _component_GiftIcon = resolveComponent("GiftIcon");
  const _component_Button = resolveComponent("Button");
  const _component_NumberInput = resolveComponent("NumberInput");
  return openBlock(), createElementBlock("div", null, [
    ((_a2 = _ctx.variant.images) == null ? void 0 : _a2.length) > 0 ? (openBlock(), createElementBlock("div", _hoisted_1$8, [
      createBaseVNode("img", {
        class: "embed-object-contain",
        src: _ctx.variant.images[0],
        alt: _ctx.variant.title
      }, null, 8, _hoisted_2$7)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", _hoisted_3$5, [
      createBaseVNode("div", null, [
        createVNode(_component_DialogTitle, {
          as: "h1",
          class: "embed-font-semibold dark:embed-text-white embed-text-lg"
        }, {
          default: withCtx(() => [
            createTextVNode(toDisplayString(_ctx.product.title), 1)
          ]),
          _: 1
        }),
        _ctx.variant.description !== "Default Variant" ? (openBlock(), createElementBlock("p", {
          key: 0,
          class: "dark:embed-text-white embed-text-xs embed-italic",
          innerHTML: _ctx.variant.description
        }, null, 8, _hoisted_4$3)) : createCommentVNode("", true)
      ]),
      createBaseVNode("div", _hoisted_5$3, [
        _ctx.variant.price !== _ctx.variant.total ? (openBlock(), createElementBlock("div", _hoisted_6$2, toDisplayString(_ctx.variant.price), 1)) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_7$2, toDisplayString(_ctx.variant.total), 1)
      ]),
      _ctx.variant.humble ? (openBlock(), createElementBlock("div", _hoisted_8$2, [
        _ctx.orMore ? (openBlock(), createBlock(Transition, {
          key: 0,
          appear: "",
          "enter-from-class": "embed-opacity-0 embed-scale-0",
          "enter-to-class": "opacity-1 embed-scale-100",
          "enter-active-class": "embed-transition embed-transform origin",
          "leave-from-class": "opacity-1 embed-scale-100",
          "leave-to-class": "embed-opacity-0 embed-scale-0",
          "leave-active-class": "embed-transition embed-transform"
        }, {
          default: withCtx(() => {
            var _a3, _b2, _c2, _d2, _e2;
            return [
              createBaseVNode("div", _hoisted_9$1, [
                createBaseVNode("div", _hoisted_10$1, [
                  createBaseVNode("div", _hoisted_11$1, [
                    createBaseVNode("div", _hoisted_12$1, [
                      withDirectives(createBaseVNode("input", {
                        type: "number",
                        name: "extra",
                        id: "extra",
                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.data.extra = $event),
                        class: "dark:embed-bg-black dark:embed-text-white focus:embed-ring-0 embed-border-0 embed-block embed-w-full embed-rounded-none embed-rounded-l-md sm:embed-text-sm embed-shadow-sm dark:embed-shadow-black focus:embed-shadow-md",
                        placeholder: "0.00"
                      }, null, 512), [
                        [vModelText, _ctx.data.extra]
                      ])
                    ]),
                    createBaseVNode("button", {
                      onClick: _cache[1] || (_cache[1] = ($event) => _ctx.apply("extra")),
                      class: "embed--ml-px embed-relative embed-inline-flex embed-items-center embed-space-x-2 embed-px-4 embed-py-2 embed-border-0 embed-text-sm embed-font-medium embed-rounded-r-md embed-text-slate-700 dark:embed-text-slate-200 hover:embed-text-slate-900 dark:hover:embed-text-white embed-shadow-sm dark:embed-shadow-black hover:embed-shadow-md embed-bg-slate-100 dark:embed-bg-slate-800 hover:embed-bg-slate-200 dark:hover:embed-bg-ultra focus:embed-outline-none focus:embed-ring-0"
                    }, _hoisted_14$1)
                  ])
                ]),
                ((_c2 = (_b2 = (_a3 = _ctx.context.error) == null ? void 0 : _a3.errors) == null ? void 0 : _b2.extra) == null ? void 0 : _c2[0]) ? (openBlock(), createElementBlock("p", {
                  key: 0,
                  class: "embed-ml-1.5 embed-text-left embed-text-sm embed-text-red-600 dark:embed-text-red embed-w-full",
                  textContent: toDisplayString((_e2 = (_d2 = _ctx.context.error) == null ? void 0 : _d2.errors) == null ? void 0 : _e2.extra[0])
                }, null, 8, _hoisted_15$1)) : createCommentVNode("", true)
              ])
            ];
          }),
          _: 1
        })) : (openBlock(), createElementBlock("button", {
          key: 1,
          onClick: _cache[2] || (_cache[2] = ($event) => _ctx.orMore = true),
          class: "embed-text-slate-800 dark:embed-text-slate-300 hover:embed-text-black dark:hover:embed-text-white embed-mx-auto embed-font-semibold embed-rounded-full embed-bg-slate-200 dark:embed-bg-slate-800 hover:embed-bg-slate-300 dark:hover:embed-bg-black embed-px-3 embed-py-0.5 embed-shadow hover:embed-shadow-lg dark:embed-shadow-black hover:embed--translate-y-0.5 embed-transition embed-duration-150 embed-ease-in-out"
        }, " Add more "))
      ])) : createCommentVNode("", true),
      createBaseVNode("div", _hoisted_16$1, [
        createBaseVNode("p", {
          innerHTML: _ctx.product.description
        }, null, 8, _hoisted_17$1)
      ]),
      createBaseVNode("div", _hoisted_18$1, [
        _ctx.applyCoupon ? (openBlock(), createBlock(Transition, {
          key: 0,
          appear: "",
          "enter-from-class": "embed-opacity-0 embed-scale-0",
          "enter-to-class": "opacity-1 embed-scale-100",
          "enter-active-class": "embed-transition embed-transform origin",
          "leave-from-class": "opacity-1 embed-scale-100",
          "leave-to-class": "embed-opacity-0 embed-scale-0",
          "leave-active-class": "embed-transition embed-transform"
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_19, [
              createBaseVNode("div", _hoisted_20, [
                createBaseVNode("div", _hoisted_21, [
                  withDirectives(createBaseVNode("input", {
                    type: "text",
                    name: "coupon-code",
                    class: "focus:embed-outline-none embed-shadow-sm hover:embed-shadow focus:embed-shadow-md embed-shadow-slate-200 focus:embed-shadow-slate-300 dark:embed-shadow-black dark:focus:embed-shadow-black focus:embed-ring-0 focus:embed-border-transparent embed-border-transparent embed-placeholder-slate-600 focus:placeholder-slate-800 dark:focus:embed-placeholder-slate-400 embed-text-black dark:embed-text-white embed-block embed-w-full embed-rounded-md sm:embed-text-sm embed-bg-slate-50 focus:embed-bg-white dark:embed-bg-slate-900 dark:focus:embed-bg-black embed-transition embed-duration-300 embed-ease-in-out",
                    placeholder: "Enter Coupon",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.data.coupon = $event)
                  }, null, 512), [
                    [vModelText, _ctx.data.coupon]
                  ])
                ]),
                createVNode(_component_Button, {
                  outline: "",
                  loading: _ctx.isLoading,
                  type: "button",
                  onClick: _cache[4] || (_cache[4] = ($event) => _ctx.apply("coupon")),
                  class: "embed-relative embed-inline-flex embed-items-center embed-space-x-2 embed-px-4 embed-py-2 hover:embed--translate-y-0.5 hover:embed-shadow-md dark:embed-shadow-black embed-duration-150"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_GiftIcon, {
                      class: "embed-h-5 embed-w-5 embed-text-slate-400 dark:embed-text-slate-50",
                      "aria-hidden": "true"
                    }),
                    _hoisted_22
                  ]),
                  _: 1
                }, 8, ["loading"])
              ])
            ])
          ]),
          _: 1
        })) : (openBlock(), createElementBlock("button", {
          key: 1,
          onClick: _cache[5] || (_cache[5] = ($event) => _ctx.applyCoupon = true),
          class: "embed-text-slate-500 hover:embed-text-slate-800 dark:hover:embed-text-slate-200 embed-font-medium embed-mx-auto embed-transition embed-duration-100 embed-ease-in-out"
        }, " Have a coupon code? ")),
        ((_d = (_c = (_b = _ctx.context.error) == null ? void 0 : _b.errors) == null ? void 0 : _c.coupon) == null ? void 0 : _d[0]) ? (openBlock(), createElementBlock("p", {
          key: 2,
          class: "embed-mt-3 embed-ml-1.5 embed-text-left embed-text-sm embed-text-red-600 dark:embed-text-red embed-w-full",
          textContent: toDisplayString((_f = (_e = _ctx.context.error) == null ? void 0 : _e.errors) == null ? void 0 : _f.coupon[0])
        }, null, 8, _hoisted_23)) : createCommentVNode("", true),
        _ctx.variant.coupon && ((_i = (_h = (_g = _ctx.context.error) == null ? void 0 : _g.errors) == null ? void 0 : _h.coupon) == null ? void 0 : _i[0]) === void 0 ? (openBlock(), createElementBlock("p", _hoisted_24, "A " + toDisplayString(_ctx.variant.coupon) + " coupon has successfully been applied!", 1)) : createCommentVNode("", true)
      ]),
      _ctx.variant.visibility == "PUBLIC" || _ctx.variant.visibility == "HIDDEN" ? (openBlock(), createElementBlock("div", _hoisted_25, [
        createBaseVNode("div", _hoisted_26, [
          createVNode(_component_NumberInput, {
            modelValue: _ctx.data.quantity,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.data.quantity = $event),
            min: _ctx.variant.minimum_purchase_quantity,
            max: _ctx.variant.maximum_purchase_quantity
          }, null, 8, ["modelValue", "min", "max"]),
          createVNode(_component_Button, {
            loading: _ctx.isLoading,
            disabled: _ctx.isSoldOut,
            style: normalizeStyle({ "background-color": _ctx.context.customization.theme }),
            class: "embed-w-full disabled:embed-bg-red-600 !embed-text-lg embed-text-white embed-font-medium embed-rounded-md disabled:focus:embed-ring-slate-500",
            onClick: _cache[7] || (_cache[7] = ($event) => _ctx.send("NEXT")),
            toffee: "",
            textContent: toDisplayString(_ctx.isSoldOut ? "Sold out" : "Buy now")
          }, null, 8, ["loading", "disabled", "style", "textContent"])
        ]),
        createBaseVNode("p", _hoisted_27, [
          !_ctx.variant.stock ? (openBlock(), createElementBlock("span", _hoisted_28, "0")) : (openBlock(), createElementBlock("span", _hoisted_29, toDisplayString(_ctx.variant.stock), 1)),
          _hoisted_30
        ]),
        ((_l = (_k = (_j = _ctx.context.error) == null ? void 0 : _j.errors) == null ? void 0 : _k.quantity) == null ? void 0 : _l[0]) ? (openBlock(), createElementBlock("p", {
          key: 0,
          class: "embed-ml-1.5 embed-text-left embed-text-sm embed-text-red-600 dark:embed-text-red embed-w-full",
          textContent: toDisplayString((_n2 = (_m = _ctx.context.error) == null ? void 0 : _m.errors) == null ? void 0 : _n2.quantity[0])
        }, null, 8, _hoisted_31)) : createCommentVNode("", true)
      ])) : createCommentVNode("", true)
    ])
  ]);
}
var Overview = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8]]);
/*!
 * Font Awesome Free 6.1.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2022 Fonticons, Inc.
 */
function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys$1(Object(source), true).forEach(function(key) {
      _defineProperty$1(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof$1(obj) {
  "@babel/helpers - typeof";
  return _typeof$1 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof$1(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
}
function _toConsumableArray$1(arr) {
  return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
}
function _arrayWithoutHoles$1(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray$1(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _iterableToArray$1(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null)
    return;
  var _arr = [];
  var _n2 = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n2 = (_s = _i.next()).done); _n2 = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i)
        break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n2 && _i["return"] != null)
        _i["return"]();
    } finally {
      if (_d)
        throw _e;
    }
  }
  return _arr;
}
function _unsupportedIterableToArray$1(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray$1(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray$1(o, minLen);
}
function _arrayLikeToArray$1(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread$1() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var noop = function noop2() {
};
var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
  mark: noop,
  measure: noop
};
try {
  if (typeof window !== "undefined")
    _WINDOW = window;
  if (typeof document !== "undefined")
    _DOCUMENT = document;
  if (typeof MutationObserver !== "undefined")
    _MUTATION_OBSERVER = MutationObserver;
  if (typeof performance !== "undefined")
    _PERFORMANCE = performance;
} catch (e) {
}
var _ref = _WINDOW.navigator || {}, _ref$userAgent = _ref.userAgent, userAgent = _ref$userAgent === void 0 ? "" : _ref$userAgent;
var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var MUTATION_OBSERVER = _MUTATION_OBSERVER;
var PERFORMANCE = _PERFORMANCE;
!!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === "function" && typeof DOCUMENT.createElement === "function";
var IS_IE = ~userAgent.indexOf("MSIE") || ~userAgent.indexOf("Trident/");
var NAMESPACE_IDENTIFIER = "___FONT_AWESOME___";
var UNITS_IN_GRID = 16;
var DEFAULT_FAMILY_PREFIX = "fa";
var DEFAULT_REPLACEMENT_CLASS = "svg-inline--fa";
var DATA_FA_I2SVG = "data-fa-i2svg";
var DATA_FA_PSEUDO_ELEMENT = "data-fa-pseudo-element";
var DATA_FA_PSEUDO_ELEMENT_PENDING = "data-fa-pseudo-element-pending";
var DATA_PREFIX = "data-prefix";
var DATA_ICON = "data-icon";
var HTML_CLASS_I2SVG_BASE_CLASS = "fontawesome-i2svg";
var MUTATION_APPROACH_ASYNC = "async";
var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ["HTML", "HEAD", "STYLE", "SCRIPT"];
var PRODUCTION$1 = function() {
  try {
    return true;
  } catch (e) {
    return false;
  }
}();
var PREFIX_TO_STYLE = {
  "fas": "solid",
  "fa-solid": "solid",
  "far": "regular",
  "fa-regular": "regular",
  "fal": "light",
  "fa-light": "light",
  "fat": "thin",
  "fa-thin": "thin",
  "fad": "duotone",
  "fa-duotone": "duotone",
  "fab": "brands",
  "fa-brands": "brands",
  "fak": "kit",
  "fa-kit": "kit",
  "fa": "solid"
};
var STYLE_TO_PREFIX = {
  "solid": "fas",
  "regular": "far",
  "light": "fal",
  "thin": "fat",
  "duotone": "fad",
  "brands": "fab",
  "kit": "fak"
};
var PREFIX_TO_LONG_STYLE = {
  "fab": "fa-brands",
  "fad": "fa-duotone",
  "fak": "fa-kit",
  "fal": "fa-light",
  "far": "fa-regular",
  "fas": "fa-solid",
  "fat": "fa-thin"
};
var LONG_STYLE_TO_PREFIX = {
  "fa-brands": "fab",
  "fa-duotone": "fad",
  "fa-kit": "fak",
  "fa-light": "fal",
  "fa-regular": "far",
  "fa-solid": "fas",
  "fa-thin": "fat"
};
var ICON_SELECTION_SYNTAX_PATTERN = /fa[srltdbk]?[\-\ ]/;
var LAYERS_TEXT_CLASSNAME = "fa-layers-text";
var FONT_FAMILY_PATTERN = /Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Kit)?.*/i;
var FONT_WEIGHT_TO_PREFIX = {
  "900": "fas",
  "400": "far",
  "normal": "far",
  "300": "fal",
  "100": "fat"
};
var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
var ATTRIBUTES_WATCHED_FOR_MUTATION = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"];
var DUOTONE_CLASSES = {
  GROUP: "duotone-group",
  SWAP_OPACITY: "swap-opacity",
  PRIMARY: "primary",
  SECONDARY: "secondary"
};
var RESERVED_CLASSES = [].concat(_toConsumableArray$1(Object.keys(STYLE_TO_PREFIX)), ["2xs", "xs", "sm", "lg", "xl", "2xl", "beat", "border", "fade", "beat-fade", "bounce", "flip-both", "flip-horizontal", "flip-vertical", "flip", "fw", "inverse", "layers-counter", "layers-text", "layers", "li", "pull-left", "pull-right", "pulse", "rotate-180", "rotate-270", "rotate-90", "rotate-by", "shake", "spin-pulse", "spin-reverse", "spin", "stack-1x", "stack-2x", "stack", "ul", DUOTONE_CLASSES.GROUP, DUOTONE_CLASSES.SWAP_OPACITY, DUOTONE_CLASSES.PRIMARY, DUOTONE_CLASSES.SECONDARY]).concat(oneToTen.map(function(n) {
  return "".concat(n, "x");
})).concat(oneToTwenty.map(function(n) {
  return "w-".concat(n);
}));
var initial = WINDOW.FontAwesomeConfig || {};
function getAttrConfig(attr) {
  var element = DOCUMENT.querySelector("script[" + attr + "]");
  if (element) {
    return element.getAttribute(attr);
  }
}
function coerce(val) {
  if (val === "")
    return true;
  if (val === "false")
    return false;
  if (val === "true")
    return true;
  return val;
}
if (DOCUMENT && typeof DOCUMENT.querySelector === "function") {
  var attrs = [["data-family-prefix", "familyPrefix"], ["data-style-default", "styleDefault"], ["data-replacement-class", "replacementClass"], ["data-auto-replace-svg", "autoReplaceSvg"], ["data-auto-add-css", "autoAddCss"], ["data-auto-a11y", "autoA11y"], ["data-search-pseudo-elements", "searchPseudoElements"], ["data-observe-mutations", "observeMutations"], ["data-mutate-approach", "mutateApproach"], ["data-keep-original-source", "keepOriginalSource"], ["data-measure-performance", "measurePerformance"], ["data-show-missing-icons", "showMissingIcons"]];
  attrs.forEach(function(_ref2) {
    var _ref22 = _slicedToArray(_ref2, 2), attr = _ref22[0], key = _ref22[1];
    var val = coerce(getAttrConfig(attr));
    if (val !== void 0 && val !== null) {
      initial[key] = val;
    }
  });
}
var _default = {
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  styleDefault: "solid",
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: "async",
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};
var _config = _objectSpread2$1(_objectSpread2$1({}, _default), initial);
if (!_config.autoReplaceSvg)
  _config.observeMutations = false;
var config = {};
Object.keys(_config).forEach(function(key) {
  Object.defineProperty(config, key, {
    enumerable: true,
    set: function set2(val) {
      _config[key] = val;
      _onChangeCb.forEach(function(cb) {
        return cb(config);
      });
    },
    get: function get2() {
      return _config[key];
    }
  });
});
WINDOW.FontAwesomeConfig = config;
var _onChangeCb = [];
function onChange(cb) {
  _onChangeCb.push(cb);
  return function() {
    _onChangeCb.splice(_onChangeCb.indexOf(cb), 1);
  };
}
var d = UNITS_IN_GRID;
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};
function insertCss(css2) {
  if (!css2 || !IS_DOM) {
    return;
  }
  var style = DOCUMENT.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css2;
  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;
  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || "").toUpperCase();
    if (["STYLE", "LINK"].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }
  DOCUMENT.head.insertBefore(style, beforeChild);
  return css2;
}
var idPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function nextUniqueId() {
  var size2 = 12;
  var id = "";
  while (size2-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }
  return id;
}
function toArray(obj) {
  var array = [];
  for (var i = (obj || []).length >>> 0; i--; ) {
    array[i] = obj[i];
  }
  return array;
}
function classArray(node) {
  if (node.classList) {
    return toArray(node.classList);
  } else {
    return (node.getAttribute("class") || "").split(" ").filter(function(i) {
      return i;
    });
  }
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function(acc, attributeName) {
    return acc + "".concat(attributeName, '="').concat(htmlEscape(attributes[attributeName]), '" ');
  }, "").trim();
}
function joinStyles(styles2) {
  return Object.keys(styles2 || {}).reduce(function(acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles2[styleName].trim(), ";");
  }, "");
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref2) {
  var transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
  var outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  var inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  var path2 = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer,
    inner,
    path: path2
  };
}
function transformForCss(_ref2) {
  var transform = _ref2.transform, _ref2$width = _ref2.width, width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width, _ref2$height = _ref2.height, height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height, _ref2$startCentered = _ref2.startCentered, startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
  var val = "";
  if (startCentered && IS_IE) {
    val += "translate(".concat(transform.x / d - width / 2, "em, ").concat(transform.y / d - height / 2, "em) ");
  } else if (startCentered) {
    val += "translate(calc(-50% + ".concat(transform.x / d, "em), calc(-50% + ").concat(transform.y / d, "em)) ");
  } else {
    val += "translate(".concat(transform.x / d, "em, ").concat(transform.y / d, "em) ");
  }
  val += "scale(".concat(transform.size / d * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d * (transform.flipY ? -1 : 1), ") ");
  val += "rotate(".concat(transform.rotate, "deg) ");
  return val;
}
var baseStyles = ':root, :host {\n  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Solid";\n  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Regular";\n  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Light";\n  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Thin";\n  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";\n  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";\n}\n\nsvg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {\n  overflow: visible;\n  box-sizing: content-box;\n}\n\n.svg-inline--fa {\n  display: var(--fa-display, inline-block);\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-2xs {\n  vertical-align: 0.1em;\n}\n.svg-inline--fa.fa-xs {\n  vertical-align: 0em;\n}\n.svg-inline--fa.fa-sm {\n  vertical-align: -0.0714285705em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.2em;\n}\n.svg-inline--fa.fa-xl {\n  vertical-align: -0.25em;\n}\n.svg-inline--fa.fa-2xl {\n  vertical-align: -0.3125em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: var(--fa-pull-margin, 0.3em);\n  width: auto;\n}\n.svg-inline--fa.fa-li {\n  width: var(--fa-li-width, 2em);\n  top: 0.25em;\n}\n.svg-inline--fa.fa-fw {\n  width: var(--fa-fw-width, 1.25em);\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: var(--fa-counter-background-color, #ff253a);\n  border-radius: var(--fa-counter-border-radius, 1em);\n  box-sizing: border-box;\n  color: var(--fa-inverse, #fff);\n  line-height: var(--fa-counter-line-height, 1);\n  max-width: var(--fa-counter-max-width, 5em);\n  min-width: var(--fa-counter-min-width, 1.5em);\n  overflow: hidden;\n  padding: var(--fa-counter-padding, 0.25em 0.5em);\n  right: var(--fa-right, 0);\n  text-overflow: ellipsis;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-counter-scale, 0.25));\n          transform: scale(var(--fa-counter-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: var(--fa-bottom, 0);\n  right: var(--fa-right, 0);\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: var(--fa-bottom, 0);\n  left: var(--fa-left, 0);\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  top: var(--fa-top, 0);\n  right: var(--fa-right, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: var(--fa-left, 0);\n  right: auto;\n  top: var(--fa-top, 0);\n  -webkit-transform: scale(var(--fa-layers-scale, 0.25));\n          transform: scale(var(--fa-layers-scale, 0.25));\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-2xs {\n  font-size: 0.625em;\n  line-height: 0.1em;\n  vertical-align: 0.225em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n  line-height: 0.0833333337em;\n  vertical-align: 0.125em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n  line-height: 0.0714285718em;\n  vertical-align: 0.0535714295em;\n}\n\n.fa-lg {\n  font-size: 1.25em;\n  line-height: 0.05em;\n  vertical-align: -0.075em;\n}\n\n.fa-xl {\n  font-size: 1.5em;\n  line-height: 0.0416666682em;\n  vertical-align: -0.125em;\n}\n\n.fa-2xl {\n  font-size: 2em;\n  line-height: 0.03125em;\n  vertical-align: -0.1875em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: var(--fa-li-margin, 2.5em);\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: calc(var(--fa-li-width, 2em) * -1);\n  position: absolute;\n  text-align: center;\n  width: var(--fa-li-width, 2em);\n  line-height: inherit;\n}\n\n.fa-border {\n  border-color: var(--fa-border-color, #eee);\n  border-radius: var(--fa-border-radius, 0.1em);\n  border-style: var(--fa-border-style, solid);\n  border-width: var(--fa-border-width, 0.08em);\n  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);\n}\n\n.fa-pull-left {\n  float: left;\n  margin-right: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-pull-right {\n  float: right;\n  margin-left: var(--fa-pull-margin, 0.3em);\n}\n\n.fa-beat {\n  -webkit-animation-name: fa-beat;\n          animation-name: fa-beat;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-bounce {\n  -webkit-animation-name: fa-bounce;\n          animation-name: fa-bounce;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));\n}\n\n.fa-fade {\n  -webkit-animation-name: fa-fade;\n          animation-name: fa-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-beat-fade {\n  -webkit-animation-name: fa-beat-fade;\n          animation-name: fa-beat-fade;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));\n}\n\n.fa-flip {\n  -webkit-animation-name: fa-flip;\n          animation-name: fa-flip;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);\n          animation-timing-function: var(--fa-animation-timing, ease-in-out);\n}\n\n.fa-shake {\n  -webkit-animation-name: fa-shake;\n          animation-name: fa-shake;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-delay: var(--fa-animation-delay, 0);\n          animation-delay: var(--fa-animation-delay, 0);\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 2s);\n          animation-duration: var(--fa-animation-duration, 2s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, linear);\n          animation-timing-function: var(--fa-animation-timing, linear);\n}\n\n.fa-spin-reverse {\n  --fa-animation-direction: reverse;\n}\n\n.fa-pulse,\n.fa-spin-pulse {\n  -webkit-animation-name: fa-spin;\n          animation-name: fa-spin;\n  -webkit-animation-direction: var(--fa-animation-direction, normal);\n          animation-direction: var(--fa-animation-direction, normal);\n  -webkit-animation-duration: var(--fa-animation-duration, 1s);\n          animation-duration: var(--fa-animation-duration, 1s);\n  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n          animation-iteration-count: var(--fa-animation-iteration-count, infinite);\n  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));\n          animation-timing-function: var(--fa-animation-timing, steps(8));\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fa-beat,\n.fa-bounce,\n.fa-fade,\n.fa-beat-fade,\n.fa-flip,\n.fa-pulse,\n.fa-shake,\n.fa-spin,\n.fa-spin-pulse {\n    -webkit-animation-delay: -1ms;\n            animation-delay: -1ms;\n    -webkit-animation-duration: 1ms;\n            animation-duration: 1ms;\n    -webkit-animation-iteration-count: 1;\n            animation-iteration-count: 1;\n    transition-delay: 0s;\n    transition-duration: 0s;\n  }\n}\n@-webkit-keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@keyframes fa-beat {\n  0%, 90% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  45% {\n    -webkit-transform: scale(var(--fa-beat-scale, 1.25));\n            transform: scale(var(--fa-beat-scale, 1.25));\n  }\n}\n@-webkit-keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@keyframes fa-bounce {\n  0% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  10% {\n    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);\n  }\n  30% {\n    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));\n  }\n  50% {\n    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);\n  }\n  57% {\n    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));\n  }\n  64% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n  100% {\n    -webkit-transform: scale(1, 1) translateY(0);\n            transform: scale(1, 1) translateY(0);\n  }\n}\n@-webkit-keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@keyframes fa-fade {\n  50% {\n    opacity: var(--fa-fade-opacity, 0.4);\n  }\n}\n@-webkit-keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@keyframes fa-beat-fade {\n  0%, 100% {\n    opacity: var(--fa-beat-fade-opacity, 0.4);\n    -webkit-transform: scale(1);\n            transform: scale(1);\n  }\n  50% {\n    opacity: 1;\n    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));\n            transform: scale(var(--fa-beat-fade-scale, 1.125));\n  }\n}\n@-webkit-keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@keyframes fa-flip {\n  50% {\n    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));\n  }\n}\n@-webkit-keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@keyframes fa-shake {\n  0% {\n    -webkit-transform: rotate(-15deg);\n            transform: rotate(-15deg);\n  }\n  4% {\n    -webkit-transform: rotate(15deg);\n            transform: rotate(15deg);\n  }\n  8%, 24% {\n    -webkit-transform: rotate(-18deg);\n            transform: rotate(-18deg);\n  }\n  12%, 28% {\n    -webkit-transform: rotate(18deg);\n            transform: rotate(18deg);\n  }\n  16% {\n    -webkit-transform: rotate(-22deg);\n            transform: rotate(-22deg);\n  }\n  20% {\n    -webkit-transform: rotate(22deg);\n            transform: rotate(22deg);\n  }\n  32% {\n    -webkit-transform: rotate(-12deg);\n            transform: rotate(-12deg);\n  }\n  36% {\n    -webkit-transform: rotate(12deg);\n            transform: rotate(12deg);\n  }\n  40%, 100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n}\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both,\n.fa-flip-horizontal.fa-flip-vertical {\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n.fa-rotate-by {\n  -webkit-transform: rotate(var(--fa-rotate-angle, none));\n          transform: rotate(var(--fa-rotate-angle, none));\n}\n\n.fa-stack {\n  display: inline-block;\n  vertical-align: middle;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: var(--fa-stack-z-index, auto);\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}\n\n.sr-only,\n.fa-sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.sr-only-focusable:not(:focus),\n.fa-sr-only-focusable:not(:focus) {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border-width: 0;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse,\n.fa-duotone.fa-inverse {\n  color: var(--fa-inverse, #fff);\n}';
function css() {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config.familyPrefix;
  var rc = config.replacementClass;
  var s = baseStyles;
  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp("\\.".concat(dfp, "\\-"), "g");
    var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), "g");
    var rPatt = new RegExp("\\.".concat(drc), "g");
    s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }
  return s;
}
var _cssInserted = false;
function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css());
    _cssInserted = true;
  }
}
var InjectCSS = {
  mixout: function mixout() {
    return {
      dom: {
        css,
        insertCss: ensureCss
      }
    };
  },
  hooks: function hooks() {
    return {
      beforeDOMElementCreation: function beforeDOMElementCreation() {
        ensureCss();
      },
      beforeI2svg: function beforeI2svg() {
        ensureCss();
      }
    };
  }
};
var w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER])
  w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles)
  w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks)
  w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims)
  w[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w[NAMESPACE_IDENTIFIER];
var functions = [];
var listener = function listener2() {
  DOCUMENT.removeEventListener("DOMContentLoaded", listener2);
  loaded = 1;
  functions.map(function(fn) {
    return fn();
  });
};
var loaded = false;
if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
  if (!loaded)
    DOCUMENT.addEventListener("DOMContentLoaded", listener);
}
function domready(fn) {
  if (!IS_DOM)
    return;
  loaded ? setTimeout(fn, 0) : functions.push(fn);
}
function toHtml(abstractNodes) {
  var tag = abstractNodes.tag, _abstractNodes$attrib = abstractNodes.attributes, attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib, _abstractNodes$childr = abstractNodes.children, children2 = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;
  if (typeof abstractNodes === "string") {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children2.map(toHtml).join(""), "</").concat(tag, ">");
  }
}
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix,
      iconName,
      icon: mapping[prefix][iconName]
    };
  }
}
var bindInternal4 = function bindInternal42(func, thisContext) {
  return function(a, b, c, d2) {
    return func.call(thisContext, a, b, c, d2);
  };
};
var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject), length = keys.length, iterator = thisContext !== void 0 ? bindInternal4(fn, thisContext) : fn, i, key, result;
  if (initialValue === void 0) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }
  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }
  return result;
};
function ucs2decode(string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 55296 && value <= 56319 && counter < length) {
      var extra = string.charCodeAt(counter++);
      if ((extra & 64512) == 56320) {
        output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
      } else {
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}
function toHex(unicode) {
  var decoded = ucs2decode(unicode);
  return decoded.length === 1 ? decoded[0].toString(16) : null;
}
function codePointAt(string, index) {
  var size2 = string.length;
  var first = string.charCodeAt(index);
  var second;
  if (first >= 55296 && first <= 56319 && size2 > index + 1) {
    second = string.charCodeAt(index + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function normalizeIcons(icons) {
  return Object.keys(icons).reduce(function(acc, iconName) {
    var icon3 = icons[iconName];
    var expanded = !!icon3.icon;
    if (expanded) {
      acc[icon3.iconName] = icon3.icon;
    } else {
      acc[iconName] = icon3;
    }
    return acc;
  }, {});
}
function defineIcons(prefix, icons) {
  var params = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var _params$skipHooks = params.skipHooks, skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
  var normalized = normalizeIcons(icons);
  if (typeof namespace.hooks.addPack === "function" && !skipHooks) {
    namespace.hooks.addPack(prefix, normalizeIcons(icons));
  } else {
    namespace.styles[prefix] = _objectSpread2$1(_objectSpread2$1({}, namespace.styles[prefix] || {}), normalized);
  }
  if (prefix === "fas") {
    defineIcons("fa", icons);
  }
}
var styles$1 = namespace.styles, shims = namespace.shims;
var LONG_STYLE = Object.values(PREFIX_TO_LONG_STYLE);
var _defaultUsablePrefix = null;
var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};
var _byOldUnicode = {};
var _byAlias = {};
var PREFIXES = Object.keys(PREFIX_TO_STYLE);
function isReserved(name) {
  return ~RESERVED_CLASSES.indexOf(name);
}
function getIconName(familyPrefix, cls) {
  var parts = cls.split("-");
  var prefix = parts[0];
  var iconName = parts.slice(1).join("-");
  if (prefix === familyPrefix && iconName !== "" && !isReserved(iconName)) {
    return iconName;
  } else {
    return null;
  }
}
var build = function build2() {
  var lookup = function lookup2(reducer) {
    return reduce(styles$1, function(o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };
  _byUnicode = lookup(function(acc, icon3, iconName) {
    if (icon3[3]) {
      acc[icon3[3]] = iconName;
    }
    if (icon3[2]) {
      var aliases = icon3[2].filter(function(a) {
        return typeof a === "number";
      });
      aliases.forEach(function(alias) {
        acc[alias.toString(16)] = iconName;
      });
    }
    return acc;
  });
  _byLigature = lookup(function(acc, icon3, iconName) {
    acc[iconName] = iconName;
    if (icon3[2]) {
      var aliases = icon3[2].filter(function(a) {
        return typeof a === "string";
      });
      aliases.forEach(function(alias) {
        acc[alias] = iconName;
      });
    }
    return acc;
  });
  _byAlias = lookup(function(acc, icon3, iconName) {
    var aliases = icon3[2];
    acc[iconName] = iconName;
    aliases.forEach(function(alias) {
      acc[alias] = iconName;
    });
    return acc;
  });
  var hasRegular = "far" in styles$1 || config.autoFetchSvg;
  var shimLookups = reduce(shims, function(acc, shim) {
    var maybeNameMaybeUnicode = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];
    if (prefix === "far" && !hasRegular) {
      prefix = "fas";
    }
    if (typeof maybeNameMaybeUnicode === "string") {
      acc.names[maybeNameMaybeUnicode] = {
        prefix,
        iconName
      };
    }
    if (typeof maybeNameMaybeUnicode === "number") {
      acc.unicodes[maybeNameMaybeUnicode.toString(16)] = {
        prefix,
        iconName
      };
    }
    return acc;
  }, {
    names: {},
    unicodes: {}
  });
  _byOldName = shimLookups.names;
  _byOldUnicode = shimLookups.unicodes;
  _defaultUsablePrefix = getCanonicalPrefix(config.styleDefault);
};
onChange(function(c) {
  _defaultUsablePrefix = getCanonicalPrefix(c.styleDefault);
});
build();
function byUnicode(prefix, unicode) {
  return (_byUnicode[prefix] || {})[unicode];
}
function byLigature(prefix, ligature) {
  return (_byLigature[prefix] || {})[ligature];
}
function byAlias(prefix, alias) {
  return (_byAlias[prefix] || {})[alias];
}
function byOldName(name) {
  return _byOldName[name] || {
    prefix: null,
    iconName: null
  };
}
function byOldUnicode(unicode) {
  var oldUnicode = _byOldUnicode[unicode];
  var newUnicode = byUnicode("fas", unicode);
  return oldUnicode || (newUnicode ? {
    prefix: "fas",
    iconName: newUnicode
  } : null) || {
    prefix: null,
    iconName: null
  };
}
function getDefaultUsablePrefix() {
  return _defaultUsablePrefix;
}
var emptyCanonicalIcon = function emptyCanonicalIcon2() {
  return {
    prefix: null,
    iconName: null,
    rest: []
  };
};
function getCanonicalPrefix(styleOrPrefix) {
  var style = PREFIX_TO_STYLE[styleOrPrefix];
  var prefix = STYLE_TO_PREFIX[styleOrPrefix] || STYLE_TO_PREFIX[style];
  var defined = styleOrPrefix in namespace.styles ? styleOrPrefix : null;
  return prefix || defined || null;
}
function getCanonicalIcon(values) {
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _params$skipLookups = params.skipLookups, skipLookups = _params$skipLookups === void 0 ? false : _params$skipLookups;
  var givenPrefix = null;
  var canonical = values.reduce(function(acc, cls) {
    var iconName = getIconName(config.familyPrefix, cls);
    if (styles$1[cls]) {
      cls = LONG_STYLE.includes(cls) ? LONG_STYLE_TO_PREFIX[cls] : cls;
      givenPrefix = cls;
      acc.prefix = cls;
    } else if (PREFIXES.indexOf(cls) > -1) {
      givenPrefix = cls;
      acc.prefix = getCanonicalPrefix(cls);
    } else if (iconName) {
      acc.iconName = iconName;
    } else if (cls !== config.replacementClass) {
      acc.rest.push(cls);
    }
    if (!skipLookups && acc.prefix && acc.iconName) {
      var shim = givenPrefix === "fa" ? byOldName(acc.iconName) : {};
      var aliasIconName = byAlias(acc.prefix, acc.iconName);
      if (shim.prefix) {
        givenPrefix = null;
      }
      acc.iconName = shim.iconName || aliasIconName || acc.iconName;
      acc.prefix = shim.prefix || acc.prefix;
      if (acc.prefix === "far" && !styles$1["far"] && styles$1["fas"] && !config.autoFetchSvg) {
        acc.prefix = "fas";
      }
    }
    return acc;
  }, emptyCanonicalIcon());
  if (canonical.prefix === "fa" || givenPrefix === "fa") {
    canonical.prefix = getDefaultUsablePrefix() || "fas";
  }
  return canonical;
}
var Library = /* @__PURE__ */ function() {
  function Library2() {
    _classCallCheck(this, Library2);
    this.definitions = {};
  }
  _createClass(Library2, [{
    key: "add",
    value: function add2() {
      var _this = this;
      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }
      var additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach(function(key) {
        _this.definitions[key] = _objectSpread2$1(_objectSpread2$1({}, _this.definitions[key] || {}), additions[key]);
        defineIcons(key, additions[key]);
        var longPrefix = PREFIX_TO_LONG_STYLE[key];
        if (longPrefix)
          defineIcons(longPrefix, additions[key]);
        build();
      });
    }
  }, {
    key: "reset",
    value: function reset2() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map(function(key) {
        var _normalized$key = normalized[key], prefix = _normalized$key.prefix, iconName = _normalized$key.iconName, icon3 = _normalized$key.icon;
        var aliases = icon3[2];
        if (!additions[prefix])
          additions[prefix] = {};
        if (aliases.length > 0) {
          aliases.forEach(function(alias) {
            if (typeof alias === "string") {
              additions[prefix][alias] = icon3;
            }
          });
        }
        additions[prefix][iconName] = icon3;
      });
      return additions;
    }
  }]);
  return Library2;
}();
var _plugins = [];
var _hooks = {};
var providers = {};
var defaultProviderKeys = Object.keys(providers);
function registerPlugins(nextPlugins, _ref2) {
  var obj = _ref2.mixoutsTo;
  _plugins = nextPlugins;
  _hooks = {};
  Object.keys(providers).forEach(function(k) {
    if (defaultProviderKeys.indexOf(k) === -1) {
      delete providers[k];
    }
  });
  _plugins.forEach(function(plugin) {
    var mixout8 = plugin.mixout ? plugin.mixout() : {};
    Object.keys(mixout8).forEach(function(tk) {
      if (typeof mixout8[tk] === "function") {
        obj[tk] = mixout8[tk];
      }
      if (_typeof$1(mixout8[tk]) === "object") {
        Object.keys(mixout8[tk]).forEach(function(sk) {
          if (!obj[tk]) {
            obj[tk] = {};
          }
          obj[tk][sk] = mixout8[tk][sk];
        });
      }
    });
    if (plugin.hooks) {
      var hooks8 = plugin.hooks();
      Object.keys(hooks8).forEach(function(hook) {
        if (!_hooks[hook]) {
          _hooks[hook] = [];
        }
        _hooks[hook].push(hooks8[hook]);
      });
    }
    if (plugin.provides) {
      plugin.provides(providers);
    }
  });
  return obj;
}
function chainHooks(hook, accumulator) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  var hookFns = _hooks[hook] || [];
  hookFns.forEach(function(hookFn) {
    accumulator = hookFn.apply(null, [accumulator].concat(args));
  });
  return accumulator;
}
function callHooks(hook) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  var hookFns = _hooks[hook] || [];
  hookFns.forEach(function(hookFn) {
    hookFn.apply(null, args);
  });
  return void 0;
}
function callProvided() {
  var hook = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  return providers[hook] ? providers[hook].apply(null, args) : void 0;
}
function findIconDefinition(iconLookup) {
  if (iconLookup.prefix === "fa") {
    iconLookup.prefix = "fas";
  }
  var iconName = iconLookup.iconName;
  var prefix = iconLookup.prefix || getDefaultUsablePrefix();
  if (!iconName)
    return;
  iconName = byAlias(prefix, iconName) || iconName;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}
var library = new Library();
var noAuto = function noAuto2() {
  config.autoReplaceSvg = false;
  config.observeMutations = false;
  callHooks("noAuto");
};
var dom = {
  i2svg: function i2svg() {
    var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (IS_DOM) {
      callHooks("beforeI2svg", params);
      callProvided("pseudoElements2svg", params);
      return callProvided("i2svg", params);
    } else {
      return Promise.reject("Operation requires a DOM of some kind.");
    }
  },
  watch: function watch2() {
    var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var autoReplaceSvgRoot = params.autoReplaceSvgRoot;
    if (config.autoReplaceSvg === false) {
      config.autoReplaceSvg = true;
    }
    config.observeMutations = true;
    domready(function() {
      autoReplace({
        autoReplaceSvgRoot
      });
      callHooks("watch", params);
    });
  }
};
var parse = {
  icon: function icon2(_icon) {
    if (_icon === null) {
      return null;
    }
    if (_typeof$1(_icon) === "object" && _icon.prefix && _icon.iconName) {
      return {
        prefix: _icon.prefix,
        iconName: byAlias(_icon.prefix, _icon.iconName) || _icon.iconName
      };
    }
    if (Array.isArray(_icon) && _icon.length === 2) {
      var iconName = _icon[1].indexOf("fa-") === 0 ? _icon[1].slice(3) : _icon[1];
      var prefix = getCanonicalPrefix(_icon[0]);
      return {
        prefix,
        iconName: byAlias(prefix, iconName) || iconName
      };
    }
    if (typeof _icon === "string" && (_icon.indexOf("".concat(config.familyPrefix, "-")) > -1 || _icon.match(ICON_SELECTION_SYNTAX_PATTERN))) {
      var canonicalIcon = getCanonicalIcon(_icon.split(" "), {
        skipLookups: true
      });
      return {
        prefix: canonicalIcon.prefix || getDefaultUsablePrefix(),
        iconName: byAlias(canonicalIcon.prefix, canonicalIcon.iconName) || canonicalIcon.iconName
      };
    }
    if (typeof _icon === "string") {
      var _prefix = getDefaultUsablePrefix();
      return {
        prefix: _prefix,
        iconName: byAlias(_prefix, _icon) || _icon
      };
    }
  }
};
var api = {
  noAuto,
  config,
  dom,
  parse,
  library,
  findIconDefinition,
  toHtml
};
var autoReplace = function autoReplace2() {
  var params = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var _params$autoReplaceSv = params.autoReplaceSvgRoot, autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv;
  if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg)
    api.dom.i2svg({
      node: autoReplaceSvgRoot
    });
};
function domVariants(val, abstractCreator) {
  Object.defineProperty(val, "abstract", {
    get: abstractCreator
  });
  Object.defineProperty(val, "html", {
    get: function get2() {
      return val.abstract.map(function(a) {
        return toHtml(a);
      });
    }
  });
  Object.defineProperty(val, "node", {
    get: function get2() {
      if (!IS_DOM)
        return;
      var container2 = DOCUMENT.createElement("div");
      container2.innerHTML = val.html;
      return container2.children;
    }
  });
  return val;
}
function asIcon(_ref2) {
  var children2 = _ref2.children, main = _ref2.main, mask = _ref2.mask, attributes = _ref2.attributes, styles2 = _ref2.styles, transform = _ref2.transform;
  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width, height = main.height;
    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes["style"] = joinStyles(_objectSpread2$1(_objectSpread2$1({}, styles2), {}, {
      "transform-origin": "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }
  return [{
    tag: "svg",
    attributes,
    children: children2
  }];
}
function asSymbol(_ref2) {
  var prefix = _ref2.prefix, iconName = _ref2.iconName, children2 = _ref2.children, attributes = _ref2.attributes, symbol = _ref2.symbol;
  var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: "svg",
    attributes: {
      style: "display: none;"
    },
    children: [{
      tag: "symbol",
      attributes: _objectSpread2$1(_objectSpread2$1({}, attributes), {}, {
        id
      }),
      children: children2
    }]
  }];
}
function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons, main = _params$icons.main, mask = _params$icons.mask, prefix = params.prefix, iconName = params.iconName, transform = params.transform, symbol = params.symbol, title = params.title, maskId = params.maskId, titleId = params.titleId, extra = params.extra, _params$watchable = params.watchable, watchable = _params$watchable === void 0 ? false : _params$watchable;
  var _ref2 = mask.found ? mask : main, width = _ref2.width, height = _ref2.height;
  var isUploadedIcon = prefix === "fak";
  var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : ""].filter(function(c) {
    return extra.classes.indexOf(c) === -1;
  }).filter(function(c) {
    return c !== "" || !!c;
  }).concat(extra.classes).join(" ");
  var content = {
    children: [],
    attributes: _objectSpread2$1(_objectSpread2$1({}, extra.attributes), {}, {
      "data-prefix": prefix,
      "data-icon": iconName,
      "class": attrClass,
      "role": extra.attributes.role || "img",
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 ".concat(width, " ").concat(height)
    })
  };
  var uploadedIconWidthStyle = isUploadedIcon && !~extra.classes.indexOf("fa-fw") ? {
    width: "".concat(width / height * 16 * 0.0625, "em")
  } : {};
  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = "";
  }
  if (title) {
    content.children.push({
      tag: "title",
      attributes: {
        id: content.attributes["aria-labelledby"] || "title-".concat(titleId || nextUniqueId())
      },
      children: [title]
    });
    delete content.attributes.title;
  }
  var args = _objectSpread2$1(_objectSpread2$1({}, content), {}, {
    prefix,
    iconName,
    main,
    mask,
    maskId,
    transform,
    symbol,
    styles: _objectSpread2$1(_objectSpread2$1({}, uploadedIconWidthStyle), extra.styles)
  });
  var _ref22 = mask.found && main.found ? callProvided("generateAbstractMask", args) || {
    children: [],
    attributes: {}
  } : callProvided("generateAbstractIcon", args) || {
    children: [],
    attributes: {}
  }, children2 = _ref22.children, attributes = _ref22.attributes;
  args.children = children2;
  args.attributes = attributes;
  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}
function makeLayersTextAbstract(params) {
  var content = params.content, width = params.width, height = params.height, transform = params.transform, title = params.title, extra = params.extra, _params$watchable2 = params.watchable, watchable = _params$watchable2 === void 0 ? false : _params$watchable2;
  var attributes = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, extra.attributes), title ? {
    "title": title
  } : {}), {}, {
    "class": extra.classes.join(" ")
  });
  if (watchable) {
    attributes[DATA_FA_I2SVG] = "";
  }
  var styles2 = _objectSpread2$1({}, extra.styles);
  if (transformIsMeaningful(transform)) {
    styles2["transform"] = transformForCss({
      transform,
      startCentered: true,
      width,
      height
    });
    styles2["-webkit-transform"] = styles2["transform"];
  }
  var styleString = joinStyles(styles2);
  if (styleString.length > 0) {
    attributes["style"] = styleString;
  }
  var val = [];
  val.push({
    tag: "span",
    attributes,
    children: [content]
  });
  if (title) {
    val.push({
      tag: "span",
      attributes: {
        class: "sr-only"
      },
      children: [title]
    });
  }
  return val;
}
function makeLayersCounterAbstract(params) {
  var content = params.content, title = params.title, extra = params.extra;
  var attributes = _objectSpread2$1(_objectSpread2$1(_objectSpread2$1({}, extra.attributes), title ? {
    "title": title
  } : {}), {}, {
    "class": extra.classes.join(" ")
  });
  var styleString = joinStyles(extra.styles);
  if (styleString.length > 0) {
    attributes["style"] = styleString;
  }
  var val = [];
  val.push({
    tag: "span",
    attributes,
    children: [content]
  });
  if (title) {
    val.push({
      tag: "span",
      attributes: {
        class: "sr-only"
      },
      children: [title]
    });
  }
  return val;
}
var styles$1$1 = namespace.styles;
function asFoundIcon(icon3) {
  var width = icon3[0];
  var height = icon3[1];
  var _icon$slice = icon3.slice(4), _icon$slice2 = _slicedToArray(_icon$slice, 1), vectorData = _icon$slice2[0];
  var element = null;
  if (Array.isArray(vectorData)) {
    element = {
      tag: "g",
      attributes: {
        class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: "path",
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: "currentColor",
          d: vectorData[0]
        }
      }, {
        tag: "path",
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: "currentColor",
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: "path",
      attributes: {
        fill: "currentColor",
        d: vectorData
      }
    };
  }
  return {
    found: true,
    width,
    height,
    icon: element
  };
}
var missingIconResolutionMixin = {
  found: false,
  width: 512,
  height: 512
};
function maybeNotifyMissing(iconName, prefix) {
  if (!PRODUCTION$1 && !config.showMissingIcons && iconName) {
    console.error('Icon with name "'.concat(iconName, '" and prefix "').concat(prefix, '" is missing.'));
  }
}
function findIcon(iconName, prefix) {
  var givenPrefix = prefix;
  if (prefix === "fa" && config.styleDefault !== null) {
    prefix = getDefaultUsablePrefix();
  }
  return new Promise(function(resolve2, reject) {
    ({
      found: false,
      width: 512,
      height: 512,
      icon: callProvided("missingIconAbstract") || {}
    });
    if (givenPrefix === "fa") {
      var shim = byOldName(iconName) || {};
      iconName = shim.iconName || iconName;
      prefix = shim.prefix || prefix;
    }
    if (iconName && prefix && styles$1$1[prefix] && styles$1$1[prefix][iconName]) {
      var icon3 = styles$1$1[prefix][iconName];
      return resolve2(asFoundIcon(icon3));
    }
    maybeNotifyMissing(iconName, prefix);
    resolve2(_objectSpread2$1(_objectSpread2$1({}, missingIconResolutionMixin), {}, {
      icon: config.showMissingIcons && iconName ? callProvided("missingIconAbstract") || {} : {}
    }));
  });
}
var noop$1 = function noop3() {
};
var p = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1,
  measure: noop$1
};
var preamble = 'FA "6.1.2"';
var begin = function begin2(name) {
  p.mark("".concat(preamble, " ").concat(name, " begins"));
  return function() {
    return end(name);
  };
};
var end = function end2(name) {
  p.mark("".concat(preamble, " ").concat(name, " ends"));
  p.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
};
var perf = {
  begin,
  end
};
var noop$2 = function noop4() {
};
function isWatched(node) {
  var i2svg2 = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
  return typeof i2svg2 === "string";
}
function hasPrefixAndIcon(node) {
  var prefix = node.getAttribute ? node.getAttribute(DATA_PREFIX) : null;
  var icon3 = node.getAttribute ? node.getAttribute(DATA_ICON) : null;
  return prefix && icon3;
}
function hasBeenReplaced(node) {
  return node && node.classList && node.classList.contains && node.classList.contains(config.replacementClass);
}
function getMutator() {
  if (config.autoReplaceSvg === true) {
    return mutators.replace;
  }
  var mutator = mutators[config.autoReplaceSvg];
  return mutator || mutators.replace;
}
function createElementNS(tag) {
  return DOCUMENT.createElementNS("http://www.w3.org/2000/svg", tag);
}
function createElement(tag) {
  return DOCUMENT.createElement(tag);
}
function convertSVG(abstractObj) {
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _params$ceFn = params.ceFn, ceFn = _params$ceFn === void 0 ? abstractObj.tag === "svg" ? createElementNS : createElement : _params$ceFn;
  if (typeof abstractObj === "string") {
    return DOCUMENT.createTextNode(abstractObj);
  }
  var tag = ceFn(abstractObj.tag);
  Object.keys(abstractObj.attributes || []).forEach(function(key) {
    tag.setAttribute(key, abstractObj.attributes[key]);
  });
  var children2 = abstractObj.children || [];
  children2.forEach(function(child) {
    tag.appendChild(convertSVG(child, {
      ceFn
    }));
  });
  return tag;
}
function nodeAsComment(node) {
  var comment = " ".concat(node.outerHTML, " ");
  comment = "".concat(comment, "Font Awesome fontawesome.com ");
  return comment;
}
var mutators = {
  replace: function replace2(mutation) {
    var node = mutation[0];
    if (node.parentNode) {
      mutation[1].forEach(function(abstract) {
        node.parentNode.insertBefore(convertSVG(abstract), node);
      });
      if (node.getAttribute(DATA_FA_I2SVG) === null && config.keepOriginalSource) {
        var comment = DOCUMENT.createComment(nodeAsComment(node));
        node.parentNode.replaceChild(comment, node);
      } else {
        node.remove();
      }
    }
  },
  nest: function nest(mutation) {
    var node = mutation[0];
    var abstract = mutation[1];
    if (~classArray(node).indexOf(config.replacementClass)) {
      return mutators.replace(mutation);
    }
    var forSvg = new RegExp("".concat(config.familyPrefix, "-.*"));
    delete abstract[0].attributes.id;
    if (abstract[0].attributes.class) {
      var splitClasses = abstract[0].attributes.class.split(" ").reduce(function(acc, cls) {
        if (cls === config.replacementClass || cls.match(forSvg)) {
          acc.toSvg.push(cls);
        } else {
          acc.toNode.push(cls);
        }
        return acc;
      }, {
        toNode: [],
        toSvg: []
      });
      abstract[0].attributes.class = splitClasses.toSvg.join(" ");
      if (splitClasses.toNode.length === 0) {
        node.removeAttribute("class");
      } else {
        node.setAttribute("class", splitClasses.toNode.join(" "));
      }
    }
    var newInnerHTML = abstract.map(function(a) {
      return toHtml(a);
    }).join("\n");
    node.setAttribute(DATA_FA_I2SVG, "");
    node.innerHTML = newInnerHTML;
  }
};
function performOperationSync(op) {
  op();
}
function perform(mutations, callback) {
  var callbackFunction = typeof callback === "function" ? callback : noop$2;
  if (mutations.length === 0) {
    callbackFunction();
  } else {
    var frame = performOperationSync;
    if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
      frame = WINDOW.requestAnimationFrame || performOperationSync;
    }
    frame(function() {
      var mutator = getMutator();
      var mark = perf.begin("mutate");
      mutations.map(mutator);
      mark();
      callbackFunction();
    });
  }
}
var disabled = false;
function disableObservation() {
  disabled = true;
}
function enableObservation() {
  disabled = false;
}
var mo = null;
function observe(options) {
  if (!MUTATION_OBSERVER) {
    return;
  }
  if (!config.observeMutations) {
    return;
  }
  var _options$treeCallback = options.treeCallback, treeCallback = _options$treeCallback === void 0 ? noop$2 : _options$treeCallback, _options$nodeCallback = options.nodeCallback, nodeCallback = _options$nodeCallback === void 0 ? noop$2 : _options$nodeCallback, _options$pseudoElemen = options.pseudoElementsCallback, pseudoElementsCallback = _options$pseudoElemen === void 0 ? noop$2 : _options$pseudoElemen, _options$observeMutat = options.observeMutationsRoot, observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat;
  mo = new MUTATION_OBSERVER(function(objects) {
    if (disabled)
      return;
    var defaultPrefix = getDefaultUsablePrefix();
    toArray(objects).forEach(function(mutationRecord) {
      if (mutationRecord.type === "childList" && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
        if (config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target);
        }
        treeCallback(mutationRecord.target);
      }
      if (mutationRecord.type === "attributes" && mutationRecord.target.parentNode && config.searchPseudoElements) {
        pseudoElementsCallback(mutationRecord.target.parentNode);
      }
      if (mutationRecord.type === "attributes" && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
        if (mutationRecord.attributeName === "class" && hasPrefixAndIcon(mutationRecord.target)) {
          var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)), prefix = _getCanonicalIcon.prefix, iconName = _getCanonicalIcon.iconName;
          mutationRecord.target.setAttribute(DATA_PREFIX, prefix || defaultPrefix);
          if (iconName)
            mutationRecord.target.setAttribute(DATA_ICON, iconName);
        } else if (hasBeenReplaced(mutationRecord.target)) {
          nodeCallback(mutationRecord.target);
        }
      }
    });
  });
  if (!IS_DOM)
    return;
  mo.observe(observeMutationsRoot, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
  });
}
function disconnect() {
  if (!mo)
    return;
  mo.disconnect();
}
function styleParser(node) {
  var style = node.getAttribute("style");
  var val = [];
  if (style) {
    val = style.split(";").reduce(function(acc, style2) {
      var styles2 = style2.split(":");
      var prop = styles2[0];
      var value = styles2.slice(1);
      if (prop && value.length > 0) {
        acc[prop] = value.join(":").trim();
      }
      return acc;
    }, {});
  }
  return val;
}
function classParser(node) {
  var existingPrefix = node.getAttribute("data-prefix");
  var existingIconName = node.getAttribute("data-icon");
  var innerText = node.innerText !== void 0 ? node.innerText.trim() : "";
  var val = getCanonicalIcon(classArray(node));
  if (!val.prefix) {
    val.prefix = getDefaultUsablePrefix();
  }
  if (existingPrefix && existingIconName) {
    val.prefix = existingPrefix;
    val.iconName = existingIconName;
  }
  if (val.iconName && val.prefix) {
    return val;
  }
  if (val.prefix && innerText.length > 0) {
    val.iconName = byLigature(val.prefix, node.innerText) || byUnicode(val.prefix, toHex(node.innerText));
  }
  if (!val.iconName && config.autoFetchSvg && node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
    val.iconName = node.firstChild.data;
  }
  return val;
}
function attributesParser(node) {
  var extraAttributes = toArray(node.attributes).reduce(function(acc, attr) {
    if (acc.name !== "class" && acc.name !== "style") {
      acc[attr.name] = attr.value;
    }
    return acc;
  }, {});
  var title = node.getAttribute("title");
  var titleId = node.getAttribute("data-fa-title-id");
  if (config.autoA11y) {
    if (title) {
      extraAttributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
    } else {
      extraAttributes["aria-hidden"] = "true";
      extraAttributes["focusable"] = "false";
    }
  }
  return extraAttributes;
}
function blankMeta() {
  return {
    iconName: null,
    title: null,
    titleId: null,
    prefix: null,
    transform: meaninglessTransform,
    symbol: false,
    mask: {
      iconName: null,
      prefix: null,
      rest: []
    },
    maskId: null,
    extra: {
      classes: [],
      styles: {},
      attributes: {}
    }
  };
}
function parseMeta(node) {
  var parser = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    styleParser: true
  };
  var _classParser = classParser(node), iconName = _classParser.iconName, prefix = _classParser.prefix, extraClasses = _classParser.rest;
  var extraAttributes = attributesParser(node);
  var pluginMeta = chainHooks("parseNodeAttributes", {}, node);
  var extraStyles = parser.styleParser ? styleParser(node) : [];
  return _objectSpread2$1({
    iconName,
    title: node.getAttribute("title"),
    titleId: node.getAttribute("data-fa-title-id"),
    prefix,
    transform: meaninglessTransform,
    mask: {
      iconName: null,
      prefix: null,
      rest: []
    },
    maskId: null,
    symbol: false,
    extra: {
      classes: extraClasses,
      styles: extraStyles,
      attributes: extraAttributes
    }
  }, pluginMeta);
}
var styles$2 = namespace.styles;
function generateMutation(node) {
  var nodeMeta = config.autoReplaceSvg === "nest" ? parseMeta(node, {
    styleParser: false
  }) : parseMeta(node);
  if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
    return callProvided("generateLayersText", node, nodeMeta);
  } else {
    return callProvided("generateSvgReplacementMutation", node, nodeMeta);
  }
}
function onTree(root) {
  var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  if (!IS_DOM)
    return Promise.resolve();
  var htmlClassList = DOCUMENT.documentElement.classList;
  var hclAdd = function hclAdd2(suffix) {
    return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  };
  var hclRemove = function hclRemove2(suffix) {
    return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  };
  var prefixes2 = config.autoFetchSvg ? Object.keys(PREFIX_TO_STYLE) : Object.keys(styles$2);
  if (!prefixes2.includes("fa")) {
    prefixes2.push("fa");
  }
  var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes2.map(function(p2) {
    return ".".concat(p2, ":not([").concat(DATA_FA_I2SVG, "])");
  })).join(", ");
  if (prefixesDomQuery.length === 0) {
    return Promise.resolve();
  }
  var candidates = [];
  try {
    candidates = toArray(root.querySelectorAll(prefixesDomQuery));
  } catch (e) {
  }
  if (candidates.length > 0) {
    hclAdd("pending");
    hclRemove("complete");
  } else {
    return Promise.resolve();
  }
  var mark = perf.begin("onTree");
  var mutations = candidates.reduce(function(acc, node) {
    try {
      var mutation = generateMutation(node);
      if (mutation) {
        acc.push(mutation);
      }
    } catch (e) {
      if (!PRODUCTION$1) {
        if (e.name === "MissingIcon") {
          console.error(e);
        }
      }
    }
    return acc;
  }, []);
  return new Promise(function(resolve2, reject) {
    Promise.all(mutations).then(function(resolvedMutations) {
      perform(resolvedMutations, function() {
        hclAdd("active");
        hclAdd("complete");
        hclRemove("pending");
        if (typeof callback === "function")
          callback();
        mark();
        resolve2();
      });
    }).catch(function(e) {
      mark();
      reject(e);
    });
  });
}
function onNode(node) {
  var callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
  generateMutation(node).then(function(mutation) {
    if (mutation) {
      perform([mutation], callback);
    }
  });
}
function resolveIcons(next) {
  return function(maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    var mask = params.mask;
    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }
    return next(iconDefinition, _objectSpread2$1(_objectSpread2$1({}, params), {}, {
      mask
    }));
  };
}
var render = function render2(iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$symbol = params.symbol, symbol = _params$symbol === void 0 ? false : _params$symbol, _params$mask = params.mask, mask = _params$mask === void 0 ? null : _params$mask, _params$maskId = params.maskId, maskId = _params$maskId === void 0 ? null : _params$maskId, _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$titleId = params.titleId, titleId = _params$titleId === void 0 ? null : _params$titleId, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
  if (!iconDefinition)
    return;
  var prefix = iconDefinition.prefix, iconName = iconDefinition.iconName, icon3 = iconDefinition.icon;
  return domVariants(_objectSpread2$1({
    type: "icon"
  }, iconDefinition), function() {
    callHooks("beforeDOMElementCreation", {
      iconDefinition,
      params
    });
    if (config.autoA11y) {
      if (title) {
        attributes["aria-labelledby"] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes["aria-hidden"] = "true";
        attributes["focusable"] = "false";
      }
    }
    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon3),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix,
      iconName,
      transform: _objectSpread2$1(_objectSpread2$1({}, meaninglessTransform), transform),
      symbol,
      title,
      maskId,
      titleId,
      extra: {
        attributes,
        styles: styles2,
        classes
      }
    });
  });
};
var ReplaceElements = {
  mixout: function mixout2() {
    return {
      icon: resolveIcons(render)
    };
  },
  hooks: function hooks2() {
    return {
      mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
        accumulator.treeCallback = onTree;
        accumulator.nodeCallback = onNode;
        return accumulator;
      }
    };
  },
  provides: function provides(providers$$1) {
    providers$$1.i2svg = function(params) {
      var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node, _params$callback = params.callback, callback = _params$callback === void 0 ? function() {
      } : _params$callback;
      return onTree(node, callback);
    };
    providers$$1.generateSvgReplacementMutation = function(node, nodeMeta) {
      var iconName = nodeMeta.iconName, title = nodeMeta.title, titleId = nodeMeta.titleId, prefix = nodeMeta.prefix, transform = nodeMeta.transform, symbol = nodeMeta.symbol, mask = nodeMeta.mask, maskId = nodeMeta.maskId, extra = nodeMeta.extra;
      return new Promise(function(resolve2, reject) {
        Promise.all([findIcon(iconName, prefix), mask.iconName ? findIcon(mask.iconName, mask.prefix) : Promise.resolve({
          found: false,
          width: 512,
          height: 512,
          icon: {}
        })]).then(function(_ref2) {
          var _ref22 = _slicedToArray(_ref2, 2), main = _ref22[0], mask2 = _ref22[1];
          resolve2([node, makeInlineSvgAbstract({
            icons: {
              main,
              mask: mask2
            },
            prefix,
            iconName,
            transform,
            symbol,
            maskId,
            title,
            titleId,
            extra,
            watchable: true
          })]);
        }).catch(reject);
      });
    };
    providers$$1.generateAbstractIcon = function(_ref3) {
      var children2 = _ref3.children, attributes = _ref3.attributes, main = _ref3.main, transform = _ref3.transform, styles2 = _ref3.styles;
      var styleString = joinStyles(styles2);
      if (styleString.length > 0) {
        attributes["style"] = styleString;
      }
      var nextChild;
      if (transformIsMeaningful(transform)) {
        nextChild = callProvided("generateAbstractTransformGrouping", {
          main,
          transform,
          containerWidth: main.width,
          iconWidth: main.width
        });
      }
      children2.push(nextChild || main.icon);
      return {
        children: children2,
        attributes
      };
    };
  }
};
var Layers = {
  mixout: function mixout3() {
    return {
      layer: function layer(assembler) {
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes;
        return domVariants({
          type: "layer"
        }, function() {
          callHooks("beforeDOMElementCreation", {
            assembler,
            params
          });
          var children2 = [];
          assembler(function(args) {
            Array.isArray(args) ? args.map(function(a) {
              children2 = children2.concat(a.abstract);
            }) : children2 = children2.concat(args.abstract);
          });
          return [{
            tag: "span",
            attributes: {
              class: ["".concat(config.familyPrefix, "-layers")].concat(_toConsumableArray$1(classes)).join(" ")
            },
            children: children2
          }];
        });
      }
    };
  }
};
var LayersCounter = {
  mixout: function mixout4() {
    return {
      counter: function counter(content) {
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
        return domVariants({
          type: "counter",
          content
        }, function() {
          callHooks("beforeDOMElementCreation", {
            content,
            params
          });
          return makeLayersCounterAbstract({
            content: content.toString(),
            title,
            extra: {
              attributes,
              styles: styles2,
              classes: ["".concat(config.familyPrefix, "-layers-counter")].concat(_toConsumableArray$1(classes))
            }
          });
        });
      }
    };
  }
};
var LayersText = {
  mixout: function mixout5() {
    return {
      text: function text2(content) {
        var params = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _params$transform = params.transform, transform = _params$transform === void 0 ? meaninglessTransform : _params$transform, _params$title = params.title, title = _params$title === void 0 ? null : _params$title, _params$classes = params.classes, classes = _params$classes === void 0 ? [] : _params$classes, _params$attributes = params.attributes, attributes = _params$attributes === void 0 ? {} : _params$attributes, _params$styles = params.styles, styles2 = _params$styles === void 0 ? {} : _params$styles;
        return domVariants({
          type: "text",
          content
        }, function() {
          callHooks("beforeDOMElementCreation", {
            content,
            params
          });
          return makeLayersTextAbstract({
            content,
            transform: _objectSpread2$1(_objectSpread2$1({}, meaninglessTransform), transform),
            title,
            extra: {
              attributes,
              styles: styles2,
              classes: ["".concat(config.familyPrefix, "-layers-text")].concat(_toConsumableArray$1(classes))
            }
          });
        });
      }
    };
  },
  provides: function provides2(providers$$1) {
    providers$$1.generateLayersText = function(node, nodeMeta) {
      var title = nodeMeta.title, transform = nodeMeta.transform, extra = nodeMeta.extra;
      var width = null;
      var height = null;
      if (IS_IE) {
        var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
        var boundingClientRect = node.getBoundingClientRect();
        width = boundingClientRect.width / computedFontSize;
        height = boundingClientRect.height / computedFontSize;
      }
      if (config.autoA11y && !title) {
        extra.attributes["aria-hidden"] = "true";
      }
      return Promise.resolve([node, makeLayersTextAbstract({
        content: node.innerHTML,
        width,
        height,
        transform,
        title,
        extra,
        watchable: true
      })]);
    };
  }
};
var CLEAN_CONTENT_PATTERN = new RegExp('"', "ug");
var SECONDARY_UNICODE_RANGE = [1105920, 1112319];
function hexValueFromContent(content) {
  var cleaned = content.replace(CLEAN_CONTENT_PATTERN, "");
  var codePoint = codePointAt(cleaned, 0);
  var isPrependTen = codePoint >= SECONDARY_UNICODE_RANGE[0] && codePoint <= SECONDARY_UNICODE_RANGE[1];
  var isDoubled = cleaned.length === 2 ? cleaned[0] === cleaned[1] : false;
  return {
    value: isDoubled ? toHex(cleaned[0]) : toHex(cleaned),
    isSecondary: isPrependTen || isDoubled
  };
}
function replaceForPosition(node, position) {
  var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(":", "-"));
  return new Promise(function(resolve2, reject) {
    if (node.getAttribute(pendingAttribute) !== null) {
      return resolve2();
    }
    var children2 = toArray(node.children);
    var alreadyProcessedPseudoElement = children2.filter(function(c) {
      return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
    })[0];
    var styles2 = WINDOW.getComputedStyle(node, position);
    var fontFamily = styles2.getPropertyValue("font-family").match(FONT_FAMILY_PATTERN);
    var fontWeight = styles2.getPropertyValue("font-weight");
    var content = styles2.getPropertyValue("content");
    if (alreadyProcessedPseudoElement && !fontFamily) {
      node.removeChild(alreadyProcessedPseudoElement);
      return resolve2();
    } else if (fontFamily && content !== "none" && content !== "") {
      var _content = styles2.getPropertyValue("content");
      var prefix = ~["Solid", "Regular", "Light", "Thin", "Duotone", "Brands", "Kit"].indexOf(fontFamily[2]) ? STYLE_TO_PREFIX[fontFamily[2].toLowerCase()] : FONT_WEIGHT_TO_PREFIX[fontWeight];
      var _hexValueFromContent = hexValueFromContent(_content), hexValue = _hexValueFromContent.value, isSecondary = _hexValueFromContent.isSecondary;
      var isV4 = fontFamily[0].startsWith("FontAwesome");
      var iconName = byUnicode(prefix, hexValue);
      var iconIdentifier = iconName;
      if (isV4) {
        var iconName4 = byOldUnicode(hexValue);
        if (iconName4.iconName && iconName4.prefix) {
          iconName = iconName4.iconName;
          prefix = iconName4.prefix;
        }
      }
      if (iconName && !isSecondary && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
        node.setAttribute(pendingAttribute, iconIdentifier);
        if (alreadyProcessedPseudoElement) {
          node.removeChild(alreadyProcessedPseudoElement);
        }
        var meta = blankMeta();
        var extra = meta.extra;
        extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
        findIcon(iconName, prefix).then(function(main) {
          var abstract = makeInlineSvgAbstract(_objectSpread2$1(_objectSpread2$1({}, meta), {}, {
            icons: {
              main,
              mask: emptyCanonicalIcon()
            },
            prefix,
            iconName: iconIdentifier,
            extra,
            watchable: true
          }));
          var element = DOCUMENT.createElement("svg");
          if (position === "::before") {
            node.insertBefore(element, node.firstChild);
          } else {
            node.appendChild(element);
          }
          element.outerHTML = abstract.map(function(a) {
            return toHtml(a);
          }).join("\n");
          node.removeAttribute(pendingAttribute);
          resolve2();
        }).catch(reject);
      } else {
        resolve2();
      }
    } else {
      resolve2();
    }
  });
}
function replace(node) {
  return Promise.all([replaceForPosition(node, "::before"), replaceForPosition(node, "::after")]);
}
function processable(node) {
  return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== "svg");
}
function searchPseudoElements(root) {
  if (!IS_DOM)
    return;
  return new Promise(function(resolve2, reject) {
    var operations = toArray(root.querySelectorAll("*")).filter(processable).map(replace);
    var end3 = perf.begin("searchPseudoElements");
    disableObservation();
    Promise.all(operations).then(function() {
      end3();
      enableObservation();
      resolve2();
    }).catch(function() {
      end3();
      enableObservation();
      reject();
    });
  });
}
var PseudoElements = {
  hooks: function hooks3() {
    return {
      mutationObserverCallbacks: function mutationObserverCallbacks(accumulator) {
        accumulator.pseudoElementsCallback = searchPseudoElements;
        return accumulator;
      }
    };
  },
  provides: function provides3(providers$$1) {
    providers$$1.pseudoElements2svg = function(params) {
      var _params$node = params.node, node = _params$node === void 0 ? DOCUMENT : _params$node;
      if (config.searchPseudoElements) {
        searchPseudoElements(node);
      }
    };
  }
};
var _unwatched = false;
var MutationObserver$1 = {
  mixout: function mixout6() {
    return {
      dom: {
        unwatch: function unwatch() {
          disableObservation();
          _unwatched = true;
        }
      }
    };
  },
  hooks: function hooks4() {
    return {
      bootstrap: function bootstrap() {
        observe(chainHooks("mutationObserverCallbacks", {}));
      },
      noAuto: function noAuto3() {
        disconnect();
      },
      watch: function watch3(params) {
        var observeMutationsRoot = params.observeMutationsRoot;
        if (_unwatched) {
          enableObservation();
        } else {
          observe(chainHooks("mutationObserverCallbacks", {
            observeMutationsRoot
          }));
        }
      }
    };
  }
};
var parseTransformString = function parseTransformString2(transformString) {
  var transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };
  return transformString.toLowerCase().split(" ").reduce(function(acc, n) {
    var parts = n.toLowerCase().split("-");
    var first = parts[0];
    var rest = parts.slice(1).join("-");
    if (first && rest === "h") {
      acc.flipX = true;
      return acc;
    }
    if (first && rest === "v") {
      acc.flipY = true;
      return acc;
    }
    rest = parseFloat(rest);
    if (isNaN(rest)) {
      return acc;
    }
    switch (first) {
      case "grow":
        acc.size = acc.size + rest;
        break;
      case "shrink":
        acc.size = acc.size - rest;
        break;
      case "left":
        acc.x = acc.x - rest;
        break;
      case "right":
        acc.x = acc.x + rest;
        break;
      case "up":
        acc.y = acc.y - rest;
        break;
      case "down":
        acc.y = acc.y + rest;
        break;
      case "rotate":
        acc.rotate = acc.rotate + rest;
        break;
    }
    return acc;
  }, transform);
};
var PowerTransforms = {
  mixout: function mixout7() {
    return {
      parse: {
        transform: function transform(transformString) {
          return parseTransformString(transformString);
        }
      }
    };
  },
  hooks: function hooks5() {
    return {
      parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
        var transformString = node.getAttribute("data-fa-transform");
        if (transformString) {
          accumulator.transform = parseTransformString(transformString);
        }
        return accumulator;
      }
    };
  },
  provides: function provides4(providers2) {
    providers2.generateAbstractTransformGrouping = function(_ref2) {
      var main = _ref2.main, transform = _ref2.transform, containerWidth = _ref2.containerWidth, iconWidth = _ref2.iconWidth;
      var outer = {
        transform: "translate(".concat(containerWidth / 2, " 256)")
      };
      var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
      var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
      var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
      var inner = {
        transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
      };
      var path2 = {
        transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
      };
      var operations = {
        outer,
        inner,
        path: path2
      };
      return {
        tag: "g",
        attributes: _objectSpread2$1({}, operations.outer),
        children: [{
          tag: "g",
          attributes: _objectSpread2$1({}, operations.inner),
          children: [{
            tag: main.icon.tag,
            children: main.icon.children,
            attributes: _objectSpread2$1(_objectSpread2$1({}, main.icon.attributes), operations.path)
          }]
        }]
      };
    };
  }
};
var ALL_SPACE = {
  x: 0,
  y: 0,
  width: "100%",
  height: "100%"
};
function fillBlack(abstract) {
  var force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  if (abstract.attributes && (abstract.attributes.fill || force)) {
    abstract.attributes.fill = "black";
  }
  return abstract;
}
function deGroup(abstract) {
  if (abstract.tag === "g") {
    return abstract.children;
  } else {
    return [abstract];
  }
}
var Masks = {
  hooks: function hooks6() {
    return {
      parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
        var maskData = node.getAttribute("data-fa-mask");
        var mask = !maskData ? emptyCanonicalIcon() : getCanonicalIcon(maskData.split(" ").map(function(i) {
          return i.trim();
        }));
        if (!mask.prefix) {
          mask.prefix = getDefaultUsablePrefix();
        }
        accumulator.mask = mask;
        accumulator.maskId = node.getAttribute("data-fa-mask-id");
        return accumulator;
      }
    };
  },
  provides: function provides5(providers2) {
    providers2.generateAbstractMask = function(_ref2) {
      var children2 = _ref2.children, attributes = _ref2.attributes, main = _ref2.main, mask = _ref2.mask, explicitMaskId = _ref2.maskId, transform = _ref2.transform;
      var mainWidth = main.width, mainPath = main.icon;
      var maskWidth = mask.width, maskPath = mask.icon;
      var trans = transformForSvg({
        transform,
        containerWidth: maskWidth,
        iconWidth: mainWidth
      });
      var maskRect = {
        tag: "rect",
        attributes: _objectSpread2$1(_objectSpread2$1({}, ALL_SPACE), {}, {
          fill: "white"
        })
      };
      var maskInnerGroupChildrenMixin = mainPath.children ? {
        children: mainPath.children.map(fillBlack)
      } : {};
      var maskInnerGroup = {
        tag: "g",
        attributes: _objectSpread2$1({}, trans.inner),
        children: [fillBlack(_objectSpread2$1({
          tag: mainPath.tag,
          attributes: _objectSpread2$1(_objectSpread2$1({}, mainPath.attributes), trans.path)
        }, maskInnerGroupChildrenMixin))]
      };
      var maskOuterGroup = {
        tag: "g",
        attributes: _objectSpread2$1({}, trans.outer),
        children: [maskInnerGroup]
      };
      var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
      var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
      var maskTag = {
        tag: "mask",
        attributes: _objectSpread2$1(_objectSpread2$1({}, ALL_SPACE), {}, {
          id: maskId,
          maskUnits: "userSpaceOnUse",
          maskContentUnits: "userSpaceOnUse"
        }),
        children: [maskRect, maskOuterGroup]
      };
      var defs = {
        tag: "defs",
        children: [{
          tag: "clipPath",
          attributes: {
            id: clipId
          },
          children: deGroup(maskPath)
        }, maskTag]
      };
      children2.push(defs, {
        tag: "rect",
        attributes: _objectSpread2$1({
          fill: "currentColor",
          "clip-path": "url(#".concat(clipId, ")"),
          mask: "url(#".concat(maskId, ")")
        }, ALL_SPACE)
      });
      return {
        children: children2,
        attributes
      };
    };
  }
};
var MissingIconIndicator = {
  provides: function provides6(providers2) {
    var reduceMotion = false;
    if (WINDOW.matchMedia) {
      reduceMotion = WINDOW.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    providers2.missingIconAbstract = function() {
      var gChildren = [];
      var FILL = {
        fill: "currentColor"
      };
      var ANIMATION_BASE = {
        attributeType: "XML",
        repeatCount: "indefinite",
        dur: "2s"
      };
      gChildren.push({
        tag: "path",
        attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
          d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
        })
      });
      var OPACITY_ANIMATE = _objectSpread2$1(_objectSpread2$1({}, ANIMATION_BASE), {}, {
        attributeName: "opacity"
      });
      var dot = {
        tag: "circle",
        attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
          cx: "256",
          cy: "364",
          r: "28"
        }),
        children: []
      };
      if (!reduceMotion) {
        dot.children.push({
          tag: "animate",
          attributes: _objectSpread2$1(_objectSpread2$1({}, ANIMATION_BASE), {}, {
            attributeName: "r",
            values: "28;14;28;28;14;28;"
          })
        }, {
          tag: "animate",
          attributes: _objectSpread2$1(_objectSpread2$1({}, OPACITY_ANIMATE), {}, {
            values: "1;0;1;1;0;1;"
          })
        });
      }
      gChildren.push(dot);
      gChildren.push({
        tag: "path",
        attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
          opacity: "1",
          d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
        }),
        children: reduceMotion ? [] : [{
          tag: "animate",
          attributes: _objectSpread2$1(_objectSpread2$1({}, OPACITY_ANIMATE), {}, {
            values: "1;0;0;0;0;1;"
          })
        }]
      });
      if (!reduceMotion) {
        gChildren.push({
          tag: "path",
          attributes: _objectSpread2$1(_objectSpread2$1({}, FILL), {}, {
            opacity: "0",
            d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
          }),
          children: [{
            tag: "animate",
            attributes: _objectSpread2$1(_objectSpread2$1({}, OPACITY_ANIMATE), {}, {
              values: "0;0;1;1;0;0;"
            })
          }]
        });
      }
      return {
        tag: "g",
        attributes: {
          "class": "missing"
        },
        children: gChildren
      };
    };
  }
};
var SvgSymbols = {
  hooks: function hooks7() {
    return {
      parseNodeAttributes: function parseNodeAttributes(accumulator, node) {
        var symbolData = node.getAttribute("data-fa-symbol");
        var symbol = symbolData === null ? false : symbolData === "" ? true : symbolData;
        accumulator["symbol"] = symbol;
        return accumulator;
      }
    };
  }
};
var plugins = [InjectCSS, ReplaceElements, Layers, LayersCounter, LayersText, PseudoElements, MutationObserver$1, PowerTransforms, Masks, MissingIconIndicator, SvgSymbols];
registerPlugins(plugins, {
  mixoutsTo: api
});
api.noAuto;
var config$1 = api.config;
var library$1 = api.library;
api.dom;
var parse$1 = api.parse;
api.findIconDefinition;
api.toHtml;
var icon = api.icon;
api.layer;
var text = api.text;
api.counter;
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), true).forEach(function(key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
    return typeof obj2;
  } : function(obj2) {
    return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
  }, _typeof(obj);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null)
    return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key))
        continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr))
    return _arrayLikeToArray(arr);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
    return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var humps$1 = { exports: {} };
(function(module) {
  (function(global2) {
    var _processKeys = function(convert2, obj, options) {
      if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
        return obj;
      }
      var output, i = 0, l = 0;
      if (_isArray(obj)) {
        output = [];
        for (l = obj.length; i < l; i++) {
          output.push(_processKeys(convert2, obj[i], options));
        }
      } else {
        output = {};
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            output[convert2(key, options)] = _processKeys(convert2, obj[key], options);
          }
        }
      }
      return output;
    };
    var separateWords = function(string, options) {
      options = options || {};
      var separator = options.separator || "_";
      var split = options.split || /(?=[A-Z])/;
      return string.split(split).join(separator);
    };
    var camelize2 = function(string) {
      if (_isNumerical(string)) {
        return string;
      }
      string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : "";
      });
      return string.substr(0, 1).toLowerCase() + string.substr(1);
    };
    var pascalize = function(string) {
      var camelized = camelize2(string);
      return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
    };
    var decamelize = function(string, options) {
      return separateWords(string, options).toLowerCase();
    };
    var toString = Object.prototype.toString;
    var _isFunction = function(obj) {
      return typeof obj === "function";
    };
    var _isObject = function(obj) {
      return obj === Object(obj);
    };
    var _isArray = function(obj) {
      return toString.call(obj) == "[object Array]";
    };
    var _isDate = function(obj) {
      return toString.call(obj) == "[object Date]";
    };
    var _isRegExp = function(obj) {
      return toString.call(obj) == "[object RegExp]";
    };
    var _isBoolean = function(obj) {
      return toString.call(obj) == "[object Boolean]";
    };
    var _isNumerical = function(obj) {
      obj = obj - 0;
      return obj === obj;
    };
    var _processor = function(convert2, options) {
      var callback = options && "process" in options ? options.process : options;
      if (typeof callback !== "function") {
        return convert2;
      }
      return function(string, options2) {
        return callback(string, convert2, options2);
      };
    };
    var humps2 = {
      camelize: camelize2,
      decamelize,
      pascalize,
      depascalize: decamelize,
      camelizeKeys: function(object, options) {
        return _processKeys(_processor(camelize2, options), object);
      },
      decamelizeKeys: function(object, options) {
        return _processKeys(_processor(decamelize, options), object, options);
      },
      pascalizeKeys: function(object, options) {
        return _processKeys(_processor(pascalize, options), object);
      },
      depascalizeKeys: function() {
        return this.decamelizeKeys.apply(this, arguments);
      }
    };
    if (module.exports) {
      module.exports = humps2;
    } else {
      global2.humps = humps2;
    }
  })(commonjsGlobal);
})(humps$1);
var humps = humps$1.exports;
var _excluded = ["class", "style"];
function styleToObject(style) {
  return style.split(";").map(function(s) {
    return s.trim();
  }).filter(function(s) {
    return s;
  }).reduce(function(output, pair) {
    var idx = pair.indexOf(":");
    var prop = humps.camelize(pair.slice(0, idx));
    var value = pair.slice(idx + 1).trim();
    output[prop] = value;
    return output;
  }, {});
}
function classToObject(classes) {
  return classes.split(/\s+/).reduce(function(output, className) {
    output[className] = true;
    return output;
  }, {});
}
function convert(abstractElement) {
  var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var attrs2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  if (typeof abstractElement === "string") {
    return abstractElement;
  }
  var children2 = (abstractElement.children || []).map(function(child) {
    return convert(child);
  });
  var mixins = Object.keys(abstractElement.attributes || {}).reduce(function(mixins2, key) {
    var value = abstractElement.attributes[key];
    switch (key) {
      case "class":
        mixins2.class = classToObject(value);
        break;
      case "style":
        mixins2.style = styleToObject(value);
        break;
      default:
        mixins2.attrs[key] = value;
    }
    return mixins2;
  }, {
    attrs: {},
    class: {},
    style: {}
  });
  attrs2.class;
  var _attrs$style = attrs2.style, aStyle = _attrs$style === void 0 ? {} : _attrs$style, otherAttrs = _objectWithoutProperties(attrs2, _excluded);
  return h$1(abstractElement.tag, _objectSpread2(_objectSpread2(_objectSpread2({}, props), {}, {
    class: mixins.class,
    style: _objectSpread2(_objectSpread2({}, mixins.style), aStyle)
  }, mixins.attrs), otherAttrs), children2);
}
var PRODUCTION = false;
try {
  PRODUCTION = true;
} catch (e) {
}
function log() {
  if (!PRODUCTION && console && typeof console.error === "function") {
    var _console;
    (_console = console).error.apply(_console, arguments);
  }
}
function objectWithKey(key, value) {
  return Array.isArray(value) && value.length > 0 || !Array.isArray(value) && value ? _defineProperty({}, key, value) : {};
}
function classList(props) {
  var _classes;
  var classes = (_classes = {
    "fa-spin": props.spin,
    "fa-pulse": props.pulse,
    "fa-fw": props.fixedWidth,
    "fa-border": props.border,
    "fa-li": props.listItem,
    "fa-inverse": props.inverse,
    "fa-flip": props.flip === true,
    "fa-flip-horizontal": props.flip === "horizontal" || props.flip === "both",
    "fa-flip-vertical": props.flip === "vertical" || props.flip === "both"
  }, _defineProperty(_classes, "fa-".concat(props.size), props.size !== null), _defineProperty(_classes, "fa-rotate-".concat(props.rotation), props.rotation !== null), _defineProperty(_classes, "fa-pull-".concat(props.pull), props.pull !== null), _defineProperty(_classes, "fa-swap-opacity", props.swapOpacity), _defineProperty(_classes, "fa-bounce", props.bounce), _defineProperty(_classes, "fa-shake", props.shake), _defineProperty(_classes, "fa-beat", props.beat), _defineProperty(_classes, "fa-fade", props.fade), _defineProperty(_classes, "fa-beat-fade", props.beatFade), _defineProperty(_classes, "fa-flash", props.flash), _defineProperty(_classes, "fa-spin-pulse", props.spinPulse), _defineProperty(_classes, "fa-spin-reverse", props.spinReverse), _classes);
  return Object.keys(classes).map(function(key) {
    return classes[key] ? key : null;
  }).filter(function(key) {
    return key;
  });
}
function normalizeIconArgs(icon3) {
  if (icon3 && _typeof(icon3) === "object" && icon3.prefix && icon3.iconName && icon3.icon) {
    return icon3;
  }
  if (parse$1.icon) {
    return parse$1.icon(icon3);
  }
  if (icon3 === null) {
    return null;
  }
  if (_typeof(icon3) === "object" && icon3.prefix && icon3.iconName) {
    return icon3;
  }
  if (Array.isArray(icon3) && icon3.length === 2) {
    return {
      prefix: icon3[0],
      iconName: icon3[1]
    };
  }
  if (typeof icon3 === "string") {
    return {
      prefix: "fas",
      iconName: icon3
    };
  }
}
var FontAwesomeIcon = defineComponent({
  name: "FontAwesomeIcon",
  props: {
    border: {
      type: Boolean,
      default: false
    },
    fixedWidth: {
      type: Boolean,
      default: false
    },
    flip: {
      type: [Boolean, String],
      default: false,
      validator: function validator(value) {
        return [true, false, "horizontal", "vertical", "both"].indexOf(value) > -1;
      }
    },
    icon: {
      type: [Object, Array, String],
      required: true
    },
    mask: {
      type: [Object, Array, String],
      default: null
    },
    listItem: {
      type: Boolean,
      default: false
    },
    pull: {
      type: String,
      default: null,
      validator: function validator2(value) {
        return ["right", "left"].indexOf(value) > -1;
      }
    },
    pulse: {
      type: Boolean,
      default: false
    },
    rotation: {
      type: [String, Number],
      default: null,
      validator: function validator3(value) {
        return [90, 180, 270].indexOf(Number.parseInt(value, 10)) > -1;
      }
    },
    swapOpacity: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: null,
      validator: function validator4(value) {
        return ["2xs", "xs", "sm", "lg", "xl", "2xl", "1x", "2x", "3x", "4x", "5x", "6x", "7x", "8x", "9x", "10x"].indexOf(value) > -1;
      }
    },
    spin: {
      type: Boolean,
      default: false
    },
    transform: {
      type: [String, Object],
      default: null
    },
    symbol: {
      type: [Boolean, String],
      default: false
    },
    title: {
      type: String,
      default: null
    },
    inverse: {
      type: Boolean,
      default: false
    },
    bounce: {
      type: Boolean,
      default: false
    },
    shake: {
      type: Boolean,
      default: false
    },
    beat: {
      type: Boolean,
      default: false
    },
    fade: {
      type: Boolean,
      default: false
    },
    beatFade: {
      type: Boolean,
      default: false
    },
    flash: {
      type: Boolean,
      default: false
    },
    spinPulse: {
      type: Boolean,
      default: false
    },
    spinReverse: {
      type: Boolean,
      default: false
    }
  },
  setup: function setup(props, _ref2) {
    var attrs2 = _ref2.attrs;
    var icon$1 = computed(function() {
      return normalizeIconArgs(props.icon);
    });
    var classes = computed(function() {
      return objectWithKey("classes", classList(props));
    });
    var transform = computed(function() {
      return objectWithKey("transform", typeof props.transform === "string" ? parse$1.transform(props.transform) : props.transform);
    });
    var mask = computed(function() {
      return objectWithKey("mask", normalizeIconArgs(props.mask));
    });
    var renderedIcon = computed(function() {
      return icon(icon$1.value, _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, classes.value), transform.value), mask.value), {}, {
        symbol: props.symbol,
        title: props.title
      }));
    });
    watch(renderedIcon, function(value) {
      if (!value) {
        return log("Could not find one or more icon(s)", icon$1.value, mask.value);
      }
    }, {
      immediate: true
    });
    var vnode = computed(function() {
      return renderedIcon.value ? convert(renderedIcon.value.abstract[0], {}, attrs2) : null;
    });
    return function() {
      return vnode.value;
    };
  }
});
defineComponent({
  name: "FontAwesomeLayers",
  props: {
    fixedWidth: {
      type: Boolean,
      default: false
    }
  },
  setup: function setup2(props, _ref2) {
    var slots = _ref2.slots;
    var familyPrefix = config$1.familyPrefix;
    var className = computed(function() {
      return ["".concat(familyPrefix, "-layers")].concat(_toConsumableArray(props.fixedWidth ? ["".concat(familyPrefix, "-fw")] : []));
    });
    return function() {
      return h$1("div", {
        class: className.value
      }, slots.default ? slots.default() : []);
    };
  }
});
defineComponent({
  name: "FontAwesomeLayersText",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    transform: {
      type: [String, Object],
      default: null
    },
    counter: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: null,
      validator: function validator5(value) {
        return ["bottom-left", "bottom-right", "top-left", "top-right"].indexOf(value) > -1;
      }
    }
  },
  setup: function setup3(props, _ref2) {
    var attrs2 = _ref2.attrs;
    var familyPrefix = config$1.familyPrefix;
    var classes = computed(function() {
      return objectWithKey("classes", [].concat(_toConsumableArray(props.counter ? ["".concat(familyPrefix, "-layers-counter")] : []), _toConsumableArray(props.position ? ["".concat(familyPrefix, "-layers-").concat(props.position)] : [])));
    });
    var transform = computed(function() {
      return objectWithKey("transform", typeof props.transform === "string" ? parse$1.transform(props.transform) : props.transform);
    });
    var abstractElement = computed(function() {
      var _text = text(props.value.toString(), _objectSpread2(_objectSpread2({}, transform.value), classes.value)), abstract = _text.abstract;
      if (props.counter) {
        abstract[0].attributes.class = abstract[0].attributes.class.replace("fa-layers-text", "");
      }
      return abstract[0];
    });
    var vnode = computed(function() {
      return convert(abstractElement.value, {}, attrs2);
    });
    return function() {
      return vnode.value;
    };
  }
});
/*!
 * Font Awesome Free 6.1.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2022 Fonticons, Inc.
 */
var faBitcoin = {
  prefix: "fab",
  iconName: "bitcoin",
  icon: [512, 512, [], "f379", "M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76 .194 1.744 .473 2.829 .907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464 .271 .395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"]
};
var faCcStripe = {
  prefix: "fab",
  iconName: "cc-stripe",
  icon: [576, 512, [], "f1f5", "M492.4 220.8c-8.9 0-18.7 6.7-18.7 22.7h36.7c0-16-9.3-22.7-18-22.7zM375 223.4c-8.2 0-13.3 2.9-17 7l.2 52.8c3.5 3.7 8.5 6.7 16.8 6.7 13.1 0 21.9-14.3 21.9-33.4 0-18.6-9-33.2-21.9-33.1zM528 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM122.2 281.1c0 25.6-20.3 40.1-49.9 40.3-12.2 0-25.6-2.4-38.8-8.1v-33.9c12 6.4 27.1 11.3 38.9 11.3 7.9 0 13.6-2.1 13.6-8.7 0-17-54-10.6-54-49.9 0-25.2 19.2-40.2 48-40.2 11.8 0 23.5 1.8 35.3 6.5v33.4c-10.8-5.8-24.5-9.1-35.3-9.1-7.5 0-12.1 2.2-12.1 7.7 0 16 54.3 8.4 54.3 50.7zm68.8-56.6h-27V275c0 20.9 22.5 14.4 27 12.6v28.9c-4.7 2.6-13.3 4.7-24.9 4.7-21.1 0-36.9-15.5-36.9-36.5l.2-113.9 34.7-7.4v30.8H191zm74 2.4c-4.5-1.5-18.7-3.6-27.1 7.4v84.4h-35.5V194.2h30.7l2.2 10.5c8.3-15.3 24.9-12.2 29.6-10.5h.1zm44.1 91.8h-35.7V194.2h35.7zm0-142.9l-35.7 7.6v-28.9l35.7-7.6zm74.1 145.5c-12.4 0-20-5.3-25.1-9l-.1 40.2-35.5 7.5V194.2h31.3l1.8 8.8c4.9-4.5 13.9-11.1 27.8-11.1 24.9 0 48.4 22.5 48.4 63.8 0 45.1-23.2 65.5-48.6 65.6zm160.4-51.5h-69.5c1.6 16.6 13.8 21.5 27.6 21.5 14.1 0 25.2-3 34.9-7.9V312c-9.7 5.3-22.4 9.2-39.4 9.2-34.6 0-58.8-21.7-58.8-64.5 0-36.2 20.5-64.9 54.3-64.9 33.7 0 51.3 28.7 51.3 65.1 0 3.5-.3 10.9-.4 12.9z"]
};
var faPaypal = {
  prefix: "fab",
  iconName: "paypal",
  icon: [384, 512, [], "f1ed", "M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"]
};
/*!
 * Font Awesome Free 6.1.2 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2022 Fonticons, Inc.
 */
var faBitcoinSign = {
  prefix: "fas",
  iconName: "bitcoin-sign",
  icon: [320, 512, [], "e0b4", "M48 32C48 14.33 62.33 0 80 0C97.67 0 112 14.33 112 32V64H144V32C144 14.33 158.3 0 176 0C193.7 0 208 14.33 208 32V64C208 65.54 207.9 67.06 207.7 68.54C254.1 82.21 288 125.1 288 176C288 200.2 280.3 222.6 267.3 240.9C298.9 260.7 320 295.9 320 336C320 397.9 269.9 448 208 448V480C208 497.7 193.7 512 176 512C158.3 512 144 497.7 144 480V448H112V480C112 497.7 97.67 512 80 512C62.33 512 48 497.7 48 480V448H41.74C18.69 448 0 429.3 0 406.3V101.6C0 80.82 16.82 64 37.57 64H48V32zM176 224C202.5 224 224 202.5 224 176C224 149.5 202.5 128 176 128H64V224H176zM64 288V384H208C234.5 384 256 362.5 256 336C256 309.5 234.5 288 208 288H64z"]
};
var faCreditCard = {
  prefix: "fas",
  iconName: "credit-card",
  icon: [576, 512, [62083, 128179, "credit-card-alt"], "f09d", "M512 32C547.3 32 576 60.65 576 96V128H0V96C0 60.65 28.65 32 64 32H512zM576 416C576 451.3 547.3 480 512 480H64C28.65 480 0 451.3 0 416V224H576V416zM112 352C103.2 352 96 359.2 96 368C96 376.8 103.2 384 112 384H176C184.8 384 192 376.8 192 368C192 359.2 184.8 352 176 352H112zM240 384H368C376.8 384 384 376.8 384 368C384 359.2 376.8 352 368 352H240C231.2 352 224 359.2 224 368C224 376.8 231.2 384 240 384z"]
};
var faMoneyBillWave = {
  prefix: "fas",
  iconName: "money-bill-wave",
  icon: [576, 512, [], "f53a", "M48.66 79.13C128.4 100.9 208.2 80.59 288 60.25C375 38.08 462 15.9 549 48.38C565.9 54.69 576 71.62 576 89.66V399.5C576 423.4 550.4 439.2 527.3 432.9C447.6 411.1 367.8 431.4 288 451.7C200.1 473.9 113.1 496.1 26.97 463.6C10.06 457.3 0 440.4 0 422.3V112.5C0 88.59 25.61 72.83 48.66 79.13L48.66 79.13zM287.1 352C332.2 352 368 309 368 255.1C368 202.1 332.2 159.1 287.1 159.1C243.8 159.1 207.1 202.1 207.1 255.1C207.1 309 243.8 352 287.1 352zM63.1 416H127.1C127.1 380.7 99.35 352 63.1 352V416zM63.1 143.1V207.1C99.35 207.1 127.1 179.3 127.1 143.1H63.1zM512 303.1C476.7 303.1 448 332.7 448 368H512V303.1zM448 95.1C448 131.3 476.7 159.1 512 159.1V95.1H448z"]
};
var faV = {
  prefix: "fas",
  iconName: "v",
  icon: [384, 512, [118], "56", "M381.5 76.33l-160 384C216.6 472.2 204.9 480 192 480s-24.56-7.757-29.53-19.68l-160-384c-6.797-16.31 .9062-35.05 17.22-41.84c16.38-6.859 35.08 .9219 41.84 17.22L192 364.8l130.5-313.1c6.766-16.3 25.47-24.09 41.84-17.22C380.6 41.28 388.3 60.01 381.5 76.33z"]
};
library$1.add(faPaypal, faBitcoinSign, faBitcoin, faCcStripe, faMoneyBillWave, faCreditCard, faV);
const _sfc_main$7 = defineComponent({
  name: "PaymentMethod",
  components: {
    Navigator,
    RadioGroup: wi,
    RadioGroupDescription: ki,
    RadioGroupLabel: Mi,
    RadioGroupOption: Li,
    DialogTitle: qr,
    FontAwesomeIcon
  },
  setup() {
    const { context } = useOverlay();
    const getDescription = (method) => {
      switch (method) {
        case "COINBASE":
          return "Pay with crypto: BTC, ETH, and more";
        case "PAYPAL":
          return "Checkout with your PayPal account";
        case "PAYSTACK":
          return "Pay with credit and debit card";
        case "STRIPE":
          return "Pay with credit card, debit card, and more";
        case "CASHAPP":
          return "Checkout with your CashApp account";
        case "VENMO":
          return "Pay directly with your Venmo account";
        case "PADDLE":
          return "Card, Apple/Google Pay, and more";
        case "BTCPAY":
          return "Pay with bitcoin and other cryptocurrencies";
        default:
          return null;
      }
    };
    const getIcon = (method) => {
      switch (method) {
        case "COINBASE":
          return "fa-solid fa-bitcoin-sign";
        case "PAYPAL":
          return "fa-brands fa-paypal";
        case "PAYSTACK":
          return "fa-solid fa-money-bill-wave";
        case "STRIPE":
          return "fa-brands fa-cc-stripe";
        case "CASHAPP":
          return "fa-solid fa-credit-card";
        case "VENMO":
          return "fa-solid fa-v";
        case "PADDLE":
          return "fa-solid fa-credit-card";
        case "BTCPAY":
          return "fa-brands fa-bitcoin";
        default:
          return null;
      }
    };
    const getDiscount = (method) => {
      switch (method) {
        case "COINBASE":
          if (!context.value.variant.payment_discounts) {
            return 0;
          } else {
            return context.value.variant.payment_discounts.coinbase;
          }
        case "PAYPAL":
          if (!context.value.variant.payment_discounts) {
            return 0;
          } else {
            return context.value.variant.payment_discounts.paypal;
          }
        case "PAYSTACK":
          if (!context.value.variant.payment_discounts) {
            return 0;
          } else {
            return context.value.variant.payment_discounts.paystack;
          }
        case "STRIPE":
          if (!context.value.variant.payment_discounts) {
            return 0;
          } else {
            return context.value.variant.payment_discounts.stripe;
          }
        case "CASHAPP":
          if (!context.value.variant.payment_discounts) {
            return 0;
          } else {
            return context.value.variant.payment_discounts.cashapp;
          }
        case "CASHAPP":
          if (!context.value.variant.payment_discounts) {
            return 0;
          } else {
            return context.value.variant.payment_discounts.cashapp;
          }
        case "BTCPAY":
          if (!context.value.variant.payment_discounts) {
            return 0;
          } else {
            return context.value.variant.payment_discounts.btcpay;
          }
        default:
          return null;
      }
    };
    return {
      checkout_information,
      context,
      getDescription,
      getIcon,
      getDiscount
    };
  }
});
const _hoisted_1$7 = { class: "embed-flex embed-flex-col embed-px-4 embed-pt-5 embed-pb-4 sm:embed-p-6" };
const _hoisted_2$6 = /* @__PURE__ */ createTextVNode("Payment");
const _hoisted_3$4 = /* @__PURE__ */ createTextVNode("Payment Method");
const _hoisted_4$2 = /* @__PURE__ */ createTextVNode("Select a payment method");
const _hoisted_5$2 = { class: "embed-space-y-4" };
const _hoisted_6$1 = { class: "embed-flex embed-items-center embed-justify-between embed-flex-grow-0" };
const _hoisted_7$1 = { class: "embed-text-sm" };
const _hoisted_8$1 = { class: "embed-mr-1" };
const _hoisted_9 = { class: "embed-capitalize" };
const _hoisted_10 = {
  key: 0,
  class: "embed-bg-white dark:embed-bg-black embed-rounded-xl embed-shadow dark:embed-shadow-black embed-px-2 embed-py-0.5 embed-text-sm dark:embed-text-white"
};
const _hoisted_11 = /* @__PURE__ */ createTextVNode(" Get ");
const _hoisted_12 = /* @__PURE__ */ createTextVNode(" off ");
const _hoisted_13 = {
  key: 1,
  class: "embed-bg-white dark:embed-bg-black embed-rounded-xl embed-shadow dark:embed-shadow-black embed-px-2 embed-py-0.5 embed-text-sm dark:embed-text-white"
};
const _hoisted_14 = /* @__PURE__ */ createTextVNode(" Costs ");
const _hoisted_15 = /* @__PURE__ */ createTextVNode(" extra ");
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("div", {
  class: "embed-absolute embed--inset-px embed-rounded-lg embed-pointer-events-none",
  "aria-hidden": "true"
}, null, -1);
const _hoisted_17 = ["textContent"];
const _hoisted_18 = ["textContent"];
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const _component_DialogTitle = resolveComponent("DialogTitle");
  const _component_RadioGroupLabel = resolveComponent("RadioGroupLabel");
  const _component_RadioGroupDescription = resolveComponent("RadioGroupDescription");
  const _component_font_awesome_icon = resolveComponent("font-awesome-icon");
  const _component_RadioGroupOption = resolveComponent("RadioGroupOption");
  const _component_RadioGroup = resolveComponent("RadioGroup");
  const _component_Navigator = resolveComponent("Navigator");
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("div", _hoisted_1$7, [
      createVNode(_component_DialogTitle, {
        as: "h2",
        class: "embed-font-bold embed-text-center dark:embed-text-white embed-text-xl"
      }, {
        default: withCtx(() => [
          _hoisted_2$6
        ]),
        _: 1
      }),
      createVNode(_component_RadioGroup, {
        modelValue: _ctx.checkout_information.payment_method,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.checkout_information.payment_method = $event)
      }, {
        default: withCtx(() => [
          createVNode(_component_RadioGroupLabel, { class: "embed-sr-only" }, {
            default: withCtx(() => [
              _hoisted_3$4
            ]),
            _: 1
          }),
          createVNode(_component_RadioGroupDescription, { class: "dark:embed-text-white embed-mb-4 embed-italic embed-text-sm" }, {
            default: withCtx(() => [
              _hoisted_4$2
            ]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_5$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.context.variant.payment_methods, (method) => {
              return openBlock(), createBlock(_component_RadioGroupOption, {
                key: method,
                as: "template",
                value: method
              }, {
                default: withCtx(({ checked }) => [
                  createBaseVNode("div", {
                    class: normalizeClass(["embed-flex embed-flex-col", [checked ? "embed-shadow-lg embed-bg-white dark:embed-bg-slate-900 embed-shadow-slate-400 dark:embed-shadow-black" : "bg-slate-50 dark:embed-bg-slate-800 embed-shadow dark:embed-shadow-black/20 dark:hover:embed-bg-slate-900 hover:embed-bg-white hover:embed-shadow-slate-400 dark:hover:embed-shadow-black", "embed-transition embed-duration-200 embed-ease-in-out embed-relative embed-block embed-rounded-lg embed-px-6 embed-py-4 embed-cursor-pointer sm:embed-flex sm:embed-justify-between focus:embed-outline-none"]])
                  }, [
                    createBaseVNode("div", _hoisted_6$1, [
                      createBaseVNode("div", _hoisted_7$1, [
                        createVNode(_component_RadioGroupLabel, {
                          as: "p",
                          class: "embed-font-medium embed-text-slate-900 dark:embed-text-white"
                        }, {
                          default: withCtx(() => [
                            createBaseVNode("span", _hoisted_8$1, [
                              createVNode(_component_font_awesome_icon, {
                                icon: _ctx.getIcon(method)
                              }, null, 8, ["icon"])
                            ]),
                            createBaseVNode("span", _hoisted_9, toDisplayString(method.toLowerCase()), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _ctx.getDiscount(method) !== null && _ctx.getDiscount(method) > 0 ? (openBlock(), createElementBlock("div", _hoisted_10, [
                        _hoisted_11,
                        createBaseVNode("strong", null, toDisplayString(_ctx.getDiscount(method)) + "%", 1),
                        _hoisted_12
                      ])) : createCommentVNode("", true),
                      _ctx.getDiscount(method) !== null && _ctx.getDiscount(method) < 0 ? (openBlock(), createElementBlock("div", _hoisted_13, [
                        _hoisted_14,
                        createBaseVNode("strong", null, toDisplayString(_ctx.getDiscount(method) * -1) + "%", 1),
                        _hoisted_15
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode(_component_RadioGroupDescription, {
                      as: "div",
                      class: "embed-flex embed-text-xs embed-text-left dark:embed-text-slate-100 embed-mt-2"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.getDescription(method)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    _hoisted_16
                  ], 2)
                ]),
                _: 2
              }, 1032, ["value"]);
            }), 128))
          ])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      !!((_c = (_b = (_a2 = _ctx.context.error) == null ? void 0 : _a2.errors) == null ? void 0 : _b.payment_method) == null ? void 0 : _c[0]) ? (openBlock(), createElementBlock("p", {
        key: 0,
        class: "embed-ml-1.5 embed-mt-1 embed-text-left embed-text-sm embed-text-red-600 dark:embed-text-red embed-w-full",
        textContent: toDisplayString((_e = (_d = _ctx.context.error) == null ? void 0 : _d.errors) == null ? void 0 : _e.payment_method[0])
      }, null, 8, _hoisted_17)) : createCommentVNode("", true),
      !!((_h = (_g = (_f = _ctx.context.error) == null ? void 0 : _f.errors) == null ? void 0 : _g.total) == null ? void 0 : _h[0]) ? (openBlock(), createElementBlock("p", {
        key: 1,
        class: "embed-ml-1.5 embed-mt-1 embed-text-left embed-text-sm embed-text-red-600 dark:embed-text-red embed-w-full",
        textContent: toDisplayString((_j = (_i = _ctx.context.error) == null ? void 0 : _i.errors) == null ? void 0 : _j.total[0])
      }, null, 8, _hoisted_18)) : createCommentVNode("", true),
      createVNode(_component_Navigator, {
        class: normalizeClass(_ctx.checkout_information.payment_method == "" ? "embed-hidden" : "")
      }, null, 8, ["class"])
    ])
  ]);
}
var PaymentMethod = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7]]);
const _sfc_main$6 = defineComponent({
  name: "AdditionalInformation",
  components: {
    ArrowLeftIcon: render$9,
    ArrowRightIcon: render$8,
    InputGroup
  },
  setup() {
    var _a2;
    const { context } = useOverlay();
    const required_fields = computed(() => context.value.variant.additional_information);
    if (context.value.variant.additional_information.length > 0) {
      (_a2 = checkout_information.additional_information) != null ? _a2 : checkout_information.additional_information = {};
      required_fields.value.forEach((field) => {
        var _a3, _b, _c, _d;
        if (((_a3 = checkout_information.additional_information[field.key]) != null ? _a3 : null) === null) {
          let defaultValue;
          if (field.type === "CHECKBOX") {
            defaultValue = false;
          } else if (field.type === "NUMBER") {
            defaultValue = 0;
          } else {
            defaultValue = "";
          }
          (_d = (_b = checkout_information.additional_information)[_c = field.key]) != null ? _d : _b[_c] = defaultValue;
        }
      });
    }
    return {
      checkout_information,
      context,
      required_fields
    };
  }
});
const _hoisted_1$6 = { class: "embed-space-y-6" };
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_InputGroup = resolveComponent("InputGroup");
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.required_fields, (field) => {
      return openBlock(), createElementBlock(Fragment, { key: field }, [
        field.type === "TEXTAREA" ? (openBlock(), createBlock(_component_InputGroup, {
          key: 0,
          modelValue: _ctx.checkout_information.additional_information[field.key],
          "onUpdate:modelValue": ($event) => _ctx.checkout_information.additional_information[field.key] = $event,
          type: field.type.toLowerCase(),
          "error-key": `additional_information.${field.key}`,
          placeholder: field.label,
          rows: "3",
          label: field.label
        }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "error-key", "placeholder", "label"])) : field.type === "NUMBER" ? (openBlock(), createBlock(_component_InputGroup, {
          key: 1,
          modelValue: _ctx.checkout_information.additional_information[field.key],
          "onUpdate:modelValue": ($event) => _ctx.checkout_information.additional_information[field.key] = $event,
          type: field.type.toLowerCase(),
          "error-key": `additional_information.${field.key}`,
          placeholder: field.label,
          label: field.label,
          min: "1"
        }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "error-key", "placeholder", "label"])) : (openBlock(), createBlock(_component_InputGroup, {
          key: 2,
          modelValue: _ctx.checkout_information.additional_information[field.key],
          "onUpdate:modelValue": ($event) => _ctx.checkout_information.additional_information[field.key] = $event,
          type: field.type.toLowerCase(),
          "error-key": `additional_information.${field.key}`,
          placeholder: field.label,
          label: field.label
        }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "error-key", "placeholder", "label"]))
      ], 64);
    }), 128))
  ]);
}
var AdditionalInformation = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6]]);
const _sfc_main$5 = defineComponent({
  name: "CustomerEmail",
  components: {
    Navigator,
    Button,
    InputGroup,
    AdditionalInformation,
    MailIcon: render$5,
    DialogTitle: qr
  },
  setup() {
    const { context } = useOverlay();
    return {
      checkout_information,
      context
    };
  }
});
const _hoisted_1$5 = { class: "embed-flex embed-flex-col embed-px-4 embed-pt-5 embed-pb-4 sm:embed-p-6" };
const _hoisted_2$5 = /* @__PURE__ */ createTextVNode("Product delivery");
const _hoisted_3$3 = { class: "embed-p-3 embed-text-left" };
const _hoisted_4$1 = {
  key: 0,
  class: "embed-p-3 embed-text-left"
};
const _hoisted_5$1 = { class: "embed-px-3 embed-relative embed-flex embed-items-start" };
const _hoisted_6 = { class: "embed-min-w-0 embed-flex-1 embed-text-sm" };
const _hoisted_7 = ["textContent"];
const _hoisted_8 = { class: "embed-ml-3 embed-flex embed-items-center embed-h-5" };
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  var _a2, _b, _c, _d, _e, _f, _g, _h;
  const _component_DialogTitle = resolveComponent("DialogTitle");
  const _component_MailIcon = resolveComponent("MailIcon");
  const _component_InputGroup = resolveComponent("InputGroup");
  const _component_AdditionalInformation = resolveComponent("AdditionalInformation");
  const _component_Navigator = resolveComponent("Navigator");
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
    createVNode(_component_DialogTitle, {
      as: "h1",
      class: "embed-font-bold embed-text-center embed-text-xl dark:embed-text-white"
    }, {
      default: withCtx(() => [
        _hoisted_2$5
      ]),
      _: 1
    }),
    createBaseVNode("div", _hoisted_3$3, [
      createVNode(_component_InputGroup, {
        "error-key": "customer_email",
        type: "email",
        label: "Email",
        placeholder: "example@example.com",
        modelValue: _ctx.checkout_information.customer_email,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.checkout_information.customer_email = $event)
      }, {
        icon: withCtx(() => [
          createVNode(_component_MailIcon, {
            class: "embed-h-5 embed-w-5 embed-text-slate-400",
            "aria-hidden": "true"
          })
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]),
    _ctx.context.variant.additional_information.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
      createVNode(_component_AdditionalInformation)
    ])) : createCommentVNode("", true),
    createBaseVNode("div", _hoisted_5$1, [
      createBaseVNode("div", _hoisted_6, [
        createBaseVNode("label", {
          for: "terms_of_service",
          class: normalizeClass(["embed-font-medium embed-select-none embed-mb-0", [((_c = (_b = (_a2 = _ctx.context.error) == null ? void 0 : _a2.errors) == null ? void 0 : _b.terms_of_service) == null ? void 0 : _c[0]) ? "embed-text-red-700" : "embed-text-slate-700 dark:embed-text-slate-300"]])
        }, "By making this purchase, you agree to the terms of service", 2),
        ((_f = (_e = (_d = _ctx.context.error) == null ? void 0 : _d.errors) == null ? void 0 : _e.terms_of_service) == null ? void 0 : _f[0]) ? (openBlock(), createElementBlock("p", {
          key: 0,
          class: "embed-ml-1 embed-text-left embed-text-xs embed-text-red-600 embed-w-full",
          textContent: toDisplayString((_h = (_g = _ctx.context.error) == null ? void 0 : _g.errors) == null ? void 0 : _h.terms_of_service[0])
        }, null, 8, _hoisted_7)) : createCommentVNode("", true)
      ]),
      createBaseVNode("div", _hoisted_8, [
        withDirectives(createBaseVNode("input", {
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.checkout_information.terms_of_service = $event),
          id: "terms_of_service",
          name: "terms_of_service",
          type: "checkbox",
          class: "embed-bg-slate-200 checked:embed-bg-slate-400 embed-border embed-border-slate-400 dark:embed-border-slate-600 embed-ring-1 embed-ring-slate-400 dark:embed-ring-slate-600 hover:embed-bg-slate-300 focus:embed-bg-slate-300 dark:embed-bg-slate-900 dark:checked:embed-bg-slate-800 dark:hover:embed-bg-slate-800 dark:focus:embed-bg-slate-800 embed-rounded-md embed-shadow-lg dark:embed-shadow-black focus:embed-ring-0"
        }, null, 512), [
          [vModelCheckbox, _ctx.checkout_information.terms_of_service]
        ])
      ])
    ]),
    createVNode(_component_Navigator, {
      next: { type: "CHECKOUT" },
      "loading-state": "checkout.step.customer_email.checkout_product"
    })
  ]);
}
var CustomerEmail = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const _sfc_main$4 = defineComponent({
  name: "DialogMessage",
  components: {
    DialogTitle: qr
  },
  props: {
    title: String,
    message: {
      type: String,
      required: false,
      default: null
    }
  }
});
const _hoisted_1$4 = { class: "embed-flex embed-flex-col embed-items-center embed-justify-evenly embed-h-4/6 embed-w-full embed-p-6" };
const _hoisted_2$4 = { class: "embed-flex embed-flex-col embed-items-center" };
const _hoisted_3$2 = { class: "bg-slate-100 embed-p-4 embed-rounded-lg embed-w-11/12 embed-rounded embed-mt-4 dark:embed-bg-slate-800 dark:embed-text-white" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DialogTitle = resolveComponent("DialogTitle");
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    createBaseVNode("div", _hoisted_2$4, [
      renderSlot(_ctx.$slots, "default"),
      createVNode(_component_DialogTitle, {
        as: "h2",
        class: "embed-mb-0 embed-mt-3 embed-font-bold embed-text-2xl dark:embed-text-white"
      }, {
        default: withCtx(() => [
          createTextVNode(toDisplayString(_ctx.title), 1)
        ]),
        _: 1
      })
    ]),
    createBaseVNode("div", _hoisted_3$2, [
      renderSlot(_ctx.$slots, "action", {}, () => [
        createBaseVNode("p", null, toDisplayString(_ctx.message), 1)
      ])
    ])
  ]);
}
var DialogMessage = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const _sfc_main$3 = {
  name: "LoadingSpinner"
};
const _hoisted_1$3 = { class: "embed-absolute embed-flex embed-justify-center embed-items-center embed-w-full embed-h-full embed-z-50 embed-bg-opacity-70" };
const _hoisted_2$3 = /* @__PURE__ */ createBaseVNode("span", { class: "embed-animate-ping embed-absolute embed-inline-flex embed-h-24 embed-w-24 embed-rounded-full embed-bg-slate-700 embed-opacity-75" }, null, -1);
const _hoisted_3$1 = [
  _hoisted_2$3
];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$3, _hoisted_3$1);
}
var LoadingSpinner = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = defineComponent({
  name: "SuccessDialog",
  components: {
    DialogMessage,
    CheckCircleIcon: render$1
  },
  setup: function() {
    const { context } = useOverlay();
    return {
      context
    };
  }
});
const _hoisted_1$2 = /* @__PURE__ */ createTextVNode(" Your order has been created! If the payment gateway did not open by itself, ");
const _hoisted_2$2 = ["href"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_CheckCircleIcon = resolveComponent("CheckCircleIcon");
  const _component_DialogMessage = resolveComponent("DialogMessage");
  return openBlock(), createBlock(_component_DialogMessage, {
    class: "embed-bg-white embed-text-center dark:embed-bg-ultra embed-rounded-2xl embed-shadow-xl",
    title: "Order Created"
  }, {
    action: withCtx(() => [
      createBaseVNode("p", null, [
        _hoisted_1$2,
        createBaseVNode("a", {
          href: _ctx.context.order,
          class: "embed-font-bold embed-underline",
          target: "_blank"
        }, "click here to open it.", 8, _hoisted_2$2)
      ])
    ]),
    default: withCtx(() => [
      createVNode(_component_CheckCircleIcon, { class: "embed-h-24 embed-w-24 embed-text-green-600" })
    ]),
    _: 1
  });
}
var SuccessDialog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = defineComponent({
  name: "HeadsUpDialog",
  components: {
    DialogMessage
  }
});
const _hoisted_1$1 = /* @__PURE__ */ createBaseVNode("p", { class: "embed-mb-4" }, "Once paid, the order will instantly be sent to your entered email. That's it!", -1);
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("p", { class: "embed-text-xs" }, "Note: If you paid with PayPal, we will send the product to your PayPal email for security reasons.", -1);
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DialogMessage = resolveComponent("DialogMessage");
  return openBlock(), createBlock(_component_DialogMessage, {
    class: "embed-bg-white embed-text-center dark:embed-bg-ultra embed-rounded-2xl embed-shadow-xl",
    title: "What's Next?"
  }, {
    action: withCtx(() => [
      _hoisted_1$1,
      _hoisted_2$1
    ]),
    _: 1
  });
}
var HeadsUpDialog = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
function mergeMeta(meta) {
  return Object.keys(meta).reduce((acc, key) => {
    const value = meta[key];
    Object.assign(acc, value);
    return acc;
  }, {});
}
const _sfc_main = defineComponent({
  name: "Embed",
  components: {
    LoadingSpinner,
    Dialog: Gr,
    DialogOverlay: _r,
    DialogTitle: qr,
    TransitionChild: Qn,
    TransitionRoot: Yn,
    ExclamationCircleIcon: render$7,
    VariantSelection,
    Overview,
    PaymentMethod,
    CustomerEmail,
    Navigator,
    DialogMessage,
    CheckCircleIcon: render$1,
    SuccessDialog,
    HeadsUpDialog
  },
  setup: function() {
    const { context, state, send: send2 } = useOverlay();
    setupCheckoutButtons();
    const stepComponent = computed(() => {
      if (!state.value.matches("checkout"))
        return null;
      return mergeMeta(state.value.meta).component;
    });
    return {
      stepComponent,
      context,
      state,
      send: send2
    };
  }
});
const _hoisted_1 = {
  id: "embed-modal",
  class: "embed-fixed embed-z-10 embed-inset-0 embed-overflow-auto"
};
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("span", {
  class: "embed-hidden sm:embed-inline-block sm:embed-align-middle sm:embed-h-screen",
  "aria-hidden": "true"
}, "\u200B", -1);
const _hoisted_3 = { class: "embed-relative embed-z-50 embed-max-w-lg embed-w-full embed-inline-block embed-align-middle embed-px-4" };
const _hoisted_4 = {
  key: 1,
  class: "embed-space-y-4"
};
const _hoisted_5 = {
  key: 1,
  class: "embed-space-y-6"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DialogOverlay = resolveComponent("DialogOverlay");
  const _component_TransitionChild = resolveComponent("TransitionChild");
  const _component_LoadingSpinner = resolveComponent("LoadingSpinner");
  const _component_SuccessDialog = resolveComponent("SuccessDialog");
  const _component_HeadsUpDialog = resolveComponent("HeadsUpDialog");
  const _component_ExclamationCircleIcon = resolveComponent("ExclamationCircleIcon");
  const _component_DialogMessage = resolveComponent("DialogMessage");
  const _component_Dialog = resolveComponent("Dialog");
  const _component_TransitionRoot = resolveComponent("TransitionRoot");
  return openBlock(), createBlock(_component_TransitionRoot, {
    as: "template",
    show: !_ctx.state.matches("closed")
  }, {
    default: withCtx(() => [
      createVNode(_component_Dialog, {
        as: "div",
        onClose: _cache[0] || (_cache[0] = ($event) => _ctx.send("CLOSE"))
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createBaseVNode("div", {
              class: normalizeClass(["embed-flex embed-items-center embed-justify-center embed-min-h-screen embed-text-center", { "embed-dark": _ctx.context.customization.darkMode }])
            }, [
              createVNode(_component_TransitionChild, {
                as: "template",
                enter: "embed-ease-out embed-duration-300",
                "enter-from": "embed-opacity-0",
                "enter-to": "embed-opacity-100",
                leave: "embed-ease-in embed-duration-200",
                "leave-from": "embed-opacity-100",
                "leave-to": "embed-opacity-0"
              }, {
                default: withCtx(() => [
                  createVNode(_component_DialogOverlay, { class: "embed-fixed embed-inset-0 embed-bg-slate-500 dark:embed-bg-black embed-bg-opacity-75 dark:embed-bg-opacity-80 embed-transition-opacity" })
                ]),
                _: 1
              }),
              _hoisted_2,
              createVNode(_component_TransitionChild, {
                as: "template",
                enter: "embed-ease-out embed-duration-300",
                "enter-from": "embed-opacity-0 embed-translate-y-4 sm:embed-translate-y-0 sm:embed-scale-95",
                "enter-to": "embed-opacity-100 embed-translate-y-0 sm:embed-scale-100",
                leave: "embed-ease-in embed-duration-200",
                "leave-from": "embed-opacity-100 embed-translate-y-0 sm:embed-scale-100",
                "leave-to": "embed-opacity-0 embed-translate-y-4 sm:embed-translate-y-0 sm:embed-scale-95"
              }, {
                default: withCtx(() => [
                  createBaseVNode("div", _hoisted_3, [
                    _ctx.state.hasTag("loading") ? (openBlock(), createBlock(_component_LoadingSpinner, { key: 0 })) : (openBlock(), createElementBlock("div", _hoisted_4, [
                      _ctx.stepComponent ? (openBlock(), createBlock(Transition, {
                        key: 0,
                        "enter-active-class": "embed-duration-500 embed-ease-out",
                        "enter-from-class": "embed-opacity-0 embed--translate-x-full md:embed-translate-x-full",
                        "enter-to-class": "embed-opacity-100 embed-translate-x-0",
                        "leave-active-class": "embed-duration-500 embed-ease-out",
                        "leave-from-class": "embed-opacity-100 embed-translate-x-0",
                        "leave-to-class": "embed-opacity-0 embed--translate-x-full",
                        mode: "out-in"
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(_ctx.stepComponent), { class: "embed-bg-white embed-text-center dark:embed-bg-ultra embed-rounded-2xl embed-shadow-xl" }))
                        ]),
                        _: 1
                      })) : _ctx.state.matches("invoice_processed") ? (openBlock(), createElementBlock("div", _hoisted_5, [
                        createVNode(_component_SuccessDialog),
                        createVNode(_component_HeadsUpDialog)
                      ])) : _ctx.state.matches("error") ? (openBlock(), createBlock(_component_DialogMessage, {
                        key: 2,
                        class: "embed-bg-white embed-text-center dark:embed-bg-ultra embed-rounded-2xl embed-shadow-xl",
                        title: "Whoops",
                        message: _ctx.context.error.message
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_ExclamationCircleIcon, { class: "embed-h-24 embed-w-24 embed-text-slate-600" })
                        ]),
                        _: 1
                      }, 8, ["message"])) : createCommentVNode("", true)
                    ]))
                  ])
                ]),
                _: 1
              })
            ], 2)
          ])
        ]),
        _: 1
      })
    ]),
    _: 1
  }, 8, ["show"]);
}
var Embed = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
var styles = "";
const app = createApp(Embed);
const container = document.createElement("div");
document.body.append(container);
app.mount(container);
