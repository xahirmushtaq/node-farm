const fs = require('fs')
const http = require('http')
const url = require('url')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplates')

//////////////////////////
//FILES

// //Blocking, Synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `TextOut text is here and TextIn : ${textIn} \n created on ${Date.now()}`;
// fs.writeFileSync('./txt/Output.txt', textOut);
// console.log('File Written');

//Non-Blocking, Asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
// if(err) return console.log('ERROR !!! ❓')
//     fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//             fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//                 console.log(data3);

//                 fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
// console.log('Your text is here 👀 in final too')
//     })
// })
// })
// })
// console.log('Bahar wala')
/////////////////////////////////
//SERVER
const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
)
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
)
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
)
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObject = JSON.parse(data)
//slugs//
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }))
// console.log(slugs) /*this shows each card heading*/

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
    // const pathname = req.url

    //Overview Page//
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const cardsHtml = dataObject
            .map((el) => replaceTemplate(tempCard, el))
            .join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        // console.log(cardsHtml)
        res.end(output)

        //Product Page//
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObject[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

        //API Page//
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)

        //Not Found//
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
        })
        res.end('<h1>Page not found!<h1>')
    }
})
server.listen(7777, '127.0.0.1', () => {
    console.log('Listening to the port 7777')
})
