//variables globales
//puerto

process.env.PORT=process.env.PORT || 3000;
process.env.NODE_ENV=process.env.NODE_ENV || 'dev';


//VENCIMIENTO DEL TOKEN   //60s * 60m *24h  *30d
process.env.CADUCIDAD_TOKEN=60*60*24*30;

//SEED DE AUTENTICACION   //CREAR UNA VARIABLE EN HEROKU
process.env.SEED=process.env.SEED || 'este-es-el-seed-desarrollo'

let urlDB;

console.log(process.env.MONGO_URI);
if(process.env.NODE_ENV==='dev'){
    urlDB='mongodb://localhost:27017/cafe';
}else{
    //urlDB='mongodb+srv://admin:CvNgd32uWQ1ih9Mc@cluster0.zxyca.mongodb.net/sub-inv'
    urlDB = process.env.MONGO_URI;
}
console.log(urlDB);
process.env.URLDB=urlDB;