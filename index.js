const puppeteer = require('puppeteer');
const CSVToJSON = require('csvtojson');
const JSONToCSV = require('json2csv').parse;
const FileSystem = require('fs');
var dataToWrite;
var fs = require('fs');


(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 250});
  const page = await browser.newPage();
  await page.goto('https://www.adidas.dk/vaegtloftning-sko', {waitUntil: 'networkidle0'});
  await page.setViewport({
        width: 1200,
        height: 800
    });
  //await page.screenshot({path: 'example.png'});
  await page.waitForSelector('#modal-root > div > div > div > div.gl-modal__main-content > div > div.footer___3thm- > button.gl-cta.gl-cta--primary.gl-cta--full-width > span');
await page.click('#modal-root > div > div > div > div.gl-modal__main-content > div > div.footer___3thm- > button.gl-cta.gl-cta--primary.gl-cta--full-width > span');
await autoScroll(page);



const model = await page.evaluate(() => Array.from(document.querySelectorAll('span.gl-product-card__name')).map(partner => partner.innerText.trim()
	)
);

const pris = await page.evaluate(() => Array.from(document.querySelectorAll('span.gl-price__value')).map(partner => partner.innerText.trim()
	)
);



const billedsti = await page.evaluate(() => Array.from(document.querySelectorAll('span.h4')).map(partner => partner.innerText.trim()
	)
);

//const boligareal = await page.evaluate(() => Array.from(document.querySelectorAll('.area span')).map(partner => partner.innerText.trim()
 // )
//);

const partners = await page.evaluate(() => 
  Array.from(document.querySelectorAll('.gl-product-card'))
    .map(compact => ({
      model: compact.querySelector('span.gl-product-card__name').innerText.trim(),
      logo: compact.querySelector('.gl-product-card__image').src,
      pris: compact.querySelector('span.gl-price__value').innerText.trim(),
      url: compact.querySelector('div.gl-product-card__assets > a').href,
     // document.querySelector("#modal-root > div > div > div > div.gl-modal__main-content > div > div.footer___3thm- > button.gl-cta.gl-cta--primary.gl-cta--full-width > span")
     //pris: compact.querySelector('.gl-price__value:last-child').innerText.trim(),

      //billedsti: compact.querySelector('.area span:nth-child(2)').innerText.trim(),
      //kontantpris: compact.querySelector('.ci__info--1 .row-2 span').innerText.trim(),
      //brutto: compact.querySelector('.ci__kf li.is-row span:last-child(1)').innerText.trim(),
      //netto: compact.querySelector('.ci__kf li.is-row span:last-child(2)').innerText.trim(),
      //maegler: compact.querySelectorAll('ci__agentlink.[href*=href_value]');
    }))

    )

 
/*
  const csvFromArrayOfArrays  = 'number;first;last;handle\n1;Mark;Otto;@mdo\n2;Jacob;Thornton;@fat\n3;Larry;the Bird;@twitter\n';
*/


//console.log(textContent,by, pris);
console.log(partners);
console.log(model);

const csv = JSONToCSV(partners);
FileSystem.writeFileSync("./data.csv", csv);


 await browser.close();

 async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 300;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}
})();




