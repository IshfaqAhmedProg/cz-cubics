function formatIssues(issues) {
  return issues
    ? "Closes " + (issues.match(/#\d+/g) || []).join(", closes ")
    : "";
}
module.exports = formatIssues;
