const books = [];
const STORAGE_KEY = "BOOKSHELF_APPS";
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const DELETE_EVENT = "delete-book";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local stroage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generateId() {
  return +new Date();
}

document.addEventListener(SAVED_EVENT, function () {
  alert("Berhasil Menyimpan data");
});

document.addEventListener(DELETE_EVENT, function () {
  alert("Berhasil Menghapus Buku");
});

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookID) {
  for (const book of books) {
    if (book.id === bookID) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  const judulText = document.createElement("h4");
  judulText.innerText = title;

  const penulisText = document.createElement("p");
  penulisText.innerText = author;

  const tahunTerbitText = document.createElement("p");
  tahunTerbitText.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("containerText");
  textContainer.append(judulText, penulisText, tahunTerbitText);

  const container = document.createElement("div");
  container.classList.add("book");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isComplete) {
    const belumBacaButton = document.createElement("button");
    belumBacaButton.classList.add("belum_dibaca");
    belumBacaButton.innerText = "Belum dibaca";
    belumBacaButton.addEventListener("click", function () {
      removeBookFromComplete(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("delete_book");
    trashButton.innerText = "Hapus Buku";
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    container.append(belumBacaButton, trashButton);
  } else {
    const sudahBacaButton = document.createElement("button");
    sudahBacaButton.classList.add("sudah_dibaca");
    sudahBacaButton.innerText = "Sudah dibaca";
    sudahBacaButton.addEventListener("click", function () {
      addBookToComplete(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("delete_book");
    trashButton.innerText = "Hapus Buku";
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    container.append(sudahBacaButton, trashButton);
  }

  return container;
}

function addBook() {
  const judulBuku = document.getElementById("judul").value;
  const penulis = document.getElementById("penulis").value;
  const tahunTerbit = parseInt(document.getElementById("tahun").value);
  const isCompleted = document.getElementById("isComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    judulBuku,
    penulis,
    tahunTerbit,
    isCompleted
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(todoId) {
  const bookTarget = findBookIndex(todoId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteNotifiaction();
}

function removeBookFromComplete(todoId) {
  const todoTarget = findBook(todoId);

  if (todoTarget == null) return;
  todoTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchData() {
  const query = document.getElementById("searchBooks").value.toLowerCase();
  const result = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );
  displaySearchData(result);
}

function displaySearchData(results) {
  const rakBelumDibaca = document.getElementById("belum_dibaca");
  const rakSudahDibaca = document.getElementById("sudah_dibaca");

  rakBelumDibaca.innerHTML = "";
  rakSudahDibaca.innerHTML = "";

  for (const result of results) {
    const bookElement = makeBook(result);
    if (result.isComplete) {
      rakSudahDibaca.append(bookElement);
    } else {
      rakBelumDibaca.append(bookElement);
    }
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  const searchSubmit = document.getElementById("search_input");

  if (searchSubmit !== "") {
    searchSubmit.addEventListener("click", function (event) {
      event.preventDefault();
      searchData();
    });
  } else {
    searchSubmit.addEventListener("click", function (event) {
      event.preventDefault();
      document.dispatchEvent(new Event(RENDER_EVENT));
    });
  }
});

document.addEventListener("DOMContentLoaded", function (event) {
  const formSubmit = document.getElementById("form");

  formSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

document.addEventListener(RENDER_EVENT, function () {
  const rakBelumDibaca = document.getElementById("belum_dibaca");
  const rakSudahDibaca = document.getElementById("sudah_dibaca");

  rakBelumDibaca.innerHTML = "";
  rakSudahDibaca.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      rakSudahDibaca.append(bookElement);
    } else {
      rakBelumDibaca.append(bookElement);
    }
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function deleteNotifiaction() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETE_EVENT));
  }
}
