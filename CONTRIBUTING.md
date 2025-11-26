# Contributing to Trelix

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions.

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)

## I Have a Question

If you want to ask a question, we assume that you have read the available [Documentation](README.md).

Before you ask a question, it is best to search for existing [Issues](https://github.com/yourusername/trelix/issues) that might help you. In case you've found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

## I Want To Contribute

### Reporting Bugs

- Make sure that you are using the latest version.
- Read the documentation carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a search to see if the bug has already been reported.
- If the issue has not been reported, open a new issue.

### Suggesting Enhancements

- Open a new issue.
- Describe the enhancement and why it is needed.

### Your First Code Contribution

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/your-username/trelix.git
    cd trelix
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
5.  **Make your changes** and commit them:
    ```bash
    git commit -m "feat: add amazing feature"
    ```
6.  **Push to your fork**:
    ```bash
    git push origin feature/amazing-feature
    ```
7.  **Open a Pull Request** on GitHub.

## Styleguides

### Commit Messages

- Use the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

## Development Setup

This project uses:
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

Run the development server:
```bash
npm run dev
```
