import { Catch, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import {
  removeJpgExt,
  removeUnderscoreORDash,
  splitCamelCase,
} from 'src/common/helper/image.filter';
import { UnSplashService } from 'src/unsplash/unsplash.service';
import { createApi } from 'unsplash-js';

@Injectable()
export class Template2 {
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
      //   prompt: ` Write an email for the given context in 1 subject, 4 body parts, and 3 names names wrt body based on context and I don't need image names like image1,image2,image3,etc  based on context . The email should include greetings for {{first_name}} {{last_name}}. The email content should be structured as a JavaScript object that can be parsed by the JSON.parse method. Strictly avoid adding any words or content except for the JavaScript object mentioned below.
      //   Desired Output:
      // {
      //   "subject": "{{subject}}",
      //   "greetings": "Dear {{first_name}} {{last_name}},",
      //   "body1": "{{body1}}",
      //   "image1": "{{image1}}",
      //   "body2": "{{body2}}",
      //   "image2": "{{image2}}",
      //   "body3": "{{body3}}",
      //   "image3": "{{image3}}",
      //   "body4": "{{body4}}",
      //   "regards":"Regards, {{name}}"
      // }
      //   #### Context #### ${prompt} `,
      //   max_tokens: 1000,
      //   temperature: 0,
      // });

      // let completion = JSON.parse(result.data.choices[0].text);
      // console.log(completion);

      let completion = {
        subject: 'Celebrating Memorial Day in the USA',
        greetings: 'Dear {{first_name}} {{last_name}},',
        body1:
          'Memorial Day is a day of remembrance for those who have died in service of the United States of America. It is a day to honor and remember the brave men and women who have sacrificed their lives for our country.',
        image1: 'memorial_day_flag.jpg',
        body2:
          'On this day, we remember and honor those who have made the ultimate sacrifice for our freedom. We also take time to reflect on the values of patriotism, courage, and loyalty that these brave individuals embodied.',
        image2: 'memorial_day_soldiers.jpg',
        body3:
          'Let us take a moment to remember and honor those who have served and those who are still serving our country. We thank them for their courage and dedication to our nation.',
        image3: 'memorial_day_tribute.jpg',
        body4:
          'We hope you have a meaningful Memorial Day. May we never forget the sacrifices of our heroes.',
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
      const { subject, greetings, body1, body2, body3, body4, regards } =
        completion;
      return {
        subject,
        greetings,
        body1,
        body2,
        body3,
        body4,
        regards,
        image1,
        image2,
        image3,
      };
    } catch (e) {
      console.log('Error at template2 \n', e);
    }
  }
}
