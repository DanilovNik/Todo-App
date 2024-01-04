(function () {
  // Создаём пустой массив для объектов каждого нового дела
  let todoArray = [];
  let listName = '';

  // Создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.textContent = title;
    return appTitle;
  }

  // Создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.setAttribute('disabled', 'disabled');
    button.style.cursor = "pointer";
    button.textContent = 'Добавить дело';

    // Тут задаём условие когда кнопка активна/не активна
    input.addEventListener('input', function () {
      if (input.value !== '') {
        button.disabled = false;
      } else {
        button.disabled = true;
      } if (input.value === ' ') {
        input.value = '';
        button.disabled = true;
      }
    })

    buttonWrapper.append(button);
    form.append(input, buttonWrapper);

    return {
      form,
      input,
      button
    };
  }

  // Создаём и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // При введении в input чего-либо, создаём элемент li с двумя кнопками и содержанием из input
  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done == true) {
      item.classList.add('list-group-item-success')
    };

    // Тут добавляем кнопкам события по их нажатию (делаем сделанное дело зелёным, либо удаляем)
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');

      for (const arrayItem of todoArray) {
        if (arrayItem.id == obj.id) {
          arrayItem.done = !arrayItem.done;
        }
        // Сохраняем
        saveTodo(todoArray, listName);
      }
    });

    // Подтверждение удаления
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();

        for (let i = 0; i < todoArray.length; i++) {
          if (todoArray[i].id == obj.id) {
            todoArray.splice(i, 1);
          }
        }
        // Сохраняем
        saveTodo(todoArray, listName);
      }
    })

    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton
    };
  }

  // Создание id
  function getNewId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) {
        max = item.id;
      }
    }
    return max + 1;
  }

  // Функция сохранения
  function saveTodo(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  // Эта функция задаёт параметры при тех или иных условиях
  function createTodoApp(container, title = 'Список дел', keyName) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    // Делаем имя списка глобальным
    listName = keyName;

    container.append(todoAppTitle, todoItemForm.form, todoList);

    let localData = localStorage.getItem(listName);

    if (localData !== null && localData !== '') {
      todoArray = JSON.parse(localData);
    }

    for (const itemList of todoArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener('submit', function (e) {
      // Прерываем действие по умолчанию
      e.preventDefault();

      // Если input пустой - функция завершает свою работу
      if (!todoItemForm.input.value) {
        return;
      }

      // Здесь создаём объект из каждого нового дела
      let newItem = {
        id: getNewId(todoArray),
        name: todoItemForm.input.value,
        done: false
      }

      // Тут мы создаём объект из трёх элементов (текст(введённый в input) и две кнопки)
      let todoItem = createTodoItem(newItem);

      // Здесь добавляем каждую новую запись в массив todoArr
      todoArray.push(newItem);

      // Сохраняем
      saveTodo(todoArray, listName);

      // Здесь добавляем в html созданное дело
      todoList.append(todoItem.item);

      // Тут делаем кнопку выключенной постоянно, если input пустой
      todoItemForm.button.disabled = true;

      // Тут обновляем форму (делаем input пустым и готовым к записи нового дела)
      todoItemForm.input.value = '';
    })
  }

  window.createTodoApp = createTodoApp;
})();
