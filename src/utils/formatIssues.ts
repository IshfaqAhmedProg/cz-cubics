export default function formatIssues(issues?: string): string {
  return issues ? `Closes ${issues.match(/#\d+/g)?.join(", closes ") ?? ""}` : "";
}
