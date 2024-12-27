# @brmorillo/js-util-library

## Project Description

**@brmorillo/js-util-library** is a JavaScript utility library designed to simplify common tasks by providing straightforward and efficient implementations for developers. It is designed to work seamlessly in both Node.js and browser environments, ensuring flexibility and usability.

---

## How to Publish and Update on npm

### Publish for the First Time

1. **Configure npm:**
   Make sure you are logged in to npm:

   ```bash
   npm login
   ```

2. **Check `package.json`:**
   Ensure the `name` field is set to `@brmorillo/js-util-library` and the `version` field is correct.

3. **Publish the package:**
   ```bash
   npm publish --access public
   ```

### Update an Existing Version

1. **Bump the version:**
   Use the following command to update the version according to [SemVer](https://semver.org/):

   ```bash
   npm version patch   # For small fixes
   npm version minor   # For new features
   npm version major   # For breaking changes
   ```

2. **Publish again:**
   ```bash
   npm publish
   ```

---

## Project Features

### Date Utility Functions

1. **`dateNow`**: Returns the current date and time, either in UTC or the system's timezone.
2. **`dateCreateInterval`**: Creates an interval between two dates.
3. **`dateAddTime`**: Adds a specific duration to a date.
4. **`dateRemoveTime`**: Subtracts a specific duration from a date.
5. **`dateDiffBetween`**: Calculates the difference between two dates in specified units.
6. **`dateToUTC`**: Converts a date to UTC.
7. **`dateToTimeZone`**: Converts a date to a specified timezone.

### Cryptography Utility Functions

1. **`cryptEncrypt`**: Encrypts a string value using bcrypt.
2. **`cryptCompareValues`**: Compares a string value with an encrypted value.
3. **`cryptGenerateRandomString`**: Generates a random string using bcrypt.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
