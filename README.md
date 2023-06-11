# ComitGen for VSCode

ComitGen is a VSCode extension that helps you save time writing Git commit messages by using advanced OpenAI technology to automatically generate accurate and descriptive commit messages.

README-EN [README-中文](./README-ZH.md)
## Features

- Automatic generation of commit messages using OpenAI's technology.
- Customizable commit message templates.
- Proxy support for connections to the OpenAI API.
- Predefined template for AngularJS-style commit messages, facilitating adherence to best practices when crafting commits.

## Getting Started
![screenshot](./assets/screenshot.gif)
### Prerequisites

- Visual Studio Code 1.79.0 or later.
- Node.js 16 or later.

### Installation

1. Open Visual Studio Code.
2. Visit the Extensions view (`Ctrl+Shift+X`).
3. Search for "Commit Message AI Generator".
4. Click Install.

### Usage

1. Open your Git repository in VSCode.
2. Make some changes to your code.
3. Open the Source Control view (`Ctrl+Shift+G`).
4. Click on the "Generate commit message" button.

### Settings

- `ComitGen.baseURL`: The base URL for the API. You can also specify a proxy URL if necessary.
- `ComitGen.prompt`: The template for generating prompts to the OpenAI API.
- `ComitGen.assistantPrompt`: The template for responses from the OpenAI API.

## Commands

- `ComitGen.startGenCommitMessage`: Generates a commit message for your changes.
- `ComitGen.setApiKey`: Sets your OpenAI API Key.
- `ComitGen.clearApiKey`: Clears your stored OpenAI API Key.

## Contributing

Any contributions you make are greatly appreciated.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

[wweggplant](mailto:weiainijiujiu@126.com)
Project Link: [https://github.com/wweggplant/ComitGen](https://github.com/wweggplant/ComitGen)

