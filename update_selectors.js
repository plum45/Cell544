const fs = require('fs');
const files = ['gene-expression.html', 'gene-regulation.html', 'cell-signaling.html', 'cell-response.html', 'cell-cycle.html', 'apoptosis.html'];
files.forEach(f => {
  const p = 'topics/' + f;
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes('quiz-hub.html')) {
    html = html.replace('</select>', '  <option value="quiz-hub.html">🏛️ คลังข้อสอบประมวลความรู้ (Exam Hub)</option>\n    </select>');
    fs.writeFileSync(p, html, 'utf8');
    console.log('Updated', f);
  }
});
