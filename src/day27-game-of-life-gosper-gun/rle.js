export const rleDecompress = function(rle) {

    var piece = {0:{}};
    var num = '';
    var x = 0;
    var y = 0;
    var l;

    for(var s in rle) {

        var s = rle[s];

        if(s === 'b') {

            x = num === '' ? x+1 : x + parseInt(num);
            num = '';

        }

        else if(s === 'o') {

            var i = num === '' ? 1 : parseInt(num);

            while(i--)
                piece[y][x+i] = 1;

            x = num === '' ? x+1 : x + parseInt(num);
            num = '';


        }

        else if(s === '$') {

            y += num === '' ? 1 : parseInt(num);
            x = 0;
            num = '';
            piece[y] = {};

        }

        else if(s === '!')
            break;

        else if(parseInt(s).toString() !== 'NaN'){

            num += s;

        }

    }

    return piece;

};

var getPattern = function(id) {

    $.get('patterns/'+id+'.rle',

        function(data) {

            var rle = data;
            rle = rle.substr(rle.indexOf('\n', rle.indexOf('rule')+1)).replace('\n', '');
            pattern[id] = rle.replace('\r', '');
            selectPattern(id);
            console.log(id);

        }

    );



};

var lol;
// $('#patterns li').click(function() { selectPattern($(this).text()); });

var pattern = {}

pattern.Cell = 'o!';
