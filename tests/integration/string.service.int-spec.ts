import { StringUtils } from '../../src/services/string.service';

/**
 * Integration tests for the StringUtils class.
 * These tests verify more complex scenarios involving multiple methods.
 */
describe('StringUtils - Integration Tests', () => {
  describe('Real-world usage scenarios', () => {
    it('should format a username for display', () => {
      // Scenario: Format a username entered by the user
      const rawUsername = '  jOHn_DOE  ';

      // 1. Remove whitespace
      const trimmed = rawUsername.trim();

      // 2. Convert to kebab-case for URL
      const kebabCased = StringUtils.toKebabCase({ input: trimmed });

      // 3. Convert to title case for display
      const displayName = StringUtils.toTitleCase({
        input: trimmed.replace(/_/g, ' '),
      });

      // Assertions
      expect(kebabCased).toBe('j-ohn-doe'); // jOHn_DOE → j-ohn-doe (correct behavior)
      expect(displayName).toBe('John Doe');
    });

    it('should process an email template with user data', () => {
      // Scenario: Process an email template with user data
      const emailTemplate =
        'Hello, {name}! Your account was created successfully. Your username is {username}.';
      const userData = {
        name: 'Mary Smith',
        username: 'mary_smith_2023',
      };

      // 1. Replace placeholders in the template
      const processedEmail = StringUtils.replacePlaceholders({
        template: emailTemplate,
        replacements: userData,
      });

      // 2. Truncate the email for preview if necessary
      const emailPreview = StringUtils.truncate({
        input: processedEmail,
        maxLength: 30,
      });

      // Assertions
      expect(processedEmail).toBe(
        'Hello, Mary Smith! Your account was created successfully. Your username is mary_smith_2023.',
      );
      expect(emailPreview).toBe('Hello, Mary Smith! Your acc...');
    });

    it('should process a URL slug from an article title', () => {
      // Scenario: Create a URL slug from an article title
      const articleTitle =
        'How to Create Efficient Tests in JavaScript: A Complete Guide';

      // 1. Convert to kebab-case
      const slug = StringUtils.toKebabCase({ input: articleTitle });

      // 2. Truncate if too long
      const truncatedSlug = StringUtils.truncate({
        input: slug,
        maxLength: 50,
      }).replace(/\.\.\.$/g, ''); // Remove the ellipsis if present

      // Assertions
      expect(slug).toBe(
        'how-to-create-efficient-tests-in-java-script-a-complete-guide',
      );
      expect(truncatedSlug.length).toBeLessThanOrEqual(50);
    });
  });

  describe('Chained operations', () => {
    it.skip('should perform a series of transformations on a string', () => {
      // Initial string
      const input = 'This is a TEST string with_underscores and-hyphens';

      // 1. Convert to snake_case
      const snakeCase = StringUtils.toSnakeCase({ input });

      // 2. Convert to camelCase
      const camelCase = StringUtils.toCamelCase({ input: snakeCase });

      // 3. Convert to kebab-case
      const kebabCase = StringUtils.toKebabCase({ input: camelCase });

      // 4. Check whether it is a palindrome (it should not be)
      const isValidPalindrome = StringUtils.isValidPalindrome({
        input: kebabCase,
      });

      // 5. Reverse the string
      const reversed = StringUtils.reverse({ input: kebabCase });

      // 6. Check whether the reversed string is a palindrome (should equal the original reversed)
      const isReversedPalindrome = StringUtils.isValidPalindrome({
        input: kebabCase + reversed,
      });

      // Assertions
      expect(snakeCase).toBe(
        'this_is_a_test_string_with_underscores_and_hyphens',
      );
      expect(camelCase).toBe('thisIsATestStringWithUnderscoresAndHyphens');
      expect(kebabCase).toBe(
        'this-is-atest-string-with-underscores-and-hyphens',
      );
      expect(isValidPalindrome).toBe(false);
      expect(reversed).toBe(
        'snehpyh-dna-serocsrednu-htiw-gnirts-tset-a-si-siht',
      );
      expect(isReversedPalindrome).toBe(true);
    });

    it.skip('should process a text for content analysis', () => {
      // Text for analysis
      const text =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum dolor sit amet, consectetur.';

      // 1. Count occurrences of common words
      const loremCount = StringUtils.countOccurrences({
        input: text,
        substring: 'Lorem',
      });

      const ipsumCount = StringUtils.countOccurrences({
        input: text,
        substring: 'ipsum',
      });

      const dolorCount = StringUtils.countOccurrences({
        input: text,
        substring: 'dolor',
      });

      const sitCount = StringUtils.countOccurrences({
        input: text,
        substring: 'sit',
      });

      const ametCount = StringUtils.countOccurrences({
        input: text,
        substring: 'amet',
      });

      const consecteturCount = StringUtils.countOccurrences({
        input: text,
        substring: 'consectetur',
      });

      // 2. Replace repeated words
      const processedText = StringUtils.replaceOccurrences({
        input: text,
        substring: 'ipsum',
        replacement: '[palavra repetida]',
        occurrences: 1,
      });

      // 3. Truncate for summary
      const summary = StringUtils.truncate({
        input: processedText,
        maxLength: 50,
      });

      // Assertions
      expect(loremCount).toBe(1);
      expect(ipsumCount).toBe(2);
      expect(dolorCount).toBe(2);
      expect(sitCount).toBe(2);
      expect(ametCount).toBe(2);
      expect(consecteturCount).toBe(2);
      expect(processedText).toBe(
        'Lorem [palavra repetida] dolor sit amet, consectetur adipiscing elit. Ipsum dolor sit amet, consectetur.',
      );
      expect(summary).toBe(
        'Lorem [palavra repetida] dolor sit amet, consectetur...',
      );
    });
  });

  describe('Data validation and formatting', () => {
    it('should validate and format a full name', () => {
      // Input data
      const firstName = '  john  ';
      const lastName = 'DOE';

      // 1. Clean and format the name
      const cleanFirstName = firstName.trim();
      const cleanLastName = lastName.trim();

      // 2. Convert to title case
      const formattedFirstName = StringUtils.toTitleCase({
        input: cleanFirstName,
      });
      const formattedLastName = StringUtils.toTitleCase({
        input: cleanLastName,
      });

      // 3. Combine into a full name
      const fullName = `${formattedFirstName} ${formattedLastName}`;

      // 4. Check whether the name is a palindrome (it should not be)
      const isValidPalindrome = StringUtils.isValidPalindrome({
        input: fullName,
      });

      // Assertions
      expect(formattedFirstName).toBe('John');
      expect(formattedLastName).toBe('Doe');
      expect(fullName).toBe('John Doe');
      expect(isValidPalindrome).toBe(false);
    });

    it('should validate and format a product code', () => {
      // Input data
      const productCategory = 'Electronics';
      const productId = '12345';
      const productVariant = 'black-large';

      // 1. Format the category in snake_case
      const formattedCategory = StringUtils.toSnakeCase({
        input: productCategory,
      });

      // 2. Format the variant in camelCase
      const formattedVariant = StringUtils.toCamelCase({
        input: productVariant,
      });

      // 3. Combine into a product code
      const productCode = `${formattedCategory}_${productId}_${formattedVariant}`;

      // 4. Create an alternative code in kebab-case
      const alternativeCode = StringUtils.toKebabCase({
        input: `${productCategory} ${productId} ${productVariant}`,
      });

      // Assertions
      expect(formattedCategory).toBe('electronics');
      expect(formattedVariant).toBe('blackLarge');
      expect(productCode).toBe('electronics_12345_blackLarge');
      expect(alternativeCode).toBe('electronics-12345-black-large');
    });
  });
});
