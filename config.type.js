/**
 * @typedef {Object} CZCubicsConfig
 * @property {CZCubicsCommitType[]} types  The types of the commit can be modified from the defaultTypes
 * @property {string[]} skipQuestions  You can skip the following questions: scope, body, issues, and breaking. The type and subject questions are mandatory.
 * @property {string[]} scopes  An Inquirer.js choices array containing predefined scopes to choose from.
 * @property {Object} questions  An object that contains overrides of the original questions
 * @property {number} [subjectMaxLength=100]  The maximum length you want your subject has
 * @property {string} [headFormat="{emoji} {type}{scope}: {subject}"]  The format of the head following conventional commits "{emoji} {type}{scope}: {subject}"
 */

/**
 * @typedef {Object} CZCubicsCommitType
 * @property {string} [emoji=""]  The emoji of the type of commit
 * @property {string} description  The description of the type of commit
 * @property {string} name  The name of the type of commit
 */

/**
 * @typedef {"emoji"|"type"|"scope"|"subject"} CZCubicsHeaderTokens
 */
