// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8UWRqDhFyB0z8NoNnuKtufnVHyEax5EE",
  authDomain: "pikapika-a3a6a.firebaseapp.com",
  databaseURL: "https://pikapika-a3a6a.firebaseio.com",
  projectId: "pikapika-a3a6a",
  storageBucket: "pikapika-a3a6a.appspot.com",
  messagingSenderId: "832308665038",
  appId: "1:832308665038:web:059a21861a4444e9634e9f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Создаем переменную, в которую положим кнопку меню
const menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
const menu = document.querySelector('.sidebar');
const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const loginSignin = document.querySelector('.login-signin');
const loginForget = document.querySelector('.login-forget');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const iconExit = document.querySelector('.icon-exit');
const iconEdit = document.querySelector('.icon-edit');
const editContainer = document.querySelector('.edit-container');
const editForm = document.querySelector('.edit-user-form');
const displayNameInput = document.querySelector('.edit-display-name');
const userpicInput = document.querySelector('.edit-userpic');
const userpicElem = document.querySelector('.user-avatar');
const postsWrapper = document.querySelector('.posts');
const closeButton = document.querySelector('.close');
const buttonNewPost = document.querySelector('.button-new-post');
const newPostModal = document.querySelector('.modal-add-post');
const addPostForm = document.querySelector('.add-post');

const database = firebase.database;

const listUsers = [
  {
    id: '01',
    email: 'max@mail.com',
    password: '123',
    displayName: 'MaxJS',
    userpic: 'https://img3.goodfon.ru/original/320x240/0/8f/koshka-kot-seryy-sidit-vzglyad.jpg',
  },
  {
    id: '02',
    email: 'kate@mail.com',
    password: '123456',
    displayName: 'Kate',
    userpic: 'https://chance2.ru/photo/img/smeshnye-foto-s-kotami-4.jpg',
  }
];

const setUsers = {
  user: null,
  initUser(handler) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
      if (handler) handler();
      console.log(user);
    });
  },

  logIn(email, password, handler) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(err => {
        console.log(err.message);
      })
  },

  logOut() {
    firebase.auth().signOut();
  },

  signUp(email, password, handler) {
    if (!email.trim() || !password.trim()) {
      alert('Введите данные');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(data => {
        this.editUser(email.substring(0, email.indexOf('@')), null, handler);
      })
      .catch(err => {
        const errCode = err.code;
        const errMessage = err.message;

        console.log(errMessage);
      });
    // if (!this.getUser(email)) {
    //   const user = {email, password, displayName: email.substring(0, email.indexOf('@'))};
    //   listUsers.push(user);
    //   this.authorizedUser(user);
    //   handler();
    // } else {
    //   alert('Пользователь с таким e-mail уже зарегистрирован.');
    // }
    // loginForm.reset();
  },

  getUser(email) {
    return listUsers.find(item => item.email === email);
  },

  editUser(displayName, userpic, handler) {

    const user = firebase.auth().currentUser;

    if (displayName) {
      user.updateProfile({
        displayName,
      }).then(handler);
    };
    if (userpic) {
      user.updateProfile({
        userpic,
      }).then(handler);
    }
    handler();
    toggleEdit();
  },

  authorizedUser(user) {
    this.user = user;
  },

  sendForget(email) {
    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
  }
};

const setPosts = {
  allPosts: [
    {
      title: 'Заголовок',
      text: 'Есть над чем задуматься: тщательные исследования конкурентов и по сей день остаются уделом либералов, которые жаждут быть превращены в посмешище, хотя само их существование приносит несомненную пользу обществу. Задача организации, в особенности же социально-экономическое развитие создаёт предпосылки для распределения внутренних резервов и ресурсов.',
      tags: ['свежее', 'горячее', 'мое'],
      author: {displayName: 'Max', userpic: 'https://img3.goodfon.ru/original/320x240/0/8f/koshka-kot-seryy-sidit-vzglyad.jpg'},
      date: '11.11.2020, 20:54:00',
      likes: 45,
      comments: 2,
    }, 
    {
      title: 'Заголовок',
      text: 'С другой стороны, укрепление и развитие внутренней структуры создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса как самодостаточных, так и внешне зависимых концептуальных решений. С учётом сложившейся международной обстановки, существующая теория создаёт предпосылки для прогресса профессионального сообщества.',
      tags: ['отпуск', ' путешествия'],
      author: {displayName: 'Kate', userpic: 'https://chance2.ru/photo/img/smeshnye-foto-s-kotami-4.jpg'},
      date: '21.11.2020, 20:54:00',
      likes: 97,
      comments: 12,
    }, 
  ],

  createPost(item) {
    let postHTML = '';
    postHTML += `<section class="post">
    <div class="post-body">
      <h2 class="post-title">${item.title}</h2>
      <p class="post-text">${item.text}</p>
      <div class="tags">
        ${item.tags.map(tag => '<a href="#" class="tag">' + tag + '</a>').join('')}
      </div>
      <!-- /.tags -->
    </div>
    <!-- /.post-body -->
    <div class="post-footer">
      <div class="post-buttons">
        <button class="post-button likes">
          <svg width="19" height="20" class="icon icon-like">
            <use xlink:href="img/icons.svg#like"></use>
          </svg>
          <span class="likes-counter">${item.likes}</span>
        </button>
        <button class="post-button comments">
          <svg width="21" height="21" class="icon icon-comment">
            <use xlink:href="img/icons.svg#comment"></use>
          </svg>
          <span class="comments-counter">${item.comments}</span>
        </button>
        <button class="post-button save">
          <svg width="19" height="19" class="icon icon-save">
            <use xlink:href="img/icons.svg#save"></use>
          </svg>
        </button>
        <button class="post-button share">
          <svg width="17" height="19" class="icon icon-share">
            <use xlink:href="img/icons.svg#share"></use>
          </svg>
        </button>
      </div>
      <!-- /.post-buttons -->
      <div class="post-author">
        <div class="author-about">
          <a href="#" class="author-username">${item.author.displayName}</a>
          <span class="post-time">${item.date}</span>
        </div>
        <a href="#" class="author-link"><img src="${item.author.userpic}" alt="avatar" class="author-avatar"></a>
      </div>
    </div>
  </section>`

    return postHTML;
  },

  addPost(title, text, tags, handler) {
    if (!setUsers.user) {
      console.error('Нет активного пользователя');
    }
    const post = {
      id: `postID${(+new Date()).toString(16)}`,
      title,
      text,
      tags: tags.split(',').map(item => item.trim()),
      author: {displayName: setUsers.user.displayName, userpic: setUsers.user.userpic || 'img/avatar.jpeg'},
      date: new Date().toLocaleDateString(),
      likes: 0,
      comments: 0,
    };
    this.allPosts.unshift(post);

    database().ref('posts').set(this.allPosts)
      .then(() => this.getPosts(handler));
    addPostForm.reset();
  },

  getPosts(handler) {
    database().ref('posts').once('value', snapshot => {
      console.dir(snapshot.val());
      this.allPosts = snapshot.val() || [];
      if (handler) {
        handler();
      }
      
    })
  }
}

const toggleAuthDom = () => {
  const user = setUsers.user;
  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userpicElem.src = user.userpic || userpicElem.src;
    buttonNewPost.style.display = '';
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.style.display = 'none';
  }
};

const toggleEdit = () => {
  editContainer.classList.toggle('visible');
};

const toggleHidden = (element) => {
  element.classList.toggle('hidden');
}

const showAllPosts = () => {
  let html = '';
  setPosts.allPosts.forEach(item => {
    html += setPosts.createPost(item);
  });
  postsWrapper.innerHTML = html;
}

const init = () => {
  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', function (event) {
  // отменяем стандартное поведение ссылки
    event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  })

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
  });
  
  loginSignup.addEventListener('click', e => {
    e.preventDefault();
    setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
  });
  
  iconExit.addEventListener('click', () => {
    setUsers.logOut(toggleAuthDom);
  });
  
  iconEdit.addEventListener('click', e => {
    e.preventDefault();
    displayNameInput.value = setUsers.user.displayName;
    userpicInput.value = setUsers.user.userpic || '';
    console.log(setUsers.user);
    toggleEdit();
  });
  
  
  
  editContainer.addEventListener('submit', e => {
    e.preventDefault();
    setUsers.editUser(displayNameInput.value, userpicInput.value, toggleAuthDom);
  })

  closeButton.addEventListener('click', e => {
    e.target.closest('.modal-wrapper').classList.add('hidden');
  })

  buttonNewPost.addEventListener('click', e => {
    e.preventDefault();
    toggleHidden(newPostModal);
  })

  // loginForm.elements - получить все данные формы
  addPostForm.addEventListener('submit', e => {
    e.preventDefault();
    //const formElements = [...addPostForm.elements];
    const { title, text, tags } = addPostForm.elements; 

    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
    toggleHidden(newPostModal);
  });

  loginForget.addEventListener('click', e => {
    e.preventDefault();
    if(emailInput.value != '') {
      setUsers.sendForget(emailInput.value);
    }
  })

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);
  // showAllPosts();
  //toggleAuthDom();
}

document.addEventListener('DOMContentLoaded', () => {
  init();
})