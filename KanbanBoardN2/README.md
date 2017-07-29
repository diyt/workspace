The entry point of this web application is main.js. Use "node main.js" to start the server.
You may miss certain dependencies(like "Express", "body-parser", etc.), use "npm install packageName" to add them.
After the server start, you can visit "http://localhost:1234/mainPage" to see the main page.

This web application also have the feature to backup data in AWS DynamoDB, to use this feature, you need to:
  Create an IAM user with read/write access to DynamoDB table. Add a file "credentials" in directory "~/.aws/" and add the following content.
  ```[default]
     aws_access_key_id = ***(IAM User access key ID)
     aws_secret_access_key = ***(IAM User secret key ID)
  ```
