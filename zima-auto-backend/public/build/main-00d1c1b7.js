
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
function noop() { }
const identity = x => x;
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);
function append(target, node) {
    target.appendChild(node);
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_empty_stylesheet(node) {
    const style_element = element('style');
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element.sheet;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function init_binding_group(group) {
    let _inputs;
    return {
        /* push */ p(...inputs) {
            _inputs = inputs;
            _inputs.forEach(input => group.push(input));
        },
        /* remove */ r() {
            _inputs.forEach(input => group.splice(group.indexOf(input), 1));
        }
    };
}
function to_number(value) {
    return value === '' ? null : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}
function set_style(node, key, value, important) {
    if (value == null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function select_option(select, value, mounting) {
    for (let i = 0; i < select.options.length; i += 1) {
        const option = select.options[i];
        if (option.__value === value) {
            option.selected = true;
            return;
        }
    }
    if (!mounting || value !== undefined) {
        select.selectedIndex = -1; // no option should be selected
    }
}
function select_value(select) {
    const selected_option = select.querySelector(':checked');
    return selected_option && selected_option.__value;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
}
class HtmlTag {
    constructor(is_svg = false) {
        this.is_svg = false;
        this.is_svg = is_svg;
        this.e = this.n = null;
    }
    c(html) {
        this.h(html);
    }
    m(html, target, anchor = null) {
        if (!this.e) {
            if (this.is_svg)
                this.e = svg_element(target.nodeName);
            /** #7364  target for <template> may be provided as #document-fragment(11) */
            else
                this.e = element((target.nodeType === 11 ? 'TEMPLATE' : target.nodeName));
            this.t = target.tagName !== 'TEMPLATE' ? target : target.content;
            this.c(html);
        }
        this.i(anchor);
    }
    h(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.nodeName === 'TEMPLATE' ? this.e.content.childNodes : this.e.childNodes);
    }
    i(anchor) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(this.t, this.n[i], anchor);
        }
    }
    p(html) {
        this.d();
        this.h(html);
        this.i(this.a);
    }
    d() {
        this.n.forEach(detach);
    }
}

// we need to store the information for multiple documents because a Svelte application could also contain iframes
// https://github.com/sveltejs/svelte/issues/3624
const managed_styles = new Map();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_style_information(doc, node) {
    const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
    managed_styles.set(doc, info);
    return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
    if (!rules[name]) {
        rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        managed_styles.forEach(info => {
            const { ownerNode } = info.stylesheet;
            // there is no ownerNode if it runs on jsdom.
            if (ownerNode)
                detach(ownerNode);
        });
        managed_styles.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
/**
 * Schedules a callback to run immediately after the component has been updated.
 *
 * The first time the callback runs will be after the initial `onMount`
 */
function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
}
/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs#run-time-svelte-ondestroy
 */
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
/**
 * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
 *
 * Component events created with `createEventDispatcher` create a
 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
 * property and can contain any type of data.
 *
 * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
 */
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail, { cancelable });
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
            return !event.defaultPrevented;
        }
        return true;
    };
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
        return;
    }
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        try {
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 */
function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
    const options = { direction: 'both' };
    let config = fn(node, params, options);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = (program.b - t);
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program || pending_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config(options);
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    const updates = [];
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            // defer updates until all the DOM shuffling is done
            updates.push(() => block.p(child_ctx, dirty));
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        transition_in(block, 1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
}
function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
        const key = get_key(get_context(ctx, list, i));
        if (keys.has(key)) {
            throw new Error('Cannot have duplicate keys in a keyed each');
        }
        keys.add(key);
    }
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        flush_render_callbacks($$.after_update);
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    if (has_stop_immediate_propagation)
        modifiers.push('stopImmediatePropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
function construct_svelte_component_dev(component, props) {
    const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
    try {
        const instance = new component(props);
        if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
            throw new Error(error_message);
        }
        return instance;
    }
    catch (err) {
        const { message } = err;
        if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
            throw new Error(error_message);
        }
        else {
            throw err;
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=} start
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

var hu = {
  common: { // Added common section
    back: "Vissza"
  },
  cookieConsent: {
    title: "Cookie-k használata",
    message: "Weboldalunk cookie-kat használ a felhasználói élmény javítása érdekében. A weboldal használatával elfogadja a cookie-k használatát.",
    accept: "Elfogadom",
    decline: "Elutasítom",
    learnMore: "További információ"
  },
  nav: {
    home: "FŐOLDAL",
    booking: "FOGLALÁS",
    about: "RÓLUNK",
    services: "SZOLGÁLTATÁSOK",
    contact: "KAPCSOLAT"
  },
  hero: {
    welcome: "Üdvözöljük a Zima Auto Kft-nél!",
    subtitle: "Ahol az autója minden igényére egy helyen kínálunk megoldást!",
    cta: "FOGLALJON MOST"
  },
  booking: {
    title: "FOGLALJON HELYET",
    button: "Reptéri Parkolás Foglalása",
    // --- New Booking Page Content ---
    content: {
      sectionTitle: "Reptéri Parkolás Foglalás Részletei",
      paragraph1: "Üdvözöljük online foglalási rendszerünkben. Kérjük, adja meg az alábbi szükséges információkat, hogy lefoglalhassa parkolóhelyét a Zima Auto reptér melletti létesítményében.",
      paragraph2: "Telephelyünk csak percekre található a repülőtértől, biztonságos és kényelmes parkolási megoldást kínálva utazásához.",
      paragraph3: "Kérésének elküldése után visszaigazoló e-mailt fog kapni a foglalás minden részletével, beleértve az útvonaltervet és a bejelentkezési eljárásokat.",
      note: "Ha bármilyen különleges kérése van vagy segítségre van szüksége, kérjük, lépjen kapcsolatba velünk közvetlenül."
    }
    // --- End New Content ---
  },
  services: {
    title: "SZOLGÁLTATÁSOK",
    parking: {
      title: "24/7 REPÜLŐTÉRI PARKOLÁS",
      description: "Biztonságos parkolási lehetőségünk bekerített határokkal és 24 órás kamerás megfigyeléssel rendelkezik, ami garantálja járművének a legnagyobb biztonságot."
    },
    washing: {
      title: "AUTÓMOSÓ",
      description: "Ajándékozza meg járművét egy fürdőnappal professzionális autómosó szolgáltatásainkkal, amelyek célja, hogy autója csillogóan tisztán és fiatalon maradjon."
    },
    tire: {
      title: "GUMISZERVIZ", // Fixed typo from previous hu.js 'GUMISZERIVZ'
      description: "Szakértő technikusaink készen állnak az abroncsokkal kapcsolatos bármilyen probléma azonnali megoldására, és biztonságosan visszatérni az útra."
    },
    service: {
      title: "AUTÓSZERVIZ",
      description: "A rutinellenőrzéstől a komplex javításokig szakképzett szerelőink fel vannak szerelve az összes karbantartás elvégzésére."
    }
  },
  testimonials: {
    title: "Ügyfeleink Véleménye",
    viewAll: "Összes vélemény megtekintése"
  },
  cta: {
    discover: "Fedezze fel versenyképes árainkat – nézze meg most!",
    button: "Árlista Megtekintése"
  },
  footer: {
    visit: "LÁTOGASSON MEG MINKET",
    address: "Vecsés Széchényi utca 62 mellett, Hrsz 0182/55, 2220",
    phone: "Telefon",
    phoneNumber: "06 70 555 0588",
    email: "Email",
    emailAddress: "info@zima-auto.com",
    links: "Hivatkozások",
    copyright: "© 2025 zima-auto.com. Minden jog fenntartva."
  }
};

var en = {
  cookieConsent: {
    title: "Cookie Settings",
    message: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept', you consent to our use of cookies.",
    accept: "Accept",
    decline: "Decline",
    categories: {
      necessary: "Necessary Cookies",
      necessaryDesc: "These cookies are required for the website to function and cannot be switched off. They are usually only set in response to actions made by you.",
      analytics: "Analytics Cookies",
      analyticsDesc: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      marketing: "Marketing Cookies",
      marketingDesc: "These cookies are used to track visitors across websites to display relevant advertisements.",
      preferences: "Preference Cookies",
      preferencesDesc: "These cookies allow the website to remember choices you make and provide enhanced, more personal features."
    }
  },
  common: { // Added common section
    back: "Back"
  },
  nav: {
    home: "HOME",
    booking: "BOOKING",
    about: "ABOUT US",
    services: "SERVICES",
    contact: "CONTACT"
  },
  hero: {
    welcome: "Welcome to Zima Auto!",
    subtitle: "Where we offer solutions for all your car needs in one place!",
    cta: "BOOK NOW"
  },
  booking: {
    title: "BOOK A SPOT",
    button: "Book Airport Parking",
    // --- New Booking Page Content ---
    content: {
      sectionTitle: "Airport Parking Booking Details",
      paragraph1: "Welcome to our online booking system. Please provide the necessary information below to reserve your parking spot at Zima Auto near the airport.",
      paragraph2: "Our facility is located just minutes from the airport and offers a secure, convenient parking solution for your trip.",
      paragraph3: "After submitting your request, you will receive a confirmation email with all details regarding your booking, including directions and check-in procedures.",
      note: "If you have any special requests or require assistance, please contact us directly."
    }
    // --- End New Content ---
  },
  services: {
    title: "OUR SERVICES",
    parking: {
      title: "24/7 AIRPORT PARKING",
      description: "Our secure parking facility features fenced boundaries and 24-hour camera surveillance, guaranteeing the highest security for your vehicle."
    },
    washing: {
      title: "CAR WASH",
      description: "Treat your vehicle to a spa day with our professional car washing services aimed at keeping your car looking sparkling clean and youthful."
    },
    tire: {
      title: "TIRE SERVICE",
      description: "Our expert technicians are ready to solve any tire-related problems immediately and get you safely back on the road."
    },
    service: {
      title: "AUTO SERVICE",
      description: "From routine checks to complex repairs, our qualified mechanics are equipped to perform all maintenance."
    }
  },
  testimonials: {
    title: "Customer Testimonials",
    viewAll: "View all testimonials"
  },
  cta: {
    discover: "Discover our competitive prices – check them out now!",
    button: "View Price List"
  },
  footer: {
    visit: "VISIT US",
    address: "Next to Vecsés Széchényi Street 62, Plot 0182/55, 2220",
    phone: "Phone",
    phoneNumber: "06 70 555 0588",
    email: "Email",
    emailAddress: "info@zima-auto.com",
    links: "Links",
    copyright: "© 2025 zima-auto.com. All rights reserved."
  }
};

// src/lib/i18n/index.js

const translations = {
  hu,
  en
};

const currentLang = writable('hu');

function t(key, lang) {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return value;
}

/* src/components/Header.svelte generated by Svelte v3.59.2 */
const file$2 = "src/components/Header.svelte";

function create_fragment$2(ctx) {
	let header;
	let div3;
	let div0;
	let img0;
	let img0_src_value;
	let t0;
	let nav;
	let ul;
	let li0;
	let a0;
	let t1_value = t('nav.home', /*$currentLang*/ ctx[4]) + "";
	let t1;
	let t2;
	let li1;
	let a1;
	let t3_value = t('nav.booking', /*$currentLang*/ ctx[4]) + "";
	let t3;
	let t4;
	let li2;
	let a2;
	let t5_value = t('nav.about', /*$currentLang*/ ctx[4]) + "";
	let t5;
	let t6;
	let li3;
	let a3;
	let t7_value = t('nav.services', /*$currentLang*/ ctx[4]) + "";
	let t7;
	let t8;
	let li4;
	let a4;
	let t9_value = t('nav.contact', /*$currentLang*/ ctx[4]) + "";
	let t9;
	let t10;
	let div2;
	let div1;
	let button0;
	let img1;
	let img1_src_value;
	let t11;
	let span0;
	let t13;
	let button1;
	let img2;
	let img2_src_value;
	let t14;
	let span1;
	let t16;
	let button2;
	let span2;
	let t17;
	let span3;
	let t18;
	let span4;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			header = element("header");
			div3 = element("div");
			div0 = element("div");
			img0 = element("img");
			t0 = space();
			nav = element("nav");
			ul = element("ul");
			li0 = element("li");
			a0 = element("a");
			t1 = text(t1_value);
			t2 = space();
			li1 = element("li");
			a1 = element("a");
			t3 = text(t3_value);
			t4 = space();
			li2 = element("li");
			a2 = element("a");
			t5 = text(t5_value);
			t6 = space();
			li3 = element("li");
			a3 = element("a");
			t7 = text(t7_value);
			t8 = space();
			li4 = element("li");
			a4 = element("a");
			t9 = text(t9_value);
			t10 = space();
			div2 = element("div");
			div1 = element("div");
			button0 = element("button");
			img1 = element("img");
			t11 = space();
			span0 = element("span");
			span0.textContent = "HU";
			t13 = space();
			button1 = element("button");
			img2 = element("img");
			t14 = space();
			span1 = element("span");
			span1.textContent = "EN";
			t16 = space();
			button2 = element("button");
			span2 = element("span");
			t17 = space();
			span3 = element("span");
			t18 = space();
			span4 = element("span");
			if (!src_url_equal(img0.src, img0_src_value = "images/zima-logo.avif")) attr_dev(img0, "src", img0_src_value);
			attr_dev(img0, "alt", "Zima Auto");
			attr_dev(img0, "class", "svelte-1tq2hh2");
			add_location(img0, file$2, 79, 6, 1776);
			attr_dev(div0, "class", "logo svelte-1tq2hh2");
			attr_dev(div0, "tabindex", "0");
			attr_dev(div0, "role", "button");
			attr_dev(div0, "aria-label", "Go to homepage");
			add_location(div0, file$2, 71, 4, 1590);
			attr_dev(a0, "href", "#home");
			attr_dev(a0, "class", "svelte-1tq2hh2");
			add_location(a0, file$2, 85, 10, 1950);
			toggle_class(li0, "active", /*currentPage*/ ctx[1] === 'home');
			add_location(li0, file$2, 84, 8, 1897);
			attr_dev(a1, "href", "#booking");
			attr_dev(a1, "class", "svelte-1tq2hh2");
			add_location(a1, file$2, 90, 10, 2157);
			toggle_class(li1, "active", /*currentPage*/ ctx[1] === 'booking');
			add_location(li1, file$2, 89, 8, 2101);
			attr_dev(a2, "href", "#about");
			attr_dev(a2, "class", "svelte-1tq2hh2");
			add_location(a2, file$2, 95, 10, 2371);
			toggle_class(li2, "active", /*currentPage*/ ctx[1] === 'about');
			add_location(li2, file$2, 94, 8, 2317);
			attr_dev(a3, "href", "#services");
			attr_dev(a3, "class", "svelte-1tq2hh2");
			add_location(a3, file$2, 100, 10, 2582);
			toggle_class(li3, "active", /*currentPage*/ ctx[1] === 'services');
			add_location(li3, file$2, 99, 8, 2525);
			attr_dev(a4, "href", "#contact");
			attr_dev(a4, "class", "svelte-1tq2hh2");
			add_location(a4, file$2, 105, 10, 2801);
			toggle_class(li4, "active", /*currentPage*/ ctx[1] === 'contact');
			add_location(li4, file$2, 104, 8, 2745);
			attr_dev(ul, "class", "svelte-1tq2hh2");
			add_location(ul, file$2, 83, 6, 1884);
			attr_dev(nav, "class", "svelte-1tq2hh2");
			toggle_class(nav, "open", /*mobileMenuOpen*/ ctx[3]);
			add_location(nav, file$2, 82, 4, 1844);
			if (!src_url_equal(img1.src, img1_src_value = "/flags/hu.svg")) attr_dev(img1, "src", img1_src_value);
			attr_dev(img1, "alt", "Magyar zászló");
			attr_dev(img1, "width", "24");
			attr_dev(img1, "height", "16");
			attr_dev(img1, "class", "svelte-1tq2hh2");
			add_location(img1, file$2, 119, 10, 3238);
			attr_dev(span0, "class", "svelte-1tq2hh2");
			add_location(span0, file$2, 120, 10, 3319);
			attr_dev(button0, "class", "language-button " + (currentLang === 'hu' ? 'active' : '') + " svelte-1tq2hh2");
			attr_dev(button0, "aria-label", "Magyar nyelv");
			add_location(button0, file$2, 114, 8, 3053);
			if (!src_url_equal(img2.src, img2_src_value = "/flags/gb.svg")) attr_dev(img2, "src", img2_src_value);
			attr_dev(img2, "alt", "British flag");
			attr_dev(img2, "width", "24");
			attr_dev(img2, "height", "16");
			attr_dev(img2, "class", "svelte-1tq2hh2");
			add_location(img2, file$2, 127, 10, 3550);
			attr_dev(span1, "class", "svelte-1tq2hh2");
			add_location(span1, file$2, 128, 10, 3630);
			attr_dev(button1, "class", "language-button " + (currentLang === 'en' ? 'active' : '') + " svelte-1tq2hh2");
			attr_dev(button1, "aria-label", "English language");
			add_location(button1, file$2, 122, 8, 3361);
			attr_dev(div1, "class", "language-toggle svelte-1tq2hh2");
			add_location(div1, file$2, 113, 6, 3015);
			attr_dev(span2, "class", "svelte-1tq2hh2");
			add_location(span2, file$2, 139, 8, 3887);
			attr_dev(span3, "class", "svelte-1tq2hh2");
			add_location(span3, file$2, 140, 8, 3909);
			attr_dev(span4, "class", "svelte-1tq2hh2");
			add_location(span4, file$2, 141, 8, 3931);
			attr_dev(button2, "class", "mobile-menu-toggle svelte-1tq2hh2");
			attr_dev(button2, "aria-label", "Toggle menu");
			attr_dev(button2, "aria-expanded", /*mobileMenuOpen*/ ctx[3]);
			toggle_class(button2, "open", /*mobileMenuOpen*/ ctx[3]);
			add_location(button2, file$2, 132, 6, 3684);
			attr_dev(div2, "class", "right-section svelte-1tq2hh2");
			add_location(div2, file$2, 112, 4, 2981);
			attr_dev(div3, "class", "container svelte-1tq2hh2");
			add_location(div3, file$2, 70, 2, 1562);
			attr_dev(header, "class", "svelte-1tq2hh2");
			toggle_class(header, "scrolled", /*scrolled*/ ctx[2]);
			add_location(header, file$2, 69, 0, 1536);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, header, anchor);
			append_dev(header, div3);
			append_dev(div3, div0);
			append_dev(div0, img0);
			append_dev(div3, t0);
			append_dev(div3, nav);
			append_dev(nav, ul);
			append_dev(ul, li0);
			append_dev(li0, a0);
			append_dev(a0, t1);
			append_dev(ul, t2);
			append_dev(ul, li1);
			append_dev(li1, a1);
			append_dev(a1, t3);
			append_dev(ul, t4);
			append_dev(ul, li2);
			append_dev(li2, a2);
			append_dev(a2, t5);
			append_dev(ul, t6);
			append_dev(ul, li3);
			append_dev(li3, a3);
			append_dev(a3, t7);
			append_dev(ul, t8);
			append_dev(ul, li4);
			append_dev(li4, a4);
			append_dev(a4, t9);
			append_dev(div3, t10);
			append_dev(div3, div2);
			append_dev(div2, div1);
			append_dev(div1, button0);
			append_dev(button0, img1);
			append_dev(button0, t11);
			append_dev(button0, span0);
			append_dev(div1, t13);
			append_dev(div1, button1);
			append_dev(button1, img2);
			append_dev(button1, t14);
			append_dev(button1, span1);
			append_dev(div2, t16);
			append_dev(div2, button2);
			append_dev(button2, span2);
			append_dev(button2, t17);
			append_dev(button2, span3);
			append_dev(button2, t18);
			append_dev(button2, span4);

			if (!mounted) {
				dispose = [
					listen_dev(div0, "click", /*click_handler*/ ctx[9], false, false, false, false),
					listen_dev(div0, "keydown", /*handleLogoKeydown*/ ctx[8], false, false, false, false),
					listen_dev(a0, "click", prevent_default(/*click_handler_1*/ ctx[10]), false, true, false, false),
					listen_dev(a1, "click", prevent_default(/*click_handler_2*/ ctx[11]), false, true, false, false),
					listen_dev(a2, "click", prevent_default(/*click_handler_3*/ ctx[12]), false, true, false, false),
					listen_dev(a3, "click", prevent_default(/*click_handler_4*/ ctx[13]), false, true, false, false),
					listen_dev(a4, "click", prevent_default(/*click_handler_5*/ ctx[14]), false, true, false, false),
					listen_dev(button0, "click", /*click_handler_6*/ ctx[15], false, false, false, false),
					listen_dev(button1, "click", /*click_handler_7*/ ctx[16], false, false, false, false),
					listen_dev(button2, "click", /*toggleMobileMenu*/ ctx[6], false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$currentLang*/ 16 && t1_value !== (t1_value = t('nav.home', /*$currentLang*/ ctx[4]) + "")) set_data_dev(t1, t1_value);

			if (dirty & /*currentPage*/ 2) {
				toggle_class(li0, "active", /*currentPage*/ ctx[1] === 'home');
			}

			if (dirty & /*$currentLang*/ 16 && t3_value !== (t3_value = t('nav.booking', /*$currentLang*/ ctx[4]) + "")) set_data_dev(t3, t3_value);

			if (dirty & /*currentPage*/ 2) {
				toggle_class(li1, "active", /*currentPage*/ ctx[1] === 'booking');
			}

			if (dirty & /*$currentLang*/ 16 && t5_value !== (t5_value = t('nav.about', /*$currentLang*/ ctx[4]) + "")) set_data_dev(t5, t5_value);

			if (dirty & /*currentPage*/ 2) {
				toggle_class(li2, "active", /*currentPage*/ ctx[1] === 'about');
			}

			if (dirty & /*$currentLang*/ 16 && t7_value !== (t7_value = t('nav.services', /*$currentLang*/ ctx[4]) + "")) set_data_dev(t7, t7_value);

			if (dirty & /*currentPage*/ 2) {
				toggle_class(li3, "active", /*currentPage*/ ctx[1] === 'services');
			}

			if (dirty & /*$currentLang*/ 16 && t9_value !== (t9_value = t('nav.contact', /*$currentLang*/ ctx[4]) + "")) set_data_dev(t9, t9_value);

			if (dirty & /*currentPage*/ 2) {
				toggle_class(li4, "active", /*currentPage*/ ctx[1] === 'contact');
			}

			if (dirty & /*mobileMenuOpen*/ 8) {
				toggle_class(nav, "open", /*mobileMenuOpen*/ ctx[3]);
			}

			if (dirty & /*mobileMenuOpen*/ 8) {
				attr_dev(button2, "aria-expanded", /*mobileMenuOpen*/ ctx[3]);
			}

			if (dirty & /*mobileMenuOpen*/ 8) {
				toggle_class(button2, "open", /*mobileMenuOpen*/ ctx[3]);
			}

			if (dirty & /*scrolled*/ 4) {
				toggle_class(header, "scrolled", /*scrolled*/ ctx[2]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(header);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	let $currentLang;
	validate_store(currentLang, 'currentLang');
	component_subscribe($$self, currentLang, $$value => $$invalidate(4, $currentLang = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Header', slots, []);
	let { navigate } = $$props;
	let { currentPage } = $$props;
	let scrolled = false;
	let mobileMenuOpen = false;
	let lang;

	// Subscribe to language changes
	currentLang.subscribe(value => {
		lang = value;
	});

	// Function to toggle language based on the clicked element
	function toggleLanguage(selectedLang) {
		currentLang.set(selectedLang);
	}

	function toggleMobileMenu() {
		$$invalidate(3, mobileMenuOpen = !mobileMenuOpen);

		// Prevent body scrolling when menu is open
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function handleNavClick(page) {
		navigate(page);
		$$invalidate(3, mobileMenuOpen = false);
		document.body.style.overflow = '';
	}

	function handleLogoKeydown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			navigate('home');
		}
	}

	onMount(() => {
		const handleScroll = () => {
			$$invalidate(2, scrolled = window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);

		// Handle ESC key to close mobile menu
		const handleKeydown = e => {
			if (e.key === 'Escape' && mobileMenuOpen) {
				$$invalidate(3, mobileMenuOpen = false);
				document.body.style.overflow = '';
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	$$self.$$.on_mount.push(function () {
		if (navigate === undefined && !('navigate' in $$props || $$self.$$.bound[$$self.$$.props['navigate']])) {
			console.warn("<Header> was created without expected prop 'navigate'");
		}

		if (currentPage === undefined && !('currentPage' in $$props || $$self.$$.bound[$$self.$$.props['currentPage']])) {
			console.warn("<Header> was created without expected prop 'currentPage'");
		}
	});

	const writable_props = ['navigate', 'currentPage'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
	});

	const click_handler = () => navigate('home');
	const click_handler_1 = () => handleNavClick('home');
	const click_handler_2 = () => handleNavClick('booking');
	const click_handler_3 = () => handleNavClick('about');
	const click_handler_4 = () => handleNavClick('services');
	const click_handler_5 = () => handleNavClick('contact');
	const click_handler_6 = () => toggleLanguage('hu');
	const click_handler_7 = () => toggleLanguage('en');

	$$self.$$set = $$props => {
		if ('navigate' in $$props) $$invalidate(0, navigate = $$props.navigate);
		if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
	};

	$$self.$capture_state = () => ({
		currentLang,
		t,
		onMount,
		navigate,
		currentPage,
		scrolled,
		mobileMenuOpen,
		lang,
		toggleLanguage,
		toggleMobileMenu,
		handleNavClick,
		handleLogoKeydown,
		$currentLang
	});

	$$self.$inject_state = $$props => {
		if ('navigate' in $$props) $$invalidate(0, navigate = $$props.navigate);
		if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
		if ('scrolled' in $$props) $$invalidate(2, scrolled = $$props.scrolled);
		if ('mobileMenuOpen' in $$props) $$invalidate(3, mobileMenuOpen = $$props.mobileMenuOpen);
		if ('lang' in $$props) lang = $$props.lang;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		navigate,
		currentPage,
		scrolled,
		mobileMenuOpen,
		$currentLang,
		toggleLanguage,
		toggleMobileMenu,
		handleNavClick,
		handleLogoKeydown,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		click_handler_6,
		click_handler_7
	];
}

class Header extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { navigate: 0, currentPage: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Header",
			options,
			id: create_fragment$2.name
		});
	}

	get navigate() {
		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set navigate(value) {
		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get currentPage() {
		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set currentPage(value) {
		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/components/Footer.svelte generated by Svelte v3.59.2 */
const file$1 = "src/components/Footer.svelte";

function create_fragment$1(ctx) {
	let footer;
	let div9;
	let div8;
	let div7;
	let div3;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let div1;
	let h30;
	let t1_value = t('footer.visit', /*$currentLang*/ ctx[2]) + "";
	let t1;
	let t2;
	let p0;
	let t3_value = t('footer.address', /*$currentLang*/ ctx[2]) + "";
	let t3;
	let t4;
	let p1;
	let strong0;
	let t5_value = t('footer.phone', /*$currentLang*/ ctx[2]) + "";
	let t5;
	let t6;
	let t7;
	let a0;
	let t8_value = t('footer.phoneNumber', /*$currentLang*/ ctx[2]) + "";
	let t8;
	let t9;
	let p2;
	let strong1;
	let t10_value = t('footer.email', /*$currentLang*/ ctx[2]) + "";
	let t10;
	let t11;
	let t12;
	let a1;
	let t13_value = t('footer.emailAddress', /*$currentLang*/ ctx[2]) + "";
	let t13;
	let t14;
	let div2;
	let a2;
	let svg0;
	let path0;
	let t15;
	let a3;
	let svg1;
	let path1;
	let t16;
	let div4;
	let h31;
	let t17_value = t('footer.links', /*$currentLang*/ ctx[2]) + "";
	let t17;
	let t18;
	let ul;
	let li0;
	let a4;
	let t19_value = t('nav.home', /*$currentLang*/ ctx[2]) + "";
	let t19;
	let t20;
	let li1;
	let a5;
	let t21_value = t('nav.booking', /*$currentLang*/ ctx[2]) + "";
	let t21;
	let t22;
	let li2;
	let a6;
	let t23_value = t('nav.about', /*$currentLang*/ ctx[2]) + "";
	let t23;
	let t24;
	let li3;
	let a7;
	let t25_value = t('nav.services', /*$currentLang*/ ctx[2]) + "";
	let t25;
	let t26;
	let li4;
	let a8;
	let t27_value = t('nav.contact', /*$currentLang*/ ctx[2]) + "";
	let t27;
	let t28;
	let div6;
	let div5;
	let iframe;
	let iframe_src_value;
	let t29;
	let button0;

	let t30_value = (/*$currentLang*/ ctx[2] === 'hu'
	? 'Útvonaltervezés'
	: 'Get Directions') + "";

	let t30;
	let t31;
	let svg2;
	let path2;
	let t32;
	let div11;
	let div10;
	let p3;
	let t33_value = t('footer.copyright', /*$currentLang*/ ctx[2]) + "";
	let t33;
	let t34;
	let a9;

	let t35_value = (/*$currentLang*/ ctx[2] === 'hu'
	? 'Adatvédelmi irányelvek'
	: 'Privacy Policy') + "";

	let t35;
	let t36;
	let button1;
	let svg3;
	let path3;
	let button1_aria_label_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			footer = element("footer");
			div9 = element("div");
			div8 = element("div");
			div7 = element("div");
			div3 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div1 = element("div");
			h30 = element("h3");
			t1 = text(t1_value);
			t2 = space();
			p0 = element("p");
			t3 = text(t3_value);
			t4 = space();
			p1 = element("p");
			strong0 = element("strong");
			t5 = text(t5_value);
			t6 = text(":");
			t7 = space();
			a0 = element("a");
			t8 = text(t8_value);
			t9 = space();
			p2 = element("p");
			strong1 = element("strong");
			t10 = text(t10_value);
			t11 = text(":");
			t12 = space();
			a1 = element("a");
			t13 = text(t13_value);
			t14 = space();
			div2 = element("div");
			a2 = element("a");
			svg0 = svg_element("svg");
			path0 = svg_element("path");
			t15 = space();
			a3 = element("a");
			svg1 = svg_element("svg");
			path1 = svg_element("path");
			t16 = space();
			div4 = element("div");
			h31 = element("h3");
			t17 = text(t17_value);
			t18 = space();
			ul = element("ul");
			li0 = element("li");
			a4 = element("a");
			t19 = text(t19_value);
			t20 = space();
			li1 = element("li");
			a5 = element("a");
			t21 = text(t21_value);
			t22 = space();
			li2 = element("li");
			a6 = element("a");
			t23 = text(t23_value);
			t24 = space();
			li3 = element("li");
			a7 = element("a");
			t25 = text(t25_value);
			t26 = space();
			li4 = element("li");
			a8 = element("a");
			t27 = text(t27_value);
			t28 = space();
			div6 = element("div");
			div5 = element("div");
			iframe = element("iframe");
			t29 = space();
			button0 = element("button");
			t30 = text(t30_value);
			t31 = space();
			svg2 = svg_element("svg");
			path2 = svg_element("path");
			t32 = space();
			div11 = element("div");
			div10 = element("div");
			p3 = element("p");
			t33 = text(t33_value);
			t34 = space();
			a9 = element("a");
			t35 = text(t35_value);
			t36 = space();
			button1 = element("button");
			svg3 = svg_element("svg");
			path3 = svg_element("path");
			if (!src_url_equal(img.src, img_src_value = "images/zima-logo.avif")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Zima Auto");
			attr_dev(img, "class", "svelte-1g4tmm5");
			add_location(img, file$1, 49, 12, 1404);
			attr_dev(div0, "class", "footer-logo svelte-1g4tmm5");
			add_location(div0, file$1, 48, 10, 1366);
			attr_dev(h30, "class", "svelte-1g4tmm5");
			add_location(h30, file$1, 52, 12, 1522);
			attr_dev(p0, "class", "address svelte-1g4tmm5");
			add_location(p0, file$1, 53, 12, 1577);
			add_location(strong0, file$1, 54, 15, 1651);
			attr_dev(a0, "href", "tel:+36705550588");
			attr_dev(a0, "class", "contact-link svelte-1g4tmm5");
			add_location(a0, file$1, 54, 67, 1703);
			attr_dev(p1, "class", "svelte-1g4tmm5");
			add_location(p1, file$1, 54, 12, 1648);
			add_location(strong1, file$1, 55, 15, 1814);
			attr_dev(a1, "href", "mailto:info@zima-auto.com");
			attr_dev(a1, "class", "contact-link svelte-1g4tmm5");
			add_location(a1, file$1, 55, 67, 1866);
			attr_dev(p2, "class", "svelte-1g4tmm5");
			add_location(p2, file$1, 55, 12, 1811);
			attr_dev(div1, "class", "contact-info svelte-1g4tmm5");
			add_location(div1, file$1, 51, 10, 1483);
			attr_dev(path0, "d", "M12 2.04001C6.5 2.04001 2 6.53001 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85001C10.44 7.34001 11.93 5.96001 14.22 5.96001C15.31 5.96001 16.45 6.15001 16.45 6.15001V8.62001H15.19C13.95 8.62001 13.56 9.39001 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5879 18.0622 20.3855 19.6099 18.5701C21.1576 16.7546 22.0054 14.4457 22 12.06C22 6.53001 17.5 2.04001 12 2.04001Z");
			attr_dev(path0, "fill", "currentColor");
			add_location(path0, file$1, 60, 16, 2307);
			attr_dev(svg0, "width", "20");
			attr_dev(svg0, "height", "20");
			attr_dev(svg0, "viewBox", "0 0 24 24");
			attr_dev(svg0, "fill", "none");
			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg0, file$1, 59, 14, 2195);
			attr_dev(a2, "href", "https://www.facebook.com/people/Zima-Aut%C3%B3/61558143560827/?_rdr");
			attr_dev(a2, "target", "_blank");
			attr_dev(a2, "rel", "noopener noreferrer");
			attr_dev(a2, "aria-label", "Facebook");
			attr_dev(a2, "class", "svelte-1g4tmm5");
			add_location(a2, file$1, 58, 12, 2038);
			attr_dev(path1, "d", "M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z");
			attr_dev(path1, "fill", "currentColor");
			add_location(path1, file$1, 65, 16, 3030);
			attr_dev(svg1, "width", "20");
			attr_dev(svg1, "height", "20");
			attr_dev(svg1, "viewBox", "0 0 24 24");
			attr_dev(svg1, "fill", "none");
			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
			add_location(svg1, file$1, 64, 14, 2918);
			attr_dev(a3, "href", "https://www.instagram.com/zima_auto/");
			attr_dev(a3, "target", "_blank");
			attr_dev(a3, "rel", "noopener noreferrer");
			attr_dev(a3, "aria-label", "Instagram");
			attr_dev(a3, "class", "svelte-1g4tmm5");
			add_location(a3, file$1, 63, 12, 2791);
			attr_dev(div2, "class", "social-links svelte-1g4tmm5");
			add_location(div2, file$1, 57, 10, 1999);
			attr_dev(div3, "class", "footer-info");
			add_location(div3, file$1, 47, 8, 1330);
			attr_dev(h31, "class", "svelte-1g4tmm5");
			add_location(h31, file$1, 72, 10, 5003);
			attr_dev(a4, "href", "#home");
			attr_dev(a4, "class", "svelte-1g4tmm5");
			add_location(a4, file$1, 75, 14, 5092);
			attr_dev(li0, "class", "svelte-1g4tmm5");
			add_location(li0, file$1, 74, 12, 5073);
			attr_dev(a5, "href", "#booking");
			attr_dev(a5, "class", "svelte-1g4tmm5");
			add_location(a5, file$1, 80, 14, 5272);
			attr_dev(li1, "class", "svelte-1g4tmm5");
			add_location(li1, file$1, 79, 12, 5253);
			attr_dev(a6, "href", "#about");
			attr_dev(a6, "class", "svelte-1g4tmm5");
			add_location(a6, file$1, 85, 14, 5461);
			attr_dev(li2, "class", "svelte-1g4tmm5");
			add_location(li2, file$1, 84, 12, 5442);
			attr_dev(a7, "href", "#services");
			attr_dev(a7, "class", "svelte-1g4tmm5");
			add_location(a7, file$1, 90, 14, 5644);
			attr_dev(li3, "class", "svelte-1g4tmm5");
			add_location(li3, file$1, 89, 12, 5625);
			attr_dev(a8, "href", "#contact");
			attr_dev(a8, "class", "svelte-1g4tmm5");
			add_location(a8, file$1, 95, 14, 5836);
			attr_dev(li4, "class", "svelte-1g4tmm5");
			add_location(li4, file$1, 94, 12, 5817);
			attr_dev(ul, "class", "svelte-1g4tmm5");
			add_location(ul, file$1, 73, 10, 5056);
			attr_dev(div4, "class", "footer-links svelte-1g4tmm5");
			add_location(div4, file$1, 71, 8, 4966);
			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2700.102580768995!2d19.230113876877105!3d47.40994027117247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741c1ece824d30f%3A0x632898beef8d5983!2sZima%20Auto%20Airport%20Parking%20-%20Aut%C3%B3szerv%C3%ADz%20-%20Gumiszerv%C3%ADz%20-%20K%C3%A9zi%20aut%C3%B3mos%C3%B3!5e0!3m2!1sen!2shu!4v1745609320883!5m2!1sen!2shu")) attr_dev(iframe, "src", iframe_src_value);
			attr_dev(iframe, "width", "100%");
			attr_dev(iframe, "height", "100%");
			set_style(iframe, "border", "0");
			iframe.allowFullscreen = "";
			attr_dev(iframe, "loading", "lazy");
			attr_dev(iframe, "referrerpolicy", "no-referrer-when-downgrade");
			attr_dev(iframe, "title", "Zima Auto location");
			attr_dev(iframe, "class", "svelte-1g4tmm5");
			add_location(iframe, file$1, 104, 12, 6109);
			attr_dev(path2, "d", "M9 18l6-6-6-6");
			add_location(path2, file$1, 120, 16, 7192);
			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg2, "width", "16");
			attr_dev(svg2, "height", "16");
			attr_dev(svg2, "viewBox", "0 0 24 24");
			attr_dev(svg2, "fill", "none");
			attr_dev(svg2, "stroke", "currentColor");
			attr_dev(svg2, "stroke-width", "2");
			attr_dev(svg2, "stroke-linecap", "round");
			attr_dev(svg2, "stroke-linejoin", "round");
			add_location(svg2, file$1, 119, 14, 6994);
			attr_dev(button0, "class", "directions-link svelte-1g4tmm5");
			add_location(button0, file$1, 114, 12, 6793);
			attr_dev(div5, "class", "map-container svelte-1g4tmm5");
			add_location(div5, file$1, 103, 10, 6069);
			attr_dev(div6, "class", "footer-map svelte-1g4tmm5");
			add_location(div6, file$1, 102, 8, 6034);
			attr_dev(div7, "class", "footer-grid svelte-1g4tmm5");
			add_location(div7, file$1, 46, 6, 1296);
			attr_dev(div8, "class", "container");
			add_location(div8, file$1, 45, 4, 1266);
			attr_dev(div9, "class", "footer-top svelte-1g4tmm5");
			add_location(div9, file$1, 44, 2, 1237);
			attr_dev(p3, "class", "svelte-1g4tmm5");
			add_location(p3, file$1, 131, 6, 7391);
			attr_dev(a9, "href", "/#privacy");
			attr_dev(a9, "class", "privacy-link svelte-1g4tmm5");
			add_location(a9, file$1, 132, 6, 7442);
			attr_dev(div10, "class", "container svelte-1g4tmm5");
			add_location(div10, file$1, 130, 4, 7361);
			attr_dev(div11, "class", "footer-bottom svelte-1g4tmm5");
			add_location(div11, file$1, 129, 2, 7329);
			attr_dev(path3, "d", "M18 15l-6-6-6 6");
			add_location(path3, file$1, 145, 6, 7962);
			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg3, "width", "24");
			attr_dev(svg3, "height", "24");
			attr_dev(svg3, "viewBox", "0 0 24 24");
			attr_dev(svg3, "fill", "none");
			attr_dev(svg3, "stroke", "currentColor");
			attr_dev(svg3, "stroke-width", "2");
			attr_dev(svg3, "stroke-linecap", "round");
			attr_dev(svg3, "stroke-linejoin", "round");
			add_location(svg3, file$1, 144, 4, 7774);
			attr_dev(button1, "class", "back-to-top svelte-1g4tmm5");

			attr_dev(button1, "aria-label", button1_aria_label_value = /*$currentLang*/ ctx[2] === 'hu'
			? 'Vissza a tetejére'
			: 'Back to top');

			toggle_class(button1, "visible", /*showBackToTop*/ ctx[1]);
			add_location(button1, file$1, 138, 2, 7596);
			attr_dev(footer, "class", "svelte-1g4tmm5");
			add_location(footer, file$1, 43, 0, 1226);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, footer, anchor);
			append_dev(footer, div9);
			append_dev(div9, div8);
			append_dev(div8, div7);
			append_dev(div7, div3);
			append_dev(div3, div0);
			append_dev(div0, img);
			append_dev(div3, t0);
			append_dev(div3, div1);
			append_dev(div1, h30);
			append_dev(h30, t1);
			append_dev(div1, t2);
			append_dev(div1, p0);
			append_dev(p0, t3);
			append_dev(div1, t4);
			append_dev(div1, p1);
			append_dev(p1, strong0);
			append_dev(strong0, t5);
			append_dev(strong0, t6);
			append_dev(p1, t7);
			append_dev(p1, a0);
			append_dev(a0, t8);
			append_dev(div1, t9);
			append_dev(div1, p2);
			append_dev(p2, strong1);
			append_dev(strong1, t10);
			append_dev(strong1, t11);
			append_dev(p2, t12);
			append_dev(p2, a1);
			append_dev(a1, t13);
			append_dev(div3, t14);
			append_dev(div3, div2);
			append_dev(div2, a2);
			append_dev(a2, svg0);
			append_dev(svg0, path0);
			append_dev(div2, t15);
			append_dev(div2, a3);
			append_dev(a3, svg1);
			append_dev(svg1, path1);
			append_dev(div7, t16);
			append_dev(div7, div4);
			append_dev(div4, h31);
			append_dev(h31, t17);
			append_dev(div4, t18);
			append_dev(div4, ul);
			append_dev(ul, li0);
			append_dev(li0, a4);
			append_dev(a4, t19);
			append_dev(ul, t20);
			append_dev(ul, li1);
			append_dev(li1, a5);
			append_dev(a5, t21);
			append_dev(ul, t22);
			append_dev(ul, li2);
			append_dev(li2, a6);
			append_dev(a6, t23);
			append_dev(ul, t24);
			append_dev(ul, li3);
			append_dev(li3, a7);
			append_dev(a7, t25);
			append_dev(ul, t26);
			append_dev(ul, li4);
			append_dev(li4, a8);
			append_dev(a8, t27);
			append_dev(div7, t28);
			append_dev(div7, div6);
			append_dev(div6, div5);
			append_dev(div5, iframe);
			append_dev(div5, t29);
			append_dev(div5, button0);
			append_dev(button0, t30);
			append_dev(button0, t31);
			append_dev(button0, svg2);
			append_dev(svg2, path2);
			append_dev(footer, t32);
			append_dev(footer, div11);
			append_dev(div11, div10);
			append_dev(div10, p3);
			append_dev(p3, t33);
			append_dev(div10, t34);
			append_dev(div10, a9);
			append_dev(a9, t35);
			append_dev(footer, t36);
			append_dev(footer, button1);
			append_dev(button1, svg3);
			append_dev(svg3, path3);

			if (!mounted) {
				dispose = [
					listen_dev(a4, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false, false),
					listen_dev(a5, "click", prevent_default(/*click_handler_1*/ ctx[4]), false, true, false, false),
					listen_dev(a6, "click", prevent_default(/*click_handler_2*/ ctx[5]), false, true, false, false),
					listen_dev(a7, "click", prevent_default(/*click_handler_3*/ ctx[6]), false, true, false, false),
					listen_dev(a8, "click", prevent_default(/*click_handler_4*/ ctx[7]), false, true, false, false),
					listen_dev(button0, "click", openGoogleMapsDirections, false, false, false, false),
					listen_dev(button1, "click", scrollToTop, false, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (dirty & /*$currentLang*/ 4 && t1_value !== (t1_value = t('footer.visit', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t1, t1_value);
			if (dirty & /*$currentLang*/ 4 && t3_value !== (t3_value = t('footer.address', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t3, t3_value);
			if (dirty & /*$currentLang*/ 4 && t5_value !== (t5_value = t('footer.phone', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t5, t5_value);
			if (dirty & /*$currentLang*/ 4 && t8_value !== (t8_value = t('footer.phoneNumber', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t8, t8_value);
			if (dirty & /*$currentLang*/ 4 && t10_value !== (t10_value = t('footer.email', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t10, t10_value);
			if (dirty & /*$currentLang*/ 4 && t13_value !== (t13_value = t('footer.emailAddress', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t13, t13_value);
			if (dirty & /*$currentLang*/ 4 && t17_value !== (t17_value = t('footer.links', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t17, t17_value);
			if (dirty & /*$currentLang*/ 4 && t19_value !== (t19_value = t('nav.home', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t19, t19_value);
			if (dirty & /*$currentLang*/ 4 && t21_value !== (t21_value = t('nav.booking', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t21, t21_value);
			if (dirty & /*$currentLang*/ 4 && t23_value !== (t23_value = t('nav.about', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t23, t23_value);
			if (dirty & /*$currentLang*/ 4 && t25_value !== (t25_value = t('nav.services', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t25, t25_value);
			if (dirty & /*$currentLang*/ 4 && t27_value !== (t27_value = t('nav.contact', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t27, t27_value);

			if (dirty & /*$currentLang*/ 4 && t30_value !== (t30_value = (/*$currentLang*/ ctx[2] === 'hu'
			? 'Útvonaltervezés'
			: 'Get Directions') + "")) set_data_dev(t30, t30_value);

			if (dirty & /*$currentLang*/ 4 && t33_value !== (t33_value = t('footer.copyright', /*$currentLang*/ ctx[2]) + "")) set_data_dev(t33, t33_value);

			if (dirty & /*$currentLang*/ 4 && t35_value !== (t35_value = (/*$currentLang*/ ctx[2] === 'hu'
			? 'Adatvédelmi irányelvek'
			: 'Privacy Policy') + "")) set_data_dev(t35, t35_value);

			if (dirty & /*$currentLang*/ 4 && button1_aria_label_value !== (button1_aria_label_value = /*$currentLang*/ ctx[2] === 'hu'
			? 'Vissza a tetejére'
			: 'Back to top')) {
				attr_dev(button1, "aria-label", button1_aria_label_value);
			}

			if (dirty & /*showBackToTop*/ 2) {
				toggle_class(button1, "visible", /*showBackToTop*/ ctx[1]);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(footer);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to open Google Maps directions to Zima Auto
function openGoogleMapsDirections() {
	// Updated URL based on user feedback
	window.open('https://www.google.com/maps/place/Zima+Auto+Airport+Parking+-+Aut%C3%B3szerv%C3%ADz+-+Gumiszerv%C3%ADz+-+K%C3%A9zi+aut%C3%B3mos%C3%B3/@47.4099403,19.2301139,17z/data=!3m1!4b1!4m6!3m5!1s0x4741c1ece824d30f:0x632898beef8d5983!8m2!3d47.4099403!4d19.2326888!16s%2Fg%2F11vyx0730g?entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoASAFQAw%3D%3D', '_blank');
}

function instance$1($$self, $$props, $$invalidate) {
	let $currentLang;
	validate_store(currentLang, 'currentLang');
	component_subscribe($$self, currentLang, $$value => $$invalidate(2, $currentLang = $$value));
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Footer', slots, []);
	let { navigate } = $$props;
	let lang;
	let showBackToTop = false;

	// showDirectionsPopup and related functions are removed
	// as we are now directly linking to Google Maps
	// Subscribe to language changes
	currentLang.subscribe(value => {
		lang = value;
	});

	onMount(() => {
		const handleScroll = () => {
			$$invalidate(1, showBackToTop = window.scrollY > 300);
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	$$self.$$.on_mount.push(function () {
		if (navigate === undefined && !('navigate' in $$props || $$self.$$.bound[$$self.$$.props['navigate']])) {
			console.warn("<Footer> was created without expected prop 'navigate'");
		}
	});

	const writable_props = ['navigate'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
	});

	const click_handler = () => navigate('home');
	const click_handler_1 = () => navigate('booking');
	const click_handler_2 = () => navigate('about');
	const click_handler_3 = () => navigate('services');
	const click_handler_4 = () => navigate('contact');

	$$self.$$set = $$props => {
		if ('navigate' in $$props) $$invalidate(0, navigate = $$props.navigate);
	};

	$$self.$capture_state = () => ({
		currentLang,
		t,
		onMount,
		navigate,
		lang,
		showBackToTop,
		scrollToTop,
		openGoogleMapsDirections,
		$currentLang
	});

	$$self.$inject_state = $$props => {
		if ('navigate' in $$props) $$invalidate(0, navigate = $$props.navigate);
		if ('lang' in $$props) lang = $$props.lang;
		if ('showBackToTop' in $$props) $$invalidate(1, showBackToTop = $$props.showBackToTop);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		navigate,
		showBackToTop,
		$currentLang,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4
	];
}

class Footer extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { navigate: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Footer",
			options,
			id: create_fragment$1.name
		});
	}

	get navigate() {
		throw new Error("<Footer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set navigate(value) {
		throw new Error("<Footer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/App.svelte generated by Svelte v3.59.2 */

const { console: console_1 } = globals;
const file = "src/App.svelte";

// (197:27) 
function create_if_block_1(ctx) {
	let div;
	let h1;
	let t1;
	let p;
	let t3;
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			h1 = element("h1");
			h1.textContent = "Error Loading Page";
			t1 = space();
			p = element("p");
			p.textContent = "Could not load the requested page. Please try again.";
			t3 = space();
			button = element("button");
			button.textContent = "Go to Home";
			attr_dev(h1, "class", "svelte-7u2ys8");
			add_location(h1, file, 198, 8, 7832);
			attr_dev(p, "class", "svelte-7u2ys8");
			add_location(p, file, 199, 8, 7868);
			attr_dev(button, "class", "svelte-7u2ys8");
			add_location(button, file, 200, 8, 7936);
			attr_dev(div, "class", "error-container svelte-7u2ys8");
			add_location(div, file, 197, 6, 7794);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, h1);
			append_dev(div, t1);
			append_dev(div, p);
			append_dev(div, t3);
			append_dev(div, button);

			if (!mounted) {
				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false, false);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(197:27) ",
		ctx
	});

	return block;
}

// (195:4) {#if LoadedPage}
function create_if_block(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = /*LoadedPage*/ ctx[0];

	function switch_props(ctx) {
		return {
			props: {
				navigate: /*navigate*/ ctx[5],
				lang: /*lang*/ ctx[4]
			},
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) mount_component(switch_instance, target, anchor);
			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = {};
			if (dirty & /*lang*/ 16) switch_instance_changes.lang = /*lang*/ ctx[4];

			if (dirty & /*LoadedPage*/ 1 && switch_value !== (switch_value = /*LoadedPage*/ ctx[0])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(195:4) {#if LoadedPage}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div3;
	let div2;
	let div0;
	let img;
	let img_src_value;
	let t0;
	let div1;
	let t1;
	let header;
	let t2;
	let main;
	let current_block_type_index;
	let if_block;
	let t3;
	let footer;
	let t4;
	let cookieconsent;
	let t5;
	let discountpopup;
	let div3_class_value;
	let current;

	header = new Header({
			props: {
				navigate: /*navigate*/ ctx[5],
				currentPage: /*currentPage*/ ctx[1],
				lang: /*lang*/ ctx[4]
			},
			$$inline: true
		});

	const if_block_creators = [create_if_block, create_if_block_1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*LoadedPage*/ ctx[0]) return 0;
		if (!/*pageLoading*/ ctx[2]) return 1;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	footer = new Footer({
			props: {
				navigate: /*navigate*/ ctx[5],
				lang: /*lang*/ ctx[4]
			},
			$$inline: true
		});

	cookieconsent = new CookieConsent({
			props: { lang: /*lang*/ ctx[4] },
			$$inline: true
		});

	discountpopup = new DiscountPopup({
			props: { lang: /*lang*/ ctx[4] },
			$$inline: true
		});

	const block = {
		c: function create() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			img = element("img");
			t0 = space();
			div1 = element("div");
			t1 = space();
			create_component(header.$$.fragment);
			t2 = space();
			main = element("main");
			if (if_block) if_block.c();
			t3 = space();
			create_component(footer.$$.fragment);
			t4 = space();
			create_component(cookieconsent.$$.fragment);
			t5 = space();
			create_component(discountpopup.$$.fragment);
			if (!src_url_equal(img.src, img_src_value = "images/logo.svg")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "Zima Auto");
			attr_dev(img, "class", "svelte-7u2ys8");
			add_location(img, file, 186, 6, 7520);
			attr_dev(div0, "class", "logo-container svelte-7u2ys8");
			add_location(div0, file, 185, 4, 7485);
			attr_dev(div1, "class", "spinner svelte-7u2ys8");
			add_location(div1, file, 188, 4, 7581);
			attr_dev(div2, "class", "loader svelte-7u2ys8");
			toggle_class(div2, "hidden", !/*pageLoading*/ ctx[2]);
			add_location(div2, file, 184, 2, 7432);
			attr_dev(main, "class", "svelte-7u2ys8");
			add_location(main, file, 193, 2, 7667);
			attr_dev(div3, "class", div3_class_value = "app-container " + (/*pageLoading*/ ctx[2] ? 'loading' : '') + " " + (/*pageTransition*/ ctx[3] ? 'page-transition' : '') + " svelte-7u2ys8");
			add_location(div3, file, 183, 0, 7329);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div3, anchor);
			append_dev(div3, div2);
			append_dev(div2, div0);
			append_dev(div0, img);
			append_dev(div2, t0);
			append_dev(div2, div1);
			append_dev(div3, t1);
			mount_component(header, div3, null);
			append_dev(div3, t2);
			append_dev(div3, main);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(main, null);
			}

			append_dev(div3, t3);
			mount_component(footer, div3, null);
			append_dev(div3, t4);
			mount_component(cookieconsent, div3, null);
			append_dev(div3, t5);
			mount_component(discountpopup, div3, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*pageLoading*/ 4) {
				toggle_class(div2, "hidden", !/*pageLoading*/ ctx[2]);
			}

			const header_changes = {};
			if (dirty & /*currentPage*/ 2) header_changes.currentPage = /*currentPage*/ ctx[1];
			if (dirty & /*lang*/ 16) header_changes.lang = /*lang*/ ctx[4];
			header.$set(header_changes);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(main, null);
				} else {
					if_block = null;
				}
			}

			const footer_changes = {};
			if (dirty & /*lang*/ 16) footer_changes.lang = /*lang*/ ctx[4];
			footer.$set(footer_changes);
			const cookieconsent_changes = {};
			if (dirty & /*lang*/ 16) cookieconsent_changes.lang = /*lang*/ ctx[4];
			cookieconsent.$set(cookieconsent_changes);
			const discountpopup_changes = {};
			if (dirty & /*lang*/ 16) discountpopup_changes.lang = /*lang*/ ctx[4];
			discountpopup.$set(discountpopup_changes);

			if (!current || dirty & /*pageLoading, pageTransition*/ 12 && div3_class_value !== (div3_class_value = "app-container " + (/*pageLoading*/ ctx[2] ? 'loading' : '') + " " + (/*pageTransition*/ ctx[3] ? 'page-transition' : '') + " svelte-7u2ys8")) {
				attr_dev(div3, "class", div3_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(header.$$.fragment, local);
			transition_in(if_block);
			transition_in(footer.$$.fragment, local);
			transition_in(cookieconsent.$$.fragment, local);
			transition_in(discountpopup.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(header.$$.fragment, local);
			transition_out(if_block);
			transition_out(footer.$$.fragment, local);
			transition_out(cookieconsent.$$.fragment, local);
			transition_out(discountpopup.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div3);
			destroy_component(header);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}

			destroy_component(footer);
			destroy_component(cookieconsent);
			destroy_component(discountpopup);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('App', slots, []);

	const pages = {
		home: () => import('./Home-1e5e68d1.js'),
		about: () => import('./About-571c940e.js'),
		services: () => import('./Services-263ef65f.js'),
		contact: () => import('./Contact-895a6315.js'),
		booking: () => import('./Booking-09324cac.js'),
		privacy: () => import('./Privacy-7f4efcb5.js')
	};

	// Use a state variable to hold the loaded page component
	let LoadedPage = null;

	let currentPage = 'home'; // Default to home
	let pageLoading = true;
	let pageTransition = false;
	let lang = 'hu'; // Local state for current language

	// Subscribe to language changes
	currentLang.subscribe(value => {
		$$invalidate(4, lang = value);
	});

	// Function to load and set the current page component
	async function loadPage(pageName) {
		if (!pages[pageName]) {
			console.error(`Page component for "${pageName}" not found.`);

			// Handle unknown page, maybe navigate to a 404 or home
			pageName = 'home'; // Fallback to home
		}

		// Set loading and transition states
		$$invalidate(3, pageTransition = true); // Start fade out/move transition

		// Use a slight delay to allow transition to be visible before changing page
		setTimeout(
			async () => {
				try {
					const module = await pages[pageName]();
					$$invalidate(0, LoadedPage = module.default);
					$$invalidate(1, currentPage = pageName);
					window.scrollTo(0, 0); // Scroll to top on new page
					$$invalidate(2, pageLoading = false); // Hide initial loader once first page is loaded

					// Update URL hash AFTER loading the new page component
					if (window.location.hash.slice(1) !== pageName) {
						window.history.pushState(null, null, `#${pageName}`);
					}
				} catch(error) {
					console.error(`Failed to load page component for "${pageName}":`, error);

					// Handle error loading page component, maybe show an error message
					// For now, fallback to home if a specific page fails to load
					if (pageName !== 'home') {
						loadPage('home');
					} else {
						// If home page itself fails, hide loader and show an error message
						$$invalidate(2, pageLoading = false);

						$$invalidate(0, LoadedPage = null); // Or a specific Error component
					} // Potentially display an error message in the template if LoadedPage is null
				} finally {
					// Remove transition class after page component is rendered
					// A small delay might be needed here too, or rely on CSS transition duration
					setTimeout(
						() => {
							$$invalidate(3, pageTransition = false);
						},
						100
					); // Match or slightly exceed the CSS transition duration
				}
			},
			300
		); // Delay to allow fade out transition
	}

	// Navigate function updated to use loadPage
	function navigate(page) {
		// Prevent navigating to the same page unless it's the initial load trigger
		if (page === currentPage && LoadedPage !== null) {
			// If trying to navigate to the current page *after* it's loaded, do nothing
			return;
		}

		loadPage(page);
	}

	// Check for URL hash/path on initial load and navigate accordingly
	onMount(() => {
		// Don't hide loader immediately, wait for the first page component to load
		// pageLoading remains true here until loadPage completes
		// ALWAYS default to Hungarian language regardless of browser settings
		// Consider letting the user's browser language or a previous preference override this if desired
		currentLang.set('hu');

		localStorage.setItem('zimaAutoLang', 'hu');

		// Handle initial page load with both hash and path support
		const handleInitialRoute = () => {
			const hash = window.location.hash.slice(1);
			const path = window.location.pathname;

			// Map path to pages (adjust as needed based on your server setup)
			const pathToPage = {
				'/': 'home',
				'/booking': 'booking',
				'/about': 'about',
				'/services': 'services',
				'/contact': 'contact',
				'/privacy': 'privacy'
			};

			let targetPage = 'home'; // Default page

			// Prioritize hash if present and valid
			if (hash && pages[hash]) {
				targetPage = hash;
			} else // Otherwise, check if the path maps to a valid page
			if (pathToPage[path] && pages[pathToPage[path]]) {
				targetPage = pathToPage[path];

				// Update URL to use hash for consistency for future navigation
				// Use replaceState to avoid creating a new history entry just for the hash change
				window.history.replaceState(null, null, `#${targetPage}`);
			}

			// If neither hash nor path matches a known page, target remains 'home'
			console.log("Initial page determined:", targetPage);

			// Load the initial page component
			loadPage(targetPage);
		};

		handleInitialRoute(); // Execute initial routing

		// Listen for hash changes triggered by browser history (back/forward) or manual hash links
		// Note: navigate() itself updates the hash, which will NOT trigger 'hashchange'
		window.addEventListener('hashchange', () => {
			const newHash = window.location.hash.slice(1);

			// Only navigate if the hash is valid and different from the current page
			if (pages[newHash] && newHash !== currentPage) {
				console.log("Hash change detected, navigating to:", newHash);
				navigate(newHash);
			} else if (!newHash && currentPage !== 'home') {
				// Handle navigating back to the root path (no hash)
				console.log("Navigating back to root, loading home.");

				navigate('home');
			} else if (newHash && !pages[newHash]) {
				console.warn(`Attempted to navigate to unknown hash: #${newHash}`);

				// Optionally redirect to a 404 page or home
				navigate('home'); // Fallback for unknown hash
			}
		});

		// Clean up hashchange listener on component destroy
		return () => {
			window.removeEventListener('hashchange', () => {
				
			});
		}; // popstate listener is implicitly handled by navigate updating history state
	});

	// Save language preference when it changes
	currentLang.subscribe(value => {
		if (typeof localStorage !== 'undefined' && value) {
			localStorage.setItem('zimaAutoLang', value);
		}
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
	});

	const click_handler = () => navigate('home');

	$$self.$capture_state = () => ({
		onMount,
		currentLang,
		Header,
		Footer,
		pages,
		LoadedPage,
		currentPage,
		pageLoading,
		pageTransition,
		lang,
		loadPage,
		navigate
	});

	$$self.$inject_state = $$props => {
		if ('LoadedPage' in $$props) $$invalidate(0, LoadedPage = $$props.LoadedPage);
		if ('currentPage' in $$props) $$invalidate(1, currentPage = $$props.currentPage);
		if ('pageLoading' in $$props) $$invalidate(2, pageLoading = $$props.pageLoading);
		if ('pageTransition' in $$props) $$invalidate(3, pageTransition = $$props.pageTransition);
		if ('lang' in $$props) $$invalidate(4, lang = $$props.lang);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		LoadedPage,
		currentPage,
		pageLoading,
		pageTransition,
		lang,
		navigate,
		click_handler
	];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment.name
		});
	}
}

// Create the app instance - this is standard Svelte 3/4 instantiation
// that should work during the build process
const app = new App({
  target: document.body
});

// Console logging to verify app loads
console.log('Zima Auto website loaded successfully');

export { bind as $, transition_in as A, group_outros as B, check_outros as C, transition_out as D, destroy_each as E, binding_callbacks as F, create_component as G, mount_component as H, destroy_component as I, onDestroy as J, globals as K, empty as L, bubble as M, stop_propagation as N, add_render_callback as O, create_bidirectional_transition as P, HtmlTag as Q, validate_each_keys as R, SvelteComponentDev as S, update_keyed_each as T, destroy_block as U, set_input_value as V, prevent_default as W, prop_dev as X, toggle_class as Y, createEventDispatcher as Z, afterUpdate as _, space as a, select_option as a0, to_number as a1, add_flush_callback as a2, select_value as a3, init_binding_group as a4, identity as a5, app as a6, svg_element as b, attr_dev as c, dispatch_dev as d, element as e, add_location as f, set_style as g, insert_dev as h, init as i, append_dev as j, is_function as k, listen_dev as l, set_data_dev as m, noop as n, onMount as o, detach_dev as p, src_url_equal as q, run_all as r, safe_not_equal as s, text as t, validate_each_argument as u, validate_slots as v, validate_store as w, component_subscribe as x, currentLang as y, t as z };
//# sourceMappingURL=main-00d1c1b7.js.map
