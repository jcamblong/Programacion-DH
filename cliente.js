//modulo instalado de terceros
const inquirer = require("inquirer");
//modulo nativo File system
const fs = require("fs");
const rutaArchivo =__dirname+"/pedidos.json";
let content = fs.readFileSync(rutaArchivo, {encoding: 'utf8'});
//console.log(content.toString());

let opciones =[
    {   name: 'nombre',
        type: 'input',
        message:'Ingresa tu nombre',
    },
    {   name: 'telefono',
        type: 'input',
        message:'Ingresa tu numero de telefono',
    },
    {   name:'gusto',
        type: 'rawlist',
        message:'Elegi el gusto de la pizza',
        choices:['muzzarella','Jamon y Morron', 'Calabresa','4 Quesos'],
    },
    {   name: 'tamano',
        type: 'list',
        choices:['Personal','Mediana','Grande'],
        message:'Elegi el tamaño',
    },
    {   name: 'con_bebida',
        type: 'confirm',
        default: false,
    },
    {   name: 'bebida',
        type: 'list',
        choices:['coca','7up','sprite','naranja'],    
        message:'Elegi la bebida',
        when: function(answers){
            return answers.con_bebida
        },
    },
    
    {   name:'para_llevar',
        type:'confirm',
        message: 'La pizza es para llevar?',
        default: false,
    },
    {   name:'direccion',
        type:'input',
        message: 'Ingresa tu direccion',
        when: function(answers){
                return answers.para_llevar;
                },
        validate: function(answers){
            if (answers.length < 5){
                return 'Dejanos saber tu direccion para enviarte la pizza'
            }
            return true
        },   
    },
    
    {   name:'cliente_habitual',
        type: 'confirm',
        default: false,
    },
    {   name:'empanadas',
        type: 'checkbox',
        message:'Elegi el gusto de las empanadas',
        choices:['carne','pollo', 'jamon y queso','atun','choclo','verdura'],
        when: function(answers){
            return answers.cliente_habitual;
        },
        validate: function(answers){
            if (answers.length < 3){
                return 'Elige tres gustos'
            }
            return true
        },
    },
];
inquirer.prompt(opciones)
.then(answers => {
    console.log("=== Resumen de tu pedido ===");
    console.log("Tus datos son - Nombre:"+answers.nombre+"/ Telefono:"+answers.telefono);
    if(answers.para_llevar){
        console.log("Tu pedido será entregado en: "+answers.direccion);
    }
    else{
        console.log("Nos indicaste que pasaras a retirar tu pedido")
    }
    console.log("=== Productos solicitados ===");
    console.log("Pizza: "+answers.gusto);
    console.log("Tamaño: "+answers.tamano);
    let precioBebida = 0;
    if(answers.con_bebida){
        console.log("Bebida: "+ answers.bebida);
        precioBebida = 80;
    };
    if(answers.cliente_habitual){
        console.log("Tus tres empanadas de regalo serán de: ");
        console.log("*" + answers.empanadas[0]); 
        console.log("*" + answers.empanadas[1]);
        console.log("*" + answers.empanadas[2]);
    };
    console.log("=================================");
    let totalProductos=0;
    if(answers.tamano == "Personal"){
        totalProductos = 430
    } else if(answers.tamano == "Mediana"){
        totalProductos = 560
    } else if (answers.tamano == "Grande"){
        totalProductos = 650
    };

    let totalDelivery =0;
    if (answers.para_llevar){
        totalDelivery=20
    };

    let descuentos =0;
    let totalDescuentos=0;
    if(answers.con_bebida){
        switch (answers.tamano){
            case "Personal": descuentos =3;                                
            case "Mediana": descuentos =5;
            case "Grande": descuentos =8;
        }
        totalDescuentos=(totalProductos*descuentos/100);
    };
    let total = totalProductos + totalDelivery -totalDescuentos +precioBebida;
    console.log("Total productos: " + totalProductos);
    if(answers.con_bebida){
        console.log("Precio Bebida: " + precioBebida);
    };
    console.log("Total delivery: " + totalDelivery);
    console.log("Descuentos: " + descuentos + "%");
    console.log("Total: " + total);
    console.log("Gracias por comprar en DH Pizzas. Esperamos que disfrutes tu pedido.");
    //console.log(answers)
    let fechaPedido = new Date();
    
    let nuevos ={
        fecha: fechaPedido.toLocaleDateString('en-US', {'hour12':true}),
        hora: fechaPedido.toLocaleTimeString('en-US', {'hour12':true}),
        totalProductos: totalProductos,
        descuentos: totalDescuentos
    }

    let final ={
        ...answers,
        ...nuevos
    }

    console.log(final);
    //console.log("Fecha: " + fechaPedido.getFullYear()+ "/"+fechaPedido.getMonth()+"/"+fechaPedido.getDate());
    //console.log("Hora: "+ fechaPedido.getHours()+ ":"+ fechaPedido.getMinutes()+ ":" + fechaPedido.getSeconds());
    //fechaPedido.toLocaleString('en-US', {'hour12':true});
    //console.log("Hora: " + fechaPedido.toLocaleTimeString('en-US', {'hour12':true}));

    
    });


