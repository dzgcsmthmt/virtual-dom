/*var tpl = 'Hei, my name is <%name%>, and I\'m <%age%> years old.';
var data = {
    "name": "Barret Lee",
    "age": "20"
};

var reg = /<%([^%>]+)?%>/g
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

var result = tpl.replace(reg, function(s0, s1){
    console.log(s0,s1);
    return data[s1];
});

console.log(result);*/

/*
tpl = `Hei, my name is <%name%>, and I\'m <%base.age%> years old.`;
var data = {
    name: "Barret Lee",
    base: {"age": "20"}
};

var reg = /<%([^%>]+)?%>/g
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

var result = tpl.replace(reg, function(s0, s1){
    console.log(s0,s1);
    if(s1.indexOf('.') > -1){
        let path = s1.split('.');
        while(path.length){
            data = data[path.shift()];
        }
        return data;
    }
    return data[s1];
});

console.log(result)*/


var tpl = '<% for(var i = 0; i < this.posts.length; i++) {' +　
    'var post = this.posts[i]; %>' +
    '<% if(!post.expert){ %>' +
        '<span>post is null</span>' +
    '<% } else { %>' +
        '<a href="#"><% post.expert %> at <% post.time %></a>' +
    '<% } %>' +
'<% } %>';

var data = {
    "posts": [{
        "expert": "content 1",
        "time": "yesterday"
    },{
        "expert": "content 2",
        "time": "today"
    },{
        "expert": "content 3",
        "time": "tomorrow"
    },{
        "expert": "",
        "time": "eee"
    }]
};

var tplEngine = function(tpl, data) {
    var reg = /<%([^%>]+)?%>/g, 
        regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, 
        code = 'var r=[];\n', 
        cursor = 0;

    var add = function(line, js) {
        js? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while(match = reg.exec(tpl)) {
        add(tpl.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(tpl.substr(cursor, tpl.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
};

console.log(tplEngine(tpl, data));