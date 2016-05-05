this.common = this.common || {};

common.parseQueryString = function(query) {
    query = query || location.search;

    if (query.indexOf('?') === 0) {
        query = query.substr(1);
    }

    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g;
    var decode = function (str) {return decodeURIComponent( str.replace(decodeRE, " ") );};

    var params = {}, e;
    while (e = re.exec(query)) {
        var k = decode( e[1] ), v = decode( e[2] );
        console.log('k=' + k + ', v=' + v);
        if (k.substring(k.length - 2) === '[]') {
            k = k.substring(0, k.length - 2);
            (params[k] || (params[k] = [])).push(v);
        } else if (params[k]) {
            if (Array.isArray(params[k])) {
                params[k].push(v);
            } else {
                params[k] = [params[k]];
            }
        }
        else {
            params[k] = v;
        }
    }
    return params;
};