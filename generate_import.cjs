const fs = require('fs');
const path = require('path');

const base = 'src/data/questions';
const subjects = {
  matematika: 'Matematika',
  tarix: 'Tarix',
  fizika: 'Fizika',
  rustili: 'Rus tili',
  kimyo: 'Kimyo',
  biologiya: 'Biologiya',
  informatika: 'Informatika'
};

let lines = [];

for (const [dir, subj] of Object.entries(subjects)) {
  for (let lv = 1; lv <= 5; lv++) {
    const f = path.join(base, dir, 'level' + lv + '.json');
    if (!fs.existsSync(f)) continue;
    const qs = JSON.parse(fs.readFileSync(f, 'utf8'));
    for (const q of qs) {
      const opts = JSON.stringify(q.options).replace(/'/g, "''");
      const qtext = q.question.replace(/'/g, "''");
      const ans = (q.answer + '').replace(/'/g, "''");
      lines.push(`('${subj}', ${lv}, '${qtext}', '${opts}', '${ans}')`);
    }
  }
}

const sql = 'INSERT INTO questions (subject, level, question, options, answer) VALUES\n' + lines.join(',\n') + ';\n';
fs.writeFileSync('schema_import_questions.sql', sql);
console.log('Generated ' + lines.length + ' question inserts');
