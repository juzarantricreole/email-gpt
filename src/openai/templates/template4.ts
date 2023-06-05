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
export class Template4 {
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
      //   prompt: `Write an email for the given context in 1 subject, 6 body parts, and 4 image names wrt body based on context and I don't need image names like image1,image2,image3,etc  based on context . The email should include greetings for {{first_name}} {{last_name}}. The email content should be structured as a JavaScript object that can be parsed by the JSON.parse method. Strictly avoid adding any words or content except for the JavaScript object mentioned below.
      // Desired Output:
      // {
      //   "subject": "{{subject}}",
      //   "greetings": "Dear {{first_name}} {{last_name}},",
      //   "body1": "{{body1}}",
      //   "image1": "{{image1}}",
      //   "body2": "{{body2}}",
      //   "body3": "{{body3}}",
      //   "image2": "{{image2}}",
      //   "body4": "{{body4}}",
      //   "image3": "{{image3}}",
      //   "body5": "{{body5}}",
      //   "image4": "{{image4}}",
      //   "body6": "{{body6}}",
      //   "regards":"Regards, {{name}}"
      // }
      // #### Context #### ${prompt} `,
      //   max_tokens: 1000,
      //   temperature: 0,
      // });
      // let completion = JSON.parse(result.data.choices[0].text);
      // console.log(result.data.choices[0].text);

      let completion = {
        subject: 'Holiday Announcement for Government Employees',
        greetings: 'Dear {{first_name}} {{last_name}},',
        body1:
          'We are pleased to announce that the government has declared a holiday on the occasion of the upcoming festival. All government employees are requested to take a day off on the day of the festival.',
        image1: 'holiday_announcement.jpg',
        body2:
          'We understand that this holiday will give you an opportunity to spend quality time with your family and friends. We hope that you will make the most of this holiday.',
        body3:
          'We also request you to take all the necessary precautions to ensure your safety and the safety of your family during the festival.',
        image2: 'safety_precautions.jpg',
        body4: 'We wish you a happy and safe holiday. Enjoy the festival!',
        image3: 'festival_celebration.jpg',
        body5: 'We look forward to your return to work after the holiday.',
        image4: 'return_to_work.jpg',
        body6: 'We hope that you have a great time during the holiday.',
        regards: 'Regards, {{name}}',
      };

      // /// filtered images with remvoing .jpg extension
      let images: string[] = await removeJpgExt(
        completion.image1,
        completion.image2,
        completion.image3,
        completion.image4,
      );

      /// removing uderscore/dash if necessary
      images = await removeUnderscoreORDash(images);

      /// split camel image
      images = await splitCamelCase(images);

      let image1 = await this.unSplash.getImages(images[0]);
      let image2 = await this.unSplash.getImages(images[1]);
      let image3 = await this.unSplash.getImages(images[2]);
      let image4 = await this.unSplash.getImages(images[3]);

      /// final response object
      const { subject, body1, body2, body3, body4, body5, body6 } = completion;
      return {
        subject,
        body1,
        body2,
        body3,
        body4,
        body5,
        body6,
        image1,
        image2,
        image3,
        image4,
      };
    } catch (e) {
      console.log('Error at template4 \n', e);
    }
  }
}
