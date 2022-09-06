// author: anton feldmann
// data: 2022-08-01

/// package for usage

import * as expressive from "https://raw.githubusercontent.com/NMathar/deno-express/master/mod.ts";
import { Status, STATUS_TEXT } from "https://deno.land/std/http/http_status.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

/// calculate the absolute number of a value
function abs(value: number) : number {
  return value < 0 ? -1 * value : value;
}

/// how to generate a password:
/// 1. create the symbol dataset
/// 2. give a size (size is between 0 and 245)
/// 3. shuffle the array
function generatePassword(passwordLength: number) {
  // reduce the size
  if (passwordLength > 254){
    passwordLength = 254;
  }

  // available symbols
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var specialChars = "~!#$@€%&*-+|";
  
  // symbol set
  var allChars = numberChars + upperChars + lowerChars + specialChars;

  // array of symbols
  var randPasswordArray = Array<String>(passwordLength);

  // fill array
  randPasswordArray = randPasswordArray.fill(allChars, 0, passwordLength);
  
  // shuffle array
  return shuffleArray(randPasswordArray.map(function (x) {
    return x[Math.floor(Math.random() * x.length)];
  })).join("");
}

/// shuffle array in place
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/// route
const create_passwd = async (request: any, response: any) => {
  console.debug("create password");

  // get the parameter
  const len_param = await request.params.len;

  // parse the parameter to number
  let num: number = abs(parseInt(len_param));

  // check if the number is a number or other type
  if (isNaN(num)){
    console.debug('password incorrect not a number');
    // other type is bad request
    response.status=Status.BadRequest;
    await response.json({
      error: true,
      passwd: STATUS_TEXT.get(Status.BadRequest),
    });
  }else{
    // create the password
    const pass = generatePassword(num);
    console.debug("password created");
    // send ok
    await response.json({
      error: false,
      passwd: pass,
    });
  }
};

//start the server in async mode
(async () => {
  let port :number = parseInt(config().PASSWORD_PORT);
  if (isNaN(port)) {
    port = 8888;
  }

  const app = new expressive.App();
  app.use(expressive.simpleLog());

  //route base address
  app.get("/api/v1/{len}", create_passwd);

  // default for all other pages
  app.get("*", (req, res) => {
    res.satuts= Status.NotFound;
    res.json({
      error: true,
      message: "not found",
    });
  });

  // clear the console
  console.clear();

  // wait for the server to start
  const server = await app.listen(port);

  // output the port number
  console.log("app listening on port " + server.port);
})();
