const fs = require('fs');

// Load EN template
const enJson = JSON.parse(fs.readFileSync('./EN.json', 'utf-8'));

// Load extracted text from scrape.js
const extractedRaw = JSON.parse(fs.readFileSync('./output.json', 'utf-8'));
// 🛠️ Flatten all `texts` from each route into a single array of strings
const extractedData = extractedRaw.flatMap(entry => entry.texts);


// Helper: try to match placeholder template to real text
function fillTemplate(template, candidates) {
  const templateClean = template.replace('%1', '').trim();

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;

    const trimmed = candidate.trim();

    // Exact match
    if (trimmed === templateClean) {
      return { full: trimmed, value: null };
    }

    // Prefix match: e.g., "Model RBG330"
    if (trimmed.startsWith(templateClean)) {
      const extracted = trimmed.slice(templateClean.length).trim();
      return { full: trimmed, value: extracted };
    }

    // Regex match if template has %1
    if (template.includes('%1')) {
      const regexPattern = template
        .replace('%1', '(.*?)')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace('\\(.*?)', '(.*?)'); // restore (.*?) part

      const regex = new RegExp(`^${regexPattern}$`);
      const match = trimmed.match(regex);
      if (match) {
        return { full: trimmed, value: match[1].trim() };
      }
    }
  }

  return { full: null, value: null };
}

// Fill entries
const filled = enJson.map(entry => {
    const result = fillTemplate(entry.name, extractedData);
    return {
    ...entry,
    filledText: typeof result === 'string' ? result : result?.full || entry.name,
    value: result?.value || null
    };
});

// Save result
fs.writeFileSync('./filled_en.json', JSON.stringify(filled, null, 2), 'utf-8');
console.log('✅ filled_en.json created');
