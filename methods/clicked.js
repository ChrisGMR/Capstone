function addGame(game){
    gameid = JSON.stringify({game})
    fetch('/homepage/addGame', {method: "POST",headers: { "Content-Type": "application/json" },body: gameid })
}
function removeGame(game){
    gameid = JSON.stringify({game})
    fetch('/homepage/removeGame', {method: "DELETE",headers: { "Content-Type": "application/json" },body: gameid })
    
}
