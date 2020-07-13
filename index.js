const inquirer = require("inquirer");
const fs = require("fs");

let filenameStr;

console.log("We'll generate a good README for you - we just need you to fill out the following fields.");

function compileFile(response) {     
    let tableContents = `\n[Installation](#installation)\n[Usage](#usage)`

    let readmeContents;

    if (response.github) {
        tableContents = tableContents + "\n[Contributing](#contributing)";
    }
    if (response.testFramework) {
        tableContents = tableContents + "\n[Tests](#tests)";
    }
    if (response.email && response.confirmContact) {
        tableContents = tableContents + "\n[Questions](#questions)";
    }

    readmeContents = `\n# ${response.title}\n\n${response.description}\n\n## Table of Contents\n${tableContents}\n\n## Installation\n\n${response.install}\n\n## Usage\n\n${response.usage}`;

    if (response.github) {
        readmeContents += `\n\n## Contributing\n\nIf you would like to contribute to the project, please contact the developer and ask for access to the repository at github.com/${response.github}`;
    }

    if (response.testFramework) {
        readmeContents += `\n\n## Tests\n\nTesting is done using the ${response.testFramework} framework. Use 'npm test' in the console for testing.`;
    }

    if (response.email && response.confirmContact) {
        readmeContents += `\n\n## Questions\n\nIf you have any questions, comments, or concerns about this project, feel free to message the developer at ${response.email}`;
    }

    if (response.htmlBadge && response.jsBadge) {
        readmeContents += `\n\n[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)\n[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)`;
    }
    else if (response.htmlBadge) {
        readmeContents += `\n\n[![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com)`;
    }
    else if (response.jsBadge) {
        readmeContents += `\n\n[![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)`;
    }

    return readmeContents;
}

inquirer
  .prompt([
      {
          type: "input",
          message: "Project title:",
          name: "title"
      },
      {
          type: "input",
          message: "Provide a brief description of your project:",
          name: "description"
      },
      {
          type: "input",
          message: "Explain how to install your project (for a normal user):",
          name: "install"
      },
      {
          type: "input",
          message: "Explain how to use your project (for a normal user):",
          name: "usage"
      },
      {
          type: "input",
          message: "What is your Github username? (blank if N/A)",
          name: "github"
      },
      {
          type: "input",
          message: "What is your current professional e-mail address? (blank if N/A)",
          name: "email"
      },
      {
          type: "confirm",
          message: "Allow people to contact you if they want to contribute to the project?",
          name: "confirmContact"
      },
      {
          type: "input",
          message: "What framework are you using for testing? (blank if N/A)",
          name: "testFramework"
      },
      {
          type: "input",
          message: "What would you like to name your README file?",
          name: "fileName"
      },
      {
          type: "confirm",
          message: "Does your project use HTML5?",
          name: "htmlBadge"
      },
      {
          type: "confirm",
          message: "Does your project use Javascript?",
          name: "jsBadge"
      }
  ]).then(function(response) {
    console.log(response);

    let readmeContents = compileFile(response);
    filenameStr = (response.fileName).trim();

    if (filenameStr == "") {
        filenameStr = "README";
    }
    else if (filenameStr.includes(".")) {
        let splitStr = filenameStr.split(".")
        filenameStr = splitStr[0];
    }

    fs.writeFile(`${filenameStr}.md`, readmeContents, function(err) {
        if (err) {
            return console.log(err);
        }
        else {
            console.log(`Your README file has been successfuly created! (${filenameStr})`);
        }
    });
  });