# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Getting Started
Install all dependencies (using the `npm install` command), and run the development web server using the `node express_server.js` command

### Dependencies
- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

To use TinyURL you must register an account and login. The home page and create URL page aren't accessable until you've followed this step!

!["RegisterUser"](https://github.com/duncan-mann/tinyapp/blob/master/docs/create-account.png?raw=true)
*Registration Page* 🔑

After creating an account and logging in, you will be redirected to the home page. If it's your first time, there won't be any links. But once you have added some it will look like this! 

!["TinyURL App on Login"](https://github.com/duncan-mann/tinyapp/blob/master/docs/main.png?raw=true)
*Tiny URL Home Page* 🏠

From here you can see your long and short URLs, and the date at which they were added. You can also edit or delete each URL. To add a new URL, click the create new URL button on the navigation bar.

!["Add New URL Page"](https://github.com/duncan-mann/tinyapp/blob/master/docs/create-url.png?raw=true)
*Create New URL Page* ✏️

Simply enter the URL you want to shrink, and it will be added to your homepage with a unique tinyURL. 

You can edit each URL at any time by clicking the edit buttons on the homepage.

!["Add New URL Page"](https://github.com/duncan-mann/tinyapp/blob/master/docs/edit-url.png?raw=true)
*Edit TinyURL* ⚙️

When you're done, sign it via the logout button in the navigation bar. 


