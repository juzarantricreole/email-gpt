import { Injectable } from '@nestjs/common';
import { Template1 } from './templates/template1';
import { Template2 } from './templates/template2';
import { Template3 } from './templates/template3';
import { Template4 } from './templates/template4';
import { Template5 } from './templates/template5';
import * as cheerio from 'cheerio';
// import { JSDOM } from 'jsdom';
@Injectable()
export class OpenAIService {
  constructor(
    private readonly template1: Template1,
    private readonly template2: Template2,
    private readonly template3: Template3,
    private readonly template4: Template4,
    private readonly template5: Template5,
  ) {}

  async retriveTemplateData(id: number, prompt: string) {
    if (id == 0) {
      return await this.template1.task(prompt);
    } else if (id == 1) {
      return await this.template2.task(prompt);
    } else if (id == 2) {
      return await this.template3.task(prompt);
    } else if (id == 3) {
      return await this.template4.task(prompt);
    } else if (id == 4) {
      return await this.template5.task(prompt);
    } else {
      return await this.template2.task(prompt);
    }
  }

  async processHtmlAndDownload(blobData) {
    // console.log(blobData);

    const $ = await cheerio.load(blobData);
    // $.html();
    console.log($.html());
    // console.log(dom.window.document.querySelector('p').textContent);
  }
}
