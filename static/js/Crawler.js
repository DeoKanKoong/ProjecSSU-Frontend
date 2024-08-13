const puppeteer = require('puppeteer');
const fs = require('fs');

async function crawl() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://fun.ssu.ac.kr/ko/program/all/list/0/1?sort=applicant');

    const programs = await page.evaluate(() => {
        const items = [];
        const titles = new Set();
        document.querySelectorAll('.content').forEach((item) => {
            const title = item.querySelector('.title').innerText;
            if (!titles.has(title)) {
                const dateRange = item.querySelector('small').innerText;
                const type = item.querySelector('.type').innerText.trim();
                const progress = item.querySelector('.progress b').innerText + '/' + item.querySelector('.progress').innerText.split('/')[1].trim();
                items.push({ title, dateRange, type, progress });
                titles.add(title);
            }
        });
        return items.slice(0, 3); // 상위 3개만 선택
    });

    await browser.close();

    fs.writeFileSync('programs.json', JSON.stringify(programs, null, 2));
    console.log('Crawling completed and data saved to programs.json');
}

crawl();
