module.exports = function(time){
    const array = time.split("T");

    const clock = array[1].slice(0,5);

    const date = array[0].split("-").reverse().join("-");   

    return `${clock} ${date}`;
}