# Rest Json Serializer

**Description**: Determine which data to send out to the world in the elegant way.

Since I need to write an API backend with NodeJS. I'm trying to find a library for serializing data from the system that has rich functions. For instance rename field, the default value for null, method fields, etc. But, I didn't find it. So, I decided to build it myself.

This project influenced [Django REST framework Serializer](https://www.django-rest-framework.org/api-guide/serializers/)

## Installation
To install this package, run the following command from the root of your project's directory:

`npm i rest-json-serializer`

## Change Log
### 1.2.0
- Add `resolveMethodFields` to receive list function that return `Promise`


## Example Usage
import { BaseSerializer } from 'rest-json-serializer'
```
class UserSerializer extends BaseSerializer {
  protected instance: User;
  protected defaultValue = { imageUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png" };
}


const instance: User ={
    id: 1,
    firstName: "Carlo",
    lastName: "Bayer",
    email: "a@a.com",
    password: "12345678",
    verifyEmail: true,
    emailToken: "this-is-email-token",
    imageUrl: null,
}


const serializer = new UserSerializer({
  instance,
  exclude: ["id", "password", "emailToken"],
});

console.log(serializer.serialize());
//=> {
//  "firstName" : "Carlo",
//  "lastName": "Bayer",
//  "email": "a@a.com"
//  "imageUrl": "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png"
// }
const returnNameFunction = (instance: any) => {
  return {
    key: "name",
    value: `${instance["firstName"]} ${instance["lastName"]}`,
  };
};
const anotherSerializer = new UserSerializer({
  instance,
  exclude: [
    "id",
    "password",
    "emailToken",
    "email",
    "firstName",
    "lastName",
    "verifyEmail",
  ],
  renameFields: [{ from: "imageUrl", to: "image" }],
  methodFields: [returnNameFunction],
});

console.log(anotherSerializer.serialize());
//=> {
//  "name" : "Carlo Bayer",
//  "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png"
// }

```