/**
 * @typedef {Object} CZCubicsConfig
 * @property {Object} types  The types of the commit can be modified from the defaultTypes
 * @property {boolean} [symbol=false]  A boolean value that allows for an using a unicode value rather than the default of Gitmoji markup in a commit message. The default for symbol is false.
 * @property {string[]} skipQuestions  You can skip the following questions: scope, body, issues, and breaking. The type and subject questions are mandatory.
 * @property {string[]} scopes  An Inquirer.js choices array.
 * @property {Object} questions  An object that contains overrides of the original questions
 * @property {number} [subjectMaxLength=100]  The maximum length you want your subject has
 * @property {string} [headFormat="{emoji} {type}{scope}: {subject}"]  The format of the head following conventional commits "{emoji} {type}{scope}: {subject}"
 */
