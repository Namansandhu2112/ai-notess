let notes = [];
let currentQuestionIndex = 0;

const navHome = document.getElementById('nav-home');
const navNotes = document.getElementById('nav-notes');
const navQuiz = document.getElementById('nav-quiz');

const homeSection = document.getElementById('home-section');
const notesSection = document.getElementById('notes-section');
const quizSection = document.getElementById('quiz-section');

const searchInput = document.getElementById('search-input');
const notesList = document.getElementById('notes-list');

const quizContainer = document.getElementById('quiz-container');
const nextQuestionBtn = document.getElementById('next-question');
const quizResult = document.getElementById('quiz-result');

function showSection(section) {
  homeSection.classList.add('hidden');
  notesSection.classList.add('hidden');
  quizSection.classList.add('hidden');

  navHome.classList.remove('active');
  navNotes.classList.remove('active');
  navQuiz.classList.remove('active');

  if (section === 'home') {
    homeSection.classList.remove('hidden');
    navHome.classList.add('active');
  } else if (section === 'notes') {
    notesSection.classList.remove('hidden');
    navNotes.classList.add('active');
  } else if (section === 'quiz') {
    quizSection.classList.remove('hidden');
    navQuiz.classList.add('active');
    startQuiz();
  }
}

navHome.addEventListener('click', (e) => {
  e.preventDefault();
  showSection('home');
});

navNotes.addEventListener('click', (e) => {
  e.preventDefault();
  showSection('notes');
});

navQuiz.addEventListener('click', (e) => {
  e.preventDefault();
  showSection('quiz');
});

// Load notes from JSON file
fetch('notes.json')
  .then(response => response.json())
  .then(data => {
    notes = data;
    renderNotes(notes);
  })
  .catch(err => console.error('Failed to load notes:', err));

function renderNotes(noteArray) {
  notesList.innerHTML = '';
  noteArray.forEach((note, i) => {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.innerHTML = `
      <div class="note-title">${note.noteTitle}</div>
      <div class="note-content">${note.noteContent}</div>
    `;

    noteDiv.addEventListener('click', () => {
      noteDiv.classList.toggle('expanded');
    });

    notesList.appendChild(noteDiv);
  });
}

// Search notes live
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredNotes = notes.filter(note => 
    note.noteTitle.toLowerCase().includes(query) || note.noteContent.toLowerCase().includes(query));
  renderNotes(filteredNotes);
});

// Quiz logic

function startQuiz() {
  currentQuestionIndex = 0;
  quizResult.classList.add('hidden');
  nextQuestionBtn.classList.add('hidden');
  showQuestion();
}

function showQuestion() {
  quizContainer.innerHTML = '';

  if (currentQuestionIndex >= notes.length) {
    quizContainer.innerHTML = '<p>Quiz complete!</p>';
    quizResult.textContent = `You answered all questions!`;
    quizResult.classList.remove('hidden');
    nextQuestionBtn.classList.add('hidden');
    return;
  }

  const current = notes[currentQuestionIndex];

  const questionEl = document.createElement('p');
  questionEl.textContent = current.question;
  quizContainer.appendChild(questionEl);

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Your answer here';
  quizContainer.appendChild(input);

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit';
  quizContainer.appendChild(submitBtn);

  submitBtn.addEventListener('click', () => {
    const answer = input.value.trim().toLowerCase();
    if (!answer) return alert('Please enter an answer.');

    if (answer === current.answer.toLowerCase()) {
      quizResult.textContent = 'Correct!';
      quizResult.style.color = 'green';
    } else {
      quizResult.textContent = `Wrong! Correct answer: ${current.answer}`;
      quizResult.style.color = 'red';
    }
    quizResult.classList.remove('hidden');
    nextQuestionBtn.classList.remove('hidden');
    submitBtn.disabled = true;
    input.disabled = true;
  });
}

nextQuestionBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  quizResult.classList.add('hidden');
  nextQuestionBtn.classList.add('hidden');
  showQuestion();
});

// Start on home page
showSection('home');
