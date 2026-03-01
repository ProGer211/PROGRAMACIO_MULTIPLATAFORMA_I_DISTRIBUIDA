/*function concat_sort(...array)
{
return[].concat(...array).sort((a,b) => a-b);
}


console.log(`[${concat_sort([7],[3,2],[5,6,4], [1])}]`);*/

function random(r)
{

    return Math.floor(Math.random()*r);
}

function initial_cards(n)
{
let i = 1;
let lista = [];
while(i<= n/2)
{
    lista.push(i);
    lista.push(i);
    i++;
}
return lista.sort(() =>Math.random()-0.5);
}


let n = 12;
//console.log(`[${initial_cards(n)}]`);
let list = new Array(n).fill(0).map((e,i) => Math.floor(i/2+1)).sort(e=>Math.random()-.5); 
//let list = new Array(n).fill(0).map((e,i) => Math.ceil((i+1/2))); 
console.log(`[${list}]`);
