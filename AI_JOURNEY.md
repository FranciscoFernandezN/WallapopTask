# AI Journey

## AI Assistants Used

I used **OpenCode with Qwen3.7 Plus** as my primary AI assistant throughout the project. It handled code generation and test writing.

## Prompts That Unlocked Something

**"Move all error codes to a shared folder so both frontend and backend can import them"**  
This simple suggestion saved me hours of duplication. I only considered the shared directory pattern for data structure between frontend and backend, and this made error handling consistent across the stack.

**"Use the Wallapop brand image from their website as the header logo"**  
I always struggled with finding proper brand assets. This prompt led me to discover how to extract and use brand images directly from websites, which solved a design blocker quickly.

## Prompts That Didn't Work

**"Add internationalization tags for Spanish and English in the frontend"**  
Initially implemented i18n from scratch with a custom translation system. I had to redirect it to use i18next and react-i18next. The AI assistant didn't prioritize using existing libraries, which led to wasted time and a less maintainable solution.

## When the AI Got It Wrong

I always review AI-generated code, focusing on the frontend logic and backend behavior, especially when there are important decisions that can lead to technical debt in any time soon. I caught this i18n issue because I reviewed the code and, as I have been using internationalization in previous projects, I was able to spot the inconsistency: something that common should never be implemented from scratch.

## What I Don't Fully Understand

The Babel configuration files (`babel.config.js`) needed for Jest to work with TypeScript. I've read the documentation, but the exact interplay between Babel presets, TypeScript compilation, and Jest's module resolution still feels like magic. It works, but I couldn't explain every detail of why it's configured that way.

## What I'd Fix With Four More Hours

The UX needs work. Right now the language detection is automatic with no manual toggle, there's no clear button to reset the form, and the flow isn't as intuitive as it could be. I'd also implement the Docker containerization, the web scraping for price range context, and other production related features that I mentioned in the README.
