const puppeteer = require('puppeteer');

const url = 'https://www.mercadolivre.com.br/';

(async () => {
  const browser = await puppeteer.launch({headless: false});
  //const searchFor = 'Amazon Echo Dot 4th Gen com assistente virtual Alexa charcoal 110V/240V';
  const searchFor = 'Barbeador y cortador de cabelo Philips Series 3000 MG3721  branco 100V/240V';

  let i = 1;
  const list = [];

  const page = await browser.newPage();
  await page.goto(url);
  //await page.screenshot({path: 'example.png'});
  await page.waitForSelector('#cb1-edit');
  await page.type('#cb1-edit', searchFor); // id do input

  await Promise.all([
    page.waitForNavigation(),
    page.click('.nav-search-btn')
  ])

  const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href)); // $$eval retorna um array dai a necessidade de iterar

  for(const link of links){
    //console.log('Pagina', i)
    await page.goto(link) //redirecionar para cada link
    await page.waitForSelector('.ui-pdp-title'); 

    const title = await page.$eval('.ui-pdp-title', element => element.innerText);
    const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);

    const seller = await page.evaluate(()=> { //.evaluate para casos onde ñ a certeza da existencia do seletor, obrigatório para o $eval
        const el = document.querySelector('.ui-pdp-seller__link-trigger');
        
        if(!el)return null
        
        return el.innerText;
    });

    let obj = {}
    obj.title = title;
    obj.price = price;
    obj.link = link;
    obj.seller = seller === null ? ' ' : seller;

    list.push(obj);
    
    i++;
}
    console.log(list);

  console.log('2');
  await page.waitForTimeout(5*1000);
  await browser.close();
})();


