export const baseModules = [
    // triggers
    { type: "Webhook Trigger", description: "Start workflow when webhook is called", category: "Trigger", icon: "zap", isTrigger: true },
    { type: "Schedule Trigger", description: "Run workflow on a time schedule", category: "Trigger", icon: "clock", isTrigger: true },
    { type: "Event Trigger", description: "Start workflow on specific event", category: "Trigger", icon: "activity", isTrigger: true },
    // integrations
    { type: "Slack Integration", description: "Post/read Slack channels", category: "Integration", icon: "bell" },
    { type: "Google Sheets", description: "Read/write data to Google Sheets", category: "Integration", icon: "database" },
    { type: "Salesforce", description: "Sync leads in Salesforce", category: "Integration", icon: "user" },
    { type: "Mailchimp", description: "Manage mailing lists in Mailchimp", category: "Integration", icon: "mail" },
    // input
    { type: "File Ingestor", description: "Handles user uploads (PDF, DOCX, CSV...)", category: "Input", icon: "folder" },
    { type: "OCR / PDF Extractor", description: "Convert PDF to text", category: "Input", icon: "file-text" },
    { type: "Transcriber", description: "Converts audio to text", category: "Input", icon: "mic" },
    { type: "Web Scraper", description: "Scrapes content from websites", category: "Input", icon: "globe" },
    // processing
    { type: "Text Segmenter", description: "Break text into chunks for analysis", category: "Processing", icon: "scissors" },
    // AI
    { type: "LLM Analyzer", description: "GPT prompt runner with templates", category: "AI", icon: "brain" },
    { type: "Topic Extractor", description: "Extract topics, keywords, etc.", category: "AI", icon: "tag" },
    { type: "NER / Skill Extractor", description: "Extract named entities or skills", category: "AI", icon: "user" },
    // data
    { type: "Vector Matcher", description: "Compare text to DB (jobs, etc.)", category: "Data", icon: "filter" },
    // output
    { type: "Summarizer", description: "Turns long content into short summary", category: "Output", icon: "file-text" },
    { type: "Email Generator", description: "Fills email template with context", category: "Output", icon: "mail" },
    { type: "DB Writer", description: "Save results to DB (Notion, etc.)", category: "Output", icon: "database" },
    { type: "Notifier", description: "Sends Slack/email notifications", category: "Output", icon: "bell" },
    // control
    { type: "If Condition", description: "Branch workflow if condition met", category: "Control", icon: "git-branch", isConditional: true },
    { type: "Else Path", description: "Alternative path if If Condition fails", category: "Control", icon: "corner-down-right", isConditional: true }
  ];
export type Module = typeof baseModules[number];
export type ModuleType = Module["type"];  