// Definir el radio
let radius = 5; //let interpreta el valor que tu le das y varia el tipo de variable

// Calcular el perímetro (circunferencia) y el área
let perimeter = 2 * Math.PI * radius;
let area = Math.PI * Math.pow(radius,2); // o radius**2

function random(r)
{

    return Math.floor(Math.random()*r);
}

function clock(tim,separator=":")
{
let horas = Math.floor(time / 3600);
let sobrante = time % 3600;
let minutos = Math.floor(sobrante / 60);
sobrante = sobrante %  60;
return `${horas}${separator}${minutos}${separator}${sobrante}`;

}
let time = 3734;
console.log(`Estos ${time} segundos son ${clock(time)} h:min:s`);
console.log(`Estos ${time} segundos son ${clock(time,"-")} h:min:s`);
let r = 12;
console.log(`Numero aleatorio ${random(r)} entre 0 i ${r}`);

// Imprimir en consola
//console.log("Radius:", radius);
//console.log(`El perimetro es ${perimeter}`);
//console.log(`El aerea es ${area}`);