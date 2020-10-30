const CREARE = 'CREARE';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
const UPDATE = 'UPDATE';
const SET_PROP = 'SET_PROP';
const REMOVE_PROP = 'REMOVE';

//// DIFF

function changed(node1, node2) {
    return typeof node1 !== typeof node2 || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
}

function diffProps(newNode, oldNode) {
    const patches = [];
    const props = Object.assign({}, newNode.props, oldNode.props);
    Object.keys(props).forEach(name => {
        const newVal = newNode.props[name];
        const oldVal = oldNode.props[name];
        if (!newVal) {
            patches.push({ type: REMOVE_PROP, name: name, value: oldVal });
        } else if (!oldVal || oldVal != newVal) {
            patches.push({ type: SET_PROP, name, value: newVal });
        }
    });
    return patches;
}

function diffChildren(newNode, oldNode) {
    const patches = [];
    const len = Math.max(newNode.children.length, oldNode.children.length);
    for (var i = 0; i < len; i++) {
        patches.push(diff(newNode.children[i], oldNode.children[i]));
    }
    console.log(patches);
    return patches;
}

function diff(newNode, oldNode) {
    //@
    if (!oldNode) {
        return { type: CREARE, newNode };
    }
    if (!newNode) {
        return { type: REMOVE };
    }
    if (changed(newNode, oldNode)) {
        return { type: REPLACE, newNode };
    }
    if (newNode.type) {
        return {
            type: UPDATE,
            props: diffProps(newNode, oldNode),
            children: diffChildren(newNode, oldNode)
        };
    }
}

//// PATCH

function createElement(node) {
    //@
    if (typeof node == 'string') {
        return document.createTextNode(node);
    }
    const el = document.createElement(node.type);
    setProps(el, node.props);
    node.children.map(createElement).forEach(el.appendChild.bind(el));
    return el;
}

function setProp(target, name, value) {
    //@
    if (name == 'className') {
        return target.setAttribute('class', value);
    }
    target.setAttribute(name, value);
}

function setProps(target, props) {
    Object.keys(props).forEach(name => {
        setProp(target, name, props[name]);
    });
}

function removeProp(target, name) {
    //@
    if (name == 'className') {
        return target.removeAttribute('class');
    }
    target.removeAttribute(name);
}

function patchProps(parent, patches) {
    for (var i = 0; i < patches.length; i++) {
        const { type, name, value } = patches[i];
        if (type == SET_PROP) {
            setProp(parent, name, value);
        }
        if (type == REMOVE_PROP) {
            removeProp(parent, name);
        }
    }
}

function patch(parent, patches, index = 0) {
    //@
    if (!patches) {
        return;
    }
    var el = parent.childNodes[index];
    switch (patches.type) {
        case CREARE:
            parent.appendChild(createElement(patches.newNode));
            break;
        case REPLACE:
            parent.replaceChild(createElement(patches.newNode), el);
            break;
        case REMOVE:
            parent.removeChild(el);
            break;
        case UPDATE:
            const { props, children } = patches;
            patchProps(el, props);
            for (let i = 0; i < children.length; i++) {
                patch(el, children[i], i);
            }
    }
}

function flatten(arr) {
    return [].concat.apply([], arr);
}

function h(type, props, ...children) {
    props = props || {};
    return { type, props, children: flatten(children) };
}

function view(count) {
    const arr = [...Array(count).keys()];
    if (count == 3) {
        return h(
            'div',
            null,
            'loading...'
        );
    }
    return h(
        'ul',
        { id: 'cool', className: `my-class-${count % 3}` },
        arr.map(item => h(
            'li',
            null,
            'item ',
            count * item + ''
        ))
    );
}

function render(el) {
    el.appendChild(createElement(view(0)));
    setTimeout(() => tick(el, 0), 500);
}

function tick(el, count) {
    const patches = diff(view(count + 1), view(count));
    patch(el, patches);
    console.log(count, patches);
    if (count > 20) {
        return;
    }
    setTimeout(() => tick(el, count + 1), 500);
}
