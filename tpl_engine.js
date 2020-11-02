/*var tpl = 'Hei, my name is <% name %>, and I\'m <%info.age%> years old.';
var data = {
    name: "Barret Lee",
    info: {age: 20}
}

var reg = /<%([^%>]+)?%>/g;

let match = null;

while(match = reg.exec(tpl)){
    console.log(match);
}


let result = tpl.replace(reg,function($0,$1){
    console.log($0);
    console.log($1);
    $1 = $1.trim();
    var path;
    if($1.indexOf('.') > -1){
        path = $1.split('.');
        while(data && path.length){
            data = data[path.shift()];
        }
        return data;
    }
    return data[$1.trim()];
})

console.log(result);*/


var tpl = '<%   for(var i = 0; i < this.posts.length; i++) {' +　
    'var post = this.posts[i]; %>' +
    '<% if(!post.expert){ %>' +
        '<span>post is null</span>' +
    '<% } else { %>' +
        '<a href="#"><% post.expert %> at <% post.time %></a>' +
    '<% } %>' +
'<% } %><span>the end</span>';

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
        regOut = /(^\s+(if|for|else|switch|case|break|{|}))(.*)?/g, 
        code = 'var r=[];\n', 
        cursor = 0,
        match = null;

    while(match = reg.exec(tpl)){
        regOut.lastIndex = 0;
        if(cursor < match.index){
            code += 'r.push("' +  escape(tpl.substring(cursor,match.index)) + '");\n';
        }

        if(regOut.test(match[1])){
            code += match[1] + '\n';
        }else{
            code += 'r.push(' + match[1] + ');\n';
        }

        
        cursor = match.index + match[0].length;
    }
    code += 'r.push("' +  escape(tpl.substring(cursor)) + '");\n';
    code += 'return r.join("");';
    return new Function(code).apply(data); 
}


function escape(str){
    return str.replace(/"/g,'\\"').replace(/'/g,"\\'")
}

console.log(tplEngine(tpl,data));


