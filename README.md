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

1. **Feature 1**: *(Brief description of the feature)*
2. **Feature 2**: *(Brief description of the feature)*
3. **Feature 3**: *(Brief description of the feature)*

*(Replace the placeholders above as you inform the project features.)*

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
