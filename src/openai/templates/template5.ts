import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import {
  removeJpgExt,
  removeUnderscoreORDash,
  splitCamelCase,
} from 'src/common/helper/image.filter';
import { UnSplashService } from 'src/unsplash/unsplash.service';

@Injectable()
export class Template5 {
  constructor(
    private readonly config: ConfigService,
    private readonly unSplash: UnSplashService,
  ) {}
  async task(prompt: string) {
    /// set the openai configuration
    const configuration = new Configuration({
      apiKey: this.config.get<string>('OPEN_AI_KEY'),
    });

    /// creating the openai object
    const openai = new OpenAIApi(configuration);
    try {
      // const result = await openai.createCompletion({
      //   model: 'text-davinci-003',
      //   prompt: `Write an email for the given context in 1 subject, 3 body parts, and 3 image names wrt body based on context and I don't need image names like image1,image2,image3,etc  based on context . The email should include greetings for {{first_name}} {{last_name}}. The email content should be structured as a JavaScript object that can be parsed by the JSON.parse method. Strictly avoid adding any words or content except for the JavaScript object mentioned below.
      // Desired Output:
      // {
      //   "subject": "{{subject}}",
      //   "greetings": "Dear {{first_name}} {{last_name}},",
      //   "image1": "{{image1}}",
      //   "body1": "{{body1}}",
      //   "image2": "{{image2}}",
      //   "body2": "{{body2}}",
      //   "image3": "{{image3}}",
      //   "body3": "{{body3}}",
      //   "regards":"Regards, {{name}}"
      // }
      // #### Context #### ${prompt} `,
      //   max_tokens: 1000,
      //   temperature: 0,
      // });
      // console.log(result.data.choices[0].text);
      // let completion = JSON.parse(result.data.choices[0].text);

      let completion = {
        subject: "Celebrating Our Company's Anniversary",
        greetings: 'Dear {{first_name}} {{last_name}},',
        image1: 'CompanyLogo',
        body1:
          'We are delighted to announce that our company is celebrating its anniversary this month. We are proud to have achieved this milestone and would like to thank all our customers for their continued support.',
        image2: 'TeamCelebration',
        body2:
          'We are celebrating this momentous occasion with our team and would like to invite you to join us in the celebration. We look forward to your presence and would be delighted to have you with us.',
        image3: 'CompanyAchievements',
        body3:
          'We have achieved many milestones in the past year and are looking forward to many more in the coming years. We thank you for being a part of our journey and look forward to your continued support.',
        regards: 'Regards, {{name}}',
      };

      /// filtered images with remvoing .jpg extension
      let images: string[] = await removeJpgExt(
        completion.image1,
        completion.image2,
        completion.image3,
      );

      /// removing uderscore/dash if necessary
      images = await removeUnderscoreORDash(images);

      /// split camel image
      images = await splitCamelCase(images);

      let image1 = await this.unSplash.getImages(images[0]);
      let image2 = await this.unSplash.getImages(images[1]);
      let image3 = await this.unSplash.getImages(images[2]);

      /// final response object
      const { subject, body1, body2, body3 } = completion;
      return {
        subject,
        body1,
        body2,
        body3,
        image1,
        image2,
        image3,
      };
    } catch (e) {
      console.log('Error at template5 \n', e);
    }
  }
}
