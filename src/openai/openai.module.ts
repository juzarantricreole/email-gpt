import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { OpenAIController } from './openai.controller';
import { Template1 } from './templates/template1';
import { Template2 } from './templates/template2';
import { Template3 } from './templates/template3';
import { Template4 } from './templates/template4';
import { Template5 } from './templates/template5';
import { UnSplashService } from 'src/unsplash/unsplash.service';

@Module({
  imports: [],
  controllers: [OpenAIController],
  providers: [
    OpenAIService,
    Template1,
    Template2,
    Template3,
    Template4,
    Template5,
    UnSplashService,
  ],
})
export class OpenAIModule {}
