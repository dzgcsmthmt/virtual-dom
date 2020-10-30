const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
var html = `<div id="app" style="color: red;font-size: 20px;">
                你好，{{name}}
                <input type="checked" checked />  
                <span class="text" style="color:green">{{age}}</span>
            </div>`

function parseHtml(html){

    var stack = [];
    var root = null;
    var currentParent = null;

    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
            let startTagMatch = parseStartTag();
            if(startTagMatch){
                start(startTagMatch.tagName,startTagMatch.attrs);
                if(startTagMatch.unarySlash){
                    end();
                }
                continue;
            }

            let endTagMatch = html.match(endTag); 
            if(endTagMatch){
                advance(endTagMatch[0].length);
                end();
                continue;
            }
        }

        if(textEnd > 0){
            text = html.substring(0,textEnd);
        }
        if(text){
            advance(text.length);
            chars(text);
        }
    }
    console.log(root);
    return root;

    function advance (n) {
        html = html.substring(n);
    }

    function parseStartTag () {
        let start = html.match(startTagOpen);
        let end, attr
        if(start){
            let match = {
                tagName: start[1],
                attrs: {}
            }
            advance(start[0].length)
       
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr);
                advance(attr[0].length)
                match.attrs[attr[1]] = attr[3] || attr[4] || attr[5];
            }

            if(end){
                // console.log(end);
                advance(end[0].length);
                if(end[1]){
                    match.unarySlash = end[1];
                } 
                return match;
            }
        }
    }

    function start (tagName,attrs) {
        // console.log(tagName,attrs);
        let element = createASTElement(tagName,attrs);
        
        if(root == null){
            root = element;
        }

        currentParent = element;
        stack.push(element);

    }

    function end () {
        // console.log('end',tagName);
        let element = stack.pop();
        currentParent = stack[stack.length - 1];
        if(currentParent){
            element.parent = currentParent;
            currentParent.children.push(element);
        }
    }

    function chars(text){
        // console.log(text);
        text = text.trim();
        if(text.length){
            currentParent.children.push({type: 3,text})
        }
    }

    function createASTElement(tagName,attrs){
        return {
            type: tagName,
            attrs: attrs,
            type: 1,
            children: [],
            parent: null
        }
    }

}


parseHtml(html);