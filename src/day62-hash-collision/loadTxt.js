if (module) {
    const fs = require('fs');
    const txt = fs.readFileSync('./austen.txt', 'utf8');

    const punctuationless = txt.replace(/[.,"\/#!$%?\^&\*;:{}=\-_`~()]/g,"");
    let finalString = punctuationless.replace(/\s{2,}/g," ");
    finalString = finalString.replace(/[\r\n\+]/g, ' ');
    let wordArr = finalString.split(' ');
    let uniqueWords = wordArr.filter((word, i, arr) => {
        return arr.indexOf(word) === i;
    });
    console.log(uniqueWords.join(','));
    //
    // // uniqueWords = uniqueWords.slice(0, 20000);
    // console.log(uniqueWords.join(' '));
    //
    // module.exports = uniqueWords.join(',');

    // const s = "This., -/ is #! an $ % ^ & * example ;: {} of a = -_ string with `~)() punctuation";
}
