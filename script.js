
let todoList = JSON.parse(localStorage.getItem('myTodos')) || [
    { id: 1, date: "2026-01-06", text: "晚上去買牛奶", completed: false },
    { id: 2, date: "2026-01-06", text: "明晚要去買電視", completed: true }
    // 留點假資料讓初使畫面有內容
];
let filteredList = [...todoList]; // 用來存放過濾後的結果
let currentFilter = 'all'; // 當前的狀態篩選：'all', 'completed', 'uncompleted'

function saveToLocal() {
    localStorage.setItem('myTodos', JSON.stringify(todoList));
}

function render() {
    const container = document.getElementById('todo-container');
    if (!container) return;

    container.innerHTML = filteredList.map(item => `
        <li class="content-box ${item.completed ? 'completed' : ''}" data-id="${item.id}">
            <!--  <input type="checkbox" onchange="toggleTodo(${item.id})" ${item.completed ? 'checked' : ''}> -->
            <!--暫時取消勾選框，之後要全選之類的再開 -->
            <div class="left-side">
                <span>${item.date}</span>
                <span style="text-decoration: ${item.completed ? 'line-through' : 'none'}">${item.text}</span>
            </div>

            <div class="right-side">
                <button class="btn" onclick="changeTodo(${item.id})">
                標記為${item.completed ? '未完成' : '已完成'}
                </button>
                <span >狀態: ${item.completed ? '✅' : '❌'}</span>
                <button class="btn" onclick="deleteTodo(${item.id})">刪除</button>
            </div>
        </li>
    `).join('');

    saveToLocal();
}

// 增
window.addTodo = () => {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();

    if (text === "") {
        alert("請輸入內容！");
        return;
    }

    // 取得當下時間
    const now = new Date();
    const dateString = now.toLocaleDateString('en-CA'); // 格式化為 YYYY-MM-DD
    const newTodo = {
        id: Date.now(), // 唯一 ID
        date: dateString,
        text: text,
        completed: false
    };

    todoList.push(newTodo);
    input.value = ""; // 清空輸入框
    applyFilter();
};

window.toggleTodo = (id) => {
    const item = todoList.find(t => t.id === id);
    if (item) item.completed = !item.completed;
    applyFilter();
};

window.changeTodo = (id) => {
    const item = todoList.find(t => t.id === id);
    if (item) item.completed = !item.completed;
    applyFilter();
};

window.deleteTodo = (id) => {
    if (confirm("確定要刪除嗎？")) {
        todoList = todoList.filter(t => t.id !== id);
        render();
    }
};

// 1.全刪包含初始假資料
// window.delAll = () => {
//     if (confirm("確定要清空全部待辦事項嗎？")) {
//         todoList = []; // 1. 把記憶體裡的陣列清空
//         render();      // 2. 重新渲染 (這會自動執行 saveToLocal 覆蓋掉 localStorage)
//     }
// };
// 2.全刪但留下初始假資料
window.delAll = () => {
    if (confirm("確定要清空全部待辦事項嗎？")) {
        localStorage.removeItem('myTodos');
        location.reload();
    }
};
// 套用狀態篩選
function applyFilter() {
    if (currentFilter === 'all') {
        filteredList = [...todoList];
    } else if (currentFilter === 'completed') {
        filteredList = todoList.filter(item => item.completed === true);
    } else if (currentFilter === 'uncompleted') {
        filteredList = todoList.filter(item => item.completed === false);
    }
    
    render();
}

// 按狀態篩選
window.filterByStatus = (status) => {
    currentFilter = status;
    
    // 更新按鈕的 active 狀態
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (status === 'all') {
        buttons[0].classList.add('active');
    } else if (status === 'completed') {
        buttons[1].classList.add('active');
    } else if (status === 'uncompleted') {
        buttons[2].classList.add('active');
    }
    
    applyFilter();
};

// 初始化執行
applyFilter();
