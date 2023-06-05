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
export class Template1 {
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
        // prompt: `Write an email for the given context in 1 subject, 3 body parts, and 3 image names wrt body based on context and I don't need image names like image1,image2,image3,etc  based on context . The email should include greetings for {{first_name}} {{last_name}}. The email content should be structured as a JavaScript object that can be parsed by the JSON.parse method. Strictly avoid adding any words or content except for the JavaScript object mentioned below.

      //   Desired Output:
      //   {
      //     "subject": "{{subject}}",
      //     "greetings": "Dear {{first_name}} {{last_name}},",
      //     "body1": "{{body1}}",
      //     "image1": "{{image1}}",
      //     "body2": "{{body2}}",
      //     "image2": "{{image2}}",
      //     "body3": "{{body3}}",
      //     "image3": "{{image3}}",
      //     "regards":"Regards, {{name}}"
      //   }
      //   #### Context #### ${prompt} `,
      //   max_tokens: 1000,
      //   temperature: 0,
      // });

      // let completion = JSON.parse(result.data.choices[0].text);
      // console.log(completion);

      let completion = {
        subject: 'Filing Petition for Poverty in India',
        greetings: 'Dear {{first_name}} {{last_name}},',
        body1:
          'Poverty is a major issue in India and it needs to be addressed. We are filing a petition to the government to take necessary steps to reduce poverty in India.',
        image1: 'poverty_statistics',
        body2:
          'We need your support to make this petition successful. Please sign the petition and share it with your friends and family.',
        image2: 'petition_signature',
        body3:
          'Your support will help us to make a difference in the lives of millions of people in India.',
        image3: 'poverty_impact',
        regards: 'Regards, {{name}}',
      };

      /// filtered images with remvoing .jpg extension
      let images: string[] = await removeJpgExt(
        completion.image1,
        completion.image2,
        completion.image3,
      );

      // console.log(images);

      /// removing uderscore/dash if necessary
      images = await removeUnderscoreORDash(images);

      /// split camel image
      images = await splitCamelCase(images);

      let image1 = await this.unSplash.getImages(images[0]);
      let image2 = await this.unSplash.getImages(images[1]);
      let image3 = await this.unSplash.getImages(images[2]);

      /// final response object
      const { subject, greetings, body1, body2, body3, regards } = completion;
      return {
        subject,
        greetings,
        body1,
        body2,
        body3,
        regards,
        image1,
        image2,
        image3,
      };
    } catch (e) {
      console.log('Error at template1 \n', e);
    }
  }
}
