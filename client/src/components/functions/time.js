import moment from "moment-timezone";

export default function(time){

    const array = time.split("T");        
    //only central european time for now
    return moment.tz(`${array[0]} ${array[1].slice(0,5)}`, "Europe/Berlin").format("DD MM YYYY HH:mm");
}