// ── Part 4, Step 7: Load All Students ──────────────────────────────
// ── Part 4, Step 8: Single Student Lookup ─────────────────────────

fetch('/api/ic21/students')
    .then(response => response.json())
    .then(students => {
        const studentList = document.getElementById('student-list');
        studentList.innerHTML = '';
        students.forEach(student => {
            const li = document.createElement('li');
            li.textContent = `${student.first_name} ${student.last_name}`;
            studentList.appendChild(li);
        });
    });

document.getElementById('lookup-btn').addEventListener('click', () => {
    const id = document.getElementById('student-id-input').value;
    const detail = document.getElementById('student-detail');
    const notFound = document.getElementById('student-not-found');

    fetch(`/api/ic21/students/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.message === 'Student not found') {
                detail.classList.add('hidden');
                notFound.classList.remove('hidden');
            } else {
                notFound.classList.add('hidden');
                detail.classList.remove('hidden');
                document.getElementById('detail-id').textContent = data.id;
                document.getElementById('detail-first').textContent = data.first_name;
                document.getElementById('detail-last').textContent = data.last_name;
                document.getElementById('detail-class').textContent = data.classification;
                document.getElementById('detail-major').textContent = data.major;
                notFound.classList.add('hidden');
                detail.classList.remove('hidden');
            }
        })
});
