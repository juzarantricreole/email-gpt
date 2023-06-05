import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { BodyDto } from './dto/body.dto';
import { OpenAIService } from './openai.service';

@Controller()
export class OpenAIController {
  constructor(private readonly openAiService: OpenAIService) {}
  @Post('template')
  async retriveTemplateData(@Body() body: BodyDto) {
    /// extract the id and prompt from body
    const { id, prompt } = body;
    console.log(id, prompt);
    return await this.openAiService.retriveTemplateData(id, prompt);
  }

  @Post('/download')
  async processHtmlAndDownload(@Body() body) {
    return this.openAiService.processHtmlAndDownload(body);
  }
}
