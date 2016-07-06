// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by accounts-phone.js.
import { name as packageName } from "meteor/accounts-phone";

// Write your tests here!
// Here is an example.
Tinytest.add('accounts-phone - example', function (test) {
  test.equal(packageName, "accounts-phone");
});
