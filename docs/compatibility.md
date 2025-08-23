# Compatibility

This document outlines the compatibility of @brmorillo/utils with different environments.

## Node.js Compatibility

| @brmorillo/utils Version | Node.js 14.x | Node.js 16.x | Node.js 18.x | Node.js 20.x |
|-------------------------|--------------|--------------|--------------|--------------|
| 12.0.0                  | ✅           | ✅           | ✅           | ✅           |
| 11.0.0                  | ✅           | ✅           | ✅           | ✅           |
| 10.0.0                  | ✅           | ✅           | ✅           | ❓           |
| < 10.0.0                | ✅           | ✅           | ❓           | ❓           |

✅ = Fully supported and tested  
❓ = Should work but not officially tested  
❌ = Not supported

## Browser Compatibility

@brmorillo/utils is primarily designed for Node.js environments, but many utilities can be used in browsers with appropriate bundling.

### Browser Support

| Feature                 | Chrome | Firefox | Safari | Edge | IE  |
|-------------------------|--------|---------|--------|------|-----|
| Core Utilities          | ✅     | ✅      | ✅     | ✅   | ❌  |
| Crypto Functions        | ✅     | ✅      | ✅     | ✅   | ❌  |
| File Operations         | ❌     | ❌      | ❌     | ❌   | ❌  |
| HTTP Client (Axios)     | ✅     | ✅      | ✅     | ✅   | ❌  |
| HTTP Client (Native)    | ❌     | ❌      | ❌     | ❌   | ❌  |
| Storage (Local)         | ❌     | ❌      | ❌     | ❌   | ❌  |
| Storage (S3)            | ❌     | ❌      | ❌     | ❌   | ❌  |

### Browser Usage Notes

When using @brmorillo/utils in browser environments:

1. **Bundle Size**: Consider using a bundler with tree-shaking to reduce the size by only including the utilities you need.

2. **Polyfills**: Some features may require polyfills for older browsers.

3. **Node.js-specific APIs**: Avoid using utilities that depend on Node.js-specific APIs like `fs`, `crypto`, etc.

4. **Browser-Compatible Subset**:
   - ArrayUtils
   - ObjectUtils
   - StringUtils
   - NumberUtils
   - DateUtils
   - ValidationUtils
   - ConvertUtils

5. **Browser Bundle**:
   ```javascript
   // Example using a bundler like webpack or rollup
   import { ArrayUtils, ObjectUtils, StringUtils } from '@brmorillo/utils/browser';
   
   // Use only browser-compatible utilities
   const uniqueArray = ArrayUtils.removeDuplicates({ array: [1, 2, 2, 3] });
   ```

## Framework Compatibility

| Framework      | Compatibility | Notes                                      |
|----------------|---------------|-------------------------------------------|
| Express        | ✅            | Works well for server-side utilities       |
| NestJS         | ✅            | Full integration support (see examples)    |
| React          | ⚠️            | Use only browser-compatible utilities      |
| Vue            | ⚠️            | Use only browser-compatible utilities      |
| Angular        | ⚠️            | Use only browser-compatible utilities      |
| Next.js        | ✅            | Works in both server and client components |
| Electron       | ✅            | Full support in main and renderer processes|

⚠️ = Partially supported (browser-compatible utilities only)