// دعم تسجيل الدخول وإنشاء الحساب وتقديم الطلبات وإدارة الطلبات
// حساب المدير: اسم المستخدم admin وكلمة السر admin1234

// حفظ واسترجاع المستخدمين
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
// حفظ واسترجاع الطلبات
function getOrders() {
  return JSON.parse(localStorage.getItem('orders') || '[]');
}
function setOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}
// حفظ واسترجاع الردود
function getReplies() {
  return JSON.parse(localStorage.getItem('replies') || '{}');
}
function setReplies(replies) {
  localStorage.setItem('replies', JSON.stringify(replies));
}
// المستخدم الحالي
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// تسجيل حساب جديد
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    const msg = document.getElementById('registerMsg');
    if (password !== confirm) {
      msg.textContent = 'كلمتا المرور غير متطابقتين';
      return;
    }
    let users = getUsers();
    if (users.find(u => u.username === username)) {
      msg.textContent = 'اسم المستخدم مستخدم بالفعل';
      return;
    }
    const newUser = {username, email, password, isAdmin: false};
    users.push(newUser);
    setUsers(users);
    setCurrentUser(newUser);
    msg.style.color = 'green';
    msg.textContent = 'تم إنشاء الحساب بنجاح!';
    setTimeout(() => window.location.href = 'index.html', 800);
  };
}

// تسجيل الدخول
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMsg');
    // حساب المدير للطلبات
    if (username === 'kkhh134567890@gmail.com' && password === 'khalid123kh') {
      setCurrentUser({username: 'kkhh134567890@gmail.com', isAdmin: true});
      window.location.href = 'admin.html';
      return;
    }
    // حساب التعديل السري
    if (username === 'kkhhaalliidd@gmail.com' && password === 'khalid123kh') {
      setCurrentUser({username: 'kkhhaalliidd@gmail.com', isAdmin: true});
      window.location.href = 'admin_home.html';
      return;
    }
    let users = getUsers();
    let user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (user) {
      setCurrentUser(user);
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = 'بيانات الدخول غير صحيحة';
    }
  };
}

// تقديم الطلب (إلزام تسجيل الدخول)
if (document.getElementById('orderForm')) {
  const user = getCurrentUser();
  if (!user) {
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('orderLoginMsg').textContent = 'يجب تسجيل الدخول أولاً لتقديم طلب.';
  } else {
    document.getElementById('orderForm').onsubmit = function(e) {
      e.preventDefault();
      const serviceName = document.getElementById('serviceName').value.trim();
      const serviceDetails = document.getElementById('serviceDetails').value.trim();
      const serviceCountry = document.getElementById('serviceCountry').value;
      const servicePhone = document.getElementById('servicePhone').value.trim();
      let orders = getOrders();
      orders.push({
        username: user.username,
        serviceName,
        serviceDetails,
        serviceCountry,
        servicePhone,
        date: new Date().toLocaleString(),
        id: Date.now()
      });
      setOrders(orders);
      document.getElementById('orderMsg').textContent = 'تم إرسال الطلب بنجاح!';
      document.getElementById('orderForm').reset();
    };
  }
}

// لوحة بيانات العميل (عرض الردود)
if (document.getElementById('userInfo')) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
  } else {
    document.getElementById('userInfo').innerHTML = `<b>اسم المستخدم:</b> ${user.username}<br><b>البريد الإلكتروني:</b> ${user.email || '-'}<br>`;
    // عرض الطلبات الخاصة به
    let orders = getOrders().filter(o => o.username === user.username);
    let replies = getReplies();
    let myOrders = document.getElementById('myOrders');
    if (orders.length === 0) {
      myOrders.innerHTML = '<li>لا توجد طلبات بعد.</li>';
    } else {
      myOrders.innerHTML = orders.map(o => {
        let reply = replies[o.id] ? `<div style='color:#3b82f6; margin-top:6px;'><b>رد الإدارة:</b> ${replies[o.id]}</div>` : '';
        return `<li><b>${o.serviceName}</b> - ${o.serviceDetails}<br>الدولة: ${o.serviceCountry || '-'}<br>رقم الجوال: ${o.servicePhone}<br>بتاريخ: ${o.date}${reply}</li>`;
      }).join('');
    }
  }
}

// زر تسجيل الخروج
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').onclick = function(e) {
    e.preventDefault();
    logout();
  };
}

// صفحة الإدارة (عرض الحسابات والرد على الطلبات)
if (document.getElementById('adminLoginForm')) {
  document.getElementById('adminLoginForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const msg = document.getElementById('adminLoginMsg');
    if (username === 'kkhh134567890@gmail.com' && password === 'khalid123kh') {
      setCurrentUser({username: 'kkhh134567890@gmail.com', isAdmin: true});
      document.getElementById('adminLoginSection').style.display = 'none';
      document.getElementById('adminOrdersSection').style.display = 'block';
      showAllOrders();
    } else {
      msg.textContent = 'بيانات المدير غير صحيحة';
    }
  };
  // إذا كان المدير مسجل دخوله بالفعل
  const user = getCurrentUser();
  if (user && user.isAdmin && user.username === 'kkhh134567890@gmail.com') {
    document.getElementById('adminLoginSection').style.display = 'none';
    document.getElementById('adminOrdersSection').style.display = 'block';
    showAllOrders();
  }
}
function showAllOrders() {
  let orders = getOrders();
  let allOrders = document.getElementById('allOrders');
  let replies = getReplies();
  if (orders.length === 0) {
    allOrders.innerHTML = '<li>لا توجد طلبات بعد.</li>';
  } else {
    allOrders.innerHTML = orders.map(o => {
      let replyBox = `<form onsubmit="event.preventDefault(); replyToOrder(${o.id}, this.reply.value)">
        <input type='text' name='reply' placeholder='اكتب الرد هنا...' value='${replies[o.id] ? replies[o.id] : ''}' style='width:70%;padding:4px;border-radius:6px;border:1px solid #a259e6;'>
        <button type='submit' class='btn-main' style='width:25%;padding:4px 0;font-size:0.95em;'>إرسال</button>
      </form>`;
      let replyText = replies[o.id] ? `<div style='color:#3b82f6;'><b>رد الإدارة:</b> ${replies[o.id]}</div>` : '';
      return `<li style='margin-bottom:18px;'><b>${o.serviceName}</b> - ${o.serviceDetails}<br>الدولة: ${o.serviceCountry || '-'} | العميل: ${o.username} | رقم الجوال: ${o.servicePhone}<br>بتاريخ: ${o.date}${replyText}${replyBox}</li>`;
    }).join('');
  }
  // عرض الحسابات المسجلة
  let users = getUsers();
  let allUsers = document.getElementById('allUsers');
  if (users.length === 0) {
    allUsers.innerHTML = '<li>لا يوجد حسابات مسجلة.</li>';
  } else {
    allUsers.innerHTML = users.map(u => `<li><b>${u.username}</b><br>البريد: ${u.email || '-'}<br></li>`).join('');
  }
}
// دالة الرد على الطلب
window.replyToOrder = function(orderId, replyText) {
  let replies = getReplies();
  replies[orderId] = replyText;
  setReplies(replies);
  showAllOrders();
};

// صفحة الإدارة
if (document.getElementById('adminLoginForm')) {
  document.getElementById('adminLoginForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    const msg = document.getElementById('adminLoginMsg');
    if (username === 'kkhh134567890@gmail.com' && password === 'khalid123kh') {
      setCurrentUser({username: 'kkhh134567890@gmail.com', isAdmin: true});
      document.getElementById('adminLoginSection').style.display = 'none';
      document.getElementById('adminOrdersSection').style.display = 'block';
      showAllOrders();
    } else {
      msg.textContent = 'بيانات المدير غير صحيحة';
    }
  };
  // إذا كان المدير مسجل دخوله بالفعل
  const user = getCurrentUser();
  if (user && user.isAdmin && user.username === 'kkhh134567890@gmail.com') {
    document.getElementById('adminLoginSection').style.display = 'none';
    document.getElementById('adminOrdersSection').style.display = 'block';
    showAllOrders();
  }
} 