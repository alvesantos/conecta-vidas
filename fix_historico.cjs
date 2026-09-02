const fs = require('fs');

function fix(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix columns: { key: ..., label: ... } -> { accessorKey: ..., header: ... }
  content = content.replace(/\{ key: 'date', label: 'Data e Hora' \}/, "{ accessorKey: 'date', header: 'Data e Hora' }");
  content = content.replace(/\{ key: 'patient_name', label: 'Paciente' \}/, "{ accessorKey: 'patient_name', header: 'Paciente' }");
  content = content.replace(/\{ key: 'tutor_name', label: 'Paciente' \}/, "{ accessorKey: 'tutor_name', header: 'Paciente' }");
  content = content.replace(/\{ key: 'status', label: 'Status' \}/, "{ accessorKey: 'status', header: 'Status' }");

  // Fix slot names: #XXX-data -> #XXX-cell
  content = content.replace(/#date-data/g, "#date-cell");
  content = content.replace(/#patient_name-data/g, "#patient_name-cell");
  content = content.replace(/#tutor_name-data/g, "#tutor_name-cell");
  content = content.replace(/#status-data/g, "#status-cell");

  // Fix row access: row.XXX -> row.original.XXX
  content = content.replace(/row\.date/g, "row.original.date");
  content = content.replace(/row\.time/g, "row.original.time");
  content = content.replace(/row\.patient_name/g, "row.original.patient_name");
  content = content.replace(/row\.tutor_name/g, "row.original.tutor_name");
  content = content.replace(/row\.pet_name/g, "row.original.pet_name");
  content = content.replace(/row\.status/g, "row.original.status");

  // Fix colors in statusColor
  content = content.replace(/return 'green'/, "return 'success'");
  content = content.replace(/return 'blue'/, "return 'info'");
  content = content.replace(/return 'red'/, "return 'error'");
  content = content.replace(/return 'gray'/, "return 'neutral'");

  // Fix UTable props
  // <UTable :rows="rows" :columns="columns"
  content = content.replace(/<UTable :rows="rows" :columns="columns"/, "<UTable :data=\"rows\" :columns=\"columns\"");

  // Fix loading
  // add :loading="pending"
  content = content.replace(/<div v-if="pending" class="py-8 flex justify-center">[\s\S]*?<\/div>\s*<div v-else>/, "<div v-if=\"false\"></div><div v-else>");

  fs.writeFileSync(filePath, content);
}

fix('app/pages/painel/medico/historico.vue');
fix('app/pages/painel/veterinario/historico.vue');
console.log('Fixed historico files.');
