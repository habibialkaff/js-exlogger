# js-exlogger
Work In Progress

Registration:
* Sign In https://js-exception-logger.firebaseapp.com/auth

Upload Source Map:
* Upload Manually in https://js-exception-logger.firebaseapp.com/, or
* Make a POST request as described in the url above

Hook it to website:
* Angular2
```typescript
import { ErrorHandler } from '@angular/core';
export class CustomErrorHandler extends ErrorHandler {
  constructor() {
    super(true);
  }
  handleError(err: any) {
    let {stack, message} = (err.originalError || err)

    let data = {
          ex: {stack, message},
          loggedDate: new Date().getTime()
      }      
    this.sendData(data);
    
    super.handleError(err);
  }

  private sendData(data) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.open(
      'POST',
      'https://us-central1-js-exception-logger.cloudfunctions.net/exlog',
      true);
    httpRequest.setRequestHeader('Content-Type', "application/json");
    httpRequest.setRequestHeader('x-user-id', '{{your user id}}');
    httpRequest.send(JSON.stringify(data));    
  }
}
```
