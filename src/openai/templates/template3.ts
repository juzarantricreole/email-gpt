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
export class Template3 {
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
      //   prompt: ` Write an email for the given context in 1 subject, 3 body parts, and 1 image names wrt body based on context and I don't need image names like image1,image2,image3,etc  based on context . The email should include greetings for {{first_name}} {{last_name}}. The email content should be structured as a JavaScript object that can be parsed by the JSON.parse method. Strictly avoid adding any words or content except for the JavaScript object mentioned below.
      // Desired Output:
      // {
      //   "subject": "{{subject}}",
      //   "greetings": "Dear {{first_name}} {{last_name}},",
      //   "body1": "{{body1}}",
      //   "body2": "{{body2}}",
      //   "body3": "{{body3}}",
      //   "image1": "{{image1}}",
      //   "regards":"Regards, {{name}}"
      // }
      //   #### Context #### ${prompt} `,
      //   max_tokens: 1000,
      //   temperature: 0,
      // });

      // let completion = JSON.parse(result.data.choices[0].text);
      // console.log(completion);

      let completion = {
        subject: "Happy Engineer's Day!",
        greetings: 'Dear {{first_name}} {{last_name}},',
        body1:
          "We would like to take this opportunity to wish you a very Happy Engineer's Day! Engineers are the backbone of any society and we are proud to have you as part of our team.",
        body2:
          'Your hard work and dedication have been instrumental in the success of our organization. We thank you for your commitment and look forward to your continued support.',
        body3:
          'We have attached a small token of appreciation for your efforts. Please accept it with our best wishes.',
        image1: 'token_of_appreciation.jpg',
        regards: 'Regards, {{name}}',
      };

      /// filtered images with remvoing .jpg extension
      let images: string[] = await removeJpgExt(completion.image1);

      /// removing uderscore/dash if necessary
      images = await removeUnderscoreORDash(images);

      /// split camel image
      images = await splitCamelCase(images);

      let image1 = await this.unSplash.getImages(images[0]);

      /// final response object
      const { subject, body1, body2, body3, greetings, regards } = completion;
      return {
        subject,
        body1,
        body2,
        body3,
        image1,
        regards,
        greetings,
      };
    } catch (e) {
      console.log('Error at template3 \n', e);
    }
  }
}
